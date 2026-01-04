// ==UserScript==
// @name         c.Ai Search Expander
// @namespace    https://greasyfork.org/users/1084087-fermion
// @version      1.0
// @description  Automatically expands search results on c.Ai
// @author       ashley
// @match        https://character.ai/*
// @icon         https://c.ai/static/images/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500113/cAi%20Search%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/500113/cAi%20Search%20Expander.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function expandSearchResults() {
        const loadMoreButton = document.querySelector('.search-load-more');
        if (loadMoreButton) {
            loadMoreButton.click();
            setTimeout(expandSearchResults, 500); // Wait 0.5 seconds before checking again
        }
    }

    // Wait for the search results to appear, then start expanding them
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && document.querySelector('.search-load-more')) {
                expandSearchResults();
                observer.disconnect(); // Stop observing once we've started expanding
            }
        });
    });

    observer.observe(document.body, { childList: true });
})();