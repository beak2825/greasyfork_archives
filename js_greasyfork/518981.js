// ==UserScript==
// @name         Auto-Sort RuneLite.net Plugin Hub
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically selects "Sort by time added" on RuneLite plugin hub
// @author       Vexy
// @match        https://runelite.net/plugin-hub/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/518981/Auto-Sort%20RuneLitenet%20Plugin%20Hub.user.js
// @updateURL https://update.greasyfork.org/scripts/518981/Auto-Sort%20RuneLitenet%20Plugin%20Hub.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to sort by "time added"
    function sortByTimeAdded() {
        // Make a list of dropdown options
        const buttons = document.querySelectorAll('.dropdown-menu .dropdown-item');
        for (const button of buttons) {
            // If button text is "Sort by time added", click it
            if (button.textContent.trim() === 'Sort by time added') {
                // Simulate a click on the button
                button.click();
                console.log('Sorted by time added');
                break;
            }
        }
    }

    // Wait for the dropdown menu to be present
    const observer = new MutationObserver(() => {
        if (document.querySelector('.dropdown-menu')) {
            observer.disconnect(); // Stop observing once found
            sortByTimeAdded(); // Trigger the sorting
        }
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();
