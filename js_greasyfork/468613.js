// ==UserScript==
// @name         Diep.io Crosshair Pointer remixed remixed
// @version      0.3
// @description  Makes the pointer crosshair and the aim easily. This script based by Mixaz017's script. Thanks a lot!
// @author       HarryplaysOMG4
// @match      https://diep.io/
// @namespace https://greasyfork.org/en/users/1076889
// @license If you choose to publish a edited version, please credit me!
// @downloadURL https://update.greasyfork.org/scripts/468613/Diepio%20Crosshair%20Pointer%20remixed%20remixed.user.js
// @updateURL https://update.greasyfork.org/scripts/468613/Diepio%20Crosshair%20Pointer%20remixed%20remixed.meta.js
// ==/UserScript==
var cursorStyle = "crosshair";
var cursorRefresh = function() { document.getElementById("canvas").style.cursor = cursorStyle; };
window.onmouseup = function() { cursorStyle = "crosshair"; cursorRefresh(); };
window.onmousedown = function() { cursorStyle = "crosshair"; cursorRefresh(); };
window.onmousemove = function() { if ( document.getElementById("canvas").style.cursor != cursorStyle ) { cursorStyle = "crosshair"; cursorRefresh(); } };