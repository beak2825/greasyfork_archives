// ==UserScript==
// @name         Allegro Listings ID Extraction
// @namespace    http://tampermonkey.net/
// @version      2025-07-31
// @description  Allegro extraction
// @author       You
// @match        https://panel-g.baselinker.com/inventory_products
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baselinker.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544187/Allegro%20Listings%20ID%20Extraction.user.js
// @updateURL https://update.greasyfork.org/scripts/544187/Allegro%20Listings%20ID%20Extraction.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let extractedNumbers = [];
    let currentPage = 1;
    const totalPages = 33;
    let isProcessing = false;

    // Function to wait for element to appear
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            function check() {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                } else {
                    setTimeout(check, 100);
                }
            }
            check();
        });
    }

    // Function to wait for modal to close
    function waitForModalClose(timeout = 5000) {
        return new Promise((resolve) => {
            const startTime = Date.now();

            function check() {
                const modal = document.querySelector('.modal, .modal-dialog, [role="dialog"]');
                if (!modal || modal.style.display === 'none' || !modal.offsetParent) {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    resolve(); // Timeout, continue anyway
                } else {
                    setTimeout(check, 100);
                }
            }
            check();
        });
    }

    // Function to extract Allegro numbers from current page
    async function extractFromCurrentPage() {
        console.log(`Processing page ${currentPage}...`);

        try {
            // Wait for inventory integrations to load
            await waitForElement('.inventory-integrations');

            // Get all inventory-integrations divs
            const integrationDivs = document.querySelectorAll('.inventory-integrations');
            console.log(`Found ${integrationDivs.length} integration divs on page ${currentPage}`);

            for (let i = 0; i < integrationDivs.length; i++) {
                const div = integrationDivs[i];
                const firstLink = div.querySelector('a');

                if (firstLink) {
                    try {
                        // Click the first link
                        firstLink.click();
                        console.log(`Clicked link ${i + 1} of ${integrationDivs.length} on page ${currentPage}`);

                        // Wait for modal to appear
                        await new Promise(resolve => setTimeout(resolve, 500));

                        // Try to find the Allegro link in the modal
                        const allegroLink = document.querySelector('a[href*="allegro.pl/oferta/"]');

                        if (allegroLink) {
                            const href = allegroLink.getAttribute('href');
                            const match = href.match(/allegro\.pl\/oferta\/(\d+)/);

                            if (match && match[1]) {
                                const number = match[1];
                                if (!extractedNumbers.includes(number)) {
                                    extractedNumbers.push(number);
                                    console.log(`Extracted number: ${number} (Total: ${extractedNumbers.length})`);
                                }
                            }
                        } else {
                            console.log(`No Allegro link found in modal for item ${i + 1} on page ${currentPage}`);
                        }

                        // Close modal by clicking outside or pressing ESC
                        const modal = document.querySelector('.modal, .modal-dialog, [role="dialog"]');
                        if (modal) {
                            // Try to find and click close button
                            const closeBtn = modal.querySelector('.close, .btn-close, [data-dismiss="modal"]');
                            if (closeBtn) {
                                closeBtn.click();
                            } else {
                                // Press ESC key
                                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
                            }
                        }

                        // Wait for modal to close
                        await waitForModalClose();
                        await new Promise(resolve => setTimeout(resolve, 300));

                    } catch (error) {
                        console.error(`Error processing item ${i + 1} on page ${currentPage}:`, error);
                        // Try to close any open modal before continuing
                        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
            }

        } catch (error) {
            console.error(`Error processing page ${currentPage}:`, error);
        }
    }

    // Function to go to next page
    function goToNextPage() {
        return new Promise((resolve) => {
            if (currentPage < totalPages) {
                currentPage++;
                console.log(`Navigating to page ${currentPage}...`);

                // Call the table_setPage function
                if (typeof table_setPage === 'function') {
                    table_setPage('table_inventory_products_container', currentPage, true);
                } else {
                    console.error('table_setPage function not found');
                }

                // Wait for page to load
                setTimeout(resolve, 2000);
            } else {
                resolve();
            }
        });
    }

    // Function to download the extracted numbers as CSV
    function downloadCSV() {
        if (extractedNumbers.length === 0) {
            console.log('No numbers extracted to download');
            return;
        }

        const csvContent = extractedNumbers.join(',');
        const blob = new Blob([csvContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `allegro_numbers_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        console.log(`Downloaded ${extractedNumbers.length} numbers to file`);
    }

    // Main processing function
    async function processAllPages() {
        if (isProcessing) {
            console.log('Already processing...');
            return;
        }

        isProcessing = true;
        console.log('Starting extraction process...');

        try {
            // Process all pages
            for (currentPage = 1; currentPage <= totalPages; currentPage++) {
                await extractFromCurrentPage();

                if (currentPage < totalPages) {
                    await goToNextPage();
                }
            }

            console.log(`Extraction complete! Total numbers found: ${extractedNumbers.length}`);
            console.log('Extracted numbers:', extractedNumbers);

            // Download the CSV file
            downloadCSV();

        } catch (error) {
            console.error('Error during processing:', error);
        } finally {
            isProcessing = false;
        }
    }

    // Add a start button to the page
    function addStartButton() {
        // Wait for table-footer-wrapper to be available
        const checkForFooter = () => {
            const footerWrapper = document.querySelector('.table-options-height');
            if (footerWrapper) {
                const button = document.createElement('button');
                button.textContent = 'Start Allegro Number Extraction';
                button.style.cssText = `
                    margin: 10px;
                    padding: 10px 15px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                `;

                button.onclick = processAllPages;
                footerWrapper.appendChild(button);
            } else {
                // If footer wrapper not found, try again after a short delay
                setTimeout(checkForFooter, 1000);
            }
        };

        checkForFooter();

        // Also add a status display
        const status = document.createElement('div');
        status.id = 'extraction-status';
        status.style.cssText = `
            position: fixed;
            top: 50px;
            right: 10px;
            z-index: 10000;
            padding: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            border-radius: 5px;
            font-size: 12px;
            max-width: 300px;
        `;
        status.innerHTML = 'Ready to start extraction';
        document.body.appendChild(status);

        // Update status periodically
        setInterval(() => {
            if (isProcessing) {
                status.innerHTML = `Processing page ${currentPage}/${totalPages}<br>Found ${extractedNumbers.length} numbers`;
            } else if (extractedNumbers.length > 0) {
                status.innerHTML = `Extraction complete!<br>Found ${extractedNumbers.length} numbers`;
            }
        }, 1000);
    }

    // Initialize when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addStartButton);
    } else {
        addStartButton();
    }

    // Expose functions for manual use
    window.allegroExtractor = {
        start: processAllPages,
        numbers: extractedNumbers,
        download: downloadCSV
    };

})();
