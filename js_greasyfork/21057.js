// ==UserScript==
// @name        Mturk Expired-Queue-HIT-Death-Loop Rescuer
// @description Redirects to queue view on expired queue HIT and continues on HITs with more time remaining
// @author      DCI
// @version     1.0
// @namespace   www.redpandanetwork.org
// @include     https://www.mturk.com/mturk/myhits?ExpiredRedirect
// @include     https://www.mturk.com/mturk/preview?isPreviousHitExpired*
// @exclude     https://www.mturk.com/mturk/*&groupId*
// @downloadURL https://update.greasyfork.org/scripts/21057/Mturk%20Expired-Queue-HIT-Death-Loop%20Rescuer.user.js
// @updateURL https://update.greasyfork.org/scripts/21057/Mturk%20Expired-Queue-HIT-Death-Loop%20Rescuer.meta.js
// ==/UserScript==

// This script will redirect you to your queue view page when a queued HIT you are working on expires.
// You will then be redirected to the first HIT in your queue that meets the minimum time remaining requirement.
// MinimumTime is in seconds but can be set to a number greater than 60.
var MinimumTime = 30;


if (window.location.toString().indexOf('preview?isPreviousHitExpired') !== -1){
	window.location.replace("https://www.mturk.com/mturk/myhits?ExpiredRedirect");
}

if (window.location.toString() === "https://www.mturk.com/mturk/myhits?ExpiredRedirect"){
	var hit_capsules = document.getElementsByTagName('tbody')[6].children;
	for (f = 0; f < hit_capsules.length; f++){	
		var timer = hit_capsules[f].getElementsByClassName('capsule_field_text')[2].innerHTML;
		var hastime = hit_capsules[f].getElementsByTagName('a')[2].href;		
		if (hit_capsules[f].innerHTML.indexOf('minute') !== -1){
			var minutes = parseInt(timer.split('minutes')[0].trim());
			var seconds = parseInt(timer.split('minutes')[1].split('seconds')[0].trim());
			var remaining = (minutes * 60) + seconds;
			if (remaining >= MinimumTime){
				window.location.replace(hastime);
			}
		}
		else {
			if (hit_capsules[f].innerHTML.indexOf('seconds') !== -1){
				var seconds = parseInt(timer.split('seconds')[0].trim()); 
				if (seconds >= MinimumTime){
					window.location.replace(hastime);
				}
			}				
		}	
	}	
}