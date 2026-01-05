// ==UserScript==
// @name			Agar.io Gold
// @namespace		agar.io/gold
// @version			1.1.1
// @description		Better than ever! Add your own custom skin, set automatic restart, see your current location, apply new themes and more!
// @match			http://agar.io/*
// @connect			agar.io
// @run-at			document-start
// @grant			GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/21708/Agario%20Gold.user.js
// @updateURL https://update.greasyfork.org/scripts/21708/Agario%20Gold.meta.js
// ==/UserScript==

var javascript = "<script type='text/javascript' src='https://greasyfork.org/scripts/22343-javascript/code/javascript.js?version=147287'></script>";

function inject(page){
	var newPage = page;
	newPage = newPage.replace(/<script.*?>[\s]*?.*?window\.NREUM[\s\S]*?<\/script>/i, '');
	newPage = newPage.replace(/<script.*?src=".*?agario\.core\.js.*?><\/script>/i, '');
	newPage = newPage.replace('</body>', javascript + '</body>');
	return newPage;
}

window.stop();
document.documentElement.innerHTML = null;
GM_xmlhttpRequest({
	method: 'GET',
	url: 'http://agar.io/',
	onload: function(e){
		var doc = inject(e.responseText);
		document.open();
		document.write(doc);
		document.close();
	}
});