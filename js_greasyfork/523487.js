// ==UserScript==
// @name         Remove Reddit Recent Posts Sidebar
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Remove the "Recent Posts" sidebar on Reddit.
// @author       Rayman30
// @match        https://www.reddit.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523487/Remove%20Reddit%20Recent%20Posts%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/523487/Remove%20Reddit%20Recent%20Posts%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the Recent Posts sidebar
    function removeRecentPosts() {
        // Select the <recent-posts> element
        const recentPosts = document.querySelector('recent-posts');

        if (recentPosts) {
            recentPosts.remove(); // Remove the entire element
            console.log('Recent Posts removed.');
        } else {
            console.log('Recent Posts not found.');
        }
    }

    // Run the function on initial page load
    document.addEventListener('DOMContentLoaded', removeRecentPosts);

    // Observe dynamically loaded content
    const observer = new MutationObserver(() => {
        removeRecentPosts();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
