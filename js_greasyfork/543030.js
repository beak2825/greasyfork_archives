// ==UserScript==
// @name         Yuan Currency Converter
// @namespace    https://github.com/enzomtpYT/YuanConv
// @version      1.2
// @description  Convert Chinese Yuan (¥) prices to EUR/USD automatically with real-time rates
// @author       enzomtp
// @match        *://buff.163.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/543030/Yuan%20Currency%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/543030/Yuan%20Currency%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Get saved currency preference or default to EUR
    let SELECTED_CURRENCY = GM_getValue('selectedCurrency', 'eur');
    
    // Conversion rates: will be fetched from API
    let CONVERSION_RATES = {
        eur: 0.119, // Fallback rate for EUR
        usd: 0.139  // Fallback rate for USD
    };
    
    // Get current conversion rate based on selected currency
    function getCurrentRate() {
        return CONVERSION_RATES[SELECTED_CURRENCY];
    }
    
    // Get currency symbol based on selected currency
    function getCurrencySymbol() {
        return SELECTED_CURRENCY === 'eur' ? '€' : '$';
    }
    
    // Function to fetch conversion rate from API
    async function fetchConversionRate() {
        try {
            const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/cny.json');
            const data = await response.json();
            
            if (data && data.cny) {
                if (data.cny.eur) CONVERSION_RATES.eur = data.cny.eur;
                if (data.cny.usd) CONVERSION_RATES.usd = data.cny.usd;
                console.log(`Updated CNY rates - EUR: ${CONVERSION_RATES.eur}, USD: ${CONVERSION_RATES.usd}`);
                
                // Re-convert existing content with new rate
                convertExistingContent();
            }
        } catch (error) {
            console.warn('Failed to fetch conversion rate, using fallback:', error);
        }
    }
    
    // Function to convert yen to selected currency
    function convertYenToCurrency(yenAmount) {
        const convertedAmount = (yenAmount * getCurrentRate()).toFixed(2);
        return convertedAmount;
    }
    
    // Function to process elements that might contain yen prices with HTML structure
    function processElement(element) {
        // Check if this element contains a yen symbol
        if (element.textContent.includes('¥')) {
            // Look for the pattern: ¥ number<small>.decimal</small>
            const yenPattern = /¥\s*(\d+(?:,\d{3})*)(?:<small>\.(\d+)<\/small>)?/;
            const match = element.innerHTML.match(yenPattern);
            
            if (match) {
                const integerPart = match[1].replace(/,/g, ''); // Remove commas
                const decimalPart = match[2] || '0'; // Default to 0 if no decimal
                const fullAmount = parseFloat(`${integerPart}.${decimalPart}`);
                
                if (!isNaN(fullAmount)) {
                    const convertedAmount = convertYenToCurrency(fullAmount);
                    // Replace the entire yen price structure with the converted amount
                    element.innerHTML = element.innerHTML.replace(
                        /¥\s*\d+(?:,\d{3})*(?:<small>\.\d+<\/small>)?/,
                        `${convertedAmount}${getCurrencySymbol()}`
                    );
                }
            }
        }
    }

    // Function to process text nodes (for simple text without HTML)
    function processTextNode(textNode) {
        const originalText = textNode.textContent;
        // Regex to match ¥ followed by optional space and numbers (with possible commas/dots)
        const yenRegex = /¥\s*([0-9,]+(?:\.[0-9]{1,2})?)/g;
        
        const newText = originalText.replace(yenRegex, (match, amount) => {
            // Remove commas and convert to number
            const cleanAmount = parseFloat(amount.replace(/,/g, ''));
            if (!isNaN(cleanAmount)) {
                const convertedAmount = convertYenToCurrency(cleanAmount);
                return `${convertedAmount}${getCurrencySymbol()}`;
            }
            return match; // Return original if parsing fails
        });
        
        if (newText !== originalText) {
            textNode.textContent = newText;
        }
    }
    
    // Function to create settings box
    function createSettingsBox() {
        const settingsBox = document.createElement('div');
        settingsBox.id = 'YuanConv-settings';
        settingsBox.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #fff;
                border: 2px solid #333;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                font-family: Arial, sans-serif;
                font-size: 14px;
                min-width: 200px;
            ">
                <div style="font-weight: bold; margin-bottom: 10px; color: #333;">
                    Yuan Currency Converter
                </div>
                <div style="margin-bottom: 10px; color: #666;">
                    Select target currency:
                </div>
                <label style="display: block; margin-bottom: 8px; cursor: pointer;">
                    <input type="radio" name="currency" value="eur" ${SELECTED_CURRENCY === 'eur' ? 'checked' : ''} style="margin-right: 8px;">
                    Euro (€)
                </label>
                <label style="display: block; margin-bottom: 12px; cursor: pointer;">
                    <input type="radio" name="currency" value="usd" ${SELECTED_CURRENCY === 'usd' ? 'checked' : ''} style="margin-right: 8px;">
                    US Dollar ($)
                </label>
                <div style="border-top: 1px solid #eee; padding-top: 10px; font-size: 12px; color: #999;">
                    Rate: 1 CNY = ${getCurrentRate().toFixed(4)} ${getCurrencySymbol()}
                </div>
                <button id="YuanConv-close" style="
                    position: absolute;
                    top: 5px;
                    right: 8px;
                    background: none;
                    border: none;
                    font-size: 16px;
                    cursor: pointer;
                    color: #999;
                ">×</button>
            </div>
        `;
        
        document.body.appendChild(settingsBox);
        
        // Add event listeners
        const radioButtons = settingsBox.querySelectorAll('input[name="currency"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    SELECTED_CURRENCY = this.value;
                    GM_setValue('selectedCurrency', SELECTED_CURRENCY);
                    console.log(`Currency changed to: ${SELECTED_CURRENCY.toUpperCase()}`);
                    
                    // Reload page to apply changes
                    location.reload();
                }
            });
        });
        
        // Close button functionality
        const closeButton = settingsBox.querySelector('#YuanConv-close');
        closeButton.addEventListener('click', function() {
            settingsBox.style.display = 'none';
        });
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (settingsBox.style.display !== 'none') {
                settingsBox.style.display = 'none';
            }
        }, 10000);
    }
    
    // Function to show settings (can be called from console)
    function showSettings() {
        const existingSettings = document.getElementById('YuanConv-settings');
        if (existingSettings) {
            existingSettings.style.display = 'block';
        } else {
            createSettingsBox();
        }
    }
    
    // Make showSettings available globally for console access
    window.YuanConvShowSettings = showSettings;
    
    // Function to walk through all nodes
    function walkNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if this element contains yen prices with HTML structure
            if (node.textContent.includes('¥') && node.innerHTML.includes('<small>')) {
                processElement(node);
            } else {
                // Continue walking through child nodes
                for (let child of node.childNodes) {
                    walkNodes(child);
                }
            }
        }
    }
    
    // Initial conversion when page loads
    function convertExistingContent() {
        walkNodes(document.body);
    }
    
    // Observer to handle dynamically added content
    function setupObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                        walkNodes(node);
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Add keyboard shortcut to show settings (Ctrl+Shift+Y)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'Y') {
            e.preventDefault();
            showSettings();
        }
    });
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            fetchConversionRate(); // Fetch rate first
            convertExistingContent();
            setupObserver();
            
            // Show settings box briefly on first load
            setTimeout(() => {
                createSettingsBox();
            }, 1000);
        });
    } else {
        fetchConversionRate(); // Fetch rate first
        convertExistingContent();
        setupObserver();
        
        // Show settings box briefly on first load
        setTimeout(() => {
            createSettingsBox();
        }, 1000);
    }
    
})();