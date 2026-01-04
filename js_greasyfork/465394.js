// ==UserScript==
// @name         Walgreens to Walmart/Amazon Search
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Creates buttons that open new tabs on Walmart and Amazon, and searches for the product using the extracted title from Walgreens product page
// @author       Your Name
// @match        https://www.walgreens.com/store/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465394/Walgreens%20to%20WalmartAmazon%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/465394/Walgreens%20to%20WalmartAmazon%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the product title from the page
    var productTitle = document.querySelector('title').innerText.replace(' | Walgreens', '');

    // Create the Walmart search URL with the product title
    var walmartSearchUrl = 'https://www.walmart.com/search?q=' + encodeURIComponent(productTitle) + '&facet=fulfillment_method_in_store%3AIn-store';

    // Create the Amazon search URL with the product title
    var amazonSearchUrl = 'https://www.amazon.com/s?k=' + encodeURIComponent(productTitle);

    // Create the Walmart button element
    var walmartButton = document.createElement('a');
    walmartButton.innerHTML = 'Walmart';
    walmartButton.href = walmartSearchUrl;
    walmartButton.target = '_blank';

    // Create the Amazon button element
    var amazonButton = document.createElement('a');
    amazonButton.innerHTML = 'Amazon';
    amazonButton.href = amazonSearchUrl;
    amazonButton.target = '_blank';

    // Add the buttons after the product name
    var productName = document.querySelector('#productName');
    productName.parentNode.insertBefore(walmartButton, productName.nextSibling);
    productName.parentNode.insertBefore(amazonButton, productName.nextSibling);

    // Style the Walmart button with CSS
    var styleWalmartButton = function(button) {
        button.style.backgroundColor = '#0071DC';
        button.style.color = 'white';
        button.style.padding = '5px 20px';
        button.style.margin = '5px 10px 10px 0';
        button.style.borderRadius = '5px';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#004F9A';
        });

        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#0071DC';
        });
    };

    // Style the Amazon button with CSS
    var styleAmazonButton = function(button) {
        button.style.backgroundColor = '#C45500';
        button.style.color = 'white';
        button.style.padding = '5px 20px';
        button.style.margin = '5px 10px 10px 0';
        button.style.borderRadius = '5px';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#F3A847';
        });

        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#FEBD69';
        });
    };

    styleWalmartButton(walmartButton);
    styleAmazonButton(amazonButton);

})();
