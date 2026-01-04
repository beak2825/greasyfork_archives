// ==UserScript==
// @name         Flickr Always Visible Stats
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Makes like and comment counts always visible on Flickr photo thumbnails in profile pages
// @author       fapek GPT
// @match        https://*.flickr.com/people/*
// @match        https://*.flickr.com/photos/*
// @match        *.flickr.com/photos/*

// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530907/Flickr%20Always%20Visible%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/530907/Flickr%20Always%20Visible%20Stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and inject custom CSS
    function injectCustomCSS() {
        const css = `
            /* Force interaction bar to be always visible */
            .photo-list-photo-view .interaction-bar,
            .overlay-target .interaction-bar {
                display: none !important; /* Hide the original interaction bar completely */
                opacity: 0 !important;
                visibility: hidden !important;
            }

            /* Style for our custom stats bar */
            .always-visible-stats {
                display: flex !important;
                opacity: 1 !important;
                visibility: visible !important;
                position: absolute !important;
                bottom: 0 !important;
                left: 0 !important;
                right: 0 !important;
                background: rgb(0, 0, 0) !important; /* Fully opaque background */
                padding: 5px !important;
                transition: background 0.2s ease !important;
                z-index: 99 !important; /* Higher z-index to ensure it's on top */
                pointer-events: auto !important;
            }

            /* Hide the title and attribution to save space */
            .photo-list-photo-view .interaction-bar .text {
                display: none;
            }

            /* Make the engagement section take full width */
            .photo-list-photo-view .interaction-bar .engagement {
                display: flex;
                width: 100%;
                justify-content: space-around;
            }

            /* Style for engagement items */
            .photo-list-photo-view .interaction-bar .engagement-item {
                display: flex;
                align-items: center;
                color: white;
                padding: 2px 5px;
                font-weight: bold;
            }

            /* Hover effect on the bar */
            .photo-list-photo-view:hover .interaction-bar {
                background: rgba(0, 0, 0, 0.8);
            }

            /* Make engagement count more visible */
            .photo-list-photo-view .interaction-bar .engagement-count {
                margin-left: 3px;
                font-size: 14px;
                text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
            }

            /* Special styling for favorite counts */
            .photo-list-photo-view .interaction-bar .fave .engagement-count {
                color: #fffc00;
            }

            /* Special styling for comment counts */
            .photo-list-photo-view .interaction-bar .comment .engagement-count {
                color: #00ffff;
            }

            /* Hide the curate button to save space */
            .photo-list-photo-view .interaction-bar .curate {
                display: none;
            }

            /* Ensure icons are visible */
            .photo-list-photo-view .interaction-bar svg,
            .photo-list-photo-view .interaction-bar i {
                filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.8));
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }

    // Function to parse like counts including K format (1K, 1.5K etc.)
    function parseCount(text) {
        text = text.trim();

        // Handle K format (e.g., "1K", "1.3K")
        if (text.endsWith('K')) {
            const numPart = parseFloat(text.replace('K', ''));
            return Math.round(numPart * 1000);
        }

        return parseInt(text);
    }

    // Function to stylize like counts with the same levels as your other script
    function stylizeLikeCounts() {
        // Find all engagement count elements for favorites
        const likeElements = document.querySelectorAll('.fave .engagement-count');

        likeElements.forEach(function(likeElement) {
            const originalText = likeElement.innerText.trim();
            const likeCount = parseCount(originalText);

            if (!isNaN(likeCount)) {
                // Reset existing custom styles
                likeElement.style.fontSize = '';
                likeElement.style.textShadow = '';

                // Style based on number of likes
                if (likeCount >= 1 && likeCount <= 5) {
                    likeElement.style.fontSize = '14px';
                } else if (likeCount >= 6 && likeCount <= 15) {
                    likeElement.style.fontSize = '16px';
                    likeElement.style.textShadow = '0 0 3px #fffc00';
                } else if (likeCount >= 16 && likeCount <= 30) {
                    likeElement.style.fontSize = '18px';
                    likeElement.style.textShadow = '0 0 4px #fffc00';
                } else if (likeCount >= 31 && likeCount <= 60) {
                    likeElement.style.fontSize = '20px';
                    likeElement.style.textShadow = '0 0 5px #fffc00';
                } else if (likeCount >= 61 && likeCount <= 100) {
                    likeElement.style.fontSize = '22px';
                    likeElement.style.textShadow = '0 0 6px #fffc00';
                } else if (likeCount >= 101 && likeCount <= 500) {
                    likeElement.style.fontSize = '24px';
                    likeElement.style.textShadow = '0 0 8px #fffc00, 0 0 12px #fffc00';
                } else if (likeCount >= 501 && likeCount <= 1000) {
                    likeElement.style.fontSize = '26px';
                    likeElement.style.textShadow = '0 0 10px #fffc00, 0 0 15px #fffc00';
                } else if (likeCount > 1000) {
                    likeElement.style.fontSize = '28px';
                    likeElement.style.textShadow = '0 0 10px #fffc00, 0 0 15px #fffc00, 0 0 20px #fffc00';
                }
            }
        });

        // Also style comment counts
        const commentElements = document.querySelectorAll('.comment .engagement-count');

        commentElements.forEach(function(commentElement) {
            const originalText = commentElement.innerText.trim();
            const commentCount = parseCount(originalText);

            if (!isNaN(commentCount)) {
                // Reset existing custom styles
                commentElement.style.fontSize = '';
                commentElement.style.textShadow = '';

                // Style based on number of comments
                if (commentCount >= 1 && commentCount <= 2) {
                    commentElement.style.fontSize = '14px';
                } else if (commentCount >= 3 && commentCount <= 5) {
                    commentElement.style.fontSize = '16px';
                    commentElement.style.textShadow = '0 0 3px #00ffff';
                } else if (commentCount >= 6 && commentCount <= 10) {
                    commentElement.style.fontSize = '18px';
                    commentElement.style.textShadow = '0 0 4px #00ffff';
                } else if (commentCount >= 11 && commentCount <= 30) {
                    commentElement.style.fontSize = '20px';
                    commentElement.style.textShadow = '0 0 6px #00ffff, 0 0 10px #00ffff';
                } else if (commentCount > 30) {
                    commentElement.style.fontSize = '22px';
                    commentElement.style.textShadow = '0 0 8px #00ffff, 0 0 12px #00ffff, 0 0 16px #00ffff';
                }
            }
        });
    }

    // Function to make interaction bars visible by manipulating the DOM
    function forceShowInteractionBars() {
        // Find all photo containers
        const photoContainers = document.querySelectorAll('.photo-list-photo-view');

        photoContainers.forEach(container => {
            // Find the interaction bar in this container
            const interactionBar = container.querySelector('.interaction-bar');

            if (interactionBar) {
                // Completely hide the original interaction bar
                interactionBar.style.display = 'none';
                interactionBar.style.opacity = '0';
                interactionBar.style.visibility = 'hidden';
                interactionBar.style.pointerEvents = 'none';

                // Remove any padding we might have added before
                container.style.paddingBottom = '';
                container.style.marginBottom = '';

                // Create a new div for displaying stats if it doesn't exist yet
                let statsDiv = container.querySelector('.always-visible-stats');

                if (!statsDiv) {
                    statsDiv = document.createElement('div');
                    statsDiv.className = 'always-visible-stats';

                    // Apply explicit styles directly to the element
                    statsDiv.style.position = 'absolute';
                    statsDiv.style.bottom = '0';
                    statsDiv.style.left = '0';
                    statsDiv.style.right = '0';
                    statsDiv.style.height = '25px';
                    statsDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
                    statsDiv.style.color = '#ffffff';
                    statsDiv.style.display = 'flex';
                    statsDiv.style.alignItems = 'center';
                    statsDiv.style.justifyContent = 'space-around';
                    statsDiv.style.zIndex = '9999';
                    statsDiv.style.padding = '0';

                    // Get original elements
                    const faveItem = interactionBar.querySelector('.engagement-item.fave');
                    const commentItem = interactionBar.querySelector('.engagement-item.comment');

                    if (faveItem && commentItem) {
                        // Create custom fave element with working interaction
                        const customFaveItem = document.createElement('div');
                        customFaveItem.className = 'custom-fave-item';
                        customFaveItem.style.display = 'flex';
                        customFaveItem.style.alignItems = 'center';
                        customFaveItem.style.cursor = 'pointer';
                        customFaveItem.style.padding = '0 10px';

                        // Create star icon
                        const starIcon = document.createElement('span');
                        starIcon.innerHTML = '★'; // Unicode star
                        starIcon.style.color = '#fffc00'; // Yellow color
                        starIcon.style.fontSize = '16px';
                        starIcon.style.marginRight = '4px';
                        starIcon.style.lineHeight = '1';

                        // Get original count
                        const countSpan = faveItem.querySelector('.engagement-count');
                        const customCountSpan = document.createElement('span');
                        customCountSpan.className = 'custom-engagement-count';
                        customCountSpan.textContent = countSpan ? countSpan.textContent : '0';
                        customCountSpan.style.color = '#fffc00'; // Yellow color

                        // Add click event that triggers the original fave button
                        customFaveItem.addEventListener('click', function(e) {
                            e.stopPropagation(); // Prevent triggering photo click
                            // Click the original fave button
                            faveItem.click();
                            // Update our custom count after a short delay
                            setTimeout(() => {
                                const updatedCount = faveItem.querySelector('.engagement-count');
                                if (updatedCount) {
                                    customCountSpan.textContent = updatedCount.textContent;
                                    // Re-stylize after update
                                    stylizeCustomCounts();
                                }
                            }, 1000);
                        });

                        // Assemble fave item
                        customFaveItem.appendChild(starIcon);
                        customFaveItem.appendChild(customCountSpan);

                        // Create custom comment element (non-interactive, just display)
                        const customCommentItem = document.createElement('a');
                        customCommentItem.className = 'custom-comment-item';
                        customCommentItem.style.display = 'flex';
                        customCommentItem.style.alignItems = 'center';
                        customCommentItem.style.padding = '0 10px';
                        customCommentItem.style.textDecoration = 'none';

                        // Set the href to the original comment link if available
                        if (commentItem.hasAttribute('href')) {
                            customCommentItem.href = commentItem.getAttribute('href');
                        }

                        // Comment icon
                        const commentIcon = document.createElement('span');
                        commentIcon.innerHTML = '💬'; // Speech bubble emoji
                        commentIcon.style.fontSize = '14px';
                        commentIcon.style.marginRight = '4px';
                        commentIcon.style.lineHeight = '1';

                        // Comment count
                        const commentCountSpan = commentItem.querySelector('.engagement-count');
                        const customCommentCountSpan = document.createElement('span');
                        customCommentCountSpan.className = 'custom-comment-count';
                        customCommentCountSpan.textContent = commentCountSpan ? commentCountSpan.textContent : '0';
                        customCommentCountSpan.style.color = '#00ffff'; // Cyan color

                        // Assemble comment item
                        customCommentItem.appendChild(commentIcon);
                        customCommentItem.appendChild(customCommentCountSpan);

                        // Add both items to our custom stats bar
                        statsDiv.appendChild(customFaveItem);
                        statsDiv.appendChild(customCommentItem);

                        // Find the appropriate place to add our element
                        const photoElement = container.querySelector('.photo-list-photo-container');
                        if (photoElement) {
                            photoElement.appendChild(statsDiv);
                        } else {
                            container.appendChild(statsDiv);
                        }
                    }
                }
            }
        });

        // Apply styling to our custom counts
        stylizeCustomCounts();
    }

    // Function to stylize our custom counts
    function stylizeCustomCounts() {
        // Style fave counts
        const customFaveCounts = document.querySelectorAll('.custom-engagement-count');

        customFaveCounts.forEach(function(countElement) {
            const originalText = countElement.textContent.trim();
            const likeCount = parseCount(originalText);

            if (!isNaN(likeCount)) {
                // Reset styles
                countElement.style.fontSize = '';
                countElement.style.textShadow = '';

                // Apply styling based on count
                if (likeCount >= 1 && likeCount <= 5) {
                    countElement.style.fontSize = '14px';
                } else if (likeCount >= 6 && likeCount <= 15) {
                    countElement.style.fontSize = '16px';
                    countElement.style.textShadow = '0 0 3px #fffc00';
                } else if (likeCount >= 16 && likeCount <= 30) {
                    countElement.style.fontSize = '18px';
                    countElement.style.textShadow = '0 0 4px #fffc00';
                } else if (likeCount >= 31 && likeCount <= 60) {
                    countElement.style.fontSize = '20px';
                    countElement.style.textShadow = '0 0 5px #fffc00';
                } else if (likeCount >= 61 && likeCount <= 100) {
                    countElement.style.fontSize = '22px';
                    countElement.style.textShadow = '0 0 6px #fffc00';
                } else if (likeCount >= 101 && likeCount <= 500) {
                    countElement.style.fontSize = '24px';
                    countElement.style.textShadow = '0 0 8px #fffc00, 0 0 12px #fffc00';
                } else if (likeCount >= 501 && likeCount <= 1000) {
                    countElement.style.fontSize = '26px';
                    countElement.style.textShadow = '0 0 10px #fffc00, 0 0 15px #fffc00';
                } else if (likeCount > 1000) {
                    countElement.style.fontSize = '28px';
                    countElement.style.textShadow = '0 0 10px #fffc00, 0 0 15px #fffc00, 0 0 20px #fffc00';
                }
            }
        });

        // Style comment counts
        const customCommentCounts = document.querySelectorAll('.custom-comment-count');

        customCommentCounts.forEach(function(countElement) {
            const originalText = countElement.textContent.trim();
            const commentCount = parseCount(originalText);

            if (!isNaN(commentCount)) {
                // Reset styles
                countElement.style.fontSize = '';
                countElement.style.textShadow = '';

                // Apply styling based on count
                if (commentCount >= 1 && commentCount <= 2) {
                    countElement.style.fontSize = '14px';
                } else if (commentCount >= 3 && commentCount <= 5) {
                    countElement.style.fontSize = '16px';
                    countElement.style.textShadow = '0 0 3px #00ffff';
                } else if (commentCount >= 6 && commentCount <= 10) {
                    countElement.style.fontSize = '18px';
                    countElement.style.textShadow = '0 0 4px #00ffff';
                } else if (commentCount >= 11 && commentCount <= 30) {
                    countElement.style.fontSize = '20px';
                    countElement.style.textShadow = '0 0 6px #00ffff, 0 0 10px #00ffff';
                } else if (commentCount > 30) {
                    countElement.style.fontSize = '22px';
                    countElement.style.textShadow = '0 0 8px #00ffff, 0 0 12px #00ffff, 0 0 16px #00ffff';
                }
            }
        });
    }

    // Main function to run on page load and after content changes
    function initialize() {
        // First, inject custom CSS to make bars visible
        injectCustomCSS();

        // Also force show by manipulating DOM directly
        forceShowInteractionBars();

        // No longer need this as we now use stylizeCustomCounts
        // stylizeLikeCounts();
    }

    // Set up observer to watch for dynamically loaded content
    function setupObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    // Wait a moment to let any dynamic content fully render
                    setTimeout(stylizeLikeCounts, 300);
                }
            });
        });

        // Start observing the document body for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initial run
    document.addEventListener('DOMContentLoaded', function() {
        initialize();
        setupObserver();
    });

    // Run immediately for already loaded content
    initialize();
    setupObserver();

    // Run multiple times with delays to ensure we catch all dynamic content
    setTimeout(initialize, 500);
    setTimeout(initialize, 1500);
    setTimeout(initialize, 3000);

    // Set up interval to periodically check and update
    setInterval(initialize, 5000);

    // Additional force refresh on page interactions
    document.addEventListener('click', function() {
        setTimeout(initialize, 100);
    });

    // Target specific events that might trigger content changes
    window.addEventListener('scroll', function() {
        // Debounce the scroll event
        clearTimeout(window.flickrStatsScrollTimer);
        window.flickrStatsScrollTimer = setTimeout(initialize, 300);
    });
})();