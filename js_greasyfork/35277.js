// ==UserScript==
// @name         GrozaVlogs V4 Original*
// @namespace    Free MultiOgar Bots
// @version      1.0.5
// @description  GrozaVBots
// @author       GrozaVlogs
// @match        http://agar.bio/*
// @match        http://galx.io/*
// @match        http://cellcraft.io/*
// @match        http://play.agario0.com/*
// @match        http://blong.io/*
// @match        http://nbk.io/*
// @match        http://cellcraft.ml/*
// @match        http://mgar.io/*
// @match        http://gota.io/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35277/GrozaVlogs%20V4%20Original%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/35277/GrozaVlogs%20V4%20Original%2A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.trap = {
        x: 0,
        y: 0,
        ip: null,
        byteLength : 0
    };
    WebSocket.prototype.Asend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(a) {
        this.Asend(a);
        var msg = new DataView(a);
        if (msg.byteLength === 21) {
            if (msg.getInt8(0, true) === 16) {
                trap.x = msg.getFloat64(1, true);
                trap.y = msg.getFloat64(9, true);
                trap.byteLength = msg.byteLength;
            }
        }
        if (msg.byteLength === 13) {
            if (msg.getUint8(0, true) === 16) {
                trap.x = msg.getInt32(1, true);
                trap.y = msg.getInt32(5, true);
                trap.byteLength = msg.byteLength;
            }
        }
        if (msg.byteLength === 5 || msg.byteLength < 4) {
            if (msg.getUint8(0, true) === 16) {
                trap.x = msg.getInt16(1, true);
                trap.y = msg.getInt16(3, true);
                trap.byteLength = msg.byteLength;
            }
        }
        if(this.url !== null) {
            trap.ip = this.url;
            console.log(trap.ip);
        }
    };
    var socket = io.connect('bots-fan1grozavlogs6572.codeanyapp.com:8081');

    document.addEventListener('keydown', function(e) {
        var key = e.keyCode || e.which;
        switch (key) {
            case 69:
                socket.emit('split');
                break;
            case 82:
                socket.emit('eject');
                break;
            case 67:
                socket.emit('spam');
                break;
        }
    });
    setInterval(function() {
        socket.emit('movement', {
            x: trap.x,
            y: trap.y,
            byteLength: trap.byteLength
        });
    },100);
    window.start = function() {
        socket.emit('start', {
            ip : trap.ip !== null ? trap.ip : 0,
            origin : location.origin
        });
    };
    setTimeout(function() {
        $("#canvas").after("<div style='box-shadow: 0px 0px 20px black;z-index:9999999; background-color: #000000; -moz-opacity: 0.4; -khtml-opacity: 0.4; opacity: 0.7; zoom: 1; width: 205px; top: 300px; left: 10px; display: block; position: absolute; text-align: center; font-size: 15px; color: #ffffff; font-family: Ubuntu;border: 2px solid #0c31d4;'> <div style='color:#ffffff; display: inline; -moz-opacity:1; -khtml-opacity: 1; opacity:1;font-size: 22px; filter:alpha(opacity=100); padding: 10px;'><a>---- Cellcraft.ML ---- Client</a></div> <div style=' color:#ffffff; display: inline; -moz-opacity:1; -khtml-opacity: 1; opacity:1; filter:alpha(opacity=100); padding: 10px;'><br>Minions: <a id='minionCount'>Offline</a> </div><button id='start-bots' style='display: block;border-radius: 5px;border: 2px solid #6495ED;background-color: #BCD2EE;height: 50px;width: 120px;margin: auto;text-align: center;'>StartBots </button><marquee>GrozaVlogs - Owner</marquee>CellCraft.ML</div>");
        document.getElementById('start-bots').onclick = function() {
            start();
        };
    },2000);
    socket.on('botCount', function(count) {
        $('#minionCount').html(count);
    });
})();