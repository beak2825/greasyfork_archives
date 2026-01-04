// ==UserScript==
// @name         Agar.io - Respawn on R
// @namespace    https://greasyfork.org/en/users/469144-youfoundvictor
// @version      0.2
// @description  R to respawn in Agario
// @author       Victor Ferrin
// @match        http://agma.io/*
// @match        https://agar.io/*
// @downloadURL https://update.greasyfork.org/scripts/398737/Agario%20-%20Respawn%20on%20R.user.js
// @updateURL https://update.greasyfork.org/scripts/398737/Agario%20-%20Respawn%20on%20R.meta.js
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