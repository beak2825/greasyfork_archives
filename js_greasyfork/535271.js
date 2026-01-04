// ==UserScript==
// @name        Bye Bye YouTube Ads - Stealth Mode (Safer Patch)
// @version     3.3
// @description Stealthy ad-skipper for YouTube with safer ad detection and stricter speed-up safeguards to avoid speeding real videos.
// @author      DishantX (safer patch)
// @match       *://www.youtube.com/*
// @exclude     *://www.youtube.com/*/music*
// @exclude     *://music.youtube.com/*
// @exclude     *://m.youtube.com/*
// @run-at      document-idle
// @grant       none
// @namespace https://greasyfork.org/users/1467023
// @downloadURL https://update.greasyfork.org/scripts/535271/Bye%20Bye%20YouTube%20Ads%20-%20Stealth%20Mode%20%28Safer%20Patch%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535271/Bye%20Bye%20YouTube%20Ads%20-%20Stealth%20Mode%20%28Safer%20Patch%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ---------- CONFIG ----------
  const LOG = false;                // set true for verbose console logs
  const MIN_CLICK_DELAY = 500;      // ms after skip appears
  const MAX_CLICK_DELAY = 1200;     // ms
  const POLL_MIN = 700;             // ms randomized poll
  const POLL_MAX = 1500;            // ms
  const SPEED_FALLBACK = 4;         // fallback playbackRate (reduced - safer)
  const SPEED_DURATION_MIN = 900;   // minimum time to keep sped up (ms)
  const AD_SIGNAL_THRESHOLD = 2;    // require at least 2 independent signals to act
  // ----------------------------

  const log = (...args) => { if (LOG) console.log('[ByeByeYT-Safer]', ...args); };

  // --- non-destructive CSS (keep DOM nodes present) ---
  const stealthCss = `
    .ytp-ad-overlay, .ytp-featured-product, .ytp-ad-player-overlay,
    #player-ads, ytd-companion-ad-renderer, ytd-display-ad-renderer,
    ytd-banner-promo-renderer, ytd-promoted-sparkles-text-renderer,
    ytd-ad-slot-renderer {
      opacity: 0 !important;
      pointer-events: none !important;
      transform: none !important;
    }
    .ytd-promoted-sparkles-text-renderer, .ytp-ce-element {
      opacity: 0.01 !important;
      pointer-events: none !important;
    }
    #bbye-stealth-toggle {
      position: fixed; right: 10px; bottom: 80px; z-index: 2147483647;
      background: rgba(0,0,0,0.6); color: white; font-family: Arial, Helvetica, sans-serif;
      font-size: 12px; padding: 8px 10px; border-radius: 8px; cursor: pointer;
      user-select: none; box-shadow: 0 6px 18px rgba(0,0,0,0.45); backdrop-filter: blur(4px);
    }
    #bbye-stealth-toggle[data-enabled="false"] { opacity: 0.45; }
  `;
  const style = document.createElement('style');
  style.setAttribute('data-bbye-stealth', '1');
  style.textContent = stealthCss;
  (document.head || document.documentElement).appendChild(style);

  // --- helpers ---
  function randBetween(min, max) { return Math.floor(min + Math.random() * (max - min)); }
  function qsAll(sel) { try { return Array.from(document.querySelectorAll(sel)); } catch (e) { return []; } }

  function isSkipButton(el) {
    if (!el || el.nodeType !== 1) return false;
    try {
      const aria = (el.getAttribute && el.getAttribute('aria-label')) || '';
      const txt = (el.textContent || '').trim();
      const cls = (el.className || '').toLowerCase();
      if (/skip ad|skipads|skip this ad|skip ad(s)?|skip ad$/i.test(aria + ' ' + txt)) return true;
      if (cls.includes('ytp-ad-skip') || cls.includes('skip-button') || /^skip ad$/i.test(txt)) return true;
    } catch (e) {}
    return false;
  }

  function findSkipButtons() {
    const candidates = qsAll('button, a[role="button"], div[role="button"]');
    return candidates.filter(isSkipButton);
  }

  // --- AD SIGNALS ---
  // Each function returns true/false for presence of a particular ad signal.
  function signal_player_adshowing() {
    const player = document.getElementById('movie_player');
    return !!(player && player.classList && player.classList.contains('ad-showing'));
  }
  function signal_skip_buttons() {
    return findSkipButtons().length > 0;
  }
  function signal_ad_overlay() {
    return !!document.querySelector('.ytp-ad-player-overlay, .ytp-ad-overlay, .ytp-ad-image-overlay');
  }
  function signal_ad_renderers() {
    return !!document.querySelector('ytd-display-ad-renderer, ytd-companion-ad-renderer, ytd-banner-promo-renderer, ytd-promoted-sparkles-text-renderer');
  }
  function signal_ad_duration() {
    // ytp-ad-duration-remaining (or similar) indicates ad timing overlay
    return !!document.querySelector('.ytp-ad-duration-remaining, .ytp-ad-time-remaining, .ytp-paid-content-badge');
  }

  function gatherAdSignals() {
    const signals = [];
    try {
      if (signal_player_adshowing()) signals.push('player:ad-showing');
      if (signal_skip_buttons()) signals.push('skip-button');
      if (signal_ad_overlay()) signals.push('ad-overlay');
      if (signal_ad_renderers()) signals.push('ad-renderer');
      if (signal_ad_duration()) signals.push('ad-duration');
    } catch (e) { log('gatherAdSignals err', e); }
    return signals;
  }

  function isLikelyAd() {
    const signals = gatherAdSignals();
    log('ad signals:', signals);
    return signals.length >= AD_SIGNAL_THRESHOLD;
  }

  // --- Actions ---
  function clickWithHumanDelay(el) {
    if (!el) return false;
    const delay = randBetween(MIN_CLICK_DELAY, MAX_CLICK_DELAY);
    setTimeout(() => {
      try { el.click(); log('Clicked element after', delay, el); } catch (e) { log('click failed', e); }
    }, delay);
    return true;
  }

  let _speedState = { active: false, prevRate: 1, restoreTimer: null };

  function speedUpVideoTemporaryIfAd(video) {
    if (!video) video = document.querySelector('video');
    if (!video) return false;
    // Very important: re-check ad signals immediately — only proceed if still likely ad
    if (!isLikelyAd()) { log('refused to speed: not enough ad signals'); return false; }

    try {
      if (_speedState.active) return true;
      const prev = (video.playbackRate && video.playbackRate > 0) ? video.playbackRate : 1;
      _speedState.prevRate = prev;
      // Use conservative fallback speed
      video.playbackRate = Math.max(prev, SPEED_FALLBACK);
      _speedState.active = true;
      log('sped video from', prev, '->', video.playbackRate);
      // ensure restore is scheduled at min duration
      _speedState.restoreTimer = setTimeout(() => {
        // restore only when ad signals gone, otherwise keep it until ad ends
        if (!isLikelyAd()) restoreVideoSpeed(video);
        else {
          // wait a bit and re-check
          if (_speedState.restoreTimer) clearTimeout(_speedState.restoreTimer);
          _speedState.restoreTimer = setTimeout(() => { if (!isLikelyAd()) restoreVideoSpeed(video); }, 800);
        }
      }, SPEED_DURATION_MIN);
      return true;
    } catch (e) { log('speedUp failed', e); return false; }
  }

  function restoreVideoSpeed(video) {
    if (!video) video = document.querySelector('video');
    if (!video) return;
    try {
      if (_speedState.restoreTimer) { clearTimeout(_speedState.restoreTimer); _speedState.restoreTimer = null; }
      if (_speedState.active) {
        video.playbackRate = (_speedState.prevRate && _speedState.prevRate > 0) ? _speedState.prevRate : 1;
        _speedState.active = false;
        log('restored playbackRate to', video.playbackRate);
      }
    } catch (e) { log('restoreVideoSpeed err', e); }
  }

  // Attempt to handle ad: click skip buttons (with human delay); if none and ad likely, fallback to speed-up
  function handleAdOnce() {
    if (!_enabled) return false;
    const signals = gatherAdSignals();
    if (signals.length < AD_SIGNAL_THRESHOLD) {
      // Not enough signals; ensure any incidental speed is restored
      const v = document.querySelector('video');
      if (v) restoreVideoSpeed(v);
      return false;
    }

    log('handleAdOnce acting on signals:', signals);

    // 1) Click skip-like buttons if present
    const skips = findSkipButtons();
    if (skips.length) {
      for (const b of skips) clickWithHumanDelay(b);
      // After the max click delay, if still ad, fallback to speed-up
      setTimeout(() => {
        if (!isLikelyAd()) return;
        const v = document.querySelector('video');
        if (v) speedUpVideoTemporaryIfAd(v);
      }, MAX_CLICK_DELAY + 150);
      return true;
    }

    // 2) Try to close overlay-style 'close' buttons
    const closers = qsAll('button, a').filter(el => {
      try {
        const aria = (el.getAttribute && el.getAttribute('aria-label')) || '';
        const txt = (el.textContent || '').trim();
        return /close ad|close overlay|dismiss ad|close/i.test(aria + ' ' + txt);
      } catch (e) { return false; }
    });
    if (closers.length) {
      for (const c of closers) clickWithHumanDelay(c);
      return true;
    }

    // 3) If no skip/close buttons but ad is still likely, then safe speed-up (only after re-check)
    const vid = document.querySelector('video');
    if (vid) {
      speedUpVideoTemporaryIfAd(vid);
      return true;
    }

    return false;
  }

  // --- Observers and polling ---
  let _pollTimer = null;
  function startRandomPolling() {
    if (_pollTimer) return;
    function loop() {
      try { if (_enabled) handleAdOnce(); } catch (e) { log('poll err', e); }
      const next = randBetween(POLL_MIN, POLL_MAX);
      _pollTimer = setTimeout(loop, next);
    }
    loop();
    log('polling started');
  }
  function stopRandomPolling() { if (_pollTimer) { clearTimeout(_pollTimer); _pollTimer = null; } }

  let _playerObserver = null;
  function attachObservers() {
    const player = document.getElementById('movie_player');
    if (player && !_playerObserver) {
      try {
        _playerObserver = new MutationObserver((mutations) => {
          for (const m of mutations) {
            if (m.type === 'attributes' && m.attributeName === 'class') {
              if (player.classList.contains('ad-showing')) {
                setTimeout(() => { if (_enabled) handleAdOnce(); }, 60);
              } else {
                // ad ended -> restore quickly
                const vid = document.querySelector('video');
                if (vid) restoreVideoSpeed(vid);
              }
            }
            if (m.addedNodes && m.addedNodes.length) {
              setTimeout(() => { if (_enabled) handleAdOnce(); }, 80);
            }
          }
        });
        _playerObserver.observe(player, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true });
        log('player observer attached');
      } catch (e) { log('attachObserver err', e); }
    }

    // Global lightweight observer
    try {
      const g = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.addedNodes && m.addedNodes.length) {
            setTimeout(() => { if (_enabled) handleAdOnce(); }, 120);
            break;
          }
        }
      });
      g.observe(document.documentElement || document.body, { childList: true, subtree: true });
      log('global observer attached');
    } catch (e) { log('global observer err', e); }
  }

  function hookNavigation() {
    document.addEventListener('yt-navigate-finish', () => {
      setTimeout(() => { if (_enabled) handleAdOnce(); }, 300);
    }, { passive: true });
    const push = history.pushState;
    history.pushState = function () {
      const res = push.apply(this, arguments);
      setTimeout(() => { if (_enabled) handleAdOnce(); }, 300);
      return res;
    };
  }

  // --- UI toggle ---
  let _enabled = true;
  function createToggle() {
    if (document.getElementById('bbye-stealth-toggle')) return;
    const t = document.createElement('div');
    t.id = 'bbye-stealth-toggle';
    t.title = 'Toggle ByeByeYT Stealth Mode';
    t.textContent = 'ByeByeYT: ON';
    t.setAttribute('data-enabled', 'true');
    t.addEventListener('click', () => {
      _enabled = !_enabled;
      t.textContent = _enabled ? 'ByeByeYT: ON' : 'ByeByeYT: OFF';
      t.setAttribute('data-enabled', _enabled ? 'true' : 'false');
      if (_enabled) {
        startRandomPolling();
        handleAdOnce();
      } else {
        stopRandomPolling();
        const v = document.querySelector('video'); if (v) restoreVideoSpeed(v);
      }
    }, { passive: true });
    document.documentElement.appendChild(t);
  }

  // init
  function init() {
    attachObservers();
    hookNavigation();
    createToggle();
    startRandomPolling();
    setTimeout(() => { if (_enabled) handleAdOnce(); }, 400);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') init();
  else window.addEventListener('DOMContentLoaded', init, { once: true });

  // If you ever see the real video speeding again: set LOG = true (top) and open DevTools -> Console.
  // The console will show "ad signals" and why the script acted. Share them and I will tighten detection further.

})();
