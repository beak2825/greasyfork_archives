// ==UserScript==
// @name        MHRoutineAM3
// @namespace   https://greasyfork.org/en/users/39779
// @version    	1.0.4
// @description AM3:00
// @author      Elie
// @match		http://mousehuntgame.com/*
// @match		https://mousehuntgame.com/*
// @match		http://www.mousehuntgame.com/*
// @match		https://www.mousehuntgame.com/*
// @match		http://apps.facebook.com/mousehunt/*
// @match		https://apps.facebook.com/mousehunt/*
// @match		http://hi5.com/friend/games/MouseHunt*
// @match		http://mousehunt.hi5.hitgrab.com/*
// @exclude		http://*.google.com/*
// @exclude		https://*.google.com/*
// @exclude		http://www.mousehuntgame.com/canvas/*
// @exclude		https://www.mousehuntgame.com/canvas/*
// @require     https://code.jquery.com/jquery-2.1.4.min.js
// @require     https://update.greasyfork.org/scripts/19116/1309937/MHRoutine.js
// @license 	GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant		unsafeWindow
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/483874/MHRoutineAM3.user.js
// @updateURL https://update.greasyfork.org/scripts/483874/MHRoutineAM3.meta.js
// ==/UserScript==

// when(time in 24 hours) and how long(hours) for taking rest.must be from large to small hour.
restTimes = [ [ 20, 1 ], [ 15, 1 ], [ 3, 7 ] ];

checkTakingRest();
