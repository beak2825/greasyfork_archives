// ==UserScript==
// @author         Ben Lee
// @name           F2改变网页背景色（for Chrome）
// @description    Changes color of page to grey text on black background to make pages easier to read.  Uses F2 to toggle colors on and off.
// @namespace      http://www.benslee.com/
// @include        *
// @version 0.0.1.20171116095331
// @downloadURL https://update.greasyfork.org/scripts/375766/F2%E6%94%B9%E5%8F%98%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%E8%89%B2%EF%BC%88for%20Chrome%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/375766/F2%E6%94%B9%E5%8F%98%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%E8%89%B2%EF%BC%88for%20Chrome%EF%BC%89.meta.js
// ==/UserScript==

/*
	Notes:  This has not been thoroughly tested.   It was made to save my eyes.  I love reading nytimes.com, but after a while, my eyes start bugging out because of the white background.  I put togther this script with some code borrowed from various sites on the internet.  Unfortunately I don't remember the sites to properly credit those involved.

	Feb 22, 2008 - ver 1.1 - Added comments, cleaned up code, and eliminated js warning by switching to style instead of link tag.
	Feb 22, 2008 - ver 1.0 - Released into the wild.
*/

var teNewBackgroundColor, teNewTextColor, teNewLinkColor, teNewVisitedColor, teMyKeyCode;
var teNewStyle;

//  Change any of these to values you think are more appropriate.
teNewBackgroundColor = '#151515';  // Background replaced with this color.
teNewTextColor = '#F2F2F2';  // Text color changed to this color.
teNewLinkColor = '#FFFF00';  // Link color changed to this color.
teNewVisitedColor = '#FFC0A0';  // Visited link color changed to this color.
teMyKeyCode = 113; //  keyCode 113 represents F2

// Create new style tag.
teNewStyle = document.createElement('style');
teNewStyle.id = 'teStylesheet';
teNewStyle.innerHTML = '* {background: ' + teNewBackgroundColor + ' !important; color: ' + teNewTextColor + ' !important} ';
teNewStyle.innerHTML += ':link, :link * { color: ' + teNewLinkColor + ' !important}';
teNewStyle.innerHTML += ':visited, :visited *, { color: ' + teNewVisitedColor + ' !important};';

window.addEventListener('keydown', changeColors, true); // 'keydown' works for Chrome

function changeColors(e) {
	var teNewStyleSheet, teOldStyleSheet, teStyles;

	if (e.keyCode == teMyKeyCode) {
		teOldStyleSheet = document.getElementById("teStylesheet");
		if (teOldStyleSheet){ // if oldStyleSheet already exists, it is removed.
			document.getElementsByTagName("head")[0].removeChild(teNewStyle );
		} else {  // if oldStyleSheet does not exist, it is created and added.
			document.getElementsByTagName("head")[0].appendChild(teNewStyle);
		}
	}
}