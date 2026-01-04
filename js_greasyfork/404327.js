// ==UserScript==
// @name         Nightbot giveaways
// @version      0.2
// @match        https://nightbot.tv/*
// @description  Predictable winner generation for Nightbot giveaways (https://docs.nightbot.tv/control-panel/giveaways)
// @author       Kaimi
// @homepageURL  https://kaimi.io/
// @namespace    https://greasyfork.org/users/228137
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/404327/Nightbot%20giveaways.user.js
// @updateURL https://update.greasyfork.org/scripts/404327/Nightbot%20giveaways.meta.js
// ==/UserScript==

// Winner username on Twitch.tv
var winner = 'lirik';
// Delay after page load (in ms)
var loadDelay = 3000;
// Debug mode
var debugMode = true;

// Tampermonkey run-at won't work for Nightbot, because of dynamic UI generation
var observer = new MutationObserver(resetTimer);

// Wait for the page to stay still for specified time
var timer = setTimeout(action, loadDelay, observer);
observer.observe(document, {childList: true, subtree: true});

function resetTimer(changes, observer)
{
	clearTimeout(timer);
	timer = setTimeout(action, loadDelay, observer);
}

// Set button handlers when UI is likely consistent
function action(o)
{
	o.disconnect();
	setHandler();
}

// Set handlers fo Run and Re-Run buttons
function setHandler()
{
	window.crypto.getRandomValues = c_getRandomValues;
}

// Predictable constants for 'users' array shuffling
function c_getRandomValues(arr)
{
	var winnerPos = getWinnerPosition();
	if (winnerPos != -1)
	{
		if (debugMode)
			console.log("Winner position: " + winnerPos);
	
		var winConst = getWinningConsts(winnerPos);
		
		if (debugMode)
			console.log("Winning constant: " + winConst);

		arr.fill(winConst);
		return;
	}

	arr = Array.from({length: arr.length}, () => Math.floor(Math.random() * arr.length));
}

// Nightbot shuffle function copy
function shuffleTest(e, val)
{
	var t;
	var o;
	var n = e.length;
	var a = new Uint8Array(n);

	for (a.fill(val); n > 1; )
	{
		t = a[n - 1] % n;
		o = e[--n];
		e[n] = e[t];
		e[t] = o;
	}
	return e;
}

// Get winning constant for custom random
function getWinningConsts(winnerPos)
{
	var users = getUsers();
	if (users)
	{
		var ulen = users.length;
		var winPos = winnerPos;

		// Bruteforce required const
		for(var i = 0; i < ulen * 2; i++)
		{
			var uCopy = [...users];
			shuffleTest(uCopy, i);
			
			if (uCopy[0].name == winner || uCopy[0].displayName == winner)
			{
				return i;
			}
		}
	}

	console.log("Can't determine winning const");

	return -1;
}

// Winner position within 'users' array
function getWinnerPosition()
{
	var users = getUsers();
	if (users)
	{
		var ctr = 0;
		for (var user in users)
		{
			if (users[user].name == winner || users[user].displayName == winner)
				return ctr;

			ctr++;
		}
	}

	console.log("Can't find '" + winner + "' in 'users' array");
	if (debugMode)
	{
		console.log("Winners array ");
		console.log(users);
	}

	return -1;
}

// Users list with additional filtering (from original code)
// Required for elements order consistency during extraction from Object
function getUsers()
{
	var users = angular.element("button[ng-click='giveaway()']").scope().users;
	if (users)
	{
		return Object.values(users).filter(function(e) {
			return e.eligible
		});
	}
	else
	{
		console.log("Can't find 'users' array");
	}

	return users;
}

function getUsersTotal()
{
	return Object.keys(angular.element("button[ng-click='giveaway()']").scope().users).length;
}
