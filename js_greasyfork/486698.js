// ==UserScript==
// @name         7TV Chaos Mod Filter
// @version      0.4
// @license      MIT
// @description  Filter numbers from chat with 7TV extension enabled.
// @author       declider
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @run-at       document-end
// @namespace    https://greasyfork.org/users/1257876
// @downloadURL https://update.greasyfork.org/scripts/486698/7TV%20Chaos%20Mod%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/486698/7TV%20Chaos%20Mod%20Filter.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */

const numbers = "12345678" /* Регулярка работала криво */
const invisible = new RegExp(/[\uD800-\uDFFF]/, "gi")
let chat


function callback(mutationlist, observer) {
    for (const mutation of mutationlist) {
        if (mutation.type != "childList") { continue }
        let msg = mutation.addedNodes[0]
        if ( !msg ) { continue }

        let span = msg.querySelector("span.text-token")
        if ( !span ) { continue }

        let text = msg.querySelector("span.text-token").innerText
        let children = msg.querySelector(".seventv-chat-message-body").childElementCount

        text = text.replaceAll(invisible, "").trim();
        if (text.length == 1 && numbers.includes(text) && children < 2) {
            chat.removeChild(msg)
        }
    }
}


let readyChecker = setInterval(() => {
    const observer = new MutationObserver(callback)

    console.log("Попытка получить чат...")

    chat = document.querySelector("main.seventv-chat-list")

    observer.observe(chat, {
        childList: true
    })

    clearInterval(readyChecker)

    console.log("Чат найден, фильтр включён!")

}, 1000)
