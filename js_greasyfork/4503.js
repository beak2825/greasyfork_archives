// ==UserScript==
// @name			emjack
// @version			4.6.6.0
// @description		some crap you may find useful
// @match			https://epicmafia.com/game/*
// @match			https://epicmafia.com/lobby
// @namespace		https://greasyfork.org/users/4723
// @downloadURL https://update.greasyfork.org/scripts/4503/emjack.user.js
// @updateURL https://update.greasyfork.org/scripts/4503/emjack.meta.js
// ==/UserScript==

// welcome back
function emjack() {

	// invalid : break
	var	page = (
		window.setup_id ? "mafia" :
		window.lobby_id ? "lobby" : ""
		);
	if(!page) return;

	// yadayada
	const self = window.user;
	var	alive = true,
		afk = false,
		list = {},
		meetd = {},
		meets = {},
		master = "",
		autobomb = "",
		highlight = "",
		roulette = 0,
		kicktimer = 0,
		keys = 0,
		auth = false,
		notes = null,
		users = {},
		round = {};
	var	ANTIDC = 0x0001,
		AUKICK = 0x0002,
		AUWILL = 0x0004,
		AUBOMB = 0x0008,
		OBEYME = 0x0010,
		UNOTES = 0x0020,
		DEVLOG = 0x0040,
		JEEVES = 0x0080,
		SYSALT = 0x0100,
		MSGMRK = 0x0200,
		DSPFMT = 0x0400,
		DSPIMG = 0x0800,
		GRAPHI = 0x4000;
	var	K_DEBUG = 0x0004,
		K_SHIFT = 0x0008;

	// public
	var	user = window.user || "",
		ranked = window.ranked === true,
		game_id = window.game_id || 0,
		setup_id = window.setup_id || localStorage.ejsid || 0,
		_emotes = window._emotes || {},
		lobby_emotes = window.lobby_emotes || (
			window.lobbyinfo ? lobbyinfo.emotes : {}
			);
	window.ej = {
		name: "emjack",
		version: 0x2e,
		vstring: "4.6.6.0",
		cmds: {},
		notes: localStorage.notes ? JSON.parse(localStorage.notes) : {},
		users: users,
		settings: + localStorage.ejs || AUKICK | UNOTES | MSGMRK | DSPFMT,
		};
	notes = ej.notes;
	afk = (ej.settings & JEEVES) === JEEVES;

	// setup role icons
	var	roleimg = document.createElement("style");
	document.head.appendChild(roleimg).type = "text/css";
	if(localStorage.roleimg) {
		setTimeout(function() {
			ej.run("icons " + localStorage.roleimg, list.chat);
			});
		}

	// update
	if(!localStorage.ejv) {
		ej.settings |= DSPFMT;
		localStorage.ejv = 0x2d;
		}
	if(localStorage.ejv < 0x2e) {
		ej.settings |= MSGMRK;
		localStorage.ejv = 0x2e;
		}

	// plug in
	var	sock = { socket: null },
		postjackl = [];
	ej.sock = sock;
	function postjack() {
		var	args = [];
		for(var i = 0; i < arguments.length-1; i++) {
			args[i] = arguments[i];
			}
		postjackl.push(args, arguments[i]);
		};
	function postjack_run() {
		while(postjackl.length) {
			postjackl.pop().apply(null, postjackl.pop());
			}
		};
	WebSocket.prototype.send = function(initial) {
		return function() {
			if(sock.socket !== this) {
				sock.build(this);
				}
			arguments[0] = sock.intercept(arguments[0]);
			initial.apply(this, arguments);
			};
		}(WebSocket.prototype.send);

	// socket
	sock.build = function(socket) {
		this.socket = socket;
		if(page === "mafia") {
			log("", "rt emote emote-" + _emotes[arand(Object.keys(_emotes))]);
			log(ej.name + ej.vstring + " connected", "rt");
			log((ej.settings | 65536).toString(2).substring(1));
			}
		socket.onmessage = function(initial) {
			return function(event) {
				sock.handle(event.data, event);
				if(alive) {
					initial.apply(this, arguments);
					setTimeout(postjack_run, 200);
					}
				};
			}(socket.onmessage);
		};
	sock.handle = function(data, event) {
		try {
			let raw = "";
			for(let i = 0, j = new DataView(data); i < j.byteLength; i++) {
				raw += String.fromCharCode(j.getUint8(i))
				}
			data = JSON.parse(raw.substr(raw.indexOf("[")));
			}
		catch(error) {
			data = null;
			}
		if(data) {
			if(page === "mafia") {
				for(var i = 0, real = null; i < data.length; i++) {
					real = sock.parseShort(data[i][0], data[i][1]);
					if(ej.settings & DEVLOG) {
						console.log(" > %s:", real[0], real[1]);
						}
					if(ej.cmds[real[0]]) {
						ej.cmds[real[0]].call(ej, real[1], event);
						}
					}
				}
			else {
				for(var i = 0; i < data.length; i += 2) {
					if(ej.ccmds[data[i]]) {
						ej.ccmds[data[i]].apply(ej, data[i + 1]);
						}
					}
				}
			}
		};
	sock.intercept = function(data) {
		try {
			let raw = "";
			for(let i = 0; i < data.byteLength; i++) {
				raw += String.fromCharCode(data[i])
				}
			if(~raw.indexOf("[")) {
				data = JSON.parse(raw.substr(raw.indexOf("[")));
				}
			else {
				return data;
				}
			}
		catch(error) {
			return data;
			}
		if(ej.settings & DEVLOG) {
			console.log(" < %s:", data[0], data[1]);
			}
		if(page === "mafia") {
			if(ej.cmdi[data[0]]) {
				data[1] = ej.cmdi[data[0]](data[1]);
				}
			}
		else {
			if(ej.ccmdi[data[0]]) {
				data = ej.ccmdi[data[0]].apply(ej, data);
				}
			}
		data = JSON.stringify(data);
		var raw = [0xd9, data.length];
		for(let i = 0; i < data.length; i++) {
			raw.push(data.charCodeAt(i));
			}
		return Uint8Array.from(raw);
		};
	sock.parseShort = function(cmd, data) {
		var	rfmt = this.short[cmd];
		if(rfmt) {
			if(data) for(var key in rfmt.data) {
				data[key] = data[rfmt.data[key]] || data[key];
				// delete data[rfmt.data[key]];
				}
			return [rfmt.cmd, data];
			}
		else {
			return [cmd, data];
			}
		};
	sock.short = function(short) {
		var	rfmt = {};
		for(var i = 0, data = null; i < short.length; i++) {
			data = short[i];
			rfmt[data.alias || data.cmd]={
				cmd: data.cmd || data.alias,
				data: data.data
				};
			}
		return rfmt;
		}(window.shorten || []);
	sock.cmd = function(cmd, data) {
		if(sock.socket) {
			data = JSON.stringify([cmd, data]);
			var raw = [0xd9, data.length];
			for(let i = 0; i < data.length; i++) {
				raw.push(data.charCodeAt(i));
				}
			sock.socket.send(
				Uint8Array.from(raw)
				);
			}
		};
	sock.chat = function(message, data) {
		if(typeof data === "object") {
			data.msg = message;
			data.meet = data.meet || meetd.meet;
			sock.cmd("<", data);
			}
		else sock.cmd("<", {
			meet: meetd.meet,
			msg: data ? "@" + data + " " + message : message
			});
		};
	sock.vote = function(vote, meeting) {
		sock.cmd("point", {
			meet: meeting || meetd.meet,
			target: vote
			});
		};
	sock.dcthen = function(callback) {
		alive = false;
		if(page === "mafia") {
			ej.redirect_back = callback;
			sock.cmd("leave");
			WebSocket.prototype.send = function() {};
			}
		else {
			callback();
			}
		};

	// packets
	ej.cmdi = {
		"$MODIFY": function(data) {
			for(var key in data) {
				data[key] = prompt(key, data[key]);
				}
			return data;
			},
		"join": function(data) {
			if(keys & K_DEBUG) {
				keys ^= K_DEBUG;
				return ej.cmdi.$MODIFY(data);
				}
			return data;
			}
		};
	ej.cmds = {
		"auth": function(data) {
			var	ofg = $("#option_fastgame"),
				ons = $("#option_nospectate");
			if(!ranked) {
				let ofg = $("#option_fastgame"),
					ons = $("#option_nospectate");
				if(!ofg.hasClass("sel")) {
					ofg.click();
					}
				if(!ons.hasClass("sel")) {
					ons.click();
					}
				}
			postjack(data, function(data) {
				auth = true;
				ku.send(0, Math.round(ej.version-42));
				});
			},
		"round": function(data) {
			round = data;
			if(auth && data.state === 1) {
				if(ej.settings & AUWILL && !ranked && !u(self).mafia) {
					postjack(data, function(data) {
						log("Wrote will.", "lastwill");
						sock.cmd("will", {
							msg: `${self}, ${u(self).role}`
							});
						});
					}
				}
			if((data.state & 1) === 0) {
				postjack(function() {
					for(let x in users) {
						let node = $(`#id_${x}`);
						if(node.length && !$(`#vc_${x}`).length) {
							node.prepend(
								$(`<span id="vc_${x}">${meetd.tally && meetd.tally[x] || 0}</span>`)
								);
							}
						}
					});
				}
			},
		"users": function(data) {
			for(var x in data.users) {
				u.make(data.users[x]);
				}
			postjack(data, function(data) {
				for(var x in data.users) {
					if(notes[x]) {
						$(`[data-uname="${x}"]`).attr("title", notes[x]);
						}
					}
				});
			},
		"left": function(data) {
			for(var i = 0; i < data.left.length; i++) {
				u(data.left[i]).dead = true;
				}
			},
		"anonymous_players": function(data) {
			for(var x in users) {
				delete users[x];
				}
			for(var i = 0; i < data.players.length; i++) {
				u.make(data.players[i]);
				}
			},
		"anonymous_reveal": function(data) {
			if(data.user === self) {
				u.make(u(this.mask));
				}
			},
		"join": function(data) {
			u.make(data.data);
			log(data.user + " has joined");
			$("#minigame").trigger("mini::sync");
			if(ej.settings & AUKICK && /autokick/i.test(notes[data.user])) {
				postjack(data.data.id, function(id) {
					sock.cmd("ban", {
						uid: id
						});
					});
				}
			else {
				postjack(data.user, function(user) {
					if(notes[user]) {
						$(`[data-uname="${user}"]`).attr("title", notes[user]);
						}
					});
				}
			},
		"leave": function(data) {
			log(data.user + " has left");
			delete users[data.user];
			},
		"kick": function(data) {
			u(data.user).dead = true;
			for(var x in meetd.votes) {
				if(meetd.votes[x] === data.user) {
					data.unpoint = true;
					ej.cmds.point(data);
					}
				}
			},
		"kill": function(data) {
			u(data.target).dead = true;
			},
		"k": function(data) {
			ku.recv(u(data.user || data.u), 1, Date.now());
			},
		"u": function(data) {
			ku.recv(u(data.user || data.u), 0, Date.now());
			},
		"<": function(data, event) {
			if(data.user === highlight) {
				postjack(function() {
					$(".talk").last().addClass("ej_highlight");
					});
				}
			if(auth && !ranked) {
				if(data.msg[0]==="$") {
					if(ej.settings & DSPFMT) {
						ej.run(data.msg.substring(1), list.format);
						}
					}
				else if(ej.settings & OBEYME) {
					if(data.msg[0]==="@") {
						var	target = data.msg.replace(/@(\w+).+/, "$1"),
							message = data.msg.replace(/@\w+ (.+)/, "$1");
						if(target === self) {
							ej.run(message, list.bot, data);
							}
						}
					}
				else if(roulette && data.msg === `@${self} roulette`) {
					ej.run("roulette", list.bot, data);
					}
				}
			},
		"speech": function(data) {
			if(data.type === "contact") {
				postjack(data, function(data) {
					log(`The roles are... ${data.data.join(", ")}`);
					});
				}
			},
		"meet": function(data) {
			const MEET_ROLES = ["mason", "templar", "mafia", "cultist", "cyborg", "zombie"];
			data.tally = {};
			data.votes = {};
			meets[data.meet] = data;
			if(data.say || !meetd.meet) {
				meetd = data;
				for(var i = 0; i < data.members.length; i++) {
					u(data.members[i]).meet = data.meet;
					}
				}
			for(var i = 0; i < data.basket.length; i++) {
				data.tally[data.basket[i]] = 0;
				}
			for(var i = 0; i < data.members.length; i++) {
				data.votes[data.members[i]]="";
				}
			if(data.non_voting) {
				for(var i = 0; i < data.non_voting.length; i++) {
					data.votes[data.non_voting[i]]="*";
					}
				}
			if(data.disguise && ej.settings & 0x800000) {
				for(var x in data.disguise) {
					postjack(x, data.disguise[x], function(fake, name) {
						log(fake + " is " + name);
						});
					}
				}
			if(~MEET_ROLES.indexOf(data.meet)) {
				if(data.meet === "mafia") {
					for(let i = 0; i < data.members.length; i++) {
						u(data.members[i]).mafia = true;
						}
					}
				postjack(data.meet, data.members, function(meet, members) {
					for(let i = 0; i < data.members.length; i++) {
						$(`[data-uname="${data.members[i]}"] .roleimg.role-unknown`)
							.removeClass("role-unknown")
							.addClass(`role-${data.meet}`);
						}
					});
				}
			},
		"end_meet": function(data) {
			if(data.meet === meetd.meet) {
				meetd = {};
				}
			delete meets[data.meet];
			for(var x in users) {
				if(users[x].meet === data.meet) {
					if(!users[x].id) {
						delete users[x];
						}
					else if(data.say) {
						users[x].meet = "";
						}
					}
				}
			},
		"point": function(data) {
			var	node = null,
				meet = meets[data.meet];
			if(meet) {
				if(data.unpoint) {
					meet.tally[data.target]--;
					meet.votes[data.user]="";
					}
				else {
					let prev = meet.votes[data.user];
					if(prev) {
						meet.tally[prev]--;
						$(`#vc_${prev}`)
							.text(meet.tally[prev]);
						}
					meet.tally[data.target]++;
					meet.votes[data.user] = data.target;
					}
				$(`#vc_${data.target}`)
					.text(meet.tally[data.target]);
				}
			},
		"reveal": function(data) {
			u(data.user).role = data.data;
			if(!u(data.user).dead) {
				postjack(data, function(data) {
					log(`${data.user === self ? "Your role" : data.user} is ${data.data}!`);
				});
				}
			},
		"countdown": function(data) {
			if(auth && !ranked && ej.settings & AUKICK) {
				clearTimeout(kicktimer);
				kicktimer = setTimeout(function() {
					jeeves.work();
					sock.cmd("kick");
					}, data.totaltime);
				}
			},
		"kickvote": function() {
			clearTimeout(kicktimer);
			if(!ranked && ej.settings & AUKICK) {
				jeeves.work();
				sock.cmd("kick");
				}
			},
		"redirect": function(data) {
			if(!alive && ej.redirect_back) {
				ej.redirect_back();
				ej.redirect_back = null;
				}
			}
		};
	ej.ccmdi = {
		"<": function(c, msg) {
			if(msg[0] === "/") {
				return ["<"];
				}
			return arguments;
			}
		};
	ej.ccmds = {
		"<": function(id, msg, t) {
			if(msg[0] === "$") {
				if(ej.settings & DSPFMT) {
					ej.run(msg.substring(1), list.format);
					}
				}
			}
		};

	// kucode
	var	ku = {};
	ku.send = function(op, code) {
		code += op << 6;
		if(ej.settings & DEVLOG) {
			log(" * " + self + ": " + (code | 1024).toString(2).substring(1));
			}
		setTimeout(function() {
			for(var i = 9; i >= 0; i--) {
				sock.cmd(code >> i & 1 ? "k" : "u");
				}
			if(code & 1) {
				sock.cmd("u");
				}
			}, 200);
		};
	ku.recv = function(u, bit, time) {
		if(time-u.kuclock > 100) {
			u.kucode = 1;
			u.kuclock = Infinity;
			}
		else {
			u.kucode <<= 1;
			u.kucode |= bit;
			if(u.kucode & 1024) {
				if(ej.settings & DEVLOG) {
					log(" * " + u.name + ": " + u.kucode.toString(2).substring(1));
					}
				if(ku.op[u.kucode >> 6 & 15]) {
					ku.op[u.kucode >> 6 & 15]
					(u, u.kucode & 63);
					}
				u.kucode = 1;
				u.kuclock = Infinity;
				}
			else {
				u.kuclock = time;
				}
			}
		};
	ku.op = [
		function(u, code) {
			if(u.emjack === null) {
				u.emjack = (42 + code) / 10 || 0;
				ku.send(0, Math.round(ej.version-42));
				}
			},
		function(u, code) {
			ku.send(0, Math.round(ej.version-42));
			},
		function(u, code) {
			if(ej.settings & 0x800000) {
				log(u.name + " sent "
					+ (code | 64).toString(2).substring(1)
					+ ":" + code.toString()
					+ ":" + String.fromCharCode(code + 96)
				   );
				}
			},
		undefined,
		undefined,
		undefined,
		function(u, code) {
			$("#minigame").trigger("mini::update", [code]);
			},
		function(u, code) {
			console.log(u.username, code);
			$("#minigame").trigger("mini::vote", [u.username, code]);
			}
		];

	// jeeves
	var	jeeves = {};
	jeeves.work = function() {
		if(afk && !ranked) {
			for(var x in meets) {
				if(!meets[x].votes[self]) {
					jeeves.think(meets[x]);
					}
				}
			}
		};
	jeeves.think = function(meet) {
		for(var x in meet.tally) {
			if(Math.random() < meet.tally[x]/meet.members.length) {
				sock.vote(x, meet.meet);
				break;
				}
			}
		if(!meet.votes[self]) {
			sock.vote(arand(meet.basket || Object.keys(users)), meet.meet);
			}
		};

	// chat base
	ej.run = function(input, list, data) {
		for(var i = 0, match = null; i < list.length; i++) {
			match = list[i].regex.exec(input);
			if(match !== null) {
				data ? match[0] = data : match.shift();
				list[i].callback.apply(list[i], match);
				break;
				}
			}
		};

	// chat commands
	list.format = [
		{
			name: "Display image",
			short: "$img [url]",
			regex: /^img (.+)/i,
			callback: function(url) {
				if(ej.settings & DSPIMG) {
					postjack(url, function(url) {
						var	img = new Image(),
							node = document.createElement("a");
						img.src = url;
						node.href = url;
						node.target = "_blank";
						node.appendChild(img);
						log(node, "ej_img");
						});
					}
				}
			},
		{
			name: "Display webm",
			short: "$webm [url]",
			regex: /^webm (.+)/i,
			callback: function(url) {
				if(ej.settings & DSPIMG) {
					postjack(url, function(url) {
						var	video = document.createElement("video");
						video.src = url;
						video.setAttribute("controls", "");
						video.setAttribute("type", "video/webm");
						log(video, "ej_img");
						});
					}
				}
			}
		];

	list.copy = {
		sc: {
			name: "Scriptcheck",
			short: "/sc",
			regex: /^sc|^scriptcheck/i,
			callback: function() {
				log(ej.name + ej.vstring);
				}
			},
		eval: {
			name: "Evaluate",
			regex: /^eval (.+)/i,
			callback: function(input) {
				log(JSON.stringify(eval(input)) || "undefined");
				}
			},
		emotes: {
			name: "Get emotes",
			short: "/emotes",
			regex: /^emotes/i,
			callback: function() {
				log("Sitewide emotes", "bold");
				log(Object.keys(_emotes).join(" ") || "none found");
				log("Lobby emotes", "bold");
				log(Object.keys(lobby_emotes).join(" ") || "none found");
				}
			},
		fmt: {
			name: "Toggle chat formatting",
			short: "/fmt [on | off | noimg]",
			regex: /^fmt ?(on|off|noimg)?/i,
			callback: function(_type) {
				if(!_type) {
					log("Type " + this.short);
					}
				else if(_type === "on") {
					ej.settings |= DSPFMT | DSPIMG;
					log("$ chat formatting on (including images)");
					}
				else if(_type === "noimg") {
					ej.settings |= DSPFMT;
					ej.settings &=~ DSPIMG;
					log("$ chat formatting on (no images)");
					}
				else {
					ej.settings &=~ (DSPFMT | DSPIMG);
					log("$ chat formatting off");
					}
				}
			},
		say: {
			name: "Send message",
			short: "/say [message]",
			regex: /^say ?(.+)?/i,
			callback: function(msg) {
				if(!msg) {
					log("Type " + this.short);
					}
				else {
					sock.chat(msg);
					}
				}
			},
		join: {
			name: "Lobby join (or host)",
			short: "/join [host]",
			regex: /^join ?(host.+)?/i,
			callback: function(host) {
				request("GET", "/game/find?page = 1", function(data) {
					if(page === "mafia") {
						log("// retrieved", "rt bold notop");
						}
					JSON.parse(JSON.parse(data)[1]).data.forEach(function(table) {
						if(!table.status_id && !table.password) {
							if(table.target === 12 && table.id !== game_id) {
								sock.dcthen(function() {
									location.href = "/game/" + table.id;
									});
								}
							}
						});
					if(alive) {
						log("No games found.");
						if(host) {
							ej.run(host, list.chat);
							}
						}
					});
				}
			},
		host: {
			name: "Lobby host",
			short: "/host [title]",
			regex: /^host(r)? ?(.+)?/i,
			callback: function(r, title) {
				log("Hosting setup#" + setup_id + "...");
				sock.dcthen(function() {
					request("GET", sformat(
						"/game/add/mafia?setupid=$1 & ranked=$2 & add_title=$3 & game_title=$4",
						[setup_id, !!r, title ? 1 : 0, title]
						), function(data) {
						location.href = "/game/" + JSON.parse(data)[1].table;
						}
						   );
					});
				}
			},
		games: {
			name: "Lobby games",
			short: "/games",
			regex: /^games/i,
			callback: function() {
				request("GET", "/game/find?page = 1", function(data) {
					var	a, div;
					if(page === "mafia") {
						log("// retrieved", "rt bold notop");
						}
					JSON.parse(JSON.parse(data)[1]).data.forEach(function(table) {
						if(table.status_id || table.password) {
							return;
							}
						a = document.createElement("a");
						a.textContent = "Table " + table.id;
						a.addEventListener("click", function(event) {
							sock.dcthen(function() {
								location.href = "/game/" + table.id;
								});
							});
						div = document.createElement("div");
						div.appendChild(a);
						div.appendChild(
							document.createTextNode(" - " + table.numplayers + " / " + table.target + " players")
							);
						if(table.id === game_id) {
							div.appendChild(
								document.createTextNode(" (you)")
								);
							}
						log(div);
						});
					});
				}
			},
		pm: {
			name: "Bugs, suggestions & spam",
			short: "/bugs",
			regex: /^bugs?/i,
			callback: function() {
				window.open("/topic/77055", "_blank");
				}
			}
		};

	// chat commands
	list.chat = [
		list.copy.sc,
		{
			regex: /^(me .+)/i,
			callback: function(msg) {
				sock.chat("/" + msg);
				}
			},
		{
			name: "About",
			short: "/help",
			regex: /^(?:info|help|about) ?(.+)?/i,
			callback: function(topic) {
				if(this.topics[topic]) {
					log(ej.name + ej.vstring + ":" + topic, "bold");
					for(var i = 0; i < this.topics[topic].length; i++) {
						log(this.topics[topic][i]);
						}
					}
				else {
					log(ej.name + ej.vstring, "bold");
					log("Type /cmdlist for a list of commands");
					log("Topics (type /help [topic]): ", "lt notop");
					log(Object.keys(this.topics).join(", "), "tinyi");
					}
				},
			topics: {
				"features": [
					"The following passive features are always active:",
					"Auto boxes \x95 Auto focus \x95 Clickable links \x95 Partner icons \x95 Agent role list \x95 Automatically write will (/autowill to toggle) \x95 etc."
					],
				"jeeves": [
					"Type /afk to toggle Jeeves or /afk [on/off] to toggle in all games",
					"Jeeves will automatically vote for you at the end of the day if you haven't " +
					"voted already. He randomly picks a player based on the popular vote (if any)"
					],
				"marking": [
					"Click on a message to (un)mark it purple (shift + click for orange)"
					],
				"ranked": [
					"The following features are disabled in ranked games:",
					"Auto will \x95 Jeeves (/afk) \x95 Fake quoting & reporting \x95 Will & death message editing \x95 misc."
					],
				"hotkeys": [
					"Ctrl + B: Toggle boxes",
					"Ctrl + Q: Quote typed message as yourself"
					]
				}
			},
		list.copy.eval,
		{
			name: "Get metadata",
			regex: /^meta(?:data)?/i,
			callback: function() {
				for(var param in ej.meta) {
					log("@" + param + ": " + ej.meta[param]);
					}
				}
			},
		{
			name: "Get whois",
			short: "/whois [name]",
			regex: /^whois ?(.+)?/i,
			callback: function(name) {
				if(!name) {
					log("Type " + this.short);
					}
				else if(users[name]) {
					log(users[name].name + " (" + users[name].id + ") " + (
						isNaN(users[name].emjack) ? "" : "ej" + users[name].emjack
						), "bold");
					log("emotes: " + (
						users[name].emotes ?
						Object.keys(users[name].emotes).join(" ") || "none found" :
						"does not own"
						));
					}
				else {
					log("Can't find '" + name + "'");
					}
				}
			},
		list.copy.emotes,
		{
			name: "Role info",
			short: "/role [name OR user]?",
			regex: /^role ?(.+)?/i,
			callback: function(id) {
				id = id ? u(id).role || id.toLowerCase() : u(self).role;
				request("GET", `/role/${id}/info/roleid`, function(data) {
					if(data) {
						var	div = document.createElement("div");
						div.innerHTML = data;
						log("// retrieved", "rt bold notop");
						log(div);
						}
					else {
						log(`Cannot find role '${id}'`);
						}
					});
				}
			},
		{
			name: "Get command list",
			short: "/cmdlist [bot | format]?",
			regex: /^cmdlist ?(bot|format)?/i,
			callback: function(type) {
				let	data = (
					type === "bot" ?
						list.bot :
					type === "format" ?
						list.format :
						list.chat
					);
				for(let i = 0; i < data.length; i++) {
					if(data[i].short) {
						log(data[i].name, "rt bold notop");
						log(" :: " + data[i].short);
						}
					}
				}
			},
		{
			name: "Toggle Jeeves",
			short: "/afk",
			regex: /^afk/i,
			callback: function(state) {
				afk = !afk;
				ej.settings ^= JEEVES;
				log(afk ?
					"Jeeves will handle your affairs." :
					"Jeeves has been dismissed."
				   );
				}
			},
		{
			name: "Toggle autowill",
			short: "/autowill",
			regex: /^aw|^autowill/i,
			callback: function() {
				ej.settings ^= AUWILL;
				log(ej.settings & AUWILL ?
					"Name & role will be written in will by default." :
					"Disabled autowill."
				   );
				}
			},
		{
			name: "Toggle autokick",
			short: "/autokick",
			regex: /^ak|^autokick/i,
			callback: function() {
				ej.settings ^= AUKICK;
				log(ej.settings & AUKICK ?
					"Autokick enabled." :
					"Disabled autokick."
				   );
				}
			},
		{
			name: "Toggle marking",
			regex: /^mark/i,
			callback: function() {
				ej.settings ^= MSGMRK;
				log(ej.settings & MSGMRK ?
					"Messages can be marked in orange or purple by clicking or shift-clicking." :
					"Messages will not be marked."
				   );
				}
			},
		list.copy.fmt,
		{
			name: "Toggle logging",
			regex: /^dev/i,
			callback: function() {
				ej.settings ^= DEVLOG;
				log(ej.settings & DEVLOG ?
					"Logging debug data." :
					"Logging disabled."
				   );
				}
			},
		{
			name: "Get Jacks",
			short: "/jax",
			regex: /^jax/i,
			callback: function() {
				var	ulist = [];
				for(var x in users) {
					if(users[x].emjack !== null) {
						ulist.push(x + " (" + users[x].emjack + ")");
						}
					}
				log(ulist.join(", ") || "no jax");
				}
			},
		list.copy.say,
		{
			name: "Cry (if Crier)",
			short: "/cry [message]",
			regex: /^cry (.+)/i,
			callback: function(message) {
				sock.cmd("<", {
					crier: true,
					meet: "village",
					msg: message
					});
				}
			},
		{
			name: "Contact (if Agent)",
			short: "/con [target] [message]",
			regex: /^con (\w+) (.+)/i,
			callback: function(target, message) {
				sock.cmd("<", {
					contact: true,
					meet: "village",
					msg: message,
					target: target
					});
				}
			},
		{
			name: "Disguise (if Ventriloquist)",
			short: "/vent [from] [to] [message]",
			regex: /^vent?(al*)? (\w+) (\S+) ?(.*)/i,
			callback: function(all, from, to, message) {
				sock.cmd("<", {
					ventrilo: true,
					meet: "village",
					msg: all ? to + " " + message : message,
					ventuser: from,
					venttarget: all ? "*" : to
					});
				}
			},
		{
			name: "Whisper",
			short: "/w [name] [message]",
			regex: /^w (\w+) (.+)/i,
			callback: function(to, message) {
				sock.chat(message, {
					whisper: true,
					target: to
					});
				}
			},
		{
			name: "Ping",
			short: "/ping",
			regex: /^ping/i,
			callback: function() {
				var	pingees = [];
				for(var x in meetd.votes) {
					if(!meetd.votes[x] && !u(x).dead && u(x).id) {
						pingees.push(x);
						}
					}
				sock.chat(pingees.join(" "));
				}
			},
		{
			name: "Kick",
			short: "/kick [name]",
			regex: /^kick (\w+)/i,
			callback: function(name) {
				sock.cmd("ban", {
					uid: u(name).id
					});
				}
			},
		{
			name: "Vote",
			short: "/vote [name] OR /nl",
			regex: /^(vote|nl) ?(\w+)?/i,
			callback: function(vote, name) {
				if(vote === "nl" || /^no ?(one)?$/.test(name)) {
					name = "*";
					}
				sock.vote(name || arand(
						meetd.basket ? meetd.basket : Object.keys(users)
						)
					);
				}
			},
		{
			name: "Shoot (with gun)",
			short: "/shoot [name]",
			regex: /^shoot ?(\w+)?/i,
			callback: function(name) {
				sock.vote(name || "*", "gun");
				}
			},
		{
			name: "Highlight user messages",
			short: "/highlight [name]",
			regex: /^(?:h\b|hl|highlight) ?(\w+)?/i,
			callback: function(name) {
				if(!name) {
					if(highlight) {
						highlight = "";
						$(".ej_highlight").removeClass("ej_highlight");
						log("Removed highlighting");
						}
					}
				else {
					highlight = name;
					$(".talk")
						.has(`.talk_username[value="${name}"]`)
						.addClass("ej_highlight");
					log("Highlighting " + name + "'s messages");
					}
				}
			},
		{
			name: "Leave game",
			short: "/leave",
			regex: /^leave|^quit/i,
			callback: function(name) {
				sock.cmd("leave");
				}
			},
		list.copy.join,
		list.copy.host,
		list.copy.games,
		list.copy.pm,
		{
			name: "[Naughty] Will",
			regex: /^will ?(.+)?/i,
			callback: function(will) {
				if(ranked) {
					log("Disabled in ranked games.");
					}
				else if(ej.settings & 0x800000) {
					log("You revised your will.", "lastwill");
					sock.cmd("will", {
						msg: will || ""
						});
					}
				}
			},
		{
			name: "[Naughty] Death Message",
			regex: /^dm (.+)?/i,
			callback: function(msg) {
				if(ranked) {
					log("Disabled in ranked games.");
					}
				else if(ej.settings & 0x800000) {
					if(/\(name\)/i.test(msg)) {
						request("GET", "/user/edit_deathmessage?deathmessage=" + encodeURIComponent(msg),
								function(response) {
							log("Changed death message to '" + msg.replace(/\(name\)/ig, self) + "'");
							}
							   );
						}
					else {
						log("You forgot (name) in your death message.");
						}
					}
				}
			},
		{
			name: "[Naughty] Dethulu",
			regex: /^(?:dt|thulu) (.+)/i,
			callback: function(message) {
				if(ranked) {
					log("Disabled in ranked games.");
					}
				else if(ej.settings & 0x800000) {
					sock.cmd("<", {
						meet: meetd.meet,
						msg: "\u200B",
						quote: true,
						target: message
						});
					}
				}
			},
		{
			name: "[Naughty] Fakequote",
			regex: /^(?:fq|quote) (\w+) (.+)/i,
			callback: function(who, message) {
				if(ranked) {
					log("Disabled in ranked games.");
					}
				else if(ej.settings & 0x800000) {
					sock.cmd("<", {
						meet: meetd.meet,
						msg: message,
						quote: true,
						target: who
						});
					}
				}
			},
		{
			name: "[Naughty] Autobomb",
			regex: /^(?:ab|autobomb) ?(\w+)?/i,
			callback: function(name) {
				if(ranked) {
					log("Disabled in ranked games.");
					}
				else if(ej.settings & 0x800000) {
					if(name) {
						autobomb = name;
						ej.settings |= AUBOMB;
						log("Passing the bomb to " + name);
						}
					else {
						autobomb = "";
						ej.settings ^= AUBOMB;
						log(ej.settings & AUBOMB ?
							"You're now an anarchist!" :
							"You're now a tree."
						   );
						}
					}
				}
			},
		{
			name: "[Naughty] Fake Sysmessage",
			regex: /^f(s)? ?(\w+)? ?(.+)?/i,
			callback: function(send, id, input) {
				if(ranked) {
					log("Disabled in ranked games.");
					}
				else /* if(ej.settings & 0x800000) */ {
					var	output = this.messages[id];
					if(!output) {
						log("System messages: " + Object.keys(this.messages).join(", "));
						}
					else {
						var	i = 0, args = output.default;
						if(input) {
							args = [];
							while(args.length < output.default.length) {
								if(input) {
									if(args.length === output.default.length-1) {
										args.push(input);
										}
									else {
										i = input.search(/ |$/);
										args.push(input.substring(0, i));
										input = input.substring(i + 1);
										}
									}
								else {
									args.push(output.default[args.length]);
									}
								}
							}
						if(send) {
							sock.chat(sformat(output.msg, args));
							}
						else {
							log(sformat(output.msg, args));
							}
						}
					}
				},
			messages: {
				angel: {
					msg: "You feel an overwhelming, unconditional love for $1. "
					+ "You feel you must protect $1 with your life.",
					default: [self]
					},
				auto: {
					msg: "There might be an autocrat among you...",
					default: []
					},
				bleed: {
					msg: "You start to bleed...",
					default: []
					},
				bomb: {
					msg: "$1 rushes at $2 and reveals a bomb!",
					default: [self, self]
					},
				carol: {
					msg: "You see a merry Caroler outside your house! "
					+ "They sing you a Carol about $1, $2, $3. At least one of which is the Mafia!",
					default: [self, self, self]
					},
				chef: {
					msg: "You find yourself in a dimly lit banquet! "
					+ "You sense the presence of a masked guest. The guest appears to be a $1.",
					default: ["ninja"]
					},
				cm: {
					msg: "You glance at your watch. The time is now $1 o'clock.",
					default: ["11"]
					},
				cmlife: {
					msg: "Your watch whispers to you. You have one extra life.",
					default: []
					},
				confess: {
					msg: "At the confessional tonight, a $1 had visited you to confess their sins.",
					default: ["survivor"]
					},
				cop: {
					msg: "After investigations, you suspect that $1 is sided with the $2.",
					default: [self, "mafia"]
					},
				cry: {
					msg: "Someone cries out | $1",
					default: [""]
					},
				det: {
					msg: "Through your detective work, you learned that $1 is a $2!",
					default: [self, "ninja"]
					},
				disc: {
					msg: "You discover that $1 is the $2!",
					default: [self, "interceptor"]
					},
				dream: {
					msg: "You had a dream... where at least one of $1, $2, $3 is a mafia...",
					default: [self, self, self]
					},
				fire: {
					msg: "Somebody threw a match into the crowd! " +
					"$1 suddenly lights on fire and burns to a crisp!",
					default: [self]
					},
				firefail: {
					msg: "Somebody threw a match into the crowd!",
					default: []
					},
				guise: {
					msg: "You are now disguised as $1.",
					default: [self]
					},
				guised: {
					msg: "$1 has stolen your identity!",
					default: [self]
					},
				gun: {
					msg: "You hear a gunshot!",
					default: []
					},
				gunfail: {
					msg: "$1 reveals a gun! The gun backfires!",
					default: [self]
					},
				gunhit: {
					msg: "$1 reveals a gun and shoots $2!",
					default: [self, self]
					},
				hit: {
					msg: "A bullet hits your vest! You cannot survive another hit!",
					default: []
					},
				invis: {
					msg: "Someone whispers $1",
					default: [""]
					},
				item: {
					msg: "You received a $1!",
					default: ["key"]
					},
				jail: {
					msg: "You have been blindfolded and sent to jail!",
					default: []
					},
				jan: {
					msg: "While cleaning up the mess, you learned that $1 was a $2.",
					default: [self, "cop"]
					},
				janday: {
					msg: "$1 is missing!",
					default: [self]
					},
				journ: {
					msg: "You received all reports that $1 received: ($2).",
					default: [self, ""]
					},
				learn: {
					msg: "You learn that $1 is a $2",
					default: [self, "cop"]
					},
				lm: {
					msg: "A loud voice was heard during the night: \"Curses! $1 woke me from my slumber!\"",
					default: [self]
					},
				lonely: {
					msg: "You spent a silent and lonely night at church. No one came to visit you.",
					default: []
					},
				love: {
					msg: "During the night, you fall in love with $1 after a romantic conversation!",
					default: [self]
					},
				lynch: {
					msg: "You feel very irritated by $1.",
					default: [self]
					},
				matin: {
					msg: "Penguins be matin'",
					default: []
					},
				message: {
					msg: "You received a message: $1",
					default: [""]
					},
				mfail: {
					msg: "No matter how much you worked your magic, $1 and $2 refuses to fall in love!",
					default: [self, self]
					},
				mlove: {
					msg: "You cast a Christmas spell on $1 and $2... they are now in love!",
					default: [self, self]
					},
				mm: {
					msg: "There might be a mastermind among you...",
					default: []
					},
				mort: {
					msg: "You learned that $1 is a $2!",
					default: [self, "villager"]
					},
				party: {
					msg: "You find yourself at a vibrant party!",
					default: []
					},
				pengi: {
					msg: "During the night a fluffy penguin visits you and tells you that " +
					"$1 is carrying a $2.",
					default: [self, self]
					},
				pengno: {
					msg: "During the night a fluffy penguin visits you and tells you that " +
					"$1 has taken no action over the course of the night.",
					default: [self]
					},
				poison: {
					msg: "You feel sick, as though you had been poisoned!",
					default: []
					},
				pop: {
					msg: "$1 feels immensely frustrated!",
					default: [self]
					},
				psy: {
					msg: "You read $1's mind... they are thinking $2 thoughts.",
					default: [self, "evil"]
					},
				psyfail: {
					msg: "You tried to read $1's mind, but something distracted you.",
					default: [self]
					},
				pvis: {
					msg: "During the night a fluffy penguin visits you and tells you that " +
					"$1 visited $2.",
					default: [self, "no one"]
					},
				pvisd: {
					msg: "During the night a fluffy penguin visits you and tells you that " +
					"$1 was visited by $2.",
					default: [self, "no one"]
					},
				santa: {
					msg: "After going out on your sleigh, you find that $1 is $2!",
					default: [self, "neither naughty nor nice"]
					},
				snoop: {
					msg: "After some snooping, you find out $1 is carrying $3 $2.",
					default: [self, "gun", "1"]
					},
				noitems: {
					msg: "After some snooping, you find out $1 is not carrying any items..",
					default: [self]
					},
				stalk: {
					msg: "Through stalking, you learned that $1 is a $2!",
					default: [self, "journalist"]
					},
				thulu: {
					msg: "You were witness to an unimaginable evil... you cannot forget... "
					+ "your mind descends into eternal hell.",
					default: []
					},
				track: {
					msg: "You followed $1 throughout the night. $1 visited $2.",
					default: [self, "no one"]
					},
				tree: {
					msg: "You became a tree!",
					default: []
					},
				trust: {
					msg: "You had a dream... you learned you can trust $1...",
					default: [self]
					},
				virgin: {
					msg: "The virgin has been sacrified!",
					default: []
					},
				voodoo: {
					msg: "$1 suddenly feels a chill and falls to the ground!",
					default: [self]
					},
				watch: {
					msg: "You watched $1 throughout the night. $2 has visited $1.",
					default: [self, "No one"]
					},
				will: {
					msg: "You read the will of $1, it reads: $2",
					default: [self, ""]
					},
				ww: {
					msg: "You devoured a human and feel very powerful... "
					+ "as though you are immortal for the day!",
					default: []
					}
				}
			}
		];

	// lobby commands
	list.lobby = [
		list.copy.sc,
		{
			name: "About",
			short: "/help",
			regex: /^(?:info|help|about) ?(.+)?/i,
			callback: function(topic) {
				if(this.topics[topic]) {
					log(this.topics[topic]);
					}
				else {
					log("You can /join games and toggle /fmt on or off (/help fmt for more info)");
					}
				},
			topics: {
				"fmt": "/fmt on enables chat formatting like displaying images for messages beginning "
				+ "with $img ($img [url])"
				}
			},
		list.copy.eval,
		list.copy.emotes,
		list.copy.fmt,
		list.copy.say,
		list.copy.join,
		list.copy.host,
		list.copy.games,
		list.copy.pm
		];

	// this is a sin
	list.bot = [
		{
			name: "Scriptcheck",
			short: "@bot sc",
			regex: /^sc|^scriptcheck/,
			callback: function(data) {
				sock.chat(ej.name + ej.vstring, data.user);
				}
			}
		];

	// utility
	function u(name) {
		return users[name || self] || u.make({
			id: 0,
			username: name || self
			});
		};
	u.make = function(data) {
		Object.assign(data, {
			name: data.username || data.user,
			emjack: null,
			role: null,
			meet: meetd.meet,
			mafia: false,
			dead: false,
			muted: false,
			kucode: 1,
			kuclock: Infinity
			});
		users[data.name] = data;
		if(data.emotes) {
			data.emotes = JSON.parse(data.emotes);
			}
		return data;
		};
	function log(message, classes) {
		var	node = document.createElement("div");
		node.className = classes ? "log emjack " + classes : "log emjack";
		typeof message === "string" ?
			node.textContent = message :
		node.appendChild(message);
		if(chat.scrollTop >= chat.scrollHeight-chat.clientHeight) {
			requestAnimationFrame(function() {
				chat.scrollTop = chat.scrollHeight;
				});
			}
		if(page === "mafia") {
			chat.appendChild(node);
			}
		else {
			chat.insertBefore(node, chat.lastChild);
			}
		};
	function request(method, url, callback) {
		var	req = new XMLHttpRequest();
		req.open(method, url, true);
		req.onreadystatechange = function(event) {
			if(this.readyState === 4) {
				callback.call(this, this.responseText);
				}
			};
		req.send();
		};
	function arand(array) {
		return array[Math.floor(Math.random()*array.length)];
		};
	function rchar(x, y) {
		return String.fromCharCode(
			x + Math.floor(Math.random()*(y-x))
			);
		};
	function sformat(string, data) {
		return string.replace(/\$(\d+)/g, function(match, i) {
			return data[i-1];
			});
		};

	// keep chat
	if(page === "mafia") {
		$("#speak_container").css("display", "initial !important");
		}

	// townie input
	var	chat = document.getElementById(page === "mafia" ? "window" : "window_i"),
		typebox = document.getElementById(page === "mafia" ? "typebox" : "chatbar");
	$(typebox).on("keydown", function(event) {
		if(event.which === 13 && this.value[0]==="/") {
			ej.run(this.value.substring(1), page === "mafia" ? list.chat : list.lobby);
			this.value = "";
			}
		});
	if(page === "mafia") {
		$("textarea.notes")
			.on("focus", function(event) {
				if(ej.settings & UNOTES && !ranked) {
					this.value = notes[$(".user_header > h2").text()];
					}
				})
			.on("keyup", function(event) {
				if(ej.settings & UNOTES && !ranked) {
					notes[$(".user_header > h2").text()] = this.value;
					}
				});
		}

	// clickables
	if(window.vocabs) {
		vocabs.push("https?://\\S + ");
		}
	window.addEventListener("click", function(event) {
		var	classList = event.target.classList;
		if(classList.contains("msg")) {
			if(ej.settings & MSGMRK) {
				var	mark = keys & K_SHIFT ? "ej_mark_alt" : "ej_mark";
				if(classList.contains(mark)) {
					classList.remove(mark);
					}
				else {
					classList.add(mark);
					classList.remove(keys & K_SHIFT ? "ej_mark" : "ej_mark_alt");
					}
				}
			}
		else if(classList.contains("acronym")) {
			if(/https?:\/\//i.test(event.target.textContent)) {
				window.open(event.target.textContent, "_blank");
				event.stopPropagation();
				}
			}
		}, true);

	// clean up
	var	last_error = null;
	$(document).on("keydown", function(event) {
		if(event.target === document.body && !event.altKey && !event.ctrlKey && !event.metaKey) {
			typebox.focus();
			}
		});
	$(document).on("click", ".roleimg.tt", function(event) {
		$(this).removeClass("tt");
		});
	$(document).on("mouseenter", ".roleimg:not(.tt, .role-unknown)", function(event) {
		if(!$(this).parents(".tip").length) {
			$(this)
				.data("type", "roleinfo")
				.data("align", "right")
				.data("roleid", this.className.match(/role-(\w+)/)[1])
				.addClass("tt")
				.trigger("mouseover");
		    }
		});
	window.addEventListener("error", function(event) {
		var	message = event.error.message;
		if(message !== last_error) {
			log("You've got error!", "bold");
			log(last_error = message);
			console.log(event);
			}
		});
	window.addEventListener("beforeunload", function(event) {
		localStorage.ejs = ej.settings;
		if(ej.settings & UNOTES && !ranked) {
			localStorage.notes = JSON.stringify(notes);
			}
		if(window.setup_id) {
			localStorage.ejsid = setup_id;
			}
		});
	window.addEventListener("keyup", function(event) {
		if(event.which === 16) {
			keys &=~ K_SHIFT;
			}
		else if(event.which === 192) {
			keys &=~ K_DEBUG;
			}
		});
	window.addEventListener("keydown", function(event) {
		if(event.ctrlKey) {
			if(event.which === 66) {
				sock.cmd("option", {
					field: "fastgame"
					});
				sock.cmd("option", {
					field: "nospectate"
					});
				}
			else if(event.which === 81) {
				ej.run("fq " + self + " " + typebox.value, list.chat);
				typebox.value = "";
				}
			}
		else if(event.target.value === undefined) {
			if(event.which === 16) {
				keys |= K_SHIFT;
				}
			else if(event.which === 192) {
				keys |= K_DEBUG;
				}
			}
		});

	}

// add node
function inject(parent, tag, type, content) {
	var	node = document.createElement(tag);
	node.type = type;
	node.appendChild(
		document.createTextNode(content)
		);
	return parent.appendChild(node);
	};

// jack in
inject(document.head, "style", "text/css", `
	.log {
	color: #bb4444;
		}
	.notop {
	margin-top: 0 !important
		}
	.ej_mark {
	background-color: rgba(250, 50, 250, 0.5);
		}
	.ej_mark_alt {
	background-color: rgba(250, 150, 0, 0.5);
		}
	.ej_highlight {
	background-color: rgba(255, 255, 0, 0.5);
		}
	.ej_img * {
	max-width: 100%;
		}
	.meet_username {
	cursor: pointer;
		}
	#lobbychat #window {
	width: 100% !important;
		}
	#lobbychat #window_i {
	width: auto !important;
		}
	`);
setTimeout(function() {
	inject(document.body, "script", "text/javascript", "(" + emjack.toString() + ")()");
	document.body.addEventListener("contextmenu", function(event) {
		event.stopPropagation();
		}, true);
	});
