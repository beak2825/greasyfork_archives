// ==UserScript==
// @name         YouTube - Force five items per row
// @namespace    Violentmonkey Scripts
// @match        *://www.youtube.com/*
// @version      1.0
// @author       jez9999
// @description  Forces five items per row in main/subscriptions feeds
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533932/YouTube%20-%20Force%20five%20items%20per%20row.user.js
// @updateURL https://update.greasyfork.org/scripts/533932/YouTube%20-%20Force%20five%20items%20per%20row.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ********************
    // Reminder: set the following in Violentmonkey advanced settings for Editor:
    // "tabSize": 4,
    // "indentUnit": 4,
    // "autoCloseBrackets": false,
    //
    // Also, bear in mind there appears to be a bug in Violentmonkey where after a while, MutationObserver's
    // stop being debuggable and the whole browser needs restarting before it'll work again.
    // ********************

    // Allow strings for HTML/CSS/etc. trusted injections
	if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {
        window.trustedTypes.createPolicy('default', {
            createHTML: string => string,
            createScriptURL: string => string,
            createScript: string => string
        });
    }

    // Force five items per row
    var sheet = document.createElement('style');
    sheet.innerHTML = `
        ytd-rich-grid-renderer { --ytd-rich-grid-items-per-row: 5 !important; }
    `;

    document.head.appendChild(sheet);
})();
