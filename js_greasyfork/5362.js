// ==UserScript==
// @name                3-2-1-Gorące
// @namespace           http://www.wykop.pl/mikroblog/*
// @description         Gorące wpisy sprzed 1/2/3 godzin.
// @author              Otter
// @match               http://www.wykop.pl/mikroblog/*
// @version             1.1
// @downloadURL https://update.greasyfork.org/scripts/5362/3-2-1-Gor%C4%85ce.user.js
// @updateURL https://update.greasyfork.org/scripts/5362/3-2-1-Gor%C4%85ce.meta.js
// ==/UserScript==

//batony
$('a[href="http://www.wykop.pl/mikroblog/hot/ostatnie/6/"]').first().parent().before('<li><a href="http://www.wykop.pl/mikroblog/hot/ostatnie/1/">1h</a></li><li><a href="http://www.wykop.pl/mikroblog/hot/ostatnie/2/">2h</a></li><li><a href="http://www.wykop.pl/mikroblog/hot/ostatnie/3/">3h</a></li>');

var currUrl = window.location.href;
var lastLoc = currUrl.indexOf('/hot/ostatnie/');

//aktywne batony
if(lastLoc > 0)
{
	var numb = currUrl.substring(lastLoc + 14, lastLoc + 16);
	
	if(parseInt(numb, 10) < 6)
	{
		var endUrl = "http://www.wykop.pl/mikroblog/hot/ostatnie/" + numb;
		$('a[href="' + endUrl + '"]').first().parent().addClass("active");
	}
}
else
{
	var found = $('script[type="text/javascript"]').text();
	var numb = found.indexOf('stream_h');
	var hoth = found.substring(numb + 11, numb + 13);

	if(hoth === '1"' || hoth === '2"' || hoth === '3"')
	{
		var endUrl = "http://www.wykop.pl/mikroblog/hot/ostatnie/" + hoth.substring(0, 1) + "/";
		$('a[href="' + endUrl + '"]').first().parent().addClass("active");
	}
}