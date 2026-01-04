// ==UserScript==
// @name         Kagi Maps to Google Maps redirector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects Kagi Maps links to Google Maps, but only when clicked from Kagi search results.
// @author       NewsguyTor
// @match        https://kagi.com/search*
// @grant        none
// @icon         https://kagi.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537635/Kagi%20Maps%20to%20Google%20Maps%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/537635/Kagi%20Maps%20to%20Google%20Maps%20redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Kagi Maps Redirector active on:", window.location.href);

    document.addEventListener('click', function(event) {
        // Check if the click originated from a Kagi search page
        // The @match directive already ensures this, but an explicit check is good for clarity/future-proofing
        if (!window.location.hostname === 'kagi.com' || !window.location.pathname.startsWith('/search')) {
            return;
        }

        // Find the A tag that was clicked, even if the click was on a child element
        let targetElement = event.target;
        while (targetElement && targetElement.tagName !== 'A') {
            targetElement = targetElement.parentElement;
        }

        if (targetElement && targetElement.href) {
            const originalHref = targetElement.href;

            // Check if the link is a Kagi Maps link
            if (originalHref.startsWith('https://kagi.com/maps?')) {
                try {
                    const kagiUrl = new URL(originalHref);
                    const query = kagiUrl.searchParams.get('q');

                    if (query) {
                        // Construct the Google Maps URL
                        const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;

                        console.log(`Kagi Maps link clicked: ${originalHref}`);
                        console.log(`Redirecting to: ${googleMapsUrl}`);

                        // Prevent the default Kagi link navigation
                        event.preventDefault();
                        event.stopPropagation(); // Good practice to stop further event propagation

                        // Perform the redirection
                        window.location.href = googleMapsUrl;
                    } else {
                        console.log("Kagi Maps link found, but no 'q' parameter:", originalHref);
                    }
                } catch (e) {
                    console.error("Error parsing Kagi Maps URL:", e, originalHref);
                }
            }
        }
    }, true); // Use capture phase to intercept the click early
})();