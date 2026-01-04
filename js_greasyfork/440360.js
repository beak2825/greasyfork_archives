// ==UserScript==
// @name         Aggie chat scroll fixer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fix chat scrolling issue in aggie.io
// @author       You
// @match        https://aggie.io/*
// @icon         https://www.google.com/s2/favicons?domain=aggie.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440360/Aggie%20chat%20scroll%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/440360/Aggie%20chat%20scroll%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const applyPatch = () => {
        document.querySelector("button[command=chat]").addEventListener("click", () => {
            setTimeout(() => {
                const el = document.querySelector("div.chat-box-messages-container");
                el.scrollTop = el.scrollHeight * 2;
            }, 200);
        });
        console.debug("Chat scroll patched!");
    };

    const looper = setInterval(() => {
        if(document.querySelector("button[command=chat]")) {
            applyPatch();
            clearInterval(looper);
        }
    }, 100);
})();