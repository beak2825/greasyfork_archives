// ==UserScript==
// @name         Alert Prank Userscript
// @namespace    https://tampermonkey.net/
// @homepage     https://greasyfork.org/users/946530-purefishmonke
// @version      1.5
// @description  Install this on someone's device and watch them be confused and annoyed.
// @supportURL   https://discord.com/invite/XZ8JqgYg93
// @author       DevFish 
// @match        https://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449574/Alert%20Prank%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/449574/Alert%20Prank%20Userscript.meta.js
// ==/UserScript==

///Config///
var txt = "Bozo!" //Change the text inside the "" to customize the message
var time = "0" //Change the number inside the "" to customize the time until the alert pops up again after it gets closed (time in ms) (0 = Instantly)

/// Main Script (Do not edit) ///

function start(){alert(txt);setTimeout(start,time)}start();