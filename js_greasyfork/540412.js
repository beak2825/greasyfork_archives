// ==UserScript==
// @name         CookUnity Meal Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlights meals based on tag has multi-color gradient border for multiple tags.
// @author       OthorWight
// @match        *://*.cookunity.com/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/540412/CookUnity%20Meal%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/540412/CookUnity%20Meal%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const HIGHLIGHT_STYLES = {
        premium: '#333333',
        discount: '#007BFF',
        new: '#FFD700',
    };

    function updateAllMealHighlights() {
        const allMeals = document.querySelectorAll('.meal-menu-item');

        allMeals.forEach(mealElement => {
            const container = mealElement.closest('.meal-menu-item__container');
            if (!container) return;

            const colors = [];

            // Check for each type of tag and add its color to the array.
            if (mealElement.getAttribute('data-product-premium') === 'true') {
                colors.push(HIGHLIGHT_STYLES.premium);
            }
            if (mealElement.getAttribute('data-product-has-discount') === 'true') {
                colors.push(HIGHLIGHT_STYLES.discount);
            }
            if (mealElement.getAttribute('data-product-top-tag') === 'NEW_RECIPE') {
                colors.push(HIGHLIGHT_STYLES.new);
            }

            container.style.position = 'relative';

            if (colors.length > 0) {
                container.style.borderRadius = '12px';
                container.style.boxSizing = 'border-box';
                container.style.backgroundColor = 'rgba(128, 128, 128, 0.05)';
                container.style.boxShadow = '';

                if (colors.length === 1) {
                    // If there's only one tag, use a simple solid border.
                    container.style.border = `3px solid ${colors[0]}`;
                    container.style.borderImage = '';
                } else {
                    // If there are multiple tags, create a multi-color gradient border.
                    const gradient = `linear-gradient(45deg, ${colors.join(', ')})`;
                    container.style.border = '3px solid transparent';
                    container.style.borderImage = `${gradient} 1`;
                }

            } else {
                container.style.borderRadius = '';
                container.style.boxSizing = '';
                container.style.boxShadow = '';
                container.style.backgroundColor = '';
                container.style.border = '';
                container.style.borderImage = '';
            }
        });
    }

    let debounceTimer;

    const observer = new MutationObserver((mutationsList) => {
        const hasAddedNodes = mutationsList.some(mutation => mutation.addedNodes.length > 0);
        if (hasAddedNodes) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(updateAllMealHighlights, 300);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    updateAllMealHighlights();
})();
