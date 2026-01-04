// ==UserScript==
// @name         esportsbet – LIVE tlačítko
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Do každé match karty přidá tlačítko LIVE URL
// @author       LM
// @license      MIT
// @match        https://esportsbet.io/esportsbull/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546783/esportsbet%20%E2%80%93%20LIVE%20tla%C4%8D%C3%ADtko.user.js
// @updateURL https://update.greasyfork.org/scripts/546783/esportsbet%20%E2%80%93%20LIVE%20tla%C4%8D%C3%ADtko.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BASE = 'https://esportsbet.io/esportsbull/OddsPage';
  const MARKET_ID = '45';

  // Vytvoření <a> jako tlačítka
  function makeBtn(url) {
    const a = document.createElement('a');
    a.href = url.endsWith('/') ? url : url + '/';
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'LIVE URL';
    a.className = 'tm-live-btn';
    a.style.cssText = `
      display:inline-block;
      padding:10px 18px;
      margin-left:10px;
      border:none;
      border-radius:10px;
      background:#00ff66;
      color:#000;
      font-size:14px;
      font-weight:bold;
      text-decoration:none;
      cursor:pointer;
      box-shadow:0 2px 6px rgba(0,0,0,0.2);
    `;
    return a;
  }

  function processCard(card) {
    if (!card || card.dataset.tmLiveBtn === '1') return;

    const parentId =
      card.getAttribute('data-parentmatchid') ||
      card.getAttribute('data-parentMatchId') ||
      '';
    if (!parentId) return;

    const url = `${BASE}/${parentId}/${MARKET_ID}/`;

    const insertPlace =
      card.querySelector('.matchBtn') ||
      card.querySelector('.matchInfoRight') ||
      card;

    if (!insertPlace.querySelector('.tm-live-btn')) {
      insertPlace.appendChild(makeBtn(url));
      card.dataset.tmLiveBtn = '1';
    }
  }

  function scanAll() {
    document
      .querySelectorAll('[data-parentmatchid], [data-parentMatchId]')
      .forEach(processCard);
  }

  function start() {
    scanAll();
    const iv = setInterval(scanAll, 700);
    setTimeout(() => clearInterval(iv), 120000);

    const obs = new MutationObserver(scanAll);
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
