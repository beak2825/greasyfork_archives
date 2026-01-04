

// ==UserScript==
// @name         Ariba Order Number Auto-Fill Enhanced
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Auto-fill multiple order numbers at once, highlight lines with PO verification, update delivery dates with batch processing, skip date update if matching but simulate change to check checkbox, robust sequential page processing without looping
// @author       You
// @match        https://portal.us.bn.cloud.ariba.com/workbench/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541414/Ariba%20Order%20Number%20Auto-Fill%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/541414/Ariba%20Order%20Number%20Auto-Fill%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isVisible = true;
    let delaySpeed = 1000; // Default general delay in milliseconds
    let applyButtonDelay = 5000; // Default Apply button delay in milliseconds

    // Create draggable debug panel
    function createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'ariba-debug-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            width: 320px;
            max-height: 500px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 12px;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 12px;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            cursor: move;
            user-select: none;
            transition: all 0.3s ease;
        `;

        panel.innerHTML = `
            <div id="panel-header" style="
                background: rgba(255,255,255,0.1);
                padding: 12px;
                border-radius: 12px 12px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                backdrop-filter: blur(10px);
            ">
                <div style="color: white; font-weight: bold; font-size: 14px;">
                    🔧 Ariba Auto-Fill Enhanced
                </div>
                <div style="display: flex; gap: 8px;">
                    <button id="toggle-visibility" style="
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        width: 24px;
                        height: 24px;
                        border-radius: 6px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                    ">−</button>
                    <button id="clear-debug" style="
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        width: 24px;
                        height: 24px;
                        border-radius: 6px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                    ">🗑</button>
                </div>
            </div>
            <div id="panel-content" style="
                background: white;
                margin: 0;
                border-radius: 0 0 12px 12px;
                overflow: hidden;
            ">
                <div id="debug-content" style="
                    max-height: 200px;
                    overflow-y: auto;
                    padding: 10px;
                    background: #f8f9fa;
                "></div>
                <div style="padding: 15px; border-top: 1px solid #e9ecef;">
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333;">
                            ⚡ General Delay (ms):
                        </label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="range" id="delay-slider" min="100" max="3000" value="1000"
                                   style="flex: 1; height: 4px; background: #ddd; border-radius: 2px;">
                            <span id="delay-value" style="
                                background: #007bff;
                                color: white;
                                padding: 2px 8px;
                                border-radius: 12px;
                                font-size: 11px;
                                min-width: 45px;
                                text-align: center;
                            ">1000</span>
                        </div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333;">
                            ⏳ Apply Button Delay (ms):
                        </label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="range" id="apply-delay-slider" min="1000" max="10000" value="5000"
                                   style="flex: 1; height: 4px; background: #ddd; border-radius: 2px;">
                            <span id="apply-delay-value" style="
                                background: #007bff;
                                color: white;
                                padding: 2px 8px;
                                border-radius: 12px;
                                font-size: 11px;
                                min-width: 45px;
                                text-align: center;
                            ">5000</span>
                        </div>
                    </div>
                    <div style="font-weight: bold; margin-bottom: 8px; color: #333;">📋 Paste & Process:</div>
                    <textarea id="paste-input" placeholder="Paste: MM/DD/YYYY ORDERNUM/LINE/SEQ (one per line)"
                             style="
                                width: 100%;
                                height: 60px;
                                font-size: 11px;
                                border: 2px solid #e9ecef;
                                border-radius: 8px;
                                padding: 8px;
                                resize: vertical;
                                font-family: monospace;
                                box-sizing: border-box;
                             "></textarea>
                    <button id="process-btn" style="
                        width: 100%;
                        margin-top: 10px;
                        padding: 10px;
                        background: linear-gradient(135deg, #28a745, #20c997);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 12px;
                        transition: all 0.2s ease;
                    ">🚀 Process & Apply</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        makeDraggable(panel);
        return panel;
    }

    // Make panel draggable
    function makeDraggable(panel) {
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        let xOffset = 0, yOffset = 0;

        const header = panel.querySelector('#panel-header');

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target.tagName === 'BUTTON') return;

            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
                panel.style.cursor = 'grabbing';
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                panel.style.transform = `translate(${currentX}px, ${currentY}px)`;
                panel.style.right = 'auto';
                panel.style.top = 'auto';
                panel.style.left = '0';
            }
        }

        function dragEnd() {
            if (isDragging) {
                isDragging = false;
                panel.style.cursor = 'move';
            }
        }
    }

    // Log debug messages
    function debugLog(message, type = 'info') {
        const debugContent = document.getElementById('debug-content');
        if (!debugContent) return;

        const timestamp = new Date().toLocaleTimeString('en-US', { timeZone: 'Europe/Paris' });
        const colors = {
            info: '#6c757d',
            success: '#28a745',
            error: '#dc3545',
            warning: '#fd7e14'
        };

        const icons = {
            info: 'ℹ️',
            success: '✅',
            error: '❌',
            warning: '⚠️'
        };

        const logEntry = document.createElement('div');
        logEntry.style.cssText = `
            margin-bottom: 6px;
            padding: 6px 8px;
            border-left: 3px solid ${colors[type]};
            background: ${type === 'error' ? '#fff5f5' : type === 'success' ? '#f0fff4' : type === 'warning' ? '#fff8f0' : '#f8f9fa'};
            font-size: 11px;
            border-radius: 4px;
            line-height: 1.4;
        `;
        logEntry.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 6px;">
                <span style="font-size: 10px;">${icons[type]}</span>
                <div style="flex: 1;">
                    <span style="color: #999; font-size: 10px;">[${timestamp}]</span>
                    <div style="color: ${colors[type]}; font-weight: ${type === 'error' ? 'bold' : 'normal'};">${message}</div>
                </div>
            </div>
        `;

        debugContent.appendChild(logEntry);
        debugContent.scrollTop = debugContent.scrollHeight;
    }

    // Parse multiple lines of input
    function parseBatchInput(input) {
        debugLog('Parsing batch input...');
        const lines = input.trim().split('\n');
        const orders = new Map(); // Map to store unique order numbers and their lines

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            debugLog(`Parsing line: "${line}"`);

            // Parse date and order number pattern
            const match = line.match(/^(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d{6,})(?:\/(\d+)(?:\/(\d+))?)?/);
            if (!match) {
                debugLog(`Invalid line format: ${line}`, 'error');
                continue;
            }

            const [, deliveryDate, orderNumber, lineNumber, sequenceNumber] = match;
            const formattedOrderNumber = orderNumber.padStart(10, '0');

            // Initialize order if not exists
            if (!orders.has(formattedOrderNumber)) {
                orders.set(formattedOrderNumber, {
                    orderNumber: formattedOrderNumber,
                    lines: []
                });
            }

            // Add line details
            if (lineNumber) {
                orders.get(formattedOrderNumber).lines.push({
                    deliveryDate,
                    lineNumber,
                    sequenceNumber
                });
                debugLog(`Added line ${lineNumber} for order ${formattedOrderNumber}`, 'success');
            }

            debugLog(`Extracted: Date=${deliveryDate}, Order=${formattedOrderNumber}, Line=${lineNumber || 'N/A'}, Seq=${sequenceNumber || 'N/A'}`, 'success');
        }

        return Array.from(orders.values());
    }

    // Wait for element with timeout
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                debugLog(`Element found: ${selector}`, 'success');
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    debugLog(`Element found after mutation: ${selector}`, 'success');
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                debugLog(`Timeout waiting for ${selector}`, 'error');
                reject(new Error(`Timeout waiting for ${selector}`));
            }, timeout);
        });
    }

    // Clear the tokenizer input
    async function clearTokenizerInput(inputElement) {
        try {
            debugLog('Clearing existing tokens...');
            const tokenContainer = inputElement.closest('.fd-tokenizer');
            if (tokenContainer) {
                const tokens = tokenContainer.querySelectorAll('.fd-token');
                for (let token of tokens) {
                    const removeButton = token.querySelector('.fd-token__close');
                    if (removeButton) {
                        removeButton.click();
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }
            }
            inputElement.value = '';
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            debugLog('Tokenizer cleared successfully', 'success');
            return true;
        } catch (error) {
            debugLog(`Error clearing tokenizer: ${error.message}`, 'error');
            return false;
        }
    }

    // Fill the tokenizer input with multiple order numbers
    async function fillOrderNumbers(orderNumbers) {
        try {
            debugLog(`Looking for Order numbers tokenizer input field for orders: ${orderNumbers.join(', ')}...`);

            const inputSelectors = [
                '#match-0-control',
                'input[id="match-0-control"]',
                'filter-match[id="match-0"] input.fd-tokenizer__input',
                'filter-match[id="match-0"] input[fd-tokenizer-input]',
                'label[for="match-0-control"] ~ div input.fd-tokenizer__input',
                'input.tokenizer-input:not(#multiSelectSearch)',
                'input.fd-tokenizer__input:not(.fd-multi-input-tokenizer-input)'
            ];

            let inputElement = null;
            for (let selector of inputSelectors) {
                try {
                    inputElement = document.querySelector(selector);
                    if (inputElement && inputElement.id !== 'multiSelectSearch') {
                        debugLog(`Found correct input using selector: ${selector}`, 'success');
                        break;
                    }
                } catch (e) {}
            }

            if (!inputElement) {
                debugLog('Waiting for Order numbers input field to appear...', 'warning');
                inputElement = await waitForElement('#match-0-control');
            }

            if (!inputElement) {
                throw new Error('Could not find Order numbers tokenizer input field');
            }

            // Clear existing tokens
            const clearSuccess = await clearTokenizerInput(inputElement);
            if (!clearSuccess) {
                throw new Error('Failed to clear tokenizer input');
            }

            inputElement.focus();

            // Type each order number
            for (let orderNumber of orderNumbers) {
                debugLog(`Typing order number ${orderNumber} with ${delaySpeed}ms delay between characters...`);

                inputElement.value = '';
                for (let char of orderNumber) {
                    inputElement.value += char;
                    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                    await new Promise(resolve => setTimeout(resolve, Math.max(50, delaySpeed / 20)));
                }

                debugLog(`Simulating Enter key press for ${orderNumber}...`);

                const enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                });
                inputElement.dispatchEvent(enterEvent);

                const enterUpEvent = new KeyboardEvent('keyup', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                });
                inputElement.dispatchEvent(enterUpEvent);

                debugLog(`Order number ${orderNumber} entered successfully`, 'success');
                await new Promise(resolve => setTimeout(resolve, delaySpeed / 2));
            }

            debugLog(`All order numbers entered successfully: ${orderNumbers.join(', ')}`, 'success');
            await new Promise(resolve => setTimeout(resolve, delaySpeed));
            return true;
        } catch (error) {
            debugLog(`Error filling order numbers: ${error.message}`, 'error');
            return false;
        }
    }

    // Click the Apply button
    async function clickApplyButton() {
        try {
            debugLog('Looking for Apply button...');

            const buttonSelectors = [
                '#filter-apply-button',
                'button[id="filter-apply-button"]',
                'button.btn-apply',
                'button[componentname="filter-apply-button"]'
            ];

            let applyButton = null;
            for (let selector of buttonSelectors) {
                try {
                    applyButton = document.querySelector(selector);
                    if (applyButton) {
                        debugLog(`Found Apply button using selector: ${selector}`, 'success');
                        break;
                    }
                } catch (e) {}
            }

            if (!applyButton) {
                const buttons = document.querySelectorAll('button');
                for (let btn of buttons) {
                    if (btn.textContent.trim() === 'Apply' &&
                        (btn.classList.contains('btn-apply') || btn.classList.contains('fd-button--emphasized'))) {
                        applyButton = btn;
                        debugLog(`Found Apply button using text content match`, 'success');
                        break;
                    }
                }
            }

            if (!applyButton) {
                throw new Error('Could not find Apply button');
            }

            debugLog(`Clicking Apply button after ${delaySpeed}ms delay...`);
            await new Promise(resolve => setTimeout(resolve, delaySpeed));

            applyButton.focus();
            applyButton.click();

            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            applyButton.dispatchEvent(clickEvent);

            debugLog(`Waiting ${applyButtonDelay}ms for data to load after Apply button click...`);
            await new Promise(resolve => setTimeout(resolve, applyButtonDelay));

            debugLog('Apply button clicked successfully', 'success');
            return true;
        } catch (error) {
            debugLog(`Error clicking Apply button: ${error.message}`, 'error');
            return false;
        }
    }

    // Navigate to the next page
    async function navigateToNextPage() {
        try {
            debugLog('Looking for Next page button...');
            const nextButtonSelectors = [
                'button[aria-label="Next"]:not([aria-disabled="true"])',
                'button[title="Next page"]:not([disabled])',
                '.fd-pagination__link--next:not(.fd-pagination__link--disabled)'
            ];
            let nextButton = null;
            for (let selector of nextButtonSelectors) {
                nextButton = await waitForElement(selector, 5000);
                if (nextButton) {
                    debugLog(`Found Next button using selector: ${selector}`, 'success');
                    break;
                }
            }

            if (!nextButton) {
                debugLog('No enabled Next button found. Likely at the last page.', 'warning');
                return false;
            }

            debugLog(`Clicking Next page button after ${delaySpeed}ms delay...`);
            await new Promise(resolve => setTimeout(resolve, delaySpeed));

            nextButton.focus();
            nextButton.click();

            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            nextButton.dispatchEvent(clickEvent);

            debugLog(`Waiting ${applyButtonDelay}ms for next page to load...`);
            await waitForElement('table.cdk-table tr.cdk-row, tr[role="row"]', applyButtonDelay);

            debugLog('Navigated to next page successfully', 'success');
            return true;
        } catch (error) {
            debugLog(`Error navigating to next page: ${error.message}`, 'error');
            return false;
        }
    }

    // Reset to the first page
    async function resetToFirstPage() {
        try {
            debugLog('Resetting to first page...');
            const firstButtonSelectors = [
                'button[aria-label="First"]:not([aria-disabled="true"])',
                'button[title="First page"]:not([disabled])',
                '.fd-pagination__link--first:not(.fd-pagination__link--disabled)'
            ];
            let firstButton = null;
            for (let selector of firstButtonSelectors) {
                firstButton = await waitForElement(selector, 1000);
                if (firstButton) {
                    debugLog(`Found First button using selector: ${selector}`, 'success');
                    break;
                }
            }

            if (!firstButton) {
                debugLog('No enabled First button found. Assuming already on first page.', 'info');
                return true;
            }

            debugLog(`Clicking First page button after ${delaySpeed}ms delay...`);
            await new Promise(resolve => setTimeout(resolve, delaySpeed));

            firstButton.focus();
            firstButton.click();

            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            firstButton.dispatchEvent(clickEvent);

            debugLog(`Waiting ${applyButtonDelay}ms for first page to load...`);
            await waitForElement('table.cdk-table tr.cdk-row, tr[role="row"]', applyButtonDelay);

            debugLog('Reset to first page successfully', 'success');
            return true;
        } catch (error) {
            debugLog(`Error resetting to first page: ${error.message}`, 'error');
            return false;
        }
    }

    // Check if pagination exists
    function hasPagination() {
        const paginationElements = document.querySelectorAll([
            'button[aria-label="Next"]',
            'button[aria-label="First"]',
            'input.fd-pagination__input',
            '.fd-pagination__link'
        ].join(', '));
        const hasElements = paginationElements.length > 1; // Require more than one element to confirm pagination
        debugLog(`Pagination ${hasElements ? 'detected' : 'not detected'}`, 'info');
        return hasElements;
    }

  // Update delivery date and check checkbox
async function updateDeliveryDate(row, deliveryDate) {
    try {
        debugLog(`Checking delivery date for update to: ${deliveryDate}`);

        const dateInputSelectors = [
            'input[aria-label*="Date input"]',
            'input.fd-input-group__input',
            'input[type="text"][aria-haspopup="grid"]',
            '.fd-input-group input'
        ];

        let dateInput = null;
        for (let selector of dateInputSelectors) {
            dateInput = row.querySelector(selector);
            if (dateInput) {
                debugLog(`Found date input using selector: ${selector}`, 'success');
                break;
            }
        }

        if (!dateInput) {
            debugLog('No date input found in the highlighted row', 'warning');
            return false;
        }

        // Get current date from the scheduleLineDeliveryTime column
        const dateCell = row.querySelector('td.cdk-column-scheduleLineDeliveryTime app-date div.date-inline div');
        const currentDate = dateCell ? dateCell.textContent.trim() : null;
        if (!currentDate) {
            debugLog('No date found in scheduleLineDeliveryTime column', 'warning');
            return false;
        }

        // Get status from statusLineCurrentStatus column
        const statusCell = row.querySelector('td.cdk-column-statusLineCurrentStatus app-string div');
        const status = statusCell ? statusCell.textContent.trim() : null;
        const isConfirmed = status === 'Confirmed';
        debugLog(`Status detected: ${status || 'Unknown'}`, 'info');

        // Parse user-requested date (e.g., '03/17/2026') to MM/DD/YYYY format
        const dateParts = deliveryDate.split('/');
        const formattedInputFieldDate = `${parseInt(dateParts[0])}/${parseInt(dateParts[1])}/${dateParts[2]}`;
        const dateObj = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`);
        const formattedDisplayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        // Get current input field value
        const inputFieldDate = dateInput.value.trim();

        // Compare dates
        if (currentDate === formattedDisplayDate && inputFieldDate === formattedInputFieldDate) {
            debugLog(`Current date ${currentDate} matches requested date ${formattedDisplayDate}. Checking checkbox.`, 'info');

            // Check the checkbox
            const checkbox = row.querySelector('fd-checkbox input[type="checkbox"]');
            const checkboxLabel = row.querySelector('fd-checkbox label.fd-checkbox__label');
            if (checkbox && !checkbox.checked) {
                debugLog('Checking checkbox for matching date', 'info');
                checkbox.checked = true;
                checkbox.focus();
                checkbox.click();
                checkbox.dispatchEvent(new Event('input', { bubbles: true }));
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                checkbox.dispatchEvent(new Event('click', { bubbles: true }));
                const enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                });
                checkbox.dispatchEvent(enterEvent);
                if (checkboxLabel) {
                    checkboxLabel.click();
                    checkboxLabel.dispatchEvent(new Event('click', { bubbles: true }));
                }
                await new Promise(resolve => setTimeout(resolve, 200));
                debugLog('Checkbox checked successfully', 'success');
            } else if (checkbox && checkbox.checked) {
                debugLog('Checkbox already checked', 'info');
            } else {
                debugLog('No checkbox found in the row', 'warning');
            }

            // Style row based on confirmation status
            row.classList.add('selected-background');
            const actionsCell = row.querySelector('td.cdk-column-actions1');
            if (actionsCell) {
                actionsCell.classList.add('selected-background');
            }
            if (isConfirmed) {
                row.style.backgroundColor = '#28a745'; // Green for confirmed
                row.style.border = '2px solid #218838';
                row.style.boxShadow = '0 0 10px rgba(33, 136, 56, 0.5)';
                debugLog(`Row marked green (Confirmed) for date ${formattedDisplayDate}`, 'success');
            } else {
                row.style.backgroundColor = '#ffc107'; // Yellow for unconfirmed
                row.style.border = '2px solid #e0a800';
                row.style.boxShadow = '0 0 10px rgba(224, 168, 0, 0.5)';
                debugLog(`Row marked yellow (Unconfirmed) for date ${formattedDisplayDate}`, 'success');
            }
            return true;
        }

        // Update date if it doesn't match
        debugLog(`Updating delivery date from ${currentDate} to ${formattedInputFieldDate}`);

        // Clear and update date input
        dateInput.focus();
        dateInput.click();
        dateInput.select();
        dateInput.value = ''; // Clear existing value
        await new Promise(resolve => setTimeout(resolve, 50));

        for (let char of formattedInputFieldDate) {
            dateInput.value += char;
            dateInput.dispatchEvent(new Event('input', { bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        // Trigger necessary events
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
        dateInput.dispatchEvent(new Event('blur', { bubbles: true }));
        const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true
        });
        dateInput.dispatchEvent(enterEvent);
        await new Promise(resolve => setTimeout(resolve, 200));

        // Verify date update
        const updatedDate = dateInput.value.trim();
        if (updatedDate !== formattedInputFieldDate) {
            debugLog(`Date update failed: Expected ${formattedInputFieldDate}, but got ${updatedDate}`, 'error');
            return false;
        }

        // Check the checkbox
        const checkbox = row.querySelector('fd-checkbox input[type="checkbox"]');
        const checkboxLabel = row.querySelector('fd-checkbox label.fd-checkbox__label');
        if (checkbox && !checkbox.checked) {
            debugLog('Checkbox not checked after date update. Clicking manually.', 'warning');
            checkbox.checked = true;
            checkbox.focus();
            checkbox.click();
            checkbox.dispatchEvent(new Event('input', { bubbles: true }));
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            checkbox.dispatchEvent(new Event('click', { bubbles: true }));
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            });
            checkbox.dispatchEvent(enterEvent);
            if (checkboxLabel) {
                checkboxLabel.click();
                checkboxLabel.dispatchEvent(new Event('click', { bubbles: true }));
            }
            await new Promise(resolve => setTimeout(resolve, 200));
            debugLog('Checkbox checked successfully', 'success');
        } else if (checkbox && checkbox.checked) {
            debugLog('Checkbox already checked after date update', 'info');
        } else {
            debugLog('No checkbox found in the row', 'warning');
        }

        // Style row (orange for date change)
        row.classList.add('selected-background');
        const actionsCell = row.querySelector('td.cdk-column-actions1');
        if (actionsCell) {
            actionsCell.classList.add('selected-background');
        }
        row.style.backgroundColor = '#ff9800';
        row.style.border = '2px solid #e68900';
        row.style.boxShadow = '0 0 10px rgba(230, 137, 0, 0.5)';
        debugLog(`Delivery date updated to ${formattedInputFieldDate} and row marked orange`, 'success');
        return true;
    } catch (error) {
        debugLog(`Error updating delivery date: ${error.message}`, 'error');
        return false;
    }
}

    // Process lines for a single order
    async function processOrderLines(order) {
        debugLog(`Processing lines for order: ${order.orderNumber}`);
        const processedPOs = new Set(); // Track processed POs to avoid duplicates
        let currentPage = 1;
        let hasNextPage = true;

        // Reset to first page
        await resetToFirstPage();

        while (hasNextPage) {
            debugLog(`Processing page ${currentPage} for PO ${order.orderNumber}`);

            // Wait for table to load
            const table = await waitForElement('table.cdk-table, [role="grid"]', applyButtonDelay);
            if (!table) {
                debugLog('No table found on the page', 'error');
                return false;
            }

            // Get all rows on the current page
            const rowSelectors = ['tr[role="row"]', 'tr.cdk-row', 'tr[cdk-row]'];
            let rows = [];
            for (let selector of rowSelectors) {
                rows = table.querySelectorAll(selector);
                if (rows.length > 0) {
                    debugLog(`Found ${rows.length} rows using selector: ${selector}`, 'success');
                    break;
                }
            }

            if (rows.length === 0) {
                debugLog('No rows found on the current page', 'warning');
                hasNextPage = false;
                break;
            }

            let processedOnPage = false;
            let currentPONumber = null;

            for (let row of rows) {
                // Check for group header to update current PO number
                if (row.querySelector('td.cdk-column-groupHeader')) {
                    const poElement = row.querySelector('.group-item-value.group-header-link');
                    if (poElement) {
                        currentPONumber = poElement.textContent.trim();
                        debugLog(`Detected group header for PO ${currentPONumber}`, 'info');
                    }
                    continue;
                }

                // Skip if no PO number or already processed
                if (!currentPONumber || processedPOs.has(`${currentPONumber}-${order.lines.map(l => l.lineNumber).join(',')}`)) {
                    debugLog(`Skipping row with PO ${currentPONumber} (already processed or invalid)`, 'info');
                    continue;
                }

                // Check if PO matches the order
                if (currentPONumber === order.orderNumber) {
                    const lineNumberElements = row.querySelectorAll([
                        'app-number span',
                        '.cdk-column-scheduleLineItemLineNumber span',
                        '[aria-label*="Item No."] span',
                        'td span'
                    ].join(', '));

                    for (let element of lineNumberElements) {
                        const text = element.textContent.trim();
                        const matchingLine = order.lines.find(line => line.lineNumber === text);
                        if (matchingLine) {
                            debugLog(`Processing PO ${currentPONumber}, line ${text} on page ${currentPage}`, 'info');
                            // Highlight row
                            row.style.backgroundColor = '#ffeb3b';
                            row.style.border = '2px solid #ff9800';
                            row.style.boxShadow = '0 0 10px rgba(255, 152, 0, 0.5)';
                            row.style.transition = 'all 0.3s ease';
                            row.scrollIntoView({ behavior: 'smooth', block: 'center' });

                            const dateSuccess = await updateDeliveryDate(row, matchingLine.deliveryDate);
                            if (dateSuccess) {
                                processedPOs.add(`${currentPONumber}-${text}`);
                                processedOnPage = true;
                                debugLog(`Successfully processed PO ${currentPONumber}, line ${text}`, 'success');
                            } else {
                                debugLog(`Failed to process date for PO ${currentPONumber}, line ${text}`, 'error');
                            }
                            break; // Move to next row after processing a matching line
                        }
                    }
                }
            }

            // Check if all lines for this order are processed
            const allLinesProcessed = order.lines.every(line => processedPOs.has(`${order.orderNumber}-${line.lineNumber}`));
            if (allLinesProcessed) {
                debugLog(`All lines for PO ${order.orderNumber} processed`, 'info');
                hasNextPage = false;
                break;
            }

            // Move to next page if pagination exists
            hasNextPage = hasPagination() && await navigateToNextPage();
            if (hasNextPage) {
                currentPage++;
            } else {
                debugLog('No more pages to process or navigation failed', 'info');
            }
        }

        // Log missing lines
        const missingLines = order.lines.filter(line => !processedPOs.has(`${order.orderNumber}-${line.lineNumber}`));
        if (missingLines.length > 0) {
            debugLog(`Warning: Could not find lines for PO ${order.orderNumber}: ${missingLines.map(l => l.lineNumber).join(', ')}`, 'warning');
        }

        return true;
    }

    // Main batch processing function
    async function processBatchInput(input) {
        debugLog('=== Starting batch processing cycle ===');

        const orders = parseBatchInput(input);
        if (!orders.length) {
            debugLog('No valid orders found in input', 'error');
            return false;
        }

        debugLog(`Found ${orders.length} unique orders to process: ${orders.map(o => o.orderNumber).join(', ')}`);

        // Extract all order numbers
        const orderNumbers = orders.map(order => order.orderNumber);

        // Fill all order numbers at once
        const fillSuccess = await fillOrderNumbers(orderNumbers);
        if (!fillSuccess) {
            debugLog('Failed to fill order numbers', 'error');
            return false;
        }

        // Click Apply button
        await new Promise(resolve => setTimeout(resolve, delaySpeed));
        const applySuccess = await clickApplyButton();
        if (!applySuccess) {
            debugLog('Failed to click Apply button', 'error');
            return false;
        }

        // Process lines for each order
        for (const order of orders) {
            await processOrderLines(order);
            await new Promise(resolve => setTimeout(resolve, delaySpeed * 2));
        }

        debugLog('=== Batch processing completed ===', 'success');
        return true;
    }

    // Initialize the script
    function init() {
        debugLog('Ariba Auto-Fill Enhanced script initialized');
        debugLog(`Current URL: ${window.location.href}`);

        const panel = createDebugPanel();

        document.getElementById('toggle-visibility').addEventListener('click', (e) => {
            e.stopPropagation();
            const content = document.getElementById('panel-content');
            const toggleBtn = document.getElementById('toggle-visibility');

            if (isVisible) {
                content.style.display = 'none';
                toggleBtn.textContent = '+';
                panel.style.height = 'auto';
            } else {
                content.style.display = 'block';
                toggleBtn.textContent = '−';
            }
            isVisible = !isVisible;
        });

        document.getElementById('clear-debug').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('debug-content').innerHTML = '';
            debugLog('Debug log cleared');
        });

        const delaySlider = document.getElementById('delay-slider');
        const delayValue = document.getElementById('delay-value');
        const applyDelaySlider = document.getElementById('apply-delay-slider');
        const applyDelayValue = document.getElementById('apply-delay-value');

        delaySlider.addEventListener('input', (e) => {
            delaySpeed = parseInt(e.target.value);
            delayValue.textContent = delaySpeed;
            debugLog(`General delay speed updated to ${delaySpeed}ms`);
        });

        applyDelaySlider.addEventListener('input', (e) => {
            applyButtonDelay = parseInt(e.target.value);
            applyDelayValue.textContent = applyButtonDelay;
            debugLog(`Apply button delay updated to ${applyButtonDelay}ms`);
        });

        document.getElementById('process-btn').addEventListener('click', async (e) => {
            e.stopPropagation();
            const input = document.getElementById('paste-input').value.trim();
            if (!input) {
                debugLog('Please paste input first', 'warning');
                return;
            }

            const btn = e.target;
            btn.disabled = true;
            btn.textContent = '🔄 Processing...';

            debugLog('Manual processing triggered');
            await processBatchInput(input);

            btn.disabled = false;
            btn.textContent = '🚀 Process & Apply';
        });

        document.addEventListener('keydown', async (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                try {
                    const text = await navigator.clipboard.readText();
                    debugLog('Processing from clipboard...');
                    document.getElementById('paste-input').value = text;
                    await processBatchInput(text);
                } catch (error) {
                    debugLog('Could not read clipboard. Please paste manually.', 'error');
                }
            }
        });

        debugLog('Ready! Features: Batch order processing, multiple order numbers, group-header PO-verified line highlighting, date updating with skip if matching, robust sequential page processing, pagination support, green row on date update or check');
        debugLog('Paste format: MM/DD/YYYY ORDERNUM/LINE/SEQ (one per line) or use Ctrl+Shift+P');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();