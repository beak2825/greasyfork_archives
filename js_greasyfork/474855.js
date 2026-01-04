// ==UserScript==
// @name         Textwall script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  textwall script :OO
// @author       You
// @match        https://textwall.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=textwall.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474855/Textwall%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/474855/Textwall%20script.meta.js
// ==/UserScript==

function send(obj) {
  ws._send(new Uint8Array([...msgpack.encode(obj), 0x81]));
}
let msgpackScript = document.createElement("script");
msgpackScript.src = "https://files.catbox.moe/513s54.js";
document.body.appendChild(msgpackScript);
msgpackScript.onload = _ => start();
twevents = [];
function start() {
    if(!WebSocket.prototype._send) {
        WebSocket.prototype._send = WebSocket.prototype.send;
        WebSocket.prototype.send = function(data) {
          window.ws = this;
          this._send(data);
        }
        try{WebSocket.prototype.send()}catch(e){console.log("ws loaded")};
    };
    let interval = setInterval(function() {
        if(!+document.getElementById("connecting").style.opacity) {
            if(!ws._onmessage) ws._onmessage = ws.onmessage;
            ws.onmessage = e => {
                if(msgpack.decode(new Uint8Array(e.data)).cu) {
                    if(msgpack.decode(new Uint8Array(e.data)).cu.l) for(let i of twevents.filter(x=>x[0]=="moveCursor")) i[1](msgpack.decode(new Uint8Array(e.data)).cu);
                }
                else if(msgpack.decode(new Uint8Array(e.data)).e) {
                    for(let i of twevents.filter(x=>x[0]=="write")) i[1](msgpack.decode(new Uint8Array(e.data)).e.e);
                }
                ws._onmessage(e);
            }
            clearInterval(interval);
        };
    });
    window.writeCharTo = function(letter, color, tileX, tileY, charX, charY) {
        let index = charY * 20 + charX;
        send({ce: {l: [tileX * 20 + charX, tileY * 10 + charY]}});
        send({e: [[tileX, tileY, letter.charCodeAt(), charY * 20 + charX, color]]});
    }
    window.xyToIndex = function(x, y) {
        return y * 20 + x;
    }
    window.indexToXY = function(index) {
        return [index % 20, Math.floor(index / 20)];
    }
    window.onMoveCursor = function(func) {
        twevents.push(["moveCursor",func]);
    }
    window.onWrite = function(func) {
        twevents.push(["write",func]);
    }
}