// ==UserScript==
// @name         Delivery Date / Update
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Adds a menu to batch update delivery dates with human-like timing, including clearing old data and saving with double-click retry logic. Ignores middle number in input like "13/06/25 87267 0021". Skips lines if delivery date matches input (e.g., 01/08/25) by pressing Escape three times, showing "Date matches 01/08/25, skipped".
// @author       Claude
// @match        http://fre-prod-glfe/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539217/Delivery%20Date%20%20Update.user.js
// @updateURL https://update.greasyfork.org/scripts/539217/Delivery%20Date%20%20Update.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration (unchanged)
    const config = {
        lineNumberFieldId: 'TextWindowField_SO_LINE_W_SODSUM0085',
        deliveryDateFieldId: 'DateField_SO_DEL_PROMISE_DATE_W_SODSUM0021',
        containerBoxId: 'Box_BOX_W_SODSUM0041',
        orderNumberFieldId: 'TextWindowField_SO_W_SORDS1397',
        salesLinesTabId: 'Tab_SALES_LINES_101',
        deliveriesTabId: 'Tab_DELIVERIES_299',
        retryAttempts: 10,
        retryDelay: 250,
        initialDelay: 800,
        humanDelayAfterLineNumber: 1000,
        humanDelayAfterDate: 1000,
        humanDelayBetweenItems: 2000,
        humanDelayAfterEnter: 800,
        saveRetryDelay: 1500,
        maxSaveAttempts: 5,
        saveDoubleClickDelay: 300,
        escapeDelay: 100,
        tabDelay: 2000,
        clickDelay: 1000,
        maxSaveReturnAttempts: 8,
        saveReturnRetryDelay: 1500,
        confirmationDialogId: 'delivery-date-confirmation-dialog',
        confirmationCheckboxId: 'skip-confirmation-checkbox',
        errorDialogSelector: '.k-widget.k-window.g2Alert.k-error-colored',
        errorDialogButtonSelector: 'button.k-button.alertButton.confirmOk',
        dialogTimeout: 30000, // Timeout for user action on dialogs
        successDialogSelector: '.k-widget.k-window.g2Alert.k-success-colored', // New selector for success dialogs
    };

    // Global error handler (unchanged)
    window.addEventListener('error', function(event) {
        console.error('[Delivery Date Updater] Error:', event.error);
    });
 function createMenu() {
    try {
        console.log('[Delivery Date Updater] Creating menu...');

        // Check if menu already exists (prevent duplicates)
        const existingMenu = document.getElementById('delivery-date-updater-menu');
        if (existingMenu) {
            console.log('[Delivery Date Updater] Menu already exists, removing old instance');
            existingMenu.remove();
        }

        // Create main container
        const menuContainer = document.createElement('div');
        menuContainer.id = 'delivery-date-updater-menu';
        Object.assign(menuContainer.style, {
            position: 'fixed',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
            zIndex: '9999',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: '400px',
            minHeight: '150px',
            resize: 'both',
            overflow: 'auto'
        });

        // Create resize handle
        const resizeHandle = document.createElement('div');
        Object.assign(resizeHandle.style, {
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '10px',
            height: '10px',
            backgroundColor: '#ccc',
            cursor: 'se-resize',
            borderTopLeftRadius: '5px'
        });
        menuContainer.appendChild(resizeHandle);

        // Create header
        const header = document.createElement('div');
        header.textContent = 'Delivery Date Updater';
        Object.assign(header.style, {
            fontWeight: 'bold',
            fontSize: '14px',
            borderBottom: '1px solid #ccc',
            paddingBottom: '5px',
            marginBottom: '5px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        });

        // Create minimize button
        const minimizeBtn = document.createElement('button');
        minimizeBtn.textContent = '_';
        minimizeBtn.title = 'Minimize';
        Object.assign(minimizeBtn.style, {
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            fontSize: '14px',
            fontWeight: 'bold'
        });

        let minimized = false;
        let contentContainer;

        minimizeBtn.addEventListener('click', () => {
            try {
                minimized = !minimized;
                contentContainer.style.display = minimized ? 'none' : 'flex';
                minimizeBtn.textContent = minimized ? '□' : '_';
                menuContainer.style.width = minimized ? 'auto' : calculateDialogWidth(textarea.value);
                menuContainer.style.padding = minimized ? '5px' : '10px';
                menuContainer.style.right = '10px';
                menuContainer.style.left = '';
                menuContainer.style.resize = minimized ? 'none' : 'both';
                menuContainer.style.overflow = minimized ? 'hidden' : 'auto';
                resizeHandle.style.display = minimized ? 'none' : 'block';
            } catch (error) {
                console.error('[Delivery Date Updater] Error in minimize button handler:', error);
                updateStatus(`❌ Error minimizing dialog: ${error.message}`, 'error');
            }
        });

        header.appendChild(minimizeBtn);
        menuContainer.appendChild(header);

        // Create content container
        contentContainer = document.createElement('div');
        Object.assign(contentContainer.style, {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        });
        menuContainer.appendChild(contentContainer);

        // Create instructions
        const instructions = document.createElement('div');
        instructions.textContent = 'Enter data in format: "16/05/25 86982 0002" or "16/05/25 86982 0002 0001". Processes order number, updates delivery date for line, and selects delivery line if provided.';
        Object.assign(instructions.style, {
            fontSize: '11px',
            color: '#666',
            marginBottom: '2px'
        });
        contentContainer.appendChild(instructions);

        // Create textarea for batch input
        const textarea = document.createElement('textarea');
        textarea.placeholder = '16/05/25 86982 0002\n16/05/25 86982 0002 0001';
        textarea.rows = 5;
        Object.assign(textarea.style, {
            width: '100%',
            resize: 'vertical',
            fontFamily: 'monospace',
            fontSize: '12px',
            boxSizing: 'border-box'
        });
        contentContainer.appendChild(textarea);

        // Create line count display
        const lineCountDisplay = document.createElement('div');
        lineCountDisplay.textContent = 'Lines: 0';
        Object.assign(lineCountDisplay.style, {
            fontSize: '11px',
            color: '#333',
            marginTop: '2px'
        });
        contentContainer.appendChild(lineCountDisplay);

        // Create failed orders box
        const failedOrdersContainer = document.createElement('div');
        Object.assign(failedOrdersContainer.style, {
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            marginTop: '5px'
        });

        const failedOrdersLabel = document.createElement('div');
        failedOrdersLabel.textContent = 'Failed Orders:';
        Object.assign(failedOrdersLabel.style, {
            fontSize: '11px',
            fontWeight: 'bold',
            color: '#333'
        });

        const failedOrdersBox = document.createElement('div');
        failedOrdersBox.id = 'failed-orders-box';
        Object.assign(failedOrdersBox.style, {
            backgroundColor: '#ffebee',
            border: '1px solid #f44336',
            borderRadius: '3px',
            padding: '5px',
            fontSize: '11px',
            fontFamily: 'monospace',
            color: '#d32f2f',
            maxHeight: '100px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap'
        });
        failedOrdersBox.textContent = 'No failed orders';

        failedOrdersContainer.appendChild(failedOrdersLabel);
        failedOrdersContainer.appendChild(failedOrdersBox);
        contentContainer.appendChild(failedOrdersContainer);

        // Create checkbox for skipping confirmation
        const confirmationContainer = document.createElement('div');
        confirmationContainer.style.display = 'flex';
        confirmationContainer.style.alignItems = 'center';
        confirmationContainer.style.gap = '5px';

        const skipConfirmationCheckbox = document.createElement('input');
        skipConfirmationCheckbox.type = 'checkbox';
        skipConfirmationCheckbox.id = config.confirmationCheckboxId;
        skipConfirmationCheckbox.checked = true;
        Object.assign(skipConfirmationCheckbox.style, {
            cursor: 'pointer'
        });

        skipConfirmationCheckbox.addEventListener('change', () => {
            console.log('[Delivery Date Updater] Skip confirmation checkbox state:', skipConfirmationCheckbox.checked);
        });

        const skipConfirmationLabel = document.createElement('label');
        skipConfirmationLabel.textContent = 'Skip save confirmation';
        skipConfirmationLabel.setAttribute('for', config.confirmationCheckboxId);
        Object.assign(skipConfirmationLabel.style, {
            fontSize: '11px',
            cursor: 'pointer'
        });

        confirmationContainer.appendChild(skipConfirmationCheckbox);
        confirmationContainer.appendChild(skipConfirmationLabel);
        contentContainer.appendChild(confirmationContainer);

        // Create checkbox for auto-skipping failed orders on G2 alerts
        const autoSkipContainer = document.createElement('div');
        autoSkipContainer.style.display = 'flex';
        autoSkipContainer.style.alignItems = 'center';
        autoSkipContainer.style.gap = '5px';

        const autoSkipCheckbox = document.createElement('input');
        autoSkipCheckbox.type = 'checkbox';
        autoSkipCheckbox.id = 'auto-skip-failed-checkbox';
        autoSkipCheckbox.checked = false; // Default to unchecked
        Object.assign(autoSkipCheckbox.style, {
            cursor: 'pointer'
        });

        autoSkipCheckbox.addEventListener('change', () => {
            console.log('[Delivery Date Updater] Auto-skip failed checkbox state:', autoSkipCheckbox.checked);
        });

        const autoSkipLabel = document.createElement('label');
        autoSkipLabel.textContent = 'Auto-skip and mark failed on G2 alerts';
        autoSkipLabel.setAttribute('for', 'auto-skip-failed-checkbox');
        Object.assign(autoSkipLabel.style, {
            fontSize: '11px',
            cursor: 'pointer'
        });

        autoSkipContainer.appendChild(autoSkipCheckbox);
        autoSkipContainer.appendChild(autoSkipLabel);
        contentContainer.appendChild(autoSkipContainer);

        // Function to update line count
        function updateLineCount(text) {
            try {
                const lines = text.trim().split('\n').filter(line => line.trim() !== '');
                lineCountDisplay.textContent = `Lines: ${lines.length}`;
            } catch (error) {
                console.error('[Delivery Date Updater] Error updating line count:', error);
                lineCountDisplay.textContent = 'Lines: Error';
            }
        }

        // Function to update failed orders box
        function updateFailedOrders(failedLines) {
            try {
                if (failedLines.length === 0) {
                    failedOrdersBox.textContent = 'No failed orders';
                } else {
                    failedOrdersBox.textContent = failedLines.join('\n');
                }
            } catch (error) {
                console.error('[Delivery Date Updater] Error updating failed orders:', error);
                failedOrdersBox.textContent = 'Error displaying failed orders';
            }
        }

        // Initial line count
        updateLineCount(textarea.value);

        // Function to calculate dialog width based on textarea content
        function calculateDialogWidth(text) {
            try {
                const lines = text.trim().split('\n').filter(line => line.trim() !== '');
                const placeholderLines = textarea.placeholder.split('\n');
                const allLines = lines.length > 0 ? lines : placeholderLines;
                const longestLine = allLines.reduce((max, line) => Math.max(max, line.length), 0);
                const charWidth = 7;
                const minWidth = 200;
                const maxWidth = 400;
                const padding = 20;
                let calculatedWidth = longestLine * charWidth + padding;
                return `${Math.min(Math.max(calculatedWidth, minWidth), maxWidth)}px`;
            } catch (error) {
                console.error('[Delivery Date Updater] Error calculating dialog width:', error);
                return '200px';
            }
        }

        // Set initial dialog width
        menuContainer.style.width = calculateDialogWidth(textarea.value);

        // Update dialog width and line count on textarea input
        textarea.addEventListener('input', () => {
            try {
                menuContainer.style.width = calculateDialogWidth(textarea.value);
                updateLineCount(textarea.value);
            } catch (error) {
                console.error('[Delivery Date Updater] Error updating dialog width or line count:', error);
                menuContainer.style.width = '200px';
                lineCountDisplay.textContent = 'Lines: Error';
            }
        });

        // Create speed control slider
        const speedContainer = document.createElement('div');
        speedContainer.style.display = 'flex';
        speedContainer.style.alignItems = 'center';
        speedContainer.style.gap = '8px';

        const speedLabel = document.createElement('label');
        speedLabel.textContent = 'Speed:';
        speedLabel.style.fontSize = '11px';

        const speedSlider = document.createElement('input');
        speedSlider.type = 'range';
        speedSlider.min = '0.5';
        speedSlider.max = '2.0';
        speedSlider.step = '0.1';
        speedSlider.value = '1.5';
        speedSlider.style.flexGrow = '1';

        const speedValue = document.createElement('span');
        speedValue.textContent = '1.5x';
        speedValue.style.fontSize = '11px';
        speedValue.style.width = '30px';

        speedSlider.addEventListener('input', () => {
            try {
                const value = parseFloat(speedSlider.value).toFixed(1);
                speedValue.textContent = `${value}x`;
            } catch (error) {
                console.error('[Delivery Date Updater] Error in speed slider handler:', error);
                updateStatus(`❌ Error updating speed: ${error.message}`, 'error');
            }
        });

        speedContainer.appendChild(speedLabel);
        speedContainer.appendChild(speedSlider);
        speedContainer.appendChild(speedValue);
        contentContainer.appendChild(speedContainer);

        // Create status display
        const statusDisplay = document.createElement('div');
        statusDisplay.textContent = 'Ready';
        Object.assign(statusDisplay.style, {
            fontSize: '11px',
            padding: '2px 5px',
            backgroundColor: '#e0e0e0',
            color: '#333',
            borderRadius: '3px'
        });
        contentContainer.appendChild(statusDisplay);

        // Create button container
        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, {
            display: 'flex',
            justifyContent: 'space-between',
            gap: '5px'
        });
        contentContainer.appendChild(buttonContainer);

        // Create process button
        const processButton = document.createElement('button');
        processButton.textContent = 'Process';
        Object.assign(processButton.style, {
            padding: '5px 10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            flexGrow: '2'
        });
        buttonContainer.appendChild(processButton);

        // Create clear button
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear';
        Object.assign(clearButton.style, {
            padding: '5px 10px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            flexGrow: '1'
        });
        buttonContainer.appendChild(clearButton);

        // Create stop button (initially hidden)
        const stopButton = document.createElement('button');
        stopButton.textContent = 'Stop';
        Object.assign(stopButton.style, {
            padding: '5px 10px',
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            flexGrow: '1',
            display: 'none'
        });
        buttonContainer.appendChild(stopButton);

        // Processing state variables
        let isProcessing = false;
        let shouldStop = false;
        let previousOrderNumber = null;
        let failedOrders = [];

        // Add event listener for clear button
        clearButton.addEventListener('click', () => {
            try {
                textarea.value = '';
                failedOrders = [];
                updateStatus('Cleared', 'info');
                menuContainer.style.width = calculateDialogWidth(textarea.value);
                updateLineCount(textarea.value);
                updateFailedOrders(failedOrders);
                previousOrderNumber = null;
            } catch (error) {
                console.error('[Delivery Date Updater] Error in clear button handler:', error);
                updateStatus(`❌ Error clearing textarea: ${error.message}`, 'error');
            }
        });

        // Add event listener for stop button
        stopButton.addEventListener('click', () => {
            try {
                if (isProcessing) {
                    shouldStop = true;
                    updateStatus('Stopping after current item...', 'warning');
                    stopButton.disabled = true;
                }
            } catch (error) {
                console.error('[Delivery Date Updater] Error in stop button handler:', error);
                updateStatus(`❌ Error stopping process: ${error.message}`, 'error');
            }
        });

        // Add event listener for process button
        processButton.addEventListener('click', async () => {
            try {
                const lines = textarea.value.trim().split('\n').filter(line => line.trim() !== '');
                if (lines.length === 0) {
                    updateStatus('No data to process', 'warning');
                    return;
                }

                // Get speed multiplier
                const speedMultiplier = parseFloat(speedSlider.value);

                // Update UI for processing state
                isProcessing = true;
                shouldStop = false;
                processButton.disabled = true;
                clearButton.disabled = true;
                stopButton.style.display = 'block';
                stopButton.disabled = false;

                window.scriptIsPaused = false;
                console.log('[Delivery Date Updater] Initialized scriptIsPaused to false');

                // Process each line sequentially
                for (let i = 0; i < lines.length; i++) {
                    let pauseTimeout = 30000; // 30 seconds max pause
                    while (window.scriptIsPaused && pauseTimeout > 0) {
                        console.log('[Delivery Date Updater] Script paused, waiting for user action...');
                        updateStatus('⏸ Script paused due to G2 alert. Awaiting user action...', 'warning');
                        await humanDelay(1000, speedMultiplier);
                        pauseTimeout -= 1000;
                    }
                    if (pauseTimeout <= 0) {
                        console.warn('[Delivery Date Updater] Pause timeout reached, resuming processing');
                        window.scriptIsPaused = false;
                        updateStatus('⚠️ Pause timeout, resuming processing', 'warning');
                    }

                    if (shouldStop) {
                        updateStatus('Processing stopped by user', 'warning');
                        break;
                    }

                    const line = lines[i].trim();
                    updateStatus(`Processing ${i+1}/${lines.length}: ${line}`, 'processing');
                    const match = line.match(/(\d{2}\/\d{2}\/\d{2})\s+([\w\d]+)\s+(\d+)(?:\s+(\d+))?/);
                    if (!match) {
                        updateStatus(`Invalid format on line ${i+1}: ${line}`, 'error');
                        if (!failedOrders.includes(line)) {
                            failedOrders.push(line);
                            updateFailedOrders(failedOrders);
                        }
                        await humanDelay(2000, speedMultiplier);
                        continue;
                    }

                    const dateStr = match[1];
                    const orderNumber = match[2];
                    const lineNumber = match[3];
                    const deliveryLine = match[4] || null;
                    const convertedDate = dateStr.replace(/\//g, '');

                    try {
                        const isLastLine = i === lines.length - 1;
                        const nextOrderNumber = !isLastLine ? lines[i + 1].match(/(\d{2}\/\d{2}\/\d{2})\s+([\w\d]+)\s+(\d+)/)?.[2] : null;
                        const needsReturn = isLastLine || (nextOrderNumber && nextOrderNumber !== orderNumber);

                        const success = await processLineUpdate(orderNumber, lineNumber, dateStr, convertedDate, speedMultiplier, previousOrderNumber, deliveryLine, skipConfirmationCheckbox, line, failedOrders, updateFailedOrders);
                        if (success) {
                            updateStatus(`Completed ${i+1}/${lines.length}: Order ${orderNumber}, Line ${lineNumber}${deliveryLine ? `, Delivery ${deliveryLine}` : ''}`, 'success');
                            previousOrderNumber = orderNumber;
                        } else {
                            updateStatus(`Failed ${i+1}/${lines.length}: Order ${orderNumber}, Line ${lineNumber}${deliveryLine ? `, Delivery ${deliveryLine}` : ''}`, 'error');
                            if (!failedOrders.includes(line)) {
                                failedOrders.push(line);
                                updateFailedOrders(failedOrders);
                            }
                            previousOrderNumber = null;
                        }

                        if (needsReturn) {
                            await escapeToOrderNumberField(speedMultiplier, line, failedOrders, updateFailedOrders);
                        }

                        await humanDelay(config.humanDelayBetweenItems, speedMultiplier);
                    } catch (error) {
                        console.error('[Delivery Date Updater] Error processing line:', error);
                        updateStatus(`Error: ${error.message}`, 'error');
                        if (!failedOrders.includes(line)) {
                            failedOrders.push(line);
                            updateFailedOrders(failedOrders);
                        }
                        previousOrderNumber = null;
                        await humanDelay(2000, speedMultiplier);
                    }
                }

                updateStatus('Finalizing: Returning to order number field', 'processing');
                const finalReturnSuccess = await escapeToOrderNumberField(speedMultiplier, null, failedOrders, updateFailedOrders);
                if (!finalReturnSuccess) {
                    updateStatus('❌ Failed to return to order number field at end', 'error');
                } else {
                    updateStatus('✓ Returned to order number field', 'success');
                }

                // Reset UI
                isProcessing = false;
                updateStatus('Processing complete', 'success');
                processButton.disabled = false;
                clearButton.disabled = false;
                stopButton.style.display = 'none';
                previousOrderNumber = null;
            } catch (error) {
                console.error('[Delivery Date Updater] Error in processing loop:', error);
                updateStatus(`❌ Error processing: ${error.message}`, 'error');
                await escapeToOrderNumberField(speedMultiplier, null, failedOrders, updateFailedOrders);
                isProcessing = false;
                processButton.disabled = false;
                clearButton.disabled = false;
                stopButton.style.display = 'none';
                previousOrderNumber = null;
            }
        });

        // Append menu to document
        document.body.appendChild(menuContainer);
        makeDraggable(menuContainer, header);

        // Return menu components for external use
        return { menuContainer, updateStatus, skipConfirmationCheckbox, autoSkipCheckbox, failedOrders, updateFailedOrders };
    } catch (error) {
        console.error('[Delivery Date Updater] Error creating menu:', error);
        updateStatus(`❌ Error creating menu: ${error.message}`, 'error');
        return null;
    }
}
    ////////////////


    async function handleErrorDialog(inputLine, failedOrders, updateFailedOrders, speedMultiplier, autoSkipCheckbox) {
    try {
        if (!inputLine || typeof inputLine !== 'string') {
            console.error('[Delivery Date Updater] Invalid inputLine:', inputLine);
            updateStatus('❌ Invalid input line, skipping', 'error');
            window.scriptIsPaused = false;
            return { continueProcessing: true, shouldSkip: true };
        }

        const cleanedInputLine = inputLine.trim().split(/\s+/).filter(part => part).join('\t');
        if (!/^\d{2}\/\d{2}\/\d{2}\t\w+\t\d+(?:\t\d+)?$/.test(cleanedInputLine)) {
            console.error(`[Delivery Date Updater] Malformed input line: ${cleanedInputLine}`);
            updateStatus(`❌ Malformed input line: ${cleanedInputLine}, skipping`, 'error');
            if (!failedOrders.includes(cleanedInputLine)) {
                failedOrders.push(cleanedInputLine);
                updateFailedOrders(failedOrders);
            }
            window.scriptIsPaused = false;
            return { continueProcessing: true, shouldSkip: true };
        }

        console.log(`[Delivery Date Updater] Handling G2 dialog for inputLine: ${cleanedInputLine}`);

        const existingActionButtons = document.getElementById('alert-action-buttons');
        if (existingActionButtons) existingActionButtons.remove();
        const existingCheckboxContainer = document.getElementById('error-dialog-action-options');
        if (existingCheckboxContainer) existingCheckboxContainer.remove();

        const errorDialogSelectors = [
            config.errorDialogSelector,
            config.successDialogSelector,
            '.k-window.g2Alert',
            '.k-widget.k-window[role="alertdialog"]',
            '.k-window-content.k-error-colored',
            '.k-window-content.k-success-colored',
            'div[role="alertdialog"]',
            '.k-window',
            '[class*="g2Alert"]',
            '.k-widget.k-window'
        ];

        let errorDialog = null;
        for (const selector of errorDialogSelectors) {
            errorDialog = document.querySelector(selector);
            if (errorDialog) {
                console.log(`[Delivery Date Updater] G2 alert found with selector: ${selector}`);
                break;
            }
        }

        if (!errorDialog) {
            console.log(`[Delivery Date Updater] No G2 alert detected for line: ${cleanedInputLine}`);
            window.scriptIsPaused = false;
            return { continueProcessing: true, shouldSkip: false };
        }

        window.scriptIsPaused = true;
        console.log('[Delivery Date Updater] Set scriptIsPaused to true due to G2 alert');

        let errorMessageText = 'Unknown Error';
        const possibleTextElements = [
            errorDialog.querySelector('.alertText'),
            errorDialog.querySelector('.g2AlertText'),
            errorDialog.querySelector('.alertContent'),
            errorDialog.querySelector('[role="alertdialog"]'),
            Array.from(errorDialog.querySelectorAll('div')).find(div =>
                !div.querySelector('button') && div.textContent.trim().length > 0
            )
        ];

        for (const elem of possibleTextElements) {
            if (elem && elem.textContent.trim()) {
                errorMessageText = elem.textContent.trim().replace(/\s*(OK|Cancel)\s*$/i, '').trim();
                break;
            }
        }

        console.log(`[Delivery Date Updater] G2 Alert detected: ${errorMessageText}`);
        updateStatus(`⚠️ G2 Alert: ${errorMessageText}`, errorDialog.classList.contains('k-error-colored') ? 'error' : 'warning');

        const dialogContentSelectors = [
            '.k-window-content',
            '.alertContent',
            '.g2AlertContent',
            '.k-window-content-inner',
            'div[style*="padding"]',
            'div:not([style*="display: none"])'
        ];

        let dialogContent = null;
        for (const selector of dialogContentSelectors) {
            dialogContent = errorDialog.querySelector(selector);
            if (dialogContent) {
                console.log(`[Delivery Date Updater] Dialog content found with selector: ${selector}`);
                break;
            }
        }

        if (!dialogContent) {
            dialogContent = errorDialog;
            console.warn(`[Delivery Date Updater] No specific content area found, using dialog as fallback`);
        }

        const checkboxContainer = document.createElement('div');
        checkboxContainer.id = 'error-dialog-action-options';
        Object.assign(checkboxContainer.style, {
            marginTop: '15px',
            marginBottom: '10px',
            paddingTop: '10px',
            borderTop: '1px solid #eee',
            textAlign: 'left',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px'
        });

        checkboxContainer.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <input type="checkbox" id="skip-order-checkbox" style="margin-right: 8px; cursor: pointer;">
                <label for="skip-order-checkbox" style="font-weight: bold; cursor: pointer;">Skip this order and continue with next</label>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <input type="checkbox" id="continue-order-checkbox" style="margin-right: 8px; cursor: pointer;">
                <label for="continue-order-checkbox" style="font-weight: bold; cursor: pointer;">Continue processing this order</label>
            </div>
            <div style="color: #666; font-size: 0.9em;">
                Check one option before clicking OK. "Skip" marks this order as failed; "Continue" proceeds with processing.
            </div>
        `;

        let appendAttempts = 0;
        const maxAppendAttempts = 3;
        let appended = false;
        while (appendAttempts < maxAppendAttempts && !appended) {
            try {
                const buttonContainer = dialogContent.querySelector('.alertButtons') ||
                                       dialogContent.querySelector('div[style*="text-align"]') ||
                                       dialogContent.querySelector('div:has(button)') ||
                                       dialogContent.querySelector('div[style*="padding"]');
                if (buttonContainer) {
                    dialogContent.insertBefore(checkboxContainer, buttonContainer);
                    console.log('[Delivery Date Updater] Checkboxes inserted before button container');
                } else {
                    dialogContent.appendChild(checkboxContainer);
                    console.log('[Delivery Date Updater] Checkboxes appended to dialog content');
                }
                appended = true;
            } catch (appendError) {
                console.warn(`[Delivery Date Updater] Failed to insert checkboxes (attempt ${appendAttempts + 1}):`, appendError);
                appendAttempts++;
                await humanDelay(500, speedMultiplier);
            }
        }

        if (!appended) {
            console.error('[Delivery Date Updater] Failed to insert checkboxes after retries');
            updateStatus('❌ Failed to display action options, skipping order', 'error');
            if (!failedOrders.includes(cleanedInputLine)) {
                failedOrders.push(cleanedInputLine);
                updateFailedOrders(failedOrders);
            }
            window.scriptIsPaused = false;
            return { continueProcessing: true, shouldSkip: true };
        }

        const okButtonSelectors = [
            'button.alertButton:not(.k-cancel)',
            'button.k-button:not(.k-cancel)',
            'button.k-primary',
            'button[title="OK"]',
            'button[aria-label="OK"]',
            'button'
        ];

        let okButton = null;
        for (const selector of okButtonSelectors) {
            const buttons = errorDialog.querySelectorAll(selector);
            for (const button of buttons) {
                const text = button.textContent.trim().toLowerCase();
                if (text.includes('ok')) {
                    okButton = button;
                    console.log(`[Delivery Date Updater] OK button found with selector: ${selector}`);
                    break;
                }
            }
            if (okButton) break;
        }

        const skipOrder = async () => {
            console.log(`[Delivery Date Updater] Skipping order: ${cleanedInputLine}`);
            updateStatus(`✖ Skipped order: ${cleanedInputLine}`, 'warning');
            if (!failedOrders.includes(cleanedInputLine)) {
                failedOrders.push(cleanedInputLine);
                updateFailedOrders(failedOrders);
                console.log(`[Delivery Date Updater] Added to failedOrders: ${cleanedInputLine}`);
            }
            const reachedOrderField = await escapeToOrderNumberField(speedMultiplier, cleanedInputLine, failedOrders, updateFailedOrders);
            if (!reachedOrderField) {
                updateStatus(`❌ Failed to return to order number field`, 'error');
            } else {
                updateStatus(`✓ Reached order number field`, 'success');
            }
            return { continueProcessing: true, shouldSkip: true };
        };

        const continueOrder = async () => {
            console.log(`[Delivery Date Updater] Continuing with order: ${cleanedInputLine}`);
            updateStatus(`▶️ Resuming processing for order: ${cleanedInputLine}`, 'processing');
            await simulateEscapeKey(document.activeElement || document.body, speedMultiplier);
            return { continueProcessing: true, shouldSkip: false };
        };

        const skipCheckbox = document.getElementById('skip-order-checkbox');
        const continueCheckbox = document.getElementById('continue-order-checkbox');

        if (skipCheckbox && continueCheckbox) {
            skipCheckbox.addEventListener('change', () => {
                if (skipCheckbox.checked) continueCheckbox.checked = false;
            });
            continueCheckbox.addEventListener('change', () => {
                if (continueCheckbox.checked) skipCheckbox.checked = false;
            });
        } else {
            console.warn('[Delivery Date Updater] One or both checkboxes not found');
        }

        const clickOkButton = async () => {
            if (okButton) {
                console.log('[Delivery Date Updater] Attempting to click OK button');
                okButton.focus();
                okButton.click();
                const clickEvents = [
                    new MouseEvent('mousedown', { bubbles: true }),
                    new MouseEvent('mouseup', { bubbles: true }),
                    new MouseEvent('click', { bubbles: true })
                ];
                clickEvents.forEach(event => okButton.dispatchEvent(event));
                console.log('[Delivery Date Updater] Programmatically clicked OK button');
                await humanDelay(100, speedMultiplier);
            } else {
                console.warn('[Delivery Date Updater] OK button not found, simulating Enter key');
                await simulateEnterKey(errorDialog, speedMultiplier);
            }

            const dialogStillExists = document.querySelector(errorDialogSelectors.join(', '));
            if (dialogStillExists) {
                console.warn('[Delivery Date Updater] Dialog still present after attempting to close');
                updateStatus(`⚠️ Failed to close G2 alert dialog`, 'warning');
                await simulateEnterKey(document.body, speedMultiplier);
            }
        };

        const autoSkipEnabled = autoSkipCheckbox && autoSkipCheckbox.checked;
        console.log('[Delivery Date Updater] Auto-skip enabled:', autoSkipEnabled);

        if (autoSkipEnabled) {
            console.log('[Delivery Date Updater] Auto-skip enabled, setting up 3-second timeout');
            updateStatus(`⏳ Auto-skip enabled: 3 seconds to choose action for ${cleanedInputLine}`, 'warning');

            return await new Promise((resolve) => {
                let isHandled = false;

                const timeout = setTimeout(async () => {
                    if (!isHandled) {
                        console.log('[Delivery Date Updater] No action taken in 3 seconds, auto-skipping order');
                        isHandled = true;
                        observer.disconnect();

                        if (skipCheckbox) {
                            skipCheckbox.checked = true;
                            if (continueCheckbox) continueCheckbox.checked = false;
                            console.log('[Delivery Date Updater] Programmatically checked skip checkbox');
                        }

                        await clickOkButton();
                        checkboxContainer.remove();
                        window.scriptIsPaused = false;
                        resolve(skipOrder());
                    }
                }, 3000);

                const handleOkClick = async (e) => {
                    if (isHandled) return;
                    isHandled = true;
                    e.preventDefault();
                    e.stopPropagation();
                    clearTimeout(timeout);
                    observer.disconnect();

                    const skipChecked = skipCheckbox ? skipCheckbox.checked : false;
                    const continueChecked = continueCheckbox ? continueCheckbox.checked : false;
                    console.log(`[Delivery Date Updater] OK button clicked, Skip: ${skipChecked}, Continue: ${continueChecked}`);

                    await clickOkButton();
                    checkboxContainer.remove();
                    window.scriptIsPaused = false;

                    if (skipChecked) {
                        console.log('[Delivery Date Updater] Skip selected, marking as failed');
                        resolve(skipOrder());
                    } else if (continueChecked) {
                        console.log('[Delivery Date Updater] Continue selected, not marking as failed');
                        resolve(continueOrder());
                    } else {
                        console.log('[Delivery Date Updater] No option selected, defaulting to continue');
                        resolve(continueOrder());
                    }
                };

                if (okButton) {
                    okButton.addEventListener('click', handleOkClick, { once: true });
                    console.log('[Delivery Date Updater] OK button click handler attached');
                } else {
                    console.warn('[Delivery Date Updater] OK button not found, relying on MutationObserver');
                }

                const observer = new MutationObserver((mutations) => {
                    const dialogStillVisible = errorDialog.offsetParent !== null && errorDialog.style.display !== 'none';
                    if (!dialogStillVisible && !isHandled) {
                        console.log('[Delivery Date Updater] Dialog closed or hidden via MutationObserver');
                        isHandled = true;
                        clearTimeout(timeout);
                        observer.disconnect();
                        checkboxContainer.remove();
                        window.scriptIsPaused = false;

                        const skipChecked = skipCheckbox ? skipCheckbox.checked : false;
                        const continueChecked = continueCheckbox ? continueCheckbox.checked : false;
                        console.log(`[Delivery Date Updater] Dialog closed, Skip: ${skipChecked}, Continue: ${continueChecked}`);

                        if (skipChecked) {
                            console.log('[Delivery Date Updater] Skip selected, marking as failed');
                            resolve(skipOrder());
                        } else if (continueChecked) {
                            console.log('[Delivery Date Updater] Continue selected, not marking as failed');
                            resolve(continueOrder());
                        } else {
                            console.log('[Delivery Date Updater] No option selected, defaulting to continue');
                            resolve(continueOrder());
                        }
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style', 'class']
                });
            });
        }

        updateStatus(`⏸ Script paused: Select an option and click OK`, 'warning');
        window.scriptIsPaused = true;
        console.log('[Delivery Date Updater] Set scriptIsPaused to true');

        return await new Promise((resolve) => {
            let isHandled = false;

            const handleOkClick = async (e) => {
                if (isHandled) return;
                isHandled = true;
                e.preventDefault();
                e.stopPropagation();
                observer.disconnect();

                const skipChecked = skipCheckbox ? skipCheckbox.checked : false;
                const continueChecked = continueCheckbox ? continueCheckbox.checked : false;
                console.log(`[Delivery Date Updater] OK button clicked, Skip: ${skipChecked}, Continue: ${continueChecked}`);

                await clickOkButton();
                checkboxContainer.remove();
                window.scriptIsPaused = false;

                if (skipChecked) {
                    console.log('[Delivery Date Updater] Skip selected, marking as failed');
                    resolve(skipOrder());
                } else if (continueChecked) {
                    console.log('[Delivery Date Updater] Continue selected, not marking as failed');
                    resolve(continueOrder());
                } else {
                    console.log('[Delivery Date Updater] No option selected, defaulting to continue');
                    resolve(continueOrder());
                }
            };

            if (okButton) {
                okButton.addEventListener('click', handleOkClick, { once: true });
                console.log('[Delivery Date Updater] OK button click handler attached');
            } else {
                console.warn('[Delivery Date Updater] OK button not found, relying on MutationObserver');
            }

            const observer = new MutationObserver((mutations) => {
                const dialogStillVisible = errorDialog.offsetParent !== null && errorDialog.style.display !== 'none';
                if (!dialogStillVisible && !isHandled) {
                    console.log('[Delivery Date Updater] Dialog closed or hidden via MutationObserver');
                    isHandled = true;
                    observer.disconnect();
                    checkboxContainer.remove();
                    window.scriptIsPaused = false;

                    const skipChecked = skipCheckbox ? skipCheckbox.checked : false;
                    const continueChecked = continueCheckbox ? continueCheckbox.checked : false;
                    console.log(`[Delivery Date Updater] Dialog closed, Skip: ${skipChecked}, Continue: ${continueChecked}`);

                    if (skipChecked) {
                        console.log('[Delivery Date Updater] Skip selected, marking as failed');
                        resolve(skipOrder());
                    } else if (continueChecked) {
                        console.log('[Delivery Date Updater] Continue selected, not marking as failed');
                        resolve(continueOrder());
                    } else {
                        console.log('[Delivery Date Updater] No option selected, defaulting to continue');
                        resolve(continueOrder());
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        });
    } catch (error) {
        console.error('[Delivery Date Updater] Error handling G2 Alert:', error);
        updateStatus(`❌ Error handling G2 Alert: ${error.message}`, 'error');
        window.scriptIsPaused = false;
        return { continueProcessing: true, shouldSkip: true };
    }
}
/////////////////////
async function returnToOrderNumberField(speedMultiplier, inputLine = null, failedOrders = [], updateFailedOrders = () => {}) {
    try {
        updateStatus(`🔙 Returning to order number field via Save...`, 'processing');
        const orderNumberField = document.getElementById(config.orderNumberFieldId);
        if (!orderNumberField) {
            updateStatus(`❌ Error: Order number field not found`, 'error');
            return false;
        }

        let attempts = 0;
        const maxAttempts = config.maxSaveReturnAttempts;

        while (attempts < maxAttempts) {
            // Check for G2 dialog
            const errorDialogSelectors = [
                config.errorDialogSelector,
                config.successDialogSelector,
                '.k-window.g2Alert',
                '.k-widget.k-window[role="alertdialog"]',
                '.k-window-content.k-error-colored',
                '.k-window-content.k-success-colored',
                'div[role="alertdialog"]'
            ];
            let errorDialog = null;
            for (const selector of errorDialogSelectors) {
                errorDialog = document.querySelector(selector);
                if (errorDialog) {
                    console.log(`[Delivery Date Updater] G2 alert found with selector: ${selector}`);
                    break;
                }
            }

            if (errorDialog) {
                console.log('[Delivery Date Updater] G2 dialog detected, pausing script');
                window.scriptIsPaused = true;
                updateStatus(`⏸ G2 dialog detected, script paused`, 'warning');

                // Extract error message
                let errorMessageText = 'Unknown error';
                const possibleTextElements = [
                    errorDialog.querySelector('.alertText'),
                    errorDialog.querySelector('.g2AlertText'),
                    errorDialog.querySelector('.alertContent'),
                    errorDialog.querySelector('[role="alertdialog"]'),
                    Array.from(errorDialog.querySelectorAll('div')).find(div =>
                        !div.querySelector('button') && div.textContent.trim().length > 0
                    )
                ];

                for (const elem of possibleTextElements) {
                    if (elem && elem.textContent.trim()) {
                        errorMessageText = elem.textContent.trim().replace(/\s*(OK|Cancel)\s*$/i, '').trim();
                        break;
                    }
                }

                console.log(`[Delivery Date Updater] G2 Alert detected: ${errorMessageText}`);
                updateStatus(`⚠️ G2 Alert: ${errorMessageText}`, 'error');

                // Handle the G2 dialog
                const errorDialogResult = await handleErrorDialog(inputLine || 'Return to order number field', failedOrders, updateFailedOrders, speedMultiplier);
                if (errorDialogResult.shouldSkip || !errorDialogResult.continueProcessing) {
                    updateStatus(`🛑 Stopped return to order number field due to G2 dialog`, 'warning');
                    return false;
                }
            }

            // Check if already at order number field
            const isFocused = await isOrderNumberFieldFocused();
            if (isFocused) {
                updateStatus(`✓ Returned to order number field`, 'success');
                orderNumberField.focus();
                await humanDelay(500, speedMultiplier);
                return document.activeElement === orderNumberField;
            }

            // Attempt save with F3
            const saveSuccess = await clickSaveButton(speedMultiplier);
            if (!saveSuccess) {
                updateStatus(`⚠️ Save button click failed during return`, 'warning');
            }

            // Check if tabs are disabled
            const tabGroup = document.getElementById('tabGroup_W_SORDS1KEEP');
            if (tabGroup) {
                const tabs = tabGroup.querySelectorAll('button.k-button.G2Tab');
                const allTabsDisabled = Array.from(tabs).every(tab =>
                    tab.classList.contains('k-state-disabled') && tab.hasAttribute('disabled')
                );
                if (allTabsDisabled) {
                    updateStatus(`⏳ All tabs disabled, applying stabilization delay...`, 'processing');
                    await humanDelay(5000, speedMultiplier); // Increased to 5 seconds for stability
                }
            }

            attempts++;
            await humanDelay(config.saveReturnRetryDelay, speedMultiplier);
        }

        updateStatus(`❌ Failed to return to order number field after ${maxAttempts} Save attempts`, 'error');
        return false;
    } catch (error) {
        console.error('[Delivery Date Updater] Error returning to order number field:', error);
        updateStatus(`❌ Error returning to order number field: ${error.message}`, 'error');
        return false;
    }
}

///////////

 async function processLineUpdate(orderNumber, lineNumber, dateStr, newDate, speedMultiplier, previousOrderNumber, deliveryLine, skipConfirmationCheckbox, inputLine, failedOrders, updateFailedOrders, autoSkipCheckbox) {
    return new Promise(async (resolve) => {
        try {
            // Always navigate to order number field for each line to treat it as unique
            updateStatus(`🌐 Navigating to order number field for order ${orderNumber}`, 'processing');

            // Ensure we're at the order number field
            const isOrderFieldFocused = await isOrderNumberFieldFocused();
            if (!isOrderFieldFocused) {
                updateStatus(`🔙 Forcing return to order number field`, 'processing');
                const returnSuccess = await returnToOrderNumberField(speedMultiplier, inputLine, failedOrders, updateFailedOrders, autoSkipCheckbox);
                if (!returnSuccess) {
                    updateStatus(`❌ Failed to return to order number field`, 'error');
                    resolve(false);
                    return;
                }
            }

            // Navigate to Deliveries tab for each line
            let navigationSuccess = false;
            let navAttempts = 0;
            const maxNavAttempts = 3;

            while (!navigationSuccess && navAttempts < maxNavAttempts) {
                navAttempts++;
                updateStatus(`🌐 Navigation attempt ${navAttempts}/${maxNavAttempts} for order ${orderNumber}`, 'processing');
                navigationSuccess = await navigateToDeliveries(orderNumber, speedMultiplier);
                if (!navigationSuccess) {
                    updateStatus(`⚠️ Navigation attempt ${navAttempts} failed, retrying...`, 'warning');
                    await humanDelay(1000, speedMultiplier);
                }
            }

            if (!navigationSuccess) {
                updateStatus(`❌ Failed to navigate to Deliveries after ${maxNavAttempts} attempts`, 'error');
                resolve(false);
                return;
            }

            // Check for visible delivery number field and press Escape twice if visible
            const deliveryNumberField = document.querySelector('input[fieldname="SO_DELIVERY"]');
            if (deliveryNumberField && deliveryNumberField.offsetParent !== null) {
                updateStatus(`🔍 Delivery number field visible, pressing Escape twice...`, 'processing');
                await simulateEscapeKey(deliveryNumberField, speedMultiplier);
                await simulateEscapeKey(deliveryNumberField, speedMultiplier);
                await humanDelay(500, speedMultiplier);
            }

            // Add 2-second delay after navigating to Deliveries
            updateStatus(`⏳ Pausing for 2 seconds after Deliveries navigation...`, 'processing');
            await humanDelay(2000, speedMultiplier);

            // Focus on the line number field
            updateStatus(`🔍 Focusing on line number field...`, 'processing');
            const lineNumberField = document.getElementById(config.lineNumberFieldId);
            if (!lineNumberField) {
                updateStatus(`❌ Error: Line number field not found`, 'error');
                resolve(false);
                return;
            }

            // Type the line number and press Enter
            updateStatus(`⌨️ Typing line number: ${lineNumber}`, 'processing');
            await humanTypeInto(lineNumberField, lineNumber, speedMultiplier);

            updateStatus(`↵ Pressing Enter to load line...`, 'processing');
            await simulateEnterKey(lineNumberField, speedMultiplier);

            await humanDelay(config.humanDelayAfterLineNumber, speedMultiplier);

            // Check for error dialog after entering line number
            const errorDialogResult = await handleErrorDialog(inputLine, failedOrders, updateFailedOrders, speedMultiplier, autoSkipCheckbox);
            if (errorDialogResult.shouldSkip) {
                updateStatus(`⏩ Skipped line due to error: ${inputLine}`, 'warning');
                resolve(false);
                return;
            } else if (!errorDialogResult.continueProcessing) {
                updateStatus(`🛑 Processing stopped by user`, 'warning');
                resolve(false);
                return;
            }

            // Select delivery line if provided
            if (deliveryLine) {
                updateStatus(`🔍 Attempting to select delivery line ${deliveryLine}...`, 'processing');
                const selectionSuccess = await selectDeliveryLine(deliveryLine, speedMultiplier);
                if (!selectionSuccess) {
                    updateStatus(`❌ Failed to select delivery line ${deliveryLine}`, 'error');
                    resolve(false);
                    return;
                }
                await humanDelay(500, speedMultiplier);
            }

            // Wait for delivery date field to be focused
            updateStatus(`⏳ Waiting for delivery date field...`, 'processing');
            const focusSuccess = await waitForDeliveryFieldFocus(speedMultiplier);
            if (!focusSuccess) {
                updateStatus(`❌ Failed to focus delivery date field`, 'error');
                resolve(false);
                return;
            }

            // Verify delivery date field exists
            const deliveryDateField = document.getElementById(config.deliveryDateFieldId);
            if (!deliveryDateField) {
                updateStatus(`❌ Error: Delivery date field not found`, 'error');
                resolve(false);
                return;
            }

            // Check if current date matches the input date
            updateStatus(`🔍 Checking current delivery date...`, 'processing');
            const currentDate = deliveryDateField.value.trim();
            if (currentDate === dateStr) {
                const skipMessage = `⏩ SKIPPED: Line ${lineNumber}${deliveryLine ? `, Delivery ${deliveryLine}` : ''} already has date ${dateStr}`;
                updateStatus(skipMessage, 'success');

                // Highlight field temporarily
                deliveryDateField.style.backgroundColor = '#e6ffe6';
                deliveryDateField.style.border = '2px solid #4CAF50';
                await humanDelay(500, speedMultiplier);

                // Close dialog with Escape keys
                updateStatus(`✖ Closing dialog with Escape key...`, 'processing');
                await simulateEscapeKey(deliveryDateField, speedMultiplier);
                await simulateEscapeKey(deliveryDateField, speedMultiplier);
                await simulateEscapeKey(deliveryDateField, speedMultiplier);

                // Reset field styles
                deliveryDateField.style.backgroundColor = '';
                deliveryDateField.style.border = '';

                // Verify dialog closure
                const dialogClosed = await isDeliveryDialogClosed(speedMultiplier);
                if (!dialogClosed) {
                    updateStatus(`⚠️ Warning: Couldn't close dialog automatically`, 'warning');
                    resolve(false);
                    return;
                }

                // Focus back on line number field
                lineNumberField.focus();
                await humanDelay(300, speedMultiplier);

                updateStatus(`✓ Successfully skipped line ${lineNumber}${deliveryLine ? `, Delivery ${deliveryLine}` : ''}`, 'success');
                resolve(true);
                return;
            }

            // Clear existing date
            updateStatus(`🧹 Clearing existing date...`, 'processing');
            deliveryDateField.focus();
            deliveryDateField.select();
            await simulateDeleteKey(deliveryDateField, speedMultiplier);
            await humanDelay(200, speedMultiplier);

            // Type new date
            updateStatus(`⌨️ Typing new date: ${newDate}`, 'processing');
            await humanTypeInto(deliveryDateField, newDate, speedMultiplier);

            // Check for error dialog after typing date
            const dateEntryDialogResult = await handleErrorDialog(inputLine, failedOrders, updateFailedOrders, speedMultiplier, autoSkipCheckbox);
            if (dateEntryDialogResult.shouldSkip) {
                updateStatus(`⏩ Skipped line due to error: ${inputLine}`, 'warning');
                resolve(false);
                return;
            } else if (!dateEntryDialogResult.continueProcessing) {
                updateStatus(`🛑 Processing stopped by user`, 'warning');
                resolve(false);
                return;
            }

            // Check if save confirmation should be skipped
            const skipConfirmation = skipConfirmationCheckbox && skipConfirmationCheckbox.checked;
            console.log('[Delivery Date Updater] Skip confirmation state before save:', skipConfirmation);

            let shouldSave = skipConfirmation;
            if (!skipConfirmation) {
                updateStatus(`⏳ Waiting for save confirmation...`, 'processing');
                window.scriptIsPaused = true;
                shouldSave = await new Promise((confirmResolve) => {
                    let dialog = document.getElementById(config.confirmationDialogId);
                    let confirmButton, cancelButton;

                    if (!dialog) {
                        const dialogElements = createConfirmationDialog();
                        dialog = dialogElements.dialog;
                        confirmButton = dialogElements.confirmButton;
                        cancelButton = dialogElements.cancelButton;
                    } else {
                        confirmButton = dialog.querySelector('button:nth-child(2)');
                        cancelButton = dialog.querySelector('button:nth-child(1)');
                    }

                    dialog.style.display = 'flex';

                    confirmButton.onclick = () => {
                        dialog.style.display = 'none';
                        window.scriptIsPaused = false;
                        confirmResolve(true);
                    };

                    cancelButton.onclick = () => {
                        dialog.style.display = 'none';
                        window.scriptIsPaused = false;
                        confirmResolve(false);
                    };
                });
            }

            if (!shouldSave) {
                updateStatus(`❌ Save cancelled by user`, 'warning');
                await simulateEscapeKey(deliveryDateField, speedMultiplier);
                await simulateEscapeKey(deliveryDateField, speedMultiplier);
                resolve(false);
                return;
            }

            // Confirm date entry with three Enter presses
            updateStatus(`⏳ Preparing to confirm date...`, 'processing');
            await humanDelay(config.humanDelayAfterDate, speedMultiplier);

            updateStatus(`↵ Confirming date update with Enter presses...`, 'processing');
            await simulateEnterKey(deliveryDateField, speedMultiplier);
            await simulateEnterKey(deliveryDateField, speedMultiplier);
            await simulateEnterKey(deliveryDateField, speedMultiplier);

            updateStatus(`⏳ Finalizing date entry...`, 'processing');
            await humanDelay(2000, speedMultiplier);

            // Check for error dialog after confirming date
            const postConfirmErrorResult = await handleErrorDialog(inputLine, failedOrders, updateFailedOrders, speedMultiplier, autoSkipCheckbox);
            if (postConfirmErrorResult.shouldSkip) {
                updateStatus(`⏩ Skipped line due to error: ${inputLine}`, 'warning');
                resolve(false);
                return;
            } else if (!postConfirmErrorResult.continueProcessing) {
                updateStatus(`🛑 Processing stopped by user`, 'warning');
                resolve(false);
                return;
            }

            // Save data with F3 key
            updateStatus(`💾 Saving data with F3 key...`, 'processing');
            const f3Event = new KeyboardEvent('keydown', {
                key: 'F3',
                code: 'F3',
                keyCode: 114,
                which: 114,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(f3Event);

            // Wait for save operation to complete
            await humanDelay(1500, speedMultiplier);

            // Check for G2 alert after save attempt
            const saveErrorResult = await handleErrorDialog(inputLine, failedOrders, updateFailedOrders, speedMultiplier, autoSkipCheckbox);
            if (saveErrorResult.shouldSkip) {
                updateStatus(`⏩ Skipped line due to error: ${inputLine}`, 'warning');
                resolve(false);
                return;
            } else if (!saveErrorResult.continueProcessing) {
                updateStatus(`🛑 Processing stopped by user`, 'warning');
                resolve(false);
                return;
            }

            // Verify that save was successful
            const verifyDateField = document.getElementById(config.deliveryDateFieldId);
            if (verifyDateField && verifyDateField.value.trim() === dateStr) {
                updateStatus(`✓ Date change verified successfully`, 'success');
            } else {
                updateStatus(`⚠️ Could not verify date change`, 'warning');
            }

            // Return to the order number field
            let saveAttempts = 0;
            const maxSaveAttempts = 5;
            let orderFieldReached = false;
            const orderNumberField = document.getElementById(config.orderNumberFieldId);

            if (!orderNumberField) {
                updateStatus(`❌ Error: Order number field not found`, 'error');
                resolve(false);
                return;
            }

            while (!orderFieldReached && saveAttempts < maxSaveAttempts) {
                saveAttempts++;
                updateStatus(`🔍 Checking if order field is reached (attempt ${saveAttempts}/${maxSaveAttempts})`, 'processing');

                // Check if order number field is focused
                const isFocused = await isOrderNumberFieldFocused();
                if (isFocused) {
                    updateStatus(`✓ Order number field reached, data saved`, 'success');
                    orderFieldReached = true;
                    break;
                }

                // Press Escape to close dialogs and return to order field
                updateStatus(`🔄 Pressing Escape to navigate back...`, 'processing');
                await simulateEscapeKey(document.activeElement, speedMultiplier);
                await humanDelay(1000, speedMultiplier);

                // Check if delivery dialog is closed and line number field is active
                const dialogClosed = await isDeliveryDialogClosed(speedMultiplier);
                if (dialogClosed) {
                    updateStatus(`✓ Delivery dialog closed, focusing order number field`, 'success');
                    const returnSuccess = await returnToOrderNumberField(speedMultiplier, inputLine, failedOrders, updateFailedOrders, autoSkipCheckbox);
                    if (returnSuccess) {
                        orderFieldReached = true;
                        break;
                    }
                }
            }

            if (!orderFieldReached) {
                updateStatus(`❌ Failed to reach order number field after ${maxSaveAttempts} attempts`, 'error');
                if (!failedOrders.includes(inputLine)) {
                    failedOrders.push(inputLine);
                    updateFailedOrders(failedOrders);
                }
                resolve(false);
                return;
            }

            // Success: Line updated and order number field reached
            updateStatus(`✅ Successfully updated line ${lineNumber}${deliveryLine ? `, Delivery ${deliveryLine}` : ''} to ${dateStr}`, 'success');
            resolve(true);
        } catch (error) {
            updateStatus(`❌ Error processing line ${lineNumber}${deliveryLine ? `, Delivery ${deliveryLine}` : ''}: ${error.message}`, 'error');
            if (!failedOrders.includes(inputLine)) {
                failedOrders.push(inputLine);
                updateFailedOrders(failedOrders);
            }
            resolve(false);
        }
    });
}
/////////////////


/////////////

// escapeToOrderNumberField function (unchanged)


async function escapeToOrderNumberField(speedMultiplier) {
    try {
        updateStatus(`⌨️ Pressing F3 to return to order number field...`, 'processing');
        const orderNumberField = document.getElementById(config.orderNumberFieldId);
        if (!orderNumberField) {
            updateStatus(`❌ Error: Order number field not found`, 'error');
            return false;
        }

        let attempts = 0;
        const maxAttempts = 10;

        while (document.activeElement !== orderNumberField && attempts < maxAttempts) {
            const activeElement = document.activeElement || document.body;
            await simulateF3Key(activeElement, speedMultiplier);
            attempts++;
            await humanDelay(300, speedMultiplier);

            // Check if we're at the order number field
            if (document.activeElement === orderNumberField) {
                updateStatus(`✓ Reached order number field`, 'success');
                return true;
            }
        }

        updateStatus(`⚠️ Warning: Could not reach order number field after ${maxAttempts} F3 attempts`, 'warning');
        return false;
    } catch (error) {
        console.error('[Delivery Date Updater] Error navigating to order number field:', error);
        updateStatus(`❌ Error navigating to order number field: ${error.message}`, 'error');
        return false;
    }
}

// Add this new function to simulate pressing F3 key
async function simulateF3Key(element, speedMultiplier) {
    try {
        // F3 key has keyCode 114
        const keyDownEvent = new KeyboardEvent('keydown', {
            key: 'F3',
            code: 'F3',
            keyCode: 114,
            which: 114,
            bubbles: true,
            cancelable: true
        });

        const keyUpEvent = new KeyboardEvent('keyup', {
            key: 'F3',
            code: 'F3',
            keyCode: 114,
            which: 114,
            bubbles: true,
            cancelable: true
        });

        // Dispatch the events
        element.dispatchEvent(keyDownEvent);
        await humanDelay(50, speedMultiplier);
        element.dispatchEvent(keyUpEvent);

        console.log('[Delivery Date Updater] F3 key simulated');
    } catch (error) {
        console.error('[Delivery Date Updater] Error simulating F3 key:', error);
        throw error;
    }
}








/////////////
    // Helper functions (unchanged from original, included for completeness)
    function createConfirmationDialog() {
        const dialog = document.createElement('div');
        dialog.id = config.confirmationDialogId;
        Object.assign(dialog.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '15px',
            zIndex: '10000',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            display: 'none',
            flexDirection: 'column',
            gap: '10px'
        });

        const message = document.createElement('div');
        message.textContent = 'Do you want to save the adjusted delivery date?';
        dialog.appendChild(message);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.justifyContent = 'flex-end';

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Save';
        Object.assign(confirmButton.style, {
            padding: '5px 10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        Object.assign(cancelButton.style, {
            padding: '5px 10px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
        });

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(confirmButton);
        dialog.appendChild(buttonContainer);

        document.body.appendChild(dialog);
        return { dialog, confirmButton, cancelButton };
    }

    async function selectDeliveryLine(deliveryLine, speedMultiplier = 1.0) {
        try {
            updateStatus(`🔍 Selecting delivery line: ${deliveryLine}`, 'processing');

            const paddedDeliveryLine = deliveryLine.padStart(4, '0');

            let targetInput = findDeliveryInput(paddedDeliveryLine);
            if (targetInput) {
                return await clickDeliveryInput(targetInput, paddedDeliveryLine, speedMultiplier);
            }

            if (parseInt(deliveryLine) > 8) {
                return await searchDeliveryThroughPagination(paddedDeliveryLine, speedMultiplier);
            }

            targetInput = findDeliveryInput(paddedDeliveryLine, true);
            if (targetInput) {
                return await clickDeliveryInput(targetInput, paddedDeliveryLine, speedMultiplier);
            }

            updateStatus(`❌ Delivery line ${paddedDeliveryLine} not found`, 'error');
            return false;
        } catch (error) {
            console.error('[Delivery Date Updater] Error selecting delivery line:', error);
            updateStatus(`❌ Error selecting delivery line: ${error.message}`, 'error');
            return false;
        }
    }

    function findDeliveryInput(paddedDeliveryLine, forceSearch = false) {
        const deliveryInputs = document.querySelectorAll('input[fieldname="SO_DELIVERY"]');
        for (const input of deliveryInputs) {
            if (forceSearch || input.offsetParent !== null) {
                if (input.value === paddedDeliveryLine) {
                    return input;
                }
            }
        }

        const tableRows = document.querySelectorAll('tr');
        for (const row of tableRows) {
            const rowText = row.textContent || '';
            if (rowText.includes(paddedDeliveryLine)) {
                const input = row.querySelector('input[fieldname="SO_DELIVERY"]');
                if (input) {
                    return input;
                }

                row.click();
                const foundInput = row.querySelector('input[fieldname="SO_DELIVERY"]');
                if (foundInput) {
                    return foundInput;
                }
            }
        }

        return null;
    }

    async function clickDeliveryInput(input, paddedDeliveryLine, speedMultiplier) {
        updateStatus(`🖱 Clicking delivery line ${paddedDeliveryLine}`, 'processing');
        input.focus();
        input.click();
        const clickEvent = new MouseEvent('click', { bubbles: true });
        input.dispatchEvent(clickEvent);
        await humanDelay(500, speedMultiplier);
        return true;
    }

    async function searchDeliveryThroughPagination(paddedDeliveryLine, speedMultiplier) {
        let found = false;
        let maxPages = 15;
        const nextPageButtonSelectors = [
            'span.k-icon.k-i-arrow-60-right',
            'a.k-link.k-pager-nav[title="Go to the next page"]',
            'a.k-link.k-pager-nav[aria-label="Go to the next page"]',
            'a.k-link.k-pager-nav:not(.k-state-disabled)',
            'li.k-item span.k-icon.k-i-arrow-e',
            'button.k-button[aria-label="go to next page"]'
        ];

        const initialPageInfo = capturePageState();

        while (!found && maxPages > 0) {
            const targetInput = findDeliveryInput(paddedDeliveryLine);
            if (targetInput) {
                found = true;
                return await clickDeliveryInput(targetInput, paddedDeliveryLine, speedMultiplier);
            }

                updateStatus(`➡️ Attempting page navigation for delivery ${paddedDeliveryLine} (${maxPages} attempts left)`, 'processing');

                let nextButton = null;
                for (const selector of nextPageButtonSelectors) {
                    nextButton = document.querySelector(selector);
                    if (nextButton) {
                        updateStatus(`🔍 Found next page button using selector: ${selector}`, 'processing');
                        break;
                    }
                }

                if (!nextButton) {
                    updateStatus(`❌ Next page button not found with any selector`, 'error');
                    return false;
                }

                const clickTarget = nextButton.closest('a') || nextButton.closest('button') || nextButton;
                if (!clickTarget) {
                    updateStatus(`❌ Clickable target not found for next button`, 'error');
                    return false;
                }

                if (clickTarget.classList.contains('k-state-disabled') ||
                    getComputedStyle(clickTarget).display === 'none' ||
                    clickTarget.getAttribute('disabled') === 'disabled') {
                    updateStatus(`⚠️ Next page button appears to be disabled`, 'warning');
                    return false;
                }

                await robustButtonClick(clickTarget, speedMultiplier);
                await humanDelay(2000, speedMultiplier);

                const newPageState = capturePageState();
                const pageChanged = comparePageStates(initialPageInfo, newPageState);

                if (pageChanged) {
                    updateStatus(`✓ Successfully moved to next page`, 'success');

                    const newTargetInput = findDeliveryInput(paddedDeliveryLine);
                    if (newTargetInput) {
                        found = true;
                        return await clickDeliveryInput(newTargetInput, paddedDeliveryLine, speedMultiplier);
                    }
                } else {
                    updateStatus(`⚠️ Page navigation attempt failed, trying alternative method`, 'warning');

                    const success = await clickNextPageNumber(speedMultiplier);
                    if (!success) {
                        updateStatus(`⚠️ Alternative page navigation also failed`, 'warning');
                        maxPages--;
                        continue;
                    }

                    await humanDelay(2000, speedMultiplier);

                    const altTargetInput = findDeliveryInput(paddedDeliveryLine);
                    if (altTargetInput) {
                        found = true;
                        return await clickDeliveryInput(altTargetInput, paddedDeliveryLine, speedMultiplier);
                    }
                }

                maxPages--;
            }

            return found;
        }

        async function clickNextPageNumber(speedMultiplier) {
            try {
                const pageButtons = document.querySelectorAll('a.k-link.k-pager-nav.k-pager-num');
                if (!pageButtons || pageButtons.length === 0) {
                    return false;
                }

                const activePage = document.querySelector('span.k-state-selected');
                if (!activePage) {
                    return false;
                }

                const currentPage = parseInt(activePage.textContent.trim());
                if (isNaN(currentPage)) {
                    return false;
                }

                const nextPageButton = Array.from(pageButtons).find(btn =>
                    parseInt(btn.textContent.trim()) === currentPage + 1
                );

                if (!nextPageButton) {
                    return false;
                }

                await robustButtonClick(nextPageButton, speedMultiplier);
                return true;
            } catch (e) {
                console.error('Next page number click failed:', e);
                return false;
            }
        }

        function capturePageState() {
            try {
                const pagerInfo = document.querySelector('.k-pager-info.k-label');
                const pagerText = pagerInfo ? pagerInfo.textContent : '';

                const deliveryInputs = document.querySelectorAll('input[fieldname="SO_DELIVERY"]');
                const visibleDeliveries = Array.from(deliveryInputs)
                    .filter(input => input.offsetParent !== null)
                    .map(input => input.value)
                    .join(',');

                const activePage = document.querySelector('span.k-state-selected');
                const activePageNum = activePage ? activePage.textContent : '';

                return {
                    pagerText,
                    visibleDeliveries,
                    activePageNum
                };
            } catch (e) {
                console.error('Error capturing page state:', e);
                return {};
            }
        }

        function comparePageStates(state1, state2) {
            return state1.pagerText !== state2.pagerText ||
                   state1.visibleDeliveries !== state2.visibleDeliveries ||
                   state1.activePageNum !== state2.activePageNum;
        }

        async function robustButtonClick(button, speedMultiplier) {
            try {
                button.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await humanDelay(500, speedMultiplier);

                button.focus();
                await humanDelay(200, speedMultiplier);
                button.click();
                await humanDelay(300, speedMultiplier);

                const rect = button.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;

                const mouseEvents = [
                    new MouseEvent('mouseover', { bubbles: true, clientX: x, clientY: y }),
                    new MouseEvent('mousedown', { bubbles: true, clientX: x, clientY: y }),
                    new MouseEvent('mouseup', { bubbles: true, clientX: x, clientY: y }),
                    new MouseEvent('click', { bubbles: true, clientX: x, clientY: y })
                ];

                for (const event of mouseEvents) {
                    button.dispatchEvent(event);
                    await humanDelay(50, speedMultiplier);
                }

                HTMLElement.prototype.click.call(button);

                if (typeof jQuery !== 'undefined') {
                    try {
                        jQuery(button).trigger('click');
                    } catch (e) {
                        console.error('jQuery click trigger failed:', e);
                    }
                }

                return true;
            } catch (e) {
                console.error('Button click failed:', e);
                return false;
            }
        }

        async function clickQuantityField(paddedDeliveryLine, speedMultiplier) {
            try {
                const deliveryInput = document.querySelector(`input[fieldname="SO_DELIVERY"][value="${paddedDeliveryLine}"]`);
                if (deliveryInput) {
                    const row = deliveryInput.closest('tr');
                    if (row) {
                        const qtyField = row.querySelector('input[fieldname="SO_DEL_ORDERED_QTY"]');
                        if (qtyField) {
                            updateStatus(`🖱 Clicking quantity field for delivery ${paddedDeliveryLine}`, 'processing');
                            qtyField.focus();
                            qtyField.click();
                            const qtyClickEvent = new MouseEvent('click', { bubbles: true });
                            qtyField.dispatchEvent(qtyClickEvent);
                            await humanDelay(500, speedMultiplier);
                            return true;
                        }
                    }
                }

                const qtyFields = document.querySelectorAll('input[fieldname="SO_DEL_ORDERED_QTY"]');
                for (const field of qtyFields) {
                    if (field.offsetParent !== null) {
                        updateStatus(`🖱 Clicking fallback quantity field for delivery ${paddedDeliveryLine}`, 'processing');
                        field.focus();
                        field.click();
                        const qtyClickEvent = new MouseEvent('click', { bubbles: true });
                        field.dispatchEvent(qtyClickEvent);
                        await humanDelay(500, speedMultiplier);
                        return true;
                    }
                }

                updateStatus(`⚠️ Quantity field not found for delivery ${paddedDeliveryLine}`, 'warning');
                return false;
            } catch (error) {
                console.error('[Delivery Date Updater] Error clicking quantity field:', error);
                updateStatus(`⚠️ Error clicking quantity field: ${error.message}`, 'warning');
                return false;
            }
        }

        function createFallbackMenu(error) {
            try {
                const fallbackMenu = document.createElement('div');
                fallbackMenu.id = 'delivery-date-updater-fallback';
                Object.assign(fallbackMenu.style, {
                    position: 'fixed',
                    top: '10px',
                    left: '10px',
                    backgroundColor: '#ffebee',
                    border: '1px solid #f44336',
                    borderRadius: '5px',
                    padding: '10px',
                    zIndex: '9999',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    maxWidth: '300px'
                });

                fallbackMenu.innerHTML = `
                    <div style="font-weight: bold; margin-bottom: 5px;">Delivery Date Updater Error</div>
                    <div style="color: #d32f2f; margin-bottom: 5px;">The script encountered an error:</div>
                    <div style="background: #fafafa; padding: 5px; font-family: monospace; font-size: 10px;
                        overflow-wrap: break-word; margin-bottom: 5px;">${error.message}</div>
                    <button id="reload-updater-btn" style="padding: 5px; background: #2196F3; color: white;
                        border: none; border-radius: 3px; cursor: pointer;">Reload Script</button>
                `;

                document.body.appendChild(fallbackMenu);

                document.getElementById('reload-updater-btn').addEventListener('click', () => {
                    fallbackMenu.remove();
                    console.log('[Delivery Date Updater] Attempting to reload script interface');
                    setTimeout(initialize, 500);
                });
            } catch (secondaryError) {
                console.error('[Delivery Date Updater] Failed to create fallback menu:', secondaryError);
                alert('Delivery Date Updater script failed to load. Check browser console for details.');
            }
        }

        function humanDelay(ms, speedMultiplier = 1.0) {
            const adjustedTime = ms / speedMultiplier;
            const randomness = 1 + (Math.random() * 0.2 - 0.1);
            return new Promise(resolve => setTimeout(resolve, adjustedTime * randomness));
        }

        function makeDraggable(element, handle) {
            try {
                let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

                handle.style.cursor = 'move';
                handle.onmousedown = dragMouseDown;

                function dragMouseDown(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.onmouseup = closeDragElement;
                    document.onmousemove = elementDrag;
                }

                function elementDrag(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    element.style.top = (element.offsetTop - pos2) + "px";
                    element.style.left = (element.offsetLeft - pos1) + "px";
                }

                function closeDragElement() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
            } catch (error) {
                console.error('[Delivery Date Updater] Error making element draggable:', error);
            }
        }

        function log(message) {
            console.log(`[Delivery Date Updater] ${message}`);
        }

        async function humanTypeInto(element, text, speedMultiplier = 1.0) {
            try {
                element.focus();
                element.select();

                await simulateDeleteKey(element, speedMultiplier);
                await humanDelay(200, speedMultiplier);

                for (let i = 0; i < text.length; i++) {
                    element.value = element.value.slice(0, element.selectionStart) +
                                  text[i] +
                                  element.value.slice(element.selectionEnd);

                    const cursorPosition = element.selectionStart + 1;
                    element.setSelectionRange(cursorPosition, cursorPosition);

                    const inputEvent = new Event('input', { bubbles: true });
                    element.dispatchEvent(inputEvent);

                    const typeDelay = Math.floor(Math.random() * 50) + 30;
                    await humanDelay(typeDelay, speedMultiplier);
                }

                const changeEvent = new Event('change', { bubbles: true });
                element.dispatchEvent(changeEvent);
            } catch (error) {
                console.error('[Delivery Date Updater] Error in humanTypeInto:', error);
                throw error;
            }
        }

        async function simulateDeleteKey(element, speedMultiplier = 1.0) {
            try {
                const keydownEvent = new KeyboardEvent('keydown', {
                    key: 'Delete',
                    code: 'Delete',
                    keyCode: 46,
                    which: 46,
                    bubbles: true
                });
                element.dispatchEvent(keydownEvent);

                await humanDelay(50, speedMultiplier);

                const keyupEvent = new KeyboardEvent('keyup', {
                    key: 'Delete',
                    code: 'Delete',
                    keyCode: 46,
                    which: 46,
                    bubbles: true
                });
                element.dispatchEvent(keyupEvent);

                element.value = '';
                await humanDelay(100, speedMultiplier);
            } catch (error) {
                console.error('[Delivery Date Updater] Error in simulateDeleteKey:', error);
                throw error;
            }
        }

        async function simulateTabKey(element, speedMultiplier = 1.0) {
            try {
                element.focus();

                const keydownEvent = new KeyboardEvent('keydown', {
                    key: 'Tab',
                    code: 'Tab',
                    keyCode: 9,
                    which: 9,
                    bubbles: true
                });
                element.dispatchEvent(keydownEvent);

                await humanDelay(50, speedMultiplier);

                const keyupEvent = new KeyboardEvent('keyup', {
                    key: 'Tab',
                    code: 'Tab',
                    keyCode: 9,
                    which: 9,
                    bubbles: true
                });
                element.dispatchEvent(keyupEvent);

                await humanDelay(config.tabDelay, speedMultiplier);
            } catch (error) {
                console.error('[Delivery Date Updater] Error in simulateTabKey:', error);
                throw error;
            }
        }

        async function simulateEnterKey(element, speedMultiplier = 1.0) {
            try {
                element.focus();

                const keydownEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                });
                element.dispatchEvent(keydownEvent);

                await humanDelay(50, speedMultiplier);

                const keyupEvent = new KeyboardEvent('keyup', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                });
                element.dispatchEvent(keyupEvent);

                await humanDelay(config.humanDelayAfterEnter, speedMultiplier);
            } catch (error) {
                console.error('[Delivery Date Updater] Error in simulateEnterKey:', error);
                throw error;
            }
        }

        async function simulateEscapeKey(element, speedMultiplier = 1.0) {
            try {
                element.focus();

                const keydownEvent = new KeyboardEvent('keydown', {
                    key: 'Escape',
                    code: 'Escape',
                    keyCode: 27,
                    which: 27,
                    bubbles: true
                });
                element.dispatchEvent(keydownEvent);

                await humanDelay(50, speedMultiplier);

                const keyupEvent = new KeyboardEvent('keyup', {
                    key: 'Escape',
                    code: 'Escape',
                    keyCode: 27,
                    which: 27,
                    bubbles: true
                });
                element.dispatchEvent(keyupEvent);

                await humanDelay(config.escapeDelay, speedMultiplier);
            } catch (error) {
                console.error('[Delivery Date Updater] Error in simulateEscapeKey:', error);
                throw error;
            }
        }

        async function clickTab(tabId, speedMultiplier = 1.0) {
            try {
                const tab = document.getElementById(tabId);
                if (!tab) {
                    throw new Error(`Tab with ID ${tabId} not found`);
                }

                tab.focus();
                tab.click();
                const clickEvent = new MouseEvent('click', { bubbles: true });
                tab.dispatchEvent(clickEvent);

                await humanDelay(config.clickDelay, speedMultiplier);
                return true;
            } catch (error) {
                console.error(`[Delivery Date Updater] Error clicking tab ${tabId}:`, error);
                throw error;
            }
        }



        async function isDeliveryDialogClosed(speedMultiplier = 1.0) {
            try {
                const deliveryDateField = document.getElementById(config.deliveryDateFieldId);
                const lineNumberField = document.getElementById(config.lineNumberFieldId);

                if (!deliveryDateField || !lineNumberField) {
                    log('Required fields not found');
                    return false;
                }

                const isDeliveryFieldHidden = !deliveryDateField.offsetParent ||
                                            document.activeElement !== deliveryDateField;

                const isLineNumberReady = document.activeElement === lineNumberField ||
                                         lineNumberField.offsetParent !== null;

                return isDeliveryFieldHidden && isLineNumberReady;
            } catch (error) {
                console.error('[Delivery Date Updater] Error checking dialog closure:', error);
                return false;
            }
        }

        async function isOrderNumberFieldFocused() {
            try {
                const orderNumberField = document.getElementById(config.orderNumberFieldId);
                if (!orderNumberField) {
                    log('Order number field not found');
                    return false;
                }
                return document.activeElement === orderNumberField || orderNumberField.offsetParent !== null;
            } catch (error) {
                console.error('[Delivery Date Updater] Error checking order number field focus:', error);
                return false;
            }
        }
/////////

async function returnToOrderNumberField(speedMultiplier, inputLine, failedOrders, updateFailedOrders, autoSkipCheckbox) {
    try {
        // First, attempt to check if we're already at the order number field
        const orderNumberField = document.getElementById(config.orderNumberFieldId);
        if (orderNumberField && document.activeElement === orderNumberField) {
            console.log('[Delivery Date Updater] Already at order number field');
            return true;
        }

        // Try to handle any potential pop-up error dialogs first
        const errorDialogResult = await handleErrorDialog(inputLine || 'Navigation', failedOrders, updateFailedOrders, speedMultiplier, autoSkipCheckbox);
        if (errorDialogResult.shouldSkip || !errorDialogResult.continueProcessing) {
            console.log('[Delivery Date Updater] Navigation aborted due to error dialog');
            return false;
        }

        // Try different navigation methods
        for (let attempts = 0; attempts < 3; attempts++) {
            // Method 1: Press Escape key multiple times to back out of dialogs
            let escapeAttempts = 0;
            while (escapeAttempts < 5) {
                console.log(`[Delivery Date Updater] Pressing Escape key (attempt ${escapeAttempts + 1})`);

                // Get the active element to press escape on
                const activeElement = document.activeElement || document.body;
                await simulateEscapeKey(activeElement, speedMultiplier);

                // Check if we're back at the order field
                await humanDelay(500, speedMultiplier);

                if (document.getElementById(config.orderNumberFieldId) === document.activeElement) {
                    console.log('[Delivery Date Updater] Successfully reached order number field after Escape');
                    return true;
                }

                escapeAttempts++;
            }

            // Method 2: Try clicking the "Orders" button in the tab bar
            const ordersTab = document.querySelector('#tabsBar button.G2Tab:nth-child(1)');
            if (ordersTab) {
                console.log('[Delivery Date Updater] Clicking Orders tab');
                await simulateMouseClick(ordersTab, speedMultiplier);
                await humanDelay(1000, speedMultiplier);

                // Check if the order number field exists and is visible
                if (document.getElementById(config.orderNumberFieldId)) {
                    // Try to focus the order number field
                    const orderField = document.getElementById(config.orderNumberFieldId);
                    orderField.focus();
                    await humanDelay(500, speedMultiplier);

                    if (document.activeElement === orderField) {
                        console.log('[Delivery Date Updater] Successfully focused order number field after tab click');
                        return true;
                    }
                }
            }

            // Method 3: Try to click the "Order Number" field label
            const orderLabel = document.querySelector('label[for="' + config.orderNumberFieldId + '"]');
            if (orderLabel) {
                console.log('[Delivery Date Updater] Clicking Order Number label');
                await simulateMouseClick(orderLabel, speedMultiplier);
                await humanDelay(500, speedMultiplier);

                const orderField = document.getElementById(config.orderNumberFieldId);
                if (orderField && document.activeElement === orderField) {
                    console.log('[Delivery Date Updater] Successfully focused order number field after label click');
                    return true;
                }
            }

            // Add a delay between attempts
            await humanDelay(1000, speedMultiplier);
        }

        console.error('[Delivery Date Updater] Failed to return to order number field after multiple attempts');
        return false;
    } catch (error) {
        console.error('[Delivery Date Updater] Error returning to order number field:', error);
        return false;
    }
}


/////////////
 async function clickSaveButton(speedMultiplier, inputLine, failedOrders, updateFailedOrders, autoSkipCheckbox) {
    try {
        let attempts = 0;
        const maxAttempts = 5; // Increased from 3
        let saveConfirmed = false;

        while (attempts < maxAttempts && !saveConfirmed) {
            attempts++;

            // Existing save click logic
            const saveButton = document.querySelector('li.G2Toolbar[text="Save"], li[uniquename="Button_Save"]');
            if (saveButton) {
                saveButton.click();
            } else {
                await simulateF3Key(document.body, speedMultiplier);
            }

            // Extended initial delay
            await humanDelay(1500, speedMultiplier);

            // Check multiple success conditions
            const successConditions = [
                () => document.querySelector(config.successDialogSelector),
                () => {
                    const tabGroup = document.getElementById('tabGroup_W_SORDS1KEEP');
                    return tabGroup && Array.from(tabGroup.querySelectorAll('button.k-button.G2Tab'))
                        .every(tab => tab.classList.contains('k-state-disabled'));
                },
                () => document.getElementById(config.orderNumberFieldId)?.offsetParent !== null
            ];

            // New: Wait up to 10 seconds for success confirmation
            const successCheckStart = Date.now();
            while (Date.now() - successCheckStart < 10000 && !saveConfirmed) {
                for (const condition of successConditions) {
                    if (condition()) {
                        saveConfirmed = true;
                        break;
                    }
                }
                if (!saveConfirmed) await humanDelay(500, speedMultiplier);
            }

            // If save confirmed, handle success
            if (saveConfirmed) {
                // Close success dialog if present
                const successDialog = document.querySelector(config.successDialogSelector);
                if (successDialog) {
                    const okButton = successDialog.querySelector('button.k-button.alertButton.confirmOk');
                    if (okButton) okButton.click();
                }

                // Wait for UI stabilization
                await humanDelay(2000, speedMultiplier);

                // Verify order field availability
                if (document.getElementById(config.orderNumberFieldId)?.offsetParent) {
                    updateStatus(`✅ Save confirmed successfully`, 'success');
                    return true;
                }
            }

            // Error handling (existing logic)
            const errorResult = await handleErrorDialog(inputLine, failedOrders, updateFailedOrders, speedMultiplier, autoSkipCheckbox);
            if (!errorResult.continueProcessing || errorResult.shouldSkip) break;

            await humanDelay(1000, speedMultiplier);
        }

        // Final check before failing
        if (document.getElementById(config.orderNumberFieldId)?.offsetParent) {
            updateStatus(`✅ Late success detection: Order field available`, 'success');
            return true;
        }

        updateStatus(`⚠️ Save confirmation incomplete after ${maxAttempts} attempts`, 'warning');
        return false;
    } catch (error) {
        // Existing error handling
    }
}

    ////////////////////

 function checkForSystemError(inputLine, failedOrders, updateFailedOrders, speedMultiplier) {
    try {
        // Check for system error button
        const errorButton = document.querySelector('li[uniquename="Button_Errors"]:not(.k-state-disabled)');
        if (errorButton) {
            console.log('[Delivery Date Updater] System error button detected');
            updateStatus(`❌ System error detected via error button`, 'error');
            return true;
        }

        // Let handleErrorDialog manage dialog detection
        return false;
    } catch (error) {
        console.error('[Delivery Date Updater] Error checking system errors:', error);
        updateStatus(`❌ Error checking for system errors: ${error.message}`, 'error');
        return false;
    }
}

        async function navigateToDeliveries(orderNumber, speedMultiplier) {
            try {
                updateStatus(`⌨️ Typing order number: ${orderNumber}`, 'processing');
                const orderNumberField = document.getElementById(config.orderNumberFieldId);
                if (!orderNumberField) {
                    updateStatus(`❌ Error: Order number field not found`, 'error');
                    return false;
                }
                await humanTypeInto(orderNumberField, orderNumber, speedMultiplier);

                updateStatus(`↹ Pressing Tab after order number`, 'processing');
                await simulateTabKey(orderNumberField, speedMultiplier);

                updateStatus(`🖱 Attempting to click Sales Lines tab`, 'processing');
                let salesTabSuccess = false;
                let salesTabAttempts = 0;
                const maxTabAttempts = 3;

                while (!salesTabSuccess && salesTabAttempts < maxTabAttempts) {
                    salesTabAttempts++;
                    updateStatus(`🖱 Sales Lines tab attempt ${salesTabAttempts}/${maxTabAttempts}`, 'processing');
                    try {
                        const salesTab = document.getElementById(config.salesLinesTabId);
                        if (!salesTab) {
                            updateStatus(`❌ Error: Sales Lines tab not found`, 'error');
                            throw new Error(`Sales Lines tab not found`);
                        }
                        if (salesTab.classList.contains('k-state-disabled') || salesTab.hasAttribute('disabled')) {
                            updateStatus(`⚠️ Sales Lines tab is disabled`, 'warning');
                            throw new Error(`Sales Lines tab is disabled`);
                        }
                        salesTab.focus();
                        salesTab.click();
                        const clickEvent = new MouseEvent('click', { bubbles: true });
                        salesTab.dispatchEvent(clickEvent);
                        await humanDelay(config.clickDelay, speedMultiplier);
                        if (salesTab.classList.contains('G2CurrentTabMode')) {
                            salesTabSuccess = true;
                            updateStatus(`✓ Sales Lines tab selected`, 'success');
                        } else {
                            updateStatus(`⚠️ Sales Lines tab not active, retrying...`, 'warning');
                        }
                    } catch (error) {
                        console.error(`[Delivery Date Updater] Error clicking Sales Lines tab:`, error);
                        await humanDelay(1000, speedMultiplier);
                    }
                }

                if (!salesTabSuccess) {
                    updateStatus(`❌ Failed to select Sales Lines tab after ${maxTabAttempts} attempts`, 'error');
                    return false;
                }

                updateStatus(`🖱 Attempting to click Deliveries tab`, 'processing');
                let deliveriesTabSuccess = false;
                let deliveriesTabAttempts = 0;

                while (!deliveriesTabSuccess && deliveriesTabAttempts < maxTabAttempts) {
                    deliveriesTabAttempts++;
                    updateStatus(`🖱 Deliveries tab attempt ${deliveriesTabAttempts}/${maxTabAttempts}`, 'processing');
                    try {
                        let deliveriesTab = document.querySelector('button[fieldname="DELIVERIES"]');
                        if (!deliveriesTab) {
                            deliveriesTab = document.querySelector('button[id^="Tab_DELIVERIES_"]');
                        }
                        if (!deliveriesTab) {
                            const buttons = document.querySelectorAll('button.k-button.G2Tab');
                            deliveriesTab = Array.from(buttons).find(button => {
                                const span = button.querySelector('span');
                                return span && span.textContent.trim() === 'Deliveries';
                            });
                        }
                        if (!deliveriesTab) {
                            updateStatus(`❌ Error: Deliveries tab not found`, 'error');
                            throw new Error(`Deliveries tab not found`);
                        }

                        log(`Found Deliveries tab: ID=${deliveriesTab.id}, fieldname=${deliveriesTab.getAttribute('fieldname')}`);

                        if (deliveriesTab.classList.contains('k-state-disabled') || deliveriesTab.hasAttribute('disabled')) {
                            updateStatus(`⚠️ Deliveries tab is disabled`, 'warning');
                            throw new Error(`Deliveries tab is disabled`);
                        }

                        deliveriesTab.focus();
                        deliveriesTab.click();
                        const clickEvent = new MouseEvent('click', { bubbles: true });
                        deliveriesTab.dispatchEvent(clickEvent);
                        await humanDelay(config.clickDelay, speedMultiplier);

                        if (deliveriesTab.classList.contains('G2CurrentTabMode')) {
                            deliveriesTabSuccess = true;
                            updateStatus(`✓ Deliveries tab selected`, 'success');
                        } else {
                            updateStatus(`⚠️ Deliveries tab not active, retrying...`, 'warning');
                        }
                    } catch (error) {
                        console.error(`[Delivery Date Updater] Error clicking Deliveries tab:`, error);
                        await humanDelay(1000, speedMultiplier);
                    }
                }

                if (!deliveriesTabSuccess) {
                    updateStatus(`❌ Failed to select Deliveries tab after ${maxTabAttempts} attempts`, 'error');
                    return false;
                }

                return true;
            } catch (error) {
                console.error('[Delivery Date Updater] Error navigating to deliveries:', error);
                updateStatus(`❌ Error navigating: ${error.message}`, 'error');
                return false;
            }
        }

        function updateStatus(message, type) {
            try {
                const statusDisplay = document.querySelector('#delivery-date-updater-menu div[style*="padding: 2px 5px"]');
                if (!statusDisplay) return;

                let style = `
                    font-size: 11px;
                    padding: 2px 5px;
                    border-radius: 3px;
                    margin: 2px 0;
                    white-space: pre-wrap;
                `;

                switch(type) {
                    case 'success':
                        style += `background-color: #4CAF50; color: white;`;
                        break;
                    case 'error':
                        style += `background-color: #f44336; color: white;`;
                        break;
                    case 'warning':
                        style += `background-color: #ff9800; color: white;`;
                        break;
                    case 'processing':
                        style += `background-color: #2196F3; color: white;`;
                        break;
                    default:
                        style += `background-color: #e0e0e0; color: #333;`;
                }

                statusDisplay.innerHTML = `<div style="${style}">${message}</div>`;
                console.log(`[Status] ${message}`);
            } catch (error) {
                console.error('Error updating status:', error);
            }
        }

        function waitForDeliveryFieldFocus(speedMultiplier = 1.0) {
            return new Promise((resolve) => {
                let attempts = 0;
                const maxAttempts = config.retryAttempts;

                const checkFocus = async () => {
                    attempts++;

                    const deliveryDateField = document.getElementById(config.deliveryDateFieldId);
                    if (!deliveryDateField) {
                        if (attempts >= maxAttempts) {
                            log(`Delivery date field not found after ${maxAttempts} attempts`);
                            resolve(false);
                        } else {
                            setTimeout(checkFocus, config.retryDelay / speedMultiplier);
                        }
                        return;
                    }

                    if (document.activeElement === deliveryDateField) {
                        log('Delivery date field is focused');
                        resolve(true);
                        return;
                    }

                    try {
                        deliveryDateField.focus();
                        await humanDelay(100, speedMultiplier);
                        deliveryDateField.click();

                        if (document.activeElement === deliveryDateField) {
                            log('Successfully focused delivery date field');
                            resolve(true);
                            return;
                        }
                    } catch (error) {
                        log(`Error focusing delivery date field: ${error.message}`);
                    }

                    if (attempts >= maxAttempts) {
                        log(`Failed to focus delivery date field after ${maxAttempts} attempts`);
                        resolve(false);
                    } else {
                        setTimeout(checkFocus, config.retryDelay / speedMultiplier);
                    }
                };

                setTimeout(checkFocus, config.initialDelay / speedMultiplier);
            });
        }

     function initialize() {
    log('Initializing Delivery Date Updater script with human-like input behavior');
    try {
        const { menuContainer, updateStatus: statusUpdater, skipConfirmationCheckbox, autoSkipCheckbox, failedOrders, updateFailedOrders } = createMenu();
        log('Menu created successfully');

        // Update processButton event listener to pass autoSkipCheckbox
        const processButton = menuContainer.querySelector('button[style*="background-color: #4CAF50"]');
        if (processButton) {
            processButton.addEventListener('click', async () => {
                try {
                    const textarea = menuContainer.querySelector('textarea');
                    const lines = textarea.value.trim().split('\n').filter(line => line.trim() !== '');
                    if (lines.length === 0) {
                        statusUpdater('No data to process', 'warning');
                        return;
                    }

                    const speedSlider = menuContainer.querySelector('input[type="range"]');
                    const speedMultiplier = parseFloat(speedSlider.value);

                    let isProcessing = true;
                    let shouldStop = false;
                    let previousOrderNumber = null;

                    processButton.disabled = true;
                    const clearButton = menuContainer.querySelector('button[style*="background-color: #f44336"]');
                    clearButton.disabled = true;
                    const stopButton = menuContainer.querySelector('button[style*="background-color: #ff9800"]');
                    stopButton.style.display = 'block';
                    stopButton.disabled = false;

                    window.scriptIsPaused = false;
                    console.log('[Delivery Date Updater] Initialized scriptIsPaused to false');

                    for (let i = 0; i < lines.length; i++) {
                        let pauseTimeout = 30000;
                        while (window.scriptIsPaused && pauseTimeout > 0) {
                            console.log('[Delivery Date Updater] Script paused, waiting for user action...');
                            statusUpdater('⏸ Script paused due to G2 alert. Awaiting user action...', 'warning');
                            await humanDelay(1000, speedMultiplier);
                            pauseTimeout -= 1000;
                        }
                        if (pauseTimeout <= 0) {
                            console.warn('[Delivery Date Updater] Pause timeout reached, resuming processing');
                            window.scriptIsPaused = false;
                            statusUpdater('⚠️ Pause timeout, resuming processing', 'warning');
                        }

                        if (shouldStop) {
                            statusUpdater('Processing stopped by user', 'warning');
                            break;
                        }

                        const line = lines[i].trim();
                        statusUpdater(`Processing ${i+1}/${lines.length}: ${line}`, 'processing');
                        const match = line.match(/(\d{2}\/\d{2}\/\d{2})\s+([\w\d]+)\s+(\d+)(?:\s+(\d+))?/);
                        if (!match) {
                            statusUpdater(`Invalid format on line ${i+1}: ${line}`, 'error');
                            if (!failedOrders.includes(line)) {
                                failedOrders.push(line);
                                updateFailedOrders(failedOrders);
                            }
                            await humanDelay(2000, speedMultiplier);
                            continue;
                        }

                        const dateStr = match[1];
                        const orderNumber = match[2];
                        const lineNumber = match[3];
                        const deliveryLine = match[4] || null;
                        const convertedDate = dateStr.replace(/\//g, '');

                        try {
                            const isLastLine = i === lines.length - 1;
                            const nextOrderNumber = !isLastLine ? lines[i + 1].match(/(\d{2}\/\d{2}\/\d{2})\s+([\w\d]+)\s+(\d+)/)?.[2] : null;
                            const needsReturn = isLastLine || (nextOrderNumber && nextOrderNumber !== orderNumber);

                      const success = await processLineUpdate(
    orderNumber,
    lineNumber,
    dateStr,
    convertedDate,
    speedMultiplier,
    previousOrderNumber,
    deliveryLine,
    skipConfirmationCheckbox,
    line,
    failedOrders,
    updateFailedOrders,
    autoSkipCheckbox
);
                            if (success) {
                                statusUpdater(`Completed ${i+1}/${lines.length}: Order ${orderNumber}, Line ${lineNumber}${deliveryLine ? `, Delivery ${deliveryLine}` : ''}`, 'success');
                                previousOrderNumber = orderNumber;
                            } else {
                                statusUpdater(`Failed ${i+1}/${lines.length}: Order ${orderNumber}, Line ${lineNumber}${deliveryLine ? `, Delivery ${deliveryLine}` : ''}`, 'error');
                                if (!failedOrders.includes(line)) {
                                    failedOrders.push(line);
                                    updateFailedOrders(failedOrders);
                                }
                                previousOrderNumber = null;
                            }

                            if (needsReturn) {
                                await escapeToOrderNumberField(speedMultiplier, line, failedOrders, updateFailedOrders);
                            }

                            await humanDelay(config.humanDelayBetweenItems, speedMultiplier);
                        } catch (error) {
                            console.error('[Delivery Date Updater] Error processing line:', error);
                            statusUpdater(`Error: ${error.message}`, 'error');
                            if (!failedOrders.includes(line)) {
                                failedOrders.push(line);
                                updateFailedOrders(failedOrders);
                            }
                            previousOrderNumber = null;
                            await humanDelay(2000, speedMultiplier);
                        }
                    }

                    statusUpdater('Finalizing: Returning to order number field', 'processing');
                    const finalReturnSuccess = await escapeToOrderNumberField(speedMultiplier, null, failedOrders, updateFailedOrders);
                    if (!finalReturnSuccess) {
                        statusUpdater('❌ Failed to return to order number field at end', 'error');
                    } else {
                        statusUpdater('✓ Returned to order number field', 'success');
                    }

                    isProcessing = false;
                    statusUpdater('Processing complete', 'success');
                    processButton.disabled = false;
                    clearButton.disabled = false;
                    stopButton.style.display = 'none';
                    previousOrderNumber = null;
                } catch (error) {
                    console.error('[Delivery Date Updater] Error in processing loop:', error);
                    statusUpdater(`❌ Error processing: ${error.message}`, 'error');
                    await escapeToOrderNumberField(speedMultiplier, null, failedOrders, updateFailedOrders);
                    isProcessing = false;
                    processButton.disabled = false;
                    clearButton.disabled = false;
                    stopButton.style.display = 'none';
                    previousOrderNumber = null;
                }
            });
        }
    } catch (error) {
        log('Error during initialization: ' + error.message);
        console.error(error);
        setTimeout(() => {
            log('Retrying initialization...');
            try {
                createMenu();
            } catch (retryError) {
                log('Failed to initialize after retry: ' + retryError.message);
                console.error(retryError);
                createFallbackMenu(retryError);
            }
        }, 2000);
    }
}


function createReloadButton() {
    const reloadBtn = document.createElement('button');
    reloadBtn.textContent = 'Load Delivery Date Updater';
    reloadBtn.id = 'load-delivery-updater-btn';
    Object.assign(reloadBtn.style, {
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: '9998',
        padding: '5px 10px',
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px'
    });

    reloadBtn.addEventListener('click', () => {
        reloadBtn.textContent = 'Loading...';
        reloadBtn.disabled = true;
        setTimeout(() => {
            reloadBtn.remove();
            // Call checkPageAndInitialize to recheck configuration
            checkPageAndInitialize();
        }, 500);
    });

    document.body.appendChild(reloadBtn);
}


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
            console.log(`[Delivery Date Updater] Updated script status from GitHub: ${newStatus}`);
            if (!newStatus) {
                updateStatus('🛑 Script disabled by remote configuration', 'error');
                const menuContainer = document.getElementById('delivery-date-updater-menu');
                if (menuContainer) {
                    menuContainer.innerHTML = '<div>Outdated Tool - Please update to new version. </div>';
                    menuContainer.style.backgroundColor = '#ffebee';
                    menuContainer.style.border = '1px solid #f44336';
                    createReloadButton();
                }
            }
        }
    } catch (error) {
        console.error('[Delivery Date Updater] Error updating status from GitHub:', error);
    }
}

// Run GitHub check every 30 minutes
setInterval(updateStatusFromGitHub, 30 * 60 * 1000);


 async function checkPageAndInitialize() {
    log('Checking remote configuration before initialization');
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // Reduced to 2 seconds
        const response = await fetch('https://raw.githubusercontent.com/oeowork/gl/refs/heads/main/work', {
            signal: controller.signal,
            cache: 'default', // Allow browser caching
            headers: { 'Accept': 'text/plain' }
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error(`[Delivery Date Updater] Fetch failed with status: ${response.status} ${response.statusText}`);
            updateStatus('⚠️ Failed to fetch configuration, assuming enabled', 'warning');
            initialize(); // Fallback to enabled
            return;
        }

        const configText = await response.text();
        const trimmedText = configText.trim().toLowerCase();
        console.log(`[Delivery Date Updater] Fetched configuration value: "${trimmedText}"`);

        if (trimmedText !== 'true') {
            console.log('[Error, Tool Outdated');
            updateStatus('🛑 Error, Tool Outdated', 'error');
            const disabledMenu = document.createElement('div');
            disabledMenu.id = 'delivery-date-updater-disabled';
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
            disabledMenu.textContent = 'Error, Tool Outdated';
            document.body.appendChild(disabledMenu);
            createReloadButton();
            return;
        }

        console.log('[Delivery Date Updater] Script enabled by configuration, proceeding with initialization');
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            log('Page is ready and script enabled, initializing script');
            initialize();
        } else {
            log('Page not yet ready, waiting for load event');
            window.addEventListener('load', initialize);
        }
    } catch (error) {
        console.error('[Delivery Date Updater] Error checking configuration:', error.message);
        updateStatus('⚠️ Error fetching configuration, assuming enabled', 'warning');
        initialize(); // Fallback to enabled
        createReloadButton();
    }
}

        setTimeout(checkPageAndInitialize, 1000);

        setTimeout(() => {
            if (!document.getElementById('delivery-date-updater-menu') &&
                !document.getElementById('delivery-date-updater-fallback')) {
                log('Menu not detected after timeout, adding reload button');
                createReloadButton();
            }
        }, 5000);
    })();
