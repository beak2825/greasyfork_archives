// ==UserScript==
// @name         8chan Reports Page Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  Enhances the usability and appearance of the 8chan board moderation reports page with a dynamic, compact grid layout, smaller image thumbnails, combined report labels in a single div, styled Moderate buttons, scrollable post content, and an orange-themed Ban button to open the ban modal.
// @author       Grok
// @match        *://8chan.moe/openReports.js*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533762/8chan%20Reports%20Page%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/533762/8chan%20Reports%20Page%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS styles
    GM_addStyle(`
        /* General Layout */
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            background-color: #f5f6f5;
            color: #333;
            line-height: 1.4;
            margin: 0;
            font-size: 0.9em;
        }

        .titleWrapper {
            max-width: 100%;
            margin: 15px auto;
            padding: 0 10px;
            box-sizing: border-box;
        }

        .titleFieldset {
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 15px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        legend {
            font-size: 1.3em;
            font-weight: 600;
            color: #222;
            padding: 0 8px;
        }

        /* Report Cells */
        #reportDiv {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 10px;
            margin-top: 15px;
            justify-content: space-between;
            width: 100%;
            box-sizing: border-box;
        }

        .reportCell {
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            padding: 10px;
            transition: box-shadow 0.2s;
            flex: 1 1 calc(50% - 8px);
            box-sizing: border-box;
            min-width: 250px;
            font-size: 0.85em;
            display: flex;
            flex-direction: column;
        }

        .reportCell:hover {
            box-shadow: 0 3px 6px rgba(0,0,0,0.1);
        }

        /* Combined Div */
        .reportCell .combined-div {
            display: flex;
            flex-wrap: nowrap;
            gap: 12px;
            align-items: center;
            font-size: 0.9em;
            margin-bottom: 5px;
            white-space: nowrap;
        }

        .reportCell .combined-div span {
            display: inline-flex;
            align-items: center;
        }

        /* Hide Reports and Category labels as fallback */
        .reportCell label:has(.totalLabel),
        .reportCell label.categoryDiv {
            display: none !important;
        }

        .boardLabel, .totalLabel, .categoryLabel {
            font-weight: 500;
            color: #1a73e8;
        }

        .reasonLabel {
            background: #f1f3f4;
            padding: 3px 6px;
            border-radius: 3px;
            display: inline-block;
            font-size: 0.9em;
        }

        /* Checkbox Styles */
        .closureCheckbox {
            margin-right: 6px;
            vertical-align: middle;
            width: 16px;
            height: 16px;
            cursor: pointer;
            accent-color: #1a73e8;
            box-shadow: 0 0 6px rgba(26, 115, 232, 0.6);
        }

        .deletionCheckBox {
            margin-right: 6px;
            vertical-align: middle;
            width: 14px;
            height: 14px;
            cursor: pointer;
            accent-color: #d32f2f;
        }

        /* Moderate and Ban Buttons */
        .reportCell label {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }

        .link {
            color: #d32f2f;
            font-weight: 500;
            text-decoration: none;
            padding: 3px 6px;
            border-radius: 3px;
            font-size: 0.9em;
            background-color: #f0e0e0;
            border: 1px solid #e03030;
            transition: background-color 0.2s, border-color 0.2s;
        }

        .banButton {
            color: #f57c00;
            font-weight: 500;
            text-decoration: none;
            padding: 3px 6px;
            border-radius: 3px;
            font-size: 0.9em;
            background-color: #ffe0b2;
            border: 1px solid #f57c00;
            transition: background-color 0.2s, border-color 0.2s;
        }

        .link:hover, .banButton:hover {
            background-color: #fff3e0;
            border-color: #888;
            text-decoration: none;
        }

        /* Post Content */
        .postingDiv {
            flex: 1;
            min-width: 0;
            max-height: 25rem;
            overflow-y: auto;
        }

        .postingDiv .innerPost {
            background: #fafafa;
            padding: 8px;
            border-radius: 3px;
            margin-top: 8px;
            font-size: 0.9em;
            min-width: 150px;
            padding-bottom: 12px;
        }

        .labelBoard {
            font-size: 1em;
            color: #0288d1;
            margin: 0 0 8px;
        }

        .postInfo {
            font-size: 0.85em;
            color: #555;
            white-space: normal;
        }

        .labelId {
            padding: 2px 5px;
            border-radius: 3px;
            color: #fff;
            font-size: 0.85em;
        }

        .panelIp, .panelASN, .panelBypassId {
            font-size: 0.8em;
            color: #666;
            margin-top: 4px;
            word-break: break-all;
        }

        .divMessage {
            margin-top: 8px;
            font-size: 0.9em;
            color: #333;
            padding: 6px;
            background: #f5f5f5;
            border-radius: 3px;
            min-width: 150px;
            word-wrap: break-word;
        }

        .quoteLink {
            color: #388e3c;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.9em;
        }

        .quoteLink:hover {
            text-decoration: underline;
        }

        /* Uploads */
        .panelUploads {
            margin-top: 8px;
            display: flex;
            flex-wrap: wrap;
        }

        .uploadCell {
            margin-bottom: 8px;
            flex: 0 0 auto;
        }

        .imgLink img {
            border-radius: 3px;
            max-width: 60px !important;
            max-height: 60px !important;
            width: auto !important;
            height: auto !important;
            object-fit: contain;
            display: block;
            margin: 0;
        }

        .originalNameLink, .nameLink {
            color: #0288d1;
            text-decoration: none;
            font-size: 0.85em;
        }

        .originalNameLink:hover, .nameLink:hover {
            text-decoration: underline;
        }

        .uploadDetails, .divHash, .sizeLabel, .dimensionLabel {
            font-size: 0.8em;
            color: #555;
        }

        .unlinkLink, .unlinkAndDeleteLink {
            font-size: 0.85em;
        }

        /* Forms */
        #filterForm, form[action="/closeReports.js"] {
            background: #f9f9f9;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
        }

        #filterForm label, form[action="/closeReports.js"] label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #444;
            font-size: 0.9em;
        }

        #filterCategoriesDiv {
            margin: 8px 0;
        }

        .categoryCheckbox {
            margin-right: 6px;
            width: 14px;
            height: 14px;
        }

        input[type="text"], select {
            padding: 6px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 0.9em;
            width: 180px;
            margin-left: 8px;
        }

        input[type="text"]:focus, select:focus {
            border-color: #1a73e8;
            outline: none;
            box-shadow: 0 0 0 2px rgba(26,115,232,0.2);
        }

        button, #filterSubmitButton, #closeReportsFormButton {
            background: #1a73e8;
            color: #fff;
            border: none;
            padding: 6px 12px;
            border-radius: 3px;
            font-size: 0.9em;
            cursor: pointer;
            transition: background 0.2s;
        }

        button:hover, #filterSubmitButton:hover, #closeReportsFormButton:hover {
            background: #1565c0;
        }

        /* Checkboxes */
        .closeReportsField {
            margin-right: 6px;
            vertical-align: middle;
            width: 14px;
            height: 14px;
        }

        /* Navigation */
        .navHeader {
            background: #fff;
            border-bottom: 1px solid #ddd;
            padding: 8px 15px;
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .navLinkSpan a {
            color: #0288d1;
            text-decoration: none;
            margin: 0 4px;
            font-size: 0.9em;
        }

        .navLinkSpan a:hover {
            text-decoration: underline;
        }

        /* Responsive Adjustments for More Columns */
        @media (min-width: 900px) {
            .reportCell {
                flex: 1 1 calc(33.33% - 8px);
            }
        }

        @media (min-width: 1200px) {
            .reportCell {
                flex: 1 1 calc(25% - 8px);
            }
        }

        @media (max-width: 600px) {
            .reportCell {
                flex: 1 1 100% !important;
                min-width: 100% !important;
                max-width: 100% !important;
            }

            input[type="text"], select {
                width: 100%;
            }

            .divMessage, .innerPost {
                min-width: 100% !important;
            }

            .reportCell .combined-div {
                flex-direction: column;
                gap: 5px;
                align-items: flex-start;
                white-space: normal;
            }

            .reportCell label {
                flex-direction: column;
                align-items: flex-start;
                gap: 4px;
            }
        }
    `);

    // JavaScript to combine labels and add Ban button
    function processReportCells() {
        const cells = document.querySelectorAll('.reportCell:not(.processed)');
        if (cells.length) {
            console.log(`Processing ${cells.length} reportCell(s) at`, Date.now());
        }
        cells.forEach(cell => {
            // Mark as processed
            cell.classList.add('processed');

            // Combine labels into a single div
            const labels = cell.querySelectorAll('label:not([for])');
            if (labels.length >= 3) {
                const boardSpan = labels[0].querySelector('.boardLabel');
                const totalSpan = labels[1].querySelector('.totalLabel');
                const categorySpan = labels[2].querySelector('.categoryLabel');

                if (boardSpan && totalSpan && categorySpan) {
                    const combinedDiv = document.createElement('div');
                    combinedDiv.className = 'combined-div';
                    combinedDiv.innerHTML = `
                        <span class="boardLabel">/${boardSpan.textContent}/</span>
                        Reports: <span class="totalLabel">${totalSpan.textContent}</span>
                        Category: <span class="categoryLabel">${categorySpan.textContent}</span>
                    `;
                    cell.insertBefore(combinedDiv, labels[0]);
                    labels[0].remove();
                    labels[1].remove();
                    labels[2].remove();
                }
            }

            // Add Ban button
            const reportLabel = cell.querySelector('label');
            const deletionCheckBox = cell.querySelector('.deletionCheckBox');
            if (reportLabel && deletionCheckBox) {
                const banButton = document.createElement('a');
                banButton.className = 'banButton';
                banButton.textContent = 'Ban';
                banButton.href = '#';
                banButton.setAttribute('data-ban-id', deletionCheckBox.name);
                banButton.setAttribute('aria-label', `Ban post ${deletionCheckBox.name}`);
                banButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent bubbling to label/checkbox
                    console.log('Ban button clicked for post:', deletionCheckBox.name);

                    // Find extraMenuButton
                    const extraMenuButton = cell.querySelector('.extraMenuButton');
                    if (extraMenuButton) {
                        console.log('Clicking extraMenuButton for:', deletionCheckBox.name);
                        extraMenuButton.click();

                        // Wait for extraMenu to appear
                        setTimeout(() => {
                            const extraMenu = document.querySelector('.extraMenu');
                            if (extraMenu) {
                                const banOption = Array.from(extraMenu.querySelectorAll('li')).find(li => li.textContent === 'Ban');
                                if (banOption) {
                                    console.log('Found Ban option, triggering click for:', deletionCheckBox.name);
                                    const originalDisplay = extraMenu.style.display;
                                    extraMenu.style.display = 'block';
                                    banOption.click();
                                    setTimeout(() => {
                                        extraMenu.style.display = originalDisplay;
                                    }, 0);
                                } else {
                                    console.error('Ban option not found in .extraMenu');
                                }
                            } else {
                                console.error('extraMenu not found after clicking extraMenuButton');
                            }
                        }, 50); // Wait 50ms for extraMenu to appear
                    } else {
                        console.error('extraMenuButton not found in reportCell');
                    }
                });
                reportLabel.appendChild(banButton);
                console.log('Added Ban button for post:', deletionCheckBox.name);
            }
        });
    }

    // Debounce function to batch processReportCells calls
    function debounce(fn, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), wait);
        };
    }

    // Process cells with debounce
    const debouncedProcessReportCells = debounce(processReportCells, 100);

    // Observe #reportDiv for .reportCell additions
    function observeReportDiv() {
        const reportDiv = document.querySelector('#reportDiv');
        if (reportDiv) {
            console.log('Found #reportDiv, starting observer at', Date.now());
            const observer = new MutationObserver((mutations) => {
                if (mutations.some(m => Array.from(m.addedNodes).some(node => node.nodeType === 1 && node.matches('.reportCell')))) {
                    debouncedProcessReportCells();
                }
            });
            observer.observe(reportDiv, { childList: true, subtree: true });
            // Check existing cells immediately
            processReportCells();
        } else {
            // Retry if #reportDiv not found
            setTimeout(observeReportDiv, 100);
        }
    }

    // Start observing as early as possible
    observeReportDiv();
})();