// ==UserScript==
// @name         Amazon Transaction History Exporter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Export Amazon transaction history to CSV
// @author       kylemd
// @match        https://www.amazon.com.au/cpe/yourpayments/transactions*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530506/Amazon%20Transaction%20History%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/530506/Amazon%20Transaction%20History%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const config = {
        buttonText: 'Export Transactions to CSV',
        csvFilename: 'amazon_transactions.csv',
        csvHeader: 'Date,Description,Amount,Order ID,Is Refund\n',
        maxPages: 50, // Safety limit to prevent infinite loops
        statusElementId: 'amazon-export-status',
        containerElementId: 'amazon-export-container',
        buttonCheckInterval: 2000, // Check for button existence every 2 seconds
    };

    // Main data storage
    let allTransactions = [];
    let currentPage = 1;
    let isExporting = false;
    let widgetState = '';
    let nextPageKey = '';
    let statusElement = null;
    let buttonContainer = null;
    let buttonCheckTimer = null;

    // Helper functions
    function createExportButton() {
        // Check if container already exists
        if (document.getElementById(config.containerElementId)) {
            return document.getElementById(config.containerElementId);
        }

        // Create container for button and status
        const container = document.createElement('div');
        container.id = config.containerElementId;
        container.style.cssText = 'margin: 20px 0; padding: 10px; background-color: #f8f8f8; border: 1px solid #ddd; border-radius: 4px; position: sticky; top: 0; z-index: 1000;';

        // Create export button
        const button = document.createElement('button');
        button.textContent = config.buttonText;
        button.style.cssText = 'background-color: #f0c14b; border: 1px solid #a88734; border-radius: 3px; padding: 8px 16px; margin-right: 10px; cursor: pointer;';
        button.addEventListener('click', startExport);

        // Create status element
        statusElement = document.createElement('span');
        statusElement.id = config.statusElementId;
        statusElement.style.cssText = 'display: inline-block; margin-left: 10px; color: #555;';

        // Add elements to container
        container.appendChild(button);
        container.appendChild(statusElement);

        // Find a good place to insert the container - try multiple possible locations
        let inserted = false;

        // Try to insert before the transactions box
        const targetElement = document.querySelector('.a-box-group');
        if (targetElement && targetElement.parentNode) {
            targetElement.parentNode.insertBefore(container, targetElement);
            inserted = true;
        }

        // If that failed, try the main content area
        if (!inserted) {
            const mainContent = document.getElementById('a-page') || document.querySelector('main');
            if (mainContent) {
                mainContent.insertBefore(container, mainContent.firstChild);
                inserted = true;
            }
        }

        // Last resort - add to body
        if (!inserted) {
            document.body.insertBefore(container, document.body.firstChild);
        }

        buttonContainer = container;
        return container;
    }

    function ensureButtonExists() {
        if (!document.getElementById(config.containerElementId)) {
            createExportButton();
        }
    }

    function startButtonCheckTimer() {
        stopButtonCheckTimer(); // Clear any existing timer
        buttonCheckTimer = setInterval(ensureButtonExists, config.buttonCheckInterval);
    }

    function stopButtonCheckTimer() {
        if (buttonCheckTimer) {
            clearInterval(buttonCheckTimer);
            buttonCheckTimer = null;
        }
    }

    function updateStatus(message) {
        // Ensure the status element exists
        ensureButtonExists();

        const statusEl = document.getElementById(config.statusElementId);
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    function getWidgetState() {
        const widgetStateInput = document.querySelector('input[name="ppw-widgetState"]');
        return widgetStateInput ? widgetStateInput.value : '';
    }

    function extractTransactionsFromPage() {
        try {
            const transactions = [];

            // Get all transaction date containers - these define the transaction date groups
            const dateContainers = document.querySelectorAll('.apx-transaction-date-container');

            dateContainers.forEach(dateContainer => {
                const dateText = dateContainer.textContent.trim();

                // Get all transactions for this date by looking at the next sibling element
                let currentElement = dateContainer.nextElementSibling;

                while (currentElement && !currentElement.classList.contains('apx-transaction-date-container')) {
                    // Process all transaction line items in this group
                    const lineItemContainers = currentElement.querySelectorAll('.apx-transactions-line-item-component-container');

                    lineItemContainers.forEach(container => {
                        // Extract the transaction details
                        const descriptionElement = container.querySelector('.a-column.a-span9 span');
                        const amountElement = container.querySelector('.a-column.a-span3 span');
                        const orderLinkElement = container.querySelector('a.a-link-normal');

                        if (descriptionElement && amountElement) {
                            const description = descriptionElement.textContent.trim();
                            const amount = amountElement.textContent.trim();

                            // Handle both regular orders and refunds
                            let orderID = '';
                            let isRefund = false;

                            if (orderLinkElement) {
                                const linkText = orderLinkElement.textContent.trim();
                                if (linkText.startsWith('Refund: Order #')) {
                                    orderID = linkText.replace('Refund: Order #', '');
                                    isRefund = true;
                                } else {
                                    orderID = linkText.replace('Order #', '');
                                }
                            }

                            // Check if this is a refund by looking at amount color
                            if (!isRefund && amountElement.classList.contains('a-color-success')) {
                                isRefund = true;
                            }

                            transactions.push({
                                date: dateText,
                                description: description,
                                amount: amount,
                                orderID: orderID,
                                isRefund: isRefund
                            });
                        }
                    });

                    // Move to the next element at the same level
                    currentElement = currentElement.nextElementSibling;
                }
            });

            return transactions;
        } catch (error) {
            console.error('Error extracting transactions:', error);
            return [];
        }
    }

    function findNextPageKey() {
        // Try to find the next page button input element
        const nextPageInput = document.querySelector('input[name*="DefaultNextPageNavigationEvent"]');
        if (nextPageInput) {
            const nameAttr = nextPageInput.getAttribute('name');
            const match = nameAttr.match(/nextPageKey":"([^"]+)"/);
            return match ? match[1] : '';
        }
        return '';
    }

    function convertToCSV(transactions) {
        let csv = config.csvHeader;

        transactions.forEach(transaction => {
            // Escape fields that might contain commas
            const description = `"${transaction.description.replace(/"/g, '""')}"`;
            const orderID = `"${transaction.orderID.replace(/"/g, '""')}"`;
            const isRefund = transaction.isRefund ? "Yes" : "No";

            csv += `${transaction.date},${description},${transaction.amount},${orderID},${isRefund}\n`;
        });

        return csv;
    }

    function downloadCSV(csv) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        GM_download({
            url: url,
            name: config.csvFilename,
            saveAs: true,
            onload: () => URL.revokeObjectURL(url)
        });
    }

    function constructRequestBody(nextPageKey, widgetState) {
        // This is a more accurate representation of what Amazon expects in the request
        return `ppw-widgetEvent%3ADefaultNextPageNavigationEvent%3A%7B%22nextPageKey%22%3A%22${encodeURIComponent(nextPageKey)}%22%7D=&ppw-jsEnabled=true&ppw-widgetState=${encodeURIComponent(widgetState)}&ie=UTF-8`;
    }

    function getCustomerIdAndWidgetId() {
        // Initialize with empty values - we'll try to extract them from the page
        let customerId = '';
        let widgetInstanceId = '';

        // Try to extract from URL or page elements
        try {
            // Look for the customer ID in the continueWidget URL in any script on the page
            const scripts = document.querySelectorAll('script');
            for (let i = 0; i < scripts.length; i++) {
                const script = scripts[i].textContent || '';
                // Check for customer ID pattern in any widget URLs
                const customerMatch = script.match(/customer\/([A-Z0-9]+)\/continueWidget/);
                if (customerMatch && customerMatch[1]) {
                    customerId = customerMatch[1];
                    break;
                }
            }

            // If we couldn't find it in scripts, look in the current URL
            if (!customerId) {
                const urlMatch = window.location.href.match(/customer\/([A-Z0-9]+)/);
                if (urlMatch && urlMatch[1]) {
                    customerId = urlMatch[1];
                }
            }

            // Last resort - try to find it in any element's data attributes
            if (!customerId) {
                const elements = document.querySelectorAll('[data-customer-id]');
                if (elements.length > 0 && elements[0].getAttribute('data-customer-id')) {
                    customerId = elements[0].getAttribute('data-customer-id');
                }
            }

            // Look for widget instance ID
            const widgetInfoElements = document.querySelectorAll('[data-pmts-component-id]');
            if (widgetInfoElements.length > 0) {
                const componentId = widgetInfoElements[0].getAttribute('data-pmts-component-id');
                if (componentId) {
                    // The widget ID might be encoded somewhere in the page
                    const widgetIdMatch = document.body.innerHTML.match(/widgetInstanceId":"([^"]+)"/);
                    if (widgetIdMatch && widgetIdMatch[1]) {
                        widgetInstanceId = widgetIdMatch[1];
                    }
                }
            }

            // If we still don't have the widget ID, try to find it in other patterns
            if (!widgetInstanceId) {
                const widgetMatch = document.body.innerHTML.match(/widget-info":\s*"([^"]+)"/);
                if (widgetMatch && widgetMatch[1]) {
                    const parts = widgetMatch[1].split('/');
                    if (parts.length > 2) {
                        widgetInstanceId = parts[2];
                    }
                }
            }
        } catch (e) {
            console.error('Error extracting customer ID and widget ID:', e);
        }

        // If we couldn't find the values, provide a warning but continue
        if (!customerId || !widgetInstanceId) {
            console.warn('Could not automatically detect customer ID or widget instance ID. ' +
                'You may need to manually extract these from the network request.');
        }

        return { customerId, widgetInstanceId };
    }

    function requestNextPage() {
        if (!nextPageKey || currentPage >= config.maxPages) {
            finishExport();
            return;
        }

        updateStatus(`Fetching page ${currentPage + 1}...`);

        // Get the customer ID and widget instance ID
        const { customerId, widgetInstanceId } = getCustomerIdAndWidgetId();

        // Log the values for debugging
        console.log('Using Customer ID:', customerId);
        console.log('Using Widget Instance ID:', widgetInstanceId);

        const requestBody = constructRequestBody(nextPageKey, widgetState);

        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://www.amazon.com.au/payments-portal/data/widgets2/v1/customer/${customerId}/continueWidget`,
            data: requestBody,
            headers: {
                'accept': 'application/json, text/javascript, */*; q=0.01',
                'accept-language': 'en-AU,en;q=0.9',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'apx-widget-info': `YA:MPO/desktop/${widgetInstanceId}`,
                'x-requested-with': 'XMLHttpRequest'
            },
            onload: processNextPage,
            onerror: handleError
        });
    }

    function processNextPage(response) {
        if (response.status === 200) {
            try {
                const data = JSON.parse(response.responseText);

                // Create a temporary div to parse the HTML content
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = data.htmlContent;

                // Extract transactions from the processed HTML
                const transactions = extractTransactionsFromHTML(tempDiv);
                if (transactions.length > 0) {
                    allTransactions = allTransactions.concat(transactions);
                    updateStatus(`Found ${allTransactions.length} transactions so far...`);
                }

                // Update the widget state for the next request
                const newWidgetState = extractWidgetStateFromHTML(tempDiv);
                if (newWidgetState) {
                    widgetState = newWidgetState;
                }

                // Find the next page key for the next request
                const newNextPageKey = extractNextPageKeyFromHTML(tempDiv);
                nextPageKey = newNextPageKey;

                // Increment page counter and continue if we have a next page
                currentPage++;

                // Ensuring the button is still there after potential page updates
                ensureButtonExists();

                if (nextPageKey && currentPage < config.maxPages) {
                    // Slight delay to avoid hammering Amazon servers
                    setTimeout(requestNextPage, 500);
                } else {
                    finishExport();
                }
            } catch (error) {
                console.error('Error processing response:', error);
                handleError(error);
            }
        } else {
            console.error('Failed to get next page. Status:', response.status);
            handleError(new Error(`HTTP error ${response.status}`));
        }
    }

    function extractTransactionsFromHTML(html) {
        const transactions = [];

        // Get all transaction date containers
        const dateContainers = html.querySelectorAll('.apx-transaction-date-container');

        dateContainers.forEach(dateContainer => {
            const dateText = dateContainer.textContent.trim();

            // Get all transactions under this date container
            let currentElement = dateContainer.nextElementSibling;

            while (currentElement && !currentElement.classList.contains('apx-transaction-date-container')) {
                // Process all transaction line items
                const lineItemContainers = currentElement.querySelectorAll('.apx-transactions-line-item-component-container');

                lineItemContainers.forEach(container => {
                    const descriptionElement = container.querySelector('.a-column.a-span9 span');
                    const amountElement = container.querySelector('.a-column.a-span3 span');
                    const orderLinkElement = container.querySelector('a.a-link-normal');

                    if (descriptionElement && amountElement) {
                        const description = descriptionElement.textContent.trim();
                        const amount = amountElement.textContent.trim();

                        // Handle both regular orders and refunds
                        let orderID = '';
                        let isRefund = false;

                        if (orderLinkElement) {
                            const linkText = orderLinkElement.textContent.trim();
                            if (linkText.startsWith('Refund: Order #')) {
                                orderID = linkText.replace('Refund: Order #', '');
                                isRefund = true;
                            } else {
                                orderID = linkText.replace('Order #', '');
                            }
                        }

                        // Check if this is a refund by looking for the success color class
                        if (!isRefund && amountElement.classList.contains('a-color-success')) {
                            isRefund = true;
                        }

                        transactions.push({
                            date: dateText,
                            description: description,
                            amount: amount,
                            orderID: orderID,
                            isRefund: isRefund
                        });
                    }
                });

                currentElement = currentElement.nextElementSibling;
            }
        });

        return transactions;
    }

    function extractWidgetStateFromHTML(html) {
        const widgetStateInput = html.querySelector('input[name="ppw-widgetState"]');
        return widgetStateInput ? widgetStateInput.value : '';
    }

    function extractNextPageKeyFromHTML(html) {
        const nextPageInput = html.querySelector('input[name*="DefaultNextPageNavigationEvent"]');
        if (nextPageInput) {
            const nameAttr = nextPageInput.getAttribute('name');
            const match = nameAttr.match(/nextPageKey":"([^"]+)"/);
            return match ? match[1] : '';
        }
        return '';
    }

    function handleError(error) {
        console.error('Error during export:', error);
        updateStatus(`Error: ${error.message || 'Unknown error during export'}`);
        isExporting = false;
    }

    function startExport() {
        if (isExporting) return;

        isExporting = true;
        allTransactions = [];
        currentPage = 1;

        updateStatus('Starting export...');

        // Get the current page's widget state
        widgetState = getWidgetState();
        if (!widgetState) {
            handleError(new Error('Could not find widget state. Please try reloading the page.'));
            return;
        }

        // Get the next page key for pagination
        nextPageKey = findNextPageKey();

        // Extract transactions from the current page
        updateStatus('Processing current page...');
        const currentPageTransactions = extractTransactionsFromPage();

        if (currentPageTransactions.length > 0) {
            allTransactions = allTransactions.concat(currentPageTransactions);
            updateStatus(`Found ${currentPageTransactions.length} transactions on the current page.`);

            // Request the next page if available
            if (nextPageKey) {
                requestNextPage();
            } else {
                updateStatus('No more pages to process.');
                finishExport();
            }
        } else {
            updateStatus('No transactions found on the current page.');
            finishExport();
        }
    }

    function finishExport() {
        if (allTransactions.length > 0) {
            updateStatus(`Export complete! Downloading ${allTransactions.length} transactions...`);
            const csv = convertToCSV(allTransactions);
            downloadCSV(csv);
        } else {
            updateStatus('No transactions found to export.');
        }

        isExporting = false;
    }

    // Set up a mutation observer to detect when the page content changes
    function setupMutationObserver() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // Check if our button still exists, recreate if needed
                    ensureButtonExists();
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    // Initialize: Create the export button and start monitoring for DOM changes
    function initialize() {
        createExportButton();
        setupMutationObserver();
        startButtonCheckTimer();

        // Also log some debug information
        console.log('Amazon Transaction History Exporter initialized');
    }

    // Start the script once the page is fully loaded
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();