// ==UserScript==
// @name        removeFacebookSponsoredPosts
// @namespace   DT
// @description Remove facebook sponsored posts
// @include     https://www.facebook.com/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34722/removeFacebookSponsoredPosts.user.js
// @updateURL https://update.greasyfork.org/scripts/34722/removeFacebookSponsoredPosts.meta.js
// ==/UserScript==

var DT = {};

DT._ticking = false;

DT.main = function(){
	var links = document.getElementsByTagName("A");
	var totalLinks = links.length;
	for(var i = 0; i < totalLinks; i++){
		var item = links.item(i);
		if(item && item.textContent === 'Sponsored'){
			var parent = item.closest('div[id^="substream_"]');
			if(parent){
				parent.parentNode.removeChild(parent);
				console.log('Removed sponsored post');
			}
		}
	}
};

DT._tick = function(){
	if(!DT._ticking){
		window.setTimeout(function(){
			DT.main();
			DT._ticking = false;
		}, 3000);
	}
	DT._ticking = true;
};

document.addEventListener("DOMContentLoaded", DT._tick);
window.addEventListener('scroll', DT._tick);
