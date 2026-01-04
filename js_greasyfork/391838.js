// ==UserScript==
// @name         Direct Youtube Description External Links 
// @version      0.1
// @description  Provides direct links for external URLs posted in Youtube video descriptions.
// @include      /^https?\:\/\/(www|encrypted)\.youtube\./
// @author       re11ding
// @license      GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @grant        GM_addStyle
// @run-at       document-start
// @credit       zanetu and his Direct Google Images script as a useful baseline guide
// @noframes
// @namespace https://greasyfork.org/users/393964
// @downloadURL https://update.greasyfork.org/scripts/391838/Direct%20Youtube%20Description%20External%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/391838/Direct%20Youtube%20Description%20External%20Links.meta.js
// ==/UserScript==

//do not run in frames or iframes
if(window.top == window.self) {
	var RE = /redirect.+?(http.+?)(\&|$)/i;

	function dd(url) {
		var d1 = decodeURIComponent(url), d2;
		try {
			d2 = decodeURIComponent(d1);
		}
		catch(malformed) {
			return d1;
		}
		return d2;
	}

	function closest(element, matchFunction, maxLevel) {
		var max = undefined === maxLevel ? Number.POSITIVE_INFINITY : parseInt(maxLevel) + 1;
		if(max > 0 && 'function' === typeof matchFunction) {
			for(; element && max--; element = element.parentNode) {
				if(matchFunction(element)) {
					return element;
				}
			}
		}
		return null;
	}

	function handleChange() {
		var a = document.getElementsByTagName('a');
		for(var i = a.length - 1; i >= 0; i--) {
			modifyYoutubeLink(a[i]);
		}
		a = [];
	}

	function modifyYoutubeLink(element) {
		if(element && element.href) {
			var m = element.href.match(RE);
			if(m && m[1]) {
				element.href = dd(m[1]);
			}
		}
	}

	function monitor() {
		MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
		if(MutationObserver) {
			var observer = new MutationObserver(handleChange);
			observer.observe(document.documentElement, {childList: true, subtree: true});
		}
		//for chrome v18-, firefox v14-, internet explorer v11-, opera v15- and safari v6-
		else {
			setInterval(handleChange, 500);
		}
		handleChange();
	}
	//in case user clicks too early
	var m = location.href.match(RE);
	if(m && m[1]) {
		location.replace(dd(m[1]));
	}

	//"@run-at document-start" is not fully supported
	if('interactive' == document.readyState || 'complete' == document.readyState) {
		monitor();
	}
	else {
		document.addEventListener('DOMContentLoaded', monitor, false);
	}
}
