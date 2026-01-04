// ==UserScript==
// @name        MusicBrainz: Highlight identical barcodes and toggle merge checkboxes
// @namespace   https://musicbrainz.org/user/chaban
// @version     1.3
// @tag         ai-created
// @description Highlights sets of identical barcodes and toggles checkboxes for merging on click
// @author      chaban
// @license     MIT
// @match       *://*.musicbrainz.org/*/*/releases*
// @match       *://*.musicbrainz.org/release-group/*
// @match       *://*.musicbrainz.org/label/*
// @match       *://*.musicbrainz.org/*/*/*edits
// @match       *://*.musicbrainz.org/edit/*
// @match       *://*.musicbrainz.org/user/*/edits*
// @match       *://*.musicbrainz.org/search/edits*
// @icon        https://musicbrainz.org/static/images/favicons/android-chrome-512x512.png
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/536998/MusicBrainz%3A%20Highlight%20identical%20barcodes%20and%20toggle%20merge%20checkboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/536998/MusicBrainz%3A%20Highlight%20identical%20barcodes%20and%20toggle%20merge%20checkboxes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const identifierToColor = {};
    const identifierToCheckboxes = {};

    function getRandomColor() {
        const letters = '89ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    }

    function removeLeadingZeros(barcode) {
        return barcode.replace(/^0+/, '');
    }

    /**
     * Toggles the checkboxes for the entire group associated with the clicked barcode cell.
     * @param {Event} event The click event.
     */
    function toggleMergeCheckbox(event) {
        const clickedBarcodeCell = event.currentTarget;
        const clickedIdentifier = clickedBarcodeCell.dataset.barcodeIdentifier;

        if (!clickedIdentifier || !identifierToCheckboxes[clickedIdentifier]) {
            return;
        }

        const currentGroupCheckboxes = identifierToCheckboxes[clickedIdentifier];
        const shouldCheck = !currentGroupCheckboxes.some(cb => cb.checked);

        const allCheckboxesOnPage = document.querySelectorAll('input[name="add-to-merge"][type="checkbox"]');

        allCheckboxesOnPage.forEach(checkbox => {
            const row = checkbox.closest('tr');
            if (!row) return;

            const barcodeCellInThisRow = row.querySelector('.barcode-cell[data-barcode-identifier]');
            if (barcodeCellInThisRow && barcodeCellInThisRow.dataset.barcodeIdentifier === clickedIdentifier) {
                checkbox.checked = shouldCheck;
            } else {
                checkbox.checked = false;
            }
        });
    }

    /**
     * Processes a given table element to find and highlight identical barcodes.
     * @param {HTMLElement} table The table element to process.
     */
    function processTable(table) {
        const barcodeCellsInTable = {};
        let barcodeColumnIndex = -1;
        let formatColumnIndex = -1;

        let headerRow = table.querySelector('thead tr');
        if (!headerRow) {
            headerRow = table.querySelector('tr:has(th)');
        }
        if (!headerRow) {
            headerRow = table.querySelector('tbody tr');
        }

        if (headerRow) {
            const headerCells = Array.from(headerRow.children);
            headerCells.forEach((th, index) => {
                const headerText = th.textContent.trim();
                if (headerText === 'Barcode') {
                    barcodeColumnIndex = index;
                }
                if (headerText === 'Format') {
                    formatColumnIndex = index;
                }
            });
        }

        const dataRows = table.querySelectorAll('tbody tr, tr:not(:has(th)):not(:first-child)');

        dataRows.forEach(row => {
            let barcodeCell = null;
            let formatCell = null;

            if (barcodeColumnIndex !== -1 && row.children[barcodeColumnIndex]) {
                barcodeCell = row.children[barcodeColumnIndex];
            }
            if (formatColumnIndex !== -1 && row.children[formatColumnIndex]) {
                formatCell = row.children[formatColumnIndex];
            }

            if (!barcodeCell || barcodeCell.tagName === 'TH') {
                const potentialBarcodeCell = row.querySelector('.barcode-cell');
                if (potentialBarcodeCell && potentialBarcodeCell.tagName === 'TD') {
                    barcodeCell = potentialBarcodeCell;
                }
            }

            if (barcodeCell && barcodeCell.tagName === 'TD') {
                const barcode = barcodeCell.textContent.trim();
                const format = formatCell ? formatCell.textContent.trim() : '';

                const mergeCheckbox = row.querySelector('input[name="add-to-merge"][type="checkbox"]');

                if (barcode !== '[none]' && barcode !== '') {
                    const normalizedBarcode = removeLeadingZeros(barcode);
                    const identifier = `${normalizedBarcode}-${format}`;

                    barcodeCell.dataset.barcodeIdentifier = identifier;

                    if (!barcodeCellsInTable[identifier]) {
                        barcodeCellsInTable[identifier] = [];
                    }
                    barcodeCellsInTable[identifier].push(barcodeCell);

                    if (mergeCheckbox) {
                        if (!identifierToCheckboxes[identifier]) {
                            identifierToCheckboxes[identifier] = [];
                        }
                        identifierToCheckboxes[identifier].push(mergeCheckbox);
                    }
                }
            }
        });

        for (const identifier in barcodeCellsInTable) {
            if (barcodeCellsInTable[identifier].length > 1) {
                let color = identifierToColor[identifier];
                if (!color) {
                    color = getRandomColor();
                    identifierToColor[identifier] = color;
                }
                barcodeCellsInTable[identifier].forEach(cell => {
                    cell.style.backgroundColor = color;
                    cell.style.fontWeight = 'bold';
                    cell.style.padding = '2px 4px';
                    cell.style.borderRadius = '3px';

                    if (identifierToCheckboxes[identifier] && identifierToCheckboxes[identifier].length > 0) {
                        cell.style.cursor = 'pointer';
                        cell.addEventListener('click', toggleMergeCheckbox);
                    } else {
                        cell.style.cursor = 'auto';
                        cell.removeEventListener('click', toggleMergeCheckbox);
                    }
                });
            }
        }
    }

    function highlightBarcodesOnPage() {
        document.querySelectorAll('.mergeable-table, table.merge-releases').forEach(table => {
            processTable(table);
        });
    }
highlightBarcodesOnPage();
})();