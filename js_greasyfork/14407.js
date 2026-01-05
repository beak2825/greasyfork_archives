// ==UserScript==
// @name		Toaster Testing Grounds Activator
// @namespace   coaster3000@pmd-roleplay.forumotion.com
// @description Activates the testing grounds
// @include	 	http://pmd-roleplay.forumotion.org/t4852-*
// @version	 	0.1.1
// @grant		none
// @require		https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @run-at 		document-end
// @downloadURL https://update.greasyfork.org/scripts/14407/Toaster%20Testing%20Grounds%20Activator.user.js
// @updateURL https://update.greasyfork.org/scripts/14407/Toaster%20Testing%20Grounds%20Activator.meta.js
// ==/UserScript==

var pageVer = jQuery('.pmdc-test-version').text();
var myVer = GM_info.script.version;

if ( myVer !== pageVer ) {
	alert('Looks like you need to update me! Contact developer for details!\n\nVersion Page Stated: \'' + pageVer + '\'\nMy Version: \'' + myVer + '\'!');
} 

jQuery('.pmdc-test.hidden').removeClass('spoiler_content hidden').text('Welcome Aboard Matey!');
