// ==UserScript==
// @name         Mythic gains
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  display team progress for comp
// @author       You
// @match        https://wiseoldman.net/competitions/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474303/Mythic%20gains.user.js
// @updateURL https://update.greasyfork.org/scripts/474303/Mythic%20gains.meta.js
// ==/UserScript==

const SKILLS = [
  "Overall",
  "Attack",
  "Defence",
  "Strength",
  "Hitpoints",
  "Ranged",
  "Prayer",
  "Magic",
  "Cooking",
  "Woodcutting",
  "Fletching",
  "Fishing",
  "Firemaking",
  "Crafting",
  "Smithing",
  "Mining",
  "Herblore",
  "Agility",
  "Thieving",
  "Slayer",
  "Farming",
  "Runecrafting",
  "Hunter",
  "Construction",
];

const XP = [
  0,
  83,
  174,
  276,
  388,
  512,
  650,
  801,
  969,
  1154,
  1358,
  1584,
  1833,
  2107,
  2411,
  2746,
  3115,
  3523,
  3973,
  4470,
  5018,
  5624,
  6291,
  7028,
  7842,
  8740,
  9730,
  10824,
  12031,
  13363,
  14833,
  16456,
  18247,
  20224,
  22406,
  24815,
  27473,
  30408,
  33648,
  37224,
  41171,
  45529,
  50339,
  55649,
  61512,
  67983,
  75127,
  83014,
  91721,
  101333,
  111945,
  123660,
  136594,
  150872,
  166636,
  184040,
  203254,
  224466,
  247886,
  273742,
  302288,
  333804,
  368599,
  407015,
  449428,
  496254,
  547953,
  605032,
  668051,
  737627,
  814445,
  899257,
  992895,
  1096278,
  1210421,
  1336443,
  1475581,
  1629200,
  1798808,
  1986068,
];

const teamCache = {};

function getLevel(xp) {
  let level = 0;
  for (const x of XP) {
    if (xp >= x) {
      level++;
    } else {
      return level;
    }
  }
  return level;
}

async function fetchGains(player, startDate = startDate, endDate = endDate) {
  // fetch gains via wiseoldman api
  let url = `https://api.wiseoldman.net/v2/players/${player}/gained?startDate=${startDate}&endDate=${endDate}`;
  let response = await fetch(url);
  let { data } = await response.json();
  // return array of xp gains
  return SKILLS.map((skill) => data.skills[skill.toLowerCase()].experience.gained);
}

async function updateTeam() {
  let totalGains = null;

  // exit if no team is selected
  if ([...document.querySelectorAll(".-highlighted")].length < 2) return;

  // get name of team
  const teamName = document.querySelectorAll(".-highlighted")[1].innerHTML;

  // check cache
  if (teamCache.hasOwnProperty(teamName)) {
    totalGains = teamCache[teamName];
    console.log(teamCache);
  } else {
    // get array of player names displayed
    let players = [...document.querySelectorAll(".player-tag__name")].map((a) => a.innerHTML);

    // get start/end time
    const href = document.querySelector(".player-tag").parentElement.href;
    let startDate = href.match(/(?<=startDate=)[\d\-:\.T]+Z/)[0];
    let endDate = href.match(/(?<=endDate=)[\d\-:\.T]+Z/)[0];

    // get all player gains
    const playerGains = await Promise.all(players.map(async (player) => fetchGains(player, startDate, endDate)));

    // sum gains
    totalGains = playerGains.reduce((totals, a) => {
      a.forEach((xp, i) => (totals[i] += xp));
      return totals;
    }, Array(24).fill(0));

    // calculate overall gain with 2m cap
    let overallLevel = 0;
    let overallXp = totalGains.slice(1).reduce((a, b) => {
      overallLevel += getLevel(b);
      return a + (b > 2000000 ? 2000000 : b);
    }, 0);

    // calculate virtual levels
    totalGains = totalGains.map((a) => ({ xpGain: a, levelGain: getLevel(a) }));

    // overall gains
    totalGains[0] = { xpGain: overallXp, levelGain: overallLevel };
    teamCache[teamName] = totalGains;
  }

  // create table
  const table = `<table id="gains-table" class="table -clickable" cellspacing="0" cellpadding="0">
  <colgroup>
    <col>
    <col>
    <col>
  </colgroup>
  <thead>
    <tr>
      <th class="-primary">Skill<div class="-default"></div>
      </th>
      <th class="">Exp.<div class="-default"></div>
      </th>
      <th class="">Levels<div class="-default"></div>
      </th>
    </tr>
  </thead>
  <tbody>
  ${SKILLS.map((skill, i) => {
    let { xpGain, levelGain } = totalGains[i];
    return `<tr>
    <td class="-primary">
    <div class="metric-tag"><img src="/img/runescape/icons_small/${skill.toLowerCase()}.png" alt="" style="margin-right:10px"><span>${skill}</span></div>
    </td>
    <td class=""><button class="number-label-btn" type="button"><abbr class="number-label ${
      xpGain > 0 ? "-positive" : ""
    }"
    title="${xpGain.toLocaleString("en-US")}"><span>+${
      xpGain >= 10000 ? Math.floor(xpGain / 1000) + "k" : xpGain.toLocaleString("en-US")
    }</span></abbr></button></td>
    <td class=""><button class="number-label-btn" type="button"><abbr class="number-label ${
      levelGain > 0 ? "-positive" : ""
    }"
    title="${levelGain}"><span>${levelGain}</span></abbr></button></td>
    </tr>
    `;
  }).join("\n")}
  </tbody>
  </table>`;

  // insert html
  let existingTable = document.getElementById("gains-table");
  if (existingTable) existingTable.remove();
  document.querySelector("table").insertAdjacentHTML("afterend", table);
}

let loadCheckInterval = setInterval(() => {
  if ([...document.querySelectorAll(".table-toggle-btn")].length > 0) {
    clearInterval(loadCheckInterval);
    console.log("loaded");
    // add event listeners
    [...document.querySelectorAll(".table-toggle-btn")].forEach((element) =>
      element.addEventListener("click", (e) => {
        setTimeout(function () {
          updateTeam();
        }, 100);
      })
    );
  }
}, 500);
