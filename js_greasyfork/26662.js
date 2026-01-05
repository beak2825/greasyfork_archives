// ==UserScript==
// @name			KomputerSwiat/Auto-Swiat Anti-AdBlock Bypass
// @version			1.1.1
// @description		Przywracanie treści artykułu po podmianie przez skrypt przeciwko wtyczkom blokującym reklamy na stronach KomputerSwiat i Auto-Swiat. Nakładkę zasłaniającą stronę należy zablokować AdBlockiem/uBlockiem lub inną wtyczką blokującą reklamy.
// @author			norbi1952
// @match			http://www.komputerswiat.pl/*
// @match			http://komputerswiat.pl/*
// @match			http://www.auto-swiat.pl/*
// @match			http://auto-swiat.pl/*
// @grant			none
// @require			https://cdn.jsdelivr.net/jquery/3.1.1/jquery.min.js
// @namespace			https://greasyfork.org/users/9446
// @downloadURL https://update.greasyfork.org/scripts/26662/KomputerSwiatAuto-Swiat%20Anti-AdBlock%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/26662/KomputerSwiatAuto-Swiat%20Anti-AdBlock%20Bypass.meta.js
// ==/UserScript==
var contentElement = $('.article, #article');

if(contentElement.length > 0) {
	var cleanContent = contentElement.clone();

	$(document).ready(function() {
		function replaceArticle() {
			contentElement.replaceWith(cleanContent);
		}

		setTimeout(replaceArticle, 1200);
	});
}