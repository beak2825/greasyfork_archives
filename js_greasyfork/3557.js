// ==UserScript==
// @name            FeedlyTool mini Remove ADs
// @version         0.0.3
// @author          kik0220
// @namespace       https://sites.google.com/site/feedlytool/
// @description     This is the edition that was limited to ads remove feature Chrome extension of "FeedlyTool".
// @description:ja  Chrome拡張「FeedlyTool」の広告削除機能に限定したものです。
// @icon            http://feedlytool.kk22.jp/icon.png
// @match           http://feedly.com/*
// @match           https://feedly.com/*
// @exclude         http://feedly.com/i/welcome
// @exclude         https://feedly.com/i/welcome
// @exclude         http://feedly.com/i/discover
// @exclude         https://feedly.com/i/discover
// @copyright       2013+, kik0220
// @downloadURL https://update.greasyfork.org/scripts/3557/FeedlyTool%20mini%20Remove%20ADs.user.js
// @updateURL https://update.greasyfork.org/scripts/3557/FeedlyTool%20mini%20Remove%20ADs.meta.js
// ==/UserScript==
var adsKeyword = new RegExp("(PR\\s*[:：]|AD\\s*[:：]|[［\\[]\\s*PR\\s*[\\]］])", "i");
main();

function main(){
	document.body.addEventListener("DOMNodeInserted", function (e){
		var entry = e.target;
		try {
			if(entry.className && entry.className != 'undefined'){
				if (entry.className.indexOf('content') > -1) {
					var title = entry.getElementsByClassName('title')[0];
					if(title && tile != 'undefined') {
						adsRemove(entry, title);
					}
				}
			}
		} catch (e2) {}
	}, false);
}

function adsRemove(entry, title){
	try {if (!title.toUpperCase().match(adsKeyword)) {return;}} catch(e) {return;}
	var close = entry.querySelectorAll('button.icon-fx-cross-ios-sm-black')[0];
	try { close.click(); } catch(e) {}
}