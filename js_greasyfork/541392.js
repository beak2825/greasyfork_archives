// ==UserScript==
// @name         MKVDrama.me – Better UX + Ad Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Improve mkvdrama.me browsing experience: mark favorites, dim skipped items, show links & remove ads.
// @author       matthew
// @match        https://mkvdrama.me/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541392/MKVDramame%20%E2%80%93%20Better%20UX%20%2B%20Ad%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/541392/MKVDramame%20%E2%80%93%20Better%20UX%20%2B%20Ad%20Cleaner.meta.js
// ==/UserScript==

;(function() {
  'use strict';

  GM_addStyle(`
    .fav { background-color: #ffe599 !important; }
    .dim { opacity: 0.3 !important; }
    .btn { cursor: pointer; margin-left: 8px; color: #007bff; }
  `);

  const STORE_KEY = 'mkvdramaPrefs';
  let prefs = JSON.parse(GM_getValue(STORE_KEY, '{}'));

  function save() {
    GM_setValue(STORE_KEY, JSON.stringify(prefs));
  }

  // Helper to wrap title text
  function wrapTitles() {
    document.querySelectorAll('article .title').forEach(el => {
      const text = el.textContent.trim();
      const link = document.createElement('a');
      link.href = `https://mydramalist.com/search?q=${encodeURIComponent(text)}`;
      link.target = '_blank';
      link.textContent = text;
      el.textContent = '';
      el.appendChild(link);
    });
  }

  // Add favorite/dim buttons
  function decorate() {
    document.querySelectorAll('article').forEach((art, i) => {
      const id = art.getAttribute('data-id') || i;
      if (prefs[id]?.fav) art.classList.add('fav');
      if (prefs[id]?.dim) art.classList.add('dim');

      if (!art.querySelector('.btn-fav')) {
        const btnFav = document.createElement('span');
        btnFav.textContent = prefs[id]?.fav ? '★' : '☆';
        btnFav.className = 'btn btn-fav';
        btnFav.onclick = () => {
          prefs[id] = prefs[id] || {};
          prefs[id].fav = !prefs[id].fav;
          save();
          decorate();
        };
        art.querySelector('.title').appendChild(btnFav);

        const btnDim = document.createElement('span');
        btnDim.textContent = '☒';
        btnDim.className = 'btn btn-dim';
        btnDim.onclick = () => {
          prefs[id] = prefs[id] || {};
          prefs[id].dim = !prefs[id].dim;
          save();
          decorate();
        };
        art.querySelector('.title').appendChild(btnDim);
      }
    });
  }

  // Remove suspicious ads/popups
  function removeAds() {
    document.querySelectorAll('iframe, .ad-banner, [class*="popup"]').forEach(el => el.remove());
  }

  // Observe for dynamic content
  const obs = new MutationObserver(() => {
    wrapTitles();
    removeAds();
    decorate();
  });
  obs.observe(document.body, { childList: true, subtree: true });

  // Initial run
  wrapTitles();
  removeAds();
  decorate();
})();
