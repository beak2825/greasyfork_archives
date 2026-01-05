// ==UserScript==
// @name        removeFacebookSuggestedPosts
// @namespace   DT
// @description Remove facebook suggested posts and games
// @include     https://www.facebook.com/
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22165/removeFacebookSuggestedPosts.user.js
// @updateURL https://update.greasyfork.org/scripts/22165/removeFacebookSuggestedPosts.meta.js
// ==/UserScript==

var DT = {};

DT._ticking = false;
DT._unwanted = ['Suggested Post', 'Suggested Game'];

DT.main = function(){
	var spans = document.getElementsByTagName("SPAN");
	var totalSpans = spans.length;
	for(var i = 0; i < totalSpans; i++){
		var item = spans.item(i);
		if(item && DT._unwanted.indexOf(item.textContent) > -1){
			var parent = item.parentNode.parentNode.parentNode.parentNode.parentNode;
			if(parent){
				parent.parentNode.removeChild(parent);
				console.log('Removed suggested post');
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
