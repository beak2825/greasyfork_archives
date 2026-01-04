// ==UserScript==
// @name         E-SAKIP Kaltim Status Updater
// @namespace    http://tampermonkey.net/
// @version      2025-04-10
// @description  Automatically update BELUM status items to Sudah Dilaksanakan
// @author       You
// @match        https://e-sakip.kaltimprov.go.id/realisasi-kinerja?unit=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532786/E-SAKIP%20Kaltim%20Status%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/532786/E-SAKIP%20Kaltim%20Status%20Updater.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variable to track if auto-update is enabled
    let autoUpdateEnabled = localStorage.getItem('autoUpdateEnabled') === 'true';
    let isProcessing = false; // Flag to prevent multiple concurrent updates
    let throttleTimer = null; // For throttling observer callbacks

    // Function to throttle calls
    function throttle(func, delay) {
        if (throttleTimer) return;

        throttleTimer = setTimeout(() => {
            func();
            throttleTimer = null;
        }, delay);
    }

    // Function to add toggle button to navbar
    function addToggleButton() {
        if (document.getElementById('auto-update-toggle')) return;

        const navbarUl = document.querySelector('.navbar-nav');
        if (!navbarUl) return;

        // Create new nav item for toggle
        const toggleLi = document.createElement('li');
        toggleLi.className = 'nav-item';

        // Create toggle link
        const toggleLink = document.createElement('a');
        toggleLink.className = 'navbar-nav-link';
        toggleLink.style.cursor = 'pointer';
        toggleLink.id = 'auto-update-toggle';

        // Create icon
        const icon = document.createElement('i');
        icon.className = 'icon-switch mr-1';

        // Set initial text based on status
        const statusText = document.createTextNode(
            autoUpdateEnabled ? 'Auto Update: ON' : 'Auto Update: OFF'
        );

        // Assemble elements
        toggleLink.appendChild(icon);
        toggleLink.appendChild(statusText);
        toggleLi.appendChild(toggleLink);

        // Insert after Anggaran menu item
        const anggaranItem = Array.from(navbarUl.querySelectorAll('.nav-item')).find(
            item => item.textContent.trim().includes('Anggaran')
        );

        if (anggaranItem) {
            navbarUl.insertBefore(toggleLi, anggaranItem.nextSibling);
        } else {
            navbarUl.appendChild(toggleLi);
        }

        // Set initial style
        updateToggleStyle(toggleLink);

        // Add click event to toggle
        toggleLink.addEventListener('click', function() {
            autoUpdateEnabled = !autoUpdateEnabled;
            localStorage.setItem('autoUpdateEnabled', autoUpdateEnabled);
            statusText.nodeValue = autoUpdateEnabled ? 'Auto Update: ON' : 'Auto Update: OFF';
            updateToggleStyle(toggleLink);

            if (autoUpdateEnabled && !isProcessing) {
                processNextBelumButton();
            }
        });
    }

    // Function to update toggle style
    function updateToggleStyle(toggleLink) {
        toggleLink.style.color = autoUpdateEnabled ? '#4caf50' : '';
    }

    // Function to find and click the next BELUM button
    function processNextBelumButton() {
        if (!autoUpdateEnabled || isProcessing) return;

        isProcessing = true;

        // Find all buttons with text "BELUM"
        const belumButtons = Array.from(document.querySelectorAll('button'))
            .filter(button => button.textContent.trim() === 'BELUM');

        if (belumButtons.length === 0) {
            console.log('No more BELUM buttons found!');
            isProcessing = false;
            return;
        }

        // Get the first BELUM button
        const button = belumButtons[0];

        // Extract the ID from onclick attribute
        const onclickAttr = button.getAttribute('onclick');
        if (!onclickAttr) {
            isProcessing = false;
            return;
        }

        const match = onclickAttr.match(/ubahStatusRenaksi\('(\d+)'\)/);
        if (!match || !match[1]) {
            isProcessing = false;
            return;
        }

        // Click the button to open modal
        button.click();

        // Wait for modal to appear
        setTimeout(() => {
            // Find status dropdown and set to "Sudah Dilaksanakan" (value 2)
            const statusSelect = document.getElementById('status');
            if (statusSelect) {
                statusSelect.value = '2';

                // Trigger change event for any potential listeners
                const event = new Event('change', { bubbles: true });
                statusSelect.dispatchEvent(event);

                // Find and click the Update Status button
                setTimeout(() => {
                    const updateButton = document.getElementById('btnSave');
                    if (updateButton) {
                        updateButton.click();

                        // Wait for modal to close and page to refresh
                        setTimeout(() => {
                            isProcessing = false;
                            // Process the next button
                            processNextBelumButton();
                        }, 2000);
                    } else {
                        isProcessing = false;
                    }
                }, 500);
            } else {
                isProcessing = false;
            }
        }, 1000);
    }

    // Function to fix edit buttons by adding tw parameter if needed
    function fixEditButtons() {
        // Check if the current URL contains tw parameter
        const currentUrl = window.location.href;
        const twMatch = currentUrl.match(/[?&]tw=(\d+)/);

        if (twMatch && twMatch[1]) {
            const twValue = twMatch[1];

            // Find all edit buttons
            const editButtons = document.querySelectorAll('a[href*="/realisasi-kinerja/"][href*="/edit"]');

            // Add tw parameter to each edit button if it doesn't already have it
            editButtons.forEach(button => {
                const href = button.getAttribute('href');
                if (href && !href.includes('tw=')) {
                    button.setAttribute('href', `${href}?tw=${twValue}`);
                }
            });
        }
    }

    // Function to adjust table row background colors
    function adjustTableRowColors() {
        // Find all tables with class datatable-basic
        const tables = document.querySelectorAll('table.datatable-basic');

        tables.forEach(table => {
            // Get the direct tbody child of this table
            const tbodies = table.getElementsByTagName('tbody');
            if (tbodies.length === 0) return;

            const tbody = tbodies[0];

            // Get all direct tr children of this tbody (filter out nested tr elements)
            const allTrs = tbody.getElementsByTagName('tr');
            const rows = Array.from(allTrs).filter(tr => tr.parentNode === tbody);

            // Set alternating colors for all rows
            let isAltRow = true; // Start with true for the first row to get #daf7f1
            let currentColor = '';

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const style = window.getComputedStyle(row);
                const bgColor = style.backgroundColor;

                // Check if this is the last row with the special background color #740001
                if (i === rows.length - 1 && isRedBackground(bgColor)) {
                    row.style.backgroundColor = '#2b85a8';
                    continue;
                }

                // Check if this is a yellow row
                if (isYellowBackground(bgColor)) {
                    // Apply same color as the previous non-yellow row
                    row.style.backgroundColor = currentColor;
                } else {
                    // This is a regular row, apply alternating color
                    currentColor = isAltRow ? '#daf7f1' : '#ffffff';
                    row.style.backgroundColor = currentColor;
                    isAltRow = !isAltRow; // Toggle for next regular row
                }
            }
        });
    }

    // Helper function to detect yellow background
    function isYellowBackground(colorString) {
        // Convert rgb/rgba string to values
        const match = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (!match) return false;

        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);

        // Check if color is yellowish (high red and green, low blue)
        return r > 200 && g > 200 && b < 150;
    }

    // Helper function to detect red background (#740001)
    function isRedBackground(colorString) {
        // Convert rgb/rgba string to values
        const match = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (!match) return false;

        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);

        // Check if color is reddish (high red, very low green and blue)
        // RGB for #740001 is approximately (116, 0, 1)
        return r > 100 && r < 130 && g < 5 && b < 5;
    }

    // Initialize the script
    function init() {
        console.log("Initializing E-SAKIP enhancement script");

        // Add toggle button to navbar
        addToggleButton();

        // Fix edit buttons
        fixEditButtons();

        // Adjust table row colors
        adjustTableRowColors();

        // Start auto-update if enabled
        if (autoUpdateEnabled && !isProcessing) {
            processNextBelumButton();
        }

        // Set up a more focused observer for the toggle button area
        const navbarObserver = new MutationObserver(() => {
            throttle(() => {
                if (!document.getElementById('auto-update-toggle')) {
                    addToggleButton();
                }
            }, 500);
        });

        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbarObserver.observe(navbar, {
                childList: true,
                subtree: true
            });
        }

        // Set up an observer just for the table content
        const tableObserver = new MutationObserver(() => {
            throttle(() => {
                fixEditButtons();
                adjustTableRowColors();
            }, 1000);
        });

        // Only observe the main content area instead of the entire body
        const contentArea = document.querySelector('.content');
        if (contentArea) {
            tableObserver.observe(contentArea, {
                childList: true,
                subtree: true,
                attributes: false
            });
        }

        // Add an event listener for Ajax completions
        document.addEventListener('ajaxComplete', () => {
            throttle(() => {
                fixEditButtons();
                adjustTableRowColors();
            }, 1000);
        });
    }

    // Wait for page to fully load
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
