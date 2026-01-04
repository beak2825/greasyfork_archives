// ==UserScript==
// @name         Test mod (update)
// @description  Visual update
// @version      Alpha2
// @license MIT
// @namespace Test
// @author       NotSigma
// @match        *://*.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542936/Test%20mod%20%28update%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542936/Test%20mod%20%28update%29.meta.js
// ==/UserScript==
const PACKET_MAP = {
    // wont have all old packets, since they conflict with some of the new ones, add them yourself if you want to unpatch mods that are that old.
    "33": "9",
    // "7": "K",
    "ch": "6",
    "pp": "0",
    "13c": "c",

    // most recent packet changes
    "f": "9",
    "a": "9",
    "d": "F",
    "G": "z"
}

let originalSend = WebSocket.prototype.send;

WebSocket.prototype.send = new Proxy(originalSend, {
    apply: ((target, websocket, argsList) => {
        let decoded = msgpack.decode(new Uint8Array(argsList[0]));

        if (PACKET_MAP.hasOwnProperty(decoded[0])) {
            decoded[0] = PACKET_MAP[decoded[0]];
        }

        return target.apply(websocket, [msgpack.encode(decoded)]);
    })
});
(function() {
    const scriptSrc = "index-6b10514b.js";
    const scriptTags = document.querySelectorAll(`script[src*="${scriptSrc}"]`);
    if (scriptTags.length > 0) {
        scriptTags[0].remove();
    }
})();

document.addEventListener("keydown", function(event) {
    if (event.keyCode === 192) {
        const chatHolder = document.getElementById("gameUI");
        if (chatHolder) {
            const currentDisplay = chatHolder.style.display;
            chatHolder.style.display = currentDisplay === "none" ? "block" : "none";
        }
    }
});

function getEl(id) {
    return document.getElementById(id);
}

function loadScript(url, callback) {
    let script = document.createElement("script");
    script.src = url;
    script.onload = () => {
        console.log(`Successfully loaded script: ${url}`);
        if (callback) callback();
    };
    script.onerror = (error) => {
        console.error(`Failed to load script: ${url}`, error);
    };
    document.body.appendChild(script);
}

const msgpackUrl = "https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js";
const customScriptUrl = null;

loadScript(msgpackUrl, () => {
    loadScript(customScriptUrl);
});

window.oncontextmenu = function() {
    return false;
};

let config = window.config;
let recording;

config.clientSendRate = 9;
config.serverUpdateRate = 9;

config.deathFadeout = 0;

config.playerCapacity = 50;
window.config.maxPlayers = 50;

config.isSandbox = window.location.hostname == "sandbox.moomoo.io";

config.skinColors = ["#bf8f54", "#cbb091", "#896c4b",
                     "#fadadc", "#ececec", "#c37373", "#000000", "#ecaff7", "#738cc3",
                     "#8bc373", "#91b2db"
                    ];

config.weaponVariants = [{
    id: 0,
    src: "",
    xp: 0,
    val: 1,
}, {
    id: 1,
    src: "_g",
    xp: 3000,
    val: 1.1,
}, {
    id: 2,
    src: "_d",
    xp: 7000,
    val: 1.18,
}, {
    id: 3,
    src: "_r",
    poison: true,
    xp: 12000,
    val: 1.18,
}, {
    id: 4,
    src: "_e",
    poison: true,
    heal: true,
    xp: 24000,
    val: 1.18,
}];

config.anotherVisual = true;
config.useWebGl = false;
config.resetRender = true;

function waitTime(timeout) {
    return new Promise((done) => {
        setTimeout(() => {
            done();
        }, timeout);
    });
}

let canStore;
if (typeof(Storage) !== "undefined") {
    canStore = true;
}

function saveVal(name, val) {
    if (canStore)
        localStorage.setItem(name, val);
}

function deleteVal(name) {
    if (canStore)
        localStorage.removeItem(name);
}

function getSavedVal(name) {
    if (canStore)
        return localStorage.getItem(name);
    return null;
}

let gC = function(a, b) {
    try {
        let res = JSON.parse(getSavedVal(a));
        if (typeof res === "object") {
            return b;
        } else {
            return res;
        }
    } catch (e) {
        return b;
    }
};

function setConfigs() {
    return {
        killChat: true,
        autoBuy: true,
        autoBuyEquip: true,
        autoPush: true,
        revTick: true,
        spikeTick: true,
        predictTick: true,
        autoPlace: true,
        autoReplace: true,
        antiTrap: true,
        slowOT: false,
        attackDir: false,
        showDir: false,
        autoRespawn: false
    };
}

let configs = setConfigs();

window.removeConfigs = function() {
    for (let cF in configs) {
        deleteVal(cF, configs[cF]);
    }
};

for (let cF in configs) {
    configs[cF] = gC(cF, configs[cF]);
}

window.changeMenu = function() {};
window.debug = function() {};
window.wasdMode = function() {};

window.startGrind = function() {};

window.resBuild = function() {};
window.toggleVisual = function() {};

window.prepareUI = function() {};
window.leave = function() {};

class HtmlAction {
    constructor(element) {
        this.element = element;
    };
    add(code) {
        if (!this.element) return undefined;
        this.element.innerHTML += code;
    };
    newLine(amount) {
        let result = `<br>`;
        if (amount > 0) {
            result = ``;
            for (let i = 0; i < amount; i++) {
                result += `<br>`;
            }
        }
        this.add(result);
    };
    checkBox(setting) {
        let newCheck = `<input type = "checkbox"`;
        setting.id && (newCheck += ` id = ${setting.id}`);
        setting.style && (newCheck += ` style = ${setting.style.replaceAll(" ", "")}`);
        setting.class && (newCheck += ` class = ${setting.class}`);
        setting.checked && (newCheck += ` checked`);
        setting.onclick && (newCheck += ` onclick = ${setting.onclick}`);
        newCheck += `>`;
        this.add(newCheck);
    };
    text(setting) {
        let newText = `<input type = "text"`;
        setting.id && (newText += ` id = ${setting.id}`);
        setting.style && (newText += ` style = ${setting.style.replaceAll(" ", "")}`);
        setting.class && (newText += ` class = ${setting.class}`);
        setting.size && (newText += ` size = ${setting.size}`);
        setting.maxLength && (newText += ` maxLength = ${setting.maxLength}`);
        setting.value && (newText += ` value = ${setting.value}`);
        setting.placeHolder && (newText += ` placeHolder = ${setting.placeHolder.replaceAll(" ", "&nbsp;")}`);
        newText += `>`;
        this.add(newText);
    };
    select(setting) {
        let newSelect = `<select`;
        setting.id && (newSelect += ` id = ${setting.id}`);
        setting.style && (newSelect += ` style = ${setting.style.replaceAll(" ", "")}`);
        setting.class && (newSelect += ` class = ${setting.class}`);
        newSelect += `>`;
        for (let options in setting.option) {
            newSelect += `<option value = ${setting.option[options].id}`
            setting.option[options].selected && (newSelect += ` selected`);
            newSelect += `>${options}</option>`;
        }
        newSelect += `</select>`;
        this.add(newSelect);
    };
    button(setting) {
        let newButton = `<button`;
        setting.id && (newButton += ` id = ${setting.id}`);
        setting.style && (newButton += ` style = ${setting.style.replaceAll(" ", "")}`);
        setting.class && (newButton += ` class = ${setting.class}`);
        setting.onclick && (newButton += ` onclick = ${setting.onclick}`);
        newButton += `>`;
        setting.innerHTML && (newButton += setting.innerHTML);
        newButton += `</button>`;
        this.add(newButton);
    };
    selectMenu(setting) {
        let newSelect = `<select`;
        if (!setting.id) {
            alert("please put id skid");
            return;
        }
        window[setting.id + "Func"] = function() {};
        setting.id && (newSelect += ` id = ${setting.id}`);
        setting.style && (newSelect += ` style = ${setting.style.replaceAll(" ", "")}`);
        setting.class && (newSelect += ` class = ${setting.class}`);
        newSelect += ` onchange = window.${setting.id + "Func"}()`;
        newSelect += `>`;
        let last;
        let i = 0;
        for (let options in setting.menu) {
            newSelect += `<option value = ${"option_" + options} id = ${"O_" + options}`;
            setting.menu[options] && (newSelect += ` checked`);
            newSelect += ` style = "color: ${setting.menu[options] ? "#000" : "#fff"}; background: ${setting.menu[options] ? "#8ecc51" : "#cc5151"};">${options}</option>`;
            i++;
        }
        newSelect += `</select>`;

        this.add(newSelect);

        i = 0;
        for (let options in setting.menu) {
            window[options + "Func"] = function() {
                setting.menu[options] = getEl("check_" + options).checked ? true : false;
                saveVal(options, setting.menu[options]);
                getEl("O_" + options).style.color = setting.menu[options] ? "#000" : "#fff";
                getEl("O_" + options).style.background = setting.menu[options] ? "#8ecc51" : "#cc5151";
            };
            this.checkBox({
                id: "check_" + options,
                style: `display: ${i == 0 ? "inline-block" : "none"};`,
                class: "checkB",
                onclick: `window.${options + "Func"}()`,
                checked: setting.menu[options]
            });
            i++;
        }

        last = "check_" + getEl(setting.id).value.split("_")[1];
        window[setting.id + "Func"] = function() {
            getEl(last).style.display = "none";
            last = "check_" + getEl(setting.id).value.split("_")[1];
            getEl(last).style.display = "inline-block";
        };
    };
};
class Html {
    constructor() {
        this.element = null;
        this.action = null;
        this.divElement = null;
        this.startDiv = function(setting, func) {

            let newDiv = document.createElement("div");
            setting.id && (newDiv.id = setting.id);
            setting.style && (newDiv.style = setting.style);
            setting.class && (newDiv.className = setting.class);
            this.element.appendChild(newDiv);
            this.divElement = newDiv;

            let addRes = new HtmlAction(newDiv);
            typeof func == "function" && func(addRes);

        };
        this.addDiv = function(setting, func) {

            let newDiv = document.createElement("div");
            setting.id && (newDiv.id = setting.id);
            setting.style && (newDiv.style = setting.style);
            setting.class && (newDiv.className = setting.class);
            setting.appendID && getEl(setting.appendID).appendChild(newDiv);
            this.divElement = newDiv;

            let addRes = new HtmlAction(newDiv);
            typeof func == "function" && func(addRes);

        };
    };
    set(id) {
        this.element = getEl(id);
        this.action = new HtmlAction(this.element);
    };
    resetHTML(text) {
        if (text) {
            this.element.innerHTML = ``;
        } else {
            this.element.innerHTML = ``;
        }
    };
    setStyle(style) {
        this.element.style = style;
    };
    setCSS(style) {
        this.action.add(`<style>` + style + `</style>`);
    };
};



let HTML = new Html();

let menuDiv = document.createElement("div");
menuDiv.id = "menuDiv";
document.body.appendChild(menuDiv);
HTML.set("menuDiv");
HTML.setStyle(`
            position: absolute;
                display: none;
            left: 20px;
            top: 135px;
            `);
HTML.resetHTML();
HTML.setCSS(`
body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    color: #f0b8c4; /* более мягкий, нежный розовый */
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    background-color: #0a0a0a; /* темный фон */
    transition: background-color 0.5s ease, color 0.5s ease;
    user-select: none;
    animation: fadeInUp 0.8s ease forwards;
}

@keyframes fadeInUp {
    0% {
        opacity: 0;
        transform: translateY(10px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.menuClass {
    color: #fff;
    font-size: 22px;
    text-align: left;
    padding: 26px;
    width: 360px;
    background: rgba(30, 30, 30, 0.9);
    border-radius: 14px;
    border: 2.5px solid #ff69b4;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 24px rgba(255, 105, 180, 0.7);
    backdrop-filter: blur(8px);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    animation: fadeInUp 1s ease forwards;
    will-change: transform, box-shadow;
}
.menuClass:hover {
    box-shadow: 0 0 36px rgba(255, 105, 180, 0.9);
    transform: translate(-50%, -52%) scale(1.02);
}

.menuC {
    display: none;
    font-size: 16px;
    max-height: 240px;
    overflow-y: auto;
    margin-top: 14px;
    padding-right: 8px;
    scrollbar-width: thin;
    scrollbar-color: #ff69b4 transparent;
    transition: max-height 0.3s ease;
}

.menuC::-webkit-scrollbar {
    width: 8px;
}
.menuC::-webkit-scrollbar-thumb {
    background-color: #ff69b4;
    border-radius: 8px;
    transition: background-color 0.3s ease;
}
.menuC::-webkit-scrollbar-thumb:hover {
    background-color: #ff85c1;
}
.menuC::-webkit-scrollbar-track {
    background: transparent;
}

.menuB {
    display: inline-block;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.12);
    color: #fff;
    border: 1.8px solid #ff69b4;
    border-radius: 10px;
    padding: 8px 16px;
    margin: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease, transform 0.15s ease, box-shadow 0.3s ease;
    box-shadow: 0 2px 6px rgba(255, 105, 180, 0.25);
    font-weight: 600;
    user-select: none;
    will-change: transform, box-shadow, background-color;
}

.menuB:hover {
    background-color: #ff69b4;
    color: #1a1a1a;
    box-shadow: 0 4px 18px rgba(255, 105, 180, 0.6);
    transform: scale(1.05);
}

.menuB:active {
    transform: scale(0.97);
    box-shadow: 0 2px 8px rgba(255, 105, 180, 0.4);
}

.checkB {
    cursor: pointer;
    accent-color: #ff69b4;
    transition: accent-color 0.3s ease;
}
.checkB:hover {
    accent-color: #ff85c1;
}

.Cselect {
    background-color: #1a1a1a;
    color: #fff;
    border: 2px solid #ff69b4;
    border-radius: 24px;
    padding: 6px 14px;
    outline: none;
    font-size: 16px;
    cursor: pointer;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    user-select: none;
}
.Cselect:focus, .Cselect:hover {
    border-color: #ff85c1;
    box-shadow: 0 0 12px rgba(255, 105, 180, 0.7);
}

#menuChanger {
    position: absolute;
    right: 20px;
    top: 20px;
    background-color: rgba(255, 255, 255, 0.07);
    border-radius: 50%;
    width: 44px;
    height: 44px;
    color: #ff69b4;
    border: 1.8px solid #ff69b4;
    cursor: pointer;
    font-size: 20px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    box-shadow: 0 0 12px rgba(255, 105, 180, 0.4);
    will-change: background-color, color, box-shadow, transform;
}
#menuChanger:hover {
    background-color: #ff69b4;
    color: #1a1a1a;
    box-shadow: 0 0 26px rgba(255, 105, 180, 0.9);
    transform: scale(1.1);
}
#menuChanger:active {
    transform: scale(0.95);
    box-shadow: 0 0 14px rgba(255, 105, 180, 0.7);
}

`);


HTML.startDiv({
    id: "menuHeadLine",
    class: "menuClass"
}, (html) => {
    html.add(`Menu:`);
    html.button({
        id: "menuChanger",
        class: "material-icons",
        innerHTML: `sync`,
        onclick: "window.changeMenu()"
    });
    HTML.addDiv({
        id: "menuButtons",
        style: "display: block; overflow-y: visible;",
        class: "menuC",
        appendID: "menuHeadLine"
    }, (html) => {
        html.button({
            class: "menuB",
            innerHTML: "Debug",
            onclick: "window.debug()"
        });
    });
    HTML.addDiv({
        id: "menuMain",
        style: "display: block",
        class: "menuC",
        appendID: "menuHeadLine"
    }, (html) => {
        html.button({
            class: "menuB",
            innerHTML: "Dagger Optimisation",
            onclick: "window.wasdMode()"
        });
        html.newLine();
        html.add(`Auto-Grinder: `);
        html.checkBox({
            id: "weaponGrind",
            class: "checkB",
            onclick: "window.startGrind()"
        });
        html.newLine(2);
        HTML.addDiv({
            style: "font-size: 30px; color: #4f4f4f;",
            appendID: "menuMain"
        }, (html) => {
            html.add(`_______________`);
        });
        html.add(`Anti-Push:`);
        html.checkBox({
            id: "antipush",
            class: "checkB",
            checked: true
        });
        html.newLine();
        html.add(`Auto-Health:`);
        html.checkBox({
            id: "healingBeta",
            class: "checkB",
            checked: true
        });
        html.newLine();
    });
    HTML.addDiv({
        id: "menuConfig",
        class: "menuC",
        appendID: "menuHeadLine"
    }, (html) => {
        html.add(`AutoPlacer Placement Tick: `);
        html.text({
            id: "autoPlaceTick",
            class: "customText",
            value: "1",
            size: "2em",
            maxLength: "2"
        });
        html.newLine();
        html.add(`Configs: `);
        html.selectMenu({
            id: "configsChanger",
            class: "Cselect",
            menu: configs
        });
        html.newLine();
        html.add(`InstaKill Type: `);
        html.select({
            id: "instaType",
            class: "Cselect",
            option: {
                OneShot: {
                    id: "oneShot",
                    selected: true
                },
                Spammer: {
                    id: "spammer"
                }
            }
        });
        html.newLine();
        html.add(`AntiBull Type: `);
        html.select({
            id: "antiBullType",
            class: "Cselect",
            option: {
                "Disable AntiBull": {
                    id: "noab",
                    selected: true
                },
                "When Reloaded": {
                    id: "abreload",
                },
                "Primary Reloaded": {
                    id: "abalway"
                }
            }
        });
        html.newLine();
        html.add(`Backup Nobull Insta: `);
        html.checkBox({
            id: "backupNobull",
            class: "checkB",
            checked: true
        });
        html.newLine();
        html.add(`Turret Gear Combat Assistance: `);
        html.checkBox({
            id: "turretCombat",
            class: "checkB",
            checked: true
        });
        html.newLine();
        html.add(`Safe AntiSpikeTick: `);
        html.checkBox({
            id: "safeAntiSpikeTick",
            class: "checkB",
            checked: true
        });
        html.newLine();
    });
    HTML.addDiv({
        id: "menuOther",
        class: "menuC",
        appendID: "menuHeadLine"
    }, (html) => {
        html.newLine();
        html.button({
            class: "menuB",
            innerHTML: "Reset Break Objects",
            onclick: "window.resBuild()"
        });
        html.newLine();
        html.add(`Break Objects Range: `);
        html.text({
            id: "breakRange",
            class: "customText",
            value: "700",
            size: "3em",
            maxLength: "4"
        });
        html.newLine();
        html.add(`Predict Movement Type: `);
        html.select({
            id: "predictType",
            class: "Cselect",
            option: {
                "Disable Render": {
                    id: "disableRender",
                    selected: true
                },
                "X/Y and 2": {
                    id: "pre2",
                },
                "X/Y and 3": {
                    id: "pre3"
                }
            }
        });
        html.newLine();
        html.add(`Render Placers: `);
        html.checkBox({
            id: "placeVis",
            class: "checkB",
        });
    });
});

let menuIndex = 0;
let menus = ["menuMain", "menuConfig", "menuOther"];
window.changeMenu = function() {
    getEl(menus[menuIndex % menus.length]).style.display = "none";
    menuIndex++;
    getEl(menus[menuIndex % menus.length]).style.display = "block";
};

let openMenu = false;

let WS = undefined;
let socketID = undefined;

let useWasd = false;
let secPacket = 0;
let secMax = 120;
let secTime = 1000;
let firstSend = {
    sec: false
};
let game = {
    tick: 0,
    tickQueue: [],
    tickBase: function(set, tick) {
        if (this.tickQueue[this.tick + tick]) {
            this.tickQueue[this.tick + tick].push(set);
        } else {
            this.tickQueue[this.tick + tick] = [set];
        }
    },
    tickRate: (1000 / config.serverUpdateRate),
    tickSpeed: 0,
    lastTick: performance.now()
};
let modConsole = [];

let dontSend = false;
let fpsTimer = {
    last: 0,
    time: 0,
    ltime: 0
}
let lastMoveDir = undefined;
let lastsp = ["cc", 1, "__proto__"];

WebSocket.prototype.nsend = WebSocket.prototype.send;
WebSocket.prototype.send = function(message) {
    if (!WS) {
        WS = this;
        WS.addEventListener("message", function(msg) {
            getMessage(msg);
        });
        WS.addEventListener("close", (event) => {
            if (event.code == 4001) {
                window.location.reload();
            }
        });
    }
    if (WS == this) {
        dontSend = false;

        let data = new Uint8Array(message);
        let parsed = window.msgpack.decode(data);
        let type = parsed[0];
        data = parsed[1];

        if (type == "6") {

            if (data[0]) {
                let profanity = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard", ];
                let tmpString;
                profanity.forEach((profany) => {
                    if (data[0].indexOf(profany) > -1) {
                        tmpString = "";
                        for (let i = 0; i < profany.length; ++i) {
                            if (i == 1) {
                                tmpString += String.fromCharCode(0);
                            }
                            tmpString += profany[i];
                        }
                        let re = new RegExp(profany, "g");
                        data[0] = data[0].replace(re, tmpString);
                    }
                });

                data[0] = data[0].slice(0, 30);
            }

        } else if (type == "L") {
            data[0] = data[0] + (String.fromCharCode(0).repeat(7));
            data[0] = data[0].slice(0, 7);
        } else if (type == "M") {
            data[0].name = data[0].name == "" ? "unknown" : "" + data[0].name;
            data[0].moofoll = true;
            data[0].skin = data[0].skin == 10 ? "__proto__" : data[0].skin;
            lastsp = [data[0].name, data[0].moofoll, data[0].skin];
        } else if (type == "D") {
            if ((my.lastDir == data[0]) || [null, undefined].includes(data[0])) {
                dontSend = true;
            } else {
                my.lastDir = data[0];
            }
        } else if (type == "d") {
            if (!data[2]) {
                dontSend = true;
            } else {
                if (![null, undefined].includes(data[1])) {
                    my.lastDir = data[1];
                }
            }
        } else if (type == "K") {
            if (!data[1]) {
                dontSend = true;
            }
        } else if (type == "S") {
            instaC.wait = !instaC.wait;
            dontSend = true;
        } else if (type == "a") {
            if (data[1]) {
                if (player.moveDir == data[0]) {
                    dontSend = true;
                }
                player.moveDir = data[0];
            } else {
                dontSend = true;
            }
        }
        if (!dontSend) {
            let binary = window.msgpack.encode([type, data]);
            this.nsend(binary);

            if (!firstSend.sec) {
                firstSend.sec = true;
                setTimeout(() => {
                    firstSend.sec = false;
                    secPacket = 0;
                }, secTime);
            }

            secPacket++;
        }
    } else {
        this.nsend(message);
    }
}

function packet(type) {
    let data = Array.prototype.slice.call(arguments, 1);
    let binary = window.msgpack.encode([type, data]);
    WS.send(binary);
}

function origPacket(type) {
    let data = Array.prototype.slice.call(arguments, 1);
    let binary = window.msgpack.encode([type, data]);
    WS.nsend(binary);
}

window.leave = function() {
    origPacket("kys", {
        "frvr is so bad": true,
        "sidney is too good": true,
        "dev are too weak": true,
    });
};

let io = {
    send: packet
};

function getMessage(message) {
    let data = new Uint8Array(message.data);
    let parsed = window.msgpack.decode(data);
    let type = parsed[0];
    data = parsed[1];
    let events = {
        A: setInitData,
        C: setupGame,
        D: addPlayer,
        E: removePlayer,
        a: updatePlayers,
        G: updateLeaderboard,
        H: loadGameObject,
        I: loadAI,
        J: animateAI,
        K: gatherAnimation,
        L: wiggleGameObject,
        M: shootTurret,
        N: updatePlayerValue,
        O: updateHealth,
        P: killPlayer,
        Q: killObject,
        R: killObjects,
        S: updateItemCounts,
        T: updateAge,
        U: updateUpgrades,
        V: updateItems,
        X: addProjectile,
        3: setPlayerTeam,
        4: setAlliancePlayers,
        5: updateStoreItems,
        6: receiveChat,
        7: updateMinimap,
        8: showText,
        9: pingMap,
        0: pingSocketResponse,
    };
    if (type == "io-init") {
        socketID = data[0];
    } else {
        if (events[type]) {
            events[type].apply(undefined, data);
        }
    }
}

Math.lerpAngle = function(value1, value2, amount) {
    let difference = Math.abs(value2 - value1);
    if (difference > Math.PI) {
        if (value1 > value2) {
            value2 += Math.PI * 2;
        } else {
            value1 += Math.PI * 2;
        }
    }
    let value = value2 + ((value1 - value2) * amount);
    if (value >= 0 && value <= Math.PI * 2) return value;
    return value % (Math.PI * 2);
};

CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    if (r < 0)
        r = 0;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
};

function resetMoveDir() {
    keys = {};
    io.send("e");
}

let allChats = [];
let ticks = {
    tick: 0,
    delay: 0,
    time: [],
    manage: [],
};
let ais = [];
let players = [];
let alliances = [];
let alliancePlayers = [];
let gameObjects = [];
let liztobj = [];
let projectiles = [];
let deadPlayers = [];

let breakObjects = [];

let player;
let playerSID;
let tmpObj;

let enemy = [];
let nears = [];
let near = [];

let my = {
    reloaded: false,
    waitHit: 0,
    autoAim: false,
    revAim: false,
    ageInsta: true,
    reSync: false,
    bullTick: 0,
    anti0Tick: 0,
    antiSync: false,
    safePrimary: function(tmpObj) {
        return [0, 8].includes(tmpObj.primaryIndex);
    },
    safeSecondary: function(tmpObj) {
        return [10, 11, 14].includes(tmpObj.secondaryIndex);
    },
    lastDir: 0,
    autoPush: false,
    pushData: {}
}

function findID(tmpObj, tmp) {
    return tmpObj.find((THIS) => THIS.id == tmp);
}

function findSID(tmpObj, tmp) {
    return tmpObj.find((THIS) => THIS.sid == tmp);
}

function findPlayerByID(id) {
    return findID(players, id);
}

function findPlayerBySID(sid) {
    return findSID(players, sid);
}

function findAIBySID(sid) {
    return findSID(ais, sid);
}

function findObjectBySid(sid) {
    return findSID(gameObjects, sid);
}

function findProjectileBySid(sid) {
    return findSID(gameObjects, sid);
}

let adCard = getEl("adCard");
adCard.remove();
let promoImageHolder = getEl("promoImgHolder");
promoImageHolder.remove();

let chatButton = getEl("chatButton");
chatButton.remove();
let gameCanvas = getEl("gameCanvas");
let mainContext = gameCanvas.getContext("2d");
let mapDisplay = getEl("mapDisplay");
let mapContext = mapDisplay.getContext("2d");
mapDisplay.width = 300;
mapDisplay.height = 300;
let storeMenu = getEl("storeMenu");
let storeHolder = getEl("storeHolder");
let upgradeHolder = getEl("upgradeHolder");
let upgradeCounter = getEl("upgradeCounter");
let chatBox = getEl("chatBox");
chatBox.autocomplete = "off";
chatBox.style.textAlign = "center";
chatBox.style.width = "18em";
let chatHolder = getEl("chatHolder");
let actionBar = getEl("actionBar");
let leaderboardData = getEl("leaderboardData");
let itemInfoHolder = getEl("itemInfoHolder");
let menuCardHolder = getEl("menuCardHolder");
let mainMenu = getEl("mainMenu");
let diedText = getEl("diedText");
let screenWidth;
let screenHeight;
let maxScreenWidth = config.maxScreenWidth;
let maxScreenHeight = config.maxScreenHeight;
let pixelDensity = 1;
let delta;
let now;
let lastUpdate = performance.now();
let camX;
let camY;
let tmpDir;
let mouseX = 0;
let mouseY = 0;
let allianceMenu = getEl("allianceMenu");
let waterMult = 1;
let waterPlus = 0;
let outlineColor = "#525252";
let darkOutlineColor = "#3d3f42";
let outlineWidth = 5.5;

let firstSetup = true;
let keys = {};
let moveKeys = {
    87: [0, -1],
    38: [0, -1],
    83: [0, 1],
    40: [0, 1],
    65: [-1, 0],
    37: [-1, 0],
    68: [1, 0],
    39: [1, 0],
};

let attackState = 0;
let inGame = false;

let macro = {};
let mills = {
    place: 0,
    placeSpawnPads: 0
};
let lastDir;

let lastLeaderboardData = [];

let inWindow = true;
window.onblur = function() {
    inWindow = false;
};
window.onfocus = function() {
    inWindow = true;
};
let ms = {
    avg: 0,
    max: 0,
    min: 0,
    delay: 0
}
function pingSocketResponse() {
    let pingTime = window.pingTime;
    const pingDisplay = document.getElementById("pingDisplay")
    pingDisplay.innerText = "";
    if (pingTime > ms.max || isNaN(ms.max)) {
        ms.max = pingTime;
    }
    if (pingTime < ms.min || isNaN(ms.min)) {
        ms.min = pingTime;
    }
}

let placeVisible = [];


class Utils {
    constructor() {

        let mathABS = Math.abs,
            mathCOS = Math.cos,
            mathSIN = Math.sin,
            mathPOW = Math.pow,
            mathSQRT = Math.sqrt,
            mathATAN2 = Math.atan2,
            mathPI = Math.PI;

        let _this = this;

        this.round = function(n, v) {
            return Math.round(n * v) / v;
        };
        this.toRad = function(angle) {
            return angle * (mathPI / 180);
        };
        this.toAng = function(radian) {
            return radian / (mathPI / 180);
        };
        this.randInt = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        this.randFloat = function(min, max) {
            return Math.random() * (max - min + 1) + min;
        };
        this.lerp = function(value1, value2, amount) {
            return value1 + (value2 - value1) * amount;
        };
        this.decel = function(val, cel) {
            if (val > 0)
                val = Math.max(0, val - cel);
            else if (val < 0)
                val = Math.min(0, val + cel);
            return val;
        };
        this.getDistance = function(x1, y1, x2, y2) {
            return mathSQRT((x2 -= x1) * x2 + (y2 -= y1) * y2);
        };
        this.getDist = function(tmp1, tmp2, type1, type2) {
            let tmpXY1 = {
                x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
                y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3,
            };
            let tmpXY2 = {
                x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
                y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3,
            };
            return mathSQRT((tmpXY2.x -= tmpXY1.x) * tmpXY2.x + (tmpXY2.y -= tmpXY1.y) * tmpXY2.y);
        };
        this.getDirection = function(x1, y1, x2, y2) {
            return mathATAN2(y1 - y2, x1 - x2);
        };
        this.getDirect = function(tmp1, tmp2, type1, type2) {
            let tmpXY1 = {
                x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
                y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3,
            };
            let tmpXY2 = {
                x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
                y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3,
            };
            return mathATAN2(tmpXY1.y - tmpXY2.y, tmpXY1.x - tmpXY2.x);
        };
        this.getAngleDist = function(a, b) {
            let p = mathABS(b - a) % (mathPI * 2);
            return (p > mathPI ? (mathPI * 2) - p : p);
        };
        this.isNumber = function(n) {
            return (typeof n == "number" && !isNaN(n) && isFinite(n));
        };
        this.isString = function(s) {
            return (s && typeof s == "string");
        };
        this.kFormat = function(num) {
            return num > 999 ? (num / 1000).toFixed(1) + "k" : num;
        };
        this.sFormat = function(num) {
            let fixs = [{
                num: 1e3,
                string: "k"
            },
                        {
                            num: 1e6,
                            string: "m"
                        },
                        {
                            num: 1e9,
                            string: "b"
                        },
                        {
                            num: 1e12,
                            string: "q"
                        }
                       ].reverse();
            let sp = fixs.find(v => num >= v.num);
            if (!sp) return num;
            return (num / sp.num).toFixed(1) + sp.string;
        };
        this.capitalizeFirst = function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };
        this.fixTo = function(n, v) {
            return parseFloat(n.toFixed(v));
        };
        this.sortByPoints = function(a, b) {
            return parseFloat(b.points) - parseFloat(a.points);
        };
        this.lineInRect = function(recX, recY, recX2, recY2, x1, y1, x2, y2) {
            let minX = x1;
            let maxX = x2;
            if (x1 > x2) {
                minX = x2;
                maxX = x1;
            }
            if (maxX > recX2)
                maxX = recX2;
            if (minX < recX)
                minX = recX;
            if (minX > maxX)
                return false;
            let minY = y1;
            let maxY = y2;
            let dx = x2 - x1;
            if (Math.abs(dx) > 0.0000001) {
                let a = (y2 - y1) / dx;
                let b = y1 - a * x1;
                minY = a * minX + b;
                maxY = a * maxX + b;
            }
            if (minY > maxY) {
                let tmp = maxY;
                maxY = minY;
                minY = tmp;
            }
            if (maxY > recY2)
                maxY = recY2;
            if (minY < recY)
                minY = recY;
            if (minY > maxY)
                return false;
            return true;
        };
        this.containsPoint = function(element, x, y) {
            let bounds = element.getBoundingClientRect();
            let left = bounds.left + window.scrollX;
            let top = bounds.top + window.scrollY;
            let width = bounds.width;
            let height = bounds.height;

            let insideHorizontal = x > left && x < left + width;
            let insideVertical = y > top && y < top + height;
            return insideHorizontal && insideVertical;
        };
        this.mousifyTouchEvent = function(event) {
            let touch = event.changedTouches[0];
            event.screenX = touch.screenX;
            event.screenY = touch.screenY;
            event.clientX = touch.clientX;
            event.clientY = touch.clientY;
            event.pageX = touch.pageX;
            event.pageY = touch.pageY;
        };
        this.hookTouchEvents = function(element, skipPrevent) {
            let preventDefault = !skipPrevent;
            let isHovering = false;
            let passive = false;
            element.addEventListener("touchstart", this.checkTrusted(touchStart), passive);
            element.addEventListener("touchmove", this.checkTrusted(touchMove), passive);
            element.addEventListener("touchend", this.checkTrusted(touchEnd), passive);
            element.addEventListener("touchcancel", this.checkTrusted(touchEnd), passive);
            element.addEventListener("touchleave", this.checkTrusted(touchEnd), passive);

            function touchStart(e) {
                _this.mousifyTouchEvent(e);
                window.setUsingTouch(true);
                if (preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (element.onmouseover)
                    element.onmouseover(e);
                isHovering = true;
            }

            function touchMove(e) {
                _this.mousifyTouchEvent(e);
                window.setUsingTouch(true);
                if (preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (_this.containsPoint(element, e.pageX, e.pageY)) {
                    if (!isHovering) {
                        if (element.onmouseover)
                            element.onmouseover(e);
                        isHovering = true;
                    }
                } else {
                    if (isHovering) {
                        if (element.onmouseout)
                            element.onmouseout(e);
                        isHovering = false;
                    }
                }
            }

            function touchEnd(e) {
                _this.mousifyTouchEvent(e);
                window.setUsingTouch(true);
                if (preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (isHovering) {
                    if (element.onclick)
                        element.onclick(e);
                    if (element.onmouseout)
                        element.onmouseout(e);
                    isHovering = false;
                }
            }
        };
        this.removeAllChildren = function(element) {
            while (element.hasChildNodes()) {
                element.removeChild(element.lastChild);
            }
        };
        this.generateElement = function(config) {
            let element = document.createElement(config.tag || "div");

            function bind(configValue, elementValue) {
                if (config[configValue])
                    element[elementValue] = config[configValue];
            }
            bind("text", "textContent");
            bind("html", "innerHTML");
            bind("class", "className");
            for (let key in config) {
                switch (key) {
                    case "tag":
                    case "text":
                    case "html":
                    case "class":
                    case "style":
                    case "hookTouch":
                    case "parent":
                    case "children":
                        continue;
                    default:
                        break;
                }
                element[key] = config[key];
            }
            if (element.onclick)
                element.onclick = this.checkTrusted(element.onclick);
            if (element.onmouseover)
                element.onmouseover = this.checkTrusted(element.onmouseover);
            if (element.onmouseout)
                element.onmouseout = this.checkTrusted(element.onmouseout);
            if (config.style) {
                element.style.cssText = config.style;
            }
            if (config.hookTouch) {
                this.hookTouchEvents(element);
            }
            if (config.parent) {
                config.parent.appendChild(element);
            }
            if (config.children) {
                for (let i = 0; i < config.children.length; i++) {
                    element.appendChild(config.children[i]);
                }
            }
            return element;
        };
        this.checkTrusted = function(callback) {
            return function(ev) {
                if (ev && ev instanceof Event && (ev && typeof ev.isTrusted == "boolean" ? ev.isTrusted : true)) {
                    callback(ev);
                }
            };
        };
        this.randomString = function(length) {
            let text = "";
            let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };
        this.countInArray = function(array, val) {
            let count = 0;
            for (let i = 0; i < array.length; i++) {
                if (array[i] === val) count++;
            }
            return count;
        };
        this.hexToRgb = function(hex) {
            return hex.slice(1).match(/.{1,2}/g).map(g => parseInt(g, 16));
        };
        this.getRgb = function(r, g, b) {
            return [r / 255, g / 255, b / 255].join(", ");
        };
    }
};
class Animtext {
    constructor() {
        this.init = function (x, y, scale, speed, life, text, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.scale = scale;
            this.startScale = this.scale;
            this.maxScale = scale * 1.5;
            this.scaleSpeed = 0.7;
            this.speed = speed;
            this.life = life;
            this.text = text;
            this.acc = 1;
            this.alpha = 0;
            this.maxLife = life;
            this.ranX = UTILS.randFloat(-1, 1);
        };

        this.update = function (delta) {
            if (this.life > 0) {
                this.life -= delta;
                this.y -= this.speed * delta;
                if (this.life <= 200) {
                    if (this.alpha > 0) {
                        this.alpha = Math.max(0, this.alpha - (delta / 300));
                    }
                } else {
                    if (this.alpha < 1) {
                        this.alpha = Math.min(1, this.alpha + (delta / 100));
                    }
                }
                if (this.life <= 0) {
                    this.life = 0;
                }
            }
        };

        this.render = function (ctxt, xOff, yOff, value) {
            ctxt.lineWidth = 5;
            ctxt.fillStyle = this.color;
            ctxt.strokeStyle = "#fff";
            ctxt.font = this.scale + "px 'Comic Sans MS', cursive";
            ctxt.textAlign = "center";
            ctxt.textBaseline = "middle";

            ctxt.globalAlpha = this.alpha;

            ctxt.strokeText(this.text, this.x - xOff, this.y - yOff);
            ctxt.fillText(this.text, this.x - xOff, this.y - yOff);

            ctxt.globalAlpha = 1;
        };
    }
}
class Textmanager {
    constructor() {
        this.texts = [];
        this.stack = [];

        this.update = function(delta, ctxt, xOff, yOff) {
            ctxt.textBaseline = "middle";
            ctxt.textAlign = "center";
            for (let i = 0; i < this.texts.length; ++i) {
                if (this.texts[i].life) {
                    this.texts[i].update(delta);
                    this.texts[i].render(ctxt, xOff, yOff);
                }
            }
        };

        this.showText = function(x, y, scale, speed, life, text, color) {
            let tmpText;
            for (let i = 0; i < this.texts.length; ++i) {
                if (!this.texts[i].life) {
                    tmpText = this.texts[i];
                    break;
                }
            }
            if (!tmpText) {
                tmpText = new Animtext();
                this.texts.push(tmpText);
            }
            tmpText.init(x, y, scale, speed, life, text, color);
        };
    }
}

class GameObject {
    constructor(sid) {
        this.sid = sid;

        this.init = function(x, y, dir, scale, type, data, owner) {
            data = data || {};
            this.sentTo = {};
            this.gridLocations = [];
            this.active = true;
            this.render = true;
            this.doUpdate = data.doUpdate;
            this.x = x;
            this.y = y;
            this.dir = dir;
            this.lastDir = dir;
            this.xWiggle = 0;
            this.yWiggle = 0;
            this.visScale = scale;
            this.scale = scale;
            this.type = type;
            this.id = data.id;
            this.owner = owner;
            this.name = data.name;
            this.isItem = (this.id != undefined);
            this.group = data.group;
            this.maxHealth = data.health;
            this.health = this.maxHealth;
            this.layer = 2;
            if (this.group != undefined) {
                this.layer = this.group.layer;
            } else if (this.type == 0) {
                this.layer = 3;
            } else if (this.type == 2) {
                this.layer = 0;
            } else if (this.type == 4) {
                this.layer = -1;
            }
            this.colDiv = data.colDiv || 1;
            this.blocker = data.blocker;
            this.ignoreCollision = data.ignoreCollision;
            this.dontGather = data.dontGather;
            this.hideFromEnemy = data.hideFromEnemy;
            this.friction = data.friction;
            this.projDmg = data.projDmg;
            this.dmg = data.dmg;
            this.pDmg = data.pDmg;
            this.pps = data.pps;
            this.zIndex = data.zIndex || 0;
            this.turnSpeed = data.turnSpeed;
            this.req = data.req;
            this.trap = data.trap;
            this.healCol = data.healCol;
            this.teleport = data.teleport;
            this.boostSpeed = data.boostSpeed;
            this.projectile = data.projectile;
            this.shootRange = data.shootRange;
            this.shootRate = data.shootRate;
            this.shootCount = this.shootRate;
            this.spawnPoint = data.spawnPoint;
            this.onNear = 0;
            this.breakObj = false;
            this.alpha = data.alpha || 1;
            this.maxAlpha = data.alpha || 1;
            this.damaged = 0;
        };

        this.changeHealth = function(amount, doer) {
            this.health += amount;
            return (this.health <= 0);
        };

        this.getScale = function(sM, ig) {
            sM = sM || 1;
            return this.scale * ((this.isItem || this.type == 2 || this.type == 3 || this.type == 4) ?
                                 1 : (0.6 * sM)) * (ig ? 1 : this.colDiv);
        };

        this.visibleToPlayer = function(player) {
            return !(this.hideFromEnemy) || (this.owner && (this.owner == player ||
                                                            (this.owner.team && player.team == this.owner.team)));
        };

        this.update = function(delta) {
            if (this.active) {
                if (this.xWiggle) {
                    this.xWiggle *= Math.pow(0.99, delta);
                }
                if (this.yWiggle) {
                    this.yWiggle *= Math.pow(0.99, delta);
                }
                let d2 = UTILS.getAngleDist(this.lastDir, this.dir);
                if (d2 > 0.01) {
                    this.dir += d2 / 5;
                } else {
                    this.dir = this.lastDir;
                }
            } else {
                if (this.alive) {
                    this.alpha -= delta / (200 / this.maxAlpha);
                    this.visScale += delta / (this.scale / 2.5);
                    if (this.alpha <= 0) {
                        this.alpha = 0;
                        this.alive = false;
                    }
                }
            }
        };

        this.isTeamObject = function(tmpObj) {
            return this.owner == null ? true : (this.owner && tmpObj.sid == this.owner.sid || tmpObj.findAllianceBySid(this.owner.sid));
        };
    }
}
class Items {
    constructor() {
        this.groups = [{
            id: 0,
            name: "food",
            layer: 0
        }, {
            id: 1,
            name: "walls",
            place: true,
            limit: 30,
            layer: 0
        }, {
            id: 2,
            name: "spikes",
            place: true,
            limit: 15,
            layer: 0
        }, {
            id: 3,
            name: "mill",
            place: true,
            limit: 7,
            layer: 1
        }, {
            id: 4,
            name: "mine",
            place: true,
            limit: 1,
            layer: 0
        }, {
            id: 5,
            name: "trap",
            place: true,
            limit: 6,
            layer: -1
        }, {
            id: 6,
            name: "booster",
            place: true,
            limit: 12,
            layer: -1
        }, {
            id: 7,
            name: "turret",
            place: true,
            limit: 2,
            layer: 1
        }, {
            id: 8,
            name: "watchtower",
            place: true,
            limit: 12,
            layer: 1
        }, {
            id: 9,
            name: "buff",
            place: true,
            limit: 4,
            layer: -1
        }, {
            id: 10,
            name: "spawn",
            place: true,
            limit: 1,
            layer: -1
        }, {
            id: 11,
            name: "sapling",
            place: true,
            limit: 2,
            layer: 0
        }, {
            id: 12,
            name: "blocker",
            place: true,
            limit: 3,
            layer: -1
        }, {
            id: 13,
            name: "teleporter",
            place: true,
            limit: 2,
            layer: -1
        }];

        this.projectiles = [{
            indx: 0,
            layer: 0,
            src: "arrow_1",
            dmg: 25,
            speed: 1.6,
            scale: 103,
            range: 1000
        }, {
            indx: 1,
            layer: 1,
            dmg: 25,
            scale: 20
        }, {
            indx: 0,
            layer: 0,
            src: "arrow_1",
            dmg: 35,
            speed: 2.5,
            scale: 103,
            range: 1200
        }, {
            indx: 0,
            layer: 0,
            src: "arrow_1",
            dmg: 30,
            speed: 2,
            scale: 103,
            range: 1200
        }, {
            indx: 1,
            layer: 1,
            dmg: 16,
            scale: 20
        }, {
            indx: 0,
            layer: 0,
            src: "bullet_1",
            dmg: 50,
            speed: 3.6,
            scale: 160,
            range: 1400
        }];

        this.weapons = [{
            id: 0,
            type: 0,
            name: "tool hammer",
            desc: "tool for gathering all resources",
            src: "hammer_1",
            length: 140,
            width: 140,
            xOff: -3,
            yOff: 18,
            dmg: 25,
            range: 65,
            gather: 1,
            speed: 300
        }, {
            id: 1,
            type: 0,
            age: 2,
            name: "hand axe",
            desc: "gathers resources at a higher rate",
            src: "axe_1",
            length: 140,
            width: 140,
            xOff: 3,
            yOff: 24,
            dmg: 30,
            spdMult: 1,
            range: 70,
            gather: 2,
            speed: 400
        }, {
            id: 2,
            type: 0,
            age: 8,
            pre: 1,
            name: "great axe",
            desc: "deal more damage and gather more resources",
            src: "great_axe_1",
            length: 140,
            width: 140,
            xOff: -8,
            yOff: 25,
            dmg: 35,
            spdMult: 1,
            range: 75,
            gather: 4,
            speed: 400
        }, {
            id: 3,
            type: 0,
            age: 2,
            name: "short sword",
            desc: "increased attack power but slower move speed",
            src: "sword_1",
            iPad: 1.3,
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 46,
            dmg: 35,
            spdMult: 0.85,
            range: 110,
            gather: 1,
            speed: 300
        }, {
            id: 4,
            type: 0,
            age: 8,
            pre: 3,
            name: "katana",
            desc: "greater range and damage",
            src: "samurai_1",
            iPad: 1.3,
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 59,
            dmg: 40,
            spdMult: 0.8,
            range: 118,
            gather: 1,
            speed: 300
        }, {
            id: 5,
            type: 0,
            age: 2,
            name: "polearm",
            desc: "long range melee weapon",
            src: "spear_1",
            iPad: 1.3,
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 53,
            dmg: 45,
            knock: 0.2,
            spdMult: 0.82,
            range: 142,
            gather: 1,
            speed: 700
        }, {
            id: 6,
            type: 0,
            age: 2,
            name: "bat",
            desc: "fast long range melee weapon",
            src: "bat_1",
            iPad: 1.3,
            length: 110,
            width: 180,
            xOff: -8,
            yOff: 53,
            dmg: 20,
            knock: 0.7,
            range: 110,
            gather: 1,
            speed: 300
        }, {
            id: 7,
            type: 0,
            age: 2,
            name: "daggers",
            desc: "really fast short range weapon",
            src: "dagger_1",
            iPad: 0.8,
            length: 110,
            width: 110,
            xOff: 18,
            yOff: 0,
            dmg: 20,
            knock: 0.1,
            range: 65,
            gather: 1,
            hitSlow: 0.1,
            spdMult: 1.13,
            speed: 100
        }, {
            id: 8,
            type: 0,
            age: 2,
            name: "stick",
            desc: "great for gathering but very weak",
            src: "stick_1",
            length: 140,
            width: 140,
            xOff: 3,
            yOff: 24,
            dmg: 1,
            spdMult: 1,
            range: 70,
            gather: 7,
            speed: 400
        }, {
            id: 9,
            type: 1,
            age: 6,
            name: "hunting bow",
            desc: "bow used for ranged combat and hunting",
            src: "bow_1",
            req: ["wood", 4],
            length: 120,
            width: 120,
            xOff: -6,
            yOff: 0,
            Pdmg: 25,
            projectile: 0,
            spdMult: 0.75,
            speed: 600
        }, {
            id: 10,
            type: 1,
            age: 6,
            name: "great hammer",
            desc: "hammer used for destroying structures",
            src: "great_hammer_1",
            length: 140,
            width: 140,
            xOff: -9,
            yOff: 25,
            dmg: 10,
            Pdmg: 10,
            spdMult: 0.88,
            range: 75,
            sDmg: 7.5,
            gather: 1,
            speed: 400
        }, {
            id: 11,
            type: 1,
            age: 6,
            name: "wooden shield",
            desc: "blocks projectiles and reduces melee damage",
            src: "shield_1",
            length: 120,
            width: 120,
            shield: 0.2,
            xOff: 6,
            yOff: 0,
            Pdmg: 0,
            spdMult: 0.7
        }, {
            id: 12,
            type: 1,
            age: 8,
            pre: 9,
            name: "crossbow",
            desc: "deals more damage and has greater range",
            src: "crossbow_1",
            req: ["wood", 5],
            aboveHand: true,
            armS: 0.75,
            length: 120,
            width: 120,
            xOff: -4,
            yOff: 0,
            Pdmg: 35,
            projectile: 2,
            spdMult: 0.7,
            speed: 700
        }, {
            id: 13,
            type: 1,
            age: 9,
            pre: 12,
            name: "repeater crossbow",
            desc: "high firerate crossbow with reduced damage",
            src: "crossbow_2",
            req: ["wood", 10],
            aboveHand: true,
            armS: 0.75,
            length: 120,
            width: 120,
            xOff: -4,
            yOff: 0,
            Pdmg: 30,
            projectile: 3,
            spdMult: 0.7,
            speed: 230
        }, {
            id: 14,
            type: 1,
            age: 6,
            name: "mc grabby",
            desc: "steals resources from enemies",
            src: "grab_1",
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 53,
            dmg: 0,
            Pdmg: 0,
            steal: 250,
            knock: 0.2,
            spdMult: 1.05,
            range: 125,
            gather: 0,
            speed: 700
        }, {
            id: 15,
            type: 1,
            age: 9,
            pre: 12,
            name: "musket",
            desc: "slow firerate but high damage and range",
            src: "musket_1",
            req: ["stone", 10],
            aboveHand: true,
            rec: 0.35,
            armS: 0.6,
            hndS: 0.3,
            hndD: 1.6,
            length: 205,
            width: 205,
            xOff: 25,
            yOff: 0,
            Pdmg: 50,
            projectile: 5,
            hideProjectile: true,
            spdMult: 0.6,
            speed: 1500
        }];

        this.list = [{
            group: this.groups[0],
            name: "apple",
            desc: "restores 20 health when consumed",
            req: ["food", 10],
            consume: function(doer) {
                return doer.changeHealth(20, doer);
            },
            scale: 22,
            holdOffset: 15,
            healing: 20,
            itemID: 0,
            itemAID: 16,
        }, {
            age: 3,
            group: this.groups[0],
            name: "cookie",
            desc: "restores 40 health when consumed",
            req: ["food", 15],
            consume: function(doer) {
                return doer.changeHealth(40, doer);
            },
            scale: 27,
            holdOffset: 15,
            healing: 40,
            itemID: 1,
            itemAID: 17,
        }, {
            age: 7,
            group: this.groups[0],
            name: "cheese",
            desc: "restores 30 health and another 50 over 5 seconds",
            req: ["food", 25],
            consume: function(doer) {
                if (doer.changeHealth(30, doer) || doer.health < 100) {
                    doer.dmgOverTime.dmg = -10;
                    doer.dmgOverTime.doer = doer;
                    doer.dmgOverTime.time = 5;
                    return true;
                }
                return false;
            },
            scale: 27,
            holdOffset: 15,
            healing: 30,
            itemID: 2,
            itemAID: 18,
        }, {
            group: this.groups[1],
            name: "wood wall",
            desc: "provides protection for your village",
            req: ["wood", 10],
            projDmg: true,
            health: 380,
            scale: 50,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 3,
            itemAID: 19,
        }, {
            age: 3,
            group: this.groups[1],
            name: "stone wall",
            desc: "provides improved protection for your village",
            req: ["stone", 25],
            health: 900,
            scale: 50,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 4,
            itemAID: 20,
        }, {
            age: 7,
            group: this.groups[1],
            name: "castle wall",
            desc: "provides powerful protection for your village",
            req: ["stone", 35],
            health: 1500,
            scale: 52,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 5,
            itemAID: 21,
        }, {
            group: this.groups[2],
            name: "spikes",
            desc: "damages enemies when they touch them",
            req: ["wood", 20, "stone", 5],
            health: 400,
            dmg: 20,
            scale: 49,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5,
            itemID: 6,
            itemAID: 22,
            shadow: {
                offsetX: 5,
                offsetY: 5,
                color: "rgba(0, 0, 0, 0.5)"
            }

        }, {
            age: 5,
            group: this.groups[2],
            name: "greater spikes",
            desc: "damages enemies when they touch them",
            req: ["wood", 30, "stone", 10],
            health: 500,
            dmg: 35,
            scale: 52,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5,
            itemID: 7,
            itemAID: 23,
        }, {
            age: 9,
            group: this.groups[2],
            name: "poison spikes",
            desc: "poisons enemies when they touch them",
            req: ["wood", 35, "stone", 15],
            health: 600,
            dmg: 30,
            pDmg: 5,
            scale: 52,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5,
            itemID: 8,
            itemAID: 24,
        }, {
            age: 9,
            group: this.groups[2],
            name: "spinning spikes",
            desc: "damages enemies when they touch them",
            req: ["wood", 30, "stone", 20],
            health: 500,
            dmg: 45,
            turnSpeed: 0.003,
            scale: 52,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5,
            itemID: 9,
            itemAID: 25,
        }, {
            group: this.groups[3],
            name: "windmill",
            desc: "generates gold over time",
            req: ["wood", 50, "stone", 10],
            health: 400,
            pps: 1,
            turnSpeed: 0.0016,
            spritePadding: 25,
            iconLineMult: 12,
            scale: 45,
            holdOffset: 20,
            placeOffset: 5,
            itemID: 10,
            itemAID: 26,
        }, {
            age: 5,
            group: this.groups[3],
            name: "faster windmill",
            desc: "generates more gold over time",
            req: ["wood", 60, "stone", 20],
            health: 500,
            pps: 1.5,
            turnSpeed: 0.0025,
            spritePadding: 25,
            iconLineMult: 12,
            scale: 47,
            holdOffset: 20,
            placeOffset: 5,
            itemID: 11,
            itemAID: 27,
        }, {
            age: 8,
            group: this.groups[3],
            name: "power mill",
            desc: "generates more gold over time",
            req: ["wood", 100, "stone", 50],
            health: 800,
            pps: 2,
            turnSpeed: 0.005,
            spritePadding: 25,
            iconLineMult: 12,
            scale: 47,
            holdOffset: 20,
            placeOffset: 5,
            itemID: 12,
            itemAID: 28,
        }, {
            age: 5,
            group: this.groups[4],
            type: 2,
            name: "mine",
            desc: "allows you to mine stone",
            req: ["wood", 20, "stone", 100],
            iconLineMult: 12,
            scale: 65,
            holdOffset: 20,
            placeOffset: 0,
            itemID: 13,
            itemAID: 29,
        }, {
            age: 5,
            group: this.groups[11],
            type: 0,
            name: "sapling",
            desc: "allows you to farm wood",
            req: ["wood", 150],
            iconLineMult: 12,
            colDiv: 0.5,
            scale: 110,
            holdOffset: 50,
            placeOffset: -15,
            itemID: 14,
            itemAID: 30,
        }, {
            age: 4,
            group: this.groups[5],
            name: "pit trap",
            desc: "pit that traps enemies if they walk over it",
            req: ["wood", 30, "stone", 30],
            trap: true,
            ignoreCollision: true,
            hideFromEnemy: true,
            health: 500,
            colDiv: 0.2,
            scale: 50,
            holdOffset: 20,
            placeOffset: -5,
            alpha: 0.6,
            itemID: 15,
            itemAID: 31,
        }, {
            age: 4,
            group: this.groups[6],
            name: "boost pad",
            desc: "provides boost when stepped on",
            req: ["stone", 20, "wood", 5],
            ignoreCollision: true,
            boostSpeed: 1.5,
            health: 150,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 16,
            itemAID: 32,
        }, {
            age: 7,
            group: this.groups[7],
            doUpdate: true,
            name: "turret",
            desc: "defensive structure that shoots at enemies",
            req: ["wood", 200, "stone", 150],
            health: 800,
            projectile: 1,
            shootRange: 700,
            shootRate: 2200,
            scale: 43,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 17,
            itemAID: 33,
        }, {
            age: 7,
            group: this.groups[8],
            name: "platform",
            desc: "platform to shoot over walls and cross over water",
            req: ["wood", 20],
            ignoreCollision: true,
            zIndex: 1,
            health: 300,
            scale: 43,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 18,
            itemAID: 34,
        }, {
            age: 7,
            group: this.groups[9],
            name: "healing pad",
            desc: "standing on it will slowly heal you",
            req: ["wood", 30, "food", 10],
            ignoreCollision: true,
            healCol: 15,
            health: 400,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 19,
            itemAID: 35,
        }, {
            age: 9,
            group: this.groups[10],
            name: "spawn pad",
            desc: "you will spawn here when you die but it will dissapear",
            req: ["wood", 100, "stone", 100],
            health: 400,
            ignoreCollision: true,
            spawnPoint: true,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 20,
            itemAID: 36,
        }, {
            age: 7,
            group: this.groups[12],
            name: "blocker",
            desc: "blocks building in radius",
            req: ["wood", 30, "stone", 25],
            ignoreCollision: true,
            blocker: 300,
            health: 400,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 21,
            itemAID: 37,
        }, {
            age: 7,
            group: this.groups[13],
            name: "teleporter",
            desc: "teleports you to a random point on the map",
            req: ["wood", 60, "stone", 60],
            ignoreCollision: true,
            teleport: true,
            health: 200,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 22,
            itemAID: 38
        }];

        this.checkItem = {
            index: function(id, myItems) {
                return [0, 1, 2].includes(id) ? 0 : [3, 4, 5].includes(id) ? 1 : [6, 7, 8, 9].includes(id) ? 2 : [10, 11, 12].includes(id) ? 3 : [13, 14].includes(id) ? 5 : [15, 16].includes(id) ? 4 : [17, 18, 19, 21, 22].includes(id) ? [13, 14].includes(myItems) ? 6 :
                5 :
                id == 20 ? [13, 14].includes(myItems) ? 7 :
                6 :
                undefined;
            }
        }

        for (let i = 0; i < this.list.length; ++i) {
            this.list[i].id = i;
            if (this.list[i].pre) this.list[i].pre = i - this.list[i].pre;
        }

        if (typeof window !== "undefined") {
            function shuffle(a) {
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [a[j], a[i]];
                }
                return a;
            }
        }
    }
}
class Objectmanager {
    constructor(GameObject, liztobj, UTILS, config, players, server) {
        let mathFloor = Math.floor,
            mathABS = Math.abs,
            mathCOS = Math.cos,
            mathSIN = Math.sin,
            mathPOW = Math.pow,
            mathSQRT = Math.sqrt;

        this.ignoreAdd = false;
        this.hitObj = [];

        this.disableObj = function(obj) {
            obj.active = false;
        };

        let tmpObj;
        this.add = function(sid, x, y, dir, s, type, data, setSID, owner) {
            tmpObj = findObjectBySid(sid);
            if (!tmpObj) {
                tmpObj = gameObjects.find((tmp) => !tmp.active);
                if (!tmpObj) {
                    tmpObj = new GameObject(sid);
                    gameObjects.push(tmpObj);
                }
            }
            if (setSID) {
                tmpObj.sid = sid;
            }
            tmpObj.init(x, y, dir, s, type, data, owner);
        };

        this.disableBySid = function(sid) {
            let find = findObjectBySid(sid);
            if (find) {
                this.disableObj(find);
            }
        };

        this.removeAllItems = function(sid, server) {
            gameObjects.filter((tmp) => tmp.active && tmp.owner && tmp.owner.sid == sid).forEach((tmp) => this.disableObj(tmp));
        };

        this.checkItemLocation = function(x, y, s, sM, indx, ignoreWater, placer) {
            let cantPlace = liztobj.find((tmp) => tmp.active && UTILS.getDistance(x, y, tmp.x, tmp.y) < s + (tmp.blocker ? tmp.blocker : tmp.getScale(sM, tmp.isItem)));
            if (cantPlace) return false;
            if (!ignoreWater && indx != 18 && y >= config.mapScale / 2 - config.riverWidth / 2 && y <= config.mapScale / 2 + config.riverWidth / 2) return false;
            return true;
        };

    }
}
class Projectile {
    constructor(players, ais, objectManager, items, config, UTILS, server) {

        this.init = function(indx, x, y, dir, spd, dmg, rng, scl, owner) {
            this.active = true;
            this.tickActive = true;
            this.indx = indx;
            this.x = x;
            this.y = y;
            this.x2 = x;
            this.y2 = y;
            this.dir = dir;
            this.skipMov = true;
            this.speed = spd;
            this.dmg = dmg;
            this.scale = scl;
            this.range = rng;
            this.r2 = rng;
            this.owner = owner;
        };

        this.update = function(delta) {
            if (this.active) {
                let tmpSpeed = this.speed * delta;
                if (!this.skipMov) {
                    this.x += tmpSpeed * Math.cos(this.dir);
                    this.y += tmpSpeed * Math.sin(this.dir);
                    this.range -= tmpSpeed;
                    if (this.range <= 0) {
                        this.x += this.range * Math.cos(this.dir);
                        this.y += this.range * Math.sin(this.dir);
                        tmpSpeed = 1;
                        this.range = 0;
                        this.active = false;
                    }
                } else {
                    this.skipMov = false;
                }
            }
        };
        this.tickUpdate = function(delta) {
            if (this.tickActive) {
                let tmpSpeed = this.speed * delta;
                if (!this.skipMov) {
                    this.x2 += tmpSpeed * Math.cos(this.dir);
                    this.y2 += tmpSpeed * Math.sin(this.dir);
                    this.r2 -= tmpSpeed;
                    if (this.r2 <= 0) {
                        this.x2 += this.r2 * Math.cos(this.dir);
                        this.y2 += this.r2 * Math.sin(this.dir);
                        tmpSpeed = 1;
                        this.r2 = 0;
                        this.tickActive = false;
                    }
                } else {
                    this.skipMov = false;
                }
            }
        };
    }
};
class Store {
    constructor() {
        this.hats = [{
            id: 45,
            name: "Shame!",
            dontSell: true,
            price: 0,
            scale: 120,
            desc: "hacks are for winners"
        }, {
            id: 51,
            name: "Moo Cap",
            price: 0,
            scale: 120,
            desc: "coolest mooer around"
        }, {
            id: 50,
            name: "Apple Cap",
            price: 0,
            scale: 120,
            desc: "apple farms remembers"
        }, {
            id: 28,
            name: "Moo Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 29,
            name: "Pig Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 30,
            name: "Fluff Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 36,
            name: "Pandou Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 37,
            name: "Bear Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 38,
            name: "Monkey Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 44,
            name: "Polar Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 35,
            name: "Fez Hat",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 42,
            name: "Enigma Hat",
            price: 0,
            scale: 120,
            desc: "join the enigma army"
        }, {
            id: 43,
            name: "Blitz Hat",
            price: 0,
            scale: 120,
            desc: "hey everybody i'm blitz"
        }, {
            id: 49,
            name: "Bob XIII Hat",
            price: 0,
            scale: 120,
            desc: "like and subscribe"
        }, {
            id: 57,
            name: "Pumpkin",
            price: 50,
            scale: 120,
            desc: "Spooooky"
        }, {
            id: 8,
            name: "Bummle Hat",
            price: 100,
            scale: 120,
            desc: "no effect"
        }, {
            id: 2,
            name: "Straw Hat",
            price: 500,
            scale: 120,
            desc: "no effect"
        }, {
            id: 15,
            name: "Winter Cap",
            price: 600,
            scale: 120,
            desc: "allows you to move at normal speed in snow",
            coldM: 1
        }, {
            id: 5,
            name: "Cowboy Hat",
            price: 1000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 4,
            name: "Ranger Hat",
            price: 2000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 18,
            name: "Explorer Hat",
            price: 2000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 31,
            name: "Flipper Hat",
            price: 2500,
            scale: 120,
            desc: "have more control while in water",
            watrImm: true
        }, {
            id: 1,
            name: "Marksman Cap",
            price: 3000,
            scale: 120,
            desc: "increases arrow speed and range",
            aMlt: 1.3
        }, {
            id: 10,
            name: "Bush Gear",
            price: 3000,
            scale: 160,
            desc: "allows you to disguise yourself as a bush"
        }, {
            id: 48,
            name: "Halo",
            price: 3000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 6,
            name: "Soldier Helmet",
            price: 4000,
            scale: 120,
            desc: "reduces damage taken but slows movement",
            spdMult: 0.94,
            dmgMult: 0.75
        }, {
            id: 23,
            name: "Anti Venom Gear",
            price: 4000,
            scale: 120,
            desc: "makes you immune to poison",
            poisonRes: 1
        }, {
            id: 13,
            name: "Medic Gear",
            price: 5000,
            scale: 110,
            desc: "slowly regenerates health over time",
            healthRegen: 3
        }, {
            id: 9,
            name: "Miners Helmet",
            price: 5000,
            scale: 120,
            desc: "earn 1 extra gold per resource",
            extraGold: 1
        }, {
            id: 32,
            name: "Musketeer Hat",
            price: 5000,
            scale: 120,
            desc: "reduces cost of projectiles",
            projCost: 0.5
        }, {
            id: 7,
            name: "Bull Helmet",
            price: 6000,
            scale: 120,
            desc: "increases damage done but drains health",
            healthRegen: -5,
            dmgMultO: 1.5,
            spdMult: 0.96
        }, {
            id: 22,
            name: "Emp Helmet",
            price: 6000,
            scale: 120,
            desc: "turrets won't attack but you move slower",
            antiTurret: 1,
            spdMult: 0.7
        }, {
            id: 12,
            name: "Booster Hat",
            price: 6000,
            scale: 120,
            desc: "increases your movement speed",
            spdMult: 1.16
        }, {
            id: 26,
            name: "Barbarian Armor",
            price: 8000,
            scale: 120,
            desc: "knocks back enemies that attack you",
            dmgK: 0.6
        }, {
            id: 21,
            name: "Plague Mask",
            price: 10000,
            scale: 120,
            desc: "melee attacks deal poison damage",
            poisonDmg: 5,
            poisonTime: 6
        }, {
            id: 46,
            name: "Bull Mask",
            price: 10000,
            scale: 120,
            desc: "bulls won't target you unless you attack them",
            bullRepel: 1
        }, {
            id: 14,
            name: "Windmill Hat",
            topSprite: true,
            price: 10000,
            scale: 120,
            desc: "generates points while worn",
            pps: 1.5
        }, {
            id: 11,
            name: "Spike Gear",
            topSprite: true,
            price: 10000,
            scale: 120,
            desc: "deal damage to players that damage you",
            dmg: 0.45
        }, {
            id: 53,
            name: "Turret Gear",
            topSprite: true,
            price: 10000,
            scale: 120,
            desc: "you become a walking turret",
            turret: {
                proj: 1,
                range: 700,
                rate: 2500
            },
            spdMult: 0.7
        }, {
            id: 20,
            name: "Samurai Armor",
            price: 12000,
            scale: 120,
            desc: "increased attack speed and fire rate",
            atkSpd: 0.78
        }, {
            id: 58,
            name: "Dark Knight",
            price: 12000,
            scale: 120,
            desc: "restores health when you deal damage",
            healD: 0.4
        }, {
            id: 27,
            name: "Scavenger Gear",
            price: 15000,
            scale: 120,
            desc: "earn double points for each kill",
            kScrM: 2
        }, {
            id: 40,
            name: "Tank Gear",
            price: 15000,
            scale: 120,
            desc: "increased damage to buildings but slower movement",
            spdMult: 0.3,
            bDmg: 3.3
        }, {
            id: 52,
            name: "Thief Gear",
            price: 15000,
            scale: 120,
            desc: "steal half of a players gold when you kill them",
            goldSteal: 0.5
        }, {
            id: 55,
            name: "Bloodthirster",
            price: 20000,
            scale: 120,
            desc: "Restore Health when dealing damage. And increased damage",
            healD: 0.25,
            dmgMultO: 1.2,
        }, {
            id: 56,
            name: "Assassin Gear",
            price: 20000,
            scale: 120,
            desc: "Go invisible when not moving. Can't eat. Increased speed",
            noEat: true,
            spdMult: 1.1,
            invisTimer: 1000
        }];

        this.accessories = [{
            id: 12,
            name: "Snowball",
            price: 1000,
            scale: 105,
            xOff: 18,
            desc: "no effect"
        }, {
            id: 9,
            name: "Tree Cape",
            price: 1000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 10,
            name: "Stone Cape",
            price: 1000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 3,
            name: "Cookie Cape",
            price: 1500,
            scale: 90,
            desc: "no effect"
        }, {
            id: 8,
            name: "Cow Cape",
            price: 2000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 11,
            name: "Monkey Tail",
            price: 2000,
            scale: 97,
            xOff: 25,
            desc: "Super speed but reduced damage",
            spdMult: 1.35,
            dmgMultO: 0.2
        }, {
            id: 17,
            name: "Apple Basket",
            price: 3000,
            scale: 80,
            xOff: 12,
            desc: "slowly regenerates health over time",
            healthRegen: 1
        }, {
            id: 6,
            name: "Winter Cape",
            price: 3000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 4,
            name: "Skull Cape",
            price: 4000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 5,
            name: "Dash Cape",
            price: 5000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 2,
            name: "Dragon Cape",
            price: 6000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 1,
            name: "Super Cape",
            price: 8000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 7,
            name: "Troll Cape",
            price: 8000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 14,
            name: "Thorns",
            price: 10000,
            scale: 115,
            xOff: 20,
            desc: "no effect"
        }, {
            id: 15,
            name: "Blockades",
            price: 10000,
            scale: 95,
            xOff: 15,
            desc: "no effect"
        }, {
            id: 20,
            name: "Devils Tail",
            price: 10000,
            scale: 95,
            xOff: 20,
            desc: "no effect"
        }, {
            id: 16,
            name: "Sawblade",
            price: 12000,
            scale: 90,
            spin: true,
            xOff: 0,
            desc: "deal damage to players that damage you",
            dmg: 0.15
        }, {
            id: 13,
            name: "Angel Wings",
            price: 15000,
            scale: 138,
            xOff: 22,
            desc: "slowly regenerates health over time",
            healthRegen: 3
        }, {
            id: 19,
            name: "Shadow Wings",
            price: 15000,
            scale: 138,
            xOff: 22,
            desc: "increased movement speed",
            spdMult: 1.1
        }, {
            id: 18,
            name: "Blood Wings",
            price: 20000,
            scale: 178,
            xOff: 26,
            desc: "restores health when you deal damage",
            healD: 0.2
        }, {
            id: 21,
            name: "Corrupt X Wings",
            price: 20000,
            scale: 178,
            xOff: 26,
            desc: "deal damage to players that damage you",
            dmg: 0.25
        }];
    }
};
class ProjectileManager {
    constructor(Projectile, projectiles, players, ais, objectManager, items, config, UTILS, server) {
        this.addProjectile = function(x, y, dir, range, speed, indx, owner, ignoreObj, layer, inWindow) {
            let tmpData = items.projectiles[indx];
            let tmpProj;
            for (let i = 0; i < projectiles.length; ++i) {
                if (!projectiles[i].active) {
                    tmpProj = projectiles[i];
                    break;
                }
            }
            if (!tmpProj) {
                tmpProj = new Projectile(players, ais, objectManager, items, config, UTILS, server);
                tmpProj.sid = projectiles.length;
                projectiles.push(tmpProj);
            }
            tmpProj.init(indx, x, y, dir, speed, tmpData.dmg, range, tmpData.scale, owner);
            tmpProj.ignoreObj = ignoreObj;
            tmpProj.layer = layer || tmpData.layer;
            tmpProj.inWindow = inWindow;
            tmpProj.src = tmpData.src;
            return tmpProj;
        };
    }
};
class AiManager {

    constructor(ais, AI, players, items, objectManager, config, UTILS, scoreCallback, server) {

        this.aiTypes = [{
            id: 0,
            src: "cow_1",
            killScore: 150,
            health: 500,
            weightM: 0.8,
            speed: 0.00095,
            turnSpeed: 0.001,
            scale: 72,
            drop: ["food", 50]
        }, {
            id: 1,
            src: "pig_1",
            killScore: 200,
            health: 800,
            weightM: 0.6,
            speed: 0.00085,
            turnSpeed: 0.001,
            scale: 72,
            drop: ["food", 80]
        }, {
            id: 2,
            name: "Bull",
            src: "bull_2",
            hostile: true,
            dmg: 20,
            killScore: 1000,
            health: 1800,
            weightM: 0.5,
            speed: 0.00094,
            turnSpeed: 0.00074,
            scale: 78,
            viewRange: 800,
            chargePlayer: true,
            drop: ["food", 100]
        }, {
            id: 3,
            name: "Bully",
            src: "bull_1",
            hostile: true,
            dmg: 20,
            killScore: 2000,
            health: 2800,
            weightM: 0.45,
            speed: 0.001,
            turnSpeed: 0.0008,
            scale: 90,
            viewRange: 900,
            chargePlayer: true,
            drop: ["food", 400]
        }, {
            id: 4,
            name: "Wolf",
            src: "wolf_1",
            hostile: true,
            dmg: 8,
            killScore: 500,
            health: 300,
            weightM: 0.45,
            speed: 0.001,
            turnSpeed: 0.002,
            scale: 84,
            viewRange: 800,
            chargePlayer: true,
            drop: ["food", 200]
        }, {
            id: 5,
            name: "Quack",
            src: "chicken_1",
            dmg: 8,
            killScore: 2000,
            noTrap: true,
            health: 300,
            weightM: 0.2,
            speed: 0.0018,
            turnSpeed: 0.006,
            scale: 70,
            drop: ["food", 100]
        }, {
            id: 6,
            name: "MOOSTAFA",
            nameScale: 50,
            src: "enemy",
            hostile: true,
            dontRun: true,
            fixedSpawn: true,
            spawnDelay: 60000,
            noTrap: true,
            colDmg: 100,
            dmg: 40,
            killScore: 8000,
            health: 18000,
            weightM: 0.4,
            speed: 0.0007,
            turnSpeed: 0.01,
            scale: 80,
            spriteMlt: 1.8,
            leapForce: 0.9,
            viewRange: 1000,
            hitRange: 210,
            hitDelay: 1000,
            chargePlayer: true,
            drop: ["food", 100]
        }, {
            id: 7,
            name: "Treasure",
            hostile: true,
            nameScale: 35,
            src: "crate_1",
            fixedSpawn: true,
            spawnDelay: 120000,
            colDmg: 200,
            killScore: 5000,
            health: 20000,
            weightM: 0.1,
            speed: 0.0,
            turnSpeed: 0.0,
            scale: 70,
            spriteMlt: 1.0
        }, {
            id: 8,
            name: "MOOFIE",
            src: "wolf_2",
            hostile: true,
            fixedSpawn: true,
            dontRun: true,
            hitScare: 4,
            spawnDelay: 30000,
            noTrap: true,
            nameScale: 35,
            dmg: 10,
            colDmg: 100,
            killScore: 3000,
            health: 7000,
            weightM: 0.45,
            speed: 0.0015,
            turnSpeed: 0.002,
            scale: 90,
            viewRange: 800,
            chargePlayer: true,
            drop: ["food", 1000]
        }, {
            id: 9,
            name: "💀MOOFIE",
            src: "wolf_2",
            hostile: !0,
            fixedSpawn: !0,
            dontRun: !0,
            hitScare: 50,
            spawnDelay: 6e4,
            noTrap: !0,
            nameScale: 35,
            dmg: 12,
            colDmg: 100,
            killScore: 3e3,
            health: 9e3,
            weightM: .45,
            speed: .0015,
            turnSpeed: .0025,
            scale: 94,
            viewRange: 1440,
            chargePlayer: !0,
            drop: ["food", 3e3],
            minSpawnRange: .85,
            maxSpawnRange: .9
        }, {
            id: 10,
            name: "💀Wolf",
            src: "wolf_1",
            hostile: !0,
            fixedSpawn: !0,
            dontRun: !0,
            hitScare: 50,
            spawnDelay: 3e4,
            dmg: 10,
            killScore: 700,
            health: 500,
            weightM: .45,
            speed: .00115,
            turnSpeed: .0025,
            scale: 88,
            viewRange: 1440,
            chargePlayer: !0,
            drop: ["food", 400],
            minSpawnRange: .85,
            maxSpawnRange: .9
        }, {
            id: 11,
            name: "💀Bully",
            src: "bull_1",
            hostile: !0,
            fixedSpawn: !0,
            dontRun: !0,
            hitScare: 50,
            dmg: 20,
            killScore: 5e3,
            health: 5e3,
            spawnDelay: 1e5,
            weightM: .45,
            speed: .00115,
            turnSpeed: .0025,
            scale: 94,
            viewRange: 1440,
            chargePlayer: !0,
            drop: ["food", 800],
            minSpawnRange: .85,
            maxSpawnRange: .9
        }];

        this.spawn = function(x, y, dir, index) {
            let tmpObj = ais.find((tmp) => !tmp.active);
            if (!tmpObj) {
                tmpObj = new AI(ais.length, objectManager, players, items, UTILS, config, scoreCallback, server);
                ais.push(tmpObj);
            }
            tmpObj.init(x, y, dir, index, this.aiTypes[index]);
            return tmpObj;
        };
    }

};

class AI {
    constructor(sid, objectManager, players, items, UTILS, config, scoreCallback, server) {
        this.sid = sid;
        this.isAI = true;
        this.nameIndex = UTILS.randInt(0, config.cowNames.length - 1);

        this.init = function(x, y, dir, index, data) {
            this.x = x;
            this.y = y;
            this.startX = data.fixedSpawn ? x : null;
            this.startY = data.fixedSpawn ? y : null;
            this.xVel = 0;
            this.yVel = 0;
            this.zIndex = 0;
            this.dir = dir;
            this.dirPlus = 0;
            this.showName = 'aaa';
            this.index = index;
            this.src = data.src;
            if (data.name) this.name = data.name;
            this.weightM = data.weightM;
            this.speed = data.speed;
            this.killScore = data.killScore;
            this.turnSpeed = data.turnSpeed;
            this.scale = data.scale;
            this.maxHealth = data.health;
            this.leapForce = data.leapForce;
            this.health = this.maxHealth;
            this.chargePlayer = data.chargePlayer;
            this.viewRange = data.viewRange;
            this.drop = data.drop;
            this.dmg = data.dmg;
            this.hostile = data.hostile;
            this.dontRun = data.dontRun;
            this.hitRange = data.hitRange;
            this.hitDelay = data.hitDelay;
            this.hitScare = data.hitScare;
            this.spriteMlt = data.spriteMlt;
            this.nameScale = data.nameScale;
            this.colDmg = data.colDmg;
            this.noTrap = data.noTrap;
            this.spawnDelay = data.spawnDelay;
            this.hitWait = 0;
            this.waitCount = 1000;
            this.moveCount = 0;
            this.targetDir = 0;
            this.active = true;
            this.alive = true;
            this.runFrom = null;
            this.chargeTarget = null;
            this.dmgOverTime = {};
        };

        let tmpRatio = 0;
        let animIndex = 0;
        this.animate = function(delta) {
            if (this.animTime > 0) {
                this.animTime -= delta;
                if (this.animTime <= 0) {
                    this.animTime = 0;
                    this.dirPlus = 0;
                    tmpRatio = 0;
                    animIndex = 0;
                } else {
                    if (animIndex == 0) {
                        tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                        this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                        if (tmpRatio >= 1) {
                            tmpRatio = 1;
                            animIndex = 1;
                        }
                    } else {
                        tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                        this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                    }
                }
            }
        };

        this.startAnim = function() {
            this.animTime = this.animSpeed = 600;
            this.targetAngle = Math.PI * 0.8;
            tmpRatio = 0;
            animIndex = 0;
        };

    };

};
class addCh {
    constructor(x, y, chat, tmpObj) {
        this.x = x;
        this.y = y;
        this.alpha = 0;
        this.active = true;
        this.alive = false;
        this.chat = chat;
        this.owner = tmpObj;
    };
};
class DeadPlayer {
    constructor(x, y, dir, buildIndex, weaponIndex, weaponVariant, skinColor, scale, name) {
        this.x = x;
        this.y = y;
        this.lastDir = dir;
        this.dir = dir + Math.PI;
        this.buildIndex = buildIndex;
        this.weaponIndex = weaponIndex;
        this.weaponVariant = weaponVariant;
        this.skinColor = skinColor;
        this.scale = scale;
        this.visScale = 0;
        this.name = name;
        this.alpha = 1;
        this.active = true;
        this.animate = function(delta) {
            let d2 = UTILS.getAngleDist(this.lastDir, this.dir);
            if (d2 > 0.01) {
                this.dir += d2 / 20;
            } else {
                this.dir = this.lastDir;
            }
            if (this.visScale < this.scale) {
                this.visScale += delta / (this.scale / 2);
                if (this.visScale >= this.scale) {
                    this.visScale = this.scale;
                }
            }
            this.alpha -= delta / 30000;
            if (this.alpha <= 0) {
                this.alpha = 0;
                this.active = false;
            }
        }
    }
};
class Player {
    constructor(id, sid, config, UTILS, projectileManager, objectManager, players, ais, items, hats, accessories, server, scoreCallback, iconCallback) {
        this.id = id;
        this.sid = sid;
        this.tmpScore = 0;
        this.team = null;
        this.latestSkin = 0;
        this.oldSkinIndex = 0;
        this.skinIndex = 0;
        this.latestTail = 0;
        this.oldTailIndex = 0;
        this.tailIndex = 0;
        this.hitTime = 0;
        this.lastHit = 0;
        this.showName = 'NOOO';
        this.tails = {};

        for (let i = 0; i < accessories.length; ++i) {
            if (accessories[i].price <= 0)
                this.tails[accessories[i].id] = 1;
        }
        this.skins = {};
        for (let i = 0; i < hats.length; ++i) {
            if (hats[i].price <= 0)
                this.skins[hats[i].id] = 1;
        }

        this.points = 0;
        this.dt = 0;
        this.hidden = false;
        this.itemCounts = {};
        this.isPlayer = true;
        this.pps = 0;
        this.moveDir = undefined;
        this.skinRot = 0;
        this.lastPing = 0;
        this.iconIndex = 0;
        this.skinColor = 0;
        this.dist2 = 0;
        this.aim2 = 0;
        this.maxSpeed = 1;
        this.chat = {
            message: null,
            count: 0
        };
        this.backupNobull = true;
        this.spawn = function(moofoll) {
            this.attacked = false;
            this.timeDamaged = 0;
            this.timeHealed = 0;
            this.pinge = 0;
            this.millPlace = 'NOOO';
            this.lastshamecount = 0;
            this.death = false;
            this.spinDir = 0;
            this.sync = false;
            this.antiBull = 0;
            this.bullTimer = 0;
            this.poisonTimer = 0;
            this.active = true;
            this.alive = true;
            this.lockMove = false;
            this.lockDir = false;
            this.minimapCounter = 0;
            this.chatCountdown = 0;
            this.shameCount = 0;
            this.shameTimer = 0;
            this.sentTo = {};
            this.gathering = 0;
            this.gatherIndex = 0;
            this.shooting = {};
            this.shootIndex = 9;
            this.autoGather = 0;
            this.animTime = 0;
            this.animSpeed = 0;
            this.mouseState = 0;
            this.buildIndex = -1;
            this.weaponIndex = 0;
            this.weaponCode = 0;
            this.weaponVariant = 0;
            this.primaryIndex = undefined;
            this.secondaryIndex = undefined;
            this.dmgOverTime = {};
            this.noMovTimer = 0;
            this.maxXP = 300;
            this.XP = 0;
            this.age = 1;
            this.kills = 0;
            this.upgrAge = 2;
            this.upgradePoints = 0;
            this.x = 0;
            this.y = 0;
            this.oldXY = {
                x: 0,
                y: 0
            };
            this.zIndex = 0;
            this.xVel = 0;
            this.yVel = 0;
            this.slowMult = 1;
            this.dir = 0;
            this.dirPlus = 0;
            this.targetDir = 0;
            this.targetAngle = 0;
            this.maxHealth = 100;
            this.health = this.maxHealth;
            this.oldHealth = this.maxHealth;
            this.damaged = 0;
            this.scale = config.playerScale;
            this.speed = config.playerSpeed;
            this.resetMoveDir();
            this.resetResources(moofoll);
            this.items = [0, 3, 6, 10];
            this.weapons = [0];
            this.shootCount = 0;
            this.weaponXP = [];
            this.reloads = {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: 0,
                11: 0,
                12: 0,
                13: 0,
                14: 0,
                15: 0,
                53: 0,
            };
            this.bowThreat = {
                9: 0,
                12: 0,
                13: 0,
                15: 0,
            };
            this.damageThreat = 0;
            this.inTrap = false;
            this.canEmpAnti = false;
            this.empAnti = false;
            this.soldierAnti = false;
            this.poisonTick = 0;
            this.bullTick = 0;
            this.setPoisonTick = false;
            this.setBullTick = false;
            this.antiTimer = 2;
        };

        this.resetMoveDir = function() {
            this.moveDir = undefined;
        };

        this.resetResources = function(moofoll) {
            for (let i = 0; i < config.resourceTypes.length; ++i) {
                this[config.resourceTypes[i]] = moofoll ? 100 : 0;
            }
        };

        this.getItemType = function(id) {
            let findindx = this.items.findIndex((ids) => ids == id);
            if (findindx != -1) {
                return findindx;
            } else {
                return items.checkItem.index(id, this.items);
            }
        };

        this.setData = function(data) {
            this.id = data[0];
            this.sid = data[1];
            this.name = data[2];
            this.x = data[3];
            this.y = data[4];
            this.dir = data[5];
            this.health = data[6];
            this.maxHealth = data[7];
            this.scale = data[8];
            this.skinColor = data[9];
        };

        this.updateTimer = function() {

            this.bullTimer -= 1;
            if (this.bullTimer <= 0) {
                this.setBullTick = false;
                this.bullTick = game.tick - 1;
                this.bullTimer = config.serverUpdateRate;
            }
            this.poisonTimer -= 1;
            if (this.poisonTimer <= 0) {
                this.setPoisonTick = false;
                this.poisonTick = game.tick - 1;
                this.poisonTimer = config.serverUpdateRate;
            }

        };
        this.update = function(delta) {
            if (this.active) {

                let gear = {
                    skin: findID(hats, this.skinIndex),
                    tail: findID(accessories, this.tailIndex)
                }
                let spdMult = ((this.buildIndex >= 0) ? 0.5 : 1) * (items.weapons[this.weaponIndex].spdMult || 1) * (gear.skin ? (gear.skin.spdMult || 1) : 1) * (gear.tail ? (gear.tail.spdMult || 1) : 1) * (this.y <= config.snowBiomeTop ? ((gear.skin && gear.skin.coldM) ? 1 : config.snowSpeed) : 1) * this.slowMult;
                this.maxSpeed = spdMult;

            }
        };

        let tmpRatio = 0;
        let animIndex = 0;
        let crazyFactor = 3;
        let waveAmplitude = Math.PI / -16;
        this.animate = function(delta) {
            if (this.animTime > 0) {
                this.animTime -= delta;
                if (this.animTime <= 0) {
                    this.animTime = 0;
                    this.dirPlus = 0;
                    tmpRatio = 0;
                    animIndex = 0;
                } else {
                    if (animIndex == 0) {
                        tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                        let progress = Math.min(1, tmpRatio);
                        this.dirPlus = UTILS.lerp(0, this.targetAngle, easeInOutSine(progress)) + waveAmplitude * Math.sin(progress * crazyFactor * Math.PI);
                        if (progress >= 1) {
                            tmpRatio = 1;
                            animIndex = 1;
                        }
                    } else {
                        tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                        let progress = Math.max(0, tmpRatio);
                        this.dirPlus = UTILS.lerp(0, this.targetAngle, easeInOutSine(progress)) + waveAmplitude * Math.cos(progress * crazyFactor * Math.PI);
                    }
                }
            }
        };

        this.startAnim = function(didHit, index) {
            this.animTime = this.animSpeed = items.weapons[index].speed * 1.8;
            this.targetAngle = (didHit ? -config.hitAngle : -Math.PI);
            tmpRatio = 0;
            animIndex = 0;
        };

        this.canSee = function(other) {
            if (!other) return false;
            let dx = Math.abs(other.x - this.x) - other.scale;
            let dy = Math.abs(other.y - this.y) - other.scale;
            return dx <= (config.maxScreenWidth / 2) * 1.3 && dy <= (config.maxScreenHeight / 2) * 1.3;
        };

        this.judgeShame = function() {
            this.lastshamecount = this.shameCount;
            if (this.oldHealth < this.health) {
                if (this.hitTime) {
                    let timeSinceHit = game.tick - this.hitTime;
                    this.lastHit = game.tick;
                    this.hitTime = 0;
                    if (timeSinceHit < 2) {
                        this.shameCount++;
                    } else {
                        this.shameCount = Math.max(0, this.shameCount - 2);
                    }
                }
            } else if (this.oldHealth > this.health) {
                this.hitTime = game.tick;
            }
        };
        this.addShameTimer = function() {
            this.shameCount = 0;
            this.shameTimer = 30;
            let interval = setInterval(() => {
                this.shameTimer--;
                if (this.shameTimer <= 0) {
                    clearInterval(interval);
                }
            }, 1000);
        };

        this.isTeam = function(tmpObj) {
            return (this == tmpObj || (this.team && this.team == tmpObj.team));
        };

        this.findAllianceBySid = function(sid) {
            return this.team ? alliancePlayers.find((THIS) => THIS === sid) : null;
        };
        this.checkCanInsta = function(nobull) {
            let totally = 0;
            if (this.alive && inGame) {
                let primary = {
                    weapon: this.weapons[0],
                    variant: this.primaryVariant,
                    dmg: this.weapons[0] == undefined ? 0 : items.weapons[this.weapons[0]].dmg,
                };
                let secondary = {
                    weapon: this.weapons[1],
                    variant: this.secondaryVariant,
                    dmg: this.weapons[1] == undefined ? 0 : items.weapons[this.weapons[1]].Pdmg,
                };
                let bull = this.skins[7] && !nobull ? 1.5 : 1;
                let pV = primary.variant != undefined ? config.weaponVariants[primary.variant].val : 1;
                if (primary.weapon != undefined && this.reloads[primary.weapon] == 0) {
                    totally += primary.dmg * pV * bull;
                }
                if (secondary.weapon != undefined && this.reloads[secondary.weapon] == 0) {
                    totally += secondary.dmg;
                }
                if (this.skins[53] && this.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate) && near.skinIndex != 22) {
                    totally += 25;
                }
                totally *= near.skinIndex == 6 ? 0.75 : 1;
                return totally;
            }
            return 0;
        };

        this.manageReload = function() {
            if (this.shooting[53]) {
                this.shooting[53] = 0;
                this.reloads[53] = (2500 - game.tickRate);
            } else {
                if (this.reloads[53] > 0) {
                    this.reloads[53] = Math.max(0, this.reloads[53] - game.tickRate);
                }
            }

            if (this.reloads[this.weaponIndex] <= 1000/9) {
                let index = this.weaponIndex;
                let nearObja = liztobj.filter((e) => (e.active || e.alive) && e.health < e.maxHealth && e.group !== undefined && UTILS.getDist(e, player, 0, 2) <= (items.weapons[player.weaponIndex].range + e.scale));
                for(let i = 0; i < nearObja.length; i++) {
                    let aaa = nearObja[i];

                    let val = items.weapons[index].dmg * (config.weaponVariants[tmpObj[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1) * 3.3;
                    let valaa = items.weapons[index].dmg * (config.weaponVariants[tmpObj[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1);
                    if(aaa.health - (valaa) <= 0 && near.length) {
                        place(near.dist2<((near.scale * 1.8) + 50)?4:2, caf(aaa, player) + Math.PI);
                    }
                }
            }

            if (this.gathering || this.shooting[1]) {
                if (this.gathering) {
                    this.gathering = 0;
                    this.reloads[this.gatherIndex] = (items.weapons[this.gatherIndex].speed * (this.skinIndex == 20 ? 0.78 : 1));
                    this.attacked = true;
                }
                if (this.shooting[1]) {
                    this.shooting[1] = 0;
                    this.reloads[this.shootIndex] = (items.weapons[this.shootIndex].speed * (this.skinIndex == 20 ? 0.78 : 1));
                    this.attacked = true;
                }
            } else {
                this.attacked = false;
                if (this.buildIndex < 0) {
                    if (this.reloads[this.weaponIndex] > 0) {
                        this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - 110);
                        if (this == player) {
                            if (getEl("weaponGrind").checked) {
                                for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                                    checkPlace(player.getItemType(22), i);
                                }
                            }
                        }
                        if (this.reloads[this.primaryIndex] == 0 && this.reloads[this.weaponIndex] == 0) {
                            this.antiBull++;
                            game.tickBase(() => {
                                this.antiBull = 0;
                            }, 1);
                        }
                    }
                }
            }
        };

        this.addDamageThreat = function(tmpObj) {
            let primary = {
                weapon: this.primaryIndex,
                variant: this.primaryVariant
            };
            primary.dmg = primary.weapon == undefined ? 45 : items.weapons[primary.weapon].dmg;
            let secondary = {
                weapon: this.secondaryIndex,
                variant: this.secondaryVariant
            };
            secondary.dmg = secondary.weapon == undefined ? 75 : items.weapons[secondary.weapon].Pdmg;
            let bull = 1.5;
            let pV = primary.variant != undefined ? config.weaponVariants[primary.variant].val : 1.18;
            let sV = secondary.variant != undefined ? [9, 12, 13, 15].includes(secondary.weapon) ? 1 : config.weaponVariants[secondary.variant].val : 1.18;
            if (primary.weapon == undefined ? true : this.reloads[primary.weapon] == 0) {
                this.damageThreat += primary.dmg * pV * bull;
            }
            if (secondary.weapon == undefined ? true : this.reloads[secondary.weapon] == 0) {
                this.damageThreat += secondary.dmg * sV;
            }
            if (this.reloads[53] <= game.tickRate) {
                this.damageThreat += 25;
            }
            this.damageThreat *= tmpObj.skinIndex == 6 ? 0.75 : 1;
            if (!this.isTeam(tmpObj)) {
                if (this.dist2 <= 300) {
                    tmpObj.damageThreat += this.damageThreat;
                }
            }
        };

    }
};

// Sine easing functions for smooth transitions
function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}

function sendUpgrade(index) {
    player.reloads[index] = 0;
    packet("H", index);
}

function storeEquip(id, index) {
    packet("c", 0, id, index);
}

function storeBuy(id, index) {
    packet("c", 1, id, index);
}

function buyEquip(id, index) {
    let nID = player.skins[6] ? 6 : 0;
    if (player.alive && inGame) {
        if (index == 0) {
            if (player.skins[id]) {
                if (player.latestSkin != id) {
                    packet("c", 0, id, 0);
                }
            } else {
                if (configs.autoBuyEquip) {
                    let find = findID(hats, id);
                    if (find) {
                        if (player.points >= find.price) {
                            packet("c", 1, id, 0);
                            packet("c", 0, id, 0);
                        } else {
                            if (player.latestSkin != nID) {
                                packet("c", 0, nID, 0);
                            }
                        }
                    } else {
                        if (player.latestSkin != nID) {
                            packet("c", 0, nID, 0);
                        }
                    }
                } else {
                    if (player.latestSkin != nID) {
                        packet("c", 0, nID, 0);
                    }
                }
            }
        } else if (index == 1) {
            if (useWasd && (id != 11 && id != 0)) {
                if (player.latestTail != 0) {
                    packet("c", 0, 0, 1);
                }
                return;
            }
            if (player.tails[id]) {
                if (player.latestTail != id) {
                    packet("c", 0, id, 1);
                }
            } else {
                if (configs.autoBuyEquip) {
                    let find = findID(accessories, id);
                    if (find) {
                        if (player.points >= find.price) {
                            packet("c", 1, id, 1);
                            packet("c", 0, id, 1);
                        } else {
                            if (player.latestTail != 0) {
                                packet("c", 0, 0, 1);
                            }
                        }
                    } else {
                        if (player.latestTail != 0) {
                            packet("c", 0, 0, 1);
                        }
                    }
                } else {
                    if (player.latestTail != 0) {
                        packet("c", 0, 0, 1);
                    }
                }
            }
        }
    }
}

function selectToBuild(index, wpn) {
    packet("G", index, wpn);
}

function selectWeapon(index, isPlace) {
    if (!isPlace) {
        player.weaponCode = index;
    }
    packet("G", index, 1);
}

function sendAutoGather() {
    packet("K", 1, 1);
}

function sendAtck(id, angle) {
    packet("d", id, angle, 1);
}

function place(itemId, angle, shouldRemove) {
    try {
        if (itemId === undefined) return;

        const item = items.list[player.items[itemId]];
        const tmpScale = player.scale + item.scale + (item.placeOffset || 0);
        const tmpX = player.x2 + tmpScale * Math.cos(angle);
        const tmpY = player.y2 + tmpScale * Math.sin(angle);

        const canPlaceItem = player.alive && inGame && (player.itemCounts[item.group.id] === undefined || (config.isSandbox ? true : player.itemCounts[item.group.id] < (item.group.limit ? item.group.limit : 99)));

        if (canPlaceItem) {
            selectToBuild(player.items[itemId]);
            sendAtck(1, angle);
            selectWeapon(player.weaponCode, 1);

            if (shouldRemove && document.getElementById("placeVis").checked) {
                placeVisible.push({
                    x: tmpX,
                    y: tmpY,
                    name: item.name,
                    scale: item.scale,
                    dir: angle
                });

                game.tickBase(() => {
                    placeVisible.shift();
                }, 1);
            }
        }
    } catch (error) {
        console.error("Error while placing item:", error);
    }
}

function checkPlace(itemId, angle) {
    try {
        if (itemId === undefined) return;

        const item = items.list[player.items[itemId]];
        const tmpScale = player.scale + item.scale + (item.placeOffset || 0);
        const tmpX = player.x2 + tmpScale * Math.cos(angle);
        const tmpY = player.y2 + tmpScale * Math.sin(angle);

        if (objectManager.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player)) {
            place(itemId, angle, true);
        }
    } catch (error) {
        console.error("Error while checking place:", error);
    }
}

function soldierMult() {
    return player.latestSkin == 6 ? 0.75 : 1;
}

function healthBased() {
    if (player.health === 100) {
        return 0;
    }

    if (player.skinIndex !== 45 && player.skinIndex !== 56) {
        const currentItem = items.list[player.items[0]];
        if (currentItem && currentItem.healing) {
            const remainingHealth = 100 - player.health;
            const itemsNeeded = Math.ceil(remainingHealth / currentItem.healing);
            return itemsNeeded;
        } else {
            console.error("Item data missing or invalid for player's current item.");
            return -1;
        }
    }
    return 0;
}

function getAttacker(damaged) {
    let attackers = enemy.filter(tmp => {
        let rule = {
            three: tmp.attacked
        }
        return rule.three;
    });
    return attackers;
}

function healer() {
    for (let i = 0; i < healthBased(); i++) {
        place(0, getAttackDir());
    }
}
function healer33() {
    for (let i = 0; i < healthBased(); i++) {
        place(0, getAttackDir());
    }
}
function healer1() {
    place(0, getAttackDir());
    return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
}

function noshameheal() {
    place(0, getAttackDir());
    if (player.shameCount >= 5) {
        place(0, getAttackDir());
        healer33();
    } else {
        if (player.skinIndex != 6 && player.skinIndex != 22) {
            healer33();
            buyEquip(6, 0);
        } else {
            const neededHealing = Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
            healer33();
            return neededHealing;
        }
    }
}

function antiSyncHealing() {
    if (my.antiSync) return;
    my.antiSync = true;
    const healAnti = setInterval(() => {
        const shameCount = player.shameCount;
        const attackDirection = getAttackDir();
        if (shameCount < 5) {
            place(0, attackDirection);
        } else {
            clearInterval(healAnti);
            my.antiSync = false;
        }
    }, 75);
    setTimeout(() => {
        clearInterval(healAnti);
        my.antiSync = false;
    }, game.tickRate);
}


function biomeGear(mover, returns) {
    const riverMinY = config.mapScale / 2 - config.riverWidth / 2;
    const riverMaxY = config.mapScale / 2 + config.riverWidth / 2;

    if (player.y2 >= riverMinY && player.y2 <= riverMaxY) {
        if (returns) return 31;
        buyEquip(31, 0);
        if (returns) return 0;
    }

    if (player.y2 <= config.snowBiomeTop) {
        if (returns) return (enemy && near.dist2 <= 300) ? 6 : 15;
        buyEquip(15, 0);
        if (returns) return 0;
    }

    const defaultEquip = (enemy && near.dist2 <= 300) ? 6 : 12;
    if (returns) return defaultEquip;
    buyEquip(defaultEquip, 0);

    if (returns) return 0;
}

class Traps {
    constructor(UTILS, items) {
        this.dist = 0;
        this.aim = 0;
        this.inTrap = false;
        this.replaced = false;
        this.antiTrapped = false;
        this.info = {};
        this.trappling = false;
        this.spikeplacer = false;
        this.spikePlaced = false;
        this.spikSync = false;

        this.notFast = function() {
            return player.weapons[1] === 10 && ((this.info.health > items.weapons[player.weapons[0]].dmg) || player.weapons[0] === 5);
        };

        this.testCanPlace = function(id, first = -(Math.PI / 2), repeat = Math.PI / 2, plus = Math.PI / 18, radian, replacer, yaboi) {
            try {
                let item = items.list[player.items[id]];
                let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                let counts = { attempts: 0, placed: 0 };
                let tmpObjects = [];

                liztobj.forEach(p => {
                    tmpObjects.push({
                        x: p.x,
                        y: p.y,
                        active: p.active,
                        blocker: p.blocker,
                        scale: p.scale,
                        isItem: p.isItem,
                        type: p.type,
                        colDiv: p.colDiv,
                        getScale: function(sM = 1, ig) {
                            return this.scale * ((this.isItem || [2, 3, 4].includes(this.type)) ? 1 : (0.6 * sM)) * (ig ? 1 : this.colDiv);
                        }
                    });
                });

                for (let i = first; i < repeat; i += plus) {
                    counts.attempts++;
                    let relAim = radian + i;
                    let tmpX = player.x2 + tmpS * Math.cos(relAim);
                    let tmpY = player.y2 + tmpS * Math.sin(relAim);
                    let cantPlace = tmpObjects.find(tmp => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                    if (cantPlace) continue;
                    if (item.id !== 18 && tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) continue;

                    if (!replacer && yaboi) {
                        if (yaboi.inTrap) {
                            if (UTILS.getAngleDist(near.aim2 + Math.PI, relAim + Math.PI) <= Math.PI * 1.3) {
                                place(2, relAim, 1);
                            } else {
                                player.items[4] === 15 && place(4, relAim, 1);
                            }
                        } else {
                            if (UTILS.getAngleDist(near.aim2, relAim) <= config.gatherAngle / 2.6) {
                                place(2, relAim, 1);
                            } else {
                                player.items[4] === 15 && place(4, relAim, 1);
                            }
                        }
                    } else {
                        place(id, relAim, 1);
                    }

                    tmpObjects.push({
                        x: tmpX,
                        y: tmpY,
                        active: true,
                        blocker: item.blocker,
                        scale: item.scale,
                        isItem: true,
                        type: null,
                        colDiv: item.colDiv,
                        getScale: function() {
                            return this.scale;
                        }
                    });

                    if (UTILS.getAngleDist(near.aim2, relAim) <= 1) {
                        counts.placed++;
                    }
                }

                if (counts.placed > 0 && replacer && item.dmg) {
                    if (near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8 && configs.spikeTick) {
                        instaC.canSpikeTick = true;
                    }
                }
            } catch (err) {
                console.error("Error in testCanPlace: ", err);
            }
        };

        this.checkSpikeTick = function() {
            try {
                if (![3, 4, 5].includes(near.primaryIndex)) return false;
                if ((getEl("safeAntiSpikeTick").checked || my.autoPush) ? false : near.primaryIndex === undefined ? true : near.reloads[near.primaryIndex] > game.tickRate) return false;

                if (near.dist2 <= items.weapons[near.primaryIndex || 5].range + near.scale * 1.8) {
                    let item = items.list[9];
                    let tmpS = near.scale + item.scale + (item.placeOffset || 0);
                    let danger = 0;
                    let counts = { attempts: 0, block: `unblocked` };

                    for (let i = -1; i <= 1; i += 1 / 10) {
                        counts.attempts++;
                        let relAim = UTILS.getDirect(player, near, 2, 2) + i;
                        let tmpX = near.x2 + tmpS * Math.cos(relAim);
                        let tmpY = near.y2 + tmpS * Math.sin(relAim);
                        let cantPlace = liztobj.find(tmp => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                        if (cantPlace) continue;
                        if (tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) continue;
                        danger++;
                        counts.block = `blocked`;
                        break;
                    }
                    if (danger) {
                        my.anti0Tick = 1;
                        return true;
                    }
                }
            } catch (err) {
                console.error("Error in checkSpikeTick: ", err);
            }
            return false;
        };

        this.protect = function(aim) {
            if (!configs.antiTrap) return;
            if (player.items[4]) {
                this.testCanPlace(4, -(Math.PI / 2), Math.PI / 2, Math.PI / 18, aim + Math.PI);
                this.antiTrapped = true;
            }
        };

        this.autoPlace = function() {
            if (enemy.length && configs.autoPlace && !instaC.ticking) {
                let nearTrap = gameObjects.find(obj => obj.trap && obj.active && obj.isTeamObject(player) && UTILS.getDist(obj, near, 0, 2) <= near.scale + obj.getScale() + 5);
                let nearDistance = UTILS.getDist(player, near, 0, 2);

                if (nearTrap && nearDistance <= 375) {
                    let safePlacement = nearDistance <= 200;
                    if (safePlacement) {
                        this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, near.aim2, 0, { inTrap: true });
                    } else if (player.items[4] === 15) {
                        this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, near.aim2);
                    }
                } else if (nearDistance <= 400 && player.items[4] === 15) {
                    this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, near.aim2);
                }
            }
        };

        this.replacer = function(findObj) {
            if (!findObj || !configs.autoReplace || !inGame || this.antiTrapped) return;

            game.tickBase(() => {
                let objAim = UTILS.getDirect(findObj, player, 0, 2);
                let objDst = UTILS.getDist(findObj, player, 0, 2);

                if (getEl("weaponGrind").checked && objDst <= items.weapons[player.weaponIndex].range + player.scale) return;

                if (objDst <= 250 && near.dist2 <= 250) {
                    let danger = this.checkSpikeTick();
                    if (!danger && near.dist3 <= items.weapons[near.primaryIndex || 5].range + near.scale * 1.8) {
                        for (let i = 0; i < 24; i++) {
                            let angle = (Math.PI * 2) * i / 24;
                            this.testCanPlace(2, angle, angle + Math.PI / 24, Math.PI / 24, objAim, 1);
                            this.testCanPlace(2, Math.PI / 2, Math.PI / 2, Math.PI / 2, near, objAim, 1);
                        }
                    } else if (player.items[4] === 15) {
                        this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, objAim, 1);
                    }

                    this.replaced = true;
                } else if (!this.spikePlaced && near.dist2 <= 250) {
                    for (let i = 0; i < 24; i++) {
                        let angle = (Math.PI * 2) * i / 24;
                        this.testCanPlace(2, angle, angle + Math.PI / 24, Math.PI / 24, objAim, 1);
                    }
                    this.spikePlaced = true;
                }
            }, 1);
        };
    }
}

class Instakill {
    constructor() {
        this.wait = false;
        this.can = false;
        this.isTrue = false;
        this.nobull = false;
        this.ticking = false;
        this.canSpikeTick = false;
        this.startTick = false;
        this.readyTick = false;
        this.canCounter = false;
        this.revTick = false;
        this.syncHit = false;

        this.changeType = function(type) {
            this.wait = false;
            this.isTrue = true;
            my.autoAim = true;
            near.backupNobull = false;

            const actions = {
                "rev": () => this.revInstakill(),
                "nobull": () => this.noBullInstakill(),
                "normal": () => this.normalInstakill(),
                "default": () => {
                    setTimeout(() => {
                        this.isTrue = false;
                        my.autoAim = false;
                    }, 50);
                }
            };

            (actions[type] || actions.default)();
        };

        this.revInstakill = function() {
            healer1();
            selectWeapon(player.weapons[1]);
            buyEquip(53, 0);
            sendAutoGather();
            setTimeout(() => {
                selectWeapon(player.weapons[0]);
                buyEquip(7, 0);
                setTimeout(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                }, 225);
            }, 100);
        };

        this.noBullInstakill = function() {
            selectWeapon(player.weapons[0]);
            healer1();
            buyEquip(7, 0);
            buyEquip(21, 1);
            sendAutoGather();
            setTimeout(() => {
                selectWeapon(player.weapons[1]);
                buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
                setTimeout(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                }, 255);
            }, 105);
        };

        this.normalInstakill = function() {
            selectWeapon(player.weapons[0]);
            healer1();
            buyEquip(7, 0);
            buyEquip(21, 1);
            sendAutoGather();
            setTimeout(() => {
                selectWeapon(player.weapons[1]);
                buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
                setTimeout(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                }, 255);
            }, 100);
        };

        this.spikeTickType = function() {
            this.isTrue = true;
            my.autoAim = true;
            selectWeapon(player.weapons[0]);
            buyEquip(7, 0);
            sendAutoGather();
            game.tickBase(() => {
                buyEquip(53, 0);
                selectWeapon(player.weapons[0]);
                buyEquip(53, 0);
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                    buyEquip(6, 0);
                    buyEquip(21, 1);
                }, 3);
            }, 1);
        };

        this.counterType = function() {
            this.isTrue = true;
            my.autoAim = true;
            my.revAim = true;
            if (!recording) {
                sendChat("");
            }
            selectWeapon(player.weapons[1]);
            buyEquip(53, 0);
            buyEquip(19, 1);
            sendAutoGather();
            packet("a", near.aim2, 1);
            game.tickBase(() => {
                my.revAim = false;
                selectWeapon(player.weapons[0]);
                buyEquip(7, 0);
                buyEquip(19, 1);
                packet("a", near.aim2, 1);
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                    packet("a", undefined, 1);
                }, 1);
            }, 1);
        };

        this.antiCounterType = function() {
            my.autoAim = true;
            this.isTrue = true;
            selectWeapon(player.weapons[0]);
            buyEquip(6, 0);
            buyEquip(21, 1);
            io.send("D", near.aim2);
            sendAutoGather();
            game.tickBase(() => {
                buyEquip(player.reloads[53] == 0 ? player.skins[53] ? 53 : 6 : 6, 0);
                buyEquip(21, 1);
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                }, 1);
            }, 1);
        };

        this.rangeType = function(type) {
            this.isTrue = true;
            my.autoAim = true;
            if (type === "ageInsta") {
                this.ageInstaKill();
            } else {
                this.rangeInstaKill();
            }
        };

        this.ageInstaKill = function() {
            my.ageInsta = false;
            if (player.items[5] === 18) {
                place(5, near.aim2);
            }
            packet("a", undefined, 1);
            buyEquip(22, 0);
            buyEquip(21, 1);
            game.tickBase(() => {
                selectWeapon(player.weapons[1]);
                buyEquip(53, 0);
                buyEquip(21, 1);
                sendAutoGather();
                game.tickBase(() => {
                    sendUpgrade(12);
                    selectWeapon(player.weapons[1]);
                    buyEquip(53, 0);
                    buyEquip(21, 1);
                    game.tickBase(() => {
                        sendUpgrade(15);
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        buyEquip(21, 1);
                        game.tickBase(() => {
                            sendAutoGather();
                            this.isTrue = false;
                            my.autoAim = false;
                        }, 1);
                    }, 1);
                }, 1);
            }, 1);
        };

        this.rangeInstaKill = function() {
            selectWeapon(player.weapons[1]);
            if (player.reloads[53] == 0 && near.dist2 <= 700 && near.skinIndex != 22) {
                buyEquip(53, 0);
            } else {
                buyEquip(20, 0);
            }
            buyEquip(11, 1);
            sendAutoGather();
            game.tickBase(() => {
                sendAutoGather();
                this.isTrue = false;
                my.autoAim = false;
            }, 1);
        };

        this.oneTickType = function() {
            io.send("7113213.29154");
            this.isTrue = true;
            my.autoAim = true;
            selectWeapon(player.weapons[1]);
            buyEquip(53, 0);
            buyEquip(19, 1);
            packet("a", near.aim2, 1);
            if (player.weapons[1] == 15) {
                my.revAim = true;
                sendAutoGather();
            }
            game.tickBase(() => {
                my.revAim = false;
                selectWeapon(player.weapons[0]);
                buyEquip(7, 0);
                buyEquip(19, 1);
                packet("a", near.aim2, 1);
                if (player.weapons[1] != 15) {
                    sendAutoGather();
                }
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                    packet("a", undefined, 1);
                }, 1);
            }, 1);
        };

        this.threeOneTickType = function() {
            io.send("Tick2");
            this.isTrue = true;
            my.autoAim = true;
            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
            biomeGear();
            buyEquip(19, 1);
            packet("a", near.aim2, 1);
            game.tickBase(() => {
                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                buyEquip(53, 0);
                buyEquip(19, 1);
                packet("a", near.aim2, 1);
                game.tickBase(() => {
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    buyEquip(19, 1);
                    sendAutoGather();
                    packet("a", near.aim2, 1);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                        packet("a", undefined, 1);
                    }, 1);
                }, 1);
            }, 1);
        };

        this.kmTickType = function() {
            this.isTrue = true;
            my.autoAim = true;
            my.revAim = true;
            selectWeapon(player.weapons[1]);
            buyEquip(53, 0);
            buyEquip(19, 1);
            sendAutoGather();
            packet("a", near.aim2, 1);
            game.tickBase(() => {
                my.revAim = false;
                selectWeapon(player.weapons[0]);
                buyEquip(7, 0);
                buyEquip(19, 1);
                packet("a", near.aim2, 1);
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                    packet("a", undefined, 1);
                }, 1);
            }, 1);
        };

        this.boostTickType = function() {
            this.isTrue = true;
            my.autoAim = true;
            biomeGear();
            buyEquip(19, 1);
            packet("a", near.aim2, 1);
            game.tickBase(() => {
                if (player.weapons[1] == 15) {
                    my.revAim = true;
                }
                selectWeapon(player.weapons[[9, 12, 13, 15].includes(player.weapons[1]) ? 1 : 0]);
                buyEquip(53, 0);
                buyEquip(19, 1);
                if ([9, 12, 13, 15].includes(player.weapons[1])) {
                    sendAutoGather();
                }
                packet("a", near.aim2, 1);
                place(4, near.aim2);
                game.tickBase(() => {
                    my.revAim = false;
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    buyEquip(19, 1);
                    if (![9, 12, 13, 15].includes(player.weapons[1])) {
                        sendAutoGather();
                    }
                    packet("a", near.aim2, 1);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                        packet("a", undefined, 1);
                    }, 1);
                }, 1);
            }, 1);
        };

        this.gotoGoal = function(goto, OT) {
            let slowDists = (weeeee) => weeeee * config.playerScale;
            let goal = {
                a: goto - OT,
                b: goto + OT,
                c: goto - slowDists(1),
                d: goto + slowDists(1),
                e: goto - slowDists(2),
                f: goto + slowDists(2),
                g: goto - slowDists(4),
                h: goto + slowDists(4)
            };
            let bQ = (wwww, awwww) => {
                if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2 && awwww == 0) {
                    buyEquip(31, 0);
                } else {
                    buyEquip(wwww, awwww);
                }
            };

            if (enemy.length) {
                let dst = near.dist2;
                this.ticking = true;
                if (dst >= goal.a && dst <= goal.b) {
                    bQ(22, 0);
                    bQ(11, 1);
                    if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                    }
                    return {
                        dir: undefined,
                        action: 1
                    };
                } else {
                    if (dst < goal.a) {
                        if (dst >= goal.g) {
                            if (dst >= goal.e) {
                                if (dst >= goal.c) {
                                    bQ(40, 0);
                                    bQ(10, 1);
                                    if (configs.none) {
                                        player.buildIndex != player.items[1] && selectToBuild(player.items[1]);
                                    } else {
                                        if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                        }
                                    }
                                } else {
                                    bQ(22, 0);
                                    bQ(19, 1);
                                    if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                    }
                                }
                            } else {
                                bQ(6, 0);
                                bQ(12, 1);
                                if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                }
                            }
                        } else {
                            biomeGear();
                            bQ(11, 1);
                            if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            }
                        }
                        return {
                            dir: near.aim2 + Math.PI,
                            action: 0
                        };
                    } else if (dst > goal.b) {
                        if (dst <= goal.h) {
                            if (dst <= goal.f) {
                                if (dst <= goal.d) {
                                    bQ(40, 0);
                                    bQ(9, 1);
                                    if (configs.none) {
                                        player.buildIndex != player.items[1] && selectToBuild(player.items[1]);
                                    } else {
                                        if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                        }
                                    }
                                } else {
                                    bQ(22, 0);
                                    bQ(19, 1);
                                    if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                    }
                                }
                            } else {
                                bQ(6, 0);
                                bQ(12, 1);
                                if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                }
                            }
                        } else {
                            biomeGear();
                            bQ(11, 1);
                            if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            }
                        }
                        return {
                            dir: near.aim2,
                            action: 0
                        };
                    }
                    return {
                        dir: undefined,
                        action: 0
                    };
                }
            } else {
                this.ticking = false;
                return {
                    dir: undefined,
                    action: 0
                };
            }
        };

        this.bowMovement = function() {
            let moveMent = this.gotoGoal(685, 3);
            if (moveMent.action) {
                if (player.reloads[53] == 0 && !this.isTrue) {
                    this.rangeType("ageInsta");
                } else {
                    packet("a", moveMent.dir, 1);
                }
            } else {
                packet("a", moveMent.dir, 1);
            }
        };

        this.tickMovement = function() {
            let moveMent = this.gotoGoal(238, 3);
            if (moveMent.action) {
                if (player.reloads[53] == 0 && !this.isTrue) {
                    this.boostTickType();
                } else {
                    packet("a", moveMent.dir, 1);
                }
            } else {
                packet("a", moveMent.dir, 1);
            }
        };

        this.kmTickMovement = function() {
            let moveMent = this.gotoGoal(240, 3);
            if (moveMent.action) {
                if (near.skinIndex != 22 && player.reloads[53] == 0 && !this.isTrue && ((game.tick - near.poisonTick) % config.serverUpdateRate == 8)) {
                    this.kmTickType();
                } else {
                    packet("a", moveMent.dir, 1);
                }
            } else {
                packet("a", moveMent.dir, 1);
            }
        };

        this.boostTickMovement = function() {
            let dist = player.weapons[1] == 9 ? 365 : player.weapons[1] == 12 ? 380 : player.weapons[1] == 13 ? 365 : player.weapons[1] == 15 ? 365 : 370;
            let moveMent = this.gotoGoal(372, 3);
            if (moveMent.action) {
                if (player.reloads[53] == 0 && !this.isTrue) {
                    this.boostTickType();
                } else {
                    packet("a", moveMent.dir, 1);
                }
            } else {
                packet("a", moveMent.dir, 1);
            }
        };

        this.perfCheck = function(pl, nr) {
            if (nr.weaponIndex == 11 && UTILS.getAngleDist(nr.aim2 + Math.PI, nr.d2) <= config.shieldAngle) return false;
            if (![9, 12, 13, 15].includes(player.weapons[1])) return true;
            let pjs = {
                x: nr.x2 + (65 * Math.cos(nr.aim2 + Math.PI)),
                y: nr.y2 + (65 * Math.sin(nr.aim2 + Math.PI))
            };
            if (UTILS.lineInRect(pl.x2 - pl.scale, pl.y2 - pl.scale, pl.x2 + pl.scale, pl.y2 + pl.scale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                return true;
            }
            let finds = ais.filter(tmp => tmp.visible).find((tmp) => {
                if (UTILS.lineInRect(tmp.x2 - tmp.scale, tmp.y2 - tmp.scale, tmp.x2 + tmp.scale, tmp.y2 + tmp.scale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                    return true;
                }
            });
            if (finds) return false;
            finds = liztobj.filter(tmp => tmp.active).find((tmp) => {
                let tmpScale = tmp.getScale();
                if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                    return true;
                }
            });
            if (finds) return false;
            return true;
        };
    }
}

class Autobuy {
    constructor(buyHat, buyAcc) {
        this.hat = function() {
            buyHat.forEach((id) => {
                let find = findID(hats, id);
                if (find && !player.skins[id] && player.points >= find.price) packet("c", 1, id, 0);
            });
        };
        this.acc = function() {
            buyAcc.forEach((id) => {
                let find = findID(accessories, id);
                if (find && !player.tails[id] && player.points >= find.price) packet("c", 1, id, 1);
            });
        };
    }
};


class Autoupgrade {
    constructor() {
        this.sb = function(upg) {
            upg(3);
            upg(17);
            upg(31);
            upg(23);
            upg(9);
            upg(38);
        };
        this.kh = function(upg) {
            upg(3);
            upg(17);
            upg(31);
            upg(23);
            upg(10);
            upg(38);
            upg(4);
            upg(25);
        };
        this.pb = function(upg) {
            upg(5);
            upg(17);
            upg(32);
            upg(23);
            upg(9);
            upg(38);
        };
        this.ph = function(upg) {
            upg(5);
            upg(17);
            upg(32);
            upg(23);
            upg(10);
            upg(38);
            upg(28);
            upg(25);
        };
        this.db = function(upg) {
            upg(7);
            upg(17);
            upg(31);
            upg(23);
            upg(9);
            upg(34);
        };
        this.km = function(upg) {
            upg(7);
            upg(17);
            upg(31);
            upg(23);
            upg(10);
            upg(38);
            upg(4);
            upg(15);
        };
    };
};

class Damages {
    constructor(items) {
        this.calcDmg = function(dmg, val) {
            return dmg * val;
        };
        this.getAllDamage = function(dmg) {
            return [this.calcDmg(dmg, 0.75), dmg, this.calcDmg(dmg, 1.125), this.calcDmg(dmg, 1.5)];
        };
        this.weapons = [];
        for (let i = 0; i < items.weapons.length; i++) {
            let wp = items.weapons[i];
            let name = wp.name.split(" ").length <= 1 ? wp.name : (wp.name.split(" ")[0] + "_" + wp.name.split(" ")[1]);
            this.weapons.push(this.getAllDamage(i > 8 ? wp.Pdmg : wp.dmg));
            this[name] = this.weapons[i];
        }
    }
}

let tmpList = [];
let UTILS = new Utils();
let items = new Items();
let objectManager = new Objectmanager(GameObject, gameObjects, UTILS, config);
let store = new Store();
let hats = store.hats;
let accessories = store.accessories;
let projectileManager = new ProjectileManager(Projectile, projectiles, players, ais, objectManager, items, config, UTILS);
let aiManager = new AiManager(ais, AI, players, items, null, config, UTILS);
let textManager = new Textmanager();

let traps = new Traps(UTILS, items);
let instaC = new Instakill();
let autoBuy = new Autobuy([40, 6, 7, 22, 53, 15, 31], [11, 21, 18, 13]);
let autoUpgrade = new Autoupgrade();

let lastDeath;
let minimapData;
let mapMarker = {};
let mapPings = [];
let tmpPing;

let antiinsta = true;
let antiinsta1 = false;

function sendChat(message) {
    packet("6", message.slice(0, 30));
}

let runAtNextTick = [];

function checkProjectileHolder(x, y, dir, range, speed, indx, layer, sid) {
    let weaponIndx = indx == 0 ? 9 : indx == 2 ? 12 : indx == 3 ? 13 : indx == 5 && 15;
    let projOffset = config.playerScale * 2;
    let projXY = {
        x: indx == 1 ? x : x - projOffset * Math.cos(dir),
        y: indx == 1 ? y : y - projOffset * Math.sin(dir),
    };
    let nearPlayer = players.filter((e) => e.visible && UTILS.getDist(projXY, e, 0, 2) <= e.scale).sort(function(a, b) {
        return UTILS.getDist(projXY, a, 0, 2) - UTILS.getDist(projXY, b, 0, 2);
    })[0];
    if (nearPlayer) {
        if (indx == 1) {
            nearPlayer.shooting[53] = 1;
        } else {
            nearPlayer.shootIndex = weaponIndx;
            nearPlayer.shooting[1] = 1;
            antiProj(nearPlayer, dir, range, speed, indx, weaponIndx);
        }
    }
}
let projectileCount = 0;

function antiProj(tmpObj, dir, range, speed, index, weaponIndex) {
    if (!tmpObj.isTeam(player)) {
        tmpDir = UTILS.getDirect(player, tmpObj, 2, 2);
        if (UTILS.getAngleDist(tmpDir, dir) <= 0.2) {
            tmpObj.bowThreat[weaponIndex]++;
            if (index == 5) {
                projectileCount++;
            }
            setTimeout(() => {
                tmpObj.bowThreat[weaponIndex]--;
                if (index == 5) {
                    projectileCount--;
                }
            }, range / speed);
            if (tmpObj.bowThreat[9] >= 1 && (tmpObj.bowThreat[12] >= 1 || tmpObj.bowThreat[15] >= 1)) {
                place(1, tmpObj.aim2);
                my.anti0Tick = 4;
                if (!recording) {
                    sendChat("");
                }
                if (!my.antiSync) {
                    antiSyncHealing(4);
                }
            } else {
                if (projectileCount >= 2) {
                    place(1, tmpObj.aim2);
                    healer();
                    if (!recording) {
                        sendChat("");
                    }
                    buyEquip(22, 0);
                    buyEquip(13, 1);
                    my.anti0Tick = 4;
                    if (!my.antiSync) {
                        antiSyncHealing(4);
                    }
                } else {
                    if (projectileCount === 1) {
                        buyEquip(6, 0);
                        buyEquip(13, 1);
                    } else {
                        if (projectileCount >= 2) {
                            return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
                            healer();
                            buyEquip(6, 0);
                        }
                    }
                }
            }
        }
    }
}

function showItemInfo(item, isWeapon, isStoreItem) {
    if (player && item) {
        UTILS.removeAllChildren(itemInfoHolder);
        itemInfoHolder.classList.add("visible");
        UTILS.generateElement({
            id: "itemInfoName",
            text: UTILS.capitalizeFirst(item.name),
            parent: itemInfoHolder
        });
        UTILS.generateElement({
            id: "itemInfoDesc",
            text: item.desc,
            parent: itemInfoHolder
        });
        if (isStoreItem) {

        } else if (isWeapon) {
            UTILS.generateElement({
                class: "itemInfoReq",
                text: !item.type ? "primary" : "secondary",
                parent: itemInfoHolder
            });
        } else {
            for (let i = 0; i < item.req.length; i += 2) {
                UTILS.generateElement({
                    class: "itemInfoReq",
                    html: item.req[i] + "<span class='itemInfoReqVal'> x" + item.req[i + 1] + "</span>",
                    parent: itemInfoHolder
                });
            }
            if (item.group.limit) {
                UTILS.generateElement({
                    class: "itemInfoLmt",
                    text: (player.itemCounts[item.group.id] || 0) + "/" + (config.isSandbox ? 99 : item.group.limit),
                    parent: itemInfoHolder
                });
            }
        }
    } else {
        itemInfoHolder.classList.remove("visible");
    }
}

window.addEventListener("resize", UTILS.checkTrusted(resize));

function resize() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    let scaleFillNative = Math.max(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight) * pixelDensity;
    gameCanvas.width = screenWidth * pixelDensity;
    gameCanvas.height = screenHeight * pixelDensity;
    gameCanvas.style.width = screenWidth + "px";
    gameCanvas.style.height = screenHeight + "px";
    mainContext.setTransform(
        scaleFillNative, 0,
        0, scaleFillNative,
        (screenWidth * pixelDensity - (maxScreenWidth * scaleFillNative)) / 2,
        (screenHeight * pixelDensity - (maxScreenHeight * scaleFillNative)) / 2
    );
}
resize();

var usingTouch;
const mals = document.getElementById('touch-controls-fullscreen');
mals.style.display = 'block';
mals.addEventListener("mousemove", gameInput, false);

function gameInput(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}
let clicks = {
    left: false,
    middle: false,
    right: false,
};
mals.addEventListener("mousedown", mouseDown, false);

function mouseDown(e) {
    if (attackState != 1) {
        attackState = 1;
        if (e.button == 0) {
            clicks.left = true;
        } else if (e.button == 1) {
            clicks.middle = true;
        } else if (e.button == 2) {
            clicks.right = true;
        }
    }
}
mals.addEventListener("mouseup", UTILS.checkTrusted(mouseUp));

function mouseUp(e) {
    if (attackState != 0) {
        attackState = 0;
        if (e.button == 0) {
            clicks.left = false;
        } else if (e.button == 1) {
            clicks.middle = false;
        } else if (e.button == 2) {
            clicks.right = false;
        }
    }
}
mals.addEventListener("wheel", wheel, false);

function wheel(e) {
    if(player.shameCount > 1) {
        buyEquip(7, 0);
    } else {
        buyEquip(6, 0);
    }
}


function getMoveDir() {
    let dx = 0;
    let dy = 0;
    for (let key in moveKeys) {
        let tmpDir = moveKeys[key];
        dx += !!keys[key] * tmpDir[0];
        dy += !!keys[key] * tmpDir[1];
    }
    return dx == 0 && dy == 0 ? undefined : Math.atan2(dy, dx);
}

function getSafeDir() {
    if (!player) {
        return 0;
    }
    if (!player.lockDir) {
        lastDir = Math.atan2(mouseY - (screenHeight / 2), mouseX - (screenWidth / 2));
    }
    return lastDir || 0;
}

let plusDir = 0;
let lastSpin = Date.now();

function getAttackDir() {
    const now = Date.now();

    if (player && now - lastSpin >= 235 && !(clicks.right || clicks.left)) {
        plusDir += Math.random() * (Math.PI * 2);
        lastSpin = now;
    }

    if (!player) {
        return "0";
    }

    const primaryWeapon = player.weapons[0];
    const secondaryWeapon = player.weapons[1];
    const primaryReload = player.reloads[primaryWeapon];
    const secondaryReload = player.reloads[secondaryWeapon];
    const primaryInRange = near.dist2 <= items.weapons[primaryWeapon].range + near.scale * 1.8;

    function getBestTargetDirection() {
        if (enemy.length) {
            return near.aim2;
        }
        return getSafeDir();
    }

    if (my.autoAim || (clicks.left || (useWasd && primaryInRange && !traps.inTrap)) && primaryReload === 0) {
        lastDir = getBestTargetDirection();
    } else if (clicks.right && (secondaryWeapon === 10 ? secondaryReload : primaryReload) === 0) {
        lastDir = getSafeDir();
    } else if (traps.inTrap) {
        lastDir = traps.aim;
    } else if (!player.lockDir) {
        if (!autos.stopspin || !useWasd) {
            lastDir = getSafeDir();
        }
    }

    lastDir = smoothTransition(lastDir);

    return lastDir;
}

function smoothTransition(targetDir) {
    const smoothingFactor = 0.1;
    return (1 - smoothingFactor) * lastDir + smoothingFactor * targetDir;
}

function getVisualDir() {
    if (!player) {
        return 0;
    }
    lastDir = getSafeDir();
    return lastDir || 0;
}

function keysActive() {
    return (allianceMenu.style.display != "block" &&
            chatHolder.style.display != "block");
}

function keyDown(event) {
    let keyNum = event.which || event.keyCode || 0;
    if (player && player.alive && keysActive()) {
        if (!keys[keyNum]) {
            keys[keyNum] = 1;
            macro[event.key] = 1;
            if (keyNum == 27) {
                openMenu = !openMenu;
                $("#menuDiv").toggle();
            } else if (keyNum == 109) {
                recording = !recording;
                console.log(recording);
            } else if (keyNum == 69) {
                sendAutoGather();
            } else if (keyNum == 67) {
                updateMapMarker();
            } else if (player.weapons[keyNum - 49] != undefined) {
                player.weaponCode = player.weapons[keyNum - 49];
            } else if (moveKeys[keyNum]) {
                sendMoveDir();
            } else if (event.key == "m") {
                mills.placeSpawnPads = !mills.placeSpawnPads;
            } else if (event.key == "z") {
                mills.place = !mills.place;
            } else if (event.key == "Z") {
                typeof window.debug == "function" && window.debug();
            } else if (keyNum == 32) {
                packet("d", 1, getSafeDir(), 1);
                packet("d", 0, getSafeDir(), 1);
            }
        }
    }
}

addEventListener("keydown", UTILS.checkTrusted(keyDown));

function keyUp(event) {
    if (player && player.alive) {
        let keyNum = event.which || event.keyCode || 0;
        if (keysActive()) {
            if (keys[keyNum]) {
                keys[keyNum] = 0;
                macro[event.key] = 0;
                if (moveKeys[keyNum]) {
                    sendMoveDir();
                } else if (event.key == ",") {
                    player.sync = false;
                }
            }
        }
    }
}


window.addEventListener("keyup", UTILS.checkTrusted(keyUp));

function sendMoveDir() {
    if(found) {
        packet("a", undefined, 1);
    } else {
        let newMoveDir = getMoveDir();
        if (lastMoveDir == undefined || newMoveDir == undefined || Math.abs(newMoveDir - lastMoveDir) > 0.3) {
            if (!my.autoPush && !found) {
                packet("a", newMoveDir, 1);
            }
            lastMoveDir = newMoveDir;
        }
    }
}

function bindEvents() {}
bindEvents();

let isItemSetted = [];

function updateItemCountDisplay(index = undefined) {
    for (let i = 3; i < items.list.length; ++i) {
        let id = items.list[i].group.id;
        let tmpI = items.weapons.length + i;
        if (!isItemSetted[tmpI]) {
            isItemSetted[tmpI] = document.createElement("div");
            isItemSetted[tmpI].id = "itemCount" + tmpI;
            getEl("actionBarItem" + tmpI).appendChild(isItemSetted[tmpI]);
            isItemSetted[tmpI].style = `
                        display: block;
                        position: absolute;
                        padding-left: 5px;
                        font-size: 2em;
                        color: #fff;
                        `;
            isItemSetted[tmpI].innerHTML = player.itemCounts[id] || 0;
        } else {
            if (index == id) isItemSetted[tmpI].innerHTML = player.itemCounts[index] || 0;
        }
    }
}

var retrappable = false;
function autoPush() {
    retrappable = true;
    let nearTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 5)).sort(function(a, b) {
        return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
    })[0];
    if (nearTrap) {
        let spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, nearTrap, 0, 0) <= (near.scale + nearTrap.scale + tmp.scale)).sort(function(a, b) {
            return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
        })[0];
        if (spike) {
            let pos = {
                x: spike.x + (250 * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                y: spike.y + (250 * Math.sin(UTILS.getDirect(near, spike, 2, 0))),
                x2: spike.x + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                y2: spike.y + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.sin(UTILS.getDirect(near, spike, 2, 0)))
            };
            let finds = gameObjects.filter(tmp => tmp.active).find((tmp) => {
                let tmpScale = tmp.getScale();
                if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, player.x2, player.y2, pos.x2, pos.y2)) {
                    return true;
                }
            });
            if (finds) {
                if (my.autoPush) {
                    my.autoPush = false;
                    packet("a", lastMoveDir || undefined, 1);
                }
            } else {
                my.autoPush = true;
                my.pushData = {
                    x: spike.x,
                    y: spike.y,
                    x2: pos.x2,
                    y2: pos.y2
                };
                let scale = (player.scale / 10);
                if (UTILS.lineInRect(player.x2 - scale, player.y2 - scale, player.x2 + scale, player.y2 + scale, near.x2, near.y2, pos.x, pos.y)) {
                    packet("a", near.aim2, 1);
                } else {
                    packet("a", UTILS.getDirect(pos, player, 2, 2), 1);
                }
            }
        } else {
            if (my.autoPush) {
                my.autoPush = false;
                packet("a", lastMoveDir || undefined, 1);
            }
        }
    } else {
        if (my.autoPush) {
            my.autoPush = false;
            packet("a", lastMoveDir || undefined, 1);
        }
    }
}

function addDeadPlayer(tmpObj) {
    deadPlayers.push(new DeadPlayer(tmpObj.x, tmpObj.y, tmpObj.dir, tmpObj.buildIndex, tmpObj.weaponIndex, tmpObj.weaponVariant, tmpObj.skinColor, tmpObj.scale, tmpObj.name));
}


function setInitData(data) {
    alliances = data.teams;
}

function setupGame(yourSID) {
    keys = {};
    macro = {};
    playerSID = yourSID;
    attackState = 0;
    inGame = true;
    musicToggle()
    packet("d", 0, getAttackDir(), 1);
    my.ageInsta = true;
    if (firstSetup) {
        firstSetup = false;
        gameObjects.length = 0;
        liztobj.length = 0;
    }
}

let originalName = null;

function addPlayer(data, isYou) {
    let tmpPlayer = findPlayerByID(data[0]);
    if (!tmpPlayer) {
        tmpPlayer = new Player(data[0], data[1], config, UTILS, projectileManager,
                               objectManager, players, ais, items, hats, accessories);
        players.push(tmpPlayer);
    }
    tmpPlayer.spawn(isYou ? true : null);
    tmpPlayer.visible = false;
    tmpPlayer.oldPos = {
        x2: undefined,
        y2: undefined
    };
    tmpPlayer.x2 = undefined;
    tmpPlayer.y2 = undefined;
    tmpPlayer.x3 = undefined;
    tmpPlayer.y3 = undefined;
    tmpPlayer.setData(data);
    if (isYou) {
        if (!player) {
            window.prepareUI(tmpPlayer);
        }
        player = tmpPlayer;
        camX = player.x;
        camY = player.y;
        originalName = player.name;
        my.lastDir = 0;
        updateItems();
        updateAge();
        updateItemCountDisplay();
        if (player.skins[7]) {
            my.reSync = true;
        }
    }
}

function removePlayer(id) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == id) {
            players.splice(i, 1);
            break;
        }
    }
}

function updateHealth(sid, value) {
    let tmpObj = findPlayerBySID(sid);
    if (tmpObj) {
        tmpObj.oldHealth = tmpObj.health;
        tmpObj.health = value;
        tmpObj.judgeShame();

        if (tmpObj.oldHealth > tmpObj.health) {
            tmpObj.timeDamaged = Date.now();
            tmpObj.damaged = tmpObj.oldHealth - tmpObj.health;
            let damaged = tmpObj.damaged;

            if (tmpObj.health <= 0 && !tmpObj.death) {
                tmpObj.death = true;
                addDeadPlayer(tmpObj);
            }

            if (tmpObj === player) {
                handlePlayerDamage(tmpObj, damaged);
            } else {
                handleNonPlayerDamage(tmpObj);
            }
        }
    }
}

function handlePlayerDamage(player, damaged) {
    let bullTicked = false;
    let autoheal = false;
    let antiinsta = true, antiinsta1 = true, antiinsta4 = true;

    if(player.shameCount > 1) {
        buyEquip(7, 0);
        buyEquip(13, 1);
    } else {
        if(player.lastshamecount != 1 || player.lastshamecount != 2 || player.lastshamecount != 3 || player.lastshamecount != 4 || player.lastshamecount != 5 || player.lastshamecount != 6 || player.lastshamecount == 0) {
            buyEquip(6, 0);
        }
    }

    if (inGame) {
        let attackers = getAttacker(damaged);
        let gearDmgs = [0.25, 0.45].map((val) => val * items.weapons[player.weapons[0]].dmg);
        let includeSpikeDmgs = near.length ? !bullTicked && (gearDmgs.includes(damaged) && near[0].skinIndex == 11 && near[0].tailIndex == 21) : false;
        let healTimeout = 140 - window.ping;

        if (damaged >= 0 && damaged <= 66 && player.shameCount === 4 && player.primaryIndex !== "4") {
            autoheal = true;
            antiinsta = false;
            antiinsta1 = false;
            antiinsta4 = false;
        } else {
            if (player.shameCount !== 4) {
                autoheal = false;
                antiinsta = true;
                antiinsta4 = true;
            }
        }

        if (damaged <= 66 && player.shameCount === 3 && player.primaryIndex !== "4") {
            antiinsta = false;
        } else {
            if (player.shameCount !== 3) {
                antiinsta = true;
            }
        }

        if (damaged <= 66 && player.shameCount === 4 && player.primaryIndex !== "4") {
            antiinsta1 = true;
        } else {
            if (player.shameCount !== 4) {
                antiinsta1 = false;
            }
        }

        if (damaged >= 0 && damaged <= 90 && player.shameCount === 2) {
            antiinsta4 = false;
        } else {
            if (player.shameCount !== 3) {
                antiinsta4 = true;
            }
        }

        if (damaged >= 0 && damaged <= 90 && !antiinsta) {
            if (player.shameCount === 3) {
                antiinsta1 = true;
            } else {
                antiinsta1 = false;
            }
        }

        if (damaged <= 66 && player.skinIndex != 6 && enemy.weaponIndex === 4) {
            game.tickBase(() => {
                healer1();
            }, 2);
        }

        if (damaged >= (includeSpikeDmgs ? 8 : 20) && player.damageThreat >= 20 && antiinsta4 && (game.tick - player.antiTimer) > 1) {
            if (player.reloads[53] == 0 && player.reloads[player.weapons[1]] == 0) {
                player.canEmpAnti = true;
            } else {
                player.soldierAnti = true;
            }
            player.antiTimer = game.tick;
            let shame = player.weapons[0] == 4 ? 2 : 5;
            if (player.shameCount < shame) {
                healer();
            } else {
                game.tickBase(() => {
                    healer();
                }, 2);
            }
            if (damaged >= (includeSpikeDmgs ? 8 : 20) && player.damageThreat >= 20 && autoheal) {
                setTimeout(() => {
                    healer();
                }, 120);
            }
        } else {
            game.tickBase(() => {
                healer();
            }, 2);
        }

        if (damaged >= 20 && player.skinIndex == 11 && player.shameCount <= 3) {
            instaC.canCounter = true;
        }
    }
}

function handleNonPlayerDamage(tmpObj) {
    if (!tmpObj.setPoisonTick && (tmpObj.damaged == 5 || (tmpObj.latestTail == 13 && tmpObj.damaged == 2))) {
        tmpObj.setPoisonTick = true;
    }
}

function killPlayer(sid) {
    inGame = false;
    lastDeath = {
        x: player.x,
        y: player.y,
    };
    musicToggle();
}

function updateItemCounts(index, value) {
    if (player) {
        player.itemCounts[index] = value;
        updateItemCountDisplay(index);
    }
}

function updateAge(xp, mxp, age) {
    if (xp != undefined) {
        player.XP = xp;
    }
    if (mxp != undefined) {
        player.maxXP = mxp;
    }
    if (age != undefined) {
        player.age = age;
    }
}

function updateUpgrades(points, age) {
    player.upgradePoints = points;
    player.upgrAge = age;
    if (points > 0) {
        tmpList.length = 0;
        UTILS.removeAllChildren(upgradeHolder);
        for (let i = 0; i < items.weapons.length; ++i) {
            if (items.weapons[i].age == age && (items.weapons[i].pre == undefined || player.weapons.indexOf(items.weapons[i].pre) >= 0)) {
                let e = UTILS.generateElement({
                    id: "upgradeItem" + i,
                    class: "actionBarItem",
                    onmouseout: function() {
                        showItemInfo();
                    },
                    parent: upgradeHolder
                });
                e.style.backgroundImage = getEl("actionBarItem" + i).style.backgroundImage;
                tmpList.push(i);
            }
        }
        for (let i = 0; i < items.list.length; ++i) {
            if (items.list[i].age == age && (items.list[i].pre == undefined || player.items.indexOf(items.list[i].pre) >= 0)) {
                let tmpI = (items.weapons.length + i);
                let e = UTILS.generateElement({
                    id: "upgradeItem" + tmpI,
                    class: "actionBarItem",
                    onmouseout: function() {
                        showItemInfo();
                    },
                    parent: upgradeHolder
                });
                e.style.backgroundImage = getEl("actionBarItem" + tmpI).style.backgroundImage;
                tmpList.push(tmpI);
            }
        }
        for (let i = 0; i < tmpList.length; i++) {
            (function(i) {
                let tmpItem = getEl('upgradeItem' + i);
                tmpItem.onmouseover = function() {
                    if (items.weapons[i]) {
                        showItemInfo(items.weapons[i], true);
                    } else {
                        showItemInfo(items.list[i - items.weapons.length]);
                    }
                };
                tmpItem.onclick = UTILS.checkTrusted(function() {
                    packet("H", i);
                });
                UTILS.hookTouchEvents(tmpItem);
            })(tmpList[i]);
        }
        if (tmpList.length) {
            upgradeHolder.style.display = "block";
            upgradeCounter.style.display = "block";
            upgradeCounter.innerHTML = "SELECT ITEMS (" + points + ")";
        } else {
            upgradeHolder.style.display = "none";
            upgradeCounter.style.display = "none";
            showItemInfo();
        }
    } else {
        upgradeHolder.style.display = "none";
        upgradeCounter.style.display = "none";
        showItemInfo();
    }
}

const killObject = (sid) => {
    const findObj = findObjectBySid(sid);
    objectManager.disableBySid(sid);

    if (!player) return;

    const index = breakObjects.findIndex(obj => obj.sid === sid);
    if (index !== -1) {
        breakObjects.splice(index, 1);
    }

    traps.replacer(findObj);
};

function killObjects(sid) {
    if (player) objectManager.removeAllItems(sid);
}

function setTickout(doo, timeout) {
    if (!ticks.manage[ticks.tick + timeout]) {
        ticks.manage[ticks.tick + timeout] = [doo];
    } else {
        ticks.manage[ticks.tick + timeout].push(doo);
    }
}

function caf(e, t) {
    try {
        return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
    } catch (e) {
        return 0;
    }
}

let found = false;
let autoQ = false;

let autos = {
    insta: {
        todo: false,
        wait: false,
        count: 4,
        shame: 5
    },
    bull: false,
    antibull: 0,
    reloaded: false,
    stopspin: true
}

const inGameAudio = new Audio("https://cdn.discordapp.com/attachments/1254124674158297131/1254162245781553162/Mesmerizer.MP3?ex=667b201c&is=6679ce9c&hm=61133eb8e6729d6e288168f0f26676122f722daada7adf114f94b1ef72cb2501&");
const outGameAudio = new Audio("https://cdn.discordapp.com/attachments/1254124674158297131/1254157684811235420/-_Nostalgic_Arrange.mp3?ex=667a731d&is=6679219d&hm=0c248a31c01dc5a56da543529d2356e5ca133e30e29faccddafb2d539bfbaf9e&");
inGameAudio.loop = true;
outGameAudio.loop = true;
outGameAudio.autoplay = true;

function fadeOut(audio, callback) {
    let volume = audio.volume;
    const fadeInterval = setInterval(() => {
        if (volume >= 0.4) {
            volume -= 0.02;
            audio.volume = Math.max(volume, 0).toFixed(1);
        } else {
            clearInterval(fadeInterval);
            audio.pause();
            audio.volume = 0.4;
            if (callback) callback();
        }
    }, 30);
}

function fadeIn(audio) {
    let volume = 0;
    audio.volume = volume;
    audio.play();
    const fadeInterval = setInterval(() => {
        if (volume <= 0.4) {
            volume += 0.02;
            audio.volume = Math.min(volume, 1).toFixed(1);
        } else {
            clearInterval(fadeInterval);
            audio.volume = 0.4;
        }
    }, 30);
}

function musicToggle() {
    if (inGame) {
        fadeOut(outGameAudio, () => fadeIn(inGameAudio));
    } else {
        fadeOut(inGameAudio, () => fadeIn(outGameAudio));
    }
}

function updatePlayers(data) {
    const shameCounts = [1, 2, 3, 4, 5, 6];
    if (player.shameCount > 1) {
        buyEquip(7, 0);
        buyEquip(13, 1);
    } else {
        if (!shameCounts.includes(player.lastshamecount) || player.lastshamecount === 0) {
            buyEquip(6, 0);
        }
    }
    player.lastshamecount = player.shameCount;
    function getAngleDifference(angle1, angle2) {
        angle1 = angle1 % (2 * Math.PI);
        angle2 = angle2 % (2 * Math.PI);
        let diff = Math.abs(angle1 - angle2);
        if (diff > Math.PI) {
            diff = (2 * Math.PI) - diff;
        }
        return diff;
    }
    game.tick++;
    enemy = [];
    nears = [];
    near = [];
    game.tickSpeed = performance.now() - game.lastTick;
    game.lastTick = performance.now();
    players.forEach((tmp) => {
        tmp.forcePos = !tmp.visible;
        tmp.visible = false;
        if((tmp.timeHealed - tmp.timeDamaged)>0 && tmp.lastshamecount<tmp.shameCount) {
            tmp.pinge = (tmp.timeHealed - tmp.timeDamaged);
        }
    });
    for (let i = 0; i < data.length;) {
        tmpObj = findPlayerBySID(data[i]);
        if (tmpObj) {
            tmpObj.t1 = (tmpObj.t2 === undefined) ? game.lastTick : tmpObj.t2;
            tmpObj.t2 = game.lastTick;
            tmpObj.oldPos.x2 = tmpObj.x2;
            tmpObj.oldPos.y2 = tmpObj.y2;
            tmpObj.x1 = tmpObj.x;
            tmpObj.y1 = tmpObj.y;
            tmpObj.x2 = data[i + 1];
            tmpObj.y2 = data[i + 2];
            tmpObj.x3 = tmpObj.x2 + (tmpObj.x2 - tmpObj.oldPos.x2);
            tmpObj.y3 = tmpObj.y2 + (tmpObj.y2 - tmpObj.oldPos.y2);
            tmpObj.d1 = (tmpObj.d2 === undefined) ? data[i + 3] : tmpObj.d2;
            tmpObj.d2 = data[i + 3];
            tmpObj.dt = 0;
            tmpObj.buildIndex = data[i + 4];
            tmpObj.weaponIndex = data[i + 5];
            tmpObj.weaponVariant = data[i + 6];
            tmpObj.team = data[i + 7];
            tmpObj.isLeader = data[i + 8];
            tmpObj.oldSkinIndex = tmpObj.skinIndex;
            tmpObj.oldTailIndex = tmpObj.tailIndex;
            tmpObj.skinIndex = data[i + 9];
            tmpObj.tailIndex = data[i + 10];
            tmpObj.iconIndex = data[i + 11];
            tmpObj.zIndex = data[i + 12];
            tmpObj.visible = true;
            tmpObj.update(game.tickSpeed);
            tmpObj.dist2 = UTILS.getDist(tmpObj, player, 2, 2);
            tmpObj.aim2 = UTILS.getDirect(tmpObj, player, 2, 2);
            tmpObj.dist3 = UTILS.getDist(tmpObj, player, 3, 3);
            tmpObj.aim3 = UTILS.getDirect(tmpObj, player, 3, 3);
            tmpObj.damageThreat = 0;
            if (tmpObj.skinIndex == 45 && tmpObj.shameTimer <= 0) {
                tmpObj.addShameTimer();
            }
            if (tmpObj.oldSkinIndex == 45 && tmpObj.skinIndex != 45) {
                tmpObj.shameTimer = 0;
                tmpObj.shameCount = 0;
                if (tmpObj == player) {
                    healer();
                }
            }

            if (player.shameCount < 4 && near.dist3 <= 300 && near.reloads[near.primaryIndex] <= game.tickRate * (window.pingTime >= 130 ? 2 : 1)) {
                autoQ = true;
                healer();
            } else {
                if (autoQ) {
                    healer();
                }
                autoQ = false;
            }


            if (tmpObj == player) {
                if (liztobj.length) {
                    liztobj.forEach((tmp) => {
                        tmp.onNear = false;
                        if (tmp.active) {
                            if (!tmp.onNear && UTILS.getDist(tmp, tmpObj, 0, 2) <= tmp.scale + items.weapons[tmpObj.weapons[0]].range) {
                                tmp.onNear = true;
                            }
                            if (tmp.isItem && tmp.owner) {
                                if (!tmp.pps && tmpObj.sid == tmp.owner.sid && UTILS.getDist(tmp, tmpObj, 0, 2) > (parseInt(getEl("breakRange").value) || 0) && !tmp.breakObj && ![13, 14, 20].includes(tmp.id)) {
                                    tmp.breakObj = true;
                                    breakObjects.push({
                                        x: tmp.x,
                                        y: tmp.y,
                                        sid: tmp.sid
                                    });
                                }
                            }
                        }
                    });
                    let nearTrap = liztobj.filter(e => e.trap && e.active && UTILS.getDist(e, tmpObj, 0, 2) <= (tmpObj.scale + e.getScale() + 25) && !e.isTeamObject(tmpObj)).sort(function(a, b) {
                        return UTILS.getDist(a, tmpObj, 0, 2) - UTILS.getDist(b, tmpObj, 0, 2);
                    })[0];
                    if (nearTrap) {
                        let spike = gameObjects.filter(obj => obj.dmg && cdf(tmpObj, obj) <= tmpObj.scale + nearTrap.scale/2 && !obj.isTeamObject(tmpObj) && obj.active)[0]
                        traps.dist = UTILS.getDist(nearTrap, tmpObj, 0, 2);
                        traps.aim = UTILS.getDirect(spike ? spike : nearTrap, tmpObj, 0, 2);
                        traps.protect(caf(nearTrap, tmpObj) - Math.PI);
                        traps.inTrap = true;
                        traps.info = nearTrap;
                    } else {
                        traps.inTrap = false;
                        traps.info = {};
                    }
                } else {
                    traps.inTrap = false;
                }
            }
            if (tmpObj.weaponIndex < 9) {
                tmpObj.primaryIndex = tmpObj.weaponIndex;
                tmpObj.primaryVariant = tmpObj.weaponVariant;
            } else if (tmpObj.weaponIndex > 8) {
                tmpObj.secondaryIndex = tmpObj.weaponIndex;
                tmpObj.secondaryVariant = tmpObj.weaponVariant;
            }
        }
        i += 13;
    }
    if (textManager.stack.length) {
        let stacks = [];
        let notstacks = [];
        let num = 0;
        let num2 = 0;
        let pos = {
            x: null,
            y: null
        };
        let pos2 = {
            x: null,
            y: null
        }
        textManager.stack.forEach((text) => {
            if (text.value >= 0) {
                if (num == 0) pos = {
                    x: text.x,
                    y: text.y
                };
                num += Math.abs(text.value);
            } else {
                if (num2 == 0) pos2 = {
                    x: text.x,
                    y: text.y
                };
                num2 += Math.abs(text.value);
            }
        });
        if (num2 > 0) {
            textManager.showText(pos2.x, pos2.y, Math.max(45, Math.min(50, num2)), 0.18, 500, num2, "#8ecc51");
        }
        if (num > 0) {
            textManager.showText(pos.x, pos.y, Math.max(45, Math.min(50, num)), 0.18, 500, num, "#fff");
        }
        textManager.stack = [];
    }
    if (runAtNextTick.length) {
        runAtNextTick.forEach((tmp) => {
            checkProjectileHolder(...tmp);
        });
        runAtNextTick = [];
    }
    for (let i = 0; i < data.length;) {
        tmpObj = findPlayerBySID(data[i]);
        if (tmpObj) {
            if (!tmpObj.isTeam(player)) {
                enemy.push(tmpObj);
                if (tmpObj.dist2 <= items.weapons[tmpObj.primaryIndex == undefined ? 5 : tmpObj.primaryIndex].range + (player.scale * 2)) {
                    nears.push(tmpObj);
                }
            }
            tmpObj.manageReload();
            if (tmpObj != player) {
                tmpObj.addDamageThreat(player);
            }
        }
        i += 13;
    }
    if (player && player.alive) {
        if (enemy.length) {
            near = enemy.sort(function(tmp1, tmp2) {
                return tmp1.dist2 - tmp2.dist2;
            })[0];
        }
        if (game.tickQueue[game.tick]) {
            game.tickQueue[game.tick].forEach((action) => {
                action();
            });
            game.tickQueue[game.tick] = null;
        }
        players.forEach((tmp) => {
            if (!tmp.visible && player != tmp) {
                tmp.reloads = {
                    0: 0,
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0,
                    7: 0,
                    8: 0,
                    9: 0,
                    10: 0,
                    11: 0,
                    12: 0,
                    13: 0,
                    14: 0,
                    15: 0,
                    53: 0,
                };
            }
            if (tmp.setBullTick) {
                tmp.bullTimer = 0;
            }
            if (tmp.setPoisonTick) {
                tmp.poisonTimer = 0;
            }
            tmp.updateTimer();
        });
        if (inGame) {
            if (enemy.length) {
                if (player.canEmpAnti) {
                    player.canEmpAnti = false;
                    if (near.dist2 <= 300 && !my.safePrimary(near) && !my.safeSecondary(near)) {
                        if (near.reloads[53] == 0) {
                            player.empAnti = true;
                            player.soldierAnti = false;
                        } else {
                            player.empAnti = false;
                            player.soldierAnti = true;
                        }
                    }
                }
                let prehit = liztobj.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 3) <= (tmp.scale + near.scale)).sort(function(a, b) {
                    return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                })[0];
                if (prehit) {
                    if (near.dist3 <= items.weapons[player.weapons[0]].range + player.scale * 1.8 && configs.predictTick) {
                        instaC.canSpikeTick = true;
                        instaC.syncHit = true;
                        if (configs.revTick && player.weapons[1] == 15 && player.reloads[53] == 0 && instaC.perfCheck(player, near)) {
                            instaC.revTick = true;
                        }
                    }
                }
                let antiSpikeTick = liztobj.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + player.scale)).sort(function(a, b) {
                    return UTILS.getDist(a, player, 0, 2) - UTILS.getDist(b, player, 0, 2);
                })[0];
                if (antiSpikeTick && !traps.inTrap) {
                    if (near.dist3 <= items.weapons[5].range + near.scale * 1.8) {
                        my.anti0Tick = 1;
                    }
                }
            }
            if ((useWasd ? true : ((player.checkCanInsta(true) >= 100 ? player.checkCanInsta(true) : player.checkCanInsta(false)) >= (player.weapons[1] == 10 ? 95 : 100))) && near.dist2 <= items.weapons[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]].range + near.scale * 1.8 && (instaC.wait || (useWasd && Math.floor(Math.random() * 5) == 0)) && !instaC.isTrue && !my.waitHit && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && (useWasd ? true : getEl("instaType").value == "oneShot" ? (player.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate)) : true) && instaC.perfCheck(player, near)) {
                if (player.checkCanInsta(true) >= 100) {
                    instaC.nobull = useWasd ? false : instaC.canSpikeTick ? false : true;
                } else {
                    instaC.nobull = false;
                }
                instaC.can = true;
            } else {
                instaC.can = false;
            }
            macro.q && place(0, getAttackDir());
            macro.f && place(4, getSafeDir());
            macro.v && place(2, getSafeDir());
            macro.y && place(5, getSafeDir());
            macro.h && place(player.getItemType(22), getSafeDir());
            macro.n && place(3, getSafeDir());
            if (game.tick % 1 == 0) {
                if (mills.place) {
                    let plcAng = 7.7;
                    for (let i = -plcAng; i <= plcAng; i += plcAng) {
                        checkPlace(3, UTILS.getDirect(player.oldPos, player, 2, 2) + i);
                    }
                } else {
                    if (mills.placeSpawnPads) {
                        for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                            checkPlace(player.getItemType(20), UTILS.getDirect(player.oldPos, player, 2, 2) + i);
                        }
                    }
                }
            }
            if (instaC.can) {
                instaC.changeType(player.weapons[1] == 10 ? "rev" : "normal");
            }
            if (instaC.canCounter) {
                instaC.canCounter = false;
                if (player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                    instaC.counterType();
                    if (!recording) {
                        sendChat("");
                    }
                }
            }
            if (instaC.canSpikeTick) {
                instaC.canSpikeTick = false;
                if (instaC.revTick) {
                    instaC.revTick = false;
                    if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[1]] == 0 && !instaC.isTrue) {
                        instaC.changeType("rev");
                    }
                } else {
                    if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                        instaC.spikeTickType();
                        if (instaC.syncHit) {
                        }
                    }
                }
            }
            if (!clicks.middle && (clicks.left || clicks.right) && !instaC.isTrue) {
                if ((player.weaponIndex != (clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0])) || player.buildIndex > -1) {
                    selectWeapon(clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]);
                }
                if (player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 && !my.waitHit) {
                    sendAutoGather();
                    my.waitHit = 1;
                    game.tickBase(() => {
                        sendAutoGather();
                        my.waitHit = 0;
                    }, 1);
                }
            }
            if (useWasd && !clicks.left && !clicks.right && !instaC.isTrue && near.dist2 <= (items.weapons[player.weapons[0]].range + near.scale * 1.8) && !traps.inTrap) {
                if ((player.weaponIndex != player.weapons[0]) || player.buildIndex > -1) {
                    selectWeapon(player.weapons[0]);
                }
                if (player.reloads[player.weapons[0]] == 0 && !my.waitHit) {
                    sendAutoGather();
                    my.waitHit = 1;
                    game.tickBase(() => {
                        sendAutoGather();
                        my.waitHit = 0;
                    }, 1);
                }
            }
            if (traps.inTrap) {
                if (!clicks.left && !clicks.right && !instaC.isTrue) {
                    if (player.weaponIndex != (traps.notFast() ? player.weapons[1] : player.weapons[0]) || player.buildIndex > -1) {
                        selectWeapon(traps.notFast() ? player.weapons[1] : player.weapons[0]);
                    }
                    if (player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0 && !my.waitHit) {
                        sendAutoGather();
                        my.waitHit = 1;
                        game.tickBase(() => {
                            sendAutoGather();
                            my.waitHit = 0;
                        }, 1);
                    }
                }
            }
            if (clicks.middle && !traps.inTrap) {
                if (!instaC.isTrue && player.reloads[player.weapons[1]] == 0) {
                    if (my.ageInsta && player.weapons[0] != 4 && player.weapons[1] == 9 && player.age >= 9 && enemy.length) {
                        instaC.bowMovement();
                    } else {
                        instaC.rangeType();
                    }
                }
            }
            if (macro.t && !traps.inTrap) {
                if (!instaC.isTrue && player.reloads[player.weapons[0]] == 0 && (player.weapons[1] == 15 ? (player.reloads[player.weapons[1]] == 0) : true) && (player.weapons[0] == 5 || (player.weapons[0] == 4 && player.weapons[1] == 15))) {
                    instaC[(player.weapons[0] == 4 && player.weapons[1] == 15) ? "kmTickMovement" : "tickMovement"]();
                }
            }
            if (macro["."] && !traps.inTrap) {
                if (!instaC.isTrue && player.reloads[player.weapons[0]] == 0 && ([9, 12, 13, 15].includes(player.weapons[1]) ? (player.reloads[player.weapons[1]] == 0) : true)) {
                    instaC.boostTickMovement();
                }
            }
            if (player.weapons[1] && !clicks.left && !clicks.right && !traps.inTrap && !instaC.isTrue && !(useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8)) {
                if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                    if (!my.reloaded) {
                        my.reloaded = true;
                        let fastSpeed = items.weapons[player.weapons[0]].spdMult < items.weapons[player.weapons[1]].spdMult ? 1 : 0;
                        if (player.weaponIndex != player.weapons[fastSpeed] || player.buildIndex > -1) {
                            selectWeapon(player.weapons[fastSpeed]);
                        }
                    }
                } else {
                    my.reloaded = false;
                    if(useWasd) {
                        autos.stopspin = false;
                    }
                    if (player.reloads[player.weapons[0]] > 0) {
                        if (player.weaponIndex != player.weapons[0] || player.buildIndex > -1) {
                            selectWeapon(player.weapons[0]);
                        }
                    } else if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] > 0) {
                        if (player.weaponIndex != player.weapons[1] || player.buildIndex > -1) {
                            selectWeapon(player.weapons[1]);
                        }
                        if(useWasd) {
                            if (!autos.stopspin) {
                                setTimeout(()=>{
                                    autos.stopspin = true;
                                }, 750);
                            }
                        }
                    }
                }
            }
            if (!instaC.isTrue && !traps.inTrap && !traps.replaced) {
                traps.autoPlace();
            }
            if (!macro.q && !macro.f && !macro.v && !macro.h && !macro.n) {
                packet("D", getAttackDir());
            }
            let hatChanger = function () {
                if (clicks.left || clicks.right) {
                    if (clicks.left) {
                        buyEquip(player.reloads[player.weapons[0]] == 0 ? getEl("weaponGrind").checked ? 40 : 7 : player.empAnti ? 22 : 6, 0);
                    } else if (clicks.right) {
                        buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : player.empAnti ? 22 : 6, 0);
                    }
                } else {


                    if (clicks.left || clicks.right) {
                        if (
                            ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) &&
                            ((near && near.dist2 > 120) || !near)
                        ) {
                        } else {
                            if (clicks.left) {
                                buyEquip(
                                    player.reloads[player.weapons[0]] == 0
                                    ? getEl('weaponGrind').checked
                                    ? 40
                                    : 7
                                    : player.empAnti
                                    ? 22
                                    : player.soldierAnti
                                    ? 6
                                    : getEl('antiBullType').value == 'abreload' && near.antiBull > 0
                                    ? 11
                                    : near.dist2 <= 300
                                    ? getEl('antiBullType').value == 'abalway' && near.reloads[near.primaryIndex] == 0
                                    ? 11
                                    : 6
                                    : biomeGear(1, 1),
                                    0
                                );
                            } else if (clicks.right) {
                                buyEquip(
                                    player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0
                                    ? 40
                                    : player.empAnti
                                    ? 22
                                    : player.soldierAnti
                                    ? 6
                                    : getEl('antiBullType').value == 'abreload' && near.antiBull > 0
                                    ? 11
                                    : near.dist2 <= 300
                                    ? getEl('antiBullType').value == 'abalway' && near.reloads[near.primaryIndex] == 0
                                    ? 11
                                    : 6
                                    : biomeGear(1, 1),
                                    0
                                );
                            }
                        }
                    } else if (traps.inTrap) {
                        if (traps.info.health <= items.weapons[player.weaponIndex].dmg ? false : player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                            buyEquip(40, 0);
                            buyEquip(21, 1);
                        } else {
                            if (
                                ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) &&
                                ((near && near.dist2 > 140) || !near)
                            ) {
                            }
                        }
                    } else {
                        if (
                            ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) &&
                            ((near && near.dist2 > 140) || !near)
                        ) {
                        } else {
                            if (near.dist2 <= 300) {
                                buyEquip(
                                    getEl('antiBullType').value == 'abreload' && near.antiBull > 0
                                    ? 11
                                    : getEl('antiBullType').value == 'abalway' && near.reloads[near.primaryIndex] == 0
                                    ? 11
                                    : 6,
                                    0
                                );
                            } else {
                                biomeGear(1);
                            }
                        }
                    }
                }
            };

            let accChanger = function() {
                if (instaC.can && player.checkCanInsta(true) >= 100) {
                    buyEquip(18, 1);
                } else if (clicks.left) {
                    setTimeout(() => {
                        buyEquip(21, 1);
                    }, 50);
                } else if (clicks.right) {
                    setTimeout(() => {
                        buyEquip(18, 1);
                    }, 50);
                } else if (near.dist2 <= 240) {
                    buyEquip(21, 1);
                } else {
                    traps.inTrap ? buyEquip(21, 1) : buyEquip(11, 1);
                }
            };

            let wasdGears = function() {
                if (my.anti0Tick > 0) {
                    buyEquip(6, 0);
                } else {
                    if (clicks.left || clicks.right) {
                        if ((player.shameCount > 4320 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                            buyEquip(7, 0);
                        } else {
                            if (clicks.left) {
                                buyEquip(player.reloads[player.weapons[0]] == 0 ? getEl("weaponGrind").checked ? 40 : 7 : player.empAnti ? 22 : 6, 0);
                            } else if (clicks.right) {
                                buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : player.empAnti ? 22 : 6, 0);
                            }
                        }
                    } else if (near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap) {
                        if ((player.shameCount > 4320 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                            buyEquip(7, 0);
                        } else {
                            buyEquip(player.reloads[player.weapons[0]] == 0 ? 7 : player.empAnti ? 22 : 6, 0);
                        }
                    } else if (traps.inTrap) {
                        if (traps.info.health <= items.weapons[player.weaponIndex].dmg ? false : (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)) {
                            buyEquip(40, 0);
                        } else {
                            if ((player.shameCount > 4320 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                                buyEquip(7, 0);
                            } else {
                                buyEquip(player.empAnti ? 22 : 6, 0);
                            }
                        }
                    } else {
                        if (player.empAnti) {
                            buyEquip(22, 0);
                        } else {
                            if ((player.shameCount > 4320 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                                buyEquip(7, 0);
                            } else {
                                buyEquip(6, 0);
                            }
                        }
                    }
                }
                if (clicks.left || clicks.right) {
                    if (clicks.left) {
                        buyEquip(0, 1);
                    } else if (clicks.right) {
                        buyEquip(11, 1);
                    }
                } else if (near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap) {
                    buyEquip(0, 1);
                } else if (traps.inTrap) {
                    buyEquip(0, 1);
                } else {
                    buyEquip(11, 1);
                }
            }
            if (storeMenu.style.display != "block" && !instaC.isTrue && !instaC.ticking) {
                if (useWasd) {
                    wasdGears();
                } else {
                    hatChanger();
                    accChanger();
                }
            }
            if (configs.autoPush && enemy.length && !traps.inTrap && !instaC.ticking) {
                autoPush();
            } else {
                if (my.autoPush) {
                    my.autoPush = false;
                    packet("a", lastMoveDir || undefined, 1);
                }
            }
            if (instaC.ticking) {
                instaC.ticking = false;
            }
            if (instaC.syncHit) {
                instaC.syncHit = false;
            }
            if (player.empAnti) {
                player.empAnti = false;
            }
            if (player.soldierAnti) {
                player.soldierAnti = false;
            }
            if (my.anti0Tick > 0) {
                my.anti0Tick--;
            }
            if (traps.replaced) {
                traps.replaced = false;
            }
            if (traps.antiTrapped) {
                traps.antiTrapped = false;
            }

            const getPotentialDamage = (build, user) => {
                const weapIndex = user.weapons[1] === 10 && !player.reloads[user.weapons[1]] ? 1 : 0;
                const weap = user.weapons[weapIndex];
                if (player.reloads[weap]) return 0;
                const weapon = items.weapons[weap];
                const inDist = cdf(build, user) <= build.getScale() + weapon.range;
                return (user.visible && inDist) ? weapon.dmg * (weapon.sDmg || 1) * 3.3 : 0;
            };

            const AutoReplace = () => {
                const replaceable = [];
                const playerX = player.x;
                const playerY = player.y;
                const gameObjectCount = gameObjects.length;

                for (let i = 0; i < gameObjectCount; i++) {
                    const build = gameObjects[i];
                    if (build.isItem && build.active && build.health > 0) {
                        const item = items.list[build.id];
                        const posDist = 35 + item.scale + (item.placeOffset || 0);
                        const inDistance = cdf(build, player) <= posDist * 2;
                        if (inDistance) {
                            let canDeal = 0;
                            const playersCount = players.length;
                            for (let j = 0; j < playersCount; j++) {
                                canDeal += getPotentialDamage(build, players[j]);
                            }
                            if (build.health <= canDeal) {
                                replaceable.push(build);
                            }
                        }
                    }
                }

                const findPlacementAngle = (player, itemId, build) => {
                    if (!build) return null;
                    const MAX_ANGLE = 2 * Math.PI;
                    const ANGLE_STEP = Math.PI / 360;
                    const item = items.list[player.items[itemId]];
                    let buildingAngle = Math.atan2(build.y - player.y, build.x - player.x);
                    let tmpS = player.scale + (item.scale || 1) + (item.placeOffset || 0);

                    for (let offset = 0; offset < MAX_ANGLE; offset += ANGLE_STEP) {
                        let angles = [(buildingAngle + offset) % MAX_ANGLE, (buildingAngle - offset + MAX_ANGLE) % MAX_ANGLE];
                        for (let angle of angles) {
                            return angle;
                        }
                    }
                    return null;
                };

                const replace = (() => {
                    let nearTrap = liztobj.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && cdf(tmp, player) <= tmp.getScale() + 5);
                    let spike = gameObjects.find(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && cdf(tmp, player) < 87 && !nearTrap.length);
                    const buildId = spike ? 4 : 2;

                    replaceable.forEach(build => {
                        let angle = findPlacementAngle(player, buildId, build);
                        if (angle !== null) {
                            place(buildId, angle);
                        }
                    });
                });

                if (near && near.dist3 <= 360) {
                    replace();
                }
                replace;
            }
            }
    }
}
for(var i1 = 0; i1 < liztobj.length; i1++) {
    if (liztobj[i1].active && liztobj[i1].health > 0 && UTILS.getDist(liztobj[i1], player, 0, 2) < 150 && getEl("antipush").checked) {

        if(liztobj[i1].name.includes("spike") && liztobj[i1]){
            if(liztobj[i1].owner.sid != player.sid && clicks.left == false && tmpObj.reloads[tmpObj.secondaryIndex] == 0){
                selectWeapon(player.weapons[1])
                buyEquip(40, 0);
                packet("D", UTILS.getDirect(liztobj[i1], player, 0, 2))
                setTickout( () => {
                    buyEquip(6, 0)
                }, 1);
            }
        }
    }
}
function ez(context, x, y) {
    context.fillStyle = "rgba(0, 255, 255, 0.2)";
    context.beginPath();
    context.arc(x, y, 55, 0, Math.PI * 2);
    context.fill();
    context.closePath();
    context.globalAlpha = 1;
}

function updateLeaderboard(data) {
    lastLeaderboardData = data;
    return;
    UTILS.removeAllChildren(leaderboardData);
    let tmpC = 1;
    for (let i = 0; i < data.length; i += 3) {
        (function(i) {
            UTILS.generateElement({
                class: "leaderHolder",
                parent: leaderboardData,
                children: [
                    UTILS.generateElement({
                        class: "leaderboardItem",
                        style: "color:" + ((data[i] == playerSID) ? "#fff" : "rgba(255,255,255,0.6)"),
                        text: tmpC + ". " + (data[i + 1] != "" ? data[i + 1] : "unknown")
                    }),
                    UTILS.generateElement({
                        class: "leaderScore",
                        text: UTILS.sFormat(data[i + 2]) || "0"
                    })
                ]
            });
        })(i);
        tmpC++;
    }
}

function loadGameObject(data) {
    for (let i = 0; i < data.length;) {
        objectManager.add(data[i], data[i + 1], data[i + 2], data[i + 3], data[i + 4],
                          data[i + 5], items.list[data[i + 6]], true, (data[i + 7] >= 0 ? {
            sid: data[i + 7]
        } : null));
        i += 8;
    }
}

function loadAI(data) {
    for (let i = 0; i < ais.length; ++i) {
        ais[i].forcePos = !ais[i].visible;
        ais[i].visible = false;
    }
    if (data) {
        let tmpTime = performance.now();
        for (let i = 0; i < data.length;) {
            tmpObj = findAIBySID(data[i]);
            if (tmpObj) {
                tmpObj.index = data[i + 1];
                tmpObj.t1 = (tmpObj.t2 === undefined) ? tmpTime : tmpObj.t2;
                tmpObj.t2 = tmpTime;
                tmpObj.x1 = tmpObj.x;
                tmpObj.y1 = tmpObj.y;
                tmpObj.x2 = data[i + 2];
                tmpObj.y2 = data[i + 3];
                tmpObj.d1 = (tmpObj.d2 === undefined) ? data[i + 4] : tmpObj.d2;
                tmpObj.d2 = data[i + 4];
                tmpObj.health = data[i + 5];
                tmpObj.dt = 0;
                tmpObj.visible = true;
            } else {
                tmpObj = aiManager.spawn(data[i + 2], data[i + 3], data[i + 4], data[i + 1]);
                tmpObj.x2 = tmpObj.x;
                tmpObj.y2 = tmpObj.y;
                tmpObj.d2 = tmpObj.dir;
                tmpObj.health = data[i + 5];
                if (!aiManager.aiTypes[data[i + 1]].name)
                    tmpObj.name = config.cowNames[data[i + 6]];
                tmpObj.forcePos = true;
                tmpObj.sid = data[i];
                tmpObj.visible = true;
            }
            i += 7;
        }
    }
}

function animateAI(sid) {
    tmpObj = findAIBySID(sid);
    if (tmpObj) tmpObj.startAnim();
}

function gatherAnimation(sid, didHit, index) {
    tmpObj = findPlayerBySID(sid);
    if (tmpObj) {
        tmpObj.startAnim(didHit, index);
        tmpObj.gatherIndex = index;
        tmpObj.gathering = 1;
        if (didHit) {
            let tmpObjects = objectManager.hitObj;
            objectManager.hitObj = [];
            game.tickBase(() => {
                tmpObj = findPlayerBySID(sid);
                let val = items.weapons[index].dmg * (config.weaponVariants[tmpObj[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1) * (tmpObj.skinIndex == 40 ? 3.3 : 1);
                tmpObjects.forEach((healthy) => {
                    healthy.health -= val;
                });
            }, 1);
        }
    }
}
if(nears.filter(near => near.gathering).length>1) {
    player.chat.message = "pSyD";
    healer();
}

function wiggleGameObject(dir, sid) {
    tmpObj = findObjectBySid(sid);
    if (tmpObj) {
        tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir);
        tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir);
        if (tmpObj.health) {
            objectManager.hitObj.push(tmpObj);
        }
    }
}

function shootTurret(sid, dir) {
    tmpObj = findObjectBySid(sid);
    if (tmpObj) {
        if (config.anotherVisual) {
            tmpObj.lastDir = dir;
        } else {
            tmpObj.dir = dir;
        }
        tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir + Math.PI);
        tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir + Math.PI);
    }
}

function updatePlayerValue(index, value, updateView) {
    if (player) {
        player[index] = value;
        if (index == "points") {
            if (configs.autoBuy) {
                autoBuy.hat();
                autoBuy.acc();
            }
        } else if (index == "kills") {
            if (configs.killChat) {
                if (!recording) {
                    sendChat("Test");
                }
            }
        }
    }
}

function updateItems(data, wpn) {
    if (data) {
        if (wpn) {
            player.weapons = data;
            player.primaryIndex = player.weapons[0];
            player.secondaryIndex = player.weapons[1];
            if (!instaC.isTrue) {
                selectWeapon(player.weapons[0]);
            }
        } else {
            player.items = data;
        }
    }

    for (let i = 0; i < items.list.length; i++) {
        let tmpI = items.weapons.length + i;
        let actionBarItem = getEl("actionBarItem" + tmpI);
        actionBarItem.style.display = player.items.indexOf(items.list[i].id) >= 0 ? "inline-block" : "none";
    }

    for (let i = 0; i < items.weapons.length; i++) {
        let actionBarItem = getEl("actionBarItem" + i);
        actionBarItem.style.display = player.weapons[items.weapons[i].type] == items.weapons[i].id ? "inline-block" : "none";
    }

    let kms = player.weapons[0] == 3 && player.weapons[1] == 15;
    if (kms) {
        getEl("actionBarItem3").style.display = "none";
        getEl("actionBarItem4").style.display = "inline-block";
    }
}

function addProjectile(x, y, dir, range, speed, indx, layer, sid) {
    projectileManager.addProjectile(x, y, dir, range, speed, indx, null, null, layer, inWindow).sid = sid;
    runAtNextTick.push(Array.prototype.slice.call(arguments));
}

function remProjectile(sid, range) {
    for (let i = 0; i < projectiles.length; ++i) {
        if (projectiles[i].sid == sid) {
            projectiles[i].range = range;
            let tmpObjects = objectManager.hitObj;
            objectManager.hitObj = [];
            game.tickBase(() => {
                let val = projectiles[i].dmg;
                tmpObjects.forEach((healthy) => {
                    if (healthy.projDmg) {
                        healthy.health -= val;
                    }
                });
            }, 1);
        }
    }
}

function setPlayerTeam(team, isOwner) {
    if (player) {
        player.team = team;
        player.isOwner = isOwner;
        if (team == null)
            alliancePlayers = [];
    }
}

function setAlliancePlayers(data) {
    alliancePlayers = data;
}

function updateStoreItems(type, id, index) {
    if (index) {
        if (!type)
            player.tails[id] = 1;
        else {
            player.latestTail = id;
        }
    } else {
        if (!type)
            player.skins[id] = 1,
                id == 7 && (my.reSync = true);
        else {
            player.latestSkin = id;
        }
    }
}


const videoContainer = document.createElement('div');
videoContainer.id = 'video-bg';
videoContainer.style.position = 'absolute';
videoContainer.style.width = '100%';
videoContainer.style.height = '100%';
videoContainer.style.zIndex = '10';
videoContainer.style.overflow = 'hidden';
const videoElement = document.createElement('video');
videoElement.src = 'https://www.youtube.com/watch?v=799DOdDXLhQ';
videoElement.autoplay = true;
videoElement.loop = true;
videoElement.muted = true;
videoElement.style.width = '100%';
videoElement.style.height = '100%';
videoContainer.style.zIndex = '-1';
videoContainer.style.opacity = '0.5';
videoContainer.appendChild(videoElement);
document.querySelector('#mainMenu').appendChild(videoContainer);

const style = document.createElement('style');
style.textContent = `
@keyframes fadeInUp {
	0% {
		opacity: 0;
		transform: translateY(10px);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

html, body {
	background-color: #121212;
	color: #E5E5E5;
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	font-family: 'Inter', 'Segoe UI', sans-serif;
	font-size: 16px;
	line-height: 1.6;
	letter-spacing: 0.4px;
	overflow: hidden;
	user-select: none;
	transition: background-color 0.5s ease;
	animation: fadeInUp 0.8s ease forwards;
}

* {
	box-sizing: border-box;
	font-family: inherit;
	transition: all 0.25s ease;
}

::placeholder {
	color: #C8A8C6;
	opacity: 0.7;
	transition: color 0.3s ease;
}

/* Ссылки */
a {
	color: #B48EAD;
	text-decoration: none;
	transition: color 0.3s ease, text-shadow 0.3s ease;
}
a:hover {
	color: #C59BC5;
	text-shadow: 0 0 8px #C59BC5;
}

/* Поля ввода */
input[type="text"] {
	background-color: #1F1F1F;
	color: #EFEFEF;
	border: 1px solid #444;
	border-radius: 8px;
	padding: 10px 14px;
	font-size: 18px;
	font-weight: 500;
	outline: none;
	box-shadow: inset 0 0 6px rgba(255,255,255,0.05);
	transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
input[type="text"]:focus {
	border-color: #B48EAD;
	box-shadow: 0 0 8px #B48EAD;
}

/* Кнопки */
.menuButton {
	background-color: #B48EAD;
	color: #fff;
	border: none;
	border-radius: 10px;
	padding: 12px 16px;
	font-size: 18px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 1px;
	cursor: pointer;
	box-shadow: 0 4px 0 #9C749C;
	width: 100%;
	transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
	will-change: transform;
}
.menuButton:hover {
	background-color: #C59BC5;
	box-shadow: 0 6px 15px rgba(197, 155, 197, 0.7);
	transform: scale(1.05);
}
.menuButton:active {
	transform: scale(0.95);
	box-shadow: 0 2px 7px rgba(140, 102, 140, 0.7);
}

/* Карточки и панели */
.menuCard {
	background-color: #1E1E1E;
	border-radius: 12px;
	padding: 20px;
	margin: 8px;
	color: #f0f0f0;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
	display: inline-block;
	width: 320px;
	text-align: left;
	transition: box-shadow 0.3s ease, transform 0.3s ease;
	will-change: transform;
	animation: fadeInUp 0.8s ease forwards;
}
.menuCard:hover {
	box-shadow: 0 12px 28px rgba(180, 142, 173, 0.6);
	transform: translateY(-6px);
}

.menuHeader {
	font-size: 26px;
	font-weight: 700;
	color: #E6CCE2;
	text-shadow: 0 0 6px rgba(255, 192, 255, 0.3);
	margin-bottom: 14px;
	transition: color 0.3s ease;
}

.menuText {
	font-size: 18px;
	color: #CBBCCF;
	font-style: italic;
	margin-bottom: 14px;
	text-shadow: 0 0 4px rgba(255, 255, 255, 0.05);
	transition: color 0.3s ease;
}

/* Главный экран */
#mainMenu {
	background-color: rgba(18, 18, 18, 0.9);
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 10;
	animation: fadeInUp 1s ease forwards;
}

#menuContainer {
	text-align: center;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 100%;
}

/* Название игры */
#gameName {
	font-size: 140px;
	font-weight: bold;
	color: #B48EAD;
	letter-spacing: 2px;
	text-shadow: 0 0 16px rgba(180, 142, 173, 0.7);
	margin-bottom: 10px;
	text-align: center;
	animation: fadeInUp 1.2s ease forwards;
}

/* Ввод имени */
#nameInput {
	width: 100%;
	font-size: 18px;
	padding: 10px;
	border-radius: 10px;
	margin-bottom: 20px;
	color: #EFEFEF;
}

/* Чат */
#chatLog {
	position: absolute;
	top: 20px;
	left: 20px;
	width: 320px;
	height: 120px;
	overflow-y: auto;
	background-color: rgba(255, 255, 255, 0.05);
	border-radius: 8px;
	padding: 12px;
	font-size: 16px;
	backdrop-filter: blur(3px);
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
	color: #EAEAEA;
	animation: fadeInUp 1.5s ease forwards;
}

.chatMessage {
	background-color: rgba(255, 255, 255, 0.07);
	padding: 8px 10px;
	border-radius: 6px;
	margin-bottom: 6px;
	font-size: 16px;
	line-height: 1.4;
	color: #EAEAEA;
	transition: background-color 0.3s ease;
}
.chatMessage:hover {
	background-color: rgba(180, 142, 173, 0.15);
}

/* Скин селектор */
.skinColorItem {
	width: 30px;
	height: 30px;
	border-radius: 50%;
	border: 2px solid #888;
	display: inline-block;
	margin-right: 10px;
	cursor: pointer;
	transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
	will-change: transform;
}
.skinColorItem:hover {
	transform: scale(1.2);
	border-color: #B48EAD;
	box-shadow: 0 0 12px #B48EAD;
}
.activeSkin {
	border: 2px solid #B48EAD;
	box-shadow: 0 0 14px #B48EAD;
}

/* Уведомление об ошибке */
#errorNotification {
	position: absolute;
	top: 20px;
	left: 50%;
	transform: translateX(-50%);
	background-color: #2a1f2e;
	color: #fff;
	border-radius: 10px;
	padding: 12px 20px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
	z-index: 9999;
	animation: fadeInUp 1s ease forwards;
	transition: box-shadow 0.3s ease, background-color 0.3s ease;
}
#errorNotification:hover {
	box-shadow: 0 4px 25px rgba(180, 142, 173, 0.9);
	background-color: #3b2a44;
}
#errorNotification .errorClose {
	position: absolute;
	top: 8px;
	left: 8px;
	cursor: pointer;
	color: #aaa;
	transition: color 0.3s ease;
}
#errorNotification .errorClose:hover {
	color: #fff;
}

/* Показатели */
#scoreText, #timeText, #pingDisplay {
	font-size: 16px;
	background-color: rgba(255, 255, 255, 0.07);
	padding: 6px 12px;
	border-radius: 6px;
	display: inline-block;
	color: #fff;
	transition: background-color 0.3s ease, box-shadow 0.3s ease;
}
#scoreText:hover, #timeText:hover, #pingDisplay:hover {
	background-color: rgba(180, 142, 173, 0.2);
	box-shadow: 0 0 10px rgba(180, 142, 173, 0.6);
}

/* Центрированная кнопка (например, на мобилках) */
#centerButton {
	position: absolute;
	width: 12%;
	padding-top: 12%;
	bottom: 15%;
	left: 50%;
	transform: translateX(-50%);
	z-index: 100;
	border-radius: 50%;
	background-color: #B48EAD;
	box-shadow: 0 5px rgba(0, 0, 0, 0.2);
	transition: box-shadow 0.3s ease, transform 0.2s ease;
	cursor: pointer;
}
#centerButton:hover {
	box-shadow: 0 10px 25px rgba(180, 142, 173, 0.7);
	transform: scale(1.1);
}
#centerButton:active {
	transform: scale(0.95);
	box-shadow: 0 3px 10px rgba(140, 102, 140, 0.7);
}

/* Scrollbar стили */
#chatLog::-webkit-scrollbar {
	width: 10px;
}
#chatLog::-webkit-scrollbar-thumb {
	background: rgba(180, 142, 173, 0.4);
	border-radius: 10px;
	transition: background-color 0.3s ease;
}
#chatLog::-webkit-scrollbar-thumb:hover {
	background: rgba(180, 142, 173, 0.6);
}
#chatLog::-webkit-scrollbar-track {
	background: rgba(255, 255, 255, 0.05);
}



`;
document.head.appendChild(style);

const chatLogBox = document.createElement('div');
chatLogBox.id = 'chatLog';
document.body.appendChild(chatLogBox);

function receiveChat(sid, message) {
    let tmpPlayer = findPlayerBySID(sid);
    tmpPlayer.chatMessage = message;
    tmpPlayer.chatCountdown = config.chatCountdown;
    const playerName = tmpPlayer.name;
    const chatMessage = document.createElement('div');
    chatMessage.textContent = `${playerName}: ${message}`;
    chatMessage.classList.add('chatMessage');
    chatLogBox.appendChild(chatMessage);
    chatLogBox.scrollTop = chatLogBox.scrollHeight;
}

function updateMinimap(data) {
    minimapData = data;
}

function showText(x, y, value, type) {
    textManager.showText(x, y, 45, 0.1, 1000, Math.abs(value), value >= 0 ? "#FFB6C1" : "#da3e3e")
}

function renderLeaf(x, y, l, r, ctxt) {
    let endX = x + (l * Math.cos(r));
    let endY = y + (l * Math.sin(r));
    let width = l * 0.4;
    ctxt.moveTo(x, y);
    ctxt.beginPath();
    ctxt.quadraticCurveTo(((x + endX) / 2) + (width * Math.cos(r + Math.PI / 2)),
                          ((y + endY) / 2) + (width * Math.sin(r + Math.PI / 2)), endX, endY);
    ctxt.quadraticCurveTo(((x + endX) / 2) - (width * Math.cos(r + Math.PI / 2)),
                          ((y + endY) / 2) - (width * Math.sin(r + Math.PI / 2)), x, y);
    ctxt.closePath();
    ctxt.fill();
    ctxt.stroke();
}

function renderCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
    tmpContext = tmpContext || mainContext;
    tmpContext.beginPath();
    tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
    if (!dontFill) tmpContext.fill();
    if (!dontStroke) tmpContext.stroke();
}

function renderHealthCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
    tmpContext = tmpContext || mainContext;
    tmpContext.beginPath();
    tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
    if (!dontFill) tmpContext.fill();
    if (!dontStroke) tmpContext.stroke();
}

function renderStar(ctxt, spikes, outer, inner) {
    let rot = Math.PI / 2 * 3;
    let x, y;
    let step = Math.PI / spikes;
    ctxt.beginPath();
    ctxt.moveTo(0, -outer);
    for (let i = 0; i < spikes; i++) {
        x = Math.cos(rot) * outer;
        y = Math.sin(rot) * outer;
        ctxt.lineTo(x, y);
        rot += step;
        x = Math.cos(rot) * inner;
        y = Math.sin(rot) * inner;
        ctxt.lineTo(x, y);
        rot += step;
    }
    ctxt.lineTo(0, -outer);
    ctxt.closePath();
}

function renderHealthStar(ctxt, spikes, outer, inner) {
    let rot = Math.PI / 2 * 3;
    let x, y;
    let step = Math.PI / spikes;
    ctxt.beginPath();
    ctxt.moveTo(0, -outer);
    for (let i = 0; i < spikes; i++) {
        x = Math.cos(rot) * outer;
        y = Math.sin(rot) * outer;
        ctxt.lineTo(x, y);
        rot += step;
        x = Math.cos(rot) * inner;
        y = Math.sin(rot) * inner;
        ctxt.lineTo(x, y);
        rot += step;
    }
    ctxt.lineTo(0, -outer);
    ctxt.closePath();
}

function renderRect(x, y, w, h, ctxt, dontStroke, dontFill) {
    if (!dontFill) ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
    if (!dontStroke) ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
}

function renderHealthRect(x, y, w, h, ctxt, dontStroke, dontFill) {
    if (!dontFill) ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
    if (!dontStroke) ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
}

function renderRectCircle(x, y, s, sw, seg, ctxt, dontStroke, dontFill) {
    ctxt.save();
    ctxt.translate(x, y);
    seg = Math.ceil(seg / 2);
    for (let i = 0; i < seg; i++) {
        renderRect(0, 0, s * 2, sw, ctxt, dontStroke, dontFill);
        ctxt.rotate(Math.PI / seg);
    }
    ctxt.restore();
}

function renderBlob(ctxt, spikes, outer, inner) {
    let rot = Math.PI / 2 * 3;
    let x, y;
    let step = Math.PI / spikes;
    let tmpOuter;
    ctxt.beginPath();
    ctxt.moveTo(0, -inner);
    for (let i = 0; i < spikes; i++) {
        tmpOuter = UTILS.randInt(outer + 0.9, outer * 1.2);
        ctxt.quadraticCurveTo(Math.cos(rot + step) * tmpOuter, Math.sin(rot + step) * tmpOuter,
                              Math.cos(rot + (step * 2)) * inner, Math.sin(rot + (step * 2)) * inner);
        rot += step * 2;
    }
    ctxt.lineTo(0, -inner);
    ctxt.closePath();
}

function renderTriangle(s, ctx) {
    ctx = ctx || mainContext;
    let h = s * (Math.sqrt(3) / 2);
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.lineTo(-s / 2, h / 2);
    ctx.lineTo(s / 2, h / 2);
    ctx.lineTo(0, -h / 2);
    ctx.fill();
    ctx.closePath();
}

function prepareMenuBackground() {

}

function renderPlayers(xOffset, yOffset, zIndex) {
    mainContext.globalAlpha = 1;
    mainContext.fillStyle = "#91b2db";
    for (var i = 0; i < players.length; ++i) {
        tmpObj = players[i];
        if (tmpObj.zIndex == zIndex) {
            tmpObj.animate(delta);
            if (tmpObj.visible) {
                tmpObj.skinRot += (0.002 * delta);
                tmpDir = (tmpObj==player?getVisualDir():(tmpObj.dir || 0));
                mainContext.save();
                mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                mainContext.rotate(tmpDir + tmpObj.dirPlus);
                renderPlayer(tmpObj, mainContext);
                mainContext.restore();
            }
        }
    }
}

function renderPlayer(obj, ctxt) {
    ctxt = ctxt || mainContext;
    ctxt.lineWidth = outlineWidth;
    ctxt.lineJoin = "miter";
    let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS || 1);
    let oHandAngle = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndS || 1) : 1;
    let oHandDist = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndD || 1) : 1;

    let katanaMusket = (obj == player && obj.weapons[0] == 3 && obj.weapons[1] == 15);

    if (obj.tailIndex > 0) {
        renderTailTextureImage(obj.tailIndex, ctxt, obj);
    }

    if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
        renderTool(items.weapons[katanaMusket ? 4 : obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
        if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
            renderProjectile(obj.scale, 0,
                             items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
        }
    }

    ctxt.fillStyle = config.skinColors[obj.skinColor];
    renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
    renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                 (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);

    if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
        renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
        if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
            renderProjectile(obj.scale, 0,
                             items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
        }
    }

    if (obj.buildIndex >= 0) {
        var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
        ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
    }

    renderCircle(0, 0, obj.scale, ctxt);

    if (obj.skinIndex > 0) {
        ctxt.rotate(Math.PI / 2);
        renderTextureSkin(obj.skinIndex, ctxt, null, obj);
    }
}

var skinSprites2 = {};
var skinPointers2 = {};
function renderSkin2(index, ctxt, parentSkin, owner) {
    tmpSkin = skinSprites2[index];
    if (!tmpSkin) {
        var tmpImage = new Image();
        tmpImage.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImage.src = "https://moomoo.io/img/hats/hat_" + index + ".png";
        skinSprites2[index] = tmpImage;
        tmpSkin = tmpImage;
    }
    var tmpObj = parentSkin||skinPointers2[index];
    if (!tmpObj) {
        for (var i = 0; i < hats.length; ++i) {
            if (hats[i].id == index) {
                tmpObj = hats[i];
                break;
            }
        }
        skinPointers2[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) {
        ctxt.drawImage(tmpSkin, -tmpObj.scale/2, -tmpObj.scale/2, tmpObj.scale, tmpObj.scale);
    }
    if (!parentSkin && tmpObj.topSprite) {
        ctxt.save();
        ctxt.rotate(owner.skinRot);
        renderSkin2(index + "_top", ctxt, tmpObj, owner);
        ctxt.restore();
    }
}

function renderTextureSkin(index, ctxt, parentSkin, owner) {
    if (!(tmpSkin = skinSprites[index + (txt ? "lol" : 0)])) {
        var tmpImage = new Image();
        tmpImage.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        }
        tmpImage.src = setSkinTextureImage(index, "hat", index);
        skinSprites[index + (txt ? "lol" : 0)] = tmpImage;
        tmpSkin = tmpImage;
    }
    var tmpObj = parentSkin||skinPointers[index];
    if (!tmpObj) {
        for (var i = 0; i < hats.length; ++i) {
            if (hats[i].id == index) {
                tmpObj = hats[i];
                break;
            }
        }
        skinPointers[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) {
        ctxt.drawImage(tmpSkin, -tmpObj.scale/2, -tmpObj.scale/2, tmpObj.scale, tmpObj.scale);
    }
    if (!parentSkin && tmpObj.topSprite) {
        ctxt.save();
        ctxt.rotate(owner.skinRot);
        renderSkin(index + "_top", ctxt, tmpObj, owner);
        ctxt.restore();
    }
}

function setSkinTextureImage(id, type, id2) {
    if (true) {
        if(type == "acc") {
            return ".././img/accessories/access_" + id + ".png";
        } else if(type == "hat") {
            return ".././img/hats/hat_" + id + ".png";
        } else {
            return ".././img/weapons/" + id + ".png";
        }
    }
}

let skinSprites = {};
let skinPointers = {};
let tmpSkin;

function renderSkin(index, ctxt, parentSkin, owner) {
    tmpSkin = skinSprites[index];
    if (!tmpSkin) {
        let tmpImage = new Image();
        tmpImage.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImage.src = "https://moomoo.io/img/hats/hat_" + index + ".png";
        skinSprites[index] = tmpImage;
        tmpSkin = tmpImage;
    }
    let tmpObj = parentSkin || skinPointers[index];
    if (!tmpObj) {
        for (let i = 0; i < hats.length; ++i) {
            if (hats[i].id == index) {
                tmpObj = hats[i];
                break;
            }
        }
        skinPointers[index] = tmpObj;
    }
    if (tmpSkin.isLoaded)
        ctxt.drawImage(tmpSkin, -tmpObj.scale / 2, -tmpObj.scale / 2, tmpObj.scale, tmpObj.scale);
    if (!parentSkin && tmpObj.topSprite) {
        ctxt.save();
        ctxt.rotate(owner.skinRot);
        renderSkin(index + "_top", ctxt, tmpObj, owner);
        ctxt.restore();
    }
}


function setTailTextureImage(id, type, id2) {
    if (true) {
        if(type == "acc") {
            return ".././img/accessories/access_" + id + ".png";
        } else if(type == "hat") {
            return ".././img/hats/hat_" + id + ".png";
        } else {
            return ".././img/weapons/" + id + ".png";
        }
    } else {
        if(type == "acc") {
            return ".././img/accessories/access_" + id + ".png";
        } else if(type == "hat") {
            return ".././img/hats/hat_" + id + ".png";
        } else {
            return ".././img/weapons/" + id + ".png";
        }
    }
}
function renderTailTextureImage(index, ctxt, owner) {
    if (!(tmpSkin = accessSprites[index + (txt ? "lol" : 0)])) {
        var tmpImage = new Image();
        tmpImage.onload = function() {
            this.isLoaded = true,
                this.onload = null
        }
            ,
            tmpImage.src = setTailTextureImage(index, "acc"),
            accessSprites[index + (txt ? "lol" : 0)] = tmpImage,
            tmpSkin = tmpImage;
    }
    var tmpObj = accessPointers[index];
    if (!tmpObj) {
        for (var i = 0; i < accessories.length; ++i) {
            if (accessories[i].id == index) {
                tmpObj = accessories[i];
                break;
            }
        }
        accessPointers[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) {
        ctxt.save();
        ctxt.translate(-20 - (tmpObj.xOff||0), 0);
        if (tmpObj.spin)
            ctxt.rotate(owner.skinRot);
        ctxt.drawImage(tmpSkin, -(tmpObj.scale/2), -(tmpObj.scale/2), tmpObj.scale, tmpObj.scale);
        ctxt.restore();
    }
}

let accessSprites = {};
let accessPointers = {};
var txt = true;

function renderTail(index, ctxt, owner) {
    tmpSkin = accessSprites[index];
    if (!tmpSkin) {
        let tmpImage = new Image();
        tmpImage.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImage.src = "https://moomoo.io/img/accessories/access_" + index + ".png";
        accessSprites[index] = tmpImage;
        tmpSkin = tmpImage;
    }
    let tmpObj = accessPointers[index];
    if (!tmpObj) {
        for (let i = 0; i < accessories.length; ++i) {
            if (accessories[i].id == index) {
                tmpObj = accessories[i];
                break;
            }
        }
        accessPointers[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) {
        ctxt.save();
        ctxt.translate(-20 - (tmpObj.xOff || 0), 0);
        if (tmpObj.spin)
            ctxt.rotate(owner.skinRot);
        ctxt.drawImage(tmpSkin, -(tmpObj.scale / 2), -(tmpObj.scale / 2), tmpObj.scale, tmpObj.scale);
        ctxt.restore();
    }
}

var accessSprites2 = {};
var accessPointers2 = {};
function renderTail2(index, ctxt, owner) {
    tmpSkin = accessSprites2[index];
    if (!tmpSkin) {
        var tmpImage = new Image();
        tmpImage.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImage.src = "https://moomoo.io/img/accessories/access_" + index + ".png";
        accessSprites2[index] = tmpImage;
        tmpSkin = tmpImage;
    }
    var tmpObj = accessPointers2[index];
    if (!tmpObj) {
        for (var i = 0; i < accessories.length; ++i) {
            if (accessories[i].id == index) {
                tmpObj = accessories[i];
                break;
            }
        }
        accessPointers2[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) {
        ctxt.save();
        ctxt.translate(-20 - (tmpObj.xOff||0), 0);
        if (tmpObj.spin)
            ctxt.rotate(owner.skinRot);
        ctxt.drawImage(tmpSkin, -(tmpObj.scale/2), -(tmpObj.scale/2), tmpObj.scale, tmpObj.scale);
        ctxt.restore();
    }
}

let toolSprites = {};
function renderTool(obj, variant, x, y, ctxt) {
    let tmpSrc = obj.src + (variant || "");
    let tmpSprite = toolSprites[tmpSrc];
    if (!tmpSprite) {
        tmpSprite = new Image();
        tmpSprite.onload = function() {
            this.isLoaded = true;
        }
        tmpSprite.src = "https://moomoo.io/img/weapons/" + tmpSrc + ".png";
        toolSprites[tmpSrc] = tmpSprite;
    }
    if (tmpSprite.isLoaded)
        ctxt.drawImage(tmpSprite, x + obj.xOff - (obj.length / 2), y + obj.yOff - (obj.width / 2), obj.length, obj.width);
}

function renderProjectiles(layer, xOffset, yOffset) {
    for (let i = 0; i < projectiles.length; i++) {
        tmpObj = projectiles[i];
        if (tmpObj.active && tmpObj.layer == layer && tmpObj.inWindow) {
            tmpObj.update(delta);
            if (tmpObj.active && isOnScreen(tmpObj.x - xOffset, tmpObj.y - yOffset, tmpObj.scale)) {
                mainContext.save();
                mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                mainContext.rotate(tmpObj.dir);
                renderProjectile(0, 0, tmpObj, mainContext, 1);
                mainContext.restore();
            }
        }
    };
}

let projectileSprites = {};

function renderProjectile(x, y, obj, ctxt, debug) {
    if (obj.src) {
        let tmpSrc = items.projectiles[obj.indx].src;
        let tmpSprite = projectileSprites[tmpSrc];
        if (!tmpSprite) {
            tmpSprite = new Image();
            tmpSprite.onload = function() {
                this.isLoaded = true;
            }
            tmpSprite.src = "https://moomoo.io/img/weapons/" + tmpSrc + ".png";
            projectileSprites[tmpSrc] = tmpSprite;
        }
        if (tmpSprite.isLoaded)
            ctxt.drawImage(tmpSprite, x - (obj.scale / 2), y - (obj.scale / 2), obj.scale, obj.scale);
    } else if (obj.indx == 1) {
        ctxt.fillStyle = "#939393";
        renderCircle(x, y, obj.scale, ctxt);
    }
}

let aiSprites = {};

function renderAI(obj, ctxt) {
    let tmpIndx = obj.index;
    let tmpSprite = aiSprites[tmpIndx];
    if (!tmpSprite) {
        let tmpImg = new Image();
        tmpImg.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImg.src = "https://moomoo.io/img/animals/" + obj.src + ".png";
        tmpSprite = tmpImg;
        aiSprites[tmpIndx] = tmpSprite;
    }
    if (tmpSprite.isLoaded) {
        let tmpScale = obj.scale * 1.2 * (obj.spriteMlt || 1);
        ctxt.drawImage(tmpSprite, -tmpScale, -tmpScale, tmpScale * 2, tmpScale * 2);
    }
}

function renderWaterBodies(xOffset, yOffset, ctxt, padding) {

    let tmpW = config.riverWidth + padding;
    let tmpY = (config.mapScale / 2) - yOffset - (tmpW / 2);
    if (tmpY < maxScreenHeight && tmpY + tmpW > 0) {
        ctxt.fillRect(0, tmpY, maxScreenWidth, tmpW);
    }
}

let gameObjectSprites = {};

function getResSprite(obj) {
    let biomeID = (obj.y>=config.mapScale-config.snowBiomeTop)?2:((obj.y<=config.snowBiomeTop)?1:0);
    let tmpIndex = (obj.type + "_" + obj.scale + "_" + biomeID);
    let tmpSprite = gameObjectSprites[tmpIndex];
    if (!tmpSprite) {
        let tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = tmpCanvas.height = (obj.scale * 2.1) + outlineWidth;
        let tmpContext = tmpCanvas.getContext('2d');
        tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
        tmpContext.rotate(UTILS.randFloat(0, Math.PI));
        tmpContext.strokeStyle = outlineColor;
        tmpContext.lineWidth = outlineWidth;
        if (obj.type == 0) {
            let tmpScale;
            let tmpCount = 7;
            tmpContext.globalAlpha = 1;
            for (let i = 0; i < 2; ++i) {
                tmpScale = tmpObj.scale * (!i?1:0.5);
                renderStar(tmpContext, tmpCount, tmpScale, tmpScale * 0.7);
                tmpContext.fillStyle = !biomeID?(!i?"#9ebf57":"#b4db62"):(!i?"#e3f1f4":"#fff");
                tmpContext.fill();
                if (!i) {
                    tmpContext.stroke();
                    tmpContext.globalAlpha = 1;
                }
            }
        } else if (obj.type == 1) {
            if (biomeID == 2) {
                tmpContext.fillStyle = "#606060";
                renderStar(tmpContext, 6, obj.scale * 0.3, obj.scale * 0.71);
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.fillStyle = "#89a54c";
                renderCircle(0, 0, obj.scale * 0.55, tmpContext);
                tmpContext.fillStyle = "#a5c65b";
                renderCircle(0, 0, obj.scale * 0.3, tmpContext, true);
            } else {
                renderBlob(tmpContext, 6, tmpObj.scale, tmpObj.scale * 0.7);
                tmpContext.fillStyle = biomeID?"#e3f1f4":"#89a54c";
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.fillStyle = biomeID?"#FFB6C1":"#FF6F61";
                let tmpRange;
                let berries = 4;
                let rotVal = (Math.PI * 2) / berries;
                for (let i = 0; i < berries; ++i) {
                    tmpRange = UTILS.randInt(tmpObj.scale/3.5, tmpObj.scale/2.3);
                    renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                 UTILS.randInt(10, 12), tmpContext);
                }
            }
        } else if (obj.type == 2 || obj.type == 3) {
            tmpContext.fillStyle = (obj.type==2)?(biomeID==2?"#938d77":"#939393"):"#e0c655";
            renderStar(tmpContext, 3, obj.scale, obj.scale);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = (obj.type==2)?(biomeID==2?"#b2ab90":"#bcbcbc"):"#ebdca3";
            renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
            tmpContext.fill();
        }
        tmpSprite = tmpCanvas;
        gameObjectSprites[tmpIndex] = tmpSprite;
    }
    return tmpSprite;
}

let itemSprites = [];
function getItemSprite(obj, asIcon) {
    let tmpSprite = itemSprites[obj.id];
    if (!tmpSprite || asIcon) {
        let tmpCanvas = document.createElement("canvas");
        let reScale = ((!asIcon && obj.name == "windmill") ? items.list[4].scale : obj.scale);
        tmpCanvas.width = tmpCanvas.height = (reScale * 2.5) + outlineWidth + (items.list[obj.id].spritePadding || 0);
        if (config.useWebGl) {
            let gl = tmpCanvas.getContext("webgl");
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

            function render(vs, fs, vertice, type) {

                let vShader = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vShader, vs);
                gl.compileShader(vShader);
                gl.getShaderParameter(vShader, gl.COMPILE_STATUS);

                let fShader = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fShader, fs);
                gl.compileShader(fShader);
                gl.getShaderParameter(fShader, gl.COMPILE_STATUS);

                let program = gl.createProgram();
                gl.attachShader(program, vShader);
                gl.attachShader(program, fShader);
                gl.linkProgram(program);
                gl.getProgramParameter(program, gl.LINK_STATUS);
                gl.useProgram(program);

                let vertex = gl.getAttribLocation(program, "vertex");
                gl.enableVertexAttribArray(vertex);
                gl.vertexAttribPointer(vertex, 2, gl.FLOAT, false, 0, 0);

                let vertices = vertice.length / 2;
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertice), gl.DYNAMIC_DRAW);
                gl.drawArrays(type, 0, vertices);
            }

            function hexToRgb(hex) {
                return hex.slice(1).match(/.{1,2}/g).map(g => parseInt(g, 16));
            }

            function getRgb(r, g, b) {
                return [r / 255, g / 255, b / 255].join(", ");
            }

            let max = 100;
            for (let i = 0; i < max; i++) {
                let radian = (Math.PI * (i / (max / 2)));
                render(`
                            precision mediump float;
                            attribute vec2 vertex;
                            void main(void) {
                                gl_Position = vec4(vertex, 0, 1);
                            }
                            `, `
                            precision mediump float;
                            void main(void) {
                                gl_FragColor = vec4(${getRgb(...hexToRgb("#fff"))}, 1);
                            }
                            `, [
                    0 + (Math.cos(radian) * 0.5), 0 + (Math.sin(radian) * 0.5),
                    0, 0,
                ], gl.LINE_LOOP);
            }
        } else {
            let tmpContext = tmpCanvas.getContext("2d");
            tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
            tmpContext.rotate(asIcon ? 0 : (Math.PI / 2));
            tmpContext.strokeStyle = outlineColor;
            tmpContext.lineWidth = outlineWidth * (asIcon ? (tmpCanvas.width / 81) : 1);
            if (!asIcon) {
                tmpContext.shadowColor = `rgba(0, 0, 0, ${Math.min(obj.name == "pit trap" ? 0.8 : 0.5, obj.alpha)})`;
            }

            if (obj.name == "apple") {
                tmpContext.fillStyle = "#c15555";
                renderCircle(0, 0, obj.scale, tmpContext);
                tmpContext.fillStyle = "#89a54c";
                let leafDir = -(Math.PI / 2);
                renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir),
                           25, leafDir + Math.PI / 2, tmpContext);
            } else if (obj.name == "cookie") {
                tmpContext.fillStyle = "#cca861";
                renderCircle(0, 0, obj.scale, tmpContext);
                tmpContext.fillStyle = "#937c4b";
                let chips = 4;
                let rotVal = (Math.PI * 2) / chips;
                let tmpRange;
                for (let i = 0; i < chips; ++i) {
                    tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                    renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                 UTILS.randInt(4, 5), tmpContext, true);
                }
            } else if (obj.name == "cheese") {
                tmpContext.fillStyle = "#f4f3ac";
                renderCircle(0, 0, obj.scale, tmpContext);
                tmpContext.fillStyle = "#c3c28b";
                let chips = 4;
                let rotVal = (Math.PI * 2) / chips;
                let tmpRange;
                for (let i = 0; i < chips; ++i) {
                    tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                    renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                 UTILS.randInt(4, 5), tmpContext, true);
                }
            } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                tmpContext.fillStyle = (obj.name == "castle wall") ? "#83898e" : (obj.name == "wood wall") ?
                    "#a5974c" : "#939393";
                let sides = (obj.name == "castle wall") ? 4 : 3;
                renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.fillStyle = (obj.name == "castle wall") ? "#9da4aa" : (obj.name == "wood wall") ?
                    "#c9b758" : "#bcbcbc";
                renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
                tmpContext.fill();
            } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" ||
                       obj.name == "spinning spikes") {
                tmpContext.fillStyle = (obj.name == "poison spikes") ? "#7b935d" : "#939393";
                let tmpScale = (obj.scale * 0.6);
                renderStar(tmpContext, (obj.name == "spikes") ? 5 : 6, obj.scale, tmpScale);
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.fillStyle = "#a5974c";
                renderCircle(0, 0, tmpScale, tmpContext);
                tmpContext.fillStyle = "#c9b758";
                renderCircle(0, 0, tmpScale / 2, tmpContext, true);
            } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                tmpContext.fillStyle = "#a5974c";
                renderCircle(0, 0, reScale, tmpContext);
                tmpContext.fillStyle = "#c9b758";
                renderRectCircle(0, 0, reScale * 1.5, 29, 4, tmpContext);
                tmpContext.fillStyle = "#a5974c";
                renderCircle(0, 0, reScale * 0.5, tmpContext);
            } else if (obj.name == "mine") {
                tmpContext.fillStyle = "#939393";
                renderStar(tmpContext, 3, obj.scale, obj.scale);
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.fillStyle = "#bcbcbc";
                renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                tmpContext.fill();
            } else if (obj.name == "sapling") {
                for (let i = 0; i < 2; ++i) {
                    let tmpScale = obj.scale * (!i ? 1 : 0.5);
                    renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                    tmpContext.fillStyle = (!i ? "#9ebf57" : "#b4db62");
                    tmpContext.fill();
                    if (!i) tmpContext.stroke();
                }
            } else if (obj.name == "pit trap") {
                tmpContext.fillStyle = "#a5974c";
                renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.fillStyle = outlineColor;
                renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                tmpContext.fill();
            } else if (obj.name == "boost pad") {
                tmpContext.fillStyle = "#7e7f82";
                renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.fillStyle = "#dbd97d";
                renderTriangle(obj.scale * 1, tmpContext);
            } else if (obj.name == "turret") {
                tmpContext.fillStyle = "#a5974c";
                renderCircle(0, 0, obj.scale, tmpContext);
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.fillStyle = "#939393";
                let tmpLen = 50;
                renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
                renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                tmpContext.fill();
                tmpContext.stroke();
            } else if (obj.name == "platform") {
                tmpContext.fillStyle = "#cebd5f";
                let tmpCount = 4;
                let tmpS = obj.scale * 2;
                let tmpW = tmpS / tmpCount;
                let tmpX = -(obj.scale / 2);
                for (let i = 0; i < tmpCount; ++i) {
                    renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpX += tmpS / tmpCount;
                }
            } else if (obj.name == "healing pad") {
                tmpContext.fillStyle = "#7e7f82";
                renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.fillStyle = "#db6e6e";
                renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
            } else if (obj.name == "spawn pad") {
                tmpContext.fillStyle = "#7e7f82";
                renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.fillStyle = "#71aad6";
                renderCircle(0, 0, obj.scale * 0.6, tmpContext);
            } else if (obj.name == "blocker") {
                tmpContext.fillStyle = "#7e7f82";
                renderCircle(0, 0, obj.scale, tmpContext);
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.rotate(Math.PI / 4);
                tmpContext.fillStyle = "#db6e6e";
                renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
            } else if (obj.name == "teleporter") {
                tmpContext.fillStyle = "#7e7f82";
                renderCircle(0, 0, obj.scale, tmpContext);
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.rotate(Math.PI / 4);
                tmpContext.fillStyle = "#d76edb";
                renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
            }
        }
        tmpSprite = tmpCanvas;
        if (!asIcon) {
            itemSprites[obj.id] = tmpSprite;
        }
    }
    return tmpSprite;
}


function getItemSprite2(obj, tmpX, tmpY) {
    let tmpContext = mainContext;
    let reScale = (obj.name == "windmill" ? items.list[4].scale : obj.scale);
    tmpContext.save();
    tmpContext.translate(tmpX, tmpY);
    tmpContext.rotate(obj.dir);
    tmpContext.strokeStyle = outlineColor;
    tmpContext.lineWidth = outlineWidth;
    if (obj.name == "apple") {
        tmpContext.fillStyle = "#c15555";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fillStyle = "#89a54c";
        let leafDir = -(Math.PI / 2);
        renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir),
                   25, leafDir + Math.PI / 2, tmpContext);
    } else if (obj.name == "cookie") {
        tmpContext.fillStyle = "#cca861";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fillStyle = "#937c4b";
        let chips = 4;
        let rotVal = (Math.PI * 2) / chips;
        let tmpRange;
        for (let i = 0; i < chips; ++i) {
            tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
            renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                         UTILS.randInt(4, 5), tmpContext, true);
        }
    } else if (obj.name == "cheese") {
        tmpContext.fillStyle = "#f4f3ac";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fillStyle = "#c3c28b";
        let chips = 4;
        let rotVal = (Math.PI * 2) / chips;
        let tmpRange;
        for (let i = 0; i < chips; ++i) {
            tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
            renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                         UTILS.randInt(4, 5), tmpContext, true);
        }
    } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
        tmpContext.fillStyle = (obj.name == "castle wall") ? "#83898e" : (obj.name == "wood wall") ?
            "#a5974c" : "#939393";
        let sides = (obj.name == "castle wall") ? 4 : 3;
        renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = (obj.name == "castle wall") ? "#9da4aa" : (obj.name == "wood wall") ?
            "#c9b758" : "#bcbcbc";
        renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
        tmpContext.fill();
    } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" ||
               obj.name == "spinning spikes") {
        tmpContext.fillStyle = (obj.name == "poison spikes") ? "#7b935d" : "#939393";
        let tmpScale = (obj.scale * 0.6);
        renderStar(tmpContext, (obj.name == "spikes") ? 5 : 6, obj.scale, tmpScale);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, tmpScale, tmpContext);
        tmpContext.fillStyle = "#c9b758";
        renderCircle(0, 0, tmpScale / 2, tmpContext, true);
    } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, reScale, tmpContext);
        tmpContext.fillStyle = "#c9b758";
        renderRectCircle(0, 0, reScale * 1.5, 29, 4, tmpContext);
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, reScale * 0.5, tmpContext);
    } else if (obj.name == "mine") {
        tmpContext.fillStyle = "#939393";
        renderStar(tmpContext, 3, obj.scale, obj.scale);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#bcbcbc";
        renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
        tmpContext.fill();
    } else if (obj.name == "sapling") {
        for (let i = 0; i < 2; ++i) {
            let tmpScale = obj.scale * (!i ? 1 : 0.5);
            renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
            tmpContext.fillStyle = (!i ? "#9ebf57" : "#b4db62");
            tmpContext.fill();
            if (!i) tmpContext.stroke();
        }
    } else if (obj.name == "pit trap") {
        tmpContext.fillStyle = "#a5974c";
        renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = outlineColor;
        renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
        tmpContext.fill();
    } else if (obj.name == "boost pad") {
        tmpContext.fillStyle = "#7e7f82";
        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#dbd97d";
        renderTriangle(obj.scale * 1, tmpContext);
    } else if (obj.name == "turret") {
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#939393";
        let tmpLen = 50;
        renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
        renderCircle(0, 0, obj.scale * 0.6, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
    } else if (obj.name == "platform") {
        tmpContext.fillStyle = "#cebd5f";
        let tmpCount = 4;
        let tmpS = obj.scale * 2;
        let tmpW = tmpS / tmpCount;
        let tmpX = -(obj.scale / 2);
        for (let i = 0; i < tmpCount; ++i) {
            renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
            tmpX += tmpS / tmpCount;
        }
    } else if (obj.name == "healing pad") {
        tmpContext.fillStyle = "#7e7f82";
        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#db6e6e";
        renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
    } else if (obj.name == "spawn pad") {
        tmpContext.fillStyle = "#7e7f82";
        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#71aad6";
        renderCircle(0, 0, obj.scale * 0.6, tmpContext);
    } else if (obj.name == "blocker") {
        tmpContext.fillStyle = "#7e7f82";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.rotate(Math.PI / 4);
        tmpContext.fillStyle = "#db6e6e";
        renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
    } else if (obj.name == "teleporter") {
        tmpContext.fillStyle = "#7e7f82";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.rotate(Math.PI / 4);
        tmpContext.fillStyle = "#d76edb";
        renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
    }
    tmpContext.restore();
}

let objSprites = [];

function getObjSprite(obj) {
    let tmpSprite = objSprites[obj.id];
    if (!tmpSprite) {
        let tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = tmpCanvas.height = obj.scale * 2.5 + outlineWidth + (items.list[obj.id].spritePadding || 0);
        let tmpContext = tmpCanvas.getContext("2d");
        tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
        tmpContext.rotate(Math.PI / 2);
        tmpContext.strokeStyle = outlineColor;
        tmpContext.lineWidth = outlineWidth;
        if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
            tmpContext.fillStyle = obj.name == "poison spikes" ? "#7b935d" : "#939393";
            let tmpScale = obj.scale * 0.6;
            renderStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = "#fff";
            renderCircle(0, 0, tmpScale, tmpContext);
            tmpContext.fillStyle = "#FFB6C1";
            renderCircle(0, 0, tmpScale / 2, tmpContext, true);
        } else if (obj.name == "pit trap") {
            tmpContext.fillStyle = "#fff";
            renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = "#FFB6C1";
            renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
            tmpContext.fill();
        }
        tmpSprite = tmpCanvas;
        objSprites[obj.id] = tmpSprite;
    }
    return tmpSprite;
}

function getMarkSprite(obj, tmpContext, tmpX, tmpY) {
    let center = {
        x: screenWidth / 2,
        y: screenHeight / 2,
    };
    tmpContext.lineWidth = outlineWidth;
    mainContext.globalAlpha = 0.8;
    tmpContext.strokeStyle = outlineColor;
    tmpContext.save();
    tmpContext.translate(tmpX, tmpY);
    tmpContext.rotate(obj.dir || getAttackDir());
    if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
        tmpContext.fillStyle = (obj.name == "poison spikes")?"#00ff00":"#00ff00";
        var tmpScale = (obj.scale * 0.6);
        renderStar(tmpContext, (obj.name == "spikes")?5:6, obj.scale, tmpScale);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, tmpScale, tmpContext);
        if (player && obj.owner && player.sid != obj.owner.sid && !tmpObj.findAllianceBySid(obj.owner.sid)) {
            tmpContext.fillStyle = "#a34040";
        } else {
            tmpContext.fillStyle = "#c9b758";
        }
        renderCircle(0, 0, tmpScale/2, tmpContext, true);
    } else if (obj.name == "turret") {
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#939393";
        let tmpLen = 50;
        renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
        renderCircle(0, 0, obj.scale * 0.6, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
    } else if (obj.name == "teleporter") {
        tmpContext.fillStyle = "#7e7f82";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.rotate(Math.PI / 4);
        tmpContext.fillStyle = "#d76edb";
        renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
    } else if (obj.name == "platform") {
        tmpContext.fillStyle = "#cebd5f";
        let tmpCount = 4;
        let tmpS = obj.scale * 2;
        let tmpW = tmpS / tmpCount;
        let tmpX = -(obj.scale / 2);
        for (let i = 0; i < tmpCount; ++i) {
            renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
            tmpX += tmpS / tmpCount;
        }
    } else if (obj.name == "healing pad") {
        tmpContext.fillStyle = "#7e7f82";
        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#db6e6e";
        renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
    } else if (obj.name == "spawn pad") {
        tmpContext.fillStyle = "#7e7f82";
        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#71aad6";
        renderCircle(0, 0, obj.scale * 0.6, tmpContext);
    } else if (obj.name == "blocker") {
        tmpContext.fillStyle = "#7e7f82";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.rotate(Math.PI / 4);
        tmpContext.fillStyle = "#db6e6e";
        renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
    } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fillStyle = "#c9b758";
        renderRectCircle(0, 0, obj.scale * 1.5, 29, 4, tmpContext);
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, obj.scale * 0.5, tmpContext);
    } else if (obj.name == "pit trap") {
        tmpContext.fillStyle = "#a5974c";
        renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
        tmpContext.fill();
        tmpContext.stroke();
        if (player && obj.owner && player.sid != obj.owner.sid && !tmpObj.findAllianceBySid(obj.owner.sid)) {
            tmpContext.fillStyle = "#a34040";
        } else {
            tmpContext.fillStyle = outlineColor;
        }
        renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
        tmpContext.fill();
    }
    tmpContext.restore();
}

const renderDistance = 900;

function isOnScreen(x, y, s) {
    const distanceSquared = (x - maxScreenWidth / 2) ** 2 + (y - maxScreenHeight / 2) ** 2;
    // if you see this it means (N i k a) is original owner of this mod.
    return distanceSquared <= renderDistance ** 2;
}

    function renderGameObjects(layer, xOffset, yOffset) {
        let tmpSprite;
        let tmpX;
        let tmpY;
        liztobj.forEach((tmp) => {
            tmpObj = tmp;
            if (tmpObj.active && liztobj.includes(tmp) && tmpObj.render) {
                tmpX = tmpObj.x + tmpObj.xWiggle - xOffset;
                tmpY = tmpObj.y + tmpObj.yWiggle - yOffset;
                if (layer == 0) {
                    tmpObj.update(delta);
                }
                mainContext.globalAlpha = tmpObj.alpha;
                if (tmpObj.layer == layer && isOnScreen(tmpX, tmpY, tmpObj.scale + (tmpObj.blocker || 0))) {
                    if (tmpObj.isItem) {
                        if ((tmpObj.dmg || tmpObj.trap) && !tmpObj.isTeamObject(player)) {
                            tmpSprite = getObjSprite(tmpObj);
                        } else {
                            tmpSprite = getItemSprite(tmpObj);
                        }

                        mainContext.save();
                        mainContext.translate(tmpX, tmpY);
                        mainContext.rotate(tmpObj.dir);
                        if (!tmpObj.active) {
                            mainContext.scale(tmpObj.visScale / tmpObj.scale, tmpObj.visScale / tmpObj.scale);
                        }
                        mainContext.drawImage(tmpSprite, -(tmpSprite.width / 2), -(tmpSprite.height / 2));

                        if (tmpObj.blocker) {
                            mainContext.strokeStyle = "#db6e6e";
                            mainContext.globalAlpha = 0.3;
                            mainContext.lineWidth = 6;
                            renderCircle(0, 0, tmpObj.blocker, mainContext, false, true);
                        }
                        mainContext.restore();
                    } else {
                        tmpSprite = getResSprite(tmpObj);
                        mainContext.drawImage(tmpSprite, tmpX - (tmpSprite.width / 2), tmpY - (tmpSprite.height / 2));
                    }
                }
                if (layer == 3 && !useWasd) {
                    if (tmpObj.health < tmpObj.maxHealth) {
                        // HEALTH HOLDER:
                        mainContext.fillStyle = darkOutlineColor;
                        mainContext.roundRect(tmpX - config.healthBarWidth / 2 - config.healthBarPad, tmpY - config.healthBarPad, config.healthBarWidth + config.healthBarPad * 2, 17, 8);
                        mainContext.fill();

                        // HEALTH BAR:
                        mainContext.fillStyle = tmpObj.isTeamObject(player) ? "#001dff" : "#ff0000";
                        mainContext.roundRect(tmpX - config.healthBarWidth / 2, tmpY, config.healthBarWidth * (tmpObj.health / tmpObj.maxHealth), 17 - config.healthBarPad * 2, 7);
                        mainContext.fill();
                    }
                }
            }
        });

        // PLACE VISIBLE:
        if (layer == 0) {
            if (placeVisible.length) {
                placeVisible.forEach((places) => {
                    tmpX = places.x - xOffset;
                    tmpY = places.y - yOffset;
                    markObject(places, tmpX, tmpY);
                });
            }
        }
    }


function markObject(tmpObj, tmpX, tmpY) {
    getMarkSprite(tmpObj, mainContext, tmpX, tmpY);
}

class MapPing {
    constructor(color, scale) {
        this.init = function(x, y) {
            this.scale = 0;
            this.x = x;
            this.y = y;
            this.active = true;
        };
        this.update = function(ctxt, delta) {
            if (this.active) {
                this.scale += 0.05 * delta;
                if (this.scale >= scale) {
                    this.active = false;
                } else {
                    ctxt.globalAlpha = (1 - Math.max(0, this.scale / scale));
                    ctxt.beginPath();
                    ctxt.arc((this.x / config.mapScale) * mapDisplay.width, (this.y / config.mapScale) *
                             mapDisplay.width, this.scale, 0, 2 * Math.PI);
                    ctxt.stroke();
                }
            }
        };
        this.color = color;
    }
}

function pingMap(x, y) {
    tmpPing = mapPings.find(pings => !pings.active);
    if (!tmpPing) {
        tmpPing = new MapPing("#FFB6C1", config.mapPingScale);
        mapPings.push(tmpPing);
    }
    tmpPing.init(x, y);
}

function updateMapMarker() {
    mapMarker.x = player.x;
    mapMarker.y = player.y;
}

function renderMinimap(delta) {
    if (player && player.alive) {
        mapContext.clearRect(0, 0, mapDisplay.width, mapDisplay.height);

        mapContext.lineWidth = 4;
        for (let i = 0; i < mapPings.length; ++i) {
            tmpPing = mapPings[i];
            mapContext.strokeStyle = tmpPing.color;
            tmpPing.update(mapContext, delta);
        }

        mapContext.globalAlpha = 1;
        mapContext.fillStyle = "#FFB6C1";
        renderCircle((player.x / config.mapScale) * mapDisplay.width,
                     (player.y / config.mapScale) * mapDisplay.height, 7, mapContext, true);
        mapContext.fillStyle = "rgba(255, 182, 193, 0.35)";
        if (player.team && minimapData) {
            for (let i = 0; i < minimapData.length;) {
                renderCircle((minimapData[i] / config.mapScale) * mapDisplay.width,
                             (minimapData[i + 1] / config.mapScale) * mapDisplay.height, 7, mapContext, true);
                i += 2;
            }
        }

        if (lastDeath) {
            mapContext.fillStyle = "#fc5553";
            mapContext.font = "34px 'Comic Sans MS', cursive";
            mapContext.textBaseline = "middle";
            mapContext.textAlign = "center";
            mapContext.fillText("x", (lastDeath.x / config.mapScale) * mapDisplay.width,
                                (lastDeath.y / config.mapScale) * mapDisplay.height);
        }

        if (mapMarker) {
            mapContext.fillStyle = "#fff";
            mapContext.font = "34px 'Comic Sans MS', cursive";
            mapContext.textBaseline = "middle";
            mapContext.textAlign = "center";
            mapContext.fillText("x", (mapMarker.x / config.mapScale) * mapDisplay.width,
                                (mapMarker.y / config.mapScale) * mapDisplay.height);
        }
    }
}

let iconSprites = {};
let icons = ["crown", "skull"];

function loadIcons() {
    for (let i = 0; i < icons.length; ++i) {
        let tmpSprite = new Image();
        tmpSprite.onload = function() {
            this.isLoaded = true;
        };
        tmpSprite.src = "./../img/icons/" + icons[i] + ".png";
        iconSprites[icons[i]] = tmpSprite;
    }
}
loadIcons();

function cdf (e, t){
    try {
        return Math.hypot((t.y2||t.y)-(e.y2||e.y), (t.x2||t.x)-(e.x2||e.x));
    } catch(e){
        return Infinity;
    }
}

function updateGame() {

        if(gameObjects.length && inGame) {
            gameObjects.forEach((tmp) => {
                if(UTILS.getDistance(tmp.x, tmp.y, player.x, player.y) <= 1200) {
                    if(!liztobj.includes(tmp)) {
                        liztobj.push(tmp);
                        tmp.render = true;
                    }
                } else {
                    if(liztobj.includes(tmp)) {
                        if(UTILS.getDistance(tmp.x, tmp.y, player.x, player.y) >= 1200) {
                            tmp.render = false;
                            const index = liztobj.indexOf(tmp);
                            if (index > -1) { // only splice array when item is found
                                liztobj.splice(index, 1); // 2nd parameter means remove one item only
                            }
                        }
                    } else if(UTILS.getDistance(tmp.x, tmp.y, player.x, player.y) >= 1200) {
                        tmp.render = false;
                        const index = liztobj.indexOf(tmp);
                        if (index > -1) { // only splice array when item is found
                            liztobj.splice(index, 1); // 2nd parameter means remove one item only
                        }
                    } else {
                        tmp.render = false;
                        const index = liztobj.indexOf(tmp);
                        if (index > -1) { // only splice array when item is found
                            liztobj.splice(index, 1); // 2nd parameter means remove one item only
                        }
                    }
                }
            })
            // gameObjects = gameObjects.filter(e => UTILS.getDistance(e.x, e.y, player.x, player.y) <= 1000)
        }

    mainContext.beginPath();
    mainContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    mainContext.globalAlpha = 1;

    if (player) {
        let easingFactor = 0.1;
        camX += (player.x - camX) * easingFactor;
        camY += (player.y - camY) * easingFactor;
        let time = performance.now() * 0.002;
        let floatFactor = 1.5;
        camX += floatFactor * Math.sin(time);
        camY += floatFactor * Math.cos(time);
    } else {
        camX = config.mapScale / 2;
        camY = config.mapScale / 2;
    }

    // INTERPOLATE PLAYERS AND AI:
    let lastTime = now - (1000 / config.serverUpdateRate);
    let tmpDiff;
    for (let i = 0; i < players.length + ais.length; ++i) {
        tmpObj = players[i] || ais[i - players.length];
        if (tmpObj && tmpObj.visible) {
            if (tmpObj.forcePos) {
                tmpObj.x = tmpObj.x2;
                tmpObj.y = tmpObj.y2;
                tmpObj.dir = tmpObj.d2;
            } else {
                let total = tmpObj.t2 - tmpObj.t1;
                let fraction = lastTime - tmpObj.t1;
                let ratio = (fraction / total);
                let rate = 170;
                tmpObj.dt += delta;
                let tmpRate = Math.min(1.7, tmpObj.dt / rate);
                tmpDiff = (tmpObj.x2 - tmpObj.x1);
                tmpObj.x = tmpObj.x1 + (tmpDiff * tmpRate);
                tmpDiff = (tmpObj.y2 - tmpObj.y1);
                tmpObj.y = tmpObj.y1 + (tmpDiff * tmpRate);
                if (config.anotherVisual) {
                    tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
                } else {
                    tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
                }
            }
        }
    }

// RENDER CORDS:
    let xOffset = camX - (maxScreenWidth / 2);
    let yOffset = camY - (maxScreenHeight / 2);

    // RENDER BACKGROUND:
    if (config.snowBiomeTop - yOffset <= 0 && config.mapScale - config.snowBiomeTop - yOffset >= maxScreenHeight) {
        mainContext.fillStyle = "#b6db66";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.mapScale - config.snowBiomeTop - yOffset <= 0) {
        mainContext.fillStyle = "#dbc666";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.snowBiomeTop - yOffset >= maxScreenHeight) {
        mainContext.fillStyle = "#fff";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.snowBiomeTop - yOffset >= 0) {
        mainContext.fillStyle = "#fff";
        mainContext.fillRect(0, 0, maxScreenWidth, config.snowBiomeTop - yOffset);
        mainContext.fillStyle = "#b6db66";
        mainContext.fillRect(0, config.snowBiomeTop - yOffset, maxScreenWidth,
                             maxScreenHeight - (config.snowBiomeTop - yOffset));
    } else {
        mainContext.fillStyle = "#b6db66";
        mainContext.fillRect(0, 0, maxScreenWidth,
                             (config.mapScale - config.snowBiomeTop - yOffset));
        mainContext.fillStyle = "#dbc666";
        mainContext.fillRect(0, (config.mapScale - config.snowBiomeTop - yOffset), maxScreenWidth,
                             maxScreenHeight - (config.mapScale - config.snowBiomeTop - yOffset));
    }

    // RENDER WATER AREAS:
    if (!firstSetup) {
        waterMult += waterPlus * config.waveSpeed * delta;
        if (waterMult >= config.waveMax) {
            waterMult = config.waveMax;
            waterPlus = -1;
        } else if (waterMult <= 1) {
            waterMult = waterPlus = 1;
        }
        mainContext.globalAlpha = 1;
        mainContext.fillStyle = "#dbc666";
        renderWaterBodies(xOffset, yOffset, mainContext, config.riverPadding);
        mainContext.fillStyle = "#91b2db";
        renderWaterBodies(xOffset, yOffset, mainContext, (waterMult - 1) * 250);
    }

    // RENDER GRID:
    mainContext.lineWidth = 6;
    mainContext.strokeStyle = "#000";
    mainContext.globalAlpha = 0.06;
    mainContext.beginPath();
    for (let x = -camX; x < maxScreenWidth; x += useWasd ? 60 : 60) {
        if (x > 0) {
            mainContext.moveTo(x, 0);
            mainContext.lineTo(x, maxScreenHeight);
        }
    }
    for (let y = -camY; y < maxScreenHeight; y += useWasd ? 60 : 60) {
        if (y > 0) {
            mainContext.moveTo(0, y);
            mainContext.lineTo(maxScreenWidth, y);
        }
    }
    mainContext.stroke();

    // RENDER BOTTOM LAYER:
    mainContext.globalAlpha = 1;
    mainContext.strokeStyle = outlineColor;
    renderGameObjects(-1, xOffset, yOffset);

    // RENDER PROJECTILES:
    mainContext.globalAlpha = 1;
    mainContext.lineWidth = outlineWidth;
    renderProjectiles(0, xOffset, yOffset);

    // RENDER PLAYERS:
    renderPlayers(xOffset, yOffset, 0);

    // RENDER AI:
    mainContext.globalAlpha = 1;
    for (let i = 0; i < ais.length; ++i) {
        tmpObj = ais[i];
        if (tmpObj.active && tmpObj.visible) {
            tmpObj.animate(delta);
            mainContext.save();
            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
            mainContext.rotate(tmpObj.dir + tmpObj.dirPlus - (Math.PI / 2));
            renderAI(tmpObj, mainContext);
            mainContext.restore();
        }
    }

    // RENDER GAME OBJECTS (LAYERED):
    renderGameObjects(0, xOffset, yOffset);
    renderProjectiles(1, xOffset, yOffset);
    renderGameObjects(1, xOffset, yOffset);
    renderPlayers(xOffset, yOffset, 1);
    renderGameObjects(2, xOffset, yOffset);
    renderGameObjects(3, xOffset, yOffset);

    // MAP BOUNDARIES:
    mainContext.fillStyle = "#000";
    mainContext.globalAlpha = 0.09;
    if (xOffset <= 0) {
        mainContext.fillRect(0, 0, -xOffset, maxScreenHeight);
    }
    if (config.mapScale - xOffset <= maxScreenWidth) {
        let tmpY = Math.max(0, -yOffset);
        mainContext.fillRect(config.mapScale - xOffset, tmpY, maxScreenWidth - (config.mapScale - xOffset), maxScreenHeight - tmpY);
    }
    if (yOffset <= 0) {
        mainContext.fillRect(-xOffset, 0, maxScreenWidth + xOffset, -yOffset);
    }
    if (config.mapScale - yOffset <= maxScreenHeight) {
        let tmpX = Math.max(0, -xOffset);
        let tmpMin = 0;
        if (config.mapScale - xOffset <= maxScreenWidth)
            tmpMin = maxScreenWidth - (config.mapScale - xOffset);
        mainContext.fillRect(tmpX, config.mapScale - yOffset,
                             (maxScreenWidth - tmpX) - tmpMin, maxScreenHeight - (config.mapScale - yOffset));
    }

    // RENDER DAY/NIGHT TIME:
    mainContext.globalAlpha = 1;
    mainContext.fillStyle = "rgba(0, 0, 70, 0.35)";
    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);

    const nikaColors = {
        darkOutline: "#3d3f42",
        healthBarFriend: "#ff9999",
        healthBarFoe: "#ffcc99",
        background: "#fff8e7",
        tracer: "#ffb3b3",
        nameFill: "#ffebcc"
    };

    // RENDER PLAYER AND AI UI:
    mainContext.strokeStyle = nikaColors.darkOutline;
    mainContext.globalAlpha = 1;
    for (let i = 0; i < players.length + ais.length; ++i) {
        tmpObj = players[i] || ais[i - players.length];
        if (tmpObj.visible) {
            mainContext.strokeStyle = nikaColors.darkOutline;
            if (tmpObj.skinIndex != 10 || (tmpObj === player) || (tmpObj.team && tmpObj.team == player.team)) {
                let tmpText = (tmpObj.team ? "[" + tmpObj.team + "] " : "") + (tmpObj.name || "") + (" [" + tmpObj.shameCount + "]");
                if (!recording) {
                    player.name = originalName;
                } else {
                    player.name = "unknown";
                }
                if (tmpText != "") {
                    mainContext.font = (tmpObj.nameScale || 30) + "px 'Comic Sans MS', cursive";
                                            mainContext.fillStyle = "#fff";
                                            mainContext.textBaseline = "middle";
                                            mainContext.textAlign = "center";
                                            mainContext.lineWidth = (tmpObj.nameScale?11:8);
                                            mainContext.lineJoin = "round";
                                            mainContext.strokeText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                                            mainContext.fillText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                    config.healthBarPad = 4;


                    if (tmpObj.isLeader && iconSprites.crown.isLoaded) {
                        let tmpS = config.crownIconScale;
                        let tmpX = tmpObj.x - xOffset - (tmpS / 2) - (mainContext.measureText(tmpText).width / 2) - config.crownPad;
                        mainContext.drawImage(iconSprites.crown, tmpX, (tmpObj.y - yOffset - tmpObj.scale)
                                              - config.nameY - (tmpS / 2) - 5, tmpS, tmpS);
                    }


                    if (tmpObj.iconIndex == 1 && iconSprites.skull.isLoaded) {
                        let tmpS = config.crownIconScale;
                        let tmpX = tmpObj.x - xOffset - (tmpS / 2) + (mainContext.measureText(tmpText).width / 2) + config.crownPad;
                        mainContext.drawImage(iconSprites.skull, tmpX, (tmpObj.y - yOffset - tmpObj.scale)
                                              - config.nameY - (tmpS / 2) - 5, tmpS, tmpS);
                    }


                    if (tmpObj.isPlayer && instaC.wait && near == tmpObj && enemy.length) {
                        let tmpS = tmpObj.scale * 20;
                        mainContext.beginPath();
                        mainContext.arc(tmpObj.x - xOffset, tmpObj.y - yOffset, 3, 0, 2 * Math.PI);
                        mainContext.fillStyle = 'red';
                        mainContext.fill();
                    }
                }


                if (tmpObj.health > 0) {
                    mainContext.fillStyle = nikaColors.darkOutline;
                    mainContext.roundRect(
                        tmpObj.x - xOffset - (config.healthBarWidth + config.healthBarPad),
                        tmpObj.y - yOffset + tmpObj.scale + config.nameY,
                        (config.healthBarWidth * 2) + (config.healthBarPad * 2),
                        17,
                        8
                    );
                    mainContext.fill();

                    const healthBarColor = (tmpObj === player || (tmpObj.team && tmpObj.team === player.team)) ? nikaColors.healthBarFriend : nikaColors.healthBarFoe;
                    mainContext.fillStyle = healthBarColor;
                    mainContext.roundRect(
                        tmpObj.x - xOffset - config.healthBarWidth,
                        tmpObj.y - yOffset + tmpObj.scale + config.nameY + config.healthBarPad,
                        (config.healthBarWidth * 2) * (tmpObj.health / tmpObj.maxHealth),
                        17 - (config.healthBarPad * 2),
                        7
                    );
                    mainContext.fill();

                    mainContext.save();

                    if (tmpObj.isPlayer) {

                        let reloads = {
                            primary: (tmpObj.primaryIndex == undefined ? 1 : ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed)),
                            secondary: (tmpObj.secondaryIndex == undefined ? 1 : ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed)),
                            turret: (2500 - tmpObj.reloads[53]) / 2500
                        };


                                        // SECONDARY RELOAD HOLDER:
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarPad + 5,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, (config.healthBarWidth-5) +
                                                              (config.healthBarPad * 2), 17, 8);
                                        mainContext.fill();

                                        // SECONDARY RELOAD BAR:
                                        mainContext.fillStyle = "#A19C4E";
                                        mainContext.roundRect(tmpObj.x - xOffset + 5,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                              (config.healthBarWidth * reloads.secondary) - 5, 17 - config.healthBarPad * 2, 7);
                                        mainContext.fill();

                                        // PRIMARY RELOAD HOLDER:
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, config.healthBarWidth +
                                                              (config.healthBarPad * 2) - 5, 17, 8);
                                        mainContext.fill();

                                        // PRIMARY RELOAD BAR:
                                        mainContext.fillStyle = "#A19C4E"
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                              (config.healthBarWidth * reloads.primary) - 5, 17 - config.healthBarPad * 2, 7);
                                        mainContext.fill();

                                        if(tmpObj === player) {
                                            mainContext.fillStyle = "#fff";
                                            mainContext.strokeText("[" + instaC.isTrue + "/" + my.antiSync + "/" + ms.max + "," + window.pingTime + "," + ms.avg + "]", tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 135);
                                            mainContext.fillText("[" + instaC.isTrue + "/" + my.antiSync + "/" + ms.max + "," + window.pingTime + "," + ms.avg + "]", tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 135);
                                        }

                        const playerX = player.x - xOffset;
                        const playerY = player.y - yOffset;
                        const enemyX = tmpObj.x - xOffset;
                        const enemyY = tmpObj.y - yOffset;
                        const distance = Math.sqrt(Math.pow(playerX - enemyX, 2) + Math.pow(playerY - enemyY, 2));
                        const maxTracingDistance = 250;


                        if (!tmpObj.isTeam(player) && distance >= maxTracingDistance) {
                            mainContext.lineWidth = 3;
                            mainContext.strokeStyle = nikaColors.tracer;
                            mainContext.beginPath();
                            mainContext.moveTo(playerX, playerY);
                            mainContext.lineTo(enemyX, enemyY);
                            mainContext.stroke();
                        }
                    }
                    mainContext.restore();
                }
            }
        }
    }

    textManager.update(delta, mainContext, xOffset, yOffset);

    CanvasRenderingContext2D.prototype.roundRectWithTailAndEars = function(x, y, width, height, radius, tailSize, earSize) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        this.beginPath();
        this.moveTo(x + radius, y);
        this.arcTo(x + width, y, x + width, y + height, radius);
        this.arcTo(x + width, y + height, x, y + height, radius);
        this.arcTo(x, y + height, x, y, radius);
        this.arcTo(x, y, x + width, y, radius);
        this.closePath();

        this.moveTo(x + width / 2 - tailSize / 2, y + height);
        this.lineTo(x + width / 2, y + height + tailSize);
        this.lineTo(x + width / 2 + tailSize / 2, y + height);
        this.closePath();

        this.moveTo(x + width / 4 - earSize / 2, y);
        this.quadraticCurveTo(x + width / 4, y - earSize, x + width / 4 + earSize / 2, y);
        this.closePath();

        this.moveTo(x + 3 * width / 4 - earSize / 2, y);
        this.quadraticCurveTo(x + 3 * width / 4, y - earSize, x + 3 * width / 4 + earSize / 2, y);
        this.closePath();

        return this;
    };

    // UNDER TEXT:
    players.forEach((tmp) => {
        tmpObj = tmp;
        if (tmpObj.visible && tmpObj.chatCountdown > 0) {
            tmpObj.chatCountdown = Math.max(0, (tmpObj.chatCountdown -= delta));
            mainContext.font = "32px 'Comic Sans MS', cursive";
            var tmpSize = mainContext.measureText(tmpObj.chatMessage);
            mainContext.textBaseline = "middle";
            mainContext.textAlign = "center";
            var tmpX = tmpObj.x - xOffset;
            var tmpY = tmpObj.y - tmpObj.scale - yOffset - 90;
            var tmpH = 47;
            var tmpW = tmpSize.width + 30;
            var padding = 10;
            var tailSize = 12;
            var earSize = 30;
            var bubbleColor = "rgba(0, 0, 0, 0.25)";
            var textColor = "#fff";

            mainContext.roundRectWithTailAndEars(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 15, tailSize, earSize);
            mainContext.fillStyle = bubbleColor;
            mainContext.fill();

            mainContext.fillStyle = textColor;
            mainContext.fillText(tmpObj.chatMessage, tmpX, tmpY);
        }
    });

    mainContext.globalAlpha = 1;
    renderMinimap(delta);
}

window.requestAnimFrame = function() {
    return null;
}
window.rAF = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
        window.setTimeout(callback, 1000/9);
    };
})();

function doUpdate() {
    now = performance.now();
    delta = now - lastUpdate;
    lastUpdate = now;
    updateGame();
    rAF(doUpdate);
    ms.avg = Math.round((ms.min+ms.max)/2);
}

prepareMenuBackground();
doUpdate();

function toggleUseless(boolean) {
    getEl("instaType").disabled = boolean;
    getEl("antiBullType").disabled = boolean;
    getEl("predictType").disabled = boolean;
}
toggleUseless(useWasd);

window.debug = function() {
    my.waitHit = 0;
    my.autoAim = false;
    instaC.isTrue = false;
    traps.inTrap = false;
    itemSprites = [];
    objSprites = [];
    gameObjectSprites = [];
    skinSprites = [];
    skinPointers = [];
    skinSprites2 = [];
    skinPointers2 = [];
    accessSprites = [];
    toolSprites = [];
    projectileSprites = [];
    aiSprites = [];
    console.clear();
};

window.wasdMode = function() {
    useWasd = !useWasd;
    toggleUseless(useWasd);
};

window.startGrind = function() {
    if (getEl("weaponGrind").checked) {
        for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
            checkPlace(player.getItemType(22), i);
        }
    }
};

window.resBuild = function() {
    if (gameObjects.length) {
        gameObjects.forEach((tmp) => {
            tmp.breakObj = false;
        });
        breakObjects = [];
    }
};

window.toggleVisual = function() {
    config.anotherVisual = !config.anotherVisual;
    gameObjects.forEach((tmp) => {
        if (tmp.active) {
            tmp.dir = tmp.lastDir;
        }
    });
};

window.prepareUI = function(tmpObj) {
    resize();
    var chatBox = document.getElementById("chatBox");
    var chatHolder = document.getElementById("chatHolder");
    var suggestBox = document.createElement("div");
    suggestBox.id = "suggestBox";

    var prevChats = [];
    var prevChatsIndex = 0;

    function toggleChat() {
        if (!usingTouch) {
            if (chatHolder.style.display == "block") {
                if (chatBox.value) {
                    sendChat(chatBox.value);
                }
                closeChat();
            } else {
                storeMenu.style.display = "none";
                allianceMenu.style.display = "none";
                chatHolder.style.display = "block";
                chatBox.focus();
                resetMoveDir();
            }
        } else {
            setTimeout(function () {
                var chatMessage = prompt("chat message");
                if (chatMessage) {
                    sendChat(chatMessage);
                }
            }, 1);
        }
        chatBox.value = "";
        (() => {
            prevChatsIndex = 0;
        })();
    }

    function closeChat() {
        chatBox.value = "";
        chatHolder.style.display = "none";
    }

    for (let i = 0; i < (items.list.length + items.weapons.length); ++i) {
        (function (i) {
            let tmpCanvas = document.createElement("canvas");
            tmpCanvas.width = tmpCanvas.height = 66;
            let tmpContext = tmpCanvas.getContext("2d");
            tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
            tmpContext.imageSmoothingEnabled = false;
            tmpContext.webkitImageSmoothingEnabled = false;
            tmpContext.mozImageSmoothingEnabled = false;

            if (items.weapons[i]) {
                tmpContext.rotate((Math.PI / 4) + Math.PI);
                let tmpSprite = new Image();
                toolSprites[items.weapons[i].src] = tmpSprite;
                tmpSprite.onload = function () {
                    this.isLoaded = true;
                    let tmpPad = 1 / (this.height / this.width);
                    let tmpMlt = (items.weapons[i].iPad || 1);
                    tmpContext.drawImage(this, -(tmpCanvas.width * tmpMlt * config.iconPad * tmpPad) / 2, -(tmpCanvas.height * tmpMlt * config.iconPad) / 2,
                                         tmpCanvas.width * tmpMlt * tmpPad * config.iconPad, tmpCanvas.height * tmpMlt * config.iconPad);
                    tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                    tmpContext.globalCompositeOperation = "source-atop";
                    tmpContext.fillRect(-tmpCanvas.width / 2, -tmpCanvas.height / 2, tmpCanvas.width, tmpCanvas.height);
                    getEl('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                };
                tmpSprite.src = "./../img/weapons/" + items.weapons[i].src + ".png";
                let tmpUnit = getEl('actionBarItem' + i);
                tmpUnit.onmouseover = UTILS.checkTrusted(function () {
                    showItemInfo(items.weapons[i], true);
                });
                tmpUnit.onclick = UTILS.checkTrusted(function () {
                    selectWeapon(tmpObj.weapons[items.weapons[i].type]);
                });
                UTILS.hookTouchEvents(tmpUnit);
            } else {
                let tmpSprite = getItemSprite(items.list[i - items.weapons.length], true);
                let tmpScale = Math.min(tmpCanvas.width - config.iconPadding, tmpSprite.width);
                tmpContext.globalAlpha = 1;
                tmpContext.drawImage(tmpSprite, -tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                tmpContext.globalCompositeOperation = "source-atop";
                tmpContext.fillRect(-tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                getEl('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                let tmpUnit = getEl('actionBarItem' + i);
                tmpUnit.onmouseover = UTILS.checkTrusted(function () {
                    showItemInfo(items.list[i - items.weapons.length]);
                });
                tmpUnit.onclick = UTILS.checkTrusted(function () {
                    selectToBuild(tmpObj.items[tmpObj.getItemType(i - items.weapons.length)]);
                });
                UTILS.hookTouchEvents(tmpUnit);
            }
        })(i);
    }
};
window.profineTest = function(data) {
    if (data) {
        let name = data + "";
        name = name.slice(0, config.maxNameLength);

        return name;
    }
};