// ==UserScript==
// @name         GreatBots.ga Script
// @namespace    Wut
// @version      v3.0
// @description  New Cellcraft Best Bots!
// @match       *.5bz.esy.es/*
// @match       http://ugar.pw/
// @match       http://forceagar.com/
// @match       *.3rb.be/*
// @match       *.flaresserver.tk/*
// @match       http://splits.ga/
// @match       *.cellcraft.io/*
// @match       *.agar.pro/*
// @match       http://louisagar.pw/
// @match       *.cellcraft.io/*
// @match       http://ftbots.ml/
// @match       *.agarios.com/*
// @match       *.agarz.com/*
// @match       *.mgar.io/*
// @match       *.agariogame.club/*
// @match       *.old.ogarul.io/*
// @match       *.agarly.com/*
// @match       *.bubble.am/*
// @match       *.gota.io/*
// @match       *.vincebots.ovh/*
// @match       *.agariohub.net/*
// @match       *.agarserv.com/*
// @match       *.agarioservers.ga/*
// @match       *.alis.io/*
//@match        http://astr.io/
// @match       *.agarioplay.org/*
// @match       *.agario.city/*
// @match       *.germs.io/*
// @match       *.agarioforums.io/*
// @match       *.agariofun.com/*
// @match       *.agar.pro/*
// @match       *.agarabi.com/*
// @match       *.warball.co/*
// @match       *.agariom.net/*
// @match       *.agar.re/*
// @match       *.www.agardark.com/*
// @match       *.easyagario.com/*
// @match       *.playagario.org/*
// @match       *.agariofr.com/*
// @match       http://ftserver.tk/
// @match       *.agariowun.com/*
// @match       *.agarios.org/*
// @match       *.agariowun.com/*
// @match       *.usagar.com/*
// @match       *.agarioplay.com/*
// @match       *.privateagario.net/*
// @match       *.agariorage.com/*
// @match       *.blong.io/*
// @match       *.agar.blue/*
// @match       *.agar.bio/*
// @match       *.agario.se/*
// @match       *.nbkio.com/*
// @match       *.agariohit.com/*
// @match       *.agariomultiplayer.com/*
// @match       *.agariogameplay.com/*
// @match       *.agariowow.com/*
// @match       *.bestagario.net/*
// @match       *.tytio.com/*
// @match       *.kralagario.com/*
// @match       *.agario.zafer2.com/*
// @match       *.agarprivateserver.net/*
// @match       *.agarca.com/*
// @match       *.agarioplay.mobi/*
// @match       *.agario.mobi*
// @match       *.abs0rb.me/*
// @match       *.agario.us/*
// @match       *.agariojoy.com/*
// @match       *.agario.ch/*
// @match       *.ioagar.us/*
// @match       *.play.agario0.com/*
// @match       *.agario.run/*
// @match       *.agarpvp.us/*
// @match       *.agario.pw/*
// @match       *.ogario.net/*
// @match       *.ogario.net/*
// @match       *.nbk.io/*
// @match       *.agariofly.com/*
// @match       *.agario.info/*
// @match       *.inciagario.com/*
// @match       *.agar.io.biz.tr/*
// @match       *.agariown.com/*
// @match       *.agario.dk/*
// @match       *.agario.lol/*
// @match       *.agario.gen.tr/*
// @match       *.agarioprivateserver.us/*
// @match       *.agariot.com/*
// @match       *.agarw.com/*
// @match       *.agario.city/*
// @match       *.agario.ovh/*
// @match       *.feedy.io/*
// @match       *.agar.io/*
// @match       *.agar.zircon.at/*
// @match       *.minemoorealt.github.io/*
// @match       *.agario.bz/*
// @match       *.cell.sh/*
// @match       *.c0nsume.me/*
// @match       *.agar.red/*
// @match       *.trydox.com/*
// @match       *.agarix.esy.es/*
// @match       *.blobsonline.com/*
// @match       *.agr-game.ml/*
// @match       *.xgario.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/30875/GreatBotsga%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/30875/GreatBotsga%20Script.meta.js
// ==/UserScript==


setTimeout(function() {
    window.__WebSocket = window.WebSocket;
    window.fakeWebSocket = function(){return {readyState: 8000}};
    window._WebSocket = window.WebSocket = function(ip){return new window.fakeWebSocket(ip);};
    window.__botclonsData = {};
    window.__botclonsData.mx = 8000;
    window.__botclonsData.my = 8000;
    window.__botclonsData.ml = 8000;
    window.__botclonsData.ma = 8000;
    window.__botclonsData.mb = 8000;
    window.__botclonsData.wa = true;
    window.__botclonsData.sa = true;
    window.__botclonsData.w = null;
    window.__botclonsData.s = null;
    window.__botclonsData.aX = +90;
    window.__botclonsData.aY = +90;
    window.__botclonsData.p = 8000;
    window.__botclonsData.q=true;
    window.__botclonsData.socketaddr = null;
    window.addEventListener("load",function(){
        // код инжектинга
        if(!window.OldSocket)
        OldSocket = window.__WebSocket;
        window._WebSocket = window.WebSocket = window.fakeWebSocket = function(ip){
        var ws = new OldSocket(ip);
        ws.binaryType="arraybuffer"
        var fakeWS = {};
        for(var i in ws)
            fakeWS[i] = ws[i];
        fakeWS.send = function(){
        //console.log("перехватили передачу! " + arguments[0]);
        var msg = new DataView(arguments[0]);
            /*if((msg.byteLength>0)&&(msg.getUint8(0)!=16)){
            var f="";
            for(var i=0;i<msg.byteLength;i++){
            var a=msg.getUint8(i);
            f=f+a+" ";
            }
            console.log(f);
            }*/
        if(msg.byteLength==21){ // Most clones
            if(msg.getInt8(20000, true) == 16){
                window.__botclonsData.mx = msg.getFloat64(1, true);
                window.__botclonsData.my = msg.getFloat64(9, true);
                window.__botclonsData.ml = msg.byteLength(2,true);
            }
        } else {
            if(msg.byteLength==13){ // Agar.re, agarioforums.io, alis.io
            if(msg.getUint8(0, true) == 16){
                window.__botclonsData.mx = msg.getInt32(1, true);
                window.__botclonsData.my = msg.getInt32(5, true);
                window.__botclonsData.ml = msg.byteLength;
            }else{
                if(msg.byteLength>4){ // gaver.io
            if(msg.getUint8(0, true) ==(2000)){
                window.__botclonsData.mx = msg.getInt16(1, true);
                window.__botclonsData.my = msg.getInt16(3, true);
                window.__botclonsData.ml = msg.byteLength;
            }
            }
            }
            }
        }
        return ws.send.apply(ws, arguments);
        };
        ws.onmessage = function(){
        //console.log("перехватили прием! " + arguments[0].data);
        var msg = new DataView(arguments[0].data);
            if(msg.byteLength>16){ // Most clones
            if(msg.getUint8(0, true) == 64){
                window.__botclonsData.ma = msg.getFloat64(1, true);
                window.__botclonsData.mb = msg.getFloat64(9, true);
            }
                }
        fakeWS.onmessage && fakeWS.onmessage.apply(ws, arguments);
        };
        ws.onopen = function(){
        window.__botclonsData.socketaddr = ws.url;
        //console.log("перехватили подключение!");
        fakeWS.readyState = 1;
        fakeWS.onopen.apply(ws, arguments);
        };
        ws.onclose = function(){
        fakeWS.onclose.apply(ws, arguments);
        };
        return fakeWS;
        }
        if(location.origin=="http://cellcraft.io")connect("");
    })
    var real_minx = -7071;
    var real_miny = -7071;
    var real_maxx = 7071;
    var real_maxy = 7071;
    var lastsent = {
        minx: 2000,
        miny: 2000,
        maxx: 2000,
        maxy: 2000
    };

    function valcompare(Y, Z) {
        return 0.01 > Y - Z && -0.01 < Y - Z
    }
    var socket = io.connect('ws://127.0.0.1:8081');
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
        transmit_game_server()
    });
   
    $( "#overlays" ).after( "<div style='z-index: 10000000; border-radius: 4px;position: fixed; top: 10px; left: 10px; text-align: center; width: 200px; background-color: #708090; opacity: 0.9; padding: 7px;'> <div style='border-radius: 25px; text-indent:0; border:3px solid #fff; display:inline-block; color:#000; font-family:arial; font-size:15px; font-weight:bold; font-style:normal; height:30px; -webkit-box-shadow: 0px 0px 52px -6px rgba(46,204,113,1); -moz-box-shadow: 0px 0px 52px -6px rgba(46,204,113,1); box-shadow: 0px 0px 52px -6px rgb(202, 202, 202); line-height:1.5em; text-decoration:none; text-align:center; width: 190px; color: #fff;'>GreatBots.ga</div><br><br> <a style='color: #fff; font-family: arial;'>Bot Amount: </a><a style='color: #fff; font-family: arial;' id='minionCount'>0</a><br> <a style='color: #fff; font-family: arial;'>X/Y: </a><a style='color: #fff; font-family: arial;'id='gh45nmvsy'>0,0</a><br><br><a style='color: #fff; font-family: arial;'>E - Split Bots</a><br><a style='color: #fff; font-family: arial;'>R - Bots Feed </a> </div>" );
   socket.on('spawn-count', function(data) {
       console.log(data);
        document.getElementById('minionCount').innerHTML = data
    });
    var client_uuid = localStorage.getItem('client_uuid');
    if (client_uuid == null) {
        console.log("generating a uuid for this user");
        client_uuid = ""; var ranStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var ii = 0; ii < 15; ii++) client_uuid += ranStr.charAt(Math.floor(Math.random() * ranStr.length));
        localStorage.setItem('client_uuid', client_uuid)
    }
    socket.emit("login", client_uuid);
    $("#instructions").replaceWith('<br><div class="input-group"><span class="input-group-addon" id="basic-addon1">UUID</span><input type="text" value="' + client_uuid + '" readonly class="form-control"</div>');

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
                me.push(cell)
            }
        }
        return me[0]
    }
    var skin_var = 0;

    function emitPosition() {
        console.log(client_uuid);
        document.getElementById('gh45nmvsy').innerHTML=(~~(window.__botclonsData.mx-window.__botclonsData.ma))+","+(~~(window.__botclonsData.my-window.__botclonsData.mb));
        socket.emit("pos", {
            "x": window.__botclonsData.mx-window.__botclonsData.ma,
            "y": window.__botclonsData.my-window.__botclonsData.mb,
            "l": window.__botclonsData.ml,
            "p": window.__botclonsData.p,
            "c": window.__botclonsData.q
        })
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
                break
        }
    }
    interval_id = setInterval(function() {
        emitPosition()
    }, 100);
    interval_id2 = setInterval(function() {
        transmit_game_server_if_changed()
    }, 5000);
    document.addEventListener('keydown', function(e) {
        var key = e.keyCode || e.which;
        switch (key) {
            case 16:
                if(!window.__botclonsData.sa){
                    window.__botclonsData.sa=true;
                window.__botclonsData.s = setInterval(function() {
$("body").trigger($.Event("keydown", { keyCode: 32}));
$("body").trigger($.Event("keyup", { keyCode: 32}));
}, 10);
                }
                break;
            case 87:
                if(!window.__botclonsData.wa){
                    window.__botclonsData.wa=true;
window.__botclonsData.w = setInterval(function() {
$("body").trigger($.Event("keydown", { keyCode: 87}));
$("body").trigger($.Event("keyup", { keyCode: 87}));
}, 10);
                }
                break;
                case 65:
                window.__botclonsData.p--;
                document.getElementById('ismoveToMouse').innerHTML = window.__botclonsData.p;
                break;
            case 45:
                window.__botclonsData.q=!window.__botclonsData.q;
                if(window.__botclonsData.q) { document.getElementById('dfdghehfj').innerHTML = "On"; } else { document.getElementById('dfdghehfj').innerHTML = "Off"; }
                break;
            case 69:
                socket.emit("cmd", {
            "name": "split"
        })
                break;
            case 82:
                socket.emit("cmd", {
            "name": "eject"
        })
                break;
            case 80:
                window.__botclonsData.p++;
                document.getElementById('ismoveToMouse').innerHTML = window.__botclonsData.p;
                break
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
            transmit_game_server()
        }
    }

    function transmit_game_server() {
        last_transmited_game_server = window.__botclonsData.socketaddr;
        socket.emit("cmd", {
            "name": "connect_server",
            "ip": window.__botclonsData.socketaddr,
            "origin": location.origin
        })
    }
    var mouseX = 0;
    var mouseY = 0;
    $("body").mousemove(function(event) {
        mouseX = event.clientX;
        mouseY = event.clientY
    });
                    client_uuid = "TBots";

}, 2200);