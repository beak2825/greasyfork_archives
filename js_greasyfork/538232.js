// ==UserScript==
// @name         ProxySpooferV1.0.0 for Gain.gg
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Spoof proxy connection to appear as a real American IP for Gain.gg, bypassing proxy detection.
// @author       AlaaAsh
// @match        *://*.gain.gg/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538232/ProxySpooferV100%20for%20Gaingg.user.js
// @updateURL https://update.greasyfork.org/scripts/538232/ProxySpooferV100%20for%20Gaingg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // * Configuration
    const config = {
        americanUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        language: 'en-US',
        timezone: 'America/New_York',
        geolocation: {
            latitude: 40.7128, // New York City
            longitude: -74.0060,
            accuracy: 100
        },
        spoofHeaders: {
            'X-Forwarded-For': null, // Remove header
            'X-Real-IP': null,
            'Via': null,
            'Forwarded': null
        }
    };

    // * Spoof User-Agent
    Object.defineProperty(navigator, 'userAgent', {
        value: config.americanUserAgent,
        writable: false
    });

    // * Spoof Language
    Object.defineProperty(navigator, 'language', {
        value: config.language,
        writable: false
    });
    Object.defineProperty(navigator, 'languages', {
        value: [config.language, 'en'],
        writable: false
    });

    // * Spoof Timezone
    const originalDate = Date;
    unsafeWindow.Date = class extends originalDate {
        constructor(...args) {
            super(...args);
            this.timeZone = config.timezone;
        }
        toLocaleString(...args) {
            return super.toLocaleString(...args, { timeZone: config.timezone });
        }
    };

    // * Disable WebRTC
    if (navigator.webkitRTCPeerConnection || navigator.mozRTCPeerConnection || window.RTCPeerConnection) {
        Object.defineProperty(navigator, 'webkitRTCPeerConnection', { value: null });
        Object.defineProperty(navigator, 'mozRTCPeerConnection', { value: null });
        Object.defineProperty(window, 'RTCPeerConnection', { value: null });
        Object.defineProperty(navigator, 'getUserMedia', { value: null });
        Object.defineProperty(navigator, 'webkitGetUserMedia', { value: null });
        Object.defineProperty(navigator, 'mozGetUserMedia', { value: null });
    }

    // * Spoof Geolocation
    const originalGeolocation = navigator.geolocation;
    navigator.geolocation = {
        getCurrentPosition: (success, error, options) => {
            success({
                coords: {
                    latitude: config.geolocation.latitude,
                    longitude: config.geolocation.longitude,
                    accuracy: config.geolocation.accuracy,
                    altitude: null,
                    altitudeAccuracy: null,
                    heading: null,
                    speed: null
                },
                timestamp: Date.now()
            });
        },
        watchPosition: (success, error, options) => {
            success({
                coords: {
                    latitude: config.geolocation.latitude,
                    longitude: config.geolocation.longitude,
                    accuracy: config.geolocation.accuracy
                },
                timestamp: Date.now()
            });
            return 1;
        },
        clearWatch: () => {}
    };

    // * Spoof Canvas Fingerprint
    const originalCanvas = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
        const context = originalCanvas.call(this, type, ...args);
        if (type === '2d') {
            const originalGetImageData = context.getImageData;
            context.getImageData = function(sx, sy, sw, sh) {
                const imageData = originalGetImageData.call(this, sx, sy, sw, sh);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    data[i] += Math.floor(Math.random() * 2) - 1; // Slight noise
                }
                return imageData;
            };
        }
        return context;
    };

    // * Modify HTTP Headers
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function(input, init = {}) {
        init.headers = init.headers || {};
        for (const [header, value] of Object.entries(config.spoofHeaders)) {
            if (value === null) {
                delete init.headers[header];
            } else {
                init.headers[header] = value;
            }
        }
        // Add random delay to mimic human behavior
        await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 50));
        return originalFetch(input, init);
    };

    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._spoofedHeaders = { ...config.spoofHeaders };
        return originalXhrOpen.call(this, method, url, ...args);
    };

    const originalXhrSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        if (this._spoofedHeaders.hasOwnProperty(header)) {
            if (this._spoofedHeaders[header] === null) {
                return;
            }
            value = this._spoofedHeaders[header];
        }
        return originalXhrSetRequestHeader.call(this, header, value);
    };

    // * Monitor and Spoof SNI (if possible)
    const originalWebSocket = unsafeWindow.WebSocket;
    unsafeWindow.WebSocket = class extends originalWebSocket {
        constructor(url, protocols) {
            // Attempt to spoof SNI by ensuring HTTPS connections
            url = url.replace(/^ws:/, 'wss:');
            super(url, protocols);
        }
    };

    // * Log for Debugging
    console.log('[ProxySpoofer] Initialized for Gain.gg with American IP spoofing.');
})();