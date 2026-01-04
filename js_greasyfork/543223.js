// ==UserScript==
// @name         Drawaria Combined Auto-Manual Bot
// @namespace    http://tampermonkey.net/
// @version      1.22
// @description  Combined bot script with manual and auto drawing features
// @author       Infinite
// @include      https://drawaria.online*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543223/Drawaria%20Combined%20Auto-Manual%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/543223/Drawaria%20Combined%20Auto-Manual%20Bot.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const EL2 = (sel) => document.querySelector(sel);
    const ELL2 = (sel) => document.querySelectorAll(sel);

    // Drawing Tools
    let drawing_active = false;
    let previewCanvas = document.createElement('canvas');
    let originalCanvas = document.getElementById('canvas');
    let data = null; // Initialize as null
    let cw = previewCanvas.width;
    let ch = previewCanvas.height;
    let executionLine = [];
    let rainMode = true;
    let rainColumns = [];
    let isImageLoaded = false; // Flag to track image load

    // Room & Socket Control
    window.myRoom = {};
    window.sockets = [];
    window.bots = [];

    // Initialize engine functions early
    window['___ENGINE'] = {
        loadImage: function(url) {
            var img = new Image();
            img.addEventListener('load', () => {
                previewCanvas.width = originalCanvas.width;
                previewCanvas.height = originalCanvas.height;
                cw = previewCanvas.width;
                ch = previewCanvas.height;
                var ctx = previewCanvas.getContext('2d');
                let modifier = 1;
                if (img.width > previewCanvas.width) {
                    modifier = previewCanvas.width / img.width;
                } else {
                    modifier = previewCanvas.height / img.height;
                }
                ctx.drawImage(img, 0, 0, img.width * modifier, img.height * modifier);
                var imgData = ctx.getImageData(0, 0, previewCanvas.width, previewCanvas.height);
                data = imgData.data;
                ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
                console.debug('Image loaded and ready');
                isImageLoaded = true; // Set flag when image is loaded
            });
            img.crossOrigin = 'anonymous';
            img.src = url;
        },
        drawImage: function(size, modifier = 1, thickness = 5, offset = { x: 0, y: 0 }, ignorcolors = []) {
            if (!data) {
                console.warn('drawImage skipped: No image data available');
                return; // Exit if data is not loaded
            }
            executionLine = [];
            rainColumns = [];
            for (let x = 0; x < cw; x += size * modifier) {
                let columnPixels = [];
                for (let y = 0; y < ch; y += size * modifier) {
                    let index = (y * cw + x) * 4;
                    let a = data[index + 3];
                    if (a > 20) {
                        let r = data[index + 0], g = data[index + 1], b = data[index + 2];
                        let color = `rgb(${r},${g},${b})`;
                        if (!ignorcolors.includes(color)) {
                            columnPixels.push({ x: x, y: y, color: color });
                        }
                    }
                }
                if (columnPixels.length > 0) {
                    rainColumns.push({ x: x, pixels: columnPixels });
                }
            }
            if (rainMode) {
                shuffleArray(rainColumns);
                for (let col of rainColumns) {
                    let pixels = col.pixels;
                    let start = pixels[0];
                    let prev = start;
                    for (let i = 1; i < pixels.length; i++) {
                        let current = pixels[i];
                        if (current.y !== prev.y + size * modifier || current.color !== prev.color) {
                            executionLine.push({
                                pos1: recalc([start.x, start.y], size, offset),
                                pos2: recalc([prev.x, prev.y], size, offset),
                                color: start.color,
                                thickness: thickness
                            });
                            start = current;
                        }
                        prev = current;
                    }
                    executionLine.push({
                        pos1: recalc([start.x, start.y], size, offset),
                        pos2: recalc([prev.x, prev.y], size, offset),
                        color: start.color,
                        thickness: thickness
                    });
                }
            } else {
                for (let y = 0; y < ch; y += size * modifier) {
                    let start = [0, y];
                    for (let x = 0; x < ch; x += size * modifier) {
                        let end = [x, y];
                        let index = (y * cw + x) * 4;
                        let a = data[index + 3];
                        if (a > 20) {
                            end = [x, y];
                            let r = data[index + 0], g = data[index + 1], b = data[index + 2];
                            let color = `rgb(${r},${g},${b})`;
                            if (!ignorcolors.includes(color)) {
                                if (x < cw - 1) {
                                    let n_r = data[index + size * modifier * 4 + 4], n_g = data[index + size * modifier * 4 + 5], n_b = data[index + size * modifier * 4 + 6];
                                    let samecolor = true;
                                    if ((r != n_r && g != n_g && b != n_b) || data[index + 7] < 20) samecolor = false;
                                    if (!samecolor) {
                                        executionLine.push({
                                            pos1: recalc(start, size, offset),
                                            pos2: recalc(end, size, offset),
                                            color: color,
                                            thickness: thickness,
                                        });
                                        start = [x, y];
                                    }
                                } else {
                                    executionLine.push({
                                        pos1: recalc(start, size, offset),
                                        pos2: recalc(end, size, offset),
                                        color: color,
                                        thickness: thickness,
                                    });
                                }
                            }
                        } else {
                            start = [x, y];
                        }
                    }
                }
            }
            console.debug('Drawing commands prepared:', executionLine.length);
        }
    };

    const originalSend2 = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (window.sockets.indexOf(this) === -1) {
            window.sockets.push(this);
            if (window.sockets.indexOf(this) === 0) {
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
                    } else if (message.startsWith('41')) {
                        // Handle disconnection
                    } else if (message.startsWith('430')) {
                        let configs = JSON.parse(message.slice(3))[0];
                        window.myRoom.players = configs.players;
                        window.myRoom.id = configs.roomid;
                        console.log('Room joined, initializing Engine');
                        if (!document.getElementById('Engine-Cheatcontainer')) {
                            Engine();
                        }
                        if (rainMode && isImageLoaded) { // Only proceed if image is loaded
                            setTimeout(() => {
                                let size = document.getElementById('engine_imagesize').value;
                                let modifier = document.getElementById('engine_pixelsize').value;
                                let thickness = document.getElementById('engine_brushsize').value;
                                let offset = {
                                    x: document.getElementById('engine_offset_x').value,
                                    y: document.getElementById('engine_offset_y').value,
                                };
                                window['___ENGINE'].drawImage(size, modifier, thickness, offset);
                                execute(window['___BOT'].conn.socket);
                            }, 3000);
                        }
                    }
                });
            }
        }
        return originalSend2.call(this, ...args);
    };

    // Add Boxicons Stylesheet
    function addBoxIcons() {
        let boxicons = document.createElement('link');
        boxicons.href = 'https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css';
        boxicons.rel = 'stylesheet';
        document.head.appendChild(boxicons);
    }

    // Add Stylesheet
    function CreateStylesheet2() {
        let container = document.createElement('style');
        container.innerHTML =
            '#Engine-Cheatcontainer.hidden { display: none !important; } ' +
            '#Engine-Cheatcontainer input[type="text"], #Engine-Cheatcontainer input[type="number"] { text-align: center; -webkit-appearance: none; -moz-appearance: textfield; } ' +
            '#Engine-Cheatcontainer #auto-tab input[type="text"], #Engine-Cheatcontainer #auto-tab input[type="number"] { width: 100%; padding: 2px; font-size: 16px; } ' + // Full width
            '#Engine-Cheatcontainer #manual-tab input[type="text"], #Engine-Cheatcontainer #manual-tab input[type="number"] { width: 60px; padding: 2px; font-size: 16px; } ' +
            '.hidden { display: none; } ' +
            '#Engine-Cheatcontainer .cheat-row { display: flex; width: 100%; } ' +
            '#Engine-Cheatcontainer #auto-tab .cheat-row { flex-direction: row; } ' + // Vertical stacking
            '#Engine-Cheatcontainer #auto-tab .cheat-row > * { width: 100%; margin: 0; } ' + // Full width, no margins
            '#Engine-Cheatcontainer #manual-tab .cheat-row { gap: 2px; margin: 2px 0; flex-wrap: wrap; } ' +
            '#Engine-Cheatcontainer .cheat-border { text-align: center; line-height: inherit; border: 1px solid coral; } ' +
            '#Engine-Cheatcontainer #auto-tab .cheat-border { width: 100%; } ' +
            '#Engine-Cheatcontainer #manual-tab .cheat-border { padding: 4px; font-size: 16px; cursor: pointer; flex: 1; min-width: 50px; } ' +
            '#Engine-Cheatcontainer .rain-toggle { background-color: #4CAF50; color: white; } ' +
            '#Engine-Cheatcontainer #manual-tab .mini-canvas-container { border: 1px solid #000; margin: 5px; width: 200px; height: 200px; background: #fff; } ' +
            '#Engine-Cheatcontainer #manual-tab .gradient-strip { border: 1px solid #000; margin: 5px; width: 200px; height: 20px; cursor: pointer; } ' +
            '#Engine-Cheatcontainer #manual-tab .drawing-controls { margin: 5px; } ' +
            '#Engine-Cheatcontainer { width: 100%; padding: 0; box-sizing: border-box; } ' + // Use 100% width, ensure box-sizing includes borders
            '#Engine-Cheatcontainer .tab { padding: 5px; cursor: pointer; border: 1px solid coral; background-color: transparent; color: black; width: 50%; box-sizing: border-box; } ' + // Full width split, coral border
            '#Engine-Cheatcontainer .tab:not(:last-child) { border-right: none; } ' + // Remove right border between tabs
            '#Engine-Cheatcontainer .tab.active { background-color: black; color: white; } ' + // Black background when active
            '#Engine-Cheatcontainer .tab-content { display: none; } ' +
            '#Engine-Cheatcontainer .tab-content.active { display: block; }';
        document.head.appendChild(container);
    }

    // Utility functions
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function recalc(value, size, offset) {
        return [(value[0] / (cw * size) + offset.x / 100).toFixed(4), (value[1] / (ch * size) + offset.y / 100).toFixed(4)];
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Add CheatActivator & CheatContainer
    let isContainerVisible = false;
    function Engine() {
        let existingContainer = document.getElementById('Engine-Cheatcontainer');
        if (existingContainer) {
            existingContainer.className = 'cheat-container' + (isContainerVisible ? '' : ' hidden');
            existingContainer.style.removeProperty('display');
            existingContainer.style.width = '100%'; // Enforce 100% width inline
            BotControl(existingContainer); // Reinitialize events
            return; // Skip reinitialization if container exists
        }

        let CheatContainer = document.createElement('div');
        CheatContainer.id = 'Engine-Cheatcontainer';
        CheatContainer.className = 'cheat-container' + (isContainerVisible ? '' : ' hidden');
        CheatContainer.style.width = '100%'; // Set inline width to 100%
        document.getElementById('chatbox_messages').after(CheatContainer);

        function CreateToggleButton(Cheatcontainer) {
            let target = document.getElementById('chatbox_textinput');
            let btncontainer = document.createElement('div');
            btncontainer.id = 'togglecheats';
            btncontainer.className = 'input-group-append';

            let togglebtn = document.createElement('button');
            togglebtn.className = 'btn btn-outline-secondary';
            togglebtn.innerHTML = '<i class="bx bx-bot"></i>';
            togglebtn.addEventListener('click', (e) => {
                e.preventDefault();
                isContainerVisible = !isContainerVisible;
                togglebtn.classList.toggle('active', isContainerVisible);
                Cheatcontainer.classList.toggle('hidden', !isContainerVisible);
                Cheatcontainer.style.removeProperty('display'); // Clear inline styles
            });
            btncontainer.appendChild(togglebtn);
            target.after(btncontainer);
        }
        CreateToggleButton(CheatContainer);
        BotControl(CheatContainer);
    }

    // Add CheatActivator & CheatContainer
    function BotControl(CheatContainer) {
        let container = document.createElement('div');

        container.innerHTML =
            '<div class="cheat-row"><div class="tab" data-tab="manual">Manual Drawing</div><div class="tab" data-tab="auto">Auto Drawing</div></div>' +
            '<div id="manual-tab" class="tab-content active">' +
            '<div><input type="text" id="inputName" style="width:100%" placeholder="Bot Name"></div>' +
            '<div class="cheat-row">' +
            '<i class="bx bx-user-plus cheat-border" id="botJoinThree" title="Join Bot"><span>Join</span></i>' +
            '<i class="bx bx-user-minus cheat-border" id="botLeave" title="Leave"><span>Leave</span></i>' +
            '<i class="bx bx-brush cheat-border" id="drawingBot" title="Drawing Bot"><span>Draw</span></i>' +
            '</div>' +
            '<div id="drawingBotContainer" class="hidden drawing-controls">' +
            '<canvas id="miniCanvas" width="200" height="200" class="mini-canvas-container"></canvas>' +
            '<div class="cheat-row" style="gap: 5px; align-items: center;">' +
            '<canvas id="rainbowStrip" width="200" height="20" class="gradient-strip"></canvas>' +
            '<label><input type="checkbox" id="rainbowMode"> Rainbow</label>' +
            '<canvas id="fireStrip" width="200" height="20" class="gradient-strip"></canvas>' +
            '<label><input type="checkbox" id="fireMode"> Fire</label>' +
            '<canvas id="pastelStrip" width="200" height="20" class="gradient-strip"></canvas>' +
            '<label><input type="checkbox" id="pastelMode"> Pastel</label>' +
            '</div>' +
            '<div class="cheat-row">' +
            '<input type="number" id="brushSize" min="1" max="9999" value="4" title="Brush Size">' +
            '<input type="number" id="rainbowSpeed" min="0" max="1000" value="50" title="Rainbow Speed (ms)">' +
            '<select id="rainbowDirection" title="Rainbow Direction">' +
            '<option value="forward">Forward</option>' +
            '<option value="reverse">Reverse</option>' +
            '</select>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="auto-tab" class="tab-content">' +
            '<div><input type="text" id="inputNameAuto" style="width:100%" placeholder="Name of Bot"></div>' +
            '<div class="cheat-row"><i class="bx bx-user-plus cheat-border" id="botJoin" title="Join"><span>Join</span></i><i class="bx bx-user-minus cheat-border" id="botLeaveAuto" title="Leave"><span>Leave</span></i><i class="bx bxs-eraser cheat-border" id="canvasClear" title="Clear"><span>Clear</span></i></div>' +
            '<div class="cheat-row"><input type="file" id="IPutImage" class="cheat-border" title="Upload Image"></div>' +
            '<div class="cheat-row" style="flex-wrap: nowrap;">' +
            '<input type="number" id="engine_imagesize" min="0" max="10" value="1" title="Image Size. 1 = big. 10 = small">' +
            '<input type="number" id="engine_brushsize" min="2" max="30" value="4" title="Your Brush Size">' +
            '<input type="number" id="engine_pixelsize" min="1" max="30" value="2" title="Distance between Pixels\nBest use half of brushsize">' +
            '<input type="number" id="engine_offset_x" min="0" max="100" value="0" title="Distance Left">' +
            '<input type="number" id="engine_offset_y" min="0" max="100" value="0" title="Distance Top">' +
            '</div>' +
            '<div class="cheat-row">' +
            '<i class="bx bx-play-circle cheat-border" id="botStartDrawing" title="Start"><span>Start</span></i>' +
            '<i class="bx bx-stop-circle cheat-border" id="botStopDrawing" title="Stop"><span>Stop</span></i>' +
            '<i class="bx bx-cloud-rain cheat-border rain-toggle" id="toggleRainMode" title="Rain Mode"><span>Rain Mode</span></i>' +
            '</div>' +
            '</div>';

        CheatContainer.appendChild(container);

        // Tab Switching
        ELL2('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                ELL2('.tab').forEach(t => t.classList.remove('active'));
                ELL2('.tab-content').forEach(content => content.classList.remove('active'));
                tab.classList.add('active');
                EL2(`#${tab.dataset.tab}-tab`).classList.add('active');
            });
        });

        // Manual Drawing Logic
        let currentHue = 0;
        let rainbowModeManual = false;
        let fireModeManual = false;
        let pastelModeManual = false;
        let rainbowSpeed = 50;
        let rainbowDirection = 'forward';
        let colorInterval = null;
        let selectedColor = null;

        const palettes = {
            rainbow: { colors: [], dynamic: true },
            fire: { colors: ['#FFDB8E', '#FFCD81', '#FFA16F', '#FF7E61', '#F46363', '#DE4E70', '#B73B7C', '#922A7B', '#711C6F', '#54155B', '#2D025C', '#28005C'] },
            pastel: { colors: ['#000000', '#FFFFFF', '#7F7F7F', '#ff0000', '#00ff00', '#0000ff', '#93cfff', '#ffff00', '#ff9300', '#7f007f', '#ffbfff', '#7f3f00'] }
        };

        function initGradientStrip() {
            // Initialize Rainbow Strip
            const rainbowStrip = EL2('#rainbowStrip');
            const rainbowCtx = rainbowStrip.getContext('2d');
            for (let x = 0; x < rainbowStrip.width; x++) {
                const hue = (x / rainbowStrip.width) * 360;
                rainbowCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                rainbowCtx.fillRect(x, 0, 1, rainbowStrip.height);
            }
            rainbowStrip.addEventListener('click', (e) => {
                const rect = rainbowStrip.getBoundingClientRect();
                const x = e.clientX - rect.left;
                currentHue = (x / rainbowStrip.width) * 360;
                selectedColor = null;
                rainbowModeManual = false;
                fireModeManual = false;
                pastelModeManual = false;
                EL2('#rainbowMode').checked = false;
                EL2('#fireMode').checked = false;
                EL2('#pastelMode').checked = false;
                if (colorInterval) clearInterval(colorInterval);
            });

            // Initialize Fire Strip
            const fireStrip = EL2('#fireStrip');
            const fireCtx = fireStrip.getContext('2d');
            const fireStep = fireStrip.width / palettes.fire.colors.length;
            palettes.fire.colors.forEach((color, i) => {
                fireCtx.fillStyle = color;
                fireCtx.fillRect(i * fireStep, 0, fireStep + 1, fireStrip.height);
            });
            fireStrip.addEventListener('click', (e) => {
                const rect = fireStrip.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const index = Math.floor((x / fireStrip.width) * palettes.fire.colors.length);
                selectedColor = palettes.fire.colors[index % palettes.fire.colors.length];
                currentHue = 0;
                rainbowModeManual = false;
                fireModeManual = false;
                pastelModeManual = false;
                EL2('#rainbowMode').checked = false;
                EL2('#fireMode').checked = false;
                EL2('#pastelMode').checked = false;
                if (colorInterval) clearInterval(colorInterval);
            });

            // Initialize Pastel Strip
            const pastelStrip = EL2('#pastelStrip');
            const pastelCtx = pastelStrip.getContext('2d');
            const pastelStep = pastelStrip.width / palettes.pastel.colors.length;
            palettes.pastel.colors.forEach((color, i) => {
                pastelCtx.fillStyle = color;
                pastelCtx.fillRect(i * pastelStep, 0, pastelStep + 1, pastelStrip.height);
            });
            pastelStrip.addEventListener('click', (e) => {
                const rect = pastelStrip.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const index = Math.floor((x / pastelStrip.width) * palettes.pastel.colors.length);
                selectedColor = palettes.pastel.colors[index % palettes.pastel.colors.length];
                currentHue = 0;
                rainbowModeManual = false;
                fireModeManual = false;
                pastelModeManual = false;
                EL2('#rainbowMode').checked = false;
                EL2('#fireMode').checked = false;
                EL2('#pastelMode').checked = false;
                if (colorInterval) clearInterval(colorInterval);
            });
        }

        function startColorCycle() {
            if (colorInterval) clearInterval(colorInterval);
            colorInterval = setInterval(() => {
                const step = rainbowDirection === 'forward' ? 1 : -1;
                currentHue = (currentHue + step) % 360;
                if (currentHue < 0) currentHue += 360;
            }, rainbowSpeed);
        }

        function stopColorCycle() {
            if (colorInterval) clearInterval(colorInterval);
            colorInterval = null;
        }

        function initDrawingBot() {
            if (window.bots.length === 0) {
                console.log('No bots joined, drawing disabled');
                return;
            }
            const miniCanvas = EL2('#miniCanvas');
            const ctx = miniCanvas.getContext('2d');
            let isDrawing = false;
            let brushSize = 4;

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            EL2('#brushSize').addEventListener('input', (e) => {
                brushSize = parseInt(e.target.value);
            });
            EL2('#rainbowSpeed').addEventListener('input', (e) => {
                rainbowSpeed = parseInt(e.target.value);
                if (rainbowModeManual || fireModeManual || pastelModeManual) {
                    stopColorCycle();
                    startColorCycle();
                }
            });
            EL2('#rainbowDirection').addEventListener('change', (e) => {
                rainbowDirection = e.target.value;
                if (rainbowModeManual || fireModeManual || pastelModeManual) {
                    stopColorCycle();
                    startColorCycle();
                }
            });
            EL2('#rainbowMode').addEventListener('change', (e) => {
                rainbowModeManual = e.target.checked;
                fireModeManual = false;
                pastelModeManual = false;
                EL2('#fireMode').checked = false;
                EL2('#pastelMode').checked = false;
                if (rainbowModeManual) {
                    startColorCycle();
                } else {
                    stopColorCycle();
                }
            });
            EL2('#fireMode').addEventListener('change', (e) => {
                fireModeManual = e.target.checked;
                rainbowModeManual = false;
                pastelModeManual = false;
                EL2('#rainbowMode').checked = false;
                EL2('#pastelMode').checked = false;
                if (fireModeManual) {
                    startColorCycle();
                } else {
                    stopColorCycle();
                }
            });
            EL2('#pastelMode').addEventListener('change', (e) => {
                pastelModeManual = e.target.checked;
                rainbowModeManual = false;
                fireModeManual = false;
                EL2('#rainbowMode').checked = false;
                EL2('#fireMode').checked = false;
                if (pastelModeManual) {
                    startColorCycle();
                } else {
                    stopColorCycle();
                }
            });

            let lastX, lastY;
            miniCanvas.addEventListener('mousedown', (e) => {
                isDrawing = true;
                const pos = getCanvasPos(e, miniCanvas);
                lastX = pos.x;
                lastY = pos.y;
                draw(pos.x, pos.y, lastX, lastY, currentHue, brushSize);
            });
            miniCanvas.addEventListener('mousemove', (e) => {
                if (!isDrawing) return;
                const pos = getCanvasPos(e, miniCanvas);
                draw(pos.x, pos.y, lastX, lastY, currentHue, brushSize);
                lastX = pos.x;
                lastY = pos.y;
            });
            miniCanvas.addEventListener('mouseup', () => isDrawing = false);
            miniCanvas.addEventListener('mouseout', () => isDrawing = false);

            function getCanvasPos(e, canvas) {
                const rect = canvas.getBoundingClientRect();
                return { x: e.clientX - rect.left, y: e.clientY - rect.top };
            }

            function draw(x, y, lastX, lastY, hue, thickness) {
                if (window.bots.length === 0 || !window.bots[0].conn.socket.readyState === WebSocket.OPEN) {
                    return;
                }
                const mainX = x / 2;
                const mainY = y / 2;
                const mainLastX = lastX / 2;
                const mainLastY = lastY / 2;
                let color;

                if (rainbowModeManual || fireModeManual || pastelModeManual) {
                    if (rainbowModeManual) {
                        color = `hsl(${hue}, 100%, 50%)`;
                    } else if (fireModeManual) {
                        const fireColors = palettes.fire.colors;
                        color = fireColors[Math.floor(hue) % fireColors.length];
                    } else if (pastelModeManual) {
                        const pastelColors = palettes.pastel.colors;
                        color = pastelColors[Math.floor(hue) % pastelColors.length];
                    }
                } else if (selectedColor) {
                    color = selectedColor;
                } else {
                    color = `hsl(${hue}, 100%, 50%)`; // Default to hue if no mode or selection
                }

                window.bots.forEach(bot => {
                    const cmd = `42["drawcmd",0,[${mainLastX},${mainLastY},${mainX},${mainY},false,${0 - thickness},"${color}",0,0,{}]]`;
                    bot.action.DrawLine(mainLastX, mainLastY, mainX, mainY, thickness, color);
                });

                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(x, y);
                ctx.strokeStyle = color;
                ctx.lineWidth = thickness / 5;
                ctx.stroke();
            }
        }

        EL2('#botJoinThree').addEventListener('mousedown', () => {
            let baseName = EL2('#inputName').value || 'Bot';
            window.bots = [];
            for (let i = 0; i < 1; i++) {
                let bot = new Player(`${baseName}`);
                window.bots.push(bot);
                bot.room.join(EL2('#invurl') ? EL2('#invurl').value : null);
            }
            const drawingContainer = EL2('#drawingBotContainer');
            if (!drawingContainer.classList.contains('hidden')) {
                initDrawingBot();
            }
        });

        EL2('#botLeave').addEventListener('mousedown', () => {
            window.bots.forEach(bot => bot.conn.socket.close());
            window.bots = [];
        });

        EL2('#drawingBot').addEventListener('mousedown', () => {
            const drawingContainer = EL2('#drawingBotContainer');
            const isHidden = drawingContainer.classList.contains('hidden');
            drawingContainer.classList.toggle('hidden');
            if (isHidden) {
                initGradientStrip();
                if (window.bots.length > 0) {
                    initDrawingBot();
                }
            }
        });

        // Auto Drawing Logic
        async function execute(socket) {
            drawing_active = true;
            if (rainMode) shuffleArray(executionLine);
            for (let i = 0; i < executionLine.length; i++) {
                if (!drawing_active) return;
                let currentLine = executionLine[i];
                let p1 = currentLine.pos1, p2 = currentLine.pos2, color = currentLine.color, thickness = currentLine.thickness;
                drawcmd(socket, p1, p2, color, thickness);
                await delay(10); // Allow stop to interrupt
            }
        }

        function drawcmd(s, start, end, color, thickness) {
            s.send(`42["drawcmd",0,[${start[0]},${start[1]},${end[0]},${end[1]},false,${0 - thickness},"${color}",0,0,{}]]`);
        }

        EL2('#IPutImage').addEventListener('change', function() {
            if (!this.files || !this.files[0]) return;
            const FR = new FileReader();
            FR.addEventListener('load', (evt) => window['___ENGINE'].loadImage(evt.target.result));
            FR.readAsDataURL(this.files[0]);
        });

        EL2('#botJoin').addEventListener('mousedown', (e) => {
            let playerName = EL2('#inputNameAuto').value;
            window['___BOT'].room.join(EL2('#invurl') ? EL2('#invurl').value : null);
        });

        EL2('#botLeaveAuto').addEventListener('mousedown', (e) => {
            window['___BOT'].conn.socket.close();
        });

        EL2('#canvasClear').addEventListener('mousedown', (e) => {
            console.log('Clearing canvas');
            if (window.bots.length > 0 && window.bots[0].conn.socket.readyState === WebSocket.OPEN) {
                window.bots[0].action.DrawLine(50, 50, 50, 50, 2000, '#FFFFFF');
                console.log('Clear command sent via bot');
            } else if (window['___BOT'].conn.socket.readyState === WebSocket.OPEN) {
                window['___BOT'].action.DrawLine(50, 50, 50, 50, 2000, '#FFFFFF');
                console.log('Clear command sent via ___BOT');
            } else {
                console.warn('No active bot connection to clear canvas');
            }
        });

        EL2('#botStopDrawing').addEventListener('mousedown', (e) => {
            drawing_active = false;
            console.log('Stop button pressed, drawing_active set to false');
        });

        EL2('#botStartDrawing').addEventListener('mousedown', (e) => {
            let size = EL2('#engine_imagesize').value;
            let modifier = EL2('#engine_pixelsize').value;
            let thickness = EL2('#engine_brushsize').value;
            let offset = {
                x: EL2('#engine_offset_x').value,
                y: EL2('#engine_offset_y').value,
            };
            window['___ENGINE'].drawImage(size, modifier, thickness, offset);
            execute(window['___BOT'].conn.socket);
        });

        EL2('#toggleRainMode').addEventListener('mousedown', (e) => {
            rainMode = !rainMode;
            e.target.classList.toggle('rain-toggle', rainMode);
        });
    }

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
    };
    Connection.prototype.onopen = function () {
        this.Heartbeat(25000);
    };
    Connection.prototype.onclose = function () {};
    Connection.prototype.onerror = function () {};
    Connection.prototype.onmessage = function (event) {
        let message = String(event.data);
        if (message.startsWith('42')) {
            this.onbroadcast(message.slice(2));
        } else if (message.startsWith('40')) {
            this.onrequest();
        } else if (message.startsWith('41')) {
            // Handle disconnection
        } else if (message.startsWith('430')) {
            let configs = JSON.parse(message.slice(3))[0];
            window.myRoom.players = configs.players;
            window.myRoom.id = configs.roomid;
            console.log('Room joined, initializing Engine');
            if (!document.getElementById('Engine-Cheatcontainer')) {
                Engine();
            }
        }
    };
    Connection.prototype.onbroadcast = function (payload) {
        payload = JSON.parse(payload);
        if (payload[0] == 'bc_uc_freedrawsession_changedroom') {
            window.myRoom.players = payload[3];
        }
        if (payload[0] == 'mc_roomplayerschange') {
            window.myRoom.players = payload[3];
        }
    };
    Connection.prototype.onrequest = function () {};
    Connection.prototype.open = function (url) {
        this.socket = new WebSocket(url);
        this.socket.onopen = this.onopen.bind(this);
        this.socket.onclose = this.onclose.bind(this);
        this.socket.onerror = this.onerror.bind(this);
        this.socket.onmessage = this.onmessage.bind(this);
    };
    Connection.prototype.close = function (code, reason) {
        this.socket.close(code, reason);
    };
    Connection.prototype.Heartbeat = function (interval) {
        let timeout = setTimeout(() => {
            if (this.socket.readyState == this.socket.OPEN) {
                this.socket.send(2);
                this.Heartbeat(interval);
            }
        }, interval);
    };
    Connection.prototype.serverconnect = function (server, room) {
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

    const Room = function (conn) {
        this.conn = conn;
        this.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        this.players = [];
    };
    Room.prototype.join = function (invitelink) {
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
        let playerName = EL2('#inputName').value || EL2('#inputNameAuto').value || player.name;
        let connectstring = `420["startplay","${playerName}",${gamemode},"en",${nullify(this.id)},null,[null,"https://drawaria.online/",1000,1000,[${nullify(player.sid1)},${nullify(player.uid)},${nullify(player.wt)}],null]]`;
        this.conn.serverconnect(serverurl, connectstring);
    };

    const Actions = function (conn) {
        this.conn = conn;
    };
    Actions.prototype.SendMessage = function (message) {
        this.conn.socket.send(`42["chatmsg","${message}"]`);
    };
    Actions.prototype.DrawLine = function (bx = 50, by = 50, ex = 50, ey = 50, thickness = 50, color = '#FFFFFF', algo = 0) {
        bx = bx / 100;
        by = by / 100;
        ex = ex / 100;
        ey = ey / 100;
        this.conn.socket.send(`42["drawcmd",0,[${bx},${by},${ex},${ey},true,${0 - thickness},"${color}",0,0,{"2":${algo},"3":0.5,"4":0.5}]]`);
        this.conn.socket.send(`42["drawcmd",0,[${bx},${by},${ex},${ey},false,${0 - thickness},"${color}",0,0,{"2":${algo},"3":0.5,"4":0.5}]]`);
    };

    var nullify = (value = null) => {
        return value == null ? null : String().concat('"', value, '"');
    };

    if (!document.getElementById('Engine-Cheatcontainer')) {
        window['___BOT'] = new Player('CombinedBot');
        addBoxIcons();
        CreateStylesheet2();
    }
})();