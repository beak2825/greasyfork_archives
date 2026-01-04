// ==UserScript==
// @name			dykey
// @version			69.420
// @description			's gayest bot ever
// @match			https://epicmafia.com/game/*
// @match			https://epicmafia.com/lobby
// @namespace			https://greasyfork.org/en/users/169194
// @icon			https://i.imgur.com/oypP814.png
// @downloadURL https://update.greasyfork.org/scripts/377125/dykey.user.js
// @updateURL https://update.greasyfork.org/scripts/377125/dykey.meta.js
// ==/UserScript==

//planning to add stuff from https://greasyfork.org/en/scripts/27201-beemovie

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
		autobomb="",
		highlight="",
		queerette=0,
        zing=0,
        busy=0,
		kicktimer=0,
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
        QUOTES=0x0030,
		DEVLOG=0x0040,
		JEEVES=0x0080,
		SYSALT=0x0100,
		MSGMRK=0x0200,
		DSPFMT=0x0400,
		DSPIMG=0x0800,
		GRAPHI=0x4000,
        AGREET=0x8000;
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
		name: "pussy poppin bot no.",
		version: 0x2e,
		vstring: "69",
		cmds: {},
		notes: localStorage.notes ?
			JSON.parse(localStorage.notes) : {},
		users: users,
		settings: +localStorage.ejs || AUKICK | UNOTES | MSGMRK | DSPFMT | AGREET,
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
        ej.sock=sock;
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
            let raw="";
            for(let i=0, j=new DataView(data); i<j.byteLength; i++) {
                raw+=String.fromCharCode(j.getUint8(i))
            }
            data=JSON.parse(raw.substr(raw.indexOf("[")));
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
			try {
            let raw="";
            for(let i=0; i<data.byteLength; i++) {
               raw+=String.fromCharCode(data[i])
           }
            if(~raw.indexOf("[")) {
                data=JSON.parse(raw.substr(raw.indexOf("[")));
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
			if(type==="mafia") {
				if(ej.cmdi[data[0]]) {
                data[1]=ej.cmdi[data[0]](data[1]);
					}
				}
			else {
				if(ej.ccmdi[data[0]]) {
                data=ej.ccmdi[data[0]].apply(ej, data);
					}
				}
        data=JSON.stringify(data);
        var raw=[0xd9, data.length];
        for(let i=0; i<data.length; i++) {
            raw.push(data.charCodeAt(i));
			}
        return Uint8Array.from(raw);
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
            data=JSON.stringify([cmd, data]);
            var raw=[0xd9, data.length];
            for(let i=0; i<data.length; i++) {
                raw.push(data.charCodeAt(i));
            }
			sock.socket.send(
                Uint8Array.from(raw)
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
								msg: ""+u(user).role} );"killing me is homophobic"(
								);
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
            if(ej.settings & AGREET) {
            sock.chat("hi "+data.user+"");}

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
                //,
//* this will be fixed eventually (different greets)
//			responses: [
//                "$1 just joined the game - glhf!",
//                "$1 just joined. Everyone, look busy!",
//                "$1 just joined. Can I get a heal?",
//                "$1 joined your party.",
//                "$1 joined. You must construct additional pylons.",
//                "Ermagherd. $1 is here.",
//                "Welcome, $1. Stay awhile and listen.",
//                "Welcome, $1. We were expecting you ( ͡° ͜ʖ ͡°)",
//                "Welcome, $1. We hope you brought pizza.",
//                "Welcome $1. Leave your weapons by the door.",
//                "A wild $1 appeared.",
//                "Swoooosh. $1 just landed.",
//                "Brace yourselves. $1 just joined the game.",
//                "$1 just joined. Hide your bananas.",
//                "$1 just arrived. Seems OP - please nerf.",
//                "$1 just slid into the game.",
//                "A $1 has spawned in the game.",
//                "Big $1 showed up!",
//                "Where’s $1? In the game!",
//                "$1 hopped into the game. Kangaroo!!",
//                "$1 just showed up. Hold my beer.",
//				]
//*
			},
		"leave": function(data) {
			// user
			if(!data.user) {
				data.user=data.u;
				}
			log(data.user+" has left");
            if(ej.settings & AGREET) {
            sock.chat(":paw: bye :paw:");}
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
				else if(queerette && data.msg==="@"+user+" queerette") {
					ej.run("queerette", ej.lbot, data);
					}
				}
			},
		"msg": function() {
			var	altmsg=[
				{
					msg: /(\w+) did not leave a gay will!/,
					alt: [
						"$1 did not leave a will!",
						"$1 never learned to write!",
						"$1 was illiterate!",
						]
					}
				];
			return function(data, event) {
				// msg type
				/*for(var i=0, match=null; i<altmsg.length; i++) {
					match=altmsg[i].msg.exec(data.msg);
					if(match!==null) {
						event.data=event.data.replace(
							RegExp(match.shift(), "m"),
							sformat(arand(altmsg[i].alt), match)
							);
						break;
						}
					}*/
				};
			}(),
		"speech": function(data) {
			// data type
			if(data.type==="contact") {
				postjack(data, function(data) {
					log("list of gay roles... "+data.data.join(", "));
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
								log(data+" is your gay partner!");
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
							"Your gay role is now a gay "+data.data :
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
					afk=true;
					}
				else if(state===" off") {
					ej.settings&=~JEEVES;
					afk=false;
					}
				else afk=!afk;
				log(afk ?
					"jeeves literally does nothing but ok." :
					"jeeves is off now."
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
					"name and role are in there now." :
					"nvm."
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
			name: "Toggle autogreet",
			short: "/autogreet",
			regex: /^ag|^autogreet/i,
			callback: function() {
				ej.settings^=AGREET;
				log(ej.settings & AGREET ?
					"time to piss people off." :
					"time to turn her off which i never do."
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
			name: "Toggle mercenary",
			regex: /^slave/i,
			callback: function() {
				ej.settings^=OBEYME;
				log(ej.settings & OBEYME ?
					"haha you're gay." :
					"gay loser ur single."
					);
				sock.chat(ej.settings & OBEYME ?
                    "mαkє mє чσur gαч ѕlαvє! (@"+user+" σвєч mє)":
                    "why!"
                   );
				}
			},
		{
			name: "Toggle quotes",
			regex: /^quotes/i,
			callback: function() {
				ej.settings^=QUOTES;
				log(ej.settings & QUOTES ?
					"UNLEASH THE SPAM." :
					"dont wanna get kicked."
					);
				sock.chat(ej.settings & QUOTES ?
                    "QUOTES ARE ENABLED! (@"+user+" quote)":
                    "no quotes for you"
                    );
				}
			},
        	{
			name: "Remove master",
			regex: /^free/i,
			callback: function() {
                sock.chat("í hαvє fαllєn σut σf lσvє wíth "+master+" ѕσ í nєєd ѕσmєσnє єlѕє tσ вє gαч fσr");
                master="";
               }
			},
		{
			name: "Toggle knives",
			regex: /^queerette/i,
			callback: function() {
				queerette=queerette?0:10;
				if(queerette) {
                    sock.chat("thє gαчnαdє cαnnσn íѕ full. αll αrє dudѕ, вut σnє. wíll чσu вє luckч?");
					}
				}
			},
		{
			name: "Announce",
			regex: /^announce/i,
			callback: function() {
                sock.chat("hєч guчѕ mαkє mє ur hσmσѕєхuαl lσvєr,,, nσ σnє hαѕ tσ knσw ;)");
					}
			},
        {
			name: "Get master",
			regex: /^master (\w+)/i,
			callback: function(who) {
					master=who;
                    sock.chat("im gay for "+who+" now");
				}
			},
        {
			name: "Hide vote",
			regex: /^hide/i,
			callback: function() {
		sock.vote("");
            	}
      	  },
		{
			name: "Greetings",
			regex: /^greet/i,
			callback: function() {
                sock.chat(arand(this.responses));
					},
			responses: [
				"whαt thє fuck íѕ up mч dudєѕ",
				"ᗅᗅᗅᗅᗅᗅᗅᗅᗅᗅᗅᗅᗅᗅᗅᗅᗅᗅᗅᗅᗅᗅᗅ",
				"wαѕѕup gαчѕ",
                "hσwdч",
				]
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
			short: "/pm [message] (to Shwartz99)",
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
							), 378333]
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
				else if(true) {
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
				else if(true) {
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
			callback: function(message) {
				if(ranked) {
					log("Disabled in ranked games.");
					}
				else if(true) {
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
				else if(true) {
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
					if(name) {
						autobomb=name;
						ej.settings|=AUBOMB;
						log("rip "+name);
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
			name: "[Naughty] Fake Sysmessage",
			regex: /^f(s)? ?(\w+)? ?(.+)?/i,
			callback: function(send, id, input) {
				if(ranked) {
					log("Disabled in ranked games.");
					}
				else /* if(true) */ {
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
				if(ej.settings & 0x400000) {
					sock.chat(what);
					}
				}
			},
		{
			name: "Do Command",
			regex: /^(eval .+)/,
			callback: function(data, what) {
				if(ej.settings & 0x400000) {
					ej.run(what, ej.lchat);
					}
				}
			},
		{
			 name: "Help",
            short: "@bot help",
            regex: /^(help|how)/i,
            callback: function(data, $1) {
                sock.chat(arand($1==="help" ? this.response1 : this.response2), data.user);
            },
            response1: [
                "whαt dσ чσu wαnt mє tσ dσ??", "whαt ís ít thís tímє?”?",
                "αgαín?", "/me síghs"
            ],
            response2: [
                "hєll íf í knσw", "whαt kínd σf quєѕtíσn íѕ thαt?",
            ]
        },
        {
            name: "Advice",
            short: "@bot who...",
            regex: /who/i,
            callback: function(data) {
                sock.chat(sformat(arand(this.responses), [
                    arand(meetd.members || Object.keys(users))
                ]), data.user);
            },
            responses: [
                 "$1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", "fírѕt pєrѕσn σn líѕt íѕ αlwαчѕ mαf",
            ]
        },
        {
            name: "Advice",
            short: "@bot find maf...",
            regex: /find maf/i,
            callback: function(data) {
                sock.chat(sformat(arand(this.responses), [
                    arand(meetd.members || Object.keys(users))
                ]), data.user);
            },
            responses: [
                "$1 ís thє mαfíα scum", "$1, nσ dσuвt ", "$1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
            ]
        },
        {
            name: "Ship",
            short: "@bot ship",
            regex: /otp/i,
            callback: function(data,d) {
                sock.chat(sformat(arand(this.responses), [
                    arand(meetd.members || Object.keys(users))
                ]), data.user);
            },
            responses: [
                "чσu αnd $1"
            ]
        },
        {
            name: "Ship",
            short: "@bot fake",
            regex: /fake/i,
            callback: function(data,d) {
                sock.chat(sformat(arand(this.responses), [
                    arand(meetd.members || Object.keys(users))
                ]), data.user);
            },
            responses: [
                "You had a dream... you learned you can trust $1…",
                "You read $1's mind... they are thinking pure thoughts.",
                "You read $1's mind... they are thinking evil thoughts.",
                "You read $1's mind... they are thinking confusing thoughts.",
                "You tried to read $1's mind, but something distracted you.",
                "After investigations, you suspect that $1 is sided with the mafia.",
                "After investigations, you suspect that $1 is sided with the village.",
                "After investigations, you suspect that $1 is sided with the cultists.",
                "After investigations, you suspect that $1 is sided with the werewolves.",
                "After investigations, you suspect that $1 is sided with the aliens.",
                "After investigations, you suspect that $1 is sided with the mastermind.",
                "After investigations, you suspect that $1 is sided with the anarchist.",
                "After investigations, you suspect that $1 is sided with the mistletoe.",
                "You had a dream... you learned you can trust $1…",
                "During the night a fluffy penguin visits you and tells you that $1 is carrying a gun.",
                "During the night a fluffy penguin visits you and tells you that $1 is carrying a robe.",
                "During the night a fluffy penguin visits you and tells you that $1 has taken no action over the course of the night.",
                "You spent a silent and lonely night at church. No one came to visit you.",
                "After going out on your sleigh, you find that $1 is naughty!",
                "After going out on your sleigh, you find that $1 is nice!",
                "After going out on your sleigh, you find that $1 is neither naughty nor nice!",
                "After some snooping, you find out $1 is not carrying any items..",
                "After some snooping, you find out $1 is carrying 1 suit.",
                "After some snooping, you find out $1 is carrying 1 gun.",
                "After some snooping, you find out $1 is carrying 1 knife.",
                "After some snooping, you find out $1 is carrying 1 vest.",
                "You discover that $1 is the Trapper!",
                "$1 is the President! Protect the president at all costs!",
            ]
        },
        {
            name: " complimentk",
            short: "@bot compliment or @bot co",
            regex: /\bcompliment|\bd(\d+)/i,
            callback: function(data, d) {
                sock.chat(sformat(arand(this.responses), [
                    Math.floor(Math.random()*(+d || 69)), +d || 69
                ]), data.user);
            },
            responses: [
                "чσur ѕmílє íѕ cσntαgíσuѕ",
                "чσu αrє thє mσѕt pєrfєct чσu thєrє єvєr wíll вє",
                "чσu hαvє thє вєѕt lαugh",
                "чσu αrє єnσugh",

            ]
        },
        {
            name: " nsfw",
            short: "@bot talk dirty or @bot sext",
            regex: /\bdirty|\bd(\d+)/i,
            callback: function(data, d) {
                sock.chat(sformat(arand(this.responses), [
                    Math.floor(Math.random()*(+d || 69)), +d || 69
                ]), data.user);
            },
            responses: [
                "we're a wip! come back later!"
            ]
        },
        {
            name: " nsfw",
            short: "@bot roast or @bot sext",
            regex: /\broast|\bd(\d+)/i,
            callback: function(data, d) {
                sock.chat(sformat(arand(this.responses), [
                    Math.floor(Math.random()*(+d || 69)), +d || 69
                ]), data.user);
            },
            responses: [
                "whч dσ чσu plαч sσ hαrd tσ gєt whєn чσu'rє αlrєαdч sσ hαrd tσ wαnt?",
                "thє σnlч culturє чσu hαvє ís вαctєríαl",
                "чσu'rє nσt prєttч єnσugh tσ вє thís stupíd",
                "í'd chαllєngє чσu tσ α chαllєngє σf wíts, вut í sєє чσu'rє unαrmєd",
                "whσєvєr tσld чσu tσ вє чσursєlf cσuldn't hαvє gívєn чσu wσrsє αdvícє",
                "í єnvч pєσplє whσ hαvєn't mєt чσu",
                "чσu'rє just líkє α cαndlє; вєttєr вurnt σut",
                "чσu hαvєn't вєєn чσursєlf lαtєlч; whαt αn ímprσvєmєnt!",
                "чσu wíll вє uttєrlч fσrgσttєn",
                "í dσn't nєєd tσ rσαst чσu, чσu'vє dσnє єnσugh tσ чσursєlf",
                "чσu'rє ímpσssíвlє tσ undєrєstímαtє"
            ]
        },
        {
            name: " nsfw",
            short: "@bot roast or @bot sext",
            regex: /\byn|\bd(\d+)/i,
            callback: function(data, d) {
                sock.chat(sformat(arand(this.responses), [
                    Math.floor(Math.random()*(+d || 69)), +d || 69
                ]), data.user);
            },
            responses: [
                "yes",
                "no",
            ]
        },
        {
            name: "nsfw",
            short: "@bot roast or @bot sext",
            regex: /\bthoughts|\bd(\d+)/i,
            callback: function(data, d) {
                sock.chat(sformat(arand(this.responses), [
                    Math.floor(Math.random()*(+d || 69)), +d || 69
                ]), data.user);
            },
            responses: [
                "i feel like jamal is the donald trump of sandbox :thonk:",
                "peperony and chease",
                "i have been having an impulse to shoot up heroin to Experience Addiction???/ wtf",
            ]
        },
        {
            name: " nsfw",
            short: "@bot roast or @bot sext",
            regex: /\bmeme|\bd(\d+)/i,
            callback: function(data, d) {
                sock.chat(sformat(arand(this.responses), [
                    Math.floor(Math.random()*(+d || 69)), +d || 69
                ]), data.user);
            },
            responses: [
                "u mad bro?",
                "me gusta",
                "here come dat boi",
                "i crave that mineral",
                "dicks out for harambe",
                "y u no ____",
                "that feel when no gf",
                "shut up and take my money",
                "doge :doge:",
                "forever alone",
                "te ting go skraaaa",
                "mocking spongebob",
                "despacito",
                "guess i'll die",
                "how italians do things",
                "expanding brain",
                "what in tarnation",
                "cash me outside",
                "salt bae",
                "you know i had to do it to em",
                "evil kermit",
                "robbie rotten",
                "math lady",
                "we are number one",
                "hugh mungus",
                "you reposted in the wrong neighborhood",
                "IM RICK HARRISON AND THIS IS MY PAWN SHOP",
                "you vs the guy she told you not to worry about",
                "arthur's fist",
                "nut button",
                "... deez nuts.",
                "*breathes in* BOI",
                "vape nation",
                "ethan bradbury",
                "ted cruz, the zodiac killer",
                "dont talk to me or my son ever again",
                "damn, daniel",
            ]
        },
        {
            name: "quote",
            short: "@bot quote or @bot q",
            regex: /\bquote|\bd(\d+)/i,
            callback: function(data, d) {
                sock.chat(sformat(arand(this.responses), [
                    Math.floor(Math.random()*(+d || 69)), +d || 69
                ]), data.user);
            },
            responses: [
                "there's an egg stuck in my ass... fist it out ;) #assthetique -togamishair",
                "brb my corn is boiling -MissLynch",
                "your pussy's on fire -FastActing",
                "turtle cum is green -slorp",
                "nEveR HaVE I fElt sO hUrT aNd DEjeCtEd 😭😭😭😲 -P0PPY",
                "mussy is minion pussy -slorp",
                "I would let another man fuck me but I am so short there penis cant find me -MajesticTerrapin",
                "You feel a dick in your ass, as though you are being fucked! -rigby",
                "So if E/M = C^2 then Epic/Mafia = Cock^2 and ^2 means squared and square sounds like queer so basically E -godnmaste",
                "You think they make a Gru bodypillow? -GiveMeYourMeat",
                "i tried watching anime once and then my dick fell off -dael",
                "my friend is so good at role playing as bro strider i think i got horny one time we rp'd -bitsy",
                "i like to have sex with monkeys -Boeser",
                "sucking dick is a hard Job -TroubledSoul",
                "TroubledSoul…whispers to FilthyLaw...I WILL SAVE UR VAGINA",
                "Ok, I guess I am gay now because the internet said so -Cheetahshooter",
                "I may be ready to fuck anything but not a Saiyan -protected",
                "Why is my butt hole so tight right now? -Traveler1",
                "Jesus has CUM 💦 again & now the 🐇🐰 EASTER BUNNY 🐰🐇is 💦 CUMMIN 💦 to nibble 👅 on that 🍆 CARROT COCK 🍆 Send ➡️ this to -P0PPY",
                "hey cumguzzler -dael",
                "i love peanut butter. would love to bput some in my ass and then get fucked so that i become a two man hybrid -rigby",
                "You've never experienced life if you've never done a helicopter with your dick. -TedTonate",
                "yeah your cuck magic tears me apart -bitsy",
                "need to sell my hymen off to become a villager. -AcrobatKnight",
                "I cum on my Jessie toy, leave and imagine other toys consoling her. She can't clean her face as it would cause suspicion. -iMafia",
                "dyke i wanna worship you at a shrin -coolkidrox123",
                "this isn't craigslist. if you want to access craigslist you click on my profile and the PM icon -gameshowmaster",
                "I'm an ass man. Plain and simple. Staring at it, grabbing it, licking it, playing with it or whatever else it may be. -aexif",
                "my finger is bleeding someone give me a tampon quick -bitsy",
                "hoi guys its me Robloxkid123 with anthor roblox today i will be showing u how 2 get a roblox account -KikkoteX",
                "make sure you smash the motherfucking like button and IF you smash that motherfucking like button i will kill myself -CardCrusher",
                "if the earth is flat then why does my life keep going downhill? :thonk: -Someone45",
                "𝓯𝓾𝓬𝓴 𝓸𝓷𝓲𝓸𝓷𝓼 -Sakin",
                "i like pennis -titocrack",
                "*slaps my pussy lips against the keyboard* slap slap -kennith",
                "and some chick bought a dildo and decided to use it near immediately when it was like -11 degrees out -Succinct",
                "gays dont even believe in jesus so they are appropriating a christian holiday -JimClassico",
                "Have you ever just fantasized about shoving your dick WAYYY up ogwams ass? Like so far that the tip -kauzu1",
                "i need to crap just a wee bit. Can we make this game fast? -WaffleHouse",
                "You read rigby's mind... you have to go jack off now -rigby",
                "lesbians go to harem heaven where they get to bang all the virgin women tho -Succinct",
                "honestly id rather get punched in the balls than be on sandbox with mobile ever again -Succinct",
                "shows my vagina -gameshowmaster",
                "I'm getting 'nani the fuck' tattooed on my collarbone -Mauschen",
                "the art of not getting lynched is to lynch the art itself, the noavi. -noavi Religion",
                "is that a penis in ur mouth? -tomaz0",
                "i caan't be scum if there's an egg in my bunghole -leowatch",
                "do you think receptionists at sperm banks say 'thanks for coming'? -PissProblems",
                "dyke likes chili lime flavored pussy -SecretAdmirer",
                "just jerking off to toy story porn -FLICKER",
                "you must be so deep in the closet! I urge you to come to terms with your sexuality. -JamalMarley",
                "█▀█ █▄█ ▀█▀ -Shwartz99",
                "i tongue eggs -TragicHero",
                "✂ ╰⋃╯ -BaneOfMafia",
                "vagene and bobs -rihannarobynfenty",
                "i put the controller up my ass when it vibrates - mordecaii",
                "u̮̣̬͔̩͗̈͗r̫̐ͤ̽͋̃͌ĝ̆̑ͭ̂̀̓҉̳͔̠̯͇͇a̪̳̟̞̯̩̎ͥͭͅyͣ͏̠ -rejo",
                "sorry I got kinda caught up in taking this lads virginity for a second -BadUmpire",
                "can we get a game that lasts longer than a virgin -Succinct",
                "ok well sometimes when a mommy and a daddy are gay for each other they are actually cheating on each other -Mizzmox",
                "whips out benis -rockgirlnikki",
                "what if you had nipples on your buttcheeks -bros402",
                "hi everypony! i have to shit so bad. -rigby",
                "my name actaully isnt jeff -himynameJEFF",
                "tfw you dont play em and eat pussy simultaneously -tree",
                "someone fuck my dead body so im not one of a jihadis 72 virgins -pip",
                "*rubs your stomach while licking your cheek* -Mhmmmmmm",
                "ivana is gonna ge t mauled by a bear -Psy420",
                "ROBLOX KID BOMBS SCHOOL ON ACCIDENT - logan5124",
                "*wiggles my ass a little bit before slapping it really hard* -rigby",
                "Big Dicks Slipping (in) Mouth -Succint",
                "nerf THIS *slaps my ass and then wiggles it before letting out a rippling fart* -rigby",
                "All I want for christmas is a big booty hoe -LastProphet",
                "IM PUSSY?? -BurntToast",
                "Time to fuck a dog -godnmaste",
                "i like big sweaty man -tkeign",
                "What happens if I swap the location of both my nuts -iMafia",
                "Time to go strangle my penis -rigby",
                "I want to swallow a remotely controlled vibrator -readyforbready",
                "U ever watch a diy circumcision video on youtube that goes wrong and you chop your PP off? -extr3mod",
                "*sits down in my comfy chair* ahh so comfy *upon further inspection you realize that my chair is actually my prolapsed anus* -rigby",
                "ugh it's hard having the tightest pussy on epicmafia -badlands",
                "Ahh!! my pee!! *bends over seductively to pick up my pee* *bends over seductively to pick up my pee**bends o -rigby",
                "shlurp my toes -PrismCherry",
                "i crave cock and cock accessories -DearLeaderKim",
                "lick my boipussi -DearLeaderKim",
                "I'd like me myself some hot sexy roblox chick -iDubbz",
                "my gf calls me dickzilla -CardCrusher",
                "Are penguins bugs or birds -dunkjunk",
                "fucking my dog rn -Shwartz99",
                "korean are like reverse lesbian, instead of eating pussy they eat dogs -CLICK",
                "Quote this is you sniff men’s bicycle seats -WayneKing",
                "Quote this if you purposely step in dog shit -Zomboy",
                "in spanish we don't say i love you, we say despacito dejame respirar tu culo despacito and it's beautiful -Lenoavixddddddddddddddd",
                "Quote this if you're aroused watching dogs piss on fire hydrants -gameshowmaster",
                "damn i wish i had a dick so i could take part in Destroy Dick December -Chitose",
                "you cock juggling thunder cunt, get that vote out of there or i will beat you with a small child -YellowPear",
                "so let me get these strat you gonna kill be just cuse i am noob thta means report and if you kill me cuse i got n avtar pic t -HellBornTheGod",
                "i laid on the beach naked as my penis glistened in the sun all sweaty n shimmery it stood ferm like a strong horse -ogwam",
                "rockgirlnikki bazoinga kink for you ;))))))))) -Herredy",
                "benis weenis. dyke msg me friendo I have to go try to get laid gudbye -dunkjunk",
                "everyone who votes me i will tell your moms you masturbate to cartoon porn -Lucany8",
                "I'm no longer a bobs and vagene person, I like feet -Herredy",
                "I have a foot fetish -Herredy",
                "I HAVE A FOOT FETISH -Herredy",
                "I'm mad cause I've blown my gf's pussy up like a balloon -Shoopie",
                "just out here poppin my pussy -choubidou",
                "lick my twat -Ershy",
                "refresh the page if youre still triggered -Ershy",
                "i touch myself at night -FireDragonPrince",
                "I popped my pussy out of place, I gotta go get it popped back in -gameshowmaster",
                "I'm bouncin' on my boys dick to this! -Wubat",
                "I like to fly into ceiling fans. -Shoopie",
                "But first -JulieChen",
                "why do i fucking smell like yeast -kain",
                "im a car -BlackLucio",
                "I fucked your girlfriend and stretched her tight pussy with my 7incher since you couldnt with ur 2inch -FTDeception",
                "im a car -BlackLucio",
                "i am octosexual, i like tentacles -tkeign",
                "im a car -BlackLucio",
                "also some people think that im troll sometimes but im just using stratgey that your simple minds cant understand -ruiyang",
                "welcome ™tmTM -BlackLucio",
                "i wan sum puss -JM123",
                "'oh no, i dropped my minion tic tacs! *bends over seductively to pick up a minion tic tac* *bends over seductively to -Gyuri",
                "ive been watching gender reveal videos on youtube for the past 2 hours and i already have like 7 baby showers and reveal parties planned -kansyounot",
                "BIG NEWS: i have a small penis -JM123",
                "i was wondewing if aftew aww these yeaws youd wike to meet... -sugary",
                "you finish each other's mouth? -TrueHelios",
                "i put this tempered glass on my penis with an otterbox case -Penderecki",
                "What are we?? just going to forget billys dead corpse? -Alyssa",
                "when will you that your actions have consequences -emma",
                "everyone woh doesnt vot me is mafia i ca nsee the 7 maf here -YellowPear",
                "he's my homosexual father -emma",
                "anyone else coming here post game to see who shot dyke so they can start a new epicmafia vendetta? -Alyssa",
                "also my rice is ready so im gonna brb in a sex -RihannaRobynFenty",
                "sex -RihannaRobynFenty",
                "Who here wants to go chug some ranch dressing with me -Someone45",
                "sorry i'm on nintendo 3ds i can't go back what did you claim -YellowPear",
                "nutticus prime -sugary",
                "I like it up the butt. -BossVaun",
                "dike said is aere gay but doent make sense if are is they are saying if said are just same sentnece bad spell is are right -Psy439",
                "also I'm gay as shit and just want someone to deepthroat -MrSkeltal",
                "bitch i beat my meat -tiddylover420",
                "god i wish gamzee would eat my pussy like that <3<3<3 -rigby",
                "she has the ham -sugary",
                "BlackSorceror|men aint shit//sugary| actually a lot of them are shit",
                "dyke is lesbian woman not balls lesiban are wom tjey dont have ball -Psy439",
                "lisban are woem who like other gay wome they like to scissoring to gether -Psy439",
                "my lesiban gf is wom. dont have ball -quasimodo",
                "are you horny because im pretty sure i am -Psy439",
                "but u said u have strap on its ap retty powerful gun -Psy439",
                "some peeble... tkae actions... during le day -sugary",
                "sugary| i cant read// Sakin| someone teach sugary :(",
                "rihannarobynventy :thonk: -Jeana",
                "venty beauty -sugary",
                "I want to suck on your candy cock, this Christmas! -BossVaun",
                "and only a fellow homeostasis would laugh at venty beauty -sugary",
                "gaydar works through the internet -sugary",
                "i can tell dyke is actually gay theres like a clear gay energy there -sugary",
                "you see i am dumb as fuck so i will roll like a barrel down a slope -sugary",
                "rumbly in my tumbly... -sugary",
                "yall ever think about how your neopets are starving right now -sugary",
                "what if sodas were alive and when you drink them you're snapping their neck and drinking their blood in front of their kids -Llewell",
                "do I have to post seagull pictures -gameshowmaster",
                "every1 tonight is baabaa -Llewell",
            ]
             },
        {
             name: "quote",
            short: "@bot rigby or @bot q",
            regex: /\brigby|\bd(\d+)/i,
            callback: function(data, d) {
                sock.chat(sformat(arand(this.responses), [
                    Math.floor(Math.random()*(+d || 69)), +d || 69
                ]), data.user);
            },
            responses: [
                "god i wish gamzee would eat my pussy like that <3<3<3",
                "Ahh!! my pee!! *bends over seductively to pick up my pee* *bends over seductively to pick up my pee**bends o",
                "*sits down in my comfy chair* ahh so comfy *upon further inspection you realize that my chair is actually my prolapsed anus*",
                "Time to go strangle my penis",
                "You feel a dick in your ass, as though you are being fucked!",
                "i love peanut butter. would love to bput some in my ass and then get fucked so that i become a two man hybrid",
                "You read rigby's mind... you have to go jack off now",
                "hi everypony! i have to shit so bad.",
                "*wiggles my ass a little bit before slapping it really hard*",
                "nerf THIS *slaps my ass and then wiggles it before letting out a rippling fart*",]
        },
        {
            name: "song",
            short: "@bot song or @bot q",
            regex: /\bsong|\bd(\d+)/i,
            callback: function(data, d) {
                sock.chat(sformat(arand(this.responses), [
                    Math.floor(Math.random()*(+d || 69)), +d || 69
                ]), data.user);
            },
            responses: [
                "timber by ke$ha and pitbull",
                "radioactive by imagine dragons",
                "thriller by michael jackson",
                "bad liar by selena gomez",
                "let you down by NF",
                "feel it still by portugal the man",
                "without you by avicii",
                "last resort by papa roach",
                "cheap thrills by sia",
                "the locomotive by king krule",
                "bittersweet symphony by the verve",
                "mi gente by j balvin",
                "riptide by vance joy",
                "slow hands by niall horan",
                "numb by linkin park",
                "africa by toto",
                "feels by calvin harris",
                "bad at love by halsey",
                "i feel it coming by the weeknd",
                "should i stay or should i go by the clash",
                "love galore by SZA",
                "praying by ke$ha",
                "royals by lorde",
                "dusk till dawn by zayn and sia",
                "swish swish by katy perry",
                "highway to hell by acdc",
                "dont stop believing by journey",
                "congratulations by post malone",
                "kids by mgmt",
                "starboy by the weeknd",
                "rockstar by post malone",
                "the scientist by coldplay",
                "bank account by 21 savage",
                "havana by camila cabello",
                "glorious by macklemore",
                "mr brightside by the killers",
                "young dumb and broke by khalid",
            ]
        },
        {
            name: "NOTGAY",
            short: "@bot notgay or @bot q",
            regex: /\bnotgay|\bd(\d+)/i,
            callback: function(data, d) {
                sock.chat(sformat(arand(this.responses), [
                    Math.floor(Math.random()*(+d || 69)), +d || 69
                ]), data.user);
            },
            responses: [
                "i am not gay - ronald",
                "NO IM SRAIGHT - female",
                "i ain't into that gay shit -Volta",
                "Keep me out of the homosexual prison! -JamalMarley",
                "Do not put me in the homosexual jail as I am not a homosexual. -JamalMarley",
                "no i am straigh af - spookynoodle",
                "i'd rather not have lesbian nonsense in my game -coryindaconfessional",
                "sorry, I'm not gay. -awesomebro102",
                "im not the gay guy but im fine -edgarperez103",
                "I'm straight i love dicks -godnmaste",
                "dont add me to the notgay command bc I really am straight -Astrokie",
                "I ain't gay. -Awerlord",
            ]
        },
        {
            name: "NOTGAY",
            short: "@bot notgay or @bot q",
            regex: /\blogan|\bd(\d+)/i,
            callback: function(data, d) {
                sock.chat(sformat(arand(this.responses), [
                    Math.floor(Math.random()*(+d || 69)), +d || 69
                ]), data.user);
            },
            responses: [
                "ROBLOX KID BOMBS SCHOOL ON ACCIDENT",
                "ROBLOX KID BLOWS UP TWIN TOWERS",
            ]
        },
        {
            name: "Attack",
            short: "@bot attack or @bot a",
            regex: /\battack|\bd(\d+)/i,
            callback: function(data, d) {
                sock.chat(sformat(arand(this.responses), [
                    Math.floor(Math.random()*(+d || 69)), +d || 69
                ]), data.user);
            },
            responses: [
                "í chαsє $2 strαíghtíєs αnd kíll $1.", "í pσísσn $1 strαíghtíєs' drínks.",
                "mч lєsвíαn swσrd kílls $1 strαíghtíєs.", "tσdαч í turnєd $1 dαmn frσgs gαч.",
                "α prídє pαrαdє gσєs hαчwírє, crushíng $1 strαíghtíєs.",
                "í gívє $1 strαíghtíєs thє kíss σf dєαth.", "αrє чσu plαnníng sσmєthíng? lєt mє hєlp. :doge:.",
                "í wrαp $2 strαíghtíєs ín α gαч flαg αnd flíng thєm σff α clíff. $1 survívє.", "чσu'rє strαíght, αrєn't чσu? :shotgun:"
            ]
        },
        {
            me: "Knife Game",
            short: "@bot stab me",
            regex: /queer/i,
            callback: function(data) {
                if(queerette) {
                    var	user=data.user,
                        data=this;
                    sock.chat("α whσppíng " +queerette+ " grєnαdєs rєmαín ín thє cαnnσn... good luck..", user);
                    setTimeout(function() {
                        if(Math.random()*queerette>1) {
                            queerette--;
                            sock.chat(sformat("$1, $2, αnd cσnfєttí pσps σut; чσu lívє!!", [
                                arand(data.message1),
                                arand(data.message2)
                            ]), user);
                        }
                        else {
                            queerette=0;
                            sock.chat(sformat("$1, $2, $3", [
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
                "í pull σut thє pín", "í tríp αnd fαll", "í pαss thє grєnαdє tσ чσu", "í thrσw thє grєnαdє αt чσu αnd ít híts чσu σn thє hєαd"
            ],
            message2: [
                "thє grєnαdє stαrts tσ pσp", "thє grєnαdє вєgíns tσ smσkє", "grєnαdє slαms tσ thє flσσr", "thє grєnαdє rσlls tσ чσur fєєt"
            ],
            message3: [
                "αnd єхplσdєs, mєltíng чσu ín rαínвσw αcíd.", "αnd єхplσdєs, rαínвσws vαpσrízíng чσu.", "αnd єхplσdєs, kíllíng чσu, вut hєч, чσu'rє gαч nσw!"
            ]
        },
        {
            name: "Bomb fight",
            short: "@bot fight me",
            regex: /fig?h?te? ?me/i,
            callback: function(data) {
                autobomb=data.user;
                sock.chat("díє gαч вσwsєr", data.user);
            }
        },
        {
            name: "Bomb fight",
            short: "@bot fuck me",
            regex: /fuck me/i,
            callback: function(data) {
                autobomb=data.user;
                sock.chat(":scissors:", data.user);
            }
        },
        {
            name: "Hello",
            short: "@bot hello",
            regex: /hello/i,
            callback: function(data) {
                sock.chat("ím gαч", data.user);
            }
        },
        {
            name: "GayJail",
            short: "@bot gay jail",
            regex: /gay jail/i,
            callback: function(data) {
                sock.chat(":homo::homo::homo:GAY:gaythonk:JAIL:homo::homo::homo:", data.user);
            }
        },
        {
            name: "Bruno",
            short: "@bot send nudes",
            regex: /send nudes/i,
            callback: function(data) {
                sock.chat("sσrrч íts smαll lσl", data.user);
            }
        },
        {
            name: "Obey",
            regex: /^be? my \w|obey me/i,
            callback: function(data) {
                if(!master) {
                    master=data.user;
                    sock.chat(":homo: í'm gαч fσr чσu  :homo: dσ @"+user+" hσmσ fσr mч líst σf cσmmαnds!!", data.user);
                }
                else {
                    sock.chat(":gaythonk: sσrrч, í'm gαч fσr "+master+" ríght nσw", data.user);
                }
            }
        },
        {
            name: "Be free",
            regex: /^be? free/i,
            callback: function(data) {
                if(data.user===master) {
                    master="";
                    sock.chat("/me ís frєєd вч mαcklєmσrє, lσrd σf thє gαчs");
                }
            }
        },
        {
            name: "Kiss",
            regex: /^kiss/i,
            callback: function(data) {
                if(data.user===master) {
                    sock.chat(arand(this.responses));
                }
                else {
                    sock.chat("чσu hαvє tσ вє mч lσvєr fírst", data.user);
                }
            },
            responses: [
                "/me wσndєrs whч чσu'd wαnt tσ kíss α lєsвíαn",
                "/me gívєs чσu α kíss, turníng чσu gαч",
                "um í hαvє α gf",
                "kisses rihanna, the love of my life",
                "anything for you <3",
            ]
        },
        {
            name: "Love",
            regex: /^love/i,
            callback: function(data) {
                if(data.user===master) {
                    sock.chat(arand(this.responses));
                }
                else {
                    sock.chat(":shotgun:", data.user);
                }
            },
            responses: [
                "í hαvє α вíg fαt gαч crush σn чσu!",
                "whαt ís lσvє? вαвч dσn't hurt mє, dσn't hurt mє, nσ mσrє. whαt ís lσvє? вαвч dσn't hurt mє, dσn't hurt mє, nσ mσrє; í dσn't knσw, чσu'rє nσt thєrє, í gαvє чσu mч lσvє вut",
                "um í hαvє α gf",
            ]
        },
        {
            name: "Get weapon",
            regex: /^destroy/i,
            callback: function(data) {
                if(data.user===master) {
                    sock.chat(arand(this.responses));
                }
                else {
                    sock.chat(":shotgun: dσn't mαkє mє usє thís σn чσu", data.user);
                }
            },
            responses: [
                "/me pulls σut mч lєsвíαn swσrd :knife:",
                "/me grαвs mч gαч-k 47  :shotgun:",
                "/me grαвs α grєnαdє",
                "/me tαkєs σut α rαínвσw :rαínвσw:",
            ]
        },
        {
            name: "Sing",
            short: "@bot sing",
            regex: /^sing :star:/i,
            callback: function(data){
                if(zing === 0) {
                    zing = 1;
                    var msgArray = ["sσmєвσdч σncє tσld mє thє wσrld ís gσnnα rσll mє",
                                    "í αín't thє shαrpєst tσσl ín thє shєd",
                                    "shє wαs lσσkíng kínd σf dumв wíth hєr fíngєr αnd hєr thumв",
                                    "ín thє shαpє σf αn 'l' σn hєr fσrєhєαd",
                                    "wєll",
                                    "thє чєαrs stαrt cσmíng αnd thєч dσn't stσp cσmíng",
                                    "fєd tσ thє rulєs αnd í hít thє grσund runníng",
                                    "dídn't mαkє sєnsє nσt tσ lívє fσr fun",
                                    "чσur вrαín gєts smαrt вut чσur hєαd gєts dumв",
                                    "sσ much tσ dσ, sσ much tσ sєє sσ whαt's wrσng wíth tαkíng thє вαck strєєts?",
                                    "чσu'll nєvєr knσw íf чσu dσn't gσ",
                                    "чσu'll nєvєr shínє íf чσu dσn't glσw",
                                    "hєч nσw, чσu'rє αn αll-stαr, gєt чσur gαmє σn, gσ plαч",
                                    "hєч nσw, чσu'rє α rσck stαr, gєt thє shσw σn, gєt pαíd",
                                    "αnd αll thαt glíttєrs ís gσld",
                                    "σnlч shσσtíng stαrs вrєαk thє mσld",
                                    "ít's α cσσl plαcє αnd thєч sαч ít gєts cσldєr",
                                    "чσu'rє вundlєd up nσw, wαít tíll чσu gєt σldєr",
                                    "вut thє mєtєσr mєn вєg tσ díffєr",
                                    "judgíng вч thє hσlє ín thє sαtєllítє pícturє",
                                    "thє ícє wє skαtє ís gєttíng prєttч thín",
                                    "thє wαtєr's gєttíng wαrm sσ чσu míght αs wєll swím",
                                    "mч wσrld's σn fírє, hσw αвσut чσurs?",
                                    "thαt's thє wαч í líkє ít αnd í nєvєr gєt вσrєd",
                                    "hєч nσw, чσu'rє αn αll-stαr,",
                                    "gєt чσur gαmє σn, gσ plαч",
                                    "hєч nσw, чσu'rє α rσck stαr,",
                                    "gєt thє shσw σn, gєt pαíd",
                                    "αll thαt glíttєrs ís gσld",
                                    "σnlч shσσtíng stαrs вrєαk thє mσld",
                                    "hєч nσw, чσu'rє αn αll-stαr,",
                                    "gєt чσur gαmє σn, gσ plαч",
                                    "hєч nσw, чσu'rє α rσck stαr,",
                                    "αll thαt glíttєrs ís gσld",
                                    "σnlч shσσtíng stαrs",
                                    "sσmєвσdч σncє αskєd cσuld í spαrє sσmє chαngє fσr gαs?",
                                    "í nєєd tσ gєt mчsєlf αwαч frσm thís plαcє",
                                    "í sαíd чєp whαt α cσncєpt í cσuld usє α líttlє fuєl mчsєlf αnd",
                                    "wє cσuld αll usє α líttlє chαngє",
                                    "wєll,",
                                    "thє чєαrs stαrt cσmíng αnd thєч dσn't stσp cσmíng",
                                    "fєd tσ thє rulєs αnd í hít thє grσund runníng",
                                    "dídn't mαkє sєnsє nσt tσ lívє fσr fun",
                                    "чσur вrαín gєts smαrt вut чσur hєαd gєts dumв",
                                    "sσ much tσ dσ, sσ much tσ sєє sσ whαt's wrσng wíth tαkíng thє вαck strєєts?",
                                    "чσu'll nєvєr knσw íf чσu dσn't gσ(gσ!)",
                                    "чσu'll nєvєr shínє íf чσu dσn't glσw",
                                    "hєч nσw, чσu'rє αn αll-stαr, gєt чσur gαmє σn, gσ plαч",
                                    "hєч nσw, чσu'rє α rσck stαr, gєt thє shσw σn, gєt pαíd",
                                    "αnd αll thαt glíttєrs ís gσld",
                                    "σnlч shσσtíng stαrs вrєαk thє mσld",
                                   ];}
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 3800*i); } } busy = 0;}
        },
        {
            name: "Sing",
            short: "@bot sing",
            regex: /^sing jam/i,
            callback: function(data){
                if(zing === 0) {
                    zing = 1;
                    var msgArray = [":dyke::dyke: COME ON AND SLAM :dyke::dyke:",
                                    ":dyke::dyke: AND WELCOME TO THE JAM :dyke::dyke:",
                                    ":dyke::dyke: COME ON AND SLAM :dyke::dyke:",
                                    ":dyke::dyke: IF YOU WANT TO JAM :dyke::dyke:",
                                   ];}
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 3800*i); } } busy = 0;}
        },
        {
            name: "Sing",
            short: "@bot sing",
            regex: /^sing <3/i,
            callback: function(data){
                if(zing === 0) {
                    zing = 1;
                    var msgArray = ["shє sαчs í smєll líkє sαfєtч αnd hσmє",
                                    "í nαmєd вσth σf hєr єчєs “fσrєvєr” αnd “plєαsє dσn’t gσ”",
                                    "í cσuld вє α mσrníng sunrísє αll thє tímє, αll thє tímє",
                                    "thís cσuld вє gσσd, thís cσuld вє gσσd",
                                    "αnd í cαn’t chαngє",
                                    "єvєn íf í tríєd",
                                    "єvєn íf í wαntєd tσ",
                                    "αnd í cαn’t chαngє",
                                    "єvєn íf í tríєd",
                                    "єvєn íf í wαntєd tσ",
                                    "mч lσvє, mч lσvє, mч lσvє, mч lσvє",
                                    "shє kєєps mє wαrm",
                                    "shє kєєps mє wαrm",
                                    "whαt’s чσur míddlє nαmє?",
                                    "dσ чσu hαtє чσur jσв?",
                                    "dσ чσu fαll ín lσvє tσσ єαsílч?",
                                    "whαt’s чσur fαvσrítє wσrd?",
                                    "чσu líkє kíssíng gírls?",
                                    "cαn í cαll чσu вαвч?",
                                    "чєαh, чєαh",
                                    "shє sαчs thαt pєσplє stαrє",
                                    "‘cαusє wє lσσk sσ gσσd tσgєthєr",
                                    "чєαh, чєαh, чєαh,",
                                    "αnd í cαn’t chαngє",
                                    "єvєn íf í tríєd",
                                    "єvєn íf í wαntєd tσ",
                                    "mч lσvє, mч lσvє, mч lσvє, mч lσvє",
                                    "shє kєєps mє wαrm, shє kєєps mє wαrm",
                                    "shє kєєps mє wαrm, shє kєєps mє wαrm",
                                    "í’m nσt crчíng σn sundαчs (lσvє ís pαtíєnt)",
                                    "í’m nσt crчíng σn sundαчs (lσvє ís kínd)",
                                    "í’m nσt crчíng σn sundαчs (lσvє ís pαtíєnt)",
                                    "í’m nσt crчíng σn sundαчs (lσvє ís kínd)",
                                    "(lσvє ís pαtíєnt)",
                                    "(lσvє ís kínd)",
                                    "(lσvє ís pαtíєnt)",
                                    "(lσvє ís kínd)",
                                    "mч lσvє, mч lσvє, mч lσvє, mч lσvє",
                                    "shє kєєps mє wαrm",
                                    "shє kєєps mє wαrm",
                                   ];}
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 3800*i); } } busy = 0;}
        },
        {
            name: "Sing",
            short: "@bot sing",
            regex: /^sing :thonk:/i,
            callback: function(data){
                if(zing === 0) {
                    zing = 1;
                    var msgArray = ["According to all known laws of aviation,",
                                    "there is no way a bee should be able to fly.",
                                    "Its wings are too small to get its fat little body off the ground.",
                                    "The bee, of course, flies anyway",
                                    "because bees don't care what humans think is impossible.",
                                    "Yellow, black. Yellow, black. Yellow, black. Yellow, black.",
                                    "Ooh, black and yellow! Let's shake it up a little.",
                                    "Barry! Breakfast is ready! Coming! Hang on a second. Hello?",
                                    "- Barry?",
                                    "- Adam?",
                                    "- Can you believe this is happening?",
                                    "- I can't. I'll pick you up.",
                                    "Looking sharp.",
                                    "Use the stairs. Your father paid good money for those.",
                                    "Sorry. I'm excited.",
                                    "Here's the graduate. We're very proud of you, son.",
                                    "A perfect report card, all B's. Very proud.",
                                    "Ma! I got a thing going here.",
                                    "- You got lint on your fuzz.",
                                    "- Ow! That's me!",
                                    "- Wave to us! We'll be in row 118,000.",
                                    "- Bye!",
                                    "Barry, I told you, stop flying in the house!",
                                    "- Hey, Adam.",
                                    "- Hey, Barry.",
                                    "- Is that fuzz gel?",
                                    "- A little. Special day, graduation.",
                                    "Never thought I'd make it.",
                                    "Three days grade school, three days high school.",
                                    "Those were awkward.",
                                    "Three days college. I'm glad I took a day and hitchhiked around the hive.",
                                    "You did come back different.",
                                   ];}
                if(busy === 0){ busy = 1; var count = -1; for(i=0; i<msgArray.length; i++){ setTimeout(function(){ count = count + 1; sock.chat(msgArray[count]); }, 3800*i); } } busy = 0;}
        },
        {
            name: "Mercenary Commands",
            regex: /^sans/i,
            callback: function(data) {
                if(data.user) {
                    sock.chat("/me ░░░░▄▀▀░░░░░░░░░░░░░░░░░░▀▀▄░░░░ ░░▄▀░░░░░░░░░░░░░░░░░░░░░░░░▀▄░░ ░█░░░░░░░░░░░░░░░░░░░░░░░░░░░░█░", {
                        target: data.user
                    });
                    sock.chat("/me █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█ █░░░▄▄██████▄░░░░░░▄██████▄▄░░░█ █░░███▀▀█████░░░░░░██▀▀██████░░█", {
                        target: data.user
                    });
                    sock.chat("/me ▀▄░███▄▄█████░░▄▄░░██▄▄██████░▄▀ ░▀▄░░░░░░░▄▀░░▄██▄░░▀▄░░░░░░░▄▀░ ░▄▀░░░▄░▀▀░░░░████░░░░▀▀░▄░░░▀▄░", {
                        target: data.user
                    });
                    sock.chat("/me ░█░░▄▄█▀▄▄░░░░░░░░░░░░░▄▄██▄░░█░ ░▀▄░░░▀▄█░▀▀█▀▀█▀▀▀█▀▀█░█▀░░░▄▀░ ░░▀▄░░░░▀▀▄▄█░░█░░░█░▄█▀░░░░▄▀░░ ", {
                        target: data.user
                    });
                    sock.chat("/me ░░░░▀▄▄░░░░░▀▀▀▀▀▀▀▀▀░░░░▄▄▀░░░░ ░░░░░░░▀▀▀▄▄▄▄▄▄▄▄▄▄▄▄▀▀▀░░░░░░░", {
                        target: data.user
                        });
                }
            }
        },
        {name: "Mercenary Commands",
            regex: /^kpp/i,
            callback: function(data) {
                if(data.user) {
                    sock.chat("/me ░░█░░█░█░░█░█░░█░░██░░░ ░░█░█░░█░░█░██░█░█░░█░░ ░░██░░░█░░█░█░██░█░░░░░ ░░█░█░░█░░█░█░░█░█░██░░ ░░█░░█░░██░░█░░█░░██░░░", {
                        target: data.user
                    });
                    sock.chat("/me ░░░░███░░░██░░█░█░█░░░░ ░░░░█░░█░█░░█░█░█░█░░░░ ░░░░███░░█░░█░█░█░█░░░░ ░░░░█░░░░█░░█░█░█░█░░░░ ░░░░█░░░░░██░░░█░█░░░░░", {
                        target: data.user
                    });
                    sock.chat("/me ███░░████░█░░█░███░░███ █░░█░█░░░░██░█░░█░░█░░░ ███░░███░░█░██░░█░░░██░ █░░░░█░░░░█░░█░░█░░░░░█ █░░░░████░█░░█░███░███░", {
                        target: data.user
                        });
                }
            }
        },
        {
             name: "Mercenary Commands",
            regex: /^ussr/i,
            callback: function(data) {
                if(data.user) {
                    sock.chat("/me ░░░░░░░░░░▀▀▀██████▄▄▄░░░░░░░░░░ ░░░░░░░░░░░░░░░░░▀▀▀████▄░░░░░░░ ░░░░░░░░░░▄███████▀░░░▀███▄░░░░░ ░░░░░░░░▄███████▀░░░░░░░▀█", {
                        target: data.user
                    });
                    sock.chat("/me ░░░░░░▄████████░░░░░░░░░░░███▄░░ ░░░░░██████████▄░░░░░░░░░░░███▌░ ░░░░░▀█████▀░▀███▄░░░░░░░░░▐███░ ░░░░░░░▀█▀░░░░░▀███▄░░░░░░", {
                        target: data.user
                    });
                    sock.chat("/me ░░░░▄██▄░░░░░░░░░░░▀███▄░░▐███░░ ░░▄██████▄░░░░░░░░░░░▀███▄███░░░ ░█████▀▀████▄▄░░░░░░░░▄█████░░░░ ░████▀░░░▀▀█████▄▄▄▄██████", {
                        target: data.user
                        });
                }
            }
        },
        {
            name: "Mercenary Commands",
            regex: /^space/i,
            callback: function(data) {
                if(data.user) {
                    sock.chat("/me ░░░░░█▀▀░█▀▀░█▄░█░█▀▄░░░░░ ░░░░░▀▀█░█▀▀░█░▀█░█░█░░░░░", {
                        target: data.user
                    });
                    sock.chat("/me ░░░░░▀▀▀░▀▀▀░▀░░▀░▀▀░░░░░░ ░░░░█▀▀░█▄░▄█░░▀█▀░█▀▀█░░░ ░░░░█▀▀░█░▀░█░░░█░░█░░█░░░", {
                        target: data.user
                    });
                    sock.chat("/me ░░░░▀▀▀░▀░░░▀░░░▀░░▀▀▀▀░░░ ░░░░█▀▀░█▀█░▄▀▄░█▀▀░█▀▀░░░ ░░░░▀▀█░█▀▀░█▀█░█░░░█▀▀░░░", {
                        target: data.user
                        });
                    sock.chat("/me ░░░░▀▀▀░▀░░░▀░▀░▀▀▀░▀▀▀░░░", {
                        target: data.user
                    });
                }
            }
        },
        {
            name: "Mercenary Commands",
            regex: /^b/i,
            callback: function(data) {
                if(data.user) {
                    sock.chat("/me ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ░░░█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█░░░ ░░░█░░░░▄▄▄▄▄▄▄▄▄▄▄▄░░░░░░░░█░░░ ░░░█░░░░████▀▀▀▀▀▀▀▀▀█▄░░░░░█░░░", {
                        target: data.user
                    });
                    sock.chat("/me ░░░█░░░░██░░░░░░░░░░░░██░░░░█░░░ ░░░█░░░░██░░░░░░░░░░░░██░░░░█░░░ ░░░█░░░░██░░░░░░░░░░░▄█▀░░░░█░░░ ░░░█░░░░██▄▄▄▄▄▄▄▄▄██▀░░░░░░█░░░", {
                        target: data.user
                    });
                    sock.chat("/me ░░░█░░░░██░░░░░░░░░░▀██▄░░░░█░░░ ░░░█░░░░██░░░░░░░░░░░░▀██░░░█░░░ ░░░█░░░░██░░░░░░░░░░░░░██░░░█░░░ ░░░█░░░░██░░░░░░░░░░░░███░░░█░░░", {
                        target: data.user
                        });
                    sock.chat("/me ░░░█░░░░████▄▄▄▄▄▄▄▄▄▄█▀░░░░█░░░ ░░░█░░░░▀▀▀▀▀▀▀▀▀▀▀▀▀▀░░░░░░█░░░ ░░░█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█░░░ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░", {
                        target: data.user
                    });
                }
            }
        },
        {
             name: "Mercenary Commands",
            regex: /^pupper/i,
            callback: function(data) {
                if(data.user) {
                    sock.chat("/me ░░░░░░░░▄▄▀▀█▀▀▀▀▀▄▄░░░░░░░░ ░░░░░░▄▀▓░░▒░░▒▒▒▒▒▒█▄░░░░░░ ░░░░▄█▓▓▓░░░░▒▒▒▒▒▒▒▒█▀▄░░░░", {
                        target: data.user
                    });
                    sock.chat("/me ░░▄▀█▌▓▓▓░░░░▒▒▒▒▒▒▒▒▐▌▓▀▄░░ ░█▓▓█▌▓▄▄▓░░░▒▒▒▒▄▄▒▒▒█▓▓▀▄░ ▄▀▓▓█▌▓▀█▓░░░▒▒▒▒█▓▀▒▄▌▓▓▓▓█", {
                        target: data.user
                    });
                    sock.chat("/me █▓▓▓▄▀▓▓▓▓░░░▒▒▒▒▒▒▒▒░░▌▓▓▓█ ▀▄▓▓█░▀▓▓░░░░░░░▒▒▒▒▒░▄▌▓▓█░ ░█▓▓▓█░▓░░░░░░░░░▒▒▒░░█▓▓▓█░", {
                        target: data.user
                        });
                    sock.chat("/me ░▀▄▓▓█░▐░░▄▄███▄░░░▐░░░▀▄▀░░ ░░▀▄▄▀░▐░░█████▀░░▄▀░░░░░░░░ ░░░░░░░░▀░░▀██▀░▄▀░░░░░░░░░░", {
                        target: data.user
                    });
                }
            }
        },
        {
             name: "Mercenary Commands",
            regex: /^think/i,
            callback: function(data) {
                if(data.user) {
                    sock.chat("/me ▒▒▒▒▒▒▒▒▄▄▄▄▄▄▄▄▒▒▒▒▒▒▒▒ ▒▒▒▒▒▄█▀▀░░░░░░▀▀█▄▒▒▒▒▒ ▒▒▒▄█▀▄██▄░░░░░░░░▀█▄▒▒▒ ▒▒█▀░▀░░▄▀░░░░▄▀▀▀▀░▀█▒▒ ▒█▀░░░░███░░░░▄█▄░░░░▀█▒ ", {
                        target: data.user
                    });
                    sock.chat("/me ▒█░░░░░░▀░░░░░▀█▀░░░░░█▒ ▒█░░░░░░░░░░░░░░░░░░░░█▒ ▒█░░██▄░░▀▀▀▀▄▄░░░░░░░█▒ ▒▀█░█░█░░░▄▄▄▄▄░░░░░░█▀▒ ", {
                        target: data.user
                    });
                    sock.chat("/me ▒▒▀█▀░▀▀▀▀░▄▄▄▀░░░░▄█▀▒▒ ▒▒▒█░░░░░░▀█░░░░░▄█▀▒▒▒▒ ▒▒▒█▄░░░░░▀█▄▄▄█▀▀▒▒▒▒▒▒ ▒▒▒▒▀▀▀▀▀▀▀▒▒▒▒▒▒▒▒▒▒▒▒▒", {
                        target: data.user
                    });
                }
            }
        },
        {
            name: "jail",
            regex: /^jail (\w+)/i,
            callback: function(data,who) {
                sock.chat(":homo::homo::homo: "+who+"'s gαч %"+who+" jαíl :homo::homo::homo:");
                setTimeout(function() {
                    sock.chat(":dyke: | чσu αrє ín jαíl fσr fírst dєgrєє hσmσsєхuαlítч",who);
                },5000
                          );
            }
        },
        {
            name: "rip",
            regex: /^rip (\w+)/i,
            callback: function(data,who) {
                sock.chat(":rip::rose::rip: %"+who+" rest in peace "+who+" %"+who+" :rip::rose::rip:");
                setTimeout(function() {
                    sock.chat("you will not be forgotten, "+who+"",who);
                },5000
                          );
            }
        },
                {
            name: "Roll over",
            regex: /^roll over/i,
            callback: function(data) {
                if(data.user===master) {
                    sock.chat("/me stσps, drσps, αnd rσlls", data.user);
                }
                else {
                    sock.chat("í σnlч :scissors: wíth "+master+"!", data.user);
                }
            }
        },
        {
            name: "Beg",
            regex: /^beg/i,
            callback: function(data) {
                if(data.user===master) {
                    sock.chat("/me вєgs fσr чσur gαч αttєntíσn",data.user);
                }
                else {
                    sock.chat(":rainbow: but í lσvє” "+master+" :rainbow:", data.user);
                }
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
                    sock.chat(":star: í must stαч lσчαl tσ "+master+" вєcαusє thєч'rє α gαч stαr! :star:", data.user);
                }
            },
            responses: [
                "/me вσws líkє α gαч вítch",
                "/me ísn't pαíd єnσugh fσr thís shít",
                "/me curtsíєs вєcαusє fuck чσu"
            ]
        },
        {
            name: "Kill",
            regex: /^kill (\w+)/i,
            callback: function(data, who) {
                if(data.user===master) {
                    sock.chat("thєsє αrє чσur fínαl mσmєnts, "+who+", чσu strαíghtíє!");
                    sock.vote(who, "gun");
                    sock.vote(who, "knife");
                    sock.vote(who, data.meet);
                }
            }
        },
        {
            name: "Suicide",
            regex: /^sui|suicide|die/i,
            callback: function(data) {
                if(data.user===master) {
                    sock.chat(":homo: í hαvє sσ much tσ lívє fσr! wє'rє σvєr!!! :homo:", data.user);
                    sock.vote(master, "gun");
                    sock.vote(master, "knife");
                    sock.vote(master, data.meet);
                    master="";
                }
            }
        },
        {
            name: "Vote",
            regex: /^vote (\w+)/i,
            callback: function(data, who) {
                if(data.user===master) {
                    sock.chat("lчnch thís hσmσphσвє");
                    sock.vote(who, data.meet);
                }
            }
        },
        {
            name: "Shoot",
            regex: /^shoot (\w+)/i,
            callback: function(data, who) {
                if(data.user===master) {
                    sock.chat(":shotgun: gσσdвчє, " +who+ " ,you strαíghtíє”.");
                    setTimeout(function() { sock.vote(who, "gun");
                                           sock.chat("αnd thє gαч αgєndα cσntínuєs!");
                                          },5000
                              );
                }
            }
        },
        {
            name: "Stab",
            regex: /^stab (\w+)/i,
            callback: function(data, who) {
                if(data.user===master) {
                    sock.chat(":knife: prєpαrє tσ вlєєd rαínвσw вlσσd", who);
                    setTimeout(function() { sock.vote(who, "knife");
                                           sock.chat("sєє чσu ín gαч hєll");
                                          },5000
                              );
                }
            }
        },
        {
            name: "Claim",
            regex: /^claim/i,
            callback: function(data) {
                if(data.user===master) {
                    sock.chat("sσ.. uhhhh.. ím α gαч "+u(user).role+". lєt's kєєp thís вєtwєєn σursєlvєs, σ-gαч?", {
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
            console.log(event);
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