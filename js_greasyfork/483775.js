// ==UserScript==
// @name         qBittorrent Selected Size + Count
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Show selected torrent count and total size in qBittorrent WebUI footer (old/new versions)
// @match http://localhost:8080/*
// @author       me + others
// @run-at       document-idle
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/483775/qBittorrent%20Selected%20Size%20%2B%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/483775/qBittorrent%20Selected%20Size%20%2B%20Count.meta.js
// ==/UserScript==

/*
  Notes:
  - !!! Make sure to adjust the @match above to your WebUI address if needed !!!
  - This version was adjusted by ChatGPT in October 2025 and is confirmed to work on qBittorrent WebUI v5.0.4 - v5.1.2
  - Adds selected torrent count alongside the total size
  - Updates original v0.5 logic to get full old + new WebUI compatibility (#statusBar + #desktopFooter)
  - Replaces 1s polling with debounced MutationObservers (lightweight, real-time)
  - Dynamically detects “Size” column instead of hard-coded index (future-proof)
  - Accurate byte-based math replaces mixed-unit summation
  - Enhanced lightweight multi-language label detection (one time at startup, no performance cost)
  - Keeps English size units (KiB, MiB, GiB, TiB) for reliable parsing across locales
  - Privacy checked to be safe and running 100% locally (no data collection, no external requests)
*/

(() => {
  'use strict';

  const FOOTER_ID = 'tmSelectedSizeTotal';
  const DEBOUNCE = 80;
  let footerEl = null, sizeColIndex = null, timer = null;

  // --- Lightweight language detection (only affects label text)
  const helpLang = {
    "Help": "en", "Ajutor": "ro", "Aide": "fr", "Ayuda": "es", "Справка": "ru",
    "Aiuto": "it", "帮助": "zh", "Hilfe": "de", "Βοήθεια": "el",
    "Ajuda": "pt", "日本語": "ja"
  };
  const labelMap = {
    en: 'Selected Torrents:', ro: 'Torrente selectate:', fr: 'Torrents sélectionnés:',
    es: 'Torrents seleccionados:', ru: 'Выбранные торренты:', it: 'Torrent selezionati:',
    zh: '选中的种子：', de: 'Ausgewählte Torrents:', el: 'Επιλεγμένα Torrents:',
    pt: 'Torrents Selecionados:', ja: '選択したトレント:'
  };
  const uiText = document.querySelector('#desktopNavbar a:last-child')?.innerText.trim() || 'Help';
  const LABEL = labelMap[helpLang[uiText] || 'en'];

  const waitFor = (sel, cb, tries = 0) => {
    const el = document.querySelector(sel);
    if (el) return cb(el);
    if (tries < 50) setTimeout(() => waitFor(sel, cb, tries + 1), 200);
  };

  const ensureFooter = (row) => {
    if (footerEl = document.getElementById(FOOTER_ID)) return;
    const td = document.createElement('td');
    td.id = FOOTER_ID;
    td.textContent = `${LABEL} 0 (0.00 MiB)`;
    const sep = document.createElement('td');
    sep.className = 'statusBarSeparator';
    row.insertBefore(td, row.firstElementChild);
    row.insertBefore(sep, td.nextElementSibling); // replaced comma operator
    footerEl = td;
  };

  const toBytes = (t) => {
    const m = t.replace(/\u00A0/g, ' ').replace(/,/g, '').trim().match(/^([\d.]+)\s*(B|KiB|MiB|GiB|TiB)$/i);
    if (!m) return 0;
    const v = parseFloat(m[1]), u = m[2].toUpperCase();
    return v * (u === 'B' ? 1 : u === 'KIB' ? 1024 : u === 'MIB' ? 1024**2 : u === 'GIB' ? 1024**3 : 1024**4);
  };

  const fmt = (b) => {
    const u = ['B','KiB','MiB','GiB','TiB'];
    let i = 0;
    while (b >= 1024 && i < u.length - 1) { b /= 1024; i++; } // replaced comma operator with braces
    return `${b.toFixed(2)} ${u[i]}`;
  };

  const findSizeCol = () => {
    const ths = document.querySelectorAll('#torrentsTableDiv thead th');
    for (const [i, th] of ths.entries()) {
      if (th.classList.contains('column_size') || /size/i.test(th.textContent)) return i;
    }
    return null;
  };

  const update = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!footerEl) return;
      if (sizeColIndex == null) sizeColIndex = findSizeCol();
      const rows = document.querySelectorAll('#torrentsTableDiv tbody tr.selected');
      let total = 0;
      for (const r of rows) {
        const cell = r.children[sizeColIndex];
        if (cell) total += toBytes(cell.textContent);
      }
      footerEl.textContent = `${LABEL} ${rows.length} (${fmt(total)})`;
    }, DEBOUNCE);
  };

  const start = () => {
    const tableDiv = document.querySelector('#torrentsTableDiv');
    if (!tableDiv) return;
    const tb = tableDiv.querySelector('tbody');
    if (tb) new MutationObserver(update).observe(tb, { subtree: true, attributes: true, childList: true });
    new MutationObserver(() => { sizeColIndex = null; update(); })
      .observe(document.body, { subtree: true, childList: true });
    document.addEventListener('click', update, true);
    document.addEventListener('keyup', update, true);
    update();
  };

  waitFor('#desktopFooter tr, #statusBar table tr', ensureFooter);
  waitFor('#torrentsTableDiv', start);
})();
