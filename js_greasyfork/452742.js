// ==UserScript==
// @name         Geoguessr duel guess times & team duels player list
// @version      1.4.0
// @description  Display guess times, rating changes for duels, and a list of players for team duels
// @match        https://www.geoguessr.com/*
// @author       victheturtle#5159
// @grant        none
// @license      MIT
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151654
// @icon         https://www.svgrepo.com/show/139928/katana.svg
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @downloadURL https://update.greasyfork.org/scripts/452742/Geoguessr%20duel%20guess%20times%20%20team%20duels%20player%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/452742/Geoguessr%20duel%20guess%20times%20%20team%20duels%20player%20list.meta.js
// ==/UserScript==

let game = {};
let doingRequest = false;
let lastUrlDone = 0;

const green = () => cn("game-summary_healing__");
const red = () => cn("game-summary_damage__");
const grey = () => cn("game-summary_smallText__");
const big_white = () => cn("game-summary_text__");
const summary_table = () => cn("game-summary_playedRounds__");
const summary_line = () => cn("game-summary_playedRound__");
const summary_text = () => cn("game-summary_text__");
const replay_header = () => cn("replay_playedRoundsHeader__");
const color = (diff) => (diff>=0) ? ((diff==0) ? grey() : green()) : red();
const greenOrGrey = (diff) => (diff>0) ? green() : grey();
const replay_compact = () => cn("game-summary_compact__");
const replay_table = () => cn("replay_playedRounds__");
const rounds_header = () => cn("game-summary_playedRoundsHeader__");
const best_guess_value = () => cn("game-summary_bestGuessValue__");
const user_nick_root = () => cn("user-nick_root__");
const user_nick_wrapper = () => cn("user-nick_nickWrapper__");
const user_nick_nick = () => cn("user-nick_nick__");
const user_nick_verified_wrapper = () => cn("user-nick_verifiedWrapper__");
const user_nick_verified = () => cn("user-nick_verified__");
const verified_badge_svg = "/_next/static/images/verified-badge-566f0efd4d90928c6e044cbe588456dc.svg"
const ignore_list = ["633a8a81af04a94fb02d8b1b", "633c8040723d43ea09977ea2"]; // Plonk It bots

const style = document.createElement("style");
document.head.appendChild(style);
style.sheet.insertRule(".GDGTtooltip { position: relative; display: inline-block; }");
style.sheet.insertRule(`.GDGTtooltip .GDGTtooltiptext {
    visibility: hidden; width: 11rem; background-color: black; color: white; text-align: center; padding: 5px 0; border-radius: 6px;
    top: 100%; left: 50%; margin-left: -5.5rem; position: absolute; z-index: 0.5; }`);
style.sheet.insertRule(".GDGTtooltip:hover .GDGTtooltiptext { visibility: visible; }");
style.sheet.insertRule('h1[class*="game-summary_summaryTitle__"] { z-index: 1 }')
style.sheet.insertRule('div[class*="game-summary_mapContainer__"] { z-index: 1 }')

function checkURL() {
    if (location.pathname.includes("duels") && location.pathname.endsWith("/summary") && document.querySelector('[class*="game-summary_playedRounds__"]') != null) return 1;
    if (location.pathname.includes("duels") && location.pathname.endsWith("/replay") && document.querySelector('[class*="replay_playedRoundsHeader__"]') != null) return 2;
    return 0;
};

function round(x) {
    return Math.round(x * 10) / 10;
}

function handleTeamDuels(isReplay) {
    const result_lines = document.getElementsByClassName(summary_line());

    const inversion = document.querySelector(`#__next div.${(isReplay) ? replay_header() : rounds_header()} img`).alt.includes(game.teams[1].name);
    const roundResults1 = game.teams[inversion ? 1 : 0].roundResults;
    const roundResults2 = game.teams[inversion ? 0 : 1].roundResults;
    const team1Players = game.teams[inversion ? 1 : 0].players;
    const team2Players = game.teams[inversion ? 0 : 1].players;

    for (let i = 0; i < result_lines.length; i++) {
        const time0 = new Date(game.rounds[i].startTime);

        // Check for no guess
        if (roundResults1[i].bestGuess == null) roundResults1[i].bestGuess = {created:NaN};
        const time1 = new Date(roundResults1[i].bestGuess.created);
        let team1Earliest = time1;

        // Loop through players to check for earlier guess
        team1Players.forEach(player => {
            if (player.guesses.length <= i || player.guesses[i].roundNumber != i+1) player.guesses.splice(i,0,{created:NaN});
            if (!isNaN(player.guesses[i]).created) {
               let tempTime = new Date(player.guesses[i].created);
               if ((tempTime - team1Earliest) < 0) {
                   team1Earliest = tempTime;
               }
            }
        })

        if (roundResults2[i].bestGuess == null) roundResults2[i].bestGuess = {created:NaN};
        const time2 = new Date(roundResults2[i].bestGuess.created);
        let team2Earliest = time2;

        // Loop through players to check for earlier guess
        team2Players.forEach(player => {
            if (player.guesses.length <= i || player.guesses[i].roundNumber != i+1) player.guesses.splice(i,0,{created:NaN});
            if (!isNaN(player.guesses[i]).created) {
                let tempTime = new Date(player.guesses[i].created);
                if ((tempTime - team2Earliest) < 0) {
                    team2Earliest = tempTime;
                }
            }
        })

        // Add tooltip on the line header text to show the full date of the round
        const header = result_lines[i].childNodes[0].childNodes[0].childNodes[0];
        header.classList.add("GDGTtooltip");
        const globalTimeText = `${game.rounds[i].startTime.substr(0, 19)} - ${game.rounds[i].endTime.substr(11, 8)}`.replace("T", "<br/>");
        header.innerHTML += `<span class="GDGTtooltiptext">${globalTimeText}</span>`;

        // If one team didn't guess, then the team that did has a green timestamp, otherwise compare
        const text1 = document.createElement("div");
        text1.classList.add(grey());
        text1.innerText = isNaN(time1) ? "-" : round((time1-time0)/1000.) + " s";
        result_lines[i].childNodes[1].appendChild(text1);

        const text2 = document.createElement("div");
        text2.classList.add(grey());
        text2.innerText = isNaN(time2) ? "-" : round((time2-time0)/1000.) + " s";
        result_lines[i].childNodes[2].appendChild(text2);

        // Add the earliest guess for each team
        const t1EarlyDiv = document.createElement("div");
        t1EarlyDiv.classList.add(isNaN(team2Earliest) ? green() : greenOrGrey(team2Earliest-team1Earliest));
        t1EarlyDiv.innerText = isNaN(team1Earliest) ? "-" : "Team Earliest: " + round((team1Earliest-time0)/1000.) + " s";
        result_lines[i].childNodes[1].appendChild(t1EarlyDiv);

        const t2EarlyDiv = document.createElement("div");
        t2EarlyDiv.classList.add(isNaN(team2Earliest) ? green() : greenOrGrey(team1Earliest-team2Earliest));
        t2EarlyDiv.innerText = isNaN(team2Earliest) ? "-" : "Team Earliest: " + round((team2Earliest-time0)/1000.) + " s";
        result_lines[i].childNodes[2].appendChild(t2EarlyDiv);
    };

    if (game.options.isRated) {
        addRatingChanges(isReplay, true, team1Players[0], team2Players[0]);
    }

    addProfileLinks(isReplay, inversion);
}

function handleDuels(isReplay) {
    const result_lines = document.getElementsByClassName(summary_line());
    const player2_link = document.getElementsByClassName((isReplay) ? replay_header() : rounds_header())[0].children[2].firstChild.href;
    const player2_id = player2_link.slice(player2_link.lastIndexOf("/")+1);
    const inversion = game.teams[1].players[0].playerId != player2_id && player2_id != "profile";
    const player1 = game.teams[inversion ? 1 : 0].players[0];
    const player2 = game.teams[inversion ? 0 : 1].players[0];
    const guesses1 = player1.guesses;
    const guesses2 = player2.guesses;
    for (let i = 0; i < result_lines.length; i++) {
        const time0 = (typeof game.rounds[i].startTime === "string") ? Date.parse(game.rounds[i].startTime) : game.rounds[i].startTime;

        // Check for no guess
        if (guesses1.length <= i || guesses1[i].roundNumber != i+1) guesses1.splice(i, 0, {created:NaN});
        const time1 = (typeof guesses1[i].created === "string") ? Date.parse(guesses1[i].created) : guesses1[i].created;
        if (guesses2.length <= i || guesses2[i].roundNumber != i+1) guesses2.splice(i, 0, {created:NaN});
        const time2 = (typeof guesses2[i].created === "string") ? Date.parse(guesses2[i].created) : guesses2[i].created;

        const text1 = document.createElement("div");

        // Add tooltip on the line header text to show the full date of the round
        if (!isReplay) {
            const header = result_lines[i].childNodes[0].childNodes[0].childNodes[0];
            header.classList.add("GDGTtooltip");
            const globalTimeText = `${game.rounds[i].startTime.substr(0, 19)} - ${game.rounds[i].endTime.substr(11, 8)}`.replace("T", "<br/>");
            header.innerHTML += `<span class="GDGTtooltiptext">${globalTimeText}</span>`;
        }

        // If one team didn't guess, then the team that did has a green timestamp, otherwise compare
        text1.classList.add(isNaN(time2) ? green() : greenOrGrey(time2-time1));
        if (isReplay) text1.classList.add(replay_compact());
        text1.innerText = isNaN(time1) ? "-" : (time1-time0)/1000. + " s";
        result_lines[i].childNodes[1].appendChild(text1);

        const text2 = document.createElement("div");
        text2.classList.add(isNaN(time1) ? green() : greenOrGrey(time1-time2));
        if (isReplay) text2.classList.add(replay_compact());
        text2.innerText = isNaN(time2) ? "-" : (time2-time0)/1000. + " s";
        result_lines[i].childNodes[2].appendChild(text2);
    }

    if (game.options.isRated) {
        addRatingChanges(isReplay, false, player1, player2);
    }
}

function addRatingChanges(isReplay, isTeamDuel, player1, player2) {
    const compact = (isReplay) ? " " + replay_compact() : ""
    const summary = document.getElementsByClassName((isReplay) ? replay_table() : summary_table())[0];
    const newRatingLine = document.createElement("div");
    newRatingLine.classList.add(summary_line());
    if (isReplay) newRatingLine.classList.add(replay_compact());
    // currently, rankedSystemProgress is used, but old summaries don't have this field, for them we need to use competitiveProgress
    // also, for solo duels without ranking changes, the progressChange field might be missing, but player.rating is always be there
    const progressField = isTeamDuel ? "rankedTeamDuelsProgress" : "rankedSystemProgress";
    const legacyField = "competitiveProgress";
    const oldRating1 = (player1.progressChange?.[progressField] || player1.progressChange?.[legacyField])?.ratingBefore || 0;
    const newRating1 = (player1.progressChange?.[progressField] || player1.progressChange?.[legacyField])?.ratingAfter || 0;
    const oldRating2 = (player2.progressChange?.[progressField] || player2.progressChange?.[legacyField])?.ratingBefore || 0;
    const newRating2 = (player2.progressChange?.[progressField] || player2.progressChange?.[legacyField])?.ratingAfter || 0;
    // we can't rely on player.rating for team duels because this is the duels elo, which is different from the team duels elo
    const fallback1 = isTeamDuel ? "unknown" : player1.rating;
    const fallback2 = isTeamDuel ? "unknown" : player2.rating;
    newRatingLine.innerHTML = `
        <div><span><div class="${grey()}${compact}">Rating change</div><div class="${big_white()}${compact}">New rating</div></span></div>
        <div><div class="${color(newRating1-oldRating1)}${compact}">${newRating1-oldRating1}</div><div class="${big_white()}${compact}">${newRating1 || fallback1}</div></div>
        <div><div class="${color(newRating2-oldRating2)}${compact}">${newRating2-oldRating2}</div><div class="${big_white()}${compact}">${newRating2 || fallback2}</div></div>
        <div><div class="${big_white()}${compact}"> </div></div>
        <div><div class="${big_white()}${compact}"> </div></div>`;
    summary.appendChild(newRatingLine);
};

function addProfileLinks(isReplay, inversion) {
    const nameMap = {};
    const teamMap = {};
    const verifiedMap = {};
    const gameRef = __NEXT_DATA__.props.pageProps.game
    if (!gameRef) return; // you'll have to refresh to get that extra header line
    const teamName1 = gameRef.teams[0].name
    const teamName2 = gameRef.teams[1].name
    gameRef.teams[0].players.map(y => {
        nameMap[y.playerId] = y.nick; verifiedMap[y.playerId] = y.isVerified; teamMap[y.playerId] = teamName1;
    });
    gameRef.teams[1].players.map(y => {
        nameMap[y.playerId] = y.nick; verifiedMap[y.playerId] = y.isVerified; teamMap[y.playerId] = teamName2;
    });

    const playerTemplate = (playerId) => `<span class="${best_guess_value()}" style="margin:2px"><div class="${user_nick_root()}">
                <div class="${user_nick_wrapper()}">
                  <div class="${user_nick_nick()}"><a href="/user/${playerId}" style="color:white">${nameMap[playerId]}&nbsp;</a></div>
                  ${verifiedMap[playerId] ? `<div class="${user_nick_verified_wrapper()}"><img class="${user_nick_verified()}" src="${verified_badge_svg}" alt="Verified user"></div>` : ''}
                </div>
              </div></span>`;
    const teamTemplate = (team) => {
        let s = "";
        for (let playerId in nameMap) {
            if (teamMap[playerId] == team && !ignore_list.includes(playerId)) {
                s = s + playerTemplate(playerId);
            }
        }
        return s;
    }
    const mapTemplate = (mapId, mapName) => `<span class="${best_guess_value()}" style="margin:2px"><div class="${user_nick_root()}">
                <div class="${user_nick_wrapper()}">
                  <div class="${user_nick_nick()}"><a href="/maps/${mapId}" style="color:white">${mapName}&nbsp;</a></div>
                </div>
              </div></span>`;
    const movementTemplate = (text) => `<span class="${summary_text()}" style="margin:2px">${text}</span>`;
    const options = gameRef.options;

    const playersLine = document.createElement("div");
    playersLine.classList.add(summary_line());
    const rules = {NM: options.movementOptions.forbidMoving, NP: options.movementOptions.forbidRotating, NZ: options.movementOptions.forbidZooming};
    const isMoving = !rules.NM && !rules.NP && !rules.NZ
    const movementType = (isMoving) ? "Moving" : `N${(rules.NM) ? "M" : ""}${(rules.NP) ? "P" : ""}${(rules.NZ) ? "Z" : ""}`;
    playersLine.innerHTML = `
        <div><span><div class="${summary_text()}">Players</div></span></div>
        <div>${teamTemplate((inversion) ? teamName2 : teamName1)}</div>
        <div>${teamTemplate((inversion) ? teamName1 : teamName2)}</div>
        <div>${movementTemplate(movementType)}</div>
        <div>${mapTemplate(options.map?.slug, options.map?.name || "(private map)")}</div>`;
    if (isReplay) {
        playersLine.classList.add(replay_compact());
    }

    const summary = document.getElementsByClassName((isReplay) ? replay_table() : summary_table())[0];
    summary.insertBefore(playersLine, summary.firstChild);
};

function check() {
    const split = location.pathname.split("/");
    const api_url = `https://game-server.geoguessr.com/api/duels/${(split[2].length > 5) ? split[2] : split[3]}`;
    doingRequest = true;
    fetch(api_url, {method: "GET", "credentials": "include"})
    .then(res => res.json())
    .then(json => {
        doingRequest = false;
        game = json;
        const urlType = checkURL()
        if (urlType != 0 && lastUrlDone != urlType) {
            lastUrlDone = urlType;
            scanStyles().then(_ => {
                const isReplay = location.pathname.includes("replay");
                if (game.options.isTeamDuels) handleTeamDuels(isReplay);
                else handleDuels(isReplay);
            });
        }
    }).catch(err => { doingRequest = false; throw(err); });
};

function doCheck() {
    scanStyles().then(_ => {
        const urlType = checkURL()
        if (urlType == 0) {
            lastUrlDone = 0;
        } else if (game != {} && lastUrlDone != urlType && !doingRequest) {
            check();
        }
    });
};

new MutationObserver((mutations) => {
    if (checkURL() == 0) return;
    doCheck();
}).observe(document.body, { subtree: true, childList: true });
