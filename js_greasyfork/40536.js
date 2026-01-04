// ==UserScript==
// @name			Remove anti-adblock on openload
// @namespace		openload.co/
// @version			0.1
// @author          Dragan
// @description		A script to remove ad-blocking on openload
// @match			https://oload.stream/*
// @match			https://openload.co/*
// @run-at			document-end
// @grant			GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/40536/Remove%20anti-adblock%20on%20openload.user.js
// @updateURL https://update.greasyfork.org/scripts/40536/Remove%20anti-adblock%20on%20openload.meta.js
// ==/UserScript==


var videojs =`<script>[\s]*window.adblock=false;window.adblock2=false;[\s\S]*<\/script>`;

function inject(page){
	var newPage = page;
	newPage = newPage.replace(/<script><\/script>/gi, videojs);

	return newPage;
}

window.stop();
document.documentElement.innerHTML = null;
GM_xmlhttpRequest({
	method: 'GET',
	url: window.location.href,//'https://oload.stream/*',
	onload: function(e){
		var doc = inject(e.responseText);
		document.open();
		document.write(doc);
		document.close();
	}
});