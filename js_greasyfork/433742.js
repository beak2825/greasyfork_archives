// ==UserScript==
// @name         Jojos EpikChat auto scroll
// @namespace    https://greasyfork.org/users/393739-jojoooooo
// @version      1.5
// @description  Fix for the scroll bug on EpikChat
// @author       Jojoooooo
// @match        https://www.epikchat.com/chat
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433742/Jojos%20EpikChat%20auto%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/433742/Jojos%20EpikChat%20auto%20scroll.meta.js
// ==/UserScript==

//Initialize chat element
const messagesElement = document.getElementById('messagesLS');

//Set defaults
var previousScrollPos = messagesElement.scrollTop;
var currentScrollPos = messagesElement.scrollTop;

//Auto reset scroll position to 0 when overscrolling happens
function updateScroll(){
	currentScrollPos = messagesElement.scrollTop;
	if(currentScrollPos > previousScrollPos){
		if(currentScrollPos > 0){
			messagesElement.scrollTop = 0;
		}
	}
	previousScrollPos = messagesElement.scrollTop
}

//Add event listener to trigger function when scrolling
messagesElement.addEventListener('scroll', function(e) {
	updateScroll();
});