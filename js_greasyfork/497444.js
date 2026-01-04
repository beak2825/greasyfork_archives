// ==UserScript==
// @name         VK Verified Posts Only
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides posts from unverified users and groups on VK.com
// @author       You (adapted by Bard)
// @match        https://vk.com/*
// @license MIT
// @grant        none
// @run-at       document-end  // Important: Run after the initial page load
// @downloadURL https://update.greasyfork.org/scripts/497444/VK%20Verified%20Posts%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/497444/VK%20Verified%20Posts%20Only.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isVerified(post) {
        // Check for the verification badge. The selectors might need adjustment
        // if VK changes its HTML structure. We check for two common locations.
        return (
            post.querySelector('.PostHeaderTitle__verified') !== null ||
            post.querySelector('.PostHeaderTitle__author .PostHeaderTitle__verifiedByOtherServicesIcon') !== null
        );
    }

    function filterPosts() {
        const posts = document.querySelectorAll('._post'); // Select all post elements

        for (const post of posts) {
            if (!isVerified(post)) {
                post.style.display = 'none';  // Hide unverified posts
            } else {
                 post.style.display = '';     //Show verified posts
            }
        }
    }

    // Initial filtering, but with a delay to allow for dynamic content.
    // We use requestAnimationFrame twice for better timing.
    requestAnimationFrame(() => {
        requestAnimationFrame(filterPosts);
    });


    // Set up the MutationObserver to watch for new posts being added.
    const observer = new MutationObserver(() => {
         // Debounce the filtering to avoid excessive calls.  This is VERY IMPORTANT
        // for performance on a site like VK that loads content dynamically.
        clearTimeout(filterTimer);
        filterTimer = setTimeout(filterPosts, 200); // 200ms delay

    });


    let filterTimer; // Store the timer ID for debouncing.
    // Start observing the document body for changes.  We observe the body
    // because new posts can be added in various places within the DOM.
    observer.observe(document.body, {
        childList: true,   // Watch for added or removed nodes
        subtree: true     // Watch all descendant nodes, not just direct children
    });


    // --- Event Listener for "Show More" Button ---

    // We need to find the button *after* a short delay because it might not
    // exist immediately when the script runs.
    function setupShowMoreListener() {
         const showMoreButton = document.getElementById('ui_search_load_more') ||  document.querySelector('.show_more');
         if (showMoreButton) {
              showMoreButton.addEventListener('click', () => {
                //Debounce to wait for the new posts.
                clearTimeout(filterTimer);
                filterTimer = setTimeout(filterPosts, 500); // 500ms delay
            });
        }
    }


    // Observe for changes and check every 3sec to not miss it if observer dont work
     setInterval(() => {
      setupShowMoreListener();
    }, 3000);

    // Initial setup for show more button
     setupShowMoreListener();


    // Observe for changes in search type, and re-filter.
    const searchTabs = document.querySelector('.ui_filters_block, .ui_search_filters_row, .ui_search_sort');
      if (searchTabs) {
        searchTabs.addEventListener('click', () => {
           clearTimeout(filterTimer);
           filterTimer = setTimeout(filterPosts, 500); // Delay after click
        });
    }

})();