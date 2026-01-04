// ==UserScript==
// @name         Costco
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Intercept fetch requests and responses
// @match        https://www.costco.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544934/Costco.user.js
// @updateURL https://update.greasyfork.org/scripts/544934/Costco.meta.js
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
    const targetUrls = [
        'api/apps/www_costco_com/query/www_costco_com_navigation',
        'api/apps/www_costco_com/query/www_costco_com_search'
    ];

    window.fetch = async function (...args) {
        let url = args[0];

        if (typeof url === 'string' && targetUrls.some(targetUrl => url.includes(targetUrl))) {
            console.log(`💡 Intercepted the target request to: ${url}`);

            // Store the complete original request configuration
            lastRequestOptions = args[1] ? { ...args[1] } : {};

            const response = await originalFetch(...args);
            const clonedResponse = response.clone();
            const data = await clonedResponse.json();

            console.log('✅ Target request finished! Here is the data:', data);

            // Store the response data and URL for later use
            lastResponseData = data;
            lastRequestUrl = url;

            // Process only the first page initially
            products = data.response.docs.filter(x => x.item_classification_itemclass === "Standard").map(product => ({
                'ITEM NUMBER': product.item_number,
                'GROUP_ID': product.group_id,
                'URL': `https://www.costco.com/smart-brand-deals.product.${product.item_number}.html`,
                'DELIVERY STATUS': product.deliveryStatus,
                'NAME': product.item_product_name,
                'RATING': product.item_review_ratings,
                'PRICE': product.item_location_pricing_salePrice,
                'BRAND': product.Brand_attr?.join(', ') || '',
                'UPC': product.item_manufacturing_skus?.join("\n") || ""
            }));

            createDownloadButton();

            return response;
        }

        return originalFetch(...args);
    };
})();

async function fetchAllPages(originalUrl, pageSize, remainingItems) {
    const allDocs = [];
    let currentStart = pageSize;

    while (remainingItems > 0) {
        try {
            // Parse the original URL to preserve all query parameters
            const urlObj = new URL(originalUrl);
            // Only update the start parameter
            urlObj.searchParams.set('start', currentStart.toString());

            console.log(`📄 Fetching page starting at ${currentStart}...`);

            // Use the same request configuration as the original request
            const response = await originalFetch(urlObj.toString(), lastRequestOptions);
            const data = await response.json();

            if (data.response && data.response.docs) {
                allDocs.push(...data.response.docs);
                const fetchedCount = data.response.docs.length;
                remainingItems -= fetchedCount;
                currentStart += fetchedCount;

                // Break if no more docs returned
                if (fetchedCount === 0) break;
            } else {
                break;
            }
        } catch (error) {
            console.error(`❌ Error fetching page starting at ${currentStart}:`, error);
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

async function createDownloadButton() {
    try {
        if (!productList) {
            productList = await waitForElement("#productList");
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
                    // Check if there are more pages to fetch
                    const numFound = lastResponseData.response.numFound;
                    const docsLength = lastResponseData.response.docs.length;

                    let allDocs = [];

                    if (numFound > docsLength) {
                        const totalPages = Math.ceil(numFound / docsLength);
                        console.log(`📄 Found ${numFound} total results across ${totalPages} pages, fetching all pages...`);

                        // Progress callback to update button text
                        const updateProgress = (currentPage, totalPages) => {
                            downloadButton.textContent = `Fetching page ${currentPage} of ${totalPages}...`;
                        };

                        allDocs = await fetchAllPagesFromStart(lastRequestUrl, numFound, docsLength, updateProgress);
                        console.log(`✅ Fetched all ${allDocs.length} results across multiple pages`);
                    } else {
                        // Only one page exists
                        downloadButton.textContent = 'Processing results...';
                        allDocs = [...lastResponseData.response.docs];
                    }

                    // Process all products
                    const allProducts = allDocs.filter(x => x.item_classification_itemclass === "Standard").map(product => ({
                        'ITEM NUMBER': product.item_number,
                        'GROUP_ID': product.group_id,
                        'URL': `https://www.costco.com/smart-brand-deals.product.${product.item_number}.html`,
                        'DELIVERY STATUS': product.deliveryStatus,
                        'NAME': product.item_product_name,
                        'RATING': product.item_review_ratings,
                        'PRICE': product.item_location_pricing_salePrice,
                        'BRAND': product.Brand_attr?.join(', ') || '',
                        'UPC': product.item_manufacturing_skus?.join("\n") || ""
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

                    // Generate filename based on current URL path
                    const currentPath = window.location.pathname;
                    const pathSegments = currentPath.split('/').filter(segment => segment.length > 0);
                    let filename = 'search_results.csv'; // default fallback

                    if (pathSegments.length > 0) {
                        // Get the first meaningful segment and remove .html extension if present
                        let pageName = pathSegments[0].replace('.html', '');
                        // Clean up the name for use as filename
                        pageName = pageName.replace(/[^a-zA-Z0-9-_]/g, '_');
                        filename = `${pageName}.csv`;
                    }

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

async function fetchAllPagesFromStart(originalUrl, totalItems, pageSize, progressCallback) {
    const allDocs = [];
    let currentStart = 0;
    let pageNumber = 1;
    const totalPages = Math.ceil(totalItems / pageSize);

    while (currentStart < totalItems) {
        try {
            // Update progress
            if (progressCallback) {
                progressCallback(pageNumber, totalPages);
            }

            // Parse the original URL to preserve all query parameters
            const urlObj = new URL(originalUrl);
            // Set the start parameter for current page
            urlObj.searchParams.set('start', currentStart.toString());

            console.log(`📄 Fetching page ${pageNumber} of ${totalPages} (starting at ${currentStart})...`);

            // Use the same request configuration as the original request
            const response = await originalFetch(urlObj.toString(), lastRequestOptions);
            const data = await response.json();

            if (data.response && data.response.docs) {
                allDocs.push(...data.response.docs);
                const fetchedCount = data.response.docs.length;

                // Break if no more docs returned or if we've fetched everything
                if (fetchedCount === 0 || allDocs.length >= totalItems) break;

                currentStart += fetchedCount;
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
