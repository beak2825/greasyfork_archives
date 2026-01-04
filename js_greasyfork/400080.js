// ==UserScript==
// @icon         https://balz.io/icon-white-dark.png
// @name         Bots-PersonalUse
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes skin every 0.1 seconds.
// @author       Tsu!
// @match        balz.io/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400080/Bots-PersonalUse.user.js
// @updateURL https://update.greasyfork.org/scripts/400080/Bots-PersonalUse.meta.js
// ==/UserScript==

window.data = {
    origin: location.origin
};

(function(info, user) {
    window.user = user;
    if (WebSocket.prototype._send) {
        WebSocket.prototype.send = function(pkt) {
            this._send(pkt);

            if (pkt instanceof ArrayBuffer) pkt = new DataView(pkt);
            else if (pkt instanceof DataView) pkt = pkt;
            else if (pkt instanceof Uint8Array) pkt = new DataView(pkt.buffer);
            else return;

            switch (pkt.byteLength) {
                case 21:
                    if (pkt.getInt8(0, true) === 16) {
                        user.x = pkt.getFloat64(1, true);
                        user.y = pkt.getFloat64(9, true);
                        user.byteLength = pkt.byteLength;
                    }
                    break;

                case 13:
                    if (pkt.getUint8(0, true) === 16) {
                        user.x = pkt.getInt32(1, true);
                        user.y = pkt.getInt32(5, true);
                        user.byteLength = pkt.byteLength;
                    }
                    break;

                case 10:
                    if (pkt.getUint8(0, true) === 2) { //deeeep.io
                        user.moveBuffer = pkt.buffer;
                    }
                    break;

            }

            if(info.botServer != this.url && user.server != this.url) {
                user.server = this.url;
            }
        }
    }

    function appendGUI(el) {
        if (document.getElementsByTagName("body").length == 0) {
            console.log("Waiting for body...");
            return setTimeout(appendGUI, 100, el);
        }

        document.getElementsByTagName("body")[0].appendChild(el);
        setupElements();

        el = document.createElement("script");
        el.src = "https://200agar.net/bots/iziToast.min.js";
        document.getElementsByTagName("body")[0].appendChild(el);
        checkVersion();
    }

    (async function(guiHtml, el) {
        guiHtml = await fetch(guiHtml);
        console.log("Fetch GUI:", guiHtml.ok);
        guiHtml = await guiHtml.text();
        
        el = document.createElement("BotGUI");
        el.innerHTML = guiHtml;

        appendGUI(el);
    })(info.defaultGUI);

    class Client {
        constructor() {
            this.socket = null;
            this.active = false;
            this.started = false;
            this.setup();
            this.startMoveInterval();
        }
       
        setup() {
            this.socket = info.io.connect(info.botServer);

            this.socket.on("connect", () => {
                info.elements.serverStatus.innerText = "Connected";
                iziToast.success({
                      timeout: 4000,
                      iconColor: '#000',
                      titleColor: '#000',
                      position: 'bottomLeft',
                      backgroundColor: 'rgba(166,239,184,.9)',
                      messageColor: 'rgba(0,0,0,.6)',
                      title: 'Success',
                      message: 'Connected to server!',
                });
            });

            this.socket.on("auth", msg => {
                this.socket.emit("auth", 1234);
            });

            this.socket.on("verified", () => {
                info.elements.serverStatus.innerText = "Ready";
                iziToast.success({
                      timeout: 4000,
                      iconColor: '#000',
                      titleColor: '#000',
                      position: 'bottomLeft',
                      backgroundColor: 'rgba(166,239,184,.9)',
                      messageColor: 'rgba(0,0,0,.6)',
                      title: 'Success',
                      message: 'Verified user!',
                });
            });

            this.socket.on("started", () => {
                info.elements.toggleButton.setAttribute("class", "btn btn-danger");
                info.elements.toggleButton.innerText = "Stop Bots";
                info.elements.serverStatus.innerText = "Running";
                this.active = true;
            });

            this.socket.on("stopped", () => {
                info.elements.toggleButton.setAttribute("class", "btn btn-success");
                info.elements.toggleButton.innerText = "Start Bots";
                info.elements.serverStatus.innerText = "Ready";
                info.elements.botCounter.innerText = "0/0";
                this.active = false;
            });

            this.socket.on("updateBotCount", msg => {
                info.elements.botCounter.innerText = `${msg.spawned}/${msg.connected}`;
            });

            this.socket.on("disconnect", () => {
                info.elements.toggleButton.setAttribute("class", "btn btn-success");
                info.elements.toggleButton.innerText = "Start Bots";
                info.elements.serverStatus.innerText = "Connecting...";
                info.elements.botCounter.innerText = "0/0";
                this.active = false;
                this.started = false;
                iziToast.error({
                      timeout: 4000,
                      iconColor: '#000',
                      titleColor: '#000',
                      position: 'bottomLeft',
                      backgroundColor: 'rgba(255,175,180,.9)',
                      messageColor: 'rgba(0,0,0,.6)',
                      title: 'Error',
                      message: 'Server disconnected!',
                });
                /*iziToast.error({
                      timeout: 8000,
                      iconColor: '#000',
                      titleColor: '#000',
                      position: 'topCenter',
                      backgroundColor: 'rgba(255,175,180,.9)',
                      messageColor: 'rgba(0,0,0,.6)',
                      title: 'Error | 200bots.ga',
                      message: 'Server is offline or under maintenance! Please try again later or join our discord server to contact a Developer!',
                      buttons: [
                          ['<button><b>JOIN</b></button>', function (instance, toast) {
         
                              location.href = "http://200bots.ga/";
         
                          }, true],
                          ['<button>CANCEL</button>', function (instance, toast) {
         
                              instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
         
                         }]
                      ]
                });*/
            });
            
        }

        startBots() {
            if (user.server == "" || this.started) return;
            this.socket.emit("start", {
                GameServer: user.server,
                Origin: location.origin
            });
            this.started = true;
        }

        stopBots() {
            if (!this.started)  return;
            this.socket.emit("stop");
            this.started = false;
        }

        move(x, y) {
            this.socket.emit("move", {
                type: 0,
                x: x,
                y: y
            });
        }

        moveWithBuffer(buffer) {
            if (!buffer) return;
            this.socket.emit("move", {
                type: 1,
                buffer: buffer
            });
        }

        split() {
            this.socket.emit("split");
        }

        eject() {
            this.socket.emit("eject");
        }

        startMoveInterval() {
            switch (location.host) {
                case "deeeep.io":
                    this.moveInterval = setInterval(() => {

                        if (this.active && this.started) this.moveWithBuffer(user.moveBuffer);

                    }, 150);
                
                default:
                    this.moveInterval = setInterval(() => {
                        if (user.history.x != user.x || user.history.y != user.y) { // if moved
        
                            user.history.x = user.x;
                            user.history.y = user.y;
        
                            if (this.active && this.started) this.move(~~user.x, ~~user.y);
        
                        } else { // not moved
        
                            user.history.c++;
                            
                            if (user.history.c > 7 && this.active) {
                                if (this.active && this.started) this.move(~~user.x, ~~user.y);
                                user.history.c = 0;
                            }
        
                        }
                    }, 150);
                    break;
            }
        }
    }


    function setupElements() {
        if (!document.getElementById("toggleButton")) {
            console.log("Waiting for element...");
            return setTimeout(setupElements, 100);
        }

        info.elements.toggleButton = document.getElementById("toggleButton");
        info.elements.botCounter = document.getElementById("botCounter");
        info.elements.serverStatus = document.getElementById("serverStatus");
        user.Client = new Client();
    
        info.elements.toggleButton.addEventListener("click", () => {
            if (user.Client.active) user.Client.stopBots();
            else user.Client.startBots();
        });
    }

document.addEventListener('keydown', function(event) {
    console.log(event.keyCode, event.which);
    switch (event.keyCode || event.which) {
        case 87:
            //window.core.eject();
            break;
        case 90: //Z
            user.Client.split();
            break;
        case 88: //X
            user.Client.eject();
            break;
        case 79: //O
            user.Client.startBots();
            break;
        case 80: //P
            user.Client.stopBots();
            break;
        case 67:
            //window.client.spam();
            break;
    }
}.bind(this));

    //Fix Esc
    switch (location.origin.split("://")[1]) {
        case "cellsbox.io":
             alert('200bots.ga\n\nO = Start Bots and P = Stop Bots, bot panel for this game will be available soon!');
             break;
        case "ogar.be":
            document.addEventListener('keydown', event => {
                switch (event.keyCode || event.which) {
                    case 27:
                        document.getElementById("overlays").style.display = "block";
                        break;
                }
            });
            
    }

    function checkVersion() {
        if (!window.iziToast) {
            return setTimeout(checkVersion, 100);
        }

        window.iziToast.settings({
            title: 'Information',
            theme: 'dark',
            progressBarColor: '#00ffb8',
            backgroundColor: '#333',
            position: 'topCenter',
            timeout: 5000,
            pauseOnHover: true,
            layout: 2
        });

        if (info.version != userScriptVersion) window.iziToast.question({
            close: false,
            displayMode: 'once',
            id: 'question',
            zindex: 999,
            title: 'Alert | 200bots.ga',
            message: 'New Update Available! Do you want to update your script?',
            buttons: [
                ['<button><b>YES</b></button>', function (instance, toast) {
         
                    location.href = "http://200agar.net/";
         
                }, true],
                ['<button>NO</button>', function (instance, toast) {
         
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
         
                }]
            ]
        });
        
    }

})({
    version: "1.2.8",
    botServer: "ws://88.214.57.12:8080",
    io: window.SocketIO,
    defaultGUI: "https://ex-script.com/fstyle/OhGG/BotGUI.php",
    elements: {}
}, {
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
    byteLength: null,
    moveBuffer: null,
    server: '',
    history: {
        x: 0,
        y: 0,
        c: 0
    }
});