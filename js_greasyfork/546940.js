// ==UserScript==
// @name         ICEHL JSON
// @namespace    cz.icehl.table
// @version      1.2.
// @author       JV
// @license      MIT
// @description  Tabulka z gameData
// @match        https://s3.eu-west-1.amazonaws.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546940/ICEHL%20JSON.user.js
// @updateURL https://update.greasyfork.org/scripts/546940/ICEHL%20JSON.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let data;
  try {
    data = JSON.parse(document.body.textContent);
  } catch (e) {
    console.error("Nepodařilo se parsovat JSON", e);
    return;
  }

  const g = data?.data?.gameData ?? {};

  // vytvoření tabulky
  const tbl = document.createElement('table');
  tbl.setAttribute('border','1');
  tbl.setAttribute('cellspacing','0');
  tbl.setAttribute('cellpadding','6');
  tbl.style.cssText = `
    border-collapse: collapse;
    font-family: sans-serif;
    font-size: 14px;
    margin-top: 60px;   /* posun dolů, aby nebyla pod horní lištou */
    margin-bottom: 20px;
    background: #fff;
    box-shadow: 0 4px 16px rgba(0,0,0,.1);
  `;
  tbl.innerHTML = `
    <tr><th align="left">Home Team</th><td>${g.homeTeamLongname ?? '-'}</td></tr>
    <tr><th align="left">Away Team</th><td>${g.awayTeamLongname ?? '-'}</td></tr>
    <tr><th align="left">Score</th><td><b>${g.homeTeamScore}:${g.awayTeamScore}</b></td></tr>
    <tr><th align="left">Time</th><td>${g.liveTimeFormatted ?? '-'}</td></tr>
    <tr><th align="left">Phase</th><td>${g.liveTimeGamePhase ?? '-'}</td></tr>
  `;

  // vložení na začátek stránky (před JSON <pre>)
  document.body.insertBefore(tbl, document.body.firstChild);
})();
