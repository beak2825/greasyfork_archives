// ==UserScript==
// @name         WTA Match Stats Table
// @namespace    http://tampermonkey.net/
// @version      3.9
// @author       JV
// @license      MIT
// @description  Přehledná tabulka statistik WTA zápasu
// @match        https://api.wtatennis.com/tennis/tournaments/*/matches/*/stats
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538908/WTA%20Match%20Stats%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/538908/WTA%20Match%20Stats%20Table.meta.js
// ==/UserScript==

(function () {
  'use strict';
 
  const preTag = document.querySelector('pre');
  if (!preTag) return;
 
  let jsonText = preTag.textContent.trim();
  if (!jsonText) return;
 
  let statsJson;
  try {
    statsJson = JSON.parse(jsonText);
  } catch (e) {
    console.error("Nepodařilo se načíst JSON:", e);
    return;
  }
 
  const statsData = Array.isArray(statsJson)
    ? statsJson.find(obj => obj.setnum === 0)
    : (statsJson.setnum === 0 ? statsJson : null);
 
  if (!statsData) return;
 
  const playerAName = "Hráčka A";
  const playerBName = "Hráčka B";
 
  const {
    ptsplayed1stserva = 0, ptsplayed1stservb = 0,
    totservplayeda = 0, totservplayedb = 0,
    ptswon1stserva = 0, ptswon1stservb = 0,
    ptstotwonserva = 0, ptstotwonservb = 0,
    acesa = 0, acesb = 0,
    dblflta = 0, dblfltb = 0,
    pts1stservlosta = 0, pts1stservlostb = 0
  } = statsData;
 
  const secondServePointsPlayedA = totservplayeda - ptsplayed1stserva;
  const secondServePointsPlayedB = totservplayedb - ptsplayed1stservb;
  const secondServePointsWonA = ptstotwonserva - ptswon1stserva;
  const secondServePointsWonB = ptstotwonservb - ptswon1stservb;
  const return2ndA = (totservplayedb - ptsplayed1stservb) - secondServePointsWonB;
  const return2ndB = (totservplayeda - ptsplayed1stserva) - secondServePointsWonA;
 
  const statRows = [
    ["Aces", acesa, acesb],
    ["Double Faults", dblflta, dblfltb],
    ["1st Serve Points Won", ptswon1stserva, ptswon1stservb],
    ["1st Serve Points Played", ptsplayed1stserva, ptsplayed1stservb],
    ["2nd Serve Points Won", secondServePointsWonA, secondServePointsWonB],
    ["2nd Serve Points Played", secondServePointsPlayedA, secondServePointsPlayedB],
    ["1st Return Points Won", pts1stservlostb, pts1stservlosta],
    ["2nd Return Points Won", return2ndA, return2ndB]
  ];
 
  const slugify = str => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
 
  const table = document.createElement('table');
  Object.assign(table.style, {
    border: '3px solid black',
    borderCollapse: 'collapse',
    margin: '20px',
    background: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: '9999',
    boxShadow: '0 0 20px rgba(0,0,0,0.3)',
    maxWidth: '90%'
  });
 
  const header = table.insertRow();
  ["Statistika", playerAName, playerBName].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    Object.assign(th.style, {
      border: '3px solid black',
      padding: '10px',
      backgroundColor: '#e0e0e0',
      textAlign: 'center'
    });
    header.appendChild(th);
  });
 
  statRows.forEach(([label, a, b]) => {
    const row = table.insertRow();
 
    const slug = slugify(label);
 
    const labelCell = row.insertCell();
    labelCell.textContent = label;
    labelCell.id = `stat-${slug}-label`;
    Object.assign(labelCell.style, {
      border: '2px solid black',
      padding: '8px',
      textAlign: 'left'
    });
 
    const cellA = row.insertCell();
    cellA.textContent = isNaN(a) ? '-' : a;
    cellA.id = `stat-${slug}-a`;
    Object.assign(cellA.style, {
      border: '2px solid black',
      padding: '8px',
      textAlign: 'center'
    });
 
    const cellB = row.insertCell();
    cellB.textContent = isNaN(b) ? '-' : b;
    cellB.id = `stat-${slug}-b`;
    Object.assign(cellB.style, {
      border: '2px solid black',
      padding: '8px',
      textAlign: 'center'
    });
  });
 
  document.body.appendChild(table);
})();