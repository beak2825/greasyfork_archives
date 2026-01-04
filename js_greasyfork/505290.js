// ==UserScript==
// @name         Cases.GG - Check tickets
// @namespace    https://gge.gg
// @version      0.1.1
// @description  This script will show all tickets in a battle
// @author       SomeGuy
// @match        https://cases.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cases.gg
// @grant        none
// @license      WTFPL
// @require https://cdnjs.cloudflare.com/ajax/libs/seedrandom/3.0.5/seedrandom.min.js
// @downloadURL https://update.greasyfork.org/scripts/505290/CasesGG%20-%20Check%20tickets.user.js
// @updateURL https://update.greasyfork.org/scripts/505290/CasesGG%20-%20Check%20tickets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function fetchData() {

        // Check if the URL contains "battle" and not just the base URL
        if (window.location.href.indexOf("battle") === -1 || window.location.href.endsWith("/case-battles")) {
            return;
        }

        // Extract the battle link part dynamically to handle different language prefixes
        let currentLink = window.location.href;
        let battleLink = currentLink.match(/\/case-battles\/(\d+)/)[1];
        let battleUrl = "/api/battles/" + battleLink + "/details/";

        // Check if the URL contains a password
        const passwordMatch = currentLink.match(/\?password=([a-zA-Z0-9]+)/);
        if (passwordMatch) {
            let password = passwordMatch[1];
            battleUrl = `/api/battles/${battleLink}/details?password=${password}`;
        }

        const response = await fetch(battleUrl);
        const battleInfo = await response.json();
        let seed = battleInfo.seed;
        if (seed === null) {
            return;
        }

        let slots = battleInfo.playerCount;
        let cases = battleInfo.cases;
        let rounds = 0;
        for (let i = 0; i < cases.length; i++) {
            rounds += cases[i].amount;
        }
        let results = "";
        for (let round = 0; round < rounds; round++) {
            results += `<tr><td>#${round + 1}</td>`;

            for (let slot = 1; slot <= slots; slot++) {
                const seedX = `${seed}:${round+1}:${slot}`;
                const rollNumber = new Math.seedrandom(seedX)();
                const ticket = ~~(rollNumber * 100_000);
                let color = "848B8D";
                if (ticket <= 10) {
                    color = "f44336";
                } else if (ticket <= 50) {
                    color = "ff5722";
                } else if (ticket <= 200) {
                    color = "ff9800";
                } else if (ticket <= 500) {
                    color = "ffc107";
                } else if (ticket <= 1000) {
                    color = "cddc39";
                } else if (ticket <= 3000) {
                    color = "8bc34a";
                } else if (ticket <= 5000) {
                    color = "4caf50";
                }
                results += `<td style="color: #${color};">${ticket}</td>`;
            }

            results += '</tr>';
        }
        const tieTicket = new Math.seedrandom(seed)();
                const targetDiv = document.querySelector('div.flex.flex-col.space-y-1\\.5.text-center.sm\\:text-left');


        const existingDiv = document.getElementById('someguy');

        if (!existingDiv && targetDiv) {
            const newDiv = document.createElement('div');
            newDiv.id = 'someguy';
            Object.assign(newDiv.style, {
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem',
                gap: '5px',
                flexDirection: 'column'
            });
            newDiv.innerHTML = `<table style="font-size:12px;width: 100%; text-align: center;">
      <thead style="font-weight:800;color:#fff;">
        <th>Round</th>
        ${new Array(slots).fill(0).map((_, i) => `<th>Slot #${i + 1}</th>`).join('')}
      </thead>
      <tbody>${results}</tbody>
    </table><div style="font-size:12px;">
      Tie ticket - ${tieTicket}
    </div>`;

            targetDiv.insertAdjacentElement('afterbegin', newDiv);
        }
        else if (existingDiv) {
            existingDiv.innerHTML = `<table style="font-size:12px;width: 100%; text-align: center;">
      <thead style="font-weight:800;color:#fff;">
        <th>Round</th>
        ${new Array(slots).fill(0).map((_, i) => `<th>Slot #${i + 1}</th>`).join('')}
      </thead>
      <tbody>${results}</tbody>
    </table><div style="font-size:12px;">
      Tie ticket - ${tieTicket}
    </div>`;
        }

    }
    setTimeout(fetchData, 1000);
    setInterval(fetchData, 5000);
})();
