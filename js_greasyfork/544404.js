// ==UserScript==
// @name         Letterboxd List → Full CSV Export (v0.5)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Fetch every “page/N/” HTML, scrape Rank/Title/URL from the server-rendered <li>s, and download export.csv.
// @match        https://letterboxd.com/*/list/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544404/Letterboxd%20List%20%E2%86%92%20Full%20CSV%20Export%20%28v05%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544404/Letterboxd%20List%20%E2%86%92%20Full%20CSV%20Export%20%28v05%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Build the “base” path for page URLs, e.g. "/jack/list/my-list/"
  const rawPath = window.location.pathname;
  const basePath = rawPath
    .replace(/\/page\/\d+\/?$/, '')          // strip any existing "page/N/"
    .replace(/\/?$/, '/')                    // ensure it ends in one slash
  const origin = window.location.origin;

  // Fetch page N’s HTML and return a parsed <Document>
  async function fetchPageDoc(pageNum) {
    const url = origin + basePath + (pageNum > 1 ? `page/${pageNum}/` : '');
    const resp = await fetch(url, { credentials: 'include' });
    if (!resp.ok) return null;
    const text = await resp.text();
    return new DOMParser().parseFromString(text, 'text/html');
  }

  // Pull out { title, url } from server-rendered <li>s
  function scrapeFrom(doc) {
    return Array.from(doc.querySelectorAll('ul.poster-list li')).map(li => {
      const a   = li.querySelector('a[href*="/film/"]');
      const img = li.querySelector('img');
      // img.alt usually = "Film Name poster" or just "Film Name"
      const raw = img?.alt || '';
      const title = raw.replace(/\s*poster$/i, '').trim();
      return { title, url: a?.href || '' };
    });
  }

  // Crawl pages 1,2,3… until we get no <li>s back
  async function scrapeAll() {
    const all = [];
    for (let page = 1;; page++) {
      const doc = await fetchPageDoc(page);
      if (!doc) break;                       // e.g. 404 on page 4
      const items = scrapeFrom(doc);
      if (items.length === 0) break;         // no films → done
      all.push(...items);
    }
    return all;
  }

  // Turn a JS array into CSV and trigger download
  function downloadCSV(rows) {
    let csv = 'Rank,Title,LetterboxdURI\n';
    rows.forEach((r, i) => {
      const safeTitle = `"${r.title.replace(/"/g, '""')}"`;
      csv += `${i+1},${safeTitle},${r.url}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'export.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  }

  // Inject an “Export CSV” button
  const btn = document.createElement('button');
  btn.textContent = 'Export CSV';
  Object.assign(btn.style, {
    position:   'fixed',
    top:        '10px',
    right:      '10px',
    zIndex:     '9999',
    padding:    '8px 12px',
    background: '#e50914',
    color:      '#fff',
    border:     'none',
    borderRadius:'4px',
    cursor:     'pointer',
    fontSize:   '14px'
  });
  document.body.appendChild(btn);

  btn.addEventListener('click', async () => {
    btn.disabled    = true;
    btn.textContent = 'Exporting…';
    try {
      const allFilms = await scrapeAll();
      downloadCSV(allFilms);
      btn.textContent = 'Done!';
    } catch (err) {
      console.error('Export failed', err);
      btn.textContent = 'Error';
    }
    setTimeout(() => btn.remove(), 2000);
  });

})();
