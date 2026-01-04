// ==UserScript==
// @name         Scrap2Mark-ML-Beta
// @namespace    http://tampermonkey.net/
// @version      1.8.2
// @description  Comprehensive inventory management and market posting tool for Torn.com with ML integration
// @author       vALT0r [767373]
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @connect      localhost
// @connect      valtor.zapto.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543744/Scrap2Mark-ML-Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/543744/Scrap2Mark-ML-Beta.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Scrap2Mark script starting...');

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

    // Machine Learning Server Configuration
    // ML Server Configuration - Using GM.xmlHttpRequest to bypass CSP
    const ML_SERVER_URL = 'http://localhost:8080'; // Primary server (local)
    const ML_SERVER_FALLBACK = 'http://valtor.zapto.org:8080'; // Network/remote access
    const ML_ENDPOINT_TRAINING = '/api/training-data';
    const ML_ENDPOINT_PREDICTION = '/api/predict-price';
    const ML_ENDPOINT_FEEDBACK = '/api/feedback';
    const ML_ENDPOINT_HEALTH = '/health';
    const ML_ENABLED = true; // GM.xmlHttpRequest bypasses CSP restrictions
    const ML_TIMEOUT = 5000; // 5 seconds timeout for ML requests
    const ML_RETRY_ATTEMPTS = 2; // Number of retry attempts with fallback

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

    // Machine Learning state
    let mlServerStatus = 'unknown'; // 'online', 'offline', 'unknown'
    let mlDataQueue = []; // Queue for ML data when server is offline
    let lastMlPing = 0;
    let sessionStartTime = Date.now();

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
    // MACHINE LEARNING FUNCTIONS - GM.xmlHttpRequest approach
    // ============================================================================

    /**
     * Helper function to perform HTTP requests with timeout using GM.xmlHttpRequest
     */
    function mlHttpRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            const requestOptions = {
                method: options.method || 'GET',
                url: url,
                headers: options.headers || { 'Content-Type': 'application/json' },
                timeout: ML_TIMEOUT,
                onload: (response) => {
                    try {
                        if (response.status >= 200 && response.status < 300) {
                            resolve({
                                ok: true,
                                status: response.status,
                                json: () => Promise.resolve(JSON.parse(response.responseText)),
                                text: () => Promise.resolve(response.responseText)
                            });
                        } else {
                            reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: (error) => reject(new Error('Network error')),
                ontimeout: () => reject(new Error('Request timeout'))
            };

            if (options.body) {
                requestOptions.data = options.body;
            }

            GM.xmlHttpRequest(requestOptions);
        });
    }

    /**
     * Ping ML server to check availability with fallback support
     */
    async function pingMlServer() {
        if (!ML_ENABLED) return false;

        // Try primary server first
        try {
            const response = await mlHttpRequest(`${ML_SERVER_URL}${ML_ENDPOINT_HEALTH}`);

            if (response.ok) {
                mlServerStatus = 'online';
                lastMlPing = Date.now();
                return true;
            }
        } catch (error) {
            // Silently fail primary server
        }

        // Try fallback server
        try {
            const response = await mlHttpRequest(`${ML_SERVER_FALLBACK}${ML_ENDPOINT_HEALTH}`);

            if (response.ok) {
                mlServerStatus = 'online';
                lastMlPing = Date.now();
                return true;
            } else {
                mlServerStatus = 'offline';
                lastMlPing = Date.now();
                return false;
            }
        } catch (error) {
            mlServerStatus = 'offline';
            lastMlPing = Date.now();
            return false;
        }
    }

    /**
     * Collect comprehensive market context for ML training
     */
    function collectMarketContext(itemId, userSelection = null) {
        // Find the item in scannedItems by ID
        let item = null;
        for (const [key, scannedItem] of scannedItems) {
            if (scannedItem.id.toString() === itemId.toString()) {
                item = scannedItem;
                break;
            }
        }

        if (!item) {
            return null;
        }

        // Get market statistics
        const marketStats = calculateMarketStats(itemId);

        // Collect user behavior context
        const userContext = {
            scanTime: Date.now(),
            totalItemsScanned: scannedItems.size,
            sessionDuration: Date.now() - sessionStartTime
        };

        // Collect item context
        const itemContext = {
            itemId: parseInt(itemId),
            name: item.name,
            type: item.type || 'unknown',
            quantity: item.quantity || 1,
            circulation: item.circulation || null,
            value: item.value || null,
            marketValue: item.market_value || null
        };

        // Collect comprehensive market data including detailed listings
        const marketInfo = marketData.get(itemId.toString());
        const listings = marketInfo ? marketInfo.listings || [] : [];

        // Create detailed listings array with quantity and price pairs
        const detailedListings = listings.map(listing => ({
            quantity: listing.quantity || 1,
            price: listing.price || 0
        }));

        const marketContext = {
            totalListings: marketStats.totalListings,
            averagePrice: marketStats.averagePrice,
            medianPrice: marketStats.medianPrice,
            minPrice: marketStats.minPrice,
            maxPrice: marketStats.maxPrice,
            priceSpread: marketStats.priceSpread,
            priceStandardDeviation: marketStats.standardDeviation,
            competitivePriceRange: marketStats.competitivePriceRange,
            marketActivity: marketStats.activity,
            topCompetitors: marketStats.topCompetitors,
            // NEW: Add detailed market listings for ML analysis
            marketListings: detailedListings,
            totalMarketQuantity: detailedListings.reduce((sum, listing) => sum + listing.quantity, 0)
        };

        const trainingData = {
            timestamp: Date.now(),
            user: userContext,
            item: itemContext,
            market: marketContext,
            selection: userSelection
        };

        return trainingData;
    }

    /**
     * Calculate detailed market statistics for ML
     */
    function calculateMarketStats(itemId) {
        // Get market data from the marketData Map
        const marketInfo = marketData.get(itemId.toString());
        const listings = marketInfo ? marketInfo.listings || [] : [];

        if (listings.length === 0) {
            return {
                totalListings: 0,
                averagePrice: null,
                medianPrice: null,
                minPrice: null,
                maxPrice: null,
                priceSpread: null,
                standardDeviation: null,
                competitivePriceRange: null,
                activity: 'none',
                topCompetitors: []
            };
        }

        const prices = listings.map(l => l.price).sort((a, b) => a - b);
        const quantities = listings.map(l => l.quantity);
        const totalQuantity = quantities.reduce((sum, q) => sum + q, 0);

        // Basic statistics
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        const medianPrice = prices[Math.floor(prices.length / 2)];
        const priceSpread = maxPrice - minPrice;

        // Standard deviation
        const variance = prices.reduce((sum, price) => sum + Math.pow(price - averagePrice, 2), 0) / prices.length;
        const standardDeviation = Math.sqrt(variance);

        // Competitive range (within 1 standard deviation of minimum)
        const competitivePriceRange = {
            min: minPrice,
            max: Math.min(minPrice + standardDeviation, maxPrice),
            suggested: minPrice + (standardDeviation * 0.1) // Slightly above minimum
        };

        // Market activity classification
        let activity = 'low';
        if (listings.length > 10) activity = 'medium';
        if (listings.length > 25) activity = 'high';
        if (listings.length > 50) activity = 'very-high';

        // Top competitors (lowest 5 prices with quantities)
        const topCompetitors = listings
            .sort((a, b) => a.price - b.price)
            .slice(0, 5)
            .map(listing => ({
                price: listing.price,
                quantity: listing.quantity
            }));

        return {
            totalListings: listings.length,
            averagePrice,
            medianPrice,
            minPrice,
            maxPrice,
            priceSpread,
            standardDeviation,
            competitivePriceRange,
            activity,
            topCompetitors,
            totalQuantity
        };
    }

    /**
     * Send training data to ML server with fallback support
     */
    async function sendTrainingData(trainingData) {
        if (!ML_ENABLED) return false;

        // Check server status if we haven't pinged recently
        if (Date.now() - lastMlPing > 60000) { // 1 minute
            await pingMlServer();
        }

        if (mlServerStatus === 'offline') {
            // Queue data for later sending
            mlDataQueue.push(trainingData);
            updateMlStatus('offline', `${mlDataQueue.length} queued`);

            // Immediate attempt to reconnect and process when new data is queued
            setTimeout(async () => {
                const isOnline = await pingMlServer();
                if (isOnline) {
                    processQueuedMlData();
                }
            }, 1000);

            return false;
        }

        // Try to send to primary server first, then fallback
        const servers = [ML_SERVER_URL, ML_SERVER_FALLBACK];

        for (const serverUrl of servers) {
            try {
                const response = await mlHttpRequest(`${serverUrl}${ML_ENDPOINT_TRAINING}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(trainingData)
                });

                if (response.ok) {
                    return true;
                }
            } catch (error) {
                // Silently continue to next server
            }
        }

        // All servers failed
        console.warn('[Scrap2Mark] Failed to send training data to all servers for', trainingData.item?.name || 'Unknown');
        mlServerStatus = 'offline';
        mlDataQueue.push(trainingData);
        updateMlStatus('offline', `${mlDataQueue.length} queued`);
        return false;
    }

    /**
     * Process queued ML data when server becomes available
     */
    async function processQueuedMlData() {
        if (!ML_ENABLED || mlDataQueue.length === 0) return;

        console.log(`[Scrap2Mark] Checking server status before processing ${mlDataQueue.length} queued entries...`);
        const isOnline = await pingMlServer();
        if (!isOnline) {
            console.log('[Scrap2Mark] Server still offline, keeping data queued');
            return;
        }

        console.log(`[Scrap2Mark] 🚀 Server online! Processing ${mlDataQueue.length} queued ML data entries`);
        updateMlStatus('online', 'processing queue');

        const batch = mlDataQueue.splice(0, 10); // Process in batches of 10
        let processed = 0;
        let failed = 0;

        for (const data of batch) {
            try {
                const success = await sendTrainingData(data);
                if (success) {
                    processed++;
                } else {
                    failed++;
                    // Re-queue failed data at the front for retry
                    mlDataQueue.unshift(data);
                }
            } catch (error) {
                failed++;
                console.error(`[Scrap2Mark] Error sending queued data:`, error);
                // Re-queue failed data at the front for retry
                mlDataQueue.unshift(data);
            }
            await new Promise(resolve => setTimeout(resolve, 200)); // Increased delay between requests
        }

        console.log(`[Scrap2Mark] Batch complete: ${processed} sent, ${failed} failed`);

        // Continue processing if more data remains
        if (mlDataQueue.length > 0) {
            updateMlStatus('online', `${mlDataQueue.length} remaining`);
            console.log(`[Scrap2Mark] ${mlDataQueue.length} entries remaining in queue, scheduling next batch...`);
            setTimeout(processQueuedMlData, 2000); // Wait 2 seconds before next batch
        } else {
            updateMlStatus('online');
            console.log('[Scrap2Mark] ✅ All queued data processed successfully!');
        }
    }

    /**
     * Record user price selection for ML training
     */
    async function recordPriceSelection(itemId, selectedPrice, selectionMethod = 'manual') {
        const trainingData = collectMarketContext(itemId, {
            selectedPrice: selectedPrice,
            method: selectionMethod,
            confidence: 'user-selected'
        });

        if (trainingData) {
            await sendTrainingData(trainingData);
        }
    }

    /**
     * Get ML price prediction for an item
     */
    async function getMlPricePrediction(itemId) {
        if (!ML_ENABLED || mlServerStatus === 'offline') return null;

        const item = items[itemId];
        if (!item) return null;

        const marketContext = collectMarketContext(itemId);
        if (!marketContext) return null;

        // Try to get prediction from primary server first, then fallback
        const servers = [ML_SERVER_URL, ML_SERVER_FALLBACK];

        for (const serverUrl of servers) {
            try {
                const response = await mlHttpRequest(`${serverUrl}${ML_ENDPOINT_PREDICTION}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(marketContext)
                });

                if (response.ok) {
                    const prediction = await response.json();
                    return prediction;
                }
            } catch (error) {
                // Silently continue to next server
            }
        }

        return null;
    }

    /**
     * Update ML status display
     */
    function updateMlStatus(status, details = '') {
        const mlStatusElement = document.getElementById('ml-status');
        if (!mlStatusElement) return;

        let statusText, color;

        switch (status) {
            case 'online':
                statusText = 'Online';
                color = '#28a745';
                break;
            case 'offline':
                statusText = 'Offline (Queuing)';
                color = '#ffc107';
                break;
            case 'disabled':
                statusText = 'Disabled';
                color = '#6c757d';
                break;
            case 'error':
                statusText = 'Error';
                color = '#dc3545';
                break;
            default:
                statusText = 'Initializing...';
                color = '#666';
        }

        mlStatusElement.innerHTML = `ML: <span style="color: ${color};">${statusText}</span>${details ? ` (${details})` : ''}`;
    }

    /**
     * Initialize ML system
     */
    function initializeMlSystem() {
        if (!ML_ENABLED) {
            updateMlStatus('disabled');
            return;
        }

        console.log('[Scrap2Mark] 🧠 Initializing ML system with GM.xmlHttpRequest...');
        console.log(`[Scrap2Mark] Primary server: ${ML_SERVER_URL}`);
        console.log(`[Scrap2Mark] Fallback server: ${ML_SERVER_FALLBACK}`);
        updateMlStatus('initializing');

        // Initial server ping with detailed logging
        console.log('[Scrap2Mark] Testing ML server connectivity...');
        pingMlServer().then(isOnline => {
            if (isOnline) {
                console.log('[Scrap2Mark] ✅ ML server is online and responding');
                updateMlStatus('online');
                // Process any queued data from previous sessions
                processQueuedMlData();
            } else {
                console.log('[Scrap2Mark] ❌ ML server is offline, will queue data');
                updateMlStatus('offline', `${mlDataQueue.length} queued`);
            }
        }).catch(error => {
            console.error('[Scrap2Mark] Error during ML server initialization:', error);
            updateMlStatus('error');
        });

        // Set up periodic queue processing with adaptive frequency
        setInterval(() => {
            if (mlDataQueue.length > 0) {
                processQueuedMlData();
            }
        }, 5 * 60 * 1000); // Every 5 minutes

        // Additional frequent checks when queue is not empty (every 30 seconds)
        const frequentCheckInterval = setInterval(() => {
            if (mlDataQueue.length > 0) {
                // Always ping server when there's queued data, regardless of current status
                pingMlServer().then(isOnline => {
                    if (isOnline && mlServerStatus !== 'online') {
                        console.log('[Scrap2Mark] 🎉 Server detected online during quick check - processing queue immediately!');
                        updateMlStatus('online');
                        processQueuedMlData();
                    } else if (isOnline && mlServerStatus === 'online') {
                        // Server thinks it's online, try processing queue anyway
                        processQueuedMlData();
                    }
                });
            }
        }, 30 * 1000); // Every 30 seconds when there's queued data

        // Set up periodic server health checks (every 10 minutes)
        setInterval(() => {
            pingMlServer().then(isOnline => {
                if (isOnline && mlServerStatus !== 'online') {
                    console.log('[Scrap2Mark] ML server came back online');
                    updateMlStatus('online');
                    // Process queued data immediately when server comes back online
                    if (mlDataQueue.length > 0) {
                        console.log(`[Scrap2Mark] Server back online - processing ${mlDataQueue.length} queued entries`);
                        processQueuedMlData();
                    }
                } else if (!isOnline && mlServerStatus !== 'offline') {
                    console.log('[Scrap2Mark] ML server went offline');
                    updateMlStatus('offline', `${mlDataQueue.length} queued`);
                }
            });
        }, 10 * 60 * 1000);

        // Add debugging functions
        window.testMlConnection = async function() {
            console.log('[Scrap2Mark] 🔧 Testing ML server connection with GM.xmlHttpRequest...');
            try {
                const isOnline = await pingMlServer();
                console.log(`[Scrap2Mark] Connection test result:`, isOnline ? 'SUCCESS' : 'FAILED');
                console.log(`[Scrap2Mark] Server status:`, mlServerStatus);
                return isOnline;
            } catch (error) {
                console.error('[Scrap2Mark] Error testing connection:', error);
                return false;
            }
        };

        window.checkMlQueue = function() {
            console.log(`[Scrap2Mark] 📊 ML Queue Status:`);
            console.log(`[Scrap2Mark] - Queue length: ${mlDataQueue.length}`);
            console.log(`[Scrap2Mark] - Server status: ${mlServerStatus}`);
            console.log(`[Scrap2Mark] - Last ping: ${new Date(lastMlPing).toLocaleTimeString()}`);
            console.log(`[Scrap2Mark] - ML enabled: ${ML_ENABLED}`);
            if (mlDataQueue.length > 0) {
                console.log(`[Scrap2Mark] - Oldest queued item:`, mlDataQueue[0].item?.name || 'Unknown');
                console.log(`[Scrap2Mark] - Sample queue data:`, mlDataQueue[0]);
            }
            return {
                queueLength: mlDataQueue.length,
                serverStatus: mlServerStatus,
                lastPing: lastMlPing,
                enabled: ML_ENABLED
            };
        };

        window.forceMlQueueProcess = async function() {
            console.log('[Scrap2Mark] 🚀 Forcing ML queue processing...');
            if (mlDataQueue.length === 0) {
                console.log('[Scrap2Mark] No data in queue to process');
                return;
            }
            console.log(`[Scrap2Mark] Processing ${mlDataQueue.length} queued entries...`);

            // Force a fresh server ping before processing
            console.log('[Scrap2Mark] 🔍 Force-checking server status...');
            const wasOnline = await pingMlServer();
            console.log(`[Scrap2Mark] Server ping result: ${wasOnline ? 'ONLINE' : 'OFFLINE'}`);
            console.log(`[Scrap2Mark] Updated server status: ${mlServerStatus}`);

            if (!wasOnline) {
                console.log('[Scrap2Mark] ❌ Server is still offline - cannot process queue');
                return;
            }

            try {
                await processQueuedMlData();
                console.log('[Scrap2Mark] Force processing complete');
            } catch (error) {
                console.error('[Scrap2Mark] Error during force processing:', error);
            }
        };

        // Also add functions to global scope for easier access
        unsafeWindow.testMlConnection = window.testMlConnection;
        unsafeWindow.checkMlQueue = window.checkMlQueue;
        unsafeWindow.forceMlQueueProcess = window.forceMlQueueProcess;

        // Add a helper function to check server startup
        window.startMlServer = function() {
            console.log('[Scrap2Mark] 🚀 ML Server Startup Instructions:');
            console.log('[Scrap2Mark] 1. Open Command Prompt (cmd)');
            console.log('[Scrap2Mark] 2. Run: cd /d "e:\\Torn\\Scrap2Mark\\ml_server"');
            console.log('[Scrap2Mark] 3. Run: start_server.bat');
            console.log('[Scrap2Mark] 4. Wait for server to start (should show "Running on http://localhost:8080")');
            console.log('[Scrap2Mark] 5. Then run: testMlConnection() to verify');
            console.log('[Scrap2Mark] 6. Finally run: forceMlQueueProcess() to process queued data');
            return 'Instructions displayed in console';
        };

        unsafeWindow.startMlServer = window.startMlServer;

        console.log('[Scrap2Mark] ✅ ML system initialized!');
        console.log('[Scrap2Mark] Debug commands: testMlConnection(), checkMlQueue(), forceMlQueueProcess(), startMlServer()');
    }

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

        // Optimized: Only update the specific row instead of entire table
        updateSingleRowDisplay(itemIdStr);

        // Show visual feedback with toast notification (scan-status removed)
        const isIgnored = ignoredItems.has(itemIdStr);
        // Find item using the correct approach - iterate through values since key format is complex
        const item = Array.from(scannedItems.values()).find(item => item.id.toString() === itemIdStr);
        const itemName = item?.name || 'Unknown';
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
        const showIgnoredCheckbox = document.getElementById('show-ignored');
        const hideLowValueCheckbox = document.getElementById('hide-low-value');
        const minValueInput = document.getElementById('min-value-input');
        const categoryFilter = document.getElementById('category-filter');

        return {
            showNonTradeable: false, // Always false since we removed the checkbox
            showIgnored: showIgnoredCheckbox ? showIgnoredCheckbox.checked : false,
            hideLowValue: hideLowValueCheckbox ? hideLowValueCheckbox.checked : true,
            minValue: minValueInput ? parseFloat(minValueInput.value.replace(/[,$]/g, '')) || 5000000 : 5000000,
            category: categoryFilter ? categoryFilter.value : 'All'
        };
    }

    function applyFilterState(state) {
        const showIgnoredCheckbox = document.getElementById('show-ignored');
        const hideLowValueCheckbox = document.getElementById('hide-low-value');
        const minValueInput = document.getElementById('min-value-input');
        const categoryFilter = document.getElementById('category-filter');

        if (showIgnoredCheckbox) showIgnoredCheckbox.checked = state.showIgnored;
        if (hideLowValueCheckbox) hideLowValueCheckbox.checked = state.hideLowValue;
        if (minValueInput) minValueInput.value = state.minValue.toLocaleString();
        if (categoryFilter && state.category) categoryFilter.value = state.category;
    }

    // Populate category filter dropdown with available categories
    function populateCategoryFilter() {
        const categoryFilter = document.getElementById('category-filter');
        if (!categoryFilter) return;

        // Get all unique categories from scanned items
        const categories = new Set(['All']);
        for (const item of scannedItems.values()) {
            if (item.category && item.category !== 'Unknown') {
                categories.add(item.category);
            }
        }

        // Add 'Unknown' if there are items with unknown categories
        for (const item of scannedItems.values()) {
            if (!item.category || item.category === 'Unknown') {
                categories.add('Unknown');
                break;
            }
        }

        // Store current selection
        const currentSelection = categoryFilter.value;

        // Clear existing options except 'All'
        categoryFilter.innerHTML = '<option value="All">All</option>';

        // Add categories in alphabetical order
        const sortedCategories = Array.from(categories).filter(cat => cat !== 'All').sort();
        sortedCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        // Restore selection if it still exists
        if (Array.from(categories).includes(currentSelection)) {
            categoryFilter.value = currentSelection;
        }
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

    // Calculate ML-enhanced estimated value (async version for background updates)
    async function calculateMlEstimatedValue(itemId, quantity) {
        const marketInfo = marketData.get(itemId);
        if (!marketInfo || !marketInfo.listings || marketInfo.listings.length === 0) {
            return 0;
        }

        // Calculate price stats to get consistent pricing
        const stats = calculatePriceStats(marketInfo.listings);
        if (!stats) {
            return 0;
        }

        // Use the same low-end price calculation as the Price column (fallback)
        const traditionalPrice = Math.min(stats.p25, stats.min * 1.2);

        // Try to get ML prediction if available
        if (ML_ENABLED && mlServerStatus === 'online') {
            try {
                const mlPrediction = await getMlPricePrediction(itemId);
                if (mlPrediction && mlPrediction.predicted_price && mlPrediction.confidence > 0.5) {
                    // Use ML prediction if confidence is reasonable
                    const mlPrice = mlPrediction.predicted_price;
                    console.debug(`[Scrap2Mark] Using ML price for ${itemId}: $${mlPrice} (confidence: ${mlPrediction.confidence})`);
                    return Math.round(mlPrice * quantity);
                }
            } catch (error) {
                console.debug(`[Scrap2Mark] ML prediction failed for ${itemId}, using traditional pricing:`, error.message);
            }
        }

        // Calculate estimated value using traditional method
        return Math.round(traditionalPrice * quantity);
    }

    // Enhance estimated value display with ML prediction (background update)
    async function enhanceEstimatedValueWithML(rowElement, itemId, quantity) {
        try {
            const mlEstimatedValue = await calculateMlEstimatedValue(itemId, quantity);
            const traditionalEstimatedValue = calculateEstimatedValue(itemId, quantity);

            // Only update if ML gives a different value
            if (mlEstimatedValue !== traditionalEstimatedValue && mlEstimatedValue > 0) {
                const estimatedValueCell = rowElement.children[5]; // 6th column (0-indexed)
                if (estimatedValueCell) {
                    const mlValueDisplay = `$${Math.round(mlEstimatedValue).toLocaleString()}`;
                    const confidenceIndicator = '<span style="font-size: 10px; color: #17a2b8;">🧠</span>';
                    estimatedValueCell.innerHTML = `${mlValueDisplay} ${confidenceIndicator}`;
                    estimatedValueCell.style.color = '#17a2b8'; // Blue color for ML-enhanced values
                    estimatedValueCell.title = `ML-enhanced estimate: $${mlValueDisplay}\nTraditional estimate: $${traditionalEstimatedValue.toLocaleString()}`;
                }
            }
        } catch (error) {
            console.debug(`[Scrap2Mark] ML enhancement failed for item ${itemId}:`, error.message);
        }
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

                // Non-tradeable items are no longer shown separately

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

    // Update scroll reminder based on loading status (simplified)
    function updateScrollReminder() {
        // Function kept for compatibility but no longer displays reminder
        return;
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

        // Validate dimensions
        if (!width || !height || isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            return `<div style="width: 60px; height: 20px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #999;">Invalid dimensions</div>`;
        }

        const filteredListings = filterOutliers(listings);
        const stats = calculatePriceStats(filteredListings, false);
        if (!stats || !stats.min || !stats.max || isNaN(stats.min) || isNaN(stats.max) || stats.min >= stats.max) {
            return `<div style="width: ${width}px; height: ${height}px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #999;">No valid data</div>`;
        }

        // Group prices into bins for visualization
        const bins = Math.min(10, filteredListings.length);
        const binWidth = (stats.max - stats.min) / bins;
        const binCounts = new Array(bins).fill(0);

        filteredListings.forEach(listing => {
            if (listing && listing.price && !isNaN(listing.price) && listing.amount && !isNaN(listing.amount)) {
                const binIndex = Math.min(Math.floor((listing.price - stats.min) / binWidth), bins - 1);
                if (binIndex >= 0 && binIndex < bins) {
                    binCounts[binIndex] += listing.amount;
                }
            }
        });

        const maxBinCount = Math.max(...binCounts);
        if (maxBinCount <= 0) {
            return `<div style="width: ${width}px; height: ${height}px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #999;">No valid data</div>`;
        }

        // Create SVG chart
        const bars = binCounts.map((count, index) => {
            const barHeight = maxBinCount > 0 ? (count / maxBinCount) * (height - 2) : 0;
            const x = (index * width) / bins;
            const barWidth = width / bins - 1;
            const y = height - barHeight;

            // Validate all calculated values
            if (isNaN(x) || isNaN(y) || isNaN(barWidth) || isNaN(barHeight) ||
                x < 0 || y < 0 || barWidth <= 0 || barHeight < 0) {
                return ''; // Skip invalid bars
            }

            return `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#007bff" opacity="0.7"/>`;
        }).filter(bar => bar !== '').join('');

        return `
            <svg width="${width}" height="${height}" style="border: 1px solid #ddd;">
                ${bars}
            </svg>
        `;
    }

    // Create high-resolution popup chart with zoom functionality
    function createDetailedPriceChart(listings, itemName, itemId = null, zoomMin = null, zoomMax = null) {
        if (!listings || listings.length === 0) {
            return '<div style="padding: 15px;">No market data available</div>';
        }

        const filteredListings = filterOutliers(listings);
        const stats = calculatePriceStats(filteredListings, false);
        if (!stats || !stats.min || !stats.max || isNaN(stats.min) || isNaN(stats.max) || stats.min >= stats.max) {
            return '<div style="padding: 15px;">No valid price data for chart</div>';
        }

        const width = 300;
        const height = 160; // Reduced from 200
        const padding = 35; // Reduced from 40
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        // Determine price range for chart (zoom or full range)
        const displayMin = Math.max(1, zoomMin || stats.min); // Ensure minimum > 0 for log scale
        const displayMax = zoomMax || stats.max;
        const isZoomed = zoomMin !== null || zoomMax !== null;

        // Filter listings to zoom range if zooming
        const displayListings = isZoomed ?
            filteredListings.filter(l => l.price >= displayMin && l.price <= displayMax) :
            filteredListings;

        if (displayListings.length === 0) {
            return '<div style="padding: 15px;">No data in selected range</div>';
        }

        // Create bins for histogram using logarithmic scale
        const bins = Math.min(20, displayListings.length);
        const logMin = Math.log10(displayMin);
        const logMax = Math.log10(displayMax);
        const logRange = logMax - logMin;
        const logBinWidth = logRange / bins;
        const binData = [];

        for (let i = 0; i < bins; i++) {
            const logBinMin = logMin + i * logBinWidth;
            const logBinMax = logMin + (i + 1) * logBinWidth;
            binData.push({
                min: Math.pow(10, logBinMin),
                max: Math.pow(10, logBinMax),
                count: 0,
                totalAmount: 0
            });
        }

        displayListings.forEach(listing => {
            const logPrice = Math.log10(listing.price);
            const binIndex = Math.min(Math.floor((logPrice - logMin) / logBinWidth), bins - 1);
            if (binIndex >= 0) {
                binData[binIndex].count++;
                binData[binIndex].totalAmount += listing.amount;
            }
        });

        const maxCount = Math.max(...binData.map(b => b.totalAmount));
        const logMaxCount = Math.log10(Math.max(1, maxCount)); // Ensure > 0 for log scale

        // Create SVG bars with logarithmic scaling
        const bars = binData.map((bin, index) => {
            // Use logarithmic scale for Y-axis (quantity)
            const logAmount = Math.log10(Math.max(1, bin.totalAmount));
            const barHeight = maxCount > 0 ? (logAmount / logMaxCount) * chartHeight : 0;

            // Use logarithmic scale for X-axis (price)
            const logBinMin = Math.log10(bin.min);
            const logBinMax = Math.log10(bin.max);
            const xStart = padding + ((logBinMin - logMin) / logRange) * chartWidth;
            const xEnd = padding + ((logBinMax - logMin) / logRange) * chartWidth;
            const barWidth = xEnd - xStart - 1;
            const y = padding + chartHeight - barHeight;

            // Validate all calculated values
            if (isNaN(xStart) || isNaN(y) || isNaN(barWidth) || isNaN(barHeight) ||
                xStart < 0 || y < 0 || barWidth <= 0 || barHeight < 0 ||
                !isFinite(xStart) || !isFinite(y) || !isFinite(barWidth) || !isFinite(barHeight)) {
                return ''; // Skip invalid bars
            }

            return `
                <rect x="${xStart}" y="${y}" width="${barWidth}" height="${barHeight}"
                      fill="#007bff" opacity="0.7" stroke="#0056b3" stroke-width="1"
                      data-price-min="${bin.min}" data-price-max="${bin.max}" data-amount="${bin.totalAmount}"
                      class="chart-bar">
                </rect>
            `;
        }).filter(bar => bar !== '').join('');

        // Create axes
        const xAxis = `<line x1="${padding}" y1="${padding + chartHeight}" x2="${padding + chartWidth}" y2="${padding + chartHeight}" stroke="#666" stroke-width="1"/>`;
        const yAxis = `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${padding + chartHeight}" stroke="#666" stroke-width="1"/>`;

        // Create logarithmic price labels
        const logPriceSteps = Math.max(2, Math.min(4, Math.floor(logRange)));
        const priceLabels = [];
        for (let i = 0; i <= logPriceSteps; i++) {
            const logPrice = logMin + (i * logRange) / logPriceSteps;
            const price = Math.pow(10, logPrice);
            const x = padding + (i * chartWidth) / logPriceSteps;
            priceLabels.push(`<text x="${x}" y="${padding + chartHeight + 12}" text-anchor="middle" font-size="9" fill="#666">$${price >= 1000 ? Math.round(price/1000) + 'k' : Math.round(price)}</text>`);
        }

        // Create logarithmic quantity labels
        const logQuantitySteps = 3;
        const quantityLabels = [];
        for (let i = 0; i <= logQuantitySteps; i++) {
            const logQty = (i * logMaxCount) / logQuantitySteps;
            const qty = Math.pow(10, logQty);
            const y = padding + chartHeight - (i * chartHeight) / logQuantitySteps;
            quantityLabels.push(`<text x="${padding - 3}" y="${y + 2}" text-anchor="end" font-size="9" fill="#666">${qty >= 1000 ? Math.round(qty/1000) + 'k' : Math.round(qty)}</text>`);
        }

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
            <div style="padding: 12px; background: white; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: relative; min-width: 320px; max-width: 400px;">
                <div>
                    <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #333;">${itemName}${zoomText}</h4>
                    <svg id="price-chart-svg" width="${width}" height="${height + 15}" style="background: white; cursor: crosshair; width: 100%; max-width: ${width}px;"
                         data-padding="${padding}" data-chart-width="${chartWidth}" data-chart-height="${chartHeight}"
                         data-display-min="${displayMin}" data-display-max="${displayMax}">
                        ${bars}
                        ${xAxis}
                        ${yAxis}
                        ${priceLabels.join('')}
                        ${quantityLabels.join('')}
                        ${selectionOverlay}
                    </svg>

                    <!-- Integrated listings section (always visible, mobile-friendly) -->
                    <div style="margin-top: 10px; border-top: 1px solid #eee; padding-top: 8px;">
                        <div style="font-weight: bold; font-size: 11px; margin-bottom: 6px; color: #333;">
                            Market Listings ${isZoomed ? '(Filtered)' : ''}
                        </div>
                        <div style="max-height: 160px; overflow-y: auto; border: 1px solid #eee; border-radius: 4px;">
                            ${createListingsTable(displayListings, itemId)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Create listings table for the expanded panel
    function createListingsTable(listings, itemId = null) {
        if (!listings || listings.length === 0) {
            return '<div style="padding: 10px; text-align: center; color: #666;">No listings available</div>';
        }

        // Get NPC sell price from API data
        let npcSellPrice = null;
        if (itemId && apiItemsData && apiItemsData[itemId]) {
            const itemData = apiItemsData[itemId];
            // Access the correct field: value.sell_price
            npcSellPrice = (itemData.value && itemData.value.sell_price) || null;
            if (npcSellPrice !== null) {
                console.log(`[Scrap2Mark] Item ${itemId}: NPC sell price = $${npcSellPrice}`, itemData.name);
            } else {
                console.log(`[Scrap2Mark] Item ${itemId}: No NPC sell price available (value:`, itemData.value, `name:`, itemData.name, ')');
            }
        } else {
            console.log(`[Scrap2Mark] No API data for item ${itemId}, apiItemsData available:`, !!apiItemsData);
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

        // Add NPC sell price reference row if available
        if (npcSellPrice !== null && npcSellPrice > 0) {
            tableContent += `
                <tr style="background: #fff3cd; border: 2px solid #ffc107; font-weight: bold;">
                    <td style="padding: 4px 6px; border-right: 1px solid #ffc107; text-align: center; color: #856404;">NPC</td>
                    <td style="padding: 4px 6px; text-align: right; border-right: 1px solid #ffc107; color: #856404;">$${npcSellPrice.toLocaleString()}</td>
                    <td style="padding: 4px 6px; text-align: center; color: #856404; font-size: 10px;">
                        <span title="This is the NPC sell price - don't sell below this!">⚠️ Min Price</span>
                    </td>
                </tr>
            `;
        }

        // Convert map to array and limit to first 50 entries for performance
        const groupArray = Array.from(priceGroups.values()).slice(0, 50);

        groupArray.forEach((group, index) => {
            const targetPrice = Math.max(1, group.price - 1); // $1 less, minimum $1
            const rowId = `price-row-${group.price}`;

            // Determine if this price is below NPC sell price (mark in red)
            const isBelowNpcPrice = npcSellPrice !== null && npcSellPrice > 0 && group.price < npcSellPrice;
            const rowStyle = isBelowNpcPrice ?
                'background: #f8d7da; border: 1px solid #dc3545;' :
                (index % 2 === 0 ? 'background: #f9f9f9;' : '');
            const textColor = isBelowNpcPrice ? 'color: #721c24;' : '';

            tableContent += `
                <tr style="border-bottom: 1px solid #eee; ${rowStyle}">
                    <td style="padding: 3px 6px; border-right: 1px solid #eee; ${textColor}">${group.totalQuantity.toLocaleString()}</td>
                    <td style="padding: 3px 6px; text-align: right; border-right: 1px solid #eee; font-weight: bold; ${textColor}">
                        $${group.price.toLocaleString()}
                        ${isBelowNpcPrice ? '<span style="color: #dc3545; font-size: 9px;"> ⚠️</span>' : ''}
                    </td>
                    <td style="padding: 3px 6px; text-align: center;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
                            <input type="radio" name="price-target-${currentItemId || 'default'}" id="${rowId}" data-original-price="${group.price}" data-target-price="${targetPrice}" class="price-target-radio" style="margin: 0;" ${isBelowNpcPrice ? 'disabled title="Price below NPC sell price - not recommended!"' : ''}>
                            <span style="font-size: 10px; color: #666; ${textColor}">$${targetPrice.toLocaleString()}</span>
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

    // Workflow Fill Forms handler - must be global for onclick
    function handleWorkflowFillForms() {
        console.log('handleWorkflowFillForms called');

        const isMarketPage = window.location.href.includes('ItemMarket') ||
                            window.location.href.includes('itemmarket') ||
                            window.location.href.includes('addListing');

        console.log('Current URL:', window.location.href);
        console.log('Is market page:', isMarketPage);

        if (isMarketPage) {
            // On market page - do the normal fill forms behavior
            console.log('Calling handlePostToMarket...');
            handlePostToMarket();
        } else {
            // On items page - redirect to market
            console.log('Redirecting to market page...');
            const marketUrl = 'https://www.torn.com/page.php?sid=ItemMarket#/addListing';
            window.location.href = marketUrl;
        }
    }

    // Make workflow function global
    window.handleWorkflowFillForms = handleWorkflowFillForms;

    // Create floating table to display results
    function createFloatingTable() {
        console.log('createFloatingTable() called');

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
                        <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                            <div style="display: flex; gap: 6px; align-items: center; flex: 1; min-width: 300px;">
                                <input type="text" id="api-key-input" placeholder="Insert API key here" autocomplete="on" name="api_key" style="width: 180px; padding: 4px 6px; border: 1px solid #ccc; border-radius: 3px; font-size: 11px; font-family: monospace;">
                                <button id="save-api-key" style="background: #17a2b8; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px; white-space: nowrap;">Save</button>
                                <button id="logout-api-key" style="background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px; white-space: nowrap; display: none;">Logout</button>
                                <button id="fetch-api-data" style="background: #ffc107; color: black; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px; white-space: nowrap; display: none;">Fetch</button>
                                <button id="full-reset-btn" style="background: #dc3545; color: white; border: none; padding: 4px 6px; border-radius: 3px; cursor: pointer; font-size: 9px; font-weight: bold;">Reset</button>
                            </div>

                            <!-- Workflow Progress Steps (responsive) -->
                            <div style="display: flex; gap: 2px; flex-wrap: wrap;">
                                <div id="step-api" class="workflow-step" style="width: 55px; height: 24px; display: flex; align-items: center; justify-content: center; background: #dc3545; color: white; font-size: 9px; font-weight: bold; border-radius: 2px; cursor: default;">
                                    <span id="step-api-icon">✗</span>
                                    <span style="margin-left: 2px;">API</span>
                                </div>
                                <div id="step-items" class="workflow-step" style="width: 55px; height: 24px; display: flex; align-items: center; justify-content: center; background: #dc3545; color: white; font-size: 9px; font-weight: bold; border-radius: 2px; cursor: default;">
                                    <span id="step-items-icon">✗</span>
                                    <span style="margin-left: 2px;">Items</span>
                                </div>
                                <div id="step-inventory" class="workflow-step" style="width: 55px; height: 24px; display: flex; align-items: center; justify-content: center; background: #dc3545; color: white; font-size: 9px; font-weight: bold; border-radius: 2px; cursor: default;">
                                    <span id="step-inventory-icon">✗</span>
                                    <span style="margin-left: 2px;">Inv</span>
                                </div>
                                <div id="step-market" class="workflow-step" style="width: 55px; height: 24px; display: flex; align-items: center; justify-content: center; background: #dc3545; color: white; font-size: 9px; font-weight: bold; border-radius: 2px; cursor: default;">
                                    <span id="step-market-icon">✗</span>
                                    <span style="margin-left: 2px;">Price</span>
                                </div>
                                <div id="step-forms" class="workflow-step" style="width: 55px; height: 24px; display: flex; align-items: center; justify-content: center; background: #6c757d; color: white; font-size: 9px; font-weight: bold; border-radius: 2px; cursor: pointer;">
                                    <span style="margin-right: 2px;">📝</span>
                                    <span>Fill</span>
                                </div>
                            </div>
                        </div>
                        <div id="api-status" style="margin-top: 4px; font-size: 10px; font-weight: bold;"></div>
                    </div>

                    <div style="margin-bottom: 10px; font-size: 9px; color: #666; min-height: 12px;">
                        <span id="ml-status">ML: <span style="color: #666;">Initializing...</span></span>
                    </div>
                    <div id="scan-controls" style="margin-bottom: 10px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
                        <!-- Scanning Group -->
                        <div style="display: flex; gap: 3px; margin-right: 12px;">
                            <button id="start-scan" style="background: linear-gradient(135deg, #28a745, #20c997); color: white; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; height: 32px; font-weight: 500; box-shadow: 0 2px 4px rgba(40,167,69,0.3); transition: all 0.2s ease;">Scan Inventory</button>
                        </div>

                        <!-- Price Fetching Group -->
                        <div style="display: flex; gap: 3px; margin-right: 12px;">
                            <button id="fetch-market-prices" style="background: linear-gradient(135deg, #ffc107, #ffb300); color: black; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; height: 32px; font-weight: 500; box-shadow: 0 2px 4px rgba(255,193,7,0.3); transition: all 0.2s ease;">Get Market Prices</button>
                        </div>

                        <div style="display: flex; gap: 3px; margin-right: 12px;">
                            <button id="fetch-filtered-prices" style="background: linear-gradient(135deg, #6f42c1, #8e44ad); color: white; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; height: 32px; font-weight: 500; box-shadow: 0 2px 4px rgba(111,66,193,0.3); transition: all 0.2s ease;">Get Filtered Prices</button>
                        </div>

                        <!-- Market Actions Group -->
                        <div style="display: flex; gap: 3px;">
                            <button id="clear-price-targets" style="background: linear-gradient(135deg, #dc3545, #e74c3c); color: white; border: none; padding: 6px 8px; border-radius: 6px; cursor: pointer; height: 32px; font-size: 12px; box-shadow: 0 2px 4px rgba(220,53,69,0.3); transition: all 0.2s ease;">Clear Targets</button>
                        </div>
                    </div>
                    <div style="flex: 1; overflow-y: auto; min-height: 200px;">
                        <div style="margin-bottom: 10px;">
                            <div style="display: flex; align-items: center; margin-bottom: 5px; flex-wrap: wrap; gap: 10px;">
                                <label style="display: flex; align-items: center; font-size: 12px; cursor: pointer;">
                                    <input type="checkbox" id="show-ignored" style="margin-right: 4px;">
                                    Ignored
                                </label>
                                <label style="display: flex; align-items: center; font-size: 12px; cursor: pointer;">
                                    <input type="checkbox" id="hide-low-value" checked style="margin-right: 4px;">
                                    Hide below $
                                    <input type="text" id="min-value-input" value="5,000,000" style="width: 70px; margin-left: 4px; padding: 2px; border: 1px solid #ccc; border-radius: 2px; font-size: 11px;" placeholder="5000000">
                                </label>
                                <label style="display: flex; align-items: center; font-size: 12px; cursor: pointer;">
                                    <select id="category-filter" style="padding: 2px 4px; border: 1px solid #ccc; border-radius: 2px; font-size: 11px; background: white;">
                                        <option value="All">All</option>
                                    </select>
                                </label>
                            </div>
                            <table id="all-items-table" style="width: 100%; border-collapse: collapse; font-size: 12px; table-layout: fixed;">
                                <thead>
                                    <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
                                        <th style="padding: 6px; text-align: center; border: 1px solid #dee2e6; width: 25px;" title="Ignore Item">
                                            🗙
                                        </th>
                                        <th id="header-name" style="padding: 6px; text-align: left; border: 1px solid #dee2e6; cursor: pointer; user-select: none;">
                                            Name <span id="sort-name" style="float: right;">↕</span>
                                        </th>
                                        <th id="header-qty" style="padding: 6px; text-align: center; border: 1px solid #dee2e6; width: 40px; cursor: pointer; user-select: none;">
                                            Qty <span id="sort-qty" style="float: right;">↕</span>
                                        </th>
                                        <th id="trade-column-header" style="padding: 6px; text-align: center; border: 1px solid #dee2e6; width: 50px; cursor: pointer; user-select: none; display: none;">
                                            Trade <span id="sort-trade" style="float: right;">↕</span>
                                        </th>
                                        <th id="header-price" style="padding: 6px; text-align: center; border: 1px solid #dee2e6; width: 140px; cursor: pointer; user-select: none;">
                                            Price & Chart <span id="sort-price" style="float: right;">↕</span>
                                        </th>
                                        <th id="header-estimated" style="padding: 6px; text-align: center; border: 1px solid #dee2e6; width: 90px; cursor: pointer; user-select: none;">
                                            Est. Value <span id="sort-estimated" style="float: right;">↕</span>
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

        // Add event listener for Fill Forms workflow step
        document.getElementById('step-forms').addEventListener('click', handleWorkflowFillForms);

        document.getElementById('start-scan').addEventListener('click', startInventoryScan);
        document.getElementById('save-api-key').addEventListener('click', handleSaveApiKey);
        document.getElementById('logout-api-key').addEventListener('click', handleLogoutApiKey);
        document.getElementById('fetch-api-data').addEventListener('click', handleFetchApiData);
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
        document.getElementById('category-filter').addEventListener('change', () => {
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

        document.getElementById('clear-price-targets').addEventListener('click', () => {
            if (confirm('Clear all price targets? This will remove all selected prices for market posting.')) {
                clearAllPriceTargets();
            }
        });

        // Full reset button
        document.getElementById('full-reset-btn').addEventListener('click', handleFullReset);

        // Add column header event listeners for sorting
        document.getElementById('header-name').addEventListener('click', () => sortTableDynamic('name'));
        document.getElementById('header-qty').addEventListener('click', () => sortTableDynamic('qty'));
        document.getElementById('trade-column-header').addEventListener('click', () => sortTableDynamic('trade'));
        document.getElementById('header-price').addEventListener('click', () => sortTableDynamic('price'));
        document.getElementById('header-estimated').addEventListener('click', () => sortTableDynamic('estimated'));

        // Load ignored items from storage
        loadIgnoredItems();

        // Load and apply filter state
        const filterState = loadFilterState();
        applyFilterState(filterState);

        // Populate category dropdown
        populateCategoryFilter();

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
            if (apiStatus) {
                apiStatus.textContent = 'Please enter an API key';
                apiStatus.style.color = '#dc3545';
            }
            return;
        }

        saveApiKey(key);
        apiKeyInput.value = '';

        if (apiStatus) {
            apiStatus.textContent = 'API key saved!';
            apiStatus.style.color = '#28a745';
        }

        // Update button visibility
        updateApiButtonVisibility();

        // Update workflow progress
        updateWorkflowProgress();

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
        if (apiStatus) {
            apiStatus.textContent = 'Logged out successfully';
            apiStatus.style.color = '#28a745';
        }

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

        if (!apiKey) {
            log('Error: Please save an API key first');
            return;
        }

        if (scannedItems.size === 0) {
            log('Error: No items to fetch prices for. Scan items first.');
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
        // Clear market data from memory and storage
        marketData.clear();
        localStorage.removeItem(MARKET_DATA_STORAGE_KEY);
        localStorage.removeItem(MARKET_EXPIRY_STORAGE_KEY);

        // Also reset API state to prevent any stuck conditions
        resetApiState();

        // Update display
        updateTableDisplay();

        log('Market cache cleared successfully');

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

    // Optimized function to update only a single row instead of entire table
    function updateSingleRowDisplay(itemId) {
        const tbody = document.getElementById('items-table-body');
        if (!tbody) return;

        // Find the row for this item
        const rows = tbody.querySelectorAll('tr');
        const targetRow = Array.from(rows).find(row => {
            const button = row.querySelector('.ignore-btn');
            return button && button.getAttribute('data-item-id') === itemId.toString();
        });

        if (!targetRow) {
            console.debug(`[Scrap2Mark] Row not found for item ${itemId}, falling back to full update`);
            updateTableDisplay();
            return;
        }

        // Get item data - find using correct approach since key format is complex
        const item = Array.from(scannedItems.values()).find(item => item.id.toString() === itemId.toString());
        if (!item) return;

        const itemIgnored = isItemIgnored(itemId);

        // Check if we should hide this row based on current filter settings
        const showIgnoredCheckbox = document.getElementById('show-ignored');
        const showIgnored = showIgnoredCheckbox ? showIgnoredCheckbox.checked : false;

        // Hide the row if item is ignored and show-ignored is unchecked
        if (itemIgnored && !showIgnored) {
            targetRow.style.display = 'none';
            return;
        } else {
            targetRow.style.display = '';
        }

        // Update row styling for ignore status
        if (itemIgnored) {
            // Clear any existing background colors first
            targetRow.style.backgroundColor = '';
            targetRow.style.background = '';
            // Apply ignore styling with high specificity
            targetRow.style.setProperty('background-color', '#f0f0f0', 'important');
            targetRow.style.opacity = '0.7';
        } else {
            // Remove ignore styling and apply price target coloring if applicable
            targetRow.style.removeProperty('background-color');
            targetRow.style.background = '';
            targetRow.style.opacity = '';

            // Apply price target row coloring
            const storageKey = `scrap2mark_price_targets_${itemId}`;
            const storedTargets = localStorage.getItem(storageKey);

            if (storedTargets) {
                try {
                    const targets = JSON.parse(storedTargets);
                    if (Object.keys(targets).length > 0) {
                        const timestamp = localStorage.getItem(`scrap2mark_timestamp_${itemId}`);
                        if (timestamp) {
                            const ageMinutes = (Date.now() - parseInt(timestamp)) / (1000 * 60);
                            if (ageMinutes <= 1) {
                                targetRow.style.setProperty('background-color', '#d4edda', 'important'); // Green
                            } else if (ageMinutes <= 30) {
                                targetRow.style.setProperty('background-color', '#e7f3ff', 'important'); // Light blue
                            } else {
                                targetRow.style.setProperty('background-color', '#fff3cd', 'important'); // Yellow
                            }
                        } else {
                            targetRow.style.setProperty('background-color', '#d4edda', 'important'); // Default green
                        }
                    }
                } catch (e) {
                    console.debug(`[Scrap2Mark] Error updating row color for ${itemId}:`, e);
                }
            }
        }

        // Update ignore button icon and title
        const ignoreButton = targetRow.querySelector('.ignore-btn');
        if (ignoreButton) {
            const ignoreIcon = itemIgnored ? '↻' : '🗙';
            const ignoreTitle = itemIgnored ? 'Unignore this item' : 'Ignore this item';
            ignoreButton.textContent = ignoreIcon;
            ignoreButton.title = ignoreTitle;
            ignoreButton.className = itemIgnored ? 'ignore-btn unignore' : 'ignore-btn ignore';
        }
    }

    // Update table display
    function updateTableDisplay() {
        if (!floatingTable) {
            log('Warning: floatingTable not found in updateTableDisplay');
            return;
        }

        // Update workflow progress
        updateWorkflowProgress();

        // Update category filter options
        populateCategoryFilter();

        const tbody = document.getElementById('items-table-body');
        const showIgnoredCheckbox = document.getElementById('show-ignored');
        const hideLowValueCheckbox = document.getElementById('hide-low-value');
        const minValueInput = document.getElementById('min-value-input');
        const categoryFilter = document.getElementById('category-filter');

        if (!tbody) {
            log('Warning: items-table-body not found in updateTableDisplay');
            return;
        }

        tbody.innerHTML = '';

        const showNonTradeable = false; // Always false since we removed the checkbox
        const showIgnored = showIgnoredCheckbox ? showIgnoredCheckbox.checked : false;
        const hideLowValue = hideLowValueCheckbox ? hideLowValueCheckbox.checked : false;
        const minValue = minValueInput ? parseFloat(minValueInput.value.replace(/[,$]/g, '')) || 0 : 0;
        const selectedCategory = categoryFilter ? categoryFilter.value : 'All';

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

            // Filter by category
            if (selectedCategory !== 'All' && itemCategory !== selectedCategory) {
                return; // Skip items that don't match selected category
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
                        <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
                            <div style="font-size: 9px; color: #666; font-weight: bold;">$${displayPrice.toLocaleString()}</div>
                            <div class="price-chart-hover" data-item-id="${itemId}" data-item-name="${itemName}" style="cursor: help;" title="">${chart}</div>
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

            // Create action button (ignore) - now as icon
            const ignoreIcon = itemIgnored ? '↻' : '🗙';
            const ignoreTitle = itemIgnored ? 'Unignore this item' : 'Ignore this item';
            const ignoreButtonClass = itemIgnored ? 'ignore-btn unignore' : 'ignore-btn ignore';

            // Determine row background color based on price target selection timing
            let rowBackgroundColor = '';

            // Check if this item has stored price targets
            const storageKey = `scrap2mark_price_targets_${itemId}`;
            const storedTargets = localStorage.getItem(storageKey);

            if (storedTargets) {
                try {
                    const targets = JSON.parse(storedTargets);
                    if (Object.keys(targets).length > 0) {
                        // Get timestamp of most recent selection
                        const timestamp = localStorage.getItem(`scrap2mark_timestamp_${itemId}`);

                        if (timestamp) {
                            const ageMinutes = (Date.now() - parseInt(timestamp)) / (1000 * 60);

                            if (ageMinutes <= 1) {
                                rowBackgroundColor = 'background-color: #d4edda;'; // Green for just selected
                            } else if (ageMinutes <= 30) {
                                rowBackgroundColor = 'background-color: #e7f3ff;'; // Light blue for within 30 minutes
                            } else {
                                rowBackgroundColor = 'background-color: #fff3cd;'; // Yellow for older
                            }
                        } else {
                            rowBackgroundColor = 'background-color: #d4edda;'; // Default to green if no timestamp
                        }
                    }
                } catch (e) {
                    console.debug(`[Scrap2Mark] Error parsing stored targets for ${itemId}:`, e);
                }
            }

            // Create row
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid #dee2e6';
            row.style.cssText += rowStyle;
            if (rowBackgroundColor) {
                row.style.cssText += rowBackgroundColor;
            }
            row.innerHTML = `
                <td style="padding: 2px; border: 1px solid #dee2e6; text-align: center;">
                    <button class="${ignoreButtonClass}" data-item-id="${itemId}" style="background: none; border: none; cursor: pointer; font-size: 14px; padding: 2px;" title="${ignoreTitle}">${ignoreIcon}</button>
                </td>
                <td style="padding: 3px; border: 1px solid #dee2e6; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${itemName}">${itemName}</td>
                <td style="padding: 3px; border: 1px solid #dee2e6; text-align: center;">${itemQuantity}</td>
                <td class="trade-column-cell" style="padding: 3px; border: 1px solid #dee2e6; color: ${tradeableColor}; font-weight: bold; text-align: center; display: none;">${tradeableDisplay}</td>
                <td style="padding: 2px; border: 1px solid #dee2e6; text-align: center;">${priceDisplay}</td>
                <td style="padding: 3px; border: 1px solid #dee2e6; text-align: center; font-weight: bold; color: ${estimatedValue > 0 ? '#28a745' : '#666'};">${estimatedValueDisplay}</td>
            `;

            // Add event listener to the ignore button
            const ignoreButton = row.querySelector('.ignore-btn');
            if (ignoreButton) {
                ignoreButton.addEventListener('click', () => {
                    toggleIgnoreItem(itemId);
                });
            }

            tbody.appendChild(row);

            // Enhance with ML prediction in the background (if ML is enabled)
            if (ML_ENABLED && mlServerStatus === 'online') {
                enhanceEstimatedValueWithML(row, itemId, itemQuantity);
            }
        });

        // Update Trade column cell visibility for all rows
        const tradeColumnCells = document.querySelectorAll('.trade-column-cell');
        tradeColumnCells.forEach(cell => {
            cell.style.display = showNonTradeable ? 'table-cell' : 'none';
        });

        const unknownCount = sortedItems.length - tradeableCount - nonTradeableCount;
        const filterText = showNonTradeable ? '' : ' (filtered)';

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
    let globalClickOutsideHandler;
    let popupShouldStayOpen = false;

    // Track mouse position globally for popup positioning
    document.addEventListener('mousemove', (e) => {
        window.lastMouseX = e.clientX;
        window.lastMouseY = e.clientY;
    });

    // Add hover popup functionality
    function addPriceChartHoverHandlers() {
        // Get all table rows in the main items table
        const tableRows = document.querySelectorAll('#all-items-table tbody tr');

        tableRows.forEach(row => {
            // Extract item data from the price chart element in this row
            const priceChart = row.querySelector('.price-chart-hover');
            if (!priceChart) return; // Skip rows without price charts

            const itemId = priceChart.getAttribute('data-item-id');
            const itemName = priceChart.getAttribute('data-item-name');

            if (!itemId || !itemName) return; // Skip if missing data

            let showTimeout;

            row.addEventListener('mouseenter', (e) => {
                // Clear any existing hide timeout
                if (globalHideTimeout) {
                    clearTimeout(globalHideTimeout);
                    globalHideTimeout = null;
                }

                // Capture the data immediately before the timeout
                const mouseEvent = { clientX: e.clientX, clientY: e.clientY };

                // Show popup after 500ms delay to prevent flicker
                showTimeout = setTimeout(() => {
                    const marketInfo = marketData.get(itemId);

                    if (marketInfo && marketInfo.listings) {
                        showPricePopup(mouseEvent, marketInfo.listings, itemName, itemId);
                    }
                }, 500);
            });

            row.addEventListener('mouseleave', () => {
                // Clear show timeout if still pending
                if (showTimeout) {
                    clearTimeout(showTimeout);
                    showTimeout = null;
                }

                // Set a delayed hide timeout to allow mouse movement to popup
                globalHideTimeout = setTimeout(() => {
                    // Only hide if there's no popup or mouse is not over popup
                    const popup = document.getElementById('price-popup');
                    if (popup) {
                        const rect = popup.getBoundingClientRect();
                        const x = window.lastMouseX || 0;
                        const y = window.lastMouseY || 0;

                        const isOverPopup = x >= rect.left && x <= rect.right &&
                                          y >= rect.top && y <= rect.bottom;

                        if (!isOverPopup) {
                            hidePricePopup();
                        }
                    } else {
                        hidePricePopup();
                    }
                    globalHideTimeout = null;
                }, 300); // Give 300ms to move to popup
            });
        });
    }

    // Update existing popup with new chart content
    function updatePricePopup(listings, itemName, itemId = null, zoomMin = null, zoomMax = null) {
        const popup = document.getElementById('price-popup');
        if (!popup) return;

        // Update the content with new chart
        popup.innerHTML = createDetailedPriceChart(listings, itemName, itemId, zoomMin, zoomMax);

        // Re-add chart interaction handlers after content update
        addChartInteraction(listings, itemName, itemId);

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

        // Set flag to keep popup open
        popupShouldStayOpen = true;

        const popup = document.createElement('div');
        popup.id = 'price-popup';
        popup.innerHTML = createDetailedPriceChart(listings, itemName, itemId, zoomMin, zoomMax);
        popup.style.position = 'fixed';
        popup.style.zIndex = '1000000';
        popup.style.maxWidth = '350px';
        popup.style.pointerEvents = 'auto';

        // Make popup interactive with click-outside and hover timeout handling
        popup.addEventListener('mouseenter', (e) => {
            console.debug('[Scrap2Mark] Popup mouseenter - clearing any timeouts');
            // Always clear timeouts when entering popup
            if (globalHideTimeout) {
                clearTimeout(globalHideTimeout);
                globalHideTimeout = null;
            }
        });

        // Hide popup after 2 seconds of not hovering
        popup.addEventListener('mouseleave', (e) => {
            console.debug('[Scrap2Mark] Popup mouseleave - setting 2 second timeout');
            globalHideTimeout = setTimeout(() => {
                console.debug('[Scrap2Mark] Hiding popup after 2 second timeout');
                hidePricePopup();
            }, 2000); // 2 seconds
        });

        // Prevent popup from closing when clicking inside it
        popup.addEventListener('click', (e) => {
            console.debug('[Scrap2Mark] Popup clicked - preventing close and clearing timeout');
            if (globalHideTimeout) {
                clearTimeout(globalHideTimeout);
                globalHideTimeout = null;
            }
            e.stopPropagation();
        });

        // Keep popup open on any mouse movement inside
        popup.addEventListener('mousemove', (e) => {
            if (globalHideTimeout) {
                clearTimeout(globalHideTimeout);
                globalHideTimeout = null;
            }
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

        // Add click-outside handler to hide popup
        globalClickOutsideHandler = (e) => {
            if (!popup.contains(e.target)) {
                console.debug('[Scrap2Mark] Clicked outside popup - hiding');
                hidePricePopup();
            }
        };

        // Add the click outside listener after a short delay to prevent immediate closing
        setTimeout(() => {
            document.addEventListener('click', globalClickOutsideHandler);
        }, 100);

        // Add chart interaction handlers after popup is added to DOM
        addChartInteraction(listings, itemName, itemId);

        // Add panel expansion handlers
        addPanelHandlers();
    }

    // Add panel interaction handlers (simplified for integrated layout)
    function addPanelHandlers() {
        // No expand/collapse buttons needed anymore since listings are integrated
        const clearBtn = document.getElementById('clear-targets-btn');

        // Add event listeners for price target radio buttons
        const radioButtons = document.querySelectorAll('.price-target-radio');
        console.debug(`[Scrap2Mark] Setting up ${radioButtons.length} price target radio buttons`);

        radioButtons.forEach(radioButton => {
            const originalPrice = parseFloat(radioButton.getAttribute('data-original-price'));
            const targetPrice = parseFloat(radioButton.getAttribute('data-target-price'));

            // Restore radio button state from stored data
            if (selectedPriceTargets.has(originalPrice)) {
                const storedTargetPrice = selectedPriceTargets.get(originalPrice);
                if (Math.abs(storedTargetPrice - targetPrice) < 0.01) { // Compare with small tolerance
                    radioButton.checked = true;
                    console.debug(`[Scrap2Mark] Restored radio button: ${originalPrice} -> ${targetPrice}`);
                }
            }

            radioButton.addEventListener('change', (e) => {
                console.debug('[Scrap2Mark] Radio button changed:', e.target.checked);

                // Clear any pending timeouts when user interacts
                if (globalHideTimeout) {
                    clearTimeout(globalHideTimeout);
                    globalHideTimeout = null;
                }

                const originalPrice = parseFloat(e.target.getAttribute('data-original-price'));
                const targetPrice = parseFloat(e.target.getAttribute('data-target-price'));
                const isChecked = e.target.checked;

                togglePriceTarget(originalPrice, targetPrice, isChecked);

                // Prevent event bubbling
                e.stopPropagation();
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
    let userInteracting = false; // Flag to prevent auto-close during interaction

    // Load price targets from localStorage
    function loadPriceTargets(itemId) {
        currentItemId = itemId;
        const storageKey = `scrap2mark_price_targets_${itemId}`;
        const stored = localStorage.getItem(storageKey);

        console.debug(`[Scrap2Mark] Loading price targets for item ${itemId}, storage key: ${storageKey}`);

        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                selectedPriceTargets = new Map(Object.entries(parsed).map(([k, v]) => [parseFloat(k), v]));
                console.debug(`[Scrap2Mark] Loaded ${selectedPriceTargets.size} price targets:`, Array.from(selectedPriceTargets.entries()));
            } catch (e) {
                console.warn(`[Scrap2Mark] Failed to parse price targets for ${itemId}:`, e);
                selectedPriceTargets = new Map();
            }
        } else {
            console.debug(`[Scrap2Mark] No stored price targets found for item ${itemId}`);
            selectedPriceTargets = new Map();
        }
    }

    // Save price targets to localStorage
    function savePriceTargets() {
        if (!currentItemId) return;

        const storageKey = `scrap2mark_price_targets_${currentItemId}`;
        const toStore = Object.fromEntries(selectedPriceTargets.entries());
        localStorage.setItem(storageKey, JSON.stringify(toStore));

        console.debug(`[Scrap2Mark] Saved price targets for item ${currentItemId}:`, toStore);
    }

    // Toggle price target selection
    function togglePriceTarget(originalPrice, targetPrice, isSelected) {
        console.debug(`[Scrap2Mark] Toggle price target: ${originalPrice} -> ${targetPrice}, selected: ${isSelected}`);

        // Clear any pending hide timeouts during interaction
        if (globalHideTimeout) {
            clearTimeout(globalHideTimeout);
            globalHideTimeout = null;
        }

        if (isSelected) {
            // For radio buttons, clear any existing selection for this item first
            selectedPriceTargets.clear();

            // Set the new selection
            selectedPriceTargets.set(originalPrice, targetPrice);
            // Store timestamp for color coding
            localStorage.setItem(`scrap2mark_timestamp_${currentItemId}`, Date.now().toString());
            // Record manual price selection for ML training (non-blocking)
            recordPriceSelection(currentItemId, targetPrice, 'manual-selection').catch(err => {
                console.debug('[Scrap2Mark] ML training data send failed:', err);
            });
        } else {
            selectedPriceTargets.delete(originalPrice);
            localStorage.removeItem(`scrap2mark_timestamp_${currentItemId}`);
        }
        updateSelectedTargetsDisplay();
        savePriceTargets();

        // Optimized: Only update the specific row color instead of entire table
        if (currentItemId) {
            updateSingleRowDisplay(currentItemId);
        }
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
        // Remove timestamp for this item
        if (currentItemId) {
            localStorage.removeItem(`scrap2mark_timestamp_${currentItemId}`);
        }
        // Uncheck all radio buttons
        const radioButtons = document.querySelectorAll('.price-target-radio');
        radioButtons.forEach(rb => {
            rb.checked = false;
        });
        updateSelectedTargetsDisplay();
        savePriceTargets();

        // Optimized: Only update the specific row color instead of entire table
        if (currentItemId) {
            updateSingleRowDisplay(currentItemId);
        }
    }

    // Make functions global so they can be called from HTML
    window.togglePriceTarget = togglePriceTarget;
    window.clearAllTargets = clearAllTargets;

    // Add chart interaction functionality
    function addChartInteraction(listings, itemName, itemId = null) {
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
                updatePricePopup(listings, itemName, itemId, zoomMin, zoomMax);
            }
        });

        // Reset zoom functionality
        if (resetZoomBtn) {
            resetZoomBtn.addEventListener('click', () => {
                // Reset zoom (keep existing popup)
                updatePricePopup(listings, itemName, itemId);
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

        // Remove any click-outside handlers
        if (globalClickOutsideHandler) {
            document.removeEventListener('click', globalClickOutsideHandler);
            globalClickOutsideHandler = null;
        }

        // Clear the flag when popup is hidden
        popupShouldStayOpen = false;

        // Clear any pending timeouts
        if (globalHideTimeout) {
            clearTimeout(globalHideTimeout);
            globalHideTimeout = null;
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
        // Get all localStorage keys that start with our price target or timestamp prefix
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('scrap2mark_price_targets_') || key.startsWith('scrap2mark_timestamp_'))) {
                keysToRemove.push(key);
            }
        }

        // Remove all price target and timestamp keys
        keysToRemove.forEach(key => localStorage.removeItem(key));

        // Update the display to reflect changes
        updateTableDisplay();
        log(`Cleared ${keysToRemove.length} price targets and timestamps`);
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
            log('Warning: Scanning without API key - tradeable status will be unknown');
        }

        isScanning = true;

        const startBtn = document.getElementById('start-scan');

        if (startBtn) startBtn.disabled = true;

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

        } catch (error) {
            log(`Scan failed: ${error.message}`);
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
        console.log('Scrap2Mark init() function called');
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

        // Initialize ML system
        initializeMlSystem();

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
                cursor: help;
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

                    // Find any selected price target (originalPrice -> targetPrice mapping)
                    for (const [originalPrice, targetPrice] of targets) {
                        // We found a target selection
                        allTargets[item.name] = {
                            selectedPrice: targetPrice,
                            originalPrice: originalPrice,
                            itemId: itemId
                        };
                        break; // Take the first one found
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
        const showIgnoredCheckbox = document.getElementById('show-ignored');
        const hideLowValueCheckbox = document.getElementById('hide-low-value');
        const minValueInput = document.getElementById('min-value-input');
        const categoryFilter = document.getElementById('category-filter');

        const showNonTradeable = false; // Always false since we removed the checkbox
        const showIgnored = showIgnoredCheckbox ? showIgnoredCheckbox.checked : false;
        const hideLowValue = hideLowValueCheckbox ? hideLowValueCheckbox.checked : false;
        const minValue = minValueInput ? parseFloat(minValueInput.value.replace(/[,$]/g, '')) || 0 : 0;
        const selectedCategory = categoryFilter ? categoryFilter.value : 'All';

        // Get all items and apply filters
        const allItems = Array.from(scannedItems.values());

        return allItems.filter(item => {
            const itemId = item.id || 'N/A';
            const itemTradeable = item.tradeable;
            const itemIgnored = isItemIgnored(itemId);
            const itemCategory = item.category || 'Unknown';

            // Filter non-tradeable items
            if (!showNonTradeable && itemTradeable === false) {
                return false;
            }

            // Filter ignored items
            if (!showIgnored && itemIgnored) {
                return false;
            }

            // Filter by category
            if (selectedCategory !== 'All' && itemCategory !== selectedCategory) {
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

    // ============================================================================
    // WORKFLOW PROGRESS MANAGEMENT
    // ============================================================================

    /**
     * Update workflow progress step status
     */
    function updateWorkflowStep(stepId, status, text = null) {
        const stepElement = document.getElementById(`step-${stepId}`);
        const iconElement = document.getElementById(`step-${stepId}-icon`);

        if (!stepElement || !iconElement) return;

        // Remove all status classes
        stepElement.classList.remove('step-red', 'step-yellow', 'step-green');

        switch (status) {
            case 'red':
                stepElement.style.background = '#dc3545';
                iconElement.textContent = '✗';
                break;
            case 'yellow':
                stepElement.style.background = '#ffc107';
                stepElement.style.color = 'black';
                iconElement.textContent = '⚠';
                break;
            case 'green':
                stepElement.style.background = '#28a745';
                stepElement.style.color = 'white';
                iconElement.textContent = '✓';
                break;
        }

        if (text) {
            const textElement = stepElement.querySelector('span:last-child');
            if (textElement) textElement.textContent = text;
        }
    }

    /**
     * Update all workflow steps based on current state
     */
    function updateWorkflowProgress() {
        // Step 1: API Key
        if (apiKey) {
            updateWorkflowStep('api', 'green');
        } else {
            updateWorkflowStep('api', 'red');
        }

        // Step 2: Items List Cache
        if (apiItemsData && Object.keys(apiItemsData).length > 0) {
            const cacheExpiry = localStorage.getItem(API_EXPIRY_STORAGE_KEY);
            if (cacheExpiry) {
                const daysSinceCache = (Date.now() - parseInt(cacheExpiry)) / (1000 * 60 * 60 * 24);
                if (daysSinceCache > 30) {
                    updateWorkflowStep('items', 'yellow');
                } else {
                    updateWorkflowStep('items', 'green');
                }
            } else {
                updateWorkflowStep('items', 'green');
            }
        } else {
            updateWorkflowStep('items', 'red');
        }

        // Step 3: Scanned Inventory
        if (scannedItems.size > 0) {
            // Check when last scanned - you'd need to track this
            updateWorkflowStep('inventory', 'green');
        } else {
            updateWorkflowStep('inventory', 'red');
        }

        // Step 4: Market Prices
        if (marketData.size > 0) {
            const marketExpiry = localStorage.getItem(MARKET_EXPIRY_STORAGE_KEY);
            if (marketExpiry) {
                const hoursSinceMarket = (Date.now() - parseInt(marketExpiry)) / (1000 * 60 * 60);
                if (hoursSinceMarket > 2) {
                    updateWorkflowStep('market', 'yellow');
                } else {
                    updateWorkflowStep('market', 'green');
                }
            } else {
                updateWorkflowStep('market', 'green');
            }
        } else {
            updateWorkflowStep('market', 'red');
        }

        // Step 5: Fill Forms - update button style based on prerequisites and current page
        const formsElement = document.getElementById('step-forms');
        if (formsElement) {
            // Check if any prerequisite steps are red
            const hasApiKey = apiKey;
            const hasItemsCache = apiItemsData && Object.keys(apiItemsData).length > 0;
            const hasScannedItems = scannedItems.size > 0;
            const hasMarketData = marketData.size > 0;

            const anyPrerequisiteRed = !hasApiKey || !hasItemsCache || !hasScannedItems || !hasMarketData;

            if (anyPrerequisiteRed) {
                // Any prerequisite is missing - red (blocked)
                formsElement.style.background = '#dc3545';
                formsElement.style.color = 'white';
            } else if (window.location.href.includes('ItemMarket') || window.location.href.includes('itemmarket')) {
                // On market page with all prerequisites - green (ready to fill)
                formsElement.style.background = '#28a745';
                formsElement.style.color = 'white';
            } else {
                // On items page with all prerequisites - light blue (will redirect)
                formsElement.style.background = '#17a2b8';
                formsElement.style.color = 'white';
            }
        }
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
            max-width: 700px;
            max-height: 75vh;
            overflow-y: auto;
            padding: 15px;
            color: #e0e0e0;
            border: 1px solid #555;
        `;

        const priceTargets = loadAllPriceTargets();

        // Get all available categories for filtering
        const categories = new Set(['All']);
        items.forEach(item => {
            if (item.category && item.category !== 'Unknown') {
                categories.add(item.category);
            }
        });
        if (items.some(item => !item.category || item.category === 'Unknown')) {
            categories.add('Unknown');
        }
        const sortedCategories = Array.from(categories).sort();

        modal.innerHTML = `
            <h3 style="margin-top: 0; color: #17a2b8; font-size: 16px;">Fill Market Posting Forms</h3>
            <p style="font-size: 11px; margin-bottom: 8px;">This will automatically fill forms for ${items.length} items with price targets.</p>
            <p style="font-size: 10px; color: #ffc107; background: #333; padding: 6px; border-radius: 3px; margin: 8px 0;">
                ⚠️ <strong>Note:</strong> This tool fills forms but does NOT auto-submit. Review and submit manually.
            </p>

            <!-- Filter Controls -->
            <div style="background: #333; padding: 8px; border-radius: 4px; margin-bottom: 10px; font-size: 11px;">
                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                    <label style="display: flex; align-items: center;">
                        <span style="margin-right: 4px;">Filter by category:</span>
                        <select id="modal-category-filter" style="padding: 2px 4px; border: 1px solid #666; border-radius: 2px; font-size: 10px; background: #444; color: #e0e0e0;">
                            ${sortedCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                        </select>
                    </label>
                </div>
            </div>

            <div id="items-container" style="max-height: 300px; overflow-y: auto; margin: 15px 0;">
                ${items.map(item => {
                    const target = priceTargets[item.name];
                    const itemQty = item.quantity || item.qty || 1;
                    const itemCategory = item.category || 'Unknown';
                    return `
                        <div class="item-row" data-category="${itemCategory}" style="display: flex; align-items: center; padding: 6px; border: 1px solid #444; margin-bottom: 3px; border-radius: 3px; font-size: 11px;">
                            <div style="flex: 1; min-width: 0;">
                                <strong style="font-size: 12px;">${item.name}</strong>
                                <div style="font-size: 9px; color: #aaa;">
                                    ${itemCategory} | Qty: ${itemQty} | Price: $${target.selectedPrice?.toLocaleString()}
                                </div>
                            </div>
                            <div style="margin-left: 8px; min-width: 120px;">
                                <div style="display: flex; gap: 2px; margin-bottom: 3px;">
                                    <button class="qty-btn-add" data-item="${item.name.replace(/"/g, '&quot;')}" data-qty="1" style="padding: 2px 4px; font-size: 9px; background: #007bff; color: white; border: none; border-radius: 2px; cursor: pointer;">+1</button>
                                    <button class="qty-btn-add" data-item="${item.name.replace(/"/g, '&quot;')}" data-qty="10" style="padding: 2px 4px; font-size: 9px; background: #007bff; color: white; border: none; border-radius: 2px; cursor: pointer;">+10</button>
                                    <button class="qty-btn" data-item="${item.name.replace(/"/g, '&quot;')}" data-qty="${itemQty}" style="padding: 2px 4px; font-size: 9px; background: #28a745; color: white; border: none; border-radius: 2px; cursor: pointer;">Max</button>
                                    <button class="qty-btn-reset" data-item="${item.name.replace(/"/g, '&quot;')}" style="padding: 2px 4px; font-size: 9px; background: #dc3545; color: white; border: none; border-radius: 2px; cursor: pointer;">✗</button>
                                </div>
                                <input type="number" id="qty-${item.name.replace(/"/g, '&quot;').replace(/[^a-zA-Z0-9]/g, '_')}" min="0" max="${itemQty}" value="0" style="width: 100%; padding: 3px; background: #444; color: #e0e0e0; border: 1px solid #666; border-radius: 2px; font-size: 10px;">
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div style="text-align: center; margin-top: 15px;">
                <button id="confirm-post" style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 8px; font-size: 12px;">Fill Forms</button>
                <button id="cancel-post" style="background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px;">Cancel</button>
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

        // Add filtering functionality for the modal
        const modalCategoryFilter = document.getElementById('modal-category-filter');

        function filterModalItems() {
            const selectedCategory = modalCategoryFilter.value;

            modal.querySelectorAll('.item-row').forEach(row => {
                const itemCategory = row.dataset.category;

                let shouldShow = true;

                // Filter by category
                if (selectedCategory !== 'All' && itemCategory !== selectedCategory) {
                    shouldShow = false;
                }

                row.style.display = shouldShow ? 'flex' : 'none';
            });
        }

        modalCategoryFilter.addEventListener('change', filterModalItems);

        // Initial filter
        filterModalItems();
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

        // Record price selection for ML training
        recordPriceSelection(item.itemId, item.price, 'automatic-fill');

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
        // Update workflow progress instead of old status text
        updateWorkflowProgress();
    }

    // Wait for page to be ready and initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
