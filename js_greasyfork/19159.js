// ==UserScript==
// @name        MouseHunt Routine Schedule AM2
// @author      Elie
// @version    	1.2.1
// @description Leave and reload MouseHunt by leaving time and leaving hours.Sleep on AM2:00
// @require     https://code.jquery.com/jquery-2.1.4.min.js
// @namespace   https://greasyfork.org/en/users/39779-elie-cheng
// @license 	GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @include		http://mousehuntgame.com/*
// @include		https://mousehuntgame.com/*
// @include		http://www.mousehuntgame.com/*
// @include		https://www.mousehuntgame.com/*
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @include		http://hi5.com/friend/games/MouseHunt*
// @include		http://mousehunt.hi5.hitgrab.com/*
// @exclude		http://*.google.com/*
// @exclude		https://*.google.com/*
// @exclude		http://www.mousehuntgame.com/canvas/*
// @exclude		https://www.mousehuntgame.com/canvas/*
// @grant		unsafeWindow
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/19159/MouseHunt%20Routine%20Schedule%20AM2.user.js
// @updateURL https://update.greasyfork.org/scripts/19159/MouseHunt%20Routine%20Schedule%20AM2.meta.js
// ==/UserScript==

var debug = false;
// when(time in 24 hours) and how long(hours) for taking rest.must be from large to small hour.
var restTimes = [ [ 19, 2 ], [ 14, 2 ], [ 2, 7 ] ];
// url to count down rest time and then return to game
var url = 'https://elie2201.github.io/mh/mhReloader.html?duration=';
// interval for checking if take rest(second)
var checkingInterval = 300;
// max minutes to be randomized and then added to rest time.To make taking rest time random.
var nowTimeShiftRange = 30;
var theInterval = setInterval(function() {
	// randomized interval to be added to rest time
	var nowTimeShift = Math.floor((Math.random() - 0.5) * nowTimeShiftRange * 60 * 1000);
	// now time(no date, time only) in millisecond
	var nowTime = ((Date.parse(new Date()) + 28800000) % (24 * 60 * 60 * 1000));
	// in loop, if a interval is matched, break the loop
	var timeSectionMatched = false;
	for (var i = 0; i < restTimes.length; i ++) {
		if (nowTime > restTimes[i][0] * 60 * 60 * 1000 + nowTimeShift + restTimes[i][1] * 60 * 60 * 1000) {
			timeSectionMatched = true;
			if (debug)
				console.log('above time section ' + i + ', do nothing');
		} else if (nowTime > restTimes[i][0] * 60 * 60 * 1000 + nowTimeShift) {
			timeSectionMatched = true;
			if (debug) {
				console.log('during rest time section ' + i);
				console.log(restTimes[i][0] * 60 * 60 * 1000 + nowTimeShift + restTimes[i][1] * 60 * 60 * 1000 - nowTime);
				return;
			}
			var leaveTimeout = setTimeout(function() {
				// rest early, come back early; rest late, come back late.
				var duration = restTimes[i][0] * 60 * 60 * 1000 + nowTimeShift + restTimes[i][1] * 60 * 60 * 1000 - nowTime;
				// clearTimeout(leaveTimeout);
				// clearInterval(theInterval);
				window.open(url + duration, '_self');
			},20000);
		}
		if (timeSectionMatched) {
			break;
		}
	}
}, checkingInterval * 1000);
