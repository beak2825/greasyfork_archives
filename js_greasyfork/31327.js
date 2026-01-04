// ==UserScript==
// @name		YAFGC hotkey navigation
// @include	http*://*yafgc.net*
// @icon		http://yafgc.net/favicon.ico
// @grant		none
// @run-at		document-end
// @description         Userscript for hotkey navigation on yafgc.net webcomic
// @version 0.0.1.20170710072319
// @namespace https://greasyfork.org/users/7568
// @downloadURL https://update.greasyfork.org/scripts/31327/YAFGC%20hotkey%20navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/31327/YAFGC%20hotkey%20navigation.meta.js
// ==/UserScript==

// Firefox
// << Shift+Alt+P and Shift+Alt+N >>

// Chrome, Opera, Safari
// << Alt+P and Alt+N >>

var prev = document.getElementsByClassName("navi-prev")[0],
next = document.getElementsByClassName("navi-next")[0];

prev.accessKey = "s";
next.accessKey = "n";