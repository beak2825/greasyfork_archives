// ==UserScript==
// @name         RaiPlay Downloader
// @version      1.0
// @description  Sostituisce la funzione del tasto "Condividi" con un downloder per il video.
// @author       WetCork
// @icon         https://www.raiplay.it/dl/rai/images/favicon.ico
// @match        https://www.raiplay.it/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @namespace    https://github.com/wetcork
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/538430/RaiPlay%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/538430/RaiPlay%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function loadMuxjs(callback) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/mux.js/dist/mux.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    function sanitizeFilename(name) {
        return name.replace(/[\\/:*?"<>|]/g, '_').trim();
    }

    function parseVariants(m3u8Text, baseUrl) {
        const lines = m3u8Text.split('\n');
        const variants = [];
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('#EXT-X-STREAM-INF')) {
                const info = lines[i];
                const resolutionMatch = info.match(/RESOLUTION=(\d+x\d+)/);
                const label = resolutionMatch ? resolutionMatch[1] : 'Var ' + (variants.length + 1);
                const uri = lines[i + 1] || '';
                const variantUrl = uri.startsWith('http') ? uri : baseUrl + uri;
                variants.push({ label: label, uri: variantUrl });
            }
        }
        return variants;
    }

    async function fetchText(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'text',
                onload: res => res.status === 200 ? resolve(res.responseText) : reject(res.status),
                onerror: () => reject('Network error')
            });
        });
    }

    async function fetchArrayBuffer(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer',
                onload: res => res.status === 200 ? resolve(res.response) : reject(res.status),
                onerror: () => reject('Network error')
            });
        });
    }

    function pollShareButton() {
        return new Promise(resolve => {
            const check = () => {
                const btn = document.querySelector('button.rai-custom-icon-share');
                if (btn) {
                    resolve(btn);
                } else {
                    setTimeout(check, 500);
                }
            };
            check();
        });
    }

    function showCustomMenu(variants, videoName) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed'; overlay.style.top = '0'; overlay.style.left = '0'; overlay.style.width = '100%'; overlay.style.height = '100%'; overlay.style.background = 'rgba(0,0,0,0.7)'; overlay.style.display = 'flex'; overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center'; overlay.style.zIndex = '9999';

        const box = document.createElement('div');
        box.style.background = '#001623'; box.style.padding = '20px'; box.style.borderRadius = '8px'; box.style.maxWidth = '400px'; box.style.width = '80%'; box.style.maxHeight = '80%'; box.style.overflowY = 'auto'; box.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)'; box.style.display = 'flex'; box.style.flexDirection = 'column'; box.style.alignItems = 'center';

        const title = document.createElement('h3'); title.textContent = 'RaiPlay Downloader'; title.style.marginTop = '0'; title.style.color = '#fff'; box.appendChild(title);

        const subtitle = document.createElement('p'); subtitle.innerHTML = 'by <a href="https://github.com/wetcork" target="_blank" style="color:#ccc;text-decoration:underline;">WetCork</a> - Version 1.0'; subtitle.style.marginTop = '4px'; subtitle.style.marginBottom = '16px'; subtitle.style.color = '#ccc'; subtitle.style.fontSize = '0.9em'; box.appendChild(subtitle);

        const svgIcon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="1.2" style="width:16px;height:16px;flex-shrink:0;"><path d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z" fill="#ffffff"/><path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" fill="#ffffff"/></svg>`;
        const btnElements = [];
        let cancelRequested = false;
        let currentBtn = null;
        let closeBtn;
        const sanitizedBaseName = sanitizeFilename(videoName || 'video');
        variants.forEach(v => {
            const displayLabel = v.label.includes('x') ? v.label.split('x')[1] + 'p' : v.label;
            const btn = document.createElement('button');
            btn.className = 'rai-custom-button rai-custom-panel-button rai-custom-panel-link-program-button';
            btn.type = 'button';
            btn.setAttribute('aria-disabled', 'false');
            btn.title = displayLabel;
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.background = '#007bff';
            btn.style.color = '#fff';
            btn.style.border = 'none';
            btn.style.borderRadius = '4px';
            btn.style.padding = '10px';
            btn.style.cursor = 'pointer';
            btn.style.width = '120px';
            btn.style.height = '40px';
            btn.style.margin = '5px';
            const originalContent = `${svgIcon}<span class=\"button-label\" style=\"margin-left:12px;\">${displayLabel}</span>`;
            btn.innerHTML = originalContent;
            btn.onclick = async (e) => {
                if (cancelRequested) return;
                btnElements.forEach(b => { b.disabled = true; b.style.background = '#6c757d'; b.style.cursor = 'not-allowed'; });
                currentBtn = btn;
                cancelRequested = false;
                title.textContent = '0%';
                closeBtn.textContent = 'Annulla';
                const playlistText = await fetchText(v.uri);
                const lines = playlistText.split('\n');
                const lastSlash = v.uri.lastIndexOf('/');
                const base = v.uri.slice(0, lastSlash + 1);
                const segmentUrls = [];
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i] && !lines[i].startsWith('#')) {
                        const seg = lines[i].startsWith('http') ? lines[i] : base + lines[i];
                        segmentUrls.push(seg);
                    }
                }
                const total = segmentUrls.length;
                let count = 0;
                btn.innerHTML = `
                    <div style=\"background:#444;width:100%;height:10px;border-radius:5px;position:relative;\">\n                        <div id=\"prog-bar\" style=\"background:#0f0;width:0%;height:100%;border-radius:5px;\"></div>\n                    </div>`;
                const transmuxer = new muxjs.mp4.Transmuxer();
                const initSegments = [];
                const mdatSegments = [];
                transmuxer.on('data', segment => {
                    if (segment.initSegment) initSegments.push(segment.initSegment);
                    if (segment.data) mdatSegments.push(segment.data);
                });
                for (const segUrl of segmentUrls) {
                    if (cancelRequested) break;
                    const tsBuffer = await fetchArrayBuffer(segUrl);
                    transmuxer.push(new Uint8Array(tsBuffer));
                    transmuxer.flush();
                    count++;
                    const prog = Math.floor((count / total) * 100);
                    const bar = btn.querySelector('#prog-bar');
                    if (bar) bar.style.width = prog + '%';
                    title.textContent = prog + '%';
                }
                let blobUrl;
                if (!cancelRequested) {
                    const mp4Chunks = [];
                    initSegments.forEach(is => mp4Chunks.push(is));
                    mdatSegments.forEach(data => mp4Chunks.push(data));
                    const blob = new Blob(mp4Chunks, { type: 'video/mp4' });
                    blobUrl = URL.createObjectURL(blob);
                }
                btn.innerHTML = originalContent;
                title.textContent = 'RaiPlay Downloader';
                btnElements.forEach(b => { b.disabled = false; b.style.background = '#007bff'; b.style.cursor = 'pointer'; });
                closeBtn.textContent = 'Chiudi';
                if (!cancelRequested && blobUrl) {
                    const resolution = displayLabel;
                    const filename = `${sanitizedBaseName}_${resolution}.mp4`;
                    GM_download({ url: blobUrl, name: filename, saveAs: true });
                }
            };
            box.appendChild(btn);
            btnElements.push(btn);
        });
        closeBtn = document.createElement('button'); closeBtn.textContent = 'Chiudi'; closeBtn.className = 'rai-custom-button rai-custom-panel-button rai-custom-panel-link-program-button'; closeBtn.type = 'button'; closeBtn.setAttribute('aria-disabled', 'false'); closeBtn.style.background = '#dc3545'; closeBtn.style.color = '#fff'; closeBtn.style.border = 'none'; closeBtn.style.borderRadius = '4px'; closeBtn.style.padding = '10px'; closeBtn.style.cursor = 'pointer'; closeBtn.style.width = '200px'; closeBtn.style.margin = '10px';
        closeBtn.addEventListener('click', e => {
            e.stopImmediatePropagation();
            e.preventDefault();
            if (currentBtn && closeBtn.textContent === 'Annulla') {
                cancelRequested = true;
            } else {
                document.body.removeChild(overlay);
            }
        }, true);
        box.appendChild(closeBtn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    async function handleButtonClick(e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        const htmlUrl = window.location.href;
        const jsonUrl = htmlUrl.replace(/\.html($|\?)/, '.json$1');
        const resp = await fetch(jsonUrl, { credentials: 'include' });
        if (!resp.ok) return;
        const data = await resp.json();
        const content = data.video && data.video.content_url;
        const videoName = data.name || 'video';
        if (!content) return;
        const masterUrl = content + '&output=7&forceUserAgent=raiplayappletv';
        const masterResp = await fetch(masterUrl, { redirect: 'follow' });
        if (!masterResp.ok) return;
        const masterText = await masterResp.text();
        let baseUrl = '';
        try {
            const finalUrl = masterResp.url;
            const u = new URL(finalUrl);
            const baseuri = u.searchParams.get('baseuri');
            if (baseuri) {
                const decoded = decodeURIComponent(baseuri);
                baseUrl = u.origin + decoded;
            } else {
                baseUrl = finalUrl.replace(/\/playlist\.m3u8.*/, '/');
            }
        } catch {
            baseUrl = masterUrl.replace(/\/playlist\.m3u8.*/, '/');
        }
        const variants = parseVariants(masterText, baseUrl);
        if (variants.length) showCustomMenu(variants, videoName);
    }

    function overrideButton(btn) {
        btn.classList.remove('vjs-hidden');
        const span = btn.querySelector('.vjs-control-text');
        if (span) span.textContent = 'Scarica';
        btn.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            loadMuxjs(() => handleButtonClick(e));
        }, true);
        btn.setAttribute('data-overridden', 'true');
    }

    async function initOverride() {
        const btn = await pollShareButton();
        overrideButton(btn);
        const observer = new MutationObserver(() => {
            document.querySelectorAll('button.rai-custom-icon-share:not([data-overridden])')
                .forEach(b => overrideButton(b));
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    initOverride();
})();
