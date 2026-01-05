// ==UserScript==
// @name         Neopets: Dice-a-roo autoplayer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Plays dice a roo until jackpot, silver dice or when your pet gets bored.
// @author       Nyu (clraik)
// @match        http://www.neopets.com/games/*
// @downloadURL https://update.greasyfork.org/scripts/29567/Neopets%3A%20Dice-a-roo%20autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/29567/Neopets%3A%20Dice-a-roo%20autoplayer.meta.js
// ==/UserScript==


//Change these to the range you want it to wait before clicking the buttons.
var minToWait=100;//100 = 0.1 second
var maxToWait=5000;//5000 = 5 seconds
//1000 = 1 second
var stopAtSilver=true;//set to false if you want to continue after getting to silver dice


var wait=Math.floor(Math.random() * (maxToWait - minToWait + 1)) + minToWait;//This will generate a random number between min and max

if(document.URL.indexOf("games/dicearoo.phtml") != -1) {
	setTimeout(function(){ $("[value='Lets Play! (Costs 5 NP)']").click();},wait);
}
if(document.URL.indexOf("games/play_dicearoo.phtml") != -1) {
	setTimeout(function(){ $("[value='Play Dice-A-Roo']").click();},wait);
	var cont=$("[class='content']")[0].outerHTML.toString();
	if (cont.includes("JACKPOT")){
		alert("You won the jackpot!");
	}
	if (stopAtSilver==true&&cont.includes("Silver Dice-A-Roo")){
		alert("Reached Silver Dice-A-Roo ");
	}
	if (cont.includes("errorOuter")){
		location.href = "http://www.neopets.com/games/dicearoo.phtml";
	}
	
	setTimeout(function(){ $("[value='Roll Again']").click();},wait);
	setTimeout(function(){ $("[value='Press Me']").click();},wait);
}