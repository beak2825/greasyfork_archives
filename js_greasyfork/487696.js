// ==UserScript==
// @name        ebb.io 自動重新加載
// @namespace   Violentmonkey Scripts
// @match       https://ebb.io/*
// @grant       none
// @version     1.0.1
// @author      CcydtN
// @description Add button to each episode that helps reload page automatically.
// @require https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/487696/ebbio%20%E8%87%AA%E5%8B%95%E9%87%8D%E6%96%B0%E5%8A%A0%E8%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/487696/ebbio%20%E8%87%AA%E5%8B%95%E9%87%8D%E6%96%B0%E5%8A%A0%E8%BC%89.meta.js
// ==/UserScript==

const flag_name = "reload";
function set_flag(val) {
	sessionStorage.setItem(flag_name, val);
}
function get_flag() {
	return sessionStorage.getItem(flag_name) === "true";
}

const config = {
	attributes: false,
	childList: true,
	characterData: false,
	subtree: true,
};

// Entry point
$(document).ready(() => {
		const observer = new MutationObserver(page_modify);
	observer.observe(document.body, config);
});

// Trigger multiple time
function page_modify(list, observer) {
	// This function is going to modify the page which trigger the observer recursively
	// dissconect to prevent that
	observer.disconnect();

	add_button_for_each_episode();

	const flag = get_flag();
	// console.log({toggle});
	if (!flag) {
		observer.observe(document.body, config);
		return;
	}

	const isError = $(".error-message").length !== 0;
	if (isError) {
		console.log("Detect loading error, try reloading");
		fail_handle();
		observer.observe(document.body, config);
		return;
	}

	const isLoaded = $("video").first().attr("src");
	if (isLoaded) {
		console.log("Video ready, Stop reloading");
		set_flag(false);
	}

	observer.observe(document.body, config);
}

function add_button_for_each_episode() {
	$("div.actions").each(function (index, element) {
		// skip if already append
		if ($(element).children().length !== 1) {
			return;
		}

		const clone = $(this).children().first().clone();
		const href = clone.attr("href");
		const episode_start = href.indexOf("=") + 1;
		const episode = href.substring(episode_start);

		const seasonId_start = href.indexOf("x") + 1;
		const seasonId_end = href.indexOf("&");
		const seasonId = href.substring(seasonId_start, seasonId_end);

		clone.on("click", (event) => {
			console.log("Start reloading");
			event.preventDefault();
			set_flag(true);
			updateWatchHistory(seasonId, episode);
			location.reload();
		});

		clone.attr("href", "javascript:void(0)");
		clone.text("(・∀・)");

		$(this).append(clone);
		console.log(`Button added, episode: ${episode}, seasonId: ${seasonId}`);
	});
}

function fail_handle() {
	// check for a div
	// if exist, it means fail_handle had run already and no need to run again.
	if ($(".error-message div div").length !== 0) {
		return;
	}
	console.log("check");

	delay = 5;
	delay_ns = delay * 1000;
	console.log(`Set timer ${delay}s`);

	// add reload countdown and cancel button to error message
	const counter = $("<a>", { text: delay });
	const content = $("<a>", { text: " 秒後重試... " });
	const cancel = $("<a>", { href: "javascript:void(0)", text: "取消" });

	const message = $("<div>");
	message.append($("<br>"));
	message.append(counter);
	message.append(content);
	message.append(cancel);

	$(".error-message div").append(message);

	const idxs = [];
	idxs.push(
		setTimeout(() => {
			location.reload();
		}, delay_ns),
	); // reload timeout

	for (let i = 1; i <= 5; i += 1) {
		const idx = setTimeout(() => {
			counter.text(counter.text() - 1);
		}, 1000 * i);
		idxs.push(idx);
	}

	cancel.on("click", (event) => {
		console.log("Stop reloading");
		set_flag(false);
		for (const idx of idxs) {
			clearTimeout(idx);
		}
		message.remove();
	});
}

function updateWatchHistory(seasonId, episode) {
	const api_url = "https://ebb.io/_/update_watch_history";

	const title = `"${episode}"`;
	const data = new FormData();

	data.set("seasonId", seasonId);
	data.set("title", title);
	data.set("time", 0);
	console.log({ data });

	const xhttp = new XMLHttpRequest();
	xhttp.open("POST", api_url, false);
	xhttp.send(data);
}
