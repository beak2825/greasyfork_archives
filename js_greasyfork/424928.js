// ==UserScript==
// @name         Compact Blaseball
// @namespace    CompactBlaseball-KP
// @version      1.0
// @description  Scaled-down, multi-column layout for Blaseball games, standings, and idol lists
// @author       UPSKingpin
// @match        https://*.blaseball.com/*
// @match        https://www.blaseball.com/*
// @icon         https://www.blaseball.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424928/Compact%20Blaseball.user.js
// @updateURL https://update.greasyfork.org/scripts/424928/Compact%20Blaseball.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const s = document.createElement('style');
    s.innerHTML = `

/* Extend Background Through Page */
.theme-dark {
  background: black;
  margin-bottom: 64px;
}

/* Flexible Grid Layout */
.Main-Body > div > ul:not(.Standings-Subleague-Container):not(.Leaderboard-Player-Container) {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  left: 0px;
  min-height: 600px;
  padding-bottom: 88px;
  position: absolute;
  width: auto;
}

/* In Progress Game Layout */
.GameWidget-Full-Live {
  display: grid;
  gap: 2px;
  grid-template-columns: 100%;
  grid-template-rows: 40% 37% 23%;
  justify-content: center;
  margin: -28px -32px;
  min-height: 400px;
  width: 420px;
  transform: scale(0.8,0.8);
}

/* Finished Game Layout */
.GameWidget.IsComplete.GameWidget-Full-Live {
  display: grid;
  gap: 2px;
  grid-template-columns: 100%;
  grid-template-rows: 40% 37% 23%;
  justify-content: center;
  margin: -14px -32px;
  min-height: 400px;
  width: 420px;
  transform: scale(0.8,0.8);
}

/* Upcoming Game Layout */
.GameWidget-Full-Upcoming {
  display: grid;
  gap: 2px;
  grid-template-columns: 100%;
  grid-template-rows: 35% 35% 30%;
  justify-content: center;
  margin: -56px -32px;
  min-height: 680px;
  width: 420px;
  transform: scale(0.8,0.8);
}

/* Scale Down Standings */
.Standings-Subleague-Container {
  margin-top: -80px;
  transform: scale(0.8,0.8);
}

/* Scale Down Idols */
.Leaderboard-Player-Container {
  margin-top: -100px;
  transform: scale(0.8,0.8);
}

/* Disable Footer */
.Main-Footer {
  display: none;
}

`
    document.body.appendChild(s);
})();