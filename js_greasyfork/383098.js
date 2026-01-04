// ==UserScript==
// @name         Zombs.io settings shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ninja's script
// @author       Gamer
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383098/Zombsio%20settings%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/383098/Zombsio%20settings%20shortcuts.meta.js
// ==/UserScript==

// setting buttons & controls innerHtml
window.onload = function() {
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
Settings += "<center><h2>Other stuff xD</h2>";
Settings += '<button class="btn btn-blue" style="width: 60%;" onclick="Leave();">Leave Party!</button>';
Settings += "<br><br>"
Settings += '<button class="btn btn-blue" style="width: 60%;" onclick="Fill();">Fill Server!</button>';
Settings += "<br><br>"
     document.getElementsByClassName('hud-settings-grid')[0].innerHTML = Settings;
}