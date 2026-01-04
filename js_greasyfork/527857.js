// ==UserScript==
// @name         Google Minimal
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes everything except the search bar on Google homepage
// @match        https://www.google.com/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527857/Google%20Minimal.user.js
// @updateURL https://update.greasyfork.org/scripts/527857/Google%20Minimal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        // Attempt to locate the search form using the role attribute or fallback method.
        let searchForm = document.querySelector('form[role="search"]');
        if (!searchForm) {
            const searchInput = document.querySelector('input[name="q"]');
            if (searchInput) {
                searchForm = searchInput.closest('form');
            }
        }

        if (searchForm) {
            // Remove the buttons within the search form.
            // This targets both input elements of type submit and button elements.
            searchForm.querySelectorAll('input[type="submit"], button').forEach(btn => btn.remove());

            // Clear the entire body and append only the modified search form.
            document.body.innerHTML = '';
            document.body.appendChild(searchForm);

            // Center the search form on the page.
            document.body.style.display = 'flex';
            document.body.style.justifyContent = 'center';
            document.body.style.alignItems = 'center';
            document.body.style.height = '100vh';
            document.body.style.margin = '0';
        } else {
            console.error('Search form not found!');
        }
    });
})();
