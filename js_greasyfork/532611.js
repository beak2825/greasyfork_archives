// ==UserScript==
// @name         HelloFresh Hide Premium and Sold Out Recipes
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Hides HelloFresh recipes with additional costs and sold out items
// @author       You
// @match        https://www.hellofresh.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hellofresh.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532611/HelloFresh%20Hide%20Premium%20and%20Sold%20Out%20Recipes.user.js
// @updateURL https://update.greasyfork.org/scripts/532611/HelloFresh%20Hide%20Premium%20and%20Sold%20Out%20Recipes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideRecipes() {
        console.log('Script running...');

        // Hide expensive recipes
        const priceElements = document.querySelectorAll('[data-test-id="mealkit-surcharge-price"]');
        console.log('Found price elements:', priceElements.length);

        priceElements.forEach((priceEl, index) => {
            const priceText = priceEl.textContent || '';
            console.log(`Price element ${index} text:`, priceText);

            if (priceText.includes('+')) {
                hideRecipeContainer(priceEl);
            }
        });

        // Hide sold out recipes
        const soldOutLabels = document.querySelectorAll('[data-test-id="product-label-sold-out"]');
        console.log('Found sold out elements:', soldOutLabels.length);

        soldOutLabels.forEach((label, index) => {
            console.log(`Found sold out item ${index}`);
            hideRecipeContainer(label);
        });
    }

    function hideRecipeContainer(element) {
        const recipeContainer = element.closest('[data-test-id^="item-"]');
        if (recipeContainer) {
            console.log('Hiding recipe:', recipeContainer.getAttribute('data-test-id'));
            recipeContainer.style.display = 'none';
            recipeContainer.style.visibility = 'hidden';
            recipeContainer.style.opacity = '0';
            recipeContainer.style.height = '0';
            recipeContainer.style.overflow = 'hidden';
        }
    }

    // Run immediately and after short delay
    hideRecipes();
    setTimeout(hideRecipes, 1500);

    // Watch for DOM changes
    const observer = new MutationObserver((mutations) => {
        const hasRelevantChanges = mutations.some(mutation =>
            Array.from(mutation.addedNodes).some(node =>
                node.querySelector?.('[data-test-id="mealkit-surcharge-price"]') ||
                node.querySelector?.('[data-test-id="product-label-sold-out"]')
            )
        );

        if (hasRelevantChanges) {
            hideRecipes();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();