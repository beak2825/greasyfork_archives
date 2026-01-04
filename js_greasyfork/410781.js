// ==UserScript==
// @name         Diep.io Anti AFK-Timeout
// @namespace    https://greasyfork.org/en/users/198860-flarez-gaming x Erika
// @version      0.4
// @description  AntiAfk, toggle with keybind
// @author       FZ x Erika
// @match        *://diep.io/*
// @grant        none
// @require      https://greasyfork.org/scripts/410512-sci-js-from-ksw2-center/code/scijs%20(from%20ksw2-center).js
// @downloadURL https://update.greasyfork.org/scripts/410781/Diepio%20Anti%20AFK-Timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/410781/Diepio%20Anti%20AFK-Timeout.meta.js
// ==/UserScript==

function keyPress(key, upDown) {
    var eventObj;
    if (upDown == true) {
        eventObj = document.createEvent("Events");
        eventObj.initEvent("keydown", true, true);
        eventObj.keyCode = key;
        window.dispatchEvent(eventObj);
    }
    if(upDown == false) {
        eventObj = document.createEvent("Events");
        eventObj.initEvent("keyup", true, true);
        eventObj.keyCode = key;
        window.dispatchEvent(eventObj);
    }
}

var overlay = document.createElement("div");
document.body.appendChild(overlay);
var toggler = "OFF";

setInterval( () => {
    var overlayHTML = `

<style>

.main {
pointer-events: none;
position: fixed;
top: 10px;
right: 50%;
transform: translateX(50%);
font-family: 'Roboto', cursive, sans-serif;
color: #202225;
font-style: normal;
font-variant: normal;
}

</style>

<div class="main" id="all">
<p id="antiAFK"> Anti-AFK = ${toggler} [F]</p>
</div>
`
    overlay.innerHTML = overlayHTML;
}, 5)

var keyW = 87;
var keyS = 83;

function pressW() {
    keyPress(keyW, 1);
    setTimeout( () => {
        keyPress(keyW, 0);
    }, 200);
}

function pressS() {
    keyPress(keyS, 1);
    setTimeout( () => {
        keyPress(keyS, 0);
    }, 200);
}

function pressTimeout(keyCode, timeout) {
    keyPress(keyCode, 1);
    setTimeout( () => {
        keyPress(keyCode, 0);
    }, timeout);
}

function antiAFK() {
    if(out == 1) {
        pressW();
        setTimeout( () => {
            pressS();
            intoggle = 1;
        }, 2000);
    }
}

var out = 0;
var intoggle = 1;

setInterval( () => {
    if(out == 1) {
        antiAFK();
    }
}, 4000);

function off_on() {
    if(keyPressToggle == 0) {
        out = 0;
        toggler = "OFF";
    } else {
        out = 1;
        intoggle = 1;
        toggler = "ON";
    }
}

var keyPressToggle = 0;

document.addEventListener('keydown', function(e) {
    if(e.key == "f") {
        keyPressToggle = !keyPressToggle;
        off_on()
    }
    if(e.key == 'r') {
        fire(0,120);
        fire(0.75,200);
        fire(1.5,745);
        setTimeout( () => {
            keyPress(69, 1)
            setTimeout( () => {
                keyPress(69, 0)
            }, 500);
        }, 1500);
    }
});



function fire(t,w) {
    setTimeout(function(){
        keyPress(32, 1);
    }, t*1000);
    setTimeout(function(){
        keyPress(32, 0);
    }, t*1000+w);
}