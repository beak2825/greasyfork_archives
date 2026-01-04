// ==UserScript==
// @name         Unified Auth & Data Manager
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatic token management and data retrieval for Cherdak Console and Jira
// @author       You
// @match        https://cherdak.console3.com/*
// @match        https://admin-jwt-auth.prod.euce1.aws.indrive.tech/*
// @match        https://indriver.atlassian.net/jira/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/538988/Unified%20Auth%20%20Data%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/538988/Unified%20Auth%20%20Data%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const AUTH_HOST = 'https://admin-jwt-auth.prod.euce1.aws.indrive.tech/api/v1';
    const LS_ACCESS_TOKEN = 'access_token';
    const LS_REFRESH_TOKEN = 'refresh_token';
    const LS_IS_TOKEN_REFRESHING_KEY = 'is_token_refreshing';
    const LS_IS_TOKEN_REFRESHING_VALUE = 'true';
    const LS_TOKEN_DISPLAY_KEY = 'token_display_timestamp';

    // Current platform detection
    const isCherdakPlatform = window.location.hostname === 'cherdak.console3.com';
    const isJiraPlatform = window.location.hostname === 'indriver.atlassian.net';
    const isAuthPlatform = window.location.hostname === 'admin-jwt-auth.prod.euce1.aws.indrive.tech';

    class UnifiedAuthManager {
        constructor() {
            this.isRefreshing = false;
            this.refreshPromise = null;
            this.networkResponses = [];
            this.init();
        }

        init() {
            console.log('[UnifiedAuth] Initializing on platform:', window.location.hostname);
            
            // Initialize token management on all platforms
            this.interceptFetch();
            this.monitorTokenExpiration();
            this.setupCrossTabCommunication();
            
            // Migrate existing localStorage tokens to GM storage
            this.migrateTokensToGMStorage();
            
            // Show token status on page load
            this.displayTokenStatus();
            
            // For Jira, also check for existing tokens every few seconds initially
            if (isJiraPlatform) {
                let checkCount = 0;
                const tokenChecker = setInterval(() => {
                    checkCount++;
                    const token = this.getAccessToken();
                    if (token) {
                        console.log('[UnifiedAuth] Found token on Jira page!');
                        this.displayTokenStatus();
                        clearInterval(tokenChecker);
                    } else if (checkCount >= 20) { // Stop after 20 attempts (20 seconds)
                        clearInterval(tokenChecker);
                    }
                }, 1000);
            }
            
            // Platform-specific initialization
            if (isJiraPlatform) {
                this.initJiraFeatures();
            } else if (isCherdakPlatform) {
                this.initCherdakFeatures();
            }
        }

        // Parse JWT token to get expiration
        parseJwt(token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    window.atob(base64)
                        .split('')
                        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );
                return JSON.parse(jsonPayload);
            } catch (e) {
                console.error('[UnifiedAuth] Error parsing JWT:', e);
                return null;
            }
        }

        // Check if token is expired or will expire soon (within 5 minutes)
        isTokenExpired(token) {
            if (!token) return true;
            
            const payload = this.parseJwt(token);
            if (!payload || !payload.exp) return true;
            
            const currentTime = Math.floor(Date.now() / 1000);
            const bufferTime = 5 * 60; // 5 minutes buffer
            
            return payload.exp <= (currentTime + bufferTime);
        }

        // Get access token from cross-domain storage
        getAccessToken() {
            // Try Tampermonkey cross-domain storage first, fallback to localStorage
            try {
                const gmToken = GM_getValue(LS_ACCESS_TOKEN);
                if (gmToken) return gmToken;
            } catch (e) {
                console.log('[UnifiedAuth] GM_getValue not available, using localStorage');
            }
            return localStorage.getItem(LS_ACCESS_TOKEN);
        }

        // Get refresh token from cross-domain storage
        getRefreshToken() {
            // Try Tampermonkey cross-domain storage first, fallback to localStorage
            try {
                const gmToken = GM_getValue(LS_REFRESH_TOKEN);
                if (gmToken) return gmToken;
            } catch (e) {
                console.log('[UnifiedAuth] GM_getValue not available, using localStorage');
            }
            return localStorage.getItem(LS_REFRESH_TOKEN);
        }

        // Save tokens to both cross-domain and local storage
        saveTokens(accessToken, refreshToken) {
            // Save to Tampermonkey cross-domain storage
            try {
                GM_setValue(LS_ACCESS_TOKEN, accessToken);
                GM_setValue(LS_REFRESH_TOKEN, refreshToken);
                GM_setValue(LS_TOKEN_DISPLAY_KEY, Date.now().toString());
                console.log('[UnifiedAuth] Tokens saved to cross-domain storage');
            } catch (e) {
                console.log('[UnifiedAuth] GM_setValue not available, using localStorage only');
            }
            
            // Also save to localStorage for same-domain compatibility
            localStorage.setItem(LS_ACCESS_TOKEN, accessToken);
            localStorage.setItem(LS_REFRESH_TOKEN, refreshToken);
            localStorage.setItem(LS_TOKEN_DISPLAY_KEY, Date.now().toString());
            
            console.log('[UnifiedAuth] Tokens saved successfully');
            this.displayTokenStatus();
        }

        // Migrate existing localStorage tokens to GM storage for cross-domain access
        migrateTokensToGMStorage() {
            const localAccessToken = localStorage.getItem(LS_ACCESS_TOKEN);
            const localRefreshToken = localStorage.getItem(LS_REFRESH_TOKEN);
            
            if (localAccessToken && localRefreshToken) {
                try {
                    // Check if tokens already exist in GM storage
                    const gmAccessToken = GM_getValue(LS_ACCESS_TOKEN);
                    const gmRefreshToken = GM_getValue(LS_REFRESH_TOKEN);
                    
                    if (!gmAccessToken || !gmRefreshToken) {
                        GM_setValue(LS_ACCESS_TOKEN, localAccessToken);
                        GM_setValue(LS_REFRESH_TOKEN, localRefreshToken);
                        GM_setValue(LS_TOKEN_DISPLAY_KEY, Date.now().toString());
                        console.log('[UnifiedAuth] Migrated existing tokens from localStorage to GM storage');
                    } else {
                        console.log('[UnifiedAuth] Tokens already exist in GM storage, no migration needed');
                    }
                } catch (e) {
                    console.log('[UnifiedAuth] Failed to migrate tokens to GM storage:', e.message);
                }
            } else {
                console.log('[UnifiedAuth] No existing tokens in localStorage to migrate');
            }
        }

        // Clear tokens from both storages
        clearTokens() {
            // Clear from Tampermonkey cross-domain storage
            try {
                GM_deleteValue(LS_ACCESS_TOKEN);
                GM_deleteValue(LS_REFRESH_TOKEN);
                GM_deleteValue(LS_TOKEN_DISPLAY_KEY);
                console.log('[UnifiedAuth] Tokens cleared from cross-domain storage');
            } catch (e) {
                console.log('[UnifiedAuth] GM_deleteValue not available');
            }
            
            // Also clear from localStorage
            localStorage.removeItem(LS_ACCESS_TOKEN);
            localStorage.removeItem(LS_REFRESH_TOKEN);
            localStorage.removeItem(LS_TOKEN_DISPLAY_KEY);
            
            console.log('[UnifiedAuth] Tokens cleared');
            this.displayTokenStatus();
        }

        // Wait for ongoing refresh to complete (for multiple tabs)
        async waitForRefresh() {
            return new Promise((resolve) => {
                const checkStorage = () => {
                    const isRefreshing = localStorage.getItem(LS_IS_TOKEN_REFRESHING_KEY);
                    if (isRefreshing !== LS_IS_TOKEN_REFRESHING_VALUE) {
                        const accessToken = localStorage.getItem(LS_ACCESS_TOKEN);
                        const refreshToken = localStorage.getItem(LS_REFRESH_TOKEN);
                        resolve({ accessToken, refreshToken });
                    } else {
                        setTimeout(checkStorage, 100);
                    }
                };
                
                window.addEventListener('storage', (e) => {
                    if (e.key === LS_IS_TOKEN_REFRESHING_KEY && e.newValue !== LS_IS_TOKEN_REFRESHING_VALUE) {
                        const accessToken = localStorage.getItem(LS_ACCESS_TOKEN);
                        const refreshToken = localStorage.getItem(LS_REFRESH_TOKEN);
                        resolve({ accessToken, refreshToken });
                    }
                });
                
                checkStorage();
            });
        }

        // Refresh tokens using the refresh token
        async refreshTokens() {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
                console.error('[UnifiedAuth] No refresh token available');
                this.clearTokens();
                if (isCherdakPlatform) {
                    window.location.reload();
                }
                return null;
            }

            // Check if refresh is already in progress
            if (localStorage.getItem(LS_IS_TOKEN_REFRESHING_KEY) === LS_IS_TOKEN_REFRESHING_VALUE) {
                console.log('[UnifiedAuth] Refresh already in progress, waiting...');
                return await this.waitForRefresh();
            }

            // Set refresh flag
            localStorage.setItem(LS_IS_TOKEN_REFRESHING_KEY, LS_IS_TOKEN_REFRESHING_VALUE);
            console.log('[UnifiedAuth] Starting token refresh...');

            try {
                const response = await fetch(`${AUTH_HOST}/refresh`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        refresh_token: refreshToken
                    })
                });

                if (response.status === 401) {
                    console.error('[UnifiedAuth] Refresh token expired, clearing tokens');
                    this.clearTokens();
                    if (isCherdakPlatform) {
                        window.location.reload();
                    }
                    return null;
                }

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error: ${response.status}, Text: ${errorText}`);
                }

                const data = await response.json();
                this.saveTokens(data.access_token, data.refresh_token);
                
                console.log('[UnifiedAuth] Tokens refreshed successfully');
                return {
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token
                };

            } catch (error) {
                console.error('[UnifiedAuth] Token refresh failed:', error);
                this.clearTokens();
                return null;
            } finally {
                // Clear refresh flag
                localStorage.removeItem(LS_IS_TOKEN_REFRESHING_KEY);
            }
        }

        // Get valid access token (refresh if needed)
        async getValidToken() {
            const accessToken = this.getAccessToken();
            
            if (this.isTokenExpired(accessToken)) {
                console.log('[UnifiedAuth] Token expired, refreshing...');
                const tokens = await this.refreshTokens();
                return tokens ? tokens.accessToken : null;
            }
            
            return accessToken;
        }

        // Intercept fetch requests to automatically add auth headers
        interceptFetch() {
            const originalFetch = window.fetch;
            const authManager = this;

            window.fetch = async function(url, options = {}) {
                // Only intercept requests that need authentication
                if (typeof url === 'string' && 
                    (url.includes('admin-jwt-auth') || 
                     url.includes('cherdak.console3.com') ||
                     url.includes('admin-access.prod.euce1.aws.indrive.tech'))) {
                    
                    // Skip authentication endpoints
                    if (url.includes('/authenticate') || url.includes('/refresh') || url.includes('/logout')) {
                        return originalFetch.call(this, url, options);
                    }

                    const token = await authManager.getValidToken();
                    if (token) {
                        options.headers = {
                            ...options.headers,
                            'Authorization': `Bearer ${token}`
                        };
                    }
                }

                return originalFetch.call(this, url, options);
            };

            console.log('[UnifiedAuth] Fetch interceptor installed');
        }

        // Monitor token expiration and refresh proactively
        monitorTokenExpiration() {
            setInterval(() => {
                const accessToken = this.getAccessToken();
                if (accessToken && this.isTokenExpired(accessToken)) {
                    console.log('[UnifiedAuth] Proactive token refresh triggered');
                    this.refreshTokens();
                }
            }, 60000); // Check every minute
        }

        // Setup cross-tab communication for token updates
        setupCrossTabCommunication() {
            window.addEventListener('storage', (e) => {
                if (e.key === LS_ACCESS_TOKEN || e.key === LS_REFRESH_TOKEN || e.key === LS_TOKEN_DISPLAY_KEY) {
                    console.log('[UnifiedAuth] Token updated in another tab, refreshing status...');
                    // Small delay to ensure localStorage is updated
                    setTimeout(() => {
                        this.displayTokenStatus();
                    }, 100);
                }
            });
            
            // Also check for tokens on focus (when switching between tabs)
            window.addEventListener('focus', () => {
                console.log('[UnifiedAuth] Tab focused, checking token status...');
                this.displayTokenStatus();
            });
        }

        // Display current token status
        displayTokenStatus() {
            const token = this.getAccessToken();
            const refreshToken = this.getRefreshToken();
            const platform = isCherdakPlatform ? 'Cherdak' : isJiraPlatform ? 'Jira' : 'Auth';
            
            // Debug storage contents
            console.log(`[UnifiedAuth] ${platform} - Storage Debug:`);
            console.log(`[UnifiedAuth] ${platform} - access_token in localStorage:`, localStorage.getItem(LS_ACCESS_TOKEN) ? 'YES' : 'NO');
            console.log(`[UnifiedAuth] ${platform} - refresh_token in localStorage:`, localStorage.getItem(LS_REFRESH_TOKEN) ? 'YES' : 'NO');
            
            // Debug cross-domain storage
            try {
                console.log(`[UnifiedAuth] ${platform} - access_token in GM storage:`, GM_getValue(LS_ACCESS_TOKEN) ? 'YES' : 'NO');
                console.log(`[UnifiedAuth] ${platform} - refresh_token in GM storage:`, GM_getValue(LS_REFRESH_TOKEN) ? 'YES' : 'NO');
            } catch (e) {
                console.log(`[UnifiedAuth] ${platform} - GM storage not available`);
            }
            
            if (token) {
                const payload = this.parseJwt(token);
                const expTime = payload ? new Date(payload.exp * 1000).toLocaleString() : 'Unknown';
                const isExpired = this.isTokenExpired(token);
                const status = isExpired ? '🔴 EXPIRED' : '🟢 ACTIVE';
                
                console.log(`[UnifiedAuth] ${platform} - Token Status: ${status}`);
                console.log(`[UnifiedAuth] ${platform} - Token: ${token.substring(0, 50)}...`);
                console.log(`[UnifiedAuth] ${platform} - Expires: ${expTime}`);
                
                // Show brief notification on token refresh
                const lastUpdate = localStorage.getItem(LS_TOKEN_DISPLAY_KEY);
                if (lastUpdate && (Date.now() - parseInt(lastUpdate)) < 5000) {
                    this.showTokenNotification(token, expTime, status);
                }
            } else {
                console.log(`[UnifiedAuth] ${platform} - No token available`);
                if (isJiraPlatform) {
                    console.log(`[UnifiedAuth] ${platform} - Please visit Cherdak Console first to get tokens!`);
                    console.log(`[UnifiedAuth] ${platform} - URL: https://cherdak.console3.com`);
                    
                    // Add a temporary debug button for Jira
                    this.addDebugButton();
                }
            }
        }

        // Add debug button to manually check tokens
        addDebugButton() {
            if (document.getElementById('token-debug-btn')) return; // Don't add multiple buttons
            
            const button = document.createElement('button');
            button.id = 'token-debug-btn';
            button.textContent = '🔍 Check Tokens';
            button.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                z-index: 10000;
                padding: 8px 12px;
                background: #0066cc;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            `;
            
            button.onclick = () => {
                console.log('=== MANUAL TOKEN CHECK ===');
                console.log('localStorage access_token:', localStorage.getItem(LS_ACCESS_TOKEN));
                console.log('localStorage refresh_token:', localStorage.getItem(LS_REFRESH_TOKEN));
                
                // Check cross-domain storage
                try {
                    console.log('GM storage access_token:', GM_getValue(LS_ACCESS_TOKEN));
                    console.log('GM storage refresh_token:', GM_getValue(LS_REFRESH_TOKEN));
                } catch (e) {
                    console.log('GM storage not available:', e.message);
                }
                
                console.log('Current domain:', window.location.hostname);
                console.log('localStorage length:', localStorage.length);
                
                // List all localStorage keys
                const keys = [];
                for (let i = 0; i < localStorage.length; i++) {
                    keys.push(localStorage.key(i));
                }
                console.log('All localStorage keys:', keys);
                
                this.displayTokenStatus();
            };
            
            document.body.appendChild(button);
        }

        // Show token notification
        showTokenNotification(token, expTime, status) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #f0f9ff;
                border: 2px solid #0ea5e9;
                color: #0c4a6e;
                padding: 15px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 12px;
                z-index: 10000;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                word-break: break-all;
            `;
            
            notification.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 8px;">🔑 Token Updated</div>
                <div><strong>Status:</strong> ${status}</div>
                <div><strong>Token:</strong> ${token.substring(0, 60)}...</div>
                <div><strong>Expires:</strong> ${expTime}</div>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 5000);
        }

        // Initialize Cherdak-specific features
        initCherdakFeatures() {
            console.log('[UnifiedAuth] Initializing Cherdak features - automatic token management only');
            // No manual UI controls - everything happens automatically
        }

        // Initialize Jira-specific features
        initJiraFeatures() {
            console.log('[UnifiedAuth] Initializing Jira features');
            this.setupJiraNetworkInterception();
            this.addJiraStyles();
            this.createJiraButton();
        }

        // Setup network interception for Jira
        setupJiraNetworkInterception() {
            // Intercept fetch requests for Jira API
            const originalFetch = window.fetch;
            const authManager = this;
            
            window.fetch = function(...args) {
                return originalFetch.apply(this, args).then(response => {
                    const url = args[0];
                    if (typeof url === 'string' && url.includes('/rest/api/3/issue/')) {
                        response.clone().json().then(data => {
                            authManager.networkResponses.unshift({
                                url: url,
                                data: data,
                                timestamp: Date.now()
                            });
                            // Keep only last 10 responses
                            if (authManager.networkResponses.length > 10) {
                                authManager.networkResponses = authManager.networkResponses.slice(0, 10);
                            }
                        }).catch(() => {});
                    }
                    return response;
                });
            };

            // Also intercept XMLHttpRequest
            const originalOpen = XMLHttpRequest.prototype.open;
            const originalSend = XMLHttpRequest.prototype.send;
            
            XMLHttpRequest.prototype.open = function(method, url, ...args) {
                this._url = url;
                return originalOpen.apply(this, [method, url, ...args]);
            };
            
            XMLHttpRequest.prototype.send = function(...args) {
                const xhr = this;
                const originalOnLoad = this.onload;
                
                this.onload = function() {
                    if (xhr._url && xhr._url.includes('/rest/api/3/issue/')) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            authManager.networkResponses.unshift({
                                url: xhr._url,
                                data: data,
                                timestamp: Date.now()
                            });
                            // Keep only last 10 responses
                            if (authManager.networkResponses.length > 10) {
                                authManager.networkResponses = authManager.networkResponses.slice(0, 10);
                            }
                        } catch (e) {}
                    }
                    if (originalOnLoad) {
                        originalOnLoad.apply(this, arguments);
                    }
                };
                
                return originalSend.apply(this, args);
            };
        }

        // Add Jira-specific styles
        addJiraStyles() {
            GM_addStyle(`
                #data-retriever-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--ds-background-neutral-subtle, transparent);
                    border: 1px solid var(--ds-border, #091E4224);
                    border-radius: 3px;
                    cursor: pointer;
                    height: 32px;
                    width: 32px;
                    margin-right: 8px;
                    transition: all 0.2s ease;
                    color: var(--ds-icon, #44546F);
                    padding: 0;
                    position: relative;
                    vertical-align: middle;
                    line-height: 1;
                    flex-shrink: 0;
                }
                
                #data-retriever-btn:hover {
                    background: var(--ds-background-neutral-subtle-hovered, #091E420F);
                    border-color: var(--ds-border-focused, #388BFF);
                    color: var(--ds-icon-brand, #0C66E4);
                }
                
                #data-retriever-btn:active {
                    background: var(--ds-background-neutral-subtle-pressed, #091E4224);
                    transform: scale(0.95);
                }
                
                #data-retriever-btn:disabled {
                    background: var(--ds-background-disabled, #091E4208);
                    border-color: var(--ds-border-disabled, #091E420F);
                    color: var(--ds-icon-disabled, #091E424F);
                    cursor: not-allowed;
                }
                
                #data-retriever-btn svg {
                    width: 16px;
                    height: 16px;
                    fill: currentColor;
                    pointer-events: none;
                }
                
                .lightning-icon {
                    color: var(--ds-icon-warning, #E56910);
                }
                
                #data-retriever-btn:hover .lightning-icon {
                    color: var(--ds-icon-warning, #E56910);
                    filter: brightness(1.1);
                }
                
                #data-retriever-btn::after {
                    content: attr(title);
                    position: absolute;
                    bottom: -35px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--ds-surface-overlay, #FFFFFF);
                    color: var(--ds-text, #172B4D);
                    border: 1px solid var(--ds-border, #091E4224);
                    border-radius: 3px;
                    padding: 4px 8px;
                    font-size: 12px;
                    white-space: nowrap;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.2s, visibility 0.2s;
                    z-index: 1000;
                    box-shadow: var(--ds-shadow-raised, 0px 1px 1px #091E4240);
                }
                
                #data-retriever-btn:hover::after {
                    opacity: 1;
                    visibility: visible;
                }
                
                #data-loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: var(--ds-blanket, rgba(9, 30, 66, 0.49));
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s ease, visibility 0.3s ease;
                    cursor: wait;
                    user-select: none;
                }
                
                #data-loading-overlay.show {
                    opacity: 1;
                    visibility: visible;
                }
                
                .loading-content {
                    background: var(--ds-surface-overlay, #FFFFFF);
                    border-radius: 8px;
                    padding: 32px;
                    box-shadow: var(--ds-shadow-overlay, 0px 8px 12px #091E4226);
                    text-align: center;
                    max-width: 400px;
                    margin: 0 20px;
                }
                
                .loading-spinner {
                    width: 48px;
                    height: 48px;
                    margin: 0 auto 16px;
                    position: relative;
                }
                
                .loading-spinner svg {
                    width: 100%;
                    height: 100%;
                    color: var(--ds-icon-brand, #0C66E4);
                }
                
                .loading-text {
                    color: var(--ds-text, #172B4D);
                    font-size: 16px;
                    font-weight: 500;
                    margin-bottom: 8px;
                    font-family: var(--ds-font-family-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif);
                }
                
                .loading-subtext {
                    color: var(--ds-text-subtle, #44546F);
                    font-size: 14px;
                    line-height: 1.4;
                    font-family: var(--ds-font-family-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif);
                }
                
                .loading-progress {
                    margin-top: 16px;
                    color: var(--ds-text-subtlest, #626F86);
                    font-size: 12px;
                    font-family: var(--ds-font-family-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif);
                }
            `);
        }

        // Create Jira lightning button
        createJiraButton() {
            const checkForSecurityButton = () => {
                const securityButton = document.querySelector('button[aria-label="Security level"]');
                if (securityButton && !document.getElementById('data-retriever-btn')) {
                    const button = document.createElement('button');
                    button.id = 'data-retriever-btn';
                    button.setAttribute('aria-label', 'Retrieve Contact Data');
                    button.setAttribute('title', 'Retrieve Driver and Passenger Contact Information');
                    button.onclick = () => this.retrieveJiraData();
                    
                    button.innerHTML = `
                        <svg class="lightning-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    `;
                    
                    const securityParent = securityButton.parentElement;
                    if (securityParent) {
                        securityParent.insertBefore(button, securityButton);
                        console.log('[UnifiedAuth] Lightning button created for Jira');
                        
                        const parentStyle = window.getComputedStyle(securityParent);
                        if (parentStyle.display === 'flex' || parentStyle.display === 'inline-flex') {
                            securityParent.style.alignItems = 'center';
                        }
                    } else {
                        securityButton.parentNode.insertBefore(button, securityButton);
                    }
                } else if (!securityButton) {
                    setTimeout(checkForSecurityButton, 1000);
                }
            };
            
            checkForSecurityButton();

            // Watch for DOM changes (Jira is a SPA)
            const observer = new MutationObserver((mutations) => {
                let shouldCreateButton = false;
                
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) {
                                const securityButton = node.querySelector ? node.querySelector('button[aria-label="Security level"]') : null;
                                if (securityButton || (node.getAttribute && node.getAttribute('aria-label') === 'Security level')) {
                                    shouldCreateButton = true;
                                }
                            }
                        });
                    }
                });
                
                if (shouldCreateButton && !document.getElementById('data-retriever-btn')) {
                    setTimeout(checkForSecurityButton, 500);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // Jira data retrieval methods (using automatic token)
        extractIdFromUrl(url) {
            if (!url) return null;
            const match = url.match(/\/users\/(\d+)/);
            return match ? match[1] : null;
        }

        async getUserProfile(userId) {
            const query = {
                operationName: "GetProfile",
                variables: {
                    input: {
                        id: userId
                    }
                },
                query: `query GetProfile($input: UserIdentityInput!) {
                    profile(input: $input) {
                        user {
                            id
                            uuid
                            firstName
                            lastName
                            middleName
                            avatar
                            attributes {
                                avatarCheckStatus
                                __typename
                            }
                            gender
                            birthday
                            locale
                            city
                            country
                            lastActivity
                            cas
                            userCreated
                            tags {
                                name
                                description
                                type
                                visibility
                                createdAt
                                updatedAt
                                active
                                __typename
                            }
                            __typename
                        }
                        contacts {
                            type
                            data
                            cas
                            __typename
                        }
                        vehicle {
                            brand
                            model
                            color
                            productionYear
                            registrationNumber
                            transportTypeName
                            transportTypeClassName
                            cas
                            __typename
                        }
                        device {
                            model
                            osVersion
                            appVersion
                            cas
                            __typename
                        }
                        deleted {
                            date
                            comment
                            __typename
                        }
                        statuses {
                            deeplink_url
                            name
                            status
                            subtitle
                            title
                            __typename
                        }
                        __typename
                    }
                }`
            };

            const token = await this.getValidToken();
            if (!token) {
                throw new Error('No valid token available');
            }

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://admin-access.prod.euce1.aws.indrive.tech/admin-access/proxy/mena/user-services',
                    headers: {
                        'accept': '*/*',
                        'accept-language': 'en',
                        'authorization': `Bearer ${token}`,
                        'content-type': 'application/json',
                        'dnt': '1',
                        'origin': 'https://cherdak.console3.com',
                        'priority': 'u=1, i',
                        'referer': 'https://cherdak.console3.com/',
                        'sec-ch-ua': '"Chromium";v="137", "Not/A)Brand";v="24"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"macOS"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'cross-site',
                        'sec-fetch-storage-access': 'active',
                        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
                    },
                    data: JSON.stringify(query),
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: function(error) {
                        reject(error);
                    }
                });
            });
        }

        extractContactInfo(profileData) {
            const contacts = profileData?.data?.profile?.contacts || [];
            const phone = contacts.find(c => c.type === 'CONTACT_PHONE')?.data;
            const email = contacts.find(c => c.type === 'CONTACT_EMAIL')?.data;
            const user = profileData?.data?.profile?.user;
            
            return {
                phone: phone || 'Not found',
                email: email || 'Not found',
                name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Not found'
            };
        }

        // Main Jira data retrieval function
        async retrieveJiraData() {
            const button = document.getElementById('data-retriever-btn');
            button.disabled = true;
            
            // Check if we have a token first
            const token = this.getAccessToken();
            if (!token) {
                alert('No authentication token available!\n\nPlease visit Cherdak Console first to get tokens:\nhttps://cherdak.console3.com\n\nThen refresh this Jira page and try again.');
                button.disabled = false;
                return;
            }

            this.showLoadingOverlay();

            try {
                this.updateLoadingProgress('Scanning network responses...');
                
                let driverId = null;
                let passengerId = null;

                for (const response of this.networkResponses) {
                    const data = response.data;
                    if (data.fields) {
                        const customField12080 = data.fields.customfield_12080;
                        const customField12081 = data.fields.customfield_12081;
                        
                        if (customField12080) {
                            driverId = this.extractIdFromUrl(customField12080);
                        }
                        if (customField12081) {
                            passengerId = this.extractIdFromUrl(customField12081);
                        }
                        
                        if (driverId && passengerId) {
                            break;
                        }
                    }
                }

                if (!driverId || !passengerId) {
                    this.hideLoadingOverlay();
                    button.disabled = false;
                    
                    let missingIds = [];
                    if (!driverId) missingIds.push('Driver ID');
                    if (!passengerId) missingIds.push('Passenger ID');
                    
                    const message = `This request doesn't have the ${missingIds.join(' and ')}.\n\nPlease load a Jira ticket that contains both driver and passenger information.`;
                    alert(message);
                    return;
                }

                this.updateLoadingProgress(`Found Driver ID: ${driverId}, Passenger ID: ${passengerId}`);
                console.log(`[UnifiedAuth] Found Driver ID: ${driverId}, Passenger ID: ${passengerId}`);

                await new Promise(resolve => setTimeout(resolve, 800));

                this.updateLoadingProgress('Fetching driver and passenger profiles...');

                const [driverProfile, passengerProfile] = await Promise.all([
                    this.getUserProfile(driverId),
                    this.getUserProfile(passengerId)
                ]);

                this.updateLoadingProgress('Extracting contact information...');

                const driverInfo = this.extractContactInfo(driverProfile);
                const passengerInfo = this.extractContactInfo(passengerProfile);

                this.updateLoadingProgress('Filling form fields...');

                this.fillFormFields(driverInfo, passengerInfo);

            } catch (error) {
                console.error('[UnifiedAuth] Error retrieving data:', error);
                this.hideLoadingOverlay();
                if (error.message.includes('No valid token available')) {
                    alert('Authentication token expired or invalid!\n\nPlease visit Cherdak Console to refresh tokens:\nhttps://cherdak.console3.com\n\nThen refresh this Jira page and try again.');
                } else {
                    alert('Error retrieving data. Please check the console for details.');
                }
            } finally {
                button.disabled = false;
            }
        }

        // All the Jira form filling methods (unchanged from original)
        fillFormFields(driverInfo, passengerInfo) {
            const fields = [
                { 
                    editAriaLabel: 'Edit Driver phone number', 
                    inputAriaLabel: 'Driver phone number',
                    confirmAriaLabel: 'Confirm Driver phone number',
                    value: driverInfo.phone 
                },
                { 
                    editAriaLabel: 'Edit Passenger phone number', 
                    inputAriaLabel: 'Passenger phone number',
                    confirmAriaLabel: 'Confirm Passenger phone number',
                    value: passengerInfo.phone 
                },
                { 
                    editAriaLabel: 'Edit Driver email', 
                    inputAriaLabel: 'Driver email',
                    confirmAriaLabel: 'Confirm Driver email',
                    value: driverInfo.email 
                },
                { 
                    editAriaLabel: 'Edit Passenger email', 
                    inputAriaLabel: 'Passenger email',
                    confirmAriaLabel: 'Confirm Passenger email',
                    value: passengerInfo.email 
                }
            ];

            let filledCount = 0;
            let errorCount = 0;
            let fieldIndex = 0;
            
            const fillNextField = () => {
                if (fieldIndex >= fields.length) {
                    this.updateLoadingProgress(`Completed! ${filledCount} fields updated, ${errorCount} errors`);
                    
                    setTimeout(() => {
                        this.hideLoadingOverlay();
                        this.showNotification(`Data retrieved and filled: ${filledCount} fields updated, ${errorCount} errors`);
                    }, 1500);
                    return;
                }
                
                const field = fields[fieldIndex];
                fieldIndex++;
                
                try {
                    if (field.value && field.value !== 'Not found') {
                        this.updateLoadingProgress(`Filling ${field.editAriaLabel.replace('Edit ', '')} (${fieldIndex}/${fields.length})...`);
                        this.fillField(field.editAriaLabel, field.inputAriaLabel, field.confirmAriaLabel, field.value, () => {
                            filledCount++;
                            console.log(`[UnifiedAuth] Successfully filled ${field.editAriaLabel} with: ${field.value}`);
                            setTimeout(fillNextField, 800);
                        }, () => {
                            errorCount++;
                            console.log(`[UnifiedAuth] Failed to fill ${field.editAriaLabel}`);
                            setTimeout(fillNextField, 800);
                        });
                    } else {
                        console.log(`[UnifiedAuth] Skipping ${field.editAriaLabel} - no valid data found`);
                        this.updateLoadingProgress(`Skipping ${field.editAriaLabel.replace('Edit ', '')} (${fieldIndex}/${fields.length}) - no data...`);
                        setTimeout(fillNextField, 50);
                    }
                } catch (error) {
                    errorCount++;
                    console.error(`[UnifiedAuth] Error filling ${field.editAriaLabel}:`, error);
                    setTimeout(fillNextField, 800);
                }
            };
            
            fillNextField();
            
            setTimeout(() => {
                const overlay = document.getElementById('data-loading-overlay');
                if (overlay && overlay.classList.contains('show')) {
                    console.warn('[UnifiedAuth] Form filling took too long, hiding overlay automatically');
                    this.hideLoadingOverlay();
                    this.showNotification('Process completed (timeout reached)');
                }
            }, 30000);
        }

        fillField(editAriaLabel, inputAriaLabel, confirmAriaLabel, value, onSuccess, onError) {
            console.log(`[UnifiedAuth] Starting to fill field: ${editAriaLabel}`);
            
            const editButton = document.querySelector(`button[aria-label="${editAriaLabel}"]`);
            if (!editButton) {
                console.error(`[UnifiedAuth] Edit button not found for: ${editAriaLabel}`);
                if (onError) onError();
                return;
            }

            console.log(`[UnifiedAuth] Found edit button, clicking: ${editAriaLabel}`);
            editButton.click();

            setTimeout(() => {
                try {
                    console.log(`[UnifiedAuth] Looking for input field with aria-label: ${inputAriaLabel}`);
                    
                    let inputField = document.querySelector(`input[aria-label="${inputAriaLabel}"]`);
                    
                    if (!inputField) {
                        console.log(`[UnifiedAuth] Direct aria-label search failed, trying broader search`);
                        const inputSelectors = [
                            'input[type="text"]',
                            'input[type="email"]',
                            'input[type="tel"]',
                            'input[type="phone"]',
                            'input:not([type])',
                            'textarea',
                            '[contenteditable="true"]'
                        ];

                        const buttonContainer = editButton.closest('.css-1jg7pxs');
                        if (buttonContainer) {
                            console.log(`[UnifiedAuth] Searching in button container for input field`);
                            for (const selector of inputSelectors) {
                                const foundInputs = buttonContainer.querySelectorAll(selector);
                                for (const input of foundInputs) {
                                    if (input.offsetParent !== null) {
                                        inputField = input;
                                        console.log(`[UnifiedAuth] Found input field using selector: ${selector} in button container`);
                                        break;
                                    }
                                }
                                if (inputField) break;
                            }
                        }

                        if (!inputField) {
                            console.log(`[UnifiedAuth] Searching globally for visible input field`);
                            for (const selector of inputSelectors) {
                                const inputs = document.querySelectorAll(selector);
                                inputField = Array.from(inputs).reverse().find(input => 
                                    input.offsetParent !== null && 
                                    (input.value === '' || input.value === 'None' || !input.value)
                                );
                                if (inputField) {
                                    console.log(`[UnifiedAuth] Found input field globally using selector: ${selector}`);
                                    break;
                                }
                            }
                        }
                    }

                    if (inputField) {
                        console.log(`[UnifiedAuth] Found input field, starting to type: ${value}`);
                        
                        inputField.focus();
                        inputField.select();
                        
                        this.simulateTyping(inputField, value, () => {
                            setTimeout(() => {
                                console.log(`[UnifiedAuth] Typing complete, checking value. Current: "${inputField.value}", Expected: "${value}"`);
                                if (inputField.value === value || inputField.textContent === value) {
                                    console.log(`[UnifiedAuth] Value set successfully, looking for confirm button: ${confirmAriaLabel}`);
                                    const confirmButton = document.querySelector(`button[aria-label="${confirmAriaLabel}"]`);
                                    if (confirmButton) {
                                        console.log(`[UnifiedAuth] Found confirm button, clicking it`);
                                        confirmButton.click();
                                        console.log(`[UnifiedAuth] Confirmed data for ${editAriaLabel}`);
                                    } else {
                                        console.log(`[UnifiedAuth] Confirm button not found with aria-label: ${confirmAriaLabel}`);
                                    }
                                    if (onSuccess) onSuccess();
                                } else {
                                    console.log(`[UnifiedAuth] Typing simulation failed for ${editAriaLabel}, trying manual value set`);
                                    this.manualValueSet(inputField, value, confirmAriaLabel, editAriaLabel, onSuccess);
                                }
                            }, 200);
                        });

                        console.log(`[UnifiedAuth] Started typing in field: ${editAriaLabel} = ${value}`);
                    } else {
                        console.error(`[UnifiedAuth] Input field not found after clicking edit button for: ${editAriaLabel}`);
                        if (onError) onError();
                    }
                } catch (error) {
                    console.error(`[UnifiedAuth] Error setting field value for ${editAriaLabel}:`, error);
                    if (onError) onError();
                }
            }, 300);
        }

        simulateTyping(inputField, text, callback) {
            console.log(`[UnifiedAuth] Starting fast typing: "${text}"`);
            
            inputField.focus();
            inputField.select();
            document.execCommand('selectAll');
            document.execCommand('delete');
            
            if (document.execCommand('insertText', false, text)) {
                console.log('[UnifiedAuth] Successfully used execCommand insertText');
                setTimeout(() => {
                    this.triggerReactEvents(inputField, text);
                    if (callback) callback();
                }, 50);
            } else {
                console.log('[UnifiedAuth] execCommand failed, trying fast character typing');
                this.simulateCharacterTypingFast(inputField, text, callback);
            }
        }

        simulateCharacterTypingFast(inputField, text, callback) {
            console.log('[UnifiedAuth] Using fast character typing fallback');
            
            inputField.value = '';
            let charIndex = 0;
            
            const typeNextChar = () => {
                if (charIndex >= text.length) {
                    this.triggerReactEvents(inputField, text);
                    if (callback) callback();
                    return;
                }
                
                const char = text[charIndex];
                const newValue = inputField.value + char;
                
                inputField.value = newValue;
                inputField.setAttribute('value', newValue);
                
                const inputEvent = new Event('input', { 
                    bubbles: true, 
                    cancelable: true 
                });
                
                Object.defineProperty(inputEvent, 'target', {
                    writable: false,
                    value: inputField
                });
                Object.defineProperty(inputEvent, 'currentTarget', {
                    writable: false,
                    value: inputField
                });
                
                inputField.dispatchEvent(inputEvent);
                
                charIndex++;
                
                const delay = Math.random() * 10 + 10;
                setTimeout(typeNextChar, delay);
            };
            
            typeNextChar();
        }

        triggerReactEvents(inputField, finalValue) {
            inputField.value = finalValue;
            inputField.setAttribute('value', finalValue);
            
            const events = ['input', 'change', 'blur', 'focusout'];
            
            events.forEach(eventType => {
                const event = new Event(eventType, { 
                    bubbles: true, 
                    cancelable: true 
                });
                
                Object.defineProperty(event, 'target', {
                    writable: false,
                    value: inputField
                });
                Object.defineProperty(event, 'currentTarget', {
                    writable: false,
                    value: inputField
                });
                
                inputField.dispatchEvent(event);
            });
            
            let parent = inputField.parentElement;
            while (parent && parent !== document) {
                try {
                    const changeEvent = new Event('change', { bubbles: true });
                    parent.dispatchEvent(changeEvent);
                } catch (e) {
                    // Ignore errors
                }
                parent = parent.parentElement;
            }
        }

        manualValueSet(inputField, value, confirmAriaLabel, editAriaLabel, onSuccess) {
            console.log('[UnifiedAuth] Using manual value setting method');
            
            inputField.value = value;
            inputField.setAttribute('value', value);
            
            if (inputField.setAttribute) {
                inputField.setAttribute('data-value', value);
            }
            
            try {
                Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(inputField, value);
            } catch (e) {
                console.log('[UnifiedAuth] Property descriptor method failed');
            }
            
            const allEvents = [
                'input', 'change', 'keyup', 'keydown', 'keypress',
                'focus', 'blur', 'focusin', 'focusout',
                'compositionstart', 'compositionend', 'compositionupdate'
            ];
            
            allEvents.forEach(eventType => {
                try {
                    const event = new Event(eventType, { bubbles: true, cancelable: true });
                    inputField.dispatchEvent(event);
                } catch (e) {
                    // Ignore event creation errors
                }
            });
            
            [inputField, inputField.parentElement, inputField.closest('form'), inputField.closest('.css-1jg7pxs')].forEach(element => {
                if (element) {
                    try {
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                        element.dispatchEvent(new Event('change', { bubbles: true }));
                    } catch (e) {
                        // Ignore errors
                    }
                }
            });
            
            console.log(`[UnifiedAuth] Manual value set complete. Value is now: "${inputField.value}"`);
            
            setTimeout(() => {
                const confirmButton = document.querySelector(`button[aria-label="${confirmAriaLabel}"]`);
                if (confirmButton) {
                    console.log('[UnifiedAuth] Clicking confirm button after manual value set');
                    confirmButton.click();
                }
                if (onSuccess) onSuccess();
            }, 150);
        }

        showLoadingOverlay() {
            let overlay = document.getElementById('data-loading-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'data-loading-overlay';
                overlay.innerHTML = `
                    <div class="loading-content">
                        <div class="loading-spinner">
                            <svg viewBox="0 0 50 50">
                                <circle
                                    cx="25"
                                    cy="25"
                                    r="20"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="3"
                                    stroke-linecap="round"
                                    stroke-dasharray="31.416"
                                    stroke-dashoffset="31.416"
                                >
                                    <animate
                                        attributeName="stroke-dasharray"
                                        dur="2s"
                                        values="0 31.416;15.708 15.708;0 31.416"
                                        repeatCount="indefinite"
                                    />
                                    <animate
                                        attributeName="stroke-dashoffset"
                                        dur="2s"
                                        values="0;-15.708;-31.416"
                                        repeatCount="indefinite"
                                    />
                                </circle>
                            </svg>
                        </div>
                        <div class="loading-text">Retrieving Contact Data</div>
                        <div class="loading-subtext">Extracting user IDs and fetching contact information...</div>
                        <div class="loading-progress" id="loading-progress">Initializing...</div>
                    </div>
                `;
                document.body.appendChild(overlay);
            }
            
            setTimeout(() => {
                overlay.classList.add('show');
            }, 10);
        }

        hideLoadingOverlay() {
            const overlay = document.getElementById('data-loading-overlay');
            if (overlay) {
                overlay.classList.remove('show');
            }
        }

        updateLoadingProgress(message) {
            const progressElement = document.getElementById('loading-progress');
            if (progressElement) {
                progressElement.textContent = message;
            }
        }

        showNotification(message) {
            let notification = document.getElementById('data-notification');
            if (!notification) {
                notification = document.createElement('div');
                notification.id = 'data-notification';
                notification.style.cssText = `
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    z-index: 10001;
                    background: var(--ds-background-success, #DCFFF1);
                    color: var(--ds-text-success, #216E4E);
                    border: 1px solid var(--ds-border-success, #22A06B);
                    padding: 12px 16px;
                    border-radius: 4px;
                    font-size: 14px;
                    box-shadow: var(--ds-shadow-raised, 0px 1px 1px #091E4240);
                    max-width: 350px;
                    font-family: var(--ds-font-family-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif);
                    line-height: 1.4;
                `;
                document.body.appendChild(notification);
            }

            notification.textContent = message;
            notification.style.display = 'block';

            setTimeout(() => {
                notification.style.display = 'none';
            }, 4000);
        }
    }

    // Initialize the unified auth manager
    const authManager = new UnifiedAuthManager();

    // Expose to global scope for manual use
    unsafeWindow.unifiedAuth = authManager;

    console.log('[UnifiedAuth] Unified Auth & Data Manager initialized');

})();