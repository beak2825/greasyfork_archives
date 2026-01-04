// ==UserScript==
// @name         triangle bullet spam
// @author       supa hero
// @description  click Q to start & stop
// @match        *://diep.io/*
// @grant        none
// @version 0.0.1.20190315183343
// @namespace https://greasyfork.org/users/176941
// @downloadURL https://update.greasyfork.org/scripts/380422/triangle%20bullet%20spam.user.js
// @updateURL https://update.greasyfork.org/scripts/380422/triangle%20bullet%20spam.meta.js
// ==/UserScript==
(function() {
    'use strict';
    WebSocket = class extends WebSocket {
        constructor(arg) {
            super(arg);
            document.ws = this;
        }
    }
    function wait() {
        if("input" in window) {
            loop();
            return;
        }
        setTimeout(wait, 100);
    }
    var block1 = true;
    var turn = true;
    document.addEventListener('keydown', function(e) {
        if(e.keyCode === 81) {
            block1 = !block1;
            document.ws.send(new Uint8Array([0x04, 12]));
        }
    });
    function loop() {
        if(document.getElementById('a').style.display !== 'none') {
            block1 = true;
            requestAnimationFrame(loop);
            return;
        }
        if(!block1) {
            if(turn) {
                input.keyDown(220);
                turn = !turn;
            } else {
                input.keyUp(220);
                document.ws.send(new Uint8Array([0x04, 12]));
                turn = !turn;
            }
            setTimeout(loop, 50);
            return;
        }
        requestAnimationFrame(loop);
    }
    wait();
})();