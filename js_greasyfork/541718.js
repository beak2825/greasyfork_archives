// ==UserScript==
// @name         WatchPorn Auto Filter Preset Manager and Wicked Tab
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Filter presets with Multi-select videos and open them all in one Wicked Tab!
// @author       6969RandomGuy6969
// @match        https://watchporn.to/*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://watchporn.to/&size=256
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @connect      watchporn.to
// @downloadURL https://update.greasyfork.org/scripts/541718/WatchPorn%20Auto%20Filter%20Preset%20Manager%20and%20Wicked%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/541718/WatchPorn%20Auto%20Filter%20Preset%20Manager%20and%20Wicked%20Tab.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Storage keys
    const STORAGE_KEY = 'wp_saved_presets';
    const FAVORITES_KEY = 'wp_favorite_categories';
    const ACTIVE_PRESET_KEY = 'wp_active_preset';
    const WICKED_KEY = 'wp_wicked_videos';
    const WICKED_SEL_KEY = 'wp_wicked_selections';

    let filterButton = null;
    let categoryCheckboxes = [];

    // Page detection
    const params = new URLSearchParams(window.location.search);
    const isWickedTab = params.get('wickedview') === 'true';
    const isSearchPage = window.location.pathname.includes('/search/');
    const isHomePage = window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname.includes('/latest-updates/');

    // Check if page has video listings (for Wicked Tab feature)
    const hasVideoListings = () => document.querySelector('.item a[href*="/video/"]') !== null;

    // Wicked Tab state
    const wickedState = {
        sel: [],
        obs: null,
        vis: false
    };

    // Wicked Tab storage utilities
    const wickedStore = {
        get: () => {
            try { return JSON.parse(localStorage[WICKED_KEY] || '[]') }
            catch { return [] }
        },
        set: d => {
            try { localStorage[WICKED_KEY] = JSON.stringify(d); return 1 }
            catch { return 0 }
        },
        clr: () => delete localStorage[WICKED_KEY],
        getSel: () => {
            try { return JSON.parse(localStorage[WICKED_SEL_KEY] || '[]') }
            catch { return [] }
        },
        setSel: d => {
            try { localStorage[WICKED_SEL_KEY] = JSON.stringify(d); return 1 }
            catch { return 0 }
        },
        clrSel: () => delete localStorage[WICKED_SEL_KEY]
    };

    // Share utilities
    const share = {
        encode: videos => btoa(unescape(encodeURIComponent(JSON.stringify(videos)))),
        decode: code => {
            try { return JSON.parse(decodeURIComponent(escape(atob(code)))) }
            catch { return null }
        },
        getUrl: code => `${location.origin}/?wickedview=true&share=${encodeURIComponent(code)}&t=${Date.now()}`
    };

    // ============================================
    // WICKED TAB GRID VIEWER
    // ============================================
    if (isWickedTab) {
        const wickedStyles = document.createElement('style');
        wickedStyles.textContent = `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                background: #1a1a1e !important;
                font-family: Roboto, Helvetica, sans-serif;
                overflow-x: hidden;
                color: #fff;
                font-size: 14px;
                line-height: 1.6;
            }
            ::-webkit-scrollbar { width: 12px; height: 12px; }
            ::-webkit-scrollbar-track { background: #1a1d24; }
            ::-webkit-scrollbar-thumb { background: #4a4d55; border-radius: 6px; }
            ::-webkit-scrollbar-thumb:hover { background: #5a5d65; }

            #grid-header {
                background: linear-gradient(135deg, rgba(33, 33, 33, 0.98) 0%, rgba(28, 28, 32, 0.95) 100%);
                backdrop-filter: blur(20px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                padding: 24px 40px;
                color: #fff;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2);
                position: sticky;
                top: 0;
                z-index: 100;
            }
            .grid-header-left {
                display: flex;
                align-items: center;
                gap: 16px;
            }
            .grid-logo {
                height: 36px;
                width: auto;
                filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
            }
            #grid-header h2 {
                font-size: 22px;
                font-family: Roboto, Helvetica, sans-serif;
                font-weight: 500;
                color: rgb(255, 255, 255);
                display: flex;
                align-items: center;
                gap: 10px;
                letter-spacing: 0.3px;
                text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                margin: 0;
            }
            .video-count {
                font-size: 16px;
                font-weight: 400;
                color: rgba(255, 255, 255, 0.7);
                letter-spacing: 0.2px;
            }

            .grid-header-btn {
                background: rgba(255, 255, 255, 0.08);
                backdrop-filter: blur(10px);
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.12);
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-family: Roboto, Helvetica, sans-serif;
                font-size: 13px;
                font-weight: 500;
                letter-spacing: 0.3px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                outline: none;
                margin-left: 12px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            }
            .grid-header-btn:hover {
                background: rgba(255, 255, 255, 0.15);
                border-color: rgba(255, 255, 255, 0.25);
                transform: translateY(-2px);
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
            }
            .grid-header-btn:active {
                transform: translateY(0);
            }
            #refresh-all-btn {
                background: linear-gradient(135deg, rgba(74, 144, 226, 0.2) 0%, rgba(53, 122, 189, 0.2) 100%);
                border-color: rgba(74, 144, 226, 0.3);
            }
            #refresh-all-btn:hover {
                background: linear-gradient(135deg, rgba(74, 144, 226, 0.35) 0%, rgba(53, 122, 189, 0.35) 100%);
                border-color: rgba(74, 144, 226, 0.5);
            }
            #share-tab-btn {
                background: linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(56, 142, 60, 0.2) 100%);
                border-color: rgba(76, 175, 80, 0.3);
            }
            #share-tab-btn:hover {
                background: linear-gradient(135deg, rgba(76, 175, 80, 0.35) 0%, rgba(56, 142, 60, 0.35) 100%);
                border-color: rgba(76, 175, 80, 0.5);
            }

            #grid-viewer-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(440px, 1fr));
                gap: 32px;
                padding: 40px;
                max-width: 1920px;
                margin: 0 auto;
            }

            .video-grid-item {
                background: linear-gradient(145deg, rgba(28, 28, 32, 0.98) 0%, rgba(24, 24, 28, 0.95) 100%);
                border: 1px solid rgba(255, 255, 255, .06);
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 8px 24px rgba(0, 0, 0, .5), 0 2px 8px rgba(0, 0, 0, .3);
                transition: all .4s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                backdrop-filter: blur(10px);
                animation: fadeInUp 0.5s ease-out backwards;
            }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .video-grid-item:hover {
                transform: translateY(-6px) scale(1.01);
                box-shadow: 0 16px 48px rgba(0, 0, 0, .7), 0 4px 16px rgba(74, 144, 226, .2);
                border-color: rgba(74, 144, 226, .3);
            }

            .video-refresh-btn, .video-close-btn {
                position: absolute;
                top: 12px;
                background: rgba(0, 0, 0, .85);
                backdrop-filter: blur(12px);
                color: #fff;
                border: 1px solid rgba(255, 255, 255, .15);
                padding: 8px 14px;
                border-radius: 8px;
                cursor: pointer;
                font-family: Roboto, Helvetica, sans-serif;
                font-size: 12px;
                font-weight: 500;
                z-index: 10;
                transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
                display: none;
                box-shadow: 0 4px 12px rgba(0, 0, 0, .5);
            }
            .video-refresh-btn {
                right: 12px;
                background: linear-gradient(135deg, rgba(74, 144, 226, .9) 0%, rgba(53, 122, 189, .9) 100%);
                border-color: rgba(74, 144, 226, .4);
            }
            .video-close-btn {
                right: 120px;
                background: linear-gradient(135deg, rgba(244, 67, 54, .9) 0%, rgba(211, 47, 47, .9) 100%);
                border-color: rgba(244, 67, 54, .4);
            }
            .video-close-btn:hover {
                background: linear-gradient(135deg, rgba(244, 67, 54, 1) 0%, rgba(211, 47, 47, 1) 100%);
                transform: scale(1.08) translateY(-2px);
                box-shadow: 0 6px 20px rgba(244, 67, 54, .4);
            }
            .video-grid-item.has-error .video-refresh-btn { display: block; }
            .video-grid-item:hover .video-close-btn { display: block; }
            .video-refresh-btn:hover {
                background: linear-gradient(135deg, rgba(74, 144, 226, 1) 0%, rgba(53, 122, 189, 1) 100%);
                transform: scale(1.08) translateY(-2px);
                box-shadow: 0 6px 20px rgba(74, 144, 226, .4);
            }

            .video-grid-item video, .video-grid-item iframe {
                width: 100%;
                height: auto;
                aspect-ratio: 16/9;
                background: #000;
                display: block;
            }

            .video-grid-loading {
                width: 100%;
                aspect-ratio: 16/9;
                background: rgba(36, 39, 47, .95);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #888;
                gap: 16px;
                font-family: monospace;
            }
            .video-grid-loading::before {
                content: "";
                width: 40px;
                height: 40px;
                border: 3px solid rgba(0, 0, 238, .2);
                border-top-color: #00e;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            .video-grid-error {
                width: 100%;
                aspect-ratio: 16/9;
                background: rgba(36, 39, 47, .95);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #f44;
                gap: 12px;
                font-family: monospace;
                padding: 20px;
                text-align: center;
            }
            .video-grid-error::before {
                content: "⚠";
                font-size: 48px;
                color: #f44;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .video-grid-title {
                padding: 18px 24px;
                color: rgba(255, 255, 255, 0.95);
                font-size: 14px;
                font-family: Roboto, Helvetica, sans-serif;
                font-weight: 400;
                letter-spacing: 0.2px;
                line-height: 1.6;
                transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                text-decoration: none;
                display: block;
                background: linear-gradient(180deg, rgba(255, 255, 255, .02) 0%, rgba(255, 255, 255, .01) 100%);
                border-top: 1px solid rgba(255, 255, 255, .04);
            }
            .video-grid-title:hover {
                color: #4A90E2;
                background: linear-gradient(180deg, rgba(74, 144, 226, .08) 0%, rgba(74, 144, 226, .04) 100%);
                padding-left: 28px;
            }

            #share-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, .85);
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
            }
            #share-modal.visible { display: flex; }

            .share-content {
                background: #24272f;
                border: 1px solid rgba(255, 255, 255, .2);
                padding: 30px;
                border-radius: 8px;
                max-width: 600px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, .8);
            }
            .share-content h3 { margin-bottom: 20px; color: #fff; font-size: 18px; }
            .share-content textarea {
                width: 100%;
                background: #1a1d24;
                color: #fff;
                border: 1px solid rgba(255, 255, 255, .2);
                padding: 12px;
                font-family: monospace;
                font-size: 12px;
                border-radius: 4px;
                resize: vertical;
                min-height: 120px;
                margin-bottom: 15px;
            }
            .share-content button {
                background: #1a7a4d;
                color: #fff;
                border: 1px solid rgba(255, 255, 255, .2);
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                font-family: monospace;
                font-size: 13px;
                margin-right: 10px;
                transition: all .2s;
            }
            .share-content button:hover { background: #25a863; transform: translateY(-2px); }
            .share-content button.secondary { background: #24272f; }
            .share-content button.secondary:hover { background: #34373f; }
            .share-info { color: #888; font-size: 11px; margin-top: 10px; line-height: 1.5; }

            @media (max-width: 599px) {
                #grid-viewer-container { grid-template-columns: 1fr; padding: 20px; gap: 16px; }
                #grid-header { padding: 16px 20px; }
            }
        `;
        document.head.appendChild(wickedStyles);

        function initWickedGrid() {
            const sharedCode = params.get('share');
            let videos = sharedCode ? share.decode(sharedCode) || wickedStore.get() : wickedStore.get();

            document.body.innerHTML = '<div style="padding:80px 40px;text-align:center;color:#fff;font-family:Roboto,Helvetica,sans-serif"><div style="width:50px;height:50px;border:4px solid rgba(74,144,226,0.2);border-top-color:#4A90E2;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 24px"></div><h2 style="font-size:24px;font-weight:500;color:rgba(255,255,255,0.9)">Loading your wicked collection...</h2><style>@keyframes spin{to{transform:rotate(360deg)}}</style></div>';

            if (!videos.length) {
                document.body.innerHTML = '<div style="padding:80px 40px;text-align:center;color:#fff;font-family:Roboto,Helvetica,sans-serif;max-width:600px;margin:0 auto"><h2 style="font-size:32px;font-weight:500;margin-bottom:16px;color:rgba(255,255,255,0.95)">Nothing here… yet</h2><p style="font-size:16px;color:rgba(255,255,255,0.7);margin-bottom:32px;line-height:1.6">Go back and select some wicked videos first! Use Ctrl+Click or Right-Click to add videos to your collection.</p><button onclick="window.close()" style="margin-top:20px;padding:12px 28px;background:linear-gradient(135deg,rgba(74,144,226,0.2) 0%,rgba(53,122,189,0.2) 100%);color:#fff;border:1px solid rgba(74,144,226,0.3);cursor:pointer;font-family:Roboto,Helvetica,sans-serif;border-radius:8px;font-size:14px;font-weight:500;transition:all 0.3s;outline:none" onmouseover="this.style.background=\'linear-gradient(135deg,rgba(74,144,226,0.35) 0%,rgba(53,122,189,0.35) 100%)\'" onmouseout="this.style.background=\'linear-gradient(135deg,rgba(74,144,226,0.2) 0%,rgba(53,122,189,0.2) 100%)\'">Close Tab</button></div>';
                return;
            }

            if (sharedCode && !share.decode(sharedCode)) {
                alert('Invalid share code!');
            }

            document.body.innerHTML = `
                <div id="grid-header">
                    <div class="grid-header-left">
                        <img src="https://watchporn.to/contents/djifbwwmsrbs/theme/logo.png" alt="WatchPorn" class="grid-logo">
                        <h2>Wicked Tab <span class="video-count">(${videos.length} Videos)</span></h2>
                    </div>
                    <div>
                        <button class="grid-header-btn" id="share-tab-btn">Share Tab</button>
                        <button class="grid-header-btn" id="refresh-all-btn">Refresh All</button>
                        <button class="grid-header-btn" id="close-grid-btn">Close Tab</button>
                    </div>
                </div>
                <div id="grid-viewer-container"></div>
            `;

            document.getElementById('close-grid-btn').onclick = () => window.close();
            document.getElementById('refresh-all-btn').onclick = () => location.reload();
            document.getElementById('share-tab-btn').onclick = handleShare;

            createShareModal();

            const container = document.getElementById('grid-viewer-container');

            const loadVideo = (vid, idx, item) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: vid.url,
                    timeout: 15000,
                    onload: response => {
                        try {
                            const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                            const video = doc.querySelector('video source') || doc.querySelector('video');
                            const src = video?.src || video?.getAttribute('src');

                            if (src) {
                                const videoEl = document.createElement('video');
                                videoEl.controls = true;
                                videoEl.style.cssText = 'width:100%;height:auto;aspect-ratio:16/9;background:#000';
                                videoEl.innerHTML = `<source src="${src}">`;
                                item.querySelector('div').replaceWith(videoEl);
                                item.classList.remove('has-error');
                                return;
                            }
                        } catch (e) {
                            // Video parsing error - fallback to iframe
                        }

                        const iframe = document.createElement('iframe');
                        iframe.src = vid.url;
                        iframe.style.cssText = 'width:100%;height:auto;aspect-ratio:16/9;border:none;background:#000';
                        iframe.allowFullscreen = true;
                        iframe.allow = 'autoplay';
                        item.querySelector('div').replaceWith(iframe);
                        item.classList.remove('has-error');
                    },
                    onerror: () => {
                        const error = document.createElement('div');
                        error.className = 'video-grid-error';
                        error.innerHTML = `<span>Failed to load video</span><small style="color:#888">Network error</small>`;
                        item.querySelector('div').replaceWith(error);
                        item.classList.add('has-error');
                    },
                    ontimeout: () => {
                        const error = document.createElement('div');
                        error.className = 'video-grid-error';
                        error.innerHTML = `<span>Request timed out</span><small style="color:#888">Try refreshing</small>`;
                        item.querySelector('div').replaceWith(error);
                        item.classList.add('has-error');
                    }
                });
            };

            videos.forEach((vid, idx) => {
                const item = document.createElement('div');
                item.className = 'video-grid-item';
                item.style.animationDelay = `${idx * 0.05}s`;
                item.innerHTML = `
                    <button class="video-close-btn" data-idx="${idx}">✕ Remove</button>
                    <button class="video-refresh-btn">↻ Reload</button>
                    <div class="video-grid-loading"><span>Loading video ${idx + 1}...</span></div>
                    <a href="${vid.url}" target="_blank" class="video-grid-title">${vid.title}</a>
                `;
                container.appendChild(item);

                item.querySelector('.video-close-btn').onclick = (e) => {
                    e.stopPropagation();
                    if (confirm('Remove this video from the collection?')) {
                        removeVideo(idx);
                    }
                };

                item.querySelector('.video-refresh-btn').onclick = () => {
                    const loading = document.createElement('div');
                    loading.className = 'video-grid-loading';
                    loading.innerHTML = `<span>Reloading video ${idx + 1}...</span>`;
                    item.querySelector('div').replaceWith(loading);
                    item.classList.remove('has-error');
                    loadVideo(vid, idx, item);
                };

                loadVideo(vid, idx, item);
            });
        }

        function createShareModal() {
            const modal = document.createElement('div');
            modal.id = 'share-modal';
            modal.innerHTML = `
                <div class="share-content">
                    <h3>Share Your Collection</h3>
                    <textarea id="share-code" readonly placeholder="Your share link will appear here..."></textarea>
                    <div>
                        <button id="copy-url-btn">Copy Link</button>
                        <button class="secondary" id="close-share-btn">Close</button>
                    </div>
                    <div class="share-info">Share this link with friends. They can open it to load your collection!</div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.onclick = e => {
                if (e.target === modal) modal.classList.remove('visible');
            };

            modal.querySelector('#close-share-btn').onclick = () => modal.classList.remove('visible');
            modal.querySelector('#copy-url-btn').onclick = () => {
                const textarea = document.getElementById('share-code');
                const url = textarea.value;
                try {
                    if (GM_setClipboard) {
                        GM_setClipboard(url);
                    } else {
                        navigator.clipboard.writeText(url);
                    }
                    alert('Share link copied to clipboard!');
                } catch {
                    textarea.select();
                    document.execCommand('copy');
                    alert('Share link copied to clipboard!');
                }
            };
        }

        function handleShare() {
            const videos = wickedStore.get();
            if (!videos.length) {
                alert('No videos in current tab to share!');
                return;
            }
            const code = share.encode(videos);
            const url = share.getUrl(code);
            document.getElementById('share-code').value = url;
            document.getElementById('share-modal').classList.add('visible');
        }

        function removeVideo(idx) {
            const videos = wickedStore.get();
            videos.splice(idx, 1);
            wickedStore.set(videos);
            location.reload();
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initWickedGrid);
        } else {
            initWickedGrid();
        }
        return;
    }

    // ============================================
    // FILTER PRESET BUTTON (ALL PAGES EXCEPT SEARCH)
    // ============================================
    if (!isSearchPage && !isWickedTab) {
        const CONFIG = {
            buttonText: "Filter Preset",
            searchUrl: "https://watchporn.to/search/",
        };

        function injectFilterButtonStyles() {
            if (document.getElementById('filter-preset-btn-styles')) return;

            const styleSheet = document.createElement('style');
            styleSheet.id = 'filter-preset-btn-styles';
            styleSheet.textContent = `
                .filter-preset-btn {
                    background: rgba(255, 255, 255, 0.1) !important;
                    backdrop-filter: blur(10px) !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    border-radius: 8px !important;
                    padding: 8px 16px !important;
                    color: #fff !important;
                    text-decoration: none !important;
                    transition: all 0.3s ease !important;
                    font-weight: 500 !important;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
                    display: inline-block !important;
                }
                .filter-preset-btn:hover {
                    background: rgba(255, 255, 255, 0.2) !important;
                    transform: translateY(-2px) !important;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
                }
                .filter-preset-container {
                    opacity: 0;
                    animation: fadeInSmooth 0.5s ease-in-out forwards;
                }
                @keyframes fadeInSmooth {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            (document.head || document.documentElement).appendChild(styleSheet);
        }

        function initFilterPresetButton() {
            injectFilterButtonStyles();

            const homeLinkLi = document.querySelector('a#item1')?.parentElement;
            if (homeLinkLi && !document.querySelector('#filter-preset-li')) {
                const li = document.createElement('li');
                li.id = 'filter-preset-li';

                const button = document.createElement('a');
                button.href = CONFIG.searchUrl;
                button.textContent = CONFIG.buttonText;
                button.className = 'filter-preset-btn';
                button.style.cursor = 'pointer';

                li.appendChild(button);
                homeLinkLi.parentNode.insertBefore(li, homeLinkLi.nextSibling);

                // console.log('✅ Filter Preset button added next to Home link');
            }
        }

        function filterButtonReady(fn) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', fn);
            } else {
                fn();
            }
        }

        filterButtonReady(() => {
            initFilterPresetButton();

            const observer = new MutationObserver((mutations) => {
                let shouldReinit = false;

                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) {
                                const hasPromoLink = node.querySelector && (
                                    node.querySelector('a[href*="go.lnkpth.com"]') ||
                                    node.querySelector('a[href*="hotdates"]')
                                );
                                if (hasPromoLink) shouldReinit = true;
                            }
                        });
                    }
                });

                if (shouldReinit && !document.querySelector('.filter-preset-btn')) {
                    setTimeout(initFilterPresetButton, 100);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });

        setTimeout(() => {
            if (!document.querySelector('.filter-preset-btn')) {
                // console.log('🔄 Filter Preset button backup initialization triggered');
                initFilterPresetButton();
            }
        }, 2000);
    }

    // ============================================
    // WICKED TAB FEATURES (SHARED ACROSS PAGES)
    // ============================================
    function initWickedFeatures() {
        if (document.getElementById('wicked-toggle-btn')) {
            // console.log('⚠️ Wicked features already initialized');
            return;
        }

        // console.log('🚀 Initializing Wicked Tab features...');

        const wickedSelectionStyles = document.createElement('style');
        wickedSelectionStyles.textContent = `
            .wicked-select-overlay {
                position: absolute;
                top: 10px;
                left: 10px;
                width: 28px;
                height: 28px;
                background: rgba(0, 0, 0, .8);
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, .2);
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                opacity: 0;
                transition: all .2s;
                z-index: 10;
                pointer-events: none;
            }
            body.wicked-active .item:hover .wicked-select-overlay {
                opacity: 1;
            }
            body.wicked-active .item.wicked-selected .wicked-select-overlay {
                opacity: 1;
                background: rgba(74, 144, 226, .9);
                border-color: #4A90E2;
                color: #fff;
                box-shadow: 0 4px 15px rgba(74, 144, 226, .4);
            }
            .item.wicked-selected::before {
                content: "";
                position: absolute;
                inset: 0;
                border: 3px solid #4A90E2;
                pointer-events: none;
                z-index: 5;
                box-shadow: 0 0 20px rgba(74, 144, 226, .3);
            }
            .item { position: relative; }

            .wp-wicked-dropdown {
                position: relative;
                display: inline-block;
                margin-right: 10px;
                vertical-align: top;
            }
            .wp-wicked-dropdown .sort {
                position: relative;
                border-radius: 15px;
                background-color: #212121;
                color: #fff;
                font-size: 12px;
                font-weight: 500;
                letter-spacing: 0.3px;
                padding: 8px 10px;
                margin: 0 15px 0 0;
                min-width: 140px;
                transition: background-color 0.3s, border-radius 0.3s;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .wp-wicked-dropdown .sort:hover {
    background-color: #276fdb;
}
.wp-wicked-dropdown .sort::before {
    display: none !important;
}
.wp-wicked-dropdown .wicked-icon {
                background: linear-gradient(90deg, #fff, #e0e0e0, #fff, #f0f0f0, #fff);
                background-size: 200% 100%;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: wickedRgb 3s linear infinite;
                font-weight: 900;
                filter: drop-shadow(0 0 3px rgba(255, 255, 255, .6));
            }
            @keyframes wickedRgb {
                to { background-position: 200% 50%; }
            }
            .wp-wicked-dropdown .sort:hover .wicked-icon {
                filter: drop-shadow(0 0 10px rgba(255, 255, 255, .9));
                animation: wickedRgb 1.5s linear infinite;
            }
            .wp-wicked-dropdown .badge {
                background: rgba(74, 144, 226, .9);
                color: #fff;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 11px;
                font-weight: 700;
                min-width: 18px;
                text-align: center;
                display: none;
            }
            .wp-wicked-dropdown.has-selection .badge {
                display: inline-block;
                animation: wickedPulse 2s ease-in-out infinite;
            }
            @keyframes wickedPulse {
                50% { transform: scale(1.15); }
            }

            #wicked-control-panel {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: rgba(31, 33, 41, .95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, .1);
                border-radius: 12px;
                padding: 16px 20px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, .6);
                z-index: 10000;
                display: none !important;
                flex-direction: column;
                gap: 10px;
                min-width: 200px;
            }
            #wicked-control-panel.visible {
                display: flex !important;
                animation: slideUp .3s;
            }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .wicked-btn {
                background: rgba(40, 40, 40, .8);
                backdrop-filter: blur(10px);
                color: #e0e0e0;
                border: 1px solid rgba(255, 255, 255, .15);
                padding: 10px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                font-size: 13px;
                transition: all .2s;
                outline: none;
            }
            .wicked-btn:hover {
                background: rgba(60, 60, 60, .9);
                border-color: rgba(255, 255, 255, .25);
                transform: translateY(-2px);
            }
            .wicked-btn.primary {
                background: rgba(74, 144, 226, .8);
                border-color: rgba(74, 144, 226, .6);
            }
            .wicked-btn.primary:hover {
                background: rgba(74, 144, 226, 1);
                box-shadow: 0 4px 15px rgba(74, 144, 226, .4);
            }
            .wicked-counter {
                text-align: center;
                color: #fff;
                font-size: 14px;
                padding: 8px;
                font-weight: 600;
                margin-bottom: 4px;
                background: rgba(74, 144, 226, .1);
                border-radius: 6px;
            }

            /* Logo Badge for non-search pages */
            .wicked-logo-badge {
                position: absolute;
                top: -5px;
                right: -10px;
                background: rgba(74, 144, 226, .95);
                color: #fff;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 700;
                min-width: 20px;
                text-align: center;
                box-shadow: 0 2px 8px rgba(74, 144, 226, .4);
                cursor: pointer;
                z-index: 1000;
                animation: wickedPulse 2s ease-in-out infinite;
                transition: all .2s;
            }
            .wicked-logo-badge:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 15px rgba(74, 144, 226, .6);
            }
            .wicked-logo-container {
                position: relative;
                display: inline-block;
            }
        `;
        document.head.appendChild(wickedSelectionStyles);

        wickedState.sel = wickedStore.getSel();

        // Determine if we should use logo badge or button
        const useLogoBadge = !isSearchPage;

        function createLogoBadge() {
            const logo = document.querySelector('img[src*="logo.png"]');
            if (!logo || document.querySelector('.wicked-logo-badge')) return;

            // Wrap logo in container if not already wrapped
            if (!logo.parentElement.classList.contains('wicked-logo-container')) {
                const container = document.createElement('div');
                container.className = 'wicked-logo-container';
                logo.parentNode.insertBefore(container, logo);
                container.appendChild(logo);
            }

            const badge = document.createElement('div');
            badge.className = 'wicked-logo-badge';
            badge.textContent = wickedState.sel.length;
            badge.style.display = wickedState.sel.length > 0 ? 'block' : 'none';
            badge.onclick = toggleWickedPanel;

            logo.parentElement.appendChild(badge);
            // console.log('✅ Wicked logo badge created');
        }

      function createWickedButton() {
    if (document.getElementById('wicked-toggle-btn')) return;

    // WAIT for Filters to be created first
    const filterDropdown = document.querySelector('.wp-filter-dropdown');
    if (!filterDropdown) {
        // console.log('⏳ Filters not ready yet, will retry...');
        return; // Let the observer retry
    }

    const dropdown = document.createElement('div');
    dropdown.className = 'wp-wicked-dropdown';
    dropdown.id = 'wicked-toggle-btn';
    dropdown.innerHTML = `
        <div class="sort">
            <span></span>
            <strong class="wicked-icon">Wicked Tab</strong>
            <span class="badge">0</span>
        </div>
    `;

    // Insert AFTER Filters - using nextSibling or nextElementSibling
    const nextElement = filterDropdown.nextElementSibling || filterDropdown.nextSibling;
    if (nextElement) {
        filterDropdown.parentNode.insertBefore(dropdown, nextElement);
    } else {
        // Filters is the last child, append after it
        filterDropdown.parentNode.appendChild(dropdown);
    }

    // console.log('✅ Wicked button inserted after Filters');

    dropdown.onclick = toggleWickedPanel;
    updateWickedUI();
}

        function createWickedPanel() {
            if (document.getElementById('wicked-control-panel')) return;

            const panel = document.createElement('div');
            panel.id = 'wicked-control-panel';
            panel.innerHTML = `
                <div class="wicked-counter">Selected: <span id="wicked-count">0</span></div>
                <button class="wicked-btn primary" id="open-wicked-btn">Open Wicked Tab</button>
                <button class="wicked-btn" id="clear-wicked-btn">Clear Selection</button>
            `;
            document.body.appendChild(panel);

            panel.querySelector('#open-wicked-btn').onclick = openWickedTab;
            panel.querySelector('#clear-wicked-btn').onclick = clearWickedSelection;
        }

        function updateWickedUI() {
            if (useLogoBadge) {
                // Update logo badge
                const badge = document.querySelector('.wicked-logo-badge');
                if (badge) {
                    badge.textContent = wickedState.sel.length;
                    badge.style.display = wickedState.sel.length > 0 ? 'block' : 'none';
                }
            } else {
                // Update button badge
                const btn = document.getElementById('wicked-toggle-btn');
                const badge = btn?.querySelector('.badge');
                if (!btn || !badge) return;

                badge.textContent = wickedState.sel.length;
                if (wickedState.sel.length > 0) {
                    btn.classList.add('has-selection');
                } else {
                    btn.classList.remove('has-selection');
                }
            }
        }

        function toggleWickedPanel() {
            const panel = document.getElementById('wicked-control-panel');
            if (!panel) return;

            wickedState.vis = !wickedState.vis;
            panel.classList.toggle('visible', wickedState.vis);
            document.body.classList.toggle('wicked-active', wickedState.vis);

            if (wickedState.vis) {
                const count = document.getElementById('wicked-count');
                if (count) count.textContent = wickedState.sel.length;
            }
        }

        function toggleVideoSelection(card, url, title, event) {
            event?.preventDefault();
            event?.stopPropagation();

            const idx = wickedState.sel.findIndex(v => v.url === url);
            if (idx > -1) {
                wickedState.sel.splice(idx, 1);
                card.classList.remove('wicked-selected');
            } else {
                wickedState.sel.push({ url, title });
                card.classList.add('wicked-selected');
            }

            wickedStore.setSel(wickedState.sel);
            updateWickedUI();

            if (wickedState.vis) {
                const count = document.getElementById('wicked-count');
                if (count) count.textContent = wickedState.sel.length;
            }
        }

        function openWickedTab() {
            if (!wickedState.sel.length) {
                alert('No videos selected! Right-click or Ctrl+Click videos to add them to your Wicked Tab.');
                return;
            }

            const uniqueVideos = [...new Map(wickedState.sel.map(v => [v.url, v])).values()];
            if (!wickedStore.set(uniqueVideos)) {
                alert('Failed to save videos');
                return;
            }

            try {
                GM_openInTab(`${location.origin}/?wickedview=true&t=${Date.now()}`, { active: true, insert: true });
            } catch {
                window.open(`${location.origin}/?wickedview=true&t=${Date.now()}`, '_blank');
            }
        }

        function clearWickedSelection() {
            wickedState.sel = [];
            wickedStore.clrSel();
            updateWickedUI();

            if (wickedState.vis) {
                const count = document.getElementById('wicked-count');
                if (count) count.textContent = '0';
            }

            document.querySelectorAll('.item.wicked-selected').forEach(card => {
                card.classList.remove('wicked-selected');
            });
        }

        function processVideoThumbnails() {
            document.querySelectorAll('.item:not([data-wicked-processed])').forEach(card => {
                card.dataset.wickedProcessed = '1';

                const link = card.querySelector('a[href*="/video/"]');
                if (!link?.href.includes('/video/')) return;

                const url = link.href;
                const titleEl = card.querySelector('.title, strong.title');
                const title = titleEl ? titleEl.textContent.trim().substring(0, 80) || 'Untitled' : 'Untitled';

                const overlay = document.createElement('div');
                overlay.className = 'wicked-select-overlay';
                overlay.innerHTML = '✓';

                const imgDiv = card.querySelector('.img');
                if (imgDiv) {
                    imgDiv.appendChild(overlay);
                } else {
                    card.appendChild(overlay);
                }

                if (wickedState.sel.some(v => v.url === url)) {
                    card.classList.add('wicked-selected');
                }

                card.addEventListener('click', (e) => {
                    if (!wickedState.vis) return;
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleVideoSelection(card, url, title, e);
                        return false;
                    }
                }, true);

                card.addEventListener('contextmenu', (e) => {
                    if (wickedState.vis) {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleVideoSelection(card, url, title, e);
                        return false;
                    }
                }, true);
            });
        }

        function handleKeyboard(e) {
            if ((e.key === 'g' || e.key === 'G') && !e.ctrlKey && !e.metaKey && wickedState.sel.length > 0) {
                e.preventDefault();
                openWickedTab();
            }
            if ((e.key === 'w' || e.key === 'W') && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                toggleWickedPanel();
            }
            if (e.key === 'Escape' && wickedState.vis) {
                e.preventDefault();
                toggleWickedPanel();
            }
        }

        // Initialize appropriate UI based on page type
        if (useLogoBadge) {
            createLogoBadge();
        } else {
            createWickedButton();
        }
        createWickedPanel();
        processVideoThumbnails();

        const observer = new MutationObserver(() => {
            processVideoThumbnails();
            if (useLogoBadge) {
                if (!document.querySelector('.wicked-logo-badge')) {
                    createLogoBadge();
                }
            } else {
                if (!document.getElementById('wicked-toggle-btn')) {
                    createWickedButton();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        document.addEventListener('keydown', handleKeyboard);
        // console.log('✅ Wicked Tab features initialized successfully!');
    }

    // ============================================
    // SEARCH PAGE - INITIALIZE WICKED + FILTER
    // ============================================
    if (isSearchPage) {
        initWickedFeatures();

        function removePromotionalHeaders() {
            const h1Elements = document.querySelectorAll('h1');
            h1Elements.forEach(h1 => {
                const text = h1.textContent.trim();
                if (text.toLowerCase().includes('videos in') && text.includes(',')) {
                    // console.log('Removing promotional header:', text.substring(0, 50) + '...');
                    h1.remove();
                }
            });
        }

        function downloadFile(content, filename) {
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function waitForCategories(callback) {
            const checkExist = setInterval(() => {
                const categories = document.querySelectorAll('input[id^="category_filter_"]');
                if (categories.length > 0) {
                    clearInterval(checkExist);
                    callback();
                }
            }, 200);
            setTimeout(() => clearInterval(checkExist), 10000);
        }

        function applyCategories(ids) {
            const checkboxes = document.querySelectorAll('input[id^="category_filter_"]');
            checkboxes.forEach(cb => {
                const shouldBeChecked = ids.includes(cb.id);
                if (cb.checked !== shouldBeChecked) cb.click();
            });
            requestAnimationFrame(() => triggerAjaxUpdate(ids));
        }

        function triggerAjaxUpdate(categoryIds = null) {
            let categoryParam = '';
            if (categoryIds) {
                categoryParam = categoryIds.map(id => id.replace('category_filter_', '')).join(',');
            } else {
                const checkedBoxes = document.querySelectorAll('input[id^="category_filter_"]:checked');
                categoryParam = Array.from(checkedBoxes).map(cb => cb.id.replace('category_filter_', '')).join(',');
            }

            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('q') || '';
            const currentSort = document.querySelector('.sort strong')?.textContent || 'Most Relevant';

            let sortParam = 'relevance';
            if (currentSort.includes('Latest')) sortParam = 'post_date';
            else if (currentSort.includes('Most Viewed')) sortParam = 'video_viewed';
            else if (currentSort.includes('Top Rated')) sortParam = 'rating';
            else if (currentSort.includes('Longest')) sortParam = 'duration';
            else if (currentSort.includes('Most Commented')) sortParam = 'most_commented';
            else if (currentSort.includes('Most Favorited')) sortParam = 'most_favourited';

            const params = `q:${query};category_ids:${categoryParam};sort_by:${sortParam}`;
            const existingSortLink = document.querySelector('a[data-action="ajax"]');

            if (existingSortLink) {
                const tempLink = existingSortLink.cloneNode(true);
                tempLink.setAttribute('data-parameters', params);
                if (window.jQuery && typeof window.jQuery.fn.click === 'function') {
                    window.jQuery(tempLink).click();
                } else {
                    document.querySelector('form[action*="filter"] button[type="submit"]')?.click();
                }
            } else {
                document.querySelector('form[action*="filter"] button[type="submit"]')?.click();
            }

            setTimeout(() => {
                removePromotionalHeaders();
                processVideoThumbnails();
            }, 500);
        }

        function createFilterButton() {
            if (filterButton) return;

            const sortDiv = document.querySelector('.sort');
            if (!sortDiv) return;

            const filterDropdown = document.createElement('div');
            filterDropdown.className = 'wp-filter-dropdown';
            filterDropdown.innerHTML = `<div class="sort"><span></span><strong>Filters</strong></div>`;

            filterDropdown.querySelector('.sort').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                categoryCheckboxes = Array.from(document.querySelectorAll('input[id^="category_filter_"]'));
                if (categoryCheckboxes.length > 0) createUI(categoryCheckboxes);
            });

            sortDiv.parentNode.insertBefore(filterDropdown, sortDiv);
            filterButton = filterDropdown;

            if (!document.getElementById('wp-persistent-styles')) {
    const style = document.createElement('style');
    style.id = 'wp-persistent-styles';
    style.textContent = `.wp-filter-dropdown{position:relative;display:inline-block;margin-right:10px;vertical-align:top}.wp-filter-dropdown .sort{position:relative;border-radius:15px;background-color:#212121;color:#fff;font-size:12px;font-weight:500;letter-spacing:0.3px;padding:8px 10px;margin:0 15px 0 0;min-width:140px;transition:background-color 0.3s,border-radius 0.3s;cursor:pointer}.wp-filter-dropdown .sort::before{display:none !important}.wp-filter-dropdown .sort:hover{background-color:#276fdb}`;
    document.head.appendChild(style);
}
        }

        function createUI(categoryCheckboxes) {
            const presets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
            let activePreset = localStorage.getItem(ACTIVE_PRESET_KEY) || '';

            document.querySelector('.wp-overlay')?.remove();

            function showCustomAlert(message) {
                const alertOverlay = document.createElement('div');
                alertOverlay.className = 'wp-custom-dialog-overlay';
                alertOverlay.innerHTML = `
                    <div class="wp-custom-dialog">
                        <div class="wp-dialog-header"></div>
                        <div class="wp-dialog-message">${message}</div>
                        <div class="wp-dialog-buttons">
                            <button class="wp-dialog-btn wp-dialog-ok">OK</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(alertOverlay);
                setTimeout(() => alertOverlay.classList.add('show'), 10);

                alertOverlay.querySelector('.wp-dialog-ok').addEventListener('click', () => {
                    alertOverlay.classList.remove('show');
                    setTimeout(() => alertOverlay.remove(), 300);
                });
            }

            function showCustomConfirm(message, callback) {
                const confirmOverlay = document.createElement('div');
                confirmOverlay.className = 'wp-custom-dialog-overlay';
                confirmOverlay.innerHTML = `
                    <div class="wp-custom-dialog">
                        <div class="wp-dialog-header">Confirm</div>
                        <div class="wp-dialog-message">${message}</div>
                        <div class="wp-dialog-buttons">
                            <button class="wp-dialog-btn wp-dialog-cancel">Cancel</button>
                            <button class="wp-dialog-btn wp-dialog-confirm">Confirm</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(confirmOverlay);
                setTimeout(() => confirmOverlay.classList.add('show'), 10);

                confirmOverlay.querySelector('.wp-dialog-cancel').addEventListener('click', () => {
                    confirmOverlay.classList.remove('show');
                    setTimeout(() => confirmOverlay.remove(), 300);
                    callback(false);
                });

                confirmOverlay.querySelector('.wp-dialog-confirm').addEventListener('click', () => {
                    confirmOverlay.classList.remove('show');
                    setTimeout(() => confirmOverlay.remove(), 300);
                    callback(true);
                });
            }

            function showCustomPrompt(message, callback, defaultValue = '') {
                const promptOverlay = document.createElement('div');
                promptOverlay.className = 'wp-custom-dialog-overlay';
                promptOverlay.innerHTML = `
                    <div class="wp-custom-dialog">
                        <div class="wp-dialog-header"></div>
                        <div class="wp-dialog-message">${message}</div>
                        <input type="text" class="wp-dialog-input" value="${defaultValue}" placeholder="Enter value...">
                        <div class="wp-dialog-buttons">
                            <button class="wp-dialog-btn wp-dialog-cancel">Cancel</button>
                            <button class="wp-dialog-btn wp-dialog-ok">OK</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(promptOverlay);
                setTimeout(() => promptOverlay.classList.add('show'), 10);

                const input = promptOverlay.querySelector('.wp-dialog-input');
                input.focus();
                input.select();

                const handleOk = () => {
                    const value = input.value.trim();
                    promptOverlay.classList.remove('show');
                    setTimeout(() => promptOverlay.remove(), 300);
                    callback(value || null);
                };

                const handleCancel = () => {
                    promptOverlay.classList.remove('show');
                    setTimeout(() => promptOverlay.remove(), 300);
                    callback(null);
                };

                promptOverlay.querySelector('.wp-dialog-ok').addEventListener('click', handleOk);
                promptOverlay.querySelector('.wp-dialog-cancel').addEventListener('click', handleCancel);
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') handleOk();
                    if (e.key === 'Escape') handleCancel();
                });
            }

            const style = document.createElement('style');
            style.textContent = `.wp-overlay{position:fixed;top:0;left:0;right:0;bottom:0;backdrop-filter:blur(10px);background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 0.3s ease}.wp-overlay.show{opacity:1}.wp-panel{background:rgba(20,20,20,0.95);border:1px solid rgba(255,255,255,0.1);color:#e0e0e0;border-radius:12px;padding:24px;width:580px;max-height:80vh;display:flex;flex-direction:column;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:14px;box-shadow:0 20px 40px rgba(0,0,0,0.6);transform:translateY(20px);transition:transform 0.3s ease}.wp-overlay.show .wp-panel{transform:translateY(0)}.wp-panel button,.wp-panel select,.wp-panel input[type="text"]{border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:8px 12px;margin:3px 0;cursor:pointer;background:rgba(40,40,40,0.8);color:#e0e0e0;transition:all 0.2s ease;font-size:13px;font-weight:400;outline:none}.wp-panel button:hover{background:rgba(60,60,60,0.9);border-color:rgba(255,255,255,0.25)}.wp-panel button:active{transform:translateY(1px)}.wp-panel select:hover,.wp-panel input[type="text"]:hover{background:rgba(50,50,50,0.9);border-color:rgba(255,255,255,0.2)}.wp-panel input[type="text"]:focus,.wp-panel select:focus{background:rgba(50,50,50,0.95);border-color:rgba(100,150,200,0.6);box-shadow:0 0 0 2px rgba(100,150,200,0.2)}.wp-panel label{display:flex;align-items:center;margin-bottom:4px;padding:6px 8px;border-radius:4px;transition:background 0.15s ease;cursor:pointer;font-size:13px;width:calc(50% - 4px);box-sizing:border-box}.wp-panel label:hover{background:rgba(255,255,255,0.05)}.wp-panel input[type="checkbox"]{margin-right:10px;accent-color:#4A90E2}.wp-list{overflow-y:auto;max-height:280px;margin:12px 0;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:rgba(0,0,0,0.4);padding:12px}.wp-list::-webkit-scrollbar{width:6px}.wp-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:3px}.wp-list::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.3)}.wp-list::-webkit-scrollbar-track{background:transparent}.wp-categories-grid{display:flex;flex-wrap:wrap;gap:4px;justify-content:space-between}.wp-footer{display:flex;justify-content:space-between;margin-top:auto;padding-top:16px;border-top:1px solid rgba(255,255,255,0.1);gap:8px}.wp-search-container{display:flex;gap:8px;margin-bottom:12px}.wp-search-input{flex:1;margin:0!important}.wp-select-visible-btn{white-space:nowrap;margin:0!important;color:#ffffff!important}.wp-preset-controls{display:flex;justify-content:space-between;margin-bottom:12px;gap:6px}.wp-preset-controls button{flex:1;margin:0;font-size:12px;padding:6px 8px}.wp-header{font-size:18px;font-weight:600;margin-bottom:18px;text-align:center;color:#ffffff}.wp-download-btn{position:relative!important;overflow:visible!important}.wp-download-btn:before{content:'';z-index:-1;position:absolute;display:block;width:110%;height:125%;top:-12.5%;left:-5%;transition:0.3s opacity ease-in-out;filter:blur(10px);opacity:0;background:linear-gradient(60deg,#f79533,#f37055,#ef4e7b,#a166ab,#5073b8,#1098ad,#07b39b,#6fba82)}.wp-download-btn:hover:before{opacity:1!important;transition:0.3s opacity ease-in-out;filter:blur(15px);background:linear-gradient(60deg,#f79533,#f37055,#ef4e7b,#a166ab,#5073b8,#1098ad,#07b39b,#6fba82)!important}.wp-custom-dialog-overlay{position:fixed;top:0;left:0;right:0;bottom:0;backdrop-filter:blur(10px);background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:10000;opacity:0;transition:opacity 0.3s ease}.wp-custom-dialog-overlay.show{opacity:1}.wp-custom-dialog{background:rgba(20,20,20,0.95);border:1px solid rgba(255,255,255,0.1);color:#e0e0e0;border-radius:12px;padding:24px;width:400px;max-width:90vw;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-shadow:0 20px 40px rgba(0,0,0,0.6);transform:translateY(20px);transition:transform 0.3s ease}.wp-custom-dialog-overlay.show .wp-custom-dialog{transform:translateY(0)}.wp-dialog-header{font-size:18px;font-weight:600;margin-bottom:16px;text-align:center;color:#ffffff}.wp-dialog-message{margin-bottom:20px;line-height:1.5;color:#e0e0e0;white-space:pre-line}.wp-dialog-input{width:100%;border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:8px 12px;margin:16px 0;background:rgba(40,40,40,0.8);color:#e0e0e0;font-size:14px;outline:none;box-sizing:border-box}.wp-dialog-input:focus{background:rgba(50,50,50,0.95);border-color:rgba(100,150,200,0.6);box-shadow:0 0 0 2px rgba(100,150,200,0.2)}.wp-dialog-buttons{display:flex;gap:10px;justify-content:flex-end}.wp-dialog-btn{border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:8px 16px;cursor:pointer;background:rgba(40,40,40,0.8);color:#e0e0e0;transition:all 0.2s ease;font-size:13px;font-weight:400;outline:none}.wp-dialog-btn:hover{background:rgba(60,60,60,0.9);border-color:rgba(255,255,255,0.25)}.wp-dialog-btn:active{transform:translateY(1px)}.wp-dialog-confirm{background:rgba(70,130,200,0.8)!important}.wp-dialog-confirm:hover{background:rgba(70,130,200,1)!important}`;
            document.head.appendChild(style);

            const overlay = document.createElement('div');
            overlay.className = 'wp-overlay';
            overlay.innerHTML = `
                <div class="wp-panel">
                    <div class="wp-header">WatchPorn Filter Manager</div>
                    <div class="wp-search-container">
                        <input type="text" placeholder="Search categories..." class="wp-search-input">
                        <button class="wp-select-visible-btn">Select All Visible</button>
                    </div>
                    <select class="wp-preset-select">
                        <option value="">Select a preset...</option>
                    </select>
                    <div class="wp-preset-controls">
                        <button class="wp-save-btn">Save</button>
                        <button class="wp-export-btn">Export</button>
                        <button class="wp-import-btn">Import</button>
                        <button class="wp-delete-btn">Delete</button>
                    </div>
                    <div class="wp-list">
                        <div class="wp-categories-grid"></div>
                    </div>
                    <div class="wp-footer">
                        <button class="wp-uncheck-btn">Uncheck All</button>
                        <button class="wp-download-btn">Download Auto Preview</button>
                        <button class="wp-close-btn">Close</button>
                    </div>
                </div>
            `;

            const panel = overlay.querySelector('.wp-panel');
            const searchInput = panel.querySelector('.wp-search-input');
            const presetSelect = panel.querySelector('.wp-preset-select');
            const form = panel.querySelector('.wp-categories-grid');

            let searchTimeout;

            function rebuildPresetSelect() {
                const currentPresets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                presetSelect.innerHTML = '<option value="">Select a preset...</option>';
                Object.keys(currentPresets).forEach(name => {
                    const opt = document.createElement('option');
                    opt.value = name;
                    opt.textContent = name;
                    if (name === activePreset) opt.selected = true;
                    presetSelect.appendChild(opt);
                });
            }

            function buildCategoryList() {
                const sorted = categoryCheckboxes.slice().sort((a, b) =>
                    (favorites.includes(b.id) - favorites.includes(a.id)) || (b.checked - a.checked)
                );

                form.innerHTML = '';
                const fragment = document.createDocumentFragment();

                sorted.forEach(checkbox => {
                    const labelText = checkbox.nextElementSibling?.textContent.trim() ||
                        checkbox.id.replace('category_filter_', '');

                    const container = document.createElement('label');
                    container.innerHTML = `
                        <input type="checkbox" value="${checkbox.id}" ${checkbox.checked ? 'checked' : ''}>
                        <span>${labelText}</span>
                    `;

                    const cb = container.querySelector('input');
                    cb.addEventListener('change', () => {
                        const target = document.getElementById(cb.value);
                        if (target && target.checked !== cb.checked) target.click();
                        requestAnimationFrame(() => triggerAjaxUpdate());
                    });

                    fragment.appendChild(container);
                });
                form.appendChild(fragment);
            }

            rebuildPresetSelect();
            buildCategoryList();

            panel.querySelector('.wp-select-visible-btn').addEventListener('click', () => {
                form.querySelectorAll('label').forEach(label => {
                    if (label.style.display !== 'none') {
                        const cb = label.querySelector('input[type="checkbox"]');
                        if (cb && !cb.checked) cb.click();
                    }
                });
            });

            panel.querySelector('.wp-save-btn').addEventListener('click', () => {
                showCustomPrompt('Enter preset name:', (presetName) => {
                    if (presetName?.trim()) {
                        const currentPresets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                        const selected = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
                        currentPresets[presetName.trim()] = selected;
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPresets));
                        activePreset = presetName.trim();
                        localStorage.setItem(ACTIVE_PRESET_KEY, activePreset);
                        rebuildPresetSelect();
                        presetSelect.value = activePreset;
                        showCustomAlert(`Preset "${presetName.trim()}" saved successfully!`);
                    }
                });
            });

            panel.querySelector('.wp-export-btn').addEventListener('click', () => {
                const name = presetSelect.value;
                if (!name) {
                    showCustomAlert('Please select a preset to export.');
                    return;
                }
                const currentPresets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                if (currentPresets[name]) {
                    const exportData = {
                        name, categories: currentPresets[name], version: '2.0',
                        exportDate: new Date().toISOString()
                    };
                    const filename = `watchporn_preset_${name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
                    downloadFile(JSON.stringify(exportData, null, 2), filename);
                    showCustomAlert(`Preset "${name}" exported successfully!\nFile: ${filename}`);
                }
            });

            panel.querySelector('.wp-import-btn').addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.txt';
                input.style.display = 'none';
                input.addEventListener('change', (event) => {
                    const file = event.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const importData = JSON.parse(e.target.result);
                            if (!importData.name || !importData.categories || !Array.isArray(importData.categories)) {
                                throw new Error('Invalid preset data');
                            }
                            const currentPresets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                            let importName = importData.name;
                            if (currentPresets[importName]) {
                                showCustomPrompt(`Preset "${importName}" already exists. Enter a new name:`, (newName) => {
                                    if (!newName) return;
                                    importName = newName;
                                    processImport();
                                }, importName + '_imported');
                            } else {
                                processImport();
                            }

                            function processImport() {
                                const validCategories = importData.categories.filter(id => document.getElementById(id));
                                if (validCategories.length === 0) {
                                    showCustomAlert('No valid categories found in this preset for the current page.');
                                    return;
                                }
                                if (validCategories.length < importData.categories.length) {
                                    const missing = importData.categories.length - validCategories.length;
                                    showCustomConfirm(`${missing} categories from this preset are not available on this page. Import anyway with ${validCategories.length} categories?`, (confirmed) => {
                                        if (confirmed) finishImport();
                                    });
                                } else {
                                    finishImport();
                                }

                                function finishImport() {
                                    currentPresets[importName] = validCategories;
                                    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPresets));
                                    localStorage.setItem(ACTIVE_PRESET_KEY, importName);
                                    activePreset = importName;
                                    rebuildPresetSelect();
                                    presetSelect.value = activePreset;
                                    buildCategoryList();
                                    applyCategories(validCategories);
                                    showCustomAlert(`Preset "${importName}" imported and applied successfully with ${validCategories.length} categories!`);
                                }
                            }
                        } catch (error) {
                            showCustomAlert('Invalid preset file. Please check the file and try again.\nError: ' + error.message);
                        }
                    };
                    reader.readAsText(file);
                });
                document.body.appendChild(input);
                input.click();
                document.body.removeChild(input);
            });

            panel.querySelector('.wp-delete-btn').addEventListener('click', () => {
                const name = presetSelect.value;
                if (name) {
                    showCustomConfirm(`Delete preset "${name}"? This action cannot be undone.`, (confirmed) => {
                        if (confirmed) {
                            const currentPresets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                            delete currentPresets[name];
                            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPresets));
                            if (activePreset === name) {
                                activePreset = '';
                                localStorage.setItem(ACTIVE_PRESET_KEY, activePreset);
                            }
                            rebuildPresetSelect();
                            presetSelect.value = '';
                            showCustomAlert(`Preset "${name}" deleted successfully!`);
                        }
                    });
                } else {
                    showCustomAlert('Please select a preset to delete.');
                }
            });

            presetSelect.addEventListener('change', () => {
                const name = presetSelect.value;
                activePreset = name;
                localStorage.setItem(ACTIVE_PRESET_KEY, activePreset);
                if (name) {
                    const currentPresets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                    if (currentPresets[name]) {
                        form.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                        currentPresets[name].forEach(id => {
                            const formCheckbox = form.querySelector(`input[value="${id}"]`);
                            if (formCheckbox) formCheckbox.checked = true;
                        });
                        applyCategories(currentPresets[name]);
                    }
                }
            });

            panel.querySelector('.wp-uncheck-btn').addEventListener('click', () => {
                form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    if (cb.checked) cb.click();
                });
            });

            panel.querySelector('.wp-download-btn').addEventListener('click', () => {
                const scriptUrl = 'https://update.sleazyfork.org/scripts/534164/Auto-play%20video%20thumbnails%20for%20sxyprn%2C%20watchporn%2C%20yesporn%2C%20theyarehuge.user.js';
                const tempLink = document.createElement('a');
                tempLink.href = scriptUrl;
                tempLink.download = 'auto-preview-script.user.js';
                tempLink.target = '_blank';
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                setTimeout(() => {
                    showCustomAlert('Auto Preview script download initiated!\n\nIf the download didn\'t start automatically, the script will open in a new tab.');
                }, 500);
            });

            panel.querySelector('.wp-close-btn').addEventListener('click', () => {
                overlay.classList.remove('show');
                setTimeout(() => overlay.remove(), 300);
            });

            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const term = searchInput.value.toLowerCase();
                    form.querySelectorAll('label').forEach(label => {
                        const text = label.textContent.toLowerCase();
                        label.style.display = text.includes(term) ? 'flex' : 'none';
                    });
                }, 150);
            });

            document.body.appendChild(overlay);
            setTimeout(() => overlay.classList.add('show'), 10);

            if (activePreset) {
                const currentPresets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                if (currentPresets[activePreset]) {
                    setTimeout(() => applyCategories(currentPresets[activePreset]), 1000);
                }
            }
        }

        function initializeSearchPage() {
            removePromotionalHeaders();

            waitForCategories(() => {
                const allCheckboxes = Array.from(document.querySelectorAll('input[id^="category_filter_"]'));
                if (allCheckboxes.length > 0) {
                    categoryCheckboxes = allCheckboxes;
                    createFilterButton();

                    const observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.addedNodes.length > 0) {
                                const hasSortElements = Array.from(mutation.addedNodes).some(node =>
                                    node.nodeType === 1 && (node.querySelector?.('.sort') || node.classList?.contains('sort'))
                                );
                                if (hasSortElements) {
                                    if (!document.querySelector('.wp-filter-dropdown')) {
                                        setTimeout(() => {
                                            filterButton = null;
                                            createFilterButton();
                                        }, 100);
                                    }
                                }

                                const hasNewHeaders = Array.from(mutation.addedNodes).some(node =>
                                    node.nodeType === 1 && (node.tagName === 'H1' || node.querySelector?.('h1'))
                                );
                                if (hasNewHeaders) {
                                    setTimeout(removePromotionalHeaders, 100);
                                }
                            }
                        });
                    });

                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                }
            });

            setInterval(removePromotionalHeaders, 2000);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeSearchPage);
        } else {
            initializeSearchPage();
        }
    }

    // ============================================
    // UNIVERSAL PAGES - WICKED TAB ON ALL VIDEO PAGES
    // ============================================
    if (!isWickedTab && !isSearchPage) {
        const initUniversalWicked = () => {
            // console.log('🔍 Checking for videos on:', window.location.pathname);

            if (hasVideoListings()) {
                // console.log('✅ Videos found! Initializing Wicked Tab...');
                initWickedFeatures();
            } else {
                // console.log('⏳ No videos found yet, waiting...');
                setTimeout(() => {
                    if (hasVideoListings()) {
                        // console.log('✅ Videos found after delay! Initializing Wicked Tab...');
                        initWickedFeatures();
                    } else {
                        // console.log('❌ No videos found on this page');
                    }
                }, 2000);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initUniversalWicked);
        } else {
            initUniversalWicked();
        }
    }

})();