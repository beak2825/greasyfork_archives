// ==UserScript==
// @name         Redirect x.com to xcancel.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirect all x.com pages to xcancel.com, preserving the rest of the URL.
// @author       Your Name
// @match        https://x.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521298/Redirect%20xcom%20to%20xcancelcom.user.js
// @updateURL https://update.greasyfork.org/scripts/521298/Redirect%20xcom%20to%20xcancelcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    const currentUrl = window.location.href;

    // Replace "x.com" with "xcancel.com"
    const newUrl = currentUrl.replace(/^https:\/\/x\.com\//, 'https://xcancel.com/');

    // Redirect if the URLs differ
    if (currentUrl !== newUrl) {
        window.location.replace(newUrl);
    }
})();
