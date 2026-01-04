// ==UserScript==
// @name         VTY
// @namespace    eroltekramtagapagligtas
// @version      1.1.1
// @description  Automatically handles VTY account transaction processing
// @author       eroltekramtagapagligtas
// @license      All Rights Reserved
// @icon         https://www.vnmproxy.com/assets/Logo-b7711ebb.png
// @match        https://www.vtyproxy.com/*
// @match        https://www.vnmproxy.com/*
// @match        https://www.vnmproxy1.com/*
// @match        https://www.vnmproxy2.com/*
// @match        https://www.vnmproxy3.com/*
// @match        https://www.vnmproxy5.com/*
// @match        https://www.vnmproxy6.com/*
// @match        https://www.vnmproxy8.com/*
// @match        https://www.32j8.cc/*
// @match        https://www.vtyvnmagent11.com/*
// @match        https://www.vtyvnmagent12.com/*
// @match        https://www.vtyvnmagent13.com/*
// @match        https://www.vtyvnmagent15.com/*
// @match        https://www.vty56v.com/*
// @match        https://www.vtycnagent11.com/*
// @match        https://www.vtycnagent12.com/*
// @match        https://www.vtycnagent13.com/*
// @match        https://www.vtycnagent15.com/*
// @downloadURL https://update.greasyfork.org/scripts/538735/VTY.user.js
// @updateURL https://update.greasyfork.org/scripts/538735/VTY.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Constants
    const EL_INPUT = 'el-input__inner';
    const SEARCH_HISTORY_BUTTON = 'screening.width-height';
    const RESET_HISTORY_BUTTON = 'resetting.width-heightt';
    const SHANGFEN_ID = 'tab-1';
    const HISTORY_ID = 'tab-2';

    // State variables
    let lastClipboardData = null;
    let tableObserver = null;

    // ======================
    // Utility Functions
    // ======================

    /**
     * Retrieves JSON data from clipboard
     * @return {Object|null} Parsed clipboard data or null
     */
    async function getClipboardData() {
        try {
            const clipboardText = await navigator.clipboard.readText();
            return JSON.parse(clipboardText);
        } catch (error) {
            return null;
        }
    }

    function resetPaginationToFirstPage() {
            const paginationInput = document.querySelector(
                'input.el-input__inner[type="number"]'
            );

            if (paginationInput) {
                paginationInput.value = '1';
                paginationInput.dispatchEvent(new Event('input', { bubbles: true }));
                paginationInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

    /**
     * Normalizes reason string by:
     * 1. Removing "福利|补" characters
     * 2. Trimming whitespace
     * 3. Removing trailing single letters
     * @param {string} str - Original reason string
     * @return {string} Normalized reason
     */
    function normalizeReason(str) {
        if (!str) return str;

        // Remove "福利|补" and trim
        let newStr = str.replace(/福利|补/g, '').trim();

        // Remove all spaces
        newStr = newStr.replace(/\s+/g, '');

        // Normalize Vietnamese characters to ASCII
        newStr = newStr.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/Đ/g, "D").replace(/đ/g, "d");

        // Remove trailing single letter if present
        if (newStr.length > 0) {
            const lastChar = newStr.charAt(newStr.length - 1);
            if (lastChar.length === 1 && /[a-zA-Z]/.test(lastChar)) {
                newStr = newStr.substring(0, newStr.length - 1);
            }
        }

        return newStr;
    }

    /**
     * Formats date to YYYY-MM-DD
     * @param {Date} date - Date object
     * @return {string} Formatted date string
     */
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Gets current week range (Monday to Sunday)
     * @return {Object} {start, end} date strings
     */
    function getCurrentWeekRange() {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Calculate Monday (if today is Sunday, Monday was 6 days ago)
        const monday = new Date(now);
        monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));

        // Calculate Sunday
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        return {
            start: formatDate(monday),
            end: formatDate(sunday)
        };
    }

    /**
     * Gets date from two days ago
     * @return {string} Formatted date string
     */
    function getTwoDaysAgo() {
        const now = new Date();
        const twoDaysAgo = new Date(now);
        twoDaysAgo.setDate(now.getDate() - 2);
        return formatDate(twoDaysAgo);
    }

    /**
     * Extracts day number from reason string
     * @param {string} reason - Reason string
     * @return {number|null} Extracted day number or null
     */
    function extractDayFromReason(reason) {
        const match = reason.match(/^(\d+)/);
        return match ? parseInt(match[1], 10) : null;
    }

        // ======================
    // Cooldown Notification Functions
    // ======================

    /**
     * Initializes cooldown notification system
     * Listens for clicks on .sub buttons and displays centered countdown
     */
    const COOLDOWN_DURATION = 5000; // 5 seconds

    document.addEventListener('click', function(event) {
        const subButton = event.target.closest('.sub');
        if (!subButton) return;

    /**
     * Applies styles to cooldown notification element
     * @param {HTMLElement} notif - The notification element
     */
    const notif = document.createElement('div');
        notif.style.position = 'fixed';
        notif.style.bottom = '20px';
        notif.style.left = '50%';
        notif.style.transform = 'translateX(-50%)';
        notif.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        notif.style.color = 'white';
        notif.style.padding = '10px 20px';
        notif.style.borderRadius = '20px';
        notif.style.zIndex = '9999';
        notif.style.fontFamily = 'Arial, sans-serif';
        notif.style.fontSize = '32px';
        notif.style.fontWeight = 'bold';
        notif.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        document.body.appendChild(notif);

    /**
    * Updates the notification timer display
    * @param {HTMLElement} notif - The notification element
    * @param {number} startTime - Timestamp when cooldown started
    * @param {number} duration - Total cooldown duration in ms
    * Displays completion state and removes notification
    * @param {HTMLElement} notif - The notification element
    */
    const startTime = Date.now();

    function updateTimer() {
        const elapsed = Date.now() - startTime;
        const remaining = Math.ceil((COOLDOWN_DURATION - elapsed) / 1000);

        if (remaining > 0) {
            notif.textContent = `Cooldown: ${remaining}s`;
            requestAnimationFrame(updateTimer);
        } else {
            notif.textContent = 'DONE';
            notif.style.backgroundColor = 'rgba(40, 167, 69, 0.9)';
            setTimeout(() => notif.remove(), 1000);
        }
    }
        updateTimer();
    });

    // ======================
    // Highlighting Functions
    // ======================

    /**
     * Resets all row highlighting
     */
    function resetHighlighting() {
        document.querySelectorAll('.el-table__row').forEach(row => {
            row.style.backgroundColor = '';
        });
    }

    /**
     * Highlights a specific row
     * @param {Element} cell - Table cell element
     */
    function highlightRow(cell) {
        const row = cell.closest('.el-table__row');
        if (row) {
            row.style.backgroundColor = 'yellow';
        }
    }

    /**
     * Handles weekly reason highlighting (DT TUAN, 周流水)
     * @param {NodeList} reasonCells - Reason cell elements
     * @param {NodeList} dateCells - Date cell elements
     */
    function handleWeeklyReasons(reasonCells, dateCells) {
        const weekRange = getCurrentWeekRange();

        reasonCells.forEach((cell, i) => {
            const cellReasonNormalized = normalizeReason(cell.textContent).toUpperCase();
            const cellReasonRaw = cell.textContent.trim();

            const isWeeklyReason =
                cellReasonNormalized === "DTTUAN" ||
                cellReasonNormalized.startsWith("DTTUAN") ||
                cellReasonRaw === "DT TUAN" ||
                cellReasonRaw.startsWith("DT TUAN") ||
                cellReasonNormalized.includes("周流水") ||
                cellReasonRaw.includes("周流水");

            if (isWeeklyReason && dateCells[i]) {
                const dateStr = dateCells[i].textContent.trim();
                if (dateStr >= weekRange.start && dateStr <= weekRange.end) {
                    highlightRow(cell);
                }
            }
        });
    }

    /**
     * Handles date-based reason highlighting (UPDON, 晒单, 介绍, 抽奖, 红单)
     * @param {string} type - 'UPDON', '晒单', '介绍', '抽奖', '红单'
     * @param {NodeList} reasonCells - Reason cell elements
     * @param {NodeList} dateCells - Date cell elements
     * @param {number} clipDay - Day to match
     */
    function handleDateBasedReasons(type, reasonCells, dateCells, clipDay) {
        const twoDaysAgo = getTwoDaysAgo();

        reasonCells.forEach((cell, i) => {
            const cellReason = normalizeReason(cell.textContent).toUpperCase();
            const dateStr = dateCells[i]?.textContent.trim();

            // Skip if no date or too old
            if (!dateStr || dateStr < twoDaysAgo) return;

            // Extract day from cell reason if present
            let cellDay = extractDayFromReason(cellReason);

            // Get day from date string
            const dateDay = dateStr ? parseInt(dateStr.split('-')[2], 10) : null;

            // Use date day if reason doesn't have day
            if (cellDay === null) {
                cellDay = dateDay;
            }

            // Highlight if days match and reason contains type
            if (cellDay !== null && clipDay === cellDay && cellReason.includes(type)) {
                highlightRow(cell);
            }
        });
    }

    /**
     * Highlights duplicate rows based on reason
     * @param {string} reason - Reason to match
     */
    async function highlightDuplicateRows(reason) {
        if (!reason) return;

        // Get clipboard data first
        const clipboardData = await getClipboardData();
        if (!clipboardData || !clipboardData.accountName) return;

        // Reset highlighting only when we're about to apply new highlights
        resetHighlighting();

        const normalizedClipReason = normalizeReason(reason).toUpperCase();
        const clipDay = extractDayFromReason(normalizedClipReason);
        const todayDay = getTodayDay();

        // Get all rows and their components at once
        const rows = document.querySelectorAll('.el-table__row');

        rows.forEach(row => {
            const accountCell = row.querySelector('.el-table__cell:nth-child(3) .cell');
            const reasonCell = row.querySelector('.el-table__cell:nth-child(8) .cell');
            const dateCell = row.querySelector('.el-table__cell:nth-child(10) .cell');

            if (!accountCell || !reasonCell || !dateCell) return;

            // Check account match first (case-insensitive)
            if (accountCell.textContent.trim().toUpperCase() !==
                clipboardData.accountName.toUpperCase()) {
                return; // Skip this row if account doesn't match
            }

            // Now check reason match
            const cellReason = normalizeReason(reasonCell.textContent).toUpperCase();

            // Define all your date-based reasons in one array
            const dateBasedReasons = ["UPDON", "晒单", "介绍", "抽奖", "红单"];

            // Then replace all the individual else-if blocks with:
            const matchedReason = dateBasedReasons.find(reason =>
                  normalizedClipReason.includes(reason)
            );

            if (matchedReason) {
                if (handleDateBasedReasons(
                    matchedReason,
                    [reasonCell],
                    [dateCell],
                    clipDay ?? todayDay
                )) {
                    highlightRow(reasonCell);
                }
            }
            else if (normalizedClipReason.includes("周流水") ||
                     normalizedClipReason.includes("DTTUAN")) {
                if (handleWeeklyReasons([reasonCell], [dateCell])) {
                    highlightRow(reasonCell);
                }
            }
            else if (normalizedClipReason === cellReason) {
                highlightRow(reasonCell);
            }
        });
    }


    // ======================
    // Observer Functions
    // ======================

    /**
     * Sets up table mutation observer
     */
    function setupTableObserver() {
        const targetNode = document.querySelector('.el-table__body-wrapper');
        if (!targetNode || tableObserver) return;

        tableObserver = new MutationObserver(() => {
            if (lastClipboardData?.reason) {
                highlightDuplicateRows(lastClipboardData.reason);
            }
        });

        tableObserver.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Cleans up table observer
     */
    function cleanupTableObserver() {
        if (tableObserver) {
            tableObserver.disconnect();
            tableObserver = null;
        }
    }

    // ======================
    // Department Validation
    // ======================
    function getSiteDepartment() {
        const rightBox = document.querySelector('.right-box');
        if (!rightBox) return null;

        const departmentElements = rightBox.querySelectorAll('span');
        if (departmentElements.length > 1) {
            return departmentElements[1].textContent.trim().toLowerCase();
        }
        return null;
    }

    async function validateDepartment() {
        const clipboardData = await getClipboardData();
        if (!clipboardData?.department) return true; // No department to validate

        const siteDepartment = getSiteDepartment();
        const clipDepartment = clipboardData.department.trim().toLowerCase();

        if (siteDepartment && clipDepartment !== siteDepartment) {
            alert('WRONG DEPARTMENT');
            return false;
        }
        return true;
    }

    // ======================
    // Event Handlers
    // ======================

    /**
     * Handles Alt+V keypress
     */
    async function handleAltV() {
        // Validate department
        if (!(await validateDepartment())) return;

        // Switch to history tab
        const targetTab = document.querySelector(`#${HISTORY_ID}`);
        if (!targetTab) return;

        targetTab.click();
        setTimeout(resetHighlighting, 100);
        cleanupTableObserver();

       // resetPaginationToFirstPage();
        // Process clipboard data
        setTimeout(async () => {
            const clipboardData = await getClipboardData();
            lastClipboardData = clipboardData;

            // Reset form
            const resetButton = document.querySelector(`.${RESET_HISTORY_BUTTON}`);
            if (resetButton) resetButton.click();

            // Determine input index
            const dropdownItems = document.querySelectorAll('.el-select-dropdown__item');
            let inputIndex = 4;
            if (dropdownItems.length > 0 &&
                (dropdownItems[0].getAttribute('aria-selected') === 'true' ||
                 dropdownItems[0].classList.contains('selected'))) {
                inputIndex = 5;
            }

            // Fill account name
            if (clipboardData?.accountName) {
                const searchAcc = document.querySelectorAll(`.${EL_INPUT}`)[inputIndex];
                if (searchAcc) {
                    searchAcc.value = clipboardData.accountName;
                    searchAcc.dispatchEvent(new Event('input', { bubbles: true }));

                    // Trigger search
                    document.querySelector(`.${SEARCH_HISTORY_BUTTON}`)?.click();

                    // Set up observer and highlight
                        setupTableObserver();
                        if (clipboardData.reason) highlightDuplicateRows(clipboardData.reason);
                }
            }
        }, 200);
    }

    /**
     * Handles F1 keypress
     */
    async function handleF1() {
        // Validate department
        if (!(await validateDepartment())) return;

        const targetTab = document.querySelector(`#${SHANGFEN_ID}`);
        if (!targetTab) return;

        targetTab.click();
        const clipboardData = await getClipboardData();

        // Get form elements
        const inputElements = document.querySelectorAll(`.${EL_INPUT}`);
        const dropdownItems = document.querySelectorAll('.el-select-dropdown__item');

        // Select first dropdown item
        if (dropdownItems[0]) dropdownItems[0].click();

        // Fill account name
        if (clipboardData?.accountName && inputElements[0]) {
            inputElements[0].value = clipboardData.accountName;
            inputElements[0].dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Select other dropdown items
        if (dropdownItems[3]) dropdownItems[3].click();
        if (dropdownItems[5]) dropdownItems[5].click();

        // Fill amount
        if (clipboardData?.amount && inputElements[1]) {
            inputElements[1].value = clipboardData.amount;
            inputElements[1].dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Fill fixed value
        setTimeout(() => {
            const thirdInput = document.querySelector(
                'input[placeholder="Vui lòng nhập"], ' +
                'input[placeholder="Please enter"], ' +
                'input[placeholder="请输入"]'
            );
            if (thirdInput) {
                thirdInput.value = '1';
                thirdInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }, 100);

        // Determine input positions
        let fourthInput, fifthInput;
        if (dropdownItems[0]?.getAttribute('aria-selected') === 'true') {
            fourthInput = inputElements[3];
            fifthInput = inputElements[4];
        } else {
            fourthInput = inputElements[2];
            fifthInput = inputElements[3];
        }

        // Fill password
        if (fourthInput && clipboardData?.departValue) {
            fourthInput.value = clipboardData.departValue;
            fourthInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Fill reason
        if (fifthInput && clipboardData?.reason) {
            fifthInput.value = clipboardData.reason;
            fifthInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    // ======================
    // Event Listeners
    // ======================

    document.addEventListener('keydown', async function(event) {
        // Alt+V functionality
        if (event.altKey && event.key === 'v') {
            event.preventDefault();
            await handleAltV();
        }

        // F1 functionality
        if (event.key === 'F1') {
            event.preventDefault();
            await handleF1();
        }
    });

    // Helper function: Get today's day of month
    function getTodayDay() {
        return new Date().getDate();
    }
})();