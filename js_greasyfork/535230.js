// ==UserScript==
// @name         PL09 / Orders Closer
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Automate closing orders in Glovia - last status july 23 working
// @author       OEO
// @match        http*://*fre-prod-glfe*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/535230/PL09%20%20Orders%20Closer.user.js
// @updateURL https://update.greasyfork.org/scripts/535230/PL09%20%20Orders%20Closer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global flags and counters
    let isProcessing = false;
    let shouldStopProcessing = false;
    let isPaused = false;
    let processedCount = 0;
    let alertObserver = null;
    let lastUsedRowIndex = 0;
    let failedOrders = {};
    let currentFailedOrder = null;
    let currentOrderIndex = 0;
    let currentOrdersList = [];
    let lastAlertText = '';
    const enableDebug = false; // Debugging enabled
    const DELAY_TIME = 70; // Fixed delay in milliseconds

    // Load failed orders from storage
    const loadFailedOrders = () => {
        try {
            const savedFailedOrders = GM_getValue('failedOrders', '{}');
            failedOrders = JSON.parse(savedFailedOrders);
            if (enableDebug) logMessage(`Loaded ${Object.keys(failedOrders).length} failed orders from storage`);
        } catch (error) {
            if (enableDebug) logMessage(`Error loading failed orders: ${error.message}`, true);
            failedOrders = {};
        }
    };

    // Save failed orders to storage
    const saveFailedOrders = () => {
        try {
            GM_setValue('failedOrders', JSON.stringify(failedOrders));
            if (enableDebug) logMessage(`Saved ${Object.keys(failedOrders).length} failed orders to storage`);
        } catch (error) {
            if (enableDebug) logMessage(`Error saving failed orders: ${error.message}`, true);
        }
    };

    // Add a failed order to tracking
    const addFailedOrder = (workOrder, lineNumber, reason) => {
        const orderKey = `${workOrder}_${lineNumber}`;
        failedOrders[orderKey] = {
            workOrder,
            lineNumber,
            reason,
            timestamp: new Date().toISOString(),
            attempts: (failedOrders[orderKey]?.attempts || 0) + 1
        };
        saveFailedOrders();
        if (enableDebug) logMessage(`Added failed order to tracking: ${workOrder} ${lineNumber} - ${reason}`, true);
    };

    // Helper function to detect the currently highlighted row
    const getHighlightedRowIndex = (rows) => {
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (row.classList.contains('k-state-selected') ||
                row.classList.contains('g2row-selected') ||
                row.querySelector('input:focus') ||
                row.querySelector('.k-focus')) {
                if (enableDebug) logMessage(`Detected highlighted row at index ${i} (row-uid: ${row.getAttribute('row-uid')})`);
                return i;
            }
        }
        return -1;
    };

    // Remove order from input textarea
    const removeOrderFromInput = (workOrder, lineNumber) => {
        const ordersList = document.getElementById('ordersList');
        if (!ordersList) return;

        const orderToRemove = `${workOrder} ${lineNumber}`;
        const orders = ordersList.value.split('\n');
        const filteredOrders = orders.filter(line =>
            line.trim() !== orderToRemove
        );

        ordersList.value = filteredOrders.join('\n');
        if (enableDebug) logMessage(`Removed order ${orderToRemove} from input list`);
    };

    // Check if an order is in the failed list
    const isFailedOrder = (workOrder, lineNumber) => {
        const orderKey = `${workOrder}_${lineNumber}`;
        return !!failedOrders[orderKey];
    };

    // Add modern styling with animations
    GM_addStyle(`
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        #gloviaOrdersDialog {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 340px;
            background: linear-gradient(145deg, #ffffff, #f5f7fa);
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            z-index: 9999;
            padding: 20px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            border: none;
            animation: slideIn 0.3s ease-out;
        }

        #gloviaOrdersDialog h3 {
            margin: 0 0 16px;
            font-size: 20px;
            font-weight: 600;
            color: #1a1a1a;
            border-bottom: 2px solid #e8ecef;
            padding-bottom: 10px;
        }

        #ordersList, #failedOrdersList {
            width: 93%;
            margin-bottom: 16px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 10px;
            font-family: 'Fira Code', monospace;
            font-size: 13px;
            resize: none;
            transition: border-color 0.2s;
        }

        #ordersList:focus, #failedOrdersList:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        #failedOrdersList {
            height: 90px;
            border-color: #f87171;
            background: #fef2f2;
        }

        #gloviaOrdersDialog button {
            background: #2563eb;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            margin-right: 8px;
            margin-bottom: 8px;
            transition: all 0.2s;
        }

        #gloviaOrdersDialog button:hover {
            background: #1d4ed8;
            transform: translateY(-1px);
        }

        #gloviaOrdersDialog button:active {
            transform: translateY(0);
        }

        #gloviaOrdersDialog button:disabled {
            background: #d1d5db;
            cursor: not-allowed;
            transform: none;
        }

        #processLog {
            height: 140px;
            overflow-y: auto;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 12px;
            margin-top: 16px;
            font-size: 12px;
            background: #f9fafb;
            font-family: 'Fira Code', monospace;
        }

        .error-log { color: #dc2626; }
        .success-log { color: #16a34a; }
        .warning-log { color: #d97706; }

        #gloviaFloatingButton {
            position: fixed;
            top: 16px;
            right: 16px;
            z-index: 9998;
            background: #2563eb;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 3px 8px rgba(0,0,0,0.1);
            transition: all 0.2s;
        }

        #gloviaFloatingButton:hover {
            background: #1d4ed8;
            transform: translateY(-1px);
        }

        #alertActionButtons {
            position: fixed;
            top: 16px;
            left: 50%;
            transform: translateX(-50%);
            background: #dc2626;
            color: white;
            z-index: 10000;
            padding: 12px 20px;
            border-radius: 8px;
            display: none;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            font-weight: 500;
        }

        #skipAlertButton, #continueProcessingButton {
            background: #ffffff;
            color: #1a1a1a;
            border: 1px solid #d1d5db;
            padding: 6px 14px;
            margin: 0 6px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }

        #skipAlertButton:hover, #continueProcessingButton:hover {
            background: #f3f4f6;
            border-color: #9ca3af;
        }

        #delayTime {
            margin: 12px 0;
            font-size: 13px;
            width: 80px;
            padding: 8px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            background: #e5e7eb;
            color: #4b5563;
        }

        label {
            font-size: 13px;
            color: #1a1a1a;
            font-weight: 500;
            margin-bottom: 6px;
            display: block;
        }

        #dialogFooter {
            margin-top: 16px;
            padding-top: 12px;
            border-top: 1px solid #e8ecef;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            font-weight: 500;
        }

        #dialogFooter span {
            color: #2563eb;
            font-weight: 600;
        }

        #orders-closer-disabled {
            position: fixed;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            background: #ffebee;
            border: 1px solid #f44336;
            border-radius: 5px;
            padding: 10px;
            z-index: 9999;
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            max-width: 300px;
        }

        #reloadButton {
            background: #2563eb;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            margin-top: 10px;
            transition: all 0.2s;
            display: block;
        }

        #reloadButton:hover {
            background: #1d4ed8;
            transform: translateY(-1px);
        }
    `);

    // Log simplified messages for non-expert users
    const logMessage = (message, isError = false, isWarning = false) => {
        const logElement = document.getElementById('processLog');
        if (logElement) {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
            messageDiv.className = isError ? 'error-log' : isWarning ? 'warning-log' : 'success-log';
            logElement.appendChild(messageDiv);
            logElement.scrollTop = logElement.scrollHeight;
        }
        if (enableDebug) console.log(`[Orders Closer] ${message}`);
    };

    // Create reload button
    const createReloadButton = () => {
        if (document.getElementById('reloadButton')) return;

        const reloadButton = document.createElement('button');
        reloadButton.id = 'reloadButton';
        reloadButton.textContent = 'Reload Page';
        reloadButton.addEventListener('click', () => {
            window.location.reload();
        });

        const disabledMenu = document.getElementById('orders-closer-disabled') || document.getElementById('gloviaOrdersDialog');
        if (disabledMenu) {
            disabledMenu.appendChild(reloadButton);
        } else {
            document.body.appendChild(reloadButton);
        }
        if (enableDebug) logMessage('Reload button created.');
    };

    // Update status from GitHub
    async function updateStatusFromGitHub() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const response = await fetch('https://raw.githubusercontent.com/oeowork/gl/refs/heads/main/work', {
                signal: controller.signal,
                cache: 'default',
                headers: { 'Accept': 'text/plain' }
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                const configText = await response.text();
                const trimmedText = configText.trim().toLowerCase();
                const newStatus = trimmedText === 'true';
                GM_setValue('scriptEnabled', newStatus);
                if (enableDebug) logMessage(`Updated script status from GitHub: ${newStatus}`);
                if (!newStatus) {
                    logMessage('🛑 Script disabled by remote configuration', true);
                    const dialog = document.getElementById('gloviaOrdersDialog');
                    if (dialog) {
                        dialog.innerHTML = '<div>Outdated Tool - Please update to new version.</div>';
                        dialog.style.backgroundColor = '#ffebee';
                        dialog.style.border = '1px solid #f44336';
                        createReloadButton();
                    }
                }
            }
        } catch (error) {
            if (enableDebug) logMessage(`Error updating status from GitHub: ${error.message}`, true);
        }
    }

    // Check page and initialize
    async function checkPageAndInitialize() {
        if (enableDebug) logMessage('Checking remote configuration before initialization');
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const response = await fetch('https://raw.githubusercontent.com/oeowork/gl/refs/heads/main/work', {
                signal: controller.signal,
                cache: 'default',
                headers: { 'Accept': 'text/plain' }
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                if (enableDebug) logMessage(`Fetch failed with status: ${response.status} ${response.statusText}`, true);
                logMessage('⚠️ Failed to fetch configuration, assuming enabled', false, true);
                init();
                return;
            }

            const configText = await response.text();
            const trimmedText = configText.trim().toLowerCase();
            if (enableDebug) logMessage(`Fetched configuration value: "${trimmedText}"`);

            if (trimmedText !== 'true') {
                logMessage('🛑 Error, Tool Outdated /Clear Cache', true);
                const disabledMenu = document.createElement('div');
                disabledMenu.id = 'orders-closer-disabled';
                disabledMenu.textContent = 'Error, Tool Outdated';
                Object.assign(disabledMenu.style, {
                    position: 'fixed',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    backgroundColor: '#ffebee',
                    border: '1px solid #f44336',
                    borderRadius: '5px',
                    padding: '10px',
                    zIndex: '9999',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    maxWidth: '300px'
                });
                document.body.appendChild(disabledMenu);
                createReloadButton();
                return;
            }

            if (enableDebug) logMessage('Script enabled by configuration, proceeding with initialization');
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                if (enableDebug) logMessage('Page is ready and script enabled, initializing script');
                init();
            } else {
                if (enableDebug) logMessage('Page not yet ready, waiting for DOMContentLoaded event');
                document.addEventListener('DOMContentLoaded', init);
            }
        } catch (error) {
            if (enableDebug) logMessage(`Error checking configuration: ${error.message}`, true);
            logMessage('⚠️ Error fetching configuration, assuming enabled', false, true);
            init();
            createReloadButton();
        }
    }

    // Create alert action buttons
    const createAlertActionButtons = () => {
        const existingButtons = document.getElementById('alertActionButtons');
        if (existingButtons) return existingButtons;

        const alertActionButtons = document.createElement('div');
        alertActionButtons.id = 'alertActionButtons';
        alertActionButtons.innerHTML = `
            <span style="font-weight: 500; margin-right: 12px;">Alert Detected!</span>
            <button id="skipAlertButton">Skip Order</button>
            <button id="continueProcessingButton">Retry</button>
        `;

        document.body.appendChild(alertActionButtons);

        document.getElementById('skipAlertButton').addEventListener('click', handleSkipAlert);
        document.getElementById('continueProcessingButton').addEventListener('click', handleContinueProcessing);

        return alertActionButtons;
    };

    // Convert technical error messages to user-friendly text
    const makeErrorUserFriendly = (technicalError) => {
        const errorText = technicalError.toLowerCase();

        // Common error patterns and their user-friendly translations
        if (errorText.includes('open qty') || errorText.includes('short') || errorText.includes('committed')) {
            return 'Order has open quantities';
        }

        if (errorText.includes('select to close')) {
            return 'Requires manual selection';
        }

        if (errorText.includes('record already in file') || errorText.includes('already exists')) {
            return 'Order already exists';
        }

        if (errorText.includes('not found') || errorText.includes('does not exist')) {
            return 'Order not found';
        }

        if (errorText.includes('access denied') || errorText.includes('permission')) {
            return 'Access denied';
        }

        if (errorText.includes('invalid') || errorText.includes('error in data')) {
            return 'Invalid data';
        }

        if (errorText.includes('locked') || errorText.includes('in use')) {
            return 'Order is locked';
        }

        if (errorText.includes('closed') || errorText.includes('completed')) {
            return 'Order already closed';
        }

        if (errorText.includes('cancelled') || errorText.includes('canceled')) {
            return 'Order was cancelled';
        }

        if (errorText.includes('quantity') || errorText.includes('qty')) {
            return 'Quantity issue';
        }

        if (errorText.includes('date') || errorText.includes('time')) {
            return 'Date/time error';
        }

        if (errorText.includes('connection') || errorText.includes('network')) {
            return 'Connection error';
        }

        if (errorText.includes('timeout')) {
            return 'Request timeout';
        }

        if (errorText.includes('mandatory') || errorText.includes('required')) {
            return 'Missing required data';
        }

        if (errorText.includes('duplicate')) {
            return 'Duplicate entry';
        }

        if (errorText.includes('balance') || errorText.includes('inventory')) {
            return 'Inventory issue';
        }

        // If no pattern matches, try to extract meaningful words
        let cleanedError = technicalError
            .replace(/^\d{3}\s*-\s*/i, '')
            .replace(/^(error|alert|warning):\s*/i, '')
            .replace(/\b[A-Z_]{2,}\b/g, '')
            .replace(/[-_]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        if (cleanedError.length < 3) {
            return 'Processing error';
        }

        return cleanedError.charAt(0).toUpperCase() + cleanedError.slice(1).toLowerCase();
    };

    // Handle skip alert
    const handleSkipAlert = () => {
        if (currentFailedOrder) {
            let alertMessage = 'Unknown error';

            const processLog = document.getElementById('processLog');
            if (processLog) {
                const logEntries = processLog.querySelectorAll('.error-log');

                for (let i = logEntries.length - 1; i >= 0; i--) {
                    const entry = logEntries[i];
                    const entryText = entry.textContent;

                    let match = entryText.match(/Cleaned alert text:\s*(.+)/i);
                    if (match && match[1]) {
                        alertMessage = match[1].trim();
                        if (enableDebug) logMessage(`Found alert message from cleaned log: "${alertMessage}"`, false, true);
                        break;
                    }

                    match = entryText.match(/Raw alert detected:\s*(.+)/i);
                    if (match && match[1]) {
                        alertMessage = match[1].trim();
                        if (enableDebug) logMessage(`Found alert message from raw log: "${alertMessage}"`, false, true);
                        break;
                    }

                    match = entryText.match(/Alert detected:\s*(.+)/i);
                    if (match && match[1]) {
                        alertMessage = match[1].trim();
                        if (enableDebug) logMessage(`Found alert message from general log: "${alertMessage}"`, false, true);
                        break;
                    }
                }
            }

            const userFriendlyMessage = makeErrorUserFriendly(alertMessage);
            if (enableDebug) logMessage(`Converted "${alertMessage}" to "${userFriendlyMessage}"`, false, true);

            addFailedOrder(
                currentFailedOrder.workOrder,
                currentFailedOrder.lineNumber,
                userFriendlyMessage
            );
            removeOrderFromInput(currentFailedOrder.workOrder, currentFailedOrder.lineNumber);
            updateFailedOrdersList();

            const actionButtons = document.getElementById('alertActionButtons');
            if (actionButtons) actionButtons.style.display = 'none';

            const nextIndex = currentOrderIndex + 1;
            const skippedOrder = currentFailedOrder;
            currentFailedOrder = null;

            const alertDialog = document.querySelector('.g2Alert');
            const okButton = alertDialog?.querySelector('.alertButton.confirmOk');
            if (okButton) {
                okButton.click();
                if (enableDebug) logMessage(`Clicked OK on alert dialog after marking ${skippedOrder.workOrder} ${skippedOrder.lineNumber} as failed`, true);
            }

            setTimeout(() => sendEscKey(), 500);
            isPaused = false;

            if (enableDebug) logMessage(`Retaining last used row index ${lastUsedRowIndex} for next order after skipping`);
            setTimeout(() => {
                if (isProcessing) {
                    if (enableDebug) logMessage(`Resuming processing from the next order (index ${nextIndex}) after the failed one`, false, true);
                    processBatch(currentOrdersList, nextIndex);
                }
            }, 1000);
        } else {
            isPaused = false;
            const actionButtons = document.getElementById('alertActionButtons');
            if (actionButtons) actionButtons.style.display = 'none';

            const alertDialog = document.querySelector('.g2Alert');
            const okButton = alertDialog?.querySelector('.alertButton.confirmOk');
            if (okButton) {
                okButton.click();
                if (enableDebug) logMessage(`Clicked OK on alert dialog`, true);
            }

            setTimeout(() => sendEscKey(), 500);
        }
    };

    // Handle continue processing (Retry)
    const handleContinueProcessing = () => {
        const actionButtons = document.getElementById('alertActionButtons');
        if (actionButtons) actionButtons.style.display = 'none';

        const alertDialog = document.querySelector('.g2Alert');
        const okButton = alertDialog?.querySelector('.alertButton.confirmOk');
        if (okButton) {
            okButton.click();
            if (enableDebug) logMessage(`Clicked OK on alert dialog and retrying`, false, true);
        }

        setTimeout(() => sendEscKey(), 500);
        isPaused = false;

        setTimeout(() => {
            if (isProcessing) {
                if (enableDebug) logMessage(`Resuming processing from the current order`, false, true);
                processBatch(currentOrdersList, currentOrderIndex);
            }
        }, 1000);
    };

    // Send ESC key press
    const sendEscKey = async () => {
        const anyInput = document.querySelector('input:not([disabled])') || document.body;
        if (anyInput) {
            anyInput.focus();
            const escKeyEvent = new KeyboardEvent('keydown', {
                key: 'Escape',
                code: 'Escape',
                keyCode: 27,
                which: 27,
                bubbles: true,
                cancelable: true
            });

            if (enableDebug) logMessage('Sending ESC key to dismiss dialog');
            anyInput.dispatchEvent(escKeyEvent);
            await new Promise(resolve => setTimeout(resolve, 500));
            return true;
        }

        if (enableDebug) logMessage('No valid element found to send ESC key', true);
        return false;
    };

    // Check for G2 Alert dialog
    const checkForAlertDialog = () => {
        const alertDialog = document.querySelector('.g2Alert');
        if (alertDialog) {
            let alertText = alertDialog.textContent.trim();

            const cleanAlertText = alertText
                .replace(/\s*(OK|Cancel|Yes|No)\s*$/i, '')
                .replace(/^\s*(Error|Alert|Warning):\s*/i, '')
                .replace(/\s+/g, ' ')
                .trim();

            if (enableDebug) {
                logMessage(`Raw alert detected: ${alertText}`, true);
                if (cleanAlertText !== alertText) {
                    logMessage(`Cleaned alert text: ${cleanAlertText}`, true);
                }
            } else {
                logMessage(`Alert detected: ${cleanAlertText}`, true);
            }

            isPaused = true;
            const actionButtons = createAlertActionButtons();
            actionButtons.style.display = 'block';
            return true;
        }
        return false;
    };

    // Setup alert observer
    const setupAlertObserver = () => {
        if (alertObserver) {
            alertObserver.disconnect();
        }

        alertObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList && node.classList.contains('g2Alert')) {
                                checkForAlertDialog();
                            } else if (node.querySelector && node.querySelector('.g2Alert')) {
                                checkForAlertDialog();
                            }
                        }
                    }
                }
            }
        });

        alertObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        if (enableDebug) logMessage('Alert observer set up successfully');
    };

    // Create dialog UI
    const createDialog = () => {
        try {
            if (document.getElementById('gloviaOrdersDialog')) {
                if (enableDebug) logMessage('Dialog already exists, skipping creation.');
                return;
            }

            const dialog = document.createElement('div');
            dialog.id = 'gloviaOrdersDialog';
            dialog.innerHTML = `
                <h3>Orders Closer</h3>
                <div>
                    <label for="ordersList">Work Orders (one per line):</label>
                    <textarea id="ordersList" placeholder="Example: 133676 0001"></textarea>
                </div>
                <div>
                    <label for="failedOrdersList">Failed Orders:</label>
                    <textarea id="failedOrdersList" readonly></textarea>
                </div>
                <div>
                    <label for="delayTime">Delay (ms):</label>
                    <input type="number" id="delayTime" value="70" readonly>
                </div>
                <div>
                    <button id="startProcess">Start</button>
                    <button id="stopProcess" style="display: none;">Stop</button>
                    <button id="clearData">Clear</button>
                </div>
                <div id="processLog"></div>
                <div id="dialogFooter">dev / oeo</div>
            `;
            document.body.appendChild(dialog);

            document.getElementById('startProcess').addEventListener('click', processOrders);
            document.getElementById('stopProcess').addEventListener('click', stopProcessing);
            document.getElementById('clearData').addEventListener('click', clearData);

            let isDragging = false;
            let offsetX, offsetY;

            dialog.addEventListener('mousedown', (e) => {
                if (e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
                    isDragging = true;
                    offsetX = e.clientX - dialog.getBoundingClientRect().left;
                    offsetY = e.clientY - dialog.getBoundingClientRect().top;
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    dialog.style.left = (e.clientX - offsetX) + 'px';
                    dialog.style.top = (e.clientY - offsetY) + 'px';
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });

            if (enableDebug) logMessage('Dialog created successfully.');
        } catch (error) {
            if (enableDebug) logMessage(`Error creating dialog: ${error.message}`, true);
        }
    };

    // Send keyboard events
    const sendKeyboardEvent = (element, key, code, keyCode) => {
        element.focus();

        const keyDownEvent = new KeyboardEvent('keydown', {
            key: key,
            code: code,
            keyCode: keyCode,
            which: keyCode,
            bubbles: true,
            cancelable: true
        });

        const keyPressEvent = new KeyboardEvent('keypress', {
            key: key,
            code: code,
            keyCode: keyCode,
            which: keyCode,
            bubbles: true,
            cancelable: true
        });

        const keyUpEvent = new KeyboardEvent('keyup', {
            key: key,
            code: code,
            keyCode: keyCode,
            which: keyCode,
            bubbles: true,
            cancelable: true
        });

        element.dispatchEvent(keyDownEvent);
        element.dispatchEvent(keyPressEvent);
        element.dispatchEvent(keyUpEvent);
    };

    // Send Enter key
    const sendEnterKey = async (element, times = 1, delay = DELAY_TIME) => {
        for (let i = 0; i < times; i++) {
            if (shouldStopProcessing) {
                if (enableDebug) logMessage('Enter key sequence interrupted due to stop request', true);
                return;
            }

            sendKeyboardEvent(element, 'Enter', 'Enter', 13);

            if (i < times - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
                if (checkForAlertDialog()) {
                    return;
                }
            }
        }
    };

    // Clear data and logs
    const clearData = () => {
        const ordersList = document.getElementById('ordersList');
        const processLog = document.getElementById('processLog');
        if (ordersList) ordersList.value = '';
        if (processLog) processLog.innerHTML = '';
        processedCount = 0;
        failedOrders = {};
        saveFailedOrders();
        updateFailedOrdersList();
        logMessage('All data and logs cleared.', false);
    };

    // Update failed orders display with reason
    const updateFailedOrdersList = () => {
        const failedOrdersList = document.getElementById('failedOrdersList');
        if (!failedOrdersList) return;

        const sortedOrders = Object.values(failedOrders).sort((a, b) => {
            const workOrderComparison = a.workOrder.localeCompare(b.workOrder, undefined, { numeric: true });
            if (workOrderComparison !== 0) return workOrderComparison;
            return a.lineNumber.localeCompare(b.lineNumber, undefined, { numeric: true });
        });

        failedOrdersList.value = sortedOrders.map(order =>
            `${order.workOrder} ${order.lineNumber} (${order.reason.substring(0, 30)}${order.reason.length > 30 ? '...' : ''})`
        ).join('\n');
    };

    // Stop processing
    const stopProcessing = () => {
        shouldStopProcessing = true;
        isProcessing = false;
        isPaused = false;

        const processButton = document.getElementById('startProcess');
        const stopButton = document.getElementById('stopProcess');

        if (processButton) {
            processButton.disabled = false;
            processButton.style.display = 'inline-block';
        }

        if (stopButton) {
            stopButton.style.display = 'none';
        }

        const actionButtons = document.getElementById('alertActionButtons');
        if (actionButtons) actionButtons.style.display = 'none';

        logMessage('Processing stopped.', false, true);
    };

 // Inside the (function() { ... })();

// Process orders
const processOrders = async () => {
    if (isProcessing) {
        logMessage('Processing already in progress. Please stop first.', true);
        return;
    }

    const ordersText = document.getElementById('ordersList')?.value.trim();
    if (!ordersText) {
        logMessage('No orders entered. Please add work orders.', true);
        return;
    }

    const orders = ordersText.split('\n').map(line => line.trim()).filter(line => line);
    if (orders.length === 0) {
        logMessage('No valid orders found.', true);
        return;
    }

    // Detect duplicates
    const orderCounts = {};
    orders.forEach(line => {
        orderCounts[line] = (orderCounts[line] || 0) + 1;
    });

    // Filter unique orders and handle duplicates
    const uniqueOrders = [];
    const processedLines = new Set();
    for (const line of orders) {
        if (orderCounts[line] > 1 && !processedLines.has(line)) {
            const [workOrder, lineNumber] = line.split(/\s+/);
            if (workOrder && lineNumber) {
                addFailedOrder(workOrder, lineNumber, `Doubled ${orderCounts[line]} times`);
                removeOrderFromInput(workOrder, lineNumber);
            }
            processedLines.add(line);
        } else if (orderCounts[line] === 1) {
            uniqueOrders.push(line);
        }
    }

    updateFailedOrdersList();

    if (uniqueOrders.length === 0) {
        logMessage('No unique orders to process after filtering duplicates.', true);
        return;
    }

    isProcessing = true;
    shouldStopProcessing = false;
    isPaused = false;
    processedCount = 0;
    currentFailedOrder = null;
    currentOrderIndex = 0;
    currentOrdersList = uniqueOrders;

    const processButton = document.getElementById('startProcess');
    const stopButton = document.getElementById('stopProcess');

    if (processButton) {
        processButton.disabled = true;
        processButton.style.display = 'none';
    }
    if (stopButton) stopButton.style.display = 'inline-block';

    loadFailedOrders();
    updateFailedOrdersList();

    logMessage(`Starting to process ${uniqueOrders.length} unique orders...`);

    setupAlertObserver();
    processBatch(uniqueOrders, 0);
};

    // Process batch
    const processBatch = async (orders, startIndex) => {
        if (shouldStopProcessing || !isProcessing) {
            logMessage(`Processing stopped. ${processedCount} of ${orders.length} orders completed.`, false, true);
            const processButton = document.getElementById('startProcess');
            const stopButton = document.getElementById('stopProcess');

            if (processButton) {
                processButton.disabled = false;
                processButton.style.display = 'inline-block';
            }
            if (stopButton) stopButton.style.display = 'none';
            return;
        }

        if (isPaused) {
            logMessage('Paused due to an alert. Please choose an action.', false, true);
            return;
        }

        currentOrderIndex = startIndex;

        if (startIndex >= orders.length) {
            logMessage(`All ${orders.length} orders processed.`, false);
            isProcessing = false;
            const processButton = document.getElementById('startProcess');
            const stopButton = document.getElementById('stopProcess');

            if (processButton) {
                processButton.disabled = false;
                processButton.style.display = 'inline-block';
            }
            if (stopButton) stopButton.style.display = 'none';
            return;
        }

        const orderLine = orders[startIndex];
        const parts = orderLine.split(/\s+/);

        if (parts.length !== 2) {
            logMessage(`Skipping invalid order: ${orderLine}`, true);
            processBatch(orders, startIndex + 1);
            return;
        }

        const workOrder = parts[0].trim();
        const lineNumber = parts[1].trim();

        currentFailedOrder = { workOrder, lineNumber };

        let rows = Array.from(document.querySelectorAll('#grid_WOMCLS2 tbody tr[row-uid].g2row-hdr'))
            .filter(row => row.querySelector(`input[title="Work Order Number"]`) || row.querySelector(`input[id*="WO_NUM_"]`));

        if (enableDebug) {
            const pagerInfo = document.querySelector('.k-pager-info')?.textContent || 'unknown';
            logMessage(`Grid state: ${rows.length} valid rows, Pager info: ${pagerInfo}`);
        }

        if (rows.length === 0) {
            logMessage(`Error- make sure you first fill M and date ${workOrder} ${lineNumber}. Please check :)`, true);
            isProcessing = false;
            const processButton = document.getElementById('startProcess');
            const stopButton = document.getElementById('stopProcess');

            if (processButton) {
                processButton.disabled = false;
                processButton.style.display = 'inline-block';
            }
            if (stopButton) stopButton.style.display = 'none';
            return;
        }

        let rowIndexToUse = lastUsedRowIndex;

        if (startIndex === 0 || currentFailedOrder) {
            const highlightedRowIndex = getHighlightedRowIndex(rows);
            if (highlightedRowIndex !== -1) {
                rowIndexToUse = highlightedRowIndex;
                if (enableDebug) logMessage(`Using highlighted row at index ${rowIndexToUse} for order ${workOrder} ${lineNumber}`);
            }
        }

        if (rowIndexToUse >= rows.length) {
            rowIndexToUse = 0;
            if (enableDebug) logMessage(`Row index ${rowIndexToUse} out of bounds, resetting to 0`, false, true);
        }

        try {
            await processOrder(workOrder, lineNumber, DELAY_TIME, rowIndexToUse, rows);
            lastUsedRowIndex = rowIndexToUse;

            if (!isPaused) {
                processedCount++;
                logMessage(`Processed order: ${workOrder} ${lineNumber} (${processedCount}/${orders.length})`);
                currentFailedOrder = null;
                lastUsedRowIndex = (lastUsedRowIndex + 1) % rows.length;

                setTimeout(() => {
                    processBatch(orders, startIndex + 1);
                }, DELAY_TIME);
            }
        } catch (error) {
            if (isPaused) {
                logMessage(`Paused at order ${workOrder} ${lineNumber}. Waiting for your action.`, false, true);
                return;
            }

            logMessage(`Failed to process order ${workOrder} ${lineNumber}.`, true);

            if (currentFailedOrder) {
                addFailedOrder(workOrder, lineNumber, error.message);
                removeOrderFromInput(workOrder, lineNumber);
                updateFailedOrdersList();
                currentFailedOrder = null;
            }

            await sendEscKey();

            if (enableDebug) logMessage(`Retaining last used row index ${lastUsedRowIndex} for next order after failure`);
            setTimeout(() => {
                processBatch(orders, startIndex + 1);
            }, DELAY_TIME);
        }
    };

    // Process a single order
    const processOrder = async (workOrder, lineNumber, delay, index, rows) => {
        const targetRow = rows[index];
        const rowUid = targetRow.getAttribute('row-uid');
        const rowClass = targetRow.className;
        if (enableDebug) logMessage(`Processing row ${index + 1} with row-uid: ${rowUid} (class: ${rowClass})`);

        let woInputField = null;
        const maxRetries = 5;
        let retryCount = 0;

        while (!woInputField && retryCount < maxRetries) {
            woInputField = targetRow.querySelector(`input[title="Work Order Number"]`) ||
                           targetRow.querySelector(`input[id*="WO_NUM_"]`);
            if (!woInputField) {
                if (enableDebug) logMessage(`Retry ${retryCount + 1}/${maxRetries}: Work Order input field not found in row ${index + 1} (row-uid: ${rowUid}). Waiting...`, true);
                await new Promise(resolve => setTimeout(resolve, delay * 3));
                retryCount++;
            }
        }

        if (!woInputField) {
            const availableInputs = targetRow.querySelectorAll('input');
            const inputDetails = Array.from(availableInputs).map(input => `id: ${input.id}, title: ${input.title}`).join('; ');
            throw new Error(`Work Order input field not found in row ${index + 1} (row-uid: ${rowUid}) after retries. Found ${availableInputs.length} input elements: [${inputDetails}]`);
        }

        if (enableDebug) logMessage(`Found work order input field for WO: ${workOrder} (id: ${woInputField.id})`);

        woInputField.value = '';
        woInputField.dispatchEvent(new Event('input', { bubbles: true }));
        woInputField.value = workOrder;
        woInputField.dispatchEvent(new Event('input', { bubbles: true }));
        woInputField.dispatchEvent(new Event('change', { bubbles: true }));

        if (woInputField.value !== workOrder) {
            throw new Error(`Failed to set work order number: expected ${workOrder}, got ${woInputField.value}`);
        }

        await new Promise(resolve => setTimeout(resolve, delay));
        await sendEnterKey(woInputField, 1, delay);
        await new Promise(resolve => setTimeout(resolve, delay * 2));

        let lineInputField = null;
        retryCount = 0;

        while (!lineInputField && retryCount < maxRetries) {
            lineInputField = targetRow.querySelector(`input[title="Work Order Line Number"]`) ||
                             targetRow.querySelector(`input[id*="WO_LINE_"]`);
            if (!lineInputField) {
                if (enableDebug) logMessage(`Retry ${retryCount + 1}/${maxRetries}: Work Order Line Number input field not found in row ${index + 1} (row-uid: ${rowUid}). Waiting...`, true);
                await new Promise(resolve => setTimeout(resolve, delay * 3));
                retryCount++;
            }
        }

        if (!lineInputField) {
            throw new Error(`Work Order Line Number input field not found in row ${index + 1} (row-uid: ${rowUid}) after retries`);
        }

        if (enableDebug) logMessage(`Found line input field for line: ${lineNumber} (id: ${lineInputField.id})`);

        lineInputField.value = '';
        lineInputField.dispatchEvent(new Event('input', { bubbles: true }));
        lineInputField.value = lineNumber;
        lineInputField.dispatchEvent(new Event('input', { bubbles: true }));
        lineInputField.dispatchEvent(new Event('change', { bubbles: true }));

        if (lineInputField.value !== lineNumber) {
            throw new Error(`Failed to set line number: expected ${lineNumber}, got ${lineInputField.value}`);
        }

        if (enableDebug) logMessage(`Set line number to: ${lineNumber} (verified)`);

        await new Promise(resolve => setTimeout(resolve, delay));
        await sendEnterKey(lineInputField, 2, delay);
        await new Promise(resolve => setTimeout(resolve, delay * 2));
    };

    // Create floating button
    const createFloatingButton = () => {
        try {
            if (document.getElementById('gloviaFloatingButton')) {
                if (enableDebug) logMessage('Floating button already exists, skipping creation.');
                return;
            }

            const button = document.createElement('button');
            button.id = 'gloviaFloatingButton';
            button.textContent = 'Orders Closer';
            document.body.appendChild(button);

            button.addEventListener('click', () => {
                const dialog = document.getElementById('gloviaOrdersDialog');
                if (dialog) {
                    dialog.style.display = dialog.style.display === 'none' ? 'block' : 'none';
                    if (dialog.style.display === 'block') {
                        dialog.style.animation = 'slideIn 0.3s ease-out';
                    }
                    if (enableDebug) logMessage(`Dialog display toggled to: ${dialog.style.display}`);
                } else {
                    createDialog();
                    if (enableDebug) logMessage('Dialog created from floating button click.');
                }
            });

            if (enableDebug) logMessage('Floating button created successfully.');
        } catch (error) {
            if (enableDebug) logMessage(`Error creating floating button: ${error.message}`, true);
        }
    };

    // Initialize script
    const init = async () => {
        const maxInitRetries = 3;
        let initRetryCount = 0;

        while (initRetryCount < maxInitRetries) {
            try {
                if (document.body) {
                    createFloatingButton();
                    createDialog();
                    if (enableDebug) logMessage('Script initialized successfully.');
                    return;
                } else {
                    if (enableDebug) logMessage(`Retry ${initRetryCount + 1}/${maxInitRetries}: Document body not ready. Waiting...`, true);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    initRetryCount++;
                }
            } catch (error) {
                if (enableDebug) logMessage(`Initialization error on attempt ${initRetryCount + 1}: ${error.message}`, true);
                await new Promise(resolve => setTimeout(resolve, 1000));
                initRetryCount++;
            }
        }

        if (enableDebug) logMessage('Failed to initialize script. Contact OEO', true);
        createReloadButton();
    };

    // Run GitHub check every 30 minutes
setInterval(updateStatusFromGitHub, 60 * 1000);

    // Start the configuration check
    setTimeout(checkPageAndInitialize, 1000);

    // Fallback check for menu after timeout
    setTimeout(() => {
        if (!document.getElementById('gloviaOrdersDialog') &&
            !document.getElementById('orders-closer-disabled')) {
            if (enableDebug) logMessage('Menu not detected after timeout, adding reload button');
            createReloadButton();
        }
    }, 5000);
})();