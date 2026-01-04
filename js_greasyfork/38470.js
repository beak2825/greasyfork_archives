// ==UserScript==
// @name        brofist.io mods by johnathan haney
// @namespace   brofist.io hacks 2018
// @include     http://brofist.io/modes/twoPlayer/c/index.html
// @version     2.7
// @description ooff 2 player mod
// @grant       none
// @locale      none
// @downloadURL https://update.greasyfork.org/scripts/38470/brofistio%20mods%20by%20johnathan%20haney.user.js
// @updateURL https://update.greasyfork.org/scripts/38470/brofistio%20mods%20by%20johnathan%20haney.meta.js
// ==/UserScript==

document.onkeydown = function(event) {
 if (event.keyCode == 38) { 
  mode.player.gpData.p.force=[0, 700];
 }
if (event.keyCode == 40) { 
  mode.player.gpData.p.force=[0, -700];
 }
if (event.keyCode == 49) { 
mode.player.gpData.p.position[0] = 
mode.spawn.refP.p.position[0];
mode.player.gpData.p.position[1] = 
mode.spawn.refP.p.position[1];
}
 if (event.keyCode == 50) { 
mode.player.gpData.p.position[0] = 
mode.exitGate.exitGateCounter.refP.p.position[0];
mode.player.gpData.p.position[1] = 
mode.exitGate.exitGateCounter.refP.p.position[1];
}
 if (event.keyCode == 51) {
mode.player.gpData.p.invMass = 0;
}
if (event.keyCode == 52) {
mode.player.gpData.p.invMass = 1;
}
if (event.keyCode == 53) {
mode.player.gpData.p.angle = 3.14159;
mode.player.gpData.p.gravityScale = -1;
}
if (event.keyCode == 54) {
mode.player.gpData.p.angle = 0;
mode.player.gpData.p.gravityScale = 1;
}
if (event.keyCode == 55){
Object.defineProperty(mode, 'ghost', {enumerable:!1,configurable:!0,writable:!1,value:!0}); mode.player.gpData.p.gravityScale=0; 
mode.player.gpData.p.collisionResponse=0;
mode.player.gpData.p.invMass = 0;
}
if (event.keyCode == 56){
Object.defineProperty(mode, 'ghost', {enumerable:!1,configurable:!0,writable:!1,value:!1});
mode.player.gpData.p.gravityScale=1; 
mode.player.gpData.p.collisionResponse=1;
mode.player.gpData.p.invMass = 1;
}
}

