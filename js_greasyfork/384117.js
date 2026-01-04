// ==UserScript==
// @name         someone spreads the updated spread script
// @namespace    nah
// @version      0.00000000000000000000000000000000000001
// @description  yeah you know what to do
// @author       me
// @match        *://*.diep.io/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/384117/someone%20spreads%20the%20updated%20spread%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/384117/someone%20spreads%20the%20updated%20spread%20script.meta.js
// ==/UserScript==

(function() {
    "use strict";
    window.WebSocket.prototype._send = window.WebSocket.prototype.send;
    var reload = 0;
    var reloadTime = 1.2;
    var state = new MutationObserver(function(mutationList) {
        reload = 0;
    }).observe(document.getElementById("a"), { attributes: true, childList: false, subtree: false });
    var ping;
    var pinger;
    var mouse;
    var looper;
    window.WebSocket = class extends window.WebSocket {
        constructor(arg) {
            super(arg);
            window.ws = this;
            Object.defineProperty(this, "onopen", {
                get() {},
                set(to) {
                    delete this.onopen;
                    this.onopen = function() {
                        to.call(this);
                        reload = 0;
                        this.send = function(x) {
                            if(x.length == 1) {
                                pinger = new Date().valueOf();
                            } else if(x.length == 3) {
                                if(x[0] == 3 && x[1] == 12) {
                                    reload++;
                                    if(reload > 7) {
                                        reload = 7;
                                    }
                                }
                            }
                            this._send(x);
                        };
                        this.loop = function() {
                            reloadTime = Math.ceil(30 / 1.875 ** (reload / 7)) * 0.04;
                            this.frame = window.requestAnimationFrame(this.loop);
                        }.bind(this);
                        this.frame = window.requestAnimationFrame(this.loop);
                        delete this.onopen;
                        Object.defineProperty(this, "onopen", {
                            get() {},
                            set(to) {
                                window.cancelAnimationFrame(this.frame);
                                delete this.onopen;
                            },
                            configurable: true,
                            enumerable: true
                        });
                    };
                },
                configurable: true,
                enumerable: true
            });
            Object.defineProperty(this, "onmessage", {
                get() {},
                set(to) {
                    delete this.onmessage;
                    this.onmessage = function(x) {
                        if(new Uint8Array(x.data)[0] == 5) {
                            ping = new Date().valueOf() - pinger;
                        }
                        to.call(this, x);
                    };
                },
                configurable: true,
                enumerable: true
            });
        }
    }
    window.input ? inputto() : Object.defineProperty(window, "input", {
        get() {},
        set(to) {
            delete window.input;
            window.input = to;
            inputto();
        },
        configurable: true,
        enumerable: true
    });
    function inputto() {
        window.input._keyDown = window.input.keyDown;
        window.input._keyUp = window.input.keyUp;
        window.input._mouse = window.input.mouse;
        window.input.mouse = function(x, y) {
            mouse = { x: x, y: y };
            this._mouse(x, y);
        };
        window.input.keyDown = function(x) {
            if(x == 3) {
                let times = 6;
                this.mouse = function(x, y) {
                    mouse = { x: x, y: y };
                };
                function loop() {
                    let angle = Math.atan2(mouse.y - window.innerHeight / 2, mouse.x - window.innerWidth / 2);
                    switch(times) {
                        case 6:
                            window.setTimeout(function() {
                                window.input._mouse(window.innerWidth / 2 + Math.cos(angle) * 1000, window.innerHeight / 2 + Math.sin(angle) * 1000);
                            }, ping - (reloadTime / 6) * 1000);
                            break;
                        case 5:
                            window.setTimeout(function() {
                                window.input._mouse(window.innerWidth / 2 + Math.cos(angle + Math.PI * 1/10 * 0.92) * 1000, window.innerHeight / 2 + Math.sin(angle + Math.PI * 1/10 * 0.92) * 1000);
                            }, ping - (reloadTime / 6) * 1000);
                            break;
                        case 4:
                            window.setTimeout(function() {
                                window.input._mouse(window.innerWidth / 2 + Math.cos(angle + Math.PI * 2/10 * 0.92) * 1000, window.innerHeight / 2 + Math.sin(angle + Math.PI * 2/10 * 0.92) * 1000);
                            }, ping - (reloadTime / 6) * 1000);
                            break;
                        case 3:
                            window.setTimeout(function() {
                                window.input._mouse(window.innerWidth / 2 + Math.cos(angle + Math.PI * 3/10 * 0.92) * 1000, window.innerHeight / 2 + Math.sin(angle + Math.PI * 3/10 * 0.92) * 1000);
                            }, ping - (reloadTime / 6) * 1000);
                            break;
                        case 2:
                            window.setTimeout(function() {
                                window.input._mouse(window.innerWidth / 2 + Math.cos(angle + Math.PI * 4/10 * 0.92) * 1000, window.innerHeight / 2 + Math.sin(angle + Math.PI * 4/10 * 0.92) * 1000);
                            }, ping - (reloadTime / 6) * 1000);
                            break;
                        case 1:
                            window.setTimeout(function() {
                                window.input._mouse(window.innerWidth / 2 + Math.cos(angle + Math.PI * 5/10 * 0.92) * 1000, window.innerHeight / 2 + Math.sin(angle + Math.PI * 5/10 * 0.92) * 1000);
                            }, ping - (reloadTime / 6) * 1000);
                            break;
                    }
                    times--;
                    if(!times) {
                        times = 6;
                    }
                }
                looper = window.setInterval(loop, (reloadTime / 6) * 1000 + 1);
                this._keyDown(32);
                loop();
            }
            this._keyDown(x);
        };
        window.input.keyUp = function(x) {
            if(x == 3) {
                window.clearInterval(looper);
                this.mouse = function(x, y) {
                    mouse = { x: x, y: y };
                    this._mouse(x, y);
                };
                this._keyUp(32);
            }
            this._keyUp(x);
        };
    }
})();