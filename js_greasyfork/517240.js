// ==UserScript==
// @name         Discord Folder Titles
// @namespace    http://tampermonkey.net/
// @version      2024-11-11
// @description  Adds the name of your folders under each folder
// @author       You
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517240/Discord%20Folder%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/517240/Discord%20Folder%20Titles.meta.js
// ==/UserScript==

(function() {
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

const folderNames = window.setInterval(function() {
    let folders = Array.from(document.getElementsByClassName("folder_bc7085"))
    document.querySelector('[aria-label="Servers"]').style = "text-align: center;";
    folders.forEach(function (e) {
        const label = document.createElement("p");
        label.innerHTML = e.parentElement.parentElement.parentElement.parentElement.getAttribute("data-dnd-name");
        window.setInterval(function () {
            label.innerHTML = e.parentElement.parentElement.parentElement.parentElement.getAttribute("data-dnd-name");
        })
        label.classList.add("folderName")
        label.style = "color: white; font-size: 12px;"
        insertAfter(e.parentElement.parentElement.parentElement.parentElement.parentElement, label)
        // console.log(label, e.parentElement.parentElement.parentElement.parentElement.getAttribute("data-dnd-name"), e.parentElement.parentElement.parentElement.parentElement)
    })
    if (Array.from(document.getElementsByClassName("folderName")) != "") {
        clearInterval(folderNames)
    }
}, 1000)
})();