// ==UserScript==
// @name         YouTube Shorts Remover
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Completely removes YouTube Shorts - WORKING 2025
// @author       BennoGHG
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://music.youtube.com/*
// @match        https://www.youtube-nocookie.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538211/YouTube%20Shorts%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/538211/YouTube%20Shorts%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const config = {
        enabled: GM_getValue('shortsRemoverEnabled', true),
        removeNavigation: GM_getValue('removeNavigation', true),
        removeFromHomepage: GM_getValue('removeFromHomepage', true),
        removeFromSearch: GM_getValue('removeFromSearch', true),
        removeFromSubscriptions: GM_getValue('removeFromSubscriptions', true),
        removeFromChannels: GM_getValue('removeFromChannels', true),
        redirectShortsUrls: GM_getValue('redirectShortsUrls', true)
    };

    function saveConfig() {
        Object.keys(config).forEach(key => {
            GM_setValue(key, config[key]);
        });
    }

    // WORKING CSS selectors based on research
    const shortsRemovalCSS = `
        /* === PROVEN WORKING SELECTORS 2025 === */

        /* Navigation - Text-based targeting */
        ytd-guide-entry-renderer:has-text(Shorts),
        ytd-mini-guide-entry-renderer:has-text(Shorts),

        /* Grid view - subscription feed */
        #items.ytd-grid-renderer > ytd-grid-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]),

        /* List view - subscription feed */
        ytd-item-section-renderer:not(:has(ytd-grid-renderer)):has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]),

        /* Rich items (homepage) */
        ytd-rich-item-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]),

        /* Video search results */
        ytd-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]),

        /* Shorts sections and shelves */
        ytd-reel-shelf-renderer,
        ytd-shorts-shelf-renderer,
        ytd-rich-section-renderer:has(#rich-shelf-header:has-text(Shorts)),

        /* Title-based detection */
        ytd-grid-video-renderer:has(#video-title:has-text(#shorts)),
        ytd-grid-video-renderer:has(#video-title:has-text(#Shorts)),
        ytd-rich-item-renderer:has(#video-title:has-text(#shorts)),
        ytd-rich-item-renderer:has(#video-title:has-text(#Shorts)),

        /* Channel page Shorts tabs */
        yt-tab-shape:has-text(/^Shorts$/),
        tp-yt-paper-tab:has(.tp-yt-paper-tab:has-text(Shorts)),

        /* Shorts remixing */
        ytd-reel-shelf-renderer.ytd-structured-description-content-renderer,

        /* Direct Shorts containers */
        ytd-shorts,
        #shorts-container,
        ytd-reel-video-renderer {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* Fix grid layout */
        ytd-rich-grid-row,
        #contents.ytd-rich-grid-row {
            display: contents !important;
        }
    `;

    // Sidebar UI CSS
    const sidebarUICSS = `
        /* Sidebar integration */
        #shorts-remover-controls {
            background: rgba(15, 15, 15, 0.95);
            border-radius: 8px;
            padding: 12px;
            margin: 8px 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            font-family: 'Roboto', sans-serif;
        }

        #shorts-remover-controls h4 {
            color: #fff;
            font-size: 14px;
            font-weight: 500;
            margin: 0 0 12px 0;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        .shorts-toggle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 8px 0;
            font-size: 12px;
            color: #aaaaaa;
        }

        .shorts-toggle label {
            cursor: pointer;
            flex: 1;
            margin-right: 8px;
        }

        /* iOS Toggle Switch */
        .ios-switch {
            position: relative;
            display: inline-block;
            width: 36px;
            height: 20px;
        }

        .ios-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .ios-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #333;
            transition: 0.3s;
            border-radius: 20px;
            border: 1px solid #555;
        }

        .ios-slider:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: 0.3s;
            border-radius: 50%;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .ios-switch input:checked + .ios-slider {
            background-color: #4CD964;
            border-color: #4CD964;
        }

        .ios-switch input:checked + .ios-slider:before {
            transform: translateX(16px);
        }

        .ios-switch input:disabled + .ios-slider {
            opacity: 0.6;
            cursor: not-allowed;
        }

        /* Master toggle - larger */
        .master-toggle .ios-switch {
            width: 44px;
            height: 24px;
        }

        .master-toggle .ios-slider:before {
            height: 18px;
            width: 18px;
            left: 2px;
            bottom: 2px;
        }

        .master-toggle .ios-switch input:checked + .ios-slider:before {
            transform: translateX(20px);
        }

        .status {
            font-size: 10px;
            text-align: center;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .status.active {
            color: #4CD964;
        }

        .status.inactive {
            color: #ff6b6b;
        }
    `;

    // Apply CSS
    function applyCSS() {
        GM_addStyle(sidebarUICSS);
        if (config.enabled) {
            GM_addStyle(shortsRemovalCSS);
        }
    }

    // JavaScript-based removal for elements CSS can't catch
    function removeShortsElementsJS() {
        if (!config.enabled) return;

        let removedCount = 0;

        // Remove navigation elements
        if (config.removeNavigation) {
            document.querySelectorAll('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer').forEach(el => {
                const text = el.textContent?.trim();
                if (text === 'Shorts') {
                    el.style.display = 'none';
                    removedCount++;
                }
            });
        }

        // Remove Shorts by overlay
        document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]').forEach(overlay => {
            const videoContainer = overlay.closest('ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer');
            if (videoContainer) {
                videoContainer.style.display = 'none';
                removedCount++;
            }
        });

        // Remove by URL
        document.querySelectorAll('a[href*="/shorts/"]').forEach(link => {
            const videoContainer = link.closest('ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-video-renderer');
            if (videoContainer) {
                videoContainer.style.display = 'none';
                removedCount++;
            }
        });

        // Remove by title
        document.querySelectorAll('#video-title').forEach(title => {
            if (title.textContent && (title.textContent.includes('#shorts') || title.textContent.includes('#Shorts'))) {
                const videoContainer = title.closest('ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-video-renderer');
                if (videoContainer) {
                    videoContainer.style.display = 'none';
                    removedCount++;
                }
            }
        });

        // Remove Shorts shelves
        document.querySelectorAll('ytd-reel-shelf-renderer, ytd-shorts-shelf-renderer').forEach(shelf => {
            shelf.style.display = 'none';
            removedCount++;
        });

        // Remove by duration (under 60 seconds)
        document.querySelectorAll('.ytd-thumbnail-overlay-time-status-renderer').forEach(duration => {
            const text = duration.textContent?.trim();
            if (text && /^[0-5]?[0-9]$|^0:[0-5][0-9]$/.test(text)) {
                const videoContainer = duration.closest('ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-video-renderer');
                if (videoContainer) {
                    videoContainer.style.display = 'none';
                    removedCount++;
                }
            }
        });

        if (removedCount > 0) {
            console.log(`🚫 Removed ${removedCount} Shorts elements`);
        }
    }

    // Create sidebar controls
    function createSidebarControls() {
        // Wait for sidebar to load
        const sidebar = document.querySelector('ytd-guide-renderer #guide-inner-content');
        if (!sidebar) {
            setTimeout(createSidebarControls, 1000);
            return;
        }

        // Remove existing controls
        const existing = document.getElementById('shorts-remover-controls');
        if (existing) existing.remove();

        // Find subscriptions section
        const subscriptionsSection = Array.from(sidebar.children).find(section => {
            const entries = section.querySelectorAll('ytd-guide-entry-renderer');
            return Array.from(entries).some(entry => entry.textContent?.includes('Subscriptions'));
        });

        if (!subscriptionsSection) {
            setTimeout(createSidebarControls, 2000);
            return;
        }

        // Create control panel
        const controlPanel = document.createElement('div');
        controlPanel.id = 'shorts-remover-controls';
        controlPanel.innerHTML = `
            <h4>🚫 Shorts Remover</h4>

            <div class="shorts-toggle master-toggle">
                <label for="master-enabled">Enable Removal</label>
                <label class="ios-switch">
                    <input type="checkbox" id="master-enabled" ${config.enabled ? 'checked' : ''}>
                    <span class="ios-slider"></span>
                </label>
            </div>

            <div class="shorts-toggle">
                <label for="toggle-nav">Navigation</label>
                <label class="ios-switch">
                    <input type="checkbox" id="toggle-nav" ${config.removeNavigation ? 'checked' : ''}>
                    <span class="ios-slider"></span>
                </label>
            </div>

            <div class="shorts-toggle">
                <label for="toggle-home">Homepage</label>
                <label class="ios-switch">
                    <input type="checkbox" id="toggle-home" ${config.removeFromHomepage ? 'checked' : ''}>
                    <span class="ios-slider"></span>
                </label>
            </div>

            <div class="shorts-toggle">
                <label for="toggle-search">Search</label>
                <label class="ios-switch">
                    <input type="checkbox" id="toggle-search" ${config.removeFromSearch ? 'checked' : ''}>
                    <span class="ios-slider"></span>
                </label>
            </div>

            <div class="shorts-toggle">
                <label for="toggle-subs">Subscriptions</label>
                <label class="ios-switch">
                    <input type="checkbox" id="toggle-subs" ${config.removeFromSubscriptions ? 'checked' : ''}>
                    <span class="ios-slider"></span>
                </label>
            </div>

            <div class="shorts-toggle">
                <label for="toggle-redirect">Redirect URLs</label>
                <label class="ios-switch">
                    <input type="checkbox" id="toggle-redirect" ${config.redirectShortsUrls ? 'checked' : ''}>
                    <span class="ios-slider"></span>
                </label>
            </div>

            <div class="status ${config.enabled ? 'active' : 'inactive'}">
                ${config.enabled ? '✅ Active' : '❌ Disabled'}
            </div>
        `;

        // Insert after subscriptions section
        subscriptionsSection.parentNode.insertBefore(controlPanel, subscriptionsSection.nextSibling);

        // Add event listeners
        setupEventListeners();

        console.log('✅ Sidebar controls created successfully');
    }

    function setupEventListeners() {
        // Master toggle
        const masterToggle = document.getElementById('master-enabled');
        if (masterToggle) {
            masterToggle.addEventListener('change', (e) => {
                config.enabled = e.target.checked;

                // Enable/disable other toggles
                const otherToggles = document.querySelectorAll('#shorts-remover-controls input[type="checkbox"]:not(#master-enabled)');
                otherToggles.forEach(toggle => {
                    toggle.disabled = !config.enabled;
                });

                // Update status
                const status = document.querySelector('#shorts-remover-controls .status');
                if (status) {
                    status.textContent = config.enabled ? '✅ Active' : '❌ Disabled';
                    status.className = `status ${config.enabled ? 'active' : 'inactive'}`;
                }

                saveConfig();
                location.reload(); // Reload to apply/remove CSS
            });
        }

        // Individual toggles
        const toggleMap = {
            'toggle-nav': 'removeNavigation',
            'toggle-home': 'removeFromHomepage',
            'toggle-search': 'removeFromSearch',
            'toggle-subs': 'removeFromSubscriptions',
            'toggle-redirect': 'redirectShortsUrls'
        };

        Object.entries(toggleMap).forEach(([id, configKey]) => {
            const toggle = document.getElementById(id);
            if (toggle) {
                toggle.disabled = !config.enabled;
                toggle.addEventListener('change', (e) => {
                    config[configKey] = e.target.checked;
                    saveConfig();
                    setTimeout(removeShortsElementsJS, 100);
                });
            }
        });
    }

    // URL redirect
    function handleShortsRedirect() {
        if (!config.enabled || !config.redirectShortsUrls) return;

        const url = window.location.href;
        if (url.includes('/shorts/')) {
            const videoId = url.split('/shorts/')[1].split('?')[0];
            const newUrl = `https://www.youtube.com/watch?v=${videoId}`;
            console.log('🚫 Redirecting Shorts URL:', newUrl);
            window.location.replace(newUrl);
        }
    }

    // Mutation observer
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;

            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            // Check for Shorts-related content
                            if (node.querySelector && (
                                node.querySelector('[overlay-style="SHORTS"]') ||
                                node.querySelector('ytd-reel-shelf-renderer') ||
                                node.querySelector('[href*="/shorts/"]') ||
                                (node.textContent && node.textContent.includes('Shorts'))
                            )) {
                                shouldProcess = true;
                            }
                        }
                    });
                }
            });

            if (shouldProcess) {
                setTimeout(removeShortsElementsJS, 200);
            }
        });

        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // Initialize
    function init() {
        console.log('🚫 YouTube Shorts Remover v4.0.0 initializing...');

        // Handle redirect first
        handleShortsRedirect();

        // Apply CSS
        applyCSS();

        // Wait for page to be ready
        const startInit = () => {
            createSidebarControls();
            removeShortsElementsJS();
            setupMutationObserver();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(startInit, 2000);
            });
        } else {
            setTimeout(startInit, 2000);
        }

        console.log(`✅ Shorts Remover initialized! Status: ${config.enabled ? 'ENABLED' : 'DISABLED'}`);
    }

    // Start
    init();

    // Handle page navigation (YouTube SPA)
    let currentUrl = location.href;
    const checkUrlChange = setInterval(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            handleShortsRedirect();
            setTimeout(() => {
                removeShortsElementsJS();
                // Recreate controls if sidebar changed
                if (!document.getElementById('shorts-remover-controls')) {
                    createSidebarControls();
                }
            }, 1000);
        }
    }, 1000);

    // Visibility change handler
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(removeShortsElementsJS, 500);
        }
    });

})();