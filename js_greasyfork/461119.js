// ==UserScript==
// @name         Draw Shapes with Color and Line Thickness Options
// @namespace    http://tampermonkey
// @author       TN_Playz
// @version      1.5
// @description  Draw shapes using HTML5 Canvas with color and line thickness options. Keybinds: c = change color t = change width x = clear all
// @match        https://*
// @match        https://*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461119/Draw%20Shapes%20with%20Color%20and%20Line%20Thickness%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/461119/Draw%20Shapes%20with%20Color%20and%20Line%20Thickness%20Options.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    // Set up the canvas
    const ctx = canvas.getContext('2d');
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    let color = 'black';
    let thickness = 5;

    // Initialize the mouse position
    let mouseX = 0;
    let mouseY = 0;

    // Add event listeners to track the mouse position
    canvas.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    // Draw a shape at the current mouse position when the mouse button is clicked
    canvas.addEventListener('mousedown', () => {
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.moveTo(mouseX, mouseY);
        canvas.addEventListener('mousemove', onPaint);
    });

    // Stop drawing the shape when the mouse button is released
    canvas.addEventListener('mouseup', () => {
        canvas.removeEventListener('mousemove', onPaint);
    });

    // Draw a shape as the mouse is moved
    function onPaint() {
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
    }

    // Change the color when the 'c' key is pressed
    document.addEventListener('keydown', (event) => {
        if (event.key === 'c') {
            color = prompt('Enter a color name or hex code:', color);
        }
    });

    // Change the line thickness when the 't' key is pressed
    document.addEventListener('keydown', (event) => {
        if (event.key === 't') {
            thickness = prompt('Enter a line thickness (1-50):', thickness);
        }
    });

    // Clear the canvas when the 'x' key is pressed
    document.addEventListener('keydown', (event) => {
        if (event.key === 'x') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });
})();