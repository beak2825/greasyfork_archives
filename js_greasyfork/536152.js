// ==UserScript==
// @name         Drawaria Epic Autodraw bot V2
// @namespace    http://tampermonkey.net/
// @version      2025-05-11
// @description  Autodraw bot with dots.
// @author       YouTubeDrawaria
// @license      MIT
// @include      https://drawaria.online*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536152/Drawaria%20Epic%20Autodraw%20bot%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/536152/Drawaria%20Epic%20Autodraw%20bot%20V2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const EL = (sel) => document.querySelector(sel);
    const ELL = (sel) => document.querySelectorAll(sel);

    // Drawing Tools
    let drawing_active = false;
    let previewCanvas = document.createElement('canvas');
    let originalCanvas = document.getElementById('canvas');
    var data;

    let cw = previewCanvas.width;
    let ch = previewCanvas.height;

    let executionLine = [];
    let rainMode = true; // Режим "дождика" включен по умолчанию
    let rainColumns = []; // Массив для хранения колонок

    // Room & Socket Control
    window.myRoom = {};
    window.sockets = [];

    const originalSend = WebSocket.prototype.send;
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
                        // this.send(40)
                    } else if (message.startsWith('430')) {
                        let configs = JSON.parse(message.slice(3))[0];
                        window.myRoom.players = configs.players;
                        window.myRoom.id = configs.roomid;

                        // Автоматически начинаем рисование при подключении
                        if (rainMode) {
                            setTimeout(() => {
                                let size = document.getElementById('engine_imagesize').value;
                                let modifier = document.getElementById('engine_pixelsize').value;
                                let thickness = document.getElementById('engine_brushsize').value;
                                let offset = {
                                    x: document.getElementById('engine_offset_x').value,
                                    y: document.getElementById('engine_offset_y').value,
                                };
                                drawImage(size, modifier, thickness, offset);
                                execute(window['___BOT'].conn.socket);
                            }, 3000);
                        }
                    }
                });
            }
        }
        return originalSend.call(this, ...args);
    };

    // Добавляем стили и интерфейс
    function addBoxIcons() {
        let boxicons = document.createElement('link');
        boxicons.href = 'https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css';
        boxicons.rel = 'stylesheet';
        document.head.appendChild(boxicons);
    }

    function CreateStylesheet() {
        let container = document.createElement('style');
        container.innerHTML =
            'input[type="number"] { text-align: center; -webkit-appearance: none; -moz-appearance: textfield; } ' +
            '.hidden { display: none; } ' +
            '.cheat-row { display:flex; width:100%; } ' +
            '.cheat-row > * { width:100%; } ' +
            '.cheat-border { width: 100%; text-align: center; line-height: inherit; margin: 1px; border: 1px solid coral; } ' +
            '.rain-toggle { background-color: #4CAF50; color: white; }';
        document.head.appendChild(container);
    }

    function Engine() {
        let CheatContainer = document.createElement('div');
        CheatContainer.id = 'Engine-Cheatcontainer';
        CheatContainer.classList.toggle('hidden');
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
                togglebtn.classList.toggle('active');
                Cheatcontainer.classList.toggle('hidden', !togglebtn.classList.contains('active'));
            });
            btncontainer.appendChild(togglebtn);
            target.after(btncontainer);
        }
        CreateToggleButton(CheatContainer);

        function ImageLoader(CheatContainer) {
            let container = document.createElement('div');
            let row = document.createElement('div');
            row.className = 'cheat-row';

            let IPutImage = document.createElement('input');
            IPutImage.type = 'file';
            IPutImage.id = 'IPutImage';
            IPutImage.className = 'cheat-border';

            function readImage() {
                if (!this.files || !this.files[0]) return;

                const FR = new FileReader();
                FR.addEventListener('load', (evt) => {
                    loadImage(evt.target.result);
                });
                FR.readAsDataURL(this.files[0]);
            }

            IPutImage.addEventListener('change', readImage);
            row.appendChild(IPutImage);
            container.appendChild(row);
            CheatContainer.appendChild(container);
        }
        ImageLoader(CheatContainer);

        function BotControl(CheatContainer) {
            let container = document.createElement('div');
            container.innerHTML =
                "<div><input type='text' id='inputName' style='width:100%' placeholder='Name of Bot'></div><div class='cheat-row'><i class='bx bx-user-plus cheat-border' id='botJoin'><span>Join</span></i><i class='bx bx-user-minus cheat-border' id='botLeave'><span>Leave</span></i><i class='bx bxs-eraser cheat-border' id='canvasClear'><span>Clear</span></i></div>";

            CheatContainer.appendChild(container);
            document.getElementById('botJoin').addEventListener('mousedown', (e) => {
                window['___BOT'].room.join(EL('#invurl').value);
            });
            document.getElementById('botLeave').addEventListener('mousedown', (e) => {
                window['___BOT'].conn.socket.close();
            });
            document.getElementById('canvasClear').addEventListener('mousedown', (e) => {
                window['___BOT'].action.DrawLine(50, 50, 50, 50, 2000);
            });
        }
        BotControl(CheatContainer);

        function DrawingControls(CheatContainer) {
            let container = document.createElement('div');
            container.innerHTML = [
                '<div class="cheat-row"><input type="number" id="engine_imagesize" min="0" max="10" value="1" title="Image Size. 1 = big. 10 = small"><input type="number" id="engine_brushsize" min="2" max="30" value="32" title="Your Brush Size"><input type="number" id="engine_pixelsize" min="2" max="30" value="25" title="Distance between Pixels\nBest use half of brushsize"><input type="number" id="engine_offset_x" min="0" max="100" value="0" title="Distance left"><input type="number" id="engine_offset_y" min="0" max="100" value="0" title="Distance top"></div>',
                '<div class="cheat-row"><i class="bx bx-play-circle cheat-border" id="botStartDrawing"><span>Start</span></i><i class="bx bx-stop-circle cheat-border" id="botStopDrawing"><span>Stop</span></i><i class="bx bx-cloud-rain cheat-border rain-toggle" id="toggleRainMode"><span>Rain Mode</span></i></div>',
            ].join('');
            CheatContainer.appendChild(container);

            document.getElementById('botStopDrawing').addEventListener('mousedown', (e) => {
                drawing_active = false;
            });

            document.getElementById('botStartDrawing').addEventListener('mousedown', (e) => {
                let size = document.getElementById('engine_imagesize').value;
                let modifier = document.getElementById('engine_pixelsize').value;
                let thickness = document.getElementById('engine_brushsize').value;
                let offset = {
                    x: document.getElementById('engine_offset_x').value,
                    y: document.getElementById('engine_offset_y').value,
                };
                drawImage(size, modifier, thickness, offset);
                execute(window['___BOT'].conn.socket);
            });

            document.getElementById('toggleRainMode').addEventListener('mousedown', (e) => {
                rainMode = !rainMode;
                e.target.classList.toggle('rain-toggle', rainMode);
            });
        }
        DrawingControls(CheatContainer);
    }

    function loadImage(url) {
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
        });
        img.crossOrigin = 'anonymous';
        img.src = url;
    }

    function drawImage(size, modifier = 1, thickness = 5, offset = { x: 0, y: 0 }, ignorcolors = []) {
        executionLine = [];
        rainColumns = [];

        // Сначала собираем все колонки
        for (let x = 0; x < cw; x += size * modifier) {
            let columnPixels = [];

            // Собираем все пиксели в текущем столбце
            for (let y = 0; y < ch; y += size * modifier) {
                let index = (y * cw + x) * 4;
                let a = data[index + 3];

                if (a > 20) {
                    let r = data[index + 0],
                        g = data[index + 1],
                        b = data[index + 2];
                    let color = `rgb(${r},${g},${b})`;

                    if (!ignorcolors.includes(color)) {
                        columnPixels.push({
                            x: x,
                            y: y,
                            color: color
                        });
                    }
                }
            }

            // Если в колонке есть пиксели, добавляем ее в массив
            if (columnPixels.length > 0) {
                rainColumns.push({
                    x: x,
                    pixels: columnPixels
                });
            }
        }

        // Теперь создаем executionLine в случайном порядке
        if (rainMode) {
            // Перемешиваем колонки для случайного порядка
            shuffleArray(rainColumns);

            // Обрабатываем каждую колонку
            for (let col of rainColumns) {
                let pixels = col.pixels;
                let start = pixels[0];
                let prev = start;

                // Соединяем последовательные пиксели в линии
                for (let i = 1; i < pixels.length; i++) {
                    let current = pixels[i];

                    // Если следующий пиксель не на 1 шаг ниже предыдущего или цвет другой
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

                // Добавляем последнюю линию в колонке
                executionLine.push({
                    pos1: recalc([start.x, start.y], size, offset),
                    pos2: recalc([prev.x, prev.y], size, offset),
                    color: start.color,
                    thickness: thickness
                });
            }
        } else {
            // Оригинальный режим рисования (горизонтальные линии)
            for (let y = 0; y < ch; y += size * modifier) {
                let start = [0, y];

                for (let x = 0; x < ch; x += size * modifier) {
                    let end = [x, y];
                    let index = (y * cw + x) * 4;

                    let a = data[index + 3];

                    if (a > 20) {
                        end = [x, y];
                        let r = data[index + 0],
                            g = data[index + 1],
                            b = data[index + 2];

                        let color = `rgb(${r},${g},${b})`;

                        if (!ignorcolors.includes(color)) {
                            if (x < cw - 1) {
                                let n_r = data[index + size * modifier * 4 + 4],
                                    n_g = data[index + size * modifier * 4 + 5],
                                    n_b = data[index + size * modifier * 4 + 6];

                                let samecolor = true;
                                if ((r != n_r && g != n_g && b != n_b) || data[index + 7] < 20) {
                                    samecolor = false;
                                }
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

    // Функция для перемешивания массива (алгоритм Фишера-Йетса)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    async function execute(socket) {
        drawing_active = true;

        // Если включен режим дождика, дополнительно перемешиваем линии для более случайного эффекта
        if (rainMode) {
            shuffleArray(executionLine);
        }

        for (let i = 0; i < executionLine.length; i++) {
            if (!drawing_active) return;
            let currentLine = executionLine[i];
            let p1 = currentLine.pos1,
                p2 = currentLine.pos2,
                color = currentLine.color,
                thickness = currentLine.thickness;
            drawcmd(socket, p1, p2, color, thickness);
            await delay(10); // Задержка между линиями
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

    // Остальной код (Player, Connection, Room, Actions) остается без изменений
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
        let playerName = document.getElementById('inputName').value;
        let connectstring = `420["startplay","${playerName}",${gamemode},"en",${nullify(this.id)},null,[null,"https://drawaria.online/",1000,1000,[${nullify(player.sid1)},${nullify(player.uid)},${nullify(player.wt)}],null]]`;

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
        window['___BOT'] = new Player('rectile');
        window['___ENGINE'] = { loadImage, drawImage };
        addBoxIcons();
        CreateStylesheet();
        Engine();
    }
})();
