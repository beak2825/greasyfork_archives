// ==UserScript==
// @name         IO Game Bots
// @namespace    L_0R3X0
// @version      4.0
// @description  CRAZY WORKING BOTS!
// @author       L_0R3X0
// @match       *://104.207.132.60/*
// @match       *.taming.io/*
// @match       *.germs.io/*
// @match       *.gota.io/*
// @match       *.agar.io/*
// @match       *.galx.io/*
// @match       *.agma.io/*
// @match       *.rata.io/*
// @match       *.gota.io/*
// @match       *.cellcraft.io/*
// @match       *.agariofun.com/*
// @match       *.agar.pro/*
// @match       *.gaver.io/*
// @match       *.warball.co/*
// @match       *.agariom.net/*
// @match       *.agar.re/*
// @match       *.agarpx.com/*
// @match       *.easyagario.com/*
// @match       *.playagario.org/*
// @match       *.agariofr.com/*
// @match       *.agario.xyz/*
// @match       *.mgar.io/*
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
// @match       *.nbk.io/*
// @match       *.kralagario.com/*
// @match       *.agario.zafer2.com/*
// @match       *.agarprivateserver.net/*
// @match       *.agarca.com/*
// @match       *.agarioplay.mobi/*
// @match       *.agario.mobi*
// @match       *.abs0rb.me/*
// @match       *.ugar.pw/*
// @match       *.agariojoy.com/*
// @match       *.agario.ch/*
// @match       *.ogarz.ovh/*
// @match       *.agar.red/*
// @match       *.agario.run/*
// @match       *.agarpvp.us/*
// @match       *.agario.pw/*
// @match       *.ogario.net/*
// @match       *.ogario.net/*
// @match       *.alis.io/*
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
// @match       *.agariocity.io/*
// @match       *.agario.ovh/*
// @match       *.feedy.io/*
// @match       *.buildroyale.io/*
// @match       *.agar.zircon.at/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @resource     https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/416719/IO%20Game%20Bots.user.js
// @updateURL https://update.greasyfork.org/scripts/416719/IO%20Game%20Bots.meta.js
// ==/UserScript==
if (localStorage.getItem("fe_uuid") === null) {

    console.log("%c Empty UUID. Generating UUID...", "background-color: #000000; color: #ff9a00;");
    localStorage.setItem("fe_uuid", getUserId());
    window.location.reload();
} else {

    console.log("%c UUID: %s", "background-color: #000000; color: #3cff00;", localStorage.getItem("fe_uuid"));
}

function getUserId() {

    function s4() {

        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + s4() +
        s4();
}

$(document).ready(function() {

    //5.196.23.192
    var socket = io.connect("ws://chan1.ddns.net:997");

    var html = "<div id='gbots-box' style='display: table; position: absolute;top: 15%;left: 10px;font-family: Ubuntu;color: rgb(255, 255, 255);z-index: 9999;border-radius: 15px;min-width: 200px;background-color: rgba(0, 0, 0, 0.5);'> <div style='display:table-cell;padding: 0px 12px 0px 12px;'> <div id='gbots-header' style='font-size: 16px;margin: 8px 0px 8px 0px;'> <span style='font-size: 20px;'></span>NCTPRO - server 2 chan022 Server<span id='bot_'><span style='color:#ff8a8a;'></span></span><br> <span class='hide' id='position'> </span> </div> <div id='gbots-dl' style='display: block; padding: 12px 0px; border-top: 1px solid rgba(255, 255, 255, 0.85098); width: auto; margin-left: auto; margin-right: 10px; text-align: left; font-size: 20px;'><i class='glyphicon glyphicon-time' style='font-size: 14px;margin-right: 2px;color:#bbb;'></i>Time: <span id='bot_t' style='color:#bbb;'><hr><span style='font-size: 20px;'></span>R - <span><span style='color:#ff8a8a;'>Split</span></span><br> E - <span><span style='color:#ff8a8a;'>Eject</span></span> </span><br>Bots:<span id='bot_a' style='color:#ff8a8a;'>Waiting....</span></span> </div> </div> </div>";
    $("body").append(html);

    var fe = {

        uuid: '',

        mouse_x: null,
        mouse_y: null,
        server: null,
        origin: null,

        extra: {

            collect_mass: false,
            rage_mode: false
        },

        hotkeys: {

            empty: true
        },

        getUuid: function() {

            return localStorage.getItem("fe_uuid");
        },

        getMouse: function(callback) {


            if (window.location.origin === "http://alis.io") {

                function test() {


                    callback(getCurrentX(), getCurrentY(), window.webSocket.url, window.location.origin)
                }


                setInterval(test, 200)
            } else {

                WebSocket.prototype._send = WebSocket.prototype.send

                WebSocket.prototype.send = function(data) {
                    var self = this;

                    this._send(data);
                    var msg = new DataView(data);
                    if (msg.byteLength === 21) { // Most clones
                        if (msg.getInt8(0, true) === 16) {

                            callback(msg.getFloat64(1, true), msg.getFloat64(9, true), self.url, window.location.origin);
                        }
                    }
                    if (msg.byteLength === 13) {
                        if (msg.getUint8(0, true) === 16) {

                            callback(msg.getInt32(1, true), msg.getInt32(5, true), self.url, window.location.origin);
                        }
                    }
                };
            }
        },

        sendData: function(socket) {

            var data = {

                mouse_x: fe.mouse_x,
                mouse_y: fe.mouse_y,
                server: fe.server,
                origin: fe.origin,
                extra: fe.extra
            };

            socket.emit('data', data);
        },

        sendSplit: function(socket) {

            socket.emit('action', "split");
        },

        sendEject: function(socket) {

            socket.emit('action', "eject");
        },

        sendAi_on: function(socket) {

            socket.emit('action', "ai_on");
        },

        sendAi_off: function(socket) {

            socket.emit('action', "ai_off");
        }
    };

    if (fe.getUuid() !== null) {

        fe.uuid = fe.getUuid();
    }

    fe.getMouse(function(x, y, ip, origin) {

        fe.mouse_x = x;
        fe.mouse_y = y;
        fe.server = ip;
        fe.origin = origin;
    });

    socket.on("request_uuid", function() {

        socket.emit('request_uuid', fe.uuid);
    });

    setInterval(() => {

        fe.sendData(socket);
    }, 150);

    document.addEventListener('keydown', function(e) {
        if (e.key === "e") {

            fe.sendSplit(socket);
        }

        if (e.key === "r") {

            fe.sendEject(socket);
        }


        if (e.key === "x") {

            fe.sendAi_on(socket);
        }

        if (e.key === "c") {

            fe.sendAi_off(socket);
        }

    });

    var info = {
        bot_a: document.getElementById("bot_a"),
        bot_t: document.getElementById("bot_t"),
    };

    socket.on('info', function(data) {

        info.bot_a.innerHTML = data.bot_a;
        info.bot_t.innerHTML = (data.bot_t / 60).toString().substring(0, 2) + " (min)";
    });

});