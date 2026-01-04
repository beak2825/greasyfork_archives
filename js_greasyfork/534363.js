// ==UserScript==
// @name         Makedonie - Házená
// @namespace    http://hypofeed-enhancer
// @version      1.7
// @description  Vytváří tabulku na zdroji pro Makedonskou házenou
// @match        https://regrfm.hypofeed.com/live*
// @license      MIT
// @author       Michal
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534363/Makedonie%20-%20H%C3%A1zen%C3%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/534363/Makedonie%20-%20H%C3%A1zen%C3%A1.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function detectStatus(homeLive, awayLive, homeHalf, awayHalf, homeFinal, awayFinal, matchIndex) {
    const clean = val => val.replace(/\u00a0/g, '').replace(/[^0-9\-]/g, '').trim();
    const hl = parseInt(clean(homeLive), 10);
    const al = parseInt(clean(awayLive), 10);
    const hh = clean(homeHalf);
    const ah = clean(awayHalf);
    const hf = clean(homeFinal);
    const af = clean(awayFinal);

    const isLiveEmpty = isNaN(hl) || isNaN(al);
    const isZeroZero = hl === 0 && al === 0;
    const isHalfEmpty = hh === '-' || ah === '-' || hh === '' || ah === '';
    const isFinal = hf !== '-' && af !== '-' && hf !== '' && af !== '';
    const key = `match${matchIndex}-stored-half`;

    if ((isLiveEmpty || isZeroZero) && isHalfEmpty) return 'PŘED ZÁPASEM';
    if (isFinal) return 'KONEC';
    if (!isLiveEmpty && isHalfEmpty) return '1. POLOČAS';

    if (!sessionStorage.getItem(key) && !isHalfEmpty) {
      sessionStorage.setItem(key, `${hh}:${ah}`);
      return 'POLOČAS';
    }

    const stored = sessionStorage.getItem(key);
    if (stored === `${hl}:${al}`) return 'POLOČAS';
    if (stored && stored !== `${hl}:${al}`) return '2. POLOČAS';

    return '1. POLOČAS';
  }

  function generateLiveTable() {
    const oldTable = document.querySelector("table.tg");
    if (!oldTable) return;

    const oldRows = Array.from(oldTable.querySelectorAll("tr")).slice(2);
    if (oldRows.length === 0) return;

    const existing = document.getElementById("live-matches");
    if (existing) existing.remove();

    const newTable = document.createElement("table");
    newTable.id = "live-matches";
    newTable.style.borderCollapse = "collapse";
    newTable.style.marginTop = "30px";
    newTable.style.width = "100%";
    newTable.style.fontFamily = "Arial, sans-serif";
    newTable.style.fontSize = "14px";

    const style = `
      #live-matches th, #live-matches td {
        border: 1px solid #ccc;
        padding: 6px 10px;
        text-align: left;
      }
      #live-matches th {
        background-color: #f4f4f4;
      }
      #live-matches tr.match-row-home {
        background-color: #ffffff;
        border-top: 2px solid #999;
      }
      #live-matches tr.match-row-away {
        background-color: #f9f9f9;
      }
      .status-cell {
        font-weight: bold;
        text-transform: uppercase;
        color: #0022aa;
      }
    `;
    if (!document.getElementById("live-table-style")) {
      const styleTag = document.createElement("style");
      styleTag.id = "live-table-style";
      styleTag.innerHTML = style;
      document.head.appendChild(styleTag);
    }

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>Čas</th>
        <th>Tým</th>
        <th>Konečný výsledek</th>
        <th>Poločas</th>
        <th>Live stav</th>
        <th>Status</th>
      </tr>
    `;
    newTable.appendChild(thead);

    const tbody = document.createElement("tbody");
    let matchIndex = 1;

    for (let i = 0; i < oldRows.length; i += 2) {
      const row1 = oldRows[i]?.querySelectorAll("td");
      const row2 = oldRows[i + 1]?.querySelectorAll("td");
      if (!row1 || !row2 || row1.length < 5 || row2.length < 4) continue;

      const time = row1[0].innerText.trim();
      const homeTeam = row1[1].innerText.trim();
      const homeFinal = row1[2].innerText.trim();
      const homeHalf = row1[3].innerText.trim();
      const homeLive = row1[4].innerText.trim();

      const awayTeam = row2[0].innerText.trim();
      const awayFinal = row2[1].innerText.trim();
      const awayHalf = row2[2].innerText.trim();
      const awayLive = row2[3].innerText.trim();

      const status = detectStatus(homeLive, awayLive, homeHalf, awayHalf, homeFinal, awayFinal, matchIndex);

      const rowHome = document.createElement("tr");
      rowHome.className = "match-row-home";
      rowHome.innerHTML = `
        <td id="match${matchIndex}-time">${time}</td>
        <td id="match${matchIndex}-home-team">${homeTeam}</td>
        <td id="match${matchIndex}-home-final">${homeFinal}</td>
        <td id="match${matchIndex}-home-half">${homeHalf}</td>
        <td id="match${matchIndex}-home-live">${homeLive}</td>
        <td id="match${matchIndex}-status" class="status-cell" rowspan="2">${status}</td>
      `;

      const rowAway = document.createElement("tr");
      rowAway.className = "match-row-away";
      rowAway.innerHTML = `
        <td></td>
        <td id="match${matchIndex}-away-team">${awayTeam}</td>
        <td id="match${matchIndex}-away-final">${awayFinal}</td>
        <td id="match${matchIndex}-away-half">${awayHalf}</td>
        <td id="match${matchIndex}-away-live">${awayLive}</td>
      `;

      tbody.appendChild(rowHome);
      tbody.appendChild(rowAway);
      matchIndex++;
    }

    newTable.appendChild(tbody);
    oldTable.parentElement.appendChild(newTable);
  }

  function waitForLiveTable() {
    const check = setInterval(() => {
      const table = document.querySelector("table.tg");
      if (table) {
        clearInterval(check);
        generateLiveTable();
      }
    }, 1000);
  }

  console.log("🚀 Skript Handball Live Table v1.6-fix7 spuštěn");
  waitForLiveTable();
})();