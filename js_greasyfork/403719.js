// ==UserScript==
// @name         Leevz.io crosshair pointer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  A crosshair pointer for leevz.io(and the first ever leevz.io script)
// @author       mint
// @match        https://leevz.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403719/Leevzio%20crosshair%20pointer.user.js
// @updateURL https://update.greasyfork.org/scripts/403719/Leevzio%20crosshair%20pointer.meta.js
// ==/UserScript==
    'use strict';
alert("If you can see this it means that the script is working.(you can get rid of this by deleting the alert line in the code)");
var cursorStyle = "crosshair";
var cursorRefresh = function() { document.getElementById("canvas").style.cursor = cursorStyle; };
window.onmouseup = function() { cursorStyle = "crosshair"; cursorRefresh(); };
window.onmousedown = function() { cursorStyle = "all-scroll"; cursorRefresh(); };
window.onmousemove = function() { if ( document.getElementById("canvas").style.cursor != cursorStyle ) { cursorStyle = "crosshair"; cursorRefresh(); } };