// ==UserScript==
// @name         Cookie clicker hacks.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  loads o fun
// @author       You
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39814/Cookie%20clicker%20hacks.user.js
// @updateURL https://update.greasyfork.org/scripts/39814/Cookie%20clicker%20hacks.meta.js
// ==/UserScript==

(function() {y=0; function SpawnGC() {if (y==10){Game.goldenCookie.spawn(); y=0;}};
             function Crazy() {SpawnGC(); z=Math.floor(Math.random() * 10); Game.Earn(Game.ObjectsById[z].price); Game.ObjectsById[z].buy(); console.log(z);};
             var x = 0;
setInterval(function(){Game.WriteSave();}, 1000);
var x = prompt("What mode? Speed=1 Normal=2 Hardcore=3 Crazy=4");

setInterval(function(){y++; if (x==1) {Game.priceIncrease = 1;}; if (x==2) {Game.priceIncrease = 1.15;}; if (x==3) {Game.priceIncrease = 1.45;};
if (x==4) {Crazy();};},  1000);

})();