// ==UserScript==
// @name         Twitch, Auto reload when *k error
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472868/Twitch%2C%20Auto%20reload%20when%20%2Ak%20error.user.js
// @updateURL https://update.greasyfork.org/scripts/472868/Twitch%2C%20Auto%20reload%20when%20%2Ak%20error.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        var button = document.querySelector(".content-overlay-gate__allow-pointers button");
        if (button) {
            button.click();
        }
    }, 1000);
})();