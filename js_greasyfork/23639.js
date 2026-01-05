// ==UserScript==
// @name        YT Recommended for you DEL
// @description Removing "Recommended for you"
// @namespace   for_you_scissors
// @include     http*://*.youtube.com/*
// @include     http*://youtube.com/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23639/YT%20Recommended%20for%20you%20DEL.user.js
// @updateURL https://update.greasyfork.org/scripts/23639/YT%20Recommended%20for%20you%20DEL.meta.js
// ==/UserScript==

window.setTimeout(
	function check() {
var a = document.querySelectorAll('.video-list >  li');
var words = /Рекомендуемые вам|Recommended for you/;
for (var i=0;i<a.length;i++) if (words.test(a[i].innerHTML))
    a[i].parentNode.removeChild(a[i]);
    window.setTimeout(check, 300);
	}, 300
);