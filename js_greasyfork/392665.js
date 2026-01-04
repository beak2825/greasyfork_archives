// ==UserScript==
// @name         Bots Blobe
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       REF
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392665/Bots%20Blobe.user.js
// @updateURL https://update.greasyfork.org/scripts/392665/Bots%20Blobe.meta.js
// ==/UserScript==

//PRESS "I" FOR INFORMATIONS
window.sockets = [];
function init() {

    window.unlockSkins();
    if (localStorage.getItem("Discord")) {
            function newSocket(botName) {
        $.get("/getIP", {
            sip: lobbyURLIP
        }, function(data) {
            window.socketBot = io.connect("http://" + data.ip + ":" + data.port, {
                "connect timeout": 3000,
                reconnection: true,
                query: "cid=" + UTILS.getUniqueID() + "&rmid=" + lobbyRoomID
            });
            window.sockets.push(window.socketBot);
            spawnBot(botName);
        });
    }

    function BotAmout(number, botName) {
        for (var i = 0; i < number; i++) {
            newSocket(botName);
        }
    }

    function spawnBot(nameBot) {
        window.sockets.forEach(socket => {
            socket.emit("spawn", {
                name: nameBot + "_" + Math.floor(Math.random() * 10000) + 1,
                skin: 0
            });
        });
    }

    function sendChatMessage(str) {
        if (!window.sockets) return alert("no sockets");
        window.sockets.forEach(socket => {
            socket.emit("ch", str);
        });
    }

    function socketClose() {
        if (!window.sockets) return alert("no sockets");
        window.sockets.forEach(socket => {
            socket.close();
        });
    }

    function generateRandomBlocks() {

        if (!window.sockets) return alert("no sockets");
        window.sockets.forEach(socket => {
socket.emit("1",1.00,132,3);
                socket.emit("1",1.60,132,3);
                socket.emit("1",2.20,132,3);
                socket.emit("1",2.80,132,3);
                socket.emit("1",3.40,132,3);
                socket.emit("1",4.00,132,3);
                socket.emit("1",4.60,132,3);
                socket.emit("1",5.20,132,3);
                socket.emit("1",5.80,132,3);
                socket.emit("1",6.40,132,3);
                socket.emit("1",7.00,178,3);
                socket.emit("1",7.60,178,3);
                socket.emit("1",1.30,178,3);
                socket.emit("1",1.90,178,3);
                socket.emit("1",2.50,178,3);
                socket.emit("1",3.10,178,3);
                socket.emit("1",3.70,178,3);
                socket.emit("1",4.30,178,3);
                socket.emit("1",4.90,178,3);
                socket.emit("1",5.50,178,3);
                socket.emit("1",6.10,178,3);
                socket.emit("1",6.64,186,3);
                socket.emit("1",7.00,179.504,3);
                socket.emit("1",6.50,300,3);
                socket.emit("1",6.75,300,3);
                socket.emit("1",6.78,300,3);
                socket.emit("1",7.05,300,3);
                socket.emit("1",7.32,300,3);
                socket.emit("1",7.59,300,3);
                socket.emit("1",7.86,300,3);
                socket.emit("1",8.13,300,3);
                socket.emit("1",8.40,300,3);
                socket.emit("1",8.67,300,3);
                socket.emit("1",8.94,300,3);
                socket.emit("1",9.21,300,3);
                socket.emit("1",9.48,300,3);
                socket.emit("1",9.75,300,3);
                socket.emit("1",10.02,300,3);
                socket.emit("1",10.29,300,3);
                socket.emit("1",10.56,300,3);
                socket.emit("1",10.83,300,3);
                socket.emit("1",11.10,300,3);
                socket.emit("1",11.05,300,3);
                socket.emit("1",11.37,300,3);
                socket.emit("1",11.64,300,3);
                socket.emit("1",11.91,300,3);
                socket.emit("1",12.18,300,3);
                socket.emit("1",12.45,300,3);


       })
}

    addEventListener("keydown", function(ev) {
        if (ev.keyCode == 76) { //L
            var x = prompt("Bots say...");
            sendChatMessage(x);
        }
        if (ev.keyCode == 80) { //P
            socketClose();
            window.sockets = [];
            alert("Bots Stopped...");
        }
        if (ev.keyCode == 77) { //M
            var xy = parseInt(prompt("Bots amout..."));
            var name = prompt("Bots name...");
            BotAmout(xy, name);
            alert("Bots start...");
        }
        if (ev.keyCode == 73) { //M
            alert("L: send chat message\nP: stop bots\nM: spawn bots amout\nQ: Generate random objects\nBots Running: " + window.sockets.length);
        }
        if (ev.keyCode == 81) {
            generateRandomBlocks();
        }
    });

    addEventListener("mousewheel", function(a) {
        a = window.event || a;
        a.preventDefault();
        a.stopPropagation();
        window.scroll = Math.max(-1, Math.min(1, a.wheelDelta || -a.detail))
        if (window.scroll == -1) {
            if (maxScreenHeight < 30000) {
                (maxScreenHeight += 250, maxScreenWidth += 250, resize(true));
                window.scroll = 0
            }
        }

        if (window.scroll == 1) {
            if (maxScreenHeight > 1080) {
                (maxScreenHeight -= 250, maxScreenWidth -= 250, resize(true))
                window.scroll = 0
            }
        }
    });

    setInterval(updatePlayer, 90000);

    function updatePlayer() {
        socket.emit("2", 0, 0);
        socket.emit("2", Math.round(camX), Math.round(camY));
    }
    } else {
        window.base64 = ["aHR0cHM6Ly9kaXNjb3JkLmdnLzlYTndTV3A="];
        window.open(atob(base64));
        localStorage.setItem("Discord", "Si");
    }
}

init();