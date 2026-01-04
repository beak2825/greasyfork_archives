// ==UserScript==
// @name        Ars Technica Author Remover
// @namespace    author remover
// @version      1.3
// @description  Remove articles by certain bad, click-bait authors from Ars Technica
// @author       -
// @match       https://arstechnica.com/*
// @match       https://www.arstechnica.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440456/Ars%20Technica%20Author%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/440456/Ars%20Technica%20Author%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove articles by Beth Mole
    function removeBethMoleArticles() {
        // Select all article elements
        const articles = document.querySelectorAll('article');

        articles.forEach(article => {
            // Check if the author name "Beth Mole" exist within the article
            if (article.textContent.includes('Beth Mole')) {
                article.remove();
            }
        });
    }

    // Run the function to remove articles
    removeBethMoleArticles();

    // Optional: Observe for dynamically loaded content and remove matching articles
    const observer = new MutationObserver(removeBethMoleArticles);
    observer.observe(document.body, { childList: true, subtree: true });

})();