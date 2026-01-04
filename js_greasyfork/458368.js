// ==UserScript==
// @name         [Old] Cellcraft.io & Agma.io Bots 2022
// @namespace    https://discord.com/invite/bAstbAfem9
// @version      1.0.0
// @description  The best bots for popular agar.io clone games.
// @author       Tatsuya & Enes
// @match        *.agma.io/*
// @match        *.cellcraft.io/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cellcraft.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458368/%5BOld%5D%20Cellcraftio%20%20Agmaio%20Bots%202022.user.js
// @updateURL https://update.greasyfork.org/scripts/458368/%5BOld%5D%20Cellcraftio%20%20Agmaio%20Bots%202022.meta.js
// ==/UserScript==
class Client {
    constructor() {
        this.bots = [];
        this.BotAmount = this.hookAmt;
        this.serverIP = '';
        this.positioning = {
            'x': 0,
            'y': 0
        };
        this.movebuf = null;
        this.started = false;
        this.gui = new GUI(this.startBots.bind(this), this.stopBots.bind(this), this.split.bind(this), this.eject.bind(this), this.InitMsg.bind(this));
        this.setup();
    }
    get hookAmt() {
        let url = /(\w+)\:\/\/(\w+.\w+)/gi.exec(window.location.origin)[2];
        if (url == "agma.io" || url == "cellcraft.io") {
            return 69;
        }
    }
    get AllowChat() {
        let url = /(\w+)\:\/\/(\w+.\w+)/gi.exec(window.location.origin)[2];
        if (url == "agma.io" || url == "cellcraft.io") {
            return true;
        }
    }
    get spawned() {
        return this.bots.filter(b => b.ws && b.ws.readyState === WebSocket.OPEN).length;
    }
    setup() {
        for (let i = 0; i < this.BotAmount; i++) {
            this.bots.push(new Bot())
        };
        this.UpdateCount();
        this.HookMouse();
    };
    HookMouse() {
        this.MouseInt = setInterval(() => {
            this.bots.forEach(bot => {
                bot.sendmouse(this.movebuf)
            })
        }, 50)
    };
    UpdateCount() {
        this.countInt = setInterval(() => {
            this.gui.updateCount(this.spawned, this.BotAmount)
        }, 1000)
    }
    split() {
        this.bots.forEach((bot, i) => {
            bot.split()
        })
    }
    eject() {
        this.bots.forEach((bot, i) => {
            bot.eject()
        })
    }
    InitMsg() {
        if (!this.started) return;
        if (!this.AllowChat) return this.gui.showPopUp("Chatspam is currently disabled for this site. Contact a developer for any questions or if you'd like for it to be enabled.");
        let msg = prompt("Enter the message you want to spam", "");
        this.bots.forEach((bot) => {
            if (msg) bot.sendChat(msg)
        })
    };
    startBots() {
        if (this.started || !this.serverIP) return;
        if (this.serverIP == undefined) return;
        this.bots.forEach((bot, i) => {
            bot.connect(this.serverIP)
        });
        this.started = true
    };
    stopBots() {
        if (!this.started) return;
        this.bots.forEach((bot, i) => {
            bot.close()
        });
        this.started = false
    };
}
class GUI {
    constructor(start, stop, split, eject, spamMSG) {
        this.IDs = {
            'startButton': 'startbtn',
            'stopButton': 'stopbtn',
            'botCount': 'botAmount',
            'DiscordURL': 'discord'
        };
        this.injected = false;
        this.startBots = start;
        this.stopBots = stop;
        this.splitBots = split;
        this.ejectBots = eject;
        this.spamChat = spamMSG;
        this.inject();
        this.setupKeys();
    }
    async inject() {
        this.uiCode = await this.getGUI();
        if (!this.uiCode) {
            return alert('Failed to load bot GUI. If this keeps happening, contact a developer.');
        }
        this.append(this.uiCode);
    }
    async getGUI() {
        const UI = await fetch('https://puzzling-tiny-fruit.glitch.me/');
        if (!UI.ok) {
            return console.log('[GUI STATUS]', UI);
        }
        return await UI.text();
    }
    append(html) {
        const BOTUI = document.createElement('div');
        BOTUI.innerHTML = html;
        document.body.appendChild(BOTUI);
        this.injected = true;
        document.getElementById(this.IDs.startButton).onclick = this.startBots;
        document.getElementById(this.IDs.stopButton).onclick = this.stopBots;
        document.getElementById(this.IDs.DiscordURL).onclick = () => {
            window.location.href = 'https://discord.gg/bAstbAfem9'
        };
        document.querySelector("#okbtn").onclick = () => {
            document.querySelector("#popup").style.display = "none";
            document.querySelector("#blackout").style.display = "none";
        };
        this.showPopUp("Thank you for using these bots. Contact Tatsuya in the Discord listed in order to unpatch the bots if they get patched. Agma.io is patched.");
    }
    setupKeys() {
        window.addEventListener('keypress', (event) => {
            switch (event.key) {
                case 'q':
                    this.splitBots();
                    break;
                case 'w':
                    this.ejectBots();
                    break;
                case 'c':
                    this.spamChat();
                    break;
            }
        });
    }
    updateCount(spawned, max) {
        document.getElementById(this.IDs.botCount).innerText = spawned + " / " + max
    };
    showPopUp(msg) {
        document.getElementById("msgpop").innerHTML = msg;
        document.querySelector("#popup").style.display = "block";
        document.querySelector("#blackout").style.display = "block";
    };
}
var HookClient = {
    Client: 'function'
};
HookClient.run = (func) => {
    HookClient.Client = func;
}
class DataFrameWriter {
    constructor() {
        this.bytes = [];
    }
    writeUint8(val) {
        this.bytes.push(val);
    }
    writeUint16(val) {
        this.bytes.push(val & 0xFF);
        this.bytes.push(val >> 8 & 0xFF);
    }
    writeUint32(val) {
        this.bytes.push(val & 0xFF);
        this.bytes.push(val >> 8 & 0xFF);
        this.bytes.push(val >> 16 & 0xFF);
        this.bytes.push(val >> 24 & 0xFF);
    }
    writeStringEx(str) {
        this.writeUint16(str.length);
        for (var i = 0; i < str.length; i++) {
            this.writeUint16(str.charCodeAt(i));
        }
    }
    writeBool(str) {
        this.writeUint8(str.length);
        for (var i = 0; i < str.length; i++) {
            this.writeUint8(str.charCodeAt(i));
        }
    }
    getBuffer() {
        return this.bytes;
    }
    getArrayBuffer() {
        return new Uint8Array(this.bytes).buffer;
    }
}
class Writer {
    constructor(a) {
        this.buffer = new DataView(new ArrayBuffer(a)), this.position = 0, this.littleEndian = true;
    }
    setString(c) {
        for (let a = 0; a < c.length; a++) this.setUint16(c.charCodeAt(a));
        return this;
    }
    setInt8(a) {
        return this.buffer.setInt8(this.position++, a), this;
    }
    setUint8(a) {
        return this.buffer.setUint8(this.position++, a), this;
    }
    setInt16(a) {
        return this.buffer.setInt16((this.position += 2) - 2, a, this.littleEndian), this;
    }
    setUint16(a) {
        return this.buffer.setUint16((this.position += 2) - 2, a, this.littleEndian), this;
    }
    setInt32(a) {
        return this.buffer.setInt32((this.position += 4) - 4, a, this.littleEndian), this;
    }
    setUint32(a) {
        return this.buffer.setUint32((this.position += 4) - 4, a, this.littleEndian), this;
    }
    setFloat32(a) {
        return this.buffer.setFloat32((this.position += 4) - 4, a, this.littleEndian), this;
    }
    setFloat64(a) {
        return this.buffer.setFloat64((this.position += 8) - 8, a, this.littleEndian), this;
    }
}
class Bot {
    constructor() {
        this.server = '';
        this.origin = /(\w+)\:\/\/(\w+.\w+)/gi.exec(window.location.origin)[2];
        this.ws = null;
        this.Essentials = {
            botNames: ["Xero-Bots"],
            botSkins: ['26', '30', '32', '40', '60', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18',
                '19', '20', '21', '22', '23'
            ],
            respawnDelay: 3000,
            moveDelay: 150,
            response: 0,
            getBotName() {
                return this.botNames[Math.floor(Math.random() * this.botNames.length)]
            },
            getBotSkin() {
                return this.botSkins[Math.floor(Math.random() * this.botSkins.length)]
            }
        };
        this.botName = this.Essentials.getBotName();
        this.SkinName = `{${this.Essentials.getBotSkin()}}` + this.botName;
    }
    async setupDependencies(url, wss) {
        if (url == "agma.io") {
            this.opcode = 0;
            this.Tags = {
                emgaa: 'Agma!',
                S_: 22421,
                j9: 50,
                M: 128,
                T_: 50,
                result: 0,
                A0: 33,
                Va(a, c, x, _) {
                    c + x > a.byteLength && (x = 0);
                    for (var e = 12345768 + _, t = 0; t < x; t++) e += a.getUint8(c + t) * (t + 2);
                    return e;
                },
                postAuth() {
                    return new Promise(async (resolve, reject) => {
                        window.jQuery.post("client.php", {
                            data: JSON.stringify({
                                cv: 4 * this.S_,
                                ch: this.j9,
                                ccv: this.S_,
                                vv: this.M
                            })
                        }, function(key) {
                            resolve(key);
                        });
                    });
                }
            };
            --this.Tags.T_;
            let key = await this.Tags.postAuth();
            this.Tags.result = key;
            var i = 0;
            for (; i < this.Tags.emgaa.length; i++) {
                this.Tags.T_ += this.Tags.emgaa.charCodeAt(i) * (1 - (!i || i % 2 ? 0 : 2)) - (i ? 0 : 1)
            }
        } else if (url == "cellcraft.io") {
            this.opcode = 1;
            this.Tags = {
                emgaa: 'Agma!',
                currentTime: -1,
                c: 54295,
                length: 5,
                to: 50,
                result: 0,
                formatTag: 22,
                oldNumThing: 118,
                toArray(data, offset, length, callback) {
                    if (offset + length > data.byteLength) {
                        length = 0;
                    }
                    var source = 12345678 + callback;
                    var i = 0;
                    for (; length > i; i++) {
                        source = source + data.getUint8(offset + i) * (i + 1);
                    }
                    return source;
                },
                postAuth() {
                    return new Promise(async (resolve, reject) => {
                        window.jQuery.post("client.php", {
                            data: JSON.stringify({
                                cv: 4 * this.c,
                                ch: this.to,
                                ccv: this.c,
                                vv: this.oldNumThing
                            })
                        }, function(key) {
                            resolve(key);
                        });
                    });
                }
            };
            --this.Tags.length;
            let key = await this.Tags.postAuth();
            this.Tags.result = key;
            i = 0;
            for (; i < this.Tags.emgaa.length; i++) {
                this.Tags.length = this.Tags.length += (this.Tags.emgaa.charCodeAt(i) * (1 - (!i || i % 2 ? 0 : 2)) - 1 * (i ? 0 : 1));
            }
        }
        this.ws = new WebSocket(wss);
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onclose = this.onClose.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
    }
    connect(wss) {
        this.server = wss;
        this.setupDependencies(this.origin, this.server);
    }
    onOpen() {
        if (this.opcode == 1) {
            const packet = this.Buffer(13);
            packet.setUint8(0, 245);
            packet.setUint16(1, this.Tags.formatTag, true);
            packet.setUint16(3, this.Tags.oldNumThing, true);
            packet.setUint32(5, this.Tags.c, true);
            packet.setUint32(9, this.Tags.toArray(packet, 0, 9, 245), true);
            this.send(packet);
            this.sprkcore = setInterval(() => {
                if (this.readyToSpawn) this.send([0x5f]);
            }, 18e3);
            this.spawnInt = setInterval(this.spawn.bind(this), 1000);
        } else if (this.opcode == 0) {
            const packet = new Writer(13);
            packet.setUint8(245);
            packet.setUint16(this.Tags.A0);
            packet.setUint16(this.Tags.M);
            packet.setUint32(this.Tags.S_);
            packet.setUint32(this.Tags.Va(packet.buffer, 0, 9, 245));
            this.send(packet);
            this.sprkcore = setInterval(() => {
                if (this.readyToSpawn) var singleByte = this.Buffer(1);
                singleByte.setUint8(0, 94);
                this.send(singleByte);
            }, 18e3);
            this.spawnInt = setInterval(this.spawn.bind(this), 5000);
        }
    }
    spawn() {
        if (this.opcode == 1 || this.opcode == 0) {
            if (!this.readyToSpawn) return;
            var es = [1];
            var _s = 0;
            var spawnBuf = this.Buffer(4 + 2 * es.length + 2 * this.botName.length);
            spawnBuf.setUint8(0, 1);
            for (var b = 4, x = 0; x < es.length; x++) spawnBuf.setUint16(b, 0, true);
            for (x = 0; x < this.botName.length; ++x) spawnBuf.setUint16(b + 2 * x, this.botName.charCodeAt(x), true);
            var singleByte = this.Buffer(1);
            singleByte.setUint8(0, 34);
            this.send(singleByte);
            this.send(spawnBuf);
            singleByte = this.Buffer(1);
            singleByte.setUint8(0, 34);
            this.send(singleByte);
        } else if (this.opcode == 2) {
            this.send(new Uint8Array([27]));
        }
    }
    onMessage(data) {
        if (this.opcode == 1) {
            var view = new DataView(data.data);
            var offset = 0;
            switch (240 == view.getUint8(offset) && (offset = offset + 5), view.getUint8(offset++)) {
                case 64:
                    offset = offset + 34;
                    var next = view.getUint32(offset, true);
                    offset = offset + 4;
                    var code = view.getUint32(offset, true);
                    if (next === code) {
                        if (70 > this.Tags.to) {
                            this.Tags.to = 100;
                            this.Tags.currentTime = next;
                            this.parse(0, 33000);
                        }
                    } else {
                        this.ws.close();
                        console.log("Err in 64!");
                    }
                    break;
                case 244:
                    this.readyToSpawn = true;
                    this.send(new Uint8Array([0x04, 0x07, 0x01]))
                    this.send(new Uint8Array([0x04, 0x08, 0x00]))
                    this.send(new Uint8Array([0x04, 0x03, 0x01]))
                    break;
            }
        } else if (this.opcode == 0) {
            view = new DataView(data.data);
            offset = 0;
            switch (240 == view.getUint8(offset) && (offset = offset + 5), view.getUint8(offset++)) {
                case 64:
                    offset = offset + 34;
                    next = view.getUint32(offset, true);
                    offset = offset + 4;
                    code = view.getUint32(offset, true);
                    if (next === code) {
                        if (70 > this.Tags.j9) {
                            this.Tags.j9 = 100;
                            this.Tags.M_ = next;
                            this.try64(0, 18208);
                        }
                    } else {
                        this.ws.close();
                        console.log("Err in 64!");
                    }
                    break;
                case 244:
                    this.readyToSpawn = true;
                    this.send(new Uint8Array([0x04, 0x07, 0x01]))
                    this.send(new Uint8Array([0x04, 0x08, 0x00]))
                    this.send(new Uint8Array([0x04, 0x03, 0x01]))
                    break;
            }
        }
    }
    try64(a, key) {
        const auth = new Writer(13);
        auth.setUint8(2 * (100 + 30) - (this.Tags.M_ - 5) % 10 - 5);
        auth.setUint32(~~(this.Tags.M_ / 1.81 + 100 / 2 - 2 * (a ? .5 : 1)) + (~~(~~(22.21 * (~~(this.Tags.M_ + 4.42 * this.Tags.S_ - 550) % --key -
            36360)) / 4.2)));
        auth.setUint32(this.increment2() + 171)
        auth.setUint32(this.Tags.Va(auth.buffer, 0, 9, 255) - 1)
        this.send(auth);
    }
    get C_() {
        var zafar = "~9B\\x$";
        return [
            zafar.charCodeAt(0), zafar.charCodeAt(1), zafar.charCodeAt(2) + 73, zafar.charCodeAt(3), zafar.charCodeAt(4) + 227, zafar.charCodeAt(5)
        ];
    }
    increment2() {
        for (var a = 0, c = 1; c < this.C_.length; c++) {
            a += ~~(this.Tags.M_ / this.C_[c] - this.C_[c] % 171);
        }
        return a;
    }
    get filenameFilter() {
        var o = '~9B\\x$';
        return [
            o.charCodeAt(0),
            o.charCodeAt(1),
            o.charCodeAt(2) + 73,
            o.charCodeAt(3),
            o.charCodeAt(4) + 227,
            o.charCodeAt(5),
        ];
    }
    increment() {
        var op = 0;
        var ii = 0;
        for (; ii < this.filenameFilter.length; ii++) {
            op = op + ~~(this.Tags.currentTime / this.filenameFilter[ii] - this.filenameFilter[ii] % 103);
        }
        return op;
    }
    parse(offset, key) {
        if (this.opcode == 1) {
            let auth = this.Buffer(13);
            auth.setUint8(0, 2 * (100 + 30) - (this.Tags.currentTime - 5) % 10 - 5);
            auth.setUint32(1, ~~(this.Tags.currentTime / 1.84 + 100 / 2 - 2 * (offset ? .5 : 1)) + ~~(~~(21.2 * (~~(this.Tags.currentTime + 4.42 * this.Tags
                .c + 555) % --key + 36360)) / 4.2), true);
            auth.setUint32(5, this.increment() + 103, true);
            auth.setUint32(9, this.Tags.toArray(auth, 0, 9, 255), true);
            this.send(auth);
        }
    }
    split() {
        if (this.opcode == 1 || this.opcode == 0) {
            this.send(new Uint8Array([0x11]))
        } else if (this.opcode == 2) {
            this.send(new Uint8Array([33, 0, 1]));
        }
    }
    eject() {
        if (this.opcode == 1 || this.opcode == 0) {
            this.send(new Uint8Array([0x24]))
        } else if (this.opcode == 2) {
            this.send(new Uint8Array([33, 1, 255]));
        }
    }
    sendmouse() {
        if (this.opcode == 1 || this.opcode == 0) {
            if (!this.readyToSpawn) return;
            this.send(HookClient.Client.movebuf);
        } else if (this.opcode == 2) {
            this.send(HookClient.Client.movebuf);
        }
    }
    sendChat(msg) {
        if (this.opcode == 1 || this.opcode == 0) {
            var b = this.Buffer(2 + 2 * msg.length),
                x = 0;
            b.setUint8(x++, 98)
            b.setUint8(x++, 1);
            for (var _ = 0; _ < msg.length; ++_) b.setUint16(x, msg.charCodeAt(_), true), x += 2;
            this.send(b);
        } else if (this.opcode == 2) {
            let writer = new DataFrameWriter();
            var f = 0;
            writer.writeUint8(98);
            writer.writeUint8(f ? 1 : 0);
            writer.writeStringEx(msg);
            this.send(writer.getArrayBuffer());
        }
    }
    GetUserID(length) {
        var result = [];
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
        }
        return result.join('');
    }
    Buffer(buf) {
        return new DataView(new ArrayBuffer(!buf ? 1 : buf))
    };
    get open() {
        return this.ws && this.ws.readyState === WebSocket.OPEN
    };
    send(data) {
        if (this.open) {
            if (this.opcode == 1 || this.opcode == 0) {
                this.ws.send(data.buffer);
            } else {
                this.ws.send(data)
            }
        }
    };
    close() {
        if (this.ws) this.ws.close();
    };
    onClose() {
        clearInterval(this.spawnInt);
        clearInterval(this.mouseInt);
        clearInterval(this.sprkcore);
        if (!HookClient.Client.started) return;
        //setTimeout(this.connect(this.server), 5000);
    };
}
 
if (location.host.includes('agma.io') || location.host.includes('cellcraft.io')) {
    let client = null;
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
            if (!client) return;
            if (typeof pkt == 'string') return res;
            if (pkt instanceof ArrayBuffer) pkt = new DataView(pkt);
            else if (pkt instanceof DataView) pkt = pkt;
            else pkt = new DataView(pkt.buffer);
            switch (pkt.getUint8(0, true)) {
                case 0:
                    switch (pkt.byteLength) {
                        case 9:
                            client.movebuf = pkt;
                            break;
                    }
                    break;
            }
            if (client.serverIP !== thisArg.url) {
                client.serverIP = thisArg.url;
            }
            return res;
        }
    });
    window.addEventListener('load', () => {
        client = new Client();
        HookClient.run(client);
    });
}