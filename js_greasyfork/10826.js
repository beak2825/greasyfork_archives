// ==UserScript==
// @name        PAPAZ addic7ed
// @namespace   *
// @include     http://www.addic7ed.com/serie/*
// @version     1.0
// @grant       none
// @description   Switches/Filters Addic7ed to show only English subtitles
// @downloadURL https://update.greasyfork.org/scripts/10826/PAPAZ%20addic7ed.user.js
// @updateURL https://update.greasyfork.org/scripts/10826/PAPAZ%20addic7ed.meta.js
// ==/UserScript==

var a = new String(document.location);
var b = a.substring(a.length-2,a.length);

function delay() {
var drop = document.getElementById("filterlang");

    drop.value="1";
    location.assign("javascript:filterChange();void(0)");   
}


if (b!="/1") {
    setTimeout(delay, 100);
}