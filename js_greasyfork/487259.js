// ==UserScript==
// @name         Poshmark pm_editor Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Removes spammy pm_editor entries from the news section on Poshmark.
// @author       Rsmaldone
// @match        *://*poshmark.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487259/Poshmark%20pm_editor%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/487259/Poshmark%20pm_editor%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removePmEditorEntries = () => {
        document.querySelectorAll('a[href="/closet/pm_editor"]').forEach(el => {
            // Navigate up to the closest news feed item container and remove it
            const newsFeedItem = el.closest('.news-feed__item');
            if (newsFeedItem) {
                newsFeedItem.remove();
            }
        });
    };

    // Use MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            removePmEditorEntries();
        });
    });

    // Start observing the body for added nodes, which covers most dynamic content cases
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial removal in case the content is already there
    removePmEditorEntries();
})();