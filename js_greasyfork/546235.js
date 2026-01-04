// ==UserScript==
// @name         Genius Gradient Assistant 
// @namespace    https://genius.com/
// @version      2.387
// @description  Mass-edit gradient for album pages on Genius
// @author       thousandeyes
// @match        *://genius.com/*-lyrics
// @match        *://genius.com/*-lyrics?*
// @icon         https://imgur.com/qgv8m0o.png
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546235/Genius%20Gradient%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/546235/Genius%20Gradient%20Assistant.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    GM_addStyle(`
        #genius-gradient-batch-ui {
          position: fixed;
          bottom: 16px;
          right: 16px;
          background: #fff;
          padding: 16px;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 999999;
          width: 360px;
          font-family: 'Programme', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
 
        #genius-gradient-batch-ui input[type="text"] {
          width: 100%;
          padding: 8px;
          margin-bottom: 6px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background: #fff;
          color: #000;
        }
 
        #genius-gradient-batch-ui div {
          color: #333;
        }
 
        #genius-gradient-batch-ui button {
          padding: 10px;
          border: 1px solid #000000;
          border-radius: 10px;
          background: #f5f5f5;
          color: #000;
          cursor: pointer;
          font-family: 'Programme', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
 
        #genius-gradient-batch-ui button[aria-label="Close"] {
          background: transparent;
          border: none;
          color: #333;
          font-size: 16px;
        }
 
        #genius-gradient-batch-ui div[style*="max-height: 240px"] {
          background: #fafafa;
          border-radius: 8px;
          padding: 8px;
          overflow-y: auto;
        }
 
        #genius-gradient-batch-ui div[style*="height: 6px"] {
          background: #e0e0e0;
        }
 
        #genius-gradient-batch-ui div[style*="height: 6px"] > div {
          background: #ffd700;
        }
 
        #gradient-assistant-toggle {
          position: fixed;
          bottom: 16px;
          right: 16px;
          padding: 10px 16px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background: #f5f5f5;
          color: #000;
          cursor: pointer;
          font-family: 'Programme', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 500;
          z-index: 999998;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
 
        #gradient-assistant-toggle:hover {
          background: #e0e0e0;
        }
    `);
 
    function backgroundHandler(request) {
        if (request.type === "getCookie") {
            return new Promise((resolve) => {
                const token = getCsrf();
                resolve(token || null);
            });
        }
    }
 
    (function installNetworkHexTap() {
        const HEX6 = /^#?[0-9a-fA-F]{6}$/;
        const wantField = (k) => /song_art_primary_color|song_art_secondary_color/i.test(k);
        function normalizeHex6(s) {
            if (!s) return null;
            const m = String(s).match(/[0-9a-fA-F]{6}/);
            if (m) return "#" + m[0].toUpperCase();
            const rgbMatch = String(s).match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
            if (rgbMatch) {
                const r = Math.min(255, parseInt(rgbMatch[1], 10));
                const g = Math.min(255, parseInt(rgbMatch[2], 10));
                const b = Math.min(255, parseInt(rgbMatch[3], 10));
                return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase();
            }
            return null;
        }
        function pullFromObject(obj) {
            if (!obj || typeof obj !== "object") return null;
            let out = {};
            for (const k of Object.keys(obj)) {
                const v = obj[k];
                if (wantField(k) && typeof v === "string") {
                    const hex = normalizeHex6(v);
                    if (hex) out[k] = hex;
                }
            }
            return Object.keys(out).length ? out : null;
        }
        function pullFromUrlEncoded(str) {
            try {
                const p = new URLSearchParams(str);
                let out = {};
                for (const [k, v] of p.entries()) {
                    if (wantField(k)) {
                        const hex = normalizeHex6(v);
                        if (hex) out[k] = hex;
                    }
                }
                return Object.keys(out).length ? out : null;
            } catch (e) {
                return null;
            }
        }
        function maybeEmit(found, context) {
            if (!found) return;
            const colors = {
                primary: found.song_art_primary_color || found.primary,
                secondary: found.song_art_secondary_color || found.secondary
            };
            if (!HEX6.test(colors.primary)) colors.primary = null;
            if (!HEX6.test(colors.secondary)) colors.secondary = null;
            if (colors.primary || colors.secondary) {
                window.__lastSongArtHex = colors;
                window.dispatchEvent(new CustomEvent("song-art-hex", { detail: colors, bubbles: false }));
                console.log("[HEX tap]", context, colors);
            }
        }
        const _fetch = window.fetch;
        window.fetch = async function(input, init = {}) {
            try {
                let body = init && init.body;
                if (body) {
                    if (typeof body === "string") {
                        let found = null;
                        if (body.trim().startsWith("{")) {
                            try { found = pullFromObject(JSON.parse(body)); } catch {}
                        }
                        if (!found) found = pullFromUrlEncoded(body);
                        maybeEmit(found, "fetch:string-body");
                    } else if (body instanceof FormData) {
                        const obj = {};
                        for (const [k, v] of body.entries()) obj[k] = v;
                        maybeEmit(pullFromObject(obj), "fetch:formdata");
                    }
                }
            } catch (e) {
                console.warn("HEX tap(fetch) error:", e);
            }
            return _fetch.apply(this, arguments);
        };
        const _open = XMLHttpRequest.prototype.open;
        const _send = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(method, url) {
            this.__hexTapUrl = url;
            this.__hexTapMethod = method;
            return _open.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function(body) {
            try {
                if (typeof body === "string") {
                    let found = null;
                    if (body.trim().startsWith("{")) {
                        try { found = pullFromObject(JSON.parse(body)); } catch {}
                    }
                    if (!found) found = pullFromUrlEncoded(body);
                    maybeEmit(found, "xhr:string-body");
                } else if (body instanceof FormData) {
                    const obj = {};
                    for (const [k, v] of body.entries()) obj[k] = v;
                    maybeEmit(pullFromObject(obj), "xhr:formdata");
                }
            } catch (e) {
                console.warn("HEX tap(xhr) error:", e);
            }
            return _send.apply(this, arguments);
        };
    })();
 
    const uiId = "genius-gradient-batch-ui";
    function createUI() {
        if (document.getElementById(uiId)) return;
        const ui = document.createElement("div");
        ui.id = uiId;
        ui.style.position = "fixed";
        ui.style.bottom = "16px";
        ui.style.right = "16px";
        ui.style.zIndex = "999999";
        ui.style.background = "#fff";
        ui.style.borderRadius = "12px";
        ui.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
        ui.style.padding = "16px";
        ui.style.width = "360px";
        ui.style.display = "grid";
        ui.style.gap = "12px";
        ui.style.fontFamily = "'Programme', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
 
        const title = document.createElement("div");
        title.textContent = "Gradient Assistant";
        title.style.fontWeight = "600";
        title.style.fontSize = "16px";
        title.style.color = "#000";
 
        const copySection = document.createElement("div");
        copySection.style.display = "grid";
        copySection.style.gap = "6px";
        const copyLabel = document.createElement("div");
        copyLabel.textContent = "Current Gradient:";
        copyLabel.style.fontSize = "12px";
        copyLabel.style.color = "#333";
        const copyBtn = document.createElement("button");
        copyBtn.textContent = "Copy Gradient";
        copyBtn.style.padding = "8px";
        copyBtn.style.background = "#f5f5f5";
        copyBtn.style.color = "#000";
        copyBtn.style.border = "1px solid #ccc";
        copyBtn.style.borderRadius = "8px";
        copyBtn.style.cursor = "pointer";
        copyBtn.style.fontWeight = "500";
        copySection.appendChild(copyLabel);
        copySection.appendChild(copyBtn);
 
        const pasteSection = document.createElement("div");
        pasteSection.style.display = "grid";
        pasteSection.style.gap = "6px";
        const pasteLabel = document.createElement("div");
        pasteLabel.textContent = "Paste Gradient:";
        pasteLabel.style.fontSize = "12px";
        pasteLabel.style.color = "#333";
        const gradientInput = document.createElement("input");
        gradientInput.type = "text";
        gradientInput.id = "gradient-input";
        gradientInput.placeholder = "linear-gradient(...)";
        gradientInput.style.width = "100%";
        gradientInput.style.padding = "8px";
        gradientInput.style.borderRadius = "8px";
        gradientInput.style.border = "1px solid #ccc";
        gradientInput.style.background = "#fff";
        gradientInput.style.color = "#000";
        pasteSection.appendChild(pasteLabel);
        pasteSection.appendChild(gradientInput);
 
        const controls = document.createElement("div");
        controls.style.display = "grid";
        controls.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";
        controls.style.gap = "8px";
 
        function smallBtn(txt) {
            const b = document.createElement("button");
            b.textContent = txt;
            b.style.height = "50px";
            b.style.border = "1px solid #ccc";
            b.style.borderRadius = "8px";
            b.style.fontWeight = "500";
            b.style.cursor = "pointer";
            b.style.background = "#f5f5f5";
            b.style.color = "#000";
            b.style.width = "100%";
            b.style.boxSizing = "border-box";
            return b;
        }
 
        const reloadBtn = smallBtn("Reload tracks");
        const allBtn = smallBtn("Select all");
        const noneBtn = smallBtn("Deselect all");
        const applyBtn = document.createElement("button");
        applyBtn.textContent = "Apply to selected";
        applyBtn.style.height = "42px";
        applyBtn.style.border = "none";
        applyBtn.style.borderRadius = "8px";
        applyBtn.style.fontWeight = "600";
        applyBtn.style.cursor = "pointer";
        applyBtn.style.background = "rgba(255, 255, 100, 1)";
        applyBtn.style.color = "#000";
        applyBtn.style.gridColumn = "span 4";
        controls.appendChild(reloadBtn);
        controls.appendChild(allBtn);
        controls.appendChild(noneBtn);
        controls.appendChild(applyBtn);
 
        const listWrap = document.createElement("div");
        listWrap.style.display = "grid";
        listWrap.style.gap = "6px";
        const listTitle = document.createElement("div");
        listTitle.textContent = "Tracks in this album (pick which to update)";
        listTitle.style.fontSize = "12px";
        listTitle.style.color = "#333";
        const list = document.createElement("div");
        list.style.maxHeight = "240px";
        list.style.overflow = "auto";
        list.style.background = "#fafafa";
        list.style.borderRadius = "8px";
        list.style.padding = "8px";
        listWrap.appendChild(listTitle);
        listWrap.appendChild(list);
 
        const bar = document.createElement("div");
        bar.style.height = "6px";
        bar.style.background = "#e0e0e0";
        bar.style.borderRadius = "999px";
        const fill = document.createElement("div");
        fill.style.height = "100%";
        fill.style.width = "0%";
        fill.style.background = "#ffd700";
        fill.style.borderRadius = "inherit";
        bar.appendChild(fill);
 
        const status = document.createElement("div");
        status.style.fontSize = "12px";
        status.style.color = "#333";
        status.textContent = "Ready";
 
        const close = document.createElement("button");
        close.textContent = "×";
        close.style.position = "absolute";
        close.style.top = "8px";
        close.style.right = "8px";
        close.style.background = "transparent";
        close.style.color = "#333";
        close.style.border = "none";
        close.style.cursor = "pointer";
        close.style.fontSize = "16px";
        close.setAttribute("aria-label", "Close");
        close.onclick = () => ui.remove();
 
        ui.appendChild(close);
        ui.appendChild(title);
        ui.appendChild(copySection);
        ui.appendChild(pasteSection);
        ui.appendChild(controls);
        ui.appendChild(listWrap);
        ui.appendChild(bar);
        ui.appendChild(status);
        document.body.appendChild(ui);
 
        return { ui, copyBtn, gradientInput, list, status, fill, reloadBtn, allBtn, noneBtn, applyBtn };
    }
 
    async function findCurrentGradient() {
        const candidates = [
            ...document.querySelectorAll('[class*="header"], [class*="album"], [class*="art"]'),
            ...document.querySelectorAll('[style*="gradient"], [data-gradient], [data-colors]')
        ];
        for (const el of candidates) {
            const style = window.getComputedStyle(el);
            if (style.backgroundImage.includes('gradient')) {
                return style.backgroundImage;
            }
            if (el.dataset.gradient) {
                return el.dataset.gradient;
            }
            if (el.dataset.primaryColor && el.dataset.secondaryColor) {
                return `linear-gradient(135deg, ${el.dataset.primaryColor}, ${el.dataset.secondaryColor})`;
            }
        }
        const metaGradient = document.querySelector('meta[name="gradient-colors"]');
        if (metaGradient) {
            try {
                const colors = JSON.parse(metaGradient.content);
                if (colors.primary && colors.secondary) {
                    return `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`;
                }
            } catch (e) {}
        }
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
            const style = window.getComputedStyle(el);
            if (style.backgroundImage.includes('gradient')) {
                return style.backgroundImage;
            }
        }
        return null;
    }
 
    function parseGradient(gradient) {
        const colorPat = '(?:#[0-9a-fA-F]{3,6}|\\w+\\([^)]+\\)|[a-zA-Z]+)';
        const directionPat = '(?:to\\s+(?:top|bottom|left|right)(?:\\s+(?:top|bottom|left|right))?|\\d+deg)';
        const regex = new RegExp(`linear-gradient\\s*\\(\\s*(?:${directionPat}\\s*,)?\\s*(${colorPat})\\s*,\\s*(${colorPat})\\s*\\)`, 'i');
        const match = gradient.match(regex);
        if (match) {
            const color1 = match[1].trim();
            const color2 = match[2].trim();
            const primary = normalizeColor(color1);
            const secondary = normalizeColor(color2);
            if (primary && secondary) {
                return { primary, secondary };
            }
        }
        throw new Error('Invalid format.');
    }
 
    function normalizeColor(colorStr) {
        if (!colorStr) return null;
        if (/^#[0-9a-fA-F]{6}$/.test(colorStr)) {
            return colorStr.toUpperCase();
        }
        if (/^#[0-9a-fA-F]{3}$/.test(colorStr)) {
            return '#' + colorStr.slice(1).split('').map(c => c + c).join('').toUpperCase();
        }
        const rgbMatch = colorStr.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        if (rgbMatch) {
            const [_, r, g, b] = rgbMatch.map(Number);
            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
        }
        const hslMatch = colorStr.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)$/i);
        if (hslMatch) {
            const [_, h, s, l] = hslMatch.map(Number);
            return hslToHex(h, s, l);
        }
        const namedColors = {
            'red': '#FF0000',
            'green': '#00FF00',
            'blue': '#0000FF',
            'black': '#000000',
            'white': '#FFFFFF'
        };
        if (colorStr.toLowerCase() in namedColors) {
            return namedColors[colorStr.toLowerCase()];
        }
        return null;
    }
 
    function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
    }
 
    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }
        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16)
        };
    }
 
    function getLuminance(rgb) {
        return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    }
 
    function computeTextColor(primary, secondary) {
        const rgb1 = hexToRgb(primary);
        const rgb2 = hexToRgb(secondary);
        const lum1 = getLuminance(rgb1);
        const lum2 = getLuminance(rgb2);
        const avgLum = (lum1 + lum2) / 2;
        return avgLum > 0.5 ? '#000' : '#fff';
    }
 
    function uniq(a) {
        return [...new Set(a)];
    }
 
    function getCsrf() {
        console.log('[Genius Gradient Assistant] Searching  CSRF token...');
        const cookie = document.cookie.split("; ").find(x => x.startsWith("_csrf_token="));
        if (cookie) {
            try {
                const token = decodeURIComponent(cookie.split("=")[1]);
                console.log(`[Genius Gradient Assistant] CSRF token found: ${token}`);
                return token;
            } catch (e) {
                console.warn('[Genius Gradient Assistant] Error decoding CSRF token:', e);
            }
        }
        console.warn('[Genius Gradient Assistant] CSRF token not found in cookies. Available cookies:', document.cookie.split("; "));
        return "";
    }
 
    function isInsideHotSongs(el) {
        let n = el;
        for (let i = 0; i < 8 && n; i++) {
            if (n.textContent && /^\s*hot songs\s*:?\s*$/i.test(n.textContent.trim())) return true;
            if (n.getAttribute && /hot[-_\s]?songs/i.test(n.getAttribute("aria-label") || "")) return true;
            n = n.parentElement;
        }
        return false;
    }
 
    function findAlbumTracklistContainer() {
        const a = document.querySelector('[data-test="album_tracklist"]');
        if (a) return a;
        const c = [...document.querySelectorAll('section,div,ol,ul')].find(n => /album.*tracklist/i.test(n.className) || /tracklist/i.test(n.getAttribute("data-test") || ""));
        if (c) return c;
        return null;
    }
 
    function collectAlbumAnchors() {
        const container = findAlbumTracklistContainer();
        let anchors = [];
        if (container) anchors = [...container.querySelectorAll('a[href*="-lyrics"]')];
        if (!anchors.length) {
            anchors = [...document.querySelectorAll('a[href*="-lyrics"]')].filter(a => !isInsideHotSongs(a));
        }
        anchors = anchors.filter(a => /https?:\/\/genius\.com\/[^?#]+-lyrics/i.test(a.href));
        anchors = anchors.filter(a => !isInsideHotSongs(a));
        return anchors.map(a => {
            const txt = (a && a.textContent || "").trim();
            let title = txt || decodeURIComponent(a.href.split("/").pop().replace(/-lyrics.*/i, "").replace(/-/g, " "));
            return { url: a.href, title };
        });
    }
 
    async function extractSongIdFromHtml(html) {
        const tries = [/"song"\s*:\s*{[^}]*"id"\s*:\s*(\d+)/i, /"song_id"\s*:\s*(\d+)/i, /data-song-id="(\d+)"/i, /rg_embed_link_(\d+)/i, /"pusher_channel"\s*:\s*"song-(\d+)"/i];
        for (const re of tries) {
            const m = html.match(re);
            if (m && m[1]) return m[1];
        }
        return null;
    }
 
    async function fetchSongIdByLyricUrl(url) {
        const res = await fetch(url, { credentials: "include" });
        const html = await res.text();
        return extractSongIdFromHtml(html);
    }
 
    async function putSongColors(id, primary, secondary, text, csrf) {
        const payload = { text_format: "html,markdown", song: { song_art_primary_color: primary, song_art_secondary_color: secondary, song_art_text_color: text, valid_song_art_contrast: true } };
        const res = await fetch(`https://genius.com/api/songs/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf, "Accept": "*/*" },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
    }
 
    function hex(v) {
        if (!v) return v;
        const x = v.trim().toLowerCase();
        if (/^#[0-9a-f]{6}$/.test(x)) return x;
        if (/^#[0-9a-f]{3}$/.test(x)) return "#" + x.slice(1).split("").map(c => c + c).join("");
        return x;
    }
 
    const state = { rows: [], data: [] };
    function renderList(items, list) {
        list.innerHTML = "";
        state.rows = [];
        state.data = items;
        items.forEach((it, idx) => {
            const row = document.createElement("label");
            row.style.display = "grid";
            row.style.gridTemplateColumns = "20px 1fr";
            row.style.gap = "8px";
            row.style.alignItems = "center";
            row.style.padding = "6px";
            row.style.borderRadius = "8px";
            row.style.cursor = "pointer";
            row.onmouseenter = () => row.style.background = "rgba(0,0,0,0.05)";
            row.onmouseleave = () => row.style.background = "transparent";
            const cb = document.createElement("input");
            cb.type = "checkbox";
            cb.checked = true;
            cb.dataset.index = String(idx);
            const tt = document.createElement("div");
            tt.style.fontSize = "13px";
            tt.style.whiteSpace = "nowrap";
            tt.style.overflow = "hidden";
            tt.style.textOverflow = "ellipsis";
            tt.textContent = it.title || it.url;
            row.appendChild(cb);
            row.appendChild(tt);
            list.appendChild(row);
            state.rows.push({ row, cb });
        });
    }
 
    function getSelected() {
        const out = [];
        state.rows.forEach((r, i) => { if (r.cb.checked) out.push(state.data[i]) });
        return out;
    }
 
    function setAll(val) {
        state.rows.forEach(r => r.cb.checked = val);
    }
 
    async function loadTracks(list, status) {
        status.textContent = "Scanning album tracklist…";
        const items = collectAlbumAnchors();
        renderList(items, list);
        status.textContent = `Loaded ${items.length} track(s).`;
    }
 
    let isProcessing = false;
    window.addEventListener('beforeunload', (e) => {
        if (isProcessing) {
            e.preventDefault();
            e.returnValue = 'Changes are being applied. Are you sure you want to leave?';
        }
    });
 
    const editBtn = document.createElement("button");
    editBtn.id = "gradient-assistant-toggle";
    editBtn.type = "button";
    editBtn.textContent = "Gradient Assistant";
    document.body.appendChild(editBtn);
 
    editBtn.onclick = async () => {
        const { ui, copyBtn, gradientInput, list, status, fill, reloadBtn, allBtn, noneBtn, applyBtn } = createUI();
        try {
            const gradient = await findCurrentGradient();
            if (gradient) {
                const colors = parseGradient(gradient);
                const gradientText = `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`;
                gradientInput.value = gradientText;
                await navigator.clipboard.writeText(gradientText);
                copyBtn.textContent = "Done!";
                setTimeout(() => copyBtn.textContent = "Copy Gradient", 2000);
            }
        } catch (error) {
            console.error('Error copying gradient:', error);
            status.textContent = `Error: ${error.message}`;
        }
 
        copyBtn.onclick = async () => {
            try {
                const gradient = await findCurrentGradient();
                if (!gradient) {
                    throw new Error('No visible gradient detected');
                }
                const colors = parseGradient(gradient);
                if (!colors) {
                    throw new Error('The found gradient is not in a valid format');
                }
                const gradientText = `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`;
                await navigator.clipboard.writeText(gradientText);
                copyBtn.textContent = "Done!";
                setTimeout(() => copyBtn.textContent = "Copy Gradient", 2000);
            } catch (error) {
                console.error('Error copying gradient:', error);
                status.textContent = `Error: ${error.message}`;
            }
        };
 
        reloadBtn.onclick = () => loadTracks(list, status);
        allBtn.onclick = () => setAll(true);
        noneBtn.onclick = () => setAll(false);
        applyBtn.onclick = async () => {
            const csrf = getCsrf();
            if (!csrf) {
                status.textContent = "Missing CSRF token.";
                return;
            }
            const gradientText = gradientInput.value.trim();
            if (!gradientText) {
                status.textContent = "Please paste a gradient.";
                return;
            }
            try {
                isProcessing = true;
                const { primary, secondary } = parseGradient(gradientText);
                const P = hex(primary);
                const S = hex(secondary);
                const T = computeTextColor(P, S);
                const sel = getSelected();
                if (!sel.length) {
                    status.textContent = "No tracks selected.";
                    return;
                }
                applyBtn.disabled = true;
                reloadBtn.disabled = true;
                allBtn.disabled = true;
                noneBtn.disabled = true;
                status.textContent = "Processing…";
                let done = 0, fail = 0;
                for (const it of sel) {
                    status.textContent = `Resolving ID…`;
                    let id = null;
                    try {
                        id = await fetchSongIdByLyricUrl(it.url);
                    } catch (e) {
                        console.warn(`Failed to fetch song ID for ${it.url}:`, e);
                    }
                    if (!id) {
                        fail++;
                        done++;
                        fill.style.width = ((done / sel.length) * 100).toFixed(1) + "%";
                        continue;
                    }
                    status.textContent = `Updating #${id}…`;
                    try {
                        await putSongColors(id, P, S, T, csrf);
                    } catch (e) {
                        console.warn(`Failed to update colors for song #${id}:`, e);
                        fail++;
                    }
                    done++;
                    fill.style.width = ((done / sel.length) * 100).toFixed(1) + "%";
                    await new Promise(r => setTimeout(r, 400));
                }
                status.textContent = `Done: ${sel.length - fail}/${sel.length}`;
            } catch (e) {
                status.textContent = `Error: ${e.message}`;
            } finally {
                applyBtn.disabled = false;
                reloadBtn.disabled = false;
                allBtn.disabled = false;
                noneBtn.disabled = false;
                isProcessing = false;
            }
        };
 
        loadTracks(list, status);
    };
})();