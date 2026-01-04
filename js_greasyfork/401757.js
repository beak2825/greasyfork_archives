// ==UserScript==
// @name         Krunker.io
// @description hack o  krunker :v
// @version      2.2.9
// @author       xzcqa
// @include      /^(https?:\/\/)?(www\.)?(.+)krunker\.io(|\/|\/\?(server|party)=.+)$/
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @namespace https://greasyfork.org/users/537157
// @downloadURL https://update.greasyfork.org/scripts/401757/Krunkerio.user.js
// @updateURL https://update.greasyfork.org/scripts/401757/Krunkerio.meta.js
// ==/UserScript==

/* eslint-env es6 */
window.stop();
document.innerHTML = "";

class Hack {
    constructor() {
        this.camera = null;
        this.inputs = null;
        this.game = null;
        this.fps = {
            cur: 0,
            times: [],
            elm: null
        };
        this.canvas = null;
        this.ctx = null;
        this.hooks = {
            entities: [],
            world: null,
            context: null,
            config: null
        };
        this.colors = ['Green', 'Orange', 'DodgerBlue', 'Black', 'Red'];
        this.settings = {
            esp: 1,
            espColor: 0,
            espFontSize: 14,
            bhop: 0,
            bhopHeld: false,
            fpsCounter: true,
            autoAim: 3,
            autoAimOnScreen: false,
            autoAimWalls: false,
            autoAimRange: 'Default',
            aimSettings: true,
            noRecoil: true,
            tracers: true,
            autoRespawn: false,
            autoSwap: false,
            autoReload: false,
            speedHack: 1,
            weaponScope: 0,
            crosshair: 0,
            antiAlias: false,
            highPrecision: false,
            customCrosshair: 0,
            customCrosshairColor: "#FFFFFF",
            customCrosshairLength: 14,
            customCrosshairThickness: 2,
            customCrosshairOutline: 0,
        };
        this.settingsMenu = [];
        this.aimbot = {
            initialized: false
        };
        this.flag = new Image();
        this.flag.src = "./textures/objective_1.png";
        this.onLoad();
    }

    getDistance3D(x1, y1, z1, x2, y2, z2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        const dz = z1 - z2;
        return Math.sqrt(dx * dx + dy * dy + dz * dz)
    }

    createCanvas() {
        const hookedCanvas = document.createElement("canvas");
        hookedCanvas.width = innerWidth;
        hookedCanvas.height = innerHeight;
        window.addEventListener('resize', () => {
            hookedCanvas.width = innerWidth;
            hookedCanvas.height = innerHeight;
        });
        this.canvas = hookedCanvas;
        this.ctx = hookedCanvas.getContext("2d");
        const hookedUI = document.getElementById("inGameUI");
        hookedUI.insertAdjacentElement("beforeend", hookedCanvas);
        requestAnimationFrame(this.render.bind(this));
    }

    createFPSCounter() {
        if (!this.settings.fpsCounter) return;
        const el = document.createElement("div");
        el.id = "fpsCounter";
        el.style.position = "absolute";
        el.style.color = "white";
        el.style.top = "0.4em";
        el.style.left = "20px";
        el.style.fontSize = "smaller";
        el.innerHTML = `FPS: ${this.fps.cur}`;
        this.fps.elm = el;
        const ui = document.getElementById("gameUI");
        ui.appendChild(el, ui);
    }

    createMenu() {
        const rh = document.getElementById('rightHolder');
        rh.insertAdjacentHTML("beforeend", "<br/><a href='javascript:;' onmouseover=\"SOUND.play('tick_0',0.1)\" onclick='showWindow(window.windows.length);' class=\"menuLink\">Hacks</a>");
        let self = this;
        this.settingsMenu = {
            fpsCounter: {
                name: "Show FPS",
                pre: "<div class='setHed'><center>Hack Settings</center></div><div class='setHed'>Render</div>",
                val: 1,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.hack.setSetting("fpsCounter", this.checked)' ${self.settingsMenu.fpsCounter.val ? "checked" : ""}><span class='slider'></span></label>`;
                },
                set(t) {
                    self.settings.fpsCounter = t;
                }
            },
            esp: {
                name: "Player ESP",
                val: 1,
                html() {
                    return `<select onchange="window.hack.setSetting('esp', this.value)">
                    <option value="0"${self.settingsMenu.esp.val == 0 ? " selected" : ""}>Disabled</option>
                    <option value="1"${self.settingsMenu.esp.val == 1 ? " selected" : ""}>Full</option>
                    <option value="2"${self.settingsMenu.esp.val == 2 ? " selected" : ""}>Outline Only</option>
                    <option value="3"${self.settingsMenu.esp.val == 3 ? " selected" : ""}>Name Only</option>
                    </select>`
                },
                set(t) {
                    self.settings.esp = parseInt(t)
                    window.playerInfos.style.width = self.settings.esp == 0 || self.settings.esp == 3 ? '100%' : '0%';
                }
            },
            espColor: {
                name: "Player ESP Color",
                val: 0,
                html() {
                    return `<select onchange="window.hack.setSetting('espColor', this.value)">
                    <option value="0"${self.settingsMenu.espColor.val == 0 ? " selected" : ""}>Green</option>
                    <option value="1"${self.settingsMenu.espColor.val == 1 ? " selected" : ""}>Orange</option>
                    <option value="2"${self.settingsMenu.espColor.val == 2 ? " selected" : ""}>DodgerBlue</option>
                    <option value="3"${self.settingsMenu.espColor.val == 3 ? " selected" : ""}>Black</option>
                    <option value="4"${self.settingsMenu.espColor.val == 4 ? " selected" : ""}>Red</option>
                    </select>`
                },
                set(t) {
                    self.settings.espColor = parseInt(t)
                }
            },
            espFontSize: {
                name: "Player ESP Font Size",
                val: 14,
                html() {
                    return `<select onchange="window.hack.setSetting('espFontSize', this.value)">
                    <option value="10"${self.settingsMenu.espFontSize.val == 10 ? " selected" : ""}>Small</option>
                    <option value="14"${self.settingsMenu.espFontSize.val == 14 ? " selected" : ""}>Medium</option>
                    <option value="20"${self.settingsMenu.espFontSize.val == 20 ? " selected" : ""}>Large</option>
                    <option value="26"${self.settingsMenu.espFontSize.val == 26 ? " selected" : ""}>Giant</option>
                    </select>`
                },
                set(t) {
                    self.settings.espFontSize = parseInt(t)
                }
            },
            tracers: {
                name: "Player Tracers",
                val: 1,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.hack.setSetting("tracers", this.checked)' ${self.settingsMenu.tracers.val ? "checked" : ""}><span class='slider'></span></label>`
                },
                set(t) {
                    self.settings.tracers = t;
                }
            },
            crosshair: {
                name: "Crosshair",
                val: 0,
                html() {
                    return `<select onchange="window.hack.setSetting('crosshair', this.value)">
                    <option value="0"${self.settingsMenu.crosshair.val == 0 ? " selected" : ""}>Default</option>
                    <option value="1"${self.settingsMenu.crosshair.val == 1 ? " selected" : ""}>Medium</option>
                    <option value="2"${self.settingsMenu.crosshair.val == 2 ? " selected" : ""}>Small</option>
                    <option value="3"${self.settingsMenu.crosshair.val == 3 ? " selected" : ""}>Smallest</option>
                    </select>`
                },
                set(t) {
                    self.settings.crosshair = parseInt(t);
                }
            },
            bhop: {
                name: "BHop",
                pre: "<div class='setHed'>Movement</div>",
                val: 0,
                html() {
                    return `<select onchange="window.hack.setSetting('bhop', this.value)"><option value="0"${self.settingsMenu.bhop.val == 0 ? " selected" : ""}>Disabled</option><option value="1"${self.settingsMenu.bhop.val == 1 ? " selected" : ""}>Automatic</option><option value="2"${self.settingsMenu.bhop.val == 2 ? " selected" : ""}>Manual</option></select>`
                },
                set(t) {
                    self.settings.bhop = parseInt(t)
                }
            },
            speedHack: {
                name: "Speed hack",
                val: 1,
                html() {
                    return `<span class='sliderVal' id='slid_hack_speedHack'>${self.settingsMenu.speedHack.val}</span><div class='slidecontainer'><input type='range' min='1' max='1.375' step='0.01' value='${self.settingsMenu.speedHack.val}' class='sliderM' oninput="window.hack.setSetting('speedHack', this.value)"></div>`
                },
                set(t) {
                    self.settings.speedHack = t
                }
            },
            noRecoil: {
                name: "No Recoil",
                pre: "<div class='setHed'>Combat</div>",
                val: 0,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.hack.setSetting("noRecoil", this.checked)' ${self.settingsMenu.noRecoil.val ? "checked" : ""}><span class='slider'></span></label>`
                },
                set(t) {
                    self.settings.noRecoil = t
                }
            },
            autoAim: {
                name: "Auto Aim",
                val: 3,
                html() {
                    return `<select onchange="window.hack.setSetting('autoAim', this.value)">
                    <option value="0"${self.settingsMenu.autoAim.val == 0 ? " selected" : ""}>Disabled</option>
                    <option value="1"${self.settingsMenu.autoAim.val == 1 ? " selected" : ""}>TriggerBot</option>
                    <option value="2"${self.settingsMenu.autoAim.val == 2 ? " selected" : ""}>Quickscoper</option>
                    <option value="3"${self.settingsMenu.autoAim.val == 3 ? " selected" : ""}>Manual</option>
                    <option value="4"${self.settingsMenu.autoAim.val == 4 ? " selected" : ""}>Hip Fire</option>
                   </select>`
                },
                set(t) {
                    self.settings.autoAim = parseInt(t)
                }
            },
            autoAimRange: {
                name: "Auto Aim Range",
                val: 'Default',
                html() {
                    return `<select onchange="window.hack.setSetting('autoAimRange', this.value)">
                    <option${self.settingsMenu.autoAimRange.val === 'Default' ? " selected" : ""}>Default</option>
                    <option${self.settingsMenu.autoAimRange.val === '100' ? " selected" : ""}>100</option>
                    <option${self.settingsMenu.autoAimRange.val === '150' ? " selected" : ""}>150</option>
                    <option${self.settingsMenu.autoAimRange.val === '200' ? " selected" : ""}>200</option>
                    <option${self.settingsMenu.autoAimRange.val === '250' ? " selected" : ""}>250</option>
                    <option${self.settingsMenu.autoAimRange.val === '300' ? " selected" : ""}>300</option>
                    <option${self.settingsMenu.autoAimRange.val === '350' ? " selected" : ""}>350</option>
                    <option${self.settingsMenu.autoAimRange.val === '400' ? " selected" : ""}>400</option>
                    <option${self.settingsMenu.autoAimRange.val === '450' ? " selected" : ""}>450</option>
                    <option${self.settingsMenu.autoAimRange.val === '500' ? " selected" : ""}>500</option>
                    <option${self.settingsMenu.autoAimRange.val === '750' ? " selected" : ""}>750</option>
                    <option${self.settingsMenu.autoAimRange.val === '1000' ? " selected" : ""}>1000</option>
                    </select>`
                },
                set(t) {
                    self.settings.autoAimRange = t
                }
            },
            autoAimWalls: {
                name: "Aim Through Walls",
                val: 0,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.hack.setSetting("autoAimWalls", this.checked);' ${self.settingsMenu.autoAim.val ? (self.settingsMenu.autoAimWalls.val ? "checked" : "") : "disabled"}><span class='slider'></span></label>`
                },
                set(t) {
                    self.settings.autoAimWalls = t;
                }
            },
            autoAimOnScreen: {
                name: "Aim If Player Is Inside Screen",
                val: 0,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.hack.setSetting("autoAimOnScreen", this.checked);' ${self.settingsMenu.autoAim.val ? (self.settingsMenu.autoAimOnScreen.val ? "checked" : "") : "disabled"}><span class='slider'></span></label>`
                },
                set(t) {
                    self.settings.autoAimOnScreen = t;
                }
            },
            aimSettings: {
                name: "Custom Aim Settings",
                val: 0,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.hack.setSetting("aimSettings", this.checked)' ${self.settingsMenu.aimSettings.val ? "checked" : ""}><span class='slider'></span></label>`
                },
                set(t) {
                    self.settings.aimSettings = t;
                    self.changeSettings();
                }
            },
            autoRespawn: {
                name: "Auto Respawn",
                val: 0,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.hack.setSetting("autoRespawn", this.checked)' ${self.settingsMenu.autoRespawn.val ? "checked" : ""}><span class='slider'></span></label>`
                },
                set(t) {
                    self.settings.autoRespawn = t;
                }
            },
            autoSwap: {
                name: "Auto Weapon Swap",
                val: 0,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.hack.setSetting("autoSwap", this.checked)' ${self.settingsMenu.autoSwap.val ? "checked" : ""}><span class='slider'></span></label>`
                },
                set(t) {
                    self.settings.autoSwap = t;
                }
            },
            autoReload: {
                name: "Auto Reload",
                val: 0,
                html() {
                    return `<label class='switch'><input type='checkbox' onclick='window.hack.setSetting("autoReload", this.checked)' ${self.settingsMenu.autoReload.val ? "checked" : ""}><span class='slider'></span></label>`
                },
                set(t) {
                    self.settings.autoReload = t;
                }
            },
            weaponScope: {
                name: "Weapon Scope",
                val: 0,
                html() {
                    return `<select onchange="window.hack.setSetting('weaponScope', this.value)">
                    <option value="0"${self.settingsMenu.weaponScope.val == 0 ? " selected" : ""}>Default</option>
                    <option value="1"${self.settingsMenu.weaponScope.val == 1 ? " selected" : ""}>Iron Sight</option>
                    <option value="2"${self.settingsMenu.weaponScope.val == 2 ? " selected" : ""}>Sniper Scope</option>
                    </select>`
                },
                set(t) {
                    self.settings.weaponScope = parseInt(t);
                }
            },
            customCrosshair: {
                name: "Crosshair",
                pre: "<div class='setHed'>Custom Crosshair</div>",
                val: 0,
                html() {
                    return `<select onchange="window.hack.setSetting('customCrosshair', this.value)">
                    <option value="0"${self.settingsMenu.customCrosshair.val == 0 ? " selected" : ""}>Original</option>
                    <option value="1"${self.settingsMenu.customCrosshair.val == 1 ? " selected" : ""}>Custom</option>
                    <option value="2"${self.settingsMenu.customCrosshair.val == 2 ? " selected" : ""}>Both</option>
                    </select>`
                },
                set(t) {
                    self.settings.customCrosshair = parseInt(t);
                }
            },
            customCrosshairColor: {
                name: "Color",
                val: "#ffffff",
                html() {
                    return `<input type='color' id='crosshairColor' name='color' value='${self.settingsMenu.customCrosshairColor.val}' oninput='window.hack.setSetting("customCrosshairColor", this.value)' style='float:right;margin-top:5px'/>`
                },
                set(t) {
                    self.settings.customCrosshairColor = t;
                }
            },
            customCrosshairLength: {
                name: "Length",
                val: 16,
                html() {
                    return `<span class='sliderVal' id='slid_hack_customCrosshairLength'>${self.settingsMenu.customCrosshairLength.val}</span><div class='slidecontainer'><input type='range' min='4' max='50' step='2' value='${self.settingsMenu.customCrosshairLength.val}' class='sliderM' oninput="window.hack.setSetting('customCrosshairLength', this.value)"></div>`
                },
                set(t) {
                    self.settings.customCrosshairLength = parseInt(t);
                }
            },
            customCrosshairThickness: {
                name: "Thickness",
                val: 2,
                html() {
                    return `<span class='sliderVal' id='slid_hack_customCrosshairThickness'>${self.settingsMenu.customCrosshairThickness.val}</span><div class='slidecontainer'><input type='range' min='2' max='20' step='2' value='${self.settingsMenu.customCrosshairThickness.val}' class='sliderM' oninput="window.hack.setSetting('customCrosshairThickness', this.value)"></div>`
                },
                set(t) {
                    self.settings.customCrosshairThickness = parseInt(t);
                }
            },
            customCrosshairOutline: {
                name: "Outline",
                val: 0,
                html() {
                    return `<span class='sliderVal' id='slid_hack_customCrosshairOutline'>${self.settingsMenu.customCrosshairOutline.val}</span><div class='slidecontainer'><input type='range' min='0' max='10' step='1' value='${self.settingsMenu.customCrosshairOutline.val}' class='sliderM' oninput="window.hack.setSetting('customCrosshairOutline', this.value)"></div>`
                },
                set(t) {
                    self.settings.customCrosshairOutline = parseInt(t);
                }
            },
        };
    }

    setupSettings() {
        for (const key in this.settingsMenu) {
            if (this.settingsMenu[key].set) {
                const nt = this.getSavedVal(`kro_set_hack_${key}`);
                this.settingsMenu[key].val = null !== nt ? nt : this.settingsMenu[key].val;
                "false" === this.settingsMenu[key].val && (this.settingsMenu[key].val = !1)
                this.settingsMenu[key].set(this.settingsMenu[key].val, !0)
            }
        }
    }

    keyDown(event) {
        if (document.activeElement.id === 'chatInput') return;
        let opt = null;
        switch (event.key.toUpperCase()) {
            case 'B':
                {
                    this.settings.bhop++;
                    if (this.settings.bhop > 2) this.settings.bhop = 0;
                    this.setSetting('bhop', this.settings.bhop);
                    opt = this.settings.bhop === 0 ? 'Disabled' : (this.settings.bhop === 2 ? 'Manual' : 'Automatic');
                    this.chatMessage(null, `<span style='color:#fff'>BHop - </span> <span style='color:${this.settings.bhop > 0 ? 'green' : 'red'}'>${opt}</span>`, !0);
                    break;
                }
            case 'T':
                {
                    this.settings.autoAim++;
                    if (this.settings.autoAim > 4) this.settings.autoAim = 0;
                    this.setSetting('autoAim', this.settings.autoAim);
                    opt = this.settings.autoAim === 0 ? 'Disabled' : (this.settings.autoAim === 4 ? 'Hip Fire' : (this.settings.autoAim === 3 ? 'Manual' : (this.settings.autoAim === 2 ? 'Quickscoper' : 'TriggerBot')));
                    this.chatMessage(null, `<span style='color:#fff'>AutoAim - </span> <span style='color:${this.settings.autoAim > 0 ? 'green' : 'red'}'>${opt}</span>`, !0);
                    break;
                }
            case 'Y':
                {
                    this.settings.esp++;
                    if (this.settings.esp > 3) this.settings.esp = 0;
                    this.setSetting('esp', this.settings.esp);
                    opt = this.settings.esp === 0 ? 'Disabled' : (this.settings.esp === 3 ? 'Name Only' : (this.settings.esp === 2 ? 'Outline Only' : 'Full'));
                    this.chatMessage(null, `<span style='color:#fff'>Player ESP - </span> <span style='color:${this.settings.esp > 0 ? 'green' : 'red'}'>${opt}</span>`, !0);
                    break;
                }
            case 'U':
                {
                    this.settings.espColor++;
                    if (this.settings.espColor > 4) this.settings.espColor = 0;
                    this.setSetting('espColor', this.settings.espColor);
                    opt = this.colors[this.settings.espColor];
                    this.chatMessage(null, `<span style='color:#fff'>Player ESP Color - </span> <span style='color:${opt.toLowerCase()}'>${opt}</span>`, true);
                    break;
                }
            case 'I':
                {
                    this.settings.weaponScope++;
                    if (this.settings.weaponScope > 2) this.settings.weaponScope = 0;
                    this.setSetting('weaponScope', this.settings.weaponScope);
                    let scopes = ['Default', 'Iron Sight', 'Sniper Scope'];
                    opt = scopes[this.settings.weaponScope];
                    this.chatMessage(null, `<span style='color:#fff'>Weapon Scope - </span> <span style='color:${this.settings.weaponScope > 0 ? 'green' : 'red'}'>${opt}</span>`, !0);
                    break;
                }
            case 'P':
                {
                    this.settings.speedHack = this.settings.speedHack > 1 ? 1 : 1.375;
                    this.setSetting('speedHack', this.settings.speedHack);
                    this.chatMessage(null, `<span style='color:#fff'>Player SpeedHack - </span> <span style='color:${this.settings.speedHack > 1 ? 'green' : 'red'}'>${this.settings.speedHack > 1 ? "Enabled" : "Disabled"}</span>`, !0);
                    break;
                }
            case 'O':
                {
                    this.settings.crosshair++;
                    if (this.settings.crosshair > 3) this.settings.crosshair = 0;
                    this.setSetting('crosshair', this.settings.crosshair);
                    let crosshairs = ['Default', 'Medium', 'Small', 'Smallest'];
                    opt = crosshairs[this.settings.crosshair];
                    this.chatMessage(null, `<span style='color:#fff'>Crosshair - </span> <span style='color:${this.settings.crosshair > 0 ? 'green' : 'red'}'>${opt}</span>`, !0);
                    break;
                }
            case ' ':
                {
                    if (this.settings.bhop !== 2) return;
                    this.settings.bhopHeld = true;
                    break;
                }
        }
    }

    keyUp(event) {
        if (document.activeElement.id === 'chatInput') return;
        if (event.keyCode === 32) this.settings.bhop !== 2 ? void 0 : this.settings.bhopHeld = false;
    }

    keyPress(event) {
        return; // will be used later
        if (document.activeElement.id === 'chatInput') return;
    }

    chatMessage(t, e, n) {
        const chatList = document.getElementById('chatList');
        for (chatList.innerHTML += n ? `<div class='chatItem'><span class='chatMsg'>${e}</span></div><br/>` : `<div class='chatItem'>${t || "unknown"}: <span class='chatMsg'>${e}</span></div><br/>`; chatList.scrollHeight >= 250;) chatList.removeChild(chatList.childNodes[0])
    }

    getMyself() {
        return this.hooks.entities.find(x => x.isYou);
    }

    randFloat(t, e) {
        return t + Math.random() * (e - t);
    }

    getDirection(t, e, n, r) {
        return Math.atan2(e - r, t - n);
    }

    getXDir(e, n, r, i, a, s) {
        const o = Math.abs(n - a);
        const c = this.getDistance3D(e, n, r, i, a, s);
        return Math.asin(o / c) * (n > a ? -1 : 1);
    }

    getAngleDist(t, e) {
        return Math.atan2(Math.sin(e - t), Math.cos(t - e));
    }

    getTarget() {
        let target = null;
        let bestDist = this.getRange();
        for (const player of this.hooks.entities.filter(x => !x.isYou)) {
            if ((player.isVisible || this.settings.autoAimWalls) && player.active && (this.settings.autoAimOnScreen ? this.hooks.world.frustum.containsPoint(player) : true)) {
                if (this.me.team && this.me.team === player.team) continue;
                let dist = this.getDistance3D(this.me.x, this.me.y, this.me.z, player.x, player.y, player.z)
                if (dist < bestDist) {
                    bestDist = dist;
                    target = player;
                }
            }
        }
        return target
    }

    getRange() {
        if (this.settings.autoAimRange != 'Default') return parseInt(this.settings.autoAimRange);
        if (this.me.weapon.range) return this.me.weapon.range + 25;
        return 9999;
    }

    world2Screen(pos, aY = 0) {
        pos.y += aY;
        pos.project(this.hooks.world.camera);
        pos.x = (pos.x + 1) / 2;
        pos.y = (-pos.y + 1) / 2;
        pos.x *= this.canvas.width;
        pos.y *= this.canvas.height;
        return pos;
    }

    pixelTranslate(ctx, x, y) {
        ctx.translate(~~x, ~~y);
    }

    text(txt, font, color, x, y) {
        this.ctx.save();
        this.pixelTranslate(this.ctx, x, y);
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.font = font;
        this.ctx.lineWidth = 1;
        this.ctx.strokeText(txt, 0, 0);
        this.ctx.fillText(txt, 0, 0);
        this.ctx.restore();
    }

    rect(x, y, ox, oy, w, h, color, fill) {
        this.ctx.save();
        this.pixelTranslate(this.ctx, x, y);
        this.ctx.beginPath();
        fill ? this.ctx.fillStyle = color : this.ctx.strokeStyle = color;
        this.ctx.rect(ox, oy, w, h);
        fill ? this.ctx.fill() : this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    line(x1, y1, x2, y2, lW, sS) {
        this.ctx.save();
        this.ctx.lineWidth = lW + 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
        this.ctx.stroke();
        this.ctx.lineWidth = lW;
        this.ctx.strokeStyle = sS;
        this.ctx.stroke();
        this.ctx.restore();
    }

    image(x, y, img, ox, oy, w, h) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.beginPath();
        this.ctx.drawImage(img, ox, oy, w, h);
        this.ctx.closePath();
        this.ctx.restore();
    }

    gradient(x, y, w, h, colors) {
        let grad = this.ctx.createLinearGradient(x, y, w, h);
        for (let i = 0; i < colors.length; i++) {
            grad.addColorStop(i, colors[i]);
        }
        return grad;
    }

    getTextMeasurements(arr) {
        for (let i = 0; i < arr.length; i++) {
            arr[i] = ~~this.ctx.measureText(arr[i]).width;
        }
        return arr;
    }

    drawESP() {
        let padding = 2;
        const me = this.hooks.world.camera.getWorldPosition()
        for (const entity of this.hooks.entities.filter(x => !x.isYou && x.active)) {
            if (!entity.rankIcon && entity.level > 0) {
                let rankVar = entity.level > 0 ? Math.ceil(entity.level / 3) * 3 : entity.level < 0 ? Math.floor(entity.level / 3) * 3 : entity.level;
                let rankId = Math.max(Math.min(100, rankVar - 2), 0);
                entity.rankIcon = new Image();
                entity.rankIcon.src = `./img/levels/${rankId}.png`;
            }
            const target = entity.objInstances.position.clone();
            if (this.hooks.world.frustum.containsPoint(target)) {
                let screenR = this.world2Screen(entity.objInstances.position.clone());
                let screenH = this.world2Screen(entity.objInstances.position.clone(), entity.height);
                let hDiff = ~~(screenR.y - screenH.y);
                let bWidth = ~~(hDiff * 0.6);
                const color = this.colors[this.settings.espColor];
                if (this.settings.esp > 0 && this.settings.esp != 3) {
                    this.rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, 0, 0, 4, hDiff + 2, '#000000', false);
                    this.rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, 0, 0, 4, hDiff + 2, '#44FF44', true);
                    this.rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, 0, 0, 4, ~~((entity.maxHealth - entity.health) / entity.maxHealth * (hDiff + 2)), '#000000', true);
                    this.ctx.save();
                    this.ctx.lineWidth = 4;
                    this.pixelTranslate(this.ctx, screenH.x - bWidth / 2, screenH.y);
                    this.ctx.beginPath();
                    this.ctx.rect(0, 0, bWidth, hDiff);
                    this.ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
                    this.ctx.stroke();
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeStyle = entity.team === null ? '#FF4444' : this.getMyself().team === entity.team ? '#44AAFF' : '#FF4444';
                    this.ctx.stroke();
                    this.ctx.closePath();
                    this.ctx.restore();
                    if (this.settings.esp === 1) {
                        let playerDist = parseInt(this.getDistance3D(me.x, me.y, me.z, target.x, target.y, target.z) / 10);
                        this.ctx.save();
                        this.ctx.font = `${this.settings.espFontSize}px GameFont`;
                        let meas = this.getTextMeasurements(["[", `${playerDist}`, "m]", `${entity.level}`, "©", entity.name]);
                        this.ctx.restore();
                        let grad2 = this.gradient(0, 0, meas[4] * 5, 0, ["rgba(0, 0, 0, 0.25)", "rgba(0, 0, 0, 0)"]);
                        if (entity.rankIcon && entity.rankIcon.complete) {
                            let grad = this.gradient(0, 0, (meas[4] * 2) + meas[3] + (padding * 3), 0, ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.25)"]);
                            this.rect(~~(screenH.x - bWidth / 2) - 12 - (meas[4] * 2) - meas[3] - (padding * 3), ~~screenH.y - padding, 0, 0, (meas[4] * 2) + meas[3] + (padding * 3), meas[4] + (padding * 2), grad, true);
                            this.ctx.drawImage(entity.rankIcon, ~~(screenH.x - bWidth / 2) - 16 - (meas[4] * 2) - meas[3], ~~screenH.y - (meas[4] * 0.5), entity.rankIcon.width * ((meas[4] * 2) / entity.rankIcon.width), entity.rankIcon.height * ((meas[4] * 2) / entity.rankIcon.height));
                            this.text(`${entity.level}`, `${this.settings.espFontSize}px GameFont`, '#FFFFFF', ~~(screenH.x - bWidth / 2) - 16 - meas[3], ~~screenH.y + meas[4] * 1);
                        }
                        this.rect(~~(screenH.x + bWidth / 2) + padding, ~~screenH.y - padding, 0, 0, (meas[4] * 5), (meas[4] * 4) + (padding * 2), grad2, true);
                        this.text(entity.name, `${this.settings.espFontSize}px GameFont`, entity.team === null ? '#FFCDB4' : this.getMyself().team === entity.team ? '#B4E6FF' : '#FFCDB4', (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 1)
                        if (entity.clan) this.text(`[${entity.clan}]`, `${this.settings.espFontSize}px GameFont`, '#AAAAAA', (screenH.x + bWidth / 2) + 8 + meas[5], screenH.y + meas[4] * 1)
                        this.text(`${entity.health} HP`, `${this.settings.espFontSize}px GameFont`, "#33FF33", (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 2)
                        this.text(`${entity.weapon.name}`, `${this.settings.espFontSize}px GameFont`, "#DDDDDD", (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 3)
                        this.text("[", `${this.settings.espFontSize}px GameFont`, "#AAAAAA", (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 4)
                        this.text(`${playerDist}`, `${this.settings.espFontSize}px GameFont`, "#DDDDDD", (screenH.x + bWidth / 2) + 4 + meas[0], screenH.y + meas[4] * 4)
                        this.text("m]", `${this.settings.espFontSize}px GameFont`, "#AAAAAA", (screenH.x + bWidth / 2) + 4 + meas[0] + meas[1], screenH.y + meas[4] * 4)
                    }
                }
                if (this.settings.tracers) this.line(innerWidth / 2, innerHeight - 1, screenR.x, screenR.y, 2, entity.team === null ? '#FF4444' : this.getMyself().team === entity.team ? '#44AAFF' : '#FF4444');
            }
        }
    }

    drawFPS() {
        if (!this.settings.fpsCounter && this.fps.elm.innerHTML.length > 0) return void(this.fps.elm.innerHTML = '');
        const now = performance.now();
        for (; this.fps.times.length > 0 && this.fps.times[0] <= now - 1e3;) this.fps.times.shift();
        this.fps.times.push(now);
        this.fps.cur = this.fps.times.length;
        this.fps.elm.innerHTML = `FPS: ${this.fps.cur}`;
        this.fps.elm.style.color = this.fps.cur > 50 ? 'green' : (this.fps.cur < 30 ? 'red' : 'orange');
    }

    drawFlag() {
        if (window.playerInfos.style.width != "0%") return;
        if (window.objectiveIcon && window.objectiveIcon.style.display === "inline-block") this.image(parseFloat(window.objectiveIcon.style.left) / 100 * innerWidth, parseFloat(window.objectiveIcon.style.top) / 100 * innerHeight, this.flag, 0, 0, parseFloat(window.objectiveIcon.style.width), parseFloat(window.objectiveIcon.style.height))
    }

    drawCrosshair() {
        if (this.settings.customCrosshair == 0) return;

        let thickness = this.settings.customCrosshairThickness;
        let outline = this.settings.customCrosshairOutline;
        let length = this.settings.customCrosshairLength;

        let cx = (this.canvas.width / 2);
        let cy = (this.canvas.height / 2);

        if (outline > 0) {
            this.rect(cx - length - outline, cy - (thickness / 2) - outline, 0, 0, (length * 2) + (outline * 2), thickness + (outline * 2), '#000000', true);
            this.rect(cx - (thickness * 0.50) - outline, cy - length - outline, 0, 0, thickness + (outline * 2), (length * 2) + (outline * 2), '#000000', true);
        }

        this.rect(cx - length, cy - (thickness / 2), 0, 0, (length * 2) , thickness, this.settings.customCrosshairColor, true);
        this.rect(cx - (thickness * 0.50), cy - length, 0, 0, thickness, length * 2, this.settings.customCrosshairColor, true);
    }

    bhop() {
        if (this.settings.bhop === 0) return
        if ((this.settings.bhop === 1 && this.camera.keys && this.camera.moveDir !== null) || (this.settings.bhop === 2 && this.settings.bhopHeld)) this.camera.keys[this.camera.jumpKey] = !this.camera.keys[this.camera.jumpKey]
    }

    noRecoil() {
        if (!this.settings.noRecoil) return;
        this.inputs[3] = ((this.camera.pitchObject.rotation.x - this.me.recoilAnimY * this.hooks.config.recoilMlt) % Math.PI2).round(3);
        this.me.recoilAnimYOld = this.me.recoilAnimY;
        this.me.recoilAnimY = 0;
    }

    autoRespawn() {
        if (!this.settings.autoRespawn) return;
        if (this.me && this.me.y === undefined && !document.pointerLockElement) this.camera.toggle(true);
    }

    autoSwap() {
        if (!this.settings.autoSwap || !this.me.weapon.ammo || this.me.ammos.length < 2) return;
        if (this.me.ammos[this.me.weaponIndex] === 0 && this.me.ammos[0] != this.me.ammos[1]) this.inputs[10] = -1;
    }

    autoReload() {
        if (!this.settings.autoReload || !this.me.weapon.ammo) return;
        if (this.me.ammos[this.me.weaponIndex] === 0 && this.inputs[9] === 0) this.inputs[9] = 1;
    }

    speedHack() {
        this.inputs[1] *= this.settings.speedHack;
    }

    weaponScope() {
        if (this.settings.weaponScope === 0) {
            if (this.me.weapon.name === "Sniper Rifle" || this.me.weapon.name === "Semi Auto") {
                this.me.weapon.scope = 1;
            } else {
                delete this.me.weapon.scope
            }
        }
        if (this.settings.weaponScope === 1) {
            delete this.me.weapon.scope;
        } else if (this.settings.weaponScope === 2) {
            this.me.weapon.scope = 1;
        }
    }

    initAimbot() {
        let self = this;
        this.initialized = true;
        this.changeSettings();
        this.camera.camLookAt = function(x, y, z) {
            if (!x) return void(this.aimTarget = null);
            const a = self.getXDir(this.object.position.x, this.object.position.y, this.object.position.z, x, y, z);
            const h = self.getDirection(this.object.position.z, this.object.position.x, z, x);
            this.aimTarget = {
                xD: a,
                yD: h,
                x: x + self.hooks.config.camChaseDst * Math.sin(h) * Math.cos(a),
                y: y - self.hooks.config.camChaseDst * Math.sin(a),
                z: z + self.hooks.config.camChaseDst * Math.cos(h) * Math.cos(a)
            };
        };
        this.camera.updateOld = this.camera.update;
        this.camera.update = function() {
            if (!this.target && this.aimTarget) {
                if (self.settings.autoAim > 0) {
                    this.object.rotation.y = this.aimTarget.yD;
                    this.pitchObject.rotation.x = this.aimTarget.xD;
                }
                const c = Math.PI / 2;
                this.pitchObject.rotation.x = Math.max(-c, Math.min(c, this.pitchObject.rotation.x));
                this.yDr = (this.pitchObject.rotation.x % Math.PI2).round(3);
                this.xDr = (this.object.rotation.y % Math.PI2).round(3);
            }
            let ret = this.updateOld(...arguments);
            return ret;
        }
        this.camera.resetOld = this.camera.reset;
        this.camera.reset = function() {
            this.aimTarget = null;
            let ret = this.resetOld(...arguments);
            return ret;
        }
    }

    updateAimbot() {
        if (!this.settings.autoAim > 0) return;
        if (!this.initialized) this.initAimbot();
        const target = this.getTarget();
        if (target) {
            if ((this.settings.autoAim === 3 && this.me.aimVal === 1) || (this.settings.autoAim === 4 && this.me.aimVal === 0)) return void this.camera.camLookAt(null);
            target.y += this.hooks.config.playerHeight - this.hooks.config.cameraHeight - this.hooks.config.crouchDst * target.crouchVal;
            target.y -= (this.me.recoilAnimY * this.hooks.config.recoilMlt) * 25;
            this.camera.camLookAt(target.x, target.y, target.z);
            if (this.settings.autoAim === 1) {
                if (this.camera.mouseDownR !== 1) {
                    this.camera.mouseDownR = 1;
                } else {
                    this.camera.mouseDownL = this.camera.mouseDownL === 1 ? 0 : 1;
                }
            } else if (this.settings.autoAim === 2) {
                this.camera.mouseDownR = 1;
                if (this.me.aimVal === 0) {
                    if (this.camera.mouseDownL === 0) {
                        this.camera.mouseDownL = 1;
                    } else {
                        this.camera.mouseDownR = 0;
                        this.camera.mouseDownL = 0;
                    }
                }
            }
        } else {
            this.camera.camLookAt(null);
            if (this.settings.autoAim === 1) {
                this.camera.mouseDownL = 0;
                if (this.camera.mouseDownR !== 0) this.camera.mouseDownR = 0;
            } else if (this.settings.autoAim === 2) {
                this.camera.mouseDownR = 0;
                this.camera.mouseDownL = 0;
            }
        }
    }

    changeSettings() {
        if (this.settings.aimSettings) {
            this.hooks.config.camChaseTrn = 0.05;
            this.hooks.config.camChaseSpd = 15000000;
            this.hooks.config.camChaseSen = 15000000;
            this.hooks.config.camChaseDst = 0;
        } else {
            this.hooks.config.camChaseTrn = .0022;
            this.hooks.config.camChaseSpd = .0012;
            this.hooks.config.camChaseSen = .2;
            this.hooks.config.camChaseDst = 24;
        }
    }

    getCrosshair(t) {
        /* 46.75 = small; 39.75 = smallest; 52.75 = Medium */
        if (!this.settings.crosshair > 0) return t;
        return this.settings.crosshair === 1 ? 52.75 : (this.settings.crosshair === 2 ? 46.75 : 39.75);
    }

    crosshairOpacity() {
        return this.settings.customCrosshair == 1 ? 0 : 1;
    }

    render() {
        this.ctx.clearRect(0, 0, innerWidth, innerHeight);
        this.drawESP();
        this.drawCrosshair();
        this.drawFPS();
        this.drawFlag();
        this.autoRespawn();
        requestAnimationFrame(this.render.bind(this));
    }

    loop(camera, me, inputs, game) {
        this.me = me;
        this.camera = camera;
        this.game = game;
        this.inputs = inputs;
        this.bhop();
        this.updateAimbot();
        this.noRecoil();
        this.autoSwap();
        this.autoReload();
        this.speedHack();
        this.weaponScope();
    }

    setSetting(t, e) {
        if (document.getElementById(`slid_hack_${t}`)) document.getElementById(`slid_hack_${t}`).innerHTML = e;
        this.settingsMenu[t].set(e);
        this.settingsMenu[t].val = e;
        this.saveVal(`kro_set_hack_${t}`, e);
    }

    saveVal(t, e) {
        const r = "undefined" != typeof Storage;
        r && localStorage.setItem(t, e)
    }

    getSavedVal(t) {
        const r = "undefined" != typeof Storage;
        return r ? localStorage.getItem(t) : null;
    }

    onLoad() {
        window.playerInfos.style.width = "0%";
        this.createCanvas();
        this.createFPSCounter();
        this.createMenu();
    }
}

GM_xmlhttpRequest({
    method: "GET",
    url: `${document.location.origin}/js/game.js`,
    onload: res => {
        let code = res.responseText
        code = code.replace(/String\.prototype\.escape=function\(\){(.*)\)},(Number\.)/, "$2")
            .replace(/(if\(\w+\.isVisible)\){/, "$1||window.hack.settings.esp == 3){")
            .replace(/(\bthis\.list\b)/g, "window.hack.hooks.entities")
            .replace(/\w+\.players\.list/g, "window.hack.hooks.entities")
            .replace(/(function\(\w+,(\w+),\w+,\w+,\w+,\w+,\w+\){var \w+,\w+,\w+,\w+;window\.hack\.hooks\.entities=\[\])/, "$1;window.hack.hooks.world=$2")
            .replace(/"mousemove",function\((\w+)\){if\((\w+)\.enabled/, '"mousemove",function($1){window.hack.hooks.context = $2;if($2.enabled')
            .replace(/(\w+).procInputs\((\w+),(\w+)\),(\w+).moveCam/, 'window.hack.loop($4, $1, $2, $3), $1.procInputs($2,$3),$4.moveCam')
            .replace(/(\w+).exports\.ambientVal/, 'window.hack.hooks.config = $1.exports, $1.exports.ambientVal')
            .replace(/window\.updateWindow=function/, 'windows.push({header: "Hack Settings", html: "",gen: function () {var t = ""; for (var key in window.hack.settingsMenu) {window.hack.settingsMenu[key].pre && (t += window.hack.settingsMenu[key].pre), t += "<div class=\'settName\'>" + window.hack.settingsMenu[key].name + " " + window.hack.settingsMenu[key].html() + "</div>";} return t;}});window.hack.setupSettings();\nwindow.updateWindow=function')
            .replace(/window\.addEventListener\("keydown",function\((\w+)\){/, 'window.addEventListener("keydown",function($1){window.hack.keyDown($1),')
            .replace(/window\.addEventListener\("keyup",function\((\w+)\){/, 'window.addEventListener("keyup",function($1){window.hack.keyUp($1),')
            .replace(/window\.addEventListener\("keypress",function\((\w+)\){/, 'window.addEventListener("keypress",function($1){window.hack.keyPress($1),')
            .replace(/hitHolder\.innerHTML=(\w+)}\((\w+)\),(\w+).update\((\w+)\)(.*)"block"==nukeFlash\.style\.display/, 'hitHolder.innerHTML=$1}($2),$3.update($4),"block" === nukeFlash.style.display')
            .replace(/(\w+)\("Kicked for inactivity"\)\),(.*),requestAnimFrame\((\w+)\)/, '$1("Kicked for inactivity")),requestAnimFrame($3)')
            .replace(/(\w+).updateCrosshair=function\((\w+),(\w+)\){/, '$1.updateCrosshair=function($2,$3){$2=window.hack.getCrosshair($2);')
            .replace(/antialias:!1/g, 'antialias:window.hack.settings.antiAlias ? 1 : !1')
            .replace(/precision:"mediump"/g, 'precision:window.hack.settings.highPrecision ? "highp": "mediump"')
            .replace(/crosshair\.style\.opacity\=(\w+)\)/, 'crosshair.style.opacity = window.hack.crosshairOpacity())')
            .replace(/setTimeout\(\(\)=>{!(.*)},2500\);/, '');
        GM_xmlhttpRequest({
            method: "GET",
            url: document.location.origin,
            onload: res => {
                let html = res.responseText;
                html = html.replace(/ src="js\/game\.js">/, `>${Hack.toString()}\nwindow.hack = new Hack();\n${code.toString()}`);
                document.open();
                document.write(html);
                document.close();
            }
        })
    }
})