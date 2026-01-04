// ==UserScript==
// @name         Mid Shift Board
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Goes from Mid Shift to Night Shift Board
// @author       You
// @match        https://realtimeboard.com/app/board/o9J_k00_Vu0=/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372574/Mid%20Shift%20Board.user.js
// @updateURL https://update.greasyfork.org/scripts/372574/Mid%20Shift%20Board.meta.js
// ==/UserScript==

var d= new Date();
var h= d.getHours();
var m= d.getMinutes();
if((m >= 55) && (h == 14)){
window.open("https://realtimeboard.com/app/board/o9J_k03FBaU=/", "_self")
}else if(m >= 50 && h == 14){
    setInterval(function(){ location.reload(); }, 60*1000)
}else(setInterval(function(){ location.reload(); }, 10*60*1000))