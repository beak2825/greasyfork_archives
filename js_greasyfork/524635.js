// ==UserScript==
// @name         Hide Scrollbars
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      CC BY-NC
// @description  Make all scrollbars invisible on websites
// @author       Unknown Hacker
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524635/Hide%20Scrollbars.user.js
// @updateURL https://update.greasyfork.org/scripts/524635/Hide%20Scrollbars.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        ::-webkit-scrollbar {
            display: none;
        }
        * {
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
    `;
    document.head.appendChild(style);
})();
