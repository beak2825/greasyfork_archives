// ==UserScript==
// @name		CCDarkMode
// @namespace	HPrivakosScripts
// @description	Change some styles in ChopCoin interface
// @author		HPrivakos
// @include		http://chopcoin.io/*
// @version		0.3
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/17131/CCDarkMode.user.js
// @updateURL https://update.greasyfork.org/scripts/17131/CCDarkMode.meta.js
// ==/UserScript==

addCSS();
ifDark();

setInterval(function(){ifDark();}, 100);

function addCSS(){
	var sheet = document.createElement('style')
	sheet.innerHTML = "#chopcoinlogonew {animation-name: animationcc;animation-duration: 3s;animation-delay: 1s;} #coindadiframe {animation: ads 2s infinite alternate} @keyframes animationcc {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}} @keyframes ads {0%  {transform: rotateY(0);} 100% {transform: rotateY(360);}}";
	document.body.appendChild(sheet);
}

function ifDark(){
	try{
	var wrap = document.getElementById("wrapper");
	if(document.body.className == "dark" || document.body.className == "dark interface_hidden" || document.body.className == "dark loading" ){
		if(document.body.className == "dark" && wrap.className != "dark"){wrap.style.filter = "hue-rotate(100deg) invert(1)";}
		else if(document.body.className == "dark interface_hidden"){wrap.style.filter = "hue-rotate(100deg) invert(1)"; wrap.style.display = "none";}
		else if(document.body.className == "dark loading"){wrap.style.filter = "hue-rotate(100deg) invert(1)";}
		
		wrap.className = "dark";
		//document.getElementById("chatroom").style.filter =  "hue-rotate(100deg) invert(1)";
		//document.getElementById("chatshowhide").style.filter =  "hue-rotate(100deg) invert(1)";
	}
	else {
		wrap.style.filter = "";
		wrap.className = "light";
	}
	}catch(err){console.log(err);}
}