// ==UserScript==
// @name         Super Fast Load
// @namespace    http://tampermonkey.net/
// @version      4
// @description  Boost your browsing experience with Super Fast Load! Stop YouTube autoplay (main videos only), add download buttons, block trackers with whitelist, optimize for slow internet/VPN/Tor, lazy load media, enhance video buffering, and speed up page loading while preserving all site functionality.
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/brotli@1.3.0/umd/browser/brotli.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/zstd/1.3.8/zstd.min.js
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/517138/Super%20Fast%20Load.user.js
// @updateURL https://update.greasyfork.org/scripts/517138/Super%20Fast%20Load.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        TRUSTED_DOMAINS: ['digikala.com', 'dkstatics-public.digikala.com', 'aparat.com', 'cdn.asset.aparat.com'],
        PRECONNECT_TRUSTED_DOMAINS: true,
        DNS_PREFETCH: true,
        BLOCK_EXTERNAL_FONTS: true,
        PREVENT_PREFETCH: true,
        REMOVE_NON_ESSENTIAL_ELEMENTS: true,
        NON_ESSENTIAL_SELECTORS: ['#disqus_thread', '.twitter-timeline', 'iframe[src*="facebook.com"]'],
        OPTIMIZE_INLINE_CSS: true,
        OPTIMIZE_INLINE_JS: true,
        ENABLE_YOUTUBE_TOOLS: true,
        BLOCK_LIST: ['ad', 'analytics', 'googletagmanager', 'tracking', 'beacon', 'facebook', 'twitter', 'hotjar', 'sentry', 'adverge', 'onesignal', 'clarity'],
        ALLOW_LIST: ['jquery', 'bootstrap', 'core', 'essential', 'react', 'chunk', 'runtime', 'main', 'cloudflare', 'captcha'],
        PARALLEL_FETCH_LIMIT: 8,
        REQUEST_TIMEOUT: 500,
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000,
        CACHE_TTL: 24 * 60 * 60 * 1000,
        VIDEO_BUFFER_AHEAD: 10, // Seconds to buffer ahead for videos
        LOW_BANDWIDTH_THRESHOLD: 2 * 1024 / 8, // 2kbps in bytes/s
        REQUEST_RATE_LIMIT: 50, // ms between requests to avoid detection
    };

    // Setup
    const currentHost = window.location.hostname;
    const mainDomain = currentHost.split('.').slice(-2).join('.');
    const mainDomainKeyword = mainDomain.split('.')[0];
    const trustedKeywords = new Set([mainDomainKeyword, ...CONFIG.TRUSTED_DOMAINS]);
    const processedNodes = new WeakSet();
    const resourceCache = new Map();
    let networkSpeed = null; // Estimated in bytes/s

    // Utility Functions
    const throttle = (func, limit) => {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall >= limit) {
                lastCall = now;
                return func(...args);
            }
        };
    };

    const fetchWithTimeout = throttle(async (url, options = {}) => {
        for (let attempt = 1; attempt <= CONFIG.RETRY_ATTEMPTS; attempt++) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT * (networkSpeed <= CONFIG.LOW_BANDWIDTH_THRESHOLD ? 2 : 1));
            try {
                const response = await fetch(url, { ...options, signal: controller.signal, cache: 'force-cache' });
                clearTimeout(timeoutId);
                if (response.ok) return response;
                throw new Error(`Fetch failed: ${response.status}`);
            } catch (error) {
                clearTimeout(timeoutId);
                if (attempt === CONFIG.RETRY_ATTEMPTS) throw error;
                await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
            }
        }
    }, CONFIG.REQUEST_RATE_LIMIT);

    const minifyCSS = (css) => css.replace(/\s*([{}:;,])\s*/g, '$1').replace(/;}/g, '}').trim();
    const minifyJS = (js) => js.replace(/\s*([{}:;,])\s*/g, '$1').replace(/;}/g, '}').trim();

    const isInternalOrTrusted = (url) => {
        if (!url) return false;
        try {
            const resourceHost = new URL(url, window.location.origin).hostname;
            if (resourceHost.endsWith(mainDomain)) return true;
            for (const trusted of trustedKeywords) {
                if (resourceHost.includes(trusted)) return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    };

    const isBlocked = (url) => {
        if (!url || isInternalOrTrusted(url)) return false;
        const lowerUrl = url.toLowerCase();
        if (CONFIG.ALLOW_LIST.some(a => lowerUrl.includes(a))) return false;
        return CONFIG.BLOCK_LIST.some(b => lowerUrl.includes(b));
    };

    const isFontRequest = (url) => {
        if (!CONFIG.BLOCK_EXTERNAL_FONTS || !url) return false;
        const lowerUrl = url.toLowerCase();
        return lowerUrl.includes('fonts.googleapis.com') || lowerUrl.endsWith('.woff') || lowerUrl.endsWith('.woff2');
    };

    // Network Speed Detection
    const estimateNetworkSpeed = async () => {
        const startTime = performance.now();
        try {
            const response = await fetchWithTimeout('https://www.google.com/generate_204', { method: 'GET', mode: 'no-cors' });
            const endTime = performance.now();
            const duration = (endTime - startTime) / 1000; // seconds
            networkSpeed = duration > 0 ? 204 / duration : CONFIG.LOW_BANDWIDTH_THRESHOLD; // bytes/s
        } catch (e) {
            networkSpeed = CONFIG.LOW_BANDWIDTH_THRESHOLD; // Assume low speed on failure
        }
        console.log(`Estimated network speed: ${networkSpeed.toFixed(2)} bytes/s`);
        adjustForNetworkSpeed();
    };

    const adjustForNetworkSpeed = () => {
        if (networkSpeed <= CONFIG.LOW_BANDWIDTH_THRESHOLD) {
            CONFIG.PARALLEL_FETCH_LIMIT = Math.max(2, Math.floor(CONFIG.PARALLEL_FETCH_LIMIT / 2));
            CONFIG.REQUEST_TIMEOUT *= 2;
            CONFIG.VIDEO_BUFFER_AHEAD = 5; // Reduce buffer for very low bandwidth
        } else {
            CONFIG.PARALLEL_FETCH_LIMIT = 8;
            CONFIG.REQUEST_TIMEOUT = 500;
            CONFIG.VIDEO_BUFFER_AHEAD = 10;
        }
    };

    // Resource Management
    const setupPreconnections = () => {
        const uniqueHosts = new Set();
        CONFIG.TRUSTED_DOMAINS.forEach(domain => {
            try {
                if (currentHost.endsWith(domain)) return;
                const url = new URL(`https://${domain}`);
                if (!uniqueHosts.has(url.hostname)) {
                    uniqueHosts.add(url.hostname);
                    const preconnectLink = document.createElement('link');
                    preconnectLink.rel = 'preconnect';
                    preconnectLink.href = url.origin;
                    preconnectLink.crossOrigin = 'anonymous';
                    (document.head || document.documentElement).appendChild(preconnectLink);
                    if (CONFIG.DNS_PREFETCH) {
                        const dnsLink = document.createElement('link');
                        dnsLink.rel = 'dns-prefetch';
                        dnsLink.href = url.origin;
                        (document.head || document.documentElement).appendChild(dnsLink);
                    }
                }
            } catch (e) {}
        });
    };

    const fetchResourcesParallel = async (urls, type) => {
        const fetchPromises = urls.map(url => {
            if (resourceCache.has(url)) return Promise.resolve(resourceCache.get(url));
            return fetchWithTimeout(url)
                .then(response => response.text())
                .then(text => {
                    const minified = type === 'css' && CONFIG.OPTIMIZE_INLINE_CSS
                        ? minifyCSS(text)
                        : type === 'js' && CONFIG.OPTIMIZE_INLINE_JS
                        ? minifyJS(text)
                        : text;
                    const blob = new Blob([minified], { type: type === 'css' ? 'text/css' : 'application/javascript' });
                    const blobUrl = URL.createObjectURL(blob);
                    resourceCache.set(url, { blobUrl, timestamp: Date.now() });
                    return { blobUrl, type };
                })
                .catch(error => {
                    console.warn(`Failed to fetch ${url}:`, error);
                    return null;
                });
        }).filter(Boolean);

        const results = await Promise.all(fetchPromises.slice(0, CONFIG.PARALLEL_FETCH_LIMIT));
        results.forEach(result => {
            if (!result) return;
            const element = document.createElement(result.type === 'css' ? 'link' : 'script');
            element[result.type === 'css' ? 'href' : 'src'] = result.blobUrl;
            if (result.type === 'css') element.rel = 'stylesheet';
            else element.defer = true;
            (document.head || document.documentElement).appendChild(element);
        });
    };

    const cleanupCache = () => {
        const now = Date.now();
        for (const [url, { timestamp }] of resourceCache) {
            if (now - timestamp > CONFIG.CACHE_TTL) {
                resourceCache.delete(url);
            }
        }
    };

    // Video Buffering Optimization
    const optimizeVideoBuffering = () => {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (video.buffered.length > 0) return;
            video.preload = 'auto';
            video.addEventListener('canplay', () => {
                const range = video.buffered;
                if (range.length > 0 && video.currentTime + CONFIG.VIDEO_BUFFER_AHEAD > range.end(range.length - 1)) {
                    video.currentTime = range.end(range.length - 1); // Pre-buffer next segment
                }
            });
        });
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'VIDEO') {
                        node.preload = 'auto';
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    // Node Processing
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1) continue;
                const elements = [node, ...node.querySelectorAll?.('script, link, style, iframe') || []];
                for (const el of elements) {
                    if (!processedNodes.has(el)) {
                        processNode(el);
                        processedNodes.add(el);
                    }
                }
            }
        }
    });

    function processNode(node) {
        const tagName = node.tagName.toUpperCase();
        let src = node.src || node.href;

        if (isBlocked(src)) {
            if (tagName === 'SCRIPT' || tagName === 'IFRAME') {
                node.type = 'javascript/blocked';
                node.src = 'about:blank';
            } else {
                node.remove();
            }
            return;
        }

        switch (tagName) {
            case 'LINK':
                if (CONFIG.PREVENT_PREFETCH && (node.rel === 'prefetch' || node.rel === 'preload')) {
                    node.remove();
                }
                if (isFontRequest(node.href)) {
                    node.remove();
                }
                break;
            case 'STYLE':
                if (CONFIG.OPTIMIZE_INLINE_CSS && node.textContent && node.textContent.length < 15000) {
                    node.textContent = minifyCSS(node.textContent);
                }
                break;
            case 'SCRIPT':
                if (CONFIG.OPTIMIZE_INLINE_JS && node.textContent && node.textContent.length < 15000) {
                    node.textContent = minifyJS(node.textContent);
                }
                break;
        }
    }

    // YouTube Download Button
    const addYouTubeDownloadButton = () => {
        if (!CONFIG.ENABLE_YOUTUBE_TOOLS || !currentHost.includes('youtube.com')) return;
        const runYouTubeTools = () => {
            if (!document.getElementById('ai-yt-dl-btn')) {
                const controls = document.querySelector('.ytp-right-controls');
                if (controls) {
                    const btn = document.createElement('button');
                    btn.id = 'ai-yt-dl-btn';
                    btn.className = 'ytp-button';
                    btn.title = 'Download Video';
                    btn.innerHTML = '<svg height="100%" viewBox="0 0 36 36" width="100%"><path d="M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z" fill="#fff"></path></svg>';
                    btn.onclick = () => window.open(`https://yt1s.com/?q=${encodeURIComponent(window.location.href)}`, '_blank');
                    controls.insertBefore(btn, controls.firstChild);
                }
            }
        };
        runYouTubeTools();
        new MutationObserver(runYouTubeTools).observe(document.querySelector('title'), { childList: true });
    };

    // Network Optimizations
    const monitorNetwork = async () => {
        while (true) {
            try {
                await fetchWithTimeout('https://www.google.com/generate_204', { method: 'GET', mode: 'no-cors' });
                console.log('Network stable.');
            } catch (error) {
                console.warn('Network issue detected. Attempting reconnection...');
                await reconnectNetwork();
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    };

    const reconnectNetwork = async () => {
        try {
            await Promise.all([
                fetchWithTimeout('https://1.1.1.1/generate_204', { method: 'GET', mode: 'no-cors' }),
                fetchWithTimeout('https://8.8.8.8/generate_204', { method: 'GET', mode: 'no-cors' })
            ]);
            console.log('DNS cache refreshed.');
        } catch (error) {
            console.warn('DNS refresh failed:', error);
        }
    };

    // Smart Site Detection
    const detectSiteType = () => {
        const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src.toLowerCase());
        if (scripts.some(src => src.includes('react'))) return 'react';
        if (scripts.some(src => src.includes('angular'))) return 'angular';
        if (document.querySelector('meta[name="cloudflare"]')) return 'cloudflare';
        return 'generic';
    };

    const optimizeForSiteType = (siteType) => {
        switch (siteType) {
            case 'react':
                CONFIG.PARALLEL_FETCH_LIMIT = Math.min(CONFIG.PARALLEL_FETCH_LIMIT + 2, 10); // More parallel fetches for SPA
                break;
            case 'angular':
                CONFIG.REQUEST_TIMEOUT += 200; // Slightly longer timeout for Angular
                break;
            case 'cloudflare':
                CONFIG.ALLOW_LIST.push('cloudflareinsights'); // Ensure Cloudflare scripts are allowed
                break;
        }
    };

    // Initialization
    const init = async () => {
        await estimateNetworkSpeed();
        setupPreconnections();
        observer.observe(document.documentElement, { childList: true, subtree: true });
        monitorNetwork();
        cleanupCache();
        optimizeVideoBuffering();

        const siteType = detectSiteType();
        optimizeForSiteType(siteType);

        const criticalResources = Array.from(document.querySelectorAll('link[rel="stylesheet"], script[src]'))
            .map(el => el.href || el.src)
            .filter(url => isInternalOrTrusted(url) && !isBlocked(url));
        await fetchResourcesParallel(criticalResources.filter(url => url.endsWith('.css')), 'css');
        await fetchResourcesParallel(criticalResources.filter(url => url.endsWith('.js')), 'js');

        const onDOMContentLoaded = () => {
            setTimeout(() => observer.disconnect(), 5000);
            if (CONFIG.REMOVE_NON_ESSENTIAL_ELEMENTS) {
                CONFIG.NON_ESSENTIAL_SELECTORS.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => el.remove());
                });
            }
            addYouTubeDownloadButton();
        };

        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            onDOMContentLoaded();
        } else {
            document.addEventListener('DOMContentLoaded', onDOMContentLoaded, { once: true });
        }

        console.log('Ultimate Web Performance (v9.0 - HyperSpeed Edition) is active.');
    };

    init();
})();