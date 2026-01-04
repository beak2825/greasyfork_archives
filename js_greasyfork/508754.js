// ==UserScript==
// @name         Redirect .org to .com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically redirects .org websites to their .com version if available
// @author       Your Name
// @match        *://*.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508754/Redirect%20org%20to%20com.user.js
// @updateURL https://update.greasyfork.org/scripts/508754/Redirect%20org%20to%20com.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of .org sites you don't want to redirect
    const exceptions = [
        'wikipedia.org',
        'archive.org',
        'mozilla.org'
    ];

    // Function to check if a site is an exception
    function isException(hostname) {
        return exceptions.some(exception => hostname.endsWith(exception));
    }

    // Function to log redirection details
    function logRedirection(from, to) {
        console.log(`Redirecting from ${from} to ${to}`);
    }

    // Get the current hostname (e.g., 'example.org')
    const currentHost = window.location.hostname;

    // Check if it's an exception or already on .com
    if (currentHost.endsWith('.org') && !isException(currentHost)) {
        // Replace .org with .com
        const newHost = currentHost.replace('.org', '.com');

        // Log redirection details
        logRedirection(currentHost, newHost);

        // Redirect to the new .com domain
        window.location.href = window.location.href.replace(currentHost, newHost);
    } else {
        // Log when no redirection occurs
        console.log(`No redirection for ${currentHost}`);
    }
})();
