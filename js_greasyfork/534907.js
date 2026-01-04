// ==UserScript==
// @name         Livesport MLB Výsledky - Týmy, datum, skore
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Vygeneruje tabulku výsledků MLB zápasů na stránce Livesport
// @match        https://www.livesport.cz/baseball/usa/mlb/vysledky/
// @license      MIT
// @author       Lukas Malec
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534907/Livesport%20MLB%20V%C3%BDsledky%20-%20T%C3%BDmy%2C%20datum%2C%20skore.user.js
// @updateURL https://update.greasyfork.org/scripts/534907/Livesport%20MLB%20V%C3%BDsledky%20-%20T%C3%BDmy%2C%20datum%2C%20skore.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function parseMatchData(match) {
    const dateEl = match.querySelector('.event__time');
    const homeTeamEl = match.querySelector('.event__participant--home');
    const awayTeamEl = match.querySelector('.event__participant--away');
    const homeScoreEl = match.querySelector('.event__score--home');
    const awayScoreEl = match.querySelector('.event__score--away');

    const date = dateEl ? dateEl.textContent.trim() : 'N/A';
    const homeTeam = homeTeamEl ? homeTeamEl.textContent.trim() : 'N/A';
    const awayTeam = awayTeamEl ? awayTeamEl.textContent.trim() : 'N/A';
    const homeScore = homeScoreEl ? homeScoreEl.textContent.trim() : 'N/A';
    const awayScore = awayScoreEl ? awayScoreEl.textContent.trim() : 'N/A';

    return { date, homeTeam, homeScore, awayTeam, awayScore };
  }

  function createResultsTable(matches) {
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.margin = '20px auto';
    table.style.fontSize = '14px';
    table.style.width = '90%';
    table.style.border = '1px solid black';
    table.style.backgroundColor = '#fff';
    table.style.color = '#000';

    table.innerHTML = `
      <tr style="background:#eee;font-weight:bold">
        <td style="border:1px solid black;padding:4px">Datum</td>
        <td style="border:1px solid black;padding:4px">Domácí tým</td>
        <td style="border:1px solid black;padding:4px">Skóre (domácí)</td>
        <td style="border:1px solid black;padding:4px">Hostující tým</td>
        <td style="border:1px solid black;padding:4px">Skóre (hosté)</td>
      </tr>
    `;

    for (const match of matches) {
      const data = parseMatchData(match);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="border:1px solid black;padding:4px">${data.date}</td>
        <td style="border:1px solid black;padding:4px">${data.homeTeam}</td>
        <td style="border:1px solid black;padding:4px">${data.homeScore}</td>
        <td style="border:1px solid black;padding:4px">${data.awayTeam}</td>
        <td style="border:1px solid black;padding:4px">${data.awayScore}</td>
      `;
      table.appendChild(tr);
    }

    const container = document.querySelector('main') || document.body;
    container.prepend(table);
  }

  function clickMoreButton(times = 5) {
    return new Promise((resolve) => {
      let count = 0;
      const interval = setInterval(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        const button = document.querySelector('.event__more');
        if (button && count < times) {
          button.click();
          count++;
        } else {
          clearInterval(interval);
          setTimeout(resolve, 1500);
        }
      }, 1500);
    });
  }

  function addButton() {
    const button = document.createElement('button');
    button.textContent = 'Vygenerovat tabulku výsledků';
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    button.addEventListener('click', async () => {
      button.disabled = true;
      await clickMoreButton(5);
      const matches = document.querySelectorAll('.event__match');
      createResultsTable(matches);
    });
  }

  window.addEventListener('load', addButton);
})();