// ==UserScript==
// @name        Xenforo Invis-Text Multi-Reveal
// @namespace   com.user.twixion
// @description This script adds a button to reveal invisible text. The button is placed under a poster's avatar, and will only be displayed if there is transparent text in the post. Also, a dotted grey border is placed around any invisible text to denote its presence.
// @include     /^https?://forums\.(spacebattles|sufficientvelocity)\.com/(threads|conversations)/.*$/
// @include	 https://forum.questionablequesting.com/*
// @version     2.3
// @grant       none
// @history		2.3 bugfix: changed search for transparency to be case-insensitive
// @history		2.2 added include for https
// @history		2.1 bugfix: search string now case insensitive, used jquery instead of injecting JS into page
// @history		2.0 major rewrite to consolidate buttons, renamed
// @history		1.0 initial public version

// @downloadURL https://update.greasyfork.org/scripts/16483/Xenforo%20Invis-Text%20Multi-Reveal.user.js
// @updateURL https://update.greasyfork.org/scripts/16483/Xenforo%20Invis-Text%20Multi-Reveal.meta.js
// ==/UserScript==

// grab id from button, test if there exists any spans with "transparent" (case-insensitive)
// in the style and sets color to grey. If no match found, set to color "transparent"
function toggleVisibility() {
	var id = $(this).attr('id');
	var strPostID = "span.".concat(id);
	if($(strPostID).filter(function(){
		// regex test "transparent", case-insensitive
		return /transparent/i.test($(this).attr('style'));
	}).length > 0){$(strPostID).css("color","red");}
	else {$(strPostID).css("color","transparent");}
}

// inject css style to page;
// spoilerShow not currently used, spoilerHide puts a dotted border around element
(function() {
var injectedCSS = document.createElement('style');
injectedCSS.appendChild(document.createTextNode(
".spoilerShow {color:#FF0000!important;}\
 .spoilerHide {border: 1px dotted grey!important;}\
 .spoilerHide:hover{color: #FF0000!important;}\
 "));
(document.body || document.head || document.documentElement).appendChild(injectedCSS);
})();

function createSpoilerButton(){
	// create id variable if doesn't exist
	if(typeof createSpoilerButton.id == 'undefined'){createSpoilerButton.id = 0;}
	
	// var id = createSpoilerButton.id;
	var strPostID = "post_id_";
	// only create button if post contains transparent text
	if($(this).find("span").filter(function(){
		// regex test "transparent", case-insensitive
		return /transparent/i.test($(this).attr('style'));
	}).length > 0){
		newButton = document.createElement("button");
		buttonText = document.createTextNode("Toggle Invis-text");
		newButton.setAttribute('type','button');
		newButton.setAttribute('id',strPostID.concat(createSpoilerButton.id));
		newButton.setAttribute('class','invisButton');
		newButton.appendChild(buttonText);
		$(this).find("div.messageUserBlock").append(newButton);
		$(this).find("span").filter(function(){return /transparent/i.test($(this).attr('style'));}).addClass(strPostID.concat(createSpoilerButton.id));
		createSpoilerButton.id++;
	}
};

$(document).ready(function(){
	$("span").filter(function(){
		// regex test "transparent", case-insensitive
		return /transparent/i.test($(this).attr('style'));
	}).addClass('spoilerHide');
	$("li.message").each(createSpoilerButton);
	$("button.invisButton").click(toggleVisibility);
});