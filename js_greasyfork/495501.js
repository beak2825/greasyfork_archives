// ==UserScript==
// @name         Instagram Anti-Tracking (READ CAPTION ON GREASYFORK)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  disable Instagram tracking
// @author       YourName
// @match        https://www.instagram.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495501/Instagram%20Anti-Tracking%20%28READ%20CAPTION%20ON%20GREASYFORK%29.user.js
// @updateURL https://update.greasyfork.org/scripts/495501/Instagram%20Anti-Tracking%20%28READ%20CAPTION%20ON%20GREASYFORK%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Disable analytics tracking
    function disableAnalytics() {
        window.ga = function() { return null; };
        window.fbq = function() { return null; };
        window._paq = { push: function() {} };
    }

    // Disable specific tracking functions
    function disableTrackingFunctions() {
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (url.includes('/ajax/bz') || url.includes('/logging_client_events')) {
                // Block requests to specific tracking endpoints
                console.log('Blocked tracking request:', url);
                return;
            }
            return originalXHROpen.apply(this, arguments);
        };

        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            if (typeof url === 'string' && (url.includes('/ajax/bz') || url.includes('/logging_client_events'))) {
                // Block fetch requests to specific tracking endpoints
                console.log('Blocked tracking request:', url);
                return new Promise((resolve, reject) => {
                    resolve(new Response('{}', { status: 200, statusText: 'OK' }));
                });
            }
            return originalFetch.apply(this, arguments);
        };
    }

    // Execute the functions to disable tracking
    disableAnalytics();
    disableTrackingFunctions();

    console.log('Instagram Anti-Tracking script has been activated.');
})();
