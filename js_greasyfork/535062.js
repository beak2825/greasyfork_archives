// ==UserScript==
// @name         Livesport MLB Program - Týmy + Datum (30 zápasů)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Vygeneruje tabulku s domácím týmem, hostujícím týmem a datem z programu MLB na Livesport (30 zápasů)
// @match        https://www.livesport.cz/baseball/usa/mlb/program/
// @license      MIT
// @author       Lukas Malec
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535062/Livesport%20MLB%20Program%20-%20T%C3%BDmy%20%2B%20Datum%20%2830%20z%C3%A1pas%C5%AF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535062/Livesport%20MLB%20Program%20-%20T%C3%BDmy%20%2B%20Datum%20%2830%20z%C3%A1pas%C5%AF%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function createResultsTable(matches) {
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.margin = '20px auto';
    table.style.fontSize = '14px';
    table.style.width = '70%';
    table.style.border = '1px solid black';
    table.style.backgroundColor = '#fff';
    table.style.color = '#000';

    table.innerHTML = `
      <tr style="background:#eee;font-weight:bold">
        <td style="border:1px solid black;padding:4px">Datum</td>
        <td style="border:1px solid black;padding:4px">Domácí tým</td>
        <td style="border:1px solid black;padding:4px">Hostující tým</td>
      </tr>
    `;

    let added = 0;
    for (const match of matches) {
      if (!match.classList.contains('event__match') || added >= 30) continue;

      const dateEl = match.querySelector('.event__time');
      const homeEl = match.querySelector('.event__participant--home');
      const awayEl = match.querySelector('.event__participant--away');

      if (dateEl && homeEl && awayEl) {
        const date = dateEl.textContent.trim();
        const home = homeEl.textContent.trim();
        const away = awayEl.textContent.trim();

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="border:1px solid black;padding:4px">${date}</td>
          <td style="border:1px solid black;padding:4px">${home}</td>
          <td style="border:1px solid black;padding:4px">${away}</td>
        `;
        table.appendChild(tr);
        added++;
      }
    }

    const container = document.querySelector('main') || document.body;
    container.prepend(table);
  }

  function addButton() {
    const button = document.createElement('button');
    button.textContent = '▶️ Načíst 30 MLB zápasů (s datem)';
    Object.assign(button.style, {
      position: 'fixed', top: '20px', right: '20px', zIndex: '9999',
      padding: '10px', backgroundColor: '#007bff', color: '#fff',
      border: 'none', borderRadius: '5px', cursor: 'pointer'
    });
    document.body.appendChild(button);

    button.addEventListener('click', () => {
      const matches = document.querySelectorAll('.event__match');
      createResultsTable(matches);
      button.disabled = true;
    });
  }

  window.addEventListener('load', addButton);
})();
