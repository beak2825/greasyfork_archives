// ==UserScript==
// @name         HelloFresh Hide Premium Recipes
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Hides HelloFresh recipes with additional costs
// @author       You
// @match        https://www.hellofresh.de/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526030/HelloFresh%20Hide%20Premium%20Recipes.user.js
// @updateURL https://update.greasyfork.org/scripts/526030/HelloFresh%20Hide%20Premium%20Recipes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideExpensiveRecipes() {
        console.log('Script running...');

        const priceElements = document.querySelectorAll('[data-test-id="mealkit-surcharge-price"]');
        console.log('Found price elements:', priceElements.length);

        priceElements.forEach((priceEl, index) => {
            const priceText = priceEl.textContent || '';
            console.log(`Price element ${index} text:`, priceText);

            if (priceText.includes('+')) {
                // Find parent recipe container
                const recipeContainer = priceEl.closest('[data-test-id^="item-"]');
                if (recipeContainer) {
                    console.log('Hiding recipe:', recipeContainer.getAttribute('data-test-id'));
                    recipeContainer.style.display = 'none';
                    recipeContainer.style.visibility = 'hidden';
                    recipeContainer.style.opacity = '0';
                    recipeContainer.style.height = '0';
                    recipeContainer.style.overflow = 'hidden';
                }
            }
        });
    }

    // Run immediately and after short delay
    hideExpensiveRecipes();
    setTimeout(hideExpensiveRecipes, 1500);

    // Watch for DOM changes
    const observer = new MutationObserver((mutations) => {
        const hasNewPrices = mutations.some(mutation =>
            Array.from(mutation.addedNodes)
                .some(node => node.querySelector?.('[data-test-id="mealkit-surcharge-price"]'))
        );

        if (hasNewPrices) {
            hideExpensiveRecipes();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();