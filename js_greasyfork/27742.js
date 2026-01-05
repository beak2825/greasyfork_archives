// ==UserScript==
// @name extension ❥ƤƇƦ◈❥ happyfor.win
// @namespace http://tampermonkey.net/
// @version 0.9
// @description this extension have macros.
// @author ❥ƤƇƦ◈❥ Clan
// @match http://happyfor.win/*
// @match http://happyfor.win/*
// @match http://happyfor.win/*
// @match http://happyfor.win/*
// @match http://happyfor.win/*
// @match http://happyfor.win/*
// @match http://happyfor.win/*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/27742/extension%20%E2%9D%A5%C6%A4%C6%87%C6%A6%E2%97%88%E2%9D%A5%20happyforwin.user.js
// @updateURL https://update.greasyfork.org/scripts/27742/extension%20%E2%9D%A5%C6%A4%C6%87%C6%A6%E2%97%88%E2%9D%A5%20happyforwin.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var imlost = 25;
document.getElementById("instructions").innerHTML += "༺⋘░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░»༻";
document.getElementById("instructions").innerHTML += "??????? ?? ???????Ó?";
document.getElementById("instructions").innerHTML += "?? ??? ????";
document.getElementById("instructions").innerHTML += "";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> <b></b> </span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'> Created by<b> <strong>❥❥Create by ƤƇƦ◈❥ Clan</strong> and <strong>??? ????</strong></b>!</span></span></center>";
document.getElementById("instructions").innerHTML += "<a href='https://www.youtube.com/channel/UCX_x2Bu49nOZwAPeT89YZtg' target='_blank'><img alt='Agar.io & Other !' id='Header1_headerimg' src='https://yt3.ggpht.com/-5RfaHSvNaZc/AAAAAAAAAAI/AAAAAAAAAAA/GjPcNyvdDjk/s100-c-k-no-mo-rj-c0xffffff/photo.jpg'display: inline' height='100px ; ' width='100px; '></div>";
document.getElementById("instructions").innerHTML += "<a href='https://www.facebook.com/davidagariopro' target='_blank'><img alt='Like my FaceBook page !' id='Header1_headerimg' src='https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-9/14322417_331107693947543_4927857989636430140_n.jpg?oh=86ec9d221b75e3eee1aa6d2b8741b3eb&oe=586FAC92' style='display: inline' height='100px ; ' width='100px; '></div>";
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
if (event.keyCode == 65) {
ilikedick();
}
} // When Player Lets Go Of Q, It Stops Feeding
function keyup(event) {
if (event.keyCode == 81) {
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