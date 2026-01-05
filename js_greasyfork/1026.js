// ==UserScript==
// @name        NeoGAF : Remove "This Message Is Hidden"
// @namespace   hateradio)))
// @description Completely hides messages from users whom you've added to your ignore list.
// @include     http*://*neogaf.com/forum/showthread.php?p=*
// @include     http*://*neogaf.net/forum/showthread.php?p=*
// @version     2.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/1026/NeoGAF%20%3A%20Remove%20%22This%20Message%20Is%20Hidden%22.user.js
// @updateURL https://update.greasyfork.org/scripts/1026/NeoGAF%20%3A%20Remove%20%22This%20Message%20Is%20Hidden%22.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var c = document.createElement('style');
	c.type = 'text/css';
	c.textContent = '.postbit.ignored { display: none; }';
	document.body.appendChild(c);
}());