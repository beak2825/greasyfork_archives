// ==UserScript==
// @name         Krunker Cheat|new 2019
// @namespace    Az90_
// @version      1.1.5
// @description  A Krunker.io Cheat
// @author       Az90_
// @match        *://krunker.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/433214/Krunker%20Cheat%7Cnew%202019.user.js
// @updateURL https://update.greasyfork.org/scripts/433214/Krunker%20Cheat%7Cnew%202019.meta.js
// ==/UserScript==

const Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => {
    o[k] = v[i];
    return o
}, {}))
const feature = Struct('name', 'hotkey', 'value', 'valueStr', 'container')
class Utilities {
    constructor() {
        this.inputs;
        this.exports;
        this.control;
        this.functions
        this.self;
        this.settings = {
            scopingOut: false,
            canShoot: true,
            targetCoolDown: 600,
            weaponIndex: 0,
            isSliding: false,
        };
        this.features = [];
        this.onLoad();
    }

    onLoad() {
        this.newFeature('AutoAim', "1", ['Off', 'Aim Assist', 'Aim Bot', 'Trigger Bot']);
        this.newFeature('AutoBhop', "2", ['Off', 'Auto Jump', 'Auto SlideJump']);
        this.newFeature('AutoReload', "3", []);
        this.newFeature('NoRecoil', "4", []);
        this.newFeature('BurstShot', "5", []);
        this.newFeature('ForceScope', "6", []);
        this.newFeature('NoDeathDelay', "7", []);
        this.newFeature('SuperGun', '8', []);
        window.addEventListener("keydown", event => this.onKeyDown(event));
        const interval = setInterval(() => {
            if (document.querySelector('#leaderDisplay') !== null) {
                clearInterval(interval);
                this.createInfoBox();
            }
        }, 100);
    }

    onTick() {
        for (var i = 0, sz = this.features.length; i < sz; i++) {
            const feature = this.features[i];
            if (feature.value) {
                switch (feature.name) {
                    case 'AutoAim':
                        this.AutoAim(feature.value);
                        break;
                    case 'AutoReload':
                        this.inputs[9] = (this.self.ammos[this.self.weaponIndex] === 0);
                        break;
                    case 'NoRecoil':
                        this.self.recoilTweenY = this.self.recoilForce = 0;
                        break;
                    case 'SuperGun':
                        this.settings.weaponIndex += this.control.mouseDownL == 1;
                        if (this.settings.weaponIndex > this.world.weapons.length - 3) this.settings.weaponIndex = 0;
                        this.self.weapon = this.world.weapons[this.settings.weaponIndex];
                        break;
                    case 'BurstShot':
                        this.self.weapon.shots = this.self.weapon.ammo;
                        break;
                    case 'AutoBhop':
                        this.AutoBhop(feature.value);
                        break;
                    case 'NoDeathDelay':
                        if (this.self && this.self.health === 0) {
                            this.server.deathDelay = 0;
                            this.world.players.forcePos();
                            this.world.players.resetAim();
                            //this.world.updateUI();
                        }
                        break;
                }
            }
        }
    }

    onUpdated(feature) {
        if (feature.container.length) {
            feature.value += 1;
            if (feature.value > feature.container.length - 1) {
                feature.value = 0;
            }
            feature.valueStr = feature.container[feature.value];
        }
        else
        {
            feature.value ^= 1;
            feature.valueStr = feature.value ? "true" : "false";
        }
        switch (feature.name) {
            case 'ForceScope':
                feature.value || this.self.weapon.name === "Sniper Rifle" || this.self.weapon.name === "Semi Auto" ? this.self.weapon.scope = 1 : delete this.self.weapon.scope;
                break;
        }
        window.saveVal(`utilities_${feature.name}`, feature.value);
        this.updateInfoBox();
    }

    newFeature(name, key, array) {
        const feature = Struct('name', 'hotkey', 'value', 'valueStr', 'container')
        const value = parseInt(window.getSavedVal(`utilities_${name}`) || 0);
        this.features.push(feature(name, key, value, array.length ? array[value] : value ? "true" : "false", array));
    }

    createInfoBox() {
        const leaderDisplay = document.querySelector('#leaderDisplay');
        if (leaderDisplay) {
            const infoBox = document.createElement('div');
            infoBox.innerHTML = '<div> <style> #InfoBox { text-align: left; width: 310px; z-index: 3; padding: 10px; padding-left: 20px; padding-right: 20px; color: rgba(255, 255, 255, 0.7); line-height: 25px; margin-top: 0px; background-color: rgba(0, 0, 0, 0.3); } #InfoBox .utilitiesTitle { font-size: 16px; font-weight: bold; text-align: center; color: #1A72B8; margin-top: 5px; margin-bottom: 5px; } #InfoBox .leaderItem { font-size: 14px; } </style> <div id="InfoBox"></div> </div>'.trim();
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
            infoBox.innerHTML = '<div class="utilitiesTitle">Krunker Hero</div>' + lines.join('').trim();
        }
    }

    onKeyDown(event) {
        if (document.activeElement.tagName === "INPUT") return;
        const key = event.key.toUpperCase();
        switch (key) {
            case '0': {
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

    AutoAim(value) {
        let isLockedOn = false;
        const target = this.getTarget();
        if (target) {
            switch (value) {
                case 1:
                /*Aim Assist*/
                if (this.control.mouseDownR === 1) {
                    this.lookAtHead(target);
                    isLockedOn = true;
                }
                break;
                case 2:
                /*Aim Bot*/
                if (!this.self.aimVal < 0.2) {
                    this.lookAtHead(target);
                    if (this.control.mouseDownR === 0) {
                        this.control.mouseDownR = 1;
                    }
                    isLockedOn = true;
                }
                break;
                case 3:
                /*Trigger Bot*/
                if (this.self.didShoot) {
                    this.settings.canShoot = this.getDistance(this.self, target) <= this.self.weapon.range;
                    setTimeout(() => {
                        this.settings.canShoot = true;
                        this.self.aimVal = 1;
                    }, this.self.weapon.rate);
                }
                if (this.control.mouseDownL === 1) {
                    this.control.mouseDownL = 0;
                    this.control.mouseDownR = 0;
                    this.settings.scopingOut = true;
                }
                if (this.self.aimVal === 1) {
                    this.settings.scopingOut = false;
                }
                if (this.settings.scopingOut || !this.settings.canShoot || this.self.recoilForce > 0.01) {
                    isLockedOn = false;
                }
                this.lookAtHead(target);
                if (this.control.mouseDownR === 0) {
                    this.control.mouseDownR = 1;
                } else if (this.self.aimVal < 0.2) {
                    this.control.mouseDownL = 1 - this.control.mouseDownL;
                }
                isLockedOn = true;
                break;
            }
        }
        if (!isLockedOn) {
            this.control.target = null;
            if (value !== 1 && this.control.mouseDownR === 1) {
                setTimeout(() => {
                    if (!isLockedOn) this.control.mouseDownR = 0;
                }, this.settings.targetCoolDown);
            }
        }
    }

    AutoBhop(value) {
        if (value) {
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

    resetSettings() {
        if (confirm("Are you sure you want to reset all your hero settings? This will also refresh the page")) {
            Object.keys(window.localStorage).filter(x=>x.includes("utilities_")).forEach(x => window.localStorage.removeItem(x));
            location.reload();
        }
    }

    getTarget() {
        const enemies = this.world.players.list.filter(x => {return !x.isYou && (!x.team || x.team !== this.self.team) && x.active && x.inView || this.self.dmgReceived[x.id]}).sort((p1, p2) => this.getDistance(this.self, p1) - this.getDistance(this.self, p2));
        return enemies[0];
    }

    lookAtHead(target) {
        this.camLookAt(target.x2, target.y2 + target.height - 1.5 - 2.5 * target.crouchVal - this.self.recoilAnimY * 0.3 * this.getDistance(this.self, target) / 10, target.z2);
    }

    inputsTick(self, inputs, world) {
        //Hooked
        if (this.control && this.exports && self && inputs && world) {
            this.inputs = inputs;
            this.world = world;
            this.self = self;
            this.server = this.exports.c[7].exports;
            this.functions = this.exports.c[8].exports;
            this.onTick();
        }
    }

    controlTick(control) {
        //Hooked
        if (control) {
            this.control = control;
            const half = Math.PI / 2;
            if (control.target) {
                control.object.rotation.y = control.target.yD;
                control.pitchObject.rotation.x = control.target.xD;
                control.pitchObject.rotation.x = Math.max(-half, Math.min(half, control.pitchObject.rotation.x));
                control.yDr = control.pitchObject.rotation.x % Math.PI;
                control.xDr = control.object.rotation.y % Math.PI;
            }
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
    script = patch(script, "IsHacker", /&&(\w+)\['isHacker']&&/, `&&!1&&`);
    script = patch(script, "LastHack", /&&(\w+)\['lastHack']&&/, `&&!1&&`);
    script = patch(script, 'WallHack', /if\(!tmpObj\['inView']\)continue;/, ``);
    script = patch(script, "Exports", /\['__CANCEL__']=!(\w+),(\w+)\['exports']=(\w+);},function\((\w+),(\w+),(\w+)\){let/, `['__CANCEL__']=!$1,$2['exports']=$3;},function($4,$5,$6){window.utilities=new Utilities();window.utilities.exports=$6;let`);
    script = patch(script, 'ProcInput', /this\['procInputs']=function\((\w+),(\w+),(\w+)\){/, `this['procInputs']=function($1,$2,$3){window.utilities.inputsTick(this,$1,$2);`);
    script = patch(script, 'ControlTick', /{if\(this\['target']\){(.+?)}},this\['(\w+)']=/, `{window.utilities.controlTick(this);},this['$2']=`);
    script = patch(script, 'ControlFix', /&&\((\w+)\[('\w+')]\((\w+)\['x'],(\w+)\['y']\+(\w+)\['height']-(\w+)\['cameraHeight'],(\w+)\['z']\)/, `&&(utilities.camLookAt($3.x,$3.y+$3.height-$6.cameraHeight,$3.z)`);
    return script;
}

(async function () {
    const index = await read(document.location.href);
    const build = index.match(/(?<=build=)[^"]+/)[0];
    const patch = index.match(/"SOUND.play\(.+\)">v(.+)</)[1];
    const script = await read(`/js/game.${build}.js`);
    console.log('Loading Krunker Hero ...');
    document.open();
    window.stop();
    document.innerHTML = null;
    document.write(patchedIndex(index));
    document.close();
    try {
        eval(patchedScript(script));
    } catch (err) {
        location.reload();
    }
    console.log('Successfully loaded Krunker Hero!');
})();