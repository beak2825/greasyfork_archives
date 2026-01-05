// ==UserScript==

// @name           What.CD Freeleech Browser
// @author         phracker ( https://what.cd/user.php?id=260077 )
// @namespace      https://what.cd
// @description    Inserts a freeleech link in main menu. Does not group torrents.
// @include        http*://*what.cd/*
// @version        1.4
// @date           2015-12-15
// @grant          none

// @downloadURL https://update.greasyfork.org/scripts/1687/WhatCD%20Freeleech%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/1687/WhatCD%20Freeleech%20Browser.meta.js
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