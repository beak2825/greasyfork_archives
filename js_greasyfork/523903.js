// ==UserScript==
// @name         Google Search Results Filter
// @namespace    https://greasyfork.org/en/users/1413127-tumoxep
// @version      1.1
// @description  Hides specific Google search results based on href values. Motivation: I keep wasting my time opening reddit from search results and realizing that I don't have an access there
// @license      WTFPL
// @match        https://www.google.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523903/Google%20Search%20Results%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/523903/Google%20Search%20Results%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // List of keywords or URL substrings to hide
    const blacklist = [
        "air.io",
    ];

    // Function to hide unwanted search results
    function filterResults() {
        // Select all results inside the #search element
        const results = document.querySelectorAll(`[data-hveid]:not([data-hveid=""])[jsaction]:not([jsaction=""])[data-hveid]:not([data-hveid=""])[data-ved]:not([data-ved=""])`); // Adjust if necessary based on class structure

        results.forEach((result) => {
            try {
                // Get the link nested 9 levels deep
                const link = result.querySelector("a");
                if (link && blacklist.some(keyword => link.href.includes(keyword))) {
                    // Hide the result if it matches the blacklist
                    result.style.display = 'none';
                }
            } catch (e) {
                console.error("Error processing result:", e);
            }
        });
    }

    // Run the filter when the page loads or updates
    const observer = new MutationObserver(filterResults);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial filter run
    filterResults();
})();
