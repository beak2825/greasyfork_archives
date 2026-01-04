// ==UserScript==
// @name         YouTube Chapter Readability Overlay (toggle + blur)
// @namespace    https://20dots.com
// @license      MIT
// @version      1.1.0
// @description  Adds a semi-transparent (and optionally blurred) black overlay over the bottom ~20% of the YouTube player when controls are visible. Toggle modes with Ctrl+O.
// @match        https://www.youtube.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545519/YouTube%20Chapter%20Readability%20Overlay%20%28toggle%20%2B%20blur%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545519/YouTube%20Chapter%20Readability%20Overlay%20%28toggle%20%2B%20blur%29.meta.js
// ==/UserScript==

(() => {
  // --- Tweakables ---
  const OVERLAY_HEIGHT = 95;   // bottom area height as % of player height
  const OVERLAY_OPACITY    = 0.40; // 0..1 for the darkening layer
  const BLUR_PX            = 10;    // blur radius when blur mode is active
  const TOGGLE_HOTKEY      = { ctrlKey:true, key: 'o' }; // Alt+O cycles modes
  // -------------------

  // Modes: 0 = Off, 1 = Dim, 2 = Dim + Blur
  const LS_KEY = 'ytChapterOverlayMode';
  let mode = Number(localStorage.getItem(LS_KEY) ?? '2'); // default to Dim+Blur

  let overlay, player, controls, checkTimer, playerObserver, routeHandlerAttached = false;

  function saveMode() { localStorage.setItem(LS_KEY, String(mode)); }
  function showToast(text) {
    try {
      const toast = document.createElement('div');
      Object.assign(toast.style, {
        position: 'fixed', left: '50%', bottom: '96px', transform: 'translateX(-50%)',
        padding: '6px 10px', background: 'rgba(0,0,0,0.8)', color: '#fff',
        font: '500 12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial',
        borderRadius: '8px', zIndex: 999999, pointerEvents: 'none', opacity: '0',
        transition: 'opacity 150ms ease'
      });
      toast.textContent = text;
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.style.opacity = '1');
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 180);
      }, 900);
    } catch {}
  }

  function findPlayer() {
    return document.querySelector('#movie_player.html5-video-player') ||
           document.querySelector('.html5-video-player');
  }
  function findControls() {
    return player?.querySelector('.ytp-chrome-bottom');
  }

  function ensureOverlay() {
    if (!player || overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'yt-chapter-contrast-overlay';
    Object.assign(overlay.style, {
      position: 'absolute',
      left: 0, right: 0, bottom: 0,
      height: `${OVERLAY_HEIGHT}pt`,
      background: `rgba(0,0,0,${OVERLAY_OPACITY})`,
      pointerEvents: 'none',
      zIndex: '30',                 // below YT controls (~60) but above the video
      opacity: '0',
      transition: 'opacity 120ms ease',
      // blur is toggled dynamically
    });
    const cs = getComputedStyle(player);
    if (cs.position === 'static') player.style.position = 'relative';
    player.appendChild(overlay);
    applyModeStyles();
  }

  function applyModeStyles() {
    if (!overlay) return;
    // Base darkening always present when visible; blur added conditionally
    overlay.style.backdropFilter = (mode === 2) ? `blur(${BLUR_PX}px)` : '';
    overlay.style.webkitBackdropFilter = overlay.style.backdropFilter; // Safari / Chromium
  }

  function isControlsVisible() {
    const autoHidden = player?.classList.contains('ytp-autohide') || player?.classList.contains('ytp-hide-controls');
    if (autoHidden === false) return true;
    if (controls) {
      const style = getComputedStyle(controls);
      const visible = controls.offsetHeight > 0 && style.opacity !== '0' && style.visibility !== 'hidden';
      if (visible) return true;
    }
    return false;
  }

  function updateOverlayVisibility() {
    if (!overlay) return;
    // Show only if controls are visible AND mode != Off
    overlay.style.opacity = (mode !== 0 && isControlsVisible()) ? '1' : '0';
  }

  function startPolling() {
    stopPolling();
    checkTimer = setInterval(updateOverlayVisibility, 250);
  }
  function stopPolling() {
    if (checkTimer) { clearInterval(checkTimer); checkTimer = null; }
  }

  function observePlayer() {
    if (!player) return;
    disconnectObserver();
    playerObserver = new MutationObserver(() => {
      controls = findControls();
      updateOverlayVisibility();
    });
    playerObserver.observe(player, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true });
  }
  function disconnectObserver() {
    if (playerObserver) { playerObserver.disconnect(); playerObserver = null; }
  }

  function teardown() {
    stopPolling();
    disconnectObserver();
    overlay?.remove(); overlay = null;
    player = null; controls = null;
  }

  function initOnceReady(attempts = 0) {
    player = findPlayer();
    if (!player) {
      if (attempts < 80) return void setTimeout(() => initOnceReady(attempts + 1), 100); // ~8s
      return;
    }
    controls = findControls();
    ensureOverlay();
    observePlayer();
    startPolling();
    updateOverlayVisibility();
  }

  function onRouteChange() {
    teardown();
    initOnceReady();
  }

  function attachRouteHandlers() {
    if (routeHandlerAttached) return;
    routeHandlerAttached = true;
    document.addEventListener('yt-navigate-finish', onRouteChange);
    document.addEventListener('yt-player-updated', onRouteChange);
    // Fallback URL watcher
    let lastUrl = location.href;
    new MutationObserver(() => {
      if (location.href !== lastUrl) { lastUrl = location.href; onRouteChange(); }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  function keyMatches(e, spec) {
    return !!spec &&
      !!e &&
      (spec.ctrlKey  == null || !!e.ctrlKey  === !!spec.ctrlKey) &&
      (spec.shiftKey == null || !!e.shiftKey === !!spec.shiftKey) &&
      (spec.altKey   == null || !!e.altKey   === !!spec.altKey) &&
      (spec.metaKey  == null || !!e.metaKey  === !!spec.metaKey) &&
      (e.key?.toLowerCase?.() === spec.key?.toLowerCase?.());
  }

  function onKeyDown(e) {
    // Ignore when typing in inputs/textareas/contenteditable
    const t = e.target;
    const typing = t && (
      t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' ||
      t.isContentEditable || t.getAttribute?.('role') === 'textbox'
    );
    if (typing) return;

    if (keyMatches(e, TOGGLE_HOTKEY)) {
      e.preventDefault();
      mode = (mode + 1) % 3; // 0 -> 1 -> 2 -> 0
      saveMode();
      applyModeStyles();
      updateOverlayVisibility();
      showToast(`Chapter Overlay: ${['Off','Dim','Dim + Blur'][mode]}`);
    }
  }

  // Boot
  attachRouteHandlers();
  initOnceReady();
  window.addEventListener('keydown', onKeyDown, true);
})();