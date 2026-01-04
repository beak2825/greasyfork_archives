// ==UserScript==
// @name         Morning Board
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Goes from Morning to Mid-Shift board
// @author       You
// @match        https://realtimeboard.com/app/board/o9J_k00_OPA=/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372572/Morning%20Board.user.js
// @updateURL https://update.greasyfork.org/scripts/372572/Morning%20Board.meta.js
// ==/UserScript==

var d= new Date();
var h= d.getHours();
var m= d.getMinutes();
if((m >=25) && (h == 10)){
window.open("https://realtimeboard.com/app/board/o9J_k00_Vu0=/", "_self")
}else if(m >= 20 && h == 10){
    setInterval(function(){ location.reload(); }, 60*1000)
}else(setInterval(function(){ location.reload(); }, 10*60*1000))