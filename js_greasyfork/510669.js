// ==UserScript==
// @name        HiAnime Links
// @namespace   forked_bytes
// @match       https://hianime.to/*
// @grant       none
// @version     1.0.1
// @author      forked_bytes
// @license     0BSD
// @description Adds links to MyAnimeList and AniList on HiAnime watch pages
// @downloadURL https://update.greasyfork.org/scripts/510669/HiAnime%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/510669/HiAnime%20Links.meta.js
// ==/UserScript==

const syncData = JSON.parse(document.getElementById('syncData')?.textContent || null);
if (!syncData) return;

const title = document.getElementsByClassName('film-name')[0];
if (!title) return;

if (syncData.mal_id) {
  const a = createLink(`https://myanimelist.net/anime/${syncData.mal_id}`, 'MyAnimeList');
  a.innerHTML = ` <img width="16" height="16" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUuUaIAAAD////3+Pvy9Pno7PW1wt6pt9mks9edrtSKncuFmcl5j8NferhYdLU8XahfmXWGAAAAAnRSTlP/AZKwANwAAAA7SURBVHjaYxBgAANGBmIA04NDDF8U1IAMBSUO1bkghpIR0wKwCBAogRlAJgOMsUFBSQGkkZ2QyTBnAABEnQdOIvpAxQAAAABJRU5ErkJggg==">`;
  title.appendChild(a);
}

if (syncData.anilist_id) {
  const a = createLink(`https://anilist.co/anime/${syncData.anilist_id}`, 'AniList');
  a.innerHTML = ` <img width="16" height="16" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABh0lEQVR42p1TTyiDYRz+wtFFI1vTzEIbVit/SlzULtrJSGoHWoqbIzso2omDC8oOTiRSy59dUbRSNspyYlxsTtpBI43vsedte7PYn/arp6/evud5n+ft+Sl6k3VQ12SNpKGmgRKhkkOukiGjTESUf25WjeYumCw9aGi2QdvSTeR1ovw+qG9sh90xgpOzc1yFrrHo20XlwikqlkKoGRiH1tjxRyRHoM7QhuWVVWQn8vqJ2qNvKHsqqp1z0Bks+QWobrH1iZuz8/GlwhlUiwrI24fH3Egm3wVi8RdwfFEUFZD51zY2yaELGSX6pjJGQQFp/zZyB87Wzj5cE9NIJBJIqWCMwgK0TwKtc0h8jsWRSqXA2X4q7kDcyiGJQhnIGK3rYVTOHqLKExBfTf+o4CnM3tlrx/3DIzjsgGPIJeCZ90qRyRtA8UtIRwrt8+eL4KV4PPfUDDR6MyHexX8QEOfe4zALRchiUUBUmZVldTP1zcmYqTXBSkuQR5SyTMyaf5m4kuVsZHadfwB6hvhWyQ8n0QAAAABJRU5ErkJggg==">`;
  title.appendChild(a);
}

function createLink(href, title) {
  const a = document.createElement('a');
  a.target = '_blank';
  a.rel = 'noreferrer';
  a.href = href;
  a.title = title;
  return a;
}