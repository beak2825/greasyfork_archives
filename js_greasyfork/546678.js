// ==UserScript==
// @name         Suno Extract
// @namespace    yaylists.suno.extract
// @version      2.0.0
// @description  Open each song page, scrape Title/Style/Lyrics, and return results to the playlist (CSV/JSON).
// @author       -
// @match        https://suno.com/playlist/*
// @match        https://www.suno.com/playlist/*
// @match        https://suno.com/song/*
// @match        https://www.suno.com/song/*
// @icon         https://suno.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546678/Suno%20Extract.user.js
// @updateURL https://update.greasyfork.org/scripts/546678/Suno%20Extract.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**************************************************************************
   * CONFIG: selectors you gave for the SONG PAGE (not the playlist sidebar)
   **************************************************************************/
  const SONG_SELECTORS = {
    // Title on the song page (keep this simple – Suno uses an <h1>)
    title: 'h1',

    // Style: your long path
    style: String.raw`#main-container > div.flex.h-full.w-full.flex-col.items-stretch.overflow-y-scroll.bg-background-primary.md\:px-4 > div.\@container.flex.flex-row.items-start.justify-stretch.gap-4.pb-8.max-md\:flex-col.md\:pt-8 > div.relative.flex.flex-1.flex-col.gap-2.self-stretch.max-md\:px-4 > div.my-2 > div`,

    // Lyrics: you pasted a <p>; we’ll read the WHOLE block that contains it
    // (join all paragraphs so nothing is lost).
    lyricsFirstP: String.raw`#main-container > div.flex.h-full.w-full.flex-col.items-stretch.overflow-y-scroll.bg-background-primary.md\:px-4 > div.w-full.flex-1.px-6.pb-48.md\:px-0 > div.flex.flex-row.gap-4 > div.min-w-0.flex-1 > section > div.font-sans.text-foreground-primary > p`,
    lyricsContainerClass: 'div.font-sans.text-foreground-primary'
  };

  /**************************************************************************
   * STATE (persist across page navigations)
   **************************************************************************/
  const K = {
    STATE: 'suno_extract_state',   // { running, origin, links[], i, results[] }
    RESULTS: 'suno_extract_results'
  };

  function getState() { return GM_getValue(K.STATE, null); }
  function setState(s) { GM_setValue(K.STATE, s); }
  function clearState() { GM_deleteValue(K.STATE); }
  function setResults(r) { GM_setValue(K.RESULTS, r); }
  function getResults() { return GM_getValue(K.RESULTS, null); }
  function clearResults() { GM_deleteValue(K.RESULTS); }

  /**************************************************************************
   * Utils
   **************************************************************************/
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const text = (el) => el ? (el.innerText || el.textContent || '').trim() : '';
  const toPath = (href) => new URL(href, location.origin).pathname;

  function uniqueByPath(anchors) {
    const seen = new Set();
    const out = [];
    for (const a of anchors) {
      const p = toPath(a.getAttribute('href') || a.href || '');
      if (!p || seen.has(p)) continue;
      seen.add(p); out.push(a);
    }
    return out;
  }

  async function waitFor(selector, { root = document, timeout = 6000, poll = 100 } = {}) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const el = $(selector, root);
      if (el) return el;
      await sleep(poll);
    }
    return null;
  }

  function escapeHtml(s='') {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  /**************************************************************************
   * Progress badge (visible on song + playlist pages while running)
   **************************************************************************/
  GM_addStyle(`
    .se-badge {
      position: fixed; left: 16px; bottom: 16px; z-index: 999999;
      background: #111; color: #fff; border: 1px solid #444; border-radius: 10px;
      padding: 8px 10px; font: 700 12px system-ui; box-shadow: 0 6px 20px rgba(0,0,0,.35);
      opacity: .95;
    }
    .se-btn{position:fixed;right:16px;bottom:16px;z-index:999999;background:#111;color:#fff;border:1px solid #444;
      padding:10px 14px;border-radius:10px;cursor:pointer;font:600 13px system-ui;box-shadow:0 6px 20px rgba(0,0,0,.35)}
    .se-btn:hover{background:#1b1b1b}
    .se-ov{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:999998;display:none}
    .se-md{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(1200px,96vw);height:min(80vh,900px);
      background:#0d0f12;color:#e8e8e8;border:1px solid #2a2f37;border-radius:14px;z-index:999999;display:none;overflow:hidden}
    .se-hd{display:flex;justify-content:space-between;gap:8px;padding:12px 14px;border-bottom:1px solid #222831;background:#0b0d10}
    .se-tt{font-weight:700}
    .se-act{display:flex;gap:8px}
    .se-act button{background:#141820;color:#e8e8e8;border:1px solid #2b313b;border-radius:8px;padding:7px 10px;cursor:pointer;font-weight:600}
    .se-bd{height:calc(100% - 52px);overflow:auto;padding:12px 14px}
    .se-tbl{width:100%;border-collapse:collapse;table-layout:fixed;font-size:13px}
    .se-tbl th,.se-tbl td{border:1px solid #2a2f37;padding:8px;vertical-align:top;white-space:pre-wrap;overflow-wrap:anywhere}
    .se-tbl th{background:#0f141b;position:sticky;top:0}
  `);

  function showBadge(txt) {
    let b = document.getElementById('se-badge');
    if (!b) {
      b = document.createElement('div');
      b.id = 'se-badge'; b.className = 'se-badge';
      document.body.appendChild(b);
    }
    b.textContent = txt;
  }
  function hideBadge() {
    const b = document.getElementById('se-badge');
    if (b) b.remove();
  }

  /**************************************************************************
   * Results modal (shown when we return to the playlist)
   **************************************************************************/
  function mountResultsUI() {
    if (document.getElementById('se-btn')) return;
    const b = document.createElement('button');
    b.id = 'se-btn';
    b.className = 'se-btn';
    b.textContent = 'Suno Extract';
    b.onclick = startFromPlaylist;
    document.body.appendChild(b);

    const ov = document.createElement('div');
    ov.id = 'se-ov'; ov.className = 'se-ov';
    ov.onclick = () => { ov.style.display='none'; md.style.display='none'; };

    const md = document.createElement('div');
    md.id = 'se-md'; md.className = 'se-md';
    md.innerHTML = `
      <div class="se-hd">
        <div class="se-tt">Suno Extract — Results</div>
        <div class="se-act">
          <button id="se-csv">Copy CSV</button>
          <button id="se-json">Copy JSON</button>
          <button id="se-close">Close</button>
        </div>
      </div>
      <div class="se-bd">
        <table class="se-tbl" id="se-tbl"><thead>
          <tr><th style="width:48px;">#</th><th style="width:28%;">Title</th><th style="width:28%;">Style</th><th>Lyrics</th></tr>
        </thead><tbody></tbody></table>
      </div>`;
    document.body.append(ov, md);

    document.getElementById('se-close').onclick = () => { ov.style.display='none'; md.style.display='none'; };
    document.getElementById('se-csv').onclick = () => copyCSV(window.__seRows || []);
    document.getElementById('se-json').onclick = () => copyJSON(window.__seRows || []);
  }

  function showResults(rows) {
    window.__seRows = rows || [];
    const ov = document.getElementById('se-ov');
    const md = document.getElementById('se-md');
    const tb = document.querySelector('#se-tbl tbody');
    tb.innerHTML = '';
    window.__seRows.forEach((r,i)=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i+1}</td>
        <td>${escapeHtml(r.title||'')}</td>
        <td>${escapeHtml(r.style||'')}</td>
        <td>${escapeHtml(r.lyrics||'')}</td>`;
      tb.appendChild(tr);
    });
    ov.style.display='block'; md.style.display='block';
  }

  function toCSV(rows){
    const esc = (v) => `"${(v??'').toString().replace(/"/g,'""')}"`;
    return ['index,title,style,lyrics']
      .concat(rows.map((r,i)=>[i+1,esc(r.title),esc(r.style),esc(r.lyrics)].join(',')))
      .join('\n');
  }
  async function copyCSV(rows){ await navigator.clipboard.writeText(toCSV(rows)); }
  async function copyJSON(rows){ await navigator.clipboard.writeText(JSON.stringify(rows,null,2)); }

  /**************************************************************************
   * PLAYLIST PAGE: collect links and start the run
   **************************************************************************/
  function collectPlaylistSongLinks() {
    // All /song/* anchors visible in the playlist column.
    // We exclude links inside any right-side detail panel by geometric filter.
    const all = $$('a[href^="/song/"], a[href^="https://suno.com/song/"]');
    const uniq = uniqueByPath(all);

    // Keep left-column items: their center x is usually in the left 70% of the viewport.
    const w = window.innerWidth;
    const rows = uniq
      .map(a => ({ a, rect: a.getBoundingClientRect() }))
      .filter(x => (x.rect.left + x.rect.right) / 2 < w * 0.75)
      .sort((A,B) => A.rect.top - B.rect.top)
      .map(x => toPath(x.a.getAttribute('href') || x.a.href || ''));

    return rows;
  }

  async function startFromPlaylist() {
    const links = collectPlaylistSongLinks();
    if (!links.length) { alert('No songs found. Scroll the playlist so items render, then try again.'); return; }

    const origin = location.href;
    const state = { running: true, origin, links, i: 0, results: [] };
    setState(state);
    setResults([]);           // clear any previous run
    showBadge(`Suno Extract: going to song 1/${links.length}`);
    location.href = links[0]; // go to first song page
  }

  /**************************************************************************
   * SONG PAGE: scrape then go to next
   **************************************************************************/
  async function scrapeSongPageAndAdvance() {
    const st = getState();
    if (!st || !st.running) return;

    const total = st.links.length;
    showBadge(`Suno Extract: scraping ${st.i+1}/${total}`);

    // Wait for title/style/lyrics to appear
    const titleEl = await waitFor(SONG_SELECTORS.title, { timeout: 8000 });
    const styleEl = await waitFor(SONG_SELECTORS.style, { timeout: 8000 });
    const firstP  = await waitFor(SONG_SELECTORS.lyricsFirstP, { timeout: 8000 });

    let title = text(titleEl);
    let style = text(styleEl);
    let lyrics = '';

    if (firstP) {
      // Read the whole lyrics container (all paragraphs)
      const block = firstP.closest(SONG_SELECTORS.lyricsContainerClass) || firstP.parentElement;
      lyrics = text(block);
    }

    st.results.push({ title, style, lyrics });
    setResults(st.results);

    st.i += 1;
    setState(st);

    if (st.i < st.links.length) {
      showBadge(`Suno Extract: going to song ${st.i+1}/${total}`);
      location.href = st.links[st.i];
    } else {
      // Done: go back to playlist and show results
      st.running = false;
      setState(st);
      showBadge('Suno Extract: done, returning to playlist…');
      location.href = st.origin;
    }
  }

  /**************************************************************************
   * When we return to the playlist, show the results and clean up state
   **************************************************************************/
  function maybeShowResultsOnPlaylist() {
    const st = getState();
    const rows = getResults();

    // Only show if we finished (running=false) and have rows
    if (rows && rows.length && (!st || !st.running)) {
      mountResultsUI();
      showResults(rows);
      hideBadge();
      clearState();
      clearResults();
    }
  }

  /**************************************************************************
   * Boot logic per page type
   **************************************************************************/
  function onPlaylistPage() {
    mountResultsUI();
    // If a run is in progress, show a badge
    const st = getState();
    if (st && st.running) {
      showBadge(`Suno Extract: queued ${st.links.length} songs…`);
    } else {
      hideBadge();
    }
    // If we have results from a completed run, show them
    maybeShowResultsOnPlaylist();
  }

  function onSongPage() {
    const st = getState();
    if (st && st.running) {
      scrapeSongPageAndAdvance();
    } else {
      hideBadge();
    }
  }

  // Router
  const isPlaylist = /\/playlist\//.test(location.pathname);
  const isSong = /\/song\//.test(location.pathname);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (isPlaylist) onPlaylistPage();
      else if (isSong) onSongPage();
    }, { once: true });
  } else {
    if (isPlaylist) onPlaylistPage();
    else if (isSong) onSongPage();
  }
})();
