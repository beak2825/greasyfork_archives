// ==UserScript==
// @name         Tropas de Lag 3.0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Moderno
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404104/Tropas%20de%20Lag%2030.user.js
// @updateURL https://update.greasyfork.org/scripts/404104/Tropas%20de%20Lag%2030.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();addEventListener("keydown", function(a){
    var mause=addEventListener("onclick", function(b){
    if ( Input.GetKey ( KeyCode.Mouse0 ))
{
   var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < selUnits.length; ++b) e.push(selUnits[b].id);
        socket.emit("5", c1, d1, e, 0, -1)
}});
if (a.keyCode===56){
juntar2();
juntar();
}
function juntar(){
        var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY;
        for (var e = [], b = 0; b < selUnits.length; ++b) e.push(selUnits[b].id);
        socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), e, 0, -1)
}
    function juntar2(){
     var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < selUnits.length; ++b) e.push(selUnits[b].id);
        socket.emit("5", c1, d1, e, 0, -1)
    }
});