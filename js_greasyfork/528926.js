// ==UserScript==
// @license MIT
// @name         Mopoga Cheat Menu
// @namespace    mailto:BlueTeamScores@outlook.com
// @version      2025-02-16
// @description  Brings up a cheat menu letting you edit any variable.
// @author       me
// @match        https://mopoga.com/embed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mopoga.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528926/Mopoga%20Cheat%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/528926/Mopoga%20Cheat%20Menu.meta.js
// ==/UserScript==
let objectToString = object=>{
    if(Array.isArray(object)) return `[${object}]`
    if(object?.constructor != Object) return `${object}`
    let entries = Object.entries(object)
    let result = "{"
    result += entries.map(i=>{
        return `${i[0]} : ${objectToString(i[1])}`
    }).join(", ")
    result += "}"
    return result
}
let { State, UI } = SugarCube
$(document.body).append(`
<div id="userScriptCheatMenu" style="position: fixed; display: grid; align-items: center; justify-items: center; cursor: pointer; top: 70px; right: 0px; width: 100px; aspect-ratio: 1 / 1; background-color: black; border: 2px solid red;">
    <div">CHEATS</div>
</div>
`)
let displayVariables = (variables, assignTo = SugarCube.State.active.variables) => {
    let body = $("#ui-dialog-body")
    let entries = Object.entries(variables);
    entries = entries.sort((a, b) => a[0].localeCompare(b[0]));
    return entries.map(i => {
        let [key, value] = i
        let stringifiedValue = objectToString(value)
        let variable = assignTo[key]
        let div = $(`<div></div>`)
        div.append(key, " : ")
        if (typeof value == "object") {
            let objectEntries = Object.entries(value)
            let objectButton = $(`<span style="cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><b style="color:green;">expand Object + </b><span style="font-family: Courier New;">${stringifiedValue}</span></span>`)
            let listener
            objectButton.off("click")
            objectButton.on("click", listener = () => {
                let scroll = body[0].scrollTop
                setTimeout(()=>{
                    body[0].scrollTop = scroll
                },50)
                objectButton.html(`<b style="color: red;">collapse Object - </b>`)
                let objectListDiv = $(`<div class="objectListDiv" style="margin-left: 2em"></div>`)
                div.append(objectListDiv)
                objectListDiv.append(displayVariables(value, variable))
                objectButton.off("click")
                objectButton.on("click", () => {
                    let scroll = body[0].scrollTop
                setTimeout(()=>{
                    body[0].scrollTop = scroll
                },50)
                    div.children(".objectListDiv").hide()
                    objectButton.html(`<b style="color:green;">expand Object + </b><span style="font-family: Courier New;">${stringifiedValue}</span>`)
                    objectButton.off("click")
                    objectButton.on("click", listener)
                })
            })
            div.append(objectButton)
        } else {
            let itemInput = $(`<input style="margin-right: 2em;" type="text" value="${value}"></input>`)
            let itemSubmit = $(`<button>Submit</button>`)
            let scroll = body[0].scrollTop
            div.append(itemInput, itemSubmit)
            itemSubmit.off("click")
            itemSubmit.on("click", () => {
                let successMsg = $(`<span class="successMsg" style="color: green; margin-left: 2em;">Changed to ${itemInput.val()}!</span>`)
                div.append(successMsg)
                setTimeout(() => { div.children(".successMsg").remove() }, 1000)
                assignTo[key] = +itemInput.val() ?? itemInput.val()
            })
        }
        return div;
    })
}
$("#userScriptCheatMenu").on("click", () => {
    let body = $("#ui-dialog-body")
    let { variables } = State.active
    let div = $(`<div></div>`)
    div.append(displayVariables(variables))
    UI.alert()
    body.html("")
    body.append(div)
})