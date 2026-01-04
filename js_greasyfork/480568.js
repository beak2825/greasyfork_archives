// ==UserScript==
// @name         Moomoo.io Public AutoMacroMod
// @author       T h e S l a u g h t e r h o u s e
// @description  Best Legit moomoo.io script for 1.8.0
// @version      V1
// @match        *://*.moomoo.io/*
// @match        *://*sandbox.moomoo.io/*
// @namespace    https://greasyfork.org/users/1190411
// @icon         https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/480568/Moomooio%20Public%20AutoMacroMod.user.js
// @updateURL https://update.greasyfork.org/scripts/480568/Moomooio%20Public%20AutoMacroMod.meta.js
// ==/UserScript==

localStorage.moofoll = !0;

(function () {
    var mt = 0;
    var mel = null;
    var mv = false;
    var isd = false;
    var ix;
    var iy;
    var menuElement = null;

    var hhk = {
    0: 0, //unnequip hat
    51: 0,// Moo Cap
    50: 0, // Apple Cap
    28: 0, // Moo Head
    29: 0, // Pig Head
    30: 0, // Fluff Head
    36: 0, // Pandou Head
    37: 0, // Bear Head
    38: 0, // Monkey Head
    44: 0, // Polar Head
    35: 0, // Fez Hat
    42: 0, // Enigma Hat
    43: 0, // Blitz Hat
    49: 0, // Bob XIII Hat
    57: 0, // Pumpkin
    8: 0, // Bummle Hat
    2: 0, // Straw Hat
    15: 0, // Winter Cap
    5: 0, // Cowboy Hat
    4: 0, // Ranger Hat
    18: 0, // Explorer Hat
    31: 0, // Flipper Hat
    1: 0, // Marksman Cap
    10: 0, // Bush Gear
    48: 0, // Halo
    6: 0, // Soldier Helmet
    23: 0, // Anti Venom Gear
    13: 0, // Medic Gear
    9: 0, // Miners Helmet
    32: 0, // Musketeer Hat
    7: 0, // Bull Helmet
    22: 0, // Emp Helmet
    12: 0, // Booster Hat
    26: 0, // Barbarian Armor
    21: 0, // Plague Mask
    46: 0, // Bull Mask
    14: 0, // Windmill Hat
    11: 0, // Spike Gear
    53: 0, // Turret Gear
    20: 0, // Samurai Armor
    58: 0, // Dark Knight
    27: 0, // Scavenger Gear
    40: 0, // Tank Gear
    52: 0, // Thief Gear
    55: 0, // Bloodthirster
    56: 0 // Assassin Gear
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
        document.title = mt === 1 ? "AutoMacroMod" : "AutoMacroMod";

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

var hti = {
    0: "No Hat",
    51: "Moo Cap",
    50: "Apple Cap",
    28: "Moo Head",
    29: "Pig Head",
    30: "Fluff Head",
    36: "Pandou Head",
    37: "Bear Head",
    38: "Monkey Head",
    44: "Polar Head",
    35: "Fez Hat",
    42: "Enigma Hat",
    43: "Blitz Hat",
    49: "Bob XIII Hat",
    57: "Pumpkin",
    8: "Bummle Hat",
    2: "Straw Hat",
    15: "Winter Cap",
    5: "Cowboy Hat",
    4: "Ranger Hat",
    18: "Explorer Hat",
    31: "Flipper Hat",
    1: "Marksman Cap",
    10: "Bush Gear",
    48: "Halo",
    6: "Soldier Helmet",
    23: "Anti Venom Gear",
    13: "Medic Gear",
    9: "Miners Helmet",
    32: "Musketeer Hat",
    7: "Bull Helmet",
    22: "Emp Helmet",
    12: "Booster Hat",
    26: "Barbarian Armor",
    21: "Plague Mask",
    46: "Bull Mask",
    14: "Windmill Hat",
    11: "Spike Gear",
    53: "Turret Gear",
    20: "Samurai Armor",
    58: "Dark Knight",
    27: "Scavenger Gear",
    40: "Tank Gear",
    52: "Thief Gear",
    55: "Bloodthirster",
    56: "Assassin Gear"
};

var ohti = {
    0: "No Hat",
    51: "Moo Cap",
    50: "Apple Cap",
    28: "Moo Head",
    29: "Pig Head",
    30: "Fluff Head",
    36: "Pandou Head",
    37: "Bear Head",
    38: "Monkey Head",
    44: "Polar Head",
    35: "Fez Hat",
    42: "Enigma Hat",
    43: "Blitz Hat",
    49: "Bob XIII Hat",
    57: "Pumpkin",
    8: "Bummle Hat",
    2: "Straw Hat",
    15: "Winter Cap",
    5: "Cowboy Hat",
    4: "Ranger Hat",
    18: "Explorer Hat",
    31: "Flipper Hat",
    1: "Marksman Cap",
    10: "Bush Gear",
    48: "Halo",
    6: "Soldier Helmet",
    23: "Anti Venom Gear",
    13: "Medic Gear",
    9: "Miners Helmet",
    32: "Musketeer Hat",
    7: "Bull Helmet",
    22: "Emp Helmet",
    12: "Booster Hat",
    26: "Barbarian Armor",
    21: "Plague Mask",
    46: "Bull Mask",
    14: "Windmill Hat",
    11: "Spike Gear",
    53: "Turret Gear",
    20: "Samurai Armor",
    58: "Dark Knight",
    27: "Scavenger Gear",
    40: "Tank Gear",
    52: "Thief Gear",
    55: "Bloodthirster",
    56: "Assassin Gear"
};

var predefinedKeycodes = {
    "No Hat": 16,
    "Bull Helmet": 82,
    "Tank Gear": 90,
    "Soldier Helmet": 71,
    "Booster Hat": 66,
    "Flipper Hat": 89,
    "Winter Cap": 78,
    "Emp Helmet": 74,
    "Fluff Head": 73,
    "Turret Gear": 84,
    "Barbarian Armor": 77,
    "Samurai Armor": 85,
    "Spike Gear": 72
};

for (var hatId in hti) {
    var input = hti[hatId];
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

        for (hatId in hti) {
    input = hti[hatId];
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
        var inputField = document.getElementById(`${hti[hatId]}Key`);
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
            var inputField = document.getElementById(`${hti[hatId]}Key`);
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
    var label = '';
    switch (keyCode) {
        case 3:
            label = 'Cancel';
            break;
        case 8:
            label = 'Backspace';
            break;
        case 9:
            label = 'Tab';
            break;
        case 12:
            label = 'Clear';
            break;
        case 13:
            label = 'Enter';
            break;
        case 16:
        case 160:
            label = 'Shift';
            break;
        case 17:
        case 161:
            label = 'Control';
            break;
        case 18:
        case 162:
            label = 'Alt';
            break;
        case 19:
            label = 'Pause';
            break;
        case 20:
            label = 'Caps Lock';
            break;
        case 21:
            label = 'Unidentified';
            break;
        case 25:
            label = 'Unidentified';
            break;
        case 27:
            label = 'Escape';
            break;
        case 28:
            label = 'Henkan';
            break;
        case 29:
            label = 'Muhenkan';
            break;
        case 32:
            label = '(blank space)';
            break;
        case 33:
            label = 'PageUp';
            break;
        case 34:
            label = 'PageDown';
            break;
        case 35:
            label = 'End';
            break;
        case 36:
            label = 'Home';
            break;
        case 37:
            label = 'ArrowLeft';
            break;
        case 38:
            label = 'ArrowUp';
            break;
        case 39:
            label = 'ArrowRight';
            break;
        case 40:
            label = 'ArrowDown';
            break;
        case 41:
            label = 'Select';
            break;
        case 42:
            label = 'Print';
            break;
        case 43:
            label = 'Execute';
            break;
        case 44:
            label = 'F13';
            break;
        case 45:
            label = 'Insert';
            break;
        case 46:
            label = 'Delete';
            break;
        case 47:
            label = 'Help';
            break;
        case 48:
            label = '0';
            break;
        case 49:
            label = '1';
            break;
        case 50:
            label = '2';
            break;
        case 51:
            label = '3';
            break;
        case 52:
            label = '4';
            break;
        case 53:
            label = '5';
            break;
        case 54:
            label = '6';
            break;
        case 55:
            label = '7';
            break;
        case 56:
            label = '8';
            break;
        case 57:
            label = '9';
            break;
        case 58:
            label = ':';
            break;
        case 59:
            label = ';';
            break;
        case 60:
            label = '<';
            break;
        case 61:
            label = '=';
            break;
        case 63:
            label = 'ß';
            break;
        case 64:
            label = '@';
            break;
        case 65:
            label = 'a';
            break;
        case 66:
            label = 'b';
            break;
        case 67:
            label = 'c';
            break;
        case 68:
            label = 'd';
            break;
        case 69:
            label = 'e';
            break;
        case 70:
            label = 'f';
            break;
        case 71:
            label = 'g';
            break;
        case 72:
            label = 'h';
            break;
        case 73:
            label = 'i';
            break;
        case 74:
            label = 'j';
            break;
        case 75:
            label = 'k';
            break;
        case 76:
            label = 'l';
            break;
        case 77:
            label = 'm';
            break;
        case 78:
            label = 'n';
            break;
        case 79:
            label = 'o';
            break;
        case 80:
            label = 'p';
            break;
        case 81:
            label = 'q';
            break;
        case 82:
            label = 'r';
            break;
        case 83:
            label = 's';
            break;
        case 84:
            label = 't';
            break;
        case 85:
            label = 'u';
            break;
        case 86:
            label = 'v';
            break;
        case 87:
            label = 'w';
            break;
        case 88:
            label = 'x';
            break;
        case 89:
            label = 'y';
            break;
        case 90:
            label = 'z';
            break;
        case 91:
        case 224:
            label = 'Meta';
            break;
        case 92:
        case 225:
            label = 'Meta';
            break;
        case 93:
            label = 'ContextMenu';
            break;
        case 95:
            label = 'Standby';
            break;
        case 96:
            label = '0';
            break;
        case 97:
            label = '1';
            break;
        case 98:
            label = '2';
            break;
        case 99:
            label = '3';
            break;
        case 100:
            label = '4';
            break;
        case 101:
            label = '5';
            break;
        case 102:
            label = '6';
            break;
        case 103:
            label = '7';
            break;
        case 104:
            label = '8';
            break;
        case 105:
            label = '9';
            break;
        case 106:
            label = '*';
            break;
        case 107:
            label = '+';
            break;
        case 108:
            label = ',';
            break;
        case 109:
            label = '-';
            break;
        case 110:
            label = '.';
            break;
        case 111:
            label = '/';
            break;
        case 112:
            label = 'F1';
            break;
        case 113:
            label = 'F2';
            break;
        case 114:
            label = 'F3';
            break;
        case 115:
            label = 'F4';
            break;
        case 116:
            label = 'F5';
            break;
        case 117:
            label = 'F6';
            break;
        case 118:
            label = 'F7';
            break;
        case 119:
            label = 'F8';
            break;
        case 120:
            label = 'F9';
            break;
        case 121:
            label = 'F10';
            break;
        case 122:
            label = 'F11';
            break;
        case 123:
            label = 'F12';
            break;
        case 124:
            label = 'F13';
            break;
        case 125:
            label = 'F14';
            break;
        case 126:
            label = 'F15';
            break;
        case 127:
            label = 'F16';
            break;
        case 128:
            label = 'F17';
            break;
        case 129:
            label = 'F18';
            break;
        case 130:
            label = 'F19';
            break;
        case 131:
            label = 'F20';
            break;
        case 132:
            label = 'F21';
            break;
        case 133:
            label = 'F22';
            break;
        case 134:
            label = 'F23';
            break;
        case 135:
            label = 'F24';
            break;
        case 136:
            label = 'F25';
            break;
        case 137:
            label = 'F26';
            break;
        case 138:
            label = 'F27';
            break;
        case 139:
            label = 'F28';
            break;
        case 140:
            label = 'F29';
            break;
        case 141:
            label = 'F30';
            break;
        case 142:
            label = 'F31';
            break;
        case 143:
            label = 'F32';
            break;
        case 144:
            label = 'NumLock';
            break;
        case 145:
            label = 'ScrollLock';
            break;
        case 151:
            label = 'Airplane Mode';
            break;
        case 161:
            label = 'Volume Mute';
            break;
        case 162:
            label = 'Volume Down';
            break;
        case 163:
            label = 'Volume Up';
            break;
        case 186:
            label = ';';
            break;
        case 187:
            label = '=';
            break;
        case 188:
            label = ',';
            break;
        case 189:
            label = '-';
            break;
        case 190:
            label = '.';
            break;
        case 191:
            label = '/';
            break;
        case 192:
            label = '`';
            break;
        case 193:
            label = '/';
            break;
        case 219:
            label = '[';
            break;
        case 220:
            label = '\\';
            break;
        case 221:
            label = ']';
            break;
        case 222:
            label = "'";
            break;
        case 223:
            label = '`';
            break;
        case 224:
            label = 'Meta';
            break;
        case 225:
            label = 'AltGraph';
            break;
        case 226:
            label = '\\';
            break;
        case 229:
            label = 'Non-conversion';
            break;
        case 230:
            label = 'Alphanumeric';
            break;
        case 231:
            label = 'Hiragana/Katakana';
            break;
        case 233:
            label = 'Zenkaku/Hankaku';
            break;
        case 234:
            label = 'Kanji Mode';
            break;
        case 240:
            label = 'WakeUp';
            break;
        case 255:
            label = 'WakeUp';
            break;
        default:
            label = '';
    }
    return label;
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
(() => {
  // Constants and Variables
  let ws = null;
  let x = 0;
  let y = 0;
  let msgpack5 = window.msgpack;
  let scale = 45;
  let placeOffset = 5;
  let autoMill = false;
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
      if (y !== myPlayer.y || x !== myPlayer.x) {
        // AUTO MILL CODE:
        if (Math.atan2(y - myPlayer.y, x - myPlayer.x) < (scale + placeOffset) * 2) {
          if (autoMill) {
            let angle = Math.atan2(y - myPlayer.y, x - myPlayer.x);
            place(inventory.mill, angle + Math.PI / 2.5);
            place(inventory.mill, angle);
            place(inventory.mill, angle - Math.PI / 2.5);
          }
          x = myPlayer.x;
          y = myPlayer.y;
        }
      }
      cacheItems();
    }
  };
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

  /**
   * Function to send a chat message
   * @param {string} event - The chat message
   */
  const chat = event => emit("6", event);

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
    for (let g = 29; g < 31; g++) {
      var _document$getElementB10;
      if (((_document$getElementB10 = document.getElementById(`actionBarItem${g}`)) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.offsetParent) !== null && g !== 36) {
        inventory.turret = g - 16;
      }
    }
    inventory.spawnpad = 36;
  };

  // Override WebSocket's send method
  document.msgpack = window.msgpack;
  WebSocket.prototype.oldSend = WebSocket.prototype.send;
  WebSocket.prototype.send = function (event) {
    ws || (document.ws = this, ws = this, document.ws.addEventListener("message", hookWS));
    this.oldSend(event);
  };

  // Event listener for [M] key to toggle autoMill
  document.addEventListener("keydown", event => {
    if (event.keyCode === 77 && document.activeElement.id.toLowerCase() !== 'chatbox') {
      autoMill = !autoMill;
      chat(`Auto Triple Mill : ${autoMill ? 'enabled' : 'disabled'}`);
    }
  });
})();
(function () {
  // Variables
  let AUTO_HEAL_SPEED = 120;
  let AUTO_HEAL_ENABLED = true;
  let items = [];
  let weapons = [];
  let inGame = false;
  let tmpHealth = 100;
  let sTime = 0;
  let sCount = 0;
  let msgpack = window.msgpack;
  let ws;
  // WebSocket setup
  ws = new Promise(function (resolve) {
    let {
      send
    } = WebSocket.prototype;
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
          watchtower: items[8],
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
              if (inGame && AUTO_HEAL_ENABLED) {
                if (health < 100 && health > 0) {
                  setTimeout(function () {
                    place(inventory.food);
                    place(inventory.food);
                    place(inventory.food);
                    place(inventory.food);
                  }, AUTOHEAL_SPEED);
                }
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

  // Functions
  const sendPacket = function (...datas) {
    const [type, ...data] = datas;
    var binary = msgpack.encode([type, data]);
    ws.then(function (wsInstance) {
      wsInstance.send(new Uint8Array(Array.from(binary)));
    });
  };

  // PLACE
  const place = function (id, ang) {
    if (inGame) {
      sendPacket("G", id, false);
      hit(ang);
      selectWeapon();
    }
  };

  // SELECT WEAPON
  const selectWeapon = function () {
    if (inGame) {
      sendPacket("G", weapons[0], true);
    }
  };

  // HIT
  const hit = function (id, ang) {
    if (inGame) {
      sendPacket("d", 1, ang);
      sendPacket("d", 0, ang);
    }
  };
  // CHAT
  const chat = function (e) {
    if (inGame) {
      sendPacket("6", e);
    }
  };

  // SCRIPT MENU:
  let modMenus = document.createElement("div");
  modMenus.id = "modMenus";
  document.body.append(modMenus);
  modMenus.style.display = "block";
  modMenus.style.padding = "10px";
  modMenus.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
  modMenus.style.borderRadius = "4px";
  modMenus.style.position = "absolute";
  modMenus.style.left = "20px";
  modMenus.style.top = "20px";
  modMenus.style.minWidth = "300px";
  modMenus.style.maxWidth = "290px";
  modMenus.style.minHeight = "400";
  modMenus.style.maxHeight = "700";
  function updateInnerHTML() {
    modMenus.innerHTML = `<h2 style="text-align: center; font-size: 28px;">Auto Heal <span ></span></h2>
    <hr>
    <label for="speedInput">Speed</label>
    <input type="number" id="speedInput" oninput="this.value = this.value.slice(0, 4)" value=${AUTO_HEAL_SPEED}>
    <span id="speedValue"></span>
    <hr>
    <input type="checkbox" checked id="AUTO_HEAL">
    Auto Heal
    <br>`;
  }
  updateInnerHTML();
  // THIS IS HOW SCRIPT MENU IS ON/OFF:
  function getEl(id) {
    return document.getElementById(id);
  }

  // PART OF SCRIPT MENU:
  getEl("AUTO_HEAL").onclick = function () {
    AUTO_HEAL_ENABLED = !AUTO_HEAL_ENABLED;
    chat(`Auto Heal : ${AUTO_HEAL_ENABLED ? 'enabled' : 'disabled'}`);
  };
  getEl("speedInput").oninput = function () {
    chat(`Auto Heal Speed : ${getEl("speedInput").value}`);
  };
})();

function Xh() {
    Un.onclick = C.checkTrusted(function() {
        ms("Connecting..."),
            cs() ? bs() : Oh()
    }),
        C.hookTouchEvents(Un),
        kn && (kn.onclick = C.checkTrusted(function() {
        Lo("https://krunker.io/?play=SquidGame_KB")
    }),
               C.hookTouchEvents(kn)),
        vn && (vn.onclick = C.checkTrusted(function() {
        setTimeout(function() {
            Rh()
        }, 10)
    }),
               C.hookTouchEvents(vn)),
        Ln.onclick = C.checkTrusted(function() {
        pf()
    }),
        C.hookTouchEvents(Ln),
        hr.onclick = C.checkTrusted(function() {
        nf()
    }),
        C.hookTouchEvents(hr),
        fr.onclick = C.checkTrusted(function() {
        hf()
    }),
        C.hookTouchEvents(fr),
        ur.onclick = C.checkTrusted(function() {
        Mo()
    }),
        C.hookTouchEvents(ur),
        me.onclick = C.checkTrusted(function() {
        Ao()
    }),
        C.hookTouchEvents(me)
    vg(Bb, "AutoMacroMod");
}