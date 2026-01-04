// ==UserScript==
// @name        Moomoo.io 1.8.0 JS-AutoHeal & Interactive Menu
// @version     2
// @description Toggle Autoheal using "P", open the menu with "Esc" to adjust speed, multiplier, or HP Umbral.
// @author      Seryo
// @match       *://*.moomoo.io/*
// @namespace   https://greasyfork.org/users/1190411
// @icon        https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @grant       none
// @license     MIT
// @require     https://greasyfork.org/scripts/440839-moomoo-items/code/MooMoo%20Items.js?version=1023778
// @require     https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js?version=1005014
// @downloadURL https://update.greasyfork.org/scripts/481032/Moomooio%20180%20JS-AutoHeal%20%20Interactive%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/481032/Moomooio%20180%20JS-AutoHeal%20%20Interactive%20Menu.meta.js
// ==/UserScript==

let autoHealEnabled = true;
let menuVisible = false;
let speed = { hotKey: "" };
let hp = { hotKey: "" };
let multiplier = { hotKey: "" };

function restoreMenuValues() {
    document.getElementById('hpInput').value = this.hotkeys.settings.heal.hp !== undefined ? this.hotkeys.settings.heal.hp : '86';
    document.getElementById('speedInput').value = this.hotkeys.settings.heal.speed !== undefined ? this.hotkeys.settings.heal.speed : '125';
    document.getElementById('multiplierInput').value = this.hotkeys.settings.heal.multiplier !== undefined ? this.hotkeys.settings.heal.multiplier : '2';
}

function hideElements() {
    const leaderboard = document.getElementById('leaderboard');
    const killCounter = document.getElementById('killCounter');

    if (leaderboard) {
        leaderboard.style.display = 'none';
    }
    if (killCounter) {
        killCounter.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    hideElements();
    MooMoo.appendMenu();
    MooMoo.restoreMenuValues();
});

function isChatOpen() {
    return document.activeElement.id.toLowerCase() === 'chatbox';
}

function isAllianceInputActive() {
    return document.activeElement.id.toLowerCase() === 'allianceinput';
}

function shouldHandleHotkeys() {
    return !isChatOpen() && !isAllianceInputActive();
}

function updateAutoHealStateText() {
    const stateText = document.getElementById('autoHealState');
    if (stateText) {
        stateText.textContent = autoHealEnabled ? 'On' : 'Off';
    }
}

class MooMoo {
    static updateSettings() {
    const hp = parseInt(document.getElementById('hpInput').value);
    const speed = parseInt(document.getElementById('speedInput').value);
    const multiplier = parseInt(document.getElementById('multiplierInput').value);

    this.hotkeys.settings.heal.hp = hp;
    this.hotkeys.settings.heal.speed = speed;
    this.hotkeys.settings.heal.multiplier = multiplier;

    localStorage.setItem('moomoo_settings', JSON.stringify(this.hotkeys.settings));

    document.getElementById('hpValue').textContent = `${hp}`;
    document.getElementById('speedValue').textContent = `${speed}`;
    document.getElementById('multiplierValue').textContent = `${multiplier}`;
}

     static loadSettings() {
    const savedSettings = localStorage.getItem('moomoo_settings');
    if (savedSettings) {
        this.hotkeys.settings = JSON.parse(savedSettings);
        this.restoreMenuValues();
    }

    document.getElementById('hpInput').value = this.hotkeys.settings.heal.hp !== undefined ? this.hotkeys.settings.heal.hp : 'none';
    document.getElementById('speedInput').value = this.hotkeys.settings.heal.speed !== undefined ? this.hotkeys.settings.heal.speed : 'none';
    document.getElementById('multiplierInput').value = this.hotkeys.settings.heal.multiplier !== undefined ? this.hotkeys.settings.heal.multiplier : 'none';
}


    static appendMenu() {
    const menuDiv = document.createElement('div');
    menuDiv.id = 'moomooMenu';
    menuDiv.innerHTML = `
    <h2 style="text-align: center; font-size: 28px;">Autoheal <span id="autoHealState">On</span></h2>
    <hr>
    <label for="hpInput">HP Umbral</label>
    <input type="number" id="hpInput" oninput="this.value = this.value.slice(0, 3)" value="86">
    <span id="hpValue"></span>
    <hr>
    <label for="speedInput">Speed</label>
    <input type="number" id="speedInput" oninput="this.value = this.value.slice(0, 4)" value="125">
    <span id="speedValue"></span>
    <hr>
    <label for="multiplierInput">Multiplier</label>
    <input type="number" id="multiplierInput" oninput="this.value = this.value.slice(0, 2)" value="2">
    <span id="multiplierValue"></span>
`;

    menuDiv.style.display = 'none';
    menuDiv.style.background = 'rgba(0, 0, 0, 0.8';
    menuDiv.style.fontFamily = 'Hammersmith One, sans-serif';
    menuDiv.style.position = 'fixed';
    menuDiv.style.top = '20px';
    menuDiv.style.right = '20px';
    menuDiv.style.border = '1px solid #000';
    menuDiv.style.borderRadius = '8px';
    menuDiv.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.25)';
    menuDiv.style.boxShadow = '5px 5px 10px rgba(0, 0, 0, 0.4)';
    menuDiv.style.width = '216px';
    menuDiv.style.color = '#fff';
    menuDiv.style.fontSize = '17px';
    menuDiv.style.zIndex = '1000';
    menuDiv.style.overflowY = 'auto';
    menuDiv.style.padding = '10px';

    document.body.appendChild(menuDiv);
document.getElementById('hpInput').classList.add('menu-input');
        document.getElementById('speedInput').classList.add('menu-input');
        document.getElementById('multiplierInput').classList.add('menu-input');

        document.querySelectorAll('.menu-input').forEach((input) => {
            input.addEventListener('focus', () => {
                input.addEventListener('input', handleNumericInput);
            });
            input.addEventListener('blur', () => {
                input.removeEventListener('input', handleNumericInput);
            });
        });
document.getElementById('hpInput').style.width = "41px";
document.getElementById('speedInput').style.width = "49px";
document.getElementById('multiplierInput').style.width = "33px";
}

    static saveSettings() {
    this.updateSettings();

    // Hide the menu after saving settings
    const menu = document.getElementById('moomooMenu');
    if (menu) {
        menu.style.display = 'none';
    }

    // Show the hidden elements
    const leaderboard = document.getElementById('leaderboard');
    const killCounter = document.getElementById('killCounter');
    if (leaderboard) {
        leaderboard.style.display = 'block';
    }
    if (killCounter) {
        killCounter.style.display = 'block';
    }
}

    static get hotkeys() {
        return {
            settings: {
                heal: {
                    speed: speed.hotKey,
                    hp: hp.hotKey,
                    multiplier: multiplier.hotKey
                }
            }
        };
    }
    static set forcedisablecps(arg) {
        this.forcedisable = arg
    }
    static fixweaponswap() {
        let keys = ['1', '2']
        let local = this;
        let items = window.items
        let spammers = this.spammers
        for(let i in keys) {
            document.addEventListener('keydown', e => {
                if(document.activeElement.type == "text") return;
                if(e.key == keys[i]) {
                    switch(keys[i]) {
                        case '1':
                            for(let i = 0; i < 10; i++) {
                                setTimeout(() => {
                                    local.sendws(["G", [items.primary, true]])
                                }, i*2)
                            }
                            break;
                        case '2':
                            for(let i = 0; i < 10; i++) {
                                setTimeout(() => {
                                    local.sendws(["G", [items.secondary, true]])
                                }, i*2)
                            }
                    }
                }
            })
        }
    }
    static init(arg) {
        this.fixweaponswap()
        this.antiinvis();
        this.canvas = document.getElementById("gameCanvas");
        this.initplayer();
        this.getkeys();
        this.setmouse()
        this.initspammer();
        this.spammers = {};
        this.result = "";
        this.initcps();
        this.cps = 0;
        this.doc = document;
        this.initlisteners;
        this.id = `#${arg.match(/d="?g(.*)?I/g)[0].match(/(?=g).*(?=)/)[0]}`
        window.addEventListener("load", function(event) {
            MooMoo.initHTML;
        })
    }
    static get getalpha() {
        this.alpha = Array.from(Array(26)).map((e, i) => i + 65).map((x) => String.fromCharCode(x));
        for(let i in this.alpha) {
            this.result += this.alpha[i]
        }
        return this.result.toLocaleLowerCase();
    }
    static getkeys() {
        this.lts = new Array();
        this.lts.push(this.getalpha.match(/v([\s\S]*)w/g)[0].split("v")[1])
        this.lts.push(this.getalpha.match(/(.+(?=[b])|(?<=str).+)/g)[0].split('d')[2].split('a')[0])
        this.lts.push(this.getalpha.match(/\m(.*?)\o/))[0]
        this.lts.push(this.getalpha.match(/(?=d).*(?=e)/g)[0].split("c")[1].split('')[0])
    }
    static get initlisteners() {
        this.doc.onkeydown = function(e) {
            if(document.activeElement.type == "text") return;
            MooMoo.handleKeyDown(e)
        };
        this.doc.onkeyup = function(e) {
            if(document.activeElement.type == "text") return;
            MooMoo.handleKeyUp(e)
        }
    }
    static antiinvis() {
        CanvasRenderingContext2D.prototype.rotatef = CanvasRenderingContext2D.prototype.rotate
        CanvasRenderingContext2D.prototype.rotate = function(e){
            if(Math.abs(e) > 1e300){
                e = Math.atan2(Math.cos(e), Math.sin(e));
                this.globalAlpha = 0.5;
                this.rotatef(e);
            }else{
                this.rotatef(e);
            }
        };
    }
    static get() {
        return new Promise(resolve => {
            fetch(arguments[0]).then(res => res.text()).then(res => {
                return resolve(res);
            });
        });
    }
    static ioinit() {
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.canvas.addEventListener("mousemove", e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    static setws (args) {
        this.ws = args
    }
    static get initHTML() {
        this.appendMenu();

    }
    static initplayer() {
        this.player = {
            id: null,
            weapon: null
        }
    }
    static setmouse() {
        this.mouse = {
            x: null,
            y: null
        }
    }
    static checkelement(e) {
        return (e.offsetParent !== null);
    }
    static handleHit(arg) {
        switch(this.decode(arg)[1][0]) {
            case 1:
                this.handleCPS()
        }
    }
    static handleCPS() {
        this.initcps();
        this.cps++
        setTimeout(() => {
            this.initcps();
            this.cps--
        }, 1000)
    }
    static sendws(sender) {
        this.ws.send(new Uint8Array(Array.from(msgpack.encode(sender))));
    }
    static getnormalangle() {
        return Math.atan2(this.mouse.y - this.height / 2, this.mouse.x - this.width / 2)
    }
    static hit(angle) {
        this.sendws(["d", [1, angle]]);
        this.sendws(["d", [0, angle]]);
    }
    static placeitem(id, angle = this.getnormalangle()) {
        this.sendws(["G", [id, null]]);
        this.hit(angle)
        this.createfakeclick()
        this.sendws(["G", [this.player.weapon, true]]);

    }
    static placefood(id) {
        this.sendws(["G", [id, null]]);
        this.hit(this.getnormalangle())
        this.createfoodpress();
        this.sendws(["G", [this.player.weapon, true]]);
    }
    static item1 (data) {
        if(!this.player.id) {
            this.player.id = data[1];
            console.log(this.player)
        }
    }
    static updateplayer(data) {
        this.rndata = data
        for (let i = 0; i < this.rndata[1].length / 13; i++) {
            this.playerInfo = this.rndata[1].slice(13 * i, 13 * i + 13);
            if (this.playerInfo[0] == this.player.id) {
                this.player.weapon = this.playerInfo[5];
            }
        }
    }
    static doautoheal(data) {
    let items = window.items;
    if (autoHealEnabled) {
        if (data[2] < 60) {
            return;
        } else if (data[2] >= 60 && data[2] <= 85) {
            setTimeout(() => {
                for (let i = 0; i < 1; i++) {
                    this.placefood(items.food);
                }
            }, 350);
        } else if (data[2] > 85) {
            return;
        }
    }
}
    static getwsmessage(message) {
        let temp = this.decode(new Uint8Array(message.data));
        let data;
    if (temp.length > 1) {
        data = [temp[0], ...temp[1]];
        if (data[1] instanceof Array) {
            data = data;
        }
    } else {
        data = temp;
    }
        let item = data[0];
        if (!data) {
            return;
        }
        if (item === "io-init") {
            this.ioinit();
        }
        if (item == "C") {
            this.item1(data);
        }
        if (item == "a") {
            this.updateplayer(data);
        }
        switch (item) {
            case '8':
                console.log(data);
                break;
            case 'O':
                if (data[1] == this.player.id) {
                    if (data[2] === 'autoheal: on') {
                        autoHealEnabled = true;
                        console.log("AutoHeal is now ON");
                    } else if (data[2] === 'autoheal: off') {
                        autoHealEnabled = false;
                        console.log("AutoHeal is now OFF");
                    } else {
                        this.doautoheal(data);
                    }
                }
                break;
        }
    }

    static doautoheal(data) {
    let items = window.items;
    if (autoHealEnabled) {
        const hpThreshold = parseInt(document.getElementById('hpInput').value);
        const healSpeed = parseInt(document.getElementById('speedInput').value);
        const healMultiplier = parseInt(document.getElementById('multiplierInput').value);

        if (data[2] < hpThreshold) {
            setTimeout(() => {
                for (let i = 0; i < healMultiplier; i++) {
                    this.placefood(items.food);
                }
            }, healSpeed);
        }
    }
}
    static decode(arg) {
        return msgpack.decode(arg)
    }
    static initspammer() {
        this.spammers = {};
        let spammers = this.spammers;

        document.addEventListener('keydown', (e) => {
            if (document.activeElement.id.toLocaleLowerCase() !== 'chatbox' && document.activeElement.id.toLocaleLowerCase() !== 'mainMenu') {
                spammers.food.start(e.key);
            }
        });

        document.addEventListener('keyup', (e) => {
            if(document.activeElement.type == "text") return;
            spammers.food.stop(e.key);
        });
    }
    static append() {
        $(this.id).append(arguments[0])
    }
    static getelement() {
        return document.getElementById(arguments[0])
    }
    static initcps() {
        if(!this.getelement("cpsdisplay")) return;
        this.getelement("cpsdisplay").textContent = "CPS: " + this.cps
    }
    static createfakeclick() {
        setTimeout(() => {
            MooMoo.addAttribute("kdisp-RButton")
            setTimeout(() => {
                MooMoo.deleteAttribute("kdisp-RButton")
            }, 50)
        }, 50)
    }
    static createfakeclick() {
        setTimeout(() => {
            MooMoo.addAttribute("kdisp-RButton")
            setTimeout(() => {
                MooMoo.deleteAttribute("kdisp-RButton")
            }, 50)
        }, 50)
    }
    static createfoodpress() {
        setTimeout(() => {
            this.addAttribute("kdisp-food")
            setTimeout(() => {
                this.deleteAttribute("kdisp-food")
            }, 50)
        }, 50)
        setTimeout(() => {
            this.addAttribute("kdisp-RButton")
            setTimeout(() => {
                this.deleteAttribute("kdisp-RButton")
            }, 50)
        }, 50)
    }
}

document.addEventListener('keydown', (e) => {
    if (e.keyCode === 80 && shouldHandleHotkeys()) {
        autoHealEnabled = !autoHealEnabled;
        document.title = autoHealEnabled ? "𝙷𝚎𝚊𝚕 𝙾𝙽" : "𝙷𝚎𝚊𝚕 𝙾𝙵𝙵";
        console.log("AutoHeal is now " + (autoHealEnabled ? "ON" : "OFF"));

        updateAutoHealStateText();
    }
});

function toggleMenu() {
    const menu = document.getElementById('moomooMenu');
    if (menu) {
        if (menu.style.display === 'none') {
            menu.style.display = 'block';
            menuVisible = true;
            hideElements();
        } else {
            menu.style.display = 'none';
            menuVisible = false;
            const leaderboard = document.getElementById('leaderboard');
            const killCounter = document.getElementById('killCounter');
            if (leaderboard) {
                leaderboard.style.display = 'block';
            }
            if (killCounter) {
                killCounter.style.display = 'block';
            }
        }

        if (menuVisible) {
            MooMoo.restoreMenuValues();
        }

        updateAutoHealStateText();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.keyCode === 27 && shouldHandleHotkeys() && storeMenu.style.display !== 'block') {
        toggleMenu();
    }
});

(async () => {
    const game = await MooMoo.get(document.location.href);
    MooMoo.init(game);
    var ws;
    WebSocket.prototype._send = WebSocket.prototype.send;
    WebSocket.prototype.send = function (m) {
        if (MooMoo.decode(m)[0] == "d") {
            MooMoo.handleHit(m);
        }
        if (!ws) {
            document.ws = this;
            ws = this;
            this.addEventListener('message', function (message) {
                MooMoo.setws(this);
                MooMoo.getwsmessage(message);
            });
        }
        this._send(m);
    };
})();