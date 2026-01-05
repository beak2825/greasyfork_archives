// ==UserScript==
// @name        Background tab setTimeout muffler
// @namespace   BSP
// @description Defers setTimeout calls if no user input has been received for 15 seconds. Useful for stopping background tabs from continuing to use CPU cycles.
// @include     http://*
// @include     https://*
// @exclude	    http://*.google.tld/*
// @exclude	    https://*.google.tld/*
// @exclude	    http://irc.lc/*
// @exclude	    https://irc.lc/*
// @exclude	    http://www.newsblur.com/*
// @exclude	    https://www.newsblur.com/*
// @exclude		http://steamcommunity.com/id*
// @exclude		https://www.duolingo.com/*
// @version     1
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/2390/Background%20tab%20setTimeout%20muffler.user.js
// @updateURL https://update.greasyfork.org/scripts/2390/Background%20tab%20setTimeout%20muffler.meta.js
// ==/UserScript==

var setInterval_old = unsafeWindow.setInterval;
var setTimeout_old = unsafeWindow.setTimeout;
var clearInterval_old = unsafeWindow.clearInterval;
var clearTimeout_old = unsafeWindow.clearTimeout;
var startDate = new Date;

//QueuedTimer format: {ID: [startTime, repeat, func, delay, args]}
var queuedTimers = null;
//ActiveTimer format: {ID: [repeat, func, delay, args, browserTimerID]}
var activeTimers = {};
var nextID = 1000000;
var lastUserInteraction = Date.now();

function debugLog() {
	false && console && console.log && console.log(Array.slice(arguments, 0));
}

function muffleTimers() {
	return (Date.now() - lastUserInteraction) > 15000;
}

function addTimer(ID, repeat, func, delay, args, isNew) {
	if(typeof func != "function" && typeof func != "string") {
		debugLog("addTimer", "invalid func", arguments);
		throw Error("setInterval/setTimeout: invalid func");
	}
	delay = +(delay || 0); //coerce to number
	if(isNaN(delay)) { //check for NaN (results from non-number strings/objects, etc.)
		debugLog("addTimer", "invalid delay", arguments);
		throw Error("setInterval/setTimeout: invalid delay");
	}
	
	//if(Object.keys(queuedTimers || {}).length + Object.keys(activeTimers).length > 500 && new Date - startDate > 15000) {
	//	debugLog("addTimer", "More than 100 timers!? Fuck that!", arguments);
	//	throw Error("STFU PLZ");
	//}
	
	if(muffleTimers()) {
		if(!queuedTimers) queuedTimers = {};
		isNew && debugLog("addTimer", "Deferred", [ID, repeat, delay, func]);
		queuedTimers[ID] = [Date.now(), repeat, func, delay, args];
	} else {
		var browserTimerID = setTimeout_old(execTimer, delay, ID, repeat, func, delay, args);
		isNew && debugLog("addTimer", "Scheduled", [ID, repeat, delay, func]);
		activeTimers[ID] = [repeat, func, delay, args, browserTimerID];

	}
	return ID;
}

function execTimer(ID, repeat, func, delay, args) {
	delete activeTimers[ID];
	debugLog("execTimer", "Executing", ID, repeat);
	
	//Re-add to the list so it can be cleared while in progress
	if(repeat) {
		addTimer(ID, repeat, func, delay, args, false);
	}
	
	try {
		if(typeof func == "string") {
			(function() { unsafeWindow.eval(func); }).apply(unsafeWindow);
		} else {
			func.apply(unsafeWindow, args);
		}
	} catch(ex) { /* Silence it like JS normally does */ debugLog("execTimer", "Error", arguments, ex); }
	
}

function onUserInteraction(event) {
	lastUserInteraction = Date.now();
	//If any timers are queued, restart them
	if(queuedTimers) {
		debugLog("onUserInteraction", "Processing deferred timers", arguments, queuedTimers);
		try {
			for(var ID in queuedTimers) {
				//QueuedTimer format: {ID: [startTime, repeat, func, delay, args]}
				var timer = queuedTimers[ID];
				var delay = Math.max(0, timer[0] + timer[3] - Date.now());

				var browserTimerID = setTimeout_old(execTimer, delay, ID, timer[1], timer[2], timer[3], timer[4]);
				//ActiveTimer format: {ID: [repeat, func, delay, args, browserTimerID]}
				activeTimers[ID] = [timer[1], timer[2], timer[3], timer[4], browserTimerID];
				delete queuedTimers[ID];
			}
		} catch(ex) {
			debugLog("onUserInteraction", "Error", ex);
		}
		queuedTimers = null;
	}
	removeEventListener("mousemove", onUserInteraction);
	removeEventListener("keydown", onUserInteraction);
	
	setTimeout_old(function() {
		addEventListener("mousemove", onUserInteraction);
		addEventListener("keydown", onUserInteraction);
	}, 5000);
}

addEventListener("mousemove", onUserInteraction);
addEventListener("keydown", onUserInteraction);


unsafeWindow.setInterval = function setInterval() {
	var func = arguments[0];
	var delay = arguments[1];
	var args = Array.slice(arguments, 2);
	return addTimer(nextID++, true, func, delay, args, true);
};


unsafeWindow.setTimeout = function setTimeout() {
	var func = arguments[0];
	var delay = arguments[1];
	var args = Array.slice(arguments, 2);
	return addTimer(nextID++, false, func, delay, args, true);
};

function clearTimer(ID) {
	if(queuedTimers && typeof(queuedTimers[ID]) != "undefined") {
		debugLog("clearTimer", "Clearing deferred timer", arguments);
		delete queuedTimers[ID];
	}
	if(typeof(activeTimers[ID]) != "undefined") {
		debugLog("clearTimer", "Clearing active timer", arguments);
		clearTimeout(activeTimers[ID][4]);
		delete activeTimers[ID];
	}
};

unsafeWindow.clearTimeout = clearTimer;
unsafeWindow.clearInterval = clearTimer;