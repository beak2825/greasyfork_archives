// ==UserScript==
// @name         Anonymz/Anonym etc. Universal Redirect Fixer
// @version      1.3
// @author       BoomBookTR
// @description  Remove redirection from links and restore original links for specified domains
// @match        *://*/*
// @grant        none
// @license      GPL-2.0-only
// @namespace    https://greasyfork.org/users/7610
// @downloadURL https://update.greasyfork.org/scripts/514200/AnonymzAnonym%20etc%20Universal%20Redirect%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/514200/AnonymzAnonym%20etc%20Universal%20Redirect%20Fixer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // List of redirect domains to process
    const domains = [
        "https://www.anonymz.com/?",
        "https://anonymz.com/?",
        "https://www.anonym.es/?",
        "https://anonym.es/?"
    ];

    // Function to process elements and fix links
    function fixRedirects() {
        const elements = document.querySelectorAll(
            'a[href^="https://"], img[src^="https://"], script[src^="https://"], iframe[src^="https://"]'
        );

        elements.forEach((element) => {
            let originalUrl = element.href || element.src;

            domains.forEach((domain) => {
                if (originalUrl.startsWith(domain)) {
                    // Extract the actual URL by removing the redirect prefix
                    const newUrl = originalUrl.replace(domain, "");

                    // Replace the href or src attribute with the original URL
                    if (element.tagName === 'A') {
                        element.href = newUrl;
                    } else {
                        element.src = newUrl;
                    }

                    // Optionally log the changes (for debugging)
                    console.log('Link updated from:', originalUrl, 'to:', newUrl);
                }
            });
        });
    }

    // Run the fixer function on page load
    fixRedirects();
})();
