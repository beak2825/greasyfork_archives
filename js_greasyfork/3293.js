// ==UserScript==
// @name        TOL Text Field Fix
// @namespace   tol.bah.com/main.cfm
// @description This script increases the size of the text fields in Time Online, or TOL - Booz Allen Hamilton's web-based time reporting program
// @include     https://tolconnected.bah.com/*
// @include		https://tol.bah.com/*
// @include		https://sso.bah.com/*
// @include		https://access.bah.com/*
// @grant       none
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/3293/TOL%20Text%20Field%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/3293/TOL%20Text%20Field%20Fix.meta.js
// ==/UserScript==
if( document.title == 'Time Sheet' ) {
	var elems = document.getElementsByTagName('input'), i;
	for (i in elems) {
		if((' ' + elems[i].className + ' ').indexOf(' tolwksheet ') > -1) {
			elems[i].style.width=35;
		}
	}
}