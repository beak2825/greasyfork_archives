// ==UserScript==
// @name         hack lỏ
// @description  Autobreak-trap, Autoheal, Hat macros, Anti-trap, AutoPush & more!
// @version      s.2
// @author       Thiago
// @match        *://sploop.io/*
// @run-at       document-start
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @grant        none
// @namespace https://greasyfork.org/users/761829
// @downloadURL https://update.greasyfork.org/scripts/525108/hack%20l%E1%BB%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/525108/hack%20l%E1%BB%8F.meta.js
// ==/UserScript==

const { log } = console;
var autoChoose = true; // SET TO false IF YOU WANT TO DISABLE
let version = "3.2.3.1"
let wsPushing = false
let Game;
let Entity = new Array();
let Canvas;
let Context;
let ctx;
let keyDown = [];
let user = {};
let tribe = [];
let enemy;
let encoder = new TextEncoder();
let decoder = new TextDecoder();
let server;
let teammates = [];

let Config = {
    update: (type) => {
        Config[type] += 1;
        setTimeout(() => (Config[type] -= 1), 1e3);
    },
    serverUpdate: 1e3 / 9,
    breaking: false,
    pushing: false,
    rate: 1e3,
    pps: 0,
    weapon: 0,
    cps: 0,
    tps: 0,
    fps: 0,
    ping: 0,
    enemiesNear: [],
    freeze: {
        send: true,
        pps: true,
        message: false,
        setup: false
    },
    angle: 0,
    move: 0,
    messages: new Array([], []),
    counter: 0,
    resolver: function () {
    },
    last: Date.now(),
    chat: ["♫Anh hẹn em Pickleball♫", "♫Ta vờn nhau Pickleball♫", "♫Tay vợt bên dưới hông♫", "♫Anh đập banh, đập banh♫", "♫Đến em mạnh vào♫", "♫Ta chỉ chơi Pickleball♫", "♫Không nên vượt mức Pickleball♫","♫Đưa vợt anh tiếp banh♫","♫High and low♫","♫Từ thấp đến trên cao♫", "♫Ta chỉ gặp chơi Pickleball♫"] ,
    isJson: (data) => {
        try {
            JSON.parse(data);
        } catch (e) {
            return false;
        }
        return true;

    },
    WS: null
};

Config.tick = () => {
    return new Promise((e) => (Config.resolver = e))
};

let Toggle = {
    UI: true,
    autoBreak: true,
    autoPush: true,
    autoPlace: true,
    autoSync: true,
    autoRespawn: false,
    autoChat: false,
    tracers: true,
    autoHeal: true,
    optHeal: false,
}

class Macro {
    constructor(advanced, spike, trap, mill, food) {
        this.advanced = advanced;
        this.spike = spike;
        this.trap = trap;
        this.mill = mill;
        this.food = food;
    };

    update() {
        setTimeout(() => {

            if (keyDown[this.spike]) Sploop.newPlace(4);
            if (keyDown[this.trap]) Sploop.newPlace(7);
            if (keyDown[this.mill]) Sploop.newPlace(5);
            if (keyDown[this.food]) Sploop.newPlace(2);
        }, 14);
    };
};

let Placer = new Macro(true, 86, 70, 78, 81);

class Sploop {
    static place(id, angle = Config.angle) {
        Config.update('cps');
        Sploop.take(id);
        Sploop.hit(angle);
        Sploop.take(Config.weapon);
    }

    static newPlace(id, angle = Config.angle) {
        let increasor = Math.PI / 8; // 22.25 radians
        let offset = Math.PI / 4; // 45 radians

        this.place(id, angle, true)

        for (let newAngle = 0; newAngle < offset; newAngle += increasor) {
            Sploop.place(id, angle - newAngle);
            Sploop.place(id, angle + newAngle);
        }

        Sploop.take(Config.weapon);
    }

    static quad(id, angle = 0) {
        for (let newAngle = 0; newAngle < Math.PI * 2; newAngle += Math.PI / 8) {
            let time = (Config.serverUpdate / 4) * (newAngle / (Math.PI / 8))

            setTimeout(() => Sploop.place(7, angle + newAngle), time);
        }
    }

    static heal(amount) {
        for (let count = 0; count <= amount; count++) Sploop.place(2);
    }

    static equip(id) {
        if (user.skin != id) Game.send(new Uint8Array([5, id]));
    }

    static walk(angle = Config.move) {
        if (typeof angle !== 'number') return Game.send(new Uint8Array([1, 0]));

        angle = (65535 * (angle + Math.PI)) / (2 * Math.PI);

        Game.send(new Uint8Array([1, 255 & angle, (angle >> 8) & 255]));
    }

    static take(id) {
        Game.send(new Uint8Array([0, id]));
    }

    static chat(text) {
        text = encoder.encode(text);

        Game.send(new Uint8Array([7, ...text]))
    }

    static hit(angle) {
        angle = (65535 * (angle + Math.PI)) / (2 * Math.PI);

        Game.send(new Uint8Array([19, 255 & angle, (angle >> 8) & 255]));
        Game.send(new Uint8Array([18]));
    }

    static watch(angle) {
        angle = (65535 * (angle + Math.PI)) / (2 * Math.PI);

        Game.send(new Uint8Array([13, 255 & angle, (angle >> 8) & 255]));
    }

    static offensive() {
        let offensive = () => {
            let distance = enemy ? getDistance(enemy, user) : 0;

            if (user.y <= 9e3 && user.y >= 8e3) return 9;
            if (enemy && distance <= 300) return false && distance <= 150 ? 6 : 5;

            return 7;
        }

        Sploop.equip(offensive());
    }

    static healthChange(health, oldHealth) {
        if (oldHealth > health) {
            user.hitDate = Config.counter;
        }
        ;

        user.health = health;
    }

    /*    static mine(build){
             if(user.id2 == build.id2) return true;
             if(user.team){
                 let length = tribe.length;
                 for(let index = 0; index < length; index++) {
                     let teammate = tribe[index];
                     if(build.id2 == teammate.id2) return true;
                 }
             }
             return false;
         }*/

    static update() {
        Config.counter += 1;
        Config.resolver();
        Config.last = Date.now();

        if (user.alive) {
            if (user.health < 100 && Toggle.autoHeal) {
                log("damage")
                setTimeout(() => {
                    Sploop.heal(1);
                }, Toggle.optHeal ? (Config.serverUpdate - 20 - Config.ping) + parseInt(document.querySelector('[data-speed="addms"]').value) : parseInt(document.querySelector('[data-speed="heal"]').value));
            }
            ;

            let trap = Entity.find(c => c && getDistance(c, user) <= 50 && c.type == 6 && !teammates.includes(c.id2) && user.id2 !== c.id2);
            let wasBreaking = Config.breaking;
            Config.breaking = false;

            if (trap && Toggle.autoBreak) {
                console.log(trap, user)
                let angle = getAngle(trap, user);
                Config.breaking = true;
                Sploop.chat("");

                Sploop.hit(angle);
                Sploop.equip(6);

                if (!wasBreaking) Sploop.quad(7, angle);
            } else if (wasBreaking) {
                Sploop.chat("");
                Sploop.offensive();
            }

            let wasPushing = Config.pushing;
            Config.pushing = false;

            if (enemy && !trap && user.alive) {
                let distance = getDistance(enemy, user);

                if (Toggle.autoPush && distance <= 250) {
                    let trap = Entity.find(c => c && getDistance(c, enemy) <= 60 && c.type == 6 && c.id !== enemy.id);

                    if (wsPushing && !trap) {
                        wsPushing = false;
                        Sploop.walk('stop');
                    }

                    if (trap) {
                        let spikes = Entity.filter(c => c && [2, 7, 17].includes(c.type) && c.id !== enemy.id && getDistance(c, trap) <= 130);
                        if (wsPushing && !spikes.length) {
                            wsPushing = false;
                            Sploop.walk('stop');
                        }
                        if (spikes.length) {
                            let spike = spikes.sort((a, b) => getDistance(a, trap) - getDistance(b, trap))[0];
                            let angle = getAngle(enemy, spike);
                            distance = getDistance(enemy, spike) + 70;
                            let position = {
                                x: spike.x + (distance * Math.cos(angle)),
                                y: spike.y + (distance * Math.sin(angle))
                            };

                            distance = getDistance(position, user);
                            angle = () => {
                                wsPushing = true;
                                if (distance > 100) {
                                    return getAngle(position, user)
                                } else {
                                    let angleDifference = Math.abs(getAngle(spike, position) - getAngle(spike, user))
                                    let message = `diffence [${angleDifference / (Math.PI / 180)}]`

                                    Sploop.chat(`INFINITED-$XD{(angleDifference / (Math.PI / 180)).toFixed(3)}`)
                                    // Sploop.chat(message);
                                    return getAngle(enemy, user)
                                }
                            }

                            Config.pushing = true;
                            Sploop.walk(angle())
                        }
                    }
                }

                distance = getDistance(enemy, user)
                if (Toggle.autoPlace && distance <= 200) {
                    let trap = Entity.find(c => c && c.type == 6 && enemy.id !== c.id && getDistance(c, enemy) <= 50);
                    let enemyPos = {
                        x: enemy.x + enemy.xVel,
                        y: enemy.y + enemy.yVel
                    }
                    let userPos = {
                        x: user.x + user.xVel,
                        y: user.y + user.yVel
                    }
                    distance = getDistance(enemyPos, userPos);
                    let angle = getAngle(enemyPos, userPos)
                    let range = 28 * 2 + 50;

                    if (trap) {
                        angle = getAngle(trap, userPos);
                        setTimeout(() => {
                            Sploop.place(4, angle + (50 * Math.PI / 180));
                        }, 14)

                    } else {
                        if (Toggle.autoSync && distance < 250) {
                            let spike = Entity.find(c => c && [2, 7, 17].includes(c.type) && c.id !== enemy.id && getDistance(c, enemyPos) <= 60);
                            if (spike) {
                                Sploop.equip(2);
                                Sploop.take(0);
                                Sploop.hit(angle);
                                setTimeout(() => Sploop.offensive(), 2e3);
                            }
                            if (enemy.health <= (enemy.skin == 2 ? 78 : 85) && user.skin == 5 && user.health <= 70) {
                                Sploop.equip(2);
                                Sploop.take(0);
                                Sploop.hit(angle);
                                setTimeout(() => Sploop.offensive(), 2e3);
                            }
                        }

                        if (range >= distance) {
                            setTimeout(() => {
                                Sploop.place(7, angle);
                            }, 14)
                        }
                    }
                }
            }

            if (wasPushing && !Config.pushing) Sploop.walk('Stop');
        }

        updateInfo()
    }
}




class Script {
    setup() {
        this.run();
    };

    /*override(ws, data){
         !Config.freeze.send && this.log(`WebSocket`, `⬈`, data[0], '#8ecc51');
         if(Config.isJson(data)) {
             let oldws = JSON.parse(data)
             if(oldws[0] == 6) {
                 user.name = oldws[1]
             }
         }
         ws.classic(data, true);
         Config.update('pps');
     }*/

    send(data) {
        if (this.ws && 1 === this.ws.readyState) {
            if (Config.pps >= 400) return // Reduce the packet limit to do not get kicked

            this.ws.send(data)
            Config.update('pps');
        }
    }

    message(event) {
        let data = event.data;
        let string = typeof data === 'string';
        let decoded = string ? JSON.parse(data) : new Uint8Array(data);
        let length = decoded.length;
        let id = Number(decoded[0]);
        let found = Config.messages[Number(string)].find(item => item && item.id == id);

        if (!found) return !Config.freeze.message && Game.log(`WebSocket`, `⬉`, `${decoded} | ${string}`, '#c7cc51');
        switch (decoded[0]) {
            case 20:
                Config.enemiesNear = []
                enemy = null;
                for (let int = 1; int < length; int += 19) {
                    let type = decoded[int],
                        owner = decoded[int + 1],
                        index = decoded[int + 2] | decoded[int + 3] << 8,
                        x = decoded[int + 4] | decoded[int + 5] << 8,
                        y = decoded[int + 6] | decoded[int + 7] << 8,
                        broken = decoded[int + 8],
                        skin = decoded[int + 11],
                        team = decoded[int + 12],
                        health = decoded[int + 13] / 255 * 100,
                        clown = decoded[int + 8];

                    let temp = Entity[index] || {};

                    if (2 && broken) Entity[index] = null;

                    if (!type && broken == 2) {
                        temp = {};
                    } else {
                        temp.type = type;
                        temp.id = index;
                        temp.health = health;
                        temp.xVel = temp.x - x;
                        temp.yVel = temp.y - y;
                        temp.speed = Math.hypot(y - temp.y, x - temp.x);
                        temp.move = Math.atan2(y - temp.y, x - temp.x);
                        temp.x = x;
                        temp.y = y;
                        temp.id2 = owner;
                        temp.skin = skin;
                        temp.team = team;
                        temp.clown = Boolean(clown);
                        Config.enemiesNear.push(temp)

                        Entity[index] = temp;
                    }

                    if (temp.id === user.id) {
                        Sploop.healthChange(temp.health, user.health);
                        Object.assign(user, temp)
                    } else if (!temp.type && (!user.team || temp.team != user.team)) {
                        let distance = Math.hypot(user.y - temp.y, user.x - temp.x);
                        let distance2 = enemy ? Math.hypot(user.y - enemy.y, user.x - enemy.x) : null;
                        if (enemy) {
                            if (distance < distance2) enemy = temp;
                        } else {
                            enemy = temp;
                        }
                    }

                }
                Config.update('tps');
                Sploop.update();
                break;

            case 35:
                user.id = decoded[1];
                user.alive = true;
                user.spawnDate = Date.now();
                user.health = 100;
                Config.weapon = 0;
                break;
            case 19:
                user.health = 0;
                user.speed = 0;
                user.alive = false;
                if (Toggle.autoRespawn) {
                    setTimeout(() => {
                        Game.send(Config.respawnPacket)
                    }, 200)
                }
                break;

            case 28:
                Sploop.chat("~D.E.S.T.R.O.Y.E.D~")
                break;

            case 24:
                teammates = [...data.slice(3, data.length)];
                break;

            case 16:
                teammates = [...data.slice(2, data.length)];
                break;

            case 27:
                teammates = [];
                break;

                /*            case 'Ping update':
                               Config.ping = decoded[1] | (decoded[2] << 8);
                               break;*/
        }

        Placer.update();
    }

    log(group, symbol, result, color) {
        return log(`%c[${group}] %c${symbol}`, `color:${color};font-weight:bold`, `color:${color}`, result);
    }

    run(ws) {
        let chatval = 0
        setInterval(() => {
            if (Toggle.autoChat) {
                if (chatval == Config.chat.length) {
                    chatval = 0;
                } else {
                    if (user.alive && Toggle.autoChat) {
                        chatval++
                        Sploop.chat(Config.chat[chatval])
                    }
                }
            }
        }, 1000)
        let val = [1, 2, 4, 8]
        let lval = 0
        setInterval(() => {
            if (Toggle.antiAFK) {
                lval++
                Game.send(new Uint8Array([1, val[lval - 1]]))
                setTimeout(() => {
                    Game.send(new Uint8Array([1, 0]))
                }, 200)
                if (lval == val.length) {
                    lval = 0
                }
            }
        }, 5000)
        !Config.freeze.setup && Game.log(`Hijacked Iframe`, `✔`, ws.url, '#0f0');
        let notifications = `
       <div class="notifications-holder"></div>
       <style>
        .box span {
          font-size: 20px;
          white-space: nowrap;
        }
        .box {
          width: max-content;
          height: 40px;
          display: flex;
          align-items: center;
          padding-top: 3.5px;
          padding-left: 7px;
          padding-right: 7px;
          border-radius: 7px;
          background-color: rgb(40 45 34 / 60%);
          border: 4px solid #141414;
          margin-bottom: 5px;
          color: white;
          letter-spacing: 1px;
          font-weight: bold;
          box-shadow: inset 0 -3px 0 #333;
        }
        .notifications-holder {
          position: absolute;
          left: 20px;
          top: 20px;
          display: flex;
          flex-direction: column;
          z-index: 5;
        }
        </style>
        `
        $("body").append(notifications)
        addNotifications(`The script is running!`, "#5c4ce6")
        this.ws = ws;

        /*        let infoPanel = '\n<div class="info-panel-holder">\n  <div id="info-content">\n  <p id="health"></div>\n</div>\n<style>\n#info-content {\n  color: #fff;\n  font-size: 22px;\n  text-shadow: 0px 0px 5px black, 0px 0px 7px black;\n}\n.info-panel-holder {\n  position: absolute;\n  top: 20px;\n  left: 20px;\n}\n</style>\n';
                  $("body").append(infoPanel)*/

        setInterval(() => {
            !Config.freeze.pps && this.log(`PPS`, `⬍`, Config.pps, '#516ecc');
        }, Config.rate);

        Config.width = Canvas.clientWidth;
        Config.height = Canvas.clientHeight;

        $(window).resize(() => {
            Config.width = Canvas.clientWidth;
            Config.height = Canvas.clientHeight;
        });

        Canvas.addEventListener('mousemove', (event) => {
            Config.mouseX = event.clientX;
            Config.mouseY = event.clientY;
            Config.angle = Math.atan2(Config.mouseY - Config.height / 2, Config.mouseX - Config.width / 2);
        });

    }

    constructor() {
        this.ws = null;
    }
};

const Setup = () => {
    Game = new Script();
    Game.log(`Setup`, `⦿`, '', '#000000');
    let data = Config.messages;

    data[0][1] = { name: 'Player update', string: false };
    data[0][2] = { name: 'Verify', string: false };
    data[0][5] = { name: 'Choose', string: false };
    data[0][7] = { name: 'Hit', string: false };
    data[0][14] = { name: 'Resource update', string: false };
    data[0][16] = { name: 'Projectile Hit', string: false };
    data[0][18] = { name: 'Chat', string: false };
    data[0][19] = { name: 'Choose x3', string: true };
    data[0][20] = { name: 'Choose x2', string: false };
    data[0][22] = { name: 'Ping update', string: false };
    data[0][23] = { name: 'Ping update', string: false };
    data[0][24] = { name: 'Create clan', string: false };
    data[0][25] = { name: 'Leave clan', string: false };
    data[0][26] = { name: 'Create clan', string: false };
    data[0][27] = { name: 'Leave clan', string: false };
    data[0][30] = { name: 'Place', string: false };

    data[1][2] = { name: 'Spawn', string: true };
    data[1][8] = { name: 'Player setup', string: true };
    data[1][9] = { name: 'Leaderboard update', string: true };
    data[1][11] = { name: 'Text', string: true };
    data[1][13] = { name: 'Death', string: true };
    data[1][19] = { name: 'Choose', string: true };
    data[1][35] = { name: 'new Verify', string: true };

    for (let index = 0; index <= 1; index++) {
        let length = data[index].length;
        for (let id = 0; id < length; id++) {
            if (data[index][id]) data[index][id].id = id;
        }
        ;
    }
    ;
};
Setup();
/*
class Nuro extends WebSocket {
    constructor(url, protocols) {
        Config.WS = super(url, protocols);
        this.addEventListener('message', event => Game.message(event));
        this.classic = this.send;
        this.send = data => Game.override(this, data);
        window.ws = this;
        Game.run(this);
    }
    set onmessage(f) {
        !Config.freeze.setup && log('onmessage', f);
        super.onmessage = f;
    }
}
*/

// there you go

WebSocket.prototype.unmodifiedSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (arguments) {
    this.unmodifiedSend(arguments);
    if (window.ws !== this) {
        this.addEventListener('message', event => Game.message(event));
        this.classic = this.send;
        window.ws = this;
        Game.run(this);
        Config.WS = this.url;
    }
}

// r <3


let blockReact = ['clan-menu-clan-name-input', 'nickname', 'chat'];

const keyChange = (event, down) => {
    if (blockReact.includes(document.activeElement.id.toLowerCase())) return `Blocked key change.`
    keyDown[event.keyCode] = down;

    let isPrimary = [49, 97].includes(event.keyCode);
    let isSecondary = [50, 98].includes(event.keyCode);
    console.debug(event.code)
    if (event.code == 'KeyY') {
        let katana = [1, 12, 9, 19, 20, 15, 8, 17, 16];
        katana.forEach(e => Game.send(new Uint8Array([14, e])));
    }

    if (down && (isPrimary || isSecondary)) Config.weapon = Number(isSecondary);
    switch (event.code) {
        case "ShiftLeft":
            Sploop.take(Config.weapon);
            break
        case document.querySelector('[data-key="instakill"]').value:
            log("InstaKill")
            break
        case document.querySelector('[data-key="crystalgear"]').value:
            Sploop.equip(4)
            break
        case document.querySelector('[data-key="boosthat"]').value:
            Sploop.equip(7)
            break;
        case document.querySelector('[data-key="berserkergear"]').value:
            Sploop.equip(2)
            break
        case document.querySelector('[data-key="spikegear"]').value:
            Sploop.equip(5)
            break;
        case document.querySelector('[data-key="Demolist"]').value:
            Sploop.equip(11)
            break;
    }
    Placer.update();
};

setInterval(Placer.update, 75);

document.addEventListener("keydown", (event) => keyChange(event, true));
document.addEventListener("keyup", (event) => keyChange(event, false));

const getDistance = (player, player2) => {
    return Math.sqrt(Math.pow((player.x - player2.x), 2) + Math.pow((player.y - player2.y), 2));
}

const getAngle = (player, player2) => {
    return Math.atan2(player.y - player2.y, player.x - player2.x)
}

const encodeSym = Symbol();
let init
const ReqFrame = requestAnimationFrame;
window.requestAnimationFrame = function () {
    Config.update("fps");
    ReqFrame.apply(this, arguments);
}


let updateInfo = () => {
    if (user && user.alive) {
        let Display = ``;
        let addText = (text = '') => {
            Display += (text + '<br/>')
        }

        addText(`health: ${Math.round(user.health)}/100`);
        addText(`push: o${Config.pushing ? 'n' : 'ff'}line`);
        addText(`stuck: ${Config.breaking ? 'yes' : 'no'}`);
        addText(`speed: ${Math.round(user.speed)}`);
        addText();
        addText(`cps: ${Config.cps}`);
        addText(`pps: ${Config.pps}`);
        addText(`tps: ${Config.tps}`);
        addText(`fps: ${Config.fps}`);
        if (!Toggle.UI) {
            Display = ""
        }
        $("#info-content").html(Display)
    }
    ;
}
var ctx2d
const gctx = CanvasRenderingContext2D.prototype.clearRect;
CanvasRenderingContext2D.prototype.clearRect = function () {
    if (this.canvas.id === "game-canvas") {
        Canvas = this.canvas
        Context = Canvas.getContext("2d")
        ctx2d = this;
    }
    return gctx.apply(this, arguments);
}

/* Tracers */
let dlo = 0, dlod = Date.now()

function tracer(x, y, mx, my, color) {
    Context.save()
    Context.lineCap = "round"
    Context.lineWidth = 5
    Context.globalAlpha = .50
    Context.beginPath()
    Context.lineDashOffset = -dlo
    Context.strokeStyle = color
    Context.moveTo(mx, my)
    Context.lineTo(x, y)
    Context.stroke()
    Context.restore()
}

let tracerX = 0, tracerY = 0, tracermX = 0, tracermY = 0

const { fillRect } = CanvasRenderingContext2D.prototype;
CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
    let cp = (tracerX > 0 && tracerY > 0 && tracermX > 0 && tracermY > 0)
    if (!dlod || Date.now() - dlod >= 10) {
        dlo++
        dlod = Date.now()
    }
    if (this.fillStyle === "#a4cc4f") {
        tracermX = x + 50
        tracermY = y - 70
        fillRect.call(this, x, y, width, height);
    } else if (this.fillStyle === "#cc5151") {
        tracerX = x + 50
        tracerY = y - 70
        fillRect.call(this, x, y, width, height);
    }
    if (user.alive && cp && Toggle.tracers) {
        tracer(tracerX, tracerY, tracermX, tracermY, "#cc5151")
    }
    fillRect.call(this, x, y, width, height);
    return fillRect.apply(this, arguments);
}

const { fillText } = CanvasRenderingContext2D.prototype;
CanvasRenderingContext2D.prototype.fillText = function (text, x, y) {
    if (text == user.name && text.length > 1 || typeof text == "string" && text.startsWith(String.fromCharCode(0))) {
        let hue = 0;
        let step = 360 / user.name.length;
        for (let letter of text) {
            this.fillStyle = `hsl(${hue}, 100%, 50%)`;
            fillText.call(this, letter, x, y);
            x += this.measureText(letter).width;
            hue = (hue + step) % 360;
        }
        return;
    }
    return fillText.apply(this, arguments);
}

let settingMenu = `
<div id="settingMenu" class="pop-box">
  <div class="menu-title">
    <div class="pop-title text-shadowed-4">Settings</div>
    <div class="pop-close-button">
      <img id="setting-menu-close-button" class="pop-close" draggable="false" src="https://images-ext-2.discordapp.net/external/mgjNglv928NY9v8XuIr2Z2mFbQHliKADNMZn9XsDibA/https/sploop.io/img/ui/close.png">
    </div>
  </div>
  <div class="navbar">
    <div class="nb-btn text-shadowed-3" id="hack" style="margin-right: 10px;">Hack</div>
    <div class="nb-btn text-shadowed-3" id="control">Control</div>
  </div>
  <div class="select pop-list-content scrollbar text-shadowed-3 content subcontent-bg" id="hat_menu_content" data-menu="1"></div>
  <div class="select pop-list-content scrollbar text-shadowed-3 content subcontent-bg" id="hat_menu_content" data-menu="2" style="display: none;">
    <div class="control-box">
      <p style="font-size: 20px;font-weight: bold;color: white;">HealSpeed</p>
      <input id="control-key" data-speed="heal" class="input text-shadowed-3" placeholder="Enter speed..." value="100">
    </div>
    <div class="control-box">
      <p style="font-size: 20px;font-weight: bold;color: white;">AddHealMS</p>
      <input id="control-key" data-speed="addms" class="input text-shadowed-3" placeholder="Enter speed..." value="0">
    </div>
    <div class="control-box">
      <p style="font-size: 20px;font-weight: bold;color: white;">InstaKill</p>
      <input id="control-key" data-key="instakill" onKeyPress=SupressInput(event); class="input text-shadowed-3" placeholder="Enter key..." value="KeyR">
    </div>
    <div class="control-box">
      <p style="font-size: 20px;font-weight: bold;color: white;">CrystalGear</p>
      <input id="control-key" data-key="crystalgear" onKeyPress=SupressInput(event); class="input text-shadowed-3" placeholder="Enter key..." value="KeyT">
    </div>
    <div class="control-box">
      <p style="font-size: 20px;font-weight: bold;color: white;">BerserkerGear</p>
      <input id="control-key" data-key="berserkergear" onKeyPress=SupressInput(event); class="input text-shadowed-3" placeholder="Enter key..." value="KeyC">
    </div>
    <div class="control-box">
      <p style="font-size: 20px;font-weight: bold;color: white;">SpikeGear</p>
      <input id="control-key" data-key="spikegear" onKeyPress=SupressInput(event); class="input text-shadowed-3" placeholder="Enter key..." value="KeyG">
    </div>
        <div class="control-box">
      <p style="font-size: 20px;font-weight: bold;color: white;">Demolist</p>
      <input id="control-key" data-key="Demolist" onKeyPress=SupressInput(event); class="input text-shadowed-3" placeholder="Enter key..." value="KeyG">
    </div>
    <div class="control-box">
      <p style="font-size: 20px;font-weight: bold;color: white;">BoostHat</p>
      <input id="control-key" data-key="boosthat" onKeyPress=SupressInput(event); class="input text-shadowed-3" placeholder="Enter key..." value="KeyB">
    </div>
  </div>
</div>
<style>
.control-box {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
#control-key {
  width: 180px;
  text-align: left;
  text-indent: 16px;
  color: white;
  line-height: 70px;
  height: 40px;
  font-weight: 600;
}
.navbar {
  display: flex;
}
.nb-btn {
  margin-top: 5px;
  width: 150px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 -3px 0 #333;
  border-radius: 7px;
  background-color: rgb(40 45 34 / 60%);
  border: 4px solid #141414;
  cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;
}
#hat_menu_content {
  padding: 8px 0 0 0;
  margin-bottom: 0px;
  margin-top: 2.5px;
}
.togglerButton {
  margin-left: auto;
  outline: none;
  border: 4px solid #141414;
  padding: 7px;
  font-size: 16px;
  margin-right: 5px;
  cursor: url(https://sploop.io/img/ui/cursor-pointer.png) 6 0, pointer;
  margin-top: auto;
  margin-bottom: auto;
  color: #fff;
  border-radius: 10px;
  background-color: #96b943;
  box-shadow: inset 0 -5px 0 #809836;
}
.togglerButton:hover {
  background-color: #b5de53;
  box-shadow: inset 0 -5px 0 #95af44;
}
.name-desc {
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  margin-bottom: 5px;
}
.item-container {
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 3px solid #141414;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 5px;
}
.menu-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#settingMenu {
  position: absolute;
  top: 80%;
  left: 80%;
  transform: translate(-50%, -50%);
  height: 367px;
  width: 500px;
  display: none;
  opacity: 1;
  background: rgba(40, 45, 34, 0.6);
  color: #fff;
}
</style>
<script>
function SupressInput($event) {
  $event.preventDefault();
}
</script>
`

const __TOGGLERS__ = [{
    name: "AutoHeal",
    desc: "Auto heals you",
    id: "autoheal",
    active: true,
    last: false
}, {
    name: "Optimized Heal",
    desc: "Optimizes autoheal in some cases",
    id: "optheal",
    active: false,
    last: false
}, {
    name: "AutoPush",
    desc: "Automatically pushes enemies into spikes",
    id: "autopush",
    active: true,
    last: false
}, {
    name: "AutoPlace",
    desc: "Optimizes and automates spike and trap placement",
    id: "autoplace",
    active: true,
    last: false
}, {
    name: "AutoSync",
    desc: "Optimized attacking & Auto hat switching",
    id: "autosync",
    active: true,
    last: false
}, {
    name: "AutoBreak",
    desc: "Automatically breaks out of traps",
    id: "autobreak",
    active: true,
    last: false
}, {
    name: "AutoRespawn",
    desc: "Auto respawn you",
    id: "autorespawn",
    active: false,
    last: false
}, {
    name: "UI",
    desc: "visibility of the UI",
    id: "ui",
    active: true,
    last: false
}, {
    name: "AutoChat",
    desc: "Sing cool song",
    id: "autochat",
    active: false,
    last: false
}, {
    name: "Tracers",
    desc: "Draw tracers to enemies",
    id: "tracers",
    active: true,
    last: false
}, {
    name: "AntiAFK",
    desc: "move every 5 seconds",
    id: "antiAFK",
    active: false,
    last: true
}]

function __TOGGLER__(name, desc, id, active, last) {
    return `
  <div class="item-container" style="margin-top: 4px; ${last ? "border-bottom: none;" : "border-bottom: 3px solid #141414;"}">
    <div class="name-desc">
      <p style="font-size: 16px;font-weight: bold;color: white;">${name}</p>
      <p style="font-size: 14px; color: #d2c396;">${desc}</p>
    </div>
    <button class="togglerButton text-shadowed-3" id="${id}" style="${active ? "outline: none;" : "background: #b94343; box-shadow: inset 0 -5px 0 #983636"}">
      ${active ? "Enabled" : "Disabled"}
    </button>
  </div>
  `
}

function genTogglers() {
    __TOGGLERS__.forEach(t => {
        $('[data-menu="1"]').append(__TOGGLER__(t.name, t.desc, t.id, t.active, t.last))
    })
}

function addNotifications(text, color = "#fff") {
    let idGen = () => "notification-" + ~~(Math.random() * 10000) + 1,
        readyId = idGen()
    let add = `
    <div class="box text-shadowed-3" id="${readyId}" style="display: block; opacity: 0;">
      <span style="color: ${color};">
        ${text}
      </span>
    </div>
    `
    $(".notifications-holder").prepend(add)
    $("#" + readyId).show().animate({ opacity: 1 }, 750)
    setTimeout(() => {
        $("#" + readyId).animate({ opacity: 0 }, 750, () => {
            $("#" + readyId).remove()
        });
    }, 3000)
}

window.rContextMenu = () => {
    let elm = document.getElementsByTagName('*')
    for (let i = 0; i < elm.length; ++i) {
        elm[i].oncontextmenu = null
    }
}

function cEl(e, t, n, g) {
    addNotifications(`${n} <span style='color: ${t ? "#8ecc51" : "#cc5151"}'>${t ? "enabled" : "disabled"}</span>`)
    $(e).css("background", !t ? "#b94343" : "#96b943")
    $(e).css("box-shadow", !t ? "inset 0 -5px 0 #983636" : "inset 0 -5px 0 #809836")
    $(e).text(!t ? "Disabled" : "Enabled")
    $(e).hover(() => {
        $(e).css("background", !t ? "#de5353" : "#b5de53")
        $(e).css("box-shadow", !t ? "inset 0 -5px 0 #af4444" : "inset 0 -5px 0 #95af44")
    }, function () {
        $(e).css("background", !t ? "#b94343" : "#96b943")
        $(e).css("box-shadow", !t ? "inset 0 -5px 0 #983636" : "inset 0 -5px 0 #809836")
    })
}

/* ChangeLog menu */
let changeLogMenu = `
<div class="centerMenu">
  <div class="pop-box popup-fade-in" id="script-changelog" style="display: flex;">
    <div class="pop-top">
      <div class="pop-title text-shadowed-4" style="display: flex;align-items: center;">
        <a class="pointer" style="margin-right: 5px;" href="https://discord.gg/EETcmmFgAt" target="_blank"><img class="pointer" draggable="false" src="img/ui/discord.png"></a>
        SploMod - The best hack of 2024
      </div>
      <div class="pop-close-button"><img class="pop-close" id="close-script-cl" draggable="false" src="img/ui/close.png"></div>
    </div>
    <div class="pop-list-content scrollbar text-shadowed-3" id="changeLog-s"></div>
  </div>
</div>
<style>
.centerMenu {
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgb(39 66 35 / 60%);
  z-index: 100;
  transform-origin: center;
}
#script-changelog {
  width: 615px;
  height: 475px;
}
</style>
`

let __CHANGELOGS__ = [
    {
        version: "FINAL",
        date: "2024-8-26",
        added: true,
        remove: false,
        fixed: true,
        addedContent: ["Reduced the packet limit to prevent yourself getting kicked"],
        removedContent: [],
        fixedContent: [
            "This script was patched like one year's ago, It got fixed by Ilyax and Ilyax made her own fans for splomod playable again."
        ]
    },
    {
        version: "3.2.2",
        date: "2022-3-27",
        added: false,
        remove: false,
        fixed: true,
        addedContent: [],
        removedContent: [],
        fixedContent: [
            "click the discord icon in this menu to get to our discord."
        ]
    },
    {
        version: "3.2.1",
        date: "2022-3-20",
        added: false,
        remove: false,
        fixed: true,
        addedContent: [],
        removedContent: [],
        fixedContent: [
            "fixed tracers, they are now clean and have a better design.",
            "join our discord server! (click the discord icon)"
        ]
    },
    {
        version: "3.2",
        date: "2022-3-20",
        added: true,
        remove: false,
        fixed: true,
        addedContent: [
            "AntiAFK - moves every 5 seconds",
            "Tracers - draw lines to enemies"
        ],
        removedContent: [],
        fixedContent: [
            "Fixed UI toggle not working.",
            "improved optimized heal",
            "join our discord server! (click the discord icon)"
        ]
    },
    {
        version: "3.1.1",
        date: "2022-3-19",
        added: true,
        remove: false,
        fixed: true,
        addedContent: [
            "Added autochat",
        ],
        removedContent: [
            "nothing"
        ],
        fixedContent: [
            "join our discord server! (click the discord icon)"
        ]
    },
    {
        version: "3.1",
        date: "2022-3-19",
        added: true,
        remove: true,
        fixed: true,
        addedContent: [
            "Added changelog menu.",
        ],
        removedContent: [
            "Removed nothing."
        ],
        fixedContent: [
            "Fixed autoheal speed.",
            "join our discord server! (click the discord icon)"
        ]
    }, {
        version: "3",
        date: "2022-3-19",
        added: true,
        remove: false,
        fixed: false,
        addedContent: [
            "Added game menu.",
            "Added optimized autoheal."
        ],
        removedContent: [
            "None.",
            "Nothing."
        ],
        fixedContent: [""]
    }]

function __CHANGELOG__(version, date, added, remove, fixed, addedContent, removedContent, fixedContent) {
    let add = "",
        rem = "",
        fix = ""
    let at = '<li class="subcontent-subtitle">Added</li>',
        rt = '<li class="subcontent-subtitle">Removed</li>',
        ft = '<li class="subcontent-subtitle">Fixed</li>'
    let ac = () => {
        let res = ""
        let al = addedContent.length
        for (let i = 0; i < al; i++) {
            res += `<li>- ${addedContent[i]}</li>`
        }
        return res
    }
    let rc = () => {
        let res = ""
        let rl = removedContent.length
        for (let i = 0; i < rl; i++) {
            res += `<li>- ${removedContent[i]}</li>`
        }
        return res
    }
    let fc = () => {
        let res = ""
        let fl = fixedContent.length
        for (let i = 0; i < fl; i++) {
            res += `<li>- ${fixedContent[i]}</li>`
        }
        return res
    }
    if (added) {
        add = `
        <ul>
          ${ac()}
          <br>
        </ul>
        `
    }
    if (remove) {
        rem = `
        <ul>
          ${rc()}
          <br>
        </ul>
        `
    }
    if (fixed) {
        fix = `
        <ul>
          ${fc()}
          <br>
        </ul>
        `
    }
    return `
    <ul class="subcontent-bg">
      <li class="subcontent-title">[${version}] - ${date}</li>
      <ol>
        ${added ? at + add : ""}
        ${remove ? rt + rem : ""}
        ${fixed ? ft + fix : ""}
      </ol>
    </ul>
  `
}

function genChangeLogs() {
    __CHANGELOGS__.forEach(cl => {
        $("#changeLog-s").append(__CHANGELOG__(cl.version, cl.date, cl.added, cl.remove, cl.fixed, cl.addedContent, cl.removedContent, cl.fixedContent))
    })
}

let changeLog = true

function controlSaver() {
    let items = ["bha", "sga", "bga", "cga", "ika", 'dem']
    let datas = ["boosthat", "spikegear", "berserkergear", "crystalgear", "instakill", 'Demolist']
    for (let i = 0; i < datas.length; i++) {
        document.querySelector(`[data-key="${datas[i]}"]`).value = localStorage.getItem(items[i]) || document.querySelector(`[data-key="${datas[i]}"]`).value
    }
    document.querySelector('[data-speed="heal"]').value = localStorage.getItem("heal") || document.querySelector('[data-speed="heal"]').value
    document.querySelector('[data-speed="addms"]').value = localStorage.getItem("addms") || document.querySelector('[data-speed="addms"]').value
}

/* Add at event DOMContentLoaded so that there is no HTML substitution bug */
document.addEventListener("DOMContentLoaded", () => {
    $("body").append(settingMenu)
    $("body").append(changeLogMenu)
    $("#close-script-cl").click(() => $(".centerMenu").css("display", "none"))
    let bha = [false, document.querySelector('[data-key="boosthat"]')]
    let dem = [false, document.querySelector('[data-key="Demolist"]')]
    let sga = [false, document.querySelector('[data-key="spikegear"]')]
    let bga = [false, document.querySelector('[data-key="berserkergear"]')]
    let cga = [false, document.querySelector('[data-key="crystalgear"]')]
    let ika = [false, document.querySelector('[data-key="instakill"]')]
    document.querySelector('[data-speed="heal"]').oninput = (e) => (e.target.value = e.target.value.replace(/\D/g, ''), localStorage.setItem("heal", document.querySelector('[data-speed="heal"]').value))
    document.querySelector('[data-speed="addms"]').oninput = (e) => (e.target.value = e.target.value.replace(/\D/g, ''), localStorage.setItem("addms", document.querySelector('[data-speed="addms"]').value))
    bha[1].onclick = () => (bha[1].value = "...", bha[0] = true)
    dem[1].onclick = () => (dem[1].value = "...", dem[0] = true)
    sga[1].onclick = () => (sga[1].value = "...", sga[0] = true)
    bga[1].onclick = () => (bga[1].value = "...", bga[0] = true)
    cga[1].onclick = () => (cga[1].value = "...", cga[0] = true)
    ika[1].onclick = () => (ika[1].value = "...", ika[0] = true)
    document.addEventListener("keydown", e => {
        if (bha[0]) (bha[0] = false, bha[1].value = e.code, localStorage.setItem("bha", e.code))
        if (dem[0]) (dem[0] = false, dem[1].value = e.code, localStorage.setItem("dem", e.code))
        if (sga[0]) (sga[0] = false, sga[1].value = e.code, localStorage.setItem("sga", e.code))
        if (bga[0]) (bga[0] = false, bga[1].value = e.code, localStorage.setItem("bga", e.code))
        if (cga[0]) (cga[0] = false, cga[1].value = e.code, localStorage.setItem("cga", e.code))
        if (ika[0]) (ika[0] = false, ika[1].value = e.code, localStorage.setItem("ika", e.code))
    })
    genChangeLogs()
    controlSaver()
    if (changeLog) {
        $(".centerMenu").css("display", "flex")
        changeLog = false
    }
    genTogglers()
    $("#autoheal").click(() => (Toggle.autoHeal = !Toggle.autoHeal, cEl("#autoheal", Toggle.autoHeal, "AutoHeal")))
    $("#autopush").click(() => (Toggle.autoPush = !Toggle.autoPush, cEl("#autopush", Toggle.autoPush, "AutoPush")))
    $("#autosync").click(() => (Toggle.autoSync = !Toggle.autoSync, cEl("#autosync", Toggle.autoSync, "AutoSync")))
    $("#autoplace").click(() => (Toggle.autoPlace = !Toggle.autoPlace, cEl("#autoplace", Toggle.autoPlace, "AutoPlace")))
    $("#autobreak").click(() => (Toggle.autoBreak = !Toggle.autoBreak, cEl("#autobreak", Toggle.autoBreak, "AutoBreak")))
    $("#autochat").click(() => (log(Toggle.autoChat), Toggle.autoChat = !Toggle.autoChat, cEl("#autochat", Toggle.autoChat, "AutoChat")))
    $("#tracers").click(() => (Toggle.tracers = !Toggle.tracers, cEl("#tracers", Toggle.tracers, "Tracers")))
    $("#autorespawn").click(() => (Toggle.autoRespawn = !Toggle.autoRespawn, cEl("#autorespawn", Toggle.autoRespawn, "AutoRespawn")))
    $("#optheal").click(() => (Toggle.optHeal = !Toggle.optHeal, cEl("#optheal", Toggle.optHeal, "OptimizedAutoheal")))
    $("#ui").click(() => (Toggle.UI = !Toggle.UI, cEl("#ui", Toggle.UI, "UI")))
    $("#antiAFK").click(() => (Toggle.antiAFK = !Toggle.antiAFK, cEl("#antiAFK", Toggle.antiAFK, "antiAFK")))
    $("#setting-menu-close-button").click(() => {
        $("#settingMenu").css("display", "none")
    })
    $("#hack").click(() => {
        $('[data-menu="1"]').css("display", "block")
        $('[data-menu="2"]').css("display", "none")
    })
    $("#control").click(() => {
        $('[data-menu="1"]').css("display", "none")
        $('[data-menu="2"]').css("display", "block")
    })
    document.addEventListener("keydown", e => {
        if (e.code == "Escape") {
            if ($("#settingMenu").css("display") == "flex") {
                $("#settingMenu").css("display", "none")
            } else {
                $("#settingMenu").css("display", "flex")
                $("#clan-menu").css("display", "none")
                $("#hat-menu").css("display", "none")
            }
        }
    })
    setInterval(() => {
        if ($("#clan-menu").css("display") == "block" || $("#hat-menu").css("display") == "flex") {
            $("#settingMenu").css("display", "none")
        }
        if ($("#homepage").css("display") == "flex") {
            $("#settingMenu").css("display", "none")
        }
    }, 500)
})




