// ==UserScript==

// @name           Gazelle Freeleech Browser (Not Grouped)
// @author         arch (but honestly thegeek (but really the_dunce from PTH (but actually phracker from what.cd)))
// @namespace      https://greasyfork.org/users/90188
// @description    Inserts a freeleech link in main menu. Does not group torrents.
// @match          http*://*apollo.rip/*
// @match          http*://passtheheadphones.me/*
// @version        1.0
// @date           2016-12-29
// @grant          none

// @downloadURL https://update.greasyfork.org/scripts/26155/Gazelle%20Freeleech%20Browser%20%28Not%20Grouped%29.user.js
// @updateURL https://update.greasyfork.org/scripts/26155/Gazelle%20Freeleech%20Browser%20%28Not%20Grouped%29.meta.js
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
	a.href = "torrents.php?freetorrent=1";
	return a;
}

var target = document.getElementById('menu').getElementsByTagName('ul')[0];


var free = createFL("Free");
var freeLi = createLi("Free",free);

target.appendChild(freeLi);