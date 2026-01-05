// ==UserScript==
// @name          Planets.nu send diplomats to all
// @include       http://planets.nu/*
// @version 0.1
// @description   Send diplomats to all players
// @namespace https://greasyfork.org/users/2874
// @downloadURL https://update.greasyfork.org/scripts/2617/Planetsnu%20send%20diplomats%20to%20all.user.js
// @updateURL https://update.greasyfork.org/scripts/2617/Planetsnu%20send%20diplomats%20to%20all.meta.js
// ==/UserScript==
function wrapper () { // wrapper for injection

    console.log("sendDiplomats ver: 0.1");
    var old_dipMenu = vgapDashboard.prototype.dipMenu;
    vgapDashboard.prototype.dipMenu = function() {    
        old_dipMenu.apply(this, arguments);
        
        $("#SecondMenu").append("<li onclick='vgap.addOns.sendDiplomats();'>Send Diplomats to All</li>");
    };
    
    vgap.addOns.sendDiplomats = function() {
        for (var i = 0; i < vgap.players.length; i++) {
            var player = vgap.players[i];
            //console.log("Looking: " + player.id + " -> " + JSON.stringify(vgap.getRelation(player.id)));
            if (player.id != vgap.player.id && vgap.getRelation(player.id).relationto == 0) {
                //console.log("Setting: " + player.id);
        		vgap.dash.setRelation(player.id, 1);
            }
        }
    }
    
}
var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
