// ==UserScript==
// @name         nothing, dw about it
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modifies CSS on torn.com
// @author       G
// @match        https://*.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540650/nothing%2C%20dw%20about%20it.user.js
// @updateURL https://update.greasyfork.org/scripts/540650/nothing%2C%20dw%20about%20it.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .appHeader___gUnYC>:nth-child(2) {
            margin-left: auto !important;
        }
    `;
    document.head.appendChild(style);
})();