// ==UserScript==
// @name         Wavu Wank - Opp. Character Specific Win Rates
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Adds character-specific win rates.
// @author       You
// @match        https://wank.wavu.wiki/player/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wavu.wiki
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494317/Wavu%20Wank%20-%20Opp%20Character%20Specific%20Win%20Rates.user.js
// @updateURL https://update.greasyfork.org/scripts/494317/Wavu%20Wank%20-%20Opp%20Character%20Specific%20Win%20Rates.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    const SCORE_INDEX = 2;
    const CHARACTER_INDEX = 5;
    const CHARACTERS = [
        'Kazuya',
        'Jin',
        'King',
        'Jun',
        'Paul',
        'Law',
        'Jack-8',
        'Lars',
        'Xiaoyu',
        'Nina',
        'Leroy',
        'Asuka',
        'Lili',
        'Bryan',
        'Hwoarang',
        'Claudio',
        'Azucena',
        'Raven',
        'Leo',
        'Steve',
        'Kuma',
        'Yoshimitsu',
        'Shaheen',
        'Dragunov',
        'Feng',
        'Panda',
        'Lee',
        'Alisa',
        'Zafina',
        'Devil Jin',
        'Victor',
        'Reina',
        'Eddy'
    ]
 
    // Get match history table
    let table = document.querySelectorAll('table[style="text-align: center"')[0];
    let rows = table.children[1].children;
 
    let totalGamesMap = new Map();
    let winCountMap = new Map();
    let winRateMap = new Map();
 
    // Set default values for maps
    for (let character of CHARACTERS) {
        totalGamesMap.set(character, 0);
        winCountMap.set(character, 0);
        winRateMap.set(character, '-1');
    }
 
    // Increment total games and wins
    for (let row of rows) {
        let score = row.children[SCORE_INDEX].innerText;
        let character = row.children[CHARACTER_INDEX].innerText;
 
        totalGamesMap.set(character, totalGamesMap.get(character) + 1)
        if (score.includes('WIN')) {
            winCountMap.set(character, winCountMap.get(character) + 1);
        }
    }
 
    // Calculate win rates and accumulate overall win rate
    let overall = 0;
    let validCount = 0;
    for (let [character, totalGames] of totalGamesMap) {
        let winCount = winCountMap.get(character);
        let winRate = (winCount / totalGames);
        if (totalGames != 0) {
            winRateMap.set(character, winRate);
            overall += winRate;
            validCount++;
        }
    }
    let overallRate = overall / validCount;
 
    // Sort by descending win rate
    winRateMap = new Map([...winRateMap].sort((a, b) => b[1] - a[1]));
 
    // Build overall win rate table
    let overallRateColor;
    if (overallRate >= .5) {
        overallRateColor = 'win';
    } else {
        overallRateColor = 'lose';
    }
    let overallRateString = (overallRate * 100).toFixed(0) + '%';
    let winRateTable = '<div><table style="text-align: center; margin-bottom: 1rem">';
    winRateTable +=
        `<thead>
            <tr class="header">
                <th>Overall win rate</th>
            </tr>
        </thead>
        <tr>
            <td><span class="${overallRateColor}"><b>${overallRateString}</b></span></td>
        </tr>
        </table>`;
 
    // Build individual character win rate table
    let charactersIterator = winRateMap.keys();
    let index = 0;
    winRateTable += '<table style="text-align: center; float: left; margin-right: 2rem">';
    winRateTable +=
        `<thead>
            <tr class="header">
                <th>Opp. char</th>
                <th>Win rate</th>
                <th>Total games</th>
            </tr>
        </thead>`;
 
    // Iterate through first half of characters, building left table
    while (index < winRateMap.size / 2) {
        let character = charactersIterator.next().value;
        let winRate = '-';
        if (totalGamesMap.get(character) != 0) {
            winRate = (winRateMap.get(character) * 100).toFixed(0) + '%';
        }
        let totalGames = totalGamesMap.get(character);
        let rateColor;
        if (winRateMap.get(character) == -1) {
            rateColor = '';
        } else if (winRateMap.get(character) >= .5) {
            rateColor = 'win';
        } else {
            rateColor = 'lose';
        }
        winRateTable = winRateTable + `<tr>`;
        winRateTable = winRateTable + `<td>${character}</td>`;
        winRateTable = winRateTable + `<td><span class="${rateColor}">${winRate}</span></td>`;
        winRateTable = winRateTable + `<td>${totalGames}</td>`;
        winRateTable = winRateTable + `</tr>`;
        index++;
    }
    winRateTable += '</table>';
 
    if (winRateMap.size > 1) {
        winRateTable += '<table style="text-align: center">';
        winRateTable +=
            `<thead>
                <tr class="header">
                    <th>Opp. char</th>
                    <th>Win rate</th>
                    <th>Total games</th>
                </tr>
            </thead>`;
 
        // Iterate through first half of characters, building right table
        while (index < winRateMap.size) {
            let character = charactersIterator.next().value;
            let winRate = '-';
            if (totalGamesMap.get(character) != 0) {
                winRate = (winRateMap.get(character) * 100).toFixed(0) + '%';
            }
            let totalGames = totalGamesMap.get(character);
            let rateColor;
            if (winRateMap.get(character) == -1) {
                rateColor = '';
            } else if (winRateMap.get(character) >= .5) {
                rateColor = 'win';
            } else {
                rateColor = 'lose';
            }
            winRateTable = winRateTable + `<tr>`;
            winRateTable = winRateTable + `<td>${character}</td>`;
            winRateTable = winRateTable + `<td><span class="${rateColor}">${winRate}</span></td>`;
            winRateTable = winRateTable + `<td>${totalGames}</td>`;
            winRateTable = winRateTable + `</tr>`;
            index++;
        }
 
        // If the amount of characters are odd, then pad an additional row to the right table
        if (winRateMap.size % 2 != 0) {
            winRateTable = winRateTable + `<tr><td>-</td><td>-</td><td>-</td></tr>`;
        }
 
        winRateTable += '</table></div>';
    }
    winRateTable += '</div>';
 
    // Prepend tables to the Replays section
    let replaysHeader = Array.from(document.querySelectorAll('h2')).find(e => e.textContent === 'Replays');
    replaysHeader.insertAdjacentHTML('beforebegin', '<h2>Win Rates</h2>');
    replaysHeader.insertAdjacentHTML('beforebegin', winRateTable);
})();