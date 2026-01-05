// ==UserScript==
// @name           Hide the Community Bulletin
// @author         Cameron Bernhardt (AstroCB)
// @version        3.0.1
// @namespace  https://github.com/AstroCB
// @description  Hides per-site meta links from Community Bulletin
// @include        http://*.stackexchange.com/*
// @include        http://stackoverflow.com/*
// @include        http://meta.stackoverflow.com/*
// @include        http://serverfault.com/*
// @include        http://meta.serverfault.com/*
// @include        http://superuser.com/*
// @include        http://meta.superuser.com/*
// @include        http://askubuntu.com/*
// @include        http://meta.askubuntu.com/*
// @include        http://stackapps.com/*
// @downloadURL https://update.greasyfork.org/scripts/4166/Hide%20the%20Community%20Bulletin.user.js
// @updateURL https://update.greasyfork.org/scripts/4166/Hide%20the%20Community%20Bulletin.meta.js
// ==/UserScript==
var cb = document.getElementsByClassName("spacer");
var clear = true;

if (cb) {
	var links = [];

	for (var i = 0; i < cb.length; i++) {
		if(cb[i].parentElement.className == "related"){
			links[i] = cb[i];
		}
	}
	for (var j = 0; j < links.length; j++) {
		if ((links[j].children[1].children[0].href.search(/meta\.stackexchange\.com/) === -1) && (links[j].children[1].children[0].href.search(/meta/) === 7)) {
			links[j].hidden = "hidden";
		}else{
			clear = false;
		}
	}
	if (clear){
		var bulletin = document.getElementsByClassName("community-bulletin")[0];
		bulletin.hidden = "hidden";
	}else{
		var title = document.getElementsByClassName("bulletin-title");
		var separators = document.getElementsByTagName("hr");

		for(var x = 0; x < title.length; x++){
			if(title[x].innerHTML.search(/\s*Hot Meta Posts\s*/) !== -1){
				title[x].hidden = "hidden";
				if(separators[x]){
					separators[x].hidden = "hidden";
				}
			}
		}
	}
}