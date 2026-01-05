// ==UserScript==
// @name 		   Alex:BSCF : add BTSC search form
// @namespace	   http://supportforums.blackberry.com/
// @description	version 3
// @include		http://supportforums.blackberry.com/*
// @version 0.0.1.20150819230218
// @downloadURL https://update.greasyfork.org/scripts/11856/Alex%3ABSCF%20%3A%20add%20BTSC%20search%20form.user.js
// @updateURL https://update.greasyfork.org/scripts/11856/Alex%3ABSCF%20%3A%20add%20BTSC%20search%20form.meta.js
// ==/UserScript==

var divBTSC = document.createElement('div');
	divBTSC.id    = 'xandrex-btsc-search';
var formBTSC = document.createElement('form');
	formBTSC.method = 'post';
	formBTSC.target = '_blank';
	formBTSC.action = 'http://btsc.webapps.blackberry.com/btsc/microsites/searchEntry.do';
var input1 = document.createElement('input');input1.type  = 'text'  ;input1.name  = 'searchString';input1.value = '';
var input2 = document.createElement('input');input2.type  = 'hidden';input2.name  = 'usemicrosite';input2.value = 'true';
var input3 = document.createElement('input');input3.type  = 'hidden';input3.name  = 'document'    ;input3.value = 'DT_SUPPORTISSUE_1_1';
formBTSC.appendChild(input1);
formBTSC.appendChild(input2);
formBTSC.appendChild(input3);
divBTSC.appendChild(formBTSC);
//document.evaluate( "//div[@id='searchform']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null ).snapshotItem(0).parentNode.appendChild(divBTSC);
document.evaluate( "//div[@id='lia-searchform']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null ).snapshotItem(0).parentNode.appendChild(divBTSC);

