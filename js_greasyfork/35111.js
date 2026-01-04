// ==UserScript==
// @id             removegredirect
// @description    Removes Google Redirect
// @namespace      RemoveGoogleRedirect@dindog
// @name           Remove Google Redirect
// @version        0.0.2
// @include        http://www.google.com/*
// @include        https://www.google.com/*
// @include        http://www.google.com.hk/*
// @include        https://www.google.com.hk/*
// @include        https://www.google.tld/*
// @include        http://www.google.tld/*
// @include        http*://www.google.*/
// @include        http*://www.google.*/#hl=*
// @include        http*://www.google.*/search*
// @include        http*://www.google.*/webhp?hl=*
// @include        https://encrypted.google.com/
// @include        https://encrypted.google.com/#hl=*
// @include        https://encrypted.google.com/search* 
// @include        https://encrypted.google.com/webhp?hl=*
// @include        http://ipv6.google.com/
// @include        http://ipv6.google.com/search*
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/35111/Remove%20Google%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/35111/Remove%20Google%20Redirect.meta.js
// ==/UserScript==

	document.addEventListener('DOMNodeInserted', checksearch, false);

	function checksearch() {
		var list = document.getElementById('ires');

		if (list) {
			document.removeEventListener('DOMNodeInserted', checksearch, false);
			document.addEventListener('DOMNodeInserted', clear, false)
		};
	}

	function clear() {
		var items = document.querySelectorAll('a[onmousedown]');
		for (var i = 0; i < items.length; i++) {
			items[i].removeAttribute('onmousedown');
		}
	}