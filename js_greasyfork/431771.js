// ==UserScript==
// @name         Unlimited Jump Hack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  take over any game with unlimited jumps!
// @author       noob 292
// @match        *://*/*
// @icon         https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freeiconspng.com%2Fimages%2Fbinary-icon&psig=AOvVaw2wctA0HhLYiYq0gf4KMTtN&ust=1630608966642000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCJivvve53vICFQAAAAAdAAAAABAE
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431771/Unlimited%20Jump%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/431771/Unlimited%20Jump%20Hack.meta.js
// ==/UserScript==

(function(Phaser) {

const Game = function() {};

Game.prototype = {
    jump() {
      this.player.body.velocity.y = -450;
    },
    checkDoubleJump() {
      if (this.jumpCount < this.jumpMax) {
        this.jump();
        this.jumpCount++;
      }
    },
    create() {
      this.jumpMax = 999999999;
      this.jumpCount = 0;
      this.spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      this.spacebar.onDown(this.checkDoubleJump, this);
    }
  };
})(window.Phaser);