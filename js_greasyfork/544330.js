// ==UserScript==
// @name         IMDb List → CSV via Pagination Select
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Export all movies in an IMDb list, paging via the #listPagination <select>.
// @match        https://www.imdb.com/list/ls*/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544330/IMDb%20List%20%E2%86%92%20CSV%20via%20Pagination%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/544330/IMDb%20List%20%E2%86%92%20CSV%20via%20Pagination%20Select.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Inject the button
  function injectButton() {
    if (document.getElementById('imdb-pagination-export')) return;

    const btn = document.createElement('button');
    btn.id = 'imdb-pagination-export';
    btn.textContent = 'Download Full CSV';
    Object.assign(btn.style, {
      position:    'fixed',
      top:         '10px',
      right:       '10px',
      padding:     '8px 12px',
      background:  '#f5c518',
      color:       '#000',
      border:      'none',
      borderRadius:'4px',
      cursor:      'pointer',
      fontSize:    '14px',
      zIndex:      9999
    });
    document.body.appendChild(btn);

    btn.addEventListener('click', async () => {
      btn.disabled    = true;
      btn.textContent = 'Working…';

      const origin   = location.origin;
      const basePath = location.pathname.replace(/\?.*$/, '');

      // 1) Count pages from #listPagination (or default to 1)
      const sel = document.getElementById('listPagination');
      const totalPages = sel ? sel.options.length : 1;

      // 2) Build all page URLs
      const urls = Array.from({ length: totalPages }, (_, i) => {
        return i === 0
          ? origin + basePath
          : `${origin + basePath}?page=${i+1}`;
      });

      // 3) Fetch each page’s HTML in parallel
      const pages = await Promise.all(
        urls.map(u => fetch(u, { credentials: 'include' }).then(r => r.text()))
      );

      // 4) Parse JSON-LD ItemList and collect entries
      const all = [];
      for (const html of pages) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const listData = Array.from(
          doc.querySelectorAll('script[type="application/ld+json"]')
        )
        .map(s => {
          try {
            return JSON.parse(s.textContent);
          } catch {
            return null;
          }
        })
        .find(o => o && o['@type'] === 'ItemList');

        if (!listData) continue;
        listData.itemListElement.forEach(entry => {
          const titleMatch = entry.item.name || '';
          const urlMatch   = entry.item.url || '';
          const idMatch    = urlMatch.match(/tt\d+/) || [];
          all.push({ title: titleMatch, imdbId: idMatch[0] || '' });
        });
      }

      // 5) Build CSV content
      let csv = 'Rank,Title,IMDbID\n';
      all.forEach((m, i) => {
        // escape any inner quotes
        const safeTitle = m.title.replace(/"/g, '""');
        csv += `${i+1},"${safeTitle}",${m.imdbId}\n`;
      });

      // 6) Trigger download
      const blob = new Blob([csv], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'imdb-list-full.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);

      btn.textContent = 'Done!';
      setTimeout(() => btn.remove(), 1500);
    });
  }

  // Wait for the body to exist, then inject
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }

})();
