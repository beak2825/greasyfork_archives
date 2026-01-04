// ==UserScript==
// @name         Agma.io - Respawn on m   by agus123
// @namespace    http://gronlokke.github.io/
// @version      0.1.2
// @description  Click m to respawn in Agma.io.
// @author       Gronlokke
// @match        http://agma.io/*
// @downloadURL https://update.greasyfork.org/scripts/382952/Agmaio%20-%20Respawn%20on%20m%20%20%20by%20agus123.user.js
// @updateURL https://update.greasyfork.org/scripts/382952/Agmaio%20-%20Respawn%20on%20m%20%20%20by%20agus123.meta.js
// ==/UserScript==
/* jshint ignore:start */
var key = 77; // Change this to any key you want, you can get the key code on keycode.info.

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