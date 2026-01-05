// ==UserScript==
// @name        GameFAQs Profile Avvy to Posts
// @author      Metallia
// @namespace   Cats
// @description Does a thing that the script name says it does
// @include     http://www.gamefaqs.com/boards/*
// @version     1.3-kraust
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19518/GameFAQs%20Profile%20Avvy%20to%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/19518/GameFAQs%20Profile%20Avvy%20to%20Posts.meta.js
// ==/UserScript==

// Feel free to edit, redistribute, all that good stuff.
// Kraust just one line added by me.

var messageList = document.evaluate('//table[contains(@class,"board message")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
if (messageList !== null) {
	postsWithAvatars = document.evaluate('//td[contains(@class,"msg")]//ul[@data-img]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var avvyImgs = new Array();
	var clearDivs = new Array();
	for (var i = 0; i < postsWithAvatars.snapshotLength; i++) {
		avvyImgs[i] = document.createElement('img');
		avvyImgs[i].setAttribute("src",postsWithAvatars.snapshotItem(i).getAttribute('data-img'));
		avvyImgs[i].setAttribute("style","float: right !important; margin: 5px !important;");
		
		clearDivs[i] = document.createElement('div');
		clearDivs[i].setAttribute("style","clear: right !important;");
		
		var appendHere = postsWithAvatars.snapshotItem(i).parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
		appendHere.appendChild(clearDivs[i]);
		appendHere.insertBefore(avvyImgs[i],appendHere.childNodes[0]);
	}
    $(".board blockquote").css("margin-right", "115px");
    $(".board .board_poll").css("margin-right", "115px");
}