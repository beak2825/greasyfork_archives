
// ==UserScript==
// @name         surrviv.io Hack
// @description  surviv.io Hack
// @version      1.0.0
// @match       *://surviv.io/*
// @author       IceHacks
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @namespace https://greasyfork.org/users/703117
// @downloadURL https://update.greasyfork.org/scripts/437748/surrvivio%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/437748/surrvivio%20Hack.meta.js
// ==/UserScript==

class Hack {
        constructor() {
        this._enabled = true
        this.name = "esp"
        this.UI = {
            name: "ESP",
            description: "Shows where players are at",
        }
        this._options = [
            {
                value: true,
                name: "laser",
                UI: {
                    name: "Flashlight",
                },
            },
            {
                value: true,
                name: "nade",
                UI: {
                    name: "Blast Radius",
                },
            },
            {
                value: 2,
                name: "width",
                UI: {
                    name: "Tracer Width",
                },
            }
        ]
        this.values = {
            pixi: null,
        }
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

    get enabled() {
        return this._enabled
    }

    set enabled(t) {
        this._enabled = t
    }

    names(player) {
        if (!player) return
        if (
            !player.nameText._text ||
            player.nameText._text == "" ||
            player.nameText._text.length < 1
        )
            return

        player.nameText.tint = 0xff0000

        player.nameText.visible = true
    }

    draw(enemies, activePlayer, data, dataAccessor) {
        if(!enemies || !activePlayer)  {
            return;
        }
        let points = enemies.map(enemy => {
            return {
                x: (dataAccessor.GetPlayerPosition(enemy).x - dataAccessor.GetPlayerPosition(activePlayer).x) * 16,
                y: (dataAccessor.GetPlayerPosition(activePlayer).y - dataAccessor.GetPlayerPosition(enemy).y) * 16,
                img: enemy.img || false,
                type: enemy.__type,
                id: enemy.__id,
                layer: dataAccessor.GetPlayerLayer(enemy),
            }
        });
        let pixi = this.values.pixi
        if(!pixi) {
            pixi = new window.PIXI.Graphics();
            this.values.pixi = pixi;
            activePlayer.container.addChild(pixi);
            activePlayer.container.setChildIndex(pixi, 0);
        }
        if(!pixi.graphicsData) {
            return;
        }
        pixi.clear();
        points.forEach(point => {
            if(point.type == 2 && point.layer !== dataAccessor.GetPlayerLayer(activePlayer)) {
                return;
            }
            pixi.lineStyle(this.option("width"), 0xff0000, 0.5);
            if(point.layer !== dataAccessor.GetPlayerLayer(activePlayer)) {
                pixi.lineStyle(this.option("width"), 0xffffff, 0.5);
            }
            if(point.type == 2) {
                pixi.lineStyle(this.option("width"), 0xffff00, 0.5);
            }
            pixi.moveTo(0, 0);
            pixi.lineTo(point.x, point.y);
        });
        if(data.aimPred) {
            pixi.lineStyle(2, 0xffffff, 0.5);
            pixi.moveTo(0, 0);
            pixi.lineTo(
                (data.aimPred.x - dataAccessor.GetPlayerPosition(activePlayer).x) * 16,
                (dataAccessor.GetPlayerPosition(activePlayer).y - data.aimPred.y) * 16
            )
        }
        enemies.forEach(n => {
            if(n.__type == 1) { 
                this.names(n); 
            }
        });
        pixi.lineStyle(0);
        if(this.option("nade")) {
            data.getObjects()
                .filter(obj => {
                    if(obj.__type === data.data.Type.Projectile ||
                        (obj.img &&
                            obj.img.match(/barrel-/g) &&
                            obj.smokeEmitter &&
                            data.items[obj.type].explosion)) 
                    {
                        return true;
                    }
                    return false;
                })
                .forEach(obj => {
                    //If the object is inside a bunker and you're not etc, make the blast radius white
                    if(obj.layer !== dataAccessor.GetPlayerLayer(activePlayer)) {
                        pixi.beginFill(0xffffff, 0.3);
                    } else {
                        pixi.beginFill(0xff0000, 0.2) ;
                    }
                    pixi.drawCircle(
                        (obj.pos.x - dataAccessor.GetPlayerPosition(activePlayer).x) * 16,
                        (dataAccessor.GetPlayerPosition(activePlayer).y - obj.pos.y) * 16,
                        (data.explosions[
                            data.items[obj.type].explosionType ||
                            data.items[obj.type].explosion
                                ].rad.max +
                            1) *
                        16
                    )
                });
        }
        points = null;
    }

    end() {
        this.values.pixi = null;
        this.laser = null;
    }

    findWeap(player, game, dataAccessor) {
        var weap = dataAccessor.GetPlayerWeaponType(player);
        return weap && game.guns[weap] ? game.guns[weap] : false;
    }

    findBullet(curWeapon, game) {
        return !!curWeapon ? game.bullets[curWeapon.bulletType] : false;
    }

    laserPointer(
        curBullet,
        curWeapon,
        curPlayer,
        acPlayer,
        color,
        opac,
        dataAccessor
    ) {
        if(!curPlayer || !curPlayer.container) {
            return;
        }

        this.laser = this.laser || {};

        var laser = this.laser;
        var lasic = {};

        let isMoving =
            curPlayer.posOldOld &&
            (dataAccessor.GetPlayerPosition(curPlayer).x != curPlayer.posOldOld.x ||
            dataAccessor.GetPlayerPosition(curPlayer).y != curPlayer.posOldOld.y);

        if(curBullet) {
            lasic.active = true;
            lasic.range = curBullet.distance * 16.25;
            lasic.direction =
                Math.atan2(
                    dataAccessor.GetPlayerDirection(curPlayer).x,
                    dataAccessor.GetPlayerDirection(curPlayer).y
                ) -
                Math.PI / 2;
            lasic.angle =
                ((curWeapon.shotSpread +
                    (isMoving ? curWeapon.moveSpread : 0)) *
                    0.01745329252) /
                2;
        } else {
            lasic.active = false;
        }
        var draw = laser.draw;
        if(!draw) {
            draw = new window.PIXI.Graphics();
            laser.draw = draw;
            curPlayer.container.addChildAt(draw, 0);
        }
        if(!draw.graphicsData) {
            return;
        }
        if(!lasic.active) {
            return;
        }
        var curPlayerPos = dataAccessor.GetPlayerPosition(curPlayer);
        var acPlayerPos = dataAccessor.GetPlayerPosition(acPlayer);
        var center = {
            x: (curPlayerPos.x - acPlayerPos.x) * 16,
            y: (acPlayerPos.y - curPlayerPos.y) * 16,
        };
        var radius = lasic.range;
        var angleFrom = lasic.direction - lasic.angle;
        var angleTo = lasic.direction + lasic.angle;
        angleFrom =
            angleFrom > Math.PI * 2
                ? angleFrom - Math.PI * 2
                : angleFrom < 0
                ? angleFrom + Math.PI * 2
                : angleFrom;
        angleTo =
            angleTo > Math.PI * 2
                ? angleTo - Math.PI * 2
                : angleTo < 0
                ? angleTo + Math.PI * 2
                : angleTo;
        draw.beginFill(color || 0x0000ff, opac || 0.3);
        draw.moveTo(center.x, center.y);
        draw.arc(center.x, center.y, radius, angleFrom, angleTo);
        draw.lineTo(center.x, center.y);
        draw.endFill();
    }

    loop(dataAccessor, player, input, data, plugins) {
        var enemies = data
            .getEnemies(
                plugins["aimbot"] ? plugins["aimbot"].option("object") : false
            )
            .filter(p =>
                p && dataAccessor.GetPlayerNetData(p)
                    ? plugins["aimbot"] && plugins["aimbot"].option("down")
                    ? true
                    : !dataAccessor.IsPlayerDowned(p)
                    : true
            );
        this.draw(enemies, player, data, dataAccessor);
        var curWeapon = this.findWeap(player, data, dataAccessor);
        var curBullet = this.findBullet(curWeapon, data);
        if(this.laser && this.laser.draw) {
            this.laser.draw.clear();
        }
        if(!this.option("laser")) {
            return;
        }
        this.laserPointer(
            curBullet,
            curWeapon,
            player,
            player,
            undefined,
            undefined,
            dataAccessor
        );
        enemies
            .filter(n => n.__type == 1)
            .forEach(enemy => {
                var eW = this.findWeap(enemy, data, dataAccessor)
                this.laserPointer(
                    this.findBullet(eW, data),
                    eW,
                    enemy,
                    player,
                    "0",
                    0.2,
                    dataAccessor
                )
            });
        enemies = null;
    }
}