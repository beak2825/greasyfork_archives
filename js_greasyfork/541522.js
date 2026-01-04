// ==UserScript==
// @name          Sort Menu Items Alphabetically (Exclude "Other") - CSS Order
// @namespace     http://tampermonkey.net/
// @version       0.4
// @description   Sort all menu items alphabetically except those containing "Other", which are placed at the end, using CSS order for non-invasive sorting.
// @author        You
// @match         https://expert-portal.com/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/541522/Sort%20Menu%20Items%20Alphabetically%20%28Exclude%20%22Other%22%29%20-%20CSS%20Order.user.js
// @updateURL https://update.greasyfork.org/scripts/541522/Sort%20Menu%20Items%20Alphabetically%20%28Exclude%20%22Other%22%29%20-%20CSS%20Order.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let debounceTimer;
    const DEBOUNCE_DELAY = 100; // milliseconds. Adjust as needed (50-200ms is common).

    // Function to sort the items within a given menu element using CSS `order`
    function sortMenuItems(menu) {
        const items = Array.from(menu.querySelectorAll('[role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"]'));

        if (items.length === 0) return;

        // --- Crucial Step for CSS `order` ---
        // Ensure the menu container is a flex container for `order` to work.
        // Check computed style to see if it's already flex or grid.
        const computedDisplay = window.getComputedStyle(menu).display;
        if (computedDisplay !== 'flex' && computedDisplay !== 'grid') {
            // If it's not flex or grid, we attempt to make it flex.
            // WARNING: This *might* alter the layout if the original styling wasn't expecting flex.
            menu.style.display = 'flex';
            menu.style.flexDirection = 'column'; // Menus are typically vertical
            // console.warn("Tampermonkey: Menu container was not display:flex or display:grid. Forced display: flex and flexDirection: column. This might affect original layout.");
        }

        // Prepare items for sorting, keeping their original element reference and text content
        const itemsToSort = items.map(item => ({
            element: item,
            text: item.textContent.trim().toLowerCase()
        }));

        // Sort items conceptually based on your rules
        itemsToSort.sort((a, b) => {
            const isAOther = a.text.includes('other');
            const isBOther = b.text.includes('other');

            // Move "Other" items to the end
            if (isAOther && !isBOther) return 1;
            if (!isAOther && isBOther) return -1;

            // For items that are both "Other" or both "Non-Other", sort alphabetically
            return a.text.localeCompare(b.text);
        });

        // Apply CSS 'order' property to each element based on its sorted position
        // This is the non-invasive reordering step.
        itemsToSort.forEach((itemWrapper, index) => {
            itemWrapper.element.style.order = index;
        });

        // Optional: Reset order for any items that might have been removed
        // (though if an element is removed, it won't be in `items` anyway)
        // This is generally not needed with this approach.
    }

    // Function to find all menus and apply or re-apply the sorting
    function findAndSortMenus() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            // console.log('Tampermonkey: Debounced sorting initiated.');
            const menus = document.querySelectorAll('[role="menu"]');
            menus.forEach(menu => {
                sortMenuItems(menu);
            });
            // console.log('Tampermonkey: Menus sorted using CSS order.');
        }, DEBOUNCE_DELAY);
    }

    // --- MutationObserver Setup ---
    // Observe childList changes and subtree for robustness
    const observerConfig = { childList: true, subtree: true };

    const observer = new MutationObserver((mutationsList, observer) => {
        // Any mutation will trigger a debounced call to findAndSortMenus
        findAndSortMenus();
    });

    // Start observing the document body for changes
    observer.observe(document.body, observerConfig);

    // Initial sort when the page is fully loaded
    window.addEventListener('load', findAndSortMenus);

    // Also run on DOMContentLoaded for potentially faster initial sort if elements are ready
    document.addEventListener('DOMContentLoaded', findAndSortMenus);

})();