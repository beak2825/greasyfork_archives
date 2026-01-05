// ==UserScript==
// @name         Macrosplit for HFW.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fb: Fabreh Cárdenas
// @author       Fabreh 7w7
// @match        http://happyfor.win
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/24047/Macrosplit%20for%20HFW.user.js
// @updateURL https://update.greasyfork.org/scripts/24047/Macrosplit%20for%20HFW.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var imlost = 25;
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'><b> <strong>By: Fabreh </strong> ;D <strong></strong></b>!</span></span></center>";
document.getElementById("instructions").innerHTML += "Shift=triple(2 veces para trick) Q=Doble.";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> <b></b> </span></span></center>";
load();load();
function load() {
if (document.getElementById("overlays").style.display!="none") {
document.getElementById("settings").style.display = "block";
if (document.getElementById('showMass').checked) {document.getElementById('showMass').click();}
document.getElementById('showMass').click();
if (document.getElementById('darkTheme').checked) {document.getElementById('darkTheme').click();}
document.getElementById('darkTheme').click();
// I changed the above because now agario 'remembers' your preferences, but doesn't actually work, so if they're already set to be true, you need to undo it, then re click to true
} else {
setTimeout(load, 100);
}
}
function keydown(event) {
if (event.keyCode == 81) {
Feed = true;
setTimeout(fukherriteindapussie, imlost);
  } // Tricksplit
    if (event.keyCode == 84 || event.keyCode == 16) {
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
        setTimeout(ilikedick, imlost*3);
} // Triplesplit
if (event.keyCode == 83 || event.keyCode == 83) {
ilikedick();
setTimeout(ilikedick, imlost);
setTimeout(ilikedick, imlost*2);
} // Doublesplit
if (event.keyCode == 81 || event.keyCode == 81) {
ilikedick();
setTimeout(ilikedick, imlost);
} // Split
if (event.keyCode == 65) {
ilikedick();
}
} // When Player Lets Go Of Q, It Stops Feeding
function keyup(event) {
if (event.keyCode == 69) {
Feed = false;
}
if (event.keyCode == 79) {
Dingus = false;
}
}
// Feed Macro With Q
function fukherriteindapussie() {
if (Feed) {
window.onkeydown({keyCode: 69});
window.onkeyup({keyCode: 69});
setTimeout(fukherriteindapussie, imlost);
}
}
function ilikedick() {
$("body").trigger($.Event("keydown", { keyCode: 32}));
$("body").trigger($.Event("keyup", { keyCode: 32}));
}