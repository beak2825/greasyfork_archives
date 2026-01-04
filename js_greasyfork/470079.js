// ==UserScript==

// @name         Drawaria Drawing Bot de |ᴜɴ ᴘᴀɴɪᴛᴀ ʀᴀɴᴅᴏᴍ|ᵖᵒʳⁿʰᵘᵇ

// @namespace    http://tampermonkey.net/

// @version      1.0.2

// @description  Drawing Bot

// @author       el pana

// @match        https://*.drawaria.online/

// @match        https://*.drawaria.online/room/*

// @icon         https://img.icons8.com/nolan/200/A3A1FF/3A3897/program.png

// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/470079/Drawaria%20Drawing%20Bot%20de%20%7C%E1%B4%9C%C9%B4%20%E1%B4%98%E1%B4%80%C9%B4%C9%AA%E1%B4%9B%E1%B4%80%20%CA%80%E1%B4%80%C9%B4%E1%B4%85%E1%B4%8F%E1%B4%8D%7C%E1%B5%96%E1%B5%92%CA%B3%E2%81%BF%CA%B0%E1%B5%98%E1%B5%87.user.js
// @updateURL https://update.greasyfork.org/scripts/470079/Drawaria%20Drawing%20Bot%20de%20%7C%E1%B4%9C%C9%B4%20%E1%B4%98%E1%B4%80%C9%B4%C9%AA%E1%B4%9B%E1%B4%80%20%CA%80%E1%B4%80%C9%B4%E1%B4%85%E1%B4%8F%E1%B4%8D%7C%E1%B5%96%E1%B5%92%CA%B3%E2%81%BF%CA%B0%E1%B5%98%E1%B5%87.meta.js
// ==/UserScript==


(() => {

	'use strict';

	const EL = (sel) => document.querySelector(sel);

	const ELL = (sel) => document.querySelectorAll(sel);


	// Adding Drawing Tools


	let drawing_active = false;

	let previewCanvas = document.createElement('canvas');

	let originalCanvas = document.getElementById('canvas');

	var data;


	let cw = previewCanvas.width;

	let ch = previewCanvas.height;


	let executionLine = [];


	// Room & Socket Controll


	window.myRoom = {};

	window.sockets = [];


	const originalSend = WebSocket.prototype.send;

	WebSocket.prototype.send = function (...args) {

		if (window.sockets.indexOf(this) === -1) {

			window.sockets.push(this);

			if (window.sockets.indexOf(this) === 0) {

				this.addEventListener('message', (event) => {

					// console.debug(event)

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


	// Add Stylesheet


	function CreateStylesheet() {

		let container = document.createElement('style');

		container.innerHTML =

			'input[type="number"] { text-align: center; -webkit-appearance: none; -moz-appearance: textfield; } ' +

			'.hidden { display: none; } ' +

			'.cheat-row { display:flex; width:100%; } ' +

			'.cheat-row > * { width:100%; } ' +

			'.cheat-border { width: 100%; text-align: center; line-height: inherit; margin: 1px; border: 1px solid coral; } ';

		document.head.appendChild(container);

	}


	// Add CheatActivator & CheatContainer


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


			let togglebtn;

			togglebtn = document.createElement('button');

			togglebtn.className = 'btn btn-outline-secondary';

			togglebtn.innerHTML = '<i class="bx bx-bot"></i>';

			togglebtn.addEventListener('click', (e) => {

				e.preventDefault();

				togglebtn.classList.toggle('active');

				togglebtn.classList.contains('active') ? Cheatcontainer.classList.remove('hidden') : Cheatcontainer.classList.add('hidden');

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

					// get base64 string of image and apply to image src

					let base64 = evt.target.result;

					// load the image

					loadImage(base64);

				});

				// read Image

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

				"<div class='cheat-row'><i class='bx bx-user-plus cheat-border' id='botJoin'><span>Join</span></i><i class='bx bx-user-minus cheat-border' id='botLeave'><span>Leave</span></i><i class='bx bxs-eraser cheat-border' id='canvasClear'><span>Clear</span></i></div>";


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

				'<div class="cheat-row"><input type="number" id="engine_imagesize" min="1" max="10" value="4" title="Image Size. 1 = big. 10 = small"><input type="number" id="engine_brushsize" min="2" max="20" value="4" title="Your Brush Size"><input type="number" id="engine_pixelsize" min="2" max="20" value="2" title="Distance between Pixels\nBest use half of brushsize"><input type="number" id="engine_offset_x" min="0" max="100" value="0" title="Distance left"><input type="number" id="engine_offset_y" min="0" max="100" value="0" title="Distance top"></div>',

				'<div class="cheat-row"><i class="bx bx-play-circle cheat-border" id="botStartDrawing"><span>Start</span></i><i class="bx bx-stop-circle cheat-border" id="botStopDrawing"><span>Stop</span></i></div>',

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

		}

		DrawingControls(CheatContainer);

	}


	function loadImage(url) {

		// load the image

		var img = new Image();

		img.addEventListener('load', () => {

			previewCanvas.width = originalCanvas.width;

			previewCanvas.height = originalCanvas.height;


			cw = previewCanvas.width;

			ch = previewCanvas.height;


			var ctx = previewCanvas.getContext('2d');


			// center and resize image


			let modifier = 1;

			if (img.width > previewCanvas.width) {

				modifier = previewCanvas.width / img.width;

			} else {

				modifier = previewCanvas.height / img.height;

			}


			// draw the image

			// (this time to grab the image's pixel data

			ctx.drawImage(img, 0, 0, img.width * modifier, img.height * modifier);


			// grab the image's pixel data

			var imgData = ctx.getImageData(0, 0, previewCanvas.width, previewCanvas.height);

			data = imgData.data;


			// clear the canvas to draw the glow

			ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

			console.debug('ready');

		});

		img.crossOrigin = 'anonymous';

		img.src = url;

	}


	function drawImage(size, modifier = 1, thickness = 5, offset = { x: 0, y: 0 }, ignorcolors = []) {

		executionLine = [];

		for (let y = 0; y < ch; y += size * modifier) {

			let start = [0, y];


			for (let x = 0; x < ch; x += size * modifier) {

				let end = [x, y];

				let index = (y * cw + x) * 4;


				let a = data[index + 3];


				if (a > 20) {

					end = [x, y];

					// Is not Transparent

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

							// check if the next pixel is same color as the last

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

					// Is Transparent

					start = [x, y];

				}

			}

		}

		console.debug('done Loading');

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

			drawcmd(socket, p1, p2, color, thickness);

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

		// console.debug(event)

		this.Heartbeat(25000);

	};

	Connection.prototype.onclose = function (event) {

		// console.debug(event)

	};

	Connection.prototype.onerror = function (event) {

		// console.debug(event)

	};

	Connection.prototype.onmessage = function (event) {

		// console.debug(event)

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

			// extract roomid

			this.id = invitelink.startsWith('http') ? invitelink.split('/').pop() : invitelink;

			// craft serverurl

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

		// craft response for joining of desired room

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

		/* algo = 101/201 */

		this.conn.socket.send(`42["drawcmd",0,[${bx},${by},${ex},${ey},true,${0 - thickness},"${color}",0,0,{"2":${algo},"3":0.5,"4":0.5}]]`);

		this.conn.socket.send(`42["drawcmd",0,[${bx},${by},${ex},${ey},false,${0 - thickness},"${color}",0,0,{"2":${algo},"3":0.5,"4":0.5}]]`);

	};


	var nullify = (value = null) => {

		return value == null ? null : String().concat('"', value, '"');

	};


	if (!document.getElementById('Engine-Cheatcontainer')) {

		window['___BOT'] = new Player(' Joaquin Lopéz ');

		window['___ENGINE'] = { loadImage, drawImage };

		addBoxIcons();

		CreateStylesheet();

		Engine();

	}

})();