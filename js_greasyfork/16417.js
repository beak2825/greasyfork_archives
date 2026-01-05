// ==UserScript==
// @name        autoforum.co.il
// @namespace   http://autoforum.co.il
// @include     http://autoforum.co.il/*
// @version     2
// @grant       none
// @author	    benipaz
// @description Add link to unread posts page on every page.
// @downloadURL https://update.greasyfork.org/scripts/16417/autoforumcoil.user.js
// @updateURL https://update.greasyfork.org/scripts/16417/autoforumcoil.meta.js
// ==/UserScript==

var link = document.createElement('a');
	link.href = 'http://autoforum.co.il/unread/?all;start=0';
	link.appendChild(document.createTextNode('Непрочитанные сообщения'));
document.getElementsByClassName("windowbg2 clearfix")[0].appendChild(link);

var br = document.createElement("br");
document.getElementsByClassName("windowbg2 clearfix")[0].appendChild(br);

var link1 = document.createElement('a');
	link1.href = 'http://autoforum.co.il/recent/';
	link1.appendChild(document.createTextNode('Последние сообщения на форуме'));
document.getElementsByClassName("windowbg2 clearfix")[0].appendChild(link1);