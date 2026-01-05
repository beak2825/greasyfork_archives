// ==UserScript==
// @name         ISORead
// @namespace    https://greasyfork.org/en/users/11508-arcbell
// @version      1.21
// @description  Allows you to read users in isolation
// @author       Arcbell
// @match        https://epicmafia.com/game/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18995/ISORead.user.js
// @updateURL https://update.greasyfork.org/scripts/18995/ISORead.meta.js
// ==/UserScript==

var isointerval = setInterval(function () {
    var playerlis = $('.user_li');
	if ($('.isobox').length < playerlis.length) {
		playerlis.each(function () {
			var uname = this.getAttribute("data-uname");
			if ($(this).has('.isobox').length === 0) {
			    $(this).prepend('<input type="checkbox" class="isobox" uname="'+uname+'">');
			}
		});
	} else {
		var checked_plrs = [];
		$('.isobox').each(function () {
			if (this.checked) {
				checked_plrs.push(this.getAttribute("uname"));
			}
		});
		if (checked_plrs.length > 0) {
			$( ".talk" ).css( "opacity", "0.25" );
			var i;
			for (i in checked_plrs) {
				$( ".talk" ).has( "[value=\'"+checked_plrs[i]+"\']" ).css( "opacity", "1" );
			}
		} else {
			$( ".talk" ).css( "opacity", "1" );
		}
	}
}, 1000);