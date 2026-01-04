// ==UserScript==
// @name         YouTube - Remove YouTube shorts and noise from main page
// @namespace    Violentmonkey Scripts
// @match        *://www.youtube.com/*
// @version      2.8
// @author       jez9999
// @description  YouTube - Remove YouTube shorts and noise from the main page
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450047/YouTube%20-%20Remove%20YouTube%20shorts%20and%20noise%20from%20main%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/450047/YouTube%20-%20Remove%20YouTube%20shorts%20and%20noise%20from%20main%20page.meta.js
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

    var utils = {};
    utils.jq = jQuery.noConflict( true );
    utils.isUnspecified = function(input) {
        return ((typeof input === "undefined") || (input === null));
    }
    utils.isSpecified = function(input) {
        return ((typeof input !== "undefined") && (input !== null));
    }

    // Add 'hidden renderer' class
    var sheet = document.createElement('style');
    sheet.innerHTML = `
        ytd-rich-section-renderer { display: none !important; }
    `;
    // ^ If we ever want to hide the parent ytd-rich-section-renderer instead of the ytd-rich-shelf-renderer in future, we can use the :has pseudo-class thus:
    // sheet.innerHTML = `
    //     ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]) { display: none !important; }
    // `;

    sheet.innerHTML = sheet.innerHTML + `
        ytd-statement-banner-renderer { display: none !important; }
        .ytd-video-masthead-ad-v3-renderer { display: none !important; }
        #masthead-ad { display: none !important; }
        ytd-brand-video-singleton-renderer { display: none !important; }
    `;

    document.head.appendChild(sheet);
})();
