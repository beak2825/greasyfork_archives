// ==UserScript==
// @name         YouTube - Remove YouTube shorts from subscriptions
// @namespace    Violentmonkey Scripts
// @match        *://www.youtube.com/*
// @version      2.4
// @author       jez9999
// @description  YouTube - Remove YouTube shorts from subscriptions list
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445862/YouTube%20-%20Remove%20YouTube%20shorts%20from%20subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/445862/YouTube%20-%20Remove%20YouTube%20shorts%20from%20subscriptions.meta.js
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

    // Add CSS
    var sheet = document.createElement('style');
    sheet.innerHTML = `
        ytd-grid-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]) { display: none !important; }
    `;
    document.head.appendChild(sheet);
})();
