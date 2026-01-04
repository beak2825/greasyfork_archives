// ==UserScript==
// @name         Cartel Empire - Player KD Tracker
// @namespace    baccy.ce
// @version      0.3
// @description  Displays a number next to player KDs with the number of attacks won and defends lost since last viewing the profile. Hovering over the KD will show the date the last value was stored.
// @author       Baccy
// @match        https://cartelempire.online/user/*
// @match        https://cartelempire.online/User/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cartelempire.online
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/544020/Cartel%20Empire%20-%20Player%20KD%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/544020/Cartel%20Empire%20-%20Player%20KD%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function init() {
        const table = document.querySelector('.table.align-items-center.table-flush');
        if (!table) return;

        const rows = table.querySelectorAll('tr');

        const idRow = rows[0];
        if (!idRow || !idRow.querySelector('td')) return;

        const playerId = idRow.querySelector('td').textContent.trim();

        let kdCell = null;
        for (const row of rows) {
            const th = row.querySelector('th');
            if (th && th.textContent.includes('K/D')) {
                kdCell = row.querySelector('td');
                break;
            }
        }

        if (!kdCell) return;

        const kdText = kdCell.textContent.trim();
        const kdMatch = kdText.match(/^(\d+)\s*\/\s*(\d+)/);
        if (!kdMatch) return;

        const currentAttacks = parseInt(kdMatch[1], 10);
        const currentLosses = parseInt(kdMatch[2], 10);

        const storedData = await GM.getValue(playerId, null);

        if (storedData) {
            try {
                const [storedAttacks, storedLosses, timestamp] = JSON.parse(storedData);
                const diffAttacks = currentAttacks - storedAttacks;
                const diffLosses = currentLosses - storedLosses;

                if (timestamp) {
                    const date = new Date(timestamp);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    kdCell.title = `Last recorded: ${year}-${month}-${day}`;
                }

                kdCell.textContent = `${currentAttacks} / ${currentLosses} (${Math.abs(diffAttacks)}/${Math.abs(diffLosses)})`;
            } catch (e) {
                console.error(e);
            }
        }

        const now = Date.now();
        await GM.setValue(playerId, JSON.stringify([currentAttacks, currentLosses, now]));
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
