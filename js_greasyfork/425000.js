// ==UserScript==
// @name         Diep.io Anti AFK-Timeout Improved
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  AntiAfk, toggle with keybind
// @author       Drog
// @match        *://diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425000/Diepio%20Anti%20AFK-Timeout%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/425000/Diepio%20Anti%20AFK-Timeout%20Improved.meta.js
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
top: 684px;
right: 4.9%;
transform: translateX(50%);
font-family: 'Ubuntu', bold;
color: #ffffff;
text-shadow:
    -1px -1px 0 #000,
     0   -1px 0 #000,
     1px -1px 0 #000,
     1px  0   0 #000,
     1px  1px 0 #000,
     0    1px 0 #000,
    -1px  1px 0 #000,
    -1px  0   0 #000;
font-style: bold;
font-variant: bold;
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