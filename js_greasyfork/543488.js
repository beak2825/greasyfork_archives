// ==UserScript==
// @name         Scrap2Mark
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Comprehensive inventory management and market posting tool for Torn.com
// @author       vALT0r [767373]
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543488/Scrap2Mark.user.js
// @updateURL https://update.greasyfork.org/scripts/543488/Scrap2Mark.meta.js
// ==/UserScript==

/*
 * CHANGELOG:
 * 
 * Version 1.3 (Latest):
 * ----------------------
 * NEW FEATURES:
 * • Added Full Reset button with confirmation to clear all stored data and settings
 * • Enhanced auto-fetch functionality - now runs when API key is saved and checks for missing data
 * • Improved user guidance with detailed error messages pointing to specific solutions
 * • Better API status display with item counts and helpful messaging
 * 
 * BUG FIXES:
 * • Fixed "No tradeable items found" issue when users don't have API data loaded
 * • Enhanced auto-fetch logic to run when data is missing (not just when timestamp is old)
 * • Added comprehensive debugging and logging for troubleshooting tradeable status issues
 * • Improved error handling for auto-fetch scenarios
 * 
 * IMPROVEMENTS:
 * • Added warning during scanning when no API key is present
 * • Enhanced console logging for better debugging of API data loading
 * • Better status messages that guide users to specific solutions
 * • More robust auto-fetch with multiple trigger conditions
 * 
 * Version 1.2:
 * ------------
 * • Smart "Hide below" filtering (only hides items with actual values)
 * • Hidden Fetch API button with auto-fetch implementation
 * • Enhanced button styling with gradients, shadows, and hover effects
 * • Consolidated popup windows for mobile-friendly design
 * • Button text improvements and better grouping
 * 
 * Version 1.1:
 * ------------
 * • Fixed debugMode errors and interface freezing issues
 * • Removed debug features and cleaned up codebase
 * • Added UI yielding to prevent interface freezing during bulk operations
 * • Enhanced ignore button styling and functionality
 */

(function() {
    'use strict';

    // ============================================================================
    // CONFIGURATION CONSTANTS
    // ============================================================================
    
    const SCRIPT_NAME = 'Scrap2Mark';
    
    // Storage keys
    const STORAGE_KEY = 'torn_inventory_data';
    const API_KEY_STORAGE_KEY = 'torn_api_key';
    const API_DATA_STORAGE_KEY = 'torn_api_items_data';
    const API_EXPIRY_STORAGE_KEY = 'torn_api_items_expiry';
    const API_KEY_EXPIRY_STORAGE_KEY = 'torn_api_key_expiry';
    const WINDOW_STATE_STORAGE_KEY = 'torn_scanner_window_state';
    const MARKET_DATA_STORAGE_KEY = 'torn_market_data';
    const MARKET_EXPIRY_STORAGE_KEY = 'torn_market_expiry';
    const IGNORED_ITEMS_STORAGE_KEY = 'scrap2mark_ignored_items';
    const FILTER_STATE_STORAGE_KEY = 'scrap2mark_filter_state';
    
    // Cache durations
    const API_CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
    const API_KEY_EXPIRY_DURATION = 90 * 24 * 60 * 60 * 1000; // 90 days
    const MARKET_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    
    // Analysis settings
    const OUTLIER_THRESHOLD = 3.0; // Standard deviations for outlier detection
    
    // Window size configuration
    const WINDOW_MIN_WIDTH = '410px';
    const WINDOW_MIN_HEIGHT = '600px';
    const WINDOW_DEFAULT_WIDTH = '510px';
    const WINDOW_DEFAULT_HEIGHT = '600px';
    const WINDOW_MINIMIZED_WIDTH = '180px';
    const WINDOW_MINIMIZED_HEIGHT = '50px';
    
    // ============================================================================
    // GLOBAL STATE VARIABLES
    // ============================================================================
    
    // Core application state
    let isScanning = false;
    let scannedItems = new Map();
    let ignoredItems = new Set();
    let floatingTable = null;
    
    // API and data management
    let apiItemsData = null;
    let apiKey = null;
    let marketData = new Map();
    
    // API request management
    let apiRequestQueue = [];
    let isProcessingQueue = false;
    let lastApiRequest = 0;
    let apiRequestCount = 0;
    let apiRequestResetTime = 0;
    
    // ============================================================================
    // XHR/FETCH MONITORING FOR ITEM LOADING DETECTION
    // ============================================================================
    
    let itemLoadingState = {
        isLoading: false,
        lastLoadTime: 0,
        loadingRequests: new Set(),
        totalRequests: 0,
        completedRequests: 0
    };
    
    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================
    
    function log(message) {
        console.log(`[${SCRIPT_NAME}] ${message}`);
    }

    // ============================================================================
    // IGNORED ITEMS MANAGEMENT
    // ============================================================================

    // Load ignored items from localStorage
    function loadIgnoredItems() {
        try {
            const stored = localStorage.getItem(IGNORED_ITEMS_STORAGE_KEY);
            if (stored) {
                const ignoredArray = JSON.parse(stored);
                ignoredItems = new Set(ignoredArray);
            } else {
                ignoredItems = new Set();
            }
        } catch (e) {
            log('Error loading ignored items: ' + e.message);
            ignoredItems = new Set();
        }
    }

    // Save ignored items to localStorage
    function saveIgnoredItems() {
        try {
            const ignoredArray = Array.from(ignoredItems);
            localStorage.setItem(IGNORED_ITEMS_STORAGE_KEY, JSON.stringify(ignoredArray));
        } catch (e) {
            log('Error saving ignored items: ' + e.message);
        }
    }

    // Toggle ignore status for an item
    function toggleIgnoreItem(itemId) {
        // Convert to string to ensure consistency
        const itemIdStr = itemId.toString();
        
        if (ignoredItems.has(itemIdStr)) {
            ignoredItems.delete(itemIdStr);
            log(`Removed item ${itemIdStr} from ignored list`);
        } else {
            ignoredItems.add(itemIdStr);
            log(`Added item ${itemIdStr} to ignored list`);
        }
        saveIgnoredItems();
        updateTableDisplay();
        
        // Show visual feedback with toast notification
        const statusDiv = document.getElementById('scan-status');
        const isIgnored = ignoredItems.has(itemIdStr);
        const itemName = Array.from(scannedItems.values()).find(item => item.id.toString() === itemIdStr)?.name || 'Unknown';
        const message = isIgnored ? `"${itemName}" ignored` : `"${itemName}" un-ignored`;
        
        // Create a temporary toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${isIgnored ? '#dc3545' : '#28a745'};
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 100002;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        toast.textContent = message;
        
        // Add animation keyframes if not already added
        if (!document.querySelector('#toast-animations')) {
            const animationStyle = document.createElement('style');
            animationStyle.id = 'toast-animations';
            animationStyle.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(animationStyle);
        }
        
        document.body.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
        
        // Also update status briefly if available
        if (statusDiv) {
            const originalContent = statusDiv.innerHTML;
            statusDiv.innerHTML = `<span style="color: ${isIgnored ? '#dc3545' : '#28a745'};">${message}</span>`;
            setTimeout(() => {
                statusDiv.innerHTML = originalContent;
            }, 2000);
        }
    }

    // Check if an item is ignored
    function isItemIgnored(itemId) {
        return ignoredItems.has(itemId.toString());
    }

    // ============================================================================
    // FILTER STATE MANAGEMENT
    // ============================================================================
    
    /**
     * Load filter state from localStorage with fallback to default values
     * @returns {Object} Filter state object with showNonTradeable, showIgnored, hideLowValue, minValue
     */
    function loadFilterState() {
        try {
            const saved = localStorage.getItem(FILTER_STATE_STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            log('Error loading filter state: ' + e.message);
        }
        
        // Default state - only hideLowValue is true
        return {
            showNonTradeable: false,
            showIgnored: false,
            hideLowValue: true,
            minValue: 5000000
        };
    }

    function saveFilterState(state) {
        try {
            localStorage.setItem(FILTER_STATE_STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            log('Error saving filter state: ' + e.message);
        }
    }

    function getCurrentFilterState() {
        const showNonTradeableCheckbox = document.getElementById('show-non-tradeable');
        const showIgnoredCheckbox = document.getElementById('show-ignored');
        const hideLowValueCheckbox = document.getElementById('hide-low-value');
        const minValueInput = document.getElementById('min-value-input');
        
        return {
            showNonTradeable: showNonTradeableCheckbox ? showNonTradeableCheckbox.checked : false,
            showIgnored: showIgnoredCheckbox ? showIgnoredCheckbox.checked : false,
            hideLowValue: hideLowValueCheckbox ? hideLowValueCheckbox.checked : true,
            minValue: minValueInput ? parseFloat(minValueInput.value.replace(/[,$]/g, '')) || 5000000 : 5000000
        };
    }

    function applyFilterState(state) {
        const showNonTradeableCheckbox = document.getElementById('show-non-tradeable');
        const showIgnoredCheckbox = document.getElementById('show-ignored');
        const hideLowValueCheckbox = document.getElementById('hide-low-value');
        const minValueInput = document.getElementById('min-value-input');
        
        if (showNonTradeableCheckbox) showNonTradeableCheckbox.checked = state.showNonTradeable;
        if (showIgnoredCheckbox) showIgnoredCheckbox.checked = state.showIgnored;
        if (hideLowValueCheckbox) hideLowValueCheckbox.checked = state.hideLowValue;
        if (minValueInput) minValueInput.value = state.minValue.toLocaleString();
    }
    
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }
    
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Window state management
    function loadWindowState() {
        try {
            const stateData = localStorage.getItem(WINDOW_STATE_STORAGE_KEY);
            if (stateData) {
                return JSON.parse(stateData);
            }
        } catch (error) {
            log(`Failed to load window state: ${error.message}`);
        }
        return {
            x: 20,
            y: 20,
            width: WINDOW_DEFAULT_WIDTH,
            height: WINDOW_DEFAULT_HEIGHT,
            minimized: false
        };
    }
    
    function saveWindowState(x, y, width, height, minimized) {
        try {
            const state = { x, y, width, height, minimized };
            localStorage.setItem(WINDOW_STATE_STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            log(`Failed to save window state: ${error.message}`);
        }
    }
    
    // API Key management
    function loadApiKey() {
        try {
            const keyData = localStorage.getItem(API_KEY_STORAGE_KEY);
            const keyExpiry = localStorage.getItem(API_KEY_EXPIRY_STORAGE_KEY);
            
            if (keyData && keyExpiry) {
                const expiryDate = new Date(parseInt(keyExpiry));
                if (new Date() < expiryDate) {
                    apiKey = keyData;
                    log('API key loaded from storage');
                    return true;
                }
            }
        } catch (error) {
            log(`Failed to load API key: ${error.message}`);
        }
        return false;
    }
    
    function saveApiKey(key) {
        try {
            const expiryDate = new Date(Date.now() + API_KEY_EXPIRY_DURATION);
            localStorage.setItem(API_KEY_STORAGE_KEY, key);
            localStorage.setItem(API_KEY_EXPIRY_STORAGE_KEY, expiryDate.getTime().toString());
            apiKey = key;
            log('API key saved to storage');
        } catch (error) {
            log(`Failed to save API key: ${error.message}`);
        }
    }
    
    // API Items data management
    function loadApiItemsData() {
        try {
            const itemsData = localStorage.getItem(API_DATA_STORAGE_KEY);
            const itemsExpiry = localStorage.getItem(API_EXPIRY_STORAGE_KEY);
            
            if (itemsData && itemsExpiry) {
                const expiryDate = new Date(parseInt(itemsExpiry));
                if (new Date() < expiryDate) {
                    apiItemsData = JSON.parse(itemsData);
                    log(`Loaded ${Object.keys(apiItemsData).length} items from API cache`);
                    return true;
                }
            }
        } catch (error) {
            log(`Failed to load API items data: ${error.message}`);
        }
        return false;
    }
    
    function saveApiItemsData(data) {
        try {
            const expiryDate = new Date(Date.now() + API_CACHE_DURATION);
            localStorage.setItem(API_DATA_STORAGE_KEY, JSON.stringify(data));
            localStorage.setItem(API_EXPIRY_STORAGE_KEY, expiryDate.getTime().toString());
            apiItemsData = data;
            log(`Saved ${Object.keys(data).length} items to API cache`);
        } catch (error) {
            log(`Failed to save API items data: ${error.message}`);
        }
    }
    
    // Fetch items from API
    async function fetchItemsFromAPI(key) {
        try {
            const response = await fetch(`https://api.torn.com/v2/torn/items?cat=All&sort=ASC&key=${key}`);
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            if (data.error) {
                throw new Error(`API error: ${data.error.error}`);
            }
            
            // Convert array to object with ID as key for easier lookup
            const itemsObject = {};
            if (data.items && Array.isArray(data.items)) {
                data.items.forEach(item => {
                    itemsObject[item.id] = item;
                });
            }
            
            saveApiItemsData(itemsObject);
            return itemsObject;
        } catch (error) {
            throw new Error(`Failed to fetch items from API: ${error.message}`);
        }
    }
    
    // Check if item is tradeable
    function isItemTradeable(itemId) {
        if (!apiItemsData || !itemId) return null; // null means unknown
        
        const item = apiItemsData[itemId];
        if (!item) return null;
        
        return item.is_tradable === true;
    }
    
    // Market data management
    function loadMarketData() {
        try {
            const marketDataStr = localStorage.getItem(MARKET_DATA_STORAGE_KEY);
            const marketExpiry = localStorage.getItem(MARKET_EXPIRY_STORAGE_KEY);
            
            if (marketDataStr && marketExpiry) {
                const expiryDate = new Date(parseInt(marketExpiry));
                if (new Date() < expiryDate) {
                    const savedData = JSON.parse(marketDataStr);
                    marketData = new Map(savedData);
                    log(`Loaded market data for ${marketData.size} items from cache`);
                    return true;
                }
            }
        } catch (error) {
            log(`Failed to load market data: ${error.message}`);
        }
        return false;
    }
    
    function saveMarketData() {
        try {
            const expiryDate = new Date(Date.now() + MARKET_CACHE_DURATION);
            const dataArray = Array.from(marketData.entries());
            localStorage.setItem(MARKET_DATA_STORAGE_KEY, JSON.stringify(dataArray));
            localStorage.setItem(MARKET_EXPIRY_STORAGE_KEY, expiryDate.getTime().toString());
            log(`Saved market data for ${marketData.size} items to cache`);
        } catch (error) {
            log(`Failed to save market data: ${error.message}`);
        }
    }
    
    // Calculate estimated value based on lowest market price after outlier removal
    function calculateEstimatedValue(itemId, quantity) {
        const marketInfo = marketData.get(itemId);
        if (!marketInfo || !marketInfo.listings || marketInfo.listings.length === 0) {
            return 0;
        }
        
        // Calculate price stats to get consistent pricing
        const stats = calculatePriceStats(marketInfo.listings);
        if (!stats) {
            return 0;
        }
        
        // Use the same low-end price calculation as the Price column
        const lowPrice = Math.min(stats.p25, stats.min * 1.2);
        
        // Calculate estimated value: low-end price * quantity
        return Math.round(lowPrice * quantity);
    }
    
    // ============================================================================
    // SORTING FUNCTIONS
    // ============================================================================
    
    // Global sorting state
    let currentSortColumn = -1;
    let currentSortDirection = 'asc';
    let currentSortField = null; // Track which field we're sorting by
    
    // Apply current sort to items array
    function applySortToItems(items) {
        if (currentSortColumn === -1 || !currentSortField) {
            // No active sort, use default sorting
            return items.sort((a, b) => {
                const aIgnored = isItemIgnored(a.id);
                const bIgnored = isItemIgnored(b.id);
                
                // If showing ignored items, put ignored items at the top for easy un-ignoring
                const showIgnoredCheckbox = document.getElementById('show-ignored');
                const showIgnored = showIgnoredCheckbox ? showIgnoredCheckbox.checked : false;
                
                if (showIgnored) {
                    if (aIgnored && !bIgnored) return -1;
                    if (bIgnored && !aIgnored) return 1;
                } else {
                    // If not showing ignored items, put ignored items last (they'll be filtered out anyway)
                    if (aIgnored && !bIgnored) return 1;
                    if (bIgnored && !aIgnored) return -1;
                }
                
                // If showing non-tradeable items, put them after ignored items
                const showNonTradeableCheckbox = document.getElementById('show-non-tradeable');
                const showNonTradeable = showNonTradeableCheckbox ? showNonTradeableCheckbox.checked : false;
                
                if (showNonTradeable && !aIgnored && !bIgnored) {
                    if (a.tradeable === false && b.tradeable !== false) return -1;
                    if (b.tradeable === false && a.tradeable !== false) return 1;
                }
                
                const categoryA = a.category || '';
                const categoryB = b.category || '';
                const nameA = a.name || '';
                const nameB = b.name || '';
                
                if (categoryA !== categoryB) {
                    return categoryA.localeCompare(categoryB);
                }
                return nameA.localeCompare(nameB);
            });
        }
        
        // Apply active sort
        return items.sort((a, b) => {
            let aValue, bValue;
            
            switch (currentSortField) {
                case 'name':
                    aValue = a.name || '';
                    bValue = b.name || '';
                    break;
                case 'category':
                    aValue = a.category || '';
                    bValue = b.category || '';
                    break;
                case 'qty':
                    aValue = a.quantity || 0;
                    bValue = b.quantity || 0;
                    break;
                case 'trade':
                    aValue = a.tradeable === true ? 1 : 0;
                    bValue = b.tradeable === true ? 1 : 0;
                    break;
                case 'price':
                    // Get market price for comparison
                    const aMarketInfo = marketData.get(a.id.toString());
                    const bMarketInfo = marketData.get(b.id.toString());
                    
                    if (aMarketInfo && a.tradeable === true) {
                        const aStats = calculatePriceStats(aMarketInfo.listings);
                        aValue = aStats ? Math.min(aStats.p25, aStats.min * 1.2) : 0;
                    } else {
                        aValue = 0;
                    }
                    
                    if (bMarketInfo && b.tradeable === true) {
                        const bStats = calculatePriceStats(bMarketInfo.listings);
                        bValue = bStats ? Math.min(bStats.p25, bStats.min * 1.2) : 0;
                    } else {
                        bValue = 0;
                    }
                    break;
                case 'estimated':
                    aValue = calculateEstimatedValue(a.id, a.quantity);
                    bValue = calculateEstimatedValue(b.id, b.quantity);
                    break;
                default:
                    return 0;
            }
            
            // Apply sort direction
            if (currentSortDirection === 'asc') {
                if (typeof aValue === 'string') {
                    return aValue.localeCompare(bValue);
                }
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            } else {
                if (typeof aValue === 'string') {
                    return bValue.localeCompare(aValue);
                }
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            }
        });
    }
    
    // Dynamic sort function that adjusts for Trade column visibility
    function sortTableDynamic(columnName) {
        const tradeHeader = document.getElementById('trade-column-header');
        if (!tradeHeader) {
            return;
        }
        
        const tradeColumnVisible = tradeHeader.style.display !== 'none';
        
        let columnIndex;
        
        // Map column names to indices, adjusting for Trade column visibility
        switch (columnName) {
            case 'name': columnIndex = 0; break;
            case 'category': columnIndex = 1; break;
            case 'qty': columnIndex = 2; break;
            case 'trade': columnIndex = tradeColumnVisible ? 3 : -1; break;
            case 'price': columnIndex = tradeColumnVisible ? 4 : 3; break;
            case 'estimated': columnIndex = tradeColumnVisible ? 5 : 4; break;
            default: return;
        }
        
        if (columnIndex === -1) return; // Trade column not visible
        
        // Update sort direction
        if (currentSortColumn === columnIndex && currentSortField === columnName) {
            currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            currentSortDirection = 'asc';
            currentSortColumn = columnIndex;
            currentSortField = columnName;
        }
        
        // Clear all sort indicators
        ['name', 'category', 'qty', 'trade', 'price', 'estimated'].forEach(col => {
            const indicator = document.getElementById(`sort-${col}`);
            if (indicator) indicator.textContent = '↕';
        });
        
        // Set current sort indicator
        const currentIndicator = document.getElementById(`sort-${columnName}`);
        if (currentIndicator) {
            currentIndicator.textContent = currentSortDirection === 'asc' ? '↑' : '↓';
        }
        
        // Re-render table with new sort
        updateTableDisplay();
    }

    // Make sorting functions global immediately after definition
    window.sortTableDynamic = sortTableDynamic;
    window.sortTable = sortTable;
    window.toggleIgnoreItem = toggleIgnoreItem;
    window.resetApiState = resetApiState;

    // Sort table function
    function sortTable(columnIndex) {
        const table = document.getElementById('all-items-table');
        if (!table) {
            return;
        }
        
        const tbody = table.querySelector('tbody');
        if (!tbody) {
            return;
        }
        
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        if (rows.length === 0) {
            return;
        }
        
        const tradeColumnVisible = document.getElementById('trade-column-header').style.display !== 'none';
        
        // Update sort direction
        if (currentSortColumn === columnIndex) {
            currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            currentSortDirection = 'asc';
            currentSortColumn = columnIndex;
        }
        
        // Clear all sort indicators
        ['name', 'category', 'qty', 'trade', 'price', 'estimated'].forEach(col => {
            const indicator = document.getElementById(`sort-${col}`);
            if (indicator) indicator.textContent = '↕';
        });
        
        // Set current sort indicator
        const columnNames = ['name', 'category', 'qty', 'trade', 'price', 'estimated'];
        
        if (columnNames[columnIndex]) {
            const currentIndicator = document.getElementById(`sort-${columnNames[columnIndex]}`);
            if (currentIndicator) {
                currentIndicator.textContent = currentSortDirection === 'asc' ? '↑' : '↓';
            }
        }
        
        // Sort rows
        rows.sort((a, b) => {
            let aValue = a.cells[columnIndex].textContent.trim();
            let bValue = b.cells[columnIndex].textContent.trim();
            
            // Handle different data types based on fixed column positions
            let qtyColumnIndex = 2;
            let tradeColumnIndex = 3;
            let priceColumnIndex = 4;
            let estimatedColumnIndex = 5;
            
            // Handle different data types
            if (columnIndex === qtyColumnIndex || columnIndex === priceColumnIndex || columnIndex === estimatedColumnIndex) {
                // Remove currency symbols and commas, convert to numbers
                aValue = parseFloat(aValue.replace(/[$,]/g, '')) || 0;
                bValue = parseFloat(bValue.replace(/[$,]/g, '')) || 0;
            } else if (columnIndex === tradeColumnIndex) {
                // Convert ✓/✗ to sortable values
                aValue = aValue === '✓' ? 1 : 0;
                bValue = bValue === '✓' ? 1 : 0;
            }
            
            if (currentSortDirection === 'asc') {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            } else {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            }
        });
        
        // Re-append sorted rows
        rows.forEach(row => tbody.appendChild(row));
    }
    
    // Check if all items are likely loaded by examining scroll position and item count
    function checkItemLoadingStatus() {
        try {
            // Check if we're at the bottom of the page
            const scrollBottom = window.innerHeight + window.scrollY;
            const pageHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );
            const isNearBottom = scrollBottom >= (pageHeight - 1000);
            
            // Use the SAME logic as scanVisibleItems to count items accurately
            let currentVisibleItems = 0;
            
            // Detect page type (same as scanVisibleItems)
            const isMarketPage = window.location.href.includes('ItemMarket') || 
                               window.location.href.includes('itemmarket') ||
                               window.location.href.includes('addListing');
            
            // Declare containers at function scope for later use
            let allItemsContainer = null;
            
            if (isMarketPage) {
                // Market page: try broader selectors to detect any list items
                const marketSelectors = [
                    '.items-list li, .items-list .item',           // Market inventory items
                    '.item-list li, .item-list .item',             // Alternative market inventory
                    '.inventory-items li, .inventory-items .item', // Market inventory container
                    '.market-items li, .market-items .item',       // Market-specific items
                    '.listing-items li, .listing-items .item',     // Market listing items
                    'ul li[data-item]',                            // Any list items with data-item
                    'li[data-item]',                               // Fallback: any items
                    '.item, .inventory-item',                      // CSS class based items
                    '[class*="item"]',                             // Any element with 'item' in class
                    'li[class*="item"], div[class*="item"]'        // List or div items
                ];
                
                for (const selector of marketSelectors) {
                    const itemElements = document.querySelectorAll(selector);
                    if (itemElements.length > 0) {
                        currentVisibleItems = itemElements.length;
                        break;
                    }
                }
                
                // Special case for market page: if we can't find specific items,
                // but we have scanned items, assume the page is loaded
                if (currentVisibleItems === 0 && scannedItems.size > 0) {
                    currentVisibleItems = scannedItems.size;
                }
            } else {
                // Inventory page: check for all-items container first (same as scanVisibleItems)
                allItemsContainer = document.querySelector('#all-items');
                if (allItemsContainer && allItemsContainer.style.display !== 'none') {
                    const itemElements = allItemsContainer.querySelectorAll('li[data-item][data-category]:not([data-action])');
                    currentVisibleItems = itemElements.length;
                } else {
                    // If not in all-items, look for any visible inventory container with items
                    const inventoryContainers = document.querySelectorAll('.inventory-wrap, .category-wrap, [id*="items"]');
                    
                    for (const container of inventoryContainers) {
                        if (container.style.display !== 'none' && !container.hidden) {
                            const containerItems = container.querySelectorAll('li[data-item][data-category]:not([data-action])');
                            if (containerItems.length > 0) {
                                currentVisibleItems = containerItems.length;
                                break;
                            }
                        }
                    }
                    
                    // Fallback: scan any visible items on the page
                    if (currentVisibleItems === 0) {
                        const itemElements = document.querySelectorAll('li[data-item][data-category]:not([data-action])');
                        currentVisibleItems = itemElements.length;
                    }
                    
                    // Additional fallback: try broader selectors for inventory
                    if (currentVisibleItems === 0) {
                        const broaderSelectors = [
                            'li[data-item]',  // Any list item with data-item
                            '.inventory-item', // CSS class based
                            '[data-category]', // Any element with data-category
                            '.item-wrap li'    // Item wrapper lists
                        ];
                        
                        for (const selector of broaderSelectors) {
                            const elements = document.querySelectorAll(selector);
                            if (elements.length > 0) {
                                currentVisibleItems = elements.length;
                                break;
                            }
                        }
                    }
                }
            }
            
            // Get network loading state
            const loadingState = getItemLoadingState();
            
            // Get the items container to check if there's a loading indicator (be more specific)
            const loadingIndicators = [
                '.loading:not(.hidden)', 
                '.spinner:not(.hidden)', 
                '.ajax-loader:not(.hidden)', 
                '.loading-spinner:not(.hidden)',
                '[class*="loading"]:not(.hidden):not([style*="display: none"])',
                '[class*="spinner"]:not(.hidden):not([style*="display: none"])'
            ];
            
            let hasLoadingIndicator = false;
            let foundIndicators = [];
            
            // Check only within the items container first for more accuracy
            // For market page, look for loading indicators in market-specific containers
            let containerToCheck = null;
            if (isMarketPage) {
                // Look for market-specific containers that might have loading indicators
                containerToCheck = document.querySelector('.items-list, .item-list, .inventory-items, .market-items, .listing-items') ||
                                 document.querySelector('main, .content, .market-content');
            } else {
                containerToCheck = allItemsContainer || document.querySelector('.inventory-wrap, .category-wrap');
            }
            
            // If we have a specific container, check for loading indicators within it
            if (containerToCheck) {
                for (const indicator of loadingIndicators) {
                    const elements = containerToCheck.querySelectorAll(indicator);
                    if (elements.length > 0) {
                        // Check if any of these elements are actually visible
                        for (const el of elements) {
                            const rect = el.getBoundingClientRect();
                            const isVisible = rect.width > 0 && rect.height > 0 && 
                                            window.getComputedStyle(el).display !== 'none' &&
                                            window.getComputedStyle(el).visibility !== 'hidden';
                            if (isVisible) {
                                hasLoadingIndicator = true;
                                foundIndicators.push(indicator);
                                break;
                            }
                        }
                        if (hasLoadingIndicator) break;
                    }
                }
            }
            
            // If no container-specific indicators found, do a global check as fallback
            if (!hasLoadingIndicator) {
                for (const indicator of loadingIndicators) {
                    const elements = document.querySelectorAll(indicator);
                    if (elements.length > 0) {
                        // Check if any of these elements are actually visible
                        for (const el of elements) {
                            const rect = el.getBoundingClientRect();
                            const isVisible = rect.width > 0 && rect.height > 0 && 
                                            window.getComputedStyle(el).display !== 'none' &&
                                            window.getComputedStyle(el).visibility !== 'hidden';
                            if (isVisible) {
                                hasLoadingIndicator = true;
                                foundIndicators.push(indicator);
                                break;
                            }
                        }
                        if (hasLoadingIndicator) break;
                    }
                }
            }
            
            // Override loading detection if it's been too long since last network activity
            const timeSinceLastActivity = Date.now() - Math.max(itemLoadingState.lastLoadTime, 0);
            const loadingTimeout = 10000; // 10 seconds timeout
            const isLoadingTimedOut = timeSinceLastActivity > loadingTimeout && itemLoadingState.totalRequests > 0;
            
            // Combine visual loading indicators with network activity, but allow timeout override
            const isCurrentlyLoading = !isLoadingTimedOut && (hasLoadingIndicator || loadingState.isLoading);
            
            // More intelligent "all loaded" detection using network monitoring:
            // 1. Near bottom of page
            // 2. No loading indicators (visual or network) OR loading has timed out  
            // 3. At least some items found (more lenient for market page)
            // 4. If we have scanned items, the visible count should be close to or greater than scanned count
            // 5. If network requests have been made, they should be completed for at least 2 seconds
            
            // Market page is more lenient - we mainly care about network activity completion
            const minimumItemsRequired = isMarketPage ? 0 : 10;
            let likelyAllLoaded = isNearBottom && (!isCurrentlyLoading || isLoadingTimedOut) && currentVisibleItems >= minimumItemsRequired;
            
            // Market page special case: if we have scanned items and are near bottom, assume loaded
            if (isMarketPage && isNearBottom && scannedItems.size > 0 && !isCurrentlyLoading) {
                likelyAllLoaded = true;
            }
            
            // Additional check: if we have scanned items, visible items should be at least as many
            // (unless user filtered/changed view) - skip this check for market page
            if (likelyAllLoaded && scannedItems.size > 0 && !isMarketPage) {
                // If visible items are significantly less than scanned items, we might be in wrong view or not fully loaded
                if (currentVisibleItems < scannedItems.size * 0.8) {
                    likelyAllLoaded = false;
                }
            }
            
            // Network-based check: if requests were made but not settled for long enough, don't mark as complete
            // UNLESS we've timed out the loading detection
            if (likelyAllLoaded && !isLoadingTimedOut && loadingState.totalRequests > 0 && !loadingState.likelyFinishedLoading) {
                likelyAllLoaded = false;
            }
            
            // Special case: if visible items == scanned items and we're near bottom, likely all loaded
            // even if there are some loading indicators (they might be false positives)
            if (!likelyAllLoaded && isNearBottom && currentVisibleItems >= minimumItemsRequired && 
                scannedItems.size > 0 && (isMarketPage || currentVisibleItems >= scannedItems.size * 0.95)) {
                likelyAllLoaded = true;
            }
            
            return {
                isNearBottom,
                currentVisibleItems,
                hasLoadingIndicator,
                isCurrentlyLoading,
                isLoadingTimedOut,
                likelyAllLoaded,
                pageHeight,
                scrollPosition: scrollBottom,
                scannedItemsCount: scannedItems.size,
                loadingState,
                foundIndicators
            };
        } catch (error) {
            log('Error checking item loading status: ' + error.message);
            return {
                isNearBottom: false,
                currentVisibleItems: 0,
                hasLoadingIndicator: false,
                isCurrentlyLoading: false,
                isLoadingTimedOut: false,
                likelyAllLoaded: false,
                pageHeight: 0,
                scrollPosition: 0,
                scannedItemsCount: scannedItems.size,
                loadingState: getItemLoadingState(),
                foundIndicators: []
            };
        }
    }
    
    // Expose loading state for debugging
    window.getScrap2MarkLoadingState = function() {
        return {
            itemLoadingState,
            currentStatus: checkItemLoadingStatus(),
            scannedItemsCount: scannedItems.size
        };
    };
    
    // Manual override for stuck loading detection
    window.forceScrap2MarkReady = function() {
        log('Manual override: Forcing loading state to complete');
        itemLoadingState.isLoading = false;
        itemLoadingState.loadingRequests.clear();
        itemLoadingState.lastLoadTime = Date.now() - 15000; // Set to 15 seconds ago
        updateScrollReminder();
        return 'Loading state reset - status should update shortly';
    };

    // XHR/Fetch monitoring functions
    function setupNetworkMonitoring() {
        // Monitor XMLHttpRequest
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;
        
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._scrap2mark_url = url;
            this._scrap2mark_method = method;
            return originalXHROpen.apply(this, [method, url, ...args]);
        };
        
        XMLHttpRequest.prototype.send = function(...args) {
            const url = this._scrap2mark_url;
            
            // Check if this looks like an inventory/item loading request
            if (url && isItemLoadingRequest(url)) {
                const requestId = Date.now() + Math.random();
                itemLoadingState.loadingRequests.add(requestId);
                itemLoadingState.isLoading = true;
                itemLoadingState.totalRequests++;
                
                const handleResponse = () => {
                    itemLoadingState.loadingRequests.delete(requestId);
                    itemLoadingState.completedRequests++;
                    itemLoadingState.lastLoadTime = Date.now();
                    
                    if (itemLoadingState.loadingRequests.size === 0) {
                        itemLoadingState.isLoading = false;
                        // Update status after a short delay to allow DOM updates
                        setTimeout(updateScrollReminder, 500);
                    }
                };
                
                this.addEventListener('load', handleResponse);
                this.addEventListener('error', handleResponse);
                this.addEventListener('abort', handleResponse);
            }
            
            return originalXHRSend.apply(this, args);
        };
        
        // Monitor fetch API
        const originalFetch = window.fetch;
        window.fetch = function(url, options = {}) {
            // Check if this looks like an inventory/item loading request
            if (url && isItemLoadingRequest(url.toString())) {
                const requestId = Date.now() + Math.random();
                itemLoadingState.loadingRequests.add(requestId);
                itemLoadingState.isLoading = true;
                itemLoadingState.totalRequests++;
                
                const promise = originalFetch.apply(this, [url, options]);
                
                promise.finally(() => {
                    itemLoadingState.loadingRequests.delete(requestId);
                    itemLoadingState.completedRequests++;
                    itemLoadingState.lastLoadTime = Date.now();
                    
                    if (itemLoadingState.loadingRequests.size === 0) {
                        itemLoadingState.isLoading = false;
                        // Update status after a short delay to allow DOM updates
                        setTimeout(updateScrollReminder, 500);
                    }
                });
                
                return promise;
            }
            
            return originalFetch.apply(this, [url, options]);
        };
    }
    
    // Check if a URL looks like an inventory/item loading request
    function isItemLoadingRequest(url) {
        if (!url || typeof url !== 'string') return false;
        
        // Convert to lowercase for case-insensitive matching
        const lowerUrl = url.toLowerCase();
        
        // Common patterns for inventory/item loading requests in Torn
        const itemLoadingPatterns = [
            '/item.php',           // Direct item page requests
            '/loader.php',         // Generic loader that might load items
            'action=load',         // Action parameter for loading
            'action=get',          // Action parameter for getting data
            'action=getdata',      // Torn's getdata action
            'step=get',            // Step parameter
            'step=load',           // Step load parameter
            'rfcv=',               // Torn's request verification token (likely AJAX)
            'torn_user=',          // Torn user parameter in AJAX
            'sid=inventory',       // Inventory section ID
            'sid=itemmarket',      // Market section ID
            'inventory',           // Contains inventory in URL
            'items',               // Contains items in URL
            'loadmore',            // Load more functionality
            'pagination',          // Pagination requests
            'offset=',             // Offset parameter suggests pagination
            'page=',               // Page parameter
            'limit=',              // Limit parameter
            'category=',           // Category loading
            '/ajax/',              // AJAX requests that might load items
            'ajaxhelpers',         // Torn's AJAX helper functions
            'helpers.php',         // Torn's helper functions
            'itemmarket',          // Market-specific requests
            'addlisting',          // Add listing functionality
        ];
        
        // Check if URL matches any item loading patterns
        const matches = itemLoadingPatterns.some(pattern => lowerUrl.includes(pattern));
        
        // Exclude our own API requests and external resources
        const isOurApiRequest = lowerUrl.includes('api.torn.com') && (
            lowerUrl.includes('itemmarket') || 
            lowerUrl.includes('/torn/items')
        );
        
        const isExternalResource = lowerUrl.includes('cloudflare') || 
                                  lowerUrl.includes('google') || 
                                  lowerUrl.includes('facebook') ||
                                  lowerUrl.includes('.css') ||
                                  lowerUrl.includes('.js') ||
                                  lowerUrl.includes('.png') ||
                                  lowerUrl.includes('.jpg') ||
                                  lowerUrl.includes('.gif') ||
                                  lowerUrl.includes('.webp');
        
        return matches && !isOurApiRequest && !isExternalResource;
    }
    
    // Get current loading state for display
    function getItemLoadingState() {
        const now = Date.now();
        const timeSinceLastLoad = now - itemLoadingState.lastLoadTime;
        
        return {
            isLoading: itemLoadingState.isLoading,
            activeRequests: itemLoadingState.loadingRequests.size,
            totalRequests: itemLoadingState.totalRequests,
            completedRequests: itemLoadingState.completedRequests,
            timeSinceLastLoad,
            likelyFinishedLoading: !itemLoadingState.isLoading && timeSinceLastLoad > 2000 && itemLoadingState.totalRequests > 0
        };
    }
    
    // Update scroll reminder based on loading status
    function updateScrollReminder() {
        const reminder = document.getElementById('scroll-reminder');
        const progressSpan = document.getElementById('loading-progress');
        if (!reminder) return;
        
        // Detect page type for contextual messaging
        const isMarketPage = window.location.href.includes('ItemMarket') || 
                           window.location.href.includes('itemmarket') ||
                           window.location.href.includes('addListing');
        
        const status = checkItemLoadingStatus();
        
        // Update progress indicator
        if (progressSpan) {
            if (status.likelyAllLoaded) {
                progressSpan.innerHTML = `<span style="color: #28a745; font-weight: bold;">✅ Complete (${status.currentVisibleItems} items visible, ${status.scannedItemsCount} scanned)</span>`;
            } else if (status.isLoadingTimedOut) {
                progressSpan.innerHTML = `<span style="color: #ffc107; font-weight: bold;">⏰ Loading timed out (${status.currentVisibleItems} visible)</span>`;
            } else if (status.isCurrentlyLoading) {
                const loadingText = status.loadingState.isLoading ? 
                    `🔄 Loading via network (${status.loadingState.activeRequests} active)` : 
                    `🔄 Loading... (${status.currentVisibleItems} visible)`;
                progressSpan.innerHTML = `<span style="color: #ffc107; font-weight: bold;">${loadingText}</span>`;
            } else if (status.isNearBottom) {
                progressSpan.innerHTML = `<span style="color: #17a2b8; font-weight: bold;">📍 Near bottom (${status.currentVisibleItems} visible, ${status.scannedItemsCount} scanned)</span>`;
            } else {
                progressSpan.innerHTML = `<span style="color: #dc3545; font-weight: bold;">📜 Keep scrolling (${status.currentVisibleItems} visible)</span>`;
            }
        }
        
        if (status.likelyAllLoaded) {
            reminder.style.cssText = `
                margin-bottom: 10px; 
                font-size: 11px; 
                background: #d4edda; 
                border: 1px solid #c3e6cb; 
                border-radius: 4px; 
                padding: 8px;
            `;
            
            const nextStepText = isMarketPage ? 
                'You can now add items to market listings' :
                'Use "Get Market Prices" then "Fill Market Forms"';
            
            reminder.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: #155724; font-weight: bold;">✅ READY:</span>
                    <span style="color: #155724;">All items likely loaded - You can safely proceed!</span>
                </div>
                <div style="margin-top: 4px; font-size: 10px; color: #6c6c6c;">
                    <strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">✅ Complete (${status.currentVisibleItems} visible, ${status.scannedItemsCount} scanned)</span> | 
                    <strong>Next:</strong> ${nextStepText}
                </div>
            `;
        } else {
            reminder.style.cssText = `
                margin-bottom: 10px; 
                font-size: 11px; 
                background: #fff3cd; 
                border: 1px solid #ffeaa7; 
                border-radius: 4px; 
                padding: 8px;
            `;
            
            let statusText, progressColor, actionAdvice;
            if (status.isCurrentlyLoading) {
                if (status.loadingState.isLoading) {
                    statusText = `Network loading in progress (${status.loadingState.activeRequests} active requests)`;
                    actionAdvice = "Wait for loading to complete";
                } else if (status.hasLoadingIndicator) {
                    statusText = "Visual loading indicators detected";
                    actionAdvice = "Wait for loading indicators to disappear";
                } else {
                    statusText = "Items are still loading - please wait";
                    actionAdvice = "Wait for loading indicators to disappear";
                }
                progressColor = "#ffc107";
            } else if (status.isLoadingTimedOut) {
                statusText = "Loading detection timed out - assuming complete";
                progressColor = "#28a745";
                actionAdvice = "Try scanning items now or refresh if needed";
            } else if (!status.isNearBottom) {
                statusText = "Keep scrolling to load more items";
                progressColor = "#dc3545";
                actionAdvice = isMarketPage ? "Scroll to see all available items" : "Scroll down to the bottom of the page";
            } else {
                statusText = "Loading detection may be incomplete";
                progressColor = "#6c757d";
                actionAdvice = "Try refreshing the page or manual scan";
            }
            
            // Add a manual override button if loading seems stuck
            const manualOverrideButton = (status.isCurrentlyLoading && !status.isLoadingTimedOut) ? 
                `<button onclick="window.forceScrap2MarkReady && window.forceScrap2MarkReady()" style="background: #dc3545; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 10px; margin-left: 8px;">Force Ready</button>` : '';
            
            reminder.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: #856404; font-weight: bold;">${status.isLoadingTimedOut ? '⏰ TIMEOUT:' : '⚠️ SCROLL NEEDED:'}</span>
                    <span style="color: #856404;">${statusText}</span>
                    ${manualOverrideButton}
                </div>
                <div style="margin-top: 4px; font-size: 10px; color: #6c6c6c;">
                    <strong>Status:</strong> <span style="color: ${progressColor}; font-weight: bold;">${status.currentVisibleItems} visible${status.scannedItemsCount > 0 ? `, ${status.scannedItemsCount} scanned` : ''}</span> | 
                    <strong>Action:</strong> ${actionAdvice}
                </div>
            `;
        }
    }
    
    // Check if market data is fresh (less than 1 hour old)
    function isMarketDataFresh(marketInfo) {
        if (!marketInfo || !marketInfo.timestamp) return false;
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        return (Date.now() - marketInfo.timestamp) < oneHour;
    }
    
    // Remove price outliers using statistical methods (only high outliers and extreme prices)
    function filterOutliers(listings) {
        if (!listings || listings.length < 3) return listings; // Need at least 3 listings for meaningful filtering
        
        // Get all prices and sort them
        const prices = listings.map(l => l.price).sort((a, b) => a - b);
        const minPrice = prices[0];
        const maxPrice = prices[prices.length - 1];
        
        // Rule 1: Remove prices more than 10x the minimum price
        const priceCapFilter = listings.filter(listing => listing.price <= minPrice * 10);
        
        // Rule 2: Statistical outlier detection for high outliers only
        if (priceCapFilter.length < 3) return priceCapFilter; // Not enough data for statistical analysis
        
        const uniquePrices = [...new Set(priceCapFilter.map(l => l.price))];
        if (uniquePrices.length < 3) return priceCapFilter; // Need at least 3 unique prices
        
        const mean = uniquePrices.reduce((a, b) => a + b, 0) / uniquePrices.length;
        const variance = uniquePrices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / uniquePrices.length;
        const stdDev = Math.sqrt(variance);
        
        if (stdDev === 0) return priceCapFilter; // All prices are the same
        
        // Only filter high outliers (prices significantly above the mean)
        const finalFiltered = priceCapFilter.filter(listing => {
            const zScore = (listing.price - mean) / stdDev;
            return zScore <= OUTLIER_THRESHOLD; // Only remove high outliers
        });
        
        // More conservative approach: only apply statistical filtering if we don't remove too many sellers
        const uniqueOriginalPrices = [...new Set(priceCapFilter.map(l => l.price))];
        const uniqueFinalPrices = [...new Set(finalFiltered.map(l => l.price))];
        const sellerRetainRatio = uniqueFinalPrices.length / uniqueOriginalPrices.length;
        
        // Keep statistical filtering only if we retain at least 70% of sellers
        if (sellerRetainRatio >= 0.7) {
            return finalFiltered;
        } else {
            return priceCapFilter; // Fall back to just the 10x price cap filter
        }
    }
    
    // API rate limiting and error handling
    function shouldThrottleApiRequest() {
        const now = Date.now();
        
        // Reset counter every minute
        if (now - apiRequestResetTime > 60000) {
            apiRequestCount = 0;
            apiRequestResetTime = now;
        }
        
        // Check if we've exceeded rate limit
        if (apiRequestCount >= 95) { // Leave some buffer below 100
            return true;
        }
        
        // Check minimum time between requests (600ms = ~100 requests per minute)
        if (now - lastApiRequest < 600) {
            return true;
        }
        
        return false;
    }
    
    async function fetchMarketData(itemId) {
        if (!apiKey) {
            throw new Error('API key not available');
        }
        
        try {
            // Add timeout for throttling wait but make it more generous
            let throttleAttempts = 0;
            const maxThrottleAttempts = 180; // Max 3 minutes of waiting (increased from 1 minute)
            
            // Wait for throttling if needed
            while (shouldThrottleApiRequest() && throttleAttempts < maxThrottleAttempts) {
                await sleep(1000);
                throttleAttempts++;
            }
            
            if (throttleAttempts >= maxThrottleAttempts) {
                throw new Error('Throttling timeout - API requests are being rate limited too heavily');
            }
            
            lastApiRequest = Date.now();
            apiRequestCount++;
            
            // Add timeout to the fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
            
            try {
                const response = await fetch(`https://api.torn.com/v2/market/${itemId}/itemmarket?offset=0&key=${apiKey}`, {
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (data.error) {
                    const errorCode = data.error.code;
                    const errorMessage = data.error.error;
                    
                    // Handle specific API errors
                    if (errorCode === 5) { // Too many requests
                        throw new Error('Rate limit exceeded. Please wait before making more requests.');
                    } else if (errorCode === 8) { // IP block
                        throw new Error('IP temporarily blocked due to abuse. Please wait.');
                    } else if (errorCode === 14) { // Daily limit
                        throw new Error('Daily API read limit reached.');
                    } else if (errorCode === 17) { // Backend error
                        throw new Error('Torn backend error. Please try again later.');
                    }
                    
                    throw new Error(`API Error ${errorCode}: ${errorMessage}`);
                }
                
                if (data.itemmarket && data.itemmarket.listings) {
                    const marketInfo = {
                        item: data.itemmarket.item,
                        listings: data.itemmarket.listings,
                        timestamp: Date.now()
                    };
                    
                    marketData.set(itemId.toString(), marketInfo);
                    saveMarketData();
                    return marketInfo;
                }
                
                return null;
                
            } catch (fetchError) {
                clearTimeout(timeoutId);
                if (fetchError.name === 'AbortError') {
                    throw new Error('Request timeout - API request took too long');
                }
                throw fetchError;
            }
            
        } catch (error) {
            // If it's a rate limiting error, we should back off
            if (error.message.includes('Rate limit') || error.message.includes('Too many requests')) {
                // Exponential backoff
                await sleep(Math.min(30000, 1000 * Math.pow(2, apiRequestCount % 5)));
            }
            throw error;
        }
    }
    
    // Process API request queue
    async function processApiQueue() {
        if (isProcessingQueue || apiRequestQueue.length === 0) {
            return;
        }
        
        isProcessingQueue = true;
        
        while (apiRequestQueue.length > 0) {
            const { itemId, resolve, reject } = apiRequestQueue.shift();
            
            try {
                const result = await fetchMarketData(itemId);
                resolve(result);
            } catch (error) {
                reject(error);
            }
            
            // Small delay between requests
            await sleep(100);
        }
        
        isProcessingQueue = false;
    }
    
    // Queue API request
    function queueMarketDataRequest(itemId, forceFresh = false) {
        return new Promise((resolve, reject) => {
            // Check if we already have cached data that's fresh (unless forcing fresh data)
            if (!forceFresh) {
                const cached = marketData.get(itemId.toString());
                if (cached && isMarketDataFresh(cached)) {
                    resolve(cached);
                    return;
                }
            }
            
            // Add to queue
            apiRequestQueue.push({ itemId, resolve, reject });
            
            // Start processing if not already running
            processApiQueue();
        });
    }
    
    // Calculate price statistics
    function calculatePriceStats(listings, filterOutliersEnabled = true) {
        if (!listings || listings.length === 0) {
            return null;
        }
        
        // Filter outliers if enabled
        const processedListings = filterOutliersEnabled ? filterOutliers(listings) : listings;
        
        if (processedListings.length === 0) {
            return null;
        }
        
        const prices = processedListings.map(l => l.price).sort((a, b) => a - b);
        const quantities = processedListings.reduce((sum, l) => sum + l.amount, 0);
        
        // Calculate weighted average
        const totalValue = processedListings.reduce((sum, l) => sum + (l.price * l.amount), 0);
        const weightedAverage = totalValue / quantities;
        
        // Calculate percentiles
        const p25Index = Math.floor(prices.length * 0.25);
        const p75Index = Math.floor(prices.length * 0.75);
        
        // Calculate seller-based statistics
        const uniquePrices = [...new Set(processedListings.map(l => l.price))];
        const originalUniquePrices = [...new Set(listings.map(l => l.price))];
        
        // Calculate filtering breakdown
        const priceCapFiltered = listings.filter(l => l.price > Math.min(...listings.map(p => p.price)) * 10);
        const statFiltered = listings.length - processedListings.length - priceCapFiltered.length;
        
        return {
            min: Math.min(...prices),
            max: Math.max(...prices),
            median: prices[Math.floor(prices.length / 2)],
            average: weightedAverage,
            p25: prices[p25Index],
            p75: prices[p75Index],
            listings: processedListings.length,
            totalListings: listings.length,
            uniqueSellers: uniquePrices.length,
            totalUniqueSellers: originalUniquePrices.length,
            totalQuantity: quantities,
            outliersFiltered: listings.length - processedListings.length,
            sellersFiltered: originalUniquePrices.length - uniquePrices.length,
            priceCapFiltered: priceCapFiltered.length,
            statFiltered: Math.max(0, statFiltered)
        };
    }
    
    // Create price distribution mini chart
    function createPriceChart(listings, width = 60, height = 20) {
        if (!listings || listings.length === 0) {
            return `<div style="width: ${width}px; height: ${height}px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #999;">No data</div>`;
        }
        
        const filteredListings = filterOutliers(listings);
        const stats = calculatePriceStats(filteredListings, false);
        if (!stats) return '';
        
        // Group prices into bins for visualization
        const bins = Math.min(10, filteredListings.length);
        const binWidth = (stats.max - stats.min) / bins;
        const binCounts = new Array(bins).fill(0);
        
        filteredListings.forEach(listing => {
            const binIndex = Math.min(Math.floor((listing.price - stats.min) / binWidth), bins - 1);
            binCounts[binIndex] += listing.amount;
        });
        
        const maxBinCount = Math.max(...binCounts);
        
        // Create SVG chart
        const bars = binCounts.map((count, index) => {
            const barHeight = maxBinCount > 0 ? (count / maxBinCount) * (height - 2) : 0;
            const x = (index * width) / bins;
            const barWidth = width / bins - 1;
            const y = height - barHeight;
            
            return `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#007bff" opacity="0.7"/>`;
        }).join('');
        
        return `
            <svg width="${width}" height="${height}" style="border: 1px solid #ddd;">
                ${bars}
            </svg>
        `;
    }
    
    // Create high-resolution popup chart with zoom functionality
    function createDetailedPriceChart(listings, itemName, zoomMin = null, zoomMax = null) {
        if (!listings || listings.length === 0) {
            return '<div style="padding: 20px;">No market data available</div>';
        }
        
        const filteredListings = filterOutliers(listings);
        const stats = calculatePriceStats(filteredListings, false);
        if (!stats) return '<div style="padding: 20px;">No valid price data</div>';
        
        const width = 300;
        const height = 200;
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        // Determine price range for chart (zoom or full range)
        const displayMin = zoomMin || stats.min;
        const displayMax = zoomMax || stats.max;
        const displayRange = displayMax - displayMin;
        const isZoomed = zoomMin !== null || zoomMax !== null;
        
        // Filter listings to zoom range if zooming
        const displayListings = isZoomed ? 
            filteredListings.filter(l => l.price >= displayMin && l.price <= displayMax) :
            filteredListings;
        
        if (displayListings.length === 0) {
            return '<div style="padding: 20px;">No data in selected range</div>';
        }
        
        // Create bins for histogram
        const bins = Math.min(20, displayListings.length);
        const binWidth = displayRange / bins;
        const binData = [];
        
        for (let i = 0; i < bins; i++) {
            binData.push({
                min: displayMin + i * binWidth,
                max: displayMin + (i + 1) * binWidth,
                count: 0,
                totalAmount: 0
            });
        }
        
        displayListings.forEach(listing => {
            const binIndex = Math.min(Math.floor((listing.price - displayMin) / binWidth), bins - 1);
            if (binIndex >= 0) {
                binData[binIndex].count++;
                binData[binIndex].totalAmount += listing.amount;
            }
        });
        
        const maxCount = Math.max(...binData.map(b => b.totalAmount));
        
        // Create SVG bars with selection capability
        const bars = binData.map((bin, index) => {
            const barHeight = maxCount > 0 ? (bin.totalAmount / maxCount) * chartHeight : 0;
            const x = padding + (index * chartWidth) / bins;
            const barWidth = chartWidth / bins - 2;
            const y = padding + chartHeight - barHeight;
            
            const midPrice = (bin.min + bin.max) / 2;
            
            return `
                <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" 
                      fill="#007bff" opacity="0.7" stroke="#0056b3" stroke-width="1"
                      data-price-min="${bin.min}" data-price-max="${bin.max}" data-amount="${bin.totalAmount}"
                      class="chart-bar">
                </rect>
            `;
        }).join('');
        
        // Create axes
        const xAxis = `<line x1="${padding}" y1="${padding + chartHeight}" x2="${padding + chartWidth}" y2="${padding + chartHeight}" stroke="#666" stroke-width="1"/>`;
        const yAxis = `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${padding + chartHeight}" stroke="#666" stroke-width="1"/>`;
        
        // Create price labels
        const priceLabels = [displayMin, (displayMin + displayMax) / 2, displayMax].map((price, index) => {
            const x = padding + (index * chartWidth) / 2;
            return `<text x="${x}" y="${padding + chartHeight + 15}" text-anchor="middle" font-size="10" fill="#666">$${Math.round(price).toLocaleString()}</text>`;
        }).join('');
        
        // Create quantity labels
        const quantityLabels = [0, maxCount / 2, maxCount].map((qty, index) => {
            const y = padding + chartHeight - (index * chartHeight) / 2;
            return `<text x="${padding - 5}" y="${y + 3}" text-anchor="end" font-size="10" fill="#666">${Math.round(qty)}</text>`;
        }).join('');
        
        const outliersText = stats.outliersFiltered > 0 ? ` (${stats.outliersFiltered} high outliers filtered)` : '';
        const sellersText = stats.sellersFiltered > 0 ? ` | ${stats.sellersFiltered} sellers filtered` : '';
        const filterBreakdown = stats.priceCapFiltered > 0 || stats.statFiltered > 0 ? 
            ` (${stats.priceCapFiltered} 10x+ prices, ${stats.statFiltered} statistical outliers)` : '';
        const zoomText = (zoomMin !== null || zoomMax !== null) ? 
            ` | Zoomed: $${Math.round(displayMin).toLocaleString()}-$${Math.round(displayMax).toLocaleString()}` : '';
        
        // Selection overlay rectangle (initially hidden)
        const selectionOverlay = `
            <rect id="selection-rect" x="0" y="0" width="0" height="0" 
                  fill="rgba(0,123,255,0.2)" stroke="rgba(0,123,255,0.8)" 
                  stroke-width="1" style="display: none; pointer-events: none;"/>
        `;
        
        return `
            <div style="padding: 15px; background: white; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: relative; min-width: 320px; max-width: 400px;">
                <div>
                    <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #333;">${itemName} - Market Analysis${zoomText}</h4>
                    <svg id="price-chart-svg" width="${width}" height="${height + 20}" style="background: white; cursor: crosshair; width: 100%; max-width: ${width}px;" 
                         data-padding="${padding}" data-chart-width="${chartWidth}" data-chart-height="${chartHeight}"
                         data-display-min="${displayMin}" data-display-max="${displayMax}">
                        ${bars}
                        ${xAxis}
                        ${yAxis}
                        ${priceLabels}
                        ${quantityLabels}
                        ${selectionOverlay}
                        <text x="${width / 2}" y="15" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">Price Distribution</text>
                        <text x="15" y="${height / 2}" text-anchor="middle" font-size="10" fill="#666" transform="rotate(-90, 15, ${height / 2})">Quantity</text>
                        <text x="${width / 2}" y="${height + 15}" text-anchor="middle" font-size="10" fill="#666">Price ($)</text>
                    </svg>
                    <div style="font-size: 11px; margin-top: 10px; color: #666;">
                        <div><strong>Statistics:</strong></div>
                        <div>Average: $${Math.round(stats.average).toLocaleString()} | Median: $${stats.median.toLocaleString()}</div>
                        <div>Range: $${stats.min.toLocaleString()} - $${stats.max.toLocaleString()}</div>
                        <div>Q1: $${stats.p25.toLocaleString()} | Q3: $${stats.p75.toLocaleString()}</div>
                        <div>Listings: ${stats.listings}${outliersText} | Total Quantity: ${stats.totalQuantity.toLocaleString()}</div>
                        <div>Sellers: ${stats.uniqueSellers}/${stats.totalUniqueSellers}${sellersText}${filterBreakdown}</div>
                        ${(zoomMin !== null || zoomMax !== null) ? '<div style="margin-top: 5px;"><button id="reset-zoom" style="background: #6c757d; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px;">Reset Zoom</button></div>' : ''}
                    </div>
                    
                    <!-- Integrated listings section (always visible, mobile-friendly) -->
                    <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
                        <div style="font-weight: bold; font-size: 12px; margin-bottom: 8px; color: #333;">
                            Market Listings ${isZoomed ? '(Filtered)' : ''}
                        </div>
                        <div style="max-height: 200px; overflow-y: auto; border: 1px solid #eee; border-radius: 4px;">
                            ${createListingsTable(displayListings)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Create listings table for the expanded panel
    function createListingsTable(listings) {
        if (!listings || listings.length === 0) {
            return '<div style="padding: 10px; text-align: center; color: #666;">No listings available</div>';
        }
        
        // Sort listings by price (lowest first)
        const sortedListings = [...listings].sort((a, b) => a.price - b.price);
        
        // Group identical prices
        const priceGroups = new Map();
        sortedListings.forEach(listing => {
            const price = listing.price;
            if (!priceGroups.has(price)) {
                priceGroups.set(price, { 
                    price: price, 
                    totalQuantity: 0, 
                    listings: [] 
                });
            }
            const group = priceGroups.get(price);
            group.totalQuantity += listing.amount || 1; // Use amount, fallback to 1 if not available
            group.listings.push(listing);
        });
        
        let tableContent = `
            <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f8f9fa; border-bottom: 1px solid #dee2e6;">
                        <th style="padding: 4px 6px; text-align: left; border-right: 1px solid #dee2e6;">Qty</th>
                        <th style="padding: 4px 6px; text-align: right; border-right: 1px solid #dee2e6;">Price</th>
                        <th style="padding: 4px 6px; text-align: center;">Target</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // Convert map to array and limit to first 50 entries for performance
        const groupArray = Array.from(priceGroups.values()).slice(0, 50);
        
        groupArray.forEach((group, index) => {
            const targetPrice = Math.max(1, group.price - 1); // $1 less, minimum $1
            const rowId = `price-row-${group.price}`;
            
            tableContent += `
                <tr style="border-bottom: 1px solid #eee; ${index % 2 === 0 ? 'background: #f9f9f9;' : ''}">
                    <td style="padding: 3px 6px; border-right: 1px solid #eee;">${group.totalQuantity.toLocaleString()}</td>
                    <td style="padding: 3px 6px; text-align: right; border-right: 1px solid #eee; font-weight: bold;">$${group.price.toLocaleString()}</td>
                    <td style="padding: 3px 6px; text-align: center;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
                            <input type="checkbox" id="${rowId}" data-original-price="${group.price}" data-target-price="${targetPrice}" class="price-target-checkbox" style="margin: 0;">
                            <span style="font-size: 10px; color: #666;">$${targetPrice.toLocaleString()}</span>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        if (priceGroups.size > 50) {
            tableContent += `
                <tr>
                    <td colspan="3" style="padding: 6px; text-align: center; color: #666; font-style: italic;">
                        ... and ${priceGroups.size - 50} more price points
                    </td>
                </tr>
            `;
        }
        
        tableContent += `
                </tbody>
            </table>
            <div style="padding: 8px; background: #f8f9fa; border-top: 1px solid #dee2e6; font-size: 10px; color: #666;">
                <div><strong>Selected Targets:</strong></div>
                <div id="selected-targets" style="margin-top: 4px; min-height: 16px;">None selected</div>
                <div style="margin-top: 6px;">
                    <button id="clear-targets-btn" style="background: #dc3545; color: white; border: none; padding: 2px 6px; border-radius: 2px; cursor: pointer; font-size: 10px;">Clear All</button>
                </div>
            </div>
        `;
        
        return tableContent;
    }
    
    // Extract item data from HTML element
    function extractItemData(element) {
        const itemId = element.getAttribute('data-item');
        const category = element.getAttribute('data-category') || 'Unknown';
        const qty = element.getAttribute('data-qty') || '1';
        const sort = element.getAttribute('data-sort') || '';
        const equipped = element.getAttribute('data-equipped') === 'true';
        const armoryId = element.getAttribute('data-armoryid');
        
        // Try to get item name from various sources
        let itemName = sort;
        if (!itemName) {
            const nameElement = element.querySelector('.name-wrap span, .item-name, .tooltip-wrap');
            if (nameElement) {
                itemName = nameElement.textContent.trim();
            }
        }
        
        // Clean up item name - remove quantity prefix if present (e.g., "1 Xanax" -> "Xanax")
        if (itemName) {
            // Remove leading numbers and spaces (quantity information)
            itemName = itemName.replace(/^\d+\s+/, '').trim();
        }
        
        // Fallback if still no name found
        if (!itemName) {
            itemName = `Item ${itemId}`;
        }
        
        return {
            id: itemId,
            name: itemName,
            category: category,
            quantity: parseInt(qty) || 1,
            equipped: equipped,
            armoryId: armoryId,
            tradeable: isItemTradeable(itemId),
            element: element
        };
    }
    
    // Scan currently visible items
    function scanVisibleItems() {
        // Try to find the currently active inventory tab/container
        let itemElements = [];
        const isMarketPage = window.location.href.includes('/page.php?sid=ItemMarket');
        
        if (isMarketPage) {
            // Market page: look for inventory items in the add listing interface
            const marketSelectors = [
                '.items-list li[data-item]',           // Market inventory list
                '.item-list li[data-item]',            // Alternative market inventory
                '.inventory-items li[data-item]',      // Market inventory container
                '[data-reactroot] li[data-item]',      // React-based inventory
                '.market-inventory li[data-item]',     // Market-specific inventory
                'li[data-item][data-category]:not([data-action])'  // Fallback to standard
            ];
            
            for (const selector of marketSelectors) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    itemElements = elements;
                    break;
                }
            }
        } else {
            // Inventory page: use existing logic
            // Check for all-items container first
            const allItemsContainer = document.querySelector('#all-items');
            if (allItemsContainer && allItemsContainer.style.display !== 'none') {
                itemElements = allItemsContainer.querySelectorAll('li[data-item][data-category]:not([data-action])');
            } else {
                // If not in all-items, look for any visible inventory container with items
                const inventoryContainers = document.querySelectorAll('.inventory-wrap, .category-wrap, [id*="items"]');
                for (const container of inventoryContainers) {
                    if (container.style.display !== 'none' && !container.hidden) {
                        const containerItems = container.querySelectorAll('li[data-item][data-category]:not([data-action])');
                        if (containerItems.length > 0) {
                            itemElements = containerItems;
                            break;
                        }
                    }
                }
                
                // Fallback: scan any visible items on the page
                if (itemElements.length === 0) {
                    itemElements = document.querySelectorAll('li[data-item][data-category]:not([data-action])');
                }
            }
        }
        
        if (itemElements.length === 0) {
            const pageType = isMarketPage ? 'market page' : 'inventory page';
            log(`No items found in current view on ${pageType}`);
            return 0;
        }
        
        let newItems = 0;
        itemElements.forEach(element => {
            const itemData = extractItemData(element);
            if (itemData.id) {
                const key = `${itemData.id}_${itemData.armoryId || 'base'}`;
                if (!scannedItems.has(key)) {
                    scannedItems.set(key, itemData);
                    newItems++;
                }
            }
        });
        
        const pageType = isMarketPage ? 'market page' : 'inventory page';
        log(`Scanned ${newItems} new items from ${pageType} (Total: ${scannedItems.size})`);
        
        // Save scanned items to localStorage
        if (newItems > 0) {
            saveScannedItems();
        }
        
        return newItems;
    }
    
    // Save scanned items to localStorage
    function saveScannedItems() {
        try {
            const itemsArray = Array.from(scannedItems.values());
            localStorage.setItem(STORAGE_KEY, JSON.stringify(itemsArray));
            log(`Saved ${itemsArray.length} items to localStorage`);
        } catch (error) {
            log(`Failed to save items: ${error.message}`);
        }
    }
    
    // Navigate to all-items tab
    async function navigateToAllItems() {
        const allItemsTab = document.querySelector('a[href="#all-items"], #ui-id-1');
        if (allItemsTab) {
            log('Clicking all-items tab');
            allItemsTab.click();
            await sleep(1000);
            return true;
        }
        
        // Check if we're already on all-items
        const allItemsContainer = document.querySelector('#all-items');
        if (allItemsContainer && allItemsContainer.classList.contains('ui-tabs-panel')) {
            log('Already on all-items tab');
            return true;
        }
        
        log('Could not find all-items tab');
        return false;
    }
    
    // Check for new items without auto-scrolling
    function checkForNewItems() {
        // Just scan what's currently visible without scrolling
        return scanVisibleItems();
    }
    
    // Handle market price fetching for filtered items only
    async function handleFetchFilteredPrices() {
        const marketBtn = document.getElementById('fetch-filtered-prices');
        const statusDiv = document.getElementById('scan-status');
        
        // Safety check - make sure button exists
        if (!marketBtn) {
            log('Error: fetch-filtered-prices button not found');
            return;
        }
        
        // Reset button state if it was stuck
        if (marketBtn.disabled && marketBtn.textContent !== 'Fetching...') {
            log('Resetting stuck button state');
            marketBtn.disabled = false;
            marketBtn.textContent = 'Get Filtered Prices';
        }
        
        // Prevent multiple simultaneous executions
        if (marketBtn.disabled) {
            log('Filtered price fetch already in progress');
            return;
        }
        
        if (!apiKey) {
            if (statusDiv) {
                statusDiv.innerHTML = '<span style="color: #dc3545;">Please save an API key first</span>';
            }
            return;
        }

        if (scannedItems.size === 0) {
            if (statusDiv) {
                statusDiv.innerHTML = '<span style="color: #dc3545;">No items to fetch prices for. Scan items first.</span>';
            }
            return;
        }

        // Get only the filtered/visible items
        const filteredItems = getFilteredItems();
        const tradeableFilteredItems = filteredItems.filter(item => item.tradeable === true);
        
        // Debug logging to help identify the issue
        const tradeableTrue = filteredItems.filter(item => item.tradeable === true);
        const tradeableFalse = filteredItems.filter(item => item.tradeable === false);
        const tradeableNull = filteredItems.filter(item => item.tradeable === null);
        
        log(`Filtered price fetch debug: Filtered items: ${filteredItems.length}, Tradeable (true): ${tradeableTrue.length}, Non-tradeable (false): ${tradeableFalse.length}, Unknown (null): ${tradeableNull.length}`);
        log(`API Items Data available: ${apiItemsData ? 'Yes (' + Object.keys(apiItemsData).length + ' items)' : 'No'}`);
        log(`API Key available: ${apiKey ? 'Yes' : 'No'}`);
        
        if (tradeableFilteredItems.length === 0) {
            let errorMessage = 'No tradeable items in current filter to fetch prices for';
            
            if (!apiKey) {
                errorMessage = 'No API key found. Please save your API key first, then scan items again.';
            } else if (!apiItemsData) {
                errorMessage = 'API item data not loaded. Please check your API key and try scanning items again.';
            } else if (tradeableNull.length > 0) {
                errorMessage = `Found ${tradeableNull.length} filtered items with unknown tradeable status. API data may be incomplete.`;
            }
            
            if (statusDiv) {
                statusDiv.innerHTML = `<span style="color: #ffc107;">${errorMessage}</span>`;
            }
            return;
        }

        log(`Starting filtered price fetch for ${tradeableFilteredItems.length} items`);
        log('First few items to process:', tradeableFilteredItems.slice(0, 3).map(item => `${item.name} (${item.id})`));

        // Reset any stuck queue state
        if (isProcessingQueue) {
            log('Resetting stuck queue state');
            isProcessingQueue = false;
            apiRequestQueue.length = 0;
        }

        // Reset API counters if they seem stuck
        const now = Date.now();
        if (now - apiRequestResetTime > 120000) { // If reset time is more than 2 minutes old
            log('Resetting API request counters');
            apiRequestCount = 0;
            apiRequestResetTime = now;
        }

        marketBtn.disabled = true;
        marketBtn.textContent = 'Fetching...';

        let processed = 0;
        let errors = 0;
        const total = tradeableFilteredItems.length;
        const startTime = Date.now();
        const maxProcessingTime = 1800000; // 30 minutes maximum

        try {
            for (const item of tradeableFilteredItems) {
                // Check for timeout
                if (Date.now() - startTime > maxProcessingTime) {
                    log('Filtered market price fetching timed out after 30 minutes');
                    if (statusDiv) {
                        statusDiv.innerHTML = '<span style="color: #ffc107;">Filtered market price fetching timed out after 30 minutes. Processed ' + processed + '/' + total + ' items.</span>';
                    }
                    break;
                }

                try {
                    if (statusDiv) {
                        statusDiv.innerHTML = `Fetching filtered market data: ${processed + 1}/${total} (${item.name})`;
                    }

                    log(`Making fresh API request for item ${processed + 1}/${total}: ${item.name} (ID: ${item.id})`);

                    // Always force fresh API requests for filtered prices
                    const requestPromise = queueMarketDataRequest(item.id, true); // Force fresh
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error('Individual request timeout')), 120000); // 2 minutes per request
                    });

                    await Promise.race([requestPromise, timeoutPromise]);
                    processed++;
                    
                    log(`Successfully fetched fresh data for: ${item.name}`);

                } catch (error) {
                    errors++;
                    log(`Error fetching market data for ${item.name}: ${error.message}`);
                    
                    // Continue processing other items even if one fails
                    if (error.message.includes('rate limit') || error.message.includes('timeout')) {
                        // For rate limit errors, wait longer before continuing
                        await sleep(5000); // 5 second pause for rate limits
                    } else {
                        await sleep(1000); // 1 second pause for other errors
                    }
                }
            }

            if (statusDiv) {
                const successRate = Math.round((processed / total) * 100);
                statusDiv.innerHTML = `<span style="color: #28a745;">Filtered market data fetch complete: ${processed}/${total} items (${successRate}% success)</span>`;
            }

            // Update table to show the new market data
            updateTableDisplay();

        } catch (error) {
            log(`Filtered market data fetch failed: ${error.message}`);
            if (statusDiv) {
                statusDiv.innerHTML = `<span style="color: #dc3545;">Filtered market data fetch failed: ${error.message}</span>`;
            }
        } finally {
            // Ensure button is always re-enabled
            if (marketBtn) {
                marketBtn.disabled = false;
                marketBtn.textContent = 'Get Filtered Prices';
            }
            
            // Reset queue state to prevent hanging
            isProcessingQueue = false;
            
            // Clear any pending status after 5 seconds
            setTimeout(() => {
                if (statusDiv && statusDiv.innerHTML.includes('Filtered market data fetch')) {
                    updateTableDisplay(); // This will restore the normal status display
                }
            }, 5000);
            
            log('Filtered price fetch completed and button state reset');
        }
    }
    
    // Function to update market button text with item count
    function updateMarketButtonText() {
        const marketBtn = document.getElementById('fetch-market-prices');
        if (marketBtn && scannedItems.size > 0) {
            marketBtn.textContent = `Get ${scannedItems.size} item prices`;
        } else if (marketBtn) {
            marketBtn.textContent = 'Get Market Prices';
        }
    }
    
    // Create floating table to display results
    function createFloatingTable() {
        if (floatingTable) {
            floatingTable.remove();
        }
        
        // Load saved window state
        const windowState = loadWindowState();
        
        floatingTable = document.createElement('div');
        floatingTable.id = 'inventory-scanner-table';
        floatingTable.style.position = 'fixed';
        floatingTable.style.left = windowState.x + 'px';
        floatingTable.style.top = windowState.y + 'px';
        floatingTable.style.width = windowState.width || WINDOW_DEFAULT_WIDTH;
        floatingTable.style.height = windowState.height || WINDOW_DEFAULT_HEIGHT;
        floatingTable.style.minWidth = WINDOW_MIN_WIDTH;
        floatingTable.style.minHeight = WINDOW_MIN_HEIGHT;
        floatingTable.style.maxWidth = '90vw';
        floatingTable.style.maxHeight = '90vh';
        floatingTable.style.background = '#fff';
        floatingTable.style.border = '2px solid #333';
        floatingTable.style.borderRadius = '8px';
        floatingTable.style.zIndex = '100000';
        floatingTable.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        floatingTable.style.resize = 'both';
        floatingTable.style.overflow = 'hidden';
        floatingTable.innerHTML = `
                <div id="header-drag" class="title-bar" style="background: #333; color: #fff; padding: 10px; border-radius: 6px 6px 0 0; cursor: move; display: flex; justify-content: space-between; align-items: center; user-select: none;">
                    <span id="window-title" style="cursor: pointer; flex: 1;">Scrap2Mark</span>
                    <div style="display: flex; align-items: center;">
                        <button id="close-table" style="background: none; border: none; color: #fff; cursor: pointer; font-size: 14px; line-height: 1; padding: 2px;">✕</button>
                    </div>
                </div>
                <div id="table-content" style="padding: 10px; height: calc(100% - 50px); overflow-y: auto; display: flex; flex-direction: column;">
                    <div id="api-controls" style="margin-bottom: 10px; padding: 6px; background: #f8f9fa; border-radius: 4px;">
                        <div style="display: flex; gap: 6px; align-items: center;">
                            <input type="text" id="api-key-input" placeholder="Insert API key here" autocomplete="on" name="api_key" style="flex: 1; padding: 4px 6px; border: 1px solid #ccc; border-radius: 3px; font-size: 11px; font-family: monospace;">
                            <button id="save-api-key" style="background: #17a2b8; color: white; border: none; padding: 4px 12px; border-radius: 3px; cursor: pointer; font-size: 11px; white-space: nowrap;">Save</button>
                            <button id="logout-api-key" style="background: #dc3545; color: white; border: none; padding: 4px 12px; border-radius: 3px; cursor: pointer; font-size: 11px; white-space: nowrap; display: none;">Logout</button>
                            <button id="fetch-api-data" style="background: #ffc107; color: black; border: none; padding: 4px 12px; border-radius: 3px; cursor: pointer; font-size: 11px; white-space: nowrap; display: none;">Fetch</button>
                        </div>
                        <div style="font-size: 9px; color: #666; min-height: 12px; margin-top: 4px;">
                            <span id="api-status"></span>
                        </div>
                    </div>
                    <div style="margin-bottom: 10px; padding: 6px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px;">
                        <div style="display: flex; gap: 6px; align-items: center; justify-content: space-between;">
                            <span style="font-size: 10px; color: #856404;">
                                <strong>Having issues?</strong> Reset clears all stored data and settings.
                            </span>
                            <button id="full-reset-btn" style="background: #dc3545; color: white; border: none; padding: 4px 10px; border-radius: 3px; cursor: pointer; font-size: 10px; font-weight: bold;">Full Reset</button>
                        </div>
                    </div>
                    <div id="scan-controls" style="margin-bottom: 10px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
                        <!-- Scanning Group -->
                        <div style="display: flex; gap: 3px; margin-right: 12px;">
                            <button id="start-scan" style="background: linear-gradient(135deg, #28a745, #20c997); color: white; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; height: 32px; font-weight: 500; box-shadow: 0 2px 4px rgba(40,167,69,0.3); transition: all 0.2s ease;">Scan Inventory</button>
                            <button id="clear-data" style="background: linear-gradient(135deg, #dc3545, #e74c3c); color: white; border: none; padding: 6px 8px; border-radius: 6px; cursor: pointer; height: 32px; font-size: 12px; box-shadow: 0 2px 4px rgba(220,53,69,0.3); transition: all 0.2s ease;">✗</button>
                        </div>
                        
                        <!-- Price Fetching Group -->
                        <div style="display: flex; gap: 3px; margin-right: 12px;">
                            <button id="fetch-market-prices" style="background: linear-gradient(135deg, #ffc107, #ffb300); color: black; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; height: 32px; font-weight: 500; box-shadow: 0 2px 4px rgba(255,193,7,0.3); transition: all 0.2s ease;">Get Market Prices</button>
                            <button id="clear-market-cache" style="background: linear-gradient(135deg, #dc3545, #e74c3c); color: white; border: none; padding: 6px 8px; border-radius: 6px; cursor: pointer; height: 32px; font-size: 12px; box-shadow: 0 2px 4px rgba(220,53,69,0.3); transition: all 0.2s ease;">✗</button>
                        </div>
                        
                        <div style="display: flex; gap: 3px; margin-right: 12px;">
                            <button id="fetch-filtered-prices" style="background: linear-gradient(135deg, #6f42c1, #8e44ad); color: white; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; height: 32px; font-weight: 500; box-shadow: 0 2px 4px rgba(111,66,193,0.3); transition: all 0.2s ease;">Get Filtered Prices</button>
                        </div>
                        
                        <!-- Market Actions Group -->
                        <div style="display: flex; gap: 3px;">
                            <button id="post-market-button" style="background: linear-gradient(135deg, #17a2b8, #3498db); color: white; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; height: 32px; font-weight: 500; box-shadow: 0 2px 4px rgba(23,162,184,0.3); transition: all 0.2s ease;">Fill Market Forms</button>
                            <button id="clear-price-targets" style="background: linear-gradient(135deg, #dc3545, #e74c3c); color: white; border: none; padding: 6px 8px; border-radius: 6px; cursor: pointer; height: 32px; font-size: 12px; box-shadow: 0 2px 4px rgba(220,53,69,0.3); transition: all 0.2s ease;">✗</button>
                        </div>
                    </div>
                    <div id="scroll-reminder" style="margin-bottom: 10px; font-size: 11px; color: #666; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 8px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="color: #856404; font-weight: bold;">⚠️ IMPORTANT:</span>
                            <span style="color: #856404;">Scroll down to load ALL items before using the tools</span>
                        </div>
                        <div style="margin-top: 4px; font-size: 10px; color: #6c6c6c;">
                            <strong>Loading Progress:</strong> <span id="loading-progress">Checking...</span> | 
                            <strong>Tip:</strong> Keep scrolling until no new items appear.
                        </div>
                    </div>
                    <div id="scan-status" style="margin-bottom: 10px; font-weight: bold;"></div>
                    <div style="flex: 1; overflow-y: auto; min-height: 200px;">
                        <div style="margin-bottom: 10px;">
                            <div style="display: flex; align-items: center; margin-bottom: 5px; flex-wrap: wrap; gap: 10px;">
                                <h4 style="margin: 0; font-size: 14px;">Scanned Items:</h4>
                                <label style="display: flex; align-items: center; font-size: 12px; cursor: pointer;">
                                    <input type="checkbox" id="show-non-tradeable" style="margin-right: 4px;">
                                    Show non-tradeable
                                </label>
                                <label style="display: flex; align-items: center; font-size: 12px; cursor: pointer;">
                                    <input type="checkbox" id="show-ignored" style="margin-right: 4px;">
                                    Show ignored items
                                </label>
                                <label style="display: flex; align-items: center; font-size: 12px; cursor: pointer;">
                                    <input type="checkbox" id="hide-low-value" checked style="margin-right: 4px;">
                                    Hide below $
                                    <input type="text" id="min-value-input" value="5,000,000" style="width: 70px; margin-left: 4px; padding: 2px; border: 1px solid #ccc; border-radius: 2px; font-size: 11px;" placeholder="5000000">
                                </label>
                            </div>
                            <table id="all-items-table" style="width: 100%; border-collapse: collapse; font-size: 12px; table-layout: fixed;">
                                <thead>
                                    <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
                                        <th id="header-name" style="padding: 8px; text-align: left; border: 1px solid #dee2e6; cursor: pointer; user-select: none;">
                                            Name <span id="sort-name" style="float: right;">↕</span>
                                        </th>
                                        <th id="header-category" style="padding: 8px; text-align: center; border: 1px solid #dee2e6; width: 80px; cursor: pointer; user-select: none;">
                                            Category <span id="sort-category" style="float: right;">↕</span>
                                        </th>
                                        <th id="header-qty" style="padding: 8px; text-align: center; border: 1px solid #dee2e6; width: 40px; cursor: pointer; user-select: none;">
                                            Qty <span id="sort-qty" style="float: right;">↕</span>
                                        </th>
                                        <th id="trade-column-header" style="padding: 8px; text-align: center; border: 1px solid #dee2e6; width: 50px; cursor: pointer; user-select: none; display: none;">
                                            Trade <span id="sort-trade" style="float: right;">↕</span>
                                        </th>
                                        <th id="header-price" style="padding: 8px; text-align: center; border: 1px solid #dee2e6; width: 70px; cursor: pointer; user-select: none;">
                                            Price <span id="sort-price" style="float: right;">↕</span>
                                        </th>
                                        <th id="header-estimated" style="padding: 8px; text-align: center; border: 1px solid #dee2e6; width: 90px; cursor: pointer; user-select: none;">
                                            Est. Value <span id="sort-estimated" style="float: right;">↕</span>
                                        </th>
                                        <th style="padding: 8px; text-align: center; border: 1px solid #dee2e6; width: 50px;">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="items-table-body">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(floatingTable);
        
        // Make draggable
        let isDragging = false;
        let dragStarted = false;
        let currentX, currentY, initialX, initialY;
        const header = document.getElementById('header-drag');
        const windowTitle = document.getElementById('window-title');
        
        function startDrag(e) {
            e.preventDefault();
            isDragging = true;
            dragStarted = false;
            
            // Get the current position of the floating table
            const rect = floatingTable.getBoundingClientRect();
            
            // Calculate offset from mouse to top-left corner of element
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            
            document.addEventListener('mousemove', doDrag);
            document.addEventListener('mouseup', stopDrag);
        }
        
        function doDrag(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            // Mark that dragging has actually started (mouse moved)
            if (!dragStarted) {
                dragStarted = true;
            }
            
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            // Keep the window within the viewport
            const maxX = window.innerWidth - floatingTable.offsetWidth;
            const maxY = window.innerHeight - floatingTable.offsetHeight;
            
            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));
            
            floatingTable.style.left = currentX + 'px';
            floatingTable.style.top = currentY + 'px';
            floatingTable.style.right = 'auto'; // Remove right positioning when dragging
        }
        
        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
            
            // Save position when drag ends (but keep existing dimensions)
            const rect = floatingTable.getBoundingClientRect();
            saveWindowState(rect.left, rect.top, windowState.width || WINDOW_DEFAULT_WIDTH, windowState.height || WINDOW_DEFAULT_HEIGHT, isMinimized());
        }
        
        function handleTitleClick(e) {
            // Only toggle minimize if we didn't actually drag
            if (!dragStarted) {
                toggleMinimize();
            }
        }
        
        function handleHeaderClick(e) {
            // Only toggle minimize if we didn't actually drag and didn't click on close button
            if (!dragStarted && e.target.id !== 'close-table') {
                toggleMinimize();
            }
        }
        
        function toggleMinimize() {
            const content = document.getElementById('table-content');
            if (content.style.display === 'none') {
                // Restoring from minimized state
                content.style.display = 'flex';
                floatingTable.style.width = windowState.width || WINDOW_DEFAULT_WIDTH;
                floatingTable.style.height = windowState.height || WINDOW_DEFAULT_HEIGHT;
                floatingTable.style.resize = 'both';
                // Restore normal constraints
                floatingTable.style.minWidth = WINDOW_MIN_WIDTH;
                floatingTable.style.minHeight = WINDOW_MIN_HEIGHT;
                floatingTable.style.maxWidth = '90vw';
                floatingTable.style.maxHeight = '90vh';
            } else {
                // Minimizing
                content.style.display = 'none';
                floatingTable.style.width = WINDOW_MINIMIZED_WIDTH;
                floatingTable.style.height = WINDOW_MINIMIZED_HEIGHT;
                floatingTable.style.resize = 'none';
                // Override constraints for minimized state
                floatingTable.style.minWidth = WINDOW_MINIMIZED_WIDTH;
                floatingTable.style.minHeight = WINDOW_MINIMIZED_HEIGHT;
                floatingTable.style.maxWidth = WINDOW_MINIMIZED_WIDTH;
                floatingTable.style.maxHeight = WINDOW_MINIMIZED_HEIGHT;
            }
            
            // Save minimized state
            const rect = floatingTable.getBoundingClientRect();
            saveWindowState(rect.left, rect.top, windowState.width || WINDOW_DEFAULT_WIDTH, windowState.height || WINDOW_DEFAULT_HEIGHT, content.style.display === 'none');
        }
        
        function isMinimized() {
            const content = document.getElementById('table-content');
            return content && content.style.display === 'none';
        }
        
        header.addEventListener('mousedown', startDrag);
        header.addEventListener('mouseup', handleHeaderClick);
        
        // Restore minimized state
        if (windowState.minimized) {
            const content = document.getElementById('table-content');
            if (content) {
                content.style.display = 'none';
                floatingTable.style.width = WINDOW_MINIMIZED_WIDTH;
                floatingTable.style.height = WINDOW_MINIMIZED_HEIGHT;
                floatingTable.style.resize = 'none';
                // Force the size override any stored dimensions
                floatingTable.style.minWidth = WINDOW_MINIMIZED_WIDTH;
                floatingTable.style.minHeight = WINDOW_MINIMIZED_HEIGHT;
                floatingTable.style.maxWidth = WINDOW_MINIMIZED_WIDTH;
                floatingTable.style.maxHeight = WINDOW_MINIMIZED_HEIGHT;
            }
        } else {
            // Ensure resize is enabled for normal state and restore constraints
            floatingTable.style.resize = 'both';
            floatingTable.style.minWidth = WINDOW_MIN_WIDTH;
            floatingTable.style.minHeight = WINDOW_MIN_HEIGHT;
            floatingTable.style.maxWidth = '90vw';
            floatingTable.style.maxHeight = '90vh';
        }
        
        // Add resize observer to save window state when resized
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    const rect = entry.target.getBoundingClientRect();
                    
                    // Only update dimensions if not minimized
                    if (!isMinimized()) {
                        windowState.width = rect.width + 'px';
                        windowState.height = rect.height + 'px';
                        // Debounce the save operation
                        clearTimeout(floatingTable.resizeTimeout);
                        floatingTable.resizeTimeout = setTimeout(() => {
                            saveWindowState(rect.left, rect.top, rect.width + 'px', rect.height + 'px', isMinimized());
                        }, 500);
                    }
                }
            });
            resizeObserver.observe(floatingTable);
        }
        
        // Event listeners
        document.getElementById('close-table').addEventListener('click', () => {
            floatingTable.remove();
            floatingTable = null;
        });
        
        document.getElementById('start-scan').addEventListener('click', startInventoryScan);
        document.getElementById('clear-data').addEventListener('click', () => {
            if (confirm('Clear all scanned inventory data? This cannot be undone.')) {
                clearInventoryData();
            }
        });
        document.getElementById('post-market-button').addEventListener('click', handlePostToMarket);
        document.getElementById('save-api-key').addEventListener('click', handleSaveApiKey);
        document.getElementById('logout-api-key').addEventListener('click', handleLogoutApiKey);
        document.getElementById('fetch-api-data').addEventListener('click', handleFetchApiData);
        document.getElementById('show-non-tradeable').addEventListener('change', () => {
            updateTableDisplay();
            saveFilterState(getCurrentFilterState());
        });
        document.getElementById('show-ignored').addEventListener('change', () => {
            updateTableDisplay();
            saveFilterState(getCurrentFilterState());
        });
        document.getElementById('hide-low-value').addEventListener('change', () => {
            updateTableDisplay();
            saveFilterState(getCurrentFilterState());
        });
        document.getElementById('min-value-input').addEventListener('input', () => {
            updateTableDisplay();
            saveFilterState(getCurrentFilterState());
        });
        document.getElementById('fetch-market-prices').addEventListener('click', handleFetchMarketPrices);
        
        // Add event listener for filtered prices button with retry mechanism
        const attachFilteredPricesListener = () => {
            const filteredPricesBtn = document.getElementById('fetch-filtered-prices');
            if (filteredPricesBtn) {
                filteredPricesBtn.addEventListener('click', handleFetchFilteredPrices);
                log('Event listener attached to fetch-filtered-prices button');
                return true;
            } else {
                log('fetch-filtered-prices button not found, retrying...');
                return false;
            }
        };
        
        // Try to attach immediately, then retry if needed
        if (!attachFilteredPricesListener()) {
            // If button not found, try again after a short delay
            setTimeout(() => {
                if (!attachFilteredPricesListener()) {
                    log('Warning: Could not attach event listener to fetch-filtered-prices button');
                }
            }, 100);
        }
        
        document.getElementById('clear-market-cache').addEventListener('click', () => {
            if (confirm('Clear market price cache? This will remove all cached market data.')) {
                handleClearMarketCache();
            }
        });
        document.getElementById('clear-price-targets').addEventListener('click', () => {
            if (confirm('Clear all price targets? This will remove all selected prices for market posting.')) {
                clearAllPriceTargets();
            }
        });
        
        // Full reset button
        document.getElementById('full-reset-btn').addEventListener('click', handleFullReset);
        
        // Add column header event listeners for sorting
        document.getElementById('header-name').addEventListener('click', () => sortTableDynamic('name'));
        document.getElementById('header-category').addEventListener('click', () => sortTableDynamic('category'));
        document.getElementById('header-qty').addEventListener('click', () => sortTableDynamic('qty'));
        document.getElementById('trade-column-header').addEventListener('click', () => sortTableDynamic('trade'));
        document.getElementById('header-price').addEventListener('click', () => sortTableDynamic('price'));
        document.getElementById('header-estimated').addEventListener('click', () => sortTableDynamic('estimated'));
        
        // Load ignored items from storage
        loadIgnoredItems();
        
        // Load and apply filter state
        const filterState = loadFilterState();
        applyFilterState(filterState);
        
        // Update scroll reminder initially
        updateScrollReminder();
        
        // Set up periodic reminder updates when user scrolls
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateScrollReminder, 1000); // Update 1 second after scrolling stops
        });
        
        updateTableDisplay();
    }
    
    // Handle API key saving
    function handleSaveApiKey() {
        const apiKeyInput = document.getElementById('api-key-input');
        const apiStatus = document.getElementById('api-status');
        
        const key = apiKeyInput.value.trim();
        if (!key) {
            apiStatus.textContent = 'Please enter an API key';
            apiStatus.style.color = '#dc3545';
            return;
        }
        
        saveApiKey(key);
        apiKeyInput.value = '';
        apiStatus.textContent = 'API key saved!';
        apiStatus.style.color = '#28a745';
        
        // Update button visibility
        updateApiButtonVisibility();
        
        // Auto-fetch API data if needed (after saving new API key)
        setTimeout(() => {
            const lastFetch = localStorage.getItem('scrap2mark_last_api_fetch');
            const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
            
            if (!lastFetch || parseInt(lastFetch) < oneDayAgo || !apiItemsData) {
                log('Auto-fetching API data after API key save');
                handleFetchApiData().then(() => {
                    localStorage.setItem('scrap2mark_last_api_fetch', Date.now().toString());
                }).catch(error => {
                    log('Auto-fetch failed after API key save: ' + error.message);
                });
            } else {
                log('API data is recent, skipping auto-fetch');
            }
        }, 1000); // Small delay to let the UI update
        
        setTimeout(() => {
            updateApiStatusDisplay();
        }, 3000);
    }
    
    // Handle API key logout
    function handleLogoutApiKey() {
        // Clear API key from storage
        localStorage.removeItem(API_KEY_STORAGE_KEY);
        localStorage.removeItem(API_KEY_EXPIRY_STORAGE_KEY);
        apiKey = null;
        
        const apiStatus = document.getElementById('api-status');
        apiStatus.textContent = 'Logged out successfully';
        apiStatus.style.color = '#28a745';
        
        // Update button visibility
        updateApiButtonVisibility();
        
        setTimeout(() => {
            updateApiStatusDisplay();
        }, 3000);
    }
    
    // Update API button visibility based on key status
    function updateApiButtonVisibility() {
        const saveBtn = document.getElementById('save-api-key');
        const logoutBtn = document.getElementById('logout-api-key');
        const apiKeyInput = document.getElementById('api-key-input');
        
        if (apiKey) {
            saveBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
            if (apiKeyInput) {
                apiKeyInput.placeholder = 'API key is saved';
                apiKeyInput.disabled = true;
                apiKeyInput.style.backgroundColor = '#f8f9fa';
                apiKeyInput.style.color = '#6c757d';
            }
        } else {
            saveBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
            if (apiKeyInput) {
                apiKeyInput.placeholder = 'Insert API key here';
                apiKeyInput.disabled = false;
                apiKeyInput.style.backgroundColor = '#fff';
                apiKeyInput.style.color = '#000';
            }
        }
    }
    
    // Handle API data fetching
    async function handleFetchApiData() {
        const apiStatus = document.getElementById('api-status');
        const fetchBtn = document.getElementById('fetch-api-data');
        
        if (!apiKey) {
            if (apiStatus) {
                apiStatus.textContent = 'Please save an API key first';
                apiStatus.style.color = '#dc3545';
            }
            log('Cannot fetch API data: No API key available');
            return;
        }
        
        // Only disable button if it exists (auto-fetch may not have button)
        if (fetchBtn) {
            fetchBtn.disabled = true;
        }
        
        if (apiStatus) {
            apiStatus.textContent = 'Fetching items data...';
            apiStatus.style.color = '#17a2b8';
        }
        
        log('Starting API data fetch...');
        
        try {
            await fetchItemsFromAPI(apiKey);
            
            const itemCount = apiItemsData ? Object.keys(apiItemsData).length : 0;
            log(`API data fetch successful: ${itemCount} items loaded`);
            
            if (apiStatus) {
                apiStatus.textContent = `Items data fetched successfully! (${itemCount} items)`;
                apiStatus.style.color = '#28a745';
            }
            
            // Update display if we have scanned items
            updateTableDisplay();
            
        } catch (error) {
            log(`Failed to fetch API data: ${error.message}`);
            if (apiStatus) {
                apiStatus.textContent = `Error: ${error.message}`;
                apiStatus.style.color = '#dc3545';
            }
        } finally {
            if (fetchBtn) {
                fetchBtn.disabled = false;
            }
            
            // Clear status message after delay (only if it's not an error)
            if (apiStatus && !apiStatus.textContent.includes('Error:')) {
                setTimeout(() => {
                    updateApiStatusDisplay();
                }, 5000);
            }
        }
    }
    
    // Handle market price fetching
    async function handleFetchMarketPrices() {
        const marketBtn = document.getElementById('fetch-market-prices');
        const statusDiv = document.getElementById('scan-status');
        
        if (!apiKey) {
            if (statusDiv) {
                statusDiv.innerHTML = '<span style="color: #dc3545;">Please save an API key first</span>';
            }
            return;
        }
        
        if (scannedItems.size === 0) {
            if (statusDiv) {
                statusDiv.innerHTML = '<span style="color: #dc3545;">No items to fetch prices for. Scan items first.</span>';
            }
            return;
        }
        
        // Reset any stuck queue state
        if (isProcessingQueue) {
            log('Resetting stuck queue state');
            isProcessingQueue = false;
            apiRequestQueue.length = 0; // Clear any pending requests
        }
        
        // Reset API counters if they seem stuck
        const now = Date.now();
        if (now - apiRequestResetTime > 120000) { // If reset time is more than 2 minutes old
            log('Resetting API request counters');
            apiRequestCount = 0;
            apiRequestResetTime = now;
        }
        
        marketBtn.disabled = true;
        marketBtn.textContent = 'Fetching...';
        
        const tradeableItems = Array.from(scannedItems.values()).filter(item => item.tradeable === true);
        
        // Debug logging to help identify the issue
        const allItems = Array.from(scannedItems.values());
        const tradeableTrue = allItems.filter(item => item.tradeable === true);
        const tradeableFalse = allItems.filter(item => item.tradeable === false);
        const tradeableNull = allItems.filter(item => item.tradeable === null);
        
        log(`Market price fetch debug: Total items: ${allItems.length}, Tradeable (true): ${tradeableTrue.length}, Non-tradeable (false): ${tradeableFalse.length}, Unknown (null): ${tradeableNull.length}`);
        log(`API Items Data available: ${apiItemsData ? 'Yes (' + Object.keys(apiItemsData).length + ' items)' : 'No'}`);
        log(`API Key available: ${apiKey ? 'Yes' : 'No'}`);
        
        if (tradeableItems.length === 0) {
            let errorMessage = 'No tradeable items found to fetch prices for';
            
            if (!apiKey) {
                errorMessage = 'No API key found. Please save your API key first, then scan items again.';
            } else if (!apiItemsData) {
                errorMessage = 'API item data not loaded. Please check your API key and try scanning items again.';
            } else if (tradeableNull.length > 0) {
                errorMessage = `Found ${tradeableNull.length} items with unknown tradeable status. API data may be incomplete.`;
            }
            
            if (statusDiv) {
                statusDiv.innerHTML = `<span style="color: #ffc107;">${errorMessage}</span>`;
            }
            marketBtn.disabled = false;
            updateMarketButtonText();
            return;
        }
        
        let processed = 0;
        let errors = 0;
        const total = tradeableItems.length;
        const startTime = Date.now();
        const maxProcessingTime = 1800000; // 30 minutes maximum (increased from 5 minutes)
        
        try {
            for (let i = 0; i < tradeableItems.length; i++) {
                const item = tradeableItems[i];
                
                // Check for timeout (but much more generous now)
                if (Date.now() - startTime > maxProcessingTime) {
                    log('Market price fetching timed out after 30 minutes');
                    if (statusDiv) {
                        statusDiv.innerHTML = '<span style="color: #ffc107;">Market price fetching timed out after 30 minutes. Processed ' + processed + '/' + total + ' items.</span>';
                    }
                    break;
                }
                
                try {
                    if (statusDiv) {
                        statusDiv.innerHTML = `Fetching market data: ${processed + 1}/${total} (${item.name})`;
                    }
                    
                    // Add timeout for individual requests (increased to 2 minutes)
                    const requestPromise = queueMarketDataRequest(item.id);
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error('Individual request timeout')), 120000); // 2 minutes per request
                    });
                    
                    await Promise.race([requestPromise, timeoutPromise]);
                    processed++;
                    
                    // Yield control to UI every 10 items to prevent freezing
                    if (i % 10 === 0 && i > 0) {
                        await new Promise(resolve => setTimeout(resolve, 10));
                    }
                    
                } catch (error) {
                    errors++;
                    log(`Failed to fetch market data for item ${item.id}: ${error.message}`);
                    
                    // Only stop on critical errors that won't recover
                    if (error.message.includes('Daily API read limit') ||
                        error.message.includes('IP temporarily blocked')) {
                        log('Critical API error encountered, stopping fetch process');
                        if (statusDiv) {
                            statusDiv.innerHTML = `<span style="color: #dc3545;">Critical API error: ${error.message}. Processed ${processed}/${total} items.</span>`;
                        }
                        break;
                    }
                    
                    // For rate limiting, wait a bit longer but continue
                    if (error.message.includes('Rate limit') || error.message.includes('Throttling timeout')) {
                        log('Rate limit hit, waiting 30 seconds before continuing...');
                        if (statusDiv) {
                            statusDiv.innerHTML = `Rate limited. Waiting 30s... (${processed}/${total} completed)`;
                        }
                        await sleep(30000); // Wait 30 seconds
                    }
                }
                
                // Update table periodically
                if (processed % 5 === 0) {
                    updateTableDisplay();
                }
            }
            
            updateTableDisplay();
            
            if (statusDiv) {
                if (errors > 0) {
                    statusDiv.innerHTML = `<span style="color: #ffc107;">Market data fetch completed: ${processed}/${total} successful, ${errors} errors</span>`;
                } else {
                    statusDiv.innerHTML = `<span style="color: #28a745;">Market data fetch completed: ${processed}/${total} items processed</span>`;
                }
            }
            
        } catch (error) {
            log(`Market data fetch failed: ${error.message}`);
            if (statusDiv) {
                statusDiv.innerHTML = `<span style="color: #dc3545;">Market data fetch failed: ${error.message}</span>`;
            }
        } finally {
            marketBtn.disabled = false;
            updateMarketButtonText();
            
            // Reset queue state to prevent hanging
            isProcessingQueue = false;
            
            setTimeout(() => {
                if (statusDiv && statusDiv.innerHTML.includes('Market data fetch')) {
                    updateTableDisplay(); // This will restore the normal status display
                }
            }, 5000);
        }
    }

    // Reset API state (useful for debugging hanging issues)
    function resetApiState() {
        log('Resetting API state');
        isProcessingQueue = false;
        apiRequestQueue.length = 0;
        apiRequestCount = 0;
        apiRequestResetTime = Date.now();
        lastApiRequest = 0;
    }
    
    // Clear sort state
    function clearSortState() {
        currentSortColumn = -1;
        currentSortDirection = 'asc';
        currentSortField = null;
        
        // Clear all sort indicators
        ['name', 'category', 'qty', 'trade', 'price', 'estimated'].forEach(col => {
            const indicator = document.getElementById(`sort-${col}`);
            if (indicator) indicator.textContent = '↕';
        });
    }
    
    // Handle clear market cache
    function handleClearMarketCache() {
        const clearBtn = document.getElementById('clear-market-cache');
        const statusDiv = document.getElementById('scan-status');
        
        // Clear market data from memory and storage
        marketData.clear();
        localStorage.removeItem(MARKET_DATA_STORAGE_KEY);
        localStorage.removeItem(MARKET_EXPIRY_STORAGE_KEY);
        
        // Also reset API state to prevent any stuck conditions
        resetApiState();
        
        // Update display
        updateTableDisplay();
        
        if (statusDiv) {
            statusDiv.innerHTML = '<span style="color: #28a745;">Market cache cleared successfully</span>';
            setTimeout(() => {
                updateTableDisplay(); // This will restore the normal status display
            }, 3000);
        }
        
        log('Market cache cleared and API state reset');
    }
    
    // Handle full reset - clears all stored data and settings
    function handleFullReset() {
        const confirmMessage = `⚠️ FULL RESET WARNING ⚠️

This will permanently delete ALL stored data:
• Scanned items and inventory data
• API key and cached API data  
• Market price cache and settings
• Ignored items list
• Window position and filter settings
• Price targets and selections

You will need to:
1. Re-enter your API key
2. Re-scan your inventory
3. Re-configure your preferences

This action CANNOT be undone!

Type "RESET" (all caps) to confirm:`;

        const userInput = prompt(confirmMessage);
        
        if (userInput === "RESET") {
            try {
                // Clear all localStorage data related to the script
                const keysToRemove = [
                    STORAGE_KEY,
                    API_KEY_STORAGE_KEY,
                    API_DATA_STORAGE_KEY,
                    API_EXPIRY_STORAGE_KEY,
                    API_KEY_EXPIRY_STORAGE_KEY,
                    WINDOW_STATE_STORAGE_KEY,
                    MARKET_DATA_STORAGE_KEY,
                    MARKET_EXPIRY_STORAGE_KEY,
                    IGNORED_ITEMS_STORAGE_KEY,
                    FILTER_STATE_STORAGE_KEY
                ];
                
                keysToRemove.forEach(key => {
                    localStorage.removeItem(key);
                });
                
                // Also clear any price target data (they use dynamic keys with item IDs)
                const allKeys = Object.keys(localStorage);
                allKeys.forEach(key => {
                    if (key.startsWith('scrap2mark_price_targets_')) {
                        localStorage.removeItem(key);
                    }
                });
                
                // Clear memory variables
                scannedItems.clear();
                ignoredItems.clear();
                marketData.clear();
                apiItemsData = null;
                apiKey = null;
                currentSortColumn = -1;
                currentSortDirection = 'asc';
                currentSortField = null;
                
                // Reset API state
                resetApiState();
                
                // Close and recreate the floating table with default settings
                if (floatingTable) {
                    floatingTable.style.display = 'none';
                    floatingTable.remove();
                    floatingTable = null;
                }
                
                // Show success message
                alert('✅ Full reset completed successfully!\n\nThe script has been reset to its initial state. The window will now reload with default settings.');
                
                // Reinitialize the script
                setTimeout(() => {
                    createFloatingTable();
                    updateApiStatusDisplay();
                    updateApiButtonVisibility();
                    log('Script reinitialized after full reset');
                }, 500);
                
            } catch (error) {
                alert(`❌ Reset failed: ${error.message}\n\nPlease refresh the page and try again.`);
                log('Full reset failed: ' + error.message);
            }
        } else if (userInput !== null) {
            alert('Reset cancelled. You must type "RESET" exactly to confirm.');
        }
        // If userInput is null, user clicked Cancel, so do nothing
    }
    
    // Update table display
    function updateTableDisplay() {
        if (!floatingTable) {
            log('Warning: floatingTable not found in updateTableDisplay');
            return;
        }
        
        const tbody = document.getElementById('items-table-body');
        const statusDiv = document.getElementById('scan-status');
        const showNonTradeableCheckbox = document.getElementById('show-non-tradeable');
        const showIgnoredCheckbox = document.getElementById('show-ignored');
        const hideLowValueCheckbox = document.getElementById('hide-low-value');
        const minValueInput = document.getElementById('min-value-input');
        
        if (!tbody) {
            log('Warning: items-table-body not found in updateTableDisplay');
            return;
        }
        
        tbody.innerHTML = '';
        
        const showNonTradeable = showNonTradeableCheckbox ? showNonTradeableCheckbox.checked : false;
        const showIgnored = showIgnoredCheckbox ? showIgnoredCheckbox.checked : false;
        const hideLowValue = hideLowValueCheckbox ? hideLowValueCheckbox.checked : false;
        const minValue = minValueInput ? parseFloat(minValueInput.value.replace(/[,$]/g, '')) || 0 : 0;
        
        // Toggle Trade column visibility based on checkbox state
        const tradeColumnHeader = document.getElementById('trade-column-header');
        
        if (tradeColumnHeader) {
            tradeColumnHeader.style.display = showNonTradeable ? 'table-cell' : 'none';
        }
        
        // Sort items using current sort state or default sorting
        const sortedItems = applySortToItems(Array.from(scannedItems.values()));
        
        let tradeableCount = 0;
        let nonTradeableCount = 0;
        let ignoredCount = 0;
        let displayedCount = 0;
        let hiddenLowValueCount = 0;
        
        sortedItems.forEach(item => {
            const itemId = item.id || 'N/A';
            const itemName = item.name || 'Unknown';
            const itemCategory = item.category || 'Unknown';
            const itemQuantity = item.quantity || 0;
            const itemTradeable = item.tradeable;
            const itemIgnored = isItemIgnored(itemId);
            
            // Count all items
            if (itemTradeable === true) {
                tradeableCount++;
            } else if (itemTradeable === false) {
                nonTradeableCount++;
            }
            
            if (itemIgnored) {
                ignoredCount++;
            }
            
            // Filter display based on checkboxes
            if (!showNonTradeable && itemTradeable === false) {
                return; // Skip non-tradeable items when checkbox is unchecked
            }
            
            if (!showIgnored && itemIgnored) {
                return; // Skip ignored items when checkbox is unchecked
            }
            
            // Calculate estimated value for low-value filtering
            const estimatedValueForFilter = calculateEstimatedValue(itemId, itemQuantity);
            
            // Filter by minimum value if enabled (only hide items that have a calculated value)
            if (hideLowValue && estimatedValueForFilter > 0 && estimatedValueForFilter < minValue) {
                hiddenLowValueCount++;
                return; // Skip low-value items when checkbox is checked
            }
            
            displayedCount++;
            
            // Determine tradeable status display and row styling
            let tradeableDisplay = '';
            let tradeableColor = '#666';
            let rowStyle = '';
            
            if (itemIgnored) {
                rowStyle = 'background-color: #f0f0f0; opacity: 0.7;'; // Gray background for ignored items
            } else if (itemTradeable === true) {
                tradeableDisplay = '✓';
                tradeableColor = '#28a745';
            } else if (itemTradeable === false) {
                tradeableDisplay = '✗';
                tradeableColor = '#dc3545';
                rowStyle = 'background-color: #f8d7da;'; // Light red background for non-tradeable
            } else {
                tradeableDisplay = '?';
                tradeableColor = '#ffc107';
            }
            
            // Override trade display for ignored items
            if (itemIgnored) {
                tradeableDisplay = itemTradeable === true ? '✓' : itemTradeable === false ? '✗' : '?';
            }
            
            // Get market data for price display
            let priceDisplay = '';
            const marketInfo = marketData.get(itemId.toString());
            
            if (marketInfo && itemTradeable === true) {
                const stats = calculatePriceStats(marketInfo.listings);
                if (stats) {
                    const chart = createPriceChart(marketInfo.listings);
                    const age = Math.round((Date.now() - marketInfo.timestamp) / (1000 * 60)); // age in minutes
                    const ageText = age < 60 ? `${age}m` : `${Math.round(age / 60)}h`;
                    const outliersText = stats.outliersFiltered > 0 ? ` (${stats.outliersFiltered} high outliers, ${stats.sellersFiltered} sellers filtered)` : '';
                    
                    // Use a price closer to low end - take the lower of P25 or 20% above minimum
                    const lowPrice = Math.min(stats.p25, stats.min * 1.2);
                    const displayPrice = Math.round(lowPrice);
                    
                    const tooltip = `Display: $${displayPrice.toLocaleString()} (Low-end price)\nMin: $${stats.min.toLocaleString()}\nMax: $${stats.max.toLocaleString()}\nAvg: $${Math.round(stats.average).toLocaleString()}\nMedian: $${stats.median.toLocaleString()}\nQ1-Q3: $${stats.p25.toLocaleString()}-$${stats.p75.toLocaleString()}\nSellers: ${stats.uniqueSellers}/${stats.totalUniqueSellers}\nListings: ${stats.listings}${outliersText}\nFiltered: ${stats.priceCapFiltered} 10x+ prices, ${stats.statFiltered} statistical\nTotal Qty: ${stats.totalQuantity.toLocaleString()}\nAge: ${ageText}`;
                    
                    priceDisplay = `
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="font-size: 9px; color: #666;">$${displayPrice.toLocaleString()}</div>
                            <div class="price-chart-hover" data-item-id="${itemId}" data-item-name="${itemName}" style="cursor: help;">${chart}</div>
                        </div>
                    `;
                }
            } else if (itemTradeable === true) {
                priceDisplay = '<div style="font-size: 9px; color: #999; text-align: center;">No data</div>';
            } else {
                priceDisplay = '<div style="font-size: 9px; color: #999; text-align: center;">-</div>';
            }
            
            // Calculate estimated value
            const estimatedValue = calculateEstimatedValue(itemId, itemQuantity);
            const estimatedValueDisplay = estimatedValue > 0 ? `$${Math.round(estimatedValue).toLocaleString()}` : '-';
            
            // Create action button (ignore)
            const ignoreButtonText = itemIgnored ? 'Unignore' : 'Ignore';
            const ignoreButtonClass = itemIgnored ? 'ignore-btn unignore' : 'ignore-btn ignore';
            
            // Create row
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid #dee2e6';
            row.style.cssText += rowStyle;
            row.innerHTML = `
                <td style="padding: 4px; border: 1px solid #dee2e6; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${itemName}">${itemName}</td>
                <td style="padding: 4px; border: 1px solid #dee2e6; text-align: center;">${itemCategory}</td>
                <td style="padding: 4px; border: 1px solid #dee2e6; text-align: center;">${itemQuantity}</td>
                <td class="trade-column-cell" style="padding: 4px; border: 1px solid #dee2e6; color: ${tradeableColor}; font-weight: bold; text-align: center; display: none;">${tradeableDisplay}</td>
                <td style="padding: 2px; border: 1px solid #dee2e6; text-align: center;">${priceDisplay}</td>
                <td style="padding: 4px; border: 1px solid #dee2e6; text-align: center; font-weight: bold; color: ${estimatedValue > 0 ? '#28a745' : '#666'};">${estimatedValueDisplay}</td>
                <td style="padding: 4px; border: 1px solid #dee2e6; text-align: center;">
                    <button class="${ignoreButtonClass}" data-item-id="${itemId}">${ignoreButtonText}</button>
                </td>
            `;
            
            // Add event listener to the ignore button
            const ignoreButton = row.querySelector('.ignore-btn');
            if (ignoreButton) {
                ignoreButton.addEventListener('click', () => {
                    toggleIgnoreItem(itemId);
                });
            }
            
            tbody.appendChild(row);
        });
        
        // Update Trade column cell visibility for all rows
        const tradeColumnCells = document.querySelectorAll('.trade-column-cell');
        tradeColumnCells.forEach(cell => {
            cell.style.display = showNonTradeable ? 'table-cell' : 'none';
        });
        
        const unknownCount = sortedItems.length - tradeableCount - nonTradeableCount;
        const filterText = showNonTradeable ? '' : ' (filtered)';
        
        // Status line: Total, Tradeable, and conditionally Non-Tradeable/Unknown/Ignored/Low-Value
        let statusHtml = `Total: ${displayedCount}${filterText} | <span style="color: #28a745;">Tradeable: ${tradeableCount}</span>`;
        
        if (showNonTradeable && (nonTradeableCount > 0 || unknownCount > 0)) {
            statusHtml += ` | <span style="color: #dc3545;">Non-Tradeable: ${nonTradeableCount}</span> | <span style="color: #ffc107;">Unknown: ${unknownCount}</span>`;
        }
        
        if (ignoredCount > 0) {
            statusHtml += ` | <span style="color: #6c757d;">Ignored: ${ignoredCount}</span>`;
        }
        
        if (hiddenLowValueCount > 0) {
            statusHtml += ` | <span style="color: #17a2b8;">Low-Value Hidden: ${hiddenLowValueCount}</span>`;
        }
        
        if (statusDiv) {
            statusDiv.innerHTML = statusHtml;
        } else {
            log('Warning: scan-status element not found, unable to update status display');
        }
        
        // Add hover popup functionality for price charts (with small delay to ensure DOM is updated)
        setTimeout(() => {
            addPriceChartHoverHandlers();
            
            // Restore sort indicators after table update
            if (currentSortField && currentSortColumn !== -1) {
                // Clear all sort indicators
                ['name', 'category', 'qty', 'trade', 'price', 'estimated'].forEach(col => {
                    const indicator = document.getElementById(`sort-${col}`);
                    if (indicator) indicator.textContent = '↕';
                });
                
                // Set current sort indicator
                const currentIndicator = document.getElementById(`sort-${currentSortField}`);
                if (currentIndicator) {
                    currentIndicator.textContent = currentSortDirection === 'asc' ? '↑' : '↓';
                }
            }
        }, 10);
    }
    
    // Global timeout for popup hiding
    let globalHideTimeout;
    
    // Add hover popup functionality
    function addPriceChartHoverHandlers() {
        const priceCharts = document.querySelectorAll('.price-chart-hover');
        
        priceCharts.forEach(chart => {
            let showTimeout;
            
            chart.addEventListener('mouseenter', (e) => {
                // Clear any existing hide timeout
                if (globalHideTimeout) {
                    clearTimeout(globalHideTimeout);
                    globalHideTimeout = null;
                }
                
                // Capture the data immediately before the timeout
                const itemId = e.currentTarget.getAttribute('data-item-id');
                const itemName = e.currentTarget.getAttribute('data-item-name');
                const mouseEvent = { clientX: e.clientX, clientY: e.clientY };
                
                // Show popup after 300ms delay (reduced for faster response)
                showTimeout = setTimeout(() => {
                    const marketInfo = marketData.get(itemId);
                    
                    if (marketInfo && marketInfo.listings) {
                        showPricePopup(mouseEvent, marketInfo.listings, itemName, itemId);
                    }
                }, 300);
            });
            
            chart.addEventListener('mouseleave', () => {
                // Clear show timeout if still pending
                if (showTimeout) {
                    clearTimeout(showTimeout);
                    showTimeout = null;
                }
                
                // Hide popup after 2 seconds delay (increased to allow easier access to popup)
                globalHideTimeout = setTimeout(() => {
                    hidePricePopup();
                }, 2000);
            });
        });
    }
    
    // Update existing popup with new chart content
    function updatePricePopup(listings, itemName, zoomMin = null, zoomMax = null) {
        const popup = document.getElementById('price-popup');
        if (!popup) return;
        
        // Update the content with new chart
        popup.innerHTML = createDetailedPriceChart(listings, itemName, zoomMin, zoomMax);
        
        // Re-add chart interaction handlers after content update
        addChartInteraction(listings, itemName);
        
        // Re-add panel handlers after content update
        addPanelHandlers();
        
        // Keep popup in same general position but adjust if needed
        const rect = popup.getBoundingClientRect();
        let left = rect.left;
        let top = rect.top;
        
        // Adjust if popup would go off screen after content change
        const newRect = popup.getBoundingClientRect();
        if (left + newRect.width > window.innerWidth) {
            left = window.innerWidth - newRect.width - 10;
        }
        if (top + newRect.height > window.innerHeight) {
            top = window.innerHeight - newRect.height - 10;
        }
        if (left < 0) left = 10;
        if (top < 0) top = 10;
        
        popup.style.left = left + 'px';
        popup.style.top = top + 'px';
    }
    
    // Show detailed price popup
    function showPricePopup(event, listings, itemName, itemId, zoomMin = null, zoomMax = null) {
        // Load stored price targets for this item
        loadPriceTargets(itemId);
        
        // Remove existing popup
        hidePricePopup();
        
        const popup = document.createElement('div');
        popup.id = 'price-popup';
        popup.innerHTML = createDetailedPriceChart(listings, itemName, zoomMin, zoomMax);
        popup.style.position = 'fixed';
        popup.style.zIndex = '1000000';
        popup.style.maxWidth = '350px';
        popup.style.pointerEvents = 'auto';
        
        // Make popup interactive
        popup.addEventListener('mouseenter', () => {
            // Cancel any pending hide timeouts when hovering over popup
            if (globalHideTimeout) {
                clearTimeout(globalHideTimeout);
                globalHideTimeout = null;
            }
        });
        
        popup.addEventListener('mouseleave', () => {
            // Hide popup when leaving popup area
            globalHideTimeout = setTimeout(() => {
                hidePricePopup();
            }, 500);
        });
        
        document.body.appendChild(popup);
        
        // Position popup near mouse but keep it in viewport
        const rect = popup.getBoundingClientRect();
        let left = event.clientX + 10;
        let top = event.clientY + 10;
        
        // Adjust if popup would go off screen
        if (left + rect.width > window.innerWidth) {
            left = event.clientX - rect.width - 10;
        }
        if (top + rect.height > window.innerHeight) {
            top = event.clientY - rect.height - 10;
        }
        if (left < 0) left = 10;
        if (top < 0) top = 10;
        
        popup.style.left = left + 'px';
        popup.style.top = top + 'px';
        
        // Add chart interaction handlers after popup is added to DOM
        addChartInteraction(listings, itemName);
        
        // Add panel expansion handlers
        addPanelHandlers();
    }
    
    // Add panel interaction handlers (simplified for integrated layout)
    function addPanelHandlers() {
        // No expand/collapse buttons needed anymore since listings are integrated
        const clearBtn = document.getElementById('clear-targets-btn');
        
        // Add event listeners for price target checkboxes
        const checkboxes = document.querySelectorAll('.price-target-checkbox');
        checkboxes.forEach(checkbox => {
            const originalPrice = parseFloat(checkbox.getAttribute('data-original-price'));
            
            // Restore checkbox state from stored data
            if (selectedPriceTargets.has(originalPrice)) {
                checkbox.checked = true;
            }
            
            checkbox.addEventListener('change', (e) => {
                const originalPrice = parseFloat(e.target.getAttribute('data-original-price'));
                const targetPrice = parseFloat(e.target.getAttribute('data-target-price'));
                const isChecked = e.target.checked;
                
                togglePriceTarget(originalPrice, targetPrice, isChecked);
            });
        });
        
        // Update the display with loaded targets
        updateSelectedTargetsDisplay();
        
        // Add event listeners for control buttons
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                clearAllTargets();
            });
        }
    }
    
    // Global storage for selected price targets (persistent across sessions)
    let selectedPriceTargets = new Map();
    let currentItemId = null;
    
    // Load price targets from localStorage
    function loadPriceTargets(itemId) {
        currentItemId = itemId;
        const storageKey = `scrap2mark_price_targets_${itemId}`;
        const stored = localStorage.getItem(storageKey);
        
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                selectedPriceTargets = new Map(Object.entries(parsed).map(([k, v]) => [parseFloat(k), v]));
            } catch (e) {
                selectedPriceTargets = new Map();
            }
        } else {
            selectedPriceTargets = new Map();
        }
    }
    
    // Save price targets to localStorage
    function savePriceTargets() {
        if (!currentItemId) return;
        
        const storageKey = `scrap2mark_price_targets_${currentItemId}`;
        const toStore = Object.fromEntries(selectedPriceTargets.entries());
        localStorage.setItem(storageKey, JSON.stringify(toStore));
    }
    
    // Toggle price target selection
    function togglePriceTarget(originalPrice, targetPrice, isSelected) {
        if (isSelected) {
            selectedPriceTargets.set(originalPrice, targetPrice);
        } else {
            selectedPriceTargets.delete(originalPrice);
        }
        updateSelectedTargetsDisplay();
        savePriceTargets();
    }
    
    // Update the display of selected targets
    function updateSelectedTargetsDisplay() {
        const targetDiv = document.getElementById('selected-targets');
        if (!targetDiv) return;
        
        if (selectedPriceTargets.size === 0) {
            targetDiv.innerHTML = 'None selected';
            targetDiv.style.color = '#666';
        } else {
            const targets = Array.from(selectedPriceTargets.entries())
                .sort((a, b) => a[1] - b[1]) // Sort by target price
                .map(([original, target]) => `$${target.toLocaleString()}`)
                .join(', ');
            targetDiv.innerHTML = targets;
            targetDiv.style.color = '#28a745';
        }
    }
    
    // Clear all selected targets
    function clearAllTargets() {
        selectedPriceTargets.clear();
        // Uncheck all checkboxes
        const checkboxes = document.querySelectorAll('.price-target-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = false;
        });
        updateSelectedTargetsDisplay();
        savePriceTargets();
    }
    
    // Make functions global so they can be called from HTML
    window.togglePriceTarget = togglePriceTarget;
    window.clearAllTargets = clearAllTargets;
    
    // Add chart interaction functionality
    function addChartInteraction(listings, itemName) {
        const svg = document.getElementById('price-chart-svg');
        const selectionRect = document.getElementById('selection-rect');
        const resetZoomBtn = document.getElementById('reset-zoom');
        
        if (!svg || !selectionRect) return;
        
        let isSelecting = false;
        let startX = 0;
        let currentX = 0;
        
        // Get chart parameters
        const padding = parseInt(svg.getAttribute('data-padding'));
        const chartWidth = parseInt(svg.getAttribute('data-chart-width'));
        const chartHeight = parseInt(svg.getAttribute('data-chart-height'));
        const displayMin = parseFloat(svg.getAttribute('data-display-min'));
        const displayMax = parseFloat(svg.getAttribute('data-display-max'));
        
        // Add bar hover effects
        const bars = svg.querySelectorAll('.chart-bar');
        bars.forEach(bar => {
            bar.addEventListener('mouseenter', (e) => {
                const priceMin = parseFloat(e.target.getAttribute('data-price-min'));
                const priceMax = parseFloat(e.target.getAttribute('data-price-max'));
                const amount = parseInt(e.target.getAttribute('data-amount'));
                
                // Show tooltip for individual bar
                e.target.setAttribute('opacity', '1');
                e.target.style.cursor = 'pointer';
                
                // Create temporary tooltip
                const tooltip = document.createElement('div');
                tooltip.id = 'bar-tooltip';
                tooltip.innerHTML = `$${Math.round(priceMin).toLocaleString()}-$${Math.round(priceMax).toLocaleString()}<br>Quantity: ${amount.toLocaleString()}`;
                tooltip.style.position = 'absolute';
                tooltip.style.background = 'rgba(0,0,0,0.8)';
                tooltip.style.color = 'white';
                tooltip.style.padding = '4px 8px';
                tooltip.style.borderRadius = '4px';
                tooltip.style.fontSize = '11px';
                tooltip.style.pointerEvents = 'none';
                tooltip.style.zIndex = '1000001';
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = (rect.left + rect.width / 2 + window.pageXOffset) + 'px';
                tooltip.style.top = (rect.top - 40 + window.pageYOffset) + 'px';
                tooltip.style.transform = 'translateX(-50%)';
                
                document.body.appendChild(tooltip);
            });
            
            bar.addEventListener('mouseleave', (e) => {
                e.target.setAttribute('opacity', '0.7');
                const tooltip = document.getElementById('bar-tooltip');
                if (tooltip) tooltip.remove();
            });
        });
        
        // Selection functionality
        svg.addEventListener('mousedown', (e) => {
            const rect = svg.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Only start selection if within chart area
            if (x >= padding && x <= padding + chartWidth && y >= padding && y <= padding + chartHeight) {
                isSelecting = true;
                startX = x;
                currentX = x;
                
                selectionRect.style.display = 'block';
                selectionRect.setAttribute('x', startX);
                selectionRect.setAttribute('y', padding);
                selectionRect.setAttribute('width', 0);
                selectionRect.setAttribute('height', chartHeight);
                
                e.preventDefault();
            }
        });
        
        svg.addEventListener('mousemove', (e) => {
            if (!isSelecting) return;
            
            const rect = svg.getBoundingClientRect();
            currentX = Math.max(padding, Math.min(padding + chartWidth, e.clientX - rect.left));
            
            const width = Math.abs(currentX - startX);
            const x = Math.min(startX, currentX);
            
            selectionRect.setAttribute('x', x);
            selectionRect.setAttribute('width', width);
        });
        
        svg.addEventListener('mouseup', (e) => {
            if (!isSelecting) return;
            
            isSelecting = false;
            selectionRect.style.display = 'none';
            
            // Calculate price range for zoom
            const minX = Math.min(startX, currentX);
            const maxX = Math.max(startX, currentX);
            
            // Only zoom if selection is wide enough
            if (maxX - minX > 10) {
                const priceRange = displayMax - displayMin;
                const zoomMin = displayMin + ((minX - padding) / chartWidth) * priceRange;
                const zoomMax = displayMin + ((maxX - padding) / chartWidth) * priceRange;
                
                // Update popup with zoomed chart (keep existing popup)
                updatePricePopup(listings, itemName, zoomMin, zoomMax);
            }
        });
        
        // Reset zoom functionality
        if (resetZoomBtn) {
            resetZoomBtn.addEventListener('click', () => {
                // Reset zoom (keep existing popup)
                updatePricePopup(listings, itemName);
            });
        }
        
        // Prevent selection outside chart area
        document.addEventListener('mouseup', () => {
            if (isSelecting) {
                isSelecting = false;
                selectionRect.style.display = 'none';
            }
        });
    }
    
    // Hide price popup
    function hidePricePopup() {
        const existingPopup = document.getElementById('price-popup');
        if (existingPopup) {
            existingPopup.remove();
        }
    }
    
    // Clear inventory data
    function clearInventoryData() {
        scannedItems.clear();
        localStorage.removeItem(STORAGE_KEY);
        updateTableDisplay();
        updateMarketButtonText();
        log('Inventory data cleared');
    }
    
    // Clear all price targets
    function clearAllPriceTargets() {
        // Get all localStorage keys that start with our price target prefix
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('scrap2mark_price_targets_')) {
                keysToRemove.push(key);
            }
        }
        
        // Remove all price target keys
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Update the display to reflect changes
        updateTableDisplay();
        log(`Cleared ${keysToRemove.length} price targets`);
    }
    
    // Export inventory data
    // Get selected price targets for an item
    function getSelectedPriceTargets(itemId) {
        const storageKey = `scrap2mark_price_targets_${itemId}`;
        const stored = localStorage.getItem(storageKey);
        
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                return Object.entries(parsed).map(([price, data]) => ({
                    price: parseFloat(price),
                    seller: data.seller,
                    amount: data.amount
                }));
            } catch (e) {
                return [];
            }
        }
        return [];
    }

    // Export inventory data with enhanced information
    function exportInventoryData() {
        const data = Array.from(scannedItems.values()).map(item => {
            const itemData = {
                id: item.id,
                name: item.name,
                category: item.category,
                quantity: item.quantity,
                equipped: item.equipped,
                armoryId: item.armoryId,
                tradeable: item.tradeable
            };
            
            // Add market data if available
            const marketInfo = marketData.get(item.id.toString());
            if (marketInfo) {
                const stats = calculatePriceStats(marketInfo.listings);
                if (stats) {
                    // Calculate the low-end price used in the Price column
                    const lowPrice = Math.min(stats.p25, stats.min * 1.2);
                    const displayPrice = Math.round(lowPrice);
                    
                    // Calculate estimated value
                    const estimatedValue = calculateEstimatedValue(item.id, item.quantity);
                    
                    itemData.marketData = {
                        displayPrice: displayPrice,  // The low-end price shown in Price column
                        averagePrice: Math.round(stats.average),
                        minPrice: stats.min,
                        maxPrice: stats.max,
                        medianPrice: stats.median,
                        q1Price: stats.p25,
                        q3Price: stats.p75,
                        estimatedTotalValue: estimatedValue,
                        totalListings: stats.totalListings,
                        filteredListings: stats.listings,
                        uniqueSellers: stats.uniqueSellers,
                        totalUniqueSellers: stats.totalUniqueSellers,
                        outliersFiltered: stats.outliersFiltered,
                        sellersFiltered: stats.sellersFiltered,
                        priceCapFiltered: stats.priceCapFiltered,
                        statFiltered: stats.statFiltered,
                        totalQuantity: stats.totalQuantity,
                        fetchedAt: new Date(marketInfo.timestamp).toISOString(),
                        ageInMinutes: Math.round((Date.now() - marketInfo.timestamp) / (1000 * 60))
                    };
                }
            }
            
            // Add selected price targets if any
            const selectedTargets = getSelectedPriceTargets(item.id);
            if (selectedTargets.length > 0) {
                itemData.selectedPriceTargets = selectedTargets;
                
                // Calculate total value of selected targets
                const targetValue = selectedTargets.reduce((sum, target) => 
                    sum + (target.price * target.amount), 0);
                itemData.selectedTargetsTotalValue = targetValue;
                
                // Calculate how many of this item's quantity could be sold at target prices
                const targetQuantity = selectedTargets.reduce((sum, target) => 
                    sum + target.amount, 0);
                itemData.selectedTargetsQuantity = targetQuantity;
                
                if (targetQuantity > 0) {
                    itemData.averageTargetPrice = Math.round(targetValue / targetQuantity);
                }
            }
            
            return itemData;
        });
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        
        // Create export summary
        const totalItems = data.length;
        const itemsWithMarketData = data.filter(item => item.marketData).length;
        const itemsWithTargets = data.filter(item => item.selectedPriceTargets).length;
        const totalEstimatedValue = data.reduce((sum, item) => sum + (item.marketData?.estimatedTotalValue || 0), 0);
        const totalTargetValue = data.reduce((sum, item) => sum + (item.selectedTargetsTotalValue || 0), 0);
        
        // Add summary to export data
        const exportData = {
            exportInfo: {
                exportedAt: new Date().toISOString(),
                scriptVersion: "Scrap2Mark v2.0",
                totalItems: totalItems,
                itemsWithMarketData: itemsWithMarketData,
                itemsWithPriceTargets: itemsWithTargets,
                totalEstimatedValue: totalEstimatedValue,
                totalSelectedTargetValue: totalTargetValue,
                priceCalculationMethod: "Low-end pricing (min of P25 or 20% above minimum)"
            },
            items: data
        };
        
        // Create downloadable file
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `scrap2mark_export_${new Date().toISOString().split('T')[0]}_${totalItems}items.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        log(`Exported ${totalItems} items (${itemsWithMarketData} with market data, ${itemsWithTargets} with price targets) to ${exportFileDefaultName}. Total estimated value: $${totalEstimatedValue.toLocaleString()}`);
    }
    
    // Main scanning function (now only scans visible items)
    async function startInventoryScan() {
        if (isScanning) {
            log('Scan already in progress');
            return;
        }
        
        // Check for API key and warn user if not present
        if (!apiKey) {
            const statusDiv = document.getElementById('scan-status');
            if (statusDiv) {
                statusDiv.innerHTML = '<span style="color: #ffc107;">⚠️ No API key detected. Items will scan but tradeable status will be unknown. Save your API key first for full functionality.</span>';
            }
            log('Warning: Scanning without API key - tradeable status will be unknown');
        }
        
        isScanning = true;
        
        const startBtn = document.getElementById('start-scan');
        const statusDiv = document.getElementById('scan-status');
        
        if (startBtn) startBtn.disabled = true;
        if (statusDiv) statusDiv.textContent = 'Scanning visible items...';
        
        try {
            log('Starting inventory scan of visible items');
            
            // Wait for items to be loaded in current category
            await waitForElement('#all-items li[data-item], li[data-item]', 5000);
            
            // Scan currently visible items only
            const newItemsFound = checkForNewItems();
            updateTableDisplay();
            
            // Update scroll reminder based on current loading status
            updateScrollReminder();
            
            // Save scanned items after scanning
            saveScannedItems();
            
            log(`Scan completed. Found ${newItemsFound} new items (Total: ${scannedItems.size})`);
            updateMarketButtonText(); // Update button with new item count
            if (statusDiv) {
                // Show scan result temporarily, then update with full breakdown
                statusDiv.textContent = `Found ${newItemsFound} new items. Total: ${scannedItems.size} items`;
                setTimeout(() => {
                    updateTableDisplay(); // This will restore the detailed breakdown
                }, 2000);
            }
            
        } catch (error) {
            log(`Scan failed: ${error.message}`);
            if (statusDiv) statusDiv.textContent = `Scan failed: ${error.message}`;
        } finally {
            isScanning = false;
            if (startBtn) startBtn.disabled = false;
        }
    }
    
    // Load previously saved data
    function loadSavedData() {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                const items = JSON.parse(savedData);
                items.forEach(item => {
                    const key = `${item.id}_${item.armoryId || 'base'}`;
                    scannedItems.set(key, item);
                });
                log(`Loaded ${items.length} saved items`);
                
                // Update table display and button text after loading data
                setTimeout(() => {
                    updateTableDisplay();
                    updateMarketButtonText();
                }, 100);
            } else {
                log('No saved data found');
            }
        } catch (error) {
            log(`Failed to load saved data: ${error.message}`);
        }
    }
    
    // Initialize script
    function init() {
        log('Initializing Scrap2Mark');
        
        // Check if we're on a supported page
        const isInventoryPage = window.location.href.includes('/item.php');
        const isMarketPage = window.location.href.includes('/page.php?sid=ItemMarket');
        
        if (!isInventoryPage && !isMarketPage) {
            log('Not on supported page, script will not run');
            return;
        }
        
        // Set up network monitoring for item loading detection
        setupNetworkMonitoring();
        
        // Load API key and items data
        loadApiKey();
        loadApiItemsData();
        loadMarketData();
        
        // Auto-fetch API data once per day if we have an API key
        if (apiKey) {
            const lastFetch = localStorage.getItem('scrap2mark_last_api_fetch');
            const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
            
            if (!lastFetch || parseInt(lastFetch) < oneDayAgo || !apiItemsData) {
                log('Auto-fetching API data (daily update or missing data)');
                log(`Last fetch: ${lastFetch ? new Date(parseInt(lastFetch)).toLocaleString() : 'Never'}`);
                log(`API Items Data available: ${apiItemsData ? 'Yes' : 'No'}`);
                
                setTimeout(() => {
                    handleFetchApiData().then(() => {
                        localStorage.setItem('scrap2mark_last_api_fetch', Date.now().toString());
                        log('Auto-fetch completed successfully');
                    }).catch(error => {
                        log('Auto-fetch failed: ' + error.message);
                    });
                }, 2000); // Delay to let page load
            } else {
                log('API data is recent and available, skipping auto-fetch');
                log(`Last fetch: ${new Date(parseInt(lastFetch)).toLocaleString()}`);
            }
        } else {
            log('No API key available for auto-fetch');
        }
        
        // Load saved data and ignored items
        loadSavedData();
        loadIgnoredItems();
        
        // Update page-specific functionality
        if (isInventoryPage) {
            log('Running on inventory page - full scanning functionality available');
        } else if (isMarketPage) {
            log('Running on market page - posting functionality available');
            // Hide inventory-specific controls on market page
            setTimeout(() => {
                const scanControls = document.getElementById('scan-controls');
                if (scanControls) {
                    // Hide scan button but keep other controls
                    const startScanBtn = document.getElementById('start-scan');
                    if (startScanBtn) {
                        startScanBtn.style.display = 'none';
                    }
                    
                    // Update the manual instruction text
                    const manualText = floatingTable.querySelector('div[style*="font-size: 11px"]');
                    if (manualText && manualText.textContent.includes('Scroll down')) {
                        manualText.textContent = 'Market page: Use data from inventory scanning and price targets to post items.';
                    }
                }
            }, 1000);
        }
        
        // Create floating table (always available for data management)
        createFloatingTable();
        
        // Update API status display
        updateApiStatusDisplay();
        
        // Update button visibility
        updateApiButtonVisibility();
        
        // Add CSS for better styling
        const style = document.createElement('style');
        style.textContent = `
            #inventory-scanner-table button:hover {
                opacity: 0.8;
            }
            #inventory-scanner-table table th {
                position: sticky;
                top: 0;
                background: #f8f9fa;
            }
            /* Enhanced button hover effects for all styled buttons */
            button[style*="linear-gradient"]:hover {
                transform: translateY(-1px) !important;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
                filter: brightness(1.1) !important;
            }
            /* Title bar cursor styling */
            #inventory-scanner-table .title-bar,
            #inventory-scanner-table .title-bar * {
                cursor: pointer !important;
            }
            #inventory-scanner-table table tr:hover {
                background-color: #f8f9fa;
            }
            #api-key-input {
                font-family: monospace;
            }
            #inventory-scanner-table {
                resize: both;
                overflow: hidden;
            }
            #inventory-scanner-table table {
                table-layout: fixed;
                width: 100%;
            }
            #inventory-scanner-table table td {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            #inventory-scanner-table table td:nth-child(2) {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .price-chart-hover {
                transition: transform 0.2s ease;
            }
            .price-chart-hover:hover {
                transform: scale(1.1);
            }
            #price-popup {
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                border: 1px solid #ddd;
                animation: fadeIn 0.2s ease-out;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
            .ignore-btn {
                font-size: 10px !important;
                padding: 2px 6px !important;
                border: 1px solid #ccc !important;
                border-radius: 3px !important;
                cursor: pointer !important;
                transition: all 0.2s !important;
                font-weight: bold !important;
                min-width: 60px !important;
            }
            .ignore-btn.ignore {
                background: #6c757d !important;
                color: white !important;
                border-color: #6c757d !important;
            }
            .ignore-btn.ignore:hover {
                background: #5a6268 !important;
                border-color: #545b62 !important;
                transform: scale(1.05) !important;
            }
            .ignore-btn.unignore {
                background: #dc3545 !important;
                color: white !important;
                border-color: #dc3545 !important;
                animation: pulse 2s infinite !important;
            }
            .ignore-btn.unignore:hover {
                background: #c82333 !important;
                border-color: #bd2130 !important;
                transform: scale(1.05) !important;
                animation: none !important;
            }
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4); }
                70% { box-shadow: 0 0 0 6px rgba(220, 53, 69, 0); }
                100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
            }
        `;
        document.head.appendChild(style);
        
        log('Scrap2Mark initialized');
    }
    
    // Show toast notification
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: ${type === 'warning' ? '#212529' : 'white'};
            padding: 12px 16px;
            border-radius: 5px;
            z-index: 100002;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            max-width: 400px;
            word-wrap: break-word;
            animation: slideIn 0.3s ease-out;
        `;
        toast.textContent = message;
        
        // Add animation keyframes if not already added
        if (!document.querySelector('#toast-animations')) {
            const animationStyle = document.createElement('style');
            animationStyle.id = 'toast-animations';
            animationStyle.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(animationStyle);
        }
        
        document.body.appendChild(toast);
        
        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }
    
    // Load all price targets by item name
    function loadAllPriceTargets() {
        const allTargets = {};
        
        // Go through all scanned items and check for saved price targets
        for (const [key, item] of scannedItems) {
            // Extract item ID from the key (format: "itemId_armoryId")
            const itemId = key.split('_')[0];
            const storageKey = `scrap2mark_price_targets_${itemId}`;
            const stored = localStorage.getItem(storageKey);
            
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    const targets = new Map(Object.entries(parsed).map(([k, v]) => [parseFloat(k), v]));
                    
                    // Find the selected price target
                    for (const [price, isSelected] of targets) {
                        if (isSelected) {
                            allTargets[item.name] = {
                                selectedPrice: price,
                                itemId: itemId
                            };
                            break;
                        }
                    }
                } catch (e) {
                    // Silently ignore price target loading errors
                }
            }
        }
        
        return allTargets;
    }
    
    // Get filtered items based on current filter settings
    function getFilteredItems() {
        const showNonTradeableCheckbox = document.getElementById('show-non-tradeable');
        const showIgnoredCheckbox = document.getElementById('show-ignored');
        const hideLowValueCheckbox = document.getElementById('hide-low-value');
        const minValueInput = document.getElementById('min-value-input');
        
        const showNonTradeable = showNonTradeableCheckbox ? showNonTradeableCheckbox.checked : false;
        const showIgnored = showIgnoredCheckbox ? showIgnoredCheckbox.checked : false;
        const hideLowValue = hideLowValueCheckbox ? hideLowValueCheckbox.checked : false;
        const minValue = minValueInput ? parseFloat(minValueInput.value.replace(/[,$]/g, '')) || 0 : 0;
        
        // Get all items and apply filters
        const allItems = Array.from(scannedItems.values());
        
        return allItems.filter(item => {
            const itemId = item.id || 'N/A';
            const itemTradeable = item.tradeable;
            const itemIgnored = isItemIgnored(itemId);
            
            // Filter non-tradeable items
            if (!showNonTradeable && itemTradeable === false) {
                return false;
            }
            
            // Filter ignored items
            if (!showIgnored && itemIgnored) {
                return false;
            }
            
            // Filter low value items
            if (hideLowValue && itemTradeable === true) {
                const estimatedValue = calculateEstimatedValue(itemId, item.quantity);
                if (estimatedValue < minValue) {
                    return false;
                }
            }
            
            return true;
        });
    }
    
    // Market posting functionality
    async function handlePostToMarket() {
        // Check if all items are likely loaded first
        const loadingStatus = checkItemLoadingStatus();
        if (!loadingStatus.likelyAllLoaded) {
            const proceedAnyway = confirm(
                `⚠️ WARNING: Only ${loadingStatus.currentVisibleItems} items visible. ` +
                `You may not have loaded all your items yet.\n\n` +
                `For best results:\n` +
                `1. Scroll down to load ALL items\n` +
                `2. Scan visible items again\n` +
                `3. Get market prices\n` +
                `4. Then fill market forms\n\n` +
                `Do you want to proceed anyway with current items?`
            );
            
            if (!proceedAnyway) {
                return;
            }
        }
        
        // Auto-minimize the window when filling market forms
        const content = document.getElementById('table-content');
        if (content && content.style.display !== 'none') {
            log('Auto-minimizing Scrap2Mark window for better workflow');
            const windowState = loadWindowState();
            // Minimizing
            content.style.display = 'none';
            floatingTable.style.width = WINDOW_MINIMIZED_WIDTH;
            floatingTable.style.height = WINDOW_MINIMIZED_HEIGHT;
            floatingTable.style.resize = 'none';
            // Override constraints for minimized state
            floatingTable.style.minWidth = WINDOW_MINIMIZED_WIDTH;
            floatingTable.style.minHeight = WINDOW_MINIMIZED_HEIGHT;
            floatingTable.style.maxWidth = WINDOW_MINIMIZED_WIDTH;
            floatingTable.style.maxHeight = WINDOW_MINIMIZED_HEIGHT;
            
            // Save minimized state
            const rect = floatingTable.getBoundingClientRect();
            saveWindowState(rect.left, rect.top, windowState.width || WINDOW_DEFAULT_WIDTH, windowState.height || WINDOW_DEFAULT_HEIGHT, true);
            
            // Show a brief notification
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #17a2b8;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                z-index: 100002;
                font-size: 12px;
                font-weight: bold;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                max-width: 250px;
            `;
            toast.textContent = 'Scrap2Mark minimized - Click header to restore';
            document.body.appendChild(toast);
            
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 4000);
        }
        
        const filteredItems = getFilteredItems();
        const priceTargets = loadAllPriceTargets();
        
        const targetedItems = filteredItems.filter(item => {
            return priceTargets[item.name] && priceTargets[item.name].selectedPrice;
        });
        
        if (targetedItems.length === 0) {
            const totalItems = filteredItems.length;
            const priceTargetCount = Object.keys(priceTargets).length;
            showToast(`No items ready for posting. Found ${totalItems} filtered items, ${priceTargetCount} with price targets, but none match both criteria.`, 'warning');
            return;
        }
        
        // Check if we're on the market page
        if (!window.location.href.includes('/page.php?sid=ItemMarket')) {
            const result = confirm(`You need to be on the Item Market page to post items. Would you like to navigate there now?\n\nFound ${targetedItems.length} items ready to post.`);
            if (result) {
                window.location.href = '/page.php?sid=ItemMarket#/addListing';
            }
            return;
        }
        
        showPostToMarketDialog(targetedItems);
    }
    
    function showPostToMarketDialog(items) {
        // Create modal dialog
        const modalOverlay = document.createElement('div');
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: #2b2b2b;
            border-radius: 8px;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            padding: 20px;
            color: #e0e0e0;
            border: 1px solid #555;
        `;
        
        const priceTargets = loadAllPriceTargets();
        
        modal.innerHTML = `
            <h3 style="margin-top: 0; color: #17a2b8;">Fill Market Posting Forms</h3>
            <p>This will automatically fill the quantity and price fields for ${items.length} items with price targets.</p>
            <p style="font-size: 12px; color: #ffc107; background: #333; padding: 8px; border-radius: 4px; margin: 10px 0;">
                ⚠️ <strong>Note:</strong> This tool fills the forms but does NOT automatically submit them. 
                You will need to manually review and submit each listing for compliance with Torn.com's terms.
            </p>
            
            <div style="max-height: 400px; overflow-y: auto; margin: 20px 0;">
                ${items.map(item => {
                    const target = priceTargets[item.name];
                    const itemQty = item.quantity || item.qty || 1;
                    return `
                        <div style="display: flex; align-items: center; padding: 10px; border: 1px solid #444; margin-bottom: 5px; border-radius: 4px;">
                            <div style="flex: 1;">
                                <strong>${item.name}</strong><br>
                                <small>Available: ${itemQty} | Target Price: $${target.selectedPrice?.toLocaleString()}</small>
                            </div>
                            <div style="margin-left: 10px; min-width: 140px;">
                                <label style="font-size: 12px; display: block; margin-bottom: 5px;">Quantity to post:</label>
                                <div style="display: flex; flex-wrap: wrap; gap: 3px; margin-bottom: 5px;">
                                    <button class="qty-btn-add" data-item="${item.name.replace(/"/g, '&quot;')}" data-qty="1" style="padding: 4px 8px; font-size: 11px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">+1</button>
                                    <button class="qty-btn-add" data-item="${item.name.replace(/"/g, '&quot;')}" data-qty="10" style="padding: 4px 8px; font-size: 11px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">+10</button>
                                    <button class="qty-btn-add" data-item="${item.name.replace(/"/g, '&quot;')}" data-qty="100" style="padding: 4px 8px; font-size: 11px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">+100</button>
                                    <button class="qty-btn-add" data-item="${item.name.replace(/"/g, '&quot;')}" data-qty="1000" style="padding: 4px 8px; font-size: 11px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">+1k</button>
                                    <button class="qty-btn" data-item="${item.name.replace(/"/g, '&quot;')}" data-qty="${itemQty}" style="padding: 4px 8px; font-size: 11px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer;">Max</button>
                                    <button class="qty-btn-reset" data-item="${item.name.replace(/"/g, '&quot;')}" style="padding: 4px 8px; font-size: 11px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">✗</button>
                                </div>
                                <input type="number" id="qty-${item.name.replace(/"/g, '&quot;').replace(/[^a-zA-Z0-9]/g, '_')}" min="0" max="${itemQty}" value="0" style="width: 100%; padding: 4px; background: #444; color: #e0e0e0; border: 1px solid #666; border-radius: 3px; font-size: 12px;">
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <button id="confirm-post" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 10px;">Fill Forms</button>
                <button id="cancel-post" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Cancel</button>
            </div>
        `;
        
        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);
        
        // Add event listeners for quantity buttons
        modal.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemName = btn.dataset.item;
                const qty = parseInt(btn.dataset.qty);
                const sanitizedName = itemName.replace(/[^a-zA-Z0-9]/g, '_');
                const input = document.getElementById(`qty-${sanitizedName}`);
                if (input) {
                    input.value = qty;
                    // Add visual feedback
                    input.style.background = '#28a745';
                    setTimeout(() => {
                        input.style.background = '#444';
                    }, 200);
                } else {
                    console.warn(`Could not find input for item: ${itemName} (ID: qty-${sanitizedName})`);
                }
            });
        });

        // Add event listeners for quantity increment buttons
        modal.querySelectorAll('.qty-btn-add').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemName = btn.dataset.item;
                const addQty = parseInt(btn.dataset.qty);
                const sanitizedName = itemName.replace(/[^a-zA-Z0-9]/g, '_');
                const input = document.getElementById(`qty-${sanitizedName}`);
                if (input) {
                    const currentQty = parseInt(input.value) || 0;
                    const maxQty = parseInt(input.max);
                    const newQty = Math.min(currentQty + addQty, maxQty);
                    input.value = newQty;
                    // Add visual feedback
                    input.style.background = '#007bff';
                    setTimeout(() => {
                        input.style.background = '#444';
                    }, 200);
                } else {
                    console.warn(`Could not find input for item: ${itemName} (ID: qty-${sanitizedName})`);
                }
            });
        });

        // Add event listeners for quantity reset buttons
        modal.querySelectorAll('.qty-btn-reset').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemName = btn.dataset.item;
                const sanitizedName = itemName.replace(/[^a-zA-Z0-9]/g, '_');
                const input = document.getElementById(`qty-${sanitizedName}`);
                if (input) {
                    input.value = 0;
                    // Add visual feedback
                    input.style.background = '#dc3545';
                    setTimeout(() => {
                        input.style.background = '#444';
                    }, 200);
                } else {
                    console.warn(`Could not find input for item: ${itemName} (ID: qty-${sanitizedName})`);
                }
            });
        });
        
        // Handle confirm posting
        document.getElementById('confirm-post').addEventListener('click', () => {
            const postingData = items.map(item => {
                const sanitizedName = item.name.replace(/[^a-zA-Z0-9]/g, '_');
                const qtyInput = document.getElementById(`qty-${sanitizedName}`);
                const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
                
                return {
                    name: item.name,
                    itemId: item.id,
                    quantity: quantity,
                    price: priceTargets[item.name].selectedPrice
                };
            }).filter(data => data.quantity > 0);
            
            modalOverlay.remove();
            executeMarketPosting(postingData);
        });
        
        document.getElementById('cancel-post').addEventListener('click', () => {
            modalOverlay.remove();
        });
        
        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.remove();
            }
        });
    }
    
    async function executeMarketPosting(postingData) {
        if (postingData.length === 0) {
            showToast('No items to post', 'warning');
            return;
        }
        
        showToast(`Starting to fill forms for ${postingData.length} items...`, 'info');
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const [index, item] of postingData.entries()) {
            try {
                showToast(`Filling form for ${item.name} (${index + 1}/${postingData.length})...`, 'info');
                
                const success = await postSingleItem(item);
                
                if (success) {
                    successCount++;
                } else {
                    errorCount++;
                    showToast(`✗ Failed to fill form for ${item.name}`, 'error');
                }
                
                // Wait between posts to avoid overwhelming the interface
                if (index < postingData.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
                
            } catch (error) {
                errorCount++;
                console.error(`Error filling form for ${item.name}:`, error);
                showToast(`✗ Error filling form for ${item.name}: ${error.message}`, 'error');
            }
        }
        
        // Final summary with instructions
        const summary = `Form filling complete! Filled: ${successCount}, Errors: ${errorCount}`;
        showToast(summary, successCount > 0 ? 'success' : 'error');
        
        if (successCount > 0) {
            // Show manual submission instruction
            setTimeout(() => {
                showToast('📝 Forms filled! Please review and manually submit each listing.', 'info');
            }, 2000);
        }
    }
    
    async function postSingleItem(item) {
        // Wait for the page to be ready
        await waitForMarketPageReady();
        
        // Find the item row in the market interface
        const itemRow = findMarketItemRow(item.itemId, item.name);
        if (!itemRow) {
            throw new Error(`Could not find item ${item.name} in market interface`);
        }
        
        // Fill in quantity using the visible input (not the hidden one)
        const qtyInputs = itemRow.querySelectorAll('input[placeholder="Qty"]');
        const visibleQtyInput = Array.from(qtyInputs).find(input => input.type !== 'hidden');
        if (visibleQtyInput) {
            // Clear the field first
            visibleQtyInput.value = '';
            visibleQtyInput.focus();
            
            // Set the value and trigger events
            visibleQtyInput.value = item.quantity;
            visibleQtyInput.dispatchEvent(new Event('input', { bubbles: true }));
            visibleQtyInput.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Simulate typing for better compatibility
            const inputEvent = new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                data: item.quantity.toString()
            });
            visibleQtyInput.dispatchEvent(inputEvent);
        }
        
        // Fill in price using the visible input (not the hidden one)
        const priceInputs = itemRow.querySelectorAll('input[placeholder="Price"]');
        const visiblePriceInput = Array.from(priceInputs).find(input => input.type !== 'hidden');
        if (visiblePriceInput) {
            // Clear the field first
            visiblePriceInput.value = '';
            visiblePriceInput.focus();
            
            // Set the value and trigger events
            visiblePriceInput.value = item.price;
            visiblePriceInput.dispatchEvent(new Event('input', { bubbles: true }));
            visiblePriceInput.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Simulate typing for better compatibility
            const inputEvent = new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                data: item.price.toString()
            });
            visiblePriceInput.dispatchEvent(inputEvent);
        }
        
        // Show a confirmation message
        showToast(`✓ Filled ${item.name}: Qty ${item.quantity}, Price $${item.price.toLocaleString()}`, 'success');
        
        // Note: Manual submission required - the script fills the forms but doesn't auto-submit
        // This is safer and follows Torn.com's terms of service better
        
        return true;
    }
    
    async function waitForMarketPageReady() {
        return new Promise((resolve) => {
            const checkReady = () => {
                const itemRows = document.querySelectorAll('.itemRowWrapper___cFs4O');
                if (itemRows.length > 0) {
                    resolve();
                } else {
                    setTimeout(checkReady, 500);
                }
            };
            checkReady();
        });
    }
    
    function findMarketItemRow(itemId, itemName) {
        // Look for the item row by item name or ID
        const itemRows = document.querySelectorAll('.itemRowWrapper___cFs4O, .itemRow___Mf7bO');
        
        for (const row of itemRows) {
            // Check for item name in various elements
            const viewButton = row.querySelector('.viewInfoButton___jOjRg, button[aria-label*="View"]');
            if (viewButton) {
                const ariaLabel = viewButton.getAttribute('aria-label');
                if (ariaLabel) {
                    // Try exact match first
                    if (ariaLabel.includes(itemName)) {
                        return row.closest('.itemRowWrapper___cFs4O') || row;
                    }
                    
                    // Try partial match for items with long names
                    const cleanItemName = itemName.replace(/[^\w\s]/g, '').toLowerCase();
                    const cleanAriaLabel = ariaLabel.replace(/[^\w\s]/g, '').toLowerCase();
                    if (cleanAriaLabel.includes(cleanItemName) || cleanItemName.includes(cleanAriaLabel.split(' ')[0])) {
                        return row.closest('.itemRowWrapper___cFs4O') || row;
                    }
                }
            }
            
            // Alternative: check for item ID in controls attribute
            const controls = viewButton?.getAttribute('aria-controls');
            if (controls && controls.includes(`itemInfo-${itemId}-`)) {
                return row.closest('.itemRowWrapper___cFs4O') || row;
            }
            
            // Check for item name in text content as fallback
            const titleElement = row.querySelector('.title___Xo6Pm, .itemName, [class*="title"]');
            if (titleElement && titleElement.textContent.includes(itemName)) {
                return row.closest('.itemRowWrapper___cFs4O') || row;
            }
        }
        
        // If no exact match, try a broader search by scanning all text content
        for (const row of itemRows) {
            if (row.textContent.includes(itemName)) {
                // Double-check this isn't a false positive by looking for input fields
                const hasInputs = row.querySelectorAll('input[placeholder="Qty"], input[placeholder="Price"]').length >= 2;
                if (hasInputs) {
                    return row.closest('.itemRowWrapper___cFs4O') || row;
                }
            }
        }
        
        return null;
    }
    
    // Update API status display
    function updateApiStatusDisplay() {
        const apiStatus = document.getElementById('api-status');
        
        if (!apiStatus) return;
        
        if (apiKey) {
            apiStatus.style.color = '#28a745';
            
            if (apiItemsData) {
                const itemCount = Object.keys(apiItemsData).length;
                apiStatus.textContent = `✅ API ready | ${itemCount} items cached`;
            } else {
                apiStatus.textContent = '✅ API key loaded | Click "Fetch" to load item data';
            }
        } else {
            apiStatus.style.color = '#dc3545';
            apiStatus.textContent = '❌ No API key | Required for tradeable item detection and market prices';
        }
    }
    
    // Wait for page to be ready and initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
