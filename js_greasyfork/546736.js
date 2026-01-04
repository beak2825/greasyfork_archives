// ==UserScript==
// @name         Samples Check with Barcode Popup
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Adds a rapid barcode entry popup for AG Grid filters. With persistent button injection logic.
// @author       Gemini & You
// @match        *://his.kaauh.org/lab/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546736/Samples%20Check%20with%20Barcode%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/546736/Samples%20Check%20with%20Barcode%20Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const TARGET_SEARCH_PLACEHOLDER = 'Search by MRN / NationalId & IqamaId';
    const TARGET_BARCODE_COLUMN_HEADER = 'Barcode'; // <--- IMPORTANT: This should match the column title exactly.

    // --- Core Functions ---

    function clearAllFilters() {
        console.log("Clearing all filters.");
        const clearAndNotify = (inputElement) => {
            if (inputElement && inputElement.value !== '') {
                inputElement.value = '';
                const updateEvent = new Event('input', { bubbles: true });
                inputElement.dispatchEvent(updateEvent);
            }
        };
        const mainSearchInput = document.querySelector(`input[placeholder="${TARGET_SEARCH_PLACEHOLDER}"]`);
        clearAndNotify(mainSearchInput);
        const agGridFilters = document.querySelectorAll('input.ag-floating-filter-input');
        agGridFilters.forEach(clearAndNotify);
    }

    // --- Manual 'Delete' key listener ---
    document.addEventListener('keydown', (event) => {
        // Do not trigger if user is typing in the popup
        if (document.activeElement.id === 'barcode-popup-input') return;

        if (event.key === 'Delete') {
            console.log("Manual clear triggered by 'Delete' key.");
            clearAllFilters();
        }
    });


    // --- Barcode Popup Functionality ---

    function findBarcodeFilterInput() {
        // 1. Find the header cell containing the title "Barcode"
        const allTitleSpans = document.querySelectorAll('.ag-header-row[aria-rowindex="1"] .ag-header-cell-text');
        let titleHeaderCell = null;
        allTitleSpans.forEach(span => {
            if (span.textContent.trim() === TARGET_BARCODE_COLUMN_HEADER) {
                titleHeaderCell = span.closest('.ag-header-cell');
            }
        });

        if (!titleHeaderCell) {
            console.error(`Could not find a column header with the text: "${TARGET_BARCODE_COLUMN_HEADER}"`);
            return null;
        }

        // 2. Get the horizontal position (left style) of that header cell
        const targetLeftPosition = titleHeaderCell.style.left;
        if (!targetLeftPosition) {
            console.error('Found the barcode header, but it has no "left" style property to match with.');
            return null;
        }

        // 3. Find the corresponding filter cell in the second header row that has the same horizontal position
        const allFilterCells = document.querySelectorAll('.ag-header-row[aria-rowindex="2"] .ag-header-cell');
        let filterCell = null;
        allFilterCells.forEach(cell => {
            if (cell.style.left === targetLeftPosition) {
                filterCell = cell;
            }
        });

        if (!filterCell) {
            console.error(`Found barcode header at left=${targetLeftPosition}, but could not find a filter cell at the same position.`);
            return null;
        }

        // 4. Find the input field within that specific filter cell
        const filterInput = filterCell.querySelector('input.ag-floating-filter-input');
        if (!filterInput) {
            console.error('Found the correct filter cell, but no input field was inside it.');
            return null;
        }

        console.log(`Successfully found barcode filter input at left: ${targetLeftPosition}`);
        return filterInput;
    }


    function createBarcodePopup() {
        // Check if popup already exists and return it if it does
        let popupContainer = document.getElementById('barcode-popup-container');
        if (popupContainer) return popupContainer;

        popupContainer = document.createElement('div');
        popupContainer.id = 'barcode-popup-container';
        Object.assign(popupContainer.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'none',
            justifyContent: 'center', alignItems: 'center', zIndex: '10000'
        });

        const popupBox = document.createElement('div');
        Object.assign(popupBox.style, {
            background: '#fff', padding: '25px', borderRadius: '8px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)', textAlign: 'center',
            width: '350px'
        });

        const popupTitle = document.createElement('h3');
        popupTitle.textContent = 'Rapid Barcode Entry';
        Object.assign(popupTitle.style, { margin: '0 0 15px 0', color: '#333' });

        const popupInput = document.createElement('input');
        popupInput.id = 'barcode-popup-input';
        popupInput.type = 'text';
        popupInput.placeholder = 'Scan or type barcode and press Enter';
        Object.assign(popupInput.style, {
            width: '100%', padding: '10px', fontSize: '16px',
            border: '2px solid #ccc', borderRadius: '4px'
        });

        popupBox.appendChild(popupTitle);
        popupBox.appendChild(popupInput);
        popupContainer.appendChild(popupBox);
        document.body.appendChild(popupContainer);

        popupContainer.addEventListener('click', (e) => {
            if (e.target === popupContainer) {
                popupContainer.style.display = 'none';
            }
        });

        popupInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const barcodeValue = popupInput.value.trim();
                if (!barcodeValue) return;

                const barcodeFilterInput = findBarcodeFilterInput();

                if (barcodeFilterInput) {
                    barcodeFilterInput.value = barcodeValue;
                    barcodeFilterInput.dispatchEvent(new Event('input', { bubbles: true }));
                    popupInput.value = ''; // Clear for next scan
                } else {
                    console.error(`Critical Error: Could not find the barcode filter on the page. Make sure a column is named "${TARGET_BARCODE_COLUMN_HEADER}".`);
                    popupInput.style.borderColor = 'red';
                    setTimeout(() => { popupInput.style.borderColor = '#ccc'; }, 2000);
                }
            }
        });

        return popupContainer;
    }


    // --- UI Setup ---

    function addControls(container) {
        // Create the popup on first run, but don't show it.
        const popup = createBarcodePopup();

        // Add the Barcode Entry Button if it doesn't exist
        if (!document.getElementById('barcode-entry-btn')) {
            const barcodeButton = document.createElement('button');
            barcodeButton.id = 'barcode-entry-btn';
            barcodeButton.textContent = 'Barcode Entry';
            Object.assign(barcodeButton.style, {
                backgroundColor: '#5bc0de',
                transition: 'background-color 0.3s', padding: '6px 12px', fontSize: '13px',
                fontWeight: 'bold', borderRadius: '6px', color: '#ffffff',
                border: '1px solid #285e79', cursor: 'pointer', marginLeft: '8px'
            });

            barcodeButton.addEventListener('click', () => {
                popup.style.display = 'flex';
                document.getElementById('barcode-popup-input').focus();
            });
            container.appendChild(barcodeButton);
            console.log('Barcode Entry button added.');
        }
    }

    // --- Persistent Injection Logic ---
    function placeButton() {
        const buttonContainer = document.querySelector('.reset-button-container');
        if (buttonContainer) {
            addControls(buttonContainer);
        }
    }

    // Use a MutationObserver as the primary, efficient method.
    const observer = new MutationObserver(placeButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // *** NEW: Use a setInterval as a persistent backup ***
    // This will repeatedly check and ensure the button is present,
    // catching cases the observer might miss on complex web apps.
    setInterval(placeButton, 1000); // Check every 1 second

})();
