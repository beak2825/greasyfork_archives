// ==UserScript==
// @name         Dok's Zombie Irrigation System
// @namespace    com.doktorjones.q2019counter
// @version      0.4
// @description  Zombies work best when adequately irrigated!
// @author       Doktor J
// @match        http://play.quarantine2019.com/game
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/17843/Dok%27s%20Zombie%20Irrigation%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/17843/Dok%27s%20Zombie%20Irrigation%20System.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

var hax = $("#warninglinks").find("a");
var attackurl = "";
var ding = 0;
if (hax.text() == "Repair again") attackurl = window.location.protocol + "//" + window.location.hostname + hax.attr("href");
if (hax.text() == "Ruin again") attackurl = window.location.protocol + "//" + window.location.hostname + hax.attr("href");
if (hax.text() == "Try again") attackurl = window.location.protocol + "//" + window.location.hostname + hax.attr("href");
if (hax.text() == "Attack again") attackurl = window.location.protocol + "//" + window.location.hostname + hax.attr("href");

console.log("Found URL: " + attackurl);

var si = window.setInterval(function() {
    var obj = unsafeWindow.doktorj;
    if (obj.epc > 0 && obj.ep <= 0 && attackurl != "") {
        if (ding == 0) {
            ding = Math.floor((Math.random() * (26 - 9)) + 9) * 1050;
            window.setTimeout(function() { console.log("Going to " + attackurl); window.location.href = attackurl; attackurl = ""; }, ding);
            window.clearInterval(si);
        }
    }
},1000);