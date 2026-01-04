// ==UserScript==
// @name         SleazyFork Redirect
// @namespace    github.com/lngkidkoolstar
// @version      1.0
// @description  Redirects sleazyfork.org URLs to greasyfork.org if a specific text is found.
// @author       longkidkoolstar
// @match        https://sleazyfork.org/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494712/SleazyFork%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/494712/SleazyFork%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check and redirect if needed
    function checkAndRedirect() {
        const section = document.querySelector('section.text-content');
        if (section) {
            const pElement = section.querySelector('p');
            if (pElement && pElement.textContent.trim() === 'This script is not available on this site.') {
                // Redirect to GreasyFork
                window.location.href = window.location.href.replace('sleazyfork.org', 'greasyfork.org');
            }
        }
    }

    // Run the check on page load
    checkAndRedirect();

    // Also run the check when new content is added (for dynamic sites)
    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                checkAndRedirect();
                break; // Stop checking once a change is detected
            }
        }
    });

    // Observe changes in the document's body
    observer.observe(document.body, { childList: true, subtree: true });
})();
