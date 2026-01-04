// ==UserScript==
// @name  tinytanks
// @description  tinytankss
// @author TheThreeBowlingBulbs
// @match  *://tinytanks.io/*
// @version 1.0.1
// @namespace https://greasyfork.org/users/812261
// @downloadURL https://update.greasyfork.org/scripts/456831/tinytanks.user.js
// @updateURL https://update.greasyfork.org/scripts/456831/tinytanks.meta.js
// ==/UserScript==

let detectedSocket = {};
let hookSocket = WebSocket;

WebSocket = function(...args) {
    detectedSocket = new hookSocket(...args);
    console.log(detectedSocket);
    setTimeout(() => {detect.change = 1}, 0);
    return detectedSocket;
};

let detect = new Proxy(detectedSocket, {
    set(useless1, useless2, useless3) {
        let reference = detectedSocket.onmessage;
        detectedSocket.onmessage = function(event) {
            reference.apply(this, arguments);
            console.log(event, detectedSocket);
        }
    }
});