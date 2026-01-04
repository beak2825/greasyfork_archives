// ==UserScript==
// @name         Humanatic Juego
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://www.humanatic.com/pages/humfun/break_room.cfm?categorize_slow_down
// @match        https://www.humanatic.com/pages/humfun/break_room.cfm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369745/Humanatic%20Juego.user.js
// @updateURL https://update.greasyfork.org/scripts/369745/Humanatic%20Juego.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

Juego(1,1);

function sleep(){return randomXToY(randomXToY(100,300),500);}

function timeOut(){return document.getElementsByClassName('brgame-timer-number')[0].innerHTML == "0";}

function randomXToY(minVal,maxVal)
{
  var randVal = minVal+(Math.random()*(maxVal-minVal));
  return Math.round(randVal);
}

function Juego(num,num2){
    if(!timeOut())
    switch(num){
        case 1:
            if(num2 == 1){
                document.getElementsByClassName("brgame-card-back brgame-card-back-red")[0].click();
                setTimeout(function(){Juego(num,2);},sleep());
            }else{
                document.getElementsByClassName("brgame-card-back brgame-card-back-red")[1].click();
                setTimeout(function(){Juego(num+1,1);},sleep());}
            break;
        case 2:
            if(num2 == 1){
                document.getElementsByClassName("brgame-card-back brgame-card-back-green")[0].click();
                setTimeout(function(){Juego(num,2);},sleep());
            }else{
                document.getElementsByClassName("brgame-card-back brgame-card-back-green")[1].click();
                setTimeout(function(){Juego(num+1,1);},sleep());}
            break;
        case 3:
            if(num2 == 1){
                document.getElementsByClassName("brgame-card-back brgame-card-back-blue")[0].click();
                setTimeout(function(){Juego(num,2);},sleep());
            }else{
                document.getElementsByClassName("brgame-card-back brgame-card-back-blue")[1].click();
                setTimeout(function(){Juego(num+1,1);},sleep());}
            break;
        case 4:
            if(num2 == 1){
                document.getElementsByClassName("brgame-card-back brgame-card-back-orange")[0].click();
                setTimeout(function(){Juego(num,2);},sleep());
            }else{
                document.getElementsByClassName("brgame-card-back brgame-card-back-orange")[1].click();
                setTimeout(function(){Juego(num+1,1);},sleep());}
            break;
        case 5:
            if(num2 == 1){
                document.getElementsByClassName("brgame-card-back brgame-card-back-yellow")[0].click();
                setTimeout(function(){Juego(num,2);},sleep());
            }else{
                document.getElementsByClassName("brgame-card-back brgame-card-back-yellow")[1].click();
                setTimeout(function(){Juego(num+1,1);},sleep());}
            break;
        case 6:
            if(num2 == 1){
                document.getElementsByClassName("brgame-card-back brgame-card-back-white")[0].click();
                setTimeout(function(){Juego(num,2);},sleep());
            }else{
                document.getElementsByClassName("brgame-card-back brgame-card-back-white")[1].click();
                setTimeout(function(){Juego(num+1,1);},sleep());}
            break;
        default:
            break;
    }
}