// ==UserScript==
// @name         Wheel of Bitcoin
// @version      0.7
// @description  try to take over the world!
// @author       You
// @match        http://wheelofbitcoin.com/free-spin.php
// @grant        none
// @namespace https://greasyfork.org/users/25633
// @downloadURL https://update.greasyfork.org/scripts/17362/Wheel%20of%20Bitcoin.user.js
// @updateURL https://update.greasyfork.org/scripts/17362/Wheel%20of%20Bitcoin.meta.js
// ==/UserScript==

// Your code here...
user_id = 'bo1nk@msn.com';

theSpeed = 2;
powerSelected(2);
spinMode = 'determinedAngle';

var prandomSelect = Math.floor(1 + (Math.random() * (3 - 1)))
var priseV = 0;
if ( prandomSelect == 1 ){
    priseV = Math.floor(315 + (Math.random() * (360 - 315)));  //40
} else if (prandomSelect == 2) {
    priseV = Math.floor(180 + (Math.random() * (224 - 180)));  //35
} else if (prandomSelect == 3) {
    priseV = Math.floor(90 + (Math.random() * (134 - 90)));    //30
}

startSpin(priseV);

setTimeout(function(){
    $('#submit > button').click();
},20000);