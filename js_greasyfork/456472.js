// ==UserScript==
// @name         Website AutoScroll (⌘H)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically scroll any webpage at a chosen speed (⌘H). Smooth, with UI + HUD.
// @author       Calvin H
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @icon         data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%2064%2064%27%3E%3Cpath%20fill%3D%27%23111%27%20d%3D%27M32%204%20l14%2016h-10v20h-8V20H18z%27/%3E%3Cpath%20fill%3D%27%23111%27%20d%3D%27M18%2044h28v6H18zM18%2054h28v6H18z%27/%3E%3C/svg%3E
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456472/Website%20AutoScroll%20%28%E2%8C%98H%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456472/Website%20AutoScroll%20%28%E2%8C%98H%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // -------------------------
    // Settings
    // -------------------------
    const MIN_SPEED = 1; // px/sec
    const MAX_SPEED = 10000; // px/sec

    // Exponential curve tuning:
    // We want slider 50% -> ~500 px/sec while still reaching 10,000 at 100%.
    // Using speed = MIN * (MAX/MIN)^(t^K) with K ≈ 0.57 achieves that.
    const CURVE_K = 0.57;

    const SHIFT_WHEEL_ADJUSTS = true;
    const SPEED_STEP = 4; // shift+wheel adjust amount (px/sec)

    // Per-site persistence (across tabs of the same site)
    const LS_SPEED = '__autoscroll_speed_v1';
    const LS_STOPONWHEEL = '__autoscroll_stop_on_wheel_v1';
    const LS_PANEL_POS = '__autoscroll_panel_pos_v1';

    let running = false;
    let speed = loadNumber(LS_SPEED, 400);
    let stopOnWheel = loadBool(LS_STOPONWHEEL, true);

    let rafId = null;
    let lastTs = 0;

    // UI refs
    let ui = null;
    let hud = null;

    // -------------------------
    // Helpers: persistence
    // -------------------------
    function loadNumber(key, fallback) {
        const v = Number(localStorage.getItem(key));
        return Number.isFinite(v) ? v : fallback;
    }
    function saveNumber(key, val) {
        try { localStorage.setItem(key, String(val)); } catch {}
    }
    function loadBool(key, fallback) {
        const v = localStorage.getItem(key);
        if (v === null) return fallback;
        return v === 'true';
    }
    function saveBool(key, val) {
        try { localStorage.setItem(key, val ? 'true' : 'false'); } catch {}
    }
    function loadPos() {
        try {
            const raw = localStorage.getItem(LS_PANEL_POS);
            if (!raw) return null;
            const obj = JSON.parse(raw);
            if (!obj || !Number.isFinite(obj.left) || !Number.isFinite(obj.top)) return null;
            return obj;
        } catch {
            return null;
        }
    }
    function savePos(left, top) {
        try {
            localStorage.setItem(LS_PANEL_POS, JSON.stringify({ left, top }));
        } catch {}
    }

    // -------------------------
    // Helpers: clamping + mapping
    // -------------------------
    function clampSpeed(n) {
        n = Number(n);
        if (!Number.isFinite(n)) return speed;
        return Math.max(MIN_SPEED, Math.min(MAX_SPEED, Math.round(n)));
    }

    // sliderVal: 0..1000 -> speed (exponential-ish)
    function sliderToSpeed(sliderVal) {
        const t = Math.max(0, Math.min(1, sliderVal / 1000));
        const ratio = MAX_SPEED / MIN_SPEED;
        const exp = Math.pow(t, CURVE_K);
        const val = MIN_SPEED * Math.pow(ratio, exp);
        return clampSpeed(val);
    }

    // speed -> sliderVal 0..1000 (inverse mapping)
    function speedToSlider(spd) {
        spd = clampSpeed(spd);
        const ratio = MAX_SPEED / MIN_SPEED;
        const exp = Math.log(spd / MIN_SPEED) / Math.log(ratio); // 0..1
        const t = Math.pow(Math.max(0, Math.min(1, exp)), 1 / CURVE_K);
        return Math.round(t * 1000);
    }

    // -------------------------
    // Core scroll loop (smooth)
    // -------------------------
    function tick(ts) {
        if (!running) return;

        if (!lastTs) lastTs = ts;
        const dt = (ts - lastTs) / 1000;
        lastTs = ts;

        window.scrollBy(0, speed * dt);

        // auto-stop at bottom
        const atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 2);
        if (atBottom) {
            setRunning(false, 'Reached bottom');
            return;
        }

        rafId = requestAnimationFrame(tick);
    }

    function setRunning(on, reason) {
        running = on;
        lastTs = 0;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;

        if (running) rafId = requestAnimationFrame(tick);

        updateHUD(reason);
        updateUIState();
    }

    // -------------------------
    // Hotkey: ⌘H (Meta+H)
    // -------------------------
    window.addEventListener('keydown', (e) => {
        const isToggle = (e.key && e.key.toLowerCase() === 'h') && e.metaKey && !e.ctrlKey && !e.altKey;
        if (!isToggle) return;

        e.preventDefault();
        e.stopPropagation();

        ensureUI();
        ui.open();
    }, true);

    // Esc: stop + close UI
    window.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (running) setRunning(false, 'Stopped (Esc)');
        if (ui) ui.close();
    }, true);

    // Wheel behavior
    window.addEventListener('wheel', (e) => {
        if (!running) return;

        if (SHIFT_WHEEL_ADJUSTS && e.shiftKey) {
            // Shift+wheel adjusts speed while running (and should NOT scroll the page)
            e.preventDefault();
            e.stopPropagation();

            const direction = Math.sign(e.deltaY);
            // dir < 0 (scroll up)  => increase speed (multiply)
            // dir > 0 (scroll down)=> decrease speed (divide)
            speed = clampSpeed(speed + (direction < 0 ? -SPEED_STEP : SPEED_STEP));
            saveNumber(LS_SPEED, speed);
            if (ui) ui.syncFromState();
            updateHUD('Speed adjusted');
            return;
        }


        // Normal wheel can stop if enabled
        if (stopOnWheel) {
            setRunning(false, 'Stopped (manual scroll)');
        }
    }, { passive: false, capture: true });

    // -------------------------
    // UI + HUD
    // -------------------------
    function ensureUI() {
        if (ui) return;

        // HUD
        hud = document.createElement('div');
        hud.style.cssText = `
      position: fixed;
      right: 12px;
      bottom: 12px;
      z-index: 2147483647;
      font: 12px/1.25 -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial;
      color: #fff;
      background: rgba(0,0,0,0.72);
      padding: 8px 10px;
      border-radius: 10px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      box-shadow: 0 6px 24px rgba(0,0,0,0.25);
      user-select: none;
      display: none;
      min-width: 210px;
      text-align: left;
      white-space: pre-line;
    `;
        document.documentElement.appendChild(hud);

        // UI host with Shadow DOM
        const host = document.createElement('div');
        host.style.cssText = `position: fixed; inset: 0; z-index: 2147483647; display: none;`;
        const shadow = host.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
      <style>
        .backdrop{
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.35);
        }
        .panel{
          position: fixed;
          width: min(420px, calc(100vw - 24px));
          background: rgba(20,20,20,0.92);
          color: #fff;
          border-radius: 14px;
          padding: 14px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.45);
          border: 1px solid rgba(255,255,255,0.10);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          cursor: default;
        }
        .titlebar{
          display:flex;
          align-items:center;
          justify-content: space-between;
          gap: 10px;
          margin: 0 0 10px;
          user-select: none;
          cursor: grab;
        }
        .titlebar:active{ cursor: grabbing; }
        .title{ font-weight: 700; font-size: 15px; }
        .row{ display:flex; gap:10px; align-items:center; margin: 10px 0; }
        input[type="number"]{
          width: 110px;
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.08);
          color: #fff;
          outline: none;
        }
        input[type="range"]{ width: 100%; }
        .footer{
          display:flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 12px;
        }
        button{
          padding: 9px 12px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.10);
          color: #fff;
          cursor: pointer;
        }
        button.primary{
          background: rgba(40,140,255,0.85);
          border-color: rgba(40,140,255,0.95);
          font-weight: 700;
        }

        /* Start/Stop color states */
        button.primary.start{
          background: rgba(40, 200, 90, 0.90);
          border-color: rgba(40, 200, 90, 0.95);
        }
        button.primary.stop{
          background: rgba(220, 60, 60, 0.90);
          border-color: rgba(220, 60, 60, 0.95);
        }

        .hint{ opacity: 0.75; font-size: 12px; margin-top: 8px; }
        .kbd{
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
          padding: 0px 5px;        /* smaller */
          border-radius: 5px;      /* smaller */
          font-size: 11px;         /* slightly smaller text */
          line-height: 1.1;        /* tighter box height */
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.12);
          display: inline-block;   /* keeps box snug */
        }
        /* Tooltip for the stop-on-scroll option */
        .tipwrap{ display:flex; align-items:center; gap:8px; }
        .info{
          position: relative;
          width: 18px; height: 18px;
          border-radius: 999px;
          display:inline-flex;
          align-items:center; justify-content:center;
          font-weight: 800;
          font-size: 12px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.16);
          user-select: none;
        }
        .tooltip{
          position: absolute;
          left: 50%;
          top: calc(100% + 8px);
          z-index: 999999;
          transform: translateX(-50%);
          width: 220px;
          padding: 8px 10px;
          border-radius: 10px;
          background: rgba(0,0,0,0.92);
          border: 1px solid rgba(255,255,255,0.14);
          box-shadow: 0 12px 30px rgba(0,0,0,0.45);
          font-size: 12px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 250ms ease;
          transition-delay: 250ms; /* brief hover delay */
        }
        .info:hover .tooltip{ opacity: 1; }
      </style>

      <div class="backdrop"></div>

      <div class="panel" role="dialog" aria-modal="true" aria-label="AutoScroll Settings">
        <div class="titlebar" id="titlebar">
          <div class="title">Website AutoScroll <span class="kbd">⌘H</span></div>
          <div style="opacity:.7; font-size:12px;">drag me</div>
        </div>

        <div class="row" style="justify-content: space-between;">
          <div>Speed (px/sec)</div>
          <input id="speedNum" type="number" min="${MIN_SPEED}" max="${MAX_SPEED}" step="1" />
        </div>

        <input id="speedRange" type="range" min="0" max="1000" step="1" />

        <div class="row" style="justify-content:flex-start;">
          <input id="stopOnWheel" type="checkbox" />
          <div class="tipwrap">
            <span>Stop on manual scroll</span>
            <span class="info">i
              <span class="tooltip">
                If enabled, normal scrolling stops AutoScroll.
                Shift+scroll still adjusts speed.
              </span>
            </span>
          </div>
        </div>

        <div class="hint">
          Tip: ${SHIFT_WHEEL_ADJUSTS ? 'Shift+scroll adjusts speed while running.' : '' }
          Press <span class="kbd">Esc</span> to stop/close. Press <span class="kbd">Enter</span> to Start/Stop.
        </div>

        <div class="footer">
          <button id="close">Close</button>
          <button id="toggle" class="primary">Start</button>
        </div>
      </div>
    `;

        document.documentElement.appendChild(host);

        const $ = (sel) => shadow.querySelector(sel);
        const backdrop = $('.backdrop');
        const panel = $('.panel');
        const titlebar = $('#titlebar');

        const speedNum = $('#speedNum');
        const speedRange = $('#speedRange');
        const stopOnWheelBox = $('#stopOnWheel');

        const btnClose = $('#close');
        const btnToggle = $('#toggle');

        // Panel positioning (draggable + persisted)
        const defaultPos = () => {
            // centered-ish default (computed on first open)
            const w = Math.min(420, window.innerWidth - 24);
            const left = Math.max(12, Math.round((window.innerWidth - w) / 2));
            const top = Math.max(12, Math.round(window.innerHeight * 0.18));
            return { left, top };
        };

        function applyPanelPos(pos) {
            const rect = panel.getBoundingClientRect();
            const maxLeft = Math.max(12, window.innerWidth - rect.width - 12);
            const maxTop = Math.max(12, window.innerHeight - rect.height - 12);

            const left = Math.max(12, Math.min(pos.left, maxLeft));
            const top = Math.max(12, Math.min(pos.top, maxTop));

            panel.style.left = `${left}px`;
            panel.style.top = `${top}px`;
        }

        function syncControlsFromState() {
            speed = clampSpeed(speed);
            speedNum.value = String(speed);
            speedRange.value = String(speedToSlider(speed));
            stopOnWheelBox.checked = !!stopOnWheel;
            updateUIState();
        }

        function open() {
            host.style.display = 'block';

            // load + apply position
            const pos = loadPos() || defaultPos();
            applyPanelPos(pos);

            syncControlsFromState();
            speedNum.focus();
            speedNum.select();
        }

        function close() {
            host.style.display = 'none';
        }

        // Click backdrop closes
        backdrop.addEventListener('mousedown', () => close());

        // Number input -> speed
        speedNum.addEventListener('input', () => {
            speed = clampSpeed(speedNum.value);
            saveNumber(LS_SPEED, speed);
            speedRange.value = String(speedToSlider(speed));
            updateHUD();
        });

        // Slider input -> speed (exponential mapping)
        speedRange.addEventListener('input', () => {
            speed = sliderToSpeed(Number(speedRange.value));
            saveNumber(LS_SPEED, speed);
            speedNum.value = String(speed);
            updateHUD();
        });

        // Stop on wheel toggle
        stopOnWheelBox.addEventListener('change', () => {
            stopOnWheel = !!stopOnWheelBox.checked;
            saveBool(LS_STOPONWHEEL, stopOnWheel);
        });

        // Buttons
        btnClose.addEventListener('click', close);

        btnToggle.addEventListener('click', () => {
            setRunning(!running, running ? 'Stopped' : 'Started');
            close();
        });

        // Enter triggers Start/Stop
        shadow.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            e.stopPropagation();
            btnToggle.click();
        }, true);

        // Dragging panel by titlebar (persist pos)
        let dragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        titlebar.addEventListener('mousedown', (e) => {
            dragging = true;

            const rect = panel.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;

            e.preventDefault();
            e.stopPropagation();
        });

        window.addEventListener('mousemove', (e) => {
            if (!dragging) return;

            const rect = panel.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;

            const left = Math.max(12, Math.min(e.clientX - dragOffsetX, window.innerWidth - w - 12));
            const top = Math.max(12, Math.min(e.clientY - dragOffsetY, window.innerHeight - h - 12));

            panel.style.left = `${left}px`;
            panel.style.top = `${top}px`;
        }, true);

        window.addEventListener('mouseup', () => {
            if (!dragging) return;
            dragging = false;

            const rect = panel.getBoundingClientRect();
            savePos(Math.round(rect.left), Math.round(rect.top));
        }, true);

        ui = {
            open,
            close,
            syncFromState: syncControlsFromState,
            btnToggle
        };

        updateHUD();
    }

    function updateHUD(reason) {
        if (!hud) return;

        if (!running) {
            hud.style.display = 'none';
            return;
        }

        const base = `AutoScroll: ON\nSpeed: ${speed} px/sec`;
        hud.textContent = reason ? `${base}\n${reason}` : base;
        hud.style.display = 'block';
    }

    function updateUIState() {
        if (!ui) return;

        const b = ui.btnToggle;
        const isRunning = running;

        b.textContent = isRunning ? 'Stop' : 'Start';

        // color classes
        b.classList.toggle('start', !isRunning);
        b.classList.toggle('stop', isRunning);
    }
})();
