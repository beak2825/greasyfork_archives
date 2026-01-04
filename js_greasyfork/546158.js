// ==UserScript==
// @name         Cartel Empire Stats: Difference Column
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a “Difference” column (Latest - 30 Days Ago)
// @author       DAN
// @match        https://cartelempire.online/User/Stats*
// @run-at       document-idle
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/546158/Cartel%20Empire%20Stats%3A%20Difference%20Column.user.js
// @updateURL https://update.greasyfork.org/scripts/546158/Cartel%20Empire%20Stats%3A%20Difference%20Column.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const GREEN = 'hsl(120, 67%, 50%)';
  const RED   = '#d9534f';
  const GRAY  = 'gray';

  // Rows that should be formatted as integers
  const integerStats = new Set([
    "Total Likes",
    "Total Dislikes",
    "Intimidation Attempts",
    "Intimidation Success",
    "Arson Attempts",
    "Arson Success",
    "GTA Attempts",
    "GTA Success",
    "Transport Drugs Attempts",
    "Transport Drugs Success",
    "Blackmail Attempts",
    "Blackmail Success",
    "Hacking Attempts",
    "Hacking Success",
    "Farm Robbery Attempts",
    "Farm Robbery Success",
    "Agave Storage Attempts",
    "Agave Storage Success",
    "Coca Paste Attempts",
    "Coca Paste Success",
    "Construction Robbery Attempts",
    "Construction Robbery Success"
  ]);

  function parseNumber(str) {
    if (!str) return NaN;
    const cleaned = str
      .replace(/[^\d.,\-]/g, '')
      .replace(/[\s\u00A0]/g, '');
    if (cleaned.includes(',') && cleaned.includes('.')) {
      return parseFloat(cleaned.replace(/,/g, ''));
    }
    if (cleaned.includes(',') && !cleaned.includes('.')) {
      return parseFloat(cleaned.replace(/,/g, ''));
    }
    return parseFloat(cleaned);
  }

  function formatNumber(num, asInteger = false) {
    if (!isFinite(num)) return '-';
    if (asInteger) {
      return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function ensureSection(list) {
    const rows = Array.from(list.querySelectorAll(':scope > li.list-group-item > .row'));
    if (!rows.length) return;

    // Header
    const header = rows[0];
    const headerCols = Array.from(header.querySelectorAll(':scope > div'));
    const hasDiffHeader = headerCols.some(c => /difference/i.test(c.textContent));
    if (!hasDiffHeader) {
      headerCols.forEach(col => {
        col.className = col.className.replace(/\bcol-\d+\b/g, '').trim();
        col.classList.add('col-3');
        if (!/fw-bold/.test(col.className)) col.classList.add('fw-bold');
      });
      const diffHeader = document.createElement('div');
      diffHeader.className = 'col-3 fw-bold';
      diffHeader.textContent = 'Difference';
      header.appendChild(diffHeader);
    }

    // Data rows
    rows.slice(1).forEach(row => {
      const cols = Array.from(row.children);
      if (cols.length < 3) return;

      for (let i = 0; i < 3; i++) {
        cols[i].className = cols[i].className.replace(/\bcol-\d+\b/g, '').trim();
        cols[i].classList.add('col-3');
      }

      const statName = cols[0].textContent.trim();
      const asInteger = integerStats.has(statName);

      const agoVal = parseNumber(cols[1].textContent);
      const latestVal = parseNumber(cols[2].textContent);
      const diff = isFinite(agoVal) && isFinite(latestVal) ? (latestVal - agoVal) : NaN;

      let diffCol = cols[3];
      if (!diffCol) {
        diffCol = document.createElement('div');
        diffCol.className = 'col-3 tm-diff';
        row.appendChild(diffCol);
      } else {
        diffCol.className = diffCol.className.replace(/\bcol-\d+\b/g, '').trim();
        diffCol.classList.add('col-3', 'tm-diff');
      }

      diffCol.textContent = formatNumber(diff, asInteger);
      diffCol.style.color = isFinite(diff) ? (diff > 0 ? GREEN : diff < 0 ? RED : GRAY) : GRAY;
    });
  }

  function sweep() {
    document.querySelectorAll('ul.list-group').forEach(ensureSection);
  }

  sweep();
  window.addEventListener('pageshow', sweep);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') sweep();
  });

  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === 'childList' &&
          ([...m.addedNodes].some(n => n.nodeType === 1 && (n.matches?.('ul.list-group') || n.querySelector?.('ul.list-group'))))) {
        sweep();
        break;
      }
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();
