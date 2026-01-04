// ==UserScript==
// @name         95598智能互动网站辅助工具
// @namespace    your-namespace
// @version      2.4
// @description  在95598智能互动网站的“日用电量查询”页面添加数据提取和复制按钮，优化零电量行处理。
// @author       lanseria
// @match        https://www.95598.cn/osgweb/electricityCharge*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483417/95598%E6%99%BA%E8%83%BD%E4%BA%92%E5%8A%A8%E7%BD%91%E7%AB%99%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/483417/95598%E6%99%BA%E8%83%BD%E4%BA%92%E5%8A%A8%E7%BD%91%E7%AB%99%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Constants and Configuration ---
    const SCRIPT_PREFIX = '[95598 Helper]'; // For console logs
    const CLICK_DELAY_MS = 200; // Delay after simulated click to allow content to load (used within extractExpandedRowData if needed)
    const ELEMENT_WAIT_TIMEOUT_MS = 10000; // Max time to wait for an element
    const ELEMENT_POLL_INTERVAL_MS = 200; // How often to check for an element

    // --- Global State ---
    let extractedData = []; // Stores the extracted table data

    // --- Utility Functions ---

    /**
     * Logs messages to the console with a script prefix.
     * @param {string} level - 'log', 'warn', 'error'
     * @param {...any} messages - Messages to log
     */
    function scriptLog(level, ...messages) {
        console[level](`${SCRIPT_PREFIX}`, ...messages);
    }

    /**
     * Simulates a mouse click on an element.
     * @param {HTMLElement} element - The element to click.
     */
    function simulateClick(element) {
        if (!element) {
            scriptLog('warn', 'simulateClick: Element is null or undefined.');
            return;
        }
        console.log(element);
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: unsafeWindow
        });
        element.dispatchEvent(event);
    }

    /**
     * Waits for a specific element to appear in the DOM.
     * @param {string} selector - The CSS selector for the element.
     * @param {HTMLElement} [parentElement=document] - The parent element to search within.
     * @param {number} [timeout=ELEMENT_WAIT_TIMEOUT_MS] - Maximum time to wait in milliseconds.
     * @returns {Promise<HTMLElement|null>} A promise that resolves with the element or null if timed out.
     */
    function waitForElement(selector, parentElement = document, timeout = ELEMENT_WAIT_TIMEOUT_MS) {
        return new Promise((resolve) => {
            let elapsedTime = 0;
            const interval = setInterval(() => {
                const element = parentElement.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                } else {
                    elapsedTime += ELEMENT_POLL_INTERVAL_MS;
                    if (elapsedTime >= timeout) {
                        clearInterval(interval);
                        scriptLog('warn', `Timeout waiting for element: ${selector}`);
                        resolve(null);
                    }
                }
            }, ELEMENT_POLL_INTERVAL_MS);
        });
    }

    /**
     * Simulates a click on an expandable row and extracts peak/valley electricity data.
     * @param {HTMLElement} clickableElement - The element within a row that triggers expansion.
     * @param {HTMLElement} tableBody - The tbody element containing the rows.
     * @param {number} rowIndex - The index of the current row (for logging).
     * @returns {Promise<{highNum: string, lowNum: string}>} Peak and valley electricity usage.
     */
    async function extractExpandedRowData(clickableElement, tableBody, rowIndex) {
        simulateClick(clickableElement);

        const expandedRow = await waitForElement(`tr.el-table__row.expanded`, tableBody, 2000);
        if (!expandedRow) {
            scriptLog('warn', `Row ${rowIndex + 1} did not expand or 'expanded' class not found.`);
            return { highNum: '0', lowNum: '0' };
        }

        const detailRow = expandedRow.nextElementSibling;
        if (!detailRow) {
            scriptLog('warn', `No detail row (nextElementSibling) found for expanded row ${rowIndex + 1}.`);
            // Attempt to collapse if expansion happened but details not found, to be safe
            simulateClick(clickableElement);
            await new Promise(resolve => setTimeout(resolve, 50));
            return { highNum: '0', lowNum: '0' };
        }

        const dataContainer = await waitForElement('td > div > div.drop-box-left', detailRow, 2000);
        if (!dataContainer) {
            scriptLog('warn', `Data container (drop-box-left) not found in detail row ${rowIndex + 1}.`);
            simulateClick(clickableElement); // Attempt to collapse
            await new Promise(resolve => setTimeout(resolve, 50));
            return { highNum: '0', lowNum: '0' };
        }

        const highEl = dataContainer.querySelector('p:nth-child(3) span.num');
        const highNum = highEl ? highEl.innerText.trim() : '0';

        const lowEl = dataContainer.querySelector('p:nth-child(1) span.num');
        const lowNum = lowEl ? lowEl.innerText.trim() : '0';

        // Collapse the row back
        simulateClick(clickableElement);
        await new Promise(resolve => setTimeout(resolve, 50)); // Small delay for UI to update

        return { highNum, lowNum };
    }


    /**
     * Creates a styled button.
     * @param {string} text - The button text.
     * @param {function} onClickAction - The function to execute on click.
     * @returns {HTMLButtonElement} The created button element.
     */
    function createUtilityButton(text, onClickAction) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.className = 'custom-script-button'; // For GM_addStyle
        button.addEventListener('click', onClickAction);
        return button;
    }

    /**
     * Copies the given text to the clipboard using GM_setClipboard or fallback.
     * @param {string} text - The text to copy.
     * @param {string} successMessage - Message to show on success.
     */
    async function copyToClipboard(text, successMessage = "已复制到粘贴板!") {
        if (!text && text !== "0") { // Allow copying "0"
            alert("没有内容可复制。");
            return;
        }
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(text, 'text');
            alert(successMessage);
            scriptLog('log', successMessage);
        } else {
            try {
                await navigator.clipboard.writeText(text);
                alert(successMessage);
                scriptLog('log', successMessage);
            } catch (err) {
                scriptLog('error', 'Failed to copy using navigator.clipboard:', err);
                const textarea = document.createElement("textarea");
                textarea.value = text;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand("copy");
                    alert(successMessage + " (using legacy method)");
                    scriptLog('log', successMessage + " (using legacy method)");
                } catch (e) {
                    alert("复制失败! 请检查浏览器权限或手动复制。");
                    scriptLog('error', "Failed to copy using execCommand:", e);
                }
                document.body.removeChild(textarea);
            }
        }
    }

    /**
     * Formats the extracted data into a CSV-like string for a specific column.
     * @param {number} columnIndex - 1: date, 2: highNum, 3: lowNum, 4: reading
     * @returns {string} The formatted string for the specified column.
     */
    function formatDataForCopy(columnIndex) {
        if (extractedData.length === 0) {
            alert("没有数据可复制。请先点击“提取数据”。");
            return "";
        }

        return extractedData.map(row => {
            switch (columnIndex) {
                case 1: return row.date;
                case 2: return row.highNum;
                case 3: return row.lowNum;
                case 4: return row.reading;
                default: return '';
            }
        }).join('\n');
    }

    // --- Main Actions ---

    /**
     * Handles the "提取数据" (Extract Data) button click.
     * Fetches data from the visible table.
     */
    async function handleExtractData() {
        const tableBody = await waitForElement('#pane-second .el-table__body-wrapper table tbody');
        if (!tableBody) {
            alert("未找到“日用电量”数据表格。请确保您在正确的页面，并且表格已加载。");
            scriptLog('warn', "Could not find the data table body.");
            return;
        }

        const rows = tableBody.querySelectorAll('tr.el-table__row');
        if (rows.length === 0) {
            alert("表格中没有数据。");
            scriptLog('warn', "No data rows found in the table.");
            return;
        }

        extractedData = [];
        scriptLog('log', `Found ${rows.length} rows. Starting data extraction...`);
        this.disabled = true;
        this.innerText = "提取中...";

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            let date = "", reading = "";

            const dateCell = row.querySelector('td:nth-child(1) div');
            date = dateCell ? dateCell.innerText.trim() : 'N/A';

            const readingCell = row.querySelector('td:nth-child(2) div');
            reading = readingCell ? readingCell.innerText.trim() : 'N/A';

            let peakValleyData = { highNum: '0', lowNum: '0' }; // Default values

            // --- OPTIMIZATION START ---
            // Convert reading to a number to reliably check for zero (e.g., "0", "0.0", "0.00")
            const numericReading = parseFloat(reading);

            if (numericReading === 0) {
                scriptLog('log', `Row ${i + 1} (${date}): Total reading is ${reading}. Skipping expansion for peak/valley.`);
                // peakValleyData already defaults to { highNum: '0', lowNum: '0' }
            } else {
                // Proceed to extract peak/valley data only if total reading is not 0 (or if reading is 'N/A')
                const expandableCellContent = row.querySelector('td:nth-child(3) div div');
                if (expandableCellContent) {
                    this.innerText = `提取中... (${i + 1}/${rows.length})`;
                    peakValleyData = await extractExpandedRowData(expandableCellContent, tableBody, i);
                } else {
                    scriptLog('warn', `Row ${i + 1} (${date}): No expandable element found. Peak/Valley set to default '0'.`);
                    // peakValleyData remains default { highNum: '0', lowNum: '0' }
                }
            }
            // --- OPTIMIZATION END ---

            extractedData.push({
                date,
                reading,
                lowNum: peakValleyData.lowNum,
                highNum: peakValleyData.highNum
            });
        }

        this.disabled = false;
        this.innerText = "提取数据";
        alert(`数据提取完成！共 ${extractedData.length} 条记录。`);
        scriptLog('log', "Data extraction complete:", extractedData);

        console.log("--- Extracted Data (JSON) ---");
        console.log(JSON.stringify(extractedData, null, 2));
        console.log("--- End of Extracted Data ---");
    }

    /**
     * Modifies the text content of a specific element on the page (e.g., for privacy).
     */
    async function modifySensitiveInfo() {
        const elementToModify = await waitForElement("#main > div > div:nth-child(1) > div > ul > div > li:nth-child(1) > span:nth-child(2)", document, 5000);
        if (elementToModify) {
            elementToModify.textContent = "**********";
            scriptLog('log', "Sensitive information placeholder updated.");
        } else {
            scriptLog('warn', "Element for sensitive info modification not found.");
        }
    }


    /**
     * Initializes the script: adds buttons and styles.
     */
    async function initializeScript() {
        scriptLog('log', 'Script loading...');

        GM_addStyle(`
            .custom-script-button {
                background-color: #4CAF50; /* Green */
                border: none;
                color: white;
                padding: 8px 12px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 14px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 4px;
            }
            .custom-script-button:hover {
                background-color: #45a049;
            }
            .custom-script-button:disabled {
                background-color: #cccccc;
                cursor: not-allowed;
            }
            .custom-script-button-container {
                margin-bottom: 10px;
                padding: 5px;
                border: 1px solid #ddd;
                background-color: #f9f9f9;
                border-radius: 4px;
            }
        `);

        const targetInsertionPoint = await waitForElement("#app .right-header h3, #app .right-header .title");

        if (!targetInsertionPoint) {
            scriptLog('error', "Could not find a suitable place to add buttons. Script will not fully initialize.");
            return;
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'custom-script-button-container';

        const extractButton = createUtilityButton('提取数据', handleExtractData);
        const copyDateButton = createUtilityButton('复制日期', () => copyToClipboard(formatDataForCopy(1), "日期已复制!"));
        const copyHighButton = createUtilityButton('复制峰电', () => copyToClipboard(formatDataForCopy(2), "峰电量已复制!"));
        const copyLowButton = createUtilityButton('复制谷电', () => copyToClipboard(formatDataForCopy(3), "谷电量已复制!"));
        const copyTotalButton = createUtilityButton('复制总电', () => copyToClipboard(formatDataForCopy(4), "总电量已复制!"));

        buttonContainer.appendChild(extractButton);
        buttonContainer.appendChild(copyDateButton);
        buttonContainer.appendChild(copyHighButton);
        buttonContainer.appendChild(copyLowButton);
        buttonContainer.appendChild(copyTotalButton);

        targetInsertionPoint.parentNode.insertBefore(buttonContainer, targetInsertionPoint.nextSibling);
        scriptLog('log', "Utility buttons added to the page.");

        modifySensitiveInfo();

        scriptLog('log', 'Script initialized successfully.');
    }

    // --- Script Entry Point ---
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeScript();
    } else {
        window.addEventListener('load', initializeScript);
    }

})();