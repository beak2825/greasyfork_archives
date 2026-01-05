// ==UserScript==
// @name            daily show marathon auto mute
// @description     daily show marathon auto mute on ads
// @version         2
// @namespace	    daily-show-marathon-auto-mute
// @include http://content.uplynk.com/player/*dailyshowmarathon*
// @downloadURL https://update.greasyfork.org/scripts/11031/daily%20show%20marathon%20auto%20mute.user.js
// @updateURL https://update.greasyfork.org/scripts/11031/daily%20show%20marathon%20auto%20mute.meta.js
// ==/UserScript==

if (document.location.href.indexOf("http://content.uplynk.com/player/") == 0) {

new function() {
	unsafeWindow._OnPlayerEvent = unsafeWindow.OnPlayerEvent;
	unsafeWindow.OnPlayerEvent = function(e, p1, p2) {
		if (p1.desc.indexOf("extad") == 0)
			$("#videoHolder").player('muted', true)
		else
			$("#videoHolder").player('muted', false)
		
		unsafeWindow._OnPlayerEvent(e, p1, p2);
	}
}

}