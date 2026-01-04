// ==UserScript==
// @name         Ultimate Privacy Shield
// @version      4.0.5
// @description  Lightweight privacy protection with tracking script blocking, precise video player detection, and Tampermonkey optimization
// @license MIT
// @author       Boris Likhachev
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        none
// @namespace https://greasyfork.org/users/764793
// @downloadURL https://update.greasyfork.org/scripts/543463/Ultimate%20Privacy%20Shield.user.js
// @updateURL https://update.greasyfork.org/scripts/543463/Ultimate%20Privacy%20Shield.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const stats = {
        cleanedUrls: 0,
        trackersBlocked: 0,
        errorsDetected: 0,
        videoEventsProcessed: 0,
        adGuardBlocks: 0
    };
    const debugMode = GM_getValue('upsDebugMode', false);
    const fastPathMode = GM_getValue('fastPathMode', true);

    const debugLog = (message) => {
        if (debugMode) console.log(`[UPS ${new Date().toISOString()}] ${message}`);
    };

    const loadConfig = () => {
        const defaultConfig = {
            userDisabledSites: [],
            lastUpdated: Date.now(),
            customVideoSelectors: [],
            blockedTrackerDomains: [
                'google-analytics.com',
                'doubleclick.net',
                'facebook.com',
                'hotjar.com',
                'mixpanel.com',
                'amplitude.com',
                'googletagmanager.com'
            ],
            trackerKeywords: ['trackevent', 'analytics', 'collect', 'beacon'],
            allowedVideoScripts: ['video-search-pc.js', 'phub.js', 'player']
        };
        try {
            const storedConfig = GM_getValue('upsConfig', null);
            if (!storedConfig || storedConfig.lastUpdated < Date.now() - 30 * 24 * 60 * 60 * 1000) {
                debugLog('Config outdated or missing, using default');
                return defaultConfig;
            }
            storedConfig.userDisabledSites = []; // Force reset
            debugLog(`Loaded config with userDisabledSites: ${JSON.stringify(storedConfig.userDisabledSites)}`);
            return { ...defaultConfig, ...storedConfig };
        } catch (error) {
            debugLog(`Error in loadConfig: ${error.message}`);
            return defaultConfig;
        }
    };

    const config = loadConfig();

    const saveConfig = (config) => {
        try {
            config.lastUpdated = Date.now();
            GM_setValue('upsConfig', config);
        } catch (error) {
            debugLog(`Error in saveConfig: ${error.message}`);
        }
    };

    const runWhenIdle = (callback) => {
        try {
            if ('requestIdleCallback' in window) {
                window.requestIdleCallback(callback, { timeout: 1500 });
            } else {
                setTimeout(callback, 500);
            }
        } catch (error) {
            debugLog(`Error in runWhenIdle: ${error.message}`);
            stats.errorsDetected++;
        }
    };

    const getRealHostname = () => {
        try {
            const hostname = new URL(window.location.href).hostname;
            if (hostname === 'local.adguard.org') {
                const realUrl = document.referrer || document.querySelector('meta[property="og:url"]')?.content || window.location.href;
                const realHostname = new URL(realUrl).hostname;
                debugLog(`AdGuard proxy detected, resolved hostname: ${realHostname}`);
                return realHostname;
            }
            return hostname;
        } catch (error) {
            debugLog(`Error detecting hostname: ${error.message}`);
            return window.location.hostname;
        }
    };

    const isSiteDisabled = () => config.userDisabledSites.includes(getRealHostname());

    const blockTrackingScripts = () => {
        try {
            const scripts = document.querySelectorAll('script[src]');
            for (const script of scripts) {
                const src = script.src.toLowerCase();
                if (
                    config.blockedTrackerDomains.some(domain => src.includes(domain)) ||
                    config.trackerKeywords.some(keyword => src.includes(keyword))
                ) {
                    if (!config.allowedVideoScripts.some(allowed => src.includes(allowed))) {
                        script.remove();
                        stats.trackersBlocked++;
                        debugLog(`Blocked tracking script: ${src || 'inline'}`);
                    }
                }
            }
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.tagName === 'SCRIPT' && node.src) {
                            const src = node.src.toLowerCase();
                            if (
                                config.blockedTrackerDomains.some(domain => src.includes(domain)) ||
                                config.trackerKeywords.some(keyword => src.includes(keyword))
                            ) {
                                if (!config.allowedVideoScripts.some(allowed => src.includes(allowed))) {
                                    node.remove();
                                    stats.trackersBlocked++;
                                    debugLog(`Blocked dynamic script: ${src}`);
                                }
                            }
                        }
                    }
                }
            });
            observer.observe(document.head, { childList: true });
            debugLog('Tracking script blocker initialized');
        } catch (error) {
            debugLog(`Error in blockTrackingScripts: ${error.message}`);
            stats.errorsDetected++;
        }
    };

    const blockCanvasFingerprinting = () => {
        try {
            const originalGetContext = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function(type, attributes) {
                if (type === '2d' || type === 'webgl') {
                    debugLog('Canvas access detected, applying noise');
                    const ctx = originalGetContext.apply(this, arguments);
                    if (ctx) {
                        const originalFillText = ctx.fillText;
                        ctx.fillText = function(...args) {
                            args[0] += String.fromCharCode(Math.random() * 5);
                            return originalFillText.apply(this, args);
                        };
                        const originalGetImageData = ctx.getImageData;
                        ctx.getImageData = function(...args) {
                            const data = originalGetImageData.apply(this, args);
                            for (let i = 0; i < data.data.length; i += 4) {
                                data.data[i] += Math.random() * 2 - 1;
                            }
                            return data;
                        };
                    }
                    return ctx;
                }
                return originalGetContext.apply(this, arguments);
            };
            debugLog('Canvas fingerprinting protection enabled');
        } catch (error) {
            debugLog(`Error in blockCanvasFingerprinting: ${error.message}`);
            stats.errorsDetected++;
        }
    };

    const blockAudioFingerprinting = () => {
        try {
            if (window.AudioContext || window.webkitAudioContext) {
                window.AudioContext = window.webkitAudioContext = () => {
                    debugLog('AudioContext access blocked');
                    throw new Error('AudioContext blocked by UPS');
                };
                Object.defineProperty(window, 'AudioContext', { value: undefined, writable: false });
                Object.defineProperty(window, 'webkitAudioContext', { value: undefined, writable: false });
                debugLog('Audio fingerprinting protection enabled');
            }
        } catch (error) {
            debugLog(`Error in blockAudioFingerprinting: ${error.message}`);
            stats.errorsDetected++;
        }
    };

    const blockWebGPU = () => {
        try {
            if (window.GPU) {
                Object.defineProperty(window, 'GPU', { value: undefined, writable: false });
                debugLog('WebGPU blocked');
            }
        } catch (error) {
            debugLog(`Error in blockWebGPU: ${error.message}`);
            stats.errorsDetected++;
        }
    };

    const blockWebTransport = () => {
        try {
            if (window.WebTransport) {
                window.WebTransport = () => {
                    throw new Error('WebTransport blocked by UPS');
                };
                Object.defineProperty(window, 'WebTransport', { value: undefined, writable: false });
                debugLog('WebTransport blocked');
            }
        } catch (error) {
            debugLog(`Error in blockWebTransport: ${error.message}`);
            stats.errorsDetected++;
        }
    };

    const blockPrivacySandbox = () => {
        try {
            if (document.browsingTopics) {
                document.browsingTopics = () => Promise.resolve([]);
                debugLog('Privacy Sandbox Topics API blocked');
            }
            if (window.Fledge) {
                window.Fledge = undefined;
                debugLog('Privacy Sandbox FLEDGE API blocked');
            }
        } catch (error) {
            debugLog(`Error in blockPrivacySandbox: ${error.message}`);
            stats.errorsDetected++;
        }
    };

    const detectTrackingParams = (url) => {
        try {
            const urlObj = new URL(url);
            const paramsToRemove = [];
            for (const [param, value] of urlObj.searchParams) {
                if (
                    (param.includes('id') || param.includes('track') || param.length > 10) &&
                    value.length > 20 &&
                    /[0-9a-f]{8}/.test(value)
                ) {
                    paramsToRemove.push(param);
                }
            }
            paramsToRemove.forEach(param => urlObj.searchParams.delete(param));
            return urlObj.toString();
        } catch {
            return url;
        }
    };

    const cleanFirstPartyUrls = () => {
        try {
            const links = document.querySelectorAll('a[href]:not([data-ups-cleaned])');
            for (const link of links) {
                if (!link.href.startsWith('javascript:')) {
                    const cleaned = detectTrackingParams(link.href);
                    if (cleaned !== link.href) {
                        link.href = cleaned;
                        link.dataset.upsCleaned = 'true';
                        stats.cleanedUrls++;
                        debugLog(`Cleaned URL: ${link.href}`);
                    }
                }
            }
        } catch (error) {
            debugLog(`Error in cleanFirstPartyUrls: ${error.message}`);
            stats.errorsDetected++;
        }
    };

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    const cleanFirstPartyUrlsDebounced = debounce(cleanFirstPartyUrls, 200);

    const observeLinks = () => {
        try {
            const observer = new MutationObserver(() => {
                if (Math.random() > 0.3) return; // Reduced frequency
                cleanFirstPartyUrlsDebounced();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        } catch (error) {
            debugLog(`Error in observeLinks: ${error.message}`);
            stats.errorsDetected++;
        }
    };

    const videoPlayerModule = {
        selectors: [
            'video',
            '.video-player',
            '.vjs-control-bar',
            '.plyr__controls',
            '.jwplayer',
            '.shaka-controls-container',
            '.ytp-progress-bar',
            '.player-controls',
            '.twitch-player',
            '.hls-player',
            '.dash-player',
            '[data-player]',
            '[data-vimeo-id]',
            '[data-video-id]',
            '[data-twitch-id]'
        ],
        isVideoPlayerInterface(element) {
            try {
                if (!element) return false;
                const tagName = element.tagName.toLowerCase();
                if (tagName === 'video') return true;
                const styles = window.getComputedStyle(element);
                return (
                    ['absolute', 'fixed'].includes(styles.position) ||
                    parseInt(styles.zIndex, 10) > 1 ||
                    ['pointer', 'progress'].includes(styles.cursor) ||
                    ['button', 'input', 'div', 'span'].includes(tagName) && (
                        element.className.toLowerCase().includes('control') ||
                        element.className.toLowerCase().includes('progress') ||
                        element.hasAttribute('aria-label') && element.getAttribute('aria-label').toLowerCase().includes('play') ||
                        element.hasAttribute('role') && ['slider', 'progressbar'].includes(element.getAttribute('role').toLowerCase())
                    )
                );
            } catch (error) {
                debugLog(`Error in isVideoPlayerInterface: ${error.message}`);
                return false;
            }
        },
        isWithinPlayerBounds(x, y) {
            try {
                for (const bounds of config.videoPlayerBounds || []) {
                    if (x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom) {
                        return true;
                    }
                }
                return false;
            } catch (error) {
                debugLog(`Error in isWithinPlayerBounds: ${error.message}`);
                return false;
            }
        },
        updatePlayerBounds() {
            try {
                const selectors = this.selectors.concat(config.customVideoSelectors).join(', ');
                const players = document.querySelectorAll(selectors);
                config.videoPlayerBounds = [];
                players.forEach(player => {
                    const rect = player.getBoundingClientRect();
                    if (rect.width > 50 && rect.height > 50) { // Filter small elements
                        config.videoPlayerBounds.push({
                            left: rect.left,
                            right: rect.right,
                            top: rect.top,
                            bottom: rect.bottom
                        });
                    }
                });
                saveConfig(config);
            } catch (error) {
                debugLog(`Error in updatePlayerBounds: ${error.message}`);
            }
        },
        observePlayers() {
            try {
                const observer = new MutationObserver(mutations => {
                    for (const mutation of mutations) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE && node.matches(this.selectors.join(', '))) {
                                this.updatePlayerBounds();
                            }
                        }
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
                debugLog('Video player observer initialized');
            } catch (error) {
                debugLog(`Error in observePlayers: ${error.message}`);
                stats.errorsDetected++;
            }
        },
        discoverAdaptiveSelectors() {
            try {
                const videos = document.querySelectorAll('video');
                videos.forEach(video => {
                    const parent = video.closest('div, section, article');
                    if (parent && parent.className && !this.selectors.includes(`.${parent.className.split(' ')[0]}`)) {
                        const className = parent.className.split(' ')[0];
                        if (className && !config.customVideoSelectors.includes(`.${className}`)) {
                            config.customVideoSelectors.push(`.${className}`);
                            saveConfig(config);
                        }
                    }
                });
            } catch (error) {
                debugLog(`Error in discoverAdaptiveSelectors: ${error.message}`);
            }
        }
    };

    const protectVideoPlayerEvents = () => {
        try {
            const criticalEvents = ['click', 'mousedown', 'mouseup', 'timeupdate', 'progress', 'playing', 'volumechange'];
            const originalAddEventListener = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                if (criticalEvents.includes(type)) {
                    const context = this;
                    const wrappedListener = (...args) => {
                        const event = args[0];
                        if (
                            event.target.tagName.toLowerCase() === 'video' ||
                            videoPlayerModule.isVideoPlayerInterface(event.target) ||
                            (event.clientX !== undefined && event.clientY !== undefined && videoPlayerModule.isWithinPlayerBounds(event.clientX, event.clientY))
                        ) {
                            stats.videoEventsProcessed++;
                            return listener.apply(context, args);
                        }
                        return listener.apply(context, args);
                    };
                    return originalAddEventListener.call(this, type, wrappedListener, { ...options, passive: true });
                }
                return originalAddEventListener.apply(this, arguments);
            };
            debugLog('Video player event protection enabled');
        } catch (error) {
            debugLog(`Error in protectVideoPlayerEvents: ${error.message}`);
            stats.errorsDetected++;
        }
    };

    const adGuardModule = {
        detectBlockedResources() {
            try {
                const resources = document.querySelectorAll('script[src], link[href][rel="stylesheet"]');
                resources.forEach(resource => {
                    resource.addEventListener('error', () => {
                        stats.adGuardBlocks++;
                        debugLog(`Detected blocked resource: ${resource.src || resource.href}`);
                    }, { passive: true });
                });
            } catch (error) {
                debugLog(`Error in detectBlockedResources: ${error.message}`);
            }
        }
    };

    const detectSiteErrors = () => {
        try {
            const errorListener = (event) => {
                stats.errorsDetected++;
                debugLog(`Site error: ${event.message}`);
            };
            window.addEventListener('error', errorListener, { passive: true });
            window.addEventListener('unhandledrejection', errorListener, { passive: true });
        } catch (error) {
            debugLog(`Error in detectSiteErrors: ${error.message}`);
            stats.errorsDetected++;
        }
    };

    const init = () => {
        try {
            if (isSiteDisabled()) {
                debugLog('UPS disabled for this site');
                return;
            }
            debugLog('Starting UPS initialization');

            Object.defineProperty(navigator, 'webdriver', { value: false, writable: false });
            Object.defineProperty(window, 'Date', {
                value: class extends Date {
                    getTimezoneOffset() { return 0; }
                },
                writable: false
            });

            blockCanvasFingerprinting();
            blockAudioFingerprinting();
            blockWebGPU();
            blockWebTransport();
            blockPrivacySandbox();
            blockTrackingScripts();
            protectVideoPlayerEvents();
            detectSiteErrors();
            videoPlayerModule.observePlayers();
            adGuardModule.detectBlockedResources();

            runWhenIdle(() => {
                observeLinks();
                videoPlayerModule.updatePlayerBounds();
                videoPlayerModule.discoverAdaptiveSelectors();
            });

            window.addEventListener('load', cleanFirstPartyUrlsDebounced, { passive: true, once: true });
            debugLog('UPS initialization complete');
        } catch (error) {
            debugLog(`Initialization error: ${error.message}`);
            stats.errorsDetected++;
        }
    };

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init, { passive: true, once: true });
    }
})();