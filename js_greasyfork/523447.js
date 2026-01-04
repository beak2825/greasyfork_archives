// ==UserScript==
// @name         ULR speedup
// @namespace    http://tampermonkey.net/
// @version      1.5.2
// @description  Speed-up ULR
// @author       Me
// @match        https://www.playunlight.online/*
// @match        https://www.playunlight-dmm.com/?*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523447/ULR%20speedup.user.js
// @updateURL https://update.greasyfork.org/scripts/523447/ULR%20speedup.meta.js
// ==/UserScript==

//////// Settings Start ////////
const PATCH_SET_TIMEOUT = true;
const SPEED_SCALE = 2.5;
const RENDER_SPEED = 1;
//////// Settings End ////////

(function () {
  "use strict";

  function wait_game(callback) {
    const intervalID = setInterval(() => {
      if (window.game && window.game.scene) {
        clearInterval(intervalID);
        callback();
      }
    }, 100);
  }

  function speedup() {
    const patchSkippedCallbacks = new Map();
    if (PATCH_SET_TIMEOUT) {
      const originalSetTimeout = window.setTimeout;
      window.setTimeout = function (callback, delay, ...args) {
        const callbackString = callback.toString();
        if (callbackString === "function e(){t.isRunning&&(t.timeOutID=window.setTimeout(e,t.delay)),t.callback(window.performance.now())}"){
          return originalSetTimeout(callback, delay / RENDER_SPEED, ...args);
        }
        if (!patchSkippedCallbacks.has(callbackString)) {
          patchSkippedCallbacks.set(
            callbackString,
            callbackString.includes("ping timeout")
          );
        }
        if (patchSkippedCallbacks.get(callbackString)) {
          return originalSetTimeout(callback, delay, ...args);
        }
        return originalSetTimeout(callback, delay / SPEED_SCALE, ...args);
      };
    }
    window.game.anims.globalTimeScale = SPEED_SCALE;
    const speedReciprocal = 1 / SPEED_SCALE;
    setInterval(setScenesTimeScale, 100);

    function setScenesTimeScale() {
      window.game.scene.getScenes().forEach((scene) => {
        scene.time.timeScale = SPEED_SCALE;
        if (
          scene.scene.key === "MovePhaseA" &&
          scene.move_option !== undefined
        ) {
          scene.move_option.forEach((option) => {
            if (typeof option === "string") {
              scene[option].setInteractive();
            }
          });
        }
        if (scene.scene.key === "MainA" && scene?.change_timer !== undefined) {
          scene.change_timer.timeScale = speedReciprocal;
        }
        scene.tweens.setGlobalTimeScale(SPEED_SCALE);
        scene.children.list.forEach((child) => {
          if (child.type === "ParticleEmitterManager") {
            child.timeScale = SPEED_SCALE;
          }
        });
      });
    }
  }

  wait_game(speedup);
})();
