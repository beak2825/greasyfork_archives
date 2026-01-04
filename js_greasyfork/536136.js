// ==UserScript==
// @name         LibGen Filter - English/Portuguese, PDF/TXT Only (Fixed)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Filter Library Genesis results to show only English/Portuguese books and PDF/TXT formats with 100 results per page
// @author       AppCreator
// @match        *://libgen.rs/*
// @match        *://libgen.is/*
// @match        *://libgen.st/*
// @match        *://libgen.li/*
// @match        *://libgen.lc/*
// @match        *://gen.lib.rus.ec/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/536136/LibGen%20Filter%20-%20EnglishPortuguese%2C%20PDFTXT%20Only%20%28Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536136/LibGen%20Filter%20-%20EnglishPortuguese%2C%20PDFTXT%20Only%20%28Fixed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Add custom CSS
    const customCSS = `
        .libgen-filtered-row {
            background-color: #f0fff0 !important;
        }
        .libgen-filter-status {
            padding: 10px;
            margin: 10px 0;
            background-color: #e0e0ff;
            border: 1px solid #5D5CDE;
            border-radius: 5px;
            font-weight: bold;
        }
        .libgen-filter-button {
            margin: 10px 0;
            padding: 5px 10px;
            background-color: #5D5CDE;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        .libgen-filter-button:hover {
            background-color: #4a4ab8;
        }
    `;
    
    // Add CSS either with GM_addStyle or createElement
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(customCSS);
    } else {
        const styleElement = document.createElement('style');
        styleElement.textContent = customCSS;
        document.head.appendChild(styleElement);
    }
    
    // Function to log with timestamp
    function logDebug(message) {
        const timestamp = new Date().toISOString().substr(11, 8);
        console.log(`[LibGenFilter ${timestamp}] ${message}`);
    }
    
    logDebug('Script starting');
    
    // Wait for the DOM to be fully ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }
    
    function initializeScript() {
        logDebug('DOM ready, initializing script');
        
        // Set results per page to 100 in the form
        const selectResPerPage = document.querySelector('select[name="res"]');
        if (selectResPerPage) {
            for (let option of selectResPerPage.options) {
                if (option.value === "100") {
                    option.selected = true;
                    logDebug('Set results per page to 100');
                    break;
                }
            }
        }
        
        // Function to check if we're on a search results page
        function isSearchResultsPage() {
            return document.querySelector('table.c') !== null;
        }
        
        // Function to filter the results table
        function filterResults() {
            logDebug('Filtering results table...');
            
            // Find the results table
            const table = document.querySelector('table.c');
            if (!table) {
                logDebug('Results table not found');
                return;
            }
            
            const rows = table.querySelectorAll('tr');
            logDebug(`Found ${rows.length} rows (including header)`);
            
            let visibleCount = 0;
            let hiddenCount = 0;
            
            // Process each row (skip the header row)
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                
                try {
                    // Get all cells in this row
                    const cells = row.querySelectorAll('td');
                    
                    if (cells.length < 9) {
                        logDebug(`Row ${i} has only ${cells.length} cells, skipping`);
                        continue;
                    }
                    
                    // Language is in the 7th column (index 6)
                    const langText = cells[6].textContent.trim().toLowerCase();
                    
                    // Extension is in the 9th column (index 8)
                    const extText = cells[8].textContent.trim().toLowerCase();
                    
                    // Debug output
                    logDebug(`Row ${i}: Lang="${langText}", Ext="${extText}"`);
                    
                    // Check if language is English or Portuguese
                    const isEnglishOrPortuguese = (
                        langText === 'english' || 
                        langText === 'portuguese'
                    );
                    
                    // Check if extension is PDF or TXT (exactly)
                    const isPdfOrTxt = (
                        extText === 'pdf' || 
                        extText === 'txt'
                    );
                    
                    // Apply filter: must be (English OR Portuguese) AND (PDF OR TXT)
                    if (isEnglishOrPortuguese && isPdfOrTxt) {
                        // Show this row
                        row.style.display = '';
                        row.classList.add('libgen-filtered-row');
                        visibleCount++;
                        logDebug(`Row ${i}: SHOWING (matches criteria)`);
                    } else {
                        // Hide this row
                        row.style.display = 'none';
                        hiddenCount++;
                        logDebug(`Row ${i}: HIDING (does not match criteria)`);
                    }
                } catch (error) {
                    logDebug(`Error processing row ${i}: ${error.message}`);
                }
            }
            
            logDebug(`Filtering complete. Showing: ${visibleCount}, Hidden: ${hiddenCount}`);
            
            // Create or update status message
            let statusDiv = document.getElementById('libgen-filter-status');
            if (!statusDiv) {
                statusDiv = document.createElement('div');
                statusDiv.id = 'libgen-filter-status';
                statusDiv.className = 'libgen-filter-status';
                table.parentNode.insertBefore(statusDiv, table);
            }
            
            statusDiv.innerHTML = `
                LibGen Filter: Showing ${visibleCount} results (English/Portuguese and PDF/TXT only). 
                Hidden: ${hiddenCount} results. 
                <button id="libgen-show-all" style="margin-left:10px">Show All Results</button>
            `;
            
            // Add event listener to "Show All" button
            document.getElementById('libgen-show-all').addEventListener('click', function() {
                for (let i = 1; i < rows.length; i++) {
                    rows[i].style.display = '';
                }
                statusDiv.innerHTML = 'Showing all results. <button id="libgen-reapply-filter">Reapply Filter</button>';
                document.getElementById('libgen-reapply-filter').addEventListener('click', filterResults);
            });
        }
        
        // If we're on a search results page, filter the results
        if (isSearchResultsPage()) {
            logDebug('This is a search results page, applying filter');
            
            // Add "Filter Now" button
            const filterButton = document.createElement('button');
            filterButton.id = 'libgen-filter-button';
            filterButton.className = 'libgen-filter-button';
            filterButton.textContent = 'Filter Results (English/Portuguese & PDF/TXT only)';
            
            filterButton.addEventListener('click', filterResults);
            
            const table = document.querySelector('table.c');
            if (table) {
                table.parentNode.insertBefore(filterButton, table);
                
                // Apply filter automatically after a brief delay
                setTimeout(filterResults, 500);
            }
        }
        
        // Modify the search form
        const searchForm = document.querySelector('form[name="libgen"]');
        if (searchForm) {
            logDebug('Found search form, adding custom search button');
            
            const filterSearchButton = document.createElement('button');
            filterSearchButton.type = 'button';
            filterSearchButton.className = 'libgen-filter-button';
            filterSearchButton.textContent = 'Search with Filters';
            filterSearchButton.style.marginLeft = '10px';
            
            filterSearchButton.addEventListener('click', function() {
                // Set 100 results per page
                if (selectResPerPage) {
                    selectResPerPage.value = "100";
                }
                
                // Submit the form
                searchForm.submit();
            });
            
            const submitButton = searchForm.querySelector('input[type="submit"]');
            if (submitButton) {
                submitButton.parentNode.insertBefore(filterSearchButton, submitButton.nextSibling);
            }
        }
    }
})();