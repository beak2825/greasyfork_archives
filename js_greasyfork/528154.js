// ==UserScript==
// @name         Diep.io Auto-leveler Bot (Improved)
// @namespace    http://tampermonkey.net/
// @version       1.1
// @description  Improved auto-leveler bot for Diep.io. Press Q to toggle.
// @author       Mi300 (Improved by AI)
// @match        https://diep.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      Apache License 2.0
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/528154/Diepio%20Auto-leveler%20Bot%20%28Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528154/Diepio%20Auto-leveler%20Bot%20%28Improved%29.meta.js
// ==/UserScript==

const ARENA_WIDTH = 26000;
const ARENA_HEIGHT = 26000;
const T4_BASE_WIDTH = 3900;
const T4_BASE_HEIGHT = 3900;

const T2_BASES = [
  { id: 0, name: "blue", hex: "#00b2e1", x: 0, y: 0, cX: 0, cY: 0, dirX: 1, dirY: 1 },
  { id: 3, name: "red", hex: "#f14e54", x: 23500, y: 0, cX: ARENA_WIDTH, cY: ARENA_HEIGHT, dirX: -1, dirY: 1 },
];

const T4_BASES = [
  { id: 0, name: "blue", hex: "#00b2e1", x: 0, y: 0, cX: 0, cY: 0, dirX: 1, dirY: 1 },
  { id: 1, name: "purple", hex: "#bf7ff5", x: 22100, y: 0, cX: 0, cY: ARENA_HEIGHT, dirX: -1, dirY: 1 },
  { id: 2, name: "green", hex: "#00e16e", x: 0, y: 22100, cX: ARENA_WIDTH, cY: 0, dirX: 1, dirY: -1 },
  { id: 3, name: "red", hex: "#f14e54", x: 22100, y: 22100, cX: ARENA_WIDTH, cY: ARENA_HEIGHT, dirX: -1, dirY: -1 },
];

alert("Auto Leveler: Press Q to toggle on / off.");

let OMG = setInterval(function () {
  if (!window.input) return;
  clearInterval(OMG);

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  let baseArea = null;
  let inBase = false;
  let toggled = false;
  let is2T = false;
  let lastCheck = Date.now();
  let minimapArrow = [0, 0];
  let minimapPos = [0, 0];
  let minimapDim = [0, 0];
  let playerPos = [0, 0];

  document.addEventListener("keydown", function (e) {
    if (e.key === "q") {
      toggled = !toggled;
      setTimeout(() => {
        input.key_up(87); // W
        input.key_up(83); // S
        input.key_up(65); // A
        input.key_up(68); // D
      }, 200);
    }
  });

  function getCentre(vertices) {
    return vertices.reduce((acc, vertex) => [acc[0] + vertex[0], acc[1] + vertex[1]], [0, 0])
      .map(sum => sum / vertices.length);
  }

  function getDist(t1, t2) {
    const distX = t1[0] - t2[0];
    const distY = t1[1] - t2[1];
    return [Math.hypot(distX, distY), distX, distY];
  }

  function getClosest(entities) {
    return entities.reduce((acc, entity) => {
      const dist = getDist(entity[0], [canvas.width / 2, canvas.height / 2])[0];
      return dist < getDist(acc[0], [canvas.width / 2, canvas.height / 2])[0] ? entity : acc;
    }, [[0, 0], Infinity]);
  }

  function move(aimTarget, moveTarget) {
    if (!window.input || !window.input.should_prevent_unload()) return;

    input.mouse(...aimTarget);
    input.key_down(1); // Shoot

    const moveTargetDistance = getDist(moveTarget, [canvas.width / 2, canvas.height / 2]);

    // Horizontal movement
    if (moveTargetDistance[1] > 0) {
      input.key_down(68); // D
      input.key_up(65);   // A
    } else if (moveTargetDistance[1] < 0) {
      input.key_up(68);   // D
      input.key_down(65); // A
    } else {
      input.key_up(68);   // D
      input.key_up(65);   // A
    }

    // Vertical movement
    if (moveTargetDistance[2] > 0) {
      input.key_down(83); // S
      input.key_up(87);   // W
    } else if (moveTargetDistance[2] < 0) {
      input.key_up(83);   // S
      input.key_down(87); // W
    } else {
      input.key_up(83);   // S
      input.key_up(87);   // W
    }
  }

  function main() {
    if (!toggled) return;
    window.requestAnimationFrame(main);

    playerPos = getPlayerPos();
    getBase(playerPos);

    if (Date.now() - lastCheck > 2000) is2T = true;
    else is2T = false;

    if (!input.should_prevent_unload()) {
      window.input.try_spawn(localStorage.name);
    }

    getCurrentTargets();
  }

  window.requestAnimationFrame(main);
}, 400);