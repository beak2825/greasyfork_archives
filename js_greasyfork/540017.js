// ==UserScript==
// @name         PGA Korn Ferry + Champions – výpis hráčů z fieldu
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Vytvoří tabulku jméno + scorecard URL pro hráče z Korn Ferry i Champions field stránky.
// @match        https://www.pgatour.com/korn-ferry-tour/tournaments/*/field*
// @match        https://www.pgatour.com/pgatour-champions/tournaments/*/field*
// @grant        none
// @license      MIT
// @author       Lukáš Malec
// @downloadURL https://update.greasyfork.org/scripts/540017/PGA%20Korn%20Ferry%20%2B%20Champions%20%E2%80%93%20v%C3%BDpis%20hr%C3%A1%C4%8D%C5%AF%20z%20fieldu.user.js
// @updateURL https://update.greasyfork.org/scripts/540017/PGA%20Korn%20Ferry%20%2B%20Champions%20%E2%80%93%20v%C3%BDpis%20hr%C3%A1%C4%8D%C5%AF%20z%20fieldu.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const interval = setInterval(() => {
    const rows = document.querySelectorAll('tr[class*="player-"]');
    if (!rows.length) return;

    clearInterval(interval);

    const players = [];

    rows.forEach(row => {
      const nameEl = row.querySelector('span.chakra-text.css-qvuvio');
      const linkEl = row.querySelector('a[href*="/korn-ferry-tour/player/"], a[href*="/pgatour-champions/player/"]');

      if (nameEl && linkEl) {
        const name = nameEl.textContent.trim();
        const relativeHref = linkEl.getAttribute('href').replace(/\/+$/, '');
        const fullUrl = `https://www.pgatour.com${relativeHref}/scorecards#round1`;
        players.push({ name, url: fullUrl });
      }
    });

    if (!players.length) return;

    const table = document.createElement('table');
    table.style.cssText = `
      border-collapse: collapse;
      margin: 20px 0;
      width: 100%;
      max-width: 1200px;
      font-family: sans-serif;
    `;

    const header = table.insertRow();
    ['Hráč', 'Scorecard URL'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      th.style.cssText = 'padding: 8px; background: #eee; border: 1px solid #888; text-align: left;';
      header.appendChild(th);
    });

    players.forEach(({ name, url }, i) => {
      const row = table.insertRow();
      row.style.background = i % 2 === 0 ? '#ffffff' : '#f9f9f9';

      const cell1 = row.insertCell();
      cell1.textContent = name;
      cell1.style.cssText = 'padding: 6px 8px; border: 1px solid #ccc;';

      const cell2 = row.insertCell();
      const a = document.createElement('a');
      a.href = url;
      a.textContent = url;
      a.target = '_blank';
      cell2.appendChild(a);
      cell2.style.cssText = 'padding: 6px 8px; border: 1px solid #ccc;';
    });

    const target = document.querySelector('main') || document.body;
    target.prepend(table);
  }, 300);
})();
