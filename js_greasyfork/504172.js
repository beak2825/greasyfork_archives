// ==UserScript==
// @name         Visual Robux Hack
// @namespace    http://tampermonkey.net/
// @author       x0fs7t1w
// @version      0.1
// @description  Change the Robux amount
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504172/Visual%20Robux%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/504172/Visual%20Robux%20Hack.meta.js
// ==/UserScript==

// I create this script only for fun :D
// - x0fs7t1w

(function() {
    'use strict';

    function visualRobuxHack() {                                                  // <-- Start Function
        var element = document.getElementById('nav-robux-amount');                // <-- Find Robux ID
        if (element) {
            element.textContent = '10000000000';                                      // <-- if we found the Robux ID, then change its value to 10000000000
        } else {
            console.log('Robux ID not found');
        }
    }

    window.addEventListener('load', function() {
        setTimeout(visualRobuxHack, 1000);
    });
})();
