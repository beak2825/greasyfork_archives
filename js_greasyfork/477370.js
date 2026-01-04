// ==UserScript==
// @name         AliExpress Link Cleaner
// @namespace    http://aliexpress.com/
// @version      1.3
// @description  Cleans AliExpress product URLs by removing unnecessary query strings and fragments.
// @match        *://*.aliexpress.com/item/*
// @match        *://*.aliexpress.*.*/item/*
// @match        *://aliexpress.us/item/*
// @icon         https://ae01.alicdn.com/kf/S05616f829f70427eb3389e1489f66613F.ico
// @grant        none
// @run-at       document-start
// @license      Non-Commercial Use Only
// @downloadURL https://update.greasyfork.org/scripts/477370/AliExpress%20Link%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/477370/AliExpress%20Link%20Cleaner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const currentUrl = window.location.href;
    const url = new URL(currentUrl);

    // Cleaned URL = origin + pathname (removes ? and #)
    const cleanedUrl = url.origin + url.pathname;

    if (currentUrl !== cleanedUrl) {
        window.location.replace(cleanedUrl);
    }
})();