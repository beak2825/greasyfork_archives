// ==UserScript==
// @name         Museum Set Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlights items with configurable quantity thresholds
// @author       ingine
// @match        https://www.torn.com/museum.php
// @grant        none
// @run-at       document-idle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/540138/Museum%20Set%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/540138/Museum%20Set%20Highlighter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Default thresholds - will be overridden by user input
    let lowThreshold = 100;
    let mediumThreshold = 200;

    // CSS styles for highlighting
    const highlightStyles = `
        <style id="configurable-quantity-highlighter-styles">
            /* Control Panel */
            #qty-config-panel {
                position: fixed !important;
                bottom: 110px !important;
                right: 10px !important;
                transform: translateY(-50%);
                background: #2c2c2c !important;
                color: white !important;
                padding: 12px !important;
                border-radius: 8px !important;
                z-index: 50000 !important;
                font-family: Arial, sans-serif !important;
                font-size: 12px !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
                border: 1px solid #555 !important;
                min-width: 200px !important;
            }

            #qty-config-panel.collapsed {
                width: 120px !important;
                height: 30px !important;
                overflow: hidden !important;
                cursor: pointer !important;
            }

            #qty-config-panel .panel-header {
                font-weight: bold !important;
                margin-bottom: 8px !important;
                cursor: pointer !important;
                user-select: none !important;
            }

            #qty-config-panel .panel-content {
                display: block !important;
            }

            #qty-config-panel.collapsed .panel-content {
                display: none !important;
            }

            #qty-config-panel input {
                width: 50px !important;
                padding: 2px 4px !important;
                margin: 2px 4px !important;
                border: 1px solid #666 !important;
                border-radius: 3px !important;
                background: #444 !important;
                color: white !important;
                font-size: 11px !important;
            }

            #qty-config-panel label {
                display: inline-block !important;
                margin: 4px 0 !important;
                font-size: 11px !important;
            }

            #qty-config-panel button {
                background: #4CAF50 !important;
                color: white !important;
                border: none !important;
                padding: 4px 8px !important;
                border-radius: 3px !important;
                cursor: pointer !important;
                font-size: 11px !important;
                margin: 4px 2px !important;
            }

            #qty-config-panel button:hover {
                background: #45a049 !important;
            }

            /* Low quantity highlighting */
            .click-area.low-quantity .item-amount {
                color: #cc0000 !important;
                animation: qtyPulse 1.5s infinite !important;
            }

            .click-area.low-quantity .coll-item-header {
                color: #cc0000 !important;
                font-weight: bold !important;
            }

            /* Medium quantity highlighting */
            .click-area.medium-quantity .item-amount {
                color: #ff8c00 !important;
                animation: qtyPulseMedium 2s infinite !important;
            }

            .click-area.medium-quantity .coll-item-header {
                color: #ff8c00 !important;
                font-weight: bold !important;
            }

            /* No quantity available */
            .click-area.no-quantity {
                opacity: 0.6 !important;
            }

            .click-area.no-quantity .coll-item-header {
                color: #cc0000 !important;
                font-weight: bold !important;
            }

            /* Shortage display */
            .shortage-indicator {
                position: absolute !important;
                top: 32px !important;
                right: 0px !important;
                transform: translateX(-50%) translateY(-50%);
                background: #cc0000 !important;
                color: white !important;
                font-size: 10px !important;
                padding: 2px 4px !important;
                border-radius: 3px !important;
                z-index: 10000 !important;
                font-weight: bold !important;
                white-space: nowrap !important;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
                pointer-events: none !important;
            }

            /* Shortage for medium quantity items */
            .click-area.medium-quantity .shortage-indicator {
                background: #ff8c00 !important;
            }
            /* High quantity highlighting */
            .click-area.high-quantity .item-amount {
               color: #4caf50 !important;
               font-weight: bold !important;
           }

           .click-area.high-quantity .coll-item-header {
              color: #4caf50 !important;
      font-weight: bold !important;
      }

            @keyframes qtyPulse {
                0% { opacity: 1; }
                50% { opacity: 0.7; }
                100% { opacity: 1; }
            }

            @keyframes qtyPulseMedium {
                0% { opacity: 1; }
                50% { opacity: 0.8; }
                100% { opacity: 1; }
            }
        </style>
    `;

    // Function to create control panel
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'qty-config-panel';
        panel.innerHTML = `
        <div class="panel-header">⚙️ Quantity Thresholds</div>
        <div class="panel-content">
            <label>Low Threshold: <input type="number" id="low-threshold" value="${lowThreshold}" min="1"></label><br>
            <label>Medium Threshold: <input type="number" id="medium-threshold" value="${mediumThreshold}" min="1"></label><br>
            <button id="qty-update-button">Update</button>
            <button id="qty-reset-button">Reset</button>
        </div>
    `;
        document.body.appendChild(panel);

        // Expand/collapse toggle
        const header = panel.querySelector('.panel-header');
        header.addEventListener('click', () => {
            panel.classList.toggle('collapsed');
        });

        // Update thresholds
        panel.querySelector('#qty-update-button')?.addEventListener('click', () => {
            const lowInput = document.getElementById('low-threshold');
            const mediumInput = document.getElementById('medium-threshold');

            const newLow = parseInt(lowInput.value);
            const newMedium = parseInt(mediumInput.value);

            if (newLow > 0 && newMedium > 0 && newMedium > newLow) {
                lowThreshold = newLow;
                mediumThreshold = newMedium;
                localStorage.setItem('qtyThresholds', JSON.stringify({ low: lowThreshold, medium: mediumThreshold }));
                highlightLowQuantityItems();
                console.log(`Thresholds updated: Low=${lowThreshold}, Medium=${mediumThreshold}`);
            } else {
                alert('Please ensure thresholds are positive numbers and medium > low');
            }
        });

        // Reset thresholds
        panel.querySelector('#qty-reset-button')?.addEventListener('click', () => {
            lowThreshold = 100;
            mediumThreshold = 200;
            document.getElementById('low-threshold').value = lowThreshold;
            document.getElementById('medium-threshold').value = mediumThreshold;
            localStorage.setItem('qtyThresholds', JSON.stringify({ low: lowThreshold, medium: mediumThreshold }));
            highlightLowQuantityItems();
            console.log('Thresholds reset to defaults');
        });

        // Load saved thresholds if available
        const saved = localStorage.getItem('qtyThresholds');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.low && parsed.medium && parsed.medium > parsed.low) {
                    lowThreshold = parsed.low;
                    mediumThreshold = parsed.medium;
                }
            } catch (e) {
                console.warn('Failed to parse saved thresholds:', e);
            }
        }

        document.getElementById('low-threshold').value = lowThreshold;
        document.getElementById('medium-threshold').value = mediumThreshold;

    }


    // Function to highlight low quantity items
    function highlightLowQuantityItems() {
        // Find all item wrappers and then look for click-area within them
        const itemWrappers = document.querySelectorAll('.item-wrapper');

        itemWrappers.forEach(wrapper => {
            // Find the click-area within this wrapper
            const clickArea = wrapper.querySelector('.click-area');
            if (!clickArea) return;

            // Find the quantity element within the click area
            const qtyElement = clickArea.querySelector('.item-amount.qty, .qty');

            // Remove existing classes and indicators first
            clickArea.classList.remove('low-quantity', 'medium-quantity', 'no-quantity', 'high-quantity');
            const existingIndicator = clickArea.querySelector('.shortage-indicator');
            if (existingIndicator) {
                existingIndicator.remove();
            }

            if (qtyElement) {
                const qtyText = qtyElement.textContent.trim();
                const quantity = parseInt(qtyText, 10);

                if (isNaN(quantity) || quantity === 0 || qtyText === '') {
                    // No quantity or zero quantity
                    clickArea.classList.add('no-quantity');
                    addShortageIndicator(clickArea, `Need ${lowThreshold}`);
                } else if (quantity <= lowThreshold) {
                    // Low quantity (less than low threshold)
                    clickArea.classList.add('low-quantity');
                    const shortage = lowThreshold - quantity;
                    addShortageIndicator(clickArea, `Need ${shortage}`);
                } else if (quantity >= lowThreshold && quantity <= mediumThreshold) {
                    // Medium quantity (between thresholds)
                    clickArea.classList.add('medium-quantity');
                    const shortage = mediumThreshold - quantity;
                    addShortageIndicator(clickArea, `+${shortage} for ${mediumThreshold}`);
                } else {
                    clickArea.classList.add('high-quantity');
                }
            } else {
                // No quantity element found - might be out of stock
                const isBlank = clickArea.querySelector('.torn-item.blank');
                if (isBlank || clickArea.textContent.includes('Not available')) {
                    clickArea.classList.remove('low-quantity', 'medium-quantity');
                    clickArea.classList.add('no-quantity');
                    addShortageIndicator(clickArea, `Need ${lowThreshold}`);
                }
            }
        });
    }

    // Function to add shortage indicator
    function addShortageIndicator(clickArea, text) {
        const indicator = document.createElement('div');
        indicator.className = 'shortage-indicator';
        indicator.textContent = text;

        // Ensure the click-area has relative positioning
        const computedStyle = window.getComputedStyle(clickArea);
        if (computedStyle.position === 'static') {
            clickArea.style.position = 'relative';
        }

        clickArea.appendChild(indicator);
    }

    // Function to initialize the script
    function init() {
        // Add CSS styles to the page
        if (!document.getElementById('configurable-quantity-highlighter-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'configurable-quantity-highlighter-styles';
            styleElement.textContent = highlightStyles.replace(/<style[^>]*>|<\/style>/g, '');
            document.head.appendChild(styleElement);
        }

        // Create control panel
        if (!document.getElementById('qty-config-panel')) {
            createControlPanel();
        }

        // Initial highlighting
        highlightLowQuantityItems();

        // Set up a mutation observer to watch for dynamically loaded content
        const observer = new MutationObserver(function (mutations) {
            let shouldUpdate = false;

            mutations.forEach(function (mutation) {
                // Check if new item wrappers or click areas were added
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === 1) { // Element node
                            if (node.classList && (node.classList.contains('item-wrapper') || node.classList.contains('click-area'))) {
                                shouldUpdate = true;
                            } else if (node.querySelector && (node.querySelector('.item-wrapper') || node.querySelector('.click-area'))) {
                                shouldUpdate = true;
                            }
                        }
                    });
                }

                // Check if quantity text was modified
                if (mutation.type === 'characterData' || mutation.type === 'childList') {
                    const target = mutation.target;
                    if (target.classList && target.classList.contains('qty')) {
                        shouldUpdate = true;
                    } else if (target.parentElement && target.parentElement.classList && target.parentElement.classList.contains('qty')) {
                        shouldUpdate = true;
                    }
                }
            });

            if (shouldUpdate) {
                // Debounce the update to avoid excessive calls
                clearTimeout(window.qtyUpdateTimeout);
                window.qtyUpdateTimeout = setTimeout(highlightLowQuantityItems, 100);
            }
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // Also re-check periodically in case of AJAX updates
        setInterval(highlightLowQuantityItems, 5000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also initialize after a short delay to catch late-loading content
    setTimeout(init, 1000);

    // Console log for debugging
    console.log('Configurable Quantity Item Highlighter userscript loaded');
})();