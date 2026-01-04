// ==UserScript==
// @name         Trovo One Punch Ban
// @namespace    einarsnow
// @version      1.2
// @author       einarsnow
// @license      MIT
// @description  Ban users in Trovo chat by click
// @supportURL   https://github.com/einarsnow/trovo-one-punch-ban
// @match        https://trovo.live/s/*
// @match        https://trovo.live/chat/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/453781/Trovo%20One%20Punch%20Ban.user.js
// @updateURL https://update.greasyfork.org/scripts/453781/Trovo%20One%20Punch%20Ban.meta.js
// ==/UserScript==


const buttonTemplate = `
    <div class="custom-menu flex align-center" style="width: 25px;">
        <svg aria-hidden="true" data-username="NAME" class="svg-icon icon hover-highlight icon-ban">
            <use xlink:href="#icon-ban"></use>
        </svg>
    </div>
`

var styleElement = null
var autobanMenuId = null
var styleMenuId = null
var autobanState = GM_getValue("autobanState", true)
var styleState = GM_getValue("styleState", true)

function renderMenu() {
    if (autobanMenuId != null) GM_unregisterMenuCommand(autobanMenuId)
    if (styleMenuId != null) GM_unregisterMenuCommand(styleMenuId)
    autobanMenuId = GM_registerMenuCommand(autobanState ? "turn off autoban" : "turn on autoban", () => {
        autobanState = !autobanState
        GM_setValue("autobanState", autobanState)
    })
    styleMenuId = GM_registerMenuCommand(styleState ? "turn off style" : "turn on style", () => {
        styleState = !styleState
        GM_setValue("styleState", styleState)
    })
}

function renderStyle() {
    if (styleElement != null) styleElement.remove()
    if (!styleState) return
    styleElement = GM_addStyle(`
        .message-user {
            padding-bottom: 18px !important;
        }
        .message-time {
            display: block !important;
            background: none !important;
            bottom: 0 !important;
            z-index: 2 !important;
        }
    `)
}

GM_addValueChangeListener("autobanState", function() {
    autobanState = arguments[2]
    renderMenu()
})

GM_addValueChangeListener("styleState", function() {
    styleState = arguments[2]
    renderMenu()
    renderStyle()
})

renderMenu()
renderStyle()

var loadingId = setInterval(function() {
    const chat = document.querySelector("ul.chat-list")
    let input = document.querySelector("div.editor")
    if (chat != null && input != null) {
        chat.addEventListener("click", (e) => {
            if (e.target.dataset.username == null) return

            input.innerText = `/ban @${e.target.dataset.username}`
            input.dispatchEvent(new Event("input"))
            if (autobanState) { setTimeout(() => { document.querySelector(".btn-send").click() }, 100) }
        })

        chat.addEventListener("DOMNodeInserted", (e) => {
            if (e.target.nodeType != 1) return

            let usernameElement = e.target.querySelector("span.nick-name")
            if (usernameElement != null) { e.target.querySelector("div.custom-menu").insertAdjacentHTML("beforebegin", buttonTemplate.replace("NAME", usernameElement.innerText)) }
        })

        clearInterval(loadingId)
    }
}, 2000)
