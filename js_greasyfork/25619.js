// ==UserScript==
// @author      pongo
// @name        YouTube Auto Speed
// @namespace   Юзерскрипт и букмарклеты для автоматического изменения скорости ютуба
// @description Автоматического изменения скорости ютуба
// @include     *.youtube.com/watch*
// @version     1.0
// @grant       unsafeWindow
// @grant       console.log
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/25619/YouTube%20Auto%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/25619/YouTube%20Auto%20Speed.meta.js
// ==/UserScript==

var speed = 1.2;

var count = 0;
var id = setInterval(function() {
	if ( unsafeWindow.document.getElementsByClassName("video-stream html5-main-video").length > 0 ) {
	  unsafeWindow.document.getElementsByClassName("video-stream html5-main-video")[0].playbackRate = speed;
		clearInterval(id); 
		return;
	}
	
	count++;
	if (count > 50) { clearInterval(id); return; }
}, 300);
