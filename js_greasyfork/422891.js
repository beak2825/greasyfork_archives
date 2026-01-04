// ==UserScript==
// @name         Linesplit Mod
// @namespace    http://tampermonkey.net/
// @version      2.37
// @description  With this mod you can Linesplit, Freeze, and even Diagonal Linesplit in Abs0rb.me!
// @author       nyone
// @match        http://abs0rb.me/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/422891/Linesplit%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/422891/Linesplit%20Mod.meta.js
// ==/UserScript==

window.addEventListener("load", () => {
    let lock = {}, x, y, keyCodes = [37, 38, 39, 40, 83], keys = ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", "S"], at = 0, names = { left: false, up: false, right: false, down: false, freeze: false }, di, t = { x: 0, y: -100 }, r = { x: 100, y: 0 }, b = { x: 0, y: 100 }, l = { x: -100, y: 0 }, tR = { x: 100, y: -100 }, bR = { x: 100, y: 100 }, bL = { x: -100, y: 100 }, tL = { x: -100, y: -100 };["left", "up", "right", "down", "freeze"].forEach(name => {
        localStorage[`${name}KeyCode`] === undefined && (localStorage[`${name}KeyCode`] = keyCodes[at]);
        localStorage[`${name}Key`] === undefined && (localStorage[`${name}Key`] = keys[at]);
        at++
    });
    const getCoords = function (axis) {
        x = window.innerWidth / 2 + eval(axis).x;
        y = window.innerHeight / 2 + eval(axis).y
    };
    ["freeze", "left", "up", "right", "down"].forEach(name => {
        let newOpt = document.createElement("div");
        let newSpan = document.createElement("span");
        let newKB = document.createElement("div");
        name === "freeze" ? newOpt.innerText = "Freeze" : newOpt.innerText = "Move " + name;
        newOpt.id = "option-" + name;
        newSpan.id = name + "-span"
        newKB.innerText = localStorage[name + "Key"];
        newKB.id = "keybind-" + name;
        document.querySelector("#keybind-settings").appendChild(newOpt);
        document.querySelector("#" + newOpt.id).className = "setting-row";
        document.querySelector("#" + newOpt.id).appendChild(newSpan);
        document.querySelector("#" + newSpan.id).className = "setting-option";
        document.querySelector("#" + newSpan.id).appendChild(newKB);
        document.querySelector("#" + newKB.id).className = "keybind-setting transitioning clickable";
        lock[name] = true;
        document.querySelector('#option-' + name).onclick = () => {
            document.querySelector('#keybind-' + name).innerText = '...';
            lock[name] = false
        }
    });

    function KD(event) {
        ["left", "up", "right", "down", "freeze"].forEach(name => { !lock[name] && (event.key.length === 1 ? localStorage[`${name}Key`] = event.key.toUpperCase() : localStorage[`${name}Key`] = event.key, document.querySelector(`#keybind-${name}`).innerText = localStorage[`${name}Key`], lock[name] = true, localStorage[`${name}KeyCode`] = event.keyCode) });
        event.keyCode === Number(localStorage.freezeKeyCode) && (names.freeze = true, $("canvas").trigger($.Event("mousemove", { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 })));
        switch (event.keyCode) {
            case Number(localStorage.leftKeyCode):
            case Number(localStorage.upKeyCode):
            case Number(localStorage.rightKeyCode):
            case Number(localStorage.downKeyCode):
                ["left", "up", "right", "down"].forEach(name => { event.keyCode === Number(localStorage[`${name}KeyCode`]) && (names[name] = true) });
                di = (names.up || names.down ? names.up ? 't' : 'b' : '') + (names.right || names.left ? names.right ? 'r' : 'l' : '').replace(/^./, m => names.up || names.down ? m.toUpperCase() : m);
                getCoords(di);
                $("canvas").trigger($.Event("mousemove", { clientX: x, clientY: y }));
                break
        }
    }
    window.addEventListener('keydown', KD);

    function KU(event) {
        ["left", "up", "right", "down", "freeze"].forEach(name => { event.keyCode === Number(localStorage[`${name}KeyCode`]) && (names[name] = false) });
    }
    window.addEventListener('keyup', KU)
});