// ==UserScript==
// @name         anonymous stat tracking
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  you'll be logged in right before you die and logged out once the stat data is saved
// @author       Marliskilla
// @match        https://takepoint.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=takepoint.io
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457368/anonymous%20stat%20tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/457368/anonymous%20stat%20tracking.meta.js
// ==/UserScript==

// userdata; if not changed, you'll track stats for the user "temp"
let user = "temp"; // change temp to your username
let password = "tempPassword"; // change tempPassword to your password

(function() {
    'use strict';
    var loadLoop = setInterval(() => {
        if(sockets && sockets[0] && sockets[0].events) {
            sockets[0].onmessage = function(e){
                //from original function
                let data = new TextDecoder().decode(e.data);
                var uint8Array = new Uint8Array(e.data);
                var buffer = Module._malloc(uint8Array.length);
                writeArrayToMemory(uint8Array, buffer);
                sockets[0].events.push([buffer, uint8Array.length, Module.getClientTime()]);
                //injection
                if(!data.match(/^(r,6)|(\|r,6)/g)){ //death message not in packet ?
                    return;
                }
                sockets[0].send(new TextEncoder().encode("al," + user + "," + password + ",0")); //logs in
                setTimeout(() => {
                    sockets[0].send(new TextEncoder().encode("ao")); //logs out
                }, 1000); // 1s delay before logging out, to save stats
            };
        }
    }, 20)
})();