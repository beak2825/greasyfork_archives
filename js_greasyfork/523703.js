// ==UserScript==
// @name         Drawaria Expansive Shapes
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Creates expanding shapes animation with a modern menu with an uptade in the menu
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523703/Drawaria%20Expansive%20Shapes.user.js
// @updateURL https://update.greasyfork.org/scripts/523703/Drawaria%20Expansive%20Shapes.meta.js
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
            background: linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%);
            padding: 10px;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            cursor: move;
            width: 200px;
            transition: height 0.3s ease;
        }
        .menu h1 {
            color: #FFFFFF;
            margin: 0;
            padding-bottom: 10px;
            border-bottom: 1px solid #FFFFFF;
            font-size: 20px;
        }
        .menu button {
            margin: 4px;
            padding: 10px 10px;
            cursor: pointer;
            background: linear-gradient(135deg, #ffd700, #ffb90f);
            color: white;
            border: none;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .menu button:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
            color: black;
        }
        .menu h1:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
        }
        .menu-content {
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .menu-content.open {
            display: block;
            opacity: 1;
        }
        .menu-toggle {
            display: block;
            margin-top: 10px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // Create the menu
    const menu = document.createElement('div');
    menu.className = 'menu';

    const title = document.createElement('h1');
    title.textContent = 'Expansive Shapes';
    menu.appendChild(title);

    const toggle = document.createElement('div');
    toggle.className = 'menu-toggle';
    toggle.textContent = '▼';
    menu.appendChild(toggle);

    const menuContent = document.createElement('div');
    menuContent.className = 'menu-content';

    const startCircleButton = document.createElement('button');
    startCircleButton.textContent = 'Circle';
    menuContent.appendChild(startCircleButton);

    const startLinesButton = document.createElement('button');
    startLinesButton.textContent = 'Lines';
    menuContent.appendChild(startLinesButton);

    const startTriangleButton = document.createElement('button');
    startTriangleButton.textContent = 'Triangle';
    menuContent.appendChild(startTriangleButton);

    const startSquareButton = document.createElement('button');
    startSquareButton.textContent = 'Square';
    menuContent.appendChild(startSquareButton);

    const startDiamondButton = document.createElement('button');
    startDiamondButton.textContent = 'Diamond';
    menuContent.appendChild(startDiamondButton);

    const startHeartButton = document.createElement('button');
    startHeartButton.textContent = 'Shield';
    menuContent.appendChild(startHeartButton);

    const startMoonButton = document.createElement('button');
    startMoonButton.textContent = 'Spider Effect';
    menuContent.appendChild(startMoonButton);

    const startPinwheelButton = document.createElement('button');
    startPinwheelButton.textContent = '4 Lines';
    menuContent.appendChild(startPinwheelButton);

    const startExplosionButton = document.createElement('button');
    startExplosionButton.textContent = '6 Lines';
    menuContent.appendChild(startExplosionButton);

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = '#000000';
    colorInput.style.margin = '10px 0';
    menuContent.appendChild(colorInput);

    const startMulticolorButton = document.createElement('button');
    startMulticolorButton.textContent = 'Multicolor';
    menuContent.appendChild(startMulticolorButton);

    const stopButton = document.createElement('button');
    stopButton.textContent = 'Stop';
    menuContent.appendChild(stopButton);

    menu.appendChild(menuContent);
    document.body.appendChild(menu);

    // Function to send draw commands
    function sendDrawCommand(startX, startY, endX, endY, thickness, color) {
        const message = `42["drawcmd",0,[${startX},${startY},${endX},${endY},false,${0 - thickness},"${color}",0,0,{}]]`;
        sockets.forEach((socket) => {
            socket.send(message);
        });
    }

    // Circle Animation
    let circleAnimationInterval;
    let circleColor = '#000000';
    let circleRadius = 0;
    const circleCenterX = 0.5;
    const circleCenterY = 0.5;
    const circleThickness = 10; // Thickness of the circle lines
    const circleAngleIncrement = 10; // Increment angle for drawing the circle

    function drawCircle(x, y, radius, color) {
        for (let i = 0; i < 360; i += circleAngleIncrement) {
            const angle1 = i * (Math.PI / 180);
            const angle2 = (i + circleAngleIncrement) * (Math.PI / 180);
            const startX = x + radius * Math.cos(angle1);
            const startY = y + radius * Math.sin(angle1);
            const endX = x + radius * Math.cos(angle2);
            const endY = y + radius * Math.sin(angle2);
            sendDrawCommand(startX, startY, endX, endY, circleThickness, color);
        }
    }

    function startCircleAnimation() {
        if (circleAnimationInterval) return;

        circleAnimationInterval = setInterval(() => {
            circleRadius += 0.01;
            if (circleRadius > 0.5) {
                clearInterval(circleAnimationInterval);
                circleAnimationInterval = null;
                return;
            }

            drawCircle(circleCenterX, circleCenterY, circleRadius, circleColor);
        }, 120); // Increase the interval to reduce the load on the server
    }

    function stopCircleAnimation() {
        if (circleAnimationInterval) {
            clearInterval(circleAnimationInterval);
            circleAnimationInterval = null;
        }
    }

    // Lines Animation
    let linesAnimationInterval;
    let linesColor = '#000000';
    let linesRadius = 0;
    const linesCenterX = 0.5;
    const linesCenterY = 0.5;
    const linesThickness = 2; // Thickness of the lines
    const linesAngleIncrement = 10; // Increment angle for drawing the lines

    function drawLines(x, y, radius, color) {
        for (let i = 0; i < 360; i += linesAngleIncrement) {
            const angle = i * (Math.PI / 180);
            const startX = x;
            const startY = y;
            const endX = x + radius * Math.cos(angle);
            const endY = y + radius * Math.sin(angle);

            sendDrawCommand(startX, startY, endX, endY, linesThickness, color);
        }
    }

    function startLinesAnimation() {
        if (linesAnimationInterval) return;

        linesAnimationInterval = setInterval(() => {
            linesRadius += 0.01;
            if (linesRadius > 0.5) {
                clearInterval(linesAnimationInterval);
                linesAnimationInterval = null;
                return;
            }

            drawLines(linesCenterX, linesCenterY, linesRadius, linesColor);
        }, 90); // Increase the interval to reduce the load on the server
    }

    function stopLinesAnimation() {
        if (linesAnimationInterval) {
            clearInterval(linesAnimationInterval);
            linesAnimationInterval = null;
        }
    }

    // Triangle Animation
    let triangleAnimationInterval;
    let triangleColor = '#000000';
    let triangleSize = 0;
    const triangleCenterX = 0.5;
    const triangleCenterY = 0.5;
    const triangleThickness = 5; // Thickness of the triangle lines

    function drawTriangle(x, y, size, color) {
        const points = [
            { x: x, y: y - size },
            { x: x - size, y: y + size },
            { x: x + size, y: y + size }
        ];

        sendDrawCommand(points[0].x, points[0].y, points[1].x, points[1].y, triangleThickness, color);
        sendDrawCommand(points[1].x, points[1].y, points[2].x, points[2].y, triangleThickness, color);
        sendDrawCommand(points[2].x, points[2].y, points[0].x, points[0].y, triangleThickness, color);
    }

    function startTriangleAnimation() {
        if (triangleAnimationInterval) return;

        triangleAnimationInterval = setInterval(() => {
            triangleSize += 0.01;
            if (triangleSize > 0.5) {
                clearInterval(triangleAnimationInterval);
                triangleAnimationInterval = null;
                return;
            }

            drawTriangle(triangleCenterX, triangleCenterY, triangleSize, triangleColor);
        }, 120); // Increase the interval to reduce the load on the server
    }

    function stopTriangleAnimation() {
        if (triangleAnimationInterval) {
            clearInterval(triangleAnimationInterval);
            triangleAnimationInterval = null;
        }
    }

    // Square Animation
    let squareAnimationInterval;
    let squareColor = '#000000';
    let squareSize = 0;
    const squareCenterX = 0.5;
    const squareCenterY = 0.5;
    const squareThickness = 5; // Thickness of the square lines

    function drawSquare(x, y, size, color) {
        const halfSize = size / 2;
        const points = [
            { x: x - halfSize, y: y - halfSize },
            { x: x + halfSize, y: y - halfSize },
            { x: x + halfSize, y: y + halfSize },
            { x: x - halfSize, y: y + halfSize }
        ];

        sendDrawCommand(points[0].x, points[0].y, points[1].x, points[1].y, squareThickness, color);
        sendDrawCommand(points[1].x, points[1].y, points[2].x, points[2].y, squareThickness, color);
        sendDrawCommand(points[2].x, points[2].y, points[3].x, points[3].y, squareThickness, color);
        sendDrawCommand(points[3].x, points[3].y, points[0].x, points[0].y, squareThickness, color);
    }

    function startSquareAnimation() {
        if (squareAnimationInterval) return;

        squareAnimationInterval = setInterval(() => {
            squareSize += 0.02;
            if (squareSize > 1) {
                clearInterval(squareAnimationInterval);
                squareAnimationInterval = null;
                return;
            }

            drawSquare(squareCenterX, squareCenterY, squareSize, squareColor);
        }, 120); // Increase the interval to reduce the load on the server
    }

    function stopSquareAnimation() {
        if (squareAnimationInterval) {
            clearInterval(squareAnimationInterval);
            squareAnimationInterval = null;
        }
    }

    // Diamond Animation
    let diamondAnimationInterval;
    let diamondColor = '#000000';
    let diamondSize = 0;
    const diamondCenterX = 0.5;
    const diamondCenterY = 0.5;
    const diamondThickness = 5; // Thickness of the diamond lines

    function drawDiamond(x, y, size, color) {
        const points = [
            { x: x, y: y - size },
            { x: x + size, y: y },
            { x: x, y: y + size },
            { x: x - size, y: y }
        ];

        sendDrawCommand(points[0].x, points[0].y, points[1].x, points[1].y, diamondThickness, color);
        sendDrawCommand(points[1].x, points[1].y, points[2].x, points[2].y, diamondThickness, color);
        sendDrawCommand(points[2].x, points[2].y, points[3].x, points[3].y, diamondThickness, color);
        sendDrawCommand(points[3].x, points[3].y, points[0].x, points[0].y, diamondThickness, color);
    }

    function startDiamondAnimation() {
        if (diamondAnimationInterval) return;

        diamondAnimationInterval = setInterval(() => {
            diamondSize += 0.01;
            if (diamondSize > 0.5) {
                clearInterval(diamondAnimationInterval);
                diamondAnimationInterval = null;
                return;
            }

            drawDiamond(diamondCenterX, diamondCenterY, diamondSize, diamondColor);
        }, 120); // Increase the interval to reduce the load on the server
    }

    function stopDiamondAnimation() {
        if (diamondAnimationInterval) {
            clearInterval(diamondAnimationInterval);
            diamondAnimationInterval = null;
        }
    }

    // Heart Animation
    let heartAnimationInterval;
    let heartColor = '#000000';
    let heartSize = 0;
    const heartCenterX = 0.5;
    const heartCenterY = 0.5;
    const heartThickness = 5; // Thickness of the heart lines

    function drawHeart(x, y, size, color) {
        const points = [
            { x: x, y: y - size },
            { x: x - size, y: y - size },
            { x: x - size, y: y + size },
            { x: x, y: y + 2 * size },
            { x: x + size, y: y + size },
            { x: x + size, y: y - size }
        ];

        sendDrawCommand(points[0].x, points[0].y, points[1].x, points[1].y, heartThickness, color);
        sendDrawCommand(points[1].x, points[1].y, points[2].x, points[2].y, heartThickness, color);
        sendDrawCommand(points[2].x, points[2].y, points[3].x, points[3].y, heartThickness, color);
        sendDrawCommand(points[3].x, points[3].y, points[4].x, points[4].y, heartThickness, color);
        sendDrawCommand(points[4].x, points[4].y, points[5].x, points[5].y, heartThickness, color);
        sendDrawCommand(points[5].x, points[5].y, points[0].x, points[0].y, heartThickness, color);
    }

    function startHeartAnimation() {
        if (heartAnimationInterval) return;

        heartAnimationInterval = setInterval(() => {
            heartSize += 0.01;
            if (heartSize > 0.5) {
                clearInterval(heartAnimationInterval);
                heartAnimationInterval = null;
                return;
            }

            drawHeart(heartCenterX, heartCenterY, heartSize, heartColor);
        }, 120); // Increase the interval to reduce the load on the server
    }

    function stopHeartAnimation() {
        if (heartAnimationInterval) {
            clearInterval(heartAnimationInterval);
            heartAnimationInterval = null;
        }
    }

    // Moon Animation
    let moonAnimationInterval;
    let moonColor = '#000000';
    let moonSize = 0;
    const moonCenterX = 0.5;
    const moonCenterY = 0.5;
    const moonThickness = 5; // Thickness of the moon lines

    function drawMoon(x, y, size, color) {
        const circleRadius = size;
        const innerCircleRadius = size * 0.8;

        // Draw the outer circle
        for (let i = 0; i < 360; i += 30) {
            const angle1 = i * (Math.PI / 180);
            const angle2 = (i + 30) * (Math.PI / 180);
            const startX = x + circleRadius * Math.cos(angle1);
            const startY = y + circleRadius * Math.sin(angle1);
            const endX = x + circleRadius * Math.cos(angle2);
            const endY = y + circleRadius * Math.sin(angle2);
            sendDrawCommand(startX, startY, endX, endY, moonThickness, color);
        }

        // Draw the inner circle (to create the crescent shape)
        for (let i = 180; i < 360; i += 30) {
            const angle1 = i * (Math.PI / 180);
            const angle2 = (i + 30) * (Math.PI / 180);
            const startX = x + innerCircleRadius * Math.cos(angle1);
            const startY = y + innerCircleRadius * Math.sin(angle1);
            const endX = x + innerCircleRadius * Math.cos(angle2);
            const endY = y + innerCircleRadius * Math.sin(angle2);
            sendDrawCommand(startX, startY, endX, endY, moonThickness, 'white'); // Use white color for the inner circle
        }
    }

    function startMoonAnimation() {
        if (moonAnimationInterval) return;

        moonAnimationInterval = setInterval(() => {
            moonSize += 0.01;
            if (moonSize > 0.5) {
                clearInterval(moonAnimationInterval);
                moonAnimationInterval = null;
                return;
            }

            drawMoon(moonCenterX, moonCenterY, moonSize, moonColor);
        }, 120); // Increase the interval to reduce the load on the server
    }

    function stopMoonAnimation() {
        if (moonAnimationInterval) {
            clearInterval(moonAnimationInterval);
            moonAnimationInterval = null;
        }
    }

    // Pinwheel Animation
    let pinwheelAnimationInterval;
    let pinwheelColor = '#000000';
    let pinwheelSize = 0;
    const pinwheelCenterX = 0.5;
    const pinwheelCenterY = 0.5;
    const pinwheelThickness = 5; // Thickness of the pinwheel lines

    function drawPinwheel(x, y, size, color) {
        const points = [
            { x: x, y: y },
            { x: x + size, y: y },
            { x: x, y: y + size },
            { x: x - size, y: y },
            { x: x, y: y - size }
        ];

        sendDrawCommand(points[0].x, points[0].y, points[1].x, points[1].y, pinwheelThickness, color);
        sendDrawCommand(points[0].x, points[0].y, points[2].x, points[2].y, pinwheelThickness, color);
        sendDrawCommand(points[0].x, points[0].y, points[3].x, points[3].y, pinwheelThickness, color);
        sendDrawCommand(points[0].x, points[0].y, points[4].x, points[4].y, pinwheelThickness, color);
    }

    function startPinwheelAnimation() {
        if (pinwheelAnimationInterval) return;

        pinwheelAnimationInterval = setInterval(() => {
            pinwheelSize += 0.01;
            if (pinwheelSize > 0.5) {
                clearInterval(pinwheelAnimationInterval);
                pinwheelAnimationInterval = null;
                return;
            }

            drawPinwheel(pinwheelCenterX, pinwheelCenterY, pinwheelSize, pinwheelColor);
        }, 120); // Increase the interval to reduce the load on the server
    }

    function stopPinwheelAnimation() {
        if (pinwheelAnimationInterval) {
            clearInterval(pinwheelAnimationInterval);
            pinwheelAnimationInterval = null;
        }
    }

    // Explosion Animation
    let explosionAnimationInterval;
    let explosionColor = '#000000';
    let explosionSize = 0;
    const explosionCenterX = 0.5;
    const explosionCenterY = 0.5;
    const explosionThickness = 5; // Thickness of the explosion lines

    function drawExplosion(x, y, size, color) {
        const points = [
            { x: x, y: y },
            { x: x + size, y: y + size },
            { x: x - size, y: y + size },
            { x: x - size, y: y - size },
            { x: x + size, y: y - size },
            { x: x, y: y + size },
            { x: x, y: y - size }
        ];

        sendDrawCommand(points[0].x, points[0].y, points[1].x, points[1].y, explosionThickness, color);
        sendDrawCommand(points[0].x, points[0].y, points[2].x, points[2].y, explosionThickness, color);
        sendDrawCommand(points[0].x, points[0].y, points[3].x, points[3].y, explosionThickness, color);
        sendDrawCommand(points[0].x, points[0].y, points[4].x, points[4].y, explosionThickness, color);
        sendDrawCommand(points[0].x, points[0].y, points[5].x, points[5].y, explosionThickness, color);
        sendDrawCommand(points[0].x, points[0].y, points[6].x, points[6].y, explosionThickness, color);
        sendDrawCommand(points[0].x, points[0].y, points[7].x, points[7].y, explosionThickness, color);
        sendDrawCommand(points[0].x, points[0].y, points[8].x, points[8].y, explosionThickness, color);
    }

    function startExplosionAnimation() {
        if (explosionAnimationInterval) return;

        explosionAnimationInterval = setInterval(() => {
            explosionSize += 0.01;
            if (explosionSize > 0.5) {
                clearInterval(explosionAnimationInterval);
                explosionAnimationInterval = null;
                return;
            }

            drawExplosion(explosionCenterX, explosionCenterY, explosionSize, explosionColor);
        }, 120); // Increase the interval to reduce the load on the server
    }

    function stopExplosionAnimation() {
        if (explosionAnimationInterval) {
            clearInterval(explosionAnimationInterval);
            explosionAnimationInterval = null;
        }
    }

    // Multicolor Animation
    let multicolorInterval;
    let multicolorEnabled = false;

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function startMulticolorAnimation() {
        if (multicolorInterval) return;

        multicolorInterval = setInterval(() => {
            circleColor = getRandomColor();
            linesColor = getRandomColor();
            triangleColor = getRandomColor();
            squareColor = getRandomColor();
            diamondColor = getRandomColor();
            heartColor = getRandomColor();
            moonColor = getRandomColor();
            pinwheelColor = getRandomColor();
            explosionColor = getRandomColor();
        }, 100); // Change colors every 100ms
    }

    function stopMulticolorAnimation() {
        if (multicolorInterval) {
            clearInterval(multicolorInterval);
            multicolorInterval = null;
            multicolorEnabled = false;
        }
    }

    function resetAnimation() {
        stopCircleAnimation();
        stopLinesAnimation();
        stopTriangleAnimation();
        stopSquareAnimation();
        stopDiamondAnimation();
        stopHeartAnimation();
        stopMoonAnimation();
        stopPinwheelAnimation();
        stopExplosionAnimation();
        stopMulticolorAnimation();
        circleRadius = 0;
        linesRadius = 0;
        triangleSize = 0;
        squareSize = 0;
        diamondSize = 0;
        heartSize = 0;
        moonSize = 0;
        pinwheelSize = 0;
        explosionSize = 0;
        colorInput.value = '#000000';
        circleColor = '#000000';
        linesColor = '#000000';
        triangleColor = '#000000';
        squareColor = '#000000';
        diamondColor = '#000000';
        heartColor = '#000000';
        moonColor = '#000000';
        pinwheelColor = '#000000';
        explosionColor = '#000000';
    }

    // Event listeners for buttons
    startCircleButton.addEventListener('click', startCircleAnimation);
    startLinesButton.addEventListener('click', startLinesAnimation);
    startTriangleButton.addEventListener('click', startTriangleAnimation);
    startSquareButton.addEventListener('click', startSquareAnimation);
    startDiamondButton.addEventListener('click', startDiamondAnimation);
    startHeartButton.addEventListener('click', startHeartAnimation);
    startMoonButton.addEventListener('click', startMoonAnimation);
    startPinwheelButton.addEventListener('click', startPinwheelAnimation);
    startExplosionButton.addEventListener('click', startExplosionAnimation);
    startMulticolorButton.addEventListener('click', startMulticolorAnimation);
    stopButton.addEventListener('click', resetAnimation);

    // Update colors based on input
    colorInput.addEventListener('input', () => {
        circleColor = colorInput.value;
        linesColor = colorInput.value;
        triangleColor = colorInput.value;
        squareColor = colorInput.value;
        diamondColor = colorInput.value;
        heartColor = colorInput.value;
        moonColor = colorInput.value;
        pinwheelColor = colorInput.value;
        explosionColor = colorInput.value;
    });

    // Override WebSocket.prototype.send to intercept messages
    const originalSend = WebSocket.prototype.send;
    let sockets = [];

    WebSocket.prototype.send = function (...args) {
        if (sockets.indexOf(this) === -1) {
            sockets.push(this);
            console.log('WebSocket intercepted:', this);
        }
        return originalSend.apply(this, args);
    };

    // Make the menu draggable
    let isDragging = false;
    let offsetX, offsetY;

    menu.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - menu.getBoundingClientRect().left;
        offsetY = e.clientY - menu.getBoundingClientRect().top;
        menu.style.cursor = 'grabbing';
        menu.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            menu.style.left = `${e.clientX - offsetX}px`;
            menu.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            menu.style.cursor = 'move';
            menu.style.transition = 'all 0.2s';
        }
    });

    // Toggle menu visibility
    let isMenuOpen = false;

    toggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        menuContent.classList.toggle('open', isMenuOpen);
        toggle.textContent = isMenuOpen ? '▲' : '▼';
    });

    // Wait for the page to load, then add the menu
    window.addEventListener('load', () => {
        document.body.appendChild(menu);
    });
})();
