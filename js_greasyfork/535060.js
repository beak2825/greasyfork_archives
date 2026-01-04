// ==UserScript==
// @name         MLB Stats - Týmové statistiky
// @description  Vygenedruje na zdroji MLB tabulku s týmovými stats za posledních 14 dní
// @namespace    http://tampermonkey.net/
// @version      0.3
// @match        https://www.mlb.com/stats/team?timeframe=-14
// @license      MIT
// @author       Lukas Malec
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535060/MLB%20Stats%20-%20T%C3%BDmov%C3%A9%20statistiky.user.js
// @updateURL https://update.greasyfork.org/scripts/535060/MLB%20Stats%20-%20T%C3%BDmov%C3%A9%20statistiky.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const HEADERS = ['Team','R','H','HR','RBI','BB','SO','AVG','OBP','SLG','OPS'];

  function extractStats() {
    const rows = document.querySelectorAll('.stats-body-table.team tbody tr');
    return Array.from(rows).map(tr => {
      const cells = tr.querySelectorAll('th:first-child .full-G_bAyq40, td');
      return [
        cells[0]?.textContent.trim(),
        cells[4]?.textContent.trim(),
        cells[5]?.textContent.trim(),
        cells[8]?.textContent.trim(),
        cells[9]?.textContent.trim(),
        cells[10]?.textContent.trim(),
        cells[11]?.textContent.trim(),
        cells[14]?.textContent.trim(),
        cells[15]?.textContent.trim(),
        cells[16]?.textContent.trim(),
        cells[17]?.textContent.trim()
      ];
    });
  }

  function renderTable(rows) {
    // remove old table if any
    document.getElementById('tm-stats-table')?.remove();

    const table = document.createElement('table');
    table.id = 'tm-stats-table';
    table.style.cssText = 'border-collapse:collapse;margin:1em 0;width:100%';
    const thead = `<thead><tr>${HEADERS.map(h=>`<th style="border:1px solid #ccc;padding:4px">${h}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${rows.map(r=>`<tr>${r.map(c=>`<td style="border:1px solid #ccc;padding:4px">${c||''}</td>`).join('')}</tr>`).join('')}</tbody>`;
    table.innerHTML = thead + tbody;

    // insert above the original stats table
    const orig = document.querySelector('.stats-body-table.team');
    if (orig) orig.parentNode.insertBefore(table, orig);
  }

  function downloadCSV(rows) {
    const csv = [HEADERS.join(','), ...rows.map(r=>r.map(c=>`"${(c||'').replace(/"/g,'""')}"`).join(','))
                ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'mlb_team_stats.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function injectControls() {
    if (document.getElementById('tm-stats-controls')) return; // already injected
    const statsTable = document.querySelector('.stats-body-table.team');
    if (!statsTable) return;                           // not there yet

    const div = document.createElement('div');
    div.id = 'tm-stats-controls';
    div.style.margin = '1em 0';
    div.innerHTML = `
      <button id="show-stats-table">Show Table</button>
      <button id="download-stats-csv" style="margin-left:8px">Download CSV</button>
    `;
    statsTable.parentNode.insertBefore(div, statsTable);

    div.querySelector('#show-stats-table').addEventListener('click', () => {
      const rows = extractStats();
      renderTable(rows);
    });
    div.querySelector('#download-stats-csv').addEventListener('click', () => {
      const rows = extractStats();
      downloadCSV(rows);
    });
  }

  // watch for the stats table to appear in the DOM
  const observer = new MutationObserver(injectControls);
  observer.observe(document.body, { childList: true, subtree: true });
  // also try immediately
  injectControls();
})();
