// ==UserScript==
// @name         URL Whitelist and Blacklist
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Whitelist and blacklist URLs based on keywords
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502119/URL%20Whitelist%20and%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/502119/URL%20Whitelist%20and%20Blacklist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const safeRedirectUrl = 'https://pbskids.org/';       // URL to redirect to if not whitelisted or blacklisted

    // List of whitelisted keywords
    const whitelistKeywords = ['pbskids.org', 'example2'];

    // List of blacklisted keywords
    const blacklistKeywords = ['video', 'block2'];

    // Get the current URL
    const currentUrl = window.location.href;

    // Function to check if any keyword exists in the URL
    function containsKeyword(url, keywords) {
        return keywords.some(keyword => url.includes(keyword));
    }

    // Check if the URL is whitelisted
    const isWhitelisted = containsKeyword(currentUrl, whitelistKeywords);

    // Check if the URL is blacklisted
    const isBlacklisted = containsKeyword(currentUrl, blacklistKeywords);

    // Redirect or take action based on the whitelist and blacklist
    if (isBlacklisted) {
        console.log('URL is blacklisted. Redirecting...');
        window.location.href = safeRedirectUrl; // Redirect to a safe page
    } else if (!isWhitelisted) {
        console.log('URL is not whitelisted. Redirecting...');
        window.location.href = safeRedirectUrl; // Redirect to a safe page
    } else {
        console.log('URL is whitelisted. Allowing access.');
    }
})();
