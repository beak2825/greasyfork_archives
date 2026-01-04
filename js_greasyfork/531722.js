// ==UserScript==
// @name         Timerhooker
// @namespace    https://greasyfork.org/users/1356925
// @version      4.2.0
// @description  Fixed, robust start/stop timer/video speed UI with 16x as default speed up. Blocks page visibility detection.
// @author       Cangshi, Tiger 27, Perplexity, Me
// @match        *://*/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531722/Timerhooker.user.js
// @updateURL https://update.greasyfork.org/scripts/531722/Timerhooker.meta.js
// ==/UserScript==

(function() {
  // --- Constants & Main Tweaks ---
  const SPEED_FAST = 16;
  const SPEED_NORMAL = 1;
  const UI_SIZE = 62;            // UI button diameter (px)
  const DRAG_MARGIN = 7;         // Minimum distance from window edge (px)
  const AUTOEDGE = 3000;         // ms idle to half-hide
  const HIDE_SHIFT_FACTOR = 0.5; // Fraction of UI to hide on edge
  const STORAGE_KEY = 'tm_ui_pos_final';
  const UI_ZINDEX = 2147483647;
  const RETRY_INIT_MS = 40;
  const THEME_BG_TRANSITION = 0.23; // seconds

  // --- State ---
  let speed = SPEED_NORMAL, started = false, hiddenEdge = null, observer = null;
  let uiPos = (() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { top: '22%', left: 14 };
    } catch {
      return { top: '22%', left: 14 };
    }
  })();

  // --- Helpers ---
  function clampUIPos(x, y) {
    x = Math.max(DRAG_MARGIN, Math.min(window.innerWidth - UI_SIZE - DRAG_MARGIN, x));
    y = Math.max(DRAG_MARGIN, Math.min(window.innerHeight - UI_SIZE - DRAG_MARGIN, y));
    return { left: x, top: y };
  }
  function savePos(pos) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pos)); } catch {}
  }

  // --- Icon rendering ---
  function iconSVG(type, active) {
    return type === 'play'
      ? `<svg width="38" height="38" viewBox="0 0 38 38"><ellipse cx="19" cy="19" rx="16" ry="16" fill="${active ? 'rgba(30,195,230,.18)' : 'rgba(255,255,255,.15)'}" stroke="${active ? '#16b1ea' : '#8dcfe0'}" stroke-width="1.4"/><polygon points="15,12 27,19 15,26" fill="${active ? '#179aba' : '#2a354a'}" opacity=".94"/></svg>`
      : `<svg width="38" height="38" viewBox="0 0 38 38"><ellipse cx="19" cy="19" rx="16" ry="16" fill="${active ? 'rgba(34,220,198,.20)' : 'rgba(255,255,255,.13)'}" stroke="${active ? '#1dc4c4' : '#98bdd2'}" stroke-width="1.2"/><rect x="13.5" y="13.5" width="11" height="11" fill="${active ? '#09c39a' : '#404040'}" rx="2.5" opacity=".93"/></svg>`;
  }

  // --- Timer patching ---
  function patchTimers(getSpeed) {
    if (window.__tm_timerPatched) return;
    window.__tm_timerPatched = true;
    const sI = window.setInterval, sT = window.setTimeout;
    window.setInterval = (fn, ms, ...a) => sI(fn, ms / getSpeed(), ...a);
    window.setTimeout = (fn, ms, ...a) => sT(fn, ms / getSpeed(), ...a);
  }
  function setAllVideos(rate) {
    try {
      document.querySelectorAll('video').forEach(v => v.playbackRate = rate);
      // Collect shadow-rooted videos
      (function f(n, a = []) {
        if (!n) return a;
        if (n.shadowRoot) a.push(...n.shadowRoot.querySelectorAll('video'));
        for (const c of n.children || []) f(c, a);
        return a;
      })(document.body).forEach(v => v.playbackRate = rate);
    } catch {}
  }
  function applySpeed() {
    patchTimers(() => speed);
    setAllVideos(speed);
  }

  // --- Single definition: blockPageVisibilityDetection ---
  function blockPageVisibilityDetection() {
    const eventsToBlock = [
      "visibilitychange", "webkitvisibilitychange", "mozvisibilitychange", "blur", "focus", "mouseleave"
    ];
    for (const eventName of eventsToBlock) {
      try {
        document.addEventListener(eventName, stopEvt, true);
        window.addEventListener(eventName, stopEvt, true);
      } catch (e) {}
    }
    function stopEvt(e) {
      try {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      } catch (e) {}
    }
    function overrideDocProp(prop, value) {
      try {
        Object.defineProperty(document, prop, {
          get: () => value,
          set: () => {},
          configurable: false,
          enumerable: true
        });
      } catch (e) {}
    }
    try {
      overrideDocProp('hasFocus', function() { return true; });
      overrideDocProp('visibilityState', 'visible');
      overrideDocProp('hidden', false);
      overrideDocProp('mozHidden', false);
      overrideDocProp('webkitHidden', false);
      overrideDocProp('webkitVisibilityState', 'visible');
      document.onvisibilitychange = null;
    } catch (e) {}
  }

  // --- UI Creation & Logic ---
  function createUI() {
    if (document.getElementById('tm-ui')) return;
    const ui = document.createElement('div');
    ui.id = 'tm-ui';
    ui.tabIndex = 0;
    ui.setAttribute('aria-label', 'Timer/Video Speed Toggle');
    ui.style.cssText =
      `position:fixed;z-index:${UI_ZINDEX};width:${UI_SIZE}px;height:${UI_SIZE}px;` +
      `border-radius:50%;display:flex;align-items:center;justify-content:center;user-select:none;` +
      `cursor:grab;transition:background ${THEME_BG_TRANSITION}s,box-shadow .18s,transform .12s,left .28s,top .28s;` +
      `background:rgba(255,255,255,0.12);box-shadow:0 2px 18px rgba(0,0,0,0.12);backdrop-filter:blur(10px);` +
      `webkit-backdrop-filter:blur(10px);border:1.1px solid rgba(98,168,210,0.12);will-change:top,left,transform;`;
    setPos(uiPos);

    function setPos(pos) {
      ui.style.top = typeof pos.top === 'string' ? pos.top : (pos.top + 'px');
      ui.style.left = typeof pos.left === 'string' ? pos.left : (pos.left + 'px');
    }
    function updateIcon() {
      ui.innerHTML = started ? iconSVG('stop', true) : iconSVG('play', false);
    }
    updateIcon();

    // Theme adapt
    function themeUpdate() {
      const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches;
      ui.style.background = dark ? 'rgba(27,42,58,0.17)' : 'rgba(255,255,255,0.12)';
      ui.style.borderColor = dark ? 'rgba(22,180,240,0.20)' : 'rgba(98,168,210,0.12)';
      ui.style.boxShadow = dark ? '0 4px 22px rgba(19,48,64,0.14)' : '0 2px 18px rgba(40,70,100,0.09)';
    }
    themeUpdate();
    window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change', themeUpdate);

    // --- Drag handlers ---
    let dragging = false, dragStart = null;
    ui.addEventListener('mousedown', e => {
      dragging = true;
      dragStart = { x: e.clientX - ui.offsetLeft, y: e.clientY - ui.offsetTop };
      document.body.style.userSelect = 'none';
      ui.style.cursor = 'grabbing';
      edgeIdle.cancel();
    });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      let pos = clampUIPos(e.clientX - dragStart.x, e.clientY - dragStart.y);
      uiPos = pos; setPos(pos);
    });
    window.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false; ui.style.cursor = 'grab'; document.body.style.userSelect = '';
      savePos(uiPos); edgeIdle.reset();
    });
    ui.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) return;
      dragging = true;
      const t = e.touches[0];
      dragStart = { x: t.clientX - ui.offsetLeft, y: t.clientY - ui.offsetTop };
      document.body.style.userSelect = 'none';
      ui.style.cursor = 'grabbing';
      edgeIdle.cancel();
    }, { passive: false });
    window.addEventListener('touchmove', e => {
      if (!dragging || e.touches.length !== 1) return;
      const t = e.touches[0];
      let pos = clampUIPos(t.clientX - dragStart.x, t.clientY - dragStart.y);
      uiPos = pos; setPos(pos); e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchend', () => {
      if (!dragging) return;
      dragging = false; ui.style.cursor = 'grab'; document.body.style.userSelect = '';
      savePos(uiPos); edgeIdle.reset();
    });

    // --- Toggle handler ---
    function toggle() {
      started = !started;
      speed = started ? SPEED_FAST : SPEED_NORMAL;
      updateIcon(); applySpeed(); pulse(); edgeIdle.reset();
    }
    ui.addEventListener('click', e => { if (!dragging) toggle(); });

    // (Optional: Keyboard accessibility, can uncomment for extra accessibility)
    // ui.addEventListener('keydown', e => {
    //   if (e.key === ' ' || e.key === 'Enter') {
    //     e.preventDefault(); toggle();
    //   }
    // });

    // --- Half-hide after idle ---
    let hideTO = null;
    const edgeIdle = {
      reset: function () {
        ui.style.transform = 'none';
        clearTimeout(hideTO);
        hideTO = setTimeout(() => {
          let left = typeof uiPos.left === 'number' ? uiPos.left : parseFloat(uiPos.left) || 0,
              side = left < (window.innerWidth - UI_SIZE) / 2 ? 'left' : 'right',
              shift = UI_SIZE * HIDE_SHIFT_FACTOR;
          if (side === 'left') {
            ui.style.left = (-shift) + 'px';
            hiddenEdge = 'left';
          } else {
            ui.style.left = (window.innerWidth - shift) + 'px';
            hiddenEdge = 'right';
          }
        }, AUTOEDGE);
      },
      cancel: function () {
        clearTimeout(hideTO);
        if (hiddenEdge) { setPos(uiPos); ui.style.transform = 'none'; hiddenEdge = null; }
      }
    };
    // UI-only events reset/cancel idle
    ['mouseenter', 'mousedown', 'touchstart', 'mouseup', 'touchend'].forEach(evt =>
      ui.addEventListener(evt, edgeIdle.cancel)
    );
    ['mouseleave'].forEach(evt =>
      ui.addEventListener(evt, edgeIdle.reset)
    );
    window.addEventListener('resize', () => {
      let pos = clampUIPos(parseFloat(ui.style.left) || 0, parseFloat(ui.style.top) || 0);
      uiPos = pos; setPos(pos);
    });

    // Quick scale animation on toggle
    function pulse() { ui.style.transform = "scale(1.13)"; setTimeout(() => ui.style.transform = "", 120); }

    setPos(uiPos); ui.style.opacity = 1; edgeIdle.reset();
    (document.body || document.documentElement).appendChild(ui);

    // Keep UI alive if DOM changes
    if (observer) observer.disconnect();
    observer = new MutationObserver(() => {
      if (!document.getElementById('tm-ui')) setTimeout(createUI, RETRY_INIT_MS);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  // --- Robust Init ---
  function robustInit() {
    if (window.top !== window.self) return;
    let ready = false;
    function tryInit() {
      if (ready) return;
      if (document.body) {
        ready = true;
        patchTimers(() => speed);
        setAllVideos(speed);
        createUI();
        setTimeout(() => { blockPageVisibilityDetection(); }, 180);
      } else {
        setTimeout(tryInit, RETRY_INIT_MS);
      }
    }
    tryInit();
  }

  // --- Main Entrypoint ---
  if (document.getElementById('tm-ui')) return;
  if (document.readyState !== "complete" && document.readyState !== "interactive")
    document.addEventListener('DOMContentLoaded', robustInit);
  else robustInit();
})();
