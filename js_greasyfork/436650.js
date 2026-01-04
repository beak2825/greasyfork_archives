// ==UserScript==
// @name         Surviv.io - Nice aimbot
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @icon         https://i0.wp.com/cdne.c3dt.com/icon/2341510-com.bvtvideo.shotkampro.jpg
// @description  Change the aim in the game with a click!
// @author       VNBPM
// @license MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436650/Survivio%20-%20Nice%20aimbot.user.js
// @updateURL https://update.greasyfork.org/scripts/436650/Survivio%20-%20Nice%20aimbot.meta.js
// ==/UserScript==
 
(function() {
var Plugin = class {
    constructor() {
        this._enabled = true
        this.name = "aimbot"
        this.UI = {
            name: "Aim Bot 2.0",
            description: "Aims for you",
        }
        this._options = [
            {
                value: "autoaim",
                opts: ["autoaim", "on shoot", "inverted aim"],
                name: "type",
                UI: {
                    name: "Type",
                },
            },
            {
                value: true,
                name: "col",
                UI: {
                    name: "Use Collisions",
                },
            },
            {
                value: true,
                name: "mouse",
                UI: {
                    name: "Aim with Mouse",
                },
            },
            {
                value: false,
                name: "attack",
                UI: {
                    name: "AutoAttack™",
                },
            },
            {
                value: false,
                name: "shoot",
                UI: {
                    name: "AutoShoot™",
                },
            },
            {
                value: true,
                name: "down",
                UI: {
                    name: "Aim at Downed",
                },
            },
            {
                value: false,
                name: "object",
                UI: {
                    name: "Aim at Objects",
                },
            },
            {
                value: false,
                name: "move",
                UI: {
                    name: "MobileMovement™",
                },
            },
            {
                value: false,
                name: "legit",
                UI: {
                    name: "LegitMode™",
                },
            },
            {
                value: 0.2,
                int: 0.1,
                name: "level",
                UI: {
                    name: "Prediction Level",
                },
                min: 0,
                max: 1,
            },
            {
                value: 0,
                int: 1,
                name: "fov",
                UI: {
                    name: "Aim FOV (0 = off)",
                },
                min: 0,
                max: 180,
            },
        ]
        this.lastAim = {
            x: 0,
            y: 0,
        }
        this.date = Date.now()
    }

    option(o) {
        let op
        try {
            op = this._options.filter(k => k.name === o)[0].value
        } catch (e) {
            op = false
        }
        return op
    }

    setOption(o, v) {
        try {
            this._options.filter(k => k.name === o)[0].value = v
        } catch (e) {}
    }

    get enabled() {
        return this._enabled
    }

    set enabled(t) {
        this._enabled = t
    }

    loop(dataAccessor, player, input, data, plugins) {
        var e = data
            .getEnemies(this.option("object"))
            .sort((a, b) => {
                var camera = dataAccessor.Camera();
                if(this.option("mouse")) {
                    let posA = camera.pointToScreen(a.pos);
                    let posB = camera.pointToScreen(b.pos);
                    let distA = this.calcDistance(
                        posA.x,
                        posA.y,
                        input.mouse.x,
                        input.mouse.y
                    );
                    let distB = this.calcDistance(
                        posB.x,
                        posB.y,
                        input.mouse.x,
                        input.mouse.y
                    );
                    return distA - distB;
                }
                var playerPos = dataAccessor.GetPlayerPosition(player);
                let p = dataAccessor.Camera().pointToScreen(playerPos);
                let enp1 = camera.pointToScreen(a.pos)
                let enp2 = camera.pointToScreen(b.pos)
                let ena1 = this.calcDistance(p.x, p.y, enp1.x, enp1.y)
                let ena2 = this.calcDistance(p.x, p.y, enp2.x, enp2.y)
                return Math.abs(ena1) - Math.abs(ena2);
            })
            .filter(enemy => {
                return (
                    dataAccessor.GetPlayerLayer(enemy) === dataAccessor.GetPlayerLayer(player) &&
                    (this.option("col")
                        ? enemy.__type == 2
                            ? true
                            : data.cantCollide(enemy)
                        : true) &&
                    (this.option("fov") > 0
                        ? (() => {
                            var camera = dataAccessor.Camera();
                            var playerPos = dataAccessor.GetPlayerPosition(player);
                            var enemyPos = dataAccessor.GetPlayerPosition(enemy);
                            let lp = camera.pointToScreen(playerPos);
                            let le = camera.pointToScreen(enemyPos);
                            let mouseVec = {
                                x: input.mouse.x - lp.x,
                                y: input.mouse.y - lp.y,
                            };
                            let enemyDir = {
                                x: le.x - lp.x,
                                y: le.y - lp.y,
                            };
                            let angleDif = Math.abs(
                                Math.atan2(enemyDir.y, enemyDir.x) -
                                    Math.atan2(mouseVec.y, mouseVec.x)
                            );
                            return (
                                angleDif <
                                this.option("fov") * (Math.PI / 180)
                            );
                          })()
                        : true) &&
                    (this.option("down")
                        ? true
                        : dataAccessor.GetPlayerNetData(enemy)
                        ? !dataAccessor.IsPlayerDowned(enemy)
                        : true)
                )
            });
        data.selectedEnemy = e;
        this.aim = false;
        // Mobile Movement
        if(this.option("move")) {
            input.moveAngle =
                this.calcAngle(
                    {
                        x: input.mouse.x - window.innerWidth / 2,
                        y: window.innerHeight / 2 - input.mouse.y,
                    },
                    {
                        x: 0,
                        y: 0,
                    }
                ) + Math.PI;
        }
        if(e.length > 0) {
            if(this.option("type") == "autoaim"
                    ? !plugins.binds.test("aimbot")
                    : this.option("type") == "on shoot"
                    ? input.leftMouse
                    : this.option("type") == "inverted aim"
                    ? plugins.binds.test("aimbot")
                    : false) 
            {
                this.aim = true
                var v = data.cantCollide(e[0]);
                var pos = this.posCalc(e[0], player, dataAccessor, data);
                if(!pos) {
                    return;
                }
                this.lastAim.x = this.option("legit")
                    ? this.lerp(this.lastAim.x, pos.x, 0.8)
                    : pos.x;
                this.lastAim.y = this.option("legit")
                    ? this.lerp(this.lastAim.y, pos.y, 0.8)
                    : pos.y;
                input.aim(this.lastAim);
                // Auto Attack
                var eRad = e[0].rad
                    ? e[0].rad
                    : e[0].collider
                    ? e[0].collider.rad || 4
                    : 4;
                var weapType = dataAccessor.GetPlayerWeaponType(player);
                var wRad =
                    (data.melee[weapType]
                        ? data.melee[weapType].attack
                              .rad || 1
                        : 1) * 2;
                data.autoAttack = false
                // flancast90: make var d global for accessing player pos outside of loop

                var d = this.calcDistance(
                        dataAccessor.GetPlayerPosition(e[0]).x,
                        dataAccessor.GetPlayerPosition(e[0]).y,
                        dataAccessor.GetPlayerPosition(player).x,
                        dataAccessor.GetPlayerPosition(player).y
                    );
                if(this.option("attack")) {
                    if(d <= 8) {
                        data.autoAttack = true;
                        input.moveAngle =
                            this.calcAngle(dataAccessor.GetPlayerPosition(e[0]), dataAccessor.GetPlayerPosition(player)) + Math.PI;
                        if(d < eRad + wRad) {
                            input.addInput("EquipMelee")
                            input.addInput("Fire")
                        }
                    }
                }
                // Auto Shoot
                let weapIdx = dataAccessor.GetPlayerWeapIdx(player);
                let weapons = dataAccessor.GetPlayerWeapons(player);

                // flancast90: fix melee bug which wouldn't allow hit
                if (this.option("shoot") && v && (d > 8)) {
                    var weap_otherIdx;
                    var other_weapType;
                    var other_weapExists = false;

                    // get index of other weapon for auto-switch
                    if (weapIdx == 0) {
                        weap_otherIdx = 1;
                        other_weapType = "Secondary";
                    }else{
                        weap_otherIdx = 0;
                        other_weapType = "Primary";
                    }
                    
                    if (weapons[weap_otherIdx].type.length > 0) {
                        other_weapExists = true;
                    }

                    // check if player ammo clip is empty
                    if (weapons[weapIdx].ammo > 0) {
                        input.addInput("Fire")
                    } else {
                        // if so, and the player has another gun, switch to that gun to prevent reload in the middle of battle
                        if ((other_weapExists == true) && (weapons[weap_otherIdx].ammo > 0)) {
                            input.addInput("Equip"+other_weapType);
                            input.addInput("Fire");
                        }else {
                           // break;
                        }
                    }
            

                }
            }
        }
        if(e.length < 1 || !this.aim) {
            this.lastAim.x = this.option("legit")
                ? this.lerp(this.lastAim.x, input.mouse.x, 0.2)
                : input.mouse.x;
            this.lastAim.y = this.option("legit")
                ? this.lerp(this.lastAim.y, input.mouse.y, 0.2)
                : input.mouse.y;
            input.aim(this.lastAim);
        }
        e = null;
        this.date = Date.now();
    }

    /**
     * Math
     */

    lerp(x, x2, i) {
        return x * (1.0 - i) + x2 * i;
    }

    calcAngle(c, e) {
        let dy = e.y - c.y;
        let dx = e.x - c.x;
        let theta = Math.atan2(dy, dx);
        return theta;
    }

    calcDistance(cx, cy, ex, ey) {
        return Math.sqrt(Math.pow(cx - ex, 2) + Math.pow(cy - ey, 2));
    }

    findWeap(me, game, dataAccessor) {
        var weapType = dataAccessor.GetPlayerWeaponType(me);
        return weapType && game.guns[weapType] ? game.guns[weapType] : false;
    }

    findBullet(curWeapon, game) {
        return !!curWeapon ? game.bullets[curWeapon.bulletType] : false;
    }

    posCalc(enemy, curPlayer, dataAccessor, data) {
        if(!enemy) {
            return;
        }
        if(!enemy.posOld || !enemy.posOldOld || !curPlayer.posOldOld) {
            return dataAccessor.Camera().pointToScreen({
                x: dataAccessor.GetPlayerPosition(enemy).x,
                y: dataAccessor.GetPlayerPosition(enemy).y,
            });
        }
        let curWeap = this.findWeap(curPlayer, data, dataAccessor);
        let curBullet = this.findBullet(curWeap, data);
        let FPS = (Date.now() - this.date) * 1.6;
        let bulletSpeed = curBullet ? curBullet.speed / FPS : 1000;
        var enemyPos = dataAccessor.GetPlayerPosition(enemy);
        var playerPos = dataAccessor.GetPlayerPosition(curPlayer);
        var distance = this.calcDistance(
            enemyPos.x,
            enemyPos.y,
            playerPos.x,
            playerPos.y
        );
        var userX = playerPos.x;
        var userY = playerPos.y;
        var enemyDirX = enemyPos.x - enemy.posOldOld.x;
        var enemyDirY = enemyPos.y - enemy.posOldOld.y;
        var diffX = enemyPos.x - userX;
        var diffY = enemyPos.y - userY;
        var a =
            enemyDirX * enemyDirX +
            enemyDirY * enemyDirY -
            bulletSpeed * bulletSpeed;
        var b = diffX * enemyDirX + diffY * enemyDirY;
        var c = diffX * diffX + diffY * diffY;
        var d = b * b - a * c;
        if(d < 0) {
            return;
        }
        d = Math.sqrt(d);
        var t = -(b + d) / a;
        var bulletAngle = Math.atan2(
            diffY + enemyDirY + enemyDirY * t,
            diffX + enemyDirX + enemyDirX * t
        );
        var pos = {
            x: playerPos.x + Math.cos(bulletAngle) * distance * this.option("level"),
            y: playerPos.y + Math.sin(bulletAngle) * distance * this.option("level"),
        };
        return dataAccessor.Camera().pointToScreen(pos);
    }
}

module.exports = new Plugin()
})();