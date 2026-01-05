// ==UserScript==
// @name        Remove Political Posts From Facebook
// @description This takes political-ish posts on Facebook and hides them so you just see a white box. useful when you need a break from everything but cute animal videos. Currently hides posts with the following words:  Drumpf Trump Clinton elect (and all variations) hate debate shooting
// @namespace   jengolbeck.com
// @include     *
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23535/Remove%20Political%20Posts%20From%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/23535/Remove%20Political%20Posts%20From%20Facebook.meta.js
// ==/UserScript==

function hide_political() {

divs=document.getElementsByClassName("_5pbx userContent");
  for(i=0;i<divs.length;i++)
  {if (divs[i].innerHTML.toLowerCase().indexOf('Trump') != -1 || divs[i].innerHTML.toLowerCase().indexOf('Clinton') != -1 || divs[i].innerHTML.toLowerCase().indexOf(' elect') != -1|| divs[i].innerHTML.toLowerCase().indexOf('shooting') != -1 || divs[i].innerHTML.toLowerCase().indexOf('Drumpf') != -1 || divs[i].innerHTML.toLowerCase().indexOf(' hate') != -1 || divs[i].innerHTML.toLowerCase().indexOf(' debate') != -1 || divs[i].innerHTML.toLowerCase().indexOf('shooting') != -1 )
   {divs[i].parentNode.parentNode.style.visibility='hidden';
   }
  }
}
window.setInterval(function(){
  hide_political();
}, (5000));