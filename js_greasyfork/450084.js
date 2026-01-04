// ==UserScript==
// @name         MINIROYALE.IO HACK | Aimbot, Auto CTF, Invisibility, Speed, Fly, and MORE
// @description  Most advanced miniroyale.io hack ever created. Features Invisibility, Speed, Aimbot, and much more.
// @author       Hacker's Hideout
// @version      2.0
// @include     *://miniroyale2.io/*
// @namespace https://greasyfork.org/users/759229
// @downloadURL https://update.greasyfork.org/scripts/450084/MINIROYALEIO%20HACK%20%7C%20Aimbot%2C%20Auto%20CTF%2C%20Invisibility%2C%20Speed%2C%20Fly%2C%20and%20MORE.user.js
// @updateURL https://update.greasyfork.org/scripts/450084/MINIROYALEIO%20HACK%20%7C%20Aimbot%2C%20Auto%20CTF%2C%20Invisibility%2C%20Speed%2C%20Fly%2C%20and%20MORE.meta.js
// ==/UserScript==

function AlertIt() {
var answer = confirm ("Please update to the most recent version (3.0). It includes many more hacks such as size and custom skins.")
if (answer)
window.location="https://discord.gg/7d9bycXf7r";
}

AlertIt();

const onMovementUpdateAnimation = Movement.prototype.updateAnimation;

const HEAD_OFFSET = 0.4;
const RENDER_LINE_STEP = 0.001;
const RENDER_LINE_WIDTH = 0.03;
const RED_COLOR = new pc.Color(1, 0, 0);

function renderLine(application, from, to, color) {
  for (let i = 0; i < RENDER_LINE_WIDTH; i += RENDER_LINE_STEP) {
    const fromOffset = new pc.Vec3(from.x + i, from.y, from.z + i);
    const toOffset = new pc.Vec3(to.x + i, (to.y - HEAD_OFFSET), to.z + i);

    application.renderLine(fromOffset, toOffset, color);
  }
}

Movement.prototype.updateAnimation = function () {
  onMovementUpdateAnimation.apply(this, arguments);

  const position = this.entity.getPosition().clone();
  const enemies = this.playerManager.script.playerManager.players;

  for (const enemy of enemies) {
    renderLine(this.app, enemy.localPosition, position, RED_COLOR);
  }
}