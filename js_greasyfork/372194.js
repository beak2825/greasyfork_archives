// ==UserScript==
// @name         auto flipper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  none
// @author       Me
// @match       *://*.diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372194/auto%20flipper.user.js
// @updateURL https://update.greasyfork.org/scripts/372194/auto%20flipper.meta.js
// ==/UserScript==
let reload = 7;

let cycle = [1155, 1155, 1155, 1155, 1155, 1071, 953];
                //5 reload: 1155
                //6 reload: 1071
                //7 reload: 953

let mouseX, mouseY;

let flipInProgress = false;

let canvas = document.getElementById('canvas');
let height = canvas.height;
let width = canvas.width;

window.addEventListener('resize', function () {
        width = canvas.width;
        height = canvas.height;
});

document.addEventListener('mousemove', function(event){
    mouseX = event.pageX;
    mouseY = event.pageY;

    if (flipInProgress){
    input.mouse(width - mouseX, height - mouseY);
    }
});

function flip(){
    flipInProgress = true;

    input.mouse(width - mouseX, height - mouseY);

    setTimeout (function(){
        flipInProgress = false;
        input.mouse(mouseX, mouseY);
    }, 230);
}


let flipOn = false;
var flipEventTracker;
document.addEventListener('keydown', function(event){
    switch (event.key){
        case 'E':
            clearInterval(flipEventTracker);
            flipEventTracker = setInterval(flip,cycle[reload-1]);
            break;

        case 'e':
            clearInterval(flipEventTracker);
    }
});