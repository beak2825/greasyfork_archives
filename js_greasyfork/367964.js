// ==UserScript==
// @name        Best brofist.io hacks 2018 (Sandbox)
// @namespace   https://greasyfork.org/en
// @include     http://brofist.io/modes/sandbox/c/index.html
// @version     3.2
// @description Enjoy! (Script is not working! Will try to update as fast as I can.) 
// @author      Kaden Baker
// @compatible  chrome
// @compatible  safari
// @compatible  firefox
// @compatible  opera
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/367964/Best%20brofistio%20hacks%202018%20%28Sandbox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/367964/Best%20brofistio%20hacks%202018%20%28Sandbox%29.meta.js
// ==/UserScript==
document.onkeydown = function(event) {
 if (event.keyCode == 38) {
mode.player.gpData.p.force=[0, 1000];
}
if (event.keyCode == 40) {
mode.player.gpData.p.force=[0, -1000];
}
if (event.keyCode == 49) {
client.start();
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
};