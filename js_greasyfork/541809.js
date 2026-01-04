// ==UserScript==
// @name         Google Finance Filler
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fill Google Finance purchase data from CSV or Google Spreadsheet
// @author       MakMak
// @icon         https://www.gstatic.com/finance/favicon/favicon.png
// @match        https://www.google.com/finance/*
// @match        https://finance.google.com/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541809/Google%20Finance%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/541809/Google%20Finance%20Filler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let buttonInjected = false;

    // Register menu command
    GM_registerMenuCommand("Open Finance Filler", showOverlay);

    // Create the overlay button inside the modal
    function createOverlayButton() {
        // Check if modal exists and button hasn't been injected yet
        const modal = document.querySelector('div[aria-modal="true"]');
        const targetDiv = document.querySelector('div.Y0mrCc');

        if (modal && targetDiv && !buttonInjected) {
            // Check if button already exists to avoid duplicates
            if (targetDiv.querySelector('#finance-filler-btn')) {
                return;
            }

            const button = document.createElement('button');
            button.id = 'finance-filler-btn';
            button.innerHTML = '📊 Filler';
            button.style.cssText = `
                background: #1A73E8;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
                margin-left: 10px;
                font-family: 'Google Sans', Arial, sans-serif;
                font-weight: 500;
                transition: background-color 0.2s;
            `;

            // Add hover effect
            button.addEventListener('mouseenter', () => {
                button.style.background = '#1557B0';
            });
            button.addEventListener('mouseleave', () => {
                button.style.background = '#1A73E8';
            });

            button.addEventListener('click', showOverlay);
            targetDiv.appendChild(button);
            buttonInjected = true;
            console.log('Finance Filler button injected into modal');
        }
    }

    // Monitor for modal appearance
    function monitorForModal() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Check if modal appeared
                    const modal = document.querySelector('div[aria-modal="true"]');
                    if (modal && !buttonInjected) {
                        // Small delay to ensure the target div is ready
                        setTimeout(createOverlayButton, 100);
                    }

                    // Reset flag if modal disappeared
                    if (!modal && buttonInjected) {
                        buttonInjected = false;
                        console.log('Modal closed, reset button injection flag');
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Create and show the overlay
    function showOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'finance-filler-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            border: 2px dashed #ccc;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;

        modal.innerHTML = `
            <h2 style="margin-top: 0; color: #333; font-family: 'Google Sans', Arial, sans-serif;">Google Finance Filler</h2>
            <p style="color: #666; margin-bottom: 20px;">Paste your data in any format (supports tab, comma, semicolon, pipe delimiters):</p>
            <textarea id="csv-input" placeholder="Examples:&#10;10	1/15/24	150.50&#10;5,2/20/24,155.25&#10;15;3/10/24;160.00&#10;20|4/5/24|158.75&#10;&#10;Or paste directly from Google Sheets!" style="
                width: 100%;
                height: 150px;
                border: 1px solid #ddd;
                border-radius: 6px;
                padding: 10px;
                font-family: monospace;
                font-size: 14px;
                resize: vertical;
                box-sizing: border-box;
            "></textarea>
            <div style="margin-top: 20px;">
                <button id="parse-btn" style="
                    background: #1A73E8;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    margin-right: 10px;
                    font-size: 14px;
                ">Parse & Preview</button>
                <button id="close-btn" style="
                    background: #f1f3f4;
                    color: #333;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                ">Cancel</button>
            </div>
            <div id="preview-container" style="margin-top: 20px;"></div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Event listeners
        document.getElementById('parse-btn').addEventListener('click', parseAndPreview);
        document.getElementById('close-btn').addEventListener('click', closeOverlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeOverlay();
        });
    }

    // Intelligent CSV parsing with multiple delimiter support
    function parseCSVData(input) {
        const lines = input.split('\n').filter(line => line.trim());
        if (lines.length === 0) return [];

        // Detect delimiter by checking the first line
        const firstLine = lines[0];
        const delimiters = ['\t', ',', ';', '|'];
        let bestDelimiter = ';';
        let maxColumns = 0;

        for (let delimiter of delimiters) {
            const columns = firstLine.split(delimiter).length;
            if (columns > maxColumns) {
                maxColumns = columns;
                bestDelimiter = delimiter;
            }
        }

        console.log(`Detected delimiter: "${bestDelimiter}" with ${maxColumns} columns`);

        const data = [];

        for (let i = 0; i < lines.length; i++) {
            const parts = lines[i].split(bestDelimiter).map(part => part.trim());

            if (parts.length < 3) {
                alert(`Error on line ${i + 1}: Expected at least 3 columns (Quantity, Date, Price), got ${parts.length}`);
                return null;
            }

            // Take first 3 columns as Quantity, Date, Price
            const quantity = parseInt(parts[0].replace(/[^0-9]/g, '')); // Remove non-numeric chars
            const date = parts[1];
            const price = parseFloat(parts[2].replace(/[^0-9.-]/g, '')); // Remove non-numeric chars except decimal point and minus

            if (isNaN(quantity) || isNaN(price)) {
                alert(`Error on line ${i + 1}: Invalid quantity (${parts[0]}) or price (${parts[2]})`);
                return null;
            }

            data.push({ quantity, date, price });
        }

        return data;
    }

    // Parse CSV and show preview
    function parseAndPreview() {
        const input = document.getElementById('csv-input').value.trim();
        if (!input) {
            alert('Please paste your CSV data first.');
            return;
        }

        const data = parseCSVData(input);
        if (data) {
            showPreview(data);
        }
    }

    // Show preview table
    function showPreview(data) {
        const container = document.getElementById('preview-container');
        container.innerHTML = `
            <h3 style="color: #333; margin-bottom: 15px;">Preview (${data.length} entries):</h3>
            <div style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; border-radius: 6px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8f9fa; position: sticky; top: 0;">
                            <th style="padding: 10px; border-bottom: 1px solid #ddd; text-align: left;">Quantity</th>
                            <th style="padding: 10px; border-bottom: 1px solid #ddd; text-align: left;">Date</th>
                            <th style="padding: 10px; border-bottom: 1px solid #ddd; text-align: left;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(row => `
                            <tr>
                                <td style="padding: 8px 10px; border-bottom: 1px solid #eee;">${row.quantity}</td>
                                <td style="padding: 8px 10px; border-bottom: 1px solid #eee;">${row.date}</td>
                                <td style="padding: 8px 10px; border-bottom: 1px solid #eee;">$${row.price.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 20px;">
                <button id="fill-btn" style="
                    background: #34a853;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    margin-right: 10px;
                ">Fill Google Finance</button>
                <button id="back-btn" style="
                    background: #f1f3f4;
                    color: #333;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                ">Back to Edit</button>
            </div>
        `;

        document.getElementById('fill-btn').addEventListener('click', () => fillGoogleFinance(data));
        document.getElementById('back-btn').addEventListener('click', () => {
            container.innerHTML = '';
        });
    }

    // Find "More purchases" button intelligently
    function findMorePurchasesButton() {
        const spans = document.querySelectorAll('span[jsname="V67aGc"]');
        for (let span of spans) {
            if (span.innerText && span.innerText.toLowerCase().includes('more purchases')) {
                return span;
            }
        }
        return null;
    }

    // Fill Google Finance form
    async function fillGoogleFinance(data) {
        closeOverlay();

        if (data.length === 0) return;

        try {
            // Click "more purchases" button n-1 times
            for (let i = 0; i < data.length - 1; i++) {
                await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between clicks
                const moreButton = findMorePurchasesButton();
                if (moreButton) {
                    moreButton.click();
                    console.log(`Clicked "more purchases" button ${i + 1} times`);
                } else {
                    console.error('Could not find "more purchases" button');
                    alert('Could not find "more purchases" button. Please check if you\'re on the correct page.');
                    return;
                }
            }

            // Wait a bit more for all fields to be created
            await new Promise(resolve => setTimeout(resolve, 1000));

            // STEP 1: Fill Quantity and Date fields first (to bypass Google autofill for prices)
            console.log('Step 1: Filling Quantity and Date fields...');
            const quantityInputs = document.querySelectorAll("input[jsname='YPqjbf']");
            let currentIndex = 0; // Start from index 0 as corrected

            for (let i = 0; i < data.length; i++) {
                const row = data[i];

                // Quantity field
                const quantityField = quantityInputs[currentIndex];
                if (quantityField) {
                    quantityField.value = row.quantity.toString();
                    quantityField.dispatchEvent(new Event('input', { bubbles: true }));
                    quantityField.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    console.error(`Could not find quantity field at index ${currentIndex}`);
                }

                // Date field
                const dateField = quantityInputs[currentIndex + 1];
                if (dateField) {
                    dateField.value = row.date;
                    dateField.dispatchEvent(new Event('input', { bubbles: true }));
                    dateField.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    console.error(`Could not find date field at index ${currentIndex + 1}`);
                }

                console.log(`Step 1 - Row ${i + 1}: Quantity=${row.quantity}, Date=${row.date}`);

                // Move to next set of fields (each row uses 3 fields)
                currentIndex += 3;
            }

            // Wait for Google's autofill to complete
            console.log('Waiting for Google autofill to complete...');
            await new Promise(resolve => setTimeout(resolve, 1500));

            // STEP 2: Fill Price fields to overwrite Google's autofill
            console.log('Step 2: Filling Price fields to overwrite autofill...');
            const updatedQuantityInputs = document.querySelectorAll("input[jsname='YPqjbf']");
            currentIndex = 0; // Reset index

            for (let i = 0; i < data.length; i++) {
                const row = data[i];

                // Price field (skip quantity and date, go directly to price)
                const priceField = updatedQuantityInputs[currentIndex + 2];
                if (priceField) {
                    // Clear the field first
                    priceField.value = '';
                    priceField.dispatchEvent(new Event('input', { bubbles: true }));

                    // Wait a tiny bit and then set our price
                    await new Promise(resolve => setTimeout(resolve, 100));

                    priceField.value = row.price.toString();
                    priceField.dispatchEvent(new Event('input', { bubbles: true }));
                    priceField.dispatchEvent(new Event('change', { bubbles: true }));
                    priceField.dispatchEvent(new Event('blur', { bubbles: true }));
                } else {
                    console.error(`Could not find price field at index ${currentIndex + 2}`);
                }

                console.log(`Step 2 - Row ${i + 1}: Price=${row.price} (overwriting autofill)`);

                // Move to next set of fields
                currentIndex += 3;
            }

            //alert(`Successfully filled ${data.length} entries!`);

        } catch (error) {
            console.error('Error filling form:', error);
            alert('An error occurred while filling the form. Check the console for details.');
        }
    }

    // Close overlay
    function closeOverlay() {
        const overlay = document.getElementById('finance-filler-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Initialize the script
    function init() {
        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', monitorForModal);
        } else {
            monitorForModal();
        }

        // Also check immediately in case modal is already open
        setTimeout(createOverlayButton, 500);
    }

    init();
})();