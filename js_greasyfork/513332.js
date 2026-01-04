// ==UserScript==
// @name         IMVU Thumbnail Downloader for IMVU Creator PID Backup Utility - JSON Numbers
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Downloads thumbnails from IMVU based on a JSON file
// @author       heapsofjoy
// @match        https://www.imvu.com/shop/web_search.php?manufacturers_id=*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/513332/IMVU%20Thumbnail%20Downloader%20for%20IMVU%20Creator%20PID%20Backup%20Utility%20-%20JSON%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/513332/IMVU%20Thumbnail%20Downloader%20for%20IMVU%20Creator%20PID%20Backup%20Utility%20-%20JSON%20Numbers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button to trigger thumbnail download
    const downloadButton = document.createElement('button');
    downloadButton.innerHTML = '📷 Download Thumbnails 📷'; // Add a cute emoji to the button
    downloadButton.style.position = 'fixed';
    downloadButton.style.bottom = '65px';  // Position above the scraping button
    downloadButton.style.right = '10px';   // Position near the right edge of the page
    downloadButton.style.zIndex = '10001';
    downloadButton.style.padding = '12px 20px';
    downloadButton.style.backgroundColor = '#ff69b4';  // Pink color
    downloadButton.style.color = 'white';
    downloadButton.style.border = 'none';
    downloadButton.style.borderRadius = '20px';  // Rounded corners
    downloadButton.style.fontFamily = 'Arial, sans-serif';
    downloadButton.style.fontSize = '16px';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.boxShadow = '0px 4px 10px rgba(0,0,0,0.1)';
    document.body.appendChild(downloadButton);

    // Create a file input for uploading JSON
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none'; // Hidden by default
    document.body.appendChild(fileInput);

    // Add event listener to the download button
    downloadButton.addEventListener('click', function() {
        fileInput.click(); // Trigger the file input dialog
    });

    // Read the JSON file and download thumbnails
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                downloadThumbnails(jsonData);
            } catch (error) {
                console.error("Error parsing JSON:", error); // Log any JSON parsing errors
                alert("Failed to parse JSON: " + error.message); // Alert the user about the error
            }
        };
        reader.readAsText(file);
    });

    // Function to sanitize file names
    function sanitizeFileName(fileName) {
        // Remove emojis and disallowed Windows characters
        return fileName
            .replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F700}-\u{1F77F}|\u{1F800}-\u{1F8FF}|\u{1F900}-\u{1F9FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}|\u{2700}-\u{27BF}|\u{2B50}]/gu, '') // Remove emojis
            .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_') // Replace disallowed characters with an underscore
            .replace(/^\s+|\s+$/g, '') // Trim leading/trailing whitespace
            .replace(/\s+/g, '_') // Replace spaces with underscores
            .substring(0, 255); // Limit the length to 255 characters
    }

    // Function to download thumbnails based on JSON data
    async function downloadThumbnails(products) {
        if (!Array.isArray(products)) {
            console.error("Invalid JSON structure. Expected an array.");
            alert("Invalid JSON structure. Please ensure the file contains an array of products.");
            return;
        }

        let page = 1; // Start at page 1
        let totalDownloaded = 0; // Count of downloaded images

        // Extract manufacturers_id from the current URL
        const urlParams = new URLSearchParams(window.location.search);
        const manufacturersId = urlParams.get('manufacturers_id');

        while (true) {
            const currentPageUrl = `https://www.imvu.com/shop/web_search.php?manufacturers_id=${manufacturersId}&page=${page}`;
            console.log(`Processing page ${page}...`);

            // Fetch the current page's content
            const response = await fetchPage(currentPageUrl);
            if (!response) {
                console.log(`No more pages to process or error fetching page ${page}.`);
                break; // Exit if there's an error or no response
            }

            // Create a DOM parser to extract elements from the fetched HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(response, 'text/html');

            // Process the thumbnails on the current page
            const downloadedCount = await processPage(doc, products);
            totalDownloaded += downloadedCount;

            if (downloadedCount === 0) {
                console.log(`No more products found on page ${page}.`);
                break; // Exit if no products were found
            }

            page++; // Increment to the next page
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before fetching the next page
        }

        alert(`Downloaded a total of ${totalDownloaded} thumbnails successfully.`);
    }

    // Function to fetch the page content
    function fetchPage(url) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: (response) => {
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        console.error(`Error fetching page: ${response.status}`);
                        resolve(null); // Resolve with null if there's an error
                    }
                },
                onerror: () => {
                    console.error(`Network error fetching page: ${url}`);
                    resolve(null);
                }
            });
        });
    }

    // Function to process thumbnails on the current page
    async function processPage(doc, products) {
        const thumbnailLinks = doc.querySelectorAll('a[href*="products_id="]');
        let downloadedCount = 0;

        thumbnailLinks.forEach(productLink => {
            const productIdMatch = productLink.href.match(/products_id=(\d+)/); // Extract the product ID
            if (!productIdMatch) return;

            const productId = productIdMatch[1];
            const productData = products.find(p => p.id == productId);
            if (!productData) return; // Skip if no matching data found

            const order = productData.order;
            const name = sanitizeFileName(productData.name); // Sanitize the product name for the filename

            // Get the image source from the thumbnail link
            const thumbnailImg = productLink.querySelector('img.thumbnail');
            if (!thumbnailImg) {
                console.warn(`No image found for product ID: ${productId}`);
                return;
            }

            const thumbnailUrl = thumbnailImg.src; // Get the correct thumbnail URL
            const extension = thumbnailUrl.split('.').pop(); // Get the file extension (png, jpg, gif, etc.)

            console.log(`Downloading thumbnail from: ${thumbnailUrl}`); // Log the thumbnail URL for debugging

            // Use GM_download to handle the download without redirecting
            GM_download({
                url: thumbnailUrl,
                name: `Product_${order}_${name}.${extension}`, // Name the file based on the order, name, and extension
                saveAs: false,
                onerror: (error) => console.error("Download error: ", error)
            });
            downloadedCount++;
        });

        return downloadedCount; // Return number of downloaded images
    }
})();