// ==UserScript==
// @name         /noparse in chat
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Enables the use of /noparse to insert 0-width spaces
// @author       JK_3
// @match        https://www.warzone.com/MultiPlayer?ChatRoom=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469392/noparse%20in%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/469392/noparse%20in%20chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const Prefix = "/"
    const KeyWords = {
        "noparse": "\u200B",
        "leftrightmark": "\u200E",
        "tableflip": "(╯°□°)╯︵ ┻━┻",
        "unflip": "┬─┬ノ( º _ ºノ)",
    }

    function handleEvent(event) {
        let textInputBox = document.getElementById(event.srcElement.id)
        let text = textInputBox.value

        for (const [key, value] of Object.entries(KeyWords)) {
            text = text.replace(Prefix + key, value)
        }

        textInputBox.value = text
    }

    console.log("Starting /noparse script")

    let waitPopup = document.getElementById("WaitDialogJSMainDiv")
    let intervalID = null

    function checkIfPageReady(){
        if (waitPopup.style.display == 'none') {
            clearInterval(intervalID)

            for (let input of document.querySelectorAll("[id^='ujs_SendChatText'][id$='input']")) {
                input.oninput = handleEvent
            }

            console.log("Completed /noparse script")
        }
    }

    intervalID = setInterval(checkIfPageReady, 250)
})();
