// ==UserScript==
// @name        right click + scroll up/down == left/right
// @match       https://twitter.com/*
// @version     0.1
// @author      f-carraro
// @description useful for any site with galleries, hold right click and scroll to cycle images
// @namespace https://greasyfork.org/users/699847
// @downloadURL https://update.greasyfork.org/scripts/415115/right%20click%20%2B%20scroll%20updown%20%3D%3D%20leftright.user.js
// @updateURL https://update.greasyfork.org/scripts/415115/right%20click%20%2B%20scroll%20updown%20%3D%3D%20leftright.meta.js
// ==/UserScript==

var hold = false;
var didsomething = false;

window.addEventListener("mousedown", ({button}) => {
    if (button === 2) { // right click
        hold = true;
    }
});

window.addEventListener("mouseup", ({button}) => {
    if (button === 2) {
        hold = false;
    }
});

window.addEventListener("wheel", e=>{
    if (hold){
        e.preventDefault;
        if (e.deltaY < 0){
            sendKey(37); 
        } else {
            sendKey(39);  
        }
        didsomething = true;
    }
});

window.addEventListener('contextmenu', e=>{
    if (didsomething){
        e.preventDefault();
    }
    didsomething=false;
});

function sendKey(code){
    const ke = new KeyboardEvent("keydown", {bubbles: true, cancelable: true, keyCode: code});
    document.dispatchEvent(ke);
}