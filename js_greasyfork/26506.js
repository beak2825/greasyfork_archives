// ==UserScript==
// @name         Minions Extension E R T keys.
// @version      1.0
// @description  Adds E, R, and T keys to the vanilla client
// @author       Swep
// @match        *.agar.io/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/90980
// @downloadURL https://update.greasyfork.org/scripts/26506/Minions%20Extension%20E%20R%20T%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/26506/Minions%20Extension%20E%20R%20T%20keys.meta.js
// ==/UserScript==

setTimeout(function() {
    window.__WebSocket = window.WebSocket;
    window.fakeWebSocket = function() {
        return {
            readyState: 0
        };
    };
    window._WebSocket = window.WebSocket = function(ip) {
        return new window.fakeWebSocket(ip);
    };
    window.key = {
        e: false,
        r: false,
        t: false
    };
    window.addEventListener("load", function() {
        // код инжектинга
        if (!window.OldSocket)
        OldSocket = window.__WebSocket;
        window._WebSock
et = window.WebSocket = window.fakeWebSocket = function(ip) {
            var ws = new OldSocket(ip);
            ws.binaryType = "arraybuffer";
            var fakeWS = {};
            for (var i in ws) {
                fakeWS[i] = ws[i];
            }
            fakeWS.send = function() {
                if (arguments[0][0] == 16) {
                    if (window.key.e){
                        arguments[0] = new Int8Array(1);
                        arguments[0][0] = 22;
                    }
                    if (window.key.r){
                        arguments[0] = new Int8Array(1);
                        arguments[0][0] = 23;
                    }
                    if (window.key.t){
                        arguments[0] = new Int8Array(1);
                        arguments[0][0] = 24;
                    }
                window.key.e = window.key.r = window.key.t = false;
                }
            return ws.send.apply(ws, arguments);
            };
            ws.onmessage = function() {
fakeWS.onmessage && fakeWS.onmessage.apply(ws, arguments);
            };
            ws.onopen = function() {
                fakeWS.readyState = 1;
                fakeWS.onopen.apply(ws, arguments);
            };
            ws.onclose = function(){
                fakeWS.onclose.apply(ws, arguments);
            };
        return fakeWS;
        };
    });
    document.addEventListener('keydown', function(e) {
        var key = e.keyCode || e.which;
        switch (key) {
            case 69:
                window.key.e = true;
                break;
            case 82:
                window.key.r = true;
                break;
            case 84:
                window.key.t = true;
                break;
        }
    });
}, 200);