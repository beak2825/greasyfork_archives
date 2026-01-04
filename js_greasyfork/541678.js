// ==UserScript==
// @name            [MWI] Inventory Items Quick Sell Assistant (Express Version)
// @namespace       https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-auto-sell-assistant
// @version         1.0.7.2
// @description     [Auto Sell Assistant] Instantly sell specified inventory items with a single click. This express version intelligently minimizes operational delays, boosting in-game efficiency by optimizing item sale speed beyond the capabilities of the original plugin. Hotkey: S
// @author          shenhuanjie (Grogu2484 Translate to English)
// @license         MIT
// @match           https://www.milkywayidle.com/game*
// @icon            https://www.milkywayidle.com/favicon.svg
// @grant           GM_setValue
// @grant           GM_getValue
// @homepage        https://greasyfork.org/scripts/535491
// @supportURL      https://greasyfork.org/scripts/535491
// @connect         greasyfork.org
// @require         https://cdn.tailwindcss.com
// @run-at          document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/541678/%5BMWI%5D%20Inventory%20Items%20Quick%20Sell%20Assistant%20%28Express%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541678/%5BMWI%5D%20Inventory%20Items%20Quick%20Sell%20Assistant%20%28Express%20Version%29.meta.js
// ==/UserScript==

// S is the Quick Key for Sale

(function() {
    'use strict';

    // Determine user language environment
    const isChinese = navigator.language.includes('zh');

    // Internationalization messages
    const messages = {
        zh: {
            // Button text
            goToMarket: 'Go to Market',
            sell: 'Sell',
            all: 'All',
            postSellOrder: 'Post Sell Order',

            // Error messages
            selectItemFirst: 'Please select an item first!',
            cannotNavigateToMarket: 'Cannot navigate to market page!',

            // Notification messages
            scriptLoaded: 'Script loaded',
            executingStep: 'Executing: {action} ({attempt}/{maxAttempts})',
            clickedButton: 'Clicked "{action}" button',
            stepCompleted: 'Step {current}/{total} ({action}) completed in {time}ms',
            stepFailed: 'Step {current}/{total} ({action}) failed: {error} in {time}ms',
            executionFailed: 'Execution failed: {error}',
            increasingDelay: 'Increasing delay to {delay}ms, preparing to retry',
            chainCompleted: 'Action chain completed, total time: {time}ms',
            optimizedDelay: 'Optimized "{action}" delay to {delay}ms',
            optimizationCompleted: 'Optimization completed, average time saved: {time}ms'
        },
        en: {
            // Button text
            goToMarket: 'Go to Market',
            sell: 'Sell',
            all: 'All',
            postSellOrder: 'Post Sell Order',

            // Error messages
            selectItemFirst: 'Please select an item first!',
            cannotNavigateToMarket: 'Cannot navigate to market page!',

            // Notification messages
            scriptLoaded: 'Script loaded',
            executingStep: 'Executing: {action} ({attempt}/{maxAttempts})',
            clickedButton: 'Clicked "{action}" button',
            stepCompleted: 'Step {current}/{total} ({action}) completed in {time}ms',
            stepFailed: 'Step {current}/{total} ({action}) failed: {error} in {time}ms',
            executionFailed: 'Execution failed: {error}',
            increasingDelay: 'Increasing delay to {delay}ms, preparing to retry',
            chainCompleted: 'Action chain completed, total time: {time}ms',
            optimizedDelay: 'Optimized "{action}" delay to {delay}ms',
            optimizationCompleted: 'Optimization completed, average time saved: {time}ms'
        }
    };

    // Get message function
    function getMessage(key, replacements = {}) {
        const lang = 'en'; // Force English language
        let message = messages[lang][key];

        if (!message) {
            console.warn(`Missing translation for key: ${key}`);
            return key;
        }

        for (const [placeholder, value] of Object.entries(replacements)) {
            message = message.replace(`{${placeholder}}`, value);
        }
        return message;
    }

    // Global configuration
    const CONFIG = {
        debugMode: true,
        notificationPosition: 'top-right',
        notificationDuration: 3000,
        defaultHighlightColor: 'rgba(255, 0, 0, 0.1)',
        defaultHighlightDuration: 500,
        precondition: {
            selector: '[class*="Item_selected__"]',
            errorMessage: getMessage('selectItemFirst')
        },
        hotkey: {
            key: 's',
            altKey: false,
            ctrlKey: false,
            shiftKey: false
        },
        marketSelectors: [
            '[class*="MarketplacePage_container__"]',
            '[class*="MarketplacePanel_"]',
            '[data-testid="marketplace"]'
        ],
        localStorageKey: 'autoClickOptimalDelays',
        minDelay: 10,       // Minimum delay time (milliseconds)
        maxDelay: 2000,      // Maximum delay time (milliseconds)
        delayStep: 100,       // Delay adjustment step (milliseconds)
        retryAttempts: 3,    // Maximum retry attempts per step
        successThreshold: 5, // Success count baseline for calculating optimal delay
        optimizationFactor: 1.3 // Safety margin coefficient
    };

    // Load optimal delay configuration from local storage
    let optimalDelays = JSON.parse(GM_getValue(CONFIG.localStorageKey, '{}'));

    // Initialize execution statistics
    const executionStats = {};

    // Node pool (stores all selectable nodes)
    const NODE_POOL = [
        { id: 'start', type: 'start' },
        {
            id: 'action1',
            type: 'action',
            description: 'Go to Market',
            containerSelector: '[class*="MuiTooltip-tooltip"]',
            buttonSelector: 'button[class*="Button_button__"][class*="Button_fullWidth__"]',
            text: getMessage('goToMarket'),
            checkResult: function() {
                return checkMarketPage();
            },
            errorMessage: getMessage('cannotNavigateToMarket')
        },
        {
            id: 'action2',
            type: 'action',
            description: 'Sell',
            containerSelector: '[class*="MarketplacePanel_itemContainer__"]',
            buttonSelector: 'button[class*="Button_sell__"]',
            text: getMessage('sell')
        },
        {
            id: 'action3',
            type: 'action',
            description: 'All',
            containerSelector: '[class*="MarketplacePanel_quantityInputs__"]',
            buttonSelector: 'button',
            text: getMessage('all')
        },
        {
            id: 'action4',
            type: 'action',
            description: 'Post Sell Order',
            containerSelector: '[class*="MarketplacePanel_modalContent__"]',
            buttonSelector: '[class*="MarketplacePanel_postButtonContainer__"] > button[class*="Button_success__"]',
            text: getMessage('postSellOrder')
        },
        { id: 'end', type: 'end' }
    ];

    // Workflow configuration (specifies currently used nodes and their order)
    const WORKFLOW_CONFIG = [
        { nodeId: 'start', onSuccess: 'action1', onFailure: 'end' },
        { nodeId: 'action1', onSuccess: 'action2', onFailure: 'end' },
        { nodeId: 'action2', onSuccess: 'action3', onFailure: 'end' },
        { nodeId: 'action3', onSuccess: 'action4', onFailure: 'end' },
        { nodeId: 'action4', onSuccess: 'end', onFailure: 'end' },
        { nodeId: 'end' }
    ];

    // Initialize workflow node delay configuration
    NODE_POOL.forEach(node => {
        if (node.type === 'action') {
            const key = node.description;
            node.preDelay = optimalDelays[key] || 800;
            node.postDelay = optimalDelays[`${key}_post`] || 600;
            executionStats[key] = {
                successes: 0,
                failures: 0,
                totalTime: 0,
                attempts: []
            };
        }
    });

    // Generate actual execution node mapping based on workflow configuration
    const WORKFLOW_NODES = WORKFLOW_CONFIG.map(config => {
        const node = NODE_POOL.find(n => n.id === config.nodeId);
        return {
            ...node,
            onSuccess: config.onSuccess,
            onFailure: config.onFailure
        };
    });

    // Generate workflow ASCII art function
    function printWorkflowDiagram() {
        if (!CONFIG.debugMode) return;

        console.log('===== Workflow Configuration Diagram =====');
        console.log('Node Types: [Start] Start Node | [Action] Action Node | [End] End Node');
        console.log('Connection Symbols: → Success Transition | × Failure Transition');
        console.log('');

        WORKFLOW_CONFIG.forEach(config => {
            const node = NODE_POOL.find(n => n.id === config.nodeId);
            if (!node) return;

            let nodeLabel;
            switch (node.type) {
                case 'start':
                    nodeLabel = `[Start] ${node.id}`;
                    break;
                case 'action':
                    nodeLabel = `[Action] ${node.id} (${node.description})`;
                    break;
                case 'end':
                    nodeLabel = `[End] ${node.id}`;
                    break;
                default:
                    nodeLabel = `[Unknown] ${node.id}`;
            }

            if (config.onSuccess) {
                const successNode = NODE_POOL.find(n => n.id === config.onSuccess) || { id: config.onSuccess };
                console.log(`${nodeLabel} → ${successNode.id} (Success)`);
            }
            if (config.onFailure && config.onFailure !== config.onSuccess) {
                const failureNode = NODE_POOL.find(n => n.id === config.onFailure) || { id: config.onFailure };
                console.log(`${nodeLabel} × ${failureNode.id} (Failure)`);
            }
        });

        console.log('==========================================');
    }

    // Output flow diagram in debug mode
    printWorkflowDiagram();

    // Initialization
    document.addEventListener('keydown', function(event) {
        const { key, altKey, ctrlKey, shiftKey } = CONFIG.hotkey;

        if (
            event.key.toLowerCase() === key.toLowerCase() &&
            event.altKey === altKey &&
            event.ctrlKey === ctrlKey &&
            event.shiftKey === shiftKey
        ) {
            event.preventDefault();
            executeWorkflow(); // Changed to trigger workflow execution
        }
    });

    log(getMessage('scriptLoaded'), 'info');
    log(`Using optimal delay configuration: ${JSON.stringify(optimalDelays)}`, 'info');

    // Market page check function
    function checkMarketPage() {
        for (const selector of CONFIG.marketSelectors) {
            if (document.querySelectorAll(selector).length > 0) {
                return true;
            }
        }
        return false;
    }

    // Execute complete action chain
    async function executeWorkflow() {
        // Execute precondition check
        if (!checkPrecondition()) {
            showNotification(CONFIG.precondition.errorMessage, 'error');
            return;
        }

        const startTime = performance.now();
        let currentNodeId = 'start'; // Initial node is start

        // Calculate total steps (excluding start and end nodes)
        const totalSteps = WORKFLOW_NODES.filter(node => node.type === 'action').length;
        let currentStep = 0;

        while (true) {
            const currentNode = WORKFLOW_NODES.find(node => node.id === currentNodeId);
            if (!currentNode) {
                showNotification('Workflow node not found', 'error');
                return;
            }

            if (currentNode.type === 'end') {
                // Reached end node
                const totalDuration = Math.round(performance.now() - startTime);

                // Check if there are unhandled errors
                if (currentNode.error) {
                    const errorMsg = `Workflow aborted: ${currentNode.error.message}`;
                    const notification = showNotification(errorMsg, 'error');
                    if (notification) {
                        notification.style.top = '20px';
                        notification.style.right = '20px';
                    }
                    log(errorMsg, 'error');
                } else {
                    // showNotification(getMessage('chainCompleted', {time: totalDuration}), 'success');
                    log(getMessage('chainCompleted', {time: totalDuration}), 'success');
                }

                saveOptimalDelays();
                return;
            }

            if (currentNode.type === 'action') {
                currentStep++; // Increment current step
                let attempt = 0;
                let success = false;

                while (attempt < CONFIG.retryAttempts && !success) {
                    attempt++;
                    // Only log execution info, don't show notification
                    log(getMessage('executingStep', {
                        action: currentNode.description,
                        attempt: attempt,
                        maxAttempts: CONFIG.retryAttempts
                    }), 'info');

                    const actionStartTime = performance.now();

                    try {
                        // No longer show start execution notification, only show on successful completion

                        // Find element
                        const element = findElement(currentNode);

                        if (!element) {
                            // Show error notification, then throw error
                            const errorMsg = `"${currentNode.description}" button not found`;

                            // Ensure notification displays in top-right corner
                            const notification = showNotification(`Step ${currentStep}/${totalSteps}: ${errorMsg}`, 'error');
                            notification.style.top = '20px';
                            notification.style.right = '20px';

                            const error = new Error(errorMsg);
                            error.notificationShown = true; // Mark notification as shown
                            throw error;
                        }

                        // Highlight and click element
                        highlightElement(element);

                        // Record pre-click state
                        const beforeClickTime = performance.now();

                        element.click();
                        log(getMessage('clickedButton', {action: currentNode.description}), 'success');

                        // Wait for post-delay and check result
                        await wait(currentNode.postDelay);

                        // Check result (if check function exists)
                        if (typeof currentNode.checkResult === 'function') {
                            const result = currentNode.checkResult();
                            if (!result) {
                                throw new Error(currentNode.errorMessage ||
                                    `Check failed after executing "${currentNode.description}"`);
                            }
                        }

                        // Execution successful
                        success = true;
                        currentNodeId = currentNode.onSuccess || 'end'; // Default jump to end

                        // Calculate actual execution time
                        const actualTime = Math.round(performance.now() - actionStartTime);

                        // Show step completion info
                        showNotification(getMessage('stepCompleted', {
                            current: currentStep,
                            total: totalSteps,
                            action: currentNode.description,
                            time: actualTime
                        }), 'success');

                        // Update statistics
                        updateStats(currentNode.description, true, actualTime);

                        // Wait for next node's pre-delay
                        await wait(currentNode.preDelay);

                    } catch (error) {
                        // Execution failed
                        const errorTime = Math.round(performance.now() - actionStartTime);
                        log(`Error: ${error.message}`, 'error');

                        // Ensure error message with step info is displayed (if not previously shown)
                        if (!error.notificationShown) {
                            showNotification(`Step ${currentStep}/${totalSteps}: ${error.message} (${errorTime}ms)`, 'error');
                        }

                        updateStats(currentNode.description, false, errorTime);

                        if (attempt < CONFIG.retryAttempts) {
                            currentNode.postDelay = Math.min(currentNode.postDelay + CONFIG.delayStep, CONFIG.maxDelay);
                            log(`Increased "${currentNode.description}" delay to ${currentNode.postDelay}ms`, 'warning');
                            showNotification(getMessage('increasingDelay', {delay: currentNode.postDelay}), 'warning');
                        } else {
                            // Mark as abnormal termination and pass error info
                            const endNode = WORKFLOW_NODES.find(node => node.id === (currentNode.onFailure || 'end'));
                            if (endNode) {
                                endNode.error = error;
                            }
                            currentNodeId = currentNode.onFailure || 'end';
                        }
                    }
                }
            } else if (currentNode.type === 'start') {
                // Start node directly jumps to onSuccess
                currentNodeId = currentNode.onSuccess || 'end';
                // showNotification('Workflow started', 'info');
            }
        }
    }

    // Find element function
    function findElement(action) {
        const containers = document.querySelectorAll(action.containerSelector);

        for (const container of containers) {
            const candidates = container.querySelectorAll(action.buttonSelector);

            for (const candidate of candidates) {
                if (candidate.textContent.trim() === action.text) {
                    return candidate;
                }
            }
        }

        // Try global search
        const globalCandidates = document.querySelectorAll(action.buttonSelector);

        for (const candidate of globalCandidates) {
            if (candidate.textContent.trim() === action.text) {
                return candidate;
            }
        }

        // If no exact match found, try fuzzy matching (for possible translation differences)
        if (!isChinese) {
            // In English environment, try more lenient matching
            for (const container of containers) {
                const candidates = container.querySelectorAll(action.buttonSelector);

                for (const candidate of candidates) {
                    const buttonText = candidate.textContent.trim().toLowerCase();
                    const actionText = action.text.toLowerCase();

                    // Check if button text contains action text, or action text contains button text
                    if (buttonText.includes(actionText) || actionText.includes(buttonText)) {
                        return candidate;
                    }
                }
            }

            // Global fuzzy matching
            for (const candidate of globalCandidates) {
                const buttonText = candidate.textContent.trim().toLowerCase();
                const actionText = action.text.toLowerCase();

                if (buttonText.includes(actionText) || actionText.includes(buttonText)) {
                    return candidate;
                }
            }
        }

        return null;
    }

    // Precondition check
    function checkPrecondition() {
        const elements = document.querySelectorAll(CONFIG.precondition.selector);
        return elements.length > 0;
    }

    // Highlight element
    function highlightElement(element, color = CONFIG.defaultHighlightColor, duration = CONFIG.defaultHighlightDuration) {
        const originalStyle = element.style.cssText;

        element.style.cssText = `
            ${originalStyle}
            transition: all 0.3s;
            box-shadow: 0 0 0 3px ${color};
        `;

        setTimeout(() => {
            element.style.cssText = originalStyle;
        }, duration);
    }

    // Store active notifications
    const activeNotifications = [];

    // Update notification positions
    function updateNotificationPositions() {
        let currentTop = 20;
        activeNotifications.forEach(notif => {
            notif.style.top = `${currentTop}px`;
            currentTop += notif.offsetHeight + 10;
        });
    }

    // Show notification (supports stacking effect)
    function showNotification(message, type = 'info') {
        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'action-chain-notification';

        // Notification styles
        notification.style.cssText = `
            position: fixed;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 199;
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            font-weight: 500;
            max-width: 300px;
            transform: translateY(-30px);
            opacity: 0;
            left: 20px;
        `;

        // Type styles
        const types = {
            info: {
                bg: 'rgba(30, 144, 255, 0.95)',
                text: 'white',
                icon: 'ℹ️'
            },
            success: {
                bg: 'rgba(76, 175, 80, 0.95)',
                text: 'white',
                icon: '✅'
            },
            error: {
                bg: 'rgba(244, 67, 54, 0.95)',
                text: 'white',
                icon: '❌'
            },
            warning: {
                bg: 'rgba(255, 193, 7, 0.95)',
                text: '#333',
                icon: '⚠️'
            }
        };

        const style = types[type] || types.info;
        notification.style.backgroundColor = style.bg;
        notification.style.color = style.text;

        // Set content (add icon)
        notification.innerHTML = `
            <div style="display: flex; align-items: center;">
                <span style="margin-right: 8px; font-size: 16px;">${style.icon}</span>
                <span>${message}</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);
        activeNotifications.push(notification);

        // Calculate and set position
        updateNotificationPositions();

        // Show animation
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);

        // Auto disappear
        setTimeout(() => {
            notification.style.transform = 'translateY(-30px)';
            notification.style.opacity = '0';
            notification.style.boxShadow = 'none';

            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                // Remove from array
                const index = activeNotifications.indexOf(notification);
                if (index > -1) {
                    activeNotifications.splice(index, 1);
                }
                // Update remaining notification positions
                updateNotificationPositions();
            }, 400);
        }, CONFIG.notificationDuration);

        return notification;
    }

    // Log function
    function log(message, level = 'info') {
        if (!CONFIG.debugMode && level !== 'error') return;

        const colors = {
            info: 'color: #333;',
            success: 'color: #4CAF50;',
            error: 'color: #F44336; font-weight: bold;',
            warning: 'color: #FFC107;',
            debug: 'color: #2196F3;'
        };

        console.log(`%c[Workflow Script] ${message}`, colors[level] || colors.info);
    }

    // Debug info
    function logDebugInfo(action) {
        if (!CONFIG.debugMode) return;

        console.groupCollapsed(`🔍 Debug Info: ${action.description}`);

        console.log(`▶ Configuration Parameters:`, {
            containerSelector: action.containerSelector,
            buttonSelector: action.buttonSelector,
            text: action.text,
            currentPreDelay: action.preDelay,
            currentPostDelay: action.postDelay
        });

        const containers = document.querySelectorAll(action.containerSelector);
        console.log(`▶ Container Search Results: Found ${containers.length} containers`);

        if (containers.length > 0) {
            console.log(`Container List:`, containers);

            containers.forEach((container, index) => {
                const buttons = container.querySelectorAll(action.buttonSelector);
                console.log(`  ▶ Container ${index + 1}: Found ${buttons.length} candidate buttons`);

                if (buttons.length > 0) {
                    console.log(`  Button List:`);
                    buttons.forEach((btn, btnIndex) => {
                        console.log(`    ${btnIndex + 1}. "${btn.textContent.trim()}"`);
                    });
                }
            });
        }

        const globalButtons = document.querySelectorAll(action.buttonSelector);
        console.log(`▶ Global Button Search Results: Found ${globalButtons.length} candidate buttons`);

        if (globalButtons.length > 0) {
            console.log(`Global Button List:`);
            globalButtons.forEach((btn, index) => {
                console.log(`  ${index + 1}. "${btn.textContent.trim()}"`);
            });
        }

        console.groupEnd();
    }

    // Wait function
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Update execution statistics
    function updateStats(actionName, success, executionTime = 0) {
        const stats = executionStats[actionName];

        if (success) {
            stats.successes++;
            stats.totalTime += executionTime;
            stats.attempts.push(executionTime);

            // Record best execution time
            const bestTime = Math.min(...stats.attempts);

            // Auto-adjust delay - if consecutive successes, try reducing delay
            if (stats.successes >= CONFIG.successThreshold) {
                // Calculate average execution time and add safety margin
                const avgTime = stats.totalTime / stats.successes;
                const safeDelay = Math.max(
                    Math.round(bestTime * CONFIG.optimizationFactor),
                    CONFIG.minDelay
                );

                // If current delay is greater than calculated safe delay, reduce delay
                const targetAction = WORKFLOW_NODES.find(node => node.type === 'action' && node.description === actionName);
                if (targetAction?.postDelay > safeDelay) {
                    targetAction.postDelay = safeDelay;
                    log(`Optimized "${actionName}" delay to ${safeDelay}ms (best: ${Math.round(bestTime)}ms)`, 'info');
                    // showNotification(getMessage('optimizedDelay', {action: actionName, delay: safeDelay}), 'info');
                }
            }
        } else {
            stats.failures++;
        }
    }

    // Save optimal delay configuration
    function saveOptimalDelays() {
        const delays = {};

        WORKFLOW_NODES.filter(node => node.type === 'action').forEach(action => {
            delays[action.description] = action.preDelay;
            delays[`${action.description}_post`] = action.postDelay;
        });

        GM_setValue(CONFIG.localStorageKey, JSON.stringify(delays));
        log(`Saved optimal delay configuration: ${JSON.stringify(delays)}`, 'info');

        // Show optimization results
        const totalSavedTime = Object.values(executionStats)
            .filter(s => s.successes > 0)
            .reduce((sum, s) => sum + (s.totalTime / s.successes), 0);

        if (totalSavedTime > 0) {
            log(`Optimization potential: Average time saved ${Math.round(totalSavedTime)}ms`, 'info');
            // showNotification(getMessage('optimizationCompleted', {time: Math.round(totalSavedTime)}), 'success');
        }
    }
})();