// ==UserScript==
// @name           fast_cre-console
// @author         Something begins
// @namespace      ass
// @description    По наведеню курсора на существо и нажатию Э (') назначает выбранному объекту на карте переменную var1, которую можно использовать, например var1.attack+=15. Консоль открывается на F12 (Ctrl+Shift+J)
// @version        0.1
// @include        /^https{0,1}:\/\/((www|qrator|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(war|warlog|leader_guild|leader_army|inventory).php(?!.?setkamarmy)/
// @grant          unsafeWindow
// @license        deez nuts
// @downloadURL https://update.greasyfork.org/scripts/519033/fast_cre-console.user.js
// @updateURL https://update.greasyfork.org/scripts/519033/fast_cre-console.meta.js
// ==/UserScript==
const keyboardKeycodes = {
    "backspace": 8,
    "tab": 9,
    "enter": 13,
    "shift": 16,
    "ctrl": 17,
    "alt": 18,
    "pause": 19,
    "capslock": 20,
    "escape": 27,
    "space": 32,
    "pageup": 33,
    "pagedown": 34,
    "end": 35,
    "home": 36,
    "leftarrow": 37,
    "uparrow": 38,
    "rightarrow": 39,
    "downarrow": 40,
    "insert": 45,
    "delete": 46,
    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57,
    "a": 65,
    "b": 66,
    "c": 67,
    "d": 68,
    "e": 69,
    "f": 70,
    "g": 71,
    "h": 72,
    "i": 73,
    "j": 74,
    "k": 75,
    "l": 76,
    "m": 77,
    "n": 78,
    "o": 79,
    "p": 80,
    "q": 81,
    "r": 82,
    "s": 83,
    "t": 84,
    "u": 85,
    "v": 86,
    "w": 87,
    "x": 88,
    "y": 89,
    "z": 90,
    "leftwindowkey": 91,
    "rightwindowkey": 92,
    "selectkey": 93,
    "numpad0": 96,
    "numpad1": 97,
    "numpad2": 98,
    "numpad3": 99,
    "numpad4": 100,
    "numpad5": 101,
    "numpad6": 102,
    "numpad7": 103,
    "numpad8": 104,
    "numpad9": 105,
    "multiply": 106,
    "add": 107,
    "subtract": 109,
    "decimalpoint": 110,
    "divide": 111,
    "f1": 112,
    "f2": 113,
    "f3": 114,
    "f4": 115,
    "f5": 116,
    "f6": 117,
    "f7": 118,
    "f8": 119,
    "f9": 120,
    "f10": 121,
    "f11": 122,
    "f12": 123,
    "numlock": 144,
    "scrolllock": 145,
    "semicolon": 186,
    "equal": 187,
    "comma": 188,
    "dash": 189,
    "period": 190,
    "forwardslash": 191,
    "graveaccent": 192,
    "openbracket": 219,
    "backslash": 220,
    "closebracket": 221,
    "singlequote": 222
};

const pressedKeys = new Set();

function handleKeyDown(event) {
    pressedKeys.add(event.keyCode);
}

function handleKeyUp(event) {
    pressedKeys.delete(event.keyCode);
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
var script_cres = [];
unsafeWindow.script_cres = script_cres;
window.addEventListener("keyup", event => {
    const keyCode = parseInt(event.keyCode);
    if ((document.querySelector("#chattext") === document.activeElement) || (document.querySelector("#chattext_classic") === document.activeElement)) return;
    if (keyCode === 222) {
        const cre1 = stage.pole.obj[mapobj[xr_last + defxn *yr_last]];
        console.log(`${cre1.nametxt} [${cre1.nownumber}], Этот объект var1. Пример взаимодействия:\n var1.attack+=15 \n`, cre1);
        unsafeWindow["var1"] = cre1;
    }

});

for (const cre of Object.values(stage.pole.obj)){
console.log(`(${cre.obj_index}) ${cre.dead ? "dead" : ""} ${cre.nametxt} [${cre.nownumber === -1 ? cre.die_number : cre.nownumber}] owner ${stage.pole.obj[heroes[cre.owner]].nametxt} {${cre.x}:${cre.y}}`)

}