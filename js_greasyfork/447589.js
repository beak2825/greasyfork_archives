// ==UserScript==
// @name Moomoo.io Enemy location tracker
// @author Murka
// @description Shows approximate location of enemies on the map. Using this script you can easily find players in the game
// @icon https://moomoo.io/img/favicon.png?v=1
// @version 0.6
// @match *://moomoo.io/*
// @match *://*.moomoo.io/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/447589/Moomooio%20Enemy%20location%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/447589/Moomooio%20Enemy%20location%20tracker.meta.js
// ==/UserScript==
/* jshint esversion:6 */

/*
    Author: Murka
    Github: https://github.com/Murka007
    Discord: https://discord.gg/cPRFdcZkeD
    Greasyfork: https://greasyfork.org/en/users/919633
    MooMooForge: https://github.com/MooMooForge

    How does it work?
    - It shows a notification on the map when some player breaks an object
    - You should see the object at least once to make notifications work
    - It works even better on sandbox
*/

(function() {
    "use strict";

    const log = console.log;

    const createRecursiveHook = (target, prop, condition, callback) => {
        (function recursiveHook() {
            Object.defineProperty(target, prop, {
                set(value) {
                    delete target[prop];
                    this[prop] = value;
                    if (
                        condition(this, value) &&
                        callback(this, value)
                    ) return;
                    recursiveHook();
                },
                configurable: true
            })
        })();
    }

    function createHook(target, prop, setter) {
        const symbol = Symbol(prop);
        Object.defineProperty(target, prop, {
            get() {
                return this[symbol];
            },
            set(value) {
                setter(this, symbol, value);
            },
            configurable: true
        })
    }

    const myPlayer = {
        id: null,
        alive: false,
        focused: true,
        playerObject: null
    };

    // Get myPlayer object
    createHook(Object.prototype, "isPlayer", function(that, symbol, value) {
        that[symbol] = value;
        if (value === true && that.sid === myPlayer.id) {
            myPlayer.playerObject = that;
        }
    });

    function map(value, start1, stop1, start2, stop2) {
        return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    }

    function lerp(start, stop, amt) {
        return amt * (stop - start) + start;
    }

    function inView(x, y, radius) {
        const { maxScreenWidth, maxScreenHeight } = window.config || {};
        const visibleHorizontally = x + radius > 0 && x - radius < maxScreenWidth;
        const visibleVertically = y + radius > 0 && y - radius < maxScreenHeight;
        return true;
        return visibleHorizontally && visibleVertically;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.id = "notification-canvas";
    canvas.width = 300;
    canvas.height = 300;

    window.addEventListener("load", function() {
        const CSS = `
            #notification-canvas {
                display: inline-block;
                position: absolute;
        	    bottom: 20px;
        	    left: 20px;
        	    width: 130px;
        	    height: 130px;
        	    border-radius: 4px;
            }
            @media only screen and (max-width: 768px) {
                #notification-canvas {
        	        width: 66px;
        		    height: 66px;
        		    bottom: unset;
        		    top: 8px;
        		    left: 8px;
        	    }
            }
        `;
        const style = document.createElement("style");
        style.innerHTML = CSS;
        document.head.appendChild(style);

        const mapDisplay = document.querySelector("#mapDisplay");
        mapDisplay.parentNode.insertBefore(canvas, mapDisplay.nextSibling);
    })

    const notifications = [];
    function clear() {
        notifications.splice(0, notifications.length);
    }

    window.addEventListener("focus", () => { myPlayer.focused = true; })
    window.addEventListener("blur", () => {
        myPlayer.focused = false;
        clear();
    })

    class Notification {
        constructor(x, y) {
            this._x = x;
            this._y = y;
            this._radius = 1;
            this._opacity = 1;

            this._timeout = {
                value: 0,
                max: 75
            };
        }

        _animate() {
            if (this._timeout.value === this._timeout.max) {
                const index = notifications.indexOf(this);
                notifications.splice(index, 1);
                return;
            }

            this._radius = lerp(this._radius, 35, 0.03);
            this._opacity = map(this._timeout.value, 0, this._timeout.max, 1, 0.3);
            this._timeout.value += 1;
        }

        draw() {
            this._animate();

            const { mapScale } = window.config || {};
            if (!mapScale) return;

            const x = this._x / mapScale * canvas.width;
            const y = this._y / mapScale * canvas.height;

            ctx.save();
            ctx.globalAlpha = this._opacity;
            ctx.strokeStyle = "#c93e3e";
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.arc(x, y, this._radius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.restore();
        }
    }

    // Notification rendering loop
    function loop() {
        window.requestAnimationFrame(loop);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i=0;i<notifications.length;i++) {
            notifications[i].draw();
        }
    }
    window.requestAnimationFrame(loop);

    const objects = new Map();
    function createNotification(id) {
        const object = objects.get(id);
        const { x, y } = myPlayer.playerObject;

        // Object must exist and it shouldn't be in player view
        if (!object) return;
        //if (!object || inView(object.x-x, object.y-y, object.radius)) return;

        const notify = new Notification(object.x, object.y);
        notifications.push(notify);
    }

    function playerSetup(temp) {
        myPlayer.id = temp[1];
        myPlayer.alive = true;
    }

    function playerDied(temp) {
        myPlayer.alive = false;
        clear();
    }

    function formatObject(object) {
        const [ id, x, y, angle, radius, resourceType, objectType, ownerID ] = object;
        return {
            id,
            x,
            y,
            angle,
            radius,
            resourceType,
            objectType,
            ownerID
        };
    }

    function createObject(temp) {
        for (let i=0;i<temp[1].length;i+=8) {
            const object = formatObject(temp[1].slice(i, i+8));
            objects.set(object.id, object);
        }
    }

    function deleteObject(temp) {

        // Make sure we don't create a new notification when player is afk, otherwise it will cause lag issues
        if (myPlayer.alive && myPlayer.focused) createNotification(temp[1]);
        objects.delete(temp[1]);
    }

    const PACKETS = {
        1: playerSetup,
        11: playerDied,
        6: createObject,
        12: deleteObject,
    };

    document.msgpack = {
        Encoder: null,
        Decoder: null
    };

    // Intercept msgpack encoder
    createRecursiveHook(
        Object.prototype, "initialBufferSize",
        (_this) => (
            typeof _this === "object" &&
            typeof _this.encode === "function" &&
            _this.encode.length === 1
        ),
        (_this) => {
            document.msgpack.Encoder = _this;
            return true;
        }
    );

    // Intercept msgpack decoder
    createRecursiveHook(
        Object.prototype, "maxExtLength",
        (_this) => (
            typeof _this === "object" &&
            typeof _this.decode === "function" &&
            _this.decode.length === 1
        ),
        (_this) => {
            document.msgpack.Decoder = _this;
            return true;
        }
    );

    // Handle WebSocket data
    function message(event) {
        try {
            const data = document.msgpack.Decoder.decode(new Uint8Array(event.data));
            const temp = [data[0], ...data[1]];
            PACKETS[temp[0]](temp);
        } catch(err){}
    }

    // Intercept WebSocket
    window.WebSocket = new Proxy(WebSocket, {
        construct(target, args) {
            const socket = new target(...args);
            socket.addEventListener("message", message);
            return socket;
        }
    });

})();