// ==UserScript==
// @name        CloneCheck Enforcer
// @author      ternitet
// @copyright   ternitet, 2020
// @description For planets.nu -- This plugin enhances robodoc's Clone Checker Plugin v1.0 by enforcing a check after clicking Exit. A dialog message will appear if at least one of your clone tries will fail.
// @namespace   nidaz/planets.nu
// @include     https://planets.nu/*
// @include     https://*.planets.nu/*
// @include     http://planets.nu/*
// @include     http://*.planets.nu/*
// @version     0.9
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/410066/CloneCheck%20Enforcer.user.js
// @updateURL https://update.greasyfork.org/scripts/410066/CloneCheck%20Enforcer.meta.js
// ==/UserScript==

if (!GM_info) GM_info = GM.info;

var name = GM_info.script.name;
var version = GM_info.script.version;

var mainCloneChecker = vgap.plugins["cloneCheckPlugin"];

if (!mainCloneChecker) {
    nu.info(
        "You need 'Planets.nu - Clone Checker Plugin' to run the '"+name+"' plugin. <ol>" +
            "<li><a href='https://greasyfork.org/de/scripts/373894-planets-nu-clone-checker-plugin' style='color: yellow'>Download it</a>.</li>" +
            "<li>Make sure it runs before this plugin, by setting the order in which tampermonkey scripts run</a>.</li>" +
            "<li>Reload this page.</li>" +
          "</ol>",
        "Can not run '"+name+"'",
         400
    );
}

var cloneCheckEnforcer = function() {
    var plugin = function(name, version) {
        this.name = name;
        this.version = version;
    };

    Nuniverse.prototype.exitVGAP_original = Nuniverse.prototype.exitVGAP;
    Nuniverse.prototype.exitVGAP = function() {

        var triedClones = mainCloneChecker.findAttemptedClones(false); // all clone tries
        var validClones = mainCloneChecker.findAttemptedClones(true); // valid clones

        if (triedClones > validClones) {
            var invalidClones = triedClones - validClones;
            nu.info(
                "CloneCheck identified a problem with " + invalidClones + " of your clone commands. Please check.",
                "Clone Check alarm!",
                400
            );
        }
        Nuniverse.prototype.exitVGAP_original();
    };
    return plugin;
}();

vgap.registerPlugin(cloneCheckEnforcer, name);
console.log(name + " v"+version+" planets.nu plugin registered");