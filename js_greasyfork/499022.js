// ==UserScript==
// @name         Diep.io aim line from center to cursor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a black aim line from the center of the screen to the cursor in Diep.io idk because why no, turn on and off by "T" button. If its useful for you then nice, if not then ok.
// @author       Dust_Strifer
// @match        https://diep.io/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499022/Diepio%20aim%20line%20from%20center%20to%20cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/499022/Diepio%20aim%20line%20from%20center%20to%20cursor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // create a canvas element for drawing the line
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '1000';
    canvas.style.pointerEvents = 'none'; // add this line
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let isLineVisible = false;

    // function to draw the line
    function drawLine(x, y) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(window.innerWidth / 2, window.innerHeight / 2);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // event listener for mouse movement
    document.addEventListener('mousemove', (event) => {
        if (isLineVisible) {
            drawLine(event.clientX, event.clientY);
        }
    }, false); // capture = false

    // event listener for toggling the line with 'T' key
    document.addEventListener('keydown', (event) => {
        if (event.key === 't' || event.key === 'T') {
            isLineVisible = !isLineVisible;
            if (!isLineVisible) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, false); // capture = false
})();