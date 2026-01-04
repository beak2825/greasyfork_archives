// ==UserScript==
// @name         Moomoo.io 1.8.0 Hat Macro & Interactive Menu
// @author       Seryo
// @description  Toggle Macros with "L". Macros won't work while chatting or writing on the alliance tribe input.
// @version      1.8.2
// @match        *://*.moomoo.io/*
// @namespace    https://greasyfork.org/users/1190411
// @icon         https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/521013/Moomooio%20180%20Hat%20Macro%20%20Interactive%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/521013/Moomooio%20180%20Hat%20Macro%20%20Interactive%20Menu.meta.js
// ==/UserScript==

(function () {
    var mt = 0;
    var mel = null;
    var mv = false;
    var isd = false;
    var ix;
    var iy;
    var menuElement = null;

    var hhk = {
        0: 0, 51: 0, 50: 0, 28: 0, 29: 0, 30: 0, 36: 0, 37: 0, 38: 0, 44: 0,
        35: 0, 42: 0, 43: 0, 49: 0, 57: 0, 8: 0, 2: 0, 15: 0, 5: 0, 4: 0,
        18: 0, 31: 0, 1: 0, 10: 0, 48: 0, 6: 0, 23: 0, 13: 0, 9: 0, 32: 0,
        7: 0, 22: 0, 12: 0, 26: 0, 21: 0, 46: 0, 14: 0, 11: 0, 53: 0, 20: 0,
        58: 0, 27: 0, 40: 0, 52: 0, 55: 0, 56: 0
    };

    function iso() {
        return document.activeElement.id.toLowerCase() === 'chatbox';
    }

    function iaia() {
        return document.activeElement.id.toLowerCase() === 'allianceinput';
    }

    function shhk() {
        return !iso() && !iaia();
    }

    function toggleMacros() {
        mt = (mt + 1) % 2;
        document.title = mt === 1 ? "𝙷𝚊𝚝𝚜 𝙾𝙽" : "𝙷𝚊𝚝𝚜 𝙾𝙵𝙵";

        var macroStateElement = document.getElementById("macroState");
        macroStateElement.textContent = mt === 1 ? "On" : "Off";

        if (mt === 1) {
            mel = function (e) {
                if (shhk()) {
                    for (var hatId in hhk) {
                        if (e.keyCode === hhk[hatId]) {
                            storeEquip(hatId);
                            break;
                        }
                    }
                }
            };

            document.addEventListener('keydown', mel);
        } else {
            document.removeEventListener('keydown', mel);
            mel = null;
        }
    }

    function toggleMenu() {
        var menuElement = document.getElementById('hatMacroMenu');
        if (mv) {
            menuElement.style.display = 'none';
            mv = false;
        } else {
            menuElement.style.display = 'block';
            mv = true;
        }
    }

    function dragStart(e) {
        isd = true;
        ix = e.clientX - menuElement.getBoundingClientRect().left;
        iy = e.clientY - menuElement.getBoundingClientRect().top;
    }

    function dragEnd() {
        isd = false;
    }

    function drag(e) {
        if (!isd) return;
        menuElement.style.left = (e.clientX - ix) + 'px';
        menuElement.style.top = (e.clientY - iy) + 'px';
    }

    function createMenu() {
        menuElement = document.createElement('div');
        menuElement.id = 'hatMacroMenu';
        menuElement.style.display = 'none';
        menuElement.style.background = 'rgba(0, 0, 0, 0.8)';
        menuElement.style.fontFamily = 'Hammersmith One, sans-serif';
        menuElement.style.position = 'absolute';
        menuElement.style.width = '300px';
        menuElement.style.height = '250px';
        menuElement.style.border = '1.5px solid #000';
        menuElement.style.borderRadius = '8px';
        menuElement.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 1)';
        menuElement.style.top = 'calc(20px + 2vh)';
        menuElement.style.right = 'calc(20px + 2vw)';
        menuElement.style.zIndex = '9999';
        menuElement.style.overflowY = 'auto';
        menuElement.style.color = '#fff';
        menuElement.style.fontSize = '17px !important';
        menuElement.style.boxShadow = '5px 5px 10px rgba(0, 0, 0, 0.4)';
        menuElement.style.padding = '18px';
        document.body.appendChild(menuElement);

        var ohti = {0: "No Hat",51: "Moo Cap",50: "Apple Cap",28: "Moo Head",29: "Pig Head",30: "Fluff Head",
                    36: "Pandou Head",37: "Bear Head",38: "Monkey Head",44: "Polar Head",35: "Fez Hat",42: "Enigma Hat",
                    43: "Blitz Hat",49: "Bob XIII Hat",57: "Pumpkin",8: "Bummle Hat",2: "Straw Hat",15: "Winter Cap",
                    5: "Cowboy Hat",4: "Ranger Hat",18: "Explorer Hat",31: "Flipper Hat",1: "Marksman Cap",10: "Bush Gear",
                    48: "Halo",6: "Soldier Helmet",23: "Anti Venom Gear",13: "Medic Gear",9: "Miners Helmet",32: "Musketeer Hat",
                    7: "Bull Helmet",22: "Emp Helmet",12: "Booster Hat",26: "Barbarian Armor",21: "Plague Mask",46: "Bull Mask",
                    14: "Windmill Hat",11: "Spike Gear",53: "Turret Gear",20: "Samurai Armor",58: "Dark Knight",27: "Scavenger Gear",
                    40: "Tank Gear",52: "Thief Gear",55: "Bloodthirster",56: "Assassin Gear"};

        var predefinedKeycodes = {
            "No Hat": 16,
            "Soldier Helmet": 71,
            "Bull Helmet": 82,
            "Spike Gear": 77,
            "Booster Hat": 66,
            "Winter Cap": 78,
            "Samurai Armor": 85,
            "Bearbarian Armor": 75,
            "Flipper Hat": 89,
            "Tank Gear": 90,
            "Assassin Gear": 73,
            "Turret Gear": 84
        };

        for (var hatId in ohti) {
            var input = ohti[hatId];
            var keycode = predefinedKeycodes[input];
            hhk[hatId] = keycode;
        }

        var tableHTML = `
        <h1 style="font-size: 28px !important; margin-top: 15px; text-align: center;">Hat Shortcuts <span id="macroState"">Off</span></h1>
        <hr>
        <table style="margin: 0 auto; text-align: center;">
        <tr>
            <td><b>Hats</b></td>
            <td></td>
            <td><b>Keycodes</b></td>
        </tr>`;

        var ukwii = {
            51: "https://static.wikia.nocookie.net/moom/images/a/ac/Hat_51.png",
            50: "https://static.wikia.nocookie.net/moom/images/2/2e/Hat_50.png",
            28: "https://static.wikia.nocookie.net/moom/images/5/58/Hat_28.png",
            29: "https://static.wikia.nocookie.net/moom/images/0/0d/Hat_29.png",
            30: "https://static.wikia.nocookie.net/moom/images/4/49/Hat_30.png",
            36: "https://static.wikia.nocookie.net/moom/images/4/4e/Hat_36.png",
            37: "https://static.wikia.nocookie.net/moom/images/b/bf/Hat_37.png",
            38: "https://static.wikia.nocookie.net/moom/images/b/b6/Hat_38.png",
            44: "https://static.wikia.nocookie.net/moom/images/2/21/Hat_44.png",
            35: "https://static.wikia.nocookie.net/moom/images/d/df/Hat_35.png",
            42: "https://static.wikia.nocookie.net/moom/images/9/90/Hat_42.png",
            43: "https://static.wikia.nocookie.net/moom/images/f/fb/Hat_43.png",
            49: "https://static.wikia.nocookie.net/moom/images/b/b7/Hat_49.png",
            57: "https://static.wikia.nocookie.net/moom/images/7/7c/Hat_57.png",
            8: "https://static.wikia.nocookie.net/moom/images/e/e9/Hat_8.png",
            2: "https://static.wikia.nocookie.net/moom/images/9/9b/Hat_2.png",
            15: "https://static.wikia.nocookie.net/moom/images/6/66/Hat_15.png",
            5: "https://static.wikia.nocookie.net/moom/images/5/51/Hat_5.png",
            4: "https://static.wikia.nocookie.net/moom/images/e/e8/Hat_4.png",
            18: "https://static.wikia.nocookie.net/moom/images/a/ad/Hat_18.png",
            31: "https://static.wikia.nocookie.net/moom/images/4/43/Hat_31.png",
            1: "https://static.wikia.nocookie.net/moom/images/b/b1/Hat_1.png",
            10: "https://static.wikia.nocookie.net/moom/images/9/90/Hat_10.png",
            48: "https://static.wikia.nocookie.net/moom/images/d/d4/Hat_48.png",
            6: "https://static.wikia.nocookie.net/moom/images/3/3f/Hat_6.png",
            23: "https://static.wikia.nocookie.net/moom/images/b/b1/Hat_23.png",
            13: "https://static.wikia.nocookie.net/moom/images/b/b0/Hat_13.png",
            9: "https://static.wikia.nocookie.net/moom/images/e/eb/Hat_9.png",
            32: "https://static.wikia.nocookie.net/moom/images/4/45/Hat_32.png",
            7: "https://static.wikia.nocookie.net/moom/images/f/f9/Hat_7.png",
            22: "https://static.wikia.nocookie.net/moom/images/f/fd/Hat_22.png",
            12: "https://static.wikia.nocookie.net/moom/images/3/31/Hat_12.png",
            26: "https://static.wikia.nocookie.net/moom/images/1/11/Hat_26.png",
            21: "https://static.wikia.nocookie.net/moom/images/c/c6/Hat_21.png",
            46: "https://static.wikia.nocookie.net/moom/images/3/3f/Hat_46.png",
            14: "https://static.wikia.nocookie.net/moom/images/4/42/Hat_14_P.png",
            11: "https://static.wikia.nocookie.net/moom/images/a/a3/Hat_11_P.png",
            53: "https://static.wikia.nocookie.net/moom/images/e/e8/Hat_53_P.png",
            20: "https://static.wikia.nocookie.net/moom/images/2/2a/Hat_20.png",
            58: "https://static.wikia.nocookie.net/moom/images/d/da/Hat_58.png",
            27: "https://static.wikia.nocookie.net/moom/images/8/88/Hat_27.png",
            40: "https://static.wikia.nocookie.net/moom/images/0/08/Hat_40.png",
            52: "https://static.wikia.nocookie.net/moom/images/9/9b/Hat_52.png",
            55: "https://static.wikia.nocookie.net/moom/images/0/0d/Hat_55.png",
            56: "https://static.wikia.nocookie.net/moom/images/5/53/Hat_56.png"
        };

        for (hatId in ohti) {
            input = ohti[hatId];
            keycode = hhk[hatId];
            var imagePath = ukwii[hatId];

            if (keycode === undefined) {
                keycode = "";
            }

            if (hatId === "0") {
                tableHTML += `
        <tr>
            <td>${input}</td>
            <td></td>
            <td>
                <input type="text" id="${input}Key" value="${keycode}" maxlength="3" oninput="this.value = this.value.replace(/[^0-9]/g, '')" style="width: 3em;">
                <span id="${input}KeyLabel" style="color: gray;"></span>
            </td>
        </tr>`;
            } else {

                var imageWidth = "35px";
                var imageHeight = "35px";

                tableHTML += `
        <tr>
            <td>${input}</td>
            <td><img src="${ukwii[hatId]}" alt="${input}" style="width: ${imageWidth}; height: ${imageHeight};"></td>
            <td>
                <input type="text" id="${input}Key" value="${keycode}" maxlength="3" oninput="this.value = this.value.replace(/[^0-9]/g, '')" style="width: 3em;">
                <span id="${input}KeyLabel" style="color: gray;"></span>
            </td>
        </tr>`;
            }
        }

        tableHTML += `
</tr>
</table>
<hr>
<div style="text-align: center; margin-top: 20px;">
    <button id="Save">Save</button>
</div>`;

        menuElement.innerHTML = tableHTML;

        function saveHotkeys() {
            var savedHotkeys = {};

            for (var hatId in hhk) {
                var inputField = document.getElementById(`${ohti[hatId]}Key`);
                var nkc = parseInt(inputField.value);
                savedHotkeys[hatId] = nkc;
            }

            localStorage.setItem('hhk', JSON.stringify(savedHotkeys));
        }

        function loadHotkeys() {
            var savedHotkeysStr = localStorage.getItem('hhk');
            if (savedHotkeysStr) {
                var savedHotkeys = JSON.parse(savedHotkeysStr);

                for (var hatId in savedHotkeys) {
                    hhk[hatId] = savedHotkeys[hatId];
                    var inputField = document.getElementById(`${ohti[hatId]}Key`);
                    inputField.value = savedHotkeys[hatId];
                }
            }
        }

        document.getElementById("Save").addEventListener("click", function () {
            for (var hatId in ohti) {
                var input = ohti[hatId];
                var nkc = parseInt(document.getElementById(`${input}Key`).value);
                hhk[hatId] = nkc;
                var keyLabel = document.getElementById(`${input}KeyLabel`);
                keyLabel.textContent = keyCodeToLabel(nkc);
                keyLabel.style.color = '#909090';

                var macroStateElement = document.getElementById("macroState");
                macroStateElement.style.fontSize = "28px";
            }
            saveHotkeys();
        });

        loadHotkeys();

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

        menuElement.querySelectorAll('span, td, p').forEach(element => {
            element.style.fontSize = '17px';
            element.style.color = '#fff';
        });

        menuElement.addEventListener('mousedown', dragStart);
        menuElement.addEventListener('mouseup', dragEnd);
        menuElement.addEventListener('mousemove', drag);
        document.getElementById("Save").click();

        var Save = document.getElementById("Save");
        Save.addEventListener('click', saveHotkeys);
        document.getElementById("Save").click();

    }

    createMenu();

    function saveHotkeys() {
        for (var hatId in hhk) {
            (function (currentHatId) {
                var inputField = document.getElementById("hat" + currentHatId + "Key");
                var nkc = parseInt(inputField.value);
                hhk[currentHatId] = nkc;

                document.removeEventListener('keydown', onKeydown);
                document.addEventListener('keydown', onKeydown);

                function onKeydown(e) {
                    if (e.keyCode === nkc && shhk()) {
                        storeEquip(currentHatId);
                    }
                }
            })(hatId);
        }
    }

    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 76 && !iso() && !iaia()) {
            toggleMacros();
        } else if (e.keyCode === 27 && shhk() && storeMenu.style.display !== 'block') {
            toggleMenu();
        }
    });

    var headerText = document.querySelector('h1').textContent;
    var macrosEnabled = headerText.includes('Macros On');

    if (macrosEnabled) {
        toggleMacros();
    }
})();