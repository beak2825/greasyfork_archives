// ==UserScript==
// @name                External-Executor
// @match               *://*.moomoo.io/*
// @license MIT
// @icon                -
// @author              LEAKED BY XCFVMAYBE
// @External-Executor   True
// @grant               none
// @description         External executor leaked by xcfvmaybe
// @version 0.0.1.20240911011710
// @namespace https://greasyfork.org/users/1364247
// @downloadURL https://update.greasyfork.org/scripts/507880/External-Executor.user.js
// @updateURL https://update.greasyfork.org/scripts/507880/External-Executor.meta.js
// ==/UserScript==
//ModMenu
// BEST REPLACER
// BEST HEAL AND ANTI SHAME
//Credits To Error_King
(function() {
    'use strict';
    const menuHTML = `
        <div id="overlay" class="overlay"></div>
        <div id="customMenu" class="menuClass">
            <div class="menuHeader">
                <div class="banner-container">
                    <img src="https://cdn.discordapp.com/attachments/836402083330654288/1282907149382455296/image.png?ex=66e10fe3&is=66dfbe63&hm=0590947768d901a7b8572ae1b1b9bbadb6b378928ee946c5db54712efdc6987f&" alt="Banner" class="banner">
                </div>
            </div>
            <div class="mainContent">
                <div class="leftSidebar">
                    <button class="tablink" onclick="openTab(event, 'MainMenu')">Main Menu</button>
                    <button class="tablink" onclick="openTab(event, 'Configuration')">Configuration</button>
                    <button class="tablink" onclick="openTab(event, 'CombatSettings')">Combat Settings</button>
                    <button class="tablink" onclick="openTab(event, 'Visuals')">Visuals</button>
                    <button class="tablink" onclick="openTab(event, 'FOVSettings')">FOV Settings</button>
                    <h4 class="banner-title">External-Executor</h4>
                </div>
                <div id="tabContentContainer" class="rightSidebar">
                    <div id="MainMenu" class="tabcontent">
                        <h3>Main Menu</h3>
                        <div class="setting-item">
                            <label class="switch">
                                <input type="checkbox" id="weaponGrind">
                                <span class="slider"></span>
                            </label> Grinder
                        </div>
                        <div class="setting-item">
                            <label class="switch">
                                <input type="checkbox" id="healingBeta" checked>
                                <span class="slider"></span>
                            </label> Heal
                        </div>
                        <button id="debugButton" class="actionButton">Debug</button>
                        <button id="soldierButton" class="actionButton">Soldier Hat</button>
                    </div>
                    <div id="Configuration" class="tabcontent">
                        <h3>Configuration</h3>
                        <div class="scrollable-content">
                            <div class="setting-item">
                                <label class="switch">
                                    <input type="checkbox" id="backupNobull" checked>
                                    <span class="slider"></span>
                                </label> Backup Nobull Insta
                            </div>
                            <div class="setting-item">
                                <label class="switch">
                                    <input type="checkbox" id="turretCombat">
                                    <span class="slider"></span>
                                </label> Turret Gear Combat Assistance
                            </div>
                            <div class="setting-item">
                                <label class="switch">
                                    <input type="checkbox" id="safeAntiSpikeTick" checked>
                                    <span class="slider"></span>
                                </label> Safe AntiSpikeTick
                            </div>
                        </div>
                    </div>
                    <div id="CombatSettings" class="tabcontent">
                        <h3>Combat Settings</h3>
                        <div class="scrollable-content">
                            <div class="setting-item">
                                <label for="instaType">InstaKill Mode</label>
                                <select id="instaType" class="custom-select">
                                    <option value="oneShot" selected>QuickShot</option>
                                    <option value="spammer">RapidFire</option>
                                </select>
                            </div>
                            <div class="setting-item">
                                <label for="antiBullType">AntiBull Mode</label>
                                <select id="antiBullType" class="custom-select">
                                    <option value="noab" selected>Disable AntiBull</option>
                                    <option value="abreload">Post-Reload</option>
                                    <option value="abalway">Always Active</option>
                                </select>
                            </div>
                            <div class="setting-item">
                                <label for="autoPlacetype">AutoPlace Mode</label>
                                <select id="autoPlacetype" class="custom-select">
                                    <option value="smart" selected>Intelligent</option>
                                    <option value="magicplace">AutoPlace1</option>
                                    <option value="aiplace">AutoPlace2</option>
                                    <option value="spamtrap">TrapSpam1</option>
                                    <option value="spamtrap2">TrapSpam2</option>
                                    <option value="ramdomplc">Randomized</option>
                                </select>
                            </div>
                            <div class="setting-item">
                                <label for="replaceType">replacer Mode</label>
                                <select id="replaceType" class="custom-select">
                                <option value="trap">Retrap</option>
                                <option value="spike">Respike</option>
                               </select>
                            </div>
                        </div>
                    </div>
                    <div id="Visuals" class="tabcontent">
                        <h3>Visuals</h3>
                        <div class="scrollable-content">
                            <div class="setting-item">
                                <label class="switch">
                                    <input type="checkbox" id="placeVis">
                                    <span class="slider"></span>
                                </label> Show Placers
                            </div>
                        </div>
                    </div>
                    <div id="FOVSettings" class="tabcontent">
                        <h3>FOV Settings</h3>
                        <div class="setting-item">
                            <label for="visualType">FOV: </label>
                            <select id="visualType" class="custom-select">
                                <option value="Cam+" id="Cam+">FOV: +</option>
                                <option value="Cam0" id="Cam0" selected>FOV: 0</option>
                                <option value="Cam1" id="Cam1">FOV: 1</option>
                                <option value="Cam2" id="Cam2">FOV: 2</option>
                                <option value="Cam3" id="Cam3">FOV: 3</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', menuHTML);
    const style = document.createElement('style');
    style.innerHTML = `
        #overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 999;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            display: none;
        }
        #customMenu {
            display: none;
            height: 700px;
            width: 900px;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #2e2e2e;
            color: #eee;
            border: 1px solid #444;
            border-radius: 12px;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
        #customMenu.show {
            display: flex;
            opacity: 1;
        }
        #overlay.show {
            display: block;
            opacity: 1;
        }
        .menuHeader {
            position: relative;
            width: 100%;
            height: 120px;
            background-color: #444;
            border-bottom: 1px solid #555;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .banner-container {
            position: relative;
            width: 100%;
            height: 100%;
        }
        .banner {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: brightness(70%);
        }
        .mainContent {
            display: flex;
            flex: 1;
        }
        .leftSidebar {
            width: 35%;
            background-color: #333;
            padding: 20px;
            border-right: 1px solid #555;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
        .leftSidebar .tablink {
            width: 100%;
            margin: 5px 0;
            text-align: left;
            display: block;
        }
        .rightSidebar {
            width: 65%;
            padding: 20px;
        }
        .banner-title {
            position: absolute;
            bottom: 15px;
            left: 15px;
            color: #fff;
            font-weight: bold;
            font-size: 14px;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
        }
        .tablink {
            background-color: #444;
            color: #eee;
            border: none;
            padding: 12px;
            text-align: center;
            cursor: pointer;
            border-radius: 6px;
            font-size: 18px;
            margin-bottom: 10px;
            transition: background-color 0.3s;
        }
        .tablink:hover {
            background-color: #555;
        }
        .tabcontent {
            display: none;
        }
        .tabcontent.active {
            display: block;
        }
        .setting-item {
            margin: 20px 0;
            display: flex;
            align-items: center;
            color: #eee;
            font-size: 18px;
        }
        .setting-item label {
            margin-right: 15px;
        }
        .scrollable-content {
            overflow-y: auto;
            max-height: 450px;
        }
        .scrollable-content::-webkit-scrollbar {
            width: 10px;
        }
        .scrollable-content::-webkit-scrollbar-thumb {
            background: #777;
            border-radius: 12px;
        }
        .scrollable-content::-webkit-scrollbar-thumb:hover {
            background: #888;
        }
        .switch {
            position: relative;
            display: inline-block;
            width: 45px;
            height: 25px;
        }
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #777;
            transition: .3s;
            border-radius: 25px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 21px;
            width: 21px;
            border-radius: 50%;
            background-color: #fff;
            transition: .3s;
            left: 2px;
            bottom: 2px;
        }
        input:checked + .slider {
            background-color: #66bb6a;
        }
        input:checked + .slider:before {
            transform: translateX(20px);
        }
        .custom-select {
            background-color: #333;
            color: #eee;
            border: 1px solid #555;
            border-radius: 6px;
            padding: 10px;
            font-size: 18px;
            width: 100%;
            box-sizing: border-box;
        }
        .custom-select option {
            background-color: #333;
            color: #eee;
        }
        .custom-select:focus {
            outline: none;
        }
        .actionButton {
            background-color: #555;
            border: none;
            color: #eee;
            padding: 12px;
            cursor: pointer;
            border-radius: 6px;
            transition: background-color 0.3s, transform 0.3s;
            margin-top: 15px;
            font-size: 18px;
        }
        .actionButton:hover {
            background-color: #666;
            transform: scale(1.05);
        }
        .actionButton:active {
            background-color: #777;
        }
        h3 {
            margin: 15px 0;
            font-size: 24px;
            color: #eee;
        }
    `;
    document.head.appendChild(style);
    window.openTab = function(evt, tabName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].classList.remove("active");
        }
        tablinks = document.getElementsByClassName("tablink");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].classList.remove("active");
        }
        var activeTab = document.getElementById(tabName);
        activeTab.classList.add("active");
        evt.currentTarget.classList.add("active");
    };
    function toggleMenu() {
        const menu = document.getElementById('customMenu');
        const overlay = document.getElementById('overlay');
        if (menu.classList.contains('show')) {
            menu.classList.remove('show');
            overlay.classList.remove('show');
            setTimeout(() => {
                menu.style.display = 'none';
                overlay.style.display = 'none';
            }, 500);
        } else {
            menu.style.display = 'flex';
            overlay.style.display = 'block';
            setTimeout(() => {
                menu.classList.add('show');
                overlay.classList.add('show');
            }, 10);
        }
    }
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('customMenu').style.display = 'none';

    document.getElementById('overlay').addEventListener('click', function() {
        toggleMenu();
    });
    document.getElementById('debugButton').addEventListener('click', function() {
        if (typeof window.debug === 'function') {
            window.debug();
        } else {
            console.log('Debug function not defined.');
        }
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            toggleMenu();
        }
    });
    document.getElementById('visualType').value = 'Cam2';
})();




//
//Astive_ADVANCE_FPS_BOOSTER
(function() {
    'use strict';
    function advancedFPSBooster() {
        function reduceRenderQuality() {
            if (window.game && game.renderer) {
                game.renderer.autoResize = false;
                game.renderer.resolution = 0.25;
                console.log('Render quality and resolution scaling reduced');
            }
        }
        function capFPS() {
            if (window.game && game.ticker) {
                game.ticker.minFPS = 30;
                game.ticker.maxFPS = 30;
                console.log('FPS capped at 30');
            }
        }
        function disableShadowsAndLighting() {
            if (window.game && game.world) {
                game.world.lightLevel = 0;
                if (game.world.shadow) {
                    game.world.shadow.enabled = false;
                }
                console.log('Shadows and lighting effects disabled');
            }
        }
        function simplifyTextures() {
            if (window.game && game.renderer) {
                const textures = game.renderer.textureCache;
                for (let key in textures) {
                    if (textures.hasOwnProperty(key)) {
                        textures[key].baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                    }
                }
                console.log('Textures simplified');
            }
        }
        function limitParticlesAndEffects() {
            if (window.game && game.particleManager) {
                game.particleManager.maxParticles = 50;
                console.log('Particles and effects limited');
            }
        }
        function disableUnnecessaryEvents() {
            if (window.game && game.events) {
                game.events.offAll();
                console.log('Unnecessary event listeners disabled');
            }
        }
        function optimizePhysicsAndAI() {
            if (window.game && game.physicsEngine) {
                game.physicsEngine.timestep = 1000 / 20;
                console.log('Physics calculations optimized');
            }
            if (window.game && game.aiManager) {
                game.aiManager.updateFrequency = 1000 / 10;
                console.log('AI calculations optimized');
            }
        }
        function disableAudio() {
            if (window.game && game.audio) {
                game.audio.muted = true;
                console.log('Game audio disabled');
            }
        }
        function checkGameReady() {
            if (typeof game !== 'undefined' && game.renderer) {
                reduceRenderQuality();
                capFPS();
                disableShadowsAndLighting();
                simplifyTextures();
                limitParticlesAndEffects();
                disableUnnecessaryEvents();
                optimizePhysicsAndAI();
                disableAudio();
                console.log('Advanced FPS Booster applied successfully!');
            } else {
                setTimeout(checkGameReady, 100);
            }
        }
        checkGameReady();
    }
    setTimeout(advancedFPSBooster, 1000);
})();

//
const applyStyles = selector => $(selector).css({'border-radius': '8px', 'background-color': 'rgba(50, 50, 50, 0.7)', 'backdrop-filter': 'blur(10px)', 'box-shadow': '0px 4px 20px rgba(0, 0, 0, 0.5)', 'border': '1px solid #808080', 'color': '#e0e0e0', 'text-align': 'center', 'transition': 'transform 0.3s ease'});

const applyInputStyles = selector => $(selector).css({'border-radius': '8px', 'background-color': '#1e1e1e', 'border': '1px solid #606060', 'color': '#e0e0e0', 'text-align': 'left', 'padding': '10px', 'transition': 'border-color 0.3s ease'});

const applyInitialStyles = () => { applyStyles('#foodDisplay, #woodDisplay, #stoneDisplay, #scoreDisplay, #killCounter, #chatButton, #storeButton, #mapDisplay, #leaderboard, #allianceButton'); applyInputStyles('#nameInput'); };

$(document).ready(() => applyInitialStyles());

$('#allianceButton').on('click', () => applyInitialStyles());

$('#storeButton').on('click', () => applyInitialStyles());

$('body').append(`<style>::-webkit-scrollbar { width: 12px; } ::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); border-radius: 10px; } ::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.5); border-radius: 10px; border: 3px solid rgba(0, 0, 0, 0.1); } ::-webkit-scrollbar-thumb:hover { background-color: rgba(255, 255, 255, 0.7); }</style>`);

class deadfuturechickenmodrevival {
    constructor(flarez, lore) {
        this.inGame = false;
        this.lover = flarez + lore;
        this.baby = "ae86";
        this.isBlack = 0;
        this.webSocket = undefined;
        this.checkBaby = function() {
            this.baby !== "ae86" ? this.isBlack++ : this.isBlack--;
            if (this.isBlack >= 1) return "bl4cky";
            return "noting for you";
        };
        this.x2 = 0;
        this.y2 = 0;
        this.chat = "Imagine playing this badass game XDDDDD";
        this.summon = function(tmpObj) {
            this.x2 = tmpObj.x;
            this.y2 = tmpObj.y;
            this.chat = tmpObj.name + " ur so bad XDDDD";
        };
        this.commands = function(cmd) {
            cmd == "rv3link" && window.open("https://florr.io/");
            cmd == "woah" && window.open("https://www.youtube.com/watch?v=MO0AGukzj6M");
            return cmd;
        };
        this.dayte = "11yearold";
        this.memeganoob = "69yearold";
        this.startDayteSpawn = function(tmpObj) {
            let ratio = setInterval(() => {
                this.x2 = tmpObj.x + 20;
                this.y2 = tmpObj.y - 20;
                this.chat = "UR SO BAD LOL";
                if (tmpObj.name == "ae86") {
                    this.chat = "omg ae86 go run";
                    setTimeout(() => {
                        this.inGame = false;
                        clearInterval(ratio);
                    }, 1000);
                }
            }, 1234);
        };
        this.AntiChickenModV69420 = function(tmpObj) {
            return "!c!dc user " + tmpObj.name;
        };
    }
}




let isNight = true;


let founda = false;
let testMode = window.location.hostname == "1";

let scriptTags = document.getElementsByTagName("script");
for (let i = 0; i < scriptTags.length; i++) {
    if (scriptTags[i].src.includes("index-f3a4c1ad.js") && !founda) {
        scriptTags[i].remove();
        founda = true;
        break;
    }
}

function getEl(id) {
    return document.getElementById(id);
}

let newFont = document.createElement("link");
newFont.rel = "stylesheet";
newFont.href = "https://fonts.googleapis.com/css?family=Ubuntu:700";
newFont.type = "text/css";
document.body.append(newFont);

let min = document.createElement("script");
min.src = "https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js";
document.body.append(min);
window.oncontextmenu = function() {
    return false;
};

let config = window.config;

// CLIENT:
config.clientSendRate = 9; // Aim Packet Send Rate
config.serverUpdateRate = 9;

// UI:
config.deathFadeout = 0;

config.playerCapacity = 9999;

// CHECK IN SANDBOX:
config.isSandbox = window.location.hostname == "sandbox.moomoo.io";

// CUSTOMIZATION:
config.skinColors = ["#bf8f54", "#cbb091", "#896c4b",
                     "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3",
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

// VISUAL:
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
        autoPrePlace: true,
        antiTrap: true,
        secondaryOnCounter: true,
        counterInsta: true,
        slowOT: false,
        attackDir: false,
        showDir: false,
        autoRespawn: false,
        fakePing: true,
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



let smoothui = document.createElement("style");
smoothui.type = "text/css";
smoothui.appendChild(document.createTextNode(`
.actionBarItem {
    width: 66px;
    height: 66px;
    margin-right: 6px;
    background-color: rgba(0, 0, 0, 0.4); /* Slightly darker transparent background */
    border-radius: 15%; /* Lower border-radius for a less rounded shape */
    display: inline-block;
    cursor: pointer;
    pointer-events: all;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.6); /* Enhanced shadow for better depth */
    border: 1px solid rgba(128, 128, 128, 0.5); /* Grey border for a sleek look */
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;
}

.actionBarItem:hover {
    transform: scale(1.1); /* Scale up on hover for a cool effect */
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.8), inset 0px 0px 20px rgba(0, 0, 0, 0.5);
    background-color: rgba(0, 0, 0, 0.6); /* Darker background on hover */
    border-color: rgba(128, 128, 128, 0.7); /* Slightly brighter grey border on hover */
}

#ageBarContainer {
    width: 100%;
    bottom: 120px;
    border-radius: 20px;
    text-align: center;
}

#ageBar {
    background-color: rgba(0, 0, 0, 0.4); /* Darker transparent background */
    border-radius: 8px; /* Rounded corners for the bar */
    width: 314px;
    height: 10px;
    margin-bottom: 8px;
    overflow: hidden;
    border: 1px solid rgba(128, 128, 128, 0.5); /* Grey border for a sleek look */
}

#ageBar::after {
    content: '';
    display: block;
    height: 100%;
    width: 0%;
    background-color: rgba(128, 128, 128, 0.7); /* Grey progress indicator */
    transition: width 0.5s ease-in-out;
    border-radius: 8px;
}

#ageBarContainer[data-age='10'] #ageBar::after {
    width: 10%;
}

#ageBarContainer[data-age='20'] #ageBar::after {
    width: 20%;
}

#ageBarContainer[data-age='30'] #ageBar::after {
    width: 30%;
}

.resourceDisplay {
    background-color: rgba(0, 0, 0, 0.6); /* Darker transparent background */
    backdrop-filter: blur(8px); /* Adjust blur for a smoother look */
    border-radius: 10%;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.6); /* Enhanced shadow for depth */
    border: 1px solid rgba(128, 128, 128, 0.5); /* Grey border for consistency */
    transition: backdrop-filter 0.3s ease-in-out, box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out;
}

.resourceDisplay:not(:hover) {
    backdrop-filter: blur(10px); /* Slightly more blur when not hovered */
}
`));

document.head.appendChild(smoothui);



// MENU FUNCTIONS:
window.changeMenu = function() {};
window.debug = function() {};
window.ZOVPlayer = function() {};
window.freezePlayer = function() {};
window.wasdMode = function() {};

// PAGE 1:
window.startGrind = function() {};

// PAGE 3:
window.resBuild = function() {};
window.toggleVisual = function() {};

// SOME FUNCTIONS:
window.prepareUI = function() {};
window.leave = function() {};

// nah hahahahahhh why good ping
window.ping = 0;

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
            window[setting.id + "Func"] = function () { };
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
                newSelect += ` style = "color: ${setting.menu[options] ? "#fff" : "#000"}; background: ${setting.menu[options] ? "#000" : "#fff"};">${options}</option>`;
                i++;
            }
            newSelect += `</select>`;

            this.add(newSelect);

            i = 0;
            for (let options in setting.menu) {
                window[options + "Func"] = function () {
                    setting.menu[options] = getEl("check_" + options).checked ? true : false;
                    saveVal(options, setting.menu[options]);

                    getEl("O_" + options).style.color = setting.menu[options] ? "#000" : "#fff";
                    getEl("O_" + options).style.background = setting.menu[options] ? "#fff" : "#000";

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
            window[setting.id + "Func"] = function () {
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
            this.startDiv = function (setting, func) {

                let newDiv = document.createElement("div");
                setting.id && (newDiv.id = setting.id);
                setting.style && (newDiv.style = setting.style);
                setting.class && (newDiv.className = setting.class);
                this.element.appendChild(newDiv);
                this.divElement = newDiv;

                let addRes = new HtmlAction(newDiv);
                typeof func == "function" && func(addRes);

            };
            this.addDiv = function (setting, func) {

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
HTML.setStyle(`position: absolute; left: -9999px; top: -9999px;`);
HTML.resetHTML();
HTML.setCSS(`#menuDiv { display: none; }`);

HTML.startDiv({
    id: "menuHeadLine",
    class: "menuClass"
}, (html) => {
    html.add(`External-Executor`);
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
        html.button({
            class: "menuB",
            innerHTML: "ZOV Player",
            onclick: "window.ZOVPlayer()"
        });
        html.button({
            class: "menuB",
            innerHTML: "Freeze Player",
            onclick: "window.freezePlayer()"
        });
    });
    HTML.addDiv({
        id: "menuMain",
        style: "display: block",
        class: "menuC",
        appendID: "menuHeadLine"
    }, (html) => {
        html.newLine();
        html.add(`Auto-Grinder: `);
        html.checkBox({
            id: "weaponGrind",
            class: "checkB",
            onclick: "window.startGrind()"
        });
        html.newLine(2);
        html.add(`AutoHeal:`);
        html.checkBox({
            id: "healingBeta",
            class: "checkB",
            checked: true
        });
                                html.newLine();
        html.add(`AntiSpike: `);
        html.checkBox({
            id: "AutoBreakSpike",
            class: "checkB",
            checked: true
        });
                        html.newLine();
                html.add(`AvoidSpike1:`);
                html.checkBox({
                    id: "avoidspike",
                    class: "checkB",
                    checked: true
                });

                    html.newLine();
                    html.add(`Visual: `);
                    html.select({
                        id: "brightnesstype", class: "Cselect", option: {
                            "Grid": {
                                id: "fz",
                                selected:true

                            },
                        }
                    });

     html.newLine(2);
     html.add(`Sync Type: `);
     html.select({
         id: "syncType", class: "Cselect", option: {
             "Insta": {
                 id: "s1",
             },
             "Musket": {
                 id: "s2",
                 selected: true
             }
         }
     });
        html.newLine();
    html.add("Sync: ");
    html.checkBox({
        id: "musketSync",
        class: "checkB",
        checked: true
    });
    html.newLine(2);
    html.add("AntiKick:");
    html.checkBox({
        id: "antikick",
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
            value: "2",
            size: "2em",
            maxLength: "1"
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
                    html.add(`AutoPlaceType: `);
                    html.select({
                        id: "autoPlacetype", class: "Cselect", option: {
                            Smart: {
                                id: "smart",
                                selected: true
                            },
                            AutoPlace1: {
                                id: "magicplace",
                            },
                            AutoPlace2: {
                                id: "aiplace",
                            },
                            SpamTrap1: {
                                id: "spamtrap",
                            },
                            SpamTrap2: {
                                id: "spamtrap2",
                            },
                            RandomPlace: {
                                id: "ramdomplc",

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
            class: "checkB"
        });
        html.newLine();
        html.add(`Safe AntiSpikeTick: `);
        html.checkBox({
            id: "safeAntiSpikeTick",
            class: "checkB",
            checked: true
                    });
                            html.newLine();
                    html.add('Camera: ');
                    html.select({
                        id: "visualType",
                        class: "Cselect",
                        option: {
                            'Camera +': {
                                id: 'Cam+',
                            },
                            'Camera 0': {
                                id: 'Cam0',
                            },
                            'Camera 1': {
                                id: 'Cam1',

                            },
                            'Camera 2': {
                                id: 'Cam2',
                                selected: true
                            },
                            'Camera 3': {
                                id: 'Cam3',
                            }
                        }
                    });
                    });
    HTML.addDiv({
        id: "menuOther",
        class: "menuC",
        appendID: "menuHeadLine"
    }, (html) => {
        html.button({
            class: "menuB",
            innerHTML: "Connect Bots",
            onclick: "window.tryConnectBots()"
        });
        html.button({
            class: "menuB",
            innerHTML: "Disconnect Bots",
            onclick: "window.destroyBots()"
        });
        html.newLine();
        html.button({
            class: "menuB",
            innerHTML: "Connect FBots",
            onclick: "window.connectFillBots()"
        });
        html.button({
            class: "menuB",
            innerHTML: "Disconnect FBots",
            onclick: "window.destroyFillBots()"
        });
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
        html.newLine();
        html.add(`Bot Mode: `);
        html.select({
            id: "mode",
            class: "Cselect",
            option: {
                "Clear Building": {
                    id: "clear",
                    selected: true
                },
                "Sync": {
                    id: "zync",
                },
                "Search": {
                    id: "zearch"
                },
                "Clear Everything": {
                    id: "fuckemup"
                },
                "Flex": {
                    id: "flex"
                }
            }
        });
        html.newLine(2);
        html.button({
            class: "menuB",
            innerHTML: "Toggle Fbots Circle",
            onclick: "window.toggleBotsCircle()"
        });
        html.newLine();
        html.add(`Circle Rad: `);
        html.text({
            id: "circleRad",
            class: "customText",
            value: "200",
            size: "3em",
            maxLength: "4"
        });
        html.newLine();
        html.add(`Rad Speed: `);
        html.text({
            id: "radSpeed",
            class: "customText",
            value: "0.1",
            size: "2em",
            maxLength: "3"
        });
        html.newLine();
        html.add(`Bot Zetup Type: `);
        html.select({
            id: "setup",
            class: "Cselect",
            option: {
                "Dagger Musket": {
                    id: "dm",
                    selected: true
                },
                "Katana Hammer": {
                    id: "kh",
                },
                "Dagger Repeater-Crossbow": {
                    id: "dr"
                },
                "Zhort-Zword Muzket": {
                    id: "zd"
                }
            }
        });
        html.newLine(2);
        html.add(`Cross World: `);
        html.checkBox({
            id: "funni",
            class: "checkB"
        });
        html.newLine();
        html.button({
            class: "menuB",
            innerHTML: "Toggle Another Visual",
            onclick: "window.toggleVisual()"
        });
        html.newLine();
    });
});

let menuIndex = 0;
let menus = ["menuMain", "menuConfig", "menuOther"];
window.changeMenu = function() {
    getEl(menus[menuIndex % menus.length]).style.display = "none";
    menuIndex++;
    getEl(menus[menuIndex % menus.length]).style.display = "block";
};

let mStatus = document.createElement("div");
mStatus.id = "status";
getEl("gameUI").appendChild(mStatus);
HTML.set("status");
HTML.setStyle(`
    display: block;
    position: absolute;
    color: #fff;
    font-family: Arial, sans-serif;
    font-size: 16px;
    bottom: -215px;
    left: -20px;
    text-shadow: -1.1px -1.1px 0 #000, 1.1px -1.1px 0 #000, -1.1px 1.1px 0 #000, 1.1px 1.1px 0 #000;
`);
HTML.resetHTML();
HTML.setCSS(`
    .sizing {
        font-size: 15px;
    }
    .mod {
        font-size: 15px;
        display: inline-block;
    }
`);
HTML.startDiv({
    id: "uehmod",
    class: "sizing"
}, (html) => {
    html.add(`Ping: `);
    HTML.addDiv({
        id: "pingFps",
        class: "mod",
        appendID: "uehmod"
    }, (html) => {
        html.add("None");
    });
    html.newLine();
    html.add(`Packet: `);
    HTML.addDiv({
        id: "packetStatus",
        class: "mod",
        appendID: "uehmod"
    }, (html) => {
        html.add("None");
    });
});

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
        // Y: remProjectile, // 19: remProjectile,
        //Z: serverShutdownNotice,
        //0: addAlliance,
        //1: deleteAlliance,
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
    if (r < 0) r = 0;
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
function resetMoveDir() {
    keys = {};
    io.send("e");
}

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
let liztobj = [];
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
    spikeAim: false,
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

let adCard = getEl("adCard");
adCard.remove();
let promoImageHolder = getEl("promoImgHolder");
promoImageHolder.remove();
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
let allianceMenu = getEl("allianceMenu");
let waterMult = 1;
let waterPlus = 0;
let mouseX = 0;
let mouseY = 0;
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
    min: 0,
    delay: 0
}

function pingSocketResponse() {
    let pingTime = window.pingTime;
    const pingDisplay = document.getElementById("pingDisplay");

    // Update display to show only the ping time followed by "ms"
    pingDisplay.innerText = `${pingTime}ms`;

    // Apply glowing light soft pink style directly
    pingDisplay.style.color = '#FFC0CB'; // Light pink color
    pingDisplay.style.textShadow = '0 0 5px rgba(255, 192, 203, 0.8), 0 0 10px rgba(255, 192, 203, 0.6), 0 0 15px rgba(255, 192, 203, 0.4)';
}

let placeVisible = [];

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
            mathHYPOT = Math.hypot,
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
        this.getdist = function(vec1, vec2, type1 = "", type2 = "") {
            return mathHYPOT(vec1[`x${type1 || ""}`] - vec2[`x${type2 || ""}`], vec1[`y${type1 || ""}`] - vec2[`y${type2 || ""}`]);
        };
        this.getangle = function(vec1, vec2, type1 = "", type2 = "") {
            return mathATAN2(vec1[`y${type1 || ""}`] - vec2[`y${type2 || ""}`], vec1[`x${type1 || ""}`] - vec2[`x${type2 || ""}`]);
        };
        this.collisionDetection = function(obj1, obj2, scale) {
            return mathSQRT((obj1.x - obj2.x) ** 2 + (obj1.y - obj2.y) ** 2) < scale;
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
        this.createTempObject = function() {
            return { x: 0, y: 0, scale: 0 }
        };
        this.getPosFromAngle = function(item, angle) {
            let x, y, scale;
            item = items.list[item];
            x = player.x2 + (item.scale + player.scale + (item.placeOffset || 0)) * Math.cos(angle);
            y = player.y2 + (item.scale + player.scale + (item.placeOffset || 0)) * Math.sin(angle);
            scale = item.scale;
            return {x, y, scale};
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
                } else {
                    //console.error("Event is not trusted.", ev);
                }
            };
        };
        this.randomString = function(length) {
            let text = "";
            let possible = "ABCDD1Sierj38iuuA8K8CyRWnbSoiXc8UK66B8Lnopqrstuvwxyz0123456789";
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
        this.inBetween = function(angle, arra) { // okay the thing i have left to fix is if the first angle is not in the right quadrant i need to make sure that the second one is less far(another checking of which quadrant it is depending on the angle)
            //mental health is not looking good rn
            let array1q
            let array = new Array(2);
            let array2q

            if (Math.sin(angle) > 0 && Math.cos(angle) > 0) {//angle in the first quadrant
                array[0] = arra[0]
                array[1] = arra[1]
            } else if (Math.sin(angle) > 0 && Math.cos(angle) < 0) {//angle is inside the second quadrant
                angle = angle - (Math.PI / 2)
                array[0] = arra[0] - (Math.PI / 2)
                array[1] = arra[1] - (Math.PI / 2)
            } else if (Math.sin(angle) < 0 && Math.cos(angle) < 0) {// angle is in the third quadrant
                angle = angle - Math.PI
                array[0] = arra[0] - Math.PI
                array[1] = arra[1] - Math.PI

            } else if (Math.sin(angle) < 0 && Math.cos(angle) > 0) {//angle is in the fourth quadrant
                angle = angle - ((3 * Math.PI) / 2)
                array[0] = arra[0] - ((3 * Math.PI) / 2)
                array[1] = arra[1] - ((3 * Math.PI) / 2)
            }
            if (Math.sin(array[0]) > 0 && Math.cos(array[0]) > 0) {
                array1q = 1
            } else if (Math.sin(array[0]) > 0 && Math.cos(array[0]) < 0) {
                array1q = 2
            } else if (Math.sin(array[0]) < 0 && Math.cos(array[0]) < 0) {
                array1q = 3
            } else if (Math.sin(array[0]) < 0 && Math.cos(array[0]) > 0) {
                array1q = 4
            }
            if (Math.sin(array[1]) > 0 && Math.cos(array[1]) > 0) {
                array2q = 1
            } else if (Math.sin(array[1]) > 0 && Math.cos(array[1]) < 0) {
                array2q = 2
            } else if (Math.sin(array[1]) < 0 && Math.cos(array[1]) < 0) {
                array2q = 3
            } else if (Math.sin(array[1]) < 0 && Math.cos(array[1]) > 0) {
                array2q = 4
            }

            if (array1q == 1) {//lowest angle of the not allowed zone in the first quadrant

                if (Math.sin(angle) < Math.sin(array[0])) {//if the angle is lower than the not allowed zone (probably not in between)
                    if (array2q == 1) {// if the second part of the not allowed zone is in the first quadrant
                        if (Math.sin(angle) < Math.sin(array[2])) {//if it wraps completely around and makes it in between
                            return true
                        } else {//doesn't wrap around enough
                            return false
                        }
                    } else {//not in the first quadrant, not in between
                        return false
                    }
                } else {//if the angle is further than the not allowed zone
                    if (array2q == 1) {//if the second part of the not allowed zone is in the first quadrant
                        if (Math.sin(angle) < Math.sin(array[2])) {//if the angle is lower than the top limit (in between)

                            return true
                        } else {//is not in between
                            return false
                        }

                    } else {//its gonna be somewhere further so its in between
                        return true;
                    }
                }
            } else {
                if (array2q == 1) {//if the further part of the not allowed zone is in the first quadrant
                    if (Math.sin(angle) < Math.sin(array[1])) {//if it wraps all the way around
                        return true
                    } else {
                        return false
                    }
                } else {
                    if (array1q == 2) {//if lowest angle is in the second
                        if (array2q == 2) {
                            if (Math.sin(array[0]) < Math.sin(array[1])) {
                                return true
                            } else {
                                return false
                            }
                        } else {
                            return false
                        }
                    } else if (array1q == 3) {//if the first one is in the third
                        if (array1q > array2q) {
                            return true
                        } else if (array1q < array2q) {
                            return false
                        } else {
                            if (Math.sin(array[0]) < Math.sin(array[1])) {
                                return true
                            } else {
                                return false
                            }
                        }
                    } else if (array1q == 4) {//if the first one is in the third
                        if (array1q > array2q) {
                            return true
                        } else if (array1q < array2q) {
                            return false
                        } else {
                            if (Math.sin(array[0]) > Math.sin(array[1])) {
                                return true
                            } else {
                                return false
                            }
                        }
                    }
                }

            }

        }
    }
};
class Animtext {
    // ANIMATED TEXT:
    constructor() {
                    // INIT:
                    this.init = function(playerX, playerY, scale, speed, life, text, color) {
                        this.x = playerX;
                        this.y = playerY;
                        this.color = color;
                        this.scale = scale;
                        this.startScale = this.scale;
                        this.maxScale = scale * 1.2;
                        this.scaleSpeed = 0.7;
                        this.speed = speed;
                        this.life = life * 2;
                        this.text = text;
                        this.acc = 1;
                        this.alpha = 0;
                        this.maxLife = this.life;
                        this.ranX = 0;
                    };

                    this.update = function(delta) {
                        if (this.life > 0) {
                            this.life -= delta;
                            if (config.anotherVisual) {
                                this.y -= this.speed * delta * this.acc;
                                this.acc -= delta / (this.maxLife / 2.5);
                                if (this.life <= 200) {
                                    if (this.alpha > 0) {
                                        this.alpha = Math.max(0, this.alpha - (delta / 1000));
                                    }
                                } else {
                                    if (this.alpha < 1) {
                                        this.alpha = Math.min(1, this.alpha + (delta / 100));
                                    }
                                }
                            } else {
                                this.y -= this.speed * delta;
                            }

                            if (this.life > this.maxLife / 2) {
                                this.scale = this.startScale + (this.maxScale - this.startScale) * (1 - ((this.life - this.maxLife / 2) / (this.maxLife / 2)));
                            } else {
                                this.scale = this.maxScale - (this.maxScale - this.startScale) * (1 - (this.life / (this.maxLife / 2)));
                            }

                            if (this.life <= 0) {
                                this.life = 0;
                            }
                        }
                    };


// RENDER:
this.render = function(ctxt, xOff, yOff) {
    ctxt.save();
    ctxt.translate((this.x - xOff), this.y - yOff);
    ctxt.scale(1.05, 1);
    ctxt.lineWidth = 10;
    ctxt.font = this.scale + "Lora";


    const glowColor1 = 'rgba(255, 182, 193, 0.5)';
    const glowColor2 = 'rgba(173, 216, 230, 0.5)';
    const glowOffset = 3;

    if (config.anotherVisual) {
        ctxt.globalAlpha = this.alpha;
        ctxt.strokeStyle = darkOutlineColor;
        ctxt.strokeText(this.text, 0, 0);
    }


    ctxt.shadowColor = glowColor1;
    ctxt.shadowBlur = 10;
    ctxt.shadowOffsetX = glowOffset;
    ctxt.shadowOffsetY = glowOffset;
    ctxt.fillStyle = this.color;
    ctxt.fillText(this.text, 0, 0);


    ctxt.shadowColor = glowColor2;
    ctxt.shadowBlur = 10;
    ctxt.shadowOffsetX = glowOffset * -1;
    ctxt.shadowOffsetY = glowOffset * -1;
    ctxt.fillStyle = this.color;
    ctxt.fillText(this.text, 0, 0);

    ctxt.setTransform(1, 0, 0, 1, 0, 0);
    ctxt.globalAlpha = 1;
    ctxt.restore();
};

                }
            }

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

        // GET HIT:
        this.changeHealth = function(amount, doer) {
            this.health += amount;
            return (this.health <= 100);
        };

        // GET SCALE:
        this.getScale = function(sM, ig) {
            sM = sM || 1;
            return this.scale * ((this.isItem || this.type == 2 || this.type == 3 || this.type == 4) ? 1 : (0.6 * sM)) * (ig ? 1 : this.colDiv);
        };

        // VISIBLE TO PLAYER:
        this.visibleToPlayer = function(player) {
            return !(this.hideFromEnemy) || (this.owner && (this.owner == player || (this.owner.team && player.team == this.owner.team)));
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
    constructor(GameObject, liztobj, UTILS, config, players, server) {
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
            obj.active = false;
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
            let cantPlace = liztobj.find((tmp) => tmp.active && UTILS.getDistance(x, y, tmp.x, tmp.y) < s + (tmp.blocker ? tmp.blocker : tmp.getScale(sM, tmp.isItem)));
            if (cantPlace) return false;
            if (!ignoreWater && indx != 18 && y >= config.mapScale / 2 - config.riverWidth / 2 && y <= config.mapScale / 2 + config.riverWidth / 2) return false;
            return true;
        };
        this.customCheckItemLocation = (x, y, s, sM, indx, ignoreWater, placer, ignoreId, gameObjects, UTILS, config) => {
            let cantPlace = gameObjects.find(
                tmp =>
                tmp.active &&
                tmp.x !== ignoreId.x &&
                tmp.y !== ignoreId.y &&
                tmp.id !== ignoreId.id &&
                UTILS.getDistance(x, y, tmp.x, tmp.y) < s + (tmp.blocker ? tmp.blocker : tmp.getScale(sM, tmp.isItem))
            );

            if (cantPlace) return false;
            if (!ignoreWater && indx != 18 && y >= config.mapScale / 2 - config.riverWidth / 2 && y <= config.mapScale / 2 + config.riverWidth / 2) return false;

            return true;
        };

    }
}
class Projectile {
    constructor(players, ais, objectManager, items, config, UTILS, server) {

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

    // AI MANAGER:
    constructor(ais, AI, players, items, objectManager, config, UTILS, scoreCallback, server) {

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

        // SPAWN AI:
        this.spawn = function(x, y, dir, index) {
            let _ = ais.find((tmp) => !tmp.active);
            if (!_) {
                _ = new AI(ais.length, objectManager, players, items, UTILS, config, scoreCallback, server);
                ais.push(_);
            }
            _.init(x, y, dir, index, this.aiTypes[index]);
            return _;
        };
    }

};
class AI {
    constructor(sid, objectManager, players, items, UTILS, config, scoreCallback, server) {
        this.sid = sid;
        this.isAI = true;
        this.nameIndex = UTILS.randInt(0, config.cowNames.length - 1);

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

        // ANIMATION:
        this.startAnim = function() {
            this.animTime = this.animSpeed = 600;
            this.targetAngle = Math.PI * 0.8;
            tmpRatio = 0;
            animIndex = 0;
        };

    };

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
        // SPAWN:
        this.spawn = function(moofoll) {
            this.attacked = false;
            this.timeDamaged = 0;
            this.timeHealed = 100;
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

        // RESET MOVE DIR:
        this.resetMoveDir = function() {
            this.moveDir = undefined;
        };

        // RESET RESOURCES:
        this.resetResources = function(moofoll) {
            for (let i = 0; i < config.resourceTypes.length; ++i) {
                this[config.resourceTypes[i]] = moofoll ? 100 : 0;
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
                // MOVE:
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

        // GATHER ANIMATION:
        this.startAnim = function(didHit, index) {
            this.animTime = this.animSpeed = items.weapons[index].speed;
            this.targetAngle = (didHit ? -config.hitAngle : -Math.PI);
            tmpRatio = 0;
            animIndex = 0;
        };

        // CAN SEE:
        this.canSee = function(other) {
            if (!other) return false;
            let dx = Math.abs(other.x - this.x) - other.scale;
            let dy = Math.abs(other.y - this.y) - other.scale;
            return dx <= (config.maxScreenWidth / 2) * 1.3 && dy <= (config.maxScreenHeight / 2) * 1.3;
        };

        // SHAME SYSTEM:
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
            //preplacer
            if (this.reloads[this.weaponIndex] <= 1000/9) { //auto preplace
                // place(2, getAttackDir());
                let index = this.weaponIndex;
                let nearObja = liztobj.filter((e) => (e.active || e.alive) && e.health < e.maxHealth && e.group !== undefined && UTILS.getDist(e, player, 0, 2) <= (items.weapons[player.weaponIndex].range + e.scale));
                for(let i = 0; i < nearObja.length; i++) {
                    let aaa = nearObja[i];

                    let val = items.weapons[index].dmg * (config.weaponVariants[_[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1) * 3.3;
                    let valaa = items.weapons[index].dmg * (config.weaponVariants[_[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1);
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
                        // Math.max(0, this.reloads[this.weaponIndex] - game.tickRate)
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
            secondary.dmg = secondary.weapon == undefined ? 35 : items.weapons[secondary.weapon].Pdmg;
            let bull = 1.5;
            let pV = primary.variant != undefined ? config.weaponVariants[primary.variant].val : 1.18;
            let sV = secondary.variant != undefined ? [9, 12, 17, 15].includes(secondary.weapon) ? 1 : config.weaponVariants[secondary.variant].val : 1.18;
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
        // ANTI
        this.addDamageProbability = function(_) {
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
            let pV = primary.variant != undefined ? config.weaponVariants[primary.variant].val : 1.18;
            let sV = secondary.variant != undefined ? [9, 12, 17, 15].includes(secondary.weapon) ? 1 : config.weaponVariants[secondary.variant].val : 1.18;
            if (primary.weapon == undefined ? true : this.reloads[primary.weapon] == 0) {
                this.damageProbably += primary.dmg * pV * bull * 0.75;
            }
            if (secondary.weapon == undefined ? true : this.reloads[secondary.weapon] == 0) {
                this.damageProbably += secondary.dmg * sV;
            }
            this.damageProbably *= 0.75;
            if (!this.isTeam(_)) {
                if (this.dist2 <= 300) {
                    _.damageProbably += this.damageProbably;
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

function toRadian(angle) {
    let fixedAngle = (angle % 360) * (Math.PI / 180);
    return fixedAngle < 0 ? (2 * Math.PI + fixedAngle) : fixedAngle;
}
function sortFromSmallest(arr, func) { // dist - dist
    func = typeof func == "function" ? func : (obj) => {
        return obj
    };
    return arr.sort((two, one) => (func(two)) - func(one));
}
function getPlaceablePositions(user, item) {
    try {
        let angles = [];
        let possibleOnes = [];
        for (let angle = 0; angle < 72; angle++) {
            angles.push(toRadian(angle * 5));
        }
        let buildings_ = [];
        if (!window.isMohMoh) {
            buildings_ = sortFromSmallest(
                gameObjects.filter(
                    (t) => t.active && getDist(player, t) <= 150
                ),
                (a) => {
                    return getDist(player, a);
                }
            );
        }
        let last = null;
        for (let angle of angles) {
            let position = player.buildItemPosition(item, angle);
            let possibleToPlace = true;
            if (
                18 != item.id &&
                position.y >= config.mapScale / 2 - config.riverWidth / 2 &&
                position.y <= config.mapScale / 2 + config.riverWidth / 2
            ) {
                possibleToPlace = false;
            } else if (
                last &&
                getDist(last, position) <
                item.scale +
                (last.blocker
                 ? last.blocker
                 : last.getScale(0.6, last.isItem))
            ) {
                possibleToPlace = false;
            } else if (true) {
                for (let building of buildings_) {
                    let range = building.blocker
                    ? building.blocker
                    : building.getScale(0.6, building.isItem);
                    if (getDist(building, position) < item.scale + range) {
                        // overlap
                        possibleToPlace = false;
                        last = building;
                        break;
                    }
                }
            }
            if (possibleToPlace) {
                possibleOnes.push(angle);
            }
        }
        return possibleOnes;
    } catch (e) {
        //console.log(e);
    }
}







// PLACER:
function place(id, rad, rmd, color) {
    try {
        if (id == undefined) return;
        let item = items.list[player.items[id]];
        let tmpS = player.scale + item.scale + (item.placeOffset || 0);
        let tmpX = player.x2 + tmpS * Math.cos(rad);
        let tmpY = player.y2 + tmpS * Math.sin(rad);
        if ((player.alive && inGame && player.itemCounts[item.group.id] == undefined ? true : player.itemCounts[item.group.id] < (config.isSandbox ? 299 : item.group.limit ? item.group.limit : 96))) {
            selectToBuild(player.items[id]);
            sendAtck(1, rad);
            selectWeapon(player.weaponCode, 1);
            if (rmd && getEl("placeVis").checked) {
                placeVisible.push({
                    x: tmpX,
                    y: tmpY,
                    name: item.name,
                    scale: item.scale,
                    dir: rad,
                    color: color || 0,
                });
                game.tickBase(() => {
                    placeVisible.shift();
                }, 1)
            }
        }
    } catch (e) {}
}

function checkPlace(id, rad, omgs) {
    try {
        if (id == undefined) return;
        let item = items.list[player.items[id]];
        let tmpS = player.scale + item.scale + (item.placeOffset || 0);
        let tmpX = player.x2 + tmpS * Math.cos(rad);
        let tmpY = player.y2 + tmpS * Math.sin(rad);
        if (objectManager.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player)) {
            place(id, rad, (omgs || 0));
        }
    } catch (e) {}
}


function manageAngles(angles) {
    let allAngles = []
    for (let i = 0; i < angles.length; i++) {
        if (angles[i].length) {
            if (!allAngles.length) {
                allAngles.push(angles[i])
            } else {
                let used = false
                for (let j = 0; j < allAngles.length; j++) {
                    if (UTILS.inBetween(angles[i][0], allAngles[j])) {
                        used = true
                        if (UTILS.inBetween(angles[i][1], allAngles[j])) {
                            allAngles[j].push(angles[i][2])
                        } else {
                            allAngles[j][1] = angles[i][1]
                            allAngles[j].push(angles[i][2])
                        }
                    } else if (UTILS.inBetween(angles[i][1], allAngles[j])) {
                        used = true
                        allAngles[j][0] = angles[i][0]
                        allAngles[j].push(angles[i][2])
                    }
                }
                if (!used) {
                    allAngles.push(angles[i])
                }
            }
        }
    }
    return allAngles;
}



function secondaryCheck(id, radian) {
    let player = player;
    var item = items.list[id];
    var tmpS = player.scale + item.scale + (item.placeOffset || 0);
    var tmpX = player.x2 + tmpS * Math.cos(radian);
    var tmpY = player.y2 + tmpS * Math.sin(radian);
    if (objectManager.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player)) {
        if (player.itemCounts[item.group.id] == undefined ? true : player.itemCounts[item.group.id] < (id == player.items[3] || id == player.items[5] ? 299 : item.group.limit ? 99 : 99)) {
            return true;
        }
    }
}
function makeAngles(building, type) {
    let buildings = building.filter(obj => UTILS.getdist(player, obj, 2, 0) < player.scale + items.list[type].scale + obj.scale + 50);

    for (const object of buildings) {
        const index = buildings.indexOf(object);
        const dist = UTILS.getdist(player, object, 2);
        const distE = UTILS.getdist(near, object, 2);
        const maxPlaceRange = player.scale + 45; //trap.getscale
        if (IWR.unsafeGameObjects.near350.includes(object)) {
            if (distE <= maxPlaceRange && dist <= maxPlaceRange) {
                buildings.splice(index, 1);
            }
        }
    }

    let allAngles = []
    let offset = player.scale + items.list[type].scale + (items.list[type].placeOffset || 0)
    for (let i = 0; i < buildings.length; i++) {

        let scale
        if (!buildings[i].isItem) {
            if ((buildings[i].scale != 80 && buildings[i].scale != 85 && buildings[i].scale != 90 || buildings[i].type == 1)) {
                scale = buildings[i].scale * 0.40

            } else {
                scale = buildings[i].scale
            }
        } else {
            scale = buildings[i].scale
        }
        let angles = []
        let dist = (items.list[type].scale + scale + 1)
        let dPTB = UTILS.getdist(player, buildings[i], 2)
        let cosLaw
        if (dPTB > dist + offset) {
            cosLaw = Math.acos(((Math.pow(offset, 2) + Math.pow(dist, 2)) - Math.pow(dPTB, 2)) / (2 * dist * offset))
            cosLaw = Math.asin((dist * Math.sin(cosLaw)) / dPTB)
        } else {
            cosLaw = Math.acos(((Math.pow(offset, 2) + Math.pow(dPTB, 2)) - Math.pow(dist, 2)) / (2 * dPTB * offset))
        }
        let aPTB = UTILS.getangle(buildings[i], player, 0, 2);
        let ang1 = (aPTB - cosLaw)
        let ang2 = (aPTB + cosLaw)
        if (!isNaN(cosLaw)) {
            angles.push(ang1)
            angles.push(ang2)
            angles.push(buildings[i])
        }
        allAngles.push(angles)
    }

    for (let i = 0; i < allAngles.length * 4; i++) {
        allAngles = manageAngles(allAngles)

    }
    if (!allAngles.length) {
        allAngles = [0, 0.0001]
    }
    for (let i = 0; i < allAngles.length; i++) {
        if (allAngles != false) {
            if (!secondaryCheck(type, allAngles[i][0]) || !secondaryCheck(type, allAngles[i][1])) {
                allAngles = false
            }
        }
    }
    return allAngles
}




            // HEALING:
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
function getMaxPot() {
    let dmg = 0;
    enemy.forEach(tmp => {
        if (getDist(player, tmp) - 63 <= items.weapons[tmp.weapons[0]].range) {
            dmg += player.checkCanInsta(false);
        }
    });
    return dmg;
}
function instaheal(e, t) {
    let foodType = (player.items[0] == 0 ? 20 : player.items[0] == 1 ? 40 : 30)
    let times = (e == "max" ? (100-player.health)/foodType : e == (null || undefined) ? 1 : e);
    for(let i = 0; i < times; i++) {
        place(0, getAttackDir());
    }
}
function fastHealing(speed) {
    let value = player.health;
    let damaged
    let attackers = getAttacker(damaged);
    let gearDmgs = [0.25, 0.45].map((val) => val * items.weapons[player.weapons[0]].dmg * soldierMult());
    let includeSpikeDmgs = !my.reSync && gearDmgs.includes(damaged);
    let maxPotential = getMaxPot();
    let canAntiHeal = false;


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
                    if (canAntiHeal == true && value <= 80 && near.checkCanInsta(true) >= 100) {
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
    }, speed);
}
            function soldierMult() {
                return player.latestSkin == 6 ? 0.75 : 1;
            }
            function heal() {
                if (player.health === 100) {
                    return;
                }
                if (player.skinIndex !== 70 && player.skinIndex !== 75) {
                    let value = Math.ceil(100 / items.list[player.items[0]].healing);
                    if (player.health === 58.75 && player.skinIndex === 6) {
                        value = 1;
                    }
                    for (let i = 0; i < value; i++) {
                        place(0, getAttackDir());
                    }
                }
            }
            function healOnResourceGain() {
                if (player.wood > player.woodLast || player.stone > player.stoneLast || player.food > player.foodLast) {
                    place(0, getAttackDir());
                }
            }
            function findAllianceBySid(sid) {
                return player.team ? alliancePlayers.find((THIS) => THIS === sid) : null;
            }
            function healOnEnemySight() {
                if (enemy.length > 0) {
                    place(0, getAttackDir());
                }
            }
            function healOnLowHealth() {
                if (player.health < 50) {
                    place(0, getAttackDir());
                }
            }
            function healOnNoWeapon() {
                if (player.items[0] === 0) {
                    place(0, getAttackDir());
                }
            }
            function healOnLevelUp() {
                if (player.level > player.levelLast) {
                    place(0, getAttackDir());
                }
            }
            function getNearestEnemyDistance() {
                let nearestEnemy = enemy.reduce((nearest, current) => {
                    return nearest.dist < current.dist ? nearest : current;
                });
                return nearestEnemy.dist;
            }
            function isBeingAttackedBy(attackerId) {
                let attackers = enemy.filter(tmp => tmp.id === attackerId && tmp.attacked);
                return attackers.length > 0;
            }
            function healOverTime() {
                if (player.health < 100) {
                    place(0, getAttackDir());
                }
            }
            function smartHeal() {
                if (player.score > 10000) {
                    if (player.health < 90) {
                        place(0, getAttackDir());
                    }
                } else {
                    if (player.health < 70) {
                        place(0, getAttackDir());
                    }
                }
            }
            function panicHeal() {
                if (player.health < 50) {
                    for (let i = 0; i < 10; i++) {
                        place(0, getAttackDir());
                    }
                }
            }
            function arenaHeal() {
                if (player.zone === 'arena') {
                    if (player.health < 90) {
                        place(0, getAttackDir());
                    }
                }
            }
            function defensiveHeal() {
                if (player.latestDamage > 0 && player.health < 100) {
                    place(0, getAttackDir());
                }
            }
            function healPlayer() {
                if (shouldHeal()) {
                    place(0, getAttackDir());
                }
            }
            function shouldHeal() {
                if (player.health === 100) {
                    return false;
                }
                if (isBeingAttackedBy(getAttacker(player.latestDamage).id)) {
                    return true;
                }
                if (getNearestEnemyDistance() < 500) {
                    return true;
                }
                return false;
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
                    return /*rule.one && rule.two && */rule.three;
                });
                return attackers;
            }
            function healer(extra) {
                if ([0, undefined].includes(extra)) {
                    for (let i = 0; i < healthBased(); i++) {
                        place(0, getAttackDir());
                    }
                } else {
                    for (let i = 0; i < healthBased() + extra; i++) {
                        place(0, getAttackDir());
                    }
                }
            }
            let resourceGainHealCooldown = false;
            function healOnResourceGainAdvanced() {
                if (player.wood > player.woodLast || player.stone > player.stoneLast || player.food > player.foodLast) {
                    if (!resourceGainHealCooldown) {
                        place(0, getAttackDir());
                        resourceGainHealCooldown = true;
                        setTimeout(() => {
                            resourceGainHealCooldown = false;
                        }, 1000);
                    }
                }
            }
            // GLOBAL VARIABLES
            let lastPlayerCount = 0;
            let lastZone = "";
            // FUNCTIONS
            function playerCountFunction() {
                return Object.keys(players).length;
            }
            function healOnPlayerJoin() {
                if (playerCountFunction() > lastPlayerCount) {
                    place(0, getAttackDir());
                }
                lastPlayerCount = playerCountFunction();
            }
            function healOnAreaChange() {
                if (player.zone !== lastZone) {
                    place(0, getAttackDir());
                }
                lastZone = player.zone;
            }
            // GAME TICK
            function gameTick() {
                healOnPlayerJoin();
                healOnAreaChange();
            }
            function healOnWin() {
                if (player.wins > player.winsLast) {
                    place(0, getAttackDir());
                }
            }
            function healOnHealingItemPickup() {
                let healingItems = [101, 102, 103, 104];
                if (healingItems.includes(player.items[0])) {
                    place(0, getAttackDir());
                }
            }
            function healOnFlagCapture() {
                if (player.flagCaptures > player.flagCapturesLast) {
                    place(0, getAttackDir());
                }
            }
            // ADVANCED:
            function applCxC(value) {
                if (player.health == 100) {
                    return 0;
                }
                if (player.skinIndex != 45 && player.skinIndex != 56) {
                    return Math.ceil(value / items.list[player.items[0]].healing);
                }
                return 0;
            }
            function healthBased() {
                if (player.health == 100) {
                    return 0;
                }
                if (player.skinIndex != 45 && player.skinIndex != 56) {
                    return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
                }
                return 0;
            }
            function calcDmg(value) {
                return value * player.skinIndex == 6 ? 0.75 : 1;
            }
            function antirev() {
                if (_.isPlayer){
                    for (let i = 0; i < healthBased(); i++) {
                        place(0, getAttackDir());
                        if (player.health == 55 && player.shameCount < 6 && player.skinIndex == 6) {
                            place(0, getAttackDir());
                            notif("antirev");
                        } else if (player.health == 40 && player.shameCount < 6 && player.skinIndex != 6){
                            place(0, getAttackDir());
                            notif("antirev");
                        } else if (player.health == 43.75 && player.shameCount < 5 && player.skinIndex == 6){
                            place(0, getAttackDir());
                            setTimeout(()=>{
                                place(0, getAttackDir());
                            },5)
                        } else if(player.health == 25 && player.shameCount < 4 && player.skinIndex == 6){
                            place(0, getAttackDir());
                            setTimeout(()=>{
                                place(0, getAttackDir());
                            },5)
                        } else if (player.health == 58.75 && player.shameCount < 6 && player.skinIndex == 6){
                            place(0, getAttackDir());
                            setTimeout(()=>{
                                place(0, getAttackDir());
                            },5)
                        } else if (player.health == 45 && player.shameCount < 6 && player.skinIndex != 6){
                            place(0, getAttackDir());
                            setTimeout(()=>{
                                place(0, getAttackDir());
                            },5)
                        }
                        if (player.shameCount < 6) {
                            setTimeout(()=>{
                                place(0, getAttackDir());
                            },30)
                        }
                    }
                }
            }
            let slowHeal = function(timer) {
                setTimeout(() => {
                    healer();
                }, 25);
            }
            let isHealing = false;
            let delay = 20;
            function Staryheal() {
                if (!isHealing && player.health < 100) {
                    isHealing = true;
                    if (player.health < 95) {
                        place(0, getAttackDir());
                        healer();// fast heal
                        isHealing = false;
                    } else {
                        const healingDelay = 5;
                        const healingIterations = Math.ceil((100 - player.health) / 10); // making it have delay so it wont packet spam
                        let iterationCount = 0;
                        function performHealing() {
                            if (iterationCount < healingIterations) {
                                setTimeout(() => {
                                    place(0, getAttackDir()); // slow heal
                                    iterationCount++;
                                    performHealing();
                                }, healingDelay);
                            } else {
                                isHealing = false;
                            }
                        }
                        performHealing();
                    }
                }
            }

function toRad(a) {
    return a * (Math.PI / 180);
}
function calcPoint(x, y, angle, dist) {
    x = x + dist * Math.cos(angle);
    y = y + dist * Math.sin(angle);

    return {x: x, y: y};
}


var Pathfinders = [];
function stopPathfinders() {
    Pathfinders.forEach(pf => pf.clear());
}
class Pathfinder {
    constructor(Opt = {}) {
        let target = Opt.target;
        let x = Opt.x;
        let y = Opt.y


        stopPathfinders();
        Pathfinders.push(this);
        this.started = false;
        this.x = x;
        this.y = y;
        this.target = target;
        this.active = false;
        this.elements = [];
        this.intervalId = null;
        this.loopId = null;
        this.nearestGridElement = null;
        this.followX = this.x;
        this.followY = this.y;
        this.creatingGrid = false;
        this.createGrid();
        this.start();
    }
    startLoop() {


        clearInterval(this.loopId);
        this.loopId = setInterval(()=>{
            if(!player) return;
            let nearest = this.nearestGridElement;
            if(nearest && this.active) {
                packet("a", toRad(nearest.dir), 1);
            }
            if(this.creatingGrid) return;
            if(this.target) {
                this.x = this.target.x;
                this.y = this.target.y;
            }
            this.createGrid();
        },100)
    }
    stopLoop() {
        clearInterval(this.loopId);
    }
    setNearestGridElement() {
        let nearest = {x: 1e10, y: 1e10, ignore: true};
        this.elements.forEach(ge => {
            if(getDistance(player.x, player.y, ge.x, ge.y) < getDistance(player.x, player.y, nearest.x, nearest.y)) nearest = ge;
        });
        this.nearestGridElement = nearest.ignore ? null : nearest;
    }
    start() {
        this.startLoop();
        this.active = true;
    }
    pause() {
        this.active = !this.active;
        clearInterval(this.intervalId);
        if(this.active) {
            this.start();
        } else {
            this.stop();
        }
        packet("a", lastMoveDir || undefined, 1);
    }
    stop() {
        this.stopLoop();

        this.active = false;
        clearInterval(this.intervalId);
        packet("a", lastMoveDir || undefined, 1);
    }
    clear() {
        this.stop();
        this.elements = [];
    }

    async createGrid() {
        this.creatingGrid = true;

        let gridSize = this.gridSize || {};
        gridSize.distance = gridSize?.distance ?? 60;
        gridSize.maxElements = gridSize.maxElements ?? 140;

        let buildList = gameObjects.filter(obj => {
            let ignoreObj = (obj.ignoreCollision && obj.id !== 16 && obj.id !== 22) || (obj.id === 15 && obj.friendly);
            return !ignoreObj;
        });

        this.elements = [new GridElement(this.x, this.y, 0)];

        let again = true;
        while(again) {
            let count = 0;
            this.elements.forEach(ge=>{
                if(ge.filled) return;
                for(let i = 0; i < 4; i++) {
                    let point = calcPoint(ge.x, ge.y, toRad(i * 90), -gridSize.distance);

                    let objectTooNear;
                    let gridElementTooNear;

                    for(let e in this.elements) {
                        if(UTILS.getDistance(this.elements[e].x, this.elements[e].y, point.x, point.y) < 2) {
                            gridElementTooNear = true;
                            break;
                        }
                    }

                    if(!gridElementTooNear) for(let o in buildList) {
                        let ob = buildList[o];
                        if(ob.active && ob.scale && UTILS.getDistance(ob.x, ob.y, point.x, point.y) < ob.scale + player.scale) {
                            objectTooNear = true;
                            break;
                        }
                    }
                    if(this.elements.length > gridSize.maxElements) again = false;

                    if(!gridElementTooNear && !objectTooNear) {
                        this.elements.push(new GridElement(point.x, point.y, i * 90))
                    }
                    count++;
                    if(UTILS.getDistance(point.x, point.y, player.x, player.y) < gridSize.distance) {
                        again = false;
                        //if(!this.started) this.start();
                        //this.started = true;
                    }
                }
                ge.filled = true;
                if(count == 0) again = false;
            });
        }
        this.setNearestGridElement();
        this.creatingGrid = false;

        /*setTimeout(()=>{
                            if(this.active) this.createGrid()
                        },200);*/
    }
}
window.Pathfinder = Pathfinder;
class GridElement {
    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.active = true;
        this.filled = false;
    }
}


function isPositionValid(position) {
    const playerX = player.x2;
    const playerY = player.y2;
    const distToPosition = Math.hypot(position[0] - playerX, position[1] - playerY);
    return distToPosition > 35;
}
function calculatePossibleTrapPositions(x, y, radius) {
    const trapPositions = [];
    const numPositions = 16;
    for (let i = 0; i < numPositions; i++) {
        const angle = (2 * Math.PI * i) / numPositions;
        const offsetX = x + radius * Math.cos(angle);
        const offsetY = y + radius * Math.sin(angle);
        const position = [offsetX, offsetY];
        if (!trapPositions.some((pos) => isPositionTooClose(position, pos))) {
            trapPositions.push(position);
        }
    }
    return trapPositions;
}
function isPositionTooClose(position1, position2, minDistance = 50) {
    const dist = Math.hypot(position1[0] - position2[0], position1[1] - position2[1]);
    return dist < minDistance;
}
function biomeGear(mover, returns) {
    if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
        if (returns) return 31;
        buyEquip(31, 0);
    } else {
        if (player.y2 <= config.snowBiomeTop) {
            if (returns) return mover && player.moveDir == undefined ? 22 : 15;
            buyEquip(mover && player.moveDir == undefined ? 22 : 15, 0);
        } else {
            if (returns) return mover && player.moveDir == undefined ? 22 : 12;
            buyEquip(mover && player.moveDir == undefined ? 22 : 12, 0);
        }
    }
    if (returns) return 0;
}
let advHeal = [];
function woah(mover) {
    buyEquip(mover && player.moveDir == undefined ? 0 : 11, 1);
}
function getPossibleObjDmg(user) {
    return (items.weapons[user.weapons[user.weapons[1] ? Number(user.weapons[1] == 10) : 0]].dmg / 4) * (player.skins[40] ? 3.3 : 1) * (items.weapons[user.weapons[Number(user.weapons[1] == 10)]].sDmg || 1);
}

let doStuffPingSet = [];

function smartTick(tick) {
    doStuffPingSet.push(tick);
}

class Traps {
    constructor(UTILS, items) {
        this.dist = 0;
        this.aim = 0;
        this.inTrap = false;
        this.replaced = false;
        this.antiTrapped = false;
        this.info = {};

        this.latestHitObj = [];
        this.latestHitPlayer = [];


        this.notFast = function() {
            return player.weapons[1] == 10 && ((this.info.health > items.weapons[player.weapons[0]].dmg) || player.weapons[0] == 5);
        }
        this.testCanPlace = function (id, first = -(Math.PI / 2), repeat = (Math.PI / 2), plus = (Math.PI / 18), radian, replacer, yaboi) {
            try {
                let item = items.list[player.items[id]];
                let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                let counts = {
                    attempts: 0,
                    placed: 0
                };
                let tmpObjects = [];
                gameObjects.forEach((p) => {
                    tmpObjects.push({
                        x: p.x,
                        y: p.y,
                        active: p.active,
                        blocker: p.blocker,
                        scale: p.scale,
                        isItem: p.isItem,
                        type: p.type,
                        colDiv: p.colDiv,
                        getScale: function(sM, ig) {
                            sM = sM||1;
                            return this.scale * ((this.isItem||this.type==2||this.type==3||this.type==4)?1:(0.6*sM)) * (ig?1:this.colDiv);
                        },
                    });
                });
                for (let i = first; i < repeat; i += plus) {
                    counts.attempts++;
                    let relAim = radian + i;
                    let tmpX = player.x2 + tmpS * Math.cos(relAim);
                    let tmpY = player.y2 + tmpS * Math.sin(relAim);
                    let cantPlace = tmpObjects.find((tmp) => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                    if (cantPlace) continue;
                    if (item.id != 18 && tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) continue;
                    if ((!replacer && yaboi) || useWasd) {
                        if (useWasd ? false : yaboi.inTrap) {
                            if (UTILS.getAngleDist(near.aim2 + Math.PI, relAim + Math.PI) <= Math.PI) {
                                place(2, relAim, 1);
                            } else {
                                player.items[4] == 15 && place(4, relAim, 1);
                            }
                        } else {
                            if (UTILS.getAngleDist(near.aim2, relAim) <= config.gatherAngle / 1.5) {
                                place(2, relAim, 1);
                            } else {
                                player.items[4] == 15 && place(4, relAim, 1);
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
                        },
                    });
                    if (UTILS.getAngleDist(near.aim2, relAim) <= 1) {
                        counts.placed++;
                    }
                }
                if (counts.placed > 0 && replacer && item.dmg && configs.spikeTick) {
                    let fulls = (player.skins[7] && player.skins[53] && player.reloads[53]);
                    if (near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8) && player.reloads[player.weapons[0]] == 0 && fulls) {
                        instaC.canSpikeTick = true;
                        instaC.syncHit = true;
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
                    for (let i = -1; i <= 1; i += 1/10) {
                        counts.attempts++;
                        let relAim = UTILS.getDirect(player, near, 2, 2) + i;
                        let tmpX = near.x2 + tmpS * Math.cos(relAim);
                        let tmpY = near.y2 + tmpS * Math.sin(relAim);
                        let cantPlace = gameObjects.find((tmp) => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
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
                return null;
            }
            return false;
        }
        this.protect = function(aim) {
            if (!configs.antiTrap) return;
            if (player.items[4]) {
                this.testCanPlace(2, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), aim + Math.PI);
                this.antiTrapped = true;
            }
        };


        function predictEnemyPosition(enemyPositions, time = 1) {
            const lastKnownPosition = enemyPositions[enemyPositions.length - 1];

            const predictedPosition = {
                x: lastKnownPosition.x + lastKnownPosition.xVel * time,
                y: lastKnownPosition.y + lastKnownPosition.yVel * time
            };

            return predictedPosition;
        }


        this.autoPlace = function() {
            if (enemy.length && configs.autoPlace && !instaC.ticking) {
                if (game.tick % (Math.max(1, parseInt(getEl("autoPlaceTick").value)) || 1) === 0) {
                    if (gameObjects.length) {
                        let near2 = {
                            inTrap: false,
                        };
                        let nearTrap = gameObjects.filter(e => e.trap && e.active && e.isTeamObject(player) && UTILS.getDist(e, near, 0, 2) <= (near.scale + e.getScale() + 5)).sort(function(a, b) {
                            return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                        })[0];
                        if (nearTrap) {
                            near2.inTrap = true;
                        } else {
                            near2.inTrap = false;
                        }
                        let trapAim = nearTrap ? UTILS.getDirect(nearTrap, player, 0, 2) : near.aim2;
                        if (near.dist2 <= 450) {
                            if (near.dist2 < 150) {
                                //if (near.dist2 < 135 || (near.dist2 < 135 && near2.inTrap)) {
                                this.testCanPlace(2, trapAim - Math.PI / 2, (trapAim + Math.PI + Math.PI / 6), (Math.PI / 24), near.aim2, 1);
                            } else {
                                player.items[4] == 15 && this.testCanPlace(4, near.aim2 - Math.PI / 2, (12 * Math.PI), (Math.PI / 24), near.aim2);
                            }
                        }
                    } else {
                        if (near.dist2 <= 450) {
                            player.items[4] == 15 && this.testCanPlace(4, near.aim2 - Math.PI / 2, (12 * Math.PI), (Math.PI / 24), near.aim2);
                        }
                    }
                }
            }
        };
        // PREPLACER

        this.preplacer = function () {
            if (traps.inTrap) {
                return;
            }
            if (!configs.autoPrePlace) {
                return;
            }
            const weaponRange = items.weapons[player.weaponIndex].range + 70;
            const rangeSquared = weaponRange ** 2;
            const { x2: playerX, y2: playerY } = player;
            const lowHealthGameObjects = gameObjects.filter((gameObject) => {
                const { x2, y2, buildHealth } = gameObject;
                const distSquared = (x2 - playerX) ** 2 + (y2 - playerY) ** 2;
                return near && buildHealth <= 272.58 && distSquared <= rangeSquared;
            });
            if (lowHealthGameObjects.length > 0) {
                const { x2, y2 } = lowHealthGameObjects[0];
                const objAim = UTILS.getDirect(
                    {
                        x2,
                        y2,
                    },
                    player,
                    0,
                    2
                );
                let enemyVelocity = Math.sqrt(
                    near.xVel * near.xVel + near.yVel * near.yVel
                );
                let enemyDirection = Math.atan2(near.yVel, near.xVel);
                let bestAngle = null;
                let bestDistance = Infinity;
                for (let i = 0; i < 360; i += 30) {
                    let simulatedAngle = UTILS.deg2rad(i);
                    let distance =
                        UTILS.getDist(near, player, 0, 2) +
                        enemyVelocity * Math.sin(enemyDirection) +
                        70;
                    if (distance < bestDistance) {
                        bestDistance = distance;
                        bestAngle = simulatedAngle;
                    }
                }
                const timeToBreak =
                      (lowHealthGameObjects[0].buildHealth - player.damage) /
                      (player.damagePerShot - lowHealthGameObjects[0].absorb);
                const enemyTimeToMoveOut = bestDistance / enemyVelocity;
                if (timeToBreak + 5 <= enemyTimeToMoveOut) {
                    this.testCanPlace(
                        4,
                        bestAngle,
                        bestAngle + Math.PI * 2,
                        Math.PI / 24,
                        objAim,
                        70
                    );
                }
            }
        };
                            let spikePlaced;
        let spikSync;
        this.nearTrap = function () {
            return gameObjects.filter(
                (object) =>
                object.trap &&
                object.active &&
                UTILS.getDist(object, player, 0, 2) <=
                player.scale + object.getScale() + 5
            );
        };

        this.isEnemyInTrap = function (enemy) {
            let nearTraps = this.nearTrap();
            return nearTraps.some(
                (trap) =>
                UTILS.getDist(trap, enemy, 0, 2) <= trap.getScale() + near.scale
            );
        };

        this.replacer = function (findObj) {
            if (!findObj || !configs.autoReplace || !inGame || this.antiTrapped) return;
            game.tickBase(() => {
                let objAim = UTILS.getDirect(findObj, player, 0, 2);
                let objDst = UTILS.getDist(findObj, player, 0, 2);
                const canPlaceCondition = [4, 5].includes(player.weapons[0]) && near.dist2 <= items.weapons[near.primaryIndex || 5].range + (player.scale * 1.5) && player.reloads[player.weapons[0]] == 0;
                if (getEl("weaponGrind").checked && objDst <= items.weapons[player.weaponIndex].range + player.scale) return;
                if (objDst <= 400 && near.dist2 <= 400) {
                    if (canPlaceCondition) {
                        if (getEl("replaceType").value == "trap") {
                            this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), objAim, 1);
                        } else if (getEl("replaceType").value == "spike") {
                            this.testCanPlace(2, -Math.PI/4, Math.PI/4, (Math.PI / 20), near.aim2, 1);
                            this.testCanPlace(2, objAim, 1);
                            instaC.canSpikeTick = true;
                        }
                    } else {
                        if (getEl("replaceType").value == "trap") {
                            this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), objAim, 1);
                        } else if (getEl("replaceType").value == "spike") {
                            this.testCanPlace(2, -Math.PI/4, Math.PI/4, (Math.PI / 20), near.aim2, 1);
                            this.testCanPlace(2, objAim, 1);
                        }
                    }
                    this.replaced = true;
                }
            }, 1);
        }

         this.replacer1 = function(findObj) {
                        if (!findObj || !configs.autoReplace) return;
                        if (!inGame) return;
                        if (this.antiTrapped) return;
                        game.tickBase(() => {
                            let objAim = UTILS.getDirect(findObj, player, 0, 2);
                            let objDst = UTILS.getDist(findObj, player, 0, 2);
                            if (configs.autoGrind && objDst <= items.weapons[player.weaponIndex].range + player.scale) return;
                            if (objDst <= 400 && near.dist2 <= 400) {
                                let danger = this.checkSpikeTick();
                                if (!danger && near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                                    //this.testCanPlace(2, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), objAim, 1);
                                    this.testCanPlace(2, 0, (Math.PI * 2), (Math.PI / 24), objAim, 1);
                                } else {
                                    player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), objAim, 1);
                                }
                                this.replaced = true;
                }
            }, 1);
        }
                    function calculatePerfectAngle(x1, y1, x2, y2) {
                        return Math.atan2(y2 - y1, x2 - x1);
                    }


                    this.replacer = function(findObj) {
            if (!findObj || !configs.autoReplace) return;
            if (!inGame) return;
            if (this.antiTrapped) return;
            game.tickBase(() => {
                let objAim = UTILS.getDirect(findObj, player, 0, 2);
                let objDst = UTILS.getDist(findObj, player, 0, 2);
                if (getEl("weaponGrind").checked && objDst <= items.weapons[player.weaponIndex].range + player.scale) return;

                if(spikePlaced){
                player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), objAim, 1);
                spikePlaced = false;
                }
                if (near.dist2 <= 250 && !spikSync) {
                    for (let i = 0; i < 24; i++) {
                    let angle = (Math.PI * 2) * i / 24;
                    this.testCanPlace(2, angle, angle + (Math.PI / 24), (Math.PI / 24), objAim, 1);
                    spikePlaced = true;
                    }
                }
                if (objDst <= 250 && near.dist2 <= 250) {
                    let danger = this.checkSpikeTick();
                    if (!danger && near.dist3 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {

                    this.testCanPlace(2, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), objAim, 1)
                    for (let i = 0; i < 24; i++) {
                    let angle = (Math.PI * 2) * i / 24;
                    this.testCanPlace(2, angle, angle + (Math.PI / 24), (Math.PI / 24), objAim, 1);
                    this.testCanPlace(2, (Math.PI / 2), (Math.PI / 2), (Math.PI / 2), near, objAim, 1)
                    spikSync = true;

                    }
                    } else {
                        player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), objAim, 1);
                    }

                    this.replaced = true;
                }
            }, 1);
        };
    }
};
function calculatePerfectAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}
this.replacer = function(findObj) {
    if (!findObj || !configs.autoReplace) return;
    if (!inGame) return;
    if (this.antiTrapped) return;
    game.tickBase(() => {
        if (this.replaced) return;
        let objAim = UTILS.getDirect(findObj, player, 0, 2);
        let objDst = UTILS.getDist(findObj, player, 0, 2);
        if (objDst > player.scale * 2) return;
        let perfectAngle = Math.round(calculatePerfectAngle(findObj.x, findObj.y, player.x, player.y) / (Math.PI / 2)) * (Math.PI / 2);
        let canPlaceCondition = [4, 5].includes(player.weapons[0]) && near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.2) && player.reloads[player.weapons[0]] == 0;
        if (getEl("weaponGrind").checked && objDst <= items.weapons[player.weaponIndex].range + player.scale) return;
        let danger = this.checkSpikeTick();
        if (objDst <= 300) {
            if (near.dist2 <= 70 && canPlaceCondition && configs.spikeTick) {
                this.testCanPlace(2, -Math.PI/4, Math.PI/4, (Math.PI / 20), near.aim2, 1);
                this.testCanPlace(4, -Math.PI/4, Math.PI/4, Math.PI/12, near.aim2+Math.PI, 1)
            } else if (!danger && near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                this.testCanPlace(2, 0, (Math.PI * 2), (Math.PI / 24), perfectAngle , 1);
            } else {
                if (player.items[4] == 15) {
                    this.testCanPlace(near.dist2 > 250 ? 4 : 2, 0, (Math.PI * 2), (Math.PI / 24), perfectAngle , 1);
                }
                this.replaced = true;
            }
        }
    }, 1);
};

/*

this.replacer = function(findObj) {

            let inTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 5)).sort(function(a, b) {
                return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
            })[0];


            if (enemy.length) {

                let brokenObject = findObjectBySid(findObj);
                let buildings = gameObjects.filter(object => UTILS.getdist(object, player, 0, 2) <= 300);

                if (UTILS.getdist(brokenObject, player, 0, 2) > 85) return;

                const direction = UTILS.getangle(brokenObject, player, 0, 2);
                if (inTrap && !buildings.includes(brokenObject)) {
                    buildings.splice(buildings.indexOf(brokenObject), 1);
                    let spikeAngles = makeAngles(buildings, player.items[2]);
                    if (!spikeAngles.length) return;


                    let trapFound = false;
                    let nearestAngle = undefined;
                    for (let i = 0; i < spikeAngles.length; i++) {
                        if (!trapFound) {
                            for (let j = 2; j < spikeAngles[i].length; j++) {
                                nearestAngle = ((spikeAngles[i][0] - direction) < (spikeAngles[i][1] - direction) ? spikeAngles[i][0] : spikeAngles[i][1]);
                                let tmpO = UTILS.getPosFromAngle(player.items[2], nearestAngle)

                                if (UTILS.getdist(tmpO, inTrap) > inTrap.scale + tmpO.scale) {
                                    trapFound = true;
                                }
                            }
                        }
                    }


                    if (trapFound) {
                        place(2, nearestAngle, 1);
                      //addMenuChText('Debug', `Placed spike ${nearestAngle.toFixed(3)}`, "lightgreen", 1);
                    } else {
                        place(player.items[4] ? 4 : 2, UTILS.getangle(player, brokenObject), 1)
                    }
                } else {
                    let primaryDamage = items.weapons[player.weapons[0]].dmg * 1.5;
                    let soldierHealth = near.health * (near.skinIndex === 6 ? 1.25 : 1);

                    let dmg = items.list[player.items[2]].dmg;

                    if (dmg + primaryDamage >= soldierHealth) {
                        //already good, meaning you have katana or polearm and they dont have soldier
                        //spike sync now
                    } else {
                        let spikes = gameObjects.filter(e => e.dmg && e.active && e.isTeamObject(player) && UTILS.getDist(e, player, 0, 2) < 230);
                        let totalDamage = 0;
                        if (spikes.length) for (let i = spikes.length; i--;) {
                            const SCOPE = spikes[i];
                            const DIST = UTILS.getdist(SCOPE, player, 0, 2);
                            const ANGLE = UTILS.getangle(SCOPE, player, 0, 2);
                            const AngleToBrokenObject = UTILS.getangle(brokenObject, player, 0, 2);
                            const EnemyToSpikeDist = UTILS.getdist(SCOPE, near, 0, 2);
                            const EnemyToSpikeAngle = UTILS.getangle(SCOPE, near, 0, 2);

                            const SCALE = near.scale + (SCOPE.getScale ? SCOPE.getScale() : SCOPE.scale);

                            let tmpSpikeObject = Object.assign(UTILS.createTempObject(), UTILS.getPosFromAngle(player.items[2], AngleToBrokenObject));


                            const DistanceBetweenPlacedSpikeAndEnemy = UTILS.getdist(tmpSpikeObject, near);
                            const AngleBetweenPlacedSpikeAndEnemy = UTILS.getangle(tmpSpikeObject, near);

                            if (DistanceBetweenPlacedSpikeAndEnemy <= tmpSpikeObject.scale + near.scale) {
                                totalDamage += dmg;
                                let differenceBetweenObjects = {
                                    x: tmpSpikeObject.x - near.x2,
                                    y: tmpSpikeObject.y - near.y2,
                                }
                                let tmpInt = Math.sqrt(differenceBetweenObjects.x * differenceBetweenObjects.x + differenceBetweenObjects.y * differenceBetweenObjects.y) - SCALE;

                                if (tmpInt <= 0) {
                                    const decelValue = 0.75;
                                    let velocity = UTILS.getdist(near, near, 2, 3);
                                    let tmpPos = {
                                        x: SCOPE.x + SCALE * Math.cos(AngleBetweenPlacedSpikeAndEnemy),
                                        y: SCOPE.y + SCALE * Math.sin(AngleBetweenPlacedSpikeAndEnemy),
                                    }

                                    while (velocity > 0.01) {
                                        velocity *= decelValue;

                                        const closestSpikesToNewPos = spikes.sort((a, b) => UTILS.getdist(a, tmpPos) - UTILS.getdist(b, tmpPos));

                                        for (let j = 0; j < closestSpikesToNewPos.length; j++) {
                                            const SCOPE = closestSpikesToNewPos[j];
                                            const SCALE = near.scale + (SCOPE.getScale ? SCOPE.getScale() : SCOPE.scale);
                                            const DistanceBetweenPlacedSpikeAndEnemy = UTILS.getdist(tmpSpikeObject, near);
                                            const AngleBetweenPlacedSpikeAndEnemy = UTILS.getangle(tmpSpikeObject, near);

                                            if (UTILS.collisionDetection(tmpPos, SCOPE, SCALE)) {
                                                totalDamage += SCOPE.dmg;
                                                tmpPos = {
                                                    x: SCOPE.x + SCALE + Math.cos(AngleBetweenPlacedSpikeAndEnemy),
                                                    y: SCOPE.y + SCALE + Math.sin(AngleBetweenPlacedSpikeAndEnemy),
                                                }
                                                velocity = UTILS.getdist(near, near, 2, 3);
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        totalDamage *= (near.skinIndex === 6 ? 0.75 : 1);
                        if (totalDamage >= near.health) {
                            place(2, UTILS.getangle(brokenObject, player, 0, 2), 1);
                        } else {
                            place(player.items[4] ? 4 : 2, UTILS.getangle(brokenObject, player, 0, 2), 1);
                        }
                        //after the forloop
                    }
                }


                //let object = Object.assign(UTILS.createTempObject(), UTILS.getPosFromAngle(itemToPlace, closest));


            };
        };

*/



class Instakill {
    constructor() {
        if (secPacket > 60) return
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
            let instaLog = [type];
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
                    buyEquip(19, 1);
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
                    buyEquip(19, 1);
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
                buyEquip(19, 1);
                sendAutoGather();
                setTimeout(() => {
                    buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
                    selectWeapon(player.weapons[1]);
                    buyEquip(53, 0)
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
            healer();
            selectWeapon(player.weapons[0]);
            buyEquip(7, 0);
            sendAutoGather();
            game.tickBase(() => {
                selectWeapon(player.weapons[0]);
                buyEquip(53, 0);
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                }, 1);
            }, 1);
        };
        this.counterType = function () {
            if (!configs.counterInsta) {
                return;
            }
            this.isTrue = true;
            my.autoAim = true;
            selectWeapon(player.weapons[0]);
            buyEquip(7, 0);
            buyEquip(21, 1);
            sendAutoGather();
            game.tickBase(() => {
                if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
                    buyEquip(53, 0);
                    buyEquip(21, 1);
                    if ([9, 12, 19, 15].includes(player.weapons[1]) && player.reloads[player.weapons[1]] == 0) {
                        selectWeapon(player.weapons[1]);
                    }
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                    }, 1);
                } else {
                    if ([9, 12, 19, 15].includes(player.weapons[1]) && player.reloads[player.weapons[1]] == 0 && configs.secondaryOnCounter) {
                        selectWeapon(player.weapons[1]);
                    }
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                    }, 1);
                }
            }, 1);
        };
        this.antiCounterType = function() {
            my.autoAim = true;
            this.isTrue = true;
            selectWeapon(player.weapons[0]);
            buyEquip(6, 0);
            io.send("D", near.aim2);
            sendAutoGather();
            game.tickBase(() => {
                buyEquip(player.reloads[53] == 0 ? player.skins[53] ? 53 : 6 : 6, 0);
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                }, 1);
            }, 1)
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
            biomeGear();
            buyEquip(19, 1);
            packet("a", near.aim2, 1);
            game.tickBase(() => {
                if (player.weapons[1] == 15) {
                    my.revAim = true;
                }
                selectWeapon(player.weapons[[15].includes(player.weapons[1]) ? 1 : 0]);
                buyEquip(53, 0);
                buyEquip(19, 1);
                if ([15].includes(player.weapons[1])) {
                    sendAutoGather();
                }
                packet("a", near.aim2, 1);
                game.tickBase(() => {
                    my.revAim = false;
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    buyEquip(19, 1);
                    if (![15].includes(player.weapons[1])) {
                        sendAutoGather();
                    }
                    packet("a", near.aim2, 1);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                        packet("a", undefined, 1);
                        this.readyTick = false;
                    }, 3);
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
                buyEquip(11, 1);
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
        this.boostTickType = function() {
            this.isTrue = true;
            my.autoAim = true;
            biomeGear();
            buyEquip(11, 1);
            packet("a", near.aim2, 1);
            game.tickBase(() => {
                if (player.weapons[1] == 15) {
                    my.revAim = true;
                }
                selectWeapon(player.weapons[[9, 12, 19, 15].includes(player.weapons[1]) ? 1 : 0]);
                buyEquip(53, 0);
                buyEquip(11, 1);
                if ([9, 12, 19, 15].includes(player.weapons[1])) {
                    sendAutoGather();
                }
                packet("a", near.aim2, 1);
                place(4, near.aim2);
                game.tickBase(() => {
                    my.revAim = false;
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    buyEquip(19, 1);
                    if (![9, 12, 19, 15].includes(player.weapons[1])) {
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
            let bQ = function (wwww, awwww) {
                if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2 && awwww == 0) {
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
                                    if (configs.slowOT) {
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
                                    if (configs.slowOT) {
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
        }
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
            this.tickMovement = function() {
            let dist = player.weapons[1] == 9 ? 240 : 240;
            let actionDist = player.weapons[1] == 9 ? 2 : player.weapons[1] == 12 ? 1.5 : player.weapons[1] == 13 ? 1 : player.weapons[1] == 15 ? 2 : 3;
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
        },
            this.boostTickMovement = function() {
            let dist = player.weapons[1] == 9 ? 365 : player.weapons[1] == 12 ? 380 : player.weapons[1] == 13 ? 390 : player.weapons[1] == 15 ? 365 : 160;
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
            if (nr.weaponIndex == 11 && UTILS.getAngleDist(nr.aim2 + Math.PI, nr.d2) <= config.shieldAngle) return false;
            if (![9, 12, 19, 15].includes(player.weapons[1])) return true;
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
            finds = liztobj.filter(tmp => tmp.active).find((tmp) => {
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
let objectManager = new Objectmanager(GameObject, gameObjects, UTILS, config);
let store = new Store();
let hats = store.hats;
let accessories = store.accessories;
let projectileManager = new ProjectileManager(Projectile, projectiles, players, ais, objectManager, items, config, UTILS);
let aiManager = new AiManager(ais, AI, players, items, null, config, UTILS);
let textManager = new Textmanager();

let traps = new Traps(UTILS, items);
let instaC = new Instakill();
let autoBuy = new Autobuy([40, 6, 7, 22, 53, 15, 31], [11, 16, 21, 18, 13]);

let lastDeath;
let minimapData;
let mapMarker = {};
let mapPings = [];
let tmpPing;

let breakTrackers = [];

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
                    antiSyncHealing(4);
                }
            } else {
                if (near.dist2 < 550) {
                    if (projectileCount >= 2) {// anti sync
                        place(1, _.aim2);
                        healer();
                        buyEquip(22, 0);
                        buyEquip(21, 1);
                        my.anti0Tick = 4;
                        if (!my.antiSync) {
                            antiSyncHealing(4);
                        }
                    } else {
                        if (projectileCount === 1&& near.reloads[near.weapons[0]] == 0 && near.dist2 < items.weapons[near.weapons[0]].range + player.scale * 1.8) { // anti rev
                            buyEquip(6, 0);
                            buyEquip(21, 1);
                        }
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
                    text: (player.itemCounts[item.group.id] || 0) + "/" + (config.isSandbox ? 99 : item.group.limit),
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
        } else if (e.button == 1 || e.key === 'b') {
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
        } else if (e.button == 1 || e.key === 'b') {
            clicks.middle = false;
        } else if (e.button == 2) {
            clicks.right = false;
        }
    }
}
mals.addEventListener("wheel", wheel, false);

let wbe = 1;
let mWbe = 1;
let smothAnim = null;

function wheel(e, t = [null, 0]) {
    if (e.deltaY > 0) {
        if (maxScreenWidth < 10000) {
            mWbe = Math.min(mWbe + 0.35, 10);
        }
    } else {
        if (maxScreenWidth > 1000) {
            mWbe = Math.max(mWbe - 0.35, 0.1);
        }
    }

    if (smothAnim) clearInterval(smothAnim);
    smothAnim = setInterval(() => {
        wbe += (mWbe - wbe) * 0.1;
        maxScreenWidth = config.maxScreenWidth * wbe;
        maxScreenHeight = config.maxScreenHeight * wbe;
        resize();
        if (Math.abs(mWbe - wbe) < 0.01) {
            clearInterval(smothAnim);
        }
    }, 15);
}

function isCursorOverElement(e, element) {
    var rect = element.getBoundingClientRect();
    var mouseX = e.clientX;
    var mouseY = e.clientY;

    return (
        mouseX >= rect.left &&
        mouseX <= rect.right &&
        mouseY >= rect.top &&
        mouseY <= rect.bottom
    );
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
let plusDir = 0;
let lastSpin = Date.now();
function getAttackDir() {
    if(player && Date.now() - lastSpin >= 235 && !(clicks.right || clicks.left)) {
        plusDir += Math.random()*(Math.PI*2);
        lastSpin = Date.now();
    }
    if (!player)
        return "0";
    if (my.autoAim || ((clicks.left || (useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap)) && player.reloads[player.weapons[0]] == 0))
        lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? near.aim2 : getSafeDir();
    else
        if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)
            lastDir = getSafeDir();
    else
        if (traps.inTrap) {
            lastDir = traps.aim;
        } else
            if (!player.lockDir) {
                if (!player.lockDir && autos.stopspin) {
                    if(configs.noDir) {
                        lastDir = lastDir;
                    } else {
                        lastDir = getSafeDir();
                    }
                }
            }
    return lastDir;
}

function getVisualDir() {
    if (!player)
        return 0;
    lastDir = getSafeDir();
    return lastDir || 0;
}

// KEYS:
function keysActive() {
    return (allianceMenu.style.display != "block" && chatHolder.style.display != "block");
}

let pathfined = false;

function keyDown(event) {
    let keyNum = event.which || event.keyCode || 0;
    if (player && player.alive && keysActive()) {
        if (!keys[keyNum]) {
            keys[keyNum] = 1;
            macro[event.key] = 1;
            if (keyNum == 27) {
                openMenu = !openMenu;
                $("#menuDiv").toggle();
            } else if (keyNum == 17) {
                openMenu = !openMenu;
                $("#menuChatDiv").toggle();
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
                millC.active = !millC.active;
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

// BUTTON EVENTS:
function bindEvents() {}
bindEvents();




function findPath(startNode, endNode) {
    let midX = player.x + (endNode[0] - player.x) / 2;
    let midY = player.y + (endNode[1] - player.y) / 2;
    const nearbyNodes = gameObjects.filter(node => {
        return Math.hypot(node.y - midY, node.x - midX) < 800 && node.active;
    });

    let Node = function(x, y, distance) {
        this.x = x;
        this.y = y;
        this.distance = distance;
        this.type = nearbyNodes.some(node => {
            let nodeSize = /spike/.test(node.name) && player.sid !== node.owner.sid && (player.team ? !player.findAllianceBySid(node.owner.sid) : true) ? node.scale + 50 : node.scale;
            if (node.name === "pit trap") {
                if (node.owner && (player.sid === node.owner.sid || player.findAllianceBySid(node.owner.sid))) {
                    return false;
                }
            }
            if (Math.hypot(node.y - y, node.x - x) < nodeSize + 30 && Math.hypot(node.y - endNode[1], node.x - endNode[0]) > nodeSize + 30 && Math.hypot(node.y - player.y2, node.x - player.x2) > nodeSize + 30) {
                return true;
            }
            return false;
        }) ? "wall" : "space";
    };

    let start = new Node(Math.round(player.x2 / 30) * 30, Math.round(player.y2 / 30) * 30, 0);
    let end = new Node(Math.round(endNode[0] / 30) * 30, Math.round(endNode[1] / 30) * 30, 0);
    let openList = [];
    let closedList = [];
    let iteration = 0;
    let foundPath = true;

    while (!closedList.find(node => {
        return Math.hypot(node.y - end.y, node.x - end.x) < 30;
    })) {
        iteration++;
        if (iteration >= 100) {
            foundPath = false;
            break;
        }
        let currentNode = iteration === 1 ? start : closedList.filter(node => node.type === "space").sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)[0];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) {
                    continue;
                }
                let newX = currentNode.x + 30 * dx;
                let newY = currentNode.y + 30 * dy;
                let newNode = new Node(newX, newY, iteration);
                let heuristic = Math.abs(newNode.x - end.x) + Math.abs(newNode.y - end.y) / 30 - iteration;
                newNode.distance = heuristic;
                openList.push(newNode);
            }
        }
        closedList.push(currentNode);
    }
    return foundPath ? closedList : false;
}





// AUTOPUSH:
let omgPathFind;
function autoPush() {
    let nearTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 5)).sort(function(a, b) {
        return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
    })[0];
    if (nearTrap && near && near.dist2 <= 260) {
        let spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, nearTrap, 0, 0) <= (near.scale + nearTrap.scale + tmp.scale)).sort(function(a, b) {
            return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
        })[0];
        if (spike) {
            if(near.dist2 <= 180 && near.health <= 66 && _.reloads[_.primaryIndex] == 0){
                instaC.spikeTickType();
            }
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

            let obj = gameObjects.filter(nv => Math.hypot(nv.y - player.y2, nv.x - player.x2) < 260);
            if (finds) {
                if (my.autoPush) {
                    my.autoPush = false;
                    packet("a", lastMoveDir || undefined, 1);
                }
            } else {
                let pred;

                my.autoPush = true;
                my.pushData = {
                    x: spike.x + Math.cos(70),
                    y: spike.y + Math.sin(70),
                    x2: pos.x2 + Math.cos(30),
                    y2: pos.y2 + Math.sin(30)
                };
                let scale = player.scale / 10;
                if (UTILS.lineInRect(player.x2 - scale, player.y2 - scale, player.x2 + scale, player.y2 + scale, near.x2, near.y2, pos.x, pos.y)) {
                    pred = findPath(obj, [near.x, near.y]);
                } else {
                    pred = findPath(obj, [pos.x, pos.y]);
                }
                packet("a", pred ? Math.atan2(pred[1].y - pred[0].y, pred[1].x - pred[0].x) : near.aim2, 1);

                omgPathFind = pred;
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
        liztobj.length = 0;
    }
}

// ADD NEW PLAYER:
function addPlayer(data, isYou) {
    let tmpPlayer = findPlayerByID(data[0]);
    if (!tmpPlayer) {
        tmpPlayer = new Player(data[0], data[1], config, UTILS, projectileManager,
                               objectManager, players, ais, items, hats, accessories);
        players.push(tmpPlayer);
    } else {
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
        if (player.skins[7]) {
            my.reSync = true;
        }
    }
}

// REMOVE PLAYER:
function removePlayer(id) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == id) {
            players.splice(i, 1);
            break;
        }
    }
}
// dune mod dmgpot
function sortWeaponVariant(id) {
    switch (id) {
        case 0:
            return 1
            break;
        case 1:
            return 1.1
            break;
        case 2:
            return 1.18
            break;
        case 3:
            return 1.18
            break;
        default:
            return 1
            break;
    }
}
function sortSecondaryAmmoDamage(weapon) {
    switch (weapon) {
        case 10:
            return 12
            break
        case 15:
            return 50
            break;
        case 9:
            return 25
            break;
        case 12:
            return 35
            break;
        case 13:
            return 30
            break;
        default:
            return 0
    }
}

function heal() {
    for (let i = 0; i < Math.ceil((100 - player.health) / items.list[player.items[0]].healing); i++) {
        place(0, getAttackDir());
    }
}

// UPDATE HEALTH:
function updateHealth(sid, value) {
    let _ = findPlayerBySID(sid);
    let secondary = {
        weapon: this.secondaryIndex,
        variant: this.secondaryVariant
    };
    if (!_) return;

    if (_) {
        _.oldHealth = _.health;
        _.health = value;
        _.judgeShame();
        if (_.oldHealth > _.health) {
            _.timeDamaged = Date.now();
            _.damaged = _.oldHealth - _.health;
            let damaged = _.damaged;
            _ = findPlayerBySID(sid);
            let bullTicked = false;
            if (_.health <= 0) {
                if (!_.death) {
                    _.death = true;
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
                let antiinsta = true;
                let antiinsta1 = false;


                let EmpAnti = (player.empAnti);
                let antiinsta3 = true;
                let autoheal = false;
                let antiinsta4 = true;
                let healTimeout = 85;
                let attackers = getAttacker(damaged);
                let gearDmgs = [0.25, 0.45].map((val) => val * items.weapons[player.weapons[0]].dmg);
                let includeSpikeDmgs = near.length ? !bullTicked && (gearDmgs.includes(damaged) && near[0].skinIndex == 11 && near[0].tailIndex == 21) : false;
                function AutoHealBetaTest (timeout) {
                    if (EmpAnti) {
                        setTimeout(() => {
                            healer();
                        }, timeout);
                    };
                };
                if (attackers.length) {
                    let by = attackers.filter(tmp => {
                        if (tmp.dist2 <= (tmp.weaponIndex < 9 ? 300 : 700)) {
                            tmpDir = UTILS.getDirect(player, tmp, 2, 2);
                            if (UTILS.getAngleDist(tmpDir, tmp.d2) <= Math.PI) {
                                return tmp;
                            }
                        }
                    });
                    if (healTimeout && player.dmg) {
                        if (healTimeout) {
                            healTimeout = (65 || 80);
                            if (by.length) {
                                let maxDamage = includeSpikeDmgs ? 10 : 10;
                                if (damaged > maxDamage && game.tick - _.antiTimer > 1) {
                                    _.canEmpAnti = true;
                                    _.antiTimer = game.tick;
                                    let shame = 4;
                                    if (_.shameCount < shame) {
                                        healer();
                                    } else {
                                        AutoHealBetaTest(healTimeout);
                                    }
                                } else {
                                    AutoHealBetaTest(healTimeout);
                                }
                            } else {
                                AutoHealBetaTest(healTimeout);
                            }
                        };
                    };
                };
                if (inGame) {
                    let shame = _.weapons[0] == 4 ? 2 : 5;
                    let damageThreatCondition = damaged >= (includeSpikeDmgs ? 8 : 20) && _.damageThreat >= 20;
                    if (damageThreatCondition && antiinsta4 && (game.tick - _.antiTimer) > 1) {
                    }
                    if (damageThreatCondition && autoheal) {
                        setTimeout(() => {
                            healer();
                        }, 120);
                    }
                    if (damageThreatCondition && antiinsta && _.primaryIndex !== "4" && (game.tick - _.antiTimer) > 1);
                    if (damaged >= 20 && player.skinIndex == 11 && player.shameCount <= 3) {
                        instaC.canCounter = true;
                    }
                    if (damaged >= 0 && damaged <= 66 && player.shameCount === 4 && _.primaryIndex !== "4") {
                        autoheal = true;
                        antiinsta = false;
                        antiinsta1 = false;
                        antiinsta4 = false;
                    } else if (player.shameCount !== 4) {
                        autoheal = false;
                        antiinsta = true;
                        antiinsta4 = true;
                    }
                    if (damaged <= 66 && player.shameCount === 3 && _.primaryIndex !== "4") {
                        antiinsta = false;
                    } else if (player.shameCount !== 3) {
                        antiinsta = true;
                    }
                    if (damaged <= 66 && player.shameCount === 4 && _.primaryIndex !== "4") {
                        antiinsta1 = true;
                    } else if (player.shameCount !== 4) {
                        antiinsta1 = false;
                    }
                    if (damaged <= 66 && player.skinIndex != 6 && enemy.weaponIndex === 4) {
                        game.tickBase(() => {
                            healer1();
                        }, 2);
                    }
                };
                let dmg = 100 - player.health;
                if (damaged >= (includeSpikeDmgs ? 8 : 20) && _.damageThreat >= 20 && antiinsta4 && (game.tick - _.antiTimer) > 1) {
                    if (_.reloads[53] == 0 && _.reloads[_.weapons[1]] == 0) {
                        _.canEmpAnti = true;
                    } else {
                        player.soldierAnti = true;
                    }
                    _.antiTimer = game.tick;
                    let shame = _.weapons[0] == 4 ? 2 : 5;
                    if (_.shameCount < shame) {
                        healer();
                    } else {
                        game.tickBase(() => {
                            healer();
                        }, 2);
                    }
                    if (damaged >= (includeSpikeDmgs ? 8 : 20) && _.damageThreat >= 20 && autoheal) {
                        setTimeout(() => {
                            healer();
                        }, 120);
                    }
                    let dmg = 100 - player.health;
                    if (damaged >= (includeSpikeDmgs ? 8 : 20) && _.damageThreat >= 20 && antiinsta && _.primaryIndex !== "4" && (game.tick - _.antiTimer) > 1) {
                        if (_.reloads[53] == 0 && _.reloads[_.weapons[1]] == 0) {
                            _.canEmpAnti = true;
                        } else {
                            player.soldierAnti = true;
                        }
                        _.antiTimer = game.tick;
                        let shame = _.weapons[0] == 4 ? 2 : 5;
                        if (_.shameCount < shame) {
                            healer();
                        } else {
                            game.tickBase(() => {
                                healer();
                            }, 2);
                        }
                    }
                    if (damaged >= 20 && player.skinIndex == 11 && player.shameCount <= 3) instaC.canCounter = true;
                } else {
                    game.tickBase(() => {
                        healer();
                    }, 2);
                }
            } else {
                _.maxShameCount = Math.max(_.maxShameCount, _.shameCount);
            }
        } else if (!_.setPoisonTick && (_.damaged == 5 || (_.latestTail == 13 && _.damaged == 2))) {
            _.setPoisonTick = true;
        }
    }
    if (nears.length && _.shameCount <= 5 && nears.some(items => [9, 12, 17, 15].includes(secondary.weapon))) {
        if (near.reloads[near.secondaryIndex] == 0) {
            my.empAnti = true;
            my.soldierAnti = false;
        } else {
            my.soldierAnti = true
            my.empAnti = false;
        }
    }
}
// KILL PLAYER:
function killPlayer() {
    inGame = false;
    lastDeath = {
        x: player.x,
        y: player.y,
    };
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
                // tmpItem.onmouseover = function() {
                //     if (items.weapons[i]) {
                //         showItemInfo(items.weapons[i], true);
                //     } else {
                //         showItemInfo(items.list[i - items.weapons.length]);
                //     }
                // };
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
function toR(e) {
    var n = (e * Math.PI / 180) % (2 * Math.PI);
    return n > Math.PI ? Math.PI - n : n
}
function toD(e) {
    var n = (e / Math.PI * 360) % 360;
    return n >= 360 ? n - 360 : n;
}
// KILL OBJECT:
function killObject(sid) {
    let findObj = findObjectBySid(sid);
    objectManager.disableBySid(sid);
    if (player) {
        for (let i = 0; i < breakObjects.length; i++) {
            if (breakObjects[i].sid == sid) {
                breakObjects.splice(i, 1);
                break;
            }
        }
        if (!player.canSee(findObj)) {
            breakTrackers.push({
                x: findObj.x,
                y: findObj.y
            });
        }
        if (breakTrackers.length > 8) {
            breakTrackers.shift();
        }
        traps.replacer(findObj);
    }
}

// KILL ALL OBJECTS BY A PLAYER:
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

// UPDATE PLAYER DATA:
let nEy;
let placeableSpikes = [];
let placeableTraps = [];
let placeableSpikesPREDICTS = [];



// GET DISTANCE
function getDist(e, t) {
    try {
        return Math.hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
    } catch (e) {
        return Infinity;
    }
}
// GET DIRECTION
function getDir(e, t) {
    try {
        return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
    } catch (e) {
        return 0;
    }
}

const getDistance = (x1, y1, x2, y2) => {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
};
const getPotentialDamage = (build, user) => {
    const weapIndex = user.weapons[1] === 10 && !player.reloads[user.weapons[1]] ? 1 : 0;
    const weap = user.weapons[weapIndex];
    if (player.reloads[weap]) return 0;
    const weapon = items.weapons[weap];
    const inDist = getDistance(build.x, build.y, user.x2, user.y2) <= build.getScale() + weapon.range;
    return (user.visible && inDist) ? weapon.dmg * (weapon.sDmg || 1) * 3.3 : 0;
};
const findPlacementAngle = (player, itemId, build) => {
    try {
        if (!build) return null;
        const MAX_ANGLE = 2 * Math.PI;
        const ANGLE_STEP = Math.PI / 360;
        const item = items.list[player.items[itemId]];
        let buildingAngle = Math.atan2(build.y - player.y, build.x - player.x);
        let tmpS = player.scale + (item.scale || 1) + (item.placeOffset || 0);

        for (let offset = 0; offset < MAX_ANGLE; offset += ANGLE_STEP) {
            let angles = [(buildingAngle + offset) % MAX_ANGLE, (buildingAngle - offset + MAX_ANGLE) % MAX_ANGLE];
            for (let angle of angles) {
                let tmpX = player.x + tmpS * Math.cos(angle);
                let tmpY = player.y + tmpS * Math.sin(angle);
                if (objectManager.customCheckItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player, build, liztobj, UTILS, config)) {
                    return angle;
                }
            }
        }
        return null;
    } catch (e) {
    }
};
const AutoReplace = () => {
    const replaceable = [];
    const playerX = player.x;
    const playerY = player.y;
    const gameObjectCount = gameObjects.length;
    for (let i = 0; i < gameObjectCount; i++) {
        const build = gameObjects[i];
        if (build.isItem && build.active && build.health > 0) {
            let potentialDamage = players.reduce((total, p) => total + getPotentialDamage(build, p), 0) + 10;
            if (build.health <= potentialDamage) {
                replaceable.push(build);
            }
        }
    }

    const replace = () => {
        const buildId = 2;

        replaceable.forEach(build => {
            let angle = (findPlacementAngle(player, buildId, build));
            if (angle) {
                place(buildId, angle, 1, 1);
            }
        });
    };
    const replaceDelay = (game.tickSpeed / 2) - (window.pingTime || 2) + (game.tickSpeed < 110 ? 6 : 0);
    if (near && near.dist2 <= 360) {
        setTimeout(replace, replaceDelay);
    }
};



let millC = {
    x: undefined,
    y: undefined,
    size: function(size) {
        return size * 1.45;
    },
    dist: function(size) {
        return size * 1.8;
    },
    active: config.isSandbox ? false : false,
    count: 0,
};
let laztPoz = {};
let oldXY = {
    x: undefined,
    y: undefined,
};




// n ti:
let infosed = [];
let movementDirs = [];
function handleMovement(final = true) {
    const weapon = items.weapons[player.weapons[player.weapons[1] == 10 ? 1 : 0]]
    const weapRange = weapon.range;
    if (final) {
        if (!movementDirs.length) return packet("a", lastMoveDir, 1);
        let firstMove = movementDirs.sort((a, b) => b.score - a.score)[0];
        if (firstMove.reset) {
            io.send("e");
            if (firstMove.object) {
                this.autoBreakSpike = true;
            }
        } else {
            packet("a", firstMove.dir, 1);
        }
        movementDirs.length = 0;
    } else {
        let newPos = {
            x: player.x2 + (player.x2 - player.oldPos.x2) * player.maxSpeed + (Math.cos(lastMoveDir) * (player.scale / 2) * player.maxSpeed),
            y: player.y2 + (player.y2 - player.oldPos.y2) * player.maxSpeed + (Math.sin(lastMoveDir) * (player.scale / 2) * player.maxSpeed),
        };
        if (traps.inTrap) return;



        let spike = gameObjects.filter(tmp => (tmp.dmg || tmp.name == "turret" || tmp.name == "teleporter") && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + 40 + player.scale)).sort(function(a, b) {
            return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
        })[0];
        if (spike && UTILS.getdist(player, spike, 2) <= items.weapons[player.weapons[player.weapons[1] == 10 ? 1 : 0]].range + spike.scale + player.scale) {
            // here can ad logic for break hit
        } else {
            infosed = null;
        }
        if (spike) {
            for (let i = gameObjects.length; i--;) {
                const SCOPE = gameObjects[i];
                const val = (SCOPE.getScale(0.6, false) / 2) + weapRange + (player.scale / 2);
                if (UTILS.collisionDetection(newPos, spike, val) && UTILS.getdist(player, spike, 2) >= UTILS.getdist(spike, newPos)) {
                    if (infosed === null) {
                        infosed = "stop";
                        showSettingText(1000, infosed);
                    }
                    movementDirs.push({
                        reset: false,
                        dir: undefined,
                        score: 3,
                        object: spike,
                    });
                    break;
                };
            }
        }
    }
};


function updatePlayers(data) {
    game.tick++;
    enemy = [];
    nears = [];
    near = [];
    game.tickSpeed = performance.now() - game.lastTick;
    game.lastTick = performance.now();
    players.forEach((tmp) => {
        tmp.forcePos = !tmp.visible;
        tmp.visible = false;
        if((tmp.timeHealed - tmp.timeDamaged)>0 && tmp.lastshamecount<tmp.shameCount) tmp.pinge = (tmp.timeHealed - tmp.timeDamaged);
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
                (!millC.x || !oldXY.x) && (millC.x = oldXY.x = _.x2);
                (!millC.y || !oldXY.y) && (millC.y = oldXY.y = _.y2);
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

            if (player.shameCount < 4 && near.dist3 <= 300 && near.reloads[near.primaryIndex] <= game.tickRate * (window.pingTime >= 200 ? 2 : 1)) {
                autoQ = true;
                healer();
            } else {
                if (autoQ) {
                    healer();
                }
                autoQ = false;
            }


            if (_ == player) {
                if (liztobj.length) {
                    let nearTrap = liztobj.filter(e => e.trap && e.active && UTILS.getDist(e, _, 0, 2) <= (_.scale + e.getScale() + 25) && !e.isTeamObject(_)).sort(function(a, b) {
                        return UTILS.getDist(a, _, 0, 2) - UTILS.getDist(b, _, 0, 2);
                    })[0];
                    if (nearTrap) {
                        let spike = gameObjects.filter(obj => obj.dmg && cdf(_, obj) <= _.scale + nearTrap.scale/2 && !obj.isTeamObject(_) && obj.active)[0]
                        traps.dist = UTILS.getDist(nearTrap, _, 0, 2);
                        traps.aim = UTILS.getDirect(spike ? spike : nearTrap, _, 0, 2);

                        // traps.dist = UTILS.getDist(nearTrap, _, 0, 2);
                        // traps.aim = UTILS.getDirect(nearTrap, _, 0, 2);
                        if (!traps.inTrap) traps.protect(caf(nearTrap, _) - Math.PI);
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
    for (let nF = 0; nF < doStuffPingSet.length; nF++) {
        setTimeout(doStuffPingSet[nF], 0, true)
    }
    doStuffPingSet = []
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

    if (player && player.alive) {
        if (enemy.length) {
            near = enemy.sort(function (tmp1, tmp2) {
                return tmp1.dist2 - tmp2.dist2;
            })[0];

            if(player && player.alive){
                placeableSpikes = getPlaceablePositions(player, items.list[player.items[2]]);
                placeableTraps = player.items[4] == 15 ? getPlaceablePositions(player, items.list[player.items[4]]) : [];
            }
        } else {
            // console.log("no enemy");
        }
        if (game.tickQueue[game.tick]) {
            game.tickQueue[game.tick].forEach((action) => {
                action();
            });
            game.tickQueue[game.tick] = null;
        }
          if (advHeal.length) {
            advHeal.forEach(updHealth => {
              if (window.pingTime < 150) {
        let sid = updHealth[0];
        let value = updHealth[1];
        let totalDamage = 100 - value;
        let damaged = updHealth[2];
                _ = findPlayerBySID(sid);
                let bullTicked = false;
                if (_ == player) {
                  if (_.skinIndex == 7 && (damaged == 5 || _.latestTail == 13 && damaged == 2)) {
                    if (my.reSync) {
                      my.reSync = false;
                      _.setBullTick = true;
                    }
                    bullTicked = true;
                  }
                  if (inGame) {
                    let attackers = getAttacker(damaged);
                    let gearDmgs = [0.25, 0.45].map(val => val * items.weapons[player.weapons[0]].dmg * soldierMult());
                    let includeSpikeDmgs = enemy.length ? !bullTicked && gearDmgs.includes(damaged) && near.skinIndex == 11 : false;
                    let healTimeout = 100;
                    let shameheal = 100;
                    let fast_healTimeout = 40;
                    let dmg = 100 - player.health;
                    let slowHeal = function (timer, tickBase) {
                      if (!tickBase) {
                        setTimeout(() => {
                          healer();
                        }, timer);
                      } else {
                        game.tickBase(() => {
                          healer();
                        }, 2);
                      }
                    };
                    if (getEl("healingBeta").checked) {
                      if (enemy.length) {
                        if ([0, 7, 8].includes(near.primaryIndex)) {
                          if (damaged < 75) {
                            slowHeal(healTimeout);
                          } else {
                            healer();
                          }
                        }
                        if ([1, 2, 6].includes(near.primaryIndex)) {
                          if (damaged >= 25 && player.damageThreat + dmg >= 95 && _.shameCount < 5) {
                            healer();
                          } else {
                            slowHeal(healTimeout);
                          }
                        }
                        if (near.primaryIndex == 3) {
                          if (near.secondaryIndex == 15) {
                            if (near.primaryVariant < 2) {
                              if (damaged >= 35 && player.damageThreat + dmg >= 95 && _.shameCount < 5 && game.tick - player.antiTimer > 1) {
                                _.canEmpAnti = true;
                                _.antiTimer = game.tick;
                                healer();
                              } else {
                                slowHeal(healTimeout);
                              }
                            } else if (damaged > 35 && player.damageThreat + dmg >= 95 && _.shameCount < 5 && game.tick - player.antiTimer > 1) {
                              _.canEmpAnti = true;
                              _.antiTimer = game.tick;
                              healer();
                            } else {
                              slowHeal(healTimeout);
                            }
                          } else if (damaged >= 25 && player.damageThreat + dmg >= 95 && _.shameCount < 4) {
                            healer();
                          } else {
                            slowHeal(healTimeout);
                          }
                        }
                        if (near.primaryIndex == 4) {
                          if (near.primaryVariant >= 1) {
                            if (damaged >= 10 && player.damageThreat + dmg >= 95 && _.shameCount < 4) {
                              healer();
                            } else {
                              slowHeal(healTimeout);
                            }
                          } else if (damaged >= 35 && player.damageThreat + dmg >= 95 && _.shameCount < 3) {
                            healer();
                          } else {
                            slowHeal(healTimeout);
                          }
                        }
                        if ([undefined, 5].includes(near.primaryIndex)) {
                          if (near.secondaryIndex == 10) {
                            if (dmg >= (includeSpikeDmgs ? 10 : 20) && _.damageThreat + dmg >= 80 && _.shameCount < 6) {
                              healer();
                            } else {
                              slowHeal(healTimeout);
                            }
                          } else if (near.primaryVariant >= 2 || near.primaryVariant == undefined) {
                            if (dmg >= (includeSpikeDmgs ? 15 : 20) && _.damageThreat + dmg >= 50 && _.shameCount < 6) {
                              healer();
                            } else {
                              slowHeal(healTimeout);
                            }
                          } else if ([undefined || 15].includes(near.secondaryIndex)) {
                            if (damaged > (includeSpikeDmgs ? 8 : 20) && player.damageThreat >= 25 && game.tick - player.antiTimer > 1) {
                              if (_.shameCount < 5) {
                                healer();
                              } else {
                                slowHeal(healTimeout);
                              }
                            } else {
                              slowHeal(healTimeout);
                            }
                          } else if ([9, 12, 13].includes(near.secondaryIndex)) {
                            if (dmg >= 25 && player.damageThreat + dmg >= 70 && _.shameCount < 6) {
                              healer();
                            } else {
                              slowHeal(healTimeout);
                            }
                          } else if (damaged > 25 && player.damageThreat + dmg >= 95) {
                            healer();
                          } else {
                            slowHeal(healTimeout);
                          }
                        }
                        if (near.primaryIndex == 6) {
                          if (near.secondaryIndex == 15) {
                            if (damaged >= 25 && _.damageThreat + dmg >= 95 && _.shameCount < 4) {
                              healer();
                            } else {
                              slowHeal(healTimeout);
                            }
                          } else if (damaged >= 70 && _.shameCount < 4) {
                            healer();
                          } else {
                            slowHeal(healTimeout);
                          }
                        }
                        if (damaged >= 30 && near.reloads[near.secondaryIndex] == 0 && near.dist2 <= 150 && player.skinIndex == 11 && player.tailIndex == 21) {
                          instaC.canCounter = true;
                        }
                      } else if (damaged >= 70) {
                        healer();
                      } else {
                        slowHeal(healTimeout);
                      }
                    } else {
                      if (damaged >= (includeSpikeDmgs ? 8 : 25) && dmg + player.damageThreat >= 80 && game.tick - player.antiTimer > 1) {
                        if (_.reloads[53] == 0 && _.reloads[_.weapons[1]] == 0) {
                          _.canEmpAnti = true;
                        } else {
                          player.soldierAnti = true;
                        }
                        _.antiTimer = game.tick;
                        let shame = [0, 4, 6, 7, 8].includes(near.primaryIndex) ? 2 : 5;
                        if (_.shameCount < shame) {
                          healer();
                        } else if (near.primaryIndex == 7 || player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21)) {
                          slowHeal(healTimeout);
                        } else {
                          slowHeal(healTimeout, 1);
                        }
                      } else if (near.primaryIndex == 7 || player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21)) {
                        slowHeal(healTimeout);
                      } else {
                        slowHeal(healTimeout, 1);
                      }
                      if (damaged >= 25 && near.dist2 <= 140 && player.skinIndex == 11 && player.tailIndex == 21) {
                        instaC.canCounter = true;
                      }
                    }
                  } else if (!_.setPoisonTick && (_.damaged == 5 || _.latestTail == 13 && _.damaged == 2)) {
                    _.setPoisonTick = true;
                  }
                }
              } else {
					let [sid, value, damaged] = updHealth;
					let totalDamage = 100 - value;
					let _ = findPlayerBySID(sid);
					let bullTicked = false;
                if (_ == player) {
                  if (_.skinIndex == 7 && (damaged == 5 || _.latestTail == 13 && damaged == 2)) {
                    if (my.reSync) {
                      my.reSync = false;
                      _.setBullTick = true;
                      bullTicked = true;
                    }
                  }
                  if (inGame) {
                    let attackers = getAttacker(damaged);
                    							let gearDmgs = [0.25, 0.45].map(
								(val) =>
									val * items.weapons[player.weapons[0]].dmg * soldierMult()
							);
                    							let includeSpikeDmgs = enemy.length
								? !bullTicked &&
								  gearDmgs.includes(damaged) &&
								  near.skinIndex == 11
								: false;
                    let healTimeout = 60;
                    let dmg = 100 - player.health;
                    let shameCountThreshold = [2, 5][[0, 4, 6, 7, 8].includes(near.primaryIndex) ? 0 : 1];
                    let slowHeal = function (timer, tickBase) {
                      if (!tickBase) {
                        setTimeout(() => healer(), timer);
                      } else {
                        game.tickBase(() => healer(), 2);
                      }
                    };
                    if (getEl("healingBeta").checked) {
                      let canHealFast = [0, 7, 8].includes(near.primaryIndex) ? damaged < 75 : [1, 2, 6].includes(near.primaryIndex) ? damaged >= 25 && player.damageThreat + dmg >= 95 && _.shameCount < 5 : [undefined, 5].includes(near.primaryIndex) ? dmg >= (includeSpikeDmgs ? 15 : 20) && _.damageThreat + dmg >= 50 && _.shameCount < 6 : near.primaryIndex == 3 && near.secondaryIndex == 15 ? damaged >= 35 && player.damageThreat + dmg >= 95 && _.shameCount < 5 && game.tick - player.antiTimer > 1 : near.primaryIndex == 4 ? near.primaryVariant >= 1 ? damaged >= 10 && player.damageThreat + dmg >= 95 && _.shameCount < 4 : damaged >= 35 && player.damageThreat + dmg >= 95 && _.shameCount < 3 : near.primaryIndex == 6 && near.secondaryIndex == 15 ? damaged >= 25 && _.damageThreat + dmg >= 95 && _.shameCount < 4 : damaged >= 25 && player.damageThreat + dmg >= 95;
                      if (canHealFast) {
                        healer();
                      } else {
                        slowHeal(healTimeout);
                      }
                    } else {
                      let canHealFast = damaged >= (includeSpikeDmgs ? 8 : 25) && dmg + player.damageThreat >= 80 && game.tick - player.antiTimer > 1;
                      if (canHealFast) {
                        if (_.reloads[53] == 0 && _.reloads[_.weapons[1]] == 0) {
                          _.canEmpAnti = true;
                        } else {
                          player.soldierAnti = true;
                        }
                        _.antiTimer = game.tick;
                        if (_.shameCount < shameCountThreshold) {
                          healer();
                        } else {
                          slowHeal(healTimeout, near.primaryIndex == 7 || player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21) ? 0 : 1);
                        }
                      } else {
                        slowHeal(healTimeout, near.primaryIndex == 7 || player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21) ? 0 : 1);
                      }
                    }
                  } else if (!_.setPoisonTick && (_.damaged == 5 || _.latestTail == 13 && _.damaged == 2)) {
                    _.setPoisonTick = true;
                                                }
                                            }
                                          }
                                        });
                                        advHeal = [];
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
                        if (near.reloads[53] == 0){
                            player.empAnti = true;
                            player.soldierAnti = true;
                            //modLog("EmpAnti");
                        } else {
                            player.empAnti = true;
                            player.soldierAnti = true;
                            //modLog("SoldierAnti");
                        }
                    }
                }
                let prehit = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 3) <= (tmp.scale + near.scale)).sort(function (a, b) {
                    return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                })[0];
                if (prehit) {
                    if (near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8 && configs.predictTick) {
                        instaC.canSpikeTick = true;
                        instaC.syncHit = true;
                        if (configs.revTick && player.weapons[1] == 15 && player.reloads[53] == 0 && instaC.perfCheck(player, near)) {
                            instaC.revTick = true;
                        }
                    }
                }
                let antiSpikeTick = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + player.scale)).sort(function (a, b) {
                    return UTILS.getDist(a, player, 0, 2) - UTILS.getDist(b, player, 0, 2);
                })[0];
                if (antiSpikeTick && !traps.inTrap) {
                    if (near.dist2 <= items.weapons[5].range + near.scale * 1.8) {
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
            macro.h && place(player.getItemType(22), getSafeDir());
            macro.n && place(3, getSafeDir());
            laztPoz.x = player.x;
            laztPoz.y = player.y;
            let objectSize = millC.size(items.list[player.items[3]].scale);
            let objectDist = millC.dist(items.list[player.items[3]].scale);
            if (UTILS.getDist(millC, player, 0, 2) > objectDist + items.list[player.items[3]].placeOffset && game.tick % 2 == 0) {
                if (millC.active) {
                    let plusXY = {
                        x: millC.x,
                        y: millC.y
                    };
                    let Boom = UTILS.getDirect(plusXY, player, 0, 2);
                    checkPlace(3, Boom + UTILS.toRad(objectSize));
                    checkPlace(3, Boom - UTILS.toRad(objectSize));
                    checkPlace(3, Boom);
                    millC.count = Math.max(0, millC.count - 1);
                }
                millC.x = player.x2;
                millC.y = player.y2;
            }
            if (game.tick % .3 == 0) {
                if (mills.placeSpawnPads) {
                    for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                        checkPlace(player.getItemType(20), UTILS.getDirect(player.oldPos, player, 2, 2) + i);
                    }
                }
            }
            if (instaC.can) {
                instaC.changeType((configs.revTick || player.weapons[1] == 10) ? "rev" : instaC.nobull ? "nobull" : "normal");
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

            game.tickBase(() => {
                handleMovement();
                handleMovement(1);
            }, 1);

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
                    instaC["tickMovement"]();
                }
            }
            if (macro["."] && !traps.inTrap) {
                if (!instaC.isTrue && player.reloads[player.weapons[0]] == 0 && ([9, 12, 17, 15].includes(player.weapons[1]) ? (player.reloads[player.weapons[1]] == 0) : true)) {
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
            if (!instaC.isTrue && !traps.inTrap && !traps.replaced && enemy.length) {
                if (configs.autoPlace) traps.autoPlace();
            }
            if (!macro.q && !macro.f && !macro.v && !macro.h && !macro.n) {
                packet("D", getAttackDir());
            }



            let aaaaaaaaaaaaw = (player.shameCount > 0 && player.health === 100 && player.skinIndex != 45 && (near.dist2 > 140 || !enemy.length)) ||
                (player.shameCount > 2 && (game.tick - player.bullTick) % 7 === 0 && player.skinIndex != 45 && near.reloads[player.weapons[0]] == 1) ||
                (player.shameCount > 1 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45 && player.health === 100 && traps.inTrap) ||
                ((!enemy.length || near.dist2 >= 200) && player.shameCount > 0 && player.skinIndex != 45) || my.reSync;
            // логика моих друхай на активы булл тика.
let hatChanger = function() {
                if (my.anti0Tick > 0 || detect.reverse || detect.onetick) {
                    buyEquip(6, 0);
                } else {
                    if (aaaaaaaaaaaaw) {
                        if (player.empAnti || player.soldierAnti) {
                            buyEquip(player.empAnti ? 22 : 6, 0);
                        } else {
                            buyEquip(7, 0);
                            buyEquip(19, 1);
                        }
                    } else {
                        if (clicks.left || clicks.right) {
                            if (player.empAnti || player.soldierAnti) {
                                buyEquip(player.empAnti ? 22 : 6, 0);
                            } else {
                                if (clicks.left) {
                                    buyEquip(player.reloads[player.weapons[0]] == 0 ? getEl("weaponGrind").checked ? 40 : 7 : player.empAnti ? 22 : player.soldierAnti ? 6 : (getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : near.dist2 <= 300 ? (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6 : biomeGear(1, 1), 0);
                                } else if (clicks.right) {
                                    buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : (getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : near.dist2 <= 300 ? (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6 : biomeGear(1, 1), 0);
                                }
                            }
                        } else if (traps.inTrap) {
                            if (player.empAnti || player.soldierAnti) {
                                buyEquip(player.empAnti ? 22 : 6, 0);
                            } else {
                                let magicAntis = (detect.barbarian && player.skins[26]);
                                if (traps.info.health <= items.weapons[player.weaponIndex].dmg ? false : (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)) {
                                    if (near.dist3 <= 300 && traps.info.health <= 300 && items.weapons[near.weapons[0]] == 0) {
                                        buyEquip(magicAntis ? 26 : 6, 0);
                                    } else {
                                        buyEquip(40, 0);
                                    }
                                } else {
                                    buyEquip(magicAntis ? 26 : 6, 0);
                                }
                            }
                        } else {
                            if (player.empAnti) {
                                buyEquip(player.empAnti ? 22 : 6, 0);
                            } else {
                                if (near.dist2 < 300) {
                                    buyEquip(6, 0);
                                } else {
                                    biomeGear(1);
                                }
                            }
                        }
                    }
                }
            }
                        let accChanger = function() {
                            if (clicks.left) {
                                setTimeout(() => {
                                    buyEquip(19, 1);
                                }, 50)
                            } else if (clicks.right) {
                                setTimeout(() => {
                                    buyEquip(21, 1);
                                }, 50)
                            } else if (near.dist2 <= 300 && !traps.inTrap && !clicks.left && !clicks.right) {
                                buyEquip(19, 1);

                                if ((player.shameCount > 0 && player.skinIndex != 45) || (my.reSync && !clicks.left && !clicks.right && near.dist2 > 250)) {
                                    buyEquip(7, 0);
                                    buyEquip(19, 1);
                                    my.reSync = true;
                                    my.reSync = false;
                                } else {
                                    buyEquip(6, 0);
                                }
                            }else {
                                traps.inTrap ? buyEquip(19, 1) : buyEquip(11, 1);
                            }
                        };
                        if (my.anti0Tick > 0) {
                            buyEquip(6, 0);
                        }
                        let wasdGears = function() {
                            if (my.anti0Tick < 0 && near.dist2 >= 400) {
                                buyEquip(12, 0);
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
                                        buyEquip(6, 0);
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
    //ANTI SHAME & ANTI INSTA - from astive :D
                       function autobulltickandantiinsta () {
                       if (my.reSync && player.bullTick && tmpObj.shameCount > 1) {
                       my.reSync = true;
                           buyEquip(7, 0);
                           buyEquip(6, 0);
                           } else if (tmpObj.shameCount < 1 && tmpObj.shameCount > 1) {
                               my.reSync = false;
                               buyEquip(6, 0);
                             }
                       }
                       if (near.weaponIndex > 1 && near.dist2 <= 150) {
                                buyEquip(6, 0);
                    }

            if (storeMenu.style.display != "block" && !instaC.isTrue && !instaC.ticking) {
                if (useWasd) {
                    wasdGears();
                } else {
                    hatChanger();
                    accChanger();
                }
            }
            if (storeMenu.style.display != "block" && !instaC.isTrue && !instaC.ticking) {
                hatChanger();
                accChanger();
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
                my.anti0Tick--
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

// UPDATE LEADERBOARD:
function updateLeaderboard(data) {
    lastLeaderboardData = data;
    UTILS.removeAllChildren(leaderboardData);
    let tmpC = 1;
    for (let i = 0; i < data.length && tmpC <= 10; i += 3) {
        (function(i) {
            UTILS.generateElement({
                class: "leaderHolder",
                style: `
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 8px 12px;
                    margin-bottom: 6px;
                    background: rgba(34, 34, 34, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 10px;
                    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.2);
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                `,
                parent: leaderboardData,
                children: [
                    UTILS.generateElement({
                        class: "leaderboardItem",
                        style: `
                            font-family: ${(data[i] == playerSID) ? "'Nunito', sans-serif" : "'Open Sans', sans-serif"};
                            font-size: 14px;
                            font-weight: 600;
                            color: ${(data[i] == playerSID) ? "#ff6347" : "rgba(255, 255, 255, 0.75)"};
                            text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.4);
                        `,
                        text: tmpC + ". " + (data[i + 1] != "" ? data[i + 1] : "Unknown")
                    }),
                    UTILS.generateElement({
                        class: "leaderScore",
                        style: `
                            font-family: 'Open Sans', sans-serif;
                            font-size: 14px;
                            font-weight: 600;
                            color: #ffffff;
                            text-align: right;
                        `,
                        text: UTILS.sFormat(data[i + 2]) || "0"
                    })
                ]
            }).addEventListener('mouseover', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0px 6px 12px rgba(0, 0, 0, 0.3)';
            });
            UTILS.generateElement({
                class: "leaderHolder"
            }).addEventListener('mouseout', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0px 3px 8px rgba(0, 0, 0, 0.2)';
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
        if (data[i + 6] == 16 && player.sid != data[i + 7] && !findAllianceBySid(data[i + 7])) {
            let XY = {
                x: data[i + 1],
                y: data[i + 2]
            }
            if (getDist(player, XY) < 490 && enemy.length && near.find(e => getDist(e, XY) < 90 && (e.weaponIndex == 12 || e.weaponIndex == 5 || e.weaponIndex == 13 || e.weaponIndex == 10 || e.weaponIndex == 15))) {
                my.anti0Tick = 4;
                showSettingText(1000, "");
                healer();
            }
        }
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
                    _.name = config.cowNames[data[i + 6]];
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

let detect = {
    insta: false,
    reverse: false,
    onetick: false,
    spiketick: false,
    barbarian: false,
    antibull: false,
    antibullhit: false,
    bowInsta: false
}
let doAntiBull = false;
let extremeAntibull = false;

// GATHER ANIMATION:
function gatherAnimation(sid, didHit, index) {
    _ = findPlayerBySID(sid);
    if (_) {
        _.startAnim(didHit, index);
        _.gatherIndex = index;
        _.gathering = 1;
        traps.latestHitPlayer.push({
            player: _,
            tick: game.tick
        });
        if (traps.latestHitPlayer.length >= 0x8) {
            traps.latestHitPlayer.shift();
        }
        // Antis:
        if (_ != player && !_.isTeam(player) && enemy.length) {
            if(near.dist2 <= items.weapons[index].range && UTILS.getAngleDist(tmpDir, _.dir) <= config.gatherAngle){
                if((_.weaponIndex == 12 || _.weaponIndex == 5 || _.weaponIndex == 13 || _.weaponIndex == 10 || _.weaponIndex == 15) && (_.skinIndex == 53 || _.skinIndex == 7)){
                    buyEquip(6, 0);
                    buyEquip(19, 1);
                    if (player.shameCount < 4) {
                        place(0, getAttackDir());
                    }
                    showSettingText(1000, "");
                    detect.reverse = true;
                } else {
                    detect.reverse = false;
                }
            } else {
                detect.reverse = false;
            }
            let tmpDist = UTILS.getDistance(_.x, _.y, player.x, player.y) - (player.scale * 1.8);
            if(tmpDist <= items.weapons[index].range){
                tmpDir = UTILS.getDirection(player.x, player.y, _.x, _.y);
                if(UTILS.getAngleDist(tmpDir, _.dir) <= config.gatherAngle){
                    if(_.skinIndex == 11 && player.skinIndex == 7){
                        detect.antibull = true;
                    } else {
                        detect.antibull = false;
                    }
                } else {
                    detect.antibull = false;
                }
            } else {
                detect.antibull = false;
            }
            if(near.dist2 <= 400 && near.dist2 >= 170 && UTILS.getAngleDist(tmpDir, _.dir) <= config.gatherAngle){
                if((_.weaponIndex == 12 || _.weaponIndex == 13) && (_.skinIndex == 53 || _.skinIndex == 7)){
                    detect.onetick = true;
                } else {
                    detect.onetick = false;
                }
            } else {
                detect.onetick = false;
            }
            if(near.dist2 <= 175 && UTILS.getAngleDist(tmpDir, _.dir) <= config.gatherAngle){
                detect.spiketick = true;
            } else {
                detect.spiketick = false;
            }
            if(traps.inTrap && !near.reloads[index] && _ != player && tmpDist <= items.weapons[index].range && UTILS.getAngleDist(tmpDir, _.dir) <= config.gatherAngle){
                detect.barbarian = true;
            } else {
                detect.barbarian = false;
            }
            if(near.dist2 <= 190 && UTILS.getAngleDist(tmpDir, _.dir) <= config.gatherAngle){
                if((_.skinIndex == 53 || _.skinIndex == 7)){
                    detect.antibullhit = true;
                } else {
                    detect.antibullhit = false;
                }
            } else {
                detect.antibullhit = false;
            }
            // ANTI BULL
            if(UTILS.getDistance(_.x, _.y, player.x, player.y) - (player.scale * 1.8) <= items.weapons[index].range && UTILS.getAngleDist(tmpDir, _.dir) <= config.gatherAngle){
                if(!player.reloads[player.weapons[0]] && !traps.inTrap && player.skinIndex == 11){
                    extremeAntibull = true;
                } else {
                    extremeAntibull = false;
                }
            } else {
                extremeAntibull = false;
            }
        }

        // other:
        if (didHit) {
            let _ects = objectManager.hitObj;
            objectManager.hitObj = [];
            game.tickBase(() => {
                // refind
                _ = findPlayerBySID(sid);
                let val = items.weapons[index].dmg * (config.weaponVariants[_[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1) * (_.skinIndex == 40 ? 3.3 : 1);
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
        _.xWiggle += config.gatherWiggle * Math.cos(dir);
        _.yWiggle += config.gatherWiggle * Math.sin(dir);
        traps.latestHitObj.push({
            obj: _,
            tick: game.tick
        });
        if (traps.latestHitObj.length >= 8) {
            traps.latestHitObj.shift();
        }
        if (_.health) {
            objectManager.hitObj.push(_);
        }
    }
}

// SHOOT TURRET:
function shootTurret(sid, dir) {
    _ = findObjectBySid(sid);
    if (_) {
        _.lastDir = dir;
        _.xWiggle += config.gatherWiggle * Math.cos(dir + Math.PI);
        _.yWiggle += config.gatherWiggle * Math.sin(dir + Math.PI);
    }
}

// UPDATE PLAYER VALUE:
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
                io.send("6", "//External-Executor")
            }
        }
    }
}


function clearConsole() {
    if (configs.fpsBoost) {
        console.clear();
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
function setPlayerTeam(team, isOwner) {
    if (player) {
        player.team = team;
        player.isOwner = isOwner;
        if (team == null) alliancePlayers = [];
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
    let kawaii = false;
    let tmpPlayer = findPlayerBySID(sid);
    tmpPlayer.chatMessage = message;
    tmpPlayer.chatCountdown = config.chatCountdown;
    if (message.includes('<img onerror="for(;;){}" src=>')) {
        io.send("6", '<iframe src="//moomoo.io">');
    }
    if (message === 'insta em!' && player.reloads[player.weapons[0]] === 0 && player.reloads[player.weapons[1]] === 0) {
        packet("6", "");
        my.autoAim = true;
        selectWeapon(player.weapons[0]);
        buyEquip(7, 0);
        sendAutoGather();
        game.tickBase(() => {
            selectWeapon(player.weapons[1]);
            buyEquip(player.reloads[53] === 0 ? 53 : 6, 0);
            game.tickBase(() => {
                sendAutoGather();
                my.autoAim = false;
            }, 3);
        }, 2);
    }
}

// MINIMAP:
function updateMinimap(data) {
    minimapData = data;
}

// SHOW ANIM TEXT:
function showText(x, y, value, type) {
    textManager.showText(x, y, 42, 0.18, 500, Math.abs(value), (value >= 0) ? "#fff" : "#8ecc51");
}
function showSettingText(life, setting) {
    textManager.showText(player.x, player.y, player.scale, 0.1, life, setting, "#fff");
}

// RENDER LEAF:
function renderLeaf(x, y, l, r, ctxt) {
    let endX = x + (l * Math.cos(r));
    let endY = y + (l * Math.sin(r));
    let width = l * 0.4;
    ctxt.moveTo(x, y);
    ctxt.beginPath();
    ctxt.quadraticCurveTo(((x + endX) / 2) + (width * Math.cos(r + Math.PI / 2)), ((y + endY) / 2) + (width * Math.sin(r + Math.PI / 2)), endX, endY);
    ctxt.quadraticCurveTo(((x + endX) / 2) - (width * Math.cos(r + Math.PI / 2)), ((y + endY) / 2) - (width * Math.sin(r + Math.PI / 2)), x, y);
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
    // let tmpMid = config.mapScale / 2;
    // let attempts = 0;
    // for (let i = 0; i < items.list.length * 3;) {
    //     if (attempts >= 1000) break;
    //     attempts++;
    //     let type = items.list[UTILS.randInt(0, items.list.length - 1)];
    //     let data = {
    //         x: tmpMid + UTILS.randFloat(-1000, 1000),
    //         y: tmpMid + UTILS.randFloat(-600, 600),
    //         dir: UTILS.fixTo(Math.random() * (Math.PI * 2), 2)
    //     };
    //     if (objectManager.checkItemLocation(data.x, data.y, type.scale, 0.6, type.id, true)) {
    //         objectManager.add(i, data.x, data.y, data.dir, type.scale, type.id, type);
    //     } else {
    //         continue;
    //     }
    //     i++;
    // }
}

const speed = 1;
// RENDER PLAYERS:
function renderDeadPlayers(f, d) {
    be.fillStyle = "#91b2db";
    const currentTime = Date.now();
    deadPlayers.filter(dead => dead.active).forEach((dead) => {
        if (!dead.startTime) {
            dead.startTime = currentTime;
            dead.angle = 0;
            dead.radius = 0.1;
        }
        const timeElapsed = currentTime - dead.startTime;
        const maxAlpha = 1;
        dead.alpha = Math.max(0, maxAlpha - (timeElapsed / 3000));
        dead.animate(delta);
        be.globalAlpha = dead.alpha;
        be.strokeStyle = outlineColor;
        be.save();
        be.translate(dead.x - f, dead.y - d);
        dead.radius -= 0.001;
        dead.angle += 0.0174533;
        const moveSpeed = 1;
        const x = dead.radius * Math.cos(dead.angle);
        const y = dead.radius * Math.sin(dead.angle);
        dead.x += x * moveSpeed;
        dead.y += y * moveSpeed;
        be.rotate(dead.angle);
        renderDeadPlayer(dead, be);
        be.restore();
        be.fillStyle = "#91b2db";
        if (timeElapsed >= 3000) {
            dead.active = false;
            dead.startTime = null;
        }
    });
}
// RENDER PLAYERS:
function renderPlayers(f, d, zIndex) {
    be.globalAlpha = 1;
    be.fillStyle = "#91b2db";
    for (var i = 0; i < players.length; ++i) {
        _ = players[i];
        if (_.zIndex == zIndex) {
            _.animate(delta);
            if (_.visible) {
                _.skinRot += (0.002 * delta);
                tmpDir = (_==player?getVisualDir():(_.dir || 0));
                be.save();
                be.translate(_.x - f, _.y - d);
                // RENDER PLAYER:
                be.rotate(tmpDir + _.dirPlus);
                renderPlayer(_, be);
                be.restore();
            }
        }
    }
}
// RENDER DEAD PLAYER:
function renderDeadPlayer(obj, ctxt) {
    ctxt = ctxt || mainContext;
    ctxt.lineWidth = outlineWidth;
    ctxt.lineJoin = "miter";
    let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS || 1);
    let oHandAngle = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndS || 1) : 1;
    let oHandDist = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndD || 1) : 1;

    ctxt.globalAlpha = 0;

    // WEAPON BELOW HANDS:
    if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
        renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
        if (items.weapons[obj.weaponIndex].projectile !== undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
            renderProjectile(obj.scale, 0, items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
        }
    }

    // HANDS:
    ctxt.fillStyle = "rgba(0, 0, 0, 0)";
    renderCircle(obj.scale * Math.cos(handAngle), obj.scale * Math.sin(handAngle), 14, ctxt);
    renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                 (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14, ctxt);

    // WEAPON ABOVE HANDS:
    if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
        renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant || 0].src || "", obj.scale, 0, ctxt);
        if (items.weapons[obj.weaponIndex].projectile !== undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
            renderProjectile(obj.scale, 0, items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
        }
    }

    // BUILD ITEM:
    if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
        renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
        if (items.weapons[obj.weaponIndex].projectile !== undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
            renderProjectile(obj.scale, 0, items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
        }
    }

    // BODY:
    ctxt.fillStyle = "rgba(0, 0, 0, 0)";
    renderCircle(0, 0, obj.scale, ctxt);

    // SKIN:
    if (obj.skinIndex > 0) {
        ctxt.rotate(Math.PI / 2);
        renderTextureSkin(obj.skinIndex, ctxt, null, obj);
    }

    ctxt.globalAlpha = 1;
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
        renderTailTextureImage(obj.tailIndex, ctxt, obj);
    }

    // WEAPON BELLOW HANDS:
    if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
        renderTool(items.weapons[katanaMusket ? 4 : obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
        if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
            renderProjectile(obj.scale, 0,
                             items.projectiles[items.weapons[obj.weaponIndex].projectile], be);
        }
    }

    // HANDS:
    ctxt.fillStyle = config.skinColors[obj.skinColor];
    renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
    renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                 (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);

    // WEAPON ABOVE HANDS:
    if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
        renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
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
        renderTextureSkin(obj.skinIndex, ctxt, null, obj);
    }

}

// RENDER NORMAL SKIN
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
        //tmpImage.src = "https://moomoo.io/img/hats/hat_" + index + ".png";
        tmpImage.src = "https://moomoo.io/img/hats/hat_" + index + ".png";
        skinSprites2[index] = tmpImage;
        tmpSkin = tmpImage;
    }
    var _ = parentSkin||skinPointers2[index];
    if (!_) {
        for (var i = 0; i < hats.length; ++i) {
            if (hats[i].id == index) {
                _ = hats[i];
                break;
            }
        }
        skinPointers2[index] = _;
    }
    if (tmpSkin.isLoaded)
        ctxt.drawImage(tmpSkin, -_.scale/2, -_.scale/2, _.scale, _.scale);
    if (!parentSkin && _.topSprite) {
        ctxt.save();
        ctxt.rotate(owner.skinRot);
        renderSkin2(index + "_top", ctxt, _, owner);
        ctxt.restore();
    }
}

// RENDER SKIN:
function renderTextureSkin(index, ctxt, parentSkin, owner) {
    if (!(tmpSkin = skinSprites[index + (txt ? "lol" : 0)])) {
        var tmpImage = new Image();
        tmpImage.onload = function() {
            this.isLoaded = true,
                this.onload = null
        }
            ,
            tmpImage.src = setSkinTextureImage(index, "hat", index),
            skinSprites[index + (txt ? "lol" : 0)] = tmpImage,
            tmpSkin = tmpImage
    }
    var _ = parentSkin||skinPointers[index];
    if (!_) {
        for (var i = 0; i < hats.length; ++i) {
            if (hats[i].id == index) {
                _ = hats[i];
                break;
            }
        }
        skinPointers[index] = _;
    }
    if (tmpSkin.isLoaded)
        ctxt.drawImage(tmpSkin, -_.scale/2, -_.scale/2, _.scale, _.scale);
    if (!parentSkin && _.topSprite) {
        ctxt.save();
        ctxt.rotate(owner.skinRot);
        renderSkin(index + "_top", ctxt, _, owner);
        ctxt.restore();
    }
}

var FlareZHat = {
    7: "",
    15: "",
    40: "",
    26: "",
    55: "",
    20: "",
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
var FlareZAcc = {
    21: "https://i.imgur.com/4ddZert.png",
    19: "https://i.imgur.com/sULkUZT.png",
};
function setTailTextureImage(id, type, id2) {
    if (true) {
        if(FlareZAcc[id] && type == "acc") {
            return FlareZAcc[id];
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
function renderTailTextureImage(index, ctxt, owner) {
    if (!(tmpSkin = accessSprites[index + (txt ? "lol" : 0)])) {
        var tmpImage = new Image();
        tmpImage.onload = function() {
            this.isLoaded = true,
                this.onload = null
        }
            ,
            tmpImage.src = setTailTextureImage(index, "acc"),//".././img/accessories/access_" + index + ".png";
            accessSprites[index + (txt ? "lol" : 0)] = tmpImage,
            tmpSkin = tmpImage;
    }
    var _ = accessPointers[index];
    if (!_) {
        for (var i = 0; i < accessories.length; ++i) {
            if (accessories[i].id == index) {
                _ = accessories[i];
                break;
            }
        }
        accessPointers[index] = _;
    }
    if (tmpSkin.isLoaded) {
        ctxt.save();
        ctxt.translate(-20 - (_.xOff||0), 0);
        if (_.spin)
            ctxt.rotate(owner.skinRot);
        ctxt.drawImage(tmpSkin, -(_.scale/2), -(_.scale/2), _.scale, _.scale);
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
    var _ = accessPointers2[index];
    if (!_) {
        for (var i = 0; i < accessories.length; ++i) {
            if (accessories[i].id == index) {
                _ = accessories[i];
                break;
            }
        }
        accessPointers2[index] = _;
    }
    if (tmpSkin.isLoaded) {
        ctxt.save();
        ctxt.translate(-20 - (_.xOff||0), 0);
        if (_.spin)
            ctxt.rotate(owner.skinRot);
        ctxt.drawImage(tmpSkin, -(_.scale/2), -(_.scale/2), _.scale, _.scale);
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
let projectileSprites = {};//fz iz zexy

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
    let tmpW = config.riverWidth + padding;
    let tmpY = (config.mapScale / 2) - d - (tmpW / 2);
    if (tmpY < maxScreenHeight && tmpY + tmpW > 0) {
        ctxt.fillRect(0, tmpY, maxScreenWidth, tmpW);
    }
}

// RENDER GAME OBJECTS:
let gameObjectSprites = {};

function getResSprite(obj) {
    let biomeID = (obj.y >= config.mapScale - config.snowBiomeTop) ? 2 : ((obj.y <= config.snowBiomeTop) ? 1 : 0);
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

        // Remove shadow effects
        tmpContext.shadowBlur = 0;
        tmpContext.shadowColor = 'rgba(0, 0, 0, 0)';

        if (obj.type == 0) { // Assuming type 0 represents tree-like objects
            let tmpScale;
            let tmpCount = UTILS.randInt(5, 7);
            tmpContext.globalAlpha = 1; // Ensure full opacity for trees
            for (let i = 0; i < 2; ++i) {
                tmpScale = _.scale * (!i ? 1 : 0.5);
                renderStar(tmpContext, tmpCount, tmpScale, tmpScale * 0.7);
                tmpContext.fillStyle = !biomeID ? (!i ? "#9ebf57" : "#b4db62") : (!i ? "#e3f1f4" : "#fff");
                tmpContext.fill();
                if (!i) {
                    tmpContext.stroke();
                }
            }
        } else if (obj.type == 1) { // Assuming type 1 represents berry bushes
            if (biomeID == 2) {
                tmpContext.fillStyle = "#606060";
                renderStar(tmpContext, 6, obj.scale * 0.3, obj.scale * 0.71);
                tmpContext.fill();
                tmpContext.stroke();

                tmpContext.fillStyle = "#89a54c"; // Bush color
                renderCircle(0, 0, obj.scale * 0.55, tmpContext);
                tmpContext.fillStyle = "#a5c65b"; // Inner circle color
                renderCircle(0, 0, obj.scale * 0.3, tmpContext, true);
            } else {
                renderBlob(tmpContext, 6, obj.scale, obj.scale * 0.7);
                tmpContext.fillStyle = biomeID ? "#e3f1f4" : "#89a54c"; // Bush color
                tmpContext.fill();
                tmpContext.stroke();

                tmpContext.fillStyle = biomeID ? "#6a64af" : "#c15555"; // Berry color
                let tmpRange;
                let berries = 4;
                let rotVal = (Math.PI * 2) / berries;
                for (let i = 0; i < berries; ++i) {
                    tmpRange = UTILS.randInt(obj.scale / 3.5, obj.scale / 2.3);
                    renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                 UTILS.randInt(10, 12), tmpContext);
                }
            }
        } else if (obj.type == 2 || obj.type == 3) { // Assuming type 2 and 3 represent other types of objects
            tmpContext.fillStyle = (obj.type == 2) ? (biomeID == 2 ? "#938d77" : "#939393") : "#e0c655";
            renderStar(tmpContext, 3, obj.scale, obj.scale);
            tmpContext.fill();
            tmpContext.stroke();

            tmpContext.fillStyle = (obj.type == 2) ? (biomeID == 2 ? "#b2ab90" : "#bcbcbc") : "#ebdca3";
            renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
            tmpContext.fill();
        }
        tmpSprite = tmpCanvas;
        gameObjectSprites[tmpIndex] = tmpSprite;
    }
    return tmpSprite;
}



// GET ITEM SPRITE:
let itemSprites = [];
function getItemSprite(obj, asIcon) {
    let tmpSprite = itemSprites[obj.id];
    if (!tmpSprite || asIcon) {
        let blurScale = !asIcon && isNight ? 15 : 0;
        let tmpCanvas = document.createElement("canvas");
        let reScale = ((!asIcon && obj.name == "windmill") ? items.list[4].scale : obj.scale);
        tmpCanvas.width = tmpCanvas.height = (reScale * 2.5) + outlineWidth + (items.list[obj.id].spritePadding || 0) + blurScale;
        let tmpContext = tmpCanvas.getContext("2d");
        tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
        tmpContext.rotate(asIcon ? 0 : (Math.PI / 2));
        tmpContext.strokeStyle = outlineColor;
        tmpContext.lineWidth = outlineWidth * (asIcon ? (tmpCanvas.width / 81) : 1);
        if (isNight && !asIcon) {
            tmpContext.shadowBlur = blurScale;
            tmpContext.shadowColor = `rgba(0, 0, 0, ${Math.min(obj.name == "pit trap" ? 0.6 : 0.3, obj.alpha)})`;
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
        tmpSprite = tmpCanvas;
        if (!asIcon) itemSprites[obj.id] = tmpSprite;
    }
    return tmpSprite;
}

function getItemSprite2(obj, tmpX, tmpY) {
    let tmpContext = be;
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
        let blurScale = isNight ? 15 : 0;
        let tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = tmpCanvas.height = obj.scale * 2.5 + outlineWidth + (items.list[obj.id].spritePadding || 0) + blurScale;
        let tmpContext = tmpCanvas.getContext("2d");
        tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
        tmpContext.rotate(Math.PI / 2);
        tmpContext.strokeStyle = outlineColor;
        tmpContext.lineWidth = outlineWidth;
        if (isNight) {
            tmpContext.shadowBlur = blurScale;
            tmpContext.shadowColor = `rgba(0, 0, 0, ${Math.min(0.3, obj.alpha)})`;
        }
        //
if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
    // Set the fill color based on the object name
    tmpContext.fillStyle = obj.name == "poison spikes" ? "#7b935d" : "#939393";
    let tmpScale = obj.scale * 0.6;

    // Draw the star
    renderStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
    tmpContext.fill();
    tmpContext.stroke();

    // Set the shadow properties for the glow effect
    tmpContext.shadowColor = "rgba(255, 0, 0, 0.8)"; // Red color with high opacity
    tmpContext.shadowBlur = 20; // Intensity of the glow
    tmpContext.shadowOffsetX = 0; // Offset for the shadow
    tmpContext.shadowOffsetY = 0;

    // Draw the circle with the glow effect
    tmpContext.fillStyle = "#a5974c"; // Base color of the circle
    renderCircle(0, 0, tmpScale, tmpContext); // Draw the outer circle

    // Reset shadow properties to avoid affecting other drawings
    tmpContext.shadowColor = "transparent";
    tmpContext.shadowBlur = 0;
    tmpContext.shadowOffsetX = 0;
    tmpContext.shadowOffsetY = 0;

//
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
    be.globalAlpha = 0.2;
    tmpContext.strokeStyle = outlineColor;
    tmpContext.save();
    tmpContext.translate(tmpX, tmpY);
    tmpContext.rotate(90**10);
    if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
        tmpContext.fillStyle = (obj.name == "poison spikes")?"#7b935d":"#939393";
        var tmpScale = (obj.scale);
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
    liztobj.forEach((tmp) => {
        _ = tmp;
        if (_.active && liztobj.includes(tmp) && _.render) {
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
        }
    });


    // PLACE VISIBLE:
    if (layer == 0) {
        if (placeVisible.length) {
            placeVisible.forEach((places) => {
                tmpX = places.x - f;
                tmpY = places.y - d;
                markObject(places, tmpX, tmpY, places.color);
            });
        }
    }
}

function markObject(_, tmpX, tmpY, color) {
    yen(_, tmpX, tmpY, color);
}

function yen(_, x, y, color) {
    be.fillStyle = color == 1 ? "#ff8080" : "#8080ff";
    be.strokeStyle = color == 1 ? "#5f3030" : "#30305f";
    be.lineWidth = 5;

    // animation life
    const radius = 50 + Math.sin(Date.now() * 0.01) * 2;
    const opacity = 0.6 + Math.sin(Date.now() * 0.02) * 0.1;

    be.beginPath();
    be.arc(x, y, radius, 0, Math.PI * 2);
    be.globalAlpha = opacity;
    be.fill();
    be.globalAlpha = opacity * 0.7;
    be.stroke();
    be.closePath();
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
        tmpPing = new MapPing("#fff", config.mapPingScale);
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

        // RENDER BREAK TRACKS:
        mapContext.globalAlpha = 1;
        mapContext.fillStyle = "#ff0000";
        if (breakTrackers.length) {
            mapContext.fillStyle = "#abcdef";
            mapContext.font = "px Hammersmith One";
            mapContext.textBaseline = "middle";
            mapContext.textAlign = "center";
            for (let i = 0; i < breakTrackers.length;) {
                mapContext.fillText("!", (breakTrackers[i].x / config.mapScale) * mapDisplay.width,
                                    (breakTrackers[i].y / config.mapScale) * mapDisplay.height);
                i += 2;
            }
        }

        // RENDER PLAYERS:
        mapContext.globalAlpha = 1;
        mapContext.fillStyle = "#fff";
        renderCircle((player.x / config.mapScale) * mapDisplay.width,
                     (player.y / config.mapScale) * mapDisplay.height, 7, mapContext, true);
        mapContext.fillStyle = "rgba(255,255,255,0.35)";
        if (player.team && minimapData) {
            for (let i = 0; i < minimapData.length;) {
                renderCircle((minimapData[i] / config.mapScale) * mapDisplay.width,
                             (minimapData[i + 1] / config.mapScale) * mapDisplay.height, 7, mapContext, true);
                i += 2;
            }
        }

        // DEATH LOCATION:
        if (lastDeath) {
            mapContext.fillStyle = "#fc5553";
            mapContext.font = "32px Hammersmith One";
            mapContext.textBaseline = "middle";
            mapContext.textAlign = "center";
            mapContext.fillText("x", (lastDeath.x / config.mapScale) * mapDisplay.width,
                                (lastDeath.y / config.mapScale) * mapDisplay.height);
        }

        // MAP MARKER:
        if (mapMarker) {
            mapContext.fillStyle = "#fff";
            mapContext.font = "32px Hammersmith One";
            mapContext.textBaseline = "middle";
            mapContext.textAlign = "center";
            mapContext.fillText("x", (mapMarker.x / config.mapScale) * mapDisplay.width,
                                (mapMarker.y / config.mapScale) * mapDisplay.height);
        }
    }
}

// ICONS:
let crossHairs = ["https://cdn.discordapp.com/attachments/1001384433078779927/1149285738412769300/newawwddd.png", "https://cdn.discordapp.com/attachments/1001384433078779927/1149285168780165170/100px-Crosshairs_Red.png"];
let crossHairSprites = {};
let iconSprites = {};
let icons = ["crown", "skull"];

function loadIcons() {
    for (let i = 0; i < icons.length; ++i) {
        let tmpSprite = new Image();
        tmpSprite.onload = function() {
            this.isLoaded = true;
        };
        tmpSprite.src = "https://cdn.discordapp.com/attachments/1001384433078779927/1149285738412769300/newawwddd.png" + icons[i] + "https://cdn.discordapp.com/attachments/1001384433078779927/1149285738412769300/newawwddd.png";
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

function cdf (e, t){
    try {
        return Math.hypot((t.y2||t.y)-(e.y2||e.y), (t.x2||t.x)-(e.x2||e.x));
    } catch(e){
        return Infinity;
    }
}

// UPDATE GAME:
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

    // if (config.resetRender) {
    be.beginPath();
    be.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    // }
    be.globalAlpha = 1;

                    // MOVE CAMERA:
                    if (player) {
                        if (false) {
                            camX = player.x;
                            camY = player.y;
                        }
                    } else {
                        camX = config.mapScale / 2 + config.riverWidth;
                        camY = config.mapScale / 2;
                    }
                    function updateCamera() {
                        let selectedCamera = document.getElementById("visualType").value;
                        let damping = 0.35;
                        let scalingFactor = 20;
                        if (player) {
                            if (selectedCamera === 'Cam1') {
                                let targetCamX = player.x + ((mouseX - 1920 / 2) / scalingFactor);
                                let targetCamY = player.y + ((mouseY - 1920 / 2) / scalingFactor);
                                camX += (targetCamX - camX) * damping;
                                camY += (targetCamY - camY) * damping;
                            } else if (selectedCamera === 'Cam0') {
                                let damping = 0.15;
                                let targetCamX = player.x + ((1920 / 2) / 30);
                                let targetCamY = player.y + ((1920 / 2) / 30);
                                camX += (targetCamX - camX) * damping;
                                camY += (targetCamY - camY) * damping;
                            } else if (selectedCamera === 'Cam2' || selectedCamera === 'Cam3') {
                                let damping2 = 0.016;
                                if (player) {
                                    let targetCamX = player.x + ((1920 / 2) / 30);
                                    let targetCamY = player.y + ((1920 / 2) / 30);
                                    camX = lerp(camX, targetCamX, damping2);
                                    camY = lerp(camY, targetCamY, damping2);
                                } else {
                                    camX = config.mapScale / 2;
                                    camY = config.mapScale / 2;
                                }
                            }
                        } else {
                            camX = config.mapScale / 2;
                            camY = config.mapScale / 2;
                        }
                    }
                    updateCamera()
                    document.getElementById("visualType").addEventListener("change", updateCamera);
                    function lerp(start, end, amt) {
                        return (1 - amt) * start + amt * end;
                    }


    // INTERPOLATE PLAYERS AND AI:
    let lastTime = now - (1000 / config.serverUpdateRate);
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
                if (config.anotherVisual) {
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

    // RENDER BACKGROUND:
    if (config.snowBiomeTop - d <= 0 && config.mapScale - config.snowBiomeTop - d >= maxScreenHeight) {
        be.fillStyle = "#b6db66";
        be.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.mapScale - config.snowBiomeTop - d <= 0) {
        be.fillStyle = "#dbc666";
        be.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.snowBiomeTop - d >= maxScreenHeight) {
        be.fillStyle = "#fff";
        be.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.snowBiomeTop - d >= 0) {
        be.fillStyle = "#fff";
        be.fillRect(0, 0, maxScreenWidth, config.snowBiomeTop - d);
        be.fillStyle = "#b6db66";
        be.fillRect(0, config.snowBiomeTop - d, maxScreenWidth,
                    maxScreenHeight - (config.snowBiomeTop - d));
    } else {
        be.fillStyle = "#b6db66";
        be.fillRect(0, 0, maxScreenWidth,
                    (config.mapScale - config.snowBiomeTop - d));
        be.fillStyle = "#dbc666";
        be.fillRect(0, (config.mapScale - config.snowBiomeTop - d), maxScreenWidth,
                    maxScreenHeight - (config.mapScale - config.snowBiomeTop - d));
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
        be.globalAlpha = 1;
        be.fillStyle = "#dbc666";
        renderWaterBodies(f, d, be, config.riverPadding);
        be.fillStyle = "#91b2db";
        renderWaterBodies(f, d, be, (waterMult - 1) * 250);
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
    for (let i = 0; i < ais.length; ++i) {
        _ = ais[i];
        if (_.active && _.visible) {
            _.animate(delta);
            be.save();
            be.translate(_.x - f, _.y - d);
            be.rotate(_.dir + _.dirPlus - (Math.PI / 2));
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
    if (config.mapScale - f <= maxScreenWidth) {
        let tmpY = Math.max(0, -d);
        be.fillRect(config.mapScale - f, tmpY, maxScreenWidth - (config.mapScale - f), maxScreenHeight - tmpY);
    }
    if (d <= 0) {
        be.fillRect(-f, 0, maxScreenWidth + f, -d);
    }
    if (config.mapScale - d <= maxScreenHeight) {
        let tmpX = Math.max(0, -f);
        let tmpMin = 0;
        if (config.mapScale - f <= maxScreenWidth) tmpMin = maxScreenWidth - (config.mapScale - f);
        be.fillRect(tmpX, config.mapScale - d, (maxScreenWidth - tmpX) - tmpMin, maxScreenHeight - (config.mapScale - d));
    }

    // RENDER DAY/NIGHT TIME:
    be.globalAlpha = 1;
    be.fillStyle = "rgba(12, 0, 80, 0.35)";
    be.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    be.strokeStyle = darkOutlineColor;

    // RENDER PLAYER AND AI UI:
    be.strokeStyle = darkOutlineColor;
    be.globalAlpha = 1;
    for (let i = 0; i < players.length + ais.length; ++i) {
        _ = players[i] || ais[i - players.length];
        if (_.visible) {
            be.strokeStyle = darkOutlineColor;

            // NAME AND HEALTH:
            if (_.skinIndex != 10 || (_==player) || (_.team && _.team==player.team)) {
                let tmpText = (_.team?"["+_.team+"] ":"")+(_.name||"");
                if (tmpText != "") {
                    be.font = (_.nameScale||30) + "px Hammersmith One";
                    be.fillStyle = "#fff";
                    be.textBaseline = "middle";
                    be.textAlign = "center";
                    be.lineWidth = (_.nameScale?11:8);
                    be.lineJoin = "round";
                    be.strokeText(tmpText, _.x - f, (_.y - d - _.scale) - config.nameY);
                    be.fillText(tmpText, _.x - f, (_.y - d - _.scale) - config.nameY);
                    if (_.isLeader && iconSprites["crown"].isLoaded) {
                        let tmpS = config.crownIconScale;
                        let tmpX = _.x - f - (tmpS/2) - (be.measureText(tmpText).width / 2) - config.crownPad;
                        be.drawImage(iconSprites["crown"], tmpX, (_.y - d - _.scale)
                                     - config.nameY - (tmpS/2) - 5, tmpS, tmpS);
                    } if (_.iconIndex == 1 && iconSprites["skull"].isLoaded) {
                        let tmpS = config.crownIconScale;
                        let tmpX = _.x - f - (tmpS/2) + (be.measureText(tmpText).width / 2) + config.crownPad;
                        be.drawImage(iconSprites["skull"], tmpX, (_.y - d - _.scale)
                                     - config.nameY - (tmpS/2) - 5, tmpS, tmpS);
                    } if (_.isPlayer && instaC.wait && near == _ && (_.backupNobull ? crossHairSprites[1].isLoaded : crossHairSprites[0].isLoaded) && enemy.length && !useWasd) {
                        let tmpS = _.scale * 2.2;
                        be.drawImage((_.backupNobull ? crossHairSprites[1] : crossHairSprites[0]), _.x - f - tmpS / 2, _.y - d - tmpS / 2, tmpS, tmpS);
                    }
                }





                if (_.health > 0) {

// HEALTH BAR:
if (!_.displayHealth) _.displayHealth = _.health;
const healthLerpSpeed = 0.25;
_.displayHealth += (_.health - _.displayHealth) * healthLerpSpeed;

let hpOffset = _.isPlayer ? -6 : -30;
const uWidth = 40;

// Draw health bar
be.fillStyle = darkOutlineColor;
be.roundRect(_.x - f - uWidth - config.healthBarPad + 2, hpOffset + _.y - d + _.scale + config.nameY + 1.9, (uWidth-2) * 2 + config.healthBarPad * 2, 12, 8);
be.fill();
be.fillStyle = (_ == player || (_.team && _.team == player.team)) ? "#8ecc51" : "#cc5151";
be.roundRect(_.x - f - uWidth, hpOffset + _.y - d + _.scale + config.nameY + config.healthBarPad, uWidth * 2 * (_.displayHealth / _.maxHealth), 16 - config.healthBarPad * 2, 7);
be.fill();

if (_.isPlayer) {
    be.globalAlpha = 1;

    let targetReloads = {
        primary: (_.primaryIndex === undefined ? 1 : ((items.weapons[_.primaryIndex].speed - _.reloads[_.primaryIndex]) / items.weapons[_.primaryIndex].speed)),
        secondary: (_.secondaryIndex === undefined ? 1 : ((items.weapons[_.secondaryIndex].speed - _.reloads[_.secondaryIndex]) / items.weapons[_.secondaryIndex].speed)),
        turret: (2500 - _.reloads[53]) / 2500
    };

    if (!_.currentReloads) {
        _.currentReloads = {
            primary: targetReloads.primary,
            secondary: targetReloads.secondary,
            turret: targetReloads.turret
        };
    }

    _.currentReloads.primary += (targetReloads.primary - _.currentReloads.primary) * 0.5;
    _.currentReloads.secondary += (targetReloads.secondary - _.currentReloads.secondary) * 0.5;
    _.currentReloads.turret += (targetReloads.turret - _.currentReloads.turret) * 0.5;

    if (true) {
        function addBar(addX, addY, magicCurr, color) {
            let o = config;
            let reloadBarWidth = o.healthBarWidth - o.healthBarPad * 2;
            let uWidth = -2;

            // Draw the holder of the reload bar with fully transparent color
            be.fillStyle = `rgba(0, 0, 0, 0)`; // Fully transparent color
            be.roundRect(_.x - f - uWidth - o.healthBarWidth - o.healthBarPad + addX, _.y - d + _.scale + o.nameY + addY, (uWidth - 6) + reloadBarWidth + o.healthBarPad * 2, 8, 8);
            be.fill();

            // Draw the reload bar with fully transparent color
            be.fillStyle = `rgba(0, 0, 0, 0)`; // Fully transparent color
            let Width = reloadBarWidth * magicCurr;
            be.roundRect(_.x - f - uWidth - o.healthBarWidth + addX - 3, _.y - d + _.scale + o.nameY + addY + o.healthBarPad - 3, uWidth + Width, 14 - o.healthBarPad * 2, 7);
            be.fill();
        }

        // Call addBar with transparent color for reload bars
        if (_ == player) {
            if (player.weapons[1]) addBar(51.4, 6, _.currentReloads.secondary, `rgba(0, 0, 0, 0)`); // Fully transparent color
            addBar(11.2, 6, _.currentReloads.primary, `rgba(0, 0, 0, 0)`); // Fully transparent color
                            }
                        }

                    }
                }
            }
        }
    }

function drawGradient() {
    be.save();
    be.globalAlpha = 1;
    let screenW = maxScreenWidth / 2;
    let screenH = maxScreenHeight / 2;
    let opacity = 0.7;
    let increment = 0.02;
    be.beginPath();
    let gradient = be.createRadialGradient(screenW, screenH, 0, screenW, screenH, maxScreenWidth);
    gradient.addColorStop(0, "rgba(24, 0, 83, .3)"); // Semi-transparent start color
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // Fully transparent end color
    be.fillStyle = gradient;

    be.rect(0, 0, maxScreenWidth, maxScreenHeight);
    be.fill();
    opacity += increment;
    if (opacity >= 0.9 || opacity <= 0.3) {
        increment = -increment;
    }
    be.restore();
}

if (true) {
    drawGradient();
}




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
                be.fillText(_.chatMessage, tmpX, tmpY);
            }
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
            } else {
                _.chat.count = 0;

            }
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
window.rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
    window.setTimeout(callback, 1000 / 9);
};

function doUpdate() {
    //rape modulus
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

    getEl("pingFps").innerHTML = `${window.pingTime}ms | Fps: ${Math.round(fpsTimer.ltime)}`;
    getEl("packetStatus").innerHTML = secPacket;
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
                getEl("visualType").disabled = boolean;
toggleUseless(useWasd);
            }
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
window.toggleBotsCircle = function() {
    player.circle = !player.circle;
};
window.toggleVisual = function() {
    config.anotherVisual = !config.anotherVisual;
    gameObjects.forEach((tmp) => {
        if (tmp.active) {
            tmp.dir = tmp.lastDir;
        }
    });
};
const maxFPS = 300;
Object.defineProperty(HTMLVideoElement.prototype, 'webkitDecodedFrameCount', {
    set: function() {},
    get: function() {
        return maxFPS;
    }
});
window.prepareUI = function(_) {
    resize();
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
                tmpSprite.onload = function () {
                    this.isLoaded = true;
                    let tmpPad = 1 / (this.height / this.width);
                    let tmpMlt = (items.weapons[i].iPad || 1);
                    tmpContext.drawImage(this, -(tmpCanvas.width * tmpMlt * config.iconPad * tmpPad) / 2, -(tmpCanvas.height * tmpMlt * config.iconPad) / 2,
                                         tmpCanvas.width * tmpMlt * tmpPad * config.iconPad, tmpCanvas.height * tmpMlt * config.iconPad);
                    tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                    tmpContext.globalCompositeOperation = "source-atop";
                    tmpContext.fillRect(-tmpCanvas.width / 2, -tmpCanvas.height / 2, tmpCanvas.width, tmpCanvas.height);
                    let actionBarItem = getEl('actionBarItem' + i);
                    let imgContainer = document.createElement("div");
                    //imgContainer.className = "img-container";
                    //actionBarItem.appendChild(imgContainer);
                    //imgContainer.style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                    //imgContainer.style.animation = "rotate 4.5s linear infinite";
                    getEl('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                };
                tmpSprite.src = "./../img/weapons/" + items.weapons[i].src + ".png";
                let tmpUnit = getEl('actionBarItem' + i);
                tmpUnit.onclick = UTILS.checkTrusted(function() {
                    selectWeapon(_.weapons[items.weapons[i].type]);
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
                tmpUnit.onclick = UTILS.checkTrusted(function () {
                    selectToBuild(_.items[_.getItemType(i - items.weapons.length)]);
                });
                UTILS.hookTouchEvents(tmpUnit);
            }
        })(i);
    }
};
