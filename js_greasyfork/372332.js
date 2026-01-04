// ==UserScript==
// @name			ＳＨＷＡＲＴＺ９９ (personal)
// @version			1.9.2.8
// @description		's emjack v1.9.2.8
// @match			https://epicmafia.com/game/*
// @match			https://epicmafia.com/lobby
// @namespace		https://greasyfork.org/users/146029/
// @author			Shwartz99
// @homepage		https://epicmafia.com/user/378333
// @icon			https://i.imgur.com/PDgUlER.png
// @downloadURL https://update.greasyfork.org/scripts/372332/%EF%BC%B3%EF%BC%A8%EF%BC%B7%EF%BC%A1%EF%BC%B2%EF%BC%B4%EF%BC%BA%EF%BC%99%EF%BC%99%20%28personal%29.user.js
// @updateURL https://update.greasyfork.org/scripts/372332/%EF%BC%B3%EF%BC%A8%EF%BC%B7%EF%BC%A1%EF%BC%B2%EF%BC%B4%EF%BC%BA%EF%BC%99%EF%BC%99%20%28personal%29.meta.js
// ==/UserScript==

//shoutout to foxie, croned, and many others
//planning to add stuff from https://greasyfork.org/en/scripts/27201-beemovie
//oh yeah if you're planning on editing this script to personalize it, MAKE A NEW SCRIPT. As I will periodically update this, you don't want your edited script
//to be erased. In that regard, if you need any help, pm me on epicmafia or add me on discord: Shwartz99#0447. Happy emjacking!

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
        vstring: "1.9.2.8",
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
                else if(data.user === "MusicBoT") {
                    sock.chat("Cool user spotted!", data.user);}
                else if(data.user === "BlackLucio") {
                    sock.chat("Woah it's "+data.user+"!", data.user);}
                else if(data.user === "Astrokie") {
                    sock.chat("hej, "+data.user);}
                else if(data.user === "Revan") {
                    sock.chat("Welcome "+data.user+", Master of the force.");}
                else if(data.user === "LeChuck") {
                    sock.chat("Madre de Dios! Es el Pollo \""+data.user+"\" Diablo!");}
                else if(data.user === "barn") {
                    sock.chat("Sorry, we don't want any noble friends in Hell, "+data.user+"!");}
                else if(data.user === "nepenthe") {
                    sock.chat(data.user+"! Always a nuisance.");}
                else if(data.user === "Shigginator") {
                    sock.chat("Ah, yes. It's not good to see you, "+data.user+".");}
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
                log(users[user].emotes ? Object.keys(users[user].emotes).join(" ") || "none found" : "does not own");
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
                    src: "https://i.gyazo.com/39a27be694a80f1e7894ec6a05953ad7.png",
                    roles: ".sidekick.huntsman.prosecutor.snowman.justice.cutler.monkey.butterfly.bride.trickster.diabolist.gambler.apprentice.mechanic.heartbreaker.prosecutor.slasher.cyborg.president.nomad.librarian.plumber.rival.medusa.catlady.comedian.forager"
                },
                "ben": {
                    src: "https://i.gyazo.com/2276a84ea7c2af71800d10e82968c1dc.gif",
                    roles: ".sidekick.huntsman.prosecutor.snowman.justice.cutler.monkey"
                },
                "classic": {
                    src: "https://i.gyazo.com/737a514b6b15a6b31a3f257ee165f00d.png",
                    roles: ""
                },
                "muskratte": {
                    src: "https://i.gyazo.com/5115436b3fcf2ac61d657ab089508f37.png",
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
            name: "Trivia",
            regex: /^trivia/i,
            callback: function() {
                var trivianumber = Math.floor((Math.random() * 1410));
                sock.cmd("<", { crier: true, meet: "village", msg: this.responses[trivianumber][0] });
                log("Answer: "+this.responses[trivianumber][1]);
            },
            responses: [
                ["1,024 Gigabytes is equal to one what?","One Terabyte"],
                ["186,282 miles per second is the speed of what in a vacuum?","Light"],
                ["A Cuba Libre cocktail is made from what two main ingredients?","Rum and Coke"],
                ["A Grammy is an award to recognize outstanding achievement in what industry?","Music"],
                ["A Moscow Mule is a type of cocktail popularly served in what?","Copper Mug"],
                ["A Shakespearean sonnet consists of how many lines?","Fourteen"],
                ["A blunderbuss is an obsolete type of what?","Firearm"],
                ["A deficiency of what vitamin may lead to dry eyes and night blindness?","Vitamin A"],
                ["A flamboyance is a group of what animal?","Flamingos"],
                ["A koalas diet consists mainly of what?","Eucalyptus leaves"],
                ["A league is equivalent to how many nautical miles at sea?","Three"],
                ["A little less than half the size of Great Britain, what is Europes second largest island?","Iceland"],
                ["A masterpiece of the Modernist movement, The Love Song of J. Alfred Prufrock is a poem by which late American-British poet?","T. S. Eliot"],
                ["A modulator-demodulator is a hardware device better known as what?","Modem"],
                ["A pandas daily diet consists almost entirely of what plant?","Bamboo"],
                ["A person able to use both hands with equal skill is called what?","Ambidextrous"],
                ["A poke bowl is a diced raw fish dish that originated in which U.S. state?","Hawaii"],
                ["A puggle is a cross between which two dog breeds?","Pug and Beagle"],
                ["A standard 7-inch vinyl single is usually played at what rpm?","45 rpm"],
                ["A stroopwafel is a wafer cookie that originated in which European country?","Netherlands"],
                ["A tandoor is a type of what?","Oven"],
                ["A teetotaler is a person that never drinks what?","Alcohol"],
                ["A temperature reading of -459.67 degrees Fahrenheit or -273.15 degrees Celsius, is known as what?","Absolute Zero"],
                ["A wombat is a marsupial native to which country?","Australia"],
                ["A young Isaac Newton is said to have been hit on the head by which fruit, leading him to come up with the theory of gravity?","An apple"],
                ["A young woman in the 1920s that behaved and dressed boldly was referred to as what?","A Flapper"],
                ["A sounder is the term used to refer to a group of what type of animal?","Wild swine, pigs or boars"],
                ["ABBA was a pop group from what country?","Sweden"],
                ["Able to be seen from outer space, what is Earths largest living structure?","The Great Barrier Reef"],
                ["Abraham Lincoln was assassinated in what year?","1865"],
                ["Abraham Lincoln, Theodore Roosevelt and Herbert Hoover all belonged to which political party?","Republican"],
                ["According to Arthurian legend, what was the name of the sword in the stone?","Excalibur or Caliburn"],
                ["According to Forbes magazine in 2004, who was the first person to become a billionaire by writing books?","J.K. Rowling"],
                ["According to Greek mythology which Gorgon had snakes for hair and could turn onlookers into stone?","Medusa"],
                ["According to Greek mythology which King of Mycenae was the father of Agamemnon and Menelaus?","Atreus"],
                ["According to Greek mythology, who was the god of wine?","Dionysos"],
                ["According to Greek mythology, who was the goddess of beauty?","Aphrodite"],
                ["According to Guiness World Records, which author has the most published works?","L. Ron Hubbard"],
                ["According to Mohs scale, what mineral is the hardest?","Diamond"],
                ["According to Norse mythology, who is the god of thunder?","Thor"],
                ["According to ancient Roman religion, who was the god of the sea?","Neptune"],
                ["According to legend, Romulus and Remus founded what city?","Rome"],
                ["According to physics, what are the four fundamental forces in nature?","Strong Force, Electromagnetic Force, Weak Force, Gravitational Force"],
                ["According to the Star Trek science fiction franchise, Earth is what class of planet?","M Class"],
                ["According to the lyrics of the hit Queen song Killer Queen, perfume came naturally from where?","Paris"],
                ["According to the popular Christmas song, Frosty the Snowman, what are the snowmans eyes made out of?","Coal"],
                ["Actress Gal Gadot starred in what American superhero film released in the summer of 2017?","Wonder Woman"],
                ["Alexander the great was taught by which Greek philosopher?","Aristotle"],
                ["Alkebulan is the oldest indigenous name for which continent?","Africa"],
                ["Ambergris is a waxy substance that originates as a secretion from what aquatic animal?","Sperm whale"],
                ["American film director and actor Shelton Jackson Lee is better known by what name?","Spike Lee"],
                ["American mobster Al Capone was sentenced to 11 years in federal prison for what crime?","Tax Evasion"],
                ["American politician and diplomat Madeleine Albright was born in what central European country?","Czechoslovakia"],
                ["American singer-songwriter Johny Cash passed away in what year?","2003"],
                ["American writer Daniel Keyes wrote what sciencefiction novel that was later adapted to the Academy Award-winning film Charly?","Flowers for Algernon"],
                ["Americas first multimillionaire, John Jacob Astor, made his fortune in what trade?","Fur Trade"],
                ["An Astronomical Unit is the average distance between which two objects in our solar system?","The Earth and the Sun"],
                ["An Astronomical Unit is the mean distance between the center of what two objects?","The Sun and Earth"],
                ["An animal that lives part of its life on land and part in water is known as what?","An Amphibian"],
                ["An octopus can fit through any hole larger than its what?","Beak"],
                ["And to think I saw it on Mulberry Street was the first book published by which childrens author?","Dr. Seuss (Theodor Seuss Geisel)"],
                ["Approximately 2% of all people have what eye color?","Green"],
                ["Arbys is a fast-food restaurant chain specializing in sandwiches made with what main ingredient?","Roast beef"],
                ["Aspirin comes from the bark of what tree?","White willow tree"],
                ["At 2020 Oscars, which South Korean film took home four awards including best picture?","Parasite"],
                ["At its peak in 2004, which company had over 9000 video rental stores worldwide?","Blockbuster Video (Blockbuster LLC)"],
                ["At the time of his assassination, what play was Abraham Lincoln watching?","Our American Cousin"],
                ["At what temperature are Celsius and Fahrenheit equal?","-40 degrees"],
                ["Atlantic City is a popular entertainment destination located in what U.S. state?","New Jersey"],
                ["Atlantis, Paradise Island is a famous resort located on which countrys coral based archipelago?","The Bahamas (the Commonwealth of The Bahamas)"],
                ["Au is the symbol for for what chemical element?","Gold"],
                ["Award winning Latina pop artist Shakira was born in raised in what Country?","Colombia"],
                ["Awarded posthumously in 2001, who is the only U.S. President to have received the Medal of Honor?","Theodore Roosevelt"],
                ["BB-8 is an astromech droid from what film franchise?","Star Wars"],
                ["Barack Obama was first elected president of the United States in what year?","2008"],
                ["Before the introduction of the euro, what was the name for the basic monetary unit used in the Netherlands?","Guilder"],
                ["Beirut is the capital and largest city of what country?","Lebanon"],
                ["Believed to grow as large as 60 feet (18 meters), what is the largest species of shark currently living in the ocean?","Whale Shark (Rhincodon typus)"],
                ["Betelgeuse and Rigel are the two giant stars in which constellation?","Orion"],
                ["Bogota is the high altitude capital of which country?","Colombia"],
                ["Born into a family of Dutch Americans, who was the only US President to speak English as a second language?","Martin Van Buren"],
                ["Brazil was once a colony of which European country?","Portugal"],
                ["Bronze is an alloy consisting primarily of what two elements?","Copper & Tin"],
                ["Bruce Banner turns into what fictional superhero when he becomes angry?","The Hulk"],
                ["Bruce Willis played a convict turned time traveler in what 1995 movie?","12 Monkeys"],
                ["Bubble tea originated in which country?","Taiwan"],
                ["Burkina Faso is a landlocked country located on which continent?","Africa"],
                ["Busan is the second most populous city in what country?","South Korea"],
                ["By area, what is the smallest ocean in the world?","The Arctic Ocean"],
                ["By volume, what is the largest body of water in the United Kingdom?","Loch Ness"],
                ["CBGB, the former infamous New York music club, stands for what?","Country, Blue Grass and Blues"],
                ["CERN launched the very first website in what year?","1990"],
                ["Calling it inflammable air, which English scientist discovered hydrogen?","Henry Cavendish"],
                ["Callisto is the name of a moon orbiting what planet in our solar system?","Jupiter"],
                ["Canada is made up of how many provinces?","10"],
                ["Canadas highest mountain is located in which province or territory?","Yukon"],
                ["Carved stone human figures with large heads, known as Moai, can be found on what Polynesian island?","Easter Island (Rapa Nui)"],
                ["Catalonia is a region of what country?","Spain"],
                ["Catcher in the Rye by J.D. Salinger is a story about the life of what teenage protagonist?","Holden Caulfield"],
                ["Celebrity chef Gordon Ramsay opened his first restaurant in what city?","London, England"],
                ["Ceres is a dwarf planet that lies between the orbits of which two planets in our solar system?","Mars & Jupiter"],
                ["Champagne is a sparkling wine made from grapes grown in the Champagne region of which country?","France"],
                ["Chicos Bail Bonds is the sponsor of what fictional movie little league team?","Bears  (Bad News Bears)"],
                ["Chile shares the majority of its border with which other South American country?","Argentina"],
                ["Chilean sea bass originally went by what less appetizing name?","Patagonian toothfish"],
                ["Chimichurri is a green sauce that originated in what country?","Argentina"],
                ["Chinas Terracotta Army depicts the soldiers of what emperor?","Qin Shi Huang"],
                ["Chunk was a character in which 1985 movie about a group of young misfits looking for lost treasure?","The Goonies"],
                ["Cinco de Mayo celebrates the Mexican armys 1862 victory over France in what battle?","The Battle of Puebla"],
                ["Cogito ergo sum, I think, therefore I am, is a Latin phrase by which philospher?","Rene Descartes"],
                ["Come as You Are, a song by the grunge band Nirvana was released on which album?","Nevermind"],
                ["Created in 2009, what was the first decentralized cryptocurrency?","Bitcoin"],
                ["Cruella de Vil is a character who appeared in what novel by Dodie Smith?","The Hundred and One Dalmatians"],
                ["Cubic zirconia is a synthesized material often used in place of what precious stone?","Diamond"],
                ["Curiosity is a car-sized rover that was launched by NASA in 2011 to explore which planet?","Mars"],
                ["Currently a popular tourist destination, which Croatian city is known as The Pearl of the Adriatic?","Dubrovnik"],
                ["Cynophobia is the fear of what kind of animal?","Dogs"],
                ["Daniel Peggotty is a character from which Charles Dickens novel published in 1850?","David Copperfield"],
                ["Debuting in September 1966, what Chevrolet pony car was designed to be a competing model to the Ford Mustang?","Chevrolet Camaro"],
                ["Demolition of the Berlin wall separating East and West Germany began in what year?","1989"],
                ["Diamonds are made up almost entirely of what element?","Carbon"],
                ["Diana Prince is the public persona of which fictional superhero?","Wonder Woman"],
                ["Dijon mustard originated in the city of Dijon, located in what country?","France"],
                ["Due to the extreme difficulty of ascent, what mountain is nicknamed the Savage Mountain?","K2"],
                ["Ebony and Ivory was a 1982 number one hit single performed by which two singers?","Paul McCartney and Stevie Wonder"],
                ["Eddie Murphys first major motion picture role was in what movie released in 1982 co-starring Nick Nolte?","48 Hours"],
                ["Emma Watson is known for playing which character in Harry Potter?","Hermione Granger"],
                ["Established in 1872, what became the worlds first national park?","Yellowstone National Park"],
                ["Established in the 1920s, what historic double-digit highway connected Chicago and Los Angeles?","Route 66"],
                ["Europe is separated from Asia by which mountain range?","Ural Mountains"],
                ["Executives of William Randolph Hearsts media empire conspired to stop the release of what 1941 film?","Citizen Kane"],
                ["Existing as recently as 100,000 years ago, Gigantopithecus blacki is an extinct species what animal?","Ape"],
                ["FARC is the acronym for a guerrilla movement originating in which country?","Colombia"],
                ["Fe is the chemical symbol for what element?","Iron"],
                ["Ferdinand III was the longest reigning monarch of what former Kingdom?","Sicily"],
                ["Filipino First Lady Imelda Marcos, was famous for her very large collection of what?","Shoes"],
                ["First published in 1719, Robinson Crusoe is a novel written by which English writer?","Daniel Dafoe"],
                ["First published in 1842, The Masque of the Red Death is a short story by which American writer?","Edgar Allan Poe"],
                ["First published in 1988, The Alchemist is a best-selling novel by what Brazilian author?","Paulo Coelho"],
                ["Florence Nightingale aided the sick and wounded during which war?","The Crimean War"],
                ["Foie gras is a french delicacy made from the liver of what animal?","Duck or Goose"],
                ["Fonts that contain small decorative lines at the end of a stroke are known as what?","Serif Fonts"],
                ["Formerly known as Bedloes Island, what is the current name of the island where the Statue of Liberty is located?","Liberty Island"],
                ["Formerly the worlds tallest building, what is the name of Taipeis largest skyscraper?","Taipei 101"],
                ["Fort Benning is a United States Army post located in which state?","Georgia"],
                ["Founded in 1607, what is considered to be the first permanent English settlement in the New World?","Jamestown, Virginia"],
                ["Founded in 1921, this company was credited with being the first fast food chain?","White Castle"],
                ["Frankenmuth, a U.S. city nicknamed Little Bavaria, is located in what state?","Michigan"],
                ["From which major U.S. city can a person drive south into Canada?","Detroit"],
                ["Ganymede, the largest moon in our solar system, belongs to which planet?","Jupiter"],
                ["Girl with a Pearl Earring is an oil painting by which Dutch Golden Age painter?","Johannes Vermeer"],
                ["Gordon Matthew Thomas Sumner, the English musician, singer, songwriter, and actor, is better known by what name?","Sting"],
                ["Guinness beer was first brewed in which country?","Ireland"],
                ["Gumbo is a stew that originated in which state?","Louisiana"],
                ["Gymnophobia is the fear of what?","Nudity"],
                ["HTML and CSS are computer languages used to create what?","Websites"],
                ["Hale-Bopp is classified as which type of small Solar System body?","Comet"],
                ["Halloumi is a semi-hard, unripened, brined cheese that originates from which Mediterranean island country?","Cyprus"],
                ["Hamburgers get their name from what European city?","Hamburg, Germany"],
                ["Harry, Niall, Louis, Liam, and Zayn auditioned for The X Factor as soloists, but competed together as what group?","One Direction"],
                ["Hiragana, Katakana and Kanji are the names for writing systems used in which country?","Japan"],
                ["Hopalong Cassidy is a fictional cowboy hero, what was the name of his horse?","Topper"],
                ["Houses of the Holy is the fifth studio album by which English rock band?","Led Zeppelin"],
                ["How many Olympic Games have been hosted in Africa?","Zero"],
                ["How many U.S. presidents were only children?","None"],
                ["How many US Supreme Court justices are there?","9"],
                ["How many US states border the Pacific Ocean?","Five states: California, Oregon, Washington, Alaska and Hawaii"],
                ["How many acres are in a square mile?","640"],
                ["How many chambers are there in a dogs heart?","Four"],
                ["How many electrons does a hydrogen atom have?","One"],
                ["How many elevators does the Empire State Building have?","73"],
                ["How many feet are in a mile?","5280"],
                ["How many furlongs are in a mile?","Eight"],
                ["How many furlongs are there in one mile?","Eight"],
                ["How many hearts does an octopus have?","Three"],
                ["How many hydrogen atoms are in one molecule of water?","Two"],
                ["How many items are in a bakers dozen?","13"],
                ["How many keys are on most baby grand pianos?","88"],
                ["How many letters are in the Greek alphabet?","24"],
                ["How many members were in the American rock band The White Stripes?","Two (Jack & Meg White)"],
                ["How many moons does the planet Venus have?","Zero"],
                ["How many mother sauces are there in classical French cuisine?","Five: Bechamel, Veloute,Espagnole, Sauce Tomat, Hollandaise"],
                ["How many paintings did Vincent Van Gogh sell during his lifetime?","One, The Red Vineyard at Arles"],
                ["How many pairs of chromosomes are in found in the average human?","Twenty-three"],
                ["How many people have walked on the moon?","Twelve"],
                ["How many planets in our solar system are not named after a god or goddess?","One, Earth"],
                ["How many planets in our solar system have moons?","Six"],
                ["How many red stripes are there on the United States flag?","Seven"],
                ["How many states are needed to ratify an amendment for it to become part of the constitution?","Three-fourths of the states (38 of 50)"],
                ["How many stripes are on the flag of the United States?","13"],
                ["How many times zones are in Canada?","Six"],
                ["How many years are in a score?","Twenty"],
                ["How old must a person be to run for President of the United States?","35"],
                ["How old was American musician Jimi Hendrix when he passed away in 1970?","27"],
                ["How the Grinch Stole Christmas is a 2000 American Christmas fantasy comedy film starring which actor as the Grinch?","Jim Carrey"],
                ["How the Grinch Stole Christmas is a childrens book written by which American author?","Dr. Seuss (Theodor Seuss Geisel)"],
                ["IKEA, the ready-to-assemble furniture company, has its headquarters located in what country?","The Netherlands"],
                ["If a liquor is 100 proof how much alcohol does it contain by percentage?","50 Percent"],
                ["If you were in the city of Turin, what country would you be in?","Italy"],
                ["In 1513, who became the first European explorer to set eyes on the Pacific Ocean?","Vasco Nunez de Balboa"],
                ["In 1770, Ludwig van Beethoven was born in what German city?","Bonn, Germany"],
                ["In 1781, what was the first planet to be discovered using the telescope?","Uranus"],
                ["In 1783, the first free flight of a hot air balloon carrying a human occurred in what city?","Paris, France"],
                ["In 1789, who lead the mutiny on the Royal Navy vessel HMS Bounty?","Fletcher Christian"],
                ["In 1790, nine of the mutineers of the Bounty, along with the native Tahitians that were with them, settled on which island?","Pitcairn Island"],
                ["In 1796 Edward Jenner developed the vaccination for what disease?","Smallpox"],
                ["In 1797, who became the second president of the United States of America?","John Adams"],
                ["In 1814 Napoleon was exiled to which island located off the coast of Tuscany?","Elba"],
                ["In 1862, the city of Bucharest became the capital of which country?","Romania"],
                ["In 1863, which U.S. President declared that the last Thursday in November should be celebrated as Thanksgiving?","Abraham Lincoln"],
                ["In 1867 the United States purchased Alaska from what country?","Russia"],
                ["In 1885, Louis Pasteur developed a vaccine for which viral disease?","Rabies"],
                ["In 1893, which country became the first to give women the right to vote?","New Zealand"],
                ["In 1917, Finland declared its independence from which country?","Russia"],
                ["In 1939, the movie The Wizard of Oz lost the Academy Award for best picture to what film?","Gone with the Wind"],
                ["In 1941, George de Mestral was inspired by the burs that clung to his pants when walking in the woods to create what product?","Velcro"],
                ["In 1946 the ringgit was established as the official monetary unit of which Southeast Asian country?","Malaysia"],
                ["In 1952 the United States Air Force created Project Blue Book to study what?","Unidentified Flying Objects (UFOs)"],
                ["In 1952, Albert Einstein was offered the presidency of which country?","Israel"],
                ["In 1954, Ann Hodges from Oak Grove, Alabama, became the first person in recorded history to be struck by what?","A meteorite"],
                ["In 1967, what band released the hit song Ruby Tuesday?","The Rolling Stones"],
                ["In 1972 the country of Ceylon changed its name to what?","Sri Lanka"],
                ["In 1975 an engineer created the first electronic camera while working for what company?","Kodak"],
                ["In 1979, Malcolm McDowell starred in what erotic historical drama film focusing on the rise and fall of a Roman Emperor?","Caligula"],
                ["In 1981, the first space shuttle landing occurred on a dry lake at which U.S. Air Force base?","Edwards Air Force Base in California"],
                ["In 1998, the German automobile company Daimler-Benz purchased what U.S. car company?","Chrysler"],
                ["In 1998, who replaced Casey Kasem as host of the American Top 40 radio program?","Shadoe Stevens"],
                ["In 2003, which U.S. state was officially declared the birthplace of aviation?","Ohio (Dayton, Ohio was the home of Wilbur and Orville Wright)"],
                ["In 2009, which company announced a deal to acquire Marvel Entertainment for $4.24 billion?","The Walt Disney Company"],
                ["In 2018, which American heavy metal rock band released a tribute to the Cranberries song Zombie?","Bad Wolves"],
                ["In Disneys 1959 animated film Sleeping Beauty, who is Princess Aurora is betrothed to?","Prince Phillip"],
                ["In Disneys The Little Mermaid what is the name of the human that Ariel falls in love with?","Prince Eric"],
                ["In Frank Baums novel The Wonderful Wizard of Oz, on which the film is based, what color are Dorothys slippers?","Silver"],
                ["In George Orwells Animal Farm, what was the name of the pig leader?","Napoleon"],
                ["In L. Frank Baums original 1900 novel, The Wonderful Wizard of Oz, what color were Dorothys shoes?","Silver"],
                ["In Nathaniel Hawthornes historical fition novel The Scarlet Letter, what was the letter?"," A stands for adulteress"],
                ["In October 1582, Pope Gregory XIII introduced what calendar?","Gregorian calendar"],
                ["In Roman mythology, Veritas is the goddess of what?","Truth"],
                ["In Shakespeares tragedy Romeo and Juliet, whats Romeos last name?","Montague"],
                ["In The Karate Kid, what was the name of the dojo where the boys that bullied Daniel LaRusso trained?","Cobra Kai"],
                ["In What state was President Barack Obama born?","Hawaii"],
                ["In a photo editing program, what do the letters RGB stand for?","Red, Green & Blue"],
                ["In a website browser address bar what does www stand for?","World Wide Web"],
                ["In computer science, what does GUI stand for?","Graphical user interface"],
                ["In computer terminology what does the acronym LAN stand for?","Local-area network"],
                ["In cooking, margarine is used as a substitute for what ingredient?","Butter"],
                ["In database programming, SQL is an acronym for what?","Structured Query Language"],
                ["In fluid dynamics, what is the term for the highest attainable speed an object can reach as it falls?","Terminal Velocity"],
                ["In geometry, how many sides are on a heptagon?","Seven"],
                ["In humans, what is the only internal organ capable of regenerating lost tissue?","The Liver"],
                ["In most countries it is illegal to call sparkling wine by what name unless it was produced in certain region of France?","Champagne"],
                ["In most modern vehicles, the carburetor has been replace with what?","Fuel Injection"],
                ["In movie ratings what do the letters PG stand for?","Parental Guidance"],
                ["In movies, a clue or piece of information which is intended to be misleading, is known as what?","Red Herring"],
                ["In music, the space between one musical pitch and another with double its frequency is called what?","An octave"],
                ["In our solar system which two planets are known as ice giants?","Uranus and Neptune"],
                ["In our solar system which two planets rotate clockwise?","Venus & Uranus"],
                ["In our solar system, which planet has the shortest day?","Jupiter"],
                ["In science, how long is an eon?","One billion years"],
                ["In terms of geographical area, what is the largest country in Africa?","Algeria"],
                ["In the 1983 movie National Lampoons Vacation, what fictional amusement park were the Griswold family trying to go to?","Walley World"],
                ["In the 1986 blockbuster Top Gun which actress played Gooses wife?","Meg Ryan"],
                ["In the 1988 American live-action/animated comedy film Who Framed Roger Rabbit, who framed Roger Rabbit?","Judge Doom"],
                ["In the 1997 American science fiction comedy Men in Black, which actor played Agent K?","Tommy Lee Jones"],
                ["In the 2008 superhero film The Dark Knight which actor played the character Batman?","Christian Bale"],
                ["In the 2016 American fantasy adventure film, The Jungle Book, what is the name of the orphaned human boy?","Mowgli"],
                ["In the American comic strip Little Orphan Annie, what is the name of Annies dog?","Sandy"],
                ["In the Disney movie Beauty and the Beast, what is the name of Gastons bumbling sidekick?","LeFou"],
                ["In the Harry Potter series, what is the name of Harrys pet owl?","Hedwig"],
                ["In the Marvel cinematic universe, what is the name of Thors home planet?","Asgard"],
                ["In the Star Wars universe, who is Luke Skywalkers mother?","Padme Amidala"],
                ["In the US, a pint of milk is equal to how many cups of milk?","Two"],
                ["In the United States and Canada, one ton is a unit of measure that contains how many pounds?","2000"],
                ["In the United States which breed of dog is commonly known as a firehouse dog?","Dalmatian"],
                ["In the United States, where can alligators and crocodiles be found together in the wild?","South Florida (Everglades)"],
                ["In the Walt Disney film Pinocchio, what is the name of the giant whale?","Monstro"],
                ["In the X-Men film franchise, Halle Berry played the role of which character?","Storm"],
                ["In the childrens books about a 25 foot tall red dog, what is the name of the dog?","Clifford"],
                ["In the fact based movie 21 released in 2008, students from MIT made millions by counting cards playing which card game?","Blackjack"],
                ["In the human body, what is the hallux?","The big toe"],
                ["In the late 1890s, Bayer marketed a cough, cold & pain remedy that contained what now illegal drug?","Heroin"],
                ["In the movie Spinal Tap, the bands amplifier goes from zero to what?","Eleven"],
                ["In the movie The Terminator, what is the name of the company that created Skynet?","Cyberdyne Systems"],
                ["In the movie Back to the Future, what speed did the DeLorean need to reach in order to achieve time travel?","88 MPH"],
                ["In the movie Bambi, what type of animal is Bambis friend Flower?","Skunk"],
                ["In the movie The Lion King, what was Simbas mothers name?","Sarabi"],
                ["In the movie The Wizard of Oz, what did the Scarecrow want from the wizard?","A brain"],
                ["In the sitcom Family Matters and film Die Hard, actor Reginald VelJohnsons character had what occupation?","Police officer"],
                ["In the world of video games, what does NES stand for?","Nintendo Entertainment System"],
                ["In the Lord of the Rings film series which actor plays the character of Saruman?","Christopher Lee"],
                ["In welding terminology, what do the letters MIG stand for?","Metal Inert Gas"],
                ["In what Mark Twain novel does an engineer from Connecticut travel back in time to the age of Camelot?","A Connecticut Yankee in King Arthurs Court"],
                ["In what city does a Creole lady of the night strut her stuff, according to the original 1974 song Lady Marmalade?","New Orleans"],
                ["In what city was Ludwig van Beethoven born?","Bonn, Electorate of Cologne"],
                ["In what city would you find the La Brea Tar Pits?","Los Angeles"],
                ["In what city would you find the Wizard of Oz?","The Emerald City"],
                ["In what country were the Winter Olympics first held?","France (1924)"],
                ["In what country would you find Mount Kilimanjaro?","Tanzania"],
                ["In what country would you find large ancient geoglyphs known as the the Nasca Lines?","Peru"],
                ["In what country would you find the Yellow River?","China"],
                ["In what country would you find the temple complex Angkor Wat?","Cambodia"],
                ["In what month does winter begin in the Southern Hemisphere?","June"],
                ["In what month is the Earth closest to the sun?","January"],
                ["In what month is the longest day in the Northern Hemisphere?","June"],
                ["In what ocean did the Titanic sink?","The North Atlantic Ocean"],
                ["In what two-act ballet does a toymakers goddaughter travel to the Land of Sweets on Christmas Eve?","The Nutcracker"],
                ["In what type of restaurant would you typically find the condiment wasabi?","Japanese"],
                ["In what year did Canada become a country?","1867"],
                ["In what year did Fidel Castro die?","2016"],
                ["In what year did India gain its independence from Britain?","1947"],
                ["In what year did McDonalds start serving breakfast with the introduction of the Egg McMuffin?","1972"],
                ["In what year did Neil Armstrong and Buzz Aldrin land on the moon?","1969"],
                ["In what year did Nintendo release its first game console in North America?","1985"],
                ["In what year did Paul McCartney announce he was quitting the Beatles?","1970"],
                ["In what year did World War II end?","1945"],
                ["In what year did the Apollo 7 human spaceflight take place?","1968"],
                ["In what year did the French revolution begin?","1789"],
                ["In what year did the Titanic sink?","1912"],
                ["In what year did the aviator Charles A. Lindbergh cross the Atlantic Ocean?","1927"],
                ["In what year did the great fire of London take place?","1666"],
                ["In what year is Columbus credited with discovering the new world?","1492"],
                ["In what year was Alfred Hitchcocks psychological thriller Psycho released?","1960"],
                ["In what year was Nelson Mandela released from prison?","1990"],
                ["In what year was Queen Elizabeth II born?","1926"],
                ["In what year was the Chevrolet Chevelle first produced?","1964"],
                ["In what year was the Declaration of Independence created?","1776"],
                ["In what year was the Nintendo 64 officially released?","1996"],
                ["In what year was the US Constitution written?","1787"],
                ["In what year was the United States Pledge of Allegiance written?","1892"],
                ["In what year was the blue M&M first introduced?","1995"],
                ["In what year was the first Apple computer released?","1976"],
                ["In what year was the first Harry Potter movie released?","2001"],
                ["In what year was the first James Bond film Dr. No released?","1962"],
                ["In what year was the iPhone first released?","2007"],
                ["In what year was the movie Grease released?","1978"],
                ["In what year was the original Jurassic Park film released?","1993"],
                ["In which 1993 thriller does the protagonist get angry when a fastfood restaurant wont let him order from the breakfast menu?","Falling Down"],
                ["In which Asian country is the city of Chiang Mai located?","Thailand"],
                ["In which Disney film do two cats sing The Siamese Cat Song?","Lady and the Tramp"],
                ["In which South American country would you find the ancient Incan citadel Machu Picchu?","Peru"],
                ["In which Star Wars film did the Ewoks first appear?","Episode VI: Return of the Jedi"],
                ["In which U.S. National park is the rock formation known as Glacier Point Apron located?","Yosemite National Park"],
                ["In which U.S. state would you find Mount Rushmore?","South Dakota"],
                ["In which US state would you find Stone Mountain Park?","Georgia"],
                ["In which city did Rosa Parks famously refuse to give up her seat on the bus?","Montgomery Alabama"],
                ["In which country did cheddar cheese originate?","England"],
                ["In which country is the Nobel Peace Prize awarded?","Norway, the other Nobel Prizes are awarded in Sweden"],
                ["In which country would you find the Panama Canal?","Panama"],
                ["In which national park would you find the geyser known as Old Faithful?","Yellowstone National Park"],
                ["In which state of the United States would you find Fort Knox?","Kentucky"],
                ["In which state was the first oil well drilled in the United States?","Pennsylvania"],
                ["Inferior, superior, & fata morgana are different types of what optical illusion?","Mirage"],
                ["Introduced by Edward Jenner In 1796, what was the first successful vaccine to be developed?","Smallpox vaccine"],
                ["Ireland suffered the Great Famine beginning in 1845 due to the collapse of what crop?","Potato"],
                ["Jack the Ripper is the name given to an unidentified serial killer that terrorized what city in 1888?","London, England"],
                ["Jackson Pollock was an influential abstract expressionist painter from what country?","The United States"],
                ["Jamon iberico is a type of cured ham that is traditionally produced by which two neighboring countries?","Spain and Portugal"],
                ["Jason Voorhees is the main antagonist in what movie franchise?","Friday the 13th"],
                ["Jean-Paul Sartre and Le Duc Tho both declined to accept what famous international award?","The Nobel Prize"],
                ["Jim Carrey and Renee Zellweger starred in what comedy film released in 2000, about a cop with dissociative identity disorder?","Me, Myself & Irene"],
                ["Jim Davis was the cartoonist behind which widely syndicated comic strip?","Garfield"],
                ["Jimi Hendrix, Janis Joplin, Jim Morrison, and Amy Winehouse all died at what age?","27"],
                ["Jimmy Carter was the first U.S. president born in a what?","Hospital"],
                ["John Montagu, the man credited with inventing the sandwich, held what noble title?","Earl of Sandwich"],
                ["Joseph Smith was the founder of what religion?","Mormonism"],
                ["Jules Vernes fictional submarine the Nautilus is captained by which character?","Captain Nemo"],
                ["K-pop is a genre of music that originated in what country?","South Korea"],
                ["Keiko is the name of a whale that appeared in what 1993 American family drama film?","Free Willy"],
                ["Key and Kaffir are two types of what fruit?","Lime"],
                ["Kinnikinnick is a Native American herbal mixture used as a substitute for what?","Tobacco"],
                ["Kiss Me Kate and 10 Things I Hate About You were both based on which Shakespeare comedy?","The Taming of the Shrew"],
                ["Known for its characteristic strong smell and taste, Stilton is a type of cheese produced in which country?","England"],
                ["Kopi luwak is a very expensive type of what?","Coffee"],
                ["Lake Chapala is the largest freshwater lake in which country?","Mexico"],
                ["Lake Tahoe straddles the border between which two U.S. states?","California & Nevada"],
                ["Lead is a chemical element with what symbol on the periodic table?","Pb"],
                ["Lemurs, a type of primate, are native to what island nation?","Madagascar"],
                ["Leonardo Davincis 15th-century mural, The Last Supper, is located in what city?","Milan, Italy"],
                ["Les Demoiselles dAvignon (The Young Ladies of Avignon) is a large oil painting created in 1907 by which Spanish artist?","Pablo Picasso"],
                ["Lindsay Lohan made her film debut in what 1998 Disney movie remake?","The Parent Trap"],
                ["Located approximately halfway between Iceland and Norway, the Faroe Islands are a territory of which country?","Denmark"],
                ["Located in Cambodia, what is the largest religious monument in the world?","Angkor Wat"],
                ["Located in Lake Huron, Mackinac Island is part of which U.S. state?","Michigan"],
                ["Located in Northwestern Turkey, which strait separates Europe and Asia?","Bosphorus Strait"],
                ["Located in southeast Vietnam, what is the former name of Ho Chi Minh City?","Saigon"],
                ["Located in southern Siberia, what lake is the deepest and largest freshwater lake in the world?","Lake Baikal"],
                ["London Calling was the third studio album released by which English rock band?","The Clash"],
                ["Long Island is a part of which US state?","New York"],
                ["Lox, often served on a bagel, is a fillet of brined what?","Salmon"],
                ["MRI is the acronym used for what medical imaging technique?","Magnetic resonance imaging"],
                ["Mac Gargan is the alter ego of what Spider-Man villain?","Scorpion"],
                ["Macau is an autonomous territory belonging to which country?","China"],
                ["Madagascar is an island located of the southeast coast of what continent?","Africa"],
                ["Madeira, an archipelago located in the Atlantic Ocean, is autonomous region of which country?","Portugal"],
                ["Magarine is sold as a replacement for what?","Butter"],
                ["Malbec, Sangiovese, and Syrah are all a type of what?","Wine"],
                ["Malcolm Little was a civil rights activist better known by what name?","Malcolm X"],
                ["Manga are a type of comics from what country?","Japan"],
                ["Marie Antoinette was born an Archduchess of what country?","Austria"],
                ["Marie Curie was the first person to win two of what prize?","The Nobel Prize"],
                ["Mark Twains 1885 novel The Adventures of Huckleberry Finn was set along which river?","Mississippi River"],
                ["Mark Zuckerberg was one of the founders of which social networking site?","Facebook"],
                ["Marxist revolutionary Che Guevara was born in what country?","Argentina"],
                ["Mary Mallon was famously an asymptomatic carrier of what disease?","Typhoid fever"],
                ["Menlo Park New Jersey was home to which inventors research laboratory?","Thomas Edison"],
                ["Mexican tortillas were originally made from the grain of which plant?","Corn"],
                ["Militia Company of District II under the Command of Captain Frans Banninck Cocq, by Rembrandt, is better known by what name?","The Night Watch"],
                ["Montevideo is the capital city of which South American country?","Uruguay"],
                ["Most adults have how many canine teeth?","Four"],
                ["Most brands of of the liquor soju are made in which country?","South Korea"],
                ["Mr. Pibb was a soft drink created by the Coca-Cola Company to compete with what other soft drink?","Dr Pepper"],
                ["Napoleon suffered defeat at Waterloo in what year?","1815"],
                ["Native to the coasts of northern & eastern N Pacific Ocean, which marine mammal is the heaviest member of the weasel family?","Sea Otter"],
                ["Natural pearls are found in what sea creature?","Oyster"],
                ["Nellie Bly wrote, What, excepting torture, would produce insanity quicker than this treatment? in her 1887 undercover expose of what type of institution?","An insane asylum (New Yorks Blackwells Island Asylum)"],
                ["New Orleans is known as the birthplace of what type of music?","Jazz"],
                ["New York City was originally known by which Dutch name?","Nieuw Amsterdam (New Amsterdam)"],
                ["Nicholas II, the last Tsar of Russia was said to have been close friends with a mystical faith healer known by what name?","Grigori Rasputin"],
                ["Nintendo is a consumer electronics and video game company founded in what country?","Japan"],
                ["Nolan Bushnell, co-founder of Atari, also founded what pizza chain?","Chuck E. Cheeses"],
                ["Norway was responsible for introducing what fish for raw consumption in Japan?","Salmon"],
                ["Notorious Colombian drug lord Pablo Escobar died in a shootout in what city?","Medellin, Colombia"],
                ["Now extinct, what shark is thought to have been the largest ever on Earth?","Megalodon"],
                ["Of the four rocky planets in our solar system, which is the largest and most dense?","Earth"],
                ["Of the original six space shuttles, which one never flew a mission in space?","Enterprise"],
                ["Officially opened in 1869, what artificial waterway connects the Mediterranean Sea to the Red Sea?","The Suez Canal"],
                ["Oliver Twist was the second novel published by which English author?","Charles Dickens"],
                ["Olympia is the capital city of which U.S. state?","Washington"],
                ["On 16 December 1971, East Pakistan was liberated from Pakistan becoming what newly independent state?","Bangladesh"],
                ["On Jan. 27, 1967, a flash fire swept through the command module of which Apollo mission?","Apollo 1"],
                ["On June 16, 1963, which Soviet cosmonaut became the first woman in space?","Valentina Tereshkova"],
                ["On September 24, 1906 President Theodore Roosevelt established the first US national monument. What was it?","Devils Tower in Wyoming"],
                ["On the Apollo 11 mission, which astronaut stayed in the command module while Neil Armstrong & Buzz Aldrin walked on the moon?","Michael Collins"],
                ["On the Periodic Table of Elements, Hg is the symbol for what element?","Mercury"],
                ["On the periodic table of elements, which element has the shortest name?","Tin"],
                ["On the periodic table, which element has an atomic weight of 1.00794?","Hydrogen"],
                ["On the popular social website Reddit, what does AMA stand for?","Ask Me Anything"],
                ["On what continent would you not find bees?","Antarctica"],
                ["On which popular website do users send tweets?","Twitter"],
                ["One kilobyte is equal to how many bytes?","1024"],
                ["Orcinus orca is the scientific name for which animal?","Killer whale"],
                ["Originally a Viking fishing village, Copenhagen became the capital city of what country?","Denmark"],
                ["Originally from Quebec, what food comes from the local french slang word for a mess?","Poutine"],
                ["Originating in Germany, the Danube River empties into what body of water?","Black Sea"],
                ["Orson Welles provided the voice for which Transformer in The Transformers: The Movie released in 1986?","Unicron"],
                ["Our solar system is located in what galaxy?","The Milky Way Galaxy"],
                ["Paella, a famous rice dish, originated in what country?","Spain"],
                ["Pago Pago is the capitol of what U.S. territory?","American Samoa"],
                ["Papua New Guinea is bordered by which country to the west?","Indonesia"],
                ["Paul Newmans last movie appearance was as a conflicted mob boss in what 2002 movie opposite Tom Hanks?","Road to Perdition"],
                ["Penicillin is used to fight what type of infections?","Bacterial"],
                ["Penicillin was discovered in 1928 by which Scottish scientist?","Sir Alexander Fleming"],
                ["Peri-peri, cayenne and birds eye are all a type of what?","Chili pepper"],
                ["Peter and the Wolf is a musical composition written by which Russian Soviet composer?","Sergei Prokofiev"],
                ["Pho is a popular noodle soup from what country?","Vietnam"],
                ["Polar bears feed mainly on what animal?","Seals"],
                ["Polish composer Frederic Chopin is buried in what city?","Paris"],
                ["Porsche is a brand of car that originated in what country?","Germany"],
                ["Portugal is bordered by what other country?","Spain"],
                ["Prince Humperdinck is the main antagonist of which 1987 fantasy film?","The Princess Bride"],
                ["Prince Rainier III of Monaco married which American actress in April 1956?","Grace Kelly"],
                ["Protesting portrayal of Native Americans in film, Marlon Brando declined an Academy Award for his performance in what movie?","The Godfather"],
                ["Published in 1906, White Fang is a novel about a wolf-dog written by which American author?","Jack London"],
                ["Published in 1978, The World According To Garp was written by which American novelist?","John Irving"],
                ["Published in 2005, The Book Thief is a historical novel by which Australian author?","Markus Zusak"],
                ["Published in 2006, The God Delusion is a book written by which English biologist?","Richard Dawkins"],
                ["Published in 2009, which American writer wrote the science fiction novel Under the Dome?","Stephen King"],
                ["Pump Up the Jam is the 1989 debut studio album by which Belgian dance act?","Technotronic"],
                ["Pupusas, handmade thick stuffed corn tortillas, are a traditional dish from what country?","El Salvador"],
                ["Quasimodo is a fictional character from what novel?","The Hunchback of Notre-Dam"],
                ["Quito is the capital city of which South American country?","Ecuador"],
                ["Rapper Vanilla Ice had a hit song titled Ice Ice Baby, from which other song did Ice Ice Baby sample from?","Under Pressure by Queen and David Bowie"],
                ["Red Vines is a popular brand of what type of candy?","Red licorice"],
                ["Regarding data storage, what does the acronym SSD stand for?","Solid State Drive"],
                ["Released as a single in 1982,A Country Boy Can Survive is a song written & recorded by which American country music artist?","Hank Williams Jr"],
                ["Released in 1941, what is the only Disney animated feature film with a title character that never speaks?","Dumbo"],
                ["Released in 1972, what Carly Simon hit was supposedly written about Warren Beatty?","Youre So Vain"],
                ["Released in 1975, High Voltage is the debut studio album by which hard rock band?","AC/DC"],
                ["Released in 1984 starring Patrick Swayze, was the first movie to receive a PG-13 rating?","Red Dawn"],
                ["Released in 1984, what movie starring Patrick Swayze was the first to receive a PG-13 rating?","Red Dawn"],
                ["Released in 1988 Kokomo is a song by which American rock band?","The Beach Boys"],
                ["Released in 1989, Bleach was the debut studio album by what rock band?","Nirvana"],
                ["Released in 1992, what is the best selling soundtrack album of all time?","The Bodyguard"],
                ["Released on April 5, 1974, what was Stephen Kings first published novel?","Carrie"],
                ["Resistance to Civil Government (Civil Disobedience), is an 1849 essay written by which American author?","Henry David Thoreau"],
                ["Rob Pilatus and Fabrice Morvan were better known as what 1980s musical group?","Milli Vanilli"],
                ["Robert James Bobby Fischer is a famous champion of what game?","Chess"],
                ["Robert Penn Warren received the 1947 pulitzer for what political fiction novel?","All the Kings Men"],
                ["Robin Williams won an Academy Award for best supporting actor in which 1997 film about a South Boston janitor?","Good Will Hunting"],
                ["Rock singer William Bailey is better known by what stage name?","Axl Rose"],
                ["Ron McKernan of the Grateful Dead was commonly known by what nickname?","Pigpen"],
                ["Roquefort is a French blue cheese made from the milk of what animal?","Sheep"],
                ["Rubies and sapphires are both made of what rock-forming mineral?","Corundum"],
                ["Ruling for 64 years, which Queen was the longest-reigning British monarch before Queen Elizabeth II?","Queen Victoria"],
                ["Rutger Hauer played Roy Batty in what 1982 neo-noir science fiction film?","Blade Runner"],
                ["SNES is the acronym for what popular gaming console released in the early 1990s?","Super Nintendo Entertainment System"],
                ["Saab was an automobile manufacturer founded in what country in 1945?","Sweden"],
                ["Saint Patricks Day was originally associated with what color?","Blue"],
                ["San Jose is the capital and largest city of which Central American country?","Costa Rica"],
                ["San Marino is a microstate in Europe completely surrounded by what country?","Italy"],
                ["Sappho was an Archaic Greek poet from which Greek island?","Lesbos"],
                ["Sardinia, the second largest island in the Mediterranean Sea, is an autonomous region of what country?","Italy"],
                ["Saskatchewan is a province of which country?","Canada"],
                ["Sauerkraut is made from what finely cut vegetable?","Cabbage"],
                ["Schrodingers cat is a thought experiment dealing with which type of mechanics?","Quantum Mechanics"],
                ["Sequoia National Park is located in which U.S. state?","California"],
                ["Shinto is the indigenous faith of what country?","Japan"],
                ["Shown before a baseball game in 1941, the worlds first television commercial advertised what product?","Bulova watches"],
                ["Shogun is a 1975 novel written by which Australian novelist?","James Clavell"],
                ["Sicily is the largest island in which sea?","Mediterranean Sea"],
                ["Siddhartha Gautama is believed to be the founder of what religion?","Buddhism"],
                ["Singer-songwriter George Michael, famous for such hits as Faith and Father Figure, passed away in what year?","2016"],
                ["Sinterklaas is the Dutch version of what mythical figure?","Santa Claus (Saint Nicholas)"],
                ["Snickers is a brand name chocolate bar made by which American company?","Mars, Incorporated"],
                ["Snoopy from the comic peanuts is what breed of dog?","Beagle"],
                ["Sodium chloride is most commonly called what?","Salt"],
                ["South Africa completely surrounds which other African nation?","Lesotho"],
                ["SpaceX was founded by what South African-born inventor?","Elon Musk"],
                ["SpaceX, an American aerospace manufacturer was founded in 2002 by which entrepreneur?","Elon Musk"],
                ["Spanish silver dollars, originally called the Spanish peso, were each worth how many Spanish reales?","Eight"],
                ["Spoken by the majority of the population, what is the official language of Iran?","Persian (Farsi)"],
                ["Sri Lanka is surrounded by which ocean?","Indian Ocean"],
                ["Sriracha is type of hot sauce named after a city located in what country?","Thailand"],
                ["Stag Party was the name originally chosen for what popular mens magazine?","Playboy"],
                ["Steve Jobs, Steve Wozniak, and Ronald Wayne founded what company in 1976?","Apple Computer, Inc."],
                ["Stockholm is the capital and largest city of what country?","Sweden"],
                ["Stratus, Cirrus & Cumulus are names for different types of what?","Clouds"],
                ["Stratus, Cirrus and Cumulus are types of what?","Clouds"],
                ["Su Lin was the name given to what type of animal captured in China and brought to the US for the first time in 1936?","Giant Panda"],
                ["Sukiyaki is a popular hot pot dish from what country?","Japan"],
                ["Superman is a fictional superhero from what fictional planet?","Krypton"],
                ["Suriname is a country located on which continent?","South America"],
                ["Sushi is a type of cuisine that originated in what country?","Japan"],
                ["Sydney Carton is the central character in what Charles Dickens novel?","A Tale of Two Cities"],
                ["Tasmania is an isolated island state belonging to which country?","Australia"],
                ["Tenochtitlan, founded in 1324, is now known as what city?","Mexico City"],
                ["The 2006 American romantic comedy Failure to Launch starred which Texas born actor?","Matthew McConaughey"],
                ["The 2006 British-American family adventure drama film Flicka, featured what type of animal?","Horses"],
                ["The Age of Bronze is a life size bronze statue created by which French sculptor?","Auguste Rodin"],
                ["The Alaskan Malamute is a type of what?","Dog"],
                ["The Arabian camel, also called dromedary, has how many humps?","One"],
                ["The Artful Dodger is a character from which novel?","Oliver Twist"],
                ["The Barbie doll was launched in 1959 by which American toy company?","Mattel, Inc"],
                ["The Battle of Jutland was a naval battle that occurred during which war?","World War I"],
                ["The Bill of Rights contains how many of the first amendments to the United States Constitution?","Ten"],
                ["The Black Forest is located in what European country?","Germany"],
                ["The Bonfire of the Vanities is a 1987 satirical novel by which American author and journalist?","Tom Wolfe"],
                ["The Cajun holy trinity of cooking consists of what three vegetables?","Onions, bell peppers and celery"],
                ["The Canadian province of Quebec is bordered to the west by which other province?","Ontario"],
                ["The Carolina Reaper, Dorset Naga, and Trinidad Scorpion are varieties of what kind of edible plant?","Chili pepper (Capsicum annuum)"],
                ["The Centers for Disease Control and Prevention (CDC) is headquartered in which U.S. city?","Atlanta, Georgia"],
                ["The Chihuahua is a breed of dog believed to originate from what country?","Mexico"],
                ["The Commonwealth of the Bahamas gained independence in 1973 from what country?","United Kingdom"],
                ["The Communist Manifesto was written by which two German philosophers?","Karl Marx and Friedrich Engels"],
                ["The Concorde was a supersonic passenger airliner flown by which two airlines?","Air France (AF) and British Airways (BA)"],
                ["The Connecticut Leather Company became what toy company popular in the 1980s for Cabbage Patch Kids and video game consoles?","Coleco"],
                ["The Electoral College in the United States is made up of how many electors?","538"],
                ["The Equator passes through which three countries in South America?","Ecuador, Colombia & Brazil"],
                ["The European Organization for Nuclear Research is known by what four letter acronym?","CERN"],
                ["The Ford Mustang was introduced the public at at the New York Worlds Fair in what year?","1964"],
                ["The French Cote DAzur is known as what in English?","French Riviera"],
                ["The Gettysburg address was a speech given by which U.S. president?","President Abraham Lincoln"],
                ["The Giza Plateau can be found in what country?","Egypt"],
                ["The Grand Canyon is located in which U.S. state?","Arizona"],
                ["The Great Gatsby was written by which author?","F. Scott Fitzgerald"],
                ["The Great Pyramid of Giza is located in what Egyptian city?","Giza"],
                ["The Great Red Spot is a gigantic storm located on which planet in our solar system?","Jupiter"],
                ["The Hagia Sophia is located in what former Byzantine capital?","Istanbul (formerly Constantinople)"],
                ["The Hershey Company, commonly known as Hershey, was founded in which U.S. state?","Pennsylvania"],
                ["The Hoover Dam in the United States is built on what river?","The Colorado River"],
                ["The Hound of the Baskervilles is a crime novel featuring which fictional detective?","Sherlock Holmes"],
                ["The Importance of Being Earnest is a play written by which Irish poet and playwright?","Oscar Wilde"],
                ["The Kingdom of Joseon was founded in 1392 in what country?","Korea"],
                ["The Lone Star State is the nickname for which U.S. State?","Texas"],
                ["The Mexican city of Tijuana borders what U.S city?","San Diego"],
                ["The Nation of Brunei is located on the north coast of which island?","Borneo"],
                ["The Pascaline, invented by Blaise Pascal in the early 17th century, was a mechanical type of what device?","Calculator"],
                ["The Passenger Pigeon, now extinct, was endemic to which continent?","North America"],
                ["The Penny-Farthing, also known as a high wheel, was the first machine to be called a what?","Bicycle"],
                ["The Petronas Twin Towers, the tallest twin towers in the world, are located in what capital city?","Kuala Lumpur"],
                ["The Principality of Monaco is a sovereign city-state bordered on three sides by which country?","France"],
                ["The Punisher is a fictional character appearing in comic books published by which company?","Marvel Comics"],
                ["The RMS Olympic and HMHS Britannic were sister ships to which other British passenger liner?","RMS Titanic"],
                ["The Roman Catholic church La Sagrada Familia, located in Barcelona Spain, was designed by which Catalan architect?","Antoni Gaudi"],
                ["The Roman numeral L stands for what number?","50"],
                ["The Scarlet Letter is a historical fiction novel written by which American author?","Nathaniel Hawthorne"],
                ["The Southern Ocean surrounds which continent?","Antarctica"],
                ["The Spanish Civil War began in what year?","1936"],
                ["The St. Lawrence River forms part of the border between which two countries?","The United States & Canada"],
                ["The Starry Night is an oil on canvas painted by which post-impressionist painter?","Vincent van Gogh"],
                ["The State of Israel was founded in what year?","1948"],
                ["The Statue of Liberty was a gift to the United States from which country?","France"],
                ["The Traveling Wilburys was an English-American group consisting of Bob Dylan, George Harrison, Jeff Lynne, Tom Petty and who?","Roy Orbison"],
                ["The Treachery of Images by Rene Magritte depicts what item above a single line of text?","A pipe"],
                ["The Treaty of Ghent was the peace treaty that ended which war?","The War of 1812"],
                ["The Trout Memo was an espionage guidebook written by what British author during WWII?","Ian Fleming"],
                ["The US military installation Area 51 is located in which state?","Nevada"],
                ["The United Kingdoms withdrawal from the European Union is commonly known as what?","Brexit"],
                ["The United States Constitution replaced what other document on March 4, 1789?","The Articles of Confederation"],
                ["The United States is made up of how many states?","Fifty"],
                ["The United States state of Georgia is famous for what fruit?","The Peach"],
                ["The Van Gogh museum is located in what European capital city?","Amsterdam"],
                ["The Venera space probes, sent to gather information about Venus, were developed by which country?","The Soviet Union (USSR)"],
                ["The Wall of Sound was an enormous public address system designed for what bands live performances in 1974?","The Grateful Dead"],
                ["The Waltz in D-flat major, popularly known as the Minute Waltz, is a piano waltz by which Polish composer?","Frederic Chopin"],
                ["The Yangtze River is entirely located in which country?","The Peoples Republic of China"],
                ["The aardvark is native to which continent?","Africa"],
                ["The adult human skeleton is made of up how many bones?","206"],
                ["The ancient Egyptian symbol Ouroboros depicts a serpent eating what?","Its own tail"],
                ["The ancient Greek statue Ahprodite of Milos, better known as Venus de Milo, is currently on display in what museum?","The Louvre in Paris, France"],
                ["The ancient citadel of Machu Picchu was built by which pre-Columbian empire?","The Inca Empire"],
                ["The archaeological site Gobekli Tepe is located in what country?","Turkey"],
                ["The art and practice of garden cultivation and management is called what?","Horticulture"],
                ["The art of paper folding is known as what?","Origami"],
                ["The assasination that is said to have lead to World War I, occured in what city?","Sarajevo"],
                ["The atmospheric temperature at which water vapor begins to condense and form dew, is called what?","Dew Point"],
                ["The avocado is a tree that is thought to have originated in what country?","Mexico"],
                ["The change in a waves frequency when the source and observer are in motion relative to one another is known as what?","The Doppler Effect (Doppler Shift)"],
                ["The city of Baghdad lies along the banks of which river?","The Tigris River"],
                ["The companies HP, Microsoft and Apple were all started in a what?","Garage"],
                ["The cooking technique that involves submerging food in a liquid at a relatively low temperature is called what?","Poaching"],
                ["The deepest trench in the world, the Mariana Trench, is located in which ocean?","Pacific Ocean"],
                ["The desire to eat strange things that are non-nutritive is known as what?","Pica"],
                ["The dingo is a free ranging dog found mainly in which country?","Australia"],
                ["The dingo is a type of feral dog native to which country?","Australia"],
                ["The duck billed platypus is native to what country?","Australia"],
                ["The epic poem, The Rime of the Ancient Mariner, was written by which English poet?","Samuel Taylor Coleridge"],
                ["The famous Actress Winona Ryder had what last name at birth?","Horowitz"],
                ["The famous American writer Samuel Langhorne Clemens is better known by what pen name?","Mark Twain"],
                ["The fans of Taylor Swift are known as what?","Swifties"],
                ["The fear of being in a commitment or getting married is known as what?","Gamophobia"],
                ["The fictional town of Stoneybrook, Connecticut is the setting for which book series by Ann M. Martin?","The Baby-Sitters Club"],
                ["The filament in an incandescent light bulb is made of what element?","Tungsten"],
                ["The final link of the first transcontinental railroad across the United States was completed in which state?","Utah"],
                ["The first Eurovision song contest was held in what year?","1956"],
                ["The first McDonalds restaurant opened in which U.S. state?","California"],
                ["The first atom bomb was successfully tested in which U.S. state?","New Mexico"],
                ["The first human-made object to land on the moon was launched by what country?","The Soviet Union"],
                ["The first movie of the Fast and Furious franchise was released in what year?","2001"],
                ["The first person shooter video game Doom was first released in what year?","1993"],
                ["The headquarters of the United Nations is located in what city?","New York City"],
                ["The highest mountain on Earth, Mount Everest, is located in which mountain range?","The Himalayas"],
                ["The highest temperature ever recorded in the United States occurred in which State?","California (Greenland Ranch, 134F on July 10, 1913)"],
                ["The inventor Nikola Tesla was born on July 10th 1856 in what modern day country?","Croata"],
                ["The island of Borneo is politically divided among which three countries?","Indonesia, Malaysia and Brunei"],
                ["The island of Cozumel, a popular cruise ship port in the Caribbean, is part of which country?","Mexico"],
                ["The island of Great Britain is made up of what three somewhat autonomous regions?","England, Scotland and Wales"],
                ["The island of Saipan is a commonwealth of which country?","The United States"],
                ["The largest volcano ever discovered in our solar system is located on which planet?","Mars"],
                ["The leaning tower of Pisa is located in which city?","Pisa, Italy"],
                ["The llama is a domesticated camelid that is native to which continent?","South America"],
                ["The longest river in Europe, the Volga river, empties into which body of water?","The Caspian Sea"],
                ["The longest snake ever held in captivity belongs to what species?","Reticulated python"],
                ["The lowest natural temperature ever directly recorded at ground level was measured on what Continent?","Antarctica"],
                ["The malleus, incus and stapes are found in what part of the human body?","The ear"],
                ["The meat of a game animal, such as deer, is called what?","Venison"],
                ["The mens magazine GQ was formerly known by what longer name?","Gentlemens Quarterly"],
                ["The mojito is a traditional rum cocktail from which country?","Cuba"],
                ["The molecule hemoglobin is used in which type of cells?","Red blood cells"],
                ["The name of the popular online battle royale game PUBG, is short for what?","PlayerUnknowns Battlegrounds"],
                ["The novel Don Quixote was written by which famous Spanish novelist?","Miguel de Cervantes"],
                ["The oldest parliament in the world belongs to what country?","Iceland"],
                ["The original Ghostbusters movie was released in June of what year?","1984"],
                ["The original Starbucks was established in 1971 in what U.S. city?","Seattle, Washington"],
                ["The painting La Gioconda is better known by what name?","Mona Lisa"],
                ["The paperboard Chinese takeout box was invented in what country?","The United States"],
                ["The penny-farthing was a popular type of what?","Bicycle"],
                ["The period of European history that lasted from the 14th to the the 17th century is known as what?","The Renaissance"],
                ["The phrase Let them eat cake is commonly attributed to whom?","Queen Marie Antoinette"],
                ["The port city of Luanda is the capital city of which African country?","Angola"],
                ["The process of making cows milk safe for human consumption is called what?","Pasteurization"],
                ["The psychological test of human emotions and personality, using inkblots, is formally known as what?","The Rorschach test"],
                ["The range of frequencies over which electromagnetic radiation extends is known as what?","The electromagnetic spectrum"],
                ["The reaction where two atoms of hydrogen combine to form an atom of helium is called what?","Fusion"],
                ["The red supergiant star Betelgeuse belongs to which constellation?","Orion"],
                ["The scientific unit named after Sir Isaac Newton measures what?","Force"],
                ["The second atomic bomb ever used in war-time was dropped on what city?","Nagasaki"],
                ["The signing of the Paris Peace Accords officially ended direct U.S. involvement in which War?","Vietnam War"],
                ["The silkscreen paintings Campbells Soup Cans and Marilyn Diptych were created in 1962 by which American artist?","Andy Warhol"],
                ["The slogan Just Do It was created in 1988 for which company?","Nike"],
                ["The song Seventy-Six Trombones first appeared in what 1957 musical play?","The Music Man"],
                ["The song Wild Horses was originally released which American country rock group on their 1970 album Burrito Deluxe?","The Flying Burrito Brothers"],
                ["The song Eye of the Tiger by the band Survivor was the theme song for what movie released in 1982?","Rocky III"],
                ["The southernmost part of the US is located in which state?","Hawaii"],
                ["The study of fossils other than anatomically modern humans is known as what?","Paleontology"],
                ["The tallest statue in the world as of 2018, the Spring Temple Buddha, is located in what country?","China"],
                ["The taste that allows us to taste savory foods is called what?","Umami"],
                ["The teddy bear was named after what famous American politician?","Theodore Roosevelt"],
                ["The term wake, kettle, or committee refers to a group of what bird?","Vulture"],
                ["The term deja vu comes from what language?","French"],
                ["The theory that Earths outer shell is divided into plates that glide over the mantle is known as what?","Plate Tectonics"],
                ["The tormented love story, Wuthering Heights, is the only finished novel by which English writer?","Emily Bronte"],
                ["The traditional Peruvian dish cuy is made with what animal?","Guinea Pig"],
                ["The use of chopsticks originated in what country?","China"],
                ["The use of reflected sounds to locate objects is known as what?","Echolocation"],
                ["The worlds fastest growing plant is a species of what?","Bamboo"],
                ["The writer Eric Blair went by what pen name?","George Orwell"],
                ["Thus Spoke Zarathustra: A Book for All and None is a philosophical novel written by which German philosopher?","Friedrich Nietzsche"],
                ["Tierra del Fuego is an archipelago located off the southernmost tip of which continent?","South America"],
                ["Titan, Enceladus, Mimas & Iapetus are just some of the moons orbiting which planet?","Saturn"],
                ["To be legally sold as bourbon, a whiskeys mash must contain at least 51% of what grain?","Corn"],
                ["To celebrate its 30th birthday in 2010, Google placed a playable version of what arcade game on its homepage?","Pac-Man"],
                ["Tom Hanks played Captain Miller in what legendary World War II movie?","Saving Private Ryan"],
                ["Tom yum is a type of hot and sour soup that originated in which country?","Thailand"],
                ["Traditionally, the term caviar refers to the salt-cured roe of which fish?","Sturgeon"],
                ["Trevi fountain is located in the capital city of which European country?","Italy"],
                ["Tuberculosis is a disease caused by bacteria that usually attack which organ?","Lungs"],
                ["Tyler Durden is a fictional character appearing as the central protagonist and antagonist in what 1999 American film?","Fight Club"],
                ["Utah, Colorado, New Mexico and Arizona meet at what U.S. landmark?","Four Corners Monument"],
                ["Valletta is the capital of what Mediterranean country?","Malta"],
                ["Victoria Beckham was a member of which all girl English pop group formed in 1994?","The Spice Girls"],
                ["Victorian writers Charlotte, Emily, and Anne were sisters sharing what last name?","Bronte"],
                ["War and Peace, originally published in 1869, is a novel written by which Russian author?","Leo Tolstoy"],
                ["Wellington is the capital city of which island nation?","New Zealand"],
                ["What 1968 American action thriller, starring Steve McQueen, featured a car chase scene through the streets of San Francisco?","Bullitt"],
                ["What 1982 American science fiction horror film was directed by John Carpenter and starred Kurt Russell?","The Thing"],
                ["What 2013 science fiction blockbuster starred Sandra Bullock and George Clooney?","Gravity"],
                ["What 3 countries do not use the metric system?","Liberia, Myanmar and The United States"],
                ["What African country was officially known as Zaire between 1971 and 1997?","The Democratic Republic of the Congo"],
                ["What American minister and author wrote the self-help book The Power of Positive Thinking?","Norman Vincent Peale"],
                ["What American music duo released the studio album Sounds of Silence in 1966?","Simon & Garfunkel"],
                ["What American punk rock band released their best selling album Dookie in 1994?","Green Day"],
                ["What American singer, songwriter and poet was also known as The Lizard King?","Jim Morrison"],
                ["What American singer-songwriter wrote and first recorded the song Blue Suede Shoes in 1955?","Carl Perkins"],
                ["What British lead singer was born Farrokh Bulsara in 1946?","Freddie Mercury"],
                ["What Broadway musical broke the record for Tony nominations in 2016?","Hamilton (16 nominations)"],
                ["What Byzantine city was renamed Istanbul after being captured by the Ottoman Empire?","Constantinople"],
                ["What Canadian province separates Alaska from the continental United States?","British Columbia"],
                ["What Danish author is considered by many to be the most prolific fairy tale writer?","Hans Christian Andersen"],
                ["What French pastry is made with choux dough, filled with a cream and topped with icing?","eclair"],
                ["What French sculptor created the Statue of Liberty?","Frederic Auguste Bartholdi"],
                ["What German term used in World War II translates to lightning war?","Blitzkrieg"],
                ["What Greek mathematician is considered the founder and father of Geometry?","Euclid"],
                ["What Harvard dropout co-founded Microsoft?","Bill Gates"],
                ["What Italian sculptor and architect is credited with creating the Baroque style of sculpture?","Gian Lorenzo Bernini"],
                ["What Los Angeles landmark was named after a World War II general and inspired a Donna Summer disco hit?","MacArthur Park"],
                ["What U.S. State was the last to lift a ban on interracial marriage, not changing the law until 2000?","Alabama"],
                ["What U.S. national park, located in the Northwest corner of Montana, has the nickname Crown of the Continent?","Glacier National Park"],
                ["What U.S. nonprofit organization sells about 200 million boxes of cookies per year?","The Girl Scouts"],
                ["What U.S. state has the nickname Land of 10,000 Lakes?","Minnesota"],
                ["What US city was the first to host the Olympic Games?","St. Louis, Missouri in 1904"],
                ["What US state has the longest official name?","State of Rhode Island and Providence Plantations"],
                ["What animal has the fastest metabolism?","Hummingbird"],
                ["What animal has the largest ears?","Elephant"],
                ["What animal is the symbol of the United States democratic party?","Donkey"],
                ["What animal was the Sheriff of Nottingham in Disneys Robin Hood?","Gray wolf"],
                ["What are baby beavers called?","Kittens or Kits"],
                ["What are the colors that appear on the flag of France?","Blue, white & red"],
                ["What are the first four digits of Pi?","3.141"],
                ["What are the first names of the lip-syncing musical duo known as Milli Vanilli that earned a Grammy Award in 1990?","Rob and Fab"],
                ["What are the first three words of the bible?","In the beginning"],
                ["What are the five boroughs of New York City?","Manhattan, the Bronx, Queens, Brooklyn, and Staten Island"],
                ["What are the four houses at Hogwarts School of Witchcraft and Wizardry?","Gryffindor, Ravenclaw, Hufflepuff, & Slytherin"],
                ["What are the four main ingredients in beer?","Grain, hops, yeast, and water"],
                ["What are the full names of the four members of the Beatles?","John Lennon, Paul McCartney, George Harrison and Ringo Starr"],
                ["What are the ingredients in a Harvey Wallbanger cocktail?","Vodka, Galliano and orange juice"],
                ["What are the names of the 7 dwarfs from the Disney movie Snow White and the Seven Dwarfs?","Happy, Sleepy, Sneezy, Dopey, Grumpy, Bashful and Doc"],
                ["What are the names of the three fairies in the Disney classic Sleeping Beauty?","Flora, Fauna and Merryweather"],
                ["What are the names of the two actors whose characters get stuck traveling together in the film Trains Planes & Automobiles?","Steve Martin & John Candy"],
                ["What are the only two countries in South America that do not border Brazil?","Chile and Ecuador"],
                ["What are the only two letters of the alphabet that do not appear on the Periodic Table?","J & Q"],
                ["What are the seven base units of measurement in the metric system?","The ampere, the candela, the kelvin, the kilogram, the meter, the mole and the second"],
                ["What are the three main ingredients in the campfire treat known as a smore?","Marshmallow, chocolate and graham cracker"],
                ["What automobile manufacturer was first to implement the assembly line for the mass production of an entire automobile?","Ford Motor Company"],
                ["What band is named after a device featured in William S. Burroughs novel Naked Lunch?","Steely Dan"],
                ["What battle was fought on June 18th, 1815 in present-day Belgium?","The Battle of Waterloo"],
                ["What blood type do you need to be a universal donor?","Type O-"],
                ["What breed of horse is best known for its use in racing?","Thoroughbred"],
                ["What canal connects the Pacific Ocean to the Atlantic Ocean?","The Panama Canal"],
                ["What capital city lies on the Potomac River?","Washington D.C."],
                ["What character is murdered by George in the John Steinbeck novella Of Mice and Men?","Lennie"],
                ["What chemical element gives the blood of a lobster a bluish tint?","Copper"],
                ["What childrens song about aquatic animals was streamed so much in 2019, it hit the Billboard Hot 100?","Baby Shark"],
                ["What city connects two continents?","Istanbul"],
                ["What city in Australia has the highest population?","Sydney"],
                ["What city is most commonly referred to as The City of Light?","Paris, France"],
                ["What city is the capital of Canada?","Ottawa"],
                ["What city is the capital of China?","Beijing"],
                ["What city is the capital of Hungary?","Budapest"],
                ["What city is the capital of India?","New Delhi"],
                ["What city is the capital of the country Turkey?","Ankara"],
                ["What color do you get when you mix yellow and blue?","Green"],
                ["What comic strips final panel depicts a boy and a tiger sledding away?","Calvin and Hobbes"],
                ["What common kitchen item is made up of sodium and chlorine atoms?","Salt"],
                ["What country has the largest land mass?","Russia"],
                ["What country is home to the longest canal in the world?","China (Beijing-Hangzhou Grand Canal)"],
                ["What country is named for its location on the equator?","Ecuador"],
                ["What country was the first to send an object to the surface of the moon?","The Soviet Union"],
                ["What countrys 2010 ban on film worker unions is commonly referred to as the Hobbit law?","New Zealand"],
                ["What countrys current capital city is an anagram of its former capital city?","Japan (Kyoto/Tokyo)"],
                ["What date is Cinco de Mayo celebrated in the United States?","May 5th"],
                ["What day is Thanksgiving celebrated in Canada?","The second Monday of October"],
                ["What did the famous Hollywood sign, located in Los Angeles, originally say?","Hollywoodland"],
                ["What did the letters of the former communist country U.S.S.R. stand for?","Union of Soviet Socialist Republics"],
                ["What digital currency is Satoshi Nakamoto credited with inventing?","Bitcoin"],
                ["What dish, made from crushed durum wheat, is a staple of western North Africa?","Couscous"],
                ["What do letters in the the acronym SCUBA stand for?","Self-Contained Underwater Breathing Apparatus"],
                ["What do the letters C and H stand for in C & H Sugar?","California and Hawaii"],
                ["What do the letters CPU stand for when referring to the brains of a computer?","Central Processing Unit"],
                ["What do the letters HTML, a markup language used to create web pages, stand for?","Hypertext Markup Language"],
                ["What do the letters in the acronym CD-ROM stand for?","Compact Disk Read Only Memory"],
                ["What do the letters of the popular fast food chain KFC stand for?","Kentucky Fried Chicken"],
                ["What do the letters ZIP stand for in the United States postal code?","Zone Improvement Plan"],
                ["What do you call the small image icons used to express emotions or ideas in digital communication?","Emoji"],
                ["What does HTTP stand for in a website address?","HyperText Transfer Protocol"],
                ["What does Roger mean when communicating via radio?","Received"],
                ["What does the Statue of Liberty hold in her right hand?","A torch"],
                ["What does the acronym DNA stand for?","Deoxyribonucleic acid"],
                ["What does the acronym USB stand for when referring to a computer port?","Universal Serial Bus"],
                ["What does the acronym NASA stand for?","National Aeronautics and Space Administration"],
                ["What does the acronym lol stand for when used in phone texts and on the internet?","Laugh out loud"],
                ["What does the online acronym SMH stand for?","Shaking my head"],
                ["What does the B stand for in Lyndon B. Johnson?","Baines"],
                ["What does the E stand for in the name of the American restaurant chain Chuck E. Cheese?","Entertainment"],
                ["What dog breed native to Japan has a name that translates to little brushwood dog?","Shiba Inu"],
                ["What element did Joseph Priestley discover in 1774?","Oxygen"],
                ["What famous actor became Governor of California in 2003?","Arnold Schwarzenegger"],
                ["What famous building would you find located at 1600 Pennsylvania Avenue?","The White House"],
                ["What famous dictator was assassinated on the Ides of March?","Julius Caesar"],
                ["What famous female singer died of alcohol poisoning in 2011 at the age of 27?","Amy Winehouse"],
                ["What famous horse won the Triple Crown in 1973?","Secretariat"],
                ["What famous musician was shot by Mark David Chapman in the year 1980?","John Lennon"],
                ["What fast food franchise has the most worldwide locations?","Subway"],
                ["What female singer had an embarrassing wardrobe malfunction during the Super Bowl XXXVIII halftime show?","Janet Jackson"],
                ["What film did Carol Burnett parody as the character Starlet in a costume made from tassels, drapery, and a curtain rod?","Gone with the Wind"],
                ["What flightless bird is featured on New Zealands one dollar coin?","Kiwi"],
                ["What former NBA player appeared in a Bruce Lee movie?","Kareem Abdul Jabbar in The Game Of Death "],
                ["What former planet was demoted to a dwarf planet in 2006?","Pluto"],
                ["What four states of matter are observable in everyday life?","Solid, Liquid, Gas and Plasma"],
                ["What fruit is thrown at the annual food fight festival held in Bunol, Spain?","Tomato"],
                ["What future U.S. president was stranded on a desert island as a 26-year-old navy lieutenant in 1943?","John F. Kennedy"],
                ["What gives red blood cells their color?","Hemoglobin"],
                ["What group of lakes located in upstate New York are named after a part of the human anatomy?","The finger lakes"],
                ["What happened to British street artist Banksys Girl with Balloon when sold for $1.4m at Sothebys auction house in 2018?","It shredded itself"],
                ["What heavy metal element was once known as quicksilver?","Mercury"],
                ["What hills border Scotland and England?","Cheviot Hills"],
                ["What igneous rock has a density less than water?","Pumice"],
                ["What ingredient in bread causes it to rise?","Yeast"],
                ["What ingredient is added to white sugar to make brown sugar?","Molasses"],
                ["What inland U.S. state has the longest shoreline?","Michigan"],
                ["What inorganic molecule is produced by lightning?","Ozone"],
                ["What is Michael J. Foxs middle name?","Andrew"],
                ["What is Shawshank, in the movie The Shawshank Redemption?","The prison"],
                ["What is a baby rabbit called?","Kitten or Kit for short"],
                ["What is a baby swan called?","A cygnet"],
                ["What is a baby turkey called?","Poult or chick"],
                ["What is a flock of crows called?","A Murder"],
                ["What is a group of lions called?","A pride"],
                ["What is a group of owls called?","A parliament."],
                ["What is a group of rhinoceros called?","A crash"],
                ["What is a group of whales called?","A pod"],
                ["What is a meteor called when it reaches earths surface?","Meteorite"],
                ["What is a traditional fermented Korean side dish made seasoned vegetables and salt?","Kimchi"],
                ["What is it called when a star, possibly cause by a gravitational collapse, suddenly increases greatly in brightness?","Supernova"],
                ["What is known as the master gland of the human body?","The pituitary gland"],
                ["What is largest living bird by wingspan?","Wandering Albatross"],
                ["What is name of the scale used to measure the spicy heat of peppers?","Scoville scale"],
                ["What is name of the worlds largest and most powerful particle accelerator?","The Large Hadron Collider"],
                ["What is the Easternmost point on the North American continent?","Cape Spear, Newfoundland, Canada"],
                ["What is the French culinary term for a dish that has been covered with breadcrumbs or grated cheese and browned?","Au gratin"],
                ["What is the Japanese word that means empty orchestra?","Karaoke"],
                ["What is the Spanish word for a heated tortilla filled with cheese?","Quesadilla"],
                ["What is the acronym for the intergovernmental military alliance based on the North Atlantic Treaty, signed in 1949?","NATO"],
                ["What is the capital city of Australia?","Canberra"],
                ["What is the capital city of Canadas Yukon territory?","Whitehorse"],
                ["What is the capital city of Croatia?","Zagreb"],
                ["What is the capital city of South Korea?","Seoul"],
                ["What is the capital city of the Philippines?","Manila"],
                ["What is the capital of Iceland?","Reykjavik"],
                ["What is the capital of North Korea?","Pyongyang"],
                ["What is the capital of Peru?","Lima"],
                ["What is the capital of Quebec Canada?","Quebec City"],
                ["What is the capital of the Republic of Ireland?","Dublin"],
                ["What is the chemical equation for hydrogen peroxide?","H2O2"],
                ["What is the chemical formula for ozone?","O3"],
                ["What is the chemical symbol for Helium?","He"],
                ["What is the chemical symbol for iron?","Fe"],
                ["What is the chemical symbol for table salt?","NaCl"],
                ["What is the closest star to our own sun?","Proxima Centauri"],
                ["What is the closest star to the planet Earth?","The Sun"],
                ["What is the colloquial term for a rotating tray often often placed on a table to aid in distributing food?","Lazy Susan"],
                ["What is the color of the five stars found on the flag of China?","Yellow"],
                ["What is the common name for stone consisting of the minerals jadeite or nephrite?","Jade"],
                ["What is the farthest human-made object from planet Earth?","Voyager 1"],
                ["What is the fastest bird in the world when in its hunting dive?","Peregrine Falcon"],
                ["What is the fastest fish in the Ocean?","Sailfish"],
                ["What is the fastest land snake in the world?","Black Mamba"],
                ["What is the favorite food of the Teenage Mutant Ninja Turtles?","Pizza"],
                ["What is the fear of clowns called?","Coulrophobia"],
                ["What is the first book of the bible?","Genisis"],
                ["What is the first element on the periodic table?","Hydrogen"],
                ["What is the heaviest naturally occurring element found on Earth?","Uranium (U92)"],
                ["What is the highest mountain when measured from the center of Earth?","Mt. Chimborazo in Ecuador (Due to equatorial bulge)"],
                ["What is the highest number of Michelin stars a restaurant can receive?","Three"],
                ["What is the horseshoe shaped zone along the Pacific rim where approximately 90% of the worlds earthquakes occur called?","Ring of Fire"],
                ["What is the hottest planet in our solar system?","Venus"],
                ["What is the job title of the person in charge of the camera and lighting crews working on a film?","Cinematographer"],
                ["What is the largest 3-digit prime number?","997"],
                ["What is the largest animal currently on Earth?","Blue Whale"],
                ["What is the largest country in North America?","Canada"],
                ["What is the largest country located entirely in Europe?","Ukraine"],
                ["What is the largest internal organ of the human body?","Liver"],
                ["What is the largest island in the Caribbean Sea?","Cuba"],
                ["What is the largest lake in Africa?","Lake Victoria"],
                ["What is the largest ocean on planet Earth?","Pacific Ocean"],
                ["What is the largest organ of the human body?","Skin"],
                ["What is the largest planet in our solar system?","Jupiter"],
                ["What is the largest rodent found in North America?","Beaver"],
                ["What is the largest species of terrestrial crab in the world?","The coconut crab (Birgus latro)"],
                ["What is the longest river in Australia?","The Murray River"],
                ["What is the main ingredient in guacamole?","Avocados"],
                ["What is the main ingredient in thousand island dressing?","Mayonnaise"],
                ["What is the mathematical formula for Newtons Second Law of Motion?","F=ma (Force equals mass times acceleration)"],
                ["What is the medical term for bad breath?","Halitosis"],
                ["What is the melting point of ice in Fahrenheit?","32F"],
                ["What is the most abundant chemical element in the Universe?","Hydrogen"],
                ["What is the most abundant element in the earths atmosphere?","Nitrogen"],
                ["What is the most common blood type in humans?","O+"],
                ["What is the most common type of star found in the Milky Way?","Red Dwarf Star (Our sun is a Yellow Dwarf)"],
                ["What is the most popular board game of all time?","Chess"],
                ["What is the most popular breed of dog in the United States?","Labrador Retriever"],
                ["What is the most visited museum in Europe?","Louvre, Paris, France"],
                ["What is the name for a compound literary or narrative work that is divided into five parts?","Pentalogy"],
                ["What is the name for a confection that consists primarily of sugar or honey and almond meal?","Marzipan"],
                ["What is the name for a dog created by crossing a Labrador Retriever and a Poodle?","Labradoodle or labrapoodle"],
                ["What is the name for a male bee that comes from an unfertilized egg?","Drone"],
                ["What is the name for a mammal that is born incompletely developed and usually carried in the mothers pouch?","Marsupial"],
                ["What is the name for a meat dish made from finely chopped raw beef often served with onion, capers, seasonings and raw egg?","Steak tartare"],
                ["What is the name for a protein that acts as a biological catalyst?","Enzyme"],
                ["What is the name for meteoroids that survive entry through the atmosphere and reach Earths surface?","Meteorites"],
                ["What is the name for the Greek goddess of victory?","Nike"],
                ["What is the name for the branch of mathematics dealing with lengths and angles of triangles?","Trigonometry"],
                ["What is the name for the branch of the French Army created for foreign recruits?","French Foreign Legion (Legion etrangere)"],
                ["What is the name for the disc-shaped region of icy bodies that extend from Neptune to ~55 astronomical units from the Sun?","The Kuiper Belt"],
                ["What is the name for the longest side of a right triangle?","Hypotenuse"],
                ["What is the name for the military nobility and officer caste that existed in medieval and early-modern Japan?","Samurai"],
                ["What is the name for the monetary unit used in Thailand?","Thai Bhat"],
                ["What is the name for the offspring of a male donkey and a female horse?","Mule"],
                ["What is the name for the offspring of a male lion and a female tiger?","Liger"],
                ["What is the name for the pigment found in your skin and hair that gives them color?","Melanin"],
                ["What is the name for the specialized nerve cell that transmits information chemically and electrically throughout the body?","Neuron"],
                ["What is the name for the unit of measurement of power that is roughly equal to 746 watts?","Horsepower"],
                ["What is the name for the upper arm bone found in humans?","Humerus"],
                ["What is the name for trees that never lose their leaves?","Evergreen"],
                ["What is the name given to an ancient analog computer that was discovered by divers off a Greek island in 1900?","Antikythera mechanism"],
                ["What is the name of Mickey Mouses dog?","Pluto"],
                ["What is the name of Washington Irivings 1819 short story about a man that fell asleep in the woods for 20 years?","Rip Van Winkle"],
                ["What is the name of What is the name of the Grateful Deads debut album released in 1967?","The Grateful Dead"],
                ["What is the name of the Spanish islands that lie off the Northwest coast of Africa?","The Canary Islands"],
                ["What is the name of the actress who played the Unsinkable Molly Brown in the 1997 movie Titanic?","Kathy Bates"],
                ["What is the name of the actress who plays Hermione Granger in the Harry Potter series of films?","Emma Watson"],
                ["What is the name of the character played by Johnny Depp in the Pirates of the Caribbean film series?","Captain Jack Sparrow"],
                ["What is the name of the deepest known location in the Earths oceans?","Challenger Deep"],
                ["What is the name of the first album released by American rock band Bon Jovi?","Bon Jovi"],
                ["What is the name of the first pizzeria to open in the United States?","Lombardis Pizza"],
                ["What is the name of the former immigration inspection station located in New York Harbor?","Ellis Island"],
                ["What is the name of the instrument used to measure earthquakes?","Seismometer"],
                ["What is the name of the longest mountain range in North America?","Rocky Mountains"],
                ["What is the name of the main protagonist in the Legend of Zelda series of video games?","Zelda (jk its Link lmao)"],
                ["What is the name of the meringue-based cake believed to have been created in honor of a Russian ballerina?","Pavlova"],
                ["What is the name of the official currency of Costa Rica?","Costa Rican Colon"],
                ["What is the name of the popular Australian food spread used on sandwiches, toast and pastries?","Vegemite"],
                ["What is the name of the sequel to the movie Wreck-It Ralph that was released in 2018?","Ralph Breaks the Internet"],
                ["What is the name of the stock sound effect of a man screaming, used in hundreds of films and television shows?","The Wilhelm Scream"],
                ["What is the name of the worlds highest uninterrupted waterfall and in what country is it located?","Angel Falls, Venezuela"],
                ["What is the national animal of Scotland?","Unicorn"],
                ["What is the national dish of Scotland?","Haggis"],
                ["What is the national language of India?","Hindi"],
                ["What is the natural boundary in North America separating waters that flow into the Atlantic from those into the Pacific?","Continental Divide (Great Divide)"],
                ["What is the official language of Greenland?","Greenlandic"],
                ["What is the oldest city in the United States?","Saint Augustine, Florida"],
                ["What is the only Canadian province without a natural border?","Saskatchewan"],
                ["What is the only U.S. state home to a real royal palace once used by a monarchy?","Hawaii"],
                ["What is the only bird known to be able to fly backwards?","Hummingbird"],
                ["What is the only country that displays the Bible on its national flag?","The Dominican Republic"],
                ["What is the only mammal born with horns?","Giraffe"],
                ["What is the only mammal that can truly fly?","The bat"],
                ["What is the only modern rock n roll song on the Voyager Spacecrafts Golden Records?","Johnny B. Goode, by Chuck Berry"],
                ["What is the only national flag that is not square or rectangular?","The flag of Nepal"],
                ["What is the only sea on Earth with no coastline?","Sargasso Sea"],
                ["What is the only snake in the world that builds a nest for its eggs?","King Cobra"],
                ["What is the only states name that can be typed on one row of keys on a QWERTY keyboard?","Alaska"],
                ["What is the only territory of the mainland Americas that is still part of a European country?","French Guiana"],
                ["What is the only territory of the mainland Americas that still belongs to a European country?","French Guiana"],
                ["What is the perceived decrease in air temperature felt by the body due to the flow of air known as?","Wind chill"],
                ["What is the plural of the word crisis?","Crises"],
                ["What is the primary unit of temperature measurement in the physical sciences?","The Kelvin"],
                ["What is the proper term for a group of parrots?","Pandemonium"],
                ["What is the scientific name of the common potato?","Solanum tuberosum L"],
                ["What is the second largest country by land mass?","Canada"],
                ["What is the second most abundant element in the earths atmosphere?","Oxygen"],
                ["What is the secret identity of the fictional superhero Batman?","Bruce Wayne"],
                ["What is the seventh and final novel of the Harry Potter series?","Harry Potter and the Deathly Hallows"],
                ["What is the slang military term for the distance of one kilometer?","Klick"],
                ["What is the sleepiest animal in the world, sleeping around 22 hours each day?","Koala"],
                ["What is the smallest and most endangered species of sloth?","The pygmy three-toed sloth (Bradypus pygmaeus)"],
                ["What is the smallest planet in our solar system?","Mercury"],
                ["What is the stage name of the member of Public Enemy who would later have a reality dating show?","Flavor Flav"],
                ["What is the tallest building in New York?","One World Trade Center"],
                ["What is the tallest mountain in South America?","Mount Aconcagua, Argentina"],
                ["What is the term for a group of kangaroos?","Mob, troop or court"],
                ["What is the term for the speed that a rocket needs to be traveling to break free of Earths gravity?","Escape Velocity"],
                ["What is the third most abundant gas in Earths atmosphere?","Argon"],
                ["What is the unit of length that is approximately 3.26 light-years?","Parsec"],
                ["What is the white part of the inside of an egg called?","Albumen"],
                ["What is the worlds largest active volcano?","Mauna Loa (Hawaii)"],
                ["What is the worlds largest coral reef system?","The Great Barrier Reef"],
                ["What is the worlds largest ocean?","The Pacific Ocean"],
                ["What is the worlds smallest country?","Vatican City"],
                ["What island does the Statue of Liberty stand on?","Liberty Island"],
                ["What island state was formerly known by the name Formosa?","Taiwan (Republic of China)"],
                ["What language do they speak in Brazil?","Portuguese"],
                ["What late American singer was the mayor of Palm Springs California from 1988 to 1992?","Sonny Bono"],
                ["What late Enter the Dragon star would have been age 32 at the films Hong Kong premiere?","Bruce Lee"],
                ["What later Star Wars actress had an early role in the movie Leon: The Professional?","Natalie Portman"],
                ["What layer of the atmosphere lies between the troposphere and mesosphere?","Stratosphere"],
                ["What luxury British automobile brand was purchased by by Tata motors in 2008?","Jaguar"],
                ["What movie did Elvis Presley first appear in?","Love Me Tender"],
                ["What musical instrument did Sherlock Holmes play?","Violin"],
                ["What musical is the based on the memoir of Maria von Trapp?","The Sound of Music"],
                ["What musician played Cinna in the Hunger Games film series?","Lenny Kravitz"],
                ["What natural phenomena are measured by the Richter scale?","Earthquakes"],
                ["What notable brand of alcohol takes its name from the storied life of a Welsh buccaneer who attacked Panama City in 1671?","Captain Morgan"],
                ["What now retired NBA player starred in the 1996 movie Kazaam?","Shaquille ONeal"],
                ["What painter is famous for cutting off part of his ear?","Vincent Van Gogh"],
                ["What part of the human body contains five metacarpal bones?","The hand"],
                ["What phrase, often used in typing practice, includes every letter in the English alphabet?","The quick brown fox jumps over the lazy dog"],
                ["What planet in our solar system has the longest day?","Venus (243 Earth days)"],
                ["What planet in our solar system has the most gravity?","Jupiter"],
                ["What planet is closest to the sun?","Mercury"],
                ["What planets moons are nearly all named after Shakespearean characters?","Uranus"],
                ["What popular Disney movie is set near Salem, Massachusetts in the years 1693 and 1993?","Hocus Pocus"],
                ["What popular beverage once contained cocaine?","Coca-Cola"],
                ["What popular movie musical, directed by John Hutson, was released in 1982?","Annie"],
                ["What popular soda beverage was originally developed as a mixer for whiskey?","Mountain Dew"],
                ["What private research university was founded in New Haven, Connecticut in 1701?","Yale University"],
                ["What school does Harry Potter attend?","Hogwarts School of Witchcraft and Wizardry"],
                ["What semi-aquatic, egg laying mammal, is native to Australia and Tasmania?","The platypus (Ornithorhynchus anatinus)"],
                ["What song by Michael Jackson contains the lyrics Annie are you OK?","Smooth Criminal"],
                ["What song does Jiminy Cricket famously sing during the opening credits of Pinocchio?","When You Wish Upon a Star"],
                ["What song from the Disney film Coco won the 2018 Academy Award for Best Original Song?","Remember Me"],
                ["What spiny venous fish, common in home aquariums, is an invasive species in the Caribbean Sea and US Atlantic coastal waters?","Lionfish"],
                ["What star of the movie Basketball Diaries did not win his first Oscar until 2016?","Leonardo DiCaprio"],
                ["What sunglasses did Tom Cruise wear in the 1986 movie Top Gun?","Ray Ban Aviator (RB 3025)"],
                ["What takes an average of 8 minutes 20 seconds to reach the Earth?","Light from the sun"],
                ["What term describes the amount of light a planetary body reflects?","Albedo"],
                ["What three countries share a border with North Korea?","China, Russia, and South Korea"],
                ["What three countries were part of the Axis powers in World War II?","German, Italy, and Japan"],
                ["What three planets are closest to the Sun?","Mercury, Venus & Earth"],
                ["What three-digit web error code for censored content is a reference to a Ray Bradbury novel?","451"],
                ["What type of animal is known as the ship of the desert?","Camel"],
                ["What type of bridge is the Golden Gate Bridge?","Suspension"],
                ["What type of number has no factors other than 1 and itself?","Prime Number"],
                ["What type of pasta is commonly known as bow-tie pasta or butterfly pasta?","Farfalle"],
                ["What vitamin is produced when a person is exposed to sunlight?","Vitamin D"],
                ["What was John Candys characters name in the in 1987 comedy movie, Planes, Trains, and Automobiles?","Del Griffith"],
                ["What was Walt Disneys original name for Mickey Mouse before his wife convinced him to change it?","Mortimer Mouse"],
                ["What was first feature length animated film?","El Apostol"],
                ["What was the Roman name for the goddess Hecate?","Trivia"],
                ["What was the first Bond film to win an Oscar for best original song?","Skyfall (with Adele)"],
                ["What was the first capital city of the United States?","Philadelphia"],
                ["What was the first commercial product that had a Barcode?","Wrigleys Juicy Fruit Gum"],
                ["What was the first console video game that allowed the game to be saved?","The Legend of Zelda"],
                ["What was the first country to use printed paper currency?","China"],
                ["What was the first feature film originally presented with sound?","The Jazz Singer, released in 1927"],
                ["What was the first governing document of the Plymouth Colony signed aboard ship on November 11, 1620?","The Mayflower Compact"],
                ["What was the first music video played on MTV?","Video Killed the Radio Star"],
                ["What was the first publicly traded U.S. company to reach a $1 trillion market cap?","Apple"],
                ["What was the first toy advertised on television?","Mr. Potato Head"],
                ["What was the full name of British novelist C. S. Lewis?","Clive Staples Lewis"],
                ["What was the highest selling album of the 1980s in the United States?","Thriller by Michael Jackson"],
                ["What was the name given to the sheep that was the first mammal cloned from an adult cell?","Dolly"],
                ["What was the name of Alexander the Greats horse?","Bucephalus"],
                ["What was the name of Jack Nicholsons character in the 1975 American comedy-drama film One Flew Over the Cuckoos Nest?","Randle McMurphy"],
                ["What was the name of Michael Jacksons first solo album as an adult?","Off The Wall"],
                ["What was the name of Seattle grunge band Nirvanas first album, released in 1989?","Bleach"],
                ["What was the name of Taylor Swifts first album?","Taylor Swift"],
                ["What was the name of The Lone Rangers horse that he saved from an enraged buffalo?","Silver"],
                ["What was the name of cowboy star Roy Rogers palomino horse?","Trigger (originally named Golden Cloud)"],
                ["What was the name of the 1999 American found footage horror film about three student filmmakers who disappeared in the woods?","The Blair Witch Project"],
                ["What was the name of the Eminem single that set the worlds record in 2013 for the most words used in a song?","Rap God"],
                ["What was the name of the London theatre built by Shakespeares playing company in 1599?","The Globe Theatre"],
                ["What was the name of the U.S. mail service, started in 1860, that used horses and riders?","Pony Express"],
                ["What was the name of the U.S. research and development project to create nuclear weapons in WWII?","Manhattan Project"],
                ["What was the name of the currency used in Spain before the euro?","Pesetas"],
                ["What was the name of the first U.S. space station?","Skylab"],
                ["What was the name of the first electronic general-purpose computer?","ENIAC"],
                ["What was the name of the first manmade satellite that was launched into space in 1957?","Sputnik"],
                ["What was the name of the first manned mission to land on the moon?","Apollo 11"],
                ["What was the name of the gorilla shot and killed at the Cincinnati Zoo in 2016 after a 3-y.o. boy fell into the enclosure?","Harambe"],
                ["What was the name of the kleptomaniac monkey in the Disney movie Aladdin?","Abu"],
                ["What was the name of the passenger train service created in 1883 that connected Paris and Constantinople?","The Orient Express"],
                ["What was the name of the ship which Charles Darwin served as a naturalist on for a voyage to S America and around the world?","HMS Beagle"],
                ["What was the nickname for the Hughes H-4 Hercules aircraft that made a single flight in 1947?","Spruce Goose"],
                ["What was the nickname for the four engine B-17 bomber planes used during WWII?","Flying Fortress"],
                ["What was the original flavor of the filling in Twinkies?","Banana cream"],
                ["What was the title of Kayne Wests debut album release in 2004?","The College Dropout"],
                ["What year was Facebook founded?","2004"],
                ["What King of golf lent his name to a mixture of iced tea and lemonade?","Arnold Palmer"],
                ["What fashion capital city is home to Dolce & Gabbana, Prada, and Versace?","Milan, Italy"],
                ["Whats the common term for bovine spongiform encephalopathy, a disease that causes brain and spinalcord degeneration in cows?","Mad cow disease"],
                ["Whats the name of the animated science fiction comedy-drama film released in 2002 about a Hawaiian girl and her unusual pet?","Lilo & Stitch"],
                ["When a drink is served on the rocks, it is served with what?","Ice cubes"],
                ["When adjusted for inflation, which is the highest grossing film of all time?","Gone with the Wind"],
                ["When found on a beer bottle, what does the acronym IPA stand for?","India Pale Ale"],
                ["When found on a vehicles speedometer, what do the letters MPH stand for?","Miles Per Hour"],
                ["When referring to a computer monitor, what does the acronym LCD stand for?","Liquid Crystal Display"],
                ["When referring to a medical imaging technique, what does MRI stand for?","Magnetic resonance imaging"],
                ["When referring to a type of music, what does R&B stand for?","Rhythm and blues"],
                ["When referring to a websites address was does the acronym URL stand for?","Uniform Resource Locator"],
                ["When referring to cables used to transmit audio/video, what does HDMI stand for?","High-Definition Multimedia Interface"],
                ["When referring to computer memory, what does that acronym RAM stand for?","Random Access Memory"],
                ["When referring to phone calls made over the internet, what does the acronym VoIP stand for?","Voice over Internet Protocol"],
                ["When talking about computer memory, what does the acronym ROM stand for?","Read-only memory"],
                ["When there are two full moons in the same month, what is the second one called?","Blue Moon"],
                ["When used in the kitchen, sodium bicarbonate is more commonly known as what?","Baking soda"],
                ["Where did a robot named Spirit remain operational over 2000 sols past its planned 90-sol mission?","Mars"],
                ["Where is the lowest point, on dry land, on the earth located?","The Dead Sea"],
                ["Where was Richard Nixon when he delivered his infamous I am not a crook speech?","Disney World in Orlando, Florida (The Contemporary Resort)"],
                ["Where was the fortune cookie invented?","California"],
                ["Where was the very first Hard Rock Cafe opened?","Piccadilly, London"],
                ["Where would one arrive at the second star to the right, and straight on till morning?","Neverland"],
                ["Where would you find St. Peters Basilica?","Vatican City"],
                ["Which 1979 film included a spaceship called Nostromo?","Alien"],
                ["Which 1993 American science-fiction adventure film had a plot that involved creating a theme park from cloned dinosaurs?","Jurassic Park "],
                ["Which 1997 action thriller film stars Nicolas Cage, John Cusack, and John Malkovich?","Con Air"],
                ["Which American actor performs music under the stage name Childish Gambino?","Donald Glover"],
                ["Which American author wrote the non-fiction novel In Cold Blood?","Truman Capote"],
                ["Which American author wrote the novel The Great Gatsby, published in 1925?","F. Scott Fitzgerald"],
                ["Which American fast-food restaurant franchise has an item on its menu called the Blizzard?","Dairy Queen"],
                ["Which American inventor is generally given credit for the invention of the lightning rod?","Benjamin Franklin"],
                ["Which American writer wrote the narrative poem The Raven?","Edgar Allan Poe"],
                ["Which Apollo 11 crew member did not walk on the moon?","Michael Collins"],
                ["Which British author wrote the popular childrens novel James and the Giant Peach?","Roald Dahl"],
                ["Which Christopher Columbus ship ran aground on his first voyage?","La Santa Maria"],
                ["Which Elton John song did President Donald Trump use to nickname North Korean leader Kim Jong-Un?","Rocket Man"],
                ["Which European country has the longest coastline?","Norway"],
                ["Which French post-Impressionist artist painted A Sunday Afternoon on the Island of La Grande Jatte?","George Suerat"],
                ["Which Irish author wrote the avant-garde comic fiction,Finnegans Wake?","James Joyce"],
                ["Which Olympic sport was featured in the movie Cool Runnings?","Bobsled"],
                ["Which Patriot leader organized the Boston Tea Party in 1773?","Samuel Adams"],
                ["Which President is on the United States 1,000 dollar bill?","Grover Cleveland"],
                ["Which Scandinavian nation lies between Norway and Finland?","Sweden"],
                ["Which South American country is the worlds largest producer of Coffee?","Brazil"],
                ["Which Spanish Island is known as The Island of Eternal Spring?","Tenerife"],
                ["Which Teenage Mutant Ninja Turtle always wears red bandanas?","Raphael"],
                ["Which U.S state located on the eastern seaboard partially falls in the Central Time Zone?","Florida"],
                ["Which U.S. President made the first telephone call to the moon?","Richard Nixon"],
                ["Which U.S. president issued the Emancipation Proclamation?","President Abraham Lincoln"],
                ["Which U.S. president made the first presidential radio broadcast?","Calvin Coolidge"],
                ["Which U.S. president signed Fathers Day into law?","Lyndon B. Johnson"],
                ["Which U.S. state has the motto Live Free or Die on their license plate?","New Hampshire"],
                ["Which US Holiday is celebrated on October 12th?","Columbus Day"],
                ["Which US city has been hit by the most tornadoes?","Oklahoma City"],
                ["Which US president was known as The Great Communicator?","Ronald Regan"],
                ["Which US state has the highest number of colleges and universities?","California"],
                ["Which US state has the nickname the Treasure State?","Montana"],
                ["Which action movie star was the voice of the Iron Giant?","Vin Diesel"],
                ["Which actor played Freddie Mercury in the 2018 film Bohemian Rhapsody?","Rami Malek"],
                ["Which actor played Marty McFly in the 1980s sci-fi classic Back to the Future?","Michael J. Fox"],
                ["Which actor played a FedEX employee that became marooned on an island in the 2000 drama film Cast Away?","Tom Hanks"],
                ["Which actor played the fictional character Dr. Emmett Brown in the Back to the Future trilogy?","Christopher Lloyd"],
                ["Which actor played the main character in the 1990 film Edward Scissorhands?","Johnny Depp"],
                ["Which actor that once played James Bond previously competed in the Mr. Universe bodybuilding competition?","Sean Connery"],
                ["Which actor was the voice of Darth Vader in the original Star Wars films?","James Earl Jones"],
                ["Which actress played identical twins in the 1998 movie remake of The Parent Trap?","Lindsay Lohan"],
                ["Which actress played the character Annie Reed in the 1993 American romantic comedy Sleepless in Seattle?","Meg Ryan"],
                ["Which actress played the role of Mary (adult) in the movie Its a Wonderful Life?","Donna Reed"],
                ["Which animal has the largest brain?","The sperm whale"],
                ["Which animal has the longest tongue relative to its total size?","Chameleon"],
                ["Which animal has the most legs?","Millipede"],
                ["Which animal is the tallest in the world?","Giraffe"],
                ["Which animal was incorrectly rumored to bury its head in the sand when frightened?","Ostrich"],
                ["Which artist created the sculpture The Thinker?","Auguste Rodin"],
                ["Which artist is credited with developing linear perspective?","Brunelleschi"],
                ["Which artist painted American Gothic, a 1930 portrait depicting a farmer and his daughter posing in front of their house?","Grant Wood"],
                ["Which band sang the hit Hey There Delilah, which reached No. 1 on the Billboard Hot 100 in 2007?","Plain White Ts"],
                ["Which bands name is also a reference to a large German airship, cylinderical in shape?","Led Zeppelin"],
                ["Which bird has eyes that are larger than its brain?","Ostrich"],
                ["Which bird is often associated with delivering babies?","Stork"],
                ["Which book holds the record of being the most stolen book from public libraries?","Guinness Book of World Records"],
                ["Which book was famously rejected by 12 publishers before finally being accepted by Bloomsbury?","Harry Potter and The Philosophers Stone"],
                ["Which branch of physics is devoted to the study of heat and related phenomena?","Thermodynamics"],
                ["Which building, completed in 1653 at a cost of 32 million Rupees, took 22 years to build?","The Taj Mahal"],
                ["Which christian missionary is said to have banished all the snakes from Ireland?","Saint Patrick"],
                ["Which city has the largest population in the world?","Tokyo, Japan"],
                ["Which city in the United States is known as the Windy City?","Chicago"],
                ["Which city is located both in Asia and Europe?","Istanbul"],
                ["Which city is traditionally said to be built on seven hills?","Rome"],
                ["Which city served as the capital of the United States from 1785 until 1790?","New York"],
                ["Which continent has the highest human population density?","Asia"],
                ["Which continent is also a country?","Australia"],
                ["Which country and its territories cover the most time zones?","France with 12 time zones"],
                ["Which country financed Christopher Columbus 1492 exploration?","Spain"],
                ["Which country has the longest land border?","China with a land border of 13,743 miles (22,117 km)"],
                ["Which country has the most volcanoes?","The United States"],
                ["Which country is home to the worlds oldest operating amusement park?","Denmark, Dyrehavsbakken amusement park opened in 1583"],
                ["Which country lies on the border between Spain and France?","Andorra"],
                ["Which desert is the largest in the world?","The Antarctic Polar Desert"],
                ["Which element, previously used in the production of felt, lead to the expression mad as a hatter?","Mercury"],
                ["Which elements symbol is the letter K on the periodic table?","Potassium"],
                ["Which event did US President Franklin D. Roosevelt call, A day that will live in infamy?","The Attack on Pearl Harbor, December 7, 1941"],
                ["Which famous American musician was fatally shot by his father on April 1, 1984?","Marvin Gaye"],
                ["Which famous World War II general competed in the Olympics?","George Patton (1912 Stockholm Olympics pentathlon)"],
                ["Which famous singer appeared in the movie Mad Max: Beyond Thunderdome?","Tina Turner"],
                ["Which fast food restaurant chain once tested bubble gum broccoli as a childrens menu item?","McDonalds"],
                ["Which four U.S. states are on the United States-Mexico border?","California, Arizona, New Mexico, and Texas"],
                ["Which gland in the human body regulates metabolism?","Thyroid"],
                ["Which is the closest galaxy to the milky way?","Andromeda galaxy, about 2.5 million light years away"],
                ["Which is the largest of Mars two moons?","Phobos"],
                ["Which is the most abundant metal in the earths crust?","Aluminum"],
                ["Which is the most widely spoken language in the world?","Mandarin Chinese"],
                ["Which late actor starred as Kris Kringle in 1994 film Miracle on 34th Street?","Richard Attenborough"],
                ["Which liquor is made from the blue agave plant?","Tequila"],
                ["Which major battle of WWII started on August 23, 1942 and was fought in what is now the city of Volgograd?","The Battle of Stalingrad"],
                ["Which mammal has the longest gestation period?","Elephant (18 - 22 months)"],
                ["Which marine animal is the only known natural predator of the great white shark?","Orca (killer whale)"],
                ["Which metallic element has a melting point of approximately -38 F (-39 C)?","Mercury"],
                ["Which music group has received the most Grammy Awards?","U2"],
                ["Which musician is often called the fifth Beatle?","Pete Best"],
                ["Which ocean trench is the deepest?","Mariana Trench or Marianas Trench"],
                ["Which of the Beatles is barefoot on the Abbey Road album cover?","Paul McCartney"],
                ["Which of the great lakes does not share a border with Canada?","Lake Michigan"],
                ["Which of the traditional five senses are dolphins believed not to possess?","Smell"],
                ["Which one of the seven ancient wonders of the world is still standing today?","The Great Pyramid of Giza"],
                ["Which painter started the impressionist movement?","Claude Monet"],
                ["Which park is the most filmed location in the world?","Central Park"],
                ["Which planet has the most moons?","Jupiter"],
                ["Which planet in our solar system has an axis that is tilted by 98 degrees?","Uranus"],
                ["Which planet in our solar system has the most oxygen?","Earth"],
                ["Which planet in our solar system spins the fastest?","Jupiter, it rotates once on average in just under 10 hours"],
                ["Which planet is furthest from the sun?","Neptune"],
                ["Which planets moons are nearly all named after Shakespearean characters?","Uranus"],
                ["Which political party promotes individual liberty, free markets, non-interventionism and limited government?","Libertarian"],
                ["Which pop star sang the national anthem at the 50th Super Bowl?","Lady Gaga"],
                ["Which psychologist investigated obedience using electric shocks?","Stanley Milgram"],
                ["Which rapper was born Robert Matthew Van Winkle on October 31, 1967?","Vanilla Ice"],
                ["Which scientist is considered the father of modern genetics?","Gregor Mendel"],
                ["Which sea separates the East African coast and the Saudi Arabian peninsula?","Red Sea"],
                ["Which shark is the biggest?","The whale shark"],
                ["Which singer rose to fame with his adaptation of the song La Bamba in 1958?","Ritchie Valens"],
                ["Which snake, whose untreated bite is almost 100 percent fatal, is the worlds fastest snake on land?","Black Mamba"],
                ["Which state of the United States is the smallest?","Rhode Island"],
                ["Which theorem is a fundamental relation in Euclidean geometry among the three sides of a right triangle?","Pythagorean theorem"],
                ["Which two South American countries do not touch the sea?","Paraguay and Bolivia"],
                ["Which two countries are connected by the Karakoram Pass?","China and India"],
                ["Which two countries share the longest undefended border?","The United States and Canada"],
                ["Which two elements on the periodic table are liquids at room temperature?","Mercury and Bromine"],
                ["Whistler Blackcomb is a popular ski resort located in which country?","Canada"],
                ["Who assassinated President Abraham Lincoln?","John Wilkes Booth"],
                ["Who became both a vice president and president of the United States without ever being elected to either office?","Gerald Ford"],
                ["Who came up with the theories of General and Special relativity?","Albert Einstein"],
                ["Who came up with the three laws of motion?","Sir Isaac Newton"],
                ["Who created the comedy science fiction series, The Hitchhikers Guide to the Galaxy?","Douglas Adams"],
                ["Who declined the 1964 Nobel Prize for literature?","Jean-Paul Sartre"],
                ["Who designed and built the Pascaline?","Blaise Pascal"],
                ["Who developed and patented the electrical telegraph in the United States in 1837?","Samuel Morse"],
                ["Who did William Shakespere marry when he was just 18?","Anne Hathaway"],
                ["Who directed the 1977 movie Star Wars?","George Lucas"],
                ["Who directed the 1980 horror film The Shining?","Stanley Kubrick"],
                ["Who directed the 2018 superhero film Black Panther?","Ryan Coogler"],
                ["Who directed the movie Harry Potter and the Prisoner of Azkaban?","Alfonso Cuaron"],
                ["Who directed the movie Reservoir Dogs?","Quentin Tarantino"],
                ["Who directed the romantic comedy fantasy adventure film The Princess Bride?","Rob Reiner"],
                ["Who gave the state of Florida its name?","Juan Ponce de Leon"],
                ["Who interrupted Taylor Swifts acceptance speech at the 2009 Video Music Awards?","Kanye West"],
                ["Who invented the cotton gin in 1793, allowing for much greater cotton production?","Eli Whitney"],
                ["Who invented the first alternating current (AC) induction motor?","Nikola Tesla"],
                ["Who is considered the father of psychoanalysis?","Sigmund Freud"],
                ["Who is credited to be the first person to circumnavigate the globe?","Ferdinand Magellan"],
                ["Who is credited with inventing the first mechanical computer?","Charles Babbage"],
                ["Who is credited with suggesting the word hello be used when answering the telephone?","Thomas Edison"],
                ["Who is credited with the assassination of American outlaw Jesse James?","Robert Ford"],
                ["Who is generally acknowledged as the father of the modern periodic table?","Russian chemist Dmitri Mendeleev"],
                ["Who is next in line to succeed the President, after the Vice President?","The Speaker of the House"],
                ["Who is often referred to as the father of scuba diving?","Jacques Cousteau"],
                ["Who is remembered for his large and stylish signature on the United States Declaration of Independence?","John Hancock"],
                ["Who is the Canadian singer-songwriter best known for her hit song, Call Me Maybe?","Carly Rae Jepsen"],
                ["Who is the author of The Hobbit and the Lord of the Rings trilogy?","J. R. R. Tolkien"],
                ["Who is the author of the book A Brief History of Time?","Stephen Hawking"],
                ["Who is the author of the novella The Metamorphosis, first published in 1915?","Franz Kafka"],
                ["Who is the current supreme leader of North Korea?","Kim Jong Un"],
                ["Who is the former drummer for Nirvana that went on to become the frontman for the Foo Fighters?","David Grohl"],
                ["Who is the lead singer for the American rock band Pearl Jam?","Eddie Vedder"],
                ["Who is the lead singer for the rock band Guns N Roses?","Axl Rose"],
                ["Who is the oldest person to be elected to the office of President of the United States?","Donald Trump"],
                ["Who is the only US president to serve more than two terms?","President Franklin Delano Roosevelt"],
                ["Who is the voice of Spongebob Squarepants?","Tom Kenny"],
                ["Who led the first expedition to sail around the world?","Ferdinand Magellan"],
                ["Who painted a late 15th-century mural known as the Last Supper?","Leonardo da Vinci"],
                ["Who painted the Sistine Chapel?","Michelangelo"],
                ["Who painted the famous Dutch Golden age painting The Night Watch?","Rembrandt"],
                ["Who played Batman in the 1989 Tim Burton version of the film?","Michael Keaton"],
                ["Who played Dracula in the 1931 vampire-horror film Dracula?","Bela Lugosi"],
                ["Who played James Bond in the 1969 film On Her Majestys Secret Service?","George Robert Lazenby"],
                ["Who played Tom Joad in the 1940 movie The Grapes of Wrath?","Henry Fonda"],
                ["Who played lead guitar for the British rock band Queen?","Brian May"],
                ["Who played the female lead in the 1942 film Casablanca?","Ingrid Bergman"],
                ["Who played the female lead in the 1990 romantic comedy Pretty Woman?","Julia Roberts"],
                ["Who played the female lead in the dystopian political thriller V for Vendetta?","Natalie Portman"],
                ["Who played the female lead role in the 1986 sci-fi movie Aliens?","Sigourney Weaver"],
                ["Who played the fictional anti hero Deadpool in the 2016 movie?","Ryan Reynolds"],
                ["Who played the lead role in the 1982 American comedy Tootsie?","Dustin Hoffman"],
                ["Who played the title character in the teen sitcom musical comedy Hannah Montana?","Miley Cyrus"],
                ["Who plays Jack Ryan in the 2002 American spy thriller The Sum of all Fears?","Ben Affleck"],
                ["Who produced and directed the American epic aviation war film Hells Angels, released in 1930?","Howard Hughes"],
                ["Who recorded the one hit wonder Pass the Dutchie, released in 1982?","Musical Youth"],
                ["Who sang the title song Grease in the 1978 musical motion picture?","Frankie Valli"],
                ["Who sang the version of the song Day-O (The Banana Boat Song) released in 1956?","Harry Belafonte"],
                ["Who served as head of government of Soviet Russia from 1917 to 1922 and of the Soviet Union from 1922 to 1924?","Vladimir Lenin"],
                ["Who served as the first and third president of the Republic of Texas?","Sam Houston"],
                ["Who tapdanced with Jerry the Mouse in Anchors Aweigh, Fred Astaire in Ziegfeld Follies and an umbrella in Singin in the Rain?","Gene Kelly"],
                ["Who was at the top of Forbes 2015 list of the richest people in the world?","Bill Gates"],
                ["Who was awarded the first United States patent for the telephone?","Alexander Graham Bell"],
                ["Who was first U.S. president to be impeached?","Andrew Johnson in 1868"],
                ["Who was president of the United States when bombs were dropped on Hiroshima and Nagasaki?","Harry S. Truman"],
                ["Who was the Prime Minister of Italy during WWII?","Benito Amilcare Andrea Mussolin"],
                ["Who was the Spanish surrealist painter best known for his work The Persistence of Memory?","Salvador Dali"],
                ["Who was the United States leading fighter pilot of WWI with 26 victories?","Eddie Rickenbacker"],
                ["Who was the author of the childrens fantasy novel The Lion, the Witch and the Wardrobe?","C.S. Lewis"],
                ["Who was the author of The Amityville Horror published in 1977?","Jay Anson"],
                ["Who was the captain of the Mayflower when it took the Pilgrims to New England in 1620?","Christopher Jones"],
                ["Who was the female lead in the movie Titanic?","Kate Winslet"],
                ["Who was the first First Lady to be elected to public office?","Hillary Rodham Clinton"],
                ["Who was the first NASA austronaut to visit space twice?","Gus Grissom"],
                ["Who was the first Roman Catholic to be Vice President of the United States of America?","Joe Biden"],
                ["Who was the first Tudor monarch in England?","Henry VII"],
                ["Who was the first U.S. president that was born a citizen of the United States?","Martin Van Buren"],
                ["Who was the first US President to declare war?","James Madison"],
                ["Who was the first billionaire in the United States?","John D. Rockefeller"],
                ["Who was the first cartoon character to get his own star on Hollywood Boulevards Walk of Fame?","Mickey Mouse, on November 13, 1978"],
                ["Who was the first emperor of China?","Qin Shi Huang (born Ying Zheng)"],
                ["Who was the first female Prime Minister of a European country?","Margaret Thatcher "],
                ["Who was the first human to travel into space?","Yuri Gagarin"],
                ["Who was the first man to appear on the cover of Playboy Magazine?","Peter Sellers, April 1964 issue"],
                ["Who was the first man to appear solo on the cover of Playboy?","Hugh Hefner (after his death)"],
                ["Who was the first man to set foot on the moon?","Neil Armstrong"],
                ["Who was the first performer at the 1969 Woodstock festival?","Richie Havens"],
                ["Who was the first person selected as Time Magazines Man of the Year?","Charles Lindbergh in 1927"],
                ["Who was the first person to climb Mount Everest?","Sir Edmund Hillary"],
                ["Who was the first president of the United States to live in the White House?","President John Adams"],
                ["Who was the first queen of England?","Mary I"],
                ["Who was the first woman pilot to fly solo across the Atlantic?","Amelia Earhart"],
                ["Who was the first woman to be inducted into the Rock and Roll Hall of Fame?","Aretha Franklin"],
                ["Who was the guitarist for the British rock band Cream?","Eric Clapton"],
                ["Who was the host of the American travel and food show No Reservations?","Anthony Bourdain"],
                ["Who was the king of Britain during the American revolutionary war?","George III"],
                ["Who was the last man to walk on the moon?","Captain Eugene Cernan"],
                ["Who was the last queen of France prior to the French revolution?","Marie Antoinette"],
                ["Who was the lead singer for the rock and roll band The Crickets?","Buddy Holly"],
                ["Who was the lead singer of the band Audioslave?","Chris Cornell"],
                ["Who was the lead singer of the rock band Queen?","Freddie Mercury"],
                ["Who was the male lead in the 1996 summer blockbuster Independence Day?","Will Smith"],
                ["Who was the mayor of New York City during the September 11 attacks in 2001?","Rudy Giuliani"],
                ["Who was the oldest member of the rock band The Beatles?","Ringo Starr"],
                ["Who was the oldest person to sign the Declaration of Independence?","Benjamin Franklin"],
                ["Who was the only bachelor to serve as president of the United States?","James Buchanan"],
                ["Who was the original singer for the American punk rock band The Misfits?","Glenn Danzig"],
                ["Who was the second president of the United States?","John Adams"],
                ["Who was the tallest actor ever to win an academy award?","Tim Robins in 2003 for Best Supporting Actor in Mystic River"],
                ["Who was the vice president that served under President Barack Obama?","Joe Biden"],
                ["Who was vice president of the United States when Lincoln was assassinated?","Andrew Johnson"],
                ["Who were the first two astronauts that landed on the moon in 1969?","Neil Armstrong and Buzz Aldrin"],
                ["Who were the two writers of the screenplay for the 1968 film 2001: A Space Odyssey?","Stanley Kubrick & Arthur C. Clarke"],
                ["Who won more Academy Awards in his lifetime than any other person?","Walt Disney"],
                ["Who won the Nobel Prize for Literature in 2016?","Bob Dylan"],
                ["Who won the nomination of the Democratic Party to run for president in 2016?","Hillary Clinton"],
                ["Who wrote an ancient Chinese military treatise known as The Art of War?","Sun Tzu"],
                ["Who wrote and recorded the one hit wonder Spirit in the Sky released in late 1969?","Norman Greenbaum"],
                ["Who wrote the 1936 novel Gone with the Wind?","Margaret Mitchell"],
                ["Who wrote the American realist novel The Grapes of Wrath?","John Steinbeck"],
                ["Who wrote the Pledge of Allegiance of the United States?","Francis Bellamy"],
                ["Who wrote the fairy tale The Ugly Duckling?","Hans Christian Andersen"],
                ["Who wrote the novel Moby-Dick?","Herman Melville"],
                ["Who wrote the novel To Kill a Mockingbird, published in 1960?","Harper Lee"],
                ["Who wrote the young adult vampire-romance novel Twilight?","Stephenie Meyer"],
                ["Who wrote The Little Mermaid?","Hans Christian Andersen"],
                ["Whose autobiography, Total Recall, refers to his movie career and election to public office?","Arnold Schwarzenegger"],
                ["With a latitude of 41 17 South, what is the southernmost capital city in the world?","Wellington, New Zealand"],
                ["With over 17 million units produced, what was the highest selling single model of personal computer ever?","The Commodore 64"],
                ["With twelve Oscar nominations and three wins, who is the most nominated male actor in Academy Awards history?","Jack Nicholson"],
                ["World War I flying ace Manfred von Richthofen is known by what nickname?","The Red Baron"],
                ["Wrangell-St. Elias, the largest national park in the U.S., is located in which state?","Alaska"],
                ["Yerevan, one of the worlds oldest continuously inhabited cities, is the capital of what country?","Armenia"],
                ["Zack de la Rocha is the vocalist for what American rock band formed in 1991?","Rage Against the Machine"],
                ["A Diamond is Forever is a famous advertising slogan created in 1947 for what company?","De Beers"],
                ["A la Crecy is a French cooking term that describes a dish made or garnished with what?","Carrots"],
                ["After all, tomorrow is another day! was the last line from which 1939 Oscar winning film?","Gone with the Wind"],
                ["All Shook Up is a song that topped the U.S. Billboard Hot 100 on April 13, 1957. Who was the singer?","Elvis Presley"],
                ["Being and Time is an ontological treatise written by which German philosopher?","Martin Heidegger"],
                ["Big Man on Mulberry Street is a jazz influenced song by which American singer-songwriter?","Billy Joel"],
                ["Call me Ishmael is the opening line from what novel?","Moby Dick"],
                ["Cats in the Cradle is a 1974 folk rock song by which American singer-songwriter?","Harry Chapin"],
                ["Come On Down, a 2001 single recorded by Crystal Waters, samples the theme song from which American game show?","The Price Is Right"],
                ["Dazzle is a term used for a group of what type of animal?","Zebra"],
                ["Granny Smith is a popular type of which fruit?","Apple"],
                ["Hallelujah is a song written by which Canadian recording artist?","Leonard Cohen"],
                ["I was working part time at a five and dime. My boss was Mr. McGee are lyrics from which song by Prince?","Raspberry Beret"],
                ["If I Had $1000000 is a song by which Canadian musical group?","Barenaked Ladies"],
                ["Its an ugly planet, a bug planet is a line from what 1997 American satirical military science fiction film?","Starship Troopers"],
                ["Id buy that for a dollar, is a catchphrase from what 1987 action movie set in Detroit, Michigan, in the near future?","Robocop"],
                ["Love on the Rocks is a song written by Neil Diamond and Gilbert Becaud that appeared in what 1980 drama film?","The Jazz Singer"],
                ["Michael Keaton played which Spiderman villain in the 2017 superhero movie Spiderman: Homecoming?","Vulture"],
                ["My Heart Will Go On by Celine Dion was the theme song for which 1997 blockbuster film?","Titanic"],
                ["Oro y Plata (Spanish for gold and silver) is the motto of which U.S. state?","Montana"],
                ["Parachutes, released in 2000, was the debut album of what British rock band?","Coldplay"],
                ["Stairway to Heaven a song by English rock band Led Zeppelin was originally released on which of their albums?","Their untitled fourth studio album commonly referred to as Led Zeppelin IV"],
                ["The road to greatness can take you to the edge, is the tagline of which 2014 American drama film?","Whiplash"],
                ["What a Wonderful World is a jazz song first recorded by which American singer?","Louis Armstrong"]
            ]
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
            name: "Send backwards message",
            short: "/flip [message]",
            regex: /^flip ?(.+)?/i,
            callback: function(msg) {
                if(!msg) {
                    log("Type "+this.short);
                }
                else {
                    sock.chat(msg.split("").reverse().join(""));
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
                        msg: "\u00AD",
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
                    default: ["Chef"]
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
            name: "Calculate",
            regex: /^(?:calc|math|calculat?) (.+)/,
            callback: function(data, what) {
                if(/[^-()\d/*+.]/g.test(what)===false) {
                    function calc(fn) {
                        return new Function('return ' + fn)();
                    };
                    try {
                        sock.chat(calc(what));
                    }
                    catch(err) {
                        sock.chat("This cannot be calculated.");
                    }
                }
                else {
                    sock.chat("This cannot be calculated.");
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
                    if(who===user) {
                        sock.chat("On second thought, I'm no longer working for you.", data.user);
                        sock.vote(master, "gun");
                        sock.vote(master, "knife");
                        sock.vote(master, data.meet);
                        master="";
                    }
                    else {
                        sock.chat("I will kill "+who+", sir.");
                        sock.vote(who, "gun");
                        sock.vote(who, "knife");
                        sock.vote(who, data.meet);
                    }
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
                    if(who===user) {
                        sock.chat("On second thought, I'm no longer working for you.", data.user);
                        sock.vote(master, "gun");
                        sock.vote(master, "knife");
                        sock.vote(master, data.meet);
                        master="";
                    }
                    else {
                        sock.chat("I say this fellow should head to the gallows!");
                        sock.vote(who, data.meet);
                    }
                }
            }
        },
        {
            name: "Shoot",
            regex: /^shoot (\w+)/i,
            callback: function(data, who) {
                if(data.user===master) {
                    if(who===user) {
                        sock.chat("On second thought, I'm no longer working for you.", data.user);
                        sock.vote(master, "gun");
                        sock.vote(master, "knife");
                        sock.vote(master, data.meet);
                        master="";
                    }
                    else {
                        sock.chat("I'll give "+who+" a few seconds before I shoot them with my hand cannon.");
                        setTimeout(function() { sock.vote(who, "gun");
                                               sock.chat("Another one bites the dust!");
                                              },5000
                                  );
                    }
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
                    if(who===user) {
                        sock.chat("On second thought, I'm no longer working for you.", data.user);
                        sock.vote(master, "gun");
                        sock.vote(master, "knife");
                        sock.vote(master, data.meet);
                        master="";
                    }
                    else {
                        sock.chat("Nobody can beat my dagger-throwing skills. Let's see if I hit bulls-eye again.", who);
                        setTimeout(function() { sock.vote(who, "knife");
                                               sock.chat("You put up a valiant fight, but justice will always prevail!");
                                              },5000
                                  );
                    }
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
                    if(who===user) {
                        sock.chat("Sir, that is an impossibility.", data.user);
                    }
                    else {
                        sock.chat("I can throw a snowball as well as I can a dagger. Prepare to be iced!", who);
                        setTimeout(function() { sock.vote(who, "snowball");
                                               sock.chat("Stun the enemy before you attack, as I always say!");
                                              },5000
                                  );
                    }
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