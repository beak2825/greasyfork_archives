// ==UserScript==
// @name         PP Bot Example
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Bot Exampe
// @author       Bambi1
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473155/PP%20Bot%20Example.user.js
// @updateURL https://update.greasyfork.org/scripts/473155/PP%20Bot%20Example.meta.js
// ==/UserScript==

function fix(a, b) {
    Object.defineProperty(window.console, a, {configurable:false,enumerable:true,writable:false,value:b});
}

fix('log', console.log);
fix('warn', console.warn);
fix('error', console.error);
fix('info', console.info);
const originalWebSocket = window.WebSocket;
var socket;

class WebSocketHook extends originalWebSocket {
    constructor(a, b) {
        super(a, b);
        socket = this;
    }
}

window.WebSocket = WebSocketHook;


function placePix(x, y, col) {
    socket.send(`42["p",[${x},${y},${col},1]]`);
}


function startingPos(x, y){
var three = 3;
var four = 4;
var color = 5;
placePix(x , y,color)
placePix(x+1, y+1,color)
placePix(x+2, y+2,color)
placePix(x+four,y+three,color)
}


document.addEventListener('keydown', function(event) {
    // Check if the pressed key is 'j'
    if (event.key === 'j') {
        // Get the element with the id "coordinates"
        var coordinatesElement = document.getElementById('coordinates');
        var coordinatesValue = coordinatesElement.textContent;
        // Split the coordinates value into x and y parts
        var [x, y] = coordinatesValue.split(',');
        //send the coordinates as integers
        startingPos(parseInt(x), parseInt(y));
    }
});