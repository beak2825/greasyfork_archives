// ==UserScript==
// @name         TMVN League HOF
// @namespace    https://trophymanager.com
// @version      6
// @description  Trophymanager: hall of fame of tournament
// @match        https://trophymanager.com/history/league/*/*/*/standings*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418934/TMVN%20League%20HOF.user.js
// @updateURL https://update.greasyfork.org/scripts/418934/TMVN%20League%20HOF.meta.js
// ==/UserScript==

(function () {
    "use strict";

    /* --------------------------- CONFIG --------------------------- */
    const CONFIG = {
        DEFAULT_SEASON_COUNT: 0,
        SEASON_COUNT_LOCAL_STORAGE_KEY: "TMVN_LEAGUE_HOF_SEASON_COUNT"
    };

    const CONTROL_ID = {
        INPUT_SEASON_COUNT: 'tmvn_league_hof_input_season_count',
        BUTTON_SEASON_COUNT: 'tmvn_league_hof_button_season_count_set'
    };

    /* --------------------------- STORAGE --------------------------- */
    const champOfSeason = new Map(); // season -> clubId (filled later with nth)
    const titleCounter = new Map(); // clubId -> cumulative #titles during scan

    const countChampions = new Map(); // clubId -> #1 titles
    const countRunnerUp = new Map(); // clubId -> #2 titles
    const countThird = new Map(); // clubId -> #3 titles
    const latestName = new Map(); // clubId -> {name, season}

    /* --------------------------- FETCH ----------------------------- */
    const currentSeason = (window.SESSION && SESSION.season) ? SESSION.season : '';

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

    function getLeagueInfo() {
        let country,
        division,
        group;
        if (window.feed_nat && window.feed_div && window.feed_gro) {
            country = String(feed_nat);
            division = String(feed_div);
            group = String(feed_gro);
        } else {
            const m = location.pathname.match(/\/league\/([^\/]+)\/(\d+)\/(\d+)/);
            if (m)
                [, country, division, group] = m;
        }
        return {
            country,
            division,
            group
        };
    }
    const info = getLeagueInfo();
    let baseUrl = `https://trophymanager.com/history/league/${info.country}/${info.division}/${info.group}/standings/`;

    let fetched = 0;
    const total = currentSeason - startSeason;

    for (let season = currentSeason - 1; season >= startSeason; season--) {
        $.ajax({
            url: baseUrl + season,
            type: "GET",
            dataType: "html",
            crossDomain: true,
            success: (html) => {
                const rows = $(".box_body .border_bottom tr", html);
                if (rows.length >= 4) {
                    for (let j = 1; j <= 3; j++) { // ranks 1‑3
                        const $row = rows.eq(j);
                        const rank = +$row.children().eq(0).text();
                        const $link = $row.find("[club_link]");
                        const clubId = $link.attr("club_link");
                        const clubName = $link.text();

                        // save latest club name (largest season number wins)
                        if (!latestName.has(clubId) || season > latestName.get(clubId).season) {
                            latestName.set(clubId, {
                                name: clubName,
                                season
                            });
                        }

                        if (rank === 1) {
                            champOfSeason.set(season, clubId);
                            increase(countChampions, clubId);
                        } else if (rank === 2) {
                            increase(countRunnerUp, clubId);
                        } else if (rank === 3) {
                            increase(countThird, clubId);
                        }
                    }
                }
                fetched++;
            },
            error: () => fetched++
        });
    }

    const waiter = setInterval(() => {
        if (fetched < total)
            return;
        clearInterval(waiter);
        computeNthTitlesAndBuild();
    }, 500);

    /* --------------------------- HELPERS --------------------------- */
    function increase(map, key) {
        map.set(key, (map.get(key) || 0) + 1);
    }

    function ensureRightColumn() {
        let $col = $(".column3_a");
        if (!$col.length) {
            $col = $("<div class='column3_a'></div>");
            if ($('#bteam_reminder').length === 1) {
                $(".main_center").eq(3).append($col);
            } else {
                $(".main_center").eq(2).append($col);
            }
            $(".column3").first().remove();
        }
        return $col;
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

    /* -------------------------- BUILD UI -------------------------- */
    function computeNthTitlesAndBuild() {
        // scan seasons ascending to compute nth title
        for (let season = startSeason; season < currentSeason; season++) {
            if (!champOfSeason.has(season))
                continue;
            const clubId = champOfSeason.get(season);
            const nth = (titleCounter.get(clubId) || 0) + 1;
            titleCounter.set(clubId, nth);
            champOfSeason.set(season, {
                clubId,
                nth
            });
        }

        const $column = ensureRightColumn();

        buildChampionsBox($column);
        buildHofBox($column);
        buildConfigBox($column);
    }

    /* -------------- BOX 1: Champions by season -------------- */
    function buildChampionsBox($column) {
        const boxId = "tmvn_champions_box";
        if (document.getElementById(boxId))
            return;

        const $box = $(
                `<div class="box">
                <div class="box_head"><h2 class="std">CHAMPION LIST</h2></div>
                <div class="box_body"><div class="box_shadow"></div>
                    <div id="${boxId}" class="content_menu"></div>
                </div>
                <div class="box_footer"><div></div></div>
            </div>`);
        $column.append($box);

        let html = `<table><tr><th>Season</th><th>Club</th><th align='right'>nth</th></tr>`;
        let row = 0;
        for (let season = currentSeason - 1; season >= startSeason; season--) {
            const entry = champOfSeason.get(season);
            if (!entry)
                continue;
            const {
                clubId,
                nth
            } = entry;
            const clubName = latestName.get(clubId).name;
            row++;
            const odd = row % 2 ? "class='odd'" : "";
            html += `<tr ${odd}>
                        <td>${season}</td>
                        <td><span style='cursor:pointer' onclick="window.open('https://trophymanager.com/club/${clubId}')">${clubName}</span></td>
                        <td align='right'>${nth}</td>
                     </tr>`;
        }
        html += `</table>`;
        $("#" + boxId).append(html);
    }

    /* -------------- BOX 2: Hall of Fame -------------- */
    function buildHofBox($column) {
        const boxId = "tmvn_hof_box";
        if (document.getElementById(boxId))
            return;

        const $box = $(
                `<div class="box">
                <div class="box_head"><h2 class="std">HALL OF FAME</h2></div>
                <div class="box_body"><div class="box_shadow"></div>
                    <div id="${boxId}" class="content_menu"></div>
                </div>
                <div class="box_footer"><div></div></div>
            </div>`);
        $column.append($box);

        // build sortable array of clubs with score champion*1000 + runner*100 + third
        const clubScores = [];
        const allClubIds = new Set([...countChampions.keys(), ...countRunnerUp.keys(), ...countThird.keys()]);
        allClubIds.forEach(clubId => {
            const champ = countChampions.get(clubId) || 0;
            const run = countRunnerUp.get(clubId) || 0;
            const third = countThird.get(clubId) || 0;
            const score = champ * 1000 + run * 100 + third;
            if (score > 0)
                clubScores.push({
                    clubId,
                    champ,
                    run,
                    third,
                    score
                });
        });
        clubScores.sort((a, b) => b.score - a.score);

        let html = `<table><tr><th>#</th><th>Club</th><th align='right'>#1</th><th align='right'>#2</th><th align='right'>#3</th></tr>`;
        clubScores.forEach((c, idx) => {
            const odd = (idx + 1) % 2 ? "class='odd'" : "";
            const clubName = latestName.get(c.clubId).name;
            html += `<tr ${odd}>
                        <td>${idx + 1}</td>
                        <td><span style='cursor:pointer' onclick="window.open('https://trophymanager.com/club/${c.clubId}')">${clubName}</span></td>
                        <td align='right'>${c.champ || ""}</td>
                        <td align='right'>${c.run || ""}</td>
                        <td align='right'>${c.third || ""}</td>
                      </tr>`;
        });
        html += `</table>`;
        $("#" + boxId).append(html);
    }

    /* -------------- BOX 3: Config -------------- */
    function buildConfigBox($column) {
        const boxId = "tmvn_league_hof_config";
        if (document.getElementById(boxId))
            return;

        // Load season count from localStorage
        let savedSeasonCount = localStorage.getItem(CONFIG.SEASON_COUNT_LOCAL_STORAGE_KEY);
        if (savedSeasonCount == null || savedSeasonCount == "") {
            savedSeasonCount = CONFIG.DEFAULT_SEASON_COUNT;
        }

        const $box = $(
                `<div class="box" id="${boxId}">
                <div class="box_head"><h2 class="std">CONFIG</h2></div>
                <div class="box_body">
                    <div class="box_shadow"></div>
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
                <div class="box_footer"><div></div></div>
            </div>`);
        $column.append($box);

        // Add event listener for button
        document.getElementById(CONTROL_ID.BUTTON_SEASON_COUNT).addEventListener('click', setSeasonCount);
    }
})();
