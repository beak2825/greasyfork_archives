// ==UserScript==
// @license MIT
// @name         GoogleRedirectBypasser
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically proceeds past Google redirect notice pages
// @author       aceitw
// @match        https://www.google.com/url?*
// @match        https://google.com/url?*
// @grant        GM_openInTab
// @grant        window.focus
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/531597/GoogleRedirectBypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/531597/GoogleRedirectBypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract destination URL from the page
    function extractDestinationUrl() {
        // Try to get the URL from the query string first (most reliable)
        const urlParams = new URLSearchParams(window.location.search);
        const destUrl = urlParams.get('q') || urlParams.get('url');

        if (destUrl) {
            return destUrl;
        }

        // Fallback: Try to find the URL in the page content
        // This runs if the script executes after the page has loaded
        const links = document.querySelectorAll('a');
        for (const link of links) {
            // Look for the main "Proceed" link
            if (link.textContent.includes('proceed') ||
                link.href.includes('http') && !link.href.includes('google.com')) {
                return link.href;
            }
        }

        return null;
    }

    // Main function to bypass the redirect
    function bypassRedirect() {
        const destinationUrl = extractDestinationUrl();

        if (destinationUrl) {
            // Redirect immediately to the destination
            window.location.replace(destinationUrl);
        }
    }

    // Run as soon as possible
    bypassRedirect();

    // Also run when DOM is ready (fallback)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bypassRedirect);
    } else {
        bypassRedirect();
    }
})();
