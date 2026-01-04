// ==UserScript==
// @name         Yuan to € market
// @namespace    Yesir
// @version      0.1
// @description  t<<wes
// @author       Bell#3138 / KilledbyPing
// @match        https://buff.163.com/market/?game*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404946/Yuan%20to%20%E2%82%AC%20market.user.js
// @updateURL https://update.greasyfork.org/scripts/404946/Yuan%20to%20%E2%82%AC%20market.meta.js
// ==/UserScript==

var YtoE = 0.125;

setTimeout(function Con(){
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
    while( Yuan[12].innerText.charAt(0) == unwantedCharacter ) Yuan[12].innerText = Yuan[12].innerText.substr(1);
    while( Yuan[13].innerText.charAt(0) == unwantedCharacter ) Yuan[13].innerText = Yuan[13].innerText.substr(1);
    while( Yuan[14].innerText.charAt(0) == unwantedCharacter ) Yuan[14].innerText = Yuan[14].innerText.substr(1);
    while( Yuan[15].innerText.charAt(0) == unwantedCharacter ) Yuan[15].innerText = Yuan[15].innerText.substr(1);
    while( Yuan[16].innerText.charAt(0) == unwantedCharacter ) Yuan[16].innerText = Yuan[16].innerText.substr(1);
    while( Yuan[17].innerText.charAt(0) == unwantedCharacter ) Yuan[17].innerText = Yuan[17].innerText.substr(1);
    while( Yuan[18].innerText.charAt(0) == unwantedCharacter ) Yuan[18].innerText = Yuan[18].innerText.substr(1);
    while( Yuan[19].innerText.charAt(0) == unwantedCharacter ) Yuan[19].innerText = Yuan[19].innerText.substr(1);
    while( Yuan[20].innerText.charAt(0) == unwantedCharacter ) Yuan[20].innerText = Yuan[20].innerText.substr(1);

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
    Yuan[12].innerText = Yuan[12].innerText * YtoE + "€"
    Yuan[13].innerText = Yuan[13].innerText * YtoE + "€"
    Yuan[14].innerText = Yuan[14].innerText * YtoE + "€"
    Yuan[15].innerText = Yuan[15].innerText * YtoE + "€"
    Yuan[16].innerText = Yuan[16].innerText * YtoE + "€"
    Yuan[17].innerText = Yuan[17].innerText * YtoE + "€"
    Yuan[18].innerText = Yuan[18].innerText * YtoE + "€"
    Yuan[19].innerText = Yuan[19].innerText * YtoE + "€"
    Yuan[20].innerText = Yuan[20].innerText * YtoE + "€"


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
    while( Yuan[12].innerText.charAt(0) == unwantedCharacter ) Yuan[12].innerText = Yuan[12].innerText.substr(1);
    while( Yuan[13].innerText.charAt(0) == unwantedCharacter ) Yuan[13].innerText = Yuan[13].innerText.substr(1);
    while( Yuan[14].innerText.charAt(0) == unwantedCharacter ) Yuan[14].innerText = Yuan[14].innerText.substr(1);
    while( Yuan[15].innerText.charAt(0) == unwantedCharacter ) Yuan[15].innerText = Yuan[15].innerText.substr(1);
    while( Yuan[16].innerText.charAt(0) == unwantedCharacter ) Yuan[16].innerText = Yuan[16].innerText.substr(1);
    while( Yuan[17].innerText.charAt(0) == unwantedCharacter ) Yuan[17].innerText = Yuan[17].innerText.substr(1);
    while( Yuan[18].innerText.charAt(0) == unwantedCharacter ) Yuan[18].innerText = Yuan[18].innerText.substr(1);
    while( Yuan[19].innerText.charAt(0) == unwantedCharacter ) Yuan[19].innerText = Yuan[19].innerText.substr(1);
    while( Yuan[20].innerText.charAt(0) == unwantedCharacter ) Yuan[20].innerText = Yuan[20].innerText.substr(1);

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
    Yuan[12].innerText = Yuan[12].innerText * YtoE + "€"
    Yuan[13].innerText = Yuan[13].innerText * YtoE + "€"
    Yuan[14].innerText = Yuan[14].innerText * YtoE + "€"
    Yuan[15].innerText = Yuan[15].innerText * YtoE + "€"
    Yuan[16].innerText = Yuan[16].innerText * YtoE + "€"
    Yuan[17].innerText = Yuan[17].innerText * YtoE + "€"
    Yuan[18].innerText = Yuan[18].innerText * YtoE + "€"
    Yuan[19].innerText = Yuan[19].innerText * YtoE + "€"
    Yuan[20].innerText = Yuan[20].innerText * YtoE + "€"


};
