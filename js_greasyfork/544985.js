// ==UserScript==
// @name         VK/VKVideo: sort by time by ChatGPT 5 (v2.0 – fixed selectors) 
// @namespace    https://vkvideo.ru/
// @version      2.0
// @description  Sorts visible videos by length (↑/↓) on VK Video channel pages
// @match        *://vkvideo.ru/*
// @match        *://vk.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/VK.com-logo.svg/1200px-VK.com-logo.svg.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544985/VKVKVideo%3A%20sort%20by%20time%20by%20ChatGPT%205%20%28v20%20%E2%80%93%20fixed%20selectors%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544985/VKVKVideo%3A%20sort%20by%20time%20by%20ChatGPT%205%20%28v20%20%E2%80%93%20fixed%20selectors%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Selectors from your page:
  const SEL = {
    LIST: '[data-testid="catalog_list_videos"]',
    ITEM: ':scope > [data-testid="grid-item"]',
    DURATION: '[data-testid="video_card_duration"]',
  };

  const MAX_Z = 2147483647;
  let ascending = true;

  const log = (...a) => console.log('[VK sort 2.0]', ...a);

  function timeToSeconds(t) {
    if (!t) return 0;
    const p = t.trim().split(':').map(Number);
    if (p.some(Number.isNaN)) return 0;
    if (p.length === 2) return p[0] * 60 + p[1];
    if (p.length === 3) return p[0] * 3600 + p[1] * 60 + p[2];
    return 0;
  }

  function toast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style, {
      position: 'fixed', bottom: '140px', right: '20px',
      zIndex: MAX_Z, padding: '10px 14px',
      background: '#2b2b2b', color: '#fff',
      borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,.35)',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1600);
  }

  function findListAndItems() {
    const list = document.querySelector(SEL.LIST);
    if (!list) return { list: null, items: [] };
    const items = Array.from(list.querySelectorAll(SEL.ITEM));
    return { list, items };
  }

  function collect() {
    const { list, items } = findListAndItems();
    if (!list || !items.length) return { list: null, rows: [] };
    const rows = items.map(li => {
      const dur = li.querySelector(SEL.DURATION);
      return { li, seconds: timeToSeconds(dur?.textContent || ''), txt: dur?.textContent?.trim() || '' };
    });
    return { list, rows };
  }

  function sortNow() {
    const { list, rows } = collect();
    if (!list || !rows.length) {
      toast('Could not find the list/tiles. Scroll to load more and try again.');
      log('collect()', { list, rowsLen: rows.length });
      return;
    }

    rows.sort((a, b) => ascending ? a.seconds - b.seconds : b.seconds - a.seconds);

    const frag = document.createDocumentFragment();
    rows.forEach(r => frag.appendChild(r.li));
    list.appendChild(frag);

    toast(ascending ? 'Sorted ↑ (shorter → longer)' : 'Sorted ↓ (longer → shorter)');
    const btn = document.getElementById('vkvideo-sort-btn');
    if (btn) btn.textContent = ascending ? 'Sort by time ↓' : 'Sort by time ↑';
    ascending = !ascending;
  }

  function addButton() {
    if (document.getElementById('vkvideo-sort-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'vkvideo-sort-btn';
    btn.textContent = 'Sort by time ↑';
    Object.assign(btn.style, {
      position: 'fixed', bottom: '200px', right: '20px', zIndex: MAX_Z,
      padding: '12px 18px', fontSize: '16px', lineHeight: '1',
      background: '#4a76a8', color: '#fff', border: 'none',
      borderRadius: '10px', cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,.35)', pointerEvents: 'auto', userSelect: 'none',
    });
    btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); sortNow(); }, true);
    document.body.appendChild(btn);

    // shortcut: Alt+S
    window.addEventListener('keydown', e => {
      if (e.altKey && e.key.toLowerCase() === 's') { e.preventDefault(); sortNow(); }
    }, true);
  }

  function init() {
    addButton();
    // SPA: ensure the button remains when the DOM changes
    const obs = new MutationObserver(() => addButton());
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();