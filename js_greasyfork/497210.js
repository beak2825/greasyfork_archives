// ==UserScript==
// @name         Show Only Image Posts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  画像付きレス以外を非表示にする
// @author       toshiaki
// @match        https://may.2chan.net/b/res/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497210/Show%20Only%20Image%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/497210/Show%20Only%20Image%20Posts.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Function to hide non-image posts
    function hideNonImagePosts() {
        // Get all post rows
        const rows = document.querySelectorAll('tr');

        // Iterate over each row
        rows.forEach(row => {
            // Check if the row contains a post
            const post = row.querySelector('td.rtd');
            if (post) {
                // Check if the post contains an image
                const img = post.querySelector('img');

                // If the post does not contain an image, hide the entire row
                if (!img) {
                    row.style.display = 'none';
                }
            }
        });
    }

    // Run the function when the page loads
    window.addEventListener('load', hideNonImagePosts);

    // Optional: Re-run the function if the content changes dynamically
    const observer = new MutationObserver(hideNonImagePosts);
    observer.observe(document.body, { childList: true, subtree: true });
})();