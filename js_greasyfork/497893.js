// ==UserScript==
// @name         florr.io | Text & Color Changer
// @namespace    Hai
// @version      2.1.3
// @description  Redecorate florr.io with your style.
// @author       Furaken
// @match        https://florr.io/*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/497893/florrio%20%7C%20Text%20%20Color%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/497893/florrio%20%7C%20Text%20%20Color%20Changer.meta.js
// ==/UserScript==

function addAlpha(color, opacity) {
    opacity = Math.round(Math.min(Math.max(opacity ?? 1, 0), 1) * 255);
    return color + opacity.toString(16).toUpperCase();
}

function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function createEle(type, parent, style, innerHTML, id, className) {
    let ele = document.createElement(type)
    if (type) ele.type = type
    if (style) ele.style = style
    if (innerHTML) ele.innerHTML = innerHTML
    if (id) ele.id = id
    if (className) ele.className = className
    parent.appendChild(ele)
    return ele
}

let ls = localStorage.customizer || JSON.stringify({
    color: {
        from: [],
        to: [],
    },
    text: []
})

function errorMessage(error) {
    console.log(error)
    alert(`${error}\n\n${JSON.stringify(ls, null, 4)}`)
}

function syntaxHighlight(json) { // https://stackoverflow.com/questions/4810841/pretty-print-json-using-javascript
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

try {ls = JSON.parse(ls)}
catch (error) {errorMessage(error)}

let closeButtonSvg = "data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KDTwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIFRyYW5zZm9ybWVkIGJ5OiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0iIzAwMDAwMCI+Cg08ZyBpZD0iU1ZHUmVwb19iZ0NhcnJpZXIiIHN0cm9rZS13aWR0aD0iMCIvPgoNPGcgaWQ9IlNWR1JlcG9fdHJhY2VyQ2FycmllciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cg08ZyBpZD0iU1ZHUmVwb19pY29uQ2FycmllciI+Cg08cGF0aCBmaWxsPSIjZmZmZmZmY2MiIGQ9Ik0xOTUuMiAxOTUuMmE2NCA2NCAwIDAgMSA5MC40OTYgMEw1MTIgNDIxLjUwNCA3MzguMzA0IDE5NS4yYTY0IDY0IDAgMCAxIDkwLjQ5NiA5MC40OTZMNjAyLjQ5NiA1MTIgODI4LjggNzM4LjMwNGE2NCA2NCAwIDAgMS05MC40OTYgOTAuNDk2TDUxMiA2MDIuNDk2IDI4NS42OTYgODI4LjhhNjQgNjQgMCAwIDEtOTAuNDk2LTkwLjQ5Nkw0MjEuNTA0IDUxMiAxOTUuMiAyODUuNjk2YTY0IDY0IDAgMCAxIDAtOTAuNDk2eiIvPgoNPC9nPgoNPC9zdmc+"
let ctx = document.getElementById("canvas").getContext("2d")
let message =
    `This script is made by Furaken (discord username: <w style="color: #15b1d6">samerkizi</w>)
Toggle this menu with keybind: <w style="color: #f5945d">Shift \`</w>
Join my discord server: <w style="color: #5567f1; cursor:pointer;" onclick='window.open("https://discord.gg/tmWUfg4FR9")'>https://discord.gg/tmWUfg4FR9</w>`

let container = createEle(
    "div",
    document.querySelector("body"),
    `
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    width: 80%;
    height: 80%;
    display: flex;
    z-index: 999;
    transition: all 0.4s ease-in-out;
    font-family: 'Ubuntu';
    color: white;
    text-shadow: rgb(0 0 0) 2px 0px 0px, rgb(0 0 0) 1.75517px 0.958851px 0px, rgb(0 0 0) 1.0806px 1.68294px 0px, rgb(0 0 0) 0.141474px 1.99499px 0px, rgb(0 0 0) -0.832294px 1.81859px 0px, rgb(0 0 0) -1.60229px 1.19694px 0px, rgb(0 0 0) -1.97998px 0.28224px 0px, rgb(0 0 0) -1.87291px -0.701566px 0px, rgb(0 0 0) -1.30729px -1.5136px 0px, rgb(0 0 0) -0.421592px -1.95506px 0px, rgb(0 0 0) 0.567324px -1.91785px 0px, rgb(0 0 0) 1.41734px -1.41108px 0px, rgb(0 0 0) 1.92034px -0.558831px 0px;
    `,
    `
    <div style="background: #333;border-radius: 10px;box-shadow: 5px 5px rgba(0, 0, 0, 0.3);padding: 15px;display: flex; width: 100%;">
        <div style="display: flex; flex-direction: column; width: 75%;">
            <div style="height: 100%; background: #00000050; border-radius: 10px; position: sticky; display: flex; flex-direction: column;">
                <div id="editLabel" style="text-align:center;background: #75ba75;padding: 10px;top: 0;left: 0;border-radius: 10px 10px 0 0;position: sticky;z-index: 1;">COLOR CHANGER</div>
                <div id="con_edit" style="white-space: break-spaces; background: #00000030; padding: 15px; border-radius:0 0 5px 5px;font-family:'Space Mono', monospace;overflow: hidden auto;word-wrap: break-word; padding: 15px; position: relative; height: 100%;">${message}<br><br><br>${syntaxHighlight(JSON.stringify(ls, null, 4))}</div>
                <div style="padding: 10px;position: sticky;z-index: 1;height: 40px;display: flex;font-size: 12px;text-align: center;line-height: 27px;">
                    <div id="con_edit_button_text" class="button" style="overflow:hidden;position: relative;height: 100%;width: fit-content;padding: 0 15px; border-radius: 3px;border: solid #ce6529 4px;box-sizing: border-box;background: #f5945d;">Text changer</div>
                    <div id="con_edit_button_appendTheme" class="button" style="overflow:hidden;position: relative;height: 100%;width: fit-content;padding: 0 15px; border-radius: 3px;border: solid #4b7a4b 4px;box-sizing: border-box;margin-left: 3px;background: #75ba75;">Append</div>
                    <div id="con_edit_button_copyJSON" class="button" style="overflow:hidden;position: relative;height: 100%;width: fit-content;padding: 0 15px;border-radius: 3px;border: solid #4b837e 4px;box-sizing: border-box;margin-left: 3px;background: #6dbfb8;">Copy JSON</div>
                    <div id="con_edit_button_viewJSON" class="button" style="overflow:hidden;position: relative;height: 100%;width: fit-content;padding: 0 15px;border-radius: 3px;border: solid #4b837e 4px;box-sizing: border-box;margin-left: 3px;background: #6dbfb8;">View JSON</div>
                    <div id="con_edit_button_deleteTheme" class="button" style="overflow:hidden;position: relative;height: 100%;width: fit-content;padding: 0 15px;border-radius: 3px;border: solid #974545 4px;box-sizing: border-box;margin-left: 3px;background: #BB5555;">Reset all</div>
                </div>
            </div>
        </div>
        <div style="display: flex; flex-direction: column; width: 25%; margin-left: 5px; font-size: 14px;">
            <div style="height: 100%; background: #00000050; border-radius: 10px; position: sticky; display: flex; flex-direction: column;">
                <div style="text-align:center;background: #6dbfb8;padding: 12px;top: 0;border-radius: 10px 10px 0 0;position: sticky;z-index: 1;">ELEMENTS</div>
                <div id="con_element" style="font-family:'Space Mono', monospace;padding: 15px; position: relative; height: 100%; overflow-y: auto"></div>
                <div style="padding: 10px;position: sticky;z-index: 1;height: 40px;display: flex;font-size: 12px;text-align: center;line-height: 27px;">
                    <div id="con_element_button_addColor" class="button" style="overflow:hidden;position: relative;height: 100%;width: 100%;border-radius: 3px;border: solid #4b837e 4px;box-sizing: border-box;background: #6dbfb8;margin-right: 2px;">New color</div>
                    <div id="con_element_button_findColor" class="button" style="overflow:hidden;position: relative;height: 100%;width: 100%;border-radius: 3px;border: solid #785978 4px;box-sizing: border-box;margin-left: 2px;background: #be95be;">Find color</div>
                </div>
            </div>
        </div>
    </div>
    <div id="closeButton" style="cursor: pointer; background-color: #BB5555; background-image: url(${closeButtonSvg});background-position: center;background-size: contain;background-repeat: no-repeat;border: 4px solid #974545; border-radius: 5px; height: 25px; width: 25px; margin-left: 5px;box-shadow: 4px 4px rgba(0, 0, 0, 0.3)"></div>
    `
)

document.getElementById("con_edit_button_text").onclick = function() {
    document.getElementById("editLabel").innerHTML = "TEXT CHANGER"
    document.getElementById("editLabel").style.background = "#f5945c"
    document.getElementById("con_edit").innerHTML =
`This text changer uses <w style="color: #f5945d">.replace(pattern, replacement)</w> function with pattern used as RegEx object (global flag).
How to RegEx: <w style="color: #5567f1; cursor:pointer;" onclick='window.open("https://www3.ntu.edu.sg/home/ehchua/programming/howto/Regexe.html")'>https://www3.ntu.edu.sg/home/ehchua/programming/howto/Regexe.html</w>


`
    ls.text.forEach((t, i) => {
        createEle("div", document.getElementById("con_edit"), null, `${i}: <w style="color: #e6db74">/${t.from}/g</w>`, null, "button").onclick = function() {
            let regex = prompt("from (RegEx)", t.from)
            if (!regex) return
            ls.text[i].from = regex
            localStorage.customizer = JSON.stringify(ls)
        }
        createEle("div", document.getElementById("con_edit"), "margin-left: 40px; margin-bottom: 10px;",`<w style="color: #e6db74">"</w>${t.to}<w style="color: #e6db74">"</w>`, null, "button").onclick = function() {
            let a = prompt("to (String)", t.to)
            if (!a) return
            ls.text[i].to = a
            localStorage.customizer = JSON.stringify(ls)
        }
    })

    let textButtons = createEle("div", document.getElementById("con_edit"), "margin-top: 20px; font-size: 12px; display: inline-flex")
    createEle("div", textButtons, "cursor: pointer; overflow:hidden;height: fit-content;width: fit-content;padding: 3px 7px; border-radius: 3px;border: solid #4b837e 4px;box-sizing: border-box;background: #6dbfb8;", "New Text").onclick = function() {
        let from = prompt("from (RegEx)")
        if (!from) return
        if (ls.text.map(x => x.from).includes(from)) return alert("Text already exists.")
        let to = prompt("to (String)")
        if (!to) to = ""
        ls.text.push({
            from: from,
            to: to
        })
        localStorage.customizer = JSON.stringify(ls)
    }
    createEle("div", textButtons, "margin-left: 5px; cursor: pointer; overflow:hidden;height: fit-content;width: fit-content;padding: 3px 7px; border-radius: 3px;border: solid #974545 4px;box-sizing: border-box;background: #bb5555;", "Remove Text").onclick = function() {
        if (ls.text.length <= 0) return alert("You cannot remove more text.")
        let indexNumber = prompt("Index:", ls.text.length - 1)
        if (isNaN(indexNumber) || indexNumber == "" || indexNumber >= ls.text.length || indexNumber < 0) return alert("This index does not exist")
        indexNumber = Number(indexNumber)
        if (!confirm(`Are you sure to delete this?\n\n${JSON.stringify(ls.text[indexNumber], null, 4)}`)) return
        ls.text.splice(indexNumber, 1)
        localStorage.customizer = JSON.stringify(ls)
    }
}
document.getElementById("con_edit_button_appendTheme").onclick = function() {
    let newObj = prompt("JSON")
    if (newObj == null) return
    try {
        newObj = JSON.parse(newObj)
        newObj.color.from.forEach((from, index) => {
            if (from == null) return
            if (JSON.stringify(ls.color.from).includes(JSON.stringify(from))) return
            if (typeof from.color != "string") return
            if (!(typeof from.alpha == "number" || from.alpha == "*")) return

            let to = newObj.color.to[index]
            if (!["solid", "linear", "radial", "animated"].includes(to.type)) return
            if (!(typeof to.alpha == "number" || to.alpha == "*")) return
            if (to.data == null) return

            if (from.alpha != "*") from.alpha = Math.min(Math.max(from.alpha ?? 1, 0), 1)
            if (to.alpha != "*") to.alpha = Math.min(Math.max(to.alpha ?? 1, 0), 1)

            if (/^#[A-Fa-f0-9]{6}$/g.test(from.color)) from.color = from.color.match(/^#[A-Fa-f0-9]{6}$/g)[0]
            else return

            ls.color.from.push(from)
            ls.color.to.push(to)
        })
        newObj.text.forEach((obj, index) => {
            if (obj.from == null || obj.from == "" || obj.to == null) return
            if (ls.text.map(x => x.from).includes(obj.from)) return
            if (typeof obj.from != "string" || typeof obj.to != "string" ) return

            ls.text.push(obj)
        })
    } catch (error) {
        errorMessage(error)
    }
    localStorage.customizer = JSON.stringify(ls)
}

document.getElementById("con_edit_button_copyJSON").onclick = function() { navigator.clipboard.writeText(JSON.stringify(ls, null, 4)) }
document.getElementById("con_edit_button_viewJSON").onclick = function() { document.getElementById("con_edit").innerHTML = `${message}<br><br><br>${syntaxHighlight(JSON.stringify(ls, null, 4))}` }
document.getElementById("con_edit_button_deleteTheme").onclick = function() {
    if (!confirm(`Are you sure to reset all?`)) return
    ls = {
        color: {
            from: [],
            to: [],
        },
        text: []
    }
    updateElements()
}

var animatedObj = []

function getPosition(x_, y_, r_, isRadiusExist) {
    let string
    if (!isRadiusExist) string = prompt("x, y", `${x_}, ${y_}`)
    else string = prompt("x, y, radius", `${x_}, ${y_}, ${r_}`)
    if (string == null) return
    string = string.split(",")
    if ((string.length < 2 && !isRadiusExist) || (string.length < 3 && isRadiusExist)) return alert("Invalid input.")
    let x = string[0].trim(), y = string[1].trim()
    if (isNaN(x) || x == "") x = null
    else x = Number(x)
    if (isNaN(y) || y == "") y = null
    else y = Number(y)
    if (isRadiusExist) {
        var r = string[2].trim()
        if (isNaN(r) || r == "") r = null
        else r = Number(r)
        if (r < 0) return alert("Radius cannot be less than 0")
    }
    return {x, y, r}
}

function updateElements() {
    localStorage.customizer = JSON.stringify(ls)
    getColorElementsFromLocalStorage()
}

function getColorElementsFromLocalStorage() {
    document.getElementById("con_element").innerHTML = `<div style="display: flex; flex-direction: column">` + ls.color.from.map((x, index) => `
    <div id="con_element_${x.color}-${x.alpha}" style="cursor: pointer; display: flex; flex-direction: row; margin-bottom: 3px">
        <w id="con_element_${x.color}-${x.alpha}_a" style="border-radius: 5px 0 0 5px; padding: 5px 10px; background:${addAlpha(x.color, x.alpha == "*" ? null : x.alpha)}; width: 50%;">${x.color} (${x.alpha == "*" ? x.alpha : x.alpha.toFixed(1)})</w>
        <w id="con_element_${x.color}-${x.alpha}_b" style="border-radius: 0 5px 5px 0; padding: 5px 10px; background:${addAlpha(ls.color.to[index].preview, ls.color.to[index].alpha == "*" ? null : ls.color.to[index].alpha)}; width: 50%;">${ls.color.to[index].type == "solid" ? ls.color.to[index].preview : ls.color.to[index].type} (${ls.color.to[index].alpha == "*" ? ls.color.to[index].alpha : ls.color.to[index].alpha.toFixed(1)})</w>
    </div>
    `).toString().replaceAll(",", "") + "</div>"
    ls.color.from.forEach((x, index) => {
        let listOfCategory = [`category_solid`, `category_linear`, `category_radial`, `category_animated`]

        if (ls.color.to[index].type == "solid") ls.color.to[index].preview = ls.color.to[index].data
        else if (ls.color.to[index].type == "linear" || ls.color.to[index].type == "radial") ls.color.to[index].preview = ls.color.to[index].data.colorStop[0].color
        else if (ls.color.to[index].type == "animated") ls.color.to[index].preview = ls.color.to[index].data.keyframes[0]
        localStorage.customizer = JSON.stringify(ls)
        document.getElementById(`con_element_${x.color}-${x.alpha}_b`).style.background = `${addAlpha(ls.color.to[index].preview, ls.color.to[index].alpha == "*" ? null : ls.color.to[index].alpha)}`
        document.getElementById(`con_element_${x.color}-${x.alpha}_b`).innerHTML = `${ls.color.to[index].type == "solid" ? ls.color.to[index].preview : ls.color.to[index].type} (${ls.color.to[index].alpha})`

        document.getElementById(`con_element_${x.color}-${x.alpha}`).onclick = function() {
            document.getElementById("editLabel").innerHTML = "COLOR CHANGER"
            document.getElementById("editLabel").style.background = "#75ba75"
            document.getElementById("con_edit").innerHTML = `from <w id="originalColor" style="cursor: pointer; border-radius: 5px; padding: 5px 10px; background:${addAlpha(x.color, x.alpha == "*" ? null : x.alpha)};">${x.color} (${x.alpha})</w> to <w id="convertColor" style="cursor: default; border-radius: 5px; padding: 5px 10px; background:${addAlpha(ls.color.to[index].preview, ls.color.to[index].alpha == "*" ? null : ls.color.to[index].alpha)};">${ls.color.to[index].type == "solid" ? ls.color.to[index].preview : ls.color.to[index].type} (${ls.color.to[index].alpha})</w>`

            let type = createEle("div", document.getElementById("con_edit"), "margin-top: 20px", "type ")

            document.getElementById("originalColor").onclick = function() {
                let color = prompt("Color (hex6):", ls.color.from[index].color)
                if (color == null) return
                if (/^#[A-Fa-f0-9]{6}$/g.test(color)) color = color.match(/^#[A-Fa-f0-9]{6}$/g)[0]
                else return alert("Invalid hex color.")
                let alpha = prompt("Alpha (0~1 or * for any) :", ls.color.from[index].alpha)
                if (alpha != "*") {
                    if (isNaN(alpha)) alpha = 1
                    else alpha = Number(alpha)
                    alpha = Math.min(Math.max(alpha ?? 1, 0), 1)
                }
                ls.color.from[index] = ({color: color, alpha: alpha})
                document.getElementById("originalColor").innerHTML = `${color} (${alpha})`
                document.getElementById("originalColor").style.background = `${addAlpha(color, alpha == "*" ? null : alpha)}`
                updateElements()
            }

            let dropdown = createEle("select", type,
                                     `
                                     border-radius: 5px;
                                     padding: 5px 10px;
                                     background: #6ebfb8;
                                     width: fit-content;
                                     cursor: pointer;
                                     font-family: 'Space Mono', monospace;
                                     font-size: 16px;
                                     color: white;
                                     text-shadow: rgb(0 0 0) 2px 0px 0px, rgb(0 0 0) 1.75517px 0.958851px 0px, rgb(0 0 0) 1.0806px 1.68294px 0px, rgb(0 0 0) 0.141474px 1.99499px 0px, rgb(0 0 0) -0.832294px 1.81859px 0px, rgb(0 0 0) -1.60229px 1.19694px 0px, rgb(0 0 0) -1.97998px 0.28224px 0px, rgb(0 0 0) -1.87291px -0.701566px 0px, rgb(0 0 0) -1.30729px -1.5136px 0px, rgb(0 0 0) -0.421592px -1.95506px 0px, rgb(0 0 0) 0.567324px -1.91785px 0px, rgb(0 0 0) 1.41734px -1.41108px 0px, rgb(0 0 0) 1.92034px -0.558831px 0px;
                                     `, ls.color.to[index].type
                                    )

            dropdown.onchange = function() {
                if (!confirm(`Reselecting type will erase current data, continue?\n\n${JSON.stringify(ls.color.to[index].data, null, 4)}`)) {
                    updateElements()
                    return
                }
                ls.color.to[index].type = this.options[this.selectedIndex].text
                if (ls.color.to[index].type == "solid") ls.color.to[index].data = x.color
                else if (ls.color.to[index].type == "linear" || ls.color.to[index].type == "radial") {
                    ls.color.to[index].data = {
                        pos: {
                            x0: null,
                            y0: null,
                            x1: null,
                            y1: null,
                            defaultEnd: {
                                x: 100,
                                y: 100
                            }
                        },
                        colorStop: [
                            {
                                offset: 0,
                                color: x.color,
                            },
                            {
                                offset: 1,
                                color: x.color,
                            }
                        ]
                    }
                } else if (ls.color.to[index].type == "animated") {
                    ls.color.to[index].data = {
                        duration: 5,
                        keyframes: [
                            x.color,
                            x.color
                        ]
                    }
                }
                if (ls.color.to[index].type == "radial") {
                    ls.color.to[index].data.pos = {
                        x0: -1,
                        y0: -1,
                        r0: 1,
                        x1: 1,
                        y1: 1,
                        r1: null,
                        defaultEnd: {
                            x: null,
                            y: null,
                            r: 3
                        }
                    }
                }
                updateElements()
            }

            let category = createEle("div", document.getElementById("con_edit"), "display: inline-flex; margin-top: 20px;")
            let category_content = createEle("div", document.getElementById("con_edit"))

            listOfCategory.forEach(name => {
                let ele = createEle("option", dropdown, null, name.split("_")[1])
                if (ls.color.to[index].type == name.split("_")[1]) ele.selected = "selected"
            })
            createEle("div", category_content, null, `alpha = ${ls.color.to[index].alpha}`, null, "button").onclick = function() {
                let alpha = prompt("Alpha (0~1 or * for any) :", ls.color.to[index].alpha)
                if (alpha != "*") {
                    if (isNaN(alpha)) alpha = 1
                    else alpha = Number(alpha)
                    alpha = Math.min(Math.max(alpha ?? 1, 0), 1)
                }
                ls.color.to[index].alpha = alpha
                updateElements()
            }
            if (ls.color.to[index].type == "solid") { /* --------- SOLID --------- */
                createEle("div", category_content, null, `color = ${ls.color.to[index].data}`, null, "button").onclick = function() {
                    let color = prompt("Color (hex6):", ls.color.to[index].data)
                    if (color == null) return
                    if (/^#[A-Fa-f0-9]{6}$/g.test(color)) color = color.match(/^#[A-Fa-f0-9]{6}$/g)[0]
                    else return alert("Invalid hex color.")
                    ls.color.to[index].data = color
                    updateElements()
                }
            } else if (ls.color.to[index].type == "linear" || ls.color.to[index].type == "radial") { /* --------- LINEAR/RADIAL GRADIENT --------- */
                createEle("div", category_content, null, `start position = [${ls.color.to[index].data.pos.x0}, ${ls.color.to[index].data.pos.y0}${ls.color.to[index].type == "radial" ? `, ${ls.color.to[index].data.pos.r0}` : ""}]`, null, "button").onclick = function() {
                    let result = getPosition(ls.color.to[index].data.pos.x0, ls.color.to[index].data.pos.y0, ls.color.to[index].type == "radial" ? ls.color.to[index].data.pos.r0 : null, ls.color.to[index].type == "radial")
                    ls.color.to[index].data.pos.x0 = result.x
                    ls.color.to[index].data.pos.y0 = result.y
                    if (ls.color.to[index].type == "radial") ls.color.to[index].data.pos.r0 = result.r
                    updateElements()
                }
                createEle("div", category_content, null, `end position = [${ls.color.to[index].data.pos.x1}, ${ls.color.to[index].data.pos.y1}${ls.color.to[index].type == "radial" ? `, ${ls.color.to[index].data.pos.r1}` : ""}]`, null, "button").onclick = function() {
                    let result = getPosition(ls.color.to[index].data.pos.x1, ls.color.to[index].data.pos.y1, ls.color.to[index].type == "radial" ? ls.color.to[index].data.pos.r1 : null, ls.color.to[index].type == "radial")
                    ls.color.to[index].data.pos.x1 = result.x
                    ls.color.to[index].data.pos.y1 = result.y
                    if (ls.color.to[index].type == "radial") ls.color.to[index].data.pos.r1 = result.r
                    updateElements()
                }
                createEle("div", category_content, null, `<br>default end position = [${ls.color.to[index].data.pos.defaultEnd.x}, ${ls.color.to[index].data.pos.defaultEnd.y}${ls.color.to[index].type == "radial" ? `, ${ls.color.to[index].data.pos.defaultEnd.r}` : ""}]<br><w style="font-size:12px; color: #e6db74;">This attribute will be used if canvas prototype's end position is undefined.<br>output = start(x/y${ls.color.to[index].type == "radial" ? "/r" : ""}) + def_end(x/y${ls.color.to[index].type == "radial" ? "/r" : ""})</w><br><br>`, null, "button").onclick = function() {
                    let result = getPosition(ls.color.to[index].data.pos.defaultEnd.x, ls.color.to[index].data.pos.defaultEnd.y, ls.color.to[index].type == "radial" ? ls.color.to[index].data.pos.defaultEnd.r : null, ls.color.to[index].type == "radial")
                    ls.color.to[index].data.pos.defaultEnd.x = result.x
                    ls.color.to[index].data.pos.defaultEnd.y = result.y
                    if (ls.color.to[index].type == "radial") ls.color.to[index].data.pos.defaultEnd.r = result.r
                    updateElements()
                }
                ls.color.to[index].data.colorStop.forEach((thisColorStop, indexColorStop) => {
                    createEle("div", category_content, null, `color stop ${indexColorStop}: [${thisColorStop.offset}, ${thisColorStop.color}]`, null, "button").onclick = function() {
                        let input = prompt("Float (0~1), Color (hex6)", `${thisColorStop.offset}, ${thisColorStop.color}`)
                        if (input == null) return
                        input = input.split(",")
                        if (input.length <= 1) return alert("Invalid input.")
                        let offset = input[0].trim(), color = input[1].trim()
                        if (isNaN(offset) || offset == "") return alert("Invalid offset.")
                        offset = Math.min(Math.max(offset ?? 1, 0), 1)
                        offset = Number(offset)
                        if (/^#[A-Fa-f0-9]{6}$/g.test(color)) color = color.match(/^#[A-Fa-f0-9]{6}$/g)[0]
                        else return alert("Invalid hex color.")
                        ls.color.to[index].data.colorStop[indexColorStop].offset = offset
                        ls.color.to[index].data.colorStop[indexColorStop].color = color
                        updateElements()
                    }
                })
                let stopButtons = createEle("div", category_content, "margin-top: 20px; font-size: 12px; display: inline-flex")
                createEle("div", stopButtons, "cursor: pointer; overflow:hidden;height: fit-content;width: fit-content;padding: 3px 7px; border-radius: 3px;border: solid #4b837e 4px;box-sizing: border-box;background: #6dbfb8;", "New Color stop").onclick = function() {
                    let indexNumber = prompt("Index:", ls.color.to[index].data.colorStop.length)
                    if (isNaN(indexNumber) || indexNumber == "" || indexNumber > ls.color.to[index].data.colorStop.length || indexNumber < 0) indexNumber = ls.color.to[index].data.colorStop.length
                    indexNumber = Number(indexNumber)
                    ls.color.to[index].data.colorStop.splice(indexNumber, 0, ls.color.to[index].data.colorStop[ls.color.to[index].data.colorStop.length - 1])
                    updateElements()
                }
                createEle("div", stopButtons, "margin-left: 5px; cursor: pointer; overflow:hidden;height: fit-content;width: fit-content;padding: 3px 7px; border-radius: 3px;border: solid #974545 4px;box-sizing: border-box;background: #bb5555;", "Remove Color stop").onclick = function() {
                    if (ls.color.to[index].data.colorStop.length <= 2) return alert("You cannot remove more color stop.")
                    let indexNumber = prompt("Index:", ls.color.to[index].data.colorStop.length - 1)
                    if (isNaN(indexNumber) || indexNumber == "" || indexNumber >= ls.color.to[index].data.colorStop.length || indexNumber < 0) return alert("This index does not exist")
                    indexNumber = Number(indexNumber)
                    if (!confirm(`Are you sure to delete this?\n\n${JSON.stringify(ls.color.to[index].data.colorStop[indexNumber], null, 4)}`)) return
                    ls.color.to[index].data.colorStop.splice(indexNumber, 1)
                    updateElements()
                }
            } else if (ls.color.to[index].type == "animated") { /* --------- ANIMATED --------- */
                createEle("div", category_content, null, `duration = ${ls.color.to[index].data.duration}`, null, "button").onclick = function() {
                    let duration = prompt("Interval (second) > 0", ls.color.to[index].data.duration)
                    if (duration == null) return
                    if (isNaN(duration) || duration == "") return alert("Invalid duration.")
                    duration = Number(duration)
                    if (duration <= 0) duration = 5
                    ls.color.to[index].data.duration = duration
                    updateElements()
                }
                ls.color.to[index].data.keyframes.forEach((thisKeyframe, indexKeyframe) => {
                    createEle("div", category_content, null, `keyframe ${indexKeyframe}: ${thisKeyframe}`, null, "button").onclick = function() {
                        let keyframe = prompt("Color (hex6)", `${thisKeyframe}`)
                        if (keyframe == null) return
                        if (/^#[A-Fa-f0-9]{6}$/g.test(keyframe)) keyframe = keyframe.match(/^#[A-Fa-f0-9]{6}$/g)[0]
                        else return alert("Invalid hex color.")
                        ls.color.to[index].data.keyframes[indexKeyframe] = keyframe
                        updateElements()
                    }
                })
                let keyframeButtons = createEle("div", category_content, "margin-top: 20px; font-size: 12px; display: inline-flex")
                createEle("div", keyframeButtons, "cursor: pointer; overflow:hidden;height: fit-content;width: fit-content;padding: 3px 7px; border-radius: 3px;border: solid #4b837e 4px;box-sizing: border-box;background: #6dbfb8;", "New Keyframe").onclick = function() {
                    let indexNumber = prompt("Index:", ls.color.to[index].data.keyframes.length)
                    if (isNaN(indexNumber) || indexNumber == "" || indexNumber > ls.color.to[index].data.keyframes.length || indexNumber < 0) indexNumber = ls.color.to[index].data.keyframes.length
                    indexNumber = Number(indexNumber)
                    ls.color.to[index].data.keyframes.splice(indexNumber, 0, ls.color.to[index].data.keyframes[ls.color.to[index].data.keyframes.length - 1])
                    updateElements()
                }
                createEle("div", keyframeButtons, "margin-left: 5px; cursor: pointer; overflow:hidden;height: fit-content;width: fit-content;padding: 3px 7px; border-radius: 3px;border: solid #974545 4px;box-sizing: border-box;background: #bb5555;", "Remove Keyframe").onclick = function() {
                    if (ls.color.to[index].data.keyframes.length <= 2) return alert("You cannot remove more color stop.")
                    let indexNumber = prompt("Index:", ls.color.to[index].data.keyframes.length - 1)
                    if (isNaN(indexNumber) || indexNumber == "" || indexNumber >= ls.color.to[index].data.keyframes.length || indexNumber < 0) return alert("This index does not exist")
                    indexNumber = Number(indexNumber)
                    if (!confirm(`Are you sure to delete this?\n\n${JSON.stringify(ls.color.to[index].data.keyframes[indexNumber], null, 4)}`)) return
                    ls.color.to[index].data.keyframes.splice(indexNumber, 1)
                    updateElements()
                }
            }

            createEle("div", document.getElementById("con_edit"), "cursor: pointer;right: 15px; top: 15px;overflow:hidden;position: absolute;height: fit-content;width: fit-content;padding: 5px 15px; border-radius: 3px;border: solid #974545 4px;box-sizing: border-box;background: #bb5555;", "Delete this color").onclick = function() {
                if (!confirm(`Are you sure to delete?\n\n${JSON.stringify(x, null, 4)}`)) return
                ls.color.from.splice(index, 1)
                ls.color.to.splice(index, 1)
                updateElements()
            }
        }
        if (ls.color.to[index].type == "animated") {
            animatedObj[index] = {
                isTriggered: false,
                color: ls.color.to[index].data.keyframes[0],
                keyFrames: ls.color.to[index].data.keyframes,
                totalFrames: 60 * ls.color.to[index].data.duration,
                currentFrames: 0
            }
        }
    })
}

getColorElementsFromLocalStorage()

document.getElementById("con_element_button_addColor").onclick = function() {
    let color = prompt("Color (hex6):", "#ffffff")
    if (color == null) return
    if (/^#[A-Fa-f0-9]{6}$/g.test(color)) color = color.match(/^#[A-Fa-f0-9]{6}$/g)[0]
    else return alert("Invalid hex color.")
    let alpha = prompt("Alpha (0~1 or * for any) :", "*")
    if (alpha != "*") {
        if (isNaN(alpha)) alpha = 1
        else alpha = Number(alpha)
        alpha = Math.min(Math.max(alpha ?? 1, 0), 1)
    }
    if (!JSON.stringify(ls.color.from).includes(JSON.stringify({color: color, alpha: alpha}))) {
        ls.color.from.push({color: color, alpha: alpha})
        ls.color.to.push({
            type: "solid",
            alpha: alpha,
            preview: color,
            data: color
        })
    }
    updateElements()
}

let findColorArr = [],
    isFindColor = false
document.getElementById("con_element_button_findColor").onclick = function() {
    if (!isFindColor) {
        findColorArr = []
        isFindColor = true
        document.getElementById("con_element_button_findColor").style.background = "#BB5555"
        document.getElementById("con_element_button_findColor").style.border = "solid #974545 4px"
        document.getElementById("con_element_button_findColor").innerHTML = "Stop"
    } else {
        isFindColor = false
        document.getElementById("con_element_button_findColor").style.background = "#be95be"
        document.getElementById("con_element_button_findColor").style.border = "solid #785978 4px"
        document.getElementById("con_element_button_findColor").innerHTML = "Find color"
        document.getElementById("con_edit").innerHTML = findColorArr.map(x => `<w onclick="navigator.clipboard.writeText('${x.color}')" style="cursor: pointer; display: inline-flex; padding: 5px 10px; background:${addAlpha(x.color, x.alpha)}">${x.color} (${x.alpha.toFixed(1)})</w>`).toString().replaceAll(",", "")
    }
}

function convertColor(this_, x0, y0, x1, y1, isStroke) {
    try {
        ls.color.from.forEach((obj, index) => {
            let outputColor, thisObj
            if (!isStroke) outputColor = this_.fillStyle
            else outputColor = this_.strokeStyle
            if (outputColor == obj.color) {
                if (obj.alpha == "*" || obj.alpha == this_.globalAlpha) {
                    thisObj = ls.color.to[index].data
                    if (ls.color.to[index].type == "solid") outputColor = thisObj
                    if (ls.color.to[index].type == "linear") {
                        x0 = x0 || thisObj.pos.x0 || 0
                        y0 = y0 || thisObj.pos.y0 || 0
                        x1 = x1 || thisObj.pos.x1 || x0 + thisObj.pos.defaultEnd.x
                        y1 = y1 || thisObj.pos.y1 || y0 + thisObj.pos.defaultEnd.y
                        outputColor = ctx.createLinearGradient(x0, y0, x1, y1)
                        thisObj.colorStop.forEach(x => { outputColor.addColorStop(x.offset, x.color) })
                    }
                    if (ls.color.to[index].type == "radial") {
                        let r0, r1
                        x0 = x0 || thisObj.pos.x0 || (x1 == null ? (x0) : (x1 - (x1 - x0) * 1))
                        y0 = y0 || thisObj.pos.y0 || (y1 == null ? (y0) : (y1 - (y1 - y0) * 1))
                        r0 = r0 || thisObj.pos.r0 || 0
                        x1 = x1 || thisObj.pos.x1 || x0 + thisObj.pos.defaultEnd.x
                        y1 = y1 || thisObj.pos.y1 || y0 + thisObj.pos.defaultEnd.y
                        r1 = r1 || thisObj.pos.r1 || r0 + thisObj.pos.defaultEnd.r
                        outputColor = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1)
                        thisObj.colorStop.forEach(x => { outputColor.addColorStop(x.offset, x.color) })
                    }
                    if (ls.color.to[index].type == "animated") { // https://stackoverflow.com/questions/53380267/colors-that-change-overtime-in-a-canvas-js-trouble-with-setinterval
                        if (!animatedObj[index]) return
                        if (!animatedObj[index].isTriggered) {
                            animatedObj[index].isTriggered = true
                            localStorage.customizer = JSON.stringify(ls)
                            animatedObj[index].color = [hexToRgb(thisObj.keyframes[0]).r, hexToRgb(thisObj.keyframes[0]).g, hexToRgb(thisObj.keyframes[0]).b]
                            animatedObj[index].keyFrames = thisObj.keyframes.map(x => [hexToRgb(x).r, hexToRgb(x).g, hexToRgb(x).b])
                            animatedObj[index].totalFrames = 60 * thisObj.duration
                            animatedObj[index].currentFrame = 0
                            function update() {
                                animatedObj[index].currentFrame = (animatedObj[index].currentFrame + 1) % animatedObj[index].totalFrames
                                let keyFrameIndex = animatedObj[index].currentFrame / (animatedObj[index].totalFrames / animatedObj[index].keyFrames.length)
                                let prev = animatedObj[index].keyFrames[Math.floor(keyFrameIndex) % animatedObj[index].keyFrames.length]
                                let next = animatedObj[index].keyFrames[Math.ceil(keyFrameIndex) % animatedObj[index].keyFrames.length]
                                let inBetweenRatio = keyFrameIndex - Math.floor(keyFrameIndex)
                                animatedObj[index].color[0] = Math.floor((next[0] - prev[0]) * inBetweenRatio) + prev[0]
                                animatedObj[index].color[1] = Math.floor((next[1] - prev[1]) * inBetweenRatio) + prev[1]
                                animatedObj[index].color[2] = Math.floor((next[2] - prev[2]) * inBetweenRatio) + prev[2]
                                requestAnimationFrame(update)
                            }
                            update()
                        }
                        outputColor = rgbToHex(animatedObj[index].color[0], animatedObj[index].color[1], animatedObj[index].color[2])
                    }
                    if (!isStroke) this_.fillStyle = outputColor
                    else this_.strokeStyle = outputColor
                    if (ls.color.to[index].alpha != "*") this_.globalAlpha = ls.color.to[index].alpha
                }
            }
        })
    } catch (error) {errorMessage(error)}
}

function convertText(text) {
    ls.text.forEach(t => {
        let a = new RegExp(t.from, "g")
        if (a.test(text)) text = text.replace(a, t.to)
    })
    return text
}

function colorFinder(color, alpha) {
    if (isFindColor && !findColorArr.map(x => x.color).includes(color) && /^#[A-Fa-f0-9]{6}$/g.test(color) && !ls.color.from.map(x => x.color).includes(color)) findColorArr.push({color: color, alpha: alpha})
}
// Credit to lexiyvv and Tinhone
for (let ctx of [CanvasRenderingContext2D, OffscreenCanvasRenderingContext2D]) {
    if (ctx.prototype.RarityColorFillText == undefined) {
        ctx.prototype.RarityColorFillText = ctx.prototype.fillText;
        ctx.prototype.RarityColorStrokeText = ctx.prototype.strokeText;
        ctx.prototype.RarityColorFillRect = ctx.prototype.fillRect;
        ctx.prototype.RarityColorStroke = ctx.prototype.stroke;
        ctx.prototype.RarityColorFill = ctx.prototype.fill;
        ctx.prototype.RarityColorStrokeRect = ctx.prototype.strokeRect;
        ctx.prototype.RarityColorMeasureText = ctx.prototype.measureText;
    } else { break };

    ctx.prototype.fillRect = function(x, y, width, height) {
        colorFinder(this.fillStyle, this.globalAlpha)
        convertColor(this, x, y, x + width, y + height, false)
        return this.RarityColorFillRect(x, y, width, height);
    };

    ctx.prototype.fill = function(path, fillRule) {
        colorFinder(this.fillStyle, this.globalAlpha)
        convertColor(this, null, null, null, null, false)
        if (path != null) return this.RarityColorFill(path, fillRule);
        else return this.RarityColorFill(fillRule);
    }

    ctx.prototype.fillText = function(text, x, y) {
        colorFinder(this.fillStyle, this.globalAlpha)
        convertColor(this, x, y, null, null, false)
        text = convertText(text)
        return this.RarityColorFillText(text, x, y);
    };

    ctx.prototype.strokeText = function(text, x, y) {
        colorFinder(this.fillStyle, this.globalAlpha)
        convertColor(this, x, y, null, null, true)
        text = convertText(text)
        return this.RarityColorStrokeText(text, x, y);
    };

    ctx.prototype.stroke = function(path) {
        colorFinder(this.fillStyle, this.globalAlpha)
        convertColor(this, null, null, null, null, true)
        if (path != null) return this.RarityColorStroke(path);
        else return this.RarityColorStroke();
    };

    ctx.prototype.strokeRect = function(x, y, width, height) {
        colorFinder(this.fillStyle, this.globalAlpha)
        convertColor(this, x, y, x + width, y + height, true)
        return this.RarityColorStrokeRect(x, y, width, height);
    };

    ctx.prototype.measureText = function(text) {
        text = convertText(text)
        return this.RarityColorMeasureText(text);
    }
}

document.documentElement.addEventListener("keydown", function (e) {
    if (event.keyCode == "192" && event.shiftKey) {
        if (container.style.transform == "translate(-50%, -50%) scale(1)") {
            container.style.transform = "translate(-50%, -50%) scale(0)"
        } else {
            container.style.transform = "translate(-50%, -50%) scale(1)"
        }
    }
});

document.getElementById("closeButton").onclick = function() {
    container.style.transform = "translate(-50%, -50%) scale(0)"
}

GM_addStyle(`
.category {
    padding: 5px 20px;
    margin-right: 5px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    cursor: pointer;
}

.button {
    cursor: pointer;
}

::-webkit-scrollbar {
    width: 5px;
}
::-webkit-scrollbar-track {
    background: #00000000;
}
::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
    background: #444;
}

.string { color: #e6db74; }
.number { color: #ae81ff; }
.boolean { color: #ae81ff; }
.null { color: #ae81ff; }
.key { color: #66d9ef; }

`)