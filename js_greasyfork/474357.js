// ==UserScript==
// @name         Douban Book Redirect
// @namespace    http://GitHub.com/awyugan
// @version      0.2
// @description  Redirect to the first book when searching by ISBN on Douban
// @author       awyugan
// @match        https://search.douban.com/book/subject_search?*
// @match        https://www.douban.com/search?cat=1001*
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/474357/Douban%20Book%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/474357/Douban%20Book%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if the query is an ISBN
    function isISBN(query) {
        // Remove all non-digit characters
        let cleaned = query.replace(/[^0-9]/g, '');
        
        // Check if it's a valid ISBN-10 or ISBN-13
        return (cleaned.length === 10 || (cleaned.length === 13 && (cleaned.startsWith('978') || cleaned.startsWith('979'))));
    }

    // Wait for the page to fully load
    window.addEventListener('load', function() {
        // Extract the search text from the URL
        let urlParams = new URLSearchParams(window.location.search);
        let searchText = urlParams.get('search_text');

        if (searchText && isISBN(searchText)) {
            // Check if we're on the search page and if there are book results
            let firstBookLink = document.querySelector('.title-text'); // for the first URL
            if (!firstBookLink) {
                firstBookLink = document.querySelector('.result .title a'); // for the second URL
            }

            if (firstBookLink) {
                // Redirect to the first book's page
                window.location.href = firstBookLink.href;
            }
        }
    }, false);

})();
