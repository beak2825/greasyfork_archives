// ==UserScript==
// @name         Icy Snowball Autobuyer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Autobuys Icy Snowball from the Healing Springs every 30-32 mins
// @author       It's free real estate
// @match        http://www.neopets.com/faerieland/springs.phtml?bought=true
// @match        http://www.neopets.com/faerieland/process_springs.phtml?obj_info_id=8428
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/410558/Icy%20Snowball%20Autobuyer.user.js
// @updateURL https://update.greasyfork.org/scripts/410558/Icy%20Snowball%20Autobuyer.meta.js
// ==/UserScript==

$.fn.exists = function () {
	return this.length > 0;
};

const beta = $("#leaveBetaPopup__2020").exists();

const url = window.location.href;
const localTime = "(Local time " + String(new Date()).split(" ")[4] + ")";

const wait = Math.floor(Math.random() * 120000) + 1800000; // 30-32 mins
const refreshTime = new Date().getTime() + wait;

if (url === "http://www.neopets.com/faerieland/process_springs.phtml?obj_info_id=8428") {
	$('<br><br><span id="buy_timer"></span>').appendTo(".errorMessage");
} else if (url === "http://www.neopets.com/faerieland/springs.phtml?bought=true") {
	let NST = $("#nst").text();
	let addText = '<span style="color:green;">Bought Icy Snowball at ' + NST + '<br>' + localTime + '</span><br><br><span id="buy_timer"></span>';
	if (beta) {
		$(".faerie-bye").next().append('<br><br>' + addText);
	} else {
		$(".content p").eq(0).html(addText);
	}
}

const ticking = setInterval(function () {
	let now = new Date().getTime();
	let timeLeft = refreshTime - now;
	let secTotal = Math.floor(timeLeft / 1000);
	let h = Math.floor((secTotal % 86400) / 3600);
	let min = Math.floor((secTotal % 3600) / 60);
	let sec = Math.floor((secTotal % 3600) % 60);

	let timeText = "";
	timeText += h <= 0 ? "" : (h + " h ");
	timeText += min <= 0 ? "" : (min + " min ");
	timeText += sec <= 0 ? ""
		: sec >= 10 ? (sec + " sec ")
		: ("0" + sec + " sec ");
	let duration = "Next snowball: " + timeText;
	document.title = duration;
	$("#buy_timer").html(duration);

	if (timeText === "") {
		duration = "Reloading now!";
		clearInterval(ticking);
		document.title = duration;
		$("#buy_timer").html(duration);
		location.href = "http://www.neopets.com/faerieland/process_springs.phtml?obj_info_id=8428";
	}
}, 1000);