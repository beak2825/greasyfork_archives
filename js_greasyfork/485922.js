// ==UserScript==
// @name         Krew.io Chat Troll (ORGINAL VERSION)
// @namespace    http://tampermonkey.net/
// @version      2024-01-29
// @description  Chat Troll for krew.io, hacks, krew.io hacks
// @author       DA
// @match        https://krew.io
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485922/Krewio%20Chat%20Troll%20%28ORGINAL%20VERSION%29.user.js
// @updateURL https://update.greasyfork.org/scripts/485922/Krewio%20Chat%20Troll%20%28ORGINAL%20VERSION%29.meta.js
// ==/UserScript==

// - Orginal Version of the krew chat troll. - \\
// Made by dev1argo / Developer Argo

(function() {
    'use strict';

let filter = ["fck", "fuck", "fkk", "n1gga", "btch", "fcker", "mothefkcer", "http", "www", "io"];
let chat_timeout = 1.5;
let HTML = document || body;
let DBG = [0, 0];
let check;
let last_message = '';

setInterval(function () {
    let div = document.querySelector("#chat-history").querySelectorAll('.global-chat.text-white');
    let lastChatDiv = div[div.length - 1];
    if (lastChatDiv && lastChatDiv.innerText !== last_message) {
        let new_date = Date.now();
        if (new_date - DBG[1] >= chat_timeout * 1000) {
            DBG[1] = new_date;
            last_message = lastChatDiv.innerText;
            let messageparts = last_message.split(':');
            if (messageparts.length > 1) {
                let filteredMessage = messageparts[1].trim().split(" ").map(function (datatext) {
                    if (filter.indexOf(datatext) !== -1) {
                        return "|".repeat(datatext.length);
                    } else {
                        return datatext;
                    }
                }).join(" ");
                let token = Array.from({ length: 6 }, () => (Math.random() > 0.5 ? Math.floor(Math.random() * 10) : String.fromCharCode(65 + Math.floor(Math.random() * 26)))).join('');
                var attack_press_DOC = document.getElementById("chat-message");
                attack_press_DOC.value = `${filteredMessage} | ` + token
                var event = new Event('keypress');
                event.which = event.keyCode = 13;
                attack_press_DOC.dispatchEvent(event);
            }
        }
    }
}, 500);

})();