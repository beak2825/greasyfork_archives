// ==UserScript==
// @name         IMDb List → CSV via Fast Regex
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Faster export of all movies in an IMDb list using regex+JSON.parse, skipping DOMParser for page1.
// @match        https://www.imdb.com/list/ls*/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544331/IMDb%20List%20%E2%86%92%20CSV%20via%20Fast%20Regex.user.js
// @updateURL https://update.greasyfork.org/scripts/544331/IMDb%20List%20%E2%86%92%20CSV%20via%20Fast%20Regex.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function injectButton() {
    if (document.getElementById('imdb-fast-export')) return;

    const btn = document.createElement('button');
    btn.id = 'imdb-fast-export';
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

      //–– 1) figure out pages via <select> or 1
      const sel        = document.getElementById('listPagination');
      const totalPages = sel ? sel.options.length : 1;

      //–– 2) helper: extract JSON-LD via regex
      function extractItemList(html) {
        const re = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g;
        let m;
        while ((m = re.exec(html)) !== null) {
          try {
            const j = JSON.parse(m[1]);
            if (j['@type'] === 'ItemList') return j.itemListElement;
          } catch {}
        }
        return [];
      }

      //–– 3) page1: scrape the JSON-LD directly from the loaded document
      const page1Scripts = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      );
      let page1Data = null;
      for (const s of page1Scripts) {
        try {
          const j = JSON.parse(s.textContent);
          if (j['@type'] === 'ItemList') {
            page1Data = j.itemListElement;
            break;
          }
        } catch{}
      }
      if (!page1Data) {
        alert('⚠️ Failed to parse page 1 JSON-LD.');
        btn.textContent = 'Error';
        return;
      }

      //–– 4) build URLs for pages 2…N
      const urls = [];
      for (let p = 2; p <= totalPages; p++) {
        urls.push(`${origin + basePath}?page=${p}`);
      }

      //–– 5) fetch pages 2…N in parallel, extract JSON-LD with regex
      const restLists = await Promise.all(
        urls.map(u => fetch(u, { credentials: 'include' })
                          .then(r => r.text())
                          .then(html => extractItemList(html)))
      );

      //–– 6) combine all pages
      const all = page1Data.concat(...restLists);

      //–– 7) build CSV
      let csv = 'Rank,Title,IMDbID\n';
      all.forEach((entry, i) => {
        const title  = (entry.item.name || '').replace(/"/g,'""');
        const id     = (entry.item.url.match(/tt\d+/)||[])[0] || '';
        csv += `${i+1},"${title}",${id}\n`;
      });

      //–– 8) download
      const blob = new Blob([csv], { type: 'text/csv' });
      const a    = document.createElement('a');
      a.href     = URL.createObjectURL(blob);
      a.download = 'imdb-list-full.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);

      btn.textContent = 'Done!';
      setTimeout(() => btn.remove(), 1500);
    });
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }
})();
