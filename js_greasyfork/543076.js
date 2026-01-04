// ==UserScript==
// @name         HiAnime Watchlist Exporter (exports a json file) metadata slow
// @author       ScriptKiddyMonkey
// @license      MIT
// @version      1
// @description  Exports your entire HiAnime.to watchlist. All categories with rich metadata pulled from each anime’s page.
// @match        https://hianime.to/user/watch-list*
// @grant        none
// @namespace    ScriptKiddyMonkey
// @downloadURL https://update.greasyfork.org/scripts/543076/HiAnime%20Watchlist%20Exporter%20%28exports%20a%20json%20file%29%20metadata%20slow.user.js
// @updateURL https://update.greasyfork.org/scripts/543076/HiAnime%20Watchlist%20Exporter%20%28exports%20a%20json%20file%29%20metadata%20slow.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const waitForSelector = async (selector) => {
    while (!document.querySelector(selector)) await sleep(200);
    return document.querySelector(selector);
  };

  const getCategoryFromElement = (el) => {
    const added = el.querySelector('.wl-item.added');
    if (!added) return 'Unknown';
    const map = {
      '1': 'Watching',
      '2': 'On-Hold',
      '3': 'Plan to Watch',
      '4': 'Dropped',
      '5': 'Completed',
    };
    return map[added.getAttribute('data-type')] || 'Unknown';
  };

  const getMetadataValue = (doc, label) => {
    const rows = doc.querySelectorAll('.anisc-info .item');
    for (let row of rows) {
      const title = row.querySelector('.item-head');
      if (title && title.textContent.trim().startsWith(label)) {
        const links = row.querySelectorAll('a');
        if (links.length > 0) {
          return Array.from(links).map((a) => a.textContent.trim());
        } else {
          const name = row.querySelector('.name');
          if (name) return name.textContent.trim();
        }
      }
    }
    return null;
  };

  const scrapeAnimeDetails = async (originalUrl) => {
    try {
      const url = originalUrl.replace('/watch/', '/');
      const res = await fetch(url);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');

      const get = (selector) => {
        const el = doc.querySelector(selector);
        return el ? el.textContent.trim() : null;
      };

      const tick = {
        ageRating: null,
        subbedEpisodes: null,
        dubbedEpisodes: null,
        totalEpisodes: null,
        mediaType: null,
        duration: null,
      };

      const tickContainers = doc.querySelectorAll('.tick');

      tickContainers.forEach((container) => {
        container.querySelectorAll('.tick-item')?.forEach((item) => {
          const text = item.textContent.trim();
          if (item.classList.contains('tick-pg')) {
            tick.ageRating = text;
          } else if (item.classList.contains('tick-sub')) {
            tick.subbedEpisodes = parseInt(text) || null;
          } else if (item.classList.contains('tick-dub')) {
            tick.dubbedEpisodes = parseInt(text) || null;
          } else if (item.classList.contains('tick-eps')) {
            tick.totalEpisodes = parseInt(text) || null;
          }
        });

        container.querySelectorAll('span.item')?.forEach((span) => {
          const text = span.textContent.trim();
          if (!tick.mediaType && /^[A-Za-z\s]+$/.test(text)) {
            tick.mediaType = text;
          } else if (!tick.duration && /\d+m/.test(text)) {
            tick.duration = text;
          } else if (!tick.duration && tick.mediaType) {
            tick.duration = text;
          }
        });
      });

      return {
        description: get('.film-description .text') || get('.item .text'),
        genres: getMetadataValue(doc, 'Genres'),
        synonyms: getMetadataValue(doc, 'Synonyms') || [],
        japaneseTitle: getMetadataValue(doc, 'Japanese'),
        aired: getMetadataValue(doc, 'Aired'),
        premiered: getMetadataValue(doc, 'Premiered'),
        status: getMetadataValue(doc, 'Status'),
        score: getMetadataValue(doc, 'MAL Score'),
        studios: getMetadataValue(doc, 'Studios'),
        producers: getMetadataValue(doc, 'Producers'),
        duration: tick.duration,
        mediaType: tick.mediaType,
        totalEpisodes: tick.totalEpisodes,
        subbedEpisodes: tick.subbedEpisodes,
        dubbedEpisodes: tick.dubbedEpisodes,
        ageRating: tick.ageRating,
      };
    } catch (err) {
      console.error(`Failed to scrape details for ${originalUrl}`, err);
      return {};
    }
  };

  const scrapeEntireWatchlist = async () => {
    let page = 1;
    let animes = [];

    while (true) {
      const url = `${location.origin}${location.pathname}?page=${page}`;
      console.log(`Scraping page ${page}: ${url}`);
      const res = await fetch(url);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');

      const cards = doc.querySelectorAll('.film_list-wrap .flw-item');
      if (!cards.length) break;

      for (const card of cards) {
        const a = card.querySelector('a.film-poster-ahref');
        const href = a?.href;
        const title = a?.getAttribute('oldtitle') || a?.title;
        const id = href?.split('/').pop();
        const img = card.querySelector('img.film-poster-img');
        const poster = img?.getAttribute('data-src') || img?.src || null;
        const category = getCategoryFromElement(card);

        animes.push({ id, title, url: href, category, poster });
      }

      page++;
      await sleep(1000);
    }

    return animes;
  };

  const scrapeDetailsForAll = async (list, btn) => {
    const updatedList = [];
    for (let i = 0; i < list.length; i++) {
      const entry = list[i];
      btn.textContent = `Scraping details... (${i + 1}/${list.length})`;
      const meta = await scrapeAnimeDetails(entry.url);
      updatedList.push({ ...entry, ...meta });
      await sleep(500);
    }
    return updatedList;
  };

  const exportWatchlist = async (btn) => {
    btn.disabled = true;
    btn.textContent = 'Gathering watchlist...';

    try {
      const baseList = await scrapeEntireWatchlist();
      const fullList = await scrapeDetailsForAll(baseList, btn);

      const blob = new Blob([JSON.stringify(fullList, null, 2)], {
        type: 'application/json',
      });

      const username = location.pathname.split('/')[2] || 'user';
      const date = new Date().toISOString().split('T')[0];
      const filename = `HiAnime_Watchlist_${date}.json`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      btn.textContent = 'Export Complete!';
    } catch (e) {
      console.error('Export failed:', e);
      btn.textContent = 'Export Failed. Check console.';
    }
  };

  const addExportButton = () => {
    const btn = document.createElement('button');
    btn.textContent = 'Export Full Watchlist';
    btn.style =
      'position:fixed;bottom:20px;right:20px;padding:10px 20px;background:#201f2d;color:#fff;border:none;border-radius:8px;z-index:99999;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.3);cursor:pointer';

    btn.onclick = () => exportWatchlist(btn);
    document.body.appendChild(btn);
  };

  waitForSelector('.film_list-wrap').then(addExportButton);
})();