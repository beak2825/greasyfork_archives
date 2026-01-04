// ==UserScript==
// @name         Starve.io L3Mod
// @namespace    Starve.io L3Mod
// @version      0.1
// @description  Starve.io L3Mod, save home, talk with friends, share map ! And more... soon xD
// @author       l3mpik
// @match        *://starve.io/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32486/Starveio%20L3Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/32486/Starveio%20L3Mod.meta.js
// ==/UserScript==
window.l3 = function() {
 
    this.socket = null;
 
    this.version = "1.0";
    this.name = "";
 
    this.binds = {};
}
 
l3.prototype = {
 
    get: function(data) {
 
        return document.getElementById(data.toString());
    },
 
    getRoom: function(callback) {
 
        var me = this;
 
        try {
 
            //callback(window.webSocket.url), future use bots? :D
            return client.socket.url;
        } catch(e) {
 
            console.error("Undefined ws.url, connect to server!");
        }
    },
 
    connect: function(data) {
 
        var me = this;
 
        me.socket = io.connect("ws://5.196.23.192:1000");
        me.room = data;
 
        me.socket.on('request_room', function() {
 
            me.socket.emit('request_room', me.room);
        });
 
        me.socket.on('disconnect', function(e) {
 
            console.log("%c Kurwa. Jeden Way jesteś Banned! :D", "background: #000000; color: yellow; font-size: 2em;");
        });
 
        me.handleMessages();
    },
 
    getName: function() {
 
        var me = this;
 
        me.name = me.get("nickname_input").value;
 
        return me.name;
    },
 
    sendChat: function(data) {
 
        var me = this;
 
        me.socket.emit('chat', {
            user: me.getName(),
            message: data
        });
    },
 
    handleMessages: function(data) {
 
        var me = this;
        var message_counter = 0;
        var offset = 100;
 
        me.socket.on('chat', function(data) {
 
            if(data.user === me.getName()) {
                //return
            } else {
 
                //console.log("User:", data.user, "Message:", data.message);
                message_counter += 10;
 
                var r_id = me.randomId(data);
 
                offset = offset + message_counter;
 
                $("body").append('<div id="' + r_id + '" class="row" style="width: 30%; position: absolute; z-index: 1; bottom: ' + offset + 'px;"> <div class="alert alert-success" role="alert"> <span class="glyphicon glyphicon-user" aria-hidden="true" style="margin-left: 5px;"></span> <div id="l3_user">' + data.user + '</div>:<div id="l3_message">' + data.message + '</div> </div> </div>');
 
                setTimeout(() => {
 
                    $("#" + r_id).fadeOut("slow");
                    $("#" + r_id).remove();
 
                    message_counter -= 10;
                }, 3000);
            }
        });
    },
    handlebinds: function() {
 
        var me = this;
 
        me.binds = [];
 
        me.binds.push('`|respawn');
 
 
        function isBind(e) {
 
            for(var i in me.binds) {
 
                var bind = me.binds[i].split("|");
 
                if(bind[0] === e.key) {
 
                    switch(bind[1]) {
 
                        case 'respawn':
                            me.respawn();
                            break;
                    }
                }
            }
        }
 
        document.addEventListener('keydown', isBind, false);
 
        console.log("%c Binds initialization Success!", "background: #000000; color: yellow;");
    },
 
    respawn: function() {
 
        var me = this;
 
        me.client.socket.close(1000);
    },
    randomId: function(data) {
 
        return Math.floor(Math.random() * (2 + data.user.length * data.message.length + 2))
    },
 
    override(client, callback) {
 
        var me = this;
 
        try {
 
            client.send_chat = function(data) {
 
                world.fast_units[user.uid].text = data;
                this.socket.send(JSON.stringify([0, data]));
 
                me.sendChat(data);
            };
 
            client.connect = function() {
 
                this.timeout_number = 0;
                this.connect_timeout();
 
                me.name = me.getName();
 
                if(me.socket !== null && me.socket !== void(0)) {
                    me.socket.disconnect();
                }
 
                me.connect(me.getRoom());
            };
 
            window['create_minimap'] = function(c, g) {
                console.log("Spoofing data:", c, " And this array:", g);
                var f = document.createElement("canvas"),
                    d = f.getContext("2d");
                f.width = 200 * c;
                f.height = 200 * c;
                f.id = "minimap";
                d.translate(12 * c, 8 * c);
                d.fillStyle = g[9];
                d.fillRect(-7, 0, f.width - 10, f.height - 18);
                d.fillStyle = g[0];
                d.fillRect(0, 0, f.width - 25, f.height - 25);
 
                create_minimap_object(d, c, g[1], "p", 5, -1);
                create_minimap_object(d, c, g[2], "s", 3, 2, 2);
                create_minimap_object(d, c, g[3], "s", 4, 1, 1);
                create_minimap_object(d, c, g[4], "s", 5, 0, 0);
                create_minimap_object(d, c, g[5], "t", 3, 5, 4);
                create_minimap_object(d, c, g[6], "t", 4, 3,
                    2);
                create_minimap_object(d, c, g[7], "t", 4, 1, 0);
                create_minimap_object(d, c, g[8], "b", 4, 3, 2);
                create_minimap_object(d, c, g[9], "b", 4, 1, 0);
                create_minimap_object(d, c, g[10], "g", 3, 2, 2);
                create_minimap_object(d, c, g[11], "g", 4, 1, 1);
                create_minimap_object(d, c, g[12], "g", 5, 0, 0);
                create_minimap_object(d, c, g[13], "d", 3, 2, 2);
                create_minimap_object(d, c, g[14], "d", 4, 1, 1);
                create_minimap_object(d, c, g[15], "d", 5, 0, 0);
                d.translate(-7, -2);
                round_rect(d, 0, 0, f.width - 9, f.height - 14, 10);
                d.lineWidth = 5;
                d.strokeStyle = g[16];
                d.stroke();
 
            };
 
            me.client = client;
 
            callback();
 
        } catch(e) {
 
            console.error("Kurwa error : ", e)
        }
 
    },
 
    isReady(callback) {
 
        var me = this;
 
        if(window.client && window.Client && window.game && window.world && window.user) {
 
            callback();
 
            return true;
        } else {
 
            return false;
        }
    },
 
    inject(data) {
 
        var link = document.createElement("link");
        link.href = data;
        link.type = "text/css";
        link.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(link);
 
        console.log("%c Injection Success!", "background: #000000; color: yellow;");
    }
}
 
setTimeout(function() {
 
    var app = new window.l3();
 
    app.isReady(function() {
 
        console.log("Before:", create_minimap);
 
        console.log("%c Game is ready! Im working.... okay? ", "background: #000000; color: yellow;");
 
        app.inject("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css");
 
        app.override(window.client, function() {
            console.log("%c Override Success!", "background: #000000; color: yellow;");
        });
 
        console.log("Before:", create_minimap);
 
        app.handlebinds();
    });
 
}, 2000);