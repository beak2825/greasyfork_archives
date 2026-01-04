// ==UserScript==
// @name         Yuan to € goods
// @namespace    Yesir
// @version      0.1
// @description  yyess
// @author       Bell#3138 / KilledbyPing
// @match        https://buff.163.com/market/goods*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404947/Yuan%20to%20%E2%82%AC%20goods.user.js
// @updateURL https://update.greasyfork.org/scripts/404947/Yuan%20to%20%E2%82%AC%20goods.meta.js
// ==/UserScript==

var YtoE = 0.125;

setTimeout(function Con(){
    var Yuan = document.getElementsByClassName('f_Strong');
    //ik its hella messy dunno how to put var into a array plholder

    var fckdllr = document.getElementsByClassName("hide-usd");
    Yuan[1].innerText = Yuan[1].innerText.replace(fckdllr[0].innerText,"");


    var unwantedCharacter = "¥";
    while( Yuan[1].innerText.charAt(0) == unwantedCharacter ) Yuan[1].innerText = Yuan[1].innerText.substr(1);
    while( Yuan[2].innerText.charAt(0) == unwantedCharacter ) Yuan[2].innerText = Yuan[2].innerText.substr(1);
    while( Yuan[3].innerText.charAt(0) == unwantedCharacter ) Yuan[3].innerText = Yuan[3].innerText.substr(1);
    while( Yuan[4].innerText.charAt(0) == unwantedCharacter ) Yuan[4].innerText = Yuan[4].innerText.substr(1);
    while( Yuan[5].innerText.charAt(0) == unwantedCharacter ) Yuan[5].innerText = Yuan[5].innerText.substr(1);
    while( Yuan[6].innerText.charAt(0) == unwantedCharacter ) Yuan[6].innerText = Yuan[6].innerText.substr(1);
    while( Yuan[7].innerText.charAt(0) == unwantedCharacter ) Yuan[7].innerText = Yuan[7].innerText.substr(1);
    while( Yuan[8].innerText.charAt(0) == unwantedCharacter ) Yuan[8].innerText = Yuan[8].innerText.substr(1);
    while( Yuan[9].innerText.charAt(0) == unwantedCharacter ) Yuan[9].innerText = Yuan[9].innerText.substr(1);
    while( Yuan[10].innerText.charAt(0) == unwantedCharacter ) Yuan[10].innerText = Yuan[10].innerText.substr(1);
    while( Yuan[11].innerText.charAt(0) == unwantedCharacter ) Yuan[11].innerText = Yuan[11].innerText.substr(1);

    Yuan[1].innerText = Yuan[1].innerText * YtoE + "€"
    Yuan[2].innerText = Yuan[2].innerText * YtoE + "€"
    Yuan[3].innerText = Yuan[3].innerText * YtoE + "€"
    Yuan[4].innerText = Yuan[4].innerText * YtoE + "€"
    Yuan[5].innerText = Yuan[5].innerText * YtoE + "€"
    Yuan[6].innerText = Yuan[6].innerText * YtoE + "€"
    Yuan[7].innerText = Yuan[7].innerText * YtoE + "€"
    Yuan[8].innerText = Yuan[8].innerText * YtoE + "€"
    Yuan[9].innerText = Yuan[9].innerText * YtoE + "€"
    Yuan[10].innerText = Yuan[10].innerText * YtoE + "€"
    Yuan[11].innerText = Yuan[11].innerText * YtoE + "€"

}, 3000);



var TOPB = document.getElementsByClassName("icon icon_gotop");

TOPB[0].onclick = function(){

    var Yuan = document.getElementsByClassName('f_Strong');
    //ik its hella messy dunno how to put var into a array plholder

    var unwantedCharacter = "¥";
    while( Yuan[1].innerText.charAt(0) == unwantedCharacter ) Yuan[1].innerText = Yuan[1].innerText.substr(1);
    while( Yuan[2].innerText.charAt(0) == unwantedCharacter ) Yuan[2].innerText = Yuan[2].innerText.substr(1);
    while( Yuan[3].innerText.charAt(0) == unwantedCharacter ) Yuan[3].innerText = Yuan[3].innerText.substr(1);
    while( Yuan[4].innerText.charAt(0) == unwantedCharacter ) Yuan[4].innerText = Yuan[4].innerText.substr(1);
    while( Yuan[5].innerText.charAt(0) == unwantedCharacter ) Yuan[5].innerText = Yuan[5].innerText.substr(1);
    while( Yuan[6].innerText.charAt(0) == unwantedCharacter ) Yuan[6].innerText = Yuan[6].innerText.substr(1);
    while( Yuan[7].innerText.charAt(0) == unwantedCharacter ) Yuan[7].innerText = Yuan[7].innerText.substr(1);
    while( Yuan[8].innerText.charAt(0) == unwantedCharacter ) Yuan[8].innerText = Yuan[8].innerText.substr(1);
    while( Yuan[9].innerText.charAt(0) == unwantedCharacter ) Yuan[9].innerText = Yuan[9].innerText.substr(1);
    while( Yuan[10].innerText.charAt(0) == unwantedCharacter ) Yuan[10].innerText = Yuan[10].innerText.substr(1);
    while( Yuan[11].innerText.charAt(0) == unwantedCharacter ) Yuan[11].innerText = Yuan[11].innerText.substr(1);

    Yuan[2].innerText = Yuan[2].innerText * YtoE + "€"
    Yuan[3].innerText = Yuan[3].innerText * YtoE + "€"
    Yuan[4].innerText = Yuan[4].innerText * YtoE + "€"
    Yuan[5].innerText = Yuan[5].innerText * YtoE + "€"
    Yuan[6].innerText = Yuan[6].innerText * YtoE + "€"
    Yuan[7].innerText = Yuan[7].innerText * YtoE + "€"
    Yuan[8].innerText = Yuan[8].innerText * YtoE + "€"
    Yuan[9].innerText = Yuan[9].innerText * YtoE + "€"
    Yuan[10].innerText = Yuan[10].innerText * YtoE + "€"



};