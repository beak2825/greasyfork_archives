// ==UserScript==
// @name         WebToons Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enable dark mode on WebToons
// @author       NotACoder
// @match        https://www.webtoons.com/*
// @license      Mlt
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/487209/WebToons%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/487209/WebToons%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add dark mode styles
    GM_addStyle(`
        body {
            background-color: #1e1e1e !important;
            color: #fff !important;
        }

        /* Add more styles for specific elements if needed */
    `);
})();
