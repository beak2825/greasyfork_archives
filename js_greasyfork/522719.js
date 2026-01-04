// ==UserScript==
// @name         Block Instagram Suggested Posts/Sponsored
// @namespace    https://github.com/rowhanm
// @version      0.0.1
// @description  Block Instagram posts with "Follow", "Suggested for you", or "Suggested posts" or "Sponsored"
// @author       Rohan M
// @match        https://www.instagram.com/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/522719/Block%20Instagram%20Suggested%20PostsSponsored.user.js
// @updateURL https://update.greasyfork.org/scripts/522719/Block%20Instagram%20Suggested%20PostsSponsored.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
        // Function to hide posts that contain "Follow", "Suggested for you", or "Suggested posts"
        function hidePostsWithFollowOrSuggested() {
            const posts = document.querySelectorAll('article');

            posts.forEach(post => {
                // Check for "Follow" in divs
                const followDivs = post.querySelectorAll('div');
                let followFound = false;
                followDivs.forEach(div => {
                    if (div.innerText.trim().toLowerCase() === 'follow' || (div.innerText.trim().toLowerCase() === 'sponsored')) {
                        followFound = true;
                    }
                });

                // Check for "Suggested for you" or "Suggested posts" in spans, divs, sections, and headers
                let suggestedFound = false;
                const textElements = post.querySelectorAll('span, div, section, h2');
                textElements.forEach(el => {
                    const text = el.innerText.trim().toLowerCase();
                    if (text.includes('suggested for you') || text.includes('suggested posts')) {
                        suggestedFound = true;
                    }
                });

                // Hide the post but keep the layout intact to avoid scroll issues
                if (followFound || suggestedFound) {
                    post.style.visibility = 'hidden';  // Makes the post invisible
                    post.style.height = '0px';         // Reduces the height to avoid layout disruption
                    post.style.overflow = 'hidden';    // Prevents any overflow content from being visible
                }
            });
        }

        // MutationObserver to track changes in the feed (for infinite scroll)
        function initializeMutationObserver() {
            // Select the main content area (usually where Instagram loads posts)
            const mainContent = document.querySelector('main');

            if (mainContent) {
                const observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            console.log('New node detected:', node); // Log new nodes
                            if (node.nodeType === 1 && node.tagName === 'ARTICLE') {
                                console.log('New article added:', node); // Log when a new post is added
                                hidePostsWithFollowOrSuggested(); // Check newly added content
                            }
                        });
                    });
                });

                // Start observing the main content area for dynamically loaded posts
                observer.observe(mainContent, {
                    childList: true,  // Track when new child nodes are added
                    subtree: true     // Check the entire subtree (for infinite scroll)
                });
            } else {
                console.log('Main content area not found.');
            }
        }

        // Initial run to hide already existing posts once the page fully loads
        hidePostsWithFollowOrSuggested();
        initializeMutationObserver();

});