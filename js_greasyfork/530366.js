// ==UserScript==
// @name         transfermarkt match exporter
// @description  exports match data from transfermarkt match reports
// @namespace    http://tampermonkey.net/
// @version      1.3
// @author       You
// @match        https://www.transfermarkt.com/*/spielbericht/*
// @match        https://www.transfermarkt.de/*/spielbericht/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=transfermarkt.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @require      https://unpkg.com/x-frame-bypass@latest/x-frame-bypass.js
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/530366/transfermarkt%20match%20exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/530366/transfermarkt%20match%20exporter.meta.js
// ==/UserScript==

let btn = document.createElement("button");
btn.id = "floatingButton";
btn.textContent = "Export";
btn.onclick = async function () {
  btn.textContent = "Loading...";
  const report = {};

  await generateLineupData();
  await generateMatchCourseData();

  //document
  //  .getElementById("4373743")
  //  .shadowRoot.querySelector("li.svelte-zxas2b:nth-child(1) > a:nth-child(1)")
  //  .click();
  //await delay(1000);
  //await generateMatchCourseData();

  //const ground = document
  //  .querySelector("span.hide-for-small > a:nth-child(1)")
  //  .innerText.trim();

  //const attendanceContainer = document.querySelector(
  //  "span.hide-for-small > strong:nth-child(2)",
  //);
  //if (attendanceContainer)
  //  report.attendance = attendanceContainer.innerText.split(": ")[1].trim();

  //report.ground = ground;
  report.events = {
    substitutions: subEvents,
    goals: goalEvents,
    cards: cardEvents,
  };
  report.players = players;
  document.getElementById("loadingSpinner").style.display = "none";
  document.getElementById("popup-body").innerText = JSON.stringify(report);
  GM_setClipboard(JSON.stringify(report), "json");
  if (report.players.length > 0) {
    btn.style.backgroundColor = "#28a745";
    btn.textContent = "Copied!";
    setTimeout(() => {
      btn.textContent = "Export";
      btn.style.backgroundColor = "#007BFF";
    }, 1500);
  }
};

function getPlayerId(url) {
  if (url.includes("player-id/")) {
    return url.split("player-id/")[1];
  }

  return url.split("userid/")[1];
}

function findPlayerIdByName(name) {
  const player = players.find((p) => p.name === name);
  return player ? player.id : null;
}

const players = [];
const subEvents = [];
const goalEvents = [];
const cardEvents = [];

function fetchPlayers(doc, playerTable, home, substitutes = false) {
  const table = doc.querySelector(playerTable);
  Array.from(table.rows).forEach((row) => {
    let id = row.querySelector("a.wichtig").href;
    players.push({
      id,
      name: row.querySelector("a.wichtig").innerText,
      number: row.querySelector(".rn_nummer").innerText.trim(),
      home,
      sub: substitutes,
    });
  });
}

async function generateLineupData() {
  return new Promise((resolve) => {
    players.length = 0;
    const href = document
      .querySelector("tm-subnavigation[section=spielbericht]")
      .shadowRoot.querySelector(
        "li.svelte-zxas2b:nth-child(2) > a:nth-child(1)",
      ).href;

    GM_xmlhttpRequest({
      method: "GET",
      url: href,
      onload: async function (response) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(response.responseText, "text/html");
        // home starting
        fetchPlayers(
          doc,
          "div.row:nth-child(8) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > table:nth-child(1)",
          true,
          false,
        );
        // away starting
        fetchPlayers(
          doc,
          "div.row:nth-child(8) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > table:nth-child(1)",
          false,
          false,
        );
        // home subs
        fetchPlayers(
          doc,
          "div.row:nth-child(9) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > table:nth-child(1)",
          true,
          true,
        );
        // away subs
        fetchPlayers(
          doc,
          "div.row:nth-child(9) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > table:nth-child(1)",
          false,
          true,
        );
        resolve();
      },
    });
  });
}

async function generateMatchCourseData() {
  subEvents.length = 0;
  goalEvents.length = 0;
  return new Promise((resolve) => {
    generateGoalsData();
    generateSubData();
    generateCardData();
    resolve();
  });
}

function generateGoalsData() {
  goalEvents.length = 0;
  const container = document.querySelector("#sb-tore");
  if (!container) return;

  const actions = Array.from(container.querySelectorAll("li"));
  actions.forEach((action) => {
    const baseData = getActionBaseData(action);
    const players = action.querySelectorAll("a.wichtig");
    const player = players[0].href;
    const assist = players[1]?.href ?? null;

    goalEvents.push({
      ...baseData,
      player,
      assist,
    });
  });
}

function generateSubData() {
  subEvents.length = 0;
  const container = document.querySelector("#sb-wechsel");
  if (!container) return;

  const actions = Array.from(container.querySelectorAll("li"));
  actions.forEach((action) => {
    const baseData = getActionBaseData(action);
    const on = action.querySelector(".sb-aktion-wechsel-ein .wichtig").href;
    const off = action.querySelector(".sb-aktion-wechsel-aus .wichtig").href;

    subEvents.push({
      ...baseData,
      on,
      off,
    });
  });
}

function generateCardData() {
  cardEvents.length = 0;
  const container = document.querySelector("#sb-karten");
  if (!container) return;

  const actions = Array.from(container.querySelectorAll("li"));
  actions.forEach((action) => {
    const baseData = getActionBaseData(action);
    const id = action.querySelector(".sb-aktion-aktion .wichtig").href;

    let type;
    if (action.querySelector(".sb-gelb")) type = "yellow";
    else if (action.querySelector(".sb-gelbrot")) type = "yellow-red";
    else if (action.querySelector(".sb-rot")) type = "red";

    cardEvents.push({
      ...baseData,
      id,
      card: type,
    });
  });
}

function getActionBaseData(action) {
  const home = !action.classList.contains("sb-aktion-gast");
  const clockPos = action
    .querySelector(".sb-sprite-uhr-klein")
    .style.backgroundPosition.split(" ")
    .map((c) => c.split("px")[0]);
  const minute = getTime(clockPos[0], clockPos[1]).toString();
  let added =
    action.querySelector(".sb-sprite-uhr-klein").innerText.trim() ?? null;
  if (added.length === 0) added = null;
  else added = added.substring(1);

  return {
    home,
    minute,
    added,
  };
}

function getTime(x, y) {
  x = parseInt(x);
  y = parseInt(y);
  const spriteWidth = 36;
  const spriteHeight = 36;
  const columns = 10;

  let col = Math.abs(x) / spriteWidth;
  let row = Math.abs(y) / spriteHeight;

  return row * columns + col + 1;
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

GM_addStyle(`
#floatingButton {
position: fixed;
bottom: 20px;
right: 20px;
padding: 10px 20px;
background-color: #007BFF;
color: white;
font-size: 16px;
font-weight: bold;
border: none;
border-radius: 10px;
box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
cursor: pointer;
z-index: 9999;
transition: background-color 0.3s ease, transform 0.2s ease;
}
#floatingButton:hover {
background-color: #0056b3;
transform: scale(1.1);
}
`);

document.body.appendChild(btn);
