// ==UserScript==
// @name         Settle Up Utilities
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Allow quick clone group and export of transactions and debts
// @author       Your Name
// @match        *://settleup.app/group/*/*
// @grant        GM_addStyle
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538423/Settle%20Up%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/538423/Settle%20Up%20Utilities.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElementAndCondition(baseSelector, conditionFn, timeout = 7000, parent = document) {
        return new Promise((resolve, reject) => {
            const intervalTime = 100; // Check every 100ms
            let elapsedTime = 0;

            const interval = setInterval(() => {
                const elements = parent.querySelectorAll(baseSelector);
                let foundElement = null;

                for (const el of elements) {
                    if (conditionFn(el)) {
                        // Check for visibility: element must be rendered and have dimensions
                        const style = window.getComputedStyle(el);
                        if (style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && el.offsetHeight > 0 && el.offsetWidth > 0) {
                           foundElement = el;
                           break;
                        } else {
                            // Element matches condition but is not yet visible, continue waiting
                            // console.log(`Element found by condition but not yet visible: `, el.outerHTML.substring(0, 100));
                        }
                    }
                }

                if (foundElement) {
                    clearInterval(interval);
                    resolve(foundElement);
                } else {
                    elapsedTime += intervalTime;
                    if (elapsedTime >= timeout) {
                        clearInterval(interval);
                        reject(new Error(`Timeout: Element matching selector "${baseSelector}" and condition not found or not visible within ${timeout}ms.`));
                    }
                }
            }, intervalTime);
        });
    }

    function findMoreButton() {
        console.log('Searching for "More" button...');
        // Option 1: Using the 'more-button' class if it's specific enough
        let moreButton = document.querySelector('button.mat-mdc-menu-trigger.more-button');
        if (moreButton) {
            console.log('Found "More" button with class "more-button":', moreButton);
            return moreButton;
        }

        // Option 2: More general search by text and icon
        const allButtons = document.querySelectorAll('button');
        for (const btn of allButtons) {
            const labelSpan = btn.querySelector('span.mdc-button__label');
            const icon = btn.querySelector('mat-icon');
            if (labelSpan && labelSpan.textContent.trim().toLowerCase() === 'more' &&
                icon && icon.textContent.trim() === 'more_vert') {
                console.log('Found "More" button by text and icon:', btn);
                return btn;
            }
            // Fallback for buttons where "More" might not be in a specific span.mdc-button__label
            if (btn.textContent.toLowerCase().includes('more') && icon && icon.textContent.trim() === 'more_vert') {
                 console.log('Found "More" button by general text content and icon:', btn);
                 return btn;
            }
        }
        console.log('"More" button not found.');
        return null;
    }

    async function performFullTransactionsExportSequence() {
        console.log('Starting full export sequence...');

        // --- 1. Find and click "More" button ---
        const moreButton = findMoreButton();
        if (!moreButton) {
            alert('Could not find the "More" button on the page.');
            return;
        }
        if (moreButton.disabled || moreButton.getAttribute('aria-disabled') === 'true') {
            alert('The "More" button is currently disabled.');
            return;
        }
        moreButton.click();
        console.log('Clicked "More" button.');

        // --- 2. Wait for and click "Export group" button ---
        // HTML: <button ... class="mat-mdc-menu-item mat-mdc-menu-item-submenu-trigger ..."><mat-icon>get_app</mat-icon><span class="mat-mdc-menu-item-text"><span>Export group</span></span>...</button>
        try {
            console.log('Waiting for "Export group" button...');
            const exportGroupButton = await waitForElementAndCondition(
                'button.mat-mdc-menu-item', // Base selector for menu items
                (btn) => { // Condition function
                    const textSpan = btn.querySelector('span.mat-mdc-menu-item-text > span');
                    const icon = btn.querySelector('mat-icon');
                    return textSpan && textSpan.textContent.trim().toLowerCase() === 'export group' &&
                           icon && icon.textContent.trim() === 'get_app';
                }
            );
            console.log('"Export group" button found:', exportGroupButton);
            if (exportGroupButton.disabled || exportGroupButton.getAttribute('aria-disabled') === 'true') {
                 alert('"Export group" button is currently disabled.');
                 return;
            }
            exportGroupButton.click();
            console.log('Clicked "Export group" button.');

        } catch (error) {
            console.log('Error finding or clicking "Export group" button:', error);
            alert('Could not find or click the "Export group" button. Ensure the "More" menu opened correctly.\nDetails: ' + error.message);
            return;
        }

        // --- 3. Wait for and click "CSV file (.csv)" button ---
        // HTML: <button ... class="mat-mdc-menu-item ..."><span class="mat-mdc-menu-item-text"><div><img ... src="assets/files/csv.svg"><span ...>CSV file (.csv)</span></div></span>...</button>
        try {
            console.log('Waiting for "CSV file (.csv)" button...');
            const csvButton = await waitForElementAndCondition(
                'button.mat-mdc-menu-item', // Base selector for menu items
                (btn) => { // Condition function
                    const textSpan = btn.querySelector('span.mat-mdc-menu-item-text div > span'); // Note the 'div > span'
                    const imgIcon = btn.querySelector('img.file-menu-icon[src="assets/files/csv.svg"]');
                    return textSpan && textSpan.textContent.trim().toLowerCase() === 'csv file (.csv)' && imgIcon;
                }
            );
            console.log('"CSV file (.csv)" button found:', csvButton);
            if (csvButton.disabled || csvButton.getAttribute('aria-disabled') === 'true') {
                 alert('"CSV file (.csv)" button is currently disabled.');
                 return;
            }
            csvButton.click();
            console.log('Clicked "CSV file (.csv)" button.');

        } catch (error) {
            console.log('Error finding or clicking "CSV file (.csv)" button:', error);
            alert('Could not find or click the "CSV file (.csv)" button. Ensure the "Export group" submenu opened correctly.\nDetails: ' + error.message);
        }
    }

    function createTransactionsExportButton() {
        // --- Create and add the Helper Button to the page ---
        const button = document.createElement('button');
        button.textContent = 'Export Transactions';
        button.id = 'transactionsExportButton';
        button.addEventListener('click', performFullTransactionsExportSequence);

        GM_addStyle(`
            #transactionsExportButton {
                position: fixed;
                bottom: 26%;
                right: 10px;
                z-index: 9999;
                padding: 10px 15px;
                background-color: #424242;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
            }
            #transactionsExportButton:hover {
                background-color: #4a4a4a;
            }
        `);
        document.body.appendChild(button);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to extract data and generate CSV
    async function extractDebtsData() {

        // --- 1. Find and click "Debts" tab ---
        const tabs = document.querySelectorAll('span.mdc-tab__text-label');
        let foundAndClicked = false;
        tabs.forEach(tab => {
            if (tab.textContent && tab.textContent.toLowerCase().includes('debts')) {
                console.log('Found "Debts" tab, clicking:', tab);
                tab.click();
                foundAndClicked = true;
            }
        });
        if (!foundAndClicked) {
            console.log('Could not find an span containing "Debts".');
            alert('Could not find "Debts" tab.');
            return;
        } else {
            // Delay for content to load
            await delay(3000);
        }

        console.log('Attempting to extract data...');
        const items = document.querySelectorAll('button.mat-mdc-list-item.mdc-list-item--with-two-lines');
        if (items.length === 0) {
            alert('No debt items found. Make sure the "Debts" section is expanded and items are visible.');
            return;
        }

        const csvData = [];
        // Add CSV Header
        csvData.push(['Con nợ', '', 'Chủ nợ', 'Nhiêu tiền']);

        items.forEach(item => {
            try {
                const fromNameElement = item.querySelector('.mat-list-item-content span.title');
                const amountElement = item.querySelector('.mat-list-item-content .who strong.amount');
                const toNameElement = item.querySelector('.for-whom > div:first-child'); // Direct child div of .for-whom

                const fromName = fromNameElement ? fromNameElement.textContent.trim() : 'N/A';
                let amount = amountElement ? amountElement.textContent.trim() : 'N/A';
                const toName = toNameElement ? toNameElement.textContent.trim() : 'N/A';

                // Clean up amount (remove currency symbols like ₫ or others, keep numbers and decimal/comma)
                if (amount !== 'N/A') {
                    amount = amount.replace(/[^\d.,]/g, '').trim();
                }

                // Only add row if we have some meaningful data
                if (fromName !== 'N/A' || toName !== 'N/A' || amount !== 'N/A') {
                     csvData.push([fromName, '→', toName, amount]);
                } else {
                    console.warn('Skipping item due to missing data:', item);
                }

            } catch (e) {
                console.error('Error processing an item:', item, e);
            }
        });

        if (csvData.length <= 1) { // Only header
            alert('No data extracted. Check console for errors or if items structure matches.');
            return;
        }

        // Convert to CSV string
        let csvString = csvData.map(row =>
            row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',') // Semicolon separated, handles quotes
        ).join('\n');

        csvString = '\uFEFF' + csvString;

        console.log('CSV Data (with BOM prepended):\n', csvString); // Optional: update log message

        // Trigger download
        const filename = 'debts_data.csv';
        if (typeof GM_download !== "undefined") {
            GM_download({
                url: 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString),
                name: filename,
                saveAs: true, // Prompts user for save location
                onerror: (err) => console.error('GM_download error:', err)
            });
        } else {
            // Fallback for browsers without GM_download (e.g. Violentmonkey or if grant is missing)
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
        alert('Debt data extraction complete. Download should start.');
    }

    // Create a button to trigger extraction
    function createDebtsExtractionButton() {
        const button = document.createElement('button');
        button.textContent = 'Export Debts';
        button.id = 'extractDebtsBtn';
        button.addEventListener('click', extractDebtsData);

        GM_addStyle(`
            #extractDebtsBtn {
                position: fixed;
                bottom: 19%;
                right: 10px;
                z-index: 9999;
                padding: 10px 15px;
                background-color: #424242;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
            }
            #extractDebtsBtn:hover {
                background-color: #4a4a4a;
            }
        `);
        document.body.appendChild(button);
    };

    function getActiveInputFieldValue(selector) {
        if (!selector || typeof selector !== 'string') {
            console.error("Error: A valid CSS selector string must be provided.");
            return null;
        }

        const inputElement = document.querySelector(selector);

        if (inputElement) {
            // Check if it's an input or textarea, as they have a 'value' property
            if (inputElement.tagName.toLowerCase() === 'input' || inputElement.tagName.toLowerCase() === 'textarea') {
                return inputElement.value;
            } else {
                console.warn(`Element found with selector "${selector}", but it's not an <input> or <textarea> element. It's a <${inputElement.tagName.toLowerCase()}>.`);
                return null;
            }
        } else {
            console.warn(`Input element with selector "${selector}" not found on the page.`);
            return null;
        }
    }

    function waitForElementPresence(baseSelector, conditionFn, timeout = 10000, parent = document) {
        return new Promise((resolve, reject) => {
            const intervalTime = 100; // Check every 100ms
            let elapsedTime = 0;

            const interval = setInterval(() => {
                const elements = parent.querySelectorAll(baseSelector);
                let foundElement = null;

                for (const el of elements) {
                    if (conditionFn(el)) {
                        // Check for visibility: element must be rendered and have dimensions
                        const style = window.getComputedStyle(el);
                        if (style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && el.offsetHeight > 0 && el.offsetWidth > 0) {
                           foundElement = el;
                           break;
                        }
                        // Optionally, log if an element matches condition but isn't visible yet
                        // console.log('Element matches condition but not yet visible:', el);
                    }
                }

                if (foundElement) {
                    clearInterval(interval);
                    resolve(foundElement);
                } else {
                    elapsedTime += intervalTime;
                    if (elapsedTime >= timeout) {
                        clearInterval(interval);
                        reject(new Error(`Timeout: Element matching selector "${baseSelector}" and condition not found or not visible within ${timeout}ms.`));
                    }
                }
            }, intervalTime);
        });
    }

    async function waitForSpecificH1(targetValue, timeout = 15000) {
        console.log(`Waiting for H1 element with title="${targetValue}" and text="${targetValue}"...`);
        try {
            const h1Element = await waitForElementPresence(
                'h1', // Base selector: find <h1> elements
                (el) => { // Condition function to identify the specific H1
                    const elTitle = el.getAttribute('title');
                    const elText = el.textContent.trim(); // .textContent handles inner HTML/comments correctly for this case

                    // console.log(`Checking H1: title="${elTitle}", text="${elText}"`); // For debugging
                    return elTitle === targetValue && elText === targetValue;
                },
                timeout // Pass the timeout to the utility function
            );
            console.log('Found the specific H1 element:', h1Element);
            return h1Element;
        } catch (error) {
            console.error('Failed to find the specific H1 element:', error.message);
            throw error; // Re-throw so the caller can handle it if needed
        }
    }

    function renameGroupInputWithIncrementedMonth(selector) {
        if (!selector || typeof selector !== 'string') {
            console.error("Error: A valid CSS selector string must be provided.");
            return false;
        }

        const inputElement = document.querySelector(selector);

        if (!inputElement) {
            console.warn(`Input element with selector "${selector}" not found.`);
            return false;
        }

        if (inputElement.tagName.toLowerCase() !== 'input' && inputElement.tagName.toLowerCase() !== 'textarea') {
            console.warn(`Element found with selector "${selector}" is not an <input> or <textarea>.`);
            return false;
        }

        let currentValue = inputElement.value;
        console.log(`Current value: "${currentValue}"`);
        // clean currentValue
        currentValue = currentValue.replaceAll('(copy)', '').trim();

        // Regex to capture:
        // 1. The prefix text (e.g., "Test") - non-greedy
        // 2. The year (YYYY)
        // 3. The month (MM or M)
        // It assumes a space or other non-digit/non-slash characters separate the prefix from the date.
        const regex = /^(.*?)\s*(\d{4})\/(\d{1,2})$/;
        const match = currentValue.match(regex);

        if (!match) {
            console.error(`Value "${currentValue}" does not match expected format "Prefix YYYY/MM". Example: "Test 2025/06"`);
            return false;
        }

        const prefix = match[1].trim(); // The text part like "Test"
        const year = parseInt(match[2], 10);
        const month = parseInt(match[3], 10); // 1-indexed month (e.g., 6 for June)

        // JavaScript Date months are 0-indexed (0 for January, 11 for December)
        // Create a date object for the first day of the current month
        const date = new Date(year, month - 1, 1);

        // Add one month
        date.setMonth(date.getMonth() + 1);

        // Get the new year and month
        const newYear = date.getFullYear();
        // getMonth() is 0-indexed, so add 1. Pad with '0' if it's a single digit.
        const newMonth = (date.getMonth() + 1).toString().padStart(2, '0');

        // Construct the new value
        const newValue = `${prefix} ${newYear}/${newMonth}`;
        console.log(`New value will be: "${newValue}"`);

        // Clear the input (optional, as setting .value overwrites)
        // inputElement.value = '';
        // You might need to dispatch an 'input' event here if clearing alone needs to be registered by Angular
        // inputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));


        // Set the new value
        inputElement.value = newValue;

        // --- CRITICAL FOR ANGULAR (and other frameworks) ---
        // Programmatically changing the value of an input field doesn't
        // automatically trigger the events that Angular's form controls listen to.
        // We need to dispatch 'input' and 'change' events manually.

        // Dispatch an 'input' event (simulates user typing)
        inputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

        // Dispatch a 'change' event (simulates user committing the change, e.g., by blurring)
        inputElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

        // Optional: If Angular also listens to blur for updates/validation, you might dispatch it too
        // inputElement.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));

        console.log(`Input field "${selector}" successfully updated to "${newValue}".`);
        return true;
    }

    async function renameNewGroup() {
        // --- 1. Find and click "More" button ---
        const moreButton = findMoreButton();
        if (!moreButton) {
            alert('Could not find the "More" button on the page.');
            return;
        }
        if (moreButton.disabled || moreButton.getAttribute('aria-disabled') === 'true') {
            alert('The "More" button is currently disabled.');
            return;
        }
        moreButton.click();
        console.log('Clicked "More" button.');

        // --- 2. Wait for and click "Group settings" button ---
        // HTML: <button ... class="mat-mdc-menu-item mat-mdc-menu-item-submenu-trigger ..."><mat-icon>settings</mat-icon><span class="mat-mdc-menu-item-text"><span>Group settingss</span></span></button>
        try {
            console.log('Waiting for "Group settings" button...');
            const groupSettingsButton = await waitForElementAndCondition(
                'button.mat-mdc-menu-item', // Base selector for menu items
                (btn) => { // Condition function
                    const textSpan = btn.querySelector('span.mat-mdc-menu-item-text > span');
                    const icon = btn.querySelector('mat-icon');
                    return textSpan && textSpan.textContent.trim().toLowerCase() === 'group settings' &&
                           icon && icon.textContent.trim() === 'settings';
                }
            );
            console.log('"Group settings" button found:', groupSettingsButton);
            if (groupSettingsButton.disabled || groupSettingsButton.getAttribute('aria-disabled') === 'true') {
                 alert('"Group settings" button is currently disabled.');
                 return;
            }
            groupSettingsButton.click();
            console.log('Clicked "Group settings" button.');

        } catch (error) {
            console.log('Error finding or clicking "Group settings" button:', error);
            alert('Could not find or click the "Group settings" button. Ensure the "More" menu opened correctly.\nDetails: ' + error.message);
            return;
        }

        // --- 3. Update group title
        await delay(500);
        renameGroupInputWithIncrementedMonth('input[placeholder="Enter name of the group"]');
        await delay(500);

        // --- 4. Wait for and click "Save" button ---
        // HTML: <button ... class="save-button mdc-button mat-mdc-raised-button mat-primary mat-mdc-button-base ..."><span class="mdc-button__label ...""> Start group </span>...</button>
        try {
            console.log('Waiting for "Save" button...');
            const saveBtn = await waitForElementAndCondition(
                'button.save-button.mdc-button.mat-mdc-raised-button.mat-primary.mat-mdc-button-base', // Base selector for button
                (btn) => { // Condition function
                    const textSpan = btn.querySelector('span.mdc-button__label');
                    return textSpan && textSpan.textContent.trim().toLowerCase() === 'save';
                }
            );
            console.log('"Save" button found:', saveBtn);
            if (saveBtn.disabled || saveBtn.getAttribute('aria-disabled') === 'true') {
                 alert('"Save" button is currently disabled.');
                 return;
            }
            saveBtn.click();
            console.log('Clicked "Save" button.');
        } catch (error) {
            console.log('Error finding or clicking "Save" button:', error);
            alert('Could not find or click the "Save" button. Ensure the "Group settings" submenu opened correctly.\nDetails: ' + error.message);
        }
    }

    async function performFullCloneGroupSequence() {
        console.log('Starting new group sequence...');

        // --- 1. Find and click "More" button ---
        const moreButton = findMoreButton();
        if (!moreButton) {
            alert('Could not find the "More" button on the page.');
            return;
        }
        if (moreButton.disabled || moreButton.getAttribute('aria-disabled') === 'true') {
            alert('The "More" button is currently disabled.');
            return;
        }
        moreButton.click();
        console.log('Clicked "More" button.');

        // --- 2. Wait for and click "Group settings" button ---
        // HTML: <button ... class="mat-mdc-menu-item mat-mdc-menu-item-submenu-trigger ..."><mat-icon>settings</mat-icon><span class="mat-mdc-menu-item-text"><span>Group settingss</span></span></button>
        try {
            console.log('Waiting for "Group settings" button...');
            const groupSettingsButton = await waitForElementAndCondition(
                'button.mat-mdc-menu-item', // Base selector for menu items
                (btn) => { // Condition function
                    const textSpan = btn.querySelector('span.mat-mdc-menu-item-text > span');
                    const icon = btn.querySelector('mat-icon');
                    return textSpan && textSpan.textContent.trim().toLowerCase() === 'group settings' &&
                           icon && icon.textContent.trim() === 'settings';
                }
            );
            console.log('"Group settings" button found:', groupSettingsButton);
            if (groupSettingsButton.disabled || groupSettingsButton.getAttribute('aria-disabled') === 'true') {
                 alert('"Group settings" button is currently disabled.');
                 return;
            }
            groupSettingsButton.click();
            console.log('Clicked "Group settings" button.');

        } catch (error) {
            console.log('Error finding or clicking "Group settings" button:', error);
            alert('Could not find or click the "Group settings" button. Ensure the "More" menu opened correctly.\nDetails: ' + error.message);
            return;
        }

        // --- 2.5 Get the current group title
        const currentGroupTitle = getActiveInputFieldValue('input[placeholder="Enter name of the group"]');
        if (currentGroupTitle !== null) {
            console.log('Value using placeholder "Enter name of the group":', currentGroupTitle);
        }

        // --- 3. Wait for and click "Start a similar group" button ---
        // HTML: <button ... class="mdc-button mat-mdc-button mat-primary mat-mdc-button-base ..."><span class="mdc-button__label ...""> Start a similar group </span>...</button>
        try {
            console.log('Waiting for "Start a similar group" button...');
            const cloneGroupBtn = await waitForElementAndCondition(
                'button.mdc-button.mat-mdc-button.mat-primary.mat-mdc-button-base', // Base selector for button
                (btn) => { // Condition function
                    const textSpan = btn.querySelector('span.mdc-button__label');
                    return textSpan && textSpan.textContent.trim().toLowerCase() === 'start a similar group';
                }
            );
            console.log('"Start a similar group" button found:', cloneGroupBtn);
            if (cloneGroupBtn.disabled || cloneGroupBtn.getAttribute('aria-disabled') === 'true') {
                 alert('"Start a similar group" button is currently disabled.');
                 return;
            }
            cloneGroupBtn.click();
            console.log('Clicked "Start a similar group" button.');
        } catch (error) {
            console.log('Error finding or clicking "Start a similar group" button:', error);
            alert('Could not find or click the "Start a similar group" button. Ensure the "Group settings" submenu opened correctly.\nDetails: ' + error.message);
        }

        // --- 4. Wait for and click "Start group" button ---
        // HTML: <button ... class="save-button mdc-button mat-mdc-raised-button mat-primary mat-mdc-button-base ..."><span class="mdc-button__label ...""> Start group </span>...</button>
        try {
            console.log('Waiting for "Start group" button...');
            const confirmCloneBtn = await waitForElementAndCondition(
                'button.save-button.mdc-button.mat-mdc-raised-button.mat-primary.mat-mdc-button-base', // Base selector for button
                (btn) => { // Condition function
                    const textSpan = btn.querySelector('span.mdc-button__label');
                    return textSpan && textSpan.textContent.trim().toLowerCase() === 'start group';
                }
            );
            console.log('"Start group" button found:', confirmCloneBtn);
            if (confirmCloneBtn.disabled || confirmCloneBtn.getAttribute('aria-disabled') === 'true') {
                 alert('"Start group" button is currently disabled.');
                 return;
            }
            confirmCloneBtn.click();
            console.log('Clicked "Start group" button.');
        } catch (error) {
            console.log('Error finding or clicking "Start group" button:', error);
            alert('Could not find or click the "Start group" button. Ensure the "Group settings" submenu opened correctly.\nDetails: ' + error.message);
        }

        // --- 4.5 Wait for new group to be created
        await waitForSpecificH1(`${currentGroupTitle} (copy)`)

        await renameNewGroup();
    }

    function createDuplicateGroupButton() {
        const button = document.createElement('button');
        button.textContent = '⚡Clone group⚡';
        button.id = 'cloneGroupBtn';
        button.addEventListener('click', performFullCloneGroupSequence);

        GM_addStyle(`
            #cloneGroupBtn {
                position: fixed;
                bottom: 12%;
                right: 10px;
                z-index: 9999;
                padding: 10px 15px;
                background-color: #682a08;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
            }
            #cloneGroupBtn:hover {
                background-color: #6d310c;
            }
        `);
        document.body.appendChild(button);
    }

    // Add the buttons to the page
    window.addEventListener('load', function() {
        createDebtsExtractionButton();
        createTransactionsExportButton();
        createDuplicateGroupButton();
    }, false);

})();