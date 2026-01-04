// ==UserScript==
// @name         Google SERP Parser
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract titles, URLs, and descriptions from Google SERPs.
// @author       YourName
// @match        https://www.google.*/*search?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489756/Google%20SERP%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/489756/Google%20SERP%20Parser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract and display search result data
    function parseSERP() {
        const results = [];
        document.querySelectorAll('div.g').forEach((resultElement) => {
            const title = resultElement.querySelector('h3') ? resultElement.querySelector('h3').innerText : 'No title';
            const url = resultElement.querySelector('a') ? resultElement.querySelector('a').href : 'No URL';
            const description = resultElement.querySelector('.VwiC3b') ? resultElement.querySelector('.VwiC3b').innerText : 'No description available';
            results.push({title, url, description});
        });

        console.log(results);
        // Optionally, display the results in a more user-friendly way here
    }

    // Run the parser function when the page has loaded
    window.addEventListener('load', parseSERP);
})();
