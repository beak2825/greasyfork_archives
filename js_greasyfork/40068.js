// ==UserScript==
// @name        brofist.io hacks 2018 (Hide and Seek)
// @namespace   Best brofist.io hacks 2018 (Hide and Seek)
// @include     http://brofist.io/modes/hideAndSeek/c/index.html
// @version     3
// @description Enjoy! WORKING (Updating every chance I get) and go to https://greasyfork.org/en/scripts/38484-best-brofist-io-hacks-2018-hide-and-seek
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40068/brofistio%20hacks%202018%20%28Hide%20and%20Seek%29.user.js
// @updateURL https://update.greasyfork.org/scripts/40068/brofistio%20hacks%202018%20%28Hide%20and%20Seek%29.meta.js
// ==/UserScript==
document.onkeydown = function(event) {
 if (event.keyCode == 38) {
  mode.player.gpData.p.force=[0, 700];
 }
if (event.keyCode == 40) {
  mode.player.gpData.p.force=[0, -700];
 }
if (event.keyCode == 49){
mode.spd=3.5;
}
if (event.keyCode == 50){
mode.spd=3;
}
 if (event.keyCode == 51) {
mode.player.gpData.p.invMass = 0
}
if (event.keyCode == 52) {
mode.player.gpData.p.invMass = 1
}
if (event.keyCode == 53) {
mode.player.gpData.p.angle = 3.14159
mode.player.gpData.p.gravityScale = -1
}
if (event.keyCode == 54) {
mode.player.gpData.p.angle = 0
mode.player.gpData.p.gravityScale = 1
}
if (event.keyCode == 55){
mode.player.gpData.p.gravityScale=0;
mode.player.gpData.p.collisionResponse=0;
}
if (event.keyCode == 56){
mode.player.gpData.p.gravityScale=1;
mode.player.gpData.p.collisionResponse=1;
}
if (event.keyCode == 57){
mode.player.gpData.p.position[1]=1
}
if (event.keyCode == 48){
mode.player.gpData.p.position[1]=-122.38400268554688
}
};