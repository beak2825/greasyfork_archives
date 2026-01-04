// ==UserScript==
// @name         OceanHero Search Automation (Educational)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Simulate repeated search queries on OceanHero for educational purposes
// @author       Your Name
// @match        https://www.oceanhero.today/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524508/OceanHero%20Search%20Automation%20%28Educational%29.user.js
// @updateURL https://update.greasyfork.org/scripts/524508/OceanHero%20Search%20Automation%20%28Educational%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const query = "ocean conservation"; // The search query
    const iterations = 10; // Number of searches
    const delay = 2000; // Delay between searches in milliseconds

    let searchCount = 0;

    // Function to simulate searches
    function performSearch() {
        if (searchCount < iterations) {
            searchCount++;
            console.log(`Performing search #${searchCount} for '${query}'`);

            // Redirect to the search page with the query
            window.location.href = `https://www.oceanhero.today/search?q=${encodeURIComponent(query)}`;

            // Schedule the next search
            setTimeout(performSearch, delay);
        } else {
            console.log("All searches completed!");
        }
    }

    // Start the search loop
    performSearch();
})();
