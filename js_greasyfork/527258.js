// ==UserScript==
// @name        My cube
// @namespace   Violentmonkey Scripts
// @match       https://johnbutlergames.com/games/opposite-day/1-2-1/index.html*
// @grant       none
// @version     1.1
// @author      God NTSC Player
// @description 5/7/2025, 9:11:07 PM
// @downloadURL https://update.greasyfork.org/scripts/527258/My%20cube.user.js
// @updateURL https://update.greasyfork.org/scripts/527258/My%20cube.meta.js
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