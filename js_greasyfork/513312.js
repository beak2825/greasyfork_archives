// ==UserScript==
// @name         IMVU Creator PID Backup Utility - JSON Numbers
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Scrapes product IDs and names from IMVU shop pages, navigating through all pages, showing a cute button, and saving results as JSON.
// @author       heapsofjoy
// @match        https://www.imvu.com/shop/web_search.php?manufacturers_id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513312/IMVU%20Creator%20PID%20Backup%20Utility%20-%20JSON%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/513312/IMVU%20Creator%20PID%20Backup%20Utility%20-%20JSON%20Numbers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button to trigger scraping
    const button = document.createElement('button');
    button.innerHTML = '💖 Scrape All Pages 💖';  // Add a cute emoji to the button
    button.style.position = 'fixed';
    button.style.bottom = '10px';  // Position near the bottom of the page
    button.style.right = '10px';   // Position near the right edge of the page
    button.style.zIndex = '10001';
    button.style.padding = '12px 20px';
    button.style.backgroundColor = '#ff69b4';  // Pink color
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '20px';  // Rounded corners
    button.style.fontFamily = 'Arial, sans-serif';
    button.style.fontSize = '16px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0px 4px 10px rgba(0,0,0,0.1)';
    document.body.appendChild(button);

    // Create a sidebar to hold product IDs and names (above the button)
    const sidebar = document.createElement('div');
    sidebar.id = 'product-sidebar';
    sidebar.style.position = 'fixed';
    sidebar.style.bottom = '115px';  // Position above the button
    sidebar.style.right = '10px';
    sidebar.style.width = '300px';
    sidebar.style.height = '80%';
    sidebar.style.overflowY = 'scroll';
    sidebar.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    sidebar.style.color = 'white';
    sidebar.style.padding = '10px';
    sidebar.style.fontFamily = 'Arial, sans-serif';
    sidebar.style.fontSize = '14px';
    sidebar.style.zIndex = '10000';
    sidebar.style.borderRadius = '8px';
    sidebar.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
    sidebar.style.display = 'none'; // Hidden until button is pressed
    document.body.appendChild(sidebar);

    const header = document.createElement('h2');
    header.textContent = 'Product List';
    header.style.color = 'yellow';
    sidebar.appendChild(header);

    const productList = document.createElement('ul');
    productList.id = 'product-list';
    productList.style.listStyleType = 'none';
    productList.style.padding = '0';
    sidebar.appendChild(productList);

    // Create a Save as JSON button (hidden initially)
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save as JSON';
    saveButton.style.display = 'none';  // Hidden until scraping completes
    saveButton.style.marginTop = '10px';
    saveButton.style.padding = '10px 15px';
    saveButton.style.backgroundColor = '#ff69b4';  // Pink color
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '20px';  // Rounded corners
    saveButton.style.cursor = 'pointer';
    sidebar.appendChild(saveButton);

    // Create loading spinner inside the button
    const loadingSpinner = document.createElement('div');
    loadingSpinner.id = 'loading-spinner';
    loadingSpinner.style.display = 'none';  // Hidden initially
    loadingSpinner.style.width = '16px';
    loadingSpinner.style.height = '16px';
    loadingSpinner.style.border = '3px solid #f3f3f3';
    loadingSpinner.style.borderTop = '3px solid white';  // Matching white to the button text
    loadingSpinner.style.borderRadius = '50%';
    loadingSpinner.style.animation = 'spin 1s linear infinite';
    loadingSpinner.style.marginLeft = '8px';  // Spacing between the text and the spinner
    button.appendChild(loadingSpinner);  // Add spinner inside the button

    // Add the CSS for the spinner animation
    const spinnerStyle = document.createElement('style');
    spinnerStyle.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinnerStyle);

    // To track all scraped products across pages
    const allProducts = [];
    const addedProductIds = new Set(); // To track unique product IDs

    // Function to extract product IDs and names from the current page
    function scrapeProducts() {
        const productLinks = document.querySelectorAll('a[href*="products_id="]'); // Select all <a> tags that contain "products_id=" in href
        const productData = [];

        productLinks.forEach(product => {
            const productIdMatch = product.href.match(/products_id=(\d+)/); // Extract the product ID from the href attribute
            const productName = product.getAttribute('title') || product.textContent.trim(); // Get the product name from the title or inner text

            if (productIdMatch && productName) {
                const productId = productIdMatch[1];
                if (!addedProductIds.has(productId)) { // If the product hasn't been added yet
                    productData.push({ id: parseInt(productId), name: productName }); // Ensure ID is treated as a number
                    addedProductIds.add(productId); // Mark this product ID as added
                }
            }
        });

        return productData;
    }

    // Function to add leading zeros to numbers (e.g., 1 -> 0001)
    function formatNumber(number, digits) {
        return number.toString().padStart(digits, '0');
    }

    // Function to add product data to the sidebar
    function displayProducts(products) {
        products.sort((a, b) => a.id - b.id); // Sort by product ID (numeric)
        productList.innerHTML = ''; // Clear any existing content

        products.forEach((product, index) => {
            const listItem = document.createElement('li');
            const formattedIndex = formatNumber(index + 1, 4); // Add leading zeros to the index (e.g., 0001, 0002, ...)
            listItem.textContent = `${formattedIndex}. ${product.name} - (${product.id})`;
            productList.appendChild(listItem);
        });
    }

    // Function to navigate to a specific page by modifying the URL
    function navigateToPage(pageNumber, manufacturerId) {
        const newUrl = `https://www.imvu.com/shop/web_search.php?manufacturers_id=${manufacturerId}&page=${pageNumber}`;
        window.history.pushState({}, '', newUrl); // Change URL without reloading the page
        return fetch(newUrl)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                return doc;
            });
    }

    // Function to scrape through all pages one by one
    function scrapeAllPages(pageNumber, manufacturerId) {
        navigateToPage(pageNumber, manufacturerId).then(doc => {
            const productLinks = doc.querySelectorAll('a[href*="products_id="]');
            if (productLinks.length === 0) {
                // No more products on this page, stop
                sidebar.style.display = 'block';
                loadingSpinner.style.display = 'none'; // Hide loading spinner
                button.innerHTML = '💖 Scrape All Pages 💖';  // Reset the button text
                displayProducts(allProducts); // Display all products collected
                navigateToPage(1, manufacturerId);  // Navigate back to page 1

                // Show the Save as JSON button
                saveButton.style.display = 'block';

                return;
            }

            // Scrape products from the current page
            const productData = [];
            productLinks.forEach(product => {
                const productIdMatch = product.href.match(/products_id=(\d+)/);
                const productName = product.getAttribute('title') || product.textContent.trim();
                if (productIdMatch && productName) {
                    const productId = productIdMatch[1];
                    if (!addedProductIds.has(productId)) {
                        productData.push({ id: parseInt(productId), name: productName });
                        addedProductIds.add(productId);
                    }
                }
            });

            allProducts.push(...productData); // Append new products

            // Go to the next page
            scrapeAllPages(pageNumber + 1, manufacturerId);
        });
    }

    // Add event listener to the button to trigger scraping
    button.addEventListener('click', function() {
        const manufacturerIdMatch = window.location.href.match(/manufacturers_id=(\d+)/);
        if (!manufacturerIdMatch) {
            alert('Manufacturer ID not found in URL.');
            return;
        }

        const manufacturerId = manufacturerIdMatch[1];

        // Clear previous products
        allProducts.length = 0;
        addedProductIds.clear();
        productList.innerHTML = ''; // Clear any existing content

        // Show loading spinner and update button text
        loadingSpinner.style.display = 'inline-block';
        button.innerHTML = '💖 Scraping... ';
        button.appendChild(loadingSpinner);

        // Start scraping from page 1
        scrapeAllPages(1, manufacturerId);
    });

    // Add event listener to the Save as JSON button to save the data
    saveButton.addEventListener('click', function() {
        const productsWithOrder = allProducts.map((product, index) => ({
            order: formatNumber(index + 1, 4),  // Add leading zeros to order (e.g., 0001)
            id: product.id,
            name: product.name
        }));

        const jsonContent = JSON.stringify(productsWithOrder, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'imvu_products.json';
        a.click();
        URL.revokeObjectURL(url);
    });

})();
