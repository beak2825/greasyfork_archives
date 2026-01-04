// ==UserScript==
// @name         RugPlay X
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  Automate selling/buying on RugPlay
// @author       4koy
// @match        https://rugplay.com/*
// @match        https://*.rugplay.com/*
// @match        http://rugplay.com/*
// @match        http://*.rugplay.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540749/RugPlay%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/540749/RugPlay%20X.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        SELL_DELAY: 100,        // Delay between sell actions (ms)
        BUY_DELAY: 150,         // Delay between buy actions (ms)
        MAX_RETRIES: 50,        // Maximum number of sell attempts
        CONFIRM_DELAY: 150,     // Delay before confirming actions
        AUTO_CONFIRM: false,    // Set to true to auto-confirm transactions
        BUY_AMOUNT: 1000,       // Default buy amount in dollars
        API_ENABLED: true,      // Enable API features
        REFRESH_INTERVAL: 2000  // Portfolio refresh interval (ms)
    };

    let isRunning = false;
    let currentAction = null;
    let actionCount = 0;
    let portfolioData = null;
    let apiHeaders = null;

    // Initialize API headers from browser cookies
    function initializeApiHeaders() {
        try {
            const cookies = document.cookie.split(';').reduce((acc, cookie) => {
                const [key, value] = cookie.trim().split('=');
                if (key && value) {
                    acc[key] = decodeURIComponent(value);
                }
                return acc;
            }, {});

            console.log('Available cookies:', Object.keys(cookies));

            // Try different possible cookie names for session token
            const sessionTokenNames = [
                '__Secure-better-auth.session_token',
                'better-auth.session_token',
                'session_token',
                'auth_token',
                'sessionToken'
            ];

            const cfClearanceNames = [
                'cf_clearance',
                'cf-clearance',
                'cloudflare_clearance'
            ];

            let sessionToken = null;
            let cfClearance = null;

            // Find session token
            for (const name of sessionTokenNames) {
                if (cookies[name]) {
                    sessionToken = cookies[name];
                    console.log(`Found session token: ${name}`);
                    break;
                }
            }

            // Find cloudflare clearance
            for (const name of cfClearanceNames) {
                if (cookies[name]) {
                    cfClearance = cookies[name];
                    console.log(`Found CF clearance: ${name}`);
                    break;
                }
            }

            // For now, proceed even without cookies to test API endpoints
            apiHeaders = {
                'accept': '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'content-type': 'application/json',
                'origin': 'https://rugplay.com',
                'referer': window.location.href,
                'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Linux"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': navigator.userAgent
            };

            if (sessionToken && cfClearance) {
                console.log('🔗 API headers initialized with full authentication');
                return true;
            } else if (sessionToken || cfClearance) {
                console.log('🔗 API headers initialized with partial authentication');
                return true;
            } else {
                console.log('⚠️ No authentication cookies found, trying without auth');
                return true; // Still try API calls without auth
            }
        } catch (error) {
            console.log('❌ Error initializing API headers:', error);
            return false;
        }
    }

    // Fetch recent trades from API
    async function fetchRecentTrades() {
        if (!apiHeaders) return null;

        try {
            const response = await fetch('https://rugplay.com/api/trades/recent?limit=100', {
                method: 'GET',
                headers: apiHeaders,
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                return data.trades || [];
            } else {
                console.log('⚠️ API trades request failed:', response.status);
                return null;
            }
        } catch (error) {
            console.log('❌ Error fetching trades:', error);
            return null;
        }
    }

    // Fetch portfolio data from API (if endpoint exists)
    async function fetchPortfolioData() {
        if (!apiHeaders) return null;

        try {
            // Try common portfolio endpoints
            const endpoints = [
                '/api/portfolio',
                '/api/user/portfolio',
                '/api/account/portfolio',
                '/api/holdings'
            ];

            for (const endpoint of endpoints) {
                try {
                    const response = await fetch(`https://rugplay.com${endpoint}`, {
                        method: 'GET',
                        headers: apiHeaders,
                        credentials: 'include'
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log('📊 Portfolio data fetched from', endpoint);
                        return data;
                    }
                } catch (e) {
                    // Continue to next endpoint
                }
            }

            return null;
        } catch (error) {
            console.log('❌ Error fetching portfolio:', error);
            return null;
        }
    }

    // Enhanced cash detection using API data
    async function getAvailableCashEnhanced() {
        // First try API method
        if (CONFIG.API_ENABLED && apiHeaders) {
            const portfolio = await fetchPortfolioData();
            if (portfolio) {
                // Try common field names for cash/balance
                const cashFields = ['cash', 'balance', 'availableBalance', 'totalValue', 'usdBalance'];
                for (const field of cashFields) {
                    if (portfolio[field] !== undefined) {
                        const amount = parseFloat(portfolio[field]);
                        if (!isNaN(amount)) {
                            console.log(`💰 Found cash via API (${field}):`, amount);
                            return amount;
                        }
                    }
                }
            }
        }

        // Fallback to DOM scraping
        return getAvailableCash();
    }

    // Function to get available cash from the sidebar
    function getAvailableCash() {
        try {
            // Method 1: Look for the Cash field specifically (PRIORITY)
            const textElements = document.querySelectorAll('.text-muted-foreground .flex.justify-between');
            for (const element of textElements) {
                const spans = element.querySelectorAll('span');
                if (spans.length >= 2 && spans[0].textContent.trim() === 'Cash:') {
                    const cashSpan = spans[1];
                    if (cashSpan && cashSpan.classList.contains('font-mono')) {
                        const cashText = cashSpan.textContent.replace(/[$,]/g, '').trim();
                        const cashAmount = parseFloat(cashText);
                        if (!isNaN(cashAmount)) {
                            console.log('Found Cash amount:', cashAmount);
                            return cashAmount;
                        }
                    }
                }
            }

            // Method 2: Look for Cash pattern in sidebar content
            const sidebarContent = document.querySelector('div[data-slot="sidebar-group-content"]');
            if (sidebarContent) {
                // Look for the specific structure with "Cash:" text
                const cashElements = sidebarContent.querySelectorAll('div.flex.justify-between');
                for (const element of cashElements) {
                    const spans = element.querySelectorAll('span');
                    if (spans.length >= 2 && spans[0].textContent.trim() === 'Cash:') {
                        const cashText = spans[1].textContent.replace(/[$,]/g, '').trim();
                        const cashAmount = parseFloat(cashText);
                        if (!isNaN(cashAmount)) {
                            console.log('Found Cash in sidebar:', cashAmount);
                            return cashAmount;
                        }
                    }
                }

                // Look for any span with font-mono class containing cash
                const monoSpans = sidebarContent.querySelectorAll('span.font-mono');
                for (const span of monoSpans) {
                    const parent = span.parentElement;
                    if (parent && parent.textContent.includes('Cash:')) {
                        const cashText = span.textContent.replace(/[$,]/g, '').trim();
                        const cashAmount = parseFloat(cashText);
                        if (!isNaN(cashAmount) && cashAmount > 0) {
                            console.log('Found Cash via font-mono:', cashAmount);
                            return cashAmount;
                        }
                    }
                }

                // Broader search for cash patterns
                const allText = sidebarContent.textContent;
                const cashMatch = allText.match(/Cash:\s*\$?([\d,]+\.?\d*)/i);
                if (cashMatch) {
                    const cashAmount = parseFloat(cashMatch[1].replace(/,/g, ''));
                    if (!isNaN(cashAmount)) {
                        console.log('Found Cash via regex:', cashAmount);
                        return cashAmount;
                    }
                }
            }

            // Method 3: Fallback to Total Value structure if Cash not found
            const portfolioElements = document.querySelectorAll('div.flex.items-center.justify-between');
            for (const element of portfolioElements) {
                const textSpan = element.querySelector('span.text-sm.font-medium');
                if (textSpan && textSpan.textContent.trim().includes('Total Value')) {
                    const amountBadge = element.querySelector('span[data-slot="badge"].font-mono');
                    if (amountBadge) {
                        const cashText = amountBadge.textContent.replace(/[$,]/g, '').trim();
                        const cashAmount = parseFloat(cashText);
                        if (!isNaN(cashAmount)) {
                            console.log('Fallback - Found Total Value:', cashAmount);
                            return cashAmount;
                        }
                    }
                }
            }

            // Method 4: Look for any span with font-mono class that contains a dollar amount
            const monoSpans = document.querySelectorAll('span.font-mono');
            for (const span of monoSpans) {
                const text = span.textContent.trim();
                if (text.includes('$') && text.match(/\$[\d,]+\.?\d*/)) {
                    const parent = span.parentElement;
                    // Prioritize if parent contains "Cash:"
                    if (parent && parent.textContent.includes('Cash:')) {
                        const cashText = text.replace(/[$,]/g, '').trim();
                        const cashAmount = parseFloat(cashText);
                        if (!isNaN(cashAmount) && cashAmount > 0) {
                            console.log('Found cash amount via font-mono search:', cashAmount);
                            return cashAmount;
                        }
                    }
                }
            }

            console.log('Cash not found with any method');
            return 0;
        } catch (error) {
            console.log('Error getting cash amount:', error);
            return 0;
        }
    }

    // Function to update cash display periodically
    async function updateCashDisplay() {
        const cashElement = document.getElementById('available-cash');
        if (cashElement) {
            // Try enhanced cash detection first (with API fallback)
            const currentCash = await getAvailableCashEnhanced();
            cashElement.textContent = currentCash.toFixed(2);

            // Update the color based on amount
            const cashDisplay = cashElement.parentElement;
            if (currentCash > 0) {
                cashDisplay.style.color = '#28a745';
            } else {
                cashDisplay.style.color = '#dc3545';
            }
        }
    }

    // Create modern control panel with glassmorphism
    function createControlPanel() {
        // Check if panel already exists
        if (document.getElementById('rugplay-auto-trader')) {
            console.log('🚀 Panel already exists, skipping creation');
            return;
        }

        console.log('🚀 Creating control panel...');

        // Add custom CSS styles
        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

            #rugplay-auto-trader {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                background: rgba(255, 255, 255, 0.15);
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow:
                    0 20px 40px rgba(0, 0, 0, 0.1),
                    0 0 0 1px rgba(255, 255, 255, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            #rugplay-auto-trader:hover {
                transform: translateY(-2px);
                background: rgba(255, 255, 255, 0.2);
                box-shadow:
                    0 25px 50px rgba(0, 0, 0, 0.15),
                    0 0 0 1px rgba(255, 255, 255, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.35);
            }

            .trader-header {
                color: rgba(255, 255, 255, 0.95);
                font-weight: 600;
                font-size: 16px;
                margin: 0;
                cursor: grab;
                user-select: none;
                letter-spacing: 0.5px;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8), 0 0 4px rgba(0, 0, 0, 0.6);
            }

            .trader-header:active {
                cursor: grabbing;
            }

            .trader-input {
                background: rgba(0, 0, 0, 0.08);
                border: 1px solid rgba(0, 0, 0, 0.15);
                border-radius: 8px;
                padding: 8px 12px;
                color: rgba(255, 255, 255, 0.9);
                font-size: 13px;
                outline: none;
                transition: all 0.2s ease;
                width: 80px;
                backdrop-filter: blur(10px);
                text-shadow: 0 1px 1px rgba(0, 0, 0, 0.7);
            }

            .trader-input:focus {
                background: rgba(0, 0, 0, 0.12);
                border-color: rgba(0, 0, 0, 0.25);
                box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
            }

            .trader-checkbox {
                accent-color: rgba(0, 0, 0, 0.7);
                margin-right: 8px;
            }

            .trader-label {
                color: rgba(255, 255, 255, 0.85);
                font-size: 13px;
                font-weight: 500;
                display: flex;
                align-items: center;
                cursor: pointer;
                text-shadow: 0 1px 1px rgba(0, 0, 0, 0.7);
            }

            .trader-btn {
                border: none;
                border-radius: 10px;
                padding: 12px 20px;
                font-weight: 500;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                min-width: 110px;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }

            .trader-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            }

            .trader-btn:active {
                transform: translateY(0);
            }

            .trader-btn:disabled {
                opacity: 0.4;
                cursor: not-allowed;
                transform: none !important;
            }

            .sell-btn {
                background: rgba(255, 255, 255, 0.25);
                color: #ff4757;
                border: 1px solid rgba(255, 71, 87, 0.3);
                text-shadow: 0 1px 1px rgba(0, 0, 0, 0.6);
            }

            .sell-btn:hover {
                background: rgba(255, 255, 255, 0.35);
                border-color: rgba(255, 71, 87, 0.4);
                color: #ff3742;
            }

            .buy-btn {
                background: rgba(255, 255, 255, 0.25);
                color: #2ed573;
                border: 1px solid rgba(46, 213, 115, 0.3);
                text-shadow: 0 1px 1px rgba(0, 0, 0, 0.6);
            }

            .buy-btn:hover {
                background: rgba(255, 255, 255, 0.35);
                border-color: rgba(46, 213, 115, 0.4);
                color: #26d464;
            }

            .buy-btn:disabled {
                background: rgba(255, 255, 255, 0.15);
                color: rgba(46, 213, 115, 0.4);
                border-color: rgba(46, 213, 115, 0.2);
            }

            .stop-btn {
                background: rgba(255, 255, 255, 0.25);
                color: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.3);
                text-shadow: 0 1px 1px rgba(0, 0, 0, 0.6);
            }

            .stop-btn:hover {
                background: rgba(255, 255, 255, 0.35);
                border-color: rgba(255, 255, 255, 0.4);
                color: rgba(255, 255, 255, 0.95);
            }

            .trader-status {
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(0, 0, 0, 0.15);
                border-radius: 10px;
                padding: 12px;
                font-size: 11px;
                height: 80px;
                overflow-y: auto;
                overflow-x: hidden;
                color: rgba(255, 255, 255, 0.9);
                font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
                line-height: 1.4;
                word-wrap: break-word;
                word-break: break-word;
                white-space: pre-wrap;
                max-width: 100%;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                text-shadow: 0 1px 1px rgba(0, 0, 0, 0.7);
            }

            .trader-status::-webkit-scrollbar {
                width: 4px;
            }

            .trader-status::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.1);
                border-radius: 2px;
            }

            .trader-status::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 2px;
            }

            .trader-status::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 0, 0, 0.4);
            }

            .trader-counter {
                color: rgba(255, 255, 255, 0.7);
                font-size: 11px;
                font-weight: 500;
                text-shadow: 0 1px 1px rgba(0, 0, 0, 0.7);
            }

            .trader-counter span {
                color: rgba(255, 255, 255, 0.95);
                font-weight: 600;
            }

            .drag-handle {
                position: absolute;
                top: 8px;
                right: 12px;
                color: rgba(255, 255, 255, 0.5);
                cursor: grab;
                font-size: 12px;
                text-shadow: 0 1px 1px rgba(0, 0, 0, 0.6);
            }

            .drag-handle:active {
                cursor: grabbing;
            }

            .max-btn {
                background: rgba(255, 255, 255, 0.25);
                color: rgba(255, 255, 255, 0.9);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                padding: 8px 14px;
                font-weight: 500;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                backdrop-filter: blur(10px);
                text-shadow: 0 1px 1px rgba(0, 0, 0, 0.6);
            }

            .max-btn:hover {
                background: rgba(255, 255, 255, 0.35);
                border-color: rgba(255, 255, 255, 0.3);
                color: rgba(255, 255, 255, 1);
            }

            .cash-display {
                font-size: 13px;
                color: #2ed573;
                font-weight: 600;
                margin-top: 8px;
                display: flex;
                align-items: center;
                gap: 4px;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
            }

            .cash-icon {
                width: 14px;
                height: 14px;
                fill: #2ed573;
                filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.6));
            }

            /* Tab System Styles */
            .tab-container {
                margin-bottom: 20px;
            }

            .tab-nav {
                display: flex;
                border-bottom: 1px solid rgba(0, 0, 0, 0.2);
                margin-bottom: 16px;
                backdrop-filter: blur(5px);
            }

            .tab-btn {
                flex: 1;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                padding: 12px 8px;
                color: rgba(255, 255, 255, 0.7);
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-bottom: 2px solid transparent;
                text-shadow: 0 1px 1px rgba(0, 0, 0, 0.6);
            }

            .tab-btn:hover {
                color: rgba(255, 255, 255, 0.9);
                background: rgba(255, 255, 255, 0.2);
            }

            .tab-btn.active {
                color: rgba(255, 255, 255, 1);
                background: rgba(255, 255, 255, 0.25);
                border-bottom-color: rgba(255, 255, 255, 0.8);
            }

            .tab-content {
                display: none;
                animation: fadeIn 0.3s ease;
            }

            .tab-content.active {
                display: block;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .tab-section {
                margin-bottom: 16px;
            }

            .section-title {
                color: rgba(255, 255, 255, 0.9);
                font-size: 13px;
                font-weight: 600;
                margin-bottom: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                text-shadow: 0 1px 1px rgba(0, 0, 0, 0.7);
            }
        `;
        document.head.appendChild(style);

        const panel = document.createElement('div');
        panel.id = 'rugplay-auto-trader';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            border-radius: 20px;
            padding: 24px;
            z-index: 10000;
            width: 340px;
            max-width: 340px;
            min-width: 340px;
            box-sizing: border-box;
            user-select: none;
        `;

        panel.innerHTML = `
            <div class="drag-handle">⋮⋮</div>

            <div style="text-align: center; margin-bottom: 20px;">
                <h3 class="trader-header">RugPlay Trader Pub</h3>
            </div>

            <!-- Tab Navigation -->
            <div class="tab-container">
                <div class="tab-nav">
                    <button class="tab-btn active" data-tab="trading">Trading</button>
                    <button class="tab-btn" data-tab="settings">Settings</button>
                </div>

                <!-- Trading Tab -->
                <div class="tab-content active" id="trading">
                    <div class="tab-section">
                        <div class="section-title">Trading Controls</div>
                        <div style="display: flex; gap: 16px; margin-bottom: 20px; align-items: center;">
                            <div style="flex: 1;">
                                <label class="trader-label" style="margin-bottom: 6px; display: block;">
                                    Delay (ms)
                                </label>
                                <input type="number" id="delay-input" value="${CONFIG.SELL_DELAY}" class="trader-input">
                            </div>
                            <div style="flex: 1;">
                                <label class="trader-label">
                                    <input type="checkbox" id="auto-confirm" ${CONFIG.AUTO_CONFIRM ? 'checked' : ''} class="trader-checkbox">
                                    Auto-confirm
                                </label>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                            <button id="sell-all-btn" class="trader-btn sell-btn">
                                Sell All
                            </button>
                            <button id="buy-btn" class="trader-btn buy-btn">
                                Buy
                            </button>
                        </div>

                        <div style="margin-bottom: 16px;">
                            <label class="trader-label" style="margin-bottom: 6px; display: block;">
                                Buy Amount ($)
                            </label>
                            <div style="display: flex; gap: 8px; align-items: center;">
                                <input type="number" id="buy-amount-input" value="${CONFIG.BUY_AMOUNT}" class="trader-input" style="flex: 1; max-width: 120px;" step="0.01" min="0.01" placeholder="Enter amount">
                                <button id="max-buy-btn" class="max-btn" type="button">
                                    Max
                                </button>
                            </div>
                        </div>

                        <button id="stop-btn" class="trader-btn stop-btn" style="width: 100%" disabled>
                            Stop Trading
                        </button>
                    </div>

                    <div class="tab-section">
                        <div class="section-title">Portfolio Info</div>
                        <div style="margin-top: 16px; text-align: center;">
                            <div class="cash-display">
                                <svg class="cash-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8 8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                                Available Cash: $<span id="available-cash">${getAvailableCash().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Settings Tab -->
                <div class="tab-content" id="settings">
                    <div class="tab-section">
                        <div class="section-title">System Settings</div>
                        <div style="margin-bottom: 16px;">
                            <label class="trader-label" style="margin-bottom: 6px; display: block;">
                                Refresh Interval (ms)
                            </label>
                            <input type="number" id="refresh-interval" value="${CONFIG.REFRESH_INTERVAL}" class="trader-input">
                        </div>

                        <div style="margin-bottom: 16px;">
                            <label class="trader-label">
                                <input type="checkbox" id="api-enabled" ${CONFIG.API_ENABLED ? 'checked' : ''} class="trader-checkbox">
                                Enable API features
                            </label>
                        </div>
                    </div>

                    <div class="tab-section">
                        <div class="section-title">Trading Limits</div>
                        <div style="margin-bottom: 16px;">
                            <label class="trader-label" style="margin-bottom: 6px; display: block;">
                                Max Retries
                            </label>
                            <input type="number" id="max-retries" value="${CONFIG.MAX_RETRIES}" class="trader-input" min="1" max="100">
                        </div>

                        <div style="margin-bottom: 16px;">
                            <label class="trader-label" style="margin-bottom: 6px; display: block;">
                                Confirm Delay (ms)
                            </label>
                            <input type="number" id="confirm-delay" value="${CONFIG.CONFIRM_DELAY}" class="trader-input" min="50" max="2000">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Status and Counter (Always Visible) -->
            <div style="margin-top: 20px;">
                <div id="status" class="trader-status">
                    <div>System ready for trading...</div>
                </div>

                <div style="text-align: center; margin-top: 16px;" class="trader-counter">
                    Actions completed: <span id="action-counter">0</span>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        makeDraggable(panel);
        setupEventListeners();
    }

    // Make panel draggable
    function makeDraggable(element) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        const header = element.querySelector('.trader-header');
        const dragHandle = element.querySelector('.drag-handle');

        [header, dragHandle].forEach(handle => {
            if (handle) {
                handle.addEventListener('mousedown', dragStart);
                handle.addEventListener('touchstart', dragStart);
            }
        });

        function dragStart(e) {
            if (e.type === 'touchstart') {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }

            if (e.target === header || e.target === dragHandle) {
                isDragging = true;
                element.style.transition = 'none';
                document.addEventListener('mousemove', drag);
                document.addEventListener('touchmove', drag);
                document.addEventListener('mouseup', dragEnd);
                document.addEventListener('touchend', dragEnd);
            }
        }

        function drag(e) {
            if (!isDragging) return;

            e.preventDefault();

            if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            // Allow free movement anywhere - no viewport constraints
            element.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        }

        function dragEnd() {
            isDragging = false;
            element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('touchend', dragEnd);
        }
    }

    function setupEventListeners() {
        document.getElementById('sell-all-btn').addEventListener('click', startSelling);
        document.getElementById('buy-btn').addEventListener('click', startBuying);
        document.getElementById('stop-btn').addEventListener('click', stopAction);

        document.getElementById('delay-input').addEventListener('change', (e) => {
            CONFIG.SELL_DELAY = parseInt(e.target.value) || 200;
            CONFIG.BUY_DELAY = CONFIG.SELL_DELAY * 1.25;
        });

        document.getElementById('auto-confirm').addEventListener('change', (e) => {
            CONFIG.AUTO_CONFIRM = e.target.checked;
        });

        document.getElementById('buy-amount-input').addEventListener('change', (e) => {
            CONFIG.BUY_AMOUNT = parseFloat(e.target.value) || 100;
        });

        document.getElementById('max-buy-btn').addEventListener('click', () => {
            const availableCash = getAvailableCash();
            // Round down to nearest dollar since exchange doesn't accept cents
            const maxAmount = Math.floor(availableCash);
            document.getElementById('buy-amount-input').value = maxAmount;
            CONFIG.BUY_AMOUNT = maxAmount;
            updateStatus(`Set buy amount to maximum: $${maxAmount} (rounded down from $${availableCash.toFixed(2)})`);
        });

        document.getElementById('refresh-interval').addEventListener('change', (e) => {
            CONFIG.REFRESH_INTERVAL = parseInt(e.target.value) || 2000;
            updateStatus(`Refresh interval set to ${CONFIG.REFRESH_INTERVAL} ms`);
        });

        document.getElementById('api-enabled').addEventListener('change', (e) => {
            CONFIG.API_ENABLED = e.target.checked;
            updateStatus(`API features ${CONFIG.API_ENABLED ? 'enabled' : 'disabled'}`);
        });

        // Tab navigation
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');

                // Update active tab button
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');

                // Show/hide tab contents
                tabContents.forEach(content => {
                    if (content.id === targetTab) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }

    function updateStatus(message) {
        const status = document.getElementById('status');
        const timestamp = new Date().toLocaleTimeString();
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = `<span style="color: rgba(255,255,255,0.5);">[${timestamp}]</span> ${message}`;
        status.appendChild(messageDiv);
        status.scrollTop = status.scrollHeight;

        // Keep only last 10 messages to prevent memory issues
        while (status.children.length > 10) {
            status.removeChild(status.firstChild);
        }
    }

    function updateCounter() {
        document.getElementById('action-counter').textContent = actionCount;
    }

    function setButtonStates(running) {
        document.getElementById('sell-all-btn').disabled = running;
        document.getElementById('buy-btn').disabled = running;
        document.getElementById('stop-btn').disabled = !running;
    }

    // Generic function to find buttons by text content
    function findButtonByText(texts) {
        const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"], [role="button"]');

        for (const button of buttons) {
            const buttonText = button.textContent.toLowerCase().trim();
            const isVisible = button.offsetParent !== null;
            const isEnabled = !button.disabled;

            if (isVisible && isEnabled && texts.some(text => buttonText.includes(text.toLowerCase()))) {
                return button;
            }
        }
        return null;
    }

    // Enhanced button finding with multiple selectors
    function findSellButton() {
        // First try specific RugPlay selectors based on the HTML structure
        const rugplaySelectors = [
            'button[data-slot="button"]:has(svg.lucide-trending-down)',
            'button[data-slot="button"]:has(.lucide-trending-down)'
        ];

        for (const selector of rugplaySelectors) {
            try {
                const element = document.querySelector(selector);
                if (element && element.offsetParent !== null) {
                    // Return the button regardless of disabled state, we'll check separately
                    return element;
                }
            } catch (e) {
                // CSS :has() might not be supported in all browsers
            }
        }

        // Try finding by data-slot and checking for trending-down icon
        const buttons = document.querySelectorAll('button[data-slot="button"]');
        for (const button of buttons) {
            const text = button.textContent.toLowerCase();
            const hasDownIcon = button.querySelector('.lucide-trending-down');
            const isVisible = button.offsetParent !== null;

            if (isVisible && (text.includes('sell') || hasDownIcon)) {
                // Return the button regardless of disabled state
                return button;
            }
        }

        // Fallback to text-based search - also return regardless of disabled state
        const fallbackButtons = document.querySelectorAll('button, input[type="button"], input[type="submit"], [role="button"]');
        const sellTexts = ['sell', 'verkopen', 'vendre', 'продать'];

        for (const button of fallbackButtons) {
            const buttonText = button.textContent.toLowerCase().trim();
            const isVisible = button.offsetParent !== null;

            if (isVisible && sellTexts.some(text => buttonText.includes(text.toLowerCase()))) {
                return button;
            }
        }

        return null;
    }

    // New function to check if we can still sell
    function canSell() {
        const sellButton = findSellButton();
        if (!sellButton) {
            return false; // No sell button found
        }

        // Check if button is disabled
        const isDisabled = sellButton.disabled || sellButton.hasAttribute('disabled') ||
                          sellButton.getAttribute('aria-disabled') === 'true';

        return !isDisabled;
    }

    function findConfirmButton() {
        // Look specifically in dialog content for confirmation buttons
        const dialogContent = document.querySelector('div[data-slot="dialog-content"]');
        if (dialogContent) {
            // Look for the final action buttons in the dialog footer
            const footerButtons = dialogContent.querySelectorAll('div[data-slot="dialog-footer"] button[data-slot="button"]');

            for (const button of footerButtons) {
                const text = button.textContent.toLowerCase().trim();
                const isVisible = button.offsetParent !== null;
                const isEnabled = !button.disabled;

                // Skip cancel buttons, look for action buttons
                if (isVisible && isEnabled && !text.includes('cancel') &&
                    (text.includes('buy') || text.includes('sell') ||
                     text.includes('confirm') || text.includes('proceed'))) {
                    return button;
                }
            }
        }

        // Fallback to checking all visible buttons in dialogs
        const modalButtons = document.querySelectorAll('div[role="dialog"] button[data-slot="button"], .modal button[data-slot="button"]');
        for (const button of modalButtons) {
            const text = button.textContent.toLowerCase().trim();
            const isVisible = button.offsetParent !== null;
            const isEnabled = !button.disabled;

            if (isVisible && isEnabled && !text.includes('cancel') &&
                (text.includes('buy ') || text.startsWith('buy') ||
                 text.includes('sell ') || text.startsWith('sell') ||
                 text.includes('confirm') || text.includes('yes') ||
                 text.includes('ok') || text.includes('proceed') ||
                 text.includes('continue'))) {
                return button;
            }
        }

        return findButtonByText(['confirm', 'bevestigen', 'confirmer', 'подтвердить', 'yes', 'ok', 'proceed', 'continue']);
    }

    function findBuyButton() {
        // First try specific RugPlay selectors
        const rugplaySelectors = [
            'button[data-slot="button"]:has(svg.lucide-trending-up)',
            'button[data-slot="button"]:has(.lucide-trending-up)'
        ];

        for (const selector of rugplaySelectors) {
            try {
                const element = document.querySelector(selector);
                if (element && element.offsetParent !== null && !element.disabled) {
                    return element;
                }
            } catch (e) {
                // CSS selectors might not be supported
            }
        }

        // Try finding by data-slot and checking for trending-up icon
        const buttons = document.querySelectorAll('button[data-slot="button"]');
        for (const button of buttons) {
            const text = button.textContent.toLowerCase();
            const hasUpIcon = button.querySelector('.lucide-trending-up');
            const isVisible = button.offsetParent !== null;
            const isEnabled = !button.disabled;

            if (isVisible && isEnabled && (text.includes('buy') || hasUpIcon)) {
                return button;
            }
        }

        return findButtonByText(['buy', 'kopen', 'acheter', 'купить']);
    }

    function findMaxButton() {
        // Look specifically for Max button in the dialog content
        const dialogContent = document.querySelector('div[data-slot="dialog-content"]');
        if (dialogContent) {
            // Look for the Max button next to the amount input
            const maxButtons = dialogContent.querySelectorAll('button[data-slot="button"]');
            for (const button of maxButtons) {
                const text = button.textContent.toLowerCase().trim();
                const isVisible = button.offsetParent !== null;
                const isEnabled = !button.disabled;

                if (isVisible && isEnabled && text === 'max') {
                    return button;
                }
            }
        }

        // Fallback to searching all buttons
        const allButtons = document.querySelectorAll('button[data-slot="button"]');
        for (const button of allButtons) {
            const text = button.textContent.toLowerCase().trim();
            const isVisible = button.offsetParent !== null;
            const isEnabled = !button.disabled;

            if (isVisible && isEnabled && text === 'max') {
                return button;
            }
        }

        return null;
    }

    function findAmountInput() {
        // Look specifically in the dialog for the amount input
        const dialogContent = document.querySelector('div[data-slot="dialog-content"]');
        if (dialogContent) {
            const amountInput = dialogContent.querySelector('input[id="amount"]') ||
                             dialogContent.querySelector('input[type="number"]');
            if (amountInput && amountInput.offsetParent !== null) {
                return amountInput;
            }
        }

        // Fallback to general search
        return document.querySelector('input[type="number"]#amount') ||
               document.querySelector('input[placeholder="0.00"]') ||
               document.querySelector('input[type="number"]');
    }

    async function startSelling() {
        if (isRunning) return;

        isRunning = true;
        currentAction = 'sell';
        actionCount = 0;
        setButtonStates(true);

        updateStatus('Starting auto-sell process...');

        try {
            await performSellCycle();
        } catch (error) {
            updateStatus(`Error: ${error.message}`);
        } finally {
            stopAction();
        }
    }

    async function performSellCycle() {
        for (let i = 0; i < CONFIG.MAX_RETRIES && isRunning; i++) {
            updateStatus(`Attempt ${i + 1}/${CONFIG.MAX_RETRIES}...`);

            // Check if we can still sell before attempting
            if (!canSell()) {
                updateStatus('Sell button is disabled - no more holdings to sell');
                break;
            }

            const sellButton = findSellButton();
            if (!sellButton) {
                updateStatus('No sell button found');
                break;
            }

            // Click sell button to open modal
            sellButton.click();
            updateStatus('Clicked sell button, waiting for modal...');

            // Wait for modal to appear
            await sleep(CONFIG.CONFIRM_DELAY);

            // Look for Max button and click it
            const maxButton = findMaxButton();
            if (maxButton) {
                maxButton.click();
                updateStatus('Clicked Max button');
                await sleep(200); // Short delay for amount to populate
            } else {
                updateStatus('Max button not found, checking if amount is already set...');
            }

            // Additional wait for the amount to be populated
            await sleep(CONFIG.CONFIRM_DELAY);

            // Find and click the final sell confirmation button
            if (CONFIG.AUTO_CONFIRM) {
                const confirmButton = findConfirmButton();
                if (confirmButton) {
                    confirmButton.click();
                    updateStatus('Auto-confirmed sell transaction');
                    actionCount++;
                    updateCounter();
                } else {
                    updateStatus('Sell confirm button not found - manual confirmation needed');
                    // Still count as an action since we opened the modal
                    actionCount++;
                    updateCounter();
                }
            } else {
                updateStatus('Waiting for manual confirmation...');
                actionCount++;
                updateCounter();
            }

            // Wait before next iteration
            await sleep(CONFIG.SELL_DELAY);

            // Check again after the transaction to see if we're done
            if (!canSell()) {
                updateStatus('All holdings sold - sell button now disabled');
                break;
            }

            if (!isRunning) break;
        }

        if (actionCount >= CONFIG.MAX_RETRIES) {
            updateStatus('Reached maximum retry limit');
        } else if (!canSell()) {
            updateStatus('✅ Selling complete - no more holdings detected');
        }
    }

    async function startBuying() {
        if (isRunning) return;

        isRunning = true;
        currentAction = 'buy';
        actionCount = 0;
        setButtonStates(true);

        updateStatus('Starting auto-buy process...');

        try {
            const buyButton = findBuyButton();
            if (!buyButton) {
                updateStatus('Buy button not found');
                stopAction();
                return;
            }

            // Click buy button to open modal
            buyButton.click();
            updateStatus('Clicked buy button, waiting for modal...');

            // Wait for modal to appear
            await sleep(CONFIG.CONFIRM_DELAY);

            // Set the custom buy amount from the input field
            const buyAmountInput = document.getElementById('buy-amount-input');
            const customAmount = parseFloat(buyAmountInput.value) || CONFIG.BUY_AMOUNT;

            const amountInput = findAmountInput();
            if (amountInput) {
                amountInput.value = customAmount;
                amountInput.dispatchEvent(new Event('input', { bubbles: true }));
                amountInput.dispatchEvent(new Event('change', { bubbles: true }));
                updateStatus(`Set buy amount to: $${customAmount}`);
                await sleep(200); // Short delay for amount to populate
            } else {
                updateStatus('Amount input not found in dialog');
            }

            await sleep(CONFIG.CONFIRM_DELAY);

            // Find and click the final buy confirmation button
            if (CONFIG.AUTO_CONFIRM) {
                const confirmButton = findConfirmButton();
                if (confirmButton) {
                    confirmButton.click();
                    updateStatus('Auto-confirmed buy transaction');
                    actionCount++;
                    updateCounter();
                } else {
                    updateStatus('Confirm button not found - manual confirmation needed');
                    actionCount++;
                    updateCounter();
                }
            } else {
                updateStatus('Waiting for manual confirmation...');
                actionCount++;
                updateCounter();
            }

        } catch (error) {
            updateStatus(`Buy error: ${error.message}`);
        } finally {
            stopAction();
        }
    }

    function stopAction() {
        isRunning = false;
        currentAction = null;
        setButtonStates(false);
        updateStatus(`Stopped. Total actions: ${actionCount}`);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Initialize when page loads
    function init() {
        console.log('RugPlay X: Script loading...');
        console.log('Current URL:', window.location.href);

        // Initialize API headers for enhanced features
        if (CONFIG.API_ENABLED) {
            setTimeout(() => {
                const apiInitialized = initializeApiHeaders();
                if (apiInitialized) {
                    updateStatus('API integration enabled');
                } else {
                    updateStatus('API features unavailable - using DOM fallback');
                }
            }, 2000);
        }

        // Force create panel after a delay to ensure DOM is ready
        setTimeout(() => {
            console.log('RugPlay X: Creating control panel...');
            createControlPanel();
            console.log('RugPlay X: Control panel created!');

            // Start periodic cash updates
            setInterval(updateCashDisplay, CONFIG.REFRESH_INTERVAL);
        }, 1000);

        // Also try when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('RugPlay X: DOM loaded, creating panel...');
                if (!document.getElementById('rugplay-auto-trader')) {
                    createControlPanel();
                    setTimeout(() => {
                        setInterval(updateCashDisplay, CONFIG.REFRESH_INTERVAL);
                    }, 500);
                }
            });
        }

        // And try when window is fully loaded
        window.addEventListener('load', () => {
            console.log('RugPlay X: Window loaded, ensuring panel exists...');
            if (!document.getElementById('rugplay-auto-trader')) {
                createControlPanel();
                setTimeout(() => {
                    setInterval(updateCashDisplay, CONFIG.REFRESH_INTERVAL);
                }, 500);
            }
        });
    }

    // Emergency stop with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isRunning) {
            stopAction();
            updateStatus('Emergency stop activated');
        }
    });

    init();
})();