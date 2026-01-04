// ==UserScript==
// @name         lolz @pic
// @namespace    lolzPic
// @description  lolzPic
// @version      1.0
// @match        https://lolz.live/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/547507/lolz%20%40pic.user.js
// @updateURL https://update.greasyfork.org/scripts/547507/lolz%20%40pic.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const API_KEY = '';
  const CX_ID   = '';

  const getEditor = () =>
    document.activeElement?.closest('[contenteditable="true"]') ||
    document.querySelector('[contenteditable="true"]');

  const LOLZ_STYLES = `
    .lpic-scroll {
      position: absolute;
      z-index: 9999;
      background: #0d0d0d;
      border: 1px solid #2BAD72;
      border-radius: 6px;
      width: min-content;
      max-height: 306px;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,.6);
      left: var(--lp-left);
      top: var(--lp-top);
      font-family: "JetBrains Mono", "Courier New", monospace;
      display: grid;
      grid-template-columns: repeat(3, 90px);
      gap: 8px;
    }
    .lpic-cell {
      position: relative;
      width: 90px;
      height: 90px;
    }
    .lpic-item {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
      cursor: pointer;
      transition: transform .15s;
    }
    .lpic-item:hover {
      transform: scale(1.08);
      outline: 2px solid #2BAD72;
    }
    .lpic-loupe {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(0,0,0,.6);
      color: #2BAD72;
      font-size: 14px;
      line-height: 20px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      text-align: center;
      cursor: pointer;
      z-index: 2;
      opacity: 0;
      transition: opacity .2s;
      pointer-events: none;
    }
    .lpic-cell:hover .lpic-loupe {
      opacity: 1;
      pointer-events: auto;
    }

    .lpic-preview-overlay {
      position: fixed;
      inset: 0;
      z-index: 10000;
      background: rgba(0,0,0,.75);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .lpic-preview-img {
      width: 300px;
      height: 300px;
      object-fit: contain;
      border: 2px solid #2BAD72;
      border-radius: 8px;
    }
  `;

  GM_addStyle(LOLZ_STYLES);

  let menu          = null;
  let inputTimeout  = null;
  let currentQuery  = '';
  let loadedPages   = 0;
  let totalResults  = 0;
  let loadingMore   = false;
  let previewOverlay = null;

  function createMenu(editor) {
    if (menu) menu.remove();
    menu = document.createElement('div');
    menu.className = 'lpic-scroll';
    const rect = editor.getBoundingClientRect();
    menu.style.setProperty('--lp-left', `${rect.left + window.scrollX}px`);
    menu.style.setProperty('--lp-top',  `${rect.top  + window.scrollY - 320}px`);
    document.body.appendChild(menu);

    menu.addEventListener('scroll', () => {
      if (!loadingMore && totalResults > menu.children.length &&
          menu.scrollTop + menu.clientHeight >= menu.scrollHeight - 40) {
        loadNextPage(editor);
      }
    });
    return menu;
  }

  function loadNextPage(editor) {
    if (loadingMore) return;
    loadingMore = true;
    const start = loadedPages * 10 + 1;
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX_ID}&q=${encodeURIComponent(currentQuery)}&searchType=image&num=10&safe=off&start=${start}`,
      onload: resp => {
        try {
          const data = JSON.parse(resp.responseText);
          totalResults = parseInt(data.searchInformation?.totalResults || 0);
          loadedPages++;
          (data.items || []).forEach(item => appendImage(item.link));
        } catch { appendFallback(); }
        loadingMore = false;
      },
      onerror: () => { appendFallback(); loadingMore = false; }
    });

    function appendFallback() {
      for (let i = 0; i < 9; i++)
        appendImage(`https://picsum.photos/300?random=${Math.random()}`);
    }

    function appendImage(url) {
      const cell = document.createElement('div');
      cell.className = 'lpic-cell';

      const img = document.createElement('img');
      img.className = 'lpic-item';
      img.src = url;
      img.addEventListener('click', () => insert(url));

      const loupe = document.createElement('span');
      loupe.className = 'lpic-loupe';
      loupe.textContent = '🔍';
      loupe.title = 'Предпросмотр';
      loupe.addEventListener('click', e => {
        e.stopPropagation();
        showPreview(url);
      });

      cell.appendChild(img);
      cell.appendChild(loupe);
      menu.appendChild(cell);
    }
  }

  function showPreview(src) {
    if (previewOverlay) previewOverlay.remove();
    previewOverlay = document.createElement('div');
    previewOverlay.className = 'lpic-preview-overlay';
    const img = document.createElement('img');
    img.className = 'lpic-preview-img';
    img.src = src;
    previewOverlay.appendChild(img);
    document.body.appendChild(previewOverlay);

    previewOverlay.addEventListener('click', hidePreview);
    document.addEventListener('keydown', escClose);
    function escClose(e) {
      if (e.key === 'Escape') {
        hidePreview();
        document.removeEventListener('keydown', escClose);
      }
    }
  }

  function hidePreview() {
    previewOverlay?.remove();
    previewOverlay = null;
  }

  function insert(url) {
    const ed = getEditor();
    if (!ed) return;
    const text = ed.textContent;
    const match = text.match(/@pic\s+([^\s]+)/);
    if (!match) return;

    ed.textContent = text.replace(match[0], `[IMG]${url}[/IMG] `);
    const sel = window.getSelection();
    sel.selectAllChildren(ed);
    sel.collapseToEnd();
    menu?.remove();
  }

  document.addEventListener('click', e => {
    if (menu && !menu.contains(e.target)) menu.remove();
  });

  document.addEventListener('input', e => {
    const ed = getEditor();
    if (!ed) return;
    const text = ed.textContent;
    const m = text.match(/@pic\s+([^\s]+)/);
    if (!m) { menu?.remove(); return; }

    currentQuery = m[1];
    loadedPages  = 0;
    totalResults = 0;

    clearTimeout(inputTimeout);
    inputTimeout = setTimeout(() => {
      createMenu(ed);
      loadNextPage(ed);
    }, 500);
  });
})();