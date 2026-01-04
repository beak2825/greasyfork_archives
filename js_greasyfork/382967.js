/*
    Copyright (C) 2017-2019 Thomas Horn
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
// ==UserScript==
// @name          nuSweepFC
// @description   Planets.nu plugin for "FC sweep"
// @version       0.01.08
// @date          2019-06-11
// @author        drgirasol
// @include       http://planets.nu/*
// @include       https://planets.nu/*
// @include       http://play.planets.nu/*
// @include       https://play.planets.nu/*
// @include       http://test.planets.nu/*
// @include       https://test.planets.nu/*
// @supportURL    https://github.com/drgirasol/nusweepfc/issues
// @homepageURL   https://github.com/drgirasol/nusweepfc/wiki
// @grant         none

// @namespace https://greasyfork.org/users/91175
// @downloadURL https://update.greasyfork.org/scripts/382967/nuSweepFC.user.js
// @updateURL https://update.greasyfork.org/scripts/382967/nuSweepFC.meta.js
// ==/UserScript==

function wrapper () { // wrapper for injection

    /*
 *
 * FC Sweeper
 *
 */
let sweepfc = {
    getRaceAdjectives: function() {
        return vgap.races.map(function(r) {
            return r.adjective;
        });
    },
    getPotentialRaceAdjectives: function(raceAdjectives) {
        return vgap.relations.filter(function (r) {
            return r.relationfrom < 2 && r.playertoid !== r.playerid;
        }).map(function (r) {
            return raceAdjectives[r.playertoid];
        });
    },
    getScannerId: function(m) {
        let matchId = m.headline.match(/ID#(\d+)/);
        if (matchId) {
            return matchId[1];
        } else {
            return false;
        }
    },
    injectShipFC: function(m, ship) {
        let lines = m.body.split("<br/>");
        let newBody = [];
        lines.forEach(function (line) {
            newBody.push(line);
            if (line.match(/AT:\s\(/)) newBody.push("FC: " + ship.friendlycode);
        });
        m.body = newBody.join("<br/>");
    },
    scanReports: function() {
        console.warn("Scanning mine scan reports for 'friendly' enemies...");
        vgap.messageTypes.push("FC Sweep");
        //vgap.messageTypeCount.push(1);
        let raceAdjectives = sweepfc.getRaceAdjectives();
        let potEnemies = sweepfc.getPotentialRaceAdjectives(raceAdjectives);
        //console.log(potEnemies);
        let mineScanReports = vgap.messages.filter(function (m) {
            let match = m.body.match(/\(([A-Za-z]+)\) has granted us safe passage/);
            //if (m.messagetype === 19 && m.body.match(/has granted us safe passage/) !== null) console.log(m.body);
            return m.messagetype === 19 && match !== null && potEnemies.indexOf(match[1]) > -1;
        });
        //console.log(mineScanReports);
        let sfcReportIds = vgap.messages.filter(function (m) {
            return m.messagetype === 23;
        }).map(function (m) {
            return m.id;
        });
        if (mineScanReports.length > 0) {
            mineScanReports.forEach(function (m) {
                if (sfcReportIds.indexOf(m.id) === -1) {
                    let shipId = sweepfc.getScannerId(m);
                    if (shipId) {
                        let curShip = vgap.getShip(shipId);
                        if (curShip) {
                            sweepfc.injectShipFC(m, curShip);
                        } else {
                            console.error("Ship data for s'%s' could not be accessed!", shipId);
                        }
                    } else {
                        console.error("Ship ID could not be determined from report!", m);
                    }
                    vgap.messages.push({
                        body: m.body,
                        headline: m.headline,
                        id: m.id,
                        messagetype: 23,
                        ownerid: m.ownerid,
                        target: m.target,
                        turn: m.turn,
                        x: m.x,
                        y: m.y
                    });
                }
            });
        } else {
            if (sfcReportIds.indexOf(11223344) === -1) {
                vgap.messages.push({
                    body: "Nothing to report",
                    headline: "FC Sweep",
                    id: 11223344,
                    messagetype: 23,
                    ownerid: vgap.player.id,
                    target: false,
                    turn: vgap.game.turn,
                    x: 0,
                    y: 0
                });
            }
        }
    },
    /*
     * DRAWING
     */
    // draw: executed on any click or drag on the starmap
    draw: function() {
        //console.log("Draw: plugin called.");
    },
    //
    /*
     *  UI - Hooks
     */
    // processload: executed whenever a turn is loaded: either the current turn or an older turn through time machine
    processload: function() {
        //console.log(vgap);
        sweepfc.scanReports(); // check reports for destroyed vessels
    },
    // loaddashboard: executed to rebuild the dashboard content after a turn is loaded
    loaddashboard: function() {
        //console.log("LoadDashboard: plugin called.");
    },
    // showdashboard: executed when switching from starmap to dashboard
    showdashboard: function() {
        //console.log("ShowDashboard: plugin called.");
    },
    // showsummary: executed when returning to the main screen of the dashboard
    showsummary: function() {
        //console.log("ShowSummary: plugin called.");
    },
    // loadmap: executed after the first turn has been loaded to create the map
    loadmap: function() {
        //console.log("LoadMap: plugin called.");
    },
    // showmap: executed when switching from dashboard to starmap
    showmap: function() {
        //console.log("ShowMap: plugin called.");
    },
    // loadplanet: executed when a planet is selected on dashboard or starmap
    loadplanet: function() {
        //console.log("LoadPlanet: plugin called.");
    },
    // loadstarbase: executed when a starbase is selected on dashboard or starmap
    loadstarbase: function() {
        //console.log("LoadStarbase: plugin called.");
    },
    // loadship: executed when a planet is selected on dashboard or starmap
    loadship: function() {
        //console.log("LoadShip: plugin called.");
    }
};


	// register your plugin with NU
	vgap.registerPlugin(sweepfc, "sweepfcPlugin");
	console.log("nuSweepFC plugin registered");
} //wrapper for injection

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
