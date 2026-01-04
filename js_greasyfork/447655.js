// ==UserScript==
// @name Sploop.io Tracers
// @author Murka
// @description Draws tracers on enemies, teammates and animals
// @icon https://sploop.io/img/ui/favicon.png
// @version 0.3
// @match *://sploop.io/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/447655/Sploopio%20Tracers.user.js
// @updateURL https://update.greasyfork.org/scripts/447655/Sploopio%20Tracers.meta.js
// ==/UserScript==
/* jshint esversion:6 */

/*
    Author: Murka
    Github: https://github.com/Murka007
    Discord: https://discord.gg/cPRFdcZkeD
    Greasyfork: https://greasyfork.org/en/users/919633

    Description:
    - Draws tracers at enemies, teammates and animals
    - You can choose your tracers mode, `ARROWS` or `LINES`
    - If you will have any issues with this script, report about it in my discord
*/

(function() {
    "use strict";

    // Customize tracers by changing values
    window.tracers = {
        mode: "ARROWS", // ARROWS, LINES
        color: {
            teammate: "#a4cc4f",
            enemy: "#cc5151"
        }
    };
    
    

    const log = console.log;
    function createHook(target, prop, setter) {
        if (!window.hooks) {
            window.hooks = {
                setter: [],
                getter: []
            };
        }
        window.hooks.setter.push(setter);

        const symbol = Symbol(prop);
        Object.defineProperty(target, prop, {
            get() {
                return this[symbol];
            },
            set(value) {
                for (const setter of window.hooks.setter) {
                    setter(this, symbol, value);
                }
            },
            configurable: true
        })
    }

    const myPlayer = {
        id: null,
        data: null
    };

    // Get player id
    window.WebSocket = new Proxy(WebSocket, {
        construct(target, args) {
            const socket = new target(...args);
            socket.addEventListener("message", function(event) {
                try {
                    const data = JSON.parse(event.data);
                    if (data[0] === 35) {
                        myPlayer.id = data[1];
                    }
                } catch(err) {}
            })
            return socket;
        }
    })

    createHook(Object.prototype, "i", function(that, symbol, value) {
        that[symbol] = value;
        if (myPlayer.id === value) myPlayer.data = that;
    });

    function formatPosition(args) {
        const [ img, x, y ] = args;
        return {
            x: x + 0.5 * img.width / 2,
            y: y - 67.5
        };
    }

    function triangle(ctx, x, y, width, height, angle, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(width, 0);
        ctx.lineTo(0, -height);
        ctx.lineTo(-width, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function lines(ctx, x1, y1, x2, y2, color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineCap = "round";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    }

    const COLOR = {
        TEAMMATE: "#a4cc4f",
        ENEMY: "#cc5151"
    };

    // drawImage is called when the game draws a health gauge
    CanvasRenderingContext2D.prototype.drawImage = new Proxy(CanvasRenderingContext2D.prototype.drawImage, {
        apply(target, _this, args) {
            const data = target.apply(_this, args);
            const [ img, x, y, w, h ] = args;
            if (
                img instanceof HTMLCanvasElement &&
                [COLOR.TEAMMATE, COLOR.ENEMY].includes(_this.fillStyle) &&
                myPlayer.data !== null &&
                w === img.width * 0.5 &&
                h === img.height * 0.5
            ) {
                const { gU: x1, gV: y1 } = myPlayer.data;
                const { x: x2, y: y2 } = formatPosition(args);

                const angle = Math.atan2(y2 - y1, x2 - x1);
                const isMyPlayer = angle === -Math.PI/2 && _this.fillStyle === COLOR.TEAMMATE;
                const { teammate, enemy } = window.tracers.color;
                const color = _this.fillStyle === COLOR.TEAMMATE ? teammate : enemy;

                if (!isMyPlayer) {
                    const x = x1 + 80 * Math.cos(angle);
                    const y = y1 + 80 * Math.sin(angle);
                    switch (window.tracers.mode) {
                        case "ARROWS":
                            triangle(_this, x, y, 15, 40, angle + Math.PI / 2, color);
                            break;
                        case "LINES":
                            lines(_this, x1, y1, x2, y2, color);
                            break;
                    }
                }
            }
            return data;
        }
    })

})();