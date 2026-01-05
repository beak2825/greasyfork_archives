// ==UserScript==
// @name        HF Give Reputation On Thread
// @description Adds a '+' next to an user's reputation
// @include     *http://hackforums.net/showthread.php*
// @version     1.0
// @namespace https://greasyfork.org/users/24272
// @downloadURL https://update.greasyfork.org/scripts/18148/HF%20Give%20Reputation%20On%20Thread.user.js
// @updateURL https://update.greasyfork.org/scripts/18148/HF%20Give%20Reputation%20On%20Thread.meta.js
// ==/UserScript==




min = 0;
var repElements = document.getElementsByClassName('smalltext post_author_info');

for (i = 0; i < document.links.length; i++){


	if (document.links[i].href.indexOf('reputation.php?uid=') > -1){

addPos(document.links[i].href);
min++;
		}

			
	}

function addPos(str){
	var item = repElements[min];
			url = str;
		currUID = url.toString().split('?')[1];
		currUID2 = currUID.toString().split('=')[1];
		giveRepURL = "javascript:MyBB.reputation("+currUID2+")";
	//If an user has awards, add extra breakline, then append and return to prevent double appending
		if (item.innerHTML.indexOf('<br>') > 19){
			item = item.insertAdjacentHTML('beforeend', "<br><b><a href="+ giveRepURL + ">Rate User</a></b>");
			return;
		}
		

    item = item.insertAdjacentHTML('beforeend', "<b><a href="+ giveRepURL + ">Rate User</a></b>");



}