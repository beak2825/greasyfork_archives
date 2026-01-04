// ==UserScript==
// @name         !!~~~>Magnet mod<~~~!!
// @version      6
// @author       Project Victory
// @description  Unpatched
// @match        *://*.moomoo.io/*
// @grant        none
// @namespace https://greasyfork.org/users/1297423
// @downloadURL https://update.greasyfork.org/scripts/494194/%21%21~~~%3EMagnet%20mod%3C~~~%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/494194/%21%21~~~%3EMagnet%20mod%3C~~~%21%21.meta.js
// ==/UserScript==

var RainbowCycle = 0;
var cycle = 0;
var HPBarColor = "black";
var NameBarColor = "black";
setInterval(() => {
    if (RainbowCycle > 359) {
        // If Rainbow Reached Maximum
        RainbowCycle = 0; // Restart ();
    } else {
        /*for(let i = 0; i< 30; i++)*/ RainbowCycle++;
        //RainbowCycle++;
        HPBarColor = `hsla(${RainbowCycle}, 100%, 50%, 30)`;
    }
}, 20);
//http://127.0.0.1:5500/

let useHack = true;

let log = console.log;
let testMode = window.location.hostname == "127.0.0.1";
let imueheua = false;

function getEl(id) {
    return document.getElementById(id);
}

! function(run) {
    if (!run) return;
    let codes = {
        setup: () => {
            "use strict";

            let newFont = document.createElement("link");
            newFont.rel = "stylesheet";
            newFont.href = "https://fonts.googleapis.com/css?family=Ubuntu:700";
            newFont.type = "text/css";
            document.body.append(newFont);

            let min = document.createElement("script");
            min.src = "https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js";
            document.body.append(min);
        },
        main: () => {

            if (!useHack) {
                return;
            }

            "use strict";

            let o = window.config;

            // CLIENT:
            o.clientSendRate = 0; // Aim Packet Send Rate
            o.serverUpdateRate = 9;

            // UI:
            o.deathFadeout = 0;

            // CHECK IN SANDBOX:
            o.isSandbox = window.location.hostname == "sandbox.moomoo.io";

            // CUSTOMIZATION:
            o.skinColors = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373", "#91b2db"];
            o.weaponVariants = [{
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

            // VISUAL:
            o.anotherVisual = false;
            o.useWebGl = false;
            o.resetRender = false;

            function waitTime(timeout) {
                return new Promise((done) => {
                    setTimeout(() => {
                        done();
                    }, timeout);
                });
            }

            let changed = false;
            let botSkts = [];

            // STORAGE:
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

            // CONFIGS:
            let gC = function(a, b) {
                try {
                    let res = JSON.parse(getSavedVal(a));
                    if (typeof res === "object") {
                        return b;
                    } else {
                        return res;
                    }
                } catch (e) {
                    alert("dieskid");
                    return b;
                }
            };

            function setCommands() {
                return {
                    "help": {
                        desc: "Show Commands",
                        action: function(message) {
                            for (let cmds in commands) {
                                addMenuChText("/" + cmds, commands[cmds].desc, "lime", 1);
                            }
                        }
                    },
                    "clear": {
                        desc: "Clear Chats",
                        action: function(message) {
                            resetMenuChText();
                        }
                    },
                    "debug": {
                        desc: "Debug Mod For Development",
                        action: function(message) {
                            addDeadPlayer(player);
                            addMenuChText("Debug", "Done", "#99ee99", 1);
                        }
                    },
                    "play": {
                        desc: "Play Music ( /play [link] )",
                        action: function(message) {
                            let link = message.split(" ");
                            if (link[1]) {
                                let audio = new Audio(link[1]);
                                audio.play();
                            } else {
                                addMenuChText("Warn", "Enter Link ( /play [link] )", "#99ee99", 1);
                            }
                        }
                    },
                    "bye": {
                        desc: "Leave Game",
                        action: function(message) {
                            window.leave();
                        }
                    },
                };
            }

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
                    attackDir: true,
                    noDir: false,
                    showDir: false,
                    autoRespawn: false,
                    fpsboost: false,
                    PredictiveBull: true,
                    doTickHealing: true,
                    ShowStacked: true,
                    doUpperCaseChatting: true,
                    TryHardMode: true,
                    ReverseInstaPatched: true,
                    PredictivePlacer: true,
                    PredictiveInsta: true,
                    AntiBowInsta: true,
                    PredictiveHeal: true,
                    doSimpleAntiInsta: true,
                    HoldingQforlag: true,
                    doAutoBullTick: true,
                    doRenderKMTexture: true,
                    doAntiKickAtPacketLimit: true,
                    AddAdditionalRangeOnLag: true,
                    FastTurretHatPATCHED: false,
                    SecondaryOnCounter: true,
                    doAutoSpinningPATCHED: false,
                    AutoAttackPATCHED: false,
                };
            }

            let commands = setCommands();
            let os = setConfigs();

            window.removeConfigs = function() {
                for (let cF in os) {
                    deleteVal(cF, os[cF]);
                }
            };

            for (let cF in os) {
                os[cF] = gC(cF, os[cF]);
            }

            // MENU FUNCTIONS:
            window.changeMenu = function() {};
            window.debug = function() {};
            window.toggleNight = function() {};
            window.wasdMode = function() {};

            // PAGE 1:
            window.startGrind = function() {};

            // PAGE 3:
            window.connectFillBots = function() {};
            window.destroyFillBots = function() {};
            window.tryConnectBots = function() {};
            window.destroyBots = function() {};
            window.resBuild = function() {};
            window.toggleBotsCircle = function() {};
            window.toggleVisual = function() {};

            // SOME FUNCTIONS:
            window.prepareUI = function() {};
            window.leave = function() {};

            // nah hahahahahhh why good ping
            window.ping = imueheua ? 86 : 0;

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

                            //getEl(setting.id).style.color = setting.menu[options] ? "#8ecc51" : "#cc5151";

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

                        //getEl(setting.id).style.color = setting.menu[last.split("_")[1]] ? "#8ecc51" : "#fff";

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

            let HTML2 = new Html();





function getEl(id) {
    return document.getElementById(id);
}
let firstConfig = [];
let streamerMode = false;
const HTML = {
    newLine: function(amount) {
        let text = ``;
        for (let i = 0; i < amount; i++) {
            text += `<br>`;
        }
        return text;
    },
    line: function() {
        return `<hr>`;
    },
    text: function(id, value, size, length) {
        return `<input type = "text" id = ${id} size = ${size} value = ${value} maxlength = ${length}>`;
    },
    checkBox: function(id, name, checked, rl) {
        return `${rl ? name + ` ` : ``}<input type = "checkbox" ${checked ? `checked` : ``} id = ${id}>${rl ? `` : ` ` + name}`;
    },
    button: function(id, name, onclick, classs) {
        return `<button class = ${classs} id = ${id} onclick = ${onclick}>${name}</button>`;
    },
    select: function(id, selects) {
        let text = `<select id = ${id}>`;
        selects.forEach((e,i)=>{
            text += `<option value = ${e.value} ${e.selected ? ` selected` : ``}>${e.name}</option>`;
            if (i == selects.length - 1) {
                text += `</select>`;
            }
        }
                       );
        return text;
    },
    modChange: function(id, selects) {
        console.log("test");
    },
    mod: function(id, selects) {
        let text = `<select id = ${id}>`;
        selects.forEach((e,i)=>{
            text += `<option value = ${e.value + "C"}>${e.name}</option>`;
            if (i == selects.length - 1) {
                text += `</select> `;
            }
            if (i == 0) {
                firstConfig.push(e.value + "C");
            }
        }
                       );
        selects.forEach((e,i)=>{
            text += `<input type = "checkbox"  ${e.checked ? `checked` : ``} id = ${e.value} style = "${i == 0 ? "display: inline-block;" : "display: none;"}">`;
        }
                       );
        return text;
    },
    hotkey: function(id, value, size, length) {
        return `<input type = "text" id = ${id} size = ${size} value = ${value} maxlength = ${length}><input type = "checkbox" checked id = ${id + "k"}>`;
    },
    hotkey2: function(id, value, size, length) {
        return `<input type = "text" id = ${id} size = ${size} value = ${value} maxlength = ${length}>`;
    },
    BetttttaCh: function(id) {
        return `<input type = "checkbox" checked id = ${id + "k"}>`;
    },



};



var toggles = {};
window.toggles = toggles;
function generateNewToggle(label, id, isChecked, style) {
    toggles[id] = function() {
        return document.getElementById(id).checked;
    };
    return `
        ${label} <input type="checkbox" style="cursor: pointer;${style ? " " + style : ""}" id="${id}" ${isChecked}>
        `;
    }
function generateNewList(label, id, configs) {
    let content = `${label} <select id="${id}">`;
    for(let i = 0; i < configs.length; i++) {
        content += `<option value="${configs[i][0]}">${configs[i][1]}</option>`;
    }
    content += `</select>`;
    return content;
}
function setConfig(elements, id) {
    for(let i = 0; i < elements.length; i++) {
        document.getElementById(elements[i][3]).style.display = id == elements[i][0] ? "inline-block" : "none";
    }
}
function addEventListen(id, configs) {
    let interval = setInterval(() => {
        if(document.getElementById(id) != null) {
            document.getElementById(id).addEventListener("change", function() {
                setConfig(configs, document.getElementById(id).value);
            });
            clearInterval(interval);
        }
    }, 0);
}
function generateNewConfig(label, id, configs) {
    let content = `${label} <select id="${id}">`;
    for(let i = 0; i < configs.length; i++) {
        content += `<option value="${configs[i][0]}">${configs[i][1]}</option>`;
    }
    content += `</select>`;
    for(let i = 0; i < configs.length; i++) {
        content += generateNewToggle("", configs[i][3], configs[i][2], !i ? "display: inline-block;" : "display: none;");
    }
    addEventListen(id, configs);
    return content;
}













/*
 */
let Wut = "Select";
// menu html
let modMenus = document.createElement("div");
modMenus.id = "modMenus";
document.body.append(modMenus);
modMenus.style = `
display: block;
padding: 10px;
border-radius: 15px;
background-color: rgba(0, 0, 0, 0.25);
border-radius: 3px;
position: absolute;
left: 20px;
top: 20px;
min-width: 300px;
max-width: 410px;
min-height: 400;
max-height 400px;
transition: 1s;
`;
let canmove = true;



function updateInnerHTML() {
    modMenus.innerHTML = `
    <style>
    .tabchange {
    color: #fff;
    background-color: #000;
    border: 2px solid transparent;
    border-radius: 4px;
    text-align: center;
    height: 25px;
    }
    .menuTabs {
    padding-left: 5px;
    padding-top: 5px;
    padding-bottom: 5px;
    }
    .holder {
    padding-left: 1em;
    }
    .nothing {
    }
  .inLINE {
    display: inline-block;
  }





    </style>
    <script>
    function test() {
    console.log("call");
    }
    </script>
    <div id = "headline" style = "font-size: 30px; color: rgb(255, 255, 255);">
    Magick:





    <div style="font-size: 12px; overflow-y: scroll; max-height: 150px;">





    <div>
    ${HTML.button("boosteruseitems", "Toggle Booster w/ item", "", "nothing")}<br>
    ${HTML.button("PlaceEveryTickTogl", "Toggle PlaceEveryTick", "", "nothing")} | <span id = "placestatus">true</span>
    </div>




    Create clan: ${HTML.text("ccv", "clan", "20", "7")}${HTML.button("ccf", "Create clan", `document.createAlliance(document.getElementById("ccv").value)`, "nothing")}<br>













    ${HTML.select("autoupgrade", [
        { name: "Autoupgrade to DH", value: "dh", },
        { name: "Autoupgrade to KH", value: "kh", },
        { name: "Autoupgrade to PH", value: "ph", },
        { name: "Autoupgrade to SM", value: "sm", },
        { name: "Autoupgrade to PM", value: "pm", },
        { name: "Autoupgrade to KM", value: "km", },
        { name: "Autoupgrade to DM", value: "dm", },
    ])}
    ${HTML.checkBox("aaauaua", "", false)}<br>
    7-Slot: ${HTML.select("7slot", [{
        name: "Teleporter",
        value: "38",
        selected: true,
    }, {
        name: "Turret",
        value: "33",
    }, {
        name: "Platform",
        value: "34",
    }, {
        name: "Healing pad",
        value: "35",
    }, {
        name: "Blocker",
        value: "37",
    }, ])}<br>


    Upgrade To Insta: ${HTML.select("upgradeinstatypebad", [{
        name: "SM",
        value: "sm",
    }, {
        name: "KH",
        value: "kh",
    }, {
        name: "HP",
        value: "hp",
    }, ])}
    ${HTML.checkBox("upgradeinstatypeCheck", "", true)}<br>




    ${HTML.mod("os", [
        { name: "doBuildingHealth", value: "bh", checked: true, },
        { name: "AddAdditionalRangeOnLag", value: "addictdist", checked: true, },
        { name: "doAntiKickAtPacketLimit", value: "ak", checked: true, },
        { name: "doAutoBullTick", value: "bulltick", checked: true, },
        { name: "doAutoOneTick", value: "aOT", checked: true, },
        { name: "doUseAutoInstaPress", value: "useautoInstaong", checked: true, },
        { name: "doWheelUseHats", value: "wheelUseHats", },
        { name: "doBetaAntiSync", value: "antisync", checked: true, },
        { name: "doAutoQOnHighPing", value: "autoq", },
        { name: "doPermanentAutoQ", value: "evautoq", },
        { name: "pABUser", value: "usepabprosecc", checked: true, },
        { name: "doSimpleAntiInsta", value: "simpleheal", checked: true, },
        { name: "doTickBasedHealing", value: "tickheal", checked: true, },
        { name: "doAutoReplace", value: "replc", checked: true, },
        { name: "doPrePlace", value: "preplacer", checked: true, },
        { name: "doPlacementEveryTick", value: "abplace", checked: true, },
        { name: "doAutoSpikeTickOnReplaced", value: "spiketick", checked: true, },
        { name: "doExtraAutoSpikeTick", value: "ExtraSpikeTick1", checked: true, },
        { name: "doPermanentAntiEmp", value: "simpleEmpAnti", },
        { name: "doUseTurretOnCounter", value: "countertur", checked: true, },
        { name: "doUseSecondaryOnCounter", value: "countersec", },
        { name: "doClickCombat", value: "clicktype", },
        { name: "doInstaOneShot", value: "oneShotInsta", checked: true, },
        { name: "doAutoSpinning", value: "spin", },
        { name: "doAutoBuyHats", value: "autoBuyHats1beta", },
        { name: "doAutoGG", value: "autogg", checked: true, },
        { name: "doAutoSync", value: "autosyncsec", checked: true, },
        { name: "doAutoSyncHit", value: "autosyncHited", checked: true, },
        { name: "doUpperCaseChatting", value: "chatc", },
        { name: "doTryHardMode", value: "tryhard", checked: true, },
        { name: "doAlwaysRevInsta", value: "alwaysrev", },
        { name: "doTurretReloadBar", value: "turrreloadbars", },
        { name: "doRenderKMTexture", value: "kmtexture", checked: true, },
        { name: "doShowStackedAnimtext", value: "stacktext", },
        { name: "doDisableAnimtext", value: "hidetext", },
        { name: "doWeaponRange", value: "WeaponRange", checked: true, },
        { name: "doEnemyInfoStatus", value: "EnemyDtatInfoBar", checked: true, },
        { name: "doSmartEmpSoldierAnti", value: "SmartEmpSoldierAnti", checked: true, },
        { name: "combatheal", value: "1v4heal", },
        { name: "doPlacementVisual", value: "placeVis", },
        { name: "doWeaponRange", value: "backupNobull", checked: true, },
        { name: "doEnemyInfoStatus", value: "turretCombat", checked: true, },
        { name: "doSmartEmpSoldierAnti", value: "safeAntiSpikeTick", checked: true, },
        { name: "doBotMovementToNear", value: "botmove", },
        { name: "doShowBotsOnMinimap", value: "showbotsonmap", checked: true, },
        { name: "doBotsShowEnemy", value: "botusetracers", },
    ])}<br>

    ${HTML.checkBox("weaponGrind", "Ruby farm?", false)}<br>
    ${HTML.checkBox("grindsec", "autoRubySec", true)}<br>

    <div id = "freeCam">Freecam: none</div>


    <br><br>






    Freecam hotkey: ${HTML.hotkey("freecumLOL", "/", "2", "1")}<br>
    Debug hotkey: ${HTML.hotkey("debugkey", "Z", "2", "1")}<br>
    Bot connector hotkey: ${HTML.hotkey("botkey", "G", "2", "1")}<br>
    No-Bull management hotkey: ${HTML.hotkey2("NobullMangeKey", "T", "2", "1")}
    ${HTML.select("NBmanStats", [{
        name: "None",
        value: "none",
    }, {
        name: "increment NB Count",
        value: "INnbCn",
        selected: true,
    }, ])}
    ${HTML.BetttttaCh("NobullMangeKey")}<br>
    Spike hotkey: ${HTML.hotkey("spikekey", "v", "2", "1")}<br>
    Trap/Boost hotkey: ${HTML.hotkey("trapkey", "f", "2", "1")}<br>
    Healing hotkey: ${HTML.hotkey("Qhotkeys", "q", "2", "1")}<br>
    Instakill hotkey: ${HTML.hotkey("instakillkey", "r", "2", "1")}<br>
    Autobull hotkey: ${HTML.hotkey("autobullkey", "j", "2", "1")}<br>
    Turret/Teleport hotkey: ${HTML.hotkey("turretkey", "h", "2", "1")}<br>
    3x compact windmills hotkey: ${HTML.hotkey("3windmillskey", "b", "2", "1")}<br>
    Toggle advanced placer hotkey: ${HTML.hotkey("millkey", "z", "2", "1")}<br>
    One Tick insta hotkey: ${HTML.hotkey("lagkey", "t", "2", "1")}<br>
    Ratio hotkey: ${HTML.hotkey("ezkey", "@", "2", "1")}<br>
    Zoom hotkey: ${HTML.hotkey("zoomkey", "-", "2", "1")}<br>
    Zoom reset key: ${HTML.hotkey("zoomresetkey", "=", "2", "1")}<br>
    Song hotkey: ${HTML.hotkey("songkey", "C", "2", "1")}<br>
    Song: ${HTML.select("songs", [{
        name: "CRVN - Nobody",
        value: "1",
    }, {
        name: "Dave Rodgers - Ae86",
        value: "2",
    }, {
        name: "Dr Love - Don't Stand So Close",
        value: "3",
    }, {
        name: "Domastic - Heartless",
        value: "4",
    }, {
        name: "PVRIS - Burn It All Down",
        value: "5",
    }, {
        name: "Crypt x Joey Nato - Invincible",
        value: "6",
        selected: true,
    }, ])}${HTML.checkBox("showch", "", false)}<br>
    Scroll Macro Mode: ${HTML.select("ScrMacro", [{
        name: "Bull Tick Sync / Emp Overrides",
        value: "1",
        selected: true,
    }, {
        name: "Dave Rodgers - Ae86",
        value: "2",
    }, {
        name: "Dr Love - Don't Stand So Close",
        value: "3",
    }, {
        name: "Domastic - Heartless",
        value: "4",
    }, {
        name: "PVRIS - Burn It All Down",
        value: "5",
    }, {
        name: "Crypt x Joey Nato - Invincible",
        value: "6",
    }, ])}<br>

    Aim Boost-Spike At Nearest Enemy?  ${HTML.checkBox("AIMboostSpikes", "", false)}<br>
    Auto-Boost Spike space key (State: )<br>
    Object for the boost item placer: ${HTML.select("placeoINboost", [{
        name: "Walls",
        value: "1",
    }, {
        name: "Spikes",
        value: "2",
    }, {
        name: "Windmills",
        value: "3",
        selected: true,
    }, {
        name: "Trap/Boosts",
        value: "4",
    }, {
        name: "Teleport/Turrets",
        value: "5",
    }, ])}<br>
    Extra Performance Mode: ${HTML.select("ExtraPerformanceMode", [{
        name: "Anti Bull",
        value: "antibull",
        selected: true,
    }, {
        name: "Bull tick",
        value: "bulltick",
    }, {
        name: "Instachaining",
        value: "instachaining",
    }, ])}<br>
    Extra Performance? ${HTML.checkBox("ExtraPerformanceButton", "", false)}<br>
    Object for the placer: ${HTML.select("placeo", [
        { name: "Walls", value: "1",},
        { name: "Spikes", value: "2",},
        { name: "Windmills", value: "3", selected: true,},
        { name: "Trap/Boosts", value: "4",},
        { name: "Teleport/Turrets", value: "5",},
    ])}<br>




    anti
    <div class = "holder">
    ${HTML.checkBox("soldieranti", "soldierAntiInsta", true)}<br>
    ${HTML.checkBox("soldierempanti", "soldierEmpAntiInsta", true)}<br>
    ${HTML.checkBox("antitick", "anti0Tick", true)}<br>
    ${HTML.checkBox("antirange", "antiRangedInsta", true)}<br>
    </div>



    autoBreak
    <div class = "holder">
    ${HTML.checkBox("earlyab", "early", true)}<br>
    earlyWaitTime <br>



    ${HTML.text("earlytime", "10", "6", "5")}<br>
    ${HTML.checkBox("abactive", "activate", true)}<br>
    </div>











    <br><br><br>




    One-way: ${HTML.button("streamer", "Streamer Mode", "", "nothing")}<br>
    One-way: (Rejoin on server) ${HTML.button("serverwarper", "Rejoin", `document.warpServer()`, "nothing")}<br>














    </div>
    `;
}
updateInnerHTML();
getEl("streamer").onclick = function() {
    streamerMode = !streamerMode;
};
getEl("ccv").onfocus = function() {
    canmove = false;
};
getEl("ccv").onblur = function() {
    canmove = true;
};
getEl("PlaceEveryTickTogl").onclick = function() {
    //placeEveryTick1 = !placeEveryTick1;
};








let oldSelect = firstConfig[0];
let newSelect = firstConfig[0];
getEl("os").onchange = function() {
    let value = getEl("os").value;
    let sliced = function(val) {
        return val.slice(0, val.length - 1);
    };
    oldSelect = newSelect;
    newSelect = value;
    getEl(sliced(oldSelect)).style.display = "none";
    getEl(sliced(newSelect)).style.display = "inline-block";
}
;













            let WS = undefined;
            let socketID = undefined;

            let useWasd = false;
            let secPacket = 0;
            let secMax = 110;
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
                tickRate: (1000 / o.serverUpdateRate),
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

                    // EXTRACT DATA ARRAY:
                    let data = new Uint8Array(message);
                    let parsed = window.msgpack.decode(data);
                    let type = parsed[0];
                    data = parsed[1];

                    // SEND MESSAGE:
                    if (type == "6") {

                        if (data[0]) {
                            // ANTI PROFANITY:
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

                            // FIX CHAT:
                            data[0] = data[0].slice(0, 30);
                        }

                    } else if (type == "L") {
                        // MAKE SAME CLAN:
                        data[0] = data[0] + (String.fromCharCode(0).repeat(7));
                        data[0] = data[0].slice(0, 7);
                    } else if (type == "M") {
                        // APPLY CYAN COLOR:
                        data[0].name = data[0].name == "" ? "unknown" : data[0].name;
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

                        // START COUNT:
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
                // EXTRACT DATA ARRAY:
                let data = Array.prototype.slice.call(arguments, 1);

                // SEND MESSAGE:
                let binary = window.msgpack.encode([type, data]);
                WS.send(binary);
            }

            function origPacket(type) {
                // EXTRACT DATA ARRAY:
                let data = Array.prototype.slice.call(arguments, 1);

                // SEND MESSAGE:
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

            //...lol
            let io = {
                send: packet
            };

            function getMessage(message) {
                let data = new Uint8Array(message.data);
                let parsed = window.msgpack.decode(data);
                let type = parsed[0];
                data = parsed[1];
                let events = {
                    A: setInitData, // id: setInitData,
                    //B: disconnect,
                    C: setupGame, // 1: setupGame,
                    D: addPlayer, // 2: addPlayer,
                    E: removePlayer, // 4: removePlayer,
                    a: updatePlayers, // 33: updatePlayers,
                    G: updateLeaderboard, // 5: updateLeaderboard,here
                    H: loadGameObject, // 6: loadGameObject,
                    I: loadAI, // a: loadAI,
                    J: animateAI, // aa: animateAI,
                    K: gatherAnimation, // 7: gatherAnimation,
                    L: wiggleGameObject, // 8: wiggleGameObject,
                    M: shootTurret, // sp: shootTurret,
                    N: updatePlayerValue, // 9: updatePlayerValue,
                    O: updateHealth, // h: updateHealth,//here
                    P: killPlayer, // 11: killPlayer,
                    Q: killObject, // 12: killObject,
                    R: killObjects, // 13: killObjects,
                    S: updateItemCounts, // 14: updateItemCounts,
                    T: updateAge, // 15: updateAge,
                    U: updateUpgrades, // 16: updateUpgrades,
                    V: updateItems, // 17: updateItems,
                    X: addProjectile, // 18: addProjectile,
                    Y: remProjectile, // 19: remProjectile,
                    //Z: serverShutdownNotice,
                    //0: addAlliance,
                    //1: deleteAlliance,
                    2: allianceNotification, // an: allianceNotification,
                    3: setPlayerTeam, // st: setPlayerTeam,
                    4: setAlliancePlayers, // sa: setAlliancePlayers,
                    5: updateStoreItems, // us: updateStoreItems,
                    6: receiveChat, // ch: receiveChat,
                    7: updateMinimap, // mm: updateMinimap,
                    8: showText, // t: showText,
                    9: pingMap, // p: pingMap,
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

            // MATHS:
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

            // REOUNDED RECTANGLE:
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

            // GLOBAL VALUES:

            let petals = [];
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
            let allianceNotifications = [];
            let gameObjects = [];
            let projectiles = [];
            let deadPlayers = [];

            let breakObjects = [];

            let player;
            let playerSID;
            let _;

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
                safePrimary: function(_) {
                    return [0, 8].includes(_.primaryIndex);
                },
                safeSecondary: function(_) {
                    return [10, 11, 14].includes(_.secondaryIndex);
                },
                lastDir: 0,
                autoPush: false,
                pushData: {}
            }

            // FIND OBJECTS BY ID/SID:
            function findID(_, tmp) {
                return _.find((THIS) => THIS.id == tmp);
            }

            function findSID(_, tmp) {
                return _.find((THIS) => THIS.sid == tmp);
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

            let gameName = getEl("gameName");
            let adCard = getEl("adCard");
            adCard.remove();
            let promoImageHolder = getEl("promoImgHolder");
            promoImageHolder.remove();
            let menuText = getEl("desktopInstructions");
            menuText.innerHTML = `
            Movement: W,  A, S, D<br>
            Toggle Menu: ESC<br>
            InstaKill: R<br>
            <br>
            Mouse:<br>
            Left: Bull<br>
            Middle: Range<br>
            Right: Tank<br>
            `;
            $("#guideCard").css({
                height: "415px",
                "max-height": "700px",
            });
            let partyButton = getEl("partyButton");
            let joinPartyButton = getEl("joinPartyButton");
            let settingsButton = getEl("settingsButton");
            let settingsButtonTitle = settingsButton.getElementsByTagName("span")[0];
            let allianceButton = getEl("allianceButton");
            let storeButton = getEl("storeButton");
            let serverBrowser = getEl("serverBrowser");
            let nativeResolutionCheckbox = getEl("nativeResolution");
            let showPingCheckbox = getEl("showPing");
            let playMusicCheckbox = getEl("playMusic");
            let pingDisplay = getEl("pingDisplay");
            let shutdownDisplay = getEl("shutdownDisplay");
            let setupCard = getEl("setupCard");
            let menuContainer = getEl("menuContainer");
            let guideCard = getEl("guideCard");
            let loadingText = getEl("loadingText");
            let gameUI = getEl("gameUI");
            let resourceDisplay = document.getElementById("resDisplay");
            let scoreDisplay = getEl("scoreDisplay");
            let foodDisplay = getEl("foodDisplay");
            let woodDisplay = getEl("woodDisplay");
            let stoneDisplay = getEl("stoneDisplay");
            let killCounter = getEl("killCounter");
            let topinfoHolder = getEl("topInfoHolder");
            let leaderboard = getEl("leaderboard");
            let nameInput = getEl("nameInput");
            let ageText = getEl("ageText");
            let ageBarBody = getEl("ageBarBody");
            let allianceHolder = getEl("allianceHolder");
            let allianceManager = getEl("allianceManager");
            let skinColorHolder = getEl("skinColorHolder");
            let chatButton = getEl("chatButton");
            chatButton.remove();
            let gameCanvas = getEl("gameCanvas");
            let be = gameCanvas.getContext("2d");
            let mapDisplay = getEl("mapDisplay");
            let mapContext = mapDisplay.getContext("2d");
            mapDisplay.width = 300;
            mapDisplay.height = 300;
            let storeMenu = getEl("storeMenu");
            let storeHolder = getEl("storeHolder");
            let upgradeHolder = getEl("upgradeHolder");
            let upgradeCounter = getEl("upgradeCounter");
            let chatBox = getEl("chatBox");
            let chatHolder = getEl("chatHolder");
            let actionBar = getEl("actionBar");
            let leaderboardData = getEl("leaderboardData");
            let itemInfoHolder = getEl("itemInfoHolder");
            let menuCardHolder = getEl("menuCardHolder");
            let mainMenu = getEl("mainMenu");
            mainMenu.style.backgroundImage = "url('https://www.icegif.com/wp-content/uploads/2023/01/icegif-162.gif')";
            mainMenu.style.backgroundSize = "cover";
            let diedText = getEl("diedText");
            let screenWidth;
            let screenHeight;
            let maxScreenWidth = o.maxScreenWidth;
            let maxScreenHeight = o.maxScreenHeight;
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

            let isNight = false;
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
                w: false,
                a: false,
                s: false,
                d: false,
                posx: 0,
                posy: 0,
                aim: 0,
                place: false,
            };
            let lastDir;

            let lastLeaderboardData = [];

            // ON LOAD:
            let inWindow = true;
            window.onblur = function() {
                inWindow = false;
            };
            window.onfocus = function() {
                inWindow = true;
                if (player && player.alive) {
                    // resetMoveDir();
                }
            };

            let ms = {
                avg: 0,
                max: 0,
                min: Infinity,
            };

            function pingSocketResponse() {
                let pingTime = window.pingTime;
                const pingDisplay = document.getElementById("pingDisplay");
                pingDisplay.innerText = "Ping: " + pingTime + " ms";

                ms.max = isNaN(ms.max) ? pingTime : Math.max(ms.max, pingTime);
                ms.min = isNaN(ms.min) ? pingTime : Math.min(ms.min, pingTime);
                ms.avg = Math.floor([(window.pingTime + ms.max + ms.min)/3]);
            }

            function zoomVision() {
                if (maxScreenWidth != o.maxScreenWidth * 1.5 || maxScreenHeight != o.maxScreenHeight * 1.5) {
                    maxScreenWidth = o.maxScreenWidth * 1.5;
                    maxScreenHeight = o.maxScreenHeight * 1.5;
                    resize();
                }
            }
            let resetZoomOn = 1;
            function resetZoom() {
                if (maxScreenWidth != o.maxScreenWidth * resetZoomOn || maxScreenHeight != o.maxScreenHeight * resetZoomOn) {
                    maxScreenWidth = o.maxScreenWidth * resetZoomOn;
                    maxScreenHeight = o.maxScreenHeight * resetZoomOn;
                    resize();
                }
            }


            let placeVisible = [];
            let profanityList = ["cunt", "whore", "fuck", "shit", "faggot", "nigger",
                                 "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex",
                                 "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune",
                                 "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"
                                ];

            /** CLASS CODES */

            class Utils {
                constructor() {

                    // MATH UTILS:
                    let mathABS = Math.abs,
                        mathCOS = Math.cos,
                        mathSIN = Math.sin,
                        mathPOW = Math.pow,
                        mathSQRT = Math.sqrt,
                        mathATAN2 = Math.atan2,
                        mathPI = Math.PI;

                    let _this = this;

                    // GLOBAL UTILS:
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
                        // let passive = window.Modernizr.passiveeventlisteners ? {passive: true} : false;
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
                    this.generateElement = function(o) {
                        let element = document.createElement(o.tag || "div");

                        function bind(oValue, elementValue) {
                            if (o[oValue])
                                element[elementValue] = o[oValue];
                        }
                        bind("text", "textContent");
                        bind("html", "innerHTML");
                        bind("class", "className");
                        for (let key in o) {
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
                            element[key] = o[key];
                        }
                        if (element.onclick)
                            element.onclick = this.checkTrusted(element.onclick);
                        if (element.onmouseover)
                            element.onmouseover = this.checkTrusted(element.onmouseover);
                        if (element.onmouseout)
                            element.onmouseout = this.checkTrusted(element.onmouseout);
                        if (o.style) {
                            element.style.cssText = o.style;
                        }
                        if (o.hookTouch) {
                            this.hookTouchEvents(element);
                        }
                        if (o.parent) {
                            o.parent.appendChild(element);
                        }
                        if (o.children) {
                            for (let i = 0; i < o.children.length; i++) {
                                element.appendChild(o.children[i]);
                            }
                        }
                        return element;
                    };
                    this.checkTrusted = function(callback) {
                        return function(ev) {
                            if (ev && ev instanceof Event && (ev && typeof ev.isTrusted == "boolean" ? ev.isTrusted : true)) {
                                callback(ev);
                            } else {
                                //console.error("Event is not trusted.", ev);
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
                // ANIMATED TEXT:
                constructor() {
                    // INIT:
                    this.init = function(x, y, scale, speed, life, text, color) {
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

                    // UPDATE:
                    this.update = function(delta) {
                        if (this.life) {
                            this.life -= delta;
                            if (o.anotherVisual) {
                                this.y -= this.speed * delta * this.acc;
                                this.acc -= delta / (this.maxLife / 2.5);
                                if (this.life <= 200) {
                                    if (this.alpha > 0) {
                                        this.alpha = Math.max(0, this.alpha - (delta / 300));
                                    }
                                } else {
                                    if (this.alpha < 1) {
                                        this.alpha = Math.min(1, this.alpha + (delta / 100));
                                    }
                                }
                                this.x += this.ranX;
                            } else {
                                this.y -= this.speed * delta;
                            }
                            this.scale += this.scaleSpeed * delta;
                            if (this.scale >= this.maxScale) {
                                this.scale = this.maxScale;
                                this.scaleSpeed *= -1;
                            } else if (this.scale <= this.startScale) {
                                this.scale = this.startScale;
                                this.scaleSpeed = 0;
                            }
                            if (this.life <= 0) {
                                this.life = 0;
                            }
                        }
                    };

                    // RENDER:
                    this.render = function(ctxt, xOff, yOff) {
                        ctxt.lineWidth = 10;
                        ctxt.fillStyle = this.color;
                        ctxt.font = this.scale + "px " + (o.anotherVisual ? "Ubuntu" : "Hammersmith One");
                        if (o.anotherVisual) {
                            ctxt.globalAlpha = this.alpha;
                            ctxt.strokeStyle = darkOutlineColor;
                            ctxt.strokeText(this.text, this.x - xOff, this.y - yOff);
                        }
                        ctxt.fillText(this.text, this.x - xOff, this.y - yOff);
                        ctxt.globalAlpha = 1;
                    };
                }
            };
            class Textmanager {
                // TEXT MANAGER:
                constructor() {
                    this.texts = [];
                    this.stack = [];

                    // UPDATE:
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

                    // SHOW TEXT:
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

                    // INIT:
                    this.init = function(x, y, dir, scale, type, data, owner) {
                        data = data || {};
                        if (type == 0) Trees.push({ x: x, y: y });
                        if (type == 1) Foodbush.push({ x: x, y: y });
                        if (type == 2) StoneOreok.push({ x: x, y: y });
                        if (type == 3) GoldMines.push({ x: x, y: y });
                        this.sentTo = {};
                        this.gridLocations = [];
                        this.active = true;
                        this.alive = true;
                        this.doUpdate = data.doUpdate;
                        this.x = x;
                        this.y = y;
                        if (o.anotherVisual) {
                            this.dir = dir + Math.PI;
                        } else {
                            this.dir = dir;
                        }
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

                    // GET HIT:
                    this.changeHealth = function(amount, doer) {
                        this.health += amount;
                        return (this.health <= 0);
                    };

                    // GET SCALE:
                    this.getScale = function(sM, ig) {
                        sM = sM || 1;
                        return this.scale * ((this.isItem || this.type == 2 || this.type == 3 || this.type == 4) ?
                                             1 : (0.6 * sM)) * (ig ? 1 : this.colDiv);
                    };

                    // VISIBLE TO PLAYER:
                    this.visibleToPlayer = function(player) {
                        return !(this.hideFromEnemy) || (this.owner && (this.owner == player ||
                                                                        (this.owner.team && player.team == this.owner.team)));
                    };

                    // UPDATE:
                    this.update = function(delta) {
                        if (this.active) {
                            if (this.xWiggle) {
                                this.xWiggle *= Math.pow(0.99, delta);
                            }
                            if (this.yWiggle) {
                                this.yWiggle *= Math.pow(0.99, delta);
                            }
                            if (o.anotherVisual) {
                                let d2 = UTILS.getAngleDist(this.lastDir, this.dir);
                                if (d2 > 0.01) {
                                    this.dir += d2 / 5;
                                } else {
                                    this.dir = this.lastDir;
                                }
                            } else {
                                if (this.turnSpeed && this.dmg) {
                                    this.dir += this.turnSpeed * delta;
                                }
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

                    // CHECK TEAM:
                    this.isTeamObject = function(_) {
                        return this.owner == null ? true : (this.owner && _.sid == this.owner.sid || _.findAllianceBySid(this.owner.sid));
                    };
                }
            }
            class Items {
                constructor() {
                    // ITEM GROUPS:
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

                    // PROJECTILES:
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

                    // WEAPONS:
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

                    // ITEMS:
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
                            offsetX: 5, // Adjust the shadow's X offset as needed
                            offsetY: 5, // Adjust the shadow's Y offset as needed
                            blur: 20,  // Adjust the shadow's blur as needed
                            color: "rgba(0, 0, 0, 0.5)" // Adjust the shadow's color and transparency as needed
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

                    // CHECK ITEM ID:
                    this.checkItem = {
                        index: function(id, myItems) {
                            return [0, 1, 2].includes(id) ? 0 : [3, 4, 5].includes(id) ? 1 : [6, 7, 8, 9].includes(id) ? 2 : [10, 11, 12].includes(id) ? 3 : [13, 14].includes(id) ? 5 : [15, 16].includes(id) ? 4 : [17, 18, 19, 21, 22].includes(id) ? [13, 14].includes(myItems) ? 6 :
                            5 :
                            id == 20 ? [13, 14].includes(myItems) ? 7 :
                            6 :
                            undefined;
                        }
                    }

                    // ASSIGN IDS:
                    for (let i = 0; i < this.list.length; ++i) {
                        this.list[i].id = i;
                        if (this.list[i].pre) this.list[i].pre = i - this.list[i].pre;
                    }

                    // TROLOLOLOL:
                    if (typeof window !== "undefined") {
                        function shuffle(a) {
                            for (let i = a.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [a[i], a[j]] = [a[j], a[i]];
                            }
                            return a;
                        }
                        //shuffle(this.list);
                    }
                }
            }
            class Objectmanager {
                constructor(GameObject, gameObjects, UTILS, o, players, server) {
                    let mathFloor = Math.floor,
                        mathABS = Math.abs,
                        mathCOS = Math.cos,
                        mathSIN = Math.sin,
                        mathPOW = Math.pow,
                        mathSQRT = Math.sqrt;

                    this.ignoreAdd = false;
                    this.hitObj = [];

                    // DISABLE OBJ:
                    this.disableObj = function(obj) {
                        //prePlacer
                        if (enemy.length && near.dist2 <= 250 && preplaceOverride && Math.hypot(obj.y - player.y, obj.x - player.x) <= 300 && !getEl("weaponGrind").checked && getEl("preplacer").checked) {
                            let mode = cst ? 2 : near.health < 73 ? 2 : 4
                            if (instaC.canSpikeTick == false && player.reloads[player.weapons[0]] != 0) {
                                place(mode, Math.atan2(obj.y - player.y, obj.x - player.x));
                            } else if (instaC.canSpikeTick == false && player.reloads[player.weapons[0]] == 0 && !retrappable) { } else {
                                place(mode, Math.atan2(obj.y - player.y, obj.x - player.x));
                            }
                            preplaceOverride = false;
                        }

                        obj.active = false;
                        if (o.anotherVisual) {} else {
                            obj.alive = false;
                        }
                    };

                    // ADD NEW:
                    let _;
                    this.add = function(sid, x, y, dir, s, type, data, setSID, owner) {
                        _ = findObjectBySid(sid);
                        if (!_) {
                            _ = gameObjects.find((tmp) => !tmp.active);
                            if (!_) {
                                _ = new GameObject(sid);
                                gameObjects.push(_);
                            }
                        }
                        if (setSID) {
                            _.sid = sid;
                        }
                        _.init(x, y, dir, s, type, data, owner);
                    };

                    // DISABLE BY SID:
                    this.disableBySid = function(sid) {
                        let find = findObjectBySid(sid);
                        if (find) {
                            this.disableObj(find);
                        }
                    };

                    // REMOVE ALL FROM PLAYER:
                    this.removeAllItems = function(sid, server) {
                        gameObjects.filter((tmp) => tmp.active && tmp.owner && tmp.owner.sid == sid).forEach((tmp) => this.disableObj(tmp));
                    };

                    // CHECK IF PLACABLE:
                    this.checkItemLocation = function(x, y, s, sM, indx, ignoreWater, placer) {
                        let cantPlace = gameObjects.find((tmp) => tmp.active && UTILS.getDistance(x, y, tmp.x, tmp.y) < s + (tmp.blocker ? tmp.blocker : tmp.getScale(sM, tmp.isItem)));
                        if (cantPlace) return false;
                        if (!ignoreWater && indx != 18 && y >= o.mapScale / 2 - o.riverWidth / 2 && y <= o.mapScale / 2 + o.riverWidth / 2) return false;
                        return true;
                    };

                }
            }
            class Projectile {
                constructor(players, ais, objectManager, items, o, UTILS, server) {

                    // INIT:
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

                    // UPDATE:
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
                    // STORE HATS:
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

                    // STORE ACCESSORIES:
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
                constructor(Projectile, projectiles, players, ais, objectManager, items, o, UTILS, server) {
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
                            tmpProj = new Projectile(players, ais, objectManager, items, o, UTILS, server);
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

                // AI MANAGER:
                constructor(ais, AI, players, items, objectManager, o, UTILS, scoreCallback, server) {

                    // AI TYPES:
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
                        name: "MOOFIE",
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
                        name: "Wolf",
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
                        name: "Bully",
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

                    // SPAWN AI:
                    this.spawn = function(x, y, dir, index) {
                        let _ = ais.find((tmp) => !tmp.active);
                        if (!_) {
                            _ = new AI(ais.length, objectManager, players, items, UTILS, o, scoreCallback, server);
                            ais.push(_);
                        }
                        _.init(x, y, dir, index, this.aiTypes[index]);
                        return _;
                    };
                }

            };
            class AI {
                constructor(sid, objectManager, players, items, UTILS, o, scoreCallback, server) {
                    this.sid = sid;
                    this.isAI = true;
                    this.nameIndex = UTILS.randInt(0, o.cowNames.length - 1);

                    // INIT:
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
                                    tmpRatio += delta / (this.animSpeed * o.hitReturnRatio);
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                                    if (tmpRatio >= 1) {
                                        tmpRatio = 1;
                                        animIndex = 1;
                                    }
                                } else {
                                    tmpRatio -= delta / (this.animSpeed * (1 - o.hitReturnRatio));
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                                }
                            }
                        }
                    };

                    // ANIMATION:
                    this.startAnim = function() {
                        this.animTime = this.animSpeed = 600;
                        this.targetAngle = Math.PI * 0.8;
                        tmpRatio = 0;
                        animIndex = 0;
                    };

                };

            };
            class Petal {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                    this.damage = 10;
                    this.health = 10;
                    this.maxHealth = this.health;
                    this.active = false;
                    this.alive = false;
                    this.timer = 1500;
                    this.time = 0;
                    this.damaged = 0;
                    this.alpha = 1;
                    this.scale = 9;
                    this.visScale = this.scale;
                }
            };
            class addCh {
                constructor(x, y, chat, _) {
                    this.x = x;
                    this.y = y;
                    this.alpha = 0;
                    this.active = true;
                    this.alive = false;
                    this.chat = chat;
                    this.owner = _;
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
                constructor(id, sid, o, UTILS, projectileManager, objectManager, players, ais, items, hats, accessories, server, scoreCallback, iconCallback) {
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

                    // SPAWN:
                    this.spawn = function(moofoll) {
                        this.attacked = false;
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
                        this.syncThreats = 0;
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
                        this.scale = o.playerScale;
                        this.speed = o.playerSpeed;
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

                    // RESET MOVE DIR:
                    this.resetMoveDir = function() {
                        this.moveDir = undefined;
                    };

                    // RESET RESOURCES:
                    this.resetResources = function(moofoll) {
                        for (let i = 0; i < o.resourceTypes.length; ++i) {
                            this[o.resourceTypes[i]] = moofoll ? 100 : 0;
                        }
                    };

                    // ADD ITEM:
                    this.getItemType = function(id) {
                        let findindx = this.items.findIndex((ids) => ids == id);
                        if (findindx != -1) {
                            return findindx;
                        } else {
                            return items.checkItem.index(id, this.items);
                        }
                    };

                    // SET DATA:
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

                    // UPDATE POISON TICK:
                    this.updateTimer = function() {

                        this.bullTimer -= 1;
                        if (this.bullTimer <= 0) {
                            this.setBullTick = false;
                            this.bullTick = game.tick - 1;
                            this.bullTimer = o.serverUpdateRate;
                        }
                        this.poisonTimer -= 1;
                        if (this.poisonTimer <= 0) {
                            this.setPoisonTick = false;
                            this.poisonTick = game.tick - 1;
                            this.poisonTimer = o.serverUpdateRate;
                        }

                    };
                    this.update = function(delta) {
                        if (this.active) {

                            // MOVE:
                            let gear = {
                                skin: findID(hats, this.skinIndex),
                                tail: findID(accessories, this.tailIndex)
                            }
                            let spdMult = ((this.buildIndex >= 0) ? 0.5 : 1) * (items.weapons[this.weaponIndex].spdMult || 1) * (gear.skin ? (gear.skin.spdMult || 1) : 1) * (gear.tail ? (gear.tail.spdMult || 1) : 1) * (this.y <= o.snowBiomeTop ? ((gear.skin && gear.skin.coldM) ? 1 : o.snowSpeed) : 1) * this.slowMult;
                            this.maxSpeed = spdMult;

                        }
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
                                    tmpRatio += delta / (this.animSpeed * o.hitReturnRatio);
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                                    if (tmpRatio >= 1) {
                                        tmpRatio = 1;
                                        animIndex = 1;
                                    }
                                } else {
                                    tmpRatio -= delta / (this.animSpeed * (1 - o.hitReturnRatio));
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                                }
                            }
                        }
                    };

                    // GATHER ANIMATION:
                    this.startAnim = function(didHit, index) {
                        this.animTime = this.animSpeed = items.weapons[index].speed;
                        this.targetAngle = (didHit ? -o.hitAngle : -Math.PI);
                        tmpRatio = 0;
                        animIndex = 0;
                    };

                    // CAN SEE:
                    this.canSee = function(other) {
                        if (!other) return false;
                        let dx = Math.abs(other.x - this.x) - other.scale;
                        let dy = Math.abs(other.y - this.y) - other.scale;
                        return dx <= (o.maxScreenWidth / 2) * 1.3 && dy <= (o.maxScreenHeight / 2) * 1.3;
                    };

                    // SHAME SYSTEM:
                    this.judgeShame = function() {
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

                    // CHECK TEAM:
                    this.isTeam = function(_) {
                        return (this == _ || (this.team && this.team == _.team));
                    };

                    // FOR THE PLAYER:
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
                            let pV = primary.variant != undefined ? o.weaponVariants[primary.variant].val : 1;
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

                    // UPDATE WEAPON RELOAD:
                    this.manageReload = function() {
                        if (this.shooting[53]) {
                            this.shooting[53] = 0;
                            this.reloads[53] = (2500 - game.tickRate);
                        } else {
                            if (this.reloads[53] > 0) {
                                this.reloads[53] = Math.max(0, this.reloads[53] - game.tickRate);
                            }
                        }
                        if (this.gathering || this.shooting[1]) {
                            if (this.gathering) {
                                this.gathering = 0;
                                this.reloads[this.gatherIndex] = (items.weapons[this.gatherIndex].speed * (this.skinIndex == 20 ? 0.78 : 1));
                                this.attacked = true;
                                if (this != player && player.team && this.team == player.team && player.weapons[1] == 15 && this.gatherIndex == 5) {//pri sync
                                    Synced.SyncShotPri++; // Sync = power
                                }
                            }
                            if (this.shooting[1]) {
                                this.shooting[1] = 0;
                                this.reloads[this.shootIndex] = (items.weapons[this.shootIndex].speed * (this.skinIndex == 20 ? 0.78 : 1));
                                this.attacked = true;
                                if (this != player && player.team && this.team == player.team && player.weapons[1] == 15 && this.shootIndex == 15) {//sec sync
                                    Synced.SyncShotSec++; // Sync = power
                                }
                            }
                        } else {
                            this.attacked = false;
                            if (this.buildIndex < 0) {
                                if (this.reloads[this.weaponIndex] > 0) {
                                    this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - game.tickRate);
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

                    // FOR ANTI INSTA:
                    this.addDamageThreat = function(_) {
                        let primary = {
                            weapon: this.primaryIndex,
                            variant: this.primaryVariant
                        };
                        primary.dmg = primary.weapon == undefined ? 45 : items.weapons[primary.weapon].dmg;
                        let secondary = {
                            weapon: this.secondaryIndex,
                            variant: this.secondaryVariant
                        };
                        secondary.dmg = secondary.weapon == undefined ? 50 : items.weapons[secondary.weapon].Pdmg;
                        let bull = 1.5;
                        let pV = primary.variant != undefined ? o.weaponVariants[primary.variant].val : 1.18;
                        let sV = secondary.variant != undefined ? [9, 12, 13, 15].includes(secondary.weapon) ? 1 : o.weaponVariants[secondary.variant].val : 1.18;
                        if (primary.weapon == undefined ? true : this.reloads[primary.weapon] == 0) {
                            this.damageThreat += primary.dmg * pV * bull;
                        }
                        if (secondary.weapon == undefined ? true : this.reloads[secondary.weapon] == 0) {
                            this.damageThreat += secondary.dmg * sV;
                        }
                        if (this.reloads[53] <= game.tickRate) {
                            this.damageThreat += 25;
                        }
                        this.damageThreat *= _.skinIndex == 6 ? 0.75 : 1;
                        if (!this.isTeam(_)) {
                            if (this.dist2 <= 300) {
                                _.damageThreat += this.damageThreat;
                            }
                        }
                    };

                }
            };

            // SOME CODES:
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
                            if (os.autoBuyEquip) {
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
                            if (os.autoBuyEquip) {
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

            // PLACER:
            // PLACER:
            function place(id, rad, rmd) {
                try {
                    if (id == undefined) return;
                    let item = items.list[player.items[id]];
                    let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                    let tmpX = player.x2 + tmpS * Math.cos(rad);
                    let tmpY = player.y2 + tmpS * Math.sin(rad);
                    if (testMode || (player.alive && inGame && player.itemCounts[item.group.id] == undefined ? true : player.itemCounts[item.group.id] < (o.isSandbox ? 299 : item.group.limit ? item.group.limit : 99))) {
                        selectToBuild(player.items[id]);
                        sendAtck(1, rad);
                        selectWeapon(player.weaponCode, 1);
                        if (rmd && getEl("placeVis").checked) {
                            placeVisible.push({
                                x: tmpX,
                                y: tmpY,
                                name: item.name,
                                scale: item.scale,
                                dir: rad
                            });
                            game.tickBase(() => {
                                placeVisible.shift();
                            }, 1)
                        }
                    }
                } catch (e) {}
            }

            function checkPlace(id, rad) {
                try {
                    if (id == undefined) return;
                    let item = items.list[player.items[id]];
                    let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                    let tmpX = player.x2 + tmpS * Math.cos(rad);
                    let tmpY = player.y2 + tmpS * Math.sin(rad);
                    if (objectManager.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player)) {
                        place(id, rad, 1);
                    }
                } catch (e) {}
            }

            // HEALING:
            function soldierMult() {
                return player.latestSkin == 6 ? 0.75 : 1;
            }

            function healthBased() {
                if (player.health == 80)
                    return 0;
                if ((player.skinIndex != 70 && player.skinIndex != 86)) {
                    return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
                }
                return 0;
            }

            function getAttacker(damaged) {
                let attackers = enemy.filter(tmp => {
                    //let damages = new Damages(items);
                    //let dmg = damages.weapons[tmp.weaponIndex];
                    //let by = tmp.weaponIndex < 9 ? [dmg[0], dmg[1], dmg[2], dmg[3]] : [dmg[0], dmg[1]];
                    let rule = {
                        //one: tmp.dist2 <= 300,
                        //two: by.includes(damaged),
                        three: tmp.attacked
                    }
                    return /*rule.one && rule.two && */ rule.three;
                });
                return attackers;
            }

            function healer() {
                for (let i = 0; i < healthBased(); i++) {
                    place(0, getAttackDir());
                }
            }

            function antiSyncHealing(timearg) {
                my.antiSync = true;
                let healAnti = setInterval(() => {
                    if (player.shameCount < 5) {
                        place(0, getAttackDir());
                    }
                }, 125);
                setTimeout(() => {
                    clearInterval(healAnti);
                    setTimeout(() => {
                        my.antiSync = false;
                    }, game.tickRate);
                }, game.tickRate * timearg);
            }

            function biomeGear(mover, returns) {
                if (player.y2 >= o.mapScale / 2 - o.riverWidth / 2 && player.y2 <= o.mapScale / 2 + o.riverWidth / 2) {
                    if (returns) return 31;
                    buyEquip(31, 0);
                } else {
                    if (player.y2 <= o.snowBiomeTop) {
                        if (returns) return mover && player.moveDir == undefined ? 22 : 15;
                        buyEquip(mover && player.moveDir == undefined ? 22 : 15, 0);
                    } else {
                        if (returns) return mover && player.moveDir == undefined ? 22 : 12;
                        buyEquip(mover && player.moveDir == undefined ? 22 : 12, 0);
                    }
                }
                if (returns) return 0;
            }

            function woah(mover) {
                buyEquip(mover && player.moveDir == undefined ? 0 : 11, 1);
            }

            let advHeal = [];

            class Traps {
                constructor(UTILS, items) {
                    this.dist = 0;
                    this.aim = 0;
                    this.inTrap = false;
                    this.replaced = false;
                    this.antiTrapped = false;
                    this.info = {};
                    this.notFast = function() {
                        return player.weapons[1] == 10 && ((this.info.health > items.weapons[player.weapons[0]].dmg) || player.weapons[0] == 5);
                    }
                    this.testCanPlace = function(id, first = -(Math.PI / 2), repeat = (Math.PI / 2), plus = (Math.PI / 18), radian, replacer, yaboi) {
                        try {
                            let item = items.list[player.items[id]];
                            let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                            let counts = {
                                attempts: 0,
                                placed: 0
                            };
                            let _ects = [];
                            gameObjects.forEach((p) => {
                                _ects.push({
                                    x: p.x,
                                    y: p.y,
                                    active: p.active,
                                    blocker: p.blocker,
                                    scale: p.scale,
                                    isItem: p.isItem,
                                    type: p.type,
                                    colDiv: p.colDiv,
                                    getScale: function(sM, ig) {
                                        sM = sM || 1;
                                        return this.scale * ((this.isItem || this.type == 2 || this.type == 3 || this.type == 4)
                                                             ? 1 : (0.6 * sM)) * (ig ? 1 : this.colDiv);
                                    },
                                });
                            });
                            for (let i = first; i < repeat; i += plus) {
                                counts.attempts++;
                                let relAim = radian + i;
                                let tmpX = player.x2 + tmpS * Math.cos(relAim);
                                let tmpY = player.y2 + tmpS * Math.sin(relAim);
                                let cantPlace = _ects.find((tmp) => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                                if (cantPlace) continue;
                                if (item.id != 18 && tmpY >= o.mapScale / 2 - o.riverWidth / 2 && tmpY <= o.mapScale / 2 + o.riverWidth / 2) continue;
                                if ((!replacer && yaboi) || useWasd) {
                                    if (useWasd ? false : yaboi.inTrap) {
                                        if (UTILS.getAngleDist(near.aim2 + Math.PI, relAim + Math.PI) <= Math.PI) {
                                            place(2, relAim, 1);
                                        } else {
                                            player.items[4] == 15 && place(4, relAim, 1);
                                        }
                                    } else {
                                        if (UTILS.getAngleDist(near.aim2, relAim) <= o.gatherAngle / 1.5) {
                                            place(2, relAim, 1);
                                        } else {
                                            player.items[4] == 15 && place(4, relAim, 1);
                                        }
                                    }
                                } else {
                                    place(id, relAim, 1);
                                }
                                _ects.push({
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
                                    },
                                });
                                if (UTILS.getAngleDist(near.aim2, relAim) <= 1) {
                                    counts.placed++;
                                }
                            }
                            if (counts.placed > 0 && replacer && item.dmg) {
                                if (near.dist2 <= items.weapons[player.weapons[0]].range + (player.scale * 1.8) && os.spikeTick) {
                                    instaC.canSpikeTick = true;
                                }
                            }
                        } catch (err) {
                        }
                    };
                    this.checkSpikeTick = function() {
                        try {
                            if (![3, 4, 5].includes(near.primaryIndex)) return false;
                            if ((getEl("safeAntiSpikeTick").checked || my.autoPush) ? false : near.primaryIndex == undefined ? true : (near.reloads[near.primaryIndex] > game.tickRate)) return false;
                            // more range for safe. also testing near.primaryIndex || 5
                            if (near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                                let item = items.list[9];
                                let tmpS = near.scale + item.scale + (item.placeOffset || 0);
                                let danger = 0;
                                let counts = {
                                    attempts: 0,
                                    block: `unblocked`
                                };
                                for (let i = -1; i <= 1; i += 1 / 10) {
                                    counts.attempts++;
                                    let relAim = UTILS.getDirect(player, near, 2, 2) + i;
                                    let tmpX = near.x2 + tmpS * Math.cos(relAim);
                                    let tmpY = near.y2 + tmpS * Math.sin(relAim);
                                    let cantPlace = gameObjects.find((tmp) => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                                    if (cantPlace) continue;
                                    if (tmpY >= o.mapScale / 2 - o.riverWidth / 2 && tmpY <= o.mapScale / 2 + o.riverWidth / 2) continue;
                                    danger++;
                                    counts.block = `blocked`;
                                    break;
                                }
                                if (danger) {
                                    my.anti0Tick = 1;
                                    player.chat.message = "Anti SpikeTick " + near.sid;
                                    player.chat.count = 2000;
                                    return true;
                                }
                            }
                        } catch (err) {
                            return null;
                        }
                        return false;
                    }
                    this.protect = function(aim) {
                        if (!os.antiTrap) return;
                        if (player.items[4]) {
                            this.testCanPlace(4, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), aim + Math.PI);
                            this.antiTrapped = true;
                        }
                    };
                    this.autoPlace = function () {
                        if (enemy.length && os.autoPlace && !instaC.ticking) {
                            if (gameObjects.length) {
                                let near2 = {
                                    inTrap: true,
                                };
                                let nearTrap = gameObjects.filter(e => e.trap && e.active && e.isTeamObject(player) && UTILS.getDist(e, near, 0, 2) <= (near.scale + e.getScale() + 5)).sort(function (a, b) {
                                    return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                                })[0];
                                if (nearTrap) {
                                    near2.inTrap = true;
                                } else {
                                    near2.inTrap = true;
                                }
                                if (testMode ? enemy.length : (near.dist2 <= 375)) {
                                    if (near.dist2 <= 200) {
                                        this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2, 0, {inTrap: near2.inTrap});
                                    } else {
                                        player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                                    }
                                }
                            } else {
                                if (testMode ? enemy.length : (near.dist2 <= 1000)) {
                                    player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                                }
                            }
                        }
                    };


                    this.getItemPlaceLocation = function(obj, dir) {
                        let item = items.list[player.items[obj]];
                        let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                        let tmpX = player.x + tmpS * Math.cos(dir);
                        let tmpY = player.y + tmpS * Math.sin(dir);
                        return { x: tmpX, y: tmpY };
                    };
                    this.replacer = function(findObj) {
                        if (!findObj || !os.autoReplace) return;
                        if (!inGame) return;
                        if (this.antiTrapped) return;
                        let objAim = UTILS.getDirect(findObj, player, 0, 2);
                        let objDst = UTILS.getDist(findObj, player, 0, 2);
                        if (getEl("weaponGrind").checked) return;


                        /*
                        if (objDst <= 400 && near.dist2 <= 400) {
                            if (near.dist2 <= 250) {
                                for (let i = -1; i <= 1; i++) {
                                    checkPlace(2, objAim + i);
                                }
                            } else if (near.dist2 > 250 && near.dist2 < 500) {
                                for (let i = 0; i < Math.PI * 5; i += Math.PI / 5) {
                                    if (player.items[4] == 15) {
                                        checkPlace(4, objAim + i);
                                    }
                                }
                            }
                        }
                        */


                        if (objDst <= 400 && near.dist2 <= 400) {
                            let danger = this.checkSpikeTick();
                            let dizt = near.dist2;
                            let oppoziteitempoz = this.getItemPlaceLocation(2, near.aim2 - Math.PI);

                            for(let i = 0; i < Math.PI*2; i += Math.PI/2) {
                                let itempoz = this.getItemPlaceLocation(2, i);

                                if(getDist(player, itempoz) <= objDst && getDist(near, itempoz) <= getDist(near, oppoziteitempoz) - 10) {
                                    checkPlace(2, objAim + i);
                                } else {
                                    checkPlace(4, objAim + i);
                                }
                                this.replaced = true;
                            }
                        }

                    };
                }
            };
            function calculatePerfectAngle(x1, y1, x2, y2) {
                return Math.atan2(y2 - y1, x2 - x1);
            }
            function isObjectBroken(object) {
                const healthThreshold = 20;
                return object.health < healthThreshold;
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
                        let backupNobull = near.backupNobull;
                        near.backupNobull = false;
                        setTimeout(() => {
                            setTimeout(() => {
                                if (near.skinIndex == 22 && getEl("backupNobull").checked) {
                                    near.backupNobull = true;
                                }
                            }, 1);
                        }, 1);
                        if (type == "rev") {
                            selectWeapon(player.weapons[1]);
                            buyEquip(53, 0);
                            buyEquip(21, 1);
                            sendAutoGather();
                            setTimeout(()=> {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(18, 1);
                                setTimeout(()=> {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 225);
                            }, 100);
                        } else if (type == "nobull") {
                            selectWeapon(player.weapons[0]);
                            if (getEl("backupNobull").checked && backupNobull) {
                                buyEquip(7, 0);
                                buyEquip(18, 1);
                            } else {
                                buyEquip(6, 0);
                                buyEquip(21, 1);
                            }
                            sendAutoGather();
                            setTimeout(() => {
                                if (near.skinIndex == 22) {
                                    if (getEl("backupNobull").checked) {
                                        near.backupNobull = true;
                                    }
                                    buyEquip(6, 0);
                                    buyEquip(21, 1);
                                } else {
                                    buyEquip(53, 0);
                                }
                                selectWeapon(player.weapons[1]);
                                buyEquip(21, 1);
                                setTimeout(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 255);
                            }, 105);
                        } else if (type == "normal") {
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            buyEquip(18, 1);
                            sendAutoGather();
                            setTimeout(() => {
                                buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
                                selectWeapon(player.weapons[1]);
                                buyEquip(21, 1);
                                setTimeout(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 255);
                            }, 100);
                        } else {
                            setTimeout(() => {
                                this.isTrue = false;
                                my.autoAim = false;
                            }, 50);
                        }
                    };
                    this.spikeTickType = function() {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        buyEquip(21, 1);
                        sendAutoGather();
                        game.tickBase(() => {
                            if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
                                selectWeapon(player.weapons[0]);
                                buyEquip(53, 0);
                                buyEquip(21, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                            } else {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                            }
                        }, 1);
                    };
                    this.counterType = function() {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        buyEquip(21, 1);
                        sendAutoGather();
                        game.tickBase(() => {
                            if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
                                selectWeapon(player.weapons[0]);
                                buyEquip(53, 0);
                                buyEquip(21, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                            } else {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                            }
                        }, 1);
                    };
                    this.syncTry = function(syncType = "sec", time = 2) {
                        setTimeout(() => {
                            if (syncType == "sec") {
                                if (player.weapons[1] == 15) {
                                    packet("D", near.aim2);
                                    this.isTrue = true;
                                    my.autoAim = true;
                                    selectWeapon(player.weapons[1]);
                                    //rangeBackup.push(near.dist2);
                                    if (player.reloads[53] == 0 && near.dist2 <= 700 && near.skinIndex != 22) {
                                        Hg(53, 21);
                                    } else {
                                        Hg(20, 21);
                                    }2
                                    sendAutoGather();
                                    game.tickBase(() => {
                                        this.isTrue = false;
                                        my.autoAim = false;
                                        sendAutoGather();
                                    }, 2);
                                }
                            }
                        }, time);
                    };
                    this.rangeType = function(type) {
                        this.isTrue = true;
                        my.autoAim = true;
                        if (type == "ageInsta") {
                            my.ageInsta = false;
                            if (player.items[5] == 18) {
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
                        } else {
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
                        }
                    };
                    this.oneTickType = function() {
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
                            buyEquip(18, 1);
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
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                        biomeGear();
                        buyEquip(11, 1);
                        packet("a", near.aim2, 1);
                        game.tickBase(() => {
                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            buyEquip(53, 0);
                            buyEquip(19, 1);
                            packet("a", near.aim2, 1);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(18, 1);
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
                            buyEquip(18, 1);
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
                        /*this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(53, 0);
                        buyEquip(11, 1);
                        packet("a", near.aim2);
                        game.tickBase(() => {
                            place(4, near.aim2);
                            selectWeapon(player.weapons[1]);
                            biomeGear();
                            buyEquip(11, 1);
                            sendAutoGather();
                            packet("a", near.aim2);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(19, 1);
                                packet("a", near.aim2);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    packet("a", undefined);
                                }, 1);
                            }, 1);
                        }, 1);*/
                        this.isTrue = true;
                        my.autoAim = true;
                        biomeGear();
                        buyEquip(11, 1);
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
                                buyEquip(18, 1);
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
                        let slowDists = (weeeee) => weeeee * o.playerScale;
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
                        let bQ = function(wwww, awwww) {
                            if (player.y2 >= o.mapScale / 2 - o.riverWidth / 2 && player.y2 <= o.mapScale / 2 + o.riverWidth / 2 && awwww == 0) {
                                buyEquip(31, 0);
                            } else {
                                buyEquip(wwww, awwww);
                            }
                        }
                        if (enemy.length) {
                            let dst = near.dist2;
                            this.ticking = true;
                            if (dst >= goal.a && dst <= goal.b) {
                                bQ(22, 0);
                                bQ(19, 1);
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
                                                bQ(19, 1);
                                                if (os.slowOT) {
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
                                            bQ(19, 1);
                                            if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                            }
                                        }
                                    } else {
                                        biomeGear();
                                        bQ(19, 1);
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
                                                bQ(19, 1);
                                                if (os.slowOT) {
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
                                            bQ(19, 1);
                                            if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                            }
                                        }
                                    } else {
                                        biomeGear();
                                        bQ(19, 1);
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
                    /** wait 1 tick for better quality */
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
                    },
                        (this.tickMovement = function () {
                        const trap1 = gameObjects .filter(e => e.trap && e.active) .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2)) .find(trap => {
                            const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                            return trap !== player && (player.sid === trap.owner.sid || player.findAllianceBySid(trap.owner.sid)) && trapDist <= 50;
                        });
                        let moveMent = this.gotoGoal(
                            [10, 14].includes(player.weapons[1]) && player.y2 > o.snowBiomeTop ? 240 : player.weapons[1] == 15 ? 250 : player.y2 <= o.snowBiomeTop ? [10, 14].includes(player.weapons[1]) ? 265 : 255 : 270, 3
                        );
                        if (moveMent.action) {
                            if ((![6, 22].includes(near.skinIndex) || ([6, 22].includes(near.skinIndex) && trap1)) && player.reloads[53] == 0 && !this.isTrue) {
                                ([10, 14].includes(player.weapons[1]) && player.y2 > o.snowBiomeTop) || player.weapons[1] == 15 ? this.threeOneTickType() : this.oneTickType();
                            } else {
                                packet('a', moveMent.dir, 1);
                            }
                        } else {
                            packet('a', moveMent.dir, 1);
                        }
                    }),
                        this.kmTickMovement = function() {
                        let moveMent = this.gotoGoal(240, 3);
                        if (moveMent.action) {
                            if (near.skinIndex != 22 && player.reloads[53] == 0 && !this.isTrue && ((game.tick - near.poisonTick) % o.serverUpdateRate == 8)) {
                                this.kmTickType();
                            } else {
                                packet("a", moveMent.dir, 1);
                            }
                        } else {
                            packet("a", moveMent.dir, 1);
                        }
                    },
                        this.boostTickMovement = function() {
                        let dist = player.weapons[1] == 9 ? 365 : player.weapons[1] == 12 ? 380 : player.weapons[1] == 13 ? 390 : player.weapons[1] == 15 ? 365 : 370;
                        let actionDist = player.weapons[1] == 9 ? 2 : player.weapons[1] == 12 ? 1.5 : player.weapons[1] == 13 ? 1.5 : player.weapons[1] == 15 ? 2 : 3;
                        let moveMent = this.gotoGoal(dist, actionDist);
                        if (moveMent.action) {
                            if (player.reloads[53] == 0 && !this.isTrue) {
                                this.boostTickType();
                            } else {
                                packet("a", moveMent.dir, 1);
                            }
                        } else {
                            packet("a", moveMent.dir, 1);
                        }
                    }
                    /** wait 1 tick for better quality */
                    this.perfCheck = function(pl, nr) {
                        if (nr.weaponIndex == 11 && UTILS.getAngleDist(nr.aim2 + Math.PI, nr.d2) <= o.shieldAngle) return false;
                        if (![9, 12, 13, 15].includes(player.weapons[1])) return true;
                        let pjs = {
                            x: nr.x2 + (70 * Math.cos(nr.aim2 + Math.PI)),
                            y: nr.y2 + (70 * Math.sin(nr.aim2 + Math.PI))
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
                        finds = gameObjects.filter(tmp => tmp.active).find((tmp) => {
                            let tmpScale = tmp.getScale();
                            if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                                return true;
                            }
                        });
                        if (finds) return false;
                        return true;
                    }
                }
            };

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

            class Damages {
                constructor(items) {
                    // 0.75 1 1.125 1.5
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

            /** CLASS CODES */
            // jumpscare code warn
            let tmpList = [];

            // LOADING:
            let UTILS = new Utils();
            let items = new Items();
            let objectManager = new Objectmanager(GameObject, gameObjects, UTILS, o);
            let store = new Store();
            let hats = store.hats;
            let accessories = store.accessories;
            let projectileManager = new ProjectileManager(Projectile, projectiles, players, ais, objectManager, items, o, UTILS);
            let aiManager = new AiManager(ais, AI, players, items, null, o, UTILS);
            let textManager = new Textmanager();

            let traps = new Traps(UTILS, items);
            let instaC = new Instakill();
            let autoBuy = new Autobuy([15, 31, 6, 7, 22, 12, 53, 20, 40], [11, 13, 19, 18, 21]);

            let lastDeath;
            let minimapData;
            let mapMarker = {};
            let mapPings = [];
            let tmpPing;

            let breakTrackers = [];

            let pathFindTest = 0;
            let grid = [];
            let pathFind = {
                active: false,
                grid: 40,
                scale: 1440,
                x: 14400,
                y: 14400,
                chaseNear: false,
                array: [],
                lastX: this.grid / 2,
                lastY: this.grid / 2
            };

            function sendChat(message) {
                packet("6", message.slice(0, 30));
            }

            let runAtNextTick = [];

            function checkProjectileHolder(x, y, dir, range, speed, indx, layer, sid) {
                let weaponIndx = indx == 0 ? 9 : indx == 2 ? 12 : indx == 3 ? 13 : indx == 5 && 15;
                let projOffset = o.playerScale * 2;
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

            function antiProj(_, dir, range, speed, index, weaponIndex) {
                if (!_.isTeam(player)) {
                    tmpDir = UTILS.getDirect(player, _, 2, 2);
                    if (UTILS.getAngleDist(tmpDir, dir) <= 0.2) {
                        _.bowThreat[weaponIndex]++;
                        if (index == 5) {
                            projectileCount++;
                        }
                        setTimeout(() => {
                            _.bowThreat[weaponIndex]--;
                            if (index == 5) {
                                projectileCount--;
                            }
                        }, range / speed);
                        if (_.bowThreat[9] >= 1 && (_.bowThreat[12] >= 1 || _.bowThreat[15] >= 1)) {
                            place(1, _.aim2);
                            my.anti0Tick = 4;
                            if (!my.antiSync) {
                                ch("ranged insta homo");
                                antiSyncHealing(4);
                            }
                        } else {
                            if (projectileCount >= 2) {
                                place(1, _.aim2);
                                my.anti0Tick = 4;
                                if (!my.antiSync) {
                                    ch("ranged sync homo");
                                    antiSyncHealing(4);
                                }
                            }
                        }
                    }
                }
            }

            // SHOW ITEM INFO:
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
                                text: (player.itemCounts[item.group.id] || 0) + "/" + (o.isSandbox ? 99 : item.group.limit),
                                parent: itemInfoHolder
                            });
                        }
                    }
                } else {
                    itemInfoHolder.classList.remove("visible");
                }
            }

            // RESIZE:
            window.addEventListener("resize", UTILS.checkTrusted(resize));

            function resize() {
                screenWidth = window.innerWidth;
                screenHeight = window.innerHeight;
                let scaleFillNative = Math.max(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight) * pixelDensity;
                gameCanvas.width = screenWidth * pixelDensity;
                gameCanvas.height = screenHeight * pixelDensity;
                gameCanvas.style.width = screenWidth + "px";
                gameCanvas.style.height = screenHeight + "px";
                be.setTransform(
                    scaleFillNative, 0,
                    0, scaleFillNative,
                    (screenWidth * pixelDensity - (maxScreenWidth * scaleFillNative)) / 2,
                    (screenHeight * pixelDensity - (maxScreenHeight * scaleFillNative)) / 2
                );
            }
            resize();

            // MOUSE INPUT:
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
                if (e.deltaY < 0) {
                    my.reSync = true;
                } else {
                    my.reSync = false;
                }
            }

            // INPUT UTILS:
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
                if (!player)
                    return 0;
                if (!player.lockDir) {
                    lastDir = Math.atan2(mouseY - (screenHeight / 2), mouseX - (screenWidth / 2));
                }
                return lastDir || 0;
            }

            let spinDir = 0;
            function getAttackDir(debug) {
                if (debug) {
                    if (!player)
                        return "0";
                    if (my.autoAim || ((clicks.left || (useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap)) && player.reloads[player.weapons[0]] == 0))
                        lastDir = getEl("weaponGrind").checked ? "getSafeDir()" : enemy.length ? my.revAim ? "(near.aim2 + Math.PI)" : "near.aim2" : "getSafeDir()";
                    else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = "getSafeDir()";
                    else if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = "traps.aim";
                    else if (!player.lockDir) {
                            if (os.noDir) return "undefined";
                            lastDir = "getSafeDir()";
                        }
                    return lastDir;
                } else {
                    if (!player)
                        return 0;
                    if (my.autoAim || ((clicks.left || (useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap)) && player.reloads[player.weapons[0]] == 0))
                        lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? my.revAim ? (near.aim2 + Math.PI) : near.aim2 : getSafeDir();
                    else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)
                        lastDir = getSafeDir();
                    else if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0)
                        lastDir = traps.aim;
                    else if (spinner == true) {
                            spinDir += (Math.PI * 2) / (9 / 4);
                            return spinDir;
                        } else {
                            if (!player.lockDir) {
                                if(useWasd) {
                                    lastDir = lastDir;
                                } else {
                                    lastDir = getSafeDir();
                                }
                            }
                        }
                    return lastDir || 0;
                }
            }

            function getVisualDir() {
                if (!player)
                    return 0;
                if (my.autoAim || ((clicks.left || (useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap)) && player.reloads[player.weapons[0]] == 0))
                    lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? my.revAim ? (near.aim2 + Math.PI) : near.aim2 : getSafeDir();
                else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)
                        lastDir = getSafeDir();
                else if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0)
                        lastDir = traps.aim;
                else if (!player.lockDir) {
                        lastDir = getSafeDir();
                    }
                return lastDir || 0;
            }

            // KEYS:
            function keysActive() {
                return (allianceMenu.style.display != "block" && chatHolder.style.display != "block" && canmove);
            }

            function cKey(keyCode, key) {
                if (getEl(key + "k").checked) {
                    if (keyCode == getEl(key).value) {
                        return true;
                    }
                }
                return false;
            }






            let toggled = false;
            function keyDown(event) {
                let keyNum = event.which || event.keyCode || 0;
                if (player && player.alive && keysActive()) {
                    if (!keys[keyNum]) {
                        keys[keyNum] = 1;
                        macro[event.key] = 1;
                        if (keyNum == 27) {
                            $("#modMenus").toggle();
                            $("#test").toggle();
                            toggled = !toggled;
                            if (toggled) {
                                mStatus.style.display = "block";
                                leaderboard.style.display = "block";
                                if (true) {
                                    allianceButton.style.left = "330px";
                                    allianceButton.style.width = "40px";
                                    storeButton.style.left = "270px";
                                    storeButton.style.width = "40px";
                                } else {
                                    allianceButton.style.right = "270px";
                                    allianceButton.style.width = "40px";
                                    storeButton.style.right = "330px";
                                    storeButton.style.width = "40px";
                                }
                            } else {
                                mStatus.style.display = true ? "block" : "none";
                                leaderboard.style.display = true ? "none" : "block";
                                if (true) {
                                    allianceButton.style.left = "520px";
                                    allianceButton.style.width = "40px";
                                    storeButton.style.left = "460px";
                                    storeButton.style.width = "40px";
                                } else {
                                    allianceButton.style.right = "270px";
                                    allianceButton.style.width = "40px";
                                    storeButton.style.right = "330px";
                                    storeButton.style.width = "40px";
                                }
                            }
                        } else if (keyNum == 69) {
                            sendAutoGather();
                        } else if (keyNum == 67) {
                            updateMapMarker();
                        } else if (player.weapons[keyNum - 49] != undefined) {
                            player.weaponCode = player.weapons[keyNum - 49];
                        } else if (moveKeys[keyNum]) {
                            sendMoveDir();
                        } else if (event.key == "r") {// Make Insta?
                            instaC.wait = !instaC.wait;

                        } else if (event.key == "y") {// Make boostspike?
                            boostspike = !boostspike;


                        } else if (getEl("useautoInstaong").checked && event.key == "g") {
                            AutoOneTicked = !AutoOneTicked;
                        } else if (event.key == "z") {
                            mills.place = !mills.place;
                        } else if (event.key == "Z") {
                            typeof window.debug == "function" && window.debug();
                        } else if (keyNum == 32) {
                            packet("d", 1, getSafeDir(), 1);
                            packet("d", 0, getSafeDir(), 1);
                        } else if (event.key == ",") {
                            player.sync = true;
                        }
                    }
                }
            }
            addEventListener("keydown", UTILS.checkTrusted(keyDown));

            function keyUp(event) {
                if (player && player.alive) {
                    let keyNum = event.which || event.keyCode || 0;
                    if (keyNum == 13) {
                    } else if (keysActive()) {
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
                let newMoveDir = getMoveDir();
                if (lastMoveDir == undefined || newMoveDir == undefined || Math.abs(newMoveDir - lastMoveDir) > 0.3) {
                    if (!my.autoPush) {
                        packet("a", newMoveDir, 1);
                    }
                    lastMoveDir = newMoveDir;
                }
            }

            // ITEM COUNT DISPLAY:
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

            // AUTOPUSH:
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

            // ADD DEAD PLAYER:
            function addDeadPlayer(_) {
                deadPlayers.push(new DeadPlayer(_.x, _.y, _.dir, _.buildIndex, _.weaponIndex, _.weaponVariant, _.skinColor, _.scale, _.name));
            }

            /** APPLY SOCKET CODES */

            // SET INIT DATA:
            function setInitData(data) {
                alliances = data.teams;
            }

            // SETUP GAME:
            function setupGame(yourSID) {
                keys = {};
                macro = {};
                playerSID = yourSID;
                attackState = 0;
                inGame = true;
                packet("d", 0, getAttackDir(), 1);
                my.ageInsta = true;
                if (firstSetup) {
                    firstSetup = false;
                    gameObjects.length = 0;
                }
            }

            // ADD NEW PLAYER:
            function addPlayer(data, isYou) {
                let tmpPlayer = findPlayerByID(data[0]);
                if (!tmpPlayer) {
                    tmpPlayer = new Player(data[0], data[1], o, UTILS, projectileManager,
                                           objectManager, players, ais, items, hats, accessories);
                    players.push(tmpPlayer);
                    if (data[1] != playerSID) {
                        //addMenuChText("Game", `Found ${data[2]} {${data[1]}}`, "yellow");
                    }
                } else {
                    if (data[1] != playerSID) {
                        // addMenuChText("Game", `Encount ${data[2]} {${data[1]}}`, "yellow");
                    }
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
                    my.lastDir = 0;
                    updateItems();
                    updateAge();
                    updateItemCountDisplay();
                    for (let i = 0; i < 5; i++) {
                        petals.push(new Petal(player.x, player.y));
                    }
                    if (player.skins[7]) {
                        my.reSync = true;
                    }
                }
            }

            // REMOVE PLAYER:
            function removePlayer(id) {
                for (let i = 0; i < players.length; i++) {
                    if (players[i].id == id) {
                        //  addMenuChText("Game", players[i].name + " left the game", "yellow");
                        players.splice(i, 1);
                        break;
                    }
                }
            }

            // UPDATE HEALTH:
            function updateHealth(sid, value) {
                _ = findPlayerBySID(sid);
                if (_) {
                    _.oldHealth = _.health;
                    _.health = value;
                    _.judgeShame();
                    if (_.oldHealth > _.health) {
                        _.damaged = _.oldHealth - _.health;
                        advHeal.push([sid, value, _.damaged]);
                    } else {}
                    if (_.health <= 0) {
                        /*bots.forEach((hmm) => {
                            hmm.whyDie = _.name;
                        });*/
                    }
                }
            }
            let backupAnti = [];
            let hittedTime = Date.now();
            function getMaxPot() {
                let dmg = 0;
                enemy.forEach(tmp => {
                    if (getDist(player, tmp) - 63 <= items.weapons[tmp.weapons[0]].range) {
                        dmg += player.checkCanInsta(false);
                    }
                });
                return dmg;
            }
            // Heling:
            function healingTrap() {
                let maxPotential = getMaxPot();
                let pingHeal = function() {
                    return Math.max(0, maxPotential - window.pingTime);
                };
                if (true) {
                    setTimeout(() => {
                        for (let i = 0; i < healthBased(); i++) {
                            place(0, getAttackDir());
                        }
                    }, 2);
                } else {
                    setTimeout(() => {
                        for (let i = 0; i < healthBased(); i++) {
                            place(0, getAttackDir());
                        }
                    }, 2);
                }
            }
            function instaheal(e, t) {
                let foodType = (player.items[0] == 0 ? 20 : player.items[0] == 1 ? 40 : 30)
                let times = (e == "max" ? (100-player.health)/foodType : e == (null || undefined) ? 1 : e);
                for(let i = 0; i < times; i++) {
                    place(0, getAttackDir());
                }
            }
            //instaheal(100, 100);
            function fastHealing(speed) {
                let value = player.health;
                let attackers = getAttacker(damaged);
                let gearDmgs = [0.25, 0.45].map((val) => val * items.weapons[player.weapons[0]].dmg * soldierMult());
                let includeSpikeDmgs = !my.reSync && gearDmgs.includes(damaged);
                let maxPotential = getMaxPot();


                let pingHeal = function() {
                    return Math.max(0, maxPotential - window.pingTime);
                };
                let autoHeal;
                let doMaxHeal = function () {
                    clearInterval(autoHeal);
                    for (let i = 0; i < Math.ceil(Math.min(100 - value, 50) / items.list[player.items[0]].consume); i++) {
                        place(player.items[0]);
                    }
                };
                if (speed >= 100000) {
                    canAntiHeal = true;
                } else {
                    canAntiHeal = false;
                }

                // Heal:
                setTimeout(()=>{
                    if (traps.inTrap) {
                        healingTrap();
                    } else {
                        setTimeout(()=>{
                            for (let i = 0; i < healthBased(); i++) {
                                if (canAntiHeal == true && value <= 50 && near.checkCanInsta(true) >= 100) {
                                    setTimeout(()=>{
                                        place(0, getAttackDir());
                                        setTimeout(()=>{
                                            place(0, getAttackDir());
                                            setTimeout(()=>{
                                                place(0, getAttackDir());
                                            }, speed*5);
                                        }, speed*4);
                                    }, speed*3);
                                } else {
                                    place(0, getAttackDir());
                                }
                                healer();
                            }
                        }, speed*2);
                    }
                }, speed);//pingHeal();
            }

            // KILL PLAYER:
            function killPlayer() {
                petals = [];
                inGame = false;
                lastDeath = {
                    x: player.x,
                    y: player.y,
                };
                /*menuCardHolder.style.display = "block";
                mainMenu.style.display = "block";
                diedText.style.display = "none";*/
                if (os.autoRespawn) {
                    packet("M", {
                        name: lastsp[0],
                        moofoll: lastsp[1],
                        skin: lastsp[2]
                    });
                }
            }


            // UPDATE PLAYER ITEM VALUES:
            function updateItemCounts(index, value) {
                if (player) {
                    player.itemCounts[index] = value;
                    updateItemCountDisplay(index);
                }
            }

            // UPDATE AGE:
            function updateAge(xp, mxp, age) {
                if (xp != undefined)
                    player.XP = xp;
                if (mxp != undefined)
                    player.maxXP = mxp;
                if (age != undefined)
                    player.age = age;
            }

            // UPDATE UPGRADES:
            function updateUpgrades(points, age) {
                player.upgradePoints = points;
                player.upgrAge = age;
                if (points > 0) {
                    tmpList.length = 0;
                    UTILS.removeAllChildren(upgradeHolder);
                    for (let i = 0; i < items.weapons.length; ++i) {
                        if (items.weapons[i].age == age && (testMode || items.weapons[i].pre == undefined || player.weapons.indexOf(items.weapons[i].pre) >= 0)) {
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
                        if (items.list[i].age == age && (testMode || items.list[i].pre == undefined || player.items.indexOf(items.list[i].pre) >= 0)) {
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


                try {
                    if (getEl("aaauaua").checked) {
                        let value = getEl("autoupgrade").value;
                        let upgradinggggggggggg = 0;
                        function anusUpdate(e1, e2, e3, e4, e5, e7, e8, omgogmom = true) {
                            if(upgradinggggggggggg == 0) {
                                sendUpgrade(e1);
                            } else if(upgradinggggggggggg == 1) {
                                sendUpgrade(e2)
                            } else if (upgradinggggggggggg == 2) {
                                sendUpgrade(e3)
                            } else if (upgradinggggggggggg == 3) {
                                sendUpgrade(e4)
                            } else if (upgradinggggggggggg == 4) {
                                sendUpgrade(e5);
                            } else if(upgradinggggggggggg == 5) {
                                sendUpgrade(getEl("7slot").value);
                            } else if (upgradinggggggggggg == 5 && omgogmom == true) {
                                sendUpgrade(e7);
                            } else if (upgradinggggggggggg == 7 && omgogmom == true) {
                                sendUpgrade(e8);
                            }
                            upgradinggggggggggg++;
                        }
                        setInterval(()=>{
                            if(value == "kh"){
                                anusUpdate(7, 17, 31, 23, 10, 4, 25);
                            } else if(value == "pm") {
                                anusUpdate(5, 17, 31, 23, 9, 12, 15);
                            } else if(value == "km") {//old
                                anusUpdate(7, 17, 31, 23, 9, 4, 15);
                            } else if(value == "dh") {
                                anusUpdate(7, 17, 31, 23, 10, 28, 25);
                            } else if(value == "ph") {
                                anusUpdate(5, 17, 31, 27, 10, 28, 25);
                            } else if(value == "sm") {
                                anusUpdate(3, 17, 31, 23, 9, 0, 0, false);
                            } else if(value == "dm") {
                                anusUpdate(7, 17, 31, 23, 9, 0, 0, false);
                            }
                        }, 500);
                    }
                } catch (e) {
                    console.log(e);
                }


            }
            function getDist(e, t) {
                try {
                    return Math.hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return Infinity;
                }
            }
            function cdf(e, t) {
                try {
                    return Math.hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return Infinity;
                }
            }
            function caf(e, t) {
                try {
                    return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return 0;
                }
            }
            // KILL OBJECT:
            let breakTracks = [], breakTracksTracers = [];
            function killObject(sid) {
                let findObj = findObjectBySid(sid);
                objectManager.disableBySid(sid);
                let objAim = UTILS.getDirect(findObj, player, 0, 2);
                let objDst = UTILS.getDist(findObj, player, 0, 2);

                if (enemy.length) {
                    // Spike Tick:
                    if (objDst <= 200 && near.dist2 <= 180 && _ != player && player.reloads[player.weapons[0]] == 0) {
                        bianosSpTick();
                    }
                    // Auto Replace:
                    traps.replacer(findObj);
                }


                // Break Traceks:
                if (objDst > 1200) {
                    if (breakTracks.length >= 7) {
                        breakTracks = [];
                    }
                    breakTracks.push({
                        x: findObj.x,
                        y: findObj.y
                    });
                    breakTracksTracers.push({
                        x: findObj.x,
                        y: findObj.y
                    });
                }
            }


            // KILL ALL OBJECTS BY A PLAYER:
            function killObjects(sid) {
                if (player) objectManager.removeAllItems(sid);
            }
            function fgdo(a, b) {
                return Math.sqrt(Math.pow((b.y - a.y), 2) + Math.pow((b.x - a.x), 2));
            }
            function setTickout(doo, timeout) {
                if (!ticks.manage[game.tick + timeout]) {
                    ticks.manage[game.tick + timeout] = [doo];
                } else {
                    ticks.manage[game.tick + timeout].push(doo);
                }
            }
            function doNextTick(doo) {
                waitTicks.push(doo);
            }
            let waitTicks = [];
            let autoQ = false;
            function bianosSpTick(){
                preplaceSpam = [true, near.skinIndex == 6 ? 4 : 2];
                buyEquip(7, 0);
                buyEquip(18, 1);
                selectWeapon(player.weapons[0]);
                io.send("d", 1, near.aim2);
                place(2, near.aim2);
                setTickout(()=>{
                    buyEquip(53, 0);
                    buyEquip(21, 1);
                    setTickout(()=>{
                        io.send("d", 0, near.aim2);
                        buyEquip(6, 0);
                    }, 3);
                }, 1);
            }

            // Send Chat:
            function ch(e) {
                io.send("6", e.slice(0, 30));
            }
            function ch2(text, waitCount = 3000) {
                player.chat.message = text;
                player.chat.count = waitCount;
            }
            function ch3(text, time = 500, color = "#fff") {
                textManager.showText(player.x2, player.y2, 30, 0.15, time, text, color, 2);
            }
            // Hat / Acc:
            function Hg(hat, acc){
                buyEquip(hat, 0);
                buyEquip(acc, 1);
            }
            // Dir:
            function toDeg(a) {
                return a / (Math.PI / 180)
            }
            // Angel:
            function angleDist(angle1, angle2) {
                if(angle1 < 0) angle1 += Math.PI*2;
                if(angle2 < 0) angle2 += Math.PI*2;
                return Math.abs(angle1 - angle2);
            }
            function fixAngle(a) {
                return (360 + (a % 360)) % 360;
            }
            function calcAngle(xs, ys, xe, ye) {
                return Math.atan2(ye - ys, xe - xs);
            }
            // Dist:
            function getDistance(x1, y1, x2, y2) {
                return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
            }
            // More:
            function isAlly(sid){
                _ = findPlayerBySID(sid)
                if(!_){
                    return
                }
                if(player.sid == sid){
                    return true
                }else if(_.team){
                    return _.team === player.team ? true : false
                } else {
                    return false
                }
            }
            // Random Spin:
            function spin() {// PPL code
                let random = [2, 3, 4, 5, 7, 3, 23, -1];
                setTickout(() => {
                    spinner = true;
                    setTickout(() => {
                        spinner = false;
                    }, random[Math.floor(Math.random() * (random.length + 1))]);
                }, 1);
            }

            // n ti:

            let turretEmp = 0, turrets = 0;
            let cst = false, preplaceOverride = false;
            // Synced:
            let Synced = {
                SyncShotPri: 0,
                SyncShotSec: 0,
                bultect: false,
            }
            function canSyncHit() {
                let N = gameObjects;
                let _ = findPlayerByID(near);
                if(player.reloads[player.weapons[0]] != 1) return false;
                if(near.dist2/1.56 > items.weapons[player.weapons[0]].range) return false;
                let x = (_.velX || _.x2), y = (_.velY || _.y2);
                let isEnemyTraped = false;
                for(let i = 0; i < N.length; i++) {
                    if(N[i] && N[i].name == "pit trap" && N[i].active && (N[i].owner.sid == player.sid || isAlly(N[i].owner.sid)) && Math.hypot(N[i].y - _.y2, N[i].x - _.x2) < 70) {
                        isEnemyTraped = true;
                    }
                    if(N[i] && N[i].dmg && N[i].active && isEnemyTraped == false && (N[i].owner.sid == player.sid || isAlly(N[i].owner.sid))) {
                        if(Math.hypot(N[i].y - y, N[i].x - x) <= 35 + N[i].scale) {
                            return true;
                        }
                    }
                }
                if(_.health - (Math.round(items.weapons[player.weapons[0]].dmg * 1.5 * window.variantMulti(items.weapons[player.weapons[0]].variant) * (_.skinIndex == 6 ? .75 : 1))) <= 0) {
                    return true;
                }
                return false;
            }
            // Replace
            let preplaceSpam = false;
            function perfectReplace() {
                if (!getEl("preplacer").checked) return;

                if (enemy.length) {
                    if (UTILS.getDist(near, player, 0, 2) < 300) {
                        let nea = Math.atan2(near.y - player.y, near.x - player.x);

                        if (player.items[4] == 15) {
                            if (preplaceSpam[0] || instaC.canSpikeTick) {
                                place(preplaceSpam[1], nea, 1);
                            } else if (retrappable) {
                                place(4, nea);
                            } else {
                                for (let e = nea - 2 * Math.PI; e < nea + 2 * Math.PI * 1.5; e += Math.PI * 1.5 / 2) place(4, e);
                            }
                            retrappable = false;
                        }
                    }
                }
            }


            // Get XP:
            let Ab = null , Ac = null , Ad = {wood: 0,stone: 0, food:0, score: 0} , priXP = 0 , secXP = 0 , maxPriXP = 0 , maxSecXP = 0 , addXP = (d) => {
                if(player.weaponIndex == player.weapons[0]) priXP += d; else secXP += d
            }
            setInterval(() => {
                try {
                    Ab == player.weapons[0] && Ac == player.weapons[1] || (player.weapons[0] != Ab && (priXP = 0), player.weapons[1] != Ac && (secXP = 0)), Ab = player.weapons[0], Ac = player.weapons[1];
                    let e = Number(document.getElementById("stoneDisplay").innerHTML)
                    , t = Number(document.getElementById("foodDisplay").innerHTML)
                    , n = Number(document.getElementById("woodDisplay").innerHTML)
                    //, i = Number(document.getElementById("scoreDisplay").innerHTML)
                    e > Ad.stone && (addXP(e - Ad.stone), Ad.stone = e), t > Ad.food && (addXP(t - Ad.food), Ad.food = t),
                        n > Ad.wood && (addXP(n - Ad.wood), Ad.wood = n)//, i > Ad.score && (addXP(i - Ad.score), Ad.score = i)
                } catch (e) {};
            }, 112.5);
            // Dmg Predictive:
            let inFlight = [];
            let canDmg = 0;
            let SafeDefense = 0;



            //ProjectileSafety(player.health, player.health)
            function ProjectileSafety(e, t) {
                e = 0;
                t = e;
                SafeDefense = e + t;
                if (inFlight.length < 1) return;
                for (let a of inFlight) {
                    if (a.active) {
                        if (a.estimate <= 2) {
                            e += a.dmg;
                        } else {
                            t += a.dmg;
                        }
                    }
                }
                SafeDefense = e + t;
            }
            function dmgPotential(t) {
                t = 0;
                let temp = 0 + (player.reloads[player.primaryIndex] == 0 ? (1.5 * items.weapons[player.weapons[0]].dmg) : 0) + (player.reloads[player.secondaryIndex] == 1 && player.weapons[1] ? (items.weapons[player.weapons[1]].dmg || items.projectiles[items.weapons[player.weapons[1]].projectile].dmg || 0) : 0) + (player.reloads[53] && near.skinIndex != 22 ? 25 : 0);
                near.skinIndex == 6 && (temp *= 0.75);

                canDmg = SafeDefense;
                window.threatLevels = (SafeDefense) / 20;
                if (canDmg >= 2000 && canDmg <= 3250) {
                    ch("sync detect test");
                }
                return temp;
            }
            let predictDamage = 0;

            function guessDamagePrediction() {
                predictDamage = 0;
                if (enemy.length) {
                    if (near.dist2 <= 300) {
                        if (near.antiBull > 0 && near.skinIndex == 11) {
                            predictDamage += items.weapons[player.weapons[0]].dmg * 0.45;
                        }
                        if (near.antiBull > 0 && near.tailIndex == 21) {
                            predictDamage += items.weapons[player.weapons[0]].dmg * 0.25;
                        }
                        predictDamage *= player.skinIndex == 6 ? 0.75 : 1;
                        if ((game.tick - player.bullTick) % o.serverUpdateRate === 0 && player.shameCount > 0) {
                            predictDamage += 5;
                            if (player.tailIndex == 13) {
                                predictDamage -= 3;
                            }
                        }
                    }
                }
            }
            let Trees = [], Foodbush = [], StoneOreok = [], GoldMines = [];
            let showingExtraMap = false;
            function isElementVisible(e) {
                return (e.offsetParent !== null);
            }
            // StatusMenus
            var mStatus = document.createElement("div");
            mStatus.id = "status";
            mStatus.style.position = "absolute";
            mStatus.style.color = "#e6e6fa";
            mStatus.style.font = "15px Hammersmith One";
            mStatus.style.top = "40px";
            mStatus.style.left = "40px";
            mStatus.style.display = "none";
            mStatus.textAlign = "right";
            document.body.appendChild(mStatus);
            function LoadRevivalVisual() {
                mStatus.innerHTML = `
                <style>
                .sizing {
                    font-size: 15px;
                }
                .mod {
                    font-size: 15px;
                    display: inline-block;
                }
                .augh {
                    display: inline-block;
                    width: 25px;
                    height: 25px;
                    background-size: cover;
                    background-color: #fff;
                    margin-right: -2.5px;
                    opacity: 0.4;
                }
                </style>

                <div class = "sizing" style = "display: block;">
                Auto-Insta: <div id = "autoInsta1" class = "mod">0</div></br>
                Damage Prediction: <div id = "dmgPredict" class = "mod">0</div></br>
                Turrets that can hit you: <div id = "turCanHit" class = "mod">0</div></br>
                </div>
                `;
                /*
                [<div id = "xyPing" class = "mod">0</div>]</br>
                AutoQ:  <div id = "autoqUgotClown" class = "mod">false</div> (if this is on, you will clown)</br>
                Clan IDs: [<div id = "clanids" class = "mod">0</div>]</br>
                */
                // MooMoo Guis
                if (true) {
                    mapDisplay.style.backgroundImage = "url(https://ksw2-center.glitch.me/users/fzb/map.png)";
                    mapDisplay.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
                    foodDisplay.style.display = "block";
                    woodDisplay.style.display = "block";
                    stoneDisplay.style.display = "block";
                    scoreDisplay.style.bottom = "160px";
                    scoreDisplay.style.right = "inherit";
                    scoreDisplay.style.left = "20px";
                    scoreDisplay.style.backgroundPosition = "left 6px center";
                    scoreDisplay.style.paddingLeft = "40px";
                    scoreDisplay.style.paddingRight = "10px";

                    // Fz
                    if (true) {
                        mStatus.style.color = "#fff";
                        mStatus.style.top = "20px";
                        mStatus.style.left = null;
                        mStatus.style.right = "20px";
                        mStatus.style.display = "block";
                        leaderboard.style.position = "fixed";
                        leaderboard.style.left = "20px";
                        leaderboard.style.right = null;
                        leaderboard.style.display = "none";
                        allianceButton.style.left = "520px";
                        allianceButton.style.right = null;
                        allianceButton.style.width = "40px";
                        storeButton.style.left = "460px"
                        storeButton.style.right = null;
                        storeButton.style.width = "40px";
                        chatButton.style.display = "none";
                        resourceDisplay.appendChild(killCounter);
                        killCounter.style.bottom = "185px";
                        killCounter.style.right = "20px";
                        scoreDisplay.style.bottom = "240px";
                        scoreDisplay.style.right = "20px";
                        scoreDisplay.style.left = "inherit";
                        scoreDisplay.style.backgroundPosition = "right 6px center";
                        scoreDisplay.style.paddingLeft = "10px";
                        scoreDisplay.style.paddingRight = "40px";
                    }
                }
            }
            LoadRevivalVisual();

            let cursorDisplay = document.createElement("div");
            cursorDisplay.id = "test"
            document.body.prepend(cursorDisplay);
            document.getElementById('test').style.display = 'block';
            document.getElementById('test').style.opacity = '1';
            document.getElementById('test').innerHTML =
                `
            <div>   <table id="StatTbl"
            class="hackDisp"
            style="
            opacity: 1;
            display: block;
            width: 205px;
            position: absolute;
            top: 240px;
            left: 20px;
            color: #fff;
            background-color: rgba(0, 0, 0, 0.25);
            border-radius: 4px;
            -moz-border-radius: 4px;
            -webkit-border-radius: 4px;
            pointer-events: none;
            "
            border="0">
            <tbody>




            <tr style="height: 21px;">
            <td style="height: 21px;color: rgba(255, 255, 255, 0.6);">
            <button id="settingsBoxOpen" style="pointer-events: auto;background-color: black;color: white;border-color: black;border-radius: 4px;-moz-border-radius: 4px;-webkit-border-radius: 4px;">Settings</button> </td>



            <td id="pingDisp" style="height: 21px;color: white;"> Ping: Null</td>
            </tr>



            <tr style="height: 21px;">
            <td style="height: 21px;color: rgba(255, 255, 255, 0.6);">Pri XP: </td>
            <td style="height: 21px;"><span id="priXP">0 / not found</span></td>
            </tr>




            <tr style="height: 21px;">
            <td style="height: 21px;color: rgba(255, 255, 255, 0.6);">Sec XP:</td>
            <td style="height: 21px;"><span id="secXP">0 / not found</span></td>
            </tr>



            <tr style="height: 21px;">
            <td style="height: 21px;color: rgba(255, 255, 255, 0.6);">Healer:</td>
            <td style="height: 21px;"><span id="healer">none</span></td>
            </tr>



            <tr style="height: 21px;">
            <td style="height: 21px;color: rgba(255, 255, 255, 0.6);">PvP Mode:</td>
            <td style="height: 21px;"><span id="PVPmode">None</span></td>
            </tr>

            <tr style="height: 21px;">
            <td style="height: 21px;color: rgba(255, 255, 255, 0.6);">Ping:</td>
            <td style="height: 21px;"><span id="urXandYping">[Null, Null]</span></td>
            </tr>


            <tr style="height: 21px;">
            <td style="height: 21px;color: rgba(255, 255, 255, 0.6);">ATOS:</td>
            <td style="height: 21px;"><span id="ATOSmodule">false</span></td>
            </tr>







            </tbody>


            </table>

            </div></div><style>










            `;
            /*
const allowedIPs = ['1.1.1.1'];
function checkIPAddress() {
  fetch('https://api64.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      const userIP = data.ip;
      if (!allowedIPs.includes(userIP)) {
        alert('You do not have access to use this script.');
        window.location.reload();
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
checkIPAddress();


            */



            function toRad(angle) {
                return (angle * Math.PI) / 180;
            }
            // UPDATE PLAYER DATA:
            let autoZoom = true;
            let FT = 0;
            let AutoOneTicked = false;
            let lppc = 0, ntpp = false, lppc2 = 0, ntpp2 = false;
            let boostspike = false;
            let doAutoQ = false;
            let spinner = false;



            // n ti:
            function updatePlayers(data) {
                /*
                if(player.shameCount > 0) {
                    my.reSync = true;
                } else {
                    my.reSync = false;
                }
                */
                game.tick++;
                enemy = [];
                nears = [];
                near = [];
                game.tickSpeed = performance.now() - game.lastTick;
                game.lastTick = performance.now();
                players.forEach((tmp) => {
                    tmp.forcePos = !tmp.visible;
                    tmp.visible = false;
                });
                for (let i = 0; i < data.length;) {
                    _ = findPlayerBySID(data[i]);
                    if (_) {
                        _.t1 = (_.t2 === undefined) ? game.lastTick : _.t2;
                        _.t2 = game.lastTick;
                        _.oldPos.x2 = _.x2;
                        _.oldPos.y2 = _.y2;
                        _.x1 = _.x;
                        _.y1 = _.y;
                        _.x2 = data[i + 1];
                        _.y2 = data[i + 2];
                        _.x3 = _.x2 + (_.x2 - _.oldPos.x2);
                        _.y3 = _.y2 + (_.y2 - _.oldPos.y2);
                        _.d1 = (_.d2 === undefined) ? data[i + 3] : _.d2;
                        _.d2 = data[i + 3];
                        _.dt = 0;
                        _.buildIndex = data[i + 4];
                        _.weaponIndex = data[i + 5];
                        _.weaponVariant = data[i + 6];
                        _.team = data[i + 7];
                        _.isLeader = data[i + 8];
                        _.oldSkinIndex = _.skinIndex;
                        _.oldTailIndex = _.tailIndex;
                        _.skinIndex = data[i + 9];
                        _.tailIndex = data[i + 10];
                        _.iconIndex = data[i + 11];
                        _.zIndex = data[i + 12];
                        _.visible = true;
                        _.update(game.tickSpeed);
                        _.dist2 = UTILS.getDist(_, player, 2, 2);
                        _.aim2 = UTILS.getDirect(_, player, 2, 2);
                        _.dist3 = UTILS.getDist(_, player, 3, 3);
                        _.aim3 = UTILS.getDirect(_, player, 3, 3);
                        _.damageThreat = 0;
                        if (_ == player) {
                            _.syncThreats = 0;
                        }
                        if (_.skinIndex == 45 && _.shameTimer <= 0) {
                            _.addShameTimer();
                        }
                        if (_.oldSkinIndex == 45 && _.skinIndex != 45) {
                            _.shameTimer = 0;
                            _.shameCount = 0;
                            if (_ == player) {
                                healer();
                            }
                        }
                        if (_ == player) {
                            if (gameObjects.length) {
                                gameObjects.forEach((tmp) => {
                                    tmp.onNear = false;
                                    if (tmp.active) {
                                        if (!tmp.onNear && UTILS.getDist(tmp, _, 0, 2) <= tmp.scale + items.weapons[_.weapons[0]].range) {
                                            tmp.onNear = true;
                                        }
                                        /*
                                        if (tmp.isItem && tmp.owner) {
                                            if (!tmp.pps && _.sid == tmp.owner.sid && UTILS.getDist(tmp, _, 0, 2) > (parseInt(getEl("breakRange").value) || 0) && !tmp.breakObj && ![13, 14, 20].includes(tmp.id)) {
                                                tmp.breakObj = true;
                                                breakObjects.push({
                                                    x: tmp.x,
                                                    y: tmp.y,
                                                    sid: tmp.sid
                                                });
                                            }
                                        }
                                        */
                                    }
                                });
                                let nearTrap = gameObjects.filter(e => e.trap && e.active && UTILS.getDist(e, _, 0, 2) <= (_.scale + e.getScale() + 5) && !e.isTeamObject(_)).sort(function(a, b) {
                                    return UTILS.getDist(a, _, 0, 2) - UTILS.getDist(b, _, 0, 2);
                                })[0];
                                if (nearTrap) {
                                    traps.dist = UTILS.getDist(nearTrap, _, 0, 2);
                                    traps.aim = UTILS.getDirect(nearTrap, _, 0, 2);
                                    if (!traps.inTrap) {
                                        traps.protect(traps.aim);
                                    }
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
                        if (_.weaponIndex < 9) {
                            _.primaryIndex = _.weaponIndex;
                            _.primaryVariant = _.weaponVariant;
                        } else if (_.weaponIndex > 8) {
                            _.secondaryIndex = _.weaponIndex;
                            _.secondaryVariant = _.weaponVariant;
                        }
                    }
                    i += 13;
                }







                getEl("ExtraPerformanceButton").onclick = function() {
                    if (getEl("ExtraPerformanceButton").checked) {
                        getEl("ExtraPerformanceMode").value;
                    }
                }
                try {
                    let t = 3e3;
                    switch(player.weaponVariant) {
                        case 0:
                            t = 3e3;
                            break;
                        case 1:
                            t = 7e3;
                            break;
                        case 2:
                            t = 12e3;
                            break;
                        case 3:
                            t = 1 / 0
                    }
                    (player.weaponIndex == player.weapons[0] ? maxPriXP = t : maxSecXP = t);
                } catch (e) {};
                // Load Shit
                if (true) {
                    getEl("PVPmode").innerHTML = "bull";
                    getEl("urXandYping").innerHTML = "["+ ms.avg + ", " + window.pingTime +"]";
                    getEl("pingDisp").innerHTML = "Ping: " + window.pingTime + " / Max: " + ms.max;
                    //getEl("placestatus").innerHTML = (placeEveryTick1 ? "true" : "false");
                    getEl("ATOSmodule").innerHTML = (player.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate)) ? "true" : "false";
                    getEl("priXP").innerHTML = priXP + " / " + maxPriXP;
                    getEl("secXP").innerHTML = secXP + " / " + maxSecXP;

                    getEl("autoInsta1").innerHTML = (instaC.wait ? "on" : "off").toUpperCase();
                    getEl("dmgPredict").innerHTML = predictDamage;
                    getEl("turCanHit").innerHTML = turretEmp;
                }
                // Healer:
                if (window.pingTime >= 90) {
                    doAutoQ = true;
                } else {
                    doAutoQ = false;
                }
                if (getEl("autoq").checked && (doAutoQ || getEl("evautoq").checked)) {
                    getEl("healer").innerHTML = "autoQ";
                    if (player.shameCount < 4 && near.dist2 <= 300 && near.reloads[near.primaryIndex] <= o.tickRate * (window.pingTime >= 200 ? 2 : 1)) {
                        autoQ = true;
                        place(0, getAttackDir());
                    } else {
                        if (autoQ) {
                            place(0, getAttackDir());
                        }
                        autoQ = false;
                    }
                } else {
                    autoQ = false;
                    if (nears.length >= 2) {
                        getEl("healer").innerHTML = nears.length + "v1";
                    } else {
                        getEl("healer").innerHTML = (window.pingTime <= 85 ? "Low Ping" : "High Ping");
                    }
                }
                // AutoEmp / Anti Turret:
                turrets = gameObjects.filter((obj) => obj.name == "turret" && fgdo(obj, player) < 710);
                turretEmp = 0;
                let CheckEmpMode = getEl("simpleEmpAnti").checked ? turrets : turretEmp > 0;
                gameObjects.filter((e)=>e.active && e.doUpdate).forEach((tmp)=>{
                    if (tmp.shootted) {
                        tmp.shootted = 0;
                        tmp.shootReload = 2200 - game.tickRate;
                    } else {
                        if (tmp.shootReload > 0) {
                            tmp.shootReload = Math.max(0, tmp.shootReload - game.tickRate);
                            if (tmp.shootReload <= 0) {
                                tmp.shootReload = 2200;
                                if (player.sid != tmp.owner.sid && !player.findAllianceBySid(tmp.owner.sid) && UTILS.getDist(tmp, player, 0, 2) <= 735) {
                                    turretEmp++;
                                }
                            }
                        }
                    }
                });

                if (runAtNextTick.length) {
                    runAtNextTick.forEach((tmp) => {
                        checkProjectileHolder(...tmp);
                    });
                    runAtNextTick = [];
                }
                for (let i = 0; i < data.length;) {
                    _ = findPlayerBySID(data[i]);
                    if (_) {
                        if (!_.isTeam(player)) {
                            enemy.push(_);
                            if (_.dist2 <= items.weapons[_.primaryIndex == undefined ? 5 : _.primaryIndex].range + (player.scale * 2)) {
                                nears.push(_);
                            }
                        }
                        _.manageReload();
                        if (_ != player) {
                            _.addDamageThreat(player);
                        }
                    }
                    i += 13;
                }
                /*projectiles.forEach((proj) => {
                    _ = proj;
                    if (_.active) {
                        _.tickUpdate(game.tickSpeed);
                    }
                });*/
                if (player && player.alive) {
                    // Spin for international.terrorist
                    if (getEl("spin").checked && !(clicks.middle || clicks.left || clicks.right) && !my.waitHit && !traps.inTrap) {
                        spinner = true;
                    } else {
                        spinner = false;
                    }

                    if (enemy.length) {
                        near = enemy.sort(function(tmp1, tmp2) {
                            return tmp1.dist2 - tmp2.dist2;
                        })[0];
                    } else {
                        // console.log("no enemy");
                    }
                    nears.forEach((e)=>{
                        if (e.primaryIndex != undefined && e.reloads[e.primaryIndex] == 0 && e.primaryIndex != undefined && e.reloads[e.primaryIndex] == 0) {
                            player.syncThreats++;
                        }
                    });
                    if (game.tickQueue[game.tick]) {
                        game.tickQueue[game.tick].forEach((action) => {
                            action();
                        });
                        game.tickQueue[game.tick] = null;
                    }
                    if (advHeal.length) {
                        advHeal.forEach((updHealth) => {
                            let sid = updHealth[0];
                            let value = updHealth[1];
                            let damaged = updHealth[2];
                            _ = findPlayerBySID(sid);

                            let bullTicked = false;

                            if (_.health <= 0) {
                                if (!_.death) {
                                    _.death = true;
                                    if (_ != player) {
                                        //                   addMenuChText("Game", `${_.name} {${_.sid}} Is Dead`, "yellow");
                                    }
                                    addDeadPlayer(_);
                                }
                            }
                            if (_ == player) {
                                if (_.skinIndex == 7 && (damaged == 5 || (_.latestTail == 13 && damaged == 2))) {
                                    if (my.reSync) {
                                        my.reSync = false;
                                        _.setBullTick = true;
                                    }
                                    bullTicked = true;
                                }
                                if (inGame) {
                                    let attackers = getAttacker(damaged);
                                    let gearDmgs = [0.25, 0.45].map((val) => val * items.weapons[player.weapons[0]].dmg * soldierMult());
                                    let includeSpikeDmgs = !bullTicked && gearDmgs.includes(damaged);
                                    let healTimeout = 240 - window.ping;
                                    let slowHeal = function(timer) {
                                        setTimeout(() => {
                                            healer();
                                        }, timer);
                                    }
                                    if (getEl("1v4heal").checked) {
                                        if (attackers.length) {
                                            let by = attackers.filter((tmp) => {
                                                if (tmp.dist2 <= (tmp.weaponIndex < 9 ? 300 : 700)) {
                                                    tmpDir = UTILS.getDirect(player, tmp, 2, 2);
                                                    if (UTILS.getAngleDist(tmpDir, tmp.d2) <= Math.PI) {
                                                        return tmp;
                                                    }
                                                }
                                            });
                                            if (by.length) {
                                                let maxDamage = (includeSpikeDmgs ? 10 : 10);
                                                if (damaged > maxDamage && (game.tick - _.antiTimer) > 1) {
                                                    _.canEmpAnti = true;
                                                    _.antiTimer = game.tick;
                                                    let shame = 5;
                                                    if (_.shameCount < shame) {
                                                        healer();
                                                    } else {
                                                        slowHeal(healTimeout);
                                                    }
                                                } else {
                                                    slowHeal(healTimeout);
                                                }
                                            } else {
                                                slowHeal(healTimeout);
                                            }
                                        } else {
                                            slowHeal(healTimeout);
                                        }
                                    } else {
                                        if (damaged >= (includeSpikeDmgs ? 8 : 20) && _.damageThreat >= 25 && (game.tick - _.antiTimer) > 1) {
                                            _.canEmpAnti = true;
                                            _.antiTimer = game.tick;
                                            let shame = 5;
                                            if (_.shameCount < shame) {
                                                healer();
                                            } else {
                                                slowHeal(healTimeout);
                                            }
                                        } else {
                                            slowHeal(healTimeout);
                                        }
                                    }
                                    if (damaged >= 20 && player.skinIndex == 11) instaC.canCounter = true;
                                }
                            } else {
                                if (!_.setPoisonTick && (_.damaged == 5 || (_.latestTail == 13 && _.damaged == 2))) {
                                    _.setPoisonTick = true;
                                }
                            }
                        });
                        advHeal = [];
                    }
                    players.forEach((tmp) => {
                        if (!tmp.visible && player != tmp) {
                            tmp.reloads = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 53: 0,};
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
                            // Anti
                            if (true) {

                                let edetect = false;
                                players.forEach(_ => {
                                    if (_ == player) return;
                                    let angle = calcAngle(player.x, player.y, _.x, _.y);
                                    if (near && near.primaryVariant >= 1 && near.primaryIndex === 5 && near.dist2 < 350 && angleDist(toDeg(angle), toDeg(arguments[2])) < 50 && getDistance(_.x, _.y, arguments[0], arguments[1]) < 130) {
                                        edetect = true;
                                    }
                                });
                                if (edetect && arguments[3] === 1400 && arguments[4] === 3.6) {
                                    ch("AOT detect");
                                    Hg(6, 21);
                                    setTimeout(() => {
                                        edetect = false;
                                    }, 600);
                                }
                            }
                            // Auto Sync:
                            if (true) {
                                // autoSync
                                if (getEl("autosyncsec").checked) {
                                    if (Synced.SyncShotSec >= 1 && player.weapons[1] == 15) {
                                        instaC.syncTry();
                                        Synced.SyncShotSec = 0;
                                    }
                                    /*
                                    if (Synced.SyncShotPri >= 1 && near.dist2 <= (items.weapons[player.weapons[0]].range + near.scale * 1.8) && player.weapons[1] == 15) {
                                        instaC.syncTry("insta", 5);
                                        Synced.SyncShotPri = 0;
                                    }
                                    */
                                }
                                // autoHit:
                                if(getEl("autosyncHited").checked && canSyncHit() && !my.waitHit && near.dist2 <= 250 && !traps.inTrap) {
                                    setTimeout(() => {
                                        my.autoAim = true;
                                        my.waitHit = true;
                                        Hg(7, 18);
                                        sendAutoGather();
                                        // Add your custom logic or function calls here
                                        setTimeout(() => {
                                            my.autoAim = false;
                                            my.waitHit = false;
                                            sendAutoGather();
                                        }, 1);
                                    }, 1);
                                    ch("sync :3");
                                }
                                // near bullTciked:
                                if((game.tick - near.bullTick) % 9 == 0 && near.skinIndex == 7) {
                                    //Synced.bultect = true;
                                    game.tickBase(() => {
                                        //Synced.bultect = false;
                                    }, 1)
                                }
                            }
                            // Anti Sync:
                            if (player.syncThreats >= 2 && getEl("antisync").checked && !my.antiSync) {
                                ch("sync detect test");
                                antiSyncHealing(3);
                            } else if (player.syncThreats >= 4 && !my.antiSync) {
                                ch("multibox stupid tactic");
                                antiSyncHealing(5);
                            }
                            // Anti Insta:
                            if (player.canEmpAnti) {
                                player.canEmpAnti = false;
                                if (near.dist2 <= 300 && !my.safePrimary(near) && !my.safeSecondary(near)) {
                                    if (near.reloads[53] == 0) {
                                        player.empAnti = true;
                                        player.soldierAnti = false;
                                        if (getEl("SmartEmpSoldierAnti").checked) {//anti insta
                                            Hg(22, 21);
                                        }
                                    } else {
                                        player.empAnti = false;
                                        player.soldierAnti = true;
                                        if (getEl("SmartEmpSoldierAnti").checked) {//anti insta
                                            Hg(6, 21);
                                        }
                                    }
                                }
                            }
                            let prehit = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 3) <= (tmp.scale + near.scale)).sort(function(a, b) {
                                return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                            })[0];
                            if (prehit) {
                                if (near.dist3 <= items.weapons[player.weapons[0]].range + player.scale * 1.8 && os.predictTick) {
                                    instaC.canSpikeTick = true;
                                    instaC.syncHit = true;
                                    if (os.revTick && player.weapons[1] == 15 && player.reloads[53] == 0 && instaC.perfCheck(player, near)) {
                                        instaC.revTick = true;
                                    }
                                }
                            }
                            let antiSpikeTick = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + player.scale)).sort(function(a, b) {
                                return UTILS.getDist(a, player, 0, 2) - UTILS.getDist(b, player, 0, 2);
                            })[0];
                            if (antiSpikeTick && !traps.inTrap) {
                                if (near.dist3 <= items.weapons[5].range + near.scale * 1.8) {
                                    my.anti0Tick = 1;
                                }
                            }
                        }
                        if ((useWasd ? true : ((player.checkCanInsta(true) >= 100 ? player.checkCanInsta(true) : player.checkCanInsta(false)) >= (player.weapons[1] == 10 ? 95 : 100))) && near.dist2 <= items.weapons[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]].range + near.scale * 1.8 && (instaC.wait || (useWasd && Math.floor(Math.random() * 5) == 0)) && !instaC.isTrue && !my.waitHit && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && (useWasd ? true : getEl("oneShotInsta").checked ? (player.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate)) : true) && instaC.perfCheck(player, near)) {
                            if (player.checkCanInsta(true) >= 100) {
                                instaC.nobull = useWasd ? false : instaC.canSpikeTick ? false : true;
                            } else {
                                instaC.nobull = false;
                            }
                            instaC.can = true;
                        } else {
                            instaC.can = false;
                        }
                        guessDamagePrediction();



                        macro.q && place(0, getAttackDir());
                        macro.f && place(4, getSafeDir());
                        macro.v && place(2, getSafeDir());
                        macro.y && place(5, getSafeDir());
                        macro.h && place(player.getItemType(22), getSafeDir());
                        macro.n && place(3, getSafeDir());

                        if (mills.place) {
                            let plcAng = 1.18;
                            for (let i = -plcAng; i <= plcAng; i += plcAng) {
                                checkPlace(3, UTILS.getDirect(player.oldPos, player, 2, 2) + i);
                            }
                        }// 20


                        if (instaC.can) {
                            instaC.changeType(player.weapons[1] == 10 ? "rev" : "normal");
                        }
                        if (instaC.canCounter) {
                            instaC.canCounter = false;
                            if (player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                                instaC.counterType();
                            }
                        }
                        if (instaC.canSpikeTick) {
                            instaC.canSpikeTick = false;
                            if (instaC.revTick) {
                                instaC.revTick = false;
                                if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[1]] == 0 && !instaC.isTrue) {
                                    instaC.changeType("rev");
                                    // addMenuChText("Mod", "Rev SyncHit", "lightBlue");
                                }
                            } else {
                                if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                                    instaC.spikeTickType();
                                    if (instaC.syncHit) {
                                        //addMenuChText("Mod", "SyncHit", "lightBlue");
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


                        if (getEl("preplacer").checked && enemy.length) {
                            let mode = my.autoPush ? "trap" : "spike";
                            let tmpBuilds = gameObjects.filter((e) => e.active && UTILS.getDist(e, player, 0, 2) <= items.weapons[player.weaponIndex].range + 35);
                            let d = {//damages
                                me: items.weapons[player.weaponIndex].dmg * (o.weaponVariants[player[(player.weaponIndex < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[player.weaponIndex].sDmg || 1) * (player.skinIndex == 40 ? 3.3 : 1),
                                ene: items.weapons[near.weaponIndex].dmg * (o.weaponVariants[near[(near.weaponIndex < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[near.weaponIndex].sDmg || 1) * (near.skinIndex == 40 ? 3.3 : 1)
                            };
                            let array = {
                                me: [getAttackDir() - Math.PI / 3, getAttackDir() + Math.PI / 3],
                            };
                            let ppB = {
                                me: tmpBuilds.filter((e) => e.health <= d.me),
                                ene: tmpBuilds.filter((e) => e.health <= d.ene)
                            };
                            if (ppB.me.length > 0) {
                                lppc = ppB.me.length
                                ntpp = true;
                            }
                            if (ppB.ene.length > 0) {
                                lppc2 = ppB.ene.length;
                                ntpp2 = true;
                            }
                            //filter each tick into oferable replaceable buildings;
                        }

                        if (ntpp && lppc > 0 && enemy.length && near.dist2 <= 300) {
                            let mode = near.skinIndex == 6 ? 4 : 2;
                            ntpp = false;
                            lppc = 0;
                            if (my.autoPush) {
                                for (let e = 0; e < 2 * Math.PI * 1.5; e += Math.PI * 1.5 / 2) checkPlace(4, e);
                            } else {
                                checkPlace(mode, Math.atan2(near.y - player.y, near.x - player.x));
                            }
                        }
                        if (ntpp2 && lppc2 > 0 && enemy.length && near.dist2 <= 300) {
                            let mode = near.skinIndex == 6 ? 4 : 2;
                            ntpp2 = false;
                            lppc2 = 0;
                            if (my.autoPush) {
                                for (let e = 0; e < 2 * Math.PI * 1.5; e += Math.PI * 1.5 / 2) checkPlace(4, e);
                            } else {
                                checkPlace(mode, Math.atan2(near.y - player.y, near.x - player.x));
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
                        if ((getEl("useautoInstaong").checked ? AutoOneTicked : macro.g) && !traps.inTrap) {
                            if (!instaC.isTrue && player.reloads[player.weapons[0]] == 0) {
                                if (player.weapons[0] == 5 || player.weapons[0] == 4 && player.weapons[1] == 10) {
                                    instaC["tickMovement"]();
                                } else if (player.items[4] == 16 && player.weapons[0] == 5 && [9, 12, 13, 15].includes(player.weapons[1])) {
                                    instaC.boostTickMovement();
                                }
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
                                if (player.reloads[player.weapons[0]] > 0) {
                                    if (player.weaponIndex != player.weapons[0] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[0]);
                                    }
                                } else if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] > 0) {
                                    if (player.weaponIndex != player.weapons[1] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[1]);
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
                        /*
                        let hatChanger = function() {
                            if (my.anti0Tick > 0) {
                                buyEquip(6, 0);
                            } else if (CheckEmpMode) {
                                buyEquip(22, 0);
                            } else {
                                if (clicks.left || clicks.right) {
                                    if ((player.shameCount > 0 && (game.tick - player.bullTick) % 7 == 0 && player.skinIndex != 45) || my.reSync) {
                                        buyEquip(7, 0);
                                    } else {
                                        if (clicks.left) {
                                            buyEquip(player.reloads[player.weapons[0]] == 0 ? getEl("weaponGrind").checked ? 40 : 7 : player.empAnti ? 6 : player.soldierAnti ? 26 : (getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : near.dist2 <= 300 ? (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6 : biomeGear(1, 1), 0);
                                        } else if (clicks.right) {
                                            buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : player.empAnti ? 6 : player.soldierAnti ? 26 : (getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : near.dist2 <= 300 ? (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6 : biomeGear(1, 1), 0);
                                        }
                                    }
                                } else if (traps.inTrap) {
                                    if (traps.info.health <= items.weapons[player.weaponIndex].dmg ? false : (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)) {
                                        buyEquip(40, 0);
                                        // Barbarian hat
                                        if (near.dist2 > 300 && (!player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)) {
                                            buyEquip(26, 0);
                                        }
                                    }
                                    else {
                                        if ((player.shameCount > 0 && (game.tick - player.bullTick) % o.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                                            buyEquip(7, 0);
                                        } else {
                                            buyEquip((player.empAnti || near.dist2 > 300 || !enemy.length) ? 6 : 26, 0);
                                        }
                                    }
                                } else {
                                    if (player.empAnti || player.soldierAnti) {
                                        buyEquip(player.empAnti ? 6 : 26, 0);
                                    } else {
                                        if ((player.shameCount > 0 && (game.tick - player.bullTick) % o.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                                            buyEquip(7, 0);
                                        } else {
                                            if (near.dist2 <= 300) {
                                                buyEquip((getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6, 0);
                                            } else {
                                                biomeGear(1);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        */


                        let doEmpAntiInsta = false;
                        function safeWeapon1() {
                            return (near.primaryIndex == 0 || near.primaryIndex == 6 || near.primaryIndex == 7 || near.primaryIndex == 8);
                        }
                        function safeWeapon2() {
                            return (near.secondaryIndex == 9 || near.secondaryIndex == 10 || near.secondaryIndex == 11 || near.secondaryIndex == 14);
                        }
                        let RV2fullHats = true;
                        let MainBticked = (getEl("bulltick").checked && player.shameCount > 1 && (game.tick - player.bullTick) % o.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync;
                        function changeHatAcc(value) {
                            //Change Hats:
                            if (value == "normal") {
                                if (my.anti0Tick > 0) {
                                    buyEquip(6, 0);
                                } else {
                                    if (MainBticked) {
                                        buyEquip(7, 0);
                                    } else {
                                        if (RV2fullHats) {
                                            if (turretEmp > 0 || doEmpAntiInsta) {
                                                buyEquip(22, 0);
                                            } else {
                                                if (player.y2 >= o.mapScale / 2 - o.riverWidth / 2 && player.y2 <= o.mapScale / 2 + o.riverWidth / 2) {
                                                    buyEquip(31, 0);
                                                } else {
                                                    if (enemy.length) {
                                                        if (near.dist2 <= items.weapons[near.primaryIndex ? near.primaryIndex : 5].range + player.scale * 3) {
                                                            if (near.primaryIndex != undefined && near.reloads[near.primaryIndex] == 0 && near.secondaryIndex != undefined && near.reloads[near.secondaryIndex] == 0 && player.reloads[player.weapons[0]] <= game.tickRate && player.reloads[player.weapons[1]] == 0 && player.weapons[0] != 7 && player.weapons[0] != 8 && near.primaryIndex != 7 && near.primaryIndex != 8) {
                                                                buyEquip(11, 0);
                                                            } else {
                                                                if (safeWeapon1() && safeWeapon2()) {
                                                                    buyEquip((player.empAnti) ? 22 : 26, 0);
                                                                } else {
                                                                    buyEquip(6, 0);
                                                                }
                                                            }
                                                        } else {
                                                            biomeGear();
                                                        }
                                                    } else {
                                                        biomeGear();
                                                    }
                                                }
                                            }
                                        } else {
                                            if (turretEmp > 0 || doEmpAntiInsta) {
                                                buyEquip(22, 0);
                                            } else {
                                                if (player.y2 >= o.mapScale / 2 - o.riverWidth / 2 && player.y2 <= o.mapScale / 2 + o.riverWidth / 2) {
                                                    buyEquip(31, 0);
                                                } else {
                                                    if (enemy.length) {
                                                        if (near.dist2 <= items.weapons[near.primaryIndex ? near.primaryIndex : 5].range + player.scale * 3) {
                                                            if (os.antiBull > 0 && player.weapons[0] != 7) {
                                                                buyEquip(11, 0);
                                                            } else {
                                                                buyEquip(getEl("soldieranti").checked ? 6 : 26, 0);
                                                            }
                                                        } else {
                                                            biomeGear();
                                                        }
                                                    } else {
                                                        biomeGear();
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } else if (value == "click") {
                                if (my.anti0Tick > 0) {
                                    buyEquip(6, 0);
                                } else {
                                    if (MainBticked) {
                                        buyEquip(7, 0);
                                    } else {
                                        if (clicks.left && player.reloads[player.weapons[0]] == 0) {
                                            buyEquip(getEl("weaponGrind").checked ? 40 : 7, 0);
                                        } else if (clicks.right && player.reloads[(player.weapons[1] == 10) ? player.weapons[1] : player.weapons[0]] == 0) {
                                            buyEquip(40, 0);
                                        } else {
                                            if (RV2fullHats) {
                                                if (turretEmp > 0 || doEmpAntiInsta) {
                                                    buyEquip(22, 0);
                                                } else {
                                                    if (player.y2 >= o.mapScale / 2 - o.riverWidth / 2 && player.y2 <= o.mapScale / 2 + o.riverWidth / 2) {
                                                        buyEquip(31, 0);
                                                    } else {
                                                        if (near.dist2 <= 500) {
                                                            if (safeWeapon1() && safeWeapon2()) {
                                                                buyEquip(26, 0);
                                                            } else {
                                                                buyEquip(getEl("soldieranti").checked ? 6 : 26, 0);
                                                            }
                                                        } else {
                                                            biomeGear();
                                                        }
                                                    }
                                                }
                                            } else {
                                                if (turretEmp > 0 || doEmpAntiInsta) {
                                                    buyEquip(22, 0);
                                                } else {
                                                    if (player.y2 >= o.mapScale / 2 - o.riverWidth / 2 && player.y2 <= o.mapScale / 2 + o.riverWidth / 2) {
                                                        buyEquip(31, 0);
                                                    } else {
                                                        if (clicks.left && os.antiBull > 0 && player.weapons[0] != 7) {
                                                            buyEquip(11, 0);
                                                        } else {
                                                            buyEquip(getEl("soldieranti").checked ? 6 : 26, 0);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } else if (value == "trap") {
                                if (my.anti0Tick > 0) {
                                    buyEquip(6, 0);
                                } else {
                                    if (MainBticked) {
                                        buyEquip(7, 0);
                                    } else {
                                        if (traps.info.health > items.weapons[player.weapons[0]].dmg && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                                            buyEquip(40, 0);
                                        } else {
                                            if (RV2fullHats) {
                                                if (turretEmp > 0 || doEmpAntiInsta) {
                                                    buyEquip(22, 0);
                                                } else {
                                                    if (near.dist2 <= 300) {
                                                        if ((safeWeapon1() && safeWeapon2()) || (near.primaryIndex == 5 && near.dist2 >= 175)) {
                                                            buyEquip(26, 0);
                                                        } else {
                                                            buyEquip(getEl("soldieranti").checked ? 6 : 26, 0);
                                                        }
                                                    } else {
                                                        biomeGear();
                                                    }
                                                }
                                            } else {
                                                if (turretEmp > 0 || doEmpAntiInsta || near.dist2 > 300) {
                                                    buyEquip(22, 0);
                                                } else {
                                                    buyEquip(getEl("soldieranti").checked ? 6 : 26, 0);
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            //Change Acc:
                            if (value == "normal") {
                                if (player.y2 >= o.mapScale / 2 - o.riverWidth / 2 && player.y2 <= o.mapScale / 2 + o.riverWidth / 2) {
                                    buyEquip(11, 1);
                                } else {
                                    if (enemy.length) {
                                        if (RV2fullHats) {
                                            if (near.dist2 <= items.weapons[near.primaryIndex ? near.primaryIndex : 5].range + player.scale * 3) {
                                                if (near.primaryIndex != undefined && near.reloads[near.primaryIndex] == 0 && near.secondaryIndex != undefined && near.reloads[near.secondaryIndex] == 0 && player.reloads[player.weapons[0]] <= game.tickRate && player.reloads[player.weapons[1]] == 0 && player.weapons[0] != 7 && player.weapons[0] != 8 && near.primaryIndex != 7 && near.primaryIndex != 8) {
                                                    buyEquip(21, 1);
                                                } else {
                                                    if (os.antiBull > 0) {
                                                        buyEquip(21, 1);
                                                    } else {
                                                        if ((game.tick - player.bullTick) % o.serverUpdateRate === 0) {
                                                            buyEquip(13, 1);
                                                        } else {
                                                            buyEquip(11, 1);
                                                        }
                                                    }
                                                }
                                            } else {
                                                buyEquip(11, 1);
                                            }
                                        } else {
                                            if (near.dist2 <= items.weapons[near.primaryIndex ? near.primaryIndex : 5].range + player.scale * 3) {
                                                if (os.antiBull > 0) {
                                                    buyEquip(21, 1);
                                                } else {
                                                    buyEquip(11, 1);
                                                }
                                            } else {
                                                buyEquip(11, 1);
                                            }
                                        }
                                    } else {
                                        buyEquip(11, 1);
                                    }
                                }
                            } else if (value == "click") {
                                if (RV2fullHats) {
                                    if (os.antiBull > 0) {
                                        buyEquip(21, 1);
                                    } else {
                                        if (clicks.left && player.reloads[player.weapons[0]] == 0) {
                                            buyEquip(near.dist2 <= 500 ? 18 : 21, 1);
                                        } else if (clicks.right && player.reloads[player.weapons[0]] == 0) {
                                            buyEquip(near.dist2 <= 500 ? 18 : 21, 1);
                                        } else {
                                            if ((game.tick - player.bullTick) % o.serverUpdateRate === 0) {
                                                buyEquip(near.dist2 <= 500 ? 13 : 21, 1);
                                            } else {
                                                buyEquip(near.dist2 <= 600 ? 18 : 11, 1);
                                            }
                                        }
                                    }
                                } else {
                                    buyEquip(near.dist2 <= 600 ? 18 : 11, 1);
                                }
                            } else if (value == "trap") {
                                if (RV2fullHats) {
                                    if (os.antiBull > 0) {
                                        buyEquip(21, 1);
                                    } else {
                                        if (traps.info.health > items.weapons[player.weapons[0]].dmg && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                                            buyEquip(near.dist2 <= 275 ? 18 : 21, 1);
                                        } else {
                                            if (near.dist2 <= 300) {
                                                if (instaC.wait) {
                                                    buyEquip(21, 1);
                                                } else {
                                                    if ((game.tick - player.bullTick) % o.serverUpdateRate === 0) {
                                                        buyEquip(13, 1);
                                                    } else {
                                                        buyEquip(21, 1);
                                                    }
                                                }
                                            } else {
                                                buyEquip(11, 1);
                                            }
                                        }
                                    }
                                } else {
                                    if (os.antiBull > 0) {
                                        buyEquip(21, 1);
                                    } else {
                                        if (near.dist2 <= items.weapons[near.primaryIndex ? near.primaryIndex : 5].range + player.scale * 3) {
                                            buyEquip(21, 1);
                                        } else {
                                            buyEquip(11, 1);
                                        }
                                    }
                                }
                            }
                        }




                        if (storeMenu.style.display != "block" && !instaC.isTrue && !instaC.ticking) {
                            if (clicks.left || clicks.right) {
                                changeHatAcc("click");
                            } else {
                                if (traps.inTrap) {
                                    changeHatAcc("trap");
                                } else {
                                    changeHatAcc("normal");
                                }
                            }
                        }
                        //lastMoveDir = getSafeDir();
                        //packet("a", lastMoveDir, 1);
                        if (os.autoPush && enemy.length && !traps.inTrap && !instaC.ticking) {
                            autoPush();
                        } else {
                            if (my.autoPush) {
                                my.autoPush = false;
                                packet("a", lastMoveDir || undefined, 1);
                            }
                        }
                        /*
                        if (os.fpsBoost) {
                            setTimeout(() => {
                                clearConsole()
                            }, 50)
                        }
                        */

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
                    }
                }
            }
            function ez(context, x, y) {
                context.fillStyle = "rgba(0, 255, 255, 0.2)";
                context.beginPath();
                context.arc(x, y, 55, 0, Math.PI * 2); // Adjust the circle size
                context.fill();
                context.closePath();
                context.globalAlpha = 1;
            }
            // UPDATE LEADERBOARD:
            function updateLeaderboard(data) {
                window.richest = {
                    sid: data[0],
                    name: data[1],
                };
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
                                    style: "color:" + ((data[i] == playerSID) ? "#917d44" : "rgba(255,255,255,0.6)"),
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

            // LOAD GAME OBJECT:
            function loadGameObject(data) {
                for (let i = 0; i < data.length;) {
                    objectManager.add(data[i], data[i + 1], data[i + 2], data[i + 3], data[i + 4],
                                      data[i + 5], items.list[data[i + 6]], true, (data[i + 7] >= 0 ? {
                        sid: data[i + 7]
                    } : null));
                    // sid, x, y, dir, s, type, data, setSID, owner
                    /*let dist = UTILS.getDist({
                        x: data[i + 1],
                        y: data[i + 2]
                    }, player, 0, 2);
                    let aim = UTILS.getDirect({
                        x: data[i + 1],
                        y: data[i + 2]
                    }, player, 0, 2);
                    find = findObjectBySid(data[i]);
                    if (data[i + 6] == 15) {
                        if (find && !find.isTeamObject(player)) {
                            if (dist <= 100) {
                                traps.dist = dist;
                                traps.aim = aim;
                                traps.protect(aim);
                            }
                        }
                    }*/
                    i += 8;
                }
            }

            // ADD AI:
            function loadAI(data) {
                for (let i = 0; i < ais.length; ++i) {
                    ais[i].forcePos = !ais[i].visible;
                    ais[i].visible = false;
                }
                if (data) {
                    let tmpTime = performance.now();
                    for (let i = 0; i < data.length;) {
                        _ = findAIBySID(data[i]);
                        if (_) {
                            _.index = data[i + 1];
                            _.t1 = (_.t2 === undefined) ? tmpTime : _.t2;
                            _.t2 = tmpTime;
                            _.x1 = _.x;
                            _.y1 = _.y;
                            _.x2 = data[i + 2];
                            _.y2 = data[i + 3];
                            _.d1 = (_.d2 === undefined) ? data[i + 4] : _.d2;
                            _.d2 = data[i + 4];
                            _.health = data[i + 5];
                            _.dt = 0;
                            _.visible = true;
                        } else {
                            _ = aiManager.spawn(data[i + 2], data[i + 3], data[i + 4], data[i + 1]);
                            _.x2 = _.x;
                            _.y2 = _.y;
                            _.d2 = _.dir;
                            _.health = data[i + 5];
                            if (!aiManager.aiTypes[data[i + 1]].name)
                                _.name = o.cowNames[data[i + 6]];
                            _.forcePos = true;
                            _.sid = data[i];
                            _.visible = true;
                        }
                        i += 7;
                    }
                }
            }

            // ANIMATE AI:
            function animateAI(sid) {
                _ = findAIBySID(sid);
                if (_) _.startAnim();
            }

            // GATHER ANIMATION:
            function gatherAnimation(sid, didHit, index) {
                _ = findPlayerBySID(sid);
                if (_) {
                    _.startAnim(didHit, index);
                    _.gatherIndex = index;
                    _.gathering = 1;
                    if (didHit) {
                        let _ects = objectManager.hitObj;
                        objectManager.hitObj = [];
                        game.tickBase(() => {
                            // refind
                            _ = findPlayerBySID(sid);
                            let val = items.weapons[index].dmg * (o.weaponVariants[_[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1) * (_.skinIndex == 40 ? 3.3 : 1);
                            _ects.forEach((healthy) => {
                                healthy.health -= val;
                            });
                        }, 1);
                    }
                }
            }

            // WIGGLE GAME OBJECT:
            function wiggleGameObject(dir, sid) {
                _ = findObjectBySid(sid);
                if (_) {
                    _.xWiggle += o.gatherWiggle * Math.cos(dir);
                    _.yWiggle += o.gatherWiggle * Math.sin(dir);
                    if (_.health) {
                        //_.damaged = Math.min(255, _.damaged + 60);
                        objectManager.hitObj.push(_);
                    }
                }
            }

            // SHOOT TURRET:
            function shootTurret(sid, dir) {
                _ = findObjectBySid(sid);
                if (_) {
                    if (o.anotherVisual) {
                        _.lastDir = dir;
                    } else {
                        _.dir = dir;
                    }
                    _.xWiggle += o.gatherWiggle * Math.cos(dir + Math.PI);
                    _.yWiggle += o.gatherWiggle * Math.sin(dir + Math.PI);
                }
            }

            // UPDATE PLAYER VALUE:
            function updatePlayerValue(index, value, updateView) {
                if (player) {
                    player[index] = value;
                    if (index == "points") {
                        if (os.autoBuy) {
                            autoBuy.hat();
                            autoBuy.acc();
                        }
                    } else if (index == "kills") {
                        if (os.killChat) {
                            setTimeout(() => {
                                sendChat("GG - Magnet mod :"+player.kills);
                            }, 1);
                        }
                    }
                }
            }
            function clearConsole() {
                if (os.fpsBoost) {
                    console.clear()
                }
            }
            // ACTION BAR:
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

            // ADD PROJECTILE:
            function addProjectile(x, y, dir, range, speed, indx, layer, sid) {
                projectileManager.addProjectile(x, y, dir, range, speed, indx, null, null, layer, inWindow).sid = sid;
                runAtNextTick.push(Array.prototype.slice.call(arguments));
            }

            // REMOVE PROJECTILE:
            function remProjectile(sid, range) {
                for (let i = 0; i < projectiles.length; ++i) {
                    if (projectiles[i].sid == sid) {
                        projectiles[i].range = range;
                        let _ects = objectManager.hitObj;
                        objectManager.hitObj = [];
                        game.tickBase(() => {
                            let val = projectiles[i].dmg;
                            _ects.forEach((healthy) => {
                                if (healthy.projDmg) {
                                    healthy.health -= val;
                                }
                            });
                        }, 1);
                    }
                }
            }

            // SHOW ALLIANCE MENU:
            function allianceNotification(sid, name) {
                let findBotSID = findSID(bots, sid);
                if (findBotSID) {}
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

            // STORE MENU:
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
                            id == 7 && (my.reSync = true); // testing perfect bulltick...
                    else {
                        player.latestSkin = id;
                    }
                }
            }
            // SEND MESSAGE:
            function receiveChat(sid, message) {
                if (message === 'synccccccccccccx[pokjhbghjk.,mnbv vbm,mnbvkmbbkmjnb' && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                    packet("6", "");
                    my.autoAim = true;
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    sendAutoGather();
                    game.tickBase(() => {
                        selectWeapon(player.weapons[1]);
                        buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
                        game.tickBase(() => {
                            sendAutoGather();
                            this.isTrue = false;
                            my.autoAim = false;
                        }, 1);
                    }, 1);
                }

                // SEND MESSAGE:
                let tmpPlayer = findPlayerBySID(sid);
                if (tmpPlayer) {
                    if (o.anotherVisual) {
                        allChats.push(new addCh(tmpPlayer.x, tmpPlayer.y, message, tmpPlayer));
                    } else {
                        tmpPlayer.chatMessage = ((text) => {
                            let tmpString;
                            profanityList.forEach((list) => {
                                if (text.indexOf(list) > -1) {
                                    tmpString = "";
                                    for (var y = 0; y < list.length; ++y) {
                                        tmpString += tmpString.length ? "o" : "M";
                                    }
                                    var re = new RegExp(list, 'g');
                                    text = text.replace(re, tmpString);
                                }
                            });
                            return text;
                        })(message);
                        tmpPlayer.chatCountdown = o.chatCountdown;
                    }
                }
            }

            // MINIMAP:
            function updateMinimap(data) {
                minimapData = data;
            }

            // SHOW ANIM TEXT:
            function showText(x, y, type, s) {
                s === -1 ? textManager.showText(x, y, 50, .18, 1500, type, "#ee5551") : textManager.showText(x, y, 50, .18, 1500, Math.abs(type), type >= 0 ? "#fff" : "#8ecc51")
            }

            /** APPLY SOCKET CODES */

            // BOT:
            let bots = [];
            let ranLocation = {
                x: UTILS.randInt(35, 14365),
                y: UTILS.randInt(35, 14365)
            };
            setInterval(() => {
                ranLocation = {
                    x: UTILS.randInt(35, 14365),
                    y: UTILS.randInt(35, 14365)
                };
            }, 60000);
            class Bot {
                constructor(id, sid, hats, accessories) {
                    this.id = id;
                    this.sid = sid;
                    this.team = null;
                    this.skinIndex = 0;
                    this.tailIndex = 0;
                    this.hitTime = 0;
                    this.iconIndex = 0;
                    this.enemy = [];
                    this.near = [];
                    this.dist2 = 0;
                    this.aim2 = 0;
                    this.tick = 0;
                    this.itemCounts = {};
                    this.latestSkin = 0;
                    this.latestTail = 0;
                    this.points = 0;
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
                    this.spawn = function(moofoll) {
                        this.upgraded = 0;
                        this.enemy = [];
                        this.near = [];
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
                        this.autoGather = 0;
                        this.animTime = 0;
                        this.animSpeed = 0;
                        this.mouseState = 0;
                        this.buildIndex = -1;
                        this.weaponIndex = 0;
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
                        this.zIndex = 0;
                        this.xVel = 0;
                        this.yVel = 0;
                        this.slowMult = 1;
                        this.dir = 0;
                        this.nDir = 0;
                        this.dirPlus = 0;
                        this.targetDir = 0;
                        this.targetAngle = 0;
                        this.maxHealth = 100;
                        this.health = this.maxHealth;
                        this.oldHealth = this.maxHealth;
                        this.scale = o.playerScale;
                        this.speed = o.playerSpeed;
                        this.resetMoveDir();
                        this.resetResources(moofoll);
                        this.items = [0, 3, 6, 10];
                        this.weapons = [0];
                        this.shootCount = 0;
                        this.weaponXP = [];
                        this.reloads = {};
                        this.whyDie = "";
                    };

                    // RESET MOVE DIR:
                    this.resetMoveDir = function() {
                        this.moveDir = undefined;
                    };

                    // RESET RESOURCES:
                    this.resetResources = function(moofoll) {
                        for (let i = 0; i < o.resourceTypes.length; ++i) {
                            this[o.resourceTypes[i]] = moofoll ? 100 : 0;
                        }
                    };

                    // SET DATA:
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


                    // SHAME SYSTEM:
                    this.judgeShame = function() {
                        if (this.oldHealth < this.health) {
                            if (this.hitTime) {
                                let timeSinceHit = this.tick - this.hitTime;
                                this.hitTime = 0;
                                if (timeSinceHit < 2) {
                                    this.shameCount++;
                                } else {
                                    this.shameCount = Math.max(0, this.shameCount - 2);
                                }
                            }
                        } else if (this.oldHealth > this.health) {
                            this.hitTime = this.tick;
                        }
                    };

                    this.closeSockets = function(websc) {
                        websc.close();
                    };

                    this.whyDieChat = function(websc, whydie) {
                        websc.sendWS("6", "XDDD why die " + whydie);
                    };
                }
            };

            class BotObject {
                constructor(sid) {
                    this.sid = sid;
                    // INIT:
                    this.init = function(x, y, dir, scale, type, data, owner) {
                        data = data || {};
                        this.active = true;
                        this.x = x;
                        this.y = y;
                        this.scale = scale;
                        this.owner = owner;
                        this.id = data.id;
                        this.dmg = data.dmg;
                        this.trap = data.trap;
                        this.teleport = data.teleport;
                        this.isItem = this.id != undefined;
                    };

                }
            };
            class BotObjManager {
                constructor(botObj, fOS) {
                    // DISABLE OBJ:
                    this.disableObj = function(obj) {
                        obj.active = false;
                        if (o.anotherVisual) {} else {
                            obj.alive = false;
                        }
                    };

                    // ADD NEW:
                    let _;
                    this.add = function(sid, x, y, dir, s, type, data, setSID, owner) {
                        _ = fOS(sid);
                        if (!_) {
                            _ = botObj.find((tmp) => !tmp.active);
                            if (!_) {
                                _ = new BotObject(sid);
                                botObj.push(_);
                            }
                        }
                        if (setSID) {
                            _.sid = sid;
                        }
                        _.init(x, y, dir, s, type, data, owner);
                    };

                    // DISABLE BY SID:
                    this.disableBySid = function(sid) {
                        let find = fOS(sid);
                        if (find) {
                            this.disableObj(find);
                        }
                    };

                    // REMOVE ALL FROM PLAYER:
                    this.removeAllItems = function(sid, server) {
                        botObj.filter((tmp) => tmp.active && tmp.owner && tmp.owner.sid == sid).forEach((tmp) => this.disableObj(tmp));
                    };
                }
            };

            function botSpawn(id) {
                let bot;
                if (testMode) {
                    return;
                    bot = id && new WebSocket(`wss://elon_musk_hentai.io/websocket`);
                } else {
                    bot = id && new WebSocket(WS.url.split("&")[0] + "&token=" + encodeURIComponent(id));
                }
                let botPlayer = new Map();
                let botSID;
                let botObj = [];
                let nearObj = [];
                let bD = {
                    x: 0,
                    y: 0,
                    inGame: false,
                    closeSocket: false,
                    whyDie: ""
                };
                let oldXY = {
                    x: 0,
                    y: 0,
                };

                let botObjManager = new BotObjManager(botObj, function(sid) {
                    return findSID(botObj, sid);
                });

                bot.binaryType = "arraybuffer";
                bot.first = true;
                bot.sendWS = function(type) {
                    // EXTRACT DATA ARRAY:
                    let data = Array.prototype.slice.call(arguments, 1);

                    // SEND MESSAGE:
                    let binary = window.msgpack.encode([type, data]);
                    bot.send(binary);
                };
                bot.spawn = function() {
                    bot.sendWS("M", {
                        name: "AAAAAAAAAAAAAAA",
                        moofoll: 1,
                        skin: "__proto__"
                    });
                };
                bot.sendUpgrade = function(index) {
                    bot.sendWS("H", index);
                };
                bot.place = function(id, a) {
                    try {
                        let item = items.list[botPlayer.items[id]];
                        if (botPlayer.itemCounts[item.group.id] == undefined ? true : botPlayer.itemCounts[item.group.id] < (o.isSandbox ? 99 : item.group.limit ? item.group.limit : 99)) {
                            bot.sendWS("G", botPlayer.items[id]);
                            bot.sendWS("c", 1, a);
                            bot.sendWS("G", botPlayer.weaponIndex, true);
                        }
                    } catch (e) {

                    }
                };
                bot.buye = function(id, index) {
                    let nID = 0;
                    if (botPlayer.alive && botPlayer.inGame) {
                        if (index == 0) {
                            if (botPlayer.skins[id]) {
                                if (botPlayer.latestSkin != id) {
                                    bot.sendWS("c", 0, id, 0);
                                }
                            } else {
                                let find = findID(hats, id);
                                if (find) {
                                    if (botPlayer.points >= find.price) {
                                        bot.sendWS("c", 1, id, 0);
                                        bot.sendWS("c", 0, id, 0);
                                    } else {
                                        if (botPlayer.latestSkin != nID) {
                                            bot.sendWS("c", 0, nID, 0);
                                        }
                                    }
                                } else {
                                    if (botPlayer.latestSkin != nID) {
                                        bot.sendWS("c", 0, nID, 0);
                                    }
                                }
                            }
                        } else if (index == 1) {
                            if (botPlayer.tails[id]) {
                                if (botPlayer.latestTail != id) {
                                    bot.sendWS("c", 0, id, 1);
                                }
                            } else {
                                let find = findID(accessories, id);
                                if (find) {
                                    if (botPlayer.points >= find.price) {
                                        bot.sendWS("c", 1, id, 1);
                                        bot.sendWS("c", 0, id, 1);
                                    } else {
                                        if (botPlayer.latestTail != 0) {
                                            bot.sendWS("c", 0, 0, 1);
                                        }
                                    }
                                } else {
                                    if (botPlayer.latestTail != 0) {
                                        bot.sendWS("c", 0, 0, 1);
                                    }
                                }
                            }
                        }
                    }
                };
                bot.fastGear = function() {
                    if (botPlayer.y2 >= o.mapScale / 2 - o.riverWidth / 2 && botPlayer.y2 <= o.mapScale / 2 + o.riverWidth / 2) {
                        bot.buye(31, 0);
                    } else {
                        if (botPlayer.moveDir == undefined) {
                            bot.buye(22, 0);
                        } else {
                            if (botPlayer.y2 <= o.snowBiomeTop) {
                                bot.buye(15, 0);
                            } else {
                                bot.buye(12, 0);
                            }
                        }
                    }
                };
                let heal = function() {
                    let healthBased = function() {
                        if (botPlayer.health == 100)
                            return 0;
                        if (botPlayer.skinIndex != 45 && botPlayer.skinIndex != 56) {
                            return Math.ceil((100 - botPlayer.health) / items.list[botPlayer.items[0]].healing);
                        }
                        return 0;
                    };
                    for (let i = 0; i < healthBased(); i++) {
                        bot.place(0, botPlayer.nDir);
                    }
                };
                bot.onmessage = function(message) {
                    let data = new Uint8Array(message.data);
                    let parsed = window.msgpack.decode(data);
                    let type = parsed[0];
                    data = parsed[1];
                    if (type == "io-init") {
                        bot.spawn();
                    }
                    if (type == "C") {
                        botSID = data[0];
                    }
                    if (type == "D") {
                        if (data[1]) {
                            botPlayer = new Bot(data[0][0], data[0][1], hats, accessories);
                            botPlayer.setData(data[0]);
                            botPlayer.inGame = true;
                            botPlayer.alive = true;
                            botPlayer.x2 = undefined;
                            botPlayer.y2 = undefined;
                            botPlayer.spawn(1);
                            oldXY = {
                                x: data[0][3],
                                y: data[0][4]
                            }
                            bD.inGame = true;
                            bot.sendWS("K", 1);
                            if (bot.first) {
                                bot.first = false;
                                bots.push(bD);
                            }
                        }
                    }
                    if (type == "P") {
                        bot.spawn();
                        botPlayer.inGame = false;
                        bD.inGame = false;
                    }
                    if (type == "a") {
                        let tmpData = data[0];
                        botPlayer.tick++;
                        botPlayer.enemy = [];
                        botPlayer.near = [];
                        nearObj = [];
                        for (let i = 0; i < tmpData.length;) {
                            if (tmpData[i] == botPlayer.sid) {
                                botPlayer.x2 = tmpData[i + 1];
                                botPlayer.y2 = tmpData[i + 2];
                                botPlayer.d2 = tmpData[i + 3];
                                botPlayer.buildIndex = tmpData[i + 4];
                                botPlayer.weaponIndex = tmpData[i + 5];
                                botPlayer.weaponVariant = tmpData[i + 6];
                                botPlayer.team = tmpData[i + 7];
                                botPlayer.isLeader = tmpData[i + 8];
                                botPlayer.skinIndex = tmpData[i + 9];
                                botPlayer.tailIndex = tmpData[i + 10];
                                botPlayer.iconIndex = tmpData[i + 11];
                                botPlayer.zIndex = tmpData[i + 12];
                                botPlayer.visible = true;
                                bD.x2 = botPlayer.x2;
                                bD.y2 = botPlayer.y2;
                            }
                            i += 13;
                        }
                        if (bD.closeSocket) {
                            botPlayer.closeSockets(bot);
                        }
                        if (bD.whyDie != "") {
                            botPlayer.whyDieChat(bot, bD.whyDie);
                            bD.whyDie = "";
                        }
                        if (botPlayer.alive) {
                            if (player.team) {
                                if (botPlayer.team != player.team && (botPlayer.tick % 9 === 0)) {
                                    botPlayer.team && (bot.sendWS("N"));
                                    bot.sendWS("10", player.team);
                                }
                            }
                            if (botPlayer.inGame) {
                                if (botObj.length > 0) {
                                    if (breakObjects.length > 0) {
                                        let gotoDist = UTILS.getDist(breakObjects[0], botPlayer, 0, 2);
                                        let gotoAim = UTILS.getDirect(breakObjects[0], botPlayer, 0, 2);
                                        nearObj = botObj.filter((e) => e.active && (findSID(breakObjects, e.sid) ? true : !(e.trap && (player.sid == e.owner.sid || player.findAllianceBySid(e.owner.sid)))) && e.isItem && UTILS.getDist(e, botPlayer, 0, 2) <= (items.weapons[botPlayer.weaponIndex].range + e.scale)).sort(function(a, b) {
                                            return UTILS.getDist(a, botPlayer, 0, 2) - UTILS.getDist(b, botPlayer, 0, 2);
                                        })[0];
                                        if (nearObj) {
                                            let isPassed = UTILS.getDist(breakObjects[0], nearObj, 0, 0);
                                            if ((gotoDist - isPassed) > 0) {
                                                if (findSID(breakObjects, nearObj.sid) ? true : (nearObj.dmg || nearObj.trap || nearObj.teleport)) {
                                                    if (botPlayer.moveDir != undefined) {
                                                        botPlayer.moveDir = undefined;
                                                        bot.sendWS("a", botPlayer.moveDir);
                                                    }
                                                } else {
                                                    botPlayer.moveDir = gotoAim;
                                                    bot.sendWS("a", botPlayer.moveDir);
                                                }
                                                if (botPlayer.nDir != UTILS.getDirect(nearObj, botPlayer, 0, 2)) {
                                                    botPlayer.nDir = UTILS.getDirect(nearObj, botPlayer, 0, 2);
                                                    bot.sendWS("D", botPlayer.nDir);
                                                }
                                                bot.buye(40, 0);
                                                bot.buye(11, 1);
                                            } else {
                                                botPlayer.moveDir = gotoAim;
                                                bot.sendWS("a", botPlayer.moveDir);
                                                bot.fastGear();
                                                bot.buye(11, 1);
                                            }
                                        } else {
                                            botPlayer.moveDir = gotoAim;
                                            bot.sendWS("a", botPlayer.moveDir);
                                            bot.fastGear();
                                            bot.buye(11, 1);
                                        }
                                        if (gotoDist > 300) {
                                            if (UTILS.getDist(oldXY, botPlayer, 0, 2) > 90) {
                                                let aim = UTILS.getDirect(oldXY, botPlayer, 0, 2);
                                                bot.place(3, aim + (Math.PI / 2.3));
                                                bot.place(3, aim - (Math.PI / 2.3));
                                                bot.place(3, aim);
                                                oldXY = {
                                                    x: botPlayer.x2,
                                                    y: botPlayer.y2
                                                };
                                            }
                                        }
                                    } else {
                                        if (botPlayer.moveDir != undefined) {
                                            botPlayer.moveDir = undefined;
                                            bot.sendWS("a", botPlayer.moveDir);
                                        }
                                        nearObj = botObj.filter((e) => e.active && (findSID(breakObjects, e.sid) ? true : !(e.trap && (player.sid == e.owner.sid || player.findAllianceBySid(e.owner.sid)))) && e.isItem && UTILS.getDist(e, botPlayer, 0, 2) <= (items.weapons[botPlayer.weaponIndex].range + e.scale)).sort(function(a, b) {
                                            return UTILS.getDist(a, botPlayer, 0, 2) - UTILS.getDist(b, botPlayer, 0, 2);
                                        })[0];
                                        if (nearObj) {
                                            if (botPlayer.nDir != UTILS.getDirect(nearObj, botPlayer, 0, 2)) {
                                                botPlayer.nDir = UTILS.getDirect(nearObj, botPlayer, 0, 2);
                                                bot.sendWS("D", botPlayer.nDir);
                                            }
                                            bot.buye(40, 0);
                                            bot.buye(11, 1);
                                        } else {
                                            bot.fastGear();
                                            bot.buye(11, 1);
                                        }
                                    }
                                } else {
                                    if (botPlayer.moveDir != undefined) {
                                        botPlayer.moveDir = undefined;
                                        bot.sendWS("a", botPlayer.moveDir);
                                    }
                                }
                            }
                        }
                    }
                    if (type == "H") {
                        let tmpData = data[0];
                        for (let i = 0; i < tmpData.length;) {
                            botObjManager.add(tmpData[i], tmpData[i + 1], tmpData[i + 2], tmpData[i + 3], tmpData[i + 4],
                                              tmpData[i + 5], items.list[tmpData[i + 6]], true, (tmpData[i + 7] >= 0 ? {
                                sid: tmpData[i + 7]
                            } : null));
                            i += 8;
                        }
                    }
                    if (type == "N") {
                        let index = data[0];
                        let value = data[1];
                        if (botPlayer) {
                            botPlayer[index] = value;
                        }
                    }
                    if (type == "O") {
                        if (data[0] == botSID) {
                            botPlayer.oldHealth = botPlayer.health;
                            botPlayer.health = data[1];
                            botPlayer.judgeShame();
                            if (botPlayer.oldHealth > botPlayer.health) {
                                if (botPlayer.shameCount < 5) {
                                    heal();
                                } else {
                                    setTimeout(() => {
                                        heal();
                                    }, 70);
                                }
                            }
                        }
                    }
                    if (type == "Q") {
                        let sid = data[0];
                        botObjManager.disableBySid(sid);
                    }
                    if (type == "R") {
                        let sid = data[0];
                        if (botPlayer.alive) botObjManager.removeAllItems(sid);
                    }
                    if (type == "S") {
                        let index = data[0];
                        let value = data[1];
                        if (botPlayer) {
                            botPlayer.itemCounts[index] = value;
                        }
                    }
                    if (type == "U") {
                        if (data[0] > 0) {
                            if (botPlayer.upgraded == 0) {
                                bot.sendUpgrade(3);
                            } else if (botPlayer.upgraded == 1) {
                                bot.sendUpgrade(17);
                            } else if (botPlayer.upgraded == 2) {
                                bot.sendUpgrade(31);
                            } else if (botPlayer.upgraded == 3) {
                                bot.sendUpgrade(27);
                            } else if (botPlayer.upgraded == 4) {
                                bot.sendUpgrade(9);
                            } else if (botPlayer.upgraded == 5) {
                                bot.sendUpgrade(38);
                            } else if (botPlayer.upgraded == 6) {
                                bot.sendUpgrade(4);
                            } else if (botPlayer.upgraded == 7) {
                                bot.sendUpgrade(25);
                            }
                            botPlayer.upgraded++;
                        }
                    }
                    if (type == "V") {
                        let tmpData = data[0];
                        let wpn = data[1];
                        if (tmpData) {
                            if (wpn) botPlayer.weapons = tmpData;
                            else botPlayer.items = tmpData;
                        }
                        bot.sendWS("G", botPlayer.weapons[0], true);
                    }
                    if (type == "5") {
                        let type = data[0];
                        let id = data[1];
                        let index = data[2];
                        if (index) {
                            if (!type)
                                botPlayer.tails[id] = 1;
                            else
                                botPlayer.latestTail = id;
                        } else {
                            if (!type)
                                botPlayer.skins[id] = 1;
                            else
                                botPlayer.latestSkin = id;
                        }
                    }
                };
                bot.onclose = function() {
                    botPlayer.inGame = false;
                    bD.inGame = false;
                };
            }

            // RENDER LEAF:
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

            // RENDER CIRCLE:
            function renderCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
                tmpContext = tmpContext || be;
                tmpContext.beginPath();
                tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
                if (!dontFill) tmpContext.fill();
                if (!dontStroke) tmpContext.stroke();
            }

            function renderHealthCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
                tmpContext = tmpContext || be;
                tmpContext.beginPath();
                tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
                if (!dontFill) tmpContext.fill();
                if (!dontStroke) tmpContext.stroke();
            }

            // RENDER STAR SHAPE:
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

            // RENDER RECTANGLE:
            function renderRect(x, y, w, h, ctxt, dontStroke, dontFill) {
                if (!dontFill) ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
                if (!dontStroke) ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
            }

            function renderHealthRect(x, y, w, h, ctxt, dontStroke, dontFill) {
                if (!dontFill) ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
                if (!dontStroke) ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
            }

            // RENDER RECTCIRCLE:
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

            // RENDER BLOB:
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

            // RENDER TRIANGLE:
            function renderTriangle(s, ctx) {
                ctx = ctx || be;
                let h = s * (Math.sqrt(3) / 2);
                ctx.beginPath();
                ctx.moveTo(0, -h / 2);
                ctx.lineTo(-s / 2, h / 2);
                ctx.lineTo(s / 2, h / 2);
                ctx.lineTo(0, -h / 2);
                ctx.fill();
                ctx.closePath();
            }

            // PREPARE MENU BACKGROUND:
            function prepareMenuBackground() {
                var tmpMid = o.mapScale / 2;
                objectManager.add(0, tmpMid, tmpMid + 200, 0, o.treeScales[3], 0);
                objectManager.add(1, tmpMid, tmpMid - 480, 0, o.treeScales[3], 0);
                objectManager.add(2, tmpMid + 300, tmpMid + 450, 0, o.treeScales[3], 0);
                objectManager.add(3, tmpMid - 950, tmpMid - 130, 0, o.treeScales[2], 0);
                objectManager.add(4, tmpMid - 750, tmpMid - 400, 0, o.treeScales[3], 0);
                objectManager.add(5, tmpMid - 700, tmpMid + 400, 0, o.treeScales[2], 0);
                objectManager.add(6, tmpMid + 800, tmpMid - 200, 0, o.treeScales[3], 0);
                objectManager.add(7, tmpMid - 260, tmpMid + 340, 0, o.bushScales[3], 1);
                objectManager.add(8, tmpMid + 760, tmpMid + 310, 0, o.bushScales[3], 1);
                objectManager.add(9, tmpMid - 800, tmpMid + 100, 0, o.bushScales[3], 1);
                objectManager.add(10, tmpMid - 800, tmpMid + 300, 0, items.list[4].scale, items.list[4].id, items.list[10]);
                objectManager.add(11, tmpMid + 650, tmpMid - 390, 0, items.list[4].scale, items.list[4].id, items.list[10]);
                objectManager.add(12, tmpMid - 400, tmpMid - 450, 0, o.rockScales[2], 2);
            }

            // RENDER PLAYERS:
            function renderDeadPlayers(f, d) {
                be.fillStyle = "#91b2db";
                deadPlayers.filter(dead => dead.active).forEach((dead) => {
                    dead.animate(delta);

                    be.globalAlpha = dead.alpha;
                    be.strokeStyle = outlineColor;

                    be.save();
                    be.translate(dead.x - f, dead.y - d);

                    // RENDER PLAYER:
                    be.rotate(dead.dir);
                    be.scale(dead.visScale / dead.scale, dead.visScale / dead.scale);
                    renderDeadPlayer(dead, be);
                    be.restore();


                });
            }
            // RENDER PLAYERS:
            let invisBody = false;
            let ae86Aim = false;
            function renderPlayers(f, d, zIndex) {
                be.globalAlpha = 1;
                be.fillStyle = "#91b2db";
                for (var i = 0; i < players.length; ++i) {
                    _ = players[i];
                    if (_.zIndex == zIndex) {
                        _.animate(delta);
                        if (_.visible) {
                            _.skinRot += 0.002 * delta;
                            tmpDir = (_ == player && !(ae86Aim) ? true ? getAttackDir() : getSafeDir() : (_.dir || 0));
                            //tmpDir = !os.showDir && !useWasd && _ == player ? (os.attackDir ? getVisualDir() : getSafeDir()) : _.dir || 0;
                            be.save();
                            be.translate(_.x - f, _.y - d);
                            // RENDER PLAYER:
                            be.rotate(tmpDir + _.dirPlus);
                            if (_ == player && (clicks.right || traps.inTrap) && player.skinIndex == 40) {
                                null;
                            } else {
                                renderPlayer(_, be);
                            }
                            be.restore();
                        }
                    }
                }
            }

            // RENDER DEAD PLAYER:
            function renderDeadPlayer(obj, ctxt) {
                ctxt = ctxt || be;
                ctxt.lineWidth = outlineWidth;
                ctxt.lineJoin = "miter";
                let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS || 1);
                let oHandAngle = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndS || 1) : 1;
                let oHandDist = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndD || 1) : 1;

                let katanaMusket = (obj == player && obj.weapons[0] == 3 && obj.weapons[1] == 15);

                // TAIL/CAPE:
                if (obj.tailIndex > 0) {
                    renderTail(obj.tailIndex, ctxt, obj);
                }

                // WEAPON BELLOW HANDS:
                if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[katanaMusket ? 4 : obj.weaponIndex], o.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], be);
                    }
                }

                // HANDS:
                ctxt.fillStyle = o.skinColors[obj.skinColor];
                renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
                renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                             (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);

                // WEAPON ABOVE HANDS:
                if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[obj.weaponIndex], o.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], be);
                    }
                }

                // BUILD ITEM:
                if (obj.buildIndex >= 0) {
                    var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
                    ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
                }

                // BODY:
                renderCircle(0, 0, obj.scale, ctxt);

                // SKIN:
                if (obj.skinIndex > 0) {
                    ctxt.rotate(Math.PI / 2);
                    renderSkin(obj.skinIndex, ctxt, null, obj);
                }
            }


            var FlareZHat = {
                7: "https://i.imgur.com/vAOzlyY.png",
                15: "https://i.imgur.com/YRQ8Ybq.png",
                40: "https://i.imgur.com/Xzmg27N.png",
                26: "https://i.imgur.com/I0xGtyZ.png",
                55: "https://i.imgur.com/uYgDtcZ.png",
                20: "https://i.imgur.com/f5uhWCk.png",
            };

            function setSkinTextureImage(id, type, id2) {
                if (true) {
                    if(FlareZHat[id] && type == "hat") {
                        return FlareZHat[id];
                    } else {
                        if(type == "acc") {
                            return ".././img/accessories/access_" + id + ".png";
                        } else if(type == "hat") {
                            return ".././img/hats/hat_" + id + ".png";
                        } else {
                            return ".././img/weapons/" + id + ".png";
                        }
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

            // RENDER PLAYER:
            function renderPlayer(obj, ctxt) {
                ctxt = ctxt || be;
                ctxt.lineWidth = outlineWidth;
                ctxt.lineJoin = "miter";
                let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS || 1);
                let oHandAngle = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndS || 1) : 1;
                let oHandDist = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndD || 1) : 1;

                let katanaMusket = (obj == player && obj.weapons[0] == 3 && obj.weapons[1] == 15);

                // TAIL/CAPE:
                if (obj.tailIndex > 0) {
                    renderTail(obj.tailIndex, ctxt, obj);
                }

                // WEAPON BELLOW HANDS:
                if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[katanaMusket ? 4 : obj.weaponIndex], o.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], be);
                    }
                }

                // HANDS:
                ctxt.fillStyle = o.skinColors[obj.skinColor];
                renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
                renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                             (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);

                // WEAPON ABOVE HANDS:
                if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[obj.weaponIndex], o.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], be);
                    }
                }

                // BUILD ITEM:
                if (obj.buildIndex >= 0) {
                    var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
                    ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
                }

                // BODY:
                renderCircle(0, 0, obj.scale, ctxt);

                // SKIN:
                if (obj.skinIndex > 0) {
                    ctxt.rotate(Math.PI / 2);
                    renderSkin(obj.skinIndex, ctxt, null, obj);
                }

            }

            // RENDER SKINS:
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
                let _ = parentSkin || skinPointers[index];
                if (!_) {
                    for (let i = 0; i < hats.length; ++i) {
                        if (hats[i].id == index) {
                            _ = hats[i];
                            break;
                        }
                    }
                    skinPointers[index] = _;
                }
                if (tmpSkin.isLoaded)
                    ctxt.drawImage(tmpSkin, -_.scale / 2, -_.scale / 2, _.scale, _.scale);
                if (!parentSkin && _.topSprite) {
                    ctxt.save();
                    ctxt.rotate(owner.skinRot);
                    renderSkin(index + "_top", ctxt, _, owner);
                    ctxt.restore();
                }
            }

            // RENDER TAIL:
            let accessSprites = {};
            let accessPointers = {};

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
                let _ = accessPointers[index];
                if (!_) {
                    for (let i = 0; i < accessories.length; ++i) {
                        if (accessories[i].id == index) {
                            _ = accessories[i];
                            break;
                        }
                    }
                    accessPointers[index] = _;
                }
                if (tmpSkin.isLoaded) {
                    ctxt.save();
                    ctxt.translate(-20 - (_.xOff || 0), 0);
                    if (_.spin)
                        ctxt.rotate(owner.skinRot);
                    ctxt.drawImage(tmpSkin, -(_.scale / 2), -(_.scale / 2), _.scale, _.scale);
                    ctxt.restore();
                }
            }

            // RENDER TOOL:
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

            // RENDER PROJECTILES:
            function renderProjectiles(layer, f, d) {
                for (let i = 0; i < projectiles.length; i++) {
                    _ = projectiles[i];
                    if (_.active && _.layer == layer && _.inWindow) {
                        _.update(delta);
                        if (_.active && isOnScreen(_.x - f, _.y - d, _.scale)) {
                            be.save();
                            be.translate(_.x - f, _.y - d);
                            be.rotate(_.dir);
                            renderProjectile(0, 0, _, be, 1);
                            be.restore();
                        }
                    }
                };
            }

            // RENDER PROJECTILE:
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

            // RENDER AI:
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

            // RENDER WATER BODIES:
            function renderWaterBodies(f, d, ctxt, padding) {

                // MIDDLE RIVER:
                let tmpW = o.riverWidth + padding;
                let tmpY = (o.mapScale / 2) - d - (tmpW / 2);
                if (tmpY < maxScreenHeight && tmpY + tmpW > 0) {
                    ctxt.fillRect(0, tmpY, maxScreenWidth, tmpW);
                }
            }

            // RENDER GAME OBJECTS:
            var gameObjectSprites = {};

            function getResSprite(obj) {
                var biomeID = obj.y >= o.mapScale - o.snowBiomeTop ? 2 : obj.y <= o.snowBiomeTop ? 1 : 0;
                var tmpIndex = obj.type + "_" + obj.scale + "_" + biomeID;
                var tmpSprite = gameObjectSprites[tmpIndex];
                if (!tmpSprite) {
                    var tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = tmpCanvas.height = obj.scale * 2.1 + outlineWidth;
                    var tmpContext = tmpCanvas.getContext("2d");
                    tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
                    tmpContext.rotate(UTILS.randFloat(0, Math.PI));
                    tmpContext.strokeStyle = outlineColor;
                    tmpContext.lineWidth = outlineWidth;
                    let colors = [["#b1d959", "#95b946"], ["#bade6e", "#aac76b"], ["#a7d544", "#86a63f"], ["#b4db62", "#9ebf57"], ];
                    let select = colors[Math.floor(Math.random() * colors.length)];
                    if (obj.type == 0) {
                        var tmpScale;
                        for (var i = 0; i < 2; ++i) {
                            tmpScale = _.scale * (!i ? 1 : 0.5);
                            renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                            tmpContext.fillStyle = !biomeID ? !i ? select[1] : select[0] : !i ? "#e3f1f4" : "#fff";
                            tmpContext.fill();
                            if (!i)
                                tmpContext.stroke();
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
                            renderBlob(tmpContext, 6, _.scale, _.scale * 0.7);
                            tmpContext.fillStyle = biomeID ? "#e3f1f4" : "#89a54c";
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = biomeID ? "#6a64af" : "#c15555";
                            var tmpRange;
                            var berries = 4;
                            var rotVal = Math.PI * 2 / berries;
                            for (var i = 0; i < berries; ++i) {
                                tmpRange = UTILS.randInt(_.scale / 3.5, _.scale / 2.3);
                                renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i), UTILS.randInt(10, 12), tmpContext);
                            }
                        }
                    } else if (obj.type == 2 || obj.type == 3) {
                        tmpContext.fillStyle = obj.type == 2 ? biomeID == 2 ? "#938d77" : "#939393" : "#e0c655";
                        renderStar(tmpContext, 3, obj.scale, obj.scale);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = obj.type == 2 ? biomeID == 2 ? "#b2ab90" : "#bcbcbc" : "#ebdca3";
                        renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                        tmpContext.fill();
                    }
                    tmpSprite = tmpCanvas;
                    gameObjectSprites[tmpIndex] = tmpSprite;
                }
                return tmpSprite;
            }
            // GET ITEM SPRITE:
            var itemSprites = [];

            function getItemSprite(obj, asIcon) {
                var tmpSprite = itemSprites[obj.id];
                if (!tmpSprite || asIcon) {
                    let blurScale = !asIcon && isNight ? 15 : 0;
                    var tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = tmpCanvas.height = obj.scale * 2.5 + outlineWidth + (items.list[obj.id].spritePadding || 0);
                    var tmpContext = tmpCanvas.getContext("2d");
                    tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
                    tmpContext.rotate(asIcon ? 0 : Math.PI / 2);
                    tmpContext.strokeStyle = outlineColor;
                    tmpContext.lineWidth = outlineWidth * (asIcon ? tmpCanvas.width / 81 : 1);
                    if (isNight && !asIcon) {
                        tmpContext.shadowBlur = blurScale;
                        tmpContext.shadowColor = `rgba(0, 0, 0, ${Math.min(obj.name == "pit trap" ? 0.6 : 0.3, obj.alpha)})`;
                    }
                    if (obj.name == "apple") {
                        tmpContext.fillStyle = "#c15555";
                        renderCircle(0, 0, obj.scale, tmpContext);
                        tmpContext.fillStyle = "#89a54c";
                        var leafDir = -(Math.PI / 2);
                        renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir), 25, leafDir + Math.PI / 2, tmpContext);
                    } else if (obj.name == "cookie") {
                        tmpContext.fillStyle = "#cca861";
                        renderCircle(0, 0, obj.scale, tmpContext);
                        tmpContext.fillStyle = "#937c4b";
                        var chips = 4;
                        var rotVal = Math.PI * 2 / chips;
                        var tmpRange;
                        for (var i = 0; i < chips; ++i) {
                            tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                            renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i), UTILS.randInt(4, 5), tmpContext, true);
                        }
                    } else if (obj.name == "cheese") {
                        tmpContext.fillStyle = "#f4f3ac";
                        renderCircle(0, 0, obj.scale, tmpContext);
                        tmpContext.fillStyle = "#c3c28b";
                        var chips = 4;
                        var rotVal = Math.PI * 2 / chips;
                        var tmpRange;
                        for (var i = 0; i < chips; ++i) {
                            tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                            renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i), UTILS.randInt(4, 5), tmpContext, true);
                        }
                    } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                        tmpContext.fillStyle = obj.name == "castle wall" ? "#83898e" : obj.name == "wood wall" ? "#a5974c" : "#939393";
                        var sides = obj.name == "castle wall" ? 4 : 3;
                        renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = obj.name == "castle wall" ? "#9da4aa" : obj.name == "wood wall" ? "#c9b758" : "#bcbcbc";
                        renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
                        tmpContext.fill();
                    } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
                        tmpContext.fillStyle = obj.name == "poison spikes" ? "#7b935d" : "#939393";
                        var tmpScale = obj.scale * 0.6;
                        renderStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#a5974c";
                        renderCircle(0, 0, tmpScale, tmpContext);
                        tmpContext.fillStyle = "#c9b758";
                        renderCircle(0, 0, tmpScale / 2, tmpContext, true);
                    } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                        tmpContext.fillStyle = "#a5974c";
                        renderCircle(0, 0, obj.scale, tmpContext);
                        tmpContext.fillStyle = "#c9b758";
                        renderRectCircle(0, 0, obj.scale * 1.5, 29, 4, tmpContext);
                        tmpContext.fillStyle = "#a5974c";
                        renderCircle(0, 0, obj.scale * 0.5, tmpContext);
                    } else if (obj.name == "mine") {
                        tmpContext.fillStyle = "#939393";
                        renderStar(tmpContext, 3, obj.scale, obj.scale);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#bcbcbc";
                        renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                        tmpContext.fill();
                    } else if (obj.name == "sapling") {
                        for (var i = 0; i < 2; ++i) {
                            var tmpScale = obj.scale * (!i ? 1 : 0.5);
                            renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                            tmpContext.fillStyle = !i ? "#9ebf57" : "#b4db62";
                            tmpContext.fill();
                            if (!i)
                                tmpContext.stroke();
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
                        var tmpLen = 50;
                        renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
                        renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                    } else if (obj.name == "platform") {
                        tmpContext.fillStyle = "#cebd5f";
                        var tmpCount = 4;
                        var tmpS = obj.scale * 2;
                        var tmpW = tmpS / tmpCount;
                        var tmpX = -(obj.scale / 2);
                        for (var i = 0; i < tmpCount; ++i) {
                            renderRect(tmpX - tmpW / 2, 0, tmpW, obj.scale * 2, tmpContext);
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
                    tmpSprite = tmpCanvas;
                    if (!asIcon)
                        itemSprites[obj.id] = tmpSprite;
                }
                return tmpSprite;
            }
            var objSprites = [];

            function getObjSprite(obj) {
                var tmpSprite = objSprites[obj.id];
                if (!tmpSprite) {
                    let blurScale = isNight ? 15 : 0;
                    var tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = tmpCanvas.height = obj.scale * 2.5 + outlineWidth + (items.list[obj.id].spritePadding || 0);
                    var tmpContext = tmpCanvas.getContext("2d");
                    tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
                    tmpContext.rotate(Math.PI / 2);
                    tmpContext.strokeStyle = outlineColor;
                    tmpContext.lineWidth = outlineWidth;
                    if (isNight) {
                        tmpContext.shadowBlur = blurScale;
                        tmpContext.shadowColor = `rgba(0, 0, 0, ${Math.min(0.3, obj.alpha)})`;
                    }
                    if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
                        tmpContext.fillStyle = obj.name == "poison spikes" ? "#7b935d" : "#939393";
                        var tmpScale = obj.scale * 0.6;
                        renderStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#a5974c";
                        renderCircle(0, 0, tmpScale, tmpContext);
                        tmpContext.fillStyle = "#cc5151";
                        renderCircle(0, 0, tmpScale / 2, tmpContext, true);
                    } else if (obj.name == "pit trap") {
                        tmpContext.fillStyle = "#a5974c";
                        renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#cc5151";
                        renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                        tmpContext.fill();
                    }
                    tmpSprite = tmpCanvas;
                    objSprites[obj.id] = tmpSprite;
                }
                return tmpSprite;
            }

            // GET MARK SPRITE:
            function getMarkSprite(obj, tmpContext, tmpX, tmpY) {
                let center = {
                    x: screenWidth / 2,
                    y: screenHeight / 2,
                };
                tmpContext.lineWidth = outlineWidth;
                be.globalAlpha = 0.8;
                tmpContext.strokeStyle = outlineColor;
                tmpContext.save();
                tmpContext.translate(tmpX, tmpY);
                tmpContext.rotate(obj.dir || getAttackDir());
                if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
                    tmpContext.fillStyle = (obj.name == "poison spikes")?"#7b935d":"#939393";
                    var tmpScale = (obj.scale * 0.6);
                    renderStar(tmpContext, (obj.name == "spikes")?5:6, obj.scale, tmpScale);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, tmpScale, tmpContext);
                    if (player && obj.owner && player.sid != obj.owner.sid && !_.findAllianceBySid(obj.owner.sid)) {
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
                    if (player && obj.owner && player.sid != obj.owner.sid && !_.findAllianceBySid(obj.owner.sid)) {
                        tmpContext.fillStyle = "#a34040";
                    } else {
                        tmpContext.fillStyle = outlineColor;
                    }
                    renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                    tmpContext.fill();
                }
                tmpContext.restore();
            }
            //renderCircle(_.x - f, _.y - d, _.getScale(0.6, true), be, false, true);

            // OBJECT ON SCREEN:
            function isOnScreen(x, y, s) {
                return (x + s >= 0 && x - s <= maxScreenWidth && y + s >= 0 && (y,
                                                                                s,
                                                                                maxScreenHeight));
            }

            // RENDER GAME OBJECTS:
            function renderGameObjects(layer, f, d) {
                let tmpSprite;
                let tmpX;
                let tmpY;
                gameObjects.forEach((tmp) => {
                    _ = tmp;
                    if (_.alive) {
                        tmpX = _.x + _.xWiggle - f;
                        tmpY = _.y + _.yWiggle - d;
                        if (layer == 0) {
                            _.update(delta);
                        }
                        be.globalAlpha = _.alpha;
                        if (_.layer == layer && isOnScreen(tmpX, tmpY, _.scale + (_.blocker || 0))) {
                            if (_.isItem) {
                                if ((_.dmg || _.trap) && !_.isTeamObject(player)) {
                                    tmpSprite = getObjSprite(_);
                                } else {
                                    tmpSprite = getItemSprite(_);
                                }

                                be.save();
                                be.translate(tmpX, tmpY);
                                be.rotate(_.dir);
                                if (!_.active) {
                                    be.scale(_.visScale / _.scale, _.visScale / _.scale);
                                }
                                be.drawImage(tmpSprite, -(tmpSprite.width / 2), -(tmpSprite.height / 2));

                                if (_.blocker) {
                                    be.strokeStyle = "#db6e6e";
                                    be.globalAlpha = 0.3;
                                    be.lineWidth = 6;
                                    renderCircle(0, 0, _.blocker, be, false, true);
                                }
                                be.restore();
                            } else {
                                tmpSprite = getResSprite(_);
                                be.drawImage(tmpSprite, tmpX - (tmpSprite.width / 2), tmpY - (tmpSprite.height / 2));
                            }
                        }
                        if (getEl("bh").checked) {
                            if (layer == 3) {
                                if (_.health < _.maxHealth && UTILS.getDist(_, player, 0, 0) <= 350) {
                                    // HEALTH HOLDER:
                                    be.fillStyle = darkOutlineColor;
                                    be.roundRect(tmpX - o.healthBarWidth / 2 - o.healthBarPad, tmpY - o.healthBarPad, o.healthBarWidth + o.healthBarPad * 2, 17, 8);
                                    be.fill();
                                    be.fillStyle = _.isTeamObject(player) ? "#8ecc51" : "#cc5151";
                                    be.roundRect(tmpX - o.healthBarWidth / 2, tmpY, o.healthBarWidth * (_.health / _.maxHealth), 17 - o.healthBarPad * 2, 7);
                                    be.fill();
                                }
                            }
                        }
                    }
                });

                // PLACE VISIBLE:
                if (layer == 0) {
                    if (placeVisible.length) {
                        placeVisible.forEach((places) => {
                            tmpX = places.x - f;
                            tmpY = places.y - d;
                            markObject(places, tmpX, tmpY);
                        });
                    }
                }
            }
            /*         function markObject(_, tmpX, tmpY) {
          getMarkSprite(_, be, tmpX, tmpY);
      }*/
            function markObject(_, tmpX, tmpY) {
                yen(be, tmpX, tmpY);
            }
            function yen(context, x, y) {
                context.fillStyle = "rgb(234,182,118)";
                context.beginPath();
                context.arc(x, y, 55, 0, Math.PI * 2); // Adjust the circle size
                context.fill();
                context.closePath();
                context.globalAlpha = 1;
            }
            function ppyen(context, x, y) {
                context.fillStyle = "red";
                context.beginPath();
                context.arc(x, y, 55, 0, Math.PI * 2); // Adjust the circle size
                context.fill();
                context.closePath();
                context.globalAlpha = 1;
            }

            // RENDER MINIMAP:
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
                                ctxt.arc((this.x / o.mapScale) * mapDisplay.width, (this.y / o.mapScale) *
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
                    tmpPing = new MapPing("#fff", o.mapPingScale);
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

                    // RENDER PINGS:
                    mapContext.lineWidth = 4;
                    for (let i = 0; i < mapPings.length; ++i) {
                        tmpPing = mapPings[i];
                        mapContext.strokeStyle = tmpPing.color;
                        tmpPing.update(mapContext, delta);
                    }


                    // Show & Hide Map Events
                    if (showingExtraMap) {
                        for(let i of Trees){//wood
                            mapContext.fillStyle = "#8ecc51";
                            mapContext.scale = 13200.0;
                            renderCircle(i.x / o.mapScale * mapDisplay.width, i.y / o.mapScale * mapDisplay.height, 3, mapContext, !0);
                        }
                        for(let i of Foodbush){//food
                            mapContext.fillStyle = "#ff3333";
                            mapContext.scale = 13200.0;
                            renderCircle(i.x / o.mapScale * mapDisplay.width, i.y / o.mapScale * mapDisplay.height, 5, mapContext, !0);
                        }
                        for(let i of StoneOreok){//stone
                            mapContext.fillStyle = "#888888";
                            mapContext.scale = 13200.0;
                            renderCircle(i.x / o.mapScale * mapDisplay.width, i.y / o.mapScale * mapDisplay.height, 5, mapContext, !0);
                        }
                        for(let i of GoldMines){//points
                            mapContext.fillStyle = "#ffee33";
                            mapContext.scale = 13200.0;
                            renderCircle(i.x / o.mapScale * mapDisplay.width, i.y / o.mapScale * mapDisplay.height, 5, mapContext, !0);
                        }
                    }

                    // RENDER BREAK TRACKS:
                    if (breakTracks.length) {
                        for (let i = 0; i < breakTracks.length; i++) {
                            _ = breakTracks[i];
                            mapContext.fillStyle = "#fff";
                            mapContext.font = "34px Hammersmith One";
                            mapContext.textBaseline = "middle";
                            mapContext.textAlign = "center";
                            mapContext.fillText("L", (_.x / o.mapScale) * mapDisplay.width, (_.y / o.mapScale) * mapDisplay.height);
                        }
                    }

                    // RENDER PLAYERS:
                    mapContext.globalAlpha = 1;
                    mapContext.fillStyle = "#fff";
                    renderCircle((player.x / o.mapScale) * mapDisplay.width,
                                 (player.y / o.mapScale) * mapDisplay.height, 7, mapContext, true);
                    mapContext.fillStyle = "rgba(255,255,255,0.35)";
                    if (player.team && minimapData) {
                        for (let i = 0; i < minimapData.length;) {
                            renderCircle((minimapData[i] / o.mapScale) * mapDisplay.width,
                                         (minimapData[i + 1] / o.mapScale) * mapDisplay.height, 7, mapContext, true);
                            i += 2;
                        }
                    }

                    // RENDER BOTS:
                    if (bots.length) {
                        bots.forEach((tmp) => {
                            if (tmp.inGame) {
                                mapContext.globalAlpha = 1;
                                mapContext.strokeStyle = "#cc5151";
                                renderCircle((tmp.x2 / o.mapScale) * mapDisplay.width,
                                             (tmp.y2 / o.mapScale) * mapDisplay.height, 7, mapContext, false, true);
                            }
                        });
                    }

                    // DEATH LOCATION:
                    if (lastDeath) {
                        mapContext.fillStyle = "#fc5553";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (lastDeath.x / o.mapScale) * mapDisplay.width,
                                            (lastDeath.y / o.mapScale) * mapDisplay.height);
                    }

                    // MAP MARKER:
                    if (mapMarker) {
                        mapContext.fillStyle = "#fff";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (mapMarker.x / o.mapScale) * mapDisplay.width,
                                            (mapMarker.y / o.mapScale) * mapDisplay.height);
                    }
                }
            }

            // ICONS:
            let crossHairs = [
                "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Crosshairs_Red.svg/1200px-Crosshairs_Red.svg.png",
                "https://cdn.discordapp.com/attachments/1136761235958943806/1213248402825936948/Crosshairs_Red.png?ex=65f4c8a0&is=65e253a0&hm=07565291c663b247ee00fefd50b2bb42453068757384fcef48feca86828c5a5d&"
            ];
            let crossHairSprites = {};
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
                for (let i = 0; i < crossHairs.length; ++i) {
                    let tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    };
                    tmpSprite.src = crossHairs[i];
                    crossHairSprites[i] = tmpSprite;
                }
            }
            loadIcons();

            // UPDATE GAME:
            function updateGame() {
                if (o.resetRender) {
                    be.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
                    be.beginPath();
                }
                if (true) {
                    // MOVE CAMERA:
                    if (player) {
                        // Zoom:
                        if (autoZoom) {
                            if (near.dist2 <= 1200) {
                                maxScreenWidth = o.maxScreenWidth * 1;
                                maxScreenHeight = o.maxScreenHeight * 1;
                                resize();
                            } else {
                                maxScreenWidth = o.maxScreenWidth * 1.4;
                                maxScreenHeight = o.maxScreenHeight * 1.4;
                                resize();
                            }
                        } else {
                            maxScreenWidth = o.maxScreenWidth * 1;
                            maxScreenHeight = o.maxScreenHeight * 1;
                            resize();
                        }
                        if (false) {
                            camX = player.x;
                            camY = player.y;
                        } else {
                            let tmpDist = UTILS.getDistance(camX, camY, player.x, player.y);
                            let tmpDir = UTILS.getDirection(player.x, player.y, camX, camY);
                            let camSpd = Math.min(tmpDist * 0.01 * delta, tmpDist);
                            if (tmpDist > 0.05) {
                                camX += camSpd * Math.cos(tmpDir);
                                camY += camSpd * Math.sin(tmpDir);
                            } else {
                                camX = player.x;
                                camY = player.y;
                            }
                        }
                    } else {
                        camX = o.mapScale / 2;
                        camY = o.mapScale / 2;
                    }
                    function lerp(start, end, amt) {
                        return (1 - amt) * start + amt * end;
                    }

                    // INTERPOLATE PLAYERS AND AI:
                    let lastTime = now - (1000 / o.serverUpdateRate);
                    let tmpDiff;
                    for (let i = 0; i < players.length + ais.length; ++i) {
                        _ = players[i] || ais[i - players.length];
                        if (_ && _.visible) {
                            if (_.forcePos) {
                                _.x = _.x2;
                                _.y = _.y2;
                                _.dir = _.d2;
                            } else {
                                let total = _.t2 - _.t1;
                                let fraction = lastTime - _.t1;
                                let ratio = (fraction / total);
                                let rate = 170;
                                _.dt += delta;
                                let tmpRate = Math.min(1.7, _.dt / rate);
                                tmpDiff = (_.x2 - _.x1);
                                _.x = _.x1 + (tmpDiff * tmpRate);
                                tmpDiff = (_.y2 - _.y1);
                                _.y = _.y1 + (tmpDiff * tmpRate);
                                if (o.anotherVisual) {
                                    _.dir = Math.lerpAngle(_.d2, _.d1, Math.min(1.2, ratio));
                                } else {
                                    _.dir = Math.lerpAngle(_.d2, _.d1, Math.min(1.2, ratio));
                                }
                            }
                        }
                    }

                    // RENDER CORDS:
                    let f = camX - (maxScreenWidth / 2);
                    let d = camY - (maxScreenHeight / 2);

                    // DAY CYCLE MANAGER:
                    let dayCycle = false;
                    let dayColors = {
                        snow: "#fff",
                        river: "#91b2db",
                        grass: "#b6db66",
                        desert: "#dbc666",
                    };
                    let nightColors = {
                        snow: "#e6e6e6",
                        river: "#78a1d3",
                        grass: "#8dba2c",
                        desert: "#d3b945",
                    };
                    setInterval(()=>{
                        dayCycle = !dayCycle;
                    }, 39000 * 2);
                    // RENDER BACKGROUND:
                    let biomeColor = dayCycle ? nightColors : dayColors;
                    if (o.snowBiomeTop - d <= 0 && o.mapScale - o.snowBiomeTop - d >= maxScreenHeight) {
                        be.fillStyle = biomeColor.grass;
                        be.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (o.mapScale - o.snowBiomeTop - d <= 0) {
                        be.fillStyle = biomeColor.desert;
                        be.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (o.snowBiomeTop - d >= maxScreenHeight) {
                        be.fillStyle = biomeColor.snow;
                        be.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (o.snowBiomeTop - d >= 0) {
                        be.fillStyle = biomeColor.snow;
                        be.fillRect(0, 0, maxScreenWidth, o.snowBiomeTop - d);
                        be.fillStyle = biomeColor.grass;
                        be.fillRect(0, o.snowBiomeTop - d, maxScreenWidth, maxScreenHeight - (o.snowBiomeTop - d));
                    } else {
                        be.fillStyle = biomeColor.grass;
                        be.fillRect(0, 0, maxScreenWidth, o.mapScale - o.snowBiomeTop - d);
                        be.fillStyle = biomeColor.desert;
                        be.fillRect(0, o.mapScale - o.snowBiomeTop - d, maxScreenWidth, maxScreenHeight - (o.mapScale - o.snowBiomeTop - d));
                    }
                    // RENDER WATER AREAS:
                    if (!firstSetup) {
                        waterMult += waterPlus * o.waveSpeed * delta;
                        if (waterMult >= o.waveMax) {
                            waterMult = o.waveMax;
                            waterPlus = -1;
                        } else if (waterMult <= 1) {
                            waterMult = waterPlus = 1;
                        }
                        be.globalAlpha = 1;
                        be.fillStyle = biomeColor.desert;
                        renderWaterBodies(f, d, be, o.riverPadding);
                        be.fillStyle = biomeColor.river;
                        renderWaterBodies(f, d, be, (waterMult - 1) * 250);
                    }
                    // RENDER GRID:
                    if (true) {// false if use sin ae86
                        be.lineWidth = 4;
                        be.strokeStyle = "#000";
                        be.globalAlpha = 0.06;
                        be.beginPath();
                        let ratfrr = 60;
                        for (var x = -f % ratfrr; x < maxScreenWidth; x += ratfrr) {
                            if (x > 0) {
                                be.moveTo(x, 0);
                                be.lineTo(x, maxScreenHeight);
                            }
                        }
                        for (var y = -d % ratfrr; y < maxScreenHeight; y += ratfrr) {
                            if (y > 0) {
                                be.moveTo(0, y);
                                be.lineTo(maxScreenWidth, y);
                            }
                        }
                        be.stroke();
                    }
                    // RENDER DEAD PLAYERS:
                    be.globalAlpha = 1;
                    be.strokeStyle = outlineColor;
                    renderDeadPlayers(f, d);
                    // RENDER BOTTOM LAYER:
                    be.globalAlpha = 1;
                    be.strokeStyle = outlineColor;
                    renderGameObjects(-1, f, d);
                    // RENDER PROJECTILES:
                    be.globalAlpha = 1;
                    be.lineWidth = outlineWidth;
                    renderProjectiles(0, f, d);
                    // RENDER PLAYERS:
                    renderPlayers(f, d, 0);
                    // RENDER AI:
                    be.globalAlpha = 1;
                    for (var i = 0; i < ais.length; ++i) {
                        _ = ais[i];
                        if (_.active && _.visible) {
                            _.animate(delta);
                            be.save();
                            be.translate(_.x - f, _.y - d);
                            be.rotate(_.dir + _.dirPlus - Math.PI / 2);
                            renderAI(_, be);
                            be.restore();
                        }
                    }
                    // RENDER GAME OBJECTS (LAYERED):
                    renderGameObjects(0, f, d);
                    renderProjectiles(1, f, d);
                    renderGameObjects(1, f, d);
                    renderPlayers(f, d, 1);
                    renderGameObjects(2, f, d);
                    renderGameObjects(3, f, d);
                    // MAP BOUNDARIES:
                    be.fillStyle = "#000";
                    be.globalAlpha = 0.09;
                    if (f <= 0) {
                        be.fillRect(0, 0, -f, maxScreenHeight);
                    }
                    if (o.mapScale - f <= maxScreenWidth) {
                        var tmpY = Math.max(0, -d);
                        be.fillRect(o.mapScale - f, tmpY, maxScreenWidth - (o.mapScale - f), maxScreenHeight - tmpY);
                    }
                    if (d <= 0) {
                        be.fillRect(-f, 0, maxScreenWidth + f, -d);
                    }
                    if (o.mapScale - d <= maxScreenHeight) {
                        var tmpX = Math.max(0, -f);
                        var tmpMin = 0;
                        if (o.mapScale - f <= maxScreenWidth)
                            tmpMin = maxScreenWidth - (o.mapScale - f);
                        be.fillRect(tmpX, o.mapScale - d, maxScreenWidth - tmpX - tmpMin, maxScreenHeight - (o.mapScale - d));
                    }







                    let emojis = { joy: "ðŸ˜‚", sob: "ðŸ˜­", sus: "ðŸ¤¨", kiss: "ðŸ˜˜", omg: "ðŸ˜²", "500IQ": "ðŸ¤¯", pls: "ðŸ¥º", horny: "ðŸ¥µ", cold: "ðŸ¥¶", cry: "ðŸ˜¢", sorry: "ðŸ˜“", yummy: "ðŸ˜‹", angry: "ðŸ˜¡", skull: "ðŸ’€", dizzy: "ðŸ¥´", party: "ðŸ¥³", ez: "ðŸ˜Ž", wink: "ðŸ˜‰", flushed: "ðŸ˜³", };
                    let goldImg = new Image();
                    goldImg.src = "https://cdn.glitch.me/b05352f8-4b0b-4346-b753-3b29a72ea641%2Fgold_ico%5B1%5D.png";
                    goldImg.loaded = false;
                    goldImg.onload = () => (goldImg.loaded = true);
                    function NullWorked(undef, ReplaceUn, omgogogm) {
                        omgogogm == true ? ReplaceUn = "null" : ReplaceUn = "0"
                        if(isNaN(undef) || typeof undef == "undefined") return ReplaceUn;
                        return undef;
                    }
                    // RENDER DAY/NIGHT TIME:
                    be.globalAlpha = 1;
                    be.fillStyle = "rgba(0, 0, 70, 0.35)";
                    be.fillRect(0, 0, maxScreenWidth, maxScreenHeight);

                    // RENDER PLAYER AND AI UI:
                    be.strokeStyle = darkOutlineColor;
                    be.globalAlpha = 1;
                    for (let i = 0; i < players.length + ais.length; ++i) {
                        _ = players[i] || ais[i - players.length];
                        if (_.visible) {
                            be.strokeStyle = darkOutlineColor;

                            // NAME AND HEALTH:
                            if (_.skinIndex != 10 || (_ == player) || (_.team && _.team == player.team)) {
                                let checkName = _.name;
                                if (1 == _.isPlayer) {
                                    var tmpText =
                                    //etEl("combat").value == "zyenith" ? (_.team ? "[" + _.team + "] " : "") + (_ != player ? "[" + _.primaryIndex + "/" + _.secondaryIndex + "/" + _.healSid + "] " : "") + (checkName || "") :
                                    true ? (_.team ? "[" + _.team + "] " : "") + (_ != player ? "[" + NullWorked(_.primaryIndex) + "/" + NullWorked(_.secondaryIndex) + "/" + NullWorked(_.healSid) + "] " : "") + (checkName || "") :
                                    (_.team ? "[" + _.team + "] " : "") + (checkName || "");
                                } else {
                                    tmpText = (_.team ? "[" + _.team + "] " : "") + (checkName || "");
                                }


                                if (tmpText != "") {
                                    be.font = (_.nameScale || 30) + "px Hammersmith One";
                                    be.fillStyle = "#fff";
                                    be.textBaseline = "middle";
                                    be.textAlign = "center";
                                    be.lineWidth = (_.nameScale ? 11 : 8);
                                    be.lineJoin = "round";
                                    be.strokeText(tmpText, _.x - f, (_.y - d - _.scale) - o.nameY);
                                    be.fillText(tmpText, _.x - f, (_.y - d - _.scale) - o.nameY);
                                    let tmpS = o.crownIconScale;

                                    if (_.isLeader && iconSprites["crown"].isLoaded) {
                                        let tmpX = _.x - f - (tmpS / 2) - (be.measureText(tmpText).width / 2) - o.crownPad;
                                        be.drawImage(iconSprites["crown"], tmpX, (_.y - d - _.scale) - o.nameY - (tmpS / 2) - 5, tmpS, tmpS);
                                    }
                                    if (_.iconIndex == 1 && iconSprites["skull"].isLoaded) {
                                        let tmpX = _.x - f - (tmpS / 2) + (be.measureText(tmpText).width / 2) + o.crownPad;
                                        be.drawImage(iconSprites["skull"], tmpX, (_.y - d - _.scale) - o.nameY - (tmpS / 2) - 5, tmpS, tmpS);
                                    }
                                    if (window.richest?.sid == _.sid && _.isPlayer && goldImg.loaded) {
                                        be.drawImage(goldImg, _.x - f - (tmpS / 2) + be.measureText(tmpText).width / 2 + o.crownPad + (1 == _.iconIndex) * 60, _.y - d - _.scale - o.nameY - o.crownIconScale / 2 - 5, tmpS, tmpS);
                                    }

                                    if (_.isPlayer && instaC.wait && near == _ && (_.backupNobull ? crossHairSprites[1].isLoaded : crossHairSprites[0].isLoaded) && enemy.length && !useWasd) {
                                        let tmpS = _.scale * 2.2;
                                        be.drawImage((_.backupNobull ? crossHairSprites[1] : crossHairSprites[0]), _.x - f - tmpS / 2, _.y - d - tmpS / 2, tmpS, tmpS);
                                    }
                                }





                                if (_.health > 0) {

                                    if (true) {//PLyer data
                                        be.font = "20px Hammersmith One";
                                        be.fillStyle = "#fff";
                                        be.textBaseline = "middle";
                                        be.textAlign = "center";
                                        be.lineWidth = _.scale / 8;
                                        be.lineJoin = "round";
                                        let omggggggggg = getEl("turrreloadbars").checked ? 20 * 2 : 14 * 2;
                                        if (_ == player) {
                                            let statusss = !isNaN(ms.max) ? [ms.max, window.pingTime, ms.min] : ["n", "a"];
                                            be.strokeText("[" + "true" + "/" + "true" + "/" + statusss.join(",") + "]", _.x - f, _.y - d + _.scale + o.nameY + omggggggggg);
                                            be.fillText("[" + "true" + "/" + "true" + "/" + statusss.join(",") + "]", _.x - f, _.y - d + _.scale + o.nameY + omggggggggg);
                                        } else {
                                            /*
                                            if (getEl("EnemyDtatInfoBar").checked) {
                                                let maxPingE = (trackers[_.id]?.maxPing || 0);
                                                let curPingE = (trackers[_.id]?.ping || 0);
                                                let minPingE = (trackers[_.id]?.minPing || 0);
                                                let IsRealPLayerPingHeal = (trackers[_.id]?.isRealPing() || false);
                                                let statusss = [_.maxShame, IsRealPLayerPingHeal, !isNaN(maxPingE) ? [maxPingE, curPingE] : ["n", "a"]];
                                                be.strokeText("[" + statusss.join(",") + "]", _.x - f, _.y - d + _.scale + o.nameY + 13.5 * 2);
                                                be.fillText("[" + statusss.join(",") + "]", _.x - f, _.y - d + _.scale + o.nameY + 13.5 * 2);
                                            }
                                            */
                                        }
                                    }

                                    if (true && 1 == _.isPlayer) {
                                        be.font = (_.nameScale || 30) + "px Hammersmith One";
                                        be.fillStyle = "#ff0000";
                                        be.textBaseline = "middle";
                                        be.textAlign = "center";
                                        be.lineWidth = _.nameScale ? 11 : 8;
                                        be.lineJoin = "round";
                                        var tmpS = o.crownIconScale;
                                        var tmpX = _.x - f - tmpS / 2 + be.measureText(tmpText).width / 2 + o.crownPad + (_.iconIndex == 1 ? (_.nameScale || 30) * 2.75 : _.nameScale || 30);
                                        be.strokeText(_.shameCount, tmpX, _.y - d - _.scale - o.nameY);
                                        be.fillText(_.shameCount, tmpX, _.y - d - _.scale - o.nameY);
                                    }


                                    // PLAYER TRACER:
                                    if (true) {
                                        if (_.isPlayer && _ != player && (_.team != player.team || !_.team)) {
                                            let center = {
                                                x: screenWidth / 2,
                                                y: screenHeight / 2,
                                            };
                                            let alpha = Math.min(1, (UTILS.getDistance(0, 0, player.x - _.x, (player.y - _.y) * (16 / 9)) * 100) / (o.maxScreenHeight / 2) / center.y);
                                            let dist = center.y * alpha;
                                            let tmpX = dist * Math.cos(UTILS.getDirect(_, player, 0, 0));
                                            let tmpY = dist * Math.sin(UTILS.getDirect(_, player, 0, 0));
                                            be.save();
                                            be.translate((player.x - f) + tmpX, (player.y - d) + tmpY);
                                            be.rotate(_.aim2 + Math.PI / 2);
                                            let by = 255 - (_.sid * 2);
                                            be.fillStyle = `rgb(${by}, ${by}, ${by})`;
                                            be.globalAlpha = alpha;
                                            let renderTracer = function(s, ctx) {
                                                ctx = ctx || be;
                                                let h = s * (Math.sqrt(3) / 2);
                                                ctx.beginPath();
                                                ctx.moveTo(0, -h / 1.5);
                                                ctx.lineTo(-s / 2, h / 2);
                                                ctx.lineTo(s / 2, h / 2);
                                                ctx.lineTo(0, -h / 1.5);
                                                ctx.fill();
                                                ctx.closePath();
                                            }
                                            renderTracer(25, be);
                                            be.restore();
                                        }
                                    }
                                    if(false) {
                                        for(let i = 0; i < breakTracksTracers.length; i++) {
                                            if(breakTracksTracers[i]) {
                                                be.beginPath();
                                                be.strokeStyle = "#fff";
                                                be.lineWidth = 4;
                                                be.moveTo(player.x - f, player.y - d);
                                                be.lineTo(breakTracksTracers[i].x - f, breakTracksTracers[i].y - d);
                                                be.stroke();
                                            }
                                        }
                                    }



                                    // HealthBarPad
                                    if (true) {
                                        let gotDMG = false;
                                        if (_.health < 100) {
                                            gotDMG = true;
                                        } else {
                                            gotDMG = false;
                                        }
                                        if (gotDMG) {
                                            game.tickBase(() => {
                                                if (_.health < 100) {
                                                    gotDMG = false;
                                                }
                                            }, 15);
                                        }

                                        be.fillStyle = darkOutlineColor;
                                        be.roundRect(_.x - f - o.healthBarWidth - o.healthBarPad, (_.y - d + _.scale) + o.nameY, (o.healthBarWidth * 2) + (o.healthBarPad * 2), 17, 8);
                                        be.fill();
                                        be.fillStyle = (_ == player || (_.team && _.team == player.team)) ? "#8ecc51" : "#cc5151";
                                        be.roundRect(_.x - f - o.healthBarWidth, (_.y - d + _.scale) + o.nameY + o.healthBarPad, ((o.healthBarWidth * 2) * (_.health / _.maxHealth)), 17 - o.healthBarPad * 2, 7);
                                        be.fill();
                                        // ur got dmg
                                        if (gotDMG) {
                                            be.fillStyle = "#c1c12f";
                                            be.roundRect(_.x - f - o.healthBarWidth + ((o.healthBarWidth * 2) * (_.health / _.maxHealth)), (_.y - d + _.scale) + o.nameY + o.healthBarPad, ((o.healthBarWidth * 2) * ((_.maxHealth - _.health) / _.maxHealth)), 17 - o.healthBarPad * 2, 7);
                                            be.fill();
                                        }
                                    }

                                    if (_.isPlayer) {
                                        let PAD = 0;
                                        let tmpX = 0;
                                        let BAR = o.healthBarWidth - PAD;
                                        let reloads = {
                                            primary: (_.primaryIndex == undefined ? 1 : ((items.weapons[_.primaryIndex].speed - _.reloads[_.primaryIndex]) / items.weapons[_.primaryIndex].speed)),
                                            secondary: (_.secondaryIndex == undefined ? 1 : ((items.weapons[_.secondaryIndex].speed - _.reloads[_.secondaryIndex]) / items.weapons[_.secondaryIndex].speed)),
                                            turret: (2500 - _.reloads[53]) / 2500
                                        };
                                        // SECONDARY RELOAD:
                                        be.fillStyle = darkOutlineColor;
                                        be.roundRect(_.x - f - o.healthBarWidth - o.healthBarPad + 50 + PAD, _.y - d + _.scale + o.nameY - 13 + tmpX, BAR + o.healthBarPad * 2, 17, 8);
                                        be.fill();
                                        be.fillStyle = _.secondaryIndex == undefined || _.reloads[_.secondaryIndex] == 0 ? "#ffff00" : `hsl(${50 * Math.ceil(_.reloads[_.secondaryIndex] / 100)}, 50%, 60%)`;
                                        be.roundRect(_.x - f - o.healthBarWidth + 50 + PAD, _.y - d + _.scale + o.nameY - 13 + o.healthBarPad + tmpX, BAR * reloads.secondary, 17 - o.healthBarPad * 2, 7);
                                        be.fill();
                                        // PRIMARY RELOAD:
                                        be.fillStyle = darkOutlineColor;
                                        be.roundRect(_.x - f - o.healthBarWidth - o.healthBarPad, _.y - d + _.scale + o.nameY - 13 + tmpX, BAR + o.healthBarPad * 2, 17, 8);
                                        be.fill();
                                        be.fillStyle = _.primaryIndex == undefined || _.reloads[_.primaryIndex] == 0 ? "#ffff00" : `hsl(${50 * Math.ceil(_.reloads[_.primaryIndex] / 100)}, 50%, 60%)`;
                                        be.roundRect(_.x - f - o.healthBarWidth, _.y - d + _.scale + o.nameY - 13 + o.healthBarPad + tmpX, BAR * reloads.primary, 17 - o.healthBarPad * 2, 7);
                                        be.fill();


                                        if (_ == player && getEl("turrreloadbars").checked) {
                                            // TURRET RELOAD BAR:
                                            var tmpWidth = o.healthBarWidth;
                                            be.fillStyle = darkOutlineColor;
                                            be.roundRect(_.x - f - o.healthBarWidth - o.healthBarPad, _.y - d + _.scale + o.nameY + 13, o.healthBarWidth * 2 + o.healthBarPad * 2, 17, 8);
                                            be.fill();
                                            be.fillStyle = "#8f8366";
                                            be.roundRect(_.x - f - o.healthBarWidth, _.y - d + _.scale + o.nameY + 13 + o.healthBarPad, o.healthBarWidth * 2 * (_.reloads[53] == undefined ? 1 : (2500 - _.reloads[53]) / 2500), 17 - o.healthBarPad * 2, 7);
                                            be.fill();
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (player) {

                        // AUTOPUSH LINE:
                        if (my.autoPush) {
                            be.lineWidth = 4;
                            be.globalAlpha = 1;
                            be.beginPath();

                            be.strokeStyle = "white";
                            be.moveTo(player.x - f, player.y - d);
                            be.lineTo(my.pushData.x2 - f, my.pushData.y2 - d);
                            be.lineTo(my.pushData.x - f, my.pushData.y - d);
                            be.stroke();
                        }
                    }

                    be.globalAlpha = 1;

                    // RENDER ANIM TEXTS:
                    textManager.update(delta, be, f, d);

                    // RENDER CHAT MESSAGES:
                    for (let i = 0; i < players.length; ++i) {
                        _ = players[i];
                        if (_.visible) {
                            if (_.chatCountdown > 0) {
                                _.chatCountdown -= delta;
                                if (_.chatCountdown <= 0)
                                    _.chatCountdown = 0;
                                be.font = "32px Hammersmith One";
                                let tmpSize = be.measureText(_.chatMessage);
                                be.textBaseline = "middle";
                                be.textAlign = "center";
                                let tmpX = _.x - f;
                                let tmpY = _.y - _.scale - d - 90;
                                let tmpH = 47;
                                let tmpW = tmpSize.width + 17;
                                be.fillStyle = "rgba(0,0,0,0.2)";
                                be.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                                be.fill();
                                be.fillStyle = "#fff";
                                for (let e in emojis) {
                                    _.chatMessage = _.chatMessage.replaceAll(":" + e + ":", emojis[e]);
                                }
                                be.fillText(_.chatMessage, tmpX, tmpY);
                            }
                            // Own Chat:
                            if (_.chat.count > 0) {
                                _.chat.count -= delta;
                                if (_.chat.count <= 0)
                                    _.chat.count = 0;
                                be.font = "32px Hammersmith One";
                                let tmpSize = be.measureText(_.chat.message);
                                be.textBaseline = "middle";
                                be.textAlign = "center";
                                let tmpX = _.x - f;
                                let tmpY = _.y - _.scale - d + (90 * 2);
                                let tmpH = 47;
                                let tmpW = tmpSize.width + 17;
                                be.fillStyle = "rgba(0,0,0,0.2)";
                                be.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                                be.fill();
                                be.fillStyle = "#ffffff99";
                                be.fillText(_.chat.message, tmpX, tmpY);
                            }
                        }
                    }

                    if (allChats.length) {
                        allChats.filter(ch => ch.active).forEach((ch) => {
                            if (!ch.alive) {
                                if (ch.alpha <= 1) {
                                    ch.alpha += delta / 250;
                                    if (ch.alpha >= 1) {
                                        ch.alpha = 1;
                                        ch.alive = true;
                                    }
                                }
                            } else {
                                ch.alpha -= delta / 5000;
                                if (ch.alpha <= 0) {
                                    ch.alpha = 0;
                                    ch.active = false;
                                }
                            }
                            if (ch.active) {
                                be.font = "20px Ubuntu";
                                let tmpSize = be.measureText(ch.chat);
                                be.textBaseline = "middle";
                                be.textAlign = "center";
                                let tmpX = ch.x - f;
                                let tmpY = ch.y - d - 90;
                                let tmpH = 40;
                                let tmpW = tmpSize.width + 15;

                                be.globalAlpha = ch.alpha;

                                be.fillStyle = ch.owner.isTeam(player) ? "#8ecc51" : "#cc5151";
                                be.strokeStyle = "rgb(25, 25, 25)";
                                be.strokeText(ch.owner.name, tmpX, tmpY - 45);
                                be.fillText(ch.owner.name, tmpX, tmpY - 45);

                                be.lineWidth = 5;
                                be.fillStyle = "#ccc";
                                be.strokeStyle = "rgb(25, 25, 25)";

                                be.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                                be.stroke();
                                be.fill();

                                be.fillStyle = "#fff";
                                be.strokeStyle = "#000";
                                be.strokeText(ch.chat, tmpX, tmpY);
                                be.fillText(ch.chat, tmpX, tmpY);
                                ch.y -= delta / 100;
                            }
                        });
                    }
                }

                be.globalAlpha = 1;

                // RENDER MINIMAP:
                renderMinimap(delta);
            }

            // UPDATE & ANIMATE:
            window.requestAnimFrame = function() {
                return null;
            }
            window.rAF = (function() {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
            })();

            function doUpdate() {
                now = performance.now();
                delta = now - lastUpdate;
                lastUpdate = now;

                let timer = performance.now();
                let diff = timer - fpsTimer.last;
                if (diff >= 1000) {

                    fpsTimer.ltime = fpsTimer.time * (1000 / diff);

                    fpsTimer.last = timer;
                    fpsTimer.time = 0;
                }
                fpsTimer.time++;
                updateGame();
                rAF(doUpdate);
            }
            prepareMenuBackground();
            doUpdate();
            let changeDays = {};
            window.debug = function() {
                my.waitHit = 0;
                my.autoAim = false;
                instaC.isTrue = false;
                traps.inTrap = false;
                itemSprites = [];
                objSprites = [];
                gameObjectSprites = [];
            };
            window.toggleNight = function() {
                clearTimeout(changeDays);
                isNight = !isNight;
                itemSprites = [];
                objSprites = [];
                gameObjectSprites = [];
            };
            window.wasdMode = function() {
                useWasd = !useWasd;
            };
            window.resBuild = function() {
                if (gameObjects.length) {
                    gameObjects.forEach((tmp) => {
                        tmp.breakObj = false;
                    });
                    breakObjects = [];
                }
            };
            window.prepareUI = function(_) {
                resize();
                // ACTION BAR:
                UTILS.removeAllChildren(actionBar);
                for (let i = 0; i < (items.weapons.length + items.list.length); ++i) {
                    (function(i) {
                        UTILS.generateElement({
                            id: "actionBarItem" + i,
                            class: "actionBarItem",
                            style: "display:none",
                            onmouseout: function() {
                                showItemInfo();
                            },
                            parent: actionBar
                        });
                    })(i);
                }
                for (let i = 0; i < (items.list.length + items.weapons.length); ++i) {
                    (function(i) {
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
                            tmpSprite.onload = function() {
                                this.isLoaded = true;
                                let tmpPad = 1 / (this.height / this.width);
                                let tmpMlt = (items.weapons[i].iPad || 1);
                                tmpContext.drawImage(this, -(tmpCanvas.width * tmpMlt * o.iconPad * tmpPad) / 2, -(tmpCanvas.height * tmpMlt * o.iconPad) / 2,
                                                     tmpCanvas.width * tmpMlt * tmpPad * o.iconPad, tmpCanvas.height * tmpMlt * o.iconPad);
                                tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                                tmpContext.globalCompositeOperation = "source-atop";
                                tmpContext.fillRect(-tmpCanvas.width / 2, -tmpCanvas.height / 2, tmpCanvas.width, tmpCanvas.height);
                                getEl('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                            };
                            tmpSprite.src = "./../img/weapons/" + items.weapons[i].src + ".png";
                            let tmpUnit = getEl('actionBarItem' + i);
                            tmpUnit.onmouseover = UTILS.checkTrusted(function() {
                                showItemInfo(items.weapons[i], true);
                            });
                            tmpUnit.onclick = UTILS.checkTrusted(function() {
                                selectWeapon(_.weapons[items.weapons[i].type]);
                            });
                            UTILS.hookTouchEvents(tmpUnit);
                        } else {
                            let tmpSprite = getItemSprite(items.list[i - items.weapons.length], true);
                            let tmpScale = Math.min(tmpCanvas.width - o.iconPadding, tmpSprite.width);
                            tmpContext.globalAlpha = 1;
                            tmpContext.drawImage(tmpSprite, -tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                            tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                            tmpContext.globalCompositeOperation = "source-atop";
                            tmpContext.fillRect(-tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                            getEl('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                            let tmpUnit = getEl('actionBarItem' + i);
                            tmpUnit.onmouseover = UTILS.checkTrusted(function() {
                                showItemInfo(items.list[i - items.weapons.length]);
                            });
                            tmpUnit.onclick = UTILS.checkTrusted(function() {
                                selectToBuild(_.items[_.getItemType(i - items.weapons.length)]);
                            });
                            UTILS.hookTouchEvents(tmpUnit);
                        }
                    })(i);
                }
            };
            window.profineTest = function(data) {
                if (data) {
                    // SET INITIAL NAME:
                    let noname = "unknown";

                    // VALIDATE NAME:
                    let name = data + "";
                    name = name.slice(0, o.maxNameLength);
                    name = name.replace(/[^\w:\(\)\/? -]+/gmi, " "); // USE SPACE SO WE CAN CHECK PROFANITY
                    name = name.replace(/[^\x00-\x7F]/g, " ");
                    name = name.trim();

                    let langFilter = {
                        "list": ["ahole", "anus", "ash0le", "ash0les", "asholes", "ass", "Ass Monkey", "Assface", "assh0le", "assh0lez", "asshole", "assholes", "assholz", "asswipe", "azzhole", "bassterds", "bastard", "bastards", "bastardz", "basterds", "basterdz", "Biatch", "bitch", "bitches", "Blow Job", "boffing", "butthole", "buttwipe", "c0ck", "c0cks", "c0k", "Carpet Muncher", "cawk", "cawks", "Clit", "cnts", "cntz", "cock", "cockhead", "cock-head", "cocks", "CockSucker", "cock-sucker", "crap", "cum", "cunt", "cunts", "cuntz", "dick", "dild0", "dild0s", "dildo", "dildos", "dilld0", "dilld0s", "dominatricks", "dominatrics", "dominatrix", "dyke", "enema", "f u c k", "f u c k e r", "fag", "fag1t", "faget", "fagg1t", "faggit", "faggot", "fagg0t", "fagit", "fags", "fagz", "faig", "faigs", "fart", "flipping the bird", "fuck", "fucker", "fuckin", "fucking", "fucks", "Fudge Packer", "fuk", "Fukah", "Fuken", "fuker", "Fukin", "Fukk", "Fukkah", "Fukken", "Fukker", "Fukkin", "g00k", "God-damned", "h00r", "h0ar", "h0re", "hells", "hoar", "hoor", "hoore", "jackoff", "jap", "japs", "jerk-off", "jisim", "jiss", "jizm", "jizz", "knob", "knobs", "knobz", "kunt", "kunts", "kuntz", "Lezzian", "Lipshits", "Lipshitz", "masochist", "masokist", "massterbait", "masstrbait", "masstrbate", "masterbaiter", "masterbate", "masterbates", "Motha Fucker", "Motha Fuker", "Motha Fukkah", "Motha Fukker", "Mother Fucker", "Mother Fukah", "Mother Fuker", "Mother Fukkah", "Mother Fukker", "mother-fucker", "Mutha Fucker", "Mutha Fukah", "Mutha Fuker", "Mutha Fukkah", "Mutha Fukker", "n1gr", "nastt", "nigger;", "nigur;", "niiger;", "niigr;", "orafis", "orgasim;", "orgasm", "orgasum", "oriface", "orifice", "orifiss", "packi", "packie", "packy", "paki", "pakie", "paky", "pecker", "peeenus", "peeenusss", "peenus", "peinus", "pen1s", "penas", "penis", "penis-breath", "penus", "penuus", "Phuc", "Phuck", "Phuk", "Phuker", "Phukker", "polac", "polack", "polak", "Poonani", "pr1c", "pr1ck", "pr1k", "pusse", "pussee", "pussy", "puuke", "puuker", "queer", "queers", "queerz", "qweers", "qweerz", "qweir", "recktum", "rectum", "retard", "sadist", "scank", "schlong", "screwing", "semen", "sex", "sexy", "Sh!t", "sh1t", "sh1ter", "sh1ts", "sh1tter", "sh1tz", "shit", "shits", "shitter", "Shitty", "Shity", "shitz", "Shyt", "Shyte", "Shytty", "Shyty", "skanck", "skank", "skankee", "skankey", "skanks", "Skanky", "slag", "slut", "sluts", "Slutty", "slutz", "son-of-a-bitch", "tit", "turd", "va1jina", "vag1na", "vagiina", "vagina", "vaj1na", "vajina", "vullva", "vulva", "w0p", "wh00r", "wh0re", "whore", "xrated", "xxx", "b!+ch", "bitch", "blowjob", "clit", "arschloch", "fuck", "shit", "ass", "asshole", "b!tch", "b17ch", "b1tch", "bastard", "bi+ch", "boiolas", "buceta", "c0ck", "cawk", "chink", "cipa", "clits", "cock", "cum", "cunt", "dildo", "dirsa", "ejakulate", "fatass", "fcuk", "fuk", "fux0r", "hoer", "hore", "jism", "kawk", "l3itch", "l3i+ch", "lesbian", "masturbate", "masterbat*", "masterbat3", "motherfucker", "s.o.b.", "mofo", "nazi", "nigga", "nigger", "nutsack", "phuck", "pimpis", "pusse", "pussy", "scrotum", "sh!t", "shemale", "shi+", "sh!+", "slut", "smut", "teets", "tits", "boobs", "b00bs", "teez", "testical", "testicle", "titt", "w00se", "jackoff", "wank", "whoar", "whore", "*damn", "*dyke", "*fuck*", "*shit*", "@$$", "amcik", "andskota", "arse*", "assrammer", "ayir", "bi7ch", "bitch*", "bollock*", "breasts", "butt-pirate", "cabron", "cazzo", "chraa", "chuj", "Cock*", "cunt*", "d4mn", "daygo", "dego", "dick*", "dike*", "dupa", "dziwka", "ejackulate", "Ekrem*", "Ekto", "enculer", "faen", "fag*", "fanculo", "fanny", "feces", "feg", "Felcher", "ficken", "fitt*", "Flikker", "foreskin", "Fotze", "Fu(*", "fuk*", "futkretzn", "gook", "guiena", "h0r", "h4x0r", "hell", "helvete", "hoer*", "honkey", "Huevon", "hui", "injun", "jizz", "kanker*", "kike", "klootzak", "kraut", "knulle", "kuk", "kuksuger", "Kurac", "kurwa", "kusi*", "kyrpa*", "lesbo", "mamhoon", "masturbat*", "merd*", "mibun", "monkleigh", "mouliewop", "muie", "mulkku", "muschi", "nazis", "nepesaurio", "nigger*", "orospu", "paska*", "perse", "picka", "pierdol*", "pillu*", "pimmel", "piss*", "pizda", "poontsee", "poop", "porn", "p0rn", "pr0n", "preteen", "pula", "pule", "puta", "puto", "qahbeh", "queef*", "rautenberg", "schaffer", "scheiss*", "schlampe", "schmuck", "screw", "sh!t*", "sharmuta", "sharmute", "shipal", "shiz", "skribz", "skurwysyn", "sphencter", "spic", "spierdalaj", "splooge", "suka", "b00b*", "testicle*", "titt*", "twat", "vittu", "wank*", "wetback*", "wichser", "wop*", "yed", "zabourah", "4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx", "jew", "black", "baby", "child", "white", "porn", "pedo", "trump", "clinton", "hitler", "nazi", "gay", "pride", "sex", "pleasure", "touch", "poo", "kids", "rape", "white power", "nigga", "nig nog", "doggy", "rapist", "boner", "nigger", "nigg", "finger", "nogger", "nagger", "nig", "fag", "gai", "pole", "stripper", "penis", "vagina", "pussy", "nazi", "hitler", "stalin", "burn", "chamber", "cock", "peen", "dick", "spick", "nieger", "die", "satan", "n|ig", "nlg", "cunt", "c0ck", "fag", "lick", "condom", "anal", "shit", "phile", "little", "kids", "free KR", "tiny", "sidney", "ass", "kill", ".io", "(dot)", "[dot]", "mini", "whiore", "whore", "faggot", "github", "1337", "666", "satan", "senpa", "discord", "d1scord", "mistik", ".io", "senpa.io", "sidney", "sid", "senpaio", "vries", "asa"],
                        "exclude": [],
                        "placeHolder": "*",
                        "regex": {},
                        "replaceRegex": {}
                    };

                    let isProfane = false;
                    let convertedName = name.toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");
                    for (let word of langFilter.list) {
                        if (convertedName.indexOf(word) != -1) {
                            isProfane = true;
                            break;
                        }
                    }

                    if (name.length > 0 && !isProfane) {
                        noname = name;
                    }

                    return noname;
                }
            };
        },
        webgl_test: () => {
            return;
            let canvas = document.createElement("canvas");
            canvas.id = "WEBGL";
            canvas.width = canvas.height = 300;
            canvas.style = `
            position: relative;
            bottom: 70%;
            left: 70%;
            pointer-events: none;
            `;

            let fat = document.createElement("div");
            fat.id = "faku";
            fat.width = fat.height = 300;
            fat.style = `
            position: relative;
            bottom: 70%;
            left: 70%;
            pointer-events: none;
            font-size: 20px;
            `;
            fat.innerHTML = "Webgl Test Rendering";

            let gl = canvas.getContext("webgl");
            if (!gl) {
                alert("urbad");
                return;
            }

            document.body.append(canvas);
            document.body.append(fat);
            log(gl);

            gl.clearColor(0, 0, 0, 0.2);
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

            let max = 50;
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
                    gl_FragColor = vec4(${getRgb(...hexToRgb("#cc5151"))}, 1);
                }
                `, [
                    // moveto, lineto
                    0 + (Math.cos(radian) * 0.5), 0 + (Math.sin(radian) * 0.5),
                    0, 0,
                ], gl.LINE_LOOP);
            }
        }
    };
    if (codes) {
        for (let code in codes) {
            let func = codes[code];
            typeof func === "function" && func();
        }
        window.enableHack = function() {
            if (!useHack) {
                useHack = true;
                codes.main();
            }
        };
    }
}(1);