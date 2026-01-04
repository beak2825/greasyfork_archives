// ==UserScript==
// @name        Disable DevTool Block Chattyhub
// @namespace   chattyhub
// @match       https://www.chattyhub.org/*
// @grant       none
// @version     1.0
// @author      -
// @license     MIT
// @description Give power back to devtools!
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/515628/Disable%20DevTool%20Block%20Chattyhub.user.js
// @updateURL https://update.greasyfork.org/scripts/515628/Disable%20DevTool%20Block%20Chattyhub.meta.js
// ==/UserScript==
(function() {

    'use strict';

    // Wait for the original scripts to load
    window.addEventListener('load', function() {
        // Override the check function
        window.check = function() {
            console.log("check() has been blocked.");
        };
    });

    // List of domains to block
    // YOU HAVE TO BLOCK "aepkill.com" OR ELSE THIS DOMAIN WILL LOAD THE SCRIPT AS WELL!
    const blockedDomains = [
        'aepkill.com'
    ];

    // Function to check if a URL is blocked
    function isBlocked(url) {
        return blockedDomains.some(domain => url.includes(domain));
    }

    // Override XMLHttpRequest
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (isBlocked(url)) {
            console.log(`Blocked XMLHttpRequest to: ${url}`);
            return; // Prevent the request from being made
        }
        return originalXhrOpen.apply(this, arguments);
    };

    // Override Fetch API
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = typeof args[0] === 'string' ? args[0] : args[0].url;
        if (isBlocked(url)) {
            console.log(`Blocked Fetch request to: ${url}`);
            return Promise.reject(new Error(`Blocked request to: ${url}`)); // Reject the promise
        }
        return originalFetch.apply(this, args);
    };

    // Monitor for new scripts and links being added to the page
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'SCRIPT' && isBlocked(node.src)) {
                    console.log(`Blocked script: ${node.src}`);
                    node.parentNode.removeChild(node); // Remove the script tag
                }
                if (node.tagName === 'LINK' && isBlocked(node.href)) {
                    console.log(`Blocked stylesheet: ${node.href}`);
                    node.parentNode.removeChild(node); // Remove the link tag
                }
            });
        });
    });

    // Start observing the document for added nodes
    observer.observe(document.documentElement, { childList: true, subtree: true });

})();