// ==UserScript==
// @name         insane
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  "aaaaaa"
// @author       qloha
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521256/insane.user.js
// @updateURL https://update.greasyfork.org/scripts/521256/insane.meta.js
// ==/UserScript==

let msgpack = window.msgpack;

;(async () => {

    console.log("Insane >> 1.4 Loaded."); //say hi

    //empty clan name

    let originalSend = WebSocket.prototype.send;

    WebSocket.prototype.send = new Proxy(originalSend, {
        apply: ((target, websocket, argsList) => {
            let decoded = msgpack.decode(new Uint8Array(argsList[0]));

            if (decoded[0] === "L") decoded[1] = String.fromCharCode(0);

            return target.apply(websocket, [msgpack.encode(decoded)]);
        })
    });

    document.getElementById("altcha_checkbox").click();

    //big brain stuff
    window.keyRebinder = true;
    let items = [],
        weapons = [],
        inGame = false,
        keys = {},
        init = false,
        ws = await new Promise(async (resolve) => {
            let { send } = WebSocket.prototype;
            WebSocket.prototype.send = function (...x) {
                send.apply(this, x);
                this.send = send;
                this.iosend = function (...datas) {
                    const [packet, data] = datas;
                    this.send(msgpack.encode([packet, data]));
                };
                if (!init) {
                    init = true;
                    this.addEventListener("message", (e) => {
                        if (!e.origin.includes("moomoo.io") && !window.privateServer) return;
                        const [packet, data] = msgpack.decode(new Uint8Array(e.data));
                        switch (packet) {
                            case "C":
                                inGame = true;
                                items = [0, 3, 6, 10];
                                weapons = [0];
                                break;
                            case "P":
                                inGame = false;
                                break;
                            case "V":
                                if (data[0]) {
                                    if (data[1]) weapons = data[0];
                                    else items = data[0];
                                }
                                break;
                            case "a":

                                if (keys[70] && items[4]) {
                                    boostSpike();
                                } else if (keys[71]) {
                                    triSpike();
                                } else if (keys[86]) {
                                    equip(0, 0);
                                } else if (keys[72]) {
                                    equip(50, 0);
                                }
                                break;
                            default:
                                break;
                        }
                    });
                }
                resolve(this);
            };
        });

    //Placing logic

    function place(itemType, angle) {
        ws.iosend("z", [itemType, null]);
        ws.iosend("F", [1, angle]);
        ws.iosend("z", [weapons[0], true]);
    }

    //Hat macro

    document.addEventListener("mousedown", () => {
        if (inGame) {
            equip(0, 1);
        }
    });

    document.addEventListener("mouseup", () => {
        if (inGame) {
            equip(11, 1);
        }
    });

    function equip(index, type) {
        ws.iosend("c", [0, index, type]);
    }

    function buy(index, type) {
        ws.iosend("c", [1, index, type]);
    }

    //Boost+Spike macro

    function boostSpike() {
        let boostDir = Math.atan2(window.mouseY - window.innerHeight / 2, window.mouseX - window.innerWidth / 2);
        place(items[4], boostDir);

        setTimeout(() => {
            place(items[2], boostDir - Math.PI / 2);
            place(items[2], boostDir + Math.PI / 2);
        }, 111);
    }

    //trispike macro

    function triSpike() {
        place(items[2], 90);
        place(items[2], 180);
        place(items[2], 270);
    }







// Don't delete stuff below





    window.addEventListener("keydown", (event) => {
        if (
            inGame &&
            !keys[event.code] &&
            document.getElementById("allianceMenu").style.display != "block" &&
            document.getElementById("chatHolder").style.display != "block"
        ) {
            keys[event.keyCode] = true;
        }
    });
    window.addEventListener("keyup", (event) => {
        if (
            inGame &&
            keys[event.keyCode] &&
            document.getElementById("allianceMenu").style.display != "block" &&
            document.getElementById("chatHolder").style.display != "block"
        ) {
            keys[event.keyCode] = false;
        }
    });
    document.getElementById("touch-controls-fullscreen").addEventListener("mousemove", e => {
        window.mouseX = e.clientX;
        window.mouseY = e.clientY;
    });
})();