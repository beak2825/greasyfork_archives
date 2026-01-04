// ==UserScript==
// @name         mario client
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  e for notime and star and such and f for noclipping and no falling have funnnnn
// @author       God
// @match        https://supermarioemulator.com/mario.php
// @icon         https://www.google.com/s2/favicons?domain=supermarioemulator.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433488/mario%20client.user.js
// @updateURL https://update.greasyfork.org/scripts/433488/mario%20client.meta.js
// ==/UserScript==
document.addEventListener("keypress", function(e) {
    if (e.which == 101) {
        console.log("e key pressed!")
        window.xhttp = mario.star=1;
        window.xhttp = notime=1;
        window.xhttp = mario.nofall=0;
        window.xhttp = mario.nocollide=0;
    }
});

document.addEventListener("keypress", function(f) {
    if (f.which == 102) {
        console.log("f key pressed!")
        window.xhttp = mario.star=1;
        window.xhttp = notime=1;
        window.xhttp = mario.nofall=1;
        window.xhttp = mario.nocollide=1;
    }
});

document.addEventListener("keypress", function(g) {
    if (g.which == 103) {
        console.log("g key pressed!")
        window.xhttp = mario.star=1;
        window.xhttp = notime=1;
        window.xhttp = mario.gravity-=0.1;
    }
});

document.addEventListener("keypress", function(h) {
    if (h.which == 104) {
        console.log("h key pressed!")
        window.xhttp = mario.star=1;
        window.xhttp = notime=1;
        window.xhttp = mario.gravity+=0.1;
    }
});

