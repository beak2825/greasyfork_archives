// ==UserScript==
// @name         LZT BoldMessage
// @namespace    https://greasyfork.org/ru/users/1142494-llimonix
// @version      1.4
// @description  Всегда пишем жирным текстом
// @author       llimonix
// @match        https://zelenka.guru/threads/*
// @match        https://lolz.guru/threads/*
// @icon         https://cdn-icons-png.flaticon.com/512/5838/5838522.png
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476624/LZT%20BoldMessage.user.js
// @updateURL https://update.greasyfork.org/scripts/476624/LZT%20BoldMessage.meta.js
// ==/UserScript==

(function() {
    const LZTBparentElement = document.querySelector("div.fr-element.fr-view.fr-element-scroll-visible");
    function wrapTextInBoldAndCenter(element) {
        element.innerHTML = `<div style="font-weight: bold;">${element.innerHTML}</div>`;
    }
    function handleMessages() {
        const LZTBmessages = document.querySelectorAll('div.fr-element:not(.processed), .custom:not(.processed)');
        LZTBmessages.forEach(message => {
            wrapTextInBoldAndCenter(LZTBmessages);
            LZTBparentElement.classList.add('processed');
        });
        const LZTBnestedDiv = LZTBparentElement.querySelector("div");
        if (!LZTBnestedDiv) {
            if (LZTBmessages.innerHTML == undefined) {
                LZTBparentElement.innerHTML = `<div style="font-weight: bold">${LZTBparentElement.innerHTML}</div>`;
            } else {
                LZTBparentElement.innerHTML = `<div style="font-weight: bold;">${LZTBparentElement.innerHTML}</div>`;
            }
        }
    }
    LZTBparentElement.addEventListener("keydown", function(event) {
        handleMessages();
    });
})();
