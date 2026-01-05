// ==UserScript==
// @name ZonaDeGuerra.Net
// @namespace http://tampermonkey.net/
// @version 0.9
// @description DOBLES MAS RAPIDOS Y SEBAR RAPIDO
// @author  TheCarlos
// @match http://happyfor.win/?*
// @match http://happyfor.win*
// @match http://happyfor.win*
// @match http://happyfor.win*
// @match http://happyfor.win*
// @match http://happyfor.win*
// @match http://happyfor.win*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/30219/ZonaDeGuerraNet.user.js
// @updateURL https://update.greasyfork.org/scripts/30219/ZonaDeGuerraNet.meta.js
// ==/UserScript==

(function() {
    var amount = 6;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 69) { // KEY_E
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 87}); // KEY_W
                    window.onkeyup({keyCode: 87});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var imlost = 50

document.getElementById("instructions").innerHTML += "TECLA A 2 VECES 16 ESPACIOS / TECLA S = DOBLESPLIT";

document.getElementById("instructions").innerHTML += "";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> <b></b> </span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'> Hecho por:<b> <strong>ZonaDeGuerra.Net</strong> Face: <strong>Rodri Bl</strong></b></span></span></center>";
document.getElementById("instructions").innerHTML += "<a href='https://www.facebook.com/zonadeguerra85' target='_blank'><img alt='Agar.io & Other !' id='Header1_headerimg' src='http://i.imgur.com/tLHuJiQ.png'100px ; ' width='100px; '></div>";
document.getElementById("instructions").innerHTML += "<a href='https://www.facebook.com/zonadeguerra85' target='_blank'><img alt='Like my FaceBook page !' id='Header1_headerimg' src='http://i.imgur.com/Mpgsd3V.png' style='display: inline' height='100px ; ' width='100px; '></div>";
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
if (event.keyCode == 65 || event.keyCode == 65) { //( ͡° ͜ʖ ͡°)
ilikedick();
setTimeout(ilikedick, imlost);
setTimeout(ilikedick, imlost*2);
setTimeout(ilikedick, imlost*3);
} // Triplesplit
if (event.keyCode == 65 || event.keyCode == 65) {
ilikedick();
setTimeo
ut(ilikedick, imlost);
setTimeout(ilikedick, imlost*2);
} // Doublesplit
if (event.keyCode == 68 || event.keyCode == 68) {
ilikedick();
setTimeout(ilikedick, imlost);
} // Split
if (event.keyCode == 67) {
ilikedick();
}
} // When Player Lets Go Of Q, It Stops Feeding
function keyup(event) {
if (event.keyCode == 66) {
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
