// ==UserScript==
// @name         Product Availability Checker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display Instagram icon with green dot on Amazon and Flipkart product pages based on data from Google Sheets
// @author       Your Name
// @license      MIT
// @match        https://www.amazon.in/*
// @match        https://www.flipkart.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490103/Product%20Availability%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/490103/Product%20Availability%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const googleApiKey = 'f9ef79943782659df6946a421bd6f67edf725395'; // Your Google API Key
    const spreadsheetId = '12n_Ze61eRoiqn6OFFp6hy5-4K85ecJiRQgX15d_l6YQ';
    const sheetName = 'mymart inventory - Sheet1';
    const instagramPageUrl = 'https://www.instagram.com/mym_mart/';

    // Function to fetch data from Google Sheets
    async function fetchDataFromGoogleSheets() {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${googleApiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.values;
    }

    // Function to extract product name from Amazon or Flipkart page
    function extractProductName() {
        let productName = null;
        if (window.location.hostname === 'www.amazon.in') {
            // Logic to extract product name from Amazon page
            productName = document.querySelector('span#productTitle')?.textContent.trim();
        } else if (window.location.hostname === 'www.flipkart.com') {
            // Logic to extract product name from Flipkart page
            productName = document.querySelector('span[class="_35KyD6"]')?.textContent.trim();
        }
        return productName;
    }

    // Function to display Instagram icon with or without green dot
    function displayInstagramIcon(available) {
        let icon = document.getElementById('instagramIcon');
        if (!icon) {
            icon = document.createElement('a');
            icon.id = 'instagramIcon';
            icon.href = instagramPageUrl;
            icon.target = '_blank';
            icon.style.position = 'fixed';
            icon.style.bottom = '20px'; // Adjust position as needed
            icon.style.left = '20px'; // Adjust position as needed
            icon.style.zIndex = '9999';
            icon.style.display = 'block';
            icon.style.width = '50px';
            icon.style.height = '50px';
            icon.style.background = `url('https://cdn-icons-png.flaticon.com/512/174/174855.png') no-repeat center center`;
            icon.style.backgroundSize = 'contain';
            icon.style.borderRadius = '50%';
            icon.style.textDecoration = 'none';
            icon.style.color = 'white';
            icon.style.textAlign = 'center';
            icon.style.lineHeight = '50px';
            icon.style.fontWeight = 'bold';
            document.body.appendChild(icon);
        }

        if (available) {
            icon.style.backgroundColor = 'green';
            icon.textContent = '•'; // Green dot
        } else {
            icon.style.backgroundColor = 'transparent';
            icon.textContent = ''; // No dot
        }
    }

    // Main function to check product availability and display Instagram icon
    async function main() {
        const productTitle = extractProductName();
        if (!productTitle) return; // Exit if product title not found

        const data = await fetchDataFromGoogleSheets();
        for (const row of data) {
            const sheetProductTitle = row[0];
            const quantity = parseInt(row[1]);
            if (productTitle.toLowerCase().includes(sheetProductTitle.toLowerCase())) {
                // Display Instagram icon with or without green dot based on product availability
                displayInstagramIcon(quantity > 0);
                return;
            }
        }
        // If product not available or doesn't match criteria, display Instagram icon without dot
        displayInstagramIcon(false);
    }

    // Run the script
    main();
})();
