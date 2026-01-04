// ==UserScript==
// @name        My cube
// @namespace   Violentmonkey Scripts
// @match       https://johnbutlergames.com/od2/index.html*
// @grant       none
// @version     1.0
// @author      God NTSC Player
// @description 2/17/2025, 12:40:37 PM
// @downloadURL https://update.greasyfork.org/scripts/527776/My%20cube.user.js
// @updateURL https://update.greasyfork.org/scripts/527776/My%20cube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const imageURL = 'https://pbs.twimg.com/profile_images/1707398013398974464/lu87Drbo_400x400.jpg';
    let playerImage = new Image();
    playerImage.src = imageURL;
    playerImage.onload = function() {
        console.log('Player image loaded successfully');
    };

    let lastDirection = 'right';

    function overridePlayerDraw() {
        if (typeof player !== 'undefined' && typeof player.draw === 'function') {
            player.draw = function() {
                if (this.xmove > 0) {
                    lastDirection = 'right';
                } else if (this.xmove < 0) {
                    lastDirection = 'left';
                }

                ctx.save();

                if (lastDirection === 'left') {
                    ctx.scale(-1, 1);
                    ctx.drawImage(playerImage, -(this.x + this.w), this.y, this.w, this.h);
                } else {
                    ctx.drawImage(playerImage, this.x, this.y, this.w, this.h);
                }

                ctx.restore();
            };
        } else {
            setTimeout(overridePlayerDraw, 100);
        }
    }

    overridePlayerDraw();
})();