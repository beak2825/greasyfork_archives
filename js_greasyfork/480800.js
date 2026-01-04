// ==UserScript==
// @name         Hide retweets on your Twitter home page
// @namespace    https://twitter.com/home
// @version      001
// @description  Hide retweets on your Twitter home page, only show tweets from the people you follow in chronological order from newest to oldest
// @match        https://twitter.com/home
// @grant        none
// @copyright    Personal
// @downloadURL https://update.greasyfork.org/scripts/480800/Hide%20retweets%20on%20your%20Twitter%20home%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/480800/Hide%20retweets%20on%20your%20Twitter%20home%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check and hide posts
    function checkAndHidePosts() {
        // Get all posts
        let posts = document.querySelectorAll('[data-testid="tweet"]');
        
        // Loop through each post
        for (let post of posts) {
            // Check if the post is a retweet
            if (post.querySelector('[aria-label="Retweeted"]')) {
                // If it's a retweet, hide the post
                post.style.display = 'none';
            }
        }
    }

    // Call the check and hide posts function every 2 seconds
    setInterval(checkAndHidePosts, 2000);
})();
