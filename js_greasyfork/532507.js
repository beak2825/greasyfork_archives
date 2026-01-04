// ==UserScript==
// @name         Remove Reddtastic Duplicate Posts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes duplicate posts
// @author       wasivis
// @match        https://*.reddtastic.com/*
// @icon         https://reddtastic.com/favicon.png?v2
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532507/Remove%20Reddtastic%20Duplicate%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/532507/Remove%20Reddtastic%20Duplicate%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const seenLinks = new Set(); // Keeps track of image and video hyperlinks already encountered

    // Function to hide duplicate posts
    function filterPosts() {
        const posts = document.querySelectorAll('div#posts.mx-safe-2 div.posts__column div.post:not([data-processed="true"])');

        posts.forEach(post => {
            const imageElement = post.querySelector('div a img');
            const videoElement = post.querySelector('div video');
            const imageLink = imageElement ? imageElement.getAttribute('src') : null;
            const videoLink = videoElement ? videoElement.getAttribute('poster') : null;

            // Mark the post as processed to avoid re-checking it
            post.setAttribute('data-processed', 'true');

            // Handle duplicate image and video links
            const uniqueLink = imageLink || videoLink; // Use either image src or video poster
            if (uniqueLink) {
                if (seenLinks.has(uniqueLink)) {
                    post.style.display = 'none'; // Hide duplicate posts
                } else {
                    seenLinks.add(uniqueLink); // Mark this link as seen
                    post.style.display = ''; // Ensure the first occurrence is visible
                }
            }
        });
    }

    // Run the function initially
    filterPosts();

    // Observer for infinite scrolling and dynamically loaded content
    const observer = new MutationObserver(() => {
        filterPosts();
    });

    // Observe changes in the posts container
    const postsContainer = document.querySelector('div#posts.mx-safe-2');
    if (postsContainer) {
        observer.observe(postsContainer, { childList: true, subtree: true });
    }
})();