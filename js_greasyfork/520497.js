// ==UserScript==
// @name         Chickensmoothie Trade Page Navigation
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Use customizable keys to navigate Prev and Next buttons on Chickensmoothie trade pages.
// @author       You
// @match        https://www.chickensmoothie.com/trades/edittrade.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chickensmoothie.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520497/Chickensmoothie%20Trade%20Page%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/520497/Chickensmoothie%20Trade%20Page%20Navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the keys for navigation (default: 'a' and 'd')
    const KEY_PREV = 'a'; // Key to navigate to the previous page
    const KEY_NEXT = 'd'; // Key to navigate to the next page

    // Function to find the Prev and Next buttons
    function getPrevNextButtons() {
        let prevButton = null;
        let nextButton = null;

        // Check for visible item navigation
        const activeCategory = document.querySelector('div.category-body[style*="display: block"]');
        if (activeCategory) {
            const pageArrows = activeCategory.querySelectorAll('.page-arrow a[href]');
            prevButton = Array.from(pageArrows).find(button => button.textContent.includes('Prev')) || null;
            nextButton = Array.from(pageArrows).find(button => button.textContent.includes('Next')) || null;
        }

        // Check for active tab navigation if no category-body found
        if (!prevButton && !nextButton) {
            const activeTab = document.querySelector('ul.ui-tabs-nav li[aria-selected="true"]');
            if (activeTab) {
                const tabId = activeTab.getAttribute('aria-controls');
                const tabContent = document.getElementById(tabId);
                if (tabContent) {
                    const pageArrows = tabContent.querySelectorAll('.page-arrow a[href]');
                    prevButton = Array.from(pageArrows).find(button => button.textContent.includes('Prev')) || null;
                    nextButton = Array.from(pageArrows).find(button => button.textContent.includes('Next')) || null;
                }
            }
        }

        // Fall back to global navigation
        if (!prevButton && !nextButton) {
            const pageArrows = document.querySelectorAll('.page-numbers .page-arrow a[href]');
            prevButton = Array.from(pageArrows).find(button => button.textContent.includes('Prev')) || null;
            nextButton = Array.from(pageArrows).find(button => button.textContent.includes('Next')) || null;
        }

        return { prevButton, nextButton };
    }

    // Handle key presses and navigate appropriately
    document.addEventListener('keydown', (event) => {
        if (event.key === KEY_PREV || event.key === KEY_NEXT) {
            const { prevButton, nextButton } = getPrevNextButtons();

            if (event.key === KEY_PREV && prevButton) {
                // Navigate to Prev page
                prevButton.click();
            } else if (event.key === KEY_NEXT && nextButton) {
                // Navigate to Next page
                nextButton.click();
            }
        }
    });
})();
