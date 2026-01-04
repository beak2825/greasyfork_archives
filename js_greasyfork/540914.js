// ==UserScript==
// @name         YouTube Watch Tracker v1.7
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  YT Watch Tracker
// @author       Void
// @match        *://*.youtube.com/*
// @grant        none
// @license      CC-BY-ND-4.0
// @downloadURL https://update.greasyfork.org/scripts/540914/YouTube%20Watch%20Tracker%20v17.user.js
// @updateURL https://update.greasyfork.org/scripts/540914/YouTube%20Watch%20Tracker%20v17.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const VERSION = '1.7';
  const STORAGE_KEY = 'yt_watch_tracker_data';

  let data = {};
  let sessionTime = 0;
  let videoTime = 0;

  let overlay, contentBox, toggleBtn, versionTag;
  let hidden = false;
  let lastUiUpdate = 0;
  let lastSave = 0;

  let videoEl = null;
  let lastVideoId = null;

  // dev: date + id helpers
  const getDate = () => new Date().toISOString().slice(0, 10);

  function fmt(t) {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  }

  function load() {
    try {
      data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      data = {};
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    lastSave = Date.now();
  }

  function ensureStats() {
    const d = getDate();
    if (!data[d]) data[d] = { watched: 0, wasted: 0, session: 0 };
  }

  function getCurrentVideoId() {
    const url = new URL(location.href);
    const v = url.searchParams.get('v');
    if (v) return `watch:${v}`;
    const sh = url.pathname.match(/^\/shorts\/([^/?#]+)/);
    if (sh) return `shorts:${sh[1]}`;
    return `url:${url.pathname}${url.search}`;
  }

  // ───────── UI ─────────
  function createOverlay() {
    overlay = document.createElement('div');
    overlay.style = `
      position:fixed;top:100px;right:0;width:280px;
      background:rgba(15,15,25,0.9);backdrop-filter:blur(10px);
      color:#fff;border-radius:10px 0 0 10px;
      border:1px solid rgba(255,255,255,0.08);
      box-shadow:0 0 15px rgba(0,0,0,0.6);
      font-family:'Segoe UI',sans-serif;font-size:13px;
      z-index:999999999;padding:12px 14px;
      user-select:none;transition:right .35s ease;
    `;

    const header = document.createElement('div');
    header.textContent = '📊 YouTube Watch Tracker';
    header.style = `
      text-align:center;font-weight:600;color:#9dc0ff;
      border-bottom:1px solid rgba(255,255,255,0.15);
      padding-bottom:4px;margin-bottom:6px;font-size:14px;
    `;
    overlay.appendChild(header);

    contentBox = document.createElement('div');
    contentBox.className = 'ytwt-text';
    contentBox.style = 'line-height:1.6;margin-bottom:10px;white-space:pre;';
    overlay.appendChild(contentBox);

    const btnRow = document.createElement('div');
    btnRow.style = 'display:flex;justify-content:space-between;gap:6px;flex-wrap:wrap;';

    const mkBtn = (label, fn) => {
      const b = document.createElement('button');
      b.textContent = label;
      b.style = `
        flex:1;background:rgba(255,255,255,0.1);color:#eee;
        border:1px solid rgba(255,255,255,0.2);border-radius:6px;
        padding:4px 8px;font-size:12px;cursor:pointer;
        transition:all .2s ease;
      `;
      b.onmouseenter = () => (b.style.background = 'rgba(255,255,255,0.25)');
      b.onmouseleave = () => (b.style.background = 'rgba(255,255,255,0.1)');
      b.onclick = fn;
      return b;
    };

    const exportBtn = mkBtn('Export', () => {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      alert('Copied.');
    });

    const importBtn = mkBtn('Import', () => {
      const json = prompt('Paste:');
      try {
        const parsed = JSON.parse(json);
        if (!parsed || typeof parsed !== 'object') throw 0;
        data = parsed;
        save();
        updateOverlay(true);
      } catch {
        alert('Bad JSON');
      }
    });

    const resetBtn = mkBtn('Reset', () => {
      if (confirm('Reset today?')) {
        data[getDate()] = { watched: 0, wasted: 0, session: 0 };
        save();
        updateOverlay(true);
      }
    });

    btnRow.append(exportBtn, importBtn, resetBtn);
    overlay.appendChild(btnRow);
    document.body.appendChild(overlay);

    toggleBtn = document.createElement('div');
    toggleBtn.textContent = '←';
    toggleBtn.style = `
      position:fixed;top:120px;right:280px;width:26px;height:46px;
      background:rgba(25,25,40,0.95);color:#fff;
      display:flex;align-items:center;justify-content:center;
      font-size:18px;border-radius:6px 0 0 6px;cursor:pointer;
      box-shadow:0 0 10px rgba(0,0,0,0.5);
      z-index:999999999;
      transition:right .35s ease,background .2s ease,transform .2s ease;
    `;
    toggleBtn.onmouseenter = () =>
      (toggleBtn.style.background = 'rgba(45,45,70,0.95)');
    toggleBtn.onmouseleave = () =>
      (toggleBtn.style.background = 'rgba(25,25,40,0.95)');
    toggleBtn.onclick = toggleOverlay;
    document.body.appendChild(toggleBtn);

    versionTag = document.createElement('div');
    versionTag.textContent = `YTWT v${VERSION}`;
    versionTag.style = `
      position:fixed;bottom:20px;left:20px;
      padding:5px 10px;
      background:rgba(20,20,30,0.75);
      color:#9db3ff;
      border-radius:6px;
      font-size:11px;
      font-family:'Segoe UI',sans-serif;
      z-index:999999999;
      pointer-events:none;
      backdrop-filter:blur(6px);
    `;
    document.body.appendChild(versionTag);
  }

  function toggleOverlay() {
    hidden = !hidden;
    overlay.style.right = hidden ? '-300px' : '0';
    toggleBtn.style.right = hidden ? '0' : '280px';
    toggleBtn.textContent = hidden ? '→' : '←';
  }

  // ───────── stats → UI ─────────
  function updateOverlay(force = false) {
    const now = Date.now();
    if (!force && now - lastUiUpdate < 2500) return;
    lastUiUpdate = now;

    ensureStats();
    const d = getDate();
    const m = d.slice(0, 7);

    const month = { watched: 0, wasted: 0, session: 0 };
    for (const [k, v] of Object.entries(data)) {
      if (k.startsWith(m)) {
        month.watched += v.watched;
        month.wasted += v.wasted;
        month.session += v.session;
      }
    }

    const daily = data[d];

    contentBox.innerText = `📅 Today: ${daily.watched} videos
🕒 Watched: ${fmt(daily.wasted)}
⌛ Session: ${fmt(sessionTime)}

📆 Month: ${month.watched} videos
🕒 Watched: ${fmt(month.wasted)}`;
  }

  // ───────── loops ─────────
  function startSessionLoop() {
    setInterval(() => {
      ensureStats();
      sessionTime++;
      data[getDate()].session++;
      if (Date.now() - lastSave > 20000) save();
      updateOverlay();
    }, 1000);
  }

  function startWatchLoop() {
    setInterval(() => {
      if (videoEl && !videoEl.paused && !videoEl.ended && videoEl.readyState >= 2) {
        ensureStats();
        data[getDate()].wasted++;
        videoTime++;
        if (videoTime % 30 === 0) save();
        updateOverlay();
      }
    }, 1000);
  }

  // ───────── video detection ─────────
  function attachVideo() {
    const v = document.querySelector('video');
    if (v && v !== videoEl) {
      videoEl = v;
      videoTime = 0;
    }
  }

  function handleNewVideoId() {
    const id = getCurrentVideoId();
    if (!id || id === lastVideoId) return;
    lastVideoId = id;
    ensureStats();
    data[getDate()].watched++;
    save();
    updateOverlay(true);
  }

  function setupObservers() {
    if (document.body) {
      const videoObs = new MutationObserver(() => {
        const v = document.querySelector('video');
        if (v && v !== videoEl) {
          videoEl = v;
          videoTime = 0;
          handleNewVideoId();
        }
      });
      videoObs.observe(document.body, { childList: true, subtree: true });
    }

    let lastHref = location.href;
    const urlObs = new MutationObserver(() => {
      const href = location.href;
      if (href !== lastHref) {
        lastHref = href;
        attachVideo();
        handleNewVideoId();
      }
    });
    urlObs.observe(document.documentElement || document, {
      childList: true,
      subtree: true,
    });

    window.addEventListener('yt-navigate-finish', () => {
      attachVideo();
      handleNewVideoId();
    });

    window.addEventListener('popstate', () => {
      attachVideo();
      handleNewVideoId();
    });
  }

  // ───────── init ─────────
  function init() {
    load();
    ensureStats();
    createOverlay();
    attachVideo();
    handleNewVideoId();
    startSessionLoop();
    startWatchLoop();
    setupObservers();
    window.addEventListener('beforeunload', save);
  }

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();
