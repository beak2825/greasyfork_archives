// ==UserScript==
// @name         Perfect Tower 2 Module Tracker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows players of Perfect Tower 2 to track their modules on the wiki
// @author       Fordorth A.k.a Thomas
// @match        https://www.perfecttower2.com/wiki/Ocean
// @match        https://www.perfecttower2.com/wiki/Neutral
// @match        https://www.perfecttower2.com/wiki/Dark_Realm
// @match        https://www.perfecttower2.com/wiki/Heaven
// @match        https://www.perfecttower2.com/wiki/Universe
// @match        https://www.perfecttower2.com/wiki/Chaos
// @match        https://www.perfecttower2.com/wiki/Beach
// @match        https://www.perfecttower2.com/wiki/Metallic_Ruins
// @match        https://www.perfecttower2.com/wiki/Jungle
// @match        https://www.perfecttower2.com/wiki/High_Mountain
// @match        https://www.perfecttower2.com/wiki/Volcano
// @match        https://www.perfecttower2.com/wiki/Underground
// @match        https://www.perfecttower2.com/wiki/Winter
// @match        https://www.perfecttower2.com/wiki/Desert
// @match        https://www.perfecttower2.com/wiki/Forest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=perfecttower2.com
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/458228/Perfect%20Tower%202%20Module%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/458228/Perfect%20Tower%202%20Module%20Tracker.meta.js
// ==/UserScript==

// Your code here...
$(document).ready(() => {
    let modules = localStorage.getItem("modules")
    !modules ? modules = [] : modules = JSON.parse(modules)
    const onClickHandler = function(e) {
        let name = e.target.id.split("_")[0]
        let index = modules.findIndex(module => module.name === name)
        let status = e.target.checked
        if(index < 0) {
            let temp = {name: name, status: e.target.checked}
            modules = [...modules, temp]
        } else {

            modules[index].status = status
        }
        let tempObj = {
            modules
        }
        localStorage.setItem("modules", JSON.stringify(modules))
    }
    let table = $('.wikitable.sortable')[0]
    let tableDetails = Array.prototype.slice.call(table.children[0].children)
    for(let rowNumber = 0; rowNumber < tableDetails.length; rowNumber++) {
        if( rowNumber === 0) {
            tableDetails[rowNumber].innerHTML += '<th>Completed</th>'
        } else {
            let moduleName = tableDetails[rowNumber].children[1].children[0].innerText.toLowerCase().replace(" ", "-")
            let id = moduleName + "_checkbox"
            let checkBoxHTML = ""
            let index = modules.findIndex(module => module.name === moduleName)

            tableDetails[rowNumber].innerHTML += `<td><input type="checkbox" id=${id} ${index >= 0 ? modules[index].status ? "checked" : null : null} /></td>`
                   tableDetails[rowNumber].children[3].children[0].addEventListener("change", onClickHandler)
                   }
    }
})