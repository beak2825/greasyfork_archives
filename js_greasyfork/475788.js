// ==UserScript==
// @name         Splo Mod
// @description  Autobreak-trap, Autoheal, Hat macros, Anti-trap, AutoPush & more!
// @version      2.8
// @author       Wealthy#8266 & Nuro#9999
// @match        *://sploop.io/*
// @run-at       document-start
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @grant        none
// @namespace https://greasyfork.org/users/761829
// @downloadURL https://update.greasyfork.org/scripts/475788/Splo%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/475788/Splo%20Mod.meta.js
// ==/UserScript==

let version = "2.8"

let addHealMS = 0
let Game;
let Entity = new Array();
let Canvas;
let ctx;
let keyDown = [];
let user = {};
let tribe = [];
let enemy;
let encoder = new TextEncoder();
let decoder = new TextDecoder();
let server;

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
    resolver: function(){},
    last: Date.now(),
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
    UI: false,
    autoBreak: true,
    autoPush: true,
    autoPlace: true,
    autoSync: true
}

class Macro {
    constructor(advanced, spike, trap, mill, food){
        this.advanced = advanced;
        this.spike = spike;
        this.trap = trap;
        this.mill = mill;
        this.food = food;
    };

    update(){
        if(keyDown[this.spike]) Sploop.newPlace(4);
        if(keyDown[this.trap]) Sploop.newPlace(7);
        if(keyDown[this.mill]) Sploop.newPlace(5);
        if(keyDown[this.food]) Sploop.newPlace(2);
    };
};

let Placer = new Macro(true, 86, 70, 78, 81);

class Sploop {
    static place(id, angle = Config.angle){
        Config.update('cps');
        Sploop.take(id);
        Sploop.hit(angle);
        Sploop.take(Config.weapon);
    }

    static newPlace(id, angle = Config.angle){
        let increasor = Math.PI / 8; // 22.25 radians
        let offset = Math.PI / 4; // 45 radians

        this.place(id, angle, true)

        for(let newAngle = 0; newAngle < offset; newAngle += increasor){
            Sploop.place(id, angle - newAngle);
            Sploop.place(id, angle + newAngle);
        }

        Sploop.take(Config.weapon);
    }

    static quad(id, angle = 0){
        for(let newAngle = 0; newAngle < Math.PI * 2; newAngle += Math.PI / 8){
            let time = (Config.serverUpdate / 4) * (newAngle / (Math.PI / 8))

            setTimeout(() => Sploop.place(7, angle + newAngle), time);
        }
    }

    static heal(amount) {
        for(let count = 0; count <= amount; count++) Sploop.place(2);
    }

    static equip(id) {
        if(user.skin != id) Game.send(new Uint8Array([9, id]));
    }

    static walk(angle = Config.move) {
        if(typeof angle !== 'number') return Game.send(new Uint8Array([1, 0]));

        angle = (65535 * (angle + Math.PI)) / (2 * Math.PI);

        Game.send(new Uint8Array([15, 255 & angle, (angle >> 8) & 255]));
    }

    static take(id) {
        Game.send(new Uint8Array([8, id]));
    }

    static chat(text){
        text = encoder.encode(text);

        Game.send(new Uint8Array([10, ...text]))
    }

    static hit(angle) {
        angle = (65535 * (angle + Math.PI)) / (2 * Math.PI);

        Game.send(new Uint8Array([4, 255 & angle, (angle >> 8) & 255]));
        Game.send(new Uint8Array([5]));
    }

    static watch(angle){
        angle = (65535 * (angle + Math.PI)) / (2 * Math.PI);

        Game.send(new Uint8Array([2, 255 & angle, (angle >> 8) & 255]));
    }

    static offensive(){
        let offensive = () => {
            let distance = enemy ? Math.dist(enemy, user) : 0;

            if(user.y <= 9e3 && user.y >= 8e3) return 9;
            if(enemy && distance <= 300) return false && distance <= 150 ? 6 : 5;

            return 7;
        }

        Sploop.equip(offensive());
    }

    static healthChange(health, oldHealth){
        if(oldHealth > health){
            user.hitDate = Config.counter;
        };

        user.health = health;
    }

    static mine(build){
        if(user.id2 == build.id2) return true;
        if(user.team){
            let length = tribe.length;
            for(let index = 0; index < length; index++) {
                let teammate = tribe[index];
                if(build.id2 == teammate.id2) return true;
            }
        }
        return false;
    }

    static update(){
        Config.counter += 1;
        Config.resolver();
        Config.last = Date.now();

        if(user.alive){
            if(user.health < 100){
                setTimeout(() => {
                    let amount = 3;
                    Sploop.heal(amount);
                }, (Config.serverUpdate - 20 - Config.ping) + addHealMS);
            };

            let trap = Entity.find(c => c && Math.dist(c, user) <= 50 && c.type == 6 && !Sploop.mine(c));
            let wasBreaking = Config.breaking;
            Config.breaking = false;

            if(trap && Toggle.autoBreak){
                console.log(trap, user)
                let angle = Math.angle(trap, user);
                Config.breaking = true;

                Sploop.hit(angle);
                Sploop.equip(6);

                if(!wasBreaking) Sploop.quad(7, angle);
            } else if(wasBreaking){
                Sploop.offensive();
            }

            let wasPushing = Config.pushing;
            Config.pushing = false;

            if(enemy && !trap && user.alive){
                let distance = Math.dist(enemy, user);

                if(Toggle.autoPush && distance <= 250){
                    let trap = Entity.find(c => c && Math.dist(c, enemy) <= 50 && c.type == 6 && Sploop.mine(c));

                    if(trap){
                        let spikes = Entity.filter(c => c && [2, 7, 17].includes(c.type) && Sploop.mine(c) && Math.dist(c, trap) <= 130);

                        if(spikes.length){
                            let spike = spikes.sort((a, b) => Math.dist(a, trap) - Math.dist(b, trap))[0];
                            let angle = Math.angle(enemy, spike);
                            distance = Math.dist(enemy, spike) + 70;
                            let position = {
                                x: spike.x + (distance * Math.cos(angle)),
                                y: spike.y + (distance * Math.sin(angle))
                            };

                            distance = Math.dist(position, user);
                            angle = () => {
                                if(distance > 40){
                                    return Math.angle(position, user)
                                } else {
                                    let angleDifference = Math.abs(Math.angle(spike, position) - Math.angle(spike, user))
                                    let message = `diffence [${angleDifference / (Math.PI / 180)}]`

                                    // Sploop.chat(message);
                                    return Math.angle(enemy, user)
                                }
                            }

                            Config.pushing = true;
                            Sploop.walk(angle())
                        }
                    }
                }

                distance = Math.dist(enemy, user)
                if(Toggle.autoPlace && distance <= 200){
                    let trap = Entity.find(c => c && c.type == 6 && Sploop.mine(c) && Math.dist(c, enemy) <= 50);
                    let enemyPos = {
                        x: enemy.x + enemy.xVel,
                        y: enemy.y + enemy.yVel
                    }
                    let userPos = {
                        x: user.x + user.xVel,
                        y: user.y + user.yVel
                    }
                    distance = Math.dist(enemyPos, userPos);
                    let angle = Math.angle(enemyPos, userPos)
                    let range = 28 * 2 + 50;

                    if(trap){
                        angle = Math.angle(trap, userPos);

                        for(let newAngle = 0; newAngle < Math.PI / 2; newAngle += Math.PI / 9){
                            Sploop.place(4, angle + newAngle);
                            Sploop.place(4, angle - newAngle);
                        }
                    } else {
                        if(Toggle.autoSync && distance < 250){
                            let spike = Entity.find(c => c && [2, 7, 17].includes(c.type) && Sploop.mine(c) && Math.dist(c, enemyPos) <= 60);
                            if(spike){
                                Sploop.equip(2);
                                Sploop.take(0);
                                Sploop.hit(angle);
                                setTimeout(() => Sploop.offensive(), 2e3);
                            }
                            if(enemy.health <= (enemy.skin == 2 ? 78 : 85) && user.skin == 5 && user.health <= 70){
                                Sploop.equip(2);
                                Sploop.take(0);
                                Sploop.hit(angle);
                                setTimeout(() => Sploop.offensive(), 2e3);
                            }
                        }

                        if(range >= distance){
                            Sploop.place(7, angle);
                        }
                    }
                }
            }

            if(wasPushing && !Config.pushing) Sploop.walk('Stop');
        }

        Placer.update();
    }
}


class Script {
    setup(){
        this.run();
    };
    override(ws, data){
        !Config.freeze.send && this.log(`WebSocket`, `⬈`, data[0], '#8ecc51');
        ws.classic(data, true);
        let string = Config.isJson(data);
        data = string ? JSON.parse(data) : new Uint8Array(data);
        let item = data[0];
        switch(item) {
            case 6:
                user.name = data[1];
                break;
        }


        Config.update('pps');
    }

    send(data){
        this.ws && 1 === this.ws.readyState && (typeof data !== "string" && window.encoder.encode(data), this.ws.classic(data, true))
        Config.update('pps');
    }

    message(event){
        let data = event.data;
        let string = typeof data === 'string';
        let decoded = string ? JSON.parse(data) : new Uint8Array(data);
        let length = decoded.length;
        let id = Number(decoded[0]);
        let found = Config.messages[Number(string)].find(item => item && item.id == id);

        if(!found) return !Config.freeze.message && Game.log(`WebSocket`, `⬉`, `${decoded} | ${string}`, '#c7cc51');

        switch(found.name){
            case 'Player update':
                enemy = null;
                tribe = [];

                for(let index = 0; index < Entity.length; index++){
                    let player = Entity[index];
                    if(player) player.visible = false;
                }

                for (let int = 1; int < length; int += 18) {
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

                    let Default = {fd: 2, active: true, health: 100, x: 0, y: 0, xVel: 0, yVel: 0};
                    let temp = Entity[index] || Default;
                    temp.visible = true;


                    if (broken & 2) {
                        Entity[index] = null;
                    } else {
                        if (temp.fd & 2) {
                            temp.type = type;
                            temp.id = index;
                            temp.health = health;
                            temp.id3 = broken;
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
                        }

                        Entity[index] = temp;

                        if(temp.id === user.id) {
                            Sploop.healthChange(temp.health, user.health);
                            Object.assign(user, temp)
                        } else if(!temp.type && (user.team && user.team == temp.team)){
                            tribe.push(temp);
                        } else if(!temp.type && (!user.team || temp.team != user.team)){
                            let distance = Math.hypot(user.y - temp.y, user.x - temp.x);
                            let distance2 = enemy ? Math.hypot(user.y - enemy.y, user.x - enemy.x) : null;
                            if(enemy){
                                if(distance < distance2) enemy = temp;
                            } else {
                                enemy = temp;
                            }
                        }

                    }
                }

                Config.update('tps');
                Sploop.update();
                break;
            case 'Spawn':
                user.id = decoded[1];
                user.alive = true;
                user.spawnDate = Date.now();
                user.health = 100;
                Config.weapon = 0;
                break;
            case 'Death':
                user.health = 0;
                user.speed = 0;
                user.alive = false;
                break;
            case 'Ping update':
                Config.ping = decoded[1] | (decoded[2] << 8);
                break;
        }

        Placer.update();
    }

    log(group, symbol, result, color){
        return console.log(`%c[${group}] %c${symbol}`, `color:${color};font-weight:bold`, `color:${color}`, result);
    }

    run(ws){
        !Config.freeze.setup && Game.log(`Hijacked Iframe`, `✔`, ws.url, '#0f0');
        let notifications = `<div class="notifications-holder"></div><style>.box span{font-size: 20px; white-space: nowrap;}.box{width: max-content; height: 40px; display: flex; align-items: center; padding-top: 3.5px; padding-left: 7px; padding-right: 7px; border-radius: 7px; background-color: rgb(40 45 34 / 60%); border: 4px solid #141414; margin-bottom: 5px; color: white; letter-spacing: 1px; font-weight: bold; box-shadow: inset 0 -3px 0 #333; text-shadow: rgb(20 20 20) 3px 0px 0px, rgb(20 20 20) 2.83487px 0.981584px 0px, rgb(20 20 20) 2.35766px 1.85511px 0px, rgb(20 20 20) 1.62091px 2.52441px 0px, rgb(20 20 20) 0.705713px 2.91581px 0px, rgb(20 20 20) -0.287171px 2.98622px 0px, rgb(20 20 20) -1.24844px 2.72789px 0px, rgb(20 20 20) -2.07227px 2.16926px 0px, rgb(20 20 20) -2.66798px 1.37182px 0px, rgb(20 20 20) -2.96998px 0.42336px 0px, rgb(20 20 20) -2.94502px -0.571704px 0px, rgb(20 20 20) -2.59586px -1.50383px 0px, rgb(20 20 20) -1.96093px -2.27041px 0px, rgb(20 20 20) -1.11013px -2.78704px 0px, rgb(20 20 20) -0.137119px -2.99686px 0px, rgb(20 20 20) 0.850987px -2.87677px 0px, rgb(20 20 20) 1.74541px -2.43999px 0px, rgb(20 20 20) 2.44769px -1.73459px 0px, rgb(20 20 20) 2.88051px -0.838247px 0px;}.notifications-holder{position: absolute; left: 20px; top: 20px; display: flex; flex-direction: column; z-index: 5;}</style>`
        $("body").append(notifications)
        this.ws = ws;

        let infoPanel = '\n<div class="info-panel-holder">\n  <div id="info-content">\n  <p id="health"></div>\n</div>\n<style>\n#info-content {\n  color: #fff;\n  font-size: 22px;\n  text-shadow: 0px 0px 5px black, 0px 0px 7px black;\n}\n.info-panel-holder {\n  position: absolute;\n  top: 20px;\n  left: 20px;\n}\n</style>\n';
        $("body").append(infoPanel)

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

    constructor(){
        this.ws = null;
    }
};

const Setup = () => {
    Game = new Script();
    Game.log(`Setup`, `⦿`, '', '#000000');
    let data = Config.messages;

    data[0][1] = {name: 'Player update', string: false};
    data[0][2] = {name: 'Verify', string: false};
    data[0][5] = {name: 'Choose', string: false};
    data[0][7] = {name: 'Hit', string: false};
    data[0][14] = {name: 'Resource update', string: false};
    data[0][16] = {name: 'Projectile Hit', string: false};
    data[0][18] = {name: 'Chat', string: false};
    data[0][19] = {name: 'Choose x3', string: true};
    data[0][20] = {name: 'Choose x2', string: false};
    data[0][22] = {name: 'Ping update', string: false};
    data[0][23] = {name: 'Ping update', string: false};
    data[0][24] = {name: 'Create clan', string: false};
    data[0][25] = {name: 'Leave clan', string: false};
    data[0][26] = {name: 'Create clan', string: false};
    data[0][27] = {name: 'Leave clan', string: false};
    data[0][30] = {name: 'Place', string: false};

    data[1][2] = {name: 'Spawn', string: true};
    data[1][8] = {name: 'Player setup', string: true};
    data[1][9] = {name: 'Leaderboard update', string: true};
    data[1][11] = {name: 'Text', string: true};
    data[1][13] = {name: 'Death', string: true};
    data[1][19] = {name: 'Choose', string: true};
    data[1][35] = {name: 'new Verify', string: true};

    for(let index = 0; index <= 1; index++) {
        let length = data[index].length;
        for(let id = 0; id < length; id++) {
            if(data[index][id]) data[index][id].id = id;
        };
    };
};
Setup();

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
        !Config.freeze.setup && console.log('onmessage', f);
        super.onmessage = f;
    }
}

const hijacked = Symbol();

function hijack(window) {
    const getter = window.HTMLIFrameElement.prototype.__lookupGetter__('contentWindow');
    window.HTMLIFrameElement.prototype.__defineGetter__('contentWindow', function() {
        const hiddenWindow = getter.call(this);
        if (!hiddenWindow[hijacked]) {
            hijack(hiddenWindow);
            hiddenWindow.WebSocket = Nuro;
            hiddenWindow[hijacked] = true;
        }
        return hiddenWindow;
    });
}

hijack(window);

let blockReact = ['clan-menu-clan-name-input', 'nickname', 'chat'];

const keyChange = (event, down) => {
    if(blockReact.includes(document.activeElement.id.toLowerCase())) return `Blocked key change.`
    keyDown[event.keyCode] = down;

    let isPrimary = [49, 97].includes(event.keyCode);
    let isSecondary = [50, 98].includes(event.keyCode);

    if(down && (isPrimary || isSecondary)) Config.weapon = Number(isSecondary);

    switch(event.key.toUpperCase()) {
        case "T":
            Sploop.equip(4)
            break
        case "B":
            Sploop.equip(7)
            break;
        case "C":
            Sploop.equip(2)
            break
        case "G":
            Sploop.equip(5)
            break;
    }
    Placer.update();
};

setInterval(Placer.update, 50);

document.addEventListener("keydown", (event) => keyChange(event, true));
document.addEventListener("keyup", (event) => keyChange(event, false));

Math.dist = (player, player2) => {
    return Math.sqrt(Math.pow((player.x - player2.x), 2) + Math.pow((player.y - player2.y), 2));
}

Math.angle = (player, player2) => {
    return Math.atan2(player.y - player2.y, player.x - player2.x)
}

const encodeSym = Symbol();
Object.defineProperty(Object.prototype, 'encode', {
    get() {
        return this[encodeSym];
    },
    set(encode) {
        if(this.init) {
            window.encoder = this
        }
        this[encodeSym] = function() {
            return encode.apply(this, arguments)
        }
    }
});

const ReqFrame = requestAnimationFrame;
window.requestAnimationFrame = function() {
    Config.update("fps");
    ReqFrame.apply(this, arguments);
}


let updateInfo = () => {
    if(user && user.alive){
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

        $("#info-content").html(Display)
    };
}

const gctx = CanvasRenderingContext2D.prototype.clearRect;
CanvasRenderingContext2D.prototype.clearRect = function() {
    if (this.canvas.id === "game-canvas") {
        Canvas = this.canvas
    }
    return gctx.apply(this, arguments);
}
const { fillText } = CanvasRenderingContext2D.prototype;
CanvasRenderingContext2D.prototype.fillText = function(text, x, y) {
    if(text == user.name && text.length > 1 || typeof text == "string" && text.startsWith(String.fromCharCode(0))) {
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

