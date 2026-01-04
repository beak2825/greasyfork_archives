// ==UserScript==
// @name         GTA World Forums – Like All + Post Counter
// @version      1.3
// @description  One-click “Like All” (uses current/default reaction only) for the current GTA World forum topic page + live post counter.
// @author       blanco
// @license      All Rights Reserved
// @match        https://forum.gta.world/*
// @grant        none
// @icon         data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M2 21h4V9H2v12zM22 10a2 2 0 0 0-2-2h-5.31l.95-4.57.03-.32a1 1 0 0 0-.29-.7L14 2 7.59 8.41A2 2 0 0 0 7 9.83V19a2 2 0 0 0 2 2h8a2 2 0 0 0 1.85-1.23l3-7a2 2 0 0 0 .15-.77v-2z'/></svg>
// @namespace https://greasyfork.org/users/1496525
// @downloadURL https://update.greasyfork.org/scripts/543079/GTA%20World%20Forums%20%E2%80%93%20Like%20All%20%2B%20Post%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/543079/GTA%20World%20Forums%20%E2%80%93%20Like%20All%20%2B%20Post%20Counter.meta.js
// ==/UserScript==

// © 2025 blanco. All rights reserved.
// This script is proprietary. You may not copy, modify, distribute, or use any part of it without explicit written permission.


(() => {
  'use strict';

  const CONFIG = {
    likeDelay: 500,
    likeDelayJitterPct: 0.4,
    badgeBottom: 150,
    counterDebounce: 250,
    maxRetries: 3,
    rateLimitPause: 30000
  };

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const jitter = (ms, pct=CONFIG.likeDelayJitterPct) => {
    const d = ms * pct;
    return Math.max(0, Math.round(ms + (Math.random() * 2 - 1) * d));
  };
  const parseRetryAfter = v => {
    if (!v) return null;
    const n = Number(v);
    if (!Number.isNaN(n)) return n * 1000;
    const t = Date.parse(v);
    const diff = t - Date.now();
    return Number.isFinite(diff) && diff > 0 ? diff : null;
  };

  const notifEl = (() => {
    const el = document.createElement('div');
    Object.assign(el.style, {
      position: 'fixed', top: '20px', right: '20px',
      padding: '12px 24px', borderRadius: '6px', fontSize: '16px', zIndex: 10001,
      boxShadow: '0 2px 8px rgba(0,0,0,.18)', opacity: '.98', pointerEvents: 'none',
      maxWidth: '60ch'
    });
    document.body.appendChild(el);
    return el;
  })();
  function showNotification(msg, dur = 3000) {
    const dark = matchMedia('(prefers-color-scheme: dark)').matches;
    notifEl.style.background = dark ? '#222' : '#f5f5f5';
    notifEl.style.color = dark ? '#fff' : '#222';
    notifEl.textContent = msg;
    notifEl.style.display = 'block';
    setTimeout(() => { notifEl.style.display = 'none'; }, dur);
  }

  const badgeEl = (() => {
    const el = document.createElement('div');
    Object.assign(el.style, {
      position: 'fixed', right: '20px', bottom: `${CONFIG.badgeBottom}px`,
      padding: '8px 16px', borderRadius: '8px', fontSize: '15px', zIndex: 10001,
      boxShadow: '0 2px 8px rgba(0,0,0,.18)', pointerEvents: 'none', userSelect: 'none'
    });
    document.body.appendChild(el);
    return el;
  })();
  function updateBadge() {
    const cnt = document.querySelectorAll('article[id^="elComment_"]').length;
    const dark = matchMedia('(prefers-color-scheme: dark)').matches;
    badgeEl.style.background = dark ? '#222' : '#f5f5f5';
    badgeEl.style.color = dark ? '#fff' : '#222';
    badgeEl.textContent = `Posts: ${cnt}`;
  }
  const debounce = (fn, wait) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); }; };
  const debouncedUpdate = debounce(updateBadge, CONFIG.counterDebounce);
  window.addEventListener('load', updateBadge);
  new MutationObserver(m => { for (const r of m) { if (r.addedNodes.length || r.removedNodes.length) { debouncedUpdate(); break; } } })
    .observe(document.getElementById('elContent') || document.body, { childList: true, subtree: true });

  // Like button image
  const likeBtnImg = (() => {
    const img = document.createElement('img');
    img.src = 'https://i.imgur.com/b7IZU6X.gif'; // your original Like All GIF
    img.width = 56;
    img.height = 56;
    img.alt = 'Like All';
    Object.assign(img.style, {
      position: 'fixed', right: '20px', bottom: '80px', zIndex: 10001,
      borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,.18)', padding: '2px', cursor: 'pointer',
      background: matchMedia('(prefers-color-scheme: dark)').matches ? '#222' : '#fff'
    });
    img.title = 'Like all posts on this page';
    document.body.appendChild(img);
    return img;
  })();
  function toggleBtn(disabled, label) {
    likeBtnImg.style.opacity = disabled ? '0.5' : '1';
    likeBtnImg.title = label;
  }

  function fetchDefaultReactionLinks() {
    const sel = 'span.ipsReact_button[data-action="reactLaunch"]:not(.ipsReact_button_selected):not(.ipsReact_button--selected) a.ipsReact_reaction[data-role="reaction"][data-defaultreaction]';
    const seen = new Set();
    const links = [];
    document.querySelectorAll(sel).forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.includes('do=reactComment') && /[?&]reaction=\d+/.test(href) && /[?&]csrfKey=/.test(href)) {
        if (!seen.has(href)) { seen.add(href); links.push(a); }
      }
    });
    return links;
  }

  const abortCtrl = new AbortController();
  window.addEventListener('beforeunload', () => abortCtrl.abort());

  async function likeViaAjax(link, attempt = 0) {
    try {
      const r = await fetch(link.href, {
        method: 'GET', credentials: 'include', signal: abortCtrl.signal,
        headers: { 'X-Requested-With': 'XMLHttpRequest', 'Referer': location.href }
      });
      if (r.status === 429) {
        const ra = parseRetryAfter(r.headers.get('Retry-After'));
        const pause = ra ?? CONFIG.rateLimitPause;
        showNotification(`Rate-limited — pausing ${Math.round(pause/1000)}s`);
        await sleep(pause);
        return likeViaAjax(link, attempt + 1);
      }
      if (!r.ok) throw new Error();
      return true;
    } catch {
      if (attempt < CONFIG.maxRetries) {
        const backoff = jitter(2 ** attempt * 1000, 0.25);
        await sleep(backoff);
        return likeViaAjax(link, attempt + 1);
      }
      return false;
    }
  }

  async function likeAll() {
    const links = fetchDefaultReactionLinks();
    if (!links.length) {
      showNotification('No un-reacted posts found on this page.');
      return;
    }
    toggleBtn(true, `Liking 0 / ${links.length}`);
    let ok = 0, fail = 0;
    for (let i = 0; i < links.length; i++) {
      toggleBtn(true, `Liking ${i + 1} / ${links.length}`);
      (await likeViaAjax(links[i])) ? ok++ : fail++;
      await sleep(jitter(CONFIG.likeDelay));
    }
    toggleBtn(false, 'Like all posts on this page');
    showNotification(`Finished! ✔️ ${ok} ❌ ${fail}`);
  }

  likeBtnImg.addEventListener('click', likeAll);
  likeBtnImg.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') likeAll();
  });

})();