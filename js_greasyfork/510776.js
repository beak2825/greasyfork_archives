// ==UserScript==
// @name         Block Facebook Posts with Follow or Join (CSP Safe)
// @namespace    http://github.com/sarahbarberuk
// @version      1.3
// @description  Block posts on Facebook newsfeed that have Follow or Join buttons, bypassing CSP restrictions.
// @author       Sarah Barber
// @match        https://www.facebook.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510776/Block%20Facebook%20Posts%20with%20Follow%20or%20Join%20%28CSP%20Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/510776/Block%20Facebook%20Posts%20with%20Follow%20or%20Join%20%28CSP%20Safe%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
        // Function to find the nearest parent div with exactly one class
        function findNearestParentWithOneClass(element) {
            let parent = element.closest('div');
            while (parent) {
                if (parent.classList.length === 1) {
                    return parent; // Found the div with exactly one class
                }
                parent = parent.parentElement.closest('div'); // Move to the next parent div
            }
            return null; // Return null if no such div is found
        }

        // Function to block posts with "Follow" or "Join" buttons
        function blockPostsWithFollowOrJoin() {
            // Get the main newsfeed div
            const mainDiv = document.querySelector('div[role="main"]');
            if (!mainDiv) return;

            // Get all div elements with role="button" inside the main div
            const buttons = mainDiv.querySelectorAll('div[role="button"]');

            // Loop through each button and check if it contains "Follow" or "Join"
            buttons.forEach(button => {
                const span = button.querySelector('span');

                if (span && (span.innerText === 'Follow' || span.innerText === 'Join')) {
                    // Find the nearest parent div with exactly one class and hide it
                    const postContainer = findNearestParentWithOneClass(button);
                    if (postContainer) {
                        postContainer.style.display = 'none';
                        console.log('Blocked post with:', span.innerText, postContainer);
                    }
                }

                // this bit blocks reels and short videos
                const innerDiv = button.querySelector('div');
                if (innerDiv) {
                    const innerSpan =  innerDiv.querySelector('span');

                    if (innerSpan && (innerSpan.innerText === 'Reels and short videos')) {
                        // Find the nearest parent div with exactly one class and hide it
                        const postContainer = findNearestParentWithOneClass(button);
                        if (postContainer) {
                            postContainer.style.display = 'none';
                            console.log('Blocked post with:', innerSpan.innerText, postContainer);
                        }
                    }
                }  

                   
            });
        }

        // Run the script periodically to catch new posts
        const observer = new MutationObserver(blockPostsWithFollowOrJoin);
        observer.observe(document.body, { childList: true, subtree: true });


})();