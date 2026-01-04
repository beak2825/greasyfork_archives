// ==UserScript==
// @name         Show Only Verified X.com Posts
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Show only verified user posts on X.com, hide all replies, quote tweets, and reposts by default; prevents non-verified posts from detection by other scripts.
// @match        *://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514266/Show%20Only%20Verified%20Xcom%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/514266/Show%20Only%20Verified%20Xcom%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const whitelist = ["elonmusk"];
    const STORAGE_KEY = 'onlyShowVerified';
    
    // Load the user's toggle preference from local storage or default to true
    let onlyShowVerified = localStorage.getItem(STORAGE_KEY) === null ? true : JSON.parse(localStorage.getItem(STORAGE_KEY));
    
    // Create a toggle button
    const toggleButton = document.createElement('button');
    toggleButton.innerText = "Showing only verified users";
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.left = '10px';
    toggleButton.style.zIndex = '1000';
    toggleButton.style.backgroundColor = '#1DA1F2';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.padding = '8px 12px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.borderRadius = '5px';
    document.body.appendChild(toggleButton);

    // Toggle button click event to switch between showing verified only and all users
    toggleButton.addEventListener('click', () => {
        onlyShowVerified = !onlyShowVerified;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(onlyShowVerified));
        toggleButton.innerText = onlyShowVerified ? "Showing only verified users" : "Showing all users";
        filterPosts();
    });

    // Initial state for the toggle
    toggleButton.innerText = onlyShowVerified ? "Showing only verified users" : "Showing all users";
    
    // Function to filter posts
    function filterPosts() {
        const posts = document.querySelectorAll('article');
        posts.forEach(post => {
            const usernameElement = post.querySelector('div[dir="ltr"] a[role="link"]');
            const blueCheck = post.querySelector('svg[data-testid="icon-verified"]');
            const username = usernameElement ? usernameElement.getAttribute('href').replace('/', '').trim() : '';
            
            let shouldDisplay = true; // Default to show the post

            if (onlyShowVerified) {
                // Hide posts if they're not verified or if the user is whitelisted
                if (!blueCheck || whitelist.includes(username)) {
                    shouldDisplay = false;
                }

                // Hide any quote tweets, reposts, or replies
                const quotePost = post.querySelector('div[role="blockquote"]');
                const repostMarker = post.querySelector('svg[data-testid="retweet"]');
                const isReply = post.querySelector('div[data-testid="reply"]');
                if (quotePost || repostMarker || isReply) {
                    shouldDisplay = false;
                }
            }

            // Remove non-verified posts from the DOM to prevent other scripts from detecting them
            if (!shouldDisplay) {
                post.remove();
            }
        });
    }

    // Observer to watch for new posts and apply filter in real-time
    function observeTimeline() {
        const observer = new MutationObserver(filterPosts);
        observer.observe(document.body, { childList: true, subtree: true });
        filterPosts();
    }

    // Wait until posts are loaded on page, then initialize filter and observer
    function waitForPosts() {
        const initialObserver = new MutationObserver((mutations, obs) => {
            const posts = document.querySelectorAll('article');
            if (posts.length > 0) {
                filterPosts();
                obs.disconnect();
                observeTimeline(); // Begin observing for dynamic content changes
            }
        });
        initialObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Start waiting for posts when script loads
    waitForPosts();
})();
