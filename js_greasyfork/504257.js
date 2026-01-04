// ==UserScript==
// @name         Enhanced Copy PID with Persistent Popup and Optimizations
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Copy PID to clipboard with persistent popup, hover highlight, and optimized performance.
// @author       You
// @match        *://.imvu.com/shop/product.php?products_id*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504257/Enhanced%20Copy%20PID%20with%20Persistent%20Popup%20and%20Optimizations.user.js
// @updateURL https://update.greasyfork.org/scripts/504257/Enhanced%20Copy%20PID%20with%20Persistent%20Popup%20and%20Optimizations.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const pidElement = document.querySelector('#product-cfl-pid'); // Cache the PID element

    if (!pidElement) return; // Exit if PID element is not found

    // Preload tooltip and popup elements
    const tooltip = document.createElement('div');
    tooltip.textContent = 'Click to Copy';
    tooltip.className = 'copy-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.display = 'none'; // Initially hidden
    document.body.appendChild(tooltip);

    const popup = document.createElement('div');
    popup.textContent = 'Copied - Shop Spikes!';
    popup.className = 'copy-popup';
    popup.style.position = 'absolute';
    popup.style.display = 'none'; // Initially hidden
    document.body.appendChild(popup);

    // Function to handle copying to clipboard and showing popup
    function copyToClipboard(event) {
        const pidText = pidElement.textContent;

        // Remove tooltip when clicked
        tooltip.style.display = 'none';

        // Copy the PID number to the clipboard
        navigator.clipboard.writeText(pidText).then(() => {
            // Position popup relative to the PID element
            const rect = pidElement.getBoundingClientRect();
            popup.style.left = `${rect.left + window.scrollX + rect.width + 10}px`;
            popup.style.top = `${rect.top + window.scrollY}px`;
            popup.style.display = 'block';

            // Remove popup after 1.5 seconds
            setTimeout(() => {
                popup.style.display = 'none';
            }, 1500);
        });
    }

    // Function to show tooltip on hover
    function showTooltip(event) {
        // Position tooltip relative to the PID element
        const rect = pidElement.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX + rect.width + 10}px`;
        tooltip.style.top = `${rect.top + window.scrollY}px`;
        tooltip.style.display = 'block';
    }

    // Function to highlight PID element on hover
    function highlightOnHover() {
        pidElement.style.border = '2px solid #0073e6'; // Add blue border
        pidElement.style.backgroundColor = '#f0f8ff';  // Add light background color
    }

    // Function to remove highlight on mouseout
    function removeHighlight() {
        pidElement.style.border = ''; // Reset border
        pidElement.style.backgroundColor = ''; // Reset background color
        tooltip.style.display = 'none'; // Hide tooltip on mouseout
    }

    // Add styles for the popup, tooltip, and hover highlight
    GM_addStyle(`
        .copy-popup {
            background: #333;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            pointer-events: none;
            z-index: 1000;
            transition: opacity 0.2s ease-in-out;
        }

        .copy-tooltip {
            background: #555;
            color: white;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            pointer-events: none;
            z-index: 1000;
            transition: opacity 0.2s ease-in-out;
        }

        #product-cfl-pid {
            transition: background-color 0.2s ease-in-out, border 0.2s ease-in-out;
        }
    `);

    // Attach event listeners to the PID element
    pidElement.addEventListener('mouseover', function (event) {
        highlightOnHover();
        showTooltip(event);
    });

    pidElement.addEventListener('mouseout', function () {
        removeHighlight();
    });

    pidElement.addEventListener('click', function (event) {
        copyToClipboard(event);
    });
})();
