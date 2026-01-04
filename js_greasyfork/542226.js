// ==UserScript==
// @name         YouTube Shorts Comment Hider
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hides the comment button and the comment count on YouTube Shorts to reduce distractions.
// @author       Gemini (ported to greasyfork by Buck)
// @match        https://www.youtube.com/shorts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542226/YouTube%20Shorts%20Comment%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/542226/YouTube%20Shorts%20Comment%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide the comment button and count
    function hideCommentSectionElements() {
        // Target the parent <label> element that contains both the comment button
        // and the comment count. This is a more robust approach to hide both elements
        // with a single action.
        // We look for a label whose child button has an aria-label containing "comments".
        const commentContainer = document.querySelector('label.yt-spec-button-shape-with-label > button[aria-label*="comments"]')?.closest('label');

        // If the container is found, hide it
        if (commentContainer) {
            // Set display to 'none' to hide the entire element and its children completely
            commentContainer.style.display = 'none';
            console.log('YouTube Shorts: Comment button and count hidden.');
            return true; // Indicate that the elements were found and hidden
        }
        console.log('YouTube Shorts: Comment button/count container not found yet.');
        return false; // Indicate that the elements were not found
    }

    // Use a MutationObserver to watch for changes in the DOM
    // This is crucial for single-page applications like YouTube where content
    // changes without a full page reload (e.g., when navigating between Shorts).
    const observer = new MutationObserver((mutationsList, observer) => {
        // Iterate over all mutations that occurred
        for (const mutation of mutationsList) {
            // Check if nodes were added to the DOM.
            // This is the most common scenario for dynamically loaded content.
            if (mutation.addedNodes.length > 0) {
                // Attempt to hide the elements whenever new nodes are added.
                // This helps catch the elements when they are dynamically loaded onto the page.
                hideCommentSectionElements();
            }
        }
    });

    // Start observing the document body for child list changes and subtree changes.
    // This means it will watch for elements being added or removed anywhere in the DOM.
    // We don't need to observe attributes specifically here, as we are looking for the
    // presence of the container itself.
    observer.observe(document.body, { childList: true, subtree: true });

    // Also, run the function once immediately in case the elements are already present on page load.
    hideCommentSectionElements();
})();
