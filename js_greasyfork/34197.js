// ==UserScript==
// @name Noodles's Membean Autoanswer
// @namespace noodleshub.com
// @version 1
// @description Noodles's Membean Hack
// @author Noodles
// @match *://membean.com/training_sessions/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/34197/Noodles%27s%20Membean%20Autoanswer.user.js
// @updateURL https://update.greasyfork.org/scripts/34197/Noodles%27s%20Membean%20Autoanswer.meta.js
// ==/UserScript==
var meta = document.createElement('meta');
meta.httpEquiv = "refresh";
meta.content = "6";
document.getElementsByTagName('head')[0].appendChild(meta);
function sleep(milliseconds) 
{ 
	var start = new Date().getTime(); 
	for (var i = 0; i < 1e7; i++) 
		if ((new Date().getTime() - start) > milliseconds)
			break; 
}
setTimeout(function(){
if(document.getElementsByClassName("choice answer").length > 0){
	sleep(2000);
    document.getElementsByClassName("choice answer")[0].click();
}

if(document.getElementById("next-btn")){
    document.getElementById("next-btn").click()
}
var choice = Math.floor(Math.random()*100) < 93;
if(choice){
    document.querySelectorAll("input[value=Pass]")[0].click();
}else{
    document.querySelectorAll("input[value=Fail]")[0].click();
}
}, 1000);