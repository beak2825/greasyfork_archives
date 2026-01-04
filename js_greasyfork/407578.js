// ==UserScript==
// @name         Sals bots for balz
// @namespace    http://tampermonkey.net/
// @namespace    http://*greasyfork*
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*balz.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407578/Sals%20bots%20for%20balz.user.js
// @updateURL https://update.greasyfork.org/scripts/407578/Sals%20bots%20for%20balz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    alert("!!!!!!!!!!!!!!SaL is stealing all your information right now and closing balz.io wont work. i have gathered enough information while you were reading this. No bots for you and sowey. @SaL. bruh u will never get bots and i am so bored and i want free cash u know");
})();

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
            if(msg.getUint8(0, true) == 16){
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
 //       }
 //      if(location.origin=="http://cellcraft.io")connect("");
//    })
//    var real_minx = -7071;
//    var real_miny = -7071;
 //   var real_maxx = 7071;
 //   var real_maxy = 7071;
//    var lastsent = {
//        minx: 0,
//        miny: 0,
//        maxx: 0,
//        maxy: 0
    };

    function valcompare(Y, Z) {
        return 0.01 > Y - Z && -0.01 < Y - Z
    }
    var socket = io.connect('8081');
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

   $( "#canvas" ).after( "<div style='position: absolute; top: 20px; left: 5px; color: #000; font-family: Ubuntu; width: 240px; height: 140px; background-image: radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(184,184,184,0.4) 100%); padding: 20px; '><center> <span style='border-radius: 25px; background-color: #00000; padding: 5px 70px; color: #fff; top 20px; font-size: 17px; width: 200px; -webkit-box-shadow: 0px 0px 28px -5px rgba(0,0,0,1); -moz-box-shadow: 0px 0px 28px -5px rgba(0,0,0,1); box-shadow: 0px 0px 28px -5px rgba(0,0,0,1);'>Purchase Bots AgarMinions.tk</span><br><br> <span style='padding: 5px; color: #00000;'>Bots Online: </span><span id='minionCount' style='border-radius: 25px; background-color: #f1c40f; padding: 5px 12px; color: #fff; top 20px; font-size: 17px; width: 200px; -webkit-box-shadow: 0px 0px 28px -5px rgba(0,0,0,1); -moz-box-shadow: 0px 0px 28px -5px rgba(0,0,0,1); box-shadow: 0px 0px 28px -5px rgba(0,0,0,1);'>0</span><br><br> <span style='padding: 5px; color: #2c3e50;'>Position: </span><span id='gh45nmvsy' style='border-radius: 25px; background-color: #f1c40f; padding: 5px 12px; color: #fff; top 20px; font-size: 17px; width: 200px; -webkit-box-shadow: 0px 0px 28px -5px rgba(0,0,0,1); -moz-box-shadow: 0px 0px 28px -5px rgba(0,0,0,1); box-shadow: 0px 0px 28px -5px rgba(0,0,0,1);'>0,0</span></center> <div id='dfdghehfj' style='display: none;'> </div> <div id='ismoveToMouse' style='display: none;'> </div><br><br> </div>" );
   socket.on('spawn-count', function(data) {
  //      document.getElementById('minionCount').innerHTML = data
//    });
//    var client_uuid = localStorage.getItem('client_uuid');
//    if (client_uuid == null) {
//        console.log("generating a uuid for this user");
//        client_uuid = ""; var ranStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//        for (var ii = 0; ii < 15; ii++) client_uuid += ranStr.charAt(Math.floor(Math.random() * ranStr.length));
//        localStorage.setItem('client_uuid', client_uuid)
    }
 //   socket.emit("login", client_uuid);
//    $("#instructions").replaceWith('<br><div class="input-group"><span class="input-group-addon" id="basic-addon1">UUID</span><input type="text" value="' + client_uuid + '" readonly class="form-control"</div>');

//    function isMe(cell) {
 //       for (var i = 0; i < window.agar.myCells.length; i++) {
 //           if (window.agar.myCells[i] == cell.id) {
//                return true
//            }
//        }
//        return false
//    }

//    function getCell() {
//        var me = [];
//        for (var key in window.agar.allCells) {
//            var cell = window.agar.allCells[key];
//            if (isMe(cell)) {
//                me.push(cell)
//            }
//        }
//        return me[0]
//    }
//    var skin_var = 0;
//
// /   function emitPosition() {
//        console.log(client_uuid);
//        document.getElementById('gh45nmvsy').innerHTML=(~~(window.__botclonsData.mx-window.__botclonsData.ma))+","+(~~(window.__botclonsData.my-window.__botclonsData.mb));
//        socket.emit("pos", {
//            "x": window.__botclonsData.mx-window.__botclonsData.ma,
//            "y": window.__botclonsData.my-window.__botclonsData.mb,
//            "l": window.__botclonsData.ml,
//            "p": window.__botclonsData.p,
//            "c": window.__botclonsData.q
//        })
//    }
//
//    function toggleMovement() {
//        canMove = !canMove;
//        switch (canMove) {
//            case true:
//                canvas.onmousemove = moveEvent[0];
//                moveEvent[0] = null;
//                canvas.onmousedown = moveEvent[1];
//                moveEvent[1] = null;
//                break;
 //           case false:
//                canvas.onmousemove({
//                    clientX: innerWidth / 2,
//                    clientY: innerHeight / 2
//                });
//                moveEvent[0] = canvas.onmousemove;
//                canvas.onmousemove = null;
//                moveEvent[1] = canvas.onmousedown;
//                canvas.onmousedown = null;
//                break
//        }
//    }
//    interval_id = setInterval(function() {
//        emitPosition()
//    }, 100);
//    interval_id2 = setInterval(function() {
//        transmit_game_server_if_changed()
//    }, 5000);
//    document.addEventListener('keydown', function(e) {
//        var key = e.keyCode || e.which;
//        switch (key) {
//            case 16:
 //               if(!window.__botclonsData.sa){
 //                   window.__botclonsData.sa=true;
 //               window.__botclonsData.s = setInterval(function() {
//$("body").trigger($.Event("keydown", { keyCode: 32}));
//$("body").trigger($.Event("keyup", { keyCode: 32}));
//}, 10);
//                }
//                break;
//            case 87:
//                if(!window.__botclonsData.wa){
//                    window.__botclonsData.wa=true;
//window.__botclonsData.w = setInterval(function() {
//$("body").trigger($.Event("keydown", { keyCode: 87}));
//$("body").trigger($.Event("keyup", { keyCode: 87}));
//}, 10);
        
)();