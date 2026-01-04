// ==UserScript==
// @name         Linkvertise Bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Try to bypass Linkvertise
// @author       V
// @match        *://*.linkvertise.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488166/Linkvertise%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/488166/Linkvertise%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the current tab is a Linkvertise page
    if (window.location.host.includes('linkvertise.com')) {
        // Get the final URL from the page
        var finalUrl = document.querySelector('a.btn.btn-primary.btn-block').href;

        // Redirect to the final URL
        window.location.replace(finalUrl);
    }
})();