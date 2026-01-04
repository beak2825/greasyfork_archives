// ==UserScript==
// @name         Drawaria 3D Cube
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  3D rotating cube for drawaria.online
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @icon         https://drawaria.online/avatar/cache/86e33830-86ea-11ec-8553-bff27824cf71.jpg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525298/Drawaria%203D%20Cube.user.js
// @updateURL https://update.greasyfork.org/scripts/525298/Drawaria%203D%20Cube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create cube container
    const cubeContainer = document.createElement('div');
    cubeContainer.style.position = 'fixed';
    cubeContainer.style.top = '20px';
    cubeContainer.style.right = '20px';
    cubeContainer.style.zIndex = '9999';
    cubeContainer.style.cursor = 'move'; // Change cursor to indicate draggable

    // Create cube element
    const cube = document.createElement('div');
    cube.className = 'cube';

    // Create cube faces
    const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
    faces.forEach(face => {
        const faceDiv = document.createElement('div');
        faceDiv.className = face;
        cube.appendChild(faceDiv);
    });

    // Add elements to page
    cubeContainer.appendChild(cube);
    document.body.appendChild(cubeContainer);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .cube {
            width: 100px;
            height: 100px;
            position: relative;
            transform-style: preserve-3d;
            animation: rotate 5s infinite linear;
        }
        .cube div {
            position: absolute;
            width: 100px;
            height: 100px;
            background-color: rgba(0, 0, 0, 0.8);
            border: 1px solid #fff;
        }
        .front  { transform: translateZ(50px); }
        .back   { transform: rotateY(180deg) translateZ(50px); }
        .right  { transform: rotateY(90deg) translateZ(50px); }
        .left   { transform: rotateY(-90deg) translateZ(50px); }
        .top    { transform: rotateX(90deg) translateZ(50px); }
        .bottom { transform: rotateX(-90deg) translateZ(50px); }
        @keyframes rotate {
            0% { transform: rotateX(0deg) rotateY(0deg); }
            100% { transform: rotateX(360deg) rotateY(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Add keyboard controls
    let rotationSpeed = 5;
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp') {
            rotationSpeed = Math.max(0.5, rotationSpeed - 0.5);
            cube.style.animationDuration = `${rotationSpeed}s`;
        } else if (event.key === 'ArrowDown') {
            rotationSpeed += 0.5;
            cube.style.animationDuration = `${rotationSpeed}s`;
        }
    });

    // Drag and drop functionality
    let isDragging = false;
    let offsetX, offsetY;

    cubeContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - cubeContainer.getBoundingClientRect().left;
        offsetY = e.clientY - cubeContainer.getBoundingClientRect().top;
        cubeContainer.style.transition = 'none'; // Disable transition during drag
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            cubeContainer.style.left = `${x}px`;
            cubeContainer.style.top = `${y}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        cubeContainer.style.transition = ''; // Re-enable transition
    });
})();
