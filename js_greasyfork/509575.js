// ==UserScript==
// @name        FreshRSS Duplicate Filter
// @namespace   https://github.com/hiroki-miya
// @version     1.0.5
// @description Mark as read and hide older articles in the FreshRSS feed list that have the same title, URL and content within a category or feed.
// @author      hiroki-miya
// @license     MIT
// @match       https://freshrss.example.net/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/509575/FreshRSS%20Duplicate%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/509575/FreshRSS%20Duplicate%20Filter.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // -----------------------------
  // Small DOM helpers
  // -----------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // -----------------------------
  // UI styles (ALL via GM_addStyle)
  // -----------------------------

  GM_addStyle(`
    #freshrss-duplicate-filter{
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10000;
      background-color: white;
      border: 1px solid black;
      padding: 10px;
      width: max-content;
      max-width: 92vw;
    }
    #freshrss-duplicate-filter > h2{
      box-shadow: inset 0 0 0 0.5px black;
      padding: 5px 10px;
      text-align: center;
      cursor: move;
      user-select: none;
      margin: 0 0 6px 0;
    }
    #freshrss-duplicate-filter > h4{
      margin-top: 0;
      margin-bottom: 6px;
    }
    #fdfs-categories{
      margin-bottom: 10px;
      max-height: 60vh;
      overflow-y: auto;
      padding-right: 8px;
    }
    #fdfs-categories label{ display: block; }
    #freshrss-duplicate-filter button{ margin-right: 6px; }
  `);


  // -----------------------------
  // Settings
  // -----------------------------
  const DEFAULT_SELECTED = [];
  const DEFAULT_LIMIT = 300;

  let selectedCategories = GM_getValue('selectedCategories', DEFAULT_SELECTED);
  let checkLimit = GM_getValue('checkLimit', DEFAULT_LIMIT);

  // -----------------------------
  // Sidebar titles (keep the existing sidebar order)
  // -----------------------------
  function listSidebarTitlesInOrder() {
    const sidebar = $('#sidebar');
    if (!sidebar) return [];

    const out = [];
    const seen = new Set();
    const push = (t) => {
      t = (t || '').trim();
      if (t && !seen.has(t)) { seen.add(t); out.push(t); }
    };

    const categories = $$('.category', sidebar);
    if (categories.length) {
      categories.forEach(cat => {
        push($(':scope > a span.title, :scope > a .title, :scope > a', cat)?.textContent);
        $$(':scope ul li a span.title, :scope ul li a .title, :scope ul li a', cat).forEach(a => push(a.textContent));
      });
      return out;
    }

    $$('a span.title, a .title, .title', sidebar).forEach(el => push(el.textContent));
    return out;
  }

  function getActiveSidebarTitles() {
    const cat = $('#sidebar .category.active > a span.title, #sidebar .category.active > a .title')?.textContent?.trim();
    const feed = $('#sidebar .category.active ul li.active > a span.title, #sidebar .category.active ul li.active > a .title')?.textContent?.trim();
    const deep = $$('#sidebar li.active a span.title, #sidebar li.active a .title')
      .map(e => e.textContent.trim()).filter(Boolean).pop();

    return [cat, feed, deep].filter(Boolean);
  }

  function shouldRunHere() {
    if (!Array.isArray(selectedCategories) || selectedCategories.length === 0) return false;
    return getActiveSidebarTitles().some(t => selectedCategories.includes(t));
  }

  // -----------------------------
  // Settings UI
  // -----------------------------
  const PANEL_ID = 'freshrss-duplicate-filter';
  const PANEL_POS_KEY = 'fdf_panel_pos';

  function showSettings() {
    // remove existing panel to avoid duplicates
    document.getElementById(PANEL_ID)?.remove();

    const titles = listSidebarTitlesInOrder();
    const selectedSet = new Set(selectedCategories || []);

    const panel = document.createElement('div');
    panel.id = PANEL_ID;

    const h2 = document.createElement('h2');
    h2.textContent = 'Duplicate Filter Settings';
    panel.appendChild(h2);

    const h4 = document.createElement('h4');
    h4.textContent = 'Select category or feed';
    panel.appendChild(h4);

    const list = document.createElement('div');
    list.id = 'fdfs-categories';

    titles.forEach(t => {
      const label = document.createElement('label');

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = t;
      cb.checked = selectedSet.has(t);

      label.appendChild(cb);
      label.appendChild(document.createTextNode(' ' + t));
      list.appendChild(label);
    });
    panel.appendChild(list);

    const limitLabel = document.createElement('label');
    limitLabel.textContent = 'Check Limit: ';

    const limitInput = document.createElement('input');
    limitInput.type = 'number';
    limitInput.id = 'checkLimit';
    limitInput.min = '1';
    limitInput.value = String(checkLimit);

    limitLabel.appendChild(limitInput);
    panel.appendChild(limitLabel);

    panel.appendChild(document.createElement('br'));

    const saveBtn = document.createElement('button');
    saveBtn.id = 'fdfs-save';
    saveBtn.textContent = 'Save';

    const closeBtn = document.createElement('button');
    closeBtn.id = 'fdfs-close';
    closeBtn.textContent = 'Close';

    panel.appendChild(saveBtn);
    panel.appendChild(closeBtn);

    document.body.appendChild(panel);

    // restore position if saved
    const pos = GM_getValue(PANEL_POS_KEY, null);
    if (pos && typeof pos.left === 'number' && typeof pos.top === 'number') {
      panel.style.left = pos.left + 'px';
      panel.style.top = pos.top + 'px';
      panel.style.transform = 'none';
    }

    makeDraggable(panel, h2, (left, top) => GM_setValue(PANEL_POS_KEY, { left, top }));

    saveBtn.addEventListener('click', () => {
      selectedCategories = Array.from(panel.querySelectorAll('#fdfs-categories input[type="checkbox"]:checked')).map(el => el.value);
      checkLimit = Math.max(1, parseInt(limitInput.value, 10) || DEFAULT_LIMIT);

      GM_setValue('selectedCategories', selectedCategories);
      GM_setValue('checkLimit', checkLimit);

      panel.remove();
      scheduleRun(true);
    });

    closeBtn.addEventListener('click', () => panel.remove());
  }

  // Make element draggable (handle = header)
  function makeDraggable(elmnt, handle, onSave) {
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;

    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();

      const rect = elmnt.getBoundingClientRect();
      elmnt.style.left = rect.left + 'px';
      elmnt.style.top = rect.top + 'px';
      elmnt.style.transform = 'none';

      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left;
      startTop = rect.top;

      const onMove = (ev) => {
        ev.preventDefault();
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        const maxLeft = Math.max(0, window.innerWidth - elmnt.offsetWidth);
        const maxTop = Math.max(0, window.innerHeight - elmnt.offsetHeight);

        const left = Math.min(maxLeft, Math.max(0, startLeft + dx));
        const top = Math.min(maxTop, Math.max(0, startTop + dy));

        elmnt.style.left = left + 'px';
        elmnt.style.top = top + 'px';
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);

        const left = parseFloat(elmnt.style.left) || 0;
        const top = parseFloat(elmnt.style.top) || 0;
        if (typeof onSave === 'function') onSave(left, top);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  GM_registerMenuCommand('Settings', showSettings);


  // -----------------------------
  // Duplicate key: Title + URL
  // -----------------------------
  function normalizeText(s) {
    return (s || '')
      .replace(/\u200B|\u200C|\u200D|\uFEFF/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function canonicalizeUrl(url) {
    if (!url) return '';
    try {
      const u = new URL(url, location.href);
      u.hash = '';

      // Remove common tracking params
      const drop = new Set([
        'utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_id','utm_name','utm_reader',
        'ref','source'
      ]);
      for (const k of Array.from(u.searchParams.keys())) {
        if (drop.has(k)) u.searchParams.delete(k);
      }

      // Normalize trailing slashes (except root)
      if (u.pathname.length > 1) u.pathname = u.pathname.replace(/\/+$/, '/');
      return u.toString();
    } catch {
      return url;
    }
  }

  function getTitleUrlKey(flux) {
    const a = $('a.item-element.title, a.title, .item-title a, h1 a, h2 a, h3 a', flux);
    const title = normalizeText(a?.textContent);
    const url = canonicalizeUrl(a?.href);
    return (title && url) ? `t:${title}||u:${url}` : '';
  }

  // -----------------------------
  // FreshRSS context/jsonVars (CSRF + URL templates)
  // -----------------------------
  function htmlDecode(s) {
    const t = document.createElement('textarea');
    t.innerHTML = s;
    return t.value;
  }

  function getFreshRssContext() {
    if (window.context && typeof window.context === 'object') return window.context;

    const el = $('#jsonVars');
    if (!el) return null;

    const raw = (el.textContent || '').trim();
    if (!raw) return null;

    const txt = (raw.includes('&quot;') || raw.includes('&#')) ? htmlDecode(raw) : raw;
    try { return JSON.parse(txt); } catch { return null; }
  }

  function findCsrfToken(ctx) {
    const c = ctx && (ctx.csrf || ctx._csrf || ctx.csrf_token || ctx.token);
    if (typeof c === 'string' && c) return c;

    const meta = $('meta[name="csrf-token"], meta[name="csrf"], meta[name="_csrf"]');
    if (meta?.content) return meta.content;

    const inp = $('input[name="_csrf"], input[name="csrf"], input[name="csrf_token"]');
    if (inp?.value) return inp.value;

    return '';
  }

  function findReadUrlTemplate(ctx) {
    const found = [];
    const seen = new Set();

    const walk = (o) => {
      if (!o || typeof o !== 'object' || seen.has(o)) return;
      seen.add(o);

      for (const k of Object.keys(o)) {
        const v = o[k];
        if (typeof v === 'string') {
          if (/c=entry/i.test(v) && /a=read/i.test(v)) found.push(v);
        } else if (v && typeof v === 'object') {
          walk(v);
        }
      }
    };

    walk(ctx);
    return found.find(s => /ajax=1/i.test(s)) || found[0] || '';
  }

  // -----------------------------
  // Extract entry id from a ".flux" node
  // -----------------------------
  function extractEntryId(flux) {
    // dataset often contains numeric ids
    const ds = flux.dataset || {};
    for (const k of ['entryId', 'entry', 'id', 'fluxId', 'id_entry', 'idEntry']) {
      const v = ds[k];
      if (v && /^\d+$/.test(v)) return v;
    }

    // id attribute like "flux_12345"
    if (flux.id) {
      const m = flux.id.match(/(\d+)/);
      if (m) return m[1];
    }

    // as a last resort, parse an href parameter
    const a = $('a[href*="id="], a[href*="entry="], a[href*="c=entry"]', flux);
    if (a?.href) {
      try {
        const u = new URL(a.href, location.href);
        const id = u.searchParams.get('id') || u.searchParams.get('entry') || u.searchParams.get('entry_id');
        if (id && /^\d+$/.test(id)) return id;
      } catch { /* ignore */ }
    }

    return '';
  }

  // -----------------------------
  // Mark read (persist on server)
  // -----------------------------
  async function markReadPersist(flux) {
    const entryId = extractEntryId(flux);
    if (!entryId) return false;

    // If FreshRSS exposes helper, use it first.
    try {
      if (typeof window.mark_read === 'function') {
        window.mark_read(flux, true, true);
        return true;
      }
    } catch { /* ignore */ }

    const ctx = getFreshRssContext();
    const csrf = findCsrfToken(ctx);

    // Build URL: prefer context-provided template, otherwise generic fallback.
    let url = '';
    const tpl = findReadUrlTemplate(ctx);

    if (tpl) {
      try {
        if (/\{id\}/i.test(tpl)) url = tpl.replace(/\{id\}/ig, entryId);
        else if (/%d/.test(tpl)) url = tpl.replace(/%d/g, entryId);
        else {
          const u = new URL(tpl, location.href);
          u.searchParams.set('id', entryId);
          u.searchParams.set('ajax', '1');
          url = u.toString();
        }
      } catch { url = ''; }
    }

    if (!url) {
      const u = new URL(location.href);
      u.searchParams.set('c', 'entry');
      u.searchParams.set('a', 'read');
      u.searchParams.set('id', entryId);
      u.searchParams.set('ajax', '1');
      url = u.toString();
    }

    const headers = { 'X-Requested-With': 'XMLHttpRequest' };
    if (csrf) {
      headers['X-CSRF-Token'] = csrf;
      headers['X-CSRF-TOKEN'] = csrf;
    }

    const body = new URLSearchParams();
    if (csrf) body.set('_csrf', csrf);

    // POST preferred, then GET fallback
    try {
      const r = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: body.toString(),
      });
      if (r.ok) return true;
    } catch { /* ignore */ }

    try {
      const r2 = await fetch(url, { method: 'GET', credentials: 'same-origin' });
      return r2.ok;
    } catch {
      return false;
    }
  }

  function hideDuplicate(flux) {
    // Hide immediately, remove later after the read request has time to finish.
    flux.style.display = 'none';
    setTimeout(() => flux.remove(), 3000);
  }

  // -----------------------------
  // Main: scan current DOM order, keep newest unique
  // -----------------------------
  function runOnce() {
    if (!shouldRunHere()) return;

    const stream = $('#stream');
    if (!stream) return;

    const items = $$('.flux', stream);
    if (!items.length) return;

    const seen = new Set();
    items.slice(0, Math.max(1, checkLimit)).forEach(flux => {
      const key = getTitleUrlKey(flux);
      if (!key) return;

      if (seen.has(key)) {
        markReadPersist(flux);
        hideDuplicate(flux);
      } else {
        seen.add(key);
      }
    });
  }

  // -----------------------------
  // Scheduling / observers
  // -----------------------------
  function debounce(fn, ms) {
    let t;
    return () => {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  }

  const debouncedRun = debounce(runOnce, 350);

  function scheduleRun(force = false) {
    if (!force && !shouldRunHere()) return;
    if ('requestIdleCallback' in window) requestIdleCallback(() => debouncedRun(), { timeout: 1500 });
    else debouncedRun();
  }

  function setup() {
    const stream = $('#stream');
    if (!stream) return void setTimeout(setup, 800);

    // Stream updates (infinite scroll / AJAX load)
    new MutationObserver(muts => {
      const added = muts.some(m =>
        m.addedNodes?.length &&
        Array.from(m.addedNodes).some(n =>
          n instanceof HTMLElement && (n.classList.contains('flux') || n.querySelector?.('.flux'))
        )
      );
      if (added) scheduleRun();
    }).observe(stream, { childList: true, subtree: true });

    // Sidebar navigation
    $('#sidebar')?.addEventListener('click', e => {
      if (e.target?.closest?.('a')) setTimeout(() => scheduleRun(), 700);
    }, true);

    // Initial run after first paint
    setTimeout(() => scheduleRun(), 1200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, { once: true });
  else setup();
})();