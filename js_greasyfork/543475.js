// ==UserScript==
// @name         YouTube Smart Filter - Configurable View Threshold
// @namespace    https://greasyfork.org/en/users/866731-sharmanhall
// @version      2.0
// @description  Remove YouTube videos based on configurable view count thresholds. Filter out low-engagement content with customizable settings via an intuitive floating panel.
// @author       sharmanhall
// @match        *://*.youtube.com/*
// @exclude      *://*.youtube.com/feed/subscriptions
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543475/YouTube%20Smart%20Filter%20-%20Configurable%20View%20Threshold.user.js
// @updateURL https://update.greasyfork.org/scripts/543475/YouTube%20Smart%20Filter%20-%20Configurable%20View%20Threshold.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default configuration
    const DEFAULT_CONFIG = {
        enabled: true,
        minViews: 1000,
        filterVideos: true,
        filterShorts: true,
        showRemovalCount: true,
        debugMode: false
    };

    // Load configuration
    let config = { ...DEFAULT_CONFIG };
    Object.keys(DEFAULT_CONFIG).forEach(key => {
        const saved = GM_getValue(key);
        if (saved !== undefined) {
            config[key] = saved;
        }
    });

    // Statistics
    let stats = {
        videosRemoved: 0,
        shortsSkipped: 0,
        sessionStart: Date.now()
    };

    // UI Elements
    let configPanel = null;
    let floatingButton = null;
    let statsDisplay = null;

    // Utility functions
    function log(message, isDebug = false) {
        if (!isDebug || config.debugMode) {
            console.log(`[YouTube Smart Filter] ${message}`);
        }
    }

    function saveConfig() {
        Object.keys(config).forEach(key => {
            GM_setValue(key, config[key]);
        });
        log('Configuration saved');
    }

    function parseViewCount(text) {
        if (!text) return 0;

        // Handle different number formats
        const cleanText = text.toLowerCase().replace(/,/g, '');
        
        // Handle Indian system
        if (cleanText.includes('crore')) {
            const num = parseFloat(cleanText.match(/[\d.]+/)?.[0] || '0');
            return num * 10000000; // 1 crore = 10 million
        }
        if (cleanText.includes('lakh')) {
            const num = parseFloat(cleanText.match(/[\d.]+/)?.[0] || '0');
            return num * 100000; // 1 lakh = 100k
        }

        // Handle standard suffixes
        if (cleanText.includes('b')) {
            const num = parseFloat(cleanText.match(/[\d.]+/)?.[0] || '0');
            return num * 1000000000;
        }
        if (cleanText.includes('m')) {
            const num = parseFloat(cleanText.match(/[\d.]+/)?.[0] || '0');
            return num * 1000000;
        }
        if (cleanText.includes('k')) {
            const num = parseFloat(cleanText.match(/[\d.]+/)?.[0] || '0');
            return num * 1000;
        }

        // Extract raw number
        const match = cleanText.match(/(\d+(?:[.,]\d+)*)/);
        if (match) {
            return parseInt(match[1].replace(/[.,]/g, ''));
        }

        return 0;
    }

    function shouldRemoveVideo(viewsElement) {
        if (!config.enabled || !viewsElement) return false;

        const viewText = viewsElement.innerText || viewsElement.textContent || '';
        
        // Skip if this doesn't look like a view count
        if (!viewText || !viewText.toLowerCase().includes('view')) return false;
        
        const viewCount = parseViewCount(viewText);
        
        log(`Checking video: "${viewText}" = ${viewCount} views`, true);
        
        return viewCount < config.minViews && viewCount > 0;
    }

    function shouldSkipShort(viewsElement) {
        if (!config.enabled || !config.filterShorts || !viewsElement) return false;

        const text = viewsElement.innerText || viewsElement.textContent || '';
        
        // Shorts with no proper view count or very low engagement
        if (text.length === 0) return true;
        
        // Check for non-breaking space (indicates loading/no views)
        if (text.includes('\xa0')) return false;
        
        const viewCount = parseViewCount(text);
        return viewCount < config.minViews && viewCount > 0;
    }

    // Page detection functions
    function isSubscriptions() {
        return location.pathname.startsWith("/feed/subscriptions");
    }

    function isChannel() {
        return location.pathname.startsWith("/@") || location.pathname.startsWith("/c/") || location.pathname.startsWith("/channel/");
    }

    function isShorts() {
        return location.pathname.startsWith("/shorts");
    }

    function isWatch() {
        return location.pathname.startsWith("/watch");
    }

    // Main filtering function
    function filterContent() {
        if (!config.enabled || isSubscriptions() || isChannel()) {
            return;
        }

        if (isShorts() && config.filterShorts) {
            filterShorts();
        } else if (config.filterVideos) {
            filterVideos();
        }

        updateStatsDisplay();
    }

    function filterVideos() {
        const selectors = [
            // Main page videos
            '.style-scope.ytd-rich-item-renderer#content',
            // Sidebar videos
            '.style-scope.ytd-compact-video-renderer',
            // Watch page related videos
            '.style-scope.ytd-video-preview'
        ];

        let removedCount = 0;
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                try {
                    // Skip if already processed
                    if (element.hasAttribute('data-smart-filter-processed')) return;
                    element.setAttribute('data-smart-filter-processed', 'true');
                    
                    let viewsElement = null;
                    
                    // Find views element based on container type
                    if (element.classList.contains('ytd-rich-item-renderer') || 
                        element.classList.contains('ytd-compact-video-renderer') ||
                        element.classList.contains('ytd-video-preview')) {
                        viewsElement = element.querySelector('.inline-metadata-item.style-scope.ytd-video-meta-block');
                    }

                    if (viewsElement && shouldRemoveVideo(viewsElement)) {
                        const container = element.closest('ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-video-preview') || element;
                        if (container && container.parentElement) {
                            log(`Removing video: ${viewsElement.textContent}`, true);
                            container.remove();
                            stats.videosRemoved++;
                            removedCount++;
                        }
                    }
                } catch (error) {
                    log(`Error filtering element: ${error.message}`, true);
                }
            });
        });

        // Handle new YouTube layout with debouncing
        if (removedCount < 5) { // Only check new layout if we haven't removed many videos already
            const newLayoutElements = document.querySelectorAll('yt-lockup-view-model:not([data-smart-filter-processed])');
            newLayoutElements.forEach(video => {
                try {
                    video.setAttribute('data-smart-filter-processed', 'true');
                    
                    // Look for view count in the new structure
                    let viewsElement = video.querySelector('.yt-content-metadata-view-model-wiz__metadata-text');
                    if (viewsElement) {
                        // Check if this element contains view count
                        let viewText = viewsElement.innerText;
                        if (viewText && (viewText.includes('views') || viewText.includes('lakh') || viewText.includes('crore') || /\d+\s*views/i.test(viewText))) {
                            if (shouldRemoveVideo(viewsElement)) {
                                video.remove();
                                stats.videosRemoved++;
                            }
                        }
                    }
                } catch (error) {
                    log(`Error filtering new layout element: ${error.message}`, true);
                }
            });
        }
    }

    function filterShorts() {
        const shortElements = document.querySelectorAll('.reel-video-in-sequence.style-scope.ytd-shorts:not([data-smart-filter-processed])');
        
        shortElements.forEach(shortElement => {
            if (!shortElement.isActive) return;
            
            shortElement.setAttribute('data-smart-filter-processed', 'true');
            
            const viewsElement = shortElement.querySelector('.yt-spec-button-shape-with-label__label');
            
            if (shouldSkipShort(viewsElement)) {
                log(`Skipping short: ${viewsElement?.textContent || 'unknown'}`, true);
                const nextButton = document.querySelector('.navigation-button.style-scope.ytd-shorts:nth-child(2) .yt-spec-touch-feedback-shape__fill');
                if (nextButton) {
                    nextButton.click();
                    stats.shortsSkipped++;
                }
            }
        });
    }

    // UI Creation
    function createFloatingButton() {
        floatingButton = document.createElement('div');
        floatingButton.innerHTML = '🎯';
        floatingButton.title = 'YouTube Smart Filter Settings';
        
        Object.assign(floatingButton.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            backgroundColor: '#ff0000',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '20px',
            zIndex: '10000',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            userSelect: 'none'
        });

        floatingButton.addEventListener('mouseenter', () => {
            floatingButton.style.transform = 'scale(1.1)';
            floatingButton.style.backgroundColor = '#cc0000';
        });

        floatingButton.addEventListener('mouseleave', () => {
            floatingButton.style.transform = 'scale(1)';
            floatingButton.style.backgroundColor = '#ff0000';
        });

        floatingButton.addEventListener('click', toggleConfigPanel);
        document.body.appendChild(floatingButton);
    }

    function createStatsDisplay() {
        if (!config.showRemovalCount) return;

        statsDisplay = document.createElement('div');
        Object.assign(statsDisplay.style, {
            position: 'fixed',
            top: '80px',
            right: '20px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            zIndex: '9999',
            fontFamily: 'Arial, sans-serif',
            minWidth: '120px',
            textAlign: 'center'
        });

        document.body.appendChild(statsDisplay);
        updateStatsDisplay();
    }

    function updateStatsDisplay() {
        if (!statsDisplay || !config.showRemovalCount) return;

        const sessionTime = Math.round((Date.now() - stats.sessionStart) / 1000 / 60);
        const statsHTML = `
            <div>Videos: ${stats.videosRemoved}</div>
            <div>Shorts: ${stats.shortsSkipped}</div>
            <div>Time: ${sessionTime}m</div>
        `;
        
        // Use textContent to avoid CSP issues
        statsDisplay.textContent = '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = statsHTML;
        while (tempDiv.firstChild) {
            statsDisplay.appendChild(tempDiv.firstChild);
        }
    }

    function createConfigPanel() {
        configPanel = document.createElement('div');
        Object.assign(configPanel.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            border: '2px solid #ccc',
            borderRadius: '12px',
            padding: '20px',
            zIndex: '10001',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#333',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            minWidth: '400px',
            maxHeight: '80vh',
            overflowY: 'auto'
        });

        const panelHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #ff0000;">🎯 YouTube Smart Filter</h2>
                <p style="margin: 5px 0; color: #666;">Configure your video filtering preferences</p>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; margin-bottom: 10px;">
                    <input type="checkbox" id="enabledCheck" style="margin-right: 8px;" ${config.enabled ? 'checked' : ''}>
                    <strong>Enable Filtering</strong>
                </label>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;"><strong>Minimum View Count:</strong></label>
                <input type="number" id="minViewsInput" value="${config.minViews}" 
                       style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" min="0" step="100">
                <small style="color: #666;">Videos with fewer views will be filtered out</small>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; margin-bottom: 8px;">
                    <input type="checkbox" id="filterVideosCheck" style="margin-right: 8px;" ${config.filterVideos ? 'checked' : ''}>
                    Filter Regular Videos
                </label>
                <label style="display: flex; align-items: center;">
                    <input type="checkbox" id="filterShortsCheck" style="margin-right: 8px;" ${config.filterShorts ? 'checked' : ''}>
                    Filter YouTube Shorts
                </label>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; margin-bottom: 8px;">
                    <input type="checkbox" id="showCountCheck" style="margin-right: 8px;" ${config.showRemovalCount ? 'checked' : ''}>
                    Show Removal Statistics
                </label>
                <label style="display: flex; align-items: center;">
                    <input type="checkbox" id="debugModeCheck" style="margin-right: 8px;" ${config.debugMode ? 'checked' : ''}>
                    Debug Mode (Console Logging)
                </label>
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px;">
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="saveBtn" style="background: #ff0000; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">
                        Save Settings
                    </button>
                    <button id="resetBtn" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                        Reset to Defaults
                    </button>
                    <button id="closeBtn" style="background: #ccc; color: #333; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                        Close
                    </button>
                </div>
            </div>

            <div style="margin-top: 15px; text-align: center; font-size: 12px; color: #888;">
                <p>Session Stats: ${stats.videosRemoved} videos removed, ${stats.shortsSkipped} shorts skipped</p>
            </div>
        `;

        // Use textContent to avoid CSP issues
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = panelHTML;
        while (tempDiv.firstChild) {
            configPanel.appendChild(tempDiv.firstChild);
        }

        // Event listeners
        configPanel.querySelector('#saveBtn').addEventListener('click', saveSettings);
        configPanel.querySelector('#resetBtn').addEventListener('click', resetSettings);
        configPanel.querySelector('#closeBtn').addEventListener('click', closeConfigPanel);

        // Add hover effects to buttons
        configPanel.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('mouseenter', () => btn.style.opacity = '0.8');
            btn.addEventListener('mouseleave', () => btn.style.opacity = '1');
        });

        document.body.appendChild(configPanel);

        // Create backdrop
        const backdrop = document.createElement('div');
        Object.assign(backdrop.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: '10000'
        });
        backdrop.addEventListener('click', closeConfigPanel);
        document.body.appendChild(backdrop);
        configPanel.backdrop = backdrop;
    }

    function toggleConfigPanel() {
        if (configPanel && configPanel.parentElement) {
            closeConfigPanel();
        } else {
            createConfigPanel();
        }
    }

    function closeConfigPanel() {
        if (configPanel) {
            if (configPanel.backdrop) {
                configPanel.backdrop.remove();
            }
            configPanel.remove();
            configPanel = null;
        }
    }

    function saveSettings() {
        config.enabled = document.getElementById('enabledCheck').checked;
        config.minViews = parseInt(document.getElementById('minViewsInput').value) || DEFAULT_CONFIG.minViews;
        config.filterVideos = document.getElementById('filterVideosCheck').checked;
        config.filterShorts = document.getElementById('filterShortsCheck').checked;
        config.showRemovalCount = document.getElementById('showCountCheck').checked;
        config.debugMode = document.getElementById('debugModeCheck').checked;

        saveConfig();
        closeConfigPanel();

        // Update UI based on new settings
        if (config.showRemovalCount && !statsDisplay) {
            createStatsDisplay();
        } else if (!config.showRemovalCount && statsDisplay) {
            statsDisplay.remove();
            statsDisplay = null;
        }

        log('Settings saved successfully!');
        
        // Re-run filtering with new settings
        setTimeout(filterContent, 100);
    }

    function resetSettings() {
        config = { ...DEFAULT_CONFIG };
        saveConfig();
        closeConfigPanel();
        
        if (statsDisplay) {
            statsDisplay.remove();
            statsDisplay = null;
        }
        
        if (config.showRemovalCount) {
            createStatsDisplay();
        }
        
        log('Settings reset to defaults');
    }

    // Event listeners for page changes and content updates
    function setupEventListeners() {
        let filterTimeout = null;
        
        function debounceFilter(delay = 250) {
            if (filterTimeout) {
                clearTimeout(filterTimeout);
            }
            filterTimeout = setTimeout(filterContent, delay);
        }

        // YouTube navigation
        document.addEventListener("yt-navigate-finish", () => {
            debounceFilter(500);
        });

        // Content updates with debouncing
        window.addEventListener("message", () => {
            if (!isShorts()) {
                debounceFilter(300);
            }
        });

        window.addEventListener("load", () => {
            if (!isShorts()) {
                debounceFilter(300);
            }
        });

        window.addEventListener("scrollend", () => {
            if (!isShorts()) {
                debounceFilter(100);
            }
        });

        // URL change detection
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                debounceFilter(500);
            }
        }).observe(document, { subtree: true, childList: true });

        // Dynamic content observer with throttling
        let observerTimeout = null;
        const contentObserver = new MutationObserver((mutations) => {
            if (observerTimeout) return;
            
            let shouldFilter = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Only filter if new video elements are added
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1 && (
                            node.matches && (
                                node.matches('ytd-rich-item-renderer, ytd-compact-video-renderer, yt-lockup-view-model') ||
                                node.querySelector && node.querySelector('ytd-rich-item-renderer, ytd-compact-video-renderer, yt-lockup-view-model')
                            )
                        )) {
                            shouldFilter = true;
                            break;
                        }
                    }
                }
            });
            
            if (shouldFilter) {
                observerTimeout = setTimeout(() => {
                    filterContent();
                    observerTimeout = null;
                }, 200);
            }
        });
        
        contentObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize
    function init() {
        log('YouTube Smart Filter initialized');
        log(`Configuration: ${JSON.stringify(config)}`, true);
        
        createFloatingButton();
        
        if (config.showRemovalCount) {
            createStatsDisplay();
        }
        
        setupEventListeners();
        
        // Initial filter run
        setTimeout(filterContent, 1000);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();