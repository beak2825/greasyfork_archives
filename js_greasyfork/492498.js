// ==UserScript==
// @name         Sploop.io Starry Night Background
// @version      1.0
// @description  Replace forest with stars!
// @author       fizzixww
// @namespace    fizzixww
// @match        https://sploop.io/*
// @icon         https://i.postimg.cc/1RpjyHWy/fireball.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492498/Sploopio%20Starry%20Night%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/492498/Sploopio%20Starry%20Night%20Background.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function replaceRectWithImage() {
        const { fillRect } = CanvasRenderingContext2D.prototype;

        CanvasRenderingContext2D.prototype.fillRect = function(x, y, width, height) {
            const canvas = document.getElementById("game-canvas");
            const ctx = canvas.getContext("2d");
            if (this.fillStyle === "#788f57") {
                ctx.fillStyle = "black";
                ctx.fillRect(x, y, width, height);
                const starPositions = [];
                const numStarsX = Math.ceil(width / 90);
                const numStarsY = Math.ceil(height / 60);
                for (let i = 0; i < numStarsY; i++) {
                    for (let j = 0; j < numStarsX; j++) {
                        const offsetX = (i * numStarsX + j * i) % 60 * 3;
                        const offsetY = (i * numStarsY + j * j) % 60 * 3;
                        starPositions.push({ x: x + j * 90 + offsetX, y: y + i * 60 + offsetY });
                    }
                }
                ctx.fillStyle = "white";
                starPositions.forEach(star => {
                    ctx.fillRect(star.x, star.y, 2, 2);
                });
            }
            else {
                fillRect.call(this, x, y, width, height);
            }
        };
    }
    window.addEventListener('load', replaceRectWithImage);
})();