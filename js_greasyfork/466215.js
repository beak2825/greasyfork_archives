// ==UserScript==
// @name         Hide Certain Menu Items
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hide menu items based on certain tags
// @author       ChatGPT4, caffeineaddiction
// @match        https://my.tovala.com/menu/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466215/Hide%20Certain%20Menu%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/466215/Hide%20Certain%20Menu%20Items.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Script Did Run");
    // List of tags to exclude
    const tagsToExclude = ["VG", "PREMIUM"]; // Make sure these are uppercase
    const servingsToExclude = ["2 servings"]; // Serving sizes to exclude

    // Function to hide menu items with certain tags
    function hideCertainMenuItems() {
        console.log("MutationObserver Triggered");
        // Get all menu items
        const menuItems = document.querySelectorAll('.md\\:px-4');

        // Loop through each menu item
        menuItems.forEach(menuItem => {
            // Get the tag of the menu item
            const tags = menuItem.querySelectorAll('span, div');

            tags.forEach(tag => {
                // Convert the tag to uppercase before checking
                const tagText = tag.textContent.trim().toUpperCase();

                // If the tag is in the list of tags to exclude, remove the menu item
                if (tagsToExclude.includes(tagText)) {
                    menuItem.remove();
                    console.log(`Removed menu item with tag: '${tagText}'`);
                }
            });

            // Get the serving size of the menu item
            const servings = menuItem.querySelectorAll('.mb-2.text-k\\/14_120');

            servings.forEach(serving => {
                const servingText = serving.textContent.trim();

                // If the serving size contains any of the servings to exclude, remove the menu item
                if (servingsToExclude.some(servingToExclude => servingText.includes(servingToExclude))) {
                    menuItem.remove();
                    console.log(`Removed menu item with serving size: '${servingText}'`);
                }
            });
        });
    }

    // Set up a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(hideCertainMenuItems);

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
})();
