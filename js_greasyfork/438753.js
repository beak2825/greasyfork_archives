// ==UserScript==
// @name         Disable Websockets
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Disables websockets
// @author       csalvato, Fast
// @include      *
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438753/Disable%20Websockets.user.js
// @updateURL https://update.greasyfork.org/scripts/438753/Disable%20Websockets.meta.js
// ==/UserScript==

WebSocket2 = WebSocket; /*eslint-disable-line*/

WebSocket = function(addy) { /*eslint-disable-line*/
    console.log('WS: Trying to open.');
    var ws;
    if (!this.blocked) {
        console.log('WS: Not blocked, allowing.');
        ws = new WebSocket2(addy);
        this.open_sockets.push(ws);
        return ws;
    } else {
        console.log('WS: Blocked.');
    }
};

WebSocket.toggle = function() {
    WebSocket.prototype.blocked = !WebSocket.prototype.blocked;
    var sockets = WebSocket.prototype.open_sockets;
    if (WebSocket.prototype.blocked) {
        console.log('WS: Blocking. Removing Old Sockets.');
        sockets.forEach(function(socket, index, sockets) {
            console.log("WS: Closing -", index);
            socket.close();
        });
        WebSocket.prototype.open_sockets = [];
        console.log("WS: Sockets left open -", WebSocket.prototype.open_sockets.length);
    } else {
        console.log("WS: Unblocking");
    }
};

WebSocket.prototype.close = function() {
    return true;
};

WebSocket.prototype.open_sockets = [];
WebSocket.prototype.blocked = true;