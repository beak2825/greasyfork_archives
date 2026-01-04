// ==UserScript==
// @name         TMVN Cup HOF
// @namespace    https://trophymanager.com
// @version      5
// @description  Trophymanager: hall of fame of tournament
// @match        https://trophymanager.com/history/cup/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418935/TMVN%20Cup%20HOF.user.js
// @updateURL https://update.greasyfork.org/scripts/418935/TMVN%20Cup%20HOF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* --------------------------- CONFIG --------------------------- */
    const CONFIG = {
        DEFAULT_SEASON_COUNT: 0,
        SEASON_COUNT_LOCAL_STORAGE_KEY: "TMVN_CUP_HOF_SEASON_COUNT"
    };

    const CONTROL_ID = {
        INPUT_SEASON_COUNT: 'tmvn_cup_hof_input_season_count',
        BUTTON_SEASON_COUNT: 'tmvn_cup_hof_button_season_count_set'
    };

    /* --------------------------- STORE --------------------------- */
    const championsBySeason = new Map(); // season -> {id, nth}
    const championIdOfSeason = new Map(); // season -> clubId (raw, before nth calc)
    const titleCounter = new Map(); // clubId -> running nth counter
    const clubNameById = new Map(); // clubId -> latest name

    const cupChampTotal = new Map(); // clubId -> #champion
    const cupRunnerTotal = new Map(); // clubId -> #runner‑up
    const cupThirdTotal = new Map(); // clubId -> #third place
    const lastSeasonAppear = new Map(); // clubId -> most recent season they reached final/semi

    /* --------------------------- HELPERS ------------------------- */
    const inc = (map, key) => map.set(key, (map.get(key) || 0) + 1);

    function ensureRightColumn() {
        let column = document.querySelector('div.column3_a');
        if (!column) {
            const old = document.querySelector('div.column3');
            if (old)
                old.parentNode.removeChild(old);
            column = document.createElement('div');
            column.className = 'column3_a';
            const centers = document.querySelectorAll('div.main_center');
            const target = centers[centers.length === 4 ? 3 : 2];
            target.appendChild(column);
        }
        return column;
    }

    function renderConfigPanel() {
        const col = ensureRightColumn();

        // Load season count from localStorage
        let savedSeasonCount = localStorage.getItem(CONFIG.SEASON_COUNT_LOCAL_STORAGE_KEY);
        if (savedSeasonCount == null || savedSeasonCount == "") {
            savedSeasonCount = CONFIG.DEFAULT_SEASON_COUNT;
        }

        const configHTML = `
            <div class='box' id='tmvn_cup_hof_config'>
                <div class='box_head'>
                    <h2 class='std'>CONFIG</h2>
                </div>
                <div class='box_body'>
                    <div class='box_shadow'></div>
                    <table>
                        <tr>
                            <td>
                                <span style="display: inline-block;">
                                    <input id="${CONTROL_ID.INPUT_SEASON_COUNT}"
                                           type="text"
                                           class="embossed"
                                           style="width: 150px; line-height: 100%; padding: 3px 3px 4px 3px;"
                                           placeholder="Season count"
                                           value="${savedSeasonCount}">
                                </span>
                            </td>
                            <td>
                                <span id="${CONTROL_ID.BUTTON_SEASON_COUNT}" class="button" style="margin-left: 3px;">
                                    <span class="button_border">Season count</span>
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class='box_footer'><div></div></div>
            </div>
        `;

        col.insertAdjacentHTML('beforeend', configHTML);

        // Add event listener for button
        document.getElementById(CONTROL_ID.BUTTON_SEASON_COUNT).addEventListener('click', setSeasonCount);
    }

    function setSeasonCount() {
        let seasonCount = document.getElementById(CONTROL_ID.INPUT_SEASON_COUNT).value;

        if (seasonCount == '') {
            localStorage.removeItem(CONFIG.SEASON_COUNT_LOCAL_STORAGE_KEY);
            alert('Season count cleared. Please refresh to show all seasons.');
        } else if (isNaN(seasonCount) || seasonCount < 0) {
            alert('Season count must be a non-negative integer. 0 means all seasons.');
        } else {
            localStorage.setItem(CONFIG.SEASON_COUNT_LOCAL_STORAGE_KEY, seasonCount);
            alert('Set successful, please refresh');
        }
    }

    function renderTables() {
        /* Champions by season table (desc) */
        const seasonsDesc = Array.from(championsBySeason.keys()).sort((a, b) => b - a);
        let championsHTML = "<table><tr><th>Season</th><th>Club</th><th align='right'>Nth</th></tr>";
        seasonsDesc.forEach((season, idx) => {
            const {
                id,
                nth
            } = championsBySeason.get(season);
            const name = clubNameById.get(id);
            const odd = (idx & 1) ? " class='odd'" : "";
            championsHTML += `<tr${odd}><td>${season}</td><td><span onclick=\"window.open('https://trophymanager.com/club/${id}')\">${name}</span></td><td align='right'>${nth}</td></tr>`;
        });
        championsHTML += "</table>";

        /* Hall of Fame */
        const allIds = new Set([...cupChampTotal.keys(), ...cupRunnerTotal.keys(), ...cupThirdTotal.keys()]);
        const hofList = Array.from(allIds).sort((a, b) => {
            const scoreB = (cupChampTotal.get(b) || 0) * 10000 + (cupRunnerTotal.get(b) || 0) * 100 + (cupThirdTotal.get(b) || 0);
            const scoreA = (cupChampTotal.get(a) || 0) * 10000 + (cupRunnerTotal.get(a) || 0) * 100 + (cupThirdTotal.get(a) || 0);
            if (scoreB !== scoreA)
                return scoreB - scoreA;
            // tie‑break by most recent appearance (descending season)
            return (lastSeasonAppear.get(b) || 0) - (lastSeasonAppear.get(a) || 0);
        });
        let hofHTML = "<table><tr><th>#</th><th>Club</th><th align='right'>#1</th><th align='right'>#2</th><th align='right'>#3</th></tr>";
        hofList.forEach((id, index) => {
            const name = clubNameById.get(id);
            const c = cupChampTotal.get(id) || '';
            const r = cupRunnerTotal.get(id) || '';
            const t = cupThirdTotal.get(id) || '';
            const odd = (index & 1) ? " class='odd'" : "";
            hofHTML += `<tr${odd}><td>${index + 1}</td><td><span onclick=\"window.open('https://trophymanager.com/club/${id}')\">${name}</span></td><td align='right'>${c}</td><td align='right'>${r}</td><td align='right'>${t}</td></tr>`;
        });
        hofHTML += "</table>";

        /* inject */
        const col = ensureRightColumn();
        if (!document.getElementById('tmvn_cup_champions')) {
            col.insertAdjacentHTML('beforeend', `<div class='box' id='tmvn_cup_champions'><div class='box_head'><h2 class='std'>CHAMPION LIST</h2></div><div class='box_body'><div class='box_shadow'></div>${championsHTML}</div><div class='box_footer'><div></div></div></div>`);
        } else {
            document.querySelector('#tmvn_cup_champions .box_body').innerHTML = `<div class='box_shadow'></div>${championsHTML}`;
        }
        if (!document.getElementById('tmvn_cup_hof')) {
            col.insertAdjacentHTML('beforeend', `<div class='box' id='tmvn_cup_hof'><div class='box_head'><h2 class='std'>HALL OF FAME</h2></div><div class='box_body'><div class='box_shadow'></div>${hofHTML}</div><div class='box_footer'><div></div></div></div>`);
        } else {
            document.querySelector('#tmvn_cup_hof .box_body').innerHTML = `<div class='box_shadow'></div>${hofHTML}`;
        }

        // Render CONFIG panel at the end
        renderConfigPanel();
    }

    /* --------------------------- SCAN --------------------------- */
    const currentSeason = parseInt(document.querySelector('#top_menu a.none.white.small').innerText.split(/(\s+)/)[2], 10);
    const country = location.href.split('/')[5];

    // Load season count from localStorage
    let seasonCount = localStorage.getItem(CONFIG.SEASON_COUNT_LOCAL_STORAGE_KEY);
    if (seasonCount == null || seasonCount == "") {
        seasonCount = CONFIG.DEFAULT_SEASON_COUNT;
    } else {
        seasonCount = parseInt(seasonCount, 10);
    }

    // Calculate start season based on seasonCount
    let startSeason = 1;
    if (seasonCount > 0 && seasonCount < currentSeason) {
        startSeason = currentSeason - seasonCount;
    }

    let scanned = 0;
    const totalScans = currentSeason - startSeason;

    for (let season = startSeason; season < currentSeason; season++) {
        $.ajax(`https://trophymanager.com/history/cup/${country}/${season}`, {
            type: 'GET',
            dataType: 'html',
            crossDomain: true,
            success: response => {
                const matches = $('.match_list.border_bottom li', response);

                // Trận chung kết
                const final = matches[0];
                if (final) {
                    const a = final.querySelectorAll('a');
                    const id1 = a[0].getAttribute('club_link');
                    const id2 = a[2].getAttribute('club_link');
                    const name1 = a[0].innerText;
                    const name2 = a[2].innerText;
                    clubNameById.set(id1, name1);
                    clubNameById.set(id2, name2);
                    const [s1, s2] = a[1].innerText.split('-').map(n => parseInt(n, 10));
                    const champId = s1 > s2 ? id1 : id2;
                    const runId = s1 > s2 ? id2 : id1;

                    championIdOfSeason.set(season, champId);

                    inc(cupChampTotal, champId);
                    inc(cupRunnerTotal, runId);

                    lastSeasonAppear.set(champId, season);
                    lastSeasonAppear.set(runId, season);
                }

                // 2 trận bán kết
                const semi1 = matches[1];
                const semi2 = matches[2];

                // Xử lý bán kết 1
                if (semi1) {
                    const a = semi1.querySelectorAll('a');
                    const id1 = a[0].getAttribute('club_link');
                    const id2 = a[2].getAttribute('club_link');
                    const name1 = a[0].innerText;
                    const name2 = a[2].innerText;
                    clubNameById.set(id1, name1);
                    clubNameById.set(id2, name2);
                    const [s1, s2] = a[1].innerText.split('-').map(n => parseInt(n, 10));
                    const loserId = s1 > s2 ? id2 : id1;

                    inc(cupThirdTotal, loserId);
                    lastSeasonAppear.set(loserId, season);
                }

                // Xử lý bán kết 2
                if (semi2) {
                    const a = semi2.querySelectorAll('a');
                    const id1 = a[0].getAttribute('club_link');
                    const id2 = a[2].getAttribute('club_link');
                    const name1 = a[0].innerText;
                    const name2 = a[2].innerText;
                    clubNameById.set(id1, name1);
                    clubNameById.set(id2, name2);
                    const [s1, s2] = a[1].innerText.split('-').map(n => parseInt(n, 10));
                    const loserId = s1 > s2 ? id2 : id1;

                    inc(cupThirdTotal, loserId);
                    lastSeasonAppear.set(loserId, season);
                }

                if (++scanned === totalScans)
                    finalize();
            },
            error: () => {
                if (++scanned === totalScans)
                    finalize();
            }
        });
    }

    function finalize() {
        /* compute nth titles in chronological order to avoid async issues */
        const seasonsAsc = Array.from(championIdOfSeason.keys()).sort((a, b) => a - b);
        seasonsAsc.forEach(season => {
            const champId = championIdOfSeason.get(season);
            if (!champId)
                return;
            inc(titleCounter, champId);
            const nth = titleCounter.get(champId);
            championsBySeason.set(season, {
                id: champId,
                nth
            });
        });
        renderTables();
    }
})();
