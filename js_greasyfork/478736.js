// ==UserScript==
// @name         Amazon Product Title Google Search - WF
// @namespace    https://wesfoster.com/
// @version      1.0
// @description  Add a Google search icon next to the product title on Amazon
// @author       Wes Foster
// @match        https://www.amazon.com/*/dp/*
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478736/Amazon%20Product%20Title%20Google%20Search%20-%20WF.user.js
// @updateURL https://update.greasyfork.org/scripts/478736/Amazon%20Product%20Title%20Google%20Search%20-%20WF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Locate the productTitle element
    let productTitleElement = document.getElementById('productTitle');

    if (productTitleElement) {
        // Create new link element
        let linkElement = document.createElement('a');
        linkElement.href = '#';

        // Add event for click to open Google search in new tab
        linkElement.addEventListener('click', function (event) {
            event.preventDefault();
            window.open('https://www.google.com/search?q=' + encodeURIComponent(productTitleElement.textContent.trim()), '_blank');
        });

        // Create new img element
        let imgElement = document.createElement('img');
        imgElement.src = 'https://www.google.com/favicon.ico'; // Google's favicon as icon
        imgElement.style.marginLeft = '10px'; // Add some space between the title and the icon
        imgElement.height = 16; // Modify as needed
        imgElement.width = 16; // Modify as needed

        // Add img to link so image can be clicked
        linkElement.appendChild(imgElement);

        // Add link to product title
        productTitleElement.appendChild(linkElement);
    } else {
        console.log('Amazon Product Title Google Search: Product title not found.')
    }

})();