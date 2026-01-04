// ==UserScript==
// @name         MLB Scores - Pitcher statistiky
// @namespace    https://www.mlb.com/
// @version      4.1
// @description  Vytvoří tabulku s pitching stats pro každý tým zvlášť (HOME/AWAY), bez sloupce Datum, vhodné pro další zpracování.
// @author       Lukas Malec
// @license      MIT
// @match        https://www.mlb.com/scores
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534906/MLB%20Scores%20-%20Pitcher%20statistiky.user.js
// @updateURL https://update.greasyfork.org/scripts/534906/MLB%20Scores%20-%20Pitcher%20statistiky.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const teamMap = {
        "D-backsAZ": "Arizona Diamondbacks", "BravesATL": "Atlanta Braves", "OriolesBAL": "Baltimore Orioles",
        "Red SoxBOS": "Boston Red Sox", "CubsCHC": "Chicago Cubs", "White SoxCWS": "Chicago White Sox",
        "RedsCIN": "Cincinnati Reds", "GuardiansCLE": "Cleveland Guardians", "RockiesCOL": "Colorado Rockies",
        "TigersDET": "Detroit Tigers", "AstrosHOU": "Houston Astros", "RoyalsKC": "Kansas City Royals",
        "AngelsLAA": "Los Angeles Angels", "DodgersLAD": "Los Angeles Dodgers", "MarlinsMIA": "Miami Marlins",
        "BrewersMIL": "Milwaukee Brewers", "TwinsMIN": "Minnesota Twins", "MetsNYM": "New York Mets",
        "YankeesNYY": "New York Yankees", "AthleticsATH": "Oakland Athletics", "PhilliesPHI": "Philadelphia Phillies",
        "PiratesPIT": "Pittsburgh Pirates", "PadresSD": "San Diego Padres", "GiantsSF": "San Francisco Giants",
        "MarinersSEA": "Seattle Mariners", "CardinalsSTL": "St.Louis Cardinals", "RaysTB": "Tampa Bay Rays",
        "RangersTEX": "Texas Rangers", "Blue JaysTOR": "Toronto Blue Jays", "NationalsWSH": "Washington Nationals"
    };

    async function fetchPitcherStats(playerId) {
        try {
            const url = `https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=season&group=pitching`;
            const response = await fetch(url);
            const data = await response.json();
            const stats = data.stats?.[0]?.splits?.[0]?.stat;
            if (!stats) return {};

            const ip = parseFloat(stats.inningsPitched || 0);
            const so = parseFloat(stats.strikeOuts || 0);
            const bb = parseFloat(stats.baseOnBalls || 0);
            const hr = parseFloat(stats.homeRuns || 0);
            const go = parseFloat(stats.groundOuts || 0);
            const ao = parseFloat(stats.airOuts || 1);

            return {
                era: stats.era || '-',
                whip: stats.whip || '-',
                so: stats.strikeOuts || '-',
                ip: stats.inningsPitched || '-',
                baa: stats.avg || '-',
                k9: ip > 0 ? (so / ip * 9).toFixed(2) : '-',
                bb9: ip > 0 ? (bb / ip * 9).toFixed(2) : '-',
                hr9: ip > 0 ? (hr / ip * 9).toFixed(2) : '-',
                goao: ao > 0 ? (go / ao).toFixed(2) : '-'
            };
        } catch {
            return {};
        }
    }

    async function getPitcherRows() {
        const gameContainers = document.querySelectorAll('[data-test-mlb="singleGameContainer"]');
        const rows = [];

        for (const container of gameContainers) {
            const gameText = container.textContent;
            if (/\b(TOP|BOT)\s?[1-9]\b/.test(gameText)) continue;

            const teamLabels = container.querySelectorAll('[data-testid="teamNameLabel"]');
            const pitcherLinks = container.querySelectorAll('a[href^="/player/"]');

            if (teamLabels.length < 2 || pitcherLinks.length < 2) continue;

            const homeRaw = teamLabels[1].textContent.trim();
            const awayRaw = teamLabels[0].textContent.trim();
            const homeTeam = teamMap[homeRaw] || homeRaw;
            const awayTeam = teamMap[awayRaw] || awayRaw;

            const homePitcherAnchor = pitcherLinks[1];
            const awayPitcherAnchor = pitcherLinks[0];

            const homePitcherName = homePitcherAnchor.querySelector('[data-testid="playerNameLinks"]')?.textContent.trim() || '';
            const homePitcherId = homePitcherAnchor.href.match(/(\d+)$/)?.[1] || '';

            const awayPitcherName = awayPitcherAnchor.querySelector('[data-testid="playerNameLinks"]')?.textContent.trim() || '';
            const awayPitcherId = awayPitcherAnchor.href.match(/(\d+)$/)?.[1] || '';

            const [homeStats, awayStats] = await Promise.all([
                fetchPitcherStats(homePitcherId),
                fetchPitcherStats(awayPitcherId)
            ]);

            rows.push({
                team: homeTeam,
                pitcher: homePitcherName,
                type: 'HOME',
                ...homeStats
            });

            rows.push({
                team: awayTeam,
                pitcher: awayPitcherName,
                type: 'AWAY',
                ...awayStats
            });
        }

        return rows;
    }

    function renderPitcherTable(data) {
        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'relative', zIndex: '10000', background: '#fff',
            padding: '16px', border: '1px solid #ccc', margin: '20px auto',
            overflowX: 'auto', maxWidth: '95%', maxHeight: '80vh', overflowY: 'auto'
        });

        const table = document.createElement('table');
        Object.assign(table.style, { borderCollapse: 'collapse', fontSize: '13px', width: '100%' });

        const headers = ['Tým', 'Pitcher', 'Typ', 'ERA', 'WHIP', 'SO', 'IP', 'BAA', 'K/9', 'BB/9', 'HR/9', 'GO/AO'];
        const headerRow = document.createElement('tr');
        headers.forEach(h => {
            const th = document.createElement('th');
            th.textContent = h;
            Object.assign(th.style, { border: '1px solid #000', padding: '6px', background: '#f0f0f0' });
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        data.forEach(row => {
            const tr = document.createElement('tr');
            [
                row.team, row.pitcher, row.type, row.era, row.whip, row.so, row.ip,
                row.baa, row.k9, row.bb9, row.hr9, row.goao
            ].forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                Object.assign(td.style, { border: '1px solid #000', padding: '6px', whiteSpace: 'nowrap' });
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        container.appendChild(table);
        const mainContent = document.querySelector('main');
        (mainContent || document.body).appendChild(container);
    }

    function addTriggerButton() {
        const btn = document.createElement('button');
        btn.textContent = '📊 Načíst pitching statistiky (týmově)';
        Object.assign(btn.style, {
            position: 'fixed', top: '10px', left: '10px', zIndex: '9999',
            padding: '10px 16px', backgroundColor: '#28a745', color: 'white',
            border: 'none', borderRadius: '6px', cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
        });

        btn.onclick = async () => {
            const check = setInterval(async () => {
                const ready = document.querySelectorAll('[data-test-mlb="singleGameContainer"]').length > 0 &&
                    document.querySelectorAll('a[href^="/player/"]').length > 0;
                if (ready) {
                    clearInterval(check);
                    const data = await getPitcherRows();
                    renderPitcherTable(data);
                    btn.remove();
                }
            }, 500);
        };

        document.body.appendChild(btn);
    }

    window.addEventListener('load', addTriggerButton);
})();