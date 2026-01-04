// ==UserScript==
// @name         BTY (F2&F3 USERS ONLY)
// @namespace    eroltekramtagapagligtas
// @version      1.0.9
// @description  Automatically handles BTY account transaction processing
// @author       eroltekramtagapagligtas
// @license      All Rights Reserved
// @icon         https://www.bty0991.com/33c6d80bfd4c07773f7e0bc003967c6c.svg
// @match        https://f.bsports2.com/*
// @match        https://f.bsports3.com/*
// @match        https://f.bsports4.com/*
// @match        https://f.bsports5.com/*
// @match        https://f.bsports6.com/*
// @match        https://f.bsports7.com/*
// @match        https://f.bsports9.com/*
// @match        https://f.bty0vip1.com/*
// @match        https://f.bty0vip2.com/*
// @match        https://f.bty0vip3.com/*
// @match        https://f.bty0vip4.com/*
// @match        https://f.bty0vip5.com/*
// @match        https://f.bty0vip6.com/*
// @match        https://f.bty-cn.com/*
// @match        https://fg1.btyso17.com/*
// @match        https://fg2.btyso18.com/*
// @match        https://fg3.btyso19.com/*
// @match        https://fg4.btyso20.com/*
// @match        https://fg5.btyso21.com/*
// @downloadURL https://update.greasyfork.org/scripts/538743/BTY%20%28F2F3%20USERS%20ONLY%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538743/BTY%20%28F2F3%20USERS%20ONLY%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======================
    // State Variables
    // ======================
    let lastClipboardData = null;
    let paginationObserver = null;
    let isInRechargeHistory = false;

    // ======================
    // Utility Functions
    // ======================

    /**
     * Retrieves JSON data from clipboard
     * @return {Object|null} Parsed clipboard data
     */
    async function getClipboardData() {
        try {
            const clipboardText = await navigator.clipboard.readText();
            return JSON.parse(clipboardText);
        } catch (error) {
            return null;
        }
    }

    /**
     * Normalizes reason strings by removing patterns and whitespace
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
     * Extracts day number from reason string
     * @param {string} reason - Reason string
     * @return {number|null} Extracted day number
     */
    function extractDayFromReason(reason) {
        const match = reason.match(/^(\d+)/);
        return match ? parseInt(match[1], 10) : null;
    }

    // ======================
    // Date Functions
    // ======================

    function getTodayDay() {
        return new Date().getDate();
    }

    function getTwoDaysAgo() {
        const now = new Date();
        const twoDaysAgo = new Date(now);
        twoDaysAgo.setDate(now.getDate() - 2);

        const year = twoDaysAgo.getFullYear();
        const month = String(twoDaysAgo.getMonth() + 1).padStart(2, '0');
        const day = String(twoDaysAgo.getDate()).padStart(2, '0');

        return `${year}/${month}/${day}`;
    }

    /**
     * Gets current week range (Monday to Sunday)
     * @return {Object} {start, end} date strings
     */
    function getCurrentWeekRange() {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Calculate Monday
        const monday = new Date(now);
        monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));

        // Calculate Sunday
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        // Format dates
        const format = d => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}/${month}/${day}`;
        };

        return {
            start: format(monday),
            end: format(sunday)
        };
    }

    // ======================
    // Observer Functions
    // ======================

    /**
     * Sets up pagination observer
     */
    function setupPaginationObserver() {
        const paginationContainer = document.querySelector('.el-pagination');
        if (!paginationContainer || paginationObserver) return;

        paginationObserver = new MutationObserver(() => {
            if (lastClipboardData?.reason && isInRechargeHistory) {
                setTimeout(() => {
                    highlightDuplicateRows(lastClipboardData.reason);
                }, 500);
            }
        });

        paginationObserver.observe(paginationContainer, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Cleans up pagination observer
     */
    function cleanupPaginationObserver() {
        if (paginationObserver) {
            paginationObserver.disconnect();
            paginationObserver = null;
        }
    }

    // ======================
    // Highlighting Functions
    // ======================

    /**
     * Highlights a table row
     * @param {Element} cell - Table cell element
     */
    function highlightRow(cell) {
        const row = cell.closest('.el-table__row');
        if (row) {
            row.style.backgroundColor = 'yellow';
        }
    }

    /**
     * Checks if reason is a weekly reason
     * @param {string} reason - Reason string
     * @return {boolean} True if weekly reason
     */
    function isWeeklyReason(reason) {
        return reason === "DTTUAN" ||
               reason.startsWith("DTTUAN") ||
               reason.includes("周流水");
    }

    /**
     * Handles date-based reason highlighting (UPDON, 晒单, 介绍, 抽奖, 红单)
     * @param {string} type - 'UPDON', '晒单', '介绍', '抽奖', '红单'
     * @param {NodeList} reasonCells - Reason cell elements
     * @param {NodeList} dateCells - Date cell elements
     * @param {number} clipDay - Day to match
     */
    function handleDateBasedReasons(type, reasonCells, dateCells, clipDay, twoDaysAgo) {
        reasonCells.forEach((cell, i) => {
            const cellReason = normalizeReason(cell.textContent).toUpperCase();
            const dateStr = dateCells[i]?.textContent.trim();
            const normalizedDate = dateStr.replace(/-/g, '/');

            // Skip if no date or too old
            if (!dateStr || normalizedDate < twoDaysAgo) return;

            // Extract day from cell reason if present
            let cellDay = extractDayFromReason(cellReason);

            // Get day from date string if not in reason
            if (cellDay === null) {
                const dateParts = normalizedDate.split('/');
                if (dateParts.length === 3) {
                    cellDay = parseInt(dateParts[2], 10);
                }
            }

            // Highlight if days match and reason contains type
            if (cellDay !== null && clipDay === cellDay && cellReason.includes(type)) {
                highlightRow(cell);
            }
        });
    }

    /**
     * Handles weekly reason highlighting
     * @param {NodeList} reasonCells - Reason cells
     * @param {NodeList} dateCells - Date cells
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
     * Handles normal reason highlighting
     * @param {NodeList} reasonCells - Reason cells
     * @param {string} normalizedClipReason - Normalized reason
     */
    function handleNormalReasons(reasonCells, normalizedClipReason) {
        reasonCells.forEach(cell => {
            const cellReason = normalizeReason(cell.textContent).toUpperCase();
            if (normalizedClipReason === cellReason) {
                highlightRow(cell);
            }
        });
    }

    /**
     * Resets all row highlighting
     */
    function resetHighlighting() {
        document.querySelectorAll('.el-table__row').forEach(row => {
            row.style.backgroundColor = '';
        });
    }

    /**
     * Highlights duplicate rows based on reason
     * @param {string} reason - Reason to match
     */
    function highlightDuplicateRows(reason) {
        if (!reason) return;

        const normalizedClipReason = normalizeReason(reason).toUpperCase();
        const todayDay = getTodayDay();
        const clipDay = extractDayFromReason(normalizedClipReason) ?? todayDay;
        const twoDaysAgo = getTwoDaysAgo();

        // Get all rows
        const rows = document.querySelectorAll('.el-table__row');
        const reasonCells = [];
        const dateCells = [];

        // Collect relevant cells
        rows.forEach(row => {
            const cells = row.querySelectorAll('.cell');
            if (cells.length >= 4) {
                reasonCells.push(cells[3]);
                dateCells.push(cells[0]);
            }
        });

        // Define all supported reason types
        const dateBasedReasons = ["UPDON", "晒单", "介绍", "抽奖", "红单"];

        // Check if clipboard reason matches any supported type
        const matchedType = dateBasedReasons.find(type =>
              normalizedClipReason.includes(type)
        );

        if (matchedType) {
            handleDateBasedReasons(
                matchedType,
                reasonCells,
                dateCells,
                clipDay,
                twoDaysAgo
            );
        }
        else if (isWeeklyReason(normalizedClipReason)) {
            handleWeeklyReasons(reasonCells, dateCells);
        }
        else {
            handleNormalReasons(reasonCells, normalizedClipReason);
        }

        // Setup pagination observer
        setupPaginationObserver();
    }

    // ======================
    // Event Handlers
    // ======================

    /**
     * Handles Alt+V keypress
     */
    async function handleAltV(event) {
        event.preventDefault();
        cleanupPaginationObserver();
        isInRechargeHistory = false;

        // Block if modal is active
        if (document.querySelector('.el-dialog__body')) {
            console.log('A modal is already active. Operation blocked.');
            return;
        }

        const clipboardData = await getClipboardData();
        lastClipboardData = clipboardData;
        if (!clipboardData) return;

        // Validate department
        const usernameText = document.querySelectorAll('.username-text');
        if (usernameText.length > 1 &&
            clipboardData.department.toLowerCase() !== usernameText[1].textContent.trim().toLowerCase()) {
            alert('WRONG DEPTARTMENT');
            return;
        }

        // Fill account name
        if (clipboardData.accountName) {
            const inputAcc = document.querySelectorAll('.el-input__inner')[4];
            inputAcc.value = clipboardData.accountName;
            inputAcc.dispatchEvent(new Event('input', { bubbles: true }));
        }

        const search = document.querySelector('.el-button.el-button--primary.el-button--medium');
        if (!search) return;
        search.click();

        const tableObserver = new MutationObserver(() => {
            const tableBody = document.querySelector('.el-table__body-wrapper');
            if (!tableBody) return;

            const details = document.querySelectorAll('.el-button.el-button--text')[0];
            const userNameElement = document.querySelectorAll('.user-name')[0];

            if (details && userNameElement &&
                userNameElement.textContent.trim().toLowerCase() === clipboardData.accountName.toLowerCase()) {

                details.click();
                tableObserver.disconnect();

                const detailsModalObs = new MutationObserver(() => {
                    const detailsModal = document.querySelector('.el-dialog__body');
                    if (!detailsModal) return;

                    detailsModalObs.disconnect();

                    const rechargeHistory = document.querySelectorAll('.member-title-item')[2];
                    if (!rechargeHistory) return;

                    rechargeHistory.click();
                    isInRechargeHistory = true;

                    const historyTableObserver = new MutationObserver((mutations, observer) => {
                        const tableBodies = document.querySelectorAll('.el-table__body-wrapper');
                        if (tableBodies.length <= 1) return;

                        const secondTableBody = tableBodies[1];
                        const hasDataRows = secondTableBody.querySelector('tr:not(.el-table__empty-block)');

                        if (hasDataRows) {
                            resetHighlighting()
                            highlightDuplicateRows(clipboardData.reason);
                            observer.disconnect();
                        }

                    });

                    historyTableObserver.observe(document.body, { childList: true, subtree: true });
                });

                detailsModalObs.observe(document.body, { childList: true, subtree: true });
            }
        });

        tableObserver.observe(document.body, { childList: true, subtree: true });
    }

    /**
     * Handles F2 keypress (代充)
     */
    async function handleF2(event) {
        event.preventDefault();

        // Block if modal is active
        if (document.querySelector('.el-form.form-view')) {
            console.log('A modal is already active. Operation blocked.');
            return;
        }

        const daichong = document.querySelector('.el-button.el-button--default.member-detail-creditup-button');
        if (!daichong) return;
        daichong.click();

        const clipboardData = await getClipboardData();
        if (!clipboardData?.amount) return;

        // Validate account name
        const sfpName = document.querySelector('.el-textarea__inner');
        if (sfpName && sfpName.value.trim().toLowerCase() !== clipboardData.accountName.toLowerCase()) {
            alert('IBANG ACCOUNT');
            return;
        }

        // Fill amount field
        const amount = document.querySelector('[placeholder="请输入代充金额"]');
        if (amount) {
            amount.value = clipboardData.amount;
            amount.dispatchEvent(new Event('input', { bubbles: true }));

            // Fill password field
            const passField = document.querySelector('[placeholder="请输入资金密码"]');
            if (passField) {
                passField.value = clipboardData.departValue;
                passField.dispatchEvent(new Event('input', { bubbles: true }));
            }

            // Fill reason field
            const reason = document.querySelector('[placeholder="最多15个字符"]');
            if (reason) {
                if (clipboardData.reason) {
                    reason.value = clipboardData.reason;
                    reason.dispatchEvent(new Event('input', { bubbles: true }));
                } else {
                    alert('CANT COPY REASON');
                }
            }
        }
    }

    /**
     * Handles F3 keypress (confirm)
     */
    function handleF3(event) {
        event.preventDefault();

        const primaryButton = document.querySelectorAll('.el-button.el-button--primary')[1];
        if (!primaryButton) return;
        primaryButton.click();

        const modalObserver = new MutationObserver(() => {
            const modal = document.querySelector('.transfer-dialog-content');
            if (!modal) return;

            modalObserver.disconnect();

            const confirmButton = document.querySelectorAll('.el-button.el-button--primary')[2];
            if (confirmButton) confirmButton.click();

            setTimeout(() => {
                const closeHistory = document.querySelector('.el-dialog__headerbtn');
                if (closeHistory) closeHistory.click();
            }, 1000);
        });

        modalObserver.observe(document.body, { childList: true, subtree: true });
    }

    /**
     * Handles click events (pagination and tabs)
     */
    function handleClick(event) {
        if (!lastClipboardData) return;

        const target = event.target;
        const isPrevBtn = target.closest('.btn-prev');
        const isNextBtn = target.closest('.btn-next');
        const isPageBtn = target.closest('.el-pager li');

        if (isPrevBtn || isNextBtn || isPageBtn) {
            setTimeout(() => {
                if (lastClipboardData?.reason && isInRechargeHistory) {
                    highlightDuplicateRows(lastClipboardData.reason);
                }
            }, 150);
        }
    }

    // ======================
    // Event Listeners
    // ======================
    document.addEventListener('keydown', async function(event) {
        if (event.altKey && event.key === 'v') {
            await handleAltV(event);
        }
        else if (event.key === 'F2') {
            await handleF2(event);
        }
        else if (event.key === 'F3') {
            handleF3(event);
        }
    });

    document.addEventListener('click', handleClick);
})();