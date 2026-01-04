// ==UserScript==
// @name         Tabulka s API infosys
// @namespace    http://tampermonkey.net/
// @version      2025-06-26
// @description  Generuje v záložce Draws tabulku s odkazy do API Infosys
// @license      MIT
// @author       JV
// @match        https://www.atptour.com/en/scores/*/*/draws
// @match        https://www.atptour.com/en/scores/*/*/draws?matchtype=singles
// @match        https://www.atptour.com/en/scores/*/*/draws?matchtype=doubles
// @match        https://www.atptour.com/en/scores/*/*/draws?matchtype=qualifiersingles
// @match        https://www.atptour.com/en/scores/*/*/draws?matchtype=qualifierdoubles
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atptour.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538308/Tabulka%20s%20API%20infosys.user.js
// @updateURL https://update.greasyfork.org/scripts/538308/Tabulka%20s%20API%20infosys.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === ČÁST 1: úprava odkazů ===
    var a = document.querySelectorAll('.stats-cta > a:nth-child(1)');
    var year = document.querySelector('.date-location > span:last-child').textContent.trim().match(/[0-9]{4}$/);
    var tourID = window.location.href.match(/\/([0-9]+)\//)[1];
    var tourTypeMatch = document.querySelector('.atp_draw > div > ul > li.active > a').textContent.trim();
    var tourType;
    if (tourTypeMatch == "Singles") tourType = "ms";
    if (tourTypeMatch == "Doubles") tourType = "md";
    if (tourTypeMatch == "Qual Singles") tourType = "qs";
    if (tourTypeMatch == "Qual Doubles") tourType = "qd";

    var matchCount = a.length;
    var there_are_12 = ["008", "009", "010", "011", "012", "013", "014", "015", "004", "005", "006", "007"];
    var there_are_31 = ["016", "017", "018", "019", "020", "021", "022", "023", "024", "025", "026", "027", "028", "029", "030", "031", "008", "009", "010", "011", "012", "013", "014", "015", "004", "005", "006", "007", "002", "003", "001"];
    var there_are_63 = ["032", "033", "034", "035", "036", "037", "038", "039", "040", "041", "042", "043", "044", "045", "046", "047", "048", "049", "050", "051", "052", "053", "054", "055", "056", "057", "058", "059", "060", "061", "062", "063", "016", "017", "018", "019", "020", "021", "022", "023", "024", "025", "026", "027", "028", "029", "030", "031", "008", "009", "010", "011", "012", "013", "014", "015", "004", "005", "006", "007", "002", "003", "001"];
    var there_are_15 = ["008", "009", "010", "011", "012", "013", "014", "015", "004", "005", "006", "007", "002", "003", "001"];
    var there_are_3 = ["002", "003", "001"];
    var there_are_18 = ["016", "017", "018", "019", "020", "021", "022", "023", "024", "025", "026", "027", "008", "009", "010", "011", "012", "013"];
    var there_are_21 = ["016", "017", "018", "019", "020", "021", "022", "023", "024", "025", "026", "027", "028", "029", "009", "010", "011", "012", "013", "014", "015"];
    var there_are_36 = ["032", "033", "034", "035", "036", "037", "038", "039", "040", "041", "042", "043", "044", "045", "046", "047", "048", "049", "050", "051", "052", "053", "054", "055", "016", "017", "018", "019", "020", "021", "022", "023", "024", "025", "026", "027"];
    var there_are_127 = ["064", "065", "066", "067", "068", "069", "070", "071", "072", "073", "074", "075", "076", "077", "078", "079", "080", "081", "082", "083", "084", "085", "086", "087", "088", "089", "090", "091", "092", "093", "094", "095", "096", "097", "098", "099", "100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "032", "033", "034", "035", "036", "037", "038", "039", "040", "041", "042", "043", "044", "045", "046", "047", "048", "049", "050", "051", "052", "053", "054", "055", "056", "057", "058", "059", "060", "061", "062", "063", "016", "017", "018", "019", "020", "021", "022", "023", "024", "025", "026", "027", "028", "029", "030", "031", "008", "009", "010", "011", "012", "013", "014", "015", "004", "005", "006", "007", "002", "003", "001"];

    var map = {
        [there_are_12.length]: there_are_12,
        [there_are_31.length]: there_are_31,
        [there_are_63.length]: there_are_63,
        [there_are_15.length]: there_are_15,
        [there_are_3.length]: there_are_3,
        [there_are_18.length]: there_are_18,
        [there_are_21.length]: there_are_21,
        [there_are_36.length]: there_are_36,
        [there_are_127.length]: there_are_127
    };

    var list = map[matchCount];
    if (list) {
        for (var i = 0; i < matchCount; i++) {
            var value = "/en/scores/stats-centre/live/" + year + "/" + tourID + "/" + tourType + list[i];
            a[i].setAttribute("href", value);
        }
    }

    // === ČÁST 2: čekání a vytvoření tabulky ===
    const maxWaitTime = 10000;
    const checkInterval = 500;
    let waited = 0;

    const waitForLinks = setInterval(() => {
        const links = Array.from(document.querySelectorAll('a[href*="/stats-centre/live/"]'));

        if (links.length > 0 || waited >= maxWaitTime) {
            clearInterval(waitForLinks);
            if (links.length === 0) {
                console.warn("⛔ Nenašly se žádné odkazy na zápasy.");
                return;
            }

            const uniqueLinks = new Set();
            const rows = [];

            links.forEach(link => {
                const href = link.getAttribute('href');
                const match = href.match(/live\/(\d{4})\/(\d+)\/([A-Z0-9]+)/i);
                if (match) {
                    const year = match[1];
                    const eventId = match[2];
                    const matchId = match[3].toUpperCase();
                    const apiUrl = `https://itp-atp-sls.infosys-platforms.com/prod/api/stats-plus/v1/keystats/year/${year}/eventId/${eventId}/matchId/${matchId}`;
                    const key = `${year}-${eventId}-${matchId}`;

                    if (!uniqueLinks.has(key)) {
                        uniqueLinks.add(key);

                        const container = link.closest('.draw-item');

                        // Rozlišení čtyřhra vs singl podle struktury
                        let players = [];

                        // Pokud je čtyřhra: hledáme 2 týmy po 2 hráčích
                        let playersContainers = container.querySelectorAll('.player-info .players');
                        if (playersContainers.length === 2) {
                            // Každý tým má dvě jména v rámci .names .name a
                            for (let i = 0; i < 2; i++) {
                                const namesEls = playersContainers[i].querySelectorAll('.names .name a');
                                for (const nameEl of namesEls) {
                                    let name = nameEl.textContent.trim();
                                    // Vlajka hledáme blízko u hráče
                                    let flagEl = nameEl.closest('.name').querySelector('.flag img');
                                    let flag = flagEl ? `<img src="${flagEl.src}" alt="" style="height:12px;vertical-align:middle;margin-right:4px;">` : '';
                                    players.push({ name, flag, team: i === 0 ? 'home' : 'away' });
                                }
                            }
                        } else {
                            // Singl - jen 1 hráč na tým - klasicky
                            let playerEls = container.querySelectorAll('.player-info .name a');
                            let flagEls = container.querySelectorAll('.player-info .flag img');
                            for (let i = 0; i < playerEls.length; i++) {
                                let name = playerEls[i].textContent.trim();
                                let flag = flagEls[i] ? `<img src="${flagEls[i].src}" alt="" style="height:12px;vertical-align:middle;margin-right:4px;">` : '';
                                // 1. hráč domácí, 2. hostující
                                let team = i === 0 ? 'home' : 'away';
                                players.push({ name, flag, team });
                            }
                        }

                        // Rozdělení do domácích a hostů
                        let homePlayers = players.filter(p => p.team === 'home');
                        let awayPlayers = players.filter(p => p.team === 'away');

                        // Když domácí jsou TBA (např. oba), necháme je, hosty taky zobrazíme
                        let player1 = homePlayers.length > 0
                            ? homePlayers.map(p => `${p.flag}<b>${p.name}</b>`).join('/')
                            : "<i>TBA</i>";

                        let player2 = awayPlayers.length > 0
                            ? awayPlayers.map(p => `${p.flag}<b>${p.name}</b>`).join('/')
                            : "<i>TBA</i>";

                        rows.push(`
                            <tr>
                                <td>${player1}</td>
                                <td>${player2}</td>
                                <td>${matchId}</td>
                                <td><a href="${apiUrl}" target="_blank">Infosys API</a></td>
                            </tr>`);
                    }
                }
            });

            // Vytvoření tabulky
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr style="background:#ddd;">
                        <th>Domácí hráč</th>
                        <th>Hostující hráč</th>
                        <th>Match ID</th>
                        <th>Odkaz</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.join('\n')}
                </tbody>
            `;
            table.style.borderCollapse = 'collapse';
            table.style.width = '172%';
            table.style.margin = '4px 0';
            table.style.fontSize = '18px';
            table.querySelectorAll('td, th').forEach(cell => {
                cell.style.border = '0.5px solid #ccc';
                cell.style.padding = '2px 4px';
                cell.style.textAlign = 'left';
                cell.style.verticalAlign = 'middle';
                cell.style.fontSize = '15px';
            });

            const sidebar = document.querySelector('.atp_layout-sidebar');
            if (sidebar) {
                sidebar.innerHTML = '';
                sidebar.appendChild(table);
            } else {
                document.body.prepend(table);
            }
        }

        waited += checkInterval;
    }, checkInterval);
})();