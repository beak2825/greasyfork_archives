// ==UserScript==
// @name         Chess.com - Tilt "Preventer"
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simple tool to lock you out once you lost n number of games for the day. You have to check stat page, and n <= num of games listed on that page.
// @author       You
// @match        https://www.chess.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475390/Chesscom%20-%20Tilt%20%22Preventer%22.user.js
// @updateURL https://update.greasyfork.org/scripts/475390/Chesscom%20-%20Tilt%20%22Preventer%22.meta.js
// ==/UserScript==

// Settings
const username = "SaberSpeed77";
const maxLosses = 3;
const warningColor = "white";
const backgroundColor = "#3a456e";
//

const curDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function giveWarning() {
      const warning = document.createElement('p');
      warning.textContent = "It's time to take a break...";
      warning.style.color = warningColor;
      warning.style.textAlign = "center";
      warning.style.position = "center";
      warning.style.fontSize = "100px";
      const html = document.querySelector('html');
      while (html.firstChild) {
          html.removeChild(html.firstChild);
      }
      html.style.backgroundColor = backgroundColor;
      html.appendChild(warning);
}

function run() {
  if (GM_getValue("dateIssued") === curDate) {
      giveWarning();
      clearInterval(i);
      return;
  }
  var games = document.querySelectorAll(".archived-games-table-row");
  var tally = 0;
  games.forEach(function(g) {
      if (g.children[6].textContent.includes(curDate) && g.children[1].textContent.includes(username) &&
          g.children[2].querySelector(".archived-games-result").children[0]._prevClass.includes("lost")) {
          tally += 1;
      }
  })

  if (tally >= maxLosses) {
      giveWarning();
      clearInterval(i);
      GM_setValue("dateIssued", curDate);
  }
}
var i = setInterval(run, 3000);
