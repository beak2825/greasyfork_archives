// ==UserScript==
// @name         Diep.io Crosshair Pointer remixed
// @version      2.5
// @description  Makes the pointer crosshair and the aim easily. This script based by Mixaz017's script. Thanks a lot!
// @author       _BARLEYER_
// @include      http://diep.io/
// @namespace https://greasyfork.org/ja/users/161581
// @downloadURL https://update.greasyfork.org/scripts/35905/Diepio%20Crosshair%20Pointer%20remixed.user.js
// @updateURL https://update.greasyfork.org/scripts/35905/Diepio%20Crosshair%20Pointer%20remixed.meta.js
// ==/UserScript==
var cursorStyle = "crosshair";
var cursorRefresh = function() { document.getElementById("canvas").style.cursor = cursorStyle; };
window.onmouseup = function() { cursorStyle = "crosshair"; cursorRefresh(); };
window.onmousedown = function() { cursorStyle = "all-scroll"; cursorRefresh(); };
window.onmousemove = function() { if ( document.getElementById("canvas").style.cursor != cursorStyle ) { cursorStyle = "crosshair"; cursorRefresh(); } };