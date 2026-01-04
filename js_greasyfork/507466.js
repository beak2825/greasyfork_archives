// ==UserScript==
// @name        MooMoo.io Gold bots
// @namespace   http://tampermonkey.net/
// @version     1
// @description  just fucking gold bots dont care it.
// @author       Bianos
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @license      MIT
// @match       *://*.moomoo.io/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/507466/MooMooio%20Gold%20bots.user.js
// @updateURL https://update.greasyfork.org/scripts/507466/MooMooio%20Gold%20bots.meta.js
// ==/UserScript==

let teams = [];
let teammates = [];
let msgpack_lite = window.msgpack
let color;
let name;
let oweb = window.WebSocket;
let socket;
var bot = [];
let ownplayer = {sid: undefined, x: undefined, y: undefined, dir: undefined, skinIndex: undefined, name: undefined}
let getAngleDist = (e, t) => {
    const i = Math.abs(t - e) % (Math.PI * 2);
    return i > Math.PI ? Math.PI * 2 - i : i
}
function gettoken() {
    return new Promise((resolve, reject) => {
        window.grecaptcha.ready(() => {
            window.grecaptcha.execute('6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP', { action: 'homepage' })
                .then(token => resolve(token))
                .catch(err => reject(err));
        });
    });
}
window.WebSocket = function(...args) {
    socket = new oweb(...args);
    socket.addEventListener('message', async (event) => {
        let decoded = msgpack_lite.decode(new Uint8Array(event.data));
        let hooked;
        if (decoded.length > 1 && Array.isArray(decoded[1])) {
            hooked = [decoded[0], ...decoded[1]];
        } else {
            hooked = decoded
        }

        if(hooked[0] === 'io-init') {
            let religion = socket.url.split('/')[2]
            for(let i = 0; i <= 3; i++) {
                let token = await gettoken();
                bot.push(new Bot(religion , token));
            }
        }

        if(hooked[0] === "C") {
            if(ownplayer.sid == null || ownplayer.sid == undefined) {
                ownplayer.sid = hooked[1];
            }
        }

        if(hooked[0] === 'D') {
            if(hooked[1][1] === ownplayer.sid) {
                ownplayer.name = hooked[1][2];
                console.log(ownplayer.name);
            }
        }

        if (hooked[0] === "a") {
            for (let i = 0; i < hooked[1].length / 13; i++) {
                let playerInfo = hooked[1].slice(13 * i, 13 * i + 13);
                if (playerInfo[0] == ownplayer.sid) {
                    ownplayer.x = playerInfo[1];
                    ownplayer.y = playerInfo[2];
                    ownplayer.dir = playerInfo[3];
                    ownplayer.skinIndex = playerInfo[9];
                }
            }
            for(let bots of bot) {
                bots.autm.x = ownplayer.x
                bots.autm.y = ownplayer.y
            }
        }
    });
    return socket;
};
let randomhats = [28, 29, 30, 36, 37, 38, 44, 42, 43, 49];
class Bot {
    constructor(region, token) {
        this.socket = new WebSocket(`wss://${region}/?token=re:${token}`);
        this.sid = undefined;
        this.x = undefined;
        this.y = undefined;
        this.dir = undefined;
        this.buildIndex = undefined;
        this.weaponIndex = undefined;
        this.team = undefined;
        this.skinIndex = undefined;
        this.tailIndex = undefined;
        this.health = 100;
        this.packetCount = 0;
        this.items = [0, 3, 6, 10];
        this.oldIndex = 0;
        this.oldWeapon;
        this.foodCount = 100;
        setInterval(() => { this.packetCount = 0 }, 1000);
        this.autm = {
            x: undefined,
            y: undefined,
            boolean: true
        };

        this.socket.addEventListener('open', () => {
            console.log('websocket true');
            this.socket.addEventListener('message', async event => {
                let arraybuf;
                if (event.data instanceof Blob) {
                    arraybuf = await event.data.arrayBuffer();
                } else {
                    return;
                }
                let u8array = new Uint8Array(arraybuf);
                let decoded;
                try {
                    decoded = msgpack_lite.decode(u8array);
                } catch (error) {
                }
                var hooked;
                if (decoded.length > 1){
                    hooked = [decoded[0], ...decoded[1]];
                    if (hooked[1] instanceof Array){
                        hooked = hooked;
                    }
                } else {
                    hooked = decoded;
                }

                if(hooked[0] === 'io-init') {
                    this.spawn(name, color)
                }

                if (hooked[0] === 'A') {
                    teams = hooked[1];
                }

                if (hooked[0] === 'C') {
                    if (this.sid == null) {
                        this.sid = hooked[1];
                    }
                }

                if(hooked[0] === 'D') {
                    if(hooked[1][1] === this.sid) {
                        this.foodCount = 100;
                        this.health = 100;
                    }
                    if(hooked[1][2] === ownplayer.name) {
                        this.sendMessage('6', 'Hi Owner!');
                    }
                }

                if(hooked[0] === '6') {
                    if(hooked[1] === ownplayer.sid) {
                        this.sendMessage('6', hooked[2]);
                    }
                }

                if(hooked[0] === 'O') {
                    if(hooked[1] === this.sid) {
                        this.health = hooked[2];
                    }
                }

                if(hooked[0] === 'N') {
                    let food = hooked.indexOf('food')
                    if (food !== -1 && food < hooked.length - 1) {
                        this.foodCount = hooked[food + 1];
                    } else {
                        this.foodCount = 0;
                    }
                }

                if (hooked[0] === 'a') {
                    teammates = [];
                    for (let i = 0; i < hooked[1].length / 13; i++) {
                        let playerInfo = hooked[1].slice(13 * i, 13 * i + 13);
                        if (playerInfo[0] == this.sid) {
                            this.x = playerInfo[1];
                            this.y = playerInfo[2];
                            this.dir = playerInfo[3]
                            this.buildIndex = playerInfo[4];
                            this.weaponIndex = playerInfo[5];
                            this.team = playerInfo[7];
                            this.skinIndex = playerInfo[9];
                            this.tailIndex = playerInfo[10];
                        } else if (playerInfo[7] == this.team && playerInfo[0] != this.sid) {
                            teammates.push({ sid: playerInfo[0], x: playerInfo[1], y: playerInfo[2], isOwner: playerInfo[8] });
                        }
                    }
                    this.oldWeapon = this.weaponIndex;
                    this.equipIndex(0, randomhats[Math.floor(Math.random() * randomhats.length)], 0);
                    if(this.health < 100) {
                        let { x, y } = this.autm;
                        let distance = Math.sqrt(Math.pow(this.y - y, 2) + Math.pow(this.x - x, 2));
                        if(distance >= 200) {
                            let hc = (Math.ceil((100 - this.health) / 20));
                            if(this.foodCount >= 10) {
                                for(let i = 0; i <= hc; i++) {
                                    setTimeout(() => {
                                        this.place(this.items[0], null);
                                    }, 70);
                                }
                            }
                        }
                    }
                    if (this.autm.boolean) {
                        let { x, y } = this.autm;
                        let distance = Math.sqrt(Math.pow(this.y - y, 2) + Math.pow(this.x - x, 2));
                        let angle = Math.atan2(y - this.y, x - this.x);
                        if(distance >= 105) {
                            this.sendMessage('a', angle);
                        } else {
                            if(getAngleDist(angle, ownplayer.dir) <= (Math.PI / 2.6)) {
                                this.sendMessage('a', null);
                            } else {
                                this.sendMessage('a', ownplayer.dir);
                            }
                        }
                    }
                    if(this.dir != ownplayer.dir) {
                        this.sendMessage('D', ownplayer.dir);
                    }
                }
                if(hooked[0] === 'P') {
                    this.spawn(name, color);
                }
            });
        });
    }

    spawn() {
        this.sendMessage('M', {
            name: 'BianosGoldBot',
            moofoll: true,
            skin: 0
        });
    }

    join(clan) {
        this.sendMessage('b', clan);
    }

    equipIndex(buy, id, index) {
        this.sendMessage('c', buy, id, index);
    }

    aimAt(angle) {
        this.sendMessage('D', angle);
    }

    doHit(hitting, angle) {
        this.sendMessage('d', hitting, angle);
    }

    place(id, ang) {
        this.sendMessage('G', id);
        this.doHit(1, ang);
        this.doHit(0, ang);
        this.sendMessage('G', this.oldWeapon, true);
    }

    sendMessage(type, ...args) {
        if (this.packetCount < 120) {
            let message = [type, args];
            let eM = msgpack_lite.encode(message);
            let mes = new Uint8Array(eM);
            this.socket.send(mes);
            this.packetCount++;
        }
    }
}


