// ==UserScript==
// @name        Public Crabby Script
// @namespace   LIGMABALLS
// @match       http://bloble.io/
// @grant       none
// @version     1.1
// @author      Crabby
// @description 10/13/2021, 6:09:45 PM
// @downloadURL https://update.greasyfork.org/scripts/433890/Public%20Crabby%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/433890/Public%20Crabby%20Script.meta.js
// ==/UserScript==

const keys = {};

let botsSpamming = false;
let botSpamMessage;

const sleep = ms => new Promise(res => setTimeout(res, ms));

const getToken = () => {
	return grecaptcha.execute("6Ldh8e0UAAAAAFOKBv25wQ87F3EKvBzyasSbqxCE");
}

// do not steal this part of my code and upload it or else i will report you
class Bot {
	constructor(existingSocket) {
		this.socket = existingSocket || io.connect(socket.io.uri, {
			query: `cid=${UTILS.getUniqueID()}&rmid=${lobbyRoomID}`
		});
		
		this.socket.bot = true;
		
		this.players = [];
		this.units = [];
		
		this.player = {};
		
		this.socket.on("setUser", (raw, newPlayerIsYou) => {
			if (!raw || !raw[0]) return;
			
			const index = this.getPlayerIndexById(raw[0]);
			const player = {};
			player.id = raw[0];
			player.name = raw[1];
			player.dead = false;
			player.color = raw[2];
			player.size = raw[3];
			player.startSize = raw[4];
			player.x = raw[5];
			player.y = raw[6];
			player.buildRange = raw[7];
			player.gridIndex = raw[8];
			player.spawnProt = raw[9];
			player.skin = raw[10];
			
			if (index !== null) {
				this.players[index] = player;
				if (newPlayerIsYou) {
					this.player = this.players[index];
				}
			} else {
				this.players.push(player);
				if (newPlayerIsYou) {
					this.player = this.players[this.players.length - 1];
				}
			} 
		});
		this.socket.on("delUser", id => {
			const index = this.getPlayerIndexById(id);
			this.players.splice(index, 1);
		});
		
		this.socket.on("au", raw => {
			if (raw) {
				this.units.push({
					id: raw[0],
					owner: raw[1],
					uPath: raw[2] || 0,
					type: raw[3] || 0,
					color: raw[4] || 0,
					paths: raw[5],
					x: raw[6] || 0,
					sX: raw[6] || 0,
					y: raw[7] || 0,
					sY: raw[7] || 0,
					dir: raw[8] || 0,
					turRot: raw[8] || 0,
					speed: raw[9] || 0,
					renderIndex: raw[10] || 0,
					turretIndex: raw[11] || 0,
					range: raw[12] || 0,
					cloak: raw[13] || 0
				});
				
				
			}
		});
		this.socket.on("spa", (a, d, c, b) => {
			a = this.getPlayerIndexById(a);
			
			if (this.units[a] == null) this.units[a] = {};
			
			this.units[a].x = d;
			this.units[a].y = c;
			this.units[a].sX = this.units[a].x || 0;
			this.units[a].sY = this.units[a].y || 0;
		});
		this.socket.on("du", id => {
			const index = this.getPlayerIndexById(id);
			this.units.splice(index, 1);
		});
	}
	
	async spawn(name, skin = 0) {
		this.socket.emit("spawn", { name, skin }, await getToken())
	} 
	
	chat(msg) {
		this.socket.emit("ch", msg);
	}
	
	getPlayerIndexById(id) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].id === id) {
				return i;
			}
		}
		
		return null;
	}
}

window.Bot = Bot;

window.bots = [];

function placeGenerators() {
	socket.emit("1", 4.73,    245,   3);
	socket.emit("1", 5.0025,  245,   3);
	socket.emit("1", 5.275,   245,   3);
	socket.emit("1", 5.5475,  245,   3);
	socket.emit("1", 5.82,    245,   3);
	socket.emit("1", 6.0925,  245,   3);
	socket.emit("1", 6.365,   245,   3);
	socket.emit("1", 6.6375,  245,   3);
	socket.emit("1", 6.91,    245,   3);
	socket.emit("1", 7.1825,  245,   3);
	socket.emit("1", 7.455,   245,   3);
	socket.emit("1", 7.7275,  245,   3);
	socket.emit("1", 8.0025,  245,   3);
	socket.emit("1", 8.275,   245,   3);
	socket.emit("1", 8.5475,  245,   3);
	socket.emit("1", 8.82,    245,   3);
	socket.emit("1", 9.0925,  245,   3);
	socket.emit("1", 9.3675,  245,   3);
	socket.emit("1", 9.64,    245,   3);
	socket.emit("1", 9.9125,  245,   3);
	socket.emit("1", 10.1875, 245,   3);
	socket.emit("1", 10.4625, 245,   3);
	socket.emit("1", 10.7375, 245,   3);
	socket.emit("1", 4.5889,  186.5, 3);
	socket.emit("1", 5.085,   180.5, 3);
	socket.emit("1", 5.64,    180,   3);
	socket.emit("1", 5.999,   180,   3);
	socket.emit("1", 6.51,    185,   3);
	socket.emit("1", 7.05,    185,   3);
	socket.emit("1", 7.6,     185,   3);
	socket.emit("1", 8.15,    185,   3);
	socket.emit("1", 8.675,   185,   3);
	socket.emit("1", 9.225,   185,   3);
	socket.emit("1", 9.78,    185,   3);
	socket.emit("1", 10.325,  185,   3);
	socket.emit("1", 4.81,    130,   3);
	socket.emit("1", 5.36,    130,   3);
	socket.emit("1", 6.275,   130,   3);
	socket.emit("1", 6.775,   130,   3);
	socket.emit("1", 7.3,     130,   3);
	socket.emit("1", 7.85,    130,   3);
	socket.emit("1", 8.4,     130,   3);
	socket.emit("1", 8.925,   130,   3);
	socket.emit("1", 9.5,     130,   3);
	socket.emit("1", 10.05,   130,   3);
	socket.emit("1", 10.6,    130,   3);
	
	units.forEach(unit => {
		if (unit.owner === player.sid && unit.uPath[0] === 3 && unit.uPath[1] == null) {
			socket.emit("4", unit.id, 0);
		}
	})
}
function placeMicroGens() {
	socket.emit("1", 7.86,   311,    1);
	socket.emit("1", 8.06,   311,    1);
	socket.emit("1", 8.26,   311,    1);
	socket.emit("1", 8.46,   311,    1);
	socket.emit("1", 8.66,   311,    1);
	socket.emit("1", 8.86,   311,    1);
	socket.emit("1", 9.06,   311,    1);
	socket.emit("1", 9.26,   311,    1);
	socket.emit("1", 9.46,   311,    1);
	socket.emit("1", 9.66,   311,    1);
	socket.emit("1", 9.86,   311,    1);
	socket.emit("1", 10.28,  311,    1);
	socket.emit("1", 10.70,  311,    1);
	socket.emit("1", 10.90,  311,    1);
	socket.emit("1", 11.10,  311,    1);
	socket.emit("1", 11.30,  311,    1);
	socket.emit("1", 11.72,  311,    1);
	socket.emit("1", 12.14,  311,    1);
	socket.emit("1", 12.34,  311,    1);
	socket.emit("1", 12.54,  311,    1);
	socket.emit("1", 12.74,  311,    1);
	socket.emit("1", 12.94,  311,    1);
	socket.emit("1", 13.14,  311,    1);
	socket.emit("1", 13.34,  311,    1);
	socket.emit("1", 13.54,  311,    1);
	socket.emit("1", 13.74,  311,    1);
	socket.emit("1", 13.94,  311,    1);
	socket.emit("1", 10.07,  311,    1);
	socket.emit("1", 10.49,  311,    1);
	socket.emit("1", 11.51,  311,    1);
	socket.emit("1", 11.93,  311,    1);
	
	units.forEach(unit => {
		if (unit.owner === player.sid && unit.uPath[0] === 1 && unit.uPath[1] == null) {
			socket.emit("4", unit.id, 1);
		} 
	})
}
function sellGenerators() {
	const yourGens = [];
	units.forEach(unit => {
		if (unit.owner === player.sid && unit.uPath[0] === 3) {
			yourGens.push(unit);
		}
	})
	
	socket.emit("3", yourGens.map(v => v.id));
}
function placeHouses() {
	socket.emit("1", 4.725,  130,    7);
	socket.emit("1", 5.245,  130,    4);
	socket.emit("1", 5.715,  130,    4);
	socket.emit("1", 6.185,  130,    4);
	socket.emit("1", 6.655,  130,    4);
	socket.emit("1", 7.13,   130,    4);
	socket.emit("1", 7.6,    130,    4);
	socket.emit("1", 1.85,   130,    4);
	socket.emit("1", 2.32,   130,    4);
	socket.emit("1", 2.79,   130,    4);
	socket.emit("1", 3.265,  130,    4);
	socket.emit("1", 3.735,  130,    4);
	socket.emit("1", 4.205,  130,    4);
	socket.emit("1", 5.06,   185,    4);
	socket.emit("1", 5.4,    185,    4);
	socket.emit("1", 5.725,  190,    4);
	socket.emit("1", 6.045,  186,    4);
	socket.emit("1", 6.374,  185,    4);
	socket.emit("1", 6.7215, 189.5,  4);
	socket.emit("1", 7.0425, 188.5,  4);
	socket.emit("1", 7.365,  185,    4);
	socket.emit("1", 7.712,  187.45, 4);
	socket.emit("1", 8.035,  188.5,  4);
	socket.emit("1", 8.36,   185,    4);
	socket.emit("1", 2.425,  188,    4);
	socket.emit("1", 2.75,   190,    4);
	socket.emit("1", 3.075,  184,    4);
	socket.emit("1", 3.42,   186,    4);
	socket.emit("1", 3.74,   190,    4);
	socket.emit("1", 4.06,   186,    4);
	socket.emit("1", 4.39,   185,    4);
	socket.emit("1", 4.8625, 245,    4);
	socket.emit("1", 5.1125, 245,    4);
	socket.emit("1", 5.3625, 245,    4);
	socket.emit("1", 5.6125, 245,    4);
	socket.emit("1", 5.8625, 245,    4);
	socket.emit("1", 6.1125, 245,    4);
	socket.emit("1", 6.3625, 245,    4);
	socket.emit("1", 6.6125, 245,    4);
	socket.emit("1", 6.8625, 245,    4);
	socket.emit("1", 7.14,   245,    4);
	socket.emit("1", 7.39,   245,    4);
	socket.emit("1", 7.64,   246,    4);
	socket.emit("1", 7.89,   246,    4);
	socket.emit("1", 8.14,   246,    4);
	socket.emit("1", 8.39,   246,    4);
	socket.emit("1", 8.635,  246,    4);
	socket.emit("1", 8.885,  246,    4);
	socket.emit("1", 2.5825, 245,    4);
	socket.emit("1", 2.8625, 245,    4);
	socket.emit("1", 3.1125, 245,    4);
	socket.emit("1", 3.3625, 245,    4);
	socket.emit("1", 3.6125, 245,    4);
	socket.emit("1", 3.8625, 245,    4);
	socket.emit("1", 4.1125, 245,    4);
	socket.emit("1", 4.3625, 245,    4);
	socket.emit("1", 4.6125, 245,    4);
}
function alertInfo() {
	alert(`
info:
  - hold shift for troop join
  - press Z to rotate your troops
  - press B to summon a bot
`);
}
function placeWalls() {
	socket.emit("1", 4.725,  130,    1);
	socket.emit("1", 5.245,  130,    1);
	socket.emit("1", 5.715,  130,    1);
	socket.emit("1", 6.185,  130,    1);
	socket.emit("1", 6.655,  130,    1);
	socket.emit("1", 7.13,   130,    1);
	socket.emit("1", 7.6,    130,    1);
	socket.emit("1", 1.85,   130,    1);
	socket.emit("1", 2.32,   130,    1);
	socket.emit("1", 2.79,   130,    1);
	socket.emit("1", 3.265,  130,    1);
	socket.emit("1", 3.735,  130,    1);
	socket.emit("1", 4.205,  130,    1);
	socket.emit("1", 5.06,   185,    1);
	socket.emit("1", 5.4,    185,    1);
	socket.emit("1", 5.725,  190,    1);
	socket.emit("1", 6.045,  186,    1);
	socket.emit("1", 6.374,  185,    1);
	socket.emit("1", 6.7215, 189.5,  1);
	socket.emit("1", 7.0425, 188.5,  1);
	socket.emit("1", 7.365,  185,    1);
	socket.emit("1", 7.712,  187.45, 1);
	socket.emit("1", 8.035,  188.5,  1);
	socket.emit("1", 8.36,   185,    1);
	socket.emit("1", 2.425,  188,    1);
	socket.emit("1", 2.75,   190,    1);
	socket.emit("1", 3.075,  184,    1);
	socket.emit("1", 3.42,   186,    1);
	socket.emit("1", 3.74,   190,    1);
	socket.emit("1", 4.06,   186,    1);
	socket.emit("1", 4.39,   185,    1);
	socket.emit("1", 4.8625, 245,    1);
	socket.emit("1", 5.1125, 245,    1);
	socket.emit("1", 5.3625, 245,    1);
	socket.emit("1", 5.6125, 245,    1);
	socket.emit("1", 5.8625, 245,    1);
	socket.emit("1", 6.1125, 245,    1);
	socket.emit("1", 6.3625, 245,    1);
	socket.emit("1", 6.6125, 245,    1);
	socket.emit("1", 6.8625, 245,    1);
	socket.emit("1", 7.14,   245,    1);
	socket.emit("1", 7.39,   245,    1);
	socket.emit("1", 7.64,   246,    1);
	socket.emit("1", 7.89,   246,    1);
	socket.emit("1", 8.14,   246,    1);
	socket.emit("1", 8.39,   246,    1);
	socket.emit("1", 8.635,  246,    1);
	socket.emit("1", 8.885,  246,    1);
	socket.emit("1", 2.5825, 245,    1);
	socket.emit("1", 2.8625, 245,    1);
	socket.emit("1", 3.1125, 245,    1);
	socket.emit("1", 3.3625, 245,    1);
	socket.emit("1", 3.6125, 245,    1);
	socket.emit("1", 3.8625, 245,    1);
	socket.emit("1", 4.1125, 245,    1);
	socket.emit("1", 4.3625, 245,    1);
	socket.emit("1", 4.6125, 245,    1);
	socket.emit("1", 5.21,   245,    1);
	socket.emit("1", 5.71,   245,    1);
	socket.emit("1", 3.725,  245,    1);
	socket.emit("1", 4.225,  245,    1);
	socket.emit("1", 7.86,   311,    1);
	socket.emit("1", 8.06,   311,    1);
	socket.emit("1", 8.26,   311,    1);
	socket.emit("1", 8.46,   311,    1);
	socket.emit("1", 8.66,   311,    1);
	socket.emit("1", 8.86,   311,    1);
	socket.emit("1", 9.06,   311,    1);
	socket.emit("1", 9.26,   311,    1);
	socket.emit("1", 9.46,   311,    1);
	socket.emit("1", 9.66,   311,    1);
	socket.emit("1", 9.86,   311,    1);
	socket.emit("1", 10.28,  311,    1);
	socket.emit("1", 10.70,  311,    1);
	socket.emit("1", 10.90,  311,    1);
	socket.emit("1", 11.10,  311,    1);
	socket.emit("1", 11.30,  311,    1);
	socket.emit("1", 11.72,  311,    1);
	socket.emit("1", 12.14,  311,    1);
	socket.emit("1", 12.34,  311,    1);
	socket.emit("1", 12.54,  311,    1);
	socket.emit("1", 12.74,  311,    1);
	socket.emit("1", 12.94,  311,    1);
	socket.emit("1", 13.14,  311,    1);
	socket.emit("1", 13.34,  311,    1);
	socket.emit("1", 13.54,  311,    1);
	socket.emit("1", 13.74,  311,    1);
	socket.emit("1", 13.94,  311,    1);
	socket.emit("1", 10.07,  311,    1);
	socket.emit("1", 10.49,  311,    1);
	socket.emit("1", 11.51,  311,    1);
	socket.emit("1", 11.93,  311,    1);
	socket.emit("1", 4.725,  250,    1);
	socket.emit("1", -1.55,  190,    1);
}
async function addBot() {
	const bot = new Bot();
	
	bot.spawn(`${player.name}`, player.skin);
	
	window.bots.push(bot);
}
function closeBots() {
	window.bots.forEach(bot => bot.socket.close());
	window.bots = [];
}
function rotateDrones() {
	const distanceBetweenTroops = 2 * Math.PI / selUnits.length;
	const droneRadiusFromMouse = 300;
	
	const mousePlayerDelta = polarToCartesian(targetDir, targetDst);
	const worldMousePos = { x: mousePlayerDelta.x + player.x, y: mousePlayerDelta.y + player.y };
	
	const x1 = player.x + targetDst * Math.cos(targetDir) + camX;
	const y1 = player.y + targetDst * Math.cos(targetDir) + camY;
	
	selUnits.forEach((unit, i) => {
		const x2 = x1 + (Math.cos(distanceBetweenTroops * i + rotateDrones.rotation) * droneRadiusFromMouse);
		const y2 = y1 + (Math.sin(distanceBetweenTroops * i + rotateDrones.rotation) * droneRadiusFromMouse);
		socket.emit("5", x2, y2, [unit.id], 0, 0);
	});

	rotateDrones.rotation += 0.1;
}
rotateDrones.rotation = 0;

function polarToCartesian(r, theta) {
	return {
		x: r * Math.cos(theta),
		y: r * Math.sin(theta)		
	};
}

window.placeWalls = placeWalls

function onReady() {
	backgroundColor = "#444";
	outerColor = "#373737";
	
	socket._emit = socket.emit;
	socket.emit = (...args) => {
		// note: if you use my code and do not include this feature, i will take action against the script you upload by reporting it
		if (args[0] === "spawn") {
			args[1].name = "CS " + args[1].name;
			setTimeout(() => socket._emit("ch", "I am using Public Crabby Script"), 1000);
		}
		
		if (args[0] === "5") {
			args[4] = keys.ShiftLeft ? 0 : args[3];
		}
	
	  socket._emit(...args);
	}
}

document.addEventListener("keydown", async ({ code}) => {
	keys[code] = true;
});

document.addEventListener("keyup", ({ code}) => {
	delete keys[code];
});

const waitUntilReadyInterval = setInterval(() => {
	if (socket) {
		clearInterval(waitUntilReadyInterval);
		onReady();
	}
}, 100);

// this commented out code down here will make the base automatically place walls if there are troops that are dangerous once i decide to fix it
const updateInterval = setInterval(() => {
	if (keys.KeyZ) rotateDrones();
	
	let needsToDefend = false;
	
	units.forEach(unit => {
		if (unit.owner === player.sid) return;
		const distance = Math.sqrt((unit.x - player.x) ** 2 + (unit.y - player.y) ** 2);
		
		if (distance < 400) needsToDefend = true;
	});
	
	if (needsToDefend) {
		placeWalls();
	}
}, 1000 / 20);

// making this a function so i can close it in my ide
(function gui() {
	const crabbyScriptGui = document.createElement("div");
	const buttonAddGens = document.createElement("button");
	const buttonAddMicroGens = document.createElement("button");
	const buttonSellGens = document.createElement("button");
	const buttonGetHouses = document.createElement("button");
	const buttonInfo = document.createElement("button");
	const buttonSpamWalls = document.createElement("button");
	const buttonAddBot = document.createElement("button");
	const buttonCloseBots = document.createElement("button");


	crabbyScriptGui.style.position = "absolute";
	crabbyScriptGui.style.left = "40px";
	crabbyScriptGui.style.top = "40%";
	crabbyScriptGui.style.width = "270px";
	crabbyScriptGui.style.height = "260px";
	crabbyScriptGui.style.background = "linear-gradient(#4330ff88, #53507f88)";
	crabbyScriptGui.style.border = "5px solid #5350ff";
	crabbyScriptGui.style["border-radius"] = "5px";
	crabbyScriptGui.style["box-shadow"] = "10px 6px 10px #0000007f";


	buttonAddGens.style.position = "relative";
	buttonAddGens.style.left = "5px";
	buttonAddGens.style.top = "5px";
	buttonAddGens.style.width = "80px";
	buttonAddGens.style.height = "30px";
	buttonAddGens.style.background = "linear-gradient(to bottom right, #53507f, #5350ff)";
	buttonAddGens.style.color = "#aaa";
	buttonAddGens.style["font-family"] = "Ubuntu";
	buttonAddGens.style["font-size"] = "13px";
	buttonAddGens.style["border-radius"] = "5px";
	buttonAddGens.innerText = "Get power";
	buttonAddGens.addEventListener("click", placeGenerators);

	buttonAddMicroGens.style.position = "relative";
	buttonAddMicroGens.style.left = "10px";
	buttonAddMicroGens.style.top = "5px";
	buttonAddMicroGens.style.width = "85px";
	buttonAddMicroGens.style.height = "30px";
	buttonAddMicroGens.style.background = "linear-gradient(to bottom right, #53507f, #5350ff)";
	buttonAddMicroGens.style.color = "#aaa";
	buttonAddMicroGens.style["font-family"] = "Ubuntu";
	buttonAddMicroGens.style["font-size"] = "13px";
	buttonAddMicroGens.style["border-radius"] = "5px";
	buttonAddMicroGens.innerText = "Micro gens";
	buttonAddMicroGens.addEventListener("click", placeMicroGens);

	buttonSellGens.style.position = "relative";
	buttonSellGens.style.left = "15px";
	buttonSellGens.style.top = "5px";
	buttonSellGens.style.width = "85px";
	buttonSellGens.style.height = "30px";
	buttonSellGens.style.background = "linear-gradient(to bottom right, #53507f, #5350ff)";
	buttonSellGens.style.color = "#aaa";
	buttonSellGens.style["font-family"] = "Ubuntu";
	buttonSellGens.style["font-size"] = "13px";
	buttonSellGens.style["border-radius"] = "5px";
	buttonSellGens.innerText = "Sell gens";
	buttonSellGens.addEventListener("click", sellGenerators);

	buttonGetHouses.style.position = "relative";
	buttonGetHouses.style.left = "5px";
	buttonGetHouses.style.top = "10px";
	buttonGetHouses.style.width = "85px";
	buttonGetHouses.style.height = "30px";
	buttonGetHouses.style.background = "linear-gradient(to bottom right, #53507f, #5350ff)";
	buttonGetHouses.style.color = "#aaa";
	buttonGetHouses.style["font-family"] = "Ubuntu";
	buttonGetHouses.style["font-size"] = "13px";
	buttonGetHouses.style["border-radius"] = "5px";
	buttonGetHouses.innerText = "Add houses";
	buttonGetHouses.addEventListener("click", placeHouses);

	buttonSpamWalls.style.position = "relative";
	buttonSpamWalls.style.left = "-80px";
	buttonSpamWalls.style.top = "10px";
	buttonSpamWalls.style.width = "85px";
	buttonSpamWalls.style.height = "30px";
	buttonSpamWalls.style.background = "linear-gradient(to bottom right, #53507f, #5350ff)";
	buttonSpamWalls.style.color = "#aaa";
	buttonSpamWalls.style["font-family"] = "Ubuntu";
	buttonSpamWalls.style["font-size"] = "13px";
	buttonSpamWalls.style["border-radius"] = "5px";
	buttonSpamWalls.innerText = "Place walls";
	buttonSpamWalls.addEventListener("click", placeWalls);

	buttonInfo.style.position = "relative";
	buttonInfo.style.left = "5px";
	buttonInfo.style.top = "195px";
	buttonInfo.style.width = "85px";
	buttonInfo.style.height = "30px";
	buttonInfo.style.background = "linear-gradient(to bottom right, #53507f, #5350ff)";
	buttonInfo.style.color = "#aaa";
	buttonInfo.style["font-family"] = "Ubuntu";
	buttonInfo.style["font-size"] = "13px";
	buttonInfo.style["border-radius"] = "5px";
	buttonInfo.innerText = "info";
	buttonInfo.addEventListener("click", alertInfo);

	buttonAddBot.style.position = "relative";
	buttonAddBot.style.left = "180px";
	buttonAddBot.style.top = "-20px";
	buttonAddBot.style.width = "85px";
	buttonAddBot.style.height = "30px";
	buttonAddBot.style.background = "linear-gradient(to bottom right, #53507f, #5350ff)";
	buttonAddBot.style.color = "#aaa";
	buttonAddBot.style["font-family"] = "Ubuntu";
	buttonAddBot.style["font-size"] = "13px";
	buttonAddBot.style["border-radius"] = "5px";
	buttonAddBot.innerText = "Add bot";
	buttonAddBot.addEventListener("click", addBot);
	
	buttonCloseBots.style.position = "relative";
	buttonCloseBots.style.left = "-80px";
	buttonCloseBots.style.top = "15px";
	buttonCloseBots.style.width = "85px";
	buttonCloseBots.style.height = "30px";
	buttonCloseBots.style.background = "linear-gradient(to bottom right, #53507f, #5350ff)";
	buttonCloseBots.style.color = "#aaa";
	buttonCloseBots.style["font-family"] = "Ubuntu";
	buttonCloseBots.style["font-size"] = "13px";
	buttonCloseBots.style["border-radius"] = "5px";
	buttonCloseBots.innerText = "Close bots";
	buttonCloseBots.addEventListener("click", closeBots);

	crabbyScriptGui.appendChild(buttonAddGens);
	crabbyScriptGui.appendChild(buttonAddMicroGens);
	crabbyScriptGui.appendChild(buttonSellGens);
	crabbyScriptGui.appendChild(buttonGetHouses);
	crabbyScriptGui.appendChild(buttonInfo);
	crabbyScriptGui.appendChild(buttonSpamWalls);
	crabbyScriptGui.appendChild(buttonAddBot);
	crabbyScriptGui.appendChild(buttonCloseBots);
	document.body.appendChild(crabbyScriptGui);
})();
