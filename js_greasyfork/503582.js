// ==UserScript==
// @name         easystrapper (for youtube)
// @namespace    http://tampermonkey.net/
// @version      2025-01-18
// @description  Balanced YouTube loading optimizations with lazy loading, smart preloading, hover previews, and scrubbing control.
// @license MIT
// @author       ondry4k
// @match        https://www.youtube.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503582/easystrapper%20%28for%20youtube%29.user.js
// @updateURL https://update.greasyfork.org/scripts/503582/easystrapper%20%28for%20youtube%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        preloadMargin: '500px 0px',
        loadMargin: '200px 0px',
        hoverDelayMs: 160,
        maxPreloads: 80,
        maxCachedPreloads: 160,
        maxScriptPreloads: 4,
        debug: true,
        debugVerbose: true,
        refreshMs: 2500,
        cacheCompareMs: 12000,
        maxCompareSamples: 6,
        disableMiniPlayer: true,
        disableRelatedSidebar: true,
        disableSkeletons: true,
        disableShimmer: true,
        disablePrefetchRelated: true
    };

    const THUMB_SELECTOR = 'ytd-thumbnail img, a#thumbnail img, img#img';
    const VID_REGEX = /\/vi\/([\w-]{6,})\//;
    const processed = new WeakSet();
    const hoverTimers = new WeakMap();
    const preloaded = new Set();
    const previewCache = new Map();
    const thumbCache = new Map();
    const hintHosts = new Set();
    const scriptStart = performance.now();
    let preloadObserver;
    let loadObserver;
    let scrubObserver;
    let persistTimer;
    let mutationTimer;
    let refreshTimer;
    let scrollTicking = false;
    let compareTimer;
    let mutationObserver;
    let hoverAttached = false;
    let scrollAttached = false;
    let cssInjected = false;

    function log(label, message, data) {
        if (!CONFIG.debug) return;
        const styles = {
            init: 'color:#0ea5e9;font-weight:600',
            preload: 'color:#22c55e;font-weight:600',
            load: 'color:#eab308;font-weight:600',
            scrub: 'color:#f97316;font-weight:600',
            hover: 'color:#8b5cf6;font-weight:600',
            script: 'color:#14b8a6;font-weight:600',
            cache: 'color:#10b981;font-weight:600',
            perf: 'color:#38bdf8;font-weight:600',
            net: 'color:#f43f5e;font-weight:600'
        };
        const style = styles[label] || 'color:#94a3b8';
        if (typeof data !== 'undefined') {
            console.log(`%c[easystrapper] ${message}`, style, data);
            return;
        }
        console.log(`%c[easystrapper] ${message}`, style);
    }

    function safeRun(label, fn) {
        try {
            fn();
        } catch (err) {
            log('net', `Safeguard: ${label} failed`, err);
        }
    }

    function loadPersistedPreloads() {
        try {
            const raw = sessionStorage.getItem('easystrapper_preloads');
            if (!raw) return;
            const items = JSON.parse(raw);
            if (Array.isArray(items)) {
                items.forEach((url) => preloaded.add(url));
                if (CONFIG.debugVerbose) {
                    log('cache', `Preload cache restored (${items.length})`);
                }
            }
        } catch (err) {
            // ignore storage issues
        }
    }

    function comparePreloadCache() {
        if (!CONFIG.debug || !CONFIG.debugVerbose) return;
        let stored = [];
        try {
            const raw = sessionStorage.getItem('easystrapper_preloads');
            stored = raw ? JSON.parse(raw) : [];
        } catch (err) {
            stored = [];
        }
        const storedSet = new Set(Array.isArray(stored) ? stored : []);
        const inMemoryOnly = [];
        preloaded.forEach((url) => {
            if (!storedSet.has(url)) inMemoryOnly.push(url);
        });
        const inStorageOnly = [];
        storedSet.forEach((url) => {
            if (!preloaded.has(url)) inStorageOnly.push(url);
        });
        log(
            'cache',
            `Cache compare mem:${preloaded.size} storage:${storedSet.size} memOnly:${inMemoryOnly.length} storageOnly:${inStorageOnly.length}`
        );
        const sample = inMemoryOnly.slice(0, CONFIG.maxCompareSamples);
        if (sample.length) {
            log('cache', 'Mem-only sample', sample);
        }
    }

    function injectCss() {
        if (cssInjected) return;
        const rules = [];
        if (CONFIG.disableMiniPlayer) {
            rules.push(
                'ytd-miniplayer, ytd-miniplayer-bar-renderer, #miniplayer, ytd-player-minimized { display: none !important; }'
            );
        }
        if (CONFIG.disableRelatedSidebar) {
            rules.push('#related, ytd-watch-next-secondary-results-renderer { display: none !important; }');
        }
        if (CONFIG.disableSkeletons) {
            rules.push('ytd-skeleton, .ytd-skeleton, yt-page-skeleton { display: none !important; }');
        }
        if (CONFIG.disableShimmer) {
            rules.push('.shimmer, .ytp-swatch-background-color, .ytp-shimmer { animation: none !important; }');
        }
        if (!rules.length) return;
        const style = document.createElement('style');
        style.id = 'easystrapper-style';
        style.textContent = rules.join('\n');
        document.head.appendChild(style);
        cssInjected = true;
        log('init', 'UI trims applied');
    }

    function persistPreloads() {
        if (persistTimer) return;
        persistTimer = window.setTimeout(() => {
            persistTimer = null;
            const items = Array.from(preloaded).slice(-CONFIG.maxCachedPreloads);
            try {
                sessionStorage.setItem('easystrapper_preloads', JSON.stringify(items));
                if (CONFIG.debugVerbose) {
                    log('cache', `Preload cache saved (${items.length})`);
                }
            } catch (err) {
                // ignore storage issues
            }
        }, 300);
    }

    function isThumbnail(img) {
        return img.matches(THUMB_SELECTOR);
    }

    function getVideoIdFromUrl(url) {
        if (!url) return null;
        try {
            const parsed = new URL(url, location.origin);
            const id = parsed.searchParams.get('v');
            if (id) return id;
        } catch (err) {
            // ignore
        }
        const match = url.match(VID_REGEX);
        return match ? match[1] : null;
    }

    function getVideoId(el) {
        if (!el) return null;
        if (el.dataset && el.dataset.esVid) return el.dataset.esVid;
        const link = el.closest('a#thumbnail, a[href*="watch"]');
        if (link && link.href) {
            const fromLink = getVideoIdFromUrl(link.href);
            if (fromLink) {
                if (el.dataset) el.dataset.esVid = fromLink;
                if (CONFIG.debugVerbose) {
                    log('cache', 'Video id cached', fromLink);
                }
                return fromLink;
            }
        }
        const fromImg = getVideoIdFromUrl(el.currentSrc || el.src);
        if (fromImg && el.dataset) {
            el.dataset.esVid = fromImg;
            if (CONFIG.debugVerbose) {
                log('cache', 'Video id cached', fromImg);
            }
        }
        return fromImg;
    }

    function getThumbUrl(videoId, quality) {
        if (!videoId) return null;
        const key = `${videoId}:${quality}`;
        if (thumbCache.has(key)) return thumbCache.get(key);
        const url = `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
        thumbCache.set(key, url);
        return url;
    }

    function getPreviewUrl(videoId) {
        if (!videoId) return null;
        if (previewCache.has(videoId)) return previewCache.get(videoId);
        const url = `https://i.ytimg.com/an_webp/${videoId}/mqdefault_6s.webp`;
        previewCache.set(videoId, url);
        return url;
    }

    function makePreload(url, asType) {
        if (!url || preloaded.has(url) || preloaded.size >= CONFIG.maxPreloads) {
            if (CONFIG.debugVerbose && url && preloaded.has(url)) {
                log('cache', `Preload cache hit (${asType || 'image'})`, url);
            }
            return;
        }
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = asType || 'image';
        link.href = url;
        document.head.appendChild(link);
        preloaded.add(url);
        persistPreloads();
        log('preload', `Preload queued (${asType || 'image'})`, url);
    }

    function tuneImage(img) {
        if (processed.has(img)) return;
        processed.add(img);
        if (!img.loading) img.loading = 'lazy';
        img.decoding = 'async';
        img.fetchPriority = 'low';
    }

    function softenScrub(img, videoId) {
        if (!img || !videoId || !img.src) return;
        if (img.src.includes('an_webp') || img.src.includes('/sb/')) {
            const staticUrl = getThumbUrl(videoId, 'hqdefault');
            if (staticUrl && staticUrl !== img.src) {
                img.src = staticUrl;
                log('scrub', 'Scrub thumbnail softened', staticUrl);
            }
        }
    }

    function teardownObservers() {
        if (preloadObserver) preloadObserver.disconnect();
        if (loadObserver) loadObserver.disconnect();
        if (scrubObserver) scrubObserver.disconnect();
        preloadObserver = null;
        loadObserver = null;
        scrubObserver = null;
    }

    function setupObservers() {
        teardownObservers();
        preloadObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const img = entry.target;
                const videoId = getVideoId(img);
                const preloadUrl = getThumbUrl(videoId, 'hqdefault') || img.currentSrc || img.src;
                makePreload(preloadUrl, 'image');
                if (CONFIG.debugVerbose) {
                    log('preload', 'Near viewport detected', preloadUrl);
                }
            });
        }, { rootMargin: CONFIG.preloadMargin, threshold: 0.01 });

        loadObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const img = entry.target;
                const videoId = getVideoId(img);
                const highRes = getThumbUrl(videoId, 'hqdefault');
                if (highRes && img.src !== highRes) {
                    img.src = highRes;
                    log('load', 'Thumbnail upgraded', highRes);
                }
                img.fetchPriority = 'auto';
            });
        }, { rootMargin: CONFIG.loadMargin, threshold: 0.01 });

        scrubObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) return;
                const img = entry.target;
                const videoId = getVideoId(img);
                softenScrub(img, videoId);
            });
        }, { rootMargin: '0px', threshold: 0.01 });
    }

    function observeThumbnail(img) {
        if (!preloadObserver || !loadObserver || !scrubObserver) return;
        preloadObserver.observe(img);
        loadObserver.observe(img);
        scrubObserver.observe(img);
    }

    function getImagesFromRoot(root) {
        const scope = root || document;
        const images = [];
        if (scope.nodeType === 1 && scope.tagName === 'IMG') {
            images.push(scope);
        }
        scope.querySelectorAll('img').forEach((img) => images.push(img));
        return images;
    }

    function applyOptimizations(root) {
        const images = getImagesFromRoot(root);
        images.forEach((img) => {
            tuneImage(img);
            if (isThumbnail(img)) {
                observeThumbnail(img);
            }
        });
    }

    function preloadScripts() {
        const scripts = Array.from(document.querySelectorAll('script[src]'));
        scripts.slice(0, CONFIG.maxScriptPreloads).forEach((script) => {
            makePreload(script.src, 'script');
        });
        if (scripts.length) {
            log('script', 'Script preloads scheduled', scripts.length);
        }
    }

    function preloadStaticImages(root) {
        const scope = root || document;
        const staticImages = scope.querySelectorAll(
            'ytd-guide-entry-renderer img, ytd-mini-guide-entry-renderer img, ytd-channel-avatar img, ' +
            '#avatar img, yt-img-shadow img, ytd-topbar-logo-renderer img, ytd-searchbox img, ' +
            'ytd-video-owner-renderer #channel-info img'
        );
        staticImages.forEach((img) => {
            if (!img || img.dataset.esStaticPreloaded) return;
            const url = img.currentSrc || img.src;
            if (!url) return;
            img.dataset.esStaticPreloaded = '1';
            makePreload(url, 'image');
            img.fetchPriority = 'low';
            if (CONFIG.debugVerbose) {
                log('preload', 'Static image cached', url);
            }
        });
    }

    function setupNetworkHints() {
        const hosts = [
            'https://www.youtube.com',
            'https://i.ytimg.com',
            'https://i9.ytimg.com'
        ];
        hosts.forEach((host) => {
            if (hintHosts.has(host)) return;
            ['preconnect', 'dns-prefetch'].forEach((rel) => {
                const link = document.createElement('link');
                link.rel = rel;
                link.href = host;
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
            });
            hintHosts.add(host);
        });
        log('net', 'Network hints applied', Array.from(hintHosts));
    }

    function disableUnrelatedPrefetch() {
        if (!CONFIG.disablePrefetchRelated) return;
        const currentId = getVideoIdFromUrl(location.href);
        const links = Array.from(document.querySelectorAll(
            'link[rel="prefetch"], link[rel="prerender"], link[rel="preload"][as="fetch"]'
        ));
        let removed = 0;
        links.forEach((link) => {
            const href = link.href || '';
            if (!href || !href.includes('watch?v=')) return;
            const targetId = getVideoIdFromUrl(href);
            if (!currentId || targetId !== currentId) {
                link.remove();
                removed += 1;
            }
        });
        if (removed && CONFIG.debugVerbose) {
            log('net', `Prefetch hints trimmed (${removed})`);
        }
    }

    function scheduleIdleWork() {
        const idle = window.requestIdleCallback || function (cb) { return setTimeout(cb, 200); };
        idle(preloadScripts, { timeout: 800 });
    }

    function attachHoverPreview() {
        if (hoverAttached) return;
        document.addEventListener('pointerenter', (event) => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            const container = target.closest('a#thumbnail, ytd-thumbnail');
            if (!container) return;
            const img = container.querySelector('img');
            if (!img) return;
            const videoId = getVideoId(img);
            if (!videoId) return;

            if (hoverTimers.has(img)) {
                clearTimeout(hoverTimers.get(img));
            }
            const timer = window.setTimeout(() => {
                img.dataset.esOriginalSrc = img.src;
                const previewUrl = getPreviewUrl(videoId);
                if (previewUrl) {
                    img.src = previewUrl;
                    makePreload(previewUrl, 'image');
                    log('hover', 'Hover preview active', previewUrl);
                }
            }, CONFIG.hoverDelayMs);
            hoverTimers.set(img, timer);
        }, true);

        document.addEventListener('pointerleave', (event) => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            const container = target.closest('a#thumbnail, ytd-thumbnail');
            if (!container) return;
            const img = container.querySelector('img');
            if (!img) return;
            if (hoverTimers.has(img)) {
                clearTimeout(hoverTimers.get(img));
                hoverTimers.delete(img);
            }
            if (img.dataset.esOriginalSrc) {
                img.src = img.dataset.esOriginalSrc;
                delete img.dataset.esOriginalSrc;
                log('hover', 'Hover preview cleared');
            }
        }, true);
        hoverAttached = true;
    }

    function shouldProcessNode(node) {
        if (node.nodeType !== 1) return false;
        const el = node;
        if (el.tagName === 'IMG') return true;
        if (el.matches('ytd-thumbnail, ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer')) {
            return true;
        }
        if (el.querySelector && el.querySelector('img, ytd-thumbnail, ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer')) {
            return true;
        }
        return false;
    }

    function observeDOM() {
        if (mutationObserver) return;
        mutationObserver = new MutationObserver((mutations) => {
            if (mutationTimer) return;
            mutationTimer = window.setTimeout(() => {
                mutationTimer = null;
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (!shouldProcessNode(node)) return;
                        applyOptimizations(node);
                        preloadStaticImages(node);
                    });
                });
            }, 120);
        });
        mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    function runContinuousOptimization(reason) {
        const idle = window.requestIdleCallback || function (cb) { return setTimeout(cb, 120); };
        idle(() => {
            const start = performance.now();
            applyOptimizations(document);
            preloadStaticImages(document);
            scheduleIdleWork();
            if (reason === 'interval') {
                disableUnrelatedPrefetch();
            }
            if (reason) {
                const elapsed = Math.round(performance.now() - start);
                log('perf', `Continuous optimize (${reason}) in ${elapsed}ms`);
            }
        }, { timeout: 800 });
    }

    function startContinuousOptimization() {
        if (refreshTimer) return;
        refreshTimer = window.setInterval(() => {
            runContinuousOptimization('interval');
        }, CONFIG.refreshMs);
        compareTimer = window.setInterval(comparePreloadCache, CONFIG.cacheCompareMs);

        if (scrollAttached) return;
        window.addEventListener('scroll', () => {
            if (scrollTicking) return;
            scrollTicking = true;
            window.requestAnimationFrame(() => {
                scrollTicking = false;
                runContinuousOptimization('scroll');
            });
        }, { passive: true });
        scrollAttached = true;
    }

    function init() {
        const initStart = performance.now();
        safeRun('setup observers', setupObservers);
        safeRun('network hints', setupNetworkHints);
        safeRun('ui trims', injectCss);
        safeRun('apply optimizations', () => applyOptimizations(document));
        safeRun('preload static images', () => preloadStaticImages(document));
        safeRun('hover preview', attachHoverPreview);
        safeRun('dom observer', observeDOM);
        safeRun('idle work', scheduleIdleWork);
        safeRun('continuous optimize', startContinuousOptimization);
        safeRun('prefetch trims', disableUnrelatedPrefetch);
        const initElapsed = Math.round(performance.now() - initStart);
        const totalElapsed = Math.round(performance.now() - scriptStart);
        log('init', `Easystrapper initialized in ${initElapsed}ms (since script start ${totalElapsed}ms)`);
    }

    loadPersistedPreloads();
    window.addEventListener('load', init);
    document.addEventListener('yt-navigate-finish', init);
})();
