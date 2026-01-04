// ==UserScript==
// @name         Cookie Clicker cheat : Free cookies and sugar lumps.
// @version      1.4.0
// @description  How Many stuff You Want LOL
// @author       childconsumer69420
// @match        https://orteil.dashnet.org/cookieclicker/
// @namespace https://greasyfork.org/en/users/699088-childconsumer69420
// @downloadURL https://update.greasyfork.org/scripts/414889/Cookie%20Clicker%20cheat%20%3A%20Free%20cookies%20and%20sugar%20lumps.user.js
// @updateURL https://update.greasyfork.org/scripts/414889/Cookie%20Clicker%20cheat%20%3A%20Free%20cookies%20and%20sugar%20lumps.meta.js
// ==/UserScript==
window.onload = function(){
alert("Press E to gain cookies , press Y to gain sugar lumps.")
}

window.addEventListener('keydown', function(e){
if(e.key == "y"){
var ez = prompt("Enter Number Of Sugar Lumps You Want.", 10);
Game.gainLumps(parseInt(ez));
}
});

window.addEventListener('keydown', function(e){
if(e.key == "e"){
var ez = prompt("Enter Number of cookies You Want.", 1000000000);
Game.Earn(parseInt(ez));
}
});