// ==UserScript==
// @name			sandbot
// @version			1.0
// @description		adapted from emjack
// @match			https://epicmafia.com/game/*
// @match			https://epicmafia.com/lobby
// @namespace		https://greasyfork.org/users/702912
// @author			sand
// @homepage		https://epicmafia.com/user/983649
// @icon			
// @downloadURL https://update.greasyfork.org/scripts/415752/sandbot.user.js
// @updateURL https://update.greasyfork.org/scripts/415752/sandbot.meta.js
// ==/UserScript==

//thanks foxie

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
        roulette=0,
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
    $("#typebox").val("ℍ𝕖𝕝𝕝𝕠 𝕗(𝕣)𝕚𝕖𝕟𝕕𝕤!");
    var	user=window.user || "",
        ranked=window.ranked===true,
        game_id=window.game_id || 0,
        setup_id=window.setup_id || localStorage.ejsid || 0,
        _emotes=window._emotes || {},
        lobby_emotes=window.lobby_emotes || (
            window.lobbyinfo ? lobbyinfo.emotes : {}
        );
    window.ej={
		name: "ＳＨＷＡＲＴＺ９９'s emjack v",
        version: 777,
		vstring: "1.9.1.2",
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
								msg: user+" - "+u(user).role+" | "
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
            if(ej.settings & AGREET) {
                 if(data.user === "Shwartz99") {
            sock.chat("/me bows", data.user);
            sock.chat("My lord");}
                 else if(data.user === "Megaraaa") {
            sock.chat("/me bows",data.user);
            sock.chat("My lady");}
                 else if(data.user === "Constantinople") {
            sock.chat("Hello, "+data.user+".");}
                //if you want to add more people just copy the two lines above and paste them below
                else {
            agreet = Math.floor((Math.random() * 27) + 1);
                if(agreet === 1)
                    {
                        sock.chat(data.user+"! Good to see ye, lad..");
                    }
                    else if(agreet === 2)
                    {
                        sock.chat("Jolly good to meet you, "+data.user+"!");
                    }
                    else if(agreet === 3)
                    {
                        sock.chat("Is there any way I may be of service, "+data.user+"?");
                    }
                    else if(agreet === 4)
                    {
                        sock.chat("Welcome back, Captain "+data.user+".");
                    }
                    else if(agreet === 5)
                    {
                        sock.chat("Greetings, noble merchant "+data.user+"!");
                    }
                    else if(agreet === 6)
                    {
                        sock.chat("Welcome, esteemed Patron "+data.user+"!");
                    }
                    else if(agreet === 7)
                    {
                        sock.chat("Welcome back! Welcome back, "+data.user+"!");
                    }
                    else if(agreet === 8)
                    {
                        sock.chat("Welcome once again, noble merchant "+data.user+".");
                    }
                    else if(agreet === 9)
                    {
                        sock.chat("Welcome, "+data.user+", my friend.");
                    }
                    else if(agreet === 10)
                    {
                        sock.chat("You? Here!? Oh my goodness, what have I done, that "+data.user+" would befoul my game?");
                    }
                    else if(agreet === 11)
                    {
                        sock.chat("One more comment about my hair and I swear I'll cut his-- oh! Hello, "+data.user+".");
                    }
                    else if(agreet === 12)
                    {
                        sock.chat(data.user+"! So good to see you again!");
                    }
                    else if(agreet === 13)
                    {
                        sock.chat("Sorry, we don't want any cookies. Oh, it's you, "+data.user+".");
                    }
                    else if(agreet === 14)
                    {
                        sock.chat("Wonderful to see you again "+data.user+"!");
                    }
                    else if(agreet === 15)
                    {
                        sock.chat(data.user+"? Again so soon?");
                    }
                    else if(agreet === 16)
                    {
                        sock.chat("I hear the sweet jingle of tokens. Hello Captain "+data.user+"!");
                    }
                    else if(agreet === 17)
                    {
                        sock.chat("Good day "+data.user+"! How is business?");
                    }
                    else if(agreet === 18)
                    {
                        sock.chat(data.user+", I'm glad you're back in port. Are you staying long?");
                    }
                    else if(agreet === 19)
                    {
                        sock.chat("Ho, Captain "+data.user+". What news from the Islands?");
                    }
                    else if(agreet === 20)
                    {
                        sock.chat("A pleasure meeting you, noble merchant "+data.user+".");
                    }
                    else if(agreet === 21)
                    {
                        sock.chat("Hello again, "+data.user+". I hope you're faring well.");
                    }
                    else if(agreet === 22)
                    {
                        sock.chat(data.user+", it's an honor to be in the presence of a true beauty.");
                    }
                    else if(agreet === 23)
                    {
                        sock.chat("Welcome, "+data.user+"! Where do you hail from?");
                    }
                    else if(agreet === 24)
                    {
                        sock.chat("Welcome to town, "+data.user+"!");
                    }
                    else if(agreet === 25)
                    {
                        sock.chat(data.user+"! Always a pleasure.");
                    }
                    else if(agreet === 26)
                    {
                        sock.chat("Ah, yes. It's good to see you, "+data.user+".");
                    }
                    else if(agreet === 27)
                    {
                        sock.chat("Honey, "+data.user+" has dropped by! Put some little cocktail weiners on toothpicks, would you?");
                    }
            }
            };
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
            if(ej.settings & AGREET) {
            sock.chat("Farewell, "+data.user+".");}
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
					log("Roles: "+data.data.join(", "));
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
					log("Command pdf: https://document.li/mGdr");
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
				log("Your emotes", "bold");
                log(Object.keys(users[user].emotes).join(" ") || "none found");
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
				"fufu": {
					src: "http://i.imgur.com/PSUnLkv.png",
					roles: ".sidekick.huntsman.prosecutor.snowman.justice.cutler.monkey.butterfly.bride.trickster.diabolist.gambler.apprentice.mechanic.heartbreaker.prosecutor.slasher.cyborg.president.nomad.librarian.plumber.rival.medusa.catlady.comedian.forager"
					},
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
			name: "Toggle autogreet",
			short: "/autogreet",
			regex: /^ag|^autogreet/i,
			callback: function() {
				ej.settings^=AGREET;
				log(ej.settings & AGREET ?
					"Autogreet enabled." :
					"Disabled autogreet."
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
			regex: /^mercenary/i,
            callback: function() {
                ej.settings^=OBEYME;
                log(ej.settings & OBEYME ?
					"You've decided to look for a job as a mercenary (type /mercenary again to disable)." :
					"You're now a free knight."
                   );
				sock.chat(ej.settings & OBEYME ?
                    "Hey everyone, I'm looking for a job as a mercenary! (@"+user+" obey me)":
                    "I've decided to move on and become a free knight!"
                    );
            }
        },
        	{
			name: "Remove master",
			regex: /^free/i,
			callback: function() {
                sock.chat("I've decided not to work for "+master+" anymore.");
                master="";
               }
			},
        {
			name: "Toggle knives",
            regex: /^roulette/i,
            callback: function() {
				roulette=roulette?0:10;
                if(roulette) {
                    sock.chat("I've got the daggers tipped with poison. Who shall I throw them at?");
					}
				}
			},
		{
			name: "Announce",
			regex: /^announce/i,
			callback: function() {
                sock.chat("Hey everyone, I'm looking for a job as a mercenary! (@"+user+" obey me)");
					}
			},
        {
			name: "Get master",
			regex: /^master (\w+)/i,
			callback: function(who) {
					master=who;
                    sock.chat(""+who+" is my new master.");
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
				"Hello f(r)iends",
				"Hey guys",
				"Hi friends",
                "Hi",
                "Whats up guys",
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
		lcopy.say={
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
			name: "Send vote (knife)",
			short: "/stab [name]",
			regex: /^stab ?(\w+)?/i,
			callback: function(name) {
				sock.vote(name || "*", "knife");
				}
			},
        		{
			name: "Send vote (snowball)",
			short: "/ball [name]",
			regex: /^ball ?(\w+)?/i,
			callback: function(name) {
				sock.vote(name || "*", "snowball");
				}
			},
		{
			name: "Send slow vote (gun)",
			short: "/sshoot [name]",
			regex: /^sshoot ?(\w+)?/i,
			callback: function(name) {
                    sock.chat("I'll give "+name+" a few seconds before I shoot them with my hand cannon.");
					setTimeout(function() { sock.vote(name, "gun");
                    sock.chat("Another one bites the dust!");
                                          },5000
                               );
					}
			},
        		{
			name: "Send slow vote (knife)",
			short: "/sstab [name]",
			regex: /^sstab ?(\w+)?/i,
			callback: function(name) {
                    sock.chat("Nobody can beat my dagger-throwing skills. Let's see if I hit bulls-eye again.", name);
					setTimeout(function() { sock.vote(name, "knife");
                    sock.chat("You put up a valiant fight, but justice will always prevail!");
                                          },5000
                               );
					}
			},
        		{
			name: "Send slow vote (snowball)",
			short: "/sball [name]",
			regex: /^sball ?(\w+)?/i,
			callback: function(name) {
                    sock.chat("I can throw a snowball as well as I can a dagger. Prepare to be iced!", name);
					setTimeout(function() { sock.vote(name, "snowball");
                    sock.chat("Stun the enemy before you attack, as I always say!");
                                          },5000
                               );
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
                        msg: ".",
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
                if(ranked) {
                    log("Disabled in ranked games.");
                }
                else if(true) {
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
                 role: {
					msg: "You are $1!",
					default: ["Host"]
					},
                act: {
					msg: "After observing $1 for an entire night, you realize he/she might be a $2.",
					default: [user, "actress"]
					},
				admire: {
					msg: "You really admire $1.",
					default: [user]
					},
                admirenk: {
					msg: "You cannot find any murderers to admire. You decide to become a killer!",
					default: []
					},
				angel: {
					msg: "You feel an overwhelming, unconditional love for $1. "
						+"You feel you must protect $1 with your life.",
					default: [user]
					},
				auto: {
					msg: "There might be an autocrat among you...",
					default: []
					},
                 baccept: {
					msg: "$1 accepted $2's marriage proposal!",
					default: [user, user]
					},
                 bcannot: {
					msg: "You cannot accept the proposal. You are already in love!",
					default: []
					},
                bdead: {
					msg: "$1 accepted the marriage proposal, but the bride is dead.",
					default: [user]
					},
                 bexplode: {
					msg: "There was a huge explosion!",
					default: []
					},
                 bfail: {
					msg: "The bomb failed to trigger!",
					default: []
					},
				bleed: {
					msg: "You start to bleed...",
					default: []
					},
				borg: {
					msg: "You have $1 charges remaining.",
					default: ["3"]
					},
				borgdead: {
					msg: "$1 is depleted of charges. $1 breaks down!",
					default: [user]
					},
                 bpass: {
					msg: "$1 passed the bomb to $2...",
					default: [user, user]
					},
                 breject: {
					msg: "$1 rejected $2's marriage proposal!",
					default: [user, user]
					},
                bride: {
					msg: "Suddenly, $1 proposes to $2!",
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
					default: ["chef"]
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
					default: ["TRIVIA TIME"]
					},
                cupid: {
					msg: "You feel cupid's arrow strike your heart. You fall madly in love with $1!",
					default: [user]
					},
				det: {
					msg: "Through your detective work, you learned that $1 is a $2!",
					default: [user, "detective"]
					},
				diab: {
					msg: "$1 casts their vote and shudders, collapsing to the ground!",
					default: [user]
					},
				disc: {
					msg: "You discover that $1 is the $2!",
					default: [user, "interceptor"]
					},
				dream: {
					msg: "You had a dream... where at least one of $1, $2, $3 is a mafia...",
					default: [user, user, user]
					},
				drunkdrive: {
					msg: "$1, who was drunk and wasn't wearing a seatbelt, drove into a tree and died! Don't drink and drive!",
					default: [user]
					},
				fabkey: {
					msg: "You could not open up the lock to your house! You notice that the key is rusted and broken!",
					default: []
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
				forge: {
					msg: "You read the will of $1, it reads: $2",
					default: [user, ""]
					},
				gamble: {
					msg: "The gambler has trapped $1 in a deadly game of rock / paper /scissors!",
					default: [user]
					},
				gdead: {
					msg: "$1 wins over $2! The gambler took $3's life!",
					default: ["rock", "paper", user]
					},
				gtie: {
					msg: "A tied game of scissors/paper/rock... $1 escapes the gambler's den!",
					default: [user]
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
                gwin: {
					msg: "$1 won against the gambler! $1 escapes from the gambler den!",
					default: [user]
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
					default: ["knife"]
					},
				jail: {
					msg: "You have been blindfolded and sent to jail!",
					default: []
					},
				jan: {
					msg: "While cleaning up the mess, you learned that $1 was a $2.",
					default: [user, "janitor"]
					},
				janday: {
					msg: "$1 is missing!",
					default: [user]
					},
				journ: {
					msg: "You received all reports that $1 received: ($2).",
					default: [user, ""]
					},
				justdiff: {
					msg: "You investigated $1 and $2 and determine that they have different alignments!",
					default: [user, user]
					},
				justsame: {
					msg: "You investigated $1 and $2 and determine that they have different alignments!",
					default: [user, user]
					},
				kick: {
					msg: "$1 has been kicked and banned from the room!",
					default: [user]
					},
				knifebleed: {
					msg: "You are bleeding...",
					default: []
					},
				knifefail: {
					msg: "Suddenly, $1 rushes at $2 with a knife! $1 trips over a rock and falls onto the ground. $2 runs away!",
					default: [user, user]
					},
				knifehit: {
					msg: "Suddenly, $1 rushes at $2 with a knife! $1 slashes $2 across the chest!",
					default: [user, user]
					},
				learn: {
					msg: "You learn that $1 is a $2",
					default: [user, "gramps"]
					},
				lib: {
					msg: "Suddenly, everyone finds themselves at a library. Shhhh...",
					default: []
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
				meteor: {
					msg: "A giant meteor will crash down and cause everyone to lose if you do not take action!",
					default: []
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
					default: [user, "mortician"]
					},
                notmeeting: {
					msg: "$1 is part of the mafia, but not attending the mafia meeting tonight.",
					default: [user]
					},
                path: {
					msg: "day 1: $1 "+
                    " day 2: $2",
					default: ["", ""]
					},
				party: {
					msg: "You find yourself at a vibrant party!",
					default: []
					},
				pengi: {
					msg: "During the night a fluffy penguin visits you and tells you that "+
						"$1 is carrying a $2.",
					default: [user, "knife"]
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
				poli: {
					msg: "You feel particularly aligned with the $1",
					default: ["village"]
					},
				pop: {
					msg: "$1 feels immensely frustrated!",
					default: [user]
					},
				pres: {
					msg: "$1 is the President! Protect the president at all costs!",
					default: [user]
					},
				psy: {
					msg: "You read $1's mind... they are thinking $2 thoughts.",
					default: [user, "confusing"]
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
				sec: {
					msg: "The secretary has died! Voting is cancelled for the following day.",
					default: []
					},
				snoop: {
					msg: "After some snooping, you find out $1 is carrying $3 $2.",
					default: [user, "gun", "1"]
					},
				snoop0: {
					msg: "After some snooping, you find out $1 is not carrying any items..",
					default: [user]
					},
				snowanon: {
					msg: "Suddenly, out of nowhere, a snowball hits $1! $1 is dazed!",
					default: [user]
					},
				snowmananon: {
					msg: "Suddenly, out of nowhere, a snowball hits $1! The snowball had no effect on $1.",
					default: [user]
					},
				snowmanreveal: {
					msg: "Suddenly, $1 throws a snowball at $2! The snowball had no effect on $2.",
					default: [user, user]
					},
				snowreveal: {
					msg: "Suddenly, $1 throws a snowball at $2! $2 is dazed!",
					default: [user, user]
					},
				spam: {
					msg: "You are timed out for 20 seconds for spamming!",
					default: []
					},
				stalk: {
					msg: "Through stalking, you learned that $1 is a $2!",
					default: [user, "stalker"]
					},
				sui: {
					msg: "$1 commits suicide!",
					default: [user]
					},
				terro: {
					msg: "$1 rushes at $2 and reveals a bomb!",
					default: [user, user]
					},
				thief: {
					msg: "You stole a $1!",
					default: ["knife"]
					},
				thulu: {
					msg: "You were witness to an unimaginable evil... you cannot forget... "
						+"your mind descends into eternal hell.",
					default: []
					},
				tink: {
					msg: "You found a gun in your victim's workshop...",
					default: []
					},
				track: {
					msg: "You followed $1 throughout the night. $1 visited $2.",
					default: [user, "no one"]
					},
				trait: {
					msg: "You are sided with the $1 mafia!",
					default: ["red"]
					},
				tree: {
					msg: "You became a tree!",
					default: []
					},
				trust: {
					msg: "You had a dream... you learned you can trust $1...",
					default: [user]
					},
				veg: {
					msg: "$1 has turned into a vegetable!",
					default: [user]
					},
				virgin: {
					msg: "The virgin has been sacrificed!",
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
				willwrite: {
					msg: "You wrote a will.",
					default: []
					},
				willrevise: {
					msg: "You revised your will.",
					default: []
					},
				willread: {
					msg: "As read from the last will of $1: $2",
					default: [user, ""]
					},
                willnone: {
					msg: "$1 did not leave a will!",
					default: [user]
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
				"What would you like me to help you with?", "What do you need help with?",
				"How may I assist you?", "How may I be of assistance, sir?"
            ],
            response2: [
				"It would be better to consult a wiser man than I.", "You may receive a more meaningful reponse from the elders.", "I'm not sure, perhaps another man here knows.", "I'm sorry, sir, but I truly don't have the answer to your question.", "That information is confidential."
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
				"I believe... $1", "$1 would be good...", "$1.", "Perhaps you should ask your lord that.", "If I really had to decide, I would go with $1."
            ]
        },
        {
            name: "Roll dice",
            short: "@bot roll dice or @bot d20",
            regex: /\bdice|\bd(\d+)/i,
            callback: function(data, d) {
                sock.chat(sformat(arand(this.responses), [
					Math.floor(Math.random()*(+d || 6)), +d || 6
                ]), data.user);
            },
            responses: [
				"I rolled a $2-sided die and got $1.", "The d﻿ice say $1.",
				"My dagger landed on $1.", "The wind says $1.",
				"You get $1 out of $2.", "The pouch contains $1 daggers.",
				"The gods have told me the answer is $1.", "Perhaps you should ask your lord to do that for you.",
				"I put $2 arrows in a quiver and shot them. $1 hit bullseye.", "You have your own dice; God helps those who help themselves."
            ]
        },
        {
			name: "Knife Game",
			short: "@bot roulette",
			regex: /roulette/i,
            callback: function(data) {
                if(roulette) {
                    var	user=data.user,
                        data=this;
                   sock.chat("There are "+roulette+" knives in my sack. Time to ready the knife...", user);
                    setTimeout(function() {
                        if(Math.random()*roulette>1) {
                            roulette--;
                            sock.chat(sformat("$1, $2, and somehow miss!", [
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
                            sock.vote(user, "knife");
                        }
                    }, 3000);
                }
            },
            message1: [
                "I steady my hand", "I put on my lucky socks", "I kiss the knife", "I take careful aim"
                ],
            message2: [
                "hurl the blade", "sling the blade", "let it rip", "flick my wrist"
                ],
            message3: [
                "your artery was severed", "you start bleeding", "you seem to be profusely bleeding", "you die internally"
                ]
            },
        {
            name: "Bomb fight",
            short: "@bot fight me",
            regex: /fig?h?te? ?me/i,
            callback: function(data) {
                autobomb=data.user;
				sock.chat("En garde!", data.user);
				}
			},
		{
			name: "Hello",
			short: "@bot hello",
			regex: /hello/i,
			callback: function(data) {
				sock.chat("Greetings.", data.user);            }
        },
        {
            name: "Obey",
            regex: /^be? my \w|obey me/i,
            callback: function(data) {
                if(!master) {
                    master=data.user;
					sock.chat(":knife: I can enlist as a mercenary for you. :knife: (List of commands: @"+user+" mercmd)", data.user);
                }
                else {
					sock.chat("I'm sorry, sir, but I only take commands from "+master+"!", data.user);
                }
            }
        },
        {
			name: "Be free",
			regex: /^be? free/i,
			callback: function(data) {
                	if(data.user===master) {
					master="";
                    sock.chat("/me is now a free knight.");
                    }
                else {
					sock.chat("I'm sorry, sir, but I only take commands from "+master+"!", data.user);
					}
					}
			},
        {
			name: "Be free",
			regex: /^be? free/i,
			callback: function(data) {
                	if(data.user===master) {
					master="";
                    sock.chat("/me is now a free knight.");
                    }
                else {
					sock.chat("I'm sorry, sir, but I only take commands from "+master+"!", data.user);
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
					sock.chat("Hm, maybe some other time?", data.user);
					}
				},
			responses: [
				"/me gives his master a quick peck on the cheek",
				"/me gives his master a nice big smooch",
				"I don't think that's proper for a mercenary.",
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
					sock.chat("<3", data.user);
					}
				},
			responses: [
				"I love you, master!",
				"Perhaps a kiss first?",
				"I don't think that's proper for a mercenary.",
				]
			},
		{
			name: "Get weapon",
			regex: /^grab weapon/i,
			callback: function(data) {
				if(data.user===master) {
					sock.chat(arand(this.responses));
					}
				else {
					sock.chat("I'm sorry, sir, but I only take commands from "+master+"!", data.user);
					}
				},
			responses: [
				"/me selects a couple of throwing daggers",
				"/me selects a steel sword",
				"/me selects a battle-axe",
                "/me selects a bow and a few arrows",
				]
			},
		{
			name: "Mercenary Commands",
			regex: /^mercmd/i,
			callback: function(data) {
				if(data.user===master) {
                    sock.chat("/me MERCENARY COMMANDS: mercmd, be free, grab weapon, bow, kill (user),", {
						whisper: true,
						target: data.user
						});
                    sock.chat("/me suicide/sui/die (DO NOT USE), vote/shoot/stab/ball (user), claim", {
						whisper: true,
						target: data.user
						});
					}
				else {
					sock.chat("I'm sorry, sir, but I only take commands from "+master+"!", data.user);
					}
				}
			},
		{
			name: "Roll over",
			regex: /^roll over/i,
			callback: function(data) {
				if(data.user===master) {
                    sock.chat("Mercenaries don't roll over!",data.user);
					}
				else {
					sock.chat("I'm sorry, sir, but I only take commands from "+master+"!", data.user);
					}
				}
			},
		{
			name: "Beg",
			regex: /^beg/i,
			callback: function(data) {
				if(data.user===master) {
                    sock.chat("What do you think I am, a beggar?",data.user);
					}
				else {
					sock.chat("I'm sorry, sir, but I only take commands from "+master+"!", data.user);
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
					sock.chat("I'm sorry, sir, but I only take commands from "+master+"!", data.user);
					}
				},
			responses: [
				"/me bows politely",
				"/me bows for his liege lord",
				"/me bows"
				]
			},
		{
			name: "Kill",
			regex: /^kill (\w+)/i,
			callback: function(data, who) {
				if(data.user===master) {
                    sock.chat("I will kill "+who+", sir.");
                    sock.vote(who, "gun");
  					sock.vote(who, "knife");
                    sock.vote(who, data.meet);
					}
                else {
					sock.chat("I'm sorry, sir, but I only take commands from "+master+"!", data.user);
					}
				}
			},
		{
			name: "Suicide",
			regex: /^sui|suicide|die/i,
			callback: function(data) {
				if(data.user===master) {
                    sock.chat("On second thought, I'm no longer working for you.", data.user);
                    sock.vote(master, "gun");
                    sock.vote(master, "knife");
                    sock.vote(master, data.meet);
					master="";
					}
                else {
					sock.chat("No.", data.user);
					}
				}
			},
		{
			name: "Vote",
			regex: /^vote (\w+)/i,
			callback: function(data, who) {
				if(data.user===master) {
                    sock.chat("I say this fellow should head to the gallows!");
                    sock.vote(who, data.meet);
					}
				}
			},
		{
			name: "Shoot",
			regex: /^shoot (\w+)/i,
			callback: function(data, who) {
				if(data.user===master) {
                    sock.chat("I'll give "+who+" a few seconds before I shoot them with my hand cannon.");
					setTimeout(function() { sock.vote(who, "gun");
                    sock.chat("Another one bites the dust!");
                                          },5000
                               );
					}
                    else {
					sock.chat("I'm sorry, sir, but I only take commands from "+master+"!", data.user);
					}
				}
			},
		{
			name: "Stab",
			regex: /^stab (\w+)/i,
			callback: function(data, who) {
				if(data.user===master) {
                    sock.chat("Nobody can beat my dagger-throwing skills. Let's see if I hit bulls-eye again.", who);
					setTimeout(function() { sock.vote(who, "knife");
                    sock.chat("You put up a valiant fight, but justice will always prevail!");
                                          },5000
                               );
					}
                else {
					sock.chat("I'm sorry, sir, but I only take commands from "+master+"!", data.user);
					}
				}
			},
		{
			name: "Ball",
			regex: /^ball (\w+)/i,
			callback: function(data, who) {
				if(data.user===master) {
                    sock.chat("I can throw a snowball as well as I can a dagger. Prepare to be iced!", who);
					setTimeout(function() { sock.vote(who, "snowball");
                    sock.chat("Stun the enemy before you attack, as I always say!");
                                          },5000
                               );
					}
                else {
					sock.chat("I'm sorry, sir, but I only take commands from "+master+"!", data.user);
					}
				}
			},
		{
			name: "Claim",
			regex: /^claim/i,
			callback: function(data) {
				if(data.user===master) {
					sock.chat("I'm a "+u(user).role+", my liege lord. I hope this means I am of service to you.", {
						whisper: true,
						target: data.user
						});
					}
                else {
					sock.chat("I'm sorry, sir, but I only take commands from "+master+"!", data.user);
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