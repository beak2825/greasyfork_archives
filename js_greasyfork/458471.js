// ==UserScript==
// @name         Quick Disconnect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Quickly disconnect from the game with a keybind
// @author       mr.cheese
// @match        https://evades.io/*
// @match        https://evades.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=evades.io
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458471/Quick%20Disconnect.user.js
// @updateURL https://update.greasyfork.org/scripts/458471/Quick%20Disconnect.meta.js
// ==/UserScript==



document.addEventListener('keydown', (e) => {
    if (e.keyCode === 66 && e.ctrlKey) {
        const chatInput = document.querySelector('#chat-input');
        if(chatInput){
            chatInput.value = '/dc';
            setTimeout(() => {
                for (let i = 0; i < 2; i++) {
                    var enterEvent = new KeyboardEvent("keydown", {
                        bubbles: true,
                        cancelable: true,
                        keyCode: 13
                    });
                    chatInput.dispatchEvent(enterEvent);
                }
            }, 5);
            e.preventDefault();
        }
    }
});
