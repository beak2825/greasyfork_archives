// ==UserScript==

// @name           NoStream.co Freeleech Browser
// @author         phracker + Velzerat ( https://nostream.co/user.php?id=164 )
// @namespace      https://nostream.co
// @description    Inserts a freeleech link in main menu. Does not group torrents.
// @include        http*://*nostream.co/*
// @version        1.4
// @date           2016-11-23
// @grant          none

// @downloadURL https://update.greasyfork.org/scripts/25074/NoStreamco%20Freeleech%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/25074/NoStreamco%20Freeleech%20Browser.meta.js
// ==/UserScript==



function createLi(x,y) {
	var li = document.createElement('li');
	li.id = 'nav_' + x;
	li.appendChild(y);
	return li;
}
function createFL(x) {
	var a = document.createElement('a');

	a.innerHTML = x;
	a.href = "torrents.php?freetorrent=1&group_results=0&action=advanced&searchsubmit=1";
	return a;
}

var target = document.getElementById('menu').getElementsByTagName('ul')[0];


var free = createFL("Free");
var freeLi = createLi("Free",free);

target.appendChild(freeLi);