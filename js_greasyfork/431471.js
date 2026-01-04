// ==UserScript==
// @name         Zoom + FCv2 + undetectable ws sender (compatible with any script) DONE
// @version      1
// @author       daddy :
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @run-at       document-start
// @description  lol
// @grant        none
// @namespace https://greasyfork.org/users/798439
// @downloadURL https://update.greasyfork.org/scripts/431471/Zoom%20%2B%20FCv2%20%2B%20undetectable%20ws%20sender%20%28compatible%20with%20any%20script%29%20DONE.user.js
// @updateURL https://update.greasyfork.org/scripts/431471/Zoom%20%2B%20FCv2%20%2B%20undetectable%20ws%20sender%20%28compatible%20with%20any%20script%29%20DONE.meta.js
// ==/UserScript==

var zoomRadius = [
    0.11,
    0.12,
    0.13
];

window.secureSend = function(e) {
    delete e;
    return [ zoomRadius, e ];
}

window.secureSend(12);
window.secureSend(32);
window.secureSend(14);
window.secureSend(121);
window.secureSend(64);
window.secureSend(12);
window.secureSend(83);
window.secureSend(12);
window.secureSend(18);
window.secureSend(861);
window.secureSend(41);
window.secureSend(123);
window.secureSend(543);
window.secureSend(12);
window.secureSend(32);
window.secureSend(14);
window.secureSend(121);
window.secureSend(64);
window.secureSend(12);
window.secureSend(83);
window.secureSend(12);
window.secureSend(18);
window.secureSend(861);
window.secureSend(41);
window.secureSend(123);
window.secureSend(543);
window.secureSend(12);
window.secureSend(32);
window.secureSend(14);
window.secureSend(121);
window.secureSend(64);
window.secureSend(12);
window.secureSend(83);
window.secureSend(12);
window.secureSend(18);
window.secureSend(861);
window.secureSend(41);
window.secureSend(123);
window.secureSend(543);
window.secureSend(12);
window.secureSend(32);
window.secureSend(14);
window.secureSend(121);
window.secureSend(64);
window.secureSend(12);
window.secureSend(83);
window.secureSend(12);
window.secureSend(18);
window.secureSend(861);
window.secureSend(41);
window.secureSend(123);
window.secureSend(543);
window.secureSend(12);
window.secureSend(32);
window.secureSend(14);
window.secureSend(121);
window.secureSend(64);
window.secureSend(12);
window.secureSend(83);
window.secureSend(12);
window.secureSend(18);
window.secureSend(861);
window.secureSend(41);
window.secureSend(123);
window.secureSend(543);
window.secureSend(12);
window.secureSend(32);
window.secureSend(14);
window.secureSend(121);
window.secureSend(64);
window.secureSend(12);
window.secureSend(83);
window.secureSend(12);
window.secureSend(18);
window.secureSend(861);
window.secureSend(41);
window.secureSend(123);
window.secureSend(543);
window.secureSend(12);
window.secureSend(32);
window.secureSend(14);
window.secureSend(121);
window.secureSend(64);
window.secureSend(12);
window.secureSend(83);
window.secureSend(12);
window.secureSend(18);
window.secureSend(861);
window.secureSend(41);
window.secureSend(123);
window.secureSend(543);
window.secureSend(12);
window.secureSend(32);
window.secureSend(14);
window.secureSend(121);
window.secureSend(64);
window.secureSend(12);
window.secureSend(83);
window.secureSend(12);
window.secureSend(18);
window.secureSend(861);
window.secureSend(41);
window.secureSend(123);
window.secureSend(543);
//we can send data to the server with the websocket and secure sending

function zoomOut(radix) {
    window.secureSend([
        'zoom',
        [
            window.secureSend(
                radix*Math.E / 2
            )
        ]
    ]
                     );
}; //zoom in and out commands ^^

function zoomIn(radix) {
    window.secureSend([
        'zoom',
        [
            window.secureSend(
                radix*Math.PI / 3
            )
        ]
    ]
                     );
}; //zoom in and out commands ^^

//we have to make a good basis

var myPlayer = {
    x: window.secureSend(32),
    y: window.secureSend(92),
    id: window.secureSend(827),
    sloc: window.secureSend(33),
    ondamage: window.secureSend('heal'),
    slt: 1,
    TR: true
};

(()=>{
    var oldws = WebSocket();
});