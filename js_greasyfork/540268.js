// ==UserScript==
// @name         Unified Lab Assistant (Enhanced Grid & Auto-Verify)
// @version      17.0
// @description  Merges "Enhanced AG Grid" and "Conditional Auto & Manual VERIFY2" functionalities. Adds a unified summary table, auto-verification, improved UI styling, and QoL features, including a more robust MRN display, all optimized for performance in a Single-Page Application (SPA) environment.
// @match        https://his.kaauh.org/lab/*
// @author       Hamad AlShegifi
// @grant        GM_addStyle
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/540268/Unified%20Lab%20Assistant%20%28Enhanced%20Grid%20%20Auto-Verify%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540268/Unified%20Lab%20Assistant%20%28Enhanced%20Grid%20%20Auto-Verify%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Create a global namespace for inter-IIFE communication
    window.enhancedGrid = window.enhancedGrid || {};
 
    // --- Global Constants ---
    const GRID_WIDTH = '54vw';
    const RESIZED_FLAG = 'data-ag-resized';
    const INTERVAL = 300; // Main update interval
    const CLICKED_ROW_EXPIRY_PREFIX = 'clicked_row_expiry_';
    const CLICK_DURATION_MS = 60 * 1000;
 
    // --- Utility Functions ---
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
 
    // --- MRN Collection & Display Functions (Corrected for Female Patient Layout) ---
    function extractMrnsFromContainer(profileContainer) {
        const mrns = {};
 
        // Case 1: First, check for the highly specific "Baby/Mother" layout with a '.mid2' container.
        const mid2Container = profileContainer.querySelector('.mid2');
        if (mid2Container) {
            const primaryMrnEl = mid2Container.querySelector('span.content[placement="left"]');
            const secondaryMrnEl = mid2Container.querySelector('span.content[placement="right"]');
            if (primaryMrnEl && secondaryMrnEl) {
                const babyMrn = primaryMrnEl.textContent.trim();
                const motherMrn = secondaryMrnEl.textContent.replace(/[\/ ]/g, '').trim();
                return ` Baby's MRN: ${babyMrn} |  Mother's MRN: ${motherMrn}`;
            }
        }
 
        // Case 2: If not the above, use a general approach for all other patient types.
        // It looks for any '.mid' div inside the profile and checks if it contains an MRN.
        const midDivs = profileContainer.querySelectorAll('.mid');
        midDivs.forEach(div => {
            const labelEl = div.querySelector('h6');
            const valueEl = div.querySelector('span');
 
            if (labelEl && valueEl) {
                const label = labelEl.textContent.trim().toUpperCase();
                const value = valueEl.textContent.trim();
 
                if (label.includes('MRN')) {
                    // This handles C.MRN, H.MRN, B.MRN etc.
                    // We only assign the patient MRN once to avoid duplicates.
                    if (!mrns.patient && value) {
                        mrns.patient = value;
                    }
 
                    // Specifically look for Mother's MRN (M.MRN)
                    if (label.includes('M.MRN') && value) {
                        mrns.mother = value;
                    }
                }
            }
        });
 
        // Assemble the final display string based on what was found
        if (mrns.patient && mrns.mother) {
            return `Baby'MRN : ${mrns.patient} | Mother's MRN: ${mrns.mother}`;
        }
        if (mrns.patient) {
            return `MRN: ${mrns.patient}`;
        }
 
        return null; // Return null if no MRN was found
    }
 
    function displayMrn() {
        const box = document.getElementById('barcode-display-box');
        if (!box) {
            return; // Exit if the barcode box isn't on the page
        }
 
        const profileContainer = document.querySelector('.patient-profile');
        if (!profileContainer) {
            return; // Exit if the profile banner isn't loaded yet
        }
 
        const mrnString = extractMrnsFromContainer(profileContainer);
        let mrnElement = document.getElementById('mrn-display');
 
        if (mrnString) {
            if (!mrnElement) {
                mrnElement = document.createElement('div');
                mrnElement.id = 'mrn-display';
                box.appendChild(mrnElement);
            }
            if (mrnElement.textContent !== mrnString) {
                mrnElement.textContent = mrnString;
            }
        } else if (mrnElement) {
            mrnElement.remove(); // Clean up if no MRN is found but the element exists
        }
    }
 
 
    // --- Inject CSS Styles ---
    GM_addStyle(`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
        /* --- General Layout & Resizing --- */
        .results .ag-theme-balham, .accd-details, .accd-details-table-static, .card-header {
            width: ${GRID_WIDTH} !important; margin-left: auto !important; margin-right: 0 !important; box-sizing: border-box;
        }
        .accd-details table, .accd-details-table-static table {
            width: 100% !important; table-layout: fixed !important; border-collapse: collapse !important;
        }
        .accd-details table th, .accd-details table td, .accd-details-table-static table th, .accd-details-table-static table td {
            padding: 8px !important; word-wrap: break-word !important;
        }
        .results .ag-theme-balham { height: auto; }
        /* --- AG-Grid Row and Cell Styles --- */
        .ag-row { transition: background-color 0.3s ease; }
        .ag-row.clicked-row-green .ag-cell { background-color: #A0ECA0 !important; }
        /* --- MRN Display Style --- */
        #mrn-display {
            font-size: 20px; font-weight: bold; color: #ffffff; background-color: #000000;
            padding: 4px 8px; border-radius: 4px; margin-left: 10px;
        }
    `);
 
    // --- AG-Grid Column Definitions ---
    const columnsToUncheck = [
        'Lab Order No', 'Hospital MRN', 'DOB', 'Test ID', 'National/Iqama Id', 'Department',
        'Doctor', 'Analyzer', 'Reference Lab', 'Accession No', 'Sequence No', 'Age',
        'Container Type', 'Storage Condition'
    ];
    let hasRunOnce = false;
 
    // --- AG-Grid Row Highlight Logic ---
    function handleRowClickForPersistentGreen(event) {
        const cellElement = event.target.closest('.ag-cell');
        if (!cellElement) return;
        const rowElement = cellElement.closest('.ag-row[role="row"]');
        if (!rowElement) return;
        const barcodeCell = rowElement.querySelector('div[col-id="barcode"]');
        if (!barcodeCell || !barcodeCell.textContent) return;
        const barcode = barcodeCell.textContent.trim();
        if (!barcode) return;
        const expiryTimestamp = Date.now() + CLICK_DURATION_MS;
        try {
            localStorage.setItem(CLICKED_ROW_EXPIRY_PREFIX + barcode, expiryTimestamp.toString());
        } catch (e) {
            console.error("Error saving to localStorage:", e);
        }
        applyPersistentRowStyles();
    }
 
    function applyPersistentRowStyles() {
        const rows = document.querySelectorAll('.ag-center-cols-container div[role="row"], .ag-pinned-left-cols-container div[role="row"], .ag-pinned-right-cols-container div[role="row"]');
        const now = Date.now();
        rows.forEach(row => {
            const barcodeCell = row.querySelector('div[col-id="barcode"]');
            let rowBarcode = barcodeCell?.textContent?.trim();
            if (rowBarcode) {
                const expiryKey = CLICKED_ROW_EXPIRY_PREFIX + rowBarcode;
                const expiryTimestampStr = localStorage.getItem(expiryKey);
                if (expiryTimestampStr) {
                    if (now < parseInt(expiryTimestampStr, 10)) row.classList.add('clicked-row-green');
                    else {
                        localStorage.removeItem(expiryKey);
                        row.classList.remove('clicked-row-green');
                    }
                } else row.classList.remove('clicked-row-green');
            } else row.classList.remove('clicked-row-green');
        });
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith(CLICKED_ROW_EXPIRY_PREFIX)) {
                    if (now >= parseInt(localStorage.getItem(key), 10)) localStorage.removeItem(key);
                }
            }
        } catch (e) {
            console.error("Error during localStorage cleanup:", e);
        }
    }
 
    function setupPersistentRowStylesListener() {
        const gridRoot = document.querySelector('.ag-root-wrapper');
        const listenerTarget = gridRoot || document.querySelector('.ag-body-viewport') || document.body;
        if (listenerTarget && !listenerTarget.dataset.persistentClickListenerAttached) {
            listenerTarget.addEventListener('click', handleRowClickForPersistentGreen, true);
            listenerTarget.dataset.persistentClickListenerAttached = 'true';
        }
    }
 
    // --- AG-Grid Column Visibility Logic ---
    function isSpecificPageForColumns() {
        return window.location.href.endsWith('/#/lab-orders/lab-test-analyzer');
    }
 
    function areColumnsChecked() {
        return columnsToUncheck.some(column => isColumnChecked(column));
    }
 
    function isColumnChecked(labelText) {
        for (const label of document.querySelectorAll('.ag-column-tool-panel-column-label')) {
            if (label.textContent.trim() === labelText && label.parentElement.querySelector('.ag-icon-checkbox-checked')) return true;
        }
        return false;
    }
 
    function ensureColumnsUnchecked() {
        if (hasRunOnce || !isSpecificPageForColumns() || !areColumnsChecked()) return;
        hasRunOnce = true;
        setTimeout(() => columnsToUncheck.forEach(clickColumnLabel), 1000);
    }
 
    function ensureOtherColumnsChecked() {
        if (!isSpecificPageForColumns()) return;
        document.querySelectorAll('.ag-column-tool-panel-column-label').forEach(label => {
            if (!columnsToUncheck.includes(label.textContent.trim()) && label.parentElement.querySelector('.ag-icon-checkbox-unchecked')) label.click();
        });
    }
 
    function clickColumnLabel(labelText) {
        if (!isSpecificPageForColumns()) return;
        document.querySelectorAll('.ag-column-tool-panel-column-label').forEach(label => {
            if (label.textContent.trim() === labelText && label.parentElement.querySelector('.ag-icon-checkbox-checked')) label.click();
        });
    }
 
    function initColumnToggle() {
        if (!isSpecificPageForColumns()) return;
        let attempts = 0;
        const interval = setInterval(() => {
            if (document.querySelector('.ag-side-buttons') || ++attempts > 10) {
                if (document.querySelector('.ag-side-buttons')) {
                    ensureColumnsUnchecked();
                    ensureOtherColumnsChecked();
                }
                clearInterval(interval);
            }
        }, 500);
    }
 
    // --- Layout and Main Update Orchestration ---
    const performLayoutAdjustments = () => {
        const actionButtonContainer = document.querySelector('div.lo-act-btn');
        if (actionButtonContainer && actionButtonContainer.parentElement) {
            actionButtonContainer.parentElement.removeAttribute('style');
        }
 
        document.querySelectorAll('ag-grid-angular').forEach(grid => {
            if (grid.getAttribute(RESIZED_FLAG)) return;
            const api = grid.agGrid?.api || grid.__agGridComp?.api;
            if (api && typeof api.sizeColumnsToFit === 'function') {
                grid.style.width = GRID_WIDTH;
                grid.style.marginLeft = 'auto';
                grid.style.marginRight = '0';
                api.sizeColumnsToFit();
                grid.setAttribute(RESIZED_FLAG, 'true');
            }
        });
        document.querySelectorAll('div.accd-details-table-static.test-open, .card-header').forEach(el => {
            el.style.width = GRID_WIDTH;
            el.style.marginLeft = 'auto';
            el.style.marginRight = '0';
        });
        document.querySelectorAll('h6[translateid="test-results.Results"]').forEach(el => el.remove());
    };
 
    const fullPageUpdate = debounce(() => {
        performLayoutAdjustments();
        applyPersistentRowStyles();
        setupPersistentRowStylesListener();
        displayMrn(); // Continuously try to display the MRN
        if (window.enhancedGrid && typeof window.enhancedGrid.triggerSummaryUpdate === 'function') {
            window.enhancedGrid.triggerSummaryUpdate();
        }
        if (isSpecificPageForColumns()) {
            hasRunOnce = false;
            initColumnToggle();
        }
    }, 100);
 
 
    // --- Feature: Barcode Display Box ---
    (function() {
        const BARCODE_KEY = 'selectedBarcode';
        let currentUrl = location.href;
 
        function loadJsBarcode(callback) {
            if (window.JsBarcode) {
                callback();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js';
            script.onload = callback;
            document.head.appendChild(script);
        }
 
        function insertBarcodeBox(barcode) {
            let insertionTarget = document.querySelector('.btn-area.stickey-btnset') || document.querySelector('.test-open.mt-2');
            if (!barcode || !insertionTarget || document.getElementById('barcode-display-box')) return;
            const box = document.createElement('div');
            box.id = 'barcode-display-box';
            box.style.cssText = 'padding:8px 12px;background:#f7f7f7;border-radius:8px;display:flex;align-items:center;gap:10px;border:1px solid #ccc;';
            const label = document.createElement('div');
            label.textContent = 'Sample Barcode:';
            label.style.cssText = 'font-weight:bold;font-size:14px;color:#333;';
            const text = document.createElement('div');
            text.textContent = barcode;
            text.style.cssText = 'font-size: 20px; color: #444; font-weight: bold;';
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.id = "barcode-svg";
            svg.style.cssText = 'height:40px;width:120px;border:1px solid #ccc;border-radius:4px;padding:2px;';
            box.append(label, text, svg);
            insertionTarget.insertAdjacentElement('afterend', box);
            try {
                const buttonBarStyles = window.getComputedStyle(insertionTarget);
                if (buttonBarStyles.position === 'sticky' || buttonBarStyles.position === 'fixed') {
                    const buttonBarHeight = insertionTarget.offsetHeight;
                    const buttonBarTop = parseInt(buttonBarStyles.top, 10) || 0;
                    const desiredTopForBarcode = buttonBarTop + buttonBarHeight + 5;
                    Object.assign(box.style, {
                        position: 'sticky',
                        top: `${desiredTopForBarcode}px`,
                        zIndex: '99',
                        boxShadow: '0 3px 5px rgba(0,0,0,0.08)',
                    });
                } else box.style.marginTop = '10px';
            } catch (e) {
                console.error("Enhanced AG Grid: Error applying sticky style to barcode box.", e);
                box.style.marginTop = '10px';
            }
            loadJsBarcode(() => {
                try {
                    JsBarcode(svg, barcode, {
                        format: "CODE128",
                        displayValue: false,
                        height: 40,
                        width: 2,
                        margin: 0
                    });
                } catch (err) {
                    console.warn('Barcode render error:', err);
                    svg.outerHTML = "<span>Invalid Barcode</span>";
                }
            });
            // Attempt to display MRN immediately after box creation
            displayMrn();
        }
 
        function watchGridClicksForBarcodeBox() {
            document.body.addEventListener('click', e => {
                const cell = e.target.closest('.ag-row')?.querySelector('[col-id="barcode"]');
                if (cell?.textContent.trim()) localStorage.setItem(BARCODE_KEY, cell.textContent.trim());
            });
        }
 
        function waitAndShowBarcode() {
            const barcode = localStorage.getItem(BARCODE_KEY);
            const urlPattern = /\/0\/.*\/undefined$/;
            if (!barcode || !urlPattern.test(location.href)) return;
            const interval = setInterval(() => {
                const ready = document.querySelector('.btn-area.stickey-btnset') || document.querySelector('.test-open.mt-2');
                if (ready) {
                    clearInterval(interval);
                    insertBarcodeBox(barcode);
                }
            }, 300);
        }
 
        function observeSPA() {
            const bodyObserver = new MutationObserver(() => {
                if (location.href !== currentUrl) {
                    currentUrl = location.href;
                    waitAndShowBarcode();
                }
            });
            bodyObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        watchGridClicksForBarcodeBox();
        observeSPA();
        waitAndShowBarcode();
    })();
 
 
    // --- Feature: Dropdown Pagination ---
    (function() {
        const setDropdownValue = () => {
            const dropdown = document.getElementById("dropdownPaginationPageSize");
            if (dropdown && dropdown.value !== "100") {
                dropdown.value = "100";
                dropdown.dispatchEvent(new Event('change', {
                    bubbles: true
                }));
            }
        };
        new MutationObserver(setDropdownValue).observe(document.body, {
            childList: true,
            subtree: true
        });
        window.addEventListener('load', setDropdownValue);
    })();
 
 
    // --- Feature: Unified Test Summary Table ---
    (function() {
        GM_addStyle(`
            #test-summary-container {
                width: 40%; float: left; margin: 25px 10px 10px 0;
                background-color: #fff; border: 1px solid #ddd; border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08); display: flex; flex-direction: column;
            }
           .card-body::after { content: ""; display: table; clear: both; }
            #test-summary-container .summary-content { padding: 0; position: relative; flex-grow: 1; }
            .summary-header {
                font-weight: 500; font-size: 12px; padding: 8px 10px;
                border-bottom: 1px solid #e0e0e0; display: flex; align-items: center; gap: 10px;
                color: #000000; cursor: pointer; user-select: none; flex-shrink: 0;
            }
            .summary-header > span {
               flex-grow: 1;
            }
            .summary-status-icon {
                margin-left: auto;
                margin-right: 5px;
                font-size: 1.2em;
            }
            .summary-header i.vicon.fa-check-circle { color: #28a745; }
            .summary-header i.vicon.fa-star { color: #6c757d; }
            .summary-header i.vicon.fa-arrow-circle-up.ord { color: #17a2b8; }
            .summary-header i.vicon.fa-arrow-circle-up:not(.ord) { color: #007bff; }
 
            .collapse-icon {
                transition: color 0.2s ease-in-out;
                color: #28a745;
            }
            .collapse-icon.collapsed {
                color: #dc3545;
            }
            .no-tests { padding: 20px; color: #6c757d; text-align: center; }
            .hidden-note { color: #dc3545; font-style: italic; }
            .test-list-container { display: contents; }
            .hidden-note-container { display: none; }
            #test-summary-container .summary-content.collapsed { display: none; }
            #test-summary-container .summary-content.collapsed .test-list-container { display: none; }
            #test-summary-container .summary-content.collapsed .hidden-note-container { display: block; }
            .summary-grid-container {
                display: grid;
                grid-template-columns: 1fr minmax(80px, auto) min-content minmax(80px, auto) min-content;
                align-items: start;
            }
            .summary-grid-header { display: contents; font-weight: bold; }
            .summary-grid-header > div {
                background-color: #f0f0f0; padding: 6px 15px; border-bottom: 1px solid #e0e0e0;
                white-space: nowrap; color: #555; font-size: 12px;
                position: sticky; top: 0; z-index: 1;
            }
            .summary-grid-header > div.test-name-header { text-align: left; }
            .summary-grid-header > div.test-value-header { text-align: right; }
            .summary-grid-header > div.range-header { text-align: left; }
            .summary-grid-header > div.uom-header { text-align: left; }
            .summary-grid-header > div.flag-header { text-align: center; }
            .test-item { display: contents; }
            .grid-cell {
                padding: 0px 15px; border-bottom: 1px solid #c4c2c2; font-size: 13px;
                display: flex; align-items: center; min-height: 28px;
                overflow: hidden; text-overflow: ellipsis;
            }
            .test-item:last-of-type > .grid-cell { border-bottom: none; }
            .grid-cell.test-details { gap: 8px; }
            .grid-cell.pending-value { justify-content: right; color: #999; }
            .test-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .test-icon { color: #28a745; }
            .test-bullet { color: #0056b3; }
            .test-value {
                font-weight: bold; color: #000000; border-radius: 0px;
                font-size: 16px; text-align: right; padding: 2px 4px;
                justify-content: flex-end; width: 100%;
            }
            .test-value.highlight-H { background-color: #ffe0e0 !important; }
            .test-value.highlight-L { background-color: #e0f2f7 !important; }
            .test-uom { font-size: 12px; color: #555; }
            .grid-cell.flag-cell { justify-content: center; }
            .flag {
                font-weight: bold; border-radius: 50%; width: 16px; height: 16px;
                display: inline-flex; align-items: center; justify-content: center;
                font-size: 11px; color: white; flex-shrink: 0;
            }
            .flag-placeholder { width: 16px; height: 16px; visibility: hidden; flex-shrink: 0; }
            .flag-H { background-color: #d32f2f !important; }
            .flag-L { background-color: #1976d2 !important; }
            .summary-footer {
                display: flex; justify-content: space-between; align-items: center; background: #f8f9fa;
                border-top: 1px solid #e0e0e0; padding: 10px 15px; font-size: 12px; color: #6c757d;
                flex-shrink: 0;
            }
        `);
 
        const CONFIG = {
            COLUMN_PATTERNS: {
                TEST_DESC: ['testdesc', 'testdescription', 'name'],
                STATUS: ['resultstatus', 'teststatus', 'status', 'state'],
                RESULT_VALUE: ['testresult'],
                UOM: ['uom', 'uomvalue'],
                REFERENCE_RANGE: ['referencerange', 'range']
            },
            STATUS_PROPERTIES: {
                resulted: {
                    color: '#ffca77',
                    className: 'fa fa-check-circle vicon'
                },
                ordered: {
                    color: '#E0E0E0',
                    className: 'fa fa-star vicon'
                },
                verifiedlevel1: {
                    color: '#90EE90',
                    className: 'fa fa-arrow-circle-up ord vicon'
                },
                verifiedlevel2: {
                    color: '#28a745',
                    className: 'fa fa-arrow-circle-up vicon'
                },
                default: {
                    color: '#E0E0E0',
                    className: null
                }
            }
        };
        const collapseState = {};
 
        const testSortOrder = [
            'sodium (na)', 'potassium', 'chloride', 'urea (bun)', 'creatinine', 'calcium',
            'phosphate (phos)', 'magnesium (mg)', 'alkaline phosphatase (alpi)',
            'Alanine Amino Transferase (ALTI)', 'Aspartate Amino Transferase(AST)',
            'total protein (tp)', 'albumin (alb)', 'Bilirubin - Total (TBIL)',
            'Bilirubin - Direct (DBIL)', 'cholesterol', 'triglycerides',
            'high density lipoprotein - hdl', 'low density lipoprotein - ldl',
            'creatine kinase (ck)', 'lactate dehydrogenase (ldh)', 'troponin -i (ctn-1)',
            'haemoglobin a1c (hba1c)', 'tsh (thyroid stimulating hormone)-tft', 'uric acid',
            'mid stream urine'
        ];
 
        function getSortIndex(testName) {
            const lowerTestName = testName.toLowerCase();
            const index = testSortOrder.findIndex(sortedName => lowerTestName.includes(sortedName.toLowerCase()));
            return index === -1 ? Infinity : index;
        }
 
        const findCellByPatterns = (row, patterns) => {
            for (const cell of row.querySelectorAll('[col-id]')) {
                const colId = cell.getAttribute('col-id')?.toLowerCase();
                if (colId && patterns.includes(colId)) return cell;
            }
            return null;
        };
        const parseRangeAndCompare = (rangeStr, value) => {
            if (!rangeStr || value === null || isNaN(parseFloat(value))) return null;
            const numVal = parseFloat(value);
            const stdRange = rangeStr.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
            if (stdRange) {
                const lower = parseFloat(stdRange[1]);
                const upper = parseFloat(stdRange[2]);
                if (numVal < lower) return 'L';
                if (numVal > upper) return 'H';
            }
            const ltRange = rangeStr.match(/(?:<|Less than)\s*(\d+\.?\d*)/i);
            if (ltRange) {
                if (numVal >= parseFloat(ltRange[1])) return 'H';
            }
            const gtRange = rangeStr.match(/(?:>|Greater than)\s*(\d+\.?\d*)/i);
            if (gtRange) {
                if (numVal <= parseFloat(gtRange[1])) return 'L';
            }
            return null;
        };
        const capitalize = (s) => {
            if (typeof s !== 'string' || s.length === 0) return '';
            const spaced = s.replace(/([A-Z])|([0-9]+)/g, ' $1$2').trim();
            return spaced.charAt(0).toUpperCase() + spaced.slice(1);
        };
        const getNormalizedStatusKey = (status) => {
            const normalized = status.toLowerCase().replace(/\s+/g, '');
            if (normalized.includes('verified') && normalized.includes('1')) return 'verifiedlevel1';
            if (normalized.includes('verified') && normalized.includes('2')) return 'verifiedlevel2';
            if (normalized === 'resulted') return 'resulted';
            if (normalized === 'ordered') return 'ordered';
            return 'default';
        };
 
        function getAllTests() {
            const testsByStatus = {};
            const leftRows = document.querySelectorAll('.ag-pinned-left-cols-container .ag-row');
            const centerRows = document.querySelectorAll('.ag-center-cols-container .ag-row');
            const rightRows = document.querySelectorAll('.ag-pinned-right-cols-container .ag-row');
            const combinedRows = [];
            for (let i = 0; i < centerRows.length; i++) {
                const combined = document.createElement('div');
                [leftRows[i], centerRows[i], rightRows[i]].forEach(p => {
                    if (p) p.querySelectorAll('[col-id]').forEach(c => combined.appendChild(c.cloneNode(true)));
                });
                combinedRows.push(combined);
            }
            const uniqueTests = new Map();
            for (const [index, combined] of combinedRows.entries()) {
                const nameCell = findCellByPatterns(combined, CONFIG.COLUMN_PATTERNS.TEST_DESC);
                const testName = nameCell?.textContent?.trim();
                if (!testName) continue;
                const statusCell = findCellByPatterns(combined, CONFIG.COLUMN_PATTERNS.STATUS);
                const status = statusCell?.textContent?.trim().toLowerCase() || 'unknown';
                let data = {
                    name: testName,
                    status: status,
                    value: null,
                    uom: null,
                    range: null,
                    flag: null,
                    originalIndex: index
                };
                const valCell = findCellByPatterns(combined, CONFIG.COLUMN_PATTERNS.RESULT_VALUE);
                const rangeCell = findCellByPatterns(combined, CONFIG.COLUMN_PATTERNS.REFERENCE_RANGE);
                const uomCell = findCellByPatterns(combined, CONFIG.COLUMN_PATTERNS.UOM);
                data.value = valCell?.textContent?.trim() || null;
                data.range = rangeCell?.textContent?.trim() || null;
                data.uom = uomCell?.textContent?.trim() || null;
                data.flag = parseRangeAndCompare(data.range, data.value);
                uniqueTests.set(testName, data);
            }
            uniqueTests.forEach(data => {
                if (!testsByStatus[data.status]) testsByStatus[data.status] = [];
                testsByStatus[data.status].push(data);
            });
            return testsByStatus;
        }
 
        const renderList = (list) => {
            if (list.length === 0) return `<div class="no-tests" style="grid-column: 1 / -1;">No tests in this category.</div>`;
            const headerHtml = `
                <div class="summary-grid-header">
                    <div class="test-name-header">Test Name</div>
                    <div class="test-value-header">Result</div>
                    <div class="uom-header">UOM</div>
                    <div class="range-header">Ref Range</div>
                    <div class="flag-header">H/L</div>
                </div>`;
            const itemsHtml = list.map(t => {
                let iconHtml;
                if (t.status.includes('result')) {
                    iconHtml = `<span class="test-icon">✅</span>`;
                } else if (t.status.includes('verif')) {
                    iconHtml = `<span class="test-icon">✓</span>`;
                } else {
                    iconHtml = `<span class="test-bullet">⏳</span>`;
                }
                const resultCellHtml = (t.value !== null && t.value !== undefined) ? `<div class="grid-cell test-value ${t.flag ? 'highlight-' + t.flag : ''}">${t.value}</div>` : `<div class="grid-cell pending-value">${capitalize(t.status)}</div>`;
                return `
                    <div class="test-item" title="${t.name} (${capitalize(t.status)})">
                        <div class="grid-cell test-details">${iconHtml}<span class="test-name">${t.name}</span></div>
                        ${resultCellHtml}
                        <div class="grid-cell test-uom">${t.uom || '-'}</div>
                        <div class="grid-cell test-range">${t.range || '-'}</div>
                        <div class="grid-cell flag-cell"><span class="flag ${t.flag ? 'flag-' + t.flag : 'flag-placeholder'}">${t.flag || ''}</span></div>
                    </div>`;
            }).join('');
            return headerHtml + itemsHtml;
        };
 
        function updateSummaryContent(containerEl) {
            if (!containerEl) return;
            const testsByStatus = getAllTests();
            const statusOrder = ['resulted', 'ordered', 'verifiedlevel1', 'verifiedlevel2'];
            const sortedStatuses = Object.keys(testsByStatus).sort((a, b) => {
                const keyA = getNormalizedStatusKey(a);
                const keyB = getNormalizedStatusKey(b);
                const indexA = statusOrder.indexOf(keyA);
                const indexB = statusOrder.indexOf(keyB);
                if (indexA === -1 && indexB === -1) return a.localeCompare(b);
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
            });
 
            let contentHtml = '';
            let totalTests = 0;
            if (sortedStatuses.length === 0) {
                contentHtml = `<div class="no-tests">No tests found on this page.</div>`;
            } else {
                sortedStatuses.forEach(status => {
                    const testList = testsByStatus[status];
                    if (testList.length === 0) return;
 
                    testList.sort((a, b) => {
                        const indexA = getSortIndex(a.name);
                        const indexB = getSortIndex(b.name);
                        if (indexA === indexB) {
                            return a.originalIndex - b.originalIndex;
                        }
                        return indexA - indexB;
                    });
 
                    totalTests += testList.length;
                    collapseState[status] = collapseState[status] ?? false;
                    const isCollapsed = collapseState[status];
                    const collapseIconClass = isCollapsed ? 'fa-arrow-circle-right' : 'fa-arrow-circle-down';
                    const statusDisplayName = capitalize(status);
                    const normalizedKey = getNormalizedStatusKey(status);
                    const properties = CONFIG.STATUS_PROPERTIES[normalizedKey] || CONFIG.STATUS_PROPERTIES.default;
                    const headerColor = properties.color;
                    const statusIconHtml = properties.className ? `<i class="${properties.className} summary-status-icon"></i>` : '';
                    contentHtml += `
                        <div class="summary-header" data-section="${status}" style="background-color: ${headerColor};">
                            <i class="fas ${collapseIconClass} collapse-icon ${isCollapsed ? 'collapsed' : ''}"></i>
                            <span>${statusDisplayName} (${testList.length})</span>
                            ${statusIconHtml}
                        </div>
                        <div id="${status.replace(/\s+/g, '-')}-tests-content" class="summary-content ${isCollapsed ? 'collapsed' : ''}">
                             <div class="summary-grid-container test-list-container">${renderList(testList)}</div>
                             <div class="hidden-note-container">
                                 ${testList.length > 0 ? `<div class="no-tests hidden-note">${testList.length} ${statusDisplayName} tests hidden</div>` : ''}
                             </div>
                        </div>`;
                });
            }
            const now = new Date();
            containerEl.innerHTML = contentHtml + `
                <div class="summary-footer">
                    <span>Total Tests: ${totalTests}</span>
                    <span>Updated: ${now.toLocaleDateString([], {month: 'short', day: 'numeric'})} ${now.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</span>
                </div>`;
        }
 
        const summaryContainer = document.createElement('div');
        summaryContainer.id = 'test-summary-container';
        summaryContainer.addEventListener('click', e => {
            const header = e.target.closest('.summary-header');
            if (!header) return;
            const section = header.dataset.section;
            if (section) {
                collapseState[section] = !collapseState[section];
                const content = document.getElementById(`${section.replace(/\s+/g, '-')}-tests-content`);
                const icon = header.querySelector('.collapse-icon');
                if (content && icon) {
                    content.classList.toggle('collapsed', collapseState[section]);
                    icon.classList.toggle('collapsed', collapseState[section]);
                    icon.classList.toggle('fa-arrow-circle-down', !collapseState[section]);
                    icon.classList.toggle('fa-arrow-circle-right', collapseState[section]);
                }
            }
        });
 
        let insertionIntervalId = null;
        const isTargetPageForSummary = () => /\/0\/.*\/undefined$/.test(window.location.href);
        const removeSummaryContainer = () => {
            const container = document.getElementById(summaryContainer.id);
            if (container) {
                Object.assign(container.style, {
                    position: '',
                    top: '',
                    zIndex: ''
                });
                container.remove();
            }
        };
        const attemptInsertion = () => {
            let targetElement = document.getElementById('barcode-display-box') || document.querySelector('.test-open.mt-2');
            if (!targetElement || document.getElementById(summaryContainer.id)) return false;
            targetElement.insertAdjacentElement('afterend', summaryContainer);
            try {
                const barcodeBox = document.getElementById('barcode-display-box');
                if (barcodeBox) {
                    const barcodeBoxStyles = window.getComputedStyle(barcodeBox);
                    if (barcodeBoxStyles.position === 'sticky') {
                        const barcodeBoxHeight = barcodeBox.offsetHeight;
                        const barcodeBoxTop = parseInt(barcodeBoxStyles.top, 10) || 0;
                        const summaryTopPosition = barcodeBoxTop + barcodeBoxHeight + 10;
                        Object.assign(summaryContainer.style, {
                            position: 'sticky',
                            top: `${summaryTopPosition}px`,
                            zIndex: '98'
                        });
                    }
                }
            } catch (e) {
                console.error("Enhanced AG Grid: Error applying sticky style to summary container.", e);
            }
            return true;
        };
        const startInsertionPolling = () => {
            if (insertionIntervalId !== null) return;
            insertionIntervalId = setInterval(() => {
                if (attemptInsertion()) {
                    clearInterval(insertionIntervalId);
                    insertionIntervalId = null;
                    if (window.enhancedGrid && window.enhancedGrid.triggerSummaryUpdate) window.enhancedGrid.triggerSummaryUpdate();
                }
            }, 500);
        };
        const stopInsertionPolling = () => {
            if (insertionIntervalId !== null) {
                clearInterval(insertionIntervalId);
                insertionIntervalId = null;
            }
        };
        const manageSummaryTableLifecycle = () => {
            if (isTargetPageForSummary()) startInsertionPolling();
            else {
                stopInsertionPolling();
                removeSummaryContainer();
            }
        };
        window.enhancedGrid.triggerSummaryUpdate = () => {
            const container = document.getElementById(summaryContainer.id);
            if (container && isTargetPageForSummary()) updateSummaryContent(container);
        };
        const observeSpaUrlChangesForSummary = () => {
            let lastHandledUrl = location.href;
            const checkUrlChange = () => {
                if (location.href !== lastHandledUrl) {
                    lastHandledUrl = location.href;
                    manageSummaryTableLifecycle();
                }
            };
            const bodyObserver = new MutationObserver(checkUrlChange);
            bodyObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        };
        observeSpaUrlChangesForSummary();
        manageSummaryTableLifecycle();
    })();
 
 
    // --- Feature: Conditional Auto & Manual VERIFY2 ---
    (function() {
        // --- Configuration (Auto Verify) ---
        const VERIFIED1_STATUS_TEXT = 'Verified 1';
        const RESULTED_STATUS_TEXT = 'Resulted';
        const STATUS_CELL_SELECTOR = 'div[col-id="ResultStatus"]';
        const VERIFY1_BUTTON_SELECTOR = 'button.verify1-btn';
        const VERIFY2_BUTTON_SELECTOR = 'button.verify2-btn';
        const HISTORY_BUTTON_SELECTOR = 'button.backBtn[translateid="edit-lab-order.HistoryResults"]';
        const VERIFICATION_MODAL_SELECTOR = '.modal-content';
        const CHECK_INTERVAL_MS = 200;
 
        // --- State Management (Auto Verify) ---
        let isAutoVerifyEnabled = true;
        let isVerificationProcessStarted = false;
        let hasAutoClicked = false;
 
        // --- Core Logic (Auto Verify) ---
        function clickVerifyButton() {
            const verifyButton = document.querySelector(VERIFY2_BUTTON_SELECTOR);
            if (verifyButton) {
                verifyButton.click();
            }
        }
 
        function hasResultedStatus() {
            const statusCells = document.querySelectorAll(STATUS_CELL_SELECTOR);
            for (const cell of statusCells) {
                if (cell.textContent && cell.textContent.trim().includes(RESULTED_STATUS_TEXT)) {
                    return true;
                }
            }
            return false;
        }
 
        function hasVerified1Status() {
            const statusCells = document.querySelectorAll(STATUS_CELL_SELECTOR);
            for (const cell of statusCells) {
                if (cell.textContent && cell.textContent.trim().includes(VERIFIED1_STATUS_TEXT)) {
                    return true;
                }
            }
            return false;
        }
 
        function isModalVisible() {
            const modal = document.querySelector(VERIFICATION_MODAL_SELECTOR);
            if (modal) {
                const modalTitle = modal.querySelector('h4.modal-title');
                if (modalTitle && modalTitle.textContent.trim() === 'Primary Verification') {
                    return true;
                }
            }
            return false;
        }
 
        function runSafetyChecks() {
            if (isModalVisible()) return false;
            if (hasResultedStatus()) return false;
            return true;
        }
 
        function checkAndAutoClick() {
            if (!isAutoVerifyEnabled || !isVerificationProcessStarted || hasAutoClicked) return;
            if (!runSafetyChecks()) return;
            if (hasVerified1Status()) {
                clickVerifyButton();
                hasAutoClicked = true;
            }
        }
 
        // --- UI Redesign and Injection (Auto Verify) ---
        function injectAutoVerifyStyles() {
            const styleId = 'auto-verify-modern-styles';
            if (document.getElementById(styleId)) return;
            const styleSheet = document.createElement("style");
            styleSheet.id = styleId;
            styleSheet.innerText = `
                .auto-verify-toggle {
                    display: inline-flex; align-items: center; gap: 12px; padding: 6px 10px;
                    border: 1px solid #ccc; border-radius: 20px; background-color: #f8f9fa;
                    cursor: pointer; transition: all 0.3s ease; user-select: none;
                }
                .auto-verify-toggle.is-active {
                    border-color: #7ab5ff; background-color: #e7f1ff; animation: pulse-glow 2s infinite;
                }
                .toggle-label {
                    font-size: 12px; font-weight: 600; color: #333;
                    display: flex; align-items: center; gap: 6px;
                }
                .toggle-switch {
                    position: relative; width: 40px; height: 22px;
                    background-color: #ccc; border-radius: 11px; transition: background-color 0.3s ease;
                }
                .auto-verify-toggle.is-active .toggle-switch { background-color: #007bff; }
                .toggle-thumb {
                    position: absolute; top: 2px; left: 2px; width: 18px; height: 18px;
                    background-color: white; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .auto-verify-toggle.is-active .toggle-thumb { transform: translateX(18px); }
                @keyframes pulse-glow {
                    0% { box-shadow: 0 0 0 0px rgba(0, 123, 255, 0.3); }
                    70% { box-shadow: 0 0 0 8px rgba(0, 123, 255, 0); }
                    100% { box-shadow: 0 0 0 0px rgba(0, 123, 255, 0); }
                }
            `;
            document.head.appendChild(styleSheet);
        }
 
        function updateVerifyUI() {
            const toggle = document.getElementById('autoVerifyToggleContainer');
            if (toggle) toggle.classList.toggle('is-active', isAutoVerifyEnabled);
            const verify2Button = document.querySelector(VERIFY2_BUTTON_SELECTOR);
            if (verify2Button) {
                if (!verify2Button.dataset.redesigned) {
                    verify2Button.textContent = 'VERIFY2 (F8)';
                    Object.assign(verify2Button.style, {
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '500', transition: 'border-color 0.3s ease'
                    });
                    verify2Button.dataset.redesigned = 'true';
                }
                verify2Button.style.borderColor = isAutoVerifyEnabled ? '#007bff' : '';
            }
        }
 
        function redesignHistoryButton() {
            const historyButton = document.querySelector(HISTORY_BUTTON_SELECTOR);
            if (!historyButton || historyButton.dataset.redesigned) return;
            historyButton.innerHTML = `<span style="margin-right: 6px;">🕒</span> View History`;
            historyButton.title = "Click to view patient's full lab history";
            Object.assign(historyButton.style, {
                display: 'inline-flex', alignItems: 'center', fontWeight: '500'
            });
            historyButton.dataset.redesigned = 'true';
        }
 
        function injectModernToggle() {
            const historyButton = document.querySelector(HISTORY_BUTTON_SELECTOR);
            if (!historyButton || document.getElementById('autoVerifyToggleContainer')) return;
            const buttonParent = historyButton.parentElement;
            const toggleContainer = document.createElement('div');
            toggleContainer.id = 'autoVerifyToggleContainer';
            toggleContainer.className = 'auto-verify-toggle';
            toggleContainer.innerHTML = `
                <span class="toggle-label">
                    <span style="font-size: 14px;">🤖</span>
                    <span>AUTO VERIFY 2</span>
                </span>
                <div class="toggle-switch"><div class="toggle-thumb"></div></div>
            `;
            toggleContainer.addEventListener('click', () => {
                isAutoVerifyEnabled = !isAutoVerifyEnabled;
                updateVerifyUI();
            });
            Object.assign(toggleContainer.style, { marginRight: '15px', verticalAlign: 'middle' });
            buttonParent.insertBefore(toggleContainer, historyButton);
        }
 
        // --- Event Listeners and Initialization ---
        function handleKeyPress(event) {
            if (event.key === 'F8') {
                event.preventDefault();
                if (runSafetyChecks()) clickVerifyButton();
            }
        }
 
        function handlePageClick(event) {
            if (event.target.closest(VERIFY1_BUTTON_SELECTOR)) {
                isVerificationProcessStarted = true;
                hasAutoClicked = false;
            }
        }
 
        // Expose functions to the main orchestrator
        window.enhancedGrid.autoVerify = {
            init: () => {
                injectAutoVerifyStyles();
                setInterval(checkAndAutoClick, CHECK_INTERVAL_MS);
                document.addEventListener('keydown', handleKeyPress);
                document.addEventListener('click', handlePageClick);
            },
            updateUI: updateVerifyUI,
            redesignHistory: redesignHistoryButton,
            injectToggle: injectModernToggle,
            resetState: () => {
                hasAutoClicked = false;
                isVerificationProcessStarted = false;
            }
        };
    })();
 
 
    // --- Main Orchestrator ---
    function runAllUpdates() {
        fullPageUpdate(); // Main layout and MRN updater
        if (window.enhancedGrid.autoVerify) {
            window.enhancedGrid.autoVerify.injectToggle();
            window.enhancedGrid.autoVerify.redesignHistory();
            window.enhancedGrid.autoVerify.updateUI();
        }
    }
 
    console.log('Unified Lab Assistant [v14.2.1] loaded.');
    window.enhancedGrid.autoVerify?.init();
 
    // Combined MutationObserver for SPA navigation
    let lastUrl = location.href;
    const spaObserver = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            document.querySelectorAll('ag-grid-angular').forEach(grid => grid.removeAttribute(RESIZED_FLAG));
            window.enhancedGrid.autoVerify?.resetState();
            console.log('[Lab Assistant] SPA Navigation Detected: Resetting states.');
        }
        // Use a debounce to run updates after DOM changes have settled.
        debounce(runAllUpdates, 200)();
    });
 
    spaObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
 
    // Also run updates periodically to catch elements that load without DOM mutations.
    setInterval(runAllUpdates, INTERVAL);
 
    // Initial run to place all elements
    setTimeout(runAllUpdates, 500);
 
})();