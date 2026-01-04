// ==UserScript==
// @name         Macros for Agariotime
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  a to 64-split, s to freeze, d to doublesplit, c to quadsplit, and e to autoFeed
// @author       Nathan Ramanathan (Nathan^2)
// @match        http://agariotime.com/*
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/375297/Macros%20for%20Agariotime.user.js
// @updateURL https://update.greasyfork.org/scripts/375297/Macros%20for%20Agariotime.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onMouseMove);

var gameAvoidAccidentalFreeze = ['chat_textbox', 'nick'];  //these active elements ids with these names will not trigger macros accidentally
var deathScreen = document.getElementById('overlays');
var Feed = false;
var Frozen = false;
var myKeys = [
	{key:65,isDown:false, repeat: 20, delay: 15}, // 64 split
	{key:68,isDown:false, repeat: 1, delay: 60}, // doublesplit
	{key:67,isDown:false, repeat: 2, delay: 70}  // QuadSplit
];

function keydown(event) {
	//Handles SpaceBar Macros
	for(var i = 0; i < myKeys.length; i++){
		if(!myKeys[i].isDown && event.keyCode == myKeys[i].key){
			myKeys[i].isDown = true;
			Repeat(myKeys[i].repeat, myKeys[i].delay);
			return;
		}
	}

	//Handles other keypresses that are NOT macros for the spacebar
	switch(event.keyCode){
		case 69: //autofeed
		Feed = true;
		setTimeout(feedMacro, 25);
		break;
		case 83:  //'s' key, Freeze
		for(var i = 0; i < gameAvoidAccidentalFreeze.length; i++){  //We need to check if we are in the game, or simply chatting
			if(document.activeElement === document.getElementById(gameAvoidAccidentalFreeze[i])){
				return;  //if we are chatting, then avoid the macros
			}
		}
		Frozen = !Frozen;
		onMouseMove();
		break;
		case 13:
		onMouseMove();
		break;
	}
}

function keyup(event) {  //prevents you from accidentally holding the macros buttons
	if (event.keyCode == 69) {
		Feed = false;
	}

	for(var i = 0; i < myKeys.length; i++){
		if(event.keyCode == myKeys[i].key){
			myKeys[i].isDown = false;
			return;
		}
	}
}
// Feed Macro With E
function feedMacro() {
	if (Feed) {
		window.onkeydown({keyCode: 87});
		window.onkeyup({keyCode: 87});
		setTimeout(feedMacro, 25);
	}
}
function TriggerSpaceKey() {
	$("body").trigger($.Event("keydown", { keyCode: 32}));
	$("body").trigger($.Event("keyup", { keyCode: 32}));
}
function Repeat(repeat, timeout){
	TriggerSpaceKey();
	for (var i = 1; i <= repeat; i++) {
		setTimeout(TriggerSpaceKey, timeout*i);
	}
}
function onMouseMove(){
	if(deathScreen.style.display === 'block'){  //return true when display is the deathScreen
		Frozen = false;
	}
	if(Frozen){
		$("canvas").trigger($.Event("mousemove", {clientX: window.innerWidth/2, clientY: window.innerHeight/2}));
	}
}
