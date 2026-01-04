// ==UserScript==
// @name         Tasty Mod, AUTOHEAL P = Off - ON N = Auto triple Mill F = TRAP 0.6
// @name:ru      Вкусный мод P = выключить и включить авто исцеление N = автоматические тройные мельницы F = ЛОВУШКА
// @namespace    none
// @version      0.6
// @description  P = Off - ON N = Auto triple Mill F = TRAP
// @description:ru  P = выключить и включить авто исцеление N = автоматические тройные мельницы F = ЛОВУШКА
// @author       Pro X
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @license      MIT
// @icon         http://mtdata.ru/u1/photo9B28/20268926972-0/original.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492230/Tasty%20Mod%2C%20AUTOHEAL%20P%20%3D%20Off%20-%20ON%20N%20%3D%20Auto%20triple%20Mill%20F%20%3D%20TRAP%2006.user.js
// @updateURL https://update.greasyfork.org/scripts/492230/Tasty%20Mod%2C%20AUTOHEAL%20P%20%3D%20Off%20-%20ON%20N%20%3D%20Auto%20triple%20Mill%20F%20%3D%20TRAP%2006.meta.js
// ==/UserScript==



document.getElementById("diedText").innerHTML = "You're all dead!";
document.getElementById("diedText").style = "height: auto; width: 1000px;";
document.getElementById("diedText").style.color = "red";
document.title = "Tasty Mod";
document.getElementById("leaderboard").append("Testy Mod");
document.getElementById("gameName").innerHTML = "Testy Mod";
document.getElementById("enterGame").style.backgroundColor = "black";
document.getElementById("ageBar").style.backgroundColor = "gray";
document.getElementById("leaderboard").style.color = "black"
document.getElementById("leaderboard").style.border = "2px solid black";
//rainbow code
    let name = document.getElementById("nameInput");
    let name2 = 0;

    function updatenameInputColor() {
        name.style.backgroundColor = `hsl(${name2}, 100%, 50%)`;
        name2 = (name2 + 1) % 360;
    }

    let intervalnameInputId = setInterval(updatenameInputColor, 50);

$('#gameName').css({
	'color': 'purple',
	'text-shadow': 'rgba(111, 5, 149, 1)',
	'text-align': 'center',
	'font-size': '130px',
	'margin-bottom': '20px'
});

document.getElementById("enterGame").innerText = " → Go Play ←";



document.getElementById("mainMenu").style.backgroundImage = "url()";
$("#mapDisplay").css({
	background: `url('https://i.imgur.com/fgFsQJp.png')`
});


    let foodDisplay = document.getElementById("foodDisplay").style.color = "red";
    let woodDisplay = document.getElementById("woodDisplay").style.color = "green";
    let stoneDisplay = document.getElementById("stoneDisplay").style.color = "gray";
    let scoreDisplay = document.getElementById("scoreDisplay").style.color = "yellow";
(function () {
    let ahsp = parseInt(localStorage.getItem('autoHealSpeed')) || 100;
    let ahth = parseInt(localStorage.getItem('autoHealThreshold')) || 91;
    let ahrp = parseInt(localStorage.getItem('autoHealRepeat')) || 2;
    let ahtky = parseInt(localStorage.getItem('autoHealToggleKey')) || 90;
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
        ahsp = parseInt(getEl("speedInput").value) || 100;
        ahth = parseInt(getEl("thresholdInput").value) || 91;
        ahrp = parseInt(getEl("repeatInput").value) || 2;
        ahtky = parseInt(getEl("tgki").value) || 90;

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

document.getElementById("promoImgHolder").remove();
document.querySelector("#pre-content-container").remove(); //ANTI AD

(() => {
    let ws = null;
    let x = 0;
    let y = 0;
    let msgpack5 = window.msgpack;
    let scale = 45;
    let placeOffset = 5;
    let autoMill = false;
    let moreMill = false;
    let morespike = false
    let Allplayers = [];
    let players = [];
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



    const join = message => Array.isArray(message) ? [...message] : [...message];


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


            if (y !== myPlayer.y || x !== myPlayer.x) {

                if (autoMill) {
                    let angle = Math.atan2(y - myPlayer.y, x - myPlayer.x);
                    place(inventory.mill, angle + Math.PI / 2.6);
                    place(inventory.mill);
                    place(inventory.mill, angle - Math.PI / 2.6);
                }
                x = myPlayer.x;
                y = myPlayer.y;
            }
            if(morespike){
                place(inventory.trap);
            }
        }
        cacheItems();
    }

    const emit = (event, a, b, c, m, r) => ws.send(Uint8Array.from([...msgpack5.encode([event, [a, b, c, m, r]])]));


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


    const chat = event => emit("6", event);


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

    document.addEventListener("keydown", event => {
        if (event.keyCode === 78 && document.activeElement.id.toLowerCase() !== 'chatbox') {//M
            autoMill = !autoMill;
        }
        if (event.keyCode === 70 && document.activeElement.id.toLowerCase() !== 'chatbox'){//f
            morespike = true;
        }
    });
    document.addEventListener("keyup", event => {
        if (event.keyCode === 70 && document.activeElement.id.toLowerCase() !== 'chatbox'){//f
            morespike = false;
        }
    });

    document.msgpack = window.msgpack;
    WebSocket.prototype.oldSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (event) {
        ws || (document.ws = this, ws = this, document.ws.addEventListener("message", hookWS));
        this.oldSend(event);
    };
})();
//soon instakill????????????????????????????????????????????????????????????????????????????????