// ==UserScript==
// @name         Remove TwitchAdBlock Popup
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-closing the Twitch Ad Blocker Extension popup
// @author       Shadoweb
// @match        *://*.twitch.tv/*
// @icon         https://cdn-icons-png.flaticon.com/512/3991/3991943.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495294/Remove%20TwitchAdBlock%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/495294/Remove%20TwitchAdBlock%20Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const popup = document.querySelector("div:has(div#twtvdonate)");
    popup.remove();
})();