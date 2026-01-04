// ==UserScript==
// @name        sis.fix.img
// @description fix image
// @namespace   zhang
// @include     http://www.sexinsex.net/bbs/viewthread.php?*
// @version     1
// @grant		GM_log
// @downloadURL https://update.greasyfork.org/scripts/373088/sisfiximg.user.js
// @updateURL https://update.greasyfork.org/scripts/373088/sisfiximg.meta.js
// ==/UserScript==

var images = document.querySelectorAll('div.t_msgfont img');
for(var i = 0; i < images.length; i++) {
	var image = images[i];
	if(image.src.indexOf('\\') > 0) {
		image.src = image.src.replace(/\\/g, '/');
	}
	if(image.src.indexOf('%') > 0) {
		image.src = decodeURI(image.src);
	}
}