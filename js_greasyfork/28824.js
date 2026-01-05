// ==UserScript==
// @name           Rescribir enlaces webp creados por KN3 en Taringa!
// @namespace      kapodamy
// @author         kapodamy
// @description    Previene que la imagenes de fuentes externas sean mostradas como webp
// @include        http://www.taringa.net/*
// @include        https://www.taringa.net/*
// @version        1.2
// @run-at         document-end
// @granT          none
// @downloadURL https://update.greasyfork.org/scripts/28824/Rescribir%20enlaces%20webp%20creados%20por%20KN3%20en%20Taringa%21.user.js
// @updateURL https://update.greasyfork.org/scripts/28824/Rescribir%20enlaces%20webp%20creados%20por%20KN3%20en%20Taringa%21.meta.js
// ==/UserScript==

(function() {
	var rx = /https?:\/\/ugc.kn3.net\/i\/(?:origin|760x)\//;
	main();
	window.$(document).bind('ajaxComplete', main);
	
	function main() {
		var imgs = document.querySelectorAll("img");
		var i = 0;
		
		for (i=0 ; i<imgs.length ; i++) {
			if (rx.test(imgs[i].src)) { imgs[i].src = imgs[i].src.replace(rx,''); }
		}
	}
})();
