// ==UserScript==
// @name         BMO BOT 9000
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Print Images!!!!!!
// @author       Bambi1
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473222/BMO%20BOT%209000.user.js
// @updateURL https://update.greasyfork.org/scripts/473222/BMO%20BOT%209000.meta.js
// ==/UserScript==
let chatting = false;

// Your pixel array here(delete the brackets[])
const pixelArray = [
       [50 ,50 ,50 ,50 ,50 ,37 ,37, 37, 37, 37, 37, 37, 37, 37, 36, 36, 36, 36, 36],//1
 [50, 50, 50, 50, 50, 37, 48, 48, 48, 48, 48, 48, 48, 37, 36, 36, 36, 36, 36],//2
 [50, 50, 50, 50, 50, 37, 48, 5, 48, 48, 48, 5, 48, 37, 36, 36, 36, 36, 36],//3
 [50, 50, 50, 50, 50, 37, 48, 48, 48, 48, 48, 48, 48, 37, 36, 36, 36, 36, 36],//4
 [50, 50, 50, 50, 50, 37, 48, 5, 5, 5, 5, 5, 48, 37, 36, 36, 36, 36 ,36],//5
 [50, 37, 50, 50, 50, 37, 48, 48, 5, 5, 5, 48, 48, 37, 36, 36, 36, 36, 36],//6
 [50, 37, 50, 50, 50, 37, 48, 48, 48, 48, 48, 48, 48, 37, 36, 36, 36, 36, 36],//7
 [50, 50, 37, 50, 50, 37, 37, 37, 37, 37, 37, 37, 37, 37, 36, 36, 36, 36, 36],//8
 [50, 50, 50, 37, 37, 37, 3, 3, 3, 3, 3, 37, 44, 37, 36, 47, 36, 36, 36],//9
 [50, 50, 50, 50, 50, 37, 37, 37, 37, 37, 37, 37, 37, 37, 36, 47, 36, 36, 36],//10
 [50, 50, 50, 50, 50, 37, 37, 11, 37, 37, 37, 37, 37, 37, 36, 47, 36, 36, 36],//11
 [50, 50, 50, 50, 50, 37, 11, 11, 11, 37, 37, 37, 37, 37, 36, 47, 36, 36, 36],//12
 [50, 50, 50, 50, 50, 37, 37, 11, 37, 37, 37, 32, 37, 37, 36, 47, 36, 36, 36],//13
 [50, 50, 50, 50, 50, 37, 37, 37, 37, 37, 20, 37, 7, 37, 36, 36, 36, 36, 36],//14
 [50, 50, 50, 50, 50, 37, 37, 37, 37, 37, 37, 37, 37, 37, 36, 36, 36, 36, 36],//15
 [50, 50, 50, 50, 50, 37, 37, 37, 37, 37, 37, 37, 37, 37, 36, 36, 36, 36, 36],//16
 [50, 50, 50, 50, 50, 50, 50, 37, 36, 50, 50, 50, 50, 50, 37, 36, 50, 50, 50, 50],//17
 [50, 50, 50, 50, 50, 50, 50, 37, 36, 50, 50, 50, 50, 50, 37, 36, 50, 50, 50, 50],//18
 [50, 50, 50, 50, 50, 50, 50, 37, 36, 50, 50, 50, 50, 50, 37, 36, 50, 50, 50, 50],//19
        // Add more rows as needed
    ];
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
    if (event.key === 'j' & !chatting) {
        // Get the element with the id "coordinates"
        var coordinatesElement = document.getElementById('coordinates');
        var coordinatesValue = coordinatesElement.textContent;
        // Split the coordinates value into x and y parts
        var [x, y] = coordinatesValue.split(',');
        // Call the BMO function with the extracted x and y values
        console.log(parseInt(x), parseInt(y));
        image(parseInt(x), parseInt(y));
    }
});

function image(SX, SY) {

    const delayBetweenPixels = 25; // Adjust this value as needed

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