// ==UserScript==
// @name         Lean, Clean YouTube Homescreen
// @namespace    raisedintheusa
// @version      0.5.1
// @description  Expanded grid of just videos
// @author       raisedintheusa
// @match        https://www.youtube.com/*
// @exclude      https://www.youtube.com/embed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529668/Lean%2C%20Clean%20YouTube%20Homescreen.user.js
// @updateURL https://update.greasyfork.org/scripts/529668/Lean%2C%20Clean%20YouTube%20Homescreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = false;
    const logContext = '[YouTube - Force Compact Grid]';

    var debug = DEBUG ? (...args) => console.debug(logContext, ...args) : () => {};
    function log(...args) { console.log(logContext, ...args); }
    function error(...args) { console.error(logContext, ...args); }

    // Updates richGridRenderer data to enforce compact style
    function updateResponseData(response, logContext) {
        const tabs = response?.contents?.twoColumnBrowseResultsRenderer?.tabs;
        if (DEBUG) debug(logContext, 'contents.twoColumnBrowseResultsRenderer.tabs (snapshot)', window.structuredClone(tabs));
        if (tabs) {
            for (let i = 0; i < tabs.length; i++) {
                const tab = tabs[i];
                const tabRenderer = tab.tabRenderer;
                if (tabRenderer) {
                    const richGridRenderer = tabRenderer.content?.richGridRenderer;
                    if (richGridRenderer && (!richGridRenderer.style || richGridRenderer.style === 'RICH_GRID_STYLE_SLIM')) {
                        const logTabContext = logContext + ' tab ' + (tabRenderer.title ?? tabRenderer.tabIdentifier ?? i);
                        if (richGridRenderer.layoutSizing) {
                            delete richGridRenderer.layoutSizing;
                        }
                        if (richGridRenderer.layoutType) {
                            delete richGridRenderer.layoutType;
                        }
                        richGridRenderer.style = 'RICH_GRID_STYLE_COMPACT';
                    }
                }
            }
        }
    }

    const symSetup = Symbol(logContext + ' setup');

    function setupYtdApp(ytdApp, logContext, errorFunc=error) {
        if (!ytdApp || !ytdApp.onYtPageDataFetched) return errorFunc('unexpectedly could not find ytd-app.onYtPageDataFetched');
        if (ytdApp[symSetup]) return;
        debug('found yt-App', ytdApp, logContext);
        const origOnYtPageDataFetched = ytdApp.onYtPageDataFetched;
        ytdApp.onYtPageDataFetched = function(evt, detail) {
            debug(evt);
            updateResponseData(evt.detail.pageData.response, 'at yt-page-data-fetched pageData.response');
            return origOnYtPageDataFetched.call(this, evt, detail);
        };
        debug('ytd-app onYtPageDataFetched hook set up');
        ytdApp[symSetup] = true;
    }

    function setupYtdPageManager(ytdPageManager, logContext, errorFunc=error) {
        if (!ytdPageManager || !ytdPageManager.attachPage) return errorFunc('unexpectedly could not find ytd-page-manager.attachPage');
        if (ytdPageManager[symSetup]) return;
        debug('found ytd-page-manager', ytdPageManager, logContext);
        const origAttachPage = ytdPageManager.attachPage;
        ytdPageManager.attachPage = function(page) {
            debug('attachPage', page);
            if (page.is === 'ytd-browse') setupYtdBrowse(page, 'at ytd-page-manager.attachPage');
            return origAttachPage.call(this, page);
        };
        debug('ytd-page-manager attachPage hook set up');
        ytdPageManager[symSetup] = true;
    }

    function setupYtdBrowse(ytdBrowse, logContext, errorFunc=error) {
        if (!ytdBrowse || !ytdBrowse.computeFluidWidth) return errorFunc('unexpectedly could not find ytd-browse.computeFluidWidth');
        if (ytdBrowse[symSetup]) return;
        debug('found ytd-browse', ytdBrowse, logContext);
        const origComputeFluidWidth = ytdBrowse.computeFluidWidth;
        ytdBrowse.computeFluidWidth = function(data, selectedTab, pageSubtype) {
            debug('computeFluidWidth', pageSubtype);
            if (pageSubtype === 'home') return false;
            return origComputeFluidWidth.call(this, data, selectedTab, pageSubtype);
        };
        debug('ytd-browse computeFluidWidth hook set up');
        ytdBrowse[symSetup] = true;
    }

    // Apply custom styles and cleanup
    function applyCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Base compact grid styling */
            ytd-rich-grid-renderer {
                --ytd-rich-grid-items-per-row: 5 !important;
                --ytd-rich-grid-posts-per-row: 5 !important;
                width: 100% !important;
                max-width: 100% !important;
                margin-left: 0 !important;
                margin-right: 0 !important;
                padding-left: 6px !important;
                padding-right: 6px !important;
                position: relative !important;
                left: 0 !important;
            }

            ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer {
                display: flex !important;
                flex-wrap: wrap !important;
                justify-content: flex-start !important;
                width: 100% !important;
                max-width: 100% !important;
                padding: 0 !important;
            }

            ytd-rich-grid-renderer ytd-rich-item-renderer {
                flex: 0 0 calc(20% - 16px) !important;
                width: calc(20% - 16px) !important;
                max-width: calc(20% - 16px) !important;
                margin: 6px !important;
                box-sizing: border-box !important;
                opacity: 0;
                animation: fadeIn 0.3s ease forwards;
            }

            .ytd-video-preview,
            ytd-video-preview {
                display: none !important;
                visibility: hidden !important;
            }

            /* Responsive adjustments */
            @media (max-width: 1200px) {
                ytd-rich-grid-renderer ytd-rich-item-renderer {
                    flex: 0 0 calc(25% - 16px) !important;
                    width: calc(25% - 16px) !important;
                    max-width: calc(25% - 16px) !important;
                }
            }

            @media (max-width: 1000px) {
                ytd-rich-grid-renderer ytd-rich-item-renderer {
                    flex: 0 0 calc(33.33% - 16px) !important;
                    width: calc(33.33% - 16px) !important;
                    max-width: calc(33.33% - 16px) !important;
                }
            }

            @media (max-width: 800px) {
                ytd-rich-grid-renderer ytd-rich-item-renderer {
                    flex: 0 0 calc(50% - 16px) !important;
                    width: calc(50% - 16px) !important;
                    max-width: calc(50% - 16px) !important;
                }
            }

            @media (max-width: 600px) {
                ytd-rich-grid-renderer ytd-rich-item-renderer {
                    flex: 0 0 calc(100% - 16px) !important;
                    width: calc(100% - 16px) !important;
                    max-width: calc(100% - 16px) !important;
                }
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            /* Tighten title-to-channel spacing */
            ytd-rich-item-renderer #metadata {
                margin-top: -0.4rem !important;
                padding-top: 0 !important;
            }

            ytd-rich-item-renderer #avatar-container {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            /* Hide Shorts and News */
            ytd-rich-section-renderer {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            /* Hide top/side bar elements */
            #chips,
            #frosted-glass,
            ytd-rich-grid-renderer #header.style-scope.ytd-rich-grid-renderer,
            ytd-mini-guide-renderer.style-scope.ytd-app {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            /* Style for the new custom top bar */
            #custom-top-bar {
                background-color: #0F0F0F !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 56px !important;
                z-index: 50 !important;
            }

            /* Ensure search box and icon sit above the new bar */
            ytd-searchbox,
            #masthead-container ytd-topbar-logo-renderer {
                position: relative !important;
                z-index: 51 !important;
                margin-top: 2px !important;
            }

            /* Ensure main app container doesn't restrict width */
            ytd-app {
                width: 100% !important;
                max-width: 100% !important;
                margin-left: 0 !important;
                padding-left: 0 !important;
            }

            /* Adjust page manager to fill space */
            ytd-page-manager {
                margin-left: 0 !important;
                padding-left: 0 !important;
                width: 100% !important;
            }
        `;
        const existingStyle = document.getElementById('custom-youtube-style');
        if (existingStyle) existingStyle.remove();
        style.id = 'custom-youtube-style';
        document.head.appendChild(style);

        // Inject the custom top bar if it doesn’t already exist
        if (!document.getElementById('custom-top-bar')) {
            const customBar = document.createElement('div');
            customBar.id = 'custom-top-bar';
            const ytdApp = document.querySelector('ytd-app');
            if (ytdApp) {
                ytdApp.insertBefore(customBar, ytdApp.firstChild);
            } else {
                document.body.insertBefore(customBar, document.body.firstChild);
            }
        }
    }

    // Setup hooks
    document.addEventListener('attached', evt => {
        const ytdApp = document.getElementsByTagName('ytd-app')[0];
        debug(evt);
        setupYtdApp(ytdApp, 'at ytd-page-manager.attached');
        const ytdPageManager = evt.srcElement;
        setupYtdPageManager(ytdPageManager, 'at ytd-page-manager.attached');
    });
    const ytdApp = document.getElementsByTagName('ytd-app')[0];
    setupYtdApp(ytdApp, 'at document-start', () => {});

    document.addEventListener('DOMContentLoaded', evt => {
        debug('ytInitialData', window.ytInitialData);
        updateResponseData(window.ytInitialData, 'at DOMContentLoaded ytInitialData');
        applyCustomStyles();
    });
})();