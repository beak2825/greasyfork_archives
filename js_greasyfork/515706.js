// ==UserScript==
// @name         TikTok Live Auto Like and Comment
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically clicks the like button and comments "W" on TikTok Live every 45 seconds.
// @author       Loonyatom
// @match        *://*.tiktok.com/*/live
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515706/TikTok%20Live%20Auto%20Like%20and%20Comment.user.js
// @updateURL https://update.greasyfork.org/scripts/515706/TikTok%20Live%20Auto%20Like%20and%20Comment.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const totalClicks = 500; // Total number of likes to send
    const clickInterval = 50; // Interval between clicks in milliseconds
    const cooldownTime = 15000; // Cooldown time in milliseconds (15 seconds)
    const commentInterval = 45000; // Comment every 45 seconds

    let currentClicks = 0; // Track the number of likes clicked

    function clickLikeButton() {
        const likeButton = document.querySelector('.css-1if2uwl-DivLikeBtnIcon'); // Selector for the like button
        if (likeButton && currentClicks < totalClicks) {
            likeButton.click();
            currentClicks++;

            // Continue clicking until total clicks are reached
            setTimeout(clickLikeButton, clickInterval);
        } else if (currentClicks >= totalClicks) {
            console.log("Reached 500 likes, cooling down for 15 seconds...");
            setTimeout(() => {
                currentClicks = 0; // Reset click count after cooldown
                clickLikeButton(); // Start clicking again
            }, cooldownTime);
        } else {
            console.log("Like button not found.");
        }
    }

    function comment() {
        const chatInput = document.querySelector('div[contenteditable="plaintext-only"][placeholder="Say something nice"]'); // Selector for the chat input
        if (chatInput) {
            chatInput.textContent = "W"; // Set the chat input value to "W"
            chatInput.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event

            // Simulate pressing Enter to send the comment
            const enterEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Enter',
                code: 'Enter'
            });
            chatInput.dispatchEvent(enterEvent);
        } else {
            console.log("Chat input not found.");
        }
    }

    function startLoop() {
        comment();
        setTimeout(startLoop, commentInterval); // Comment every 45 seconds
    }

    // Start the like button clicking and comment loops after a short delay to allow the page to load
    setTimeout(() => {
        clickLikeButton();
        startLoop();
    }, 5000); // Wait 5 seconds before starting
})();
