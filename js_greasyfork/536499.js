// ==UserScript==
// @name         Drawaria World Generator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Drawaria World Generator with improved UI, image fitting, optimization controls, and spiral drawing for ~5s rendering.
// @author       YouTubeDrawaria
// @include      https://drawaria.online*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online/room/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536499/Drawaria%20World%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/536499/Drawaria%20World%20Generator.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const EL = (sel) => document.querySelector(sel);
    const ELL = (sel) => document.querySelectorAll(sel);

    // Drawing variables
    let drawing_active = false; // Flag to stop drawing
    let previewCanvas = document.createElement('canvas');
    let originalCanvas = null; // Will be set when canvas is found
    let cw = 0; // Canvas width
    let ch = 0; // Canvas height
    var data; // Image pixel data from previewCanvas
    let executionLine = []; // Array to store drawing commands

    // Room & Socket Control (Keep existing logic)
    window.myRoom = {};
    window.sockets = [];

    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (window.sockets.indexOf(this) === -1) {
            window.sockets.push(this);
            // Listen only to the first socket connection established by the game itself
            if (window.sockets.indexOf(this) === 0) {
                this.addEventListener('message', (event) => {
                    let message = String(event.data);
                    if (message.startsWith('42')) {
                        let payload = JSON.parse(message.slice(2));
                        // Update room info on relevant messages
                        if (payload[0] == 'bc_uc_freedrawsession_changedroom') {
                            if (payload.length > 3) window.myRoom.players = payload[3];
                            if (payload.length > 4) window.myRoom.id = payload[4]; // Room ID might be here
                        }
                        if (payload[0] == 'mc_roomplayerschange') {
                            if (payload.length > 3) window.myRoom.players = payload[3];
                        }
                        // Additional checks for potential room ID updates
                        if (payload[0] === 'gamestart' && payload[1]?.roomid) {
                            window.myRoom.id = payload[1].roomid;
                            if (payload[1].players) window.myRoom.players = payload[1].players;
                        }
                        // Listen for the drawing canvas to become available
                        if (originalCanvas === null) {
                            originalCanvas = document.getElementById('canvas');
                            if (originalCanvas) {
                                cw = originalCanvas.width;
                                ch = originalCanvas.height;
                                console.log(`Drawaria canvas found: ${cw}x${ch}`);
                            }
                        }
                    } else if (message.startsWith('41')) {
                        // Server acknowledges connection upgrade
                    } else if (message.startsWith('430')) {
                        // Initial room configuration upon connection
                        let configs = JSON.parse(message.slice(3))[0];
                        if (configs) {
                            window.myRoom.players = configs.players;
                            window.myRoom.id = configs.roomid;
                        }
                        // Check for canvas again after initial connection
                        if (originalCanvas === null) {
                            originalCanvas = document.getElementById('canvas');
                            if (originalCanvas) {
                                cw = originalCanvas.width;
                                ch = originalCanvas.height;
                                console.log(`Drawaria canvas found: ${cw}x${ch}`);
                            }
                        }
                    }
                });
            }
        }
        return originalSend.call(this, ...args);
    };

    // Add Boxicons Stylesheet
    function addBoxIcons() {
        let boxicons = document.createElement('link');
        boxicons.href = 'https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css';
        boxicons.rel = 'stylesheet';
        document.head.appendChild(boxicons);
    }

    // Add Custom Stylesheet
    function CreateStylesheet() {
        let container = document.createElement('style');
        container.innerHTML =
            '#world-generator { position: absolute; top: 10px; left: 10px; background-color: #ffffff; border: 2px solid #555; border-radius: 8px; padding: 15px; cursor: grab; z-index: 1000; font-family: sans-serif; box-shadow: 3px 3px 8px rgba(0,0,0,0.3); } ' +
            '#world-generator.dragging { cursor: grabbing; }' +
            '#world-generator h2 { margin-top: 0; margin-bottom: 15px; color: #333; text-align: center; border-bottom: 1px solid #eee; padding-bottom: 10px; } ' +
            '#world-generator .world-list { max-height: 200px; overflow-y: auto; margin BOTTOM: 15px; padding-right: 5px; }' +
            '#world-generator .world-item { margin: 5px 0; padding: 10px; background-color: #eef; border: 1px solid #ccf; border-radius: 5px; cursor: pointer; transition: background-color 0.2s ease, transform 0.1s ease; color: #333; } ' +
            '#world-generator .world-item:hover { background-color: #ddf; transform: translateY(-1px); } ' +
            '#world-generator .controls { margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border: 1px solid #eee; border-radius: 5px; } ' +
            '#world-generator .control-group { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px; margin-bottom: 10px; }' +
            '#world-generator .control-item label { display: block; margin-bottom: 3px; font-size: 0.9em; color: #555; } ' +
            '#world-generator .control-item input[type="number"] { width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 3px; box-sizing: border-box; text-align: center; -webkit-appearance: none; -moz-appearance: textfield; } ' +
            '#world-generator .control-item input[type="number"]::-webkit-outer-spin-button, #world-generator .control-item input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; } ' +
            '#start-button, #stop-button { width: 100%; padding: 10px; border: none; border-radius: 5px; cursor: pointer; font-size: 1em; transition: background-color 0.2s ease, transform 0.1s ease; color: white; text-align: center; } ' +
            '#start-button { background-color: #5cb85c; } ' +
            '#start-button:hover { background-color: #4cae4c; transform: translateY(-1px); } ' +
            '#stop-button { background-color: #d9534f; margin-top: 10px; } ' +
            '#stop-button:hover { background-color: #c9302c; transform: translateY(-1px); } ' +
            '#status { margin-top: 10px; text-align: center; font-size: 0.9em; color: #555; min-height: 1.2em; }';
        document.head.appendChild(container);
    }

    // Add World Generator Menu
    function CreateWorldGenerator() {
        originalCanvas = document.getElementById('canvas');
        if (!originalCanvas) {
            console.warn("Drawaria canvas not found. World Generator will wait for it.");
            const observer = new MutationObserver((mutations, obs) => {
                originalCanvas = document.getElementById('canvas');
                if (originalCanvas) {
                    cw = originalCanvas.width;
                    ch = originalCanvas.height;
                    console.log(`Drawaria canvas found: ${cw}x${ch}`);
                    createUI();
                    obs.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            return;
        } else {
            cw = originalCanvas.width;
            ch = originalCanvas.height;
            console.log(`Drawaria canvas found immediately: ${cw}x${ch}`);
            createUI();
        }
    }

    function createUI() {
        if (document.getElementById('world-generator')) {
            console.log("World Generator UI already exists.");
            return;
        }

        let worldGenerator = document.createElement('div');
        worldGenerator.id = 'world-generator';
        worldGenerator.innerHTML = `
            <h2>Drawaria World Generator</h2>
            <div class="world-list">
                <div class="world-item" data-world="Superflat">Superflat</div>
                <div class="world-item" data-world="Lava Cave">Lava Cave</div>
                <div class="world-item" data-world="Desert Vista">Desert Vista</div>
                <div class="world-item" data-world="Night Landscape">Night Landscape</div>
                <div class="world-item" data-world="House">House</div>
                <div class="world-item" data-world="Classroom">Classroom</div>
                <div class="world-item" data-world="Castle">Castle</div>
                <div class="world-item" data-world="School">School</div>
            </div>
            <div class="controls">
                <div class="control-group">
                    <div class="control-item">
                        <label for="draw-size">Step Size</label>
                        <input type="number" id="draw-size" value="4" min="1" step="1">
                    </div>
                    <div class="control-item">
                        <label for="draw-modifier">Step Modifier</label>
                        <input type="number" id="draw-modifier" value="3" min="1" step="1">
                    </div>
                    <div class="control-item">
                        <label for="draw-thickness">Thickness</label>
                        <input type="number" id="draw-thickness" value="50" min="1" step="1">
                    </div>
                    <div class="control-item">
                        <label for="draw-delay">Delay (ms)</label>
                        <input type="number" id="draw-delay" value="1" min="0" step="1"> <!-- Reduced to 1ms -->
                    </div>
                    <div class="control-item">
                        <label for="speed-factor">Speed Factor (1-10)</label>
                        <input type="number" id="speed-factor" value="2" min="1" max="10" step="1"> <!-- New control -->
                    </div>
                </div>
                <div class="control-item">
                    <label for="ignore-colors">Ignore Colors (hex/rgb, comma-separated)</label>
                    <input type="text" id="ignore-colors" value="">
                </div>
            </div>
            <button id="start-button">Load & Generate</button>
            <button id="stop-button" class="hidden">Stop Drawing</button>
            <div id="status">Select a world to load.</div>
        `;
        document.body.appendChild(worldGenerator);

        const startButton = document.getElementById('start-button');
        const stopButton = document.getElementById('stop-button');
        const statusDiv = document.getElementById('status');

        // Make the menu draggable
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        worldGenerator.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.classList.contains('world-item') || e.target.closest('.controls')) {
                return;
            }
            e.preventDefault();
            worldGenerator.classList.add('dragging');
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            worldGenerator.style.top = (worldGenerator.offsetTop - pos2) + "px";
            worldGenerator.style.left = (worldGenerator.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            worldGenerator.classList.remove('dragging');
            document.onmouseup = null;
            document.onmousemove = null;
        }

        // Add event listeners to world items
        let worldItems = worldGenerator.querySelectorAll('.world-item');
        worldItems.forEach(item => {
            item.addEventListener('click', async () => {
                if (drawing_active) {
                    alert("Please stop the current drawing first.");
                    return;
                }
                const worldName = item.getAttribute('data-world');
                const worldUrl = WORLDS[worldName];
                if (worldUrl) {
                    statusDiv.textContent = `Loading "${worldName}"...`;
                    startButton.disabled = true;
                    stopButton.classList.add('hidden');
                    drawing_active = false;

                    try {
                        await loadImage(worldUrl);
                        statusDiv.textContent = `"${worldName}" loaded. Ready to draw (${executionLine.length} commands).`;
                        startButton.textContent = "Start Drawing";
                        startButton.disabled = false;
                    } catch (error) {
                        console.error("Error loading image:", error);
                        statusDiv.textContent = `Error loading "${worldName}". See console.`;
                        startButton.textContent = "Load & Generate";
                        startButton.disabled = false;
                    }
                } else {
                    statusDiv.textContent = `Error: World "${worldName}" not found.`;
                }
            });
        });

        // Start button
        startButton.addEventListener('click', async () => {
            if (executionLine.length === 0) {
                statusDiv.textContent = 'Please load an image first.';
                return;
            }
            if (window['___BOT'] && window['___BOT'].conn && window['___BOT'].conn.socket && window['___BOT'].conn.socket.readyState === WebSocket.OPEN) {
                drawing_active = true;
                startButton.classList.add('hidden');
                stopButton.classList.remove('hidden');
                statusDiv.textContent = `Drawing... (0/${executionLine.length})`;
                await execute(window['___BOT'].conn.socket);
                drawing_active = false;
                startButton.classList.remove('hidden');
                stopButton.classList.add('hidden');
                startButton.textContent = "Load & Generate";
                statusDiv.textContent = `Drawing finished (${executionLine.length}/${executionLine.length}).`;
            } else {
                statusDiv.textContent = 'Error: Bot socket not available or not open.';
                console.error("Bot socket not available or not open.", window['___BOT']);
            }
        });

        // Stop button
        stopButton.addEventListener('click', () => {
            drawing_active = false;
            stopButton.disabled = true;
            statusDiv.textContent = 'Stopping drawing...';
        });

        // Initial status
        statusDiv.textContent = originalCanvas ? 'Select a world to load.' : 'Waiting for game canvas...';
        if (!originalCanvas) startButton.disabled = true;
    }

    const WORLDS = {
        "Superflat": "https://static.vecteezy.com/system/resources/thumbnails/027/879/859/small/side-view-land-and-cloud-in-pixel-art-style-vector.jpg",
        "Lava Cave": "https://pics.craiyon.com/2023-09-23/40aa7363eec448ea836d2fb2cd4cce6a.webp",
        "Desert Vista": "https://i.ibb.co/pv9sVTtP/9e14aa6d-2348-4654-b235-c41ebbe678f2.png",
        "Night Landscape": "https://images.stockcake.com/public/2/b/c/2bc47920-6b02-49b8-aac8-81d965e2ab70_large/moonlit-pixel-city-stockcake.jpg",
        "House": "https://static.vecteezy.com/system/resources/previews/010/963/629/non_2x/house-pixel-icon-free-vector.jpg",
        "Classroom": "https://i.ibb.co/hFHRGT3j/download.jpg",
        "Castle": "https://i.ibb.co/8gRg8rtZ/cwtdyva7.png",
        "School": "https://static.vecteezy.com/system/resources/previews/045/712/354/non_2x/school-building-in-pixel-art-style-vector.jpg"
    };

    // Convert hex to RGB
    function hexToRgb(hex) {
        const bigint = parseInt(hex.replace('#', ''), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgb(${r},${g},${b})`;
    }

    // Parse ignore colors input
    function parseIgnoreColors(input) {
        const colors = input.split(',').map(c => c.trim()).filter(c => c);
        const rgbColors = [];
        colors.forEach(color => {
            if (color.startsWith('#')) {
                try {
                    rgbColors.push(hexToRgb(color));
                } catch (e) {
                    console.warn(`Invalid hex color: ${color}`);
                }
            } else if (color.startsWith('rgb(') && color.endsWith(')')) {
                const rgbValues = color.substring(4, color.length - 1).split(',').map(Number);
                if (rgbValues.length === 3 && rgbValues.every(v => v >= 0 && v <= 255)) {
                    rgbColors.push(color);
                } else {
                    console.warn(`Invalid rgb color format or values: ${color}`);
                }
            } else {
                console.warn(`Unrecognized color format: ${color}`);
            }
        });
        return rgbColors;
    }

    // Load and process image
    async function loadImage(url) {
        return new Promise((resolve, reject) => {
            if (!originalCanvas) {
                reject("Drawaria canvas not found.");
                return;
            }

            const img = new Image();
            img.crossOrigin = 'Anonymous';

            img.addEventListener('load', () => {
                previewCanvas.width = cw;
                previewCanvas.height = ch;
                const ctx = previewCanvas.getContext('2d');

                // Scale and center image
                const scaleW = cw / img.width;
                const scaleH = ch / img.height;
                const scale = Math.max(scaleW, scaleH);
                const scaledWidth = img.width * scale;
                const scaledHeight = img.height * scale;
                const offsetX = (cw - scaledWidth) / 2;
                const offsetY = (ch - scaledHeight) / 2;

                ctx.clearRect(0, 0, cw, ch);
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, cw, ch);
                ctx.drawImage(img, 0, 0, img.width, img.height, offsetX, offsetY, scaledWidth, scaledHeight);

                const imgData = ctx.getImageData(0, 0, cw, ch);
                data = imgData.data;
                ctx.clearRect(0, 0, cw, ch);

                // Generate commands with spiral pattern
                const size = parseInt(document.getElementById('draw-size').value, 10) || 4;
                const modifier = parseInt(document.getElementById('draw-modifier').value, 10) || 4;
                const thickness = parseInt(document.getElementById('draw-thickness').value, 10) || 27;
                const speedFactor = parseInt(document.getElementById('speed-factor').value, 10) || 2;
                const ignoreInput = document.getElementById('ignore-colors').value;
                const ignoreColors = parseIgnoreColors(ignoreInput);

                generateDrawingCommands(size, modifier, thickness, speedFactor, ignoreColors);

                console.log('Image loaded and commands generated.');
                resolve();
            });

            img.addEventListener('error', (e) => {
                console.error("Failed to load image:", url, e);
                reject(`Failed to load image: ${url}`);
            });

            img.src = url;
        });
    }

// Generate drawing commands using rectangular spiral pattern
function generateDrawingCommands(size, modifier, thickness, speedFactor, ignoreColors) {
    executionLine = [];
    const step = Math.max(1, size * modifier * speedFactor); // Scale step with speedFactor
    if (step <= 0) {
        console.error("Invalid step size:", step);
        alert("Error generating commands: Invalid step size.");
        return;
    }

    // Spiral traversal: outer to inner rectangular spiral
    let left = 0, right = cw - 1, top = 0, bottom = ch - 1;
    let currentSegmentStart = null; // Start pixel coordinate [x, y]
    let currentSegmentColor = null; // Current segment color

    // Create reference objects to pass to processPixel
    const segmentRefs = {
        currentSegmentStart: { value: null },
        currentSegmentColor: { value: null }
    };

    while (left <= right && top <= bottom) {
        // Traverse top row (left to right)
        for (let x = left; x <= right; x += step) {
            processPixel(x, top, step, thickness, ignoreColors, segmentRefs.currentSegmentStart, segmentRefs.currentSegmentColor);
        }
        top += step;

        // Traverse right column (top to bottom)
        for (let y = top; y <= bottom && left <= right; y += step) {
            processPixel(right, y, step, thickness, ignoreColors, segmentRefs.currentSegmentStart, segmentRefs.currentSegmentColor);
        }
        right -= step;

        // Traverse bottom row (right to left)
        for (let x = right; x >= left && top <= bottom; x -= step) {
            processPixel(x, bottom, step, thickness, ignoreColors, segmentRefs.currentSegmentStart, segmentRefs.currentSegmentColor);
        }
        bottom -= step;

        // Traverse left column (bottom to top)
        for (let y = bottom; y >= top && left <= right; y -= step) {
            processPixel(left, y, step, thickness, ignoreColors, segmentRefs.currentSegmentStart, segmentRefs.currentSegmentColor);
        }
        left += step;
    }

    // End any active segment
    if (segmentRefs.currentSegmentStart.value !== null) {
        executionLine.push({
            pos1: recalc(segmentRefs.currentSegmentStart.value),
            pos2: recalc(segmentRefs.currentSegmentStart.value), // End at same point for single pixel
            color: segmentRefs.currentSegmentColor.value,
            thickness: thickness,
        });
    }

    console.log(`Generated ${executionLine.length} drawing commands.`);
}

// Helper to process a pixel and manage segments
function processPixel(x, y, step, thickness, ignoreColors, currentSegmentStartRef, currentSegmentColorRef) {
    if (x < 0 || x >= cw || y < 0 || y >= ch) return;

    const pixelIndex = (y * cw + x) * 4;
    const alpha = data[pixelIndex + 3];

    if (alpha > 20) {
        const r = data[pixelIndex + 0];
        const g = data[pixelIndex + 1];
        const b = data[pixelIndex + 2];
        const color = `rgb(${r},${g},${b})`;

        if (!ignoreColors.includes(color)) {
            if (currentSegmentStartRef.value === null) {
                currentSegmentStartRef.value = [x, y];
                currentSegmentColorRef.value = color;
            } else if (color !== currentSegmentColorRef.value) {
                executionLine.push({
                    pos1: recalc(currentSegmentStartRef.value),
                    pos2: recalc([x, y]),
                    color: currentSegmentColorRef.value,
                    thickness: thickness,
                });
                currentSegmentStartRef.value = [x, y];
                currentSegmentColorRef.value = color;
            }
            // Continue segment if color is the same
        } else if (currentSegmentStartRef.value !== null) {
            executionLine.push({
                pos1: recalc(currentSegmentStartRef.value),
                pos2: recalc([x, y]),
                color: currentSegmentColorRef.value,
                thickness: thickness,
            });
            currentSegmentStartRef.value = null;
            currentSegmentColorRef.value = null;
        }
    } else if (currentSegmentStartRef.value !== null) {
        executionLine.push({
            pos1: recalc(currentSegmentStartRef.value),
            pos2: recalc([x, y]),
            color: currentSegmentColorRef.value,
            thickness: thickness,
        });
        currentSegmentStartRef.value = null;
        currentSegmentColorRef.value = null;
    }
}

    // Helper to process a pixel and manage segments
    function processPixel(x, y, step, thickness, ignoreColors, currentSegmentStartRef, currentSegmentColorRef) {
        if (x < 0 || x >= cw || y < 0 || y >= ch) return;

        const pixelIndex = (y * cw + x) * 4;
        const alpha = data[pixelIndex + 3];

        if (alpha > 20) {
            const r = data[pixelIndex + 0];
            const g = data[pixelIndex + 1];
            const b = data[pixelIndex + 2];
            const color = `rgb(${r},${g},${b})`;

            if (!ignoreColors.includes(color)) {
                if (currentSegmentStartRef.value === null) {
                    currentSegmentStartRef.value = [x, y];
                    currentSegmentColorRef.value = color;
                } else if (color !== currentSegmentColorRef.value) {
                    executionLine.push({
                        pos1: recalc(currentSegmentStartRef.value),
                        pos2: recalc([x, y]),
                        color: currentSegmentColorRef.value,
                        thickness: thickness,
                    });
                    currentSegmentStartRef.value = [x, y];
                    currentSegmentColorRef.value = color;
                }
            } else if (currentSegmentStartRef.value !== null) {
                executionLine.push({
                    pos1: recalc(currentSegmentStartRef.value),
                    pos2: recalc([x, y]),
                    color: currentSegmentColorRef.value,
                    thickness: thickness,
                });
                currentSegmentStartRef.value = null;
                currentSegmentColorRef.value = null;
            }
        } else if (currentSegmentStartRef.value !== null) {
            executionLine.push({
                pos1: recalc(currentSegmentStartRef.value),
                pos2: recalc([x, y]),
                color: currentSegmentColorRef.value,
                thickness: thickness,
            });
            currentSegmentStartRef.value = null;
            currentSegmentColorRef.value = null;
        }
    }

    // Execute drawing commands with optimized timing
    async function execute(socket) {
        const delayMs = parseInt(document.getElementById('draw-delay').value, 10) || 1;
        const statusDiv = document.getElementById('status');
        const stopButton = document.getElementById('stop-button');
        stopButton.disabled = false;
        const maxCommandsPerSecond = 500; // Prevent server overload
        const batchSize = Math.floor(1000 / maxCommandsPerSecond / delayMs) || 1;

        for (let i = 0; i < executionLine.length; i += batchSize) {
            if (!drawing_active) {
                console.log("Drawing stopped by user.");
                statusDiv.textContent = `Drawing stopped (${i}/${executionLine.length}).`;
                break;
            }

            // Send batch of commands
            for (let j = 0; j < batchSize && i + j < executionLine.length; j++) {
                let currentLine = executionLine[i + j];
                let p1 = currentLine.pos1;
                let p2 = currentLine.pos2;
                let color = currentLine.color;
                let thickness = currentLine.thickness;

                if (p1 && p2 && typeof p1[0] === 'number' && typeof p1[1] === 'number' && typeof p2[0] === 'number' && typeof p2[1] === 'number' && !isNaN(p1[0]) && !isNaN(p1[1]) && !isNaN(p2[0]) && !isNaN(p2[1])) {
                    drawcmd(socket, p1, p2, color, thickness);
                } else {
                    console.warn("Skipping invalid command:", currentLine);
                }
            }

            // Update status every 50 commands or at end
            if ((i + batchSize) % 50 === 0 || i + batchSize >= executionLine.length) {
                statusDiv.textContent = `Drawing... (${Math.min(i + batchSize, executionLine.length)}/${executionLine.length})`;
            }

            // Check WebSocket buffer to prevent overload
            if (socket.bufferedAmount > 100000) {
                console.warn("WebSocket buffer high, pausing...");
                await delay(100);
            }

            await delay(delayMs);
        }
        stopButton.disabled = true;
    }

    // Send drawing command
    function drawcmd(s, start, end, color, thickness) {
        const cmd = `42["drawcmd",0,[${start[0].toFixed(4)},${start[1].toFixed(4)},${end[0].toFixed(4)},${end[1].toFixed(4)},false,${0 - thickness},"${color}",0,0,{}]]`;
        s.send(cmd);
    }

    // Delay function
    function delay(ms) {
        return new Promise((resolve) => {
            if (ms > 0) {
                setTimeout(resolve, ms);
            } else {
                resolve();
            }
        });
    }

    // Recalculate coordinates to normalized
    function recalc(pixelCoords) {
        if (cw === 0 || ch === 0) {
            console.error("Canvas dimensions not set!", cw, ch);
            return [NaN, NaN];
        }
        return [
            pixelCoords[0] / cw,
            pixelCoords[1] / ch
        ];
    }

    // Helper from original bot
    var nullify = (value = null) => {
        return value == null ? null : String().concat('"', value, '"');
    };

    // Initialize script
    function init() {
        if (!document.getElementById('world-generator')) {
            addBoxIcons();
            CreateStylesheet();
            CreateWorldGenerator();

            if (!window['___BOT']) {
                window['___BOT'] = new Player('bot');
            }
            if (!window['___ENGINE']) {
                window['___ENGINE'] = { loadImage: loadImage, drawImage: generateDrawingCommands, execute: execute, recalc: recalc };
            }
        } else {
            console.log("World Generator script already running.");
        }
    }

    window.addEventListener('load', init);
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

    // Player/Connection/Room/Actions classes
    const Player = function (name = undefined) {
        this.name = name;
        this.sid1 = null;
        this.uid = '';
        this.wt = '';
        this.conn = new Connection(this);
        this.room = new Room(this.conn);
        this.action = new Actions(this.conn);
    };

    Player.prototype.annonymize = function (name) {
        this.name = name;
        this.uid = undefined;
        this.wt = undefined;
    };

    const Connection = function (player) {
        this.player = player;
        this.socket = null;
    };

    Connection.prototype.onopen = function (event) {
        this.Heartbeat(25000);
    };

    Connection.prototype.onclose = function (event) {
    };

    Connection.prototype.onerror = function (event) {
        console.error("Socket error:", event);
    };

    Connection.prototype.onmessage = function (event) {
        let message = String(event.data);
        if (message.startsWith('42')) {
            this.onbroadcast(message.slice(2));
        } else if (message.startsWith('40')) {
            this.onrequest();
        } else if (message.startsWith('41')) {
        } else if (message.startsWith('430')) {
            let configs = JSON.parse(message.slice(3))[0];
            if (configs) {
                this.player.room.players = configs.players;
                this.player.room.id = configs.roomid;
                console.log(`Bot joined room ${this.player.room.id}`);
            }
        }
    };

    Connection.prototype.onbroadcast = function (payload) {
        try {
            payload = JSON.parse(payload);
            if (payload[0] == 'bc_uc_freedrawsession_changedroom') {
                if (payload.length > 3) this.player.room.players = payload[3];
                if (payload.length > 4) this.player.room.id = payload[4];
            }
            if (payload[0] == 'mc_roomplayerschange') {
                if (payload.length > 3) this.player.room.players = payload[3];
            }
        } catch(e) {
            console.error("Error parsing broadcast payload:", payload, e);
        }
    };

    Connection.prototype.onrequest = function () {
    };

    Connection.prototype.open = function (url) {
        if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
            console.log("Socket already open or connecting.");
            return;
        }
        this.socket = new WebSocket(url);
        this.socket.onopen = this.onopen.bind(this);
        this.socket.onclose = this.onclose.bind(this);
        this.socket.onerror = this.onerror.bind(this);
        this.socket.onmessage = this.onmessage.bind(this);
        console.log("Attempting to open WebSocket:", url);
    };

    Connection.prototype.close = function (code, reason) {
        if (this.socket) {
            console.log("Closing WebSocket:", code, reason);
            this.socket.close(code, reason);
            this.socket = null;
        }
    };

    Connection.prototype.Heartbeat = function (interval) {
        this.heartbeatTimeout = setTimeout(() => {
            if (this.socket && this.socket.readyState == this.socket.OPEN) {
                this.socket.send(2);
                this.Heartbeat(interval);
            } else {
                console.log("Heartbeat stopped, socket not open.");
            }
        }, interval);
    };

    Connection.prototype.stopHeartbeat = function() {
        if (this.heartbeatTimeout) {
            clearTimeout(this.heartbeatTimeout);
            this.heartbeatTimeout = null;
        }
    };

    Connection.prototype.serverconnect = function (server, connectstring) {
        this.stopHeartbeat();
        this.close();
        this.open(server);
        this.onrequest = () => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(connectstring);
                this.onrequest = function() {};
            } else {
                console.error("Socket not open when onrequest was called.");
            }
        };
    };

    const Room = function (conn) {
        this.conn = conn;
        this.id = null;
        this.players = [];
    };

    Room.prototype.join = function (invitelink) {
        let gamemode = 2;
        let server = '';
        let roomIdToSend = null;

        if (invitelink != null) {
            if (invitelink.startsWith('http')) {
                const urlParts = invitelink.split('/');
                this.id = urlParts.pop();
            } else {
                this.id = invitelink;
            }
            roomIdToSend = nullify(this.id);
            if (this.id && typeof this.id === 'string') {
                if (this.id.endsWith('.3')) {
                    server = 'sv3.';
                    gamemode = 2;
                } else if (this.id.endsWith('.2')) {
                    server = 'sv2.';
                    gamemode = 2;
                } else {
                    server = '';
                    gamemode = 2;
                }
            } else {
                console.warn("Could not parse room ID from invitelink:", invitelink);
                roomIdToSend = null;
                server = 'sv3.';
                gamemode = 2;
                this.id = null;
            }
} else {
    this.id = null;
    server = 'sv3.';
    gamemode = 2;
    roomIdToSend = null;
}

let serverurl = `wss://${server}drawaria.online/socket.io/?sid1=undefined&hostname=drawaria.online&EIO=3&transport=websocket`;
let player = this.conn.player;
let connectstring = `420["startplay",${nullify(player.name)},${gamemode},"en",${roomIdToSend},null,[${nullify(player.sid1)},${nullify(player.uid)},${nullify(player.wt)}],null]]`;

console.log("Attempting to connect to server:", serverurl, "with command:", connectstring);
this.conn.serverconnect(serverurl, connectstring);
};

Room.prototype.next = function () {
    if (this.conn.socket && this.conn.socket.readyState === this.conn.socket.OPEN) {
        this.conn.socket.send('42["pgswtichroom"]');
    } else {
        console.warn("Socket not open, cannot switch room.");
        this.join(null);
    }
};

const Actions = function (conn) {
    this.conn = conn;
};

Actions.prototype.DrawLine = function (bx = 50, by = 50, ex = 50, ey = 50, thickness = 50, color = '#FFFFFF', algo = 0) {
    bx = bx / 100;
    by = by / 100;
    ex = ex / 100;
    ey = ey / 100;
    if (this.conn.socket && this.conn.socket.readyState === this.conn.socket.OPEN) {
        this.conn.socket.send(`42["drawcmd",0,[${bx},${by},${ex},${ey},true,${0 - thickness},"${color}",0,0,{"2":${algo},"3":0.5,"4":0.5}]]`);
        this.conn.socket.send(`42["drawcmd",0,[${bx},${by},${ex},${ey},false,${0 - thickness},"${color}",0,0,{"2":${algo},"3":0.5,"4":0.5}]]`);
    } else {
        console.warn("Socket not open, cannot draw line.");
    }
};

})();
