// ==UserScript==
// @name         Auto Clicker for More Ore
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Auto Clicker for More Ore, clicks weak spots, manual attacks on quest, and golden nuggets. Also updates automatically.
// @author       xWass
// @match        https://syns.studio/more-ore/
// @icon         https://syns.studio/more-ore/misc-tinyRock.22ef93dd.ico
// @require      https://greasyfork.org/scripts/444840-more-ore-notification/code/More%20Ore%20-%20Notification+.user.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443486/Auto%20Clicker%20for%20More%20Ore.user.js
// @updateURL https://update.greasyfork.org/scripts/443486/Auto%20Clicker%20for%20More%20Ore.meta.js
// ==/UserScript==

NotificationPlus?.load("Auto Clicker");
/*
var quest = setInterval(function(){
    if (document.querySelector('.manual-attack')) {
        document.querySelector('.manual-attack').click()
    }
}, 25);
var weak = setInterval(function(){
    if (document.querySelector('.weak-spot')) {
        document.querySelector('.weak-spot').click()
    }
}, 25);
*/
var gnugget = setInterval(function(){
    if (document.querySelector('.gold-nugget-container')) {
        document.querySelector('.gold-nugget-container').click()
    }
}, 1500);