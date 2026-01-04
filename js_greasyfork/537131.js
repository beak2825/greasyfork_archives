// ==UserScript==
// Filename: traderie-tools.user.js
// ==UserScript==
// @name         Traderie Tools
// @namespace    http://tampermonkey.net/
// @version      2025-05v2
// @description  A browsing companion for traderie.com with bookmarking, adblock, and Diablo 2 price history
// @match        *://*.traderie.com/*
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537131/Traderie%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/537131/Traderie%20Tools.meta.js
// ==/UserScript==

(function() {
  'use strict';

  /**********************
   * Traderie Adblocker *
   **********************/
  const STORAGE_KEY = 'traderie-adblock-groups';
  const ENABLED_KEY = 'traderie-adblock-enabled';
  let adBlockObserver = null;

  const SELECTOR_GROUPS = {
    google: ['.GoogleActiveViewElement', '[id^="google_ads_iframe"]', 'iframe[src*="googlesyndication"]', 'iframe[src*="2mdn"]'],
    generic: ['[id*="anchor"]', '[id*="ad_unit"]', '[data-ad^="leaderboard-"]', 'div[data-ad="left-rail-3"]'],
    video: ['iframe[src*="anyclip"]', 'video[id^="ac-lre-vjs-"]', '.ac-player-wrapper'],
    styled: ['div.sc-gfoqjT.gXykUj', 'div[class*="gfoqjT"]', 'div.ns-08pl9-l-square-gmb', 'div.sc-eyvILC.pvcVG', '.sc-kbousE.dRxaoW', 'div.sc-bpUBKd.jVYraK.cool-slot'],
    tracking: ['script[src*="doubleverify"]'],
    misc: ['a[href="/akrewpro"]', 'span[style*="justify-content: space-between"]', 'svg[style*="left: 160px"]', 'svg[style*="right: 160px"]', 'div.container > div.banner-slider']
  };
  const DEFAULT_ENABLED_GROUPS = Object.keys(SELECTOR_GROUPS);
  const CRITICAL_SELECTORS = ['html', 'head', 'body', 'main', 'nav', '[class*="app"]', '[class*="root"]', '[class*="page"]', '[class*="content"]', '[class*="listing"]', '[class*="trade"]', '[class*="navigation"]', '[class*="header"]', '[class*="menu"]', '[class*="sidebar"]'];
  const BLOCKLIST_EXCEPTIONS = ['.listing-row', '.listing-wrapper', '.listing-container', '#listing-root', '[class*="listing"]', '.sc-etKGGb'];

  function isAdblockEnabled() {
    return localStorage.getItem(ENABLED_KEY) !== 'false';
  }

  function setAdblockEnabled(val) {
    localStorage.setItem(ENABLED_KEY, val ? 'true' : 'false');
  }

  function getEnabledGroups() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_ENABLED_GROUPS;
  }

  function getActiveSelectors() {
    return getEnabledGroups().flatMap(group => SELECTOR_GROUPS[group] || []);
  }

  function injectAdBlockCSS() {
    const style = document.createElement('style');
    style.id = 'traderie-instant-adblock';
    style.textContent = getActiveSelectors().map(sel => `${sel} { display: none !important; }`).join('\n');
    document.head?.appendChild(style);
  }

  function isCriticalElement(el) {
    if (!el || !el.matches) return true;
    try {
      return CRITICAL_SELECTORS.some(sel => el.matches(sel));
    } catch {
      return true;
    }
  }

  function removeEmptyAncestors(el) {
    let parent = el?.parentNode;
    while (parent && parent !== document.body) {
      if (parent.children.length === 0 && parent.textContent.trim() === '') {
        const next = parent.parentNode;
        parent.remove();
        parent = next;
      } else {
        break;
      }
    }
  }

  function safeRemoveStyled(el) {
    if (!el || !el.parentNode) return false;
    const container = el.closest('[class*="ad"], [id*="ad"], [data-ad]') || el;
    if (BLOCKLIST_EXCEPTIONS.some(skip => container.matches?.(skip))) return false;
    if (isCriticalElement(container)) return false;
    try {
      container.remove();
      removeEmptyAncestors(container);
      return true;
    } catch {
      return false;
    }
  }

  function removeAdsFromContainer(container = document.body) {
    const selectors = getActiveSelectors();
    selectors.forEach(selector => {
      try {
        container.querySelectorAll(selector).forEach(el => {
          safeRemoveStyled(el);
        });
      } catch {}
    });

    container.querySelectorAll('div.sc-gfoqjT.gXykUj').forEach(el => {
      if (el.textContent?.trim() === 'Traderie is supported by ads') {
        const wrapper = el.closest('.sc-eqUAAy.sc-eyvILC');
        if (wrapper && !isCriticalElement(wrapper)) {
          wrapper.remove();
        }
      }
    });
  }

  function performInitialCleanup() {
    setTimeout(() => removeAdsFromContainer(), 500);
    setTimeout(() => removeAdsFromContainer(), 1000);
    setTimeout(() => removeAdsFromContainer(), 1500);
  }

  function startAdblockObserver() {
    adBlockObserver = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(n => {
          if (n.nodeType === 1) {
            if (getActiveSelectors().some(sel => n.matches?.(sel))) {
              safeRemoveStyled(n);
            } else {
              removeAdsFromContainer(n);
            }
          }
        });
      });
    });
    adBlockObserver.observe(document.body, { childList: true, subtree: true });
  }

  function initAdblocker() {
    injectAdBlockCSS();
    performInitialCleanup();
    setTimeout(startAdblockObserver, 200);
    setInterval(() => removeAdsFromContainer(), 5000);
  }

  function disableAdblocker() {
    document.getElementById('traderie-instant-adblock')?.remove();
    adBlockObserver?.disconnect();
  }

  window.traderieAdblock = {
    enable: () => { setAdblockEnabled(true); initAdblocker(); },
    disable: () => { setAdblockEnabled(false); disableAdblocker(); },
    isEnabled: isAdblockEnabled
  };

  /*******************************
   * Rune Pricing Functionality *
   *******************************/
  const PRICE_URL = 'https://raw.githubusercontent.com/wguDataNinja/TraderieTools/main/rune_prices.json';
  const RUNE_ENABLED_KEY = 'traderie-rune-pricing-enabled';

  let runePrices = null;
  let runeObserver = null;

  function isRunePricingEnabled() {
    return localStorage.getItem(RUNE_ENABLED_KEY) === 'true';
  }

  function setRunePricingEnabled(val) {
    localStorage.setItem(RUNE_ENABLED_KEY, val ? 'true' : 'false');
  }

  function getServerSlug() {
    const p = new URLSearchParams(window.location.search);
    const plat = (p.get('prop_Platform') || 'pc').toLowerCase();
    const mode = p.get('prop_Mode') === 'hardcore' ? 'hc' : 'sc';
    const lad = p.get('prop_Ladder') === 'true' ? 'l' : 'nl';
    return `${plat}_${mode}_${lad}`;
  }

  function parseRune(el) {
    if (!el) return null;
    const c = el.cloneNode(true);
    Array.from(c.children).forEach(ch => c.removeChild(ch));
    const m = c.textContent.trim().match(/(\d+)\s*[xX]\s*(.+)/);
    return m ? { quantity: +m[1], item: m[2].trim() } : null;
  }

  function parseAskGroups(container) {
    const lines = [...container.querySelectorAll('.price-line, .tooltiptext .price-line')];
    const groups = []; let curr = [];
    lines.forEach((ln, i) => {
      const txt = ln.textContent.trim().toUpperCase();
      const or = txt === 'OR';
      const items = [...ln.querySelectorAll('a')].map(parseRune).filter(Boolean);
      if (items.length) curr.push(...items);
      if (or || (i + 1 < lines.length && lines[i + 1].textContent.trim().toUpperCase() === 'OR')) {
        if (curr.length) { groups.push({ items: curr, element: ln }); curr = []; }
      }
    });
    if (curr.length) groups.push({ items: curr, element: lines[lines.length - 1] });
    return groups;
  }

  function buildTooltipText(offer, asks, prices, slug) {
    const val = r => prices[slug]?.[r.item]?.ist_value ?? null;
    const oVal = val(offer); if (oVal == null) return '';
    const askLines = asks.map(r => {
      const v = val(r);
      return `${r.quantity} x ${r.item} (${v != null ? (r.quantity * v).toFixed(2) : '--'} Ist)`;
    });
    const total = asks.every(r => val(r) != null) ? asks.reduce((s, r) => s + r.quantity * val(r), 0).toFixed(2) : '--';
    return `Offer: ${offer.quantity} x ${offer.item} (${(offer.quantity * oVal).toFixed(2)} Ist)\n` +
      `Ask: ${askLines.join(' + ')}${total !== '--' ? ` = ${total} Ist` : ''}`;
  }

  function showTooltip(el, txt) {
    let tip = document.getElementById('rune-tooltip');
    if (!tip) { tip = document.createElement('div'); tip.id = 'rune-tooltip'; document.body.appendChild(tip); }
    tip.textContent = txt; tip.style.display = 'block';
    const r = el.getBoundingClientRect(), w = tip.offsetWidth;
    tip.style.top = `${window.scrollY + r.top}px`;
    tip.style.left = `${window.scrollX + r.left - w - 10}px`;
  }

  function hideTooltip() { const t = document.getElementById('rune-tooltip'); if (t) t.style.display = 'none'; }

  function injectPercentAndTooltip(off, group, prices, slug) {
    const container = group.element.querySelector('div:first-child');
    if (!container || container.querySelector('.percent-injected')) return;
    const getVal = r => prices[slug]?.[r.item]?.ist_value ?? null;
    const oV = getVal(off); if (oV == null) return;
    container.style.position = 'relative';
    const allAsk = group.items.every(r => getVal(r) != null);
    const span = document.createElement('span');
    span.className = 'percent-injected';
    span.style.left = '-60px';
    span.textContent = allAsk
      ? (() => {
        const askTotal = group.items.reduce((s, r) => s + r.quantity * getVal(r), 0);
        const diff = ((off.quantity * oV - askTotal) / (off.quantity * oV)) * 100;
        return `${diff >= 0 ? '+' : ''}${Math.round(diff)}%`;
      })()
      : '(--)';
    span.style.color = allAsk
      ? (off.quantity * oV - group.items.reduce((s, r) => s + r.quantity * getVal(r), 0) >= 0
        ? 'rgb(0,200,0)' : 'rgb(220,80,80)')
      : 'gray';
    container.appendChild(span);
    const tipText = buildTooltipText(off, group.items, prices, slug);
    span.addEventListener('mouseenter', () => showTooltip(span, tipText));
    span.addEventListener('mouseleave', hideTooltip);
  }

  function injectAll(prices) {
    const slug = getServerSlug();
    document.querySelectorAll('a.listing-name.selling-listing:not([data-injected])').forEach(a => {
      a.setAttribute('data-injected', 'true');
      const cnt = a.closest('div[class*="sc-eqUAAy"]');
      if (!cnt) return;
      const off = parseRune(a);
      if (!off || prices[slug]?.[off.item]?.ist_value == null) return;
      parseAskGroups(cnt).forEach(g => injectPercentAndTooltip(off, g, prices, slug));
    });
  }

  function fetchRunePrices(cb) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: PRICE_URL,
      onload(resp) {
        try {
          cb(JSON.parse(resp.responseText));
        } catch (e) {
          console.error('Failed to parse rune prices', e);
        }
      },
      onerror(err) {
        console.error('Failed to fetch rune prices', err);
      }
    });
  }

  function setupRuneObserver() {
    if (runeObserver) runeObserver.disconnect();
    runeObserver = new MutationObserver(() => {
      if (isRunePricingEnabled() && runePrices) {
        injectAll(runePrices);
      }
    });
    runeObserver.observe(document.body, { childList: true, subtree: true });
    if (isRunePricingEnabled() && runePrices) {
      if (document.readyState !== 'loading') {
        injectAll(runePrices);
      } else {
        document.addEventListener('DOMContentLoaded', () => injectAll(runePrices));
      }
    }
  }

  function startRunePricing() {
    setRunePricingEnabled(true);
    if (!runePrices) {
      fetchRunePrices(prices => {
        runePrices = prices;
        setupRuneObserver();
      });
    } else {
      setupRuneObserver();
    }
  }

  function stopRunePricing() {
    setRunePricingEnabled(false);
    runeObserver?.disconnect();
    runeObserver = null;
    document.querySelectorAll('.percent-injected').forEach(e => e.remove());
    document.querySelectorAll('[data-injected]').forEach(e => e.removeAttribute('data-injected'));
    hideTooltip();
  }

  /***********************
   * UI & Bookmarking   *
   ***********************/
  const font = document.createElement('link');
  font.href = 'https://fonts.googleapis.com/css2?family=Alegreya+Sans&display=swap';
  font.rel = 'stylesheet';
  document.head.appendChild(font);

  const style = document.createElement('style');
  style.textContent = `
    .traderie-tools {
      position: fixed;
      top: 120px;
      left: 20px;
      width: 300px;
      background: #202224;
      color: #e4e6eb;
      border-radius: 20px;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
      font-family: 'Alegreya Sans', sans-serif;
      z-index: 9999;
      resize: both;
      overflow: auto;
    }
    .tools-header {
      background: #2a2b2e;
      padding: 10px 14px;
      border-radius: 20px 20px 0 0;
      cursor: move;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 17px;
      font-weight: bold;
      user-select: none;
    }
    .tools-toggle {
      cursor: pointer;
      background: none !important;
      border: none;
      color: inherit;
      font-size: 18px;
    }
    .tools-toggle:hover {
      background: none !important;
    }
    .tools-content {
      padding: 12px 14px;
      display: none;
    }
    .tools-content.show {
      display: block;
    }
    .tab-buttons {
      display: flex;
      gap: 6px;
      margin-bottom: 10px;
    }
    .tab-buttons button {
      flex: 1;
      padding: 6px;
      border: none;
      border-radius: 12px;
      background: #2f3135;
      color: #e4e6eb;
      cursor: pointer;
      font-family: inherit;
    }
    .tab-buttons button.active {
      background: #444;
      font-weight: bold;
    }
    .tab-pane {
      display: none;
    }
    .tab-pane.active {
      display: block;
    }
    .tools-options {
      display: flex !important;
      flex-direction: column !important;
      gap: 6px !important;
      margin-bottom: 12px !important;
      align-items: flex-start !important;
    }
    .tools-options label {
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
      width: auto !important;
      text-align: left !important;
      font-size: 14px;
      margin: 0 !important;
      padding: 0 !important;
    }
    .tools-options input[type="checkbox"] {
      margin: 0 !important;
      padding: 0 !important;
      flex: 0 0 auto !important;
      width: auto !important;
    }
    .bookmark-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      margin-bottom: 6px;
      font-weight: normal;
      font-size: 14px;
    }
    .bookmark-header .arrow {
      transition: transform 0.2s ease;
    }
    .bookmark-header.expanded .arrow {
      transform: rotate(0deg);
    }
    .bookmark-header.collapsed .arrow {
      transform: rotate(-90deg);
    }
    .bookmark-section {
      display: none;
      flex-direction: column;
      gap: 6px;
      margin-left: 10px;
    }
    .bookmark-label {
      font-weight: bold;
      margin-top: 10px;
      margin-left: 10px;
    }
    .bookmark-item {
      display: flex;
      align-items: center;
      background: #2f3135;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 14px;
      justify-content: space-between;
    }
    .bookmark-item span.text {
      flex-grow: 1;
      cursor: pointer;
      margin-right: 10px;
    }
    .edit-btn, .delete-btn {
      color: #fff;
      font-size: 13px;
      margin-left: 6px;
      cursor: pointer;
    }
    .delete-btn {
      font-weight: bold;
    }
    .bookmark-edit-input {
      width: 100%;
      padding: 2px 6px;
      background: #444;
      color: #fff;
      border: none;
      border-radius: 4px;
    }
    .bookmark-name-input {
      width: 100%;
      padding: 6px;
      border-radius: 6px;
      background: #333;
      color: #fff;
      border: none;
      margin-bottom: 8px;
      display: none;
    }
    #rune-tooltip {
      position: absolute;
      background: #222;
      color: #fff;
      padding: 6px;
      border-radius: 4px;
      font-size: 12px;
      white-space: pre;
      z-index: 9999;
      max-width: 300px;
      display: none;
    }
    .percent-injected {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 50px;
      text-align: right;
      font-size: 14px;
      font-family: 'Alegreya Sans', sans-serif;
      white-space: nowrap;
    }
    .traderie-tools.collapsed {
      height: auto !important;
      overflow: hidden !important;
      resize: none !important;
    }

    .traderie-tools.collapsed .tools-content {
      display: none !important;
    }
  `;
  document.head.appendChild(style);

  const STORAGE_KEY_OPEN = 'traderieAppOpen';
  const STORAGE_BOOKMARKS = 'traderieBookmarks';
  const STORAGE_SIZE = 'traderieAppSize';
  const STORAGE_POSITION = 'traderieAppPosition';
  const STORAGE_BOOKMARKS_OPEN = 'traderieBookmarksOpen';

  const panel = document.createElement('div');
  panel.className = 'traderie-tools';
  panel.innerHTML = `
    <div class="tools-header" id="dragHandle">
      <span>🔖 Traderie Tools</span>
      <button class="tools-toggle" id="expandBtn">➕</button>
    </div>
    <div class="tools-content" id="panelContent">
      <div class="tab-buttons">
        <button class="tab-btn active" data-tab="mainTab">Bookmarks</button>
        <button class="tab-btn" data-tab="optionsTab">Options</button>
      </div>
      <div id="mainTab" class="tab-pane active">
        <div class="bookmark-header collapsed" id="bookmarkToggle">
          <span>
            <svg class="arrow" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em">
              <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
            </svg> Bookmarks
          </span>
          <button id="saveSearchBtn" style="background: none; border: none; color: #e4e6eb; font-size: 14px; cursor: pointer;">＋ Add to bookmarks</button>
        </div>
        <input id="bookmarkName" class="bookmark-name-input" placeholder="Name bookmark...">
        <div id="bookmarkSection" class="bookmark-section">
          <div class="bookmark-label">Listings</div>
          <div id="listingList"></div>
          <div class="bookmark-label">Searches</div>
          <div id="searchList"></div>
        </div>
      </div>
      <div id="optionsTab" class="tab-pane">
        <div class="tools-options">
          <label><input type="checkbox" id="cb1"> Remove Ads</label>
          <label><input type="checkbox" id="cb2"> Inject Rune Pricing</label>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  const saveSize = () => {
    localStorage.setItem(STORAGE_SIZE, JSON.stringify({
      width: panel.style.width,
      height: panel.style.height
    }));
  };
  const loadSize = () => {
    const size = JSON.parse(localStorage.getItem(STORAGE_SIZE) || '{}');
    if (size.width) panel.style.width = size.width;
    if (size.height) panel.style.height = size.height;
  };

  const savePosition = () => {
    localStorage.setItem(STORAGE_POSITION, JSON.stringify({
      left: panel.style.left,
      top: panel.style.top
    }));
  };
  const loadPosition = () => {
    const pos = JSON.parse(localStorage.getItem(STORAGE_POSITION) || '{}');
    if (pos.left) panel.style.left = pos.left;
    if (pos.top) panel.style.top = pos.top;
  };

  const saveBookmarkToggle = (state) => {
    localStorage.setItem(STORAGE_BOOKMARKS_OPEN, JSON.stringify(state));
  };
  const loadBookmarkToggle = () => {
    return JSON.parse(localStorage.getItem(STORAGE_BOOKMARKS_OPEN) || 'false');
  };

  loadSize();
  loadPosition();

  const expandBtn = document.getElementById('expandBtn');
  const content = document.getElementById('panelContent');
  const saveState = () => localStorage.setItem(STORAGE_KEY_OPEN, content.classList.contains('show'));
  const loadState = () => localStorage.getItem(STORAGE_KEY_OPEN) === 'true';

  if (loadState()) {
    content.classList.add('show');
    expandBtn.textContent = '➖';
  }

    expandBtn.onclick = () => {
      const isCollapsed = panel.classList.toggle('collapsed');
      expandBtn.textContent = isCollapsed ? '➕' : '➖';
      saveState();
    };

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    };
  });

  const bookmarkToggle = document.getElementById('bookmarkToggle');
  const bookmarkSection = document.getElementById('bookmarkSection');
  bookmarkToggle.addEventListener('click', () => {
    const expanded = bookmarkToggle.classList.toggle('expanded');
    bookmarkToggle.classList.toggle('collapsed', !expanded);
    bookmarkSection.style.display = expanded ? 'flex' : 'none';
    saveBookmarkToggle(expanded);
  });

  if (loadBookmarkToggle()) {
    bookmarkToggle.classList.add('expanded');
    bookmarkToggle.classList.remove('collapsed');
    bookmarkSection.style.display = 'flex';
  }

  const getBookmarks = () => JSON.parse(localStorage.getItem(STORAGE_BOOKMARKS) || '[]');
  const saveBookmarks = (bms) => localStorage.setItem(STORAGE_BOOKMARKS, JSON.stringify(bms));

  const createEditButton = (callback) => {
    const btn = document.createElement('span');
    btn.className = 'edit-btn';
    btn.textContent = '✎';
    btn.onclick = callback;
    return btn;
  };

  const createDeleteButton = (callback) => {
    const btn = document.createElement('span');
    btn.className = 'delete-btn';
    btn.textContent = '🗑';
    btn.onclick = callback;
    return btn;
  };

  const renderBookmarks = () => {
    const bookmarks = getBookmarks();
    const listings = bookmarks.filter(b => b.type === 'listing');
    const searches = bookmarks.filter(b => b.type === 'search');
    const listingList = document.getElementById('listingList');
    const searchList = document.getElementById('searchList');
    listingList.innerHTML = '';
    searchList.innerHTML = '';

    const makeItem = (b, idx, all) => {
      const item = document.createElement('div');
      item.className = 'bookmark-item';

      const text = document.createElement('span');
      text.className = 'text';
      text.textContent = b.name;
      text.onclick = () => window.location.href = b.url;

      const edit = createEditButton(() => {
        const input = document.createElement('input');
        input.className = 'bookmark-edit-input';
        input.value = b.name;
        input.onkeypress = (e) => {
          if (e.key === 'Enter') {
            all[idx].name = input.value.trim();
            saveBookmarks(all);
            renderBookmarks();
          }
        };
        item.innerHTML = '';
        item.appendChild(input);
        input.focus();
        input.select();
      });

      const del = createDeleteButton(() => {
        const index = all.findIndex(x => x.name === b.name && x.url === b.url && x.type === b.type);
        if (index !== -1) {
          all.splice(index, 1);
          saveBookmarks(all);
          renderBookmarks();
        }
      });

      item.appendChild(text);
      item.appendChild(edit);
      item.appendChild(del);
      return item;
    };

    listings.forEach((b, i) => listingList.appendChild(makeItem(b, i, bookmarks)));
    searches.forEach((b, i) => searchList.appendChild(makeItem(b, i + listings.length, bookmarks)));
  };

  renderBookmarks();

  const input = document.getElementById('bookmarkName');
  const saveSearchBtn = document.getElementById('saveSearchBtn');

  saveSearchBtn.onclick = () => {
    input.style.display = 'block';
    input.value = '';
    input.focus();
    input.select();
  };

  input.onkeypress = (e) => {
    if (e.key === 'Enter') {
      const name = input.value.trim();
      if (!name) return;
      const url = window.location.href;
      const isSearch = !url.includes('/listing');
      const bookmarks = getBookmarks();
      bookmarks.push({
        type: isSearch ? 'search' : 'listing',
        name,
        url
      });
      saveBookmarks(bookmarks);
      renderBookmarks();
      input.style.display = 'none';
      if (!bookmarkSection.style.display || bookmarkSection.style.display === 'none') {
        bookmarkToggle.classList.add('expanded');
        bookmarkToggle.classList.remove('collapsed');
        bookmarkSection.style.display = 'flex';
        saveBookmarkToggle(true);
      }
    }
  };

  // Adblock & Rune checkbox logic
  const adBox = document.getElementById('cb1');
  const runeBox = document.getElementById('cb2');

  adBox.checked = window.traderieAdblock.isEnabled();
  runeBox.checked = isRunePricingEnabled();

  if (adBox.checked) window.traderieAdblock.enable(); else window.traderieAdblock.disable();
  if (runeBox.checked) startRunePricing();

  adBox.addEventListener('change', () => {
    if (adBox.checked) window.traderieAdblock.enable(); else window.traderieAdblock.disable();
  });
  runeBox.addEventListener('change', () => {
    if (runeBox.checked) startRunePricing(); else stopRunePricing();
  });

  // Drag & resize persistence
  const dragHandle = document.getElementById('dragHandle');
  let isDragging = false, offsetX = 0, offsetY = 0;

  dragHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      panel.style.left = `${e.clientX - offsetX}px`;
      panel.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) savePosition();
    isDragging = false;
  });

  panel.addEventListener('mouseup', saveSize);
})();