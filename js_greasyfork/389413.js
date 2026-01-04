	// ==UserScript==
	// @name			Display Hidden Form Fields
	// @namespace		http://diveintomark.org/projects/greasemonkey/
	// @description		un-hide hidden form fields and make them editable
	// @include			*
// @version 0.0.1.20190827001328
// @downloadURL https://update.greasyfork.org/scripts/389413/Display%20Hidden%20Form%20Fields.user.js
// @updateURL https://update.greasyfork.org/scripts/389413/Display%20Hidden%20Form%20Fields.meta.js
	// ==/UserScript==
		   
	   var snapHidden = document.evaluate("//input[@type='hidden']",
		   document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	   for (var i = snapHidden.snapshotLength - 1; i >= 0; i--) {
		   var elmHidden = snapHidden.snapshotItem(i);
		   elmHidden.style.MozOutline = '1px dashed #666';
		   elmHidden.type = 'text';
		   elmHidden.title = 'Hidden field "' +
			   (elmHidden.name || elmHidden.id) + '"';
	   }