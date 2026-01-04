// ==UserScript==
// @name         Plemiona - Dzienne staty zrabowane i zebrane
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  Wyświetl zrabowane surowce na profilu gracza w Tribal Wars
// @author       Ten=Zly
// @match        https://*.plemiona.pl/game.php*screen=info_player*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.min.js
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/462476/Plemiona%20-%20Dzienne%20staty%20zrabowane%20i%20zebrane.user.js
// @updateURL https://update.greasyfork.org/scripts/462476/Plemiona%20-%20Dzienne%20staty%20zrabowane%20i%20zebrane.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function getPlayerName() {
        const playerNameElement = document.querySelector('#content_value #player_info>tbody>tr>th');
        return playerNameElement ? playerNameElement.textContent.trim() : null;
    }

    function fetchDailyRankingAndScavenge(playerName) {
        return new Promise(async (resolve, reject) => {
            try {
                const loot = await fetchDailyInfo(playerName, 'loot_res');
                const scavenge = await fetchDailyInfo(playerName, 'scavenge');
                resolve({ loot, scavenge });
            } catch (error) {
                reject(error);
            }
        });
    }

    function fetchDailyInfo(playerName, type) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `/game.php?screen=ranking&mode=in_a_day&type=${type}&name=${encodeURIComponent(playerName)}`,
                success: (data) => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data, 'text/html');
                    const rows = doc.querySelectorAll('#in_a_day_ranking_table tr:not(:first-child)');

                    for (const row of rows) {
                        const playerNameCell = row.querySelector('td:nth-child(2)');
                        const valueCell = row.querySelector('td:nth-child(4)');
                        const parsedPlayerName = playerNameCell ? playerNameCell.textContent.trim() : '';

                        if (parsedPlayerName === playerName) {
                            const value = valueCell ? parseInt(valueCell.textContent.trim().replaceAll(/,/g, '').replaceAll('.', '')) : 0;
                            resolve(value);
                            return;
                        }
                    }

                    resolve(0);
                },
                error: (xhr, status, error) => {
                    reject(error);
                }
            });
        });
    }

    function displayStats(stats) {
        const container = document.querySelector('#content_value #player_info');
        if (container) {
            const newRows= `
            <tr>
                <td>Zrabowane surowce (rekord dzienny):</td>
                <td><strong>${stats.loot.toLocaleString()}</strong></td>
            </tr>
            <tr>
                <td>Zebrane surowce (rekord dzienny):</td>
                <td><strong>${stats.scavenge.toLocaleString()}</strong></td>
            </tr>
            `;
            container.insertAdjacentHTML( 'beforeend', newRows );
        }
    }

    const playerName = getPlayerName();

    if (playerName) {
        fetchDailyRankingAndScavenge(playerName)
            .then(stats => {
                displayStats(stats);
            })
            .catch(error => {
                console.error('Nie można pobrać danych o zrabowanych surowcach:', error);
            });
    }

})();