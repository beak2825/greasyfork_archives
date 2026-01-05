// ==UserScript==
// @name        CustomChat v2 
// @description Un script pour customiser la shoutbox de PMT !
// @include     https://realitygaming.fr/
// @include     https://realitygaming.fr/
// @include     https://realitygaming.fr/
// @include     https://realitygaming.fr/
// @include     https://realitygaming.fr/chatbox/
// @include     https://realitygaming.fr/chatbox/
// @include     https://realitygaming.fr/chatbox/
// @include     https://realitygaming.fr/chatbox/
// @version     2.0
// @grant       none
// @namespace https://greasyfork.org/users/47201
// @downloadURL https://update.greasyfork.org/scripts/23663/CustomChat%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/23663/CustomChat%20v2.meta.js
// ==/UserScript==

$(function() {

	// chat aliases
	var you = 'You';
	var robot = 'Buddy';
	
	// slow reply by 400 to 800 ms
	var delayStart = 400;
	var delayEnd = 800;
	
	// initialize
	var bot = new chatBot();
	var chat = $('.chat');
	var waiting = 0;
	$('.busy').text(robot + ' is typing...');
	
	// submit user input and get chat-bot's reply
	var submitChat = function() {
	
		var input = $('.input input').val();
		if(input == '') return;
		
		$('.input input').val('');
		updateChat(you, input);
		
		var reply = bot.respondTo(input);
		if(reply == null) return;
		
		var latency = Math.floor((Math.random() * (delayEnd - delayStart)) + delayStart);
		$('.busy').css('display', 'block');
		waiting++;
		setTimeout( function() {
			if(typeof reply === 'string') {
				updateChat(robot, reply);
			} else {
				for(var r in reply) {
					updateChat(robot, reply[r]);
				}
			}
			if(--waiting == 0) $('.busy').css('display', 'none');
		}, latency);
	}
	
	// add a new line to the chat
	var updateChat = function(party, text) {
	
		var style = 'you';
		if(party != you) {
			style = 'other';
		}
		
		var line = $('<div><span class="party"></span> <span class="text"></span></div>');
		line.find('.party').addClass(style).text(party + ':');
		line.find('.text').text(text);
		
		chat.append(line);
		
		chat.stop().animate({ scrollTop: chat.prop("scrollHeight")});
	
	}
	
	// event binding
	$('.input').bind('keydown', function(e) {
		if(e.keyCode == 13) {
			submitChat();
		}
	});
	$('.input a').bind('click', submitChat);
	
	// initial chat state
	updateChat(robot, 'Hi there. Try typing something!');

});