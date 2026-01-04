// ==UserScript==
// @name         Neopets: Gormball AP
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Plays gormball for you
// @author       Nyu (clraik)
// @match        http://www.neopets.com/space/gormball*
// @downloadURL https://update.greasyfork.org/scripts/30371/Neopets%3A%20Gormball%20AP.user.js
// @updateURL https://update.greasyfork.org/scripts/30371/Neopets%3A%20Gormball%20AP.meta.js
// ==/UserScript==

// Set min and max to wait between clicks.
var minToWait=100;//100 = 0.1 second
var maxToWait=5000;//5000 = 5 seconds
var wait=Math.floor(Math.random() * (maxToWait - minToWait + 1)) + minToWait; //This will generate a random number between min and max


if(document.URL.indexOf("space/gormball.phtml") != -1) {
	var r=Math.floor(Math.random() * (8 - 1 + 1)) + 1;// Generate a random number
	$('select[name="player_backed"] option:eq('+r+')').attr('selected', 'selected');// Selects a random player
	setTimeout(function(){ $("[value='Plaaay Ball!']").click();},wait);// Play!
}
if(document.URL.indexOf("space/gormball2.phtml") != -1) {
	var cont=$("[class='content']")[0].outerHTML.toString();
	if (cont.includes("errorOuter")){
		location.href = "http://www.neopets.com/space/gormball.phtml";
	}
	$('select[name="turns_waited"] option:eq(1)').attr('selected', 'selected');// Selects 2 seconds
	setTimeout(function(){ $("[value='Next >>>']").click();},wait);
	setTimeout(function(){ $("[value='Continue!']").click();},wait);
	setTimeout(function(){ $("[value='Throw!']").click();},wait);
	setTimeout(function(){ $("[value='Play Again']").click();},wait);
}
