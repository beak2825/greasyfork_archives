// ==UserScript==
// @name         Luminary
// @version      1
// @description  old mod, ur gonna have to fix it urself if u want it to work (is easy)
// @icon         https://media.discordapp.net/attachments/1142509243988201492/1156159254957400094/PSX_20230926_142239.jpg?ex=6513f4b6&is=6512a336&hm=2ce7f5ecd6ba5c88558c44026953ea84b843b27cae8539d9613d1a8f1099c6dd&=&width=536&height=538
// @author       onion, pulsar
// @match        *://*.moomoo.io/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/1360517
// @downloadURL https://update.greasyfork.org/scripts/505935/Luminary.user.js
// @updateURL https://update.greasyfork.org/scripts/505935/Luminary.meta.js
// ==/UserScript==

/* Running bundle in VM */
// The process of transforming bundle is slow, but we need that
// for optimisation of firefox and recent chrome bug
window.ae = 2420;
window.re = 1480;
const babelURL = "https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js";
const obs = new MutationObserver(function(mutations) {
    for (let mutation of mutations) {
        const node = mutation.previousSibling;
        if (/bundle|jquery|howler|platform|ads/gm.test(node?.src)) {
            node.remove();
        }
    }
});
obs.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true
});
const msgpackUrl = "https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js?version=1005014";
if (!localStorage.bundle) {
    document.write("<style>body{font-family:monospace;font-size:20px;background:black;color:white}</style><h1>===</h1><br>");
    document.write("[*] KMDLoader 1.0 <br>");
    fetch(babelURL).then(e => e.text()).then(function(babel) {
        document.write("[*] Importing processor script (using Babel) <br>");
        (new Function(babel))();
        document.write("[*] Processor Loaded! <br>");
        fetch("bundle.js").then(r => r.text()).then(BUNDLE_SCRIPT => {
            document.write("[*] Bundle fetched <br>");
            // eslint-disable-next-line
            const { code } = Babel.transform(
                BUNDLE_SCRIPT.replaceAll("/18", "*18").replaceAll("(U==A?ci():U.dir)", "U.dir").replaceAll(",ae=r.maxScreenWidth,re=r.maxScreenHeight", "")
                , { presets: [ "es2015", "es2016" ] });
            localStorage.bundle = code;
            document.write("[*] Cached 1/2 Files <br>");
            fetch(msgpackUrl).then(r => r.text()).then((msgpackCode) => {
                localStorage.msgpack = msgpackCode;
                document.write("[*] Cached 2/2 Files <br>");
                localStorage._grecaptcha = null;
                localStorage.moofoll = true;
                document.write("[*] Installed! Reloading... <br>");
                setTimeout(function() {
                    location.href = "https://sandbox.moomoo.io";
                }, 1000);
            });
        });
    });
} else {
    (new Function(localStorage.msgpack))();
}
let item;
const boughtHats = [];
class GammaAPI {
    coff = 0;
    packets = 0;
    dead = false;
    taskRunning = false;
    events = [];
    nextTick = 111;
    speeds = [300, 400, 400, 300, 300, 700, 300, 100, 400, 600, 400, 1, 700, 230, 700, 1500];
    moveDir = null;
    qHoldRunning = false;
    onTick = [];
    findAngle(angle) {
        for (let i =-(Math.PI / 2 + angle); i < Math.PI / 2 + angle; i+=Math.PI / 3) {
            const player = this.__exports._items.context;
            const x = Math.cos(i) * 22 + player.x;
            const y = Math.sin(i) * 22 + player.y;
            const canPlace = this.__exports._checkItemLocation.hook(x, y, 22, 0.6, 2, false, storage.__exports._items.player);
            if (canPlace === true) {
                return i;
            }
        };
        return angle;
    };
    hatBuyer() {
        const hatsList = [
            { acc: 11, cost: 2000, isAcc: 1 },
            { hat: 6, cost: 4000, isAcc: 0 },
            { hat: 12, cost: 6000, isAcc: 0 },
            { hat: 7, cost: 6300, isAcc: 0 },
            { hat: 53, cost: 10000, isAcc: 0},
            { hat: 40, cost: 15000, isAcc: 0 },
            { acc: 13, cost: 16000, isAcc: 1 },
            { acc: 21, cost: 20000, isAcc: 1 }
        ];
        hatsList.forEach(item => {
            const property = item?.isAcc ? "acc" : "hat";
            if (item.cost < storage.__exports._items.context.points && !boughtHats.includes(item[property])) {
                window.storeBuy(item[property], property == "acc" ? 1 : 0);
                boughtHats.push(item[property]);
            }
        });
    };
    repeat(key, callback) {
        const that = this;
        this.onTick.push(function() {
            if (that.events[key]) {
                callback();
            }
        });
    };
    myPlayer = {
        id: null,
        x: null,
        y: null
    };
    enemiesNear = [];
    _state = false;
    heal(count) {
        while(count--) {
            if (storage.__exports._items.context.health == 100) break;
            this.emit(["5", [storage.__exports._items.hook[0], false]]);
            this.emit(["c", [1]]);
        };
        this.emit(["5", [storage.__exports._items.context.weaponIndex, true]]);
        if (this._state) this.emit(["c", [1]]);
    };
    oldAE = 2420;
    oldRE = 1080 * 1.2;
    resize(x, y) {
        window.ae = x;
        window.re = y;
        dispatchEvent(new Event("resize"));
    };
    process = "in";
    place(id, dir = storage.nDir, check = true) {
        if (!storage.__exports._checkItemLocation.hook(
            Math.cos(dir) * 22 + storage.__exports._items.context.x,
            Math.sin(dir) * 22 + storage.__exports._items.context.y, 22, 0.6, 2, false, storage.__exports._items.context
        )) return;
        this.emit(["5", [id, false]]);
        this.emit(["c", [1, dir]]);
        this.emit(["5", [storage.__exports._items.context.weaponIndex, true]]);
        if (this._state) this.emit(["c", [1, storage.nDir]]);
    };
    ws = WebSocket;
    wss = {
        send: () => { },
        onmessage: () => { }
    };
    __exports = {};
    __bundle_export__(func, checkup = (e => e), setter = e => e) {
        const symbol = Symbol(func);
        const that = this;
        Object.defineProperty(Object.prototype, func, {
            get() {
                return this[symbol];
            },
            set(value) {
                this[symbol] = setter(value);
                if (!checkup(this)) return;
                that.__exports["_" + func] = {
                    hook: this[func],
                    context: this
                }
            }
        });
    };
    __force_value__(func, val) {
        Object.defineProperty(Object.prototype, func, {
            get() { return val },
            set(v) { }
        });
    };
    settings = {
        spamReplace: false,
        coff: 0,
        tickRate: 9
    }
};
const storage = window.storage = new GammaAPI;
storage.__force_value__("turnSpeed", 0);
storage.__force_value__("maxPlayers", 50);
storage.__force_value__("checkTrusted", e => e);
Object.defineProperty(Object.prototype, "clientSendRate", {
    get() {
        return storage.settings.tickRate;
    }, set(value) { }
});
window.addEventListener("keydown", (e) => {
    if (document.activeElement.tagName != "INPUT") {
        storage.events[e.keyCode] = true;
    }
});
window.addEventListener("keyup", ({ keyCode }) => {
    storage.events[keyCode] = false;
});
window.WebSocket = class {
    constructor(url) {
        storage.wss = new storage.ws(url);
        storage.wss.binaryType = "arraybuffer";
        storage.emit = function(packet) {
            if (this.dead) return;
            storage.wss.send(window.msgpack.encode(packet));
        }
        storage.wss.addEventListener("message", function(event) {
            this._server = this.onmessage;
            const packet = window.msgpack.decode(event.data);
            switch(packet[0]) {
                case "11":
                    storage.dead = true;
                    storage.lastHp = 100;
                    storage.trap = {};
                    storage._state = false;
                    break;
                case "1":
                    storage.myPlayer.id = packet[1][0];
                    break;
                case "h":
                    if (packet[1][0] == storage.myPlayer.id && packet[1][1] < 100) {
                        shameCount = Math.min(shameCount + 1, 8);
                        if (packet[1][1] < 60) {
                            window.addChat("Anti-Insta", "#fff", "[System]:", "#ffffff");
                            if (storage.__exports._items.context.tails[13]) {
                                window.storeEquip(13, 1);
                            } else if (storage.__exports._items.context.skins[6]) {
                                window.storeEquip(6);
                            } else if (storage.__exports._items.context.skinIndex === 7) {
                                if (storage.__exports._items.context.skins[26]) {
                                    window.storeEquip(26);
                                } else {
                                    window.storeEquip(0);
                                }
                            };
                        } else {
                            shameCount = Math.max(shameCount - 2, 0);
                        };
                        setTimeout(() => {
                            storage.heal(Math.ceil((100 - packet[1][1]) / (storage.__exports._items.hook[0] == 0 ? 20 : 40)));
                            storage.lastHp = packet[1][1];
                        }, packet[1][1] < 60 ? 0 : 120 - window.pingTime);
                    }
                    break;
                case "ch":
                    window.addChat(packet[1][1], "#fff", "[" + packet[1][0] + "]:", "#1192f0");
                    break;
                case "7":
                    if (packet[1][0] == storage.myPlayer.id) {
                        execHold();
                    };
                    break;
                case "33":
                    storage.nextTick = 111 - window.pingTime;
                    if ((Date.now() - lastUpd) % window.pingTime < (1000 / storage.settings.tickRate) + window.pingTime) {
                        tickNum++;
                    } else if (Date.now() - lastUpd > 1000) {
                        storage.settings.tickRate = tickNum;
                        tickNum = 0;
                        lastUpd = Date.now();
                    }
                    storage.hatBuyer();
                    storage.onTick.forEach(task => task());
                    storage.nextTick--;
                    break;
            }
        });
        storage.wss.send = new Proxy(storage.wss.send, {
            apply(target, that, args) {
                const packet_ = window.msgpack.decode(args[0]);
                if (packet_[0] == "33") {
                    storage.moveDir = packet_[1][0];
                    storage.events[66] = false;
                    setTimeout(() => {
                        storage.events[66] = true;
                    }, 1000 / storage.settings.tickRate);
                } else if (packet_[0] == "sp") {
                    storage.events[66] = true;
                    packet_[1][0].skin = "__proto__";
                    packet_[1][0].name = "L-" + packet_[1][0].name;
                    args[0] = window.msgpack.encode(packet_);
                    storage.dead = false;
                } else if (packet_[0] == "c" && packet_[1][0] == 0) {
                    storage.trap = false;
                } else if (packet_[0] == "2" && packet_[1][0] !== storage.trapDir && storage.trap?.sid) {
                    packet_[1][0] = storage.trapDir;
                    args[0] = window.msgpack.encode(packet_);
                } else if (packet_[0] == "2" && !storage.trap?.sid) {
                    storage.nDir = packet_[1][0];
                }
                storage.packets++;
                if (that.readyState !== 3) {
                    return Reflect.apply(...arguments);
                } else {
                    const server = location.href.split("server=")[1];

                    const generateServer = function* generator() {
                        // Frankfurt
                        yield "9:0:0";
                        yield "9:2:0";
                        yield "9:1:0";
                        // Miami
                        yield "39:2:0";
                        yield "39:0:0";
                        yield "39:1:0";
                        // Failed
                        yield "39:2:0";
                    };
                    let pickNext = false;

                    const iterator = generateServer();

                    for (let _server of iterator) {
                        if (_server === server) {
                            pickNext = true;
                        } else if (pickNext === true) {
                            window.onbeforeunload = null;
                            location.href = location.href.split("server=")[0] + "server=" + _server;
                        }
                    }
                }
            }
        });

        return storage.wss;
    }
}

storage.__bundle_export__("checkItemLocation");
storage.__bundle_export__("items", context => {
    return context.sid == storage.myPlayer.id;
});
if (localStorage.bundle) {
    storage.__bundle_export__("list", context => {
        return !context.list.includes("ass");
    });
}
storage.__bundle_export__("disableObj", context => {
    return context
}, value => {
    return new Proxy(value, {
        apply(target, that, args) {
            const player = storage.__exports._items.context;
            const item = args[0];
            args[0].breaked = true;
            const dist = Math.hypot(player.x - item.x, player.y - item.y);
            if (dist < 180) {
                if (storage.settings.spamReplace === false) {
                    if (item.name == "pit trap" && item.sid == storage?.trap?.sid) {
                        window.storeEquip(6);
                        storage.trap = {};
                        storage.noTrap = true;
                        target.apply(that, args);
                        storage.noTrap = false;
                        storage._state = false;
                        storage.place(storage.__exports._items.hook[2], storage.findAngle(storage.trapDir));
                    } else {
                        const angle = Math.atan2(player.y - item.y, player.x - item.x);
                        const itemId = item.name.includes("trap") ? storage.__exports._items.hook[4] : storage.__exports._items.hook[2];
                        if (itemId) {
                            storage.place(itemId, storage.findAngle(angle - Math.PI));
                        }
                    }
                } else {
                    for (let i = 0; i < Math.PI * 2; i+=Math.PI / 3) {
                        storage.place(storage.__exports._items.hook[4], storage.nDir + i /* + Math.cos(storage.settings.coff) */);
                    };
                    if (storage._state === true) {
                        storage.emit(["c", [1, storage.nDir]]);
                    };
                }
            }
            return target.apply(that, args);
        }
    });
});
storage.repeat(86, () => storage.place(storage.__exports._items.hook[2], storage.nDir));
storage.repeat(70, () => storage.place(storage.__exports._items.hook[4], storage.nDir));
storage.repeat(66, () => {
    if (storage.__exports._items.context?.itemCounts && storage.__exports._items.context?.itemCounts[storage?.__exports?._list?.hook[storage.__exports._items.hook[3]]?.group?.id] > 95) {
        storage.events[66] = false;
        return;
    }
    const player = storage.__exports._items.context;
    const millPos = [1.15, -1.15, 0];

    millPos.map(millAmg => {
        return storage.place(storage.__exports._items.hook[3], storage.moveDir - millAmg - Math.PI);
    });
});
storage.repeat(71, () => storage.place(storage.__exports._items.hook[5], storage.nDir));
storage.repeat(82, () => {
    window.storeEquip(boughtHats.includes(7) ? 7 : 0);
    window.storeEquip(0, 1);
    storage.emit(["c", [1]]);
    setTimeout(() => {
        storage.emit(["c", [1]]);
        storage.emit(["5", [storage.__exports._items.context.weapons[1], true]]);
        storage.emit(["c", [0]]);
        window.storeEquip(53);
        setTimeout(() => {
            storage.emit(["5", [storage.__exports._items.context.weapons[0], true]]);
            window.storeEquip(6);
        }, 1000 / storage.settings.tickRate);
    }, 1000 / storage.settings.tickRate);
});
const execHold = () => {
    const hat = storage.__exports._items.context.health == 100 ? 12 : 6;
    window.storeEquip(boughtHats.includes(hat) ? hat : 28);
    window.storeEquip(boughtHats.includes(11) ? 11 : 0, 1);
    setTimeout(() => {
        storage.heal(storage.__exports._items.context.health !== 100 ? 3 : 2);
        if (!storage._state) return;
        const hat = (storage.trap?.sid || click != 0) ? 40 : 7;
        const acc = 21
        window.storeEquip(boughtHats.includes(hat) ? hat : (hat === 40 ? 29 : 0));
        window.storeEquip(boughtHats.includes(acc) ? acc : 0, 1);
    }, storage.speeds[storage.__exports._items.context.weaponIndex] - window.pingTime - storage.nextTick);
};
let tickNum = 0;
let lastUpd = Date.now();
let shameCount = 0;
const ft1 = CanvasRenderingContext2D.prototype.fillText;
const st1 = CanvasRenderingContext2D.prototype.strokeText;
CanvasRenderingContext2D.prototype.fillText = function() {
    if (typeof arguments[0] === "string" && arguments[0].includes("L-")) {
        arguments[0] = "[" + storage.myPlayer.id + "] - " + arguments[0] + "   " + shameCount;
    };
    ft1.call(this, ...arguments);
}
CanvasRenderingContext2D.prototype.strokeText = function() {
    if (typeof arguments[0] === "string" && arguments[0].includes("L-")) {
        arguments[0] = "[" + storage.myPlayer.id + "] - " + arguments[0] + "   " + shameCount;
    };
    st1.call(this, ...arguments);
};
let click = 1;
addEventListener("DOMContentLoaded", () => {
    // eslint-disable-next-line
    initMenu();
    obs.disconnect();
    new Function(localStorage.bundle)();
    const ct = document.getElementById("gameCanvas");
    document.getElementById("gameUI").style.background = "rgba(0, 0, 40, 0.3)";
    document.getElementById("promoImgHolder").innerHTML = `
    Join Luminary HQ [ PRESS HERE ]<br>
    <iframe src = "https://www.youtube.com/embed/b6KjKkCNOYQ?autoplay=1"></iframe>
    `;
    document.getElementById("promoImgHolder").addEventListener("click", () => {
        open("https://discord.gg/GVPyS68PsE", "_blank");
    })
    ct.addEventListener("mousedown", e => {
        const player = storage.__exports._items.context;
        if (player.tailIndex != 0) window.storeEquip(0, 1);
        click = e.button;
        if (click != 0) {
            storage.emit(["5", [player.weapons[1], true]]);
        } else {
            storage.emit(["5", [player.weapons[0], true]]);
        };
        const hat = (storage.trap?.sid || click === 1) ? 40 : 7;
        if (player.skinIndex != (boughtHats.includes(hat) ? 7 : 0)) window.storeEquip(boughtHats.includes(hat) ? hat : (hat === 40 ? 29 : 28));
        storage._state = true;
    });
    ct.addEventListener("mouseup", e => {
        const hat = storage.__exports._items.context.health == 100 ? 12 : 6;
        const player = storage.__exports._items.context;
        storage._state = false;
        if (player.tailIndex != (boughtHats.includes(11) ? 11 : 0)) window.storeEquip(boughtHats.includes(11) ? 11 : 0, 1);
        if (player.skinIndex != (boughtHats.includes(hat) ? hat : 28)) window.storeEquip(boughtHats.includes(hat) ? hat : 28);
    });
    let count = 0;
    addEventListener("wheel", e => {
        count+=e.deltaY / 10;
        storage.resize(2420 + count, 1480 + count);
        const player = storage.__exports._items.context;
        if (player.skinIndex != 7 && boughtHats.includes(7)) {
            window.storeEquip(7);
            window.storeEquip(13, 1);
        }
    });
});
const cma = Symbol("isItem");
Object.defineProperty(Object.prototype, "isItem", {
    get() {
        item = this;
        if (this.owner?.team) console.log(this.owner.team);
        if (!this.owner) return;
        const player = storage.__exports._items.context;
        if (this.name == "pit trap" && this.owner.sid != storage.myPlayer.id && !storage.trap?.x && Math.hypot(
            this.x - player.x,
            this.y - player.y
        ) < this.scale && !this.breaked) {
            if (player.weaponIndex != (player.weapons[1] === 10 ? 10 : player.weapons[0])) {
                storage.emit(["5", [player.weapons[1] === 10 ? 10 : player.weapons[0], true]]);
            } else if (player.dir !== storage.trapDir) {
                storage.emit(["2", [storage.trapDir]]);
            }
            storage.trap = this;
            storage._state = true;
            storage.trapDir = Math.atan2(this.y - player.y,
                                         this.x - player.x);
            storage.emit(["c", [1, storage.trapDir]]);
        }
        return this[cma];
    },
    set(val) {
        this[cma] = val;
    }
});
function initMenu() {
    let menu = document.createElement('div');
    menu.id = 'customMenu';

    menu.innerHTML = `
    <div id="pageswitch">
        <div id="page1" class="list" data-page="1">Combat</div>
        <div id="page2" class="list" data-page="2">Visual</div>
        <div id="page3" class="list" data-page="3">Misc</div>
    </div>
    <div id="menuHTML"></div>`;

    document.body.appendChild(menu);

    let style = document.createElement('style');
    style.innerHTML = `
  .toggle-label {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 25px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 14px;
    color: #fff;
  }

  .toggle-label .toggle-input {
    display: none;
  }

  .toggle-label .toggle-slider {
    position: relative;
    display: inline-block;
    width: 36px;
    height: 20px;
    margin-right: 8px;
    border-radius: 20px;
    background-color: #ccc;
    transition: background-color 0.3s;
  }

  .toggle-label .toggle-slider:before {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #fff;
    transition: transform 0.3s;
  }

  .toggle-label .toggle-input:checked + .toggle-slider {
    background-color: #4a33bd;
  }

  .toggle-label .toggle-input:checked + .toggle-slider:before {
    transform: translateX(16px);
  }

  #pageswitch {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    font-size: 18px;
    color: #ffffff;
    background: #3f51b5;
  }

  .list {
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 5px;
    transition: background 0.3s ease-in-out;
  }

  .list:hover {
    background: #2d397d;
  }

  .list.selected {
    background: #3758bd; /* Adjust the color as needed */
  }

  #customMenu {
    background: #202545;
    width: 400px;
    height: 300px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  }

  #customMenu.show {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

`;

    document.head.appendChild(style);

    const menuHTML = document.getElementById('menuHTML');
    const pages = document.querySelectorAll('.list');

    function toggleMenu() {
        if (menu.style.display === 'none' || menu.style.display === '') {
            menu.style.display = 'block';
            setTimeout(() => {
                menu.classList.add('show');
                showPage(1);
            }, 10);
        } else {
            menu.classList.remove('show');
            setTimeout(() => {
                menu.style.display = 'none';
            }, 300);
        }
    }

    menuHTML.innerHTML = `
        <div id="pageNumber1">
            <br>
            <label for="autoplace" class="toggle-label">
                <input type="checkbox" id="autoplace" class="toggle-input">
                <span class="toggle-slider"></span>
                <span>Auto Placer</span>
            </label>

            <label for="autoreplace" class="toggle-label">
                <input type="checkbox" id="autoreplace" class="toggle-input">
                <span class="toggle-slider"></span>
                <span>Auto Replacer</span>
            </label>

            <label for="preplace" class="toggle-label">
                <input type="checkbox" id="preplace" class="toggle-input">
                <span class="toggle-slider"></span>
                <span>Preplace</span>
            </label>

            <label for="spkpreplace" class="toggle-label">
                <input type="checkbox" id="spkpreplace" class="toggle-input">
                <span class="toggle-slider"></span>
                <span>Spiketick on Preplace</span>
            </label>

            <label for="soldier" class="toggle-label">
                <input type="checkbox" id="soldier" class="toggle-input">
                <span class="toggle-slider"></span>
                <span>Perma Soldier</span>
            </label>

            <label for="antispike" class="toggle-label">
                <input type="checkbox" id="antispike" class="toggle-input">
                <span class="toggle-slider"></span>
                <span>Anti Spike Tick</span>
            </label>

            <label for="autoq" class="toggle-label">
                <input type="checkbox" id="autoq" class="toggle-input">
                <span class="toggle-slider"></span>
                <span>Auto Q</span>
            </label>
            </div>
<div id="pageNumber2">
<br>
            <label for="bh" class="toggle-label">
                <input type="checkbox" id="bh" class="toggle-input">
                <span class="toggle-slider"></span>
                <span>Build Health (beta)</span>
            </label>

            <label for="shame" class="toggle-label">
                <input type="checkbox" id="shame" class="toggle-input">
                <span class="toggle-slider"></span>
                <span>Shame Count</span>
            </label>

            <label for="reloadbars" class="toggle-label">
                <input type="checkbox" id="reloadbars" class="toggle-input">
                <span class="toggle-slider"></span>
                <span>Reload Bars</span>
            </label>

            <label for="traps" class="toggle-label">
                <input type="checkbox" id="traps" class="toggle-input">
                <span class="toggle-slider"></span>
                <span>Show Traps</span>
            </label>

            <label for="dunepro" class="toggle-label">
                <input type="checkbox" id="dunepro" class="toggle-input">
                <span class="toggle-slider"></span>
                <span>Dune Mod Zoom</span>
            </label>
            </div>
            <br>
            <div id="pageNumber3">
            <label for="killchat" class="toggle-label">
                <input type="checkbox" id="killchat" class="toggle-input">
                <span class="toggle-slider"></span>
                <span>Kill Chat</span>
            </label>
            </div>
        `;
    document.getElementById("pageNumber2").style.display = "none";
    document.getElementById("pageNumber3").style.display = "none";
    function showPage(pageNumber) {
        let pg1 = document.getElementById("pageNumber1");
        let pg2 = document.getElementById("pageNumber2");
        let pg3 = document.getElementById("pageNumber3");
        if (pageNumber == 1) {
            pg1.style.display = "block";
            pg2.style.display = "none";
            pg3.style.display = "none";
        } else if (pageNumber == 2) {
            pg1.style.display = "none";
            pg2.style.display = "block";
            pg3.style.display = "none";
        } else if (pageNumber == 3) {
            pg1.style.display = "none";
            pg2.style.display = "none";
            pg3.style.display = "block";
        }
    }

    pages.forEach(page => {
        page.addEventListener('click', () => {
            const pageNumber = page.dataset.page;
            showPage(pageNumber);
            pages.forEach(niglol => niglol.classList.remove('selected'));
            page.classList.add('selected');
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            toggleMenu();
        }
    });

    document.addEventListener('click', event => {
        if (!menu.contains(event.target)) {
            menu.classList.remove('show');
            setTimeout(() => {
                menu.style.display = 'none';
            }, 300);
        }
    });

    function isChecked(id) {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            return checkbox.checked;
        }
        return false;
    };
    let chatLogs = document.createElement("div");
    chatLogs.id = "chatLogs";
    document.body.appendChild(chatLogs);

    function generateThings() {
        chatLogs.style = `
        height: 200px;
        width: 500px;
        max-width: 100%;
        display: block;
        padding: 6px;
        background-color: rgba(0, 0, 0, 0);
        border-radius: 6px;
        position: absolute;
        font-size: 0px;
        color: #fff;
        left: 4px;
        top: 4px;
        overflow: hidden;
        text-align: left;
        pointer-events: none;
    `;
        var fakechat = document.createElement('div');
        fakechat.innerText = "To chat click here or press / key";
        fakechat.style = `
        height: 20px;
        width: 25%;
        display: block;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        position: absolute;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.75);
        left: 4px;
        top: 210px;
        overflow: hidden;
        text-align: left;
        pointer-events: none;
        padding: 2px;
        `;
        document.body.appendChild(fakechat);
    }

    generateThings();

    window.addChat = function addChatHistory(e, c, d, v) {
        let chatLogs = document.getElementById('chatLogs');

        let a = document.createElement('div');
        a.className = 'chatEntry';

        let timeSpan = document.createElement('span');
        timeSpan.style.color = 'rgba(255, 255, 255, 0.5)';
        timeSpan.innerText = `${ads()}`;
        a.appendChild(timeSpan);

        let namething = document.createElement('span');
        namething.style.color = v;
        namething.innerText = ' ' + d;
        a.appendChild(namething);

        let chatSpan = document.createElement('span');
        chatSpan.style.color = c;
        chatSpan.innerText = ' ' + e;
        a.appendChild(chatSpan);

        chatLogs.appendChild(a);
        chatLogs.scrollTop = chatLogs.scrollHeight;
    }

    function ads() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = (hours % 12 || 12).toString();
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }



    function addDevLog(e) {
        let a = document.createElement('div');
        a.className = 'chatEntry';

        let timeSpan = document.createElement('span');
        timeSpan.style.color = 'rgba(255, 255, 255, 0.5)';
        timeSpan.innerText = `${ads()} `;
        a.appendChild(timeSpan);
        let chatSpan = document.createElement('span');
        chatSpan.style.color = "#fff"; //ebb92f for yellow
        chatSpan.innerText = "[System]: " + e;
        a.appendChild(chatSpan);
        chatLogs.appendChild(a);
        chatLogs.scrollTop = chatLogs.scrollHeight;
    }
    let stylex = document.createElement('style');
    stylex.innerHTML = `
    .chatEntry {
    font-size: 14px;
    }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        ::-webkit-scrollbar {
            width: 10px;
        }
        ::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.25);
            background-clip: content-box;
            border: 2px solid transparent;
            border-radius: 5px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0, 0, 0, 0.4);
        }
        `;

    document.head.appendChild(stylex);

}
const data = [
    {
        "createdBy": "xqgH0wLW3iWHD1Ne8YZTJGehSQD3",
        "creationDate": 1622693866235,
        "currentOwner": "UpfRPXJgThedebLBQk2EDhpBlIz1",
        "description": "",
        "groupId": "",
        "id": "Redirect_k9qdf",
        "lastModifiedBy": "xqgH0wLW3iWHD1Ne8YZTJGehSQD3",
        "modificationDate": 1687114442128,
        "name": "Texture Pack Sandbox - Hats",
        "objectType": "rule",
        "pairs": [
            {
                "destination": "https://i.imgur.com/pe3Yx3F.png",
                "id": "e2oxr",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/hats/hat_40.png"
                }
            },
            {
                "destination": "https://i.imgur.com/in5H6vw.png",
                "id": "1gd0k",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/hats/hat_18.png"
                }
            },
            {
                "destination": "https://i.imgur.com/4ddZert.png",
                "id": "zg5bb",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/accessories/access_21.png"
                }
            },
            {
                "destination": "https://i.imgur.com/0rmN7L9.png",
                "id": "3g9ct",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/accessories/access_18.png"
                }
            },
            {
                "destination": "https://i.imgur.com/sULkUZT.png",
                "id": "4ci6k",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/accessories/access_19.png"
                }
            },
            {
                "destination": "https://i.imgur.com/gJY7sM6.png",
                "id": "4trtu",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/hats/hat_9.png"
                }
            },
            {
                "destination": "https://i.imgur.com/uYgDtcZ.png",
                "id": "qo57y",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/hats/hat_16.png"
                }
            },
            {
                "destination": "https://i.imgur.com/JPMqgSc.png",
                "id": "987m6",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/hats/hat_31.png"
                }
            },
            {
                "destination": "https://i.imgur.com/vAOzlyY.png",
                "id": "7uubz",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/hats/hat_7.png"
                }
            },
            {
                "destination": "https://i.imgur.com/YRQ8Ybq.png",
                "id": "6k0uo",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/hats/hat_15.png"
                }
            },
            {
                "destination": "https://i.imgur.com/EwkbsHN.png",
                "id": "pw18w",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/hats/hat_13.png"
                }
            },
            {
                "destination": "https://i.imgur.com/yfqME8H.png",
                "id": "3aab7",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/hats/hat_11.png"
                }
            },
            {
                "destination": "https://i.imgur.com/JbUPrtp.png",
                "id": "zl8lh",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/hats/hat_20.png"
                }
            },
            {
                "destination": "https://i.imgur.com/yfqME8H.png",
                "id": "p9s3i",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/hats/hat_11_p.png"
                }
            },
            {
                "destination": "https://i.imgur.com/V8JrIwv.png",
                "id": "4q52z",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/hats/hat_14_p.png"
                }
            },
            {
                "destination": "https://i.imgur.com/V8JrIwv.png",
                "id": "9ipti",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/hats/hat_14.png"
                }
            },
            {
                "destination": "https://i.imgur.com/s7Cxc9y.png",
                "id": "42oxi",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/hats/hat_14_top.png"
                }
            },
            {
                "destination": "https://i.imgur.com/s7Cxc9y.png",
                "id": "f2cuf",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/hats/hat_11_top.png"
                }
            },
            {
                "destination": "https://i.imgur.com/pe3Yx3F.png",
                "id": "8zh5h",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/hats/hat_40.png"
                }
            },
            {
                "destination": "https://i.imgur.com/vM9Ri8g.png",
                "id": "etf15",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/hats/hat_6.png"
                }
            },
            {
                "destination": "https://i.imgur.com/in5H6vw.png",
                "id": "arib9",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/hats/hat_18.png"
                }
            },
            {
                "destination": "https://i.imgur.com/gJY7sM6.png",
                "id": "6ff29",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/hats/hat_9.png"
                }
            },
            {
                "destination": "https://i.imgur.com/4ddZert.png",
                "id": "awc93",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/accessories/access_21.png"
                }
            },
            {
                "destination": "https://i.imgur.com/0rmN7L9.png",
                "id": "8j663",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/accessories/access_18.png"
                }
            },
            {
                "destination": "https://i.imgur.com/sULkUZT.png",
                "id": "ba6s5",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/accessories/access_19.png"
                }
            },
            {
                "destination": "https://i.imgur.com/vAOzlyY.png",
                "id": "7isu3",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/hats/hat_7.png"
                }
            },
            {
                "destination": "https://i.imgur.com/uYgDtcZ.png",
                "id": "ku5tx",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/hats/hat_16.png"
                }
            },
            {
                "destination": "https://i.imgur.com/JPMqgSc.png",
                "id": "5uyb9",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/hats/hat_31.png"
                }
            },
            {
                "destination": "https://i.imgur.com/YRQ8Ybq.png",
                "id": "771sd",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/hats/hat_15.png"
                }
            },
            {
                "destination": "https://i.imgur.com/EwkbsHN.png",
                "id": "v25y0",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/hats/hat_13.png"
                }
            },
            {
                "destination": "https://i.imgur.com/yfqME8H.png",
                "id": "3xwlt",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/hats/hat_11.png"
                }
            },
            {
                "destination": "https://i.imgur.com/JbUPrtp.png",
                "id": "083ez",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/hats/hat_20.png"
                }
            },
            {
                "destination": "https://i.imgur.com/yfqME8H.png",
                "id": "w45ys",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/hats/hat_11_p.png"
                }
            },
            {
                "destination": "https://i.imgur.com/V8JrIwv.png",
                "id": "qrlfl",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/hats/hat_14_p.png"
                }
            },
            {
                "destination": "https://i.imgur.com/V8JrIwv.png",
                "id": "4tegy",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/hats/hat_14.png"
                }
            },
            {
                "destination": "https://i.imgur.com/s7Cxc9y.png",
                "id": "c7epu",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/hats/hat_11_top.png"
                }
            },
            {
                "destination": "https://i.imgur.com/s7Cxc9y.png",
                "id": "c5b0n",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/hats/hat_14_top.png"
                }
            },
            {
                "destination": "https://i.imgur.com/2PsUgEL.png",
                "id": "whoqq",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/hats/hat_26.png"
                }
            },
            {
                "destination": "https://i.imgur.com/2PsUgEL.png",
                "id": "0wmug",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/hats/hat_26.png"
                }
            },
            {
                "destination": "https://i.imgur.com/hmJrVQz.png",
                "id": "7oqvh",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "http://sandbox.moomoo.io/img/hats/hat_52.png"
                }
            },
            {
                "destination": "https://i.imgur.com/hmJrVQz.png",
                "id": "bjhge",
                "source": {
                    "key": "Url",
                    "operator": "Contains",
                    "value": "https://sandbox.moomoo.io/img/hats/hat_52.png"
                }
            }
        ],
        "ruleType": "Redirect",
        "status": "Inactive"
    }
];
const redirect = [];
data.forEach(x => {
    x.pairs.forEach(rule => {
        redirect[rule.source.value] = rule.destination;
    })
});
console.log(redirect)
function getLink(link) {
    return redirect[("https://moomoo.io"+link).replace("../.", "").replace("..", "")] ? redirect[("https://moomoo.io"+link).replace("../.", "").replace("..", "")] : link
}
const src = Object.getOwnPropertyDescriptor(Image.prototype, "src").set;
Object.defineProperty(Image.prototype, "src", {
    set(link) {
        return src.call(this, getLink(link));
    }
})


