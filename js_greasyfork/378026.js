// ==UserScript==
// @name         Regrade 3.5
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Eternal or no balls :D
// @author       Otu
// @match        *archeage.mmodex.com/archeage-regrade-simulator/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378026/Regrade%2035.user.js
// @updateURL https://update.greasyfork.org/scripts/378026/Regrade%2035.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';



$(document).ready(function(){
   function updateRG(){
       if ($('div.rgitem').length >= 24){
           var chanceOrgC = document.getElementsByClassName("rgitem")[0];
           var chanceOrg = chanceOrgC.getAttribute("grade");
           var TierOrg = chanceOrgC.getAttribute("tier");
           var charmOrgC = document.getElementsByClassName("rgcharm")[0];
           var charmOrg = charmOrgC.getAttribute("cpwr");
           if (chanceOrg != null){
               if (chanceOrg === '1'){//basic -> grand
                   var chanceE = 1000;
                   var chanceN = 1000;
                   var chanceH = 1000;
                   var chanceS = 1000;
               }else if (chanceOrg === '2'){//grand -> rare
                   var chanceE = 1000;
                   var chanceN = 1000;
                   var chanceH = 1000;
                   var chanceS = 1000;
               }else if (chanceOrg === '3'){//rare -> arcane
                   var chanceE = 1000;
                   var chanceN = 1000;
                   var chanceH = 1000;
                   var chanceS = 600;
               }else if (chanceOrg === '4'){//arcane -> heroic
                   var chanceE = 675;
                   var chanceN = 500;
                   var chanceH = 325;
                   var chanceS = 600;
               }else if (chanceOrg === '5'){//heroic -> unique
                   var chanceE = 675;
                   var chanceN = 500;
                   var chanceH = 325;
                   var chanceS = 600;
               }else if (chanceOrg === '6'){//unique -> celestial
                   var chanceE = 473;
                   var chanceN = 350;
                   var chanceH = 228;
                   var chanceS = 500;
               }else if (chanceOrg === '7'){//celestial -> divine
                   var chanceE = 405;
                   var chanceN = 300;
                   var chanceH = 195;
                   var chanceS = 500;
               }else if (chanceOrg === '8'){//divine -> epic
                   var chanceE = 135;
                   var chanceN = 100;
                   var chanceH = 65;
                   var chanceS = 400;
               }else if (chanceOrg === '9'){//epic -> legendary
                   var chanceE = 108;
                   var chanceN = 80;
                   var chanceH = 52;
                   var chanceS = 350;
               }else if (chanceOrg === '10'){//legendary -> mythic
                   var chanceE = 41;
                   var chanceN = 30;
                   var chanceH = 20;
                   var chanceS = 175;
               }else if (chanceOrg === '11'){//mythic -> eternal
                   var chanceE = 27;
                   var chanceN = 20;
                   var chanceH = 13;
                   var chanceS = 88;
               }
               var chanceF = 1;
               if (TierOrg == '1'){
                   var chanceF = chanceE;
               }else if (TierOrg == '2'){
                   var chanceF = chanceN;
               }else if (TierOrg == '3'){
                   var chanceF = chanceH;
               }else if (TierOrg == '4'){
                   var chanceF = chanceS;
               }
               if($('div.rgcharm').length >= 8){
                  var chanceC = chanceF * charmOrg;
               }else {
                   var chanceC = chanceF;
               }
               if (chanceC >= 1000){
                   var chanceC = 1000;
               }
               upchance = chanceC;
               $("#rg-chance").html(""+(upchance/10)+"%(-)");
           }
       }
       setTimeout(updateRG, 10);
   }
   document.title = 'ArcheRage 3.5 Regrade Simulator (by Otu)';
   const h1 = document.getElementsByTagName("h1")[0];
   h1.innerHTML = 'ArcheRage 3.5 Regrade Simulator (by Otu)';
   const logo = document.getElementsByClassName("site-logo")[0];
   logo.innerHTML = '<img src="https://ru.archerage.to/forums/logo.png">';
   setTimeout(updateRG, 10);
});