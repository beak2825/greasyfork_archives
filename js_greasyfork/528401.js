// ==UserScript==
// @name         Snapchat RGB Pixel Text
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Makes your Snapchat chat text RGB with a pixelated effect
// @author       You
// @match        *://web.snapchat.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528401/Snapchat%20RGB%20Pixel%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/528401/Snapchat%20RGB%20Pixel%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function rgbTextEffect(element) {
        let hue = 0;
        setInterval(() => {
            if (element) {
                hue = (hue + 10) % 360;
                element.style.color = `hsl(${hue}, 100%, 50%)`;
                element.style.fontFamily = 'Courier New, monospace';
                element.style.filter = 'contrast(200%)';
                element.style.textShadow = '0 0 3px rgba(255,255,255,0.8)';
            }
        }, 100);
    }

    function observeChatInput() {
        const observer = new MutationObserver(() => {
            let chatInput = document.querySelector('[contenteditable="true"]');
            if (chatInput) {
                rgbTextEffect(chatInput);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    observeChatInput();
})();
