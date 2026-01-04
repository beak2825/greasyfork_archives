// ==UserScript==
// @name         Drawaria Test Drawing Rapidest
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Sends rapid drawing messages
// @author       Edlande
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545605/Drawaria%20Test%20Drawing%20Rapidest.user.js
// @updateURL https://update.greasyfork.org/scripts/545605/Drawaria%20Test%20Drawing%20Rapidest.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Override WebSocket.prototype.send to intercept messages
    const originalSend = WebSocket.prototype.send;
    let sockets = [];

    WebSocket.prototype.send = function (...args) {
        if (sockets.indexOf(this) === -1) {
            sockets.push(this); // Store all WebSocket instances
            console.log('WebSocket intercepted:', this);
        }
        return originalSend.apply(this, args);
    };

    // Function to generate random coordinates
    function getRandomCoordinate() {
        return (Math.random() * 0.8 + 0.1).toFixed(4); // Random value between 0.1 and 0.9
    }

    // Function to generate random colors
    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r},${g},${b})`;
    }

    // Function to send ultra-rapid and complex drawing commands
    function sendUltraRapidDrawingCommands() {
        if (sockets.length === 0) {
            console.error('No WebSocket connections found!');
            return;
        }

        let count = 0;
        const interval = setInterval(() => {
            if (count >= 10000) { // Stop after 10,000 iterations
                clearInterval(interval);
                console.log('Stopped sending drawing commands.');
                return;
            }

            // Send messages through all available WebSocket connections
            sockets.forEach((socket) => {
                // Send 100 lines per iteration per socket
                for (let i = 0; i < 100; i++) {
                    const startX = getRandomCoordinate();
                    const startY = getRandomCoordinate();
                    const endX = getRandomCoordinate();
                    const endY = getRandomCoordinate();
                    const thickness = Math.floor(Math.random() * 50) + 1; // Random thickness between 1 and 50
                    const color = getRandomColor();

                    const message = `42["drawcmd",0,[${startX},${startY},${endX},${endY},false,${0 - thickness},"${color}",0,0,{}]]`;
                    socket.send(message);
                    console.log(`Sent drawing command: ${message}`);
                }
            });

            count++;
        }, 0); // Send messages as fast as possible (near-zero delay)
    }

    // Function to create additional WebSocket connections
    function createAdditionalSockets() {
        const serverUrl = 'wss://drawaria.online/socket.io/?EIO=3&transport=websocket';
        for (let i = 0; i < 5; i++) { // Create 5 additional WebSocket connections
            const newSocket = new WebSocket(serverUrl);
            newSocket.onopen = () => {
                console.log(`Additional WebSocket ${i + 1} connected.`);
                sockets.push(newSocket);
            };
            newSocket.onerror = (error) => {
                console.error(`Additional WebSocket ${i + 1} error:`, error);
            };
        }
    }

    // Add a button to trigger the ultra-rapid drawing commands
    function addButton() {
        const button = document.createElement('button');
        button.textContent = 'Start Rapid Drawing';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '450px';
        button.style.zIndex = 1000;
        button.style.padding = '10px';
        button.style.backgroundColor = '#FF0000';
        button.style.color = '#FFFFFF';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', () => {
            createAdditionalSockets(); // Create additional WebSocket connections
            setTimeout(sendUltraRapidDrawingCommands, 1000); // Start sending commands after 1 second
        });

        document.body.appendChild(button);
    }

    // Wait for the page to load, then add the button
    window.addEventListener('load', () => {
        addButton();
    });
})();