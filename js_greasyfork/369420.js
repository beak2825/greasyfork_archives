// ==UserScript==
// @name        BlueCat Address Manager Hover Address Type
// @namespace   *
// @description Modify all address type images to show the type in text on hover over in BlueCat Address Manager
// @include     */app*
// @license		MIT
// @version     2
// @grant       none
// @copyright   2018, Marius Galm
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/369420/BlueCat%20Address%20Manager%20Hover%20Address%20Type.user.js
// @updateURL https://update.greasyfork.org/scripts/369420/BlueCat%20Address%20Manager%20Hover%20Address%20Type.meta.js
// ==/UserScript==

if (document.readyState === "interactive" ) {
    var ins = document.querySelectorAll("img");

    for (var i = 0; i < ins.length; i++) {
        var image = ins[i];
        if (image !== undefined) {
            // odd, shouldn't happen
            if (image.src.indexOf("pawn_glass_red.gif") > -1) {

                image.title = "Network IP / Broadcast";
            } else if (image.src.indexOf("pawn_glass_yellow.gif") > -1) {
                image.title = "Gateway";
            } else if (image.src.indexOf("pawn_glass_blue.gif") > -1) {
                image.title = "Static";
            } else if (image.src.indexOf("pawn_glass_green.gif") > -1) {
                image.title = "Reserved";
            } else if (image.src.indexOf("pawn_glass_white_new_attention.gif") > -1) {
                image.title = "DHCP Free";
            } else if (image.src.indexOf("pawn_glass_blue_new.gif") > -1) {
                image.title = "DHCP Allocated";
            } else if (image.src.indexOf("pawn_glass_green_new.gif") > -1) {
                image.title = "DHCP Reserved";
            } else if (image.src.indexOf("pawn_glass_white.gif") > -1) {
                image.title = "Unassigned";
            } else if (image.src.indexOf("pawn_glass_white_exclude.gif") > -1) {
                image.title = "DHCP Exclude";
            } else if (image.src.indexOf("pawn_glass_white_new.gif") > -1) {
                image.title = "Unassigned (DHCP)";
            }
        }
        //console.log(ins[i]);
    }
}