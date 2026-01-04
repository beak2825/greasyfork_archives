// ==UserScript==
// @name			color change
// @namespace		agarioplayy.org/
// @version			0.1
// @author          daw
// @description		change color http://agarioplayy.org/
// @match			http://agarioplayy.org/*
// @run-at			document-start
// @grant			GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/369496/color%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/369496/color%20change.meta.js
// ==/UserScript==

var javascript = "<script type='text/javascript' src='https://greasyfork.org/scripts/369497-jquery/code/jquery.js'></script>";

function inject(page){
	var newPage = page;
	newPage = newPage.replace(/<script.*?src="http:\/\/agarioplayy\.org\/js\/corex.*?"><\/script>/gi, javascript);
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
