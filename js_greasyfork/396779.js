// ==UserScript==
// @name         AGAR腳本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  W連噴 G兩拍 G四拍 S停原地
// @author       Tom Burris
// @match        http://agar.io/*
// @match        http://petridish.pw/*
// @match        http://agarly.com/*
// @match        http://agar.biz/*
// @match        http://en.agar.bio/*
// @match        http://agar.pro/*
// @match        http://agar.biz/*
// @match        http://agar.red/play*
// @match        http://www.quilt.idv.tw/agario/*
// @match        http://www.quilt.idv.tw/agarioEx/*
// @match        http://agario.xingkong.tw/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/396779/AGAR%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/396779/AGAR%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==



window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 25; //in ms

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
    }
    if (event.keyCode == 71) { //key G
        split();
        setTimeout(split, speed);
        setTimeout(split, speed*2);
    }
    if (event.keyCode == 84) { //key T
        split();
        setTimeout(split, speed);
        setTimeout(split, speed*2);
        setTimeout(split, speed*3);
        setTimeout(split, speed*4);
        setTimeout(split, speed*5);
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