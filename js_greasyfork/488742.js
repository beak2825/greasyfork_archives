// ==UserScript==
// @name         Reddit Redirect Enhanced
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description Redirect reddit.com and its subdomains to new.reddit.com, preserving URL path and query parameters, without creating an infinite loop
// @author       Your Name
// @match        *://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488742/Reddit%20Redirect%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/488742/Reddit%20Redirect%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the current URL is a subdomain of reddit.com and not already on new.reddit.com
    if (window.location.hostname.endsWith('.reddit.com') && !window.location.hostname.startsWith('new.')) {
        // Preserve the URL path and query parameters
        const pathAndQuery = window.location.pathname + window.location.search;

        // Redirect to new.reddit.com, preserving the path and query parameters
        window.location.href = 'https://new.reddit.com' + pathAndQuery;
    }
})();