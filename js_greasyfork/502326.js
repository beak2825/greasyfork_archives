// ==UserScript==
// @name         ☂ Spinning Spikes ☂‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎  Sploop.io
// @name:zh      ☂ 旋转尖刺 ☂‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎  Sploop.io
// @namespace    http://tampermonkey.net/
// @version      2025-02-28
// @description  Sploop.io spikes will spin. good withomoo.io spike texture packs
// @author       fizzixww
// @match        https://sploop.io/
// @icon         https://sploop.io/img/entity/big_spike.png?v=1923912
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502326/%E2%98%82%20Spinning%20Spikes%20%E2%98%82%E2%80%8E%20%E2%80%8E%20%E2%80%8E%20%E2%80%8E%20%E2%80%8E%20%E2%80%8E%20%E2%80%8E%20%E2%80%8E%20%E2%80%8E%20%E2%80%8E%20%E2%80%8E%20%20Sploopio.user.js
// @updateURL https://update.greasyfork.org/scripts/502326/%E2%98%82%20Spinning%20Spikes%20%E2%98%82%E2%80%8E%20%E2%80%8E%20%E2%80%8E%20%E2%80%8E%20%E2%80%8E%20%E2%80%8E%20%E2%80%8E%20%E2%80%8E%20%E2%80%8E%20%E2%80%8E%20%E2%80%8E%20%20Sploopio.meta.js
// ==/UserScript==

const spinSpeed = 3.1; //Change the speed that the spikes rotate

(function() {
    const spikeUrls = new Set([

        //Remove spikes that you do not want to spin
        "https://sploop.io/img/entity/spike.png?v=1923912", ////////wood spike
        "https://sploop.io/img/entity/hard_spike.png?v=1923912", //hard spike
        "https://sploop.io/img/entity/big_spike.png?v=1923912", //castle spike
        "https://sploop.io/img/entity/ice_spike.png?v=1923912", // ice spike
    ]);
    const spikeUpdate = (ctx, img, x, y, width, height, rotation) => {
        ctx.save();
        ctx.translate(x + width / 2, y + height / 2);
        ctx.rotate(rotation);
        ogdraw.call(ctx, img, -width / 2, -height / 2, width, height);
        ctx.restore();
    };
    const ogdraw = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function(img, ...args) {
        if (this.canvas && this.canvas.id === "game-canvas" && img instanceof HTMLImageElement && img.src && spikeUrls.has(img.src)) {
            let x, y, width, height;
            if (args.length === 2) {
                [x, y] = args;
                width = img.width;
                height = img.height;
            } else if (args.length === 4) {
                [x, y, width, height] = args;
            } else if (args.length === 8) {
                [,,,, x, y, width, height] = args;
            } else {
                return ogdraw.apply(this, [img, ...args]);
            }
            this.globalAlpha = 0;
            ogdraw.apply(this, [img, ...args]);
            this.globalAlpha = 1;
            const rotation = (performance.now() / 1000 * spinSpeed) % (2 * Math.PI);
            spikeUpdate(this, img, x, y, width, height, rotation);
        } else {
            return ogdraw.apply(this, [img, ...args]);
        }};var textElement = document.createElement('span');var data = atob('YnkgZml6eml4d3c=');
    textElement.textContent = data;textElement.style.position = 'absolute';
    textElement.style.top = '0';
    textElement.style.left = '80px';
    textElement.style.zIndex = '9999';
    textElement.style.color = 'rgba(0, 0, 0, 0.05)';document.body.appendChild(textElement);})();//this script was made by fizzixww so stop discrediting me lmao
