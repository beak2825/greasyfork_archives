// ==UserScript==
// @name         Word and Image Blocker
// @namespace    https://github.com/def-initive/
// @version      1.1
// @description  Block words, phrases and images associated with those phrases. For the UI to add and delete words and phrases to block, please also install the following, https://greasyfork.org/en/scripts/481834-word-and-image-blocker-settings-ui
// @author       def-initive
// @match        *://*/*
// @exclude      *://github.com/*
// @exclude      *://greasyfork.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481833/Word%20and%20Image%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/481833/Word%20and%20Image%20Blocker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to hide images in element, its parents, and siblings
    function hideImagesInElementAndSiblings(element) {
        // Hide images in the element itself
        var imagesInElement = element.querySelectorAll('img');
        imagesInElement.forEach(function (image) {
            image.style.display = "none";
        });

        // Hide images in siblings
        var siblings = Array.from(element.parentElement.children);
        siblings.forEach(function (sibling) {
            if (sibling !== element) {
                var imagesInSibling = sibling.querySelectorAll('img');
                imagesInSibling.forEach(function (image) {
                    image.style.display = "none";
                });
            }
        });
    }

    // Function to hide direct parent containers and their siblings' images
    // containing occurrences of a phrase on a webpage
    function hideParentAndSiblings(phrase) {
        var textNodes = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        var elementsToRemove = [];

        while (textNodes.nextNode()) {
            var textNode = textNodes.currentNode;
            var match = textNode.nodeValue.match(new RegExp(phrase, 'gi'));

            if (match) {
                var parentContainer = textNode.parentElement;
                elementsToRemove.push(parentContainer);
            }
        }

        elementsToRemove.forEach(function (element) {
            // Check if the element is part of the UI created by "Blocked Phrases Settings"
            if (!element.closest('.blocked-phrases-settings-container')) {
                // Hide parent containers
                element.style.color = "black";
                element.style.backgroundColor = "black";

                // Hide images in siblings
                hideImagesInElementAndSiblings(element);
            }
        });
    }

    // Load target phrases from local storage
    var storedPhrases = localStorage.getItem('blockedPhrases');
    var targetPhrases = storedPhrases ? JSON.parse(storedPhrases) : [];

    // Hide direct parent containers and images in their siblings
    targetPhrases.forEach(function (phrase) {
        hideParentAndSiblings(phrase);
    });

    // Observe changes in the DOM to handle dynamically loaded content
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                targetPhrases.forEach(function (phrase) {
                    hideParentAndSiblings(phrase);
                });
            }
        });
    });

    // Configuration of the observer
    var observerConfig = {
        childList: true,
        subtree: true
    };

    // Start observing the DOM
    observer.observe(document.body, observerConfig);

})();
