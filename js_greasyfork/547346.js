// ==UserScript==
// @name         Instagram Video Progressbar + Scrubbing
// @namespace    https://greasyfork.org/
// @version      1.0.0
// @description  Adds a small progress bar under Instagram videos and lets you click/drag to seek (scrub). Works on dynamically loaded videos.
// @match        *://www.instagram.com/*
// @author        X0John
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/547346/Instagram%20Video%20Progressbar%20%2B%20Scrubbing.user.js
// @updateURL https://update.greasyfork.org/scripts/547346/Instagram%20Video%20Progressbar%20%2B%20Scrubbing.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ------------- CONFIG -------------
  const CONFIG = {
    heightPx: 4,// progress bar height in px
    bgColor: 'rgba(255,255,255,0.16)', // background bar color
    elapsedColor: '#ff2d55',// elapsed (filled) color
    disableLoop: false,// if true, force video.loop = false
    unmute: false,// if true, try to unmute video (may be fragile)
    debug: false // set true to enable console logs
  };
  // ----------------------------------

  function log(...args) { if (CONFIG.debug) console.log('IG-PROG:', ...args); }

  // Add progress UI & handlers for a single <video> element
  function attachProgress(video) {
    if (!video || video.dataset.igprogAttached) return;
    video.dataset.igprogAttached = '1';
    log('attachProgress', video);

    // Find an appropriate container to append the absolute-positioned bar.
    // Usually the video's parent element is usable; make it positioned if needed.
    const container = video.parentElement || video.parentNode || video;
    try {
      const cs = getComputedStyle(container);
      if (cs.position === 'static') {
        // set relative so absolute bar positions correctly
        container.style.position = 'relative';
        // small marker to remember we changed it
        container.dataset.igprogMadeRelative = '1';
      }
    } catch (err) {
      // ignore; fallback below
    }

    // Create bar elements
    const outer = document.createElement('div');
    outer.className = 'ig-progress-outer';
    const inner = document.createElement('div');
    inner.className = 'ig-progress-inner';
    outer.appendChild(inner);

    // Style
    Object.assign(outer.style, {
      position: 'absolute',
      left: '0',
      right: '0',
      bottom: '0',
      height: CONFIG.heightPx + 'px',
      background: CONFIG.bgColor,
      cursor: 'pointer',
      zIndex: '9999',
      pointerEvents: 'auto',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      transition: 'opacity .2s',
      opacity: '0.9'
    });
    Object.assign(inner.style, {
      width: '0px',
      height: '100%',
      background: CONFIG.elapsedColor,
      transition: 'width 100ms linear'
    });

    // Insert: put after video so it overlays the bottom of the video
    container.appendChild(outer);

    // Seek logic using pointer events (works for mouse + touch)
    let dragging = false;
    let lastPointerId = null;

    function getRect() {
      // ensure outer.getBoundingClientRect() is used; it follows parent positioning
      return outer.getBoundingClientRect();
    }

    function clamp(n, a, b) { return Math.min(Math.max(n, a), b); }

    function seekByClientX(clientX) {
      const rect = getRect();
      const width = rect.width || outer.offsetWidth || video.offsetWidth;
      if (!width || !video.duration || !isFinite(video.duration)) return;
      const ratio = clamp((clientX - rect.left) / width, 0, 1);
      try { video.currentTime = ratio * video.duration; } catch (e) { /* ignore */ }
      inner.style.width = Math.ceil(ratio * width) + 'px';
    }

    function onPointerDown(e) {
      // Only handle primary button
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();

      dragging = true;
      lastPointerId = e.pointerId;
      // temporarily disable transition for smoother drag
      inner.style.transition = 'none';
      try { outer.setPointerCapture(e.pointerId); } catch (err) {}
      seekByClientX(e.clientX);
    }

    function onPointerMove(e) {
      if (!dragging) return;
      if (lastPointerId != null && e.pointerId !== lastPointerId) return;
      e.preventDefault();
      e.stopPropagation();
      seekByClientX(e.clientX);
    }

    function onPointerUp(e) {
      if (!dragging) return;
      if (lastPointerId != null && e.pointerId !== lastPointerId) return;
      e.preventDefault();
      e.stopPropagation();
      dragging = false;
      lastPointerId = null;
      // restore transition
      inner.style.transition = 'width 100ms linear';
      try { outer.releasePointerCapture && outer.releasePointerCapture(e.pointerId); } catch (err) {}
    }

    outer.addEventListener('pointerdown', onPointerDown, { passive: false });
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp, { passive: false });
    window.addEventListener('pointercancel', onPointerUp, { passive: false });

    // Update the bar as video plays (but avoid clobbering while dragging)
    function updateBar() {
      if (dragging) return;
      const dur = video.duration;
      if (!dur || !isFinite(dur)) return;
      const ratio = clamp(video.currentTime / dur, 0, 1);
      const w = outer.getBoundingClientRect().width || outer.offsetWidth || video.offsetWidth || 0;
      inner.style.width = Math.ceil(ratio * w) + 'px';
    }

    // When duration/metadata load, update once
    video.addEventListener('loadedmetadata', updateBar);
    // Real-time updates
    video.addEventListener('timeupdate', updateBar);
    // Also on play/seeked
    video.addEventListener('play', updateBar);
    video.addEventListener('seeked', updateBar);
    // If video ends, fill bar
    video.addEventListener('ended', () => { inner.style.width = '100%'; });

    // Optional: disable loop forcing
    if (CONFIG.disableLoop) {
      try { video.loop = false; } catch (e) {}
    }

    // Optional: attempt to unmute (may or may not work due to site controls)
    if (CONFIG.unmute && video.muted) {
      try { video.muted = false; } catch (e) {}
    }

    // Clean up if video removed from DOM
    const mo = new MutationObserver(() => {
      if (!document.contains(video)) {
        // remove listeners & bar
        outer.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
        video.removeEventListener('loadedmetadata', updateBar);
        video.removeEventListener('timeupdate', updateBar);
        video.removeEventListener('play', updateBar);
        video.removeEventListener('seeked', updateBar);
        try { outer.remove(); } catch (ex) {}
        try { mo.disconnect(); } catch (ex) {}
        log('cleaned up for video');
      }
    });
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });

    // initial update (if metadata already loaded)
    setTimeout(updateBar, 50);
  }

  // Scan existing videos and attach
  function scanAndAttach(root = document) {
    const videos = root.querySelectorAll && root.querySelectorAll('video');
    if (!videos) return;
    videos.forEach(v => attachProgress(v));
  }

  // Observe DOM for added videos
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        m.addedNodes.forEach(node => {
          if (!node) return;
          if (node.nodeType !== 1) return;
          if (node.tagName && node.tagName.toLowerCase() === 'video') {
            attachProgress(node);
          } else {
            // might contain videos deep inside
            try {
              const vids = node.querySelectorAll && node.querySelectorAll('video');
              if (vids && vids.length) {
                vids.forEach(v => attachProgress(v));
              }
            } catch (e) { /* ignore cross-origin etc */ }
          }
        });
      }
    }
  });

  // Start
  scanAndAttach();
  observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

  // Also periodically (safety) rescan a few times in case videos were added in awkward ways
  let tries = 0;
  const rescanInterval = setInterval(() => {
    scanAndAttach();
    tries++;
    if (tries > 20) clearInterval(rescanInterval);
  }, 1000);

  log('Instagram progressbar script loaded');

})();
