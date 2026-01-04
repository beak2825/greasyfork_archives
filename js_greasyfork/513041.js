// ==UserScript==
// @name         MazyarTools
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Mazyar Tools & Utilities
// @copyright    z7z from managerzone.com
// @author       z7z from managerzone.com
// @license      MIT
// @grant        GM_xmlhttpRequest
// @match        https://www.managerzone.com/*
// @match        https://test.managerzone.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @supportURL   https://github.com/mz-ir/mazyar
// ==/UserScript==

// --------------------------------------- Formatter -----------------------------

function mazyarFormatBigNumber(n, sep = " ") {
    if (n) {
        const numberString = n.toString();
        let formattedParts = [];
        for (let i = numberString.length - 1; i >= 0; i -= 3) {
            let part = numberString.substring(Math.max(i - 2, 0), i + 1);
            formattedParts.unshift(part);
        }
        return formattedParts.join(sep);
    }
    return "0";
}

function mazyarFormatAverageAge(age, fractionDigits = 1) {
    if (age) {
        return age.toFixed(fractionDigits);
    }
    return "0.0";
}

function mazyarFormatFileSize(b) {
    const s = 1024;
    let u = 0;
    while (b >= s || -b >= s) {
        b /= s;
        u++;
    }
    return (u ? b.toFixed(1) + " " : b) + " KMGTPEZY"[u] + "B";
}

// -------------------------------- Parser -------------------------------------

function mazyarParseMzDate(dateString) {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function mazyarParseMzDateTime(dateTimeString) {
    const [date, time] = dateTimeString.split(' ');
    const [day, month, year] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
}

function mazyarGenerateUuidV4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function mazyarIsFilterHitsValid(hits) {
    return typeof hits === "number" && hits >= 0;
}

function mazyarHasDuplicates(array) {
    return new Set(array).size !== array.length;
}

function mazyarExtractSportType(doc = document) {
    const zone = doc.querySelector("a#shortcut_link_thezone");
    if (zone) {
        return zone.href.indexOf("hockey") > -1 ? "hockey" : "soccer";
    }
    return "soccer";
}

function mazyarExtractClubCurrency(doc) {
    const players = doc.getElementById("playerAltViewTable")?.querySelectorAll("tbody tr");
    if (players && players.length > 0) {
        const parts = players[0].querySelector("td:nth-child(3)")?.innerText.split(" ");
        return parts[parts.length - 1].trim();
    }
    return "";
}

function mazyarExtractNationalCurrency(doc) {
    // works for both domestic and foreign countries
    const playerNode = doc.getElementById("thePlayers_0")?.querySelector("table tbody tr:nth-child(6)");
    if (playerNode) {
        const parts = playerNode.innerText.split(" ");
        return parts[parts.length - 1].trim();
    }
    return "";
}

function mazyarExtractTeamId(link) {
    const regex = /tid=(\d+)/;
    const match = regex.exec(link);
    return match ? match[1] : null;
}

function mazyarExtractPlayerIdFromProfileLink(link) {
    const regex = /pid=(\d+)/;
    const match = regex.exec(link);
    return match ? match[1] : null;
}

function mazyarExtractMatchId(link) {
    const regex = /mid=(\d+)/;
    const match = regex.exec(link);
    return match ? match[1] : null;
}

function mazyarExtractPlayerIdFromTransferMonitor(link) {
    const regex = /u=(\d+)/;
    const match = regex.exec(link);
    return match ? match[1] : null;
}

function mazyarExtractPlayerIdFromContainer(player) {
    return player?.querySelector("h2 span.player_id_span")?.innerText;
}

function mazyarIsMatchInProgress(resultText) {
    const scoreRegex = /\b(X|0|[1-9]\d*) - (X|0|[1-9]\d*)\b/;
    return !scoreRegex.test(resultText);
}

function mazyarIsPlayerSentToCamp(doc) {
    return !!doc.querySelector(`#thePlayers_0 span.player_icon_wrapper i.fa-traffic-cone.tc-status-icon:not(.tc-status-icon--disabled)`);
}

function mazyarExtractSkillNamesFromPlayerInfo(player) {
    const skills = player?.querySelectorAll("table.player_skills > tbody > tr > td > span.skill_name > span:first-child");
    return [...skills].map((el) => el.innerText);
}

function mazyarExtractSkillsFromScoutReport(section, skillList) {
    const skills = section.querySelectorAll("div.flex-grow-1 ul li.blurred span");
    return [...skills].map((el) => skillList.indexOf(el.innerText));
}

function mazyarExtractStarsFromScoutReport(section) {
    return section.querySelectorAll(".stars i.lit")?.length;
}

function mazyarExtractResidencyDaysAndPrice(doc = document) {
    if (!doc) {
        return { days: 0, price: '' };
    }
    const transfers = doc?.querySelector("div.baz > div > div.win_back > table.hitlist");
    const history = transfers?.querySelector("tbody");
    if (history?.children.length > 1) {
        const arrived = history?.lastChild?.querySelector("td")?.innerText;
        const days = Math.floor((new Date() - mazyarParseMzDate(arrived)) / 86_400_000);
        const price = history.lastChild?.querySelector("td:last-child")?.innerText;
        const currency = transfers?.querySelector("thead tr td:last-child")?.innerText?.match(/.*\((.*)\)/)?.[1];
        return { days, price: price + ' ' + currency };
    }
    return { days: -1, price: '' };
}

async function mazyarExtractPlayerProfile(playerId) {
    const url = `https://${location.hostname}/?p=players&pid=${playerId}`;
    const doc = await mazyarFetchHtml(url);
    if (doc) {
        const { days, price } = mazyarExtractResidencyDaysAndPrice(doc);
        const camp = mazyarIsPlayerSentToCamp(doc);
        const skills = doc.querySelectorAll("#thePlayers_0 table.player_skills tbody tr");
        let i = 0;
        const maxed = [];
        for (const skill of skills) {
            if (skill.querySelector(".maxed")) {
                maxed.push(i);
            }
            i++;
        }
        return {
            pid: playerId,
            maxed,
            days,
            price,
            camp,
        };
    }
    return null;
}

function mazyarExtractPlayerNameFromContainer(player) {
    return player?.querySelector("span.player_name")?.innerText;
}

async function mazyarFetchPlayerName(playerId) {
    const url = `https://${location.hostname}/?p=players&pid=${playerId}`;
    const doc = await mazyarFetchHtml(url);
    if (doc) {
        const profile = doc.getElementById("thePlayers_0");
        return mazyarExtractPlayerNameFromContainer(profile);
    }
    return null;
}

async function mazyarExtractPlayerScoutReport(pid, skills, sport = "soccer") {
    const url = `https://${location.hostname}/ajax.php?p=players&sub=scout_report&pid=${pid}&sport=${sport}`;
    const doc = await mazyarFetchHtml(url);
    if (doc) {
        const report = doc.querySelectorAll(".paper-content.clearfix dl dd");
        if (report.length == 3) {
            const high = mazyarExtractStarsFromScoutReport(report[0]);
            const highSkills = mazyarExtractSkillsFromScoutReport(report[0], skills);
            const low = mazyarExtractStarsFromScoutReport(report[1]);
            const lowSkills = mazyarExtractSkillsFromScoutReport(report[1], skills);
            const trainingSpeed = mazyarExtractStarsFromScoutReport(report[2]);
            return {
                pid,
                H: high,
                HS: highSkills,
                L: low,
                LS: lowSkills,
                S: trainingSpeed,
            };
        }
    }
    return null;
}

function mazyarExtractClubPlayersDetails(doc, currency) {
    const players = [];
    const playerNodes = doc.querySelectorAll("table#playerAltViewTable tr");
    for (const playerNode of playerNodes) {
        const age = playerNode.querySelector("td:nth-child(5)")?.innerText.replace(/\s/g, "");
        if (age) {
            const value = playerNode.querySelector("td:nth-child(3)")?.innerText.replaceAll(currency, "").replace(/\s/g, "");
            const shirtNumber = playerNode.querySelector("td:nth-child(0)")?.innerText.replace(/\s/g, "");
            const pid = playerNode.querySelector("a")?.href;
            players.push({
                shirtNumber,
                age: parseInt(age, 10),
                value: parseInt(value, 10),
                id: mazyarExtractPlayerIdFromProfileLink(pid),
            });
        }
    }
    return players;
}

function mazyarExtractNumberOfFlags(infoTable) {
    const images = infoTable.getElementsByTagName("img");
    return images ? [...images].filter((img) => img.src.indexOf("/flags/") > -1).length : 0;
}

function mazyarIsPlayerDomestic(infoTable) {
    return mazyarExtractNumberOfFlags(infoTable) === 1;
}

function mazyarExtractNationalPlayersDetails(doc, currency) {
    const players = [];
    const playerNodes = doc.querySelectorAll("div.playerContainer");
    for (const playerNode of playerNodes) {
        const id = mazyarExtractPlayerIdFromProfileLink(playerNode.querySelector("h2 a")?.href);
        const infoTable = playerNode.querySelector("div.dg_playerview_info table");
        const age = infoTable.querySelector("tbody tr:nth-child(1) td strong").innerText;
        const selector = mazyarIsPlayerDomestic(infoTable) ? "tbody tr:nth-child(5) td span" : "tbody tr:nth-child(6) td span";
        const value = infoTable.querySelector(selector)?.innerText.replaceAll(currency, "").replace(/\s/g, "");
        players.push({
            age: parseInt(age, 10),
            value: parseInt(value, 10),
            id,
        });
    }
    return players;
}

function mazyarGetNumberOfPlayers(players, ageLow = 0, ageHigh = 99) {
    return players.filter((player) => player.age <= ageHigh && player.age >= ageLow).length;
}

// ----------------------------------- Fetch ---------------------------------

async function mazyarFetchHtmlWithGM(url, timeout = 10) {
    try {
        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url,
                // timeout: timeout * 1000,
                onload: (resp) => resolve(resp),
                onerror: reject
            });
        });
        const parser = new DOMParser();
        return parser.parseFromString(response.responseText, "text/html");
    } catch (error) {
        console.warn(error);
        return null;
    }
}

async function mazyarFetchHtml(url) {
    return await fetch(url)
        .then((resp) => resp.text())
        .then((content) => {
            const parser = new DOMParser();
            return parser.parseFromString(content, "text/html");
        })
        .catch((error) => {
            console.warn(error);
            return null;
        });
}

async function mazyarFetchXml(url) {
    return await fetch(url)
        .then((resp) => resp.text())
        .then((content) => {
            const parser = new DOMParser();
            return parser.parseFromString(content, "text/xml");
        })
        .catch((error) => {
            console.warn(error);
            return null;
        });
}

async function mazyarFetchJson(url) {
    return await fetch(url)
        .then((resp) => resp.json())
        .catch((error) => {
            console.warn(error);
            return null;
        });
}

function mazyarGetSquadSummaryUrl(tid) {
    return `https://${location.hostname}/?p=players&sub=alt&tid=${tid}`;
}

function mazyarExtractSquadSummaryDetails(players, sport = "soccer") {
    if (!players) {
        return [];
    }
    const rows = [];
    if (sport === "hockey") {
        {
            const all = mazyarFilterPlayers(players);
            const top21 = mazyarFilterPlayers(players, 21);
            rows.push({
                title: "All",
                count: players.length,
                all: all.values,
                allAge: all.avgAge,
                top21: top21.values,
                top21Age: top21.avgAge,
            });
        }
        {
            const all = mazyarFilterPlayers(players, 0, 0, 23);
            const top21 = mazyarFilterPlayers(players, 21, 0, 23);
            rows.push({
                title: "U23",
                count: mazyarGetNumberOfPlayers(players, 0, 23),
                all: all.values,
                allAge: all.avgAge,
                top21: top21.values,
                top21Age: top21.avgAge,
            });
        }
        {
            const all = mazyarFilterPlayers(players, 0, 0, 21);
            const top21 = mazyarFilterPlayers(players, 21, 0, 21);
            rows.push({
                title: "U21",
                count: mazyarGetNumberOfPlayers(players, 0, 21),
                all: all.values,
                allAge: all.avgAge,
                top21: top21.values,
                top21Age: top21.avgAge,
            });
        }
        {
            const all = mazyarFilterPlayers(players, 0, 0, 18);
            const top21 = mazyarFilterPlayers(players, 21, 0, 18);
            rows.push({
                title: "U18",
                count: mazyarGetNumberOfPlayers(players, 0, 18),
                all: all.values,
                allAge: all.avgAge,
                top21: top21.values,
                top21Age: top21.avgAge,
            });
        }
    } else {
        {
            const all = mazyarFilterPlayers(players);
            const top16 = mazyarFilterPlayers(players, 16);
            const top11 = mazyarFilterPlayers(players, 11);
            rows.push({
                title: "All",
                count: players.length,
                all: all.values,
                allAge: all.avgAge,
                top16: top16.values,
                top16Age: top16.avgAge,
                top11: top11.values,
                top11Age: top11.avgAge,
            });
        }
        {
            const all = mazyarFilterPlayers(players, 0, 0, 23);
            const top16 = mazyarFilterPlayers(players, 16, 0, 23);
            const top11 = mazyarFilterPlayers(players, 11, 0, 23);
            rows.push({
                title: "U23",
                count: mazyarGetNumberOfPlayers(players, 0, 23),
                all: all.values,
                allAge: all.avgAge,
                top16: top16.values,
                top16Age: top16.avgAge,
                top11: top11.values,
                top11Age: top11.avgAge,
            });
        }
        {
            const all = mazyarFilterPlayers(players, 0, 0, 21);
            const top16 = mazyarFilterPlayers(players, 16, 0, 21);
            const top11 = mazyarFilterPlayers(players, 11, 0, 21);
            rows.push({
                title: "U21",
                count: mazyarGetNumberOfPlayers(players, 0, 21),
                all: all.values,
                allAge: all.avgAge,
                top16: top16.values,
                top16Age: top16.avgAge,
                top11: top11.values,
                top11Age: top11.avgAge,
            });
        }
        {
            const all = mazyarFilterPlayers(players, 0, 0, 18);
            const top16 = mazyarFilterPlayers(players, 16, 0, 18);
            const top11 = mazyarFilterPlayers(players, 11, 0, 18);
            rows.push({
                title: "U18",
                count: mazyarGetNumberOfPlayers(players, 0, 18),
                all: all.values,
                allAge: all.avgAge,
                top16: top16.values,
                top16Age: top16.avgAge,
                top11: top11.values,
                top11Age: top11.avgAge,
            });
        }
    }
    return rows;
}

function mazyarFilterPlayers(players, count = 0, ageLow = 0, ageHigh = 99) {
    if (players.length === 0) {
        return { values: 0, avgAge: 0.0 };
    }

    const n = count === 0 ? players.length : count;
    const filtered = players
        .filter((player) => player.age <= ageHigh && player.age >= ageLow)
        .sort((a, b) => b.value - a.value)
        .slice(0, n);
    if (filtered.length === 0) {
        return { values: 0, avgAge: 0.0 };
    }
    const values = filtered.map((player) => player.value).reduce((a, b) => a + b, 0);
    const avgAge = filtered.map((player) => player.age).reduce((a, b) => a + b, 0) / filtered.length;
    return { values, avgAge };
}

async function mazyarFetchNationalPlayersAndCurrency(tid, sport) {
    const url = `https://${location.hostname}/ajax.php?p=nationalTeams&sub=players&ntid=${tid}&sport=${sport}`;
    const doc = await mazyarFetchHtml(url);
    if (doc) {
        const currency = mazyarExtractNationalCurrency(doc);
        const players = mazyarExtractNationalPlayersDetails(doc, currency);
        return { players, currency };
    }
    return { players: [], currency: '' };
}

async function mazyarFetchClubPlayersAndCurrency(tid) {
    const url = mazyarGetSquadSummaryUrl(tid);
    const doc = await mazyarFetchHtml(url);
    if (doc) {
        const currency = mazyarExtractClubCurrency(doc);
        const players = mazyarExtractClubPlayersDetails(doc, currency);
        return { players, currency };
    }
    return { players: [], currency: '' };
}

async function mazyarFetchPlayersAndCurrency(tid, sport) {
    const url = mazyarGetSquadSummaryUrl(tid);
    const isNational = await fetch(url, { method: "HEAD" })
        .then((resp) => (resp.url.search("p=national_teams") > -1));
    return isNational ? await mazyarFetchNationalPlayersAndCurrency(tid, sport) : await mazyarFetchClubPlayersAndCurrency(tid);
}

function mazyarExtractClubTopPlyers(doc) {
    const currency = mazyarExtractClubCurrency(doc);
    const players = mazyarExtractClubPlayersDetails(doc, currency);
    const sport = mazyarExtractSportType(doc);
    const count = sport === "soccer" ? 11 : 21;
    return players ? mazyarFilterPlayers(players, count) : { values: 0, avgAge: 0 };
}

async function mazyarExtractPlayersProfileDetails(teamId) {
    if (!teamId) {
        return null;
    }
    const url = `https://${location.hostname}/?p=players&tid=${teamId}`;
    const doc = await mazyarFetchHtml(url);
    if (doc) {
        const players = doc.getElementById("players_container")?.querySelectorAll("div.playerContainer");
        const info = {};
        for (const player of players) {
            const playerId = player.querySelector("span.player_id_span")?.innerText;
            const inMarket = [...player.querySelectorAll("a")].find((el) => el.href?.indexOf("p=transfer&sub") > -1);
            info[playerId] = {
                detail: player,
                shared: !!player.querySelector("i.special_player.fa-share-alt"),
                market: !!inMarket,
                marketLink: inMarket?.href,
                name: player.querySelector("span.player_name")?.innerText,
                age: player.querySelector(".dg_playerview_info tbody tr:nth-child(1) td:nth-child(1) strong")?.innerText,
            }
        }
        return info;
    }
    return null;
}

// -------------------------------------------- Icons ------------------------------------------

function mazyarStartSpinning(element) {
    element.classList.add("fa-spin");
}

function mazyarStopSpinning(element) {
    element.classList.remove("fa-spin");
}

function mazyarCreateIconFromFontAwesomeClass(classes = [], title = "") {
    const icon = document.createElement("i");
    icon.classList.add(...classes);
    icon.setAttribute("aria-hidden", "true");
    icon.style.cursor = "pointer";
    if (title) {
        icon.title = title;
    }
    return icon;
}

function mazyarCreateToggleIcon(title, isOn) {
    return mazyarCreateIconFromFontAwesomeClass(["fas", isOn ? "fa-toggle-on" : "fa-toggle-off"], title);
}

function mazyarCreateMoveIcon(title) {
    return mazyarCreateIconFromFontAwesomeClass(["fa-solid", "fa-up-down-left-right"], title);
}

function mazyarCreateSharedIcon(title) {
    return mazyarCreateIconFromFontAwesomeClass(["fa", "fa-share-alt"], title);
}

function mazyarCreateMarketIcon(title) {
    return mazyarCreateIconFromFontAwesomeClass(["fa", "fa-legal"], title);
}

function mazyarCreateCogIcon(title = "") {
    return mazyarCreateIconFromFontAwesomeClass(["fa", "fa-cog"], title);
}

function mazyarCreateCommentIcon(title = "", style = null) {
    const icon = mazyarCreateIconFromFontAwesomeClass(["fa-solid", "fa-comment"], title);
    icon.style.cursor = "pointer";
    if (style?.fontSize) {
        icon.style.fontSize = style.fontSize;
    }
    if (style?.margin) {
        icon.style.margin = style.margin;
    }
    return icon
}

function mazyarCreateSearchIcon(title = "") {
    return mazyarCreateIconFromFontAwesomeClass(["fa", "fa-search"], title);
}

function mazyarCreateNoteIcon(title = "") {
    return mazyarCreateIconFromFontAwesomeClass(["fa-solid", "fa-note-sticky"], title);
}

function mazyarCreateRefreshIcon(title = "") {
    return mazyarCreateIconFromFontAwesomeClass(["fa", "fa-refresh"], title);
}

function mazyarCreateLegalIcon(title = "") {
    return mazyarCreateIconFromFontAwesomeClass(["fa", "fa-legal"], title);
}

function mazyarCreateSignalIcon(title = "") {
    return mazyarCreateIconFromFontAwesomeClass(["fa-solid", "fa-signal-stream"], title);
}

function mazyarCreateLoadingIcon(title = "") {
    const icon = mazyarCreateIconFromFontAwesomeClass(["fa", "fa-spinner", "fa-spin"], title);
    icon.style.cursor = "unset";
    return icon;
}

function mazyarCreateLoadingIcon2(title = "") {
    const icon = mazyarCreateIconFromFontAwesomeClass(["fa-solid", "fa-loader", "fa-pulse", "fa-fw"], title);
    icon.style.cursor = "unset";
    return icon;
}

function mazyarCreateTrashIcon(title = "", style = { fontSize: "1rem", margin: "unset" }) {
    const icon = mazyarCreateIconFromFontAwesomeClass(["fa-solid", "fa-trash", "discard-icon"], title);
    icon.style.cursor = "pointer";
    if (style?.fontSize) {
        icon.style.fontSize = style.fontSize;
    }
    if (style?.margin) {
        icon.style.margin = style.margin;
    }
    return icon;
}

function mazyarCreateAddToDeadlineIcon(title, color) {
    const icon = mazyarCreateLegalIcon();
    icon.style.verticalAlign = "unset";
    icon.style.borderRadius = "50%";
    icon.style.border = "solid 1px";
    icon.style.padding = "3px";

    const span = document.createElement("span");
    span.style.color = color;
    span.classList.add("floatRight");
    if (title) {
        span.title = title;
    }
    span.appendChild(icon);
    return span;
}

function mazyarCreateHideFromTransferIcon(title) {
    const icon = mazyarCreateTrashIcon(title, { fontSize: "0.9rem" });
    icon.style.verticalAlign = "unset";
    icon.style.padding = "3px";

    const span = document.createElement("span");
    span.classList.add("floatRight");
    if (title) {
        span.title = title;
    }
    span.appendChild(icon);
    return span;
}

function mazyarCreateCommentIconForTransferResults(title) {
    const icon = mazyarCreateCommentIcon(title, { fontSize: "1.1rem" });
    icon.style.verticalAlign = "unset";
    icon.style.padding = "3px";

    const span = document.createElement("span");
    span.classList.add("floatRight");
    if (title) {
        span.title = title;
    }
    span.appendChild(icon);
    return span;
}

// -------------------------------- DOM Utils ------------------------------

async function mazyarGetTransferHistory(url) {
    const doc = await mazyarFetchHtml(url);
    if (doc) {
        const table = doc.querySelector("#transfer-history");
        const tbody = table.querySelector("tbody");
        tbody.querySelectorAll("tr:not(.bought, .sold)")?.forEach((child) => {
            tbody.removeChild(child);
        });
        return table;
    }
    return null;
}

async function mazyarGetTableTransferHistories(table) {
    const teams = table.querySelectorAll("tbody tr.responsive-hide");
    const jobs = [];
    for (const team of teams) {
        const teamLink = team.querySelector("td:nth-child(2) a:last-child");
        const tid = mazyarExtractTeamId(teamLink?.href);
        const url = `https://${location.hostname}/?p=transfer_history&tid=${tid}`;
        jobs.push(mazyarGetTransferHistory(url).then((history) => {
            if (history) {
                const name = document.createElement("td");
                name.innerHTML = `For Team: <a style="text-decoration: none !important;" href="${url}">${teamLink?.innerText}</a>`;
                name.colSpan = 5;
                // name.style.backgroundColor = "khaki";
                name.style.fontWeight = "bold";
                name.style.padding = "10px 5px 5px";
                const tr = document.createElement("tr");
                tr.classList.add("mazyar-history-name", "hitlist-compact-list-column");
                tr.style.border = "2px solid darkgray";
                tr.appendChild(name);
                history.querySelector("tbody").prepend(tr);
                return history;
            }
            return null;
        }));
    }
    return (await Promise.all(jobs)).filter((h) => !!h);
}

function mazyarFilterTransferHistory(history, weeks = 2) {
    history.filterResults = 0;
    const players = history?.querySelectorAll("tbody tr:not(.mazyar-history-name)");
    players?.forEach((child) => {
        const date = child.querySelector("td.hitlist-compact-list-column")?.firstChild?.nodeValue?.trim();
        if (Date.now() - mazyarParseMzDate(date) >= weeks * 7 * 24 * 60 * 60 * 1000) {
            child.style.display = 'none';
        } else {
            child.style.display = "table-row";
            history.filterResults += 1;
        }
    });
}

function mazyarRemoveOldTransferHistory(history, weeks = 4) {
    const players = history?.querySelectorAll("tbody tr:not(.mazyar-history-name)");
    players?.forEach((child) => {
        const date = child.querySelector("td.hitlist-compact-list-column")?.firstChild?.nodeValue?.trim();
        if (Date.now() - mazyarParseMzDate(date) >= weeks * 7 * 24 * 60 * 60 * 1000) {
            child.parentNode.removeChild(child);
        }
    });
}

function mazyarMakeElementDraggable(element, dragHandleElement, dragEndCallback = null) {
    let deltaX = 0, deltaY = 0, lastX = 0, lastY = 0;

    dragHandleElement.style.cursor = "move";
    dragHandleElement.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        lastX = e.clientX;
        lastY = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        // calculate the new cursor position:
        deltaX = lastX - e.clientX;
        deltaY = lastY - e.clientY;
        lastX = e.clientX;
        lastY = e.clientY;

        // set the element's new position:
        let newTop = Math.max(0, element.offsetTop - deltaY);
        let newLeft = Math.max(0, element.offsetLeft - deltaX);

        const { right, bottom, width, height } = element.getBoundingClientRect();
        if (right > window.innerWidth) {
            newLeft = window.innerWidth - width;
        }
        if (bottom > window.innerHeight) {
            newTop = window.innerHeight - height;
        }

        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        if (dragEndCallback) {
            dragEndCallback();
        }
    }
}

function mazyarColorizeMaxedSkills(player, maxed = []) {
    if (maxed) {
        const playerSkills = player.querySelectorAll("table.player_skills tr td.skillval span");
        for (const skill of maxed) {
            playerSkills[skill]?.classList.add("maxed");
        }
    }
}

function mazyarColorizeSkills(player, report = { H: 4, L: 2, HS: [0, 1], LS: [2, 3] }) {
    if (report) {
        const playerSkills = player?.querySelectorAll("table.player_skills tr td:nth-child(1)");
        playerSkills[report.HS[0]]?.classList.add("mazyar-scout-h", `mazyar-scout-${report.H}`);
        playerSkills[report.HS[1]]?.classList.add("mazyar-scout-h", `mazyar-scout-${report.H}`);
        playerSkills[report.LS[0]]?.classList.add(`mazyar-scout-${report.L}`);
        playerSkills[report.LS[1]]?.classList.add(`mazyar-scout-${report.L}`);
    }
}

function mazyarGetMzButtonColorClass(color) {
    if (color) {
        if (color === "red") {
            return "button_red";
        } else if (color === "blue") {
            return "button_blue";
        } else if (color === "grey") {
            return "buttondiv_disabled";
        }
    }
    // green or other values
    return "button_account";
}

function mazyarCreateMzStyledButton(title, color = "", floatDirection = null) {
    const div = document.createElement("div");
    div.style.margin = "auto 0.3rem";
    if (floatDirection) {
        // floatDirection: floatRight, floatLeft
        div.classList.add(floatDirection);
    }

    const button = document.createElement("div");
    button.classList.add("mzbtn", "buttondiv", mazyarGetMzButtonColorClass(color));
    button.innerHTML = `<span class="buttonClassMiddle"><span style="white-space: nowrap">${title}</span></span><span class="buttonClassRight">&nbsp;</span>`;

    div.appendChild(button);
    return div;
}

function mazyarCreateSettingsSectionButton(html = "", style = { backgroundColor: null }) {
    const button = document.createElement("button");
    button.innerHTML = html;
    button.classList.add("mazyar-settings-section-button");
    if (style?.backgroundColor) {
        button.style.backgroundColor = style.backgroundColor;
    }
    return button;
}

function mazyarCreateUpdateTip(version, url) {
    const div = document.createElement("div");
    div.classList.add("mazyar-update-tip");
    div.innerHTML = `
    <span><b>Update Available!</b></span><br />
    <button><a href="${url}" target="_blank">Install v${version}</a></button>`;
    return div;
}

function mazyarCreateMzStyledCloseButton(closeCallback) {
    const close = document.createElement("div");
    close.classList.add("mazyar-cross-close-button");

    close.innerHTML = `
        <span class="fa-stack fa-lg">
            <i class="fa fa-circle fa-stack-2x fa-inverse"></i>
            <i class="fa fa-close fa-stack-1x"></i>
        </span>`;
    if (closeCallback) {
        close.addEventListener("click", closeCallback);
    }
    return close;
}

function mazyarCreateMzStyledModalHeader(text = "", closeCallback = null) {
    const header = document.createElement("div");
    header.classList.add("mazyar-flexbox-row", "mazyar-modal-header");

    const title = document.createElement("span");
    title.innerText = text;
    title.style.flexGrow = "1";
    title.style.fontWeight = "bold";
    title.style.fontSize = "larger";
    title.style.padding = "5px";

    header.appendChild(title);

    if (closeCallback) {
        const close = mazyarCreateMzStyledCloseButton(closeCallback);
        header.appendChild(close);
    }
    return header;
}

function mazyarCreateSuggestionList(items) {
    const datalist = document.createElement("datalist");
    datalist.id = mazyarGenerateUuidV4();
    for (const item of items) {
        const option = document.createElement("option");
        option.value = item.toString();
        datalist.appendChild(option);
    }
    return datalist;
}

function mazyarCreateMenuTextInput(title = "input", placeholder = "example", datalistId = "") {
    const div = document.createElement("div");
    div.classList.add("mazyar-flexbox-row");
    div.style.justifyItems = "space-between";
    div.innerHTML = `
        <label style="margin: 0.5rem; font-weight: bold;">${title}: </label>
        <input list="${datalistId}" style="margin: 0.5rem;" type="text" value="" placeholder="${placeholder}">`;
    return div;
}

function mazyarCreateSubMenuTextInput(title = "input", placeholder = "example", initialValue = 0, style = {
    margin: "0.1rem 2.2rem",
    inputSize: "5px"
}) {
    const div = document.createElement("div");
    div.classList.add("mazyar-flexbox-row");
    div.style.justifyItems = "space-between";
    div.style.margin = style?.margin ?? "0.1rem 2.2rem";
    div.innerHTML = `
        <label style="margin-left: 0.5rem;">${title}: </label>
        <input style="margin-left: 0.5rem;" type="text" size="${style?.inputSize ?? "5px"}" placeholder="${placeholder}", value="${initialValue}">`;
    return div;
}

function mazyarCreateMenuCheckBox(
    label,
    initialValue = true,
    style = {
        alignSelf: "flex-start",
        margin: "0.3rem 0.7rem",
    }
) {
    const id = mazyarGenerateUuidV4();

    const div = document.createElement("div");
    div.style.alignSelf = style?.alignSelf ?? "flex-start";
    div.style.margin = style?.margin ?? "0.3rem 0.7rem";

    const checkbox = document.createElement("input");
    checkbox.id = id;
    checkbox.type = "checkbox";
    checkbox.checked = initialValue;

    const labelElement = document.createElement("label");
    labelElement.htmlFor = id;
    labelElement.innerHTML = label;

    div.appendChild(checkbox);
    div.appendChild(labelElement);
    return div;
}

function mazyarCreateMenuGroup(title = "") {
    const group = document.createElement("div");
    group.classList.add("mazyar-flexbox-column");
    group.style.alignSelf = "flex-start";
    group.style.alignItems = "flex-start";
    group.style.margin = "0.2rem 0.6rem";
    const header = document.createElement("h4");
    header.innerText = title;
    header.style.margin = "0.3rem 0rem";
    group.appendChild(header);
    return group;
}

function mazyarAppendOptionList(parent, options, selected) {
    // options = a object full of 'key: {value, label}'
    for (const key in options) {
        if (options.hasOwnProperty(key)) {
            const child = document.createElement("option");
            child.value = options[key].value;
            child.innerText = options[key].label;
            if (child.value === selected) {
                child.selected = true;
            }
            parent.appendChild(child);
        }
    }
}

function mazyarCreateDropDownMenu(label, options, initialValue) {
    // options = a object full of 'key: {value, label}'
    // initialValue = one of the options.value

    const div = document.createElement("div");
    const labelElement = document.createElement("label");
    const dropdown = document.createElement("select");

    div.style.alignSelf = "flex-start";
    div.style.margin = "0.3rem 0.7rem";

    labelElement.innerText = label;
    labelElement.style.paddingRight = "0.5rem";

    mazyarAppendOptionList(dropdown, options, initialValue);

    div.appendChild(labelElement);
    div.appendChild(dropdown);
    return div;
}

function mazyarCreateDeleteAllFiltersButton(title = "Delete", clickCallback = null) {
    const div = document.createElement("div");
    div.classList.add("mazyar-flexbox-row");
    div.style.width = "100%";
    const button = document.createElement("button");
    button.classList.add("mazyar-button");
    const icon = mazyarCreateTrashIcon(null, { fontSize: "0.9rem", margin: "1px 3px" });
    const text = document.createElement("span");
    text.innerText = title;
    text.style.fontWeight = "bold";
    button.appendChild(icon);
    button.appendChild(text);
    div.append(button);

    button.style.margin = "4px";
    button.style.padding = "3px";

    if (clickCallback) {
        button.addEventListener("click", clickCallback);
    }

    return div;
}

function mazyarCreateTableHeaderForFiltersView() {
    const tr = document.createElement("tr");

    const name = document.createElement("th");
    name.classList.add("header");
    name.innerText = "Name";
    name.title = "Filter name";
    name.style.textAlign = "left";
    name.style.textDecoration = "none";
    name.style.width = "11rem";

    const totalHits = document.createElement("th");
    totalHits.classList.add("header");
    totalHits.innerText = "Total";
    totalHits.title = "Total hits founds for this filter";
    totalHits.style.textAlign = "center";
    totalHits.style.textDecoration = "none";

    const scoutHits = document.createElement("th");
    scoutHits.classList.add("header");
    scoutHits.innerText = "Scout";
    scoutHits.title = "Hits found after applying scout filters";
    scoutHits.style.textAlign = "center";
    scoutHits.style.textDecoration = "none";

    const tools = document.createElement("th");
    tools.classList.add("header");
    tools.innerHTML = " ";
    tools.style.textAlign = "center";
    tools.style.textDecoration = "none";

    tr.appendChild(tools);
    tr.appendChild(name);
    tr.appendChild(totalHits);
    tr.appendChild(scoutHits);

    const thead = document.createElement("thead");
    thead.appendChild(tr);
    return thead;
}


function mazyarCreateTableHeaderForCommentsView() {
    const tr = document.createElement("tr");

    const pid = document.createElement("th");
    pid.classList.add("header");
    pid.innerText = "ID";
    pid.title = "Player ID";
    pid.style.textAlign = "left";
    pid.style.textDecoration = "none";

    const name = document.createElement("th");
    name.classList.add("header");
    name.innerText = "Name";
    name.title = "Player Name";
    name.style.textAlign = "left";
    name.style.textDecoration = "none";
    name.style.minWidth = "7rem";

    const del = document.createElement("th");
    del.classList.add("header");
    del.innerHTML = " ";
    del.style.textAlign = "center";
    del.style.textDecoration = "none";

    const view = document.createElement("th");
    view.classList.add("header");
    view.innerHTML = " ";
    view.style.textAlign = "center";
    view.style.textDecoration = "none";

    tr.appendChild(del);
    tr.appendChild(pid);
    tr.appendChild(name);
    tr.appendChild(view);

    const thead = document.createElement("thead");
    thead.appendChild(tr);
    return thead;
}

function mazyarCreateToolbar() {
    const toolbar = document.createElement("div");
    const logo = document.createElement("span");
    const menu = mazyarCreateCogIcon("Settings");
    const note = mazyarCreateNoteIcon("Notebook");
    const comments = mazyarCreateCommentIcon("Comments");
    const live = mazyarCreateSignalIcon("In Progress Results");
    const separator = document.createElement("span");
    const transfer = document.createElement("div");
    const transferIcon = mazyarCreateSearchIcon("Transfer");
    const transferCount = document.createElement("span");

    toolbar.id = "mazyar-toolbar-overlay";
    toolbar.classList.add("mazyar-flexbox-column");

    logo.innerText = "MZY";
    logo.style.fontSize = "0.6rem";
    logo.style.fontWeight = "bold";
    logo.style.margin = "2px";
    logo.style.padding = "1px";

    menu.style.fontSize = "large";

    note.style.fontSize = "large";
    note.style.marginTop = "5px";

    comments.style.fontSize = "large";
    comments.style.marginTop = "5px";

    live.style.fontSize = "large";
    live.style.marginTop = "5px";
    live.id = "mazyar-in-progress-icon";

    transferIcon.style.fontSize = "large";

    separator.innerText = "-------";
    separator.style.textAlign = "center";
    separator.style.fontSize = "0.6rem";
    separator.style.fontWeight = "bolder";
    separator.style.margin = "0";
    separator.style.padding = "0";

    transfer.classList.add("mazyar-flexbox-column");
    transfer.style.cursor = "pointer";

    transferCount.id = "mazyar-transfer-filter-hits";
    transferCount.innerText = "0";
    transferCount.style.fontSize = "0.6rem";
    transferCount.style.fontWeight = "bold";
    transferCount.style.margin = "1px 0";
    transferCount.style.padding = "1px";

    transfer.appendChild(transferIcon);
    transfer.appendChild(transferCount);

    toolbar.appendChild(logo);
    toolbar.appendChild(menu);
    toolbar.appendChild(note);
    toolbar.appendChild(comments);
    toolbar.appendChild(live);
    toolbar.appendChild(separator);
    toolbar.appendChild(transfer);

    return { toolbar, menu, transfer, note, comments, live };
}

function mazyarCreateFiltersOverview(filters, label, labelColor = "black") {
    const div = document.createElement("div");
    div.classList.add("mazyar-flexbox-column");
    div.style.minWidth = "250px";
    div.style.marginBottom = "20px";
    div.style.alignItems = "flex-start";

    const header = document.createElement("div");
    header.innerText = label;
    header.style.color = labelColor;
    header.style.fontWeight = "bolder";
    header.style.padding = "5px";
    header.style.alignSelf = "center";
    div.appendChild(header);

    const rows = document.createElement("div");
    rows.classList.add("mazyar-flexbox-column");
    rows.style.justifyContent = "left";
    rows.style.margin = "8px";
    div.appendChild(rows);

    if (filters.soccer.length > 0 || filters.hockey.length > 0) {
        if (filters.soccer.length > 0) {
            const title = document.createElement("div");
            title.classList.add("mazyar-import-sport-title");
            title.innerHTML = "<b>Soccer:</b>";
            rows.appendChild(title);
            for (const filter of filters.soccer) {
                const row = document.createElement("div");
                row.classList.add("mazyar-import-filter-row");
                row.innerHTML = `
                    <span>
                        name: <b style="color: ${labelColor}">${filter.name}</b>
                    </span>`;
                rows.appendChild(row);
            }
        }
        if (filters.hockey.length > 0) {
            const title = document.createElement("div");
            title.classList.add("mazyar-import-sport-title");
            title.innerHTML = "<b>Hockey:</b>";
            rows.appendChild(title);
            for (const filter of filters.hockey) {
                const row = document.createElement("div");
                row.classList.add("mazyar-import-filter-row");
                row.innerHTML = `
                    <span>
                        name: <b style="color: ${labelColor}">${filter.name}</b>
                    </span>`;
                rows.appendChild(row);
            }
        }
    } else {
        rows.appendChild(document.createTextNode("No Filters"));
    }

    return div;
}

// -------------------------------- Monitor ------------------------------

function mazyarCreateSectionSeparatorForMonitor() {
    const tr = document.createElement("tr");
    tr.style.height = "10px";
    tr.innerHTML = '<td></td>';
    return tr;
}

function mazyarCreateRowSeparatorForMonitor(color) {
    const tr = document.createElement("tr");
    tr.classList.add("mazyar-monitor-player-row");
    tr.style.height = "1px";
    tr.style.backgroundColor = color;
    tr.innerHTML = '<td></td>';
    return tr;
}

function monitorAddRowSeparator() {
    return [
        mazyarCreateRowSeparatorForMonitor("#999999"),
        mazyarCreateRowSeparatorForMonitor("#FFFFFF")
    ];
}

function mazyarCreateSectionForMonitor(title, id) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>
            <div id="${id}">
                <table width="100%" cellpadding="0" cellspacing="0">
                <tbody>
                <tr>
                    <td style="background-image: url(img/subheader_right.gif);">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tbody>
                        <tr>
                            <td class="subheader" valign="bottom">${title}</td>
                        </tr>
                        </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
                </table>
            </div>
        </td>`;
    return tr;
}

function mazyarClearPlayerRowsInMonitor(tbody) {
    const players = tbody.querySelectorAll(".mazyar-monitor-player-row");
    for (const player of players) {
        tbody.removeChild(player);
    }
}

async function mazyarFetchPlayerMarketDetail(pid, sport = "soccer") {
    const url = `https://${location.hostname}/ajax.php?p=transfer&sub=transfer-search&sport=${sport}&u=${pid}`;
    const result = await mazyarFetchJson(url);
    if (result) {
        if (result.totalHits > 0) {
            const parser = new DOMParser();
            const playerDiv = parser.parseFromString(result?.players, "text/html").body.firstChild;
            const deadline = playerDiv.querySelector(".transfer-control-area div.box_dark:nth-child(1) table:nth-child(1) tr:nth-child(3) strong")?.innerText;
            const fee = playerDiv.querySelector(".transfer-control-area > div > div:nth-child(1) > table > tbody > tr:last-child strong")?.innerText;
            const latestBid = playerDiv.querySelector(".transfer-control-area > div > div:nth-child(2) > table > tbody > tr:last-child strong")?.innerText;
            const flag = playerDiv.querySelector(`img[src*="/flags/"]`)?.src;
            const player = {
                name: playerDiv.querySelector(".player_name")?.innerText,
                pid,
                deadline: 1 + Math.ceil((mazyarParseMzDateTime(deadline.trim()) - new Date()) / 60_000),
                deadlineFull: deadline.trim(),
                latestBid,
                fee,
                source: "mzy",
                flag,
            };
            return { player, remove: false };
        }
        return { player: null, remove: true };
    }
    return { player: null, remove: false };
}

async function mazyarFetchTrainingCampDetail() {
    const url = `https://${location.hostname}/?p=training_camp`;
    const doc = await mazyarFetchHtml(url);
    if (doc) {
        const players = doc.querySelectorAll("#training_camp_players_container div.tc_table_container");
        const detail = {};
        for (const player of players) {
            const pid = mazyarExtractPlayerIdFromProfileLink(player.querySelector(".player_link")?.href);
            const daysFull = player.querySelector(".tc_table_duration > div:nth-child(2)")?.innerText;
            detail[pid] = {
                days: daysFull?.split(": ")?.[1],
            }
        }
        return detail;
    }
    return null;
}

function mazyarCreatePlayerRowForMonitor(
    player = { pid: "", name: "", deadline: 0, deadlineFull: "", latestBid: "", flag: "" },
    timeout = 0) {
    const tr = document.createElement("tr");
    tr.classList.add("mazyar-monitor-player-row");
    if (player.deadline <= timeout) {
        tr.classList.add("mazyar-deadline-monitor-throb");
    }
    tr.innerHTML = `
        <td valign="top" style="" width="100%">
            <table width="100%" border="0">
            <tbody>
            <tr style="height: 25px;">
                <td colspan="2">
                    <table cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tbody>
                    <tr>
                        <td width="220">
                            <table>
                            <tbody>
                            <tr>
                                <td><img src="${player.flag}"></td>
                                <td><a target="_blank", href="/?p=transfer&sub=players&u=${player.pid}">${player.name}</a></td>
                                <td></td>
                            </tr>
                            </tbody>
                            </table>
                        </td>
                        <td>
                            <table class="deadline-table">
                            <tbody>
                            <tr>
                                <td><img src="img/icon_deadline.gif" width="13" height="15"></td>
                                <td>${player.deadlineFull}</td>
                            </tr>
                            </tbody>
                            </table>
                        </td>
                        <td align="right">
                            <table border="0">
                            <tbody>
                            <tr>
                                <td>Latest bid:</td>
                                <td align="right" style="font-size: 11px; font-weight: bold;">${player.latestBid}</td>
                                <td>&nbsp;</td>
                            </tr>
                            </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                    </table>
                </td>
            </tr>
            </tbody>
            </table>
        </td>`;
    return tr;
}

// -------------------------------- Tools ------------------------------

function mazyarConvertFilterArrayToFilterObject(filters) {
    return filters?.reduce((filter, { id, name, params, scout, interval }) => {
        filter[name] = { id, name, params, scout, interval };
        return filter;
    }, {});
}

function mazyarMergeFilters(a = [], b = []) {
    // 'b' members could replace 'a' members
    const aObj = mazyarConvertFilterArrayToFilterObject(a);
    const bObj = mazyarConvertFilterArrayToFilterObject(b);
    return Object.values({ ...aObj, ...bObj });
}
