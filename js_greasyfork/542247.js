// ==UserScript==
// @name         WCO/WCOStream Auto-Play Next/Random (v1.5)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @license      GNU GENERAL PUBLIC LICENSE
// @description  Works on both wco.tv and wcostream.tv layouts. Pinned, centred panel above the player.
// @match        *://www.wco.tv/*
// @match        *://wco.tv/*
// @match        *://www.wcostream.tv/*
// @match        *://wcostream.tv/*
// @match        *://embed.wcostream.com/*
// @grant        none
// @run-at       document-start
// @SOME UBLOCK FILTERS YOU SHOULD ADD:
// @!Watch Cartoons Online https://www.wcostream.com
// @wcostream.com##+js(rmnt, script, /embed.html)
// @wco.tv##+js(rmnt, script, /embed.html)
// @wcostream.com##.announcement-backdrop, #announcement
// @wco.tv##.announcement-backdrop, #announcement
// @||embed.wcostream.com/inc/embed/index.php?file=$frame,uritransform=/index/video-js/
// @downloadURL https://update.greasyfork.org/scripts/542247/WCOWCOStream%20Auto-Play%20NextRandom%20%28v15%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542247/WCOWCOStream%20Auto-Play%20NextRandom%20%28v15%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const MAX_ATTEMPTS = 120;
  const RETRY_MS = 150;
  const LS_NEXT   = 'wco-auto-next';
  const LS_RANDOM = 'wco-auto-random';

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const q  = (sel, root=document) => root.querySelector(sel);
  const qa = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const visible = (el) => {
    if (!el) return false;
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const isPlaying = (v) => v && !v.paused && !v.ended && v.readyState >= 2;
  const norm = (u) => { try { return new URL(u, location.href).href.replace(/\/+$/,''); } catch { return (u||'').replace(/\/+$/,''); } };
  const sameURL = (a,b) => norm(a) === norm(b);
  const goTo = (href) => { if (href) location.href = href; };

  // ---------- unmute helpers ----------
  const hardUnmute = (v) => { if (!v) return; try { v.muted = false; } catch {} try { v.volume = Math.max(0.7, v.volume || 0.7); } catch {} };
  const unmuteViaVJS = (container) => {
    const vjs = window.videojs || window.videoJS || window.videoJs; if (!vjs) return false;
    try {
      let player = null;
      if (container?.id) { try { player = vjs(container.id); } catch {} }
      if (!player && typeof vjs.getPlayers === 'function') {
        const reg = vjs.getPlayers(); const ids = reg ? Object.keys(reg) : [];
        if (ids.length) player = reg[ids[0]];
      }
      if (player) { try { player.muted(false); } catch {} try { player.volume(0.7); } catch {} return true; }
    } catch {}
    return false;
  };
  const attachOneTimeUnmuteHandlers = (cb) => {
    let done = false;
    const fire = () => { if (done) return; done = true; off(); try { cb(); } catch {} };
    const types = ['pointerdown','mousedown','touchstart','keydown','click'];
    const on = () => types.forEach(t => window.addEventListener(t, fire, { passive: true, once: true, capture: true }));
    const off = () => types.forEach(t => window.removeEventListener(t, fire, { capture: true }));
    on();
  };

  // ---------- IFRAME (embed.wcostream.com) ----------
  if (location.hostname.replace(/^www\./,'') === 'embed.wcostream.com') {
    let started = false;
    const start = async () => {
      if (started) return;
      let v = null;
      for (let i=0; i<100 && !v; i++) { v = q('video'); if (!v) await sleep(50); }
      if (!v) return;
      try {
        v.setAttribute('playsinline',''); v.setAttribute('webkit-playsinline','');
        v.autoplay = true; v.muted = true;
        if (v.getAttribute('preload') === 'none') v.setAttribute('preload','metadata');
      } catch {}
      const markPlaying = () => { started = true; v.removeEventListener('playing', markPlaying); };
      v.addEventListener('playing', markPlaying, { once: true });
      if (!v.__wcoEndedHooked) {
        v.addEventListener('ended', () => { try { parent.postMessage({ type: 'WCO_VIDEO_ENDED' }, '*'); } catch {} }, { once: true });
        v.__wcoEndedHooked = true;
      }
      const tryImmediateUnmute = () => { hardUnmute(v); unmuteViaVJS(document); };
      v.addEventListener('playing', () => setTimeout(tryImmediateUnmute, 50), { once: true });
      attachOneTimeUnmuteHandlers(() => { tryImmediateUnmute(); try { v.play?.(); } catch {} });
      const clickBigPlay = () => { const btn = q('.vjs-big-play-button'); if (btn && visible(btn)) { try { btn.click(); } catch {} } };
      for (let i=0; i<MAX_ATTEMPTS && !isPlaying(v); i++) {
        try { await v.play(); } catch {}
        if (!isPlaying(v)) clickBigPlay();
        await sleep(RETRY_MS);
      }
    };
    const boot = () => {
      start();
      new MutationObserver(() => { if (!started) start(); })
        .observe(document.documentElement, { childList: true, subtree: true });
      document.addEventListener('visibilitychange', () => { if (!document.hidden && !started) start(); });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
    else boot();
    return;
  }

  // ---------- PARENT ----------
  const episodes = [];
  let episodesPromise = null;

  // find candidate links on-page (wcostream sidebar "Episode List", and any obvious episode anchors)
  const scrapeEpisodesFromPage = () => {
    let added = 0;
    // 1) wcostream.tv sidebar Episode List
    qa('#sidebar .menu .menustyle ul li a[href]').forEach(a => {
      const url = a.href;
      if (url && !episodes.some(e => sameURL(e.url, url))) { episodes.push({ url, title: (a.textContent||'').trim() }); added++; }
    });
    // 2) any bookmark episode links on-page
    qa('a[rel="bookmark"][href]').forEach(a => {
      const url = a.href;
      if (url && /\/(episode|season|special)/i.test(url) && !episodes.some(e => sameURL(e.url,url))) {
        episodes.push({ url, title: (a.textContent||'').trim() }); added++;
      }
    });
    // 3) older series sidebar used on some pages
    qa('#sidebar_right3 .cat-eps a[href]').forEach(a => {
      const url = a.href;
      if (url && !episodes.some(e => sameURL(e.url, url))) { episodes.push({ url, title: (a.textContent||'').trim() }); added++; }
    });
    return added;
  };

  // try to fetch the series page and scrape its sidebar
  const fetchEpisodesFromSeriesPage = () => {
    if (episodesPromise) return episodesPromise;
    const categoryLink =
      q('a[rel="category tag"][href*="/anime/"]') ||
      q('a[href*="/anime/"][rel="category tag"]');
    if (!categoryLink) return Promise.resolve(0);

    episodesPromise = fetch(categoryLink.href)
      .then(r => r.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        let added = 0;
        doc.querySelectorAll('#sidebar .menu .menustyle ul li a[href]').forEach(a => {
          const url = a.href;
          if (url && !episodes.some(e => sameURL(e.url,url))) { episodes.push({ url, title: (a.textContent||'').trim() }); added++; }
        });
        doc.querySelectorAll('#sidebar_right3 .cat-eps a[href]').forEach(a => {
          const url = a.href;
          if (url && !episodes.some(e => sameURL(e.url,url))) { episodes.push({ url, title: (a.textContent||'').trim() }); added++; }
        });
        return added;
      })
      .catch(() => 0);
    return episodesPromise;
  };

  // wait helper for episodes to be available (tries scraping and fetching)
  const ensureEpisodesReady = async (timeoutMs = 4000) => {
    // first, scrape what we can synchronously
    let count = scrapeEpisodesFromPage();

    // kick off fetch if still light
    if (episodes.length < 2) fetchEpisodesFromSeriesPage();

    const start = Date.now();
    while (episodes.length < 1 && Date.now() - start < timeoutMs) {
      await sleep(100);
      // try scraping again in case sidebar arrived late
      count += scrapeEpisodesFromPage();
    }
    return episodes.length;
  };

  const pickRandomDifferentFromCurrent = () => {
    const cur = norm(location.href);
    const pool = episodes.filter(e => !sameURL(e.url, cur));
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  // smarter sequential for both sites
  const goNext = () => {
    let a = q('a[rel="next"]');
    if (a?.href) return goTo(a.href);
    a = q('a[rel="prev"]');
    if (a?.href) return goTo(a.href);
    if (episodes.length) {
      const cur = location.href;
      const idx = episodes.findIndex(e => sameURL(e.url, cur));
      const target = (idx >= 0 && idx+1 < episodes.length) ? episodes[idx+1] : episodes[0];
      if (target?.url && !sameURL(target.url, cur)) return goTo(target.url);
    }
  };

  const ensureIframeAutoplayAllowed = () => {
    qa('iframe#cizgi-js-0, .pcat-jwplayer iframe, iframe[src*="embed.wcostream.com"], iframe[data-type="wco-embed"]').forEach(ifr => {
      try {
        const cur = (ifr.getAttribute('allow')||'').toLowerCase();
        if (!cur.includes('autoplay')) ifr.setAttribute('allow', `${cur} autoplay; fullscreen`.trim());
      } catch {}
    });
  };

  const wireParentUnmuteForwarder = () => {
    attachOneTimeUnmuteHandlers(() => {
      qa('iframe#cizgi-js-0, .pcat-jwplayer iframe, iframe[src*="embed.wcostream.com"], iframe[data-type="wco-embed"]').forEach(ifr => {
        try { ifr.contentWindow?.postMessage({ type: 'WCO_UNMUTE' }, '*'); } catch {}
      });
      tryInlineUnmute();
    });
  };

  let inlineStarted = false;
  const tryInlineUnmute = () => {
    const container = qa('#video-js,.video-js').find(visible) || q('#video-js,.video-js') || document;
    const v = q('video.vjs-tech', container) || q('.video-js video', container) || q('video');
    if (v) { hardUnmute(v); unmuteViaVJS(container); try { v.play?.(); } catch {} }
  };

  const startInlineVideoJS = async () => {
    if (inlineStarted) return true;
    const container = qa('#video-js,.video-js').find(visible) || q('#video-js,.video-js') || document;
    const vids = [...qa('video.vjs-tech', container), ...qa('.video-js video', container), ...qa('video')];
    const v = vids.find(visible) || vids[0];
    if (!v) return false;

    if (!v.__wcoEndedHooked) {
      v.addEventListener('ended', () => { handleEnded(); }, { once: true });
      v.__wcoEndedHooked = true;
    }

    try {
      v.setAttribute('playsinline',''); v.setAttribute('webkit-playsinline','');
      v.autoplay = true; v.muted = true;
      if (v.getAttribute('preload') === 'none') v.setAttribute('preload','metadata');
    } catch {}

    const mark = () => { inlineStarted = true; v.removeEventListener('playing', mark); };
    v.addEventListener('playing', () => { mark(); setTimeout(() => { hardUnmute(v); unmuteViaVJS(container); }, 50); }, { once: true });

    const clickBigPlay = () => { const btn = container.querySelector('.vjs-big-play-button'); if (btn && visible(btn)) { try { btn.click(); } catch {} } };

    let usedAPI = false;
    const vjs = window.videojs || window.videoJS || window.videoJs;
    if (typeof vjs === 'function') {
      try {
        let player = null;
        if (container.id) { try { player = vjs(container.id); } catch {} }
        if (!player && typeof vjs.getPlayers === 'function') {
          const reg = vjs.getPlayers(); const ids = reg ? Object.keys(reg) : [];
          if (ids.length) player = reg[ids[0]];
        }
        if (player) {
          usedAPI = true;
          player.ready(async () => {
            try { player.muted(true); } catch {}
            try { player.autoplay(true); } catch {}
            for (let i=0; i<MAX_ATTEMPTS && !isPlaying(v); i++) {
              try { await player.play(); } catch {}
              if (!isPlaying(v)) clickBigPlay();
              await sleep(RETRY_MS);
            }
          });
        }
      } catch {}
    }

    if (!usedAPI) {
      for (let i=0; i<MAX_ATTEMPTS && !isPlaying(v); i++) {
        try { await v.play(); } catch {}
        if (!isPlaying(v)) clickBigPlay();
        await sleep(RETRY_MS);
      }
    }

    return inlineStarted || isPlaying(v);
  };

  // --------- prefs + ended decision ----------
  const nextOnDefault = () => {
    const n = localStorage.getItem(LS_NEXT);
    const r = localStorage.getItem(LS_RANDOM);
    return (n === null && r === null) ? true : (n === 'true');
  };
  const randOnDefault = () => localStorage.getItem(LS_RANDOM) === 'true';
  const setPrefs = (nextOn, randOn) => {
    localStorage.setItem(LS_NEXT, String(!!nextOn));
    localStorage.setItem(LS_RANDOM, String(!!randOn));
  };

  const handleEnded = () => {
    const randOn = localStorage.getItem(LS_RANDOM) === 'true';
    const nextOn = (localStorage.getItem(LS_NEXT) === 'true') ||
                   (localStorage.getItem(LS_NEXT) === null && localStorage.getItem(LS_RANDOM) === null);
    if (randOn && episodes.length) {
      const ep = pickRandomDifferentFromCurrent();
      if (ep?.url) { location.href = ep.url; return; }
    }
    if (nextOn) { goNext(); return; }
    goNext();
  };

  // --------- UI (centered card) ----------
  const injectCSS = () => {
    if (q('#wco-inline-panel-css')) return;
    const css = document.createElement('style');
    css.id = 'wco-inline-panel-css';
    css.textContent = `
      #wco-inline-panel{
        display:block; width:max-content; margin:10px auto 8px;
        background:#1e1f22; color:#fff; border:1px solid #2d2e33; border-radius:6px;
        padding:10px 12px; box-shadow:0 2px 8px rgba(0,0,0,.35);
        font:14px/1.25 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
        z-index:2147483647;
      }
      #wco-inline-panel .wco-title{font-weight:600;margin-bottom:6px;color:#e6e6e6;text-align:center}
      #wco-inline-panel .wco-row{display:flex;align-items:center;gap:16px;flex-wrap:wrap;justify-content:center}
      #wco-inline-panel input[type="checkbox"]{vertical-align:-2px;margin-right:6px}
      #wco-inline-panel .wco-dice{
        font-size:18px; width:36px; height:30px; border:1px solid #444; border-radius:6px;
        background:#2a2b30; color:#fff; cursor:pointer;
      }
      #wco-inline-panel .wco-dice:disabled{opacity:.5;cursor:not-allowed}
      #wco-inline-panel .wco-dice:active{transform:scale(.98)}
    `;
    document.head.appendChild(css);
  };

  const findAnchor = () => {
    let el = q('div[id^="hide-cizgi-video-"]'); if (el) return el;
    el = qa('iframe[src*="embed.wcostream.com"], iframe[data-type="wco-embed"]').find(visible); if (el) return el;
    el = qa('#video-js,.video-js, video').find(visible); if (el) return el;
    return qa('iframe').find(visible) || null;
  };

  const buildInlinePanel = () => {
    const anchor = findAnchor();
    if (!anchor || !anchor.parentElement) return;

    let panel = q('#wco-inline-panel');
    if (!panel) {
      panel = document.createElement('div'); panel.id = 'wco-inline-panel';
      const title = document.createElement('div'); title.className = 'wco-title'; title.textContent = 'Episode Advance'; panel.appendChild(title);

      const row = document.createElement('div'); row.className = 'wco-row'; panel.appendChild(row);

      const mkToggle = (id, label, checked) => {
        const wrap = document.createElement('label');
        const cb = document.createElement('input');
        cb.type = 'checkbox'; cb.id = id; cb.checked = !!checked;
        wrap.appendChild(cb); wrap.appendChild(document.createTextNode(' ' + label));
        return {wrap, cb};
      };

      const nextT = mkToggle('wco-next', 'Sequential', nextOnDefault());
      const randT = mkToggle('wco-rand', 'Random',     randOnDefault());
      row.appendChild(nextT.wrap); row.appendChild(randT.wrap);

      const dice = document.createElement('button');
      dice.type = 'button'; dice.className = 'wco-dice'; dice.textContent = '🎲'; dice.title = 'Play a random episode now';
      row.appendChild(dice);

      const sync = () => setPrefs(nextT.cb.checked, randT.cb.checked);
      nextT.cb.addEventListener('change', () => { if (nextT.cb.checked) randT.cb.checked = false; sync(); });
      randT.cb.addEventListener('change', () => { if (randT.cb.checked) nextT.cb.checked = false; sync(); });

      // 🔧 Robust RANDOM click
      dice.addEventListener('click', async () => {
        try {
          dice.disabled = true;
          // make sure we have something to choose from
          await ensureEpisodesReady(4000);

          // if still nothing, one last synchronous scrape (DOM might have changed)
          if (!episodes.length) scrapeEpisodesFromPage();

          const ep = pickRandomDifferentFromCurrent();
          if (ep?.url) location.href = ep.url;
          // if only one item and it's the current page, do nothing (no change)
        } finally {
          dice.disabled = false;
        }
      });
    }

    if (anchor.previousSibling !== panel) anchor.parentElement.insertBefore(panel, anchor);
  };

  // ---- early watcher
  (function startEarlyPanelWatcher(){
    injectCSS();
    let fastTries = 0;
    const fastLoop = () => {
      buildInlinePanel();
      if (q('#wco-inline-panel')) return;
      fastTries++; if (fastTries < 300) setTimeout(fastLoop, 50);
    };
    fastLoop();

    const mo = new MutationObserver(() => {
      if (!q('#wco-inline-panel')) buildInlinePanel();
      else {
        const anchor = findAnchor();
        if (anchor && q('#wco-inline-panel')?.nextSibling !== anchor) {
          try { anchor.parentElement.insertBefore(q('#wco-inline-panel'), anchor); } catch {}
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  })();

  // ---- boot
  const bootParent = async () => {
    window.addEventListener('message', (e) => { if (e?.data?.type === 'WCO_VIDEO_ENDED') handleEnded(); });
    ensureIframeAutoplayAllowed();
    wireParentUnmuteForwarder();

    // pre-warm episodes list in the background (non-blocking)
    scrapeEpisodesFromPage();
    fetchEpisodesFromSeriesPage();

    for (let i=0; i<Math.ceil(MAX_ATTEMPTS*1.2); i++) {
      ensureIframeAutoplayAllowed();
      const ok = await startInlineVideoJS();
      if (ok) break;
      await sleep(RETRY_MS);
    }

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !inlineStarted) startInlineVideoJS();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootParent, { once: true });
  } else bootParent();

})();
