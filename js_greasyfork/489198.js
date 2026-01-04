// ==UserScript==
// @name         cookie clicker cheats
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  simple cheats fo cookie clicker ₜᵧₚₑ ᵧₑₛ🤫...............
// @author       You
// @match        https://orteil.dashnet.org/cookieclicker/
// @grant        none
// @license   MIT
// @downloadURL https://update.greasyfork.org/scripts/489198/cookie%20clicker%20cheats.user.js
// @updateURL https://update.greasyfork.org/scripts/489198/cookie%20clicker%20cheats.meta.js
// ==/UserScript==

(function() {y=0; function SpawnGC() {if (y==10){Game.goldenCookie.spawn(); y=0;}};
             function Crazy() {SpawnGC(); z=Math.floor(Math.random() * 10); Game.Earn(Game.ObjectsById[z].price); Game.ObjectsById[z].buy(); console.log(z);};
             var x = 0;
setInterval(function(){Game.WriteSave();}, 1000);
var x = prompt("TYPE YES IF U WANT MADD COOKIESSSSS!!!!!");

setInterval(function(){y++; if (x==1) {Game.priceIncrease = 1;}; if (x==2) {Game.priceIncrease = 1.15;}; if (x==3) {Game.priceIncrease = 1.45;};
if (x==yes) {Crazy();};},  1000);

})();