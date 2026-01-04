// ==UserScript==
// @name         Facebook Group Sort by CHRONOLOGICAL NEW POSTS
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Forces Facebook groups to sort posts by "CHRONOLOGICAL" automatically
// @author       CHATgpt
// @include       *facebook.com/groups/*
// @match       *://*.facebook.com/groups/*
// @exclude       *facebook.com/reel/*
// @exclude       *facebook.com/photo/*
// @exclude       *facebook.com/?filter=groups*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529045/Facebook%20Group%20Sort%20by%20CHRONOLOGICAL%20NEW%20POSTS.user.js
// @updateURL https://update.greasyfork.org/scripts/529045/Facebook%20Group%20Sort%20by%20CHRONOLOGICAL%20NEW%20POSTS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to update sorting if not already set
    function updateSorting() {
        const url = new URL(window.location.href);
        if (!url.searchParams.has("sorting_setting")) {
            url.searchParams.set("sorting_setting", "CHRONOLOGICAL");
            window.location.replace(url.href);
        }
    }

    // Run once when the script loads
    updateSorting();

    // Observe URL changes (Facebook uses dynamic navigation)
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            updateSorting();
        }
    });

    // Start observing changes to the page
    observer.observe(document, { subtree: true, childList: true });
})();
