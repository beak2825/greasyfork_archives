// ==UserScript==
// @name        Pods fix
// @author      Frankie Garcia
// @license     Lesser Gnu Public License, version 3
// @homepage    https://greasyfork.org/es/users/473836-karkass
// @description For planets.nu -- Some experimental and fixes
// @match       http://planets.nu/*
// @match       https://planets.nu/*
// @match       http://*.planets.nu/*
// @match       https://*.planets.nu/*
// @namespace   https://larision.sytes.net
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/463180/Pods%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/463180/Pods%20fix.meta.js
// ==/UserScript==

/*
    Changelog:
    0.1     First Release
            Show real waypoints of accelerated pods
    */

var name = "Pods fix";
var version = "0.1";

// shorterDistOKForHyp intended for use during replay, when shorter distance is OK for the waypoint
vgaPlanets.prototype.loadWaypoints = function (shorterDistOKForHyp) {
    var sets = vgap.accountsettings;

    this.waypoints = new Array();
    for (var i = 0; i < vgap.ships.length; i++) {
        //waypoint
        var ship = vgap.ships[i];
        if (ship.ownerid != vgap.player.id && !ship.fullinfo && !vgap.editmode) {
            if (ship.heading != -1 && ship.warp != 0) {

                var relation = vgap.getRelation(ship.ownerid);
                var color = sets.enemyshipto;
                if (vgap.allied(ship.ownerid))
                    color = sets.allyshipto;
                if (relation && relation.color && relation.color != "")
                    color = "#" + relation.color;
                if (vgap.sh.isPod(ship))
                    color = colorToRGBA(color, 0.2);

                var speedfactor = 1;
                if (vgap.sh.isPod(ship) && ship.neutronium == 2)
                    speedfactor = 1.5;

                var speed = vgap.getSpeed(ship.warp, ship.hullid, speedfactor);

                var x2 = ship.x + Math.round(Math.sin(Math.toRad(ship.heading)) * speed);
                var y2 = ship.y + Math.round(Math.cos(Math.toRad(ship.heading)) * speed);
                //ship.targetx = x2;
                //ship.targety = y2;


                //color = colorToRGBA(color, 0.3);

                dasharray = [6,3];

                this.waypoints.push({ id: ship.id, x1: ship.x, y1: ship.y, x2: x2, y2: y2, color: color, dasharray: dasharray });

                //this.waypoints.push(this.paper.path("M" + this.screenX(ship.x) + " " + this.screenY(ship.y) + "L" + this.screenX(x2) + " " + this.screenY(y2)).attr({ stroke: color, "stroke-width": "2", "stroke-opacity": 0.5 }));
            }
        }
        else if (!vgap.editmode || (ship.targetx != 0 && ship.targety != 0)) {

            if (vgap.isChunnelling(ship)) {

                var x = ship.x;
                var y = ship.y;

                //we are initiating a chunnel at warp speed inside a matrix
                if (ship.warp > 0 && (ship.targetx != ship.x || ship.targety != ship.y)) {


                    var dasharray = null;
                    var color = sets.myshipto;

                    var next = vgap.getNextLoc(ship);

                    var waypoint = { id: ship.id, x1: x, y1: y, x2: next.x, y2: next.y, color: color, dasharray: dasharray };
                    this.waypoints.push(waypoint);

                    x = next.x;
                    y = next.y;
                }

                var targetId = vgap.getChunnelTarget(ship).id;
                var target = vgap.getShipClosestCopy(targetId, ship.x, ship.y);
                var dasharray = [9, 4];
                var color = "#00FFFF";
                if (ship.id < 0)
                    color = "rgba(0, 255, 255, 0.15)";
                var linewidth = 2;
                if (ship.hullid != 56 && ship.hullid != 114) {
                    dasharray = [5, 2];
                    color = "#009999";
                }
                if (vgap.isMultiChunnel(ship.x, ship.y, target.x, target.y)) {
                    linewidth = 6;
                    dasharray = [6,6];
                }

                this.waypoints.push({ id: ship.id, x1: x, y1: y, x2: target.x, y2: target.y, color: color, dasharray: dasharray, linewidth: linewidth });
            }
            else if (vgap.isTemporalLancing(ship)) {

                var x = ship.x;
                var y = ship.y;

                var target = vgap.getTemporalLanceEndPoint(ship);
                var dasharray = [9, 4];
                var color = "#FF00FF";
                var linewidth = 2;

                this.waypoints.push({ id: ship.id, x1: x, y1: y, x2: target.x, y2: target.y, color: color, dasharray: dasharray, linewidth: linewidth });
            }
            else {

                var dasharray = null;

                var color = sets.myshipto;// colorToRGBA(sets.myshipto, 0.3); //{ stroke: sets.myshipto, "stroke-width": "2", "stroke-opacity": 0.5 };
                var path = vgap.getPath(ship);

                if (vgap.isHyping(ship)) {
                    color = "#F5F5DC";
                    dasharray = [2, 2];

                    if (path.length > 0) {
                        var first = path[0];
                        var dist = Math.dist(first.x1, first.y1, first.x2, first.y2);
                        var mindist = shorterDistOKForHyp ? 0 : 339.95;
                        var maxdist = 360.05;
                        var middist = 350;
                        if (vgap.settings.isacademy) {
                            mindist = shorterDistOKForHyp ? 0 : 8;
                            maxdist = 9;
                            middist = 8.5;
                        }
                        if (dist < mindist || dist > maxdist) {
                            //now we just fly exactly 350
                            color = "#FF0000";
                            ship.heading = vgap.getHeading(first.x1, first.y1, first.x2, first.y2);
                            first.x2 = ship.x + Math.round(Math.sin(Math.toRad(ship.heading)) * middist);
                            first.y2 = ship.y + Math.round(Math.cos(Math.toRad(ship.heading)) * middist);
                        }
                        //ship.hypend = { x: first.x2, y: first.y2 };
                    }
                }

                //use tower path
                var tower = vgap.isTowTarget(ship.id);
                if (tower != null) 
                    path = vgap.getPath(tower);                    

                // We need the towees waypoint to draw in purple in drawUserChangable *sigh*
                // But we do NOT want the towee's waypoints to be drawn over the tower, when the tower runs out of fuel
                // and the towee is NOT selected. Common case when your lowest ID ship tows to evade a cloaker.
                let movingShip = tower ? tower : ship;
                var startfuel = movingShip.neutronium;
                for (var j = 0; j < path.length; j++) {
                    let hop = path[j];

                    if (vgap.isHyping(ship) && j > 0)
                        break;

                    var neededFuel = vgap.getFuelUsage(hop.x1, hop.y1, hop.x2, hop.y2, movingShip);
                    if (neededFuel > startfuel)
                        color = "#ff6600";
                    startfuel -= neededFuel;

                    //pod color
                    if (vgap.sh.isPod(ship))
                        color = colorToRGBA("#7a7a3e", 0.1);

                    var waypoint = { id: ship.id, x1: hop.x1, y1: hop.y1, x2: hop.x2, y2: hop.y2, color: color, dasharray: dasharray };
                    this.waypoints.push(waypoint);
                }
            }
        }
    }
    for (var i = 0; i < vgap.ionstorms.length; i++) {
        var storm = vgap.ionstorms[i];
        if (storm.parentid == 0) {

            var x = storm.x;
            var y = storm.y;

            var x2 = x + Math.round(Math.sin(Math.toRad(storm.heading)) * storm.warp * storm.warp);
            var y2 = y + Math.round(Math.cos(Math.toRad(storm.heading)) * storm.warp * storm.warp);

            //add 1000 to id to make sure it doesnt' match up with ship ids
            this.waypoints.push({ id: 1000 + storm.id, x1: x, y1: y, x2: x2, y2: y2, color: colorToRGBA("#FFFF00", 0.1) });
        }
    }

    if (vgap.q.isPlayingHorwasp()) {
        vgap.myplanets.forEach(planet => {
            if (vgap.pl.isBuildingPod(planet)) {
                vgap.pl.waypointsForPod(planet).forEach(wp =>
                    this.waypoints.push({id: planet.id, color: colorToRGBA("#7a7a3e", 0.5), ...wp})
                )
            }
        })
    }

}