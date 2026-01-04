// ==UserScript==
// @name         QCStats – Ability Kills
// @namespace    https://github.com/aleab/
// @version      1.0.11
// @author       aleab
// @description  This script adds ability information to the statistics on stats.quake.com
// @icon         https://stats.quake.com/fav/favicon-32x32.png
// @icon64       https://stats.quake.com/fav/favicon-96x96.png
// @match        https://stats.quake.com
// @match        https://stats.quake.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://greasyfork.org/scripts/371849-qcstats/code/QCStats.js?version=636315
// @downloadURL https://update.greasyfork.org/scripts/371847/QCStats%20%E2%80%93%20Ability%20Kills.user.js
// @updateURL https://update.greasyfork.org/scripts/371847/QCStats%20%E2%80%93%20Ability%20Kills.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/* global $:false, MutationObserver:true, aleab:false */


// VARIABLES & CONSTANTS

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

const REGEX_WEAPONS_PAGE = /https:\/\/stats\.quake\.com\/profile\/.+\/weapon\/?/;
const REGEX_MATCHES_PAGE = /https:\/\/stats\.quake\.com\/profile\/.+\/matches\/.+/;

const GAMEMODE_ALL = "ALL";
const SCORING_EVENT_ABILITYKILL = "SCORING_EVENT_ABILITYKILL";
const SCORING_EVENT_RING_OUT = "SCORING_EVENT_RING_OUT";
const SCORING_EVENT_TELEFRAG = "SCORING_EVENT_TELEFRAG";
const prop_battleReportPersonalStatistics = "battleReportPersonalStatistics";
const prop_scoringEvents = "scoringEvents";

let selectedChampion = "ALL";
let selectingChampion = false;
let noUpdObjectFoundErrorLogged = false;

let config = {};


//—————————————————————————————————————

$(document).ready(function() {
    loadConfig();

    aleab.qcstats.addPageChangedListener(/.*/, () => {
        qcMatchScoreboardObserver.disconnect();
    });
    aleab.qcstats.addPageChangedListener(REGEX_MATCHES_PAGE, addAbilityStatsToMatchDetails);
    aleab.qcstats.addPageChangedListener(REGEX_WEAPONS_PAGE, addAbilityStatsToWeaponsPage);

    if (REGEX_MATCHES_PAGE.test(location.href)) {
        addAbilityStatsToMatchDetails();
    }

    if (REGEX_WEAPONS_PAGE.test(location.href)) {
        addAbilityStatsToWeaponsPage();
    }
});

function loadConfig() {
    config = aleab.qcstats.loadConfig();

    // Set defaults
    if (config.showTooltips === undefined) { config.showTooltips = true; }
    aleab.qcstats.saveConfig(config);
}

//—————————————————————————————————————


/*=============*
 *  FUNCTIONS  *
 *=============*/

// UTILITY FUNCTIONS

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function formatDamageNumber(n) {
    if (!n) { return; }
    if (typeof n === typeof String()) { n = Number(n); }
    else if (typeof n === typeof Number()) {}
    else { return; }

    if (Number.isNaN(n)) { return "N/A"; }
    else if (n === Number.POSITIVE_INFINITY) { return "∞"; }
    else if (n === Number.NEGATIVE_INFINITY) { return "-∞"; }

    if (n < 1e3) {
        n = `${n.toFixed(0)}`;
    } else if (n < 1e6) {
        n = n / 1e3;
        n = `${n.toFixed(n >= 10 ? 1 : 2)}k`;
    } else if (n < 1e9) {
        n = n / 1e6;
        n = `${n.toFixed(n >= 10 ? 1 : 2)}M`;
    } else if (n < 1e12) {
        n = n / 1e9;
        n = `${n.toFixed(n >= 10 ? 1 : 2)}b`;
    } else {
        n = n.toExponential(3);
    }
    return n;
}

function modifySvgCircle(svg, newValue) {
    if (!svg || newValue === undefined || newValue === null) {
        return;
    }

    if (typeof newValue === typeof String()) { newValue = Number(newValue); }
    else if (typeof newValue === typeof Number()) {}
    else { return; }

    svg.setAttribute("value", newValue);
    svg.value = newValue;
    $(svg).find("text")[0].innerHTML = Number.isNaN(newValue) ? "N/A" : `${(newValue * 100).toFixed(0)}%`;
    changeSvgCirclePercentage($(svg).find("circle")[1], newValue);
}

function changeSvgCirclePercentage(svgCircle, newValue) {
    if (!svgCircle || newValue === undefined || newValue === null) {
        return;
    }

    if (typeof newValue === typeof String()) { newValue = Number(newValue); }
    else if (typeof newValue === typeof Number()) {}
    else { return; }

    let dashArray = Number(svgCircle.getAttribute("stroke-dasharray"));
    let dashOffset = dashArray - (Number.isNaN(newValue) || !Number.isFinite(newValue) ? 0 : dashArray * newValue);
    svgCircle.setAttribute("stroke-dashoffset", dashOffset);
    svgCircle["stroke-dashoffset"] = dashOffset;
}

function addAccuratePercentagesTooltips() {
    // svg circles
    // Remove the current titles, if they had already been added
    $("svg > title.pct-tooltip").remove();

    let svgElements = $.grep($("svg"), svg => { return $(svg).find("circle").length == 2 && $(svg).find("text").length == 1; });
    if (svgElements && svgElements.length > 0) {
        $.each(svgElements, (i, svg) => {
            let svgValue = Number(svg.value || svg.getAttribute("value"));
            var title = document.createElementNS("http://www.w3.org/2000/svg", "title")
            $(title).addClass("pct-tooltip");
            title.innerHTML = Number.isNaN(svgValue) ? "Not available" : `${(svgValue * 100).toFixed(2)}%`;
            svg.prepend(title);
        });
    }
}


/*———————————*
 |  MATCHES  |
 *———————————*/

function addAbilityStatsToMatchDetails() {
    setTimeout(async function() {
        let waitingLogged = false;
        while ($(".profile-page .matchdetails-page").length == 0) {
            if (!waitingLogged) {
                console.log("[QCStats – Ability kills] Waiting for the match details...");
                waitingLogged = true;
            }
            await sleep(100);
        }

        console.log("[QCStats – Ability kills]");
        let scoreboard = $(".profile-page .matchdetails-page > .scoreboard");
        qcMatchScoreboardObserver.observe(scoreboard[0], { childList: true });
        qcMatchScoreboardObserver.observe(scoreboard[1], { childList: true });
    }, 200);
}

// This MutationObserver will observe the scoreboard element in search of changes to its children to see when one of them is expanded
var qcMatchScoreboardObserver = new MutationObserver(async function(mutations, observer) {
    if (!mutations || !mutations[0] || !mutations[0].addedNodes || mutations[0].addedNodes.length <= 0) {
        return;
    }

    let extendedPlayerInfo = $.grep(mutations[0].addedNodes, node => { return $(node).hasClass("extended"); })[0];
    if (!extendedPlayerInfo) {
        return;
    }

    let blocksJQ = $(extendedPlayerInfo).find(".item-block");
    if (!blocksJQ || blocksJQ.length <= 0) {
        return;
    }

    let weaponsBlock = $.grep(blocksJQ, block => {
        let h2 = $(block).find("h2")[0];
        return h2 !== undefined && h2.innerHTML == "Weapons";
    })[0];
    if (!weaponsBlock) {
        return;
    }

    let rowsJQ = $(weaponsBlock).find(".item-row");
    if (!rowsJQ || rowsJQ.length <= 0) {
        return;
    }

    // Get rows
    let rows = $.grep(rowsJQ, row => { return !$(row).hasClass("thead"); });
    let totalRow = $.grep(rows, row => { return $(row).find("div:first-child")[0].innerText == "Total"; })[0];
    let weaponRows = $.grep(rows, row => { return $(row).find("div:first-child")[0].innerText != "Total"; });

    // Get total stats
    let totalKills = Number($(totalRow).find("div:nth-child(2)")[0].innerText);
    let totalDamage = Number($(totalRow).find("div:nth-child(4)")[0].innerText);

    // Get weapons stats
    let weaponKills = 0;
    let weaponDamage = 0;
    $.each(weaponRows, (i, row) => {
        weaponKills += Number($(row).find("div:nth-child(2)")[0].innerText);
        weaponDamage += Number($(row).find("div:nth-child(4)")[0].innerText);
    });

    // Get the number of ring outs and telefrags
    let ringOuts = 0;
    let telefrags = 0;
    let matchId = location.href.match(/.*\/matches\/(.*)/)[1];
    let playerName = $(extendedPlayerInfo.previousSibling).find("div:first-child > a")[0].innerHTML;
    if (matchId && playerName) {
        await fetch(`https://stats.quake.com/api/v2/Player/Games?id=${matchId}&playerName=${encodeURIComponent(playerName)}`)
            .then(async function(response) {
                if (response.status === 200) {
                    await response.json().then(function(data) {
                        let playerMatchStats = $.grep(data[prop_battleReportPersonalStatistics], (v) => v.nickname === playerName)[0];
                        ringOuts = playerMatchStats[prop_scoringEvents][SCORING_EVENT_RING_OUT] || 0;
                        telefrags = playerMatchStats[prop_scoringEvents][SCORING_EVENT_TELEFRAG] || 0;
                    });
                }
            });
    }

    // Calculate ability stats
    let abilitiesKills = totalKills - weaponKills - ringOuts - telefrags;
    let abilitiesDamage = totalDamage - weaponDamage;

    let ringOutsRow = createNewMatchItemRow("Ring Out", "color: hsl(200, 5%, 40%)", ringOuts, undefined, undefined);
    let telefragsRow = createNewMatchItemRow("Telefrag", "color: hsl(295, 15%, 45%)", telefrags, undefined, undefined);
    let abilitiesRow = createNewMatchItemRow("Abilities", "color: hsl(165, 50%, 35%)", abilitiesKills, undefined, abilitiesDamage);

    totalRow.parentNode.insertBefore(ringOutsRow, totalRow.nextSibling);
    ringOutsRow.parentNode.insertBefore(telefragsRow, ringOutsRow.nextSibling);
    telefragsRow.parentNode.insertBefore(abilitiesRow, telefragsRow.nextSibling);
});

function createNewMatchItemRow(label, labelStyle, kills, accuracy, damage) {
    let row = document.createElement("div");
    row.className = "item-row";

    let d = document.createElement("div"); // Label
    d.innerText = label;
    d.style = labelStyle;
    row.appendChild(d);

    d = document.createElement("div"); // Kills
    d.innerText = kills !== undefined ? kills.toString() : "N/A";
    row.appendChild(d);

    d = document.createElement("div"); // Accuracy
    d.innerText = accuracy !== undefined ? accuracy.toString() : "N/A";
    row.appendChild(d);

    d = document.createElement("div"); // Damage
    d.innerText = damage !== undefined ? damage.toString() : "N/A";
    row.appendChild(d);

    return row;
}


/*———————————*
 |  WEAPONS  |
 *———————————*/

function addAbilityStatsToWeaponsPage() {
    setTimeout(async function() {
        let waitingLogged = false;
        while ($(".profile-page .champion-selector").length == 0) {
            if (!waitingLogged) {
                console.log("[QCStats – Ability kills] Waiting for the weapons stats...");
                waitingLogged = true;
            }
            await sleep(100);
        }

        console.log("[QCStats – Ability kills]");
        let champions = $(".profile-page .champion-selector > .champion");
        $.each(champions, (i, node) => {
            let nodeJQ = $(node);
            nodeJQ.mousedown(() => weaponsPageChampion_onMouseDown(nodeJQ));
            nodeJQ.mouseup(() => weaponsPageChampion_onMouseUp(nodeJQ));
        });
        await addAbilityStatsItemToWeaponsPage();
        if (config.showTooltips) {
            addAccuratePercentagesTooltips();
        }
    }, 200);
}

async function addAbilityStatsItemToWeaponsPage() {
    // Check if window.upd exists; if not, wait for it until timeout (5s)
    let timeWaitedForUpdObject = 0;
    while (!window.upd) {
        if (timeWaitedForUpdObject > 5000) {
            break;
        }
        await sleep(100);
        timeWaitedForUpdObject += 100;
    }
    if (!window.upd) {
        if (!noUpdObjectFoundErrorLogged) {
            console.error("[QCStats] No upd object found!");
            noUpdObjectFoundErrorLogged = true;
        }
        return;
    }

    let infoBoxJQ = $(".profile-page .info-box.bare");
    if (!infoBoxJQ || infoBoxJQ.length <= 0) {
        return;
    }

    // Remove the ability item if it's already there
    infoBoxJQ.find(".ability-item").remove();

    let weaponItemsJQ = infoBoxJQ.find(".weapon-item");
    if (!weaponItemsJQ || weaponItemsJQ.length <= 0) {
        return;
    }

    // Get the ability image url
    let imageUrl = aleab.qcstats.abilityImages[selectedChampion];
    if (imageUrl) {
        imageUrl = `https://stats.quake.com/${imageUrl}`;
    } else if (imageUrl === undefined) {
        // Don't even add a new item to the box if the selected champion doesn't have a damage ability
        return;
    }

    // Get the champion's ability damage types
    let damageTypes = aleab.qcstats.championAbilityDamageTypes[selectedChampion];
    if (damageTypes === null) {
        damageTypes = [];
        $.each(aleab.qcstats.championAbilityDamageTypes, (k, v) => {
            if (!v) { return true; }
            $.each(v, (i, s) => {
                if (!s) { return true; }
                damageTypes.push(s);
            });
        });
    }

    // Calculate ability stats
    let abilityStats = {
        accuracy: { acc: 0, n: 0 },
        killHitPercentage: { pct: 0, n: 0 },
        killPercentage: { pct: 0, n: 0 },
        kills: Number(window.upd.stats[selectedChampion].gameModes[GAMEMODE_ALL][SCORING_EVENT_ABILITYKILL]),
        damage: 0
    };

    $.each(damageTypes, (i, damageType) => {
        let d = window.upd.stats[selectedChampion].damageStatusList[damageType];
        if (d.accuracy > 0.0) {
            abilityStats.accuracy.n++;
            abilityStats.accuracy.acc += Number(d.accuracy);
        }
        if (d.killhitpct > 0.0) {
            abilityStats.killHitPercentage.n++;
            abilityStats.killHitPercentage.pct += Number(d.killhitpct);
        }
        if (d.killpct > 0.0) {
            abilityStats.killPercentage.n++;
            abilityStats.killPercentage.pct += Number(d.killpct);
        }
        abilityStats.damage += Number(d.damage);
    });

    abilityStats.accuracy = abilityStats.accuracy.acc > 0.0 ? abilityStats.accuracy.acc / abilityStats.accuracy.n : Number.NaN;
    abilityStats.killHitPercentage = abilityStats.killHitPercentage.pct > 0.0 ? abilityStats.killHitPercentage.pct / abilityStats.killHitPercentage.n : Number.NaN;
    abilityStats.killPercentage = abilityStats.killPercentage.pct > 0.0 ? abilityStats.killPercentage.pct / abilityStats.killPercentage.n : Number.NaN;

    console.log(`[QCStats – Ability kills] ${selectedChampion}:`, abilityStats);

    // Clone the last HTML item in the box
    let abilityItemJQ = weaponItemsJQ.last().clone();
    abilityItemJQ.addClass("ability-item");
    abilityItemJQ.appendTo(infoBoxJQ);

    // Modify the ability item
    let abilityItemCells = abilityItemJQ.find("div");

    // - Weapon
    let cellJQ = $(abilityItemCells[0]);
    cellJQ.find(".weapon")[0].innerText = "Ability";
    if (imageUrl) {
        let img = cellJQ.find("img")[0];
        img.src = imageUrl;
        img.alt = "Ability";
    } else {
        cellJQ.css("display", "flex").css("flex-flow", "column nowrap").css("justify-content", "center");
        cellJQ.find(".weapon").css("margin-bottom", "0");
        cellJQ.find("img").remove();
    }

    // - Accuracy
    cellJQ = $(abilityItemCells[1]);
    modifySvgCircle(cellJQ.find("svg")[0], abilityStats.accuracy);

    // - Kills / Hits
    cellJQ = $(abilityItemCells[2]);
    modifySvgCircle(cellJQ.find("svg")[0], abilityStats.killHitPrecentage);

    // - Kill %
    cellJQ = $(abilityItemCells[3]);
    modifySvgCircle(cellJQ.find("svg")[0], abilityStats.killPercentage);

    // - Kills
    cellJQ = $(abilityItemCells[4]);
    cellJQ.find(".value")[0].innerText = abilityStats.kills.toString();

    // - Damage
    cellJQ = $(abilityItemCells[5]);
    cellJQ.find(".value")[0].innerText = formatDamageNumber(abilityStats.damage);
}

function weaponsPageChampion_onMouseDown(nodeJQ) {
    selectingChampion = false;
    if (!nodeJQ || !(nodeJQ instanceof $) || nodeJQ.length <= 0) {
        return;
    }

    if (!$(nodeJQ[0]).hasClass("selected")) {
        selectingChampion = true;
    }
}

function weaponsPageChampion_onMouseUp(nodeJQ) {
    if (!nodeJQ || !(nodeJQ instanceof $) || nodeJQ.length <= 0) {
        selectingChampion = false;
        return;
    }

    if (selectingChampion) {
        selectingChampion = false;
        selectedChampion = nodeJQ[0].getAttribute("data-champion");
        setTimeout(async function() {
            await addAbilityStatsItemToWeaponsPage();
            if (config.showTooltips) {
                addAccuratePercentagesTooltips();
            }
        }, 100);
    }
}