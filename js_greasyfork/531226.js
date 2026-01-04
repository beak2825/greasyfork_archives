// ==UserScript==
// @name         Torn - API Page Dark Mode
// @namespace    http://tampermonkey.net/
// @version      2025-03-29
// @description  Changes the V1 and V2 API pages to dark mode themes
// @author       You
// @match        https://www.torn.com/api*
// @match        https://www.torn.com/swagger*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531226/Torn%20-%20API%20Page%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/531226/Torn%20-%20API%20Page%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const darkModeStyles = `
        * {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
        }
        a {
            color: #bb86fc !important;
        }
    `;

    const style = document.createElement('style');
    style.textContent = darkModeStyles;
    document.head.appendChild(style);
})();
