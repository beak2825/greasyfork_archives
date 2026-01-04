// ==UserScript==
// @name         Wykop.pl - automatyczne czytanie wszystkich powiadomień
// @namespace    https://github.com/lopezloo
// @version      1.0
// @description  Dodaje przycisk "odczytaj wszystkie powiadomienia" na wykop.pl/powiadomienia
// @author       lopezloo
// @license	     GPL-3.0
// @match        https://www.wykop.pl/powiadomienia/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/438767/Wykoppl%20-%20automatyczne%20czytanie%20wszystkich%20powiadomie%C5%84.user.js
// @updateURL https://update.greasyfork.org/scripts/438767/Wykoppl%20-%20automatyczne%20czytanie%20wszystkich%20powiadomie%C5%84.meta.js
// ==/UserScript==

$(document).ready(function() {
	$ul = $(".nav.bspace.rbl-block ul:eq(0)");
	$readAll = $('<li><a href="#">odczytaj wszystko</a></li>').prependTo($ul);

	$readAll.mousedown(function(e) {
		if(e.which != 3) {
			$(".menu-list.notification li").each(function(index) {
				if ( !$(this).hasClass("space") && $(this).hasClass("type-light-warning") ) {
					$url = $(this).find("p a:eq(3)").attr("href");
					GM_openInTab($url, true);
					$(this).removeClass("type-light-warning");
					$(this).removeClass("annotation");
					$(this).find("a.close").remove();
				}
			});
			return false;
		}
	});
});
