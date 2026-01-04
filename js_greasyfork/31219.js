// ==UserScript==
// @name         FreddyAgar.pe.hu
// @namespace    Beta!@!
// @version      3.4
// @description  UPDATED
// @author       Freddy
// @match       *.gaver.io/*
// @match       *.agar.bio/*
// @match       *.mgar.io/*
// @match       *.gota.io/*
// @match       *.cellcraft.io/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/31219/FreddyAgarpehu.user.js
// @updateURL https://update.greasyfork.org/scripts/31219/FreddyAgarpehu.meta.js
// ==/UserScript==
	function httpGet(theUrl) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", theUrl, false); // false for synchronous request
		xmlHttp.send(null);
		return xmlHttp.responseText;
	}

console.log('Connection Established');

fokseBotServer = 'gota-artem-freddytube.c9users.io:8081'; // server connection
setTimeout(function() {
    window.__WebSocket = window.WebSocket;
    window.fakeWebSocket = function(){
        return {
            readyState: 0
        };
    };
    window._WebSocket = window.WebSocket = function(ip){
        return new window.fakeWebSocket(ip);
    };
    window.__botclonsData = {};
    window.__botclonsData.mx = 0;
    window.__botclonsData.my = 0;
    window.__botclonsData.ml = 0;
    window.__botclonsData.ma = 0;
    window.__botclonsData.mb = 0;
    window.__botclonsData.wa = false;
    window.__botclonsData.sa = false;
    window.__botclonsData.w = null;
    window.__botclonsData.s = null;
    window.__botclonsData.aX = -1;
    window.__botclonsData.aY = -1;
    window.__botclonsData.p = 0;
    window.__botclonsData.q = false;
    window.__botclonsData.socketaddr = null;
    window.addEventListener("load",function(){
        // êîن èيوهêٍèيمà
        if(!window.OldSocket)
        OldSocket = window.__WebSocket;
        window._WebSocket = window.WebSocket = window.fakeWebSocket = function(ip){
        var ws = new OldSocket(ip);
        ws.binaryType="arraybuffer";
        var fakeWS = {};
        for(var i in ws)
            fakeWS[i] = ws[i];
        fakeWS.send = function(){
        //console.log("ïهًهُâàٍèëè ïهًهنà÷َ! " + arguments[0]);
        var msg = new DataView(arguments[0]);
                if ((msg.byteLength > 0) && (msg.getUint8(0) != 16)) {
                    var f = "";

                    for (var i = 0; i < msg.byteLength; i++) {
                        var a = msg.getUint8(i);
                        f = f + a + " ";
                    }
                    console.log(f);
                } else {
                    window.__botclonsData.mx = msg.getInt16(1, true);
                    window.__botclonsData.my = msg.getInt16(3, true);
                    window.__botclonsData.ml = msg.byteLength;
                }


        if(msg.byteLength==21){ // Most clones
            if(msg.getInt8(0, true) == 16){
                window.__botclonsData.mx = msg.getFloat64(1, true);
                window.__botclonsData.my = msg.getFloat64(9, true);
                window.__botclonsData.ml = msg.byteLength;
            }
        } else {
            if(msg.byteLength==13){ // Agar.re, agarioforums.io, alis.io
            if(msg.getUint8(0, true) == 16){
                window.__botclonsData.mx = msg.getInt32(1, true);
                window.__botclonsData.my = msg.getInt32(5, true);
                window.__botclonsData.ml = msg.byteLength;
            }else{
                if(msg.byteLength>4){ // gota.io
                                /*if(msg.getUint8(0, true) == 16){
                                    window.__botclonsData.mx = msg.getInt16(1, true);
                                    window.__botclonsData.my = msg.getInt16(3, true);
                                    window.__botclonsData.ml = msg.byteLength;
                                }*/
            }
            }
            }
        }
        return ws.send.apply(ws, arguments);
        };
        ws.onmessage = function(){
        //console.log("ïهًهُâàٍèëè ïًèهى! " + arguments[0].data);
        var msg = new DataView(arguments[0].data);
            if(msg.byteLength>16){ // Most clones
            if(msg.getUint8(0, true) == 64){
                window.__botclonsData.ma = msg.getFloat64(1, true);
                window.__botclonsData.mb = msg.getFloat64(9, true);
            }
                }
        if (fakeWS.onmessage && fakeWS.onmessage.apply(ws, arguments));
        };
        ws.onopen = function(){
        window.__botclonsData.socketaddr = ws.url;
        //console.log("ïهًهُâàٍèëè ïîنêë÷هيèه!");
        fakeWS.readyState = 1;
        fakeWS.onopen.apply(ws, arguments);
        };
        ws.onclose = function(){
        fakeWS.onclose.apply(ws, arguments);
        };
        return fakeWS;
        };
        if(location.origin=="http://mgar.io")connect("");
    });
    var real_minx = -7071;
    var real_miny = -7071;
    var real_maxx = 7071;
    var real_maxy = 7071;
    var lastsent = {
        minx: 0,
        miny: 0,
        maxx: 0,
        maxy: 0
    };

    function valcompare(Y, Z) {
        return 0.01 > Y - Z && -0.01 < Y - Z;
    }
    var socket = io.connect('ws://'+ fokseBotServer);
    var canMove = true;
    var movetoMouse = true;
    var moveEvent = new Array(2);
    var canvas = document.getElementById("canvas");
    last_transmited_game_server = null;
    socket.on('force-login', function(data) {
        socket.emit("login", {
            "uuid": client_uuid,
            "type": "client"
        });
        transmit_game_server();
    });

    $( "#canvas" ).after( "<div style='background-color: #fffffff; -moz-opacity: 0.4; -khtml-opacity: 0.4; opacity: 0.8; filter: alpha(opacity=40); zoom: 1;border: 0px solid rgb(255, 255, 255); border-radius: 0px; top: 20px; left: 880px; display: block; position: absolute; text-align: center; font-size: 15px; color: #6D1CBD; padding: 5px; font-family: Arial Black;'> <div style='color:#6D1CBD; -moz-opacity:1; -khtml-opacity: 1; opacity:1; filter:alpha(opacity=100); padding: 10px;'><a>FreddyAgar.pe.hu</a></div> <div style='color:#00FF23; display: inline; -moz-opacity:1; -khtml-opacity: 1; opacity:1; filter:alpha(opacity=100); padding: 10px;'><br>Bots: <a id='minionCount' > </a><br>Z <a id='Zp3Kq0LbYe7Plw1-chatSpam'>- HELP</a> </div> <div style='color:#FF0000; display: inline; -moz-opacity:1; -khtml-opacity: 1; opacity:1; filter:alpha(opacity=100); padding: 10px;'> </a><br>C <a id='Zp3Kq0LbYe7Plw1-chatHelp'>- SPAM</a> </div> <div style='color:#FF0000; display: inline; -moz-opacity:1; -khtml-opacity: 1; opacity:1; filter:alpha(opacity=100); padding: 10px;'> </div>" );
   socket.on('spawn-count', function(data) {
        document.getElementById('minionCount').innerHTML = data;
    });
    var client_uuid = localStorage.getItem('client_uuid');
    if (client_uuid == null) {
        console.log("generating a uuid for this user");
        client_uuid = ""; var ranStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var ii = 0; ii < 15; ii++) client_uuid += ranStr.charAt(Math.floor(Math.random() * ranStr.length));
        localStorage.setItem('client_uuid', client_uuid)
    }
    socket.emit("login", client_uuid);
    $("#instructions").replaceWith('<br><div class="input-group"><span class="input-group-addon" id="basic-addon1">ID</span><input type="text" value="' + client_uuid + '" readonly class="form-control"</div>');
    function isMe(cell) {
        for (var i = 0; i < window.agar.myCells.length; i++) {
            if (window.agar.myCells[i] == cell.id) {
                return true
            }
        }
        return false
    }

    function getCell() {
        var me = [];
        for (var key in window.agar.allCells) {
            var cell = window.agar.allCells[key];
            if (isMe(cell)) {
                me.push(cell);
            }
        }
        return me[0];
    }

    function emitPosition() {
        console.log(client_uuid);
        document.getElementById('Target').innerHTML=(~~(window.__botclonsData.mx-window.__botclonsData.ma))+","+(~~(window.__botclonsData.my-window.__botclonsData.mb));
        socket.emit("pos", {
            "x": window.__botclonsData.mx-window.__botclonsData.ma,
            "y": window.__botclonsData.my-window.__botclonsData.mb,
            "l": window.__botclonsData.ml,
            "p": window.__botclonsData.p,
            "c": window.__botclonsData.q
        });
    }

    function toggleMovement() {
        canMove = !canMove;
        switch (canMove) {
            case true:
                canvas.onmousemove = moveEvent[0];
                moveEvent[0] = null;
                canvas.onmousedown = moveEvent[1];
                moveEvent[1] = null;
                break;
            case false:
                canvas.onmousemove({
                    clientX: innerWidth / 2,
                    clientY: innerHeight / 2
                });
                moveEvent[0] = canvas.onmousemove;
                canvas.onmousemove = null;
                moveEvent[1] = canvas.onmousedown;
                canvas.onmousedown = null;
                break;
        }
    }
    interval_id = setInterval(function() {
        emitPosition();
    }, 100);
    interval_id2 = setInterval(function() {
        transmit_game_server_if_changed();
    }, 5000);
    document.addEventListener('keydown', function(e) {
        var key = e.keyCode || e.which;
        switch (key) {
            case 16:
                if(!window.__botclonsData.sa){
                    window.__botclonsData.sa=true;
                window.__botclonsData.s = setInterval(function() {
                    $("body").trigger($.Event("keydown", {
                        keyCode: 32
                    }));
                    $("body").trigger($.Event("keyup", {
                        keyCode: 32
                    }));
                }, 10);
                }
                break;
            case 87:
                if (!window.__botclonsData.wa) {
                    window.__botclonsData.wa = true;
                    window.__botclonsData.w = setInterval(function() {
                        $("body").trigger($.Event("keydown", {
                            keyCode: 87
                        }));
                        $("body").trigger($.Event("keyup", {
                            keyCode: 87
                        }));
                    }, 10);
                }
                break;
                case 65:
                window.__botclonsData.p--;
                document.getElementById('ismoveToMouse').innerHTML = window.__botclonsData.p;
                break;
            case 67:
                window.Zp3Kq0LbYe7Plw1.chatMessage=prompt("Enter the message to spam:","");
                if(window.Zp3Kq0LbYe7Plw1.chatMessage===null)window.Zp3Kq0LbYe7Plw1.chatMessage="";if(window.Zp3Kq0LbYe7Plw1.chatMessage===""){document.getElementById("Zp3Kq0LbYe7Plw1-chatHelp").innerHTML = "<span class='label label-danger'>C</span>";}else{document.getElementById("Zp3Kq0LbYe7Plw1-chatSpam").innerHTML = "<span class='label label-success'>C</span>";}
                break;
            case 90:
                window.Zp3Kq0LbYe7Plw1.chatMessage=prompt("Press E to split bot. Press R to feed from bot:","");
                if(window.Zp3Kq0LbYe7Plw1.chatMessage===null)window.Zp3Kq0LbYe7Plw1.chatMessage="";if(window.Zp3Kq0LbYe7Plw1.chatMessage===""){document.getElementById("Zp3Kq0LbYe7Plw1-chatHelp").innerHTML = "<span class='label label-danger'>Z</span>";}else{document.getElementById("Zp3Kq0LbYe7Plw1-chatHelp").innerHTML = "<span class='label label-success'>Z</span>";}
                break;
            case 69:
                socket.emit("cmd", {
            "name": "split"
        });
                break;
            case 82:
                socket.emit("cmd", {
            "name": "eject"
        });
                break;
            case 80:
                window.__botclonsData.p++;
                document.getElementById('ismoveToMouse').innerHTML = window.__botclonsData.p;
                break;
        }
    });
    document.addEventListener('keyup', function(e) {
        var key = e.keyCode || e.which;
         console.log(key);
        switch (key) {
            case 87:
                clearInterval(window.__botclonsData.w);
                window.__botclonsData.wa=false;
                break;
            case 16:
                clearInterval(window.__botclonsData.s);
                window.__botclonsData.sa=false;
                break;
        }
    });

    function transmit_game_server_if_changed() {
        if (last_transmited_game_server != window.__botclonsData.socketaddr) {
            transmit_game_server();
        }
    }

    function transmit_game_server() {
        last_transmited_game_server = window.__botclonsData.socketaddr;
        socket.emit("cmd", {
            "name": "connect_server",
            "ip": window.__botclonsData.socketaddr,
            "origin": location.origin
        });
    }
    var mouseX = 0;
    var mouseY = 0;
    $("body").mousemove(function(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
}, 1000); // Core Voltage