"use strict";

// ==UserScript==
// @name         ShellShockers Aimbot [Fixed]
// @description  Hey. This is in the making so, idk like don't expect it to work. Make sure you have tampermonkey so that way this works. I fixed this aimbot to make the stuff more cancerus. heres how to use it: Aim at the closest player by pressing Shift, turn it off with left control.
// @match        https://shellshock.io/
// @match        http://www.shellshock.io
// @version      1.5555556
//
// @namespace https://greasyfork.org/en/users/220570-meowffle-cat
// @downloadURL https://update.greasyfork.org/scripts/376582/ShellShockers%20Aimbot%20%5BFixed%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/376582/ShellShockers%20Aimbot%20%5BFixed%5D.meta.js
// ==/UserScript==

var active = true;
var interval = void 0;
var c=1
var gameInput
var player
var target
var gameObjects
var targetChanged

function activate(event) {
  event.preventDefault();
  if (event.keyCode === 16 ) {
    c.removeEventListener("mousemove", gameInput, false);
    active = true;
    interval = setInterval(aimClosestPlayer, 10);
  }
}

function deactivate(event) {
  event.preventDefault();
  if (event.keyCode === 17) {
    active = false;
    clearInterval(interval);
    c.addEventListener("mousemove", gameInput, false);
  }
}

c.addEventListener("keydown", activate, false);
c.addEventListener("keyup", deactivate, false);

function getOtherPlayers(gameObjects, myTeam) {
  return gameObjects.filter(function (o) {
    return o.type === 'player' && o.dead === false && o.name !== player.name && o.team !== myTeam;
  });
}

function getMyPlayer(gameObjects) {
  return gameObjects.filter(function (o) {
    return o.name === player.name;
  })[0];
}