// ==UserScript==
// @name         YouTube Dr. Tag
// @namespace    einarsnow
// @version      1.0
// @author       einarsnow
// @license      MIT
// @description  Tag user in YouTube live chat by click
// @supportURL   https://github.com/einarsnow/youtube-dr-tag
// @match        https://www.youtube.com/live_chat*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/453782/YouTube%20Dr%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/453782/YouTube%20Dr%20Tag.meta.js
// ==/UserScript==

GM_addStyle(`
    #author-name {
        cursor: pointer;
    }
    #author-name:hover {
        text-decoration: underline;
    }
`)

const chat = document.querySelector("#chat")
chat.addEventListener("click", function(e) {
    if (e.target.id != "author-name") return

    let input = document.querySelector("#input[contenteditable]")
    input.innerText = `@${e.target.innerText}\xa0${input.innerText}`
    input.dispatchEvent(new Event("input"))

    const range = document.createRange()
    range.setStart(input, 1)
    range.collapse(true)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)

    input.focus()
})