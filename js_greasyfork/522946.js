// ==UserScript==
// @name         Remove Sidebar on Paramount+
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the sidebar that appears when hovering over the player on Paramount+, preventing player shaking issues.
// @author       ChromuS
// @match        https://www.paramountplus.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522946/Remove%20Sidebar%20on%20Paramount%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/522946/Remove%20Sidebar%20on%20Paramount%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove elements with specific classes
    function removeElements() {
        // Array of classes to be removed
        const classesToRemove = ['skin-sidebar-plugin', 'top-menu-backplane', 'vsc-controller'];

        // Iterate over each class and remove matching elements
        classesToRemove.forEach(className => {
            document.querySelectorAll(`.${className}`).forEach(element => {
                element.remove();
            });
        });
    }

    // Remove elements immediately on load
    removeElements();

    // Set up a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // When the DOM changes, remove the elements again
            removeElements();
        });
    });

    // Start observing the page's body
    observer.observe(document.body, {
        childList: true,        // Observe additions/removals of child nodes
        subtree: true           // Observe the entire DOM subtree
    });
})();
