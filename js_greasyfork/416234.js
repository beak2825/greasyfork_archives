// ==UserScript==
// @name         Oib: A new beginning
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  New year... new script...
// @author       kmccord1
// @match        http://oib.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416234/Oib%3A%20A%20new%20beginning.user.js
// @updateURL https://update.greasyfork.org/scripts/416234/Oib%3A%20A%20new%20beginning.meta.js
// ==/UserScript==
// yeah i used a fuck ton of setTimeouts for this one XD
//
// Controls: (I promise ill keep these updated this time lmao)
// F4: Toggle bots on/off
// F6: Switch bots mode
// E: Railgun
// More coming soon!
(function() {
    'use strict';
    var worker = new inlineWorker(function() {
        // Bot Options
        var botlimit = 29;
        // DO NOT CHANGE ANYTHING BELOW THIS LINE
        // Variables
        var bots = [];
        var url = undefined;
        var togglebots = 0;
        var mouse = {
            x: 0,
            y: 0
        };
        var cam = {};
        var botmode = 0;
        var AllOibs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49];
        var OibsAndQueen = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49];
        var loop = setInterval(tick, 50);
        // Functions
        function tick() {
            if (togglebots == 1) {
                getbotcount();
                botconnect();
            }
        }

        function getbotcount() {
            let botcount = 0;
            for (let i = 0; i < bots.length; i++) {
                if (bots[i] && bots[i].readyState == 1) {
                    botcount++;
                }
            }
            self.postMessage([0, 0, "Bots: " + botcount]);
        }

        function botconnect() {
            var botsconnecting = 0;
            for (var i = 0; i < bots.length; i++) {
                if (bots[i] && bots[i].connected == 0) {
                    botsconnecting = 1;
                    break;
                }
            }
            if (botsconnecting == 0 && bots.length < botlimit) {
                bots.push(new WebSocket(url));
                bots[bots.length - 1].connected = 0;
                bots[bots.length - 1].onclose = function() {
                    var bot = this;
                    bots.splice(bots.indexOf(bot), 1);
                }
                bots[bots.length - 1].onopen = function() {
                    var bot = this;
                    bot.send('["A new beginning",0,0,2,0,0,14]');
                    bot.connected++;
                }
            }
        }

        function botloop() {
            switch (botmode) {
                case 2:
                    for (let i = 0; i < bots.length; i++) {
                        if (bots[i] && bots[i].readyState == 1) {
                            bots[i].send(new Uint8Array([0]));
                            bots[i].send('[3,'+(mouse.x-cam.rx)+','+(mouse.y-cam.ry)+',['+OibsAndQueen+']]');
                        }
                    }
                    setTimeout(botloop, 160);
                    break;
                default:
                    setTimeout(botloop, 50);
                    break;
            }
        }
        botloop();
        self.onmessage = function(e) {
            switch (e.data[0]) {
                case 0:
                    switch (e.data[1]) {
                        case "f4":
                            togglebots++;
                            if (togglebots > 1) {
                                togglebots = 0;
                                self.postMessage([0, 0, "Bots: 0"]);
                                for (let i = 0; i < bots.length; i++) {
                                    bots[i].close();
                                }
                            }
                            break;
                        case "f6":
                            botmode++;
                            if (botmode > 2) {
                                botmode = 0;
                            }
                            break;
                    }
                    break;
                case 1: // Broadcast to all active bots
                    for (let i = 0; i < bots.length; i++) {
                        if (bots[i] && bots[i].readyState == 1) {
                            bots[i].send(e.data[1]);
                        }
                    }
                    break;
                case 2: // Handle server change
                    url = e.data[1];
                    break;
                case 3: // Handle mouse & cam data
                    mouse = e.data[1];
                    cam = e.data[2];
                    break;
            }
        }
    });
    worker.onmessage = function(e) {
        switch (e.data[0]) {
            case 0: // Print to In-Game console
                print(e.data[1], e.data[2]);
                break;
        }
    }
    window.console = console; // Lapa likes to override the console function so we use this to stop that
    // Event listeners
    window.addEventListener("keydown", CaptureKeyPress);
    window.addEventListener("keyup", CaptureKeyPress);
    // In-Game Console
    var log = document.createElement("CANVAS");
    var logctx = log.getContext("2d");
    var bottext = "Bot info here";
    var othertext = "Other info here";
    document.body.appendChild(log);
    log.style.all = "unset";
    logctx.font = "100px Arial";
    log.width = 1000;
    log.height = 50;
    log.style.zIndex = "1000000";
    log.style.pointerEvents = "none";
    log.style.position = "absolute";
    log.style.bottom = "10px";
    log.style.left = "200px";
    logctx.fillStyle = "#FFFFFF";
    logctx.scale(2, 2);
    logctx.fillText("Bot info here | Other info here", 0, 15);
    // Variables
    var speed = 160; // Roughly the safe limit lapas server accepts
    var processing = 0; // This is to prevent running the same function more than once at a time or running another one while one is in progress
    var botmode = 0;
    var socket = undefined;
    var togglebots = 0;
    var AllOibs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49];
    var OibsAndQueen = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49];
    var keys = {
        e: 0
    };
    var mouse = {
        x: 0,
        y: 0
    };
    window.addEventListener("mousemove", function(e){ mouse.x = e.x; mouse.y = e.y; });
    // Functions
    WebSocket.prototype._send = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {
        socket = this;
        window.socket = this;
        worker.postMessage([2, socket.url]);
        botsend(data);
        this._send(data);
        this.addEventListener('close', function() {
            socket = undefined;
        }, false);
        this.addEventListener('error', function() {
            socket = undefined;
        }, false);
        this.send = function(data) {
            console.log(data);
            this._send(data);
            botsend(data);
        }
    }

    function botsend(data) {
        if (botmode == 1) {
            worker.postMessage([1, data]);
        }
    }

    function CaptureKeyPress(e) {
        if (window.game.chat.info.input.info.state == 0 && window.game.is_run == true) {
            var key = e.key.toLowerCase();
            if (e.type == "keydown") {
                worker.postMessage([0, key]);
                switch (key) {
                    case "f4":
                        e.preventDefault();
                        togglebots++;
                        if (togglebots > 1) {
                            togglebots = 0;
                            print(1, "Bots turned off");
                            print(0, "Bots: 0");
                        } else {
                            print(1, "Bots turned on");
                        }
                        break;
                    case "f6":
                        e.preventDefault();
                        botmode++;
                        if (botmode > 2) {
                            botmode = 0;
                        }
                        switch (botmode) {
                            case 0:
                                print(1, "Bot mode: Do nothing");
                                break;
                            case 1:
                                print(1, "Bot mode: Mirror player");
                                break;
                            case 2:
                                print(1, "Bot mode: Swarm Cursor");
                                break;
                        }
                        break;
                    case "e":
                        resetAllBut("e");
                        if (keys.e == 0) {
                            keys.e = 1;
                            railgun();
                        }
                        break;
                }
            }
            if (e.type == "keyup") {
                switch (key) {
                    case "e":
                        keys.e = 0;
                        break;
                }
            }
        }
    }
    function frame() {
        worker.postMessage([3, mouse, {rx: window.player.cam.rx, ry: window.player.cam.ry}]);
        window.requestAnimationFrame(frame);
    }
    function resetAllBut(key) { // If u user is for example holding railgun key and then also hold down move key... then railgun will stop (this is to prevent any wierd stuff like 2 things trying to run)
        for (let i = 0; i < Object.keys(keys).length; i++) {
            if (Object.keys(keys)[i] != key) {
                keys[Object.keys(keys)[i]] = 0;
            }
        }
    }

    function railgun() {
        if (processing == 0) {
            processing = 1;
            socket.send('[2,['+OibsAndQueen+']]');
            var i = 0;
            var loops = [];
            for (i; i < 5; i++) {
                if (i == 0) {
                    setTimeout(function(){
                        socket.send('[3,'+(mouse.x-window.player.cam.rx)+','+(mouse.y-window.player.cam.ry)+',[0]]');
                        console.log(1);
                    }, speed * (i + 1));
                } else {
                    loops.push(
                        setTimeout(function(){
                            if (keys.e == 1) {
                                socket.send('[3,'+(mouse.x-window.player.cam.rx)+','+(mouse.y-window.player.cam.ry)+',[0]]');
                            } else {
                                for (let e = 0; i < loops.length; e++) {
                                    clearInterval(loops[0]);
                                    loops.splice(0, 1);
                                }
                                i = 1;
                                setTimeout(function(){
                                    processing = 0;
                                    if (keys.e == 1) {
                                        railgun();
                                    }
                                }, speed);
                            }
                        }, speed * (i + 1)));
                }
            }
            setTimeout(function(){
                if (i != 1) {
                    processing = 0;
                    if (keys.e == 1) {
                        railgun();
                    }
                }
            }, speed * (i + 1));
        }
    }

    function print(which, txt) {
        if (which == 0) {
            bottext = txt;
        } else {
            othertext = txt;
        }
        logctx.clearRect(0, 0, log.width, log.height);
        logctx.fillText(bottext + " | " + othertext, 0, 15);
    }

    function forgeID(length) {
        let result = "";
        let characters =
            "0123456789";
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    function inlineWorker(e) {
        var r = URL.createObjectURL(new Blob(["(", e.toString(), ")()"], {
            type: "application/javascript"
        })),
            t = new Worker(r);
        URL.revokeObjectURL(r);
        return t
    };
    frame();
})();