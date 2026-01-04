// ==UserScript==
// @name         op-bots.com
// @namespace    Copyright © op-bots.com
// @version      0.4 alpha
// @description  Bots for more clons
// @author       SizRex
// @require      https://ajax.googleapis.com/ajax/libs/jquery/latest/jquery.min.js
// @match        *://agar.bio/*
// @match        *://play.agario0.com/*
// @match        *://cellcraft.io/*
// @match        *://agarz.com/*
// @match        *://germs.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372989/op-botscom.user.js
// @updateURL https://update.greasyfork.org/scripts/372989/op-botscom.meta.js
// ==/UserScript==
((global, jq) => {
    global.userscript = {
        ws: null,
        sniffer: null,
        server: null,
        x: 0,
        y: 0,
        sendTime: 0,
        moveInt: null,
        bL: 0
    };

    global.userscript.sniffer = () => {
        if(global.location.origin == "http://agar.bio") {
            global.WebSocket.prototype.prototype.opsend = global.WebSocket.prototype.prototype.send;
            global.WebSocket.prototype.prototype.send = function() {
                this.opsend.apply(this, arguments);
                if(this.url != global.userscript.ws.url) {
                    var msg = new DataView(arguments[0]);
                    if (msg.byteLength == 13) {
                        if (msg.getInt8(0, true) == 16 || msg.getUint8(0, true) == 16) {
                            global.userscript.x = msg.getInt32(1, true);
                            global.userscript.y = msg.getInt32(5, true);
                            global.userscript.bL = msg.byteLength;
                        }
                    } else if(msg.byteLength == 21) {
                        if (msg.getUint8(0, true) == 16 || msg.getUint8(0, true) == 16) {
                            global.userscript.x = msg.getFloat64(1, true);
                            global.userscript.y = msg.getFloat64(9, true);
                            global.userscript.bL = msg.byteLength;
                        }
                    }
                    global.userscript.server = this.url;
                };
            };
        } else {
            global.WebSocket.prototype.opsend = global.WebSocket.prototype.send;
            global.WebSocket.prototype.send = function() {
                this.opsend.apply(this, arguments);
                if(this.url != global.userscript.ws.url) {
                    var msg = new DataView(arguments[0]);
                    if (msg.byteLength == 13) {
                        if (msg.getInt8(0, true) == 16 || msg.getUint8(0, true) == 16) {
                            global.userscript.x = msg.getInt32(1, true);
                            global.userscript.y = msg.getInt32(5, true);
                            global.userscript.bL = msg.byteLength;
                        }
                    } else if(msg.byteLength == 21) {
                        if (msg.getUint8(0, true) == 16 || msg.getUint8(0, true) == 16) {
                            global.userscript.x = msg.getFloat64(1, true);
                            global.userscript.y = msg.getFloat64(9, true);
                            global.userscript.bL = msg.byteLength;
                        }
                    }
                    global.userscript.server = this.url;
                };
            };
        }
        global.connection();
    }

    global.userscript.createBuffer = (length) => {
        return new DataView(new ArrayBuffer(length));
    }

    global.userscript.send = (buf) => {
        global.userscript.ws.send(buf);
    }

    global.connection = () => {
        global.userscript.ws = new WebSocket("ws://35.242.128.107:8000");
        global.userscript.ws.binaryType = "arraybuffer";
        global.userscript.ws.onopen = () => {
            setTimeout(() => {
                let buf = global.userscript.createBuffer(1);
                buf.setUint8(0, 1);
                global.userscript.send(buf);
                global.userscript.moveInt = setInterval(function() {
                    let buf = global.userscript.createBuffer(29);
                    buf.setUint8(0, 4);
                    buf.setFloat64(1, global.userscript.x, true);
                    buf.setFloat64(9, global.userscript.y, true);
                    buf.setFloat64(17, global.userscript.bL, true);
                    buf.setUint32(25, true);
                    global.userscript.send(buf);
                },100);
            },5000);
        };
        global.userscript.ws.onclose = () => {
            clearInterval(global.userscript.moveInt);
            if(global.userscript.serverInt) clearInterval(global.userscript.serverInt);
            setTimeout(() => {
                global.connection();
            }, 1500);
        };
        global.userscript.ws.onmessage = (message) => {
            let offset = 0;
            message = new DataView(message.data);
            let opcode = message.getUint8(offset++);
            switch(opcode) {
                case 0: {
                    console.log("Я получил сообщение опкод -", opcode);
                    global.userscript.serverInt = setInterval(function() {
                        let buf = global.userscript.createBuffer(5 + global.userscript.server.length + global.location.origin.length * 2);
                        let off = 0;
                        buf.setUint8(off++, 2);
                        for(let i = 0; i < global.userscript.server.length; i++) {
                            buf.setUint8(off++, global.userscript.server.charCodeAt(i));
                        }
                        buf.setUint8(off++, 0);
                        for(let i = 0; i < global.location.origin.length; i++) {
                            buf.setUint16(off, global.location.origin.charCodeAt(i), true);
                            off += 2;
                        }
                        buf.setUint16(off++, 0, true);
                        global.userscript.send(buf);

                    },500);
                } break;
                case 1: {
                    console.log("Я получил сообщение опкод -", opcode);
                } break;
                case 2: {
                    global.userscript.sendPing();
                } break;
                case 3: {
                    console.log("Я получил сообщение опкод -", opcode);
                    jq("#botCount").css("color", "lime").text(message.getUint16(1, true) + "/" + message.getUint16(3, true));
                    jq("#ping").css("color", "lime").text(message.getUint16(7, true) + "ms");
                    if(message.getUint16(9, true) == 2) {
                        jq("#timeLeft").css("color", "lime").text("Infinity");
                    } else if(message.getUint16(9, true) == 1){
                        jq("#timeLeft").css("color", "lime").text((message.getUint16(5, true) / 3600 % 24 >> 0) +":"+ (message.getUint16(5, true) / 60 % 60 >> 0)+":"+(message.getUint16(5, true) % 60 >> 0));
                    }
                } break;
            }
        };
    }

    global.userscript.sendPing = () => {
        let buf = global.userscript.createBuffer(1);
        buf.setUint8(0, 3);
        global.userscript.send(buf);
    }

    global.addEventListener("keydown", (key) => {
        key = key.which || key.keyCode;
        switch(key) {
            case 88: {
                let buf = global.userscript.createBuffer(1);
                buf.setUint8(0, 5);
                global.userscript.send(buf);
            } break;
            case 67: {
                let buf = global.userscript.createBuffer(1);
                buf.setUint8(0, 6);
                global.userscript.send(buf);
            } break;
            case 67: {
                let buf = global.userscript.createBuffer(1);
                buf.setUint8(0, 7);
                global.userscript.send(buf);
            } break;
        }
    });

    jq("#canvas").after("<div style='background:rgba(0, 0, 0, 0.87); border-radius: 10% 25%; width: 200px; top: 10px; left: 10px; display: block; position: absolute; text-align: center; font-size: 15px; color: #ffffff; padding: 3px; font-family: Ubuntu;'>OpBots Client<font color='#7FFF00'></font><br>Bots: <a id='botCount'><font color='red'>No package!</font></a><br>Time Left: <a id='timeLeft'><font color='#7FFF00'>00:00:00</font></a><br>Ping: <a id='ping'><font color='#7FFF00'>0ms</font></a><br><font color='#05A7E6'>E</font color='#ffffff'> - Split Bots<br><font color='#05A7E6'>R</font color='#ffffff'> - Eject Bots<br><font color='#05A7E6'>C</font color='#ffffff'> - Chat Spam: <a id='chatSpam'><font color='red'>Off</font></a><br><font color='#05A7E6'>Copyright</font color='#ffffff'> © - OpBots<br>");

    //jq(window).load(() => {
    global.userscript.sniffer();
    //});

})(window, window.$);