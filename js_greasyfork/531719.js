// ==UserScript==
// @name         FrameX Authenticator for agma.io11
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  HWID Authentication for agma.io with improved UI
// @author       You
// @license MIT
// @match        *://agma.io/*
// @match        *://*.agma.io/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @connect      keyauth.win
// @connect      keyauth.cc
// @connect      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531719/FrameX%20Authenticator%20for%20agmaio11.user.js
// @updateURL https://update.greasyfork.org/scripts/531719/FrameX%20Authenticator%20for%20agmaio11.meta.js
// ==/UserScript==

// Check if already initialized to prevent multiple instances
if (window.framexAlreadyInitialized) {
    console.log("FrameX already initialized, preventing duplicate initialization");

let lastUpdateCheck = parseInt(localStorage.getItem('framex-last-update-check') || '0');
const updateCheckInterval = 24 * 60 * 60 * 1000; // Check for updates once a day
const scriptVersion = "2.0"; // Current version from @version
const updateURL = "https://greasyfork.org/scripts/YOUR_SCRIPT_ID/code/FrameX%20Authenticator%20for%20agmaio.user.js";
let updateCheckTimeout = null;

// Add this function to handle update checking
function checkForUpdates(forceCheck = false) {
    const currentTime = Date.now();

    // Only check once per day unless forced
    if (!forceCheck && (currentTime - lastUpdateCheck < updateCheckInterval)) {
        return;
    }

    // Update the last check time
    lastUpdateCheck = currentTime;
    localStorage.setItem('framex-last-update-check', lastUpdateCheck.toString());

    console.log("Checking for script updates...");

    GM_xmlhttpRequest({
        method: "GET",
        url: updateURL,
        onload: function(response) {
            try {
                // Extract version from the response
                const versionMatch = /@version\s+([0-9.]+)/i.exec(response.responseText);

                if (versionMatch && versionMatch[1]) {
                    const latestVersion = versionMatch[1];

                    // Compare versions
                    if (latestVersion !== scriptVersion) {
                        console.log(`Update available: ${scriptVersion} → ${latestVersion}`);
                        showUpdateNotification(latestVersion);
                    } else {
                        console.log("Script is up to date.");
                    }
                }
            } catch (error) {
                console.error("Error checking for updates:", error);
            }
        },
        onerror: function(error) {
            console.error("Failed to check for updates:", error);
        }
    });
}

// Function to show update notification
function showUpdateNotification(newVersion) {
    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'fx-update-notification';
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(108, 99, 255, 0.9);
        color: white;
        padding: 12px 15px;
        border-radius: 8px;
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 14px;
        z-index: 1000000;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        max-width: 300px;
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
        transform: translateY(100px);
        opacity: 0;
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 10px;">
            <div style="flex-shrink: 0; color: #FFD700; font-size: 20px;">⭐</div>
            <div>
                <div style="font-weight: bold; margin-bottom: 5px;">Update Available</div>
                <div style="font-size: 12px; margin-bottom: 8px;">
                    A new version of FrameX (v${newVersion}) is available. Your current version is v${scriptVersion}.
                </div>
                <div style="display: flex; gap: 8px; margin-top: 10px;">
                    <button id="fx-update-now" style="
                        padding: 6px 12px;
                        background: rgba(255, 255, 255, 0.2);
                        border: none;
                        border-radius: 4px;
                        color: white;
                        font-size: 12px;
                        cursor: pointer;
                        flex-grow: 1;
                        transition: background 0.2s;
                    ">Update Now</button>
                    <button id="fx-update-later" style="
                        padding: 6px 12px;
                        background: rgba(0, 0, 0, 0.2);
                        border: none;
                        border-radius: 4px;
                        color: rgba(255, 255, 255, 0.8);
                        font-size: 12px;
                        cursor: pointer;
                        transition: background 0.2s;
                    ">Later</button>
                </div>
            </div>
            <div id="fx-close-update" style="
                cursor: pointer;
                font-size: 16px;
                line-height: 16px;
                margin-left: auto;
                opacity: 0.7;
            ">×</div>
        </div>
    `;

    document.body.appendChild(notification);

    // Add hover effects
    const updateNowBtn = document.getElementById('fx-update-now');
    if (updateNowBtn) {
        updateNowBtn.addEventListener('mouseover', () => {
            updateNowBtn.style.background = 'rgba(255, 255, 255, 0.3)';
        });
        updateNowBtn.addEventListener('mouseout', () => {
            updateNowBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        updateNowBtn.addEventListener('click', () => {
            window.open(updateURL, '_blank');
            closeUpdateNotification();
        });
    }

    const updateLaterBtn = document.getElementById('fx-update-later');
    if (updateLaterBtn) {
        updateLaterBtn.addEventListener('mouseover', () => {
            updateLaterBtn.style.background = 'rgba(0, 0, 0, 0.3)';
        });
        updateLaterBtn.addEventListener('mouseout', () => {
            updateLaterBtn.style.background = 'rgba(0, 0, 0, 0.2)';
        });
        updateLaterBtn.addEventListener('click', closeUpdateNotification);
    }

    document.getElementById('fx-close-update')?.addEventListener('click', closeUpdateNotification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 100);

    function closeUpdateNotification() {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }
}

// Function to show update notification
function showUpdateNotification(newVersion) {
    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'fx-update-notification';
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(108, 99, 255, 0.9);
        color: white;
        padding: 12px 15px;
        border-radius: 8px;
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 14px;
        z-index: 1000000;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        max-width: 300px;
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
        transform: translateY(100px);
        opacity: 0;
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 10px;">
            <div style="flex-shrink: 0; color: #FFD700; font-size: 20px;">⭐</div>
            <div>
                <div style="font-weight: bold; margin-bottom: 5px;">Update Available</div>
                <div style="font-size: 12px; margin-bottom: 8px;">
                    A new version of FrameX (v${newVersion}) is available. Your current version is v${scriptVersion}.
                </div>
                <div style="display: flex; gap: 8px; margin-top: 10px;">
                    <button id="fx-update-now" style="
                        padding: 6px 12px;
                        background: rgba(255, 255, 255, 0.2);
                        border: none;
                        border-radius: 4px;
                        color: white;
                        font-size: 12px;
                        cursor: pointer;
                        flex-grow: 1;
                        transition: background 0.2s;
                    ">Update Now</button>
                    <button id="fx-update-later" style="
                        padding: 6px 12px;
                        background: rgba(0, 0, 0, 0.2);
                        border: none;
                        border-radius: 4px;
                        color: rgba(255, 255, 255, 0.8);
                        font-size: 12px;
                        cursor: pointer;
                        transition: background 0.2s;
                    ">Later</button>
                </div>
            </div>
            <div id="fx-close-update" style="
                cursor: pointer;
                font-size: 16px;
                line-height: 16px;
                margin-left: auto;
                opacity: 0.7;
            ">×</div>
        </div>
    `;

    document.body.appendChild(notification);

    // Add hover effects
    const updateNowBtn = document.getElementById('fx-update-now');
    if (updateNowBtn) {
        updateNowBtn.addEventListener('mouseover', () => {
            updateNowBtn.style.background = 'rgba(255, 255, 255, 0.3)';
        });
        updateNowBtn.addEventListener('mouseout', () => {
            updateNowBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        updateNowBtn.addEventListener('click', () => {
            window.open(updateURL, '_blank');
            closeUpdateNotification();
        });
    }

    const updateLaterBtn = document.getElementById('fx-update-later');
    if (updateLaterBtn) {
        updateLaterBtn.addEventListener('mouseover', () => {
            updateLaterBtn.style.background = 'rgba(0, 0, 0, 0.3)';
        });
        updateLaterBtn.addEventListener('mouseout', () => {
            updateLaterBtn.style.background = 'rgba(0, 0, 0, 0.2)';
        });
        updateLaterBtn.addEventListener('click', closeUpdateNotification);
    }

    document.getElementById('fx-close-update')?.addEventListener('click', closeUpdateNotification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 100);

    function closeUpdateNotification() {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }
}

    // Force cleanup any existing UI elements
const elementsToRemove = [
    'power-counter',
    'power-counter-tab',
    'multi-keybind-panel',
    'timer-display',
    'welcome-notification',
    // Add these lines:
    'fx-gold-panel',
    'gold-stats-tab'
];

    elementsToRemove.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            console.log(`Removing duplicate element: ${id}`);
            el.parentNode.removeChild(el);
        }
    });

    return;
}

// Mark as initialized with a timestamp to help with debugging
window.framexAlreadyInitialized = Date.now();

// Modified WebSocket proxy at document-start
(function() {
    'use strict';

    // Track initialization to prevent duplicate load event handlers
    let initialized = false;

    // Make sure these variables are in global scope (window)
    unsafeWindow.send = null;
    unsafeWindow.x = null;
    unsafeWindow.y = null;
    unsafeWindow.keyAuthApp = null;

    // Add power tracking variables
unsafeWindow.powerStats = {
    total: 0,
    individual: {},
    lastUsed: null,
    startTime: Date.now()
};

// Add this to reset gold stats:
window.goldStats = {
    startingGold: 0,
    currentGold: 0,
    sessionStart: Date.now(),
    isTracking: false,
    lastUpdate: Date.now()
};
localStorage.removeItem('framex-gold-stats');

    // Add these state variables near the top of your code
    let isAuthenticated = false;
    let powerStatsEnabled = false;
    let multiDropEnabled = false;
    let keyAuthInitialized = false;
    let timerUpdateInterval = null;
    let blinkInterval = null;
    let welcomeTimeout = null;
    let usernameCheckInterval = null;
    let isLoginMinimized = false;
    let loginOpenerVisible = false;

    // Add this to your global variables section near the top
    let gameStats = {
        games: 0,
        kills: 0,
        deaths: 0,
        maxMass: 0,
        totalPlayTime: 0,
        longestLife: 0,
        currentGameStart: 0,
        isPlaying: false,
        lastMass: 0,
        history: []
    };

    // KeyAuth Class
    class KeyAuth {
        constructor(name, ownerId, secret, version) {
            if (!(name && ownerId && secret && version)) {
                throw new Error('Application not setup correctly.');
            }
            console.log(`Creating KeyAuth instance for "${name}" (v${version})`);
            this.name = name;
            this.ownerId = ownerId;
            this.secret = secret;
            this.version = version;
            this.sessionid = null;
            this.initialized = false;
            this.app_data = {};
            this.user_data = {};
            this.response = {};
            this.maxRetries = 3; // Add retry capability
        }

        GetCurrentHardwareId() {
            const stableInfo = {
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform,
                hardwareConcurrency: navigator.hardwareConcurrency,
                deviceMemory: navigator.deviceMemory,
                screenResolution: `${screen.width}x${screen.height}`,
                colorDepth: screen.colorDepth,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                touchPoints: navigator.maxTouchPoints,
                webglVendor: '',
                webglRenderer: ''
            };

            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (gl) {
                    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                    if (debugInfo) {
                        stableInfo.webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                        stableInfo.webglRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    }
                }
            } catch (e) {
                // WebGL not available
            }

            const stableString = JSON.stringify(stableInfo);
            let hash = 0;
            for (let i = 0; i < stableString.length; i++) {
                const char = stableString.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash |= 0;
            }

            let hwId = Math.abs(hash).toString(36);
            while (hwId.length < 64) {
                hwId += Math.abs(hash).toString(36);
            }

            return hwId.substring(0, 64);
        }

        async Initialize() {
            try {
                console.log('Starting KeyAuth Initialize method...');
                const post_data = {
                    type: 'init',
                    ver: this.version,
                    name: this.name,
                    ownerid: this.ownerId
                };

                console.log('KeyAuth Init request data:', JSON.stringify(post_data));

                let Json;
                try {
                    Json = await this.make_request(post_data);
                    console.log('KeyAuth Init response received:', Json);
                } catch (reqError) {
                    console.error('KeyAuth request error during Init:', reqError);
                    throw new Error(`KeyAuth request failed: ${reqError.message}`);
                }

                if (Json === 'KeyAuth_Invalid') {
                    console.error('KeyAuth returned KeyAuth_Invalid');
                    throw new Error('Invalid Application');
                }

                if (!Json) {
                    console.error('KeyAuth returned empty response');
                    throw new Error('Empty response from KeyAuth server');
                }

                if (!Json.success) {
                    console.error('KeyAuth Init unsuccessful:', Json.message || 'No error message provided');
                    throw new Error(`KeyAuth Init failed: ${Json.message || 'Unknown error'}`);
                }

                this.app_data = Json.appinfo;
                this.sessionid = Json.sessionid;
                this.initialized = true;
                console.log('KeyAuth fully initialized with sessionid:', this.sessionid);
                return true;
            } catch (error) {
                console.error('KeyAuth Initialize method error:', error);
                this.initialized = false;
                throw error;
            }
        }

        check_initialize() {
            if (!this.initialized) {
                throw new Error('You must initialize the API before using it!');
            }
            return true;
        }

        async make_request(data) {
            try {
                console.log(`Making KeyAuth request: ${data.type}`, data);

                // Ensure all required parameters are included
                const requestData = {
                    type: data.type,
                    ownerid: "UpJ7VlJ7au", // Your ownerID
                    name: "Ovoscooby's Application", // Your app name
                    version: "1.0" // Your app version
                };

                // Add any additional data parameters
                Object.assign(requestData, data);

                // Make the request to the new endpoint
                const response = await fetch('https://keyauth.win/api/1.2/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams(requestData)
                });

                const rawText = await response.text();

                try {
                    // First try to parse as JSON
                    const Json = JSON.parse(rawText);

                    // Even if parsing succeeds, check if the response is valid
                    if (!Json || typeof Json !== 'object') {
                        console.error('Invalid response format:', rawText);
                        return { success: false, message: 'Invalid subscription or license key' };
                    }

                    return Json;
                } catch (parseError) {
                    console.error('Failed to parse response:', rawText);

                    // Return a more user-friendly error message
                    return {
                        success: false,
                        message: 'Invalid subscription or license key'
                    };
                }

            } catch (error) {
                console.error('KeyAuth request failed:', error);
                return {
                    success: false,
                    message: 'Connection error, please try again'
                };
            }
        }

        async license(key) {
            this.check_initialize();
            const hwid = this.GetCurrentHardwareId();
            const currentTime = Math.floor(Date.now() / 1000);

            const existingSubscription = localStorage.getItem('keyauth_subscription');
            if (existingSubscription) {
                try {
                    const subData = JSON.parse(existingSubscription);
                    if (subData.expiry > currentTime && subData.key !== key) {
                        throw new Error('You already have an active subscription. You cannot activate a different key.');
                    }
                } catch (e) {
                    localStorage.removeItem('keyauth_subscription');
                }
            }

            const post_data = {
                type: 'license',
                key,
                hwid,
                sessionid: this.sessionid,
                name: this.name,
                ownerid: this.ownerId
            };

            const response = await this.make_request(post_data);

            if (!response.success) {
                localStorage.removeItem('keyauth_subscription');
                throw new Error(response.message || 'Invalid or deleted license key');
            }

            if (!response.info || !response.info.subscriptions || response.info.subscriptions.length === 0) {
                localStorage.removeItem('keyauth_subscription');
                throw new Error('Invalid subscription data');
            }

            const timeLeft = parseInt(response.info.subscriptions[0].timeleft);
            if (timeLeft <= 0) {
                localStorage.removeItem('keyauth_subscription');
                throw new Error('This license key has expired.');
            }

            // Store the actual time left from KeyAuth
            localStorage.setItem('keyauth_subscription', JSON.stringify({
                key: key,
                hwid: hwid,
                expiry: currentTime + timeLeft,
                lastVerified: currentTime
            }));

            this.user_data = response.info;
            return response;
        }
    }

    // Initialize KeyAuth with your credentials (only once)
    const KeyAuthApp = new KeyAuth(
        "Ovoscooby's Application", // App name
        "UpJ7VlJ7au", // Account ID
        "6af90c9f13a218b8597605593efc105176da24296acca3681b81c2f51b9993a3", // Encryption key
        "1.0" // Application version
    );

    // Make KeyAuthApp available globally
    unsafeWindow.keyAuthApp = KeyAuthApp;

    // Enhanced WebSocket proxy with better error handling
    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(...args) {
        // Store the send function globally
        unsafeWindow.send = (...params) => originalWebSocketSend.apply(this, params);

        try {
            let data = args[0];
            data = data instanceof ArrayBuffer ? new DataView(data) :
                  data instanceof DataView ? data :
                  new DataView(data.buffer);

            if (0 === data.getUint8(0, true) && 9 === data.byteLength) {
                unsafeWindow.x = data.getInt32(1, true);
                unsafeWindow.y = data.getInt32(5, true);

            }
        } catch (err) {
            console.error("Error in WebSocket proxy:", err);
        }

        return originalWebSocketSend.apply(this, args);
    };

    // Create sendPw function in global scope
    unsafeWindow.sendPw = function(e) {
        console.log("sendPw called with power:", e);
        if (!unsafeWindow.send) {
            console.error("send function not initialized yet");
            return;
        }

        try {
            let t = new DataView(new ArrayBuffer(10));
            t.setUint8(0, 72);
            t.setInt32(1, unsafeWindow.x, true);
            t.setInt32(5, unsafeWindow.y, true);
            t.setUint8(9, e);
            unsafeWindow.send(t);

            // Track power usage statistics
            unsafeWindow.powerStats.total++;
            unsafeWindow.powerStats.individual[e] = (unsafeWindow.powerStats.individual[e] || 0) + 1;

            // Add timestamp for this power use
            if (!unsafeWindow.powerStats.powerHistory) {
                unsafeWindow.powerStats.powerHistory = {};
            }
            unsafeWindow.powerStats.powerHistory[e] = Date.now();

            unsafeWindow.powerStats.lastUsed = {
                power: e,
                time: new Date().toLocaleTimeString()
            };

            // Update the display if it exists
            updatePowerCounterDisplay();

            console.log(`Power ${e} sent successfully`);
        } catch (err) {
            console.error("Error in sendPw:", err);
        }
    };

    // Format seconds into appropriate time unit
    function formatTimeRemaining(seconds) {
        if (seconds < 0) return "0s";

        if (seconds < 60) {
            // Less than a minute - show seconds
            return `${seconds}s`;
        } else if (seconds < 3600) {
            // Less than an hour - show minutes and seconds
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}m ${remainingSeconds}s`;
        } else if (seconds < 86400) {
            // Less than a day - show hours and minutes
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return `${hours}h ${minutes}m`;
        } else {
            // More than a day - show days and hours
            const days = Math.floor(seconds / 86400);
            const hours = Math.floor((seconds % 86400) / 3600);
            return `${days}d ${hours}h`;
        }
    }

    function isValidLicenseKey(key) {
        // First strip any spaces that might have been missed
        key = key.replace(/\s+/g, '');

        // Accept various key formats:
        // 1. FRAME-XXXXX-XXXXX-XXXXX-XXXXX pattern (exactly 5 chars in each segment)
        // 2. TEST-KEY-XXXXX pattern (exactly 5 chars in the last segment)
        // 3. Any alphanumeric key with dashes that's at least 10 chars long
        return (
            typeof key === 'string' &&
            (
                key.match(/^FRAME-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}$/) ||
                key.match(/^TEST-KEY-[A-Za-z0-9]{5}$/) ||
                key.match(/^[A-Za-z0-9\-]{10,}$/)
            )
        );
    }

    // Verify license key function
    async function verifyLicenseKey(key) {
        try {
            console.log('Attempting to verify KeyAuth license key:', key);

            if (!isValidLicenseKey(key)) {
                return {
                    success: false,
                    message: 'Invalid license key format'
                };
            }

            // Make sure KeyAuth is initialized
            if (unsafeWindow.keyAuthApp && !unsafeWindow.keyAuthApp.initialized) {
                try {
                    await unsafeWindow.keyAuthApp.Initialize();
                    keyAuthInitialized = true;
                } catch (initError) {
                    console.error('KeyAuth initialization failed:', initError);
                    return {
                        success: false,
                        message: 'Failed to connect to authentication server'
                    };
                }
            }

            // Use KeyAuth to verify the license
            try {
                const response = await unsafeWindow.keyAuthApp.license(key);

                if (!response.success) {
                    isAuthenticated = false;
                    return {
                        success: false,
                        message: response.message || 'Invalid or deleted license key'
                    };
                }

                if (!response.info || !response.info.subscriptions || response.info.subscriptions.length === 0) {
                    isAuthenticated = false;
                    return {
                        success: false,
                        message: 'Invalid subscription data'
                    };
                }

                const timeLeft = parseInt(response.info.subscriptions[0].timeleft);
                if (timeLeft <= 0) {
                    isAuthenticated = false;
                    return {
                        success: false,
                        message: 'This license key has expired'
                    };
                }

                // Set authenticated to true on success
                isAuthenticated = true;
                powerStatsEnabled = true;
                multiDropEnabled = true;

                console.log('Authentication successful, features enabled');

                return {
                    success: true,
                    message: 'License successfully verified',
                    duration: timeLeft,
                    username: response.info.username || 'User',
                    subscription: response.info.subscriptions[0].subscription,
                    expiry: Math.floor(Date.now() / 1000) + timeLeft
                };
            } catch (apiError) {
                console.error('KeyAuth API error:', apiError);
                return {
                    success: false,
                    message: 'Authentication service error: ' + (apiError.message || 'Unknown error')
                };
            }

        } catch (error) {
            console.error('License verification error:', error);
            isAuthenticated = false;
            return {
                success: false,
                message: 'Verification error: ' + error.message
            };
        }
    }

    // Helper function to get username from the game using class selector
    function getUsername() {
        // Try to get username from the game using the username class
        const usernameElements = document.getElementsByClassName('username');
        if (usernameElements && usernameElements.length > 0) {
            for (let i = 0; i < usernameElements.length; i++) {
                const username = usernameElements[i].innerText.trim();
                if (username && username !== 'undefined' && username !== 'null') {
                    return username;
                }
            }
        }

        // Fallback to 'User'
        return 'User';
    }

    // Show welcome notification with active username checking
    function showWelcomeNotification(isAutoLogin = false) {
        if (welcomeTimeout) {
            clearTimeout(welcomeTimeout);
        }

        if (usernameCheckInterval) {
            clearInterval(usernameCheckInterval);
        }

        // Initial username (might be "User" if not loaded yet)
        let username = getUsername();

        // Update welcome message with initial username
        const welcomeMessage = document.querySelector('#welcome-notification div div:first-child');
        const welcomeSubMessage = document.querySelector('#welcome-notification div div:last-child');

        if (welcomeMessage) {
            // If auto-login and no username is available yet
            if (isAutoLogin && username === 'User') {
                welcomeMessage.textContent = 'Welcome back!';
                if (welcomeSubMessage) {
                    welcomeSubMessage.textContent = 'Key detected, logging in...';
                }
            } else {
                welcomeMessage.textContent = `Welcome back, ${username}!`;
                if (welcomeSubMessage) {
                    welcomeSubMessage.textContent = 'Authentication successful';
                }
            }
        }

        // Show the notification with animation
        const welcomeNotification = document.getElementById('welcome-notification');
        if (welcomeNotification) {
            welcomeNotification.style.transform = 'translateX(-50%) translateY(0)';

            // Check for username updates for a few seconds
            let attempts = 0;
            usernameCheckInterval = setInterval(() => {
                const newUsername = getUsername();
                if (newUsername !== 'User' && newUsername !== username) {
                    username = newUsername;
                    if (welcomeMessage) {
                        welcomeMessage.textContent = `Welcome back, ${username}!`;
                        if (welcomeSubMessage) {
                            welcomeSubMessage.textContent = 'Authentication successful';
                        }
                    }
                    clearInterval(usernameCheckInterval);
                }

                attempts++;
                if (attempts >= 10) { // Try for 5 seconds (10 attempts * 500ms)
                    clearInterval(usernameCheckInterval);
                }
            }, 500);

            // Hide after 5 seconds
            welcomeTimeout = setTimeout(() => {
                welcomeNotification.style.transform = 'translateX(-50%) translateY(-100px)';
                if (usernameCheckInterval) {
                    clearInterval(usernameCheckInterval);
                }
            }, 5000);
        }
    }

    // Update timer display
    function updateTimerDisplay(subscription) {
        const timerDisplay = document.getElementById('timer-display');
        if (!timerDisplay) return;

        const currentTime = Math.floor(Date.now() / 1000);
        const remainingSeconds = subscription.expiry - currentTime;

        if (remainingSeconds <= 0) {
            timerDisplay.innerHTML = `<span style="color: #ff4d4d;">0s</span>`;
            timerDisplay.classList.remove('blink');

            // Clear blinking interval if it exists
            if (blinkInterval) {
                clearInterval(blinkInterval);
                blinkInterval = null;
            }

            // Show login modal after a short delay
            setTimeout(() => {
                localStorage.removeItem('keyauth_subscription');
                const keyAuthModal = document.getElementById('keyauth-modal');
                if (keyAuthModal) {
                    keyAuthModal.style.display = 'block';
                    keyAuthModal.style.transform = 'translate(-50%, -50%) scale(1)';
                    keyAuthModal.style.opacity = '1';
                }
                isLoginMinimized = false;
                timerDisplay.style.display = 'none';
                const loginPill = document.getElementById('login-pill');
                if (loginPill) {
                    loginPill.style.display = 'none';
                }
                loginOpenerVisible = false;
                clearInterval(timerUpdateInterval);
                const status = document.getElementById('license-status');
                if (status) {
                    status.textContent = 'License expired. Enter new key.';
                }

                // Call the logout handler
                handleLogout();
            }, 3000);

            return;
        }

        const formattedTime = formatTimeRemaining(remainingSeconds);

        // Key icon SVG (minimalistic)
        const keyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>`;

        timerDisplay.innerHTML = `${keyIcon} <span>${formattedTime}</span>`;

        // Handle color and blinking for different time ranges
        if (remainingSeconds < 300) { // Less than 5 minutes
            timerDisplay.querySelector('span').style.color = "#ff4d4d"; // Red

            // Set up blinking if not already blinking
            if (!blinkInterval) {
                timerDisplay.classList.add('blink');
                timerDisplay.style.backgroundColor = 'rgba(255, 77, 77, 0.7)';
            }
        } else {
            // Remove blinking if time is above threshold
            if (timerDisplay.classList.contains('blink')) {
                timerDisplay.classList.remove('blink');
                timerDisplay.style.backgroundColor = 'rgba(20, 20, 28, 0.7)';

                // Clear blink interval if it exists
                if (blinkInterval) {
                    clearInterval(blinkInterval);
                    blinkInterval = null;
                }
            }

            // Set appropriate colors based on time left
            if (remainingSeconds < 3600) { // Less than 1 hour
                timerDisplay.querySelector('span').style.color = "#ff9800"; // Orange
            } else if (remainingSeconds < 86400) { // Less than 1 day
                timerDisplay.querySelector('span').style.color = "#ffeb3b"; // Yellow
            } else {
                timerDisplay.querySelector('span').style.color = "#ffffff"; // White
            }
        }
    }

    // Show minimalistic timer
    function showTimerDisplay(subscription) {
        const keyAuthModal = document.getElementById('keyauth-modal');
        if (keyAuthModal) {
            keyAuthModal.style.display = 'none';
        }

        const loginPill = document.getElementById('login-pill');
        if (loginPill) {
            loginPill.style.display = 'none';
            loginOpenerVisible = false;
        }

        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay) {
            timerDisplay.style.display = 'block';

            // Update timer immediately
            updateTimerDisplay(subscription);

            // Clear existing intervals
            clearInterval(timerUpdateInterval);
            clearInterval(blinkInterval);

            // Set update frequency based on time remaining
            const currentTime = Math.floor(Date.now() / 1000);
            const remainingSeconds = subscription.expiry - currentTime;

            let updateFrequency = 60000; // Default: update every minute

            if (remainingSeconds < 300) { // Less than 5 minutes
                updateFrequency = 1000; // Update every second
            } else if (remainingSeconds < 3600) { // Less than an hour
                updateFrequency = 5000; // Update every 5 seconds
            }

            // Update timer at appropriate frequency
            timerUpdateInterval = setInterval(() => {
                updateTimerDisplay(subscription);
            }, updateFrequency);
        }
    }

    // Add a loading screen function
    function showLoadingScreen() {
        // Create loading overlay container
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'keyauth-loading-overlay';
        loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(20, 20, 28, 0.95);
            z-index: 1000000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(5px);
            transition: opacity 0.5s ease;
        `;

        // Create animated logo/spinner
        const spinnerContainer = document.createElement('div');
        spinnerContainer.style.cssText = `
            position: relative;
            width: 80px;
            height: 80px;
            margin-bottom: 25px;
        `;

        // Create outer circle spinner
        const spinner = document.createElement('div');
        spinner.style.cssText = `
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 3px solid transparent;
            border-top-color: #6c63ff;
            border-bottom-color: #6c63ff;
            animation: spin 1.5s linear infinite;
        `;

        // Create inner circle spinner
        const innerSpinner = document.createElement('div');
        innerSpinner.style.cssText = `
            position: absolute;
            top: 15px;
            left: 15px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 3px solid transparent;
            border-left-color: #ff4d94;
            border-right-color: #ff4d94;
            animation: spin 1s linear infinite reverse;
        `;

        // Create progress container
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            width: 200px;
            background: rgba(255, 255, 255, 0.1);
            height: 4px;
            border-radius: 2px;
            margin: 30px 0 15px 0;
            overflow: hidden;
        `;

        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.id = 'keyauth-loading-progress';
        progressBar.style.cssText = `
            width: 0%;
            height: 100%;
            background: linear-gradient(to right, #6c63ff, #ff4d94);
            transition: width 0.3s ease;
        `;
        progressContainer.appendChild(progressBar);

        // Create loading message
        const loadingMessage = document.createElement('div');
        loadingMessage.id = 'keyauth-loading-message';
        loadingMessage.style.cssText = `
            color: white;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 16px;
            margin-top: 10px;
            text-align: center;
        `;
        loadingMessage.textContent = 'Initializing...';

        // Create status message (smaller text under main message)
        const loadingStatus = document.createElement('div');
        loadingStatus.id = 'keyauth-loading-status';
        loadingStatus.style.cssText = `
            color: rgba(255, 255, 255, 0.7);
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 13px;
            margin-top: 8px;
            text-align: center;
            max-width: 300px;
        `;
        loadingStatus.textContent = 'Setting up key authentication...';

        // Add animation styles
        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        document.head.appendChild(animationStyle);

        // Add elements to the loading overlay
        spinnerContainer.appendChild(spinner);
        spinnerContainer.appendChild(innerSpinner);
        loadingOverlay.appendChild(spinnerContainer);
        loadingOverlay.appendChild(loadingMessage);
        loadingOverlay.appendChild(progressContainer);
        loadingOverlay.appendChild(loadingStatus);

        // Add the loading overlay to the document
        document.body.appendChild(loadingOverlay);

        // Initialize progress and messages
        updateLoadingProgress(0, 'Initializing system...');

        return loadingOverlay;
    }

    // Function to update the loading progress and messages

            // Function to update the loading progress and messages
    function updateLoadingProgress(percent, status, mainMessage = null) {
        const progressBar = document.getElementById('keyauth-loading-progress');
        const loadingStatus = document.getElementById('keyauth-loading-status');
        const loadingMessage = document.getElementById('keyauth-loading-message');

        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }

        if (loadingStatus && status) {
            loadingStatus.textContent = status;
        }

        if (mainMessage && loadingMessage) {
            loadingMessage.textContent = mainMessage;
        }
    }

    // Function to run through a loading sequence and then hide the loading screen
    function runLoadingSequence(overlay) {
        return new Promise((resolve) => {
            // Sequence of loading steps with timing
            const loadingSteps = [
                { percent: 15, message: 'Authenticating license...', delay: 200 },
                { percent: 30, message: 'Validating user credentials...', delay: 200 },
                { percent: 45, message: 'Loading user preferences...', delay: 200 },
                { percent: 60, message: 'Initializing multi-key system...', delay: 200 },
                { percent: 75, message: 'Setting up power tracking...', delay: 200 },
                { percent: 90, message: 'Connecting to game...', delay: 200 },
                { percent: 100, message: 'Ready!', mainMessage: 'Loading complete', delay: 500 }
            ];

            let currentStep = 0;

            function processNextStep() {
                if (currentStep >= loadingSteps.length) {
                    // All steps completed, fade out and resolve
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        if (document.body.contains(overlay)) {
                            document.body.removeChild(overlay);
                        }
                        resolve();
                    }, 500);
                    return;
                }

                const step = loadingSteps[currentStep];
                updateLoadingProgress(
                    step.percent,
                    step.message,
                    step.mainMessage || (step.percent === 100 ? 'Loading complete' : null)
                );

                currentStep++;
                setTimeout(processNextStep, step.delay);
            }

            // Start the sequence
            processNextStep();
        });
    }

    // Handle logout
function handleLogout() {
    // Reset authentication states
    isAuthenticated = false;
    powerStatsEnabled = false;
    multiDropEnabled = false;

    // Clear update check timeout
    if (updateCheckTimeout) {
        clearTimeout(updateCheckTimeout);
    }

    // Remove UI elements directly
    const elementsToRemove = [
        'power-counter',
        'power-counter-tab',
        'multi-keybind-panel',
        'timer-display',
        'welcome-notification',
        'fx-gold-panel',
        'gold-stats-tab',
        'fx-player-tracker',
        'player-tracker-tab',
        'player-tracker-alert',
        'enemy-alert',
        'fx-update-notification'  // Also remove update notification if it exists
    ];

    // Force removal of all elements
    elementsToRemove.forEach(id => {
        const element = document.getElementById(id);
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    });

    // Clear intervals
    if (window.powerCounterTimer) {
        clearTimeout(window.powerCounterTimer);
    }
    if (timerUpdateInterval) {
        clearInterval(timerUpdateInterval);
    }
    if (blinkInterval) {
        clearInterval(blinkInterval);
    }
    // Clear player tracker interval
    if (window.profileCheckInterval) {
        clearInterval(window.profileCheckInterval);
    }

    // Clear localStorage
    localStorage.removeItem('keyauth_subscription');
    localStorage.removeItem('Multikey');
    localStorage.removeItem('multiDrop');
    localStorage.removeItem('multiPelletAmount');
    localStorage.removeItem('breakShieldOption');
    localStorage.removeItem('framex-gold-stats');
    localStorage.removeItem('player-tracker-page');
    // Don't remove 'framex-player-tracker' to keep player database

    // Reset power stats
    unsafeWindow.powerStats = {
        total: 0,
        individual: {},
        lastUsed: null,
        startTime: Date.now()
    };

    // Reset gold stats
    window.goldStats = {
        startingGold: 0,
        currentGold: 0,
        sessionStart: Date.now(),
        isTracking: false,
        lastUpdate: Date.now()
    };

    // Reset player tracker reference
    window.playerTracker = null;

    // Show login modal
    const keyAuthModal = document.getElementById('keyauth-modal');
    if (keyAuthModal) {
        keyAuthModal.style.display = 'block';
        keyAuthModal.style.transform = 'translate(-50%, -50%) scale(1)';
        keyAuthModal.style.opacity = '1';
    }

    // Update status message
    const status = document.getElementById('license-status');
    if (status) {
        status.textContent = 'Logged out successfully.';
        status.style.color = '#4CAF50';
    }

    console.log('Logout completed, all features disabled');
}
    // Function to check for existing subscription
   function checkExistingSubscription() {
    return new Promise(async (resolve) => {
        try {
            const subscription = JSON.parse(localStorage.getItem('keyauth_subscription') || 'null');
            const currentTime = Math.floor(Date.now() / 1000);

            if (subscription && subscription.expiry > currentTime && subscription.key) {
                console.log('Subscription found, verifying...');

                const loadingOverlay = showLoadingScreen();
                updateLoadingProgress(15, 'Verifying license key...', 'License Verification');

                // Initialize KeyAuth if needed
                if (unsafeWindow.keyAuthApp && !unsafeWindow.keyAuthApp.initialized) {
                    try {
                        await unsafeWindow.keyAuthApp.Initialize();
                        keyAuthInitialized = true;
                    } catch (error) {
                        console.error('KeyAuth initialization failed:', error);
                    }
                }

                try {
                    const result = await verifyLicenseKey(subscription.key);
                    if (result.success) {
                        // Set authentication state explicitly
                        isAuthenticated = true;
                        powerStatsEnabled = true;
                        multiDropEnabled = true;

                        console.log('Authentication state set to:', isAuthenticated);

                        // Update subscription
                        subscription.expiry = currentTime + result.duration;
                        subscription.lastVerified = currentTime;
                        localStorage.setItem('keyauth_subscription', JSON.stringify(subscription));

                        // Run loading sequence
                        await runLoadingSequence(loadingOverlay);

                        // Initialize features explicitly
                        createPowerCounterAndKeybinds();
                        setupMultiPowerKeyBinds();

                        // Show UI elements
                        showTimerDisplay(subscription);
                        showWelcomeNotification(true);

                        // Add these lines to initialize player tracker and gold tracker
                        createGoldStatsTracker();
                        if (typeof createPlayerTracker === 'function') {
                            window.playerTracker = createPlayerTracker();
                        }

                        resolve(true);
                        return;
                    }
                } catch (error) {
                    console.error('License verification failed:', error);
                }

                document.body.removeChild(loadingOverlay);
                localStorage.removeItem('keyauth_subscription');
                isAuthenticated = false;
            }
        } catch (error) {
            console.error('Error checking subscription:', error);
            localStorage.removeItem('keyauth_subscription');
            isAuthenticated = false;
        }

        resolve(false);
    });
}
    // Create the UI elements
// Create the UI elements
function createUIElements() {
    // Check if UI elements already exist to prevent duplication
    if (document.getElementById('keyauth-modal')) {
        console.log("UI elements already exist, skipping creation");
        return;
    }

    console.log("Creating UI elements");

    // Create KeyAuth Modal
    const keyAuthModal = document.createElement('div');
    keyAuthModal.id = 'keyauth-modal';
    keyAuthModal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(20, 20, 28, 0.95);
        padding: 30px;
        border-radius: 12px;
        z-index: 999999;
        width: 320px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        display: block;
        font-family: 'Segoe UI', Arial, sans-serif;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;

    // Logo icon
    const logoIcon = `
        <div style="
            width: 90px;
            height: 90px;
            margin: 0 auto 20px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: visible;
        ">
            <!-- Subtle fire/glow background effect -->
            <div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: radial-gradient(
                    circle at center,
                    rgba(255, 0, 0, 0.15) 0%,
                    rgba(255, 0, 0, 0.1) 30%,
                    transparent 70%
                );
                filter: blur(8px);
                animation: backgroundPulse 3s ease-in-out infinite;
            "></div>

            <!-- Combined FX Logo -->
            <div style="
                position: relative;
                font-family: 'Arial Black', sans-serif;
                font-size: 52px;
                font-weight: 900;
                letter-spacing: -10px;
                transform: skew(-10deg);
                display: flex;
                z-index: 2;
            ">
                <!-- Main FX -->
                <div style="
                    position: relative;
                    color: #ffffff;
                    text-shadow:
                        2px 2px 8px rgba(255, 0, 0, 0.8),
                        0 0 20px rgba(255, 0, 0, 0.4);
                    display: flex;
                ">
                    <span style="
                        color: #ffffff;
                        z-index: 3;
                        position: relative;
                    ">F</span>
                    <span style="
                        color: #ffffff;
                        margin-left: -8px;
                        position: relative;
                        z-index: 2;
                    ">X</span>
                </div>

                <!-- Fire effect overlay -->
                <div style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    color: #ff0000;
                    display: flex;
                    opacity: 0.7;
                    filter: blur(1px);
                    animation: fireFlicker 3s ease-in-out infinite;
                ">
                    <span>F</span><span style="margin-left: -8px;">X</span>
                </div>

                <!-- Extra glow layer -->
                <div style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    color: #ff3300;
                    display: flex;
                    opacity: 0.4;
                    filter: blur(4px);
                    animation: glowPulse 2s ease-in-out infinite alternate;
                ">
                    <span>F</span><span style="margin-left: -8px;">X</span>
                </div>
            </div>
        </div>
    `;

    // Add subtle animations
    const additionalStyle = document.createElement('style');
    additionalStyle.textContent = `
        @keyframes backgroundPulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
        }

        @keyframes fireFlicker {
            0%, 100% { opacity: 0.7; transform: translateY(0); }
            50% { opacity: 0.5; transform: translateY(0.5px); }
        }

        @keyframes glowPulse {
            0% { opacity: 0.3; filter: blur(4px); }
            100% { opacity: 0.5; filter: blur(6px); }
        }

        @keyframes blink-animation {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
        }
        .blink {
            animation: blink-animation 1s infinite;
        }

        #minimize-login:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        #login-pill:hover {
            background: rgba(108, 99, 255, 1);
            transform: translateY(-2px);
        }

        @keyframes gradientAnimation {
            0% {
                background-position: 0% 50%;
                background-size: 100% 100%;
            }
            50% {
                background-position: 100% 50%;
                background-size: 200% 200%;
            }
            100% {
                background-position: 0% 50%;
                background-size: 100% 100%;
            }
        }

        #keyauth-modal {
            background: linear-gradient(
                45deg,
                rgba(20, 20, 28, 0.2) 0%,
                rgba(255, 0, 0, 0.2) 25%,
                rgba(20, 20, 28, 0.2) 50%,
                rgba(255, 0, 0, 0.2) 75%,
                rgba(20, 20, 28, 0.2) 100%
            ) !important;
            background-size: 400% 400% !important;
            animation: gradientAnimation 15s ease infinite !important;
            backdrop-filter: blur(10px);
        }

        #timer-display {
            background: linear-gradient(
                45deg,
                rgba(20, 20, 28, 0.15) 0%,
                rgba(255, 0, 0, 0.15) 50%,
                rgba(20, 20, 28, 0.15) 100%
            ) !important;
            background-size: 200% 200% !important;
            animation: gradientAnimation 10s ease infinite !important;
        }

        #login-pill {
            background: linear-gradient(
                45deg,
                rgba(20, 20, 28, 0.9) 0%,
                rgba(255, 0, 0, 0.9) 50%,
                rgba(20, 20, 28, 0.9) 100%
            ) !important;
            background-size: 200% 200% !important;
            animation: gradientAnimation 8s ease infinite !important;
        }

        #welcome-notification {
            background: linear-gradient(
                45deg,
                rgba(20, 20, 28, 0.9) 0%,
                rgba(255, 0, 0, 0.9) 50%,
                rgba(20, 20, 28, 0.9) 100%
            ) !important;
            background-size: 200% 200% !important;
            animation: gradientAnimation 8s ease infinite !important;
        }

        #keyauth-loading-overlay {
            background: linear-gradient(
                45deg,
                rgba(20, 20, 28, 0.97) 0%,
                rgba(40, 0, 0, 0.97) 25%,
                rgba(60, 0, 0, 0.97) 50%,
                rgba(40, 0, 0, 0.97) 75%,
                rgba(20, 20, 28, 0.97) 100%
            ) !important;
            background-size: 400% 400% !important;
            animation: gradientAnimation 15s ease infinite !important;
        }

        #direct-tos-modal > div {
            background: linear-gradient(
                45deg,
                rgba(20, 20, 28, 0.97) 0%,
                rgba(30, 30, 40, 0.97) 25%,
                rgba(40, 40, 50, 0.97) 50%,
                rgba(30, 30, 40, 0.97) 75%,
                rgba(20, 20, 28, 0.97) 100%
            ) !important;
            background-size: 400% 400% !important;
            animation: gradientAnimation 15s ease infinite !important;
        }

        /* Add a subtle glow effect to buttons */
        #activate-license, #direct-accept-tos, #tos-button {
            background: transparent;
            border: none;
            color: #ff0000;
            transition: all 0.3s ease;
        }

        #activate-license:hover, #direct-accept-tos:hover, #tos-button:hover {
            transform: scale(1.05);
            color: #ff4d4d;
        }

        @keyframes pulse {
            0% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
            }

            70% {
                transform: scale(1);
                box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
            }

            100% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
            }
        }

        .pulse-button {
            animation: pulse 1.5s infinite;
        }

        .pulse-button:hover {
            animation: none;
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(additionalStyle);

    // Add minimize and close buttons
    const controlButtons = `
        <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 8px;">
            <button id="minimize-login" style="
                width: 28px;
                height: 28px;
                border-radius: 50%;
                border: none;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                font-size: 16px;
                transition: background 0.2s;
            ">_</button>
        </div>
    `;

    // Check if TOS has been accepted
    const tosAccepted = localStorage.getItem('tos_accepted') === 'true';

    keyAuthModal.innerHTML = `
        ${controlButtons}
        ${logoIcon}
        <h2 style="color: white; text-align: center; margin: 0 0 25px; font-size: 24px; font-weight: 600;">FrameX</h2>

        <div id="tos-notice" style="
            background: ${tosAccepted ? 'rgba(76, 175, 80, 0.15)' : 'rgba(108, 99, 255, 0.15)'};
            border: 1px solid ${tosAccepted ? 'rgba(76, 175, 80, 0.3)' : 'rgba(108, 99, 255, 0.3)'};
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 15px;
            text-align: center;
            font-size: 13px;
            color: white;
            ${tosAccepted ? 'display: none;' : ''}
        ">
            ${tosAccepted ? '<span style="color: #4CAF50;">✓</span> Terms of Service accepted' : 'Please read and accept our Terms of Service before continuing'}
        </div>

        <input type="text" class="license-key-input" id="license-key-main" placeholder="Enter license key" style="
            width: 100%;
            padding: 12px 15px;
            margin: 8px 0 15px;
            border: none;
            background: rgba(255, 255, 255, 0.07);
            color: #fff;
            border-radius: 6px;
            font-family: inherit;
            font-size: 14px;
            transition: all 0.2s ease;
            outline: none;
            box-sizing: border-box;
            opacity: ${tosAccepted ? '1' : '0.5'};
        " ${tosAccepted ? '' : 'disabled'}>

        <button id="activate-license" style="
            width: 100%;
            padding: 12px;
            margin: 0 0 5px;
            border: none;
            border-radius: 6px;
            cursor: ${tosAccepted ? 'pointer' : 'not-allowed'};
            background: transparent;
            color: ${tosAccepted ? '#ff0000' : 'rgba(255, 255, 255, 0.7)'};
            font-family: inherit;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            box-sizing: border-box;
        " ${tosAccepted ? '' : 'disabled'}>Activate</button>

        <div id="license-status" style="
            margin: 5px 0 25px;
            text-align: center;
            color: white;
            font-size: 13px;
            min-height: 20px;
        "></div>

        <div id="error-copy-container" style="display: none; margin-top: 10px;">
            <button id="copy-error-id" style="
                padding: 8px 12px;
                margin: 10px auto;
                border: none;
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                cursor: pointer;
                font-size: 12px;
                width: 100%;
                display: none;
            ">Copy Error ID</button>
        </div>

        <div style="
            position: absolute;
            bottom: 10px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            padding: 0 10px;
            gap: 20px;
            align-items: center;
        ">
            <button id="tos-button" class="${tosAccepted ? '' : 'pulse-button'}" style="
                background: transparent;
                color: #ff0000;
                border: none;
                border-radius: 6px;
                padding: 8px 16px;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s ease;
            ">
                ${tosAccepted ? 'Terms of Service' : 'Read & Accept Terms of Service'}
            </button>

            <a href="https://discord.gg/SGSVjDcSA6" target="_blank" style="
                color: #7289DA;
                text-decoration: none;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 5px;
            ">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#7289DA">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Join Discord
            </a>
        </div>
    `;

    document.body.appendChild(keyAuthModal);

    // Create login minimized pill
    const loginPill = document.createElement('div');
    loginPill.id = 'login-pill';
    loginPill.style.cssText = `
        position: fixed;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(108, 99, 255, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 30px;
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 14px;
        z-index: 999999;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        display: none;
        opacity: 0;
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.2s ease;
    `;
    loginPill.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Activate License
        </div>
    `;
    document.body.appendChild(loginPill);

    // Create ultra-minimalistic timer display
    const timerDisplay = document.createElement('div');
    timerDisplay.id = 'timer-display';
    timerDisplay.style.cssText = `
        position: fixed;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        background-color: rgba(20, 20, 28, 0.7);
        color: white;
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 13px;
        padding: 6px 10px;
        border-radius: 4px;
        z-index: 9999;
        display: none;
        border: 1px solid rgba(108, 99, 255, 0.3);
        backdrop-filter: blur(4px);
        transition: background-color 0.3s ease;
        user-select: none;
    `;
    document.body.appendChild(timerDisplay);

    // Create welcome notification
    const welcomeNotification = document.createElement('div');
    welcomeNotification.id = 'welcome-notification';
    welcomeNotification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: rgba(108, 99, 255, 0.9);
        color: white;
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 14px;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        text-align: center;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        display: flex;
        align-items: center;
        gap: 10px;
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;

    // SVG for welcome icon
    const welcomeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 1 10 0v4"></path></svg>`;

    welcomeNotification.innerHTML = `
        ${welcomeIcon}
        <div>
            <div style="font-weight: 600;">Welcome back!</div>
            <div style="font-size: 12px; opacity: 0.9;">Authentication successful</div>
        </div>
    `;
    document.body.appendChild(welcomeNotification);

    // Add event listeners

    // Function to minimize the login modal
    function minimizeLogin() {
        isLoginMinimized = true;
        keyAuthModal.style.transform = 'translate(-50%, -50%) scale(0.8)';
        keyAuthModal.style.opacity = '0';
        setTimeout(() => {
            keyAuthModal.style.display = 'none';
            showLoginPill();
        }, 300);
    }

    // Function to show the login pill
    function showLoginPill() {
        loginPill.style.display = 'block';
        loginOpenerVisible = true;
        setTimeout(() => {
            loginPill.style.opacity = '1';
        }, 10);
    }

    // Function to restore the login modal
    function restoreLogin() {
        isLoginMinimized = false;
        loginPill.style.opacity = '0';
        setTimeout(() => {
            loginPill.style.display = 'none';
            loginOpenerVisible = false;
            keyAuthModal.style.display = 'block';
            setTimeout(() => {
                keyAuthModal.style.transform = 'translate(-50%, -50%) scale(1)';
                keyAuthModal.style.opacity = '1';
            }, 10);
        }, 300);
    }

    // Add timer click event for logout
    timerDisplay.addEventListener('click', (e) => {
        // Don't allow clicks while blinking (emergency mode)
        if (timerDisplay.classList.contains('blink')) return;

        timerDisplay.style.backgroundColor = 'rgba(255, 77, 77, 0.7)';
        timerDisplay.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> Logout';

        setTimeout(() => {
            handleLogout();
        }, 800);
    });

    // Add tooltip to timer
    timerDisplay.title = "Click to logout";

    // Add event listeners for minimize and restore
    document.getElementById('minimize-login').addEventListener('click', (e) => {
        e.stopPropagation();
        minimizeLogin();
    });

    loginPill.addEventListener('click', restoreLogin);

    // Make keyAuthModal draggable
    let dragStartX, dragStartY, initialX, initialY;
    let isDragging = false;

    keyAuthModal.addEventListener('mousedown', (e) => {
        // Only allow dragging from the header area
        const rect = keyAuthModal.getBoundingClientRect();
        const isClickingHeader = e.clientY - rect.top < 60; // First 60px is header

        // Don't start dragging if clicking on inputs or buttons
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || !isClickingHeader) {
            return;
        }

        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;

        // Get current position from transform
        const transform = window.getComputedStyle(keyAuthModal).getPropertyValue('transform');
        const matrix = new DOMMatrix(transform);
        initialX = matrix.m41;
        initialY = matrix.m42;

        keyAuthModal.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;

        // Calculate new position
        const newX = initialX + dx;
        const newY = initialY + dy;

        // Apply new position
        keyAuthModal.style.transform = `translate(${newX}px, ${newY}px)`;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            keyAuthModal.style.cursor = 'auto';
        }
    });

    // Handle double-click on header to reset position
    keyAuthModal.addEventListener('dblclick', (e) => {
        const rect = keyAuthModal.getBoundingClientRect();
        const isClickingHeader = e.clientY - rect.top < 60; // First 60px is header

        if (isClickingHeader) {
            keyAuthModal.style.transform = 'translate(-50%, -50%)';
        }
    });

    // Add ToS button functionality
    document.getElementById('tos-button').addEventListener('click', function() {
        showTosDialog();
    });

    // Add license activation functionality
    document.getElementById('activate-license').addEventListener('click', async () => {
        const licenseKey = document.getElementById('license-key-main').value;
        const status = document.getElementById('license-status');
        const button = document.getElementById('activate-license');

        if (!licenseKey) {
            status.style.color = '#ff4d4d';
            status.textContent = 'Please enter a license key';
            return;
        }

        button.disabled = true;
        button.textContent = 'Activating...';
        status.textContent = '';

        try {
            // Make sure KeyAuth is initialized before continuing
            if (unsafeWindow.keyAuthApp && !unsafeWindow.keyAuthApp.initialized) {
                try {
                    console.log('Initializing KeyAuth during license activation...');
                    await unsafeWindow.keyAuthApp.Initialize();
                    keyAuthInitialized = true;
                    console.log('KeyAuth initialized successfully');
                } catch (initError) {
                    console.error('KeyAuth initialization failed:', initError);
                }
            }

            // Validate the license key format
            if (!isValidLicenseKey(licenseKey)) {
                throw new Error('Invalid license key format');
            }

            // Create loading screen to show verification process
            const loadingOverlay = showLoadingScreen();
            updateLoadingProgress(15, 'Verifying license key...', 'License Verification');

            // Make the actual verification request
            let verificationResult;
            try {
                updateLoadingProgress(15, 'Verifying license key...', 'License Verification');
                verificationResult = await verifyLicenseKey(licenseKey);

                if (!verificationResult.success) {
                    // Safe removal of the overlay
                    if (document.body.contains(loadingOverlay)) {
                        document.body.removeChild(loadingOverlay);
                    }
                    throw new Error(verificationResult.message || 'Invalid license key');
                }

                updateLoadingProgress(40, 'License verified successfully...', 'License Verification');

                // Explicitly set authentication state
                isAuthenticated = true;
                powerStatsEnabled = true;
                multiDropEnabled = true;

                            console.log('Authentication state after verification:', isAuthenticated);

            } catch (verifyError) {
                // Safe removal of the overlay
                if (document.body.contains(loadingOverlay)) {
                    document.body.removeChild(loadingOverlay);
                }
                throw verifyError;
            }

            // If verification successful, continue with the loading sequence
            const currentTime = Math.floor(Date.now() / 1000);
            const subscription = {
                key: licenseKey,
                hwid: unsafeWindow.keyAuthApp.GetCurrentHardwareId(),
                expiry: currentTime + verificationResult.duration,
                lastVerified: currentTime,
                username: verificationResult.username || 'User',
                subscription: verificationResult.subscription || 'Standard'
            };
            localStorage.setItem('keyauth_subscription', JSON.stringify(subscription));

            if (status) {
                status.style.color = '#4CAF50';
                status.textContent = 'License activated!';
            }

            // Run the loading sequence
            await runLoadingSequence(loadingOverlay);

            // Explicitly initialize features
            createPowerCounterAndKeybinds();
            setupMultiPowerKeyBinds();

            // After loading is complete, show the timer display
            showTimerDisplay(subscription);

            // Show welcome notification
            showWelcomeNotification(false);

            // Initialize player tracker and gold tracker
            createGoldStatsTracker();
            if (typeof createPlayerTracker === 'function') {
                window.playerTracker = createPlayerTracker();
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Invalid license key';
            if (status) {
                status.style.color = '#ff4d4d';
                status.textContent = errorMessage;
            }
            button.disabled = false;
            button.textContent = 'Activate';

            // Ensure authentication state is false on error
            isAuthenticated = false;
        }
    });

    // Find the license key input and add event listeners to trim spaces
    const licenseInput = document.getElementById('license-key-main');
    if (licenseInput) {
        // Remove spaces when text is pasted
        licenseInput.addEventListener('paste', function(e) {
            // Wait for the pasted content to be inserted
            setTimeout(() => {
                // Remove all spaces from the input value
                this.value = this.value.replace(/\s+/g, '');
            }, 0);
        });

        // Remove spaces when text is input (typing or other methods)
        licenseInput.addEventListener('input', function() {
            // Remove all spaces from the input value
            this.value = this.value.replace(/\s+/g, '');
        });
    }

    // Add a small "Check for Updates" link at the bottom of modal
    const bottomLinks = keyAuthModal.querySelector('[style*="bottom: 10px"]');
    if (bottomLinks) {
        const updateCheckLink = document.createElement('a');
        updateCheckLink.textContent = 'Check for Updates';
        updateCheckLink.href = '#';
        updateCheckLink.style.cssText = `
            color: rgba(255, 255, 255, 0.6);
            font-size: 12px;
            text-decoration: none;
            cursor: pointer;
            margin-left: 20px;
        `;

        updateCheckLink.addEventListener('click', (e) => {
            e.preventDefault();
            checkForUpdates(true); // Force check

            // Provide feedback
            updateCheckLink.textContent = 'Checking...';
            updateCheckLink.style.color = '#6c63ff';

            setTimeout(() => {
                updateCheckLink.textContent = 'Check for Updates';
                updateCheckLink.style.color = 'rgba(255, 255, 255, 0.6)';
            }, 2000);
        });

        bottomLinks.appendChild(updateCheckLink);
    }
}

    // Show TOS dialog
    function showTosDialog() {
        const tosDialog = document.createElement('div');
        tosDialog.id = 'direct-tos-modal';
        tosDialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            z-index: 1000000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const tosContent = document.createElement('div');
        tosContent.style.cssText = `
            background: rgba(20, 20, 28, 0.97);
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            border-radius: 12px;
            padding: 25px;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            font-family: 'Segoe UI', Arial, sans-serif;
            color: white;
            position: relative;
        `;

        tosContent.innerHTML = `
            <h2 style="text-align: center; margin-top: 0; color: #6c63ff; font-size: 24px;">Terms of Service</h2>
            <div style="position: absolute; top: 15px; right: 20px; cursor: pointer; font-size: 24px; color: rgba(255,255,255,0.6);" id="direct-close-tos">×</div>

            <p style="margin-top: 20px;">Last Updated: ${new Date().toLocaleDateString()}</p>

            <p>Please read these Terms of Service ("Terms", "Agreement") carefully before using this software and any associated services ("Software"). By using the Software, you agree to be bound by these Terms.</p>

            <h3 style="color: #6c63ff; margin-top: 20px;">1. License & Usage</h3>
            <p>1.1. <strong>License Grant:</strong> Subject to your compliance with these Terms, you are granted a limited, non-exclusive, non-transferable, revocable license to use the Software for personal, non-commercial purposes.</p>
            <p>1.2. <strong>Hardware Binding:</strong> Each license key is bound to specific hardware. Changing significant hardware components may require reactivation.</p>
            <p>1.3. <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your license key and for all activities that occur under your account.</p>

            <h3 style="color: #6c63ff; margin-top: 20px;">2. Prohibited Activities</h3>
            <p>You agree not to engage in any of the following prohibited activities:</p>
            <ul style="padding-left: 20px; margin-top: 10px;">
                <li>Distribute, sell, lease, rent, share, or transfer the Software or your license key</li>
                <li>Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code of the Software</li>
                <li>Remove, alter, or obscure any proprietary notices on the Software</li>
                <li>Use the Software for any illegal purpose or in violation of any local, state, national, or international law</li>
                <li>Use the Software to harass, abuse, or harm another person or group</li>
                <li>Attempt to gain unauthorized access to the Software or circumvent any protection mechanisms</li>
                <li>Create or distribute tools designed to hack or bypass the Software's licensing or authentication systems</li>
            </ul>

            <div style="text-align: center; margin-top: 30px; margin-bottom: 10px; display: flex; flex-direction: column; align-items: center; gap: 15px;">
                <div style="color: rgba(255, 255, 255, 0.7); font-size: 13px; max-width: 400px; margin: 0 auto;">
                    By clicking "I Accept These Terms", you confirm that you have read, understood, and agree to be bound by these Terms of Service.
                </div>
                <button id="direct-accept-tos" style="
                    padding: 12px 30px;
                    background: transparent;
                    border: none;
                    color: #ff0000;
                    cursor: pointer;
                    font-family: inherit;
                    font-size: 16px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    min-width: 250px;
                ">I Accept These Terms</button>
            </div>
        `;

        tosDialog.appendChild(tosContent);
        document.body.appendChild(tosDialog);

        // Add close functionality
        document.getElementById('direct-close-tos').onclick = function() {
            document.body.removeChild(tosDialog);
        };

        // Add accept functionality
        document.getElementById('direct-accept-tos').onclick = function() {
            // Visual feedback
            this.textContent = 'Terms Accepted ✓';
            this.style.color = '#4CAF50';

            // Store acceptance
            localStorage.setItem('tos_accepted', 'true');
            localStorage.setItem('tos_accepted_date', new Date().toISOString());

            // Enable activation
            enableActivation();

            // Close modal after a delay
            setTimeout(function() {
                document.body.removeChild(tosDialog);

                // Show confirmation in the status
                const status = document.getElementById('license-status');
                if (status) {
                    status.textContent = 'Terms accepted. You can now activate your license.';
                    status.style.color = '#4CAF50';
                }
            }, 1500);
        };

        // Close on outside click
        tosDialog.addEventListener('click', (e) => {
            if (e.target === tosDialog && document.body.contains(tosDialog)) {
                document.body.removeChild(tosDialog);
            }
        });
    }

    // Function for enabling activation after TOS acceptance
    function enableActivation() {
        try {
            const licenseInput = document.getElementById('license-key-main');
            if (licenseInput) {
                licenseInput.disabled = false;
                licenseInput.style.opacity = '1';
                licenseInput.placeholder = 'Enter license key';
            }

            const activateButton = document.getElementById('activate-license');
            if (activateButton) {
                activateButton.disabled = false;
                activateButton.style.cursor = 'pointer';
                activateButton.style.opacity = '1';
                activateButton.style.background = 'transparent';
                activateButton.style.color = '#ff0000';
                activateButton.style.border = 'none';
                activateButton.onmouseover = function() {
                    this.style.transform = 'scale(1.1)';
                    this.style.color = '#ff4d4d';
                };
                activateButton.onmouseout = function() {
                    this.style.transform = 'scale(1)';
                    this.style.color = '#ff0000';
                };
            }

            // Update TOS notice
            const tosNotice = document.getElementById('tos-notice');
            if (tosNotice) {
                tosNotice.style.background = 'rgba(76, 175, 80, 0.15)';
                tosNotice.style.border = '1px solid rgba(76, 175, 80, 0.3)';
                tosNotice.innerHTML = '<span style="color: #4CAF50;">✓</span> Terms of Service accepted';

                // Fade out the notice after a few seconds
                setTimeout(() => {
                    tosNotice.style.transition = 'opacity 1s ease';
                    tosNotice.style.opacity = '0';
                    setTimeout(() => {
                        tosNotice.style.display = 'none';
                    }, 1000);
                }, 3000);
            }

            // Update TOS button
            const tosButton = document.getElementById('tos-button');
            if (tosButton) {
                tosButton.classList.remove('pulse-button');
                tosButton.style.animation = 'none';
                tosButton.textContent = 'Terms of Service';
                tosButton.style.background = 'transparent';
                tosButton.style.border = 'none';
                tosButton.style.color = '#ff0000';
                tosButton.style.transition = 'all 0.3s ease';
                tosButton.onmouseover = function() {
                    this.style.transform = 'scale(1.1)';
                    this.style.color = '#ff4d4d';
                };
                tosButton.onmouseout = function() {
                    this.style.transform = 'scale(1)';
                    this.style.color = '#ff0000';
                };
            }
        } catch (error) {
            console.error('Error in enableActivation:', error);
        }
    }
        // Function to track power usage and show UI
    function createPowerCounterAndKeybinds() {
        // Check if user is authenticated
        if (!isAuthenticated) {
            console.log("User not authenticated. Power counter and keybinds disabled.");
            return;
        }

        // Check if elements already exist and remove them
        const existingElements = ['power-counter', 'power-counter-tab', 'multi-keybind-panel'];
        existingElements.forEach(id => {
            const elem = document.getElementById(id);
            if (elem) elem.remove();
        });

        // Create a tab with icons for both features
        const tabElement = document.createElement('div');
        tabElement.id = 'power-counter-tab';
        tabElement.style.cssText = `
            position: fixed;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(30, 30, 40, 0.85);
            color: white;
            width: 36px;
            border-radius: 6px 0 0 6px;
            z-index: 9999;
            cursor: pointer;
            font-family: 'Segoe UI', Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: -2px 0 5px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            user-select: none;
            border-left: 2px solid rgba(108, 99, 255, 0.6);
            padding: 8px 0;
        `;

        // Add two icons - one for power stats, one for keybinds
        tabElement.innerHTML = `
            <div id="power-stats-icon" style="padding: 8px 0; opacity: 0.8; transition: all 0.2s ease; cursor: pointer;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(108, 99, 255, 0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
            </div>
            <div style="width: 20px; height: 1px; background: rgba(255,255,255,0.2); margin: 4px 0;"></div>
            <div id="keybinds-icon" style="padding: 8px 0; opacity: 0.8; transition: all 0.2s ease; cursor: pointer;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(108, 99, 255, 0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                </svg>
            </div>
        `;
        document.body.appendChild(tabElement);

        // Create the power counter panel
        let powerCounter = document.createElement('div');
        powerCounter.id = 'power-counter';
        powerCounter.style.cssText = `
            position: fixed;
            right: -280px;
            top: 30%;
            transform: translateY(-50%);
            background: rgba(30, 30, 40, 0.95);
            color: white;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            padding: 15px;
            border-radius: 6px 0 0 6px;
            z-index: 9998;
            border: 1px solid rgba(108, 99, 255, 0.4);
            border-right: none;
            backdrop-filter: blur(4px);
            transition: right 0.3s ease;
            user-select: none;
            width: 260px;
            box-shadow: -3px 0 10px rgba(0,0,0,0.5);
        `;

        powerCounter.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div style="font-weight: bold; color: #6c63ff; font-size: 16px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 6px;">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                    </svg>
                    Power Stats
                </div>
                <span id="power-counter-close" style="cursor: pointer; padding: 2px 6px; border-radius: 3px; background: rgba(255,255,255,0.1);">×</span>
            </div>
            <div style="margin-bottom: 8px; font-size: 14px;">Total powers: <span id="total-powers-count">0</span></div>
            <div id="power-counter-details">
                <div style="margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
                    <div style="margin-bottom: 5px; font-weight: bold;">Powers Used:</div>
                    <div id="power-details-list" style="max-height: 300px; overflow-y: auto;"></div>
                    <div style="margin-top: 8px; font-size: 12px; color: rgba(255,255,255,0.7);">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Session: <span id="session-time">00:00:00</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(powerCounter);

        // Create the multi-keybinds panel
        let keybindPanel = document.createElement('div');
        keybindPanel.id = 'multi-keybind-panel';
        keybindPanel.style.cssText = `
            position: fixed;
            right: -320px;
            top: 70%;
            transform: translateY(-50%);
            background: rgba(30, 30, 40, 0.95);
            color: white;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 12px;
            padding: 15px;
            border-radius: 6px 0 0 6px;
            z-index: 9997;
            border: 1px solid rgba(108, 99, 255, 0.4);
            border-right: none;
            backdrop-filter: blur(4px);
            transition: right 0.3s ease;
            user-select: none;
            width: 300px;
            box-shadow: -3px 0 10px rgba(0,0,0,0.5);
            max-height: 70vh;
            overflow-y: auto;
        `;

        keybindPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div style="font-weight: bold; color: #6c63ff; font-size: 14px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 6px;">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                    </svg>
                    Multi-Power Keybinds
                </div>
                <span id="keybind-panel-close" style="cursor: pointer; padding: 2px 6px; border-radius: 3px; background: rgba(255,255,255,0.1);">×</span>
            </div>

            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <label for="cMultiDrop" style="margin-right: 10px; font-size: 12px;">Enable Multi-Drop:</label>
                <label class="toggle-switch">
                    <input type="checkbox" id="cMultiDrop">
                    <span class="toggle-slider"></span>
                </label>
            </div>

            <div style="margin-top: 10px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                    <div style="font-weight: bold; color: #6c63ff; font-size: 12px;">Standard Powers</div>
                </div>
                <div id="standard-powers-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 10px;">
                    <!-- Standard powers will be inserted here -->
                </div>

                <div style="font-weight: bold; color: #6c63ff; margin-top: 10px; margin-bottom: 6px; font-size: 12px;">Combo Powers</div>
                <div id="combo-powers-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 10px;">
                    <!-- Combo powers will be inserted here -->
                </div>

                <div style="margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
                    <div style="font-weight: bold; margin-bottom: 6px; font-size: 12px;">Multi-Pellet Amount:</div>
                    <div style="display: flex; align-items: center;">
                        <input id="customMultiPelletsAmount" type="range" min="1" max="30" step="1" value="15" style="flex: 1; height: 6px; outline: none;">
                        <span id="customMultiPelletsAmountValue" style="margin-left: 8px; color: #6c63ff; font-weight: bold; min-width: 20px;">15</span>
                    </div>
                </div>

                <div style="margin-top: 10px;">
                    <div style="font-weight: bold; margin-bottom: 6px; font-size: 12px;">Break Shield Options:</div>
                    <div style="display: flex; gap: 10px;">
                        <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px;">
                            <input id="brMulVirus" name="break" type="radio" style="margin-right: 3px;">
                            <span>With Virus</span>
                        </label>
                        <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px;">
                            <input id="brMulMtcl" name="break" type="radio" style="margin-right: 3px;" checked>
                            <span>With Mothercell</span>
                        </label>
                    </div>
                </div>
            </div>

            <div style="margin-top: 10px; font-size: 10px; color: rgba(255,255,255,0.6); text-align: center;">
                Click a keybind to set it. Right-click to remove.
            </div>
        `;

        document.body.appendChild(keybindPanel);

        // Add CSS for toggle switch and keybind buttons
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            /* Basic styling for icons */
            #power-stats-icon, #keybinds-icon {
                transition: all 0.2s ease;
                cursor: pointer;
            }

            /* Toggle switch styling */
            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 40px;
                height: 20px;
            }

            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(255, 255, 255, 0.2);
                transition: .3s;
                border-radius: 20px;
            }

            .toggle-slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                transition: .3s;
                border-radius: 50%;
            }

            input:checked + .toggle-slider {
                background-color: #6c63ff;
            }

            input:checked + .toggle-slider:before {
                transform: translateX(20px);
            }

            /* Keybind button styling */
            .keybind-button {
                background: rgba(60, 60, 70, 0.6);
                border: 1px solid rgba(108, 99, 255, 0.3);
                border-radius: 4px;
                padding: 5px 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-height: 26px;
            }

            .keybind-name {
                font-size: 11px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .keybind-key {
                background: rgba(108, 99, 255, 0.2);
                padding: 2px 4px;
                border-radius: 3px;
                font-size: 10px;
                font-weight: bold;
                color: #6c63ff;
                min-width: 16px;
                text-align: center;
                margin-left: 5px;
            }

            /* Range slider styling */
            input[type="range"] {
                -webkit-appearance: none;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 5px;
                height: 5px;
                outline: none;
            }

            input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background: #6c63ff;
                cursor: pointer;
            }

            input[type="range"]::-moz-range-thumb {
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background: #6c63ff;
                cursor: pointer;
                border: none;
            }

            /* Active icon styling */
            .active-icon {
                background: rgba(108, 99, 255, 0.3) !important;
                box-shadow: 0 0 5px rgba(108, 99, 255, 0.5);
            }

            /* Close button hover effect */
            #power-counter-close:hover, #keybind-panel-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
        `;
        document.head.appendChild(styleElement);

        // Track which panel is currently open
        let powerPanelOpen = false;
        let keybindPanelOpen = false;

        // Click on power stats icon
        const powerStatsIcon = document.getElementById('power-stats-icon');
        if (powerStatsIcon) {
            powerStatsIcon.addEventListener('click', function() {
                if (powerPanelOpen) {
                    // Close the panel
                    powerCounter.style.right = '-280px';
                    this.classList.remove('active-icon');
                    powerPanelOpen = false;
                } else {
                    // Open power panel, close keybind panel if open
                    powerCounter.style.right = '0';
                    keybindPanel.style.right = '-320px';
                    this.classList.add('active-icon');
                    document.getElementById('keybinds-icon')?.classList.remove('active-icon');
                    powerPanelOpen = true;
                    keybindPanelOpen = false;

                    // Update the power details
                    updatePowerDetailsList(true);
                }
            });
        }

        // Click on keybinds icon
        const keybindsIcon = document.getElementById('keybinds-icon');
        if (keybindsIcon) {
            keybindsIcon.addEventListener('click', function() {
                if (keybindPanelOpen) {
                    // Close the panel
                    keybindPanel.style.right = '-320px';
                    this.classList.remove('active-icon');
                    keybindPanelOpen = false;
                } else {
                    // Open keybind panel, close power panel if open
                    keybindPanel.style.right = '0';
                    powerCounter.style.right = '-280px';
                    this.classList.add('active-icon');
                    document.getElementById('power-stats-icon')?.classList.remove('active-icon');
                    keybindPanelOpen = true;
                    powerPanelOpen = false;
                }
            });
        }

        // Close buttons for both panels
        const closePowerCounter = document.getElementById('power-counter-close');
        if (closePowerCounter) {
            closePowerCounter.addEventListener('click', function() {
                powerCounter.style.right = '-280px';
                document.getElementById('power-stats-icon')?.classList.remove('active-icon');
                powerPanelOpen = false;
            });
        }

        const closeKeybindPanel = document.getElementById('keybind-panel-close');
        if (closeKeybindPanel) {
            closeKeybindPanel.addEventListener('click', function() {
                keybindPanel.style.right = '-320px';
                document.getElementById('keybinds-icon')?.classList.remove('active-icon');
                keybindPanelOpen = false;
            });
        }

        // Setup the toggle and slider controls
        const multiDropToggle = document.getElementById('cMultiDrop');
        if (multiDropToggle) {
            // Load saved toggle state
            const savedState = localStorage.getItem('multiDrop') === 'true';
            multiDropToggle.checked = savedState;

            // Add change handler
            multiDropToggle.addEventListener('change', function() {
                localStorage.setItem('multiDrop', this.checked);
                showGameMessage('Multi-Drop ' + (this.checked ? 'enabled' : 'disabled'), this.checked ? 'green' : 'red');
            });
        }

        // Setup the pellet amount slider
        const pelletSlider = document.getElementById('customMultiPelletsAmount');
        if (pelletSlider) {
            // Load saved value
            const savedAmount = localStorage.getItem('multiPelletAmount');
            if (savedAmount) {
                pelletSlider.value = savedAmount;
                document.getElementById('customMultiPelletsAmountValue').textContent = savedAmount;
            }

            // Add change handler
            pelletSlider.addEventListener('input', function() {
                document.getElementById('customMultiPelletsAmountValue').textContent = this.value;
                localStorage.setItem('multiPelletAmount', this.value);
            });
        }
                // Setup the break shield options
        const virusRadio = document.getElementById('brMulVirus');
        const mothercellRadio = document.getElementById('brMulMtcl');

        if (virusRadio && mothercellRadio) {
            // Load saved option
            const savedOption = localStorage.getItem('breakShieldOption');
            if (savedOption === 'virus') {
                virusRadio.checked = true;
                mothercellRadio.checked = false;
            } else {
                virusRadio.checked = false;
                mothercellRadio.checked = true;
            }

            // Add change handlers
            virusRadio.addEventListener('change', function() {
                if (this.checked) {
                    localStorage.setItem('breakShieldOption', 'virus');
                }
            });

            mothercellRadio.addEventListener('change', function() {
                if (this.checked) {
                    localStorage.setItem('breakShieldOption', 'mothercell');
                }
            });
        }

        // Populate the keybind grid
        populateKeybindGrid();

        // Start the session timer
        setInterval(updateSessionTime, 1000);

        // Update power stats immediately
        updatePowerCounterDisplay();

        // Add show off button
        addPowerShowOffButton();

        console.log("Power counter and keybinds interface created");
    }

    // Function to update the power counter display
    function updatePowerCounterDisplay() {
        const totalPowersCount = document.getElementById('total-powers-count');

        if (totalPowersCount) {
            totalPowersCount.textContent = unsafeWindow.powerStats.total || 0;
        }

        // Update the power details list
        updatePowerDetailsList();
    }

    // Function to update the detailed power stats
    function updatePowerDetailsList(forceUpdate = false) {
        const detailsList = document.getElementById('power-details-list');
        if (!detailsList) return;

        // Only update if force update is requested
        if (!forceUpdate) return;

        // Clear the current list
        detailsList.innerHTML = '';

        // Get sorted power usage - most recent first, then by count
        const sortedPowers = Object.entries(unsafeWindow.powerStats.individual || {})
            .sort((a, b) => b[1] - a[1]); // Sort by count, descending

        if (sortedPowers.length === 0) {
            detailsList.innerHTML = '<div style="color: rgba(255,255,255,0.6);">No powers used yet</div>';
            return;
        }

        // Create a table for powers
        const table = document.createElement('table');
        table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        `;

        // Table header
        const header = document.createElement('tr');
        header.innerHTML = `
            <th style="text-align: left; padding: 4px; color: #6c63ff;">Power</th>
            <th style="text-align: center; padding: 4px; color: #6c63ff;">Count</th>
            <th style="text-align: right; padding: 4px; color: #6c63ff;">Last Used</th>
        `;
        table.appendChild(header);

        // Add each power with its count and last used time
        for (const [power, count] of sortedPowers) {
            const powerNum = parseInt(power);
            const powerName = getPowerName(powerNum);

            // Get last used time for this power from history if available
            let lastUsedTime = '';
            if (unsafeWindow.powerStats.powerHistory && unsafeWindow.powerStats.powerHistory[powerNum]) {
                const lastUsed = unsafeWindow.powerStats.powerHistory[powerNum];
                // Show only time portion of timestamp
                lastUsedTime = new Date(lastUsed).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            }

            const row = document.createElement('tr');
            row.style.cssText = `border-bottom: 1px solid rgba(255,255,255,0.05);`;
            row.innerHTML = `
                <td style="padding: 4px; text-align: left;">${powerName} (${power})</td>
                <td style="padding: 4px; text-align: center;">${count}</td>
                <td style="padding: 4px; text-align: right; color: rgba(255,255,255,0.7);">${lastUsedTime}</td>
            `;
            table.appendChild(row);
        }

        detailsList.appendChild(table);
    }

    // Function to update the session time
    function updateSessionTime() {
        const sessionTimeElement = document.getElementById('session-time');
        if (!sessionTimeElement) return;

        const elapsedSeconds = Math.floor((Date.now() - (unsafeWindow.powerStats.startTime || Date.now())) / 1000);
        const hours = Math.floor(elapsedSeconds / 3600);
        const minutes = Math.floor((elapsedSeconds % 3600) / 60);
        const seconds = elapsedSeconds % 60;

        sessionTimeElement.textContent =
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Helper function to get power names
    function getPowerName(powerNumber) {
        const powerNames = {
            1: "Rec",
            2: "Speed",
            3: "Growth",
            4: "Virus",
            5: "Mothercell",
            6: "Portal",
            8: "Freeze",
            9: "Block",
            11: "Anti-Freeze",
            12: "Anti-Rec",
            14: "Shield"
        };

        return powerNames[powerNumber] || `Power ${powerNumber}`;
    }

    // Populate keybind grid
    function populateKeybindGrid() {
        const standardPowersGrid = document.getElementById('standard-powers-grid');
        const comboPowersGrid = document.getElementById('combo-powers-grid');

        if (!standardPowersGrid || !comboPowersGrid) return;

        // Clear existing grids
        standardPowersGrid.innerHTML = '';
        comboPowersGrid.innerHTML = '';

        // Load saved keybinds
        const keybinds = JSON.parse(localStorage.getItem('Multikey') || '{}');

        // Standard powers
        const standardPowers = [
            { id: 'mRec', name: 'Rec (1)' },
            { id: 'mSpeed', name: 'Speed (2)' },
            { id: 'mGrowth', name: 'Growth (3)' },
            { id: 'mVirus', name: 'Virus (4)' },
            { id: 'mMothercell', name: 'Mothercell (5)' },
            { id: 'mPortal', name: 'Portal (6)' },
            { id: 'mFreeze', name: 'Freeze (8)' },
            { id: 'mBlock', name: 'Block (9)' },
            { id: 'mAntiFreeze', name: 'Anti-Freeze (11)' },
            { id: 'mAntiRec', name: 'Anti-Rec (12)' },
            { id: 'mShield', name: 'Shield (14)' }
        ];

        // Combo powers
        const comboPowers = [
            { id: 'mRecSpeed', name: 'Rec+Speed (×9)' },
            { id: 'mShieldAntifreeze', name: 'Shield+Anti-Freeze' },
            { id: 'mMultiPellets', name: 'Multi Pellets' },
            { id: 'mMultiVirus', name: 'Multi Virus' },
            { id: 'mMultiMothercell', name: 'Multi Mothercell' },
            { id: 'mBreakShield', name: 'Break Shield' }
        ];

        // Add buttons for standard powers
        standardPowers.forEach(power => {
            const button = createKeybindButton(power.id, power.name, keybinds[power.id]?.keyChar);
            standardPowersGrid.appendChild(button);
        });

        // Add buttons for combo powers
        comboPowers.forEach(power => {
            const button = createKeybindButton(power.id, power.name, keybinds[power.id]?.keyChar);
            comboPowersGrid.appendChild(button);
        });
    }

    // Create keybind button
    function createKeybindButton(id, name, keyChar) {
        const button = document.createElement('div');
        button.className = 'keybind-button';
        button.dataset.id = id; // Store the ID in the button element

        button.innerHTML = `
            <span class="keybind-name">${name}</span>
            <span class="keybind-key">${keyChar || '—'}</span>
        `;

        // Set up click handler
        button.addEventListener('click', function(e) {
            e.preventDefault();
            promptKeyBind(id, name);
        });

        // Right-click to remove binding
        button.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            removeKeyBind(id);
            button.querySelector('.keybind-key').textContent = '—';
        });

        return button;
    }

    // Prompt for key binding
    function promptKeyBind(id, name) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
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

        const prompt = document.createElement('div');
        prompt.style.cssText = `
            background: rgba(30, 30, 40, 0.95);
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            color: white;
            font-family: 'Segoe UI', Arial, sans-serif;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            max-width: 300px;
        `;

        prompt.innerHTML = `
            <h3 style="margin-top: 0;">Set Key for ${name}</h3>
            <p>Press any key to bind it to "${name}".</p>
            <p style="font-size: 12px; color: rgba(255, 255, 255, 0.6);">Press Escape to cancel.</p>
            <div style="margin-top: 15px; font-size: 28px; color: #6c63ff; height: 40px;" id="pressed-key"></div>
        `;

        overlay.appendChild(prompt);
        document.body.appendChild(overlay);

        // Listen for key press
        const keyHandler = function(e) {
            e.preventDefault();

            // Cancel on Escape
            if (e.key === 'Escape') {
                document.removeEventListener('keydown', keyHandler);
                document.body.removeChild(overlay);
                return;
            }

            // Get key representation
            const keyChar = formatKeyName(e.key);
            document.getElementById('pressed-key').textContent = keyChar;

            // Save the keybind
            saveKeyBind(id, keyChar, e.keyCode);

            // Update the button
            const button = getKeybindButtonById(id);
            if (button) {
                button.querySelector('.keybind-key').textContent = keyChar;
            }

            // Remove the overlay after a short delay
            setTimeout(() => {
                document.removeEventListener('keydown', keyHandler);
                document.body.removeChild(overlay);
            }, 500);
        };

        document.addEventListener('keydown', keyHandler);
    }

    // Save keybind to localStorage
    function saveKeyBind(id, keyChar, keyCode) {
        const keybinds = JSON.parse(localStorage.getItem('Multikey') || '{}');

        keybinds[id] = {
            keyChar: keyChar,
            keyCode: keyCode
        };

        localStorage.setItem('Multikey', JSON.stringify(keybinds));
    }

    // Remove keybind
    function removeKeyBind(id) {
        const keybinds = JSON.parse(localStorage.getItem('Multikey') || '{}');

        if (keybinds[id]) {
            delete keybinds[id];
            localStorage.setItem('Multikey', JSON.stringify(keybinds));
        }
    }

    // Format key name for display
    function formatKeyName(key) {
        switch (key) {
            case ' ': return 'SPACE';
            case 'Control': return 'CTRL';
            case 'Alt': return 'ALT';
            case 'Shift': return 'SHIFT';
            case 'ArrowUp': return '↑';
            case 'ArrowDown': return '↓';
            case 'ArrowLeft': return '←';
            case 'ArrowRight': return '→';
            case 'Enter': return 'ENTER';
            case 'Escape': return 'ESC';
            case 'Tab': return 'TAB';
            case 'CapsLock': return 'CAPS';
            case 'Delete': return 'DEL';
            case 'Insert': return 'INS';
            case 'Home': return 'HOME';
            case 'End': return 'END';
            case 'PageUp': return 'PGUP';
            case 'PageDown': return 'PGDN';
            case 'Backspace': return 'BKSP';
            default: return key.length === 1 ? key.toUpperCase() : key;
        }
    }

    // Helper to get keybind button by ID
    function getKeybindButtonById(id) {
        const buttons = document.querySelectorAll('.keybind-button');
        for (const button of buttons) {
            if (button.dataset.id === id) {
                return button;
            }
        }
        return null;
    }

    // Show a message in the game
    function showGameMessage(message, color = 'white') {
        const messageContainer = document.createElement('div');
        messageContainer.style.cssText = `
            position: fixed;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: ${color};
            padding: 8px 15px;
            border-radius: 4px;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            z-index: 9999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        messageContainer.textContent = message;
        document.body.appendChild(messageContainer);

        // Fade in
        setTimeout(() => {
            messageContainer.style.opacity = '1';
        }, 10);

        // Fade out and remove
        setTimeout(() => {
            messageContainer.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(messageContainer)) {
                    document.body.removeChild(messageContainer);
                }
            }, 300);
        }, 2000);
    }
        // Setup multi-power keybinds
    function setupMultiPowerKeyBinds() {
        console.log("Setting up multi-power keybinds...");

        // Prevent duplicate initialization
        if (unsafeWindow.multiKeysInitialized) {
            console.log("Multi-key system already initialized");
            return;
        }

        // Set up keyboard event listener for keybinds
        document.addEventListener("keydown", function(e) {
            // Only handle keydown if MultiDrop is enabled
            if (document.getElementById('cMultiDrop')?.checked &&
                !document.querySelector("input:focus, textarea:focus") &&
                document.querySelector("#overlays")?.style.display !== "block") {

                // Prevent handling repeat events
                if (e.repeat) {
                    e.preventDefault();
                    return;
                }

                // Get keybinds from localStorage
                const keyBinds = JSON.parse(localStorage.getItem('Multikey') || '{}');

                // Match the keyCode to our stored keybinds
                Object.keys(keyBinds).forEach(bindId => {
                    if (keyBinds[bindId].keyCode === e.keyCode) {
                        console.log(`Keybind match: ${bindId}`);
                        executeKeybind(bindId);
                    }
                });
            }
        });

        // Helper function to get key mappings from localStorage
        function getKeyMappings() {
            try {
                // Get the saved keybinds from localStorage
                const multiKeyData = JSON.parse(localStorage.getItem('Multikey') || '{}');

                // Extract the keyCode values for each mapping
                return {
                    mRec: multiKeyData.mRec?.keyCode,
                    mSpeed: multiKeyData.mSpeed?.keyCode,
                    mGrowth: multiKeyData.mGrowth?.keyCode,
                    mVirus: multiKeyData.mVirus?.keyCode,
                    mMothercell: multiKeyData.mMothercell?.keyCode,
                    mPortal: multiKeyData.mPortal?.keyCode,
                    mFreeze: multiKeyData.mFreeze?.keyCode,
                    mBlock: multiKeyData.mBlock?.keyCode,
                    mAntiFreeze: multiKeyData.mAntiFreeze?.keyCode,
                    mAntiRec: multiKeyData.mAntiRec?.keyCode,
                    mShield: multiKeyData.mShield?.keyCode,
                    mRecSpeed: multiKeyData.mRecSpeed?.keyCode,
                    mShieldAntifreeze: multiKeyData.mShieldAntifreeze?.keyCode,
                    mMultiPellets: multiKeyData.mMultiPellets?.keyCode,
                    mMultiVirus: multiKeyData.mMultiVirus?.keyCode,
                    mMultiMothercell: multiKeyData.mMultiMothercell?.keyCode,
                    mBreakShield: multiKeyData.mBreakShield?.keyCode,
                    // Get other configuration values
                    brshieldpw: multiKeyData.brshld?.power || "mothercell",
                    multiple: multiKeyData.multiple || { amount: 15 },
                    dropDelay: multiKeyData.dropDelay || { delay: 0 }
                };
            } catch (error) {
                console.error("Error getting key mappings:", error);
                // Return default empty mappings if there's an error
                return {
                    brshieldpw: "mothercell",
                    multiple: { amount: 15 },
                    dropDelay: { delay: 0 }
                };
            }
        }

        // Add a helper function to get the pellet amount
        function getPelletAmount() {
            try {
                const multiKeyData = JSON.parse(localStorage.getItem('Multikey') || '{}');
                return multiKeyData.multiple && multiKeyData.multiple.amount
                    ? parseInt(multiKeyData.multiple.amount)
                    : parseInt(document.getElementById('customMultiPelletsAmount')?.value || '15');
            } catch (e) {
                return 15; // Default fallback
            }
        }

        // Add a helper function to get the break shield type
        function getBreakShieldType() {
            try {
                // First try to get from localStorage
                const multiKeyData = JSON.parse(localStorage.getItem('Multikey') || '{}');
                if (multiKeyData.brshld && multiKeyData.brshld.power) {
                    return multiKeyData.brshld.power;
                }

                // If not in localStorage, check radio buttons
                if (document.getElementById('brMulVirus')?.checked) {
                    return 'virus';
                } else if (document.getElementById('brMulMtcl')?.checked) {
                    return 'mothercell';
                }

                // Default
                return 'mothercell';
            } catch (e) {
                return 'mothercell'; // Default fallback
            }
        }

        // Function to execute keybind actions
        function executeKeybind(bindId) {
            const pelletAmount = getPelletAmount();

            switch(bindId) {
                case 'mRec':
                    unsafeWindow.sendPw(1);
                    break;
                case 'mSpeed':
                    unsafeWindow.sendPw(2);
                    break;
                case 'mGrowth':
                    unsafeWindow.sendPw(3);
                    break;
                case 'mVirus':
                    unsafeWindow.sendPw(4);
                    break;
                case 'mMothercell':
                    unsafeWindow.sendPw(5);
                    break;
                case 'mPortal':
                    unsafeWindow.sendPw(6);
                    break;
                case 'mFreeze':
                    unsafeWindow.sendPw(8);
                    break;
                case 'mBlock':
                    unsafeWindow.sendPw(9);
                    break;
                case 'mAntiFreeze':
                    unsafeWindow.sendPw(11);
                    break;
                case 'mAntiRec':
                    unsafeWindow.sendPw(12);
                    break;
                case 'mShield':
                    unsafeWindow.sendPw(14);
                    break;
                case 'mRecSpeed':
                    // 9x Rec+Speed
                    for (let i = 0; i < 9; i++) {
                        unsafeWindow.sendPw(1);
                        unsafeWindow.sendPw(2);
                    }
                    break;
                case 'mShieldAntifreeze':
                    // Shield + Anti-Freeze
                    unsafeWindow.sendPw(14);
                    unsafeWindow.sendPw(11);
                    break;
                case 'mMultiPellets':
                    // Multi Pellets
                    for (let i = 0; i < pelletAmount; i++) {
                        unsafeWindow.sendPw(3);
                    }
                    break;
                case 'mMultiVirus':
                    // Multi Virus
                    unsafeWindow.sendPw(12); // Anti-rec
                    unsafeWindow.sendPw(8);  // Freeze
                    setTimeout(() => {
                        unsafeWindow.sendPw(4); // Virus
                    }, 400);
                    break;
                case 'mMultiMothercell':
                    // Multi Mothercell
                    unsafeWindow.sendPw(12); // Anti-rec
                    unsafeWindow.sendPw(5);  // Mothercell
                    unsafeWindow.sendPw(8);  // Freeze
                    break;
                case 'mBreakShield':
                    {
                        // Break Shield
                        const breakShieldType = getBreakShieldType();
                        unsafeWindow.sendPw(6);  // Portal
                        unsafeWindow.sendPw(12); // Anti-rec
                        unsafeWindow.sendPw(8);  // Freeze

                        if (breakShieldType === 'mothercell') {
                            unsafeWindow.sendPw(5);  // Mothercell
                        } else if (breakShieldType === 'virus') {
                            setTimeout(() => {
                                unsafeWindow.sendPw(4); // Virus
                            }, 400);
                        }
                    }
                    break;
            }
        }

        // Mark as initialized
        unsafeWindow.multiKeysInitialized = true;

        console.log("Multi-power keybinds setup complete");
    }

    // Initialize the application when the window loads
    window.addEventListener('load', () => {
    if (initialized) {
        console.log("Load event handler already ran, skipping");
        return;
    }

    initialized = true;
    console.log("Running initialization sequence");

    // Create UI elements
    createUIElements();

    // Check for existing subscription
    checkExistingSubscription().then(isValid => {
        if (!isValid) {
            // If no valid subscription, show the login modal
            const keyAuthModal = document.getElementById('keyauth-modal');
            if (keyAuthModal) {
                keyAuthModal.style.display = 'block';
                keyAuthModal.style.opacity = '1';
            }
        }

        // Check for updates after initialization
        updateCheckTimeout = setTimeout(() => checkForUpdates(), 5000);
    });
});

    // Add this function to create the Stats UI
    function createStatsTracker() {
        // Check if already exists
        if (document.getElementById('fx-stats-panel')) return;

        // Create stats panel
        const statsPanel = document.createElement('div');
        statsPanel.id = 'fx-stats-panel';
        statsPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(20, 20, 28, 0.8);
            border: 1px solid rgba(108, 99, 255, 0.4);
            border-radius: 6px;
            color: white;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 12px;
            padding: 10px;
            width: 180px;
            z-index: 9995;
            backdrop-filter: blur(4px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            display: ${isAuthenticated ? 'block' : 'none'};
            transition: all 0.3s ease;
        `;

        statsPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div style="font-weight: bold; color: #6c63ff;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                    Game Stats
                </div>
                <div style="cursor: pointer; font-size: 14px;" id="stats-toggle">−</div>
            </div>
            <div id="stats-content">
                <div class="stat-row">
                    <div>Games Played:</div>
                    <div id="stat-games">0</div>
                </div>
                <div class="stat-row">
                    <div>Kills:</div>
                    <div id="stat-kills">0</div>
                </div>
                <div class="stat-row">
                    <div>Deaths:</div>
                    <div id="stat-deaths">0</div>
                </div>
                <div class="stat-row">
                    <div>K/D Ratio:</div>
                    <div id="stat-kd">0.00</div>
                </div>
                <div class="stat-row">
                    <div>Max Mass:</div>
                    <div id="stat-max-mass">0</div>
                </div>
                <div class="stat-row">
                    <div>Longest Life:</div>
                    <div id="stat-longest-life">00:00</div>
                </div>
                <div class="stat-row">
                    <div>Total Play Time:</div>
                    <div id="stat-total-time">00:00</div>
                </div>
                <div class="stat-row" style="margin-top: 8px;">
                    <div id="stat-current" style="color: #6c63ff; text-align: center; width: 100%;">Not playing</div>
                </div>
                <button id="reset-stats" style="
                    width: 100%;
                    margin-top: 8px;
                    padding: 4px;
                    background: rgba(255, 0, 0, 0.2);
                    border: 1px solid rgba(255, 0, 0, 0.4);
                    color: #ff4d4d;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 11px;
                    transition: all 0.2s ease;
                ">Reset Statistics</button>
            </div>
        `;

        document.body.appendChild(statsPanel);

        // Add styles
        const statsStyle = document.createElement('style');
        statsStyle.textContent = `
            .stat-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
            }
            #reset-stats:hover {
                background: rgba(255, 0, 0, 0.3);
            }
            #stats-toggle:hover {
                color: #6c63ff;
            }
        `;
        document.head.appendChild(statsStyle);

        // Minimize/maximize toggle
        const toggleBtn = document.getElementById('stats-toggle');
        const content = document.getElementById('stats-content');
        let minimized = false;

        toggleBtn.addEventListener('click', () => {
            if (minimized) {
                content.style.display = 'block';
                toggleBtn.textContent = '−';
                minimized = false;
            } else {
                content.style.display = 'none';
                toggleBtn.textContent = '+';
                minimized = true;
            }
        });

        // Reset button
        document.getElementById('reset-stats').addEventListener('click', () => {
            if (confirm('Reset all statistics?')) {
                resetGameStats();
                updateStatsDisplay();
                showGameMessage('Statistics reset', '#ff4d4d');
            }
        });

        // Load saved stats
        loadGameStats();
        updateStatsDisplay();

        // Set up game state monitoring
        setupGameStateMonitoring();
    }

    // Function to load stats from localStorage
    function loadGameStats() {
        const savedStats = localStorage.getItem('framex-game-stats');
        if (savedStats) {
            try {
                const parsed = JSON.parse(savedStats);
                gameStats = Object.assign(gameStats, parsed);
            } catch (e) {
                console.error('Error loading game stats:', e);
            }
        }
    }

    // Function to save stats to localStorage
    function saveGameStats() {
        localStorage.setItem('framex-game-stats', JSON.stringify(gameStats));
    }

    // Function to update the stats display
    function updateStatsDisplay() {
        document.getElementById('stat-games').textContent = gameStats.games;
        document.getElementById('stat-kills').textContent = gameStats.kills;
        document.getElementById('stat-deaths').textContent = gameStats.deaths;

        // Calculate K/D ratio with 2 decimal places
        const kdRatio = gameStats.deaths === 0 ? gameStats.kills :
                        (gameStats.kills / gameStats.deaths).toFixed(2);
        document.getElementById('stat-kd').textContent = kdRatio;

        document.getElementById('stat-max-mass').textContent = formatMass(gameStats.maxMass);
        document.getElementById('stat-longest-life').textContent = formatTime(gameStats.longestLife);
        document.getElementById('stat-total-time').textContent = formatTime(gameStats.totalPlayTime);

        // Update current game status
        const currentElement = document.getElementById('stat-current');
        if (gameStats.isPlaying) {
            const currentDuration = Math.floor((Date.now() - gameStats.currentGameStart) / 1000);
            currentElement.textContent = `Playing: ${formatTime(currentDuration)}`;

            // Update mass display if we have it
            if (gameStats.lastMass > 0) {
                currentElement.textContent += ` | Mass: ${formatMass(gameStats.lastMass)}`;
            }

            // Schedule next update
            setTimeout(updateStatsDisplay, 1000);
        } else {
            currentElement.textContent = 'Not playing';
        }
    }

    // Format mass with k/m suffix
    function formatMass(mass) {
        if (mass >= 1000000) {
            return (mass / 1000000).toFixed(1) + 'm';
        } else if (mass >= 1000) {
            return (mass / 1000).toFixed(1) + 'k';
        }
        return mass;
    }

    // Format seconds to mm:ss or hh:mm:ss
    function formatTime(seconds) {
        if (seconds >= 3600) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;
            return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        } else {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
    }

    // Reset all stats
    function resetGameStats() {
        gameStats = {
            games: 0,
            kills: 0,
            deaths: 0,
            maxMass: 0,
            totalPlayTime: 0,
            longestLife: 0,
            currentGameStart: gameStats.currentGameStart,
            isPlaying: gameStats.isPlaying,
            lastMass: 0,
            history: []
        };
        saveGameStats();
    }

    // Setup monitoring of game state
    function setupGameStateMonitoring() {
        // Monitor for game start (when player spawns)
        const gameStateMonitor = setInterval(() => {
            const playerActive = isPlayerActive();

            // Player just spawned
            if (playerActive && !gameStats.isPlaying) {
                gameStats.isPlaying = true;
                gameStats.currentGameStart = Date.now();
                gameStats.games++;
                saveGameStats();
                updateStatsDisplay();
            }

            // Player just died
            if (!playerActive && gameStats.isPlaying) {
                const gameDuration = Math.floor((Date.now() - gameStats.currentGameStart) / 1000);
                gameStats.isPlaying = false;
                gameStats.totalPlayTime += gameDuration;
                gameStats.deaths++;

                // Check if this was the longest life
                if (gameDuration > gameStats.longestLife) {
                    gameStats.longestLife = gameDuration;
                }

                // Add to history
                gameStats.history.push({
                    date: new Date().toISOString(),
                    duration: gameDuration,
                    maxMass: gameStats.lastMass,
                    kills: 0 // We don't have a way to track kills per game yet
                });

                // Trim history if too long
                if (gameStats.history.length > 20) {
                    gameStats.history = gameStats.history.slice(-20);
                }

                saveGameStats();
                updateStatsDisplay();
            }

            // Update current mass if playing
            if (gameStats.isPlaying) {
                const currentMass = getCurrentMass();
                if (currentMass > 0) {
                    gameStats.lastMass = currentMass;

                    // Update max mass if higher
                    if (currentMass > gameStats.maxMass) {
                        gameStats.maxMass = currentMass;
                        saveGameStats();
                    }
                }
            }
        }, 1000);

        // Detect kills by monitoring the chat for killed messages
        // This is a simple implementation and might need adjustment based on the game's UI
        const chatObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.textContent.includes('killed')) {
                            // Check if player name is in the kill message
                            const playerName = getPlayerName();
                            if (playerName && node.textContent.includes(playerName + ' killed')) {
                                gameStats.kills++;
                                saveGameStats();
                                updateStatsDisplay();
                            }
                        }
                    });
                }
            });
        });

        // Start observing chat container
        const chatContainer = document.querySelector('#chatroom, #chatbox, .chat-container');
        if (chatContainer) {
            chatObserver.observe(chatContainer, { childList: true, subtree: true });
        }
    }

    // Helper function to detect if player is active
    function isPlayerActive() {
        // Different ways to check if player is active in the game
        // This needs to be customized for agma.io's specific UI

        // Method 1: Check if death screen is visible
        const deathScreen = document.querySelector('.death-screen, #death-screen, #overlays');
        if (deathScreen && deathScreen.style.display !== 'none') return false;

        // Method 2: Check for player mass or score element
        const massElement = document.querySelector('#player-mass, .mass, .score');
        if (massElement && massElement.textContent && parseInt(massElement.textContent.replace(/\D/g, '')) > 0) {
            return true;
        }

        // Method 3: Check Canvas activity
        const canvas = document.querySelector('#canvas');
        if (canvas && canvas.style.display !== 'none') {
            // Additional checks can be made here
            return true;
        }

        return false;
    }

    // Helper function to get current mass
    function getCurrentMass() {
        const massElement = document.querySelector('#player-mass, .mass, .score');
        if (massElement && massElement.textContent) {
            // Remove non-digit characters and parse
            const mass = parseInt(massElement.textContent.replace(/\D/g, ''));
            return isNaN(mass) ? 0 : mass;
        }
        return 0;
    }

    // Helper function to get player name
    function getPlayerName() {
        // This needs to be customized for agma.io
        const nameElement = document.querySelector('.player-name, #nickname');
        return nameElement ? nameElement.textContent.trim() : '';
    }

    // Add to your createUIElements function
    // createStatsTracker();

    // Add this to checkExistingSubscription() success case
    // createStatsTracker();

    // Add this function to create the Gold Stats UI
    function createGoldStatsTracker() {
        // Check if already exists
        if (document.getElementById('fx-gold-panel')) return;

        // Create main panel first (initially hidden)
        const statsPanel = document.createElement('div');
        statsPanel.id = 'fx-gold-panel';
        statsPanel.style.cssText = `
            position: fixed;
            right: -220px;
            top: 25%;
            transform: translateY(-50%);
            background: rgba(30, 30, 40, 0.95);
            color: white;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 12px;
            padding: 15px;
            border-radius: 6px 0 0 6px;
            z-index: 9996;
            border: 1px solid rgba(255, 215, 0, 0.4);
            border-right: none;
            backdrop-filter: blur(4px);
            transition: right 0.3s ease;
            user-select: none;
            width: 200px;
            box-shadow: -3px 0 10px rgba(0,0,0,0.5);
            max-height: 70vh;
        `;

        statsPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div style="font-weight: bold; color: #FFD700; font-size: 14px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;">
                        <circle cx="12" cy="12" r="8"></circle>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Gold Tracker
                </div>
                <span id="gold-panel-close" style="cursor: pointer; padding: 2px 6px; border-radius: 3px; background: rgba(255,255,255,0.1);">×</span>
            </div>
            <div id="gold-stats-content">
                <div class="stat-row">
                    <div>Starting Gold:</div>
                    <div id="stat-start-gold">0</div>
                </div>
                <div class="stat-row">
                    <div>Current Gold:</div>
                    <div id="stat-current-gold">0</div>
                </div>
                <div class="stat-row">
                    <div>Session Gain:</div>
                    <div id="stat-session-gain">0</div>
                </div>
                <div class="stat-row">
                    <div>Gold per Minute:</div>
                    <div id="stat-gold-per-min">0</div>
                </div>
                <div class="stat-row">
                    <div>Gold per Hour:</div>
                    <div id="stat-gold-per-hour">0</div>
                </div>
                <div class="stat-row">
                    <div>Session Length:</div>
                    <div id="stat-session-time">00:00:00</div>
                </div>
                <div class="stat-row" style="margin-top: 8px;">
                    <div id="stat-status" style="color: #6c63ff; text-align: center; width: 100%;">Not tracking</div>
                </div>

                <div style="display: flex; gap: 5px; margin-top: 8px;">
                    <button id="reset-gold-stats" style="
                        flex: 1;
                        padding: 4px;
                        background: rgba(255, 0, 0, 0.2);
                        border: 1px solid rgba(255, 0, 0, 0.4);
                        color: #ff4d4d;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 11px;
                        transition: all 0.2s ease;
                    ">Reset Stats</button>

                    <button id="show-off-gold" style="
                        flex: 1;
                        padding: 4px;
                        background: rgba(255, 215, 0, 0.2);
                        border: 1px solid rgba(255, 215, 0, 0.4);
                        color: #FFD700;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 11px;
                        transition: all 0.2s ease;
                    ">Show Off Gold</button>
                </div>
            </div>
        `;

        document.body.appendChild(statsPanel);

        // Create the bookmark tab
        const goldTab = document.createElement('div');
goldTab.id = 'gold-stats-tab';
goldTab.style.cssText = `
    position: fixed;
    right: 0;
    top: 40%; /* Position below the power-counter-tab which is at 30% */
    transform: translateY(-50%);
    background: rgba(30, 30, 40, 0.85);
    color: white;
    width: 36px;
    border-radius: 6px 0 0 6px;
    z-index: 9999;
    cursor: pointer;
    font-family: 'Segoe UI', Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: -2px 0 5px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
    user-select: none;
    border-left: 2px solid rgba(255, 215, 0, 0.6);
    padding: 8px 0;
    margin-top: 10px; /* Add some spacing from the tab above */
`;

        goldTab.innerHTML = `
            <div id="gold-stats-icon" style="padding: 8px 0; opacity: 0.8; transition: all 0.2s ease; cursor: pointer;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 215, 0, 0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="8"></circle>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            </div>
        `;

        document.body.appendChild(goldTab);

        // Add styles
        const goldStyle = document.createElement('style');
        goldStyle.textContent = `
            .stat-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
            }
            #reset-gold-stats:hover {
                background: rgba(255, 0, 0, 0.3);
            }
            #show-off-gold:hover {
                background: rgba(255, 215, 0, 0.3);
            }
            #gold-panel-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            #gold-stats-icon:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(goldStyle);

        // Tab click handler
        let goldPanelOpen = false;
        const goldStatsIcon = document.getElementById('gold-stats-icon');

        if (goldStatsIcon) {
            goldStatsIcon.addEventListener('click', function() {
                if (goldPanelOpen) {
                    // Close the panel
                    statsPanel.style.right = '-220px';
                    this.classList.remove('active-icon');
                    goldPanelOpen = false;
                } else {
                    // Open the panel
                    statsPanel.style.right = '0';
                    this.classList.add('active-icon');
                    goldPanelOpen = true;

                    // Force update stats when opening
                    updateGoldStatsDisplay();
                }
            });
        }

        // Close button handler
        const closeGoldPanel = document.getElementById('gold-panel-close');
        if (closeGoldPanel) {
            closeGoldPanel.addEventListener('click', function() {
                statsPanel.style.right = '-220px';
                document.getElementById('gold-stats-icon')?.classList.remove('active-icon');
                goldPanelOpen = false;
            });
        }

        // Reset button
        document.getElementById('reset-gold-stats').addEventListener('click', () => {
            if (confirm('Reset gold statistics?')) {
                resetGoldStats();
                updateGoldStatsDisplay();
                showGameMessage('Gold statistics reset', '#FFD700');
            }
        });

        // Show off gold button
        document.getElementById('show-off-gold').addEventListener('click', () => {
            showOffGoldStats();
        });

        // Initialize gold statistics
        if (!window.goldStats) {
            window.goldStats = {
                startingGold: 0,
                currentGold: 0,
                sessionStart: Date.now(),
                isTracking: false,
                lastUpdate: Date.now()
            };
        }

        // Load saved stats
        loadGoldStats();

        // Start tracking
        setupGoldTracking();

        // Update display
        updateGoldStatsDisplay();
    }

    // Function to load gold stats from localStorage
    function loadGoldStats() {
        const savedStats = localStorage.getItem('framex-gold-stats');
        if (savedStats) {
            try {
                const parsed = JSON.parse(savedStats);
                window.goldStats = Object.assign(window.goldStats || {}, parsed);
            } catch (e) {
                console.error('Error loading gold stats:', e);
            }
        }
    }

    // Function to save gold stats to localStorage
    function saveGoldStats() {
        localStorage.setItem('framex-gold-stats', JSON.stringify(window.goldStats));
    }

    // Function to reset gold stats
    function resetGoldStats() {
        const currentGold = getCurrentGold();

        window.goldStats = {
            startingGold: currentGold,
            currentGold: currentGold,
            sessionStart: Date.now(),
            isTracking: true,
            lastUpdate: Date.now()
        };

        saveGoldStats();
    }

    // Function to update the gold stats display
    function updateGoldStatsDisplay() {
        if (!window.goldStats) return;

        document.getElementById('stat-start-gold').textContent = formatGold(window.goldStats.startingGold);
        document.getElementById('stat-current-gold').textContent = formatGold(window.goldStats.currentGold);

        // Calculate session gain
        const sessionGain = window.goldStats.currentGold - window.goldStats.startingGold;
        document.getElementById('stat-session-gain').textContent = formatGold(sessionGain, true);

        // Calculate session duration in seconds
        const sessionDuration = Math.floor((Date.now() - window.goldStats.sessionStart) / 1000);
        document.getElementById('stat-session-time').textContent = formatTime(sessionDuration);

        // Calculate gold per minute/hour if we have a valid duration
        if (sessionDuration > 0) {
            const goldPerSecond = sessionGain / sessionDuration;
            const goldPerMinute = goldPerSecond * 60;
            const goldPerHour = goldPerMinute * 60;

            document.getElementById('stat-gold-per-min').textContent = formatGold(goldPerMinute, true);
            document.getElementById('stat-gold-per-hour').textContent = formatGold(goldPerHour, true);
        }

        // Update status message
        const statusEl = document.getElementById('stat-status');
        if (window.goldStats.isTracking) {
            statusEl.textContent = 'Tracking active';
            statusEl.style.color = '#4CAF50';
        } else {
            statusEl.textContent = 'Not tracking';
            statusEl.style.color = '#ff9800';
        }

        // Schedule next update
        setTimeout(updateGoldStatsDisplay, 1000);
    }

    // Format gold with k/m suffix
    function formatGold(gold, showSign = false) {
        const prefix = showSign && gold > 0 ? '+' : '';

        if (Math.abs(gold) >= 1000000) {
            return prefix + (gold / 1000000).toFixed(1) + 'M';
        } else if (Math.abs(gold) >= 1000) {
            return prefix + (gold / 1000).toFixed(1) + 'K';
        }
        return prefix + gold;
    }

    // Format seconds to hh:mm:ss


    // Function to detect and extract current gold
    function getCurrentGold() {
        // Find gold display element - you'll need to adjust this selector for agma.io
        const goldElement = document.querySelector('.gold, #gold, .coins, #coins, .money, #money');

        if (goldElement && goldElement.textContent) {
            // Extract numeric value from gold display
            const goldText = goldElement.textContent.replace(/[^\d.-]/g, '');
            const gold = parseInt(goldText);
            return isNaN(gold) ? 0 : gold;
        }

        return 0;
    }

    // Set up tracking
    function setupGoldTracking() {
        // Initial gold check
        const currentGold = getCurrentGold();

        // If this is our first check, set starting gold
        if (!window.goldStats.isTracking) {
            window.goldStats.startingGold = currentGold;
            window.goldStats.isTracking = true;
        }

        // Update current gold
        window.goldStats.currentGold = currentGold;
        window.goldStats.lastUpdate = Date.now();

        // Save stats
        saveGoldStats();

        // Set up monitoring interval
        setInterval(() => {
            const newGold = getCurrentGold();

            // Only update if gold amount changed
            if (newGold !== window.goldStats.currentGold) {
                window.goldStats.currentGold = newGold;
                window.goldStats.lastUpdate = Date.now();
                saveGoldStats();
            }
        }, 2000); // Check every 2 seconds
    }

    // Add the show off function
    function showOffGoldStats() {
        if (!window.goldStats) return;

        // Calculate stats
        const sessionGain = window.goldStats.currentGold - window.goldStats.startingGold;
        const sessionDuration = Math.floor((Date.now() - window.goldStats.sessionStart) / 1000);
        const goldPerHour = sessionDuration > 0 ? sessionGain / sessionDuration * 3600 : 0;

        // Format stats for display
        const formattedGain = formatGold(sessionGain, true);
        const formattedTime = formatTime(sessionDuration);
        const formattedRate = formatGold(goldPerHour);

        // Create message
        const message = `🪙 I've farmed ${formattedGain} gold in ${formattedTime} (${formattedRate}/hour)! 🪙`;

        // Send to chat
        try {
            // Try to find chat input with the correct ID
            const chatInput = document.querySelector('#chtbox');

            if (chatInput) {
                // Set value
                chatInput.value = message;

                // Try to submit with enter key event
                const enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                });
                chatInput.dispatchEvent(enterEvent);
            } else {
                // Fallback to other selectors if chtbox not found
                const fallbackInput = document.querySelector('#chat-input, #chatInput, input.chat-input');
                if (fallbackInput) {
                    fallbackInput.value = message;
                    fallbackInput.dispatchEvent(new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true
                    }));
                } else {
                    // If we can't find any chat input, just show a game message
                    showGameMessage('Chat not found. Stats: ' + message, '#FFD700');

                    // Copy to clipboard as fallback
                    navigator.clipboard.writeText(message).then(() => {
                        showGameMessage('Stats copied to clipboard!', '#4CAF50');
                    });
                }
            }
        } catch (e) {
            // Fallback to showing a game message
            showGameMessage(message, '#FFD700');

            // Also copy to clipboard
            navigator.clipboard.writeText(message).then(() => {
                showGameMessage('Stats copied to clipboard!', '#4CAF50');
            }).catch(() => {
                console.error("Failed to copy stats to clipboard");
            });
        }

        // Show tooltip to player
        showGameMessage('Gold stats shared!', '#FFD700');
    }

    // Add Show Off button to the power counter panel
    function addPowerShowOffButton() {
        const powerCounterContent = document.getElementById('power-counter-details');
        if (!powerCounterContent) return;

        // Create show off button
        const showOffButton = document.createElement('button');
        showOffButton.id = 'show-off-power';
        showOffButton.style.cssText = `
            width: 100%;
            padding: 4px;
            margin-top: 8px;
            background: rgba(108, 99, 255, 0.2);
            border: 1px solid rgba(108, 99, 255, 0.4);
            color: #6c63ff;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.2s ease;
        `;
        showOffButton.textContent = 'Show Off Power Stats';

        // Add hover effect in the stylesheet
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            #show-off-power:hover {
                background: rgba(108, 99, 255, 0.3);
            }
        `;
        document.head.appendChild(styleElement);

        // Add click handler
        showOffButton.addEventListener('click', showOffPowerStats);

        // Add to panel
        powerCounterContent.appendChild(showOffButton);
    }

    // Function to show off power stats in chat
    function showOffPowerStats() {
        if (!unsafeWindow.powerStats) return;

        // Calculate stats
        const totalPowers = unsafeWindow.powerStats.total || 0;
        const sessionTime = Math.floor((Date.now() - (unsafeWindow.powerStats.startTime || Date.now())) / 1000);
        const formattedTime = formatTime(sessionTime);

        // Get most used power
        let mostUsedPower = null;
        let mostUsedCount = 0;

        for (const [power, count] of Object.entries(unsafeWindow.powerStats.individual || {})) {
            if (count > mostUsedCount) {
                mostUsedPower = power;
                mostUsedCount = count;
            }
        }

        const mostUsedName = mostUsedPower ? `${getPowerName(parseInt(mostUsedPower))} (${mostUsedCount})` : "None";

        // Calculate powers per minute
        const powersPerMinute = sessionTime > 0 ? (totalPowers / sessionTime * 60).toFixed(1) : 0;

        // Create message
        const message = `⚡ I've used ${totalPowers} powers in ${formattedTime} (${powersPerMinute}/min)! Most used: ${mostUsedName} ⚡`;

        // Send to chat using same method as gold stats
        try {
            // Try to find chat input with the correct ID
            const chatInput = document.querySelector('#chtbox');

            if (chatInput) {
                // Set value
                chatInput.value = message;

                // Try to submit with enter key event
                const enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                });
                chatInput.dispatchEvent(enterEvent);
            } else {
                // Fallback to other selectors if chtbox not found
                const fallbackInput = document.querySelector('#chat-input, #chatInput, input.chat-input');
                if (fallbackInput) {
                    fallbackInput.value = message;
                    fallbackInput.dispatchEvent(new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true
                    }));
                } else {
                    // If we can't find any chat input, just show a game message
                    showGameMessage('Chat not found. Stats: ' + message, '#6c63ff');

                    // Copy to clipboard as fallback
                    navigator.clipboard.writeText(message).then(() => {
                        showGameMessage('Stats copied to clipboard!', '#4CAF50');
                    });
                }
            }
        } catch (e) {
            // Fallback to showing a game message
            showGameMessage(message, '#6c63ff');

            // Also copy to clipboard
            navigator.clipboard.writeText(message).then(() => {
                showGameMessage('Stats copied to clipboard!', '#4CAF50');
            }).catch(() => {
                console.error("Failed to copy stats to clipboard");
            });
        }

        // Show tooltip to player
        showGameMessage('Power stats shared!', '#6c63ff');
    }


})();

function createPlayerTracker() {
    // Verify the tracker doesn't already exist
    if (document.getElementById('fx-player-tracker')) return;

    console.log("Initializing player tracker system");

    // Create data storage if it doesn't exist
    if (!window.trackedPlayers) {
        // Try to load from localStorage first
        try {
            const savedPlayers = localStorage.getItem('framex-player-tracker');
            window.trackedPlayers = savedPlayers ? JSON.parse(savedPlayers) : {};
            console.log("Loaded tracked players from storage:", Object.keys(window.trackedPlayers).length);
        } catch (e) {
            console.error("Error loading player data:", e);
            window.trackedPlayers = {};
        }
    }

    // Create styles for the tracker UI
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        #fx-player-tracker {
            position: fixed;
            right: -320px;
            top: 60%;
            transform: translateY(-50%);
            background: rgba(30, 30, 40, 0.95);
            color: white;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 12px;
            padding: 15px;
            border-radius: 6px 0 0 6px;
            z-index: 9996;
            border: 1px solid rgba(46, 204, 113, 0.4);
            border-right: none;
            backdrop-filter: blur(4px);
            transition: right 0.3s ease;
            user-select: none;
            width: 300px;
            box-shadow: -3px 0 10px rgba(0,0,0,0.5);
            max-height: 70vh;
            overflow-y: auto;
        }

        #player-tracker-tab {
            position: fixed;
            right: 0;
            top: 60%;
            transform: translateY(-50%);
            background: rgba(30, 30, 40, 0.85);
            color: white;
            width: 36px;
            border-radius: 6px 0 0 6px;
            z-index: 9999;
            cursor: pointer;
            font-family: 'Segoe UI', Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: -2px 0 5px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            user-select: none;
            border-left: 2px solid rgba(46, 204, 113, 0.6);
            padding: 8px 0;
            margin-top: 10px;
        }

        #player-tracker-icon:hover {
            opacity: 1;
        }

        #player-tracker-icon {
            padding: 8px 0;
            opacity: 0.8;
            transition: all 0.2s ease;
            cursor: pointer;
        }

        .active-icon {
            background: rgba(46, 204, 113, 0.3) !important;
            box-shadow: 0 0 5px rgba(46, 204, 113, 0.5);
        }

        .player-entry {
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding: 8px 5px;
            margin-bottom: 5px;
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .player-entry:hover {
            background: rgba(255,255,255,0.05);
        }

        .player-entry-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 3px;
        }

        .player-username {
            font-weight: bold;
            color: #2ecc71;
        }

        .player-actions {
            display: flex;
            gap: 5px;
        }

        .player-action-btn {
            padding: 2px 5px;
            border-radius: 3px;
            background: rgba(255,255,255,0.1);
            cursor: pointer;
            font-size: 10px;
        }

        .player-action-btn:hover {
            background: rgba(255,255,255,0.2);
        }

        .player-nicknames {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-top: 3px;
        }

        .player-nickname {
            background: rgba(46, 204, 113, 0.2);
            padding: 2px 4px;
            border-radius: 3px;
            font-size: 10px;
        }

        .player-notes {
            margin-top: 5px;
            font-style: italic;
            font-size: 11px;
            color: rgba(255,255,255,0.7);
        }

        .player-search {
            margin-bottom: 10px;
            width: 100%;
            padding: 6px 8px;
            background: rgba(255,255,255,0.1);
            border: none;
            color: white;
            border-radius: 4px;
            font-family: inherit;
            font-size: 12px;
        }

        .player-stats {
            color: rgba(255,255,255,0.6);
            font-size: 10px;
            margin-top: 3px;
        }

        .player-alert {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(46, 204, 113, 0.9);
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            z-index: 100000;
            font-family: 'Segoe UI', Arial, sans-serif;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        /* Custom scrollbar to match UI */
        #player-list-container::-webkit-scrollbar {
            width: 6px;
        }

        #player-list-container::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
        }

        #player-list-container::-webkit-scrollbar-thumb {
            background: rgba(46, 204, 113, 0.4);
            border-radius: 3px;
        }

        #player-list-container::-webkit-scrollbar-thumb:hover {
            background: rgba(46, 204, 113, 0.6);
        }

        /* Match the scrollbar for the main tracker panel too */
        #fx-player-tracker::-webkit-scrollbar {
            width: 6px;
        }

        #fx-player-tracker::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
        }

        #fx-player-tracker::-webkit-scrollbar-thumb {
            background: rgba(46, 204, 113, 0.4);
            border-radius: 3px;
        }

        #fx-player-tracker::-webkit-scrollbar-thumb:hover {
            background: rgba(46, 204, 113, 0.6);
        }
    `;
    document.head.appendChild(styleEl);

    // Define togglePanel function first to prevent the "Cannot access before initialization" error
    let panelVisible = false;
    function togglePanel() {
        const panel = document.getElementById('fx-player-tracker');
        const icon = document.getElementById('player-tracker-icon');

        if (panelVisible) {
            panel.style.right = '-320px';
            icon.classList.remove('active-icon');
        } else {
            panel.style.right = '0';
            icon.classList.add('active-icon');
            updatePlayerList(); // Refresh list when opening
        }

        panelVisible = !panelVisible;
    }

    // Function to save player data to localStorage
    function savePlayerData() {
        try {
            localStorage.setItem('framex-player-tracker', JSON.stringify(window.trackedPlayers));
        } catch (e) {
            console.error("Error saving player data:", e);
        }
    }

    // Function to show an alert notification
    function showAlert(message, backgroundColor = "rgba(46, 204, 113, 0.9)") {
        const alertDiv = document.getElementById('player-tracker-alert');
        if (!alertDiv) return;

        alertDiv.textContent = message;
        alertDiv.style.backgroundColor = backgroundColor;
        alertDiv.style.opacity = '1';

        setTimeout(() => {
            alertDiv.style.opacity = '0';
        }, 3000);
    }

    // Function to update the player list in the UI
   // Function to update the player list in the UI with pagination
function updatePlayerList() {
    const playerList = document.getElementById('player-list');
    if (!playerList) return;

    // Get search filter
    const searchFilter = document.getElementById('player-search')?.value.toLowerCase() || '';

    // Clear current list
    playerList.innerHTML = '';

    // Get players as array and sort by lastSeen (most recent first)
    const players = Object.values(window.trackedPlayers)
        .sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen));

    // Filter players based on search term
    const filteredPlayers = players.filter(player => {
        if (searchFilter === '') return true;

        // Search in username
        if (player.username.toLowerCase().includes(searchFilter)) return true;

        // Search in nicknames
        if (player.nicknames.some(nick => nick.toLowerCase().includes(searchFilter))) return true;

        // Search in notes
        if (player.notes.toLowerCase().includes(searchFilter)) return true;

        return false;
    });

    // Show message if no players
    if (filteredPlayers.length === 0) {
        playerList.innerHTML = `<div style="text-align: center; opacity: 0.7; padding: 10px;">
            ${searchFilter ? 'No matching players found' : 'No players tracked yet'}
        </div>`;

        // Hide pagination when no results
        const paginationElement = document.getElementById('player-list-pagination');
        if (paginationElement) {
            paginationElement.style.display = 'none';
        }
        return;
    }

    // Get pagination state
    const currentPage = parseInt(localStorage.getItem('player-tracker-page') || '1');
    const playersPerPage = 5;
    const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);

    // Ensure current page is valid
    const validPage = Math.max(1, Math.min(currentPage, totalPages));
    if (validPage !== currentPage) {
        localStorage.setItem('player-tracker-page', validPage.toString());
    }

    // Get current page players
    const startIndex = (validPage - 1) * playersPerPage;
    const endIndex = Math.min(startIndex + playersPerPage, filteredPlayers.length);
    const currentPagePlayers = filteredPlayers.slice(startIndex, endIndex);

    // Add each player to the list
    currentPagePlayers.forEach(player => {
        const playerEntry = document.createElement('div');
        playerEntry.className = 'player-entry';
        playerEntry.dataset.username = player.username.toLowerCase();

        // Set background color if marked as enemy
        if (player.isEnemy) {
            playerEntry.style.background = "rgba(255, 77, 77, 0.15)";
            playerEntry.style.borderLeft = "3px solid #ff4d4d";
        }

        // Format times
        const lastSeen = new Date(player.lastSeen);
        const formattedLastSeen = lastSeen.toLocaleDateString() + ' ' +
            lastSeen.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        // Get skin preview if available
        let skinPreview = '';
        if (player.skinUrls && player.skinUrls.length > 0) {
            skinPreview = `
                <img src="${player.skinUrls[0]}" style="width: 20px; height: 20px; border-radius: 50%; margin-right: 5px; vertical-align: middle;">
            `;
        }

        // Create HTML for the player entry
        playerEntry.innerHTML = `
<div class="player-entry-header">
    <div class="player-username">${skinPreview}${player.username}${player.isEnemy ? ' <span style="color: #ff4d4d;">⚠️ Enemy</span>' : ''}</div>
    <div class="player-actions">
        <div class="player-action-btn toggle-enemy-btn" title="${player.isEnemy ? 'Remove Enemy Mark' : 'Mark as Enemy'}">${player.isEnemy ? '👍' : '⚠️'}</div>
        <div class="player-action-btn add-note-btn" title="Add/Edit Note">📝</div>
        <div class="player-action-btn delete-player-btn" title="Delete Player">🗑️</div>
    </div>
</div>

<div class="player-stats">Last seen: ${formattedLastSeen}</div>

${player.nicknames.length > 0 ? `
<div class="player-nicknames">
    <div class="player-nickname">Also known as: ${player.nicknames.join(', ')}</div>
</div>` : ''}

${player.notes ? `<div class="player-notes">${player.notes}</div>` : ''}
`;

        // Add event listeners
        playerEntry.querySelector('.toggle-enemy-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleEnemyStatus(player.username.toLowerCase());
        });

        playerEntry.querySelector('.add-note-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            promptForNote(player.username.toLowerCase());
        });

        playerEntry.querySelector('.delete-player-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deletePlayer(player.username.toLowerCase());
        });

        // Add to list
        playerList.appendChild(playerEntry);
    });

    // Update or create pagination
    let paginationElement = document.getElementById('player-list-pagination');
    if (!paginationElement) {
        paginationElement = document.createElement('div');
        paginationElement.id = 'player-list-pagination';
        paginationElement.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 5px;
            margin-top: 15px;
            font-size: 12px;
        `;

        // Add pagination after player list
        const playerListContainer = document.getElementById('player-list-container');
        playerListContainer.parentNode.insertBefore(paginationElement, playerListContainer.nextSibling);
    }

    // Show pagination only when needed
    paginationElement.style.display = totalPages > 1 ? 'flex' : 'none';

    if (totalPages > 1) {
        // Create pagination content
        paginationElement.innerHTML = '';

        // Prev button
        const prevButton = document.createElement('div');
        prevButton.className = 'page-btn';
        prevButton.textContent = '←';
        prevButton.style.cssText = `
            padding: 4px 8px;
            background: rgba(46, 204, 113, 0.2);
            border: 1px solid rgba(46, 204, 113, 0.4);
            color: #2ecc71;
            border-radius: 3px;
            cursor: ${validPage > 1 ? 'pointer' : 'not-allowed'};
            opacity: ${validPage > 1 ? '1' : '0.5'};
            user-select: none;
            transition: all 0.2s ease;
        `;

        if (validPage > 1) {
            prevButton.addEventListener('click', () => {
                localStorage.setItem('player-tracker-page', (validPage - 1).toString());
                updatePlayerList();
            });

            prevButton.addEventListener('mouseover', () => {
                prevButton.style.background = 'rgba(46, 204, 113, 0.3)';
            });

            prevButton.addEventListener('mouseout', () => {
                prevButton.style.background = 'rgba(46, 204, 113, 0.2)';
            });
        }

        paginationElement.appendChild(prevButton);

        // Page indicator
        const pageIndicator = document.createElement('div');
        pageIndicator.textContent = `${validPage}/${totalPages}`;
        pageIndicator.style.cssText = `
            color: white;
            padding: 4px 8px;
        `;
        paginationElement.appendChild(pageIndicator);

        // Next button
        const nextButton = document.createElement('div');
        nextButton.className = 'page-btn';
        nextButton.textContent = '→';
        nextButton.style.cssText = `
            padding: 4px 8px;
            background: rgba(46, 204, 113, 0.2);
            border: 1px solid rgba(46, 204, 113, 0.4);
            color: #2ecc71;
            border-radius: 3px;
            cursor: ${validPage < totalPages ? 'pointer' : 'not-allowed'};
            opacity: ${validPage < totalPages ? '1' : '0.5'};
            user-select: none;
            transition: all 0.2s ease;
        `;

        if (validPage < totalPages) {
            nextButton.addEventListener('click', () => {
                localStorage.setItem('player-tracker-page', (validPage + 1).toString());
                updatePlayerList();
            });

            nextButton.addEventListener('mouseover', () => {
                nextButton.style.background = 'rgba(46, 204, 113, 0.3)';
            });

            nextButton.addEventListener('mouseout', () => {
                nextButton.style.background = 'rgba(46, 204, 113, 0.2)';
            });
        }

        paginationElement.appendChild(nextButton);

        // Display page info
        const pageInfo = document.createElement('div');
        pageInfo.style.cssText = `
            font-size: 10px;
            color: rgba(255, 255, 255, 0.6);
            margin-left: 8px;
        `;
        pageInfo.textContent = `${startIndex + 1}-${endIndex} of ${filteredPlayers.length}`;
        paginationElement.appendChild(pageInfo);
    }
}
function toggleEnemyStatus(username) {
    if (!window.trackedPlayers[username]) return;

    const player = window.trackedPlayers[username];
    const newEnemyStatus = !player.isEnemy;

    // Update this specific player
    player.isEnemy = newEnemyStatus;

    // Get all unique nicknames and username for this player to use for matching
    const matchIdentifiers = new Set([
        player.username.toLowerCase(),
        ...player.nicknames.map(nick => nick.toLowerCase())
    ]);

    // Count how many other players were affected
    let matchingPlayers = 0;

    // Now find all other entries with matching usernames or nicknames
    for (const [key, otherPlayer] of Object.entries(window.trackedPlayers)) {
        // Skip the original player we just updated
        if (key === username) continue;

        // Check if this player matches by username or nickname
        const otherPlayerIdentifiers = [
            otherPlayer.username.toLowerCase(),
            ...otherPlayer.nicknames.map(nick => nick.toLowerCase())
        ];

        // If any identifier from the current player matches any identifier
        // from the other player, mark them the same way
        const hasMatch = otherPlayerIdentifiers.some(id =>
            matchIdentifiers.has(id)) ||
            [...matchIdentifiers].some(id =>
                otherPlayerIdentifiers.includes(id));

        if (hasMatch) {
            otherPlayer.isEnemy = newEnemyStatus;
            matchingPlayers++;
        }
    }

    savePlayerData();
    updatePlayerList();

    const statusMessage = newEnemyStatus
        ? `Marked ${player.username} as an enemy${matchingPlayers > 0 ? ` (+${matchingPlayers} matching players)` : ''}`
        : `Removed enemy status from ${player.username}${matchingPlayers > 0 ? ` (+${matchingPlayers} matching players)` : ''}`;

    showAlert(statusMessage, newEnemyStatus ? "rgba(255, 77, 77, 0.9)" : "rgba(46, 204, 113, 0.9)");
}
// Also add styles for pagination to the styleEl
styleEl.textContent += `
    #player-list-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        margin-top: 15px;
        font-size: 12px;
    }

    .page-btn:hover {
        background: rgba(46, 204, 113, 0.3) !important;
    }
`;

    // Function to track a player
    function trackPlayer(username, nickname = null, skinUrl = null) {
    // Skip if username is empty, null, too short, or contains default text
    if (!username ||
        typeof username !== 'string' ||
        username.trim().length < 2 ||
        username.includes("no player selected") ||
        username.toLowerCase() === "(no player selected)") {
        console.log("Invalid username or no player selected, not tracking:", username);
        return false;
    }

    username = username.trim();
    console.log(`Tracking player - Username: ${username}, Nickname: ${nickname}, Skin URL: ${skinUrl ? skinUrl.substring(0, 30) + '...' : 'none'}`);

    // Normalize username for case-insensitive matching
    const normalizedUsername = username.toLowerCase();

    // Check if this is a new player or an existing one
    const isNewPlayer = !window.trackedPlayers[normalizedUsername];

    // Create player entry if it doesn't exist
    if (isNewPlayer) {
        window.trackedPlayers[normalizedUsername] = {
            username: username, // Store the original username with correct casing
            nicknames: [],
            skinUrls: [],
            notes: "",
            isEnemy: false,
            firstSeen: new Date().toISOString(),
            lastSeen: new Date().toISOString()
        };
    } else {
        // Update last seen timestamp for existing player
        window.trackedPlayers[normalizedUsername].lastSeen = new Date().toISOString();
    }

    // Store username as a nickname if it doesn't match the stored username
    // and isn't already in nicknames list (avoiding duplicates)
    if (username !== window.trackedPlayers[normalizedUsername].username &&
        !window.trackedPlayers[normalizedUsername].nicknames.some(
            n => n.toLowerCase() === username.toLowerCase()
        )) {
        window.trackedPlayers[normalizedUsername].nicknames.push(username);
    }

    // Add nickname if provided and not already in the list
    if (nickname && nickname.trim() !== "") {
        const normalizedNickname = nickname.trim();
        if (!window.trackedPlayers[normalizedUsername].nicknames.some(
            n => n.toLowerCase() === normalizedNickname.toLowerCase()
        )) {
            window.trackedPlayers[normalizedUsername].nicknames.push(normalizedNickname);
        }
    }

    // Add skin URL if provided and not already in the list
    if (skinUrl && skinUrl.trim() !== "") {
        if (!window.trackedPlayers[normalizedUsername].skinUrls.includes(skinUrl)) {
            window.trackedPlayers[normalizedUsername].skinUrls.push(skinUrl);
        }
    }

    // Save data
    savePlayerData();

    // Refresh the UI
    updatePlayerList();

    return {
        success: true,
        isNewPlayer: isNewPlayer,
        player: window.trackedPlayers[normalizedUsername]
    };
}

    // Function to prompt for a note
    function promptForNote(username) {
        if (!window.trackedPlayers[username]) return;

        const currentNote = window.trackedPlayers[username].notes || '';
        const playerName = window.trackedPlayers[username].username;

        const note = prompt(`Enter note for ${playerName}:`, currentNote);

        if (note !== null) { // Check if user cancelled
            window.trackedPlayers[username].notes = note;
            savePlayerData();
            updatePlayerList();
            showAlert(`Note updated for ${playerName}`);
        }
    }

    // Function to delete a player
    function deletePlayer(username) {
        if (!window.trackedPlayers[username]) return;

        const playerName = window.trackedPlayers[username].username;

        if (confirm(`Are you sure you want to delete ${playerName} from tracked players?`)) {
            delete window.trackedPlayers[username];
            savePlayerData();
            updatePlayerList();
            showAlert(`Removed ${playerName} from tracked players`);
        }
    }

    // Function to add a player manually
    function addPlayerManually() {
        const username = prompt("Enter player's username:");
        if (!username || username.trim() === '') return;

        const nickname = prompt("Enter player's nickname (optional):");

        const added = trackPlayer(username, nickname || null);

        if (added) {
            showAlert(`Added ${username} to tracked players`);
            updatePlayerList();
        }
    }

    // Function to clear all tracked players
// Function to create a custom confirmation dialog
function createCustomConfirm(message, onConfirm, onCancel) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 1000001;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(3px);
    `;

    // Create dialog
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: rgba(30, 30, 40, 0.95);
        color: white;
        font-family: 'Segoe UI', Arial, sans-serif;
        padding: 20px;
        border-radius: 8px;
        max-width: 300px;
        border: 1px solid rgba(46, 204, 113, 0.4);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        text-align: center;
    `;

    dialog.innerHTML = `
        <div style="margin-bottom: 15px; font-size: 15px;">${message}</div>
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="confirm-yes" style="
                padding: 8px 15px;
                background: rgba(46, 204, 113, 0.2);
                border: 1px solid rgba(46, 204, 113, 0.4);
                color: #2ecc71;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
            ">Yes</button>
            <button id="confirm-no" style="
                padding: 8px 15px;
                background: rgba(255, 0, 0, 0.2);
                border: 1px solid rgba(255, 0, 0, 0.4);
                color: #ff4d4d;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
            ">No</button>
        </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Add hover effects
    const yesButton = document.getElementById('confirm-yes');
    const noButton = document.getElementById('confirm-no');

    yesButton.addEventListener('mouseover', () => {
        yesButton.style.background = 'rgba(46, 204, 113, 0.3)';
    });
    yesButton.addEventListener('mouseout', () => {
        yesButton.style.background = 'rgba(46, 204, 113, 0.2)';
    });

    noButton.addEventListener('mouseover', () => {
        noButton.style.background = 'rgba(255, 0, 0, 0.3)';
    });
    noButton.addEventListener('mouseout', () => {
        noButton.style.background = 'rgba(255, 0, 0, 0.2)';
    });

    // Add event listeners
    yesButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
        if (onConfirm) onConfirm();
    });

    noButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
        if (onCancel) onCancel();
    });

    // Close on outside click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
            if (onCancel) onCancel();
        }
    });
}

// Function to clear all tracked players
function clearAllPlayers() {
    const playerCount = Object.keys(window.trackedPlayers).length;

    if (playerCount === 0) {
        showAlert("No players to clear", "rgba(255, 165, 0, 0.9)");
        return;
    }

    createCustomConfirm(
        `Are you sure you want to delete ALL ${playerCount} tracked players? This cannot be undone.`,
        () => {
            window.trackedPlayers = {};
            savePlayerData();
            updatePlayerList();
            showAlert(`Cleared all tracked players`);
        }
    );
}

    // Create main tracker panel - removed export button
    const trackerPanel = document.createElement('div');
    trackerPanel.id = 'fx-player-tracker';
    trackerPanel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="font-weight: bold; color: #2ecc71; font-size: 14px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Player Tracker
            </div>
            <span id="player-tracker-close" style="cursor: pointer; padding: 2px 6px; border-radius: 3px; background: rgba(255,255,255,0.1);">×</span>
        </div>

        <input type="text" class="player-search" id="player-search" placeholder="Search players...">

        <div style="margin-bottom: 10px;">
            <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                <button id="add-player-manually" class="player-action-btn" style="flex: 1; padding: 5px;">Add Player Manually</button>
                <button id="clear-all-players" class="player-action-btn" style="flex: 1; padding: 5px; background: rgba(255, 0, 0, 0.2); color: #ff4d4d;">Clear All</button>
            </div>
        </div>

        <div id="player-list-container" style="max-height: 50vh; overflow-y: auto;">
            <div id="player-list">
                <!-- Player entries will be populated here -->
                <div style="text-align: center; opacity: 0.7; padding: 10px;">No players tracked yet</div>
            </div>
        </div>

        <div style="margin-top: 10px; font-size: 10px; color: rgba(255,255,255,0.6); text-align: center;">
            Players are tracked automatically when viewing their profiles
        </div>
    `;
    document.body.appendChild(trackerPanel);

    // Create the tab icon
    const trackerTab = document.createElement('div');
    trackerTab.id = 'player-tracker-tab';
    trackerTab.innerHTML = `
        <div id="player-tracker-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(46, 204, 113, 0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        </div>
    `;
    document.body.appendChild(trackerTab);

    // Create a notification div for alerts
    const alertDiv = document.createElement('div');
    alertDiv.id = 'player-tracker-alert';
    alertDiv.className = 'player-alert';
    document.body.appendChild(alertDiv);

    // Add event listeners
    document.getElementById('player-tracker-tab').addEventListener('click', togglePanel);
    document.getElementById('player-tracker-close').addEventListener('click', togglePanel);
    document.getElementById('add-player-manually').addEventListener('click', addPlayerManually);
    document.getElementById('clear-all-players').addEventListener('click', clearAllPlayers);

    // Add search functionality
    document.getElementById('player-search').addEventListener('input', updatePlayerList);

    // Initial update of player list
    updatePlayerList();

    // Create a more direct profile checker that handles different HTML structures
    function checkForPlayerProfile() {
        // First check for the Sweet Alert dialog
        const sweetAlert = document.querySelector('.sweet-alert.swal-title-gold.showSweetAlert.visible');
        if (sweetAlert) {
            console.log("Found SweetAlert profile dialog");

            try {
                // Try to find username from contextPlayerName first
                const contextPlayerName = document.getElementById('contextPlayerName');
                if (contextPlayerName) {
                    const username = contextPlayerName.textContent.trim();
                    console.log("Found username from contextPlayerName:", username);

                    if (username) {
                        // Try to get skin image
                        let skinUrl = null;
                        const imgElements = sweetAlert.querySelectorAll('img');
                        for (const img of imgElements) {
                            if (img.src && (img.src.includes('skin') || img.src.includes('lo.png'))) {
                                skinUrl = img.src;
                                console.log("Found skin URL:", skinUrl);
                                break;
                            }
                        }

                        // Look for nickname (could be in another span or text)
                        let nickname = null;
                        const spans = sweetAlert.querySelectorAll('span');
                        for (const span of spans) {
                            const text = span.textContent.trim();
                            if (text && text !== username && text.length < 30) {
                                // Potential nickname (if not too long and not the username)
                                nickname = text;
                                console.log("Found potential nickname from span:", nickname);
                                break;
                            }
                        }

                        // Track the player
                        const isNewPlayer = !window.trackedPlayers[username.toLowerCase()];
                        if (trackPlayer(username, nickname, skinUrl)) {
                            if (isNewPlayer) {
                                showAlert(`Tracking new player: ${username}`);
                            } else {
                                showAlert(`Updated player: ${username}`);
                            }
                            return true;
                        }
                    }
                }

                // If we get here, we didn't find the username in contextPlayerName
                // Look for any span elements in the sweet alert
                const allSpans = sweetAlert.querySelectorAll('span');
                for (const span of allSpans) {
                    const text = span.textContent.trim();
                    if (text && text.length > 1 && text.length < 20) {
                        console.log("Found potential username from span:", text);

                        // Try to detect if this is a username (often enclosed in a header element)
                        const isHeader = span.closest('h2') !== null;
                        const hasStyle = span.hasAttribute('style');
                        const parentIsCentered = getComputedStyle(span.parentElement).textAlign === 'center';

                        if (isHeader || hasStyle || parentIsCentered) {
                            const username = text;

                            // Try to get skin image
                            let skinUrl = null;
                            const parentEl = span.parentElement;
                            if (parentEl) {
                                const imgInParent = parentEl.querySelector('img');
                                if (imgInParent && imgInParent.src) {
                                    skinUrl = imgInParent.src;
                                    console.log("Found skin URL from parent:", skinUrl);
                                }
                            }

                            // Track the player
                            const isNewPlayer = !window.trackedPlayers[username.toLowerCase()];
                            if (trackPlayer(username, null, skinUrl)) {
                                if (isNewPlayer) {
                                    showAlert(`Tracking new player: ${username}`);
                                } else {
                                    showAlert(`Updated player: ${username}`);
                                }
                                return true;
                            }
                        }
                    }
                }

                // If still no username found, try any h2 elements
                const h2Elements = sweetAlert.querySelectorAll('h2');
                for (const h2 of h2Elements) {
                    // Look for a direct span containing the username
                    const spanInH2 = h2.querySelector('span');
                    if (spanInH2) {
                        const username = spanInH2.textContent.trim();
                        if (username) {
                            console.log("Found username from h2 > span:", username);

                            // Try to get skin image
                            let skinUrl = null;
                            const imgInH2 = h2.querySelector('img');
                            if (imgInH2 && imgInH2.src) {
                                skinUrl = imgInH2.src;
                                console.log("Found skin URL from h2:", skinUrl);
                            }

                            // Track the player
                            const isNewPlayer = !window.trackedPlayers[username.toLowerCase()];
                            if (trackPlayer(username, null, skinUrl)) {
                                if (isNewPlayer) {
                                    showAlert(`Tracking new player: ${username}`);
                                } else {
                                    showAlert(`Updated player: ${username}`);
                                }
                                return true;
                            }
                        }
                    } else {
                        // If no span, try the h2 text content directly
                        // Extract just the text (without img elements etc)
                        const fullText = getFullTextContent(h2);
                        const lines = fullText.split('\n')
                            .map(line => line.trim())
                            .filter(line => line.length > 0 && line.length < 20);

                        if (lines.length > 0) {
                            const username = lines[0];
                            console.log("Found username from h2 text:", username);

                            // Try to get skin image
                            let skinUrl = null;
                            const imgInH2 = h2.querySelector('img');
                            if (imgInH2 && imgInH2.src) {
                                skinUrl = imgInH2.src;
                                console.log("Found skin URL from h2:", skinUrl);
                            }

                            // Track the player
                            const isNewPlayer = !window.trackedPlayers[username.toLowerCase()];
                            if (trackPlayer(username, null, skinUrl)) {
                                if (isNewPlayer) {
                                    showAlert(`Tracking new player: ${username}`);
                                } else {
                                    showAlert(`Updated player: ${username}`);
                                }
                                return true;
                            }
                        }
                    }
                }

                // Last resort, try to find the DOM structure in the format provided in the example
                const allImages = sweetAlert.querySelectorAll('img');
                for (const img of allImages) {
                    if (img.src && img.src.includes('.png')) {
                        // Found a potential player image
                        let parentElement = img.parentElement;

                        // Look for a span near this image (sibling or child of parent)
                        let nearbySpans = parentElement.querySelectorAll('span');
                        if (nearbySpans.length > 0) {
                            for (const span of nearbySpans) {
                                const username = span.textContent.trim();
                                if (username && username.length > 1 && username.length < 20) {
                                    console.log("Found username from nearby span:", username);

                                    // Track the player
                                    const isNewPlayer = !window.trackedPlayers[username.toLowerCase()];
                                    if (trackPlayer(username, null, img.src)) {
                                        if (isNewPlayer) {
                                            showAlert(`Tracking new player: ${username}`);
                                        } else {
                                            showAlert(`Updated player: ${username}`);
                                        }
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.error("Error extracting player info from dialog:", e);
            }
        }

        return false;
    }



    // Helper function to directly check for any visible elements with player info
    function checkForVisiblePlayerInfo() {
    console.log("Checking for visible player info");

    try {
        // First try to find any visible sweet alert
        const visibleDialog = document.querySelector('.sweet-alert.showSweetAlert.visible');
        if (visibleDialog) {
            console.log("Found visible dialog:", visibleDialog.className);
            return checkForPlayerProfile();
        }

        // Look for contextPlayerName as a backup
        const playerNameElement = document.getElementById('contextPlayerName');
        if (playerNameElement && playerNameElement.offsetParent !== null) { // Check if visible
            const username = playerNameElement.textContent.trim();
            if (username) {
                console.log("Found visible username from contextPlayerName:", username);

                // Track the player
                if (trackPlayer(username)) {
                    showAlert(`Tracking player: ${username}`);
                    return true;
                }
            }
        }

        // Look for contextUserProfile
        const userProfile = document.getElementById('contextUserProfile');
        if (userProfile && userProfile.offsetParent !== null) { // Check if visible
            console.log("Found visible contextUserProfile");

            // Try to extract username from spans
            const spans = userProfile.querySelectorAll('span');
            if (spans.length > 0) {
                for (const span of spans) {
                    const text = span.textContent.trim();
                    if (text && text.length > 1 && text.length < 20) {
                        console.log("Found potential username from contextUserProfile span:", text);

                        // Check if this span is styled or prominent
                        const hasStyle = span.hasAttribute('style');
                        const isBold = getComputedStyle(span).fontWeight >= 600;

                        if (hasStyle || isBold) {
                            // This is likely the username
                            if (trackPlayer(text)) {
                                showAlert(`Tracking player: ${text}`);
                                return true;
                            }
                        }
                    }
                }
            }
        }

        // Look for leaderboard entries
        const leaderboard = document.querySelector('.leaderboard, #leaderboard');
        if (leaderboard) {
            const leaderboardPlayers = [];
            const playerElements = leaderboard.querySelectorAll('.player, .leaderboard-name, .name');

            playerElements.forEach(el => {
                const name = el.textContent.trim();
                if (name && name.length > 1 && name.length < 20) {
                    leaderboardPlayers.push(name);
                }
            });

            // Track all visible players silently (without notifications)
            let newPlayersCount = 0;

            for (const player of leaderboardPlayers) {
                // Track player but don't show alerts for each one
                const isNewPlayer = !window.trackedPlayers[player.toLowerCase()];
                if (trackPlayer(player)) {
                    if (isNewPlayer) {
                        newPlayersCount++;
                    }
                }
            }

            // Show single notification if multiple players added
            if (newPlayersCount > 0) {
                showAlert(`Tracked ${newPlayersCount} new player${newPlayersCount > 1 ? 's' : ''} from leaderboard`);
                return true;
            }
        }

        // Look for any visible sweet-alert with player info
        return checkForPlayerProfile();
    } catch (e) {
        console.error("Error in checkForVisiblePlayerInfo:", e);
        return false;
    }
}

    // Set up an interval to check for profiles
    const profileCheckInterval = setInterval(checkForVisiblePlayerInfo, 1000);

    // Global click handler to check for profile clicks
    document.addEventListener('click', function(e) {
        // Wait a short delay to let profile dialogs load
        setTimeout(checkForVisiblePlayerInfo, 200);
        setTimeout(checkForVisiblePlayerInfo, 500);
        setTimeout(checkForVisiblePlayerInfo, 1000);
    }, true);

    // Setup a mutation observer to watch for changes that might indicate a profile opening
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if any Sweet Alert dialogs were added
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList &&
                            (node.classList.contains('sweet-alert') ||
                             node.classList.contains('swal-title-gold') ||
                             node.id === 'contextUserProfile' ||
                             node.querySelector('#contextPlayerName'))) {

                            console.log("Mutation observer detected potential profile dialog");
                            setTimeout(checkForVisiblePlayerInfo, 100);
                            setTimeout(checkForVisiblePlayerInfo, 300);
                        }
                    }
                }
            }
        }
    });

    // Start observing the document body
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });

    // Add keyboard shortcut Alt+P to manually check for player profiles
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key.toLowerCase() === 'p') {
            console.log("Manual profile check triggered by keyboard shortcut");
            const found = checkForVisiblePlayerInfo();
            if (!found) {
                showAlert("No player profile detected", "rgba(255, 165, 0, 0.9)");
            }
        }
    });

    // Show a welcome message
    showAlert("Player tracker activated");

    console.log("Player tracker initialized");

    // Return the API for external use
    return {
        trackPlayer,
        getAllPlayers: () => Object.values(window.trackedPlayers),
        getPlayerByUsername: (username) => window.trackedPlayers[username.toLowerCase()] || null,
        searchPlayers: (term) => {
            term = term.toLowerCase();
            return Object.values(window.trackedPlayers).filter(player =>
                player.username.toLowerCase().includes(term) ||
                player.nicknames.some(nick => nick.toLowerCase().includes(term)) ||
                player.notes.toLowerCase().includes(term)
            );
        },
        checkForProfile: checkForVisiblePlayerInfo
    };
}


const styleEl = document.createElement('style');
styleEl.textContent += `
    .player-entry.enemy {
        background: rgba(255, 77, 77, 0.15);
        border-left: 3px solid #ff4d4d;
    }

    .toggle-enemy-btn:hover {
        background: rgba(255, 77, 77, 0.3);
    }

    /* Enemy alert notification */
    .enemy-alert {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        z-index: 100001;
        font-family: 'Segoe UI', Arial, sans-serif;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        animation: enemyAlertPulse 1.5s infinite;
    }

    @keyframes enemyAlertPulse {
        0%, 100% { box-shadow: 0 0 15px rgba(255, 0, 0, 0.8); }
        50% { box-shadow: 0 0 30px rgba(255, 0, 0, 0.5); }
    }
`;
document.head.appendChild(styleEl);

// Function to check for enemies in lobby
// Function to check for enemies in lobby
function checkForEnemies() {
    // First make sure trackedPlayers exists
    if (!window.trackedPlayers) {
        return false;
    }

    // Get visible player names in lobby/game (implementation depends on the game's UI)
    const visiblePlayerElements = document.querySelectorAll('.player-name, .leaderboard-name, .username');
    const visiblePlayers = [];

    visiblePlayerElements.forEach(el => {
        const name = el.textContent.trim();
        if (name && name.length > 1) {
            visiblePlayers.push(name.toLowerCase());
        }
    });

    if (visiblePlayers.length === 0) return false;

    // Check if any visible players are marked as enemies
    const enemies = [];

    for (const playerName of visiblePlayers) {
        const trackedPlayer = window.trackedPlayers[playerName];
        if (trackedPlayer && trackedPlayer.isEnemy) {
            enemies.push(trackedPlayer.username);
        }
    }

    // Alert if enemies found
    if (enemies.length > 0) {
        showEnemyAlert(enemies);
        return true;
    }

    return false;
}

// Function to display enemy alert
function showEnemyAlert(enemies) {
    // Remove existing alert if present
    const existingAlert = document.getElementById('enemy-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create alert element
    const alertEl = document.createElement('div');
    alertEl.id = 'enemy-alert';
    alertEl.className = 'enemy-alert';

    alertEl.innerHTML = `
        ⚠️ ENEMY DETECTED ⚠️
        <div style="font-size: 14px; margin-top: 5px;">
            ${enemies.join(', ')}
        </div>
        <div style="font-size: 12px; margin-top: 10px; opacity: 0.8;">
            (Click to dismiss)
        </div>
    `;

    // Add click event to dismiss
    alertEl.addEventListener('click', () => {
        alertEl.remove();
    });

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        if (document.body.contains(alertEl)) {
            alertEl.remove();
        }
    }, 5000);

    document.body.appendChild(alertEl);
}





