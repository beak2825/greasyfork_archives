// ==UserScript==
// @name         ChatGPT Arrow Navigator
// @version      1.0
// @description  Add up/down arrow navigation for ChatGPT messages
// @author       Bui Quoc Dung
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/1485470
// @downloadURL https://update.greasyfork.org/scripts/541878/ChatGPT%20Arrow%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/541878/ChatGPT%20Arrow%20Navigator.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ─── CONFIGURATION ────────────────────────────────────────────────── */
  const CONFIG = {
    SELECTORS: {
      userWrapper: 'div[data-message-author-role="user"]',
      composerTextarea: '#prompt-textarea',
      spaContainers: ['div.my-auto.text-base', 'div.m-auto.text-base', 'main'],
    },
    TIMINGS: {
      scrollSuppress: 300,
      debounce: 100,
      keepAlive: 5000,
      bootDelay: 300
    },
    CSS: `
      :root{--nav-bg:#ddd;--nav-fg:#333;}
      html.dark{--nav-bg:#444;--nav-fg:#eee;}
      .gm-anchor{scroll-margin-top:96px !important;}
      #gmNav{position:fixed;display:flex;z-index:1001;transition:top .15s ease-out, left .15s ease-out;}
      #gmNav .col{display:flex;flex-direction:column;align-items:center;gap:4px;}
      #gmNav button{all:unset;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--nav-bg);color:var(--nav-fg);cursor:pointer;}
      #gmNav span{color:var(--nav-fg);font-size:12px;font-weight:bold;line-height:1;min-width:2ch;text-align:center;}
    `
  };

  /* ─── HELPER FUNCTIONS ─────────────────────────────────────────────── */
  const $ = q => document.querySelector(q);
  const $$ = q => [...document.querySelectorAll(q)];

  /* ─── GLOBAL VARIABLES ─────────────────────────────────────────────── */
  let gmNav, upBtn, dnBtn, counter, obs, resizeObs, rebuildTimer;
  let curIdx = 0, suppress = false;

  /* ─── BUILD INTERFACE ──────────────────────────────────────────────── */
  function buildUI() {
    if ($('#gmNav')) return;

    gmNav = document.createElement('div'); gmNav.id = 'gmNav';
    gmNav.style.display = 'none';

    const col = document.createElement('div'); col.className = 'col';
    upBtn = document.createElement('button'); upBtn.textContent = '↑'; upBtn.title = 'Previous message';
    dnBtn = document.createElement('button'); dnBtn.textContent = '↓'; dnBtn.title = 'Next message';
    counter = document.createElement('span');

    col.append(upBtn, dnBtn, counter);
    gmNav.append(col);
    document.body.append(gmNav);

    window.addEventListener('resize', () => positionNav());
    upBtn.addEventListener('click', () => jump(curIdx - 1));
    dnBtn.addEventListener('click', () => jump(curIdx + 1));
  }

  /* ─── CORE LOGIC ───────────────────────────────────────────────────── */
  function userTurns() {
    return $$(CONFIG.SELECTORS.userWrapper);
  }

  function updateState() {
    const turns = userTurns();
    const isVisible = turns.length > 0;

    turns.forEach((turn, i) => {
      turn.id = `gm-q-${i}`;
      turn.classList.add('gm-anchor');
    });

    if (gmNav) gmNav.style.display = isVisible ? 'flex' : 'none';
    if (isVisible) counter.textContent = curIdx + 1;
  }

  function jump(idx) {
    const turns = userTurns();
    if (!turns.length) return;
    curIdx = Math.max(0, Math.min(idx, turns.length - 1));
    const targetNode = turns[curIdx];

    suppress = true;
    targetNode.scrollIntoView({ behavior: 'auto', block: 'start' });

    updateState();
    setTimeout(() => suppress = false, CONFIG.TIMINGS.scrollSuppress);
  }

  function syncFromScroll() {
    if (suppress) return;
    const turns = userTurns();
    if (!turns.length) return;

    const mid = window.innerHeight / 2;
    let best = 0;
    let bestDistance = Infinity;

    turns.forEach((node, i) => {
      const r = node.getBoundingClientRect();
      const distance = Math.abs(r.top + r.height / 2 - mid);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });
    curIdx = best;
    updateState();
  }

  /* ─── POSITIONING & RESIZE OBSERVER ───────────────────────────────── */
  function positionNav(retry = true) {
    if (!gmNav) return;
    const textarea = $(CONFIG.SELECTORS.composerTextarea);
    const anchorEl = textarea?.closest('div.relative');

    if (!anchorEl) {
      if (retry) setTimeout(() => positionNav(false), 200);
      return;
    }

    const r = anchorEl.getBoundingClientRect();

    // --- POSITION ADJUSTMENTS ---
    const horizontalPadding = 12;
    const verticalOffset = 5;

    const t = r.top + (r.height - gmNav.offsetHeight) / 2 + verticalOffset;
    let l = r.left - gmNav.offsetWidth - horizontalPadding;

    if (l < horizontalPadding) l = r.right + horizontalPadding;

    gmNav.style.top = `${Math.max(4, t)}px`;
    gmNav.style.left = `${Math.max(4, l)}px`;
  }

  function observeComposerResize() {
    resizeObs?.disconnect();
    const anchorEl = $(CONFIG.SELECTORS.composerTextarea)?.closest('div.relative');
    if (anchorEl) {
      resizeObs = new ResizeObserver(() => positionNav(false));
      resizeObs.observe(anchorEl);
    }
  }

  /* ─── BOOTSTRAP & PAGE CHANGE OBSERVER ────────────────────────────── */
  let lastUrl = location.href;

  function boot() {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      curIdx = 0;
    }

    const root = CONFIG.SELECTORS.spaContainers.map($).find(Boolean);
    if (!root) return;

    buildUI();
    observeComposerResize();
    root.addEventListener('scroll', syncFromScroll, { passive: true });
    window.addEventListener('scroll', syncFromScroll, { passive: true });

    obs?.disconnect();
    obs = new MutationObserver(() => {
      clearTimeout(rebuildTimer);
      rebuildTimer = setTimeout(() => { updateState(); positionNav(); }, CONFIG.TIMINGS.debounce);
    });
    obs.observe(root, { childList: true, subtree: true });

    updateState();
    syncFromScroll();
    positionNav();
  }

  document.head.appendChild(Object.assign(document.createElement('style'), { textContent: CONFIG.CSS }));
  ['pushState', 'replaceState'].forEach(fn => {
    const original = history[fn];
    history[fn] = function() {
      const result = original.apply(this, arguments);
      setTimeout(boot, CONFIG.TIMINGS.bootDelay);
      return result;
    };
  });
  window.addEventListener('popstate', () => setTimeout(boot, CONFIG.TIMINGS.bootDelay));
  window.addEventListener('DOMContentLoaded', () => setTimeout(boot, CONFIG.TIMINGS.bootDelay));
  setInterval(() => $('#gmNav') || boot(), CONFIG.TIMINGS.keepAlive);

})();
