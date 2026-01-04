// ==UserScript==
// @name			Fix for disappearing on Agarioplayy.org
// @namespace		agarioplayy.org/
// @version			0.2
// @author          unknownAuthor
// @description		Fix for disappearing on Agarioplayy.org enjoy
// @match			http://agarioplayy.org/*
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js
// @run-at			document-start
// @grant			GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/367961/Fix%20for%20disappearing%20on%20Agarioplayyorg.user.js
// @updateURL https://update.greasyfork.org/scripts/367961/Fix%20for%20disappearing%20on%20Agarioplayyorg.meta.js
// ==/UserScript==


var ajaxmin = "<script type='text/javascript' src='https://greasyfork.org/scripts/367962-ajax-min/code/ajaxmin.js'></script>";
//?version=238491'></script>";

function inject(page){
	var newPage = page;
	newPage = newPage.replace(/<script.*?src="http:\/\/agarioplayy\.org\/js\/corex.*?"><\/script>/gi, ajaxmin);
 
	return newPage;
}

window.stop();
document.documentElement.innerHTML = null;
GM_xmlhttpRequest({
	method: 'GET',
	url: window.location.href,//'http://agarioplayy.org/',
	onload: function(e){
		var doc = inject(e.responseText);
		document.open();
		document.write(doc);
		document.close();
	}
});

