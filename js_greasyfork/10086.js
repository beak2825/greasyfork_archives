// ==UserScript==
// @name        Neopets - Turmaculus Auto Select
// @namespace   Jarofgrease.captainmaxthecat.com
// @description Automatically selects a random option for the turmaculus and continues on neopets.com
// @author 		Demeiz
// @email 		admin@captainmaxthecat.com
// @homepage	http://www.captainmaxthecat.com
// @version		1
// @language	en
// @include		http://www.neopets.com/medieval/turmaculus.phtml
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/10086/Neopets%20-%20Turmaculus%20Auto%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/10086/Neopets%20-%20Turmaculus%20Auto%20Select.meta.js
// ==/UserScript==

(function(){

var loc = document.location.href;

if (loc.match('neopets.com/medieval/turmaculus.phtml')){
  var goin = document.getElementsByName('wakeup')[0];
  if (goin){
    goin.options.selectedIndex = Math.floor((Math.random() * 10) + 1);
  }
  butval = document.evaluate("//input[@value='Wake Up!']", document, null,7, null);
doclick = butval.snapshotItem(0);
doclick.click();
  return;
}

})();