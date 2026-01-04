// ==UserScript==
// @name         ChatGPT Navigator & Fold-Plus
// @version      1.1.0
// @description  ChatGPT userscript: ↑↓ navigator, directory, refresh & fold long "You" messages.
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1485470
// @downloadURL https://update.greasyfork.org/scripts/539909/ChatGPT%20Navigator%20%20Fold-Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/539909/ChatGPT%20Navigator%20%20Fold-Plus.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ─── CONFIG: tweak here when ChatGPT's DOM changes ─────────────── */
  const CONFIG = {
    /* selectors ChatGPT might rename */
    SELECTORS: {
      userWrapper: 'div[data-message-author-role="user"]',
      content: '.whitespace-pre-wrap',
      composerForm: 'form',
      spaContainers: ['div.my-auto.text-base', 'div.m-auto.text-base', 'main'],
      directoryWrap: '#gmDirWrap'
    },

    /* timing or size knobs you sometimes adjust */
    TIMINGS: {
      scrollSuppress: 300,      // ms to ignore scroll after jump
      debounce: 100,      // ms for MutationObserver debounce
      keepAlive: 5000,     // ms between auto-boot checks
      bootDelay: 300       // ms delay for SPA navigation
    },

    FOLD: {
      lineThreshold: 3          // fold user messages > this many lines
    },

    /* one big template-literal for all CSS so colours & sizes live in one spot */
    CSS: `
      :root{--dir-bg:#fff;--dir-border:#ddd;--dir-hover:#f0f0f0;--nav-bg:#ddd;--nav-fg:#333;--highlight:rgba(38,198,218,0.3);}
      html.dark{--dir-bg:#333;--dir-border:#555;--dir-hover:#444;--nav-bg:#444;--nav-fg:#eee;--highlight:rgba(38,198,218,0.6);}
      .gm-anchor{scroll-margin-top:96px!important}
      #gmDirWrap{position:fixed;top:140px;right:12px;display:flex;flex-direction:column;align-items:flex-end;z-index:9999}
      #gmToggle,#gmRefresh{all:unset;cursor:pointer;padding:6px 10px;background:var(--nav-bg);color:var(--nav-fg);border-radius:6px;margin-bottom:6px;margin-left:4px}
      #gmDir{display:none;width:280px;max-height:70vh;overflow:auto;background:var(--dir-bg);border:1px solid var(--dir-border);border-radius:8px;padding:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);}
      #gmList{list-style:none;margin:0;padding:0}
      #gmList li{padding:6px;border-radius:4px;cursor:pointer}
      #gmList li:hover{background:var(--dir-hover)}
      #gmNav{position:fixed;display:flex;align-items:center;gap:4px;z-index:1001}
      #gmNav .col{display:flex;flex-direction:column;gap:4px}
      #gmNav button{all:unset;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--nav-bg);color:var(--nav-fg);cursor:pointer}
      #gmNav span{color:var(--nav-fg);font-size:14px}
      .gm-highlight{background:var(--highlight);transition:background .8s ease-out;}
      .cgpt-folded { max-height:120px!important;overflow:hidden!important;position:relative;border-radius:12px }
      .cgpt-folded::after {
        content:'';position:absolute;left:0;right:0;bottom:0;height:3em;
        background:linear-gradient(to bottom,rgba(255,255,255,0),var(--background-primary,#f5f5f7));
      }
      html.dark .cgpt-folded::after {
        background:linear-gradient(to bottom,rgba(58,58,61,0),var(--background-secondary,#3a3b46));
      }
    `
  };

  /* ─── 0) HELPERS ───────────────────────────────────────────────────── */
  const $ = q => document.querySelector(q);
  const $$ = q => [...document.querySelectorAll(q)];
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smoothOK = CSS.supports('scroll-behavior', 'smooth') && !prefersReduced;

  function findScrollContainer(el) {
    let cur = el;
    while (cur) {
      if (cur.scrollHeight > cur.clientHeight) return cur;
      cur = cur.parentElement;
    }
    return window;
  }

  /* ─── 1) GLOBAL STYLES ─────────────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = CONFIG.CSS;
  document.head.appendChild(style);

  /* ─── 2) BUILD UI ────────────────────────────────────────────────── */
  let gmDirWrap, gmToggle, gmRefresh, gmDir, gmList;
  let gmNav, upBtn, dnBtn, counter;
  let curIdx = 0, suppress = false, scrollParent = window, obs, rebuildTimer, currentContainer;

  function buildUI() {
    if ($(CONFIG.SELECTORS.directoryWrap)) return;
    gmDirWrap = document.createElement('div'); gmDirWrap.id = 'gmDirWrap';

    const toolbar = document.createElement('div');
    toolbar.style.display = 'flex'; toolbar.style.gap = '4px';

    gmRefresh = document.createElement('button');
    gmRefresh.id = 'gmRefresh'; gmRefresh.textContent = '⟳'; gmRefresh.title = 'Refresh';
    gmRefresh.onclick = performRefresh;

    gmToggle = document.createElement('button');
    gmToggle.id = 'gmToggle'; gmToggle.textContent = '▼'; gmToggle.title = 'Toggle directory';
    gmToggle.onclick = toggleDirectory;

    toolbar.append(gmRefresh, gmToggle);
    gmDirWrap.append(toolbar);

    gmDir = document.createElement('div'); gmDir.id = 'gmDir';
    gmList = document.createElement('ul'); gmList.id = 'gmList';
    gmDir.append(gmList); gmDirWrap.append(gmDir);
    document.body.append(gmDirWrap);

    gmNav = document.createElement('div'); gmNav.id = 'gmNav';
    gmNav.style.display = 'none';
    const col = document.createElement('div'); col.className = 'col';
    upBtn = document.createElement('button'); upBtn.textContent = '↑'; upBtn.title = 'Prev';
    dnBtn = document.createElement('button'); dnBtn.textContent = '↓'; dnBtn.title = 'Next';
    col.append(upBtn, dnBtn);
    counter = document.createElement('span'); counter.textContent = '0 / 0';
    gmNav.append(col, counter); document.body.append(gmNav);

    window.addEventListener('resize', positionNav);
    upBtn.addEventListener('click', () => jump(curIdx - 1));
    dnBtn.addEventListener('click', () => jump(curIdx + 1));
  }

  function toggleDirectory() {
    const show = gmDir.style.display !== 'block';
    gmDir.style.display = show ? 'block' : 'none';
    gmToggle.textContent = show ? '▲' : '▼';
    positionNav();
  }

  function resetFolds() {
    document.querySelectorAll('[data-fold-processed],[data-foldProcessed],.cgpt-folded')
      .forEach(el => {
        el.removeAttribute('data-fold-processed');
        el.removeAttribute('data-foldProcessed');
        el.classList.remove('cgpt-folded');
      });
  }

  function performRefresh() {
    const tgt = scrollParent;
    const pos = (tgt === window)
      ? window.scrollY
      : (tgt instanceof Element ? tgt.scrollTop : 0);

    resetFolds();

    obs?.disconnect();
    scrollParent.removeEventListener('scroll', syncFromScroll);
    window.removeEventListener('scroll', syncFromScroll);
    boot();

    setTimeout(() => {
      if (tgt === window) {
        window.scrollTo(0, pos);
      } else if (tgt instanceof Element) {
        tgt.scrollTop = pos;
      }
      syncFromScroll();
    }, 0);
  }

  /* ─── 3) CORE LOGIC ──────────────────────────────────────────────── */
  function userTurns() {
    return [...new Set($$(CONFIG.SELECTORS.userWrapper).map(el => el.closest('article')))];
  }

  function updateCounter() {
    const turns = userTurns();
    const total = turns.length;
    const nowVisible = total > 0;

    if (total !== updateCounter._prevTotal) {
      updateCounter._prevTotal = total;
      rebuildList();
    }

    if (gmNav && (nowVisible !== gmNav._prevVisible)) {
      gmNav._prevVisible = nowVisible;
      boot();
      return;
    }

    counter.textContent = `${nowVisible ? curIdx + 1 : 0} / ${total}`;
    if (gmNav) gmNav.style.display = nowVisible ? 'flex' : 'none';
  }

  function jump(idx) {
    const turns = userTurns();
    if (!turns.length) return;
    curIdx = Math.max(0, Math.min(idx, turns.length - 1));
    const n = turns[curIdx];

    suppress = true;

    n.scrollIntoView({ behavior: smoothOK ? 'smooth' : 'auto', block: 'start' });
    n.classList.add('gm-highlight');
    setTimeout(() => n.classList.remove('gm-highlight'), 800);
    updateCounter();
    setTimeout(() => suppress = false, CONFIG.TIMINGS.scrollSuppress);
  }

  function syncFromScroll() {
    if (suppress) return;
    const turns = userTurns(); if (!turns.length) return;
    const mid = window.innerHeight / 2; let best = 0, bd = 1e9;
    turns.forEach((n, i) => {
      const r = n.getBoundingClientRect(), c = r.top + r.height / 2, d = Math.abs(c - mid);
      if (d < bd) { bd = d; best = i; }
    });
    curIdx = best; updateCounter();
  }

  function rebuildList() {
    gmList.textContent = '';
    userTurns().forEach((art, i) => {
      art.id = `gm-q-${i}`; art.classList.add('gm-anchor');
      const li = document.createElement('li');
      li.textContent = `${i + 1}. ${art.innerText.trim().slice(0, 40)}${art.innerText.length > 40 ? '…' : ''}`;
      li.onclick = () => jump(i);
      gmList.append(li);
    });
    updateCounter();
    foldLongMessages();
  }

  /* ─── 4) FOLD‐MESSAGES ───────────────────────────────────────────── */
  function foldLongMessages() {
    document.querySelectorAll(CONFIG.SELECTORS.userWrapper).forEach(msg => {
      if (msg.dataset.foldProcessed) return;
      const content = msg.querySelector(CONFIG.SELECTORS.content);
      if (!content) return;
      if (content.innerText.split('\n').length > CONFIG.FOLD.lineThreshold) {
        msg.dataset.foldProcessed = '1';
        content.classList.add('cgpt-folded');
        content.style.cursor = 'pointer';
        content.addEventListener('click', function handler(e) {
          content.classList.remove('cgpt-folded');
          content.style.cursor = 'auto';
          content.removeEventListener('click', handler);
        });
      }
    });
  }

  /* ─── 5) POSITION ───────────────────────────────────────────────── */
  function positionNav(retry = true) {
    if (!gmNav) return;
    const form = $(CONFIG.SELECTORS.composerForm);
    if (!form) { if (retry) setTimeout(() => positionNav(false), 200); return; }
    const r = form.getBoundingClientRect(), p = 8,
      t = r.top + (r.height - gmNav.offsetHeight) / 2; let l = r.right + p;
    if (l + gmNav.offsetWidth > window.innerWidth) l = r.left - gmNav.offsetWidth - p;
    gmNav.style.top = `${Math.max(4, t)}px`; gmNav.style.left = `${Math.max(4, l)}px`;
  }

  /* ─── 6) OBSERVE & BOOT ─────────────────────────────────────────── */
  let lastUrl = location.href;
  function connectObservers(root) {
    obs?.disconnect();
    obs = new MutationObserver(m => {
      if (m.some(x => x.addedNodes.length)) {
        clearTimeout(rebuildTimer);
        rebuildTimer = setTimeout(() => { rebuildList(); positionNav(); }, CONFIG.TIMINGS.debounce);
      }
    });
    obs.observe(root, { childList: true, subtree: true });
    scrollParent.removeEventListener('scroll', syncFromScroll);
    scrollParent = findScrollContainer(root);
    scrollParent.addEventListener('scroll', syncFromScroll, { passive: true });
    window.addEventListener('scroll', syncFromScroll, { passive: true });
    currentContainer = root;
  }

  function boot() {
    if (location.href !== lastUrl) { lastUrl = location.href; curIdx = 0; }
    const root = CONFIG.SELECTORS.spaContainers.map($).find(Boolean);
    if (!root) return;
    buildUI(); rebuildList(); syncFromScroll(); positionNav(); connectObservers(root);
  }

  ['pushState', 'replaceState'].forEach(fn => {
    const o = history[fn];
    history[fn] = function () { const r = o.apply(this, arguments); setTimeout(boot, CONFIG.TIMINGS.bootDelay); return r; };
  });
  window.addEventListener('popstate', () => setTimeout(boot, CONFIG.TIMINGS.bootDelay));
  window.addEventListener('DOMContentLoaded', () => setTimeout(boot, CONFIG.TIMINGS.bootDelay));
  setInterval(() => $(CONFIG.SELECTORS.directoryWrap) || boot(), CONFIG.TIMINGS.keepAlive);

})();