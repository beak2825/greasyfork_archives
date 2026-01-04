// ==UserScript==
// @name         Shell Shockers Green-Yellow-Blue Theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Custom Shell Shockers theme in green, yellow, and blue
// @author       Hans
// @match        *://shellshock.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/528472/Shell%20Shockers%20Green-Yellow-Blue%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/528472/Shell%20Shockers%20Green-Yellow-Blue%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        body {
            background: linear-gradient(45deg, #004d00, #008000, #00b300);
        }

        /* Main UI colors */
        .hud, .menu, .leaderboard, .shop, .modal {
            background: rgba(0, 128, 255, 0.85) !important;
            color: #ffff00 !important;
            border: 2px solid #ff0;
        }

        /* Buttons */
        button {
            background: #ffcc00 !important;
            color: #004d00 !important;
            border: 2px solid #008000 !important;
        }

        button:hover {
            background: #ffff00 !important;
            color: #000 !important;
        }

        /* Killfeed */
        .kill-feed {
            background: rgba(0, 128, 255, 0.9) !important;
            color: #ffff00 !important;
        }

        /* Scoreboard */
        .leaderboard {
            background: rgba(0, 77, 0, 0.9) !important;
        }

        .leaderboard-entry {
            background: rgba(255, 204, 0, 0.8) !important;
            color: #004d00 !important;
        }

        /* Crosshair */
        .crosshair {
            background: radial-gradient(circle, #ffff00, #008000) !important;
        }
    `);
})();
