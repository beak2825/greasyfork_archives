// ==UserScript==
// @name         c.ai Hide Votes from Chat Window
// @namespace    c.ai Hide Votes from Chat Window
// @version      0.1
// @description  Hide the votes from the chat window
// @author       Vishanka
// @match        https://*.character.ai/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481729/cai%20Hide%20Votes%20from%20Chat%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/481729/cai%20Hide%20Votes%20from%20Chat%20Window.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide the element
    function hideElement() {
        var elementToHide = document.querySelector('.css-1ya7z0e');
        if (elementToHide) {
            elementToHide.style.display = 'none';
        }
    }

    // Function to show the element
    function showElement() {
        var elementToShow = document.querySelector('.css-1ya7z0e');
        if (elementToShow) {
            elementToShow.style.display = 'inline-flex';
        }
    }

    // Observe changes in the DOM
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Check if the target or its descendants have the specified class
            if (mutation.target.matches('.css-1ya7z0e') || mutation.target.querySelector('.css-1ya7z0e')) {
                // Check the current URL
                var currentUrl = window.location.href;

                // Check if the current URL matches the specified pattern
                if (currentUrl.includes('character.ai/chat2')) {
                    // Hide the element
                    hideElement();
                } else {
                    // Show the element
                    showElement();
                }
            }
        });
    });

    // Configuration of the observer:
    var config = { childList: true, subtree: true };

    // Start observing the target node for configured mutations
    observer.observe(document.body, config);

    // Initial hide or show based on the URL
    var initialUrl = window.location.href;
    if (initialUrl.includes('character.ai/chat2')) {
        hideElement();
    } else {
        showElement();
    }
})();