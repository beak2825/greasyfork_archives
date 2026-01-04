// ==UserScript==
// @name         LibGen Filter - English/Portuguese, PDF/TXT Only
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filter Library Genesis results to show only English/Portuguese books and PDF/TXT formats with 100 results per page
// @author       AppCreator
// @match        *://libgen.rs/*
// @match        *://libgen.is/*
// @match        *://libgen.st/*
// @match        *://libgen.li/*
// @match        *://libgen.lc/*
// @match        *://gen.lib.rus.ec/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536133/LibGen%20Filter%20-%20EnglishPortuguese%2C%20PDFTXT%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/536133/LibGen%20Filter%20-%20EnglishPortuguese%2C%20PDFTXT%20Only.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set results per page to 100 in the form
    const selectResPerPage = document.querySelector('select[name="res"]');
    if (selectResPerPage) {
        // Set to 100 results per page
        for (let option of selectResPerPage.options) {
            if (option.value === "100") {
                option.selected = true;
                break;
            }
        }
    }

    // Function to check if we're on a search results page
    function isSearchResultsPage() {
        return document.querySelector('table.c') !== null;
    }

    // Function to get the language of a row
    function getLanguageFromRow(row) {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 7) {
            const langCell = cells[6];
            return langCell.textContent.trim().toLowerCase();
        }
        return '';
    }

    // Function to get the file extension of a row
    function getExtensionFromRow(row) {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 9) {
            const extCell = cells[8];
            return extCell.textContent.trim().toLowerCase();
        }
        return '';
    }

    // Filter results if we're on a search results page
    if (isSearchResultsPage()) {
        const table = document.querySelector('table.c');
        const rows = table.querySelectorAll('tr');
        
        // Skip the header row
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const language = getLanguageFromRow(row);
            const extension = getExtensionFromRow(row);
            
            // Check if language is English or Portuguese
            const isValidLanguage = language.includes('english') || language.includes('portuguese');
            
            // Check if extension is PDF or TXT
            const isValidExtension = extension === 'pdf' || extension === 'txt';
            
            // Hide row if it doesn't match our criteria
            if (!isValidLanguage || !isValidExtension) {
                row.style.display = 'none';
            }
        }

        // Add a status message to show how many results are being displayed
        const visibleRows = Array.from(rows).slice(1).filter(row => row.style.display !== 'none');
        const statusDiv = document.createElement('div');
        statusDiv.style.padding = '10px';
        statusDiv.style.margin = '10px 0';
        statusDiv.style.backgroundColor = '#f0f0f0';
        statusDiv.style.border = '1px solid #ccc';
        statusDiv.style.borderRadius = '5px';
        statusDiv.innerHTML = `<strong>LibGen Filter:</strong> Showing ${visibleRows.length} results (English/Portuguese and PDF/TXT only)`;
        
        table.parentNode.insertBefore(statusDiv, table);
    }

    // Add button to apply filter after search
    const searchForm = document.querySelector('form[name="libgen"]');
    if (searchForm) {
        const filterButton = document.createElement('button');
        filterButton.type = 'button';
        filterButton.textContent = 'Apply English/Portuguese & PDF/TXT Filter';
        filterButton.style.marginLeft = '10px';
        filterButton.style.padding = '2px 8px';
        filterButton.style.backgroundColor = '#5D5CDE';
        filterButton.style.color = 'white';
        filterButton.style.border = 'none';
        filterButton.style.borderRadius = '3px';
        filterButton.style.cursor = 'pointer';
        
        filterButton.addEventListener('click', function() {
            // Ensure "res" parameter is set to 100
            let input = document.querySelector('input[name="res"]');
            if (!input) {
                input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'res';
                searchForm.appendChild(input);
            }
            input.value = '100';
            
            // Submit the form
            searchForm.submit();
        });
        
        const submitButton = searchForm.querySelector('input[type="submit"]');
        if (submitButton) {
            submitButton.parentNode.insertBefore(filterButton, submitButton.nextSibling);
        }
    }
})();