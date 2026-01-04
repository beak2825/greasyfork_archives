// ==UserScript==
// @name          Facebook: Remove Login Panel
// @description	  Removes login panel on Facebook
// @author        shirak
// @include       https://www.facebook.com/
// @include       https://www.facebook.com/dtonredbirds/
// @run-at        document-start
// @version       1.0.0
// @namespace http://userstyles.org
// @downloadURL https://update.greasyfork.org/scripts/400164/Facebook%3A%20Remove%20Login%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/400164/Facebook%3A%20Remove%20Login%20Panel.meta.js
// ==/UserScript==
(function() {var css = [
	document.getElementsByClassName('_5hn6')[0].remove()
]})();