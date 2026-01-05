
// ==UserScript==
// @name League of Legends Shop Script
// @namespace CS-Arena.com - professionelles Game-, Rootserver- & Housingbusiness
// @include https://store.*boosts*
// @version 0.1
// @description enter something useful - Ehm no pls, dont make me do this.
// @copyright 2012+, You
// @downloadURL https://update.greasyfork.org/scripts/1488/League%20of%20Legends%20Shop%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/1488/League%20of%20Legends%20Shop%20Script.meta.js
// ==/UserScript==

// initiate
function init() {
while (true) {
var threedayboost = document.getElementById('unlock_item_boosts_2');
if (typeof (threedayboost) != 'undefined' && threedayboost != null) {
threedayboost.click();
break;
}
}
while (true) {
var buybutton = document.getElementById('buy_with_rp_link');
if (typeof (buybutton) != 'undefined' && buybutton != null) {
buybutton.click();
break;
}
}
}

// starting code in 5 seconds
setTimeout(init, 5000);