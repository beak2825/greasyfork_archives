// ==UserScript==
// @name         Linkvertise Bypasser (Automated)
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Bypass Linkvertise links and automatically click the "Continue" button
// @author       Your name
// @match        https://example.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485230/Linkvertise%20Bypasser%20%28Automated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/485230/Linkvertise%20Bypasser%20%28Automated%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Bypass Linkvertise links
    var link = window.location.href;
    if (link.includes('linkvertise.com')) {
        var bypassLink = link.replace('https://linkvertise.com/', 'https://bypass.city/');
        window.location.href = bypassLink;
    }

    // Automatically click the "Continue" button
    var continueButton = document.querySelector('.btn-primary');
    if (continueButton) {
        continueButton.click();
    }
})();
