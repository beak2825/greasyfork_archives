// ==UserScript==
// @name         Legal Acts Finder — Responsive Sidebar w/ PDF lookup (improved UI + PDF)
// @namespace    http://tampermonkey.net/
// @version      1.12.0
// @description  Detect legal acts/sections, dedupe, find PDFs (direct if possible). Compact responsive UI, accent applied to controls, draggable/snap sidebar, toggle tab. Uses polite queued search.
// @author       iamnobody + AI improvements
// @license      MIT
// @match        *://*/*
// @exclude      *://www.google.*/*
// @exclude      *://search.yahoo.com/*
// @exclude      *://www.bing.com/*
// @exclude      *://duckduckgo.com/*
// @exclude      *://search.brave.com/*
// @exclude      *://*.yandex.*/*
// @grant        GM_xmlhttpRequest
// @icon         https://greasyfork.org/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTg5MTc1LCJwdXIiOiJibG9iX2lkIn19--c218824699773e9e6d58fe11cc76cdbb165a2e65/1000031087.jpg?locale=en
// @banner       https://greasyfork.org/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTg5MTczLCJwdXIiOiJibG9iX2lkIn19--77a89502797ffc05cd152a04c877a3b3de4c24be/1000031086.jpg?locale=en
// @downloadURL https://update.greasyfork.org/scripts/490080/Legal%20Acts%20Finder%20%E2%80%94%20Responsive%20Sidebar%20w%20PDF%20lookup%20%28improved%20UI%20%2B%20PDF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/490080/Legal%20Acts%20Finder%20%E2%80%94%20Responsive%20Sidebar%20w%20PDF%20lookup%20%28improved%20UI%20%2B%20PDF%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ---------- TL;DR: improvements made ----------
   - Accent color applied consistently (buttons, +/- etc).
   - PDF lookup implemented per item using GM_xmlhttpRequest with concurrency control.
   - Scan & fetch happen when user opens the sidebar (no heavy work on pageload).
   - Toggle tab created early to ensure it's always visible.
   - Kept draggable / snap / exclude-site behaviors.
  ------------------------------------------------*/

  /* ---------- Helpers ---------- */
  const escapeHtml = s => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const HOST = location.hostname.replace(/^www\./i, '');
  const STORAGE_KEYS = { excluded: 'la_excluded_sites_v4', color: 'la_sidebar_color_v4', width: 'la_sidebar_width_v4', pos: 'la_sidebar_position_v4' };
  const DEFAULT_ACCENT = '#ff8a00';
  const DEFAULT_WIDTH = 300;
  const MIN_WIDTH = 140;
  const MAX_WIDTH = 600;
  const FETCH_CONCURRENCY = 3;
  const OPEN_DELAY_MS = 300;

  /* ---------- Simple storage wrappers ---------- */
  function getStored(key, def) {
    try { const v = localStorage.getItem(key); return v === null ? def : JSON.parse(v); } catch { return def; }
  }
  function setStored(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }

  /* ---------- Early exit if site excluded ---------- */
  const excludedHosts = getStored(STORAGE_KEYS.excluded, []);
  if (Array.isArray(excludedHosts) && excludedHosts.includes(HOST)) return;

  /* ---------- Regexes ---------- */
  const actRegex  = /(\b[A-Z]?[a-zA-Z&\-\s]{2,}?\s+act\s+of\s+\d{4}\b)|(\b[A-Z]?[a-zA-Z&\-\s]{2,}?\s+act,\s+\d{4}\b)|(\b[A-Z]?[a-zA-Z&\-\s]{2,}?\s+act\s+of\s+year\s+\d{4}\b)/gi;
  const ruleRegex = /\bsection\s+\w+\s+of\s+\w+\s+act,\s+\d{4}\b/gi;

  /* ---------- Build minimal UI early ---------- */
  const accent = getStored(STORAGE_KEYS.color, DEFAULT_ACCENT);
  const initialWidth = getStored(STORAGE_KEYS.width, DEFAULT_WIDTH);

  // inject CSS (accent applied to relevant controls)
  const css = document.createElement('style');
  css.textContent = `
:root{--la-accent:${accent};--la-bg:#fff;--la-fg:#0b1220;--la-muted:rgba(11,18,32,.6);--la-shadow:rgba(12,16,20,.12)}
@media(prefers-color-scheme:dark){:root{--la-bg:#07101a;--la-fg:#e6eef8;--la-muted:rgba(230,238,248,.7);--la-shadow:rgba(0,0,0,.6)}}
#la-toggle-tab{position:fixed;top:50%;right:0;transform:translateY(-50%);width:34px;height:80px;background:var(--la-accent);color:#fff;font-size:26px;font-weight:800;text-align:center;line-height:80px;border-radius:8px 0 0 8px;cursor:pointer;z-index:2147483650;box-shadow:0 8px 20px var(--la-shadow)}
@media(max-width:420px){#la-toggle-tab{width:30px;height:64px;line-height:64px}}
#la-sidebar{position:fixed;right:0;top:50%;transform:translate(100%,-50%);opacity:0;transition:transform .28s cubic-bezier(.2,.9,.2,1),opacity .28s;min-width:${MIN_WIDTH}px;width:${initialWidth}px;max-width:90vw;max-height:80vh;background:var(--la-bg);color:var(--la-fg);border-radius:12px 0 0 12px;box-shadow:0 12px 30px var(--la-shadow);display:flex;flex-direction:column;overflow:hidden;z-index:2147483647}
#la-sidebar.open{transform:translate(0,-50%);opacity:1}
#la-header{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1px solid rgba(0,0,0,.06)}
#la-title{font-weight:700;display:flex;gap:8px;align-items:center}
.la-dot{width:10px;height:10px;border-radius:50%;background:var(--la-accent)}
#la-controls{display:flex;gap:8px;align-items:center}
.la-btn{background:transparent;border:1px solid rgba(0,0,0,.08);padding:6px 10px;border-radius:8px;color:var(--la-fg);cursor:pointer;outline:none}
.la-btn:hover{background:var(--la-accent);color:#fff}
.la-btn.accent{border-color:var(--la-accent);color:var(--la-accent)}
.la-btn[disabled]{opacity:.45;cursor:not-allowed}
#la-list{flex:1 1 auto;overflow-y:auto;padding:10px}
.la-item{padding:8px 10px;border-radius:8px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center}
.la-item .meta{font-size:12px;color:var(--la-muted);margin-top:4px}
.pdf-btn{background:var(--la-accent);color:#fff;border:none;padding:6px 8px;border-radius:6px;cursor:pointer;margin-left:8px}
.small{font-size:13px;padding:4px 8px}
#la-footer{padding:8px 12px;border-top:1px solid rgba(0,0,0,.05);font-size:12px;color:var(--la-muted);display:flex;justify-content:space-between;align-items:center}
#la-accordion{padding:10px;border-top:1px solid rgba(0,0,0,.04)}
#la-accordion-toggle{display:flex;gap:8px;cursor:pointer;user-select:none}
#la-accordion-content{overflow:hidden;max-height:0;transition:max-height .28s cubic-bezier(.2,.9,.2,1);padding-top:8px}
.icon-muted{opacity:.7}
`;
  document.head.appendChild(css);

  // toggle tab (create early)
  const toggleTab = document.createElement('div');
  toggleTab.id = 'la-toggle-tab';
  toggleTab.textContent = '‹';
  toggleTab.style.background = accent;
  document.body.appendChild(toggleTab);

  // sidebar container
  const panel = document.createElement('aside');
  panel.id = 'la-sidebar';
  document.body.appendChild(panel);

  // header
  const header = document.createElement('div'); header.id = 'la-header';
  header.innerHTML = `<div id="la-title"><span class="la-dot"></span><span>Acts & Rules</span></div><div id="la-controls"></div>`;
  panel.appendChild(header);
  const controls = header.querySelector('#la-controls');

  // controls: OpenAll, settings, exclude, close
  const openAll = document.createElement('button'); openAll.className = 'la-btn small'; openAll.textContent = 'Open PDFs (0)'; openAll.disabled = true; controls.appendChild(openAll);
  const settingsBtn = document.createElement('button'); settingsBtn.className = 'la-btn small'; settingsBtn.innerHTML = '⚙'; controls.appendChild(settingsBtn);
  const excludeBtn = document.createElement('button'); excludeBtn.className = 'la-btn small accent'; controls.appendChild(excludeBtn);
  const closeBtn = document.createElement('button'); closeBtn.className = 'la-btn small'; closeBtn.textContent = '✕'; controls.appendChild(closeBtn);

  // list
  const list = document.createElement('div'); list.id = 'la-list'; panel.appendChild(list);

  // accordion (individual PDFs)
  const acc = document.createElement('div'); acc.id = 'la-accordion';
  acc.innerHTML = `<div id="la-accordion-toggle"><span id="la-arrow">►</span><span>View direct PDFs</span></div><div id="la-accordion-content"></div>`;
  panel.appendChild(acc);
  const accToggle = acc.querySelector('#la-accordion-toggle');
  const accContent = acc.querySelector('#la-accordion-content');

  // footer
  const foot = document.createElement('div'); foot.id = 'la-footer';
  foot.innerHTML = `<span class="small icon-muted">Alt+Shift+L to toggle</span><span class="small icon-muted">Polite queue</span>`;
  panel.appendChild(foot);

  /* ---------- Settings Modal ---------- */
const settingsModal = document.createElement('div');
settingsModal.style.cssText = `
  position: fixed; inset: 0;
  background: rgba(0,0,0,.4);
  display: none; align-items: center; justify-content: center;
  z-index: 2147483648;
`;
settingsModal.innerHTML = `
  <div id="la-settings-box" style="
      background: var(--la-bg);
      color: var(--la-fg);
      min-width: 280px; max-width: 90vw;
      border-radius: 12px;
      box-shadow: 0 10px 40px var(--la-shadow);
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
  ">
    <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 6px;">Sidebar Settings</h2>

    <label style="display: flex; flex-direction: column; gap: 4px;">
      <span>Accent Color (Hex)</span>
      <input type="color" id="la-color-picker" style="height: 34px; border-radius: 8px; border: 1px solid var(--la-muted);" />
    </label>

    <label style="display: flex; flex-direction: column; gap: 4px;">
      <span>Font Family</span>
      <select id="la-font-select" style="height: 34px; border-radius: 8px; border: 1px solid var(--la-muted); padding: 4px;">
        <option value="system-ui">System Default</option>
        <option value="Arial, sans-serif">Arial</option>
        <option value="Georgia, serif">Georgia</option>
        <option value="'Segoe UI', sans-serif">Segoe UI</option>
        <option value="'Courier New', monospace">Courier New</option>
      </select>
    </label>

    <label style="display: flex; flex-direction: column; gap: 4px;">
      <span>Sidebar Position</span>
      <select id="la-pos-select" style="height: 34px; border-radius: 8px; border: 1px solid var(--la-muted); padding: 4px;">
        <option value="right">Right</option>
        <option value="left">Left</option>
        <option value="top">Top</option>
        <option value="bottom">Bottom</option>
      </select>
    </label>

    <div style="display:flex; justify-content: flex-end; gap: 8px; margin-top: 10px;">
      <button id="la-save-btn" class="la-btn accent small">Save</button>
      <button id="la-cancel-btn" class="la-btn small">Cancel</button>
    </div>
  </div>
`;
document.body.appendChild(settingsModal);

const colorPicker = settingsModal.querySelector('#la-color-picker');
const fontSelect  = settingsModal.querySelector('#la-font-select');
const posSelect   = settingsModal.querySelector('#la-pos-select');
const saveBtn     = settingsModal.querySelector('#la-save-btn');
const cancelBtn   = settingsModal.querySelector('#la-cancel-btn');

/* Load current values */
function loadSettingsUI(){
  const accent = getStored(STORAGE_KEYS.color, DEFAULT_ACCENT);
  const font   = getStored('la_font_family', 'system-ui');
  const pos    = getStored(STORAGE_KEYS.pos, 'right');
  colorPicker.value = accent.startsWith('#') ? accent : '#ff8a00';
  fontSelect.value = font;
  posSelect.value = pos;
}

/* Apply live preview changes */
colorPicker.addEventListener('input', e => {
  document.documentElement.style.setProperty('--la-accent', e.target.value);
  toggleTab.style.background = e.target.value;
});
fontSelect.addEventListener('change', e => {
  panel.style.fontFamily = e.target.value;
});
posSelect.addEventListener('change', e => {
  applySidebarPosition(e.target.value);
});

/* Position helper */
function applySidebarPosition(pos){
  setStored(STORAGE_KEYS.pos, pos);
  panel.style.top = ''; panel.style.bottom = ''; panel.style.left = ''; panel.style.right = '';
  if (pos === 'left'){ panel.style.left = '0'; panel.style.transform = 'translateX(-100%) translateY(-50%)'; panel.style.borderRadius = '0 12px 12px 0'; }
  else if (pos === 'right'){ panel.style.right = '0'; panel.style.transform = 'translateX(100%) translateY(-50%)'; panel.style.borderRadius = '12px 0 0 12px'; }
  else if (pos === 'top'){ panel.style.top = '0'; panel.style.left = '50%'; panel.style.transform = 'translateX(-50%) translateY(-100%)'; panel.style.borderRadius = '0 0 12px 12px'; }
  else if (pos === 'bottom'){ panel.style.bottom = '0'; panel.style.left = '50%'; panel.style.transform = 'translateX(-50%) translateY(100%)'; panel.style.borderRadius = '12px 12px 0 0'; }
}

/* Open/Close modal */
settingsBtn.addEventListener('click', () => {
  loadSettingsUI();
  settingsModal.style.display = 'flex';
});
cancelBtn.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});
settingsModal.addEventListener('click', e => {
  if (e.target === settingsModal) settingsModal.style.display = 'none';
});

/* Save handler */
saveBtn.addEventListener('click', () => {
  const newAccent = colorPicker.value;
  const newFont   = fontSelect.value;
  const newPos    = posSelect.value;

  setStored(STORAGE_KEYS.color, newAccent);
  setStored('la_font_family', newFont);
  setStored(STORAGE_KEYS.pos, newPos);

  document.documentElement.style.setProperty('--la-accent', newAccent);
  toggleTab.style.background = newAccent;
  panel.style.fontFamily = newFont;
  applySidebarPosition(newPos);

  settingsModal.style.display = 'none';
});

  /* ---------- Small UI helpers ---------- */
  function updateExcludeBtnText() {
    const excluded = getStored(STORAGE_KEYS.excluded, []);
    excludeBtn.textContent = excluded.includes(HOST) ? 'Re-enable' : 'Exclude';
  }
  updateExcludeBtnText();

  excludeBtn.addEventListener('click', () => {
    let arr = getStored(STORAGE_KEYS.excluded, []);
    if (!Array.isArray(arr)) arr = [];
    if (arr.includes(HOST)) arr = arr.filter(h => h !== HOST);
    else arr.push(HOST);
    setStored(STORAGE_KEYS.excluded, arr);
    updateExcludeBtnText();
    alert('Reload to apply exclusion change.');
  });

  closeBtn.addEventListener('click', () => { hideSidebar(); });

  /* ---------- Toggle behavior & lazy boot ---------- */
  let openedOnce = false;
  toggleTab.addEventListener('click', () => {
    if (panel.classList.contains('open')) hideSidebar();
    else showSidebar();
  });

  // keyboard toggle Alt+Shift+L
  window.addEventListener('keydown', e => {
    if (e.altKey && e.shiftKey && e.key.toUpperCase() === 'L') {
      if (panel.classList.contains('open')) hideSidebar(); else showSidebar();
    }
  });

  function showSidebar(){
    panel.classList.add('open'); toggleTab.style.display = 'none';
    if (!openedOnce) { openedOnce = true; startScanAndFetch(); }
  }
  function hideSidebar(){
    panel.classList.remove('open'); toggleTab.style.display = 'flex';
  }

  /* ---------- Extraction (runs on-demand) ---------- */
  function extractUniqueMatches(){
    const text = (document.body && document.body.innerText) ? document.body.innerText.replace(/\s+/g,' ') : '';
    const acts = [...text.matchAll(actRegex)].map(m => (m[0]||'').trim());
    const rules = [...text.matchAll(ruleRegex)].map(m => (m[0]||'').trim());
    const seen = new Map();
    for(const r of [...acts, ...rules]){ const k = r.toLowerCase(); if(!seen.has(k)) seen.set(k,r); }
    return [...seen.values()];
  }

  /* ---------- Queued fetcher (limited concurrency) ---------- */
  function createQueue(maxConcurrent){
    const q = []; let running = 0;
    const next = () => {
      if (running >= maxConcurrent || q.length === 0) return;
      const job = q.shift(); running++;
      job.fn().then(res => { try { job.resolve(res); } catch(e) {} })
         .catch(err => { try{ job.reject(err); }catch{} })
         .finally(()=>{ running--; next(); });
    };
    return {
      push: (fn) => new Promise((resolve, reject) => { q.push({fn, resolve, reject}); next(); })
    };
  }
  const fetchQueue = createQueue(FETCH_CONCURRENCY);

  /* ---------- PDF lookup using Google search HTML (best-effort) ---------- */
  function fetchPdfForQuery(query){
    return fetchQueue.push(() => new Promise(res => {
      const url = `https://www.google.com/search?q=${encodeURIComponent(query + ' pdf')}`;
      try {
        GM_xmlhttpRequest({
          method: 'GET',
          url,
          headers: { 'User-Agent': navigator.userAgent, 'Accept': 'text/html' },
          onload: r => {
            const html = r.responseText || '';
            // tolerant pdf url match
            const m = html.match(/https?:\/\/[^"'>\s]+?\.pdf\b/i);
            if (m) {
              const pdfUrl = m[0].replace(/\\u0026/g,'&');
              res({ type: 'pdf', url: pdfUrl });
            } else {
              res({ type: 'search', url });
            }
          },
          onerror: ()=> res({ type: 'search', url }),
          timeout: 15000
        });
      } catch (e) {
        res({ type: 'search', url });
      }
    }));
  }

  /* ---------- Fill UI with placeholders and then fetch PDFs ---------- */
  async function startScanAndFetch(){
    list.innerHTML = ''; accContent.innerHTML = '';
    const matches = extractUniqueMatches();
    if (!matches.length) { list.innerHTML = '<div class="la-item">No acts/rules found on this page.</div>'; return; }

    // create placeholders quickly using fragment
    const frag = document.createDocumentFragment();
    const items = []; // will hold {q, node, statusNode, pdfBtn}
    for (const q of matches){
      const node = document.createElement('div'); node.className = 'la-item';
      const left = document.createElement('div'); left.style.flex='1 1 auto';
      left.innerHTML = `<div class="title">${escapeHtml(q)}</div><div class="meta">Looking for PDF…</div>`;
      const right = document.createElement('div'); right.style.display='flex'; right.style.alignItems='center';
      const pdfBtn = document.createElement('button'); pdfBtn.className = 'pdf-btn'; pdfBtn.textContent = '…'; pdfBtn.disabled = true;
      right.appendChild(pdfBtn);
      node.appendChild(left); node.appendChild(right);
      frag.appendChild(node);
      items.push({q, node, left, pdfBtn});
      // clicking item highlights on page (existing behavior)
      node.addEventListener('click', (e)=> { if(e.target === pdfBtn) return; highlightLaw(q); }, {passive:true});
    }
    list.appendChild(frag);

    // Now fetch PDFs one by one (queued)
    const pdfList = [];
    for (const it of items){
      try {
        const r = await fetchPdfForQuery(it.q);
        // update UI
        const meta = it.left.querySelector('.meta');
        if (r.type === 'pdf') {
          meta.textContent = 'Direct PDF found';
          it.pdfBtn.textContent = 'Open PDF';
          it.pdfBtn.disabled = false;
          it.pdfBtn.onclick = (ev) => { ev.stopPropagation(); window.open(r.url, '_blank'); };
          // add to accordion
          const a = document.createElement('div'); a.className = 'la-item'; a.innerHTML = `<a href="${r.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(it.q)}</a>`;
          accContent.appendChild(a);
          pdfList.push(r.url);
        } else {
          meta.textContent = 'No direct PDF found — open Google search';
          it.pdfBtn.textContent = 'Open search';
          it.pdfBtn.disabled = false;
          it.pdfBtn.onclick = (ev) => { ev.stopPropagation(); window.open(r.url, '_blank'); };
        }
      } catch (e) {
        const meta = it.left.querySelector('.meta');
        meta.textContent = 'Lookup failed';
        it.pdfBtn.textContent = 'Retry';
        it.pdfBtn.disabled = false;
        it.pdfBtn.onclick = (ev) => { ev.stopPropagation(); startSingleRetry(it); };
      }
      updateOpenAllButton(pdfList);
    }
    // finalize accordion state
    if (accContent.children.length === 0) accContent.textContent = 'No direct PDFs found.';
  }

  async function startSingleRetry(item) {
    item.pdfBtn.disabled = true; item.pdfBtn.textContent = '…';
    const r = await fetchPdfForQuery(item.q);
    const meta = item.left.querySelector('.meta');
    if (r.type === 'pdf') {
      meta.textContent = 'Direct PDF found';
      item.pdfBtn.textContent = 'Open PDF'; item.pdfBtn.disabled = false;
      item.pdfBtn.onclick = (ev) => { ev.stopPropagation(); window.open(r.url, '_blank'); };
      const a = document.createElement('div'); a.className = 'la-item'; a.innerHTML = `<a href="${r.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.q)}</a>`;
      accContent.appendChild(a);
    } else {
      meta.textContent = 'No direct PDF found — open Google search';
      item.pdfBtn.textContent = 'Open search'; item.pdfBtn.disabled = false;
      item.pdfBtn.onclick = (ev) => { ev.stopPropagation(); window.open(r.url, '_blank'); };
    }
    // update open all
    const urls = Array.from(accContent.querySelectorAll('a')).map(a => a.href);
    updateOpenAllButton(urls);
  }

  function updateOpenAllButton(urls){
    const count = urls.length;
    openAll.textContent = `Open PDFs (${count})`;
    openAll.disabled = count === 0;
    openAll._pdfUrls = urls;
  }

  // batch open (polite queue)
  openAll.addEventListener('click', async () => {
    const urls = openAll._pdfUrls || [];
    if (!urls.length) return;
    if (!confirm(`Open ${urls.length} PDF(s) in new tabs?`)) return;
    let blocked = false;
    for (const u of urls) {
      const w = window.open(u, '_blank');
      if (!w) blocked = true;
      await new Promise(r=>setTimeout(r, OPEN_DELAY_MS));
    }
    if (blocked) alert('Some tabs were blocked by the browser. Allow popups or open individually.');
  });

  // accordion toggle
  let accOpen = false;
  accToggle.addEventListener('click', ()=>{
    accOpen = !accOpen;
    accToggle.firstElementChild.style.transform = accOpen ? 'rotate(90deg)' : 'none';
    accContent.style.maxHeight = accOpen ? accContent.scrollHeight + 'px' : '0';
  });

  /* ---------- Highlight logic (kept minimal) ---------- */
  let highlightedElements = [];
  let currentHighlightIndex = -1;
  function clearHighlighting(){
    highlightedElements.forEach(el => el.classList.remove('la-highlight'));
    highlightedElements = []; currentHighlightIndex = -1; document.body.classList.remove('la-sidebar-highlight');
  }
  function highlightLaw(lawStr){
    clearHighlighting();
    if(!lawStr) return;
    const lower = lawStr.toLowerCase();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node){
        if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
        if (node.nodeValue.toLowerCase().includes(lower)) {
          if (node.parentElement && !panel.contains(node.parentElement) && !node.parentElement.closest('#la-sidebar')) return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      }
    });
    while (walker.nextNode()){
      const node = walker.currentNode;
      const idx = node.nodeValue.toLowerCase().indexOf(lower);
      if (idx >= 0){
        const before = node.nodeValue.substring(0, idx);
        const matchText = node.nodeValue.substring(idx, idx + lawStr.length);
        const after = node.nodeValue.substring(idx + lawStr.length);
        const parent = node.parentNode;
        const span = document.createElement('span'); span.className = 'la-highlight'; span.textContent = matchText;
        parent.insertBefore(document.createTextNode(before), node);
        parent.insertBefore(span, node);
        parent.insertBefore(document.createTextNode(after), node);
        parent.removeChild(node);
        highlightedElements.push(span);
      }
    }
    if (highlightedElements.length > 0) {
      currentHighlightIndex = 0;
      highlightedElements[0].scrollIntoView({behavior:'smooth', block:'center'});
      document.body.classList.add('la-sidebar-highlight');
    } else {
      console.info(`No occurrences visible for "${lawStr}"`);
    }
  }

  /* ---------- Draggable & snap behavior (unchanged) ---------- */
  // allow dragging by header or panel
  let isDragging = false; let dragOffset = {x:0,y:0};
  panel.style.cursor = 'grab';
  panel.addEventListener('mousedown', e => {
    if (e.target.closest('#la-header') || e.target === panel) {
      isDragging = true;
      const r = panel.getBoundingClientRect();
      dragOffset.x = e.clientX - r.left;
      dragOffset.y = e.clientY - r.top;
      panel.style.cursor = 'grabbing'; document.body.style.userSelect = 'none';
    }
  });
  window.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false; panel.style.cursor = 'grab'; document.body.style.userSelect = '';
    // snap to nearest edge (left/right/top/bottom)
    const rect = panel.getBoundingClientRect();
    const winW = window.innerWidth, winH = window.innerHeight;
    const distances = { left: rect.left, right: winW - rect.right, top: rect.top, bottom: winH - rect.bottom };
    let minEdge = 'right', minDist = distances.right;
    for (const [k,v] of Object.entries(distances)) { if (v < minDist) { minEdge = k; minDist = v; } }
    // apply snapping by toggling transform/position — keep it simple: hide then show anchored to chosen edge
    if (minEdge === 'left') { panel.style.right = 'auto'; panel.style.left = '0'; panel.style.transform = 'translateX(0) translateY(-50%)'; panel.style.top = '50%'; panel.style.borderRadius = '0 12px 12px 0'; }
    else if (minEdge === 'right') { panel.style.left = 'auto'; panel.style.right = '0'; panel.style.transform = 'translateX(0) translateY(-50%)'; panel.style.top = '50%'; panel.style.borderRadius = '12px 0 0 12px'; }
    else if (minEdge === 'top') { panel.style.left = '50%'; panel.style.top = '0'; panel.style.transform = 'translateX(-50%) translateY(0)'; panel.style.width = '90vw'; panel.style.borderRadius = '0 0 12px 12px'; }
    else if (minEdge === 'bottom') { panel.style.left = '50%'; panel.style.top = 'auto'; panel.style.bottom = '0'; panel.style.transform = 'translateX(-50%) translateY(0)'; panel.style.width = '90vw'; panel.style.borderRadius = '12px 12px 0 0'; }
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    const newLeft = e.clientX - dragOffset.x;
    const newTop = e.clientY - dragOffset.y;
    const boundedLeft = Math.min(window.innerWidth - panel.offsetWidth, Math.max(0, newLeft));
    const boundedTop = Math.min(window.innerHeight - panel.offsetHeight, Math.max(0, newTop));
    panel.style.left = boundedLeft + 'px'; panel.style.top = boundedTop + 'px';
    // while dragging, disable the translate(100%) closed transform
    panel.style.transform = 'translateX(0) translateY(0)';
  });

  /* ---------- Responsive adjustments for small screens ---------- */
  function applyResponsiveSmall() {
    if (window.innerWidth <= 420) {
      toggleTab.style.width = '30px'; toggleTab.style.height = '64px'; toggleTab.style.lineHeight = '64px';
      panel.style.minWidth = MIN_WIDTH + 'px';
    } else {
      toggleTab.style.width = '34px'; toggleTab.style.height = '80px'; toggleTab.style.lineHeight = '80px';
      panel.style.minWidth = MIN_WIDTH + 'px';
    }
  }
  applyResponsiveSmall();
  window.addEventListener('resize', applyResponsiveSmall);

  /* ---------- Persist accent + width when user changes later (simple controls could be added) ---------- */
  // (kept minimal: coloring already derived from storage; user can update in future iterations)

  /* ---------- End of script ---------- */
})();
