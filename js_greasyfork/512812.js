// ==UserScript==
// @name         Flickr Likes Styler - 10 Levels
// @namespace    http://tampermonkey.net/
// @version      1.71
// @description  This script adjusts Flickr photo like counts by changing font size and background color.
// @description  It uses 10 proportional levels, making likes more visually distinct as they increase.

// @author       fapek GPT
// @match        https://*.flickr.com/photos/*/albums/*
// @match        https://*.flickr.com/photos/*/galleries/*/
// @license MIT

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512812/Flickr%20Likes%20Styler%20-%2010%20Levels.user.js
// @updateURL https://update.greasyfork.org/scripts/512812/Flickr%20Likes%20Styler%20-%2010%20Levels.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The function that changes the style based on the number of likes.
    function stylizeLikes() {
        let likeElements = document.querySelectorAll('span.engagement-count');

        likeElements.forEach(function(likeElement) {
            let likeCount = parseInt(likeElement.innerText.trim());

            if (!isNaN(likeCount)) {
                // Style change depending on amount
                if (likeCount >= 0 && likeCount <= 10) {
                    likeElement.style.color = 'darkgray';
                    likeElement.style.fontWeight = 'bold';
                } else if (likeCount >= 11 && likeCount <= 20) {
                    likeElement.style.color = 'lightgray';
                    likeElement.style.fontWeight = 'bold';
                    likeElement.style.fontSize = '1.2em';
                } else if (likeCount >= 21 && likeCount <= 30) {
                    likeElement.style.color = 'brown';
                    likeElement.style.fontWeight = 'bold';
                    likeElement.style.fontSize = '1.3em';
                } else if (likeCount >= 31 && likeCount <= 40) {
                    likeElement.style.color = 'orange';
                    likeElement.style.fontWeight = 'bold';
                    likeElement.style.fontSize = '1.4em';
                } else if (likeCount >= 41 && likeCount <= 50) {
                    likeElement.style.color = 'darkviolet';
                    likeElement.style.fontWeight = 'bold';
                    likeElement.style.fontSize = '1.5em';
                } else if (likeCount >= 51 && likeCount <= 75) {
                    likeElement.style.color = 'blue';
                    likeElement.style.fontWeight = 'bold';
                    likeElement.style.fontSize = '1.6em';
                } else if (likeCount >= 76 && likeCount <= 100) {
                    likeElement.style.color = 'green';
                    likeElement.style.fontWeight = 'bold';
                    likeElement.style.fontSize = '1.7em';
                } else if (likeCount >= 101 && likeCount <= 150) {
                    likeElement.style.color = 'darkred';
                    likeElement.style.fontWeight = 'bold';
                    likeElement.style.fontSize = '1.8em';
                } else if (likeCount >= 151 && likeCount <= 250) {
                    likeElement.style.color = 'darkgreen';
                    likeElement.style.fontWeight = 'bold';
                    likeElement.style.fontSize = '1.9em';
                } else if (likeCount > 250) {
                    likeElement.style.color = 'maroon';
                    likeElement.style.fontWeight = 'bold';
                    likeElement.style.fontSize = '1.99em';
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
})();
