// ==UserScript==
// @name            SCANNER SCRIPT
// @description     Shows horwasp scan range
// @author          Jezzarimu / Sibuna (Usernames at Planets.Nu)
// @include         http://planets.nu/*
// @include         http://*.planets.nu/*
// @include         https://planets.nu/*
// @include         https://*.planets.nu/*
// @version         1.02
// @namespace https://greasyfork.org/users/859074
// @downloadURL https://update.greasyfork.org/scripts/440828/SCANNER%20SCRIPT.user.js
// @updateURL https://update.greasyfork.org/scripts/440828/SCANNER%20SCRIPT.meta.js
// ==/UserScript==

/*
    Initial release
    Please send Jezzarimu a message in planets.nu if you find any problems.

    Version History:
    1.02 - Exit bug fix
    1.01 - Updated to show enemy sight ranges for the ships or planets you can see
    1.00 - Initial Release
*/

function wrapper () {
    var scannerScript = {
        adjustedFunctions: false,
        horwaspBorderColorControl: "#00FFFF",
        horwaspBorderColorControlRobotRange: "#444444",
        horwaspEnemyBorderColorControl: "#FF0000",
        enemysight: "#FF00FF",
        wormhole: "#555555",

        //ScanDataImage: document.createElement('canvas')

        processload: function () {
            if (vgap.version >=4 && !SCANSCRIPTPlugin.adjustedOldFunctions) {
                vgapMap.prototype.SCANSCRIPTdrawShipScanRangeOld = vgapMap.prototype.drawShipScanRange
                vgapMap.prototype.drawShipScanRange = function (ctx) {
                    var objs = vgap.ships.concat(vgap.planets);
                    var scanners = [];
                    var scannerEnemy = [];
                    var HorwaspScanners = [];
                    var HorwaspEnemyShip = [];
                    for (var i = 0; i < objs.length; i++) {
                        var obj = objs[i];
                        if (obj?.beingBuilt) continue
                        if (vgap.shareIntel(obj.ownerid) || vgap.player.id === obj.ownerid) {
                            if (vgap.getPlayer(obj.ownerid).raceid == 12) {
                                HorwaspScanners.push(obj);
                            } else {
                                scanners.push(obj);
                            }
                        } else if (obj.ownerid != 0 && !vgap.alliedTo(obj.ownerid)) {
                            if (vgap.getPlayer(obj.ownerid).raceid == 12) {
                                HorwaspEnemyShip.push(obj);
                            } else {
                                scannerEnemy.push(obj)
                            }
                        }
                    }
                    for (let i = 0; i < HorwaspScanners.length; i++) {
                        let j = i + 1;
                        while (j < HorwaspScanners.length) {
                            if (HorwaspScanners[i].x === HorwaspScanners[j].x && HorwaspScanners[i].y === HorwaspScanners[j].y) {
                                HorwaspScanners.splice(j,1);
                            } else {
                                j++;
                            }
                        }
                    }
                    if (!this.scanmaskcanvas)
                        this.scanmaskcanvas = document.createElement("canvas");

                    this.scanmaskcanvas.width = this.canvas.width;
                    this.scanmaskcanvas.height = this.canvas.height;
                    let ctx2 = this.scanmaskcanvas.getContext("2d");
                    let w = this.canvas.width;
                    let h = this.canvas.height;


                    ctx2.clearRect(0, 0, w, h);
                    ctx2.fillStyle = "rgba(0, 0, 0, 0.49)";
                    ctx2.fillRect(0, 0, w, h);
                    ctx2.fillStyle = "#000";
                    ctx2.globalCompositeOperation = "destination-out";

                    let radius = vgap.settings.shipscanrange;
                    for (let i = 0; i < scanners.length; i++) {
                        let pt = scanners[i];
                        if (this.isVisible(pt.x, pt.y, radius)) {
                            ctx2.beginPath();
                            ctx2.arc(this.screenX(pt.x), this.screenY(pt.y), radius * this.zoom, 0, Math.PI * 2, false);
                            ctx2.closePath();
                            ctx2.fill();
                        }
                    }
                    radius = vgap.settings.shipscanrange*.5;
                    ctx2.globalCompositeOperation = "source-over";
                    ctx2.fillStyle = SCANSCRIPTPlugin.horwaspBorderColorControl;
                    for (let i = 0; i < HorwaspScanners.length; i++) {
                        let pt = HorwaspScanners[i];
                        if (this.isVisible(pt.x, pt.y, radius)) {
                            ctx2.beginPath();
                            ctx2.arc(this.screenX(pt.x), this.screenY(pt.y), radius * this.zoom, 0, Math.PI * 2, false);
                            ctx2.closePath();
                            ctx2.fill();
                        }
                    }
                    ctx2.globalCompositeOperation = "destination-out";
                    radius = vgap.settings.shipscanrange*.5-.3;
                    for (let i = 0; i < HorwaspScanners.length; i++) {
                        let pt = HorwaspScanners[i];
                        if (this.isVisible(pt.x, pt.y, radius)) {
                            ctx2.beginPath();
                            ctx2.arc(this.screenX(pt.x), this.screenY(pt.y), radius * this.zoom, 0, Math.PI * 2, false);
                            ctx2.closePath();
                            ctx2.fill();
                        }
                    }

                    if (vgap.players.find(p=>p.raceid == 9 && p.status != 3)) {
                        radius = vgap.settings.shipscanrange*.5*vgap.settings.horwaspscanrobotmodifier;
                        ctx2.globalCompositeOperation = "source-over";
                        ctx2.fillStyle = SCANSCRIPTPlugin.horwaspBorderColorControlRobotRange;
                        for (let i = 0; i < HorwaspScanners.length; i++) {
                            let pt = HorwaspScanners[i];
                            if (this.isVisible(pt.x, pt.y, radius)) {
                                ctx2.beginPath();
                                ctx2.arc(this.screenX(pt.x), this.screenY(pt.y), radius * this.zoom, 0, Math.PI * 2, false);
                                ctx2.closePath();
                                ctx2.fill();
                            }
                        }
                        ctx2.globalCompositeOperation = "destination-out";
                        radius = radius-0.3;
                        for (let i = 0; i < HorwaspScanners.length; i++) {
                            let pt = HorwaspScanners[i];
                            if (this.isVisible(pt.x, pt.y, radius)) {
                                ctx2.beginPath();
                                ctx2.arc(this.screenX(pt.x), this.screenY(pt.y), radius * this.zoom, 0, Math.PI * 2, false);
                                ctx2.closePath();
                                ctx2.fill();
                            }
                        }
                    }
                    
                    ctx.drawImage(ctx2.canvas, 0, 0);

                    let ctx3 = this.scanmaskcanvas.getContext("2d");
                    ctx3.globalCompositeOperation = "destination-out";
                    ctx3.clearRect(0, 0, w, h);
                    ctx3.fillStyle = "#000";
                    ctx3.fillRect(0, 0, w, h);

                    radius = vgap.settings.shipscanrange;
                    ctx3.globalCompositeOperation = "source-over";
                    ctx3.fillStyle = SCANSCRIPTPlugin.enemysight;
                    for (let i = 0; i < scannerEnemy.length; i++) {
                        let pt = scannerEnemy[i];
                        if (this.isVisible(pt.x, pt.y, radius)) {
                            ctx3.beginPath();
                            ctx3.arc(this.screenX(pt.x), this.screenY(pt.y), radius * this.zoom, 0, Math.PI * 2, false);
                            ctx3.closePath();
                            ctx3.fill();
                        }
                    }
                    ctx3.globalCompositeOperation = "destination-out";
                    radius = radius - 0.3;
                    for (let i = 0; i < scannerEnemy.length; i++) {
                        let pt = scannerEnemy[i];
                        if (this.isVisible(pt.x, pt.y, radius)) {
                            ctx3.beginPath();
                            ctx3.arc(this.screenX(pt.x), this.screenY(pt.y), radius * this.zoom, 0, Math.PI * 2, false);
                            ctx3.closePath();
                            ctx3.fill();
                        }
                    }
                    radius = vgap.settings.shipscanrange*.5;
                    ctx3.globalCompositeOperation = "source-over";
                    ctx3.fillStyle = SCANSCRIPTPlugin.horwaspEnemyBorderColorControl;
                    for (let i = 0; i < HorwaspEnemyShip.length; i++) {
                        let pt = HorwaspEnemyShip[i];
                        if (this.isVisible(pt.x, pt.y, radius)) {
                            ctx3.beginPath();
                            ctx3.arc(this.screenX(pt.x), this.screenY(pt.y), radius * this.zoom, 0, Math.PI * 2, false);
                            ctx3.closePath();
                            ctx3.fill();
                        }
                    }
                    ctx3.globalCompositeOperation = "destination-out";
                    radius = vgap.settings.shipscanrange*.5-.3;
                    for (let i = 0; i < HorwaspEnemyShip.length; i++) {
                        let pt = HorwaspEnemyShip[i];
                        if (this.isVisible(pt.x, pt.y, radius)) {
                            ctx3.beginPath();
                            ctx3.arc(this.screenX(pt.x), this.screenY(pt.y), radius * this.zoom, 0, Math.PI * 2, false);
                            ctx3.closePath();
                            ctx3.fill();
                        }
                    }
                    ctx.drawImage(ctx3.canvas, 0, 0);


                    if (vgap.settings.maxwormholes > 0) {
                        let ctx4 = this.scanmaskcanvas.getContext("2d");
                        ctx4.globalCompositeOperation = "destination-out";
                        ctx4.clearRect(0, 0, w, h);
                        ctx4.fillStyle = "#000";
                        ctx4.fillRect(0, 0, w, h);

                        radius = vgap.settings.wormholescanrange;
                        ctx4.globalCompositeOperation = "source-over";
                        ctx4.setLineDash([5, 5]);
                        ctx4.fillStyle = SCANSCRIPTPlugin.wormhole;
                        ctx4.strokeStyle = SCANSCRIPTPlugin.wormhole;

                        let array = vgap.myships.filter(ship=> ship.mission == 4)
                        for (let i = 0; i < array.length; i++) {
                            let pt = array[i];
                            if (this.isVisible(pt.x, pt.y, radius)) {
                                ctx4.beginPath();
                                ctx4.arc(this.screenX(pt.x), this.screenY(pt.y), radius * this.zoom, 0, Math.PI * 2, false);
                                ctx4.closePath();
                                ctx4.stroke();
                            }
                        }
                        ctx4.globalCompositeOperation = "destination-out";
                        radius = radius - 0.3;
                        for (let i = 0; i < array.length; i++) {
                            let pt = array[i];
                            if (this.isVisible(pt.x, pt.y, radius)) {
                                ctx4.beginPath();
                                ctx4.arc(this.screenX(pt.x), this.screenY(pt.y), radius * this.zoom, 0, Math.PI * 2, false);
                                ctx4.closePath();
                                ctx4.fill();
                            }
                        }
                        ctx.drawImage(ctx4.canvas, 0, 0);
                    }
                }
                vgaPlanets.prototype.SCANSCRIPTcontinueExitingOld = vgaPlanets.prototype.continueExiting;
                vgaPlanets.prototype.continueExiting = function () {
                    if (vgap.version >=4) {
                        vgapMap.prototype.drawShipScanRange = vgapMap.prototype.SCANSCRIPTdrawShipScanRangeOld;
                    }
                    vgaPlanets.prototype.continueExiting = vgaPlanets.prototype.SCANSCRIPTcontinueExitingOld;
                    SCANSCRIPTPlugin.adjustedFunctions = false;
                    vgap.SCANSCRIPTcontinueExitingOld();
                }
                SCANSCRIPTPlugin.adjustedFunctions = true;
            }
        }
    }
    vgap.registerPlugin(scannerScript, "SCANSCRIPTPlugin");
    this.SCANSCRIPTPlugin = vgap.plugins.SCANSCRIPTPlugin;
}

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);