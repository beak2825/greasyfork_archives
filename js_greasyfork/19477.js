// ==UserScript==
// @name        GameFAQs Profile Avvy to Posts
// @author      Metallia
// @namespace   Cats
// @description Does a thing that the script name says it does
// @include     https://www.gamefaqs.com/boards/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19477/GameFAQs%20Profile%20Avvy%20to%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/19477/GameFAQs%20Profile%20Avvy%20to%20Posts.meta.js
// ==/UserScript==

// Feel free to edit, redistribute, all that good stuff.

var messageList = document.evaluate('//table[contains(@class,"board message")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
if (messageList !== null) {
	postsWithAvatars = document.evaluate('//td[contains(@class,"msg")]//img[@class="imgboxart"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var avvyImgs = new Array();
	var clearDivs = new Array();
	for (var i = 0; i < postsWithAvatars.snapshotLength; i++) {
		avvyImgs[i] = document.createElement('img');
		avvyImgs[i].setAttribute("src",postsWithAvatars.snapshotItem(i).getAttribute('src'));
		//avvyImgs[i].setAttribute("src","http://img.gamefaqs.net/avatar/0/0g_AeOdLxB.jpg"); // TEMP FOR TESTING
		avvyImgs[i].setAttribute("style","float: right !important; margin: 5px !important;");
		
		clearDivs[i] = document.createElement('div');
		clearDivs[i].setAttribute("style","clear: right !important;");
		
		var appendHere = postsWithAvatars.snapshotItem(i).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
		appendHere.appendChild(clearDivs[i]);
		appendHere.insertBefore(avvyImgs[i],appendHere.childNodes[0]);
	}
}