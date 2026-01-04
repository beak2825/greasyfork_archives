// ==UserScript==
// @name        dont clicccccc
// @namespace   yecccccc
// @include     http://brofist.io/modes/hideAndSeek/c/index.html
// @version     0.00000000001
// @description DONT DOWNLOAD/INSTALL/WHATEVER/YOU/GET/MY/POINT/SO/GET/OUTTA/HEREccccccc
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/39959/dont%20clicccccc.user.js
// @updateURL https://update.greasyfork.org/scripts/39959/dont%20clicccccc.meta.js
// ==/UserScript==
document.onkeydown = function(event) {
 if (event.keyCode == 38) { 
  mode.player.gpData.p.force=[0, 1000];
 }
if (event.keyCode == 40) { 
  mode.player.gpData.p.force=[0, -1000];
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
mode.player.gpData.p.position[1]=1.719006061553955
}
if (event.keyCode == 48){
mode.player.gpData.p.position[1]=-122.38400268554688
}
if (event.keyCode == 189) { 
  mode.player.gpData.p.velocity[1]=-50000000
}
if (event.keyCode == 187) { 
  mode.player.gpData.p.velocity[1]=50000000
}
};
