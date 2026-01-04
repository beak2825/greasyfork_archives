// ==UserScript==
// @name         Visual Robux Changer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Changes your robux fake
// @author       Xavior S
// @match        https://www.roblox.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544148/Visual%20Robux%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/544148/Visual%20Robux%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the element to exist on the page
    function updateRobux() {
        const robuxSpan = document.getElementById('nav-robux-amount');
        if (robuxSpan) {
            robuxSpan.textContent = '9999';  // Change to whatever ammount you want
            console.log('vrcWorking');
        } else {

            setTimeout(updateRobux, 100);
        }
    }

    updateRobux();
})();