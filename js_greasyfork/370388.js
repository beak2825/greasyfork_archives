// ==UserScript==
// @name        Wykopowy zwawijas
// @description Zwijanie i rozwijanie komentarzy pod znaleziskami
// @include     https://www.wykop.pl/link/*
// @version     0.4
// @namespace https://greasyfork.org/users/30
// @downloadURL https://update.greasyfork.org/scripts/370388/Wykopowy%20zwawijas.user.js
// @updateURL https://update.greasyfork.org/scripts/370388/Wykopowy%20zwawijas.meta.js
// ==/UserScript==

if (typeof $ == 'undefined') {
	if (typeof unsafeWindow !== 'undefined' && unsafeWindow.jQuery) {
		// Firefox
		var $ = unsafeWindow.jQuery;
		main();
	} else {
		// Chrome
		addJQuery(main);
	}
} else {
	// Opera
	main();
}

function addJQuery(callback) {
	var script = document.createElement("script");
	script.textContent = "(" + callback.toString() + ")();";
	document.body.appendChild(script);
}

function main(){
	window.fold = function (item){
		item = $(item);
		
		if(item.text().match('-')) item.text('[+]');
		else item.text('[-]');
		
		item.parent().find('ul').toggle();
	}
	
	$( document ).ready(function() {
		var streams = $('ul.comments-stream > li');
		//streams.prepend('<span style="float: left; color: lightblue; position: relative; z-index: 1133; font-family: \'Courier New\', Courier, monospace;" onclick="fold(this)" >[-]</span>');
		
		
		streams.each(function(i, item){
			item = $(item);
			var length = item.find('ul.sub > li').length;
			if(length > 0){
				item.find('div:first > div > div.author').append('<span style="font-size: x-small; padding-left: 8px; color: silver;">Komentarzy: ' + length + '</span>');
				$(streams.get(i)).prepend('<span style="float: left; color: lightblue; position: relative; z-index: 1133; font-family: \'Courier New\', Courier, monospace;" onclick="fold(this)" >[-]</span>');
			}
		});
	});
}
