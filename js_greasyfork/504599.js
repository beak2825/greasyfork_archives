// ==UserScript==
// @name         c.Ai Search Expander
// @namespace    https://greasyfork.org/users/searchexpansion
// @version      1.1
// @description  Automatically expands search results on c.Ai
// @author       ashley
// @match        https://character.ai/*
// @icon         https://c.ai/static/images/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504599/cAi%20Search%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/504599/cAi%20Search%20Expander.meta.js
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

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && document.querySelector('.search-load-more')) {
                expandSearchResults();
                setTimeout(() => observer.disconnect(), 1000); // Disconnect after 1 second delay
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
