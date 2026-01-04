// ==UserScript==
// @name         defense and shield
// @namespace    http://tampermonkey.net/
// @version      2025.21
// @description  if two arrows hit each other it will make a square and it willmerge the twos color skin.
// @author       housebuilder13
// @match        https://bonk.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499000/defense%20and%20shield.user.js
// @updateURL https://update.greasyfork.org/scripts/499000/defense%20and%20shield.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
})();

function randomColour() {
  return Math.round(Math.random() * 0xffffff);
}

/**
 * Get an array contiaining the IDs of all arrows owned by a specific player.
 *
 * @param {number} playerId - ID of the player
 * @return {number[]} The ID list obtained
 */
function getPlayerArrows(playerId) {
  const result = [];

  for (let i = 0; i < game.state.projectiles.length; i++) {
    const arrow = game.state.projectiles[i];

    if (!arrow) continue;
    if (arrow.did !== playerId) continue;

    result.push(i);
  }

  return result;
}

game.events.addEventListener(
  "arrowCollision",
  {collideWith: "platform"},
  function (hitA_arrowId, hitB_platData) {
    const $ = game.vars; // just a shorthand for the vars object, to make the code a bit cleaner

    var hitB_platformId = hitB_platData.id,
      hitB_shapeIndex = hitB_platData.shapeIndex,
      hitB_normal = hitB_platData.normal,
      hitB_isCapzone = hitB_platData.isCapzone;

    if ($.player === true) {
      game.world.killDisc($.player, true);
      game.world.createPlatform(null, {
        type: "s",
        p: [0, 0],
        a: 0,
        re: 0.8,
        de: 0.3,
        fric: 0.5,
        fricp: false,
        f_c: 1,
        f_p: true,
        f_1: true,
        f_2: true,
        f_3: true,
        f_4: true,
        shapes: [
          {
            geo: {
              type: "bx",
              c: game.state.projectiles[hitA_arrowId].p,
              s: [5, 5],
              a: 0,
            },
            f: randomColour(),
            np: false,
            ng: true,
            ig: false,
            d: false,
          },
        ],
      });
    }
  }
);

game.events.addEventListener("step", {perPlayer: true}, function (id) {
  const j_list = getPlayerArrows(id);
  for (let j_index in j_list) {
    const j = j_list[j_index];
    if (game.state.projectiles[j]) {
      game.graphics.createDrawing({
        alpha: 0.25,
        pos: game.state.projectiles[j].p,
        scale: [1, 1],
        angle: 0,
        attachTo: "world",
        isBehind: false,
        shapes: [
          {
            type: "bx",
            colour: randomColour(),
            alpha: 1,
            pos: [0, 0],
            size: [5, 5],
            angle: 0,
          },
        ],
      });
    }
  }
});

game.events.addEventListener(
  "arrowCollision",
  {collideWith: "arrow"},
  function (hitA_arrowId, hitB_arrowId) {
    if (game.state.projectiles[hitA_arrowId] && game.state.projectiles[hitB_arrowId]) {
      game.world.createPlatform(null, {
        type: "s",
        p: [0, 0],
        a: 0,
        re: 0.8,
        de: 0.3,
        fric: 0.5,
        fricp: false,
        f_c: 1,
        f_p: true,
        f_1: true,
        f_2: true,
        f_3: true,
        f_4: true,
        shapes: [
          {
            geo: {
              type: "bx",
              c: game.state.projectiles[hitA_arrowId].p,
              s: [5, 5],
              a: 0,
            },
            f: randomColour(),
            np: false,
            ng: true,
            ig: false,
            d: false,
          },
        ],
      });

      delete game.state.projectiles[hitA_arrowId];
      delete game.state.projectiles[hitB_arrowId];
    }
  }
);


game.events.addEventListener("playerDie", null, function (id) {
  const $ = game.vars; // just a shorthand for the vars object, to make the code a bit cleaner

  game.world.deletePlatform($[id].playerShield);
});

game.events.addEventListener("step", {perPlayer: true}, function (id) {
  const $ = game.vars; // just a shorthand for the vars object, to make the code a bit cleaner

  if (game.state.discs[id] && (game.state.ftu > -1)) {
    game.state.physics.platforms[$[id].playerShield].p = game.state.discs[id].p;
    game.state.physics.platforms[$[id].playerShield].a = Vector.getAngle2d(
      Vector.subtract(game.inputs[id].mouse.pos, game.state.discs[id].p)
    );
  }
});

game.events.addEventListener("roundStart", {perPlayer: true}, function (id) {
  const $ = game.vars; // just a shorthand for the vars object, to make the code a bit cleaner

  if (game.state.discs[id]) {
    $[id] = {};
    game.inputs[id].allowPosSending = true;
    $[id].playerShield = game.world.createPlatform(null, {
      type: "s",
      p: game.state.discs[id].p,
      a: 0,
      re: 1,
      de: 0.3,
      fric: 0.5,
      fricp: true,
      f_c: 1,
      f_p: true,
      f_1: false,
      f_2: false,
      f_3: false,
      f_4: false,
      shapes: [
        {
          geo: {
            type: "bx",
            c: [3, 0],
            s: [1, 4],
            a: 0,
          },
          f: game.lobby.playerInfo[id].skinBg,
          np: false,
          ng: true,
          ig: false,
          d: false,
        },
        {
          geo: {
            type: "bx",
            c: [3, 0],
            s: [0.5, 3.5],
            a: 0,
          },
          f: Colour.blend(game.lobby.playerInfo[id].skinBg, 0x000000, 0.5),
          np: true,
          ng: false,
          ig: false,
          d: false,
        },
      ],
    });
  }
});

