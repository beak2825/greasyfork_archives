// ==UserScript==
// @name           BvS Vacation Reminder
// @namespace      TheSpy
// @description    Alerts you when your vacation is ready.
// @include        http*://*animecubed.com/billy/bvs/pages/main.html
// @include        http*://*animecubed.com/billy/bvs/village.html
// @include        http*://*animecubed.com/billy/bvs/villagebeach.html
// @include        http*://*animecubedgaming.com/billy/bvs/pages/main.html
// @include        http*://*animecubedgaming.com/billy/bvs/village.html
// @include        http*://*animecubedgaming.com/billy/bvs/villagebeach.html
// @version        1.12
// @history        1.12 New domain - animecubedgaming.com - Channel28
// @history        1.11 Now https compatible (Updated by Channel28)
// @history        1.10 Added grant permissions (Updated by Channel28)
// @history        1.09 Fixed a DOM issue (temporary fix)
// @history        1.08 The floating bar now only shows on the following pages: main, village, beach
// @history        1.07 Fixed wrong date times for last vacation
// @history        1.06 Date and time are in seperate rows, added vacation stamina, added new year compatibility
// @history        1.05 Added multi character support (forgot it earlier)
// @history        1.04 Updated with game update, added floating bar
// @history        1.03 Fixed an 'Apocalypse Calendar' bug
// @history        1.02 Added 'Apocalypse Calendar' support, supports new year as well
// @history        1.01 Initial release
// @licence        MIT; http://www.opensource.org/licenses/mit-license.php
// @copyright      2010-2011, TheSpy
// @grant          GM_log
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/2497/BvS%20Vacation%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/2497/BvS%20Vacation%20Reminder.meta.js
// ==/UserScript==

const MINUTE = 60 * 1000; //ms
const HOUR = 60 * MINUTE; //ms
const DAY = 24 * HOUR; //ms

/*
	DOM Storage wrapper class (credits: http://userscripts.org/users/dtkarlsson)
	Constructor:
		var store = new DOMStorage({"session"|"local"}, [<namespace>]);
	Set item:
		store.setItem(<key>, <value>);
	Get item:
		store.getItem(<key>[, <default value>]);
	Remove item:
		store.removeItem(<key>);
	Get all keys in namespace as array:
		var array = store.keys();
*/
function DOMStorage(type, namespace)
{
	var my = this;

	if (typeof(type) != "string")
		type = "session";
	switch (type) {
		case "local": my.storage = localStorage; break;
		case "session": my.storage = sessionStorage; break;
		default: my.storage = sessionStorage;
	}

	if (!namespace || typeof(namespace) != "string")
		namespace = "Greasemonkey";

	my.ns = namespace + ".";
	my.setItem = function(key, val) {
		try {
			my.storage.setItem(escape(my.ns + key), val);
		}
		catch (e) {
			GM_log(e);
		}
	},
	my.getItem = function(key, def) {
		try {
			var val = my.storage.getItem(escape(my.ns + key));
			if (val)
				return val;
			else
				return def;
		}
		catch (e) {
			return def;
		}
	}
	// Kludge, avoid Firefox crash
	my.removeItem = function(key) {
		try {
			my.storage.setItem(escape(my.ns + key), null);
		}
		catch (e) {
			GM_log(e);
		}
	}
	// Return array of all keys in this namespace
	my.keys = function() {
		var arr = [];
		var i = 0;
		do {
			try {
				var key = unescape(my.storage.key(i));
				if (key.indexOf(my.ns) == 0 && my.storage.getItem(key))
					arr.push(key.slice(my.ns.length));
			}
			catch (e) {
				break;
			}
			i++;
		} while (true);
		return arr;
	}
}

// UI (credits: http://userscripts.org/users/dtkarlsson)
function Window(id, storage)
{
	var my = this;
	my.id = id;
	my.offsetX = 0;
	my.offsetY = 0;
	my.moving = false;

	// Window dragging events
	my.drag = function(event) {
		if (my.moving) {
			my.element.style.left = (event.clientX - my.offsetX)+'px';
			my.element.style.top = (event.clientY - my.offsetY)+'px';
			event.preventDefault();
		}
	}
	my.stopDrag = function(event) {
		if (my.moving) {
			my.moving = false;
			var x = parseInt(my.element.style.left);
			var y = parseInt(my.element.style.top);
			if(x < 0) x = 0;
			if(y < 0) y = 0;
			storage.setItem(my.id + ".coord.x", x);
			storage.setItem(my.id + ".coord.y", y);
			my.element.style.opacity = 1;
			window.removeEventListener('mouseup', my.stopDrag, true);
			window.removeEventListener('mousemove', my.drag, true);
		}
	}
	my.startDrag = function(event) {
		if (event.button != 0) {
			my.moving = false;
			return;
		}
		my.offsetX = event.clientX - parseInt(my.element.style.left);
		my.offsetY = event.clientY - parseInt(my.element.style.top);
		my.moving = true;
		my.element.style.opacity = 0.75;
		event.preventDefault();
		window.addEventListener('mouseup', my.stopDrag, true);
		window.addEventListener('mousemove', my.drag, true);
	}

	my.element = document.createElement("div");
	my.element.id = id;
	document.body.appendChild(my.element);
	my.element.addEventListener('mousedown', my.startDrag, true);

	if (storage.getItem(my.id + ".coord.x"))
		my.element.style.left = storage.getItem(my.id + ".coord.x") + "px";
	else
		my.element.style.left = "6px";
	if (storage.getItem(my.id + ".coord.y"))
		my.element.style.top = storage.getItem(my.id + ".coord.y") + "px";
	else
		my.element.style.top = "6px";
}

// Parse server time clock
// (credits: http://userscripts.org/users/dtkarlsson)
function parseServerTime()
{
	var clock = document.getElementById("clock");
	if (clock)
		delayedParseServerTime(clock);
}

// Try to parse server time clock periodically. The clock is updated by a timer script
// so it is not available immediately on page load
// (credits: http://userscripts.org/users/dtkarlsson)
function delayedParseServerTime(element)
{
	var match = element.textContent.match(/0?(\d+):0?(\d+):0?(\d+) (.M)/);
	if (match) {
		var hours = parseInt(match[1]);
		var minutes = parseInt(match[2]);
		var seconds = parseInt(match[3]);

		hours = hours % 12;
		if (match[4] == "PM")
			hours += 12;

		var server = new Date();
		server.setHours(hours);
		server.setMinutes(minutes);
		server.setSeconds(seconds);
		server.setMilliseconds(0);

		// Make sure offset is < 0 and > -12h
		var offset = server.getTime() - utcNow();
		if (offset > 0)
			offset -= DAY;
		if (offset < -DAY / 2)
			offset += DAY;

		var oldOffset = getOffset();
		
		if (Math.abs(oldOffset - offset) < 10000)
			offset = Math.round((offset + oldOffset) / 2);

		vacationSettings.setItem("offset", offset);
		vacationSettings.setItem("sync", utcNow());
	} else {
		// Try again in 0.25s
		setTimeout(function() {delayedParseServerTime(element);}, 250);
	}
}

// Parse vacation time
function parseVacationTime()
{
	var match = document.evaluate("//b/font[contains(translate(@color, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '0000a1')]/text()", document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue.nodeValue.match(/ (\d+)\/(\d+) \(.+ (\d+):(\d+)\)/);
	if (match) {
		var month = parseInt(match[1]) - 1;
		var day = parseInt(match[2]);
		var hour = parseInt(match[3]);
		var minute = parseInt(match[4]);
		var date = new Date();
		date.setTime(serverNow());
		var vacationDate = new Date(date.getFullYear(), month, day, hour, minute);
		var vacationTime = vacationDate.getTime();
		// new year issues, substract one year
		if(serverNow() < vacationTime) {
			vacationDate = new Date(date.getFullYear() - 1, month, day, hour, minute);
			vacationTime = vacationDate.getTime();
		}
		vacationSettings.setItem(playerName() + ".vacation", vacationTime);

		var calendar = document.evaluate("//b[contains(.,'Apocalypse Calendar')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		vacationSettings.setItem(playerName() + ".calendar", calendar.snapshotLength > 0 ? 1 : 0);

		var island = document.evaluate("//b[contains(.,'Neo-Monster Island')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		vacationSettings.setItem(playerName() + ".staminabonus", island.snapshotLength > 0 ? 1 : 0);
	}
	else {
	}
}

// Helper function for getting clock offset from localStorage
function getOffset()
{
	var offset;
	try {
		offset = vacationSettings.getItem("offset");
		return parseInt(offset);
	}
	catch (e) {
		GM_log(e);
		return;
	}
}

// Current time in ms since 1970-01-01 UTC
function utcNow()
{
	var d = new Date();
	return d.getTime() + d.getTimezoneOffset() * 60000;
}

// Current server time in ms
function serverNow()
{
	return utcNow() + parseInt(vacationSettings.getItem("offset"));
}

// ...
function vacationTime() {
	return parseInt(vacationSettings.getItem(playerName() + ".vacation"));
}

// ...
function vacationStaminaBonus() {
	return parseInt(vacationSettings.getItem(playerName() + ".staminabonus"));
}

// ...
function calendarUpgrade() {
	return parseInt(vacationSettings.getItem(playerName() + ".calendar"));
}

// ...
function vacationStaminaBonusString() {
	var staminabonus;
	var days = (serverNow() - vacationTime()) / (1000 * 60 * 60 * 24);
	if(calendarUpgrade() == 1) {
		days *= 1.5;
	}
	if(days >= 14) {
		staminabonus = 111; 
	}
	else {
		staminabonus = 5 * Math.floor(days);
	}
	if(vacationStaminaBonus() == 1) {
		staminabonus *= 1.5;
	}
	return Math.floor(staminabonus);
}

// ...
function vacationString() {
	if(vacationTime() <= 0) {
		return "Unknown";
	}
	if(calendarUpgrade() == 1) {
		time = 14 * 24 * 60 * 2 / 3;
	}
	else {
		time = 14 * 24 * 60;
	}
	var dif = time - Math.floor((serverNow() - vacationTime()) / (1000 * 60));
	if(dif > 0) {
		var m = dif % 60;
		dif = (dif - m) / 60;
		var h = dif % 24;
		dif = (dif - h) / 24;
		var d = dif;
		return d + "d " + h + "h " + m + "m";
	}
	else {
		return "Ready";
	}
}

// ...
function twoDigits(n) {
	if (n < 10)
		return "0" + n;
	else
		return "" + n;
}

function timeString(time) {
	time = parseInt(time);
	if(isNaN(time)) {
		return "Unknown";
	}

	var date = new Date();
	date.setTime(time);
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var ampm = (hour >= 12 ? "PM" : "AM");
	hour %= 12;
	if(hour == 0) {
		hour = 12;
	}

	return year + "/" + twoDigits(month) + "/" + twoDigits(day) + "<br/>" + twoDigits(hour) + ":" + twoDigits(minute) + " " + ampm;
}

// ...
function playerName() {
	var player;
	try {
		player = document.evaluate("//input[@name='player' and @type='hidden']", document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue.value;
	}
	catch(e) {
		player = "none";
	}
	return player;
}

// ...
function FloatingVacation() {
	var my = this;

	my.window = new Window("floatingvacation", vacationSettings);

	// Set up floating vacation layer
	GM_addStyle("#floatingvacation {border: 2px solid #111E01; position: fixed; z-index: 100; color: #FFFFFF; background-color: #434411; padding: 4px; text-align: center; cursor: move;}");
	GM_addStyle("#floatingvacation dl {margin: 0; padding: 0;}");
	GM_addStyle("#floatingvacation dt {margin: 0; padding: 0; font-size: 12px;}");
	GM_addStyle("#floatingvacation dd {margin: 0; padding: 0; font-size: 24px;}");

	my.draw = function() {
		if(!isNaN(vacationTime())) {
			my.window.element.innerHTML = "<dl><dt>Last known vacation</dt><dd id='vacationlast'>Unknown</dd><dt>Vacation status</dt><dd id='vacationleft'>Unknown</dd><dt>Vacation stamina</dt><dd id='vacationstamina'>Unknown</dd></dl>";
		}
		else {
			my.window.element.innerHTML = "<dl><dt>Last known vacation</dt><dd id='vacationlast'>Unknown</dd></dl>";
		}
	}

	my.update = function() {
		var nodevacationlast = document.getElementById("vacationlast");
		if (nodevacationlast) {
			nodevacationlast.innerHTML = timeString(vacationTime());
		}

		var vacationleft = document.getElementById("vacationleft");
		if (vacationleft) {
			vacationleft.innerHTML = vacationString();
		}

		var vacationstamina = document.getElementById("vacationstamina");
		if (vacationstamina) {
			vacationstamina.innerHTML = vacationStaminaBonusString();
		}

		setTimeout(my.update, 1000);
	}

	my.draw();
	my.update();
}

if(playerName() != "none") {
	var vacationSettings = new DOMStorage("local", "BvSVacation");
	var floatingVacation = new FloatingVacation();
}

if (/billy.bvs.pages.main\b/.test(location.href) || /billy.bvs.arena/.test(location.href)) {
	parseServerTime();
}
else if (/billy.bvs.villagebeach/.test(location.href)) {
	parseVacationTime();
}