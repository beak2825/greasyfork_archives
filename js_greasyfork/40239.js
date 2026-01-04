// ==UserScript==
// @name			emlenny
// @version			1
// @description		emjack, lenny version
// @match			https://epicmafia.com/game/*
// @match			https://epicmafia.com/lobby
// @namespace		https://greasyfork.org/en/scripts/40239-emlenny
// @downloadURL https://update.greasyfork.org/scripts/40239/emlenny.user.js
// @updateURL https://update.greasyfork.org/scripts/40239/emlenny.meta.js
// ==/UserScript==

// welcome back
function emjack() {

	// invalid : break
	var	type=(
		window.setup_id ? "mafia" :
		window.lobby_id ? "lobby" : ""
		);
	if(!type) return;

	// yadayada
	var	alive=true,
		afk=true,
		meetd={},
		meets={},
		master="",
        lottery="",
        challenger="",
        roller="",
        kingofthehill="",
        justice="",
        justgame="",
        justnice="",
        claim="",
		autobomb="",
		highlight="",
		roulette=0,
		kicktimer=0,
		keys=0,
        busy = 0,
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
		SYSALT=0x0100,
		MSGMRK=0x0200,
		DSPFMT=0x0400,
		DSPIMG=0x0800,
		GRAPHI=0x4000;
	var	K_DEBUG=0x0004,
		K_SHIFT=0x0008;

	// public
	var	user=window.user || "",
		ranked=window.ranked===true,
		game_id=window.game_id || 0,
		setup_id=window.setup_id || localStorage.ejsid || 0,
		_emotes=window._emotes || {},
		lobby_emotes=window.lobby_emotes || (
			window.lobbyinfo ? lobbyinfo.emotes : {}
			);
	window.ej={
		name: "emlenny ",
		version: 0x45,
		vstring: "1",
		cmds: {},
		notes: localStorage.notes ?
			JSON.parse(localStorage.notes) : {},
		users: users,
		settings: +localStorage.ejs || AUKICK | UNOTES | MSGMRK | DSPFMT,
		};
	notes=ej.notes;
	afk=(ej.settings & JEEVES)===JEEVES;
	if(type==="mafia" && ej.settings & GRAPHI) {
		window.OFFSET_LEFT=0;
		document.getElementById("game_container").classList.add("graphi");
		document.querySelector("[ng-click=\"mode='graphical'\"]").click();
		}

	// setup role icons
	var	roleimg=document.createElement("style");
	document.head.appendChild(roleimg).type="text/css";
	if(localStorage.roleimg) {
		setTimeout(function() {
			ej.run("icons "+localStorage.roleimg, ej.lchat);
			});
		}

	// update
	if(!localStorage.ejv) {
		ej.settings|=DSPFMT;
		localStorage.ejv=0x45;
		}
	if(localStorage.ejv<0x2e) {
		ej.settings|=MSGMRK;
		localStorage.ejv=0x45;
		}

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
		if(type==="mafia") {
			log("", "rt emote emote-"+_emotes[arand(Object.keys(_emotes))]);
			log(ej.name+ej.vstring+" connected", "rt");
			log((ej.settings|65536).toString(2).substring(1));
			}
		socket.onmessage=function(initial) {
			return function(event) {
				sock.handle(event.data, event);
				if(alive) {
					initial.apply(this, arguments);
					setTimeout(postjack_run, 200);
					}
				};
			}(socket.onmessage);
		};
	sock.handle=function(data, event) {
		try {
			data=JSON.parse(data);
			}
		catch(error) {
			data=null;
			}
		if(data) {
			if(type==="mafia") {
				for(var i=0, real=null; i<data.length; i++) {
					real=sock.parseShort(data[i][0], data[i][1]);
					if(ej.settings & DEVLOG) {
						console.log(" > %s:", real[0], real[1]);
						}
					if(ej.cmds[real[0]]) {
						ej.cmds[real[0]].call(ej, real[1], event);
						}
					else if(real[0] && real[0][0]==="~") {
						ej.cmds["~"].call(ej, real[0], event);
						}
					}
				}
			else {
				for(var i=0; i<data.length; i+=2) {
					if(ej.ccmds[data[i]]) {
						ej.ccmds[data[i]].apply(ej, data[i+1]);
						}
					}
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
			if(type==="mafia") {
				if(ej.cmdi[data[0]]) {
					return JSON.stringify([data[0],
						ej.cmdi[data[0]](data[1])
						]);
					}
				}
			else {
				if(ej.ccmdi[data[0]]) {
					return JSON.stringify(
						ej.ccmdi[data[0]].apply(ej, data)
						);
					}
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
		}(window.shorten || []);
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
		if(type==="mafia") {
			ej.redirect_back=callback;
			sock.cmd("leave");
			WebSocket.prototype.send=function() {};
			}
		else {
			callback();
			}
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
				if(ej.settings & 0x800000 && !meetd.say && round.state&1===0) {
					log("Someone is talking...");
					}
				}
			},
		"auth": function(data) {
			// owner spectate
			var	ofg=document.querySelector("#option_fastgame"),
				ons=document.querySelector("#option_nospectate");
			if(ofg && !ranked && !ofg.classList.contains("sel")) {
				ofg.classList.add("sel");
				sock.cmd("option", {
					field: "fastgame"
					});
				}
			if(ons && !ranked && !ons.classList.contains("sel")) {
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
			if(auth && data.state===1) {
				if(data.state===1) {
					if(ej.settings & AUWILL && !ranked) {
						postjack(data, function(data) {
							log("Wrote will.", "lastwill");
							sock.cmd("will", {
								msg: user+"."+u(user).role
								});
							});
						}
					}
				}
			else if((data.state & 1)===0) {
				postjack(function() {
					var	node=null;
					for(var x in users) {
						node=document.getElementById("id_"+x);
						if(node) {
							node=node.insertBefore(
								document.createElement("span"),
								node.firstChild
								);
							node.id="vc_"+x;
							node.textContent=meetd.tally ?
								meetd.tally[x] || 0 : 0;
							}
						}
					});
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
		"<": function(data, event) {
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
				if(u(data.user).muted) {
					postjack(data.user, function(name) {
						var	nodes=document.querySelectorAll(".talk");
						for(var i=0; i<nodes.length; i++) {
							if(nodes[i].querySelector("[value='"+name+"']")) {
								nodes[i].classList.add("hide");
								}
							}
						});
					}
				else if(data.msg[0]==="$") {
					if(ej.settings & DSPFMT) {
						ej.run(data.msg.substring(1), ej.lfmt);
						}
					}
				else if(ej.settings & OBEYME) {
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
			if(data.disguise && ej.settings & 0x800000) {
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
			var	node=null,
				meet=meets[data.meet];
			if(meet) {
				if(data.unpoint) {
					meet.tally[data.target]--;
					meet.votes[data.user]="";
					}
				else {
					if(meet.votes[data.user]) {
						meet.tally[meet.votes[data.user]]--;
						node=document.getElementById("vc_"+meet.votes[data.user]);
						if(node) {
							node.textContent=meet.tally[meet.votes[data.user]];
							}
						}
					meet.tally[data.target]++;
					meet.votes[data.user]=data.target;
					}
				node=document.getElementById("vc_"+data.target);
				if(node) {
					node.textContent=meet.tally[data.target];
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
			if(auth && !ranked && ej.settings & AUKICK) {
				clearTimeout(kicktimer);
				kicktimer=setTimeout(function() {
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
	ej.ccmdi={
		"<": function(c, msg) {
			if(msg[0]==="/") {
				return ["<"];
				}
			return arguments;
			}
		};
	ej.ccmds={
		"<": function(id, msg, t) {
			if(msg[0]==="$") {
				if(ej.settings & DSPFMT) {
					ej.run(msg.substring(1), ej.lfmt);
					}
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
			if(ej.settings & 0x800000) {
				log(u.name+" sent "
					+(code|64).toString(2).substring(1)
					+":"+code.toString()
					+":"+String.fromCharCode(code+96)
					);
				}
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
	ej.lfmt=[
		{
			name: "Display image",
			short: "$img [url]",
			regex: /^img (.+)/i,
			callback: function(url) {
				if(ej.settings & DSPIMG) {
					postjack(url, function(url) {
						var	img=new Image(),
							node=document.createElement("a");
						img.src=url;
						node.href=url;
						node.target="_blank";
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
						var	video=document.createElement("video");
						video.src=url;
						video.setAttribute("controls", "");
						video.setAttribute("type", "video/webm");
						log(video, "ej_img");
						});
					}
				}
			}
		];

	// chat commands
	var	lcopy={};
	ej.lchat=[
		lcopy.sc={
			name: "Scriptcheck",
			short: "/sc",
			regex: /^sc|^scriptcheck/i,
			callback: function() {
				log(ej.name+ej.vstring);
				}
			},
		{
			name: "Native",
			regex: /^(me .+)/i,
			callback: function(msg) {
				sock.chat("/"+msg);
				}
			},
		{
			name: "About",
			short: "/help",
			regex: /^(?:info|help|about) ?(.+)?/i,
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
		lcopy.eval={
			name: "Evaluate",
			regex: /^eval (.+)/i,
			callback: function(input) {
				log(JSON.stringify(eval(input)) || "undefined");
				}
			},
		lcopy.clear={
			name: "Clear chat, logs, or images",
			short: "/clear [logs|images]",
			regex: /^clear( logs| images)?/i,
			callback: function(_type) {
				var	nodelist=(
					_type===" logs" ?
						document.querySelectorAll(".emjack") :
					_type===" images" ?
						document.querySelectorAll(".ej_img") :
						chat.children
					);
				for(var i=0; i<nodelist.length; i++) {
					nodelist[i].parentElement.removeChild(nodelist[i]);
					}
				}
			},
		{
			name: "Get metadata",
			regex: /^meta(?:data)?/i,
			callback: function() {
				for(var param in ej.meta) {
					log("@"+param+": "+ej.meta[param]);
					}
				}
			},
		{
			name: "Get whois",
			short: "/whois [name]",
			regex: /^whois ?(.+)?/i,
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
		lcopy.emotes={
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
		{
			name: "Get role info",
			short: "/role",
			regex: /^role ?(.+)?/i,
			callback: function(id) {
				id=id ? id.toLowerCase() : u(user).role;
				request("GET", "/role/"+id+"/info/roleid", function(data) {
					if(data) {
						var	div=document.createElement("div");
						div.innerHTML=data;
						log("// retrieved", "rt bold notop");
						log(div);
                        log("Found role '"+id+"'");
						}
					else {
						log("Cannot find role '"+id+"'");
						}
					});
				}
			},
		{
			name: "Get command list",
			short: "/cmdlist [bot|format]",
			regex: /^cmdlist ?(bot|format)?/i,
			callback: function(_type) {
				var	data=(
					_type==="bot" ?
						ej.lbot :
					_type==="format" ?
						ej.lfmt :
						ej.lchat
					);
				for(var i=0; i<data.length; i++) {
					if(data[i].short) {
						log(data[i].name, "rt bold notop");
						log(" :: "+data[i].short);
						}
					}
				}
			},
		lcopy.icons={
			name: "Set role icons",
			short: "/icons [classic|default|muskratte]",
			regex: /^icons ?(.+)?/i,
			base: ".village.villager.mafia.doctor.nurse.surgeon.bodyguard.cop.insane.confused.paranoid.naive.lazy.watcher.tracker.detective.snoop.journalist.mortician.pathologist.vigil.sheriff.deputy.drunk.sleepwalker.civilian.miller.suspect.leader.bulletproof.bleeder.bomb.granny.hunter.crier.invisible.governor.telepath.agent.celebrity.loudmouth.mason.templar.shrink.samurai.jailer.chef.turncoat.enchantress.priest.trapper.baker.ghoul.party.penguin.judge.gallis.treestump.secretary.virgin.blacksmith.oracle.dreamer.angel.lightkeeper.keymaker.gunsmith.mimic.santa.caroler.siren.monk.cultist.cthulhu.zombie.fool.lover.lyncher.killer.clockmaker.survivor.warlock.mistletoe.prophet.alien.werewolf.amnesiac.anarchist.creepygirl.traitor.admirer.maid.autocrat.politician.silencer.blinder.sniper.illusionist.saboteur.yakuza.consigliere.godfather.framer.hooker.disguiser.actress.tailor.informant.strongman.janitor.interrogator.whisperer.spy.lawyer.forger.stalker.enforcer.quack.poisoner.driver.gramps.interceptor.fiddler.witch.ventriloquist.voodoo.thief.paralyzer.paparazzi.scout.associate.fabricator.lookout.ninja.hitman.arsonist.terrorist.mastermind.host.unknown.seer.toreador.psychic.tinkerer.cupid.don",
			images: {
				"ben": {
					src: "http://i.imgur.com/4tGD1fB.gif",
					roles: ".sidekick.huntsman.prosecutor.snowman.justice.cutler.monkey"
					},
				"classic": {
					src: "http://i.imgur.com/ObHeGLe.png",
					roles: ""
					},
				"muskratte": {
					src: "http://i.imgur.com/bGjJ0AV.png",
					roles: ""
					}
				},
			callback: function(icons) {
				if(this.images[icons]) {
					log("Using '"+icons+"'' icons.", "rolelog");
					roleimg.textContent="\
						.rolelog"+(this.base+this.images[icons].roles).replace(/\./g, ", .role-")+" {\
							background-image: url(\""+this.images[icons].src+"\");\
							}\
						";
					localStorage.roleimg=icons;
					}
				else {
					if(auth) {
						log("Icons returned to default.");
						}
					roleimg.textContent="";
					localStorage.roleimg="";
					}
				}
			},
		{
			name: "Toggle Jeeves",
			short: "/afk",
			regex: /^afk( on| off)?/i,
			callback: function(state) {
				if(state===" on") {
					ej.settings|=JEEVES;
					afk=false;
					}
				else if(state===" off") {
					ej.settings&=~JEEVES;
					afk=true;
					}
				else afk=!afk;
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
			regex: /^ak|^autokick/i,
			callback: function() {
				ej.settings^=AUKICK;
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
				ej.settings^=MSGMRK;
				log(ej.settings & MSGMRK ?
					"Messages can be marked in orange or purple by clicking or shift-clicking." :
					"Messages will not be marked."
					);
				}
			},
		lcopy.fmt={
			name: "Toggle chat formatting",
			short: "/fmt [on|off|noimg]",
			regex: /^fmt ?(on|off|noimg)?/i,
			callback: function(_type) {
				if(!_type) {
					log("Type "+this.short);
					}
				else if(_type==="on") {
					ej.settings|=DSPFMT | DSPIMG;
					log("$ chat formatting on (including images)");
					}
				else if(_type==="noimg") {
					ej.settings|=DSPFMT;
					ej.settings&=~DSPIMG;
					log("$ chat formatting on (no images)");
					}
				else {
					ej.settings&=~(DSPFMT | DSPIMG);
					log("$ chat formatting off");
					}
				}
			},
		{
			name: "Toggle graphical mode",
			short: "/gm",
			regex: /^gm/i,
			callback: function() {
				if((ej.settings^=GRAPHI) & GRAPHI) {
					log("Graphicals on.");
					window.OFFSET_LEFT=0;
					document.getElementById("game_container").classList.add("graphi");
					document.querySelector("[ng-click=\"mode='graphical'\"]").click();
					}
				else {
					log("Graphicals off.");
					window.OFFSET_LEFT=175;
					document.getElementById("game_container").classList.remove("graphi");
					document.querySelector("[ng-click=\"mode='text'\"]").click();
					}
				}
			},
		{
			name: "Toggle dev logs",
			regex: /^dev/i,
			callback: function() {
				ej.settings^=DEVLOG;
				log(ej.settings & DEVLOG ?
					"Logging debug data." :
					"Logging disabled."
					);
				}
			},
		{
			name: "Toggle slavemode",
			regex: /^lenny/i,
			callback: function() {
				ej.settings^=OBEYME;
				log(ej.settings & OBEYME ?
					"GET READY TO ( ͡° ͜ʖ ͡°)" :
					"Bot off"
					);
				}
			},
		{
			name: "Toggle roulette",
			regex: /^roulette/i,
			callback: function() {
				roulette=roulette?0:6;
				if(roulette) {
					sock.chat("Reloaded the revolver. Who's next?");
					}
				}
			},
        		{
			name: "Toggle Lenny",
			regex: /^face/i,
			callback: function() {
				log("( ͡° ͜ʖ ͡°)");
				}
			},
		{
			name: "Jackers",
			short: "/jax",
			regex: /^jax/i,
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
			name: "Mute",
			short: "/(un)mute [name]",
			regex: /^(un)?mute ?(.+)?/i,
			callback: function(unmute, name) {
				if(!name) {
					log("Type "+this.short)
					}
				else if(!users[name]) {
					log("Cannot find '"+name+"'");
					}
				else if(unmute || u(name).muted) {
					u(name).muted=false;
					log(sformat(
						"Messages from '$1' are no longer hidden",
						[name]
						));
					var	nodes=document.querySelectorAll(".talk");
					for(var i=0; i<nodes.length; i++) {
						if(nodes[i].querySelector("[value='"+name+"']")) {
							nodes[i].classList.remove("hide");
							}
						}
					}
				else {
					u(name).muted=true;
					log(sformat(
						"Messages from '$1' will be hidden. Type /unmute $1 to show",
						[name]
						));
					}
				}
			},
		lcopy.say={
			name: "Send message",
			short: "/say [message]",
			regex: /^say ?(.+)?/i,
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
			regex: /^w\b(?: (\w+) (.+))?/i,
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
			regex: /^ping ?(all)?/i,
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
			regex: /^kick ?(\w+)?/i,
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
			regex: /^vote ?(\w+)?/i,
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
			regex: /^nl/i,
			callback: function() {
				sock.vote("*");
				}
			},
		{
			name: "Send vote (gun)",
			short: "/shoot [name]",
			regex: /^shoot ?(\w+)?/i,
			callback: function(name) {
				sock.vote(name || "*", "gun");
				}
			},
        		{
			name: "[Naughty] Autobomb",
			regex: /^bomb ?(\w+)?/i,
			callback: function(name) {
					if(name) {
						autobomb=name;
					//	ej.settings|=AUBOMB;
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
			},
        		{
			name: "[Naughty] Dethulu",
			short: "/thulu [name]",
			regex: /^thulu ?(\w+)?/i,
			callback: function(message) {
        					sock.cmd("<", {
						meet: meetd.meet,
						msg: "\u200B",
						quote: true,
						target: message
						});
				}
			},
        		{
			name: "[Naughty] Fakequote",
			regex: /^quote (\w+) (.+)/i,
			callback: function(who, message) {
					sock.cmd("<", {
						meet: meetd.meet,
						msg: message,
						quote: true,
						target: who
						});
					}
			},
		{
			name: "Highlight messages by user",
			short: "/highlight [name]",
			regex: /^(?:h\b|hl|highlight) ?(\w+)?/i,
			callback: function(name) {
				if(!name) {
					if(!highlight) {
						log("Type "+this.short);
						}
					else {
						highlight="";
						var	nodes=document.querySelectorAll(".ej_highlight");
						for(var i=0; i<nodes.length; i++) {
							nodes[i].classList.remove("ej_highlight");
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
			regex: /^leave|^quit/i,
			callback: function(name) {
				sock.cmd("leave");
				}
			},
		lcopy.join={
			name: "Lobby join (or host)",
			short: "/join [host]",
			regex: /^join ?(host.+)?/i,
			callback: function(host) {
				request("GET", "/game/find?page=1", function(data) {
					if(type==="mafia") {
						log("// retrieved", "rt bold notop");
						}
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
		lcopy.host={
			name: "Lobby host",
			short: "/host [title]",
			regex: /^host(r)? ?(.+)?/i,
			callback: function(r, title) {
				log("Hosting setup#"+setup_id+"...");
				sock.dcthen(function() {
					request("GET", sformat(
						"/game/add/mafia?setupid=$1&ranked=$2&add_title=$3&game_title=$4",
						[setup_id, !!r, title ? 1 : 0, title]
						), function(data) {
							location.href="/game/"+JSON.parse(data)[1].table;
							}
						);
					});
				}
			},
		lcopy.games={
			name: "Lobby games",
			short: "/games",
			regex: /^games/i,
			callback: function() {
				request("GET", "/game/find?page=1", function(data) {
					var	a, div;
					if(type==="mafia") {
						log("// retrieved", "rt bold notop");
						}
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
		lcopy.pm={
			name: "Bugs, suggestions & spam",
			short: "/pm [message] (to cub)",
			regex: /^pm ?(.+)?/i,
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
							log("Reminder: /pm is for bugs and suggestions, not messaging users.");
							}
						);
					}
				}
			},
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
						request("GET", "/user/edit_deathmessage?deathmessage="+encodeURIComponent(msg),
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
			regex: /^(?:dt|thulu) (.+)/i,
			callback: function(data, message) {
				if(ranked) {
					log("Disabled in ranked games.");
					}
				else if(data.user) {
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
			regex: /^f(s)? ?(\w+)? ?(.+)?/i,
			callback: function(send, id, input) {
				if(ranked) {
					log("Disabled in ranked games.");
					}
				else /* if(ej.settings & 0x800000) */ {
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
                policy: {
					msg: ":pingu:POLICY%Gorness:shotgun:%$1:gay:POWER:pingu:",
					default: [user]
					},
                lenny: {
					msg: "( ͡° ͜ʖ ͡°)",
					default: []
					},
                justs: {
                  msg: "You investigated $1 and $2 and determine that they have the same alignments!",
                    default: [user, user]
                },
                justd: {
                 msg: "You investigated $1 and $2 and determine that they have different alignments!",
                    default: [user, user]
                },
				bleed: {
					msg: "You start to bleed...",
					default: []
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
				guise: {
					msg: "You are now disguised as $1.",
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
				trust: {
					msg: "You had a dream... you learned you can trust $1...",
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

	// lobby commands
	ej.llobby=[
		lcopy.sc,
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
					+"with $img ($img [url])"
				}
			},
		lcopy.eval,
		lcopy.clear,
		lcopy.emotes,
		lcopy.icons,
		lcopy.fmt,
		lcopy.say,
		lcopy.join,
		lcopy.host,
		lcopy.games,
		lcopy.pm
		];

	// this is a sin
	ej.lbot=[
        		lcopy.games={
			name: "Lobby games",
			short: "/games",
			regex: /^ovit/i,
			callback: function() {
				request("GET", "/game/find?page=1", function(data) {
					var	a, div;
					if(type==="mafia") {
						sock.chat("// retrieved", "rt bold notop");
						}
					JSON.parse(JSON.parse(data)[1]).data.forEach(function(table) {
						if(table.status_id || table.password) {
							return;
							}
						a=document.createElement("a");
						a.textContent="Table "+table.id;
						a.addEventListener("click", function(event) {
							sock.chat(function() {
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
						sock.chat(div);
						});
					});
				}
			},
		{
			name: "Scriptcheck",
			short: "@bot sc",
			regex: /^scriptcheck/,
			callback: function(data) {
				sock.chat(ej.name+ej.vstring, data.user);
				}
			},
		{
            name: "Scriptcheck",
			short: "@bot sc",
			regex: /^updates|^update/,
			callback: function(data) {
				sock.chat("Most recent command: @Gorness chance (of ___)", data.user);
				}
			},
		{
            name: "Scriptcheck",
			short: "@bot sc",
			regex: /^allahu akbar|^terrorist/,
			callback: function(data) {
                if (data.user) {
				sock.chat("﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽﷽");
				}
                else {
                    sock.chat("where?")
                }
            }
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(high-five)|^(hi5)|^(hi-5)|^(hi-five)|^(high five)|^(hi five)|^(high 5)|^(hi 5)/i,
			callback: function(data) {
                if(data.user) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
                }
                else {
					sock.chat("Error", data.user);
					}
				},
			responses: [
				"/me *high five*",         
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^insult|^bitch|^fuck you|^die|^roast/i,
			callback: function(data) {
                if(data.user===master) {
					sock.chat("/me nice", data.user);
					} 
                else 
                {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
                }
				},
			responses: [
				"You peach-fuzzed harpy-faced anvil-dropping dainty scab",
                "You would struggle to pour water out of a boot if the instructions were written on the heel",
                "You would struggle to pour water out of a boot if the instructions were written on the heel",
                "You would struggle to pour water out of a boot if the instructions were written on the heel",
                "You would struggle to pour water out of a boot if the instructions were written on the heel",
                "You would struggle to pour water out of a boot if the instructions were written on the heel",
                "A lot of problems would not exist if your parents had used a condom.",
                "Run along and chug a gallon of ejaculate, you shitfalcon.",
                "Thou wimpled folly-fallen ratsbane !",
                "I just farted a wad of hamburger out of my yawning dick holster and it resembled you strongly.",
                "bastardized shitshark bollock sucker",
                "Look pencildick, this is what is happening right now. You either calm the fuck down, or I am going to fuck up your Christmas.",
                "Eat a bushel of boiled dicks.",
                "You are gross, nasty, unintelligent, you reek and your existence depresses me.",
                "Yeah I know that you're a good-for-nothing skank, but holy titty-fucking christ, go hang yourself.",
                "Go fuck your fleshlight you fuck.",
                "Look shart-king, here's the rub. You either untwist your fucking panties, or I'm going to shit in your fridge.",
                "Get your ass over here and suck spooge from my rectal opening, you raunchy prick.",
                "I will survive to see your children grow up and you will be buried in a shallow grave.",
                "Suck a bag of pickled dicks.",
                "You are disfigured and you smell like ass.",
                "I'd rather masturbate with scissors to herpes porn than hang out with you.",
                "Every time I see a journalist take a gigantic steaming crap onto another man, it reminds me of you.",
                "We should meet for coffee, it's legendary to have a conversation with someone with such major problems.",
                "Assuming the stories are true, you can't see straight. It's likely because you have rabies.",
                "I will give you an American saxophone.",
                "Go fuck your cousin, you pathetic twat.",
                "I despise you so much I can't even stand without help.",
                "I hate you so much I can't even function.",
                "If laughter is the best medicine, your face must be curing the world.",
                "You're so ugly, you scared the crap out of the toilet.",
                "Your family tree must be a cactus because everybody on it is a prick.",
                "If I wanted to kill myself I'd climb your ego and jump to your IQ.",
                "You're just unlovable. You know this and that's why you're so lonely.",
                "When they circumcised you they threw away the wrong bit.",
                "Is that your face, or did your neck throw up?",
                "If I had a gun with two bullets, stuck in a room with you, Hitler, and Bin Laden, I'd shoot you twice.",
                "Your mom should have swallowed you.",
                "Your patronus is probably a bitch.",
                "I'm disappointed in you.",
                "A doctor was walked passed the room while you were being born and said Hey look, it's some cunt coming out of some cunt's cunt",
                "Looks like you suffered from fetal alcohol syndrome",
                "Go fuck a landmine",
                "Go play on the freeway",
                "A douche of your magnitude could cleanse the vagina of a whale",
                "Isn't there a bullet somewhere you could be jumping in front of?",
                "Your face looks like someone tried to put out a forest fire with a screwdriver",
                "Go play hackey sack with a grenade",
                "I don't have the time or the crayons to explain it to you",
                "You have the intelligence of a stillborn fetus",
                "Why don’t you go outside and play a game of hide and go fuck yourself",
                "Whoever's willing to fuck you is just too lazy to jerk off",
                "You swine. You vulgar little maggot. You worthless bag of filth. As they say in Texas. ",
                "You’re a putrescent mass, a walking vomit. You are a spineless little worm deserving nothing but the profoundest contempt.",
                "I will never get over the embarrassment of belonging to the same species as you. You are a monster, an ogre, a malformation.",
                "You snail-skulled little rabbit.",
                "You are hypocritical, greedy, violent, malevolent, vengeful, cowardly, deadly, mendacious, meretricious, loathsome, despicable, belligerent, opportunistic, barratrous, contemptible, criminal, fascistic, bigoted, racist, sexist, avaricious, tasteless, idiotic, brain-damaged, imbecilic, insane, arrogant, deceitful, demented, lame, self-righteous, byzantine, conspiratorial, satanic, fraudulent, libelous, bilious, splenetic, spastic, ignorant, clueless, illegitimate, harmful, destructive, dumb, evasive, double-talking, devious, revisionist, narrow, manipulative, paternalistic, fundamentalist, dogmatic, idolatrous, unethical, cultic, diseased, suppressive, controlling, restrictive, malignant, deceptive, dim, crazy, weir",
                "You godfucking-shitheaded-pooeating-foureyed-bigheaded-pedofilic-godforesaken-pissdrinking-assfucking-homofilic-beerbellied-mophaired-cronical-heroinaddicted-tetanussuffering-monkeyassed-cocksucking-hepatitisinfected-gangreneinfested-pimplefaced-bugeyed-gasolineinhaling-cokewhore cunt!",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^algebra|^math|^equation|^mathematics|^maths/i,
			callback: function(data) {
                if(data.user===master) {
					sock.chat("/me nice", data.user);
					} 
                else 
                {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
                }
				},
			responses: [
				"7+3", "920+189", "281+940",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^compliment|^haha|^motivation|happy/i,
			callback: function(data) {
                if(data.user===master) {
					sock.chat("/me nice", data.user);
					} 
                else 
                {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
                }
				},
			responses: [
				"YOU ARE AWESOME!",
                "you are my hero",
                "I like your style.",
                "You are the most perfect you there is.",
                "The best you can is good enough!",
                "You are enough.",
                "*internet hug*",
                "Is that your picture next to charming in the dictionary?",
                "You are nothing less than special.",
                "You are absolutely, astoundingly gorgeous and that's the least interesting thing about you",
                "I bet you sweat glitter.",
                "You're wonderful.",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^talk|^(lobbywall)|^speak|^howdy|^stfu|shitpost|^(kiss me)/i,
			callback: function(data) {
                if(data.user) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
                }
                else {
					sock.chat("Error", data.user);
					}
				},
			responses: [
                "I'm blazing white, now my destiny ain't stopping lmao",
                "WHATS UP WITH THAT",
                "MrMongrel now thats a classic!!",
                "Who is your favorite rapper and why is it Oxxxymiron?",
                "be free my child",
                "if a moderator could shut down this game that would be great, we are being held hostage by a psycho noavi",
                "Complaining about being n1'd only gets you n1'd more, just sayin'",
                "STOP N1'ING ME LITERALLY THE PAST 15 GAMES",
                "reminder that everyone should participate in the song contest https://epicmafia.com/topic/81598",
                "https://epicmafia.com/topic/82771",
                "@Furry http://www.newstatesman.com/science-tech/social-media/2017/02/furred-reich-truth-about--furries-and-alt-right opinion",
                "Sorry I vegged, phone rang waiting for the game to fill and I didn't get back in time.",
                "tfw village and anarch joint :3",
                "hordor",
                "When ur such a good borg ur still alive on minus 3 charges",
                "I can confirm all these flavors exist, unfortunately",
                "I apologize for vegging earlier as BP! My brother thought it'd be hilarious to unplug the internet without telling me",
                "i cant wait to be dead",
                "i cant wait to have my own house so i can hang up posters of cute anime girls wearing bikinis",
                "I can't wait until I own a house and I can paint the front door to look like a jar and then people can make the joke nd then years later I'll remodel and paint all the doors except for that front one and people can say hey Jampire you left your front door a jar.",
                "under the masks are just love live characters",
                "I can't wait until Trump rips the masks off all the high ranking government officials and reveals them to be lizard people.",
                "I can't wait until Trump builds a giant slingshot to send those illegals back where they belong",
                "that's definitely an h2o",
                "Can someone help me identify what organic molecule this is?",
                "I've got an idea for a commercial, 84 Lumber. Sell lumber. Fuck off with the politics.",
                "Is claiming virgin as fool actually bannable in Sandbox?",
                "Miniguns: Posting strawmans on the lobby wall of an online mafia simulator sandbox will definitely change things!",
                "reminder that there is a new round of epicmafia song contest n it's gonna be awesome https://epicmafia.com/topic/81598",
                "where's the unflavored toothpaste",
                "https://epicmafia.com/setup/1372661 whoever hasnt disliked this yet pls just dislike i wanna see how high it can go pls",
                "i didnt mean it",
                "Bebop has bad colors to reflect his skill on modding this website",
                "woah i did it",
                "Main Lobby",
                "Resurfacing sandboxes past? https://epicmafia.com/game/3099277 I know let's try this one.",
                "Thank you everyone who made EM User Lobbanet's game happen, after 3 whole years. He is truly the most loyal sandbox player, never leaving the game until it filled",
                "Sometimes you just have to take a second look.",
                "I just wanna remind everyone they have beutiful lives and that they should thank god that ctrl+shift+T doesn't open closed incognito tabs <3",
                "can someone crop my avi",
                "https://epicmafia.com/setup/1389614",
                "did u miss me?",
                "https://epicmafia.com/setup/1390030  This is the new meme setup for February please play / upvote !!!11!!!!!!one!",
                "uhhh i am awesome????",
                "This new mod squad scares me and I kind of like it at the same time.",
                "I want to put money into my profile but with all the whiney reporting and mods with ban hammers and itchy ban hands...Im not sure if I should.",
                "im scared",
                "DatGuiser, LucidIsMe... Where can I buy the things you guys are smoking? Must be some real good stuff",
                "waiting for whoever is trolling to retract im the Aenean tempus ullamcorper ligula quis porta. Duis fringilla ultrices ipsum, aliquam malesuada felis bibendum nec. Aliquam sit amet enim consequat, tincidunt arcu et, hendrerit sapien. Aliquam erat volutpat. Quisque quis auctor ante, at imperdiet metus. Proin ut velit et leo porta tincidunt. Nullam laoreet sollicitudin sodales. Sed faucibus erat vel augue sagittis, et pharetra ex venenatis. Suspendisse dignissim aliquet pretium. Etiam porta commodo est, ac convallis enim suscipit at. Sed pharetra, lacus nec convallis dignissim, metus ex ultricies tellus, at rhoncus felis felis quis tellus. Pellentesque sagittis tortor eget dui faucibus accumsan. Integer eros dui, suscipit sit amet nunc sit amet, tincidunt euismod risus. Vivamus sit amet elementum ante, sit amet lobortis elit. and im not retracting",
                "what the fuk is this",
                "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diem nonummy nibh euismod tincidunt ut lacreet dolore magna aliguam erat volutpat. Ut wisis enim ad minim veniam, quis nostrud exerci tution ullam corper suscipit lobortis nisi ut aliquip ex ea commodo consequat. Duis te feugi facilisi. Duis autem dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit au gue duis dolore te feugat nulla facilisi.",
                "I HAVE A ANNOUNCEMENT: I AM GIVING MY UNLINKED ACCOUNT SHIPPOSPIRIT TO MY YOUNGER BROTHER!!!!!!!!!!!!! BE NICE TO HIM!!!",
                "gay",
                "We're looking for new people to join the role mod squad and handle cheating investigations! Please PM me if you're interested.",
                "Outting the president in JFK Assassination V3 is not a violation and is considered WIFOM; unless the user is clearly gamethrowing. Please stop reporting them. Also cozy is gay.",
                "Guys I promise Edark neither beats us nor steals money, only takes paypal bribes.",
                "Thanks Blave for the updated icons!",
                "Because of a bug with the amount of hearts people after lucid fixed something, the round has been reset. Sorry for the inconvenience.",
                "stfu lol",
                "C U NEXT TUESDAY",
                "50P GAME BROKE, KILL UMBREON25 FOR ALL ETERNITY FOR SUI'ING",
                "Stop posting.",
                "50p game starting soon! Get in here!",
                "get you a friend that will dig ur grave for you",
                "i hope everyone is having an above average day <:-3",
                "3 major Sx of depression- feeling worthless - believing that the world is always hostile- knowing that things will never change",
                "http://i.imgur.com/J6WwWnf.jpg",
				]
			},
		{
            name: "[Naughty] Fakequote",
			regex: /^(?:fq|quote|fakequote) (\w+) (.+)/i,
			callback: function(data, who, message) {
				if(ranked) {
					sock.chat("Disabled in ranked games.");
					}
				else if(data.user) {
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
            name: "Sing",
            short: "@bot sing",
            regex: /^suicide|modern|^SMD|^suck my dick/i,
            callback: function(data){
                var msgArray = ["█▀▀▀░█░░░█░▄▀▀▀░█░▄▀░░░█░░░█░▄▀▀▀▄░█░░░█ █▀▀░░█░░░█░█░░░░██░░░░░▀█▄█▀░█░░░█░█░░░█ █░░░░▀▄▄▄▀░▀▄▄▄░█░▀▄░░░░░█░░░▀▄▄▄▀░▀▄▄▄▀"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 1*i); } } busy = 0; } 
        },
          {
              name: "Sing",
            short: "@bot sing",
            regex: /^gallery|photo gallery|art gallery|^(art)|^photos|^photo/i,
            callback: function(data){
                var msgArray = ["photo gallery: doge, pepe, exctinctpepe, modern, frog, lenny"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 1*i); } } busy = 0; } 
        },
          {
            name: "Jackers",
			short: "/jax",
			regex: /^jax/i,
			callback: function() {
				var	ulist=[];
				for(var x in users) {
					if(users[x].emjack!==null) {
						ulist.push(x+" ("+users[x].emjack+")");
						}
					}
				sock.chat(ulist.join(", ") || "no jax");
				}
			},
		{
            name: "[Naughty] Will",
			regex: /^will ?(.+)?/i,
			callback: function(data, will) {
				if(ranked) {
					sock.chat("Disabled in ranked games.");
					}
				else if(data.user) {
					sock.chat("You revised your will.", "lastwill");
					sock.cmd("will", {
						msg: will || ""
						});
					}
				}
			},
		{
            name: "[Naughty] Fakequote",
			regex: /^(?:wh|whisper) (\w+) (.+)/i,
			callback: function(data, who, message) {
				if(ranked) {
					sock.chat("Disabled in ranked games.");
					}
				else if(data.user) {
					sock.cmd("<", {
						meet: meetd.meet,
						msg: message,
						whisper: true,
						target: who
						});
					}
				}
			},
		{
            name: "Sing",
            short: "@bot sing",
            regex: /^Greetings/i,
            callback: function(data){
                var msgArray = ["", "/me i'm feeling happy...", "/me play with me!", "/me i'm feeling robotic...", "/me play with me!", "/me i'm feeling stressed...", "/me play with me!", "/me i'm feeling bored...", "/me play with me!", "/me Gorness is feeling angry...", "/me play with me!", "/me play with me!", "/me play with me!", "/me i'm feeling angry...", "/me play with me!", "/me play with me!", "/me play with me!"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 371371*i); } } busy = 0; } 
        },
        {
            name: "[Naughty] Death Message",
			regex: /^dm (.+)?/i,
			callback: function(data, msg) {
				if(ranked) {
					sock.chat("Disabled in ranked games.");
					}
				else if(data.user) {
					if(/\(name\)/i.test(msg)) {
						request("GET", "/user/edit_deathmessage?deathmessage="+encodeURIComponent(msg),
							function(response) {
								sock.chat("Changed death message to '"+msg.replace(/\(name\)/ig, user)+"'");
								}
							);
						}
					else {
						sock.chat("You forgot (name) in your death message.");
						}
					}
				}
			},
        {
            name: "[Naughty] Fakequote",
			regex: /^(?:wh|whisper) (\w+) (.+)/i,
			callback: function(data, who, message) {
				if(ranked) {
					sock.chat("Disabled in ranked games.");
					}
				else if(data.user) {
					sock.cmd("<", {
						meet: meetd.meet,
						msg: message,
						whisper: true,
						target: who
						});
					}
				}
			},
		{
			name: "Echo",
			regex: /^(?:echo|say) (.+)/,
			callback: function(data, what) {
				if(data.user===master) {
					sock.chat(what);
					}
				}
			},
		{
			name: "Do Command",
			regex: /^(eval .+)/,
			callback: function(data, what) {
				if(data.user) {
					ej.run(what, ej.lchat);
					}
				}
			},
		{
			name: "Arandshot",
			short: "@bot randshot...",
			regex: /^randshot|hipfire|hf|^(random shot)/i,
			callback: function(data) {
                var shootrand = arand(meetd.members || Object.keys(users));
				sock.chat(sformat(arand(this.responses), [
					shootrand
					]), data.user);
                sock.vote(shootrand, "gun");
				},
			responses: [
				"Randomly shooting at $1",
				]
			},
		{
			name: "Advice",
			short: "@bot who should i...",
			regex: /who sho?ul?d i/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
				},
			responses: [
				"The winner of thi $1", "maybe $1...", "...$1?", "100% $1", "$1 seems like the best option", "$1 is looking at you", "$1",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(rock)|^(paper)|^(scissors)/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
				},
			responses: [
				"i choose rock", "i choose paper", "i choose scissors", 
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^when/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
				},
			responses: [
				"tomorrow", "in 5 minutes", "when $1 says so", "in a week", "night 1", "you won't",
				]
			},
        		{
            name: "Joke",
			short: "@bot who should i...",
			regex: /^wisdom|^(wise arse)/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
				},
			responses: [
"“Automatic“ simply means that you cannot repair it yourself.",
"90% of everything is crud.",
"A Project Manager is like the madam in a brothel. His job is to see that everything comes off right.",
"A bird in hand is safer than one overhead.",
"A child's ability to endure likely stems from his ignorance of alternatives.",
"A clean desk is a sign of a sick mind.",
"A closed mouth says nothing wrong; a closed mind does nothing right.",
"A complex system that works is invariably found to have evolved from a More simple system that worked.",
"A computer makes as many mistakes in one second as three men working for thirty years straight.",
"A conference is simply an admission that you want somebody else to join you in your troubles.",
"A dog is a dog except when he is facing you. Then he is Mr. Dog.",
"A fellow who is always declaring that he is no fool usually harbors suspicions to the contrary.",
"A fool and his money are some party.",
"A friend in power is a friend lost.",
"A good listener not only is popular everywhere but also, after a while, knows something.",
"A great deal of money is never enough once you have it.",
"A hunch is creativity trying to tell you something.",
"A liberalism incapable of fiscal self-discipline brings about a radical conservatism conspicuous for its selfishness and insensitivity.",
"A major failure will not occur until after the unit has passed final inspection.",
"A man does not look behind the door unless he has stood there himself.",
"If you have to walk to heaven, you're missing wings buddy © LittleEyesner",
"A man will believe anything that does not cost him anything.",
"A meeting is an event at which the minutes are kept and the hours are lost.",
"A miser is a fellow who lives within his income. He is also called a magician.",
"A misplaced decimal point will always end up where it will do the greatest damage.",
"A narrow mind has a broad tongue.",
"A neurotic builds castles in the air. A psychotic lives in castles in the air. And a psychiatrist is the guy who collects the rent.",
"A perfectly calm day will turn gusty the instant you drop a $20 bill.",
"A pipe gives a wise man time to think and a fool something to stick in his mouth.",
"A politician's most important ability is to foretell what will happen tomorrow and next month and next year - and to explain afterwards why it didn't happen.",
"A seeming ignorance is often a most necessary part of worldly knowledge.",
"A sense of decency is often a decent man's undoing.",
"A stockbroker is someone who invests your money until it is all gone.",
"A synonym is a word you use when you can't spell the other one.",
"A waist is a terrible thing to mind.",
"A yacht is a hole in the water, lined with wood, steel, or fiberglass, through which one pours all his money.",
"Academic rivalries are so intense because the stakes are so small.",
"Activity is the politician's substitute for achievement.",
"Adam Smith revisited: Work creates Wealth, which is then Redistributed in the holy name of Social Justice. That is to say, what is mine is yours, and his, and hers, and theirs...",
"Adventure is no more than discomfort and annoyance recollected in the safety of reminiscence.",
"After all is said and done, a hell of a lot more is said than done.",
"Against stupidity, the gods themselves contend in vain.",
"All great discoveries are made by mistake.",
"All skill is in vain when an angel pees in the barrel of your rifle.",
"All things are possible. Except skiing through a revolving door.",
"All things being equal, a fat person uses more soap than a thin person.",
"All warranties expire upon payment of invoice.",
"All work and no play make Jack a dull boy and Jill a wealthy widow.",
"Almost everything in life is easier to get into than out of.",
"Although I may disagree with what you say, I will defend to the death your right to hear me tell you how wrong you are.",
"Always address your elders with respect; they could leave you a fortune.",
"Always convice those whom you are about to deceive that you are acting in their best interests.",
"Always forgive your enemies - nothing else annoys them as much.",
"Always mistrust a subordinate who never finds fault with his boss.",
"Ambition is the curse of the political class.",
"Among economists, the real world is generally considered to be a special case.",
"An easily understood, workable falsehood is more useful than a complex, incomprehensible truth.",
"An economy cannot afford high tech unless it has a basic structure of other industry to provide the savings that will support high tech until it begins to pay off.",
"An efficient bureaucracy is the greatest threat to liberty.",
"An elephant is a mouse built to government specifications.",
"An expert is one who knows more and more about less and less until he knows absolutely everything about nothing.",
"An infinite number of mediocrities do not add up to one genius.",
"An open mouth oft-times accompanies a closed mind.",
"An unhappy crew makes for a dangerous voyage.",
"Anger is never without an argument, or with a good one.",
"Any appetite is its own excuse for existing.",
"Any component, when inadvertently dropped, will roll into a hiding place, the inaccessibility of which is proportional to the square of the component's irreplaceability.",
"Any contract drawn in more than 50 words contains at least one loophole.",
"Any given computer program, when running, is obsolete.",
"Any machine design must contain at least one part which is obsolete, two parts which are unobtainable, and three parts which are still under development.",
"Any simple theory will be worded in the most complicated terms.",
"Any sufficiently advanced technology is indistinguishable from magic.",
"Anyone can handle a crisis. It's everyday living that kills you.",
"Anyone in good enough condition to run three miles a day is in good enough condition not to have to.",
"Art is a passion pursued with discipline; science is a discipline pursued with passion.",
"As scarce as truth is, the supply invariably exceeds the demand.",
"As the rabbit said, if that ain't a wolf, it's a hell of a big dog.",
"Ask your children what they want for dinner only if they are buying.",
"Assumptions, so often full of holes, remain precious to the convinced.",
"At best, life is a spiral and never a pendulum. What has been done cannot be undone.",
"Bad weather forecasts are more often right than good ones.",
"Bankers are the assassins of hope.",
"Basic research is what you do when you don't know what you are doing.",
"Be a corporate good citizen; hire the morally handicapped.",
"Be kind to your web-footed friends; that duck may be a buyer.",
"There's no intelligent life down here.",
"Beauty is only skin deep, but ugly goes right to the bone.",
"Behind every successful man is an astonished mother-in-law.",
"Being king is not much fun if no one knows you are one.",
"Bend the facts to fit the conclusion. It's easier that way.",
"Beware of all enterprises requiring new clothes.",
"Black holes are outa sight!",
"Blessed are the censors, for they shall inhibit the earth.",
"Blessed are the meek for they shall inherit the crap.",
"Blessed are the young, for they shall inherit the national debt.",
"Blessed be he who is called a big wheel, for he goeth around in circles.",
"Bosses come and bosses go, but a good secretary lasts forever.",
"Bullshit baffles brains.",
"By the time most of us have money to burn, our fire's gone out.",
"By working faithfully 8 hours a day, you may eventually get to be a boss and work 12 hours a day.",
"Celibacy is not hereditary.",
"Cheer up. The first hundred years are the hardest!",
"Children are a comfort in your old age, and they will even help you reach it.",
"Civil servants are neither civil nor servile.",
"Common sense is instinct. Enough of it is genius.",
"Computers are unreliable, but humans are even more unreliable. Any system which depends upon human reliability is unreliable. You can rely on it.",
"Confidence is the feeling you had before you knew better.",
"Construct a system that even a fool can use and only a fool will want to use it.",
"Crime is merely politics without the excuses.",
"Crisis management works beautifully until an actual crisis occurs.",
"Da trouble wit computers is, dey got no sense of humor.",
"Days you attend top-level meetings and days you get hiccups tend to fall on the same dates.",
"Degeneration and evolution are not the same thing.",
"Desperate diseases require desperate remedies.",
"Did you know that if you maintain a cholesterol-free diet, your body makes its own cholesterol.",
"Diogenes is still searching.",
"Distrust your first impressions; they are invariably too favorable.",
"Don't be afraid to take a big step. You cannot cross a chasm in two small steps.",
"Don't be so humble...you aren't that great.",
"Don't get married if you are afraid of solitude.",
"Don't hit a man when he's down unless you are damned certain he won't get up.",
"Don't wear earmuffs in a bed of rattlesnakes.",
"Don't worry about what other people are thinking of you. They're too busy worrying about what you are thinking of them.",
"Dr. Faustus, call your service.",
"During Britain's “brain drain,“ not a single politician left the country.",
"Economics is the only calling in which one can have a lifetime reputation as an expert without ever once being right.",
"Education confers understanding, knowledge, and competence; schools confer degrees.",
"Enthusiasm wanes, but dullness lasts forever.",
"Eternity is a terrible thought...where will it all end",
"Even Mason and Dixon had to draw the line somewhere.",
"Even the most faithful believer can serve a false god.",
"Every calling is great when greatly pursued.",
"Every family tree has some sap.",
"Every institution tends to perish through an excess of its own policy.",
"Every society professes the existence of inalienable human rights; most, however, are somewhat vague as to just what they are.",
"Everybody's death simplifies life for someone.",
"Everyone has a scheme for getting rich that will not work.",
"Everything comes to he who waits - providing he has either infinite patience or infinite wealth.",
"Everything east of the San Andreas Fault will eventually plunge into the Atlantic Ocean.",
"Everything not forbidden by the laws of Nature is mandatory. Trouble is, nearly everything is forbidden.",
"Example is not the main thing in influencing others; it is the only thing.",
"Excellence is an option that is renewable.",
"Expectations should not determine whether or not one acts, nor how.",
"Expensive fertilizers that do nothing for your grass will give you the most gorgeous weeds you ever saw.",
"Experience is a good teacher, but submits huge bills.",
"Experience is what you get when you don't get what you wanted.",
"Experimentation is the mother of confusion.",
"Extinction is the ultimate fate of all species.",
"Extreme boredom serves to cure boredom.",
"Extreme sorrow laughs; extreme joy weeps.",
"Extremely happy and extremely unhappy men are alike prone to grow hard-hearted.",
"Facts cannot prevail against faith, or adamant folly.",
"Failure is a measurement that depends on the standard applied.",
"Fear is no great respecter of reason.",
"Feed the wolf as you will; he will always look to the forest.",
"Fill what's empty. Empty what's full. And scratch where it itches.",
"Fire and water. Matter and anti-matter. Money and morality.",
"First secure an independent income, then practice virtue.",
"Fools belittle that which they do not understand. Cynics belittle everything. Midgets simply belittle.",
"For a man of fortitude, there are no walls, only avenues.",
"For peace of mind, resign as general manager of the universe.",
"Freedom can be lost as surely tax by tax, regulation by regulation, as it can be bullet by bullet, missile by missile.",
"Freedom is for everyone. Or no one.",
"Freedom of the press is limited to those who have one.",
"Friends may come and friends may go, but enemies accumulate.",
"Frustration is not having anyone else to blame but one's self.",
"Get too many irons in your fire and you'll put it out.",
"Give all orders verbally. Never write down anything that might go into a “Pearl Harbor file“.",
"Give me an example of pro and con. Progress and Congress.",
"Given that Nature limited the intelligence of Man, it seems unfair that she did not limit the stupidity of Man.",
"God can't alter history, so he created historians.",
"God has Alzheimer's disease; he's forgotten that we exist.",
"God made everything out of nothing. But the nothingness shows through.",
"Government corruption seems always to be reported in the past tense.",
"Half of conversation is listening.",
"He is all fault who has no fault at all.",
"He who dies with the most toys, wins!",
"He who does many things makes many mistakes, but never makes the biggest mistake of all - doing nothing.",
"He who endures, wins.",
"He who has been bitten by six dogs is legitimately suspicious of the seventh.",
"He who leaves nothing to chance will do very few things wrong, but he will do very few things at all.",
"He who lives on hope has a slender diet indeed.",
"He who looks too far ahead stumbles over his own boots.",
"He who would climb to the top must leave much behind.",
"He who would leap high must take a long run.",
"He who would pursue revenge should first dig two graves.",
"Hell is l is a city much like Newark.",
"Hell is not a place. Hell is what hurts worst.",
"History is the sum total of things that could have been avoided.",
"History occurs twice - the first time as tragedy, the second time as farce.",
"Honesty in politics is much like oxygen. The higher up you go, the scarcer it becomes.",
"Honesty is the best policy - unless, of course, you are dealing with your wife, your girlfriend, your banker, your employer, the I.R.S., your creditors...",
"How can you tell when a salesman is lying ? When his lips are moving.",
"How come nowadays the word “honesty“ is generally preceded by the phrase “old-fashioned“ ?",
"How long a minute is depends upon which side of the bathroom door you're on.",
"I get my exercise acting as a pallbearer for my friends who exercise.",
"If a cluttered desk is characteristic of a cluttered mind, what does an empty desk mean ?",
"If a problem causes too many meetings, then the meetings eventually become more important than the problem.",
"If all else fails, read the destructions.",
"If all the economists in the world were laid end to end, they couldn't reach a conclusion.",
"If an experiment works, something has gone wrong.",
"If builders constructed buildings the way programmers write programs, then the first woodpecker to come along would destroy civilization.",
"If doctors' intellects were as big as doctors' egos, this would be a far healthier world.",
"If everything appears to be going well, you obviously don't know what the hell is going on.",
"If it jams - force it. If it breaks, it needed replacing anyway.",
"If it's not in the computer, then it doesn't exist.",
"If it's rational, if it's logical, and if it makes good common sense, then it's simply not done.",
"If man's best friend is the dog, where does that leave the rest of us?",
" If mathematically you end up with the wrong answer, try multiplying by the page number.",
"If more than one person is responsible for a miscalculation, no one will be at fault.",
"If one views his problem sufficiently closely, he will recognize himself as part of the problem.",
"If someone gives you so-called good advice, do the opposite; you may be certain that that will be the right thing nine times out of ten.",
"If the facts are against you, argue the law. If the law is against you, pound the table and yell like hell.",
"If the first person who answers the phone can't handle your question, then it's a bureaucracy.",
"If the gods had really intended men to fly, they'd have made it easier to get to the airport.",
"If the government hasn't yet taxed, licensed, or regulated it, then it probably ain't worth anything.",
"If the nation's economists were all laid end to end, they would point in all directions.",
"If the plating work that we do for you is defective, we will refund your money, redo the parts free, close our plant, and have the plant manager shot. Will that be satisfactory ?",
"If the shoe fits, you're not allowing for growth.",
"If the thought of growing old bothers you, consider the alternative.",
"If the universe is indeed insane, who is the asylum keeper ?",
"If this is the land of the future, why are we all so given to nostalgia ?",
"If truth were a matter of opinion, then the majority would always be right.",
"If you are feeling good, don't worry; you'll get over it.",
"If you can keep your head while all about you are losing theirs, then you obviously don't understand what's going on.",
"If you cannot convince them, confuse them.",
"If you cannot logically refute a man's arguments, not all is lost. You can always call him nasty names.",
"If you cannot understand it, it is intuitively obvious.",
"If you disinfect the pond, you kill the lilies.",
"If you doubt that Rochesterians believe in God, watch how they drive.",
"If you gave a monkey control of its environment, it would fill the universe with bananas.",
"If you live among the wolves, learn to howl like them.",
"If you think that mental illness interferes with financial success, just look at the average television evangelist.",
"If you think that no one cares that you're alive, try missing a few car payments.",
"If you try to please everybody, nobody will like it.",
"If you want to make people angry, lie to them. If you want to make them absolutely livid, then tell 'em the truth.",
"If young women often do marry men like their fathers, no wonder their mothers cry at their weddings.",
"In America, the Secretary of Agriculture catches hell for unmanageable food surpluses; in Russia, his counterpart goes to Siberia because of unmanageable food shortages.",
"In a mad world, only greater madness succeeds.",
"In a permissive society, the cream rises to the top...and so does the scum.",
"In a world that runs on deceit, deception, and duplicity, the honest man is always at a disadvantage.",
"In any organization, there are only two people to contact if you want results:    the one at the very top and the one at the very bottom.",
"In case of doubt, make it sound convincing.",
"In death, avoid hell. In life, avoid the law courts.",
"In defeat, malice. In victory, revenge.",
"In designing any type of machine component, no overall dimension can be totalled accurately after 4:30pm Friday. The correct total will become self-evident at 8:15am on Monday.",
"In doing good, avoid notoriety. In doing evil, avoid self-awareness.",
"In hell, treason is the work of angels.",
"In jealousy, there is often more self-love than love.",
"In order to obtain a loan, you must first prove that you don't need it.",
"In some countries, Chaucer and Dante are the classics. In this country, it's a soft drink.",
"In the Beginning, God created the Organization and gave It dominion over man.  -Genesis, Article VII, section 3, paragraph C.",
"In the final analysis, entropy always wins.",
"In the long run, we are all dead.",
"In third-world politics, the people with the guns call the shots.",
"Injustice anywhere is a threat to justice everywhere.",
"Inside every short man is a tall man doubled over in extreme pain.",
"Instead of worrying about the boxes in your organizational chart, be concerned with the people who are boxed in.",
"Institutions are more rarely overthrown from without, more often corroded from within.",
"Interesting history is awful living.",
"Isn't it strange that the same people who laugh at gypsy fortune-tellers take economists seriously.",
"It doesn't much matter whom you marry, for tomorrow morning you discover that it was someone else.",
"It is a grave error to allow any mechanical device to realize that you are in a hurry.",
"It is axiomatic that even the strongest of men will fall before a pygmy with a submachine gun.",
"It is better to add life to your years than it is to add years to your life.",
"It is better to be envied than to be consoled.",
"It is better to resign from office than it is to die in office; that way, you get to hear some of the eulogies.",
"It is difficult to be politically conscious and upwardly mobile at the same time.",
"It is impossible to make anything foolproof because fools are so ingenious.",
"It is morally wrong to allow suckers to keep their money.",
"It is often easier to find the truth than it is to accept it.",
"It is only in Aesop's fables that an elephant takes advice from a mouse.",
"It is probably better to be insane with the rest of the world than to be sane alone.",
"It is the manner, and not the content, that marks a gentleman.",
"It is when the irritation of doubt causes a struggle to attain belief that the enterprise of thought begins.",
"It is wrong to repeat gossip, but what else can you do with it ?",
"It takes twenty-five dumb animals to make a fur coat. and only one to wear it.",
"It takes very little to make a woman happy, and more than is contained in heaven and earth to keep her that way.",
"It's difficult to soar with the eagles when you work with turkeys.",
"It's not social oppression that moves wild-eyed revolutionaries; it's envy, pure and simple.",
"It's not whether you win or lose, it's how you place the blame.",
"It's what you learn after you know it all that counts.",
"John Donne was wrong.",
"Journalism, like prostitution, is a career in which just one foray makes a professional.",
"Just because you are paranoid does not mean that no one is following you.",
"Justice must not only be done; it must be seen to be believed.",
"Kill the moneylenders.",
"Knowledge can cure ignorance, but intelligence cannot cure stupidity.",
"Labor disgraces no man, but often a man disgraces labor.",
"Large brains can contain small minds.",
"Last weke I cudn't even spel kumpooter programer and today I are one!",
"Law remains long after justice flees.",
"Leakproof seals - will. Selfstarters - will not. Interchangeable parts - won't.",
"Leftover nuts never match leftover bolts.",
"Less of a good thing is sometimes better - ask anyone on a diet.",
"Life is a learning experience; the diploma is your death certificate.",
"Life is a temporary assignment.",
"Life is a terminal condition.",
"Life's a bitch. But, then, consider the alternative.",
"Little boys throw stones in jest. Little frogs die in earnest.",
"Live every day as though it were your last. One day, you'll be right.",
"Live within your income, even if you must borrow to do it.",
"Locks and keys are for honest people.",
"Lost causes are the only ones worth fighting for.",
"Luck, it is said, dislikes working double shifts.",
"Making this world better will gain you the greatest credit in the next one.",
"Man does not live by bread alone. But he damned well doesn't live without it, either.",
"Many know how to flatter; few know how to praise.",
"Marriage is like burning the house down to toast the bread.",
"Marriage is the only adventure open to the cowardly.",
"May you live in interesting times.",
"Mayflies continually plot to topple the cedar.",
"Measure twice 'cause you can only cut once.",
"Measured with a micrometer. Marked with chalk. Cut with an axe.",
"Men and nations will act rationally when all other possibilities have been exhausted.",
"Men heap together the mistakes of their lives and create a monster they call destiny.",
"Middle age is when you wonder if your warranty is running out.",
"Miles aren't the only distance.",
"Monotony is the law of Nature. Observe the monotonous manner in which the sun rises.",
"More men are sheep in wolves' clothing than the other way around.",
"Most men and nations die lying down.",
"Mother Nature applies all her rules...all the time.",
"Motor gently through the greasemud, for there lurks the skid demon.",
"Murphy's Golden Rule:    Whoever has the gold makes the rules.",
"Murphy's Law: If it can go wrong, it will...at the worst possible time and in the worst possible place. Fisher's Law: Murphy was an optimist.",
"Nature always sides with the hidden flaw.",
"Never argue with a fool...people may not be able to tell you apart.",
"Never claim as a right that which you can ask as a favor.",
"Never climb a fence when you can sit on it.",
"Never complain; never explain.",
"Never do card tricks for the group you play poker with.",
"Never eat prunes when you are famished.",
"Never embezzle more than your employer can afford.",
"Never get into a fight with an ugly person. He has nothing to lose.",
"Never get mixed up with economists. Their thinking is muddy and they have bad breath.",
"Never have so many people understood so little about so much.",
"Never invest in anything that eats or needs repainting.",
"Never let your sense of morality stop you from doing what is right.",
"Never make the same mistake twice...there are so many new ones to make!",
"Never marry a woman who prays too much.",
"Never mistake good manners for good will.",
"Never play leapfrog with a unicorn.",
"Never question your wife's judgement...look whom she married.",
"Never step in anything soft.",
"Never trust anyone who laughs at his own one-liners.",
"Never try to teach a pig how to sing. It is a waste of time and it annoys the pig.",
"Never underestimate the power of stupidity.",
"Never, ever trust anyone under 30 or over 25.",
"Never, ever, insult a telephone answering machine. They have ways of getting even.",
"New systems generate new problems.",
"Next to being shot at and missed, nothing is really quite as satisfying as an income tax refund.",
"No class of Americans has ever objected to any amount of government meddling if it appeared to benefit that particular class.",
"No man's knowledge goes beyond his experience.",
"No man's life, liberty, or property are safe whilst the legislature is in session.",
"No matter how bad your kid is, he's still good for a tax exemption.",
"No matter how long or how diligently you shop for a machine, once you've purchased it, it will be on sale for 30% less.",
"No name, no matter how simple, can be correctly understood over the phone.",
"No one can make you feel inferior without your consent.",
"No one ever found marvels by seeking them.",
"No one gets too old to learn a new way of being stupid.",
"Not all the kookies are in the jar.",
"Nothing dispels enthusiasm like a small admission fee.",
"Nothing in our history is plainer, or more tragic, than the gulf between cleverness and wisdom.",
"Nothing in the universe arouses more false hopes than the first four hours of a diet.",
"Nothing irritates a standard American corporate executive quite so much as the sight of someone actually daring to practice capitalism.",
"Nothing is illegal if 100 businessmen decide to do it.",
"Nothing is really labor unless you would rather be doing something else.",
"Nothing motivates a man more than to see his boss put in an honest day's work.",
" Odds are, the phrase “It's none of my business“ will be followed by “but“.",
"Of those teaching in today's schools, 80 percent are paid twice what they are worth and 20 percent are paid half what they are worth.",
"Old age is like a burglar. It robs you of all the goodies and leaves the rubbish.",
"Old men and comets have long been revered for the same reasons; their long beards and their supposed ability to foretell events.",
"Old men make wars. Young men fight them.",
"On the ONE day you take your secretary to lunch, your wife will be lunching in the same restaurant.",
"Once upon a time, there were two Chinamen. Now look how many there are.",
"Once you understand the problem, you find that it is worse than you expected.",
"One goddamned thing leads to another goddamned thing.",
"One good thing about living on a farm is that you can fight with your wife and ain't nobody gonna hear.",
"One lawyer = a crook. Two lawyers = a law firm. Three or more lawyers = a legislature.",
"One may generally observe a singular accord between supercelestial ideas and subterranean behavior.",
"One sees more clearly backward than forward.",
"One thing you can say for kids: they don't go around showing pictures of their grandparents.",
"Opportunity always knocks at the least opportune moment.",
"Our architect's plans for plant renovation begin with a precision air strike.",
"Peace is a premise the existence of which we have deduced from the intervals between wars.",
"People are always available for work in the past tense.",
"People use the most words when they are the least certain of what they are saying.",
"People who cough a lot never go to the doctor...just to movies, concerts, and lectures.",
"People who have no faults are terrible: there is no way to take advantage of them.",
"People who live in a golden age complain that everything looks yellow.",
"People, like turtles, make little progress without sticking their necks out.",
"Pessimists are the world's happiest people.... Ninety percent of the time they are right, and the other ten percent they are pleasantly surprised.",
"Pinocchio was such a dolt to try to become a human being. He was much better off with a wooden head.",
"Policemen with private motives are dangerous.",
"Political cunning should never be mistaken for intelligence.",
"Politicians are much like ships: noisiest when lost in a fog.",
"Politicians deal with the public on the basis of the mushroom policy: Keep them in the dark and feed them manure.",
"Practical politics consists of ignoring the facts. Come to think of it, practical anything consists of that.",
"Proctologist's revenge: put Ben-Gay in a guy's tube of Nupercainal.",
"Proof-positive that Eastern and Western technologies can indeed work together: the Teflon-coated wok.",
"Psychopaths aren't born. They are made.",
"Rabbits dance at the funeral of the lion.",
"Reality precedes perception. Except, of course, in southern California.",
"Remember the good old days When juvenile delinquency was observed mainly in juveniles",
"Remember when “There's something in the air“ was just a figure of speech",
"Respect for ourselves guides our morals; deference to others governs our manners.",
"Revenge is a dish best served cold.",
"Roughing it is television without cable.",
"Rumors are the sauce of a dry life.",
"Saints engage in introspection while burly sinners run the world.",
"Scandal, like hypocrisy, is bipartisan.",
"Science has finally found what distinguishes Man from the other beasts: financial worries.",
"Serendipity is looking in a haystack for a needle and finding the farmer's daughter.",
"Show me anything whereof it may be said “See, this is new,“ and I will show you it hath been.",
"Shrink not from blasphemy - t'will pass for wit.",
"Simple pleasures are the last refuge of the complex.",
"Since few large pleasures are lent to us on a long lease, it is wise to cultivate a large undergrowth of small pleasures.",
"Small things entertain small minds.",
"Smooth seas never made a good sailor.",
"Some people are always lost in thought; other people lack thoughts large enough to be lost in.",
"Some people can look so busy that they seem indispensable.",
"Some people can stay longer in an hour than others can in a week.",
"Some people manage by the book, even though they don't know who wrote the book or even what book.",
"Sometimes it is good to be only a fly when giants are fighting for the heavens.",
"Sometimes, a cigar is just a cigar.     - S. Freud",
"Songs unheard are sweeter far.",
"Stress is that condition created when the mind overrides the body's basic desire to choke the living shit out of some asshole who desperately needs it.",
"Strong words connote weak arguments.",
"Succeeding is more satisfying than success.",
"Success consists of reaching 40 before your waist does.",
"Support your local bloodhound. Get lost.",
"Sympathy is what you give a relative when you don't want to lend him cash.",
"Take care which rut you choose; you'll be in it for the next ten years.",
"Taking something with a grain of salt may raise your blood pressure.",
"Tatoos are the common man's way of investing in art.",
"Television is chewing gum for the eyes.",
"Tell a man that there are 500 million trillion stars in the universe and he will believe you. Tell him that there's wet paint on that bench....",
"Tempt not a desperate man.",
"That which is crooked cannot be made straight, although there are psychotherapists who might disagree.",
"The Boy Scout credo: sound mind, sound body...take your choice.",
"The British parliament is called the “Mother of Legislatures“. A somewhat similar term is often applied to Congress.",
"The Devil's greatest triumph was convincing the modern world that he doesn't exist.",
"The Russians will never invade us...there's no place to park.",
"The attention span of a computer is only as long as its electrical cord.",
"The average U.S. taxpayer is proud to be paying taxes. Of course, he could be just as proud for half the money.",
"The best bilge pump in the world is a terrified sailor with a bucket.",
"The best way to achieve immortality is by not dying.",
"The best way to attract money is to give the appearance of having it.",
"The best way to avoid growing old is not to be born so soon.",
"The best way to make fire with two sticks is to insure that one of them is a match.",
"The best way to save face is to keep the lower half closed.",
"The bigger they are, the harder they punch.",
"The biggest idiot can ask questions the smartest man cannot answer.",
"The danger in being king is that after a while you begin to believe you really are one.",
"The deepest and most important virtues are often the dullest ones.",
"The degree of technical competence is inversely proportional to the level of management.",
"The fifteen minute morning coffee break is when your employees take a break from doing nothing.",
"The first great gift that we can bestow upon others is a good example.",
"The first place in which to look for something is the last place in which you expect to find it.",
"The fraudulence of the exercise is proportional to the margin of victory.",
"The galaxy is full of dishonorable men ...Well, everyone's got to make a living.",
"The gap between theory and practice is filled with apology.",
"The great classes of people will more easily fall victims to a great lie than to a small one.",
"The great tragedy of our era is not the significance of things but the insignificance of things.",
"The healthy stomach is nothing if not conservative; few radicals have good digestions.",
"The human brain is a wonderous instrument. It starts working the moment you wake up and doesn't stop until you get to the office.",
"The last man on Earth sat alone in a room. There was a knock on the door...",
"The last time doctors went on strike, the death rate dropped thirty percent.",
"The later you are for your flight, the more times you have to go through the metal detector.",
"The law, in its majestic equality, forbids the rich as well as the poor to sleep under bridges, beg in the streets, and steal bread.",
"The lawyer's credo: if you can't dazzle 'em with brilliance, baffle 'em with bullshit.",
"The light at the end of the tunnel is the headlamp of an oncoming train.",
"The longer you wait in line, the greater the probability that it is the wrong line.",
"The man who is always talking about being a gentleman never is one.",
"The more cordial the buyer's secretary, the greater the probability that the competition already has the order.",
"The most beautiful days of the year are always the days just before and just after your vacation.",
"The most successful journey is a dull journey.",
"The mouse dreams dreams that would terrify the cat.",
"The nice thing about scientific studies is that you can always find one that proves conclusively that your product is safe and that your competitor's causes cancer.",
"The number of employees in any work group tends to increase irrespective of the amount of work to be done.",
"The number of people watching you is directly proportional to the stupidity of what you're doing.",
"The one time in the day that you lean back and relax is the one time the boss comes strolling through the plant.",
"The only government handout that I want is the government's hand out of my pocket.",
"The only imperfect thing in nature is the human race.",
"The only people that snobs want to know are those who don't want to know them.",
"The only people to profit from the mistakes of others are biographers.",
"The only perfect science is hindsight.",
"The only thing worse than a male chauvinist pig is the female version.",
"The only things in history that are inevitable are those that have already happened.",
"The only valid generalization that can be made about scientists is that they require unlimited resources for improbable projects of interminable gestation periods.",
"The opera ain't over 'til the fat lady sings.",
"The opulence of the front office decor varies inversely with the fundamental solvency of the firm.",
"The organization of any bureaucracy is very much like a septic tank....The really big chunks always rise to the top.",
"The person who buys the most raffle tickets has the least chance of winning.",
"The person who marries for money generally ends up earning it.",
"The person who snores the loudest will fall asleep first.",
"The price of total freedom is total anarchy. The price of total security is total enslavement.",
"The primary function of the design engineer is to make things difficult for the fabricator and impossible for the serviceman.",
"The probability of a piece of bread falling with the buttered side down is proportional to the cost of the carpet.",
"The probability of your alarm not going off increases in direct proportion to the importance of your 8:00am meeting.",
"The promises of maniacs, like those of salesmen, are not safely relied upon.",
"The race is not always to the swift, nor the battle to the strong, but that's the way to bet 'em.",
"The rat race is over. The rats won.",
"The real crime in education today is not the way we treat teachers but whom we allow to be teachers.",
"The real outrage today isn't what's illegal. It's what is legal.",
"The reason the way of the sinner is hard is because it is so crowded.",
"The reason why worry kills more people than work does is that more people worry than work.",
"The repairman will never have seen a model quite like yours before.",
"The saddest of words: I always wanted to but never did.",
"The secret of staying young is finding an age that you really like and then sticking with it.",
"The secret of success is sincerity. Once you can fake that, you've got it made.",
"The ship of state is the only ship that leaks at the top.",
"The smaller the issue, the bigger the fight.",
"The sole reliable test of a first-rate intelligence is to hold two opposite ideas in the mind whilst still retaining the ability to tie one's own shoe laces.",
"The sooner man begins to spend his wealth, the better he uses it.",
"The strongest part of any paper form is the perforation.",
"The successful enjoyment of vice requires training and long practice.",
"The sun ariseth and the sun goeth down, and the same things come alike to the righteous and the wicked.",
"The supreme irony of life is that hardly anyone gets out of it alive.",
"The tale of the errant entrepreneur: High chair; high school; high hopes; high finance; “Hi, Warden!“.",
"The universe is governed by a committee; no one man could make that many mistakes.",
"The very same American textile industry that lobbies hysterically against the import of textile products imports virtually all its textile manufacturing machinery...I wonder why",
"The whole of life is futile unless you regard it is a sporting proposition.",
"The world is a comedy to those that think, a tragedy to those that feel.",
"The world is disgracefully managed; one hardly knows to whom to complain.",
"Them that has, gets.",
"There are no moral messages in Nature.",
"There are only four basic plots in life, and nine in literature.",
"There are those who make things happen. There are those who watch things happen. And there are those who wonder what happened.",
"There are three rules for successfully managing people: Unfortunately, no one knows what they are.",
"There are three types of deliberate falsehoods: lies, damned lies, and salesmen's promises.",
"There are two kinds of men who never amount to much: those who cannot do what they are told, and those who can do nothing else.",
"There are two periods in which Congress does no business: one is before the holidays and the other is after.",
"There is a time for everything. Mostly, the wrong time.",
"There is always one more son of a bitch than you counted on.",
"There is an optimal size for any project, and it is always bigger than you can afford.",
"There is no truth in the rumor that man is immortal.",
"There is nothing like a grievance to sharpen an old man's wits.",
"There is nothing more terrible than ignorance in action.",
"There is nothing wrong with you that an expensive surgical operation cannot prolong.",
"There is wisdom in madness and strong probability of truth in all accusations, for people are complete, and everybody is capable of anything.",
"There's nothing wrong with gluttony...providing you don't overdo it.",
"These days, an education is essential for career success. Unless, of course, you run for Congress.",
"They don't invite you to the White House for a drink because they think you are thirsty.",
"Things get worse under pressure.",
"Those who beat their swords into plowshares generally end up plowing for those who didn't.",
"Those who can - do. Those who can't - teach. Those totally devoid of useful ability become government economists.",
"Those who can't teach - administer. Those who can't administer - run for public office.",
"Those who do not follow are dragged.",
"Those who do not learn from history often end up making it.",
"Those who like sausage or political policy should not watch either being made.",
"Time is a great teacher, but it kills all its pupils.",
"To a little fish, the waters are always deep.",
"To a man with a hammer, everything looks like a nail.",
"To a weary horse, even his own tail is a burden.",
"To err is human. To really foul things up requires a computer. To create utter chaos with no perceivable possibility of salvation calls for an MBA.",
"To have honesty coupled to beauty is to have honey the sauce to sugar.",
"To hear tell a hundred times is not as good as once seeing.",
"To spot the true expert, pick the one who predicts the job will take the longest and cost the most.",
"To understand the clay is not to understand the pot.",
"Today's conservative is yesterday's liberal who got mugged last night.",
"Too much of anything is wonderful.",
"Truth is a hard master to serve, for the more devotedly you serve her, the more she hurts you.",
"Truth is very precious, so salesmen and politicians use it very sparingly.",
"Tyranny is always better organized than freedom is.",
"Under some conditions, in some place, at some time, there will always be at least one law, ordinance, or statute under which you can be booked.",
"Under the most rigorously controlled conditions of temperature, pressure, humidity, time, and voltage, the machine will do as it damned well pleases.",
"Unfaithfulness in the keeping of an appointment is an act of clear dishonesty.",
"You may as well take a person's money as his time.",
"Universities are full of knowledge. The freshmen bring a little in and the seniors take none away, so knowledge accumulates.",
"Virtue does not lend itself to the same verbal enthusiasms that vice does.",
"Virtue is a social liability.",
"We ain't cheap, but by gosh, we're good!",
"We are all passengers in the leaky rowboat of life. So, bail faster, damn it!",
"We are inclined to believe those whom we do not know because they have never deceived us.",
"We do not know who first discovered water. However, we are confident that it was not a fish.",
"We don't know one millionth of one per cent about anything.",
"We know what we are, but not what we may be.",
"Welcome to the totally-automated, fully computerized world of the twenty-first century, where nothing can go wrong...go wrong...go wrong...",
"What do the lie detector and Wonder Woman have in common They were invented by the same person. Kinda figures, doesn't it.",
"What do you call 500 bureaucrats at the bottom of the Potomac river ? A start.",
"What people say behind your back is your standing in the community.",
"What the large print giveth, the small print taketh away.",
"Whatever is not nailed down is the government's. Whatever the government can pry loose is not nailed down.",
"When I works, I works fast. When I plays, I plays hard. And when I thinks, I falls asleep.",
"When a broken machine is demonstrated for the repairman, it will work perfectly.",
"When a man dies, he does not die just of the disease he has; he dies of his whole life.",
"When anything is used to its full potential, it will break.",
"When comes the revolution, things will be different - not better, just different.",
"When in doubt, mumble. When in trouble, delegate.",
"When in trouble or in doubt, Run in circles, yell and shout.",
"When men are easy in their circumstances, they are naturally enemies to innovation.",
"When smashing monuments, always save the pedestals - they come in handy.",
"When the hounds bay, the fox and the rabbit are brothers.",
"When the mouse laughs at the cat, there is a hole very near by.",
"When the old dog barks, better look out the window.",
"When there is no danger in fighting, there is no glory in winning.",
"When you do not know what you are doing, do it neatly.",
"When you've read about one train wreck, you've read about them all.",
"Whenever a man casts a longing eye at public office, a rottenness appears in his conduct.",
"Whenever a system becomes completely defined, some damned fool discovers something which either abolishes the system or expands it totally beyond recognition.",
"Where you stand on an issue depends upon where you sit.",
"Who mourns the falling of a single leaf ?",
"Whom the gods would destroy, they first make mad.",
"Why do they always start off the evening news with “Good evening“ when all they do is tell you why it isn't ?",
"Why is there always so much month left at the end of the money ?",
"Why long for glory, which one despises as soon as one has it ?",
"Women like silent men. They think they're listening.",
"Women's taste in neckties is as bad as men's in chintz.",
"Work smarder and not harder and be careful of yor speling.",
"Workers these days don't mind putting in an honest day's work. Trouble is, it takes 'em a week to do it.",
"Would that reason were as contagious as emotion.",
"Would you fly in an airliner designed and built by the lowest bidder?",
"Yea, though I walk thru the valley of the shadow of death, I shall fear no evil, 'cause I'm the meanest s.o.b. in the valley.",
"Years ago, the symbol of America was the bald eagle. Today, it is the beer bottle on the side of the road.",
"You can get more with a kind word and a gun than you can with a kind word.",
"You can never tell which way the train went by looking at the track.",
"You can say this for death and taxes: when you are done with one, you're done with the other.",
"You can't drown your troubles, not the real ones, because if they are real, they can swim.",
"You can't have a clear head when there is a sword hanging over it.",
"You can't win.",
"You cannot do a kindness too soon, for you never know when it will be too late.",
"You cannot reason a man out of that which he has not been reasoned into.",
"You cannot tame a tiger by pulling but one of his teeth.",
"You know that it's gonna be a bad day when you call Suicide Prevention and they put you on hold.",
"You know you are in trouble when you come to work in the morning and the boss tells you not to take off your coat.",
"You know you are in trouble when your only son tells you he wishes Anita Bryant would mind her own business.",
"You may not get what you pay for, but you always pay for what you get.",
"You never know how many friends you have until you own a house at the beach.",
"You only go around once, and there's not enough gusto for everyone.",
"You rarely observe a mob rushing across town to do a good deed.",
"You've one mouth and two ears...use them in that proportion.",
"Your freedom to swing your arm ends where my nose begins.",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(challenge)/i,
			callback: function(data) {
                if (!kingofthehill) {
                    kingofthehill=data.user;
				sock.chat(sformat(arand(this.responses)));
				}
                else {
                    if (data.user===kingofthehill) {
					sock.chat("You slice your neck, and die.", data.user);
                    kingofthehill=!kingofthehill 
                    }
                    else
                        sock.chat("@Gorness You begin to fight "+kingofthehill);
                    challenger=data.user;
					}
            },
			responses: [
				"You step onto the hill, and get ready for any contestants.",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /You begin to fight/i,
			callback: function(data) {
                if (data.user) {
				sock.chat(sformat(arand(this.responses)));
				}
                else {
                    if (data.user===kingofthehill)
					sock.chat("Error", data.user);
                    else
                        sock.chat("@Gorness You begin to fight "+kingofthehill);
					}
            },
			responses: [
				"The first one to say '@Gorness attack' wins. ⚔",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(attack)/i,
			callback: function(data) {
                if (data.user===challenger) {
				sock.chat(sformat(arand(this.responses)));
                    challenger=!challenger
                    kingofthehill=!kingofthehill
                    kingofthehill=data.user
				}
                else {
                    if (data.user===kingofthehill) {
					sock.chat("You successfully defend against the challenger.", data.user);
                    challenger=!challenger
                    }
                    else
                        sock.chat("You need to challenge "+kingofthehill);
					}
            },
			responses: [
				"You overthrow the king, and become the new king.",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(help)/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
				},
			responses: [
                "commands: hipfire, wisdom, game, lottery, aaaand even more",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(game)/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
				},
			responses: [
				"games available: justice, challenge, rock/paper/scissors",
				]
			},
		{
                        name: "Advice",
			short: "@bot who should i...",
			regex: /^(command)/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
				},
			responses: [
				"under evaluation",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(lottery)/i,
			callback: function(data) {
                if(!lottery) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
                lottery=data.user;
                }
                else {
					sock.chat("Lottery shop closed.", data.user);
					}
				},
			responses: [
				"The winner of the lottery is... $1! Prize: 1 tub of ice-cream",
                "The winner of the lottery is... $1! Prize: 1 shark tank",
                "The winner of the lottery is... $1! Prize: 1 apple",
                "The winner of the lottery is... $1! Prize: 1 mouse-pad",
                "The winner of the lottery is... $1! Prize: 1 tree-house",
                "The winner of the lottery is... $1! Prize: immunity for day 1.",
                "The winner of the lottery is... $1! Prize: A macbook pro",
                "The winner of the lottery is... $1! Prize: An iphone 4",
                "The winner of the lottery is... $1! Prize: An iphone 4S",
                "The winner of the lottery is... $1! Prize: An iphone 5",
                "The winner of the lottery is... $1! Prize: An iphone 6",
                "The winner of the lottery is... $1! Prize: An iphone 7",
                "The winner of the lottery is... $1! Prize: A broken xylphone",
                "The winner of the lottery is... $1! Prize: A strawberry",
                "The winner of the lottery is... $1! Prize: 6 eggs.",
                "The winner of the lottery is... $1! Prize: Everyone congratulates $1 on its win!",
                "The winner of the lottery is... $1! Prize: A mushroom steak",
                "The winner of the lottery is... $1! Prize: A drink of pure water from Tuolumne river",
                "The winner of the lottery is... $1! Prize: n1'ed",
                "The winner of the lottery is... $1! Prize: A golf club",
                "The winner of the lottery is... $1! Prize: Shrooms",
                "The winner of the lottery is... $1! Prize: Cocaine",
                "The winner of the lottery is... $1! Prize: A compliment. Type '@Gorness compliment' for a compliment.",
                "The winner of the lottery is... $1! Prize: A drink of pure water from Murray river",
                "The winner of the lottery is... $1! Prize: A baby elephant to raise",
                "The winner of the lottery is... $1! Prize: A mouse trap",
                "The winner of the lottery is... $1! Prize: A mouse trap",
                "The winner of the lottery is... $1! Prize: Good luck for the rest of the game.",
                "The winner of the lottery is... $1! Prize: Bad luck for the rest of the game.",
                "The winner of the lottery is... $1! Prize: A gun",
                "The winner of the lottery is... $1! Prize: A floatation device",
                "The winner of the lottery is... $1! Prize: A floatation device infested with rats",
                "The winner of the lottery is... $1! Prize: A yo-yo",
                "The winner of the lottery is... $1! Prize: A deck of cards (the 5 of clubs is missing)",
                "The winner of the lottery is... $1! Prize: A mirror",
                "The winner of the lottery is... $1! Prize: The horn of an elephant",
                "The winner of the lottery is... $1! Prize: A insult. Type '@Gorness insult' to recieve your free insult.",
                "The winner of the lottery is... $1! Prize: A fork",
                "The winner of the lottery is... $1! Prize: A knife",
                "The winner of the lottery is... $1! Prize: A spoon",
                "The winner of the lottery is... $1! Prize: A mysterious egg.",
                "The winner of the lottery is... $1! Prize: A deck of cards (the 8 of spades is missing).",
                "The winner of the lottery is... $1! Prize: A deck of cards (the ace of hearts is missing).",
                "The winner of the lottery is... $1! Prize: A deck of cards (the coloured joker is missing).",
                "The winner of the lottery is... $1! Prize: A free trip to GTFO for 7 days",
                "The winner of the lottery is... $1! Prize: A free trip to antarctica for 7 days",
                "The winner of the lottery is... $1! Prize: 1 stray cat",
                "The winner of the lottery is... $1! Prize: 2 kittens",
                "The winner of the lottery is... $1! Prize: A girlfriend",
                "The winner of the lottery is... $1! Prize: A boyfriend",
                "The winner of the lottery is... $1! Prize: A free book. Type '@Gorness library' to recieve your free book!",
                "The winner of the lottery is... $1! Prize: A stapler",
                "The winner of the lottery is... $1! Prize: A constant humming noise in the back of your head which never stops unless you kill one of your closest family members",
                "The winner of the lottery is... $1! Prize: A sock-puppet",
                "The winner of the lottery is... $1! Prize: A crystal ball",
                "The winner of the lottery is... $1! Prize: 1 loaf of bread",
                "The winner of the lottery is... $1! Prize: A picture of $1",
                "The winner of the lottery is... $1! Prize:  $1.",
                "The winner of the lottery is... $1! Prize:  A lemon",
                "The winner of the lottery is... $1! Prize:  Coal",
                "The winner of the lottery is... $1! Prize:  A potato",
                "The winner of the lottery is... $1! Prize:  Another lottery ticket to a knock-off lottery called 'lootery', type @Gorness lootery to access.",
                "The winner of the lottery is... $1! Prize:  Fly-spray",
                "The winner of the lottery is... $1! Prize:  A lazer pointer",
                "The winner of the lottery is... $1! Prize:  A head.",
                "The winner of the lottery is... $1! Prize:  a bag of money",
                "The winner of the lottery is... $1! Prize:  A 100ml can of lemonade",
                "The winner of the lottery is... $1! Prize:  A 100ml can of coke",
                "The winner of the lottery is... $1! Prize:  A magazine",
                "The winner of the lottery is... $1! Prize:  A microwave",
                "The winner of the lottery is... $1! Prize:  An oven",
                "The winner of the lottery is... $1! Prize:  An ant-eater",
                "The winner of the lottery is... $1! Prize:  A drill",
                "The winner of the lottery is... $1! Prize:  Soap",
                "The winner of the lottery is... $1! Prize:  A dog toothbrush",
                "The winner of the lottery is... $1! Prize:  A chess board",
                "The winner of the lottery is... $1! Prize:  A checkers board",
                "The winner of the lottery is... $1! Prize:  A monopoly game",
                "The winner of the lottery is... $1! Prize:  <3",
                "The winner of the lottery is... $1! Prize:  A turkey",
                "The winner of the lottery is... $1! Prize:  A melon",
                "The winner of the lottery is... $1! Prize:  A watermelon",
                "The winner of the lottery is... $1! Prize:  A jigsaw puzzle",
                "The winner of the lottery is... $1! Prize:  A can of tuna",
                "The winner of the lottery is... $1! Prize:  A photo of a dog",
                "The winner of the lottery is... $1! Prize:  A dog",
                "The winner of the lottery is... $1! Prize:  A jack in the box",
                "The winner of the lottery is... $1! Prize:  A tamagotchi",
                "The winner of the lottery is... $1! Prize:  10 gallons of petrol",
                "The winner of the lottery is... $1! Prize:  A wristband. It reads: ???????",
                "The winner of the lottery is... $1! Prize:  A wristband. It reads: ?????? ?????",
                "The winner of the lottery is... $1! Prize:  A wristband. It reads: ???? ?? ?????",
                "The winner of the lottery is... $1! Prize:  A wristband. It reads: ?????????",
                "The winner of the lottery is... $1! Prize:  A wristband. It reads: ?? ??ℯ ????ℯ?? ????ℊℴ???, ?ℯ?? ??ℯ ??? ℴ? ?ℴ??? ??ℯ????",
                "The winner of the lottery is... $1! Prize:  A boombox",
                "The winner of the lottery is... $1! Prize:  A candy cane",
                "The winner of the lottery is... $1! Prize:  christmas lights",
                "The winner of the lottery is... $1! Prize:  A frying pan",
                "The winner of the lottery is... $1! Prize:  A pillow",
                "The winner of the lottery is... $1! Prize:  A photo of a photo of a dog",
                "The winner of the lottery is... $1! Prize:  A spanish tutor",
                "The winner of the lottery is... $1! Prize:  A slogan: 'θα νικήσουμε'",
                "The winner of the lottery is... $1! Prize:  A slogan: 'είμαι ο καλύτερος'",
                "The winner of the lottery is... $1! Prize:  A slogan: 'cyka blyat'",
                "The winner of the lottery is... $1! Prize:  A medium sized popcorn",
                "The winner of the lottery is... $1! Prize:  A small sized popcorn",
                "The winner of the lottery is... $1! Prize:  A large sized popcorn",
                "The winner of the lottery is... $1! Prize:  A drinking fountain",
                "The winner of the lottery is... $1! Prize:  A 6 meter pool",
                "The winner of the lottery is... $1! Prize:  A log",
                "The winner of the lottery is... $1! Prize:  A cloud of puff",
                "The winner of the lottery is... $1! Prize:  A flower pot",
                "The winner of the lottery is... $1! Prize:  A golf club",
                "The winner of the lottery is... $1! Prize:  A rose",
                "The winner of the lottery is... $1! Prize:  A make-up set",
                "The winner of the lottery is... $1! Prize:  An invisibility cloak",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(lootery)/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
				},
			responses: [
				"CONGRATULATIONS  $1 $1 $1 YOU WIN!!! CONGRATULATIONS $1 ! YOU WIN $1 $1 $1 !!!!!! CONGRATULATIONS"
				]
			},
		{
			name: "Roll dice",
			short: "@bot roll dice or @bot d20",
			regex: /\bdice|\bd(\d+)/i,
			callback: function(data, d) {
				sock.chat(sformat(arand(this.responses), [
					Math.floor(Math.random()*(+d || 20)), +d || 20
					]), data.user);
				},
			responses: [
				"i rolled a d$2 and got $1", "the dice say $1",
				"the bottle landed on $1", "the wind says $1",
				"you get $1 out of $2", "the jar contains $1 jellybeans",
				"jesus told me the answer is $1", "do it yourself",
				"i dumped $2 chocolate chips in a pan and baked $1 cookies", "no"
				]
			},
		{
			name: "Roulette",
			short: "@bot roulette",
			regex: /roul+et+e/i,
			callback: function(data) {
				if(roulette) {
					var	user=data.user,
						data=this;
					sock.chat(roulette+" chambers left. You put the gun to your head...", user);
					setTimeout(function() {
						if(Math.random()*roulette>1) {
							roulette--;
							sock.chat(sformat("$1, $2, and nothing happens.", [
								arand(data.message1),
								arand(data.message2)
								]), user);
							}
						else {
							roulette=0;
							sock.chat(sformat("$1, $2, and $3.", [
								arand(data.message1),
								arand(data.message2),
								arand(data.message3)
								]), user);
							sock.vote(user, "gun");
							}
						}, 3000);
					}
				},
			message1: [
				"Wet your pants", "Gulp", "Get ready", "Say your prayers"
				],
			message2: [
				"pull it", "pull the trigger", "let it rip", "gently tug"
				],
			message3: [
				"die instantly", "kiss the bullet", "meet Jesus", "die internally"
				]
			},
		{
			name: "Bomb fight",
			short: "@bot fight me",
			regex: /fig?h?te? ?me/i,
			callback: function(data) {
				autobomb=data.user;
				sock.chat("ok", data.user);
				}
			},
		{
            name: "Obey",
			regex: /^fry/i,
			callback: function(data) {
				if(data.user) {
					sock.chat("i will", data.user);
					}
				else {
					sock.chat("i belong to "+master, data.user);
					}
				}
			},
		{
			name: "Obey",
			regex: /^be? my \w|take my command|obey|obey m/i,
			callback: function(data) {
				if(!master) {
					master=data.user;
					sock.chat("yes master...", data.user);
					}
				else {
					sock.chat("i belong to "+master, data.user);
					}
				}
			},
		{
             name: "Obey",
			regex: /^be free|free|befree/i,
			callback: function(data) {
				if(master) {
					master=!master
					sock.chat("yes sir...", data.user);
					}
				else {
					sock.chat("A master is out "+master, data.user);
					}
				}
			},
		{
            name: "Send vote (nl)",
			regex: /^nl|^vote no one|no lynch|vote nl|vote no one/i,
			callback: function() {
				sock.vote("*");
				}
			},
		{
            name: "Toggle Jeeves",
			short: "/afk",
			regex: /^Greetings./i,
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
				sock.chat(afk ?
					"Jeeves will handle your affairs." :
					"Jeeves has been dismissed."
					);
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
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"/me rolls over",
				"/me rolls over for senpai"
				]
			},
          {
              name: "Sing",
            short: "@bot sing",
            regex: /^doge/i,
            callback: function(data){
                var msgArray = ["░░░░░░░░▌▒█░░░░░░░░░░░▄▀▒▌░░░░░░░░░░░░░ ░░░░░░░░▌▒▒█░░░░░░░░▄▀▒▒▒▐░░░░░░░░░░░░░ ░░░░░░░▐▄▀▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐░░░░░░░░░░░░░", "░░░░░▄▄▀▒░▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐░░░░░░░░░░░░░ ░░░▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌░░░░░░░░░░░░░ ░░▐▒▒▒▄▄▒▒▒▒░░░▒▒▒▒▒▒▒▀▄▒▒▌░░░░░░░░░░░░", "░░▌░░▌█▀▒▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐░░░░░░░░░░░░ ░▐░░░▒▒▒▒▒▒▒▒▌██▀▒▒░░░▒▒▒▀▄▌░░░░░░░░░░░ ░▌░▒▄██▄▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒▌░░░░░░░░░░░", "▀▒▀▐▄█▄█▌▄░▀▒▒░░░░░░░░░░▒▒▒▐░░░░░░░░░░░ ▐▒▒▐▀▐▀▒░▄▄▒▄▒▒▒▒▒▒░▒░▒░▒▒▒▒▌░░░░░░░░░░ ▐▒▒▒▀▀▄▄▒▒▒▄▒▒▒▒▒▒▒▒░▒░▒░▒▒▐░░░░░░░░░░░", "░▌▒▒▒▒▒▒▀▀▀▒▒▒▒▒▒░▒░▒░▒░▒▒▒▌░░░░░░░░░░░ ░▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▒▄▒▒▐░░░░░░░░░░░░ ░░▀▄▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▄▒▒▒▒▌░░░░░░░░░░░░", "░░░░▀▄▒▒▒▒▒▒▒▒▒▒▄▄▄▀▒▒▒▒▄▀░░░░░░░░░░░░░ ░░░░░░▀▄▄▄▄▄▄▀▀▀▒▒▒▒▒▄▄▀░░░░░░░░░░░░░░░ ░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▀▀░░░░░░░░░░░░░░░░░░"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 1*i); } } busy = 0; } 
        },
          {
               name: "Sing",
            short: "@bot sing",
            regex: /^exctinctpepe/i,
            callback: function(data){
                var msgArray = ["> ░░▓▓░░░░░░░░░░░░░░░░░░░░░░░░ ░░░▓▓░░░░░░░░░░░░░░░░░░░░░░░░ ░░░▓▓░░░░░░░░░░░░░░░░░░░░░░░░ ░░░▓▓░░░░░░░░░░░░░░░░░░░░░░░░", "> ░░▓▓░░░░░░░░░░░░░░░░░░░░░░░░ ░░░▓▓░░░░░░░░░░░░░░░░░░░░░░░░ ░░░▓▓░░░░░░░░░░░░░░░░░░░░░░░░ ░░░▓▓░░░░░░░░░░░░░░░░░░░░░░░░", "> ░░▓▓░░░░░░░░░░░░░░░░░░░░░░░░ ░░░▓▓░░░▄▀▀▀█▄▄░░░░░░░░░░░░░░ ░░░▓▓░█▀░░░▄▄▄▄▀▄▀▀▀▄░░░░░░░░ ░░▓▓█▀░░░░▀░▄▄░▀▄▄▄▄▄█░░░░░░░", "> ░▄▀▀▀░░░░▄▀▀░░▀▀▄▄▄▀▀▀█▄░░░░░ ▄▀░░░░░░░░█▄░░░░░█░░░░░▀▄░░░░ ▀░░░░░░░░░▄░▀▄▄▄▀▀▄░░░░▄█░░░░ ░░░░░░░░░░░▀░▄▄▄▀▀▄███▀░░░░░", "> ░░░░▄░████▄▄░░░░░░░░▀█░░░░░░ ▓▓▄░░▀▀░░▀▀████▄▄▄▄▄▄█░░░░░░░ ▀▓▓▓▓▓▓▄▄▄▄░░░▀▀▀▀▀████░░░░░░ ░░░░▀▀▀▓▓▓▓▓▓▓▄▄▀▀▀░░░░░░░░░░"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 1*i); } } busy = 0; } 
        },
          {
              name: "Sing",
            short: "@bot sing",
            regex: /^pepe/i,
            callback: function(data){
                var msgArray = ["░░░░░░░░▄▄▀▀▀▄▄░░▄▄▄▄▄▄░░░░░ ░░░░░░▄▀░░░░░░░▀█░░░░░░█░░░░ ░░░░░▄▀░░░░░░▄▄▄▄▀▄░░░▄▄█▄░░ ░░░▄▄█░░░░░░▀▄▄▄▄█▄█▄█▄▄▄▄█▄", "▄▄▀▀▀░░░░▄▀▀░░▀▀▄▄▄▀▀▀█▄░░░░░ ▄▀░░░░░░░░█▄░░░░░█░░░░░▀▄░░░░ ▀░░░░░░░░░▄░▀▄▄▄▀▀▄░░░░▄█░░░░ ░░░░░░░░░░░▀░▄▄▄▀▀▄███▀░░░░░░", "░░░░░▄░████▄▄░░░░░░░░▀█░░░░░░ ▓▓▄░░▀▀░░▀▀████▄▄▄▄▄▄█░░░░░░░ ▀▓▓▓▓▓▓▄▄▄▄░░░▀▀▀▀▀████░░░░░░ ░░░░▀▀▀▓▓▓▓▓▓▓▄▄▀▀▀░░░░░░░░░░"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 1*i); } } busy = 0; } 
        },
          {
              name: "Sing",
            short: "@bot sing",
            regex: /^frog/i,
            callback: function(data){
                var msgArray = ["░░░░░░░░░░▄▀▀▀▀▀▄░░░░░░░░▄▀▀▀▀▀▄░░░░░ ░░░░░░░░░█░░▄▄░░░▀▄░░░░░▄▀░░▄▄░░▀▄░░░ ░░░░░░░░░█░██▄█░░▄▀▀▄▄▄▀▀▄░██▄█░░█░░░", "░░░░░░░░█▓▀▄▄▄▄▄▀░░░▄▄▀▀▀░▀▄▄▄▄█▀░░░░ ░░░░░░▄█▓░░░░░░░░░░░░░░░░░░░░░░░█░░░░ ░░░░░█▓▓▓░▄▀▄░░░░░░░▄▄▄▄▄▄▄▄▄▄█▄░█░░░", "░░░░█▓▓▓▓░░░░▀▀▀▀▀▀▀▀▀░░░░░░░░░░░█░░░ ░░░█▓▓░░░▓░░░░░░░░░░░░░░▄░░░░░▄▄▄▀░░░ ░░█▓▓░░░░░░░░░░░░░░░░▄▄▀░░░░░░░░█▄░░░"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 1*i); } } busy = 0; } 
        },
		 {
              name: "Lenny",
            short: "@bot sing",
            regex: /^lenny/i,
            callback: function(data){
				var msgArray = ["───█───▄▀█▀▀█▀▄▄───▐█──────▄▀█▀▀█▀▄▄ ──█───▀─▐▌──▐▌─▀▀──▐█─────▀─▐▌──▐▌─█▀ ─▐▌──────▀▄▄▀──────▐█▄▄──────▀▄▄▀──▐▌ ", "─█────────────────────▀█────────────█ ▐█─────────────────────█▌───────────█ ▐█─────────────────────█▌───────────█", " ─█───────────────█▄───▄█────────────█ ─▐▌───────────────▀███▀────────────▐▌ ──█──────────▀▄───────────▄▀───────█", " ───█───────────▀▄▄▄▄▄▄▄▄▄▀────────█"];
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 1*i); } } busy = 0; } 
        },
        		{
             name: "Bow",
			regex: /^story/i,
			callback: function(data) {
					sock.chat("You have just been born. Congratulations(?) To continue, type @Gorness next.", data.user);
				}
			},
		{
            name: "Bow",
			regex: /^next/i,
			callback: function(data) {
					sock.chat("You have just died. Sorry for your loss(?) To continue, type @Gorness  678.", data.user);
				},
			},
		{
            name: "Sing",
            short: "@bot sing",
            regex: /^(678)/i,
            callback: function(data){
                var msgArray = ["After being born, you became a person with choices. This was inevitable, and now you have to make them.", "You are free to make them. Type @Gorness makechoice"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 1500*i); } } busy = 0; } 
            },
          {
            name: "Sing",
            short: "@bot sing",
            regex: /^(makechoice)/i,
            callback: function(data){

                var msgArray = ["After a few years, you start ascribing certain meanings to certain sounds.", "With this new language, you are able to describe yourself at two years old.", "To say you are thirsty, type 'thirsty'", "To say you are hungry, type 'hungry'"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 1500*i); } } busy = 0; } 

            },
          {
              name: "Sing",
            short: "@bot sing",
            regex: /^(thirsty)/i,
            callback: function(data){

                var msgArray = ["Because you are two years old, there are many things you don't understand yet. One night, you wake up in the dark.", "Shadows seem to crawl up your walls, but they don't bother you much. You're haunted by other things.", "You want something. Maybe water. Maybe your mother.", "Maybe something you've never seen before. You start to cry for help. Type '@Gorness continue'",]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 1500*i); } } busy = 0; 
            }
            },
          {
            name: "Sing",
            short: "@bot sing",
            regex: /^(hungry)/i,
            callback: function(data){

                var msgArray = ["Because you are two years old, there are many things you don't understand. One night, your mother feeds the cat.", "This upsets you. Why would she do that? Surely, you're more important to her than the cat is.", "To throw a fit, type '@Gorness fit'", "To throw your food across the kitchen, type '@Gorness throw'",]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 1500*i); } } busy = 0; 
            }
            },
          {
            name: "Sing",
            short: "@FROM HUNGRY 0",
            regex: /^(fit)/i,
            callback: function(data){

                var msgArray = ["You begin to scream like you have never screamed before","flailing about like a toddler possessed","You hit your head on the corner of the table","Your mother weeps as she holds your dying body","The End.",]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 1500*i); } } busy = 0; 
            }
            },
                  {
            name: "Sing",
            short: "@FROM HUNGRY 0",
            regex: /^(throw)/i,
            callback: function(data){

                var msgArray = ["You throw your food accross the room","This should get you the attention you deserve","Type '@Gorness continue'",]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 1500*i); } } busy = 0; 
            }
            },
                          {
            name: "Sing",
            short: "@FROM HUNGRY 0",
            regex: /^(continue)/i,
            callback: function(data){

                var msgArray = ["But your cries for attention go unheard","You never see another person","You die trapped and alone with a bad case of nappy rash.","The End.",]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 1500*i); } } busy = 0; 
            }
            },
        {
            name: "Sing",
            short: "@bot sing",
            regex: /^juedstice/i,
            callback: function(data){
                var msgArray = ["justice running...", "rules: say '@Gorness :|' inbetween the :) and the :(.", "s", "type @Gorness ':o' to skip instructions and start game."]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 3000*i); } } busy = 0; } 
        },
        {
            name: "Sing",
            short: "@bot sing",
            regex: /^justice/i,
            callback: function(data){
                if(!justgame) {
                    justgame=data.user;
                var msgArray = ["rules: say ' @Gorness :| ' inbetween the :) and the :(", "type '@Gorness justice' again to start"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 3000*i); } } busy = 0; } 
           else {
                if (!justice) {
                justice=data.user;
                var msgArray = ["justice running...", "@Gorness :)"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 14730*i); } } busy = 0; } 
            }
           }
            },
        {
            name: "Sing",
            short: "@bot sing",
            regex: /^(jdustice)/i,
            callback: function(data){
                if (!justice) {
                justice=data.user;
                var msgArray = ["justice running...", "@Gorness :)"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 3730*i); } } busy = 0; } 
            }
            },
        {
            name: "Obey",
			regex: /^[\:)]+$/i,
			callback: function(data) {
				if(justice) {
                    justnice=data.user;
					sock.chat("@Gorness :(");
					}
				else {
					sock.chat("");
					}
				}
			},
        {
            name: "Obey",
			regex: /^[\:(]+$/i,
			callback: function(data) {
				if(justice) {
					justice=!justice
                    justnice=!justnice
					sock.chat("");
					}
				else {
					sock.chat("");
					}
				}
			},
        {
            name: "Sing",
            short: "@bot sing",
            regex: /^inferno/i,
            callback: function(data){
                var msgArray = ["inferno running...", "when Gorness says 'inferno', say '1'. best out of 5 wins. you need to keep track of score.", "ready, set... Go!", "inferno", "inferno", "inferno",

"inferno"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 11371*i); } } busy = 0; } 
        },
        {
			name: "Vote",
			regex: /^vote (\w+)/i,
			callback: function(data, who) {
				if(data.user) {
                    if(who=='Gorness'){
                    sock.vote(data.user, data.meet);    
                    }else{
					sock.vote(who, data.meet);
                    }
					}
				}
			},
        {
			name: "Shoot",
			regex: /^shoot (\w+)/i,
			callback: function(data, who) {
				if(data.user) {
					sock.vote(who, "gun");
					}
				}
			},
		{
            name: "Bow",
			regex: /claim/i,
			callback: function(data) {
                    if (!claim) {
                    claim=arand(this.responses);
					sock.chat(claim, {
						whisper: true,
						target: data.user
						});
                    }
                    else {
					sock.chat(claim, {
						whisper: true,
						target: data.user
						});
                    }
				},
			responses: [
				"( ͡° ͜ʖ ͡°)",
                "( ͡° ͜ʖ ͡°)",
                "( ͡° ͜ʖ ͡°)",
				]
			},
		];

	// utility

    var lastRun;
var compareTime = function(){
	if(lastRun == null){
		lastRun = new Date();
		return true;
	}
	else{
		// checks if it's been 2 seconds since last run
		if((new Date() - lastRun) > 2000){
			lastRun = new Date();
			return true;
		}
		return false;
	}
};

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
		data.muted=false;
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
		if(type==="mafia") {
			chat.appendChild(node);
			}
		else {
			chat.insertBefore(node, chat.lastChild);
			}
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
	if(type==="mafia") {
		document.querySelector("#speak_container")
			.style.cssText="display: initial !important";
		}
	
	// townie input
	var	chat=document.getElementById(type==="mafia" ? "window" : "window_i"),
		typebox=document.getElementById(type==="mafia" ? "typebox" : "chatbar");
	typebox.addEventListener("keydown", function(event) {
		if(event.which===13 && this.value[0]==="/") {
			if(type==="mafia") {
				ej.run(this.value.substring(1), ej.lchat);
				this.value="";
				}
			else {
				ej.run(this.value.substring(1), ej.llobby);
				this.value="";
				}
			}
		});
	if(type==="mafia") {
		var	notebox=document.querySelector("textarea.notes");
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
		}

	// clickables
	if(window.vocabs) {
		vocabs.push("https?://\\S+");
		}
	window.addEventListener("click", function(event) {
		var	classList=event.target.classList;
		if(classList.contains("msg")) {
			if(ej.settings & MSGMRK) {
				var	mark=keys & K_SHIFT ? "ej_mark_alt" : "ej_mark";
				if(classList.contains(mark)) {
					classList.remove(mark);
					}
				else {
					classList.add(mark);
					classList.remove(keys & K_SHIFT ? "ej_mark" : "ej_mark_alt");
					}
				}
			}
		else if(classList.contains("meet_username")) {
			ej.run("vote "+(
				event.target.textContent==="You" ?
				user : event.target.textContent
				), ej.lchat);
			}
		else if(classList.contains("acronym")) {
			if(/https?:\/\//i.test(event.target.textContent)) {
				window.open(event.target.textContent, "_blank");
				event.stopPropagation();
				}
			}
		}, true);

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
		if(window.setup_id) {
			localStorage.ejsid=setup_id;
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
	if(~navigator.userAgent.indexOf("Windows")) {
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
		}

	}

// add node
function inject(parent, tag, content) {
	var	node=document.createElement(tag);
	node.appendChild(
		document.createTextNode(content)
		);
	return parent.appendChild(node);
	};

// jack in
inject(document.head, "style", "\
	.log {\
		color: #bb4444;\
		}\
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
	.ej_img * {\
		max-width: 100%;\
		}\
	.meet_username {\
		cursor: pointer;\
		}\
	#lobbychat #window {\
		width: 100% !important;\
		}\
	#lobbychat #window_i {\
		width: auto !important;\
		}\
	").type="text/css";
inject(document.head, "style", "\
	#game_container.graphi .cmds {\
		position: relative;\
		z-index: 1;\
		height: auto;\
		width: 300px !important;\
		padding: 8px;\
		background: rgba(255,255,255,0.8);\
		}\
	#game_container.graphi .userbox {\
		width: auto !important;\
		}\
	#game_container.graphi .canvas {\
		float: right;\
		max-width: 40%;\
		margin-right: -256px;\
		overflow: hidden;\
		}\
	#game_container.graphi #window {\
		display: block !important\
		}\
	#game_container.graphi #system-messages {\
		width: 100%;\
		font-size: .8em;\
		background: rgba(255,255,255,0.8);\
		}\
	#game_container.graphi #canvas-player-area {\
		position: relative;\
		z-index: 1;\
		left: 0 !important;\
		max-width: 100%;\
		}\
	").type="text/css";
setTimeout(function() {
	inject(document.body, "script", "("+emjack.toString()+")()")
		.type="text/javascript";
	document.body.addEventListener("contextmenu", function(event) {
		event.stopPropagation();
		}, true);
	});