// ==UserScript==
// @name Shitbot
// @description Shitpostbot for discord
// @grant none
// @namespace xormak/discordpoop
// @include https://discordapp.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @run-at document-start
// @version 0.0.0.0.811
// @downloadURL https://update.greasyfork.org/scripts/17036/Shitbot.user.js
// @updateURL https://update.greasyfork.org/scripts/17036/Shitbot.meta.js
// ==/UserScript==

/* 
*
* CREATED BY XORMAK.DEVIANTART.COM
*
*/
var $ = window.jQuery;
var e = $.Event('keydown');
e.keyCode= 13; // enter

setInterval(function(){
	var day = new Date();
	var time = day.getHours();

	if (time > 0 && time < 6){

	} else if(time) {

	}
	$("textarea").html("hello world");
	$("textarea").trigger(e);
}, 1000);