// ==UserScript==
// @name         Namecheap - remove spam banners along top of site
// @namespace    Violentmonkey Scripts
// @match        *://*.namecheap.com/*
// @version      1.4
// @author       jez9999
// @description  Namecheap - removes any real-estate-chomping spam banners along the top of the site's every page
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450589/Namecheap%20-%20remove%20spam%20banners%20along%20top%20of%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/450589/Namecheap%20-%20remove%20spam%20banners%20along%20top%20of%20site.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ********************
    // Reminder: set the following in Violentmonkey advanced settings for Editor:
    // "tabSize": 4,
    // "indentUnit": 4,
    // "autoCloseBrackets": false,
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
        header:has(* nav) > * > div:not(:has(nav)):not(:has(button)) { display: none !important; }
        .gb-stand-with-ukraine-banner { display: none !important; }
    `;
    document.head.appendChild(sheet);
})();
