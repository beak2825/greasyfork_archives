// ==UserScript==
// @name         Bilibili 自定义倍速
// @namespace    bilispeed.custom.user.min
// @version      1.0.0
// @description  自定义倍速列表 / 拖动记忆 / 全屏窗口智能隐藏 / 原生倍速同步。新增拖动分隔 / Hover防隐藏
// @author       cty2333
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/*
// @match        *://www.bilibili.com/list/*
// @match        *://www.bili-s.com/video/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542881/Bilibili%20%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/542881/Bilibili%20%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const LOG = "[BiliSpeed]";
    const log = (...a) => console.log(LOG, ...a);

    /* ---------- config ---------- */
    const STORE_KEY = "bili_custom_speed_store_v8";

    // Width (px) of the dedicated drag handle bar between the two buttons.
    const DRAG_HANDLE_WIDTH = 16;

    // Delay before auto-hide in windowed mode (ms). Longer makes it easier to click.
    const WINDOW_HIDE_MS = 600;

    // Delay before auto-hide in fullscreen mode (ms).
    const FULLSCREEN_HIDE_MS = 3000;

    // Initial grace period after load before first auto-hide (ms).
    const STARTUP_GRACE_MS = 2000;

    const defaultStore = {
        speeds: [0.5, 1, 1.25, 1.5, 2],
        current: 1,
        pos: { xPct: null, yPct: null }, // null => default top-right
    };

    const hasGM = typeof GM_getValue === "function" && typeof GM_setValue === "function";
    const safeClone = (o) => JSON.parse(JSON.stringify(o));

    /* ---------- store ---------- */
    function loadStore() {
        try {
            const raw = hasGM ? GM_getValue(STORE_KEY, null) : localStorage.getItem(STORE_KEY);
            if (!raw) return safeClone(defaultStore);
            const p = JSON.parse(String(raw));
            return { ...safeClone(defaultStore), ...p, pos: { ...defaultStore.pos, ...(p.pos || {}) } };
        } catch (e) {
            log("loadStore error", e);
            return safeClone(defaultStore);
        }
    }
    function saveStore(st) {
        try {
            const js = JSON.stringify(st);
            hasGM ? GM_setValue(STORE_KEY, js) : localStorage.setItem(STORE_KEY, js);
        } catch (e) {
            log("saveStore error", e);
        }
    }
    let store = loadStore();

    /* ---------- DOM helpers ---------- */
    const $ = (sel, root = document) => root.querySelector(sel);

    function getPlayerContainer() {
        return (
            $(".bpx-player-container") ||
            $("#player_module") ||
            $(".player-wrap") ||
            $(".bilibili-player") ||
            document.body
        );
    }

    function getVideoEl() {
        let v = $(".bpx-player-video-wrap video") || $("video");
        if (v) return v;
        const bwp = $("bwp-video");
        if (bwp?.shadowRoot) {
            v = bwp.shadowRoot.querySelector("video");
            if (v) return v;
        }
        return null;
    }

    /* ---------- style ---------- */
    GM_addStyle?.(`
    #bili-speed-root-min{
      position:absolute;top:4px;right:4px;z-index:999999;
      display:inline-flex;align-items:stretch;
      padding:0;
      border-radius:4px;
      background:transparent;
      color:#fff;
      font:11px/1.2 sans-serif;user-select:none;cursor:move;
      transition:opacity .12s;opacity:1;
    }
    #bili-speed-root-min::before{
      content:\"\";position:absolute;inset:0;
      background:rgba(0,0,0,.55);border-radius:4px;
      z-index:-1;
    }
    #bili-speed-root-min.hide-auto{opacity:0;pointer-events:none;}

    #bili-speed-root-min button{
      position:relative;
      border:0;margin:0;
      padding:2px 6px;
      border-radius:0;
      background:rgba(255,255,255,.15);
      color:#fff;font-size:11px;line-height:1.2;cursor:pointer;
    }
    #bili-speed-root-min button.current-btn.active{background:#00a1d6;font-weight:600;}
    #bili-speed-root-min button.icon-btn{min-width:16px;font-size:12px;}
    #bili-speed-root-min button:first-of-type{border-top-left-radius:4px;border-bottom-left-radius:4px;}
    #bili-speed-root-min button.icon-btn:last-of-type{border-top-right-radius:4px;border-bottom-right-radius:4px;}

    #bili-speed-root-min .drag-handle{
      width:${DRAG_HANDLE_WIDTH}px;height:auto;cursor:move;
      background:transparent;flex:none;
    }

    #bili-speed-pop-min{
      position:absolute;top:100%;left:0;margin-top:2px;
      background:rgba(0,0,0,.85);padding:2px;border-radius:4px;
      display:flex;flex-direction:column;gap:1px;min-width:48px;
      box-shadow:0 1px 6px rgba(0,0,0,.5);z-index:9999999;
    }
    #bili-speed-pop-min.hidden{display:none;}
    #bili-speed-pop-min button{
      width:100%;text-align:left;padding:1px 6px;font-size:11px;white-space:nowrap;background:rgba(255,255,255,.15);
    }
    #bili-speed-pop-min button.active{background:#00a1d6;}

    #bili-speed-settings-min{
      position:absolute;top:100%;right:0;margin-top:2px;
      background:rgba(0,0,0,.85);padding:6px;border-radius:4px;width:180px;max-width:70vw;
      font-size:11px;box-shadow:0 1px 6px rgba(0,0,0,.5);z-index:9999999;
    }
    #bili-speed-settings-min.hidden{display:none;}
    #bili-speed-settings-min input[type=\"text\"]{
      width:100%;margin:3px 0;padding:1px 3px;font-size:11px;
      border:1px solid #555;border-radius:3px;background:rgba(255,255,255,.1);color:#fff;box-sizing:border-box;
    }
    #bili-speed-settings-min .note{opacity:.7;margin-bottom:4px;line-height:1.2;}
    #bili-speed-settings-min .btn-row{text-align:right;margin-top:4px;}
    #bili-speed-settings-min .btn-row button{background:#00a1d6;margin-left:4px;font-size:11px;}
    #bili-speed-settings-min button.reset-pos{
      display:block;width:100%;margin-top:4px;background:rgba(255,255,255,.15);text-align:center;
    }
  `);

    /* ---------- UI build ---------- */
    let uiRoot, currentBtn, settingsBtn, dragHandle, popMenu, settingsPanel, settingsInput;
    function buildUI() {
        if (uiRoot) uiRoot.remove();
        uiRoot = document.createElement("div");
        uiRoot.id = "bili-speed-root-min";
        uiRoot.addEventListener("click", (e) => e.stopPropagation());

        currentBtn = document.createElement("button");
        currentBtn.className = "current-btn";
        currentBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            togglePopMenu();
        });

        dragHandle = document.createElement("div");
        dragHandle.className = "drag-handle";

        settingsBtn = document.createElement("button");
        settingsBtn.className = "icon-btn";
        settingsBtn.textContent = "⚙";
        settingsBtn.title = "设置";
        settingsBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleSettings();
        });

        popMenu = document.createElement("div");
        popMenu.id = "bili-speed-pop-min";
        popMenu.classList.add("hidden");

        settingsPanel = document.createElement("div");
        settingsPanel.id = "bili-speed-settings-min";
        settingsPanel.classList.add("hidden");

        const stTitle = document.createElement("div");
        stTitle.textContent = "编辑倍速";
        settingsPanel.appendChild(stTitle);

        settingsInput = document.createElement("input");
        settingsInput.type = "text";
        settingsPanel.appendChild(settingsInput);

        const note = document.createElement("div");
        note.className = "note";
        note.textContent = "逗号分隔，如 0.75,1,1.25,1.5,2";
        settingsPanel.appendChild(note);

        const resetBtn = document.createElement("button");
        resetBtn.className = "reset-pos";
        resetBtn.textContent = "重置位置";
        resetBtn.addEventListener("click", () => {
            store.pos = { xPct: null, yPct: null };
            saveStore(store);
            applyStoredPosition();
            showUI();
        });
        settingsPanel.appendChild(resetBtn);

        const row = document.createElement("div");
        row.className = "btn-row";
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "取消";
        cancelBtn.addEventListener("click", hideSettings);
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "保存";
        saveBtn.addEventListener("click", () => {
            const list = parseSpeeds(settingsInput.value);
            if (!list.length) return alert("倍速列表无效");
            store.speeds = list;
            if (!store.speeds.includes(store.current)) {
                store.current = store.speeds.includes(1) ? 1 : store.speeds[0];
                applyPlaybackRate(store.current);
            }
            saveStore(store);
            rebuildPopMenu();
            updateCurrentLabel();
            hideSettings();
        });
        row.appendChild(cancelBtn);
        row.appendChild(saveBtn);
        settingsPanel.appendChild(row);

        uiRoot.appendChild(currentBtn);
        uiRoot.appendChild(dragHandle);
        uiRoot.appendChild(settingsBtn);
        uiRoot.appendChild(popMenu);
        uiRoot.appendChild(settingsPanel);

        enableDrag(uiRoot);
        initRootHoverHandlers();
    }

    /* ---------- root hover protection ---------- */
    let rootHover = false;
    function initRootHoverHandlers() {
        if (!uiRoot || uiRoot.__hoverBound) return;
        uiRoot.__hoverBound = true;
        uiRoot.addEventListener("mouseenter", () => {
            rootHover = true;
            pauseAutoHide();
        });
        uiRoot.addEventListener("mouseleave", () => {
            rootHover = false;
            resumeAutoHide();
        });
    }

    /* ---------- UI helpers ---------- */
    function updateCurrentLabel() {
        currentBtn.textContent = `x${store.current}`;
        currentBtn.classList.add("active");
    }

    function rebuildPopMenu() {
        popMenu.innerHTML = "";
        store.speeds.forEach((s) => {
            const btn = document.createElement("button");
            btn.textContent = "x" + s;
            if (+s === +store.current) btn.classList.add("active");
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                setSpeed(s);
                hidePopMenu();
            });
            popMenu.appendChild(btn);
        });
    }

    function togglePopMenu() {
        if (popMenu.classList.contains("hidden")) showPopMenu();
        else hidePopMenu();
    }
    function showPopMenu() {
        hideSettings();
        rebuildPopMenu();
        popMenu.classList.remove("hidden");
        pauseAutoHide();
    }
    function hidePopMenu() {
        if (!popMenu) return;
        popMenu.classList.add("hidden");
        resumeAutoHide();
    }

    function toggleSettings() {
        if (settingsPanel.classList.contains("hidden")) showSettings();
        else hideSettings();
    }
    function showSettings() {
        hidePopMenu();
        settingsInput.value = store.speeds.join(",");
        settingsPanel.classList.remove("hidden");
        pauseAutoHide();
        setTimeout(() => settingsInput.focus(), 0);
    }
    function hideSettings() {
        if (!settingsPanel) return;
        settingsPanel.classList.add("hidden");
        resumeAutoHide();
    }

    /* ---------- popup state ---------- */
    function popupOpen() {
        return !popMenu.classList.contains("hidden") || !settingsPanel.classList.contains("hidden");
    }

    /* ---------- auto-hide ---------- */
    let hideTimer = null;
    let isFullscreen = !!document.fullscreenElement;
    let autoHidePaused = false;

    function pauseAutoHide() {
        autoHidePaused = true;
        clearTimeout(hideTimer);
        showUI();
    }
    function resumeAutoHide() {
        autoHidePaused = false;
        showUI();
        scheduleHide(isFullscreen ? FULLSCREEN_HIDE_MS : WINDOW_HIDE_MS);
    }
    function showUI() {
        uiRoot?.classList.remove("hide-auto");
    }
    function hideUI() {
        if (autoHidePaused || rootHover || popupOpen()) return;
        uiRoot?.classList.add("hide-auto");
    }
    function scheduleHide(ms) {
        if (autoHidePaused) return;
        clearTimeout(hideTimer);
        hideTimer = setTimeout(hideUI, ms);
    }

    function bindAutoHide(container) {
        if (!container || container.__biliSpeedAutoHideBound) return;
        container.__biliSpeedAutoHideBound = true;
        container.addEventListener("mousemove", () => {
            showUI();
            scheduleHide(isFullscreen ? FULLSCREEN_HIDE_MS : WINDOW_HIDE_MS);
        });
        container.addEventListener("mouseleave", () => {
            scheduleHide(isFullscreen ? FULLSCREEN_HIDE_MS : WINDOW_HIDE_MS);
        });
    }

    /* ---------- drag & position ---------- */
    function enableDrag(el) {
        let dragging = false;
        let sx, sy, startL, startT;

        el.addEventListener("mousedown", (e) => {
            if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") return;
            dragging = true;
            const pRect = playerContainer?.getBoundingClientRect();
            const r = el.getBoundingClientRect();
            sx = e.clientX;
            sy = e.clientY;
            startL = r.left - (pRect?.left || 0);
            startT = r.top - (pRect?.top || 0);
            e.preventDefault();
            e.stopPropagation();
            pauseAutoHide();
        });

        document.addEventListener("mousemove", (e) => {
            if (!dragging || !playerContainer) return;
            const dx = e.clientX - sx;
            const dy = e.clientY - sy;
            const pRect = playerContainer.getBoundingClientRect();
            let newL = startL + dx;
            let newT = startT + dy;
            const maxL = pRect.width - el.offsetWidth;
            const maxT = pRect.height - el.offsetHeight;
            if (newL < 0) newL = 0;
            if (newT < 0) newT = 0;
            if (newL > maxL) newL = maxL;
            if (newT > maxT) newT = maxT;
            el.style.left = newL + "px";
            el.style.top = newT + "px";
            el.style.right = "auto";
        });

        document.addEventListener("mouseup", () => {
            if (!dragging) return;
            dragging = false;
            persistPosition();
            resumeAutoHide();
        });
    }

    function persistPosition() {
        if (!playerContainer) return;
        const pRect = playerContainer.getBoundingClientRect();
        const r = uiRoot.getBoundingClientRect();
        const safeW = pRect.width - r.width;
        const safeH = pRect.height - r.height;
        const clamp = (n, min, max) => (n < min ? min : n > max ? max : n);
        const xPct = safeW > 0 ? ((r.left - pRect.left) / safeW) * 100 : 0;
        const yPct = safeH > 0 ? ((r.top - pRect.top) / safeH) * 100 : 0;
        store.pos = { xPct: clamp(xPct, 0, 100), yPct: clamp(yPct, 0, 100) };
        saveStore(store);
    }

    function applyStoredPosition() {
        if (!uiRoot || !playerContainer) return;
        if (store.pos.xPct == null || store.pos.yPct == null) {
            uiRoot.style.top = "4px";
            uiRoot.style.right = "4px";
            uiRoot.style.left = "auto";
            return;
        }
        uiRoot.style.right = "auto";
        requestAnimationFrame(() => {
            const pRect = playerContainer.getBoundingClientRect();
            const safeW = pRect.width - uiRoot.offsetWidth;
            const safeH = pRect.height - uiRoot.offsetHeight;
            const x = (safeW * store.pos.xPct) / 100;
            const y = (safeH * store.pos.yPct) / 100;
            uiRoot.style.left = Math.max(0, x) + "px";
            uiRoot.style.top = Math.max(0, y) + "px";
        });
    }

    /* ---------- speed core ---------- */
    function setSpeed(rate) {
        rate = Number(rate);
        if (!rate || rate <= 0) return;
        store.current = rate;
        if (!store.speeds.includes(rate)) {
            store.speeds.push(rate);
            store.speeds.sort((a, b) => a - b);
        }
        saveStore(store);
        updateCurrentLabel();
        applyPlaybackRate(rate);
        trySyncNative(rate);
    }

    function applyPlaybackRate(rate) {
        const v = videoEl || getVideoEl();
        if (!v) return;
        const r = Number(rate) || 1;
        if (v.playbackRate !== r) v.playbackRate = r;
    }

    function bindVideoEvents() {
        const v = videoEl;
        if (!v || v.__biliSpeedBound) return;
        v.__biliSpeedBound = true;
        v.addEventListener("loadedmetadata", () => applyPlaybackRate(store.current));
        v.addEventListener("play", () => applyPlaybackRate(store.current));
    }

    /* ---------- native sync ---------- */
    function findNativeSpeedMenuItems() {
        let menu = $(".bpx-player-ctrl-playbackrate-menu");
        if (!menu) menu = $(".bilibili-player-video-btn-speed-menu");
        if (!menu) return [];
        const items = menu.querySelectorAll("li,button,span,.bpx-player-ctrl-playbackrate-menu-item");
        return Array.from(items).filter((el) => /x|倍|\d/.test(el.textContent));
    }
    function parseRateFromText(txt) {
        const m = String(txt).match(/(\d+(?:\.\d+)?)/);
        return m ? Number(m[1]) : null;
    }
    function bindNativeMenu() {
        const items = findNativeSpeedMenuItems();
        items.forEach((el) => {
            if (el.__biliSpeedNativeBound) return;
            el.__biliSpeedNativeBound = true;
            el.addEventListener("click", () => {
                const r = parseRateFromText(el.textContent);
                if (!r) return;
                log("native speed ->", r);
                setSpeed(r);
            });
        });
    }
    function trySyncNative(rate) {
        const items = findNativeSpeedMenuItems();
        for (const el of items) {
            const r = parseRateFromText(el.textContent);
            if (r != null && Math.abs(r - rate) < 0.001) {
                el.click();
                return;
            }
        }
    }

    /* ---------- parse speeds input ---------- */
    function parseSpeeds(str) {
        return str
            .split(/[,，\s]+/)
            .map((s) => s.trim())
            .filter(Boolean)
            .map(Number)
            .filter((n) => !isNaN(n) && n > 0)
            .sort((a, b) => a - b);
    }

    /* ---------- SPA route hook ---------- */
    let lastHref = location.href;
    const _push = history.pushState;
    const _replace = history.replaceState;
    history.pushState = function () {
        _push.apply(this, arguments);
        queuePageChange();
    };
    history.replaceState = function () {
        _replace.apply(this, arguments);
        queuePageChange();
    };
    window.addEventListener("popstate", queuePageChange, { passive: true });
    let pageChangeTimer = null;
    function queuePageChange() {
        clearTimeout(pageChangeTimer);
        pageChangeTimer = setTimeout(() => {
            if (location.href === lastHref) return;
            lastHref = location.href;
            onPageChange();
        }, 200);
    }
    function onPageChange() {
        log("page change");
        refreshTargets();
        bindNativeMenu();
        applyPlaybackRate(store.current);
    }

    /* ---------- refresh targets ---------- */
    let playerContainer = null;
    let videoEl = null;

    function refreshTargets() {
        const newPlayer = getPlayerContainer();
        if (newPlayer && newPlayer !== playerContainer) {
            playerContainer = newPlayer;
            if (getComputedStyle(playerContainer).position === "static") playerContainer.style.position = "relative";
            playerContainer.appendChild(uiRoot);
            bindAutoHide(playerContainer);
            applyStoredPosition();
        }
        const newVideo = getVideoEl();
        if (newVideo && newVideo !== videoEl) {
            videoEl = newVideo;
            bindVideoEvents();
            applyPlaybackRate(store.current);
        }
    }

    /* ---------- global outside click ---------- */
    function globalClose(e) {
        if (uiRoot.contains(e.target)) return;
        hidePopMenu();
        hideSettings();
    }

    /* ---------- init ---------- */
    function init() {
        buildUI();
        playerContainer = getPlayerContainer();
        videoEl = getVideoEl();
        if (playerContainer) {
            if (getComputedStyle(playerContainer).position === "static") playerContainer.style.position = "relative";
            playerContainer.appendChild(uiRoot);
            bindAutoHide(playerContainer);
        }
        applyStoredPosition();
        bindNativeMenu();
        bindVideoEvents();
        updateCurrentLabel();
        rebuildPopMenu();
        applyPlaybackRate(store.current);

        document.addEventListener("click", globalClose, true);

        document.addEventListener("fullscreenchange", () => {
            isFullscreen = !!document.fullscreenElement;
            log("fullscreen:", isFullscreen);
            refreshTargets();
            showUI();
            scheduleHide(isFullscreen ? FULLSCREEN_HIDE_MS : WINDOW_HIDE_MS);
        });

        const mo = new MutationObserver(() => {
            refreshTargets();
            bindNativeMenu();
        });
        mo.observe(document.body, { childList: true, subtree: true });

        // Startup grace (let user see control)
        showUI();
        scheduleHide(STARTUP_GRACE_MS);
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
