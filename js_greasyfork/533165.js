// ==UserScript==
// @name         AWBW Move Planner Button in Game List
// @namespace    https://awbw.amarriner.com/
// @version      0.1
// @description  Adds a Move Planner button to each match. If it's a waiting game, the moveplanner loads the map. Completed games don't get a button.
// @author       Vincent
// @license      MIT
// @match        https://awbw.amarriner.com/yourgames.php
// @match        https://awbw.amarriner.com/yourturn.php
// @match        https://awbw.amarriner.com/following.php*
// @match        https://awbw.amarriner.com/profile.php*
// @match        https://awbw.amarriner.com/gamescurrent_all.php*
// @match        https://awbw.amarriner.com/gameswait.php
// @icon         https://awbw.amarriner.com/terrain/moveplanner.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533165/AWBW%20Move%20Planner%20Button%20in%20Game%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/533165/AWBW%20Move%20Planner%20Button%20in%20Game%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

function createMovePlannerButton(plannerUrl, tooltipText) {
  const gameInfoTd = this;
  if (gameInfoTd.querySelector('.move-planner-btn')) return; // Prevent duplicates

  gameInfoTd.style.position = 'relative';

  const btn = document.createElement('a');
  btn.href = plannerUrl;
  btn.target = '_blank';
  btn.title = tooltipText;
  btn.className = 'move-planner-btn';
  btn.style.position = 'absolute';
  btn.style.bottom = '6px';
  btn.style.right = '6px';
  btn.style.zIndex = '10';
  btn.style.display = 'inline-block';
  btn.style.padding = '2px';
  btn.style.border = '1px solid #888';
  btn.style.backgroundColor = '#EEE';

  const icon = document.createElement('img');
  icon.src = 'https://awbw.amarriner.com/terrain/moveplanner.gif';
  icon.alt = 'Move Planner';
  icon.style.width = '24px';
  icon.style.height = '24px';
  icon.style.cursor = 'pointer';
  icon.style.imageRendering = 'pixelated';

  btn.appendChild(icon);
  gameInfoTd.appendChild(btn);
}

function getGameStateFromColor(td) {
  const bg = getComputedStyle(td).backgroundColor;
  if (bg === 'rgb(193, 255, 208)') return 'waiting';
  if (bg === 'rgb(209, 250, 255)') return 'current';
  return 'completed';
}

document.querySelectorAll('tr').forEach(row => {
  const tds = row.querySelectorAll('td.small');
  if (tds.length < 3) return;

  const gameInfoTd = tds[0];
  const mapInfoTd = tds[1];
  const playerInfoTd = tds[2];

  const gameLinks = gameInfoTd.querySelectorAll('a[href*="game.php?games_id="]');

  // Use game title cell to detect game state
  const titleTd = row.querySelector('td.limits');
  if (!titleTd) return;

  const gameState = getGameStateFromColor(titleTd);
  if (gameState === 'completed') return;

  let plannerUrl = null;
  let tooltipText = 'Move Planner';

  if (gameState === 'waiting') {
    const mapIdMatch = mapInfoTd.innerHTML.match(/maps_id=(\d+)/);
    if (mapIdMatch) {
      plannerUrl = `https://awbw.amarriner.com/moveplanner.php?maps_id=${mapIdMatch[1]}`;
      tooltipText = 'Move Planner (Map)';
    }
  } else if (gameState === 'current') {
    const gameIdMatch = gameLinks[0].href.match(/games_id=(\d+)/);
    if (gameIdMatch) {
      plannerUrl = `https://awbw.amarriner.com/moveplanner.php?games_id=${gameIdMatch[1]}`;
    }
  }

  if (!plannerUrl) return;

  createMovePlannerButton.call(gameInfoTd, plannerUrl, tooltipText);
});
})();