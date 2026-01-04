// ==UserScript==
// @name         Auto Dark Mode
// @namespace    https://itzmehuman000.github.io/
// @version      1.0
// @description  Automatically applies dark mode to all websites for better eye comfort at night.
// @author       DUSTIN
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523234/Auto%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/523234/Auto%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        body, html {
            background-color: #121212 !important;
            color: #ffffff !important;
        }
        * {
            background: transparent !important;
            color: inherit !important;
        }
        a {
            color: #4A90E2 !important;
        }
    `;
    document.head.appendChild(style);
})();
