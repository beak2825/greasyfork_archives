// ==UserScript==
// @name         Drawaria Text in the Canvas
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Draw proper text visible to all players with curves
// @author       YouTubeDrawaria
// @include      https://drawaria.online*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/544151/Drawaria%20Text%20in%20the%20Canvas.user.js
// @updateURL https://update.greasyfork.org/scripts/544151/Drawaria%20Text%20in%20the%20Canvas.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === Canvas and WebSocket Setup ===
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let socket;
    let selectedColor = '#000000';
    let selectedFontSize = 15;
    let selectedThickness = 2;

    // Bot Setup
    window.myRoom = {};
    window.sockets = [];
    let bot = null;

    // Utility Functions
    const EL = (sel) => document.querySelector(sel); // Define EL as document.querySelector
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function nulllify(value = null) {
        return value == null ? null : String().concat('"', value, '"');
    }

    // Hook into WebSocket
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (window.sockets.indexOf(this) === -1) {
            window.sockets.push(this);
            if (window.sockets.indexOf(this) === 0) {
                socket = this;
                this.addEventListener('message', (event) => {
                    let message = String(event.data);
                    if (message.startsWith('42')) {
                        let payload = JSON.parse(message.slice(2));
                        if (payload[0] == 'bc_uc_freedrawsession_changedroom') {
                            window.myRoom.players = payload[3];
                        }
                        if (payload[0] == 'mc_roomplayerschange') {
                            window.myRoom.players = payload[3];
                        }
                    } else if (message.startsWith('430')) {
                        let configs = JSON.parse(message.slice(3))[0];
                        window.myRoom.players = configs.players;
                        window.myRoom.id = configs.roomid;
                    }
                });
            }
        }
        return originalSend.call(this, ...args);
    };

    // === Letter and Number Path Definitions ===
    const letterPaths = {
        a: [[10, 40], [20, 0], [30, 40], [25, 20], [15, 20]],
        b: [[0, 0], [0, 40], [15, 40], [20, 35], [20, 25], [15, 20], [0, 20], [15, 20], [20, 15], [20, 5], [15, 0], [0, 0]],
        c: [[30, 10], [20, 0], [10, 0], [0, 10], [0, 30], [10, 40], [20, 40], [30, 30]],
        d: [[0, 0], [0, 40], [10, 40], [30, 20], [10, 0], [0, 0]],
        e: [[30, 0], [0, 0], [0, 20], [20, 20], [0, 20], [0, 40], [30, 40]],
        f: [[20, 0], [0, 0], [0, 20], [15, 20], [0, 20], [0, 40]],
        g: [[30, 10], [20, 0], [10, 0], [0, 10], [0, 30], [10, 40], [20, 40], [30, 30], [20, 20]],
        h: [[0, 0], [0, 40], [0, 20], [20, 20], [20, 0], [20, 40]],
        i: [[10, 0], [10, 40]],
        j: [[20, 0], [20, 40], [10, 40], [0, 30]],
        k: [[0, 0], [0, 40], [0, 20], [20, 0], [0, 20], [20, 40]],
        l: [[0, 0], [0, 40], [20, 40]],
        m: [[0, 40], [0, 0], [10, 20], [20, 0], [20, 40]],
        n: [[0, 40], [0, 0], [20, 40], [20, 0]],
        o: [[10, 0], [20, 0], [30, 10], [30, 30], [20, 40], [10, 40], [0, 30], [0, 10], [10, 0]],
        p: [[0, 40], [0, 0], [10, 0], [20, 10], [10, 20], [0, 20]],
        q: [[10, 0], [20, 0], [30, 10], [30, 30], [20, 40], [10, 40], [0, 30], [0, 10], [10, 0], [20, 20], [30, 40]],
        r: [[0, 40], [0, 0], [10, 0], [20, 10], [10, 20], [0, 20], [20, 40]],
        s: [[20, 0], [10, 0], [0, 10], [20, 20], [30, 30], [20, 40], [10, 40], [0, 30]],
        t: [[10, 0], [10, 40], "M", [1, 0], [20, 0]],
        u: [[0, 0], [0, 30], [10, 40], [20, 40], [30, 30], [30, 0]],
        v: [[0, 0], [15, 40], [30, 0]],
        w: [[0, 0], [0, 40], [10, 20], [20, 40], [30, 0]],
        x: [[0, 0], [30, 40], [15, 20], [0, 40], [30, 0]],
        y: [[0, 0], [15, 20], [30, 0], [15, 20], [15, 40]],
        z: [[0, 0], [30, 0], [0, 40], [30, 40]],
        '.': [[7.5, 35], [9, 36]],
        '!': [[15, 0], [15, 30], null, [15, 35], [15, 40]],
        '@': [[20, 10], [10, 0], [0, 10], [0, 30], [10, 40], [20, 40], [30, 30], [30, 20], [15, 20]],
        '#': [[5, 0], [5, 40], null, [25, 0], [25, 40], null, [0, 10], [30, 10], null, [0, 30], [30, 30]],
        '$': [[20, 0], [10, 0], [0, 10], [10, 20], [20, 20], [30, 30], [20, 40], [10, 40], [15, 0], [15, 40]],
        '%': [[0, 30], [30, 0], null, [5, 10], [10, 5], null, [20, 35], [25, 30]],
        '^': [[0, 20], [15, 0], [30, 20]],
        '?': [[0, 10], [10, 0], [20, 0], [30, 10], [15, 20], [15, 30], null, [15, 35], [15, 40]],
        '+': [[15, 0], [15, 40], null, [0, 20], [30, 20]],
        '-': [[0, 20], [30, 20]],
        '*': [[15, 0], [15, 40], null, [0, 10], [30, 30], null, [0, 30], [30, 10]],
        '/': [[0, 40], [30, 0]],
        '(': [[15, 0], [0, 0], [0, 40], [15, 40]],
        ')': [[15, 0], [30, 0], [30, 40], [15, 40]],
        ':': [[15, 10], [16, 11], null, [15, 30], [16, 31]],
        '_': [[0, 40], [30, 40]],
        '=': [[0, 15], [30, 15], null, [0, 25], [30, 25]],
        '<': [[30, 10], [0, 20], [30, 30]],
        '>': [[0, 10], [30, 20], [0, 30]],
        ',': [[10, 30], [10, 35], [5, 40]],
        "'": [[15, 0], [20, 5], [15, 10]]
    };

    const numberPaths = {
        0: [[10, 0], [20, 0], [30, 10], [30, 30], [20, 40], [10, 40], [0, 30], [0, 10], [10, 0]],
        1: [[15, 0], [15, 40], null, [15, 0], [10, 10], null, [10, 40], [20, 40]],
        2: [[0, 10], [10, 0], [20, 0], [30, 10], [0, 40], [30, 40]],
        3: [[0, 10], [10, 0], [20, 0], [30, 10], [20, 20], [30, 30], [20, 40], [10, 40], [0, 30]],
        4: [[20, 0], [20, 40], null, [0, 20], [25, 20], null, [0, 20], [20, 0]],
        5: [[30, 0], [0, 0], [0, 20], [20, 20], [30, 30], [20, 40], [10, 40], [0, 30]],
        6: [[30, 10], [20, 0], [10, 0], [0, 10], [0, 30], [10, 40], [20, 40], [30, 30], [20, 20], [10, 20], [0, 20], [0, 10]],
        7: [[0, 0], [30, 0], [15, 40]],
        8: [[15, 0], [25, 10], [15, 20], [5, 10], [15, 0], null, [15, 20], [25, 30], [15, 40], [5, 30], [15, 20]],
        9: [[5, 35], [15, 40], [25, 30], [30, 10], [20, 0], [10, 0], [0, 10], [5, 20], [15, 20], [25, 20], [27.5, 20]]
    };

    const spaceWidth = 10; // Width of a space in pixels

    // === Drawing Functions ===
    function sendDrawCommand(x1, y1, x2, y2, color, thickness, botSocket = null) {
        const targetSocket = botSocket || socket;
        if (!targetSocket) return;

        const normX1 = (x1 / canvas.width).toFixed(4);
        const normY1 = (y1 / canvas.height).toFixed(4);
        const normX2 = (x2 / canvas.width).toFixed(4);
        const normY2 = (y2 / canvas.height).toFixed(4);

        const command = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${0 - thickness},"${color}",0,0,{}]]`;
        targetSocket.send(command);
    }

    function drawLetter(path, startX, startY, fontSize, color, thickness, botSocket = null) {
        const scale = fontSize / 40; // Scale paths to font size
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;

        for (let i = 0; i < path.length - 1; i++) {
            const [x1, y1] = path[i] || [];
            const [x2, y2] = path[i + 1] || [];

            if (path[i] === null || path[i + 1] === null || path[i] === "M") {
                ctx.moveTo(x2 * scale + startX, y2 * scale + startY);
                continue;
            }

            const scaledX1 = startX + x1 * scale;
            const scaledY1 = startY + y1 * scale;
            const scaledX2 = startX + x2 * scale;
            const scaledY2 = startY + y2 * scale;

            ctx.beginPath();
            ctx.moveTo(scaledX1, scaledY1);
            ctx.lineTo(scaledX2, scaledY2);
            ctx.stroke();

            sendDrawCommand(scaledX1, scaledY1, scaledX2, scaledY2, color, thickness, botSocket);
        }
    }

    async function drawTextSimple(text, startX, startY, step, color, thickness, botSocket = null) {
        const delay = 50; // Delay between drawing characters in ms
        let x = startX;
        let y = startY;

        for (let i = 0; i < text.length; i++) {
            drawAndSendChar(x, y, text[i], color, thickness, botSocket);
            x += step;
            await sleep(delay);
        }
    }

    function drawAndSendChar(x, y, char, color, thickness, botSocket = null) {
        ctx.fillStyle = color;
        ctx.font = `${thickness * 2}px Arial`;
        ctx.fillText(char, x, y);

        if (!socket) return;
        const normX = (x / canvas.width).toFixed(4);
        const normY = (y / canvas.height).toFixed(4);

        const command = `42["drawcmd",0,[${normX},${normY},"${char}",false,${0 - thickness},"${color}",0,0,{}]]`;
        (botSocket || socket).send(command);
    }

    function drawText(text, startX, startY, botSocket = null) {
        let currentX = startX;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const lowerChar = char.toLowerCase(); // Use for lookup against lowercase keys

            if (char === ' ') {
                currentX += spaceWidth;
            } else if (letterPaths[char] || letterPaths[lowerChar]) {
                const path = letterPaths[char] || letterPaths[lowerChar];
                drawLetter(path, currentX, startY, selectedFontSize, selectedColor, selectedThickness, botSocket);
                // Adjust spacing based on character, typically lowercase
                if (lowerChar === 'i') {
                    currentX += selectedFontSize * 0.75;
                } else if (i < text.length - 1 && text[i + 1].toLowerCase() === 'a') {
                    currentX += selectedFontSize * 0.5;
                } else if (i < text.length - 1 && text[i + 1].toLowerCase() === 'i') {
                    currentX += selectedFontSize * 0.75;
                } else {
                    currentX += selectedFontSize;
                }
            } else if (numberPaths[char] || numberPaths[lowerChar]) {
                const path = numberPaths[char] || numberPaths[lowerChar];
                drawLetter(path, currentX, startY, selectedFontSize, selectedColor, selectedThickness, botSocket);
                currentX += selectedFontSize;
            } else {
                console.log(`Text Draw Tool: Caracter '${char}' no soportado, saltando.`);
                currentX += selectedFontSize * 0.5; // Provide some spacing for unsupported chars
            }
        }
    }

    // === UI Setup ===
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = selectedColor;
    colorPicker.title = 'Change color';
    colorPicker.style.width = '70px';
    colorPicker.style.height = '29px';
    colorPicker.style.zIndex = '1000';

    const fontSizeSlider = document.createElement('input');
    fontSizeSlider.type = 'number';
    fontSizeSlider.min = '5';
    fontSizeSlider.max = '500';
    fontSizeSlider.value = selectedFontSize;
    fontSizeSlider.title = 'Font Size';
    fontSizeSlider.style.width = '50px';
    fontSizeSlider.style.zIndex = '1000';

    const thicknessSlider = document.createElement('input');
    thicknessSlider.type = 'number';
    thicknessSlider.min = '1';
    thicknessSlider.max = '100';
    thicknessSlider.value = selectedThickness;
    thicknessSlider.title = 'Thickness';
    thicknessSlider.style.width = '50px';
    thicknessSlider.style.zIndex = '1000';

    const inputWrapper = document.createElement('div');
    inputWrapper.style.display = 'flex';
    inputWrapper.style.alignItems = 'center';
    inputWrapper.style.zIndex = '1000';

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.maxLength = 100;
    textInput.placeholder = 'Enter text to draw';
    textInput.style.width = '185px';
    textInput.style.zIndex = '1000';
    inputWrapper.appendChild(textInput);

    const clearButton = document.createElement('button');
    clearButton.innerText = 'X';
    clearButton.style.width = '20px';
    clearButton.style.height = '20px';
    clearButton.style.zIndex = '1000';
    clearButton.style.display = 'flex';
    clearButton.style.justifyContent = 'center';
    clearButton.style.alignItems = 'center';
    clearButton.style.padding = '0';
    clearButton.style.marginLeft = '-12px';
    clearButton.style.background = '#fff';
    clearButton.style.border = 'none';
    clearButton.style.outline = 'none';
    clearButton.style.cursor = 'pointer';
    clearButton.style.fontSize = '12px';
    clearButton.style.color = '#808080';
    clearButton.addEventListener('click', () => {
        textInput.value = '';
    });
    inputWrapper.appendChild(clearButton);

    const drawButton = document.createElement('button');
    drawButton.innerText = 'Draw';
    drawButton.title = 'Draw';
    drawButton.style.zIndex = '1000';
    drawButton.style.marginLeft = '5px';
    inputWrapper.appendChild(drawButton);

    const eraseButton = document.createElement('button');
    eraseButton.innerText = 'Erase';
    eraseButton.title = 'Erase';
    eraseButton.style.zIndex = '1000';
    inputWrapper.appendChild(eraseButton);

    const toggleLoopButton = document.createElement('button');
    toggleLoopButton.innerText = 'Loop';
    toggleLoopButton.title = 'Loop';
    toggleLoopButton.style.zIndex = '1000';
    let loopInterval = null;
    toggleLoopButton.addEventListener('click', () => {
        if (loopInterval) {
            clearInterval(loopInterval);
            loopInterval = null;
            toggleLoopButton.style.backgroundColor = '';
        } else {
            const textToDraw = textInput.value.trim();
            if (!textToDraw || !socket) {
                alert('Please ensure there is text to draw/erase and socket is available.');
                return;
            }
            const startX = clamp(parseInt(startXInput.value, 10) || 0, 0, 760);
            const startY = clamp(parseInt(startYInput.value, 10) || 0, 0, 630);
            loopInterval = setInterval(() => {
                drawText(textToDraw, startX, startY, bot ? bot.conn.socket : null);
                setTimeout(() => {
                    const eraserFontSize = selectedFontSize;
                    const eraserThickness = selectedThickness + 5;
                    const eraseColor = '#ffffff';
                    let currentX = startX;
                    const eraseText = textToDraw; // Use the same text for erasing
                    for (let i = 0; i < eraseText.length; i++) {
                        const char = eraseText[i];
                        const lowerChar = char.toLowerCase();
                        if (char === ' ') {
                            currentX += spaceWidth;
                        } else if (letterPaths[char] || letterPaths[lowerChar]) {
                            const path = letterPaths[char] || letterPaths[lowerChar];
                            drawLetter(path, currentX, startY, eraserFontSize, eraseColor, eraserThickness, bot ? bot.conn.socket : null);
                            // Adjust spacing
                            if (lowerChar === 'i') {
                                currentX += eraserFontSize * 0.75;
                            } else if (i < eraseText.length - 1 && eraseText[i + 1].toLowerCase() === 'a') {
                                currentX += eraserFontSize * 0.5;
                            } else if (i < eraseText.length - 1 && eraseText[i + 1].toLowerCase() === 'i') {
                                currentX += eraserFontSize * 0.75;
                            } else {
                                currentX += eraserFontSize;
                            }
                        } else if (numberPaths[char] || numberPaths[lowerChar]) {
                            const path = numberPaths[char] || numberPaths[lowerChar];
                            drawLetter(path, currentX, startY, eraserFontSize, eraseColor, eraserThickness, bot ? bot.conn.socket : null);
                            currentX += eraserFontSize;
                        } else {
                             console.log(`Text Draw Tool: Caracter '${char}' no soportado para borrado en loop, saltando.`);
                             currentX += eraserFontSize * 0.5;
                        }
                    }
                }, 500);
            }, 2000);
            toggleLoopButton.style.backgroundColor = '#ffcc00';
        }
    });
    inputWrapper.appendChild(toggleLoopButton);

    const chatDivider = document.querySelector('div[style*="border-top: 1px solid #cde5ff"]');
    if (chatDivider) {
        chatDivider.before(inputWrapper);
    } else {
        document.body.appendChild(inputWrapper);
    }

    const startXInput = document.createElement('input');
    startXInput.type = 'number';
    startXInput.value = 5;
    startXInput.min = 0;
    startXInput.max = '760';
    startXInput.placeholder = 'Left';
    startXInput.title = 'Distance Left';
    startXInput.style.width = '45px';
    startXInput.style.zIndex = '1000';

    const yControlWrapper = document.createElement('div');
    yControlWrapper.style.display = 'flex';
    yControlWrapper.style.alignItems = 'center';
    yControlWrapper.style.zIndex = '1000';

    const startYIncrease = document.createElement('button');
    startYIncrease.innerText = '+';
    startYIncrease.style.width = '20px';
    startYIncrease.style.height = '29px';
    startYIncrease.style.zIndex = '1000';
    startYIncrease.style.display = 'flex';
    startYIncrease.style.justifyContent = 'center';
    startYIncrease.style.alignItems = 'center';
    startYIncrease.style.padding = '0';
    yControlWrapper.appendChild(startYIncrease);

    const startYInput = document.createElement('input');
    startYInput.type = 'number';
    startYInput.value = '5';
    startYInput.min = '0';
    startYInput.max = '630';
    startYInput.placeholder = 'Top';
    startYInput.title = 'Distance Top';
    startYInput.style.width = '45px';
    startYInput.style.zIndex = '1000';
    yControlWrapper.appendChild(startYInput);

    const startYDecrease = document.createElement('button');
    startYDecrease.innerText = '-';
    startYDecrease.style.width = '20px';
    startYDecrease.style.height = '29px';
    startYDecrease.style.zIndex = '1000';
    startYDecrease.style.display = 'flex';
    startYDecrease.style.justifyContent = 'center';
    startYDecrease.style.alignItems = 'center';
    startYDecrease.style.padding = '0';
    yControlWrapper.appendChild(startYDecrease);

    const startXIncrease = document.createElement('button');
    startXIncrease.innerText = '+';
    startXIncrease.style.width = '20px';
    startXIncrease.style.height = '29px';
    startXIncrease.style.zIndex = '1000';
    startXIncrease.style.display = 'flex';
    startXIncrease.style.justifyContent = 'center';
    startXIncrease.style.alignItems = 'center';
    startXIncrease.style.padding = '0';
    yControlWrapper.appendChild(startXIncrease);

    yControlWrapper.appendChild(startXInput);

    const startXDecrease = document.createElement('button');
    startXDecrease.innerText = '-';
    startXDecrease.style.width = '20px';
    startXDecrease.style.height = '29px';
    startXDecrease.style.zIndex = '1000';
    startXDecrease.style.display = 'flex';
    startXDecrease.style.justifyContent = 'center';
    startXDecrease.style.alignItems = 'center';
    startXDecrease.style.padding = '0';
    yControlWrapper.appendChild(startXDecrease);

    yControlWrapper.appendChild(fontSizeSlider);

    yControlWrapper.appendChild(thicknessSlider);

    yControlWrapper.appendChild(colorPicker);

    if (inputWrapper.parentNode) {
        inputWrapper.after(yControlWrapper);
    } else {
        document.body.appendChild(yControlWrapper);
    }

    const botControlWrapper = document.createElement('div');
    botControlWrapper.style.display = 'flex';
    botControlWrapper.style.alignItems = 'center';
    botControlWrapper.style.zIndex = '1000';

    const joinBotButton = document.createElement('button');
    joinBotButton.innerText = 'Join Bot';
    joinBotButton.title = 'Join';
    joinBotButton.style.zIndex = '1000';
    joinBotButton.style.width = '175px';
    botControlWrapper.appendChild(joinBotButton);

    const leaveBotButton = document.createElement('button');
    leaveBotButton.innerText = 'Leave Bot';
    leaveBotButton.title = 'Leave';
    leaveBotButton.style.zIndex = '1000';
    leaveBotButton.style.width = '175px';
    botControlWrapper.appendChild(leaveBotButton);

    if (yControlWrapper.parentNode) {
        yControlWrapper.after(botControlWrapper);
    } else {
        document.body.appendChild(botControlWrapper);
    }

    // === Event Handlers ===
    colorPicker.addEventListener('input', (e) => {
        selectedColor = e.target.value;
    });

    fontSizeSlider.addEventListener('input', (e) => {
        selectedFontSize = parseInt(e.target.value, 10);
    });

    thicknessSlider.addEventListener('input', (e) => {
        selectedThickness = parseInt(e.target.value, 10);
    });

    startXIncrease.addEventListener('click', () => updateValue(startXInput, 30));
    startXDecrease.addEventListener('click', () => updateValue(startXInput, -30));
    startYIncrease.addEventListener('click', () => updateValue(startYInput, 30));
    startYDecrease.addEventListener('click', () => updateValue(startYInput, -30));

    drawButton.addEventListener('click', () => {
        const text = textInput.value.trim(); // Pass original case string
        if (!text || !socket) {
            alert('Please ensure there is text to draw and socket is available.');
            return;
        }

        const startX = clamp(parseInt(startXInput.value, 10) || 0, 0, 760);
        const startY = clamp(parseInt(startYInput.value, 10) || 0, 0, 630);

        startXInput.value = startX;
        startYInput.value = startY;

        drawText(text, startX, startY, bot ? bot.conn.socket : null);
    });

    eraseButton.addEventListener('click', () => {
        const eraseText = textInput.value.trim(); // Pass original case string
        if (!eraseText || !socket) {
            alert('Please ensure there is text to erase and socket is available.');
            return;
        }

        const startX = clamp(parseInt(startXInput.value, 10) || 0, 0, 760);
        const startY = clamp(parseInt(startYInput.value, 10) || 0, 0, 630);

        startXInput.value = startX;
        startYInput.value = startY;

        const eraserFontSize = selectedFontSize;
        const eraserThickness = selectedThickness + 5;
        const eraseColor = '#ffffff';

        let currentX = startX;

        for (let i = 0; i < eraseText.length; i++) {
            const char = eraseText[i];
            const lowerChar = char.toLowerCase();
            if (char === ' ') {
                currentX += spaceWidth;
            } else if (letterPaths[char] || letterPaths[lowerChar]) {
                const path = letterPaths[char] || letterPaths[lowerChar];
                drawLetter(
                    path,
                    currentX,
                    startY,
                    eraserFontSize,
                    eraseColor,
                    eraserThickness,
                    bot ? bot.conn.socket : null
                );
                // Adjust spacing based on current and next characters
                if (lowerChar === 'i') {
                    currentX += eraserFontSize * 0.75;
                } else if (i < eraseText.length - 1 && eraseText[i + 1].toLowerCase() === 'a') {
                    currentX += eraserFontSize * 0.5;
                } else if (i < eraseText.length - 1 && eraseText[i + 1].toLowerCase() === 'i') {
                    currentX += eraserFontSize * 0.75;
                } else {
                    currentX += eraserFontSize;
                }
            } else if (numberPaths[char] || numberPaths[lowerChar]) {
                const path = numberPaths[char] || numberPaths[lowerChar];
                drawLetter(
                    path,
                    currentX,
                    startY,
                    eraserFontSize,
                    eraseColor,
                    eraserThickness,
                    bot ? bot.conn.socket : null
                );
                currentX += eraserFontSize;
            } else {
                console.log(`Text Draw Tool: Caracter '${char}' no soportado para borrado, saltando.`);
                currentX += eraserFontSize * 0.5;
            }
        }
    });

    function updateValue(input, change) {
        const currentValue = parseInt(input.value, 10) || 0;
        const newValue = clamp(currentValue + change, parseInt(input.min, 10), parseInt(input.max, 10));
        input.value = newValue;
    }

    // === Toggle Button Setup ===
    function createToggleButton() {
        const target = document.getElementById('homebutton');
        if (!target) return;

        const btnContainer = document.createElement('div');
        btnContainer.id = 'toggleButtonContainer';
        btnContainer.className = 'input-group-append';

        const toggleButton = document.createElement('button');
        toggleButton.className = 'btn btn-outline-secondary btn-sm';
        toggleButton.textContent = 'D';
        toggleButton.style.color = '#cc0000';
        toggleButton.style.background = '#c2c2c2';
        toggleButton.title = 'Click to toggle text drawing controls';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.transition = 'background 0.2s, color 0.2s';

        toggleButton.addEventListener('mouseenter', () => {
            toggleButton.style.background = '#8e2de2';
            toggleButton.style.color = '#ffffff';
        });

        toggleButton.addEventListener('mouseleave', () => {
            toggleButton.style.background = '#c2c2c2';
            toggleButton.style.color = '#cc0000';
        });

        toggleButton.addEventListener('click', () => {
            let menuOpen = toggleButton.getAttribute('data-open') !== 'true';
            toggleButton.setAttribute('data-open', menuOpen);
            toggleButton.style.background = menuOpen ? '#8e2de2' : '#c2c2c2';
            toggleButton.style.color = menuOpen ? '#ffffff' : '#cc0000';
            controlElements.forEach(element => {
                element.style.display = menuOpen ? 'block' : 'none';
            });
        });

        btnContainer.appendChild(toggleButton);
        target.before(btnContainer);
    }

    // === Bot Classes ===
    const Playerr = function (name = 'BotTextDrawer') {
        this.name = name;
        this.sid1 = null;
        this.uid = '';
        this.wt = '';

        this.conn = new Connectionn(this);
        this.room = new Rooom(this.conn);
    };
    Playerr.prototype.annonymize = function (name) {
        this.name = name;
        this.uid = undefined;
        this.wt = undefined;
    };

    const Connectionn = function (player) {
        this.player = player;
    };
    Connectionn.prototype.onopen = function (event) {
        console.log('Bot connection opened');
        this.Heartbeat(25000);
    };
    Connectionn.prototype.onclose = function (event) {
        console.log('Bot connection closed');
    };
    Connectionn.prototype.onerror = function (event) {
        console.error('Bot connection error:', event);
    };
    Connectionn.prototype.onmessage = function (event) {
        let message = String(event.data);
        if (message.startsWith('42')) {
            this.onbroadcast(message.slice(2));
        } else if (message.startsWith('40')) {
            this.onrequest();
        } else if (message.startsWith('41')) {
            this.player.room.join(this.player.room.id);
        } else if (message.startsWith('430')) {
            let configs = JSON.parse(message.slice(3))[0];
            this.player.room.players = configs.players;
            this.player.room.id = configs.roomid;
            console.log('Bot joined room:', this.player.room.id);
        }
    };
    Connectionn.prototype.onbroadcast = function (payload) {
        payload = JSON.parse(payload);
        if (payload[0] == 'bc_uc_freedrawsession_changedroom') {
            this.player.room.players = payload[3];
            this.player.room.id = payload[4];
        }
        if (payload[0] == 'mc_roomplayerschange') {
            this.player.room.players = payload[3];
        }
    };
    Connectionn.prototype.onrequest = function () {};
    Connectionn.prototype.open = function (url) {
        this.socket = new WebSocket(url);
        this.socket.onopen = this.onopen.bind(this);
        this.socket.onclose = this.onclose.bind(this);
        this.socket.onerror = this.onerror.bind(this);
        this.socket.onmessage = this.onmessage.bind(this);
    };
    Connectionn.prototype.close = function (code, reason) {
        this.socket.close(code, reason);
    };
    Connectionn.prototype.Heartbeat = function (interval) {
        let timeout = setTimeout(() => {
            if (this.socket.readyState == this.socket.OPEN) {
                this.socket.send(2);
                this.Heartbeat(interval);
            }
        }, interval);
    };
    Connectionn.prototype.serverconnect = function (server, room) {
        if (this.socket == undefined || this.socket.readyState != this.socket.OPEN) {
            this.open(server);
        } else {
            this.socket.send(41);
            this.socket.send(40);
        }
        this.onrequest = () => {
            this.socket.send(room);
        };
    };

    const Rooom = function (conn) {
        this.conn = conn;
        this.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        this.players = [];
    };
    Rooom.prototype.join = function (invitelink) {
        let gamemode = 2;
        let server = '';
        if (invitelink == null) {
            this.id = null;
            server = 'sv3.';
        } else {
            this.id = invitelink.startsWith('http') ? invitelink.split('/').pop() : invitelink;
            if (invitelink.endsWith('.3')) {
                server = 'sv3.';
                gamemode = 2;
            } else if (invitelink.endsWith('.2')) {
                server = 'sv2.';
                gamemode = 2;
            } else {
                server = '';
                gamemode = 1;
            }
        }

        let serverurl = `wss://${server}drawaria.online/socket.io/?sid1=undefined&hostname=drawaria.online&EIO=3&transport=websocket`;

        let player = this.conn.player;
        let playerName = player.name;
        let connectstring = `420["startplay","${playerName}",${gamemode},"en",${nulllify(this.id)},null,[null,"https://drawaria.online/",1000,1000,[${nulllify(player.sid1)},${nulllify(player.uid)},${nulllify(player.wt)}],null]]`;

        this.conn.serverconnect(serverurl, connectstring);
        console.log('Bot attempting to join room with connectstring:', connectstring);
    };

    // === Bot Control ===
    joinBotButton.addEventListener('click', () => {
        if (!bot) {
            bot = new Playerr('Text Drawer');
            bot.room.join(EL('#invurl') ? EL('#invurl').value : null);
            console.log('Bot created and join initiated');
        }
    });

    leaveBotButton.addEventListener('click', () => {
        if (bot && bot.conn.socket) {
            bot.conn.socket.close();
            bot = null;
            if (loopInterval) {
                clearInterval(loopInterval);
                loopInterval = null;
                toggleLoopButton.style.backgroundColor = '';
            }
            console.log('Bot left');
        }
    });

    const controlElements = [
        colorPicker, startXInput, startXIncrease, startXDecrease,
        startYInput, startYIncrease, startYDecrease,
        drawButton, eraseButton, textInput, toggleLoopButton,
        fontSizeSlider, thicknessSlider, clearButton,
        joinBotButton, leaveBotButton
    ];

    controlElements.forEach(element => {
        element.style.display = 'none';
    });

    createToggleButton();
})();