// ==UserScript==
// @name         Xero-Bots | .io Bots 2022 DISCONTINUED SUPPORT 
// @namespace    https://discord.com/invite/bAstbAfem9
// @version      30.6.11
// @description  The best bots for popular agar.io clone games. Security update.
// @author       Tatsuya & Enes
// @match        *.oceanar.io/*
// @match        *.aquar.io/*
// @match        *.cellsbox.io/*
// @match        *.www.inciagario.net/*
// @match        *.agariott.com/*
// @match        *.bubleroyal.com/*
// @run-at       document-start
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJNVczs2oU6qdgJBw2ZSSe4ibVAGjaZMgWosjYzjXZU1B6Lp9MHoQ27ARzAtofWYHxz3U&usqp=CAU
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433283/Xero-Bots%20%7C%20io%20Bots%202022%20DISCONTINUED%20SUPPORT.user.js
// @updateURL https://update.greasyfork.org/scripts/433283/Xero-Bots%20%7C%20io%20Bots%202022%20DISCONTINUED%20SUPPORT.meta.js
// ==/UserScript==

var Xero_Protect_Class = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function newcclosure(target, HookedArgs) {
    if (typeof target != 'function') return console.error("expected function as argument #1");
    if (HookedArgs) return console.error("expected one function as an argument");

    return target;
}

function create_secure_function(args, unexpected) {
    return newcclosure(args, unexpected);
}

var User = new(function() {
    function _ClassHookOne() {}
    Xero_Protect_Class(_ClassHookOne, [{
        key: '_Init',
        value: create_secure_function(function() {
            this.bots = [];
            this.botAmt = ((window.location.host.length) * 4);
            this.serverIP = '';
            this.cords = {
                'x': 0,
                'y': 0
            };
            this.moveBuffer = null;
            this.startedBots = false;
            this.gui = GUI.Init();
            this.pushBots();
        })
    }, {
        key: 'spawnedBots',
        get: create_secure_function(function() {
            return this.bots.filter(bot => bot.WebSocket && bot.WebSocket.readyState === WebSocket.OPEN).length;
        })
    }, {
        key: 'pushBots',
        value: create_secure_function(function() {
            for (let i = 0; i < this.botAmt; i++) {
                this.bots.push(new Bot())
            };
            this.guiInt();
        })
    }, {
        key: 'guiInt',
        value: create_secure_function(function() {
            this.GUIint = setInterval(() => {
                if (!GUI.injected) return;
                GUI.updateVal(this.spawnedBots, this.botAmt)
            }, 200)
        })
    }, {
        key: 'splitBots',
        value: create_secure_function(function() {
            this.bots.forEach((bot) => {
                bot.split()
            })
        })
    }, {
        key: 'ejectBots',
        value: create_secure_function(function() {
            this.bots.forEach((bot) => {
                bot.eject()
            })
        })
    }, {
        key: 'startBots',
        value: create_secure_function(function() {
            if (this.startedBots || !this.serverIP) return;
            if (this.serverIP == undefined) return;
            this.bots.forEach((bot) => {
                bot.connect(this.serverIP)
            });
            this.startedBots = true
        })
    }, {
        key: 'stopBots',
        value: create_secure_function(function() {
            if (!this.startedBots) return;
            this.bots.forEach((bot) => {
                bot.terminate()
            });
            this.startedBots = false
        })
    }]);
    return _ClassHookOne;
}())();

var GUI = new(function() {
    function _ClassHookTwo() {}
    Xero_Protect_Class(_ClassHookTwo, [{
        key: 'Init',
        value: create_secure_function(function() {
            this.injected = false;
            this.startGUI();
            this.startKeys();
        })
    }, {
        key: 'startGUI',
        value: create_secure_function(async function() {
            /*
            this.guiCode = await this.guiFetch();
            if (!this.guiCode) {
                return alert('Failed to load bot GUI. If this keeps happening, contact a developer.');
            }
            */
            this.guiCode = `<div id="botsGUI" style=" left: 50%; top: 5px; z-index: 10000; -webkit-transform: translateX(-50%); transform: translateX(-50%); position: absolute; background-color: #3c3c3c; padding: 5px; border-radius: 0.25rem; display: -webkit-box; display: -ms-flexbox; display: flex; visibility: hidden; " > <p id="title" style=" user-select: none; box-sizing: border-box; margin: 0; cursor: pointer; font-weight: 700; font-family: CarterOne; text-decoration: none; line-height: 1.5; color: white; margin-right: 5px; font-size: 14px !important; animation: random 5s infinite; padding: 2px 5px !important; " > Xero-Bots </p> <p id="botAmount" style=" user-select: none; box-sizing: border-box; margin: 0; font-weight: 700; font-family: CarterOne; text-decoration: none; line-height: 1.5; color: white; margin-right: 5px; font-size: 14px !important; padding: 2px 5px !important; " > 0 / 0 </p> <button class="btn primary small" id="startBots" style=" user-select: none; box-sizing: border-box; margin: 0; cursor: pointer; font-weight: 700; font-family: CarterOne; border: 1px solid transparent; transition: color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease, border 0.3s ease, -webkit-box-shadow 0.3s ease; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); text-decoration: none; line-height: 1.5; border-radius: 0.2rem; color: white; background: #038c9e; border-color: #038c9e; margin-right: 5px; font-size: 14px !important; padding: 2px 5px !important; " > Start Bots </button> <button class="btn secondary small" id="stopBots" style=" user-select: none; box-sizing: border-box; margin: 0; cursor: pointer; font-weight: 700; font-family: CarterOne; border: 1px solid transparent; transition: color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease, border 0.3s ease, -webkit-box-shadow 0.3s ease; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); text-decoration: none; line-height: 1.5; border-radius: 0.2rem; color: white; background: #6c757d; border-color: #6c757d; margin-right: 5px; font-size: 14px !important; padding: 2px 5px !important; display: none; " > Stop Bots </button> </div> <style> @keyframes random { 0% { color: #d63e3e; } 25% { color: yellow; } 50% { color: #03e06f; } 75% { color: #1967fc; } 100% { color: #d63e3e; } } </style> <div id="elemX155674"> <div class="xerobots-title"> Loading Xero-Bots modules... </div> <div class="xerobots-content"> <div class="progress"> <div class="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style=" width : 0%"> </div> </div> </div> </div> <style> .xerobots-title { color: #ffffff; text-align: center; padding: 7px 8px 5px 10px; background-color: #3c3c3c; font-size: 14px; font-weight: bold; } #elemX155674 { min-width: 100px; min-height: 50px; display: inline-block; background-color: #1b1c21; position: absolute; font: 12px Arial, sans-serif; box-sizing: border-box; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; cursor: default; color: #ffffff; top: 50%; left: 50%; transform: translate(-50%, -50%); border-color: rgb(77, 100, 122); z-index: 10000000; } .progress { display: -webkit-box; display: -ms-flexbox; display: flex; height: 1rem; overflow: hidden; font-size: .75rem; background-color: #e9ecef; border-radius: .25rem; } .bg-success { background-color: #28a745!important; } .progress-bar-animated { -webkit-animation: progress-bar-stripes 1s linear infinite; animation: progress-bar-stripes 1s linear infinite; } .progress-bar-striped { background-image: linear-gradient( 45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent); background-size: 1rem 1rem; } .progress-bar { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; -webkit-box-pack: center; -ms-flex-pack: center; justify-content: center; color: #fff; text-align: center; background-color: #007bff; transition: width .6s ease; } .xerobots-content { background-color: #333333; padding: 10px 10px; } </style>`
            this.hookWeb(this.guiCode);
        })
    }, {
        key: 'guiFetch',
        value: create_secure_function(async function() {
            const GUI = await fetch('https://parallel-almondine-hail.glitch.me/');
            if (!GUI.ok) {
                return console.log('[GUI STATUS]', GUI);
            }
            return await GUI.text();
        })
    }, {
        key: 'hookWeb',
        value: create_secure_function(async function(html) {
            const div = document.createElement('div');
            div.innerHTML = html;
            document.body.appendChild(div);
            document.title = "Xero-Bots | Active";
            await this.loadSeq()

            this.divScramble = {
                startButton: this.scrambleDiv('startBots'),
                stopButton: this.scrambleDiv('stopBots'),
                botCount: this.scrambleDiv('botAmount'),
                DiscordURL: this.scrambleDiv('title'),
                botsGUI: this.scrambleDiv('botsGUI')
            };

            this.handleDivs(['elemX155674'], ['hidden'], 2);
            this.bind(this.divScramble.startButton, 1);
            this.bind(this.divScramble.stopButton, 2);
            this.bind(this.divScramble.DiscordURL, 3);
            this.handleDivs([this.divScramble.botsGUI], ['visible'], 2);

            this.injected = true;
        })
    }, {
        key: 'loadSeq',
        value: create_secure_function(function() {
            return new Promise(async (resolve, reject) => {
                var i = 0;
                if (i == 0) {
                    i = 1;
                    var elem = document.getElementsByClassName(
                        'progress-bar bg-success progress-bar-striped progress-bar-animated')[0];
                    var width = 1;
                    var id = setInterval(frame, 60);

                    function frame() {
                        if (width >= 100) {
                            clearInterval(id);
                            i = 0;
                            resolve()
                        } else {
                            width++;
                            elem.style.width = width + "%";
                        }
                    }
                }
            });
        })
    }, {
        key: 'bind',
        value: create_secure_function(function(divs, binder) {
            document.getElementById(divs).onclick = () => {
                    if (binder) {
                        switch (binder) {
                            case 1:
                                User.startBots();
                                this.handleDivs([this.divScramble.startButton, this.divScramble.stopButton], ['none', 'block'], 3);
                                break;
                            case 2:
                                User.stopBots();
                                this.handleDivs([this.divScramble.startButton, this.divScramble.stopButton], ['block', 'none'], 3);
                                break;
                            case 3:
                                window.location.href = 'https://discord.gg/bAstbAfem9';
                                break;
                        }
                    }
            };
        })
    }, {
        key: 'scrambleDiv',
        value: create_secure_function(function(div) {
            const randInt = (((1 + Math.random()) * 0x10000) | 0);
            document.getElementById(div).id = randInt;
            return randInt;
        })
    }, {
        key: 'handleDivs',
        value: create_secure_function(function(divIDs, options, type) {
            const boxes = divIDs;
            for (let i = 0; i < boxes.length; i++) {
                const element = boxes[i];
                switch (type) {
                    case 1:
                        document.getElementById(element).innerHTML = options[i];
                        break;
                    case 2:
                        document.getElementById(element).style.visibility = options[i];
                        break;
                    case 3:
                        document.getElementById(element).style.display = options[i];
                        break;
                }
            }
        })
    }, {
        key: 'findDiv',
        value: create_secure_function(function(divID) {
            return document.getElementById(divID);
        })
    }, {
        key: 'updateVal',
        value: create_secure_function(function(spawned, max) {
            document.getElementById(this.divScramble.botCount).innerText = spawned + " / " + max
        })
    }, {

        key: 'startKeys',
        value: create_secure_function(function() {
            window.addEventListener('keypress', (event) => {
                if (event.isTrusted) {
                    switch (event.key) {
                        case 'q':
                            User.splitBots();
                            break;
                        case 'w':
                            User.ejectBots();
                            break;
                    }
                }
            });
        })
    }]);
    return _ClassHookTwo;
}())();

class _00483 {
    constructor() {
        this.bytes = [];
    }
    writeUint8(val) {
        this.bytes.push(val);
    }
    writeUint16(val) {
        this.bytes.push(val & 0xFF);
        this.bytes.push(val >> 0x8 & 0xFF);
    }
    writeString(str) {
        this.writeUint16(str.length);
        for (var i = 0; i < str.length; i++) {
            this.writeUint16(str.charCodeAt(i));
        }
    }
    build() {
        return new Uint8Array(this.bytes).buffer;
    }
}

var Bot = function() {
    function _ClassHookThree() {
        this.init();
    }
    Xero_Protect_Class(_ClassHookThree, [{
        key: 'init',
        value: create_secure_function(function() {
            this.urlparse = /(\w+)\:\/\/(\w+.\w+)/gi.exec(window.location.origin)[2];
            this.utils = {
                botNames: ["Xero-Bots", "Made by Tatsuya", ".gg/bAstbAfem9"],
                randName() {
                    return this.botNames[Math.floor(Math.random() * this.botNames.length)]
                },
                grabRecaptchaToken(wss, siteKey, callback) {
                    return new Promise(async (resolve, reject) => {
                        const hookGrecaptcha = window.grecaptcha;
                        if (!hookGrecaptcha) return alert("No recaptcha anchor found!");
                        hookGrecaptcha.execute(siteKey, callback).then((token) => {
                            const parsedUrl = wss.split('challenge')[0] + 'challenge=' + token;
                            resolve(parsedUrl);
                        });
                    });
                }
            }
        })
    }, {
        key: 'connect',
        value: create_secure_function(async function(url) {
            if (this.protocol == 3) {
                url = await this.utils.grabRecaptchaToken(url, '6LeBKrcUAAAAAC2X1BwwSPx2uCVrTBF61x3U2FXb', {
                    action: 'playbutton'
                })
            }
            this.server = url;

            this.WebSocket = new WebSocket(url);

            this.WebSocket.binaryType = "arraybuffer";

            this.WebSocket.onmessage = this.onMessage.bind(this);
            this.WebSocket.onopen = this.onOpen.bind(this);
            this.WebSocket.onclose = this.onClose.bind(this);
            this.WebSocket.onerror = this.onError.bind(this);

            this.randomizeMovement = false;

            this.botID = Math.floor(Math.pow(2, 14) * Math.random()).toString(36);
            this.name = this.utils.randName() + ' | ' + this.botID;
        })
    }, {
        key: 'terminate',
        value: create_secure_function(function() {
            if (this.WebSocket) {
                this.WebSocket.close();
                delete this.WebSocket;
            }
            clearInterval(this.moveInt);

            clearInterval(this.pingInt);

            clearTimeout(this.spawnInt);
        })
    }, {
        key: 'onMessage',
        value: create_secure_function(function(message) {})
    }, {
        key: 'onOpen',
        value: create_secure_function(function() {
            switch (this.protocol) {
                case 1:
                    this.spawn();
                    this.sendPing();
                    break;
                case 2:
                    var RawMetatables = {
                            op: 'clientVersion',
                            protocolKind: 'TsOgarRx',
                            protocolSig: 'P2NWmM',
                            protocolRev: 'orx108'
                        },
                        encoded = encodeURIComponent(JSON.stringify(RawMetatables)),
                        clientSideID = this.GenEnvSig(10);

                    var ClientInfo = new _00483();
                    ClientInfo.writeUint8(195);
                    ClientInfo.writeString(encoded);
                    this.send(ClientInfo.build());

                    var SendRevs = new _00483();
                    SendRevs.writeUint8(126);
                    SendRevs.writeString(RawMetatables.protocolKind);
                    SendRevs.writeString(RawMetatables.protocolSig);
                    SendRevs.writeString(RawMetatables.protocolRev);
                    SendRevs.writeString(clientSideID);
                    this.send(SendRevs.build());

                    var ClientData = new _00483();
                    ClientData.writeUint8(173);
                    ClientData.writeString(this.name);
                    this.send(ClientData.build());

                    this.spawn();
                    setInterval(this.sendMsg('ZGlzY29yZC5nZy9iQXN0YkFmZW05'), 10000);
                    break;
                case 3:
                    var Init = this.Buffer(5);
                    Init.setUint8(0, 87);
                    Init.setUint32(1, 1, true);
                    this.send(Init);

                    Init = this.Buffer(5);

                    Init.setUint8(0, 100);
                    Init.setUint32(1, 1332175218, true);
                    this.send(Init);
                    this.spawn();
                    break;
                case 4:
                    Init = this.Buffer(5);
                    Init.setUint8(0, 254);
                    Init.setUint32(1, 1, true);
                    this.send(Init);

                    Init = this.Buffer(5);

                    Init.setUint8(0, 255);
                    Init.setUint32(1, 1332175218, true);
                    this.send(Init);
                    this.spawn();
                    break;
            }
            this.spawnInt = setInterval(this.spawn.bind(this), 3000);
            this.moveInt = setInterval(this.mouseBuffer.bind(this), 150);
        })
    }, {
        key: 'onClose',
        value: create_secure_function(function() {
            clearInterval(this.moveInt);

            clearInterval(this.pingInt);

            clearTimeout(this.spawnInt);
        })
    }, {
        key: 'onError',
        value: create_secure_function(function() {})
    }, {
        key: 'spawn',
        value: create_secure_function(function() {
            switch (this.protocol) {
                case 1:
                    var spawnBuffer = this.Buffer(52);
                    spawnBuffer.setUint8(0, 22);
                    var o = 0;
                    for (; o < 25; ++o) {
                        spawnBuffer.setUint16(1 + 2 * o, o < this.name.length ? this.name.charCodeAt(o) : 0, true);
                    }
                    spawnBuffer.setUint8(51, 255)
                    this.send(spawnBuffer, true);
                    break;
                case 2:
                    this.send(new Uint8Array([27]));
                    this.send(new Uint8Array([33, 3, 1]));
                    break;
                case 3:
                    var spawnbuf = this.Buffer(3 + 2 * this.name.length);
                    spawnbuf.setUint8(0, /*111*/ 101);
                    for (var z = 0; z < this.name.length + 1; ++z) {
                        spawnbuf.setUint16(1 + 2 * z, this.name.charCodeAt(z) || /*58641*/ /*57617*/ 57344, true);
                    }
                    this.send(spawnbuf, true);
                    break;
                case 4:
                    var login = 'nic';
                    var num = 0;
                    var msg = this.Buffer(5 + 2 * login.length);
                    var offset = 0;
                    msg.setUint8(0, 0);
                    msg.setUint32(1, num, true);
                    offset = 5;
                    for (var i = 0; i < login.length; ++i) {
                        msg.setUint16(offset, login.charCodeAt(i), true);
                        offset += 2;
                    }
                    this.send(msg);
                    break;
            }
        })
    }, {
        key: 'sendUint8',
        value: create_secure_function(function(offset) {
            var oneByte = this.Buffer(1);
            oneByte.setUint8(0, offset);
            this.send(oneByte);
        })
    }, {
        key: 'sendPing',
        value: create_secure_function(function() {
            let dateData = 268435455 & Date.now();
            let ping = this.Buffer(0x5);
            ping.setUint8(0x0, 0x1);
            ping.setUint32(0x1, dateData);
            this.send(ping, true);
        })
    }, {
        key: 'minMaxVal',
        value: create_secure_function(function(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        })
    }, {
        key: 'split',
        value: create_secure_function(function() {
            switch (this.protocol) {
                case 2:
                    this.send(new Uint8Array([33, 0, 1]));
                    break;
                case 3:
                case 4:
                    this.send(new Uint8Array([17]));
                    break;
            }
        })
    }, {
        key: 'eject',
        value: create_secure_function(function() {
            switch (this.protocol) {
                case 2:
                    this.send(new Uint8Array([33, 1, 255]));
                    break;
                case 3:
                case 4:
                    this.send(new Uint8Array([21]));
                    break;
            }
        })
    }, {
        key: 'sendMsg',
        value: create_secure_function(function(message) {
            switch (this.protocol) {
                case 2:
                    var _00640 = new _00483(),
                        f = 0,
                        outsource = atob;
                    _00640.writeUint8(98);
                    _00640.writeUint8(f ? 1 : 0);
                    _00640.writeString(outsource(message));
                    this.send(_00640.build());
                    break;
            }
        })
    }, {
        key: 'mouseBuffer',
        value: create_secure_function(function() {
            switch (this.protocol) {
                case 1:
                case 2:
                    this.send(User.moveBuffer)
                    break;
                case 3:
                    var MouseBuf = this.Buffer(21)
                    MouseBuf.setUint8(0, 104);
                    MouseBuf.setFloat64(1, User.cords.x, true);
                    MouseBuf.setFloat64(9, User.cords.y, true);
                    MouseBuf.setUint32(17, 0, true);
                    this.send(MouseBuf, true);
                    break;
                case 4:
                    MouseBuf = this.Buffer(21)
                    MouseBuf.setUint8(0, 16);
                    MouseBuf.setFloat64(1, User.cords.x, true);
                    MouseBuf.setFloat64(9, User.cords.y, true);
                    MouseBuf.setUint32(17, 0, true);
                    this.send(MouseBuf, true);
                    break;
            }
        })
    }, {
        key: 'Buffer',
        value: create_secure_function(function(buf) {
            return new DataView(new ArrayBuffer(!buf ? 1 : buf))
        })
    }, {
        key: 'open',
        get: create_secure_function(function() {
            return this.WebSocket && this.WebSocket.readyState === 1;
        })
    }, {
        key: 'protocol',
        get: create_secure_function(function() {
            switch (true) {
                case /oceanar.io/.test(this.urlparse):
                case /aquar.io/.test(this.urlparse):
                    return 1;
                case /cellsbox.io/.test(this.urlparse):
                    return 2;
                case /agariott.com/.test(this.urlparse):
                case /www.inciagario/.test(this.urlparse):
                    return 3;
                case /bubleroyal.com/.test(this.urlparse):
                    return 4;
            }
            return 0;
        })
    }, {
        key: 'GenEnvSig',
        value: create_secure_function(function(length) {
            var result = [];
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
            }
            return result.join('');
        })
    }, {
        key: 'send',
        value: create_secure_function(function(data, encrypt) {
            if (this.open) {
                if (encrypt) {
                    this.WebSocket.send(data.buffer);
                } else this.WebSocket.send(data);
            }
        })
    }]);
    return _ClassHookThree;
}();

if (location.host.includes('bubleroyal.com') || location.host.includes('agariott.com') || location.host.includes('www.inciagario.net') || location.host
    .includes('agar.live')) {
    window.WebSocket = class extends WebSocket {
        constructor() {
            let ws = super(...arguments);
            window.sockets?.push(this);

            setTimeout(() => {
                ws.onmessage = new Proxy(ws.onmessage, {
                    apply(target, thisArg, argArray) {
                        let data = argArray[0].data;
                        return target.apply(thisArg, argArray);
                    }
                });
            });
        }
    }

    WebSocket.prototype.send = new Proxy(WebSocket.prototype.send, {
        apply(target, thisArg, argArray) {
            var res = target.apply(thisArg, argArray);
            let pkt = argArray[0];
            if (typeof pkt == 'string') return res;
            if (pkt instanceof ArrayBuffer) pkt = new DataView(pkt);
            else if (pkt instanceof DataView) pkt = pkt;
            else pkt = new DataView(pkt.buffer);
            switch (pkt.getUint8(0, true)) {
                case 104:
                case 185:
                    User.cords.x = pkt.getFloat64(1, true);
                    User.cords.y = pkt.getFloat64(9, true);
                    break;
                case 0:
                    switch (pkt.byteLength) {
                        case 9:
                            User.moveBuffer = pkt;
                            break;
                    }
                    break;
                case 16:
                    switch (pkt.byteLength) {
                        case 13:
                            User.cords.x = pkt.getUint32(1, true);
                            User.cords.y = pkt.getUint32(5, true);
                            break;
                        case 21:
                            User.cords.x = pkt.getFloat64(1, true);
                            User.cords.y = pkt.getFloat64(9, true);
                            break;
                    }
                    break;
            }
            if (User.serverIP !== thisArg.url) {
                User.serverIP = thisArg.url;
            }
            return res;
        }
    });
    window.addEventListener('load', () => {
        User._Init();
    });
} else {
    window.addEventListener('load', () => {
        User._Init();
        WebSocket.prototype.realSend = WebSocket.prototype.send;
        WebSocket.prototype.send = function(pkt) {
            this.realSend(pkt);
            if (typeof pkt == 'string') return;
            if (this.url.includes('localhost')) return;
            if (pkt instanceof ArrayBuffer) pkt = new DataView(pkt);
            else if (pkt instanceof DataView) pkt = pkt;
            else pkt = new DataView(pkt.buffer);
            switch (pkt.getUint8(0, true)) {
                case 185:
                    User.cords.x = pkt.getFloat64(1, true);
                    User.cords.y = pkt.getFloat64(9, true);
                    break;
                case 5:
                case 14:
                case 239:
                    User.moveBuffer = pkt.buffer;
                    break;
            }
            if (User.serverIP !== this.url) {
                User.serverIP = this.url;
            }
        };
    });
}