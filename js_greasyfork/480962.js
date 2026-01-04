// ==UserScript==
// @name         Moomoo.io - 1.8.0 Holder Macro & Interactive Menu
// @author       Seryo
// @description  This functions as a key rebinder. Press Keycode 186 to toggle hold macros. Use 'Esc' to toggle the menu and adjust hold intervals. Holds: Spike, Trap, Mill, Turret, Spawnpad, Wall
// @version      2.0
// @match        *://*.moomoo.io/*
// @namespace    https://greasyfork.org/users/1190411
// @icon         https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min.js
// @require      https://greasyfork.org/scripts/478839-moomoo-io-packet-code/code/MooMooio%20Packet%20Code.js?version=1274028
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480962/Moomooio%20-%20180%20Holder%20Macro%20%20Interactive%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/480962/Moomooio%20-%20180%20Holder%20Macro%20%20Interactive%20Menu.meta.js
// ==/UserScript==

function iso() {
    return document.activeElement.id.toLowerCase() === 'chatbox';
}

function iaia() {
    return document.activeElement.id.toLowerCase() === 'allianceinput';
}

function shhk() {
    return !iso() && !iaia();
}

function saveInputValue() {
    const inputValue = document.getElementById("speed").value;
    localStorage.setItem("speedValue", inputValue);
}

function loadInputValue() {
    const savedValue = localStorage.getItem("speedValue");
    if (savedValue) {
        document.getElementById("speed").value = savedValue;
    }

    const speedInput = document.getElementById("speed");
    speedInput.addEventListener("blur", handleBlur);
    speedInput.addEventListener("input", handleInput);
}

function handleBlur() {
    const speedInput = document.getElementById("speed");
    const inputValue = speedInput.value;

    if (inputValue === "" || inputValue === "110") {
        speedInput.value = "110";
        speedInput.style.color = "gray";
    }
}

function handleInput() {
    const speedInput = document.getElementById("speed");
    const inputValue = speedInput.value;

    if (inputValue !== "110") {
        speedInput.style.color = "black";
    }
}

let menuVisible = false;
let initialInterval = true;
let multipleTimes = false;

const mnu = document.createElement("div");
mnu.id = "mnu";
mnu.style.display = "none";
mnu.style.background = "rgba(0, 0, 0, 0.8)";
mnu.style.fontFamily = "'Hammersmith One, sans-serif'";
mnu.style.position = "fixed";
mnu.style.top = "50%";
mnu.style.left = "50%";
mnu.style.border = "1px solid #000";
mnu.style.borderRadius = "8px";
mnu.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.25), 5px 5px 10px rgba(0, 0, 0, 0.4)";
mnu.style.width = "200px";
mnu.style.color = "#fff";
mnu.style.fontSize = "17px";
mnu.style.zIndex = "1000";
mnu.style.overflowY = "auto";
mnu.style.padding = "10px";
mnu.style.textAlign = "center";

mnu.innerHTML = `
    <h2 style="font-size: 28px; color: white; margin-bottom: 8px;">Holder</h2>
    <hr style="border-color: white; margin: 5px 0;">
    <p style="font-size: 22px; color: gray; margin: 8px 0; display: inline-block; vertical-align: middle;"><span id="onOffIndicator">${multipleTimes ? 'On' : 'Off'}</span></p>
    <label for="speed" style="display: inline-block; margin-bottom: 5px; margin-left: 10px;"></label>
    <input type="number" id="speed" value="110" min="0" maxlength="5" style="width: 50px; margin: 0; display: inline-block; border-radius: 8px; border: 1px solid white; padding: 5px; vertical-align: middle;">
    <span style="margin-left: 5px; color: white;">ms</span>

    <div id="controls" style="margin-top: 10px; position: relative; color: white; opacity: 0; transition: opacity 0.3s ease-in-out;">
        <span id="controlsHeader" style="cursor: pointer; border: 1px solid white; padding: 8px; border-radius: 8px; background-color: #000; display: block;">Controls</span>
        <div id="controlsOptions" style="display: none; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); background-color: #000; border: 1px solid white; border-radius: 8px; padding: 8px; width: 100px;">
            <p class="fade" style="font-size: 22px; color: gray; margin: 8px 0;">Spike = V</p>
            <p class="fade" style="font-size: 22px; color: gray; margin: 8px 0;">Trap = F</p>
            <p class="fade" style="font-size: 22px; color: gray; margin: 8px 0;">Mill = N</p>
            <p class="fade" style="font-size: 22px; color: gray; margin: 8px 0;">Food = M</p>
        </div>
    </div>
`;

document.body.appendChild(mnu);

const controlsElement = document.getElementById('controls');
const controlsOptionsElement = document.getElementById('controlsOptions');
const fadeElements = document.querySelectorAll('.fade');

document.getElementById('controlsHeader').addEventListener('click', () => {
    controlsOptionsElement.style.display = controlsOptionsElement.style.display === 'none' ? 'block' : 'none';

    fadeElements.forEach(element => {
        element.style.opacity = controlsOptionsElement.style.display === 'none' ? 0 : 1;
    });

    controlsElement.style.opacity = controlsOptionsElement.style.display === 'none' ? 0 : 1;
});

// Main script logic
(async () => {
    unsafeWindow.keyRebinder = true;

    let items = [],
        weapons = [],
        inGame = false,
        keys = {},
        intervalIds = {},
        ws;

    try {
        // Establish WebSocket connection
        ws = await new Promise((resolve, reject) => {
            let { send } = WebSocket.prototype;

            WebSocket.prototype.send = function (...x) {
                send.apply(this, x);
                this.send = send;
                this.iosend = function (...datas) {
                    const [packet, data] = datas;
                    this.send(msgpack.encode([packet, data]));
                };
                this.addEventListener("message", (e) => {
                    if (!e.origin.includes("moomoo.io") && unsafeWindow.privateServer) return;
                    const [packet, data] = msgpack.decode(new Uint8Array(e.data));
                    switch (packet) {
                        case OLDPACKETCODE.RECEIVE["1"]:
                            inGame = true;
                            items = [0, 3, 6, 10];
                            weapons = [0];
                            break;
                        case OLDPACKETCODE.RECEIVE["11"]:
                            inGame = false;
                            break;
                        case OLDPACKETCODE.RECEIVE["17"]:
                            if (data[0]) {
                                if (data[1]) weapons = data[0];
                                else items = data[0];
                            }
                            break;
                    }
                });
                resolve(this);
            };
            this.addEventListener("error", (err) => reject(err));
        });
    } catch (error) {
        // Handle WebSocket connection error if any
    }

    if (ws) {
        loadInputValue();
        document.getElementById("speed").addEventListener("input", saveInputValue);
        document.addEventListener("keydown", handleKeydown);

        document.addEventListener("keyup", (event) => {
            if (inGame && keys[event.code] && shhk()) {
                keys[event.code] = false;
                clearInterval(intervalIds[event.code]);
            }
        });

        function handleKeydown(event) {
            if (event.keyCode === 27 && !shhk() && storeMenu.style.display !== 'block') {
                return;
            }

            if (event.keyCode === 27) {
                menuVisible = !menuVisible;
                mnu.style.display = menuVisible ? "block" : "none";
            }

            const speed = parseInt(document.getElementById("speed").value) || 110;

            if (event.keyCode === 186 && shhk()) {
                multipleTimes = !multipleTimes;
                document.getElementById('onOffIndicator').textContent = multipleTimes ? 'On' : 'Off';
                document.title = `𝙷𝚘𝚕𝚍 𝙼𝚊𝚌𝚛𝚘 ${multipleTimes ? '𝙾𝙽' : '𝙾𝙵𝙵'}`;
                console.log("Multiple Times: " + multipleTimes);
            }

            // Handle key presses for macro functionality when in-game and not in chat or alliance input
            if (inGame && shhk() && !keys[event.code]) {
                keys[event.code] = true;
                if (event.keyCode === 70) {
                    ws.iosend(OLDPACKETCODE.SEND["5"], [items[4], null]); // Spike (V)
                } else if (event.keyCode === 86) {
                    ws.iosend(OLDPACKETCODE.SEND["5"], [items[2], null]); // Trap (F)
                } else if (event.keyCode === 78) {
                    ws.iosend(OLDPACKETCODE.SEND["5"], [items[3], null]); // Mill (N)
                } else if (event.keyCode === 77) {
                    ws.iosend(OLDPACKETCODE.SEND["5"], [items[0], null]); // Food (M)
                }

                // Handle multipleTimes functionality
                if (multipleTimes) {
                    intervalIds[event.code] = setInterval(() => {
                        // Repeat the corresponding action based on the key pressed
                        if (event.keyCode === 70) {
                            ws.iosend(OLDPACKETCODE.SEND["5"], [items[4], null]);
                        } else if (event.keyCode === 86) {
                            ws.iosend(OLDPACKETCODE.SEND["5"], [items[2], null]);
                        } else if (event.keyCode === 78) {
                            ws.iosend(OLDPACKETCODE.SEND["5"], [items[3], null]);
                        } else if (event.keyCode === 77) {
                            ws.iosend(OLDPACKETCODE.SEND["5"], [items[0], null]);
                        }
                    }, speed);
                }
            }
        }
    }
})();