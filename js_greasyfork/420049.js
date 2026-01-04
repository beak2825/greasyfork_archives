// ==UserScript==
// @name         Agma.io Respawn with Q, By Kingadory-YT
// @namespace    http://tampermonkey.net
// @version  0.0.1
// @description  Click Q to respawn
// @author   Kingadory-YT
// @match        http://agma.io/*
// @downloadURL https://update.greasyfork.org/scripts/420049/Agmaio%20Respawn%20with%20Q%2C%20By%20Kingadory-YT.user.js
// @updateURL https://update.greasyfork.org/scripts/420049/Agmaio%20Respawn%20with%20Q%2C%20By%20Kingadory-YT.meta.js
// ==/UserScript==
/* jshint ignore:start */
var key = 81;
 
window.onload = function() {
    var respawn = document.getElementsByClassName("rspwnBtn")[0];
    var play = document.getElementById("playBtn");
    window.onkeydown = function(e) {
        if (e.keyCode == key && document.activeElement == document.body) {
            rspwn(document.getElementById('nick').value);
            play.click();
        }
    }
}
/* jshint ignore:end */