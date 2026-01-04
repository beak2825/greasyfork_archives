// ==UserScript==
// @name         Replace Textures with Image and Enable Drawing
// @version      1.1
// @description  Replace all textures with a specified image, enable shared canvas mode, and add drawing functionality
// @namespace    drawaria.modded.fullspec
// @match        https://drawaria.online/*
// @icon         https://avatars.mds.yandex.net/i?id=8a612a95f6c487f413ccb39d2dbc5b830607620c-4055806-images-thumbs&n=13
// @downloadURL https://update.greasyfork.org/scripts/521461/Replace%20Textures%20with%20Image%20and%20Enable%20Drawing.user.js
// @updateURL https://update.greasyfork.org/scripts/521461/Replace%20Textures%20with%20Image%20and%20Enable%20Drawing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const imageUrl = 'https://avatars.mds.yandex.net/i?id=8a612a95f6c487f413ccb39d2dbc5b830607620c-4055806-images-thumbs&n=13'; // URL of your image
    const canvasImageUrl = 'https://avatars.mds.yandex.net/i?id=8a612a95f6c487f413ccb39d2dbc5b830607620c-4055806-images-thumbs&n=13'; // URL for the drawing canvas
    const socket = new WebSocket('wss://your-websocket-server-url'); // Replace with your WebSocket server URL

    // Function to replace all background textures
    function replaceTextures() {
        const elements = document.querySelectorAll('*'); // Get all elements on the page
        elements.forEach(element => {
            // Replace background image if it exists
            const backgroundImage = getComputedStyle(element).backgroundImage;
            if (backgroundImage && backgroundImage !== 'none') {
                element.style.backgroundImage = `url(${imageUrl})`;
                element.style.backgroundSize = 'cover'; // Set the image size
                element.style.backgroundRepeat = 'no-repeat'; // Prevent repeating
                element.style.backgroundPosition = 'center'; // Center the image
            }

            // Check for the drawing canvas element
            if (element.id === 'canvas' || element.classList.contains('canvas-drawer')) {
                element.style.backgroundImage = `url(${canvasImageUrl})`;
                element.style.backgroundSize = 'cover';
                element.style.backgroundRepeat = 'no-repeat';
                element.style.backgroundPosition = 'center';
            }
        });
    }

    // Function to enable shared mode
    function enableSharedMode() {
        // Listen for messages from the WebSocket server
        socket.addEventListener('message', function(event) {
            const data = JSON.parse(event.data);
            if (data.type === 'canvasBackground') {
                // Update canvas background with the shared image URL
                const canvas = document.getElementById('canvas') || document.querySelector('.canvas-drawer');
                if (canvas) {
                    canvas.style.backgroundImage = `url(${data.url})`;
                    canvas.style.backgroundSize = 'cover';
                    canvas.style.backgroundRepeat = 'no-repeat';
                    canvas.style.backgroundPosition = 'center';
                }
            } else if (data.type === 'draw') {
                const canvas = document.getElementById('canvas') || document.querySelector('.canvas-drawer');
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    ctx.strokeStyle = data.color;
                    ctx.lineWidth = data.lineWidth;
                    ctx.lineTo(data.x, data.y);
                    ctx.stroke();
                }
            }
        });

        // Send the initial canvas background image URL to the server
        socket.addEventListener('open', function() {
            socket.send(JSON.stringify({ type: 'canvasBackground', url: canvasImageUrl }));
        });
    }

    // Drawing functionality
    function setupDrawing() {
        const canvas = document.getElementById('canvas') || document.querySelector('.canvas-drawer');
        const ctx = canvas.getContext('2d');
        let drawing = false;

        canvas.addEventListener('mousedown', (event) => {
            drawing = true;
            ctx.beginPath();
            ctx.moveTo(event.offsetX, event.offsetY);
        });

        canvas.addEventListener('mousemove', (event) => {
            if (drawing) {
                const color = document.getElementById('colorPicker').value || '#000000';
                const lineWidth = document.getElementById('lineWidth').value || 5;

                const data = {
                    type: 'draw',
                    x: event.offsetX,
                    y: event.offsetY,
                    color: color,
                    lineWidth: lineWidth
                };
                socket.send(JSON.stringify(data));

                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;
                ctx.lineTo(event.offsetX, event.offsetY);
                ctx.stroke();
            }
        });

        canvas.addEventListener('mouseup', () => {
            drawing = false;
            ctx.closePath();
        });

        canvas.addEventListener('mouseleave', () => {
            drawing = false;
            ctx.closePath();
        });

        // Add profile image to the canvas
        const img = new Image();
        img.src = 'https://avatars.mds.yandex.net/i?id=8a612a95f6c487f413ccb39d2dbc5b830607620c-4055806-images-thumbs&n=13';
        img.onload = () => {
            ctx.drawImage(img, 10, 10, 30, 30); // Draw avatar in the top left corner
        };
    }

    // Execute the texture replacement and enable drawing
    replaceTextures();
    enableSharedMode();
    setupDrawing();
})();
