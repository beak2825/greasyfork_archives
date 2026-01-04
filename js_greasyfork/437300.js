// ==UserScript==
// @name         Takepoint.io - Anti Packet Injection
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  No more xss
// @author       You
// @match        https://takepoint.io
// @icon         https://www.google.com/s2/favicons?domain=takepoint.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437300/Takepointio%20-%20Anti%20Packet%20Injection.user.js
// @updateURL https://update.greasyfork.org/scripts/437300/Takepointio%20-%20Anti%20Packet%20Injection.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        var connection
        for(var i in sockets) {
            if(sockets[i].readyState == 1) connection = sockets[i]
        }

        connection.onmessage = function (e) {
            var text = new TextDecoder().decode(e.data)
            var modifiedText = text.split("|")
            for(var i in modifiedText) {
                if(modifiedText[i] == " ") {
                    var lc = i-1
                    while(true) { //iterate backwards through each packet until we get to the player that sent them
                        if(!modifiedText[lc].startsWith("c")) {
                            modifiedText.splice(lc, 1)
                        }
                        else {
                            break
                        }
                        lc--
                    }
                }
            }
            modifiedText = modifiedText.join("|")
            var encoder = new TextEncoder()
            var view = encoder.encode(modifiedText)
            var uint8Array = new Uint8Array(view)
            var buffer = Module._malloc(uint8Array.length)
            writeArrayToMemory(uint8Array, buffer)
            connection.events.push([buffer, uint8Array.length, Module.getClientTime()])
        }
    }, 1000)

})();