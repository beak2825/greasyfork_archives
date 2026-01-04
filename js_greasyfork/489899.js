// ==UserScript==
// @name         UI Upgrade
// @namespace    com.Ethan.griver
// @version      2.1.0
// @description  UI upgrade...
// @author       Ethan
// @license      MIT
// @match        *://search.griver.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489899/UI%20Upgrade.user.js
// @updateURL https://update.greasyfork.org/scripts/489899/UI%20Upgrade.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.innerHTML = `
        .checkoutsCheckbox {
            transform: scale(2);
            margin-right: 10px; /* Adjust as needed */
        }
    `;
    document.head.appendChild(style);
})();
