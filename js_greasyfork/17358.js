// ==UserScript==
// @name            Widget Enabler
// @namespace       widgetenabler
// @description     Prosty skrypt, ktry zamienia linki do wpisow na widoczne widgety tych wpisow.
// @include         http://*.wykop.pl/*
// @version         1.1
// @downloadURL https://update.greasyfork.org/scripts/17358/Widget%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/17358/Widget%20Enabler.meta.js
// ==/UserScript==

setInterval(function(){
	if($('.wblock.dC div.text').find('a[href*="wykop.pl/wpis/"]').length < 10) {
		$('.wblock.dC div.text').find('a[href*="wykop.pl/wpis/"]').each(function(){
			var href = $(this).attr('href'),
				href = href.replace("http://", ""),
				href = href.replace("https://", ""),
				href = href.replace("www.", ""),
				href = href.replace("wykop.pl/", ""),
				href = href.replace("wpis/", ""),
				entryNumber = href.split("/"),
				entryNumber = entryNumber[0];
				iframeURL = '<iframe src="http://www.wykop.pl/widget/entry/'+entryNumber+'/" style="width:100%; padding: 20px; border-radius:5px;"></iframe>';
			$(iframeURL).insertAfter(this);
			$(this).contents().unwrap();
		});
	}
}, 1000);