// ==UserScript==
// @name         Instagram Auto-Liker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-likes Instagram posts and moves to the next one.
// @author       Yashwanth
// @match        *://www.instagram.com/*
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/529485/Instagram%20Auto-Liker.user.js
// @updateURL https://update.greasyfork.org/scripts/529485/Instagram%20Auto-Liker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("🚀 Instagram Auto-Liker Script Loaded!");

    // Click on the first post
    const firstPost = document.querySelector('div._aagw');
    if (firstPost) {
        firstPost.click();
        console.log('✅ First post clicked.');

        // Start auto-liking process after a delay (ensuring the post opens)
        setTimeout(() => {
            let likes = 0;

            function likeAndNext() {
                const heart = document.querySelector('svg[aria-label="Like"][width="24"]');
                const arrow = document.querySelector('svg[aria-label="Next"]');

                if (heart) {
                    heart.parentNode.click(); // Click the like button
                    likes++;
                    console.log(`❤️ Liked ${likes} post(s).`);
                }

                if (arrow) {
                    setTimeout(() => {
                        arrow.parentElement.click(); // Click Next button
                        console.log('➡️ Moved to next post.');
                    }, 1000); // Delay before clicking "Next" to ensure smooth transition

                    setTimeout(likeAndNext, Math.random() * (5000 - 2000) + 2000); // Wait before liking the next post
                } else {
                    console.log("⛔ No more posts available. Stopping script.");
                }
            }

            setTimeout(likeAndNext, 2000); // Start process after initial delay

        }, 2000);
    } else {
        console.log('❌ No posts found!');
    }

})();
