// ==UserScript==
// @name         Drawaria Multidrawing Mode Full!
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enhanced drawing cheat menu for Drawaria with modern floating UI
// @author       YouTubeDrawaria
// @license      MIT
// @include      https://drawaria.online*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @require      https://cdn.tailwindcss.com
// @downloadURL https://update.greasyfork.org/scripts/536360/Drawaria%20Multidrawing%20Mode%20Full%21.user.js
// @updateURL https://update.greasyfork.org/scripts/536360/Drawaria%20Multidrawing%20Mode%20Full%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // DOM Utilities
    const EL = (sel) => document.querySelector(sel);
    const ELL = (sel) => document.querySelectorAll(sel);

    // Drawing Tools State
    let drawing_active = false;
    let previewCanvas = document.createElement('canvas');
    let originalCanvas = EL('#canvas');
    let data;
    let cw, ch;
    let executionLine = [];
    let drawMode = 'zigzag'; // 'normal', 'spiral', 'wave', or 'zigzag'

    // Room & Socket Control
    window.myRoom = {};
    window.sockets = [];

    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(...args) {
        if (window.sockets.indexOf(this) === -1) {
            window.sockets.push(this);
            if (window.sockets.indexOf(this) === 0) {
                this.addEventListener('message', (event) => {
                    let message = String(event.data);
                    if (message.startsWith('42')) {
                        let payload = JSON.parse(message.slice(2));
                        if (payload[0] === 'bc_uc_freedrawsession_changedroom') {
                            window.myRoom.players = payload[3];
                        }
                        if (payload[0] === 'mc_roomplayerschange') {
                            window.myRoom.players = payload[3];
                        }
                    } else if (message.startsWith('41')) {
                        // Handle disconnect
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

    // Create Floating Menu
    function createFloatingMenu() {
        const menu = document.createElement('div');
        menu.id = 'cheat-menu';
        menu.className = 'fixed top-20 right-4 w-80 bg-gray-800 text-white rounded-lg shadow-xl z-50 p-4 max-h-[80vh] overflow-y-auto';
        menu.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold">Drawaria Multidrawing Mode Full!</h2>
                <button id="toggle-menu" class="text-gray-400 hover:text-white">
                    <i class='bx bx-x'></i>
                </button>
            </div>
            <div id="cheat-content" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium">Image Upload</label>
                    <input type="file" id="IPutImage" class="w-full bg-gray-700 rounded p-2 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium">Bot Name</label>
                    <input type="text" id="inputName" placeholder="Bot Name" class="w-full bg-gray-700 rounded p-2 text-sm">
                </div>
                <div class="grid grid-cols-3 gap-2">
                    <button id="botJoin" class="bg-blue-600 hover:bg-blue-700 rounded p-2 text-sm flex items-center justify-center"><i class='bx bx-user-plus mr-1'></i>Join</button>
                    <button id="botLeave" class="bg-red-600 hover:bg-red-700 rounded p-2 text-sm flex items-center justify-center"><i class='bx bx-user-minus mr-1'></i>Leave</button>
                    <button id="canvasClear" class="bg-gray-600 hover:bg-gray-700 rounded p-2 text-sm flex items-center justify-center"><i class='bx bxs-eraser mr-1'></i>Clear</button>
                </div>
                <div>
                    <label class="block text-sm font-medium">Drawing Controls</label>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="text-xs">Image Size</label>
                            <input type="number" id="engine_imagesize" min="1" max="10" value="4" class="w-full bg-gray-700 rounded p-1 text-sm">
                        </div>
                        <div>
                            <label class="text-xs">Brush Size</label>
                            <input type="number" id="engine_brushsize" min="2" max="20" value="4" class="w-full bg-gray-700 rounded p-1 text-sm">
                        </div>
                        <div>
                            <label class="text-xs">Pixel Distance</label>
                            <input type="number" id="engine_pixelsize" min="2" max="20" value="2" class="w-full bg-gray-700 rounded p-1 text-sm">
                        </div>
                        <div>
                            <label class="text-xs">Offset X</label>
                            <input type="number" id="engine_offset_x" min="0" max="100" value="0" class="w-full bg-gray-700 rounded p-1 text-sm">
                        </div>
                        <div>
                            <label class="text-xs">Offset Y</label>
                            <input type="number" id="engine_offset_y" min="0" max="100" value="0" class="w-full bg-gray-700 rounded p-1 text-sm">
                        </div>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium">Draw Mode</label>
                    <div class="grid grid-cols-3 gap-2">
                        <button id="setZigzagMode" class="bg-green-600 hover:bg-green-700 rounded p-2 text-sm flex items-center justify-center active-mode"><i class='bx bx-zigzag mr-1'></i>Zigzag</button>
                        <button id="setWaveMode" class="bg-blue-600 hover:bg-blue-700 rounded p-2 text-sm flex items-center justify-center"><i class='bx bx-wave mr-1'></i>Wave</button>
                        <button id="setSpiralMode" class="bg-purple-600 hover:bg-purple-700 rounded p-2 text-sm flex items-center justify-center"><i class='bx bx-spiral mr-1'></i>Spiral</button>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <button id="botStartDrawing" class="bg-green-600 hover:bg-green-700 rounded p-2 text-sm flex items-center justify-center"><i class='bx bx-play-circle mr-1'></i>Start</button>
                    <button id="botStopDrawing" class="bg-red-600 hover:bg-red-700 rounded p-2 text-sm flex items-center justify-center"><i class='bx bx-stop-circle mr-1'></i>Stop</button>
                </div>
            </div>
        `;

        document.body.appendChild(menu);

        // Make menu draggable
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        const header = menu.querySelector('div:first-child');

        header.addEventListener('mousedown', (e) => {
            initialX = e.clientX - currentX;
            initialY = e.clientY - currentY;
            isDragging = true;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                menu.style.left = currentX + 'px';
                menu.style.top = currentY + 'px';
                menu.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Toggle menu visibility
        const toggleBtn = EL('#toggle-menu');
        const content = EL('#cheat-content');
        toggleBtn.addEventListener('click', () => {
            content.classList.toggle('hidden');
            toggleBtn.innerHTML = content.classList.contains('hidden') ? `<i class='bx bx-menu'></i>` : `<i class='bx bx-x'></i>`;
        });

        // Initialize position
        currentX = window.innerWidth - menu.offsetWidth - 16;
        currentY = 80;
        menu.style.left = currentX + 'px';
        menu.style.top = currentY + 'px';
    }

    // Add Boxicons
    function addBoxIcons() {
        const link = document.createElement('link');
        link.href = 'https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }

    // Image Loader
    function setupImageLoader() {
        EL('#IPutImage').addEventListener('change', function() {
            if (!this.files || !this.files[0]) return;
            const FR = new FileReader();
            FR.addEventListener('load', (evt) => {
                loadImage(evt.target.result);
            });
            FR.readAsDataURL(this.files[0]);
        });
    }

    // Bot Controls
    function setupBotControls() {
        EL('#botJoin').addEventListener('click', () => {
            window['___BOT'].room.join(EL('#invurl')?.value || null);
        });
        EL('#botLeave').addEventListener('click', () => {
            window['___BOT'].conn.socket.close();
        });
        EL('#canvasClear').addEventListener('click', () => {
            window['___BOT'].action.DrawLine(50, 50, 50, 50, 2000);
        });
    }

    // Drawing Controls
    function setupDrawingControls() {
        EL('#setZigzagMode').addEventListener('click', function() {
            drawMode = 'zigzag';
            updateModeButtons(this);
        });
        EL('#setWaveMode').addEventListener('click', function() {
            drawMode = 'wave';
            updateModeButtons(this);
        });
        EL('#setSpiralMode').addEventListener('click', function() {
            drawMode = 'spiral';
            updateModeButtons(this);
        });

        EL('#botStopDrawing').addEventListener('click', () => {
            drawing_active = false;
        });

        EL('#botStartDrawing').addEventListener('click', () => {
            let size = parseInt(EL('#engine_imagesize').value);
            let modifier = parseInt(EL('#engine_pixelsize').value);
            let thickness = parseInt(EL('#engine_brushsize').value);
            let offset = {
                x: parseInt(EL('#engine_offset_x').value),
                y: parseInt(EL('#engine_offset_y').value),
            };
            drawImage(size, modifier, thickness, offset);
            execute(window['___BOT'].conn.socket);
        });

        function updateModeButtons(activeButton) {
            const buttons = ['setZigzagMode', 'setWaveMode', 'setSpiralMode'];
            buttons.forEach(id => {
                const btn = EL(`#${id}`);
                btn.classList.toggle('bg-green-600', btn === activeButton);
                btn.classList.toggle('bg-blue-600', btn !== activeButton && id === 'setWaveMode');
                btn.classList.toggle('bg-purple-600', btn !== activeButton && id === 'setSpiralMode');
                btn.classList.toggle('hover:bg-green-700', btn === activeButton);
                btn.classList.toggle('hover:bg-blue-700', btn !== activeButton && id === 'setWaveMode');
                btn.classList.toggle('hover:bg-purple-700', btn !== activeButton && id === 'setSpiralMode');
            });
        }
    }

    // Image Processing
    function loadImage(url) {
        const img = new Image();
        img.addEventListener('load', () => {
            previewCanvas.width = originalCanvas.width;
            previewCanvas.height = originalCanvas.height;
            cw = previewCanvas.width;
            ch = previewCanvas.height;

            const ctx = previewCanvas.getContext('2d');
            let modifier = 1;
            if (img.width > previewCanvas.width) {
                modifier = previewCanvas.width / img.width;
            } else {
                modifier = previewCanvas.height / img.height;
            }

            ctx.drawImage(img, 0, 0, img.width * modifier, img.height * modifier);
            const imgData = ctx.getImageData(0, 0, cw, ch);
            data = imgData.data;
            ctx.clearRect(0, 0, cw, ch);
            console.debug('Image loaded');
        });
        img.crossOrigin = 'anonymous';
        img.src = url;
    }

    // Drawing Modes
    function drawImage(size, modifier = 1, thickness = 5, offset = { x: 0, y: 0 }, ignorcolors = []) {
        executionLine = [];
        switch (drawMode) {
            case 'zigzag':
                drawZigzagImage(size, modifier, thickness, offset, ignorcolors);
                break;
            case 'wave':
                drawWaveImage(size, modifier, thickness, offset, ignorcolors);
                break;
            case 'spiral':
                drawSpiralImage(size, modifier, thickness, offset, ignorcolors);
                break;
            default:
                drawNormalImage(size, modifier, thickness, offset, ignorcolors);
        }
        console.debug('Drawing prepared');
    }

    function drawZigzagImage(size, modifier, thickness, offset, ignorcolors) {
        const step = size * modifier;
        let goingRight = true;
        let lastPoint = null;

        for (let y = 0; y < ch; y += step) {
            if (goingRight) {
                for (let x = 0; x < cw; x += step) {
                    processPixel(x, y);
                }
            } else {
                for (let x = cw - step; x >= 0; x -= step) {
                    processPixel(x, y);
                }
            }
            goingRight = !goingRight;

            if (y + step < ch && lastPoint) {
                const nextY = y + step;
                const pixel = getPixelData(lastPoint.x, nextY, size, ignorcolors);
                if (pixel) {
                    executionLine.push({
                        pos1: recalc([lastPoint.x, y], size, offset),
                        pos2: recalc([lastPoint.x, nextY], size, offset),
                        color: lastPoint.color,
                        thickness: thickness
                    });
                }
            }
        }

        function processPixel(x, y) {
            const pixel = getPixelData(x, y, size, ignorcolors);
            if (pixel) {
                if (lastPoint) {
                    executionLine.push({
                        pos1: recalc([lastPoint.x, lastPoint.y], size, offset),
                        pos2: recalc([x, y], size, offset),
                        color: lastPoint.color,
                        thickness: thickness
                    });
                }
                lastPoint = { x, y, color: pixel.color };
            }
        }
    }

    function drawWaveImage(size, modifier, thickness, offset, ignorcolors) {
        const amplitude = 50;
        const wavelength = 100;

        for (let x = 0; x < cw; x += size * modifier) {
            const waveY = ch / 2 + Math.sin(x / wavelength * Math.PI * 2) * amplitude;
            const y = Math.max(0, Math.min(ch - 1, Math.round(waveY)));
            const pixel = getPixelData(x, y, size, ignorcolors);
            if (pixel) {
                executionLine.push({
                    pos1: recalc([x, 0], size, offset),
                    pos2: recalc([x, y], size, offset),
                    color: pixel.color,
                    thickness: thickness
                });
            }
        }
    }

    function drawSpiralImage(size, modifier, thickness, offset, ignorcolors) {
        const centerX = cw / 2;
        const centerY = ch / 2;
        const maxRadius = Math.max(centerX, centerY);
        let radius = 0;
        let angle = 0;
        const angleStep = 0.1;
        const radiusStep = 0.5;

        while (radius < maxRadius) {
            const x = Math.round(centerX + radius * Math.cos(angle));
            const y = Math.round(centerY + radius * Math.sin(angle));
            if (x >= 0 && x < cw && y >= 0 && y < ch) {
                const pixel = getPixelData(x, y, size, ignorcolors);
                if (pixel) {
                    executionLine.push({
                        pos1: recalc([x, y], size, offset),
                        pos2: recalc([x, y], size, offset),
                        color: pixel.color,
                        thickness: thickness
                    });
                }
            }
            radius += radiusStep;
            angle += angleStep;
        }
    }

    function drawNormalImage(size, modifier, thickness, offset, ignorcolors) {
        for (let y = 0; y < ch; y += size * modifier) {
            let start = [0, y];
            for (let x = 0; x < cw; x += size * modifier) {
                let end = [x, y];
                const pixel = getPixelData(x, y, size, ignorcolors);
                if (pixel) {
                    if (x < cw - 1) {
                        const nextPixel = getPixelData(x + size * modifier, y, size, ignorcolors);
                        if (!nextPixel || nextPixel.color !== pixel.color) {
                            executionLine.push({
                                pos1: recalc(start, size, offset),
                                pos2: recalc(end, size, offset),
                                color: pixel.color,
                                thickness: thickness,
                            });
                            start = [x, y];
                        }
                    } else {
                        executionLine.push({
                            pos1: recalc(start, size, offset),
                            pos2: recalc(end, size, offset),
                            color: pixel.color,
                            thickness: thickness,
                        });
                    }
                } else {
                    start = [x, y];
                }
            }
        }
    }

    function getPixelData(x, y, size, ignorcolors = []) {
        const index = (y * cw + x) * 4;
        const a = data[index + 3];
        if (a > 20) {
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const color = `rgb(${r},${g},${b})`;
            if (!ignorcolors.includes(color)) {
                return { x, y, color };
            }
        }
        return null;
    }

    async function execute(socket) {
        drawing_active = true;
        for (let i = 0; i < executionLine.length; i++) {
            if (!drawing_active) return;
            let currentLine = executionLine[i];
            let p1 = currentLine.pos1,
                p2 = currentLine.pos2,
                color = currentLine.color,
                thickness = currentLine.thickness;
            drawcmd(socket, p1, p2, color, thickness); // Fixed: changed colorE to color
            await delay(10);
        }
        function drawcmd(s, start, end, color, thickness) {
            s.send(`42["drawcmd",0,[${start[0]},${start[1]},${end[0]},${end[1]},false,${0 - thickness},"${color}",0,0,{}]]`);
        }
    }

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function recalc(value, size, offset) {
        return [(value[0] / (cw * size) + offset.x / 100).toFixed(4), (value[1] / (ch * size) + offset.y / 100).toFixed(4)];
    }

    // Player and Connection Classes
    class Player {
        constructor(name = undefined) {
            this.name = name;
            this.sid1 = null;
            this.uid = '';
            this.wt = '';
            this.conn = new Connection(this);
            this.room = new Room(this.conn);
            this.action = new Actions(this.conn);
        }
        anonymize(name) {
            this.name = name;
            this.uid = undefined;
            this.wt = undefined;
        }
    }

    class Connection {
        constructor(player) {
            this.player = player;
            this.socket = null;
        }
        onopen() {
            this.Heartbeat(25000);
        }
        onclose() {}
        onerror() {}
        onmessage(event) {
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
            }
        }
        onbroadcast(payload) {
            payload = JSON.parse(payload);
            if (payload[0] === 'bc_uc_freedrawsession_changedroom') {
                this.player.room.players = payload[3];
                this.player.room.id = payload[4];
            }
            if (payload[0] === 'mc_roomplayerschange') {
                this.player.room.players = payload[3];
            }
        }
        onrequest() {}
        open(url) {
            this.socket = new WebSocket(url);
            this.socket.onopen = this.onopen.bind(this);
            this.socket.onclose = this.onclose.bind(this);
            this.socket.onerror = this.onerror.bind(this);
            this.socket.onmessage = this.onmessage.bind(this);
        }
        close(code, reason) {
            this.socket.close(code, reason);
        }
        Heartbeat(interval) {
            setTimeout(() => {
                if (this.socket.readyState === this.socket.OPEN) {
                    this.socket.send(2);
                    this.Heartbeat(interval);
                }
            }, interval);
        }
        serverconnect(server, room) {
            if (!this.socket || this.socket.readyState !== this.socket.OPEN) {
                this.open(server);
            } else {
                this.socket.send(41);
                this.socket.send(40);
            }
            this.onrequest = () => {
                this.socket.send(room);
            };
        }
    }

    class Room {
        constructor(conn) {
            this.conn = conn;
            this.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
            this.players = [];
        }
        join(invitelink) {
            let gamemode = 2;
            let server = '';
            if (invitelink === null) {
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
            let playerName = EL('#inputName').value;
            let connectstring = `420["startplay","${playerName}",${gamemode},"en",${nullify(this.id)},null,[null,"https://drawaria.online/",1000,1000,[${nullify(player.sid1)},${nullify(player.uid)},${nullify(player.wt)}],null]]`;

            this.conn.serverconnect(serverurl, connectstring);
        }
        next() {
            if (this.conn.socket.readyState !== this.conn.socket.OPEN) {
                this.join(null);
            } else {
                this.conn.socket.send('42["pgswtichroom"]');
            }
        }
    }

    class Actions {
        constructor(conn) {
            this.conn = conn;
        }
        DrawLine(bx = 50, by = 50, ex = 50, ey = 50, thickness = 50, color = '#FFFFFF', algo = 0) {
            bx = bx / 100;
            by = by / 100;
            ex = ex / 100;
            ey = ey / 100;
            this.conn.socket.send(`42["drawcmd",0,[${bx},${by},${ex},${ey},true,${0 - thickness},"${color}",0,0,{"2":${algo},"3":0.5,"4":0.5}]]`);
            this.conn.socket.send(`42["drawcmd",0,[${bx},${by},${ex},${ey},false,${0 - thickness},"${color}",0,0,{"2":${algo},"3":0.5,"4":0.5}]]`);
        }
    }

    function nullify(value = null) {
        return value === null ? null : `"${value}"`;
    }

    // Initialize
    if (!EL('#cheat-menu')) {
        window['___BOT'] = new Player('ZigzagBot');
        window['___ENGINE'] = { loadImage, drawImage };
        addBoxIcons();
        createFloatingMenu();
        setupImageLoader();
        setupBotControls();
        setupDrawingControls();
    }
})();