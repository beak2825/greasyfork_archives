// ==UserScript==
// @name 		Alex:hide-hasreplies-forum-support-blackberry
// @namespace	http://supportforums.blackberry.com/
// @description	hide threads with at least one reply
// @include		http://supportforums.blackberry.com/t5/*
// @version 0.0.1.20150819230037
// @downloadURL https://update.greasyfork.org/scripts/11851/Alex%3Ahide-hasreplies-forum-support-blackberry.user.js
// @updateURL https://update.greasyfork.org/scripts/11851/Alex%3Ahide-hasreplies-forum-support-blackberry.meta.js
// ==/UserScript==

var AllTD = document.getElementsByTagName('td');

for (var i=0;i<AllTD.length;i++) {
	if (AllTD[i].hasAttribute('class'))
		if (-1 != AllTD[i].getAttribute('class').indexOf('repliesCountColumn'))
			if (0!=AllTD[i].innerHTML)
				AllTD[i].parentNode.setAttribute('style','display:none;');
} // end for