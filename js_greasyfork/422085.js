// ==UserScript==
// @name        RedditGifts Timezone Adjuster
// @namespace   https://www.reddit.com/user/TheRadiantAxe
// @match       http*://www.redditgifts.com/*
// @run-at      document-start
// @grant       none
// @version     1.1
// @author      u/TheRadiantAxe
// @description Adjust the "last pulled" time to the local time
// @downloadURL https://update.greasyfork.org/scripts/422085/RedditGifts%20Timezone%20Adjuster.user.js
// @updateURL https://update.greasyfork.org/scripts/422085/RedditGifts%20Timezone%20Adjuster.meta.js
// ==/UserScript==

main();

function main() {
	inject_xhr_listener();
}

function inject_time(stamp) {
	var month = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	][stamp.getMonth()];
	
	var element = document.querySelector('.participating-list li:nth-of-type(3)');
	element.textContent = `Your Santa last pulled your information on ${month} ${stamp.getDate()}, ${stamp.getFullYear()} at ${stamp.toLocaleTimeString()} Local Time`;
}

function process_exchange_status(status) {
	// Parse the JSON
	status = JSON.parse(status);
	
	// Parse the timestamp
	if (!status.data.asGiftee.lastRetrieved) return;
	var timestamp = status.data.asGiftee.lastRetrieved.split('T');
	timestamp = parse_timestamp(timestamp);
	
	// Inject it
	inject_time(timestamp);
}

function inject_xhr_listener() {
	// Monkey-patch XMLHttpRequest
	
	var XMLHttpRequest_open = unsafeWindow.XMLHttpRequest.prototype.open;
	unsafeWindow.XMLHttpRequest.prototype.open = function open(method, url, ...args) {
		var path = new URL(url, window.location.href).pathname.split('/');
		if (
			path[1] == 'api'
			&&
			path[2] == 'v1'
			&&
			path[3] == 'exchanges'
			&&
			path[5] == 'status'
		) {
			this.addEventListener("load", () => {
				process_exchange_status(this.responseText);
			});
		}
		
		return XMLHttpRequest_open.call(this, method, url, ...args);
	}
}

function parse_timestamp(timestamp) {
	// Format: 2021-01-11T20:58:56
	var date = timestamp[0].split('-');
	var time = timestamp[1].split(':');
	timestamp = new Date(0);
	timestamp.setUTCFullYear(date[0], date[1] - 1, date[2]);
	timestamp.setUTCHours(time[0], time[1], time[2]);
	
	// Adjust timezone
	// Advance time by 8 hours because PST is 8 hours behind UTC
	var timestamp_ms = timestamp.valueOf() + (8 * 60 * 60 * 1000) + timestamp.getTimezoneOffset();
	
	return new Date(timestamp_ms);
}
