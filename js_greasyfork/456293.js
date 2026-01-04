// ==UserScript==
// @name          nuteste
// @description   Planets.nu plugin tester
// @version       0.00.1
// @date          202-12-08
// @author        rcarvalho
// @include       http://planets.nu/*
// @include       https://planets.nu/*
// @include       http://play.planets.nu/*
// @include       https://play.planets.nu/*
// @include       http://test.planets.nu/*
// @include       https://test.planets.nu/*
// @grant         none
// @namespace     Planets.nu
 
// @downloadURL https://update.greasyfork.org/scripts/456293/nuteste.user.js
// @updateURL https://update.greasyfork.org/scripts/456293/nuteste.meta.js
// ==/UserScript==
 
function wrapper () { // wrapper
 
    /*
 *
 * Test
 *
 */
let teste= {
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
        console.log("scanReports");
       // vgap.messageTypes.push("TESTE");
        //vgap.messageTypeCount.push(1);
        let raceAdjectives = teste.getRaceAdjectives();
        let potEnemies = teste.getPotentialRaceAdjectives(raceAdjectives);
        console.log(potEnemies);
        
    },
    //
    /*
     *  UI - Hooks
     */
    processload: function() {
        console.log("TESTE" + vgap);
        teste.scanReports(); 
    }
};
	// register your plugin with NU
	vgap.registerPlugin(teste, "testePlugin");
	console.log("nuteste plugin registered");
} //wrapper for injection
 
var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";
 
document.body.appendChild(script);