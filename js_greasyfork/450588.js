// ==UserScript==
// @name         React - remove spam banners along top of site
// @namespace    Violentmonkey Scripts
// @match        *://*.react.dev/*
// @version      3.2
// @author       jez9999
// @description  React - removes any real-estate-chomping spam banners along the top of the site's every page
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-body
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450588/React%20-%20remove%20spam%20banners%20along%20top%20of%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/450588/React%20-%20remove%20spam%20banners%20along%20top%20of%20site.meta.js
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
    utils.jq = jQuery.noConflict(true);
    utils.isUnspecified = function(input) {
        return ((typeof input === "undefined") || (input === null));
    }
    utils.isSpecified = function(input) {
        return ((typeof input !== "undefined") && (input !== null));
    }

    // Add CSS
    var sheet = document.createElement('style');
    sheet.innerHTML = 'header:has(nav) > div:not(:has(nav)) { display: none !important; }';
    document.head.appendChild(sheet);
})();
