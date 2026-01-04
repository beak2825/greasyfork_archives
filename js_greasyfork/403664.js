// ==UserScript==
// @name         Florr.io crosshair pointer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A crosshair pointer for florr.io(this script is an altered version of mugi sus script so it works on florr.io)
// @author       mint
// @match        https://florr.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403664/Florrio%20crosshair%20pointer.user.js
// @updateURL https://update.greasyfork.org/scripts/403664/Florrio%20crosshair%20pointer.meta.js
// ==/UserScript==
    'use strict';
alert("This alert will pop up if the script is working.(you can get rid of this by deleting the alert line in the code)");
var cursorStyle = "crosshair";
var cursorRefresh = function() { document.getElementById("canvas").style.cursor = cursorStyle; };
window.onmouseup = function() { cursorStyle = "crosshair"; cursorRefresh(); };
window.onmousedown = function() { cursorStyle = "all-scroll"; cursorRefresh(); };
window.onmousemove = function() { if ( document.getElementById("canvas").style.cursor != cursorStyle ) { cursorStyle = "crosshair"; cursorRefresh(); } };