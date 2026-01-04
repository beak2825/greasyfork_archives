// ==UserScript==
// @name         MLB-Náhradní přidání z api
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Tabulka na api mlb, možno přidat při změně datumu v url
// @match        https://statsapi.mlb.com/api/v1.1/game/*/feed/live
// @license      MIT
// @author       Lukas Malec
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539155/MLB-N%C3%A1hradn%C3%AD%20p%C5%99id%C3%A1n%C3%AD%20z%20api.user.js
// @updateURL https://update.greasyfork.org/scripts/539155/MLB-N%C3%A1hradn%C3%AD%20p%C5%99id%C3%A1n%C3%AD%20z%20api.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const url = window.location.href;
    const data = await fetch(url).then(res => res.json());

    const homeTeam = data?.gameData?.teams?.home?.name || 'HOME';
    const awayTeam = data?.gameData?.teams?.away?.name || 'AWAY';

    // Fáze zápasu (původní status)
    const phase = data?.gameData?.status?.detailedState || '---';

    // Aktuální inning (Top/Mid X)
    const linescore = data?.liveData?.linescore || {};
    const inningHalf = linescore?.inningHalf || '';
    const currentInning = linescore?.currentInning || '';

    let status;
if (inningHalf && currentInning) {
    if (inningHalf === "Top" && currentInning == 1) {
        status = "";
    } else if (inningHalf === "Top") {
        status = "Top " + currentInning;
    } else if (inningHalf === "Bottom") {
        status = "Mid " + currentInning;
    } else {
        status = "---";
    }
} else {
    status = "---";
}

    // R, H, E
    const home = linescore?.teams?.home || {};
    const away = linescore?.teams?.away || {};

    // Detailní batting stats (boxscore)
    const homeBat = data?.liveData?.boxscore?.teams?.home?.teamStats?.batting || {};
    const awayBat = data?.liveData?.boxscore?.teams?.away?.teamStats?.batting || {};

    // Overlay background
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(30,40,60,0.65); z-index: 99999; display: flex;
        align-items: center; justify-content: center;
    `;

    // Tabulka
    const tbl = document.createElement('table');
    tbl.style.cssText = `
        border-collapse: collapse; width: 540px; background: #fff;
        font-family: sans-serif; font-size: 1.1em;
        box-shadow: 0 4px 32px #2228;
        border-radius: 16px; overflow: hidden;
    `;

    // Statistika: [Label, homeKlíč, awayKlíč, id_suffix]
    // 'linescoreLOB' je speciální případ, bere se z linescore, ne z batting
    const stats = [
        ['2B (Doubles)',   'doubles',    'doubles',    'Doubles'],
        ['3B (Triples)',   'triples',    'triples',    'Triples'],
        ['Home Runs',      'homeRuns',   'homeRuns',   'HomeRuns'],
        ['At bat',         'atBats',     'atBats',     'AtBats'],
        ['Base on Balls',  'baseOnBalls','baseOnBalls','BaseOnBalls'],
        ['Strikeouts',     'strikeOuts', 'strikeOuts', 'StrikeOuts'],
        ['Left on base',   'linescoreLOB','linescoreLOB','LeftOnBase'],
        ['Stolen bases',   'stolenBases','stolenBases','StolenBases'],
        ['Runs batted in', 'rbi',        'rbi',        'RBI'],
    ];

    // Definice řádků základních (bez batting)
    const rows = [
        ['Teams', homeTeam, awayTeam],
        ['Fáze zápasu', phase, '', 'phase'],
        ['Status', status, '', 'status'],
        ['Runs', home.runs ?? '-', away.runs ?? '-'],
        ['Hits', home.hits ?? '-', away.hits ?? '-'],
        ['Errors', home.errors ?? '-', away.errors ?? '-']
    ];

    // Přidat batting stats (s přesným LOB)
    stats.forEach(([label, homeKey, awayKey, suf]) => {
        let homeVal, awayVal;
        if (homeKey === 'linescoreLOB') {
            homeVal = linescore?.teams?.home?.leftOnBase ?? '-';
            awayVal = linescore?.teams?.away?.leftOnBase ?? '-';
        } else {
            homeVal = homeBat[homeKey] ?? '-';
            awayVal = awayBat[awayKey] ?? '-';
        }
        rows.push([
            label,
            homeVal,
            awayVal,
            suf
        ]);
    });

    // Generování řádků
    rows.forEach(([label, homeVal, awayVal, id], idx) => {
        const tr = document.createElement('tr');
        // První sloupec s názvem řádku
        const tdLabel = document.createElement(idx === 0 ? 'th' : 'td');
        tdLabel.textContent = label;
        tdLabel.style.cssText = 'border: 1px solid #666; padding: 10px; text-align: center; background: #f6f8fa;';
        if (idx === 0) tdLabel.style.background = '#e0e0e0';
        tr.appendChild(tdLabel);

        if (label === 'Fáze zápasu' || label === 'Status') {
            // Sloučená buňka přes dva sloupce, s id (phase/status)
            const tdStatus = document.createElement('td');
            tdStatus.textContent = homeVal;
            tdStatus.colSpan = 2;
            tdStatus.id = id || '';
            tdStatus.style.cssText = 'border: 1px solid #666; padding: 10px; text-align: center; background: #d0e8f7; font-weight: bold;';
            tr.appendChild(tdStatus);
        } else {
            // Druhý sloupec (home)
            const tdHome = document.createElement(idx === 0 ? 'th' : 'td');
            tdHome.textContent = homeVal;
            tdHome.id = 'home' + (id ? id : label.replace(/[^a-z0-9]/gi,''));
            tdHome.style.cssText = 'border: 1px solid #666; padding: 10px; text-align: center; background: #f6f8fa;';
            if (idx === 0) tdHome.style.background = '#e0e0e0';
            tr.appendChild(tdHome);

            // Třetí sloupec (away)
            const tdAway = document.createElement(idx === 0 ? 'th' : 'td');
            tdAway.textContent = awayVal;
            tdAway.id = 'away' + (id ? id : label.replace(/[^a-z0-9]/gi,''));
            tdAway.style.cssText = 'border: 1px solid #666; padding: 10px; text-align: center; background: #f6f8fa;';
            if (idx === 0) tdAway.style.background = '#e0e0e0';
            tr.appendChild(tdAway);
        }
        tbl.appendChild(tr);
    });

    overlay.appendChild(tbl);
    document.body.appendChild(overlay);

})();