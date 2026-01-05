// ==UserScript==
// @name        Grabber Reboot
// @description yeah
// @namespace   DCI
// @include     https://www.mturk.com/EzGrabber
// @version     1
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/21482/Grabber%20Reboot.user.js
// @updateURL https://update.greasyfork.org/scripts/21482/Grabber%20Reboot.meta.js
// ==/UserScript==

GM_setValue('title',document.title);

var unchanged = 0;

function checkLoop(){
	if (GM_getValue('title') === document.title){
		unchanged++;
	} else {
		unchanged = 0;
		GM_setValue('title',document.title);
	}
	if (unchanged === 10){
		location.reload(true);
	} 
	setTimeout(function(){
		checkLoop();
	},5000);
}

checkLoop();