// ==UserScript==
// @name         Macro for agma.io - Jolyano
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  'W' Macro,G is Doublesplit
// @author       Jolyano
// @match        http://gota.io/*
// @match        https://gota.io/*
// @match        http://gaver.io*
// @match        http://agma.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/373753/Macro%20for%20agmaio%20-%20Jolyano.user.js
// @updateURL https://update.greasyfork.org/scripts/373753/Macro%20for%20agmaio%20-%20Jolyano.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Speed = 25;


function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}
function mass() {
    if (Feed) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(mass, Speed);
    }
}

function keydown(event) {
    
    if (event.keyCode == 87 )                                        // E
    {
        Feed = true;
        setTimeout(mass, Speed);
    }
    if (event.keyCode == 83) {                                       // S
        X = window.innerWidth/2;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }
   
    if (event.keyCode == 52 || event.keyCode == 52) {                // Shift and 4
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed*2);
        setTimeout(split, Speed*3);
    } 
    if (event.keyCode == 71 || event.keyCode == 'F') {         // Q
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed*2);
    }
    

}
function keyup(event) {
    if (event.keyCode == 87) {
        Feed = false;
    }

}