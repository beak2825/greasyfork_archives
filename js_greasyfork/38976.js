// ==UserScript==
// @name Disable javascript
// @author yansyrs
// @description 拦截网页的JS，又可以使用用户的JS
// @version 0.1
// @include *
// @exclude http://web2.qq.com/*
// @namespace https://greasyfork.org/users/141199
// @downloadURL https://update.greasyfork.org/scripts/38976/Disable%20javascript.user.js
// @updateURL https://update.greasyfork.org/scripts/38976/Disable%20javascript.meta.js
// ==/UserScript==
(function() {
if (widget.preferences.getItem('state')!='off'){
	var blocked_count = 0;
	window.opera.addEventListener("BeforeExternalScript", function(e) {
		blocked_count++;
		opera.extension.postMessage({action:'blocked_count', value: blocked_count});
		e.preventDefault();
	}, false);
	window.opera.addEventListener("BeforeScript", function(e) {
		blocked_count++;
		opera.extension.postMessage({action:'blocked_count', value: blocked_count});
		e.preventDefault();
	}, false);
}
}());
