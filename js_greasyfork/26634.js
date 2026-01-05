// ==UserScript==
// @name Extencion Happy For Win
// @namespace http://tampermonkey.net/
// @version 0.9
// @description hacer la tricks mejor y dividirse mas rapido
// @author  Juancho Morre
// @match http://happyfor.win/?*
// @match http://happyfor.win*
// @match http://happyfor.win*
// @match http://happyfor.win*
// @match http://happyfor.win*
// @match http://happyfor.win*
// @match http://happyfor.win*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/26634/Extencion%20Happy%20For%20Win.user.js
// @updateURL https://update.greasyfork.org/scripts/26634/Extencion%20Happy%20For%20Win.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var imlost = 50

document.getElementById("instructions").innerHTML += "Tecla A 2 Veces = X16 ESPACIOS------------ Tecla D = Doblesplit";

document.getElementById("instructions").innerHTML += "";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> <b></b> </span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'> Hecho por:<b> <strong>◄Ɗɱ►ƉEƝℳαℛҜ✖✖</strong> Leader de: <strong>◄Ɗɱ►????</strong></b>!</span></span></center>";
document.getElementById("instructions").innerHTML += "<a href='http://dmclanhfw.blogspot.com.ar/' target='_blank'><img alt='Agar.io & Other !' id='Header1_headerimg' src='https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ_EdidiaEN6tmqMhWi_Z-0AdjF_wt0IwOGov4myPRRsJjMnCpXtQ'100px ; ' width='100px; '></div>";
document.getElementById("instructions").innerHTML += "<a href='https://www.youtube.com/channel/UCryW1HQQVMsuiSYRso4PLfA?view_as=public' target='_blank'><img alt='Like my FaceBook page !' id='Header1_headerimg' src='http://i.imgur.com/OWZqzTj.jpg' style='display: inline' height='100px ; ' width='100px; '></div>";
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
setTimeout(ilikedick, imlost);
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