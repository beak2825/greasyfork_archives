// ==UserScript==
// @name         Drawaria Canvas Text Writer Safe Version
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Write text on the Drawaria canvas using WebSockets
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524458/Drawaria%20Canvas%20Text%20Writer%20Safe%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/524458/Drawaria%20Canvas%20Text%20Writer%20Safe%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Adding Text Input and Button
    function addTextInput() {
        let container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '692.984px'; // Ajusta la posición vertical
        container.style.left = '165.629px'; // Ajusta la posición horizontal
        container.style.transform = 'translateX(-50%)';
        container.style.zIndex = 1000;
        container.style.background = 'linear-gradient(135deg, #003366, #0099cc)';
        container.style.padding = '20px';
        container.style.borderRadius = '10px';
        container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.cursor = 'move';

        let title = document.createElement('h3');
        title.textContent = 'Canvas Text Writer';
        title.style.margin = '0';
        title.style.paddingBottom = '10px';
        title.style.borderBottom = '1px solid #555';
        title.style.width = '100%';
        title.style.textAlign = 'center';
        title.style.color = 'white';
        container.appendChild(title);

        let toggleButton = document.createElement('div');
        toggleButton.innerHTML = '&#9650;'; // Up arrow (cerrado por defecto)
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.fontSize = '20px';
        toggleButton.style.color = 'white';
        toggleButton.style.marginBottom = '10px';
        toggleButton.addEventListener('click', () => {
            let content = container.querySelector('.content');
            if (content.style.display === 'none') {
                content.style.display = 'flex';
                toggleButton.innerHTML = '&#9660;'; // Down arrow
            } else {
                content.style.display = 'none';
                toggleButton.innerHTML = '&#9650;'; // Up arrow
            }
        });
        container.appendChild(toggleButton);

        let innerContainer = document.createElement('div');
        innerContainer.className = 'content';
        innerContainer.style.background = 'rgba(255, 255, 255, 0.2)';
        innerContainer.style.padding = '20px';
        innerContainer.style.borderRadius = '10px';
        innerContainer.style.width = '100%';
        innerContainer.style.display = 'none'; // Cerrado por defecto
        innerContainer.style.flexDirection = 'column';
        innerContainer.style.alignItems = 'center';

        let wordList = document.createElement('div');
        wordList.style.maxHeight = '150px';
        wordList.style.overflowY = 'auto';
        wordList.style.margin = '10px 0';
        wordList.style.width = 'calc(100% - 20px)';
        wordList.style.border = '1px solid #ccc';
        wordList.style.borderRadius = '5px';
        wordList.style.padding = '10px';
        wordList.style.background = 'white';

        let words = ['Hello', 'World', 'Draw', 'Canvas', 'Text', 'Write', 'Send', 'Clear', 'Join', 'Room'];
        let selectedWord = null;

        words.forEach(word => {
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = word;
            checkbox.style.marginRight = '10px';
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    selectedWord = word;
                    wordList.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                        if (cb !== checkbox) {
                            cb.checked = false;
                        }
                    });
                } else {
                    selectedWord = null;
                }
            });

            let label = document.createElement('label');
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(word));
            label.style.display = 'block';
            label.style.marginBottom = '5px';

            wordList.appendChild(label);
        });

        let fontSelect = document.createElement('select');
        fontSelect.style.margin = '10px 0';
        fontSelect.style.padding = '10px';
        fontSelect.style.borderRadius = '5px';
        fontSelect.style.border = '1px solid #ccc';
        fontSelect.style.width = 'calc(100% - 20px)';
        fontSelect.innerHTML = `
            <option value="Arial">Arial</option>
            <option value="Ravie">Ravie</option>
            <option value="Courier">Courier</option>
            <option value="Magneto">Magneto</option>
            <option value="Papyrus">Papyrus</option>
            <option value="Script MT Bold">Script MT Bold</option>
            <option value="Algerian">Algerian</option>
            <option value="Segoe Print">Segoe Print</option>
        `;

        let pixelSizeLabel = document.createElement('div');
        pixelSizeLabel.textContent = 'Pixel Size: 30';
        pixelSizeLabel.style.margin = '10px 0';
        pixelSizeLabel.style.color = 'white';

        let pixelSizeSlider = document.createElement('input');
        pixelSizeSlider.type = 'range';
        pixelSizeSlider.min = '10';
        pixelSizeSlider.max = '30';
        pixelSizeSlider.value = '30';
        pixelSizeSlider.style.margin = '10px 0';
        pixelSizeSlider.style.width = 'calc(100% - 20px)';
        pixelSizeSlider.addEventListener('input', (event) => {
            pixelSizeLabel.textContent = `Pixel Size: ${event.target.value}`;
        });

        let xPositionLabel = document.createElement('div');
        xPositionLabel.textContent = 'Horizontal Position: 0';
        xPositionLabel.style.margin = '10px 0';
        xPositionLabel.style.color = 'white';

        let xPositionSlider = document.createElement('input');
        xPositionSlider.type = 'range';
        xPositionSlider.min = '0';
        xPositionSlider.max = '100';
        xPositionSlider.value = '0';
        xPositionSlider.style.margin = '10px 0';
        xPositionSlider.style.width = 'calc(100% - 20px)';
        xPositionSlider.addEventListener('input', (event) => {
            xPositionLabel.textContent = `Horizontal Position: ${event.target.value}`;
        });

        let yPositionLabel = document.createElement('div');
        yPositionLabel.textContent = 'Vertical Position: 0';
        yPositionLabel.style.margin = '10px 0';
        yPositionLabel.style.color = 'white';

        let yPositionSlider = document.createElement('input');
        yPositionSlider.type = 'range';
        yPositionSlider.min = '0';
        yPositionSlider.max = '100';
        yPositionSlider.value = '0';
        yPositionSlider.style.margin = '10px 0';
        yPositionSlider.style.width = 'calc(100% - 20px)';
        yPositionSlider.addEventListener('input', (event) => {
            yPositionLabel.textContent = `Vertical Position: ${event.target.value}`;
        });

        let sendButton = document.createElement('button');
        sendButton.textContent = 'Send Text';
        sendButton.style.padding = '10px';
        sendButton.style.borderRadius = '5px';
        sendButton.style.border = 'none';
        sendButton.style.background = 'linear-gradient(to bottom, white, #d3d3d3)';
        sendButton.style.color = '#003366';
        sendButton.style.cursor = 'pointer';
        sendButton.style.width = 'calc(100% - 20px)';
        sendButton.style.marginBottom = '10px';
        sendButton.addEventListener('click', () => {
            if (selectedWord) {
                drawTextOnCanvas(selectedWord, fontSelect.value, parseInt(pixelSizeSlider.value), parseInt(xPositionSlider.value), parseInt(yPositionSlider.value));
            }
        });

        let clearCanvasButton = document.createElement('button');
        clearCanvasButton.textContent = 'Clear Canvas';
        clearCanvasButton.style.padding = '10px';
        clearCanvasButton.style.borderRadius = '5px';
        clearCanvasButton.style.border = 'none';
        clearCanvasButton.style.background = 'linear-gradient(to bottom, white, #d3d3d3)';
        clearCanvasButton.style.color = '#003366';
        clearCanvasButton.style.cursor = 'pointer';
        clearCanvasButton.style.width = 'calc(100% - 20px)';
        clearCanvasButton.style.marginBottom = '10px';
        clearCanvasButton.addEventListener('click', () => {
            let data = ["drawcmd", 0, [0.5, 0.5, 0.5, 0.5, !0, -2000, "#FFFFFF", -1, !1]];
            window.sockets.forEach(socket => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(`42${JSON.stringify(data)}`);
                }
            });
        });

        let joinButton = document.createElement('button');
        joinButton.textContent = 'Join';
        joinButton.style.padding = '10px';
        joinButton.style.borderRadius = '5px';
        joinButton.style.border = 'none';
        joinButton.style.background = 'linear-gradient(to bottom, white, #d3d3d3)';
        joinButton.style.color = '#003366';
        joinButton.style.cursor = 'pointer';
        joinButton.style.width = 'calc(100% - 20px)';
        joinButton.style.marginBottom = '10px';
        joinButton.addEventListener('mousedown', (e) => {
            window['___BOT'].room.join(EL('#invurl').value);
        });

        let colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = '#000000';
        colorInput.style.margin = '10px 0';

        innerContainer.appendChild(wordList);
        innerContainer.appendChild(fontSelect);
        innerContainer.appendChild(pixelSizeLabel);
        innerContainer.appendChild(pixelSizeSlider);
        innerContainer.appendChild(xPositionLabel);
        innerContainer.appendChild(xPositionSlider);
        innerContainer.appendChild(yPositionLabel);
        innerContainer.appendChild(yPositionSlider);
        innerContainer.appendChild(sendButton);
        innerContainer.appendChild(clearCanvasButton);
        innerContainer.appendChild(joinButton);
        innerContainer.appendChild(colorInput);

        container.appendChild(innerContainer);
        document.body.appendChild(container);

        // Make the container draggable
        let isDragging = false;
        let offsetX, offsetY;

        container.addEventListener('mousedown', (e) => {
            if (e.target === container || e.target === title) {
                isDragging = true;
                offsetX = e.clientX - container.getBoundingClientRect().left;
                offsetY = e.clientY - container.getBoundingClientRect().top;
                container.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                container.style.left = `${e.clientX - offsetX}px`;
                container.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            container.style.cursor = 'move';
        });
    }

    // Drawing Text on Canvas
    function drawTextOnCanvas(text, font, pixelSize, xPosition, yPosition) {
        let x = xPosition / 100; // Convert to percentage
        let y = yPosition / 100; // Convert to percentage
        let thickness = 5;
        let color = document.querySelector('input[type="color"]').value; // Get color from input

        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = 500;
        canvas.height = 100;

        ctx.font = `${pixelSize}px ${font}`;
        ctx.fillStyle = color;
        ctx.fillText(text, 10, 50);

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let commands = [];

        for (let i = 0; i < imageData.length; i += 4) {
            if (imageData[i + 3] > 0) { // Alpha channel is not zero
                let px = (i / 4) % canvas.width;
                let py = Math.floor((i / 4) / canvas.width);
                let nx = x + (px / canvas.width);
                let ny = y + (py / canvas.height);
                commands.push([nx, ny, nx, ny, false, -thickness, color, 0, 0, {}]);
            }
        }

        // Send commands in batches to avoid overloading the WebSocket
        const batchSize = 50;
        for (let i = 0; i < commands.length; i += batchSize) {
            let batch = commands.slice(i, i + batchSize);
            batch.forEach(cmd => {
                sendDrawCommand(cmd[0], cmd[1], cmd[2], cmd[3], thickness, color);
            });
            // Add a small delay to avoid overloading the WebSocket
            setTimeout(() => {}, 10);
        }
    }

    // Sending Draw Command via WebSocket
    function sendDrawCommand(x1, y1, x2, y2, thickness, color) {
        let message = `42["drawcmd",0,[${x1},${y1},${x2},${y2},false,${0 - thickness},"${color}",0,0,{}]]`;
        window.sockets.forEach(socket => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(message);
            }
        });
    }

    // Overriding WebSocket send method to capture sockets
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (window.sockets.indexOf(this) === -1) {
            window.sockets.push(this);
        }
        return originalSend.call(this, ...args);
    };

    // Initializing
    window.sockets = [];
    addTextInput();

    // Adding the bot functionality
    const EL = (sel) => document.querySelector(sel);

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

    Connection.prototype.onopen = function (event) {
        this.Heartbeat(25000);
    };

    Connection.prototype.onclose = function (event) {
    };

    Connection.prototype.onerror = function (event) {
    };

    Connection.prototype.onmessage = function (event) {
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
    };

    Connection.prototype.onbroadcast = function (payload) {
        payload = JSON.parse(payload);
        if (payload[0] == 'bc_uc_freedrawsession_changedroom') {
            this.player.room.players = payload[3];
            this.player.room.id = payload[4];
        }
        if (payload[0] == 'mc_roomplayerschange') {
            this.player.room.players = payload[3];
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
        let connectstring = `420["startplay","${player.name}",${gamemode},"en",${nullify(this.id)},null,[null,"https://drawaria.online/",1000,1000,[${nullify(player.sid1)},${nullify(player.uid)},${nullify(player.wt)}],null]]`;
        this.conn.serverconnect(serverurl, connectstring);
    };

    Room.prototype.next = function () {
        if (this.conn.socket.readyState != this.conn.socket.OPEN) {
            this.join(null);
        } else {
            this.conn.socket.send('42["pgswtichroom"]');
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
        this.conn.socket.send(`42["drawcmd",0,[${bx},${by},${ex},${ey},true,${0 - thickness},"${color}",0,0,{"2":${algo},"3":0.5,"4":0.5}]]`);
        this.conn.socket.send(`42["drawcmd",0,[${bx},${by},${ex},${ey},false,${0 - thickness},"${color}",0,0,{"2":${algo},"3":0.5,"4":0.5}]]`);
    };

    var nullify = (value = null) => {
        return value == null ? null : String().concat('"', value, '"');
    };

    if (!document.getElementById('Engine-Cheatcontainer')) {
        window['___BOT'] = new Player('Text Writer');
    }
})();
