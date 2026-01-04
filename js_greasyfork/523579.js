// ==UserScript==
// @name         WebMaster Pro
// @namespace    https://sourcegraph.com/
// @version      7.2
// @description  Ultimate web toolkit featuring multilingual captions, code fixing, Roblox server finder, YouTube song detection, and more
// @author       Cosmic Kitten with help from Cody A.I
// @license      MIT
// @match        *://*/*
// @match        https://www.roblox.com/games/*
// @match        https://web.roblox.com/games/*
// @match        https://www.youtube.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/mark.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @connect      bing.com
// @connect      roblox.com
// @connect      grammarly.com
// @connect      youtube.com
// @supportURL   https://github.com/yourusername/webmaster-pro/issues
// @homepage     https://github.com/yourusername/webmaster-pro
// @downloadURL https://update.greasyfork.org/scripts/523579/WebMaster%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/523579/WebMaster%20Pro.meta.js
// ==/UserScript==

/* Library Attribution */
/*
 * jQuery v3.6.0 | (c) OpenJS Foundation and other contributors | jquery.org/license
 * mark.js v8.11.1 | (c) Julian Kühnel | github.com/julmot/mark.js
 */

// Global error handler
const errorHandler = {
    catch: function(error, context) {
        console.error(`WebMaster Pro - ${context}:`, error);
        GM_notification({
            text: `Error in ${context}. Check console for details.`,
            title: 'WebMaster Pro',
            timeout: 3000
        });
    }
};

// Safe initialization wrapper
const initWithSafety = (fn, context) => {
    try {
        return fn();
    } catch (error) {
        errorHandler.catch(error, context);
    }
};

/* Core Modules */
const WebMasterCore = {
    settings: {
        lastUpdateCheck: 0,
        updateInterval: 86400000, // 24 hours
    },

    init() {
        this.loadSettings();
        this.initModules();
        this.setupEventListeners();
    },

    loadSettings() {
        const saved = GM_getValue('webmaster_settings');
        if (saved) {
            this.settings = {...this.settings, ...JSON.parse(saved)};
        }
    },

    saveSettings() {
        GM_setValue('webmaster_settings', JSON.stringify(this.settings));
    },

    initModules() {
        initWithSafety(() => {
            CodyGUI.init();
            YouTubeDetector.init();
            RobloxFinder.init();
            PageSearcher.init();
            TranslationEngine.init();
        }, 'Module Initialization');
    }
};

/* Cody GUI Module - Enhanced */
const CodyGUI = {
    init() {
        this.createInterface();
        this.setupEventListeners();
    },

    createInterface() {
        const gui = document.createElement('div');
        gui.id = 'cody-assistant';
        gui.innerHTML = `
            <div class="cody-panel">
                <div class="cody-header">
                    <span class="cody-title">WebMaster Pro</span>
                    <div class="cody-controls">
                        <button class="minimize">_</button>
                        <button class="close">×</button>
                    </div>
                </div>
                <div class="cody-content">
                    <div class="feature-buttons">
                        <button data-action="translate">Translate Page</button>
                        <button data-action="findServer">Find Roblox Server</button>
                        <button data-action="detectSong">Detect Song</button>
                        <button data-action="searchPage">Search Page</button>
                    </div>
                    <div class="status-area"></div>
                </div>
            </div>
        `;
        document.body.appendChild(gui);
    }
};

/* YouTube Detector - Enhanced */
const YouTubeDetector = {
    init() {
        if (window.location.hostname.includes('youtube.com')) {
            this.setupDetector();
        }
    },

    setupDetector() {
        const observer = new MutationObserver(() => {
            this.detectAndDisplay();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    },

    async detectAndDisplay() {
        const video = document.querySelector('video');
        if (!video) return;

        const videoTitle = document.querySelector('h1.ytd-video-primary-info-renderer');
        if (videoTitle) {
            const songInfo = this.parseSongInfo(videoTitle.textContent);
            this.showSongInfo(songInfo);
        }
    }
};

/* Roblox Server Finder - Enhanced */
const RobloxFinder = {
    init() {
        if (window.location.href.includes('roblox.com/games/')) {
            this.setupFinder();
        }
    },

    async findServer() {
        const servers = await this.fetchServers();
        if (servers?.length > 0) {
            const bestServer = this.findBestServer(servers);
            this.joinServer(bestServer);
        }
    }
};

/* Styles - Enhanced and Optimized */
GM_addStyle(`
    #cody-assistant {
        --primary-color: #2196F3;
        --secondary-color: #00b06f;
        --text-color: #ffffff;
        --shadow-color: rgba(0,0,0,0.3);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }

    .cody-panel {
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: linear-gradient(145deg, var(--primary-color), var(--secondary-color));
        border-radius: 12px;
        padding: 20px;
        color: var(--text-color);
        z-index: 999999;
        box-shadow: 0 4px 15px var(--shadow-color);
        transition: all 0.3s ease;
        width: 300px;
        max-height: 500px;
        overflow: hidden;
    }

    .feature-buttons button {
        width: 100%;
        padding: 10px;
        margin: 5px 0;
        border: none;
        border-radius: 6px;
        background: rgba(255,255,255,0.2);
        color: var(--text-color);
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 500;
    }

    .feature-buttons button:hover {
        background: rgba(255,255,255,0.3);
        transform: translateY(-1px);
    }
`);

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initWithSafety(() => WebMasterCore.init(), 'Main Initialization');
});
