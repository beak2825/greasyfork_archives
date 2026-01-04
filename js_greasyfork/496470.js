// ==UserScript==
// @name        AliExpress Rating Calculator
// @description  Takes product star ratings and puts a numerical values over them.
// @match        https://www.aliexpress.com/
// @match        https://www.aliexpress.com/*
// @match        https://*.aliexpress.com/*
// @grant       none
// @version     0.2
// @author      Anon
// @noframes
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// @namespace https://greasyfork.org/users/1309046
// @downloadURL https://update.greasyfork.org/scripts/496470/AliExpress%20Rating%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/496470/AliExpress%20Rating%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scrollCount = 0;

    // Function to calculate and display the rating for each star list
    function calculateRatings() {
        // Select all elements with class containing "multi--starList--" or "t9_CA"
        const starListElements = document.querySelectorAll('[class*="multi--starList--"], [class*="t9_CA"]');

        starListElements.forEach(starList => {
            // Select all elements with class containing "multi--evalutionModal--" or "Ktfxu" within the current star list
            const modalElements = starList.querySelectorAll('[class*="multi--evalutionModal--"], [class*="Ktfxu"]');

            let totalWidth = 0;
            let starCount = 0;

            modalElements.forEach(modal => {
                // Select all the star elements with class containing "multi--progress--" or "_2E4Wz" within the current modal
                const starElements = modal.querySelectorAll('[class*="multi--progress--"], [class*="_2E4Wz"]');

                // Loop through each star element and sum up their widths
                starElements.forEach(star => {
                    const width = parseInt(star.style.width);
                    totalWidth += width;
                    starCount++;
                });
            });

            // Calculate the rating (assuming each full star is represented by 10px width)
            const rating = totalWidth / 10;

            // Create a div to display the rating
            const ratingDisplay = document.createElement('div');
            ratingDisplay.style.backgroundColor = 'black';
            ratingDisplay.style.color = 'white';
            ratingDisplay.style.padding = '3px';
            ratingDisplay.style.position = 'absolute';
            ratingDisplay.style.zIndex = '1';
            ratingDisplay.textContent = `${rating.toFixed(1)} stars`;

            // Append the rating display
            starList.appendChild(ratingDisplay);
        });
    }

    // Run the function after the page has loaded
    window.addEventListener('load', calculateRatings);

    // Function to handle scroll events
    function handleScroll() {
        scrollCount++;
        if (scrollCount >= 10) {
            scrollCount = 0;
            calculateRatings();
        }
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
})();