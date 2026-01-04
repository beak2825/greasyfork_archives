// ==UserScript==
// @name         Krunker Cheats Menu
// @description  A Krunker.io Hack Script (Aimbot, ESP, And More!)
// @version      1.7.1
// @author       kirua sato
// @include      /^(https?:\/\/)?(www\.)?(.+)krunker\.io(|\/|\/\?.+)$/
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/377476
// @downloadURL https://update.greasyfork.org/scripts/390534/Krunker%20Cheats%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/390534/Krunker%20Cheats%20Menu.meta.js
// ==/UserScript==

const cStruct = (...keys) => ((...v) => keys.reduce((o, k, i) => {
            o[k] = v[i];
            return o
        }, {}))
        const Vector3 = (x, y, z) => {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            return this;
        }
        const fmt = (format, ...args) => {
            return format
                .split("%%")
                .reduce((aggregate, chunk, i) => aggregate + chunk + (args[i] || ""), "");
        }
        class Utilities {
            constructor() {
                this.inputs;
                this.exports;
                this.control;
                this.functions;
                this.weapons;
                this.wpnClasses;
                this.self;
                this.ui;
                this.settings = {
                    scopingOut: false,
                    canShoot: true,
                    targetCoolDown: 500,
                    weaponIndex: 0,
                    isSliding: false,
                    dirtyCanvas: false,
                    espMode: 0,
                    espFontMlt: 10,

                };
                this.playerInfo = false;
                this.canvas;
                this.ctx;
                this.spinTimer = 1800;
                this.features = [];
                this.onLoad();
                this.colors = {
                    aqua: '#7fdbff',
                    blue: '#0074d9',
                    lime: '#01ff70',
                    navy: '#001f3f',
                    teal: '#39cccc',
                    olive: '#3d9970',
                    green: '#2ecc40',
                    red: '#ff4136',
                    maroon: '#85144b',
                    orange: '#ff851b',
                    purple: '#b10dc9',
                    yellow: '#ffdc00',
                    fuchsia: '#f012be',
                    greyDark: '#808080',
                    greyMed: '#A9A9A9',
                    greyLight: '#D3D3D3',
                    white: '#ffffff',
                    black: '#111111',
                    silver: '#dddddd',
                    hostile: '#EB5656',
                    friendly: '#9EEB56',
                };
            }

            onLoad() {
                this.newFeature('None', "1", ['Off', 'On']);
                this.newFeature('BestAimbot', "2", ['Off', 'On']);
                this.newFeature('AutoBhop', "3", ['Off', 'Auto Jump', 'Auto SlideJump']);
                this.newFeature('AutoReload', "4", []);
                this.newFeature('Fake Lag', '5', ['Off','100 Ping','500 Ping','1000 Ping']);
                this.newFeature('Esp', "6", ['Off', 'Walls', 'Walls/Tracers', 'Walls/Tracers/2d', 'Full Esp']);
                this.newFeature('Server Crasher', '7', ['Off','Disconnect','Disconnect Others','Server Dumper']);
                this.newFeature('Hide Menu', 'M', []);
                window.addEventListener("keydown", event => this.onKeyDown(event));
                const interval = setInterval(() => {
                    if (document.querySelector('#leaderDisplay') !== null) {
                        clearInterval(interval);
                        this.createInfoBox();
                        this.createCanvas();
                    }
                }, 100);
            }

            onTick() {
                for (let i = 0, sz = this.features.length; i < sz; i++) {
                    const feature = this.features[i];
                    switch (feature.name) {
                        case 'AutoAim':
                            if (feature.value) this.AutoAim(feature.value);
                            break;
                        case 'AutoReload':
                            if (feature.value) this.wpnReload();
                            break;
                        case 'AutoBhop':
                            if (feature.value) this.AutoBhop(feature.value);
                            break;
                        case 'EspMode':this.settings.espMode = feature.value;break;
                             break;
                        case 'BestAimbot':
                            if (feature.value) this.BestAimbot(feature.value);
                            break;
                    }
                }
                this.playerInfo = (this.settings.espMode == 0 || this.settings.espMode == 4) ? false : true;
                if (this.settings.espMode) {
                    window.requestAnimationFrame(() => {
                        this.ctx.clearRect(0, 0, innerWidth, innerHeight);
                        this.drawESP();
                    });
                } else if (this.settings.dirtyCanvas) {
                    this.ctx.clearRect(0, 0, innerWidth, innerHeight);
                    this.settings.dirtyCanvas = false;
                }
            }
            // Ui
            line(x1, y1, x2, y2, lW, sS) {
                this.ctx.save();
                this.ctx.lineWidth = lW + 2;
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.strokeStyle = "rgba(23,67,88,0.5)";
                this.ctx.stroke();
                this.ctx.lineWidth = lW;
                this.ctx.strokeStyle = sS;
                this.ctx.stroke();
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

            circle(x, y, r, w, color, fill = false) {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.lineWidth = w;
                fill ? this.ctx.fillStyle = color : this.ctx.strokeStyle = color;
                this.ctx.arc(x, y, r, 0, 2 * Math.PI);
                fill ? this.ctx.fill() : this.ctx.stroke();
                this.ctx.closePath();
                this.ctx.restore();
            }

            text(txt, font, color, x, y) {
                this.ctx.save();
                this.pixelTranslate(this.ctx, x, y);
                this.ctx.fillStyle = color;
                this.ctx.strokeStyle = "rgba(23,67,88,0.5)";
                this.ctx.font = font;
                this.ctx.lineWidth = 1;
                this.ctx.strokeText(txt, 0, 0);
                this.ctx.fillText(txt, 0, 0);
                this.ctx.restore();
            }

            image(x, y, img, ox, oy) {
                this.ctx.save();
                this.ctx.translate(x, y);
                this.ctx.beginPath();
                this.ctx.drawImage(img, ox, oy);
                this.ctx.closePath();
                this.ctx.restore();
                this.drawn = true;
            }

            pixelTranslate(ctx, x, y) {
                ctx.translate(~~x, ~~y);
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

            world2Screen(pos3d, camera) {
                // this.canvas.width / window.innerWidth
                // this.canvas.height / window.innerHeight
                let pos = pos3d.clone();
                let width = this.canvas.width,
                    height = this.canvas.height;
                let widthHalf = width / 2,
                    heightHalf = height / 2;
                pos.project(camera);
                pos.x = (pos.x * widthHalf) + widthHalf;
                pos.y = -(pos.y * heightHalf) + heightHalf;
                return pos;
            }

            teamCol(player, secondary) {
                return player.team === null ? secondary ? this.colors.red : this.colors.hostile : this.self.team === player.team ? secondary ? this.colors.green : this.colors.friendly : secondary ? this.colors.red : this.colors.hostile;
            }

                       drawESP() {
                const players = this.world.players.list.filter(x => !x.isYou).filter(x => x.active).filter(x => this.ui.frustum.containsPoint(x)).sort((a, b) => this.getDistance(this.self, a) - this.getDistance(this.self, b));
                for (const player of players) {
                    let offset = Vector3(0, this.server.playerHeight + this.server.nameOffsetHat - player.crouchVal * this.server.crouchDst, 0);
                    let screenG = this.world2Screen(player.objInstances.position.clone(), this.ui.camera);
                    let screenH = this.world2Screen(player.objInstances.position.clone().add(offset), this.ui.camera);
                    let hDiff = ~~(screenG.y - screenH.y);
                    let bWidth = ~~(hDiff * 0.6);

                    if (this.settings.espMode > 1) this.line(innerWidth / 2, innerHeight - 1, screenG.x, screenG.y, 2, this.teamCol(player, 0));
                    if (this.settings.espMode > 2) {
						if (this.settings.espMode > 3) {
                        let health = this.getPercentage(player.health, player.maxHealth);
                        this.rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, -3, 0, 6, hDiff + 2, this.colors.black, false);
                        this.rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, -3, 0, 6, hDiff + 2, health > 75 ? this.colors.green : health > 50 ? this.colors.orange : this.colors.red, true);
                        this.rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, -3, 0, 6, ~~((player.maxHealth - player.health) / player.maxHealth * (hDiff + 2)), this.colors.black, true);
                        }
						this.ctx.save();
                        this.ctx.lineWidth = 4;
                        this.pixelTranslate(this.ctx, screenH.x - bWidth / 2, screenH.y);
                        this.ctx.beginPath();
                        this.ctx.rect(0, 0, bWidth, hDiff);
                        this.ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
                        this.ctx.stroke();
                        this.ctx.lineWidth = 2;
                        this.ctx.strokeStyle = this.teamCol(player, 0);
                        this.ctx.stroke();
                        this.ctx.closePath();
                        this.ctx.restore();
                        if (this.settings.espMode > 3) {
                            let playerDist = (Math.round(this.getDistance(this.ui.camera.getWorldPosition(), player)) / 10).toFixed(0);
                            let FontSize = this.settings.espFontMlt*(Math.max(0.3,1.0-playerDist/600));
                            this.ctx.save();
                            let meas = this.getTextMeasurements(["[", playerDist, "]", player.level, '000', player.name, player.weapon.name+'0000']);
                            this.ctx.restore();
                            let padding = 2;
                            let grad2 = this.gradient(0, 0, meas[4] * 5, 0, ["rgba(0, 0, 0, 0.25)", "rgba(0, 0, 0, 0)"]);
                            this.rect(~~(screenH.x + bWidth / 2) + padding, ~~screenH.y - padding, 0, 0, (meas[4] * 5), (meas[4] * 4) + (padding * 2), grad2, true);

                            this.text(player.name, (FontSize + 2) + 'px GameFont', this.colors.white, (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 1)
                            if (player.clan) this.text("["+player.clan+"]", FontSize + 'px GameFont', "#AAAAAA", (screenH.x + bWidth / 2) + 8 + meas[5], screenH.y + meas[4] * 1)

                            this.text(fmt("Level:%%", player.level ? player.level : 0), FontSize + 'px GameFont', this.colors.yellow, (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 2)

                            this.text(player.weapon.name, FontSize + 'px GameFont', this.colors.greyMed, (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 3)
                            //this.text(fmt("[%%/%%]", player.weapon.ammo ? player.ammos[player.weaponIndex] : 0, player.weapon.ammo ? player.weapon.ammo : 0), FontSize + 'px GameFont', this.colors.greyDark, (screenH.x + bWidth / 2) + 8 + meas[6], screenH.y + meas[4] * 3)
                            //this.text("[", FontSize + 'px GameFont', this.colors.greyMed, (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 4)
                            this.text(playerDist, FontSize + 'px GameFont', this.colors.white, (screenH.x + bWidth / 2) + 4 + meas[0], screenH.y + meas[4] * 4)
                            this.text("mt", FontSize + 'px GameFont', this.colors.white, (screenH.x + bWidth / 2) + 4 + meas[0] + meas[1], screenH.y + meas[4] * 4)
                        }
                    }
                }

                this.settings.canvasNeedsClean = true;
            }

            onRender() {
                window.requestAnimationFrame(() => {
                    this.onRender()
                })
            }

            createCanvas() {
                const hookedCanvas = window.document.createElement("canvas");
                hookedCanvas.id = "canvas_overlay";
                hookedCanvas.width = innerWidth;
                hookedCanvas.height = innerHeight;

                function resize() {
                    const ws = innerWidth / 1700;
                    const hs = innerHeight / 900;
                    hookedCanvas.width = innerWidth;
                    hookedCanvas.height = innerHeight;
                    hookedCanvas.style.width = (hs < ws ? (innerWidth / hs).toFixed(3) : 1700) + "px";
                    hookedCanvas.style.height = (ws < hs ? (innerHeight / ws).toFixed(3) : 900) + "px";
                }
                window.addEventListener('resize', resize);
                resize();
                this.canvas = hookedCanvas;
                this.ctx = hookedCanvas.getContext("2d");
                const hookedUI = window.inGameUI;
                hookedUI.insertAdjacentElement("beforeend", hookedCanvas);
                window.requestAnimationFrame(() => {
                    this.onRender()
                })
            }

            onUpdated(feature) {
                if (feature.container.length) {
                    feature.value += 1;
                    if (feature.value > feature.container.length - 1) {
                        feature.value = 0;
                    }
                    feature.valueStr = feature.container[feature.value];
                } else {
                    feature.value ^= 1;
                    feature.valueStr = feature.value ? "true" : "false";
                }
                switch (feature.name) {
                    case 'ForceScope':
                        feature.value || this.self.weapon.name === "Sniper Rifle" || this.self.weapon.name === "Semi Auto" ? this.self.weapon.scope = 1 : delete this.self.weapon.scope;
                        break;
                    case 'EspMode':
                        this.settings.dirtyCanvas = true;
                        break;
                }
                window.saveVal("utilities_" + feature.name, feature.value);
                this.updateInfoBox();
            }

            getStatic(s, d) {
                if (typeof s == 'undefined') {
                    return d;
                }
                return s;
            }

            newFeature(name, key, array) {
                const feature = cStruct('name', 'hotkey', 'value', 'valueStr', 'container')
                const value = parseInt(window.getSavedVal("utilities_" + name) || 0);
                this.features.push(feature(name, key, value, array.length ? array[value] : value ? "true" : "false", array));
            }

            getFeature(name) {
                for (const feature of this.features) {
                    if (feature.name.toLowerCase() === name.toLowerCase()) {
                        return feature;
                    }
                }
                return cStruct('name', 'hotkey', 'value', 'valueStr', 'container');
            }

            createInfoBox() {
                const leaderDisplay = document.querySelector('#leaderDisplay');
                if (leaderDisplay) {
                    let infoBox = document.createElement('div');
                    if (infoBox) infoBox.innerHTML = '<div> <style> #InfoBox { text-align: left; width: 310px; z-index: 3; padding: 10px; padding-left: 20px; padding-right: 20px; color: rgba(255, 255, 255, 0.7); line-height: 25px; margin-top: 0px; background-color: rgba(34,107,66); } #InfoBox .utilitiesTitle { font-size: 16px; font-weight: bold; text-align: center; color: #1A72B8; margin-top: 5px; margin-bottom: 5px; } #InfoBox .leaderItem { font-size: 14px; } </style> <div id="InfoBox"></div> </div>'.trim();
                    leaderDisplay.parentNode.insertBefore(infoBox.firstChild, leaderDisplay.nextSibling);
                    this.updateInfoBox();
                }
            }

            upperCase(str) {
                return str.toUpperCase();
            }

            toProperCase(str) {
                str = str.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2');
                str = str.replace(/\s[a-z]/g, this.upperCase)
                return str;
            }

            updateInfoBox() {
                const infoBox = document.querySelector('#InfoBox');
                if (infoBox) {
                    const lines = this.features.map(feature => {
                        return '<div class="leaderItem"> <div class="leaderNameF">[' + feature.hotkey.toUpperCase() + '] ' + this.toProperCase(feature.name) + '</div> <div class="leaderScore">' + feature.valueStr + '</div> </div>';
                    });
                    infoBox.innerHTML = '<div><span style="color:#ff0000;">F</span><span style="color:#ff7f00;">a</span><span style="color:#ffff00;">d</span><span style="color:#00ff00;">e</span><span style="color:#00ffff;"> </span><span style="color:#0000ff;">B</span><span style="color:#8b00ff;">1</span></div>' + lines.join('').trim();
                }
            }

            onKeyDown(event) {
                if (document.activeElement.tagName === "INPUT") return;
                const key = event.key.toUpperCase();
                switch (key) {
                    case 'M': {
                        const infoBox = document.querySelector('#InfoBox');
                        if (infoBox) infoBox.style.display = !infoBox.style.display || infoBox.style.display === "inline-block" ? "none" : "inline-block";
                    }
                    break;
                case 'DELETE':
                    this.resetSettings();
                    break;
                default:
                    for (const feature of this.features) {
                        if (feature.hotkey.toUpperCase() === key) {
                            this.onUpdated(feature);
                        }
                    }
                    break;
                }
            }

            getPercentage(a, b) {
                return Math.round((a / b) * 100);
            }

            getDistance3D(fromX, fromY, fromZ, toX, toY, toZ) {
                var distX = fromX - toX,
                    distY = fromY - toY,
                    distZ = fromZ - toZ;
                return Math.sqrt(distX * distX + distY * distY + distZ * distZ)
            }

            getDistance(player1, player2) {
                return this.getDistance3D(player1.x, player1.y, player1.z, player2.x, player2.y, player2.z);
            }

            getDirection(fromZ, fromX, toZ, toX) {
                return Math.atan2(fromX - toX, fromZ - toZ)
            }

            getXDir(fromX, fromY, fromZ, toX, toY, toZ) {
                var dirY = Math.abs(fromY - toY),
                    dist = this.getDistance3D(fromX, fromY, fromZ, toX, toY, toZ);
                return Math.asin(dirY / dist) * (fromY > toY ? -1 : 1)
            }

            getAngleDist(start, end) {
                return Math.atan2(Math.sin(end - start), Math.cos(start - end));
            }

            camLookAt(X, Y, Z) {
                var xdir = this.getXDir(this.control.object.position.x, this.control.object.position.y, this.control.object.position.z, X, Y, Z),
                    ydir = this.getDirection(this.control.object.position.z, this.control.object.position.x, Z, X),
                    camChaseDst = this.server.camChaseDst;
                this.control.target = {
                    xD: xdir,
                    yD: ydir,
                    x: X + this.server.camChaseDst * Math.sin(ydir) * Math.cos(xdir),
                    y: Y - this.server.camChaseDst * Math.sin(xdir),
                    z: Z + this.server.camChaseDst * Math.cos(ydir) * Math.cos(xdir)
                }
            }
            AutoBhop(value) {
                if (this.control['keys'][this.control['moveKeys'][0x0]] && value) {
                    this.control.keys[this.control.jumpKey] = this.self.onGround;
                    if (value === 2) {
                        if (this.settings.isSliding) {
                            this.inputs[8] = 1;
                            return;
                        }
                        if (this.self.yVel < -0.04 && this.self.canSlide) {
                            this.settings.isSliding = true;
                            setTimeout(() => {
                                this.settings.isSliding = false;
                            }, this.self.slideTimer);
                            this.inputs[8] = 1;
                        }
                    }
                }
            }

            BestAimbot(value) {
        if (value == 0) return;
        let isLockedOn = false;
        const target = this.getTarget();
        if (target) {
            switch (value) {
                case 1:
                if (this.control.mouseDownR === 1) {
                    this.lookAtHead(target);
                    isLockedOn = true;
                }
                break;
            }
        }
        if (!isLockedOn) {
            this.control.target = null;
            if (value !== 1 && this.control.mouseDownR === 1)
                this.timeoutHandle = setTimeout(() => {
                clearTimeout(this.timeoutHandle);
                this.timeoutHandle = null;
                this.control.mouseDownR = 0;
            }, this.settings.targetCoolDown);
        }
    }
            wpnReload(force = false) {
                const ammoLeft = this.self.ammos[this.self.weaponIndex];
                if (force || ammoLeft === 0) this.world.players.reload(this.self);
            }

            resetSettings() {
                if (confirm("Are you sure you want to reset all your hero settings? This will also refresh the page")) {
                    Object.keys(window.localStorage).filter(x => x.includes("utilities_")).forEach(x => window.localStorage.removeItem(x));
                    location.reload();
                }
            }

            getTarget() {
                const enemies = this.world.players.list
                    .filter(player => {
                        return player.active && (player.inView || this.self.dmgReceived[player.id]) && !player.isYou && (!player.team || player.team !== this.self.team);
                    })
                    .sort((p1, p2) => this.getDistance(this.self, p1) - this.getDistance(this.self, p2));
                return enemies.length ? enemies[0] : null;
            }

            lookAtHead(target) {
                this.camLookAt(target.x2, target.y2 + target.height - target.headScale * 0.75 - this.server.crouchDst * target.crouchVal - this.self.recoilAnimY * this.server.recoilMlt, target.z2);
            }

            spinTick() {
                if (this.control.mouseDownL === 1) return;
                //this.world.players.getSpin(this.self);
                //this.world.players.saveSpin(this.self, angle);
                const last = this.inputs[2];
                const angle = this.getAngleDist(this.inputs[2], this.self.xDire);
                this.spins = this.getStatic(this.spins, new Array());
                this.spinTimer = this.getStatic(this.spinTimer, this.server.spinTimer);
                this.serverTickRate = this.getStatic(this.serverTickRate, this.server.serverTickRate);
                (this.spins.unshift(angle), this.spins.length > this.spinTimer / this.serverTickRate && (this.spins.length = Math.round(this.spinTimer / this.serverTickRate)))
                for (var e = 0, i = 0; i < this.spins.length; ++i) e += this.spins[i];
                const count = Math.abs(e * (180 / Math.PI));
                if (count < 360) {
                    this.inputs[2] = this.self.xDire + Math.PI;
                } else console.log('count', count);
            }

            inputsTick(self, inputs, world) {
                //Hooked
                if (this.control && this.exports && self && inputs && world) {
                    this.inputs = inputs;
                    this.world = world;
                    this.self = self;
                    if(!this.server){
                        console.dir(this.exports.c[7].exports)
                    }
                    this.server = this.exports.c[7].exports;
                    this.functions = this.exports.c[8].exports;
                    this.weapons = this.exports.c[22].exports;
                    this.wpnClasses = this.exports.c[69].exports;
                    this.onTick();
                }
            }
        controlTick(control) {
        //Hooked
        if (control) {
            this.control = control;
            const half = Math.PI / 2;
            if (control.target) {
                control.yDr = control.target.xD % Math.PI;
                control.xDr = control.target.yD % Math.PI;
            }
        }
    }
            drawESP() {
                //Hooked
                const players = this.world.players.list.filter(x => !x.isYou).filter(x => x.active).filter(x => this.ui.frustum.containsPoint(x)).sort((a, b) => this.getDistance(this.self, a) - this.getDistance(this.self, b));
                for (const player of players) {
                    let offset = Vector3(0, this.server.playerHeight + this.server.nameOffsetHat - player.crouchVal * this.server.crouchDst, 0);
                    let screenG = this.world2Screen(player.objInstances.position.clone(), this.ui.camera);
                    let screenH = this.world2Screen(player.objInstances.position.clone().add(offset), this.ui.camera);
                    let hDiff = ~~(screenG.y - screenH.y);
                    let bWidth = ~~(hDiff * 0.6);

                }
            }
}

function read(url) {
    return new Promise(resolve => {
        fetch(url).then(res => res.text()).then(res => {
            return resolve(res);
        });
    });
}

function patch(source, method, regex, replacer) {
    const patched = source.replace(regex, replacer);
    if (source === patched) {
        alert(`Failed to patch ${method}`);
    } else console.log("Successfully patched ", method);
    return patched;
}

function patchedIndex(html) {
    html = patch(html, "html_scriptBlock", /(<script src=".*?game.*?")(><\/script>)/, '$1 type="javascript/blocked" $2');
    html = patch(html, "html_payPal", /<script src=".*?paypal.*?"><\/script>/, '');
    return html;
}

function patchedScript(script) {
    script = patch(script, 'WallHack', /if\(!tmpObj\['inView']\)continue;/, ``);
    script = patch(script, "Exports", /\['__CANCEL__']=!(\w+),(\w+)\['exports']=(\w+);},function\((\w+),(\w+),(\w+)\){let/, `['__CANCEL__']=!$1,$2['exports']=$3;},function($4,$5,$6){window.utilities=new Utilities();window.utilities.exports=$6;let`);
    script = patch(script, 'ProcInput', /this\['procInputs']=function\((\w+),(\w+),(\w+)\){/, `this['procInputs']=function($1,$2,$3){window.utilities.inputsTick(this,$1,$2);`);
    script = patch(script, 'ControlTick', /{if\(this\['target']\){(.+?)}},this\['(\w+)']=/, `{window.utilities.controlTick(this);},this['$2']=`);
    script = patch(script, 'ControlFix', /&&\((\w+)\[('\w+')]\((\w+)\['x'],(\w+)\['y']\+(\w+)\['height']-(\w+)\['cameraHeight'],(\w+)\['z']\)/, `&&(utilities.camLookAt($3['x'],$3['y']+$3['height']-$6['cameraHeight'],$3['z'])`);
    return script;
}

(async function () {
    const index = await read(document.location.href);
    const build = index.match(/(?<=build=)[^"]+/)[0];
    const patch = index.match(/"SOUND.play\(.+\)">v(.+)</)[1];
    const script = await read(`/js/game.${build}.js`);
    //window.stop();
    document.open();
    document.write(patchedIndex(index));
    document.close();
    try {
        eval(patchedScript(script));
    } catch (err) {
        location.reload();
    }
})();