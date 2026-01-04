// ==UserScript==
// @name			Wikipedia URL Redirect
// @version			2021.02.03
// @description		Обрезка stable-адреса в Википедии
// @description:en	Wikipedia's stable-URL cutter
// @include			http*://*wikipedia.org/*
// @icon			https://www.google.com/s2/favicons?domain=wikipedia.org
// @author			Rainbow-Spike
// @namespace       https://greasyfork.org/users/7568
// @homepage        https://greasyfork.org/ru/users/7568-dr-yukon
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/421061/Wikipedia%20URL%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/421061/Wikipedia%20URL%20Redirect.meta.js
// ==/UserScript==

if ( window.location.href.match ( 'stable=0' ) != null ) {
	window.location.href = window.location.href.replace ( "w/index.php?title=", "wiki/" ).replace ( "&stable=0", "" )
}

// ЯРОСТЬ ТОПОРА!