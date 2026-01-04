// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.cubecraft.net/forums/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372443/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/372443/New%20Userscript.meta.js
// ==/UserScript==

var staff_titles = document.querySelectorAll(".staffOnline .userTitle");

var original = ["Mod", "Sr. Mod", "Admin"];
var replace = ["Moderator", "Sr. Moderator", "Administrator"];

for(var i = 0; i < staff_titles.length; i++) {
    for(var j = 0; j < original.length; j++) {
        if(staff_titles[i].innerHTML === original[j]) {
            staff_titles[i].innerHTML = replace[j];
        }
    }
}