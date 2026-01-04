// ==UserScript==
// @name        Mobile Result Page Cleanup
// @namespace   s
// @include     https://suchen.mobile.de/fahrzeuge/search.html*
// @version     1.1
// @grant       none
// @description This script filters highlighted (advertised) offers in mobile.de result pages and sorts them ascending by price.
// @downloadURL https://update.greasyfork.org/scripts/39189/Mobile%20Result%20Page%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/39189/Mobile%20Result%20Page%20Cleanup.meta.js
// ==/UserScript==

window.onload = function () {
  var divs = document.querySelectorAll('div.cBox-body--similarSellerAds, div.cBox-body--topInCategory, div.cBox-body--topResultitem, div.cBox-body--eyeCatcher');
  for(var i=0; i<divs.length; i++) {
     divs[i].style.display = "none";
     //divs[i].style.opacity = "0.1";
  }
  var sel = document.getElementById('so-sb');

  var needs_reload = sel.options[sel.selectedIndex].text != 'Preis aufsteigend';
  
  // fire form
  if(needs_reload){
    var l = sel.options.length;
    for (var i = 0; i < l; i++) {
       if (sel.options[i].text == 'Preis aufsteigend') {
         sel.options[i].selected = true;
         sel.onChange();       
       }
    }
  }
}
