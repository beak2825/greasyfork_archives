// ==UserScript==
// @name         Powerline Dash
// @author       Rumini - Discord: rumini & max30630
// @description  Powerline.io Dash
// @version      2.0
// @match        *://powerline.io/*
// @icon         https://i.imgur.com/bfcFQF7.png
// @grant        unsafeWindow
// @license      MIT
// @run-at       document-start
// @namespace https://greasyfork.org/users/1356205
// @downloadURL https://update.greasyfork.org/scripts/504711/Powerline%20Dash.user.js
// @updateURL https://update.greasyfork.org/scripts/504711/Powerline%20Dash.meta.js
// ==/UserScript==

if (window.location.href === 'https://powerline.io/') {
  window.location.href = 'https://powerline.io/maindev.html';
}

(function() {
  'use strict';

  const DIRECTION_UP = 1;
  const DIRECTION_LEFT = 2;
  const DIRECTION_DOWN = 3;
  const DIRECTION_RIGHT = 4;

  const DIRECTION_MAP = {
    [DIRECTION_UP]: DIRECTION_RIGHT,
    [DIRECTION_LEFT]: DIRECTION_UP,
    [DIRECTION_DOWN]: DIRECTION_LEFT,
    [DIRECTION_RIGHT]: DIRECTION_DOWN
  };

  let TELEPORT_OFFSET = 200;

  const DIRECTION_OFFSET = {
    [DIRECTION_UP]: { x: 1, y: 0 },
    [DIRECTION_DOWN]: { x: -1, y: 0 },
    [DIRECTION_LEFT]: { x: 0, y: -1 },
    [DIRECTION_RIGHT]: { x: 0, y: 1 }
  };

  let lastTurnTime = 0;
  let antiLagEnabled = true;

  function waitForGame(callback) {
    if (typeof Snake !== 'undefined' && typeof localPlayer !== 'undefined' && typeof input !== 'undefined') {
      callback();
    } else {
      setTimeout(() => waitForGame(callback), 100);
    }
  }

  function addTurnPoint(direction, fakelag) {
    const timeNow = Date.now();
    const deltaTime = timeNow - lastTurnTime;
    lastTurnTime = timeNow;
    return localPlayer.addTurnPoint(direction, deltaTime < 30 ? fakelag + 30 : fakelag);
  }

  function sendTurnPoint(direction, x, y) {
    const coord = (direction === DIRECTION_UP || direction === DIRECTION_DOWN) ? x : -y;
    network.sendTurnPoint(direction, coord / GAME_SCALE);
  }

  function updatePlayerPosition(x, y) {
    localPlayer.x = localPlayer.headPos.x = x / GAME_SCALE;
    localPlayer.y = localPlayer.headPos.y = -y / GAME_SCALE;
  }

  function turn(direction, x, y, fakelag, isTeleport) {
    if (!antiLagEnabled) {
      network.sendDirection(direction);
      return;
    }

    const selectedPoint = addTurnPoint(direction, fakelag);

    if (isTeleport) {
      const offset = DIRECTION_OFFSET[direction];
      x += offset.x * TELEPORT_OFFSET;
      y += offset.y * TELEPORT_OFFSET;
      updatePlayerPosition(x, y);
    } else {
      x = selectedPoint.x * GAME_SCALE;
      y = selectedPoint.y * GAME_SCALE;
    }

    sendTurnPoint(direction, x, y);
  }

  function executeTurnSequence(snake) {
    if (!snake) return;

    const actions = [
      { isTeleport: false, delay: 0 },
      { isTeleport: false, delay: 0 },
      { isTeleport: true, delay: 10 },
      { isTeleport: false, delay: 20 },
    ];

    let cumulativeDelay = 0;

    actions.forEach(action => {
      setTimeout(() => {
        input.direction = DIRECTION_MAP[input.direction] || DIRECTION_RIGHT;
        turn(input.direction, snake.headPos.x, snake.headPos.y, globalWebLag, action.isTeleport);
      }, cumulativeDelay);
      cumulativeDelay += action.delay;
    });
  }

  function setTeleportOffset(offset) {
    TELEPORT_OFFSET = offset;
  }

  waitForGame(() => {
    document.addEventListener('keydown', e => {
      if (e.key === 'x') {
        executeTurnSequence(localPlayer);
        hud.showTip("Dashed!", 1000);
      }
    });
  });

  unsafeWindow.setTeleportOffset = setTeleportOffset;
})();