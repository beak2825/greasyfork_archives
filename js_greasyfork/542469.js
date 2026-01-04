// ==UserScript==
// @name         [AI Translations] Spotify Web Player Floating Lyrics
// @namespace    http://tampermonkey.net/
// @version      2.5.4
// @description  Synced lyrics with translation/romanization resizable/draggable panel, themed, opacity control. Translations are provided by Gemini 2.0 Flash and 1.5 Flash via the Google AI Studio API (Accessed via a remote server).
// @author       jayxdcode
// @license      All Rights Reserved
// @match        https://open.spotify.com/*
// @grant        GM_log
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      lrclib.net
// @connect      src-backend.onrender.com
// @connect      genius.com
// @connect      google.com
// @copyright    2025, jayxdcode
// @sandbox      JavaScript
// @downloadURL https://update.greasyfork.org/scripts/542469/%5BAI%20Translations%5D%20Spotify%20Web%20Player%20Floating%20Lyrics.user.js
// @updateURL https://update.greasyfork.org/scripts/542469/%5BAI%20Translations%5D%20Spotify%20Web%20Player%20Floating%20Lyrics.meta.js
// ==/UserScript==

(function() {
    'use strict';

// -- begin --
    const mobileDebug = true; // only set to true if you have eruda.

    const BACKEND_URL = "https://src-backend.onrender.com/api/translate";

    const POLL_INTERVAL = 1000;
    const STORAGE_KEY = 'tm-lyrics-panel-position';
    const SIZE_KEY = 'tm-lyrics-panel-size';
    const THEME_KEY = 'tm-lyrics-theme';
    const OPACITY_KEY = 'tm-lyrics-opacity';
    const CONFIG_KEY = 'tm-lyrics-config';

    let lyricsConfig = JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}');
    let lastCandidates = [];
    let currentTrackId = null;
    let currentTrackDur = null;
    let currInf = null;
    let syncIntervalId = null;
    let lyricsData = null;
    let observer = null;
    let isDragging = false;
    let dragLocked = false;
    let isResizing = false;
    let currentOpacity = parseFloat(localStorage.getItem(OPACITY_KEY)) || 0.85;
    let currentTheme = localStorage.getItem(THEME_KEY) || 'dark';
    let lastRenderedIdx = -1;

    let logVisible = false;

    // --- Utility Functions ---
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // --- Panel viewport adjustment logic ---
    function handleViewportChange() {
        const panel = document.getElementById('tm-lyrics-panel');
        if (!panel) return;

        const rect = panel.getBoundingClientRect();
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        const isOutOfBounds =
              rect.left < 0 ||
              rect.top < 0 ||
              rect.right > winWidth ||
              rect.bottom > winHeight;

        const isTooLarge =
              rect.width > winWidth ||
              rect.height > winHeight;

        if (isOutOfBounds || isTooLarge) {
            debug('Panel is out of bounds or too large for viewport. Adjusting...');

            // Clamp size to fit viewport with a small margin
            const newWidth = Math.min(rect.width, winWidth - 20);
            const newHeight = Math.min(rect.height, winHeight - 20);
            panel.style.width = newWidth + 'px';
            panel.style.height = newHeight + 'px';

            // Re-check rect after resize
            const newRect = panel.getBoundingClientRect();

            // Clamp position to keep the panel fully inside the viewport
            const newLeft = Math.max(10, Math.min(newRect.left, winWidth - newRect.width - 10));
            const newTop = Math.max(10, Math.min(newRect.top, winHeight - newRect.height - 10));
            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';

            localStorage.setItem(STORAGE_KEY, JSON.stringify({ left: panel.style.left, top: panel.style.top }));
            localStorage.setItem(SIZE_KEY, JSON.stringify({ width: panel.style.width, height: panel.style.height }));
        }
    }

    // --- Manual Lyrics Menu ---
    function showManualLyricsMenu(trackKey) {

        // Ensure we have candidates
        if (!lastCandidates || !lastCandidates.length) {
            const manualQuery = prompt('No lyric candidates available. Search manually:');
            if (manualQuery && manualQuery.trim() !== '') {
                loadLyrics('', '', '', currentTrackDur, (parsed) => {
                    lyricsData = parsed;
                    renderLyrics(0);
                    setupProgressSync(currInf.bar, currInf.duration);
                }, { flag: true, query: manualQuery });
            }
            return;
        }

        // Add blur overlay
        const existingOverlay = document.getElementById('tm-manual-overlay');
        if (existingOverlay) existingOverlay.remove();
        const overlay = document.createElement('div');
        overlay.id = 'tm-manual-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999
        });
        overlay.onclick = () => {
            overlay.remove();
            menu.remove();
        };
        document.body.appendChild(overlay);

        // Remove any existing menu
        document.getElementById('tm-manual-menu')?.remove();

        // Container
        const menu = document.createElement('div');
        menu.id = 'tm-manual-menu';
        Object.assign(menu.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90vw',
            maxWidth: '600px',
            maxHeight: '70vh',
            background: '#2a2a2a',
            color: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10000,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        });
        document.body.appendChild(menu);

        // Header with title & close
        const header = document.createElement('div');
        header.textContent = 'Choose Lyrics Source';
        Object.assign(header.style, { padding: '12px 16px', fontWeight: 'bold', borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        Object.assign(closeBtn.style, { background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' });
        closeBtn.onclick = () => {
            overlay.remove();
            menu.remove();
        };
        header.appendChild(closeBtn);
        menu.appendChild(header);

        // Scrollable list
        const list = document.createElement('div');
        Object.assign(list.style, { flex: '1', overflowY: 'auto', padding: '8px' });
        menu.appendChild(list);

        lastCandidates.forEach((c, idx) => {
            const panel = document.createElement('div');
            Object.assign(panel.style, { background: '#333', borderRadius: '8px', marginBottom: '8px', overflow: 'hidden' });

            // Summary row
            const summary = document.createElement('div');
            Object.assign(summary.style, { padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' });
            summary.innerHTML = `<span>Candidate ${idx+1}</span><span style="font-size:12px; opacity:.7;">▼</span>`;
            panel.appendChild(summary);

            // 3-line preview
            const preview = document.createElement('pre');
            const lines = c.syncedLyrics ? c.syncedLyrics.trim().split('\n').slice(0, 3) : c.plainLyrics.trim().split('\n').slice(0, 3);
            preview.textContent = lines.join('\n');
            Object.assign(preview.style, { margin: '0 12px 8px', padding: '0', fontSize: '12px', lineHeight: '1.2', color: '#ccc' });
            panel.appendChild(preview);

            // Body (hidden full lyrics)
            const body = document.createElement('pre');
            body.textContent = c.syncedLyrics ? c.syncedLyrics.trim() : c.plainLyrics.trim();
            Object.assign(body.style, { margin: 0, padding: '8px 12px', fontSize: '13px', lineHeight: '1.4', whiteSpace: 'pre-wrap', display: 'none', background: '#2b2b2b' });
            panel.appendChild(body);

            // Toggle on click
            summary.onclick = () => {
                const isOpen = body.style.display === 'block';
                body.style.display = isOpen ? 'none' : 'block';
                summary.querySelector('span:last-child').textContent = isOpen ? '▼' : '▲';
            };

            list.appendChild(panel);
        });

        // Footer with offset input + buttons
        const footer = document.createElement('div');
        Object.assign(footer.style, { padding: '12px 16px', borderTop: '1px solid #444', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' });

        // Offset
        const offLabel = document.createElement('label');
        offLabel.textContent = 'Offset (ms):';
        Object.assign(offLabel.style, { fontSize: '14px' });
        const offInput = document.createElement('input');
        offInput.type = 'number';
        offInput.value = lyricsConfig[trackKey]?.offset || 0;
        Object.assign(offInput.style, { width: '60px', padding: '4px', borderRadius: '4px', border: '1px solid #555', background: '#444', color: '#fff' });
        footer.appendChild(offLabel);
        footer.appendChild(offInput);

        // Manual Search button
        const searchBtn = document.createElement('button');
        searchBtn.textContent = 'Manual Search';
        Object.assign(searchBtn.style, { padding: '6px 12px', background: 'none', color: '#fff', border: '2px solid #555', borderRadius: '4px', cursor: 'pointer' });
        searchBtn.onclick = () => {
            const manualQuery = prompt('Enter manual search query (e.g., song title and artist):');
            if (manualQuery && manualQuery.trim() !== '') {
                overlay.remove();
                menu.remove();
                loadLyrics('', '', '', currentTrackDur, (parsed) => {
                    lyricsData = parsed;
                    renderLyrics(0);
                    if (currInf) { setupProgressSync(currInf.bar, currInf.duration); }
                }, { flag: true, query: manualQuery });
            }
        };
        footer.appendChild(searchBtn);

        // Reset Pick button
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset Pick';
        Object.assign(resetBtn.style, { padding: '6px 12px', background: 'none', color: '#fff', border: '2px solid #555', borderRadius: '4px', cursor: 'pointer' });
        resetBtn.onclick = () => {
            delete lyricsConfig[trackKey];
            localStorage.setItem(CONFIG_KEY, JSON.stringify(lyricsConfig));
        };
        footer.appendChild(resetBtn);

        // Use Selected button
        const useBtn = document.createElement('button');
        useBtn.textContent = 'Use Selected';
        Object.assign(useBtn.style, { padding: '6px 12px', background: 'none', color: '#fff', border: '2px solid #333', borderRadius: '4px', cursor: 'pointer' });
        useBtn.onclick = () => {
            const openBodies = Array.from(list.children)
            .filter(p => p.querySelector('pre:last-of-type').style.display === 'block');
            let rawLrc = openBodies.length ?
                openBodies[0].querySelector('pre:last-of-type').textContent :
            lastCandidates[0].syncedLyrics;
            const offset = parseInt(offInput.value, 10) || 0;

            lyricsConfig[trackKey] = { manualLrc: rawLrc, offset };
            localStorage.setItem(CONFIG_KEY, JSON.stringify(lyricsConfig));
            overlay.remove();
            menu.remove();

            const [t, a] = trackKey.split('|');
            loadLyrics(t, a, '', 0, parsed => {
                lyricsData = parsed;
                renderLyrics(0);
                setupProgressSync(null, 0);
            });
        };
        footer.appendChild(useBtn);

        menu.appendChild(footer);
    }

    // --- Panel creation and drag/resize logic ---
    function createPanel() {
        document.getElementById('tm-lyrics-overlay')?.remove();
        const overlay = document.createElement('div');
        overlay.id = 'tm-lyrics-overlay';
        Object.assign(overlay.style, { position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh', zIndex: 9998, pointerEvents: 'none' });
        const panel = document.createElement('div');
        panel.id = 'tm-lyrics-panel';
        Object.assign(panel.style, { position: 'fixed', width: '470px', height: '390px', minWidth: '470px', minHeight: '390px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', borderRadius: '10px', fontSize: '25px', lineHeight: '1.6', padding: '0', overflow: 'hidden', pointerEvents: 'auto', userSelect: 'none', zIndex: 9999, border: '2px solid #333', display: 'flex', flexDirection: 'column' });
        const defaultPos = { left: '100px', top: '100px' };
        const savedPos = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        panel.style.left = (savedPos && savedPos.left) ? savedPos.left : defaultPos.left;
        panel.style.top = (savedPos && savedPos.top) ? savedPos.top : defaultPos.top;
        const savedSize = JSON.parse(localStorage.getItem(SIZE_KEY) || 'null');
        if (savedSize && savedSize.width && savedSize.height) {
            panel.style.width = savedSize.width;
            panel.style.height = savedSize.height;
        }
        const header = document.createElement('div');
        header.id = 'tm-lyrics-header';
        Object.assign(header.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 14px', cursor: 'move', userSelect: 'none', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', flexShrink: 0 });
        const title = document.createElement('span');
        title.id = 'tm-header-title';
        title.innerHTML = dragLocked ? '<b>Lyrics (Locked)</b>' : '<b>Lyrics</b>';
        header.appendChild(title);

        detectLongClick(title, toggleLogVisibility, null, 1000);

        const controls = document.createElement('div');
        Object.assign(controls.style, { display: 'flex', gap: '8px', alignItems: 'center' });
        const opDown = document.createElement('button');
        opDown.textContent = '- Opacity';
        opDown.addEventListener('click', () => {
            currentOpacity = Math.max(0.2, parseFloat((currentOpacity - 0.1).toFixed(2)));
            localStorage.setItem(OPACITY_KEY, currentOpacity);
            applyTheme(panel);
        });
        const opUp = document.createElement('button');
        opUp.textContent = '+ Opacity';
        opUp.addEventListener('click', () => {
            currentOpacity = Math.min(1, parseFloat((currentOpacity + 0.1).toFixed(2)));
            localStorage.setItem(OPACITY_KEY, currentOpacity);
            applyTheme(panel);
        });
        const manualBtn = document.createElement('button');
        manualBtn.textContent = 'Manual LRC';
        manualBtn.onclick = () => {
            const trackKey = currentTrackId;
            showManualLyricsMenu(trackKey);
        };
        const ghIcon = document.createElement('div');
        Object.assign(ghIcon.style, { display: 'flex', alignItems: 'center', paddingTop: '5px', fontSize: '14px' });
        ghIcon.innerHTML = `<a href="https://github.com/jayxdcode" target="_blank" title="View on GitHub" style="opacity:0.8; color:white"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg></a>`;
        controls.append(manualBtn, opDown, opUp, ghIcon);
        header.appendChild(controls);
        controls.querySelectorAll('button').forEach(btn => Object.assign(btn.style, { background: 'transparent', color: '#fff', border: '2px solid #333', borderRadius: '4px', padding: '6px 10px', fontSize: '14px', cursor: 'pointer', transition: 'opacity 0.2s' }));
        const content = document.createElement('div');
        content.id = 'tm-lyrics-lines';
        Object.assign(content.style, { padding: '12px', overflowY: 'auto', scrollBehavior: 'smooth', flex: '1 1 auto', minHeight: '0' });
        content.innerHTML = '<em>Lyrics will appear here</em>';
        const resizeHandle = document.createElement('div');
        resizeHandle.id = 'tm-lyrics-resize';
        Object.assign(resizeHandle.style, { position: 'absolute', right: '1px', bottom: '.5px', width: '18px', height: '18px', cursor: 'nwse-resize', background: 'linear-gradient(135deg,transparent 60%,#888 60%)', opacity: 1 });
        panel.appendChild(header);
        panel.appendChild(content);
        panel.appendChild(resizeHandle);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        applyTheme(panel);

        // Drag logic
        let dragX = 0,
            dragY = 0;
        header.addEventListener('mousedown', e => {
            if (dragLocked) return;
            isDragging = true;
            dragX = e.clientX - panel.offsetLeft;
            dragY = e.clientY - panel.offsetTop;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            let x = e.clientX - dragX;
            let y = e.clientY - dragY;
            x = Math.min(Math.max(0, x), window.innerWidth - panel.offsetWidth);
            y = Math.min(Math.max(0, y), window.innerHeight - panel.offsetHeight);
            panel.style.left = x + 'px';
            panel.style.top = y + 'px';
        });
        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            document.body.style.userSelect = '';
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ left: panel.style.left, top: panel.style.top }));
        });

        // Touch drag
        header.addEventListener('touchstart', e => {
            if (dragLocked) return;
            const t = e.touches[0];
            isDragging = true;
            dragX = t.clientX - panel.offsetLeft;
            dragY = t.clientY - panel.offsetTop;
            document.body.style.userSelect = 'none';
        }, { passive: false });
        document.addEventListener('touchmove', e => {
            if (!isDragging) return;
            const t = e.touches[0];
            let x = t.clientX - dragX;
            let y = t.clientY - dragY;
            x = Math.min(Math.max(0, x), window.innerWidth - panel.offsetWidth);
            y = Math.min(Math.max(0, y), window.innerHeight - panel.offsetHeight);
            panel.style.left = x + 'px';
            panel.style.top = y + 'px';
        }, { passive: false });
        document.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            document.body.style.userSelect = '';
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ left: panel.style.left, top: panel.style.top }));
        });

        // Resize logic
        let startW, startH, startX, startY;
        resizeHandle.addEventListener('mousedown', e => {
            isResizing = true;
            startW = panel.offsetWidth;
            startH = panel.offsetHeight;
            startX = e.clientX;
            startY = e.clientY;
            e.preventDefault();
            e.stopPropagation();
        });
        document.addEventListener('mousemove', e => {
            if (!isResizing) return;
            let w = Math.max(200, startW + e.clientX - startX);
            let h = Math.max(120, startH + e.clientY - startY);
            w = Math.min(w, window.innerWidth - panel.offsetLeft);
            h = Math.min(h, window.innerHeight - panel.offsetTop);
            panel.style.width = w + 'px';
            panel.style.height = h + 'px';
        });
        document.addEventListener('mouseup', () => {
            if (!isResizing) return;
            isResizing = false;
            localStorage.setItem(SIZE_KEY, JSON.stringify({ width: panel.style.width, height: panel.style.height }));
        });
        resizeHandle.addEventListener('touchstart', e => {
            const t = e.touches[0];
            isResizing = true;
            startW = panel.offsetWidth;
            startH = panel.offsetHeight;
            startX = t.clientX;
            startY = t.clientY;
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false });
        document.addEventListener('touchmove', e => {
            if (!isResizing) return;
            const t = e.touches[0];
            let w = Math.max(200, startW + t.clientX - startX);
            let h = Math.max(120, startH + t.clientY - startY);
            w = Math.min(w, window.innerWidth - panel.offsetLeft);
            h = Math.min(h, window.innerHeight - panel.offsetTop);
            panel.style.width = w + 'px';
            panel.style.height = h + 'px';
        }, { passive: false });
        document.addEventListener('touchend', () => {
            if (!isResizing) return;
            isResizing = false;
            localStorage.setItem(SIZE_KEY, JSON.stringify({ width: panel.style.width, height: panel.style.height }));
        });
    }


    function applyTheme(panel) {
        const header = panel.querySelector('#tm-lyrics-header');
        if (currentTheme === 'light') {
            panel.style.background = `rgba(245, 245, 245, ${currentOpacity})`;
            panel.style.color = '#000';
            if (header) header.style.background = `rgba(220, 220, 220, ${currentOpacity})`;
        } else {
            panel.style.background = `rgba(0, 0, 0, ${currentOpacity})`;
            panel.style.color = '#fff';
            if (header) header.style.background = `rgba(33, 33, 33, ${currentOpacity})`;
        }
    }

    function gmFetch(url, headers = {}) {
        if (typeof GM_xmlhttpRequest === 'function') {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    headers,
                    onload: res => resolve(res),
                    onerror: err => reject(err),
                    ontimeout: () => reject(new Error('Request timed out'))
                });
            });
        } else {
            // Use native fetch if GM_xmlhttpRequest is not available
            return fetch(url, { headers })
                .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response;
            })
                .catch(error => {
                throw new Error(`Fetch failed: ${error.message}`);
            });
        }
    }

    function toggleLogVisibility() {
        const logs = document.getElementById('tm-logs');
        logs.style.display = logVisible ? 'block' : 'none';
        logVisible = logVisible ? false : true;
    }

    /**
 * Attaches a long click detection to a DOM element.
 *
 * @param {HTMLElement} element The DOM element to attach the listener to.
 * @param {function} onLongClick Callback function to execute when a long click is detected.
 * @param {function} [onShortClick] Optional callback for a short click. If not provided,
 * only long clicks will trigger a callback.
 * @param {number} [longClickThreshold=500] The duration in milliseconds to consider a click "long".
 */
    function detectLongClick(element, onLongClick, onShortClick, longClickThreshold = 500) {
        let pressTimer;
        let isLongClickTriggered = false; // Flag to prevent short click after long click

        if (!element || typeof onLongClick !== 'function') {
            console.error("detectLongClick: Invalid element or onLongClick callback provided.");
            return;
        }

        const startTimer = () => {
            isLongClickTriggered = false; // Reset flag for new press
            pressTimer = setTimeout(() => {
                isLongClickTriggered = true;
                onLongClick();
            }, longClickThreshold);
        };

        const clearTimer = () => {
            clearTimeout(pressTimer);
        };

        // --- Mouse Events ---
        element.addEventListener('mousedown', (event) => {
            // Prevent right-click from triggering long-click for mouse events
            if (event.button === 2) {
                return;
            }
            startTimer();
        });

        element.addEventListener('mouseup', () => {
            clearTimer();
            // Only trigger short click if long click wasn't triggered
            if (!isLongClickTriggered && typeof onShortClick === 'function') {
                onShortClick();
            }
        });

        // If mouse leaves the element while pressed (important to clear timer)
        element.addEventListener('mouseleave', () => {
            clearTimer();
            // Reset long click flag if mouse leaves, preventing accidental short click if re-entered
            isLongClickTriggered = false;
        });

        // --- Touch Events ---
        // Using passive: true for better scroll performance. If you need to prevent default
        // browser behavior (like scrolling/zooming on touch), set to false and handle `event.preventDefault()`.
        element.addEventListener('touchstart', (event) => {
            // event.preventDefault(); // Uncomment if you need to prevent default touch behaviors
            startTimer();
        }, { passive: true });

        element.addEventListener('touchend', () => {
            clearTimer();
            if (!isLongClickTriggered && typeof onShortClick === 'function') {
                onShortClick();
            }
        }, { passive: true });

        element.addEventListener('touchcancel', () => {
            clearTimer();
            isLongClickTriggered = false; // Reset if touch is interrupted (e.g., phone call)
        }, { passive: true });
    }



    async function parseAl(url = null) {
        try { if (!url) return ''; const res = await fetch(url); const html = await res.text(); const doc = new DOMParser().parseFromString(html, 'text/html'); const titleText = doc.querySelector('title')?.textContent; if (titleText) { const match = titleText.match(/^(.*?) - Album by .*? \| Spotify$/); if (match && match.length > 1) return match[1]; } } catch (e) { debug('parseAl error:', e); }
        return '';
    }

    /**
     * [RESTORED] Fetch up to 3 Genius English Translation links via strict Google search.
     */
    async function fetchStrictGeniusLinks(title, artist) {
        if (!title || !artist) return [];
        const query = `site:genius.com ${title} ${artist} "(english translation)"`;
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        debug(`🔍 Google search for Genius link: ${googleSearchUrl}`);
        try {
            const searchRes = await gmFetch(googleSearchUrl, { 'User-Agent': 'Mozilla/5.0' });
            const doc = new DOMParser().parseFromString(searchRes.responseText, 'text/html');
            const anchors = Array.from(doc.querySelectorAll('a[href^="/url?q=https://genius.com/Genius-english-translations-"]'));
            const geniusLinks = [];
            for (let a of anchors) {
                if (geniusLinks.length >= 3) break;
                const href = a.getAttribute('href');
                const match = href.match(/\/url\?q=(https:\/\/genius\.com\/Genius-english-translations-[^&]+)/i);
                if (match && match[1]) {
                    const decoded = decodeURIComponent(match[1]);
                    if (!geniusLinks.includes(decoded)) geniusLinks.push(decoded);
                }
            }
            debug('✅ Found Genius links via Google:', geniusLinks);
            return geniusLinks;
        } catch (err) {
            debug('[⚠️ WARNING] ❌ Failed to fetch Google search results:', err);
            return [];
        }
    }

    /**
     * [NEW & FIXED] Scrapes the lyrics from a given Genius URL.
     */
    async function scrapeGeniusUrl(url) {
        if (!url) return null;
        debug(`📄 Scraping Genius URL: ${url}`);
        try {
            const pageRes = await gmFetch(url, { 'User-Agent': 'Mozilla/5.0' });
            const doc = new DOMParser().parseFromString(pageRes.responseText, 'text/html');
            const containers = doc.querySelectorAll('div[data-lyrics-container="true"]');
            if (!containers.length) throw new Error('No lyrics containers found on page.');

            const blocks = [];
            containers.forEach(div => {
                const clone = div.cloneNode(true);
                clone.querySelectorAll('[data-exclude-from-selection="true"]').forEach(e => e.remove());
                blocks.push(clone.innerText.trim());
            });

            const lyrics = blocks.join('\n\n').trim();
            debug('✅ Successfully scraped lyrics from Genius page.');
            return lyrics;
        } catch (err) {
            debug(`[⚠️ WARNING] ❌ Failed to scrape Genius URL ${url}:`, err);
            return null;
        }
    }

    async function fetchTranslations(lrcText, geniusTr, title, artist) {
        try {
            const response = await fetch(BACKEND_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lrcText, geniusLyrics: geniusTr, title, artist }), // Changed key to match backend
            });
            if (!response.ok) {
                const errorBody = await response.text();
                debug('[❗ERROR] Backend server returned an error:', response.status, errorBody);
                return { rom: "", transl: "" };
            }
            const data = await response.json();
            debug('Received backend data:', data);
            return data;
        } catch (error) {
            debug('[❗ERROR] Failed to fetch from backend server:', error);
            return { rom: "", transl: "" };
        }
    }

    function parseLRCToArray(lrc) {
        if (!lrc) return [];
        const lines = [];
        const regex = /\[(\d+):(\d+)(?:\.(\d+))?\](.*)/g;
        for (const raw of lrc.split('\n')) {
            let matches, l = raw;
            while ((matches = regex.exec(l)) !== null) {
                const time = parseInt(matches[1], 10) * 60000 + parseInt(matches[2], 10) * 1000 + (matches[3] ? parseInt(matches[3].padEnd(3, '0'), 10) : 0);
                lines.push({ time, text: l.replace(/\[\d+:\d+(?:\.\d+)?\]/g, '').trim() });
            }
            regex.lastIndex = 0;
        }
        lines.sort((a, b) => a.time - b.time);
        if (lines.length && lines[0].time !== 0) lines.unshift({ time: 0, text: '' });
        return lines;
    }

    function mergeLRC(origArr, romArr, transArr) {
        const romMap = new Map(romArr.map(r => [r.time, r.text]));
        const transMap = new Map(transArr.map(t => [t.time, t.text]));
        return origArr.map(o => ({ time: o.time, text: o.text, roman: romMap.get(o.time) || '', trans: transMap.get(o.time) || '' }));
    }

    function parseLRC(lrc, romLrc, translLrc) {
        return mergeLRC(parseLRCToArray(lrc), parseLRCToArray(romLrc), parseLRCToArray(translLrc));
    }

    async function loadLyrics(title, artist, album, duration, onTransReady, manual = { flag: false, query: "" }) {
        if (!manual.flag) debug('Searching for lyrics:', title, artist, album, duration);
        else debug(`Manually searching lyrics: using user prompt "${manual.query}"...`);

        const trackKey = `${title}|${artist}`;
        let geniusLyrics = null;

        try {
            // --- 0) Attempt to get Genius lyrics first ---
            /*  PLACEHOLDER
            if (!manual.flag) {
                const geniusLinks = await fetchStrictGeniusLinks(title, artist);
                if (geniusLinks.length > 0) {
                    geniusLyrics = await scrapeGeniusUrl(geniusLinks[0]);
                }
            }
            */

            // --- 1) Manual override check ---
            if (lyricsConfig[trackKey]?.manualLrc && !manual.flag) {
                const { manualLrc, offset = 0 } = lyricsConfig[trackKey];
                onTransReady(parseLRC(manualLrc, '', '').map(l => ({ ...l, time: l.time + offset })));
                const { rom, transl } = await fetchTranslations(manualLrc, geniusLyrics, title, artist);
                onTransReady(parseLRC(manualLrc, rom, transl).map(l => ({ ...l, time: l.time + offset })));
                const searchRes = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent([title, artist, album].join(' '))}`);
                if (searchRes.ok) lastCandidates = await searchRes.json();
                return;
            }

            // --- 2) Fetch from lrclib (with fallback) ---
            const primaryMetadata = manual.flag ? manual.query : [title, artist, album].filter(Boolean).join(' ');
            let searchRes = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(primaryMetadata)}`);
            if (!searchRes.ok) throw new Error('lrclib search failed');
            let searchData = await searchRes.json();

            if (!Array.isArray(searchData) || !searchData.some(c => c.syncedLyrics)) {
                if (!manual.flag && album) {
                    debug('Retrying lrclib search without album.');
                    const fallbackRes = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent([title, artist].join(' '))}`);
                    if (fallbackRes.ok) searchData = await fallbackRes.json();
                }
            }
            lastCandidates = Array.isArray(searchData) ? searchData : [];

            // --- 3) Pick best candidate ---
            let candidate = null,
                minDelta = Infinity;
            lastCandidates.filter(c => c.syncedLyrics).forEach(c => {
                const delta = Math.abs(Number(c.duration) - duration);
                if (delta < minDelta && delta < 8000) {
                    candidate = c;
                    minDelta = delta;
                }
            });
            if (!candidate && lastCandidates.length > 0) candidate = lastCandidates[0];

            if (!candidate || (!candidate.syncedLyrics && !candidate.plainLyrics)) {
                onTransReady([{ time: 0, text: 'Failed to find any lyrics for this track.', roman: '', trans: '' }]);
                return;
            }

            // --- 4) Process candidate and get translations ---
            const rawLrc = candidate.syncedLyrics || `[00:00.01] ${candidate.plainLyrics}`;
            onTransReady(parseLRC(rawLrc, '', '')); // Render original lyrics immediately
            const { rom, transl } = await fetchTranslations(rawLrc, geniusLyrics, title, artist);
            onTransReady(parseLRC(rawLrc, rom, transl));

        } catch (e) {
            // alert(`Error while displaying lrc: ${e} \n\n\n Please report this to \n\nhttps://github.com/jayxdcode/src-backend/issues\n\nalongside with a screenshot of this alert.`);
            debug('[❗ERROR] [Lyrics] loadLyrics error:', `${e}`);
            onTransReady([{ time: 0, text: 'An error occurred while loading lyrics.', roman: '', trans: '' }]);
        }
    }

    function parseTimeString(str) {
        if (!str) return 0;
        const parts = str.split(':').map(Number);
        return parts.length === 2 ? (parts[0] * 60 + parts[1]) * 1000 : (parts.length === 3 ? (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000 : 0);
    }

    function addTimeJumpListener() {
        const lyricLinesWithTimestamp = document.querySelectorAll('#tm-lyrics-lines [timestamp]');

        lyricLinesWithTimestamp.forEach(element => {
            const timestampValue = element.getAttribute('timestamp');
            if (timestampValue) {
                element.addEventListener('click', () => timeJump(timestampValue));
            }
        });
    }

    async function getTrackInfo() {
        const bar = document.querySelector('[data-testid="now-playing-bar"], [data-testid="main-view-player-bar"], [data-testid="bottom-bar"], footer');
        if (!bar) return null;
        const titleEl = bar.querySelector('[data-testid="context-item-info-title"] [data-testid="context-item-link"], [data-testid="nowplaying-track-link"], [data-testid="now-playing-widget-title"] a, .track-info__name a');
        const artistEl = bar.querySelector('[data-testid="context-item-info-artist"], [data-testid="nowplaying-artist"], [data-testid="now-playing-widget-artist"] a, .track-info__artists a');
        const title = titleEl?.textContent.trim() || '';
        const artist = artistEl?.textContent.trim() || '';
        const album = titleEl?.href ? await parseAl(titleEl.href) : '';
        const durationEl = bar.querySelector('[data-testid="playback-duration"], [data-testid="playback_duration"]');
        const duration = durationEl ? parseTimeString(durationEl.textContent.trim()) : null;
        currentTrackDur = duration;
        return { id: title + '|' + artist, title, artist, album, duration, bar };
    }

    function getProgressBarTimeMs(bar, durationMs) {
        if (!bar || !durationMs) return 0;
        const pbar = bar.querySelector('[data-testid="progress-bar"]');
        if (pbar?.style) {
            const match = pbar.style.cssText.match(/--progress-bar-transform:\s*([\d.]+)%/);
            if (match?.[1]) return durationMs * parseFloat(match[1]) / 100;
        }
        const slider = bar.querySelector('div[role="slider"][aria-valuenow]');
        if (slider) return Number(slider.getAttribute('aria-valuenow'));
        const input = bar.querySelector('input[type="range"]');
        if (input) return durationMs * Number(input.value) / Number(input.max);
        const posEl = bar.querySelector('[data-testid="player-position"]');
        if (posEl) return parseTimeString(posEl.textContent.trim());
        return 0;
    }

    function renderLyrics(currentIdx) {
        const linesDiv = document.getElementById('tm-lyrics-lines');
        if (!linesDiv) return;
        let html = '';
        const color = currentTheme === 'light' ? '#000' : '#fff';
        const subColor = currentTheme === 'light' ? '#555' : '#ccc';
        const start = Math.max(0, currentIdx - 70);
        const end = Math.min(lyricsData.length - 1, currentIdx + 70);

        for (let i = start; i <= end; i++) {
            const ln = lyricsData[i];

            if (!ln.text && !ln.roman && !ln.trans) {
                html += `<div class="tm-lyric-line" style="min-height:1.6em;"> </div>`;
                continue;
            }
            const lineClass = i === currentIdx ? `tm-lrc-${i} tm-lyric-current` : `tm-lrc-${i} tm-lyric-line`;
            const lineStyle = `white-space: pre-wrap; color:${color}; ${i === currentIdx ? "font-weight:bold;" : "opacity:.7;"} margin:10px 0; min-height:1.6em; display:block;`;
            html += `<div class="${lineClass}" style="${lineStyle}" timestamp=${ln.time}>${ln.text || ' '}`;
            if (ln.roman && ln.text.trim() !== ln.roman.trim()) html += `<div style="font-size:.75em; color:${subColor}; margin-top:2px;">${ln.roman}</div>`;
            if (ln.trans && ln.text.trim() !== ln.trans.trim()) html += `<div style="font-size:.75em; color:${subColor}; margin-top:2px;">${ln.trans}</div>`;
            html += `</div>`;
        }
        linesDiv.innerHTML = html;

        const currElem = linesDiv.querySelector('.tm-lyric-current');
        if (currElem) {
            linesDiv.scrollTop = currElem.offsetTop - linesDiv.clientHeight / 2 + currElem.offsetHeight / 2;
        }

        addTimeJumpListener();
    }

    function syncLyrics(bar, durationMs) {
        if (!bar || !lyricsData || lyricsData.length === 0) return;
        let t = getProgressBarTimeMs(bar, durationMs);
        if (lyricsData.length === 1) {
            if (lastRenderedIdx !== 0) {
                renderLyrics(0);
                lastRenderedIdx = 0;
            }
            return;
        }
        let idx = lyricsData.findIndex((line, i) => i === lyricsData.length - 1 || (line.time <= t && t < lyricsData[i + 1].time));
        if (idx === -1) idx = lyricsData.length - 1;
        if (idx !== lastRenderedIdx) {
            renderLyrics(idx);
            lastRenderedIdx = idx;
        }
    }

    function setupProgressSync(bar, durationMs) {
        if (!bar) return;
        if (observer) observer.disconnect();
        if (syncIntervalId) clearInterval(syncIntervalId);
        const pbar = bar.querySelector('[data-testid="progress-bar"], div[role="slider"]');
        if (pbar) {
            observer = new MutationObserver(() => syncLyrics(bar, durationMs));
            observer.observe(pbar, { attributes: true, attributeFilter: ['style', 'aria-valuenow'] });
        }
        syncIntervalId = setInterval(() => syncLyrics(bar, durationMs), 300);
    }

    /*
       LRC time jump logic
    */
    // window.timeJump =
    function timeJump(timestamp) {
        const progressInput = document.querySelector("[data-testid='playback-progressbar'] input");

        const minOffset = 100;
        const maxOffset = 200;

        const randOffset = Math.random() * (maxOffset - minOffset) + minOffset;

        const seekTo = Math.min(timestamp, progressInput.max);
        progressInput.value = seekTo - randOffset;

        progressInput.dispatchEvent(new Event('input', { bubbles: true }));
        progressInput.dispatchEvent(new Event('change', { bubbles: true }));
    };

    async function poller() {
        try {
            const info = await getTrackInfo();
            if (!info || !info.title || !info.artist) return;
            if (info.id !== currentTrackId) {
                debug('Track changed:', info.title, '-', info.artist);
                currentTrackId = info.id;
                currInf = info;
                lyricsData = null;
                lastRenderedIdx = -1;
                const lines = document.getElementById('tm-lyrics-lines');
                if (lines) lines.innerHTML = '<em>Loading lyrics...</em>';
                await loadLyrics(info.title, info.artist, info.album, info.duration, (parsed) => {
                    lyricsData = parsed;
                    renderLyrics(0);
                    setupProgressSync(info.bar, info.duration);
                });
            }
        } catch (e) {
            debug('[❗ERROR] [Poller Error]', e);
        }
    }

    /**
     * Creates and appends a hidden <div> to the page to serve as a log container.
     * This is called once during the script's initialization.
     */
    function setupLogElement() {
        // Create the main container for logs
        const logs = document.createElement('div');
        logs.id = 'tm-logs';

        // Style it to be hidden by default but available for inspection
        Object.assign(logs.style, {
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            width: '400px',
            height: '300px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#0f0',
            fontFamily: 'monospace',
            fontSize: '12px',
            zIndex: '10001',
            overflowY: 'scroll',
            padding: '10px',
            border: '1px solid #333',
            borderRadius: '5px',
            display: 'none' // Hidden by default
        });

        // Add it to the page
        document.body.appendChild(logs);

        console.log('[Lyrics] Log element created. To view it, run this in the console:');
        console.log("document.getElementById('tm-logs').style.display = 'block';");
    }

    // Example of how to call it when your script starts:
    // setupLogElement();

    // function debug(...args) { console.log('[Lyrics]', ...args); }

    /**
     * Logs messages to the console and a dedicated <div> for on-page debugging.
     * @param {...any} args - The values to log.
     */
    function debug(...args) {
        // Also log to the standard developer console
        console.log('[Lyrics]', ...args);

        // Find the log container element on the page
        const logs = document.body.querySelector('#tm-logs');
        if (logs) {
            // Format arguments for HTML display, handling objects with JSON.stringify
            const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ');
            // Append the new log message
            logs.innerHTML += `<div style='margin: .75em;'>${message}</div>`;
            // Auto-scroll to the bottom
            logs.scrollTop = logs.scrollHeight;
        }
    }

    function init() {
        setupLogElement();

        debug('Initializing Lyrics Panel');
        createPanel();
        window.addEventListener('resize', debounce(handleViewportChange, 250));
        setInterval(poller, POLL_INTERVAL);
    }

    // Wait for the main UI to be available before initializing
    const readyObserver = new MutationObserver((mutations, obs) => {
        if (document.querySelector('[data-testid="now-playing-bar"], [data-testid="main-view-player-bar"]')) {
            obs.disconnect();
            init();
        }
    });
    readyObserver.observe(document.body, { childList: true, subtree: true });
// -- end --
})();
