// ==UserScript==
// @name         Auto Download Excel Files
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Automatically download all Excel files in ranges
// @author       srana
// @match        *://orbis-r1-bvdinfo-com.sussex.idm.oclc.org/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/521012/Auto%20Download%20Excel%20Files.user.js
// @updateURL https://update.greasyfork.org/scripts/521012/Auto%20Download%20Excel%20Files.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const totalDocuments = 209890; // Total document count
    const increment = 2000; // Number of documents per range
    let currentStart = 1; // Starting point for the range

    // Function to wait for an element to appear in the DOM
    function waitForElement(selector, callback) {
        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                callback(element);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Function to set the range in input fields
    function setRange(start, end) {
        console.log(`Setting range: ${start} to ${end}`);

        const fromInput = document.querySelector('input[name="component.From"]');
        const toInput = document.querySelector('input[name="component.To"]');

        if (fromInput && toInput) {
            fromInput.value = start;
            toInput.value = end;

            // Trigger input events to simulate user interaction
            fromInput.dispatchEvent(new Event('input'));
            toInput.dispatchEvent(new Event('input'));

            console.log(`Range set: From ${start}, To ${end}`);
            return true;
        } else {
            console.error('Range input fields not found!');
            return false;
        }
    }

    // Function to click the "Export" button
    function clickExportButton() {
        const exportButton = document.querySelector('a.button.submit.ok');

        if (exportButton) {
            console.log('Clicking the Export button...');
            exportButton.click();
        } else {
            console.error('Export button not found!');
        }
    }

    // Function to close the popup
    function closePopup() {
        const closeBtn = document.querySelector('.close.px16');
        if (closeBtn) {
            console.log('Closing the popup...');
            closeBtn.click();
        } else {
            console.error('Close button not found!');
        }
    }

    // Function to process the current range
    async function processCurrentRange() {
        const end = Math.min(currentStart + increment - 1, totalDocuments);

        // Set the range and trigger export
        if (setRange(currentStart, end)) {
            clickExportButton();

            // Wait for the download popup to process
            console.log('Waiting for download popup...');
            await new Promise(resolve => setTimeout(resolve, 5000)); // Adjust delay as needed

            // Close the popup after the export starts
            closePopup();

            // Wait before starting the next iteration
            console.log('Waiting 5 seconds before next iteration...');
            await new Promise(resolve => setTimeout(resolve, 5000)); // Adjust delay as needed

            currentStart += increment;

            // Continue processing the next range if within total documents
            if (currentStart <= totalDocuments) {
                startNextIteration();
            } else {
                console.log('All ranges processed!');
            }
        } else {
            console.error(`Failed to set range for ${currentStart} to ${end}. Skipping...`);
        }
    }

    // Function to start the next iteration
    function startNextIteration() {
        console.log(`Starting next iteration: ${currentStart} to ${Math.min(currentStart + increment - 1, totalDocuments)}`);

        // Click the Excel button to reopen the popup
        const excelButton = document.querySelector('[data-format="ExcelDisplay2007"]');
        if (excelButton) {
            excelButton.click();

            // Wait for the dropdown to appear and select the range
            waitForElement('#component_RangeOptionSelectedId', rangeSelector => {
                rangeSelector.value = 'Range';
                rangeSelector.dispatchEvent(new Event('change'));
                console.log('Range option selected in dropdown.');

                // Process the current range
                processCurrentRange();
            });
        } else {
            console.error('Excel export button not found!');
        }
    }

    // Main function to start the automation
    function startAutomation() {
        console.log('Starting automation...');

        // Click the initial Excel button to open the popup
        const excelButton = document.querySelector('[data-format="ExcelDisplay2007"]');
        if (excelButton) {
            excelButton.click();
            console.log('Excel export button clicked.');

            // Wait for the dropdown to appear and select the range
            waitForElement('#component_RangeOptionSelectedId', rangeSelector => {
                rangeSelector.value = 'Range';
                rangeSelector.dispatchEvent(new Event('change'));
                console.log('Range option selected in dropdown.');

                // Start processing the first range
                processCurrentRange();
            });
        } else {
            console.error('Excel export button not found!');
        }
    }

    // Wait for the page to load completely, then start automation
    window.addEventListener('load', () => {
        waitForElement('[data-format="ExcelDisplay2007"]', startAutomation);
    });
})();
