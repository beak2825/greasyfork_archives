
// ==UserScript==
// @name Extencion ☯Ǥற?
// @namespace http://tampermonkey.net/
// @version 0.9
// @description hacer la tricks mejor y dividirse mas rapido
// @author ༄றΔƦσ?༻━━☯Ǥற?
// @match http://happyfor.win/*
// @match http://happyfor.win/*
// @match http://happyfor.win/*
// @match http://happyfor.win/*
// @match http://happyfor.win/*
// @match http://happyfor.win/*
// @match http://happyfor.win/*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/25689/Extencion%20%E2%98%AF%C7%A4%E0%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/25689/Extencion%20%E2%98%AF%C7%A4%E0%AE%B1.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var imlost = 25;
document.getElementById("instructions").innerHTML += "༺⋘░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░»༻";
document.getElementById("instructions").innerHTML += "EXTENCION ";
document.getElementById("instructions").innerHTML += " BY ";
document.getElementById("instructions").innerHTML += "MARO GM";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> <b></b> </span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'> Created by<b> <strong>✌༄றΔƦσ?༻━━☯Ǥற?™</strong> and <strong>✌ЯX❥ CLAN</strong></b>!</span></span></center>";
document.getElementById("instructions").innerHTML += "<a href='https://www.youtube.com/channel/UCzALtCSh-LCtZgdflDW9PeA' target='_blank'><img alt='By Maro' id='Header1_headerimg' src='https://yt3.ggpht.com/-bNUntfXQZZc/AAAAAAAAAAI/AAAAAAAAAAA/CL21Pdr3TEQ/s100-c-k-no-mo-rj-c0xffffff/photo.jpg'display: inline' height='100px ; ' width='100px; '></div>";
document.getElementById("instructions").innerHTML += "<a href='https://www.youtube.com/channel/UCjPBwgVDfdz7FAyiiwvaiCw' target='_blank'><img alt='RX Clan !' id='Header1_headerimg' src='https://yt3.ggpht.com/-JYFmtiJL-mQ/AAAAAAAAAAI/AAAAAAAAAAA/zzeLoJfKnjk/s100-c-k-no-mo-rj-c0xffffff/photo.jpg' style='display: inline' height='100px ; ' width='100px; '></div>";
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
}﻿