// ==UserScript==
// @name         Emoji Font Override
// @namespace    https://github.com/sinazadeh/userscripts
// @version      1.0.7
// @description  Override default emoji fonts to prioritize Noto Color Emoji for consistent rendering of Unicode 16 emoji across all websites.
// @author       TheSina
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539701/Emoji%20Font%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/539701/Emoji%20Font%20Override.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
(function () {
    'use strict';

    GM_addStyle(`
        @font-face {
            font-family: 'Segoe UI Emoji';
            src:
                local('Noto Color Emoji'), local('Apple Color Emoji'),
                local('Twemoji Mozilla'), local('Segoe UI Emoji');
            font-display: swap;
            unicode-range:
                U+0023, U+002A, U+0030-0039, U+FE0E-FE0F, U+200D, U+20E3, U+1F3FB-1F3FF,
                U+1F1E6-1F1FF, U+1F100-1F1FF, U+1F200-1F2FF, U+1F300-1F5FF,
                U+1F600-1F64F, U+1F680-1F6FF, U+1F900-1F9FF, U+1FA70-1FAFF,
                U+1FC00-1FCFF, U+2300-23FF, U+2190-21FF, U+2700-27BF, U+2B00-2BFF,
                U+1F780-1F7FF;
        }
    `);
})();
