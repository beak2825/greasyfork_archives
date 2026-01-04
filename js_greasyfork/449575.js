// ==UserScript==
// @name         Alert Messages
// @namespace    http://tampermonkey.net/
// @homepage     https://greasyfork.org/en/users/946530-purefishmonke
// @version      2.4
// @description  Sends an alert when you press a certain button on your keyboard
// @supportURL   https://discord.com/invite/XZ8JqgYg93
// @author       DevFish 
// @match        https://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449575/Alert%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/449575/Alert%20Messages.meta.js
// ==/UserScript==

///Config///
var txt = "Hello World!" // Text The Alert Shows
var btn = 192 // Keycode of the button that triggers the alert. (Default button is the ` button) You can find keycodes at https://keycodes.info

/// Script (Do not edit) ///

window.onkeydown = function(event){if(event.keyCode == btn){alert(txt)}}