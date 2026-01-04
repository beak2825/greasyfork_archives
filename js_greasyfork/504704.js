// ==UserScript==
// @name         Powerline Respawner
// @author       Rumini - Discord: rumini & rainbowdxsh_ & A0
// @description  Auto respawn to death point for powerline
// @version      1.0
// @match        *://powerline.io/*
// @icon         https://i.imgur.com/bfcFQF7.png
// @license      MIT
// @run-at       document-start
// @namespace https://greasyfork.org/users/1356205
// @downloadURL https://update.greasyfork.org/scripts/504704/Powerline%20Respawner.user.js
// @updateURL https://update.greasyfork.org/scripts/504704/Powerline%20Respawner.meta.js
// ==/UserScript==

if (window.location.href === 'https://powerline.io/') {
  window.location.href = 'https://powerline.io/maindev.html';
}

(function () {
  'use strict';

  let currentPosition = { x: 0, y: 0 };
  let lastSnakeId = null;
  let trackingInterval = null;
  let storedLastPosition = null;

  const DIRECTION_UP = 1;
  const DIRECTION_LEFT = 2;
  const DIRECTION_DOWN = 3;
  const DIRECTION_RIGHT = 4;

  function waitForGame(callback) {
    if (typeof Snake !== 'undefined' && typeof localPlayer !== 'undefined' &&
        typeof input !== 'undefined' && typeof entities !== 'undefined' &&
        typeof localPlayerID !== 'undefined' && typeof hud !== 'undefined') {
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

      if (direction == DIRECTION_UP || direction == DIRECTION_DOWN) {
        x = storedLastPosition ? storedLastPosition.x * GAME_SCALE : x;
      } else {
        y = storedLastPosition ? storedLastPosition.y * GAME_SCALE : y;
      }

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
    if (localPlayer && storedLastPosition) {
      var x = snake.headPos.x;
      var y = snake.headPos.y;
      var fakelag1 = globalWebLag;
      var fakelag2 = 0;

      switch (input.direction) {
        case DIRECTION_UP:
        case DIRECTION_DOWN:
          input.direction = (localPlayer.x / GAME_SCALE > storedLastPosition.x) ? DIRECTION_RIGHT : DIRECTION_LEFT;
          break;
        case DIRECTION_LEFT:
        case DIRECTION_RIGHT:
          input.direction = (localPlayer.y / GAME_SCALE > storedLastPosition.y) ? DIRECTION_DOWN : DIRECTION_UP;
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

  function sendNormalTurn() {
    if (localPlayer) {
        const x = localPlayer.x;
        const y = localPlayer.y;
        const fakelag1 = globalWebLag;
        const fakelag2 = 0;

        if (input.direction === DIRECTION_UP || input.direction === DIRECTION_DOWN) {
            if (x < 0) {
                input.direction = DIRECTION_RIGHT;
            } else if (x >= 0) {
                input.direction = DIRECTION_LEFT;
            }
        } else {
            input.direction = DIRECTION_UP;
        }

        input.turn(input.direction, x, y, fakelag1, fakelag2);
    }
  }

  function teleport() {
    const snake = localPlayer;
    if (!snake) return;

    const actions = [
        { func: sendSyncTurn, delay: 0 },
        { func: sendTeleportTurn, delay: 10 },
        { func: sendNormalTurn, delay: 20 },
        { func: sendSyncTurn, delay: 600 },
        { func: sendTeleportTurn, delay: 10 }
    ];

    let cumulativeDelay = 0;

    actions.forEach(action => {
        cumulativeDelay += action.delay;
        setTimeout(() => {
            action.func(snake);
        }, cumulativeDelay);
    });
  }

  function trackPosition() {
    const currentSnakeId = localPlayerID;

    if (lastSnakeId !== null && lastSnakeId !== 0 && currentSnakeId === 0) {
      storeLastPosition();
    }

    if (currentSnakeId !== 0) {
      const snake = entities[currentSnakeId];
      if (snake) {
        currentPosition = {
          x: snake.lastServerX / GAME_SCALE,
          y: snake.lastServerY / GAME_SCALE
        };
      }
    }

    lastSnakeId = currentSnakeId;
  }

  function storeLastPosition() {
    storedLastPosition = { ...currentPosition };
    displayStoredPosition();
  }

  function displayStoredPosition() {
    if (storedLastPosition) {
      const { x, y } = storedLastPosition;
      const message = `Stored last position: X ${x.toFixed(2)}, Y ${y.toFixed(2)}`;
      hud.showTip(message, 5000);
      console.log(message);
    }
  }

  function startTracking() {
    trackingInterval = setInterval(trackPosition, 100);
    console.log("Position tracking started");
  }

  waitForGame(() => {
    startTracking();

    document.addEventListener('keydown', e => {
      if (e.key === 'r') {
        teleport();
        hud.showTip("Teleported!", 1000);
      }
    });
  });
})();