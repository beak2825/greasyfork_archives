// ==UserScript==
// @name         Instagram Video Speed control (YouTube-like)
// @namespace    https://yourscripts.example/instagram-speed
// @version      1.2.0
// @description  Add YouTube-style speed controls & shortcuts to Instagram videos (feed, reels, profiles).
// @author       X0john
// @match        https://www.instagram.com/*
// @match        https://m.instagram.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547234/Instagram%20Video%20Speed%20control%20%28YouTube-like%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547234/Instagram%20Video%20Speed%20control%20%28YouTube-like%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ----- Config -----
  const STEP = 0.25;          
  const MIN_RATE = 0.1;
  const MAX_RATE = 16;
  const STORAGE_KEY = 'ig_speed_rate';
  const UI_CLASS = 'ig-speed-control';
  const UI_ATTR = 'data-ig-speed-bound';
  const ACTIVE_ATTR = 'data-ig-active-video';
  const TOAST_ID = 'ig-speed-toast';

  // ----- Utilities -----
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const round2 = v => Math.round(v * 100) / 100;
  const getSavedRate = () => {
    const v = parseFloat(localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(v) ? clamp(v, MIN_RATE, MAX_RATE) : 1.0;
  };
  const saveRate = r => localStorage.setItem(STORAGE_KEY, String(r));

  const isTypingInInput = () => {
    const a = document.activeElement;
    if (!a) return false;
    const tag = a.tagName?.toLowerCase();
    return (
      a.isContentEditable ||
      tag === 'input' ||
      tag === 'textarea' ||
      tag === 'select'
    );
  };

  const createStyle = () => {
    if (document.getElementById('ig-speed-style')) return;
    const css = `
      .${UI_CLASS} {
        position: absolute;
        bottom: 8px;
        left: 8px;
        z-index: 99999;
        display: inline-flex;
        gap: 6px;
        align-items: center;
        background: rgba(0,0,0,0.55);
        backdrop-filter: blur(2px);
        border-radius: 14px;
        padding: 6px 8px;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        font-size: 12px;
        line-height: 1;
        color: #fff;
        user-select: none;
        opacity: 0;
        transform: translateY(4px);
        transition: opacity .15s ease, transform .15s ease;
        pointer-events: auto;
      }
      video:hover + .${UI_CLASS},
      .${UI_CLASS}:hover,
      [${ACTIVE_ATTR}="true"] + .${UI_CLASS} {
        opacity: 1;
        transform: translateY(0);
      }
      .${UI_CLASS} button {
        border: none;
        padding: 6px 8px;
        border-radius: 10px;
        background: rgba(255,255,255,0.12);
        color: #fff;
        font-weight: 600;
        cursor: pointer;
      }
      .${UI_CLASS} button:active { transform: scale(0.96); }
      .${UI_CLASS} .rate {
        min-width: 34px;
        text-align: center;
        font-weight: 700;
        letter-spacing: .2px;
      }
      /* Toast */
      #${TOAST_ID}{
        position: fixed;
        left: 50%;
        bottom: 8%;
        transform: translateX(-50%);
        z-index: 999999;
        background: rgba(0,0,0,0.75);
        color: #fff;
        padding: 10px 14px;
        border-radius: 12px;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        font-size: 14px;
        pointer-events: none;
        opacity: 0;
        transition: opacity .12s ease;
      }
      #${TOAST_ID}.show { opacity: 1; }
    `;
    const style = document.createElement('style');
    style.id = 'ig-speed-style';
    style.textContent = css;
    document.head.appendChild(style);
  };

  const showToast = (msg) => {
    let t = document.getElementById(TOAST_ID);
    if (!t) {
      t = document.createElement('div');
      t.id = TOAST_ID;
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => t.classList.remove('show'), 700);
  };

  // Keep track of current "active" video (last interacted/visible)
  let globalRate = getSavedRate();
  let lastActiveVideo = null;

  const setVideoRate = (video, rate, {silent=false} = {}) => {
    const r = clamp(round2(rate), MIN_RATE, MAX_RATE);
    if (!video) return;
    if (video.playbackRate !== r) video.playbackRate = r;

    const ui = video.nextSibling;
    if (ui?.classList?.contains(UI_CLASS)) {
      const rateEl = ui.querySelector('.rate');
      if (rateEl) rateEl.textContent = `${r}×`;
    }
    if (!silent) showToast(`${r}×`);
  };

  const setGlobalRate = (rate, opts={}) => {
    const r = clamp(round2(rate), MIN_RATE, MAX_RATE);
    globalRate = r;
    saveRate(r);

    // Apply to all videos currently in DOM
    document.querySelectorAll('video').forEach(v => setVideoRate(v, r, {silent:true}));
    if (!opts.silent) showToast(`${r}×`);
  };

  const buildUI = (video) => {
    if (!video || video[UI_ATTR]) return;
    // Some IG containers don't have position context; insert right after video and rely on :hover video + UI
    const ui = document.createElement('div');
    ui.className = UI_CLASS;
    ui.innerHTML = `
      <button class="dec" title="Slow down (Shift+,)">–</button>
      <div class="rate" title="Current speed">${round2(video.playbackRate || globalRate)}×</div>
      <button class="inc" title="Speed up (Shift+.)">+</button>
      <button class="reset" title="Reset speed (Shift+Backspace)">1x</button>
    `;

    const handler = (delta) => {
      const current = video.playbackRate || 1.0;
      setVideoRate(video, current + delta);
      setGlobalRate(current + delta, {silent:true});
    };

    ui.querySelector('.dec').addEventListener('click', e => { e.stopPropagation(); handler(-STEP); });
    ui.querySelector('.inc').addEventListener('click', e => { e.stopPropagation(); handler(+STEP); });
    ui.querySelector('.reset').addEventListener('click', e => { e.stopPropagation(); setVideoRate(video, 1.0); setGlobalRate(1.0, {silent:true}); });

    // Scroll to change speed when hovering the control
    ui.addEventListener('wheel', (e) => {
      e.preventDefault();
      const dir = e.deltaY > 0 ? -STEP : +STEP;
      handler(dir);
    }, { passive: false });

    // mark as bound
    video.setAttribute(UI_ATTR, '1');

    // mark active video on hover/focus/play
    const markActive = () => {
      if (lastActiveVideo && lastActiveVideo !== video) {
        lastActiveVideo.removeAttribute(ACTIVE_ATTR);
      }
      lastActiveVideo = video;
      video.setAttribute(ACTIVE_ATTR, 'true');
    };
    ['mouseenter','play','pointerdown','touchstart','focus'].forEach(ev =>
      video.addEventListener(ev, markActive, { passive: true })
    );

    // Insert right after the video so CSS sibling selector works
    video.parentElement?.insertBefore(ui, video.nextSibling);

    // Ensure initial rate reflects global preference
    setVideoRate(video, video.playbackRate || globalRate, {silent:true});
  };

  const bindVideo = (video) => {
    if (!(video instanceof HTMLVideoElement)) return;
    // Skip tiny/hidden placeholders
    const rect = video.getBoundingClientRect();
    if (rect.width < 60 || rect.height < 60) {
      // still bind so it updates when sized later
    }

    // Apply saved/global rate
    video.playbackRate = globalRate;

    // Add UI overlay
    buildUI(video);

    // When a video starts playing, sync rate and mark active
    video.addEventListener('play', () => {
      setVideoRate(video, globalRate, {silent:true});
      if (lastActiveVideo && lastActiveVideo !== video) {
        lastActiveVideo.removeAttribute(ACTIVE_ATTR);
      }
      lastActiveVideo = video;
      video.setAttribute(ACTIVE_ATTR, 'true');
    }, { passive: true });

    // If IG swaps the source, re-apply speed
    video.addEventListener('loadeddata', () => setVideoRate(video, globalRate, {silent:true}), { passive: true });
  };

  const scan = (root = document) => {
    root.querySelectorAll('video').forEach(bindVideo);
  };

  const observe = () => {
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'childList') {
          m.addedNodes.forEach(n => {
            if (n.nodeType !== 1) return;
            if (n.tagName === 'VIDEO') {
              bindVideo(n);
            } else {
              // search within
              const vids = n.querySelectorAll?.('video');
              vids?.forEach(bindVideo);
            }
          });
        } else if (m.type === 'attributes' && m.target?.tagName === 'VIDEO') {
          // Re-apply if IG toggles attributes/sources
          const v = m.target;
          setVideoRate(v, globalRate, {silent:true});
        }
      }
    });

    mo.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'poster']
    });
  };

  const onKeydown = (e) => {
    // Match YouTube: Shift + . (faster), Shift + , (slower)
    if (isTypingInInput()) return;

    // Some IG overlays capture keys; use capture to intercept earlier via addEventListener below.
    if (e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      const key = e.key;
      if (key === '.' || key === '>') {
        e.preventDefault();
        setGlobalRate(globalRate + STEP);
        return;
      }
      if (key === ',' || key === '<') {
        e.preventDefault();
        setGlobalRate(globalRate - STEP);
        return;
      }
      if (key === 'Backspace') {
        e.preventDefault();
        setGlobalRate(1.0);
        return;
      }
    }
  };

  // ----- Init -----
  const init = () => {
    createStyle();
    globalRate = getSavedRate();
    scan();
    observe();
    // Capture early in the chain
    window.addEventListener('keydown', onKeydown, true);

    // Heuristic: keep the "most visible" video as active
    const visObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const v = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          if (lastActiveVideo && lastActiveVideo !== v) {
            lastActiveVideo.removeAttribute(ACTIVE_ATTR);
          }
          lastActiveVideo = v;
          v.setAttribute(ACTIVE_ATTR, 'true');
          setVideoRate(v, globalRate, {silent:true});
        }
      });
    }, { threshold: [0.6] });
    document.querySelectorAll('video').forEach(v => visObserver.observe(v));

    // Periodic safety net in case IG tears down nodes aggressively
    setInterval(() => {
      document.querySelectorAll('video').forEach(v => {
        if (!v.hasAttribute(UI_ATTR)) bindVideo(v);
        if (Math.abs((v.playbackRate || 1) - globalRate) > 0.001) {
          setVideoRate(v, globalRate, {silent:true});
        }
      });
    }, 2000);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
