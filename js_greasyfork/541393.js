// ==UserScript==
// @name         Dramiko.com – Better UX + Ad Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Enhance browsing on dramiko.com: favorites, dim items, clickable titles & remove ads.
// @author       You
// @match        https://dramiko.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541393/Dramikocom%20%E2%80%93%20Better%20UX%20%2B%20Ad%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/541393/Dramikocom%20%E2%80%93%20Better%20UX%20%2B%20Ad%20Cleaner.meta.js
// ==/UserScript==

;(function() {
  'use strict';

  GM_addStyle(`
    .fav { background-color: #ffe599 !important; }
    .dim { opacity: 0.3 !important; }
    .btn { cursor: pointer; margin-left: 8px; color: #007bff; }
  `);

  const STORE_KEY = 'dramikoPrefs';
  let prefs = JSON.parse(GM_getValue(STORE_KEY, '{}'));

  function save() {
    GM_setValue(STORE_KEY, JSON.stringify(prefs));
  }

  // Wrap titles with external search links
  function wrapTitles() {
    document.querySelectorAll('.drama-item .title, .series-item .title').forEach(el => {
      const text = el.textContent.trim();
      const link = document.createElement('a');
      link.href = `https://mydramalist.com/search?q=${encodeURIComponent(text)}`;
      link.target = '_blank';
      link.textContent = text;
      el.textContent = '';
      el.appendChild(link);
    });
  }

  // Add favorite and dim buttons to each drama/series block
  function decorate() {
    document.querySelectorAll('.drama-item, .series-item').forEach((item, i) => {
      const id = item.getAttribute('data-id') || i;
      if (prefs[id]?.fav) item.classList.add('fav');
      else item.classList.remove('fav');
      if (prefs[id]?.dim) item.classList.add('dim');
      else item.classList.remove('dim');

      if (!item.querySelector('.btn-fav')) {
        const container = item.querySelector('.title') || item;
        const btnFav = document.createElement('span');
        btnFav.textContent = prefs[id]?.fav ? '★' : '☆';
        btnFav.className = 'btn btn-fav';
        btnFav.onclick = () => {
          prefs[id] = prefs[id] || {};
          prefs[id].fav = !prefs[id].fav;
          save();
          decorate();
        };
        container.appendChild(btnFav);

        const btnDim = document.createElement('span');
        btnDim.textContent = '☒';
        btnDim.className = 'btn btn-dim';
        btnDim.onclick = () => {
          prefs[id] = prefs[id] || {};
          prefs[id].dim = !prefs[id].dim;
          save();
          decorate();
        };
        container.appendChild(btnDim);
      }
    });
  }

  // Remove ads/popups
  function removeAds() {
    document.querySelectorAll('iframe, .ad-banner, [class*="popup"], .adsbygoogle').forEach(el => el.remove());
  }

  // Observe dynamic content
  const observer = new MutationObserver(() => {
    wrapTitles();
    removeAds();
    decorate();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial call
  wrapTitles();
  removeAds();
  decorate();
})();
