// ==UserScript==
// @name         squareOsuIcons
// @namespace    squareOsuIcons
// @version      1.00
// @author       cyndifusic
// @run-at       document-start
// @description  Converts osu! profile pictures from rounded squares to squares

// @include   http://osu.ppy.sh*
// @include   https://osu.ppy.sh*
// @downloadURL https://update.greasyfork.org/scripts/462816/squareOsuIcons.user.js
// @updateURL https://update.greasyfork.org/scripts/462816/squareOsuIcons.meta.js
// ==/UserScript==

var convert = function() {
    document.getElementsByClassName("profile-info__avatar")[0].style.borderRadius = "0px";
}
var wait1 = function() {
    setTimeout(convert, 1000);
}
wait1();
document.addEventListener("click", wait1);