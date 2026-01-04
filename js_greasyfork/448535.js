// ==UserScript==
// @name         External Wikiplus
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在基于Mediawiki的网站中启用Wikiplus。
// @author       Star0
// @match        https://wiki.arcaea.cn/*
// @grant        none
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/448535/External%20Wikiplus.user.js
// @updateURL https://update.greasyfork.org/scripts/448535/External%20Wikiplus.meta.js
// ==/UserScript==

window.onload = function() {
	var main = document.createElement('script');
	main.setAttribute('type','text/javascript');
	main.setAttribute('src',"https://wikiplus-app.com/Main.js");
	document.getElementsByTagName('head')[0].appendChild(main);

	var highlight = document.createElement('script');
	highlight.setAttribute('type','text/javascript');
	highlight.setAttribute('src',"https://cdn.jsdelivr.net/gh/bhsd-harry/Wikiplus-highlight@stable/main.min.js");
	document.getElementsByTagName('head')[0].appendChild(highlight);
};