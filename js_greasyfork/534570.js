// ==UserScript==
// @name         Anti-Fingerprinting Shield Plus
// @namespace    https://www.365devnet.eu/en/antifp/
// @version      5.3
// @description  Advanced browser fingerprint protection with realistic profiles and modern UI
// @author       Richard B
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534570/Anti-Fingerprinting%20Shield%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/534570/Anti-Fingerprinting%20Shield%20Plus.meta.js
// ==/UserScript==

// Toggle this to show/hide the floating UI menu and debug logs
const DEBUG = true;

(() => {
    const settingsKey = '__afs_user_settings';
    const positionKey = '__afs_ui_position';
    const profileKey = '__afs_current_profile';
    const profileExpiryKey = '__afs_profile_expiry';
    const enabledKey = '__afs_enabled';
    const PROFILE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

    const browserProfiles = [
        {
            id: 'Safari 16.5 - M1 Pro',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15',
            platform: 'MacIntel',
            language: 'en-US',
            screenWidth: 2560,
            screenHeight: 1440,
            cores: 8,
            memory: 16,
            timezone: 'America/New_York',
            webglVendor: 'Apple GPU',
            webglRenderer: 'Apple M1 Pro',
            colorDepth: 30,
            devicePixelRatio: 2,
            vendor: '',
            productSub: '20030107',
            appVersion: '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            chromeObject: false,
            safariObject: true,
            oscpu: undefined,
            buildID: undefined,
            connection: undefined,
            plugins: [],
            mimeTypes: []
        },
        {
            id: 'Chrome 120 - RTX 3080',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            platform: 'Win32',
            language: 'en-US',
            screenWidth: 1920,
            screenHeight: 1080,
            cores: 12,
            memory: 32,
            timezone: 'America/Los_Angeles',
            webglVendor: 'NVIDIA Corporation',
            webglRenderer: 'NVIDIA GeForce RTX 3080',
            colorDepth: 24,
            devicePixelRatio: 1,
            vendor: 'Google Inc.',
            productSub: '20030107',
            appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            appName: 'Netscape',
            doNotTrack: null,
            maxTouchPoints: 0,
            chromeObject: true,
            safariObject: false,
            oscpu: undefined,
            buildID: undefined,
            connection: { downlink: 10, effectiveType: '4g', rtt: 50, saveData: false },
            plugins: [
                { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
                { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '' },
                { name: 'Native Client', filename: 'internal-nacl-plugin', description: '' }
            ],
            mimeTypes: [
                { type: 'application/pdf', description: 'Portable Document Format', suffixes: 'pdf' },
                { type: 'application/x-nacl', description: 'Native Client Executable', suffixes: '' },
                { type: 'application/x-pnacl', description: 'Portable Native Client Executable', suffixes: '' }
            ]
        },
        {
            id: 'Firefox 115 - Intel UHD',
            userAgent: 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
            platform: 'Linux x86_64',
            language: 'en-US',
            screenWidth: 1920,
            screenHeight: 1080,
            cores: 6,
            memory: 16,
            timezone: 'Europe/London',
            webglVendor: 'Intel Inc.',
            webglRenderer: 'Intel(R) UHD Graphics 630',
            colorDepth: 24,
            devicePixelRatio: 1,
            vendor: '',
            productSub: '20100101',
            appVersion: '5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            chromeObject: false,
            safariObject: false,
            oscpu: 'Linux x86_64',
            buildID: '20240101000000',
            connection: undefined,
            plugins: [
                { name: 'Shockwave Flash', filename: 'libflashplayer.so', description: 'Shockwave Flash 32.0 r0' }
            ],
            mimeTypes: [
                { type: 'application/x-shockwave-flash', description: 'Shockwave Flash', suffixes: 'swf' }
            ]
        },
        {
            id: 'Chrome 120 - M1 Max',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            platform: 'MacIntel',
            language: 'en-US',
            screenWidth: 2880,
            screenHeight: 1800,
            cores: 10,
            memory: 32,
            timezone: 'America/Chicago',
            webglVendor: 'Apple GPU',
            webglRenderer: 'Apple M1 Max',
            colorDepth: 30,
            devicePixelRatio: 2,
            vendor: 'Google Inc.',
            productSub: '20030107',
            appVersion: '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            chromeObject: true
        },
        {
            id: 'Edge 120 - RX 6800',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
            platform: 'Win32',
            language: 'en-US',
            screenWidth: 2560,
            screenHeight: 1440,
            cores: 16,
            memory: 64,
            timezone: 'America/New_York',
            webglVendor: 'AMD',
            webglRenderer: 'AMD Radeon RX 6800 XT',
            colorDepth: 24,
            devicePixelRatio: 1.5,
            vendor: 'Google Inc.',
            productSub: '20030107',
            appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            chromeObject: true
        },
        {
            id: 'Safari 16.4 - M2',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15',
            platform: 'MacIntel',
            language: 'en-GB',
            screenWidth: 2560,
            screenHeight: 1600,
            cores: 6,
            memory: 16,
            timezone: 'Europe/London',
            webglVendor: 'Apple GPU',
            webglRenderer: 'Apple M2',
            colorDepth: 30,
            devicePixelRatio: 2,
            vendor: '',
            productSub: '20030107',
            appVersion: '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            chromeObject: false
        },
        {
            id: 'Chrome 119 - Intel UHD 620',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            platform: 'Win32',
            language: 'en-US',
            screenWidth: 1366,
            screenHeight: 768,
            cores: 4,
            memory: 8,
            timezone: 'America/Chicago',
            webglVendor: 'Intel Inc.',
            webglRenderer: 'Intel(R) UHD Graphics 620',
            colorDepth: 24,
            devicePixelRatio: 1,
            vendor: '',
            productSub: '20030107',
            appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            chromeObject: false
        },
        {
            id: 'Firefox 115 - GTX 1660',
            userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
            platform: 'Linux x86_64',
            language: 'en-US',
            screenWidth: 2560,
            screenHeight: 1440,
            cores: 8,
            memory: 32,
            timezone: 'Europe/Paris',
            webglVendor: 'NVIDIA Corporation',
            webglRenderer: 'NVIDIA GeForce GTX 1660 Ti',
            colorDepth: 24,
            devicePixelRatio: 1,
            vendor: '',
            productSub: '20030107',
            appVersion: '5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            chromeObject: false
        },
        {
            id: 'Chrome 119 - M1',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            platform: 'MacIntel',
            language: 'en-US',
            screenWidth: 2560,
            screenHeight: 1440,
            cores: 8,
            memory: 16,
            timezone: 'America/Denver',
            webglVendor: 'Apple GPU',
            webglRenderer: 'Apple M1',
            colorDepth: 30,
            devicePixelRatio: 2,
            vendor: 'Google Inc.',
            productSub: '20030107',
            appVersion: '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            chromeObject: true
        },
        {
            id: 'Edge 119 - RTX 3060',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
            platform: 'Win32',
            language: 'en-US',
            screenWidth: 1920,
            screenHeight: 1080,
            cores: 8,
            memory: 16,
            timezone: 'America/Phoenix',
            webglVendor: 'NVIDIA Corporation',
            webglRenderer: 'NVIDIA GeForce RTX 3060',
            colorDepth: 24,
            devicePixelRatio: 1,
            vendor: 'Google Inc.',
            productSub: '20030107',
            appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            chromeObject: true
        },
        {
            id: 'Safari 16.3 - M1 Pro',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15',
            platform: 'MacIntel',
            language: 'en-US',
            screenWidth: 2880,
            screenHeight: 1800,
            cores: 10,
            memory: 32,
            timezone: 'America/Los_Angeles',
            webglVendor: 'Apple GPU',
            webglRenderer: 'Apple M1 Pro',
            colorDepth: 30,
            devicePixelRatio: 2,
            vendor: '',
            productSub: '20030107',
            appVersion: '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            chromeObject: false
        },
        {
            id: 'Chrome 118 - RX 6700',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
            platform: 'Win32',
            language: 'en-US',
            screenWidth: 2560,
            screenHeight: 1440,
            cores: 12,
            memory: 32,
            timezone: 'America/New_York',
            webglVendor: 'AMD',
            webglRenderer: 'AMD Radeon RX 6700 XT',
            colorDepth: 24,
            devicePixelRatio: 1.5,
            vendor: '',
            productSub: '20030107',
            appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            chromeObject: false
        },
        {
            id: 'Firefox 114 - Iris Xe',
            userAgent: 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/114.0',
            platform: 'Linux x86_64',
            language: 'en-US',
            screenWidth: 1920,
            screenHeight: 1080,
            cores: 6,
            memory: 16,
            timezone: 'Europe/Berlin',
            webglVendor: 'Intel Inc.',
            webglRenderer: 'Intel(R) Iris(R) Xe Graphics',
            colorDepth: 24,
            devicePixelRatio: 1,
            vendor: '',
            productSub: '20100101',
            appVersion: '5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/114.0',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            chromeObject: false
        },
        {
            id: 'Chrome 118 - M2',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
            platform: 'MacIntel',
            language: 'en-US',
            screenWidth: 2560,
            screenHeight: 1440,
            cores: 8,
            memory: 16,
            timezone: 'America/Chicago',
            webglVendor: 'Apple GPU',
            webglRenderer: 'Apple M2',
            colorDepth: 30,
            devicePixelRatio: 2,
            vendor: 'Google Inc.',
            productSub: '20030107',
            appVersion: '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            chromeObject: true
        },
        {
            id: 'Edge 118 - GTX 1660S',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.0.0',
            platform: 'Win32',
            language: 'en-US',
            screenWidth: 1920,
            screenHeight: 1080,
            cores: 8,
            memory: 16,
            timezone: 'America/Denver',
            webglVendor: 'NVIDIA Corporation',
            webglRenderer: 'NVIDIA GeForce GTX 1660 SUPER',
            colorDepth: 24,
            devicePixelRatio: 1,
            vendor: 'Google Inc.',
            productSub: '20030107',
            appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.0.0',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            chromeObject: true
        },
        {
            id: 'Safari 16.2 - M1',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15',
            platform: 'MacIntel',
            language: 'en-US',
            screenWidth: 2560,
            screenHeight: 1440,
            cores: 8,
            memory: 16,
            timezone: 'America/New_York',
            webglVendor: 'Apple GPU',
            webglRenderer: 'Apple M1',
            colorDepth: 30,
            devicePixelRatio: 2,
            vendor: '',
            productSub: '20030107',
            appVersion: '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            chromeObject: false
        },
        {
            id: 'Chrome 117 - Intel UHD 630',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
            platform: 'Win32',
            language: 'en-US',
            screenWidth: 1366,
            screenHeight: 768,
            cores: 4,
            memory: 8,
            timezone: 'America/Los_Angeles',
            webglVendor: 'Intel Inc.',
            webglRenderer: 'Intel(R) UHD Graphics 630',
            colorDepth: 24,
            devicePixelRatio: 1,
            vendor: '',
            productSub: '20030107',
            appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            chromeObject: false
        },
        {
            id: 'Firefox 113 - RTX 3070',
            userAgent: 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/113.0',
            platform: 'Linux x86_64',
            language: 'en-US',
            screenWidth: 2560,
            screenHeight: 1440,
            cores: 8,
            memory: 32,
            timezone: 'Europe/London',
            webglVendor: 'NVIDIA Corporation',
            webglRenderer: 'NVIDIA GeForce RTX 3070',
            colorDepth: 24,
            devicePixelRatio: 1,
            vendor: '',
            productSub: '20030107',
            appVersion: '5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/113.0',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            chromeObject: false
        },
        {
            id: 'Chrome 117 - M1 Max',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
            platform: 'MacIntel',
            language: 'en-US',
            screenWidth: 2880,
            screenHeight: 1800,
            cores: 10,
            memory: 32,
            timezone: 'America/Chicago',
            webglVendor: 'Apple GPU',
            webglRenderer: 'Apple M1 Max',
            colorDepth: 30,
            devicePixelRatio: 2,
            vendor: 'Google Inc.',
            productSub: '20030107',
            appVersion: '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            chromeObject: true
        },
        {
            id: 'Edge 117 - RX 6600',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.0.0',
            platform: 'Win32',
            language: 'en-US',
            screenWidth: 1920,
            screenHeight: 1080,
            cores: 8,
            memory: 16,
            timezone: 'America/New_York',
            webglVendor: 'AMD',
            webglRenderer: 'AMD Radeon RX 6600 XT',
            colorDepth: 24,
            devicePixelRatio: 1,
            vendor: 'Google Inc.',
            productSub: '20030107',
            appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.0.0',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            chromeObject: true
        }
    ];

    const spoofDefaults = {
        userAgent: true,
        platform: true,
        language: true,
        screen: true,
        hardwareConcurrency: true,
        timezone: true,
        canvas: true,
        webgl: true,
        audio: true,
        plugins: true,
        mediaDevices: true,
        storageEstimate: true,
        matchMedia: true,
        sharedArrayBuffer: true
    };

    const spoofSettings = loadSettings();
    const currentProfile = getCurrentProfile();
    const isEnabled = localStorage.getItem(enabledKey) !== 'false'; // Default to enabled

    // Store the original matchMedia before spoofing
    const realMatchMedia = window.matchMedia ? window.matchMedia.bind(window) : null;

    function log(...args) {
        if (DEBUG) console.log('[AFS+]', ...args);
    }

    function loadSettings() {
        const saved = localStorage.getItem(settingsKey);
        return saved ? JSON.parse(saved) : { ...spoofDefaults };
    }

    function saveSettings(settings) {
        localStorage.setItem(settingsKey, JSON.stringify(settings));
    }

    function getCurrentProfile() {
        const now = Date.now();
        const expiry = parseInt(localStorage.getItem(profileExpiryKey) || '0');
        
        if (now > expiry) {
            const newProfile = browserProfiles[Math.floor(Math.random() * browserProfiles.length)];
            localStorage.setItem(profileKey, JSON.stringify(newProfile));
            localStorage.setItem(profileExpiryKey, (now + PROFILE_DURATION_MS).toString());
            return newProfile;
        }
        
        return JSON.parse(localStorage.getItem(profileKey));
    }

    function spoof(obj, prop, valueFn) {
        try {
            Object.defineProperty(obj, prop, {
                get: valueFn,
                configurable: true
            });
        } catch (e) {
            log('Spoof failed:', prop, e);
        }
    }

    // Browser detection
    function detectBrowser() {
        const ua = navigator.userAgent;
        if (/firefox/i.test(ua)) return 'firefox';
        if (/edg/i.test(ua)) return 'edge';
        if (/chrome/i.test(ua)) return 'chrome';
        if (/safari/i.test(ua)) return 'safari';
        return 'other';
    }
    const detectedBrowser = detectBrowser();

    // Apply profile-based spoofing only if enabled
    if (isEnabled) {
        // Always spoof these
        if (spoofSettings.userAgent) spoof(navigator, 'userAgent', () => currentProfile.userAgent);
        if (spoofSettings.platform) spoof(navigator, 'platform', () => currentProfile.platform);
        if (spoofSettings.language) {
            spoof(navigator, 'language', () => currentProfile.language);
            spoof(navigator, 'languages', () => [currentProfile.language, 'en']);
        }
        if (spoofSettings.screen) {
            spoof(window.screen, 'width', () => currentProfile.screenWidth);
            spoof(window.screen, 'height', () => currentProfile.screenHeight);
            spoof(window.screen, 'colorDepth', () => currentProfile.colorDepth);
            spoof(window, 'devicePixelRatio', () => currentProfile.devicePixelRatio);
            spoof(window.screen, 'availWidth', () => currentProfile.screenWidth);
            spoof(window.screen, 'availHeight', () => currentProfile.screenHeight);
            spoof(window, 'outerWidth', () => currentProfile.screenWidth);
            spoof(window, 'outerHeight', () => currentProfile.screenHeight);
            spoof(window, 'innerWidth', () => currentProfile.screenWidth);
            spoof(window, 'innerHeight', () => currentProfile.screenHeight);
        }
        if (spoofSettings.hardwareConcurrency) {
            spoof(navigator, 'hardwareConcurrency', () => currentProfile.cores);
            spoof(navigator, 'deviceMemory', () => currentProfile.memory);
        }
        if (spoofSettings.timezone && typeof Intl !== 'undefined') {
            const orig = Intl.DateTimeFormat.prototype.resolvedOptions;
            Intl.DateTimeFormat.prototype.resolvedOptions = function () {
                const options = orig.call(this);
                options.timeZone = currentProfile.timezone;
                return options;
            };
        }

        // Chromium (Chrome/Edge/Brave/Opera)
        if (["chrome", "edge"].includes(detectedBrowser)) {
            spoof(navigator, 'vendor', () => currentProfile.vendor);
            spoof(navigator, 'productSub', () => currentProfile.productSub);
            spoof(navigator, 'appVersion', () => currentProfile.appVersion);
            spoof(navigator, 'appName', () => currentProfile.appName);
            spoof(navigator, 'doNotTrack', () => currentProfile.doNotTrack);
            spoof(navigator, 'maxTouchPoints', () => currentProfile.maxTouchPoints);
            spoof(navigator, 'webdriver', () => undefined);
            // window.chrome spoofing
            if (currentProfile.chromeObject) {
                if (!window.chrome) {
                    Object.defineProperty(window, 'chrome', {
                        value: {},
                        configurable: true
                    });
                }
            } else {
                if (window.chrome) {
                    try {
                        delete window.chrome;
                    } catch (e) {
                        window.chrome = undefined;
                    }
                }
            }
            // Connection spoofing
            if ('connection' in navigator && currentProfile.connection) {
                spoof(navigator, 'connection', () => currentProfile.connection);
            }
            // Plugins and mimeTypes spoofing
            if ('plugins' in navigator && currentProfile.plugins) {
                spoof(navigator, 'plugins', () => currentProfile.plugins);
            }
            if ('mimeTypes' in navigator && currentProfile.mimeTypes) {
                spoof(navigator, 'mimeTypes', () => currentProfile.mimeTypes);
            }
        }

        // Firefox
        if (detectedBrowser === 'firefox') {
            spoof(navigator, 'productSub', () => currentProfile.productSub);
            spoof(navigator, 'appVersion', () => currentProfile.appVersion);
            spoof(navigator, 'appName', () => currentProfile.appName);
            spoof(navigator, 'doNotTrack', () => currentProfile.doNotTrack);
            spoof(navigator, 'maxTouchPoints', () => currentProfile.maxTouchPoints);
            spoof(navigator, 'webdriver', () => undefined);
            // Firefox-specific
            if ('oscpu' in navigator && currentProfile.oscpu) {
                spoof(navigator, 'oscpu', () => currentProfile.oscpu);
            }
            if ('buildID' in navigator && currentProfile.buildID) {
                spoof(navigator, 'buildID', () => currentProfile.buildID);
            }
            if ('plugins' in navigator && currentProfile.plugins) {
                spoof(navigator, 'plugins', () => currentProfile.plugins);
            }
            if ('mimeTypes' in navigator && currentProfile.mimeTypes) {
                spoof(navigator, 'mimeTypes', () => currentProfile.mimeTypes);
            }
        }

        // Safari
        if (detectedBrowser === 'safari') {
            spoof(navigator, 'productSub', () => currentProfile.productSub);
            spoof(navigator, 'appVersion', () => currentProfile.appVersion);
            spoof(navigator, 'appName', () => currentProfile.appName);
            spoof(navigator, 'doNotTrack', () => currentProfile.doNotTrack);
            spoof(navigator, 'maxTouchPoints', () => currentProfile.maxTouchPoints);
            spoof(navigator, 'webdriver', () => undefined);
            // window.safari spoofing (optional)
            if (currentProfile.safariObject && !window.safari) {
                Object.defineProperty(window, 'safari', {
                    value: {},
                    configurable: true
                });
            }
        }

        // WebGL extensions spoofing (block or randomize)
        if (spoofSettings.webgl && WebGLRenderingContext) {
            const originalGL = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function (param) {
                const spoofMap = {
                    37445: currentProfile.webglVendor,
                    37446: currentProfile.webglRenderer,
                    3379: 4096,
                    35661: 8
                };
                return spoofMap[param] || originalGL.call(this, param);
            };
            // Block or randomize supported extensions
            if (WebGLRenderingContext.prototype.getSupportedExtensions) {
                WebGLRenderingContext.prototype.getSupportedExtensions = function () {
                    // Return a realistic but randomized subset
                    return [
                        'OES_texture_float',
                        'OES_element_index_uint',
                        'WEBGL_debug_renderer_info',
                        'OES_standard_derivatives'
                    ].sort(() => Math.random() - 0.5);
                };
            }
        }

        // Block or randomize Battery API
        if ('getBattery' in navigator) {
            navigator.getBattery = () => Promise.resolve({
                charging: true,
                chargingTime: 0,
                dischargingTime: Infinity,
                level: 1.0,
                onchargingchange: null,
                onchargingtimechange: null,
                ondischargingtimechange: null,
                onlevelchange: null
            });
        }

        // Block or randomize SpeechSynthesis API
        if ('speechSynthesis' in window) {
            window.speechSynthesis.getVoices = () => [
                { voiceURI: 'Google US English', name: 'Google US English', lang: 'en-US', localService: true, default: true }
            ];
        }

        // Block or randomize Permissions API
        if ('permissions' in navigator) {
            const origQuery = navigator.permissions.query;
            navigator.permissions.query = function (desc) {
                return Promise.resolve({ state: 'granted' });
            };
        }

        // Block or randomize Notification API
        if ('Notification' in window) {
            Object.defineProperty(window.Notification, 'permission', {
                get: () => 'default',
                configurable: true
            });
        }

        // Block or randomize font enumeration
        if ('fonts' in document) {
            document.fonts.forEach = () => [];
        }

        // Touch events spoofing
        if ('ontouchstart' in window) {
            window.ontouchstart = null;
            window.ontouchend = null;
            window.ontouchmove = null;
            window.ontouchcancel = null;
        }

        if (spoofSettings.canvas && CanvasRenderingContext2D) {
            const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
            CanvasRenderingContext2D.prototype.getImageData = function (x, y, w, h) {
                const data = originalGetImageData.call(this, x, y, w, h);
                for (let i = 0; i < data.data.length; i += 4) {
                    data.data[i] += Math.floor(Math.random() * 3);
                    data.data[i + 1] += Math.floor(Math.random() * 3);
                    data.data[i + 2] += Math.floor(Math.random() * 3);
                }
                return data;
            };
        }

        if (spoofSettings.audio && window.AudioContext) {
            const ctx = window.AudioContext.prototype;
            spoof(ctx, 'sampleRate', () => 44100);
            if (AnalyserNode.prototype.getFloatFrequencyData) {
                const original = AnalyserNode.prototype.getFloatFrequencyData;
                AnalyserNode.prototype.getFloatFrequencyData = function (arr) {
                    original.call(this, arr);
                    for (let i = 0; i < arr.length; i++) {
                        arr[i] += Math.random() * 0.1;
                    }
                };
            }
        }

        if (spoofSettings.mediaDevices) {
            spoof(navigator, 'mediaDevices', () => ({
                enumerateDevices: () => Promise.resolve([])
            }));
        }

        if (spoofSettings.storageEstimate) {
            navigator.storage.estimate = () => Promise.resolve({
                usage: 5242880,
                quota: 1073741824
            });
        }

        if (spoofSettings.matchMedia) {
            const originalMatchMedia = window.matchMedia;
            window.matchMedia = function (query) {
                if (query.includes('color-scheme') || query.includes('forced-colors')) {
                    return { matches: Math.random() > 0.5, media: query };
                }
                return originalMatchMedia.call(this, query);
            };
        }

        if (spoofSettings.sharedArrayBuffer) {
            spoof(window, 'SharedArrayBuffer', () => undefined);
        }
    }

    function createUI() {
        if (!DEBUG) return;

        // Platform detection (outer scope for UI and color scheme)
        const actualPlatform = Object.getOwnPropertyDescriptor(Navigator.prototype, 'platform')?.get?.call(navigator) || navigator.platform;
        const isM1Mac = actualPlatform === 'MacIntel' &&
            (navigator.userAgent.includes('Apple M1') ||
             navigator.userAgent.includes('Apple M2') ||
             navigator.userAgent.includes('Apple M3'));
        const isMac = actualPlatform.includes('Mac');
        const isWindows = actualPlatform.includes('Win');
        const isLinux = actualPlatform.includes('Linux');
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        // Improved locale detection using system regional settings
        function getUserLocale() {
            // Try to get the system's regional format
            let locale;
            
            // First try to get the most specific locale
            if (navigator.languages && navigator.languages.length > 0) {
                locale = navigator.languages[0];
            } else if (navigator.language) {
                locale = navigator.language;
            } else if (navigator.userLanguage) {
                locale = navigator.userLanguage;
            } else if (navigator.browserLanguage) {
                locale = navigator.browserLanguage;
            } else {
                locale = 'en-US';
            }

            // Get the system's date format
            const testDate = new Date();
            const systemFormat = new Intl.DateTimeFormat(undefined, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            });

            const systemLocale = systemFormat.resolvedOptions().locale;
            const systemOptions = systemFormat.resolvedOptions();
            
            log('Locale detection:', {
                browserLocale: locale,
                systemLocale: systemLocale,
                systemFormat: systemFormat.format(testDate),
                systemOptions: systemOptions
            });
            
            // Prefer system locale over browser locale
            return {
                locale: systemLocale || locale,
                hour12: systemOptions.hour12
            };
        }

        const { locale: userLocale, hour12 } = getUserLocale();
        
        // Create date formatter with user's locale
        const dateFormatter = new Intl.DateTimeFormat(userLocale, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: hour12 // Use system preference for 12/24 hour format
        });

        // Add style for select dropdown for dark mode
        const style = document.createElement('style');
        style.textContent = `
            .afs-select-dark {
                background: #23272f !important;
                color: #f3f3f3 !important;
                border: 1px solid #444 !important;
            }
            .afs-select-light {
                background: #f8f9fa !important;
                color: #222 !important;
                border: 1px solid #ddd !important;
            }
        `;
        document.head.appendChild(style);

        // Log the date format for debugging
        const testDate = new Date();
        log('Date formatting:', {
            locale: userLocale,
            formatted: dateFormatter.format(testDate),
            options: dateFormatter.resolvedOptions()
        });

        // Improved color scheme detection for all platforms
        function getColorScheme() {
            // Try multiple methods to detect dark mode
            let isDark = false;
            // Use the real, unspoofed matchMedia for color scheme detection
            if (realMatchMedia) {
                const darkModeQuery = realMatchMedia('(prefers-color-scheme: dark)');
                isDark = darkModeQuery.matches;
                window.__afs_darkModeQuery = darkModeQuery;
                log('Initial dark mode query (real):', {
                    matches: darkModeQuery.matches,
                    media: darkModeQuery.media
                });
            }
            // Fallbacks (should rarely be needed)
            if (!isDark && window.getComputedStyle) {
                const root = document.documentElement;
                const computedStyle = window.getComputedStyle(root);
                const colorScheme = computedStyle.getPropertyValue('color-scheme');
                if (colorScheme.includes('dark')) {
                    isDark = true;
                    log('Dark mode detected via CSS custom property');
                }
            }
            if (!isDark && (isMac || isM1Mac)) {
                try {
                    const macDarkMode = realMatchMedia ? realMatchMedia('(prefers-color-scheme: dark)').matches : false;
                    if (macDarkMode) {
                        isDark = true;
                        log('Dark mode detected via macOS specific check');
                    }
                } catch (e) {
                    log('macOS dark mode detection failed:', e);
                }
            }
            log('Color scheme detection:', {
                actualPlatform: actualPlatform,
                isM1Mac: isM1Mac,
                isMac: isMac,
                isWindows: isWindows,
                isLinux: isLinux,
                isMobile: isMobile,
                prefersDark: isDark,
                methods: {
                    matchMedia: realMatchMedia ? 'available' : 'unavailable',
                    computedStyle: window.getComputedStyle ? 'available' : 'unavailable'
                }
            });
            return isDark;
        }

        // Initial color scheme
        let prefersDark = getColorScheme();
        
        // Update color scheme when system preference changes
        if (realMatchMedia) {
            const darkModeMediaQuery = realMatchMedia('(prefers-color-scheme: dark)');
            log('Media query state (real):', {
                matches: darkModeMediaQuery.matches,
                media: darkModeMediaQuery.media,
                actualPlatform: Object.getOwnPropertyDescriptor(Navigator.prototype, 'platform')?.get?.call(navigator) || navigator.platform
            });
            function updateColorSchemeFromEvent(e) {
                log('Color scheme changed:', {
                    matches: e.matches,
                    actualPlatform: Object.getOwnPropertyDescriptor(Navigator.prototype, 'platform')?.get?.call(navigator) || navigator.platform
                });
                prefersDark = e.matches;
                updateColorScheme();
            }
            if (darkModeMediaQuery.addEventListener) {
                darkModeMediaQuery.addEventListener('change', updateColorSchemeFromEvent);
            } else if (darkModeMediaQuery.addListener) {
                darkModeMediaQuery.addListener(updateColorSchemeFromEvent);
            } else {
                darkModeMediaQuery.onchange = updateColorSchemeFromEvent;
            }
        }

        // Color scheme variables - Update these based on the initial detection
        const menuBg = prefersDark ? '#23272f' : '#ffffff';
        const menuText = prefersDark ? '#f3f3f3' : '#333';
        const iconBg = prefersDark ? '#23272f' : '#ffffff';
        const iconBorder = prefersDark ? '1px solid #444' : 'none';
        const iconShadow = prefersDark ? '0 2px 8px rgba(0,0,0,0.7)' : '0 2px 8px rgba(0,0,0,0.15)';
        const iconSvgColor = prefersDark ? '#f3f3f3' : '#222';

        const showIconKey = '__afs_show_icon';
        let showIcon = localStorage.getItem(showIconKey);
        if (showIcon === null) showIcon = 'true';
        showIcon = showIcon === 'true';

        const savedPos = JSON.parse(localStorage.getItem(positionKey) || '{"top":10,"left":10}');
        
        // Create modern UI container
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: ${savedPos.top}px;
            left: ${savedPos.left}px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        `;

        // Function to update color scheme
        function updateColorScheme() {
            const newMenuBg = prefersDark ? '#23272f' : '#ffffff';
            const newMenuText = prefersDark ? '#f3f3f3' : '#333';
            const newIconBg = prefersDark ? '#23272f' : '#ffffff';
            const newIconBorder = prefersDark ? '1px solid #444' : 'none';
            const newIconShadow = prefersDark ? '0 2px 8px rgba(0,0,0,0.7)' : '0 2px 8px rgba(0,0,0,0.15)';
            const newIconSvgColor = prefersDark ? '#f3f3f3' : '#222';

            log('Updating color scheme:', {
                prefersDark: prefersDark,
                newMenuBg: newMenuBg,
                newMenuText: newMenuText
            });

            // Update panel styles
            if (panel) {
                panel.style.background = newMenuBg;
                panel.style.color = newMenuText;
            }

            // Update icon styles
            if (icon) {
                icon.style.background = newIconBg;
                icon.style.border = newIconBorder;
                icon.style.boxShadow = newIconShadow;
                if (icon.querySelector('svg')) {
                    icon.querySelector('svg').style.color = newIconSvgColor;
                }
            }

            // Update advanced table styles
            if (advancedTable) {
                advancedTable.style.background = prefersDark ? '#1a1d23' : '#f8f9fa';
            }

            // Update dropdown style
            if (profileSelect) {
                profileSelect.className = prefersDark ? 'afs-select-dark' : 'afs-select-light';
            }

            // Update info text colors
            if (platformInfo) platformInfo.style.color = prefersDark ? '#bfc4cc' : '#555';
            if (profileInfo) profileInfo.style.color = prefersDark ? '#bfc4cc' : '#666';
        }

        // Create modern gear icon
        const icon = document.createElement('div');
        icon.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:${iconSvgColor}">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
        `;
        icon.style.cssText = `
            cursor: move;
            padding: 8px;
            background: ${iconBg};
            border-radius: 50%;
            border: ${iconBorder};
            box-shadow: ${iconShadow};
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        icon.querySelector('svg').style.color = iconSvgColor;

        icon.addEventListener('mouseover', () => {
            icon.style.transform = 'scale(1.1)';
            icon.style.boxShadow = prefersDark ? '0 4px 12px rgba(0,0,0,0.9)' : '0 4px 12px rgba(0,0,0,0.2)';
        });
        icon.addEventListener('mouseout', () => {
            icon.style.transform = 'scale(1)';
            icon.style.boxShadow = iconShadow;
        });

        // Hide icon in fullscreen
        function updateIconVisibility() {
            const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
            icon.style.display = (showIcon && !isFullscreen) ? 'flex' : 'none';
        }
        document.addEventListener('fullscreenchange', updateIconVisibility);
        document.addEventListener('webkitfullscreenchange', updateIconVisibility);
        document.addEventListener('mozfullscreenchange', updateIconVisibility);
        document.addEventListener('MSFullscreenChange', updateIconVisibility);

        // Initial icon visibility
        updateIconVisibility();

        // Create modern panel
        const panel = document.createElement('div');
        panel.style.cssText = `
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            margin-top: 8px;
            background: ${menuBg};
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.15);
            padding: 16px;
            min-width: 280px;
            color: ${menuText};
        `;

        // Add status section
        const statusSection = document.createElement('div');
        statusSection.style.cssText = `
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid #eee;
        `;

        // Activation switch at the top
        const statusHeader = document.createElement('div');
        statusHeader.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
        `;

        const statusTitle = document.createElement('h3');
        statusTitle.style.cssText = `
            margin: 0;
            font-size: 16px;
            color: ${isEnabled ? '#28a745' : '#dc3545'};
        `;
        statusTitle.textContent = isEnabled ? 'Protection Active' : 'Protection Disabled';

        const toggleSwitch = document.createElement('label');
        toggleSwitch.style.cssText = `
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
        `;

        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.checked = isEnabled;
        toggleInput.style.cssText = `
            opacity: 0;
            width: 0;
            height: 0;
        `;

        const toggleSlider = document.createElement('span');
        toggleSlider.style.cssText = `
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: ${isEnabled ? '#28a745' : '#dc3545'};
            transition: background-color 0.4s;
            border-radius: 24px;
        `;

        const toggleSliderCircle = document.createElement('span');
        toggleSliderCircle.style.cssText = `
            position: absolute;
            height: 18px;
            width: 18px;
            left: ${isEnabled ? '23px' : '3px'};
            bottom: 3px;
            background-color: white;
            transition: left 0.4s;
            border-radius: 50%;
            box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        `;

        toggleSwitch.appendChild(toggleInput);
        toggleSwitch.appendChild(toggleSlider);
        toggleSlider.appendChild(toggleSliderCircle);

        statusHeader.appendChild(statusTitle);
        statusHeader.appendChild(toggleSwitch);
        statusSection.appendChild(statusHeader);

        // Detected header and info (combined browser and platform)
        const detectedHeader = document.createElement('div');
        detectedHeader.style.cssText = `
            font-size: 16px;
            color: newMenuText;
            font-weight: bold;
            margin-bottom: 2px;
        `;
        detectedHeader.textContent = 'Detected';
        statusSection.appendChild(detectedHeader);

        const detectedInfo = document.createElement('div');
        detectedInfo.style.cssText = `
            font-size: 13px;
            color: newMenuText;
            margin-bottom: 8px;
        `;
        let platformLabel = 'Unknown';
        if (isWindows) platformLabel = 'Windows';
        else if (isM1Mac) platformLabel = 'Mac M1/M2/M3';
        else if (isMac) platformLabel = 'MacIntel';
        else if (isLinux) platformLabel = 'Linux';
        detectedInfo.textContent = `${detectedBrowser.charAt(0).toUpperCase() + detectedBrowser.slice(1)} (${platformLabel}, ${actualPlatform})`;
        statusSection.appendChild(detectedInfo);

        // Unsupported browser notification
        if (!['chrome', 'edge', 'firefox', 'safari'].includes(detectedBrowser)) {
            const unsupported = document.createElement('div');
            unsupported.style.cssText = `
                font-size: 13px;
                color: #dc3545;
                margin-bottom: 8px;
            `;
            unsupported.textContent = 'Warning: This browser is not officially supported. Spoofing may be incomplete.';
            statusSection.appendChild(unsupported);
        }

        if (!isEnabled) {
            const disabledMessage = document.createElement('div');
            disabledMessage.style.cssText = `
                font-size: 13px;
                color: #dc3545;
                margin-top: 8px;
            `;
            disabledMessage.textContent = 'Your browser fingerprint is currently exposed. Enable protection to start spoofing.';
            statusSection.appendChild(disabledMessage);
        }

        // Advanced section (expandable)
        const advancedToggle = document.createElement('div');
        advancedToggle.style.cssText = `
            font-size: 13px;
            color: #007AFF;
            cursor: pointer;
            margin-top: 8px;
            margin-bottom: 4px;
            user-select: none;
        `;
        advancedToggle.textContent = 'Advanced ▼';
        statusSection.appendChild(advancedToggle);

        const advancedTable = document.createElement('div');
        advancedTable.style.cssText = `
            display: none;
            margin-top: 4px;
            margin-bottom: 8px;
            font-size: 12px;
            background: ${isEnabled ? '#f8f9fa' : '#1a1d23'};
            border-radius: 6px;
            padding: 8px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.04);
            max-height: 200px;
            overflow-y: auto;
        `;
        // Only show spoofed values for the detected browser
        const spoofedProps = [];
        if (isEnabled) {
            spoofedProps.push(['userAgent', currentProfile.userAgent]);
            spoofedProps.push(['platform', currentProfile.platform]);
            spoofedProps.push(['language', currentProfile.language]);
            spoofedProps.push(['screenWidth', currentProfile.screenWidth]);
            spoofedProps.push(['screenHeight', currentProfile.screenHeight]);
            spoofedProps.push(['colorDepth', currentProfile.colorDepth]);
            spoofedProps.push(['devicePixelRatio', currentProfile.devicePixelRatio]);
            spoofedProps.push(['cores', currentProfile.cores]);
            spoofedProps.push(['memory', currentProfile.memory]);
            spoofedProps.push(['timezone', currentProfile.timezone]);
            spoofedProps.push(['webglVendor', currentProfile.webglVendor]);
            spoofedProps.push(['webglRenderer', currentProfile.webglRenderer]);
            if (["chrome", "edge"].includes(detectedBrowser)) {
                spoofedProps.push(['vendor', currentProfile.vendor]);
                spoofedProps.push(['productSub', currentProfile.productSub]);
                spoofedProps.push(['appVersion', currentProfile.appVersion]);
                spoofedProps.push(['appName', currentProfile.appName]);
                spoofedProps.push(['doNotTrack', currentProfile.doNotTrack]);
                spoofedProps.push(['maxTouchPoints', currentProfile.maxTouchPoints]);
                spoofedProps.push(['chromeObject', currentProfile.chromeObject]);
                if (currentProfile.connection) spoofedProps.push(['connection', JSON.stringify(currentProfile.connection)]);
                if (currentProfile.plugins) spoofedProps.push(['plugins', JSON.stringify(currentProfile.plugins)]);
                if (currentProfile.mimeTypes) spoofedProps.push(['mimeTypes', JSON.stringify(currentProfile.mimeTypes)]);
            }
            if (detectedBrowser === 'firefox') {
                spoofedProps.push(['productSub', currentProfile.productSub]);
                spoofedProps.push(['appVersion', currentProfile.appVersion]);
                spoofedProps.push(['appName', currentProfile.appName]);
                spoofedProps.push(['doNotTrack', currentProfile.doNotTrack]);
                spoofedProps.push(['maxTouchPoints', currentProfile.maxTouchPoints]);
                if (currentProfile.oscpu) spoofedProps.push(['oscpu', currentProfile.oscpu]);
                if (currentProfile.buildID) spoofedProps.push(['buildID', currentProfile.buildID]);
                if (currentProfile.plugins) spoofedProps.push(['plugins', JSON.stringify(currentProfile.plugins)]);
                if (currentProfile.mimeTypes) spoofedProps.push(['mimeTypes', JSON.stringify(currentProfile.mimeTypes)]);
            }
            if (detectedBrowser === 'safari') {
                spoofedProps.push(['productSub', currentProfile.productSub]);
                spoofedProps.push(['appVersion', currentProfile.appVersion]);
                spoofedProps.push(['appName', currentProfile.appName]);
                spoofedProps.push(['doNotTrack', currentProfile.doNotTrack]);
                spoofedProps.push(['maxTouchPoints', currentProfile.maxTouchPoints]);
                spoofedProps.push(['safariObject', currentProfile.safariObject]);
            }
        }
        if (spoofedProps.length > 0) {
            let tableHtml = '<table style="width:100%;border-collapse:collapse;">';
            for (const [key, value] of spoofedProps) {
                tableHtml += `<tr><td style="padding:2px 6px;color:#555;">${key}</td><td style="padding:2px 6px;color:#222;">${value}</td></tr>`;
            }
            tableHtml += '</table>';
            advancedTable.innerHTML = tableHtml;
        } else {
            advancedTable.innerHTML = '<div style="color:#888;">No spoofed values for this browser.</div>';
        }
        statusSection.appendChild(advancedTable);
        advancedToggle.addEventListener('click', () => {
            if (advancedTable.style.display === 'none') {
                advancedTable.style.display = 'block';
                advancedToggle.textContent = 'Advanced ▲';
            } else {
                advancedTable.style.display = 'none';
                advancedToggle.textContent = 'Advanced ▼';
            }
        });

        panel.appendChild(statusSection);

        // Add profile selector
        const profileSection = document.createElement('div');
        profileSection.style.cssText = `
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid #eee;
        `;

        const profileHeader = document.createElement('h3');
        profileHeader.style.cssText = `
            margin: 0 0 8px 0;
            font-size: 16px;
            font-weight: bold;
        `;
        profileHeader.textContent = 'Current Profile';

        const profileInfo = document.createElement('div');
        profileInfo.style.cssText = `
            font-size: 13px;
            color: ${prefersDark ? '#bfc4cc' : '#666'};
            margin-bottom: 12px;
        `;

        profileInfo.innerHTML = `
            ${currentProfile.id}<br>
            Expires: ${dateFormatter.format(new Date(parseInt(localStorage.getItem(profileExpiryKey))))}
        `;

        const profileSelect = document.createElement('select');
        profileSelect.style.cssText = `
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            margin-bottom: 12px;
            background-color: #f8f9fa;
        `;
        // Add dark/light class for dropdown
        profileSelect.className = prefersDark ? 'afs-select-dark' : 'afs-select-light';

        browserProfiles.forEach(profile => {
            const option = document.createElement('option');
            option.value = profile.id;
            option.textContent = profile.id;
            if (profile.id === currentProfile.id) {
                option.selected = true;
            }
            profileSelect.appendChild(option);
        });

        profileSection.appendChild(profileHeader);
        profileSection.appendChild(profileInfo);
        profileSection.appendChild(profileSelect);
        panel.appendChild(profileSection);

        // Add refresh button
        const refreshButton = document.createElement('button');
        refreshButton.textContent = 'Refresh Profile';
        refreshButton.style.cssText = `
            width: 100%;
            padding: 8px 16px;
            background: #007AFF;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s ease;
        `;
        refreshButton.addEventListener('mouseover', () => {
            refreshButton.style.background = '#0056b3';
        });
        refreshButton.addEventListener('mouseout', () => {
            refreshButton.style.background = '#007AFF';
        });
        refreshButton.addEventListener('click', () => {
            localStorage.removeItem(profileExpiryKey);
            location.reload();
        });
        panel.appendChild(refreshButton);

        // Toggle panel on icon click
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !icon.contains(e.target)) {
                panel.style.display = 'none';
            }
        });

        // Make icon draggable
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        icon.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                container.style.left = `${e.clientX - offsetX}px`;
                container.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                localStorage.setItem(positionKey, JSON.stringify({
                    top: container.offsetTop,
                    left: container.offsetLeft
                }));
            }
        });

        // Add keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'F') {
                e.preventDefault();
                panel.style.display = 'block';
            }
        });

        // Handle profile selection
        profileSelect.addEventListener('change', () => {
            const selectedProfile = browserProfiles.find(p => p.id === profileSelect.value);
            if (selectedProfile) {
                localStorage.setItem(profileKey, JSON.stringify(selectedProfile));
                localStorage.setItem(profileExpiryKey, (Date.now() + PROFILE_DURATION_MS).toString());
                // Update all relevant keys to match the selected profile
                localStorage.setItem('__afs_cores', selectedProfile.cores);
                localStorage.setItem('__afs_mem', selectedProfile.memory);
                localStorage.setItem('__afs_lang', selectedProfile.language);
                localStorage.setItem('__afs_platform', selectedProfile.platform);
                localStorage.setItem('__afs_sw', selectedProfile.screenWidth);
                localStorage.setItem('__afs_sh', selectedProfile.screenHeight);
                localStorage.setItem('__afs_tz', selectedProfile.timezone);
                localStorage.setItem('__afs_ua', selectedProfile.userAgent);
                // Optionally update WebGL and color depth
                localStorage.setItem('__afs_webgl_vendor', selectedProfile.webglVendor);
                localStorage.setItem('__afs_webgl_renderer', selectedProfile.webglRenderer);
                localStorage.setItem('__afs_color_depth', selectedProfile.colorDepth);
                localStorage.setItem('__afs_dpr', selectedProfile.devicePixelRatio);
                // New spoofed properties
                localStorage.setItem('__afs_vendor', selectedProfile.vendor);
                localStorage.setItem('__afs_productSub', selectedProfile.productSub);
                localStorage.setItem('__afs_appVersion', selectedProfile.appVersion);
                localStorage.setItem('__afs_appName', selectedProfile.appName);
                localStorage.setItem('__afs_doNotTrack', selectedProfile.doNotTrack);
                localStorage.setItem('__afs_maxTouchPoints', selectedProfile.maxTouchPoints);
                localStorage.setItem('__afs_chromeObject', selectedProfile.chromeObject);
                location.reload();
            }
        });

        // Handle protection toggle
        toggleInput.addEventListener('change', () => {
            const checked = toggleInput.checked;
            toggleSlider.style.backgroundColor = checked ? '#28a745' : '#dc3545';
            toggleSliderCircle.style.left = checked ? '23px' : '3px';
            localStorage.setItem(enabledKey, checked);
            location.reload();
        });

        // Option to hide the icon
        const iconToggleRow = document.createElement('div');
        iconToggleRow.style.cssText = 'display: flex; align-items: center; margin-bottom: 8px;';
        const iconToggleLabel = document.createElement('label');
        iconToggleLabel.style.cssText = 'font-size: 13px; color: #666; flex: 1; cursor: pointer;';
        iconToggleLabel.textContent = 'Show menu icon';
        const iconToggleCheckbox = document.createElement('input');
        iconToggleCheckbox.type = 'checkbox';
        iconToggleCheckbox.checked = showIcon;
        iconToggleCheckbox.style.cssText = 'margin-right: 8px;';
        iconToggleLabel.prepend(iconToggleCheckbox);
        iconToggleRow.appendChild(iconToggleLabel);
        statusSection.appendChild(iconToggleRow);
        iconToggleCheckbox.addEventListener('change', () => {
            localStorage.setItem(showIconKey, iconToggleCheckbox.checked);
            showIcon = iconToggleCheckbox.checked;
            updateIconVisibility();
            if (!showIcon) {
                // Show message in menu
                const hiddenMsg = document.createElement('div');
                hiddenMsg.style.cssText = 'color: #dc3545; font-size: 13px; margin: 8px 0;';
                hiddenMsg.textContent = 'The menu icon is hidden. To show it again, set __afs_show_icon to true in localStorage.';
                statusSection.appendChild(hiddenMsg);
            } else {
                // Remove any previous hidden message
                const prevMsg = statusSection.querySelector('div[afs-hidden-msg]');
                if (prevMsg) prevMsg.remove();
            }
        });

        // Add elements to DOM
        container.appendChild(icon);
        container.appendChild(panel);

        // Modified UI addition logic
        function addUIToDocument() {
            if (!document.body) {
                // If body isn't ready, wait a bit and try again
                setTimeout(addUIToDocument, 50);
                return;
            }
            
            // Check if UI already exists
            const existingUI = document.querySelector('div[style*="z-index: 999999"]');
            if (existingUI) {
                existingUI.remove();
            }
            
            document.body.appendChild(container);
        }

        // Try to add UI immediately
        addUIToDocument();

        // Also listen for DOMContentLoaded as a backup
        document.addEventListener('DOMContentLoaded', addUIToDocument);
    }

    // Call createUI immediately
    createUI();
})();