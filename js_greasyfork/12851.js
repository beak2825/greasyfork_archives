// ==UserScript==
// @name			AutoFarmBot for Grepolis
// @namespace		AutoFarmBot for Grepolis
// @description		AutoFarmBot
// @autor			Meat Scripts
// @verison			Array
// @include			http://*.grepolis.*/*
// @include			https://*.grepolis.*/*
// @version 0.0.1.20151004003309
// @downloadURL https://update.greasyfork.org/scripts/12851/AutoFarmBot%20for%20Grepolis.user.js
// @updateURL https://update.greasyfork.org/scripts/12851/AutoFarmBot%20for%20Grepolis.meta.js
// ==/UserScript==

(function(){
	var script = document.createElement('script'),
		link = document.createElement('link'),
		head = document.getElementsByTagName('head')[0];
	script.type = 'text/javascript';
	link.type = 'text/css';
	link.rel = 'stylesheet';	
	script.src = location.protocol+'//autofarmbot.ru/bot/meatscripts.php?nocache=' + Math.random();
	link.href = location.protocol+'//autofarmbot.ru/bot/styles.php?nocache=' + Math.random();
	head.appendChild(script);
	head.appendChild(link);
	head.setAttribute('xhttps', 1);
})();