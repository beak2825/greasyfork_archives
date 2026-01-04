// ==UserScript==
// @name        Reddit Hot Redirect with Logo Click Handler
// @namespace   https://greasyfork.org/en/users/594496-divided-by
// @author      dividedby
// @description Redirects default frontpage from 'best' to 'hot' and handles logo clicks
// @version     1.4
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @contributionURL     https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=dividedbyerror@gmail.com&item_name=Reddit+Hot+Donation
// @contributionAmount  $1
// @match       https://www.reddit.com/*
// @run-at      document-start

// @downloadURL https://update.greasyfork.org/scripts/508344/Reddit%20Hot%20Redirect%20with%20Logo%20Click%20Handler.user.js
// @updateURL https://update.greasyfork.org/scripts/508344/Reddit%20Hot%20Redirect%20with%20Logo%20Click%20Handler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function redirectToHot() {
        // Automatically redirect only on homepage
        if (window.location.pathname === '/') {
            window.location.href = 'https://www.reddit.com/hot';
        }
    }

    function handleLogoClick(e) {
        e.preventDefault();
        // Always redirect to hot regardless of current page
        window.location.href = 'https://www.reddit.com/hot';
    }

    function attachLogoListener() {
        const logo = document.querySelector('#reddit-logo');
        if (logo && !logo.dataset.hotRedirect) {
            logo.dataset.hotRedirect = true;
            logo.addEventListener('click', handleLogoClick);
        }
    }

    // Initial redirect only on homepage
    redirectToHot();

    // Set up MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                attachLogoListener();
            }
        }
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });

    // Attach listener to initial logo if it exists
    attachLogoListener();

    // Listen for navigation events (popstate)
    window.addEventListener('popstate', redirectToHot);
})();
