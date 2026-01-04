// ==UserScript==
// @name        NextGenMobileView
// @namespace   http://tampermonkey.net/
// @version     3.0
// @description Intelligently forces mobile view with device profiles, adaptive redirection, and optimized performance
// @author      Jonathan Laurendeau
// @match       *://*/*
// @exclude     *://*.m.*/*
// @exclude     *://m.*/*
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/539700/NextGenMobileView.user.js
// @updateURL https://update.greasyfork.org/scripts/539700/NextGenMobileView.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Device profiles
    const devices = {
        iPhone14: {
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            platform: 'iPhone',
            vendor: 'Apple Computer, Inc.',
            width: 375,
            height: 812,
            touchPoints: 5
        },
        Pixel7: {
            userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.81 Mobile Safari/537.36',
            platform: 'Linux armv8l',
            vendor: 'Google Inc.',
            width: 412,
            height: 915,
            touchPoints: 5
        }
    };

    // Load user-selected device
    const selectedDevice = GM_getValue('device', 'iPhone14');

    // Spoof navigator and screen properties
    function spoofDevice(device) {
        Object.defineProperty(navigator, 'userAgent', {
            value: devices[device].userAgent,
            writable: false,
            configurable: false
        });
        Object.defineProperty(navigator, 'platform', {
            value: devices[device].platform,
            writable: false,
            configurable: false
        });
        Object.defineProperty(navigator, 'vendor', {
            value: devices[device].vendor,
            writable: false,
            configurable: false
        });
        Object.defineProperty(navigator, 'maxTouchPoints', {
            value: devices[device].touchPoints,
            writable: false,
            configurable: false
        });
        Object.defineProperty(window, 'screen', {
            get: function() {
                return {
                    width: devices[device].width,
                    height: devices[device].height,
                    availWidth: devices[device].width,
                    availHeight: devices[device].height,
                    colorDepth: 32,
                    pixelDepth: 32
                };
            },
            configurable: false
        });
        Object.defineProperty(window, 'innerWidth', {
            value: devices[device].width,
            writable: false,
            configurable: false
        });
        Object.defineProperty(window, 'innerHeight', {
            value: devices[device].height,
            writable: false,
            configurable: false
        });
        window.dispatchEvent(new Event('resize'));
    }

    // Check for existing mobile viewport
    function hasMobileViewport() {
        const meta = document.querySelector('meta[name="viewport"]');
        return meta && /width=device-width/.test(meta.content);
    }

    // Set adaptive viewport
    function setAdaptiveViewport() {
        if (!hasMobileViewport()) {
            let meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
            document.head.appendChild(meta);
        }
    }

    // Debounce utility
    function debounce(fn, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    }

    // Optimized MutationObserver
    const debouncedUpdate = debounce(() => {
        setAdaptiveViewport();
        document.querySelectorAll('[style*="min-width"], [style*="max-width"]').forEach(el => {
            el.style.minWidth = 'unset';
            el.style.maxWidth = `${devices[selectedDevice].width}px`;
        });
    }, 100);

    const observer = new MutationObserver(debouncedUpdate);
    observer.observe(document.head, { childList: true });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    // Configurable CSS
    GM_addStyle(`
        @media screen and (min-width: 768px) {
            html, body {
                max-width: ${devices[selectedDevice].width}px !important;
                margin: 0 auto !important;
                overflow-x: hidden !important;
            }
            .desktop-only, [class*="desktop"] {
                display: none !important;
            }
            .mobile-only, [class*="mobile"] {
                display: block !important;
            }
        }
    `);

    // Detect mobile URL
    async function detectMobileUrl(url) {
        if (typeof url !== 'string' || url.includes('m.') || url.includes('/mobile/')) return url;
        let mobileUrl = url.replace(/(https?:\/\/)([^\/]+)/, '$1m.$2');
        try {
            let response = await fetch(mobileUrl, { method: 'HEAD' });
            if (response.ok) return mobileUrl;
            mobileUrl = url + (url.includes('?') ? '&' : '?') + 'mobile=1';
            response = await fetch(mobileUrl, { method: 'HEAD' });
            if (response.ok) return mobileUrl;
        } catch (e) {
            console.log(`Mobile URL detection failed for ${mobileUrl}:`, e);
        }
        return url;
    }

    // Intercept fetch requests
    let originalFetch = window.fetch;
    window.fetch = async function(url, options = {}) {
        if (GM_getValue('disableRedirection', false)) return originalFetch(url, options);
        const mobileUrl = await detectMobileUrl(url);
        return originalFetch(mobileUrl, options);
    };

    // Intercept XHR requests
    let originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._url = url;
        if (GM_getValue('disableRedirection', false)) {
            return originalXHROpen.apply(this, [method, url, ...args]);
        }
        let mobileUrl = url;
        if (typeof url === 'string' && !url.includes('m.') && !url.includes('/mobile/')) {
            mobileUrl = url.replace(/(https?:\/\/)([^\/]+)/, '$1m.$2');
        }
        return originalXHROpen.apply(this, [method, mobileUrl, ...args]);
    };

    // Simulate touch support
    function simulateTouchSupport() {
        if (!('TouchEvent' in window)) {
            window.TouchEvent = function() {};
            Object.defineProperty(window, 'TouchEvent', {
                value: function() {
                    return { touches: [{ clientX: 0, clientY: 0 }], targetTouches: [], changedTouches: [] };
                },
                writable: false,
                configurable: false
            });
        }
        window.ontouchstart = window.ontouchstart || function() {};
        Object.defineProperty(window, 'ontouchstart', {
            value: function() {},
            writable: false,
            configurable: false
        });
    }

    // Menu commands
    GM_registerMenuCommand('Select Device', () => {
        const device = prompt('Enter device (iPhone14, Pixel7):', selectedDevice);
        if (devices[device]) {
            GM_setValue('device', device);
            location.reload();
        } else {
            alert('Invalid device. Available: iPhone14, Pixel7');
        }
    });

    GM_registerMenuCommand('Toggle URL Redirection', () => {
        const current = GM_getValue('disableRedirection', false);
        GM_setValue('disableRedirection', !current);
        alert(`URL Redirection: ${!current ? 'Disabled' : 'Enabled'}`);
        location.reload();
    });

    GM_registerMenuCommand('Create Custom Device', () => {
        const profile = prompt('Enter JSON: { "name": "Custom", "userAgent": "...", "platform": "...", "vendor": "...", "width": 360, "height": 640, "touchPoints": 5 }');
        try {
            const parsed = JSON.parse(profile);
            const profiles = GM_getValue('customProfiles', {});
            profiles[parsed.name] = parsed;
            GM_setValue('customProfiles', profiles);
            GM_setValue('device', parsed.name);
            location.reload();
        } catch (e) {
            alert('Invalid JSON');
        }
    });

    // Initialize
    if (document.contentType !== 'text/html') return;
    spoofDevice(selectedDevice);
    setAdaptiveViewport();
    simulateTouchSupport();
})();