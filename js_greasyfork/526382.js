// ==UserScript==
// @name         Webpage Size Summary with Dual Calculation Overlay (Dynamic, URL Change Refresh)
// @namespace    http://tampermonkey.net/
// @version      2.0 
// @description  Displays page performance details grouped by resource type. The very first (initial) calculation is stored and subsequent updates are stored separately. The overlay shows a side‑by‑side comparison (Initial / Updated) for Count, Encoded Size, and Transfer Size. On URL changes the initial data is reset.
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license      free
// @author       pawag
// @downloadURL https://update.greasyfork.org/scripts/526382/Webpage%20Size%20Summary%20with%20Dual%20Calculation%20Overlay%20%28Dynamic%2C%20URL%20Change%20Refresh%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526382/Webpage%20Size%20Summary%20with%20Dual%20Calculation%20Overlay%20%28Dynamic%2C%20URL%20Change%20Refresh%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global variables to store the first (initial) calculation and the latest update.
    let initialCalculation = null;
    let latestCalculation = null;
    // Global variable to track the current URL.
    let currentUrl = window.location.href;

    // ------------------------------------------------------------
    // Function: bytesToSize
    // Purpose: Converts a number of bytes into a human‑readable string.
    // ------------------------------------------------------------
    function bytesToSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
    }

    // ------------------------------------------------------------
    // Function: calculatePageSize
    // Purpose: Retrieves performance data from the Performance API and groups resources by type.
    // For each entry, if encodedBodySize is a number greater than 0, that value is used for "size"; otherwise transferSize is used.
    // Returns an object with totalSize and groups.
    // ------------------------------------------------------------
    function calculatePageSize() {
        let totalSize = 0;
        const groups = {
            html: { count: 0, size: 0, transfer: 0 },
            script: { count: 0, size: 0, transfer: 0 },
            img: { count: 0, size: 0, transfer: 0 },
            css: { count: 0, size: 0, transfer: 0 },
            xmlhttprequest: { count: 0, size: 0, transfer: 0 },
            other: { count: 0, size: 0, transfer: 0 }
        };

        // Process the main document (navigation entry).
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries && navEntries.length > 0) {
            const nav = navEntries[0];
            // If encodedBodySize exists and is > 0, use it; otherwise, use transferSize.
            const navEncoded = nav.encodedBodySize;
            const navSize = (typeof navEncoded === "number" && navEncoded > 0) ? navEncoded : (nav.transferSize || 0);
            const navTransfer = nav.transferSize || 0;
            totalSize += navSize;
            groups.html.count += 1;
            groups.html.size += navSize;
            groups.html.transfer += navTransfer;
        }

        // Process each resource entry.
        const resources = performance.getEntriesByType("resource");
        resources.forEach(entry => {
            const encoded = entry.encodedBodySize;
            const size = (typeof encoded === "number" && encoded > 0) ? encoded : (entry.transferSize || 0);
            const transfer = entry.transferSize || 0;
            totalSize += size;
            let type = entry.initiatorType ? entry.initiatorType.toLowerCase() : 'other';
            if (type === 'img' || type === 'image') type = 'img';
            else if (type === 'script') type = 'script';
            else if (type === 'css') type = 'css';
            else if (type === 'xmlhttprequest') type = 'xmlhttprequest';
            else type = 'other';
            groups[type].count += 1;
            groups[type].size += size;
            groups[type].transfer += transfer;
        });
        return { totalSize, groups };
    }

    // ------------------------------------------------------------
    // Function: createOverlay
    // Purpose: Creates the overlay element and displays a table comparing initial (I) and updated (U) calculations.
    // Parameters:
    //    firstData   - The initial calculation result.
    //    updatedData - The latest update result (if available).
    // ------------------------------------------------------------
    function createOverlay(firstData, updatedData) {
        // Remove any existing overlay(s).
        document.querySelectorAll("#performanceOverlay").forEach(el => el.parentNode.removeChild(el));

        const overlay = document.createElement('div');
        overlay.id = "performanceOverlay";
        overlay.style.position = 'fixed';
        overlay.style.bottom = '10px';
        overlay.style.right = '10px';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.color = '#fff';
        overlay.style.padding = '10px';
        overlay.style.fontFamily = 'Arial, sans-serif';
        overlay.style.fontSize = '14px';
        overlay.style.zIndex = '9999';
        overlay.style.borderRadius = '5px';
        overlay.style.cursor = 'pointer';
        overlay.style.maxWidth = '95%';
        overlay.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

        // Create a close button.
        const closeButton = document.createElement('span');
        closeButton.textContent = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '2px';
        closeButton.style.right = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '16px';
        closeButton.style.fontWeight = 'bold';
        closeButton.addEventListener('click', function(e) {
            overlay.parentNode.removeChild(overlay);
            e.stopPropagation();
        });
        overlay.appendChild(closeButton);

        // Display overall total (from the initial calculation).
        const totalText = document.createElement('div');
        totalText.textContent = "Total: " + bytesToSize(firstData.totalSize);
        totalText.style.marginRight = '20px';
        overlay.appendChild(totalText);

        // Create a container for the details table (initially hidden).
        const detailsContainer = document.createElement('div');
        detailsContainer.style.marginTop = '10px';
        detailsContainer.style.maxHeight = '300px';
        detailsContainer.style.overflowY = 'auto';
        detailsContainer.style.display = 'none';
        detailsContainer.style.fontSize = '12px';

        // Create the table.
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        // Header row: Type, Count (I/U), Encoded Size (I/U), Transfer Size (I/U)
        const headerRow = document.createElement('tr');
        const headers = ["Type", "Count (I/U)", "Encoded Size (I/U)", "Transfer Size (I/U)"];
        headers.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            th.style.borderBottom = "1px solid #fff";
            th.style.padding = '2px 5px';
            th.style.textAlign = 'center';
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // For each resource group (using keys from the initial calculation).
        const groupTypes = Object.keys(firstData.groups);
        groupTypes.forEach(type => {
            if (firstData.groups[type].count > 0) {
                const row = document.createElement('tr');

                // Friendly name.
                let displayType = type;
                if (type === 'html') displayType = "HTML";
                else if (type === 'script') displayType = "Script";
                else if (type === 'img') displayType = "Image";
                else if (type === 'css') displayType = "CSS";
                else if (type === 'xmlhttprequest') displayType = "XHR";
                else if (type === 'other') displayType = "Other";

                const typeCell = document.createElement('td');
                typeCell.textContent = displayType;
                typeCell.style.borderBottom = "1px solid #ccc";
                typeCell.style.padding = '2px 5px';
                typeCell.style.textAlign = 'left';
                row.appendChild(typeCell);

                // Helper: for a given field, get the initial and updated values.
                const getCellText = (field) => {
                    let initialVal = firstData.groups[type][field];
                    let updatedVal = (updatedData && updatedData.groups[type]) ? updatedData.groups[type][field] : null;
                    return bytesToSize(initialVal) + " / " + (updatedVal !== null ? bytesToSize(updatedVal) : "-");
                };

                // Count cell.
                const countCell = document.createElement('td');
                let initialCount = firstData.groups[type].count;
                let updatedCount = (updatedData && updatedData.groups[type]) ? updatedData.groups[type].count : null;
                countCell.textContent = initialCount + " / " + (updatedCount !== null ? updatedCount : "-");
                countCell.style.borderBottom = "1px solid #ccc";
                countCell.style.padding = '2px 5px';
                countCell.style.textAlign = 'center';
                row.appendChild(countCell);

                // Encoded Size cell.
                const encodedCell = document.createElement('td');
                // Here, the "size" field in our calculation represents the chosen encoded size (if > 0) or fallback.
                encodedCell.textContent = getCellText("size");
                encodedCell.style.borderBottom = "1px solid #ccc";
                encodedCell.style.padding = '2px 5px';
                encodedCell.style.textAlign = 'right';
                row.appendChild(encodedCell);

                // Transfer Size cell.
                const transferCell = document.createElement('td');
                const getTransferText = (field) => {
                    let initialVal = firstData.groups[type][field];
                    let updatedVal = (updatedData && updatedData.groups[type]) ? updatedData.groups[type][field] : null;
                    return bytesToSize(initialVal) + " / " + (updatedVal !== null ? bytesToSize(updatedVal) : "-");
                };
                transferCell.textContent = getTransferText("transfer");
                transferCell.style.borderBottom = "1px solid #ccc";
                transferCell.style.padding = '2px 5px';
                transferCell.style.textAlign = 'right';
                row.appendChild(transferCell);

                table.appendChild(row);
            }
        });

        // Overall totals.
        const overall = { count: { i:0, u:0 }, size: { i:0, u:0 }, transfer: { i:0, u:0 } };
        for (let key in firstData.groups) {
            overall.count.i += firstData.groups[key].count;
            overall.size.i += firstData.groups[key].size;
            overall.transfer.i += firstData.groups[key].transfer;
            if (updatedData && updatedData.groups[key]) {
                overall.count.u += updatedData.groups[key].count;
                overall.size.u += updatedData.groups[key].size;
                overall.transfer.u += updatedData.groups[key].transfer;
            }
        }
        const totalRow = document.createElement('tr');
        const totalLabelCell = document.createElement('td');
        totalLabelCell.textContent = "TOTAL";
        totalLabelCell.style.fontWeight = "bold";
        totalLabelCell.style.padding = '2px 5px';
        totalLabelCell.style.borderTop = "2px solid #fff";
        totalLabelCell.style.textAlign = 'left';
        totalRow.appendChild(totalLabelCell);

        const totalCountCell = document.createElement('td');
        totalCountCell.textContent = overall.count.i + " / " + (updatedData ? overall.count.u : "-");
        totalCountCell.style.fontWeight = "bold";
        totalCountCell.style.padding = '2px 5px';
        totalCountCell.style.borderTop = "2px solid #fff";
        totalCountCell.style.textAlign = 'center';
        totalRow.appendChild(totalCountCell);

        const totalSizeCell = document.createElement('td');
        totalSizeCell.textContent = bytesToSize(overall.size.i) + " / " + (updatedData ? bytesToSize(overall.size.u) : "-");
        totalSizeCell.style.fontWeight = "bold";
        totalSizeCell.style.padding = '2px 5px';
        totalSizeCell.style.borderTop = "2px solid #fff";
        totalSizeCell.style.textAlign = 'right';
        totalRow.appendChild(totalSizeCell);

        const totalTransferCell = document.createElement('td');
        totalTransferCell.textContent = bytesToSize(overall.transfer.i) + " / " + (updatedData ? bytesToSize(overall.transfer.u) : "-");
        totalTransferCell.style.fontWeight = "bold";
        totalTransferCell.style.padding = '2px 5px';
        totalTransferCell.style.borderTop = "2px solid #fff";
        totalTransferCell.style.textAlign = 'right';
        totalRow.appendChild(totalTransferCell);
        table.appendChild(totalRow);

        detailsContainer.appendChild(table);
        overlay.appendChild(detailsContainer);

        // Toggle details on overlay click (except when clicking the close button).
        overlay.addEventListener('click', function(e) {
            detailsContainer.style.display = detailsContainer.style.display === 'none' ? 'block' : 'none';
            e.stopPropagation();
        });

        document.body.appendChild(overlay);
    }

    // ------------------------------------------------------------
    // Function: createErrorOverlay
    // Purpose: Creates an overlay to display an error message.
    // ------------------------------------------------------------
    function createErrorOverlay(message) {
        const overlay = document.createElement('div');
        overlay.id = "performanceOverlay";
        overlay.style.position = 'fixed';
        overlay.style.bottom = '10px';
        overlay.style.right = '10px';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.color = '#fff';
        overlay.style.padding = '10px';
        overlay.style.fontFamily = 'Arial, sans-serif';
        overlay.style.fontSize = '14px';
        overlay.style.zIndex = '9999';
        overlay.style.borderRadius = '5px';
        overlay.style.cursor = 'default';
        overlay.style.maxWidth = '90%';
        overlay.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

        const closeButton = document.createElement('span');
        closeButton.textContent = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '2px';
        closeButton.style.right = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '16px';
        closeButton.style.fontWeight = 'bold';
        closeButton.addEventListener('click', function(e) {
            overlay.parentNode.removeChild(overlay);
            e.stopPropagation();
        });
        overlay.appendChild(closeButton);

        const errorText = document.createElement('div');
        errorText.textContent = message;
        overlay.appendChild(errorText);

        document.body.appendChild(overlay);
    }

    // ------------------------------------------------------------
    // Function: initScript
    // Purpose: Checks for Performance API support, gathers performance data,
    // and updates the overlay. On the first run the result is stored as the initial calculation;
    // on subsequent runs the new result is stored as the updated calculation.
    // ------------------------------------------------------------
    function initScript() {
        if (!window.performance || typeof performance.getEntriesByType !== 'function') {
            createErrorOverlay("Your browser does not support the Performance API required for this tool.");
            return;
        }
        setTimeout(() => {
            const result = calculatePageSize();
            if (!initialCalculation) {
                initialCalculation = result;
            } else {
                latestCalculation = result;
            }
            createOverlay(initialCalculation, latestCalculation);
        }, 1500);
    }

    // ------------------------------------------------------------
    // Function: onUrlChange
    // Purpose: Checks if the URL has changed; if so, resets the stored calculations.
    // Then removes any existing overlay, clears old performance data, and reinitializes.
    // ------------------------------------------------------------
    function onUrlChange() {
        if (window.location.href !== currentUrl) {
            initialCalculation = null;
            latestCalculation = null;
            currentUrl = window.location.href;
        }
        document.querySelectorAll("#performanceOverlay").forEach(el => el.parentNode.removeChild(el));
        if (performance.clearResourceTimings) {
            performance.clearResourceTimings();
        }
        setTimeout(initScript, 2000);
    }

    // ------------------------------------------------------------
    // Function: overrideHistoryMethods
    // Purpose: Overrides history.pushState/replaceState and listens for popstate events so that URL changes trigger onUrlChange.
    // ------------------------------------------------------------
    function overrideHistoryMethods() {
        const originalPushState = history.pushState;
        history.pushState = function() {
            originalPushState.apply(history, arguments);
            onUrlChange();
        };
        const originalReplaceState = history.replaceState;
        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            onUrlChange();
        };
        window.addEventListener('popstate', onUrlChange);
    }

    // ------------------------------------------------------------
    // Function: monitorDynamicContent
    // Purpose: Uses a MutationObserver to detect when new content is added (e.g., via infinite scroll)
    // and then triggers onUrlChange after a debounce delay.
    // ------------------------------------------------------------
    function monitorDynamicContent() {
        const observer = new MutationObserver((mutationsList) => {
            let nodesAdded = false;
            for (const mutation of mutationsList) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE && node.id === "performanceOverlay") {
                            continue;
                        }
                        nodesAdded = true;
                        break;
                    }
                }
                if (nodesAdded) break;
            }
            if (nodesAdded) {
                if (window.dynamicContentTimeout) {
                    clearTimeout(window.dynamicContentTimeout);
                }
                window.dynamicContentTimeout = setTimeout(() => {
                    onUrlChange();
                }, 2000);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ------------------------------------------------------------
    // Run initialization, override history methods, and monitor dynamic content.
    // ------------------------------------------------------------
    if (document.readyState === "complete") {
        initScript();
    } else {
        window.addEventListener('load', initScript);
    }
    overrideHistoryMethods();
    monitorDynamicContent();

})(); // End of IIFE
