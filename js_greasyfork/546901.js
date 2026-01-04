// ==UserScript==
// @name         IG Reels Auto-Advance (+ Toggle)
// @namespace     https://github.com/wintrick/reels-auto-scroll 
// @version      1.0
// @description  Auto-advance to the next Instagram Reel when the current one ends (handles looping) with a toggle button
// @match        https://www.instagram.com/*
// @run-at       document-idle
// @grant        none
// @license Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/546901/IG%20Reels%20Auto-Advance%20%28%2B%20Toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546901/IG%20Reels%20Auto-Advance%20%28%2B%20Toggle%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var STORAGE_KEY = 'igReelsAutoScroll';
  var enabled = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'true');

  function createToggle() {
    if (document.getElementById('ig-auto-advance-toggle')) return;
    var btn = document.createElement('button');
    btn.id = 'ig-auto-advance-toggle';
    btn.textContent = 'Auto-Scroll: ' + (enabled ? 'ON' : 'OFF');
    var s = btn.style;
    s.position = 'fixed';
    s.top = '80px';
    s.right = '20px';
    s.zIndex = '99999';
    s.background = '#111';
    s.color = '#fff';
    s.border = 'none';
    s.padding = '8px 12px';
    s.borderRadius = '10px';
    s.fontSize = '13px';
    s.cursor = 'pointer';
    s.opacity = '0.85';
    btn.onclick = function () {
      enabled = !enabled;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enabled));
      btn.textContent = 'Auto-Scroll: ' + (enabled ? 'ON' : 'OFF');
    };
    document.body.appendChild(btn);
  }

  function getScrollContainer() {
    // Prefer a large, snap-scrolling container if present
    var snap = document.querySelector('div[style*="scroll-snap-type"]');
    if (snap && snap.scrollHeight > snap.clientHeight) return snap;

    // Fallback: largest scrollable div roughly viewport-sized
    var nodes = document.querySelectorAll('div');
    var best = null;
    var bestH = 0;
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var cs = window.getComputedStyle(el);
      if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') &&
          el.scrollHeight > el.clientHeight + 5 &&
          el.clientHeight >= window.innerHeight * 0.6) {
        if (el.clientHeight > bestH) { best = el; bestH = el.clientHeight; }
      }
    }
    return best;
  }

  function smoothScrollNext() {
    var sc = getScrollContainer();
    var amount = (sc && sc.clientHeight) ? sc.clientHeight : window.innerHeight;

    // Debounce global: avoid double-firing on the same near-end window
    if (smoothScrollNext._lock) return;
    smoothScrollNext._lock = true;
    setTimeout(function(){ smoothScrollNext._lock = false; }, 800);

    if (sc && typeof sc.scrollBy === 'function') {
      sc.scrollBy({ top: amount, behavior: 'smooth' });
    } else if (sc) {
      sc.scrollTop = sc.scrollTop + amount;
    } else {
      window.scrollBy({ top: amount, behavior: 'smooth' });
    }
  }

  function isInViewport(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var vw = window.innerWidth || document.documentElement.clientWidth;
    var visH = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    var visW = Math.min(r.right, vw) - Math.max(r.left, 0);
    return visH > vh * 0.5 && visW > vw * 0.5;
  }

  function bindVideo(video) {
    if (!video || video.dataset.igAutoBound === '1') return;
    video.dataset.igAutoBound = '1';

    // If reels ever stop looping, this still works:
    video.addEventListener('ended', function () {
      if (enabled) smoothScrollNext();
    });

    // Loop-safe near-end watcher
    var tickTimer = null;
    function checkNearEnd() {
      if (!enabled) return;
      if (!isInViewport(video)) return;
      var d = video.duration, t = video.currentTime;
      if (!isFinite(d) || d <= 0) return;
      // Trigger within last ~200ms
      if (d - t <= 0.2) {
        if (video.dataset.igJustAdvanced !== '1') {
          video.dataset.igJustAdvanced = '1';
          smoothScrollNext();
          setTimeout(function(){ video.dataset.igJustAdvanced = '0'; }, 1500);
        }
      }
    }
    function start() {
      if (tickTimer) clearInterval(tickTimer);
      tickTimer = setInterval(checkNearEnd, 200);
    }
    function stop() {
      if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
    }

    video.addEventListener('play', start);
    video.addEventListener('loadedmetadata', checkNearEnd);
    video.addEventListener('timeupdate', checkNearEnd);
    video.addEventListener('pause', stop);

    // If it’s already playing when we attach:
    if (!video.paused) start();
  }

  function scanAndBind() {
    var vids = document.querySelectorAll('video');
    for (var i = 0; i < vids.length; i++) bindVideo(vids[i]);
  }

  function init() {
    createToggle();
    scanAndBind();

    // Watch for route changes / virtual DOM updates
    var mo = new MutationObserver(function () {
      createToggle();
      scanAndBind();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();