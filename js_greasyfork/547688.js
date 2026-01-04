// ==UserScript==
// @name         Filter Discourse Replies by Reactions or Replies
// @namespace    https://greasyfork.org/users/HW101
// @version      0.1
// @description  Only keep replies with more than N reactions, or replies on Discourse forums
// @author       USCardForum Enthusiast
// @match        https://www.uscardforum.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547688/Filter%20Discourse%20Replies%20by%20Reactions%20or%20Replies.user.js
// @updateURL https://update.greasyfork.org/scripts/547688/Filter%20Discourse%20Replies%20by%20Reactions%20or%20Replies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const nReactions = 5;
    const nReplies = 3;

    // also return count of likes
    function hasMoreThanNReactions(post, n) {
        // Discourse likes are usually in a <button> with class 'like-count' or 'like'
        // Sometimes the count is in a <span> with class 'like-count'
        // get the descendant with class 'reactions-counter'
        let reactionsCounter = post.querySelector('.reactions-counter');
        if (reactionsCounter) {
            let count = parseInt(reactionsCounter.textContent.trim(), 10);
            return { has: !isNaN(count) && count >= n, count: count };
        }
        return { has: false, count: 0 };
    }

    // also return count of emojis
    function hasMoreThanNReplies(post, n) {
        let replies = post.querySelectorAll('.reply');
        return { has: replies.length >= n, count: replies.length };
    }

    // Main filter function
    function filterReplies() {
        // Discourse replies are usually in <article> with class 'regular' or 'reply'
        let posts = document.querySelectorAll('article.regular, article.reply, .topic-post');
        for (let post of posts) {
            // Skip if already processed
            if (post.dataset.filteredByScript) continue;

            // skip topic-owner
            if (post.classList.contains('topic-owner') && post.dataset.postNumber == 1) continue;

            let reactions = hasMoreThanNReactions(post, nReactions);
            let replies = hasMoreThanNReplies(post, nReplies);
            if (reactions.has || replies.has) {
                // console.log(`Reply ${post.textContent.replace(/\s+/g, " ")} has ${reactions.count} reactions, and ${replies.count} replies, keeping`);
                continue;
            } else {
                // console.log(`Reply ${post.textContent.replace(/\s+/g, " ")} has ${reactions.count} reactions, and ${replies.count} replies, removing`);
                post.remove();
            }
            post.dataset.filteredByScript = "true";
        }
    }

    // Helper to re-run filtering if enabled
    function maybeFilterReplies() {
        if (filteringEnabled) {
            filterReplies();
        }
    }

    // Run filter after page loads and after AJAX navigation
    function maybeFilterRepliesWithDelay() {
        setTimeout(maybeFilterReplies, 1000); // Wait for Discourse to render posts
    }

    let filteringEnabled = false;

    // Create the floating button to enable/disable filtering
    const filterToggleButton = document.createElement('button');
    filterToggleButton.textContent = 'Enable Filtering';
    filterToggleButton.style.position = 'fixed';
    filterToggleButton.style.bottom = '24px';
    filterToggleButton.style.right = '24px';
    filterToggleButton.style.zIndex = '9999';
    filterToggleButton.style.padding = '12px 18px';
    filterToggleButton.style.background = '#2596be';
    filterToggleButton.style.color = '#fff';
    filterToggleButton.style.border = 'none';
    filterToggleButton.style.borderRadius = '24px';
    filterToggleButton.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    filterToggleButton.style.cursor = 'pointer';
    filterToggleButton.style.fontSize = '16px';
    filterToggleButton.style.opacity = '0.85';
    filterToggleButton.style.transition = 'background 0.2s, opacity 0.2s';

    filterToggleButton.addEventListener('mouseenter', () => {
        filterToggleButton.style.opacity = '1';
    });
    filterToggleButton.addEventListener('mouseleave', () => {
        filterToggleButton.style.opacity = '0.85';
    });

    document.body.appendChild(filterToggleButton);

    // Toggle filtering on button click
    filterToggleButton.addEventListener('click', () => {
        filteringEnabled = !filteringEnabled;
        filterToggleButton.textContent = filteringEnabled ? 'Disable Filtering' : 'Enable Filtering';
        // If enabling, run filter immediately
        if (filteringEnabled) {
            filterReplies();
        } else {
            // Reload the page to restore all posts (simplest way)
            location.reload();
        }
    });

    // // Observe DOM changes (for infinite scroll or AJAX navigation)
    const observer = new MutationObserver(maybeFilterRepliesWithDelay);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    maybeFilterReplies();
})();
