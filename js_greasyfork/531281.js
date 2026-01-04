// ==UserScript==
// @name         Shell Shockers Rainbow Theme
// @namespace    http://tampermonkey.net/
// @version      V1
// @description  Adds a beautiful rainbow background to Shell Shockers That Changes Colors every second.
// @author       CoffeeGamer2025
// @match        https://shellshock.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/531281/Shell%20Shockers%20Rainbow%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/531281/Shell%20Shockers%20Rainbow%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS for the rainbow background
    GM_addStyle(`
        body {
            background: linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet);
            background-size: 400% 400%;
            animation: rainbowAnimation 10s ease infinite;
        }

        @keyframes rainbowAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        /* Optional: Make the background cover the whole page */
        html, body {
            height: 100%;
            margin: 0;
        }
    `);
})();
