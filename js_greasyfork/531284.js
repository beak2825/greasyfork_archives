// ==UserScript==
// @name         Twitch Rainbow Background
// @namespace    http://tampermonkey.net/
// @version      V1
// @description  Adds a rainbow gradient background to Twitch
// @author       You
// @match        https://www.twitch.tv/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/531284/Twitch%20Rainbow%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/531284/Twitch%20Rainbow%20Background.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a CSS rule for the rainbow background
    GM_addStyle(`
        body {
            background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #00ff00, #00b0ff, #8a00ff, #ff00cc, #ff0000);
            background-size: 300% 300%;
            animation: rainbowBackground 10s ease infinite;
            height: 100%;
            margin: 0;
            color: white; /* Adjust text color for better contrast */
        }

        @keyframes rainbowBackground {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `);
})();
