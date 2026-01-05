// ==UserScript==
// @name        Neopets - Nerkmid Auto-Player
// @namespace   Jarofgrease.captainmaxthecat.com
// @description Plays the nerkmid machine automatically, using random options
// @author 		Demeiz
// @email 		admin@captainmaxthecat.com
// @homepage	http://www.captainmaxthecat.com
// @version		1
// @language	en
// @include *neopets.com/vending*
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/10083/Neopets%20-%20Nerkmid%20Auto-Player.user.js
// @updateURL https://update.greasyfork.org/scripts/10083/Neopets%20-%20Nerkmid%20Auto-Player.meta.js
// ==/UserScript==

(function(){

var loc = document.location.href;

// click button to start
if (loc.match('neopets.com/vending.phtml')){
	onward = document.evaluate("//input[@value='Press me to Continue!']", document, null,7, null);
	doclick = onward.snapshotItem(0);
	doclick.click();
return;
}

// auto complete the form values on the page with random
// then click to accept
if (loc.match('neopets.com/vending2.phtml')){
  var goin = document.getElementsByName('nerkmid_id')[0];
  if (goin){
    goin.options.selectedIndex = Math.floor((Math.random() * 1) + 1);
  }
    var goin1 = document.getElementsByName('large_button')[0];
  if (goin1){
    goin1.options.selectedIndex = Math.floor((Math.random() * 3) + 1);
  }
    var goin2 = document.getElementsByName('small_button')[0];
  if (goin2){
    goin2.options.selectedIndex = Math.floor((Math.random() * 6) + 1);
  }
    var goin3 = document.getElementsByName('button_presses')[0];
  if (goin3){
    goin3.options.selectedIndex = Math.floor((Math.random() * 5) + 1);
  }
    var goin4 = document.getElementsByName('lever_pulls')[0];
  if (goin4){
    goin4.options.selectedIndex = Math.floor((Math.random() * 6) + 1);
  }
  butval = document.evaluate("//input[@value='GO!!!']", document, null,7, null);
doclick = butval.snapshotItem(0);
doclick.click();
  return;
}

// replay after complete
if (loc.match('neopets.com/vending3.phtml')){
	again = document.evaluate("//input[@value='Play Again!']", document, null,7, null);
	doclick = again.snapshotItem(0);
	doclick.click();
return;
}

})();