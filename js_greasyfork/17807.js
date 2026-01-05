// ==UserScript==
// @name         Steam Community - Block group announcements
// @namespace    Royalgamer06
// @version      0.1
// @description  Hide/blocks announcements of a specific steam community group. Specify group name in the "blockgroup" variable.
// @author       Royalgamer06
// @match        http://steamcommunity.com/*/home
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17807/Steam%20Community%20-%20Block%20group%20announcements.user.js
// @updateURL https://update.greasyfork.org/scripts/17807/Steam%20Community%20-%20Block%20group%20announcements.meta.js
// ==/UserScript==

var blockgroup = "TF2 Flaming Raffles";

var ann = document.querySelectorAll("div.blotter_group_announcement_header > div.blotter_group_announcement_header_text > a");

for (var i = 0; i < ann.length; i++) {
    if (ann[i].innerHTML == blockgroup) {
        var del = ann[i].parentNode.parentNode.parentNode.parentNode;
        del.parentNode.removeChild(del);
    }
}