// ==UserScript==
// @name         DabLyrics
// @namespace    https://github.com/ahnaf0014/DabLyrics
// @version      1.0.1
// @description  Enhances the native lyrics UI on dab.yeet.su with a custom, stable lyric stream.
// @author       Ahnaf
// @match        https://dab.yeet.su/*
// @match        https://dabmusic.xyz/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      lyrics-api.boidu.dev
// @connect      lrclib.net
// @connect      translate.googleapis.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544808/DabLyrics.user.js
// @updateURL https://update.greasyfork.org/scripts/544808/DabLyrics.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- SETTINGS ---
    const SETTINGS = { language: "en", checkInterval: 5000, renderInterval: 100, timingOffset: -0.2, lyricsDelay: 280 };

    // --- SELECTORS & IDs ---
    const PLAYER_BAR_SELECTOR = "body > div > div.rounded-lg.border.text-card-foreground.bg-zinc-900\\/80.backdrop-blur-md.border-zinc-700\\/30.fixed.bottom-0.left-0.right-0.z-40";
    const MY_NATIVE_VIEW_ID = 'bl-native-fullscreen-container';
    const NATIVE_LYRICS_VIEWPORT_ID = 'bl-native-viewport';
    const NATIVE_LYRICS_TAPE_ID = 'bl-native-tape';
    const FLOATING_UI_ID = 'better-lyrics-floater';
    const FLOATING_CONTENT_ID = 'bl-content';
    const FLOATING_HEADER_ID = 'bl-header';
    const FLOATING_COLLAPSE_BTN_ID = 'bl-collapse-btn';
    const FLOATING_RESIZE_HANDLE_ID = 'bl-resize-handle';
    const NATIVE_LINE_CLASS_BASE = ['py-2', 'transition-all', 'duration-500', 'ease-in-out', 'text-center'];
    const NATIVE_LINE_CLASS_INACTIVE = ['text-zinc-400/80', 'text-xl'];
    const NATIVE_LINE_CLASS_ACTIVE = ['text-white', 'font-medium', 'text-2xl'];

    // --- STATE MANAGEMENT ---
    let lastSong = '';
    let isFetching = false;
    let currentLyrics = [];
    const state = { cachedLyrics: {}, isFloaterCollapsed: GM_getValue('bl_floater_collapsed', false), floaterPos: GM_getValue('bl_floater_pos', { x: 20, y: 20 }), floaterSize: GM_getValue('bl_floater_size', { w: 400, h: 350 }) };
    const renderState = { lyricElements: { native: [], floating: [] }, lastActiveIndex: { native: -1, floating: -1 } };

    // --- DATA & PLAYER HELPERS ---
    function parseLRC(text) { return text.split("\n").map(line => { const match = line.match(/\[(\d+):(\d+)(?:[.,](\d+))?]/); if (!match) return null; const time = parseInt(match[1]) * 60 + parseInt(match[2]) + parseInt(match[3] || '0') / 1000; const content = line.replace(/\[.*?]/g, '').trim(); return content ? { time, text: content } : null; }).filter(Boolean).sort((a, b) => a.time - b.time); }
    async function fetchLyrics(artist, title) { const cacheKey = `${artist} - ${title}`; if (state.cachedLyrics[cacheKey]) return state.cachedLyrics[cacheKey]; const urls = [`https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(title)}`, `https://lyrics-api.boidu.dev/?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`]; for (const url of urls) { try { const res = await new Promise((resolve, reject) => { GM_xmlhttpRequest({ method: "GET", url, timeout: 10000, onload: r => resolve(JSON.parse(r.responseText)), onerror: reject, ontimeout: reject }); }); if (res?.syncedLyrics) { const parsed = parseLRC(res.syncedLyrics); if (parsed.length > 0) { state.cachedLyrics[cacheKey] = parsed; return parsed; } } } catch (e) { /* Fetch failed, try next source */ } } return []; }
    async function translateLyrics(lyrics, toLang) { if (toLang === 'en' || !lyrics.length) return lyrics; const text = lyrics.map(l => l.text).join("\n"); const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`; return new Promise((resolve) => { GM_xmlhttpRequest({ method: "GET", url, timeout: 15000, onload: res => { try { const translatedSentences = JSON.parse(res.responseText)[0]; const translatedLines = translatedSentences.map(t => t[0]).join('').split('\n'); resolve(lyrics.map((line, i) => ({ ...line, text: translatedLines[i] || line.text }))); } catch { resolve(lyrics); } }, onerror: () => resolve(lyrics), ontimeout: () => resolve(lyrics) }); }); }
    function parseTimeToSeconds(timeStr) { if (!timeStr || !timeStr.includes(':')) return 0; const parts = timeStr.split(':').map(Number); if (parts.length === 2) return parts[0] * 60 + parts[1]; if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]; return 0; }
    function getNowPlayingInfo() { const playerBar = document.querySelector(PLAYER_BAR_SELECTOR); if (!playerBar) return null; const titleElem = playerBar.querySelector("div.min-w-0.flex-1 > div:nth-child(1) > h3"); const artistElem = playerBar.querySelector("div.min-w-0.flex-1 > p"); if (!titleElem || !artistElem) return null; return { title: titleElem.textContent.trim(), artist: artistElem.textContent.trim() }; }
    function getCurrentTime() { const playerBar = document.querySelector(PLAYER_BAR_SELECTOR); const mainTimeElem = playerBar ? playerBar.querySelector("div.flex-1.w-full > div.flex.items-center.gap-2 > span:nth-child(1)") : null; const lyricsDelayInSeconds = SETTINGS.lyricsDelay / 1000; return mainTimeElem ? parseTimeToSeconds(mainTimeElem.textContent) + SETTINGS.timingOffset + lyricsDelayInSeconds : 0; }
    function getTotalTime() { const playerBar = document.querySelector(PLAYER_BAR_SELECTOR); const totalTimeElem = playerBar ? playerBar.querySelector("div.flex-1.w-full > div.flex.items-center.gap-2 > span:last-child") : null; return totalTimeElem ? parseTimeToSeconds(totalTimeElem.textContent) : 0; }

    // --- UI & STYLES ---
    function injectUIManager() {
        const css = `
            #${MY_NATIVE_VIEW_ID} { display: none; position: fixed; inset: 0; z-index: 10000; background: linear-gradient(to bottom, rgba(39, 39, 42, 0.98), #000, rgba(39, 39, 42, 0.98)); flex-direction: column; padding: 1rem; }
            #${NATIVE_LYRICS_VIEWPORT_ID} { position: relative; flex-grow: 1; overflow: hidden; }
            #${NATIVE_LYRICS_TAPE_ID} { position: absolute; width: 100%; top: 50%; left: 0; transition: transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94); }
            #${NATIVE_LYRICS_TAPE_ID} > div { transition: opacity 500ms, transform 500ms; }
            #${FLOATING_UI_ID} { position: fixed; z-index: 9999; background-color: rgba(20, 20, 20, 0.85); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); display: flex; flex-direction: column; font-family: sans-serif; min-width: 250px; min-height: 120px; max-width: 90vw; max-height: 80vh; }
            #${FLOATING_UI_ID}.collapsed { min-height: 50px; height: 50px !important; width: 150px !important; overflow: hidden; }
            #${FLOATING_HEADER_ID} { padding: 8px 12px; cursor: move; background-color: rgba(255, 255, 255, 0.1); border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center; border-top-left-radius: 12px; border-top-right-radius: 12px; flex-shrink: 0; }
            #${FLOATING_HEADER_ID} span { color: #eee; font-weight: bold; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            #${FLOATING_COLLAPSE_BTN_ID} { cursor: pointer; background: none; border: none; color: #ddd; font-size: 20px; line-height: 1; padding: 0 4px; }
            #${FLOATING_CONTENT_ID} { flex-grow: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 8px; }
            #${FLOATING_UI_ID}.collapsed #${FLOATING_CONTENT_ID} { display: none; }
            #${FLOATING_CONTENT_ID} p { margin: 0; text-align: center; transition: all 0.3s ease; font-size: 16px; color: #aaa; }
            #${FLOATING_CONTENT_ID} p.active { color: #fff; font-weight: bold; font-size: 18px; }
            #${FLOATING_CONTENT_ID} .bl-message, .bl-native-message { color: #ccc; font-size: 16px; text-align: center; padding: 20px; }
            .bl-native-message { font-size: 1.25rem; padding: 2rem; }
            #${FLOATING_RESIZE_HANDLE_ID} { position: absolute; right: 0; bottom: 0; width: 20px; height: 20px; cursor: se-resize; z-index: 10000; }
            #${FLOATING_UI_ID}.collapsed #${FLOATING_RESIZE_HANDLE_ID} { display: none; }
        `;
        const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
        const floater = document.createElement('div'); floater.id = FLOATING_UI_ID; floater.innerHTML = `<div id="${FLOATING_HEADER_ID}"><span>DabLyrics</span><button id="${FLOATING_COLLAPSE_BTN_ID}">_</button></div><div id="${FLOATING_CONTENT_ID}" class="custom-scrollbar"></div><div id="${FLOATING_RESIZE_HANDLE_ID}"></div>`; document.body.appendChild(floater);
        const myNativeView = document.createElement('div'); myNativeView.id = MY_NATIVE_VIEW_ID; document.body.appendChild(myNativeView);
        floater.style.left = `${state.floaterPos.x}px`; floater.style.top = `${state.floaterPos.y}px`; floater.style.width = `${state.floaterSize.w}px`; floater.style.height = `${state.floaterSize.h}px`;
        if (state.isFloaterCollapsed) { floater.classList.add('collapsed'); floater.querySelector(`#${FLOATING_COLLAPSE_BTN_ID}`).textContent = '□'; }
        makeDraggable(floater, floater.querySelector(`#${FLOATING_HEADER_ID}`)); makeResizable(floater, floater.querySelector(`#${FLOATING_RESIZE_HANDLE_ID}`)); floater.querySelector(`#${FLOATING_COLLAPSE_BTN_ID}`).addEventListener('click', toggleFloaterCollapse);
    }
    function makeDraggable(element, handle) { let pos3 = 0, pos4 = 0; handle.onmousedown = e => { e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY; document.onmouseup = closeDragElement; document.onmousemove = elementDrag; }; const elementDrag = e => { e.preventDefault(); element.style.top = (element.offsetTop - (pos4 - e.clientY)) + "px"; element.style.left = (element.offsetLeft - (pos3 - e.clientX)) + "px"; pos3 = e.clientX; pos4 = e.clientY; }; const closeDragElement = () => { document.onmouseup = null; document.onmousemove = null; state.floaterPos = { x: element.offsetLeft, y: element.offsetTop }; GM_setValue('bl_floater_pos', state.floaterPos); }; }
    function makeResizable(element, handle) { let initialW, initialH, initialX, initialY; handle.onmousedown = e => { e.preventDefault(); e.stopPropagation(); initialW = element.offsetWidth; initialH = element.offsetHeight; initialX = e.clientX; initialY = e.clientY; document.onmousemove = elementResize; document.onmouseup = stopResize; }; const elementResize = e => { element.style.width = (initialW + (e.clientX - initialX)) + 'px'; element.style.height = (initialH + (e.clientY - initialY)) + 'px'; }; const stopResize = () => { document.onmousemove = null; document.onmouseup = null; state.floaterSize = { w: element.offsetWidth, h: element.offsetHeight }; GM_setValue('bl_floater_size', state.floaterSize); }; }
    function toggleFloaterCollapse(e) { e.stopPropagation(); state.isFloaterCollapsed = !state.isFloaterCollapsed; GM_setValue('bl_floater_collapsed', state.isFloaterCollapsed); const floater = document.getElementById(FLOATING_UI_ID); const btn = document.getElementById(FLOATING_COLLAPSE_BTN_ID); if (state.isFloaterCollapsed) { floater.classList.add('collapsed'); btn.textContent = '□'; } else { floater.classList.remove('collapsed'); btn.textContent = '_'; } }

    // --- CORE LOGIC ---
    function openMyNativeView() {
        const view = document.getElementById(MY_NATIVE_VIEW_ID);
        if (!view) return;
        view.innerHTML = '';
        const container = document.createElement('div');
        container.id = NATIVE_LYRICS_VIEWPORT_ID;
        const closeButton = document.createElement('button');
        closeButton.textContent = '▼';
        closeButton.style.cssText = 'position: absolute; top: 1rem; right: 1.5rem; font-size: 1.5rem; color: white; background: none; border: none; cursor: pointer; z-index: 1;';
        closeButton.onclick = closeMyNativeView;
        view.appendChild(closeButton);
        view.appendChild(container);
        buildLyricsDOM(container, currentLyrics, false);
        view.style.display = 'flex';
        const nativeLyricsView = document.querySelector('.flex-1.overflow-y-auto.pr-2.custom-scrollbar');
        if (nativeLyricsView) { nativeLyricsView.style.display = 'none'; }
        updateUI();
    }

    function closeMyNativeView() {
        const view = document.getElementById(MY_NATIVE_VIEW_ID);
        if (view) view.style.display = 'none';
        const nativeLyricsView = document.querySelector('.flex-1.overflow-y-auto.pr-2.custom-scrollbar');
        if (nativeLyricsView) { nativeLyricsView.style.display = ''; }
    }

    function buildLyricsDOM(container, lyrics, isFloating) {
        container.innerHTML = '';
        const uiKey = isFloating ? 'floating' : 'native';
        renderState.lyricElements[uiKey] = [];
        renderState.lastActiveIndex[uiKey] = -1;
        const messageClass = isFloating ? 'bl-message' : 'bl-native-message';
        if (isFetching) { container.innerHTML = `<div class="${messageClass}">🎵 Fetching lyrics...</div>`; return; }
        if (!lyrics || lyrics.length === 0) { container.innerHTML = `<div class="${messageClass}">⚠️ No synced lyrics found for <b>${lastSong || 'this song'}</b>.</div>`; return; }

        const songEndTime = getTotalTime();
        const finalTime = songEndTime > 0 ? songEndTime : 99999;
        const displayLyrics = [{ time: 0, text: '...' }, ...lyrics, { time: finalTime, text: '(end)' }];

        if (isFloating) {
            displayLyrics.forEach(line => {
                const lineElem = document.createElement('p');
                lineElem.textContent = line.text;
                container.appendChild(lineElem);
                renderState.lyricElements[uiKey].push(lineElem);
            });
        } else {
            const tape = document.createElement('div');
            tape.id = NATIVE_LYRICS_TAPE_ID;
            container.appendChild(tape);
            displayLyrics.forEach(line => {
                const lineElem = document.createElement('div');
                lineElem.className = [...NATIVE_LINE_CLASS_BASE, ...NATIVE_LINE_CLASS_INACTIVE].join(' ');
                lineElem.innerHTML = `<p>${line.text}</p>`;
                tape.appendChild(lineElem);
                renderState.lyricElements[uiKey].push(lineElem);
            });
        }
    }

    async function mainLoop() {
        const info = getNowPlayingInfo();
        if (!info) return;
        const songKey = `${info.artist} - ${info.title}`;
        if (songKey === lastSong || isFetching) return;
        lastSong = songKey;
        isFetching = true;
        currentLyrics = [];
        renderState.lyricElements['floating'] = [];
        document.querySelector(`#${FLOATING_HEADER_ID} span`).textContent = songKey;
        updateUI();
        try {
            let lyrics = await fetchLyrics(info.artist, info.title);
            if (lyrics.length > 0 && SETTINGS.language !== 'en') {
                lyrics = await translateLyrics(lyrics, SETTINGS.language);
            }
            currentLyrics = lyrics;
        } catch (e) {
            console.error("DabLyrics: Lyrics fetch failed:", e);
            currentLyrics = [];
        } finally {
            isFetching = false;
            updateUI();
        }
    }

    function updateUI() {
        const myNativeView = document.getElementById(MY_NATIVE_VIEW_ID);
        const isMyNativeViewVisible = myNativeView && getComputedStyle(myNativeView).display !== 'none';
        const floater = document.getElementById(FLOATING_UI_ID);
        if (floater) { isMyNativeViewVisible ? floater.style.display = 'none' : floater.style.display = 'flex'; }
        const isFloating = !isMyNativeViewVisible;
        const uiKey = isFloating ? 'floating' : 'native';
        const container = isFloating ? document.getElementById(FLOATING_CONTENT_ID) : document.getElementById(NATIVE_LYRICS_VIEWPORT_ID);
        if (!container) return;
        if (renderState.lyricElements[uiKey].length === 0) { buildLyricsDOM(container, currentLyrics, isFloating); }
        if (isFetching || !currentLyrics || currentLyrics.length === 0) { return; }

        const songEndTime = getTotalTime();
        const finalTime = songEndTime > 0 ? songEndTime : 99999;
        const displayLyrics = [{ time: 0, text: '...' }, ...currentLyrics, { time: finalTime, text: '(end)' }];

        const currentTime = getCurrentTime();
        let newActiveIndex = displayLyrics.findIndex((line, i) => {
            const nextLine = displayLyrics[i + 1];
            return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
        });
        const lastIndex = renderState.lastActiveIndex[uiKey];
        if (newActiveIndex !== lastIndex) {
            const elements = renderState.lyricElements[uiKey];
            if (!elements || elements.length === 0 || !elements[newActiveIndex]) return;
            if (isFloating) {
                const oldElem = elements[lastIndex];
                const newElem = elements[newActiveIndex];
                if (oldElem) oldElem.classList.remove('active');
                if (newElem) {
                    newElem.classList.add('active');
                    newElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                const tape = document.getElementById(NATIVE_LYRICS_TAPE_ID);
                const activeLineElem = elements[newActiveIndex];
                if (tape && activeLineElem) {
                    const offset = -activeLineElem.offsetTop;
                    tape.style.transform = `translateY(${offset}px)`;
                    elements.forEach((line, index) => {
                        const distance = Math.abs(index - newActiveIndex);
                        line.style.opacity = Math.max(0, 1 - distance * 0.35);
                        line.style.transform = `scale(${Math.max(0.8, 1 - distance * 0.05)})`;
                        line.className = (distance === 0)
                            ? [...NATIVE_LINE_CLASS_BASE, ...NATIVE_LINE_CLASS_ACTIVE].join(' ')
                            : [...NATIVE_LINE_CLASS_BASE, ...NATIVE_LINE_CLASS_INACTIVE].join(' ');
                    });
                }
            }
            renderState.lastActiveIndex[uiKey] = newActiveIndex;
        }
    }

    // --- BUTTON HIJACKING ---
    function hijackLyricsButton() {
        const buttons = document.querySelectorAll('button');
        let targetButton = null;
        buttons.forEach(button => {
            if (button.getAttribute('aria-label')?.toLowerCase().includes('show lyrics fullscreen')) {
                targetButton = button;
            }
        });
        if (targetButton && !targetButton.dataset.hijacked) {
            targetButton.dataset.hijacked = 'true';
            targetButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openMyNativeView();
            }, true);
        }
    }

    // --- INITIALIZATION ---
    function init() {
        injectUIManager();
        const lyricsButtonObserver = new MutationObserver(hijackLyricsButton);
        lyricsButtonObserver.observe(document.body, { childList: true, subtree: true });
        hijackLyricsButton();
        setInterval(mainLoop, SETTINGS.checkInterval);
        setInterval(updateUI, SETTINGS.renderInterval);
        mainLoop();
    }

    const readyStateCheck = setInterval(() => {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheck);
            init();
        }
    }, 100);
})();