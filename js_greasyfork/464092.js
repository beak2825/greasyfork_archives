// ==UserScript==
// @name         Google Cached Links
// @namespace    https://greasyfork.org/users/710133
// @version      1.0
// @description  Adds a Cached link next to the search results on Google
// @author       tomcatadam
// @include      http*://www.google.*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464092/Google%20Cached%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/464092/Google%20Cached%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get all search result divs on the page
    const searchResultDivs = document.querySelectorAll('div.MjjYud');

    // Iterate over each search result div and add a Cached link
    searchResultDivs.forEach(searchResultDiv => {
        // Get the link inside the search result div
        const link = searchResultDiv.querySelector('a');

        if (link !== null && link !== undefined) {
            // Get the URL of the link
            const url = link.href;

            // Create the Cached link element
            const cachedLink = document.createElement('a');
            cachedLink.href = `https://webcache.googleusercontent.com/search?q=cache:${url}`;
            cachedLink.textContent = 'Cached';
            cachedLink.style.fontSize = '12px';
            cachedLink.style.color = '#70757a';
            cachedLink.style.marginLeft = '10px';

            // Find the <span> element with jsname="czHhOd"
            const span = searchResultDiv.querySelector('span[jsname="czHhOd"]');

            if (span !== null && span !== undefined) {
                // This version will insert the Cached link before the vertical elipses.
                // span.parentNode.insertBefore(cachedLink, span);

                // Add some horizontal space between the Cached link element and the <span> element
                cachedLink.style.marginLeft = '20px';

                // Insert the Cached link element after the <span> element
                span.parentNode.insertBefore(cachedLink, span.nextSibling);
            }
        }
    });
})();
