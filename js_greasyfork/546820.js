// ==UserScript==
// @name         Streamwurstbuden Overlay für wplace.live
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Erweitertes Overlay für wplace.live
// @author       letsi
// @license      MIT
// @match        https://wplace.live/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546820/Streamwurstbuden%20Overlay%20f%C3%BCr%20wplacelive.user.js
// @updateURL https://update.greasyfork.org/scripts/546820/Streamwurstbuden%20Overlay%20f%C3%BCr%20wplacelive.meta.js
// ==/UserScript==

(() => {
    // ========== KONFIG ==========
    const TILE_SIZE = 3000;
    const BOARD_PER_WPLACE = 3;

    // API
    const API_BASE = 'https://wplace.tuffifly.de';
    const API_URL = `${API_BASE}/api/wplace/submissions`;
    const API_PROXY = `${API_BASE}/api/wplace/fetch-image?url=`;

    const DEFAULT_STATE = {
        showFinal: true,
        showPixel: false,
        finalOpacity: 90,
        pixelOpacity: 100,
        panelCollapsed: false,
        panelX: null,
        panelY: null
    };
    const STORAGE_KEY = 'wplace-overlay-api-v2';

    // ===== STATE =====
    let state = (() => {
        try {
            return Object.assign(
                {},
                DEFAULT_STATE,
                JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
            );
        } catch {
            return {
                ...DEFAULT_STATE
            };
        }
    })();
    const saveState = () => localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );

    let submissions = [];
    const bitmapCache = new Map();
    const blobCache = new Map();

    // ========== HELPERS ==========
    function matchTileUrl(urlStr) {
        try {
            const u = new URL(urlStr, location.href);
            if (u.hostname !== 'backend.wplace.live') return null;
            const m = u
            .pathname
            .match(/\/files\/s0\/tiles\/(\d+)\/(\d+)\.png$/i);
            return m
                ? {
                c1: +m[1],
                c2: +m[2]
            }
            : null;
        } catch {
            return null;
        }
    }

    function worldTopLeftOf(sub) {
        const x = Number(sub.x) | 0;
        const y = Number(sub.y) | 0;
        const isBoard = (x % BOARD_PER_WPLACE === 0) && (y % BOARD_PER_WPLACE === 0);

        return {
            wx: sub.chunk1 * TILE_SIZE + (
                isBoard
                ? x
                : x * BOARD_PER_WPLACE
            ),
            wy: sub.chunk2 * TILE_SIZE + (
                isBoard
                ? y
                : y * BOARD_PER_WPLACE
            )
        };
    }

    function intersect(ax, ay, aw, ah, bx, by, bw, bh) {
        const x1 = Math.max(ax, bx),
              y1 = Math.max(ay, by);
        const x2 = Math.min(ax + aw, bx + bw),
              y2 = Math.min(ay + ah, by + bh);
        const w = x2 - x1,
              h = y2 - y1;
        return (w > 0 && h > 0)
            ? {
            x: x1,
            y: y1,
            w,
            h
        }
        : null;
    }

    const proxied = (url) => `${API_PROXY}${encodeURIComponent(url)}`;

    async function getBlob(url, allowRetryToProxy = true) {
        if (blobCache.has(url)) return blobCache.get(url);
        try {
            const res = await fetch(url, {cache: 'no-store'});
            if (!res.ok) throw new Error(`fetch ${res.status}`);
            const blob = await res.blob();
            blobCache.set(url, blob);
            return blob;
        } catch (e) {
            if (allowRetryToProxy && !url.startsWith(API_PROXY)) {
                return await getBlob(proxied(url), false);
            }
            throw e;
        }
    }

    async function getSubmissionBitmap(sub) {
        if (bitmapCache.has(sub.id)) return bitmapCache.get(sub.id);

        const blob = await getBlob(sub.url, true);
        const bmp = await createImageBitmap(blob);
        const out = {
            bitmap: bmp,
            width: bmp.width,
            height: bmp.height
        };
        bitmapCache.set(sub.id, out);
        return out;
    }

    async function loadSubmissions() {
        const res = await fetch(API_URL, {cache: 'no-store'});
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();
        const arr = Array.isArray(
            data
            ?.submissions
        )
        ? data.submissions
        : [];
        submissions = arr
            .filter(
            s => s
            ?.url && (s.enabled ?? true)
        )
            .map(s => ({
            id: String(s.id ?? s.url),
            url: String(s.url),
            chunk1: Number(s.chunk1) | 0,
            chunk2: Number(s.chunk2) | 0,
            x: Number(s.x) | 0,
            y: Number(s.y) | 0
        }));
    }

    // ========== RENDER ==========
    async function drawFinalPart(ctx, tile, sub) {
        const {bitmap, width, height} = await getSubmissionBitmap(sub);
        const {wx, wy} = worldTopLeftOf(sub);
        const tileWX = tile.c1 * TILE_SIZE,
              tileWY = tile.c2 * TILE_SIZE;

        const isect = intersect(
            wx,
            wy,
            width,
            height,
            tileWX,
            tileWY,
            TILE_SIZE,
            TILE_SIZE
        );
        if (!isect) return;

        const sx = isect.x - wx,
              sy = isect.y - wy,
              sw = isect.w,
              sh = isect.h;
        const dx = isect.x - tileWX,
              dy = isect.y - tileWY;

        ctx.globalAlpha = state.finalOpacity / 100;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(bitmap, sx, sy, sw, sh, dx, dy, sw, sh);
    }

    const offscreen = document.createElement('canvas');
    const offctx = offscreen.getContext('2d', {willReadFrequently: true});

    async function drawPixelPart(ctx, tile, sub) {
        const {bitmap, width, height} = await getSubmissionBitmap(sub);
        const {wx, wy} = worldTopLeftOf(sub);
        const tileWX = tile.c1 * TILE_SIZE,
              tileWY = tile.c2 * TILE_SIZE;

        const isect = intersect(
            wx,
            wy,
            width,
            height,
            tileWX,
            tileWY,
            TILE_SIZE,
            TILE_SIZE
        );
        if (!isect) return;

        const sx = isect.x - wx,
              sy = isect.y - wy,
              sw = isect.w,
              sh = isect.h;
        const dx = isect.x - tileWX,
              dy = isect.y - tileWY;

        offscreen.width = sw;
        offscreen.height = sh;
        offctx.imageSmoothingEnabled = false;
        offctx.clearRect(0, 0, sw, sh);

        offctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, sw, sh);

        try {
            const img = offctx.getImageData(0, 0, sw, sh);
            const data = img.data;
            for (let y = 0; y < sh; y++) {
                for (let x = 0; x < sw; x++) {
                    const i = (y * sw + x) * 4;
                    if ((x % 3) !== 1 || (y % 3) !== 1) data[i + 3] = 0;
                }
            }
            offctx.putImageData(img, 0, 0);
        } catch {}

        ctx.globalAlpha = state.pixelOpacity / 100;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(offscreen, 0, 0, sw, sh, dx, dy, sw, sh);
    }

    async function composeTile(originalBlob, tile) {
        const origBmp = await createImageBitmap(originalBlob);
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE;
        canvas.height = TILE_SIZE;
        const ctx = canvas.getContext('2d', {willReadFrequently: false});
        ctx.imageSmoothingEnabled = false;

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(origBmp, 0, 0, TILE_SIZE, TILE_SIZE);

        if (state.showPixel) {
            for (const sub of submissions) {
                await drawPixelPart(ctx, tile, sub);
            }
        }
        if (state.showFinal) {
            for (const sub of submissions) {
                await drawFinalPart(ctx, tile, sub);
            }
        }

        return await new Promise((resolve, reject) => canvas.toBlob(
            b => b
            ? resolve(b)
            : reject(new Error('toBlob failed')),
            'image/png'
        ));
    }

    // ========== FETCH HOOK ==========
    const nativeFetch = window.fetch;
    let qCopyBtn = null;
    let liveLabel = null;
    let copiedLabel = null;
    let lastCoord = null;
    let lastCopiedText = '–';

    function updateLiveLabel() {
        if (!liveLabel) return;
        liveLabel.textContent = lastCoord
            ? `Auswahl: ${JSON.stringify({
            chunk1: lastCoord.chunk1, chunk2: lastCoord.chunk2, x: lastCoord.x, y: lastCoord.y})}`: 'Auswahl: –';
    }
    function updateCopiedLabel() {
        if (copiedLabel) copiedLabel.textContent = `kopiert: ${lastCopiedText}`;
    }
    function updateCopyButtonState() {
        if (!qCopyBtn) return;
        const enabled = !!lastCoord;
        qCopyBtn.disabled = !enabled;
        qCopyBtn.style.opacity = enabled
            ? '1'
        : '.5';
        qCopyBtn.style.cursor = enabled
            ? 'pointer'
        : 'not-allowed';
    }

    async function fetchProxy(target, thisArg, args) {
        const req = args[0];
        const url = typeof req === 'string'
        ? req
        : (
            req && req.url
            ? req.url
            : String(req)
        );

        try {
            const u = new URL(url, location.href);
            if (u.hostname === 'backend.wplace.live' && u.pathname.startsWith('/s0/pixel/')) {
                const parts = u
                .pathname
                .split('/');
                const chunkY = Number(parts.pop());
                const chunkX = Number(parts.pop());
                const x = Number(u.searchParams.get('x'));
                const y = Number(u.searchParams.get('y'));
                if (Number.isFinite(chunkX) && Number.isFinite(chunkY) && Number.isFinite(x) && Number.isFinite(y)) {
                    lastCoord = {
                        chunk1: chunkX,
                        chunk2: chunkY,
                        x,
                        y,
                        x_px: x * 3 + 1,
                        y_px: y * 3 + 1
                    };
                    updateLiveLabel();
                    updateCopyButtonState();
                }
            }
        } catch {}

        const tile = matchTileUrl(url);
        if (!tile || (!state.showFinal && !state.showPixel)) {
            return target.apply(thisArg, args);
        }
        try {
            const res = await target.apply(thisArg, args);
            if (!res.ok) return res;
            if (!state.showFinal && !state.showPixel) return res;

            const originalBlob = await res.blob();
            const composed = await composeTile(originalBlob, tile);

            return new Response(composed, {
                status: 200,
                statusText: 'OK',
                headers: {
                    'Content-Type': 'image/png',
                    'Cache-Control': res
                    .headers
                    .get('Cache-Control') || 'no-cache'
                }
            });
        } catch (e) {
            if (e?.name === 'AbortError') return target.apply(thisArg, args);
            console.error('[Overlay] compose failed:', e);
            return target.apply(thisArg, args);
        }
    }
    function installFetchHook() {
        if (window.fetch === fetchProxy) return;
        window.fetch = new Proxy(nativeFetch, {
            apply: (t, th, a) => fetchProxy(t, th, a)
        });
    }

    // ========== UI ==========
    let panel, header, collapseBtn, content, copiedWrap;

    function styleBtn(b) {
        Object.assign(b.style, {
            padding: '6px 10px',
            borderRadius: '8px',
            border: '1px solid #555',
            background: '#2d6cdf',
            color: '#fff',
            cursor: 'pointer'
        });
    }
    function mkBtn(label, onClick) {
        const b = document.createElement('button');
        b.textContent = label;
        styleBtn(b);
        b.addEventListener('click', (e) => {
            e.stopPropagation();
            onClick
                ?.(e);
        });
        return b;
    }
    function mkToggle(label, get, set) {
        const b = mkBtn('', () => {
            set(!get());
            apply();
        });
        const apply = () => {
            const on = get();
            b.textContent = `${label}`;
            b.style.background = on
                ? '#2e7d32'
            : '#333';
            b.style.border = on
                ? '1px solid #2e7d32'
            : '1px solid #555';
        };
        apply();
        return b;
    }
    function mkRange(label, min, max, step, get, set) {
        const wrap = document.createElement('label');
        wrap.style.display = 'grid';
        wrap.style.gridTemplateColumns = 'auto 1fr auto';
        wrap.style.alignItems = 'center';
        wrap.style.gap = '6px';
        const span = document.createElement('span');
        span.textContent = label;
        const out = document.createElement('span');
        out.textContent = String(get());
        const input = document.createElement('input');
        input.type = 'range';
        input.min = min;
        input.max = max;
        input.step = step;
        input.value = get();
        input.addEventListener('input', () => {
            set(Number(input.value));
            out.textContent = input.value;
            saveState();
            bumpTiles();
        });
        Object.assign(input.style, {width: '140px'});
        wrap.append(span, input, out);
        return wrap;
    }
    function mkSelect(label, options, get, set) {
        const wrap = document.createElement('label');
        wrap.style.display = 'grid';
        wrap.style.gridTemplateColumns = 'auto 1fr';
        wrap.style.alignItems = 'center';
        wrap.style.gap = '6px';
        const span = document.createElement('span');
        span.textContent = label;
        const sel = document.createElement('select');
        for (const [v, t] of options) {
            const o = document.createElement('option');
            o.value = v;
            o.textContent = t;
            sel.appendChild(o);
        }
        sel.value = get();
        sel.addEventListener('change', () => {
            set(sel.value);
            saveState();
            updateLiveLabel();
        });
        wrap.append(span, sel);
        return wrap;
    }

    let dragging = false, dragDX = 0, dragDY = 0;

    function buildUI() {
        if (document.getElementById('wplace-overlay-panel')) return;

        panel = document.createElement('div');
        panel.id = 'wplace-overlay-panel';
        Object.assign(panel.style, {
            position: 'fixed',
            top: (state.panelY ?? 12) + 'px',
            left: (state.panelX ?? 12) + 'px',
            zIndex: 1000000,
            minWidth: '260px',
            background: 'rgba(15,17,21,0.92)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 30px rgba(0,0,0,.45)',
            borderRadius: '12px',
            color: '#e6e6e6',
            font: '14px system-ui, sans-serif',
            userSelect: 'none',
            backdropFilter: 'blur(4px)',
            padding: '0'
        });

        // Header (Drag-Handle)
        header = document.createElement('div');
        Object.assign(header.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            padding: '8px 10px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            cursor: 'move',
            background: 'rgba(255,255,255,0.03)',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
        });
        const title = document.createElement('div');
        title.textContent = 'Streamwurstbuden Overlay';
        title.style.fontWeight = '600';

        collapseBtn = document.createElement('button');
        collapseBtn.textContent = state.panelCollapsed
            ? '▢'
        : '▣';
        styleBtn(collapseBtn);
        collapseBtn.style.cursor = 'pointer';

        header.append(title, collapseBtn);
        panel.appendChild(header);

        // Dragging
        header.addEventListener('mousedown', (e) => {
            dragging = true;
            dragDX = e.clientX - panel
                .getBoundingClientRect()
                .left;
            dragDY = e.clientY - panel
                .getBoundingClientRect()
                .top;
            e.preventDefault();
        });
        window.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            let x = e.clientX - dragDX;
            let y = e.clientY - dragDY;
            const vw = window.innerWidth,
                  vh = window.innerHeight;
            const rect = panel.getBoundingClientRect();
            x = Math.max(4, Math.min(vw - rect.width - 4, x));
            y = Math.max(4, Math.min(vh - rect.height - 4, y));
            panel.style.left = x + 'px';
            panel.style.top = y + 'px';
            state.panelX = x;
            state.panelY = y;
            saveState();
        });
        window.addEventListener('mouseup', () => {dragging = false});

        const quick = document.createElement('div');
        Object.assign(quick.style, {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, max-content)',
            gap: '8px',
            alignItems: 'center',
            padding: '8px 10px',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
        });
        const qPixel = mkToggle('Pixel', () => state.showPixel, v => {
            state.showPixel = v;
            saveState();
            bumpTiles();
        });
        const qFinal = mkToggle('Final', () => state.showFinal, v => {
            state.showFinal = v;
            saveState();
            bumpTiles();
        });

        const qReload = mkBtn('Overlay neu laden', async () => {
            try {
                await loadSubmissions();
                bitmapCache.clear();
                blobCache.clear();
                bumpTiles();
            } catch (e) {
                console.error('[Overlay] Overlay reload failed', e);
                alert('Overlay neu laden fehlgeschlagen (Konsole).');
            }
        });
        qCopyBtn = mkBtn('Koordinaten kopieren', async () => {
            if (!lastCoord) return;
            const text = JSON.stringify(
                {chunk1: lastCoord.chunk1, chunk2: lastCoord.chunk2, x: lastCoord.x, y: lastCoord.y}
            );
            try {
                await copyText(text);
                lastCopiedText = text;
                updateCopiedLabel();
                toast('Koordinate kopiert');
            } catch {
                alert(text);
            }
        });

        quick.append(qPixel, qFinal, qReload, qCopyBtn);
        panel.appendChild(quick);

        content = document.createElement('div');
        content.style.display = state.panelCollapsed
            ? 'none'
        : 'grid';
        content.style.gridTemplateColumns = '1fr 1fr';
        content.style.gap = '8px';
        content.style.padding = '10px';

        content.append(
            mkRange('Pixel Sichtbarkeit', 0, 100, 1, () => state.pixelOpacity, v => {
                state.pixelOpacity = v;
                saveState();
                bumpTiles();
            }),
            mkRange('Final Sichtbarkeit', 0, 100, 1, () => state.finalOpacity, v => {
                state.finalOpacity = v;
                saveState();
                bumpTiles();
            })
        );

        const infoRow = document.createElement('div');
        infoRow.style.gridColumn = '1 / -1';
        infoRow.style.display = 'grid';
        infoRow.style.gridTemplateColumns = '1fr';
        infoRow.style.gap = '6px';

        liveLabel = document.createElement('div');
        liveLabel.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, monospace';
        liveLabel.style.opacity = '0.9';

        copiedWrap = document.createElement('div');
        copiedWrap.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, monospace';
        copiedWrap.style.opacity = '0.9';
        copiedLabel = document.createElement('span');

        infoRow.appendChild(liveLabel);
        copiedWrap.appendChild(copiedLabel);
        infoRow.appendChild(copiedWrap);
        content.appendChild(infoRow);

        panel.appendChild(content);
        document
            .documentElement
            .appendChild(panel);

        collapseBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            state.panelCollapsed = !state.panelCollapsed;
            saveState();
            content.style.display = state.panelCollapsed
                ? 'none'
            : 'grid';
            collapseBtn.textContent = state.panelCollapsed
                ? '▢'
            : '▣';
        });

        makeToast();
        updateLiveLabel();
        updateCopiedLabel();
        updateCopyButtonState();
    }

    let raf = null;
    document.addEventListener('mousemove', (ev) => {
        if (panel && panel.contains(ev.target)) return;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
            if (!liveLabel) return;
            if (lastCoord) {
                return;
            }
            const c = coordinateFromPoint(ev.clientX, ev.clientY);
            if (c) {
                const text = JSON.stringify(
                    {chunk1: c.chunk1, chunk2: c.chunk2, x: c.x, y: c.y}
                );
                liveLabel.textContent = `Auswahl: ${text}`;
            } else {
                liveLabel.textContent = 'Auswahl: –';
            }
        });
    }, true);

    function coordinateFromPoint(clientX, clientY) {
        const el = document.elementFromPoint(clientX, clientY);
        if (!el || el.tagName !== 'IMG') return null;
        const tile = matchTileUrl(el.src);
        if (!tile) return null;

        const rect = el.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return null;

        const px = Math.floor((clientX - rect.left) * (TILE_SIZE / rect.width));
        const py = Math.floor((clientY - rect.top) * (TILE_SIZE / rect.height));
        if (px < 0 || py < 0 || px >= TILE_SIZE || py >= TILE_SIZE) return null;

        const xW = Math.floor(px / BOARD_PER_WPLACE);
        const yW = Math.floor(py / BOARD_PER_WPLACE);
        return {
            chunk1: tile.c1,
            chunk2: tile.c2,
            x: xW,
            y: yW,
            x_px: xW * 3 + 1,
            y_px: yW * 3 + 1
        };
    }

    // ========== UTIL ==========
    function bumpTiles() {
        for (const img of document.querySelectorAll('img')) {
            const t = matchTileUrl(img.src);
            if (t) {
                img.src = img
                    .src
                    .split('?')[0] + '?_=' + Date.now();
            }
        }
    }

    async function copyText(t) {
        try {
            await navigator
                .clipboard
                .writeText(t);
        } catch {
            throw new Error('Clipboard denied');
        }
    }

    // Toast Info
    let toastEl = null, toastTimer = null;
    function makeToast() {
        toastEl = document.createElement('div');
        Object.assign(toastEl.style, {
            position: 'fixed',
            top: '18px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(20,22,26,0.95)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.08)',
            zIndex: 1000002,
            display: 'none',
            font: '14px system-ui, sans-serif'
        });
        document
            .documentElement
            .appendChild(toastEl);
    }
    function toast(msg, ms = 1200) {
        if (!toastEl) makeToast();
        toastEl.textContent = msg;
        toastEl.style.display = 'block';
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {toastEl.style.display = 'none'}, ms);
    }

    // ========== BOOT ==========
    installFetchHook();
    loadSubmissions().then(bumpTiles).catch(
        e => console.error('[Overlay] API load failed:', e)
    );

    const ready = () => buildUI();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ready, {once: true});
    } else {
        ready();
    }
    window.addEventListener('load', () => setTimeout(installFetchHook, 0));
}
)();
