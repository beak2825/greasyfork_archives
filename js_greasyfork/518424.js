// ==UserScript==
// @name         All-in-One Web Scanner [BETA]
// @namespace    aio-ws-drk-beta
// @icon         https://darkie-matrix.vercel.app/scanner.png
// @supportURL   https://darkie.vercel.app/
// @version      1.7.1
// @description  Combines scanners, persists state, stays on top, reliably appears in SPAs, with enhanced stream detection.
// @author       DARKIE
// @match        *://*/*
// @exclude      *://*.youtube.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532683/All-in-One%20Web%20Scanner%20%5BBETA%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/532683/All-in-One%20Web%20Scanner%20%5BBETA%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.aioScannerInstanceShort) {
        console.log("AIO Scanner (Short): Initialization skipped (instance already exists).");
        return;
    }

    class AioScanner {
        // --- Constants ---
        _SK = 'aioScannerPopupState_v1';
        _Z_POP = 2147483646;
        _Z_TGL = 2147483645;
        _P_ID = 'aio-scanner-popup';
        _T_ID = 'aio-toggle-button';
        _PR_ID = 'aio-image-preview-popup';

        _STRM_MIME = {
            'application/vnd.apple.mpegurl': 'm3u8',
            'application/x-mpegurl': 'm3u8',
            'audio/mpegurl': 'm3u8',
            'video/mp4': 'mp4',
            'audio/mp4': 'mp4',
            'text/vtt': 'vtt',
            'application/x-subrip': 'srt',
            'text/plain': 'srt',
            'application/dash+xml': 'mpd',
        };
        _RGX_STRM = /["'](https?:\/\/[^"'\s]+?\.(m3u8|mp4|vtt|srt|mpd)(?:[?#][^"'\s]*)?)["']|["'](https?:\/\/[^"'\s]+?(?:hls|dash|manifest|playlist|\/video\/|\/audio\/|\/segment)[^"'\s]*?)["']/gi;

        constructor() {
            console.log("AIO Scanner (Short): Constructor called.");

            // --- Instance Variables ---
            this._urls = new Set();
            this._reqs = [];
            this._maxR = 100;
            this._lastImgScn = 0;
            this._imgScnDelay = 500;
            this._maxUrlLen = 70;
            this._prvPad = 15;
            this._prvMaxW = 300;
            this._initd = false;
            this._obs = null;
            this._lastScanTime = 0;

            // --- Configuration ---
            this._cfg = {
                ui: {
                    popup: {
                        width: '650px',
                        maxHeight: '85vh'
                    }
                },
                selectors: {
                    vtt: '#vtt-content',
                    srt: '#srt-content',
                    m3u8: '#m3u8-content',
                    mp4: '#mp4-content',
                    mpd: "#mpd-content",
                    iframe: '#iframe-content',
                    network: '#network-content',
                    image: '#image-content'
                },
                linkTypes: ['vtt', 'srt', 'm3u8', 'mp4', 'mpd']
            };

            window.allInOneScanner = this;

            // --- Debounced Functions ---
            this._debScanAll = this._dbnc(() => {
                if (this._pop && this._pop.classList.contains('aio-visible')) {
                    this._scanAll();
                }
            }, this._imgScnDelay);

            this._debEnsureUI = this._dbnc(this._ensureUI, 300);

            // --- Core Initialization Steps ---
            this._mkCSS();
            this._setupNetMon();
            this._monSetAttr();
            this._listenSPA();
            this._monBlob();

            // --- Deferred UI/Observer Setup ---
            this._waitBodyInit();
        }

        /* ==========================================================================
           Initialization Helpers
           ========================================================================== */

        _waitBodyInit() {
            if (document.body) {
                this._initUIObs();
            } else {
                const obs = new MutationObserver((muts, observer) => {
                    if (document.body) {
                        observer.disconnect();
                        this._initUIObs();
                    }
                });
                obs.observe(document.documentElement || document, {
                    childList: true
                });
            }
        }

        _initUIObs() {
            if (this._initd) return;
            this._mkUI();
            this._obsDOM();
            this._chkStUI();
            if (this._pop ?.classList.contains('aio-visible')) {
                this._scanAll();
            }
            this._initd = true;
            console.log("AIO Scanner (Short): UI Initialized and DOM Observer attached.");
        }

        /* ==========================================================================
           UI Creation and Management
           ========================================================================== */

        _mkUI() {
            this._mkTglBtn();
            this._mkPop();
            this._mkPrvPop();
            const cached = this._cacheDOM();
            if (cached) {
                this._addEvts();
                this._setupKB();
                this._setupDelEvts();
            } else {
                console.error("AIO Scanner (Short): Failed UI init - core elements missing.");
            }
        }

        _mkCSS() {
            const ZP = this._Z_POP;
            const ZT = this._Z_TGL;
            const ZPR = ZP + 1;
            const css = `
                .aio-popup {
                    position: fixed; top: 20px; right: 20px; width: ${this._cfg.ui.popup.width}; max-height: ${this._cfg.ui.popup.maxHeight};
                    background-color: rgba(35, 35, 42, 0.97); color: #e0e0e0; padding: 18px; border-radius: 14px;
                    border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    font-size: 14px; z-index: ${ZP}; display: none; overflow-y: auto; backdrop-filter: blur(8px);
                    transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out; transform: translateY(-10px); opacity: 0;
                }
                .aio-popup.aio-visible {
                    transform: translateY(0); opacity: 1; display: block;
                }
                #aio-toggle-button {
                    position: fixed; top: 20px; right: 20px; z-index: ${ZT}; padding: 8px 15px;
                    background-color: rgba(35, 35, 42, 0.95); box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1); display: block; background-color: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.15); color: #e0e0e0; border-radius: 8px; cursor: pointer;
                    font-size: 12px; transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.1s ease; white-space: nowrap;
                }
                #aio-toggle-button:hover {
                    background-color: rgba(255, 255, 255, 0.18); border-color: rgba(255, 255, 255, 0.25);
                }
                #aio-toggle-button:active {
                    transform: scale(0.97);
                }
                 .aio-image-preview {
                    position: fixed; padding: 10px; background-color: rgba(35, 35, 42, 0.98); border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 8px; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5); z-index: ${ZPR}; pointer-events: none;
                    opacity: 0; transition: opacity 0.15s ease-in-out; max-width: ${this._prvMaxW}px; max-height: 300px; display: none;
                 }
                 .aio-image-preview img {
                     display: block; max-width: 100%; max-height: 280px; border-radius: 4px;
                 }
                .aio-header {
                    display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; padding-bottom: 10px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.15); margin-left: -18px; margin-right: -18px; margin-top: -18px;
                    padding-left: 18px; padding-right: 18px; padding-top: 18px;
                }
                .aio-title {
                    font-size: 17px; font-weight: 600; margin: 0; color: #fff;
                }
                .aio-controls {
                    display: flex; gap: 8px;
                }
                .aio-footer {
                    margin-top: 20px; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.1);
                    text-align: center; font-size: 11px; color: rgba(255, 255, 255, 0.5);
                }
                .aio-footer .aio-heart {
                    color: #e44d4d; display: inline-block; animation: aio-heartbeat 1.5s infinite ease-in-out;
                }
                @keyframes aio-heartbeat {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }
                .aio-button {
                    background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.15); color: #e0e0e0;
                    padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 12px;
                    transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.1s ease; white-space: nowrap;
                }
                .aio-button:hover {
                    background-color: rgba(255, 255, 255, 0.18); border-color: rgba(255, 255, 255, 0.25);
                }
                .aio-button:active {
                    transform: scale(0.97);
                }
                .aio-section {
                    margin-bottom: 20px;
                }
                .aio-section-title {
                    font-size: 15px; font-weight: 600; color: #fff; margin: 0 0 10px 0; padding-bottom: 6px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .aio-content {
                    max-height: 300px; overflow-y: auto; padding-right: 5px;
                }
                .aio-list {
                    list-style: none; padding: 0; margin: 0;
                }
                .aio-item {
                    padding: 10px 12px; margin: 6px 0; background-color: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; font-size: 12px;
                    transition: background-color 0.2s ease, border-color 0.2s ease; position: relative;
                }
                .aio-item:hover {
                    background-color: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.15);
                }
                .aio-item-source, .aio-network-url {
                    color: #fff; word-break: break-all; margin-bottom: 5px; display: block;
                }
                .aio-item-info, .aio-network-details {
                    color: rgba(255, 255, 255, 0.65); font-size: 11px; display: flex; gap: 10px;
                    align-items: center; flex-wrap: wrap; margin-top: 6px;
                }
                .aio-item-tag {
                    background-color: rgba(255, 255, 255, 0.1); padding: 3px 7px; border-radius: 6px;
                    font-size: 10px; white-space: nowrap;
                }
                .aio-empty {
                    color: rgba(255, 255, 255, 0.6); font-style: italic; font-size: 13px;
                    text-align: center; padding: 20px 0;
                }
                .aio-filter {
                    width: 100%; box-sizing: border-box; padding: 9px 12px; margin-bottom: 12px;
                    background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px; color: #fff; font-size: 13px;
                    transition: background-color 0.2s ease, border-color 0.2s ease;
                }
                .aio-filter::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }
                .aio-filter:focus {
                    outline: none; background: rgba(255, 255, 255, 0.12); border-color: rgba(100, 150, 255, 0.5);
                }
                .aio-link {

                }
                .aio-link .timestamp {
                    font-size: 10px; color: rgba(255, 255, 255, 0.5); margin-top: 4px; display: block;
                }
                .aio-iframe-item {
                    cursor: pointer;
                }
                .aio-network-method {
                    display: inline-block; padding: 3px 8px; border-radius: 6px; margin-right: 8px;
                    font-weight: bold; font-size: 10px; color: #fff;
                }
                .aio-network-method-get {
                    background-color: rgba(64, 156, 255, 0.3); border: 1px solid rgba(64, 156, 255, 0.5);
                }
                .aio-network-method-post {
                    background-color: rgba(50, 205, 50, 0.3); border: 1px solid rgba(50, 205, 50, 0.5);
                }
                .aio-network-method-put {
                    background-color: rgba(255, 165, 0, 0.3); border: 1px solid rgba(255, 165, 0, 0.5);
                }
                .aio-network-method-delete {
                    background-color: rgba(255, 69, 0, 0.3); border: 1px solid rgba(255, 69, 0, 0.5);
                }
                .aio-network-method-error {
                    background-color: rgba(200, 0, 0, 0.3); border: 1px solid rgba(200, 0, 0, 0.5);
                }
                .aio-network-controls {
                    margin-left: auto; display: flex; gap: 8px;
                }
                .aio-network-copy, .aio-network-show-payload {
                    background-color: rgba(147, 112, 219, 0.2); border: 1px solid rgba(147, 112, 219, 0.4);
                    color: #e0e0e0; padding: 3px 8px; border-radius: 6px; cursor: pointer; font-size: 10px;
                    transition: background-color 0.2s ease, border-color 0.2s ease; white-space: nowrap;
                }
                .aio-network-copy:hover, .aio-network-show-payload:hover {
                    background-color: rgba(147, 112, 219, 0.4); border-color: rgba(147, 112, 219, 0.6);
                }
                .aio-network-copy.copied {
                    background-color: rgba(50, 205, 50, 0.4); border-color: rgba(50, 205, 50, 0.6); color: #fff;
                }
                .aio-network-payload {
                    background-color: rgba(0, 0, 0, 0.3); padding: 10px; border-radius: 6px; margin-top: 10px;
                    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace; white-space: pre-wrap;
                    word-break: break-all; max-height: 150px; overflow-y: auto; display: none;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .aio-image-item {

                }
                 .aio-image-button-group {
                    margin-left: auto; display: flex; gap: 6px;
                 }
                 .aio-image-copy, .aio-image-view, .aio-image-download {
                    border: 1px solid transparent; color: #e0e0e0; padding: 3px 8px; border-radius: 6px;
                    cursor: pointer; font-size: 10px; transition: background-color 0.2s ease, border-color 0.2s ease;
                    white-space: nowrap;
                 }
                 .aio-image-copy {
                    background-color: rgba(147, 112, 219, 0.2); border-color: rgba(147, 112, 219, 0.4);
                 }
                 .aio-image-view {
                    background-color: rgba(64, 156, 255, 0.2); border-color: rgba(64, 156, 255, 0.4);
                 }
                 .aio-image-download {
                    background-color: rgba(50, 205, 50, 0.2); border-color: rgba(50, 205, 50, 0.4);
                 }
                 .aio-image-copy:hover {
                    background-color: rgba(147, 112, 219, 0.4); border-color: rgba(147, 112, 219, 0.6);
                 }
                 .aio-image-view:hover {
                    background-color: rgba(64, 156, 255, 0.4); border-color: rgba(64, 156, 255, 0.6);
                 }
                 .aio-image-download:hover {
                    background-color: rgba(50, 205, 50, 0.4); border-color: rgba(50, 205, 50, 0.6);
                 }
                 .aio-image-copy.copied {
                    background-color: rgba(50, 205, 50, 0.4); border-color: rgba(50, 205, 50, 0.6); color: #fff;
                 }
                .aio-image-truncated {
                    cursor: pointer;
                }
                .aio-image-truncated:hover {
                    text-decoration: underline;
                }
                .aio-popup::-webkit-scrollbar, .aio-content::-webkit-scrollbar {
                    width: 8px;
                }
                .aio-popup::-webkit-scrollbar-track, .aio-content::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05); border-radius: 10px;
                }
                .aio-popup::-webkit-scrollbar-thumb, .aio-content::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2); border-radius: 10px; border: 2px solid transparent; background-clip: content-box;
                }
                .aio-popup::-webkit-scrollbar-thumb:hover, .aio-content::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.4);
                }
             `;
            const ss = document.createElement('style');
            ss.textContent = css;
            document.head.prepend(ss);
        }

        _mkTglBtn() {
            if (document.getElementById(this._T_ID)) return;
            this._tglBtn = document.createElement('button');
            this._tglBtn.id = this._T_ID;
            this._tglBtn.title = 'Toggle Scanner (Ctrl+Shift+A)';
            this._tglBtn.textContent = '🔍';
            this._tglBtn.className = 'aio-button';
            document.body.appendChild(this._tglBtn);
        }

        _mkPop() {
            if (document.getElementById(this._P_ID)) return;
            this._pop = document.createElement('div');
            this._pop.className = 'aio-popup';
            this._pop.id = this._P_ID;
            this._pop.innerHTML = `
                <div class="aio-header">
                    <h2 class="aio-title">All-in-One Web Scanner [BETA]</h2>
                    <div class="aio-controls">
                        <button class="aio-button" id="aio-clear" title="Clear all scanned data">Clear</button>
                        <button class="aio-button" id="aio-refresh" title="Rescan the page">Refresh</button>
                        <button class="aio-button" id="aio-close" title="Close Scanner (Ctrl+Shift+A)">✕</button>
                    </div>
                </div>
                ${this._genSecs()}
                <div class="aio-footer">
                    Made with <span class="aio-heart">❤️</span> by DARKIE | v${GM_info?.script?.version || '1.7.1'}
                </div>
            `;
            document.body.appendChild(this._pop);
        }

        _genSecs() {
            const secs = [{
                id: 'stream-section',
                title: 'Stream Files',
                contentId: 'stream-content',
                hasFilter: false,
                generator: this._genStrmSecs.bind(this)
            }, {
                id: 'iframe-section',
                title: 'Iframe Sources',
                contentId: 'iframe-content',
                hasFilter: false,
                generator: this._genEmpty.bind(this, 'iframes')
            }, {
                id: 'network-section',
                title: 'Network Requests',
                contentId: 'network-content',
                hasFilter: true,
                filterPlaceholder: 'Filter requests by URL...',
                generator: this._genEmpty.bind(this, 'network requests')
            }, {
                id: 'image-section',
                title: 'Image Sources',
                contentId: 'image-content',
                hasFilter: true,
                filterPlaceholder: 'Filter images by URL...',
                generator: this._genEmpty.bind(this, 'images')
            }, ];
            return secs.map(s => `
                <div class="aio-section" id="${s.id}">
                    <h3 class="aio-section-title">${s.title}</h3>
                    ${s.hasFilter ? `<input type="text" class="aio-filter" id="${s.contentId}-filter" placeholder="${s.filterPlaceholder}">` : ''}
                    <div class="aio-content" id="${s.contentId}">
                        ${s.generator()}
                    </div>
                </div>
            `).join('');
        }

        _genStrmSecs() {
            return this._cfg.linkTypes.map(t => `
                <div class="aio-subsection" id="${t}-section">
                    <h4 class="aio-section-subtitle" style="font-size: 13px; margin-bottom: 5px; color: #ccc;">${t.toUpperCase()}</h4>
                    <div class="aio-list-container" id="${t}-content">
                         <div class="aio-empty">No ${t.toUpperCase()} files detected yet...</div>
                    </div>
                </div>
            `).join('');
        }

        _mkPrvPop() {
            if (document.getElementById(this._PR_ID)) return;
            this._prvPop = document.createElement('div');
            this._prvPop.className = 'aio-image-preview';
            this._prvPop.id = this._PR_ID;
            this._prvPop.innerHTML = '<img src="" alt="Preview">';
            document.body.appendChild(this._prvPop);
        }

        _cacheDOM() {
            this._pop = document.getElementById(this._P_ID);
            this._tglBtn = document.getElementById(this._T_ID);
            this._prvPop = document.getElementById(this._PR_ID);
            if (!this._pop || !this._tglBtn || !this._prvPop) {
                return false;
            }
            this._clrBtn = this._pop.querySelector('#aio-clear');
            this._clsBtn = this._pop.querySelector('#aio-close');
            this._refBtn = this._pop.querySelector('#aio-refresh');
            this._netFltIn = this._pop.querySelector('#network-content-filter');
            this._imgFltIn = this._pop.querySelector('#image-content-filter');
            return true;
        }

        _addEvts() {
            this._clsBtn ?.addEventListener('click', () => this._hidePop());
            this._clrBtn ?.addEventListener('click', () => this._clrAll());
            this._refBtn ?.addEventListener('click', () => this._scanAll());
            this._tglBtn ?.addEventListener('click', () => this._tglPop());
            this._netFltIn ?.addEventListener('input', this._dbnc(this._hdlNetFlt.bind(this), 300));
            this._imgFltIn ?.addEventListener('input', this._dbnc(this._hdlImgFlt.bind(this), 300));
        }

        _setupKB() {
            if (window.aioScannerKBLstnr) return;
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
                    e.preventDefault();
                    this._tglPop();
                }
            });
            window.aioScannerKBLstnr = true;
        }

        _setupDelEvts() {
            if (!this._pop || window.aioScannerDelLstnr) return;

            this._pop.addEventListener('click', (evt) => {
                const sl = evt.target.closest('.aio-link');
                if (sl) {
                    this._hdlStrmCp(sl);
                    return;
                }
                const ifi = evt.target.closest('.aio-iframe-item');
                if (ifi) {
                    this._hdlIfrCp(ifi);
                    return;
                }
                const ni = evt.target.closest('.aio-network-item');
                if (ni) {
                    if (evt.target.closest('.aio-network-copy')) {
                        this._hdlNetCp(evt.target.closest('.aio-network-copy'));
                    } else if (evt.target.closest('.aio-network-show-payload')) {
                        this._hdlNetPTgl(evt.target.closest('.aio-network-show-payload'));
                    }
                    return;
                }
                const imi = evt.target.closest('.aio-image-item');
                if (imi) {
                    if (evt.target.closest('.aio-image-copy')) {
                        this._hdlImgCp(evt.target.closest('.aio-image-copy'));
                    } else if (evt.target.closest('.aio-image-view')) {
                        this._hdlImgVw(evt.target.closest('.aio-image-view'));
                    } else if (evt.target.closest('.aio-image-download')) {
                        this._hdlImgDl(evt.target.closest('.aio-image-download'));
                    } else if (evt.target.closest('.aio-image-truncated')) {
                        this._hdlImgTrunClk(evt.target.closest('.aio-image-truncated'));
                    }
                    return;
                }
            });

            const imgCont = this._pop.querySelector(this._cfg.selectors.image);
            if (imgCont) {
                imgCont.addEventListener('mouseover', (evt) => {
                    const imi = evt.target.closest('.aio-image-item');
                    if (imi) {
                        this._hdlImgPrvShow(imi);
                    }
                });
                imgCont.addEventListener('mouseout', (evt) => {
                    const imi = evt.target.closest('.aio-image-item');
                    const rt = evt.relatedTarget;
                    if (imi && !imi.contains(rt) && !this._prvPop ?.contains(rt)) {
                        this._hdlImgPrvHide();
                    }
                });
            }
            window.aioScannerDelLstnr = true;
        }

        // --- Event Handlers ---

        _hdlStrmCp(el) {
            const u = el.dataset.url;
            if (u) {
                this._cpHlp(u, el);
            }
        }

        async _hdlIfrCp(el) {
            const fs = el.dataset.src;
            if (fs) {
                this._cpHlp(fs, el);
            } else {
                console.warn("AIO Scanner (Short): Could not find data-src on iframe item:", el);
                this._flashItm(el, false);
            }
        }

        async _hdlNetCp(btn) {
            const i = btn.dataset.index;
            if (i !== undefined && this._reqs[i]) {
                const u = this._reqs[i].url;
                const ok = await this._cpClip(u);
                this._flashBtn(btn, ok, 'Copied!', 'Copy URL');
            }
        }

        _hdlNetPTgl(btn) {
            const i = btn.dataset.index;
            if (i !== undefined && this._pop) {
                const pDiv = this._pop.querySelector(`#payload-${i}`);
                if (pDiv) {
                    const v = pDiv.style.display === 'block';
                    pDiv.style.display = v ? 'none' : 'block';
                    btn.textContent = v ? 'Payload' : 'Hide';
                }
            }
        }

        async _hdlImgCp(btn) {
            const itm = btn.closest('.aio-image-item');
            if (itm) {
                const s = itm.dataset.src;
                const ok = await this._cpClip(s);
                this._flashBtn(btn, ok, 'Copied!', 'Copy');
            }
        }

        _hdlImgVw(btn) {
            const itm = btn.closest('.aio-image-item');
            if (itm) {
                const s = itm.dataset.src;
                window.open(s, '_blank');
            }
        }

        _hdlImgDl(btn) {
            const itm = btn.closest('.aio-image-item');
            if (itm) {
                const s = itm.dataset.src;
                const fn = s.split('/').pop().split(/[?#]/)[0] || 'image';
                this._dlImg(s, fn);
            }
        }

        _hdlImgTrunClk(srcEl) {
            const fu = srcEl.title;
            if (srcEl.textContent === fu) {
                srcEl.textContent = this._truncUrl(fu);
            } else {
                srcEl.textContent = fu;
            }
        }

        _hdlImgPrvShow(itm) {
            if (!this._prvPop) return;
            const s = itm.dataset.src;
            const prv = this._prvPop;
            const img = prv.querySelector('img');
            img.src = s;

            const r = itm.getBoundingClientRect();
            const pW = this._prvMaxW;
            const pL = r.left - pW - this._prvPad;

            if (pL >= 0) {
                prv.style.left = `${pL}px`;
                prv.style.right = 'auto';
            } else {
                const pR = r.right + this._prvPad;
                if (pR + pW <= window.innerWidth) {
                    prv.style.left = `${pR}px`;
                    prv.style.right = 'auto';
                } else {
                    prv.style.left = `${this._prvPad}px`;
                    prv.style.right = 'auto';
                }
            }

            const pT = r.top;
            const vh = window.innerHeight;
            const pH = prv.offsetHeight || 200;
            if (pT + pH > vh - this._prvPad) {
                prv.style.top = `${Math.max(0, vh - pH - this._prvPad)}px`;
            } else {
                prv.style.top = `${Math.max(0, pT)}px`;
            }

            prv.style.display = 'block';
            requestAnimationFrame(() => prv.style.opacity = '1');
        }

        _hdlImgPrvHide() {
            if (!this._prvPop) return;
            this._prvPop.style.opacity = '0';
            setTimeout(() => {
                if (this._prvPop && this._prvPop.style.opacity === '0') {
                    this._prvPop.style.display = 'none';
                }
            }, 200);
        }

        _hdlNetFlt(evt) {
            if (!this._pop) return;
            const f = evt.target.value.toLowerCase();
            const nc = this._pop.querySelector(this._cfg.selectors.network);
            if (!nc) return;
            nc.querySelectorAll('.aio-network-item').forEach(itm => {
                const ue = itm.querySelector('.aio-network-url');
                const u = ue ? (ue.title || ue.textContent).toLowerCase() : '';
                itm.style.display = u.includes(f) ? 'block' : 'none';
            });
        }

        _hdlImgFlt(evt) {
            if (!this._pop) return;
            const f = evt.target.value.toLowerCase();
            const ic = this._pop.querySelector(this._cfg.selectors.image);
            if (!ic) return;
            ic.querySelectorAll('.aio-image-item').forEach(itm => {
                const s = itm.dataset.src ? itm.dataset.src.toLowerCase() : '';
                itm.style.display = s.includes(f) ? 'flex' : 'none';
            });
        }

        // --- State Management & SPA Handling ---

        _svSt(isOpen) {
            try {
                sessionStorage.setItem(this._SK, JSON.stringify({
                    isOpen
                }));
            } catch (e) {
                console.warn("AIO Scanner: Failed to save state to sessionStorage.", e);
            }
        }

        _ldSt() {
            try {
                const st = sessionStorage.getItem(this._SK);
                return st ? JSON.parse(st) : {
                    isOpen: false
                };
            } catch (e) {
                console.warn("AIO Scanner: Failed to load state from sessionStorage. Resetting.", e);
                sessionStorage.removeItem(this._SK);
                return {
                    isOpen: false
                };
            }
        }

        _chkStUI() {
            if (!this._pop || !this._tglBtn) {
                this._ensureUI();
                return;
            }
            const st = this._ldSt();
            const shouldVis = st.isOpen;
            const isVis = this._pop.classList.contains('aio-visible');

            if (shouldVis && !isVis) {
                this._showPop();
            } else if (!shouldVis && isVis) {
                this._hidePop();
            } else if (!shouldVis && !isVis) {
                this._pop.style.display = 'none';
                this._tglBtn.style.display = 'block';
                if (this._prvPop) {
                    this._prvPop.style.display = 'none';
                    this._prvPop.style.opacity = '0';
                }
            }
        }

        _listenSPA() {
            if (window.aioScannerNavLstnr) return;

            const navHdl = () => {
                this._ensureUI();
                setTimeout(() => this._chkStUI(), 50);
                setTimeout(() => this._scanIfNeed(), 150);
            };

            window.addEventListener('popstate', navHdl);
            window.addEventListener('hashchange', navHdl);

            const self = this;

            function wrapHist(m) {
                const orig = history[m];
                if (!orig) return;
                try {
                    history[m] = function(st, t, u) {
                        let res;
                        try {
                            res = orig.apply(this, arguments);
                        } catch (e) {
                            console.error(`AIO Scanner: Error in original history.${m}`, e);
                            throw e;
                        }
                        try {
                            const evt = new CustomEvent('historystatechange', {
                                detail: {
                                    url: u,
                                    state: st,
                                    title: t,
                                    method: m
                                }
                            });
                            window.dispatchEvent(evt);
                        } catch (e) {
                            console.warn("AIO Scanner: CustomEvent dispatch failed, using direct handler.", e);
                            navHdl();
                        }
                        return res;
                    };
                } catch (e) {
                    console.error(`AIO Scanner: Failed to wrap history.${m}`, e);
                }
            }

            wrapHist('pushState');
            wrapHist('replaceState');
            window.addEventListener('historystatechange', navHdl);

            window.aioScannerNavLstnr = true;
            console.log("AIO Scanner (Short): SPA Navigation listener attached.");
        }

        _scanIfNeed() {
            const popEl = document.getElementById(this._P_ID);
            if (popEl ?.classList.contains('aio-visible')) {
                this._scanAll();
            }
        }

        _tglPop() {
            if (!this._pop) {
                this._ensureUI();
                return;
            }
            const isVis = this._pop.classList.contains('aio-visible');
            if (isVis) {
                this._hidePop();
            } else {
                this._showPop();
                this._scanAll();
            }
        }

        _showPop() {
            if (!this._pop || !this._tglBtn) {
                this._ensureUI();
                return;
            }
            this._pop.style.display = 'block';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (this._pop) this._pop.classList.add('aio-visible');
                });
            });
            this._tglBtn.style.display = 'none';
            this._svSt(true);
        }

        _hidePop() {
            if (!this._pop || !this._tglBtn) {
                this._ensureUI();
                return;
            }
            this._pop.classList.remove('aio-visible');
            setTimeout(() => {
                if (this._pop) this._pop.style.display = 'none';
                if (this._prvPop) {
                    this._prvPop.style.display = 'none';
                    this._prvPop.style.opacity = '0';
                }
                if (this._tglBtn) this._tglBtn.style.display = 'block';
            }, 200);
            this._svSt(false);
        }

        _obsDOM() {
            if (this._obs) {
                this._obs.disconnect();
            }
            if (!document.body) {
                console.warn("AIO Scanner: Cannot observe DOM, document.body not ready.");
                return;
            }

            try {
                this._obs = new MutationObserver(muts => {
                    let changed = false;
                    let removed = false;
                    for (const m of muts) {
                        if (m.type === 'childList') {
                            if (m.addedNodes.length > 0) {
                                changed = true;
                                m.addedNodes.forEach(n => {
                                    if (n.nodeType === Node.ELEMENT_NODE) {
                                        this._scanElStrms(n);
                                    }
                                });
                            }
                            if (m.removedNodes.length > 0) {
                                for (const n of m.removedNodes) {
                                    if (n.id === this._P_ID || n.id === this._T_ID || n.id === this._PR_ID) {
                                        removed = true;
                                        break;
                                    }
                                }
                            }
                        } else if (m.type === 'attributes') {
                            changed = true;
                            const tgt = m.target;
                            const attr = m.attributeName;
                            if (tgt && attr) {
                                const val = tgt.getAttribute(attr);
                                if (typeof val === 'string' && ['src', 'href', 'data', 'data-src', 'data-url', 'style'].includes(attr.toLowerCase())) {
                                    if (attr.toLowerCase() === 'style') {
                                        this._debScanAll();
                                    } else {
                                        this._hdlStrmUrl(val, `mutAttr-${attr}`);
                                    }
                                }
                            }
                        }
                        if (removed) break;
                    }

                    if (removed) {
                        console.warn("AIO Scanner: UI element removed, attempting to re-initialize.");
                        this._ensureUI();
                    } else {
                        this._debEnsureUI();
                    }
                });

                this._obs.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['src', 'style', 'data-src', 'data-url', 'href', 'data']
                });
            } catch (e) {
                console.error("AIO Scanner: Failed to create or attach MutationObserver.", e);
            }
        }

        _ensureUI() {
            const tglMiss = !document.getElementById(this._T_ID);
            const popMiss = !document.getElementById(this._P_ID);
            const prvMiss = !document.getElementById(this._PR_ID);

            if (tglMiss || popMiss || prvMiss) {
                console.log("AIO Scanner: UI element missing, re-initializing UI.");
                this._initd = false;
                this._initUIObs();
                this._chkStUI();
            }
        }

        /* ==========================================================================
           Scanning Logic
           ========================================================================== */

        _scanAll() {
            const now = Date.now();
            if (this._lastScanTime && (now - this._lastScanTime < 200)) {
                return;
            }
            this._lastScanTime = now;

            try {
                this._scanVidSrc();
                this._scanIfr();
                this._updNetDisp();
                this._scanImgs();
                this._scanInline();
            } catch (err) {
                console.error("AIO Scanner: Error during full scan:", err);
            }
        }

        _scanVidSrc() {
            try {
                document.querySelectorAll(
                    'video, source, track, object, embed, a, [data-src], [data-url], [data-stream-url], [data-hls-url], [data-mp4-url]'
                ).forEach(el => {
                    const urls = [
                        el.src,
                        el.currentSrc,
                        el.href,
                        el.data,
                        el.dataset ?.src,
                        el.dataset ?.url,
                        el.getAttribute('data-stream-url'),
                        el.getAttribute('data-hls-url'),
                        el.getAttribute('data-mp4-url')
                    ].filter(Boolean);

                    urls.forEach(u => {
                        if (typeof u === 'string') {
                            this._hdlStrmUrl(u, `tag-${el.tagName.toLowerCase()}`);
                        }
                    });

                    if (el.tagName === 'TRACK' && el.default && el.src) {
                        this._hdlStrmUrl(el.src, 'tag-track-default');
                    }
                });
            } catch (err) {
                console.error("AIO Scanner: Error scanning video/source elements:", err);
            }
        }

        _isPotStrmUrl(u) {
            if (typeof u !== 'string') return false;
            const lu = u.toLowerCase();
            const cu = lu.split(/[?#]/)[0];

            if (/\.(m3u8|mp4|vtt|srt|mpd)$/i.test(cu)) return true;
            if (/\/hls\/|\/dash\/|\/manifest\/|\/playlist\.m3u8|\/master\.m3u8|\/video\.mp4|\.mpd/i.test(lu)) return true;
            if (/[?&](format|type|ext)=(m3u8|mp4|vtt|srt|mpd)/i.test(lu)) return true;
            if (lu.startsWith('blob:')) return true;

            return false;
        }

        _detStrmTyp(u, m = null) {
            if (typeof u !== 'string') return null;
            const lu = u.toLowerCase();

            if (m) {
                const lm = m.toLowerCase().split(';')[0].trim();
                if (this._STRM_MIME[lm]) {
                    return this._STRM_MIME[lm];
                }
            }

            for (const t of [...this._cfg.linkTypes, 'mpd']) {
                if (lu.includes(`.${t}`)) {
                    return t;
                }
            }

            if (lu.includes('m3u8') || lu.includes('/hls/') || lu.includes('/manifest/')) return 'm3u8';
            if (lu.includes('.mpd') || lu.includes('/dash/')) return 'mpd';
            if (lu.includes('mp4') || lu.includes('/video/')) return 'mp4';
            if (lu.includes('vtt') || lu.includes('/caption')) return 'vtt';
            if (lu.includes('srt') || lu.includes('/subtitle')) return 'srt';
            if (lu.startsWith('blob:')) return 'mp4';

            return null;
        }

        _hdlStrmUrl(u, srcT = 'unknown', m = null) {
            if (typeof u !== 'string' || u.trim() === '' || u.startsWith('javascript:')) {
                return;
            }
            const absU = this._absUrl(u);
            if (!absU) return;

            if (!this._isPotStrmUrl(absU)) {
                return;
            }

            const type = this._detStrmTyp(absU, m);
            if (!type || !this._cfg.linkTypes.includes(type)) {
                return;
            }

            const clnU = this._clnUrl(absU);
            if (!this._urls.has(clnU)) {
                this._urls.add(clnU);
                this._addStrmLnk(type, absU);
            }
        }

        _scanInline() {
            try {
                document.querySelectorAll('script').forEach(scr => {
                    if (!scr.hasAttribute('src') && scr.textContent) {
                        const cont = scr.textContent;
                        let m;
                        this._RGX_STRM.lastIndex = 0;
                        while ((m = this._RGX_STRM.exec(cont)) !== null) {
                            const fUrl = m[1] || m[3];
                            if (fUrl) {
                                this._hdlStrmUrl(fUrl, 'script');
                            }
                        }
                    }
                });
            } catch (err) {
                console.error("AIO Scanner: Error scanning inline scripts:", err);
            }
        }

        _monBlob() {
            if (window.aioBlobMon || typeof URL === 'undefined' || !URL.createObjectURL) return;

            const self = this;
            const origC = URL.createObjectURL;

            try {
                URL.createObjectURL = function(obj) {
                    const res = origC.apply(this, arguments);
                    if (obj instanceof Blob && obj.type) {
                        const lt = obj.type.toLowerCase();
                        const st = Object.entries(self._STRM_MIME).find(([m]) => lt.startsWith(m)) ?. [1];
                        if (st) {
                            // Blob found, potentially useful for debugging, but rely on src assignment
                        }
                    }
                    return res;
                };
                window.aioBlobMon = true;
                console.log("AIO Scanner (Short): Blob URL monitor attached.");
            } catch (err) {
                console.error("AIO Scanner: Failed to monitor Blob URLs, reverting.", err);
                URL.createObjectURL = origC;
            }
        }

        _scanElStrms(el) {
            if (!el || typeof el.querySelectorAll !== 'function') return;

            try {
                const urlsS = [
                    el.src,
                    el.href,
                    el.data,
                    el.dataset ?.src,
                    el.dataset ?.url,
                    el.getAttribute('data-stream-url')
                ].filter(Boolean);
                urlsS.forEach(u => this._hdlStrmUrl(u, `added-${el.tagName.toLowerCase()}`));

                el.querySelectorAll(
                    'video, source, track, object, embed, a, [data-src], [data-url], [data-stream-url]'
                ).forEach(ch => {
                    const urlsC = [
                        ch.src,
                        ch.currentSrc,
                        ch.href,
                        ch.data,
                        ch.dataset ?.src,
                        ch.dataset ?.url,
                        ch.getAttribute('data-stream-url')
                    ].filter(Boolean);
                    urlsC.forEach(u => this._hdlStrmUrl(u, `added-child-${ch.tagName.toLowerCase()}`));
                    if (ch.tagName === 'TRACK' && ch.default && ch.src) {
                        this._hdlStrmUrl(ch.src, 'added-track-default');
                    }
                });
            } catch (err) {
                console.error("AIO Scanner: Error scanning added element streams:", err);
            }
        }

        _scanIfr() {
            try {
                const ifrs = Array.from(document.getElementsByTagName('iframe'));
                const ifrInfos = ifrs.map(ifr => this._extIfrInf(ifr));

                const embs = Array.from(document.getElementsByTagName('embed'));
                const objs = Array.from(document.getElementsByTagName('object'));
                const frms = Array.from(document.getElementsByTagName('frame'));

                const addSrcs = [...embs, ...objs, ...frms]
                    .map(el => ({
                        src: el.src || el.data,
                        type: el.tagName.toLowerCase(),
                        attributes: []
                    }))
                    .filter(inf => inf.src);

                const allSrcs = [...ifrInfos, ...addSrcs]
                    .map(inf => ({ ...inf,
                        src: this._absUrl(inf.src)
                    }))
                    .filter(inf => inf.src && !inf.src.startsWith('about:blank') && !inf.src.startsWith('javascript:'));

                const uniqSrcs = Array.from(new Map(allSrcs.map(itm => [itm.src, itm])).values());

                const cont = this._pop ?.querySelector(this._cfg.selectors.iframe);
                if (cont) {
                    cont.innerHTML = uniqSrcs.length > 0 ?
                        this._genIfrList(uniqSrcs) :
                        this._genEmpty('iframes');
                }
            } catch (err) {
                console.error("AIO Scanner: Error scanning iframes/embeds:", err);
            }
        }

        _extIfrInf(ifr) {
            let s = ifr.src || ifr.dataset.src;
            let t = ifr.src ? 'direct' : (ifr.dataset.src ? 'lazy' : 'unknown');
            if (!s && ifr.srcdoc) {
                s = 'srcdoc';
                t = 'srcdoc';
            }
            const a = [];
            if (ifr.allow) a.push('allow: ' + ifr.allow.substring(0, 30) + (ifr.allow.length > 30 ? '...' : ''));
            if (ifr.sandbox) a.push('sandbox');
            if (ifr.loading) a.push('loading: ' + ifr.loading);
            if (ifr.name) a.push('name: ' + ifr.name);
            if (ifr.width || ifr.height) a.push(`size: ${ifr.width || '?'}x${ifr.height || '?'}`);

            return {
                src: s || '',
                type: t,
                attributes: a
            };
        }

        _scanImgs() {
            try {
                const imgs = Array.from(document.querySelectorAll('img'));
                const imgInfos = imgs
                    .map(img => this._extImgInf(img))
                    .filter(inf => inf.src && !inf.src.startsWith('data:'));

                const els = document.getElementsByTagName('*');
                const bgImgs = Array.from(els)
                    .map(el => {
                        try {
                            const st = window.getComputedStyle(el);
                            if (!st || !st.backgroundImage || st.backgroundImage === 'none') {
                                return [];
                            }
                            const urls = (st.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/g) || [])
                                .map(m => m.replace(/url\(['"]?(.*?)['"]?\)/g, '$1'))
                                .filter(u => u && !u.startsWith('data:'));

                            return urls.map(u => ({
                                src: this._absUrl(u),
                                type: 'bg',
                                attributes: [`el: ${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className && typeof el.className ==='string' ? '.' + el.className.split(' ').filter(Boolean).join('.') : ''}`]
                            }));
                        } catch (e) {
                            return [];
                        }
                    })
                    .flat()
                    .filter(Boolean);

                const combSrcs = [...imgInfos, ...bgImgs];

                const uniqSrcs = Array.from(new Map(combSrcs.map(itm => [itm.src, itm])).values())
                    .filter(itm => itm.src);

                const cont = this._pop ?.querySelector(this._cfg.selectors.image);
                if (cont) {
                    cont.innerHTML = uniqSrcs.length > 0 ?
                        this._genImgList(uniqSrcs) :
                        this._genEmpty('images');
                    if (this._imgFltIn) {
                        this._hdlImgFlt({
                            target: this._imgFltIn
                        });
                    }
                }
            } catch (err) {
                console.error("AIO Scanner: Error scanning images:", err);
            }
        }

        _extImgInf(img) {
            const s = img.currentSrc || img.src;
            const a = [];
            if (img.alt) a.push(`alt: ${img.alt.substring(0, 30)}${img.alt.length > 30 ? '...' : ''}`);
            if (img.naturalWidth > 0 || img.naturalHeight > 0) {
                a.push(`actual: ${img.naturalWidth}x${img.naturalHeight}`);
            } else if (img.width || img.height) {
                a.push(`attr: ${img.width}x${img.height}`);
            }
            if (img.loading) a.push(`loading: ${img.loading}`);
            if (img.srcset) a.push('srcset');

            const absS = this._absUrl(s);
            const ext = absS ?.split('.').pop().split(/[#?]/)[0];
            if (ext) a.push(ext.toLowerCase());

            return {
                src: absS,
                type: 'img',
                attributes: a
            };
        }

        /* ==========================================================================
           Network Monitoring
           ========================================================================== */

        _setupNetMon() {
            if (window.aioNetMon) return;

            const self = this;

            try {
                const oF = window.fetch;
                window.fetch = async function(...args) {
                    const req = args[0];
                    const opts = args[1] || {};
                    const u = typeof req === 'string' ? req : req ?.url;
                    const m = opts.method || (typeof req === 'object' ? req ?.method : 'GET') || 'GET';
                    const sT = Date.now();
                    let pld = null;

                    try {
                        if (opts.body) {
                            pld = typeof opts.body === 'string' ? opts.body : '[Non-String Body]';
                        } else if (req instanceof Request && req.body) {
                            pld = await req.clone().text().catch(() => '[Stream Body]');
                        }
                    } catch (payloadError) {
                        pld = '[Error Reading Body]';
                        console.warn("AIO Scanner: Error reading fetch request body:", payloadError);
                    }

                    self._hdlStrmUrl(u, 'net-fetch-req');

                    try {
                        const res = await oF.apply(this, args);
                        const eT = Date.now();
                        const ct = res.headers.get('Content-Type');

                        if (ct) {
                            self._hdlStrmUrl(u, 'net-fetch-resp', ct);
                        }

                        self._addNetReq({
                            url: self._absUrl(u),
                            method: m.toUpperCase(),
                            status: res.status,
                            duration: eT - sT,
                            payload: pld,
                            headers: self._hdrsToObj(res.headers),
                            timestamp: new Date().toISOString(),
                            type: 'fetch'
                        });
                        return res;
                    } catch (err) {
                        self._addNetReq({
                            url: self._absUrl(u),
                            method: m.toUpperCase(),
                            status: 'ERROR',
                            error: err.message || String(err),
                            payload: pld,
                            timestamp: new Date().toISOString(),
                            type: 'fetch'
                        });
                        throw err;
                    }
                };
            } catch (e) {
                console.error("AIO Scanner: Failed to patch window.fetch.", e);
            }

            try {
                const X = XMLHttpRequest.prototype;
                const oO = X.open;
                const oS = X.send;
                if (!oO || !oS) throw new Error("XHR methods missing");

                X.open = function(m, u) {
                    this._reqURL = self._absUrl(u);
                    this._reqMeth = m;
                    this._startT = Date.now();
                    self._hdlStrmUrl(this._reqURL, 'net-xhr-req');
                    oO.apply(this, arguments);
                };

                X.send = function(b) {
                    if (this._aioLdLstnr) {
                        this.removeEventListener('loadend', this._aioLdLstnr);
                    }

                    this._aioLdLstnr = () => {
                        const eT = Date.now();
                        let sP = null;

                        if (b) {
                            try {
                                if (b instanceof Document) sP = '[Document Payload]';
                                else if (b instanceof Blob) sP = `[Blob Payload: ${b.type}, Size: ${b.size}]`;
                                else if (b instanceof ArrayBuffer) sP = `[ArrayBuffer Payload: ${b.byteLength} bytes]`;
                                else if (b instanceof FormData) sP = '[FormData Payload]';
                                else if (typeof b === 'string') sP = b.substring(0, 5000) + (b.length > 5000 ? '...' : '');
                                else sP = '[Unknown Payload Type]';
                            } catch (e) {
                                sP = '[Error Reading Payload]';
                                console.warn("AIO Scanner: Error reading XHR send payload:", e);
                            }
                        }

                        const ct = this.getResponseHeader('Content-Type');
                        if (ct) {
                            self._hdlStrmUrl(this._reqURL, 'net-xhr-resp', ct);
                        }

                        self._addNetReq({
                            url: this._reqURL,
                            method: (this._reqMeth || 'GET').toUpperCase(),
                            status: this.status,
                            duration: eT - (this._startT || eT),
                            payload: sP,
                            headers: self._parseHdrs(this.getAllResponseHeaders()),
                            timestamp: new Date().toISOString(),
                            type: 'xhr',
                            error: (this.status < 200 || this.status >= 400) ? `HTTP ${this.status}` : (this.status === 0 && !this.response ? 'Network Error' : null)
                        });
                    };

                    this.addEventListener('loadend', this._aioLdLstnr);
                    oS.apply(this, arguments);
                };
            } catch (e) {
                console.error("AIO Scanner: Failed to patch XMLHttpRequest.", e);
            }

            window.aioNetMon = true;
            console.log("AIO Scanner (Short): Network monitoring (fetch/XHR) attached.");
        }

        _addNetReq(req) {
            if (!req || !req.url || req.url.startsWith('data:') ||
                req.url.startsWith('chrome-extension:') || req.url.startsWith('moz-extension:')) {
                return;
            }
            this._reqs.unshift(req);
            if (this._reqs.length > this._maxR) {
                this._reqs.pop();
            }
            if (this._pop ?.classList.contains('aio-visible')) {
                this._updNetDisp();
            }
        }

        _updNetDisp() {
            const cont = this._pop ?.querySelector(this._cfg.selectors.network);
            if (!cont) return;

            let list = cont.querySelector('.aio-list');
            const es = cont.querySelector('.aio-empty');

            if (this._reqs.length === 0) {
                if (!es) {
                    cont.innerHTML = this._genEmpty('network requests');
                }
                if (list) list.innerHTML = '';
                return;
            } else {
                if (!list) list = this._mkList(cont);
                if (es) es.remove();
            }

            const existingKeys = new Set(Array.from(list.children).map(li => li.dataset.requestKey));
            let added = 0;

            for (let i = 0; i < this._reqs.length; i++) {
                const r = this._reqs[i];
                const key = `${r.url}_${r.timestamp}`;
                if (!existingKeys.has(key)) {
                    const ni = this._mkNetLi(r, i, key);
                    list.prepend(ni);
                    added++;
                }
            }

            const curCnt = list.children.length;
            if (curCnt > this._maxR + 10) {
                while (list.children.length > this._maxR) {
                    list.removeChild(list.lastChild);
                }
            }

            if (added > 0 || !this._netFiltApp) {
                if (this._netFltIn) {
                    this._hdlNetFlt({
                        target: this._netFltIn
                    });
                    this._netFiltApp = true;
                }
            }
        }

        _mkNetLi(r, i, key) {
            const li = document.createElement('li');
            li.className = 'aio-item aio-network-item';
            li.dataset.requestKey = key;
            li.dataset.url = r.url;

            const methodClass = r.status === 'ERROR' || r.status >= 400 ?
                'error' :
                r.method.toLowerCase();
            const statusColor = r.status >= 400 || r.status === 'ERROR' ? '#ff8a8a' : '#a6e22e';
            const statusText = `${r.status}${r.error ? ` (${r.error.substring(0,30)}...)` : ''}`;

            li.innerHTML = `
                <div>
                    <span class="aio-network-method aio-network-method-${methodClass}">${r.method}</span>
                    <span class="aio-network-url" title="${r.url}">${this._truncUrl(r.url)}</span>
                </div>
                <div class="aio-network-details">
                    <span>Status: <strong style="color: ${statusColor}">${statusText}</strong></span>
                    ${r.duration !== undefined ? `<span>${r.duration}ms</span>` : ''}
                    <span>${new Date(r.timestamp).toLocaleTimeString()}</span>
                    <div class="aio-network-controls">
                        ${r.payload ? `<button class="aio-network-show-payload" data-index="${i}" title="Show/Hide Request Payload">Payload</button>` : ''}
                        <button class="aio-network-copy" data-index="${i}" title="Copy URL">Copy URL</button>
                    </div>
                </div>
                ${r.payload ? `
                    <div class="aio-network-payload" id="payload-${i}">
                        <pre><code>${this._escHtml(r.payload.substring(0, 5000))} ${r.payload.length > 5000 ? '...' : ''}</code></pre>
                    </div>` : ''}
            `;
            return li;
        }


        /* ==========================================================================
           UI Updates & List Generation
           ========================================================================== */

        _addStrmLnk(type, url) {
            const cont = this._pop ?.querySelector(`#${type}-content`);
            if (!cont) return;

            const list = cont.querySelector('.aio-list') || this._mkList(cont);
            const es = cont.querySelector('.aio-empty');
            if (es) es.remove();

            const li = document.createElement('li');
            li.className = 'aio-item aio-link';
            li.dataset.url = url;
            li.title = `Click to copy: ${url}`;
            li.innerHTML = `
                <span class="aio-item-source">${this._truncUrl(url)}</span>
                <div class="aio-item-info">
                    <span class="timestamp">Detected: ${new Date().toLocaleTimeString()}</span>
                </div>
            `;
            list.prepend(li);
        }

        _genIfrList(srcs) {
            return `<ul class="aio-list">${srcs.map(inf => `
                <li class="aio-item aio-iframe-item" data-src="${this._escHtml(inf.src)}" title="Click to copy source: ${inf.src}">
                    <span class="aio-item-source" title="${inf.src}">${this._truncUrl(inf.src)}</span>
                    <div class="aio-item-info">
                        <span class="aio-item-tag">${inf.type}</span>
                        ${inf.attributes.map(a => `<span class="aio-item-tag" title="${a}">${a.substring(0, 40)}${a.length > 40 ? '...' : ''}</span>`).join('')}
                    </div>
                </li>`).join('')}</ul>`;
        }

        _genImgList(srcs) {
            return `<ul class="aio-list">${srcs.map((inf, i) => `
                <li class="aio-item aio-image-item" data-src="${inf.src}">
                    <span class="aio-item-source aio-image-truncated" title="${inf.src}">${this._truncUrl(inf.src)}</span>
                    <div class="aio-item-info">
                        <span class="aio-item-tag">${inf.type}</span>
                        ${inf.attributes.map(a => `<span class="aio-item-tag" title="${a}">${a.substring(0, 40)}${a.length > 40 ? '...' : ''}</span>`).join('')}
                        <div class="aio-image-button-group">
                            <button class="aio-image-copy" data-index="${i}" title="Copy Image URL">Copy</button>
                            <button class="aio-image-view" data-index="${i}" title="Open Image in New Tab">View</button>
                            <button class="aio-image-download" data-index="${i}" title="Download Image">Download</button>
                        </div>
                    </div>
                </li>`).join('')}</ul>`;
        }

        _genEmpty(type) {
            return `<div class="aio-empty">No ${type} found yet...</div>`;
        }

        _mkList(cont) {
            const list = document.createElement('ul');
            list.className = 'aio-list';
            cont.innerHTML = '';
            cont.appendChild(list);
            return list;
        }

        _clrAll() {
            if (!this._pop) {
                this._ensureUI();
                return;
            }
            console.log("AIO Scanner: Clearing all data.");

            this._cfg.linkTypes.forEach(t => {
                const c = this._pop.querySelector(`#${t}-content`);
                if (c) c.innerHTML = `<div class="aio-empty">No ${t.toUpperCase()} files detected yet...</div>`;
            });

            const sels = [this._cfg.selectors.iframe, this._cfg.selectors.network, this._cfg.selectors.image];
            const types = ['iframes', 'network requests', 'images'];
            sels.forEach((sel, i) => {
                const c = this._pop.querySelector(sel);
                if (c) c.innerHTML = this._genEmpty(types[i]);
            });

            this._urls.clear();
            this._reqs = [];

            if (this._netFltIn) this._netFltIn.value = '';
            if (this._imgFltIn) this._imgFltIn.value = '';
            this._netFiltApp = false;
        }


        /* ==========================================================================
           Utility Helpers
           ========================================================================== */

        _absUrl(u) {
            if (typeof u !== 'string') return null;
            if (u.startsWith('http:') || u.startsWith('https:') || u.startsWith('//') ||
                u.startsWith('data:') || u.startsWith('blob:') || u.startsWith('about:')) {
                return u;
            }
            try {
                if (u.startsWith('//')) {
                    return window.location.protocol + u;
                }
                return new URL(u, document.baseURI).href;
            } catch (e) {
                return null;
            }
        }

        _clnUrl(u) {
            if (typeof u !== 'string') return '';
            return u.split(/[?#]/)[0];
        }

        _truncUrl(u, maxL = this._maxUrlLen) {
            if (typeof u !== 'string' || u.length <= maxL) {
                return u || '';
            }

            try {
                const uo = new URL(u);
                const o = uo.origin;
                const p = uo.pathname;
                const s = uo.search ? '?...' : '';
                const h = uo.hash ? '#...' : '';

                const lo = o.length;
                const ls = s.length;
                const lh = h.length;
                const availP = maxL - lo - ls - lh - 5;

                if (availP <= 5) {
                    if (lo + ls + lh > maxL) {
                        return o.substring(0, maxL - 3) + '...';
                    }
                    return o + '/...' + s + h;
                }

                const segs = p.split('/').filter(Boolean);
                const fname = segs.pop() || '';

                if (fname.length >= availP) {
                    const half = Math.floor(availP / 2) - 1;
                    if (half > 0) {
                        const truncF = fname.substring(0, half) + '...' + fname.substring(fname.length - half);
                        return `${o}/.../${truncF}${s}${h}`;
                    } else {
                        return `${o}/.../...${s}${h}`;
                    }
                } else {
                    let truncP = fname;
                    let curLen = fname.length;
                    while (segs.length > 0) {
                        const next = segs.pop();
                        if (curLen + next.length + 1 <= availP) {
                            truncP = next + '/' + truncP;
                            curLen += next.length + 1;
                        } else {
                            break;
                        }
                    }
                    return `${o}/${segs.length > 0 ? '.../' : ''}${truncP}${s}${h}`;
                }
            } catch (e) {
                const half = Math.floor(maxL / 2) - 2;
                if (half <= 0) return u.substring(0, maxL - 3) + '...';
                const start = u.substring(0, half);
                const end = u.substring(u.length - half);
                return `${start}...${end}`;
            }
        }

        async _cpClip(txt) {
            if (!txt) return false;
            let ok = false;
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(txt);
                    ok = true;
                } else {
                    ok = this._cpFb(txt);
                }
            } catch (err) {
                console.warn("AIO Scanner: Clipboard write failed, trying fallback.", err);
                ok = this._cpFb(txt);
            }
            return ok;
        }

        _cpFb(txt) {
            const ta = document.createElement('textarea');
            ta.value = txt;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            ta.style.top = '0px';
            ta.setAttribute('readonly', '');
            document.body.appendChild(ta);
            let ok = false;
            try {
                ta.select();
                ta.setSelectionRange(0, ta.value.length);
                ok = document.execCommand('copy');
            } catch (err) {
                console.error("AIO Scanner: Fallback copy (execCommand) failed.", err);
            }
            document.body.removeChild(ta);
            return ok;
        }

        async _cpHlp(txt, el) {
            const ok = await this._cpClip(txt);
            this._flashItm(el, ok);
        }

        _flashItm(el, ok) {
            if (!el || typeof el.style === 'undefined') return;
            const oBg = el.style.backgroundColor;
            const oBd = el.style.borderColor;
            el.style.transition = 'background-color 0.1s ease, border-color 0.1s ease';
            if (ok) {
                el.style.backgroundColor = 'rgba(50, 205, 50, 0.3)';
                el.style.borderColor = 'rgba(50, 205, 50, 0.5)';
            } else {
                el.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
                el.style.borderColor = 'rgba(255, 0, 0, 0.5)';
            }
            setTimeout(() => {
                if (el) {
                    el.style.transition = '';
                    el.style.backgroundColor = oBg;
                    el.style.borderColor = oBd;
                }
            }, 600);
        }

        _flashBtn(btn, ok, okTxt, origTxt) {
            if (!btn) return;
            const oCont = origTxt || btn.textContent;
            btn.disabled = true;
            btn.classList.remove('copied');

            if (ok) {
                btn.textContent = okTxt;
                btn.classList.add('copied');
            } else {
                btn.textContent = 'Error';
            }

            setTimeout(() => {
                if (btn) {
                    btn.textContent = oCont;
                    btn.classList.remove('copied');
                    btn.disabled = false;
                }
            }, 1500);
        }

        _dbnc(fn, wait) {
            let t;
            return (...args) => {
                clearTimeout(t);
                t = setTimeout(() => {
                    try {
                        fn.apply(this, args)
                    } catch (e) {
                        console.error("AIO Scanner: Error in debounced function:", e);
                    }
                }, wait);
            };
        }

        _monSetAttr() {
            if (window.aioSetAttrMon) return;
            try {
                const oS = Element.prototype.setAttribute;
                Element.prototype.setAttribute = function(n, v) {
                    const r = oS.apply(this, arguments);
                    if ((n === 'src' || n === 'style' || n.startsWith('data-')) &&
                        typeof v === 'string' && window.allInOneScanner) {
                        window.allInOneScanner._debScanAll();
                    }
                    return r;
                };
                window.aioSetAttrMon = true;
                console.log("AIO Scanner (Short): setAttribute monitor attached.");
            } catch (err) {
                console.error("AIO Scanner: Failed to monitor setAttribute.", err);
            }
        }

        _hdrsToObj(h) {
            const o = {};
            if (h && typeof h.forEach === 'function') {
                try {
                    h.forEach((v, k) => {
                        o[k] = v;
                    });
                } catch (e) {
                    console.warn("AIO Scanner: Error converting Headers object:", e);
                }
            }
            return o;
        }

        _parseHdrs(hStr) {
            const h = {};
            if (!hStr) return h;
            try {
                const ps = hStr.trim().split(/[\r\n]+/);
                for (const p of ps) {
                    const i = p.indexOf(':');
                    if (i > 0) {
                        const k = p.substring(0, i).trim().toLowerCase();
                        const v = p.substring(i + 1).trim();
                        if (h[k]) {
                            if (Array.isArray(h[k])) {
                                h[k].push(v);
                            } else {
                                h[k] = [h[k], v];
                            }
                        } else {
                            h[k] = v;
                        }
                    }
                }
            } catch (e) {
                console.warn("AIO Scanner: Error parsing header string:", e);
            }
            return h;
        }

        _escHtml(u) {
            if (!u || typeof u !== 'string') return String(u);
            return u.replace(/&/g, "&")
                .replace(/</g, "<")
                .replace(/>/g, ">")
                .replace(/"/g, '"')
                .replace(/'/g, "'");
        }

        async _dlImg(u, fn) {
            try {
                const r = await fetch(u, {
                    mode: 'cors',
                    credentials: 'omit'
                });
                if (!r.ok) throw new Error(`Fetch failed: ${r.status} ${r.statusText}`);
                const b = await r.blob();

                const bU = URL.createObjectURL(b);

                const a = document.createElement('a');
                a.href = bU;
                a.download = fn || 'image';
                document.body.appendChild(a);
                a.click();

                setTimeout(() => {
                    if (document.body.contains(a)) {
                        document.body.removeChild(a);
                    }
                    URL.revokeObjectURL(bU);
                }, 100);

            } catch (err) {
                console.error(`AIO Scanner: Image download failed for ${u}. Error: ${err.message}. Trying fallback.`);
                try {
                    const nt = window.open(u, '_blank');
                    if (!nt) {
                        alert(`Cannot open image (popup blocker?). Copy URL manually.\n\nURL: ${u}`);
                    }
                } catch (openErr) {
                    alert(`Failed to download or open image.\nURL: ${u}\nError: ${err.message}`);
                }
            }
        }

    } // End of AioScanner class

    // --- Initialization ---
    if (!window.aioScannerInstanceShort) {
        const init = () => {
            if (!window.aioScannerInstanceShort && document.body) {
                try {
                    console.log("AIO Scanner (Short): Initializing...");
                    window.aioScannerInstanceShort = new AioScanner();
                } catch (err) {
                    console.error("AIO Scanner (Short): CRITICAL INITIALIZATION ERROR:", err);
                }
            } else if (!document.body) {
                // Wait for body
            } else {
                // Instance exists
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            setTimeout(init, 50);
        }
    }

})();