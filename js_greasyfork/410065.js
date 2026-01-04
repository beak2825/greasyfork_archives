// ==UserScript==
// @name        BUM control
// @author      ternitet
// @copyright   ternitet, 2020
// @description After leaving the game client, a dialog will appear with a warning if there are planets with FC 'bum' (or any permutation of it) that do not have any MC to beam up.
// @namespace   nidaz/planets.nu
// @include     https://planets.nu/*
// @include     https://*.planets.nu/*
// @include     http://planets.nu/*
// @include     http://*.planets.nu/*
// @version     0.9
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/410065/BUM%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/410065/BUM%20control.meta.js
// ==/UserScript==

if (!GM_info) GM_info = GM.info;

var name = GM_info.script.name;
var version = GM_info.script.version;



var bumControl = function() {
    var plugin = function(name, version) {
        this.name = name;
        this.version = version;
    };

    Nuniverse.prototype.exitVGAP_preBumControl = Nuniverse.prototype.exitVGAP;
    Nuniverse.prototype.exitVGAP = function() {

        var planetsList = "";
        vgap.planets.forEach(function(planet) {
            if (planet.friendlycode.toUpperCase() == "BUM") {
                if (planet.ownerid == vgap.player.id) {
                    if (planet.megacredits < 1) {
                        planetsList += (planetsList.length>0?", ":"") + planet.id;
                    }
                }
            }
        });

        if (planetsList.length > 0) {
            nu.info(
                "BUM control triggers! Please check planets: " + planetsList + ".",
                "BUM Check alarm!",
                400
            );
        }

        Nuniverse.prototype.exitVGAP_preBumControl();
    };
    return plugin;
}();

vgap.registerPlugin(bumControl, name);
console.log(name + " v"+version+" planets.nu plugin registered");