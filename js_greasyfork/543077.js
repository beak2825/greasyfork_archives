// ==UserScript==
// @name         HiAnime Watchlist Exporter (lite) fast
// @author       ScriptKiddyMonkey
// @license      MIT
// @version      1-lite
// @description  Export HiAnime.to watchlist with all metadata available on watchlist cards, no individual page fetches
// @match        https://hianime.to/user/watch-list*
// @grant        none
// @namespace    ScriptKiddyMonkey
// @downloadURL https://update.greasyfork.org/scripts/543077/HiAnime%20Watchlist%20Exporter%20%28lite%29%20fast.user.js
// @updateURL https://update.greasyfork.org/scripts/543077/HiAnime%20Watchlist%20Exporter%20%28lite%29%20fast.meta.js
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

  const extractTicks = (card) => {
    const tickContainer = card.querySelector('.tick.ltr');
    if (!tickContainer) return {};

    const ticks = {};
    tickContainer.querySelectorAll('.tick-item').forEach((item) => {
      const text = item.textContent.trim();
      if (item.classList.contains('tick-sub')) {
        ticks.subbedEpisodes = parseInt(text) || null;
      } else if (item.classList.contains('tick-dub')) {
        ticks.dubbedEpisodes = parseInt(text) || null;
      } else if (item.classList.contains('tick-eps')) {
        ticks.totalEpisodes = parseInt(text) || null;
      }
    });

    return ticks;
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
        const href = a?.href || null;
        const title = a?.getAttribute('oldtitle') || a?.title || null;
        const id = href ? href.split('/').pop() : null;
        const img = card.querySelector('img.film-poster-img');
        const poster = img?.getAttribute('data-src') || img?.src || null;
        const category = getCategoryFromElement(card);

        const ticks = extractTicks(card);

        // Media type and duration
        let mediaType = null;
        let duration = null;
        const fdInfo = card.querySelector('.film-detail .fd-infor');
        if (fdInfo) {
          const mediaTypeSpan = fdInfo.querySelector('span.fdi-item');
          if (mediaTypeSpan) mediaType = mediaTypeSpan.textContent.trim();

          const durationSpan = fdInfo.querySelector('span.fdi-duration');
          if (durationSpan) duration = durationSpan.textContent.trim();
        }

        animes.push({
          id,
          title,
          url: href,
          category,
          poster,
          subbedEpisodes: ticks.subbedEpisodes || null,
          dubbedEpisodes: ticks.dubbedEpisodes || null,
          totalEpisodes: ticks.totalEpisodes || null,
          mediaType: mediaType || null,
          duration: duration || null,
        });
      }

      page++;
      await sleep(800);
    }

    return animes;
  };

  const exportWatchlist = async (btn) => {
    btn.disabled = true;
    btn.textContent = 'Gathering watchlist...';

    try {
      const baseList = await scrapeEntireWatchlist();

      const blob = new Blob([JSON.stringify(baseList, null, 2)], {
        type: 'application/json',
      });

      const username = location.pathname.split('/')[2] || 'user';
      const date = new Date().toISOString().split('T')[0];
      const filename = `HiAnime_Watchlist_lite_${date}.json`;

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
    btn.textContent = 'Export Watchlist [lite]';
    btn.style =
      'position:fixed;bottom:20px;right:20px;padding:10px 20px;background:#201f2d;color:#fff;border:none;border-radius:8px;z-index:99999;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.3);cursor:pointer';

    btn.onclick = () => exportWatchlist(btn);
    document.body.appendChild(btn);
  };

  waitForSelector('.film_list-wrap').then(addExportButton);
})();
