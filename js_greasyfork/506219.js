// ==UserScript==
// @name         Obsidian Clipper
// @version      0.2
// @description  Clip url of current page to Obsidian existing note
// @author       declider
// @match        *://*/*
// @icon         https://obsidian.md/favicon.ico
// @grant        GM_registerMenuCommand
// @namespace    https://greasyfork.org/users/1257876
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506219/Obsidian%20Clipper.user.js
// @updateURL https://update.greasyfork.org/scripts/506219/Obsidian%20Clipper.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */

// First of all, you need to install advancedURI in Obsidian plugins and enable it
// Then edit values below
const vault       = "Daily" // Name of your vault
const filepath    = "Заметки/Chrome Clippings" // Path to your note
const includeDate = true // Include date or not, can be false or true
// The end of settings





const url = `obsidian://advanced-uri?mode=append&vault=${vault}&filepath=${filepath}&data=` // don't edit this

function openURL(data) {
    let a = document.createElement('a')
    a.href = encodeURI(data)
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}


function saveURL() {
    let title = prompt("Enter name for link", document.title)
    if (!title) { return }
    let link = encodeURIComponent(window.location.href)
    let date = includeDate ? "  " + new Date().toLocaleDateString() : ""
    let data = `\n${url}\n[${title}](${link})${date}`
    openURL(data)
}

GM_registerMenuCommand("Bookmark", saveURL, "u")