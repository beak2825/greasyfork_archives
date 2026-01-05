// ==UserScript==
// @name 		Alex:BTSC : reformat DocInformation block for easy copy paste
// @namespace	http://btsc.webapps.blackberry.com/
// @description	BTSC:reformat DocInformation block for easy copy paste
// @include		http://btsc.webapps.blackberry.com/btsc/viewdocument.do?*
// @version 0.0.1.20150819230328
// @downloadURL https://update.greasyfork.org/scripts/11859/Alex%3ABTSC%20%3A%20reformat%20DocInformation%20block%20for%20easy%20copy%20paste.user.js
// @updateURL https://update.greasyfork.org/scripts/11859/Alex%3ABTSC%20%3A%20reformat%20DocInformation%20block%20for%20easy%20copy%20paste.meta.js
// ==/UserScript==

function fetchAndRemove() {
	var nodesSnapshot = document.evaluate(
		  '//div[@class="social"]'
		, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
	);

	var nbrDivs = nodesSnapshot.snapshotLength;
	if (0!=nbrDivs) {
		for ( var i=0 ; i < nbrDivs ; i++ )
			nodesSnapshot.snapshotItem(i).parentNode.removeChild(nodesSnapshot.snapshotItem(i));
	} // end if
} // end function fetchAndRemove()

window.xdx = function() {
  fetchAndRemove();
}

xdx();

