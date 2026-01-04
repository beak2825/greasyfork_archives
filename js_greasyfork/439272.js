// ==UserScript==
// @name         UserLocal register assist
// @namespace    https://twitter.com/petpetv
// @version      1.0.7
// @description  YouTubeの立ってる枠をUserLocalに登録するのを助けるやーつ
// @author       petpetv
// @icon         https://www.google.com/s2/favicons?domain=youtube.com&sz=64
// @match        https://www.youtube.com/*
// @match        https://virtual-youtuber.userlocal.jp/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-end
// @noframes
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/439272/UserLocal%20register%20assist.user.js
// @updateURL https://update.greasyfork.org/scripts/439272/UserLocal%20register%20assist.meta.js
// ==/UserScript==

const $ = (s, elm = document) => elm.querySelector(s);
const userlocal = new URL("https://virtual-youtuber.userlocal.jp/schedules/new");
const send = ["platform", "channelId", "videoId", "author", "title", "startDate"];
const setTimeout = typeof window.requestIdleCallback === "function"
	? (callback, timeout) =>
		window.requestIdleCallback(callback, {
			timeout,
		})
	: (callback, timeout) => window.setTimeout(callback, timeout);

void function () {
	"use strict";

	if (location.hostname !== "www.youtube.com") {
		return;
	}

	let menu;
	const fn = function () {
		const $app = $("ytd-app");
		const tag = $("#scriptTag")?.textContent;
		const videoData = $app?.$?.["page-manager"]?.data?.playerResponse?.videoDetails;
		if (!$app) {
			return setTimeout(fn, 1000);
		}
		if (!$app.isWatchPage) {
			return;
		}
		if (!tag || !videoData) {
			return setTimeout(fn, 1000);
		}
		if (!videoData.isLiveContent) {
			return;
		}
		const query = Object.fromEntries(
			Object.entries({
				platform: $app.titleSuffix,
				...videoData,
				startDate: JSON.parse(tag || "{}")?.publication?.[0]?.startDate || 0,
			}).filter(([key]) => send.includes(key)),
		);
		userlocal.search = new URLSearchParams(query);
		menu = GM_registerMenuCommand(`Open User Local`, () => window.open(userlocal), "userlocal");
	};
	window.addEventListener("yt-navigate-finish", fn);
	window.addEventListener("yt-navigate-finish", () => {
		GM_unregisterMenuCommand(menu);
		if ($("#scriptTag")) $("#scriptTag").textContent = "";
	});
}();

void function () {
	"use strict";

	if (location.hostname !== userlocal.hostname) {
		return;
	}

	GM_registerMenuCommand("Set E-mail", () => {
		const message = `Set the E-mail address.\nIt will be used for userlocal's "E-mail address for deletion work".`;
		GM_setValue("Email", window.prompt(message, GM_getValue("Email", "")) || GM_getValue("Email", ""));
		if (location.pathname === userlocal.pathname) {
			$("#live_schedule_email").value = GM_getValue("Email", "");
		}
	}, "Email");
	GM_registerMenuCommand("Set YouTube Channel IDs", () => {
		const message = `Set your owned channel IDs.\nIf Multiple IDs, Use comma-separated.\ne.g. UC*** , UC*** , UC***`;
		GM_setValue("youtube", window.prompt(message, GM_getValue("youtube", "")) || GM_getValue("youtube", ""));
	}, "youtube");

	if (location.pathname !== userlocal.pathname) {
		return;
	}

	const $l = (s) => $(`#live_schedule_${s}`);
	const sp = new URL(location).searchParams;

	$l("email").value = GM_getValue("Email", "");
	$l("title").value = $l("nickname").value ? `${$l("nickname").value}の配信` : $l("title").value;
	$l("live_url").value = $l("channel_url").value ? $l("channel_url").value + "/live" : $l("live_url").value;
	$l("owner_flag_other").checked = true;

	new MutationObserver((_, self) => {
		self.disconnect();
		jQuery("#nickNameFormGroup").show();
	}).observe($("#nickNameFormGroup"), {
		attributeFilter: ["style"],
	});

	if (sp.get("platform") === "YouTube") {
		$l("title").value = sp.has("title") ? sp.get("title") : $l("title").value;
		$l("evidence_url").value = sp.has("videoId") ? `https://www.youtube.com/watch?v=${sp.get("videoId")}` : $l("evidence_url").value;

		if (sp.has("author")) {
			$l("nickname").value = sp.get("author");
			$l("nickname").readOnly = true;
		}
		if (sp.has("channelId")) {
			const channelId = sp.get("channelId");
			$l("channel_url").value = `https://www.youtube.com/channel/${channelId}`;
			$l("live_url").value = $l("channel_url").value + "/live";
			if (GM_getValue("youtube", "").split(",").some((v) => v.trim() === channelId)) {
				$l("owner_flag_owner").checked = true;
			}
		}
		if (sp.has("startDate")) {
			const dateObj = new Date(sp.get("startDate"));
			const d = {
				date: new Intl.DateTimeFormat("ja-JP", {
					dateStyle: "short",
				}).format(dateObj),
				hour: dateObj.getHours().toString(),
				minute: dateObj.getMinutes().toString(),
			};
			for (const v of ["date", "hour", "minute"]) {
				const elm = Array.from($l(v).options).find(({ value }) => value === d[v]);
				if (elm instanceof HTMLOptionElement) {
					elm.selected = true;
				} else {
					return setTimeout(() => {
						window.alert(`"${v} ${d[v]} is out of range."`);
						$l(v).focus();
					}, 1000);
				}
			}
		}
	}
	if (!$l("email").value) {
		$l("email").focus();
	} else {
		$(`#new_live_schedule input[type="submit"]`).focus();
		window.scrollTo(0, 0);
	}
}();
