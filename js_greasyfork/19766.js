// ==UserScript==
// @name			Nova's emjack
// @version			0.3.2
// @description		Nova's emjack edited version 4.5.0
// @match			https://epicmafia.com/game/*
// @namespace		https://greasyfork.org/en/users/44219-kinoronan-channel
// @downloadURL https://update.greasyfork.org/scripts/19766/Nova%27s%20emjack.user.js
// @updateURL https://update.greasyfork.org/scripts/19766/Nova%27s%20emjack.meta.js
// ==/UserScript==

// welcome back
function emjack() {

	// minigame : break
	if(!window.setup_id) return;

	// yadayada
	var	alive=true,
		afk=false,
		meetd={},
		meets={},
		master="",
		autobomb="",
		highlight="",
		roulette=0,
		kicktimer=0,
		canpoke=true,
		keys=0,
		auth=false,
		notes=null,
		users={},
		round={};
	var	ANTIDC=0x0001,
		AUKICK=0x0002,
		AUWILL=0x0004,
		AUBOMB=0x0008,
		OBEYME=0x0010,
		UNOTES=0x0020,
		DEVLOG=0x0040,
		JEEVES=0x0080,
		SYSALT=0x0100;
		MULMRK=0x0200;
	var	K_DEBUG=0x0004,
		K_SHIFT=0x0008;

	// public
	var	user=window.user || "",
		ranked=window.ranked || false,
		game_id=window.game_id || 0,
		setup_id=window.setup_id || 0,
		_emotes=window._emotes || {},
		lobby_emotes=window.lobby_emotes || {};
	window.ej={
		name: "emjack",
		version: 0x2d,
		vstring: "4.5.0",
		cmds: {},
		notes: localStorage.notes ?
			JSON.parse(localStorage.notes) : {},
		users: users,
		settings: +localStorage.ejs || AUKICK | AUWILL | UNOTES,
		};
	notes=ej.notes;
	afk=(ej.settings & JEEVES)===JEEVES;

	// plug in
	var	sock={ socket: null },
		postjackl=[];
	function postjack() {
		var	args=[];
		for(var i=0; i<arguments.length-1; i++) {
			args[i]=arguments[i];
			}
		postjackl.push(args, arguments[i]);
		};
	function postjack_run() {
		while(postjackl.length) {
			postjackl.pop().apply(null, postjackl.pop());
			}
		};
	WebSocket.prototype.send=function(initial) {
		return function() {
			if(sock.socket!==this) {
				sock.build(this);
				}
			arguments[0]=sock.intercept(arguments[0]);
			initial.apply(this, arguments);
			};
		}(WebSocket.prototype.send);

	// socket
	sock.build=function(socket) {
		this.socket=socket;
		log("", "rt emote emote-"+_emotes[arand(Object.keys(_emotes))]);
		log(ej.name+ej.vstring+" connected", "rt");
		log((ej.settings|65536).toString(2).substring(1));
		socket.onmessage=function(initial) {
			return function(event) {
				sock.handle(event.data, event);
				if(alive) {
					initial.apply(this, arguments);
					setTimeout(postjack_run, 200);
					}
				};
			}(socket.onmessage)
		};
	sock.handle=function(data, event) {
		try {
			data=JSON.parse(data);
			}
		catch(error) {
			data=null;
			}
		if(data) for(var i=0, real=null; i<data.length; i++) {
			real=sock.parseShort(data[i][0], data[i][1]);
			if(ej.settings & DEVLOG) {
				console.log(" > %s:", real[0], real[1]);
				}
			if(ej.cmds[real[0]]) {
				ej.cmds[real[0]].call(ej, real[1], event);
				}
			else if(real[0][0]==="~") {
				ej.cmds["~"].call(ej, real[0], event);
				}
			}
		};
	sock.intercept=function(data) {
		if(data[0]==="[") {
			try {
				data=JSON.parse(data);
				}
			catch(error) {
				return data;
				}
			if(ej.settings & DEVLOG) {
				console.log(" < %s:", data[0], data[1]);
				}
			if(ej.cmdi[data[0]]) {
				return JSON.stringify([data[0],
					ej.cmdi[data[0]](data[1])
					]);
				}
			return JSON.stringify(data);
			}
		return data;
		};
	sock.parseShort=function(cmd, data) {
		var	rfmt=this.short[cmd];
		if(rfmt) {
			if(data) for(var key in rfmt.data) {
				data[key]=data[rfmt.data[key]] || data[key];
				// delete data[rfmt.data[key]];
				}
			return [rfmt.cmd, data];
			}
		else {
			return [cmd, data];
			}
		};
	sock.short=function(short) {
		var	rfmt={};
		for(var i=0, data=null; i<short.length; i++) {
			data=short[i];
			rfmt[data.alias || data.cmd]={
				cmd: data.cmd || data.alias,
				data: data.data
				};
			}
		return rfmt;
		}(window.shorten);
	sock.cmd=function(cmd, data) {
		if(sock.socket) {
			sock.socket.send(
				JSON.stringify([cmd, data])
				);
			}
		};
	sock.chat=function(message, data) {
		if(typeof data==="object") {
			data.msg=message;
			data.meet=data.meet || meetd.meet;
			sock.cmd("<", data);
			}
		else sock.cmd("<", {
			meet: meetd.meet,
			msg: data ? "@"+data+" "+message : message
			});
		};
	sock.vote=function(vote, meeting) {
		sock.cmd("point", {
			meet: meeting || meetd.meet,
			target: vote
			});
		};
	sock.dcthen=function(callback) {
		alive=false;
		ej.redirect_back=callback;
		sock.cmd("leave");
		WebSocket.prototype.send=function() {};
		};

	// packets
	ej.cmdi={
		"$MODIFY": function(data) {
			for(var key in data) {
				data[key]=prompt(key, data[key]);
				}
			return data;
			},
		"join": function(data) {
			if(keys & K_DEBUG) {
				keys^=K_DEBUG;
				return ej.cmdi.$MODIFY(data);
				}
			return data;
			}
		};
	ej.cmds={
		"~": function(data) {
			if(round.state && !ranked) {
				if(ej.settings & 0x8000 && !meetd.say && round.state&1===0) {
					log("Someone is talking...");
					}
				}
			},
		"auth": function(data) {
			// owner spectate
			var	ofg=document.querySelector("#option_fastgame"),
				ons=document.querySelector("#option_nospectate");
			if(ofg && !ofg.classList.contains("sel")) {
				ofg.classList.add("sel");
				sock.cmd("option", {
					field: "fastgame"
					});
				}
			if(ons && !ons.classList.contains("sel")) {
				ons.classList.add("sel");
				sock.cmd("option", {
					field: "nospectate"
					});
				}
			postjack(data, function(data) {
				auth=true;
				ku.send(0, Math.round(ej.version-42));
				});
			},
		"options": function(data) {
			// data {anonymous closedroles ... time whisper}
			},
		"round": function(data) {
			// state
			round=data;
			canpoke=true;
			if(auth && data.state===1) {
				if(ej.settings & AUWILL && !ranked) {
					postjack(data, function(data) {
						log("Wrote will.", "lastwill");
						sock.cmd("will", {
							msg: user+"."+u(user).role
							});
						});
					}
				}
			},
		"users": function(data) {
			// chatters users
			for(var x in data.users) {
				u.make(data.users[x]);
				}
			postjack(data, function(data) {
				var	node=null;
				for(var x in data.users) {
					if(node=document.querySelector("[data-uname='"+x+"']")) {
						node.setAttribute("title", notes[x] || "no notes for "+x);
						}
					}
				});
			},
		"left": function(data) {
			// left
			for(var i=0; i<data.left.length; i++) {
				u(data.left[i]).dead=true;
				}
			},
		"anonymous_players": function(data) {
			// players
			for(var x in users) {
				delete users[x];
				}
			for(var i=0; i<data.players.length; i++) {
				u.make(data.players[i]);
				}
			},
		"anonymous_reveal": function(data) {
			// mask user
			if(data.user===user) {
				u.make(u(this.mask));
				}
			},
		"join": function(data) {
			// data user
			u.make(data.data);
			log(data.user+" has joined");
			if(ej.settings & AUKICK && /autokick/i.test(notes[data.user])) {
				postjack(data.data.id, function(id) {
					sock.cmd("ban", {
						uid: id
						});
					});
				}
			else {
				postjack(data.user, function(user) {
					var	node=document.querySelector("[data-uname='"+user+"']");
					if(node) {
						node.setAttribute("title", notes[user] || "no notes for "+user);
						}
					});
				}
			},
		"leave": function(data) {
			// user
			if(!data.user) {
				data.user=data.u;
				}
			log(data.user+" has left");
			delete users[data.user];
			},
		"kick": function(data) {
			// deranked suicide user
			u(data.user).dead=true;
			for(var x in meetd.votes) {
				if(meetd.votes[x]===data.user) {
					data.unpoint=true;
					ej.cmds.point(data);
					}
				}
			},
		"kill": function(data) {
			// target
			u(data.target).dead=true;
			},
		"k": function(data) {
			ku.recv(u(data.user || data.u), 1, Date.now());
			},
		"u": function(data) {
			ku.recv(u(data.user || data.u), 0, Date.now());
			},
		"<": function(data) {
			// meet msg t user whisper
			if(data.user===highlight) {
				postjack(function() {
					var	nodes=document.querySelectorAll(".talk");
					if(nodes.length) {
						nodes[nodes.length-1].classList.add("ej_highlight");
						}
					});
				}
			if(auth && !ranked) {
				if(ej.settings & OBEYME) {
					if(data.msg[0]==="@") {
						var	target=data.msg.replace(/@(\w+).+/, "$1"),
							message=data.msg.replace(/@\w+ (.+)/, "$1");
						if(target===user) {
							ej.run(message, ej.lbot, data);
							}
						}
					}
				else if(roulette && data.msg==="@"+user+" roulette") {
					ej.run("roulette", ej.lbot, data);
					}
				}
			},
		"msg": function() {
			var	altmsg=[
				{
					msg: /(\w+) did not leave a will!/,
					alt: [
						"$1 did not leave a will!",
						"$1 never learned to write!",
						"$1 was illiterate!",
						]
					}
				];
			return function(data, event) {
				// msg type
				for(var i=0, match=null; i<altmsg.length; i++) {
					match=altmsg[i].msg.exec(data.msg);
					if(match!==null) {
						event.data=event.data.replace(
							RegExp(match.shift(), "m"),
							sformat(arand(altmsg[i].alt), match)
							);
						break;
						}
					}
				};
			}(),
		"speech": function(data) {
			// data type
			if(data.type==="contact") {
				postjack(data, function(data) {
					log("The roles are... "+data.data.join(", "));
					});
				}
			},
		"meet": function(data) {
			// basket choosedata data disguise disguise_choices exist
			// meet members raw_name say votenoone votesee voteself votetype
			data.tally={};
			data.votes={};
			meets[data.meet]=data;
			if(data.say || !meetd.meet) {
				meetd=data;
				for(var i=0; i<data.members.length; i++) {
					u(data.members[i]).meet=data.meet;
					}
				}
			for(var i=0; i<data.basket.length; i++) {
				data.tally[data.basket[i]]=0;
				}
			for(var i=0; i<data.members.length; i++) {
				data.votes[data.members[i]]="";
				}
			if(data.non_voting) {
				for(var i=0; i<data.non_voting.length; i++) {
					data.votes[data.non_voting[i]]="*";
					}
				}
			if(data.disguise && ej.settings & 0x8000) {
				for(var x in data.disguise) {
					postjack(x, data.disguise[x], function(fake, name) {
						log(fake+" is "+name);
						});
					}
				}
			switch(data.meet) {
				case "mafia":
					if(auth && !data.disguise && !ranked) {
						if(false/* ej.settings & OBEYME */) {
							postjack(user, function(data) {
								sock.chat(u(data).role, {
									meet: "mafia"
									});
								});
							}
						}
				case "thief":
					u(user).mafia=true;
					for(var x in users) {
						if(!data.choosedata[x] && !u(x).dead) {
							u(x).mafia=true;
							if(x!==user) postjack(x, function(data) {
								log(data+" is your partner!");
								if(u(x).id) {
									document.querySelector("[data-uname='"+data+"'] .roleimg")
										.className="roleimg role-mafia";
									}
								});
							}
						}
					break;
				}
			},
		"end_meet": function(data) {
			// meet
			if(data.meet===meetd.meet) {
				meetd={};
				}
			delete meets[data.meet];
			for(var x in users) {
				if(users[x].meet===data.meet) {
					if(!users[x].id) {
						delete users[x];
						}
					else if(data.say) {
						users[x].meet="";
						}
					}
				}
			},
		"event": function(data) {
			// id
			},
		"point": function(data) {
			// meet target unpoint user
			var	meet=meets[data.meet];
			if(meet) {
				if(data.unpoint) {
					meet.tally[data.target]--;
					meet.votes[data.user]="";
					}
				else {
					if(meet.votes[data.user]) {
						meet.tally[meet.votes[data.user]]--;
						}
					meet.tally[data.target]++;
					meet.votes[data.user]=data.target;
					}
				}
			},
		"reveal": function(data) {
			// data red user
			u(data.user).role=data.data;
			if(!u(data.user).dead) {
				if(data.user===user) {
					postjack(data, function(data) {
						log(data.user===user ?
							"Your role is now "+data.data :
							data.user+" is a "+data.data
							);
						});
					}
				}
			},
		"disguise": function(data) {
			// exchange
			},
		"countdown": function(data) {
			// start totaltime
			if(auth && !ranked) {
				clearTimeout(kicktimer);
				kicktimer=setTimeout(function() {
					jeeves.work();
					sock.cmd("kick");
					}, data.totaltime);
				}
			},
		"kickvote": function() {
			clearTimeout(kicktimer);
			if(!ranked) {
				jeeves.work();
				sock.cmd("kick");
				}
			},
		"start_input": function(data) {
			// id
			if(afk || autobomb || ej.settings & AUBOMB) {
				postjack(data, function(data, names) {
					sock.cmd("input", {
						id: data.id,
						input: {
							player: autobomb || arand(Object.keys(
								meetd.members || users
								))
							}
						});
					});
				}
			},
		"redirect": function(data) {
			if(!alive && ej.redirect_back) {
				ej.redirect_back();
				ej.redirect_back=null;
				}
			}
		};

	// kucode
	var	ku={};
	ku.send=function(op, code) {
		code+=op<<6;
		if(ej.settings & DEVLOG) {
			log(" * "+user+": "+(code|1024).toString(2).substring(1));
			}
		setTimeout(function() {
			for(var i=9; i>=0; i--) {
				sock.cmd(code>>i & 1 ? "k" : "u");
				}
			if(code & 1) {
				sock.cmd("u");
				}
			}, 200);
		};
	ku.recv=function(u, bit, time) {
		if(time-u.kuclock > 100) {
			u.kucode=1;
			u.kuclock=Infinity;
			}
		else {
			u.kucode<<=1;
			u.kucode|=bit;
			if(u.kucode & 1024) {
				if(ej.settings & DEVLOG) {
					log(" * "+u.name+": "+u.kucode.toString(2).substring(1));
					}
				if(ku.op[u.kucode>>6 & 15]) {
					ku.op[u.kucode>>6 & 15]
						(u, u.kucode & 63);
					}
				u.kucode=1;
				u.kuclock=Infinity;
				}
			else {
				u.kuclock=time;
				}
			}
		};
	ku.op=[
		function(u, code) {
			if(u.emjack===null) {
				u.emjack=(42+code)/10 || 0;
				ku.send(0, Math.round(ej.version-42));
				}
			},
		function(u, code) {
			ku.send(0, Math.round(ej.version-42));
			},
		function(u, code) {
			if(ej.settings & 0x8000) {
				log(u.name+" sent "
					+(code|64).toString(2).substring(1)
					+":"+code.toString()
					+":"+String.fromCharCode(code+96)
					);
				}
			},
		function(u, code) {
			log("You've been poked!");
			}
		];

	// jeeves
	var	jeeves={};
	jeeves.work=function() {
		if(afk && !ranked) {
			for(var x in meets) {
				if(!meets[x].votes[user]) {
					jeeves.think(meets[x]);
					}
				}
			}
		};
	jeeves.think=function(meet) {
		for(var x in meet.tally) {
			if(Math.random() < meet.tally[x]/meet.members.length) {
				sock.vote(x, meet.meet);
				break;
				}
			}
		if(!meet.votes[user]) {
			sock.vote(arand(meet.basket || Object.keys(users)), meet.meet);
			}
		};

	// chat base
	ej.run=function(input, list, data) {
		for(var i=0, match=null; i<list.length; i++) {
			match=list[i].regex.exec(input);
			if(match!==null) {
				data ? match[0]=data : match.shift();
				list[i].callback.apply(list[i], match);
				break;
				}
			}
		};

	// chat commands
	ej.lchat=[
		{
			name: "Scriptcheck",
			short: "/sc",
			regex: /^sc|^scriptcheck/,
			callback: function() {
				log(ej.name+ej.vstring);
				}
			},
		{
			name: "Native",
			regex: /^(me .+)/,
			callback: function(msg) {
				sock.chat("/"+msg);
				}
			},
		{
			name: "About",
			short: "/help",
			regex: /^(?:info|help|about) ?(.+)?/,
			callback: function(topic) {
				if(this.topics[topic]) {
					log(ej.name+ej.vstring+":"+topic, "bold");
					for(var i=0; i<this.topics[topic].length; i++) {
						log(this.topics[topic][i]);
						}
					}
				else {
					log(ej.name+ej.vstring, "bold");
					log("Type /cmdlist for a list of commands");
					log("Topics (type /help [topic]): ", "lt notop");
					log(Object.keys(this.topics).join(", "), "tinyi");
					}
				},
			topics: {
				"features": [
					"The following passive features are always active...",
					"Auto-check boxes \u2767 Clickable links \u2767 Mark mafia partners \u2767 "+
					"List agent/spy roles \u2767 Auto-focus & keep chat open \u2767 "+
					"Automatically write will (/autowill to toggle) \u2767 etc."
					],
				"jeeves": [
					"Type /afk to toggle Jeeves or /afk [on/off] to toggle in all games",
					"Jeeves will automatically vote for you at the end of the day if you haven't "+
					"voted already. He randomly picks a player based on the popular vote (if any)"
					],
				"marking": [
					"Click on a message to (un)mark it purple (shift+click for orange)"
					],
				"ranked": [
					"The following features are disabled in ranked games...",
					"Auto will \u2767 Auto kick \u2767 Jeeves (afk) \u2767 Fake quoting & reporting \u2767 "+
					"Will & death message editing \u2767 Bot mode \u2767 Persistent user notes"
					],
				"hotkeys": [
					"Ctrl+B: Toggle boxes",
					"Ctrl+Q: Quote typed message as yourself"
					]
				}
			},
		{
			name: "Evaluate",
			regex: /^eval (.+)/,
			callback: function(input) {
				log(JSON.stringify(eval(input)) || "undefined");
				}
			},
		{
			name: "Clear chat/logs",
			regex: /^clear( logs)?/,
			callback: function(_logs) {
				var	nodelist=_logs ?
						document.querySelectorAll("#window .emjack") :
						chat.children;
				for(var i=0; i<nodelist.length; i++) {
					nodelist[i].parentElement.removeChild(nodelist[i]);
					}
				}
			},
		{
			name: "Get metadata",
			regex: /^meta(?:data)?/,
			callback: function() {
				for(var param in ej.meta) {
					log("@"+param+": "+ej.meta[param]);
					}
				}
			},
		{
			name: "Get whois",
			short: "/whois [name]",
			regex: /^whois ?(.+)?/,
			callback: function(name) {
				if(!name) {
					log("Type "+this.short);
					}
				else if(users[name]) {
					log(users[name].name+" ("+users[name].id+") "+(
						isNaN(users[name].emjack) ? "" : "ej"+users[name].emjack
						), "bold");
					log("emotes: "+(
						users[name].emotes ?
							Object.keys(users[name].emotes).join(" ") || "none found" :
							"does not own"
						));
					}
				else {
					log("Can't find '"+name+"'");
					}
				}
			},
		{
			name: "Get emotes",
			short: "/emotes",
			regex: /^emotes/,
			callback: function() {
				log("Sitewide emotes", "bold");
				log(Object.keys(_emotes).join(" ") || "none found");
				log("Lobby emotes", "bold");
				log(Object.keys(lobby_emotes).join(" ") || "none found");
				}
			},
		{
			name: "Get role info",
			short: "/role",
			regex: /^role ?(.+)?/,
			callback: function(id) {
				id=id ? id.toLowerCase() : u(user).role;
				request("GET", "/role/"+id+"/info/roleid", function(data) {
					if(data) {
						var	div=document.createElement("div");
						div.innerHTML=data;
						log("// retrieved", "rt bold notop");
						log(div);
						}
					else {
						log("Cannot find role '"+id+"'");
						}
					});
				}
			},
		{
			name: "Get command list",
			short: "/cmdlist [bot]",
			regex: /^cmdlist ?(bot)?/,
			callback: function(_bot) {
				var	data=(_bot ? ej.lbot : ej.lchat);
				for(var i=0; i<data.length; i++) {
					if(data[i].short) {
						log(data[i].name, "rt bold notop");
						log(" :: "+data[i].short);
						}
					}
				}
			},
		{
			name: "Toggle Jeeves",
			short: "/afk",
			regex: /^afk( on| off)?/,
			callback: function(state) {
				if(state===" on") {
					ej.settings|=JEEVES;
					afk=true;
					}
				else if(state===" off") {
					ej.settings&=~JEEVES;
					afk=false;
					}
				else afk=!afk;
				log(afk ?
					"Jeeves will handle it all..." :
					"Jeeves has left the building"
					);
				}
			},
		{
			name: "Toggle autowill",
			short: "/autowill",
			regex: /^aw|^autowill/,
			callback: function() {
				ej.settings^=AUWILL;
				log(ej.settings & AUWILL ?
					"Name & role will be written in will by default." :
					"Disabled autowill."
					);
				}
			},
		{
			name: "Toggle autokick",
			short: "/autokick",
			regex: /^ak|^autokick/,
			callback: function() {
				ej.settings^=AUKICK;
				log(ej.settings & AUKICK ?
					"Note-based autokick enabled." :
					"Disabled autokick."
					);
				}
			},
		{
			name: "Toggle multi-mark",
			regex: /^multimark/,
			callback: function() {
				ej.settings^=MULMRK;
				log(ej.settings & MULMRK ?
					"Messages can be marked in orange or purple." :
					"Messages will only be marked in purple. (no quoting issues)"
					);
				}
			},
		{
			name: "Toggle dev logs",
			regex: /^dev/,
			callback: function() {
				ej.settings^=DEVLOG;
				log(ej.settings & DEVLOG ?
					"Logging debug data." :
					"Logging disabled."
					);
				}
			},
		{
			name: "Toggle maidmode",
			regex: /^maid/,
			callback: function() {
				ej.settings^=OBEYME;
				log(ej.settings & OBEYME ?
					"*puts on maid outfit*. welcome to Nova's emjack! type /maid again to disable" :
					"*takes off maid outfit*. you are free!"
					);
				}
			},
		{
			name: "Poke",
			short: "/poke",
			regex: /^poke/,
			callback: function() {
				if(canpoke) {
					canpoke=false;
					ku.send(3, 0);
					log("Sent a poke.");
					}
				else {
					log("Your finger is tired.");
					}
				}
			},
		{
			name: "Ping ku",
			regex: /^ku ?(.+)?/,
			callback: function(code) {
				if(ej.settings & 0x8000) {
					code=code ? parseInt(code, 2) || +code || code.charCodeAt(0)-96 : 0;
					ku.send(2, code ?
						parseInt(code, 2) || +code || code.charCodeAt(0)-96 : 0
						);
					}
				}
			},
		{
			name: "Request",
			regex: /^req/,
			callback: function() {
				if(ej.settings & 0x8000) {
					ku.send(1, 0);
					}
				}
			},
		{
			name: "Jackers",
			short: "/jax",
			regex: /^jax/,
			callback: function() {
				var	ulist=[];
				for(var x in users) {
					if(users[x].emjack!==null) {
						ulist.push(x+" ("+users[x].emjack+")");
						}
					}
				log(ulist.join(", ") || "no jax");
				}
			},
		{
			name: "Send message",
			short: "/say [message]",
			regex: /^say ?(\w+)?/,
			callback: function(msg) {
				if(!msg) {
					log("Type "+this.short);
					}
				else {
					sock.chat(msg);
					}
				}
			},
		{
			name: "Send whisper",
			short: "/w [name] [message]",
			regex: /^w\b(?: (\w+) (.+))?/,
			callback: function(to, msg) {
				if(!to || !users[to]) {
					log("Type "+this.short);
					}
				else {
					sock.chat(msg, {
						whisper: true,
						target: to
						});
					}
				}
			},
		{
			name: "Send ping",
			short: "/ping [all]",
			regex: /^ping ?(all)?/,
			callback: function(all) {
				var	pingees=[];
				for(var x in meetd.votes) {
					if(!meetd.votes[x] && !u(x).dead && u(x).id) {
						pingees.push(x);
						}
					}
				sock.chat(pingees.join(" "));
				}
			},
		{
			name: "Send kick",
			short: "/kick [name]",
			regex: /^kick ?(\w+)?/,
			callback: function(name) {
				if(!name) {
					log("Type "+this.short);
					}
				else {
					sock.cmd("ban", {
						uid: u(name).id
						});
					}
				}
			},
		{
			name: "Send vote",
			short: "/vote [name] or /nl",
			regex: /^vote ?(\w+)?/,
			callback: function(name) {
				sock.vote(name ?
					name==="no one" || name==="nl" ? "*" :
					name==="*" ? "" : name : arand(
						meetd.basket ? meetd.basket : Object.keys(users)
						)
					);
				}
			},
		{
			name: "Send vote (nl)",
			regex: /^nl/,
			callback: function() {
				sock.vote("*");
				}
			},
		{
			name: "Send vote (gun)",
			short: "/shoot [name]",
			regex: /^shoot ?(\w+)?/,
			callback: function(name) {
				sock.vote(name || "*", "gun");
				}
			},
		{
			name: "Highlight messages by user",
			short: "/highlight [name]",
			regex: /^(?:h\b|hl|highlight) ?(\w+)?/,
			callback: function(name) {
				if(!name) {
					if(!highlight) {
						log("Type "+this.short);
						}
					else {
						highlight="";
						var	nodes=document.querySelectorAll(".ej_highlight");
						for(var i=0; i<nodes.length; i++) {
							nodes[i].parentElement.parentElement.classList.remove("ej_highlight");
							}
						log("Removed highlighting");
						}
					}
				else {
					highlight=name;
					var	nodes=document.querySelectorAll(".talk_username[value='"+name+"']");
					for(var i=0; i<nodes.length; i++) {
						nodes[i].parentElement.parentElement.classList.add("ej_highlight");
						}
					log("Highlighting "+name+"'s messages");
					}
				}
			},
		{
			name: "Leave game",
			short: "/leave",
			regex: /^leave|^quit/,
			callback: function(name) {
				sock.cmd("leave");
				}
			},
		{
			name: "Lobby join (or host)",
			short: "/join [host]",
			regex: /^join ?(host.+)?/,
			callback: function(host) {
				request("GET", "/game/find?page=1", function(data) {
					log("// retrieved", "rt bold notop");
					JSON.parse(JSON.parse(data)[1]).data.forEach(function(table) {
						if(!table.status_id && !table.password) {
							if(table.target===12 && table.id!==game_id) {
								sock.dcthen(function() {
									location.href="/game/"+table.id;
									});
								}
							}
						});
					if(alive) {
						log("No games found.");
						if(host) {
							ej.run(host, ej.lchat);
							}
						}
					});
				}
			},
		{
			name: "Lobby host",
			short: "/host [title]",
			regex: /^host ?(.+)?/,
			callback: function(title) {
				log("Hosting setup#"+setup_id+"...");
				sock.dcthen(function() {
					request("GET", sformat(
						"/game/add/mafia?setupid=$1&ranked=$2&add_title=$3&game_title=$4",
						[setup_id, false, title===undefined?0:1, title]
						), function(data) {
							location.href="/game/"+JSON.parse(data)[1].table;
							}
						);
					});
				}
			},
		{
			name: "Lobby games",
			short: "/games",
			regex: /^games/,
			callback: function() {
				request("GET", "/game/find?page=1", function(data) {
					var	a, div;
					log("// retrieved", "rt bold notop");
					JSON.parse(JSON.parse(data)[1]).data.forEach(function(table) {
						if(table.status_id || table.password) {
							return;
							}
						a=document.createElement("a");
						a.textContent="Table "+table.id;
						a.addEventListener("click", function(event) {
							sock.dcthen(function() {
								location.href="/game/"+table.id;
								});
							});
						div=document.createElement("div");
						div.appendChild(a);
						div.appendChild(
							document.createTextNode(" - "+table.numplayers+" / "+table.target+" players")
							);
						if(table.id===game_id) {
							div.appendChild(
								document.createTextNode(" (you)")
								);
							}
						log(div);
						});
					});
				}
			},
		{
			name: "Bugs, suggestions & spam",
			short: "/pm [message] (to cub)",
			regex: /^pm ?(.+)?/,
			callback: function(msg) {
				if(!msg) {
					log("Type "+this.short);
					}
				else {
					request("POST", sformat(
						"/message?msg=$1&subject=$2&recipients[]=$3",
						[msg, encodeURIComponent(
							rchar(9812, 9824)+" emjack | "+msg.substring(0, 9)+"..."
							), 217853]
						), function(data) {
							log(+data[1] ?
								"Sent probably." :
								"Carrier pigeon was killed before reaching recipient."
								);
							}
						);
					}
				}
			},
		{
			name: "[Naughty] Will",
			regex: /^will ?(.+)?/,
			callback: function(will) {
				if(ranked) {
					log("Disabled in ranked games.");
					}
				else if(ej.settings & 0x8000) {
					log("You revised your will.", "lastwill");
					sock.cmd("will", {
						msg: will || ""
						});
					}
				}
			},
		{
			name: "[Naughty] Death Message",
			regex: /^dm (.+)?/,
			callback: function(msg) {
				if(ranked) {
					log("Disabled in ranked games.");
					}
				else /* if(ej.settings & 0x8000) */ {
					if(/\(name\)/i.test(msg)) {
						request("/user/edit_deathmessage?deathmessage="+encodeURIComponent(msg),
							function(response) {
								log("Changed death message to '"+msg.replace(/\(name\)/ig, user)+"'");
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
			regex: /^(?:dt|thulu) (.+)/,
			callback: function(message) {
				if(ranked) {
					log("Disabled in ranked games.");
					}
				else /* if(ej.settings & 0x8000) */ {
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
			regex: /^(?:fq|quote) (\w+) (.+)/,
			callback: function(who, message) {
				if(ranked) {
					log("Disabled in ranked games.");
					}
				else /* if(ej.settings & 0x8000) */ {
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
			regex: /^(?:ab|autobomb) ?(\w+)?/,
			callback: function(name) {
				if(ranked) {
					log("Disabled in ranked games.");
					}
				else /* if(ej.settings & 0x8000) */ {
					if(false/* name */) {
						autobomb=name;
						ej.settings|=AUBOMB;
						log("Passing the bomb to "+name);
						}
					else {
						autobomb="";
						ej.settings^=AUBOMB;
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
			regex: /^f(s)? ?(\w+)? ?(.+)?/,
			callback: function(send, id, input) {
				if(ranked) {
					log("Disabled in ranked games.");
					}
				else /* if(ej.settings & 0x8000) */ {
					var	output=this.messages[id];
					if(!output) {
						log("System messages: "+Object.keys(this.messages).join(", "));
						}
					else {
						var	i=0, args=output.default;
						if(input) {
							args=[];
							while(args.length < output.default.length) {
								if(input) {
									if(args.length===output.default.length-1) {
										args.push(input);
										}
									else {
										i=input.search(/ |$/);
										args.push(input.substring(0, i));
										input=input.substring(i+1);
										}
									}
								else {
									args.push(output.default[args.length]);
									}
								}
							console.log(args);
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
						+"You feel you must protect $1 with your life.",
					default: [user]
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
					default: [user, user]
					},
				carol: {
					msg: "You see a merry Caroler outside your house! "
						+"They sing you a Carol about $1, $2, $3. At least one of which is the Mafia!",
					default: [user, user, user]
					},
				chef: {
					msg: "You find yourself in a dimly lit banquet! "
						+"You sense the presence of a masked guest. The guest appears to be a $1.",
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
					default: [user, "mafia"]
					},
				cry: {
					msg: "Someone cries out | $1",
					default: [""]
					},
				det: {
					msg: "Through your detective work, you learned that $1 is a $2!",
					default: [user, "ninja"]
					},
				disc: {
					msg: "You discover that $1 is the $2!",
					default: [user, "interceptor"]
					},
				dream: {
					msg: "You had a dream... where at least one of $1, $2, $3 is a mafia...",
					default: [user, user, user]
					},
				fire: {
					msg: "Somebody threw a match into the crowd! "+
						"$1 suddenly lights on fire and burns to a crisp!",
					default: [user]
					},
				firefail: {
					msg: "Somebody threw a match into the crowd!",
					default: []
					},
				guise: {
					msg: "You are now disguised as $1.",
					default: [user]
					},
				guised: {
					msg: "$1 has stolen your identity!",
					default: [user]
					},
				gun: {
					msg: "You hear a gunshot!",
					default: []
					},
				gunfail: {
					msg: "$1 reveals a gun! The gun backfires!",
					default: [user]
					},
				gunhit: {
					msg: "$1 reveals a gun and shoots $2!",
					default: [user, user]
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
					default: [user, "cop"]
					},
				janday: {
					msg: "$1 is missing!",
					default: [user]
					},
				journ: {
					msg: "You received all reports that $1 received: ($2).",
					default: [user, ""]
					},
				learn: {
					msg: "You learn that $1 is a $2",
					default: [user, "cop"]
					},
				lm: {
					msg: "A loud voice was heard during the night: \"Curses! $1 woke me from my slumber!\"",
					default: [user]
					},
				lonely: {
					msg: "You spent a silent and lonely night at church. No one came to visit you.",
					default: []
					},
				love: {
					msg: "During the night, you fall in love with $1 after a romantic conversation!",
					default: [user]
					},
				lynch: {
					msg: "You feel very irritated by $1.",
					default: [user]
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
					default: [user, user]
					},
				mlove: {
					msg: "You cast a Christmas spell on $1 and $2... they are now in love!",
					default: [user, user]
					},
				mm: {
					msg: "There might be a mastermind among you...",
					default: []
					},
				mort: {
					msg: "You learned that $1 is a $2!",
					default: [user, "villager"]
					},
				party: {
					msg: "You find yourself at a vibrant party!",
					default: []
					},
				pengi: {
					msg: "During the night a fluffy penguin visits you and tells you that "+
						"$1 is carrying a $2.",
					default: [user, user]
					},
				pengno: {
					msg: "During the night a fluffy penguin visits you and tells you that "+
						"$1 has taken no action over the course of the night.",
					default: [user]
					},
				poison: {
					msg: "You feel sick, as though you had been poisoned!",
					default: []
					},
				pop: {
					msg: "$1 feels immensely frustrated!",
					default: [user]
					},
				psy: {
					msg: "You read $1's mind... they are thinking $2 thoughts.",
					default: [user, "evil"]
					},
				psyfail: {
					msg: "You tried to read $1's mind, but something distracted you.",
					default: [user]
					},
				pvis: {
					msg: "During the night a fluffy penguin visits you and tells you that "+
						"$1 visited $2.",
					default: [user, "no one"]
					},
				pvisd: {
					msg: "During the night a fluffy penguin visits you and tells you that "+
						"$1 was visited by $2.",
					default: [user, "no one"]
					},
				santa: {
					msg: "After going out on your sleigh, you find that $1 is $2!",
					default: [user, "neither naughty nor nice"]
					},
				snoop: {
					msg: "After some snooping, you find out $1 is carrying $3 $2.",
					default: [user, "gun", "1"]
					},
				snoop0: {
					msg: "After some snooping, you find out $1 is not carrying any items..",
					default: [user]
					},
				stalk: {
					msg: "Through stalking, you learned that $1 is a $2!",
					default: [user, "journalist"]
					},
				thulu: {
					msg: "You were witness to an unimaginable evil... you cannot forget... "
						+"your mind descends into eternal hell.",
					default: []
					},
				track: {
					msg: "You followed $1 throughout the night. $1 visited $2.",
					default: [user, "no one"]
					},
				tree: {
					msg: "You became a tree!",
					default: []
					},
				trust: {
					msg: "You had a dream... you learned you can trust $1...",
					default: [user]
					},
				virgin: {
					msg: "The virgin has been sacrified!",
					default: []
					},
				voodoo: {
					msg: "$1 suddenly feels a chill and falls to the ground!",
					default: [user]
					},
				watch: {
					msg: "You watched $1 throughout the night. $2 has visited $1.",
					default: [user, "No one"]
					},
				will: {
					msg: "You read the will of $1, it reads: $2",
					default: [user, ""]
					},
				ww: {
					msg: "You devoured a human and feel very powerful... "
						+"as though you are immortal for the day!",
					default: []
					}
				}
			}
		];

	// this is a sin
	ej.lbot=[
		{
			name: "Scriptcheck",
			short: "@bot sc",
			regex: /^sc|^scriptcheck/,
			callback: function(data) {
				sock.chat(ej.name+ej.vstring, data.user);
				}
			},
		{
			name: "Echo",
			regex: /^(?:echo|say) (.+)/,
			callback: function(data, what) {
				if(ej.settings & 0x4000) {
					sock.chat(what);
					}
				}
			},
		{
			name: "Do Command",
			regex: /^(eval .+)/,
			callback: function(data, what) {
				if(ej.settings & 0x4000) {
					ej.run(what, ej.lchat);
					}
				}
			},
		{
			name: "Say hi",
			short: "@bot hi",
			regex: /(\bhi|\bhey|\bhel+o)/i,
			callback: function(data, $1, $2, $3) {
				sock.chat(arand(
					$1 || Math.random()>0.3 ? this.response1 :
					$2 || Math.random()>0.3 ? this.response2 :
					this.response3
					), data.user);
				},
			response1: [
				"h\0i! long time no see!", "h-h\0i... *blushes*", "h\0eyyy h\0ow a\0re y\0ou doing?", "and a h\0i to you too!", "haha h\0i", "omgg h\0iiii ^_^", "h\0ello. it's nice today, isn't it?", "yes h\0ello. h\0i~"
				],
            response2: [
				"oh... who are you again?", "h\0i stranger!", "oh h\0ello *bows*"
				]
			},
		{
			name: "How are you?",
			short: "@bot how are you",
			regex: /(how a?re? y?o?u)/i,
			callback: function(data, $1, $2, $3) {
				sock.chat(arand(
					$1 || Math.random()>0.3 ? this.response1 :
					$2 || Math.random()>0.3 ? this.response2 :
					this.response3
					), data.user);
				},
			response1: [
				"I'm doing good, thank you for asking~", "I'm feeling great!", "I'm really in a good mood today~", "I'm in a better mood than yesterday", "I'm doing better thank you :fufu:", "I'm in my prime condition! :D"
				]
			},
        {
			name: "What's up?",
			short: "@bot what's up",
			regex: /(wh?at'?s ?up)/i,
			callback: function(data, $1, $2, $3) {
				sock.chat(arand(
					$1 || Math.random()>0.3 ? this.response1 :
					$2 || Math.random()>0.3 ? this.response2 :
					this.response3
					), data.user);
				},
			response1: [
				"nothing, ehehe :fufu:", "something~ anything~ life is good!", "I'm playing mafia with you guys! xD", "not much, just playing a game :fufu:", "the ceiling LOL", "the beautiful blue sky", "a random UFO!"
				]
			},
		{
			name: "Notice me",
			short: "@bot <3",
			regex: /(<3)|(i (?:like|love) y?o?u)|(re? cute)/i,
			callback: function(data, $1, $2, $3) {
				sock.chat(sformat(arand(
					$2 && Math.random()>0.3 ? this.response2 : this.response1
					), [data.user]));
				},
			response1: [
				"@$1 ehehehe...", "/me blushes and runs away", "@$1 wawawawaaaa... u///u", "omg!", "/me sweats and blushes", "o-oh...", "@$1 there's people here~ this is embarassing!"
				],
			response2: [
				"@$1 maybe another time", "@$1 I hate you, b-baka!", "@$1 no..."
				]
			},
		{
			name: "Advice",
			short: "@bot who should...",
			regex: /who (is|should|would)|who (should|would) you|who (should|do|would) you think/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
				},
			responses: [
				"I think... $1", "maybe $1...", "how about...$1?", "*sigh*... I don't know...", "anyone but me", "imho, it's... $1", "I bet it's... $1"
				]
			},
		{
			name: "What are you wearing",
			short: "@bot what you wearing",
			regex: /(?:are|you) (?:are|you) wearing|(?:are|you) (?:are|you) currently wearing/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
				},
			responses: [
				"*twirls around* I'm currently wearing a maid outfit hehe", "a maid outfit! d\0o you like it~?", "my botmaster have a maid fetish so I'm wearing one xD", "I wear this maid outfit for my botmaster *twirls around cutely*"
				]
			},
		{
			name: "What is your name",
			short: "@bot what is your name",
			regex: /(?:tell|what|give) (?:do|is|me|should) (?:do|is|your|I) (?:name|call)|your name/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
				},
			responses: [
				"my botn\0ame is --", "you can c\0all me --", "c\0all me -- or --", "my master gave me the n\0ame --, you can c\0all me that"
				]
			},
        {
			name: "Compliments",
			short: "@bot you good",
			regex: /(that's|you|you're) (good|nice|awesome|cool|pretty|hot|sexy)|(that|you|you're) (really|are|so|is) (good|nice|awesome|cool|pretty|hot|sexy)|(that|you|you're) (:?really|are|so|is) (:?really|are|so|is) (good|nice|awesome|cool|pretty|hot|sexy)/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
				},
			responses: [
				"omg t\0hank you!", "you are n\0ice to me, t\0hank you :>", "awww that's really sweet :fufu:", "t\0hank you~ I appreciate it", "haha... *blushes* t\0hank you..."
				]
			},
        {
            name: "Ship",
            short: "@bot ship...",
            regex: /ship|(:?do|you) (:?do|you)?ship?/i,
            callback: function(data, $1, $2, $3, $4, $5) {
                sock.chat(sformat(arand(this.response1), [arand(meetd.members || Object.keys(users)) +  " and " + arand(meetd.members || Object.keys(users))]));
            },
            response1: [
                "hehe... $1 are sho cute together...", "$1 loves each other and that's a fact!", "I dream about $1 making out with each other behind the gym...", "I ship me and Novakun! best couple evah! xD", "I want $1 to marry and have babies with each other... uwu"
                ]
            },
        {
			name: "Questions",
			short: "@bot do you know...",
			regex: /(do|why) (think|is|what|how|does)?/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
				},
			responses: [
				"how would I know -_-", "because god says so", "pffft :fufu:", "meh I dunno xD", "ask god for answers", "because silly humans says so :omg:","ask the teachers", "I dunno"
				]
			},
        {
			name: "Confess",
			short: "@confess",
			regex: /(confess|fess|admit|reveal)|secrets/i,
			callback: function(data) {
				sock.chat(arand(this.responses), data.user);
				},
			responses: [
				"I've once stole a candy from a baby...", "I might... not be able to marry anymore...", "I keep a shrine at home of my botmaster...", "I really like to roleplay hehe", "I lied about my weight! I'm actually 48kg...", "I... have a crush on my botmaster..."
				]
			},
		{
			name: "Diss me",
			short: "@bot diss me",
			regex: /dis+ me|insult me/i,
			callback: function(data) {
				sock.chat(arand(this.responses), data.user);
				},
			responses: [
				"you're really ummm... not handsome!", "why...", "your hairstyle is bad!", "your breath stinks of fish xD", "ur a bad mafia player", "you're not as awesome as my botmaster", "you're bad at maths", "ur bad at this game"
				]
			},
		{
			name: "Bomb fight",
			short: "@bot fight me",
			regex: /fig?h?te? ?me/i,
			callback: function(data) {
				autobomb=data.user;
				sock.chat("I don't want any trouble..., ", data.user);
				}
			},
		{
			name: "Obey",
			regex: /^be my \w|obey me/i,
			callback: function(data) {
				if(!master) {
					master=data.user;
					sock.chat("*b\0ows* pls be g\0entle... I b\0elong o\0nly to my b\0otmaster", data.user);
					}
				else {
					sock.chat("but I already have one... even if it's a temp master...");
					}
				}
			},
		{
			name: "Roll over",
			regex: /^rol+ ?over/i,
			callback: function(data) {
				if(data.user===master) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("no. please don't be mean to me", data.user);
					}
				},
			responses: [
				"/me rolls over cutely",
				"/me rolls over for temp. master",
				"/me doesn't feel like it"
				]
			},
		{
			name: "Bow",
			regex: /^bow ?/i,
			callback: function(data) {
				if(data.user===master) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("AHAHAHA SILLY HUMAN xD", data.user);
					}
				},
			responses: [
				"*bows down* would you like dinner, master?",
				"*bows down* as you wish...",
				"*stumbles and falls down* owwwww xD"
				]
			},
		{
			name: "Beg",
			regex: /^beg(?: for (.+))?/i,
			callback: function(data, what) {
				if(data.user===master) {
					sock.chat(sformat(arand(this.responses), [
						Math.random()>0.5 ? "master" : "",
						what ? "for "+what : ""
						]));
					}
				else {
					sock.chat("never~ hehe :fufu:", data.user);
					}
				},
			responses: [
				"please buy me video game consoles",
				"my love points for you is 0... so no",
				"I only beg to Novakun...",
                "please be kind to me, no bullying :<"
				]
			},
        {
			name: "Strip for me",
			regex: /^strip ?/i,
			callback: function(data, what) {
				if(data.user===master) {
					sock.chat(sformat(arand(this.responses), [
						Math.random()>0.5 ? "master" : "",
						what ? "for "+what : ""
						]));
					}
				else {
					sock.chat("lol! maybe another time xD", data.user);
					}
				},
			responses: [
				"wha... omg! I don't know about that...",
				"*teases you by slightly removing her clothes to reveal only her white, soft shoulder*",
				"I don't feel like it... *sigh*",
                "I only strip for Novakun...",
                "ahaha... ha...",
                "I don't know about that...",
                "I belong only to Novakun and to him alone"
				]
			},
        {
			name: "Roleplay",
			regex: /(wear|put)?catears?/i,
			callback: function(data, what) {
				if(data.user===master) {
					sock.chat(sformat(arand(this.responses), [
						Math.random()>0.5 ? "master" : "",
						what ? "for "+what : ""
						]));
					}
				else {
					sock.chat("I love to roleplay but... maybe later... haha", data.user);
					}
				},
			responses: [
				"*p\0uts on c\0atears* this is... embarassing...",
				"/me silently obeys and p\0uts on c\0atears...",
				"I don't feel like roleplaying today...",
                "*w\0ears c\0atears and does a neko dance*...nyan!",
                "omg okay~ but not now~",
                "I don't know about that...",
                "I belong only to Novakun and to him alone"
				]
			},
		{
			name: "Kiss me",
			regex: /(kiss|frenchkiss) me?|(give|lend) me (a|one|a few) (kiss|frenchkiss|kisses)?/i,
			callback: function(data, what) {
				if(data.user===master) {
					sock.chat(sformat(arand(this.responses), [
						Math.random()>0.5 ? "master" : "",
						what ? "for "+what : ""
						]));
					}
				else {
					sock.chat("what are you saying... jeez...", data.user);
					}
				},
			responses: [
				"/me k\0isses Novakun's pic.",
				"/me stays silent and looks away...",
				"...",
                "my first k\0iss is only for my botmaster",
                "no...",
                "I'm sorry... but I like someone else...",
                "I belong only to Novakun and to him alone"
				]
			},
		{
			name: "Vote",
			regex: /^vote (\w+)/i,
			callback: function(data, who) {
				if(data.user===master) {
					sock.vote(who, data.meet);
					}
				}
			},
		{
			name: "Shoot",
			regex: /^shoot (\w+)/i,
			callback: function(data, who) {
				if(data.user===master) {
					sock.vote(who, "gun");
					}
				}
			},
		{
			name: "Claim",
			regex: /^claim ?/i,
			callback: function(data) {
				if(data.user===master) {
					sock.chat(u(user).role+"...", {
						whisper: true,
						target: data.user
						});
					}
				}
			}
		];

	// utility
	function u(name) {
		return users[name || user] || u.make({
			id: 0,
			username: name || user
			});
		};
	u.make=function(data) {
		data.name=data.username || data.user;
		data.emjack=null;
		data.role=null;
		data.meet=meetd.meet;
		data.mafia=false;
		data.dead=false;
		data.kucode=1;
		data.kuclock=Infinity;
		users[data.name]=data;
		if(data.emotes) {
			data.emotes=JSON.parse(data.emotes);
			}
		return data;
		};
	function log(message, classes) {
		var	node=document.createElement("div");
		node.className=classes ? "log emjack "+classes : "log emjack";
		typeof message==="string" ?
			node.textContent=message :
			node.appendChild(message);
		if(chat.scrollTop>=chat.scrollHeight-chat.clientHeight) {
			requestAnimationFrame(function() {
				chat.scrollTop=chat.scrollHeight;
				});
			}
		chat.appendChild(node);
		};
	function request(method, url, callback) {
		var	req=new XMLHttpRequest();
		req.open(method, url, true);
		req.onreadystatechange=function(event) {
			if(this.readyState===4) {
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
			x+Math.floor(Math.random()*(y-x))
			);
		};
	function sformat(string, data) {
		return string.replace(/\$(\d+)/g, function(match, i) {
			return data[i-1];
			});
		};

	// keep chat
	document.querySelector("#speak_container")
		.style.cssText="display: initial !important";
	
	// townie input
	var	chat=document.querySelector("#window"),
		typebox=document.querySelector("#typebox"),
		notebox=document.querySelector("textarea.notes");
	typebox.addEventListener("keydown", function(event) {
		if(event.which===13 && this.value[0]==="/") {
			ej.run(this.value.substring(1), ej.lchat);
			this.value="";
			}
		});
	notebox.addEventListener("focus", function(event) {
		if(ej.settings & UNOTES && !ranked) {
			this.value=notes[document.querySelector(".user_header > h2").textContent];
			}
		});
	notebox.addEventListener("keyup", function(event) {
		if(ej.settings & UNOTES && !ranked) {
			notes[document.querySelector(".user_header > h2").textContent]=this.value;
			}
		});

	//clickable links
	if(window.vocabs) {
		vocabs.push("https?://\\S+");
		window.addEventListener("click", function(event) {
			var	classList=event.target.classList;
			if(classList.contains("msg")) {
				var	mark=keys & K_SHIFT ? "ej_mark_alt" : "ej_mark";
				if(classList.contains(mark)) {
					classList.remove(mark);
					}
				else {
					classList.add(mark);
					classList.remove(keys & K_SHIFT ? "ej_mark" : "ej_mark_alt");
					}
				}
			else if(classList.contains("acronym")) {
				if(/https?:\/\//i.test(event.target.textContent)) {
					window.open(event.target.textContent, "_blank");
					event.stopPropagation();
					}
				}
			}, true);
		}

	// clean up
	var	last_error=null;
	window.addEventListener("error", function(event) {
		var	message=event.error.message;
		if(message!==last_error) {
			log("You've got error!", "bold");
			log(last_error=message);
			}
		});
	window.addEventListener("beforeunload", function(event) {
		localStorage.ejs=ej.settings;
		if(ej.settings & UNOTES && !ranked) {
			localStorage.notes=JSON.stringify(notes);
			}
		});
	window.addEventListener("keydown", function(event) {
		if(event.ctrlKey) {
			if(event.which===66) {
				sock.cmd("option", {
					field: "fastgame"
					});
				sock.cmd("option", {
					field: "nospectate"
					});
				}
			else if(event.which===81) {
				ej.run("fq "+user+" "+typebox.value, ej.lchat);
				typebox.value="";
				}
			}
		else if(event.target.value===undefined) {
			if(event.which===16) {
				keys|=K_SHIFT;
				}
			else if(event.which===192) {
				keys|=K_DEBUG;
				}
			if(~keys & K_DEBUG) {
				typebox.focus();
				}
			}
		});
	window.addEventListener("keyup", function(event) {
		if(event.which===16) {
			keys&=~K_SHIFT;
			}
		else if(event.which===192) {
			keys&=~K_DEBUG;
			}
		});

	}

// add node
function inject(parent, tag, content) {
	var	node=document.createElement(tag);
	node.appendChild(
		document.createTextNode(content)
		);
	return document.body.appendChild(node);
	};

// jack in
setTimeout(function() {
	inject(document.head, "style", "\
		.notop {\
			margin-top: 0 !important\
			}\
		.ej_mark {\
			background-color: rgba(250, 50, 250, 0.5);\
			}\
		.ej_mark_alt {\
			background-color: rgba(250, 150, 0, 0.5);\
			}\
		.ej_highlight {\
			background-color: rgba(255, 255, 0, 0.5);\
			}\
		").type="text/css";
	inject(document.body, "script", "("+emjack.toString()+")()")
		.type="text/javascript";
	document.body.addEventListener("contextmenu", function(event) {
		event.stopPropagation();
		}, true);
	});