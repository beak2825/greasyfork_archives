// ==UserScript==
// @name         Quick Chat
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Quick chat script
// @author       Realwdpcker
// @match        pixelplace.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532860/Quick%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/532860/Quick%20Chat.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const map = {
        49: "/here",
        50: "/darkmode",
        51: "/nextwar",
        52: "",
        53: "",
        54: "",
        55: "",
        56: "",
        57: ""
    };

    document.addEventListener("keydown", function (e) {
        if (e.altKey && map.hasOwnProperty(e.keyCode)) {
            const chatInput = document.querySelector("#chat form input");
            let form = chatInput.closest('form');

            if (chatInput) {
                e.preventDefault();
                chatInput.focus();
                chatInput.value = map[e.keyCode];

                chatInput.dispatchEvent(new Event('input', { bubbles: true }));

                    form.requestSubmit();
            }
        }
    });
})();