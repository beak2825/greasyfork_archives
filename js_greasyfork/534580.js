// ==UserScript==
// @name         StreamReaper 👾
// @namespace    https://greasyfork.org/en/users/781396-yad
// @version      1.3
// @description  Catching MPD/M3U8 streams like Pokémon
// @author       YAD
// @license      MIT
// @icon         https://iyad.ct.ws/images/cyberyadix.png
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534580/StreamReaper%20%F0%9F%91%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/534580/StreamReaper%20%F0%9F%91%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Constants ---
    const SCRIPT_ID = 'stream-reaper-v3-7';
    const IS_TOP_WINDOW = window === window.top;
    const MAX_LOG_ENTRIES = 200;
    const MINIMIZED_LOGO_URL = 'https://iyad.ct.ws/images/cyberyadix.png';

    // --- Storage ---
    const originalFetch = window.fetch;
    const originalXHR = window.XMLHttpRequest;
    const originalConsoleLog = console.log;
    const originalCreateObjectURL = window.URL.createObjectURL;
    const originalWebSocket = window.WebSocket;
    const originalAudio = window.Audio;
    let originalMediaSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');

    // --- Icons ---
    const ICONS = {
        copy: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.625-7.5-7.5m7.5 7.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm-7.5-7.5a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" /></svg>`,
        check: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>`,
        hls: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon hls"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.125 1.125 0 0 1 0 2.25H5.625a1.125 1.125 0 0 1 0-2.25Z" /></svg>`,
        dash: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon dash"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" /></svg>`,
        media: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon media"><path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 1.5c0 .621.504 1.125 1.125 1.125M1.125 12v1.5c0 .621.504 1.125 1.125 1.125m17.25 0h-7.5" /></svg>`,
        key: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon key"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" /></svg>`,
        info: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>`,
        minimize: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="icon"><path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" /></svg>`,
        stop: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="icon text-red"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd" /></svg>`,
        play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="icon text-green"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>`,
        toggleOn: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="icon text-green"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>`,
        toggleOff: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="icon text-gray"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>`,
        clear: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.576 0a48.108 48.108 0 0 1-3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`,
        logo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon"><path d="M18.3,5.38v7.1l-3.12-3.12h-2.22l-3.21-3.21v-2.59h-3.3v2.86h1.25l3.12,3.12H3.23L.07,6.43h3.25v-2.77l-.02-.02s-.88-.88-1.71-1.71C.95,1.28.33.67.11.44h6.43l3.21,3.09V0l4.8,4.77h-1.67v1.58h2.31V2.26l3.12,3.12ZM7.51,10.88l4.34,4.41v-1.29h2.84v3.16h-5.42l3.12,3.12h5.42v-6.06l-3.34-3.34h-6.96ZM0,10.88v3.98l3.12,3.12v-4.09h2.31v1.58h-1.67l4.8,4.77v-6.13l-3.34-3.24H0Z"/></svg>`
    };

    // --- State ---
    let logSegments = false;
    let logMedia = false;
    let isVisible = false;
    let isIntercepting = true;
    let windowPos = { x: 20, y: 100 };
    let shadowRoot = null;
    let logWindow, minimizedBtn, logSection;
    let interceptToggleBtn, segmentToggleBtn, mediaToggleBtn, copyAllBtn;
    const loggedItems = IS_TOP_WINDOW ? new Map() : null;

    // --- Identification Logic ---
    function identifyItem(url, content = '', contentType = '', extra = {}) {
        const u = url.toLowerCase();
        const c = content.toLowerCase().substring(0, 5000);
        const t = contentType.toLowerCase();

        if (content && /[a-f0-9]{32}:[a-f0-9]{32}/i.test(content)) return { type: 'Key', icon: ICONS.key, isVital: true };

        // Segments
        if (t.includes('video/mp2t') || u.match(/\.ts(\?|$)/) || u.match(/\.m4s(\?|$)/) || u.includes('.init') || u.includes('segment') || u.includes('chunk')) {
            return { type: 'Segment', icon: ICONS.info, isVital: false };
        }

        // Manifests
        if (c.includes('#extm3u') || c.includes('#ext-x-stream-inf') || u.includes('.m3u8') || t.includes('mpegurl')) {
            return { type: 'HLS', icon: ICONS.hls, isVital: true };
        }
        if (c.includes('<mpd') || u.includes('.mpd') || t.includes('dash+xml')) {
            return { type: 'DASH', icon: ICONS.dash, isVital: true };
        }

        // Media
        if (extra.dest === 'audio' || extra.dest === 'video' ||
            t.includes('audio/') || t.includes('video/') ||
            u.includes('.mp4') || u.includes('.mp3') || u.includes('.aac') || u.includes('.ogg') ||
            u.startsWith('ws://') || u.startsWith('wss://') ||
            u.match(/(stream|live|radio|icecast|shoutcast)/i)) {
            return { type: 'Media', icon: ICONS.media, isVital: false };
        }

        return { type: 'Media', icon: ICONS.media, isVital: false };
    }

    // --- Interceptors ---
    function setupInterceptors() {
        const process = (url, method, type = '', content = '', extra = {}) => {
            if(!url || url.startsWith('data:')) return;
            const info = identifyItem(url, content, type, extra);

            if (info.isVital) {
                logItem(url, method, info.type, info.icon);
                return;
            }
            if (info.type === 'Segment' && logSegments) {
                logItem(url, method, info.type, info.icon);
                return;
            }
            if (info.type === 'Media' && logMedia) {
                logItem(url, method, info.type, info.icon);
                return;
            }
        };

        window.WebSocket = function(url, protocols) {
            if (isIntercepting) process(url, 'WebSocket');
            return new originalWebSocket(url, protocols);
        };
        window.WebSocket.prototype = originalWebSocket.prototype;

        window.Audio = function(url) {
            if (isIntercepting && url) process(url, 'New Audio()');
            return new originalAudio(url);
        };
        window.Audio.prototype = originalAudio.prototype;

        window.fetch = async function (...args) {
            if (!isIntercepting) return originalFetch.apply(this, args);
            let url = (args[0] instanceof Request) ? args[0].url : args[0];
            let dest = (args[0] instanceof Request) ? args[0].destination : '';
            try {
                const response = await originalFetch.apply(this, args);
                if (response.ok) {
                    const clone = response.clone();
                    const type = clone.headers.get('content-type') || '';
                    if (type.includes('text') || type.includes('json') || type.includes('xml') || type.includes('mpegurl') || type === '') {
                        clone.text().then(txt => process(url, 'Fetch', type, txt, { dest })).catch(()=>{});
                    } else {
                        process(url, 'Fetch', type, '', { dest });
                    }
                }
                return response;
            } catch (e) { throw e; }
        };

        window.XMLHttpRequest = function () {
            const xhr = new originalXHR();
            if (!isIntercepting) return xhr;
            const open = xhr.open;
            xhr.open = function (method, url) { this._url = url; open.apply(this, arguments); };
            xhr.addEventListener('load', () => {
                if (isIntercepting && this._url) {
                    const type = xhr.getResponseHeader('Content-Type') || '';
                    let content = '';
                    try { if (xhr.responseType === '' || xhr.responseType === 'text') content = xhr.responseText; } catch(e) {}
                    process(this._url, 'XHR', type, content);
                }
            });
            return xhr;
        };

        window.URL.createObjectURL = function(obj) {
            const url = originalCreateObjectURL(obj);
            if (isIntercepting && obj instanceof Blob) {
                if (obj.size < 500000) {
                     const reader = new FileReader();
                     reader.onload = () => {
                         const txt = reader.result;
                         if (typeof txt === 'string' && (txt.includes('#EXTM3U') || txt.includes('<MPD'))) {
                             logItem(url, 'BlobScan', 'HLS', ICONS.hls);
                         } else if (logMedia) {
                             logItem(url, 'Blob', 'Media', ICONS.media);
                         }
                     };
                     reader.readAsText(obj);
                } else if (logMedia) {
                    logItem(url, 'Blob', 'Media', ICONS.media);
                }
            }
            return url;
        };

        if (typeof PerformanceObserver !== 'undefined') {
            new PerformanceObserver((list) => {
                if(!isIntercepting) return;
                list.getEntries().forEach((entry) => {
                    if (entry.initiatorType === 'audio' || entry.initiatorType === 'video' || entry.name.match(/\.(mp3|aac|m3u8|mpd|ogg|ts)$/i) || entry.name.match(/(stream|live|icecast|shoutcast|manifest|playlist)/i)) {
                        process(entry.name, 'Radar', '', '', { dest: entry.initiatorType });
                    }
                });
            }).observe({ entryTypes: ['resource'] });
        }

        console.log = function (...args) {
            if (isIntercepting) {
                args.forEach(arg => {
                    if (typeof arg === 'string' && /[a-f0-9]{32}:[a-f0-9]{32}/i.test(arg)) {
                       logItem(arg.match(/[a-f0-9]{32}:[a-f0-9]{32}/i)[0], 'Console', 'Key', ICONS.key);
                    }
                });
            }
            return originalConsoleLog.apply(console, args);
        };
    }

    function logItem(url, method, type, icon) {
        if (IS_TOP_WINDOW) {
            if (!loggedItems.has(url)) {
                loggedItems.set(url, true);
                if (logSection) addEntry({ url, method, type, icon });
            }
        } else {
             try { window.top.postMessage({ type: `${SCRIPT_ID}-log`, payload: { url, method, type, icon } }, '*'); } catch (e) {}
        }
    }

    // --- UI Construction ---
    function createUI() {
        if (!IS_TOP_WINDOW || shadowRoot) return;
        const host = document.createElement('div');
        host.style.cssText = 'position:fixed;top:0;left:0;z-index:2147483647;pointer-events:none;width:100%;height:100%;';
        document.body.appendChild(host);
        shadowRoot = host.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            * { box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif; pointer-events: auto; }
            .wrapper { position: fixed; width: 420px; max-height: 70vh; background: rgba(15, 23, 42, 0.98); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; display: flex; flex-direction: column; color: #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.8); opacity: 0.95; }
            .hidden { display: none !important; }
            .header { padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; cursor: move; user-select: none; background: rgba(255,255,255,0.05); }
            .title { font-weight: 700; font-size: 13px; display: flex; gap: 6px; align-items: center; }
            .controls { display: flex; gap: 5px; }
            button { background: rgba(255,255,255,0.05); border: none; color: #94a3b8; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; display: flex; gap: 4px; align-items: center; transition: 0.2s; }
            button:hover { background: rgba(255,255,255,0.1); color: #fff; }
            button.active { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
            button.on-green { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
            button.on-red { background: rgba(239, 68, 68, 0.2); color: #f87171; }
            button.success { color: #4ade80 !important; }
            .icon { width: 14px; height: 14px; }
            .log-list { flex: 1; overflow-y: auto; padding: 5px; scrollbar-width: thin; }
            .entry { background: rgba(0,0,0,0.3); margin-bottom: 4px; border-radius: 4px; overflow: hidden; font-size: 11px; }
            .entry-head { padding: 6px 8px; display: flex; justify-content: space-between; cursor: pointer; align-items: center; }
            .entry-meta { display: flex; gap: 6px; align-items: center; }
            .type { font-weight: 700; color: #fff; }
            .method { color: #64748b; }
            .url { padding: 8px; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.05); word-break: break-all; color: #94a3b8; display: none; }
            .url.open { display: block; }
            .hls { color: #facc15; } .dash { color: #4ade80; } .key { color: #c084fc; } .media { color: #f472b6; }
            .minimized { position: fixed; width: 42px; height: 42px; background: rgba(15, 23, 42, 0.95); border: 2px solid #3b82f6; border-radius: 50%; cursor: move; display: flex; justify-content: center; align-items: center; z-index: 2147483647; box-shadow: 0 5px 15px rgba(0,0,0,0.5); background-image: url('${MINIMIZED_LOGO_URL}'); background-size: contain; transition: transform 0.1s; }
            .minimized:active { transform: scale(0.95); }
        `;
        shadowRoot.appendChild(style);

        logWindow = document.createElement('div');
        logWindow.className = 'wrapper hidden';
        logWindow.style.left = windowPos.x + 'px';
        logWindow.style.top = windowPos.y + 'px';

        const header = document.createElement('div');
        header.className = 'header';
        header.innerHTML = `<div class="title">${ICONS.logo} StreamReaper</div>`;
        const controls = document.createElement('div');
        controls.className = 'controls';

        interceptToggleBtn = mkBtn('', toggleIntercept, 'Start/Stop Sniffing');
        segmentToggleBtn = mkBtn('Seg', () => { logSegments = !logSegments; updateBtns(); }, 'Toggle Segment Logs (.ts)');
        mediaToggleBtn = mkBtn('Media', () => { logMedia = !logMedia; updateBtns(); }, 'Toggle Media Logs (.mp4/mp3)');

        copyAllBtn = mkBtn(ICONS.copy, () => {
            copyAll();
            const oldHtml = copyAllBtn.innerHTML;
            copyAllBtn.innerHTML = ICONS.check;
            copyAllBtn.classList.add('success');
            setTimeout(() => {
                copyAllBtn.innerHTML = oldHtml;
                copyAllBtn.classList.remove('success');
            }, 1000);
        }, 'Copy All URLs');

        const clearBtn = mkBtn(ICONS.clear, () => { loggedItems.clear(); logSection.innerHTML = ''; }, 'Clear Log');
        const minBtn = mkBtn(ICONS.minimize, toggleVis, 'Minimize');

        controls.append(interceptToggleBtn, segmentToggleBtn, mediaToggleBtn, copyAllBtn, clearBtn, minBtn);
        header.append(controls);
        logWindow.append(header);

        logSection = document.createElement('div');
        logSection.className = 'log-list';
        logWindow.append(logSection);
        shadowRoot.append(logWindow);

        minimizedBtn = document.createElement('div');
        minimizedBtn.className = 'minimized';
        minimizedBtn.style.left = windowPos.x + 'px';
        minimizedBtn.style.top = windowPos.y + 'px';
        minimizedBtn.title = "Open StreamReaper";
        shadowRoot.append(minimizedBtn);

        makeDraggable(logWindow, header);
        makeDraggable(minimizedBtn, minimizedBtn, toggleVis);
        updateBtns();

        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.code === 'KeyX') toggleVis();
        });
    }

    function mkBtn(html, cb, title = '') {
        const b = document.createElement('button');
        b.innerHTML = html;
        b.onclick = (e) => { e.stopPropagation(); cb(); };
        if(title) b.title = title;
        return b;
    }

    function updateBtns() {
        if (isIntercepting) {
            interceptToggleBtn.innerHTML = ICONS.stop + ' ON';
            interceptToggleBtn.className = 'on-green';
        } else {
            interceptToggleBtn.innerHTML = ICONS.play + ' OFF';
            interceptToggleBtn.className = 'on-red';
        }

        segmentToggleBtn.innerHTML = logSegments ? `${ICONS.toggleOn} Seg` : `${ICONS.toggleOff} Seg`;
        segmentToggleBtn.classList.toggle('active', logSegments);

        mediaToggleBtn.innerHTML = logMedia ? `${ICONS.toggleOn} Media` : `${ICONS.toggleOff} Media`;
        mediaToggleBtn.classList.toggle('active', logMedia);
    }

    function addEntry(item) {
        const div = document.createElement('div');
        div.className = 'entry';
        div.innerHTML = `<div class="entry-head"><div class="entry-meta">${item.icon} <span class="type">${item.type}</span> <span class="method">[${item.method}]</span></div></div><div class="url">${item.url}</div>`;
        const cBtn = mkBtn(ICONS.copy, () => {
            navigator.clipboard.writeText(item.url);
            cBtn.innerHTML = ICONS.check;
            cBtn.classList.add('success');
            setTimeout(() => { cBtn.innerHTML = ICONS.copy; cBtn.classList.remove('success'); }, 1000);
        }, 'Copy URL');
        cBtn.style.padding = '2px';
        div.querySelector('.entry-head').appendChild(cBtn);
        div.querySelector('.entry-head').onclick = () => div.querySelector('.url').classList.toggle('open');
        logSection.prepend(div);
        if(logSection.children.length > MAX_LOG_ENTRIES) logSection.lastChild.remove();
    }

    function copyAll() {
        const txt = Array.from(loggedItems.keys()).join('\n');
        if(txt) navigator.clipboard.writeText(txt);
    }

    function toggleVis() {
        isVisible = !isVisible;
        if(isVisible) {
            logWindow.style.left = windowPos.x + 'px';
            logWindow.style.top = windowPos.y + 'px';
        } else {
            minimizedBtn.style.left = windowPos.x + 'px';
            minimizedBtn.style.top = windowPos.y + 'px';
        }
        logWindow.classList.toggle('hidden', !isVisible);
        minimizedBtn.classList.toggle('hidden', isVisible);
    }

    function toggleIntercept() {
        isIntercepting = !isIntercepting;
        updateBtns();
        if(!isIntercepting) {
            window.fetch = originalFetch;
            window.XMLHttpRequest = originalXHR;
            console.log = originalConsoleLog;
            window.URL.createObjectURL = originalCreateObjectURL;
            window.WebSocket = originalWebSocket;
            window.Audio = originalAudio;
            try { Object.defineProperty(HTMLMediaElement.prototype, 'src', originalMediaSrcDescriptor); } catch(e){}
        } else {
            setupInterceptors();
        }
    }

    function makeDraggable(el, handle, onClick) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        handle.addEventListener('mousedown', (e) => {
            if (e.button !== 0 || e.target.tagName === 'BUTTON') return;
            isDragging = false;
            startX = e.clientX;
            startY = e.clientY;
            const rect = el.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            const onMouseMove = (ev) => {
                const dx = ev.clientX - startX;
                const dy = ev.clientY - startY;
                if (!isDragging && Math.hypot(dx, dy) > 3) {
                    isDragging = true;
                    el.style.cursor = 'grabbing';
                }
                if (isDragging) {
                    el.style.left = `${initialLeft + dx}px`;
                    el.style.top = `${initialTop + dy}px`;
                    windowPos = { x: initialLeft + dx, y: initialTop + dy };
                }
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                el.style.cursor = 'move';
                if (!isDragging && onClick) onClick();
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
        });
    }

    // --- Init ---
    if (IS_TOP_WINDOW) {
        if(document.body) createUI();
        else window.addEventListener('DOMContentLoaded', createUI);
        setupInterceptors();
        window.addEventListener('message', e => {
            if(e.data?.type === `${SCRIPT_ID}-log`) logItem(e.data.payload.url, 'iFrame', e.data.payload.type, e.data.payload.icon);
        });
    } else {
        setupInterceptors();
    }
})();