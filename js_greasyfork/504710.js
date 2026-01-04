// ==UserScript==
// @name         Powerline Wall Hugger
// @version      2.1
// @description  Powerline.io Wall Hugger
// @author       Rumini - Discord: rumini
// @match        *://powerline.io/*
// @icon         https://i.imgur.com/9k4SFr0.png
// @grant        unsafeWindow
// @license      MIT
// @run-at       document-start
// @namespace https://greasyfork.org/users/1356205
// @downloadURL https://update.greasyfork.org/scripts/504710/Powerline%20Wall%20Hugger.user.js
// @updateURL https://update.greasyfork.org/scripts/504710/Powerline%20Wall%20Hugger.meta.js
// ==/UserScript==

if (window.location.href === 'https://powerline.io/') {
  window.location.href = 'https://powerline.io/maindev.html';
}

(function() {
  'use strict';

  const DIRECTION_NONE = 0;
  const DIRECTION_UP = 1;
  const DIRECTION_LEFT = 2;
  const DIRECTION_DOWN = 3;
  const DIRECTION_RIGHT = 4;

  const BASE_WALL_DISTANCE = 0.000000001;
  const WALL_DISTANCE_INCREMENT = 0.00001;

  let wallHuggerEnabled = false;
  let originalSendTurnPoint;
  let isTeleporting = false;
  let currentDirection = DIRECTION_NONE;
  let wallDistance = BASE_WALL_DISTANCE;
  let GAME_SCALE;

  const waitForGame = (callback) => {
    if (typeof Snake !== 'undefined' && typeof localPlayerID !== 'undefined' && typeof network !== 'undefined') {
        GAME_SCALE = unsafeWindow.GAME_SCALE || 10;
        callback();
    } else {
      setTimeout(() => waitForGame(callback), 100);
    }
  };

  const findNearestWall = (x, y) => {
    const halfArena = unsafeWindow.arenaWidth / 2;
    const distances = [
      { wall: 'left', distance: Math.abs(halfArena + x) },
      { wall: 'right', distance: Math.abs(halfArena - x) },
      { wall: 'top', distance: Math.abs(halfArena + y) },
      { wall: 'bottom', distance: Math.abs(halfArena - y) }
    ];
    return distances.reduce((nearest, current) =>
      current.distance < nearest.distance ? current : nearest
    );
  };

  const teleportToWall = (newDirection) => {
    if (!localPlayer || isTeleporting) return;

    isTeleporting = true;
    const nearestWall = findNearestWall(localPlayer.x, localPlayer.y);
    const halfArena = unsafeWindow.arenaWidth / 2;
    wallDistance += WALL_DISTANCE_INCREMENT * GAME_SCALE;
    let newX = localPlayer.x;
    let newY = localPlayer.y;

    switch (nearestWall.wall) {
      case 'left':
        newX = -halfArena + wallDistance;
        if (newDirection === DIRECTION_UP) {
          newY = halfArena - wallDistance;
        } else if (newDirection === DIRECTION_DOWN) {
          newY = -halfArena + wallDistance;
        }
        break;
      case 'right':
        newX = halfArena - wallDistance;
        if (newDirection === DIRECTION_UP) {
          newY = halfArena - wallDistance;
        } else if (newDirection === DIRECTION_DOWN) {
          newY = -halfArena + wallDistance;
        }
        break;
      case 'top':
        newY = halfArena - wallDistance;
        if (newDirection === DIRECTION_LEFT) {
          newX = -halfArena + wallDistance;
        } else if (newDirection === DIRECTION_RIGHT) {
          newX = halfArena - wallDistance;
        }
        break;
      case 'bottom':
        newY = -halfArena + wallDistance;
        if (newDirection === DIRECTION_LEFT) {
          newX = -halfArena + wallDistance;
        } else if (newDirection === DIRECTION_RIGHT) {
          newX = halfArena - wallDistance;
        }
        break;
    }

    localPlayer.x = newX;
    localPlayer.y = newY;
    localPlayer.direction = newDirection;

    // X and Y Axis is for some reason flipped when you are near the top and bottom wall
    if (nearestWall.wall === 'top' || nearestWall.wall === 'bottom') {
      originalSendTurnPoint.call(network, newDirection, newY / GAME_SCALE, -newX / GAME_SCALE);
    } else if (nearestWall.wall === 'left' && currentDirection === DIRECTION_UP && newDirection === DIRECTION_RIGHT) {
      originalSendTurnPoint.call(network, newDirection, -newX / GAME_SCALE, newY / GAME_SCALE);
    } else if (nearestWall.wall === 'right' && currentDirection === DIRECTION_DOWN && newDirection === DIRECTION_LEFT) {
      originalSendTurnPoint.call(network, newDirection, -newX / GAME_SCALE, newY / GAME_SCALE);
    } else {
      originalSendTurnPoint.call(network, newDirection, newX / GAME_SCALE, -newY / GAME_SCALE);
    }

    isTeleporting = false;
  };

  const toggleWallHugger = (enable) => {
    wallHuggerEnabled = enable !== undefined ? enable : !wallHuggerEnabled;
    if (wallHuggerEnabled) {
      originalSendTurnPoint = network.sendTurnPoint;
      network.sendTurnPoint = function(direction, x, y) {
        if (wallHuggerEnabled && !isTeleporting && direction !== DIRECTION_NONE) {
          teleportToWall(direction);
        } else {
          originalSendTurnPoint.call(this, direction, x, y);
        }
      };
      startDirectionTracking();
      hud.showTip("Wall Hugger Enabled", 2000);
    } else {
      if (originalSendTurnPoint) {
        network.sendTurnPoint = originalSendTurnPoint;
      }
      stopDirectionTracking();
      hud.showTip("Wall Hugger Disabled", 2000);
    }
  };

  const startDirectionTracking = () => {
    if (typeof requestAnimationFrame !== 'undefined') {
      const trackDirection = () => {
        if (wallHuggerEnabled && localPlayer) {
          currentDirection = localPlayer.direction;
        }
        if (wallHuggerEnabled) {
          requestAnimationFrame(trackDirection);
        }
      };
      requestAnimationFrame(trackDirection);
    } else {
      window.directionTrackingInterval = setInterval(() => {
        if (localPlayer) {
          currentDirection = localPlayer.direction;
        }
      }, 16);
    }
  };

  const stopDirectionTracking = () => {
    if (window.directionTrackingInterval) {
      clearInterval(window.directionTrackingInterval);
    }
  };

  const checkCollisionAndReset = () => {
    const observer = new MutationObserver(() => {
      if (localPlayerID === 0 && wallHuggerEnabled) {
        toggleWallHugger(false);
        wallDistance = BASE_WALL_DISTANCE;
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  const setupKeyBindings = () => {
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'h') {
        toggleWallHugger();
      }
    });
  };

  waitForGame(() => {
    setupKeyBindings();
    checkCollisionAndReset();
  });
})();