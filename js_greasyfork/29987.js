// ==UserScript==
// @name           Neopets: Tyranu Evavu AP
// @namespace      http://tampermonkey.net/
// @description    Plays Tyranu Evavu and alerts if you go over 15 correct guesses.
// @author         Nyu (clraik)
// @version        0.1
// @include        http://www.neopets.com/games/tyranuevavu.phtml*
// @downloadURL https://update.greasyfork.org/scripts/29987/Neopets%3A%20Tyranu%20Evavu%20AP.user.js
// @updateURL https://update.greasyfork.org/scripts/29987/Neopets%3A%20Tyranu%20Evavu%20AP.meta.js
// ==/UserScript==

/////////////////////////////////////////////////////////////////////////////
// Set min and max to wait between clicks.
var minToWait=100;//100 = 0.1 second
var maxToWait=10000;//10000 = 10 seconds

var random=false;//If set to true it will select tyranu/evavu at random.

tyranuWhen=["2","3","4","5","6","7"];//When to click higher
evavuWhen=["8","9","10","11","12","13","14"];//When to click lower
// 11 = J    12 = Q    13 = K    14 = A

/////////////////////////////////////////////////////////////////////////////




var wait=Math.floor(Math.random() * (maxToWait - minToWait + 1)) + minToWait;//This will generate a random number between min and max

setTimeout(function(){ $("[value='Play Now!']").click();},wait);
var cont=$("[class='content']")[0].innerHTML;

if (cont.includes("Ugavu drecka")){
	if (!random){
		var card=$('img[border="1"][width="70"][height="90"]')[0].outerHTML.toString();
		for(var i in tyranuWhen){
			if(card.includes("cards/"+tyranuWhen[i]+"_")){
				setTimeout(function(){$('img[src="http://images.neopets.com/prehistoric/tyranu.gif"]').click();},wait);
			}
		}
		for(var i in evavuWhen){
			if(card.includes("cards/"+evavuWhen[i]+"_")){
				setTimeout(function(){$('img[src="http://images.neopets.com/prehistoric/evavu.gif"]').click();},wait);
			}
		}
	}else{
		var r=Math.floor(Math.random() * (100 - 1 + 1)) + 1;
		if(r%2==0){
			setTimeout(function(){$('img[src="http://images.neopets.com/prehistoric/tyranu.gif"]').click();},wait);
		}else{
			setTimeout(function(){$('img[src="http://images.neopets.com/prehistoric/evavu.gif"]').click();},wait);
		}
	}
}

setTimeout(function(){$("[value='Play Again']").click();},wait);

if (cont.includes("Ugavu drecka 16")){
	alert("Avatar!");
}