// ==UserScript==
// @name         Krunker Hero Utilities Cheat ✔️Working on == UPDATE 1.6.3 ==
// @namespace    SkidLamer
// @version      1.1.6
// @description  A Krunker.io Cheat
// @author       SkidLamer
// @match        *://krunker.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/389792/Krunker%20Hero%20Utilities%20Cheat%20%E2%9C%94%EF%B8%8FWorking%20on%20%3D%3D%20UPDATE%20163%20%3D%3D.user.js
// @updateURL https://update.greasyfork.org/scripts/389792/Krunker%20Hero%20Utilities%20Cheat%20%E2%9C%94%EF%B8%8FWorking%20on%20%3D%3D%20UPDATE%20163%20%3D%3D.meta.js
// ==/UserScript==

const Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => {
    o[k] = v[i];
    return o
}, {}))
const feature = Struct('name', 'hotkey', 'value', 'valueStr', 'container', 'updated')
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
            targetCoolDown: 500,
            weaponIndex: 0,
            isSliding: false,
        };
        this.features = [];
        this.onLoad();
    }

    onLoad() {
        const initInfoBoxInterval = setInterval(() => {
            if (document.querySelector('#leaderDisplay') !== null) {
                clearInterval(initInfoBoxInterval);
                this.createInfoBox();
            }
        }, 100);
        this.features.push(feature('AutoAim', "1", -1, null, ['Off', 'Aim Assist', 'Aim Bot', 'Trigger Bot'], true));
        this.features.push(feature('AutoBhop', "2", -1, null, ['Off', 'Auto Jump', 'Auto SlideJump'], true));
        this.features.push(feature('AutoReload', "3", -1, null, [], true));
        this.features.push(feature('NoRecoil', "4", -1, null, [], true));
        this.features.push(feature('BurstShot', "5", -1, null, [], true));
        this.features.push(feature('ForceScope', "6", -1, null, [], true));
        this.features.push(feature('NoDeathDelay', "7", -1, null, [], true));
        this.features.push(feature('SuperGun', '8', -1, null, [], true));
        window.addEventListener("keydown", event => this.onKeyDown(event));
    }

    onTick() {
        this.features.forEach((feature, index, array) => {
            // On Updated State
            if (feature.updated) {
                feature.updated = false;
                if (feature.container.length !== 0) {
                    if (feature.value == -1) {
                        feature.value = parseInt(window.getSavedVal(`utilities_${feature.name}`) || 0);
                        console.log(`${feature.name} set from saved value ${feature.value}`);
                    }
                    else {
                        feature.value += 1;
                        if (feature.value > feature.container.length - 1)
                            feature.value = 0;
                    }
                    feature.valueStr = feature.container[feature.value];
                } else {
                    if (feature.value == -1) {
                        feature.value = parseInt(window.getSavedVal(`utilities_${feature.name}`) || 0);
                        console.log(`${feature.name} set from saved value ${feature.value}`);
                    }
                    else
                        feature.value ^= 1;
                    feature.valueStr = feature.value ? "true" : "false";
                }
                this.onUpdated(feature);
            }
            // OnTick State
            switch (feature.name) {
                case 'AutoAim':this.AutoAim(feature.value);break;
                case 'AutoReload':if (feature.value) {this.inputs[9] = this.self.ammos[this.self.weaponIndex] === 0}break;
                case 'NoRecoil':if (feature.value) {this.self.recoilTweenY = 0;this.self.recoilForce = 0}break;
                case 'SuperGun':
                    if (feature.value) {
            
                    }
                    break;
                case 'BurstShot':if (feature.value){this.self.weapon.shots = 100;}break;
                case 'AutoBhop': this.AutoBhop(feature.value);break;
                case 'NoDeathDelay':
                    if (feature.value && this.self && this.self.health === 0) {
                        this.server.deathDelay = 0;
                        //this.world.players.forcePos();
                        //this.world.players.resetAim();
                        //this.world.updateUI();
                    }
                    break;
            }
        });
    }

    onUpdated(feature) {
        switch (feature.name) {
            case 'ForceScope':
                feature.value || this.self.weapon.name === "Sniper Rifle" || this.self.weapon.name === "Semi Auto" ? this.self.weapon.scope = 1 : delete this.self.weapon.scope;
                break;
        }
        window.saveVal(`utilities_${feature.name}`, feature.value);
        this.updateInfoBox();
    }

    getName(str) {
        return str.replace(/([A-Z])/g, (match) => match).replace(/^./, (match) => match.toUpperCase());
    }

    createInfoBox() {
    const infoBox = document.createElement('div');
    infoBox.innerHTML = '<div> <style> #InfoBox { text-align: left; width: 310px; z-index: 3; padding: 10px; padding-left: 20px; padding-right: 20px; color: rgba(255, 255, 255, 0.7); line-height: 25px; margin-top: 20px; background-color: rgba(0, 0, 0, 0.2); } #InfoBox .utilitiesTitle { font-size: 18px; font-weight: bold; text-align: center; color: #fff; margin-top: 5px; margin-bottom: 5px; } #InfoBox .leaderItem { font-size: 14px; } </style> <div id="InfoBox"></div> </div>'.trim();
    const leaderDisplay = document.querySelector('#leaderDisplay');
    leaderDisplay.parentNode.insertBefore(infoBox.firstChild, leaderDisplay.nextSibling);
    }

    updateInfoBox() {
        const infoBox = document.querySelector('#InfoBox');
        if (infoBox === null) {
            return;
        }
        const lines = this.features.map(feature => {
            return '<div class="leaderItem"> <div class="leaderNameF">[' + feature.hotkey.toUpperCase() + ']' + this.getName(feature.name) + '</div> <div class="leaderScore">' + feature.valueStr + '</div> </div>';
        });
        infoBox.innerHTML = '<div class="utilitiesTitle">Krunker Hero</div>' + lines.join('').trim();
    }

    onKeyDown(event) {
        const key = event.key.toUpperCase();
        if (document.activeElement.tagName !== "INPUT") {
            if ('0' === key) {
                const menu = document.getElementById("InfoBox");
                if (menu) {
                    menu.style.display = !menu.style.display || menu.style.display === "inline-block" ? "none" : "inline-block";
                }
            }
            else if ('DELETE' === key) {
                this.resetSettings();
            }
            else {
                this.features.forEach((feature, index, array) => {
                    feature.updated = feature.hotkey.toUpperCase() === key;
                });
            }
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
                    this.self.health = 999999;
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
            if (value !== 1 && this.control.mouseDownR === 1)
                setTimeout(() => {
                if (!isLockedOn) this.control.mouseDownR = 0;
            }, this.settings.targetCoolDown);
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
        const enemies = this.world.players.list.filter(player => {return player.active && player.inView && !player.isYou && (!player.team || player.team !== this.self.team)}).sort((p1, p2) => this.getDistance(this.self, p1) - this.getDistance(this.self, p2));
        //const enemies = this.world.players.list.filter(x => !x.isYou).filter(x => x.inView && x.objInstances && x.objInstances.visible).filter(x => (!x.team || (x.team !== this.self.team))).filter(x => x.active).sort(this.functions.orderByDst);
        for (const cunt of enemies) {
            if (this.self.dmgReceived[cunt.id]) return cunt;
        }
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
    script = patch(script, 'ControlFix', /&&\((\w+)\[('\w+')]\((\w+)\['x'],(\w+)\['y']\+(\w+)\['height']-(\w+)\['cameraHeight'],(\w+)\['z']\)/, `&&(utilities.camLookAt($3['x'],$3['y']+$3['height']-$6['cameraHeight'],$3['z'])`);
    return script;
}

(async function () {
    const index = await read(document.location.href);
    const build = index.match(/(?<=build=)[^"]+/)[0];
    const patch = index.match(/"SOUND.play\(.+\)">v(.+)</)[1];
    const script = await read(`/js/game.${build}.js`);
    document.open();
    window.stop();
    document.innerHTML = null;
    document.write(patchedIndex(index));
    document.close();
    try {
        eval(patchedScript(script));
    } catch (err) {
        console.log(err);
        location.reload();
    }
})();