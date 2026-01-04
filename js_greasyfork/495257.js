// ==UserScript==
// @name         Old Reddit Open Thread Instead of Post
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replace main links from home subreddits to threads directly rather than posts (Images, other websites, etc.) Only affects the main subreddit listing, not comments.
// @author       Berkay
// @match        https://old.reddit.com/r/*
// @match        https://www.reddit.com/r/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495257/Old%20Reddit%20Open%20Thread%20Instead%20of%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/495257/Old%20Reddit%20Open%20Thread%20Instead%20of%20Post.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Exit the script if the URL contains '/comments/', indicating a thread page
    if (window.location.pathname.includes('/comments/')) {
        return;
    }

    // Function to replace post links with comment/thread links
    function replacePostLinks() {
        // Select all post containers within the main listing
        const postContainers = document.querySelectorAll('div.thing[data-context="listing"]');

        postContainers.forEach(container => {
            // Find the title link within the container
            const titleLink = container.querySelector('a[data-event-action="title"]');
            // Find the comments link within the container
            const commentsLink = container.querySelector('a[data-event-action="comments"]');

            if (titleLink && commentsLink) {
                // Replace the href of the title link with the href of the comments link
                titleLink.href = commentsLink.href;
            }
        });
    }

    // Run the function when the page loads
    window.addEventListener('load', replacePostLinks);

    // Observe DOM changes to handle dynamically loaded content (e.g., infinite scroll)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            replacePostLinks();
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
