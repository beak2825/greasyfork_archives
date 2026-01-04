// ==UserScript==
// @name         Leave party and server filler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ninja's Script
// @author       Gamer
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382736/Leave%20party%20and%20server%20filler.user.js
// @updateURL https://update.greasyfork.org/scripts/382736/Leave%20party%20and%20server%20filler.meta.js
// ==/UserScript==

window.onload = function() {
document.getElementsByClassName('hud-intro-corner-top-left')[0].innerHTML = '<legend>By: ✘N̷i̷n̷j̷a̷</legend>';
document.getElementsByClassName('hud-intro-footer')[0].innerHTML = "<center><h1>    </h1>";
document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[1].innerHTML = "<h1>Gamers Mod</h1>";
document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[3].innerHTML = "<h2>Mod. Upgrade. Rebel.</h2>";
document.getElementsByClassName("hud-intro-name")[0].setAttribute("maxlength", 29);
document.getElementsByClassName("hud-party-tag")[0].setAttribute("maxlength", 25);
window.Leave = function() {
Game.currentGame.network.sendRpc({ "name": "LeaveParty" })
}
window.Fill = function() {
setInterval(function() {
    document.getElementsByClassName("hud-intro-play")[0].click();
}, 0);
}
var Settings = '';
Settings += "<center><h2>My Scripts</h2>";
Settings += '<button class="btn btn-blue" style="width: 60%;" onclick="Leave();">Leave Party!</button>';
Settings += "<br><br>"
Settings += '<button class="btn btn-blue" style="width: 60%;" onclick="Fill();">Fill Server!</button>';
Settings += "<br><br>"
document.getElementsByClassName('hud-settings-grid')[0].innerHTML = Settings;
}