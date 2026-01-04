// ==UserScript==
// @name         Ben Surfers Bot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  easy game.
// @author       Yurtle
// @match        https://virtualwebsite.net/ben_subway/
// @icon         https://yurtle.net/yurtle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466104/Ben%20Surfers%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/466104/Ben%20Surfers%20Bot.meta.js
// ==/UserScript==

function colorClose(c1, c2, distance) {
    let cr = Math.abs(c1[0] - c2[0]);
    let cg = Math.abs(c1[1] - c2[1]);
    let cb = Math.abs(c1[2] - c2[2]);
    return cr + cg + cb < distance;
}

const moveQueue = []



function handleMovement() {
    let canvas = document.querySelector("#canvas");
    switch(moveQueue[0]) {
        case 'left':
            canvas.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowLeft', 'code': 'ArrowLeft'}));
            requestAnimationFrame(() => canvas.dispatchEvent(new KeyboardEvent('keyup', {'key': 'ArrowLeft', 'code': 'ArrowLeft'})));
            break;
        case 'right':
            canvas.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowRight', 'code': 'ArrowRight'}));
            requestAnimationFrame(() => canvas.dispatchEvent(new KeyboardEvent('keyup', {'key': 'ArrowRight', 'code': 'ArrowRight'})));
            break;
    }
    moveQueue.shift()
}

function convertBetweenScreenSizes(num, sizeOrig, sizeNew) {
    return Math.round(sizeNew * (num/sizeOrig));
}

function update(timestamp) {
    if (moveQueue.length == 1) {
        handleMovement();
        setTimeout(update, 200);
        return;
    } else if (moveQueue.length == 2) {
        handleMovement();
        requestAnimationFrame(update);
        return;
    }

    let canvas = document.querySelector("#canvas");
    let gl = canvas.getContext('webgl2');

    let pixels = [new Uint8Array(4), new Uint8Array(4), new Uint8Array(4),
                 new Uint8Array(4), new Uint8Array(4), new Uint8Array(4)];

    let results = []

    //console.log(canvas.height);
    let offset = 0;
    do {
        results = [];

        gl.readPixels((canvas.width/2) - convertBetweenScreenSizes(130, 975, canvas.height), (canvas.height/2) + 15, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels[0]);
        gl.readPixels(canvas.width/2, (canvas.height/2) + 15, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels[1]);
        gl.readPixels((canvas.width/2) + convertBetweenScreenSizes(130, 975, canvas.height), (canvas.height/2) + 15, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels[2]);
        gl.readPixels((canvas.width/2) - convertBetweenScreenSizes(130, 975, canvas.height) + offset, (canvas.height/2) - convertBetweenScreenSizes(26, 975, canvas.height), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels[3]);
        gl.readPixels((canvas.width/2) + offset, (canvas.height/2) - convertBetweenScreenSizes(21, 975, canvas.height), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels[4]);
        gl.readPixels((canvas.width/2) + convertBetweenScreenSizes(130, 975, canvas.height) + offset, (canvas.height/2) - convertBetweenScreenSizes(21, 975, canvas.height), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels[5]);

        results.push(colorClose(pixels[0], [71,71,71,255], 50));
        results.push(colorClose(pixels[1], [71,71,71,255], 50));
        results.push(colorClose(pixels[2], [71,71,71,255], 50));
        results.push(colorClose(pixels[3], [0,0,0,255], 50));
        results.push(colorClose(pixels[4], [0,0,0,255], 50));
        results.push(colorClose(pixels[5], [0,0,0,255], 50));

        offset++;
    } while (results.slice(3).filter(Boolean).length > 1 && offset < 5);

    //console.log(results);
    //requestAnimationFrame(update)
    //return;
    if (results[3] && results[0]) {
        if (results[1]) {
            moveQueue.push('right');
            moveQueue.push('right');
        } else {
            moveQueue.push('right');
        }
    } else if (results[4] && results[1]) {
        if (results[0]) {
            moveQueue.push('right');
        } else {
            moveQueue.push('left');
        }
    } else if (results[5] && results[2]) {
        if (results[1]) {
            moveQueue.push('left');
            moveQueue.push('left');
        } else {
            moveQueue.push('left');
        }
    }

    requestAnimationFrame(update)
}

(function() {
    'use strict';

    let canvas = document.querySelector("#canvas");
    canvas.addEventListener('keydown', (event) => console.log(event.key));

    let loadCheck = () => {
        if (canvas.width != 300) {
            update();
        }
        else {
            requestAnimationFrame(loadCheck);
        }
    }
    loadCheck();

})();