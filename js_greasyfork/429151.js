// ==UserScript==
// @name         Gats.io & Takepoint.io - Disable Stats Tracking
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disables stats tracking, without the need for an adblocker.
// @author       Nitrogem35
// @match        https://gats.io
// @match        https://takepoint.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429151/Gatsio%20%20Takepointio%20-%20Disable%20Stats%20Tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/429151/Gatsio%20%20Takepointio%20-%20Disable%20Stats%20Tracking.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        if(window.document.location.origin == 'https://gats.io') { //gats.io websocket
            if(RF.list[0].socket.readyState == 1) {
                RF.list[0].socket.send('x,1')
            }
        }
        if(window.document.location.origin == 'https://takepoint.io') { //takepoint.io websocket
            for(i in sockets) {
                if(sockets[i].readyState == 1) {
                    sockets[i].send('x,1')
                    //i got too lazy to finish this, but oh well, it already works just fine
                    /*sockets[i].addEventListener('message', function(event) {
                    var data = new TextDecoder().decode(event.data)
                    var packets = data.split("|")
                    for(x in packets) {
                        if(packets[x].startsWith("a"))
                    }
                })*/
                }
            }
        }
    }, 1000) //I hope nobody is bad enough to die in less than 1 second...
})();