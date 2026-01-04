// ==UserScript==
// @name         Google Finance Statistics
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Display comprehensive portfolio statistics on Google Finance
// @author       MakMak
// @match        https://www.google.com/finance/*
// @icon         https://www.gstatic.com/finance/favicon/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541810/Google%20Finance%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/541810/Google%20Finance%20Statistics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const realizedGainSelector = "div.H1MkHc > span.P2Luy.Ez2Ioe";
    const unrealizedGainSelector = "div.hrdhqb";
    const portfolioValueSelector = "div.YMlKec.fxKbKc";
    const activityTabSelector = "div[data-tab-id='activity']";
    const notificationId = 'gain-calculator-userscript-result';

    let currentUrl = window.location.href;
    let calculationTimeout;
    let isActivityTabSelected = false;

    // Drag & Drop state
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let currentNotification = null;

    // --- Helper Functions ---
    function isPortfolioPage() {
        const url = window.location.href;
        return url.includes('/finance/portfolio/');
    }

    function parseCurrency(text) {
        if (typeof text !== 'string' || !text) return NaN;
        // Remove currency symbols, thousand separators, and whitespace, then parse
        const cleanText = text.trim().replace(/[€$,]/g, '');
        return parseFloat(cleanText);
    }

    function getLastElement(selector) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return null;

        // Filter out grayed/disabled elements by checking opacity or visibility
        const activeElements = Array.from(elements).filter(el => {
            const style = window.getComputedStyle(el);
            return style.opacity !== '0' &&
                   style.visibility !== 'hidden' &&
                   style.display !== 'none' &&
                   !el.closest('[style*="opacity: 0"]') &&
                   !el.closest('[style*="visibility: hidden"]');
        });

        return activeElements.length > 0 ? activeElements[activeElements.length - 1] : null;
    }

    function checkActivityTab() {
        const activityTabs = document.querySelectorAll(activityTabSelector);
        if (activityTabs.length === 0) return false;

        const lastActivityTab = activityTabs[activityTabs.length - 1];
        return lastActivityTab.getAttribute('aria-selected') === 'true';
    }

    function handleActivityTabChange() {
        // Skip if not on portfolio page
        if (!isPortfolioPage()) return;

        const currentActivityTabState = checkActivityTab();

        if (currentActivityTabState !== isActivityTabSelected) {
            isActivityTabSelected = currentActivityTabState;

            if (isActivityTabSelected) {
                console.log('Activity tab selected, refreshing Realized Gain statistics...');
                // Wait a bit for the activity data to load, then recalculate
                setTimeout(() => {
                    calculateStatistics();
                }, 800);
            }
        }
    }

    function waitForElements(selectors, maxWait = 5000) {
        return new Promise((resolve) => {
            const startTime = Date.now();

            function check() {
                const found = selectors.every(selector => getLastElement(selector) !== null);

                if (found || Date.now() - startTime > maxWait) {
                    resolve(found);
                } else {
                    setTimeout(check, 100);
                }
            }

            check();
        });
    }

    // --- Drag & Drop Functions ---
    function getEventCoords(e) {
        // Handle both mouse and touch events
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.changedTouches && e.changedTouches.length > 0) {
            return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        } else {
            return { x: e.clientX, y: e.clientY };
        }
    }

    function startDrag(e) {
        if (!currentNotification) return;

        isDragging = true;
        const coords = getEventCoords(e);
        const rect = currentNotification.getBoundingClientRect();

        dragOffset.x = coords.x - rect.left;
        dragOffset.y = coords.y - rect.top;

        // Add dragging class for visual feedback
        currentNotification.classList.add('dragging');

        // Prevent default to avoid text selection on desktop
        e.preventDefault();
    }

    function drag(e) {
        if (!isDragging || !currentNotification) return;

        e.preventDefault();
        const coords = getEventCoords(e);

        let newX = coords.x - dragOffset.x;
        let newY = coords.y - dragOffset.y;

        // Keep within viewport bounds
        const rect = currentNotification.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        currentNotification.style.left = newX + 'px';
        currentNotification.style.top = newY + 'px';
        currentNotification.style.right = 'auto'; // Override right positioning
    }

    function stopDrag() {
        if (!isDragging || !currentNotification) return;

        isDragging = false;
        currentNotification.classList.remove('dragging');
    }

    function setupDragAndDrop(element, handleContainer) {
        // Create a drag handle
        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        dragHandle.innerHTML = '⋮⋮';
        dragHandle.title = 'Drag to move';

        // Style the drag handle
        Object.assign(dragHandle.style, {
            // No position: absolute. It will be positioned by its flex container.
            width: '24px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'move',
            color: '#666',
            fontSize: '16px',
            fontWeight: 'bold',
            userSelect: 'none',
            touchAction: 'none',
            borderRadius: '4px' // Add rounding for a better look
        });

        // Mouse events
        dragHandle.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);

        // Touch events for mobile
        dragHandle.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', stopDrag);

        // Add the drag handle to the provided container, *above* other items
        handleContainer.prepend(dragHandle);

        // No longer need to adjust content padding
    }

    // --- Main Calculation Logic ---
    async function calculateStatistics() {
        // Only calculate if we're on a portfolio page
        if (!isPortfolioPage()) {
            console.log('Skipping calculation - not on portfolio page');
            // Remove any existing notification
            const oldNotification = document.getElementById(notificationId);
            if (oldNotification) oldNotification.remove();
            return;
        }

        try {
            // Wait for essential elements to be available
            const elementsReady = await waitForElements([portfolioValueSelector, unrealizedGainSelector]);

            if (!elementsReady) {
                throw new Error('Required elements not found after waiting');
            }

            // 1. Extract Current Portfolio Value (get last active element)
            const portfolioValueElement = getLastElement(portfolioValueSelector);
            if (!portfolioValueElement) throw new Error(`Portfolio Value element not found with selector "${portfolioValueSelector}".`);
            const portfolioValue = parseCurrency(portfolioValueElement.innerText);
            if (isNaN(portfolioValue)) throw new Error(`Could not parse Portfolio Value from "${portfolioValueElement.innerText}".`);

            // 2. Extract Unrealized Gain (get last active element)
            const unrealizedGainElements = document.querySelectorAll(unrealizedGainSelector);
            const activeUnrealizedElements = Array.from(unrealizedGainElements).filter(el => {
                const style = window.getComputedStyle(el);
                return style.opacity !== '0' &&
                       style.visibility !== 'hidden' &&
                       style.display !== 'none' &&
                       !el.closest('[style*="opacity: 0"]') &&
                       !el.closest('[style*="visibility: hidden"]');
            });

            if (activeUnrealizedElements.length < 2) throw new Error(`Unrealized Gain element not found with selector "${unrealizedGainSelector}" at index 1.`);
            const unrealizedGainElement = activeUnrealizedElements[1];
            const unrealizedGainText = unrealizedGainElement.innerText.split('\n')[0];
            const unrealizedGain = parseCurrency(unrealizedGainText);
            if (isNaN(unrealizedGain)) throw new Error(`Could not parse Unrealized Gain value from "${unrealizedGainText}".`);

            // 3. Calculate Realized Gain (handles cases where it's not found)
            let realizedGain = 0;
            const realizedGainElements = document.querySelectorAll(realizedGainSelector);
            const activeRealizedElements = Array.from(realizedGainElements).filter(el => {
                const style = window.getComputedStyle(el);
                return style.opacity !== '0' &&
                       style.visibility !== 'hidden' &&
                       style.display !== 'none' &&
                       !el.closest('[style*="opacity: 0"]') &&
                       !el.closest('[style*="visibility: hidden"]');
            });

            if (activeRealizedElements.length > 0) {
                activeRealizedElements.forEach(el => {
                    const text = el.innerText.trim();
                    if (text.startsWith('+') || text.startsWith('-')) {
                        const value = parseFloat(text.replace(',', '.'));
                        if (!isNaN(value)) {
                            realizedGain += value;
                        }
                    }
                });
            }

            // 4. Calculate All Statistics
            const totalInvested = portfolioValue - unrealizedGain - realizedGain;
            const totalGain = realizedGain + unrealizedGain;

            const pctRealized = totalInvested === 0 ? 0 : (realizedGain / totalInvested) * 100;
            const pctUnrealized = totalInvested === 0 ? 0 : (unrealizedGain / totalInvested) * 100;
            const pctTotalGain = totalInvested === 0 ? 0 : (totalGain / totalInvested) * 100;

            // 5. Prepare and Display the Results
            const results = {
                portfolioValue: portfolioValue.toFixed(2),
                totalInvested: totalInvested.toFixed(2),
                realizedGain: realizedGain.toFixed(2),
                pctRealized: pctRealized.toFixed(2) + '%',
                unrealizedGain: unrealizedGain.toFixed(2),
                pctUnrealized: pctUnrealized.toFixed(2) + '%',
                totalGain: totalGain.toFixed(2),
                pctTotalGain: pctTotalGain.toFixed(2) + '%',
                // Show hint icon if realized gain is 0 and the activity tab isn't selected
                showActivityHint: realizedGain === 0 && !isActivityTabSelected
            };
            displayNotification(results, 'success');

        } catch (error) {
            console.error("Userscript Error:", error);
            displayNotification({ error: error.message }, "error");
        }
    }

    // --- UI Function ---
    function displayNotification(data, type = "success") {
        const oldNotification = document.getElementById(notificationId);
        if (oldNotification) oldNotification.remove();

        const notification = document.createElement('div');
        notification.id = notificationId;
        currentNotification = notification;

        const content = document.createElement('div');
        if (type === 'error') {
            content.innerHTML = `<strong>Error:</strong><br><small>${data.error}</small>`;
        } else {
            let realizedGainHtml;
            if (data.showActivityHint) {
                realizedGainHtml = `
                    <div class="value-with-icon">
                        <span>📈 Realized Gain:
                        <div class="info-icon" tabindex="0">
                            i
                            <div class="info-tooltip">Select the 'Activity' tab to include any realized P/L in the calculation.</div>
                        </div>
                        </span>
                    </div>
                `;
            } else {
                realizedGainHtml = `<span>📈 Realized Gain:</span>`;
            }

            content.innerHTML = `
                <div class="stat-line"><span>🏦 Portfolio Value:</span> <strong>${data.portfolioValue}</strong></div>
                <div class="stat-line"><span>💵 Total Invested:</span> <strong>${data.totalInvested}</strong></div>
                <hr>
                <div class="stat-line"><span>🌱 Unrealized Gain:</span> <strong>${data.unrealizedGain}</strong></div>
                <div class="stat-line"><span>📊 Pct Unrealized:</span> <strong>${data.pctUnrealized}</strong></div>
                <hr>
                <div class="stat-line">${realizedGainHtml} <strong>${data.realizedGain}</strong></div>
                <div class="stat-line"><span>📊 Pct Realized:</span> <strong>${data.pctRealized}</strong></div>
                <hr>
                <div class="stat-line"><span>💰 Total Gain:</span> <strong>${data.totalGain}</strong></div>
                <div class="stat-line"><span>🚀 Pct Total Gain:</span> <strong>${data.pctTotalGain}</strong></div>
            `;
        }

        const controlsWrapper = document.createElement('div');
        controlsWrapper.className = 'controls-wrapper';

        const closeButton = document.createElement('span');
        closeButton.textContent = '×';
        closeButton.onclick = () => {
            notification.remove();
            currentNotification = null;
        };
        controlsWrapper.appendChild(closeButton);

        notification.appendChild(content);
        notification.appendChild(controlsWrapper);
        document.body.appendChild(notification);

        // Setup drag and drop, placing the handle in the controls wrapper
        setupDragAndDrop(notification, controlsWrapper);

        const style = document.createElement('style');
        style.innerHTML = `
          #${notificationId} {
            position: fixed !important;
            top: 68px;
            right: 20px;
            padding: 16px;
            background-color: ${type === 'error' ? '#c82333' : '#f8f9fa'};
            color: black;
            border-radius: 8px;
            z-index: 99999;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 16px;
            line-height: 1.7;
            box-shadow: 0 6px 12px rgba(0,0,0,0.25);
            display: flex;
            align-items: flex-start;
            gap: 8px; /* Gap between content and controls */
            user-select: none;
            touch-action: none;
            min-width: 280px;
            max-width: 350px;
          }

          #${notificationId}.dragging {
            box-shadow: 0 12px 24px rgba(0,0,0,0.4);
            transform: scale(1.02);
            transition: transform 0.1s ease;
          }

          #${notificationId} .controls-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px; /* Space between drag handle and close button */
          }

          #${notificationId} .stat-line {
            display: flex;
            justify-content: space-between;
            align-items: center; /* Align items vertically */
            gap: 20px;
          }

          #${notificationId} hr {
            border: none;
            border-top: 1px solid #444;
            margin: 8px 0;
          }

          /* --- Styles for the info icon and tooltip --- */
          #${notificationId} .value-with-icon {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          #${notificationId} .info-icon {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: #e0e0e0;
            color: #616161;
            font-size: 11px;
            font-weight: bold;
            font-style: italic;
            cursor: pointer;
            user-select: none;
            outline: none;
          }

          #${notificationId} .info-icon:hover,
          #${notificationId} .info-icon:focus {
            background-color: #c0c0c0;
          }

          #${notificationId} .info-tooltip {
            visibility: hidden;
            opacity: 0;
            width: 220px;
            background-color: #333;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 10px;
            position: absolute;
            z-index: 10;
            bottom: 150%;
            left: 50%;
            transform: translateX(-50%);
            transition: opacity 0.3s, visibility 0.3s;
            font-size: 13px;
            line-height: 1.4;
            font-weight: normal;
            font-style: normal;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            pointer-events: none;
          }

          #${notificationId} .info-tooltip::after { /* Tooltip arrow */
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #333 transparent transparent transparent;
          }

          #${notificationId} .info-icon:hover .info-tooltip,
          #${notificationId} .info-icon:focus .info-tooltip {
            visibility: visible;
            opacity: 1;
          }
          /* --- End of info styles --- */

          #${notificationId} .drag-handle:hover {
            color: #333;
            background-color: rgba(0,0,0,0.1);
          }

          #${notificationId} .drag-handle:active {
            color: #000;
            background-color: rgba(0,0,0,0.2);
          }

          /* Mobile-specific styles */
          @media (max-width: 768px) {
            #${notificationId} {
              font-size: 14px;
              min-width: 260px;
              max-width: calc(100vw - 40px);
            }

            #${notificationId} .drag-handle {
              width: 24px !important;
              height: 24px !important;
              font-size: 16px !important;
            }
          }
        `;
        document.head.appendChild(style);

        Object.assign(content.style, {
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            flex: '1'
        });

        Object.assign(closeButton.style, {
            fontSize: '24px',
            fontWeight: 'bold',
            cursor: 'pointer',
            opacity: '0.8',
            lineHeight: '0.8',
            minWidth: '24px',
            textAlign: 'center',
            userSelect: 'none'
        });
    }

    // --- URL Change Detection ---
    function handleUrlChange() {
        const newUrl = window.location.href;
        if (newUrl !== currentUrl) {
            currentUrl = newUrl;
            console.log('URL changed to:', currentUrl);

            // Remove existing notification when URL changes
            const oldNotification = document.getElementById(notificationId);
            if (oldNotification) {
                oldNotification.remove();
                currentNotification = null;
            }

            // Clear any pending calculations
            if (calculationTimeout) {
                clearTimeout(calculationTimeout);
            }

            // Reset activity tab state
            isActivityTabSelected = false;

            // Only calculate if we're on a portfolio page
            if (!isPortfolioPage()) {
                console.log('Navigated away from portfolio page - skipping calculation');
                return;
            }

            // Wait a bit for the new portfolio to load, then calculate
            calculationTimeout = setTimeout(() => {
                calculateStatistics();
            }, 1500);
        }
    }

    // --- Initialize ---
    function init() {
        // Initial calculation when script loads (only on portfolio pages)
        setTimeout(() => {
            if (isPortfolioPage()) {
                calculateStatistics();
                // Check initial activity tab state
                isActivityTabSelected = checkActivityTab();
            } else {
                console.log('Started on non-portfolio page - skipping initial calculation');
            }
        }, 1000);

        // Monitor for URL changes and DOM changes (for SPA navigation and activity tab changes)
        const observer = new MutationObserver((mutations) => {
            // Check for URL changes
            handleUrlChange();

            // Check for activity tab changes
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'aria-selected' &&
                    mutation.target.matches(activityTabSelector)) {
                    handleActivityTabChange();
                } else if (mutation.type === 'childList') {
                    // Also check when new elements are added (in case tabs are dynamically created)
                    setTimeout(handleActivityTabChange, 100);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['aria-selected']
        });

        // Also listen for popstate events
        window.addEventListener('popstate', handleUrlChange);

        // Override pushState and replaceState to catch programmatic navigation
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(history, args);
            setTimeout(handleUrlChange, 100);
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(history, args);
            setTimeout(handleUrlChange, 100);
        };
    }

    // Start the script when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();