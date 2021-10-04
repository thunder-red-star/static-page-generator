const fs = require("fs")
const readline = require('readline');

files = fs.readdirSync("./in")

files = files.filter(f => f.split(".").pop().toLowerCase() === "txt");

let delimiters = {
    "bold": ["**", "__"],
    "italic": ["*", "_"],
    "code": ["`"],
    "strikethrough": ["~~"],
}

let delimiterReplacements = {
    "bold": "strong",
    "italic": "em",
    "code": "code",
    "strikethrough": "strike"
}

function toHTML(lines) {
    out = new Array
    lines.forEach(line => {
        res = scan(line)
        out.push(res)
    })
    return out
}

function checkHeaders(line) {
    let level = 0
    if (line.startsWith(">")) {
        line.split("").slice(0, 5).forEach(el => {
            if (el == ">") {
                level += 1
            }
        })
        return "<h" + level + ">" + line.split("# ").slice(1) + "</h" + level + ">"
    }
    else {
        return line
    }
}

function checkFormats(line) {
    Object.keys(delimiters).forEach(format => {
        delimiters[format].forEach((e) => {
            splits = line.split(e)
            for (x = 1; x < splits.length; x += 2) {
                splits[x] = "<" + delimiterReplacements[format] + ">" + splits[x] + "</" + delimiterReplacements[format] + ">"
            }
            line = splits.join("")
        })
    })
    return line
}

function scan(line) {
    line = checkFormats(line)
    line = checkHeaders(line)
    return line
}

function splitMetaContent (lines) {
	content = lines.join("\n")
	a = content.split("// Content ")
	a[0] = a[0].replace("// Metadata\n", "")
	return {"metadata":a[0], "content":a[1]}
}

files.forEach(fileName => {
    lines = new Array
    console.log(fileName)
    lines = fs.readFileSync("./in/" + fileName, { encoding: "utf8" }).split("\n")
    console.log("done")
    out = toHTML(lines)
    file = out.join("<br>")
    l = fileName.split(".")
    l[l.length - 1] = "html"
    console.log(l)
    fs.writeFileSync("./out/" + l.join("."), file)
})