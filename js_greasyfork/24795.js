// ==UserScript==
// @name         __JaZzY's Fishing Boat Spawner for Doblons.io! (Darkmode)
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Pressing [W] spawns in Fishing Boats! (Darkmode is HighNoon643's code!)
// @author       __JaZzY!
// @match        http://doblons.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24795/__JaZzY%27s%20Fishing%20Boat%20Spawner%20for%20Doblonsio%21%20%28Darkmode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/24795/__JaZzY%27s%20Fishing%20Boat%20Spawner%20for%20Doblonsio%21%20%28Darkmode%29.meta.js
// ==/UserScript==

// *Darkmode settings are *NOT MINE,* they're HighNoon643's! Give his script a big hug at https://greasyfork.org/en/scripts/23951-darkmode-for-doblons-io/code ❤

var headAppend = document.getElementsByTagName("head")[0],
    style = document.createElement("div");
style.innerHTML = "<style>.dark:hover {background-color: rgba(80, 80, 80, 0.5);}.dark{pointer-events: auto;cursor: pointer;display: inline-block;position: absolute;bottom: 10px;left: 164px;padding: 4px;background-color: rgba(40, 40, 40, 0.5);font-family: regularF;font-size: 20px;border-radius: 4px;color: #fff;}</style>", headAppend.appendChild(style);
var menuAppend = document.getElementById("weaponsContainer"),
    darkMode = document.createElement("div");
darkMode.innerHTML = "<div id='darkMode' class='dark' onclick='makeDark();'>Darkmode</div>", menuAppend.appendChild(darkMode), window.makeDark = function() {
    gameData.outerColor = "#1E1F1F", gameData.waterColor = "#111111", darkMode.innerHTML = "<div id='darkMode'class='dark' onclick='makeLight();'>Lightmode</div>"
}, window.makeLight = function() {
    gameData.waterColor = "#acb5db", gameData.outerColor = "#98a0c2", darkMode.innerHTML = "<div id='darkMode'class='dark' onclick='makeDark();'>Darkmode</div>"
};

// Below script is mine! Pressing [W] spawns max boats!

var BoatDown = false;
var speed = 25;

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

function keydown(event) {
    if (event.keyCode == 87 && BoatDown === false) {
        BoatDown = true;
        setTimeout(boat, speed);
    }
}

function keyup(event) {
    if (event.keycode == 87) {
        var BoatDown = false;
        }
}

function boat() {
    if (BoatDown) {
        $("body").trigger($.Event("keydown", { keyCode: 57}));
        $("body").trigger($.Event("keyup", { keyCode: 57}));
        setTimeout(boat,speed);
    }
}
