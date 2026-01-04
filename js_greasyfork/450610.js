// ==UserScript==
// @name         Confirmation Alerts
// @namespace    http://tampermonkey.net/
// @homepage     https://greasyfork.org/users/946530-purefishmonke
// @version      1.2
// @description  Confirmation alert template
// @supportURL   https://discord.com/invite/XZ8JqgYg93
// @author       DevFish
// @match        https://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450610/Confirmation%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/450610/Confirmation%20Alerts.meta.js
// ==/UserScript==

///Config///
var keybind = 192 // 192 = BACKTICK (`), find more at https://keycode.info
var conftxt = "Click A Button" // Switch the text inside the "" to whatever you want
var confrmtxt = "Confirmed" // Switch the text inside the "" to whatever you want
var canceltxt = "Cancelled" // Switch the text inside the "" to whatever you want

/// Main Script (Do not edit) ///
window.onkeydown=function(event){if(event.keyCode===keybind){if(confirm(conftxt)==true){alert(confrmtxt)}else{alert(canceltxt)}}}