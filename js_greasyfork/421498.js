// ==UserScript==
// @name Telegram Auto Spammer
// @copyright SilkArt (GitHub)
// @license MIT
// @description Allows you to spam in chat on Telegram
// @match https://web.telegram.org/
// @match https://web.telegram.org/*
// @version 0.0.1.20210209234834
// @namespace https://greasyfork.org/users/736156
// @downloadURL https://update.greasyfork.org/scripts/421498/Telegram%20Auto%20Spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/421498/Telegram%20Auto%20Spammer.meta.js
// ==/UserScript==
var message = prompt("Message:");
var interval = prompt("Messages interval:") ; 
var count = prompt("Messages count:") ; 
var notifyInterval = prompt("Notification interval:") ;  
var i = 0 ;
var timer = setInterval(function(){
	document.getElementsByClassName('composer_rich_textarea')[0].innerHTML = message;
	$('.im_submit').trigger('mousedown');	
	i++;
	if( i  == count )
	clearInterval(timer);
	if( i % notifyInterval == 0)
	console.log(i + ' MESSAGES SENT');
} , interval * 1000 ) ;