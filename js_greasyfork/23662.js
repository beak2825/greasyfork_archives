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
// @downloadURL https://update.greasyfork.org/scripts/23662/CustomChat%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/23662/CustomChat%20v2.meta.js
// ==/UserScript==

function chatBot() {
	
	// current user input
	this.input;
	
	/**
	 * respondTo
	 * 
	 * return nothing to skip response
	 * return string for one response
	 * return array of strings for multiple responses
	 * 
	 * @param input - input chat string
	 * @return reply of chat-bot
	 */
	this.respondTo = function(input) {
	
		this.input = input.toLowerCase();
		
		if(this.match('(hi|hello|hey|hola|howdy)(\\s|!|\\.|$)'))
			return "um... hi?";
		
		if(this.match('what[^ ]* up') || this.match('sup') || this.match('how are you'))
			return "this github thing is pretty cool, huh?";
		
		if(this.match('l(ol)+') || this.match('(ha)+(h|$)') || this.match('lmao'))
			return "what's so funny?";
		
		if(this.match('^no+(\\s|!|\\.|$)'))
			return "don't be such a negative nancy :(";
		
		if(this.match('(cya|bye|see ya|ttyl|talk to you later)'))
			return ["alright, see you around", "good teamwork!"];
		
		if(this.match('(dumb|stupid|is that all)'))
			return ["hey i'm just a proof of concept", "you can make me smarter if you'd like"];
		
		if(this.input == 'noop')
			return;
		
		return input + " what?";
	}
	
	/**
	 * match
	 * 
	 * @param regex - regex string to match
	 * @return boolean - whether or not the input string matches the regex
	 */
	this.match = function(regex) {
	
		return new RegExp(regex).test(this.input);
	}
}