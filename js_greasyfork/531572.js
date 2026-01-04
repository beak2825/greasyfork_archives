// ==UserScript==
// @name         Soccerway Match Data Exporter
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Exports match data from Soccerway match reports
// @author       Hendrik Steinmetz
// @match        https://*.soccerway.com/matches/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soccerway.com
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/531572/Soccerway%20Match%20Data%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/531572/Soccerway%20Match%20Data%20Exporter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let btn = document.createElement("button");
  btn.id = "floatingButton";
  btn.textContent = "Export";
  btn.onclick = async function () {
    btn.textContent = "Loading...";
    await generateMatchData();
    const report = {
      source: "soccerway",
      players,
      events,
    };
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

  const players = [];
  const events = {
    goals: [],
    substitutions: [],
    cards: [],
  };

  function handlePlayerRow(row, isHome, isSub) {
    console.log(row);

    if (row.innerText.startsWith("Trainer")) return;

    const bookings = row.querySelector(".bookings");
    const subEvent =
      row.querySelector(".substitute-in") &&
      row.querySelector(".substitute-out");
    let playerName = row
      .querySelector(".player")
      .innerText.split("for")[0]
      .trim();
    const playerObj = {
      id: row.querySelectorAll("a")[0].href,
      name: playerName,
      number: row.querySelector(".shirtnumber").innerText.trim(),
      home: isHome,
      sub: isSub,
    };
    players.push(playerObj);

    if (isSub && subEvent) {
      const subIn = row.querySelector(".substitute-in a");
      const subOut = row.querySelector(".substitute-out a");
      let minuteText = row
        .querySelector(".substitute-out")
        .innerText.trim()
        .split(" ")
        .pop();
      minuteText = minuteText.replace("'", "");
      const minute = minuteText.split("+")[0];
      const added = minuteText.includes("+") ? minuteText.split("+")[1] : null;

      events.substitutions.push({
        home: isHome,
        minute,
        added,
        on: subIn.href,
        off: subOut.href,
      });
    }

    if (bookings) {
      const arr = Array.from(bookings.querySelectorAll("span"));
      arr.forEach((booking) => {
        const imgUrl = booking.querySelector("img").src;
        const time = booking.innerText.trim().replace("'", "");
        const added = time.includes("+") ? time.split("+")[1] : null;
        const minute = time.split("+")[0];

        const filename = imgUrl.split("/").pop();

        if (filename.includes("G.png")) {
          events.goals.push({
            home: isHome,
            minute,
            added,
            player: playerObj.id,
          });
        } else if (filename.includes("YC.png")) {
          events.cards.push({
            home: isHome,
            minute,
            added,
            player: playerObj.id,
            type: "yellow",
          });
        } else if (filename.includes("RC.png")) {
          events.cards.push({
            home: isHome,
            minute,
            added,
            player: playerObj.id,
            type: "red",
          });
        } else if (filename.includes("Y2C.png")) {
          events.cards.push({
            home: isHome,
            minute,
            added,
            player: playerObj.id,
            type: "yellow-red",
          });
        }
      });
    }
  }

  async function generateMatchData() {
    players.length = 0;
    events.cards.length = 0;
    events.goals.length = 0;
    events.substitutions.length = 0;
    const containers = document.querySelectorAll("table.lineups");

    const homePlayersStarting = containers[0].rows;
    const awayPlayersStarting = containers[1].rows;
    const homePlayersSubs = containers[2].rows;
    const awayPlayersSubs = containers[3].rows;

    Array.from(homePlayersStarting)
      .slice(1, -1)
      .forEach((row) => handlePlayerRow(row, true, false));

    Array.from(awayPlayersStarting)
      .slice(1, -1)
      .forEach((row) => handlePlayerRow(row, false, false));

    Array.from(homePlayersSubs)
      .slice(1)
      .forEach((row) => handlePlayerRow(row, true, true));

    Array.from(awayPlayersSubs)
      .slice(1)
      .forEach((row) => handlePlayerRow(row, false, true));
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
    }`);
  document.body.appendChild(btn);
})();
