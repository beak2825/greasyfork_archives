// ==UserScript==
// @name         Attack Alarm
// @version      0.6
// @description  It's a train, nope! It's a catapult
// @author       You
// @include        *://*.travian.*/build.php*
// @include        *://*.travian.*.*/build.php*
// @include        *://*/*.travian.*/build.php*
// @include        *://*/*.travian.*.*/build.php*
// @grant        none
// @namespace https://greasyfork.org/users/186782
// @downloadURL https://update.greasyfork.org/scripts/393429/Attack%20Alarm.user.js
// @updateURL https://update.greasyfork.org/scripts/393429/Attack%20Alarm.meta.js
// ==/UserScript==

$("document").ready(function(){

$("head").append('<meta http-equiv="Refresh" content="300">');

var items = $("table.inAttack");
if(items.length > 0){
    $("body").append('<audio id="audio" src="https://www.soundjay.com/transportation/sounds/train-crossing-bell-train-crossing-fast-01.mp3" autoplay="false"></audio>');
    var sound = document.getElementById("audio");
    sound.play();
}


});

