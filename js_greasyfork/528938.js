// ==UserScript==
// @name         YouTube Link Saver
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Save YouTube links with persistent storage
// @author       se7
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528938/YouTube%20Link%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/528938/YouTube%20Link%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS styles
    GM_addStyle(`
        #yt-link-saver {
            display: inline-flex;
            align-items: center;
            margin-right: 8px;
            background: transparent;
            position: relative;
        }

        #yt-link-saver > div > button {
            background: transparent;
            color: var(--yt-spec-text-primary) !important;
            border: none;
            padding: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: background 0.2s ease;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            height: 40px;
            border-radius: 20px;
        }

        #yt-link-saver > div > button svg {
            fill: currentColor;
        }

        #yt-link-saver > div > button:hover {
            background: var(--yt-spec-badge-chip-background);
        }

        #toggle-list {
            width: 40px !important;
            padding: 0 !important;
            justify-content: center;
            color: var(--yt-spec-text-primary) !important;
        }

        .video-count {
            background: var(--yt-spec-badge-chip-background);
            color: var(--yt-spec-text-primary);
            padding: 2px 6px;
            border-radius: 12px;
            font-size: 12px;
            min-width: 16px;
            height: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        #saved-links {
            position: absolute;
            top: 100%;
            right: 0;
            background: #282828;
            border-radius: 12px;
            padding: 16px;
            margin-top: 8px;
            width: 320px;
            max-height: 500px;
            overflow-y: auto;
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 2200;
        }

        #saved-links.visible {
            display: block;
            opacity: 1;
        }

        #saved-links::-webkit-scrollbar {
            width: 8px;
        }

        #saved-links::-webkit-scrollbar-track {
            background: #333;
            border-radius: 4px;
        }

        #saved-links::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 4px;
        }

        #saved-links::-webkit-scrollbar-thumb:hover {
            background: #666;
        }

        .saved-link {
            margin: 8px 0;
            padding: 12px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            transition: background 0.2s ease;
            position: relative;
        }

        .saved-link:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .saved-link a {
            color: #fff;
            text-decoration: none;
            font-weight: 500;
            display: block;
            margin-bottom: 6px;
            padding-right: 24px;
            line-height: 1.4;
        }

        .saved-link a:hover {
            color: #3ea6ff;
        }

        .delete-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            transition: color 0.2s ease;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }

        .delete-btn:hover {
            color: #ff4444;
            background: rgba(255, 255, 255, 0.1);
        }

        .saved-link small {
            color: rgba(255, 255, 255, 0.6);
            font-size: 12px;
        }

        #saved-links h3 {
            color: #fff;
            font-size: 16px;
            margin: 0 0 16px 0;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .yt-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            background: #282828;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-family: 'YouTube Sans', 'Roboto', sans-serif;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
            pointer-events: none;
            color: #fff;
        }

        .yt-notification.success {
            border-left: 4px solid #2ba640;
        }

        .yt-notification.info {
            border-left: 4px solid #065fd4;
        }

        .yt-notification.error {
            border-left: 4px solid #ff4444;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }

        /* Saved video title highlighting */
        .yt-saved-video {
            position: relative !important;
        }

        /* Saved video title highlighting - more specific selectors */
        /* Watch page title */
        ytd-watch-metadata h1.yt-saved-video yt-formatted-string,
        ytd-watch-metadata h1.yt-saved-video {
            color: #2ba640 !important;
        }

        /* Search/browse page title */
        a#video-title.yt-saved-video,
        a#video-title-link.yt-saved-video,
        a#video-title-link.yt-saved-video yt-formatted-string,
        span#video-title.yt-saved-video,
        h3 a#video-title.yt-saved-video,
        h3 a#video-title-link.yt-saved-video {
            color: #2ba640 !important;
        }

        /* Playlist panel title */
        ytd-playlist-panel-video-renderer span#video-title.yt-saved-video,
        ytd-playlist-panel-video-renderer h4.yt-saved-video span#video-title {
            color: #2ba640 !important;
        }

        /* New lockup view model title */
        a.yt-lockup-metadata-view-model__title.yt-saved-video,
        a.yt-lockup-metadata-view-model__title.yt-saved-video span.yt-core-attributed-string,
        a.yt-lockup-metadata-view-model__title.yt-saved-video *,
        .yt-lockup-metadata-view-model-wiz__title.yt-saved-video,
        .yt-lockup-metadata-view-model-wiz__title.yt-saved-video span.yt-core-attributed-string,
        .yt-lockup-metadata-view-model-wiz__title.yt-saved-video * {
            color: #2ba640 !important;
        }

        /* Force override any other color styles */
        .yt-saved-video {
            color: #2ba640 !important;
        }

        /* Ensure proper positioning for different views */
        ytd-rich-grid-media,
        ytd-video-renderer,
        ytd-grid-video-renderer,
        ytd-compact-video-renderer h3 {
            position: relative;
        }

        .yt-tooltip {
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 6px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s, visibility 0.2s;
            pointer-events: none;
            z-index: 2201;
        }

        #yt-link-saver button:hover .yt-tooltip {
            opacity: 1;
            visibility: visible;
        }

        .yt-context-menu {
            position: fixed;
            background: #282828;
            border-radius: 4px;
            padding: 8px 0;
            min-width: 180px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            z-index: 9999;
            opacity: 0;
            transform: scale(0.95);
            transition: opacity 0.1s, transform 0.1s;
        }

        .yt-context-menu.visible {
            opacity: 1;
            transform: scale(1);
        }

        .yt-context-menu-item {
            padding: 8px 16px;
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 12px;
            font-family: 'YouTube Sans', 'Roboto', sans-serif;
            font-size: 14px;
        }

        .yt-context-menu-item:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .yt-context-menu-item svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }

        /* Search box styles */
        .saved-links-header {
            margin-bottom: 16px;
        }

        .saved-links-title {
            color: #fff;
            font-size: 16px;
            margin: 0 0 12px 0;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .saved-links-actions {
            display: flex;
            gap: 8px;
            align-items: center;
            justify-content: flex-end;
        }

        .action-btn {
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 6px 12px;
            border-radius: 18px;
            font-size: 13px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
            height: 32px;
            font-family: 'YouTube Sans', 'Roboto', sans-serif;
            color: #fff;
        }

        .action-btn svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
        }

        .action-btn.primary {
            color: #3ea6ff !important; 
        }

        .action-btn.primary:hover {
            background: rgba(62, 166, 255, 0.1) !important;
        }

        .action-btn.danger {
            color: #ff4444 !important;
        }

        .action-btn.danger:hover {
            background: rgba(255, 68, 68, 0.1) !important;
        }

        /* Remove old button styles */
        .delete-all-btn, .export-btn, .import-btn {
            display: none;
        }

        .search-container {
            margin: 0 0 16px 0;
            position: relative;
            width: 100%;
            box-sizing: border-box;
        }

        .search-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 4px;
            padding: 8px 32px 8px 12px;
            color: #fff;
            font-size: 14px;
            box-sizing: border-box;
        }

        .search-input:focus {
            outline: none;
            background: rgba(255, 255, 255, 0.15);
        }

        .search-input::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }

        .clear-search {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            padding: 4px;
            border-radius: 50%;
            display: none;
        }

        .clear-search:hover {
            color: #fff;
            background: rgba(255, 255, 255, 0.1);
        }

        .search-input:not(:placeholder-shown) + .clear-search {
            display: block;
        }

        .no-results {
            text-align: center;
            color: rgba(255, 255, 255, 0.5);
            padding: 20px 0;
            font-size: 14px;
        }

        /* Confirmation dialog styles */
        .yt-confirm-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #282828;
            border-radius: 8px;
            padding: 24px;
            width: 300px;
            z-index: 10001;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .yt-confirm-dialog h4 {
            margin: 0 0 16px 0;
            color: #fff;
            font-size: 16px;
        }

        .yt-confirm-dialog p {
            margin: 0 0 20px 0;
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
            line-height: 1.4;
        }

        .dialog-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
        }

        .dialog-btn {
            padding: 8px 16px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
        }

        .dialog-btn.cancel {
            background: transparent;
            color: #fff;
        }

        .dialog-btn.cancel:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .dialog-btn.confirm {
            background: #ff4444;
            color: #fff;
        }

        .dialog-btn.confirm:hover {
            background: #ff6666;
        }

        .dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
        }

        /* Selection mode styles */
        body.yt-selecting-video * {
            cursor: pointer !important;
        }

        body.yt-selecting-video ytd-rich-item-renderer:hover,
        body.yt-selecting-video ytd-video-renderer:hover,
        body.yt-selecting-video ytd-grid-video-renderer:hover,
        body.yt-selecting-video ytd-compact-video-renderer:hover,
        body.yt-selecting-video yt-lockup-view-model:hover,
        body.yt-selecting-video .yt-lockup-view-model:hover {
            outline: 2px solid #2ba640 !important;
            outline-offset: 4px !important;
        }

        #save-button.selecting {
            background: rgba(43, 166, 64, 0.2) !important;
            color: #2ba640 !important;
        }
    `);

    // Optimized debounce with cancel support for memory leak prevention
    function debounce(func, wait) {
        let timeout;
        const executedFunction = function(...args) {
            const later = () => {
                clearTimeout(timeout);
                timeout = null;
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };

        // Add cancel method to clear pending timeouts
        executedFunction.cancel = function() {
            clearTimeout(timeout);
            timeout = null;
        };

        return executedFunction;
    }

    // Storage functions
    function getSavedLinks() {
        const links = localStorage.getItem('ytSavedLinks');
        return links ? JSON.parse(links) : [];
    }



    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `yt-notification ${type}`;
        
        const icon = document.createElement('span');
        icon.textContent = type === 'success' ? '✓' : type === 'info' ? 'ℹ' : '⚠';
        icon.style.fontWeight = 'bold';
        
        const text = document.createElement('span');
        text.textContent = message;
        
        notification.appendChild(icon);
        notification.appendChild(text);
        document.body.appendChild(notification);
        
        // Remove notification after animation
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function getVideoIdFromUrl(url) {
        try {
            const urlObj = new URL(url);
            
            // Handle youtube.com/watch?v= URLs
            if (urlObj.hostname.includes('youtube.com') && urlObj.pathname === '/watch') {
                return urlObj.searchParams.get('v');
            }
            
            // Handle youtu.be/VIDEO_ID URLs
            if (urlObj.hostname === 'youtu.be') {
                return urlObj.pathname.slice(1); // Remove leading slash
            }
            
            // Handle other potential YouTube URL formats
            if (urlObj.hostname.includes('youtube.com')) {
                const videoId = urlObj.searchParams.get('v');
                if (videoId) return videoId;
                
                // Try getting from pathname for embed URLs
                const pathParts = urlObj.pathname.split('/');
                if (pathParts.includes('embed') || pathParts.includes('v')) {
                    return pathParts[pathParts.length - 1];
                }
            }
            
            return null;
        } catch (e) {
            console.error('Error parsing URL:', e);
            return null;
        }
    }

    function applySavedStyles(elements, isSaved) {
        const uniqueElements = new Set(elements.filter(Boolean));

        uniqueElements.forEach(element => {
            if (!(element instanceof Element)) return;

            if (isSaved) {
                element.classList.add('yt-saved-video');
                element.style.setProperty('color', '#2ba640', 'important');
            } else {
                element.classList.remove('yt-saved-video');
                element.style.removeProperty('color');
            }
        });
    }

    function normalizeYoutubeUrl(href) {
        if (!href) return null;

        if (href.startsWith('http://') || href.startsWith('https://')) {
            return href;
        }

        if (href.startsWith('//')) {
            return `${window.location.protocol}${href}`;
        }

        const normalizedPath = href.startsWith('/') ? href : `/${href}`;
        return `https://www.youtube.com${normalizedPath}`;
    }

    const TITLE_SELECTOR = 'a#video-title, a#video-title-link, span#video-title, .yt-lockup-metadata-view-model-wiz__title, a.yt-lockup-metadata-view-model__title';
    const VIDEO_CONTAINER_SELECTOR = 'ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, yt-lockup-view-model';

    function checkAndHighlightTitles() {
        // Use cached saved video IDs for better performance
        const savedVideoIds = getCachedSavedVideoIds();

        // Check watch page title
        const watchTitle = document.querySelector('ytd-watch-metadata h1');
        if (watchTitle) {
            const currentVideoId = getVideoIdFromUrl(window.location.href);
            if (savedVideoIds.has(currentVideoId)) {
                watchTitle.classList.add('yt-saved-video');
            } else {
                watchTitle.classList.remove('yt-saved-video');
            }
        }

        // Optimized DOM queries - use single combined selector for better performance
        const videoTitles = document.querySelectorAll(TITLE_SELECTOR);

        // Process titles in batches to avoid blocking the main thread
        const batchSize = 50;
        let currentIndex = 0;

        function processBatch() {
            const endIndex = Math.min(currentIndex + batchSize, videoTitles.length);

            for (let i = currentIndex; i < endIndex; i++) {
                const title = videoTitles[i];
                const anchor = title.tagName === 'A' ? title : title.closest('a');
                if (!anchor || !anchor.href) continue;

                const videoId = getVideoIdFromUrl(anchor.href);
                if (!videoId) continue;

                const isSaved = savedVideoIds.has(videoId);
                const textElement = anchor.querySelector('.yt-core-attributed-string');

                applySavedStyles([anchor, title === anchor ? null : title, textElement], isSaved);
            }

            currentIndex = endIndex;

            // Continue processing if there are more titles
            if (currentIndex < videoTitles.length) {
                requestAnimationFrame(processBatch);
            }
        }

        // Start processing if there are titles to process
        if (videoTitles.length > 0) {
            processBatch();
        }
    }



    // Performance optimized variables
    let currentUrl = window.location.href;
    let savedVideoIdsCache = null;
    let cacheTimestamp = 0;
    const CACHE_DURATION = 5000; // 5 seconds cache

    // Optimized function to get cached saved video IDs
    function getCachedSavedVideoIds() {
        const now = Date.now();
        if (!savedVideoIdsCache || (now - cacheTimestamp) > CACHE_DURATION) {
            const savedLinks = getSavedLinks();
            savedVideoIdsCache = new Set(savedLinks.map(link => getVideoIdFromUrl(link.url)));
            cacheTimestamp = now;
        }
        return savedVideoIdsCache;
    }

    // Invalidate cache when videos are added/removed
    function invalidateCache() {
        savedVideoIdsCache = null;
        cacheTimestamp = 0;
    }

    // Optimized debounced function with longer delay for better performance
    const debouncedCheckAndHighlightTitles = debounce(checkAndHighlightTitles, 1500);

    // Intersection Observer for lazy loading - only process visible elements
    const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                // Process this specific element
                processVideoElement(element);
                // Stop observing this element once processed
                intersectionObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px' // Start processing 50px before element becomes visible
    });

    // Function to process individual video elements
    function processVideoElement(container) {
        const savedVideoIds = getCachedSavedVideoIds();
        const videoTitles = container.querySelectorAll(TITLE_SELECTOR);

        videoTitles.forEach(title => {
            const anchor = title.tagName === 'A' ? title : title.closest('a');
            if (!anchor || !anchor.href) return;

            const videoId = getVideoIdFromUrl(anchor.href);
            if (!videoId) return;

            const isSaved = savedVideoIds.has(videoId);
            const textElement = anchor.querySelector('.yt-core-attributed-string');

            applySavedStyles([anchor, title === anchor ? null : title, textElement], isSaved);
        });
    }

    // Single optimized mutation observer for both DOM changes and URL changes
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        let urlChanged = false;

        // Check for URL changes first (most efficient)
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            urlChanged = true;
            shouldUpdate = true;
        }

        // Only check DOM mutations if URL didn't change (avoid redundant work)
        if (!urlChanged) {
            for (let mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // More efficient check - only look for specific parent containers
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1 && node.tagName && (
                            node.tagName.startsWith('YTD-') ||
                            node.id === 'contents' ||
                            node.classList?.contains('ytd-rich-grid-renderer') ||
                            node.classList?.contains('ytd-item-section-renderer')
                        )) {
                            // Add new video containers to intersection observer for lazy loading
                            if (node.matches?.(VIDEO_CONTAINER_SELECTOR)) {
                                intersectionObserver.observe(node);
                            }

                            const videoContainers = node.querySelectorAll(VIDEO_CONTAINER_SELECTOR);
                            videoContainers.forEach(container => {
                                intersectionObserver.observe(container);
                            });
                            shouldUpdate = true;
                            break;
                        }
                    }
                    if (shouldUpdate) break;
                }
            }
        }

        if (shouldUpdate) {
            debouncedCheckAndHighlightTitles();
        }
    });

    // Start observing with throttled options
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false, // Disable attribute watching
        characterData: false // Disable text changes
    });

    // Comprehensive cleanup on page unload to prevent memory leaks
    function cleanup() {
        observer.disconnect();
        intersectionObserver.disconnect();
        // Clear cache
        savedVideoIdsCache = null;
        // Remove any pending timeouts
        if (debouncedCheckAndHighlightTitles.cancel) {
            debouncedCheckAndHighlightTitles.cancel();
        }
    }

    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('pagehide', cleanup); // For mobile browsers

    // Pause observers when tab is not visible for better performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            observer.disconnect();
            intersectionObserver.disconnect();
            // Cancel any pending debounced calls
            if (debouncedCheckAndHighlightTitles.cancel) {
                debouncedCheckAndHighlightTitles.cancel();
            }
        } else {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });
            // Re-observe existing video containers
            const videoContainers = document.querySelectorAll(VIDEO_CONTAINER_SELECTOR);
            videoContainers.forEach(container => {
                intersectionObserver.observe(container);
            });
            // Trigger update when tab becomes visible
            setTimeout(() => checkAndHighlightTitles(), 300);
        }
    });

    // Modify saveLink function to validate video ID
    function saveLink(url, title) {
        const videoId = getVideoIdFromUrl(url);
        
        if (!videoId) {
            showNotification('Cannot save - not a YouTube video page', 'error');
            return false;
        }

        const links = getSavedLinks();
        const existingIndex = links.findIndex(link => getVideoIdFromUrl(link.url) === videoId);
        
        // If video exists, remove it
        if (existingIndex !== -1) {
            links.splice(existingIndex, 1);
            localStorage.setItem('ytSavedLinks', JSON.stringify(links));
            invalidateCache(); // Invalidate cache when data changes
            updateLinksList();
            updateVideoCount();
            showNotification('Video removed from saved list');
            // Force immediate color update
            setTimeout(() => checkAndHighlightTitles(), 100);
            return true;
        }

        // If video doesn't exist, add it
        links.push({ url, title, date: new Date().toISOString() });
        localStorage.setItem('ytSavedLinks', JSON.stringify(links));
        invalidateCache(); // Invalidate cache when data changes
        updateLinksList();
        updateVideoCount();
        showNotification('Video saved successfully');
        // Force immediate color update
        setTimeout(() => checkAndHighlightTitles(), 100);
        return true;
    }

    // Add delete function
    function deleteLink(index) {
        const links = getSavedLinks();
        links.splice(index, 1);
        localStorage.setItem('ytSavedLinks', JSON.stringify(links));
        invalidateCache(); // Invalidate cache when data changes
        updateLinksList();
        updateVideoCount();
        showNotification('Video deleted successfully');
        // Force immediate color update
        setTimeout(() => checkAndHighlightTitles(), 100);
    }

    // Modify handleSave function to handle toggle
    function handleSave(urlOrEvent = null, title = null) {
        // If first argument is an event or null, get URL from current page
        let url;
        if (!urlOrEvent || urlOrEvent instanceof Event) {
            url = window.location.href;
        } else {
            url = urlOrEvent;
        }

        // If no title provided, get from current page
        if (!title) {
            title = document.title.replace(' - YouTube', '');
        }
        
        saveLink(url, title);
    }

    // Add keyboard shortcut handler
    document.addEventListener('keydown', (e) => {
        // Check if typing in an input/textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Check for backslash key
        if (e.key === '\\') {
            e.preventDefault();
            handleSave();
        }
        
        // Check for underscore key to toggle selection mode
        if (e.key === '_') {
            e.preventDefault();
            if (isSelectingVideo) {
                exitVideoSelectionMode();
                showNotification('Video selection cancelled', 'info');
            } else {
                enterVideoSelectionMode();
            }
        }
    });

    // Add selection mode state
    let isSelectingVideo = false;

    // Function to enter video selection mode
    function enterVideoSelectionMode() {
        isSelectingVideo = true;
        document.body.classList.add('yt-selecting-video');
        saveButton.classList.add('selecting');
        showNotification('Click any video to save it', 'info');
        // Refresh colors when entering selection mode
        checkAndHighlightTitles();
    }

    // Function to exit video selection mode
    function exitVideoSelectionMode() {
        isSelectingVideo = false;
        document.body.classList.remove('yt-selecting-video');
        saveButton.classList.remove('selecting');
        // Refresh colors when exiting selection mode
        checkAndHighlightTitles();
    }

    // Handle video click in selection mode
    function handleVideoClick(e) {
        if (!isSelectingVideo) return;

        // Find the video element and get its URL and title
        const videoElement = e.target.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-playlist-panel-video-renderer, yt-lockup-view-model');
        if (!videoElement) return;

        // Always prevent default behavior in selection mode
        e.preventDefault();
        e.stopPropagation();

        // Try multiple methods to find the video link and title
        let url, title;
        
        // Method 1: Try new lockup view model
        if (videoElement.tagName.toLowerCase() === 'yt-lockup-view-model') {
            const titleLink = videoElement.querySelector('.yt-lockup-metadata-view-model-wiz__title, a.yt-lockup-metadata-view-model__title');

            if (titleLink) {
                const titleSpan = titleLink.querySelector('.yt-core-attributed-string');
                title = (titleSpan?.textContent || titleLink.textContent || '').trim();
                url = normalizeYoutubeUrl(titleLink.getAttribute('href') || titleLink.href);
            }
        }
        // Method 2: Try playlist panel renderer
        else if (videoElement.tagName.toLowerCase() === 'ytd-playlist-panel-video-renderer') {
            const titleSpan = videoElement.querySelector('span#video-title');
            const linkElement = videoElement.querySelector('a#wc-endpoint');
            
            if (titleSpan && linkElement) {
                title = titleSpan.textContent.trim();
                url = normalizeYoutubeUrl(linkElement.getAttribute('href') || linkElement.href);
            }
        }
        // Method 3: Try compact video renderer
        else if (videoElement.tagName.toLowerCase() === 'ytd-compact-video-renderer') {
            const titleSpan = videoElement.querySelector('span#video-title');
            const linkElement = videoElement.querySelector('a.yt-simple-endpoint[href*="/watch"]');
            
            if (titleSpan && linkElement) {
                title = titleSpan.textContent.trim();
                url = normalizeYoutubeUrl(linkElement.getAttribute('href') || linkElement.href);
            }
        }
        
        // Method 4: Standard video title link (fallback)
        if (!url || !title) {
            const titleLink = videoElement.querySelector('a#video-title, a#video-title-link, a.yt-lockup-metadata-view-model__title');
            if (titleLink) {
                url = normalizeYoutubeUrl(titleLink.getAttribute('href') || titleLink.href);
                title = (titleLink.textContent || '').trim();
            }
        }

        // Method 5: Try formatted string inside link (fallback)
        if (!title && url) {
            const formattedString = videoElement.querySelector('yt-formatted-string');
            if (formattedString) {
                title = formattedString.textContent.trim();
            }
        }
        
        // Method 6: Try metadata (final fallback)
        if (!url || !title) {
            const metadata = videoElement.data;
            if (metadata) {
                if (!url && metadata.navigationEndpoint?.commandMetadata?.webCommandMetadata?.url) {
                    url = normalizeYoutubeUrl(metadata.navigationEndpoint.commandMetadata.webCommandMetadata.url);
                }
                if (!title && metadata.title?.runs?.[0]?.text) {
                    title = metadata.title.runs[0].text;
                }
            }
        }

        // Method 7: Fallback to any watch link inside element
        if (!url) {
            const genericLink = videoElement.querySelector('a[href*="/watch"]');
            if (genericLink) {
                url = normalizeYoutubeUrl(genericLink.getAttribute('href') || genericLink.href);
                if (!title) {
                    const textCandidate = genericLink.querySelector('.yt-core-attributed-string');
                    title = (textCandidate?.textContent || genericLink.textContent || '').trim();
                }
            }
        }

        // If we found both URL and title, save the video
        if (url && title) {
            handleSave(url, title);
            return false;
        } else {
            showNotification('Could not extract video data', 'error');
        }
    }

    // Single click handler for selection mode
    document.addEventListener('click', (e) => {
        if (isSelectingVideo) {
            handleVideoClick(e);
        }
    }, true);

    // Create UI
    const container = document.createElement('div');
    container.id = 'yt-link-saver';
    container.className = 'collapsed';

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.alignItems = 'center';
    buttonContainer.style.gap = '8px';
    
    const saveButton = document.createElement('button');
    saveButton.id = 'save-button';
    saveButton.setAttribute('aria-label', 'Save Video');
    
    // Create bookmark icon using YouTube's style
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '24');
    svg.style.fill = 'currentColor';
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M22 13h-4v4h-2v-4h-4v-2h4V7h2v4h4v2zm-8-6H2v1h12V7zM2 12h8v-1H2v1zm0 4h8v-1H2v1z');
    svg.appendChild(path);
    
    saveButton.appendChild(svg);
    
    // Create tooltip for save button
    const saveTooltip = document.createElement('div');
    saveTooltip.className = 'yt-tooltip';
    saveTooltip.textContent = 'Save current video (Right click to select any video)';
    saveButton.appendChild(saveTooltip);

    // Replace clipboard handler with selection mode
    saveButton.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (isSelectingVideo) {
            exitVideoSelectionMode();
            showNotification('Video selection cancelled', 'info');
        } else {
            enterVideoSelectionMode();
        }
    });

    // Add click handler to exit selection mode if clicking save button again
    saveButton.addEventListener('click', (e) => {
        if (isSelectingVideo) {
            e.preventDefault();
            exitVideoSelectionMode();
            showNotification('Video selection cancelled', 'info');
        } else {
            handleSave();
        }
    });
    
    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggle-list';
    toggleButton.setAttribute('aria-label', 'Saved Videos');
    
    // Create list icon using YouTube's style
    const listSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    listSvg.setAttribute('height', '24');
    listSvg.setAttribute('viewBox', '0 0 24 24');
    listSvg.setAttribute('width', '24');
    listSvg.style.fill = 'currentColor';
    
    const listPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    listPath.setAttribute('d', 'M4 10h12v2H4zm0-4h12v2H4zm0 8h8v2H4zm10 0h8v2h-8zm-10 4h8v2H4zm10 0h8v2h-8z');
    listSvg.appendChild(listPath);
    
    toggleButton.appendChild(listSvg);
    
    // Create tooltip for toggle button
    const toggleTooltip = document.createElement('div');
    toggleTooltip.className = 'yt-tooltip';
    toggleTooltip.textContent = 'Saved Videos';
    toggleButton.appendChild(toggleTooltip);
    
    const videoCount = document.createElement('span');
    videoCount.className = 'video-count';
    
    const linksList = document.createElement('div');
    linksList.id = 'saved-links';

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(toggleButton);
    buttonContainer.appendChild(videoCount);
    container.appendChild(buttonContainer);
    container.appendChild(linksList);

    // Wait for DOM to be ready
    function initializeUI() {
        const masthead = document.querySelector('#end.style-scope.ytd-masthead');
        if (masthead) {
            // Insert before the notification button
            const notificationBtn = masthead.querySelector('ytd-notification-topbar-button-renderer');
            if (notificationBtn) {
                masthead.insertBefore(container, notificationBtn);
            } else {
                masthead.appendChild(container);
            }
            // Initialize video count
            updateVideoCount();
            // Initial highlight check
            checkAndHighlightTitles();
        } else {
            setTimeout(initializeUI, 100);
        }
    }

    // Start initialization
    initializeUI();

    // Event listeners
    toggleButton.addEventListener('click', toggleSavedList);

    linksList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            e.stopPropagation(); // Stop event from bubbling up to document
            const index = parseInt(e.target.dataset.index);
            deleteLink(index);
        }
    });

    // Update video count
    function updateVideoCount() {
        const count = getSavedLinks().length;
        videoCount.textContent = count;
    }

    // Toggle saved videos list
    function toggleSavedList() {
        linksList.classList.toggle('visible');
        container.classList.toggle('collapsed');
        if (linksList.classList.contains('visible')) {
            updateLinksList();
            updateVideoCount();
            // Force color update when opening list
            setTimeout(() => checkAndHighlightTitles(), 100);
        }
    }

    // Export saved videos to JSON
    function exportSavedVideos() {
        const links = getSavedLinks();
        const jsonStr = JSON.stringify(links, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'youtube-saved-videos.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Videos exported successfully');
    }

    // Import saved videos from JSON
    function importSavedVideos(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Validate data structure
                if (!Array.isArray(importedData)) {
                    throw new Error('Invalid file format: Data must be an array');
                }
                
                // Validate each entry
                importedData.forEach(item => {
                    if (!item.url || !item.title || !item.date) {
                        throw new Error('Invalid data structure: Each entry must have url, title, and date');
                    }
                });
                
                // Get current links and merge with imported ones
                const currentLinks = getSavedLinks();
                let newCount = 0;
                
                importedData.forEach(item => {
                    const videoId = getVideoIdFromUrl(item.url);
                    if (videoId && !currentLinks.some(link => getVideoIdFromUrl(link.url) === videoId)) {
                        currentLinks.push(item);
                        newCount++;
                    }
                });
                
                // Save merged links
                localStorage.setItem('ytSavedLinks', JSON.stringify(currentLinks));
                invalidateCache(); // Invalidate cache when data changes
                updateLinksList();
                updateVideoCount();
                checkAndHighlightTitles();
                
                showNotification(`Successfully imported ${newCount} new videos`);
            } catch (error) {
                showNotification('Error importing file: ' + error.message, 'error');
            }
        };
        reader.onerror = function() {
            showNotification('Error reading file', 'error');
        };
        reader.readAsText(file);
    }

    // Update links list with search functionality
    function updateLinksList(searchQuery = '') {
        // Only create header and search if they don't exist
        if (!linksList.querySelector('.saved-links-header')) {
            // Add title
            const title = document.createElement('h3');
            title.className = 'saved-links-title';
            title.textContent = 'Saved Videos';
            linksList.appendChild(title);
            
            // Add header with action buttons
            const headerContainer = document.createElement('div');
            headerContainer.className = 'saved-links-header';
            
            const actionsContainer = document.createElement('div');
            actionsContainer.className = 'saved-links-actions';
            
            // Export button with icon
            const exportBtn = document.createElement('button');
            exportBtn.className = 'action-btn primary';
            
            const exportIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            exportIcon.setAttribute('viewBox', '0 0 24 24');
            const exportPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            exportPath.setAttribute('d', 'M5 4v2h14V4H5zm0 10h4v6h6v-6h4l-7-7-7 7z');
            exportIcon.appendChild(exportPath);
            
            const exportText = document.createElement('span');
            exportText.textContent = 'Export';
            
            exportBtn.appendChild(exportIcon);
            exportBtn.appendChild(exportText);
            exportBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                exportSavedVideos();
            });

            // Import button with icon
            const importBtn = document.createElement('button');
            importBtn.className = 'action-btn primary';
            
            const importIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            importIcon.setAttribute('viewBox', '0 0 24 24');
            const importPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            importPath.setAttribute('d', 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z');
            importIcon.appendChild(importPath);
            
            const importText = document.createElement('span');
            importText.textContent = 'Import';
            
            importBtn.appendChild(importIcon);
            importBtn.appendChild(importText);
            
            // Create hidden file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            fileInput.style.display = 'none';
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    importSavedVideos(e.target.files[0]);
                }
                e.target.value = '';
            });
            document.body.appendChild(fileInput);
            
            importBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                fileInput.click();
            });
            
            // Delete All button with icon
            const deleteAllBtn = document.createElement('button');
            deleteAllBtn.className = 'action-btn danger';
            
            const deleteIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            deleteIcon.setAttribute('viewBox', '0 0 24 24');
            const deletePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            deletePath.setAttribute('d', 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z');
            deleteIcon.appendChild(deletePath);
            
            const deleteText = document.createElement('span');
            deleteText.textContent = 'Delete All';
            
            deleteAllBtn.appendChild(deleteIcon);
            deleteAllBtn.appendChild(deleteText);
            deleteAllBtn.addEventListener('click', showDeleteAllConfirmation);
            
            actionsContainer.appendChild(exportBtn);
            actionsContainer.appendChild(importBtn);
            actionsContainer.appendChild(deleteAllBtn);
            headerContainer.appendChild(actionsContainer);
            linksList.appendChild(headerContainer);
            
            // Add search box
            const searchContainer = document.createElement('div');
            searchContainer.className = 'search-container';
            
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.className = 'search-input';
            searchInput.placeholder = 'Search saved videos...';
            
            const clearSearch = document.createElement('span');
            clearSearch.className = 'clear-search';
            clearSearch.textContent = '✕';
            clearSearch.addEventListener('click', () => {
                searchInput.value = '';
                updateLinksContent('');
            });
            
            searchInput.addEventListener('input', (e) => {
                updateLinksContent(e.target.value);
            });
            
            searchContainer.appendChild(searchInput);
            searchContainer.appendChild(clearSearch);
            linksList.appendChild(searchContainer);
        }

        // Update search input value if provided
        const searchInput = linksList.querySelector('.search-input');
        if (searchQuery && searchInput.value !== searchQuery) {
            searchInput.value = searchQuery;
        }

        updateLinksContent(searchInput.value);
    }

    // Separate function to update only the links content
    function updateLinksContent(searchQuery) {
        const links = getSavedLinks();
        
        // Remove only the links, keeping header and search
        const existingLinks = linksList.querySelectorAll('.saved-link, .no-results');
        existingLinks.forEach(link => link.remove());
        
        // Filter links based on search query
        const filteredLinks = searchQuery ? 
            links.filter(link => link.title.toLowerCase().includes(searchQuery.toLowerCase())) :
            links;
        
        if (filteredLinks.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = searchQuery ? 'No videos match your search' : 'No saved videos yet';
            linksList.appendChild(noResults);
            return;
        }
        
        filteredLinks.forEach((link) => {
            const linkElement = document.createElement('div');
            linkElement.className = 'saved-link';
            
            const anchor = document.createElement('a');
            anchor.href = link.url;
            anchor.target = '_blank';
            anchor.textContent = link.title;
            
            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '✕';
            deleteBtn.dataset.index = links.indexOf(link); // Use original index
            
            const dateElement = document.createElement('small');
            const date = new Date(link.date).toLocaleDateString();
            dateElement.textContent = date;
            
            linkElement.appendChild(deleteBtn);
            linkElement.appendChild(anchor);
            linkElement.appendChild(dateElement);
            
            linksList.appendChild(linkElement);
        });
    }

    // Delete all confirmation
    function showDeleteAllConfirmation() {
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';
        
        const dialog = document.createElement('div');
        dialog.className = 'yt-confirm-dialog';
        
        const title = document.createElement('h4');
        title.textContent = 'Delete All Videos?';
        
        const message = document.createElement('p');
        message.textContent = 'Are you sure you want to delete all saved videos? This action cannot be undone.';
        
        const buttons = document.createElement('div');
        buttons.className = 'dialog-buttons';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'dialog-btn cancel';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        };
        
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'dialog-btn confirm';
        confirmBtn.textContent = 'Delete All';
        confirmBtn.onclick = () => {
            showFinalConfirmation();
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        };
        
        buttons.appendChild(cancelBtn);
        buttons.appendChild(confirmBtn);
        
        dialog.appendChild(title);
        dialog.appendChild(message);
        dialog.appendChild(buttons);
        
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    function showFinalConfirmation() {
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';
        
        const dialog = document.createElement('div');
        dialog.className = 'yt-confirm-dialog';
        
        const title = document.createElement('h4');
        title.textContent = 'Final Confirmation';
        
        const message = document.createElement('p');
        message.textContent = 'Are you absolutely sure? All your saved videos will be permanently deleted.';
        
        const buttons = document.createElement('div');
        buttons.className = 'dialog-buttons';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'dialog-btn cancel';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        };
        
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'dialog-btn confirm';
        confirmBtn.textContent = 'Yes, Delete All';
        confirmBtn.onclick = () => {
            localStorage.setItem('ytSavedLinks', '[]');
            invalidateCache(); // Invalidate cache when all data is deleted
            updateLinksList();
            updateVideoCount();
            showNotification('All videos have been deleted');
            checkAndHighlightTitles(); // Use optimized function instead
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        };
        
        buttons.appendChild(cancelBtn);
        buttons.appendChild(confirmBtn);
        
        dialog.appendChild(title);
        dialog.appendChild(message);
        dialog.appendChild(buttons);
        
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    // Add click outside handler
    document.addEventListener('click', (e) => {
        if (linksList.classList.contains('visible') && 
            !container.contains(e.target) && 
            !e.target.closest('.yt-confirm-dialog')) {
            linksList.classList.remove('visible');
            container.classList.add('collapsed');
        }
    });
})(); 
