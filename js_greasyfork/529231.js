// ==UserScript==
// @name         Single-Seed Album Collector v2
// @description  Collect single-seed FLAC torrents on OPS with fine-grained filters & a nicer UI.
// @match        *://*/better.php?method=single*
// @version      2.0
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/529231/Single-Seed%20Album%20Collector%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/529231/Single-Seed%20Album%20Collector%20v2.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* Settings & state */
  const d              = document;
  const SKEY           = 'opa_albumCollectorSettings_v2';
  const PKEY           = 'opa_albumCollectorPresets';
  const DEFAULTS       = {
    minSize : 400,
    maxSize : 500,
    maxPages: 50,
    target  : 20,
    relTypes: ['Album'],
    tagFilter: '',
    uploader : '',
    copyMode : 'group', // 'group' | 'download'
    autoCopy : true,
    autoStart: false
  };

  let settings  = { ...DEFAULTS, ...(GM_getValue(SKEY) || {}) };
  let presets   = GM_getValue(PKEY) || { "Default": { ...DEFAULTS } };
  let albumLinks = [];
  let debugLines = [];
  let pageCount  = 0;
  let running    = false;
  let currentDoc = d;
  let stats      = {
    totalCollected: GM_getValue('ac_stats_total') || 0,
    lastRunTime: 0
  };

  /* Utility helpers */
  const $ = (sel, ctx = d) => ctx.querySelector(sel);
  const $$= (sel, ctx = d) => Array.from(ctx.querySelectorAll(sel));
  const log = (...msg) => {
    debugLines.push(msg.join(' '));
    if (debugLines.length > 200) debugLines.splice(0, debugLines.length - 200);
    ui.debug.value = debugLines.join('\n');
  };
  const save = ()        => GM_setValue(SKEY, settings);
  const savePresets = () => GM_setValue(PKEY, presets);
  const num  = (el)      => parseFloat(el.value) || 0;
  const sleep= ms        => new Promise(r => setTimeout(r, ms));
  const notify = (message, title = "Album Collector") => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification(title, { body: message });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(title, { body: message });
        }
      });
    }
  };

/* UI styles */
const html = /*html*/`
<style>
  :root {
    --ac-bg: #fff;
    --ac-fg: #1a1a1a;
    --ac-input-bg: #f5f5f5;
    --ac-input-border: #e0e0e0;
    --ac-accent: #4a90e2;
    --ac-btn-bg: #f5f5f5;
    --ac-btn-hover: #e9e9e9;
  }
  :root.ac-dark-mode {
    --ac-bg: #1e1e1e;
    --ac-fg: #f0f0f0;
    --ac-input-bg: #2d2d2d;
    --ac-input-border: #444;
    --ac-accent: #5d93ff;
    --ac-btn-bg: #333;
    --ac-btn-hover: #444;
  }
  #acPanel {
    position: fixed;
    top: 40px;
    right: 20px;
    width: 380px;
    max-height: 90vh;
    background: var(--ac-bg);
    color: var(--ac-fg);
    border: none;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    font: 13px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.2s ease;
  }
  #acPanel.collapsed {
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }
  #acPanel.collapsed>*:not(h3) {
    display: none;
  }
  #acPanel h3 {
    margin: 0;
    padding: 14px 16px;
    cursor: move;
    background: var(--ac-accent);
    color: white;
    font-size: 15px;
    font-weight: 600;
    border-radius: 12px 12px 0 0;
    user-select: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .ac-header-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .ac-icon-btn {
    cursor: pointer;
    font-size: 16px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s;
  }
  .ac-icon-btn:hover {
    background: rgba(255,255,255,0.2);
  }
  #acPanel .row {
    display: flex;
    gap: 10px;
    margin: 12px 16px;
    align-items: flex-start;
  }
  /* Specific styling for the second row with Release type and Copy as */
  #acPanel .row:nth-of-type(2) {
    gap: 16px; /* Increased gap between these elements */
  }
  #acRel {
    height: auto; /* Allow it to expand as needed */
    min-height: 80px; /* Increase the minimum height */
  }
  #acPanel label {
    font-weight: 500;
    font-size: 12px;
    color: var(--ac-fg);
    opacity: 0.9;
  }
  #acPanel input,
  #acPanel select,
  #acPanel textarea {
    margin-top: 4px;
    border-radius: 6px;
    border: 1px solid var(--ac-input-border);
    padding: 8px 10px;
    background: var(--ac-input-bg);
    color: var(--ac-fg);
    font-size: 13px;
    width: 100%;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  #acPanel input:focus,
  #acPanel select:focus,
  #acPanel textarea:focus {
    outline: none;
    border-color: var(--ac-accent);
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
  #acPanel input[type=number] {
    width: 100%;
  }
  #acPanel input[type=checkbox] {
    width: auto;
    margin-top: 0;
    margin-right: 5px;
  }
  #acPanel select {
    cursor: pointer;
    min-width: 100px;
  }
  #acPanel select[multiple] {
    padding: 6px;
  }
  #acCopyMode {
    width: 100%; /* Make it take full width of its container */
    min-width: 120px; /* Ensure minimum width */
  }
  #acPanel textarea {
    width: 100%;
    height: 120px;
    font: 12px/1.4 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    white-space: pre;
    resize: vertical;
    margin: 0 16px;
    width: calc(100% - 32px);
  }
  #acDebug {
    font-size: 11px;
    height: 90px;
    margin-bottom: 12px !important;
    opacity: 0.85;
  }
  #acLinks {
    margin-bottom: 6px !important;
  }
  #acProgress {
    height: 6px;
    background: var(--ac-input-bg);
    margin: 0 16px 12px;
    border-radius: 8px;
    overflow: hidden;
  }
  #acProgress > div {
    height: 100%;
    background: #4CAF50;
    width: 0%;
    transition: width 0.3s ease;
  }
  #acBtns {
    gap: 8px;
  }
  #acBtns button {
    flex: 1 1 0;
    background: var(--ac-btn-bg);
    color: var(--ac-fg);
    border: none;
    border-radius: 6px;
    padding: 10px 0;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  #acBtns button:hover {
    background: var(--ac-btn-hover);
  }
  #acStart {
    background: var(--ac-accent) !important;
    color: white !important;
  }
  #acStart:hover {
    filter: brightness(1.1);
  }
  #acStop {
    color: #e74c3c !important;
  }
  .ac-stats {
    margin: 0 16px 8px;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    opacity: 0.8;
  }
  .ac-presets-row {
    display: flex;
    align-items: center;
    margin: 0 16px 8px;
    gap: 6px;
  }
  .ac-preset-actions {
    display: flex;
    gap: 4px;
  }
  .ac-preset-actions button {
    font-size: 11px;
    background: var(--ac-btn-bg);
    border: none;
    border-radius: 4px;
    padding: 4px 6px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .ac-preset-actions button:hover {
    background: var(--ac-btn-hover);
  }
  #acPresetName {
    flex: 1;
    font-size: 12px;
    padding: 4px 8px;
  }
  #acPresetSelect {
    flex: 1;
  }
  /* Responsive design */
  @media (max-width: 768px) {
    #acPanel {
      width: 90vw;
      max-width: 380px;
      right: 5vw;
    }
  }
</style>
<div id="acPanel">
  <h3>Album Collector
    <div class="ac-header-actions">
      <span id="acDarkMode" class="ac-icon-btn" title="Toggle Dark Mode">🌓</span>
      <span id="acHelp" class="ac-icon-btn" title="Show Help">❔</span>
      <span id="acFold" class="ac-icon-btn" title="Collapse Panel">–</span>
    </div>
  </h3>
  <div class="ac-presets-row">
    <select id="acPresetSelect"></select>
    <div class="ac-preset-actions">
      <button id="acLoadPreset" title="Load selected preset">Load</button>
      <button id="acDeletePreset" title="Delete selected preset">Delete</button>
    </div>
  </div>
  <div class="ac-presets-row">
    <input type="text" id="acPresetName" placeholder="New preset name">
    <button id="acSavePreset" title="Save current settings as preset">Save</button>
  </div>
  <div class="row">
    <label style="flex:1">Min (MiB)<input id="acMin" type="number"></label>
    <label style="flex:1">Max (MiB)<input id="acMax" type="number"></label>
    <label style="flex:1">Max pages<input id="acPages" type="number"></label>
    <label style="flex:1">Target<input id="acTarget" type="number"></label>
  </div>
  <div class="row">
    <label style="flex:1.2">Release type
      <select id="acRel" multiple size="3">
        <option>Album</option><option>EP</option><option>Single</option>
        <option>Live</option><option>Compilation</option><option>Anthology</option>
        <option>Soundtrack</option>
      </select>
    </label>
    <label style="flex:0.8">Copy as
      <select id="acCopyMode">
        <option value="group">Group link</option>
        <option value="download">Direct DL</option>
      </select>
    </label>
  </div>
  <div class="row">
    <label style="flex:1">Tags (AND list, comma-sep)<input id="acTags"></label>
  </div>
  <div class="row">
    <label style="flex:1">Uploader (id or @user)<input id="acUploader"></label>
  </div>
  <div class="row">
    <label><input type="checkbox" id="acAutoStart">Auto-start on page load</label>
    <label><input type="checkbox" id="acAutoCopy">Auto-copy when done</label>
  </div>
  <div class="row" id="acBtns">
    <button id="acStart">Start</button>
    <button id="acStop">Stop</button>
    <button id="acCopy">Copy</button>
    <button id="acOpen">Open</button>
  </div>
  <div id="acProgress"><div></div></div>
  <div class="ac-stats">
    <div>Total collected: <span id="acStatTotal">0</span></div>
    <div>Last run: <span id="acStatTime">0s</span></div>
  </div>
  <textarea id="acLinks" readonly placeholder="Links will appear here..."></textarea>
  <textarea id="acDebug" readonly placeholder="Debug info will appear here..."></textarea>
</div>`;
  d.body.insertAdjacentHTML('beforeend', html);

  /* Panel dragging logic */
  (() => {
    const box = $('#acPanel'), head = $('h3', box);
    let sx = 0, sy = 0, dragging = false;
    let lastUpdate = 0;
    const THROTTLE = 16; // ~60fps

    head.addEventListener('mousedown', e => {
      if (e.target.closest('.ac-icon-btn')) return;
      dragging = true;
      sx = e.clientX - (parseInt(box.style.left) || box.offsetLeft);
      sy = e.clientY - (parseInt(box.style.top) || box.offsetTop);
      box.style.transition = 'none';
    });

    d.addEventListener('mousemove', e => {
      if (!dragging) return;

      const now = Date.now();
      if (now - lastUpdate < THROTTLE) return;

      window.requestAnimationFrame(() => {
        box.style.left = (e.clientX - sx) + 'px';
        box.style.top = (e.clientY - sy) + 'px';
        lastUpdate = now;
      });
    });

    d.addEventListener('mouseup', () => {
      if (dragging) {
        dragging = false;
        box.style.transition = 'all 0.2s ease';
      }
    });
  })();

  /* UI controls */
  $('#acFold').onclick = () => $('#acPanel').classList.toggle('collapsed');

  /* Dark mode toggle */
  const toggleDarkMode = () => {
    const html = d.documentElement;
    const isDark = html.classList.toggle('ac-dark-mode');
    GM_setValue('ac_dark_mode', isDark);
  };

  if (GM_getValue('ac_dark_mode')) {
    d.documentElement.classList.add('ac-dark-mode');
  }

  $('#acDarkMode').onclick = toggleDarkMode;

  /* Help dialog */
  $('#acHelp').onclick = () => {
    const helpText = `
Album Collector Help

• Filters albums by size, release type, tags, and uploader
• Min/Max: Size range in MiB
• Target: Number of albums to collect
• Max pages: Limit how many pages to scan
• Presets: Save your favorite configurations
• Keyboard shortcuts:
  - Alt+S: Start/Stop collection
  - Alt+C: Copy links
  - Alt+H: Hide/Show panel
`;
    alert(helpText);
  };

  /* UI reference */
  const ui = {
    min      : $('#acMin'),     max      : $('#acMax'),
    pages    : $('#acPages'),   target   : $('#acTarget'),
    rel      : $('#acRel'),     tags     : $('#acTags'),
    uploader : $('#acUploader'),copyMode : $('#acCopyMode'),
    autoStart: $('#acAutoStart'),autoCopy: $('#acAutoCopy'),
    presetSel: $('#acPresetSelect'),
    presetName: $('#acPresetName'),
    links    : $('#acLinks'),   debug    : $('#acDebug'),
    bar      : $('#acProgress>div'),
    statTotal: $('#acStatTotal'),
    statTime : $('#acStatTime')
  };

  /* Preset management */
  const populatePresets = () => {
    ui.presetSel.innerHTML = '';
    Object.keys(presets).forEach(name => {
      const opt = d.createElement('option');
      opt.value = name;
      opt.textContent = name;
      ui.presetSel.appendChild(opt);
    });
  };

  $('#acLoadPreset').onclick = () => {
    const name = ui.presetSel.value;
    if (!name || !presets[name]) return;
    settings = { ...settings, ...presets[name] };
    save();
    loadUI();
    log(`Loaded preset: ${name}`);
  };

  $('#acSavePreset').onclick = () => {
    const name = ui.presetName.value.trim();
    if (!name) return;

    readSettings();
    const presetData = {
      minSize: settings.minSize,
      maxSize: settings.maxSize,
      maxPages: settings.maxPages,
      target: settings.target,
      relTypes: settings.relTypes,
      tagFilter: settings.tagFilter,
      uploader: settings.uploader,
      copyMode: settings.copyMode
    };

    presets[name] = presetData;
    savePresets();
    populatePresets();

    // Select the newly created preset
    ui.presetSel.value = name;
    ui.presetName.value = '';
    log(`Saved preset: ${name}`);
  };

  $('#acDeletePreset').onclick = () => {
    const name = ui.presetSel.value;
    if (!name || !presets[name] || name === 'Default') return;

    if (confirm(`Delete preset "${name}"?`)) {
      delete presets[name];
      savePresets();
      populatePresets();
      log(`Deleted preset: ${name}`);
    }
  };

  /* Load settings into UI */
  const loadUI = () => {
    ui.min.value     = settings.minSize;
    ui.max.value     = settings.maxSize;
    ui.pages.value   = settings.maxPages;
    ui.target.value  = settings.target;
    ui.tags.value    = settings.tagFilter;
    ui.uploader.value= settings.uploader;
    ui.copyMode.value= settings.copyMode;
    ui.autoStart.checked = settings.autoStart;
    ui.autoCopy.checked = settings.autoCopy;
    $$('#acRel option').forEach(o => o.selected = settings.relTypes.includes(o.text));
    ui.statTotal.textContent = stats.totalCollected;
    ui.statTime.textContent = stats.lastRunTime ? `${stats.lastRunTime}s` : "-";
  };

  /* Update settings from UI */
  const readSettings = () => {
    settings.minSize  = num(ui.min);
    settings.maxSize  = num(ui.max);
    settings.maxPages = num(ui.pages);
    settings.target   = num(ui.target);
    settings.tagFilter= ui.tags.value.trim().toLowerCase();
    settings.uploader = ui.uploader.value.trim();
    settings.copyMode = ui.copyMode.value;
    settings.autoStart= ui.autoStart.checked;
    settings.autoCopy = ui.autoCopy.checked;
    settings.relTypes = $$('#acRel option:checked').map(o => o.text);
    save();
  };

  /* Row matching logic */
  const matchesRow = (row) => {
    const txt = row.textContent;
    /* uploader filter */
    if (settings.uploader) {
      const re = settings.uploader.startsWith('@')
        ? new RegExp(settings.uploader.slice(1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
        : new RegExp(`\\b${settings.uploader}\\b`);
      if (!re.test(txt)) return false;
    }
    /* release type */
    const relOK = settings.relTypes.some(type => new RegExp(`\\[\\d{4}\\s+${type}\\]`, 'i').test(txt));
    if (!relOK) return false;
    /* size */
    const size = parseFloat((/([\d.]+)\s*MiB/i.exec(txt)||[])[1]);
    if (!size || size < settings.minSize || size > settings.maxSize) return false;
    /* tag filter (AND logic) */
    if (settings.tagFilter) {
      const rowTags = ($('.tags', row)?.textContent || '').toLowerCase();
      const terms = settings.tagFilter.split(',').map(t => t.trim()).filter(Boolean);
      if (!terms.every(t => rowTags.includes(t))) return false;
    }
    return true;
  };

  /* Extract links from matched rows */
  const extractLink = (row) => {
    const a = row.querySelector(settings.copyMode === 'download'
      ? 'a[href*="action=download"]'
      : 'a[href*="torrentid="]');
    return a?.href || null;
  };

  /* Progress updating */
  const updateProgress = () => {
    ui.bar.style.width = Math.min(100, albumLinks.length / settings.target * 100) + '%';
    ui.links.value     = albumLinks.join('\n');
  };

  /* Page processing */
  async function processPage(doc, url) {
    log('Processing', url);
    $$('tr.torrent', doc).forEach(row => {
      if (!matchesRow(row)) return;
      const link = extractLink(row);
      if (link && !albumLinks.includes(link)) {
        albumLinks.push(link);
        log(' +', link);
      }
    });
    updateProgress();
  }

  /* Fetch page document */
  async function fetchDoc(url, tries = 3) {
    try {
      const res  = await fetch(url, { credentials: 'same-origin' });
      const html = await res.text();
      return new DOMParser().parseFromString(html, 'text/html');
    } catch (e) {
      if (tries > 0) { await sleep(1000); return fetchDoc(url, tries - 1); }
      log('Fetch failed:', url, e);
      return null;
    }
  }

  /* Main collection logic */
  async function run() {
    running = true;
    pageCount = 0;
    albumLinks = [];
    debugLines = [];
    ui.debug.value = '';
    const startTime = Date.now();

    currentDoc = d;
    let nextURL = location.href;

    while (running &&
           albumLinks.length < settings.target &&
           pageCount < settings.maxPages &&
           nextURL) {

      const doc = pageCount === 0 ? currentDoc : await fetchDoc(nextURL);
      if (!doc) break;
      await processPage(doc, nextURL);
      pageCount++;

      const next = $('a.pager_next', doc);
      nextURL = next ? next.href : null;
    }

    const runTime = Math.round((Date.now() - startTime) / 1000);
    stats.lastRunTime = runTime;
    stats.totalCollected += albumLinks.length;
    GM_setValue('ac_stats_total', stats.totalCollected);
    ui.statTotal.textContent = stats.totalCollected;
    ui.statTime.textContent = `${runTime}s`;

    log(`Done. Collected ${albumLinks.length} link(s) in ${pageCount} page(s).`);
    updateProgress();

    if (albumLinks.length > 0) {
      notify(`Collected ${albumLinks.length} albums in ${runTime}s`);
      if (settings.autoCopy) copyLinks();
    }

    running = false;
  }

  /* Stop collection */
  function stop() {
    running = false;
    log('Stopped by user.');
  }

  /* Copy links to clipboard */
  function copyLinks() {
  const text = albumLinks.join('\n');

  // Tampermonkey
  if (typeof GM_setClipboard === 'function') {
    GM_setClipboard(text);
    log('Copied to clipboard via GM_setClipboard.');
    return;
  }

  // Greasemonkey 4+
  if (typeof GM?.setClipboard === 'function') {
    GM.setClipboard(text);
    log('Copied to clipboard via GM.setClipboard.');
    return;
  }

  // Fallback to the modern Clipboard API
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => log('Copied to clipboard via navigator.clipboard.'))
      .catch(() => {
        // last‐ditch fallback
        ui.links.select();
        document.execCommand('copy');
        log('Fallback copy via execCommand.');
      });
    return;
  }

  // Ancient fallback
  ui.links.select();
  document.execCommand('copy');
  log('Copied to clipboard via execCommand (legacy).');
}

  /* Open all links in new tabs */
  function openLinks() {
    albumLinks.forEach(l => window.open(l, '_blank'));
  }

  /* Button handlers */
  $('#acStart').onclick = () => {
    if (running) return;
    readSettings();
    run();
  };
  $('#acStop' ).onclick = stop;
  $('#acCopy' ).onclick = copyLinks;
  $('#acOpen' ).onclick = openLinks;

  /* Save settings on input changes */
  $('#acPanel').addEventListener('input', e => {
    if (e.target.id !== 'acPresetName') readSettings();
  });

  /* Keyboard shortcuts */
  d.addEventListener('keydown', e => {
    if (!e.altKey) return;
    switch (e.key.toLowerCase()) {
      case 's': e.preventDefault(); running ? stop() : ($('#acStart').click()); break;
      case 'c': e.preventDefault(); copyLinks(); break;
      case 'h': e.preventDefault(); $('#acFold').click(); break;
    }
  });

  /* Initialize UI */
  loadUI();
  populatePresets();

  /* Auto-start if configured */
  if (settings.autoStart) {
    setTimeout(() => $('#acStart').click(), 500);
  }

})();