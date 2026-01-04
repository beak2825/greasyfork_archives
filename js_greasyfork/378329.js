// ==UserScript==
// @name         Agma.io Respawn on R By Dizzy
// @namespace    http://tampermonkey.net
// @version      0.1.4
// @description  Click R to respawn
// @author       Dizzy
// @match        http://agma.io/*
// @downloadURL https://update.greasyfork.org/scripts/378329/Agmaio%20Respawn%20on%20R%20By%20Dizzy.user.js
// @updateURL https://update.greasyfork.org/scripts/378329/Agmaio%20Respawn%20on%20R%20By%20Dizzy.meta.js
// ==/UserScript==
/* jshint ignore:start */
var key = 82;

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