// ==UserScript==
// @name         Green Play Button for Roblox
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Restores the classic green Play button on Roblox.
// @author       Mxsonn
// @match        *://*.roblox.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526931/Green%20Play%20Button%20for%20Roblox.user.js
// @updateURL https://update.greasyfork.org/scripts/526931/Green%20Play%20Button%20for%20Roblox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .btn-common-play-game-lg {
                border-radius: 8px !important;
                background-color: #02b758 !important;
                border-color: transparent !important;
                color: #ffffff !important;
            }
        `;
        document.head.appendChild(style);
    }

    applyStyles();
})();
