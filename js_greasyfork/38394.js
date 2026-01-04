// © 2017. Sry Clan. All Rights Reserved
// ==UserScript==
// @name         SRY Clan
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  PRO AGAR MACRO - W=FEED - E =TRICKSPLIT - Z =TRIPLESPLIT - D =DOUBLESPLIT - A =FREEZE CELL
// @author       SRY Clan
// @match        http://agar.io/*
// @match        http://petridish.pw/*
// @match        http://agarly.com/*
// @match        http://agar.biz/*
// @match        http://en.agar.bio/*
// @match        http://agar.red/*
// @match        http://agario.biz/*
// @match        http://germs.io/*
// @match        http://agar.re/*
// @match        http://alis.io/*
// @match        http://agarix.esy.es/
// @match        https://gota.io
// @match        http://gaver.io
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38394/SRY%20Clan.user.js
// @updateURL https://update.greasyfork.org/scripts/38394/SRY%20Clan.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 25; //in ms
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_A'> Press <b>A</b> to Freeze Cell (Stop Movement)</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_D'> Press <b>D</b> to Doublesplit (Split 2x)</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_Z'> Press <b>Z</b> to Triplesplit (Split 3x)</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_E'> Press <b>E</b> to Tricksplit (Split 4x)</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_youtube channel'> If you like my Macro, please check out the official <b>Sry</b> <b>Clan</b> Vk!</span> https://vk.com/sryclan</span></center>";
function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
    }
    if (event.keyCode == 68) { //key D
        split();
        setTimeout(split, speed);
    }
     if (event.keyCode == 65) { //key A
        split();
        setTimeout(split, speed);
        setTimeout(split, speed*2);
    }
     if (event.keyCode == 69) { //key E
        split();
        setTimeout(split, speed);
        setTimeout(split, speed*2);
        setTimeout(split, speed*3);
     }
    if (event.keyCode == 83) { //key S
        X = window.innerWidth/2;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }
}


function keyup(event) {
    if (event.keyCode == 87) { // key W
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 87}); // key W
        window.onkeyup({keyCode: 87});
        setTimeout(eject, speed);
    }
}

function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32})); //key space
    $("body").trigger($.Event("keyup", { keyCode: 32})); //jquery is required for split to work
}
//© 2017. Sry Clan. All Rights Reserved