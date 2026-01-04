// ==UserScript==
// @name         TikTok Auto Comment
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically comments "悪殺会万歳🙌" followed by a random number on TikTok videos every 0.01 seconds.
// @author       Your Name
// @match        https://www.tiktok.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539735/TikTok%20Auto%20Comment.user.js
// @updateURL https://update.greasyfork.org/scripts/539735/TikTok%20Auto%20Comment.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function postComment() {
        // Find the comment input area. This might change depending on TikTok's website structure.
        // You might need to inspect the element on TikTok to find the correct selector.
        const commentInput = document.querySelector('.tiktok-x6alwa-Input'); // Example selector, verify this.

        if (commentInput) {
            const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number
            const commentText = `悪殺会万歳🙌${randomNumber}`;

            // Set the value of the input field
            commentInput.value = commentText;

            // Simulate input event to trigger any framework listeners
            commentInput.dispatchEvent(new Event('input', { bubbles: true }));

            // Find the post comment button. This also might change.
            const postButton = document.querySelector('.tiktok-1yn19w-Button'); // Example selector, verify this.

            if (postButton) {
                // Click the post button
                postButton.click();
            } else {
                console.log("Post comment button not found.");
            }
        } else {
            console.log("Comment input field not found.");
        }
    }

    // Set an interval to run the postComment function every 10 milliseconds (0.01 seconds)
    // WARNING: This is a very aggressive interval and could lead to being rate-limited or banned.
    // Use with extreme caution and understand the risks.
    setInterval(postComment, 10);

})();
