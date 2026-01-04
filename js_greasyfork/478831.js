// ==UserScript==
// @name         BMO BOT 9000 (AMOGUS edition)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @Liscence     MIT
// @description  Print Images!!!!!!
// @author       Bambi1
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478831/BMO%20BOT%209000%20%28AMOGUS%20edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/478831/BMO%20BOT%209000%20%28AMOGUS%20edition%29.meta.js
// ==/UserScript==
let chatting = false;

// Your pixel array here(delete the brackets[])
const pixelArray = [[50,50,50,50,50,5,5,5,5,5,5,5,50,50,50],[50,50,50,50,5,20,20,20,20,20,20,20,5,50,50],[50,50,50,5,19,20,20,20,20,20,20,20,20,5,50],[50,50,50,5,19,20,20,20,20,20,20,20,20,5,50],[50,5,5,5,19,20,20,4,4,4,4,4,4,4,50],[5,20,20,5,19,20,4,40,48,48,48,0,0,0,4],[5,20,19,5,19,20,4,40,48,48,48,48,48,48,4],[5,19,19,5,19,20,4,40,40,40,40,40,40,40,4],[5,19,19,5,19,20,20,4,4,4,4,4,4,4,50],[5,19,19,5,19,19,20,20,20,20,20,20,19,5,50],[5,19,19,5,19,19,19,20,20,20,20,19,19,5,50],[5,19,19,5,19,19,19,19,19,19,19,19,19,5,50],[5,19,19,5,19,19,19,19,19,19,19,19,19,5,50],[50,5,5,5,19,19,19,19,19,19,5,19,19,5,50],[50,50,50,5,19,19,19,5,5,5,19,19,19,5,50],[50,50,50,5,19,19,19,5,50,5,19,19,19,5,50],[50,50,50,5,5,5,5,5,50,5,5,5,5,5,50]];
//^^^^^^^^^^^^^^^^^^^
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

document.addEventListener('keydown', function(event) {
    // Check if the pressed key is 'j'
    if (event.key === '`' & !chatting) {
        // Get the element with the id "coordinates"
        var coordinatesElement = document.getElementById('coordinates');
        var coordinatesValue = coordinatesElement.textContent;
        // Split the coordinates value into x and y parts
        var [x, y] = coordinatesValue.split(',');
        // Call the BMO function with the extracted x and y values
        console.log(parseInt(x-8), parseInt(y-9));
        image(parseInt(x-8), parseInt(y-9));
    }
});

function image(SX, SY) {

    const delayBetweenPixels = 0; // Adjust this value as needed

    let rowIndex = 0;
    function placeNextRow() {
        if (rowIndex < pixelArray.length) {
            const row = pixelArray[rowIndex];
            let columnIndex = 0;

            function placeNextPixel() {
                if (columnIndex < row.length) {
                    const col = row[columnIndex];
                    // Check if the color is not 50 before placing the pixel
                    if (col !== 50) {
                        placePix(SX + columnIndex, SY + rowIndex, col);
                    }
                    columnIndex++;
                    if (col === 50) {
                        placeNextPixel(); // Skip the delay for color 50
                    } else {
                        setTimeout(placeNextPixel, delayBetweenPixels);
                    }
                } else {
                    rowIndex++;
                    placeNextRow();
                }
            }

            placeNextPixel();
        }
    }

    // Start placing pixels
    placeNextRow();
}
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    const chatInput = document.querySelector('input[name="chat"]');
    let chatting = false;

    chatInput.addEventListener('focus', () => {
        chatting = true;
        console.log("chatting");
    });

    chatInput.addEventListener('blur', () => {
        console.log("unchatting");
        chatting = false;
    });
});