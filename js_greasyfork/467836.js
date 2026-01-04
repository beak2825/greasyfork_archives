// ==UserScript==
// @name         Percentage Attack
// @namespace    zero.attackper.torn
// @version      0.2
// @description  Adds a bar at certain percentage
// @author       -zero [2669774]
// @match        https://www.torn.com/loader.php?sid=attack&user2ID*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467836/Percentage%20Attack.user.js
// @updateURL https://update.greasyfork.org/scripts/467836/Percentage%20Attack.meta.js
// ==/UserScript==

var percentage = "50";

function insert(){
    if ($('.pbWrap___K0uUO ').length > 0){
        const rect = `<div class="percentzero" style="width: ${percentage}%;height: 10px;position: absolute;z-index: 5;border-right: 2px solid black;"></div>`;
        $('.pbWrap___K0uUO ').prepend(rect);
    }
    else{
        setTimeout(insert,300);
    }
}

insert();