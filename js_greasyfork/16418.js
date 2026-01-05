// ==UserScript==
// @name        forummotor.israelinfo.co.il
// @namespace   http://forummotor.israelinfo.co.il/
// @include     http://forummotor.israelinfo.co.il/*
// @include     https://forummotor.israelinfo.co.il/*
// @version     2
// @grant       none
// @author      benipaz
// @description Add link to unread posts page on every page.
// @downloadURL https://update.greasyfork.org/scripts/16418/forummotorisraelinfocoil.user.js
// @updateURL https://update.greasyfork.org/scripts/16418/forummotorisraelinfocoil.meta.js
// ==/UserScript==

var para = document.createElement("p");
var link = document.createElement('a');
	link.href = './search.php?search_id=unreadposts';
	link.appendChild(document.createTextNode('Непрочитанные сообщения'));
  link.style = 'text-decoration: underline';
  link.style.fontSize = '125%';
para.appendChild(link);

var element = document.querySelector("#pagecontent");
element.appendChild(para);