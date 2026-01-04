// ==UserScript==
// @name         DuckDuckGo Anti-White Flash Fix
// @namespace    https://github.com/violentmonkey/violentmonkey
// @version      1.1
// @description  Prevent white flash before DuckDuckGo dark theme is applied
// @author       github:Torsteinvin - Edited by ChatGPT
// @match        *://*.duckduckgo.com/*
// @run-at       document-start
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/536624/DuckDuckGo%20Anti-White%20Flash%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/536624/DuckDuckGo%20Anti-White%20Flash%20Fix.meta.js
// ==/UserScript==

/* original idea came from: https://github.com/TorsteinVin/Duckduckgo-white-flash-fix/blob/main/duckduckgo-torsteinvin-white-flash-fix.css */

(function () {
    'use strict';

    const css = `
        /* Set a dark default background for html and body */
        html, body {
            background-color: #161616 !important;
            color-scheme: dark;
        }

        /* Respect user color scheme */
        @media (prefers-color-scheme: light) {
            html, body {
                background-color: #ffffff !important;
                color-scheme: light;
            }
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.documentElement.appendChild(style);
})();
