// ==UserScript==
// @name         Diep.io Triflank v2
// @namespace    http://tampermonkey.net/
// @version      2024-12-15
// @description  Doesn't work with a theme script. Press F to toggle and R and T to change modes.
// @author       Mi300
// @match        https://diep.io/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/2/25/Cube_Animation.gif
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521248/Diepio%20Triflank%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/521248/Diepio%20Triflank%20v2.meta.js
// ==/UserScript==
const _window = typeof unsafeWindow === "undefined" ? window : unsafeWindow;
const canvas = document.getElementById("canvas");
const crc = CanvasRenderingContext2D.prototype;
let currentTransform;
let curTank = "";
let lastSwitch = Date.now();
let scriptActive = 0;
let mouseX = 0;
let mouseY = 0;
let invMouse = false;
let angleOffset = 0;
document.addEventListener("keydown", function(event) {
    if (event.code === "KeyF") {
        scriptActive ^= 1;
        diepAlert(`Toggled Script ${scriptActive ? "ON" : "OFF"}`);
    }
    if (event.code === "KeyR") {
        curRotation = rotations[++position % rotations.length];
        diepAlert(`Switched Type To ${curRotation.name}`);
    }
    if (event.code === "KeyT") {
        curRotation = rotations[--position % rotations.length];
        diepAlert(`Switched Type To ${curRotation.name}`);
    }
    if (event.code === "KeyX") {
        switchTank();
    }
});
document.addEventListener("mousemove", function(event) {
    [mouseX, mouseY] = [event.clientX, event.clientY];
});
const rotations = [{
        name: "Tri-Flank",
        toSwitch: ["Tri-Angle"],
        toUpgrade: ["Flank Guard"],
        upgradeIndex: 0,
    },
    {
        name: "Deathstar",
        toSwitch: ["Octo Tank"],
        toUpgrade: ["Quad Tank"],
        upgradeIndex: 0,
    },
    {
        name: "Twin-Basic",
        toSwitch: ["Twin"],
        toUpgrade: ["Tank"],
        upgradeIndex: 0,
    },
    {
        name: "Gunner Trapper",
        toSwitch: ["Gunner Trapper"],
        toUpgrade: ["Trapper"],
        upgradeIndex: 1,
    },
    {
        name: "Trapper Spam",
        toSwitch: ["Tri-Trapper", "Mega Trapper", "Overtrapper", "Gunner Trapper"],
        toUpgrade: ["Trapper"],
        upgradeIndex: 0,
    },
    {
        name: "Bomber",
        toSwitch: ["Destroyer", "Tri-Angle", "Flank Guard"],
        toUpgrade: ["Machine Gun"],
        upgradeIndex: 0,
    },
    {
        name: "Twin-Triplet",
        toSwitch: ["Triple Shot", "Triplet"],
        toUpgrade: ["Twin"],
        upgradeIndex: 0,
    },
]
const upgradeColors = ["#8efffb", "#b4ff8e", "#ff8e8e", "#ffeb8e", "#8eb2ff", "#b58eff"];
const upgradeColorTable = {
    "#8efffb": 0,
    "#b4ff8e": 1,
    "#ff8e8e": 2,
    "#ffeb8e": 3,
    "#8eb2ff": 4,
    "#b58eff": 5,
}

let upgradeButtonMap = new Map();
let position = rotations.length * 1000000;
let curRotation = rotations[position % rotations.length];

function diepAlert(c) {
    _window.extern && _window.extern.inGameNotification(c);
}

function getOffsetCoords(x, y) {
    //return [_window.innerWidth - x, _window.innerHeight - y];
    const cosine = Math.cos(angleOffset);
    const sine = Math.sin(angleOffset);
    const tank_x = _window.innerWidth / 2;
    const tank_y = _window.innerHeight / 2;

    const ox = mouseX - _window.innerWidth / 2;
    const oy = mouseY - _window.innerHeight / 2;
    const _rx = cosine * ox - sine * oy;
    const _ry = sine * ox + cosine * oy;
    const rotated_x = _rx + tank_x;
    const rotated_y = _ry + tank_y;
    return [rotated_x, rotated_y];
}

function setMousePos(x, y) {
    _window.extern.onTouchMove(-1, x, y);
}

function upgradeTank(index) {
    _window.extern.onTouchStart(0, ...upgradeButtonMap.get(index));
    _window.extern.onTouchEnd(0, ...upgradeButtonMap.get(index));
}

function switchTank() {
    _window.extern && _window.extern.onKeyDown(64);

    setTimeout(function() {
        _window.extern && _window.extern.onKeyUp(64);
    }, 100);
}

function onScriptTick() {
    if (!scriptActive || curRotation.name === "Gunner Trapper" || curRotation.name === "Deathstar") {
        return;
    }
    if (curRotation.toUpgrade.includes(curTank)) {
        upgradeTank(curRotation.upgradeIndex);
    } else if (curRotation.toSwitch.includes(curTank)) {
        switchTank();
    }
}
setInterval(onScriptTick, 200);

function gtrapper() {
    if (!scriptActive || curRotation.name !== "Gunner Trapper") {
        return;
    }

    if (curRotation.toUpgrade.includes(curTank)) {
        upgradeTank(curRotation.upgradeIndex);
    } else if (curRotation.toSwitch.includes(curTank)) {
        setTimeout(function() {
            switchTank()

            setTimeout(function() {
                angleOffset = Math.PI;
                setMousePos(...getOffsetCoords(mouseX, mouseY));
                invMouse = true;
            }, 40);
            setTimeout(function() {
                invMouse = false;
                setMousePos(mouseX, mouseY);
            }, 175);
        }, 75);
    }
}

function deathstar() {
    if (!scriptActive || curRotation.name !== "Deathstar") {
        return;
    }
    if (curRotation.toUpgrade.includes(curTank)) {
        upgradeTank(curRotation.upgradeIndex);
    } else if (curRotation.toSwitch.includes(curTank)) {
        setTimeout(function() {
            switchTank();

            setTimeout(function() {
                angleOffset = Math.PI / 4;
                setMousePos(...getOffsetCoords(mouseX, mouseY));
                invMouse = true;
            }, 100);
            setTimeout(function() {
                invMouse = false;
                setMousePos(mouseX, mouseY);
            }, 250);

            setTimeout(function() {
                angleOffset = Math.PI / 4;
                setMousePos(...getOffsetCoords(mouseX, mouseY));
                invMouse = true;
            }, 500);
            setTimeout(function() {
                invMouse = false;
                setMousePos(mouseX, mouseY);
            }, 650);
        }, 75);
    }
}
setInterval(gtrapper, 750);
setInterval(deathstar, 750);


const mouseHandler = {
    apply(method, thisArg, args) {
        if (invMouse) {
            args = [args[0], ...getOffsetCoords(args[1], args[2])];
        }
        return Reflect.apply(method, thisArg, args);
    }
}

let awaitGameLoad = setInterval(function() {
    if (!_window.extern) {
        return;
    }
    clearInterval(awaitGameLoad);
    _window.extern.onTouchStart = new Proxy(_window.extern.onTouchStart, mouseHandler);
    _window.extern.onTouchEnd = new Proxy(_window.extern.onTouchEnd, mouseHandler);
    _window.extern.onTouchMove = new Proxy(_window.extern.onTouchMove, mouseHandler);
}, 400);




crc.strokeText = new Proxy(crc.strokeText, {
    apply: function(m, c, [text, ...blah]) {
        if (text.startsWith("Lvl ")) {
            curTank = text[5] === " " ? text.slice(6) : text.slice(7);
        }
        return Reflect.apply(m, c, [text, ...blah]);
    }
});
crc.fillRect = new Proxy(crc.fillRect, {
    apply: function(m, c, [x, y, w, h]) {
        if (upgradeColors.includes(c.fillStyle)) {
            c.canvas.isUpgradeButton = true;
            c.canvas.upgradeButton = upgradeColorTable[c.fillStyle];
        }
        return Reflect.apply(m, c, [x, y, w, h]);
    }
});
crc.setTransform = new Proxy(crc.setTransform, {
    apply: function(m, c, args) {
        currentTransform = args;
        return Reflect.apply(m, c, args)
    }
});
crc.drawImage = new Proxy(crc.drawImage, {
    apply: function(m, c, [img, x, y, ...blah]) {
        const midpointX = (currentTransform[4] + x + img.width / 2) * (window.innerWidth / canvas.width);
        const midpointY = (currentTransform[5] + y + img.height / 2) * (window.innerHeight / canvas.height);
        if (img.isUpgradeButton && midpointX > 0 && midpointY > 0) {
            upgradeButtonMap.set(img.upgradeButton, [midpointX, midpointY]);
        }
        return Reflect.apply(m, c, [img, x, y, ...blah]);
    }
});
Object.freeze(crc);