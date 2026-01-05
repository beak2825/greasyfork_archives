// ==UserScript==
// @name         Workshop - Unsubscribe from All
// @namespace    http://facepunch.com/
// @version      1.0
// @description  Lets just add a nice juicy button here to unsubscribe from all of those addons. Still slow, but not as slow as doing it 1 by 1.
// @author       Shigbeard
// @match        http://steamcommunity.com/id/*/myworkshopfiles/?appid=*&browsefilter=mysubscriptions*
// @match        https://steamcommunity.com/id/*/myworkshopfiles/?appid=*&browsefilter=mysubscriptions*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20947/Workshop%20-%20Unsubscribe%20from%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/20947/Workshop%20-%20Unsubscribe%20from%20All.meta.js
// ==/UserScript==

function UnsubscribeFromAll() {
	var divs = document.getElementsByTagName("div");
	var t = 0;
	for(var i = 0; i < divs.length; i++){
		var currentid = divs[i].id;
		var n = currentid.search(/Subscription\d+/g);
		if(n != -1){
			var t = t + 1;
			var m = currentid.search(/\d+/g);
			var wid = currentid.substr(m);
			console.log(wid);
			UnsusbcribeItem(wid, sharedFilesQueryParams['appid']);
		}
	}
	console.log("Results");
	console.log(t);
	console.log(i);
}

document.getElementById('rightContents').getElementsByClassName("rightDetailsBlock")[0].innerHTML += "<div class=\"workshopLink\"><a href=\"javascript:UnsubscribeFromAll()\">Unsubscribe from everything you see here</a></div>";