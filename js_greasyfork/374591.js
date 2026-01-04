// ==UserScript==
// @name         Brutal io cool crosshair Better
// @version      2.5
// @description  This is a ? looking cursor. Accually. Thats what it looks like. Hey use this website https://www.sitepoint.com/css3-cursor-styles/
// @author       enigMyth_Thunder
// @include      http://brutal.io/
// @namespace https://greasyfork.org/ja/users/161581
// @downloadURL https://update.greasyfork.org/scripts/374591/Brutal%20io%20cool%20crosshair%20Better.user.js
// @updateURL https://update.greasyfork.org/scripts/374591/Brutal%20io%20cool%20crosshair%20Better.meta.js
// ==/UserScript==
var cursorStyle = "help";
var cursorRefresh = function() { document.getElementById("canvas").style.cursor = cursorStyle; };
window.onmouseup = function() { cursorStyle = "help"; cursorRefresh(); };
window.onmousedown = function() { cursorStyle = "all-scroll"; cursorRefresh(); };
window.onmousemove = function() { if ( document.getElementById("canvas").style.cursor != cursorStyle ) { cursorStyle = "help"; cursorRefresh(); } };