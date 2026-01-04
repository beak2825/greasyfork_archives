// ==UserScript==

// @name         Improved Gazelle Tracker Freeleech Browser
// @name:zh      GTFB：Gazelle框架PT免费种子浏览
// @name:zh-CN   GTFB：Gazelle框架PT免费种子浏览
// @name:zh-TW   GTFB：Gazelle框架PT免費種子瀏覽
// @author       phracker from what.cd
// @namespace      https://greasyfork.org/zh-CN/users/284654
// @description    Inserts a freeleech link in main menu. Groups torrents.
// @description:zh      在主菜单中插入“免费种子”的选项，以便于选择。
// @description:zh-CN   在主菜单中插入“免费种子”的选项，以便于选择。
// @description:zh-TW   在主菜單中插入“免費種子”的選項，以便於選擇。
// @include        http*://*orpheus.network/*
// @include        http*://*redacted.ch/*
// @include        http*://*dicmusic.club/*
// @include        http*://*gazellegames.net/*
// @include        http*://*awesome-hd.me/*
// @include        http*://*alpharatio.cc/*
// @include        http*://*lztr.me/*
// @version        2.0
// @date           2019-06-12
// @grant          none

// @downloadURL https://update.greasyfork.org/scripts/417288/Improved%20Gazelle%20Tracker%20Freeleech%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/417288/Improved%20Gazelle%20Tracker%20Freeleech%20Browser.meta.js
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


var free = createFL("Freeleech");
var freeLi = createLi("Freeleech",free);

target.appendChild(freeLi);