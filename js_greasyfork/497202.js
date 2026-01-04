// ==UserScript==
// @name         Hide Empty Email Posts
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide posts without an email entry
// @author       Your Name
// @match        https://may.2chan.net/b/res/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497202/Hide%20Empty%20Email%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/497202/Hide%20Empty%20Email%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide posts with empty email fields
    function hideEmptyEmailPosts() {
        // Get all post rows
        const rows = document.querySelectorAll('tr');

        // Iterate over each row
        rows.forEach(row => {
            // Check if the row contains a post
            const post = row.querySelector('td.rtd');
            if (post) {
                // Check if the email field is empty or does not exist
                const emailField = post.querySelector('.cnm a[href^="mailto:"]');
                if (!emailField || emailField.getAttribute('href') === 'mailto:') {
                    // If the email field is empty or does not exist, hide the entire row
                    row.style.display = 'none';
                }
            }
        });
    }

    // Run the function when the page loads
    window.addEventListener('load', hideEmptyEmailPosts);

    // Optional: Re-run the function if the content changes dynamically
    const observer = new MutationObserver(hideEmptyEmailPosts);
    observer.observe(document.body, { childList: true, subtree: true });
})();