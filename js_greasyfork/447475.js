// ==UserScript==
// @name Moomoo.io Item markers
// @author Murka
// @description Draws markers on items
// @icon https://moomoo.io/img/favicon.png?v=1
// @version 0.3
// @match *://moomoo.io/*
// @match *://*.moomoo.io/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/447475/Moomooio%20Item%20markers.user.js
// @updateURL https://update.greasyfork.org/scripts/447475/Moomooio%20Item%20markers.meta.js
// ==/UserScript==
/* jshint esversion:6 */

/*
    Author: Murka
    Github: https://github.com/Murka007
    Discord: https://discord.gg/cPRFdcZkeD
    Greasyfork: https://greasyfork.org/en/users/919633
    MooMooForge: https://github.com/MooMooForge
*/

(function() {
    "use strict";

    // render - false/true, used to toggle rendering of marker
    // color - hex/rgb color, used to change marker color
    const MARKER_COLOR = {
        MY_PLAYER: {
            render: true,
            color: "#a7f060"
        },
        TEAMMATE: {
            render: true,
            color: "#fceb65"
        },
        ENEMY: {
            render: true,
            color: "#f76363"
        }
    };
    const MARKER_SIZE = 10;

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

    function createHook(target, prop, setter, getter) {
        const symbol = Symbol(prop);
        Object.defineProperty(target, prop, {
            get() {
                getter(this, this[symbol]);
                return this[symbol];
            },
            set(value) {
                setter(this, symbol, value);
            },
            configurable: true
        })
    }

    let item = null;
    createHook(Object.prototype, "isItem", function(that, symbol, value) {
        that[symbol] = value;
    }, function(that, value) {
        if (value === true) {
            item = that;
        }
    });

    const myPlayer = { id: null };
    const teammates = [];

    // myPlayer spawned
    function setupPlayer(temp) {
        myPlayer.id = temp[1];
    }

    function createDeleteClan(temp) {
        if (!temp[1]) {
            teammates.splice(0, teammates.length);
        }
    }

    function updateClanList(temp) {
        teammates.splice(0, teammates.length);
        for (let i=0;i<temp[1].length;i+=2) {
            const [ id, name ] = temp[1].slice(i, i+2);
            teammates.push(id);
        }
    }

    function getItemColor(id) {
        if (id === myPlayer.id) return MARKER_COLOR.MY_PLAYER;
        if (teammates.includes(id)) return MARKER_COLOR.TEAMMATE;
        return MARKER_COLOR.ENEMY;
    }

    function drawMarker(ctx) {
        if (!item || !item.owner || myPlayer.id === null) return;
        const type = getItemColor(item.owner.sid);
        if (!type.render) return;

        ctx.fillStyle = type.color;
        ctx.beginPath();
        ctx.arc(0, 0, MARKER_SIZE, 0, 2 * Math.PI);
        ctx.fill();
        item = null;
    }

    // This method is called when item was drawn
    CanvasRenderingContext2D.prototype.restore = new Proxy(CanvasRenderingContext2D.prototype.restore, {
        apply(target, _this, args) {
            drawMarker(_this);
            return target.apply(_this, args);
        }
    });

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

    // previous way to get msgpack encoder and decoder.
    // Get msgpack's encode and decode methods
    /*Function.prototype.call = new Proxy(Function.prototype.call, {
        apply(target, _this, args) {
            const data = target.apply(_this, args);
            if (args[1] && args[1].i) {
                const i = args[1].i;
                if (i === 9) msgpack.encode = args[0].encode;
                if (i === 15) {
                    msgpack.decode = args[0].decode;
                    Function.prototype.call = target;
                }
            }
            return data;
        }
    })*/

    const PACKETS = {
        1: setupPlayer,
        st: createDeleteClan,
        sa: updateClanList,
    };

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

    // old intercept ws method
    /*const set = Object.getOwnPropertyDescriptor(WebSocket.prototype, "onmessage").set;
    Object.defineProperty(WebSocket.prototype, "onmessage", {
        set(callback) {
            return set.call(this, new Proxy(callback, {
                apply(target, _this, args) {
                    message(args[0]);
                    return target.apply(_this, args);
                }
            }))
        }
    })*/

})();