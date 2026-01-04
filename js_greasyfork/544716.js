// ==UserScript==
// @name         Reddit Full Text Copy Enabler
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enables text selection and copying on all parts of Reddit pages by overriding CSS rules.
// @author       torch
// @match        *://*.reddit.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/544716/Reddit%20Full%20Text%20Copy%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/544716/Reddit%20Full%20Text%20Copy%20Enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // This function injects CSS that overrides any "user-select: none" rules.
    // By using "!important", we ensure this style takes precedence.
    // It is applied to all elements (*) on the page.
    GM_addStyle(`
        * {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }
    `);
})();