// ==UserScript==
// @name         Powerline Axis Shifter
// @author       Rumini - Discord: rumini & ibo_kys
// @description  Powerline.io Axis Shifter
// @version      1.3
// @match        *://powerline.io/*
// @icon         https://i.imgur.com/bfcFQF7.png
// @grant        unsafeWindow
// @license      MIT
// @run-at       document-start
// @namespace https://greasyfork.org/users/1356205
// @downloadURL https://update.greasyfork.org/scripts/504705/Powerline%20Axis%20Shifter.user.js
// @updateURL https://update.greasyfork.org/scripts/504705/Powerline%20Axis%20Shifter.meta.js
// ==/UserScript==

if (window.location.href === 'https://powerline.io/') {
  window.location.href = 'https://powerline.io/maindev.html';
}

(function () {
  'use strict';

  const DIRECTION_UP = 1;
  const DIRECTION_LEFT = 2;
  const DIRECTION_DOWN = 3;
  const DIRECTION_RIGHT = 4;

  function waitForGame(callback) {
    if (typeof Snake !== 'undefined' && typeof localPlayer !== 'undefined' && typeof input !== 'undefined') {
      callback();
    } else {
      setTimeout(() => waitForGame(callback), 100);
    }
  }

  function teleportTurn(direction, x, y, fakelag1, fakelag2) {
    if (antiLagEnabled) {
      if (0) {
        localPlayer.setTurnPoint(direction, x, y);
      } else {
        var timeNow = +new Date();
        var deltaTime = timeNow - lastTurnTime;
        lastTurnTime = timeNow;
        if (deltaTime < 30) {
          fakelag1 += 30;
        }
        var selectedPoint = localPlayer.addTurnPoint(direction, fakelag1);
      }

      if (direction == DIRECTION_UP || direction == DIRECTION_DOWN)
        x = -x;
      else
        y = -y;

      localPlayer.x = x / GAME_SCALE;
      localPlayer.y = -y / GAME_SCALE;

      localPlayer.headPos.x = x / GAME_SCALE;
      localPlayer.headPos.y = -y / GAME_SCALE;

      var coord;
      if (direction == DIRECTION_UP || direction == DIRECTION_DOWN)
        coord = x / GAME_SCALE;
      else
        coord = -y / GAME_SCALE;

      network.sendTurnPoint(direction, coord);
    } else {
      network.sendDirection(direction);
    }
  }

  function syncTurn(direction, x, y, fakelag1, fakelag2) {
    if (antiLagEnabled) {
      if (0) {
        localPlayer.setTurnPoint(direction, x, y);
      } else {
        var timeNow = +new Date();
        var deltaTime = timeNow - lastTurnTime;
        lastTurnTime = timeNow;
        if (deltaTime < 30) {
          fakelag1 += 30;
        }

        var selectedPoint = localPlayer.addTurnPoint(direction, fakelag1);
        x = selectedPoint.x * GAME_SCALE;
        y = selectedPoint.y * GAME_SCALE;
      }

      var coord;
      if (direction == DIRECTION_UP || direction == DIRECTION_DOWN)
        coord = x / GAME_SCALE;
      else
        coord = -y / GAME_SCALE;

      network.sendTurnPoint(direction, coord);
    } else {
      network.sendDirection(direction);
    }
  }

  function sendSyncTurn(snake) {
    if (localPlayer) {
      var x = snake.headPos.x;
      var y = snake.headPos.y;
      var fakelag1 = globalWebLag;
      var fakelag2 = 0;

      switch (input.direction) {
        case DIRECTION_UP:
        case DIRECTION_DOWN:
          input.direction = x >= 0 ? DIRECTION_RIGHT : DIRECTION_LEFT;
          break;
        case DIRECTION_LEFT:
        case DIRECTION_RIGHT:
          input.direction = y >= 0 ? DIRECTION_DOWN : DIRECTION_UP;
          break;
      }

      syncTurn(input.direction, x, y, fakelag1, fakelag2);
    }
  }

  function sendTeleportTurn(snake) {
    if (localPlayer) {
      var x = snake.headPos.x;
      var y = snake.headPos.y;
      var fakelag1 = globalWebLag;
      var fakelag2 = 0;

      input.direction = snake.direction;

      teleportTurn(input.direction, x, y, fakelag1, fakelag2);
    }
  }

  function teleport() {
    const snake = localPlayer;
    if (!snake) return;

    const actions = [
        { func: sendSyncTurn, delay: 0 },
        { func: sendTeleportTurn, delay: 10 },
    ];

    let cumulativeDelay = 0;

    actions.forEach(action => {
        cumulativeDelay += action.delay;
        setTimeout(() => {
            action.func(snake);
        }, cumulativeDelay);
    });
  }

  waitForGame(() => {
    document.addEventListener('keydown', e => {
      if (e.key === 'j') {
        teleport();
        hud.showTip("Teleported!", 1000);
      }
    });
  });
})();