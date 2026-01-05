// ==UserScript==
// @name			Fix scroll wheel in .swf
// @description		Fixes scrolling in direct links to flash applications (.swf)
// @match			*/*.swf
// @version 0.0.1.20140825092722
// @namespace https://greasyfork.org/users/4723
// @downloadURL https://update.greasyfork.org/scripts/4501/Fix%20scroll%20wheel%20in%20swf.user.js
// @updateURL https://update.greasyfork.org/scripts/4501/Fix%20scroll%20wheel%20in%20swf.meta.js
// ==/UserScript==
document.body.style.margin="0 0 1px 1px";
document.body.style.overflow="hidden";
window.onmousewheel=function() {
	return false;
	};