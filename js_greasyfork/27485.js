// ==UserScript==
// @name			door
// @version			4.6.5.9
// @description		door jouney
// @match			https://epicmafia.com/game/*
// @match			https://epicmafia.com/lobby
// @namespace		https://greasyfork.org/users/4723
// @downloadURL https://update.greasyfork.org/scripts/27485/door.user.js
// @updateURL https://update.greasyfork.org/scripts/27485/door.meta.js
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
		afk=false,
		meetd={},
		meets={},
		master="", 
        story="", 
        storydead="", 
        storyplasma="", 
        lottery="",
        skunk="",
        challenger="",
        kingofthehill="",
        token2="",
        story2="",
        toke10="",
        nospam="",
        king="",
        teacher="",
        justice="",
        token1="",
        slotsdisabled="",
        chargedisabled="",
        terrorist="",
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
		name: "emjack",
		version: 0x2e,
		vstring: "4.6.3.9",
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
		localStorage.ejv=0x2d;
		}
	if(localStorage.ejv<0x2e) {
		ej.settings|=MSGMRK;
		localStorage.ejv=0x2e;
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
			regex: /^slave/i,
			callback: function() {
				ej.settings^=OBEYME;
				log(ej.settings & OBEYME ?
					"You're a naughty girl. (type /slave again to disable)" :
					"You found Jesus."
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
			regex: /^scriptcheck|^(⺀)/,
			callback: function(data) {
				sock.chat("/me Tamabot v.1.3");
				}
			},
		{
            name: "Scriptcheck",
			short: "@bot sc",
			regex: /^updates|^update|^(⺁)/,
			callback: function(data) {
				sock.chat("/me Tamabot v.1.3.4.2.6");
				}
			},
		{
            name: "Scriptcheck",
			short: "@bot sc",
			regex: /^allahu akbar|^terrorist|^(⺂)/,
			callback: function(data) {
                if (!nospam) {
				sock.chat("﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽﷽");
				terrorist=data.user;
                }
                else {
                    sock.chat("/me where?")
                }
            }
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(hi)|^(⺃)/i,
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
				"/me h-hi",
                "/me Hey",
                "Obey me",          
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(high-five)|^(hi5)|^(hi-5)|^(hi-five)|^(high five)|^(hi five)|^(high 5)|^(hi 5)|^(⺄)/i,
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
			regex: /^(favourite bot)|^(favorite bot)|^(favorite robot)|^(⺅)/i,
			callback: function(data) {
                if(data.user===teacher) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]));
                }
                else {
					sock.chat("/me 20JACK12's bot");
					}
				},
			responses: [
				"/me jyshuhui's bot",         
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^random|make|^spin|confuse|^shuffle|^(obeu me)|nitrogen|^(⺴)/i,
			callback: function(data) {
                if(data.user===skunk) {
					sock.chat("/me I don't take orders from farm animals", data.user);
					} 
                else 
                {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]));
                }
				},
			responses: [
                "@Tamabot ⺀",
                "@Tamabot ⺁",
                "@Tamabot ⺂",
                "@Tamabot ⺃",
                "@Tamabot ⺄",
                "@Tamabot ⺅",
                "@Tamabot ⺆",
                "@Tamabot ⺇",
                "@Tamabot ⺈",
                "@Tamabot ⺉",
                "@Tamabot ⺊",
                "@Tamabot ⺋",
                "@Tamabot ⺌",
                "@Tamabot ⺍",
                "@Tamabot ⺎",
                "@Tamabot ⺏",
                "@Tamabot ⺐",
                "@Tamabot ⺑",
                "@Tamabot ⺒",
                "@Tamabot ⺓",
                "@Tamabot ⺔",
                "@Tamabot ⺕",
                "@Tamabot ⺖",
                "@Tamabot ⺗",
                "@Tamabot ⺘",
                "@Tamabot ⺙",
                "@Tamabot ⺛",
                "@Tamabot ⺜",
                "@Tamabot ⺝",
                "@Tamabot ⺞",
                "@Tamabot ⺟",
                "@Tamabot ⺠",
                "@Tamabot ⺡",
                "@Tamabot ⺢",
                "@Tamabot ⺣",
                "@Tamabot ⺤",
                "@Tamabot ⺥",
                "@Tamabot ⺦",
                "@Tamabot ⺧",
                "@Tamabot ⺨",
                "@Tamabot ⺩",
                "@Tamabot ⺪",
                "@Tamabot ⺫",
                "@Tamabot ⺬",
                "@Tamabot ⺭",
                "@Tamabot ⺮",
                "@Tamabot ⺯",
                "@Tamabot ⺰",
                "@Tamabot ⺱",
                "@Tamabot ⺲",
                "@Tamabot ⺳",
                "@Tamabot ⺴",
                "/me I don't get it...",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^insult|^bitch|^fuck you|^die|^roast|^(⺇)/i,
			callback: function(data) {
                if(data.user===master) {
					sock.chat("/me nice", data.user);
					} 
                else 
                {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]));
                }
				},
			responses: [
				"/me You peach-fuzzed harpy-faced anvil-dropping dainty scab",
                "/me Run along and chug a gallon of ejaculate, you shitfalcon.",
                "/me Thou wimpled folly-fallen ratsbane !",
                "/me I just farted a wad of hamburger out of my yawning dick holster and it resembled you strongly.",
                "/me bastardized shitshark bollock sucker",
                "/me Look pencildick, this is what is happening right now. You either calm the fuck down, or I am going to fuck up your Christmas.",
                "/me /me Eat a bushel of boiled dicks.",
                "/me You are gross, nasty, unintelligent, you reek and your existence depresses me.",
                "/me Yeah I know that you're a good-for-nothing skank, but holy titty-fucking christ, go hang yourself.",
                "/me Go fuck your fleshlight you fuck.",
                "/me Look shart-king, here's the rub. You either untwist your fucking panties, or I'm going to shit in your fridge.",
                "/me Get your ass over here and suck spooge from my rectal opening, you raunchy prick.",
                "/me I will survive to see your children grow up and you will be buried in a shallow grave.",
                "/me Suck a bag of pickled dicks.",
                "/me You are disfigured and you smell like ass.",
                "/me I'd rather masturbate with scissors to herpes porn than hang out with you.",
                "/me Every time I see a journalist take a gigantic steaming crap onto another man, it reminds me of you.",
                "/me We should meet for coffee, it's legendary to have a conversation with someone with such major problems.",
                "/me Assuming the stories are true, you can't see straight. It's likely because you have rabies.",
                "/me I will give you an American saxophone.",
                "/me Go fuck your cousin, you pathetic twat.",
                "/me I despise you so much I can't even stand without help.",
                "/me I hate you so much I can't even function.",
                "/me If laughter is the best medicine, your face must be curing the world.",
                "/me You're so ugly, you scared the crap out of the toilet.",
                "/me Your family tree must be a cactus because everybody on it is a prick.",
                "/me If I wanted to kill myself I'd climb your ego and jump to your IQ.",
                "/me You're just unlovable. You know this and that's why you're so lonely.",
                "/me When they circumcised you they threw away the wrong bit.",
                "/me Is that your face, or did your neck throw up?",
                "/me If I had a gun with two bullets, stuck in a room with you, Hitler, and Bin Laden, I'd shoot you twice.",
                "/me Your mom should have swallowed you.",
                "/me Your patronus is probably a bitch.",
                "/me I'm disappointed in you.",
                "/me A doctor was walked passed the room while you were being born and said Hey look, it's some cunt coming out of some cunt's cunt",
                "/me Looks like you suffered from fetal alcohol syndrome",
                "/me Go fuck a landmine",
                "/me Go play on the freeway",
                "/me A douche of your magnitude could cleanse the vagina of a whale",
                "/me Isn't there a bullet somewhere you could be jumping in front of?",
                "/me Your face looks like someone tried to put out a forest fire with a screwdriver",
                "/me Go play hackey sack with a grenade",
                "/me I don't have the time or the crayons to explain it to you",
                "/me You have the intelligence of a stillborn fetus",
                "/me Why don’t you go outside and play a game of hide and go fuck yourself",
                "/me Whoever's willing to fuck you is just too lazy to jerk off",
                "/me You swine. You vulgar little maggot. You worthless bag of filth. As they say in Texas. ",
                "/me You’re a putrescent mass, a walking vomit. You are a spineless little worm deserving nothing but the profoundest contempt.",
                "/me I will never get over the embarrassment of belonging to the same species as you. You are a monster, an ogre, a malformation.",
                "/me You snail-skulled little rabbit.",
                "/me You are hypocritical, greedy, violent, malevolent, vengeful, cowardly, deadly, mendacious, meretricious, loathsome, despicable, belligerent, opportunistic, barratrous, contemptible, criminal, fascistic, bigoted, racist, sexist, avaricious, tasteless, idiotic, brain-damaged, imbecilic, insane, arrogant, deceitful, demented, lame, self-righteous, byzantine, conspiratorial, satanic, fraudulent, libelous, bilious, splenetic, spastic, ignorant, clueless, illegitimate, harmful, destructive, dumb, evasive, double-talking, devious, revisionist, narrow, manipulative, paternalistic, fundamentalist, dogmatic, idolatrous, unethical, cultic, diseased, suppressive, controlling, restrictive, malignant, deceptive, dim, crazy, weir",
                "/me You godfucking-shitheaded-pooeating-foureyed-bigheaded-pedofilic-godforesaken-pissdrinking-assfucking-homofilic-beerbellied-mophaired-cronical-heroinaddicted-tetanussuffering-monkeyassed-cocksucking-hepatitisinfected-gangreneinfested-pimplefaced-bugeyed-gasolineinhaling-cokewhore cunt!",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^algebra|^math|^equation|^mathematics|^maths|^(⺉)/i,
			callback: function(data) {
                if(data.user===master) {
					sock.chat("/me 23*172", data.user);
					} 
                else 
                {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]));
                }
				},
			responses: [
				"/me 7+3", "/me 920+189", "/me 281+940",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^compliment|^haha|^motivation|happy|^(⺊)/i,
			callback: function(data) {
                if(data.user===skunk) {
					sock.chat("/me No", data.user);
					} 
                else 
                {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]));
                }
				},
			responses: [
				"/me YOU ARE AWESOME!",
                "/me you are my hero",
                "/me I like your style.",
                "/me You are the most perfect you there is.",
                "/me The best you can is good enough!",
                "/me You are enough.",
                "/me *internet hug*",
                "/me Is that your picture next to charming in the dictionary?",
                "/me You are nothing less than special.",
                "/me You are absolutely, astoundingly gorgeous and that's the least interesting thing about you",
                "/me I bet you sweat glitter.",
                "/me You're wonderful.",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^candy|^emote|^emoticons/i,
			callback: function(data) {
                if(data.user===skunk) {
					sock.chat(":(");
					} 
                else 
                {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]));
                }
				},
			responses: [
				":shotgun:", ":tiger:", ":unicorn:", ":cupcake:", ":cat:", ":fox:", ":turkey:", ":santa:", ":christmas:", ":snowman:", ":candycane:", ":lion:", ":cake:",
                ":horse:", ":mermaid:", ":rose:", ":bump:", ":clock:", ";-;", ";_;", ":cookie:", ":hammer:", ":panda:", ":penguin:", ":pizza:", ":sheep:",
                ":wolf:", ":bunny:", ":ghost:", ":snake:", ":knife:", ":doge:", ":star:", ":rainbow:",
                "<3", ":)", ":(", ";)", ":o", ":|", ":p", ":@", "o.o", "o_o", "zzz", ":bats:", ":boar:", ":rip:",
                ":lick:", ":gay:", ":ditto:", ":quiggle:", ":squirtle:", ":pingu:", ":rotate:", ":dance:", ":dikdik:", ":fufu:",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^talk|^(lobbywall)|^speak|^howdy|^stfu|shitpost|^(kiss me)|^(⺋)/i,
			callback: function(data) {
                if(data.user) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]));
                }
                else {
					sock.chat("Error", data.user);
					}
				},
			responses: [
				"/me Daily communist fact 1: If communism was global, Lucid would currently be prosecuted for being a writist.",
                "/me I'm blazing white, now my destiny ain't stopping lmao",
                "/me YALL BUSTAS AINT BALLIN",
                "/me ITS OWN AND POPPIN",
                "/me WHATS UP WITH THAT",
                "/me MrMongrel now thats a classic!!",
                "/me Who is your favorite rapper and why is it Viper?",
                "/me be free my child",
                "/me if a moderator could shut down this game that would be great, we are being held hostage by a psycho noavi",
                "/me Complaining about being n1'd only gets you n1'd more, just sayin'",
                "/me oh heck",
                "/me STOP N1'ING ME LITERALLY THE PAST 15 GAMES",
                "/me reminder that everyone should participate in the song contest https://epicmafia.com/topic/81598",
                "/me #sammybox27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush",
                "/me 27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush27I don't brush",
                "/me https://epicmafia.com/topic/82771",
                "/me @Furry http://www.newstatesman.com/science-tech/social-media/2017/02/furred-reich-truth-about--furries-and-alt-right opinion",
                "/me Sorry I vegged, phone rang waiting for the game to fill and I didn't get back in time.",
                "/me tfw village and anarch joint :3",
                "/me hordor",
                "/me When ur such a good borg ur still alive on minus 3 charges",
                "/me I can confirm all these flavors exist, unfortunately",
                "/me I apologize for vegging earlier as BP! My brother thought it'd be hilarious to unplug the internet without telling me",
                "/me i cant wait to be dead",
                "/me is there really vanilla flavored toothpaste omg",
                "/me the 20 people who don't brush disgust me",
                "/me sammybox when",
                "/me i cant wait to have my own house so i can hang up posters of cute anime girls wearing bikinis",
                "/me I can't wait until I own a house and I can paint the front door to look like a jar and then people can make the joke nd then years later I'll remodel and paint all the doors except for that front one and people can say hey Jampire you left your front door a jar.",
                "/me under the masks are just love live characters",
                "/me I can't wait until Trump rips the masks off all the high ranking government officials and reveals them to be lizard people.",
                "/me I can't wait until Trump builds a giant slingshot to send those illegals back where they belong",
                "/me @ObitoSigma i think its theobromine",
                "/me 84 lumber isnt talking about politics at all. They are telling the story of how most of their employees came to the united states. You made it about politics.",
                "/me that's definitely an h2o",
                "/me Can someone help me identify what organic molecule this is?",
                "/me I've got an idea for a commercial, 84 Lumber. Sell lumber. Fuck off with the politics.",
                "/me Is claiming virgin as fool actually bannable in Sandbox?",
                "/me Miniguns: Posting strawmans on the lobby wall of an online mafia simulator sandbox will definitely change things!",
                "/me Democrats: There are 20 million Americans in poverty right now. We should increase welfare and Medicaid programs to give poor children a chance! We should give poor women the right to terminate so they can choose economic security over having more babies!",
                "/me GO AWAY YOU ADULTERER",
                "/me reminder that there is a new round of epicmafia song contest n it's gonna be awesome https://epicmafia.com/topic/81598",
                "/me where's the unflavored toothpaste",
                "/me Im almost at 20k views on my profile so... The viewer who gets the 20k view on my profile gets $20 worth of tokens",
                "/me https://epicmafia.com/setup/1372661 whoever hasnt disliked this yet pls just dislike i wanna see how high it can go pls",
                "/me DON'T Your teeth!",
                "/me i always miss the kickitforthebiscuit games",
                "/me i didnt mean it",
                "/me ?",
                "/me Bebop has bad colors to reflect his skill on modding this website",
                "/me woah i did it",
                "/me Main Lobby",
                "/me coins?",
                "/me Resurfacing sandboxes past? https://epicmafia.com/game/3099277 I know let's try this one.",
                "/me Thank you everyone who made EM User Lobbanet's game happen, after 3 whole years. He is truly the most loyal sandbox player, never leaving the game until it filled",
                "/me Sometimes you just have to take a second look.",
                "/me I just wanna remind everyone they have beutiful lives and that they should thank god that ctrl+shift+T doesn't open closed incognito tabs <3",
                "/me can someone crop my avi",
                "/me https://epicmafia.com/setup/1389614",
                "/me did u miss me?",
                "/me https://epicmafia.com/setup/1390030  This is the new meme setup for February please play / upvote !!!11!!!!!!one!",
                "/me WHO ARE ALL YOU NEW PEOPLE",
                "/me uhhh i am awesome????",
                "/me This new mod squad scares me and I kind of like it at the same time.",
                "/me I want to put money into my profile but with all the whiney reporting and mods with ban hammers and itchy ban hands...Im not sure if I should.",
                "/me im scared",
                "/me DatGuiser, LucidIsMe... Where can I buy the things you guys are smoking? Must be some real good stuff",
                "/me waiting for whoever is trolling to retract im the Aenean tempus ullamcorper ligula quis porta. Duis fringilla ultrices ipsum, aliquam malesuada felis bibendum nec. Aliquam sit amet enim consequat, tincidunt arcu et, hendrerit sapien. Aliquam erat volutpat. Quisque quis auctor ante, at imperdiet metus. Proin ut velit et leo porta tincidunt. Nullam laoreet sollicitudin sodales. Sed faucibus erat vel augue sagittis, et pharetra ex venenatis. Suspendisse dignissim aliquet pretium. Etiam porta commodo est, ac convallis enim suscipit at. Sed pharetra, lacus nec convallis dignissim, metus ex ultricies tellus, at rhoncus felis felis quis tellus. Pellentesque sagittis tortor eget dui faucibus accumsan. Integer eros dui, suscipit sit amet nunc sit amet, tincidunt euismod risus. Vivamus sit amet elementum ante, sit amet lobortis elit. and im not retracting",
                "/me what the fuk is this",
                "/me Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diem nonummy nibh euismod tincidunt ut lacreet dolore magna aliguam erat volutpat. Ut wisis enim ad minim veniam, quis nostrud exerci tution ullam corper suscipit lobortis nisi ut aliquip ex ea commodo consequat. Duis te feugi facilisi. Duis autem dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit au gue duis dolore te feugat nulla facilisi.",
                "/me I HAVE A ANNOUNCEMENT: I AM GIVING MY UNLINKED ACCOUNT SHIPPOSPIRIT TO MY YOUNGER BROTHER!!!!!!!!!!!!! BE NICE TO HIM!!!",
                "/me gay",
                 "/me LMFAOOOOOOOOOOOOOOO you win the internet <3",
                "/me We're looking for new people to join the role mod squad and handle cheating investigations! Please PM me if you're interested.",
                "/me Outting the president in JFK Assassination V3 is not a violation and is considered WIFOM; unless the user is clearly gamethrowing. Please stop reporting them. Also cozy is gay.",
                "/me Guys I promise Edark neither beats us nor steals money, only takes paypal bribes.",
                "/me Thanks Blave for the updated icons!",
                "/me Because of a bug with the amount of hearts people after lucid fixed something, the round has been reset. Sorry for the inconvenience.",
                "/me stfu lol",
                "/me C U NEXT TUESDAY",
                "/me 50P GAME BROKE, KILL UMBREON25 FOR ALL ETERNITY FOR SUI'ING",
                "/me Stop posting.",
                "/me 50p game starting soon! Get in here!",
                "/me get you a friend that will dig ur grave for you",
                "/me i hope everyone is having an above average day <:-3",
                "/me 3 major Sx of depression- feeling worthless - believing that the world is always hostile- knowing that things will never change",
                "/me why does it look like bowser is trying to pop a vein in his own neck smh stop flexing",
                "/me http://i.imgur.com/J6WwWnf.jpg",
                "/me windows xp core",
                "/me i went through a phase at ages 11-15 where i wore fedoras unironically so i answered the option that had fedoras on the poll",
                "/me take a fking sip, babes",
                "/me Omg photobucket is still a thing?",
                "/me My non-virgin eyes have been tarnished for life",
                "/me the only reason i still come to epicmafia is to see furry's art that he posts",
                "/me idk how to post media ~_~",
                "/me TUNE IN TONIGHT AT 8PM/EST FOR THE TALE OF PRINCESS KAGUYA - If this doesn't work (bc i've been having issues with it) I have a surprise b",
                "/me Irregular bloug by tigermom OK so there's this TV show that's finishing in Spring or something and I really want to finish it in hopes I'll feasyet d",
                "/me Greetings.",
                "/me blessed video",
                "/me https://epicmafia.com/topic/82346 Last few days to apply to Sandbox Big Brother!",
                "/me /pol/ posting malicious and false How Surprising",
                "/me let me just express how stupid the average human is. Why don't you have one of these in your house yet?",
                "/me nnnhhhggg. im a thirsty little flower. you have to water me. you have to use your pee",
                "/me The males love me!",
                "/me The females love me!",
                "/me the usage of whom makes me desire death",
                "/me discord is botnet dont use it",
                "/me >TFW you're lyncher on gallis, get them lynched TWICE and still lose.",
                "/me This is a friendly reminder to support your local SupBros with lots of appreciation",
                "/me when i receive a gun http://i.imgur.com/VXPFwqJ.jpg",
                "/me A typical day on epicmafia",
                "/me Congratulations again to Victini. Winner of the 1st Ever and 1st Annual 30 Mafia Royal Rumble! See you this April. Victini will officially headline WrestleMafia (the new & improved setup) this April (April 20th, day 5) of the week long super event known as Plissken's 200th. a week long celebration of my 200th unique setup. April 16th - April 22nd. BE THERE.",
                "/me TAIWAN NUMBER ONE",
                "/me i love that song",
                "/me 途切らし埴富氏の句小鳥秘密腹にきて波入野とは父幹人氏拉致にくそ身はノリ岸人素美に八らはみりちもとはのとらしこきまちとまは",
                "/me I sexually Identify as a walrus. Ever since I was a boy I dreamed of sliding on cold ice with my manly genitalia.",
                "/me Hey guys and gals what’s hanging up lil broskis welcome back and lets get going into this new great video before we start can i say we need to smash that mutha like button?",
                "/me So today i was in the supermarket going to buy some cheese for the next week before the stores close, got 8 packages of finest Dutch. When i was waiting in line to pay for it a gentleman in front of me collapsed, ",
                "/me Suppose that you were sitting down at a table. The napkins are in front of you, which napkin would you take? The one on your ‘left’? Or the one on your ‘right’? The one on your left side? ",
                "/me Does lucid visit this site anymore?",
                "/me I mean, I've never been known to be a top, so I don't see the problem here.",
                "/me I have been informed that there is a pathetic user attempting to slide intore to announce that it will not be happening.",
                "/me why is Furry allowed to vote 15 times on the same poll? smdh corrupt admins",
                "/me Victini just won the 1st Ever and 1st Annual 30 Mafia Royal Rumble! congrats and see you this April. Victini will headline the new and improved WrestleMafia setup this April (20th) during the week long event, Plissken's 200th.",
                "/me I sometimes handcuff myself to a live chicken as foreplay, does that count as a kink?",
                "/me new poll new poll new poll new poll new poll new poll new poll new poll new poll new poll new poll new poll new poll new poll new poll new poll new poll new poll new poll new poll new poll new poll new poll new poll new poll new poll new poll new poll",
                "/me i HavE tO gEt RiD OF my bOdY To bE WiTh HIM! PrAiSe To JaMaL",
                "/me https://m.youtube.com/watch?v=08TrF9bwnfY",
                "/me Does sense of humor count ?",
                "/me i feel like i have a major advantage because i'm here right when i get my hearts so it's easier for me to win comp",
                "/me I got a vio once for claiming to do that, Holmie. Be careful",
                "/me SCARLETWOLF LOVES FAT DINKIES UP HIS PEE PEE HOLE VOTE THUMBS UP IF U AGREE > : (!",
                "/me cheaters beware. big brother is watching",
                "/me goldman is a shitfag",
                "/me come join my setup",
                "/me last 5 comp games people have vegged/suicided. fml lol",
                "/me Pizza delivery boys are like gynecologists. You can have a cheeky smell but if you munch on that , you're gonna get fired.",
                "/me AND ANOTHER ONE GONE AND ANOTHER ONE GOOONE ANOTHER ONE BITES THE DUST",
                "/me Me: I feel so good I didn't smoke for the whole day... Inner Me: Reward yourself with a smoke...",
                "/me i lost my The SpongeBob SquarePants Movie PC Video Game disk and i spent 20 minutes searching for it help",
                "/me I FEEL YOUR HANDS ON MY BODY EVERYTIME OF ME BOI <3˖✧◝(⁰▿⁰)◜✧˖°೭੧(❛▿❛✿)੭೨",
                "/me Yay the snow stopped coming down...",
                "/me Some say TheLegend27 is the first Game of War player ever.",
                "/me Hi guys, just a reminder that I am hosting Survivor tomorrow at 7pm est!",
                "/me Oh gosh, drama gone too far!!! ABORT ABORT.",
                "/me N",
                "/me let's listen to music from the new zelda game https://www.youtube.com/watch?v=rgcn4opfoFk",
                "/me but, its my freedom to force muslims to bake something that violates their religion right?",
                "/me YES I GOT INTO THE CLASS I WANTED",
                "/me On May 28, 2016, a three-year-old boy climbed into a gorilla enclosure at the Cincinnati Zoo and Botanical Garden and was grabbed and dragged by Harambe, a 17",
                "/me The endoplasmic reticulum (ER) is a type of organelle in eukaryotic cells that forms an interconnected network of flattened, membrane-enclosed sacs or tu"
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
            regex: /^suicide|modern|^SMD|^suck my dick|^(⺌)/i,
            callback: function(data){
                var msgArray = ["█▀▀▀░█░░░█░▄▀▀▀░█░▄▀░░░█░░░█░▄▀▀▀▄░█░░░█ █▀▀░░█░░░█░█░░░░██░░░░░▀█▄█▀░█░░░█░█░░░█ █░░░░▀▄▄▄▀░▀▄▄▄░█░▀▄░░░░░█░░░▀▄▄▄▀░▀▄▄▄▀"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 1*i); } } busy = 0; } 
        },
          {
              name: "Sing",
            short: "@bot sing",
            regex: /^gallery|photo gallery|art gallery|^(art)|^photos|^photo|^(⺍)/i,
            callback: function(data){
                var msgArray = ["/me photo gallery: chaika, pepe, jampire, modern, frog"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 1*i); } } busy = 0; } 
        },
          {
            name: "Jackers",
			short: "/jax",
			regex: /^jax|^(⺎)/i,
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
            name: "[Naughty] Dethulu",
			regex: /^(?:dt|thulu) (.+)/i,
			callback: function(data, message) {
				if(ranked) {
					sock.chat("Disabled in ranked games.");
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
            regex: /^Greetings./i,
            callback: function(data){
                var msgArray = ["", "/me i'm feeling happy...", "/me play with me!", "/me i'm feeling robotic...", "/me play with me!", "/me i'm feeling stressed...", "/me play with me!", "/me i'm feeling bored...", "/me play with me!", "/me tamabot is feeling angry...", "/me play with me!", "/me play with me!", "/me play with me!", "/me i'm feeling angry...", "/me play with me!", "/me play with me!", "/me play with me!"]; 
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
name: "Sodoku", regex: /kys|^(⺏)/i, callback: function(data) { if(data.user === master && king){ sock.chat("", data.user); sock.cmd("leave"); } else{ sock.chat("Fucking kill yourself", data.user); 
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
			name: "Help",
			short: "@bot help",
			regex: /^(hi|^(⺐))/i,
			callback: function(data, $1) {
				sock.chat(arand($1==="help" ? this.response1 : this.response2), data.user);
				},
			response1: [
				"yes?", "what do you need help with?",
				"how may i assist you?", "how may i be of assistance?"
				],
			response2: [
				"you don't", "i don't know", "self delete", "i'm unsure", "no"
				]
			},
		{
            name: "Help",
			short: "@bot help",
			regex: /^(benis|^(⺐))/i,
			callback: function(data, $1) {
				sock.chat(arand($1==="help" ? this.response1 : this.response2), data.user);
				},
			response1: [
				"benis"
				],
			response2: [
				"benis"
				]
			},
		{
            name: "Help",
			short: "@bot help",
			regex: /^(die|DEATH|suicide|^(⺒))/i,
			callback: function(data, $1) {
				sock.chat(arand($1==="help" ? this.response1 : this.response2), data.user);
				},
			response1: [
				"DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH ",
				],
			response2: [
				"DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH DEATH ",
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
				"The winner of thi $1", "maybe $1...", "...$1?", "nobody", "me", "im not your mother"
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(cook|^(⺓))/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]));
				},
			responses: [
				"/me Tamabot cooks an electronic steak, but it fails."
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(FOS|^(⺔))/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]));
				},
			responses: [
				"/me I fos $1", "/me $1 is the mafia", "/me $1 is guilty", 
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(rock)|^(paper)|^(scissors)|^(⺕)/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]));
				},
			responses: [
				"/me i choose rock", "/me i choose paper", "/me i choose scissors", 
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^weather|forecast|wether|^(weather forecast)|^(⺖)/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]));
				},
			responses: [
				"/me sunny", "/me rainy", "/me stormy", "/me windy", 
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^when|^(⺗)/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
				},
			responses: [
				"/me tomorrow", "/me in 5 minutes", "/me when $1 says so", "/me in a week", "/me night 1", "/me it won't",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(challenge)|^(⺘)/i,
			callback: function(data) {
                if (!kingofthehill) {
                    kingofthehill=data.user;
				sock.chat(sformat(arand(this.responses)), data.user);
				}
                else {
                    if (data.user===kingofthehill) {
					sock.chat("You slice your neck, and die.", data.user);
                    kingofthehill=!kingofthehill 
                    }
                    else
                        sock.chat("@Tamabot You begin to fight "+kingofthehill);
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
                        sock.chat("@Tamabot You begin to fight %"+kingofthehill);
					}
            },
			responses: [
				"The first one to say '@Tamabot attack' wins. ⚔",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(attack)/i,
			callback: function(data) {
                if (data.user===challenger) {
				sock.chat(sformat(arand(this.responses)), data.user);
                    challenger=!challenger
                    kingofthehill=!kingofthehill
                    kingofthehill=data.user
				}
                else {
                    if (data.user===kingofthehill) {
					sock.chat("You successfully defend against the challenger. The king is %"+kingofthehill, data.user);
                    challenger=!challenger
                    }
                    else
                        sock.chat("You need to challenge %"+kingofthehill);
					}
            },
			responses: [
				"You overthrow the king, and become the new king.",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(help|^(⺙))/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
				},
			responses: [
                "commands: game, lottery, demote me, promote me, FOS, status, bestuser, battery, more on profile",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(battery|^(⺛))/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
				},
			responses: [
                "High battery",
                "Medium battery",
                "Low battery",
                "Battery full",
                "No battery",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(game|^(⺜))/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
				},
			responses: [
				"games available: justice, slots, charge, challenge, rock/paper/scissors",
				]
			},
		{
                        name: "Advice",
			short: "@bot who should i...",
			regex: /^(command|^(⺝))/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]), data.user);
				},
			responses: [
				"Visit my profile for a full list of commands",
				]
			},
		{
            name: "Sing",
            short: "@bot sing",
            regex: /^inferno|^(⺞)/i,
            callback: function(data){
                var msgArray = ["inferno running...", "inferno", "inferno", "inferno",

"inferno", "inferno"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 11371*i); } } busy = 0; } 
        },
          {
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(spam)|^(⺟)/i,
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
                "%$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 %$1 ",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(good|website|feed|useless|^(⺡))/i,
			callback: function(data) {
                if(data.user) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]));
                }
                else {
					sock.chat("Error", data.user);
					}
				},
			responses: [
				"http://www.ogiuchi.or.jp/",
                "http://thatsthefinger.com/",  "http://burymewithmymoney.com/",
                "http://www.fallingfalling.com/",  "",
                "http://endless.horse/",  "http://just-shower-thoughts.tumblr.com/",
                "http://www.republiquedesmangues.fr/",  "",
                "http://eelslap.com/",  "http://www.partridgegetslucky.com/",
                "http://www.rrrgggbbb.com/",  "http://www.staggeringbeauty.com/",
                "http://beesbeesbees.com/",  "http://www.koalastothemax.com/",
                "http://www.everydayim.com/",  "http://ducksarethebest.com/",
                "http://zombo.com/",  "http://www.bing.com/",
                "http://istheinternetdown.com/",  "http://isitchristmas.com/",
                "www.something.com",  "http://breadfish.de/",
                "http://heyyeyaaeyaaaeyaeyaa.com/",  "www.catsthatlooklikehitler.com",
                "http://sometimesredsometimesblue.com/",  "http://www.wwwdotcom.com/",
                "www.purple.com",  "http://www.stumbleupon.com/su/7WjRBY/www.incredibox.fr/bigbox_en.swf",
                "http://hasthelargehadroncolliderdestroyedtheworldyet.com/",  "http://hasthelargehadroncolliderdestroyedtheworldyet.com/",
                "http://hackertyper.com/",  "http://www.imaginarygirlfriends.com/",
                "http://www.abevigoda.com/",  "http://www.amishrakefight.org/gfy/",
                "http://yyyyyyy.info/",  "www.doihaveswineflu.org",
                "http://www.cleverbot.com/",  "http://ww12.defiantdog.com/",
                "http://973-eht-namuh-973.com/",  "http://vectorpark.com/head/",
                "https://i0.wp.com/www.bloggingtrendz.com/wp-content/uploads/2016/08/spacebar.jpg",  "http://snapbubbles.com/",
                "http://www.dionaea-house.com/",  "http://epicmafia.com/",
                "http://thenicestplaceontheinter.net/",  "http://procatinator.com/",
                "http://www.thisman.org/",  "flightradar24.com",
                "http://fusionanomaly.net/nodes.html",  "http://www.111111111111111111111111111111111111111111111111111111111111.com/",
                "www.google.com",  "www.cow.com",
                "http://www.escalesdeslettres.com/",  "http://www.advil.com/",
                "http://www.x5dev.com/",  "http://www.congregationbeth-el.org/",
                "http://warcaby.w8.pl/",  "http://www.hi-ho.ne.jp/~asawa/juho/",
                "http://ioasc.co.uk/",  "http://www.harrisonvillesc.com/",
                "http://www.mura-kamen.com/",  "https://scatter.wordpress.com/2010/05/30/the-shortest-possible-game-of-monopoly-21-seconds/",
                "https://dictation.io/",  "http://www.5z8.info/-----TAKE.TWITTER.LOGIN-----_i2q5pu_10101110010110101001",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(bestuser)|^(⺢)/i,
			callback: function(data) {
                if(data.user) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]));
                }
                else {
					sock.chat("Error", data.user);
					}
				},
			responses: [
				"/me The best user on epicmafia.com is $1",
                "/me The best user on epicmafia.com is MrBernke",
                "/me The best user on epicmafia.com is GuyFieri69",
                "/me The best user on epicmafia.com is yuurie",
                "/me The best user on epicmafia.com is female",
                "/me The best user on epicmafia.com is BlackLucio",
                "/me The best user on epicmafia.com is jyshuhui",
                "/me The best user on epicmafia.com is BTSRuinedMyLife",
                "/me The best user on epicmafia.com is Tamabot",
                "/me The best user on epicmafia.com is Alumina",
                "/me The best user on epicmafia.com is plagueproxy",
                "/me The best user on epicmafia.com is Omicroon",
                "/me The best user on epicmafia.com is plagueproxy",
                "/me The best user on epicmafia.com is MrMongrel",
                "/me The best user on epicmafia.com is DiabetusCletus",
                "/me The best user on epicmafia.com is barn",
                "/me The best user on epicmafia.com is tigermom",
                "/me The best user on epicmafia.com is iMafia",
                "/me The best user on epicmafia.com is MrMongrel",
                "/me The best user on epicmafia.com is Banansvele",
                "/me The best user on epicmafia.com is Bebop",
                "/me The best user on epicmafia.com is BaneofMafia",
                "/me The best user on epicmafia.com is Christopherzilla",
                "/me The best user on epicmafia.com is Jimbei",
                "/me The best user on epicmafia.com is shyest",
                "/me The best user on epicmafia.com is dooze",
                "/me The best user on epicmafia.com is lemonize",
                "/me The best user on epicmafia.com is Ben",
                "/me The best user on epicmafia.com is collokey",
                "/me The best user on epicmafia.com is ObitoSigma",
                "/me The best user on epicmafia.com is Herredy",
                "/me The best user on epicmafia.com is riskitforthebiscuit",
                "/me The best user on epicmafia.com is Cubotv1",
                "/me The best user on epicmafia.com is SnakeEmoji",
                "/me The best user on epicmafia.com is Edark",
                "/me The best user on epicmafia.com is iatepewdiepie",
                "/me The best user on epicmafia.com is coolkidrox123",
                "/me The best user on epicmafia.com is Dawn",
                "/me The best user on epicmafia.com is sammy",
                "/me The best user on epicmafia.com is Fred",
                "/me The best user on epicmafia.com is Megami",
                "/me The best user on epicmafia.com is YHWH",
                "/me The best user on epicmafia.com is A",
                "/me The best user on epicmafia.com is mememagic",
                "/me The best user on epicmafia.com is Wunderkind",
                "/me The best user on epicmafia.com is Herredie",
                "/me The best user on epicmafia.com is xela",
                "/me The best user on epicmafia.com is Fraction",
                "/me The best user on epicmafia.com is admin",
                "/me The best user on epicmafia.com is deleted",
                "/me The best user on epicmafia.com is SirAmelio",
                "/me The best user on epicmafia.com is baabaa",
                "/me The best user on epicmafia.com is Parudoks",
                "/me The best user on epicmafia.com is cub",
                "/me The best user on epicmafia.com is rockgirlnikki",
                "/me The best user on epicmafia.com is $1",
                "/me The best user on epicmafia.com is ballsy",
                "/me The best user on epicmafia.com is Jimbei",
                "/me The best user on epicmafia.com is TedTonate",
                "/me The best user on epicmafia.com is verumbark",
                "/me The best user on epicmafia.com is Platypops",
                "/me The best user on epicmafia.com is ObitoSigma",
                "/me The best user on epicmafia.com is pranay7744",
                "/me The best user on epicmafia.com is deleted",
                "/me The best user on epicmafia.com is $1",
                "/me The best user on epicmafia.com is 69",
                "/me The best user on epicmafia.com is 20JACK12",
                "/me The best user on epicmafia.com is LastProphet",
                "/me The best user on epicmafia.com is sl0nderman",
                "/me The best user on epicmafia.com is staming",
                "/me The best user on epicmafia.com is plissken",
                "/me The best user on epicmafia.com is Sirblockcraft",
                "/me The best user on epicmafia.com is Error",
                "/me The best user on epicmafia.com is fnoof",
                "/me The best user on epicmafia.com is abc",
                "/me The best user on epicmafia.com is CoryInConstantinople",
                "/me The best user on epicmafia.com is aquarius",
                "/me The best user on epicmafia.com is DearLeaderKim",
                "/me The best user on epicmafia.com is XFire1994",
                "/me The best user on epicmafia.com is Shwartz99",
                "/me The best user on epicmafia.com is TepLep",
                "/me The best user on epicmafia.com is monasticmaestoso",
                "/me The best user on epicmafia.com is minigun",
                "/me The best user on epicmafia.com is Furry",
                "/me The best user on epicmafia.com is Ashe",
                "/me The best user on epicmafia.com is Chaika",
                "/me The best user on epicmafia.com is SupBros",
                "/me The best user on epicmafia.com is groshu",
                "/me The best user on epicmafia.com is Shigginator",
                "/me The best user on epicmafia.com is Eddyward",
                "/me The best user on epicmafia.com is $1",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /^(lottery)|^(⺣)/i,
			callback: function(data) {
                if(!lottery) {
				sock.chat(sformat(arand(this.responses), [
					arand(meetd.members || Object.keys(users))
					]));
                lottery=data.user;
                }
                else {
					sock.chat("/me The winner of the lottery is "+lottery, data.user);
					}
				},
			responses: [
				"/me The winner of the lottery is... $1! Prize: 1 tub of ice-cream",
                "/me The winner of the lottery is... $1! Prize: 1 shark tank",
                "/me The winner of the lottery is... $1! Prize: 1 apple",
                "/me The winner of the lottery is... $1! Prize: 1 mouse-pad",
                "/me The winner of the lottery is... $1! Prize: 1 tree-house",
                "/me The winner of the lottery is... $1! Prize: immunity for day 1.",
                "/me The winner of the lottery is... $1! Prize: A macbook pro",
                "/me The winner of the lottery is... $1! Prize: An iphone 4",
                "/me The winner of the lottery is... $1! Prize: An iphone 4S",
                "/me The winner of the lottery is... $1! Prize: An iphone 5",
                "/me The winner of the lottery is... $1! Prize: An iphone 6",
                "/me The winner of the lottery is... $1! Prize: An iphone 7",
                "/me The winner of the lottery is... $1! Prize: A broken xylphone",
                "/me The winner of the lottery is... $1! Prize: A strawberry",
                "/me The winner of the lottery is... $1! Prize: 6 eggs.",
                "/me The winner of the lottery is... $1! Prize: Everyone congratulates $1 on its win!",
                "/me The winner of the lottery is... $1! Prize: A mushroom steak",
                "/me The winner of the lottery is... $1! Prize: A drink of pure water from Tuolumne river",
                "/me The winner of the lottery is... $1! Prize: n1'ed",
                "/me The winner of the lottery is... $1! Prize: A golf club",
                "/me The winner of the lottery is... $1! Prize: Shrooms",
                "/me The winner of the lottery is... $1! Prize: Cocaine",
                "/me The winner of the lottery is... $1! Prize: A compliment. Type '@Tamabot compliment' for a compliment.",
                "/me The winner of the lottery is... $1! Prize: A drink of pure water from Murray river",
                "/me The winner of the lottery is... $1! Prize: A baby elephant to raise",
                "/me The winner of the lottery is... $1! Prize: A mouse trap",
                "/me The winner of the lottery is... $1! Prize: A mouse trap",
                "/me The winner of the lottery is... $1! Prize: Good luck for the rest of the game.",
                "/me The winner of the lottery is... $1! Prize: Bad luck for the rest of the game.",
                "/me The winner of the lottery is... $1! Prize: A gun",
                "/me The winner of the lottery is... $1! Prize: A floatation device",
                "/me The winner of the lottery is... $1! Prize: A floatation device infested with rats",
                "/me The winner of the lottery is... $1! Prize: 10 tokens",
                "/me The winner of the lottery is... $1! Prize: 20 tokens",
                "/me The winner of the lottery is... $1! Prize: 5 tokens",
                "/me The winner of the lottery is... $1! Prize: A yo-yo",
                "/me The winner of the lottery is... $1! Prize: A deck of cards (the 5 of clubs is missing)",
                "/me The winner of the lottery is... $1! Prize: A mirror",
                "/me The winner of the lottery is... $1! Prize: The horn of an elephant",
                "/me The winner of the lottery is... $1! Prize: A insult. Type '@Tamabot insult' to recieve your free insult.",
                "/me The winner of the lottery is... $1! Prize: A fork",
                "/me The winner of the lottery is... $1! Prize: A knife",
                "/me The winner of the lottery is... $1! Prize: A spoon",
                "/me The winner of the lottery is... $1! Prize: A mysterious egg.",
                "/me The winner of the lottery is... $1! Prize: A deck of cards (the 8 of spades is missing).",
                "/me The winner of the lottery is... $1! Prize: A deck of cards (the ace of hearts is missing).",
                "/me The winner of the lottery is... $1! Prize: A deck of cards (the coloured joker is missing).",
                "/me The winner of the lottery is... $1! Prize: A free trip to australia for 7 days",
                "/me The winner of the lottery is... $1! Prize: A free trip to taiwan for 7 days",
                "/me The winner of the lottery is... $1! Prize: A free trip to california for 7 days",
                "/me The winner of the lottery is... $1! Prize: A free trip to antarctica for 7 days",
                "/me The winner of the lottery is... $1! Prize: A free trip to london for 7 days",
                "/me The winner of the lottery is... $1! Prize: A free trip to spain for 7 days",
                "/me The winner of the lottery is... $1! Prize: A free trip to easter island for 7 days",
                "/me The winner of the lottery is... $1! Prize: A free trip to new zealand for 7 days",
                "/me The winner of the lottery is... $1! Prize: 1 stray cat",
                "/me The winner of the lottery is... $1! Prize: 2 kittens",
                "/me The winner of the lottery is... $1! Prize: A girlfriend",
                "/me The winner of the lottery is... $1! Prize: A boyfriend",
                "/me The winner of the lottery is... $1! Prize: A free book. Type '@Tamabot library' to recieve your free book!",
                "/me The winner of the lottery is... $1! Prize: A stapler",
                "/me The winner of the lottery is... $1! Prize: A constant humming noise in the back of your head which never stops unless you kill one of your closest family members",
                "/me The winner of the lottery is... $1! Prize: A sock-puppet",
                "/me The winner of the lottery is... $1! Prize: A crystal ball",
                "/me The winner of the lottery is... $1! Prize: 1 loaf of bread",
                "/me The winner of the lottery is... $1! Prize: A picture of $1",
                "/me The winner of the lottery is... $1! Prize:  $1.",
                "/me The winner of the lottery is... $1! Prize:  Your very own command! PM Tamabot '87739571' and specify your command with what you want Tamabot to say in response.",
                "/me The winner of the lottery is... $1! Prize:  Your very own command! PM Tamabot '92835780' and specify your command with what you want Tamabot to say in response.",
                "/me The winner of the lottery is... $1! Prize:  A lemon",
                "/me The winner of the lottery is... $1! Prize:  Coal",
                "/me The winner of the lottery is... $1! Prize:  A potato",
                "/me The winner of the lottery is... $1! Prize:  Another lottery ticket to a knock-off lottery called 'lootery', type @Tamabot lootery to access.",
                "/me The winner of the lottery is... $1! Prize:  Fly-spray",
                "/me The winner of the lottery is... $1! Prize:  A lazer pointer",
                "/me The winner of the lottery is... $1! Prize:  A head.",
                "/me The winner of the lottery is... $1! Prize:  a bag of money",
                "/me The winner of the lottery is... $1! Prize:  A 100ml can of lemonade",
                "/me The winner of the lottery is... $1! Prize:  A 100ml can of coke",
                "/me The winner of the lottery is... $1! Prize:  A magazine",
                "/me The winner of the lottery is... $1! Prize:  A microwave",
                "/me The winner of the lottery is... $1! Prize:  An oven",
                "/me The winner of the lottery is... $1! Prize:  An ant-eater",
                "/me The winner of the lottery is... $1! Prize:  A drill",
                "/me The winner of the lottery is... $1! Prize:  Soap",
                "/me The winner of the lottery is... $1! Prize:  A dog toothbrush",
                "/me The winner of the lottery is... $1! Prize:  A chess board",
                "/me The winner of the lottery is... $1! Prize:  A checkers board",
                "/me The winner of the lottery is... $1! Prize:  A monopoly game",
                "/me The winner of the lottery is... $1! Prize:  <3",
                "/me The winner of the lottery is... $1! Prize:  A turkey",
                "/me The winner of the lottery is... $1! Prize:  A melon",
                "/me The winner of the lottery is... $1! Prize:  A watermelon",
                "/me The winner of the lottery is... $1! Prize:  A jigsaw puzzle",
                "/me The winner of the lottery is... $1! Prize:  A can of tuna",
                "/me The winner of the lottery is... $1! Prize:  A photo of a dog",
                "/me The winner of the lottery is... $1! Prize:  A dog",
                "/me The winner of the lottery is... $1! Prize:  A jack in the box",
                "/me The winner of the lottery is... $1! Prize:  A tamagotchi",
                "/me The winner of the lottery is... $1! Prize:  10 gallons of petrol",
                "/me The winner of the lottery is... $1! Prize:  A wristband. It reads: ???????",
                "/me The winner of the lottery is... $1! Prize:  A wristband. It reads: ?????? ?????",
                "/me The winner of the lottery is... $1! Prize:  A wristband. It reads: ???? ?? ?????",
                "/me The winner of the lottery is... $1! Prize:  A wristband. It reads: ?????????",
                "/me The winner of the lottery is... $1! Prize:  A wristband. It reads: ?? ??ℯ ????ℯ?? ????ℊℴ???, ?ℯ?? ??ℯ ??? ℴ? ?ℴ??? ??ℯ????",
                "/me The winner of the lottery is... $1! Prize:  A boombox",
                "/me The winner of the lottery is... $1! Prize:  A candy cane",
                "/me The winner of the lottery is... $1! Prize:  christmas lights",
                "/me The winner of the lottery is... $1! Prize:  A frying pan",
                "/me The winner of the lottery is... $1! Prize:  A pillow",
                "/me The winner of the lottery is... $1! Prize:  A photo of a photo of a dog",
                "/me The winner of the lottery is... $1! Prize:  A spanish tutor",
                "/me The winner of the lottery is... $1! Prize:  A slogan: 'θα νικήσουμε'",
                "/me The winner of the lottery is... $1! Prize:  A slogan: 'είμαι ο καλύτερος'",
                "/me The winner of the lottery is... $1! Prize:  A slogan: 'cyka blyat'",
                "/me The winner of the lottery is... $1! Prize:  A medium sized popcorn",
                "/me The winner of the lottery is... $1! Prize:  A small sized popcorn",
                "/me The winner of the lottery is... $1! Prize:  A large sized popcorn",
                "/me The winner of the lottery is... $1! Prize:  A drinking fountain",
                "/me The winner of the lottery is... $1! Prize:  A 6 meter pool",
                "/me The winner of the lottery is... $1! Prize:  A log",
                "/me The winner of the lottery is... $1! Prize:  A cloud of puff",
                "/me The winner of the lottery is... $1! Prize:  A flower pot",
                "/me The winner of the lottery is... $1! Prize:  A golf club",
                "/me The winner of the lottery is... $1! Prize:  A rose",
                "/me The winner of the lottery is... $1! Prize:  A make-up set",
                "/me The winner of the lottery is... $1! Prize:  An invisibility cloak",
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
                        name: "Advice",
			short: "@bot who should i...",
			regex: /^(Slotmachine)|^(⺥)/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses)));
				},
			responses: [
				"Broken",
				]
			},
		{
            name: "Advice",
			short: "@bot who should i...",
			regex: /chance|^(⺦)/i,
			callback: function(data) {
				sock.chat(sformat(arand(this.responses)));
				},
			responses: [
				"1%", "17%", "18%",
                "2%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", 
                "3%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", 
                "4%", "39%",  "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", 
                "5%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", 
                "6%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", 
                "7%", "98%", "99%", "100%", "0%", "8295396299849234671836689134691375636985629835876%", "why u ask me?", 
                "8%",
                "9%",
                "10%",
                "11%",
                "12%",
                "13%",
                "14%",
                "15%",
                "16%",
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
					sock.chat("noavis", data.user);
					}
				else {
					sock.chat("i belong to "+master, data.user);
					}
				}
			},
		{
			name: "Obey",
			regex: /^be? my \w|obey me/i,
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
			regex: /^(nospam)|^(shut up)|^(no spam)|^(yes spam)|^(⺴)/i,
			callback: function(data) {
				if(!nospam) {
					nospam=data.user;
					sock.chat("/me spam disabled");
					}
				else {
                    nospam=!nospam
					sock.chat("/me spam enabled ");
					}
				}
			},
		{
            name: "Obey",
			regex: /^demote|demote me|obey|obey m/i,
			callback: function(data) {
				if(!skunk) {
					skunk=data.user;
					sock.chat("yes peasant...", data.user);
					}
				else {
					sock.chat("you look into the sewers and see "+master, data.user);
					}
				}
			},
		{
            name: "Obey",
			regex: /^teach me|teach|teacher|learn/i,
			callback: function(data) {
				if(!teacher) {
					teacher=data.user;
					sock.chat("yes owner...", data.user);
					}
				else {
					sock.chat("%"+king, data.user);
					}
				}
			},
		{
            name: "Obey",
			regex: /^promote|promote me|prom|promoteme/i,
			callback: function(data) {
				if(!king) {
					king=data.user;
					sock.chat("yes sir...", data.user);
					}
				else {
					sock.chat("the king is "+king, data.user);
					}
				}
			},
		{
             name: "Obey",
			regex: /^be free|free|befree/i,
			callback: function(data) {
				if(king) {
					king=!king
					sock.chat("yes sir...", data.user);
					}
				else {
					sock.chat("the king is no one "+king, data.user);
					}
				}
			},
		{
             name: "Obey",
			regex: /^occupation|state|status/i,
			callback: function(data) {
                if(data.user===terrorist) {
                    sock.chat("You are the terrorist ?", data.user);
                }
                else {
				if(data.user===king) {					
					sock.chat("You are the king ?", data.user);
					}
                if(data.user===master) {					
					sock.chat("You are my master ?", data.user);
					}
                if(data.user===skunk) {					
					sock.chat("You are a peasant ?", data.user);
					}
                if(data.user===kingofthehill) {					
					sock.chat("You are king of the hill ?", data.user);
					}
                if(data.user===challenger) {					
					sock.chat("You are a challenger ?", data.user);
					}
                if(data.user===teacher) {					
					sock.chat("You are the timekeeper ⌚", data.user);
					}
                if(data.user===nospam) {					
					sock.chat("You are the police officer ?", data.user);
					}
                if(data.user===king && master && skunk) {					
					sock.chat("You are the ruler ?", data.user);
					}
				else {
					sock.chat("");
					}
                }
				}
			},
		{
            name: "Obey",
			regex: /^steal/i,
			callback: function(data) {
				if(data.user===token1) {
					token2=data.user;
					sock.chat("You steal another token", data.user);
					}
                else {
					token1=data.user;
					sock.chat("You steal a token", data.user);
					}
				}
			},
		{
            name: "Obey",
			regex: /^steal/i,
			callback: function(data) {
				if(data.user) {
					token1=data.user;
					sock.chat("You steal a token", data.user);
					}
				else {
					sock.chat("You fail "+king, data.user);
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
            name: "Obey",
			regex: /^balance|^bank|^tokens|^token|^money/i,
			callback: function(data) {
                if (data.user===toke10) {
                    sock.chat("You have 10 token ?", data.user);
                }
                else {
				if(data.user===token1) {
                    if(data.user===token2) {
					sock.chat("You have 2 token ?", data.user);
					}
                    else {
					sock.chat("You have 1 token ?", data.user);
					}
                }
				else {
					sock.chat("You have 0 token ?", data.user);
					}
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
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"/me rolls over",
				"/me rolls over for senpai",
				"/me doesn't feel like it"
				]
			},
		{
            name: "Roll over",
			regex: /^(jukebox)|^(⺧)/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"/me songs available: track1, track2, track3"
				]
			},
		{
            name: "Toggle slavemode",
			regex: /^shut eown|^(⺩)/i,
			callback: function() {
				ej.settings^=OBEYME;
				sock.chat(ej.settings & OBEYME ?
					"Bot on" :
					"Tamabot is shutting down..."
					);
				}
			},
		{
			name: "Bow",
			regex: /^bow/i,
			callback: function(data) {
				if(data.user===master) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"/me bows politely",
				"/me bows for her master...",
				"/me stumbles and falls down"
				]
			},
		{
            name: "Bow",
			regex: /tamagotchi|^(⺪)/i,
			callback: function(data) {
				if(data.user===master) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"hi",
				"Hey",
				]
			},
		{
            name: "Bow",
			regex: /^slots|^(⺫)/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"Type '@Tamabot roll' to start slots. Get 3 of the same colour in a line (any direction) to win. Yellow not included."
				]
			},
		{
            name: "Sing",
            short: "@bot sing",
            regex: /^chaika|^(⺭)/i,
            callback: function(data){
                var msgArray = ["▓▒▒▓▒▒▒▄▓▓▓▓▓▒▒▒▒▄▓▒▓▒▒▓ ▓▒▒▄▄█████▄▓▒▒▒▄████▓▄▒▓ ▓▄▀▀▒░░░▓▓▓▓▒▒▒░░▒░▒▓░▒▓ ▒▒░▄▄▄▄▄░░▓▓▓▒▒░░░▄█▄▄░▒", "▓░█▀████░░░░▓▒░░░▀███▀▄▒ ▓▀█░░███░░░░▒░░░░░▀▀▀░░▒ ▓▒░▀░░▄▄░░░░░░▄░░░▀█▀░░▒ ▒░▒▒░▒▒▒░░░░░░░▄░░▒▒░▒▒▒", "▒▒░░░▒▒▒░░░░░░░▀░░▒▒░░░▒ ▒▒▒▒░░░░░░▄░░░░░░░░░░▒▒▒ ▓▓▓▒▒▒░░░▄▀▀▄▄░▄▄▀░░░░█▓ ▓▓▓▓█▄░░░░░░░░░░░░░░▄█▓▓"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 1*i); } } busy = 0; } 
        },
          {
              name: "Sing",
            short: "@bot sing",
            regex: /^jampire/i,
            callback: function(data){
                var msgArray = ["██░██▀██▄▀█▀▄█▀▄███▀▄███ █░██▀░░▀██▄███▄▄▄▀░███▀░ █░██▄▄████████████████▄▄ ▄█████████▀█████████████", "████████▀░░░████████████ ██████▀░░░░░░▀██████████ ████▀░░░░░░░░░░▀▀▀▀█████ ████░███░░░░░░░▄▄▄░▀████", "█▀█░░▀▀▀░░░░░░░███░░████ ▄██░░░░░░░░▀░░░░░░░░████ ███░░░░█░░░▄░░░█░░░░████ ░███▄░░░▀▀▀░▀▀▀░░░░░████"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 1*i); } } busy = 0; } 
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
             name: "Bow",
			regex: /^sluts/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"@Tamabotㅤ?ㅤ?ㅤ? slut 1",
                "Maybe",
                "Yes",
                "No",
                "̿'̿'\̵͇̿̿\з=( ͠° ͟ʖ ͡°)=ε/̵͇̿̿/'̿̿ ̿ ̿ ̿ ̿ ̿",
				]
			},
		{
            name: "Bow",
			regex: /^slotscore/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"3 yellow = 1 point, 3 red = 3 points, 3 brown = 5 points, 3 blue = 20 points, 3 same = triple points"
				]
			},
		{
            name: "Bow",
			regex: /slut 1/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"@Tamabotㅤ?ㅤ?ㅤ? slut 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slut 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slut 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slut 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slut 2",
				]
			},
		{
            name: "Bow",
			regex: /slut 2/i,
			callback: function(data) {
				if(data.user===skunk) {
					sock.chat("No", data.user);
					}
				else {
					sock.chat(arand(this.responses));
					}
				},
			responses: [
				"@Tamabotㅤ?ㅤ?ㅤ? slut 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slut 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slut 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slut 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slut 3",
				]
			},
        		{
                    name: "Bow",
			regex: /^(puzzlebox)/i,
			callback: function(data) {
           if(storydead) {       
               sock.chat("/me You find yourself floating in the afterlife. You realise you have failed the puzzlebox, and you vow not to ever retry.");
               storydead=!storydead;
           }
           else if(!story) {
					sock.chat("/me You have been trapped in the puzzlebox. A laughter echoes throughout the walls. type 'next'");
                      story=data.user;
					}
				else {
					sock.chat("/me You thought there was a back exit, didn't you? Well in fact, there is! Type 'exit' to leave the puzzlebox.");
                }
           }
            },
		{
            name: "Sing",
            short: "@bot sing",
            regex: /^(exit)/i,
            callback: function(data){
                if(!storydead && !storyplasma) {
                   storydead=data.user;
                    story=!story
                var msgArray = ["/me You STEP OUTSIDE"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 2*i); } } busy = 0; } 
            else if(storyplasma) {
                 var msgArray = ["You STEO OUTSIDE "]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 2*i); } } busy = 0; } 
            }
            },
          {
              name: "Sing",
            short: "@bot sing",
            regex: /^(next)/i,
            callback: function(data){
                if(story && !story2) {
                   story2=data.user;
                var msgArray = ["/me You look around the room and see a locked wooden door, and a note written in blood. It reads: ⱧɆⱠⱠØ. ł ₳₥ Jł₲₴₳₩", "/me The door has a numberpad on ", "/me j"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 20*i); } } busy = 0; } 
            else if(storyplasma) {
                 var msgArray = ["You STEO OUTSIDE "]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 2*i); } } busy = 0; } 
            }
            },
          {
            name: "Sing",
            short: "@bot sing",
            regex: /^(makechoice)/i,
            callback: function(data){
                if(data.user===master) {
                var msgArray = ["After a few years, you start ascribing certain meanings to certain sounds.", "With this new language, you are able to describe yourself at two years old.", "To say you are thirsty, type 'thirsty'", "To say you are hungry, type 'hungry'"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 2*i); } } busy = 0; } 
            }
            },
          {
              name: "Sing",
            short: "@bot sing",
            regex: /^(thirsty)/i,
            callback: function(data){
                if(data.user===master) {
                var msgArray = ["Because you are two years old, there are many things you don't understand yet. One night, you wake up in the dark.", "Shadows seem to crawl up your walls, but they don't bother you much. You're haunted by other things.", "You want something. Maybe water. Maybe your mother.", "Maybe something you've never seen before. You start to cry, but no one comes. Type 'continue'",]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 2*i); } } busy = 0; } 
            }
            },
          {
            name: "Sing",
            short: "@bot sing",
            regex: /^(hungry)/i,
            callback: function(data){
                if(data.user===master) {
                var msgArray = ["Because you are two years old, there are many things you don't understand. One night, your mother feeds the cat.", "This upsets you. Why would she do that? Surely, you're more important to her than the cat is.", "To throw a fit, type 'fit'", "To throw your food across the kitchen, type 'throw'",]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 2*i); } } busy = 0; } 
            }
            },
          {
            name: "Sing",
            short: "@FROM HUNGRY 0",
            regex: /^(fit)/i,
            callback: function(data){
                if(data.user===master) {
                var msgArray = ["Because you are two years old, there are many things you don't understand. One night, your mother feeds the cat.", "This upsets you. Why would she do that? Surely, you're more important to her than the cat is.", "To throw a fit, type 'fit'", "To throw your food across the kitchen, type 'throw'",]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 2*i); } } busy = 0; } 
            }
            },
          {
             name: "Bow",
			regex: /^charge|^(⺮)/i,
			callback: function(data) {
				if(data.user===chargedisabled) {
					sock.chat("");
					}
				else {
					sock.chat(arand(this.responses));
                    chargedisabled=data.user;
					}
				},
			responses: [
				"@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "@Tamabotㅤ░░░░░ ｂａｄ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
				]
			},
		{
             name: "Bow",
			regex: /░░░░░ ｂａｄ/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"@Tamabotㅤ░░░░ㅤ ａｗｆｕｌ",
                "@Tamabotㅤ░░░░ㅤ ａｗｆｕｌ",
                "@Tamabotㅤ░░░░ㅤ ａｗｆｕｌ",
                "@Tamabotㅤ░░░░ㅤ ａｗｆｕｌ",
                "@Tamabotㅤ░░░░ㅤ ａｗｆｕｌ",
                "@Tamabotㅤ░░░░ㅤ ａｗｆｕｌ",
                "@Tamabotㅤ░░░░ㅤ ａｗｆｕｌ",
                "@Tamabotㅤ░░░░ㅤ ａｗｆｕｌ",
                "@Tamabotㅤ░░░░ㅤ ａｗｆｕｌ",
                "@Tamabotㅤ░░░░ㅤ ａｗｆｕｌ",
                "@Tamabotㅤ░░░░ㅤ ａｗｆｕｌ",
                "@Tamabotㅤ░░░░ㅤ ａｗｆｕｌ",
                "@Tamabotㅤ░░░░ㅤ ａｗｆｕｌ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
				]
			},
		{
            name: "Bow",
			regex: /░░░░ㅤ ａｗｆｕｌ/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"@Tamabotㅤ░░░ㅤㅤ ｔｅｒｒｉｂｌｅ",
                "@Tamabotㅤ░░░ㅤㅤ ｔｅｒｒｉｂｌｅ",
                "@Tamabotㅤ░░░ㅤㅤ ｔｅｒｒｉｂｌｅ",
                "@Tamabotㅤ░░░ㅤㅤ ｔｅｒｒｉｂｌｅ",
                "@Tamabotㅤ░░░ㅤㅤ ｔｅｒｒｉｂｌｅ",
                "@Tamabotㅤ░░░ㅤㅤ ｔｅｒｒｉｂｌｅ",
                "@Tamabotㅤ░░░ㅤㅤ ｔｅｒｒｉｂｌｅ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
				]
			},
		{
            name: "Bow",
			regex: /░░░ㅤㅤ ｔｅｒｒｉｂｌｅ/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"@Tamabot  ░░ㅤㅤㅤ ｄｒｅａｄｆｕｌ",
                "@Tamabot  ░░ㅤㅤㅤ ｄｒｅａｄｆｕｌ",
                "@Tamabot  ░░ㅤㅤㅤ ｄｒｅａｄｆｕｌ",
                "@Tamabot  ░░ㅤㅤㅤ ｄｒｅａｄｆｕｌ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
				]
			},
		{
                        name: "Bow",
			regex: /░░ㅤㅤㅤ ｄｒｅａｄｆｕｌ/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"@Tamabot  ░ㅤㅤㅤㅤ ａｂｏｍｉｎａｂｌｅ",
                "@Tamabot  ░ㅤㅤㅤㅤ ａｂｏｍｉｎａｂｌｅ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
				]
			},
		{
            name: "Bow",
			regex: /░ㅤㅤㅤㅤ ａｂｏｍｉｎａｂｌｅ/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"@Tamabot  ㅤㅤㅤㅤㅤ ｉｎｃｏｎｃｅｉｖａｂｌｙ　ｄｉｓｇｒａｃｅｆｕｌ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
				]
			},
		{
                         name: "Bow",
			regex: /░░░░░ ｇｏｏｄ/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"@Tamabotㅤ▓░░░░ ｇｒｅａｔ",
                "@Tamabotㅤ▓░░░░ ｇｒｅａｔ",
                "@Tamabotㅤ▓░░░░ ｇｒｅａｔ",
                "@Tamabotㅤ▓░░░░ ｇｒｅａｔ",
                "@Tamabotㅤ▓░░░░ ｇｒｅａｔ",
                "@Tamabotㅤ▓░░░░ ｇｒｅａｔ",
                "@Tamabotㅤ▓░░░░ ｇｒｅａｔ",
                "@Tamabotㅤ▓░░░░ ｇｒｅａｔ",
                "@Tamabotㅤ▓░░░░ ｇｒｅａｔ",
                "@Tamabotㅤ▓░░░░ ｇｒｅａｔ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
				]
			},
		{
            name: "Bow",
			regex: /▓░░░░ ｇｒｅａｔ/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"@Tamabotㅤ▓▓░░░ ａｍａｚｉｎｇ！",
                "@Tamabotㅤ▓▓░░░ ａｍａｚｉｎｇ！",
                "@Tamabotㅤ▓▓░░░ ａｍａｚｉｎｇ！",
                "@Tamabotㅤ▓▓░░░ ａｍａｚｉｎｇ！",
                "@Tamabotㅤ▓▓░░░ ａｍａｚｉｎｇ！",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
				]
			},
		{
            name: "Bow",
			regex: /▓▓░░░ ａｍａｚｉｎｇ！/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"@Tamabot  ▓▓▓░░ｆａｎｔａｓｔｉｃ！",
                "@Tamabot  ▓▓▓░░ｆａｎｔａｓｔｉｃ！",
                "@Tamabot  ▓▓▓░░ｆａｎｔａｓｔｉｃ！",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
				]
			},
		{
            name: "Bow",
			regex: /▓▓▓░░ｆａｎｔａｓｔｉｃ！/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"@Tamabot  ▓▓▓▓░ ｏｕｔｓｔａｎｄｉｎｇ！",
                "@Tamabot  ▓▓▓▓░ ｏｕｔｓｔａｎｄｉｎｇ！",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
				]
			},
		{
            name: "Bow",
			regex: /▓▓▓▓░ ｏｕｔｓｔａｎｄｉｎｇ！/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"@Tamabot ▓▓▓▓▓ ｓｅｎｓａｔｉｏｎａｌ！",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
				]
			},
		{
            name: "Bow",
			regex: /▓▓▓▓▓ ｓｅｎｓａｔｉｏｎａｌ！/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"@Tamabotㅤ█████ ｓｕｐｅｒｃａｌｉｆｒａｇｉｌｉｓｔｉｃｅｘｐｉａｌｉｄｏｃｉｏｕｓ！",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
				]
			},
		{
            name: "Bow",
			regex: /█████ ｓｕｐｅｒｃａｌｉｆｒａｇｉｌｉｓｔｉｃｅｘｐｉａｌｉｄｏｃｉｏｕｓ！/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"@Tamabotㅤ░░░░░ ｇｏｏｄ ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
                "ＧＡＭＥㅤㅤㅤＯＶＥＲ",
				]
			},
		{
              name: "Bow",
			regex: /^roll|^(⺯)/i,
			callback: function(data) {
				if(data.user===slotsdisabled) {
					sock.chat("");
					}
				else {
					sock.chat(arand(this.responses));
                    slotsdisabled=data.user;
					}
				},
			responses: [
				"@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 1",
				]
			},
		{
             name: "Bow",
			regex: /slot 1/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2", 
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 2",
				]
			},
		{
            name: "Bow",
			regex: /slot 2/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("you're not the boss of me", data.user);
					}
				},
			responses: [
				"@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
                "@Tamabotㅤ?ㅤ?ㅤ? slot 3",
				]
			},
		{
            name: "Sing",
            short: "@bot sing",
            regex: /^(track1)/i,
            callback: function(data){
                if (!nospam) {
                var msgArray = ["/me (Yeah, Ah-Ah-Ah-Ah-Ah-Ark)", "/me Oo-ooh-ooh, hoo yeah, yeah", "/me Yeah, yeah", "/me Yeah-ah-ah", "/me Yeah-ah-ah", "/me Yeah-ah-ah", "/me Yeah-ah-ah", "/me Yeah, yeah, yeah",

"/me Seven a.m., waking up in the morning", "/me Gotta be fresh, gotta go downstairs", "/me Gotta have my bowl, gotta have cereal", "/me Seein' everything, the time is goin'", "/me Tickin' on and on, everybody's rushin'", "/me Gotta get down to the bus stop", "/me Gotta catch my bus, I see my friends (My friends)",

"/me Kickin' in the front seat", "/me Sittin' in the back seat", "/me Gotta make my mind up", "/me Which seat can I take?",

"/me It's Friday, Friday", "/me Gotta get down on Friday", "/me Everybody's lookin' forward to the weekend, weekend", "/me Friday, Friday", "/me Gettin' down on Friday", "/me Everybody's lookin' forward to the weekend",

"/me Partyin', partyin' (Yeah)", "/me Partyin', partyin' (Yeah)", "/me Fun, fun, fun, fun", "/me Lookin' forward to the weekend",

"/me 7: 45, we're drivin' on the highway", "/me Cruisin' so fast, I want time to fly", "/me Fun, fun, think about fun", "/me You know what it is", "/me I got this, you got this", "/me My friend is by my right, ay", "/me I got this, you got this", "/me Now you know it",

"/me Kickin' in the front seat", "/me Sittin' in the back seat", "/me Gotta make my mind up", "/me Which seat can I take?",

"/me It's Friday, Friday", "/me Gotta get down on Friday", "/me Everybody's lookin' forward to the weekend, weekend", "/me Friday, Friday", "/me Gettin' down on Friday", "/me Everybody's lookin' forward to the weekend",

"/me Partyin', partyin' (Yeah)", "/me Partyin', partyin' (Yeah)", "/me Fun, fun, fun, fun", "/me Lookin' forward to the weekend",

"/me Yesterday was Thursday, Thursday", "/me Today it is Friday, Friday (Partyin')", "/me We-we-we so excited", "/me We so excited", "/me We gonna have a ball today",

"/me Tomorrow is Saturday", "/me And Sunday comes after... wards", "/me I don't want this weekend to end",

"/me R-B, Rebecca Black", "/me So chillin' in the front seat (In the front seat)", "/me In the back seat (In the back seat)", "/me I'm drivin', cruisin' (Yeah, yeah)", "/me Fast lanes, switchin' lanes", "/me With' a car up on my side (Woo!)", "/me (C'mon) Passin' by is a school bus in front of me", "/me Makes tick tock, tick tock, wanna scream", "/me Check my time, it's Friday, it's a weekend", "/me We gonna have fun, c'mon, c'mon, y'all",

"/me It's Friday, Friday", "/me Gotta get down on Friday", "/me Everybody's lookin' forward to the weekend, weekend", "/me Friday, Friday", "/me Gettin' down on Friday", "/me Everybody's lookin' forward to the weekend",

"/me Partyin', partyin' (Yeah)", "/me Partyin', partyin' (Yeah)", "/me Fun, fun, fun, fun", "/me Lookin' forward to the weekend",

"/me It's Friday, Friday", "/me Gotta get down on Friday", "/me Everybody's lookin' forward to the weekend, weekend", "/me Friday, Friday", "/me Gettin' down on Friday", "/me Everybody's lookin' forward to the weekend",

"/me Partyin', partyin' (Yeah)", "/me Partyin', partyin' (Yeah)", "/me Fun, fun, fun, fun", "/me Lookin' forward to the weekend"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 2000*i); } } busy = 0; } 
            }
            },
        {
            name: "Sing",
            short: "@bot sing",
            regex: /^(track2)/i,
            callback: function(data){
                if (!nospam) {
                var msgArray = ["/me We're no strangers to love", "/me You know the rules and so do I", "/me A full commitment's what I'm thinking of", "/me You wouldn't get this from any other guy", "/me I just wanna tell you how I'm feeling", "/me Gotta make you understand", "/me Never gonna give you up", "/me Never gonna let you down",

"/me Never gonna run around and desert you", "/me Never gonna make you cry", "/me Never gonna say goodbye", "/me Never gonna tell a lie and hurt you", "/me We've known each other for so long", "/me Your heart's been aching, but", "/me You're too shy to say it",

"/me Inside, we both know what's been going on", "/me We know the game and we're gonna play it", "/me And if you ask me how I'm feeling", "/me Don't tell me you're too blind to see",

"/me Never gonna give you up", "/me Never gonna let you down", "/me Never gonna run around and desert you", "/me Never gonna make you cry", "/me Never gonna say goodbye", "/me Never gonna tell a lie and hurt you",

"/me Never gonna give you up", "/me Never gonna let you down",

"/me Never gonna run around and desert you", "/me Never gonna make you cry", "/me Never gonna say goodbye", "/me Never gonna tell a lie and hurt you",
                                
"/me Never gonna give you up", "/me Never gonna let you down",

"/me Never gonna run around and desert you", "/me Never gonna make you cry", "/me Never gonna say goodbye", "/me Never gonna tell a lie and hurt you",

"/me (Ooh, give you up)", "/me (Ooh, give you up)", "/me Never gonna give, never gonna give", "/me (Give you up)",

"/me Never gonna give, never gonna give", "/me (Give you up)", 
                                
"/me We've known each other for so long", "/me Your heart's been aching, but", "/me You're too shy to say it",

"/me Inside, we both know what's been going on", "/me We know the game and we're gonna play it",

"/me I just wanna tell you how I'm feeling", "/me Gotta make you understand", 
"/me Never gonna give you up", "/me Never gonna let you down",

"/me Never gonna run around and desert you", "/me Never gonna make you cry", "/me Never gonna say goodbye", "/me Never gonna tell a lie and hurt you",
                                
"/me Never gonna give you up","/me Never gonna let you down",

"/me Never gonna run around and desert you", "/me Never gonna make you cry", "/me Never gonna say goodbye", "/me Never gonna tell a lie and hurt you",
                                
"> Never gonna give you up", "> Never gonna let you down",

"> Never gonna run around and desert you", "> Never gonna make you cry", "> Never gonna say goodbye", "> Never gonna tell a lie and hurt you"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 5000*i); } } busy = 0; } 
            }
            },
         {
              name: "Sing",
            short: "@bot sing",
            regex: /^(track3|we are number one)/i,
            callback: function(data){
                if (!nospam) {
                var msgArray = ["/me Hey!", "/me We are Number One", "/me Hey!", "/me We are Number One", 
                               "/me Now listen closely", "/me Here's a little lesson in trickery", "/me This is going down in history", "/me If you wanna be a Villain Number One", 
                               "/me You have to chase a superhero on the run", "/me Just follow my moves, and sneak around", "/me Be careful not to make a sound", "/me Shh", 
                               "/me C R U N C H", "/me No, don't touch that!", "/me We are Number One", "/me Hey!", 
                               "/me We are Number One", "/me Ha ha ha", "/me Now look at this net, that I just found", "/me When I say go, be ready to throw", 
                               "/me Go!", "/me Throw it at him, not me!", "/me Ugh, let's try something else", 
                               "/me Now watch and learn, here's the deal", "/me He'll slip and slide on this banana peel", "/me Ha ha ha, WHAT ARE YOU DOING!?", "/me ba-ba-biddly-ba-ba-ba-ba, ba-ba-ba-ba-ba-ba-ba", 
                               "/me We are Number One", "/me Hey!", "/me ba-ba-biddly-ba-ba-ba-ba, ba-ba-ba-ba-ba-ba-ba", "/me We are Number One", 
                               "/me ba-ba-biddly-ba-ba-ba-ba, ba-ba-ba-ba-ba-ba-ba", "/me We are Number One", "/me Hey!", "/me ba-ba-biddly-ba-ba-ba-ba, ba-ba-ba-ba-ba-ba-ba", 
                               "/me We are Number One", "/me Hey!", "/me Hey!" ]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 4000*i); } } busy = 0; } 
            }
            },
         {
            name: "Sing",
            short: "@bot sing",
            regex: /^bee movie|^(⺰)/i,
            callback: function(data){
                if (!nospam) {
                var msgArray = ["/me According to all known laws of aviation,",
                                "/me there is no way a bee should be able to fly.", 
                                "/me Its wings are too small to get its fat little body off the ground.",
                                "/me The bee, of course, flies anyway",
                                "/me because bees don't care what humans think is impossible.",
                                "/me Yellow, black. Yellow, black.",
                                "/me Yellow, black. Yellow, black.",
                                "/me Ooh, black and yellow!",
                                "/me Let's shake it up a little.",
                                "/me Barry! Breakfast is ready!",
                                "/me Ooming!",
                                "/me Hang on a second.",
                                "/me Hello?",
                                "/me - Barry?",
                                "/me - Adam?",
                                "/me - Can you believe this is happening?",
                                "/me - I can't. I'll pick you up.",
                                "/me Looking sharp.",
                                "/me Use the stairs. Your father paid good money for those.",
                                "/me Sorry. I'm excited.",
                                "/me Here's the graduate. We're very proud of you, son.",
                                "/me A perfect report card, all B's.",
                                "/me Very proud.",
                                "/me Ma! I got a thing going here.",
                                "/me - You got lint on your fuzz.",
                                "/me - Ow! That's me!",
                                "/me - Wave to us! We'll be in row 118,000.",
                                "/me - Bye!",
                                "/me Barry, I told you, stop flying in the house!",
                                "/me - Hey, Adam.",
"/me - Hey, Barry.",
"/me - Is that fuzz gel?",
"/me - A little. Special day, graduation.",
"/me Never thought I'd make it.",
"/me Three days grade school, three days high school.",
"/me Those were awkward.",
"/me Three days college. I'm glad I took a day and hitchhiked around the hive.",
"/me You did come back different.",
"/me - Hi, Barry.",
"/me - Artie, growing a mustache? Looks good.",
"/me - Hear about Frankie?",
"/me - Yeah.",
"/me - You going to the funeral?",
"/me - No, I'm not going.",
"/me Everybody knows, sting someone, you die.",
"/me Don't waste it on a squirrel. Such a hothead.",
"/me I guess he could have just gotten out of the way.",
"/me I love this incorporating an amusement park into our day.",
"/me That's why we don't need vacations.",
"/me Boy, quite a bit of pomp... under the circumstances.",
"/me - Well, Adam, today we are men.",
"/me - We are!",
"/me - Bee-men.",
"/me - Amen!",
"/me Hallelujah!",
"/me Students, faculty, distinguished bees,",
"/me please welcome Dean Buzzwell.",
"/me Welcome, New Hive Oity graduating class of...",
"/me ...9:15.",
"/me That concludes our ceremonies.",
"/me And begins your career at Honex Industries!",
"/me Will we pick ourjob today?",
"/me I heard it's just orientation.",
"/me Heads up! Here we go.",
"/me Keep your hands and antennas inside the tram at all times.",
"/me - Wonder what it'll be like?",
"/me - A little scary.",
"/me Welcome to Honex, a division of Honesco",
"/me and a part of the Hexagon Group.",
"/me This is it!",
"/me Wow.",
"/me Wow.",
"/me We know that you, as a bee, have worked your whole life",
"/me to get to the point where you can work for your whole life.",
"/me Honey begins when our valiant Pollen Jocks bring the nectar to the hive.",
"/me Our top-secret formula",
"/me is automatically color-corrected, scent-adjusted and bubble-contoured",
"/me into this soothing sweet syrup",
"/me with its distinctive golden glow you know as...",
"/me Honey!",
"/me - That girl was hot.",
"/me - She's my cousin!",
"/me - She is?",
"/me - Yes, we're all cousins.",
"/me - Right. You're right.",
"/me - At Honex, we constantly strive",
"/me to improve every aspect of bee existence.",
"/me These bees are stress-testing a new helmet technology.",
"/me - What do you think he makes?",
"/me - Not enough.",
"/me Here we have our latest advancement, the Krelman.",
"/me - What does that do?",
"/me - Oatches that little strand of honey",
"/me that hangs after you pour it. Saves us millions.",
"/me Can anyone work on the Krelman?",
"/me Of course. Most bee jobs are small ones. But bees know",
"/me that every small job, if it's done well, means a lot.",
"/me But choose carefully",
"/me because you'll stay in the job you pick for the rest of your life.",
"/me The same job the rest of your life? I didn't know that.",
"/me What's the difference?",
"/me You'll be happy to know that bees, as a species, haven't had one day off",
"/me in 27 million years.",
"/me So you'll just work us to death?",
"/me We'll sure try.",
"/me Wow! That blew my mind!",
"/me What's the difference? How can you say that?",
"/me One job forever? That's an insane choice to have to make.",
"/me I'm relieved. Now we only have to make one decision in life.",
"/me But, Adam, how could they never have told us that?",
"/me Why would you question anything? We're bees.",
"/me We're the most perfectly functioning society on Earth.",
"/me You ever think maybe things work a little too well here?",
"/me Like what? Give me one example.",
"/me I don't know. But you know what I'm talking about.",
"/me Please clear the gate. Royal Nectar Force on approach.",
"/me Wait a second. Check it out.",
"/me - Hey, those are Pollen Jocks!",
"/me - Wow.",
"/me I've never seen them this close.",
"/me They know what it's like outside the hive.",
"/me Yeah, but some don't come back.",
"/me - Hey, Jocks!",
"/me - Hi, Jocks!",
"/me You guys did great!",
"/me You're monsters!",
"/me You're sky freaks! I love it! I love it!",
"/me - I wonder where they were.",
"/me - I don't know.",
"/me Their day's not planned.",
"/me Outside the hive, flying who knows where, doing who knows what.",
"/me You can'tjust decide to be a Pollen Jock. You have to be bred for that.",
"/me Right.",
"/me Look. That's more pollen than you and I will see in a lifetime.",
"/me It's just a status symbol. Bees make too much of it.",
"/me Perhaps. Unless you're wearing it and the ladies see you wearing it.",
"/me Those ladies?",
"/me Aren't they our cousins too?",
"/me Distant. Distant.",
"/me Look at these two.",
"/me - Oouple of Hive Harrys.",
"/me - Let's have fun with them.",
"/me It must be dangerous being a Pollen Jock.",
"/me Yeah. Once a bear pinned me against a mushroom!",
"/me He had a paw on my throat, and with the other, he was slapping me!",
"/me - Oh, my!",
"/me - I never thought I'd knock him out.",
"/me What were you doing during this?",
"/me Trying to alert the authorities.",
"/me I can autograph that.",
"/me A little gusty out there today, wasn't it, comrades?",
"/me Yeah. Gusty.",
"/me We're hitting a sunflower patch six miles from here tomorrow.",
"/me - Six miles, huh?",
"/me - Barry!",
"/me A puddle jump for us, but maybe you're not up for it.",
"/me - Maybe I am.",
"/me - You are not!",
"/me We're going 0900 at J-Gate.",
"/me What do you think, buzzy-boy?",
"/me Are you bee enough?",
"/me I might be. It all depends on what 0900 means.",
"/me Hey, Honex!",
"/me Dad, you surprised me.",
"/me You decide what you're interested in?",
"/me - Well, there's a lot of choices.",
"/me - But you only get one.",
"/me Do you ever get bored doing the same job every day?",
"/me Son, let me tell you about stirring.",
"/me You grab that stick, and you just move it around, and you stir it around.",
"/me You get yourself into a rhythm. It's a beautiful thing.",
"/me You know, Dad, the more I think about it,",
"/me maybe the honey field just isn't right for me.",
"/me You were thinking of what, making balloon animals?",
"/me That's a bad job for a guy with a stinger.",
"/me Janet, your son's not sure he wants to go into honey!",
"/me - Barry, you are so funny sometimes.",
"/me - I'm not trying to be funny.",
"/me You're not funny! You're going into honey. Our son, the stirrer!",
"/me - You're gonna be a stirrer?",
"/me - No one's listening to me!",
"/me Wait till you see the sticks I have.",
"/me I could say anything right now.",
"/me I'm gonna get an ant tattoo!",
"/me Let's open some honey and celebrate!",
"/me Maybe I'll pierce my thorax.",
"/me Shave my antennae.",
"/me Shack up with a grasshopper. Get a gold tooth and call everybody dawg!",
"/me I'm so proud.",
"/me - We're starting work today!",
"/me - Today's the day.",
"/me Come on! All the good jobs will be gone.",
"/me Yeah, right.",
"/me Pollen counting, stunt bee, pouring, stirrer, front desk, hair removal...",
"/me - Is it still available?",
"/me - Hang on. Two left!",
"/me One of them's yours! Oongratulations!",
"/me Step to the side.",
"/me - What'd you get?",
"/me - Picking crud out. Stellar!",
"/me Wow!",
"/me Couple of newbies?",
"/me Yes, sir! Our first day! We are ready!",
"/me Make your choice.",
"/me - You want to go first?",
"/me - No, you go.",
"/me Oh, my. What's available?",
"/me Restroom attendant's open, not for the reason you think.",
"/me - Any chance of getting the Krelman?",
"/me - Sure, you're on.",
"/me I'm sorry, the Krelman just closed out.",
"/me Wax monkey's always open.",
"/me The Krelman opened up again.",
"/me What happened?",
"/me A bee died. Makes an opening. See?",
"/me He's dead. Another dead one.",
"/me Deady. Deadified. Two more dead.",
"/me Dead from the neck up.",
"/me Dead from the neck down. That's life!",
"/me Oh, this is so hard!",
"/me Heating, cooling, stunt bee, pourer, stirrer,",
"/me humming, inspector number seven, lint coordinator, stripe supervisor,",
"/me mite wrangler. Barry, what do you think I should... Barry?",
"/me Barry!",
"/me All right, we've got the sunflower patch in quadrant nine...",
"/me What happened to you?",
"/me Where are you?",
"/me - I'm going out.",
"/me - Out? Out where?",
"/me - Out there.",
"/me - Oh, no!",
"/me I have to, before I go to work for the rest of my life.",
"/me You're gonna die! You're crazy! Hello?",
"/me Another call coming in.",
"/me If anyone's feeling brave, there's a Korean deli on 83rd",
"/me that gets their roses today.",
"/me Hey, guys.",
"/me - Look at that.",
"/me - Isn't that the kid we saw yesterday?",
"/me Hold it, son, flight deck's restricted.",
"/me It's OK, Lou. We're gonna take him up.",
"/me Really? Feeling lucky, are you?",
"/me Sign here, here. Just initial that.",
"/me - Thank you.",
"/me - OK.",
"/me You got a rain advisory today,",
"/me and as you all know, bees cannot fly in rain.",
"/me So be careful. As always, watch your brooms,",
"/me hockey sticks, dogs, birds, bears and bats.",
"/me Also, I got a couple of reports of root beer being poured on us.",
"/me Murphy's in a home because of it, babbling like a cicada!",
"/me - That's awful.",
"/me - And a reminder for you rookies,",
"/me bee law number one, absolutely no talking to humans!",
"/me All right, launch positions!",
"/me Buzz, buzz, buzz, buzz! Buzz, buzz,",
"/me buzz, buzz! Buzz, buzz, buzz, buzz!",
"/me Black and yellow!",
"/me Hello!",
"/me You ready for this, hot shot?",
"/me Yeah. Yeah, bring it on.",
"/me Wind, check.",
"/me - Antennae, check.",
"/me - Nectar pack, check.",
"/me - Wings, check.",
"/me - Stinger, check.",
"/me Scared out of my shorts, check.",
"/me OK, ladies,",
"/me let's move it out!",
"/me Pound those petunias, you striped stem-suckers!",
"/me All of you, drain those flowers!",
"/me Wow! I'm out!",
"/me I can't believe I'm out!",
"/me So blue.",
"/me I feel so fast and free!",
"/me Box kite!",
"/me Wow!",
"/me Flowers!",
"/me This is Blue Leader. We have roses visual.",
"/me Bring it around 30 degrees and hold.",
"/me Roses!",
"/me 30 degrees, roger. Bringing it around.",
"/me Stand to the side, kid. It's got a bit of a kick.",
"/me That is one nectar collector!",
"/me - Ever see pollination up close?",
"/me - No, sir.",
"/me I pick up some pollen here, sprinkle it over here. Maybe a dash over there,",
"/me a pinch on that one. See that? It's a little bit of magic.",
"/me That's amazing. Why do we do that?",
"/me That's pollen power. More pollen, more flowers, more nectar, more honey for us.",
"/me Cool.",
"/me I'm picking up a lot of bright yellow.",
"/me Could be daisies. Don't we need those?",
"/me Copy that visual.",
"/me Wait. One of these flowers seems to be on the move.",
"/me Say again? You're reporting a moving flower?",
"/me Affirmative.",
"/me That was on the line!",
"/me This is the coolest. What is it?",
"/me I don't know, but I'm loving this color.",
"/me It smells good.",
"/me Not like a flower, but I like it.",
"/me Yeah, fuzzy.",
"/me Chemical-y.",
"/me Careful, guys. It's a little grabby.",
"/me My sweet lord of bees!",
"/me Candy-brain, get off there!",
"/me Problem!",
"/me - Guys!",
"/me - This could be bad.",
"/me Affirmative.",
"/me Very close.",
"/me Gonna hurt.",
"/me Mama's little boy.",
"/me You are way out of position, rookie!",
"/me Coming in at you like a missile!",
"/me Help me!",
"/me I don't think these are flowers.",
"/me - Should we tell him?",
"/me - I think he knows.",
"/me What is this?!",
"/me Match point!",
"/me You can start packing up, honey, because you're about to eat it!",
"/me Yowser!",
"/me Gross.",
"/me There's a bee in the car!",
"/me - Do something!",
"/me - I'm driving!",
"/me - Hi, bee.",
"/me - He's back here!",
"/me He's going to sting me!",
"/me Nobody move. If you don't move, he won't sting you. Freeze!",
"/me He blinked!",
"/me Spray him, Granny!",
"/me What are you doing?!",
"/me Wow... the tension level out here is unbelievable.",
"/me I gotta get home.",
"/me Can't fly in rain.",
"/me Can't fly in rain.",
"/me Can't fly in rain.",
"/me Mayday! Mayday! Bee going down!",
"/me Ken, could you close the window please?",
"/me Ken, could you close the window please?",
"/me Check out my new resume. I made it into a fold-out brochure.",
"/me You see? Folds out.",
"/me Oh, no. More humans. I don't need this.",
"/me What was that?",
"/me Maybe this time. This time. This time.",
"/me This time! This time! This...",
"/me Drapes!",
"/me That is diabolical.",
"/me It's fantastic. It's got all my special skills, even my top-ten favorite movies.",
"/me What's number one? Star Wars?",
"/me Nah, I don't go for that...",
"/me ...kind of stuff.",
"/me No wonder we shouldn't talk to them. They're out of their minds.",
"/me When I leave a job interview, they're flabbergasted, can't believe what I say.",
"/me There's the sun. Maybe that's a way out.",
"/me I don't remember the sun having a big 75 on it.",
"/me I predicted global warming.",
"/me I could feel it getting hotter. At first I thought it was just me.",
"/me Wait! Stop! Bee!",
"/me Stand back. These are winter boots.",
"/me Wait!",
"/me Don't kill him!",
"/me You know I'm allergic to them! This thing could kill me!",
"/me Why does his life have less value than yours?",
"/me Why does his life have any less value than mine? Is that your statement?",
"/me I'm just saying all life has value. You don't know what he's capable of feeling.",
"/me My brochure!",
"/me There you go, little guy.",
"/me I'm not scared of him.",
"/me It's an allergic thing.",
"/me Put that on your resume brochure.",
"/me My whole face could puff up.",
"/me Make it one of your special skills.",
"/me Knocking someone out is also a special skill.",
"/me Right. Bye, Vanessa. Thanks.",
"/me - Vanessa, next week? Yogurt night?",
"/me - Sure, Ken. You know, whatever.",
"/me - You could put carob chips on there.",
"/me - Bye.",
"/me - Supposed to be less calories.",
"/me - Bye.",
"/me I gotta say something.",
"/me She saved my life.",
"/me I gotta say something.",
"/me All right, here it goes.",
"/me Nah.",
"/me What would I say?",
"/me I could really get in trouble.",
"/me It's a bee law.",
"/me You're not supposed to talk to a human.",
"/me I can't believe I'm doing this.",
"/me I've got to.",
"/me Oh, I can't do it. Oome on!",
"/me No. Yes. No.",
"/me Do it. I can't.",
"/me How should I start it?",
"/me You like jazz? No, that's no good.",
"/me Here she comes! Speak, you fool!",
"/me Hi!",
"/me I'm sorry.",
"/me - You're talking.",
"/me - Yes, I know.",
"/me You're talking!",
"/me I'm so sorry.",
"/me No, it's OK. It's fine.",
"/me I know I'm dreaming.",
"/me But I don't recall going to bed.",
"/me Well, I'm sure this is very disconcerting.",
"/me This is a bit of a surprise to me.",
"/me I mean, you're a bee!",
"/me I am. And I'm not supposed to be doing this,",
"/me but they were all trying to kill me.",
"/me And if it wasn't for you...",
"/me I had to thank you.",
"/me It's just how I was raised.",
"/me That was a little weird.",
"/me - I'm talking with a bee.",
"/me - Yeah.",
"/me I'm talking to a bee.",
"/me And the bee is talking to me!",
"/me I just want to say I'm grateful.",
"/me I'll leave now.",
"/me - Wait! How did you learn to do that?",
"/me - What?",
"/me The talking thing.",
"/me Same way you did, I guess.",
"/me Mama, Dada, honey. You pick it up.",
"/me - That's very funny.",
"/me - Yeah.",
"/me Bees are funny. If we didn't laugh, we'd cry with what we have to deal with.",
"/me Anyway...",
"/me Can I...",
"/me ...get you something?",
"/me - Like what?",
"/me I don't know. I mean...",
"/me I don't know. Coffee?",
"End of part 1"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 4200*i); } } busy = 0; } 
            }
            },
        {
            name: "Sing",
            short: "@bot sing",
            regex: /^juedstice/i,
            callback: function(data){
                var msgArray = ["justice running...", "rules: say '@Tamabot :|' inbetween the :) and the :(.", "s", "type @Tamabot ':o' to skip instructions and start game."]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 3000*i); } } busy = 0; } 
        },
        {
            name: "Sing",
            short: "@bot sing",
            regex: /^justice|^(⺱)/i,
            callback: function(data){
                if(!justgame) {
                    justgame=data.user;
                var msgArray = ["rules: say ' @Tamabot :| ' inbetween the :) and the :(", "type '@Tamabot justice' again to start"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 3000*i); } } busy = 0; } 
           else {
                if (!justice) {
                justice=data.user;
                var msgArray = ["justice running...", "@Tamabot :)"]; 
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
                var msgArray = ["justice running...", "@Tamabot :)"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 3730*i); } } busy = 0; } 
            }
            },
        {
            name: "Obey",
			regex: /^[\:)]+$/i,
			callback: function(data) {
				if(justice) {
                    justnice=data.user;
					sock.chat("@Tamabot :(");
					}
				else {
					sock.chat(""+king, data.user);
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
             name: "Obey",
			regex: /^[\:|]+$/i,
			callback: function(data) {
				if(justnice) {
                    toke10=data.user;
                    var msgArray = ["", "You win! 'Type @Tamabot tokens' to view your prize."+master]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 4030*i); } } busy = 0; } 
            }
			},
        {
            name: "Sing",
            short: "@bot sing",
            regex: /^inferno/i,
            callback: function(data){
                var msgArray = ["inferno running...", "when tamabot says 'inferno', say '1'. best out of 5 wins. you need to keep track of score.", "ready, set... Go!", "inferno", "inferno", "inferno",

"inferno"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 11371*i); } } busy = 0; } 
        },
          {
              name: "Sing",
            short: "@bot sing",
            regex: /^(annoy)|sex|same|please/i,
            callback: function(data){
                if (!nospam) {
                var msgArray = ["/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?",  "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", ">am I annoying yet?", ">am I annoying yet?", ">am I annoying yet?", 
                                ">am I annoying yet?", ">am I annoying yet?", "/me ?? ? ???????? ????", "/me ?? ? ???????? ????", "/me ?? ? ???????? ????", "/me ?? ? ???????? ????", "/me ₐₘ ? ₐₙₙₒyᵢₙg yₑₜ?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", 
                                "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", "/me am I annoying yet?", 

"fine i'll stop"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 2000*i); } } busy = 0; } 
            }
            },
          {
            name: "Sing",
            short: "@bot sing",
            regex: /^hack|^(⺲)/i,
            callback: function(data){
                var msgArray = ["hacking game servers...",
                                "hacking users...",
                                "exposing pms...",
                                "overriding data...",
                                "terminating statistics...",
                                "hacking lobby...",
                                "shutting down site...",
                                "shut down set for 4 minutes 32 seconds"]; 
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 1*i); } } busy = 0; } 
        },
        {
			name: "Vote",
			regex: /^vote (\w+)/i,
			callback: function(data, who) {
				if(data.user) {
					sock.vote(who, data.meet);
					}
				}
			},
		{
            name: "Claim",
			regex: /<3/i,
			callback: function(data) {
				if(data.user===skunk) {
					sock.chat("</3");
					}
                else {
                    sock.chat("<3");
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
				if(data.user===master) {
					sock.chat(u(user).role+"...", {
						whisper: true,
						target: data.user
						});
					}
				else {
                    if (!claim) {
					sock.chat(arand(this.responses));
                    claim=data.user;
                    }
                    else {
					sock.chat("");
                    }
					}
				},
			responses: [
				"Fool...",
                "Chef...",
                "Mason...",
                "Vigilante...",
                "Virgin...",
				]
			},
		{
            name: "CLAIM",
			regex: /^(030931780)/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(u(user).role+"...", {
						whisper: true,
						target: data.user
						});
					}
				else {
                    if (!claim) {
					sock.chat(arand(this.responses));
                    claim=data.user;
                    }
                    else {
					sock.chat("");
                    }
					}
				},
			responses: [
				"",
				]
			},
		{
			name: "Claim",
			regex: /love|<3|^(ily)|^(⺳)/i,
			callback: function(data) {
				if(data.user) {
					sock.chat(u(user)+"I love you too", {
						whisper: true,
						target: data.user
						});
					}
				}
			},
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