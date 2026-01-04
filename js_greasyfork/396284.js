// ==UserScript==
// @name         Astr.io - Respawn on R
// @namespace    http://gronlokke.github.io/
// @version      0.1.2
// @description  Click R to respawn in Astr.io.
// @author       Gronlokke
// @match        http://astr.io/*
// @downloadURL https://update.greasyfork.org/scripts/396284/Astrio%20-%20Respawn%20on%20R.user.js
// @updateURL https://update.greasyfork.org/scripts/396284/Astrio%20-%20Respawn%20on%20R.meta.js
// ==/UserScript==
/* jshint ignore:start */
var key = 82; // Change this to any key you want, you can get the key code on keycode.info.

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