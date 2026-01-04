// ==UserScript==
// @name         4chan.org to 4chan.gay Redirector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects all 4chan.org URLs to 4chan.gay
// @author       Your Name
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540554/4chanorg%20to%204changay%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/540554/4chanorg%20to%204changay%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Main URL redirect
    const currentURL = window.location.href;
    if (currentURL.includes('4chan.org')) {
        const newURL = currentURL.replace(/4chan\.org/g, '4chan.gay');
        if (newURL !== currentURL) {
            window.location.replace(newURL);
            return; // Stop execution after redirect
        }
    }

    // Link rewriting function
    function rewriteLinks() {
        document.querySelectorAll('a[href*="4chan.org"]').forEach(link => {
            link.href = link.href.replace(/4chan\.org/g, '4chan.gay');
        });
    }

    // MutationObserver for dynamically added content
    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            rewriteLinks();
        });
    });

    // Initialize link rewriting
    window.addEventListener('DOMContentLoaded', () => {
        rewriteLinks();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();