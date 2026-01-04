// ==UserScript==
// @name        ShowTimeMachineFuture
// @author      ternitet
// @copyright   ternitet, 2020
// @description Enhances McNimble's Toolkit v1.1.1 with a button to reach the next turn!
// @namespace   ternitet
// @include     https://planets.nu/*
// @include     https://*.planets.nu/*
// @include     http://planets.nu/*
// @include     http://*.planets.nu/*
// @version     0.8
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/410051/ShowTimeMachineFuture.user.js
// @updateURL https://update.greasyfork.org/scripts/410051/ShowTimeMachineFuture.meta.js
// ==/UserScript==

if (!GM_info) GM_info = GM.info;

var name = GM_info.script.name;
var version = GM_info.script.version;



var showTimeMachineFuture = function() {
    var plugin = function(name, version) {
        this.name = name;
        this.version = version;
    };

    vgapDashboard.prototype.showTimeMachine_preShowTimeMachineFuture = vgapDashboard.prototype.showTimeMachine;
    vgapDashboard.prototype.showTimeMachine = function() {

        // insert  original Time Machine
        this.showTimeMachine_preShowTimeMachineFuture();

        // now inject a button to make the Time Machine load the next turn
        $("<div class='ListPlanet'>Future T" + (vgap.nowTurn + 1) + "</div>").tclick(function() { vgap.loadNow(); mcNimblesPlugin.loadNextTurn(); }).insertBefore($('div:contains("Return to Now")').filter(function() {
  return $(this).text() == "Return to Now";
}));

    };


    return plugin;
}();

vgap.registerPlugin(showTimeMachineFuture, name);
console.log(name + " v"+version+" planets.nu plugin registered");