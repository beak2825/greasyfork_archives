// ==UserScript==
// @name         Audiomack Search Results
// @namespace    http://tampermonkey.net/
// @version      2024-10-15
// @description  Inject input fields containing the page URL into search results and remove "onetrust-pc-sdk" if it appears
// @author       You
// @match        *://audiomack.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=audiomack.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/516619/Audiomack%20Search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/516619/Audiomack%20Search%20Results.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to inject input fields with the URL into results
    function injectURLInput(results) {
        results.forEach(result => {
            // Check if the input field has already been added to avoid duplicates
            if (!result.previousSibling || !result.previousSibling.classList || !result.previousSibling.classList.contains('injected-url')) {
                // Find the anchor element that contains the URL
                const anchor = result.querySelector('a[href]');

                if (anchor) {
                    // Extract the href attribute value (URL)
                    const url = anchor.href;

                    // Create an input element to hold the URL
                    const inputField = document.createElement('input');
                    inputField.type = 'text';
                    inputField.value = url;
                    inputField.classList.add('injected-url');  // Add class to track injected inputs
                    inputField.style.width = '100%';  // Make the input field full-width
                    inputField.style.marginTop = '10px';  // Add spacing for better UI

                    // Add event listener to select text when the input field is focused
                    inputField.addEventListener('focus', function() {
                        inputField.select();
                    });

                    // Insert the input field above the div that contains the song metadata and picture element
                    result.parentNode.insertBefore(inputField, result);
                }
            }
        });
    }

    // Function to remove the "onetrust-pc-sdk" element if it appears
    function removeOneTrustElement() {
        const oneTrustElement = document.getElementById("onetrust-pc-sdk");
        if (oneTrustElement) {
            oneTrustElement.remove();
        }
    }

    // Function to process newly added nodes
    function processNewNodes(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {  // Ensure it's an element node
                        // Remove "onetrust-pc-sdk" if it appears
                        removeOneTrustElement();

                        // Look for matching results within the new node (or if the node itself matches)
                        if (node.matches && node.matches('div.music-showcase_MusicShowcaseMeta__VNEqe')) {
                            injectURLInput([node]);
                        } else if (node.querySelectorAll) {
                            // If the new node contains multiple results, process them
                            const newResults = node.querySelectorAll('div.music-showcase_MusicShowcaseMeta__VNEqe');
                            if (newResults.length > 0) {
                                injectURLInput(newResults);
                            }
                        }
                    }
                });
            }
        }
    }

    // Create a MutationObserver to monitor dynamic changes
    const observer = new MutationObserver(processNewNodes);

    // Observe the entire document body for new elements being added
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial load: handle already-loaded content and check for "onetrust-pc-sdk"
    window.addEventListener('load', () => {
        const initialResults = document.querySelectorAll('div.music-showcase_MusicShowcaseMeta__VNEqe');
        injectURLInput(initialResults);

        // Remove "onetrust-pc-sdk" if it exists initially
        removeOneTrustElement();
    });

})();
