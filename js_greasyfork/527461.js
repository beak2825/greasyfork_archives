// ==UserScript==
// @name         [WST] FusionEye DataTable Column Toggle Accordion
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Adds a Bootstrap accordion to toggle only the intended (contiguous) DataTable columns at each EDDH00 FusionEye Web.
// @author       aa2468291
// @match        http://10.38.250.180/search/*
// @match        http://10.38.248.180/search/*
// @match        http://10.38.250.184/search/*
// @match        http://10.48.161.130/search/*
// @match        http://10.38.247.180/search/*
// @match        http://10.121.186.180/search/*
// @grant        none
// @run-at       document-end
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/527461/%5BWST%5D%20FusionEye%20DataTable%20Column%20Toggle%20Accordion.user.js
// @updateURL https://update.greasyfork.org/scripts/527461/%5BWST%5D%20FusionEye%20DataTable%20Column%20Toggle%20Accordion.meta.js
// ==/UserScript==

(function(){
    'use strict';
    
    // Global state for column toggle visibility
    if (!window.columnToggleState) {
        window.columnToggleState = {};
    }
    
    // This variable will hold the number of toggleable columns
    window.intendedColumnsCount = 0;
    
    // Function to apply column visibility based on the global state
    function applyColumnVisibility() {
        var table = document.getElementById('search_table');
        if (!table) return;
        ['thead', 'tbody', 'tfoot'].forEach(function(sectionTag) {
            var section = table.querySelector(sectionTag);
            if (section) {
                var rows = section.rows;
                for (var r = 0; r < rows.length; r++) {
                    var cells = rows[r].cells;
                    // Only apply visibility to cells in the toggleable columns
                    for (var i = 0; i < Math.min(cells.length, window.intendedColumnsCount); i++) {
                        // Default to visible if state is not defined
                        var visible = (window.columnToggleState[i] === undefined) ? true : window.columnToggleState[i];
                        cells[i].style.display = visible ? '' : 'none';
                    }
                }
            }
        });
    }
    
    // Function to create the accordion for column toggle checkboxes
    function createAccordion() {
        // Avoid duplicate accordion
        if (document.getElementById('columnToggleAccordion')) return;
        
        var table = document.getElementById('search_table');
        if (!table) {
            console.error('Table with id "search_table" not found.');
            return;
        }
        
        // Get valid headers via DataTable API if available
        var validHeaders = [];
        if (window.jQuery && $.fn.DataTable && $('#search_table').DataTable()) {
            var dtInstance = $('#search_table').DataTable();
            var dtHeaders = dtInstance.columns().header();
            for (var i = 0; i < dtHeaders.length; i++) {
                validHeaders.push(dtHeaders[i]);
            }
        } else {
            // Fallback: use header cells from the DOM
            var headerRow = table.querySelector('thead tr');
            if (!headerRow) {
                console.error('Table header row not found.');
                return;
            }
            validHeaders = Array.from(headerRow.children);
        }
        
        // Filter headers: only include those with non-empty text (from .dt-column-title or innerText)
        var filteredHeaders = [];
        for (var i = 0; i < validHeaders.length; i++) {
            var th = validHeaders[i];
            var headerText = '';
            var colNameElement = th.querySelector('.dt-column-title');
            if (colNameElement) {
                headerText = colNameElement.textContent.trim();
            } else {
                headerText = th.textContent.trim();
            }
            if (headerText.length > 0) {  // Only add if there is text
                filteredHeaders.push(th);
            }
        }
        
        // Set the intended columns count based on the filtered headers
        window.intendedColumnsCount = filteredHeaders.length;
        
        // Initialize global state for each intended column if not defined
        for (var i = 0; i < window.intendedColumnsCount; i++) {
            if (window.columnToggleState[i] === undefined) {
                window.columnToggleState[i] = true;
            }
        }
        
        // Create accordion container element
        var accordion = document.createElement('div');
        accordion.className = 'accordion mb-3 w-100';
        accordion.id = 'columnToggleAccordion';
        accordion.style.width = '100%';
        accordion.style.display = 'block';
        
        // Create accordion item element
        var accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item';
        
        // Create accordion header with a toggle button
        var h2 = document.createElement('h2');
        h2.className = 'accordion-header';
        h2.id = 'headingToggle';
        var button = document.createElement('button');
        button.className = 'accordion-button collapsed';  // collapsed by default
        button.type = 'button';
        button.setAttribute('data-bs-toggle', 'collapse');
        button.setAttribute('data-bs-target', '#collapseToggle');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', 'collapseToggle');
        button.textContent = '✨隱藏/顯示欄位';
        // Adjust padding for a smaller button
        button.style.padding = '0.25rem 0.75rem';
        h2.appendChild(button);
        accordionItem.appendChild(h2);
        
        // Create collapsible content container for the accordion
        var collapseDiv = document.createElement('div');
        collapseDiv.id = 'collapseToggle';
        collapseDiv.className = 'accordion-collapse collapse';
        collapseDiv.setAttribute('aria-labelledby', 'headingToggle');
        
        // Create accordion body container
        var accordionBody = document.createElement('div');
        accordionBody.className = 'accordion-body p-2';
        var form = document.createElement('form');
        form.id = 'columnToggleForm';
        form.style.margin = '0';
        
        // Create checkboxes for each filtered header column
        for (var i = 0; i < filteredHeaders.length; i++) {
            var th = filteredHeaders[i];
            // Get column name from element with class "dt-column-title" if available, else from textContent
            var colName = '';
            var colNameElement = th.querySelector('.dt-column-title');
            if (colNameElement) {
                colName = colNameElement.textContent.trim();
            } else {
                colName = th.textContent.trim();
            }
            
            // Skip creating checkbox if for some reason colName is empty
            if (!colName) continue;
            
            var label = document.createElement('label');
            label.className = 'me-2';
            label.style.display = 'inline-block';
            label.style.marginBottom = '0.25rem';
            label.style.marginLeft = '0.4rem';
            
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = window.columnToggleState[i];
            checkbox.setAttribute('data-col-index', i);
            checkbox.style.marginRight = '0.25rem';
            
            // Add event listener to update global state and reapply column visibility
            checkbox.addEventListener('change', function() {
                var colIndex = parseInt(this.getAttribute('data-col-index'), 10);
                window.columnToggleState[colIndex] = this.checked;
                applyColumnVisibility();
            });
            
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(colName));
            form.appendChild(label);
        }
        
        accordionBody.appendChild(form);
        collapseDiv.appendChild(accordionBody);
        accordionItem.appendChild(collapseDiv);
        accordion.appendChild(accordionItem);
        
        // Insert the accordion above the table (or into the DataTables wrapper if available)
        var dtWrapper = table.closest('.dataTables_wrapper');
        if (dtWrapper) {
            dtWrapper.insertBefore(accordion, dtWrapper.firstChild);
        } else {
            table.parentNode.insertBefore(accordion, table);
        }
        
        // Apply the current column visibility state
        applyColumnVisibility();
    }
    
    // Function to wait for DataTables to load (extracted from the first腳本)
    function waitForDataTable(callback) {
        if (typeof $.fn.DataTable === 'undefined') {
            console.log("⌛ DataTables not loaded, waiting...");
            setTimeout(function() { waitForDataTable(callback); }, 500);
        } else {
            console.log("🚀 DataTables loaded, executing callback...");
            callback();
        }
    }
    
    // Wait for DataTables to be ready, then initialize accordion and column visibility
    waitForDataTable(function(){
        var dt = $('#search_table').DataTable();
        // On DataTable initialization
        dt.on('init.dt', function () {
            console.log("✅ DataTables initialized");
            setTimeout(function(){
                createAccordion();
                applyColumnVisibility();
            }, 500);
        });
        // On DataTable redraw (e.g., when changing pages)
        dt.on('draw.dt', function () {
            console.log("🔄 DataTables redrawn");
            setTimeout(function(){
                createAccordion();
                applyColumnVisibility();
            }, 300);
        });
        // Initial call in case the events have already fired
        setTimeout(function(){
            createAccordion();
            applyColumnVisibility();
        }, 1000);
    });
})();
