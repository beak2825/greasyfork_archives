// ==UserScript==
// @name         Yuan to € inv
// @namespace    Yesir
// @version      0.1
// @description  t<<wes
// @author       Bell#3138 / KilledbyPing
// @match        https://buff.163.com/market/steam_inventory*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404948/Yuan%20to%20%E2%82%AC%20inv.user.js
// @updateURL https://update.greasyfork.org/scripts/404948/Yuan%20to%20%E2%82%AC%20inv.meta.js
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
    while( Yuan[21].innerText.charAt(0) == unwantedCharacter ) Yuan[21].innerText = Yuan[21].innerText.substr(1);
    while( Yuan[22].innerText.charAt(0) == unwantedCharacter ) Yuan[22].innerText = Yuan[22].innerText.substr(1);
    while( Yuan[23].innerText.charAt(0) == unwantedCharacter ) Yuan[23].innerText = Yuan[23].innerText.substr(1);
    while( Yuan[24].innerText.charAt(0) == unwantedCharacter ) Yuan[24].innerText = Yuan[24].innerText.substr(1);
    while( Yuan[25].innerText.charAt(0) == unwantedCharacter ) Yuan[25].innerText = Yuan[25].innerText.substr(1);
    while( Yuan[26].innerText.charAt(0) == unwantedCharacter ) Yuan[26].innerText = Yuan[26].innerText.substr(1);
    while( Yuan[27].innerText.charAt(0) == unwantedCharacter ) Yuan[27].innerText = Yuan[27].innerText.substr(1);
    while( Yuan[28].innerText.charAt(0) == unwantedCharacter ) Yuan[28].innerText = Yuan[28].innerText.substr(1);
    while( Yuan[29].innerText.charAt(0) == unwantedCharacter ) Yuan[29].innerText = Yuan[29].innerText.substr(1);
    while( Yuan[30].innerText.charAt(0) == unwantedCharacter ) Yuan[30].innerText = Yuan[30].innerText.substr(1);
    while( Yuan[31].innerText.charAt(0) == unwantedCharacter ) Yuan[31].innerText = Yuan[31].innerText.substr(1);
    while( Yuan[32].innerText.charAt(0) == unwantedCharacter ) Yuan[32].innerText = Yuan[32].innerText.substr(1);
    while( Yuan[33].innerText.charAt(0) == unwantedCharacter ) Yuan[33].innerText = Yuan[33].innerText.substr(1);
    while( Yuan[34].innerText.charAt(0) == unwantedCharacter ) Yuan[34].innerText = Yuan[34].innerText.substr(1);
    while( Yuan[35].innerText.charAt(0) == unwantedCharacter ) Yuan[35].innerText = Yuan[35].innerText.substr(1);
    while( Yuan[36].innerText.charAt(0) == unwantedCharacter ) Yuan[36].innerText = Yuan[36].innerText.substr(1);
    while( Yuan[37].innerText.charAt(0) == unwantedCharacter ) Yuan[37].innerText = Yuan[37].innerText.substr(1);
    while( Yuan[38].innerText.charAt(0) == unwantedCharacter ) Yuan[38].innerText = Yuan[38].innerText.substr(1);
    while( Yuan[39].innerText.charAt(0) == unwantedCharacter ) Yuan[39].innerText = Yuan[39].innerText.substr(1);
    while( Yuan[40].innerText.charAt(0) == unwantedCharacter ) Yuan[40].innerText = Yuan[40].innerText.substr(1);
    while( Yuan[41].innerText.charAt(0) == unwantedCharacter ) Yuan[41].innerText = Yuan[41].innerText.substr(1);
    while( Yuan[42].innerText.charAt(0) == unwantedCharacter ) Yuan[42].innerText = Yuan[42].innerText.substr(1);
    while( Yuan[43].innerText.charAt(0) == unwantedCharacter ) Yuan[43].innerText = Yuan[43].innerText.substr(1);
    while( Yuan[44].innerText.charAt(0) == unwantedCharacter ) Yuan[44].innerText = Yuan[44].innerText.substr(1);
    while( Yuan[45].innerText.charAt(0) == unwantedCharacter ) Yuan[45].innerText = Yuan[45].innerText.substr(1);
    while( Yuan[46].innerText.charAt(0) == unwantedCharacter ) Yuan[46].innerText = Yuan[46].innerText.substr(1);
    while( Yuan[47].innerText.charAt(0) == unwantedCharacter ) Yuan[47].innerText = Yuan[47].innerText.substr(1);
    while( Yuan[48].innerText.charAt(0) == unwantedCharacter ) Yuan[48].innerText = Yuan[48].innerText.substr(1);
    while( Yuan[49].innerText.charAt(0) == unwantedCharacter ) Yuan[49].innerText = Yuan[49].innerText.substr(1);
    while( Yuan[50].innerText.charAt(0) == unwantedCharacter ) Yuan[50].innerText = Yuan[50].innerText.substr(1);
    while( Yuan[51].innerText.charAt(0) == unwantedCharacter ) Yuan[51].innerText = Yuan[51].innerText.substr(1);

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
    Yuan[21].innerText = Yuan[21].innerText * YtoE + "€"
    Yuan[22].innerText = Yuan[22].innerText * YtoE + "€"
    Yuan[23].innerText = Yuan[23].innerText * YtoE + "€"
    Yuan[24].innerText = Yuan[24].innerText * YtoE + "€"
    Yuan[25].innerText = Yuan[25].innerText * YtoE + "€"
    Yuan[26].innerText = Yuan[26].innerText * YtoE + "€"
    Yuan[27].innerText = Yuan[27].innerText * YtoE + "€"
    Yuan[28].innerText = Yuan[28].innerText * YtoE + "€"
    Yuan[29].innerText = Yuan[29].innerText * YtoE + "€"
    Yuan[30].innerText = Yuan[30].innerText * YtoE + "€"
    Yuan[31].innerText = Yuan[31].innerText * YtoE + "€"
    Yuan[32].innerText = Yuan[32].innerText * YtoE + "€"
    Yuan[33].innerText = Yuan[33].innerText * YtoE + "€"
    Yuan[34].innerText = Yuan[34].innerText * YtoE + "€"
    Yuan[35].innerText = Yuan[35].innerText * YtoE + "€"
    Yuan[36].innerText = Yuan[36].innerText * YtoE + "€"
    Yuan[37].innerText = Yuan[37].innerText * YtoE + "€"
    Yuan[38].innerText = Yuan[38].innerText * YtoE + "€"
    Yuan[39].innerText = Yuan[39].innerText * YtoE + "€"
    Yuan[40].innerText = Yuan[40].innerText * YtoE + "€"
    Yuan[41].innerText = Yuan[41].innerText * YtoE + "€"
    Yuan[42].innerText = Yuan[42].innerText * YtoE + "€"
    Yuan[43].innerText = Yuan[43].innerText * YtoE + "€"
    Yuan[44].innerText = Yuan[44].innerText * YtoE + "€"
    Yuan[45].innerText = Yuan[45].innerText * YtoE + "€"
    Yuan[46].innerText = Yuan[46].innerText * YtoE + "€"
    Yuan[47].innerText = Yuan[47].innerText * YtoE + "€"
    Yuan[48].innerText = Yuan[48].innerText * YtoE + "€"
    Yuan[49].innerText = Yuan[49].innerText * YtoE + "€"
    Yuan[50].innerText = Yuan[50].innerText * YtoE + "€"
    Yuan[51].innerText = Yuan[51].innerText * YtoE + "€"


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
    while( Yuan[21].innerText.charAt(0) == unwantedCharacter ) Yuan[21].innerText = Yuan[21].innerText.substr(1);
    while( Yuan[22].innerText.charAt(0) == unwantedCharacter ) Yuan[22].innerText = Yuan[22].innerText.substr(1);
    while( Yuan[23].innerText.charAt(0) == unwantedCharacter ) Yuan[23].innerText = Yuan[23].innerText.substr(1);
    while( Yuan[24].innerText.charAt(0) == unwantedCharacter ) Yuan[24].innerText = Yuan[24].innerText.substr(1);
    while( Yuan[25].innerText.charAt(0) == unwantedCharacter ) Yuan[25].innerText = Yuan[25].innerText.substr(1);
    while( Yuan[26].innerText.charAt(0) == unwantedCharacter ) Yuan[26].innerText = Yuan[26].innerText.substr(1);
    while( Yuan[27].innerText.charAt(0) == unwantedCharacter ) Yuan[27].innerText = Yuan[27].innerText.substr(1);
    while( Yuan[28].innerText.charAt(0) == unwantedCharacter ) Yuan[28].innerText = Yuan[28].innerText.substr(1);
    while( Yuan[29].innerText.charAt(0) == unwantedCharacter ) Yuan[29].innerText = Yuan[29].innerText.substr(1);
    while( Yuan[30].innerText.charAt(0) == unwantedCharacter ) Yuan[30].innerText = Yuan[30].innerText.substr(1);
    while( Yuan[31].innerText.charAt(0) == unwantedCharacter ) Yuan[31].innerText = Yuan[31].innerText.substr(1);
    while( Yuan[32].innerText.charAt(0) == unwantedCharacter ) Yuan[32].innerText = Yuan[32].innerText.substr(1);
    while( Yuan[33].innerText.charAt(0) == unwantedCharacter ) Yuan[33].innerText = Yuan[33].innerText.substr(1);
    while( Yuan[34].innerText.charAt(0) == unwantedCharacter ) Yuan[34].innerText = Yuan[34].innerText.substr(1);
    while( Yuan[35].innerText.charAt(0) == unwantedCharacter ) Yuan[35].innerText = Yuan[35].innerText.substr(1);
    while( Yuan[36].innerText.charAt(0) == unwantedCharacter ) Yuan[36].innerText = Yuan[36].innerText.substr(1);
    while( Yuan[37].innerText.charAt(0) == unwantedCharacter ) Yuan[37].innerText = Yuan[37].innerText.substr(1);
    while( Yuan[38].innerText.charAt(0) == unwantedCharacter ) Yuan[38].innerText = Yuan[38].innerText.substr(1);
    while( Yuan[39].innerText.charAt(0) == unwantedCharacter ) Yuan[39].innerText = Yuan[39].innerText.substr(1);
    while( Yuan[40].innerText.charAt(0) == unwantedCharacter ) Yuan[40].innerText = Yuan[40].innerText.substr(1);
    while( Yuan[41].innerText.charAt(0) == unwantedCharacter ) Yuan[41].innerText = Yuan[41].innerText.substr(1);
    while( Yuan[42].innerText.charAt(0) == unwantedCharacter ) Yuan[42].innerText = Yuan[42].innerText.substr(1);
    while( Yuan[43].innerText.charAt(0) == unwantedCharacter ) Yuan[43].innerText = Yuan[43].innerText.substr(1);
    while( Yuan[44].innerText.charAt(0) == unwantedCharacter ) Yuan[44].innerText = Yuan[44].innerText.substr(1);
    while( Yuan[45].innerText.charAt(0) == unwantedCharacter ) Yuan[45].innerText = Yuan[45].innerText.substr(1);
    while( Yuan[46].innerText.charAt(0) == unwantedCharacter ) Yuan[46].innerText = Yuan[46].innerText.substr(1);
    while( Yuan[47].innerText.charAt(0) == unwantedCharacter ) Yuan[47].innerText = Yuan[47].innerText.substr(1);
    while( Yuan[48].innerText.charAt(0) == unwantedCharacter ) Yuan[48].innerText = Yuan[48].innerText.substr(1);
    while( Yuan[49].innerText.charAt(0) == unwantedCharacter ) Yuan[49].innerText = Yuan[49].innerText.substr(1);
    while( Yuan[50].innerText.charAt(0) == unwantedCharacter ) Yuan[50].innerText = Yuan[50].innerText.substr(1);
    while( Yuan[51].innerText.charAt(0) == unwantedCharacter ) Yuan[51].innerText = Yuan[51].innerText.substr(1);

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
    Yuan[21].innerText = Yuan[21].innerText * YtoE + "€"
    Yuan[22].innerText = Yuan[22].innerText * YtoE + "€"
    Yuan[23].innerText = Yuan[23].innerText * YtoE + "€"
    Yuan[24].innerText = Yuan[24].innerText * YtoE + "€"
    Yuan[25].innerText = Yuan[25].innerText * YtoE + "€"
    Yuan[26].innerText = Yuan[26].innerText * YtoE + "€"
    Yuan[27].innerText = Yuan[27].innerText * YtoE + "€"
    Yuan[28].innerText = Yuan[28].innerText * YtoE + "€"
    Yuan[29].innerText = Yuan[29].innerText * YtoE + "€"
    Yuan[30].innerText = Yuan[30].innerText * YtoE + "€"
    Yuan[31].innerText = Yuan[31].innerText * YtoE + "€"
    Yuan[32].innerText = Yuan[32].innerText * YtoE + "€"
    Yuan[33].innerText = Yuan[33].innerText * YtoE + "€"
    Yuan[34].innerText = Yuan[34].innerText * YtoE + "€"
    Yuan[35].innerText = Yuan[35].innerText * YtoE + "€"
    Yuan[36].innerText = Yuan[36].innerText * YtoE + "€"
    Yuan[37].innerText = Yuan[37].innerText * YtoE + "€"
    Yuan[38].innerText = Yuan[38].innerText * YtoE + "€"
    Yuan[39].innerText = Yuan[39].innerText * YtoE + "€"
    Yuan[40].innerText = Yuan[40].innerText * YtoE + "€"
    Yuan[41].innerText = Yuan[41].innerText * YtoE + "€"
    Yuan[42].innerText = Yuan[42].innerText * YtoE + "€"
    Yuan[43].innerText = Yuan[43].innerText * YtoE + "€"
    Yuan[44].innerText = Yuan[44].innerText * YtoE + "€"
    Yuan[45].innerText = Yuan[45].innerText * YtoE + "€"
    Yuan[46].innerText = Yuan[46].innerText * YtoE + "€"
    Yuan[47].innerText = Yuan[47].innerText * YtoE + "€"
    Yuan[48].innerText = Yuan[48].innerText * YtoE + "€"
    Yuan[49].innerText = Yuan[49].innerText * YtoE + "€"
    Yuan[50].innerText = Yuan[50].innerText * YtoE + "€"
    Yuan[51].innerText = Yuan[51].innerText * YtoE + "€"

}