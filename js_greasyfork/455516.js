// ==UserScript==
// @name         APM
// @version      1.2.1
// @author       ABC & Ray Adams
// @namespace    https://github.com/ABCxFF
// @description  Standard for hooking into the client -> server connection in arras.io
// @match        *://arras.io/*
// @match        *://arras.netlify.app/*
// @homepageURL  https://github.com/Ray-Adams/Arras-Archive
// @grant        none
// @run-at       document-start
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/455516/APM.user.js
// @updateURL https://update.greasyfork.org/scripts/455516/APM.meta.js
// ==/UserScript==

console.info("The userscript library 'APM' is no longer maintained, see https://github.com/Ray-Adams/Arras-Archive for more info.")

/****************************************************
 * 
 * Copyright (C) 2021  ABC & Ray Adams
 * Licensed under GNU General Public License v3.0
 * 
 ***************************************************/

const arras = (() => {

	// API

	const gamemodeTable = [
		[{
			id: 'x',
			u: 'Private'
		}],
		[{
			id: 'e',
			Hb: 'word'
		}],
		[{
			id: 'w',
			Hb: 'words'
		}],
		[{
			id: 'p',
			u: 'Portal'
		}],
		[{
			id: 'o',
			u: 'Open'
		}],
		[{
			id: 'm',
			u: 'Maze',
			delay: !0,
			remove: 'f'
		}],
		[{
			id: 'f',
			u: 'FFA'
		},
		{
			id: 'd',
			u: 'Duos'
		},
		{
			id: 's',
			u: 'Squads'
		},
		{
			id: '1',
			u: '1 Team',
			advance: !0
		},
		{
			id: '2',
			u: '2 Team',
			advance: !0,
			end: '2TDM'
		},
		{
			id: '3',
			u: '3 Team',
			advance: !0,
			end: '3TDM'
		},
		{
			id: '4',
			u: '4 Team',
			advance: !0,
			end: '4TDM'
		}
		],
		[{
			id: 'd',
			u: 'Domination'
		},
		{
			id: 'm',
			u: 'Mothership',
			remove: '2'
		},
		{
			id: 'a',
			u: 'Assault',
			remove: ['2', 'm']
		},
		{
			id: 's',
			u: 'Siege',
			remove: '1'
		},
		{
			id: 't',
			u: 'Tag',
			remove: ['o', '4']
		},
		{
			id: 'p',
			u: 'Pandemic',
			remove: ['o', '2']
		},
		{
			id: 'z',
			u: 'Sandbox'
		}
		]
	];

	const regionTable = {
		xyz: ['Local', 'Localhost', null],
		unk: ['Unknown', 'Unknown', null],
		svx: ['US West', 'Silicon Valley, CA, US', -7],
		lax: ['US West', 'Los Angeles, CA, US', -7],
		dal: ['USA', 'Dallas, TX, US', -5],
		kci: ['USA', 'Kansas City, MO, US', -5],
		vin: ['US East', 'Vint Hill, VA, US', -4],
		mtl: ['US East', 'Montreal, CA', -4],
		lon: ['Europe', 'London, UK', 1],
		fra: ['Europe', 'Frankfurt, DE', 2],
		sgp: ['Asia', 'Singapore', 8]
	};

	const hostTable = {
		z: ['Private', null],
		x: ['Local', null],
		glitch: ['Glitch', 10],
		vultr: ['Vultr', 30],
		buyvm: ['BuyVM', 15],
		extravm: ['ExtraVM', 40],
		ovh: ['OVH', 45],
		wsi: ['WSI', 50]
	};

	class Server {
		static parseGamemode(code) {
			if ('%' === code) return 'Unknown';
			let tags = [];
			let filter = [];
			let at = 0;

			for (const games of gamemodeTable) {
				for (const game of games) {
					if (game.id === code.charAt(at)) {
						if (Array.isArray(game.remove)) {
							filter.push.apply(filter, game.remove);
						} else if (game.remove) {
							filter.push(game.remove);
						}
						tags.push(Object.assign({}, game));
						at++;
						break;
					}
				}
			}
			if (tags.length == 0) return 'Unknown';

			return tags.map((n, i, l) => l[Math.min(i + Math.pow(-1, i), l.length - 1)]).filter(({ id }) => !filter.includes(id)).map(data => data.u).join(' ');
		}
		static parseRegion(code) {
			return regionTable[code][0];
		}
		static parseHost(code) {
			return hostTable[code][0];
		}
		static parseCode(code) {
			const [host, region, gamemode] = code.split('-');

			return [Server.parseHost(host), Server.parseRegion(region), Server.parseGamemode(gamemode)].join(' - ');
		}
	}

	// PROTOCOL

	const u32 = new Uint32Array(1);
	const u16 = new Uint16Array(1);
	const c16 = new Uint8Array(u16.buffer);
	const c32 = new Uint8Array(u32.buffer);
	const f32 = new Float32Array(u32.buffer);

	Array.prototype.remove = function (index) {
		if (index === this.length - 1) return this.pop();
		this[index] = this.pop();
	};

	function encode(message) {
		let headers = [];
		let headerCodes = [];
		let contentSize = 0;
		let lastTypeCode = 0b1111;
		let repeatTypeCount = 0;
		for (let block of message) {
			let typeCode = 0;
			if (block === 0 || block === false) {
				typeCode = 0b0000;
			} else if (block === 1 || block === true) {
				typeCode = 0b0001;
			} else if (typeof block === 'number') {
				if (!Number.isInteger(block) || block < -0x100000000 || block >= 0x100000000) {
					typeCode = 0b1000;
					contentSize += 4;
				} else if (block >= 0) {
					if (block < 0x100) {
						typeCode = 0b0010;
						contentSize++;
					} else if (block < 0x10000) {
						typeCode = 0b0100;
						contentSize += 2;
					} else if (block < 0x100000000) {
						typeCode = 0b0110;
						contentSize += 4;
					}
				} else {
					if (block >= -0x100) {
						typeCode = 0b0011;
						contentSize++;
					} else if (block >= -0x10000) {
						typeCode = 0b0101;
						contentSize += 2;
					} else if (block >= -0x100000000) {
						typeCode = 0b0111;
						contentSize += 4;
					}
				}
			} else if (typeof block === 'string') {
				let hasUnicode = false;
				for (let i = 0; i < block.length; i++) {
					if (block.charAt(i) > '\xff') {
						hasUnicode = true;
					} else if (block.charAt(i) === '\x00') {
						console.error('Null containing string', block);
						throw new Error('Null containing string');
					}
				}
				if (!hasUnicode && block.length <= 1) {
					typeCode = 0b1001;
					contentSize++;
				} else if (hasUnicode) {
					typeCode = 0b1011;
					contentSize += block.length * 2 + 2;
				} else {
					typeCode = 0b1010;
					contentSize += block.length + 1;
				}
			} else {
				console.error('Unencodable data type', block);
				throw new Error('Unencodable data type');
			}
			headers.push(typeCode);
			if (typeCode === lastTypeCode) {
				repeatTypeCount++;
			} else {
				headerCodes.push(lastTypeCode);
				if (repeatTypeCount >= 1) {
					while (repeatTypeCount > 19) {
						headerCodes.push(0b1110);
						headerCodes.push(15);
						repeatTypeCount -= 19;
					}
					if (repeatTypeCount === 1)
						headerCodes.push(lastTypeCode);
					else if (repeatTypeCount === 2)
						headerCodes.push(0b1100);
					else if (repeatTypeCount === 3)
						headerCodes.push(0b1101);
					else if (repeatTypeCount < 20) {
						headerCodes.push(0b1110);
						headerCodes.push(repeatTypeCount - 4);
					}
				}
				repeatTypeCount = 0;
				lastTypeCode = typeCode;
			}
		}
		headerCodes.push(lastTypeCode);
		if (repeatTypeCount >= 1) {
			while (repeatTypeCount > 19) {
				headerCodes.push(0b1110);
				headerCodes.push(15);
				repeatTypeCount -= 19;
			}
			if (repeatTypeCount === 1)
				headerCodes.push(lastTypeCode);
			else if (repeatTypeCount === 2)
				headerCodes.push(0b1100);
			else if (repeatTypeCount === 3)
				headerCodes.push(0b1101);
			else if (repeatTypeCount < 20) {
				headerCodes.push(0b1110);
				headerCodes.push(repeatTypeCount - 4);
			}
		}
		headerCodes.push(0b1111);
		if (headerCodes.length % 2 === 1)
			headerCodes.push(0b1111);

		let output = new Uint8Array((headerCodes.length >> 1) + contentSize);
		for (let i = 0; i < headerCodes.length; i += 2) {
			let upper = headerCodes[i];
			let lower = headerCodes[i + 1];
			output[i >> 1] = (upper << 4) | lower;
		}
		let index = headerCodes.length >> 1;
		for (let i = 0; i < headers.length; i++) {
			let block = message[i];
			switch (headers[i]) {
			case 0b0000:
			case 0b0001:
				break;
			case 0b0010:
			case 0b0011:
				output[index++] = block;
				break;
			case 0b0100:
			case 0b0101:
				u16[0] = block;
				output.set(c16, index);
				index += 2;
				break;
			case 0b0110:
			case 0b0111:
				u32[0] = block;
				output.set(c32, index);
				index += 4;
				break;
			case 0b1000:
				f32[0] = block;
				output.set(c32, index);
				index += 4;
				break;
			case 0b1001:
				{
					let byte = block.length === 0 ? 0 : block.charCodeAt(0);
					output[index++] = byte;
				}
				break;
			case 0b1010:
				for (let i = 0; i < block.length; i++) {
					output[index++] = block.charCodeAt(i);
				}
				output[index++] = 0;
				break;
			case 0b1011:
				for (let i = 0; i < block.length; i++) {
					let charCode = block.charCodeAt(i);
					output[index++] = charCode & 0xff;
					output[index++] = charCode >> 8;
				}
				output[index++] = 0;
				output[index++] = 0;
				break;
			}
		}

		return output;
	}

	function decode(packet) {
		let data = new Uint8Array(packet);
		if (data[0] >> 4 !== 0b1111)
			return null;

		let headers = [];
		let lastTypeCode = 0b1111;
		let index = 0;
		let consumedHalf = true;
		while (true) {
			if (index >= data.length)
				return null;
			let typeCode = data[index];

			if (consumedHalf) {
				typeCode &= 0b1111;
				index++;
			} else {
				typeCode >>= 4;
			}
			consumedHalf = !consumedHalf;

			if ((typeCode & 0b1100) === 0b1100) {
				if (typeCode === 0b1111) {
					if (consumedHalf)
						index++;
					break;
				}

				let repeat = typeCode - 10; // 0b1100 - 2
				if (typeCode === 0b1110) {
					if (index >= data.length)
						return null;
					let repeatCode = data[index];

					if (consumedHalf) {
						repeatCode &= 0b1111;
						index++;
					} else {
						repeatCode >>= 4;
					}
					consumedHalf = !consumedHalf;

					repeat += repeatCode;
				}

				for (let i = 0; i < repeat; i++)
					headers.push(lastTypeCode);
			} else {
				headers.push(typeCode);
				lastTypeCode = typeCode;
			}
		}

		let output = [];
		for (let header of headers) {
			switch (header) {
			case 0b0000:
				output.push(0);
				break;
			case 0b0001:
				output.push(1);
				break;
			case 0b0010:
				output.push(data[index++]);
				break;
			case 0b0011:
				output.push(data[index++] - 0x100);
				break;
			case 0b0100:
				c16[0] = data[index++];
				c16[1] = data[index++];
				output.push(u16[0]);
				break;
			case 0b0101:
				c16[0] = data[index++];
				c16[1] = data[index++];
				output.push(u16[0] - 0x10000);
				break;
			case 0b0110:
				c32[0] = data[index++];
				c32[1] = data[index++];
				c32[2] = data[index++];
				c32[3] = data[index++];
				output.push(u32[0]);
				break;
			case 0b0111:
				c32[0] = data[index++];
				c32[1] = data[index++];
				c32[2] = data[index++];
				c32[3] = data[index++];
				output.push(u32[0] - 0x100000000);
				break;
			case 0b1000:
				c32[0] = data[index++];
				c32[1] = data[index++];
				c32[2] = data[index++];
				c32[3] = data[index++];
				output.push(f32[0]);
				break;
			case 0b1001:
				{
					let byte = data[index++];
					output.push(byte === 0 ? '' : String.fromCharCode(byte));
				}
				break;
			case 0b1010:
				{
					let string = '';
					let byte = 0;
					while (byte = data[index++]) {
						string += String.fromCharCode(byte);
					}
					output.push(string);
				}
				break;
			case 0b1011:
				{
					let string = '';
					let byte = 0;
					while (byte = data[index++] | (data[index++] << 8)) {
						string += String.fromCharCode(byte);
					}
					output.push(string);
				}
				break;
			}
		}

		return output;
	}

	function rotator(packet) {
		return {
			i: 0,
			arr: packet,
			get(index) {
				return packet[index];
			},
			set(index, value) {
				return (packet[index] = value);
			},
			nex() {
				if (this.i === this.arr.length) {
					console.error(new Error('End reached'), this.arr);
					return -1;
				}
				return packet[this.i++];
			}
		};
	}

	class BroadcastParser {
		constructor() {
			this.leaderboard = [];
			this.teamMinimap = [];
			this.globalMinimap = [];
		}

		parse(packet) {
			const rot = rotator(packet);

			if (rot.nex() !== 'b') throw new TypeError('Invalid packet header; expected packet `b`');

			this._array(rot, () => {
				const del = rot.nex();

				this.globalMinimap.remove(this.globalMinimap.findIndex(({ id }) => id === del));
			});

			this._array(rot, () => {
				const dot = {
					id: rot.nex(),
					type: rot.nex(),
					x: rot.nex(),
					y: rot.nex(),
					color: rot.nex(),
					size: rot.nex()
				};

				let index = this.globalMinimap.findIndex(({ id }) => id === dot.id);
				if (index === -1) index = this.globalMinimap.length;

				this.globalMinimap[index] = dot;
			});

			this._array(rot, () => {
				const del = rot.nex();

				this.teamMinimap.remove(this.teamMinimap.findIndex(({ id }) => id === del));
			});

			this._array(rot, () => {
				const dot = {
					id: rot.nex(),
					x: rot.nex(),
					y: rot.nex(),
					color: rot.nex()
				};

				let index = this.teamMinimap.findIndex(({ id }) => id === dot.id);
				if (index === -1) index = this.teamMinimap.length;

				this.teamMinimap[index] = dot;
			});

			this._array(rot, () => {
				const del = rot.nex();

				this.leaderboard.remove(this.leaderboard.findIndex(({ id }) => id === del));
			});

			this._array(rot, () => {
				const champ = {
					id: rot.nex(),
					score: rot.nex(),
					index: rot.nex(),
					name: rot.nex(),
					color: rot.nex(),
					barColor: rot.nex()
				};

				let index = this.leaderboard.findIndex(({ id }) => id === champ.id);
				if (index === -1) index = this.leaderboard.length;

				this.leaderboard[index] = champ;
			});

			this.leaderboard.sort((c1, c2) => c2.score - c1.score);

			return this;
		}

		_array(rot, read, length = rot.nex()) {
			const out = Array(Math.max(0, length));

			for (let i = 0; i < length; ++i) out[i] = read.call(this, i, rot);

			return out;
		}
	}

	class RecordParser {
		constructor() {
			this.score = null;
			this.seconds = null;
			this.killCount = {
				players: null,
				assists: null,
				bosses: null
			};
			this.killersLength = null;
			this.killers = [];
			this.baseCooldown = null;
		}
	
		parse(packet) {
			const rot = rotator(packet);
	
			if (rot.nex() !== 'F') throw new TypeError('Invalid packet header; expected packet `F`');
	
			this.score = rot.nex();
			this.seconds = rot.nex();
	
			this.killCount.players = rot.nex();
			this.killCount.assists = rot.nex();
			this.killCount.bosses = rot.nex();
	
			this.killersLength = rot.nex();
			for (let i = 0; i < this.killersLength; i++) {
				this.killers.push(rot.nex());
			}
	
			this.baseCooldown = rot.nex();
	
			return this;
		}
	}

	class UpdateParser {
		constructor(doEntities = true) {
			this.camera = { x: null, y: null, vx: null, vy: null, fov: null };
			this.now = 0;
			this.player = {
				fps: 1,
				body: {
					type: null,
					color: null,
					id: null,
				},
				score: null,
				points: null,
				upgrades: [],
				stats: [],
				skills: null,
				accel: null,
				top: null,
				party: null
			};
			this.entities = doEntities ? [] : false;
		}
		parse(packet) {
			const rot = rotator(packet);

			if (rot.nex() !== 'u') throw new TypeError('Invalid packet header; expected packet `u`');

			this.now = rot.nex();

			const version = this.now === 0 ? 2 : 1;

			this.camera.x = rot.nex();
			this.camera.y = rot.nex();
			this.camera.fov = rot.nex();
			this.camera.vx = rot.nex();
			this.camera.vy = rot.nex();

			const flags = rot.nex();
			if (flags & 0x0001) this.player.fps = rot.nex();
			if (flags & 0x0002) {
				this.player.body.type = rot.nex();
				this.player.body.color = rot.nex();
				this.player.body.id = rot.nex();
			}
			if (flags & 0x0004) this.player.score = rot.nex();
			if (flags & 0x0008) this.player.points = rot.nex();
			if (flags & 0x0010) this.player.upgrades = Array(Math.max(0, rot.nex())).fill(-1).map(() => rot.nex());
			if (flags & 0x0020) this.player.stats = Array(30).fill(0).map(() => rot.nex());
			if (flags & 0x0040) {
				const result = parseInt(rot.nex(), 36);

				this.player.skills = [
					(result / 0x1000000000 & 15),
					(result / 0x0100000000 & 15),
					(result / 0x0010000000 & 15),
					(result / 0x0001000000 & 15),
					(result / 0x0000100000 & 15),
					(result / 0x0000010000 & 15),
					(result / 0x0000001000 & 15),
					(result / 0x0000000100 & 15),
					(result / 0x0000000010 & 15),
					(result / 0x0000000001 & 15)
				];
			}
			if (flags & 0x0080) this.player.accel = rot.nex();
			if (flags & 0x0100) this.player.top = rot.nex();
			if (flags & 0x0200) this.player.party = rot.nex();
			if (flags & 0x0400) this.player.speed = rot.nex();

			if (version === 2 && this.entities !== false) {
				this._parseEnts(rot);
			} else if (version !== 2 && this.entities !== false) {
				this.entities = false;
				console.error('Invalid version, expected version 2. Disabling entities');
			}
			return this;
		}
		_table(rot, read) {
			const out = [];
			for (let id = rot.nex(); id !== -1; id = rot.nex()) {
				out[out.length] = read.call(this, id, rot);
			}
			return out;
		}
		_parseEnts(rot) {
			if (rot.nex() !== -1) return console.warn('uhhhh-cancelling', rot.arr);

			this._table(rot, (id) => {
				const index = this.entities.findIndex(ent => ent.id === id);
				if (index === -1) {
					return console.warn('Possible desync, deletion of non existent entity ' + id);
				}
				this.entities[index] = this.entities[this.entities.length - 1];
				--this.entities.length;
			});

			this._table(rot, (id) => {
				let index = this.entities.findIndex(ent => ent.id === id);
				if (index === -1) this.entities[index = this.entities.length] = { id };

				const ent = this.entities[index];
				this._parseEnt(ent, rot);
			});
		}

		_parseEnt(ent, rot) {
			const flags = rot.nex();
			if (!ent) console.log(this.entities.length, rot.get(rot.i - 1));
			if (flags & 0x0001) {
				let { x: lastX, y: lastY } = ent;
				ent.x = rot.nex() * 0.0625;
				ent.y = rot.nex() * 0.0625;
				if (typeof lastX !== 'undefined') {
					ent.vx = (ent.x - lastX);
					ent.vy = (ent.y - lastY);
				} else ent.vx = ent.vy = 0;
			}
			if (flags & 0x0002) ent.facing = rot.nex() * (360 / 256);
			if (flags & 0x0004) ent.flags = rot.nex();
			if (flags & 0x0008) ent.health = rot.nex() / 255;
			if (flags & 0x0010) ent.shield = Math.max(0, rot.nex() / 255);
			if (flags & 0x0020) ent.alpha = rot.nex() / 255;
			if (flags & 0x0040) ent.size = rot.nex() * 0.0625;
			if (flags & 0x0080) ent.score = rot.nex();
			if (flags & 0x0100) ent.name = rot.nex();
			if (flags & 0x0200) ent.mockupIndex = rot.nex();
			if (flags & 0x0400) ent.color = rot.nex();
			if (flags & 0x0800) ent.layer = rot.nex();
			if (flags & 0x1000) {
				if (!ent.guns) ent.guns = [];

				this._table(rot, (index) => {
					const flag = rot.nex();
					if (!ent.guns[index]) ent.guns[index] = {};
					if (flag & 1) ent.guns[index].time = rot.nex();
					if (flag & 2) ent.guns[index].power = Math.sqrt(rot.nex()) / 20;
				});
			}
			if (flags & 0x2000) {
				if (!ent.turrets) ent.turrets = [];

				ent.turrets = this._table(rot, (index) => {
					let i = ent.turrets.findIndex(ent => ent.index === index);
					if (i === -1) ent.turrets[i = ent.turrets.length] = { index };
					const turret = ent.turrets[i];

					return this._parseEnt(turret, rot);
				});
			}

			return ent;
		}
	}

	class MockupsParser {
		constructor() {
			this.entries = [];
		}
	
		parse(packet) {
			if (packet[0] !== 'J') throw new TypeError('Invalid packet header; expected packet `J`');
	
			this.entries.push(...packet.slice(1));
			return this;
		}
	
		get(index) {
			const idx = this.entries.indexOf(index) + 1;
	
			if (idx === 0) return console.error(`Index ${index} not present in mockups`, this.entries);
	
			return JSON.parse(this.entries[idx]);
		}
	}

	const coder = { encode, decode };

	// HOOKING

	const hijack = () => {
		if (window['%arras']) return window['%arras'];

		window['%arras'] = new Promise(r => {
			const _send = WebSocket.prototype.send;
			window.WebSocket = class ArrasSocket extends WebSocket {
				constructor(...args) {
					super(...args);
					this.isntArras = true;
					if (Array.isArray(args[1]) && !(args[2] && args[2] === 'apm-ignore')) {
						this.isntArras = false;
						this._hook();

						this.onopen = () => r(this);
						this.sendHooks = [];
						this.msgHooks = [];
					}
				}

				_hook() {
					if (this.isntArras) throw 'sus';

					let send = this.send;
					this.send = function (buf) {
						return send.call(this, coder.encode(this.sendHooks.reduce((data, hook) => hook(data) || data, coder.decode(buf))));
					};

					let adv = this.addEventListener;
					this.addEventListener = function (type, cb, pro = false) {
						if (pro) return adv.call(this, type, cb, pro);

						if (type === 'message') {
							adv.call(this, 'message', (event) => {
								this.msgCallback = cb;
								cb(new MessageEvent('message', {
									data: coder.encode(this.msgHooks.reduce((data, hook) => hook(data) || data, coder.decode(new Uint8Array(event.data)))).buffer
								}));
							});
						} else return adv.call(this, type, cb, pro);
					};
				}

				hookSend(...funcs) {
					this.sendHooks.push.apply(this.sendHooks, funcs);
					return this.sendHooks.length - 1;
				}
				hookMsg(...funcs) {
					this.msgHooks.push.apply(this.msgHooks, funcs);
					return this.msgHooks.length - 1;
				}

				directTalk(...data) {
					_send.call(this, coder.encode(data));
				}

				talk(...data) {
					this.send(coder.encode(data));
				}

				receive(...data) {
					this.msgCallback(new MessageEvent('message', { data: coder.encode(data) }));
				}
			};
		});

		return window['%arras'];
	};

	return { encode, decode, BroadcastParser, RecordParser, UpdateParser, MockupsParser, hijack, Server };
})();
