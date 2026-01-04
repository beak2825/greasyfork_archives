// ==UserScript==
// @name         Shell Shockers Red-Blue-Black Theme
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Applies a red, blue, and black theme with animated buttons.
// @author       Hans
// @match        *://shellshock.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527764/Shell%20Shockers%20Red-Blue-Black%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/527764/Shell%20Shockers%20Red-Blue-Black%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        body { background: linear-gradient(45deg, #ff0000, #1e90ff, #000000) !important; color: #fff !important; }
        .hud-wrapper, .menu-wrapper, .leaderboard, .modal-content, .popup, .modal-dialog { background: rgba(0, 0, 0, 0.8) !important; }
        .hud-score, .menu-button, .leaderboard-entry, .btn, .btn-primary, .btn-secondary, button { color: #fff !important; border-color: #ff0000 !important; }
        .btn, .btn-primary, .btn-secondary, button { background: linear-gradient(45deg, #ff0000, #1e90ff, #000000) !important; transition: 0.4s; }
        .btn:hover, .btn-primary:hover, .btn-secondary:hover, button:hover { background: linear-gradient(45deg, #1e90ff, #000000, #ff0000) !important; color: #fff !important; animation: colorShift 1s linear infinite; }
        @keyframes colorShift { 0%, 100% { background: linear-gradient(45deg, #ff0000, #1e90ff, #000000); } 50% { background: linear-gradient(45deg, #1e90ff, #000000, #ff0000); } }
        .progress-bar { background: linear-gradient(90deg, #1e90ff, #ff0000) !important; }
    `);
})();
