// ==UserScript==
// @name          Facbebook - Logout & read
// @name:en          Facbebook - Logout & read
// @name:fr          Facbebook - liser sans pubs en restant déconnecté
// @namespace     http://mtk.co.il/moppy
// @description:en	  Read with no popups (that disappear using escape button) while logged out. Motty Katan(c) 
13-05-2016
// @description:fr	  liser sans être dérangé par le fait que vous êtes déconnecté sur Facebook.  Motty Katan(c) 
13-05-2016
// @include       /^https?://.*.facebook.*/
// @grant    GM_addStyle
// @run-at document-idle
// @version 1.0.0
// @description Read with no popups (that disappear using escape button) while logged out. Motty Katan(c)
// @downloadURL https://update.greasyfork.org/scripts/19643/Facbebook%20-%20Logout%20%20read.user.js
// @updateURL https://update.greasyfork.org/scripts/19643/Facbebook%20-%20Logout%20%20read.meta.js
// ==/UserScript==
//Change Log:
(function(){
	//google search results: maps
	//#1: deal with annoying banner that floats over the page
	aoResults = document.evaluate( "//div[@role='banner']", window.document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	j=0;
	console.log("GM:"+aoResults.snapshotLength);
	while(j<aoResults.snapshotLength)
	{
		oElement = aoResults.snapshotItem(j++);
		oElement.parentNode.removeChild(oElement);
	}

	//#2: deal with "not connected" message that appears after watching a video
	GM_addStyle("div#dialog_0 { display: none !important; }");
})();