// ==UserScript==
// @name        JSBIN Render Button
// @namespace   http://www.top-info.de/thein
// @description Bring the render button back to jsbin
// @include     http://jsbin.com/*edit
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/1739/JSBIN%20Render%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/1739/JSBIN%20Render%20Button.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
	var $j = unsafeWindow.jQuery;
	$j('<a>Render</a>').attr("href", "#").appendTo('#panels').addClass('button').addClass('group').click(function(e) {
		window.location.href = $j('#jsbinurl').attr("href");
		e.preventDefault();
	});
}, false);