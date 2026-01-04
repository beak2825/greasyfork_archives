// ==UserScript==
// @name         Drawaria Transitions
// @namespace    Transitions using drawing commands and a draggable menu
// @version      2024.10.27
// @description  Adds transition effects to the drawing canvas in Drawaria.Online with an improved menu
// @author       YouTubeDrawaria
// @match        *://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524312/Drawaria%20Transitions.user.js
// @updateURL https://update.greasyfork.org/scripts/524312/Drawaria%20Transitions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to send the draw command (covering the entire screen)
    function sendDrawCommand(x1, y1, x2, y2, color, size = 100000) { // Extremely large default size
        let message = `42["drawcmd",0,[${x1},${y1},${x2},${y2},false,${size},"${color}",0,0,{}]]`;
        window.sockets.forEach(socket => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(message);
            }
        });
    }

    // Overriding the WebSocket send method to capture sockets
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (window.sockets.indexOf(this) === -1) {
            window.sockets.push(this);
        }
        return originalSend.call(this, ...args);
    };

    // Initializing
    window.sockets = [];

    // Function to create a transition effect
    function createTransition(name, effectFunction) {
        return {
            name,
            effectFunction
        };
    }

    // Transition effects
    const transitions = [
        createTransition('Slide Right', (color, duration = 1000) => {
            let start = null;
            const animate = timestamp => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const canvas = document.querySelector('canvas');
                if (!canvas) return;
                const offset = Math.round((progress / duration) * canvas.width);
                sendDrawCommand(0, 0, canvas.width - offset, canvas.height, color);
                if (progress < duration) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }),
        createTransition('Slide Down', (color, duration = 1000) => {
            let start = null;
            const animate = timestamp => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const canvas = document.querySelector('canvas');
                if (!canvas) return;
                const offset = Math.round((progress / duration) * canvas.height);
                sendDrawCommand(0, 0, canvas.width, canvas.height - offset, color);
                if (progress < duration) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }),
        createTransition('Slide Left', (color, duration = 1000) => {
            let start = null;
            const animate = timestamp => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const canvas = document.querySelector('canvas');
                if (!canvas) return;
                const offset = Math.round((progress / duration) * canvas.width);
                sendDrawCommand(offset, 0, canvas.width, canvas.height, color);
                if (progress < duration) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }),
        createTransition('Slide Up', (color, duration = 1000) => {
            let start = null;
            const animate = timestamp => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const canvas = document.querySelector('canvas');
                if (!canvas) return;
                const offset = Math.round((progress / duration) * canvas.height);
                sendDrawCommand(0, offset, canvas.width, canvas.height, color);
                if (progress < duration) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }),
        createTransition('Slide Diagonal Top-Left', (color, duration = 1000) => {
            let start = null;
            const animate = timestamp => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const canvas = document.querySelector('canvas');
                if (!canvas) return;
                const offset = Math.round((progress / duration) * Math.min(canvas.width, canvas.height));
                sendDrawCommand(offset, 0, canvas.width, offset, color);
                if (progress < duration) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }),
        createTransition('Slide Diagonal Top-Right', (color, duration = 1000) => {
            let start = null;
            const animate = timestamp => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const canvas = document.querySelector('canvas');
                if (!canvas) return;
                const offset = Math.round((progress / duration) * Math.min(canvas.width, canvas.height));
                sendDrawCommand(0, 0, canvas.width - offset, offset, color);
                if (progress < duration) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }),
        createTransition('Slide Diagonal Bottom-Left', (color, duration = 1000) => {
            let start = null;
            const animate = timestamp => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const canvas = document.querySelector('canvas');
                if (!canvas) return;
                const offset = Math.round((progress / duration) * Math.min(canvas.width, canvas.height));
                sendDrawCommand(offset, canvas.height - offset, canvas.width, canvas.height, color);
                if (progress < duration) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }),
        createTransition('Slide Diagonal Bottom-Right', (color, duration = 1000) => {
            let start = null;
            const animate = timestamp => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const canvas = document.querySelector('canvas');
                if (!canvas) return;
                const offset = Math.round((progress / duration) * Math.min(canvas.width, canvas.height));
                sendDrawCommand(0, canvas.height - offset, canvas.width - offset, canvas.height, color);
                if (progress < duration) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }),
        createTransition('Slide Vertical Split', (color, duration = 1000) => {
            let start = null;
            const animate = timestamp => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const canvas = document.querySelector('canvas');
                if (!canvas) return;
                const offset = Math.round((progress / duration) * canvas.height / 2);
                sendDrawCommand(0, 0, canvas.width, canvas.height / 2 - offset, color);
                sendDrawCommand(0, canvas.height / 2 + offset, canvas.width, canvas.height, color);
                if (progress < duration) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }),
        createTransition('Slide Horizontal Split', (color, duration = 1000) => {
            let start = null;
            const animate = timestamp => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const canvas = document.querySelector('canvas');
                if (!canvas) return;
                const offset = Math.round((progress / duration) * canvas.width / 2);
                sendDrawCommand(0, 0, canvas.width / 2 - offset, canvas.height, color);
                sendDrawCommand(canvas.width / 2 + offset, 0, canvas.width, canvas.height, color);
                if (progress < duration) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }),
        createTransition('Slide In from Center', (color, duration = 1000) => {
            let start = null;
            const animate = timestamp => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const canvas = document.querySelector('canvas');
                if (!canvas) return;
                const offset = Math.round((progress / duration) * Math.min(canvas.width, canvas.height) / 2);
                sendDrawCommand(canvas.width / 2 - offset, 0, canvas.width / 2 + offset, canvas.height, color);
                if (progress < duration) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }),
        createTransition('Slide Out to Center', (color, duration = 1000) => {
            let start = null;
            const animate = timestamp => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const canvas = document.querySelector('canvas');
                if (!canvas) return;
                const offset = Math.round((1 - progress / duration) * Math.min(canvas.width, canvas.height) / 2);
                sendDrawCommand(canvas.width / 2 - offset, 0, canvas.width / 2 + offset, canvas.height, color);
                if (progress < duration) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }),
        createTransition('Slide In from Corners', (color, duration = 1000) => {
            let start = null;
            const animate = timestamp => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const canvas = document.querySelector('canvas');
                if (!canvas) return;
                const offset = Math.round((progress / duration) * Math.min(canvas.width, canvas.height) / 2);
                sendDrawCommand(0, 0, offset, offset, color);
                sendDrawCommand(canvas.width - offset, 0, canvas.width, offset, color);
                sendDrawCommand(0, canvas.height - offset, offset, canvas.height, color);
                sendDrawCommand(canvas.width - offset, canvas.height - offset, canvas.width, canvas.height, color);
                if (progress < duration) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }),
        createTransition('Slide Out to Corners', (color, duration = 1000) => {
            let start = null;
            const animate = timestamp => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const canvas = document.querySelector('canvas');
                if (!canvas) return;
                const offset = Math.round((1 - progress / duration) * Math.min(canvas.width, canvas.height) / 2);
                sendDrawCommand(0, 0, offset, offset, color);
                sendDrawCommand(canvas.width - offset, 0, canvas.width, offset, color);
                sendDrawCommand(0, canvas.height - offset, offset, canvas.height, color);
                sendDrawCommand(canvas.width - offset, canvas.height - offset, canvas.width, canvas.height, color);
                if (progress < duration) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }),
        createTransition('Slide In from Top and Bottom', (color, duration = 1000) => {
            let start = null;
            const animate = timestamp => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const canvas = document.querySelector('canvas');
                if (!canvas) return;
                const offset = Math.round((progress / duration) * canvas.height / 2);
                sendDrawCommand(0, 0, canvas.width, offset, color);
                sendDrawCommand(0, canvas.height - offset, canvas.width, canvas.height, color);
                if (progress < duration) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }),
        createTransition('Slide Out to Top and Bottom', (color, duration = 1000) => {
            let start = null;
            const animate = timestamp => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const canvas = document.querySelector('canvas');
                if (!canvas) return;
                const offset = Math.round((1 - progress / duration) * canvas.height / 2);
                sendDrawCommand(0, 0, canvas.width, offset, color);
                sendDrawCommand(0, canvas.height - offset, canvas.width, canvas.height, color);
                if (progress < duration) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        })
    ];

    // Function to create the menu
    function createMenu(title, items) {
        const menu = document.createElement('div');
        menu.id = 'transitionMenu';
        menu.innerHTML = `
            <div id="menuHeader">
                <h3>${title}</h3>
                <div id="closeButton">X</div>
            </div>
            <div id="menuItems">
                <input type="color" id="colorInput" value="#000000">
                <div id="buttonGrid">
                    ${items.map(item => `<button data-transition="${item.name}" data-duration="1000">${item.name}</button>`).join('')}
                </div>
            </div>
        `;

        // Adding styles to the menu (inline for easy copy and paste)
        menu.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
            z-index: 1000; /* Ensure it is above the canvas */
            width: 220px;
            max-height: 400px;
            overflow-y: auto;
        `;

        // Grid layout for buttons
        const buttonGrid = menu.querySelector('#buttonGrid');
        buttonGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        `;

        // Menu events
        menu.querySelector('#closeButton').addEventListener('click', () => {
            menu.remove();
        });

        menu.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                const transitionName = button.dataset.transition;
                const duration = parseInt(button.dataset.duration, 10);
                const color = document.getElementById('colorInput').value;
                const transition = transitions.find(t => t.name === transitionName);
                if (transition) {
                    transition.effectFunction(color, duration);
                }
            });
        });

        // Dragging the menu
        let isDragging = false;
        let offsetX, offsetY;
        menu.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - menu.offsetLeft;
            offsetY = e.clientY - menu.offsetTop;
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                menu.style.left = (e.clientX - offsetX) + 'px';
                menu.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.body.appendChild(menu);
    }

    const menuItems = transitions.map(transition => ({ name: transition.name }));
    createMenu('Drawaria Transitions', menuItems);
})();
