// ==UserScript==
// @name         Flickr Likes Styler - Enhanced Levels
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  This script adjusts Flickr photo like counts by changing font size and background color. It uses an enhanced level system for better visibility at both low and high like counts.
// @author       fapek GPT (modified)
// @match        https://*.flickr.com/photos/*/albums/*
// @match        https://*.flickr.com/photos/*/galleries/*/
// @match        https://*.flickr.com/photos/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530908/Flickr%20Likes%20Styler%20-%20Enhanced%20Levels.user.js
// @updateURL https://update.greasyfork.org/scripts/530908/Flickr%20Likes%20Styler%20-%20Enhanced%20Levels.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The function that changes the style based on the number of likes.
    function stylizeLikes() {
        // Detect if we're in a low-likes album by sampling the first 20 photos
        let likeElements = document.querySelectorAll('span.engagement-count');
        let sampleSize = Math.min(20, likeElements.length);
        let totalLikes = 0;
        let sampleCount = 0;

        // Calculate average likes from the sample
        for (let i = 0; i < sampleSize; i++) {
            let likeCount = parseInt(likeElements[i]?.innerText.trim());
            if (!isNaN(likeCount)) {
                totalLikes += likeCount;
                sampleCount++;
            }
        }

        let avgLikes = sampleCount > 0 ? totalLikes / sampleCount : 0;
        let isLowLikesAlbum = avgLikes < 10;

        // Style all like elements based on detection
        likeElements.forEach(function(likeElement) {
            let likeCount = parseInt(likeElement.innerText.trim());

            if (!isNaN(likeCount)) {
                // Reset styles first
                likeElement.style.color = '';
                likeElement.style.fontWeight = '';
                likeElement.style.fontSize = '';

                if (isLowLikesAlbum) {
                    // Low-likes album mode - more granular at lower levels with enhanced visibility
                    if (likeCount === 0) {
                        // No styling for zero likes
                    } else if (likeCount === 1) {
                        likeElement.style.color = '#4B0082'; // Indigo - much more visible
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '1.25em';
                        likeElement.style.textShadow = '0 0 1px #FFF'; // Subtle text shadow for visibility
                    } else if (likeCount === 2) {
                        likeElement.style.color = '#9400D3'; // DarkViolet
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '1.4em';
                        likeElement.style.textShadow = '0 0 1px #FFF';
                    } else if (likeCount === 3) {
                        likeElement.style.color = '#0000CD'; // MediumBlue
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '1.55em';
                        likeElement.style.textShadow = '0 0 1px #FFF';
                    } else if (likeCount === 4) {
                        likeElement.style.color = '#008B8B'; // DarkCyan
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '1.7em';
                        likeElement.style.textShadow = '0 0 1px #FFF';
                    } else if (likeCount === 5) {
                        likeElement.style.color = '#006400'; // DarkGreen
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '1.85em';
                        likeElement.style.textShadow = '0 0 1px #FFF';
                    } else if (likeCount === 6) {
                        likeElement.style.color = '#FF8C00'; // DarkOrange
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '2.0em';
                        likeElement.style.textShadow = '0 0 1px #000';
                    } else if (likeCount === 7) {
                        likeElement.style.color = '#FF4500'; // OrangeRed
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '2.15em';
                        likeElement.style.textShadow = '0 0 1px #000';
                    } else if (likeCount === 8) {
                        likeElement.style.color = '#FF0000'; // Red
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '2.3em';
                        likeElement.style.textShadow = '0 0 1px #000';
                    } else if (likeCount === 9) {
                        likeElement.style.color = '#B22222'; // FireBrick
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '2.4em';
                        likeElement.style.textShadow = '0 0 2px #000';
                    } else if (likeCount >= 10 && likeCount <= 12) {
                        likeElement.style.color = '#8B0000'; // DarkRed
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '2.5em';
                        likeElement.style.textShadow = '0 0 2px #000';
                    } else if (likeCount >= 13 && likeCount <= 15) {
                        likeElement.style.color = '#800000'; // Maroon
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '2.6em';
                        likeElement.style.textShadow = '0 0 3px #000';
                    } else if (likeCount > 15) {
                        likeElement.style.color = '#4B0000'; // Deeper Maroon
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '2.7em';
                        likeElement.style.textShadow = '0 0 3px #000';
                    }
                } else {
                    // High-likes album mode - expanded scale with more levels and larger sizes
                    if (likeCount >= 0 && likeCount <= 5) {
                        likeElement.style.color = '#808080'; // Gray
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '1.1em';
                    } else if (likeCount >= 6 && likeCount <= 10) {
                        likeElement.style.color = '#696969'; // DimGray
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '1.2em';
                    } else if (likeCount >= 11 && likeCount <= 15) {
                        likeElement.style.color = '#A0522D'; // Sienna
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '1.3em';
                    } else if (likeCount >= 16 && likeCount <= 20) {
                        likeElement.style.color = '#CD853F'; // Peru
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '1.4em';
                    } else if (likeCount >= 21 && likeCount <= 30) {
                        likeElement.style.color = '#8B4513'; // SaddleBrown
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '1.5em';
                    } else if (likeCount >= 31 && likeCount <= 40) {
                        likeElement.style.color = '#FF8C00'; // DarkOrange
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '1.6em';
                    } else if (likeCount >= 41 && likeCount <= 50) {
                        likeElement.style.color = '#9932CC'; // DarkOrchid
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '1.7em';
                    } else if (likeCount >= 51 && likeCount <= 60) {
                        likeElement.style.color = '#8A2BE2'; // BlueViolet
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '1.8em';
                    } else if (likeCount >= 61 && likeCount <= 70) {
                        likeElement.style.color = '#483D8B'; // DarkSlateBlue
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '1.9em';
                    } else if (likeCount >= 71 && likeCount <= 80) {
                        likeElement.style.color = '#0000CD'; // MediumBlue
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '2.0em';
                    } else if (likeCount >= 81 && likeCount <= 90) {
                        likeElement.style.color = '#4169E1'; // RoyalBlue
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '2.1em';
                    } else if (likeCount >= 91 && likeCount <= 100) {
                        likeElement.style.color = '#008000'; // Green
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '2.2em';
                    } else if (likeCount >= 101 && likeCount <= 125) {
                        likeElement.style.color = '#006400'; // DarkGreen
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '2.3em';
                    } else if (likeCount >= 126 && likeCount <= 150) {
                        likeElement.style.color = '#A52A2A'; // Brown
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '2.4em';
                    } else if (likeCount >= 151 && likeCount <= 175) {
                        likeElement.style.color = '#8B0000'; // DarkRed
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '2.5em';
                    } else if (likeCount >= 176 && likeCount <= 200) {
                        likeElement.style.color = '#800000'; // Maroon
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '2.6em';
                    } else if (likeCount >= 201 && likeCount <= 250) {
                        likeElement.style.color = '#4B0082'; // Indigo
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '2.7em';
                    } else if (likeCount >= 251 && likeCount <= 300) {
                        likeElement.style.color = '#2F0000'; // Very Dark Red
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '2.8em';
                    } else if (likeCount > 300) {
                        likeElement.style.color = '#000000'; // Black
                        likeElement.style.fontWeight = 'bold';
                        likeElement.style.fontSize = '2.9em';
                        likeElement.style.textShadow = '0 0 3px #FF0000'; // Red glow
                    }
                }
            }
        });
    }

    // Mutation observer, listens for changes in the DOM.
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length || mutation.removedNodes.length) {
                stylizeLikes();
            }
        });
    });

    // Mutation configuration
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run after the page loads.
    window.addEventListener('load', stylizeLikes);

    // Also run after a short delay to catch dynamic content
    setTimeout(stylizeLikes, 1500);
})();