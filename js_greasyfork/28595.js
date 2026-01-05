
// ==UserScript==
// @name        Fix 1000 mile challenge start date
// @description Corrects the bug in displayed start date
// @namespace   jengolbeck.com
// @include     *
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28595/Fix%201000%20mile%20challenge%20start%20date.user.js
// @updateURL https://update.greasyfork.org/scripts/28595/Fix%201000%20mile%20challenge%20start%20date.meta.js
// ==/UserScript==

var yourStartDate = "01/01/2017"; //PUT YOUR START DATE HERE

function fixStart() {
 var divs=document.getElementsByClassName("f10 color-white ng-binding");
  for(i=0;i<divs.length;i++){
 
    if (i != -1 ){
      if (divs[i].innerHTML.indexOf("Current Challenge")>-1){
       divs[i].innerHTML="Current Challenge Start: " + yourStartDate;
      }
    }
  }
 }
window.setTimeout(fixStart, 1000);
