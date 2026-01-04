// ==UserScript==
// @name         Drawaria Shape Animator 3.0
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Enhanced shape animations with more features and shapes.
// @author       YourName
// @match        *://drawaria.online/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536149/Drawaria%20Shape%20Animator%2030.user.js
// @updateURL https://update.greasyfork.org/scripts/536149/Drawaria%20Shape%20Animator%2030.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // CSS for the menu
    const style = document.createElement('style');
    style.textContent = `
        .menu {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #333;
            color: #eee;
            padding: 10px;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            cursor: move;
            width: 300px;
            overflow-y: auto;
            max-height: 80vh;
        }
        .menu h1 {
            margin: 0 0 10px 0;
            font-size: 18px;
            text-align: center;
        }
        .menu label {
            display: block;
            margin-bottom: 5px;
        }
        .menu input[type="range"], .menu input[type="color"] {
            width: calc(100% - 10px);
        }
        .menu button {
            display: block;
            width: 100%;
            margin: 5px 0;
            padding: 8px;
            background-color: #555;
            color: #eee;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        .menu button:hover {
            background-color: #777;
        }
        .menu-toggle {
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            color: #eee;
            font-size: 20px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // Function to send draw commands
    function sendDrawCommand(startX, startY, endX, endY, thickness, color) {
        const message = `42["drawcmd",0,[${startX},${startY},${endX},${endY},false,${0 - thickness},"${color}",0,0,{}]]`;
        try {
            sockets.forEach(socket => socket.send(message));
        } catch (error) {
            console.error("Error sending draw command:", error);
        }
    }

    // Shape drawing functions
    function drawCircle(x, y, radius, color, thickness, fill = false) {
        const angleIncrement = (2 * Math.PI) / 32;
        if (fill) {
            // Fill Circle Logic Here (if supported)
        }
        for (let i = 0; i < 32; i++) {
            const angle1 = i * angleIncrement;
            const angle2 = (i + 1) * angleIncrement;
            const startX = x + radius * Math.cos(angle1);
            const startY = y + radius * Math.sin(angle1);
            const endX = x + radius * Math.cos(angle2);
            const endY = y + radius * Math.sin(angle2);
            sendDrawCommand(startX, startY, endX, endY, thickness, color);
        }
    }

    function drawPolygon(x, y, size, sides, color, thickness) {
        const angleIncrement = (2 * Math.PI) / sides;
        for (let i = 0; i < sides; i++) {
            const angle1 = i * angleIncrement;
            const angle2 = (i + 1) * angleIncrement;
            const startX = x + size * Math.cos(angle1);
            const startY = y + size * Math.sin(angle1);
            const endX = x + size * Math.cos(angle2);
            const endY = y + size * Math.sin(angle2);
            sendDrawCommand(startX, startY, endX, endY, thickness, color);
        }
    }

    function drawSpiral(x, y, maxRadius, turns, color, thickness) {
        const segments = 100;
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * turns * 2 * Math.PI;
            const radius = (i / segments) * maxRadius;
            const startX = x + radius * Math.cos(angle);
            const startY = y + radius * Math.sin(angle);
            if (i > 0) {
                sendDrawCommand(prevX, prevY, startX, startY, thickness, color);
            }
            prevX = startX;
            prevY = startY;
        }
    }

    // Store active shapes for undo/redo
    let actions = [];
    let redoActions = [];

    function recordAction(action) {
        actions.push(action);
        redoActions = [];
    }

    // Menu creation
    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.innerHTML = `<h1>Drawaria Shape Animator</h1>`;

    // Toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'menu-toggle';
    toggleButton.textContent = '▼';
    toggleButton.addEventListener('click', () => {
        if (menuContent.style.display === 'none') {
            menuContent.style.display = 'block';
            toggleButton.textContent = '▲';
        } else {
            menuContent.style.display = 'none';
            toggleButton.textContent = '▼';
        }
    });
    menu.appendChild(toggleButton);

    // Menu content
    const menuContent = document.createElement('div');
    menuContent.style.display = 'none';

    // Shape buttons
    const shapes = {
        'Circle': drawCircle,
        'Square': (x, y, size, color, thickness) => drawPolygon(x, y, size, 4, color, thickness),
        'Triangle': (x, y, size, color, thickness) => drawPolygon(x, y, size, 3, color, thickness),
        'Pentagon': (x, y, size, color, thickness) => drawPolygon(x, y, size, 5, color, thickness),
        'Hexagon': (x, y, size, color, thickness) => drawPolygon(x, y, size, 6, color, thickness),
        'Octagon': (x, y, size, color, thickness) => drawPolygon(x, y, size, 8, color, thickness),
        'Spiral': drawSpiral,
    };

    for (const name in shapes) {
        const button = document.createElement('button');
        button.textContent = name;
        button.addEventListener('click', () => {
            stopAllAnimations();
            const color = colorInput.value;
            const thickness = parseInt(thicknessRange.value);
            const maxSize = parseFloat(sizeRange.value);
            recordAction({ shape: name, color, thickness, size: maxSize });
            animateShape(shapes[name], 0.5, 0.5, maxSize, color, thickness);
        });
        menuContent.appendChild(button);
    }

    // Add color and thickness controls
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = '#000000';
    menuContent.appendChild(document.createElement('label')).textContent = 'Color:';
    menuContent.appendChild(colorInput);

    const thicknessRange = document.createElement('input');
    thicknessRange.type = 'range';
    thicknessRange.min = 1;
    thicknessRange.max = 50;  // Expanded thickness range
    thicknessRange.value = 5;
    menuContent.appendChild(document.createElement('label')).textContent = 'Thickness:';
    menuContent.appendChild(thicknessRange);

    const sizeRange = document.createElement('input');
    sizeRange.type = 'range';
    sizeRange.min = 0.1;
    sizeRange.max = 5;  // Expanded max size
    sizeRange.value = 1;
    menuContent.appendChild(document.createElement('label')).textContent = 'Max Size:';
    menuContent.appendChild(sizeRange);

    // Save/Load Presets
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Preset';
    saveButton.addEventListener('click', () => {
        const presetName = prompt("Enter preset name:");
        if (presetName) {
            localStorage.setItem(presetName, JSON.stringify(actions));
            alert(`Preset ${presetName} saved!`);
        }
    });
    menuContent.appendChild(saveButton);

    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load Preset';
    loadButton.addEventListener('click', () => {
        const presetName = prompt("Enter preset name to load:");
        const preset = localStorage.getItem(presetName);
        if (preset) {
            actions = JSON.parse(preset);
            alert(`Preset ${presetName} loaded!`);
            // Here you would need to re-execute the actions to draw them on the canvas.
            actions.forEach(action => {
                animateShape(shapes[action.shape], 0.5, 0.5, action.size, action.color, action.thickness);
            });
        } else {
            alert("Preset not found!");
        }
    });
    menuContent.appendChild(loadButton);

    // Undo/Redo functionality
    const undoButton = document.createElement('button');
    undoButton.textContent = 'Undo';
    undoButton.addEventListener('click', () => {
        if (actions.length > 0) {
            const action = actions.pop();
            redoActions.push(action);
            // Here you would need to draw the canvas state before the action was taken.
            // Implement your canvas state management logic here.
        }
    });
    menuContent.appendChild(undoButton);

    const redoButton = document.createElement('button');
    redoButton.textContent = 'Redo';
    redoButton.addEventListener('click', () => {
        if (redoActions.length > 0) {
            const action = redoActions.pop();
            actions.push(action);
            animateShape(shapes[action.shape], 0.5, 0.5, action.size, action.color, action.thickness);
        }
    });
    menuContent.appendChild(redoButton);

    // Random Shape Generator
    const randomButton = document.createElement('button');
    randomButton.textContent = 'Random Shape';
    randomButton.addEventListener('click', () => {
        const shapeNames = Object.keys(shapes);
        const randomShape = shapeNames[Math.floor(Math.random() * shapeNames.length)];
        const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        const randomThickness = Math.floor(Math.random() * (thicknessRange.max - thicknessRange.min + 1)) + thicknessRange.min;
        const randomSize = Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min;
        animateShape(shapes[randomShape], 0.5, 0.5, randomSize, randomColor, randomThickness);
    });
    menuContent.appendChild(randomButton);

    // Clear/Stop Button
    const clearCanvasButton = document.createElement('button');
    clearCanvasButton.textContent = 'Clear/Stop';
    clearCanvasButton.addEventListener('click', () => {
        let data = ["drawcmd", 0, [0.5, 0.5, 0.5, 0.5, !0, -2000, "#FFFFFF", -1, !1]];
        window.sockets.forEach(socket => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(`42${JSON.stringify(data)}`);
            }
        });
        stopAllAnimations();
        actions = [];
        redoActions = [];
        animationRunning = false;
    });
    menuContent.appendChild(clearCanvasButton);

    menu.appendChild(menuContent);

    // Animation functions
    let animationRunning = false;
    let animationId = null;

    function animateShape(shapeFunc, x, y, maxSize, color, thickness) {
        let currentSize = 0;
        const speed = 0.01;
        animationRunning = true;

        function drawFrame() {
            if (!animationRunning || currentSize > maxSize) {
                animationRunning = false;
                return;
            }
            shapeFunc(x, y, currentSize, color, thickness);
            currentSize += speed;
            animationId = requestAnimationFrame(drawFrame);
        }
        drawFrame();
    }

    // Stop all animations
    function stopAllAnimations() {
        animationRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    // WebSocket interception
    const originalSend = WebSocket.prototype.send;
    let sockets = [];
    WebSocket.prototype.send = function (...args) {
        if (sockets.indexOf(this) === -1) sockets.push(this);
        return originalSend.apply(this, args);
    };

    // Make the menu draggable
    let isDragging = false;
    let offsetX, offsetY;

    menu.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - menu.getBoundingClientRect().left;
        offsetY = e.clientY - menu.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', e => {
        if (isDragging) {
            menu.style.left = `${e.clientX - offsetX}px`;
            menu.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => isDragging = false);

    document.body.appendChild(menu);
})();
