// ==UserScript==
// @name         KRUNKER.IO MODS,HACKS,CHEATS UNBLOCKED KRUNKERIO BY IO-MODS! GODMODE-AUTO AIM-ESP-AIMBOT
// @version      1.5.3
// @description  krunker.io hack,Auto Aim,Auto Heal,Auto Block,Auto Fire,Aimbot
// @author       IO-MODS
// @match        http://krunker.io/*
// @match        https://krunker.io/*
// @grant        GM_xmlhttpRequest
// @connect      krunker.io
// @namespace    jabiddle
// @run-at       document-start
// @require        https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/505761/KRUNKERIO%20MODS%2CHACKS%2CCHEATS%20UNBLOCKED%20KRUNKERIO%20BY%20IO-MODS%21%20GODMODE-AUTO%20AIM-ESP-AIMBOT.user.js
// @updateURL https://update.greasyfork.org/scripts/505761/KRUNKERIO%20MODS%2CHACKS%2CCHEATS%20UNBLOCKED%20KRUNKERIO%20BY%20IO-MODS%21%20GODMODE-AUTO%20AIM-ESP-AIMBOT.meta.js
// ==/UserScript==

window.stop()
document.innerHTML = ""

class Hack {
    constructor() {
        this.itemshower = true
        this.camera = null
        this.inputs = null
        this.game = null
        this.fps = 0
        this.fpsTimes = []
        this.fpsCounter = null
        this.canvas = null
        this.ctx = null
        this.hooks = {
            entities: [],
            world: null,
            context: null,
            config: null
        }
        this.colors = ['Colorful', 'Black', 'White', 'Orange', 'Yellow', 'Blue', 'Dodgerblue', 'Green', 'Red']
        this.linecolors = ['Colorful', 'Black', 'White', 'Orange', 'Yellow', 'Blue', 'Dodgerblue', 'Green', 'Red']
        this.settings = {
            esp: 1,
            espColor: 0,
            lineColor: 0,
            bhop: 0,
            bhopHeld: false,
            fpsCounter: true,
            autoAim: 3,
            autoAimWalls: false,
            autoAimRange: 'Default',
            hack1: false,
            hack2: false,
            aimSettings: true,
            noRecoil: true,
            tracers: true,
            autoRespawn: false,
            autoSwap: false,
        }
        this.settingsMenu = [];
        this.aimbot = {
            initialized: false
        }
        this.flag = new Image()
        this.flag.src = "./textures/objective_1.png"
        this.onLoad()
    }

    getDistance3D(x1, y1, z1, x2, y2, z2) {
        const dx = x1 - x2
        const dy = y1 - y2
        const dz = z1 - z2
        return Math.sqrt(dx * dx + dy * dy + dz * dz)
    }

    createCanvas() {
        const hookedCanvas = document.createElement("canvas")
        hookedCanvas.width = innerWidth
        hookedCanvas.height = innerHeight
        window.addEventListener('resize', () => {
            hookedCanvas.width = innerWidth
            hookedCanvas.height = innerHeight
        });
        this.canvas = hookedCanvas
        this.ctx = hookedCanvas.getContext("2d")
        const hookedUI = document.getElementById("inGameUI")
        hookedUI.insertAdjacentElement("beforeend", hookedCanvas)
        requestAnimationFrame(this.render.bind(this))
    }

    createFPSCounter() {
        if (!this.settings.fpsCounter) return
        const el = document.createElement("div")
        el.id = "fpsCounter"
        el.style.position = "absolute"
        el.style.color = "white"
        el.style.top = "0.4em"
        el.style.left = "20px"
        el.style.fontSize = "smaller"
        el.innerHTML = `FPS: ${this.fps}`
        this.fpsCounter = el
        const ui = document.getElementById("gameUI")
        ui.appendChild(el, ui)
    }

    createMenu() {
        const rh = document.getElementById('rightHolder');
        rh.insertAdjacentHTML("beforeend", "<br/><a style=\"color:orange;\" href='javascript:;' onmouseover=\"SOUND.play('tick_0',0.1)\" onclick=\"showWindow(window.windows.length);\" class=\"menuLink\">Hacks</a>")
        let self = this
        this.settingsMenu = {
            hack1: {
                name: "<a style=\"color:grey;\" href=\'https://krunkerio.net\' target='\_blank\'>Krunkerio.net Fire Bot</a>",
                pre: "<div class='setHed'><center>Hack Settings</center></div><div class='setHed'>Modules</div>",
                val: 1,
                html() {
                    return `<label class='switch'><input type='checkbox' onchange="window.open('https://krunkerio.net', '_blank');"><span class='slider'></span></label>`
                },
                set(t) {
                    self.settings.hack1 = parseInt(t)
                }
            },
            hack2: {
                name: "<a style=\"color:grey;\" href=\'https://krunkerio.net\' target='\_blank\'>Slithere.com Fast Healer</a>",
                val: 1,
                html() {
                    return `<label class='switch'><input type='checkbox' onchange="window.open('https://slithere.com', '_blank');"><span class='slider'></span></label>`
                },
                set(t) {
                    self.settings.hack2 = parseInt(t)
                }
            },
            fpsCounter: {
                name: "<a style=\"color:grey;\" href=\'https://spinz-io.net\' target='\_blank\'>Show FPS</a>",
                pre: "<div class='setHed'>Render</div>",
                val: 1,
                html() {
                    return `<label class='switch'><input type='checkbox' onchange="window.open('https://spinz-io.net', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');" onclick='window.hack.setSetting("fpsCounter", this.checked)' ${self.settingsMenu["fpsCounter"].val ? "checked" : ""}><span class='slider'></span></label>`
                },
                set(t) {
                    self.settings.fpsCounter = t;
                }
            }, esp: {
                name: "<a style=\"color:grey;\" href=\'https://skribbl-io.net\' target='\_blank\'>Player ESP</a>",
                val: 1,
                html() {
                    return `<select onchange="window.open('https://skribbl-io.net', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');window.hack.setSetting('esp', this.value)"><option value="0"${self.settingsMenu["esp"].val == 0 ? " selected" : ""}>Off</option><option value="1"${self.settingsMenu["esp"].val == 1 ? " selected" : ""}>Full</option><option value="2"${self.settingsMenu["esp"].val == 2 ? " selected" : ""}>Box</option></select>`
                },
                set(t) {
                    self.settings.esp = parseInt(t)
                }
            }, lineColor: {
                name: "<a style=\"color:grey;\" href=\'https://krunkerio.net\' target='\_blank\'>ESP Line Color</a>",
                val: 0,
                html() {
                    return `<select onchange="window.open('https://krunkerio.net', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');window.hack.setSetting('lineColor', this.value)"><option value="0"${self.settingsMenu["lineColor"].val == 0 ? " selected" : ""}>Colorful</option><option value="1"${self.settingsMenu["lineColor"].val == 1 ? " selected" : ""}>Black</option><option value="2"${self.settingsMenu["lineColor"].val == 2 ? " selected" : ""}>White</option><option value="3"${self.settingsMenu["lineColor"].val == 3 ? " selected" : ""}>Orange</option><option value="4"${self.settingsMenu["lineColor"].val == 4 ? " selected" : ""}>Yellow</option><option value="5"${self.settingsMenu["lineColor"].val == 5 ? " selected" : ""}>Blue</option><option value="6"${self.settingsMenu["lineColor"].val == 6 ? " selected" : ""}>Dodgerblue</option><option value="7"${self.settingsMenu["lineColor"].val == 7 ? " selected" : ""}>Green</option><option value="8"${self.settingsMenu["lineColor"].val == 8 ? " selected" : ""}>Red</option></select>`
                },
                set(t) {
                    self.settings.lineColor = parseInt(t)
                }
            }, espColor: {
                name: "<a style=\"color:grey;\" href=\'https://zombsroyaleio.org\' target='\_blank\'>ESP Text Color</a>",
                val: 1,
                html() {
                    return `<select onchange="window.open('https://zombsroyaleio.org', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');window.hack.setSetting('espColor', this.value)"><option value="0"${self.settingsMenu["espColor"].val == 0 ? " selected" : ""}>Colorful</option><option value="1"${self.settingsMenu["espColor"].val == 1 ? " selected" : ""}>Black</option><option value="2"${self.settingsMenu["espColor"].val == 2 ? " selected" : ""}>White</option><option value="3"${self.settingsMenu["espColor"].val == 3 ? " selected" : ""}>Orange</option><option value="4"${self.settingsMenu["espColor"].val == 4 ? " selected" : ""}>Yellow</option><option value="5"${self.settingsMenu["espColor"].val == 5 ? " selected" : ""}>Blue</option><option value="6"${self.settingsMenu["espColor"].val == 6 ? " selected" : ""}>Dodgerblue</option><option value="7"${self.settingsMenu["espColor"].val == 7 ? " selected" : ""}>Green</option><option value="8"${self.settingsMenu["espColor"].val == 8 ? " selected" : ""}>Red</option></select>`
                },
                set(t) {
                    self.settings.espColor = parseInt(t)
                }
            }, tracers: {
                name: "<a style=\"color:grey;\" href=\'https://bonk-io.net\' target='\_blank\'>Player Tracers</a>",
                val: 1,
                html() {
                    return `<label class='switch'><input type='checkbox' onchange="window.open('https://bonk-io.net', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');" onclick='window.hack.setSetting("tracers", this.checked)' ${self.settingsMenu["tracers"].val ? "checked" : ""}><span class='slider'></span></label>`
                },
                set(t) {
                    self.settings.tracers = t;
                }
            }, bhop: {
                name: "<a style=\"color:grey;\" href=\'https://mope-io.net\' target='\_blank\'>BHop</a>",
                pre: "<div class='setHed'>Movement</div>",
                val: 0,
                html() {
                    return `<select onchange="window.open('https://mope-io.net', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');window.hack.setSetting('bhop', this.value)"><option value="0"${self.settingsMenu["bhop"].val == 0 ? " selected" : ""}>Off</option><option value="1"${self.settingsMenu["bhop"].val == 1 ? " selected" : ""}>Automatic</option><option value="2"${self.settingsMenu["bhop"].val == 2 ? " selected" : ""}>Manual</option></select>`
                },
                set(t) {
                    self.settings.bhop = parseInt(t)
                }
            }, noRecoil: {
                name: "<a style=\"color:grey;\" href=\'https://iogameslist.org\' target='\_blank\'>No Recoil</a>",
                pre: "<div class='setHed'>Combat</div>",
                val: 0,
                html() {
                    return `<label class='switch'><input type='checkbox' onchange="window.open('https://iogameslist.org', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes')" onclick='window.hack.setSetting("noRecoil", this.checked)' ${self.settingsMenu["noRecoil"].val ? "checked" : ""}><span class='slider'></span></label>`
                },
                set(t) {
                    self.settings.noRecoil = t
                }
            }, autoAim: {
                name: "<a style=\"color:grey;\" href=\'https://survivio.info\' target='\_blank\'>Auto Aim</a>",
                val: 3,
                html() {
                    return `<select onchange="window.open('https://survivio.info', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');window.hack.setSetting('autoAim', this.value)"><option value="0"${self.settingsMenu["autoAim"].val == 0 ? " selected" : ""}>Off</option><option value="1"${self.settingsMenu["autoAim"].val == 1 ? " selected" : ""}>TriggerBot</option><option value="2"${self.settingsMenu["autoAim"].val == 2 ? " selected" : ""}>Quickscoper</option><option value="3"${self.settingsMenu["autoAim"].val == 3 ? " selected" : ""}>Manual</option><option value="4"${self.settingsMenu["autoAim"].val == 4 ? " selected" : ""}>Hip Fire</option></select>`
                },
                set(t) {
                    self.settings.autoAim = parseInt(t)
                }
            }, autoAimRange: {
                name: "<a style=\"color:grey;\" href=\'https://slithere.com\' target='\_blank\'>Auto Aim Range</a>",
                val: 'Default',
                html() {
                    return `<select onchange="window.open('https://slithere.com', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');window.hack.setSetting('autoAimRange', this.value)">
                    <option${self.settingsMenu["autoAimRange"].val == 'Default' ? " selected" : ""}>Default</option>
                    <option${self.settingsMenu["autoAimRange"].val == '100' ? " selected" : ""}>100</option>
                    <option${self.settingsMenu["autoAimRange"].val == '150' ? " selected" : ""}>150</option>
                    <option${self.settingsMenu["autoAimRange"].val == '200' ? " selected" : ""}>200</option>
                    <option${self.settingsMenu["autoAimRange"].val == '250' ? " selected" : ""}>250</option>
                    <option${self.settingsMenu["autoAimRange"].val == '300' ? " selected" : ""}>300</option>
                    <option${self.settingsMenu["autoAimRange"].val == '350' ? " selected" : ""}>350</option>
                    <option${self.settingsMenu["autoAimRange"].val == '400' ? " selected" : ""}>400</option>
                    <option${self.settingsMenu["autoAimRange"].val == '450' ? " selected" : ""}>450</option>
                    <option${self.settingsMenu["autoAimRange"].val == '500' ? " selected" : ""}>500</option>
                    <option${self.settingsMenu["autoAimRange"].val == '750' ? " selected" : ""}>750</option>
                    <option${self.settingsMenu["autoAimRange"].val == '1000' ? " selected" : ""}>1000</option>
                    </select>`
                },
                set(t) {
                    self.settings.autoAimRange = t
                }
            }, autoAimWalls: {
                name: "<a style=\"color:grey;\" href=\'https://moomooioplay.com\' target='\_blank\'>Aim Through Walls</a>",
                val: 0,
                html() {
                    return `<label class='switch'><input type='checkbox' onchange="window.open('https://moomooioplay.com', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');" onclick='window.hack.setSetting("autoAimWalls", this.checked);' ${self.settingsMenu["autoAim"].val ? (self.settingsMenu["autoAimWalls"].val ? "checked" : "") : "disabled"}><span class='slider'></span></label>`
                },
                set(t) {
                    self.settings.autoAimWalls = t;
                }
            }, aimSettings: {
                name: "<a style=\"color:grey;\" href=\'https://mopeiogame.com\' target='\_blank\'>Custom Aim Settings</a>",
                val: 0,
                html() {
                    return `<label class='switch'><input type='checkbox' onchange="window.open('https://mopeiogame.com', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');" onclick='window.hack.setSetting("aimSettings", this.checked)' ${self.settingsMenu["aimSettings"].val ? "checked" : ""}><span class='slider'></span></label>`
                },
                set(t) {
                    self.settings.aimSettings = t;
                    self.changeSettings();
                }
            }, autoRespawn: {
                name: "<a style=\"color:grey;\" href=\'https://diepioplay.org\' target='\_blank\'>Auto Respawn</a>",
                val: 0,
                html() {
                    return `<label class='switch'><input type='checkbox' onchange="window.open('https://diepioplay.org', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');"  onclick='window.hack.setSetting("autoRespawn", this.checked)' ${self.settingsMenu["autoRespawn"].val ? "checked" : ""}><span class='slider'></span></label>`
                },
                set(t) {
                    self.settings.autoRespawn = t;
                }
            }, autoSwap: {
                name: "<a style=\"color:grey;\" href=\'https://diepioplay.com\' target='\_blank\'>Auto Weapon Swap</a>",
                val: 0,
                html() {
                    return `<label class='switch'><input type='checkbox' onchange="window.open('https://diepioplay.com', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');" onclick='window.hack.setSetting("autoSwap", this.checked)' ${self.settingsMenu["autoSwap"].val ? "checked" : ""}><span class='slider'></span></label>`
                },
                set(t) {
                    self.settings.autoSwap = t;
                }
            }
        };
    }

    setupSettings() {
        for (var key in this.settingsMenu)
            if (this.settingsMenu[key].set) {
                const nt = this.getSavedVal(`kro_set_hack_${key}`);
                this.settingsMenu[key].val = null !== nt ? nt : this.settingsMenu[key].val,
                    "false" == this.settingsMenu[key].val && (this.settingsMenu[key].val = !1),
                    this.settingsMenu[key].set(this.settingsMenu[key].val, !0)
            }
    }

    keyDown(event) {
        if (document.activeElement.id === 'chatInput') return
        let opt = null
        switch (event.key.toUpperCase()) {
            case 'B':
                this.settings.bhop++;
                if (this.settings.bhop > 2) this.settings.bhop = 0
                this.setSetting('bhop', this.settings.bhop)
                opt = this.settings.bhop === 0 ? 'Disabled' : (this.settings.bhop === 2 ? 'Manual' : 'Automatic');
                this.chatMessage(null, `<span style='color:#fff'>BHop - </span> <span style='color:${this.settings.bhop > 0 ? 'green' : 'red'}'>${opt}</span>`, !0)
                break;

            case 'T':
                this.settings.autoAim++;
                if (this.settings.autoAim > 4) this.settings.autoAim = 0
                this.setSetting('autoAim', this.settings.autoAim)
                opt = this.settings.autoAim === 0 ? 'Disabled' : (this.settings.autoAim === 4 ? 'Hip Fire' : (this.settings.autoAim === 3 ? 'Manual' : (this.settings.autoAim === 2 ? 'Quickscoper' : 'TriggerBot')));
                this.chatMessage(null, `<span style='color:#fff'>AutoAim - </span> <span style='color:${this.settings.autoAim > 0 ? 'green' : 'red'}'>${opt}</span>`, !0)
                break;

            case 'Y':
                this.settings.esp++;
                if (this.settings.esp > 2) this.settings.esp = 0
                this.setSetting('esp', this.settings.esp)
                opt = this.settings.esp === 0 ? 'Disabled' : (this.settings.esp === 2 ? 'Box' : 'Full');
                this.chatMessage(null, `<span style='color:#fff'>Player ESP - </span> <span style='color:${this.settings.esp > 0 ? 'green' : 'red'}'>${opt}</span>`, !0)
                break;

            case 'U':
                this.settings.espColor++;
                if (this.settings.espColor > 8) this.settings.espColor = 0
                this.setSetting('espColor', this.settings.espColor);
                opt = this.colors[this.settings.espColor]
                this.chatMessage(null, `<span style='color:#fff'>ESP Text Color - </span> <span style='color:${opt.toLowerCase()}'>${opt}</span>`, !0)
                break;

            case 'O':
                this.settings.lineColor++;
                if (this.settings.lineColor > 8) this.settings.lineColor = 0
                this.setSetting('lineColor', this.settings.lineColor);
                opt = this.linecolors[this.settings.lineColor]
                this.chatMessage(null, `<span style='color:#fff'>ESP Line Color - </span> <span style='color:${opt.toLowerCase()}'>${opt}</span>`, !0)
                break;

            case 'N':
                this.systemactive()

            case ' ':
                if (this.settings.bhop !== 2) return;
                this.settings.bhopHeld = true;
                break;
        }
    }

    keyUp(event) {
        if (document.activeElement.id === 'chatInput') return
        if (event.keyCode === 32) this.settings.bhop !== 2 ? void 0 : this.settings.bhopHeld = false
    }

    chatMessage(t, e, n) {
        const chatList = document.getElementById('chatList');
        for (chatList.innerHTML += n ? `<div class='chatItem'><span class='chatMsg'>${e}</span></div><br/>` : `<div class='chatItem'>${t || "unknown"}: <span class='chatMsg'>${e}</span></div><br/>`; chatList.scrollHeight >= 250;) chatList.removeChild(chatList.childNodes[0])
    }

    getMyself() {
        return this.hooks.entities.find(x => x.isYou)
    }

    randFloat(t, e) {
        return t + Math.random() * (e - t)
    }

    getDirection(t, e, n, r) {
        return Math.atan2(e - r, t - n)
    }

    getXDir(e, n, r, i, a, s) {
        const o = Math.abs(n - a)
        const c = this.getDistance3D(e, n, r, i, a, s)
        return Math.asin(o / c) * (n > a ? -1 : 1)
    }

    getAngleDist(t, e) {
        return Math.atan2(Math.sin(e - t), Math.cos(t - e))
    }

    getTarget() {
        let target = null
        let bestDist = this.getRange()
        for (const player of this.hooks.entities.filter(x => !x.isYou)) {
            if ((player.isVisible || this.settings.autoAimWalls) && player.active) {
                if (this.me.team && this.me.team === player.team) continue
                let dist = this.getDistance3D(this.me.x, this.me.y, this.me.z, player.x, player.y, player.z)
                if (dist < bestDist) {
                    bestDist = dist
                    target = player
                }
            }
        }
        return target
    }

    getDistFromPlayer(player) {
        return Math.floor(this.me ? this.getDistance3D(this.me.x, this.me.y, this.me.z, player.x, player.y, player.z) : 0)
    }

    getRange() {
        if (this.settings.autoAimRange != 'Default') return parseInt(this.settings.autoAimRange)
        if (this.me.weapon.range) return this.me.weapon.range + 25
        return 9999
    }

     text(txt, font, color, x, y) {
        this.ctx.save()
        this.ctx.translate(x, y)
        this.ctx.beginPath()
        this.ctx.fillStyle = color
        this.ctx.font = font
        this.ctx.fillText(txt, 0, 0)
        this.ctx.closePath()
        this.ctx.restore()
    }

    rect(x, y, ox, oy, w, h, color, fill) {
        this.ctx.save()
        this.ctx.translate(x, y)
        this.ctx.beginPath()
        fill ? this.ctx.fillStyle = color : this.ctx.strokeStyle = color
        this.ctx.rect(ox, oy, w, h)
        fill ? this.ctx.fill() : this.ctx.stroke()
        this.ctx.closePath()
        this.ctx.restore()
    }

    line(x1, y1, x2, y2, lW, sS) {
        this.ctx.save()
        this.ctx.lineWidth = lW
        this.ctx.beginPath()
        this.ctx.strokeStyle = sS
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)
        this.ctx.stroke()
        this.ctx.restore()
    }

    image(x, y, img, ox, oy, w, h) {
        this.ctx.save()
        this.ctx.translate(x, y)
        this.ctx.beginPath()
        this.ctx.drawImage(img, ox, oy, w, h)
        this.ctx.closePath()
        this.ctx.restore()
    }

        drawESP() {
        for (const entity of this.hooks.entities.filter(x => !x.isYou)) {
            if (entity.active) {
                const me = this.hooks.world.camera.getWorldPosition()
                const target = entity.objInstances.position.clone()
                const dist = 1 - this.getDistance3D(me.x, me.y, me.z, target.x, target.y, target.z) / 600
                if (20 * dist >= 1 && this.hooks.world.frustum.containsPoint(target)) {
                    const scale = Math.max(.1, 1 - this.getDistance3D(me.x, me.y, me.z, target.x, target.y, target.z) / 600)
                    const targetX = entity.hookedX
                    const targetY = entity.hookedY + 60 * scale
                    const offsetX = 80
                    const offsetY = 180
                    const color = this.colors[this.settings.espColor]
                    const linecolor = this.linecolors[this.settings.lineColor]
                    const defaultcolor = (entity.team === null ? "red" : this.getMyself().team === entity.team ? "green" : "red")
                    if (this.settings.esp > 0) {
                        if(this.settings.lineColor>=1)
                        {
                        this.rect(targetX - (offsetX * scale / 2) - (40 * scale / 2), targetY - (offsetY * scale / 2), 0, 0, 20 * scale, offsetY * scale, linecolor, false)
                        this.rect(targetX - (offsetX * scale / 2), targetY - (offsetY * scale / 2), 0, 0, offsetX * scale, offsetY * scale, linecolor, false)
                        } else {
                        this.rect(targetX - (offsetX * scale / 2) - (40 * scale / 2), targetY - (offsetY * scale / 2), 0, 0, 20 * scale, offsetY * scale, defaultcolor, false)
                        this.rect(targetX - (offsetX * scale / 2), targetY - (offsetY * scale / 2), 0, 0, offsetX * scale, offsetY * scale, defaultcolor, false)
                        }
                        this.rect(targetX - (offsetX * scale / 2) - (40 * scale / 2), targetY - (offsetY * scale / 2), 0, 0, 20 * scale, offsetY * scale, "green", true)
                        this.rect(targetX - (offsetX * scale / 2) - (40 * scale / 2), targetY - (offsetY * scale / 2), 0, 0, 20 * scale, (entity.maxHealth - entity.health) / entity.maxHealth * offsetY * scale, "red", true)
                        if (this.settings.esp === 1) {
                            const fontSize = 26 * scale > 13 ? 13 : 26 * scale
                            let spacing = scale < 0.5 ? 2 : 0
                            if(this.settings.espColor>0)
                            {
                            this.text(`Name: ${entity.name} ${entity.clan ? `[${entity.clan}]` : ``} Lvl: ${entity.level}`, `${fontSize}px`, color, targetX + (offsetX * scale / 2), targetY - (offsetY * scale / 2) + (spacing ? spacing += 4 : 10 * scale))
                            this.text(`Distance: ${~~this.getDistance3D(me.x, me.y, me.z, target.x, target.y, target.z)}`, `${fontSize}px`, color, targetX + (offsetX * scale / 2), targetY - (offsetY * scale / 2) + (spacing ? spacing += 7 : 25 * scale))
                            this.text(`Health: ${entity.health}/${entity.maxHealth}`, `${fontSize}px`, color, targetX + (offsetX * scale / 2), targetY - (offsetY * scale / 2) + (spacing ? spacing += 7 : 40 * scale))
                            this.text(`Weapon: ${entity.weapon.name}`, `${fontSize}px`, color, targetX + (offsetX * scale / 2), targetY - (offsetY * scale / 2) + (spacing ? spacing += 7 : 55 * scale))
                            if (entity.weapon.ammo) this.text(`Ammo: ${entity.ammos[entity.weaponIndex]} / ${entity.weapon.ammo}`, `${fontSize}px`, color, targetX + (offsetX * scale / 2), targetY - (offsetY * scale / 2) + (spacing ? spacing += 7 : 70 * scale))
                            } else {
                            this.text(`Name: ${entity.name} ${entity.clan ? `[${entity.clan}]` : ``} Lvl: ${entity.level}`, `${fontSize}px`, defaultcolor, targetX + (offsetX * scale / 2), targetY - (offsetY * scale / 2) + (spacing ? spacing += 4 : 10 * scale))
                            this.text(`Distance: ${~~this.getDistance3D(me.x, me.y, me.z, target.x, target.y, target.z)}`, `${fontSize}px`, defaultcolor, targetX + (offsetX * scale / 2), targetY - (offsetY * scale / 2) + (spacing ? spacing += 7 : 25 * scale))
                            this.text(`Health: ${entity.health}/${entity.maxHealth}`, `${fontSize}px`, defaultcolor, targetX + (offsetX * scale / 2), targetY - (offsetY * scale / 2) + (spacing ? spacing += 7 : 40 * scale))
                            this.text(`Weapon: ${entity.weapon.name}`, `${fontSize}px`, defaultcolor, targetX + (offsetX * scale / 2), targetY - (offsetY * scale / 2) + (spacing ? spacing += 7 : 55 * scale))
                            if (entity.weapon.ammo) this.text(`Ammo: ${entity.ammos[entity.weaponIndex]} / ${entity.weapon.ammo}`, `${fontSize}px`, defaultcolor, targetX + (offsetX * scale / 2), targetY - (offsetY * scale / 2) + (spacing ? spacing += 7 : 70 * scale))
                            }
                        }
                    }
                    if (this.settings.tracers) this.line(innerWidth / 2, innerHeight - 1, targetX, targetY, 2, entity.team === null ? "red" : this.getMyself().team === entity.team ? "green" : "red")
                }
            }
        }
    }

    drawFPS() {
        if (!this.settings.fpsCounter && this.fpsCounter.innerHTML.length > 0) return void(this.fpsCounter.innerHTML = '')
        const now = performance.now()
        for (; this.fpsTimes.length > 0 && this.fpsTimes[0] <= now - 1e3;) this.fpsTimes.shift()
        this.fpsTimes.push(now)
        this.fps = this.fpsTimes.length
        this.fpsCounter.innerHTML = `FPS: ${this.fps}`
        this.fpsCounter.style.color = this.fps > 50 ? 'green' : (this.fps < 30 ? 'red' : 'orange')
    }

    drawFlag() {
        if (window.objectiveIcon && window.objectiveIcon.style.display === "inline-block") this.image(parseFloat(window.objectiveIcon.style.left) / 100 * innerWidth, parseFloat(window.objectiveIcon.style.top) / 100 * innerHeight, this.flag, 0, 0, parseFloat(window.objectiveIcon.style.width), parseFloat(window.objectiveIcon.style.height))
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
        if (!this.settings.autoRespawn) return
        if (this.me && this.me.y === undefined && !document.pointerLockElement) this.camera.toggle(true)
    }

    autoSwap() {
        if (!this.settings.autoSwap || !this.me.weapon.ammo || this.me.ammos.length < 2) return
        if (this.me.ammos[this.me.weaponIndex] === 0 && this.me.ammos[0] != this.me.ammos[1]) {
            this.inputs[10] = 1;
        }
    }

    initAimbot() {
        let self = this
        this.initialized = true
        this.changeSettings()
        this.camera.camLookAt = function(x, y, z) {
            if (!x) return void(this.aimTarget = null)
            const a = self.getXDir(this.object.position.x, this.object.position.y, this.object.position.z, x, y, z)
            const h = self.getDirection(this.object.position.z, this.object.position.x, z, x)
            this.aimTarget = {
                xD: a,
                yD: h,
                x: x + self.hooks.config.camChaseDst * Math.sin(h) * Math.cos(a),
                y: y - self.hooks.config.camChaseDst * Math.sin(a),
                z: z + self.hooks.config.camChaseDst * Math.cos(h) * Math.cos(a)
            }
        }
        this.camera.updateOld = this.camera.update
        this.camera.update = function() {
            if (!this.target && this.aimTarget) {
                if (self.settings.autoAim > 0) {
                    this.object.rotation.y = this.aimTarget.yD
                    this.pitchObject.rotation.x = this.aimTarget.xD
                }
                const c = Math.PI / 2
                this.pitchObject.rotation.x = Math.max(-c, Math.min(c, this.pitchObject.rotation.x))
                this.yDr = (this.pitchObject.rotation.x % Math.PI2).round(3)
                this.xDr = (this.object.rotation.y % Math.PI2).round(3)
            }
            let ret = this.updateOld(...arguments)
            return ret
        }
        this.camera.resetOld = this.camera.reset
        this.camera.reset = function() {
            this.aimTarget = null
            let ret = this.resetOld(...arguments)
            return ret
        }
    }

    updateAimbot() {
        if (!this.settings.autoAim > 0) {
            return
        }
        if (!this.initialized) this.initAimbot()
        const target = this.getTarget()
        if (target) {
            if ((this.settings.autoAim === 3 && this.me.aimVal === 1) || (this.settings.autoAim === 4 && this.me.aimVal === 0)) return void this.camera.camLookAt(null)
            target.y += this.hooks.config.playerHeight - this.hooks.config.cameraHeight - this.hooks.config.crouchDst * target.crouchVal
            target.y -= (this.me.recoilAnimY * this.hooks.config.recoilMlt) * 25
            this.camera.camLookAt(target.x, target.y, target.z)
            if (this.settings.autoAim === 1) {
                if (this.camera.mouseDownR !== 1) {
                    this.camera.mouseDownR = 1
                } else {
                    this.camera.mouseDownL = this.camera.mouseDownL === 1 ? 0 : 1
                }
            } else if (this.settings.autoAim === 2) {
                this.camera.mouseDownR = 1
                if (this.me.aimVal === 0) {
                    if (this.camera.mouseDownL === 0) {
                        this.camera.mouseDownL = 1
                    } else {
                        this.camera.mouseDownR = 0
                        this.camera.mouseDownL = 0
                    }
                }
            }
        } else {
            this.camera.camLookAt(null)
            if (this.settings.autoAim === 1) {
                this.camera.mouseDownL = 0
                if (this.camera.mouseDownR !== 0) {
                    this.camera.mouseDownR = 0
                }
            } else if (this.settings.autoAim === 2) {
                this.camera.mouseDownR = 0
                this.camera.mouseDownL = 0
            }
        }
    }

    changeSettings() {
        if (this.settings.aimSettings) {
            this.hooks.config.camChaseTrn = 0.05
            this.hooks.config.camChaseSpd = 15000000
            this.hooks.config.camChaseSen = 15000000
            this.hooks.config.camChaseDst = 0
        } else {
            this.hooks.config.camChaseTrn = .0022
            this.hooks.config.camChaseSpd = .0012
            this.hooks.config.camChaseSen = .2
            this.hooks.config.camChaseDst = 24
        }
    }

    render() {
        this.ctx.clearRect(0, 0, innerWidth, innerHeight)
        this.drawESP()
        this.drawFPS()
        this.drawFlag()
        this.autoRespawn()
        requestAnimationFrame(this.render.bind(this))
    }

    loop(camera, me, inputs, game, socket = null, u = null) {
        this.me = me
        this.camera = camera
        this.game = game
        this.inputs = inputs
        this.bhop()
        this.updateAimbot()
        this.noRecoil()
        this.autoSwap()
    }

    setSetting(t, e) {
        document.getElementById(`slid_hack${t}`) && (document.getElementById(`slid_hack${t}`).innerHTML = e),
            this.settingsMenu[t].set(e),
            this.settingsMenu[t].val = e,
            this.saveVal(`kro_set_hack_${t}`, e)
    }

    saveVal(t, e) {
        const r = "undefined" != typeof Storage;
        r && localStorage.setItem(t, e)
    }

    getSavedVal(t) {
        const r = "undefined" != typeof Storage;
        return r ? localStorage.getItem(t) : null
    }

    systemactive() {
        this.itemshower = !this.itemshower;
            if(this.itemshower==true)
            {
                $("#aHolder").show();
            } else {
                $('#aHolder').hide();
            }
    }

    onLoad() {
        window.playerInfos.style.width = "0%"
        this.createCanvas()
        this.createFPSCounter()
        this.createMenu()
        $('#aHolder').css({
			'background-color': 'white'
		});
        $("#aHolder").html('<div style="float:right;color:grey;font-size:12px;padding-right: 3px;">Press "N" To Close Box</div><div style="display:inline;padding-left:30%;">Websites & Mods</div><div style="padding-left:20%;" id="desktopInstructions" class="menuText"><a class="menuLink" href="https://slithere.com" target="_blank" style="font-size:12px;">SLITHERE.COM</a> - <a class="menuLink" href="https://krunkerio.net" target="_blank" style="font-size:12px;">KRUNKERIO.NET</a> - <a class="menuLink" href="https://zombsroyaleio.org" target="_blank" style="font-size:12px;">ZOMBSROYALEIO.ORG</a> - <a class="menuLink" href="https://diepioplay.com" target="_blank" style="font-size:12px;">DIEPIOPLAY.COM</a> - <a class="menuLink" href="https://survivio.info" target="_blank" style="font-size:12px;">SURVIVIO.INFO</a> -<a class="menuLink" href="https://skribbl-io.net" target="_blank" style="font-size:12px;">SKRIBBLIO.NET</a></br><a class="menuLink" href="https://bonk-io.net" target="_blank" style="font-size:12px;">BONK-IO.NET</a> - <a class="menuLink" href="https://mope-io.net" target="_blank" style="font-size:12px;">MOPE-IO.NET</a> - <a class="menuLink" href="https://mopeiogame.com" target="_blank" style="font-size:12px;">MOPEIOGAME.COM</a> - <a class="menuLink" href="https://moomooioplay.com" target="_blank" style="font-size:12px;">MOOMOOIOPLAY.COM</a> - <a class="menuLink" href="https://diepioplay.org" target="_blank" style="font-size:12px;">DIEPIOPLAY.ORG</a> - <a class="menuLink" href="https://iogameslist.org" target="_blank" style="font-size:12px;">IOGAMESLIST.ORG</a></div></center>');
		$("#followHolder").prepend('</br><a style=\"color:orange;\" href="https://slithere.com" target="_blank">SLITHERE.COM</a></br><a style=\"color:yellow;\" href="https://krunkerio.net" target="_blank">KRUNKERIO.NET</a>');
        $("#healthHolder").append('<a style=\"color:yellow;top:1520px;\" href="https://slithere.com" target="_blank">SLITHERE.COM</a>');
        $("#linksHolder").html('<a href=\'javascript:;\' onmouseover="SOUND.play(\'tick_0\',0.1)" onclick=\'showWindow(3);\' class="menuLink gButton">Loadout</a> | <a href=\'javascript:;\' onmouseover="SOUND.play(\'tick_0\',0.1)" onclick=\'showWindow(5);window.open("https://krunkerio.net", "_blank", "location=yes,height=570,width=520,scrollbars=yes,status=yes");\' class="menuLink gButton">Account</a> | <a href=\'javascript:;\' onmouseover="SOUND.play(\'tick_0\',0.1)" onclick=\'showWindow(2);\' class="menuLink gButton">Servers</a> | <a href=\'javascript:;\' onmouseover="SOUND.play(\'tick_0\',0.1)" onclick=\'showWindow(14);\' class="menuLink gButton">Store</a>');
    }
}

GM_xmlhttpRequest({
    method: "GET",
    url: "https://krunker.io/js/game.js",
    onload: res => {
        let code = res.responseText
        code = code.replace(/String\.prototype\.escape=function\(\){(.*)\)},(Number\.)/, "$2")
            .replace(/if\(\w+\.isVisible\){/, "if(true){")
            .replace(/}else \w+\.style\.display="none"/, "}")
            .replace(/(\bthis\.list\b)/g, "window.hack.hooks.entities")
            .replace(/\w+\.players\.list/g, "window.hack.hooks.entities")
            .replace(/(function\(\w+,(\w+),\w+,\w+,\w+,\w+,\w+\){var \w+,\w+,\w+,\w+;window\.hack\.hooks\.entities=\[\])/, "$1;window.hack.hooks.world=$2")
            .replace(/(\w+\.style\.left=)100\*(\w+\.\w+)\+"%",/, '$1$2*innerWidth+"px",window.hack.hooks.entities[i].hookedX=$2*innerWidth,')
            .replace(/(\w+\.style\.top=)100\*\(1-(\w+\.\w+)\)\+"%",/, '$1(1-$2)*innerHeight+"px",window.hack.hooks.entities[i].hookedY=(1-$2)*innerHeight,')
            .replace(/"mousemove",function\((\w+)\){if\((\w+)\.enabled/, '"mousemove",function($1){window.hack.hooks.context = $2;if($2.enabled')
            .replace(/(\w+).procInputs\((\w+),(\w+)\),(\w+).moveCam/, 'window.hack.loop($4, $1, $2, $3), $1.procInputs($2,$3),$4.moveCam')
            .replace(/(\w+).exports\.ambientVal/, 'window.hack.hooks.config = $1.exports, $1.exports.ambientVal')
            .replace(/window\.updateWindow=function/, 'windows.push({header: "Hack Settings", html: "",gen: function () {var t = ""; for (var key in window.hack.settingsMenu) {window.hack.settingsMenu[key].pre && (t += window.hack.settingsMenu[key].pre), t += "<div class=\'settName\'>" + window.hack.settingsMenu[key].name + " " + window.hack.settingsMenu[key].html() + "</div>";} return t;}});window.hack.setupSettings();\nwindow.updateWindow=function')
            .replace(/window\.addEventListener\("keydown",function\((\w+)\){/, 'window.addEventListener("keydown",function($1){window.hack.keyDown($1),')
            .replace(/window\.addEventListener\("keyup",function\((\w+)\){/, 'window.addEventListener("keyup",function($1){window.hack.keyUp($1),')
            .replace(/hitHolder\.innerHTML=(\w+)}\((\w+)\),(\w+).update\((\w+)\)(.*)"block"==nukeFlash\.style\.display/, 'hitHolder.innerHTML=$1}($2),$3.update($4),"block" === nukeFlash.style.display')
            .replace(/(\w+)\("Kicked for inactivity"\)\),(.*),requestAnimFrame\((\w+)\)/, '$1("Kicked for inactivity")),requestAnimFrame($3)');

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://krunker.io/",
            onload: res => {
                let html = res.responseText
                html = html.replace(' src="js/game.js">', `>${Hack.toString()}\nwindow.hack = new Hack();\n${code.toString()}`)
                document.open()
                document.write(html)
                document.close()
            }
        })
    }
})