// ==UserScript==
// @name         Facebook Activity Auto Deleter (2025) - Optimized
// @namespace    https://greasyfork.org/en/users/1454546-shawnfrost13
// @version      5.03
// @description  Fast and efficient Facebook activity log cleaner with improved item detection and progressive skipping.
// @author       shawnfrost13 (optimized by Claude)
// @license      MIT
// @match        https://www.facebook.com/*/allactivity*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/531976/Facebook%20Activity%20Auto%20Deleter%20%282025%29%20-%20Optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/531976/Facebook%20Activity%20Auto%20Deleter%20%282025%29%20-%20Optimized.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        // Delays (in ms)
        menuClickDelay: 300,      // Time to wait after clicking menu button
        deleteClickDelay: 300,    // Time to wait after clicking delete option
        betweenItemsDelay: 800,   // Random base delay between deletion attempts
        randomDelayMax: 400,      // Additional random delay to avoid detection
        errorCheckDelay: 800,     // How long to wait to check for errors (increased)
        scrollDelay: 1500,        // How long to wait after scrolling
        
        // UI
        uiUpdateInterval: 500,    // How often to update stats display
        
        // Error handling
        maxRetries: 3,            // Maximum retries before skipping item permanently (increased)
        skipIncrement: 1,         // How many items to skip when encountering problems (NEW)
        maxSkipAhead: 5,          // Maximum items to skip ahead at once (NEW)
        
        errorTexts: [             // Text patterns that indicate errors
            "Something went wrong",
            "Please try again",
            "An error occurred",
            "We couldn't process",
            "Action blocked",
            "You're temporarily restricted" // Added this common error
        ],
        
        // Progressive operation (NEW)
        resetSkipCountAfterSuccess: 3, // Reset skip counter after this many successful operations
    };

    // ===== STATE =====
    const STATE = {
        isRunning: false,
        deletionCount: 0,
        skipCount: 0,
        currentItem: null,
        problemItems: new Map(),  // Map of signatures to retry counts
        lastActionTime: 0,        // For monitoring performance
        processingTime: [],       // Track how long each deletion takes
        
        // Progressive operation (NEW)
        consecutiveSuccesses: 0,  // Count consecutive successful deletions
        currentSkipAhead: 1,      // How many items to skip if problems persist
        lastSuccessTimestamp: 0,  // When was the last successful deletion
    };

    // ===== DOM ELEMENT REFERENCES =====
    const DOM = {
        statusDisplay: null,
        statsDisplay: null,
        toggleButton: null,
        resetButton: null,
        speedSlider: null
    };

    // ===== UTILITY FUNCTIONS =====
    function log(message, type = 'info') {
        const prefix = {
            'info': '📋',
            'success': '✅',
            'error': '❌',
            'warn': '⚠️',
            'skip': '⏭️',
            'scroll': '🔄'
        }[type] || '🔹';
        
        console.log(`${prefix} ${message}`);
    }

    function getRandomDelay() {
        return CONFIG.betweenItemsDelay + Math.floor(Math.random() * CONFIG.randomDelayMax);
    }

    function updateStatus(text, type = 'normal') {
        if (!DOM.statusDisplay) return;
        
        // Set color based on type
        const colors = {
            'normal': 'lime',
            'error': '#ff5555',
            'warning': '#ffaa00',
            'success': '#55ff55'
        };
        
        DOM.statusDisplay.textContent = text;
        DOM.statusDisplay.style.color = colors[type] || colors.normal;
    }

    function updateStats() {
        if (!DOM.statsDisplay) return;
        
        // Calculate average processing time
        let avgTime = 0;
        if (STATE.processingTime.length > 0) {
            avgTime = STATE.processingTime.reduce((sum, time) => sum + time, 0) / STATE.processingTime.length;
        }
        
        DOM.statsDisplay.innerHTML = `
            <div style="font-weight:bold;margin-bottom:5px;border-bottom:1px solid #444;padding-bottom:3px;">FB CLEANER STATS</div>
            <div>Deleted: <span style="color:#55ff55">${STATE.deletionCount}</span></div>
            <div>Skipped: <span style="color:#ffaa00">${STATE.skipCount}</span></div>
            <div>Skip Ahead: <span style="color:#55aaff">${STATE.currentSkipAhead}</span></div>
            <div>Avg Time: <span style="color:#55aaff">${Math.round(avgTime)}ms</span></div>
        `;
    }

    // ===== UI CREATION =====
    function createUI() {
        const css = `
            .fb-cleaner-ui {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(10, 10, 10, 0.85);
                border: 1px solid #444;
                border-radius: 10px;
                color: white;
                font-family: 'Segoe UI', Tahoma, Geneva, sans-serif;
                z-index: 999999;
                backdrop-filter: blur(5px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                overflow: hidden;
                transition: all 0.3s ease;
                width: 180px;
            }
            
            .fb-cleaner-header {
                background: #222;
                padding: 8px 12px;
                font-weight: bold;
                border-bottom: 1px solid #444;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .fb-cleaner-title {
                font-size: 14px;
                color: #fff;
            }
            
            .fb-cleaner-version {
                font-size: 10px;
                color: #aaa;
                background: #333;
                padding: 2px 6px;
                border-radius: 10px;
            }
            
            .fb-cleaner-body {
                padding: 10px;
            }
            
            .fb-cleaner-status {
                margin-bottom: 10px;
                padding: 5px;
                background: rgba(0,0,0,0.2);
                border-radius: 5px;
                font-size: 13px;
                color: lime;
                min-height: 20px;
            }
            
            .fb-cleaner-stats {
                font-size: 12px;
                margin: 10px 0;
                line-height: 1.5;
            }
            
            .fb-cleaner-button {
                padding: 8px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                font-size: 12px;
                transition: all 0.2s;
                width: 100%;
                margin-bottom: 8px;
            }
            
            .fb-cleaner-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            
            .fb-cleaner-button.start {
                background: #4CAF50;
                color: white;
            }
            
            .fb-cleaner-button.pause {
                background: #FF9800;
                color: black;
            }
            
            .fb-cleaner-button.reset {
                background: #f44336;
                color: white;
            }
            
            .fb-cleaner-speed {
                margin-top: 5px;
                display: flex;
                flex-direction: column;
                font-size: 12px;
            }
            
            .fb-cleaner-speed-label {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
            }
            
            .fb-cleaner-slider {
                width: 100%;
                cursor: pointer;
            }
        `;
        
        // Add CSS
        const styleEl = document.createElement('style');
        styleEl.textContent = css;
        document.head.appendChild(styleEl);
        
        // Create main container
        const container = document.createElement('div');
        container.className = 'fb-cleaner-ui';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'fb-cleaner-header';
        
        const title = document.createElement('div');
        title.className = 'fb-cleaner-title';
        title.textContent = 'FB Cleaner';
        
        const version = document.createElement('div');
        version.className = 'fb-cleaner-version';
        version.textContent = 'v5.03';
        
        header.appendChild(title);
        header.appendChild(version);
        
        // Create body
        const body = document.createElement('div');
        body.className = 'fb-cleaner-body';
        
        // Status display
        const status = document.createElement('div');
        status.className = 'fb-cleaner-status';
        status.textContent = 'Ready to start';
        DOM.statusDisplay = status;
        
        // Stats display
        const stats = document.createElement('div');
        stats.className = 'fb-cleaner-stats';
        DOM.statsDisplay = stats;
        
        // Toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'fb-cleaner-button start';
        toggleBtn.textContent = '▶️ Start Cleaning';
        toggleBtn.addEventListener('click', toggleRunning);
        DOM.toggleButton = toggleBtn;
        
        // Reset button
        const resetBtn = document.createElement('button');
        resetBtn.className = 'fb-cleaner-button reset';
        resetBtn.textContent = '🔄 Reset Skip List';
        resetBtn.addEventListener('click', () => {
            STATE.problemItems.clear();
            STATE.skipCount = 0;
            STATE.currentSkipAhead = 1;
            updateStatus('Skip list cleared', 'success');
            updateStats();
        });
        DOM.resetButton = resetBtn;
        
        // Speed control
        const speedControl = document.createElement('div');
        speedControl.className = 'fb-cleaner-speed';
        
        const speedLabel = document.createElement('div');
        speedLabel.className = 'fb-cleaner-speed-label';
        
        const speedText = document.createElement('span');
        speedText.textContent = 'Speed:';
        
        const speedValue = document.createElement('span');
        speedValue.textContent = 'Normal';
        
        speedLabel.appendChild(speedText);
        speedLabel.appendChild(speedValue);
        
        const speedSlider = document.createElement('input');
        speedSlider.type = 'range';
        speedSlider.min = '1';
        speedSlider.max = '3';
        speedSlider.value = '2';
        speedSlider.className = 'fb-cleaner-slider';
        
        speedSlider.addEventListener('input', () => {
            const value = parseInt(speedSlider.value);
            const labels = ['Careful', 'Normal', 'Speedy'];
            speedValue.textContent = labels[value - 1];
            
            // Adjust delays based on speed setting
            const multiplier = value === 1 ? 1.5 : value === 2 ? 1 : 0.6;
            CONFIG.menuClickDelay = 300 * multiplier;
            CONFIG.deleteClickDelay = 300 * multiplier;
            CONFIG.betweenItemsDelay = 800 * multiplier;
            CONFIG.errorCheckDelay = 600 * multiplier;
        });
        
        DOM.speedSlider = speedSlider;
        
        speedControl.appendChild(speedLabel);
        speedControl.appendChild(speedSlider);
        
        // Assemble UI
        body.appendChild(status);
        body.appendChild(stats);
        body.appendChild(toggleBtn);
        body.appendChild(resetBtn);
        body.appendChild(speedControl);
        
        container.appendChild(header);
        container.appendChild(body);
        document.body.appendChild(container);
        
        // Initialize stats display
        updateStats();
        
        // Make the UI draggable (simple implementation)
        let isDragging = false;
        let offsetX, offsetY;
        
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            container.style.left = (e.clientX - offsetX) + 'px';
            container.style.top = (e.clientY - offsetY) + 'px';
            container.style.right = 'auto';
            container.style.bottom = 'auto';
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // ===== CORE FUNCTIONALITY =====
    function toggleRunning() {
        STATE.isRunning = !STATE.isRunning;
        
        if (STATE.isRunning) {
            DOM.toggleButton.textContent = '⏸️ Pause Cleaning';
            DOM.toggleButton.className = 'fb-cleaner-button pause';
            updateStatus('Running...', 'normal');
            deleteNext();
        } else {
            DOM.toggleButton.textContent = '▶️ Start Cleaning';
            DOM.toggleButton.className = 'fb-cleaner-button start';
            updateStatus('Paused', 'warning');
        }
    }

    // IMPROVED: More reliable item signature generation
    function getItemSignature(element) {
        if (!element) return null;
        
        // Find the containing item - search wider for containers
        let container = element.closest('[data-visualcompletion="ignore-dynamic"]') || 
                       element.closest('div[role="article"]') ||
                       element.closest('div[data-pagelet*="Feed"]') ||
                       element.closest('[data-testid]') ||  // Added support for more Facebook selectors
                       element.parentElement?.parentElement?.parentElement;
        
        if (!container) {
            container = element.parentElement;
            if (!container) return null;
        }
        
        // Get text content - use less text for the signature to reduce false uniqueness
        let textContent = '';
        try {
            // Try to get first 30 chars of cleaned text content (was 50 before)
            textContent = container.innerText.replace(/\s+/g, ' ').trim().substring(0, 30);
        } catch (e) {
            // Fallback if innerText fails
            textContent = (container.textContent || '').replace(/\s+/g, ' ').trim().substring(0, 30);
        }
        
        // Look for timestamps but don't make them a critical part of the signature
        const timestamp = container.querySelector('abbr[data-utime]');
        const timeValue = timestamp ? timestamp.getAttribute('data-utime').slice(-5) : ''; // Only use last 5 digits
        
        // Use rough position info 
        const rect = container.getBoundingClientRect();
        const posInfo = `${Math.round(rect.width/10)*10}`; // Round to nearest 10px for less sensitivity
        
        return `${textContent}:${posInfo}:${timeValue}`;
    }

    // IMPROVED: Better menu button detection
    function findMenuButtons() {
        // Start with standard buttons
        const standardButtons = Array.from(document.querySelectorAll('[role="button"]')).filter(btn => {
            const label = btn.getAttribute('aria-label') || '';
            return (
                btn.offsetParent !== null &&
                (label.toLowerCase().includes("activity options") ||
                 label.toLowerCase().includes("action options") ||
                 label.toLowerCase().includes("more options") ||  // Added more option keywords
                 label.toLowerCase().includes("menu"))
            );
        });
        
        // If we found standard buttons, return them
        if (standardButtons.length > 0) return standardButtons;
        
        // Fallback to visual detection
        return Array.from(document.querySelectorAll('*')).filter(el => {
            if (!el.offsetParent) return false; // Must be visible
            
            // Look for elements that resemble menu buttons
            const rect = el.getBoundingClientRect();
            const isSquarish = Math.abs(rect.width - rect.height) < 5;
            const isReasonableSize = rect.width >= 20 && rect.width <= 40;
            
            // Check if it's in a reasonable place in the document
            const isInViewport = rect.top >= 0 && rect.top <= window.innerHeight;
            
            // Has some content that might indicate a button
            const hasIconContent = el.innerHTML.includes('svg') || 
                                  el.innerHTML.includes('img') || 
                                  el.textContent.includes('...') ||
                                  el.textContent.includes('⋮');
            
            return isSquarish && isReasonableSize && isInViewport && hasIconContent;
        });
    }

    function checkForErrorPopups() {
        // Check for any error popups or notifications
        for (const errorText of CONFIG.errorTexts) {
            const containsError = Array.from(document.querySelectorAll('body *')).some(
                el => el.offsetParent !== null && // is visible
                      el.innerText && 
                      el.innerText.includes(errorText)
            );
            
            if (containsError) return true;
        }
        
        // Additional check for specific Facebook error elements
        const errorElements = document.querySelectorAll('[role="alert"], [role="status"]');
        for (const el of errorElements) {
            if (el.offsetParent !== null && CONFIG.errorTexts.some(txt => el.innerText.includes(txt))) {
                return true;
            }
        }
        
        return false;
    }

    function closeAllErrorPopups() {
        // Find all close buttons in error popups
        const errorPopups = Array.from(document.querySelectorAll('[role="alert"], [role="dialog"], [role="status"]')).filter(
            popup => CONFIG.errorTexts.some(txt => popup.innerText && popup.innerText.includes(txt))
        );
        
        let closed = false;
        
        errorPopups.forEach(popup => {
            // Look for close buttons
            const closeBtn = popup.querySelector('[aria-label="Close"], [aria-label="Dismiss"], [aria-label="OK"]') || 
                           popup.querySelector('div[role="button"]') ||
                           popup.querySelector('button');
            
            if (closeBtn) {
                closeBtn.click();
                closed = true;
                log("Closed error popup", "info");
            }
        });
        
        return closed;
    }

    // IMPROVED: Smarter handling of problem items
    function markCurrentItemAsProblem() {
        if (!STATE.currentItem) return;
        
        const signature = getItemSignature(STATE.currentItem);
        if (!signature) return;
        
        // Get current count or default to 0
        const currentCount = STATE.problemItems.get(signature) || 0;
        STATE.problemItems.set(signature, currentCount + 1);
        
        // If this is a permanent skip, increment skip counter
        if (currentCount + 1 >= CONFIG.maxRetries) {
            STATE.skipCount++;
            log(`Permanently skipping item: "${signature.substring(0, 30)}..."`, "skip");
            
            // Increase the skip ahead count for progressive skipping
            STATE.currentSkipAhead = Math.min(
                STATE.currentSkipAhead + CONFIG.skipIncrement, 
                CONFIG.maxSkipAhead
            );
            
            // Reset consecutive successes
            STATE.consecutiveSuccesses = 0;
        } else {
            log(`Marking item for retry: "${signature.substring(0, 30)}..."`, "warn");
        }
    }

    function shouldSkipItem(btn) {
        const signature = getItemSignature(btn);
        if (!signature) return false;
        
        const failCount = STATE.problemItems.get(signature) || 0;
        return failCount >= CONFIG.maxRetries;
    }

    function autoConfirmPopups() {
        const dialogs = Array.from(document.querySelectorAll('[role="dialog"], [role="alertdialog"]'));
        
        dialogs.forEach(dialog => {
            // Find the delete button
            const deleteBtn = Array.from(dialog.querySelectorAll('div[role="button"], button'))
                .find(btn => 
                    btn.offsetParent !== null && 
                    (btn.innerText.trim().toLowerCase() === "delete" || 
                     btn.innerText.trim().toLowerCase() === "delete post" ||
                     btn.innerText.trim().toLowerCase() === "delete activity" ||  // Added variants
                     btn.innerText.trim().toLowerCase() === "remove" ||
                     btn.innerText.trim().toLowerCase() === "confirm" ||
                     btn.innerText.trim().toLowerCase() === "ok")
                );
            
            if (deleteBtn) {
                deleteBtn.click();
                log("Auto-confirmed deletion dialog", "success");
            }
        });
    }

    function autoScrollAndRetry() {
        log("Scrolling to load more content", "scroll");
        updateStatus("Scrolling to find more items...", "normal");
        
        // Scroll down
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
        
        // Wait and then try again
        setTimeout(deleteNext, CONFIG.scrollDelay);
    }

    function deleteNext() {
        if (!STATE.isRunning) return;
        
        const startTime = performance.now();
        STATE.lastActionTime = startTime;
        
        // Reset current item
        STATE.currentItem = null;
        
        // Clean up any dialogs and popups
        closeAllErrorPopups();
        autoConfirmPopups();
        
        // Find menu buttons
        const buttons = findMenuButtons();
        
        if (buttons.length === 0) {
            updateStatus("No items found, scrolling...", "warning");
            autoScrollAndRetry();
            return;
        }
        
        // Filter out buttons we should skip
        const validButtons = buttons.filter(btn => !shouldSkipItem(btn));
        
        if (validButtons.length === 0) {
            updateStatus("Only skippable items found, scrolling...", "warning");
            autoScrollAndRetry();
            return;
        }
        
        // NEW: Get a button based on the current skip-ahead setting
        let buttonIndex = 0;
        if (STATE.currentSkipAhead > 1 && validButtons.length >= STATE.currentSkipAhead) {
            buttonIndex = STATE.currentSkipAhead - 1; // -1 because array is 0-indexed
            log(`Skipping ahead ${STATE.currentSkipAhead} items due to previous errors`, "skip");
        }
        
        const btn = validButtons[buttonIndex];
        STATE.currentItem = btn;
        
        // Scroll to the button and click it
        btn.scrollIntoView({ block: "center", behavior: "instant" });
        
        setTimeout(() => {
            // Click the menu button
            btn.click();
            log(`Opened menu for item`, "info");
            updateStatus("Opened menu...", "normal");
            
            setTimeout(() => {
                // Find and click the delete option
                const menuItems = Array.from(document.querySelectorAll('[role="menuitem"], [role="button"]'));
                const deleteOption = menuItems.find(el =>
                    el.offsetParent !== null &&  // Must be visible
                    (
                        el.innerText.includes("Move to Recycle bin") ||
                        el.innerText.includes("Delete") ||
                        el.innerText.includes("Remove") ||
                        el.innerText.includes("Unlike") ||
                        el.innerText.includes("Remove reaction") ||
                        el.innerText.includes("Remove tag") ||
                        el.innerText.includes("Hide") ||  // Added more options
                        el.innerText.includes("Remove from profile")
                    )
                );
                
                if (deleteOption) {
                    deleteOption.click();
                    log(`Clicked delete option: "${deleteOption.innerText}"`, "info");
                    updateStatus("Deleting...", "normal");
                    
                    // Check for errors after a short delay
                    setTimeout(() => {
                        if (checkForErrorPopups()) {
                            // Error detected
                            log("Error detected during deletion", "error");
                            updateStatus("Error detected, skipping item", "error");
                            markCurrentItemAsProblem();
                            closeAllErrorPopups();
                            
                            // Record processing time
                            const endTime = performance.now();
                            STATE.processingTime.push(endTime - startTime);
                            
                            // Reset consecutive successes
                            STATE.consecutiveSuccesses = 0;
                            
                            // Move to next item
                            setTimeout(deleteNext, getRandomDelay());
                        } else {
                            // Success!
                            STATE.deletionCount++;
                            STATE.consecutiveSuccesses++;
                            STATE.lastSuccessTimestamp = Date.now();
                            
                            log(`Successfully deleted item #${STATE.deletionCount}`, "success");
                            updateStatus(`Deleted item #${STATE.deletionCount}`, "success");
                            
                            // NEW: Reduce skip-ahead after consecutive successes
                            if (STATE.consecutiveSuccesses >= CONFIG.resetSkipCountAfterSuccess && STATE.currentSkipAhead > 1) {
                                STATE.currentSkipAhead = Math.max(1, STATE.currentSkipAhead - 1);
                                log(`Reduced skip-ahead to ${STATE.currentSkipAhead} after ${STATE.consecutiveSuccesses} successes`, "info");
                                STATE.consecutiveSuccesses = 0; // Reset the counter
                            }
                            
                            // Record processing time
                            const endTime = performance.now();
                            STATE.processingTime.push(endTime - startTime);
                            
                            // Keep only the last 10 times for the average
                            if (STATE.processingTime.length > 10) {
                                STATE.processingTime.shift();
                            }
                            
                            // Move to next item
                            setTimeout(deleteNext, getRandomDelay());
                        }
                    }, CONFIG.errorCheckDelay);
                    
                } else {
                    // No delete option found - click elsewhere to close the menu
                    document.body.click();
                    
                    // Wait a bit and look for confirmation dialogs that might have appeared
                    setTimeout(() => {
                        autoConfirmPopups();
                        
                        // Still no success, mark as problem
                        log("No delete option found", "warn");
                        updateStatus("No delete option found, trying next", "warning");
                        markCurrentItemAsProblem();
                        
                        // Record processing time
                        const endTime = performance.now();
                        STATE.processingTime.push(endTime - startTime);
                        
                        // Move to next item
                        setTimeout(deleteNext, getRandomDelay());
                    }, 300);
                }
            }, CONFIG.menuClickDelay);
        }, 100); // Very short delay after scrolling
    }

    // ===== INITIALIZATION =====
    function initialize() {
        log("Facebook Activity Auto Deleter v5.03 loaded", "info");
        createUI();
        
        // Start periodic update of the UI
        setInterval(updateStats, CONFIG.uiUpdateInterval);
        
        // Set up periodic error popup checker
        setInterval(() => {
            if (STATE.isRunning) {
                closeAllErrorPopups();
                autoConfirmPopups();
            }
        }, 1000);
        
        // NEW: Add occasional complete page refresh to fix stuck states
        setInterval(() => {
            // If running and no successful deletion in 2 minutes, refresh
            if (STATE.isRunning && 
                STATE.lastSuccessTimestamp > 0 && 
                Date.now() - STATE.lastSuccessTimestamp > 120000) {
                
                log("No successful deletions for 2 minutes, refreshing page", "warn");
                updateStatus("Stuck detected, refreshing page...", "warning");
                
                // Save state data to sessionStorage
                sessionStorage.setItem('fbCleanerState', JSON.stringify({
                    deletionCount: STATE.deletionCount,
                    skipCount: STATE.skipCount,
                    problemItems: Array.from(STATE.problemItems.entries())
                }));
                
                // Reload page
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        }, 30000); // Check every 30 seconds
        
        // Try to restore state from previous session
        try {
            const savedState = sessionStorage.getItem('fbCleanerState');
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                STATE.deletionCount = parsedState.deletionCount || 0;
                STATE.skipCount = parsedState.skipCount || 0;
                
                if (parsedState.problemItems && Array.isArray(parsedState.problemItems)) {
                    STATE.problemItems = new Map(parsedState.problemItems);
                }
                
                log(`Restored state: ${STATE.deletionCount} deleted, ${STATE.skipCount} skipped`, "info");
                updateStats();
                
                // Clear the saved state
                sessionStorage.removeItem('fbCleanerState');
            }
        } catch (err) {
            console.error("Error restoring state:", err);
        }
    }
    
    // Start the script
    initialize();
})();