// ==UserScript==
// @name         bullet spam
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  click q to invoke / stop
// @author       You
// @match        *://diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381150/bullet%20spam.user.js
// @updateURL https://update.greasyfork.org/scripts/381150/bullet%20spam.meta.js
// ==/UserScript==

WebSocket = class extends WebSocket {
    constructor(arg) {
        super(arg);
        document.ws = this;
    }
}
function wait() {
    if(document.getElementById('a').style.display === 'none') {
        loop();
        return;
    }
    setTimeout(wait, 100);
}
var block = true;
var turn = true;
document.addEventListener('keydown', function(e) {
    switch(e.keyCode) {
        case 81:
            block = !block;
            if(block) {
                input.execute("ren_upgrades true");
            } else {
                input.execute("ren_upgrades false");
            }
            document.ws.send(new Uint8Array([4, 66]));
            document.ws.send(new Uint8Array([4, 64]));
            break;
    }
});
function loop() {
    if(document.getElementById('a').style.display !== 'none') {
        block = true;
        input.execute("ren_upgrades true");
        requestAnimationFrame(loop);
        return;
    }
    if(!block) {
        if(turn) {
            input.keyDown(220);
            turn = !turn;
        } else {
            input.keyUp(220);
            document.ws.send(new Uint8Array([4, 64]));
            turn = !turn;
        }
        setTimeout(loop, 50);
        return;
    }
    requestAnimationFrame(loop);
}
wait();