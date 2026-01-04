// ==UserScript==
// @name         LibGen Enhanced Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhance Library Genesis with more results per page and file extension filters
// @author       You
// @match        https://libgen.is/search.php*
// @match        http://libgen.is/search.php*
// @match        https://libgen.rs/search.php*
// @match        http://libgen.rs/search.php*
// @match        https://libgen.st/search.php*
// @match        http://libgen.st/search.php*
// @match        https://libgen.li/search.php*
// @match        http://libgen.li/search.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536131/LibGen%20Enhanced%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/536131/LibGen%20Enhanced%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .extension-filter {
            margin: 10px 0;
            padding: 5px;
            background-color: #f0f0f0;
            border-radius: 4px;
        }
        .extension-filter label {
            margin-right: 10px;
            cursor: pointer;
        }
        .extension-filter input {
            margin-right: 5px;
        }
        .filter-active {
            background-color: #e6f7ff;
            padding: 2px 5px;
            border-radius: 3px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    // Function to add "All" option to Results per page dropdown
    function enhanceResultsPerPage() {
        const resSelect = document.querySelector('select[name="res"]');
        if (!resSelect) return;

        // Add "All" option (9999 is a high enough number to show all results)
        const allOption = document.createElement('option');
        allOption.value = "9999";
        allOption.textContent = "All";
        resSelect.appendChild(allOption);

        // Set to All if coming from a previous search with the same setting
        if (new URLSearchParams(window.location.search).get('res') === '9999') {
            allOption.selected = true;
        }
    }

    // Function to add extension filter controls
    function addExtensionFilter() {
        // Find the location to insert the filters (after the view radio buttons)
        const viewRadios = document.querySelector('input[name="view"][value="simple"]');
        if (!viewRadios) return;
        
        // Create container for the new extension filter
        const container = document.createElement('div');
        container.className = 'extension-filter';
        container.innerHTML = `
            <b>File Extensions:</b>
            <label><input type="checkbox" name="ext_filter" value="pdf" id="ext_pdf"> PDF</label>
            <label><input type="checkbox" name="ext_filter" value="txt" id="ext_txt"> TXT</label>
            <label><input type="checkbox" name="ext_filter" value="all" id="ext_all" checked> All</label>
            <button id="apply_filter">Apply Filter</button>
        `;

        // Insert after view radios
        const parentRow = viewRadios.closest('tr');
        const parentCell = viewRadios.closest('td');
        parentCell.appendChild(container);

        // Handle checkbox logic
        const allCheckbox = container.querySelector('#ext_all');
        const pdfCheckbox = container.querySelector('#ext_pdf');
        const txtCheckbox = container.querySelector('#ext_txt');
        
        // When "All" is checked, uncheck others
        allCheckbox.addEventListener('change', function() {
            if (this.checked) {
                pdfCheckbox.checked = false;
                txtCheckbox.checked = false;
            } else if (!pdfCheckbox.checked && !txtCheckbox.checked) {
                // If nothing is selected, recheck "All"
                this.checked = true;
            }
        });

        // When either PDF or TXT are checked, uncheck "All"
        [pdfCheckbox, txtCheckbox].forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    allCheckbox.checked = false;
                } else if (!pdfCheckbox.checked && !txtCheckbox.checked) {
                    // If no specific extension is selected, check "All"
                    allCheckbox.checked = true;
                }
            });
        });

        // Apply extension filters when button is clicked
        document.getElementById('apply_filter').addEventListener('click', function() {
            filterByExtension();
        });

        // Check URL parameters for any existing filters
        const urlParams = new URLSearchParams(window.location.search);
        const extParam = urlParams.get('ext_filter');
        if (extParam) {
            if (extParam === 'pdf') {
                pdfCheckbox.checked = true;
                txtCheckbox.checked = false;
                allCheckbox.checked = false;
            } else if (extParam === 'txt') {
                txtCheckbox.checked = true;
                pdfCheckbox.checked = false;
                allCheckbox.checked = false;
            } else if (extParam === 'pdf,txt') {
                pdfCheckbox.checked = true;
                txtCheckbox.checked = true;
                allCheckbox.checked = false;
            }
            
            // Apply the filter immediately if specified in URL
            setTimeout(filterByExtension, 500);
        }
    }

    // Function to filter table rows by extension
    function filterByExtension() {
        const pdfChecked = document.getElementById('ext_pdf').checked;
        const txtChecked = document.getElementById('ext_txt').checked;
        const allChecked = document.getElementById('ext_all').checked;

        // If "All" is checked, don't filter
        if (allChecked) return;

        // Get all table rows with results
        const tableRows = document.querySelectorAll('table.c tr:not(:first-child)');
        
        // Extension filters
        let extensionsToShow = [];
        if (pdfChecked) extensionsToShow.push('pdf');
        if (txtChecked) extensionsToShow.push('txt');

        // Add active filter indicator
        let filterIndicator = document.querySelector('.filter-active');
        if (!filterIndicator) {
            filterIndicator = document.createElement('div');
            filterIndicator.className = 'filter-active';
            const searchForm = document.querySelector('form[name="libgen"]');
            if (searchForm) {
                searchForm.parentNode.insertBefore(filterIndicator, searchForm.nextSibling);
            }
        }
        filterIndicator.textContent = `Active Filter: ${extensionsToShow.join(', ')} files only`;

        // Hide rows that don't match the selected extensions
        let hiddenCount = 0;
        tableRows.forEach(row => {
            const extensionCell = row.querySelector('td:nth-child(9)'); // Extension column
            if (extensionCell) {
                const extension = extensionCell.textContent.trim().toLowerCase();
                if (extensionsToShow.includes(extension)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                    hiddenCount++;
                }
            }
        });

        // Update filter indicator with count
        filterIndicator.textContent += ` (${hiddenCount} items hidden)`;
    }

    // Apply enhancements
    enhanceResultsPerPage();
    addExtensionFilter();
})();