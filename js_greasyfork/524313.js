// ==UserScript==
// @name         Drawaria Draggable Action Menu Safe Version
// @namespace    http://tampermonkey.net/
// @version      2024-05-20
// @description  Adds a draggable menu with a button to perform autokick actions using WebSockets and shows an alert when kicked.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524313/Drawaria%20Draggable%20Action%20Menu%20Safe%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/524313/Drawaria%20Draggable%20Action%20Menu%20Safe%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const EL = (sel) => document.querySelector(sel);
    const ELL = (sel) => document.querySelectorAll(sel);

    // WebSocket Prototype Override
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (window.sockets.indexOf(this) === -1) {
            window.sockets.push(this);
            if (window.sockets.indexOf(this) === 0) {
                this.addEventListener('message', (event) => {
                    let message = String(event.data);
                    if (message.startsWith('42')) {
                        let payload = JSON.parse(message.slice(2));
                        handleMessage(payload);
                    }
                });
            }
        }
        return originalSend.call(this, ...args);
    };

    function handleMessage(payload) {
        if (payload[0] === 'bc_clientnotify' && payload[1] === 12) {
            console.log('Received client notify:', payload);
            // Handle the client notify message if needed
        }
    }

    // Add Stylesheet
    function CreateStylesheet() {
        let container = document.createElement('style');
        container.innerHTML = `
            .action-menu {
                position: absolute;
                top: 226.969px;
                left: 30px;
                display: flex;
                flex-direction: column;
                align-items: center;
                background: linear-gradient(135deg, #8e2de2, #4a00e0);
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                animation: fadeIn 0.5s ease-in-out;
            }
            .action-button {
                margin: 10px;
                padding: 15px 20px;
                cursor: pointer;
                background: linear-gradient(135deg, #ffd700, #ffb90f);
                color: white;
                border: none;
                border-radius: 5px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .action-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
            }
            .draggable {
                cursor: move;
            }
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(container);
    }

    // Add Action Menu
    function addActionMenu() {
        let actionMenu = document.createElement('div');
        actionMenu.className = 'action-menu draggable';
        actionMenu.id = 'action-menu';

        let autoKickButton = document.createElement('button');
        autoKickButton.className = 'action-button btn btn-light btn-block btn-sm autokickbutton';
        autoKickButton.textContent = 'AutoKick';
        autoKickButton.addEventListener('click', () => sendAction('autoKick'));

        actionMenu.appendChild(autoKickButton);

        document.body.appendChild(actionMenu);

        makeDraggable(actionMenu);
    }

    // Send Action via WebSocket
    function sendAction(actionType) {
        if (actionType === 'autoKick') {
            window['___BOT'].room.join('');
            alert("You have been kicked!"); // Show action
        }
    }

    // Make an element draggable
    function makeDraggable(element) {
        let isDragging = false;
        let offsetX, offsetY;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                element.style.left = `${e.clientX - offsetX}px`;
                element.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            element.style.cursor = 'grab';
        });
    }

    // Initialize
    function init() {
        window.sockets = [];
        CreateStylesheet();
        addActionMenu();

        // Define the server URL
        let serverurl = `wss://sv2.drawaria.online/socket.io/?sid1=s%3A11JLEUID6B8TEN3-RCEDSV1h8ZzvoF3a.99s79DOPC%2Fb2ajOJBEBNkhMT0Z1FSm8jzcCGzohk%2FeI&hostname=drawaria.online&EIO=3&transport=websocket`;
        this.conn.serverconnect(serverurl);
    };

    var nullify = (value = null) => {
        return value == null ? null : String().concat('"', value, '"');
    };

    init();
})();