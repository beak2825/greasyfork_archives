// ==UserScript==
// @name         Janitor AI - Set max width
// @namespace
// @version      1.0
// @description  Override max-width from media query CSS
// @match        https://janitorai.com/chats/*
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1498687
// @downloadURL https://update.greasyfork.org/scripts/543739/Janitor%20AI%20-%20Set%20max%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/543739/Janitor%20AI%20-%20Set%20max%20width.meta.js
// ==/UserScript==

// === CONFIGURATION ===
const MAX_WIDTH = 'none'; // change this setting to whatever you want e.g., 'none', '100%', '1200px'

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        @media (min-width: 30em) {
            ._messagesMain_1swu7_10 {
                max-width: none !important;
                width: ${MAX_WIDTH} !important;
            }
        }
    `;
    document.head.appendChild(style);
})();