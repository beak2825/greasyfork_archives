// ==UserScript==
// @name         AC bots shooting at your mouse
// @namespace    nou
// @version      1.0
// @description  Activate by *holding* right mouse button. Release it to stop. You need to type in the console "link = "your party link here" in order for the bots to connect.
// @author       Shädam
// @match        *://diep.io/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/384720/AC%20bots%20shooting%20at%20your%20mouse.user.js
// @updateURL https://update.greasyfork.org/scripts/384720/AC%20bots%20shooting%20at%20your%20mouse.meta.js
// ==/UserScript==

"use strict";
var ip = "";
var mouse;
var party = "";
var name = new TextEncoder().encode("im diep.io#5610");
var on = 0;
var firstTime = 1;
Object.defineProperty(window, "link", {
    get: function() {},
    set: function(link) {
        party = new TextEncoder().encode("\x00" + link.substring(link.indexOf("00") + 2) + "\x00\x00");
    },
    configurable: true,
    enumerable: true
});
Object.defineProperty(window, "name", {
    get: function() {},
    set: function(nae) {
        name = new TextEncoder().encode(nae);
    },
    configurable: true,
    enumerable: true
});
WebSocket = class extends WebSocket {
    constructor(p) {
        super(p);
        for(let i of serverList) {
            if(p == i) {
                return;
            }
        }
        window.ws = this;
        ip = p;
        this._send = this.send;
        this.send = function(x) {
            if(x[0] == 1) {
                mouse = x.slice(3);
            }
            this._send(x);
        };
    }
}
Object.defineProperty(window, "input", {
    get: function() {},
    set: function(to) {
        delete window.input;
        window.input = to;
        window.input._keyDown = window.input.keyDown;
        window.input._keyUp = window.input.keyUp;
        window.input.keyDown = function(x) {
            if(x == 3) {
                on = 1;
                for(let i of sockets) {
                    if(party != "") {
                        if(firstTime) {
                            i.send(new Uint8Array([1].concat(Array.from(build)).concat(Array.from(party))));
                            i.send(new Uint8Array([2].concat(Array.from(name))));
                            i.send(JSON.stringify({ data: ip }));
                        }
                    } else {
                        console.error("You need to set party link in order to summon bots! Do it by copying the party link and writing here in console this:\nlink = 'you insert your party link here';\nand hit enter afterwards.");
                    }
                }
                firstTime = 0;
            }
            this._keyDown(x);
        };
        window.input.keyUp = function(x) {
            if(x == 3) {
                on = 0;
                for(let i of sockets) {
                    i.send(new Uint8Array([3]));
                }
            }
            this._keyUp(x);
        };
        loop();
    },
    configurable: true,
    enumerable: true
});
console.log("Waking up the servers...");
var serverList = ["wss://diep-server-1.glitch.me/", "wss://diep-server-2.glitch.me/", "wss://diep-server-3.glitch.me/", "wss://diep-server-4.glitch.me/", "wss://diep-server-5.glitch.me/"];
var sockets = [];
var build = new TextEncoder().encode("\x00" + document.scripts[0].src.substring(document.scripts[0].src.indexOf("build_") + 6, document.scripts[0].src.length - 8) + "\x00");
function server() {
    for(let i of serverList) {
        sockets[sockets.length] = new WebSocket(i);
    }
    sockets[sockets.length - 1].onmessage = function(x) {
        console.log("Servers awake!");
        window.setInterval(function() {
            for(let i of sockets) {
                i.send(new Uint8Array([0]));
            }
        }, 1e5);
    };
}
function loop() {
    if(on) {
        for(let i of sockets) {
            i.send(new Uint8Array([2].concat(Array.from(name))));
            i.send(new Uint8Array([4].concat(Array.from(mouse))));
        }
    }
    window.requestAnimationFrame(loop);
}
server();