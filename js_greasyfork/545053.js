// ==UserScript==
// @name         Mattel
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Download the product data from mattel catalogue
// @match        https://shop.mattel.com/collections/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545053/Mattel.user.js
// @updateURL https://update.greasyfork.org/scripts/545053/Mattel.meta.js
// ==/UserScript==


let products = [];
let productList, parentElement;
let lastResponseData = null;
let lastRequestUrl = null;
let lastRequestOptions = null;
let originalFetch;


(function () {
    'use strict';

    originalFetch = window.fetch;
    const targetUrls = ['api/search/search.json'];

    window.fetch = async function (...args) {
        let url = args[0];

        if (typeof url === 'string' && targetUrls.some(targetUrl => url.includes(targetUrl))) {
            console.log(`💡 Intercepted the target request to: ${url}`);

            // Store the complete original request configuration
            lastRequestOptions = args[1] ? { ...args[1] } : {};

            const response = await originalFetch(...args);
            const clonedResponse = response.clone();
            const data = await clonedResponse.json();

            if (data.results?.length) {
                console.log(`✅ Target request finished! Here is the data: `, data);
                // Store the response data and URL for later use
                lastResponseData = data;
                lastRequestUrl = url;

                createDownloadButton();
            }

            return response;
        }

        return originalFetch(...args);
    }
})()


async function createDownloadButton() {
    try {
        if (!productList) {
            productList = await waitForElement("#collectionApp > div.collection__main > div > ul");
            parentElement = productList.parentElement;
        }

        if (parentElement && !document.getElementById("downloadCsvBtn")) {
            const downloadButton = document.createElement('button');
            downloadButton.id = "downloadCsvBtn";
            downloadButton.textContent = 'Download Search Results CSV';
            downloadButton.style.cssText = `
                                display: block;
                                margin-bottom: 10px;
                                padding: 10px;
                                background-color: #007bff;
                                color: white;
                                border: none;
                                border-radius: 5px;
                                cursor: pointer;
                                font-size: 16px;
                                margin-top: 16px;
            `;

            downloadButton.onmouseover = function () {
                this.style.backgroundColor = '#0056b3';
            };
            downloadButton.onmouseout = function () {
                this.style.backgroundColor = '#007bff';
            };

            parentElement.insertBefore(downloadButton, productList);

            downloadButton.addEventListener('click', async () => {
                if (!lastResponseData) {
                    alert('No data available to download!');
                    return;
                }

                // Show loading state
                const originalText = downloadButton.textContent;
                downloadButton.disabled = true;

                try {
                    // Use pagination info from lastResponseData.pagination
                    const pagination = lastResponseData.pagination;
                    const totalResults = pagination.totalResults;
                    const totalPages = pagination.totalPages;

                    let allDocs = [];

                    console.log(`📄 Found ${totalResults} total results across ${totalPages} pages, fetching all pages...`);

                    // Progress callback to update button text
                    const updateProgress = (currentPage, totalPages) => {
                        downloadButton.textContent = `Fetching page ${currentPage} of ${totalPages}...`;
                    };

                    allDocs = await fetchAllPagesFromStart(lastRequestUrl, totalPages, updateProgress);
                    console.log(`✅ Fetched all ${allDocs.length} results across multiple pages`);

                    // Process all products
                    const allProducts = allDocs.map(product => ({
                        'SKU': product.sku,
                        'URL': `https://shop.mattel.com${product.url}`,
                        'NAME': product.name,
                        'RATING': product.rating || 'N/A',
                        'PRICE': product.price,
                        'BRAND': product.brand,
                        'UPC': `= "${product.variants?.length ? JSON.parse(product.variants.replace(/&quot;/g, '"')).map(x => x.barcode).join(', ') : 'N/A'}"`
                    }));

                    if (!allProducts.length) {
                        alert('No products to download!');
                        return;
                    }

                    const csv = jsonToCsv(allProducts);
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;

                    let filename = 'mattel.csv'; // default fallback

                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                } catch (error) {
                    console.error('❌ Error downloading CSV:', error);
                    alert('Error downloading CSV. Please try again.');
                } finally {
                    // Restore button state
                    downloadButton.textContent = originalText;
                    downloadButton.disabled = false;
                }
            });
        }


    } catch (error) {
        console.log('⚠️ Could not create download button:', error);
    }
}

function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) return resolve(element);

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                resolve(el);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within timeout`));
        }, timeout);
    });
}

async function fetchAllPagesFromStart(originalUrl, totalPages, progressCallback) {
    const allDocs = [];
    let pageNumber = 1;

    while (pageNumber <= totalPages) {
        try {
            // Update progress
            if (progressCallback) progressCallback(pageNumber, totalPages);

            // Parse the original URL to preserve all query parameters
            const urlObj = new URL(originalUrl);
            // Set the page parameter for current page (or use 'start' if that's the API)
            urlObj.searchParams.set('page', pageNumber.toString());

            console.log(`📄 Fetching page ${pageNumber} of ${totalPages}`);

            // Use the same request configuration as the original request
            const response = await originalFetch(urlObj.toString(), lastRequestOptions);
            const data = await response.json();

            if (data.results) {
                allDocs.push(...data.results);
                pageNumber++;
            } else {
                break;
            }
        } catch (error) {
            console.error(`❌ Error fetching page ${pageNumber}:`, error);
            break;
        }
    }

    return allDocs;
}


function jsonToCsv(items) {
    if (!items.length) return '';
    const headers = Object.keys(items[0]);
    const escape = (str) => `"${String(str).replace(/"/g, '""')}"`;
    const csvRows = [
        headers.join(','),
        ...items.map(row => headers.map(field => escape(row[field])).join(','))
    ];
    return csvRows.join('\r\n');
}