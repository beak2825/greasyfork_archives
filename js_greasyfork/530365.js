// ==UserScript==
// @name         Fussball.de match data exporter
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @author       Hendrik Steinmetz
// @match        https://www.fussball.de/spiel/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fussball.de
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MGPLv3
// @description exports data from fussball.de match reports
// @downloadURL https://update.greasyfork.org/scripts/530365/Fussballde%20match%20data%20exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/530365/Fussballde%20match%20data%20exporter.meta.js
// ==/UserScript==

// event types:
// gelb: 2
// gelb-rot: 9
// rot: 3

let btn = document.createElement("button");
btn.id = "floatingButton";
btn.textContent = "Export";
btn.onclick = async function () {
  btn.textContent = "Loading...";
  const report = {};
  document
    .querySelector("[data-tracking-pagename-long='spiel_spielverlauf']")
    .click();
  await delay(1000);
  await generateMatchCourseData();

  document
    .querySelector("[data-tracking-pagename-long='spiel_aufstellung']")
    .click();
  await delay(1000);
  await generateLineupData();

  const liveticker = document.querySelector(
    "[data-tracking-pagename-long='spiel_liveticker']",
  );
  if (liveticker) {
    liveticker.click();
    await delay(1000);
    await generateCardData();
  }

  const ground = document
    .querySelector("a.location")
    .innerText.split(",")[1]
    .trim();

  const attendanceContainer = document.querySelector(
    "li.row:nth-child(4) > span:nth-child(2)",
  );
  if (attendanceContainer) report.attendance = attendanceContainer.innerText;

  if (missingPlayers.length > 0) {
      alert("The following players are unavailable and missing from the match report:\n" + missingPlayers.map(p => p.number));
  }

  report.ground = ground;
  report.events = {
    substitutions: subEvents,
    goals: goalEvents,
    cards: cardEvents
  };
  report.players = players;
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
const missingPlayers = [];
const subEvents = [];
const goalEvents = [];
const cardEvents = [];

/**
 * Fetches player information by loading the player's profile in an iframe.
 *
 * @param {string} url - The URL to the player's profile.
 * @param {string} number - The player's number.
 * @param {boolean} home - Indicates if the player is from the home team.
 * @param {boolean} sub - Indicates if the player is a substitute.
 * @returns {Promise<void>} A promise that resolves when the player information is fetched.
 */
async function fetchPlayerInfo(url, number, home, sub) {
  let parser = new DOMParser();
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url,
      onload: (response) => {
        let doc = parser.parseFromString(response.responseText, "text/html");
        const title = doc.title;
        const seperator = title.includes("(") ? "(" : "Basisprofil";
        const name = title.substring(0, title.indexOf(seperator) - 1).trim();
        const obj = {
          id: getPlayerId(url),
          number,
          name: name,
        };
        if (name) {
          players.push({
            ...obj,
            home,
            sub,
          });
          resolve();
        } else {
          console.error("Player info unavailable for: ", {number, url});
          missingPlayers.push({
             url, number
          });
          resolve();
        }
      },
    });
  });
}

async function fetchPlayers(containerSelector, home, substitutes = false) {
  const container = document.querySelector(containerSelector);
  const players = container.querySelectorAll(".player-wrapper");

  const promises = Array.from(players).map((player) => {
    const playerLink = player.attributes.href.value;
    let number = player.querySelector(".player-number").innerText;
    if (number.startsWith("0")) number = number.substring(1);
    return fetchPlayerInfo(playerLink, number, home, substitutes);
  });

  await Promise.all(promises);
}

async function generateLineupData() {
  players.length = 0;
  missingPlayers.length = 0;
  // home starting
  await fetchPlayers(
    "html body div#match_course_body div.match-lineup div.field-wrapper div.field div.starting.container div.club-wrapper div.club",
    true,
    false,
  );
  // away starting
  await fetchPlayers(
    "html body div#match_course_body div.match-lineup div.field-wrapper div.field div.starting.container div.club-wrapper div.club.last",
    false,
    false,
  );
  // home subs
  await fetchPlayers(
    "html body div#match_course_body div.match-lineup div.extra-wrapper div.extra.container div.substitutes.club-wrapper div.club",
    true,
    true,
  );
  // away subs
  await fetchPlayers(
    "html body div#match_course_body div.match-lineup div.extra-wrapper div.extra.container div.substitutes.club-wrapper div.club.last",
    false,
    true,
  );
}

async function generateMatchCourseData() {
  subEvents.length = 0;
  goalEvents.length = 0;
  return new Promise((resolve, reject) => {
    const events = document.querySelectorAll(".row-event");

    events.forEach((event) => {
      const timeVal = event.querySelector(".valign-inner").innerText;
      const minute = timeVal.split("\n")[0].trim();
      const added = timeVal.includes("+")
        ? timeVal.split("\n")[1].substring("1")
        : null;

      if (event.querySelector(".substitute") !== null) {
        const on = event
          .querySelector(".column-player .valign-cell")
          .querySelectorAll("a")[0].href;
        const off = event
          .querySelector(".column-player .valign-cell")
          .querySelectorAll("a")[1].href;

        subEvents.push({
          minute: minute.substring(0, minute.indexOf("’")).trim(),
          added,
          home: event.classList.contains("event-left"),
          on: getPlayerId(on),
          off: getPlayerId(off),
        });
      } else if (event.querySelector(".green") !== null) {
        const player = event
          .querySelector(".column-player .valign-cell")
          .querySelector("a").href;

        goalEvents.push({
          minute: minute.substring(0, minute.indexOf("’")).trim(),
          added,
          home: event.classList.contains("event-left"),
          player: getPlayerId(player),
        });
      }
    });
    resolve();
  });
}

async function generateCardData() {
  cardEvents.length = 0;
  return new Promise((resolve, reject) => {
    const redCardEvents = Array.from(
      document.querySelectorAll(".lt-event-type-3"),
    );
    const yellowCardEvents = Array.from(
      document.querySelectorAll(".lt-event-type-2"),
    );
    const yellowRedCardEvents = Array.from(
      document.querySelectorAll(".lt-event-type-9"),
    );
    const total = redCardEvents
      .concat(yellowCardEvents)
      .concat(yellowRedCardEvents);

    total.forEach((event) => {
      if (event.querySelector("img") === null) return;

      let kind = "";
      if (event.classList.contains("lt-event-type-9")) kind = "yellow-red";
      else if (event.classList.contains("lt-event-type-2")) kind = "yellow";
      else if (event.classList.contains("lt-event-type-3")) kind = "red";

      const time = event.querySelector(
        "[data-ng-bind='event.minute']",
      ).innerText;
      let playerName = event.querySelector("img").alt;
      playerName = playerName.substring(0, playerName.indexOf("(") - 1);

      cardEvents.push({
        card: kind,
        minute: time,
        id: findPlayerIdByName(playerName),
      });
    });
    resolve();
  });
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
