// ==UserScript==
// @name         Macros Utility for Germs/Elites.io
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Faster W, [D] Doublesplit, [A] Max split, [R] Popsplit
// @author       pc31754
// @match        http://germs.io/*
// @match        https://germs.io/*
// @match        http://elites.io/*
// @match        https://elites.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/368606/Macros%20Utility%20for%20GermsElitesio.user.js
// @updateURL https://update.greasyfork.org/scripts/368606/Macros%20Utility%20for%20GermsElitesio.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var speed = 50; //keep this for max split macro @nobody

function keydown(event) {
    if (event.keyCode == 87) {
        Feed = true;
        setTimeout(feedMacro, 0);
    } 
    if (event.keyCode == 65) {           //keep this for max split macro @nobody
        split();
        setTimeout(split, speed);
        setTimeout(split, speed*2);
        setTimeout(split, speed*3);
        setTimeout(split, speed*4);
    } // Doublesplit
    if (event.keyCode == 68) {
        split();
        setTimeout(split, speed);
    } // PopSplit
    if (event.keyCode == 82) {
        split();
        setTimeout(split, speed*5.0634212);
    }
}

function keyup(event) {
    if (event.keyCode == 87) {
        Feed = false;
    }
}

function feedMacro() {
    if (Feed) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(feedMacro, split);
    }
}
function split() { //keep this for max split macro @nobody
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}