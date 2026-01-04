// ==UserScript==
// @name         SpyScan
// @namespace    https://greasyfork.org/fr/users/1451802
// @version      3.0
// @description  Uncover tracking scripts, fingerprinting, and surveillance tactics lurking on the websites you visit
// @description:de Untersuche Websites auf Tracking-Skripte, Fingerprinting und Überwachungsmethoden.
// @description:es Descubre scripts de seguimiento, técnicas de huellas digitales y tácticas de vigilancia en las páginas web que visitas.
// @description:fr Détecte les scripts de suivi, le fingerprinting et les techniques de surveillance cachées sur les sites que vous visitez.
// @description:it Scopri script di tracciamento, tecniche di fingerprinting e metodi di sorveglianza sui siti web che visiti.
// @description:ru Раскрывает трекинговые скрипты, отпечатки браузера и методы слежки на посещаемых сайтах.
// @description:zh-CN 发现网站上的跟踪脚本、指纹识别和监控技术。
// @description:zh-TW 發現網站上的追蹤腳本、指紋辨識和監控技術。
// @description:ja 訪問したサイトに潜むトラッキングスクリプト、フィンガープリント、監視技術を検出。
// @description:ko 방문한 웹사이트에서 추적 스크립트, 브라우저 지문, 감시 기술을 찾아냅니다.
// @author       NormalRandomPeople (https://github.com/NormalRandomPeople)
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @icon         https://www.svgrepo.com/show/360090/analyse.svg
// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      edge
// @compatible      brave
// @run-at document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/531352/SpyScan.user.js
// @updateURL https://update.greasyfork.org/scripts/531352/SpyScan.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function() {
    'use strict';

    let detectedETags = [], detectedIPGeolocationRequests = [], detectedWebRTCUsage = [];
    let detectedCanvasFingerprinting = [], detectedWebGLFingerprinting = [], detectedAudioFingerprinting = [];
    let detectedFontFingerprinting = [], detectedScreenFingerprinting = [], detectedBatteryFingerprinting = [];
    let detectedMediaDevices = [], detectedSensors = [], detectedServiceWorkers = [];
    let detectedCacheAPI = [], detectedWebSQL = [], detectedFileSystem = [], detectedThirdPartyIframes = [];
    let detectedLocalStorageTracking = [], detectedSessionStorageTracking = [], detectedIndexedDBTracking = [];
    let detectedClipboardAccess = [], detectedURLTrackingParams = [];
    let detectedEventTracking = {click: 0, scroll: 0, mousemove: 0, keypress: 0, keydown: 0, keyup: 0};
    let detectedCookieSyncing = [], detectedCNAMECloaking = [], detectedSuspiciousHeaders = [];
    let detectedDOMStorageAbuse = [], detectedNetworkTimingAttacks = [], detectedCSSTracking = [];
    let detectedObfuscatedScripts = [], detectedPOSTTracking = [], detectedAdvancedFingerprinting = [];
    let scanCache = {url: null, timestamp: null, results: null, ttl: 5 * 60 * 1000};

    function isCacheValid() {
        if (!scanCache.url || !scanCache.timestamp || !scanCache.results) return false;
        if (scanCache.url !== window.location.href) return false;
        if (Date.now() - scanCache.timestamp > scanCache.ttl) return false;
        return true;
    }

    function saveScanToCache(results) {
        scanCache = {url: window.location.href, timestamp: Date.now(), results: results, ttl: 5 * 60 * 1000};
    }

    function clearScanCache() {
        scanCache = {url: null, timestamp: null, results: null, ttl: 5 * 60 * 1000};
    }

    function detectCookieSyncing() {
        const cookieDomains = new Map();
        const currentDomain = window.location.hostname;

        document.cookie.split(';').forEach(cookie => {
            const parts = cookie.trim().split('=');
            if (parts.length >= 2) {
                const name = parts[0];
                const value = parts[1];

                if (value.length > 20 && /^[a-f0-9\-]+$/i.test(value)) {
                    if (!cookieDomains.has(value)) {
                        cookieDomains.set(value, []);
                    }
                    cookieDomains.get(value).push(name);
                }
            }
        });

        cookieDomains.forEach((names, value) => {
            if (names.length > 1) {
                detectedCookieSyncing.push({
                    sharedValue: value.substring(0, 20) + '...',
                    cookies: names,
                    timestamp: Date.now()
                });
            }
        });

        const syncDomains = ['doubleclick.net', 'demdex.net', 'adsrvr.org', 'mathtag.com', 'rlcdn.com'];

        return detectedCookieSyncing.length > 0 ? [{
            name: 'Cookie Syncing',
            danger: 'high',
            description: `Detected ${detectedCookieSyncing.length} cookie synchronization(s) between domains. Unique IDs are shared for cross-site tracking.`,
            details: {
                'Synced Cookies': detectedCookieSyncing.map(sync => sync.cookies.join(', ')).join(' | '),
                'Shared Values': detectedCookieSyncing.map(sync => sync.sharedValue).join(', '),
                'Impact': 'Allows advertisers to track you across multiple websites',
                'Risk Level': 'High - Cross-site identification',
                'Detection Count': detectedCookieSyncing.length
            }
        }] : [];
    }

    async function detectCNAMECloaking() {
        const suspiciousSubdomains = [];
        const currentDomain = window.location.hostname;
        const knownTrackers = ['google-analytics', 'facebook', 'doubleclick', 'analytics', 'tracking', 'metrics', 'stats', 'tag', 'pixel'];

        const scripts = Array.from(document.scripts);
        const resources = performance.getEntriesByType('resource');

        const allUrls = [
            ...scripts.map(s => s.src).filter(Boolean),
            ...resources.map(r => r.name)
        ];

        allUrls.forEach(url => {
            try {
                const urlObj = new URL(url);
                const hostname = urlObj.hostname;

                if (hostname.endsWith(currentDomain) && hostname !== currentDomain) {
                    const subdomain = hostname.replace('.' + currentDomain, '');
                    const isTrackerName = knownTrackers.some(tracker =>
                        subdomain.toLowerCase().includes(tracker)
                    );

                    if (isTrackerName) {
                        detectedCNAMECloaking.push({
                            subdomain: hostname,
                            url: url,
                            timestamp: Date.now()
                        });
                    }
                }
            } catch (e) {}
        });

        return detectedCNAMECloaking.length > 0 ? [{
            name: 'CNAME Cloaking',
            danger: 'high',
            description: `Detected ${detectedCNAMECloaking.length} suspicious subdomain(s) used to disguise third-party trackers: ${[...new Set(detectedCNAMECloaking.map(c => c.subdomain))].slice(0, 3).join(', ')}`,
            details: {
                'Suspicious Subdomains': [...new Set(detectedCNAMECloaking.map(c => c.subdomain))].join(', '),
                'Sample URLs': detectedCNAMECloaking.slice(0, 3).map(c => c.url).join(' | '),
                'Technique': 'CNAME records redirect to third-party trackers while appearing first-party',
                'Impact': 'Bypasses browser tracking protection and cookie blockers',
                'Risk Level': 'High - Stealthy tracking',
                'Total Instances': detectedCNAMECloaking.length
            }
        }] : [];
    }

    function detectSuspiciousHeaders() {
        const suspiciousHeaderPatterns = [
            'x-client-data', 'x-forwarded-for', 'x-real-ip', 'x-device-id',
            'x-user-id', 'x-session-id', 'x-tracking-id', 'x-visitor-id',
            'x-analytics', 'x-correlation-id', 'x-request-id'
        ];

        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const response = await originalFetch.apply(this, args);

            suspiciousHeaderPatterns.forEach(pattern => {
                const headerValue = response.headers.get(pattern);
                if (headerValue) {
                    detectedSuspiciousHeaders.push({
                        header: pattern,
                        value: headerValue.substring(0, 50),
                        url: response.url,
                        timestamp: Date.now()
                    });
                }
            });

            return response;
        };

        const originalXHRSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(...args) {
            this.addEventListener('load', function() {
                suspiciousHeaderPatterns.forEach(pattern => {
                    try {
                        const headerValue = this.getResponseHeader(pattern);
                        if (headerValue) {
                            detectedSuspiciousHeaders.push({
                                header: pattern,
                                value: headerValue.substring(0, 50),
                                url: this.responseURL,
                                timestamp: Date.now()
                            });
                        }
                    } catch (e) {}
                });
            });
            return originalXHRSend.apply(this, args);
        };

        return detectedSuspiciousHeaders.length > 0 ? [{
            name: 'Suspicious HTTP Headers',
            danger: 'medium',
            description: `Detected ${detectedSuspiciousHeaders.length} suspicious HTTP header(s) used for tracking: ${[...new Set(detectedSuspiciousHeaders.map(h => h.header))].join(', ')}`,
            details: {
                'Headers Detected': [...new Set(detectedSuspiciousHeaders.map(h => h.header))].join(', '),
                'Sample Values': detectedSuspiciousHeaders.slice(0, 3).map(h => `${h.header}: ${h.value}`).join(' | '),
                'Sample URLs': [...new Set(detectedSuspiciousHeaders.slice(0, 3).map(h => h.url))].join(' | '),
                'Purpose': 'HTTP headers can carry tracking identifiers in every request',
                'Impact': 'Server-side tracking that bypasses client-side blockers',
                'Total Detections': detectedSuspiciousHeaders.length
            }
        }] : [];
    }

    function detectDOMStorageAbuse() {
        const storagePatterns = {
            fingerprint: /fingerprint|fp_|device_id|browser_id|client_id/i,
            tracking: /_ga|_fb|_hjid|uuid|guid|visitor/i,
            timing: /timestamp|last_seen|visit_time|session_start/i
        };

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);

            Object.entries(storagePatterns).forEach(([type, pattern]) => {
                if (pattern.test(key) || (value && pattern.test(value))) {
                    detectedDOMStorageAbuse.push({
                        storage: 'localStorage',
                        key: key,
                        type: type,
                        valueLength: value ? value.length : 0,
                        timestamp: Date.now()
                    });
                }
            });
        }

        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            const value = sessionStorage.getItem(key);

            Object.entries(storagePatterns).forEach(([type, pattern]) => {
                if (pattern.test(key) || (value && pattern.test(value))) {
                    detectedDOMStorageAbuse.push({
                        storage: 'sessionStorage',
                        key: key,
                        type: type,
                        valueLength: value ? value.length : 0,
                        timestamp: Date.now()
                    });
                }
            });
        }

        return detectedDOMStorageAbuse.length > 0 ? [{
            name: 'DOM Storage Abuse',
            danger: 'high',
            description: `Detected ${detectedDOMStorageAbuse.length} suspicious entry(ies) in DOM Storage used for persistent tracking`,
            details: {
                'Storage Types': [...new Set(detectedDOMStorageAbuse.map(d => d.storage))].join(', '),
                'Tracking Keys': detectedDOMStorageAbuse.slice(0, 5).map(d => d.key).join(', ') + (detectedDOMStorageAbuse.length > 5 ? '...' : ''),
                'Pattern Types': [...new Set(detectedDOMStorageAbuse.map(d => d.type))].join(', '),
                'Total Data Size': detectedDOMStorageAbuse.reduce((sum, d) => sum + d.valueLength, 0) + ' characters',
                'Impact': 'Creates supercookies that survive browser cleaning',
                'Risk Level': 'High - Persistent identification',
                'Total Entries': detectedDOMStorageAbuse.length
            }
        }] : [];
    }

    function detectNetworkTimingAttacks() {
        const timingMeasurements = [];
        let suspiciousTimingCount = 0;

        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'resource' || entry.entryType === 'navigation') {
                    timingMeasurements.push({
                        name: entry.name,
                        duration: entry.duration,
                        type: entry.entryType
                    });
                }
            }
        });

        observer.observe({ entryTypes: ['resource', 'navigation'] });

        const originalPerformanceNow = performance.now;
        let perfNowCalls = 0;

        performance.now = function() {
            perfNowCalls++;
            if (perfNowCalls > 100) {
                suspiciousTimingCount++;
            }
            return originalPerformanceNow.apply(this);
        };

        const originalGetEntries = performance.getEntries;
        let getEntriesCalls = 0;

        performance.getEntries = function() {
            getEntriesCalls++;
            if (getEntriesCalls > 20) {
                detectedNetworkTimingAttacks.push({
                    method: 'getEntries',
                    calls: getEntriesCalls,
                    timestamp: Date.now()
                });
            }
            return originalGetEntries.apply(this);
        };

        setTimeout(() => {
            if (suspiciousTimingCount > 0 || detectedNetworkTimingAttacks.length > 0) {
                detectedNetworkTimingAttacks.push({
                    method: 'performance.now',
                    calls: perfNowCalls,
                    suspicious: suspiciousTimingCount
                });
            }
        }, 5000);

        return detectedNetworkTimingAttacks.length > 0 ? [{
            name: 'Network Timing Attacks',
            danger: 'medium',
            description: `Detected ${detectedNetworkTimingAttacks.length} fingerprinting attempt(s) via network timing. The site is excessively measuring performance.`,
            details: {
                'Detection Methods': [...new Set(detectedNetworkTimingAttacks.map(n => n.method))].join(', '),
                'Total API Calls': detectedNetworkTimingAttacks.reduce((sum, n) => sum + (n.calls || 0), 0),
                'Technique': 'Measures network response times to identify users',
                'What it reveals': 'Network speed, ISP characteristics, geographical hints',
                'Impact': 'Creates unique timing fingerprint for identification',
                'Total Detections': detectedNetworkTimingAttacks.length
            }
        }] : [];
    }

    function detectCSSTracking() {
        const links = document.querySelectorAll('a[href]');
        const suspiciousLinks = [];

        links.forEach(link => {
            const href = link.href;
            const style = window.getComputedStyle(link, ':visited');

            if (style && link.style.color !== style.color) {
                suspiciousLinks.push(href);
            }
        });

        const stylesheets = Array.from(document.styleSheets);
        const externalFonts = [];

        stylesheets.forEach(sheet => {
            try {
                const rules = sheet.cssRules || sheet.rules;
                if (rules) {
                    Array.from(rules).forEach(rule => {
                        if (rule.type === CSSRule.FONT_FACE_RULE) {
                            const src = rule.style.getPropertyValue('src');
                            if (src && (src.includes('http://') || src.includes('https://'))) {
                                externalFonts.push({
                                    family: rule.style.getPropertyValue('font-family'),
                                    src: src.substring(0, 100)
                                });
                            }
                        }
                    });
                }
            } catch (e) {
                detectedCSSTracking.push({
                    type: 'cross-origin-stylesheet',
                    url: sheet.href,
                    timestamp: Date.now()
                });
            }
        });

        if (suspiciousLinks.length > 0) {
            detectedCSSTracking.push({
                type: 'visited-links-detection',
                count: suspiciousLinks.length
            });
        }

        if (externalFonts.length > 5) {
            detectedCSSTracking.push({
                type: 'external-fonts',
                count: externalFonts.length,
                fonts: externalFonts.slice(0, 3)
            });
        }

        return detectedCSSTracking.length > 0 ? [{
            name: 'CSS-based Tracking',
            danger: 'medium',
            description: `Detected ${detectedCSSTracking.length} CSS tracking technique(s): external stylesheets, tracking fonts, or visited links detection`,
            details: {
                'Techniques Used': [...new Set(detectedCSSTracking.map(c => c.type))].join(', '),
                'External Fonts': detectedCSSTracking.filter(c => c.type === 'external-fonts').length > 0 ?
                    detectedCSSTracking.find(c => c.type === 'external-fonts').count : 0,
                'Cross-origin Stylesheets': detectedCSSTracking.filter(c => c.type === 'cross-origin-stylesheet').length,
                'Method': 'Uses CSS properties to track user behavior and history',
                'What it reveals': 'Browsing history, font availability, rendering characteristics',
                'Impact': 'Stealthy tracking through styling mechanisms',
                'Total Detections': detectedCSSTracking.length
            }
        }] : [];
    }

    function detectObfuscatedScripts() {
        const scripts = Array.from(document.scripts);
        const obfuscationPatterns = [
            /eval\(/gi,
            /\\x[0-9a-f]{2}/gi,
            /\\u[0-9a-f]{4}/gi,
            /String\.fromCharCode/gi,
            /atob\(/gi,
            /btoa\(/gi
        ];

        scripts.forEach(script => {
            if (script.textContent) {
                const content = script.textContent;
                let obfuscationScore = 0;
                const detectedPatterns = [];

                obfuscationPatterns.forEach(pattern => {
                    const matches = content.match(pattern);
                    if (matches && matches.length > 5) {
                        obfuscationScore += matches.length;
                        detectedPatterns.push(pattern.source);
                    }
                });

                const nonAlphaNum = content.replace(/[a-zA-Z0-9\s]/g, '').length;
                const ratio = nonAlphaNum / content.length;

                if (ratio > 0.3 || obfuscationScore > 20) {
                    detectedObfuscatedScripts.push({
                        src: script.src || 'inline',
                        score: obfuscationScore,
                        ratio: ratio.toFixed(2),
                        patterns: detectedPatterns,
                        timestamp: Date.now()
                    });
                }
            }
        });

        return detectedObfuscatedScripts.length > 0 ? [{
            name: 'Obfuscated Scripts',
            danger: 'high',
            description: `Detected ${detectedObfuscatedScripts.length} obfuscated script(s). Code intentionally made unreadable, often used to hide trackers.`,
            details: {
                'Script Sources': detectedObfuscatedScripts.map(s => s.src === 'inline' ? 'Inline Script' : s.src).slice(0, 3).join(' | ') +
                    (detectedObfuscatedScripts.length > 3 ? '...' : ''),
                'Obfuscation Patterns': [...new Set(detectedObfuscatedScripts.flatMap(s => s.patterns))].slice(0, 5).join(', '),
                'Average Obfuscation Score': Math.round(detectedObfuscatedScripts.reduce((sum, s) => sum + s.score, 0) / detectedObfuscatedScripts.length),
                'Max Non-alphanumeric Ratio': Math.max(...detectedObfuscatedScripts.map(s => parseFloat(s.ratio))).toFixed(2),
                'Purpose': 'Hides malicious or tracking code from inspection',
                'Impact': 'Unknown behavior hidden from users and researchers',
                'Risk Level': 'High - Hidden intentions',
                'Total Scripts': detectedObfuscatedScripts.length
            }
        }] : [];
    }

    function detectPOSTTracking() {
        const trackingPatterns = /user.*id|session.*id|visitor.*id|client.*id|device.*id|fingerprint|tracking|analytics/i;

        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const [url, options] = args;

            if (options && options.method === 'POST' && options.body) {
                let bodyContent = '';

                try {
                    if (typeof options.body === 'string') {
                        bodyContent = options.body;
                    } else if (options.body instanceof FormData) {
                        bodyContent = Array.from(options.body.entries()).map(([k, v]) => `${k}=${v}`).join('&');
                    }

                    if (trackingPatterns.test(bodyContent)) {
                        detectedPOSTTracking.push({
                            url: typeof url === 'string' ? url : url.url,
                            method: 'fetch',
                            bodyPreview: bodyContent.substring(0, 100),
                            timestamp: Date.now()
                        });
                    }
                } catch (e) {}
            }

            return originalFetch.apply(this, args);
        };

        const originalXHRSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(body) {
            if (this._method === 'POST' && body) {
                let bodyContent = '';

                try {
                    if (typeof body === 'string') {
                        bodyContent = body;
                    } else if (body instanceof FormData) {
                        bodyContent = Array.from(body.entries()).map(([k, v]) => `${k}=${v}`).join('&');
                    }

                    if (trackingPatterns.test(bodyContent)) {
                        detectedPOSTTracking.push({
                            url: this._url,
                            method: 'XMLHttpRequest',
                            bodyPreview: bodyContent.substring(0, 100),
                            timestamp: Date.now()
                        });
                    }
                } catch (e) {}
            }

            return originalXHRSend.apply(this, arguments);
        };

        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this._method = method;
            this._url = url;
            return originalXHROpen.apply(this, arguments);
        };

        return detectedPOSTTracking.length > 0 ? [{
            name: 'POST Data Tracking',
            danger: 'high',
            description: `Detected ${detectedPOSTTracking.length} POST request(s) containing tracking identifiers or fingerprints`,
            details: {
                'Request Methods': [...new Set(detectedPOSTTracking.map(p => p.method))].join(', '),
                'Target URLs': [...new Set(detectedPOSTTracking.map(p => p.url))].slice(0, 3).join(' | ') +
                    (detectedPOSTTracking.length > 3 ? '...' : ''),
                'Body Previews': detectedPOSTTracking.slice(0, 2).map(p => p.bodyPreview).join(' | '),
                'Technique': 'Sends tracking data in POST body (harder to block)',
                'What is sent': 'User IDs, session IDs, device fingerprints, behavioral data',
                'Impact': 'Server-side tracking with detailed user data',
                'Risk Level': 'High - Active data transmission',
                'Total Requests': detectedPOSTTracking.length
            }
        }] : [];
    }

    function detectAdvancedFingerprinting() {
        const techniques = [];

        let mediaQueryCount = 0;
        const originalMatchMedia = window.matchMedia;
        window.matchMedia = function(query) {
            mediaQueryCount++;
            if (mediaQueryCount > 20) {
                techniques.push({
                    type: 'CSS Media Queries',
                    count: mediaQueryCount
                });
            }
            return originalMatchMedia.apply(this, arguments);
        };

        const navigatorAccess = {};
        const sensitiveProps = ['userAgent', 'platform', 'language', 'languages', 'hardwareConcurrency', 'deviceMemory', 'maxTouchPoints'];

        sensitiveProps.forEach(prop => {
            const descriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, prop) ||
                              Object.getOwnPropertyDescriptor(navigator, prop);
            if (descriptor && descriptor.get) {
                Object.defineProperty(Navigator.prototype, prop, {
                    get: function() {
                        navigatorAccess[prop] = (navigatorAccess[prop] || 0) + 1;
                        if (navigatorAccess[prop] > 5) {
                            techniques.push({
                                type: 'Navigator Enumeration',
                                property: prop,
                                count: navigatorAccess[prop]
                            });
                        }
                        return descriptor.get.call(this);
                    }
                });
            }
        });

        let rafCount = 0;
        const originalRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = function(callback) {
            rafCount++;
            if (rafCount > 100) {
                techniques.push({
                    type: 'RAF Timing Attack',
                    count: rafCount
                });
            }
            return originalRAF.apply(this, arguments);
        };

        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function(...args) {
            const start = performance.now();
            const result = originalToDataURL.apply(this, args);
            const duration = performance.now() - start;

            if (duration > 50) {
                techniques.push({
                    type: 'Canvas Timing',
                    duration: duration.toFixed(2)
                });
            }

            return result;
        };

        try {
            if (navigator.plugins && navigator.plugins.length > 0) {
                let pluginAccess = 0;
                const descriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, 'plugins') ||
                                  Object.getOwnPropertyDescriptor(navigator, 'plugins');

                if (descriptor && descriptor.configurable) {
                    const originalGet = descriptor.get;
                    Object.defineProperty(Navigator.prototype, 'plugins', {
                        get: function() {
                            pluginAccess++;
                            if (pluginAccess > 3) {
                                techniques.push({
                                    type: 'Plugin Enumeration',
                                    count: pluginAccess
                                });
                            }
                            return originalGet ? originalGet.call(this) : descriptor.value;
                        },
                        configurable: true
                    });
                }
            }
        } catch (e) {

        }

        setTimeout(() => {
            detectedAdvancedFingerprinting.push(...techniques);
        }, 3000);

        return detectedAdvancedFingerprinting.length > 0 ? [{
            name: 'Advanced Fingerprinting Techniques',
            danger: 'high',
            description: `Detected ${detectedAdvancedFingerprinting.length} advanced fingerprinting technique(s): ${[...new Set(detectedAdvancedFingerprinting.map(t => t.type))].join(', ')}`,
            details: {
                'Techniques': [...new Set(detectedAdvancedFingerprinting.map(t => t.type))].join(', '),
                'API Calls': detectedAdvancedFingerprinting.map(t => `${t.type}: ${t.count || t.duration || 'detected'}`).join(' | '),
                'Fingerprinting Vectors': 'CSS Media Queries, Navigator Properties, RAF Timing, Canvas Timing, Plugin Enumeration',
                'What it reveals': 'Hardware specs, installed software, rendering engine details, timing characteristics',
                'Uniqueness': 'Combines multiple signals for highly unique fingerprint',
                'Impact': 'Creates persistent digital fingerprint across sessions',
                'Risk Level': 'High - Advanced identification',
                'Total Techniques': detectedAdvancedFingerprinting.length
            }
        }] : [];
    }

    function detectWebRTCTracking() {
        if (detectedWebRTCUsage.length > 0) {
            return [{
                name: "WebRTC IP Tracking",
                danger: "high",
                description: `Website is using WebRTC to potentially collect your real IP address. Detected ${detectedWebRTCUsage.length} RTCPeerConnection(s) created by the site.`,
                details: {
                    'Total Connections': detectedWebRTCUsage.length,
                    'Technique': 'WebRTC peer connections can leak real IP even through VPN',
                    'What it reveals': 'Real IP address, local network information, NAT type',
                    'Bypass Capability': 'Can bypass VPN and proxy protection',
                    'Impact': 'Reveals true location and network identity',
                    'Risk Level': 'High - IP address exposure',
                    'Sample Config': detectedWebRTCUsage[0].config ? JSON.stringify(detectedWebRTCUsage[0].config).substring(0, 100) : 'N/A'
                }
            }];
        }
        return [];
    }

    function detectEventTracking() {
        const results = [];
        const totalTracked = Object.values(detectedEventTracking).reduce((a, b) => a + b, 0);

        if (totalTracked > 20) {
            const events = Object.entries(detectedEventTracking)
                .filter(([, count]) => count > 5)
                .map(([event, count]) => `${event}(${count})`)
                .join(', ');

            const danger = totalTracked > 50 ? 'high' : 'medium';
            results.push({
                name: 'Event Tracking',
                danger: danger,
                description: `Website is monitoring user interactions extensively with ${totalTracked} event listener(s): ${events}. This can track your behavior on the page.`,
                details: {
                    'Total Event Listeners': totalTracked,
                    'Tracked Events': Object.entries(detectedEventTracking)
                        .filter(([, count]) => count > 0)
                        .map(([event, count]) => `${event}: ${count}`)
                        .join(', '),
                    'Most Tracked': Object.entries(detectedEventTracking)
                        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None',
                    'Technique': 'Monitors clicks, scrolling, mouse movement, keyboard input',
                    'What it reveals': 'User behavior patterns, engagement level, reading habits',
                    'Purpose': 'Behavioral analytics, heatmaps, session replay',
                    'Impact': 'Creates detailed profile of on-page behavior',
                    'Risk Level': danger === 'high' ? 'High - Extensive monitoring' : 'Medium - Moderate tracking'
                }
            });
        }

        return results;
    }

    function categorizeThreats(threats) {
        const categories = {
            tracking: { title: 'Trackers', threats: [], icon: '🔍' },
            fingerprinting: { title: 'Fingerprinting', threats: [], icon: '👤' },
            storage: { title: 'Storage & Supercookies', threats: [], icon: '💾' },
            permissions: { title: 'Permissions & Access', threats: [], icon: '⚠️' },
            advanced: { title: 'Advanced Threats', threats: [], icon: '🎯' }
        };

        threats.forEach(threat => {
            const name = threat.name.toLowerCase();

            if (name.includes('fingerprinting') || name.includes('timing attack') || name.includes('obfuscated')) {
                categories.fingerprinting.threats.push(threat);
            } else if (name.includes('storage') || name.includes('cookie') || name.includes('websql') || name.includes('indexeddb') || name.includes('cache') || name.includes('filesystem')) {
                categories.storage.threats.push(threat);
            } else if (name.includes('clipboard') || name.includes('geolocation') || name.includes('battery') || name.includes('media devices') || name.includes('sensor')) {
                categories.permissions.threats.push(threat);
            } else if (name.includes('cname') || name.includes('syncing') || name.includes('post') || name.includes('css') || name.includes('header')) {
                categories.advanced.threats.push(threat);
            } else {
                categories.tracking.threats.push(threat);
            }
        });

        return categories;
    }

    (function() {
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        const suspiciousEvents = ['click', 'scroll', 'mousemove', 'keypress', 'keydown', 'keyup'];

        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (suspiciousEvents.includes(type)) {
                detectedEventTracking[type] = (detectedEventTracking[type] || 0) + 1;
            }
            return originalAddEventListener.apply(this, arguments);
        };
    })();

    (function() {
        if (navigator.clipboard && navigator.clipboard.readText) {
            const originalReadText = navigator.clipboard.readText;
            navigator.clipboard.readText = function(...args) {
                detectedClipboardAccess.push({
                    method: 'clipboard.readText',
                    timestamp: Date.now(),
                    stack: new Error().stack
                });
                return originalReadText.apply(this, args);
            };
        }

        if (navigator.clipboard && navigator.clipboard.read) {
            const originalRead = navigator.clipboard.read;
            navigator.clipboard.read = function(...args) {
                detectedClipboardAccess.push({
                    method: 'clipboard.read',
                    timestamp: Date.now(),
                    stack: new Error().stack
                });
                return originalRead.apply(this, args);
            };
        }

        const originalExecCommand = document.execCommand;
        document.execCommand = function(command, ...args) {
            if (command === 'paste') {
                detectedClipboardAccess.push({
                    method: 'execCommand(paste)',
                    timestamp: Date.now(),
                    stack: new Error().stack
                });
            }
            return originalExecCommand.apply(this, [command, ...args]);
        };
    })();

    (function() {
        const trackingParams = [
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
            'gclid', 'gclsrc', 'dclid', 'gbraid', 'wbraid',
            'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_source', 'fb_ref',
            'twclid', 'tw_source', 'tw_campaign',
            'li_fat_id', 'lipi',
            'msclkid', 'mc_cid', 'mc_eid',
            'ttclid', 'epik',
            'hsa_acc', 'hsa_cam', 'hsa_grp', 'hsa_ad', 'hsa_src', 'hsa_tgt', 'hsa_kw', 'hsa_mt', 'hsa_net', 'hsa_ver',
            '_ga', 'ref', 'source', 'campaign', 'ad_id', 'adid', 'ad_name',
            'affiliate_id', 'click_id', 'clickid', 'tracker', 'tracking_id'
        ];

        const currentURL = new URL(window.location.href);
        const params = new URLSearchParams(currentURL.search);

        params.forEach((value, key) => {
            const lowerKey = key.toLowerCase();
            if (trackingParams.some(tp => lowerKey.includes(tp.toLowerCase()))) {
                detectedURLTrackingParams.push({
                    param: key,
                    value: value,
                    timestamp: Date.now()
                });
            }
        });
    })();

    (function() {
        const methods = {
            toDataURL: HTMLCanvasElement.prototype.toDataURL,
            toBlob: HTMLCanvasElement.prototype.toBlob,
            getImageData: CanvasRenderingContext2D.prototype.getImageData
        };

        ['toDataURL', 'toBlob'].forEach(method => {
            HTMLCanvasElement.prototype[method] = function(...args) {
                detectedCanvasFingerprinting.push({method, timestamp: Date.now(), stack: new Error().stack});
                return methods[method].apply(this, args);
            };
        });

        CanvasRenderingContext2D.prototype.getImageData = function(...args) {
            detectedCanvasFingerprinting.push({method: 'getImageData', timestamp: Date.now(), stack: new Error().stack});
            return methods.getImageData.apply(this, args);
        };
    })();

    (function() {
        const sensitiveParams = ['VENDOR', 'RENDERER', 'VERSION', 'SHADING_LANGUAGE_VERSION', 37445, 37446];

        [WebGLRenderingContext, window.WebGL2RenderingContext].filter(Boolean).forEach(ctx => {
            const original = ctx.prototype.getParameter;
            ctx.prototype.getParameter = function(param) {
                if (sensitiveParams.includes(param) || sensitiveParams.includes(this[param])) {
                    detectedWebGLFingerprinting.push({parameter: param, timestamp: Date.now(), stack: new Error().stack});
                }
                return original.apply(this, arguments);
            };
        });
    })();

    (function() {
        const OriginalAudioContext = window.AudioContext || window.webkitAudioContext;
        if (OriginalAudioContext) {
            window.AudioContext = window.webkitAudioContext = function(...args) {
                detectedAudioFingerprinting.push({method: 'AudioContext created', timestamp: Date.now(), stack: new Error().stack});
                return new OriginalAudioContext(...args);
            };
        }
    })();

    (function() {
        const original = CanvasRenderingContext2D.prototype.measureText;
        let count = 0;
        CanvasRenderingContext2D.prototype.measureText = function(...args) {
            if (++count > 10) {
                detectedFontFingerprinting.push({method: 'measureText', count, timestamp: Date.now(), stack: new Error().stack});
                count = 0;
            }
            return original.apply(this, args);
        };
    })();

    (function() {
        let count = 0;
        ['width', 'height', 'availWidth', 'availHeight', 'colorDepth', 'pixelDepth'].forEach(prop => {
            const desc = Object.getOwnPropertyDescriptor(Screen.prototype, prop) || Object.getOwnPropertyDescriptor(window.screen, prop);
            if (desc?.get) {
                Object.defineProperty(Screen.prototype, prop, {
                    get: function() {
                        if (++count > 5) {
                            detectedScreenFingerprinting.push({property: prop, timestamp: Date.now(), stack: new Error().stack});
                            count = 0;
                        }
                        return desc.get.call(this);
                    }
                });
            }
        });
    })();

    if (navigator.getBattery) {
        const original = navigator.getBattery;
        navigator.getBattery = function(...args) {
            detectedBatteryFingerprinting.push({method: 'getBattery', timestamp: Date.now(), stack: new Error().stack});
            return original.apply(this, args);
        };
    }

    if (navigator.mediaDevices?.enumerateDevices) {
        const original = navigator.mediaDevices.enumerateDevices;
        navigator.mediaDevices.enumerateDevices = function(...args) {
            detectedMediaDevices.push({method: 'enumerateDevices', timestamp: Date.now()});
            return original.apply(this, args);
        };
    }

    (function() {
        ['Accelerometer', 'Gyroscope', 'Magnetometer', 'AbsoluteOrientationSensor', 'RelativeOrientationSensor'].forEach(type => {
            if (window[type]) {
                const Original = window[type];
                window[type] = function(...args) {
                    detectedSensors.push({type, timestamp: Date.now()});
                    return new Original(...args);
                };
            }
        });

        ['deviceorientation', 'devicemotion'].forEach(type => {
            if (window[type === 'deviceorientation' ? 'DeviceOrientationEvent' : 'DeviceMotionEvent']) {
                window.addEventListener(type, function() {
                    if (!detectedSensors.some(s => s.type === type)) {
                        detectedSensors.push({type, timestamp: Date.now()});
                    }
                }, true);
            }
        });
    })();

    if (navigator.serviceWorker) {
        const original = navigator.serviceWorker.register;
        navigator.serviceWorker.register = function(...args) {
            detectedServiceWorkers.push({url: args[0], timestamp: Date.now()});
            return original.apply(this, args);
        };
    }

    if (window.caches) {
        const original = caches.open;
        caches.open = function(...args) {
            detectedCacheAPI.push({cacheName: args[0], timestamp: Date.now()});
            return original.apply(this, args);
        };
    }

    if (window.openDatabase) {
        const original = window.openDatabase;
        window.openDatabase = function(...args) {
            detectedWebSQL.push({dbName: args[0], timestamp: Date.now()});
            return original.apply(this, args);
        };
    }

    if (window.webkitRequestFileSystem) {
        const original = window.webkitRequestFileSystem;
        window.webkitRequestFileSystem = function(...args) {
            detectedFileSystem.push({type: args[0], timestamp: Date.now()});
            return original.apply(this, args);
        };
    }

    (function() {
        const originalSetItem = Storage.prototype.setItem;
        const trackingPatterns = [/^_ga/, /^_fb/, /^uuid/, /^guid/, /^user.*id/i, /^visitor.*id/i, /^track/i, /^analytics/i, /fingerprint/i, /^client.*id/i];

        Storage.prototype.setItem = function(key, value) {
            if (this === localStorage && trackingPatterns.some(p => p.test(key))) {
                detectedLocalStorageTracking.push({key, valueLength: value.length, timestamp: Date.now(), stack: new Error().stack});
            }
            return originalSetItem.apply(this, arguments);
        };
    })();

    (function() {
        const trackingPatterns = [/^_ga/, /^_fb/, /^uuid/, /^guid/, /^user.*id/i, /^visitor.*id/i, /^track/i, /^analytics/i, /fingerprint/i];
        const originalSessionSet = sessionStorage.setItem;
        sessionStorage.setItem = function(key, value) {
            if (trackingPatterns.some(p => p.test(key))) {
                detectedSessionStorageTracking.push({key, valueLength: value.length, timestamp: Date.now(), stack: new Error().stack});
            }
            return originalSessionSet.apply(this, arguments);
        };
    })();

    (function() {
        if (!window.indexedDB) return;
        const original = indexedDB.open;
        indexedDB.open = function(...args) {
            detectedIndexedDBTracking.push({dbName: args[0], version: args[1], timestamp: Date.now(), stack: new Error().stack});
            return original.apply(this, args);
        };
    })();

    (function() {
        if (window.RTCPeerConnection) {
            const OriginalRTC = window.RTCPeerConnection;
            window.RTCPeerConnection = function(...args) {
                detectedWebRTCUsage.push({timestamp: Date.now(), stack: new Error().stack, config: args[0]});
                return new OriginalRTC(...args);
            };
            window.RTCPeerConnection.prototype = OriginalRTC.prototype;
        }

        ['webkitRTCPeerConnection', 'mozRTCPeerConnection'].forEach(variant => {
            if (window[variant]) {
                const Original = window[variant];
                window[variant] = function(...args) {
                    detectedWebRTCUsage.push({timestamp: Date.now(), stack: new Error().stack, config: args[0]});
                    return new Original(...args);
                };
                window[variant].prototype = Original.prototype;
            }
        });
    })();

    const ipGeoServices = ["ipinfo.io", "ip-api.com", "ipgeolocation.io", "geoip-db.com", "freegeoip.app", "ip2location.com", "extreme-ip-lookup.com", "ip-geolocation.whoisxmlapi.com", "ipligence.com", "bigdatacloud.com", "maxmind.com", "db-ip.com", "ipinfodb.com", "ipdata.co", "abstractapi.com", "ipapi.com", "ipstack.com", "geo.ipify.org", "ipwhois.io", "ipregistry.co", "telize.com", "geoplugin.com", "api.iplocation.net", "geolocation-db.com", "ipapi.co"];
    const geoPatterns = [/\/geo/i, /\/location/i, /\/ip.*location/i, /\/geoip/i, /\/country/i, /\/city/i, /\/region/i, /geolocation/i, /whereami/i, /mylocation/i];

    function isGeolocationRequest(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();
            const pathname = urlObj.pathname.toLowerCase();
            const fullUrl = url.toLowerCase();

            if (ipGeoServices.some(s => hostname.includes(s) || fullUrl.includes(s))) return true;

            return geoPatterns.some(p => (p.test(pathname) || p.test(fullUrl)) &&
                (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(fullUrl) || fullUrl.includes('json') || fullUrl.includes('api') || pathname.includes('geo') || pathname.includes('location')));
        } catch (e) {
            return false;
        }
    }

    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const reqUrl = typeof args[0] === "string" ? args[0] : args[0]?.url;
        if (reqUrl && isGeolocationRequest(reqUrl)) {
            detectedIPGeolocationRequests.push({url: reqUrl});
        }

        const response = await originalFetch.apply(this, args);
        const responseClone = response.clone();
        try {
            const etag = responseClone.headers.get("ETag");
            if (etag) detectedETags.push({url: responseClone.url, etag});
        } catch (err) {}
        return response;
    };

    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(...args) {
        const reqUrl = args[1];
        if (reqUrl && isGeolocationRequest(reqUrl)) {
            detectedIPGeolocationRequests.push({url: reqUrl});
        }

        this.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {
                try {
                    const etag = this.getResponseHeader("ETag");
                    if (etag) detectedETags.push({url: this.responseURL, etag});
                } catch (err) {}
            }
        });
        return originalXHROpen.apply(this, args);
    };

    function getCookies() {
        return document.cookie.split(';').map(c => c.trim()).filter(c => c);
    }

    function detectWebBeacons() {
        return Array.from(document.getElementsByTagName("img"))
            .filter(img => {
                const w = img.getAttribute("width") || img.width;
                const h = img.getAttribute("height") || img.height;
                const cs = window.getComputedStyle(img);
                return (parseInt(w) === 1 && parseInt(h) === 1) || (img.naturalWidth === 1 && img.naturalHeight === 1) || (cs.width === "1px" && cs.height === "1px");
            })
            .map(img => ({name: "Web Beacon", src: img.src, danger: "medium", description: "Detected a 1x1 pixel image that could be used as a web beacon."}));
    }

    function detectEtagTracking() {
        return detectedETags.map(item => ({name: "ETag Tracking", danger: "medium", description: `ETag detected from ${item.url} with value ${item.etag}`}));
    }

    function detectIPGeolocation() {
        return detectedIPGeolocationRequests.map(item => ({name: "IP Geolocation", danger: "high", description: `IP Geolocation request detected to ${item.url}`}));
    }

    function detectTrackersSync() {
        const knownTrackers = [
            {name: 'Google Analytics (Universal)', regex: /google-analytics\.com\/analytics\.js|google-analytics\.com\/ga\.js/, danger: 'high', description: 'Tracks user behavior for analytics and advertising purposes.'},
            {name: 'Google Analytics 4', regex: /googletagmanager\.com\/gtag\/js/, danger: 'high', description: 'Next generation Google Analytics tracking.'},
            {name: 'Google Tag Manager', regex: /googletagmanager\.com\/gtm\.js/, danger: 'high', description: 'Manages JavaScript and HTML tags for tracking purposes.'},
            {name: 'Google AdSense', regex: /pagead2\.googlesyndication\.com/, danger: 'medium', description: 'Google ad network, tracks user activity for ads.'},
            {name: 'Google DoubleClick', regex: /doubleclick\.net/, danger: 'high', description: 'Google ad serving and tracking platform.'},
            {name: 'Google Ads Conversion', regex: /googleadservices\.com/, danger: 'medium', description: 'Tracks ad conversions for Google Ads.'},
            {name: 'Google reCAPTCHA', regex: /recaptcha\/api\.js/, danger: 'low', description: 'Google CAPTCHA service that may track user behavior.'},
            {name: 'Facebook Pixel', regex: /connect\.facebook\.net\/.*\/fbevents\.js/, danger: 'high', description: 'Tracks user activity for targeted ads on Facebook.'},
            {name: 'Facebook SDK', regex: /connect\.facebook\.net\/.*\/sdk\.js/, danger: 'medium', description: 'Facebook social features and tracking.'},
            {name: 'Hotjar', regex: /static\.hotjar\.com\//, danger: 'high', description: 'Records user behavior including clicks, scrolling, and heatmaps.'},
            {name: 'Mixpanel', regex: /cdn\.mxpnl\.com/, danger: 'high', description: 'Advanced analytics tracking user events and behaviors.'},
            {name: 'Adobe Analytics', regex: /omtrdc\.net|2o7\.net/, danger: 'high', description: 'Enterprise analytics and marketing tracking.'},
            {name: 'Segment', regex: /cdn\.segment\.com/, danger: 'high', description: 'Customer data platform that tracks user interactions.'},
            {name: 'Heap Analytics', regex: /heapanalytics\.com/, danger: 'high', description: 'Automatically captures all user interactions.'},
            {name: 'Amplitude', regex: /cdn\.amplitude\.com/, danger: 'medium', description: 'Product analytics tracking user behavior.'},
            {name: 'Crazy Egg', regex: /script\.crazyegg\.com/, danger: 'medium', description: 'Heatmap and user behavior tracking.'},
            {name: 'FullStory', regex: /fullstory\.com/, danger: 'high', description: 'Session replay and user behavior recording.'},
            {name: 'Mouseflow', regex: /cdn\.mouseflow\.com/, danger: 'high', description: 'Session replay and heatmap tracking.'},
            {name: 'Lucky Orange', regex: /luckyorange\.com/, danger: 'high', description: 'Live chat and session recording.'},
            {name: 'Criteo', regex: /static\.criteo\.net/, danger: 'high', description: 'Retargeting and personalized advertising.'},
            {name: 'Taboola', regex: /cdn\.taboola\.com/, danger: 'medium', description: 'Content recommendation and advertising.'},
            {name: 'Outbrain', regex: /outbrain\.com/, danger: 'medium', description: 'Content discovery and advertising platform.'},
            {name: 'AdRoll', regex: /d\.adroll\.com/, danger: 'high', description: 'Retargeting and display advertising.'},
            {name: 'Amazon Ads', regex: /amazon-adsystem\.com/, danger: 'medium', description: 'Amazon advertising and tracking.'},
            {name: 'Bing Ads', regex: /bat\.bing\.com/, danger: 'medium', description: 'Microsoft Bing advertising tracking.'},
            {name: 'Twitter Ads', regex: /static\.ads-twitter\.com/, danger: 'medium', description: 'Twitter advertising pixel.'},
            {name: 'LinkedIn Insight', regex: /snap\.licdn\.com/, danger: 'medium', description: 'LinkedIn conversion tracking.'},
            {name: 'Pinterest Tag', regex: /ct\.pinterest\.com/, danger: 'medium', description: 'Pinterest advertising tracking.'},
            {name: 'TikTok Pixel', regex: /analytics\.tiktok\.com/, danger: 'medium', description: 'TikTok advertising and conversion tracking.'},
            {name: 'Snapchat Pixel', regex: /sc-static\.net/, danger: 'medium', description: 'Snapchat advertising tracking.'},
            {name: 'HubSpot', regex: /js\.hs-scripts\.com/, danger: 'high', description: 'Marketing automation and CRM tracking.'},
            {name: 'Marketo', regex: /munchkin\.marketo\.net/, danger: 'high', description: 'Marketing automation platform.'},
            {name: 'Pardot', regex: /pi\.pardot\.com/, danger: 'high', description: 'Salesforce B2B marketing automation.'},
            {name: 'Intercom', regex: /widget\.intercom\.io/, danger: 'medium', description: 'Customer messaging and behavior tracking.'},
            {name: 'Drift', regex: /js\.driftt\.com/, danger: 'medium', description: 'Conversational marketing and chat.'},
            {name: 'Optimizely', regex: /cdn\.optimizely\.com/, danger: 'medium', description: 'A/B testing and experimentation platform.'},
            {name: 'Cloudflare Insights', regex: /static\.cloudflareinsights\.com/, danger: 'low', description: 'Cloudflare analytics and performance monitoring.'},
            {name: 'Quantcast', regex: /quantserve\.com/, danger: 'high', description: 'Audience measurement and targeting.'},
            {name: 'Yandex Metrica', regex: /mc\.yandex\.ru/, danger: 'high', description: 'Russian analytics and tracking service.'}
        ];

        const trackers = knownTrackers.filter(t => document.body.innerHTML.match(t.regex)).map(t => ({name: t.name, danger: t.danger, description: t.description}));
        return [...trackers, ...detectWebBeacons(), ...detectEtagTracking(), ...detectIPGeolocation(), ...detectWebRTCTracking(), ...detectEventTracking()];
    }

    function detectZombieCookies() {
        return new Promise(resolve => {
            const legitimatePatterns = [/^session/i, /^sess/i, /^sid/i, /^phpsessid/i, /^jsessionid/i, /^aspsessionid/i, /^asp\.net.*session/i, /^auth/i, /^token/i, /^access.*token/i, /^refresh.*token/i, /^jwt/i, /^oauth/i, /^sso/i, /^saml/i, /^login/i, /^user.*id/i, /^uid/i, /^remember/i, /^keep.*logged/i, /^stay.*logged/i, /^csrf/i, /^xsrf/i, /^x.*csrf/i, /^antiforgery/i, /^request.*verification/i, /^cart/i, /^basket/i, /^shopping/i, /^checkout/i, /^order/i, /^wishlist/i, /consent/i, /cookie.*accept/i, /cookie.*consent/i, /gdpr/i, /privacy.*accept/i, /terms.*accept/i, /preference/i, /settings/i, /language/i, /locale/i, /lang/i, /timezone/i, /theme/i, /dark.*mode/i, /view.*mode/i, /currency/i, /region/i];
            const isLegitimate = name => legitimatePatterns.some(p => p.test(name));

            const initial = document.cookie.split(';').map(c => c.trim()).filter(c => c).map(c => c.split('=')[0]);
            const suspicious = initial.filter(n => !isLegitimate(n));

            if (suspicious.length === 0) {
                resolve([]);
                return;
            }

            const values = {};
            suspicious.forEach(name => {
                const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
                if (match) values[name] = match[2];
            });

            suspicious.forEach(name => {
                document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
                document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname + ';';
            });

            setTimeout(() => {
                const current = document.cookie.split(';').map(c => c.trim()).filter(c => c).map(c => c.split('=')[0]);
                const zombies = suspicious.filter(name => current.includes(name)).map(name => {
                    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
                    return {name, originalValue: values[name], newValue: match ? match[2] : ''};
                });

                resolve(zombies.length > 0 ? [{name: "Zombie Cookies", danger: "high", description: `Website automatically recreated ${zombies.length} tracking cookie(s) after deletion: ${zombies.map(c => c.name).join(', ')}. This indicates persistent tracking behavior.`}] : []);
            }, 2000);
        });
    }

    async function detectAllTrackers() {
        const trackers = detectTrackersSync();
        const zombies = await detectZombieCookies();
        const webrtc = detectWebRTCTracking();

        const iframes = document.querySelectorAll('iframe');
        const currentDomain = window.location.hostname;
        iframes.forEach(iframe => {
            try {
                const src = iframe.src;
                if (src) {
                    const url = new URL(src);
                    const domain = url.hostname;
                    if (domain && domain !== currentDomain && !domain.includes(currentDomain)) {
                        detectedThirdPartyIframes.push({domain, src, timestamp: Date.now()});
                    }
                }
            } catch (e) {}
        });

        return [...trackers, ...zombies, ...webrtc];
    }

    async function detectFingerprinting() {
        const methods = [];

        if (detectedCanvasFingerprinting.length > 0) {
            const unique = [...new Set(detectedCanvasFingerprinting.map(d => d.method))];
            methods.push({name: 'Canvas Fingerprinting', danger: 'high', description: `Website is actively using Canvas API for fingerprinting. Methods: ${unique.join(', ')}. Detected ${detectedCanvasFingerprinting.length} call(s).`});
        }

        if (detectedWebGLFingerprinting.length > 0) {
            methods.push({name: 'WebGL Fingerprinting', danger: 'high', description: `Website is querying WebGL parameters for fingerprinting. Detected ${detectedWebGLFingerprinting.length} suspicious parameter request(s).`});
        }

        if (detectedFontFingerprinting.length > 0) {
            methods.push({name: 'Font Fingerprinting', danger: 'high', description: 'Website is measuring text extensively to detect installed fonts. This is a common fingerprinting technique.'});
        }

        if (detectedAudioFingerprinting.length > 0) {
            methods.push({name: 'AudioContext Fingerprinting', danger: 'high', description: `Website created ${detectedAudioFingerprinting.length} AudioContext(s), potentially for audio fingerprinting.`});
        }

        if (detectedScreenFingerprinting.length > 0) {
            const props = [...new Set(detectedScreenFingerprinting.map(s => s.property))];
            methods.push({name: 'Screen Fingerprinting', danger: 'medium', description: `Website is extensively querying screen properties for device identification: ${props.join(', ')}.`});
        }

        if (detectedBatteryFingerprinting.length > 0) {
            methods.push({name: 'Battery API Fingerprinting', danger: 'medium', description: 'Website is accessing Battery API, which can be used for fingerprinting.'});
        }

        if (detectedMediaDevices.length > 0) {
            methods.push({name: 'Media Devices Enumeration', danger: 'high', description: `Website is enumerating cameras, microphones, and speakers. Device lists are unique identifiers. Detected ${detectedMediaDevices.length} enumeration(s).`});
        }

        if (detectedSensors.length > 0) {
            const types = [...new Set(detectedSensors.map(s => s.type))];
            methods.push({name: 'Device Sensors Access', danger: 'high', description: `Website is accessing device sensors: ${types.join(', ')}. Sensor data can fingerprint devices.`});
        }

        if (detectedServiceWorkers.length > 0) {
            const urls = detectedServiceWorkers.map(sw => sw.url).slice(0, 2);
            methods.push({name: 'Service Worker Storage', danger: 'medium', description: `Website registered ${detectedServiceWorkers.length} Service Worker(s): ${urls.join(', ')}${detectedServiceWorkers.length > 2 ? '...' : ''}. These can store persistent identifiers.`});
        }

        if (detectedCacheAPI.length > 0) {
            const names = [...new Set(detectedCacheAPI.map(c => c.cacheName))];
            methods.push({name: 'Cache API Storage', danger: 'medium', description: `Website is using Cache API for storage (${names.length} cache(s)). Can be used for persistent tracking.`});
        }

        if (detectedWebSQL.length > 0) {
            const dbs = [...new Set(detectedWebSQL.map(db => db.dbName))];
            methods.push({name: 'WebSQL Database', danger: 'medium', description: `Website is using deprecated WebSQL for storage: ${dbs.join(', ')}. Often used for supercookies.`});
        }

        if (detectedFileSystem.length > 0) {
            methods.push({name: 'FileSystem API', danger: 'high', description: `Website is using FileSystem API (${detectedFileSystem.length} request(s)). Can store large amounts of tracking data.`});
        }

        if (detectedThirdPartyIframes.length > 0) {
            const domains = [...new Set(detectedThirdPartyIframes.map(i => i.domain))];
            methods.push({name: 'Third-Party Iframes', danger: 'high', description: `Detected ${detectedThirdPartyIframes.length} third-party iframe(s) from: ${domains.slice(0, 3).join(', ')}${domains.length > 3 ? ` and ${domains.length - 3} more` : ''}`});
        }

        if (detectedLocalStorageTracking.length > 0) {
            const keys = [...new Set(detectedLocalStorageTracking.map(l => l.key))];
            methods.push({name: 'Local Storage Tracking', danger: 'high', description: `Website is storing tracking data in Local Storage. Keys: ${keys.slice(0, 3).join(', ')}${keys.length > 3 ? ` and ${keys.length - 3} more` : ''}`});
        }

        if (detectedSessionStorageTracking.length > 0) {
            const keys = [...new Set(detectedSessionStorageTracking.map(s => s.key))];
            methods.push({name: 'Session Storage Tracking', danger: 'medium', description: `Website is storing tracking data in Session Storage. Keys: ${keys.slice(0, 3).join(', ')}${keys.length > 3 ? ` and ${keys.length - 3} more` : ''}`});
        }

        if (detectedIndexedDBTracking.length > 0) {
            const dbs = [...new Set(detectedIndexedDBTracking.map(i => i.dbName))];
            methods.push({name: 'IndexedDB Tracking', danger: 'high', description: `Website is using IndexedDB for data storage: ${dbs.join(', ')}. Can store large amounts of tracking data.`});
        }

        if (detectedClipboardAccess.length > 0) {
            const methodsList = [...new Set(detectedClipboardAccess.map(c => c.method))];
            methods.push({name: 'Clipboard Snooping', danger: 'high', description: `Website is accessing your clipboard! Methods used: ${methodsList.join(', ')}. This is a serious privacy violation. Detected ${detectedClipboardAccess.length} access(es).`});
        }

        if (detectedURLTrackingParams.length > 0) {
            const params = detectedURLTrackingParams.map(p => p.param);
            methods.push({name: 'URL Tracking Parameters', danger: 'medium', description: `URL contains ${detectedURLTrackingParams.length} tracking parameter(s): ${params.slice(0, 5).join(', ')}${params.length > 5 ? '...' : ''}. These allow cross-site tracking.`});
        }

        return methods;
    }

    setTimeout(() => {
        detectCookieSyncing();
        detectSuspiciousHeaders();
        detectDOMStorageAbuse();
        detectNetworkTimingAttacks();
        detectCSSTracking();
        detectObfuscatedScripts();
        detectPOSTTracking();
        detectAdvancedFingerprinting();
    }, 1000);

    function calculatePrivacyScore(allThreats, cookies) {
        let score = 100;

        allThreats.forEach(threat => {
            if (threat.danger === 'high') score -= 8;
            else if (threat.danger === 'medium') score -= 4;
            else if (threat.danger === 'low') score -= 2;
        });

        if (cookies.length > 20) score -= 15;
        else if (cookies.length > 10) score -= 10;
        else if (cookies.length > 5) score -= 5;

        score = Math.max(0, score);

        let grade, color, message;
        if (score >= 90) {
            grade = 'A';
            color = '#28A745';
            message = 'Excellent privacy protection';
        } else if (score >= 75) {
            grade = 'B';
            color = '#5CB85C';
            message = 'Good privacy practices';
        } else if (score >= 60) {
            grade = 'C';
            color = '#FFA500';
            message = 'Moderate privacy concerns';
        } else if (score >= 40) {
            grade = 'D';
            color = '#FF8C00';
            message = 'Significant privacy issues';
        } else {
            grade = 'F';
            color = '#FF4C4C';
            message = 'Severe privacy violations';
        }

        return { score, grade, color, message };
    }

    async function showAuditResults() {
        function updateStatus(message, progress = 0) {
            windowContent.textContent = '';

            const progressContainer = document.createElement('div');
            progressContainer.style.cssText = 'width:100%!important;background-color:#555!important;border-radius:10px!important;overflow:hidden!important;margin:20px 0!important;height:30px!important;position:relative!important';

            const progressBar = document.createElement('div');
            progressBar.style.cssText = `width:${progress}%!important;height:100%!important;background:linear-gradient(90deg, #1CB5E0 0%, #000851 100%)!important;transition:width 0.3s ease!important;border-radius:10px!important`;

            const progressText = document.createElement('div');
            progressText.style.cssText = 'position:absolute!important;top:50%!important;left:50%!important;transform:translate(-50%, -50%)!important;color:#fff!important;font-weight:bold!important;font-size:0.9em!important;text-shadow:1px 1px 2px rgba(0,0,0,0.5)!important';
            progressText.textContent = `${progress}%`;

            progressContainer.appendChild(progressBar);
            progressContainer.appendChild(progressText);
            windowContent.appendChild(progressContainer);

            const statusText = document.createElement('p');
            statusText.style.cssText = 'text-align:center!important;margin-top:10px!important;font-size:1em!important';
            statusText.textContent = message;
            windowContent.appendChild(statusText);

            const spinner = document.createElement('div');
            spinner.className = 'aptloading-spinner';
            windowContent.appendChild(spinner);
        }

        if (isCacheValid()) {
            updateStatus('Loading cached results...', 100);
            auditWindow.style.display = "block";

            await new Promise(r => setTimeout(r, 500));

            displayResults(scanCache.results);

            const cacheNotice = document.createElement('div');
            cacheNotice.style.cssText = 'background-color:#444!important;padding:10px!important;margin:10px 0!important;border-radius:5px!important;text-align:center!important;font-size:0.9em!important;color:#FFA500!important';
            cacheNotice.textContent = `⚡ Cached results from ${Math.round((Date.now() - scanCache.timestamp) / 1000)} seconds ago. Click the button again to force a new scan after ${Math.round((scanCache.ttl - (Date.now() - scanCache.timestamp)) / 1000)} seconds.`;
            windowContent.insertBefore(cacheNotice, windowContent.firstChild.nextSibling);

            return;
        }

        updateStatus('Initializing scan...', 0);
        auditWindow.style.display = "block";

        await new Promise(r => setTimeout(r, 300));
        updateStatus('Detecting trackers and zombie cookies...', 10);
        const trackers = await detectAllTrackers();

        updateStatus('Waiting for dynamic fingerprinting attempts...', 25);
        await new Promise(r => setTimeout(r, 3000));

        updateStatus('Analyzing fingerprinting methods...', 40);
        const fingerprinting = await detectFingerprinting();

        updateStatus('Detecting cookie syncing...', 50);
        const cookieSyncing = detectCookieSyncing();

        updateStatus('Checking for CNAME cloaking...', 55);
        const cnameCloak = await detectCNAMECloaking();

        updateStatus('Analyzing HTTP headers...', 60);
        const suspiciousHeaders = detectSuspiciousHeaders();

        updateStatus('Examining DOM storage...', 65);
        const domStorageAbuse = detectDOMStorageAbuse();

        updateStatus('Detecting network timing attacks...', 70);
        const networkTiming = detectNetworkTimingAttacks();

        updateStatus('Analyzing CSS tracking...', 75);
        const cssTracking = detectCSSTracking();

        updateStatus('Scanning for obfuscated scripts...', 80);
        const obfuscated = detectObfuscatedScripts();

        updateStatus('Checking POST requests...', 85);
        const postTracking = detectPOSTTracking();

        updateStatus('Detecting advanced fingerprinting...', 90);
        const advancedFp = detectAdvancedFingerprinting();

        updateStatus('Collecting cookies...', 95);
        const cookies = getCookies();

        updateStatus('Generating report...', 98);
        const allThreats = [
            ...trackers,
            ...fingerprinting,
            ...cookieSyncing,
            ...cnameCloak,
            ...suspiciousHeaders,
            ...domStorageAbuse,
            ...networkTiming,
            ...cssTracking,
            ...obfuscated,
            ...postTracking,
            ...advancedFp
        ];

        const privacyScore = calculatePrivacyScore(allThreats, cookies);
        const categorizedThreats = categorizeThreats(allThreats);

        updateStatus('Finalizing...', 100);
        await new Promise(r => setTimeout(r, 300));

        const results = {
            allThreats,
            privacyScore,
            categorizedThreats,
            cookies
        };
        saveScanToCache(results);

        displayResults(results);

        detectedCookieSyncing = [];
        detectedCNAMECloaking = [];
        detectedSuspiciousHeaders = [];
        detectedDOMStorageAbuse = [];
        detectedNetworkTimingAttacks = [];
        detectedCSSTracking = [];
        detectedObfuscatedScripts = [];
        detectedPOSTTracking = [];
        detectedAdvancedFingerprinting = [];
    }

    function displayResults(results) {
        const { allThreats, privacyScore, categorizedThreats, cookies } = results;

        windowContent.textContent = '';

        const title = document.createElement('h2');
        title.className = 'aptTitle';
        title.textContent = 'Privacy Audit Results';
        windowContent.appendChild(title);

        const scoresContainer = document.createElement('div');
        scoresContainer.style.cssText = 'display:flex!important;gap:15px!important;margin:20px 0!important';

        const privacyScoreCard = document.createElement('div');
        privacyScoreCard.style.cssText = 'flex:1!important;text-align:center!important;padding:20px!important;background:linear-gradient(135deg, #1CB5E0 0%, #000851 100%)!important;border-radius:15px!important;box-shadow:0 10px 30px rgba(0,0,0,0.3)!important';

        const privacyTitle = document.createElement('div');
        privacyTitle.style.cssText = 'font-size:0.9em!important;color:#fff!important;opacity:0.8!important;margin-bottom:5px!important';
        privacyTitle.textContent = 'Privacy Score';

        const privacyGradeDiv = document.createElement('div');
        privacyGradeDiv.style.cssText = `font-size:2.5em!important;font-weight:bold!important;color:${privacyScore.color}!important;text-shadow:2px 2px 4px rgba(0,0,0,0.3)!important;margin-bottom:5px!important`;
        privacyGradeDiv.textContent = privacyScore.grade;

        const privacyScoreDiv = document.createElement('div');
        privacyScoreDiv.style.cssText = 'font-size:1.5em!important;font-weight:bold!important;color:#fff!important;margin-bottom:5px!important';
        privacyScoreDiv.textContent = `${privacyScore.score}/100`;

        const privacyMessageDiv = document.createElement('div');
        privacyMessageDiv.style.cssText = 'font-size:1em!important;color:#fff!important;opacity:0.9!important';
        privacyMessageDiv.textContent = privacyScore.message;

        privacyScoreCard.appendChild(privacyTitle);
        privacyScoreCard.appendChild(privacyGradeDiv);
        privacyScoreCard.appendChild(privacyScoreDiv);
        privacyScoreCard.appendChild(privacyMessageDiv);

        scoresContainer.appendChild(privacyScoreCard);
        windowContent.appendChild(scoresContainer);

        function createThreatItem(threat) {
            const li = document.createElement('li');
            li.style.cssText = 'background-color:#444!important;padding:0!important;margin:5px 0!important;border-radius:5px!important;word-wrap:break-word!important;position:relative!important;display:block!important;overflow:hidden!important;transition:background-color 0.2s!important';

            const header = document.createElement('div');
            header.style.cssText = 'padding:10px!important;cursor:pointer!important;display:flex!important;justify-content:space-between!important;align-items:center!important;user-select:none!important';

            const mainInfo = document.createElement('div');
            mainInfo.style.cssText = 'flex:1!important';

            const threatName = document.createElement('span');
            threatName.style.cssText = 'font-weight:bold!important';
            threatName.textContent = `${threat.name} `;

            const dangerSpan = document.createElement('span');
            dangerSpan.className = `aptDangerLevel aptDangerLevel${threat.danger.charAt(0).toUpperCase() + threat.danger.slice(1)}`;
            dangerSpan.textContent = threat.danger.charAt(0).toUpperCase() + threat.danger.slice(1);

            mainInfo.appendChild(threatName);
            mainInfo.appendChild(dangerSpan);

            const toggleIcon = document.createElement('span');
            toggleIcon.style.cssText = 'font-size:1.2em!important;transition:transform 0.3s!important;display:inline-block!important';
            toggleIcon.textContent = '▼';

            header.appendChild(mainInfo);
            header.appendChild(toggleIcon);

            const details = document.createElement('div');
            details.style.cssText = 'max-height:0!important;overflow:hidden!important;transition:max-height 0.3s ease!important;padding:0 10px!important';

            const detailsContent = document.createElement('div');
            detailsContent.style.cssText = 'padding:10px 0!important;border-top:1px solid #555!important;margin-top:5px!important';

            const description = document.createElement('p');
            description.style.cssText = 'margin:5px 0!important;line-height:1.4!important;color:#ddd!important';
            description.textContent = threat.description;
            detailsContent.appendChild(description);

            if (threat.details) {
                const detailsSection = document.createElement('div');
                detailsSection.style.cssText = 'margin-top:10px!important;padding:10px!important;background-color:#555!important;border-radius:5px!important;font-size:0.9em!important;border-left:3px solid #1CB5E0!important';

                const detailsTitle = document.createElement('div');
                detailsTitle.style.cssText = 'font-weight:bold!important;margin-bottom:8px!important;color:#1CB5E0!important;font-size:1em!important';
                detailsTitle.textContent = '📋 Technical Details';
                detailsSection.appendChild(detailsTitle);

                Object.entries(threat.details).forEach(([key, value]) => {
                    const detailLine = document.createElement('div');
                    detailLine.style.cssText = 'margin:5px 0!important;padding:5px 0!important;color:#ddd!important;border-bottom:1px solid #666!important;line-height:1.5!important';

                    const keySpan = document.createElement('strong');
                    keySpan.style.cssText = 'color:#FFA500!important;display:inline-block!important;min-width:150px!important';
                    keySpan.textContent = key + ':';

                    const valueSpan = document.createElement('span');
                    valueSpan.style.cssText = 'color:#ccc!important;word-break:break-word!important';
                    valueSpan.textContent = ' ' + value;

                    detailLine.appendChild(keySpan);
                    detailLine.appendChild(valueSpan);
                    detailsSection.appendChild(detailLine);
                });

                const lastLine = detailsSection.lastChild;
                if (lastLine && lastLine.style) {
                    lastLine.style.borderBottom = 'none';
                }

                detailsContent.appendChild(detailsSection);
            }

            details.appendChild(detailsContent);

            let isOpen = false;
            header.addEventListener('click', () => {
                isOpen = !isOpen;
                if (isOpen) {
                    details.style.maxHeight = details.scrollHeight + 'px';
                    toggleIcon.style.transform = 'rotate(180deg)';
                    li.style.backgroundColor = '#4a4a4a';
                } else {
                    details.style.maxHeight = '0';
                    toggleIcon.style.transform = 'rotate(0deg)';
                    li.style.backgroundColor = '#444';
                }
            });

            header.addEventListener('mouseenter', () => {
                if (!isOpen) {
                    li.style.backgroundColor = '#4a4a4a';
                }
            });
            header.addEventListener('mouseleave', () => {
                if (!isOpen) {
                    li.style.backgroundColor = '#444';
                }
            });

            li.appendChild(header);
            li.appendChild(details);

            return li;
        }

        Object.entries(categorizedThreats).forEach(([key, category]) => {
            if (category.threats.length === 0) return;

            const categoryContainer = document.createElement('div');
            categoryContainer.style.cssText = 'margin:15px 0!important';

            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'aptSectionTitle';
            categoryHeader.style.cssText = 'font-size:1.3em!important;font-weight:bold!important;margin-bottom:10px!important;margin-top:20px!important;padding:10px!important;border-bottom:2px solid #666!important;color:#fff!important;display:flex!important;justify-content:space-between!important;align-items:center!important;cursor:pointer!important;user-select:none!important;transition:background-color 0.2s!important;border-radius:5px!important';

            const categoryTitleSpan = document.createElement('span');
            categoryTitleSpan.textContent = `${category.icon} ${category.title} (${category.threats.length})`;

            const categoryToggle = document.createElement('span');
            categoryToggle.style.cssText = 'font-size:0.8em!important;transition:transform 0.3s!important;display:inline-block!important';
            categoryToggle.textContent = '▼';

            categoryHeader.appendChild(categoryTitleSpan);
            categoryHeader.appendChild(categoryToggle);

            const categoryList = document.createElement('ul');
            categoryList.style.cssText = 'max-height:none!important;overflow:visible!important;transition:max-height 0.3s ease, opacity 0.3s ease!important;opacity:1!important';

            category.threats.forEach(t => {
                categoryList.appendChild(createThreatItem(t));
            });

            let categoryOpen = true;
            categoryHeader.addEventListener('click', () => {
                categoryOpen = !categoryOpen;
                if (categoryOpen) {
                    categoryList.style.display = 'block';
                    categoryList.style.opacity = '1';
                    categoryToggle.style.transform = 'rotate(0deg)';
                    categoryHeader.style.backgroundColor = 'transparent';
                } else {
                    categoryList.style.display = 'none';
                    categoryList.style.opacity = '0';
                    categoryToggle.style.transform = 'rotate(-90deg)';
                    categoryHeader.style.backgroundColor = '#3a3a3a';
                }
            });

            categoryHeader.addEventListener('mouseenter', () => {
                if (categoryOpen) {
                    categoryHeader.style.backgroundColor = '#3a3a3a';
                }
            });
            categoryHeader.addEventListener('mouseleave', () => {
                if (categoryOpen) {
                    categoryHeader.style.backgroundColor = 'transparent';
                }
            });

            categoryContainer.appendChild(categoryHeader);
            categoryContainer.appendChild(categoryList);
            windowContent.appendChild(categoryContainer);
        });

        const cookiesContainer = document.createElement('div');
        cookiesContainer.style.cssText = 'margin:15px 0!important';

        const cookiesHeader = document.createElement('div');
        cookiesHeader.className = 'aptSectionTitle';
        cookiesHeader.style.cssText = 'font-size:1.3em!important;font-weight:bold!important;margin-bottom:10px!important;margin-top:20px!important;padding:10px!important;border-bottom:2px solid #666!important;color:#fff!important;display:flex!important;justify-content:space-between!important;align-items:center!important;cursor:pointer!important;user-select:none!important;transition:background-color 0.2s!important;border-radius:5px!important';

        const cookiesTitleSpan = document.createElement('span');
        cookiesTitleSpan.textContent = `🍪 Cookies (${cookies.length})`;

        const cookiesToggle = document.createElement('span');
        cookiesToggle.style.cssText = 'font-size:0.8em!important;transition:transform 0.3s!important;display:inline-block!important';
        cookiesToggle.textContent = '▼';

        cookiesHeader.appendChild(cookiesTitleSpan);
        cookiesHeader.appendChild(cookiesToggle);

        const cookiesList = document.createElement('ul');
        cookiesList.style.cssText = 'max-height:none!important;overflow:visible!important;transition:opacity 0.3s ease!important;opacity:1!important';

        if (cookies.length > 0) {
            cookies.forEach(c => {
                const li = document.createElement('li');
                li.textContent = c;
                cookiesList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'No cookies found.';
            cookiesList.appendChild(li);
        }

        let cookiesOpen = true;
        cookiesHeader.addEventListener('click', () => {
            cookiesOpen = !cookiesOpen;
            if (cookiesOpen) {
                cookiesList.style.display = 'block';
                cookiesList.style.opacity = '1';
                cookiesToggle.style.transform = 'rotate(0deg)';
                cookiesHeader.style.backgroundColor = 'transparent';
            } else {
                cookiesList.style.display = 'none';
                cookiesList.style.opacity = '0';
                cookiesToggle.style.transform = 'rotate(-90deg)';
                cookiesHeader.style.backgroundColor = '#3a3a3a';
            }
        });

        cookiesHeader.addEventListener('mouseenter', () => {
            if (cookiesOpen) {
                cookiesHeader.style.backgroundColor = '#3a3a3a';
            }
        });
        cookiesHeader.addEventListener('mouseleave', () => {
            if (cookiesOpen) {
                cookiesHeader.style.backgroundColor = 'transparent';
            }
        });

        cookiesContainer.appendChild(cookiesHeader);
        cookiesContainer.appendChild(cookiesList);
        windowContent.appendChild(cookiesContainer);

        const rescanButton = document.createElement('button');
        rescanButton.textContent = '🔄 Force New Scan';
        rescanButton.style.cssText = 'display:block!important;margin:20px auto 0!important;padding:10px 20px!important;background-color:#1CB5E0!important;color:#fff!important;border:none!important;border-radius:5px!important;cursor:pointer!important;font-size:1em!important;font-weight:bold!important;transition:background-color 0.3s!important';
        rescanButton.addEventListener('mouseover', () => {
            rescanButton.style.backgroundColor = '#0EA5D0';
        });
        rescanButton.addEventListener('mouseout', () => {
            rescanButton.style.backgroundColor = '#1CB5E0';
        });
        rescanButton.addEventListener('click', () => {
            clearScanCache();
            auditWindow.style.display = "none";
            showAuditResults();
        });
        windowContent.appendChild(rescanButton);

        const rescanNote = document.createElement('div');
        rescanNote.style.cssText = 'background-color:#555!important;padding:8px!important;margin:10px 0 0!important;border-radius:5px!important;text-align:center!important;font-size:0.85em!important;color:#ccc!important;line-height:1.4!important';
        rescanNote.textContent = '⚠️ Note: Forcing a rescan without refreshing the page may miss some initial threats that only trigger on page load (e.g., scripts, initial storage access).';
        windowContent.appendChild(rescanNote);
    }

    const scanButton = document.createElement("button");
    scanButton.id = "aptScanButton";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "32");
    svg.setAttribute("height", "32");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.style.cssText = "display:block;margin:0 auto";

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z");
    path1.setAttribute("stroke", "white");
    path1.setAttribute("stroke-width", "2");
    path1.setAttribute("stroke-linecap", "round");
    path1.setAttribute("stroke-linejoin", "round");

    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", "M10 7V10L12 12");
    path2.setAttribute("stroke", "white");
    path2.setAttribute("stroke-width", "2");
    path2.setAttribute("stroke-linecap", "round");
    path2.setAttribute("stroke-linejoin", "round");

    svg.appendChild(path1);
    svg.appendChild(path2);
    scanButton.appendChild(svg);

    scanButton.style.cssText = "position:fixed!important;bottom:10px!important;left:10px!important;padding:15px 20px!important;border:none!important;background-color:black!important;color:#fff!important;border-radius:10px!important;cursor:pointer!important;z-index:2147483647!important;box-shadow:0 4px 8px rgba(0,0,0,0.3)!important;transition:background-color 0.3s,transform 0.3s!important;font-family:Arial,sans-serif!important;font-size:18px!important;line-height:1!important;text-align:center!important;min-width:auto!important;min-height:auto!important;max-width:none!important;max-height:none!important;margin:0!important";

    scanButton.addEventListener("mouseover", () => {
        scanButton.style.backgroundColor = "#333";
        scanButton.style.transform = "scale(1.05)";
    });
    scanButton.addEventListener("mouseout", () => {
        scanButton.style.backgroundColor = "black";
        scanButton.style.transform = "scale(1)";
    });

    document.body.appendChild(scanButton);

    const auditWindow = document.createElement("div");
    auditWindow.id = "aptAuditWindow";
    auditWindow.style.cssText = "display:none!important;position:fixed!important;top:0!important;left:0!important;width:100%!important;height:100%!important;background-color:rgba(0,0,0,0.7)!important;color:#fff!important;font-family:Arial,sans-serif!important;overflow:auto!important;padding:20px!important;z-index:2147483646!important;box-sizing:border-box!important;margin:0!important;border:none!important";

    const windowContent = document.createElement("div");
    windowContent.className = "aptWindowContent";
    windowContent.style.cssText = "max-width:800px!important;margin:50px auto!important;background-color:#333!important;border-radius:8px!important;padding:20px!important;box-shadow:0 0 20px rgba(0,0,0,0.5)!important;overflow-y:auto!important;max-height:80%!important;box-sizing:border-box!important;color:#fff!important;font-family:Arial,sans-serif!important;font-size:16px!important;line-height:1.5!important";

    auditWindow.appendChild(windowContent);
    document.body.appendChild(auditWindow);

    auditWindow.addEventListener("click", e => {
        if (e.target === auditWindow) auditWindow.style.display = "none";
    });

    GM_addStyle(`#aptAuditWindow *{box-sizing:border-box!important;font-family:Arial,sans-serif!important;color:#fff!important;margin:0!important;padding:0!important;border:none!important;background:transparent!important;text-decoration:none!important;text-transform:none!important;letter-spacing:normal!important;word-spacing:normal!important;line-height:1.5!important}#aptAuditWindow .aptWindowContent{max-width:800px!important;margin:50px auto!important;background-color:#333!important;border-radius:8px!important;padding:20px!important;box-shadow:0 0 20px rgba(0,0,0,0.5)!important;overflow-y:auto!important;max-height:80%!important}#aptAuditWindow .aptWindowContent h2{text-align:center!important;margin-bottom:20px!important;margin-top:0!important;font-size:1.8em!important;font-weight:bold!important;padding:0!important}#aptAuditWindow .aptWindowContent p{font-size:1em!important;line-height:1.5!important;margin:10px 0!important;padding:0!important}#aptAuditWindow .aptWindowContent ul{list-style-type:none!important;padding:0!important;margin:0!important}#aptAuditWindow .aptWindowContent li{background-color:#444!important;padding:10px!important;margin:5px 0!important;border-radius:5px!important;word-wrap:break-word!important;position:relative!important;display:block!important}#aptAuditWindow .aptTitle{font-weight:bold!important;font-family:Arial,sans-serif!important;color:#fff!important}#aptAuditWindow .aptSectionTitle{font-size:1.3em!important;font-weight:bold!important;margin-bottom:10px!important;margin-top:20px!important;padding-bottom:5px!important;padding-top:0!important;padding-left:0!important;padding-right:0!important;border-bottom:2px solid #666!important;color:#fff!important;display:block!important}#aptAuditWindow .aptDangerLevel{font-weight:bold!important;font-size:1.1em!important}#aptAuditWindow .aptDangerLevelLow{color:#28A745!important}#aptAuditWindow .aptDangerLevelMedium{color:#FFA500!important}#aptAuditWindow .aptDangerLevelHigh{color:#FF4C4C!important}#aptAuditWindow .aptloading-spinner{border:4px solid rgba(255,255,255,0.3)!important;border-top:4px solid #fff!important;border-radius:50%!important;width:40px!important;height:40px!important;animation:spin 1s linear infinite!important;margin:20px auto!important;display:block!important}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`);

    scanButton.addEventListener("click", showAuditResults);
})();