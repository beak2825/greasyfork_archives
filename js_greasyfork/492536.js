// ==UserScript==
// @name         MooM moD p = AUTO HEAL OFF-ON 0.2
// @namespace    none
// @version      0.2
// @description  p = AUTO HEAL OFF-ON 0.2
// @author       Pro X
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @license      MIT
// @icon         https://moomoo.io/img/favicon.png?v=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492536/MooM%20moD%20p%20%3D%20AUTO%20HEAL%20OFF-ON%2002.user.js
// @updateURL https://update.greasyfork.org/scripts/492536/MooM%20moD%20p%20%3D%20AUTO%20HEAL%20OFF-ON%2002.meta.js
// ==/UserScript==

document.getElementById("mainMenu").style.backgroundImage = "url(https://catherineasquithgallery.com/uploads/posts/2021-02/1614280275_36-p-chernii-fon-dlya-futazhei-45.png)";
document.getElementById("enterGame").innerHTML = "...Go...";
document.getElementById("enterGame").style = "text-shadow: 	#00FFFF 2px 2px 5px;";
document.getElementById("enterGame").style.color = "blue";
document.getElementById("enterGame").style.backgroundColor = "black";
document.getElementById("promoImgHolder").remove();
document.querySelector("#pre-content-container").remove(); //anti AD
document.getElementById("gameName").innerHTML = "MooM MoD";
document.getElementById('gameName').style = "text-shadow: #00CED1 2px 2px 40px;";
document.getElementById("loadingText").innerHTML = "Loading Mod..."
document.getElementById("loadingText").style = "text-shadow: 	#00FFFF 2px 2px 15px;";

(function () {
    let ahsp = parseInt(localStorage.getItem('autoHealSpeed')) || 125;
    let ahth = parseInt(localStorage.getItem('autoHealThreshold')) || 86;
    let ahrp = parseInt(localStorage.getItem('autoHealRepeat')) || 2;
    let ahtky = parseInt(localStorage.getItem('autoHealToggleKey')) || 80;
    let ahen = true;
    let items = [];
    let weapons = [];
    let inGame = false;
    let tmpHealth = 100;
    let sTime = 0;
    let sCount = 0;
    let msgpack = window.msgpack;
    let ws;
    let lkps = 1;
    let menuOpen = false;

    function keyCodeToLabel(keyCode) {
        const keyMap = {
            3: 'Cancel', 8: 'Backspace', 9: 'Tab', 12: 'Clear', 13: 'Enter', 16: 'Shift', 160: 'Shift', 17: 'Control', 161: 'Control',
            18: 'Alt', 162: 'Alt', 19: 'Pause', 20: 'Caps Lock', 21: 'Unidentified', 25: 'Unidentified', 27: 'Escape', 28: 'Henkan',
            29: 'Muhenkan', 32: '(blank space)', 33: 'PageUp', 34: 'PageDown', 35: 'End', 36: 'Home', 37: 'ArrowLeft', 38: 'ArrowUp',
            39: 'ArrowRight', 40: 'ArrowDown', 41: 'Select', 42: 'Print', 43: 'Execute', 44: 'F13', 45: 'Insert', 46: 'Delete',
            47: 'Help', 48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9', 58: ':', 59: ';',
            60: '<', 61: '=', 63: 'ß', 64: '@', 65: 'A', 66: 'B', 67: 'C', 68: 'D', 69: 'E', 70: 'F', 71: 'G', 72: 'H', 73: 'I',
            74: 'J', 75: 'K', 76: 'L', 77: 'M', 78: 'N', 79: 'O', 80: 'P', 81: 'Q', 82: 'R', 83: 'S', 84: 'T', 85: 'U', 86: 'V',
            87: 'W', 88: 'X', 89: 'Y', 90: 'Z', 91: 'Meta', 224: 'Meta', 92: 'Meta', 225: 'AltGraph', 93: 'ContextMenu', 95: 'Standby',
            96: '0', 97: '1', 98: '2', 99: '3', 100: '4', 101: '5', 102: '6', 103: '7', 104: '8', 105: '9', 106: '*', 107: '+',
            108: ',', 109: '-', 110: '.', 111: '/', 112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6', 118: 'F7', 119: 'F8',
            120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12', 124: 'F13', 125: 'F14', 126: 'F15', 127: 'F16', 128: 'F17', 129: 'F18',
            130: 'F19', 131: 'F20', 132: 'F21', 133: 'F22', 134: 'F23', 135: 'F24', 136: 'F25', 137: 'F26', 138: 'F27', 139: 'F28',
            140: 'F29', 141: 'F30', 142: 'F31', 143: 'F32', 144: 'NumLock', 145: 'ScrollLock', 151: 'Airplane Mode', 161: 'Volume Mute',
            162: 'Volume Down', 163: 'Volume Up', 186: ';', 187: '=', 188: ',', 189: '-', 190: '.', 191: '/', 192: '`', 193: '/',
            219: '[', 220: '\\', 221: ']', 222: "'", 223: '`', 224: 'Meta', 225: 'AltGraph', 226: '\\', 229: 'Non-conversion',
            230: 'Alphanumeric', 231: 'Hiragana/Katakana', 233: 'Zenkaku/Hankaku', 234: 'Kanji Mode', 240: 'WakeUp', 255: 'WakeUp',
            default: '',
        };

        return keyMap[keyCode] || '';
    }

    function shouldHandleHotkeys() {
        return document.activeElement.id.toLowerCase() !== 'chatbox' && document.activeElement.id.toLowerCase() !== 'allianceinput';
    }

    document.addEventListener('keydown', (e) => {
        if (e.keyCode === 27 && shouldHandleHotkeys() && storeMenu.style.display !== 'block') {
            toggleMenu();
        }
    });

    ws = new Promise(function (resolve) {
        let { send } = WebSocket.prototype;
        WebSocket.prototype.send = function (...x) {
            send.apply(this, x);
            this.send = send;
            this.io = function (...datas) {
                const [packet, ...data] = datas;
                this.send(new Uint8Array(Array.from(msgpack.encode([packet, data]))));
            };
            this.addEventListener("message", function (e) {
                const [packet, data] = msgpack.decode(new Uint8Array(e.data));
                let sid = data[0];
                let health = data[1];
                let inventory = {
                    food: items[0],
                    walls: items[1],
                    spikes: items[2],
                    mill: items[3],
                    mine: items[4],
                    trap: items[5],
                    booster: items[6],
                    turret: items[7],
                    watchtower: items[8], //100
                    buff: items[9],
                    spawn: items[10],
                    sapling: items[11],
                    blocker: items[12],
                    teleporter: items[13]
                };
                let addEventListener = {
                    setupGame: "C",
                    updateHealth: "O",
                    killPlayer: "P",
                    updateItems: "V"
                };
                switch (packet) {
                    case addEventListener.setupGame:
                        inGame = true;
                        items = [0, 3, 6, 10];
                        weapons = [0];
                        break;
                    case addEventListener.updateHealth:
                        if (sid) {
                            const AUTOHEAL_SPEED = parseInt(document.getElementById('speedInput').value);
                            if (inGame && ahen && health < ahth && health > 0) {
                                setTimeout(function () {
                                    for (let i = 0; i < ahrp; i++) {
                                        place(inventory.food);
                                    }
                                }, AUTOHEAL_SPEED);
                            }
                            if (tmpHealth - health < 0) {
                                if (sTime) {
                                    let timeHit = Date.now() - sTime;
                                    sTime = 0;
                                    sCount = timeHit <= 120 ? sCount + 1 : Math.max(0, sCount - 2);
                                }
                            } else {
                                sTime = Date.now();
                            }
                            tmpHealth = health;
                        }
                        break;
                    case addEventListener.killPlayer:
                        inGame = false;
                        break;
                    case addEventListener.updateItems:
                        if (sid) {
                            if (health) {
                                weapons = sid;
                            } else {
                                items = sid;
                            }
                        }
                        break;
                }
            });
            resolve(this);
        };
    });

    const sendPacket = function (...datas) {
        const [type, ...data] = datas;
        var binary = msgpack.encode([type, data]);
        ws.then(function (wsInstance) {
            wsInstance.send(new Uint8Array(Array.from(binary)));
        });
    };

    const place = function (id, ang) {
        if (inGame) {
            sendPacket("G", id, false);
            hit(ang);
            selectWeapon();
        }
    };

    const selectWeapon = function () {
        if (inGame) {
            const selectedWeapon = (lkps === 1) ? weapons[0] : weapons[1];
            sendPacket("G", selectedWeapon, true);
        }
    };

    const hit = function (id, ang) {
        if (inGame) {
            sendPacket("d", 1, ang);
            sendPacket("d", 0, ang);
        }
    };

    document.addEventListener("keydown", function (event) {
        if (event.key === "1" || event.key === "2") {
            lkps = parseInt(event.key);
        }

        if (event.keyCode === ahtky && shouldHandleHotkeys()) {
            ahen = !ahen;
            updateInnerHTML();
            document.title = ahen ? "𝙷𝚎𝚊𝚕 𝙾𝙽" : "𝙷𝚎𝚊𝚕 𝙾𝙵𝙵";
            console.log("AutoHeal is now " + (ahen ? "ON" : "OFF"));
        }
    });

    let modMenus = document.createElement("div");
    modMenus.id = "modMenus";
    document.body.append(modMenus);
    modMenus.style.display = 'none';
    modMenus.style.background = 'rgba(0, 0, 0, 0.8';
    modMenus.style.fontFamily = 'Hammersmith One, sans-serif';
    modMenus.style.position = 'fixed';
    modMenus.style.top = '20px';
    modMenus.style.left = '20px';
    modMenus.style.border = '1px solid #000';
    modMenus.style.borderRadius = '8px';
    modMenus.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.25)';
    modMenus.style.boxShadow = '5px 5px 10px rgba(0, 0, 0, 0.4)';
    modMenus.style.width = '216px';
    modMenus.style.color = '#fff';
    modMenus.style.fontSize = '17px';
    modMenus.style.zIndex = '1000';
    modMenus.style.overflowY = 'auto';
    modMenus.style.padding = '10px';

    function addRealtimeUpdate() {
        function addLimit(input, maxDigits, allowNegative = false) {
            input.addEventListener("input", function () {
                let value = input.value.replace(/[^\d-]/g, '');
                if (!allowNegative) {
                    value = value.replace('-', '');
                }
                input.value = value.slice(0, maxDigits);
                updateKeyLabel();
            });
        }

        addLimit(getEl("speedInput"), 4);
        addLimit(getEl("thresholdInput"), 3);
        addLimit(getEl("repeatInput"), 2);
        addLimit(getEl("tgki"), 3);
    }

    function updateKeyLabel() {
        const tgki = getEl("tgki");
        const toggleKeyLabel = keyCodeToLabel(parseInt(tgki.value));
        getEl("toggleKeyLabel").textContent = toggleKeyLabel;
    }

    function saveValues() {
        localStorage.setItem('autoHealSpeed', ahsp);
        localStorage.setItem('autoHealThreshold', ahth);
        localStorage.setItem('autoHealRepeat', ahrp);
        localStorage.setItem('autoHealToggleKey', ahtky);
    }

    function updateInnerHTML() {
        const tgki = getEl("tgki");
        const toggleKeyLabel = keyCodeToLabel(ahtky);

        modMenus.innerHTML = `<h2 style="text-align: center; font-size: 28px; color: white;">AutoHeal <span>${ahen ? 'On!' : 'Off!'}</span></h2>
  <hr>
  <label for="thresholdInput" style="color: white;">HP Umbral</label>
  <input type="number" id="thresholdInput" style="width: 38px;" oninput="this.value = this.value.slice(0, 3)" onkeypress="return event.charCode >= 48 && event.charCode <= 57" value=${ahth}>
  <span id="thresholdValue" style="color: gray;">${ahth}</span>
  <hr>
  <label for="speedInput" style="color: white;">Speed</label>
  <input type="number" id="speedInput" style="width: 51px;" oninput="this.value = this.value.slice(0, 4)" onkeypress="return event.charCode >= 48 && event.charCode <= 57" value=${ahsp}>
  <span id="speedValue" style="color: gray;">${ahsp}</span>
  <hr>
  <label for="repeatInput" style="color: white;">Multiplier</label>
  <input type="number" id="repeatInput" style="width: 36px;" oninput="this.value = this.value.slice(0, 2)" onkeypress="return event.charCode >= 48 && event.charCode <= 57" value=${ahrp}>
  <span id="repeatValue" style="color: gray;">${ahrp}</span>
  <hr>
  <label for="tgki" style="color: white;">Toggle Keycode</label>
    <input type="text" id="tgki" style="width: 44px;" oninput="this.value = this.value.replace(/\D/g, '').slice(0, 3);" value="${ahtky}">
    <span id="toggleKeyLabel" style="color: gray;">${toggleKeyLabel}</span>
  </div>
  <hr>
  <button id="saveButton" style="margin-top: 10px; display: block; margin: auto;">Save</button>`;

        getEl("saveButton").addEventListener("click", function () {
            savePartialValues();
            saveValues();
            updateValuesDisplay();
        });

        addRealtimeUpdate();
    }

    function updateValuesDisplay() {
        const tgki = getEl("tgki");
        const toggleKeyLabel = keyCodeToLabel(ahtky);

        getEl("thresholdValue").textContent = ahth;
        getEl("speedValue").textContent = ahsp;
        getEl("repeatValue").textContent = ahrp;
        getEl("toggleKeyLabel").textContent = toggleKeyLabel;
    }

    updateInnerHTML();

    getEl("speedInput").value = ahsp;
    getEl("thresholdInput").value = ahth;
    getEl("repeatInput").value = ahrp;
    getEl("tgki").value = ahtky;

    function getEl(id) {
        return document.getElementById(id);
    }

    function savePartialValues() {
        ahsp = parseInt(getEl("speedInput").value) || 125;
        ahth = parseInt(getEl("thresholdInput").value) || 86;
        ahrp = parseInt(getEl("repeatInput").value) || 2;
        ahtky = parseInt(getEl("tgki").value) || 80;

        const toggleKeyLabel = keyCodeToLabel(ahtky);
        getEl("toggleKeyLabel").textContent = toggleKeyLabel;

        localStorage.setItem('autoHealSpeed', ahsp);
        localStorage.setItem('autoHealThreshold', ahth);
        localStorage.setItem('autoHealRepeat', ahrp);
        localStorage.setItem('autoHealToggleKey', ahtky);
    }

    function saveValueToLocalStorage(inputId, localStorageKey) {
        getEl(inputId).addEventListener("change", function () {
            const value = parseInt(getEl(inputId).value);
            localStorage.setItem(localStorageKey, value);
        });
    }

    saveValueToLocalStorage("speedInput", 'autoHealSpeed');
    saveValueToLocalStorage("thresholdInput", 'autoHealThreshold');
    saveValueToLocalStorage("repeatInput", 'autoHealRepeat');
    saveValueToLocalStorage("tgki", 'autoHealToggleKey');

    updateInnerHTML();

})();

