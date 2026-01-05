// ==UserScript==
// @name        Distraction-free Tinychat
// @namespace   tinychat.com
// @description Eliminates everything from a Tinychat page except the chatroom
// @include     http://tinychat.com/*
// @include     https://tinychat.com/*
// @exclude     https?://tinychat.com/home
// @exclude     https?://tinychat.com/download
// @exclude     https?://tinychat.com/settings
// @exclude     https?://tinychat.com/login
// @exclude     /^https?://tinychat.com/.*//
// @version     0.3
// @downloadURL https://update.greasyfork.org/scripts/11553/Distraction-free%20Tinychat.user.js
// @updateURL https://update.greasyfork.org/scripts/11553/Distraction-free%20Tinychat.meta.js
// ==/UserScript==

function cleanPage() {
	//Remove ads:
	document.getElementById("right_block").remove();
	//Expand chat to fill space previously occupied by ads:
	document.getElementById("left_block").style.width = "100%";
	//Remove Tinychat navigation bar:
	document.getElementById("header").remove();
	//Remove social sharing bar:
	document.getElementById("share-bar").remove();
	//Remove room info:
	document.getElementById("room_header").remove();
	//Remove Tinychat copyright/TOS message:
	document.getElementById("footer").remove();
	//Remove blank space from bottom of page:
	document.getElementById("wrapper").style.paddingBottom = "0px";
	//NOTE: you have to resize the window to "kick" the chat window into filling the screen
	//Otherwise this padding will remain
}

GM_registerMenuCommand("Clean Page", cleanPage);

//Thanks to http://stackoverflow.com/a/18120786/1874170 for the following code:
Element.prototype.remove = function() {
	this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
	for(var i = this.length - 1; i >= 0; i--) {
		if(this[i] && this[i].parentElement) {
			this[i].parentElement.removeChild(this[i]);
		}
	}
}
