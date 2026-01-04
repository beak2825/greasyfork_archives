// ==UserScript==
// @name         GC AIO Plugin: Notepad
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a notepad to the sidebar on Grundo's Café
// @author       https://www.grundos.cafe/userlookup/?user=supercow64
// @match        https://www.grundos.cafe/*
// @icon         https://www.grundos.cafe/static/images/favicon.66a6c5f11278.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450289/GC%20AIO%20Plugin%3A%20Notepad.user.js
// @updateURL https://update.greasyfork.org/scripts/450289/GC%20AIO%20Plugin%3A%20Notepad.meta.js
// ==/UserScript==

const html = `<div class="notepad">
    <b>Notepad</b>
    <textarea id="aio_notepad"></textarea>
</div>`

const defaultText = `Tip: Click "Edit Sidebar" and add this code to make the sidebar prettier

#aio_notepad {
    width: 100%;
    height: 200px;
    border: 1px solid lightblue;
}`

// uncomment for testing
// const localStorage = sessionStorage

async function main() {
    // add the sidebar
    const target = document.querySelector("#aio_sidebar > .dailies")
    if (!target) return
    target.insertAdjacentHTML(`beforebegin`, html)

    // set the notepad text
    const notepad = document.querySelector("#aio_notepad")
    notepad.value = localStorage["aio_notepad"] ?? defaultText
    
    // save notepad changes
    notepad.addEventListener("change", async () => {
        localStorage["aio_notepad"] = notepad.value
    })
}

main()