// ==UserScript==
// @name              Czysty Wykop v3
// @namespace         http://www.wykop.pl/ludzie/qwelukasz/
// @description       Skrypt do czyszczenia wypoku
// @author            Łukasz Malicki
// @version           1.0
// @include           http://*.wykop.pl*
// @exclude           http://*.wykop.pl/link*
// @exclude           http://*.wykop.pl/ramka*
// @downloadURL https://update.greasyfork.org/scripts/3734/Czysty%20Wykop%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/3734/Czysty%20Wykop%20v3.meta.js
// ==/UserScript==

var main = function () {
	$(document).ready(function ($) {

		//usuwa pierwszy wykop sposorowany na stronie głównej
		$('ul[id=dyingLinksBox]').remove();
		
		//usuwa wykop sponsorowany
		$('a[href*="http://www.wykop.pl/reklama"].affect').closest('li.link').remove();
	});
};

var script = document.createElement('script');
script.textContent = '(' + main.toString() + ')();';
document.body.appendChild(script);