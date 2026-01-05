// ==UserScript==

// @name           PTH Freeleech Browser (Grouped)
// @author         the_dunce (but actually phracker from what.cd)
// @namespace      passtheheadphones.me
// @description    Inserts a freeleech link in main menu. Groups torrents.
// @include        http*://*passtheheadphones.me/*
// @version        1.0
// @date           2016-12-03
// @grant          none

// @downloadURL https://update.greasyfork.org/scripts/25358/PTH%20Freeleech%20Browser%20%28Grouped%29.user.js
// @updateURL https://update.greasyfork.org/scripts/25358/PTH%20Freeleech%20Browser%20%28Grouped%29.meta.js
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
	a.href = "torrents.php?freetorrent=1&group_results=1&action=advanced&searchsubmit=1";
	return a;
}

var target = document.getElementById('menu').getElementsByTagName('ul')[0];


var free = createFL("Free");
var freeLi = createLi("Free",free);

target.appendChild(freeLi);