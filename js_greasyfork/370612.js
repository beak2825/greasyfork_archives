// ==UserScript==
// @name         Flying seal
// @namespace    namespace
// @version      0.8
// @description  If you're bored of planes try owls
// @author       Kivou inspired from https://www.torn.com/forums.php#/p=threads&f=67&t=16048041&b=0&a=0
// @match        *.torn.com/index.php*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/370612/Flying%20seal.user.js
// @updateURL https://update.greasyfork.org/scripts/370612/Flying%20seal.meta.js
// ==/UserScript==


GM_addStyle(`
  .flipped {
    transform: scale(-1, 1);
    -moz-transform: scale(-1, 1);
    -webkit-transform: scale(-1, 1);
    -o-transform: scale(-1, 1);
    -khtml-transform: scale(-1, 1);
    -ms-transform: scale(-1, 1);
  }
`)

var planeType = $("#plane > img").attr("src").split(".")[0].split("-").pop();
// var pict = "https://i.snag.gy/XBrKmF.jpg";  // flying goat
var pict = "https://i.snag.gy/eNL6Ef.jpg"; // flying seal

if(planeType == "to") {
    $("#plane > img").attr("src", pict);
}
else if (planeType == "from") {
    $("#plane > img").attr("src", pict).addClass('flipped');
}
