// ==UserScript==
// @name         Everyone Is Here Chat Meme Mode
// @namespace    https://everyone-is-here-chat.cyclopsdude.repl.co/main/
// @version      1.0.2
// @description  Meme Mode (duh)
// @author       Konghe Won
// @match        https://everyone-is-here-chat.cyclopsdude.repl.co/main/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409914/Everyone%20Is%20Here%20Chat%20Meme%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/409914/Everyone%20Is%20Here%20Chat%20Meme%20Mode.meta.js
// ==/UserScript==

(function() {
	'use strict';
	document.getElementsByTagName("body")[0].style["background-color"] = "pink";
	var i = 0;
	while(i < document.getElementsByTagName("p").length){
		document.getElementsByTagName("p")[i].style["font-family"] = "Comic Neue";
		i++
	}
	var x = 0;
	while(x < document.getElementsByTagName("h1").length){
		document.getElementsByTagName("h1")[x].style["font-family"] = "Comic Neue";
		x++
	}
	var y = 0;
	while(y < document.getElementsByTagName("h2").length){
		document.getElementsByTagName("h2")[y].style["font-family"] = "Comic Neue";
		y++
	}
	var z = 0;
	while(z < document.getElementsByTagName("h3").length){
		document.getElementsByTagName("h3")[z].style["font-family"] = "Comic Neue";
		z++
	}
	var memes = ["https://media.tenor.com/images/fc92efec2812361bfdcaa29e0ae5e012/tenor.gif","https://vignette.wikia.nocookie.net/surrealmemes/images/0/09/Meme_Man_HD.png/revision/latest?cb=20190103112747","https://ruinmyweek.com/wp-content/uploads/2020/06/wait-it-37-astronaut-with-a-gun-memes-always-has-been-21.jpg","https://wompampsupport.azureedge.net/fetchimage?siteId=7575&v=2&jpgQuality=100&width=700&url=https%3A%2F%2Fi.kym-cdn.com%2Fentries%2Ficons%2Ffacebook%2F000%2F022%2F937%2Ftumblr_om45kmphwg1vmzyato1_1280.jpg","https://www.kindpng.com/picc/m/707-7071194_meme-memexd-memes-shrek-shrekmeme-mikewazowski-shrek-mike.png"]
	var randomnum = Math.round(Math.random()*(memes.length-1));
	document.getElementsByTagName("h1")[0].innerText = "You're a meme °¿°";
	document.getElementsByTagName("img")[0].src = memes[randomnum];
})();