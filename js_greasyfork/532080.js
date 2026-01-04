// ==UserScript==
// @name         Torn RW Infobox
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show finished ranked wars with clickable faction links
// @author       Shedu
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532080/Torn%20RW%20Infobox.user.js
// @updateURL https://update.greasyfork.org/scripts/532080/Torn%20RW%20Infobox.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const apiKey = '46f2GOfE0zxzDogt';
    const apiUrl = `https://api.torn.com/torn/?selections=rankedwars&key=${apiKey}`;

    let boxVisible = false;

    function createToggleButton() {
        const btn = document.createElement('button');
        btn.id = 'toggle-rankedwars-btn';
        btn.textContent = '📜 Ranked Wars';
        Object.assign(btn.style, {
            position: 'fixed',
            top: '100px',
            left: '20px',
            zIndex: '10001',
            background: '#2c2c2c',
            color: '#fff',
            border: '1px solid #555',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
        });

        btn.addEventListener('click', () => {
            const box = document.getElementById('finished-ranked-wars-box');
            if (box) {
                box.style.display = boxVisible ? 'none' : 'block';
                boxVisible = !boxVisible;
            }
        });

        document.body.appendChild(btn);
    }

    function createInfobox() {
        const box = document.createElement('div');
        box.id = 'finished-ranked-wars-box';
        Object.assign(box.style, {
            display: 'none',
            position: 'fixed',
            top: '150px',
            left: '20px',
            width: '360px',
            maxHeight: '270px', // <-- adjusted here
            overflowY: 'auto',
            background: '#1c1c1c',
            color: '#fff',
            padding: '14px',
            borderRadius: '10px',
            border: '1px solid #333',
            fontSize: '14px',
            fontFamily: 'Segoe UI, sans-serif',
            zIndex: '10000',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
        });

        document.body.appendChild(box);
        return box;
    }

    function formatDate(unix) {
        return new Date(unix * 1000).toLocaleString('default', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    function createFactionLink(id, name) {
        return `<a href="https://www.torn.com/factions.php?step=profile&ID=${id}" target="_blank" style="color: #9cf; text-decoration: none;">${name}</a>`;
    }

    function addWarCard(container, warEnd, factions, winnerID) {
        const [idA, idB] = Object.keys(factions);
        const factionA = { id: idA, name: factions[idA].name };
        const factionB = { id: idB, name: factions[idB].name };

        const winner = factionA.id === String(winnerID) ? factionA : factionB;
        const loser = factionA.id === String(winnerID) ? factionB : factionA;

        const block = document.createElement('div');
        block.style.marginBottom = '16px';
        block.style.paddingBottom = '10px';
        block.style.borderBottom = '1px solid #333';

        block.innerHTML = `
            <div style="color: #ccc; font-size: 13px; margin-bottom: 6px;">🕓 ${formatDate(warEnd)}</div>
            <div style="color: #8f8; font-weight: bold;">Winner: ${createFactionLink(winner.id, winner.name)}</div>
            <div style="color: #f88;">Loser: ${createFactionLink(loser.id, loser.name)}</div>
        `;

        container.appendChild(block);
    }

    function loadAndDisplayWars() {
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
            const wars = data.rankedwars;
            const finishedWars = Object.values(wars)
            .filter(w => w.war.end !== 0)
            .sort((a, b) => b.war.end - a.war.end)
            .slice(0, 50); // Up to 50 wars

            const box = createInfobox();

            if (finishedWars.length === 0) {
                box.innerHTML += '<div>No finished ranked wars found.</div>';
                return;
            }

            finishedWars.forEach(w => {
                addWarCard(box, w.war.end, w.factions, w.war.winner);
            });
        })
            .catch(err => {
            console.error('[Torn Ranked Wars] Error fetching data:', err);
            const box = createInfobox();
            box.innerHTML += '<div style="color:red;">⚠️ Failed to load ranked wars.</div>';
        });
    }

    createToggleButton();
    loadAndDisplayWars();
})();