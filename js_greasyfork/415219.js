// ==UserScript==
// @name         Line script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Linesplit script for ball games 😩
// @author       Zaddy Danger
// @match        http://abs0rb.me/*
// @match        https://gota.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/415219/Line%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/415219/Line%20script.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);

var Speed = 25;
function split() {
    $("body").trigger($.Event("keydown", {
        keyCode: 32
    }));
    $("body").trigger($.Event("keyup", {
        keyCode: 32
    }));
}
function keydown(event) {
    if (event.keyCode == 83) { //key S
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed*2);
    }
    if (event.keyCode == 50) { //key 2
        X = window.innerWidth/0.5;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }
    if (event.keyCode == 49) { //key 1
        X2 = window.innerWidth/3.5;
        Y2 = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X2, clientY: Y2}));
    }
    if (event.keyCode == 51) { //key 3
        X3 = window.innerWidth/2;
        Y3 = window.innerHeight/3.5;
        $("canvas").trigger($.Event("mousemove", {clientX: X3, clientY: Y3}));
    }
    if (event.keyCode == 52) { //key 4
        X4 = window.innerWidth/2;
        Y4 = window.innerHeight/0.5;
        $("canvas").trigger($.Event("mousemove", {clientX: X4, clientY: Y4}));
    }
    if (event.keyCode == 70) { //key F
        X5 = window.innerWidth/2;
        Y5 = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X5, clientY: Y5}));
    }
}