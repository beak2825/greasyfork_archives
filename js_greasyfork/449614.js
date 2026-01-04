// ==UserScript==
// @name         Console Spammer
// @namespace    http://tampermonkey.net/
// @homepage     https://greasyfork.org/users/946530-purefishmonke
// @version      1.4
// @description  Spams the chrome developer console (CTRL+SHIFT+J) with messages of your choice
// @supportURL   https://discord.com/invite/XZ8JqgYg93
// @author       DevFish
// @match        https://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449614/Console%20Spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/449614/Console%20Spammer.meta.js
// ==/UserScript==

///Config///
var txt = "Hello World!" // Text which is logged in the console
var speed = "0" // Speed (in ms) that the console sends the message

/// Main Script (Do not edit) ///

function startSpam(){console.log(txt),console.log(txt );setTimeout(startSpam,speed)}startSpam()