// ==UserScript==
// @name           OTRKeyfinder PG
// @namespace      http://userscripts.org/users/75950
// @description    Program Guide for OTRKeyfinder.com
// @include        http://www.otrkeyfinder.com/?search=*
// @include        http://www.otrkeyfinder.com/index.php?search=*
// @version        0.7.2
// @require        https://greasyfork.org/scripts/1738/code/helper.js?v=1
// @downloadURL https://update.greasyfork.org/scripts/1737/OTRKeyfinder%20PG.user.js
// @updateURL https://update.greasyfork.org/scripts/1737/OTRKeyfinder%20PG.meta.js
// ==/UserScript==

var theLinks = Array();
var linkcount = 0;

window.addEventListener(
  'load',
  function () {
    USP.theScriptName='OTRKeyfinder PG';
    USP.init({theName:'ShowDivX', theText:'DivX anzeigen?', theDefault:true},
             {theName:'ShowMP4', theText:'MP4 anzeigen?', theDefault:false},
             {theName:'ShowHQ', theText:'HQ anzeigen?', theDefault:false},
			 {theName:'ShowHD', theText:'HD anzeigen?', theDefault:false}
	);
    GM_registerMenuCommand('Einstellungen fuer ~'+USP.theScriptName+'~', USP.invoke);
    theLinks = document.getElementsByClassName('searchResult');
    linkcount = theLinks.length;
    if(linkcount>0) {
	// Show all
	var showMP4 = USP.getValue('ShowMP4');
	var showHQ = USP.getValue('ShowHQ');
	var showDivX = USP.getValue('ShowDivX');
	var showHD = USP.getValue('ShowHD');
	var SortOrder = USP.getValue('SortOrder');
	// Get rid off not to be shown content
	for (var j=theLinks.length-1; j>=0; j--) {
		if ((showMP4==false && theLinks[j].textContent.indexOf('mp4.otrkey')!=-1) || (showHQ==false && theLinks[j].textContent.indexOf('HQ.avi.otrkey')!=-1) || (showDivX==false && theLinks[j].textContent.indexOf('mpg.avi.otrkey')!=-1) || (showHD==false && theLinks[j].textContent.indexOf('mpg.HD')!=-1)) {
			theLinks[j].parentNode.removeChild(theLinks[j]);
		}
	}
	// Set sort order Date/Time, update search
	var theCheckbox=document.getElementById('order2');
	if(!theCheckbox.checked) {
		document.getElementById('order2').checked='checked';
		document.getElementsByTagName('form')[0].submit();
	}
    }
  },
true);
