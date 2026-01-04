// ==UserScript==
// @name         Instagram — 2x while long left-click (hold) 
// @namespace    https://greasyfork.org/
// @version      1.3.0
// @match        *://www.instagram.com/*
// @grant        none
// @run-at       document-end
// @description Hold LEFT mouse on a video/Reel to play at 2x while holding; release restores speed/state. Input-safe: won’t block focusing the comment box or other text fields.
// @downloadURL https://update.greasyfork.org/scripts/547355/Instagram%20%E2%80%94%202x%20while%20long%20left-click%20%28hold%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547355/Instagram%20%E2%80%94%202x%20while%20long%20left-click%20%28hold%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- CONFIG ----------
  const CONFIG = {
    speed: 2.0,             // playbackRate while holding
    holdMs: 450,            // ms to hold left button before triggering
    showOverlay: true,      // show small "2x" overlay while active
    overlayOffset: { x: 12, y: 12 },
    moveCancelPx: 12,       // cancel if pointer moves this many px before trigger
    enforceIntervalMs: 180, // re-apply playbackRate while active
    overlayStyle: {
      position: 'absolute',
      padding: '6px 8px',
      background: 'rgba(0,0,0,0.72)',
      color: '#fff',
      borderRadius: '6px',
      fontSize: '13px',
      zIndex: 2147483647,
      pointerEvents: 'none',
      transition: 'opacity .12s linear'
    }
  };
  // ----------------------------

  let holdTimer = null;
  let active = false;
  let targetVideo = null;
  let savedRate = 1;
  let savedPaused = true;
  let pointerId = null;
  let pointerDownTarget = null;
  let startX = 0, startY = 0;
  let suppressClick = false;    // suppress the click immediately after a long-press
  let overlayEl = null;
  let enforcerId = null;
  let startedOnVideo = false;

  function isEditableTarget(el) {
    return !!(el && el.closest && el.closest('input, textarea, [contenteditable=""], [contenteditable="true"], [role="textbox"]'));
  }

  function makeOverlay() {
    if (!CONFIG.showOverlay) return null;
    const d = document.createElement('div');
    d.textContent = `${CONFIG.speed}×`;
    Object.assign(d.style, CONFIG.overlayStyle);
    d.style.display = 'none';
    document.body.appendChild(d);
    return d;
  }

  function showOverlayAt(x, y) {
    if (!CONFIG.showOverlay) return;
    if (!overlayEl) overlayEl = makeOverlay();
    if (!overlayEl) return;
    overlayEl.style.left = (x + CONFIG.overlayOffset.x) + 'px';
    overlayEl.style.top  = (y + CONFIG.overlayOffset.y) + 'px';
    overlayEl.style.display = 'block';
    overlayEl.style.opacity = '1';
  }

  function hideOverlay() {
    if (!overlayEl) return;
    overlayEl.style.opacity = '0';
    setTimeout(() => { if (overlayEl) overlayEl.style.display = 'none'; }, 140);
  }

  function findVideoFromElement(el) {
    try {
      if (!el) return null;
      if (el.tagName && el.tagName.toLowerCase() === 'video') return el;
      if (el.querySelector) {
        const inside = el.querySelector('video');
        if (inside) return inside;
      }
      if (el.closest) {
        const anc = el.closest('video');
        if (anc) return anc;
      }
    } catch (_) {}
    return null;
  }

  function findVideoFromPoint(x, y) {
    if (!document.elementsFromPoint) {
      const el = document.elementFromPoint(x, y);
      return findVideoFromElement(el);
    }
    const stack = document.elementsFromPoint(x, y);
    for (const el of stack) {
      const v = findVideoFromElement(el);
      if (v) return v;
    }
    return null;
  }

  function startEnforcer() {
    if (enforcerId) clearInterval(enforcerId);
    enforcerId = setInterval(() => {
      try { if (active && targetVideo) targetVideo.playbackRate = CONFIG.speed; } catch (_) {}
    }, CONFIG.enforceIntervalMs);
  }

  function stopEnforcer() {
    if (enforcerId) { clearInterval(enforcerId); enforcerId = null; }
  }

  function triggerLongPress(video, clientX, clientY) {
    if (!video) return;
    targetVideo  = video;
    savedRate    = video.playbackRate || 1;
    savedPaused  = !!video.paused;
    try {
      video.playbackRate = CONFIG.speed;
      video.play().catch(() => {});
    } catch (_) {}
    active = true;
    suppressClick = true;          // suppress only the *next* click (see handler below)
    showOverlayAt(clientX, clientY);
    startEnforcer();

    // capture pointer now (on the original down target) to keep tracking while over overlays
    try {
      if (pointerDownTarget && pointerDownTarget.setPointerCapture && pointerId != null) {
        pointerDownTarget.setPointerCapture(pointerId);
      }
    } catch (_) {}
  }

  function restoreState() {
    if (active && targetVideo) {
      try {
        targetVideo.playbackRate = savedRate;
        if (savedPaused) { try { targetVideo.pause(); } catch (_) {} }
      } catch (_) {}
    }
    active = false;
    targetVideo = null;
    savedRate = 1;
    savedPaused = true;
    hideOverlay();
    stopEnforcer();
    // keep suppressClick true so the immediate synthetic click from the long-press is eaten,
    // but our click handler below will NOT suppress clicks on editable fields.
  }

  // --- Event handlers (capture phase where appropriate) ---

  function onPointerDown(e) {
    if (e.button !== 0) return;                 // left button only
    if (isEditableTarget(e.target)) return;     // don't interfere with inputs/comment boxes

    const v = findVideoFromPoint(e.clientX, e.clientY);
    if (!v) return;                              // only start if actually on a video/Reel

    pointerId = e.pointerId ?? null;
    pointerDownTarget = e.target;
    startX = e.clientX;
    startY = e.clientY;
    startedOnVideo = true;

    // DO NOT call preventDefault here — we want inputs & focusing to work.
    holdTimer = setTimeout(() => {
      holdTimer = null;
      triggerLongPress(v, e.clientX, e.clientY);
    }, CONFIG.holdMs);
  }

  function onPointerMove(e) {
    if (pointerId != null && e.pointerId !== pointerId) return;
    if (holdTimer) {
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.hypot(dx, dy) > CONFIG.moveCancelPx) {
        clearTimeout(holdTimer);
        holdTimer = null;
        startedOnVideo = false;
      }
    }
    if (active && CONFIG.showOverlay) showOverlayAt(e.clientX, e.clientY);
  }

  function onPointerUp(e) {
    if (pointerId != null && e.pointerId !== pointerId) return;
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    if (active) restoreState();

    // release capture if set
    try {
      if (pointerDownTarget && pointerDownTarget.releasePointerCapture && pointerId != null) {
        pointerDownTarget.releasePointerCapture(pointerId);
      }
    } catch (_) {}

    pointerId = null;
    pointerDownTarget = null;
    startedOnVideo = false;
  }

  function onPointerCancel(e) {
    if (pointerId != null && e.pointerId !== pointerId) return;
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    if (active) restoreState();
    try {
      if (pointerDownTarget && pointerDownTarget.releasePointerCapture && pointerId != null) {
        pointerDownTarget.releasePointerCapture(pointerId);
      }
    } catch (_) {}
    pointerId = null;
    pointerDownTarget = null;
    startedOnVideo = false;
  }

  // Only suppress the click that immediately follows a long-press,
  // and NEVER suppress clicks on editable targets (comment box, inputs, etc.).
  function onClickCapture(e) {
    if (!suppressClick) return;
    if (isEditableTarget(e.target)) {           // let comment box focus normally
      suppressClick = false;
      return;
    }
    // Also only suppress if we actually started on a video
    if (!startedOnVideo) { suppressClick = false; return; }

    e.preventDefault();
    e.stopImmediatePropagation();
    suppressClick = false;
  }

  // Listeners
  document.addEventListener('pointerdown',   onPointerDown,  { capture: true, passive: false });
  document.addEventListener('pointermove',   onPointerMove,  { capture: true, passive: false });
  document.addEventListener('pointerup',     onPointerUp,    { capture: true, passive: false });
  document.addEventListener('pointercancel', onPointerCancel,{ capture: true, passive: false });
  document.addEventListener('click',         onClickCapture, { capture: true, passive: false });

  // Safety for mouse-only environments
  document.addEventListener('mouseup', (e) => {
    if (e.button !== 0) return;
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    if (active) restoreState();
    pointerId = null;
    pointerDownTarget = null;
    startedOnVideo = false;
  }, { capture: true, passive: false });

  // Cleanup
  window.addEventListener('beforeunload', () => {
    if (holdTimer) clearTimeout(holdTimer);
    if (active) restoreState();
    if (overlayEl && overlayEl.parentNode) overlayEl.parentNode.removeChild(overlayEl);
  });
})();
