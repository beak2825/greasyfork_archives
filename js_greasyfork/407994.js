// ==UserScript==
// @name         MOPE.IO AUTO DIVE, AUTO BOOST, SEE PEOPLE UNDERWATER, SEE INVISIBLE PLAYERS, REMOVE ADS
// @namespace    https://greasyfork.org/en/users/198860-flarez-gaming
// @version      2.3
// @description  The best mope.io hack out there, ALL SKINS UNLOCKER BOT (SEE VID IN DESC FOR TUTORIAL), MOVEMENT LOCKER! PRESS Z FOR LOCKER. Hotkeys (V = TOGGLE RESPAWN BOT / ALLSKINS, C = TOGGLE AUTOBOOST, X = TOGGLE AUTO DIVE, REMOVE ADS, CUSTOM CURSOR). Auto-see people underwater and in holes. You can see people who are invisible too!
// @author       FZ
// @match        *://mope.io/*
// @match        *://beta.mope.io/*
// @match        *://m0pe.io/*
// @match        *://learninganimals.club/*
// @match        *://beta.tailbite.me/*
// @match        *://beta.zooeducation.space/*
// @match        *://tailbite.me/*
// @match        *://animalfun.club/*
// @match        *://zooeducation.space/*
// @match        *://experimental.mope.io/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        unsafeWindow
// @require      https://greasyfork.org/scripts/410512-sci-js-from-ksw2-center/code/scijs%20(from%20ksw2-center).js
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @antifeature tracking
// @downloadURL https://update.greasyfork.org/scripts/407994/MOPEIO%20AUTO%20DIVE%2C%20AUTO%20BOOST%2C%20SEE%20PEOPLE%20UNDERWATER%2C%20SEE%20INVISIBLE%20PLAYERS%2C%20REMOVE%20ADS.user.js
// @updateURL https://update.greasyfork.org/scripts/407994/MOPEIO%20AUTO%20DIVE%2C%20AUTO%20BOOST%2C%20SEE%20PEOPLE%20UNDERWATER%2C%20SEE%20INVISIBLE%20PLAYERS%2C%20REMOVE%20ADS.meta.js
// ==/UserScript==

//insert_0000000(true, "mope identifier v2.0");

document.getElementById('gCanvas').style.cursor = 'url(http://cur.cursors-4u.net/user/use-1/use153.cur), default';

function autoDive() {
    var x = document.createEvent("MouseEvent");
    x.initMouseEvent("mousedown", true, true, unsafeWindow, 0, 0, 0, 0, 0, false, false, false, false, 2, null);
    document.getElementById('gCanvas').dispatchEvent(x);
}

function autoBoost() {
    var x = document.createEvent("MouseEvent");
    x.initMouseEvent("mousedown", true, true, unsafeWindow, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    document.getElementById('gCanvas').dispatchEvent(x);
}

/*const canvas = document.getElementById("gCanvas");

var centerPoint;

setInterval(() => {
    centerPoint = [document.getElementById('gCanvas').width / 2, document.getElementById('gCanvas').height / 2];
}, 0);

function mouseMove(x, y) {
    canvas.dispatchEvent(new MouseEvent('mousemove', {
        'clientX': x,
        'clientY': y
    }));
}*/

var zx = "_0x56" + "bd07";
var xz = "_0xaf" + "8b40";
function stayStill() {
    unsafeWindow[zx]('Movement Lock: ' + ((unsafeWindow[xz] = !unsafeWindow[xz]) ? 'ON' : 'OFF'), 2500);
};

var one = false; var int1, int2, int3;
var two = false;
var three = false;
var state = false;
var setup = '';

function isElementVisible(a) {
    return null !== a['offsetParent'];
}

document.addEventListener("keydown", e => {
    if (e.key == "v") {
        state = !state;
        alert("XP Bot: " + state);
        document.getElementById("startButton").click();
        setTimeout(()=>{
            setup = setInterval(()=>{
                if (isElementVisible(document.getElementById("startButton"))) document.getElementById("startButton").click();
                $("gCanvas").trigger("focus");
                var x = document.createEvent("MouseEvent");
                x.initMouseEvent("mousedown", true, true, unsafeWindow, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                document.getElementById('gCanvas').dispatchEvent(x);
                if (state == false) clearInterval(setup);
            }, 1000);
        }, 5000);
    }
    if (e.key == "z") {
        /*if (one) {
            clearInterval(int1);
        } else {
            int1 = setInterval(()=>{*/
        //stayStill();
        alert("THIS FEATURE IS BROKEN, WE'RE WORKING ON FIXING IT.")
        /*}, 0);
        };
        one = !one*/
    };
    if (e.key == "x") {
        alert("Autodive: " + !two);
        if (two) {
            clearInterval(int2);
        } else {
            int2 = setInterval(()=>{
                autoDive();
            }, 0);
        };
        two = !two;
    };
    if (e.key == "c") {
        alert("Autoboost: " + !three);
        if (three) {
            clearInterval(int3);
        } else {
            int3 = setInterval(()=>{
                autoBoost();
            }, 0);
        };
        three = !three;
    };
});

document.getElementById('preroll').remove();
document.getElementById("moneyRectBottom").style.display = "none"; //remove ads