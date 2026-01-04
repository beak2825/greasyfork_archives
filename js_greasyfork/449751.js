// ==UserScript==
// @name		Florr.io leave the current game by pressing Escape
// @author		Zeus
// @version		1.1
// @description	You lazy? Good! This script allows you to quit the current party you are in by pressing escape instead of going all the way to the top left corner in order to do so.
// @match		*://florr.io/*
// @run-at      document-load
// @namespace   https://zeusmod.glitch.me/
// @downloadURL https://update.greasyfork.org/scripts/449751/Florrio%20leave%20the%20current%20game%20by%20pressing%20Escape.user.js
// @updateURL https://update.greasyfork.org/scripts/449751/Florrio%20leave%20the%20current%20game%20by%20pressing%20Escape.meta.js
// ==/UserScript==

window.addEventListener("keydown", function(e) {
    if (e.keyCode == 27) {
        e.preventDefault();
        cp6.disconnect();
    }
})