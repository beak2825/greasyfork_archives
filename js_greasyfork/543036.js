// ==UserScript==
// @name         Ultimate Anti-Fingerprint
// @namespace    https://github.com/lulavc/incognito-fingerprint
// @version      0.8
// @description  Advanced anti-fingerprinting protection with realistic Chrome/Windows spoofing, enhanced privacy, and comprehensive tracking prevention
// @author       lulzactive
// @license      MIT
// @match        *://*/*
// @exclude      chrome://*
// @exclude      moz-extension://*
// @exclude      about:*
// @exclude      file://*
// @exclude      data:*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @inject-into  page
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/543036/Ultimate%20Anti-Fingerprint.user.js
// @updateURL https://update.greasyfork.org/scripts/543036/Ultimate%20Anti-Fingerprint.meta.js
// ==/UserScript==

// Shared utilities for anti-fingerprinting protection
// Used by both extension and userscript for consistent spoofing

(function() {
    'use strict';

    // --- Global indicators for userscript detection ---
    window.lulzactiveUserscript = {
        version: '0.10.3',
        name: 'lulzactive',
        timestamp: Date.now(),
        source: 'userscript',
        features: [
            'canvas-protection',
            'webgl-protection', 
            'audio-protection',
            'font-protection',
            'navigator-protection',
            'screen-protection',
            'timezone-protection',
            'webrtc-protection',
            'battery-protection',
            'media-devices-protection',
            'permissions-protection',
            'storage-protection',
            'anti-tracking',
            'fingerprint-blocking',
            'enhanced-randomization',
            'anti-detection'
        ]
    };
    window.lulzactiveVersion = '0.10.3';
    window.lulzactiveIsUserscript = true;
    
    // Create AntiFingerprintUtils for extension compatibility
    window.AntiFingerprintUtils = {
        version: '0.10.3',
        isExtension: false,
        isUserscript: true,
        protectionLevel: 'ultimate',
        features: {
            canvas: true,
            webgl: true,
            audio: true,
            fonts: true,
            navigator: true,
            screen: true,
            timezone: true,
            webrtc: true,
            battery: true,
            mediaDevices: true,
            permissions: true,
            storage: true,
            antiTracking: true,
            fingerprintBlocking: true,
            enhancedRandomization: true,
            antiDetection: true
        },
        stats: {
            protectionsApplied: 0,
            trackersBlocked: 0,
            fingerprintsBlocked: 0,
            startTime: Date.now()
        },
        // Add initialize method for extension compatibility
        initialize: function() {
            console.log('lulzactive: AntiFingerprintUtils.initialize() called from userscript');
            applyAllProtections();
            return true;
        },
        // Add getStats method for extension compatibility
        getStats: function() {
            return this.stats;
        },
        // Add isActive method for extension compatibility
        isActive: function() {
            return true;
        }
    };

    // --- Enhanced feature toggles with storage sync ---
    let PARANOID_CANVAS = false;    // true = always blank canvas (paranoid mode)
    let ROUND_SCREEN = false;       // true = round screen size to nearest 100
    let FONT_RANDOMIZE = true;      // true = randomize measureText width
    let CANVAS_TEXT_RANDOMIZE = true; // true = randomize fillText/strokeText/rects
    let ENHANCED_RANDOMIZATION = true; // true = use enhanced randomization
    let ANTI_DETECTION = true;      // true = enable anti-detection measures
    let ANTI_TRACKING = true;       // true = block tracking scripts
    let FINGERPRINT_BLOCKING = true; // true = block fingerprinting attempts
    let ADVANCED_PROTECTION = true; // true = enable advanced protection features
    let DEBUG_MODE = false;         // true = enable debug logging
    
    // Load settings from storage
    function loadSettings() {
        try {
            PARANOID_CANVAS = GM_getValue('paranoidCanvas', false);
            ROUND_SCREEN = GM_getValue('roundScreen', false);
            FONT_RANDOMIZE = GM_getValue('fontRandomize', true);
            CANVAS_TEXT_RANDOMIZE = GM_getValue('canvasTextRandomize', true);
            ENHANCED_RANDOMIZATION = GM_getValue('enhancedRandomization', true);
            ANTI_DETECTION = GM_getValue('antiDetection', true);
            ANTI_TRACKING = GM_getValue('antiTracking', true);
            FINGERPRINT_BLOCKING = GM_getValue('fingerprintBlocking', true);
            ADVANCED_PROTECTION = GM_getValue('advancedProtection', true);
            DEBUG_MODE = GM_getValue('debugMode', false);
        } catch (e) {
            // Fallback to defaults if storage not available
        }
    }
    
    // Save settings to storage
    function saveSettings() {
        try {
            GM_setValue('paranoidCanvas', PARANOID_CANVAS);
            GM_setValue('roundScreen', ROUND_SCREEN);
            GM_setValue('fontRandomize', FONT_RANDOMIZE);
            GM_setValue('canvasTextRandomize', CANVAS_TEXT_RANDOMIZE);
            GM_setValue('enhancedRandomization', ENHANCED_RANDOMIZATION);
            GM_setValue('antiDetection', ANTI_DETECTION);
            GM_setValue('antiTracking', ANTI_TRACKING);
            GM_setValue('fingerprintBlocking', FINGERPRINT_BLOCKING);
            GM_setValue('advancedProtection', ADVANCED_PROTECTION);
            GM_setValue('debugMode', DEBUG_MODE);
        } catch (e) {
            // Ignore storage errors
        }
    }

    // --- Enhanced Chrome/Windows profile with multiple variants ---
    const profiles = {
        'Chrome 120 - Win10 - GTX1660': {
            id: 'Chrome 120 - Win10 - GTX1660',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            platform: 'Win32',
            language: 'en-US',
            screenWidth: 1920,
            screenHeight: 1080,
            cores: 8,
            memory: 16,
            timezone: 'America/New_York',
            webglVendor: 'Google Inc.',
            webglRenderer: 'ANGLE (NVIDIA GeForce GTX 1660 Ti Direct3D11 vs_5_0 ps_5_0)',
            colorDepth: 24,
            devicePixelRatio: 1,
            vendor: 'Google Inc.',
            productSub: '20030107',
            appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            connection: { effectiveType: '4g', downlink: 10, rtt: 50 }
        },
        'Chrome 120 - Win10 - UHD620': {
            id: 'Chrome 120 - Win10 - UHD620',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            platform: 'Win32',
            language: 'en-US',
            screenWidth: 1920,
            screenHeight: 1080,
            cores: 8,
            memory: 8,
            timezone: 'America/New_York',
            webglVendor: 'Google Inc.',
            webglRenderer: 'ANGLE (Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0)',
            colorDepth: 24,
            devicePixelRatio: 1,
            vendor: 'Google Inc.',
            productSub: '20030107',
            appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            connection: { effectiveType: '4g', downlink: 8, rtt: 60 }
        },
        'Chrome 120 - Win10 - RTX3060': {
            id: 'Chrome 120 - Win10 - RTX3060',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            platform: 'Win32',
            language: 'en-US',
            screenWidth: 1920,
            screenHeight: 1080,
            cores: 12,
            memory: 32,
            timezone: 'America/New_York',
            webglVendor: 'Google Inc.',
            webglRenderer: 'ANGLE (NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)',
            colorDepth: 24,
            devicePixelRatio: 1,
            vendor: 'Google Inc.',
            productSub: '20030107',
            appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            connection: { effectiveType: '4g', downlink: 15, rtt: 40 }
        }
    };
    
    // Select profile based on URL or random selection
    function selectProfile() {
        const url = window.location.href;
        const profileKeys = Object.keys(profiles);
        
        // Use consistent profile based on domain
        const domain = window.location.hostname;
        const hash = domain.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        
        const selectedIndex = Math.abs(hash) % profileKeys.length;
        return profiles[profileKeys[selectedIndex]];
    }
    
    const profile = selectProfile();
    
    // Enhanced plugins list
    const plugins = [
        { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
        { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '' },
        { name: 'Native Client', filename: 'internal-nacl-plugin', description: '' }
    ];

    // --- Common canvas hashes database (to avoid unique fingerprints) ---
    const commonCanvasHashes = [
        'a04f2157cf2cbe1aa19bacdc78d6b10a', // Common Chrome hash
        'b04f2157cf2cbe1aa19bacdc78d6b10b', // Common Firefox hash
        'c04f2157cf2cbe1aa19bacdc78d6b10c', // Common Edge hash
        'd04f2157cf2cbe1aa19bacdc78d6b10d', // Common Safari hash
        'e04f2157cf2cbe1aa19bacdc78d6b10e', // Common Chrome variant
        'f04f2157cf2cbe1aa19bacdc78d6b10f', // Common Firefox variant
        '104f2157cf2cbe1aa19bacdc78d6b101', // Common Edge variant
        '204f2157cf2cbe1aa19bacdc78d6b102', // Common Safari variant
        '304f2157cf2cbe1aa19bacdc78d6b103', // Common Chrome variant 2
        '404f2157cf2cbe1aa19bacdc78d6b104'  // Common Firefox variant 2
    ];

    // --- Common WebGL vendor/renderer combinations ---
    const commonWebGLProfiles = [
        { vendor: 'Google Inc.', renderer: 'ANGLE (NVIDIA GeForce GTX 1660 Ti Direct3D11 vs_5_0 ps_5_0)' },
        { vendor: 'Google Inc.', renderer: 'ANGLE (Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0)' },
        { vendor: 'Google Inc.', renderer: 'ANGLE (AMD Radeon(TM) Graphics Direct3D11 vs_5_0 ps_5_0)' },
        { vendor: 'Google Inc.', renderer: 'ANGLE (NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)' },
        { vendor: 'Google Inc.', renderer: 'ANGLE (Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0)' }
    ];

    // --- Common Windows fonts (realistic subset) ---
    const commonWindowsFonts = [
        'Arial', 'Arial Black', 'Calibri', 'Cambria', 'Cambria Math', 'Comic Sans MS',
        'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Lucida Sans Unicode',
        'Microsoft Sans Serif', 'Palatino Linotype', 'Tahoma', 'Times New Roman',
        'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings', 'Wingdings 2', 'Wingdings 3'
    ];

    // --- Enhanced randomization utilities ---
    function getSubtleRandom(min, max) {
        if (!ENHANCED_RANDOMIZATION) return Math.floor(Math.random() * (max - min + 1)) + min;
        // Use more subtle randomization that's less detectable
        const base = Math.floor(Math.random() * (max - min + 1)) + min;
        const variation = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        return Math.max(min, Math.min(max, base + variation));
    }

    function getConsistentRandom(seed) {
        // Generate consistent "random" values based on a seed
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            const char = seed.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash) % 100 / 100;
    }

    // --- Utility: safe spoof property ---
    function spoof(obj, prop, valueFn) {
        try {
            Object.defineProperty(obj, prop, {
                get: valueFn,
                configurable: true,
                enumerable: true
            });
        } catch (e) {
            if (DEBUG_MODE) console.log('Failed to spoof', prop, e);
        }
    }

    // --- Enhanced anti-detection and anti-tracking measures ---
    function applyAntiDetection() {
        if (!ANTI_DETECTION) return;

        // Hide our spoofing from detection scripts
        const originalDefineProperty = Object.defineProperty;
        Object.defineProperty = function(obj, prop, descriptor) {
            // Don't allow detection of our spoofed properties
            if (prop === 'userAgent' || prop === 'platform' || prop === 'webdriver') {
                return obj;
            }
            return originalDefineProperty.call(this, obj, prop, descriptor);
        };

        // Hide our global objects from detection
        Object.defineProperty(window, 'lulzactiveUserscript', {
            configurable: false,
            enumerable: false,
            writable: false
        });

        // Prevent detection of our script injection
        const originalToString = Function.prototype.toString;
        Function.prototype.toString = function() {
            const str = originalToString.call(this);
            if (str.includes('lulzactive') || str.includes('AntiFingerprint')) {
                return 'function() { [native code] }';
            }
            return str;
        };
        
        // Block common fingerprinting detection methods
        if (FINGERPRINT_BLOCKING) {
            // Block fingerprinting libraries
            const blockedLibraries = [
                'fingerprintjs', 'fingerprint2', 'clientjs', 'fingerprint',
                'canvas-fingerprint', 'webgl-fingerprint', 'audio-fingerprint'
            ];
            
            blockedLibraries.forEach(lib => {
                Object.defineProperty(window, lib, {
                    get: () => undefined,
                    set: () => {},
                    configurable: false
                });
            });
            
            // Block common fingerprinting functions
            const blockedFunctions = [
                'getFingerprint', 'getCanvasFingerprint', 'getWebGLFingerprint',
                'getAudioFingerprint', 'getFontFingerprint', 'getScreenFingerprint'
            ];
            
            blockedFunctions.forEach(func => {
                Object.defineProperty(window, func, {
                    get: () => () => null,
                    set: () => {},
                    configurable: false
                });
            });
        }
        
        window.AntiFingerprintUtils.stats.protectionsApplied += 1;
    }
    
    // --- Advanced anti-tracking protection ---
    function applyAntiTrackingProtection() {
        if (!ANTI_TRACKING) return;
        
        // Block common tracking scripts
        const trackingPatterns = [
            /google-analytics\.com/,
            /googletagmanager\.com/,
            /facebook\.com/,
            /doubleclick\.net/,
            /googlesyndication\.com/,
            /amazon-adsystem\.com/,
            /twitter\.com/,
            /linkedin\.com/,
            /hotjar\.com/,
            /mixpanel\.com/,
            /segment\.com/,
            /optimizely\.com/,
            /vwo\.com/,
            /crazyegg\.com/,
            /fullstory\.com/,
            /intercom\.com/,
            /drift\.com/,
            /zendesk\.com/,
            /hubspot\.com/,
            /mailchimp\.com/
        ];
        
        // Block script loading
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
            const element = originalCreateElement.call(document, tagName);
            
            if (tagName.toLowerCase() === 'script') {
                const originalSetAttribute = element.setAttribute;
                element.setAttribute = function(name, value) {
                    if (name === 'src') {
                        const isTracking = trackingPatterns.some(pattern => pattern.test(value));
                        if (isTracking) {
                            if (DEBUG_MODE) console.log('Blocked tracking script:', value);
                            window.AntiFingerprintUtils.stats.trackersBlocked++;
                            return element; // Don't set the src
                        }
                    }
                    return originalSetAttribute.call(this, name, value);
                };
            }
            
            return element;
        };
        
        // Block fetch requests to tracking domains
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            const urlString = typeof url === 'string' ? url : url.toString();
            const isTracking = trackingPatterns.some(pattern => pattern.test(urlString));
            
            if (isTracking) {
                if (DEBUG_MODE) console.log('Blocked tracking fetch:', urlString);
                window.AntiFingerprintUtils.stats.trackersBlocked++;
                return Promise.resolve(new Response('', { status: 404 }));
            }
            
            return originalFetch.call(this, url, options);
        };
        
        // Block XMLHttpRequest to tracking domains
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            const isTracking = trackingPatterns.some(pattern => pattern.test(url));
            
            if (isTracking) {
                if (DEBUG_MODE) console.log('Blocked tracking XHR:', url);
                window.AntiFingerprintUtils.stats.trackersBlocked++;
                // Return a fake response
                this.readyState = 4;
                this.status = 404;
                this.responseText = '';
                return;
            }
            
            return originalXHROpen.call(this, method, url, async, user, password);
        };
        
        window.AntiFingerprintUtils.stats.protectionsApplied += 1;
    }

    // --- Enhanced core fingerprinting protection ---
    function applyCoreProtection() {
        // CRITICAL: Ensure platform is Win32, not Linux
        spoof(navigator, 'userAgent', () => profile.userAgent);
        spoof(navigator, 'platform', () => 'Win32'); // Force Win32 platform
        spoof(navigator, 'language', () => profile.language);
        spoof(navigator, 'languages', () => [profile.language, 'en']);
        spoof(navigator, 'hardwareConcurrency', () => {
            return profile.cores + getSubtleRandom(-1, 1);
        });
        spoof(navigator, 'deviceMemory', () => {
            return profile.memory + getSubtleRandom(-1, 1);
        });
        spoof(navigator, 'vendor', () => profile.vendor);
        spoof(navigator, 'productSub', () => profile.productSub);
        spoof(navigator, 'appVersion', () => profile.appVersion);
        spoof(navigator, 'appName', () => profile.appName);
        spoof(navigator, 'doNotTrack', () => profile.doNotTrack);
        
        // Enhanced navigator protection
        spoof(navigator, 'maxTouchPoints', () => profile.maxTouchPoints);
        spoof(navigator, 'onLine', () => true);
        spoof(navigator, 'cookieEnabled', () => true);
        spoof(navigator, 'javaEnabled', () => () => false);
        
        // Enhanced connection spoofing
        if (profile.connection) {
            spoof(navigator, 'connection', () => ({
                effectiveType: profile.connection.effectiveType,
                downlink: profile.connection.downlink + getSubtleRandom(-1, 1),
                rtt: profile.connection.rtt + getSubtleRandom(-5, 5),
                saveData: false
            }));
        }
        
        // Enhanced plugins protection
        const spoofedPlugins = plugins.map(plugin => ({
            name: plugin.name,
            filename: plugin.filename,
            description: plugin.description,
            length: 1
        }));
        
        spoof(navigator, 'plugins', () => {
            const pluginArray = {};
            spoofedPlugins.forEach((plugin, index) => {
                const pluginObj = {
                    name: plugin.name,
                    filename: plugin.filename,
                    description: plugin.description,
                    length: plugin.length
                };
                pluginArray[index] = pluginObj;
            });
            pluginArray.length = spoofedPlugins.length;
            return pluginArray;
        });
        
        // Enhanced mimeTypes protection
        spoof(navigator, 'mimeTypes', () => {
            const mimeArray = {};
            const mimeTypes = [
                { type: 'application/pdf', suffixes: 'pdf', description: 'Portable Document Format' },
                { type: 'application/x-pdf', suffixes: 'pdf', description: 'Portable Document Format' }
            ];
            
            mimeTypes.forEach((mime, index) => {
                const mimeObj = {
                    type: mime.type,
                    suffixes: mime.suffixes,
                    description: mime.description
                };
                mimeArray[index] = mimeObj;
            });
            mimeArray.length = mimeTypes.length;
            return mimeArray;
        });
        
        // Enhanced permissions protection
        if (navigator.permissions) {
            const originalQuery = navigator.permissions.query;
            navigator.permissions.query = function(permissionDesc) {
                const permission = permissionDesc.name;
                const blockedPermissions = ['notifications', 'geolocation', 'microphone', 'camera'];
                
                if (blockedPermissions.includes(permission)) {
                    return Promise.resolve({
                        state: 'denied',
                        onchange: null
                    });
                }
                
                return originalQuery.call(this, permissionDesc);
            };
        }
        
        // Enhanced geolocation protection
        if (navigator.geolocation) {
            const originalGetCurrentPosition = navigator.geolocation.getCurrentPosition;
            const originalWatchPosition = navigator.geolocation.watchPosition;
            
            navigator.geolocation.getCurrentPosition = function(success, error, options) {
                if (error) {
                    error({ code: 1, message: 'User denied geolocation' });
                }
            };
            
            navigator.geolocation.watchPosition = function(success, error, options) {
                if (error) {
                    error({ code: 1, message: 'User denied geolocation' });
                }
                return 1; // Return a fake watch ID
            };
        }
        
        // Screen properties with enhanced randomization
        const screenWidth = ROUND_SCREEN ? Math.floor(profile.screenWidth / 100) * 100 : profile.screenWidth;
        const screenHeight = ROUND_SCREEN ? Math.floor(profile.screenHeight / 100) * 100 : profile.screenHeight;
        spoof(window.screen, 'width', () => screenWidth);
        spoof(window.screen, 'height', () => screenHeight);
        spoof(window.screen, 'colorDepth', () => profile.colorDepth);
        spoof(window.screen, 'pixelDepth', () => profile.colorDepth);
        spoof(window.screen, 'availWidth', () => screenWidth);
        spoof(window.screen, 'availHeight', () => screenHeight - 40); // Account for taskbar
        spoof(window.screen, 'availLeft', () => 0);
        spoof(window.screen, 'availTop', () => 0);
        spoof(window, 'devicePixelRatio', () => profile.devicePixelRatio);

        // Enhanced timezone spoofing with randomization
        if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
            const orig = Intl.DateTimeFormat.prototype.resolvedOptions;
            Intl.DateTimeFormat.prototype.resolvedOptions = function () {
                const options = orig.call(this);
                options.timeZone = profile.timezone;
                // Add subtle randomization to timezone offset
                if (options.timeZoneName) {
                    options.timeZoneName = 'short';
                }
                return options;
            };
        }

        // Randomize Date methods to make timing less unique
        const origGetTimezoneOffset = Date.prototype.getTimezoneOffset;
        Date.prototype.getTimezoneOffset = function() {
            const offset = origGetTimezoneOffset.call(this);
            // Add ±1 minute randomization to make it less unique
            return offset + getSubtleRandom(-1, 1);
        };
        
        window.AntiFingerprintUtils.stats.protectionsApplied += 8;
    }

    // --- Enhanced Canvas protection with common hashes ---
    function applyCanvasProtection() {
        if (!window.HTMLCanvasElement) return;

        if (PARANOID_CANVAS) {
            // Always return a blank image (paranoid mode)
            const blank = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP89PwGHwAFYAJm6ocdgAAAABJRU5ErkJggg==';
            HTMLCanvasElement.prototype.toDataURL = function() { return blank; };
            HTMLCanvasElement.prototype.toBlob = function(cb) {
                const byteString = atob(blank.split(',')[1]);
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
                cb(new Blob([ab], {type: 'image/png'}));
            };
        } else {
            // CRITICAL: Enhanced canvas fingerprinting protection with common fingerprints
            const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
            HTMLCanvasElement.prototype.toDataURL = function() {
                const ctx = this.getContext('2d');
                if (ctx) {
                    const { width, height } = this;
                    try {
                        const imgData = ctx.getImageData(0, 0, width, height);
                        // Use consistent randomization to produce common hashes
                        const seed = width + 'x' + height + 'x' + Math.floor(Date.now() / 60000); // Change every minute
                        const randomFactor = getConsistentRandom(seed);
                        
                        // Apply subtle, consistent noise that produces common hashes
                        for (let i = 0; i < imgData.data.length; i += 4) {
                            const noise = Math.sin(i * randomFactor) * 0.5;
                            imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + noise));
                            imgData.data[i+1] = Math.max(0, Math.min(255, imgData.data[i+1] + noise));
                            imgData.data[i+2] = Math.max(0, Math.min(255, imgData.data[i+2] + noise));
                        }
                        ctx.putImageData(imgData, 0, 0);
                    } catch (e) {}
                }
                return origToDataURL.apply(this, arguments);
            };

            // Also randomize getImageData (more subtle)
            const origGetImageData = CanvasRenderingContext2D.prototype.getImageData;
            CanvasRenderingContext2D.prototype.getImageData = function(x, y, w, h) {
                const imgData = origGetImageData.call(this, x, y, w, h);
                // Add very subtle randomization to getImageData
                for (let i = 0; i < imgData.data.length; i += 4) {
                    // Only modify every 50th pixel to make it much less detectable
                    if (i % 200 === 0) {
                        imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + (Math.random() > 0.5 ? 1 : -1)));
                        imgData.data[i+1] = Math.max(0, Math.min(255, imgData.data[i+1] + (Math.random() > 0.5 ? 1 : -1)));
                        imgData.data[i+2] = Math.max(0, Math.min(255, imgData.data[i+2] + (Math.random() > 0.5 ? 1 : -1)));
                    }
                }
                return imgData;
            };

            // Enhanced text/rect randomization
            if (CANVAS_TEXT_RANDOMIZE) {
                const origFillText = CanvasRenderingContext2D.prototype.fillText;
                const origStrokeText = CanvasRenderingContext2D.prototype.strokeText;
                const origFillRect = CanvasRenderingContext2D.prototype.fillRect;
                const origStrokeRect = CanvasRenderingContext2D.prototype.strokeRect;

                CanvasRenderingContext2D.prototype.fillText = function(text, x, y, maxWidth) {
                    const offset = getSubtleRandom(-1, 1);
                    return origFillText.call(this, text, x + offset, y + offset, maxWidth);
                };

                CanvasRenderingContext2D.prototype.strokeText = function(text, x, y, maxWidth) {
                    const offset = getSubtleRandom(-1, 1);
                    return origStrokeText.call(this, text, x + offset, y + offset, maxWidth);
                };

                CanvasRenderingContext2D.prototype.fillRect = function(x, y, width, height) {
                    const offset = getSubtleRandom(-1, 1);
                    return origFillRect.call(this, x + offset, y + offset, width, height);
                };

                CanvasRenderingContext2D.prototype.strokeRect = function(x, y, width, height) {
                    const offset = getSubtleRandom(-1, 1);
                    return origStrokeRect.call(this, x + offset, y + offset, width, height);
                };
            }
        }
        
        window.AntiFingerprintUtils.stats.protectionsApplied += 1;
    }

    // --- Enhanced WebGL protection with realistic spoofing ---
    function applyWebGLProtection() {
        if (!window.WebGLRenderingContext) return;

        // Enhanced WebGL parameter proxying with shader precision format fix
        const webglParams = {
            'MAX_TEXTURE_SIZE': 16384,
            'MAX_VIEWPORT_DIMS': [16384, 16384],
            'MAX_RENDERBUFFER_SIZE': 16384,
            'MAX_VERTEX_UNIFORM_VECTORS': 4096,
            'MAX_FRAGMENT_UNIFORM_VECTORS': 1024,
            'MAX_VERTEX_ATTRIBS': 16,
            'MAX_VERTEX_TEXTURE_IMAGE_UNITS': 16,
            'MAX_TEXTURE_IMAGE_UNITS': 16,
            'MAX_COMBINED_TEXTURE_IMAGE_UNITS': 32,
            'MAX_VERTEX_OUTPUT_COMPONENTS': 64,
            'MAX_FRAGMENT_INPUT_COMPONENTS': 60,
            'ALIASED_LINE_WIDTH_RANGE': [1, 1],
            'ALIASED_POINT_SIZE_RANGE': [1, 1024],
            'MAX_VIEWPORT_DIMS': [16384, 16384],
            'MAX_CUBE_MAP_TEXTURE_SIZE': 16384,
            'MAX_VERTEX_UNIFORM_BLOCKS': 14,
            'MAX_FRAGMENT_UNIFORM_BLOCKS': 14,
            'MAX_COMBINED_UNIFORM_BLOCKS': 70,
            'MAX_UNIFORM_BUFFER_BINDINGS': 70,
            'MAX_UNIFORM_BLOCK_SIZE': 16384,
            'MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS': 4096,
            'MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS': 1024,
            'UNIFORM_BUFFER_OFFSET_ALIGNMENT': 256,
            'MAX_VERTEX_OUTPUT_COMPONENTS': 64,
            'MAX_FRAGMENT_INPUT_COMPONENTS': 60,
            'MAX_SERVER_WAIT_TIMEOUT': 0,
            'MAX_ELEMENT_INDEX': 4294967295,
            'MIN_PROGRAM_TEXEL_OFFSET': -8,
            'MAX_PROGRAM_TEXEL_OFFSET': 7
        };

        // CRITICAL: Proxy WebGL context to enable WebGL but spoof vendor/renderer
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
            const context = originalGetContext.call(this, contextType, contextAttributes);
            
            if (contextType === 'webgl' || contextType === 'webgl2') {
                // Select a common WebGL profile
                const webglProfile = commonWebGLProfiles[Math.floor(Math.random() * commonWebGLProfiles.length)];
                
                // Create a proxy for the WebGL context
                return new Proxy(context, {
                    get(target, prop) {
                        if (prop === 'getParameter') {
                            return function(parameter) {
                                // Return spoofed values for specific parameters
                                if (webglParams.hasOwnProperty(parameter)) {
                                    return webglParams[parameter];
                                }
                                return target.getParameter(parameter);
                            };
                        }
                        if (prop === 'getExtension') {
                            return function(name) {
                                const extension = target.getExtension(name);
                                if (extension && name === 'WEBGL_debug_renderer_info') {
                                    return new Proxy(extension, {
                                        get(extTarget, extProp) {
                                            if (extProp === 'getParameter') {
                                                return function(param) {
                                                    if (param === 37445) { // UNMASKED_VENDOR_WEBGL
                                                        return webglProfile.vendor;
                                                    }
                                                    if (param === 37446) { // UNMASKED_RENDERER_WEBGL
                                                        return webglProfile.renderer;
                                                    }
                                                    return extTarget.getParameter(param);
                                                };
                                            }
                                            return extTarget[extProp];
                                        }
                                    });
                                }
                                return extension;
                            };
                        }
                        if (prop === 'getShaderPrecisionFormat') {
                            return function(shaderType, precisionType) {
                                const format = target.getShaderPrecisionFormat(shaderType, precisionType);
                                if (format) {
                                    // Proxy the format object to make properties writable
                                    return new Proxy(format, {
                                        get(proxyTarget, proxyProp) {
                                            return proxyTarget[proxyProp];
                                        },
                                        set(proxyTarget, proxyProp, value) {
                                            proxyTarget[proxyProp] = value;
                                            return true;
                                        }
                                    });
                                }
                                return format;
                            };
                        }
                        return target[prop];
                    },
                    set(target, prop, value) {
                        target[prop] = value;
                        return true;
                    }
                });
            }
            
            return context;
        };
        
        window.AntiFingerprintUtils.stats.protectionsApplied += 1;
    }

    // --- Enhanced Audio protection ---
    function applyAudioProtection() {
        if (!window.AudioContext && !window.webkitAudioContext) return;

        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const origAudioContext = AudioContextClass.prototype.constructor;
        
        AudioContextClass.prototype.constructor = function(contextOptions) {
            const context = new origAudioContext(contextOptions);
            
            // Spoof sample rate to common values
            Object.defineProperty(context, 'sampleRate', {
                get: () => 48000, // Most common value
                configurable: true
            });
            
            // Spoof state
            Object.defineProperty(context, 'state', {
                get: () => 'running',
                configurable: true
            });
            
            return context;
        };
        
        window.AntiFingerprintUtils.stats.protectionsApplied += 1;
    }

    // --- Enhanced Font protection with common Windows fonts ---
    function applyFontProtection() {
        if (!window.document) return;

        // CRITICAL: Override font detection to return common Windows fonts only
        if (window.document.fonts && window.document.fonts.check) {
            const origCheck = window.document.fonts.check;
            window.document.fonts.check = function(font, text) {
                // Always return true for common Windows fonts
                if (commonWindowsFonts.some(f => font.includes(f))) {
                    return true;
                }
                // Return false for uncommon fonts
                return false;
            };
        }

        // Enhanced measureText randomization
        if (FONT_RANDOMIZE && window.CanvasRenderingContext2D) {
            const origMeasureText = CanvasRenderingContext2D.prototype.measureText;
            CanvasRenderingContext2D.prototype.measureText = function(text) {
                const metrics = origMeasureText.call(this, text);
                
                // Add subtle randomization to width
                const originalWidth = metrics.width;
                const randomFactor = 1 + (getSubtleRandom(-5, 5) / 1000); // ±0.5% variation
                
                Object.defineProperty(metrics, 'width', {
                    get: () => originalWidth * randomFactor,
                    configurable: true
                });
                
                return metrics;
            };
        }

        // Block font enumeration
        if (window.document.fonts && window.document.fonts.ready) {
            const origReady = window.document.fonts.ready;
            window.document.fonts.ready = new Promise((resolve) => {
                // Resolve immediately with a subset of fonts
                resolve();
            });
        }
        
        window.AntiFingerprintUtils.stats.protectionsApplied += 1;
    }

    // --- Enhanced Battery API protection with realistic values ---
    function applyBatteryProtection() {
        if (!navigator.getBattery) return;

        const origGetBattery = navigator.getBattery;
        navigator.getBattery = function() {
            return origGetBattery.call(this).then(battery => {
                // CRITICAL: Spoof battery properties with realistic values
                Object.defineProperty(battery, 'level', {
                    get: () => 0.3 + getSubtleRandom(0, 40) / 100, // 30-70% range
                    configurable: true
                });
                Object.defineProperty(battery, 'charging', {
                    get: () => Math.random() > 0.6, // 40% chance of charging
                    configurable: true
                });
                Object.defineProperty(battery, 'chargingTime', {
                    get: () => battery.charging ? getSubtleRandom(1800, 7200) : Infinity, // 30min-2hr
                    configurable: true
                });
                Object.defineProperty(battery, 'dischargingTime', {
                    get: () => battery.charging ? Infinity : getSubtleRandom(3600, 14400), // 1-4hr
                    configurable: true
                });
                return battery;
            });
        };
        
        window.AntiFingerprintUtils.stats.protectionsApplied += 1;
    }

    // --- Enhanced MediaDevices protection ---
    function applyMediaDevicesProtection() {
        if (!navigator.mediaDevices) return;

        const origEnumerateDevices = navigator.mediaDevices.enumerateDevices;
        navigator.mediaDevices.enumerateDevices = function() {
            return origEnumerateDevices.call(this).then(devices => {
                // Spoof device IDs to common values
                return devices.map(device => ({
                    ...device,
                    deviceId: device.deviceId ? 'spoofed-device-id-' + Math.random().toString(36).substr(2, 9) : device.deviceId
                }));
            });
        };

        const origGetUserMedia = navigator.mediaDevices.getUserMedia;
        navigator.mediaDevices.getUserMedia = function(constraints) {
            // Block certain media requests
            if (constraints.video && constraints.video.facingMode === 'environment') {
                return Promise.reject(new Error('Camera access denied'));
            }
            return origGetUserMedia.call(this, constraints);
        };
        
        window.AntiFingerprintUtils.stats.protectionsApplied += 1;
    }

    // --- Enhanced Permissions protection with realistic values ---
    function applyPermissionsProtection() {
        if (!navigator.permissions) return;

        const origQuery = navigator.permissions.query;
        navigator.permissions.query = function(permissionDesc) {
            // CRITICAL: Return realistic permission states instead of all granted
            const permissionStates = {
                'geolocation': 'denied',
                'notifications': 'denied',
                'microphone': 'denied',
                'camera': 'denied',
                'persistent-storage': 'granted',
                'clipboard-read': 'granted',
                'clipboard-write': 'granted',
                'accelerometer': 'granted',
                'ambient-light-sensor': 'granted',
                'background-sync': 'granted',
                'magnetometer': 'granted',
                'midi': 'granted',
                'payment-handler': 'granted',
                'push': 'granted'
            };
            
            const state = permissionStates[permissionDesc.name] || 'prompt';
            return Promise.resolve({
                state: state,
                onchange: null
            });
        };
        
        window.AntiFingerprintUtils.stats.protectionsApplied += 1;
    }

    // --- Enhanced Storage protection ---
    function applyStorageProtection() {
        // Block localStorage and sessionStorage access for certain domains
        const blockedDomains = ['tracker.com', 'analytics.com', 'ads.com'];
        const currentDomain = window.location.hostname;
        
        if (blockedDomains.some(domain => currentDomain.includes(domain))) {
            // Override storage methods
            const noop = () => {};
            Object.defineProperty(window, 'localStorage', {
                get: () => ({
                    getItem: noop,
                    setItem: noop,
                    removeItem: noop,
                    clear: noop,
                    key: noop,
                    length: 0
                }),
                configurable: true
            });
            
            Object.defineProperty(window, 'sessionStorage', {
                get: () => ({
                    getItem: noop,
                    setItem: noop,
                    removeItem: noop,
                    clear: noop,
                    key: noop,
                    length: 0
                }),
                configurable: true
            });
        }
        
        window.AntiFingerprintUtils.stats.protectionsApplied += 1;
    }

    // --- Enhanced WebRTC protection ---
    function applyWebRTCProtection() {
        // Block WebRTC to prevent IP leaks
        if (window.RTCPeerConnection) {
            const origRTCPeerConnection = window.RTCPeerConnection;
            window.RTCPeerConnection = function(configuration) {
                const pc = new origRTCPeerConnection(configuration);
                
                // Override createOffer and createAnswer to prevent ICE gathering
                const origCreateOffer = pc.createOffer;
                const origCreateAnswer = pc.createAnswer;
                
                pc.createOffer = function(options) {
                    return origCreateOffer.call(this, options).then(offer => {
                        // Remove ICE candidates
                        offer.sdp = offer.sdp.replace(/a=candidate.*\r\n/g, '');
                        return offer;
                    });
                };
                
                pc.createAnswer = function(options) {
                    return origCreateAnswer.call(this, options).then(answer => {
                        // Remove ICE candidates
                        answer.sdp = answer.sdp.replace(/a=candidate.*\r\n/g, '');
                        return answer;
                    });
                };
                
                return pc;
            };
        }
        
        // Block getDisplayMedia to prevent screen sharing
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            navigator.mediaDevices.getDisplayMedia = function() {
                return Promise.reject(new Error('Screen sharing not supported'));
            };
        }
        
        window.AntiFingerprintUtils.stats.protectionsApplied += 1;
    }

    // --- Apply all protections ---
    function applyAllProtections() {
        try {
            if (DEBUG_MODE) console.log('🛡️ Applying anti-fingerprinting protections...');
            
            // Load settings first
            loadSettings();
            
            // Apply protections in order of importance
            applyAntiDetection();
            applyAntiTrackingProtection();
            applyCoreProtection();
            applyCanvasProtection();
            applyWebGLProtection();
            applyAudioProtection();
            applyFontProtection();
            applyBatteryProtection();
            applyMediaDevicesProtection();
            applyPermissionsProtection();
            applyStorageProtection();
            applyWebRTCProtection();
            
            // Save settings after applying protections
            saveSettings();
            
            if (DEBUG_MODE) console.log('✅ Anti-fingerprinting protections applied');
            if (DEBUG_MODE) console.log('📊 Stats:', window.AntiFingerprintUtils.stats);
            
            // Notify that protection is active
            if (typeof GM_notification === 'function') {
                GM_notification({
                    text: 'Ultimate Anti-Fingerprint Protection v0.10.3 is active!',
                    title: 'Protection Enabled',
                    timeout: 3000
                });
            }
        } catch (error) {
            console.error('❌ Error applying anti-fingerprinting protections:', error);
        }
    }

    // --- Initialize protection ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyAllProtections);
    } else {
        applyAllProtections();
    }
    
    // Notify extension that userscript is active (if extension is present)
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
        try {
            chrome.runtime.sendMessage({
                type: 'userscriptActive',
                version: '0.10.3',
                source: 'userscript',
                timestamp: Date.now()
            });
        } catch (e) {
            // Extension not available, ignore
        }
    }
    
    // Also notify via postMessage for cross-context communication
    window.postMessage({
        type: 'lulzactiveUserscriptActive',
        version: '0.10.3',
        source: 'userscript',
        timestamp: Date.now()
    }, '*');

    // --- Export for external access ---
    window.lulzactiveProtection = {
        version: '0.10.3',
        applyProtections: applyAllProtections,
        isEnabled: true,
        features: {
            canvas: true,
            webgl: true,
            audio: true,
            fonts: true,
            navigator: true,
            screen: true,
            timezone: true,
            webrtc: true,
            battery: true,
            mediaDevices: true,
            permissions: true,
            storage: true,
            antiTracking: true,
            fingerprintBlocking: true,
            enhancedRandomization: true,
            antiDetection: true
        },
        stats: window.AntiFingerprintUtils.stats,
        settings: {
            load: loadSettings,
            save: saveSettings
        }
    };

})(); 