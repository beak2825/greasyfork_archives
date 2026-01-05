// ==UserScript==
// @namespace   raina
// @name        Bandcamp Album Length
// @author      raina
// @description Sums up the lengths of Bandcamp album tracks and gives you a total album runtime up top.
// @version     2.3
// @include     *
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26643/Bandcamp%20Album%20Length.user.js
// @updateURL https://update.greasyfork.org/scripts/26643/Bandcamp%20Album%20Length.meta.js
// ==/UserScript==
window.self === window.top && window.siteroot && "https://bandcamp.com" == window.siteroot && (function() {

	let tracks = document.querySelectorAll('#track_table .title .time');
	if (tracks.length) {
		let runtime = document.createElement("span");
		let mul = [1, 60, 60 * 60];
		let total = 0;
		let duration = "";
		let time;
		let section;
		let digits;
		let hours;
		let minutes;

		for (let i = 0; i < tracks.length; i++)	{
			time = tracks[i].textContent.trim();
			section = 0;
			while (time) {
				digits = Number(time.slice(time.lastIndexOf(":") + 1));
				total += digits * mul[section];
				if (0 > time.lastIndexOf(":")) break;
				time = time.slice(0, time.lastIndexOf(":"));
				section++;
			}
		}

		hours = Math.floor(total / mul[2]);
		if (1 <= hours) {
			duration = hours + ":";
			total -= hours * mul[2];
		}

		minutes = Math.floor(total / mul[1]);
		if (duration) {
			duration += ("0" + minutes).slice(-2) + ":";
		} else {
			duration = minutes + ":";
		}
		if (1 <= minutes) {
			total -= minutes * mul[1];
		}

		duration += ("0" + total).slice(-2);
		runtime.textContent = "Total runtime: " + duration;
		runtime.style = "display: inline-block; float: right;";
		document.querySelector('#name-section h3').insertBefore(runtime, document.querySelector('#name-section h3 [itemprop="byArtist"]'));
	}

}());
