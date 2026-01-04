// ==UserScript==
// @name         Master Mills
// @namespace    Auto-Place Mills for Moomoo.io
// @version      0.3
// @author       Master Mue
// @description  Just Auto-Mills for Moomoo.io
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @grant        none
// @icon         https://static.wikia.nocookie.net/moom/images/6/68/Windmill.png/revision/latest?cb=20190211160349
// @downloadURL https://update.greasyfork.org/scripts/483787/Master%20Mills.user.js
// @updateURL https://update.greasyfork.org/scripts/483787/Master%20Mills.meta.js
// ==/UserScript==
//--------------------------------------------------------------------------------------------------
document.getElementById('gameName').innerHTML = "💥Just Mills!💥";
document.getElementById("promoImgHolder").remove();
document.querySelector("#pre-content-container").remove(); //ANTI AD

(() => {
    // Constants and Variables
    let ws = null;
    let x = 0;
    let y = 0;
    let msgpack5 = window.msgpack;
    let scale = 45;
    let placeOffset = 5;
    let autoMill = false;
    let moreMill = false;
    let Allplayers = [];
    let players = [];
    //--------------------------------------------------------------------------------------------------
    const inventory = {
        primary: null,
        secondary: null,
        food: null,
        wall: null,
        spike: null,
        mill: null,
        mine: null,
        boostPad: null,
        trap: null,
        turret: null,
        teleporter: null,
        spawnpad: null
    };
    const vars = {
        camX: 0,
        camY: 0
    };
    const myPlayer = {
        sid: null,
        x: null,
        y: null,
        dir: null,
        buildIndex: null,
        weaponIndex: null,
        weaponVariant: null,
        team: null,
        isLeader: null,
        skinIndex: null,
        tailIndex: null,
        iconIndex: null
    };
    
    //--------------------------------------------------------------------------------------------------
    // Helper Functions

    /**
   * Utility function to join arrays
   * @param {Array} message - The array to join
   * @returns {Array} - Joined array
   */
    const join = message => Array.isArray(message) ? [...message] : [...message];

    /**
   * Hook function for WebSocket
   * @param {object} ms - WebSocket message
   */
    const hookWS = ms => {
        let tmpData = msgpack5.decode(new Uint8Array(ms.data));
        if ((ms = undefined) || (tmpData = (ms = tmpData.length > 1 ? [tmpData[0], ...join(tmpData[1])] : tmpData)[0]) || ms) {
            if ("C" == tmpData && null === myPlayer.sid && (myPlayer.sid = ms[1]) || "a" == tmpData) {
                for (tmpData = 0; tmpData < ms[1].length / 13; tmpData++) {
                    let data = ms[1].slice(13 * tmpData, 13 * (tmpData + 1));
                    if (data[0] == myPlayer.sid) {
                        Object.assign(myPlayer, {
                            x: data[1],
                            y: data[2],
                            dir: data[3],
                            buildIndex: data[4],
                            weaponIndex: data[5],
                            weaponVariant: data[6],
                            team: data[7],
                            isLeader: data[8],
                            skinIndex: data[9],
                            tailIndex: data[10],
                            iconIndex: data[11]
                        });
                    }
                }
            }

            vars.camX || (vars.camX = myPlayer.x);
            vars.camY || (vars.camY = myPlayer.y);

            //--------------------------------------------------------------------------------------------------
            //--------------------------------------------------------------------------------------------------
            if (y !== myPlayer.y || x !== myPlayer.x) {
                //--------------------------------------------------------------------------------------------------
                // AUTO MILL CODE:
                if (autoMill) {
                    let angle = Math.atan2(y - myPlayer.y, x - myPlayer.x);
                    place(inventory.mill, angle + Math.PI / 2.5);
                    place(inventory.mill, angle);
                    place(inventory.mill, angle - Math.PI / 2.5);
                }
                x = myPlayer.x;
                y = myPlayer.y;
            }
            if(moreMill){
                place(inventory.mill);
            }
        }
        cacheItems();
    }
    //--------------------------------------------------------------------------------------------------

    /**
   * Function to emit a packet
   * @param {string} event - Event type
   * @param {*} a - Parameter a
   * @param {*} b - Parameter b
   * @param {*} c - Parameter c
   * @param {*} m - Parameter m
   * @param {*} r - Parameter r
   */
    const emit = (event, a, b, c, m, r) => ws.send(Uint8Array.from([...msgpack5.encode([event, [a, b, c, m, r]])]));

    /**
   * Function to place an item
   * @param {number} event - Event type
   * @param {number} l - Angle
   */
    const place = (event, l) => {
        emit("G", event, false);
        emit("d", 1, l);
        emit("d", 0, l);
        emit("G", myPlayer.weaponIndex, true);
    };
    const hit = function (ang) {
        emit("d", 1, ang);
        emit("d", 0, ang);
        emit("G", myPlayer.weaponIndex, true);
    };

    /**
   * Function to send a chat message
   * @param {string} event - The chat message
   */
    const chat = event => emit("6", event);

    //--------------------------------------------------------------------------------------------------
    /**
   * Cache the player's items
   */
    const cacheItems = () => {
        for (let c = 0; c < 9; c++) {
            var _document$getElementB;
            if (((_document$getElementB = document.getElementById(`actionBarItem${c}`)) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.offsetParent) !== null) {
                inventory.primary = c;
            }
        }
        for (let s = 9; s < 16; s++) {
            var _document$getElementB2;
            if (((_document$getElementB2 = document.getElementById(`actionBarItem${s}`)) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.offsetParent) !== null) {
                inventory.secondary = s;
            }
        }
        for (let P = 16; P < 19; P++) {
            var _document$getElementB3;
            if (((_document$getElementB3 = document.getElementById(`actionBarItem${P}`)) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.offsetParent) !== null) {
                inventory.food = P - 16;
            }
        }
        for (let f = 19; f < 22; f++) {
            var _document$getElementB4;
            if (((_document$getElementB4 = document.getElementById(`actionBarItem${f}`)) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.offsetParent) !== null) {
                inventory.wall = f - 16;
            }
        }
        for (let _ = 22; _ < 26; _++) {
            var _document$getElementB5;
            if (((_document$getElementB5 = document.getElementById(`actionBarItem${_}`)) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.offsetParent) !== null) {
                inventory.spike = _ - 16;
            }
        }
        for (let u = 26; u < 29; u++) {
            var _document$getElementB6;
            if (((_document$getElementB6 = document.getElementById(`actionBarItem${u}`)) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.offsetParent) !== null) {
                inventory.mill = u - 16;
            }
        }
        for (let I = 29; I < 31; I++) {
            var _document$getElementB7;
            if (((_document$getElementB7 = document.getElementById(`actionBarItem${I}`)) === null || _document$getElementB7 === void 0 ? void 0 : _document$getElementB7.offsetParent) !== null) {
                inventory.mine = I - 16;
            }
        }
        for (let p = 31; p < 33; p++) {
            var _document$getElementB8;
            if (((_document$getElementB8 = document.getElementById(`actionBarItem${p}`)) === null || _document$getElementB8 === void 0 ? void 0 : _document$getElementB8.offsetParent) !== null) {
                inventory.boostPad = p - 16;
            }
        }
        for (let x = 31; x < 33; x++) {
            var _document$getElementB9;
            if (((_document$getElementB9 = document.getElementById(`actionBarItem${x}`)) === null || _document$getElementB9 === void 0 ? void 0 : _document$getElementB9.offsetParent) !== null) {
                inventory.trap = x - 16;
            }
        }
        for (let g = 33; g < 35; g++) {
            var _document$getElementB10;
            if (((_document$getElementB10 = document.getElementById(`actionBarItem${g}`)) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.offsetParent) !== null && g !== 36) {
                inventory.turret = g - 16;
            }
        }
        for (let y = 36; y < 39; y++) {
            var _document$getElementB10;
            if (((_document$getElementB10 = document.getElementById(`actionBarItem${y}`)) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.offsetParent) !== null && y !== 36) {
                inventory.teleporter = y - 16;
            }
        }
        inventory.spawnpad = 36;
    };
    //--------------------------------------------------------------------------------------------------
    // Auto Mill
    document.addEventListener("keydown", event => {
        if (event.keyCode === 77 && document.activeElement.id.toLowerCase() !== 'chatbox') {//M
            autoMill = !autoMill;
        }
        if (event.keyCode === 70 && document.activeElement.id.toLowerCase() !== 'chatbox'){//N
            moreMill = true;
        }
    });
    document.addEventListener("keyup", event => {
        if (event.keyCode === 70 && document.activeElement.id.toLowerCase() !== 'chatbox'){//N
            moreMill = false;
        }
    });
    //--------------------------------------------------------------------------------------------------
    // Override WebSocket's send method
    document.msgpack = window.msgpack;
    WebSocket.prototype.oldSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (event) {
        ws || (document.ws = this, ws = this, document.ws.addEventListener("message", hookWS));
        this.oldSend(event);
    };
})();