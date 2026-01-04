// ==UserScript==
// @name         Youtube AdSkipper Revamped
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.6
// @description  Automatically skips the so called "unskippable" ads
// @author       TetteDev
// @match        https://www.youtube.com/*
// @match        https://www.youtube.com/watch?v=*
// @match        https://youtu.be/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require      https://greasyfork.org/scripts/478390-tettelib/code/TetteLib.js
// @grant        window.onurlchange
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/478010/Youtube%20AdSkipper%20Revamped.user.js
// @updateURL https://update.greasyfork.org/scripts/478010/Youtube%20AdSkipper%20Revamped.meta.js
// ==/UserScript==

const allowCostmeticAdCleanup = false;
const runGenericAdCleanupOnAllPages = false;
const adIdentifiers = '#action-companion-click-target, .ytd-action-companion-ad-renderer, ytd-merch-shelf-renderer, yt-mealbar-promo-renderer, #fulfilled-layout, .ytd-ad-slot-renderer, a#endpoint[title*="Kids"], .ytd-in-feed-ad-layout-renderer';

function Entrypoint() {
	// If tampermonkeys 'window.onurlchange' event is supported use that also
	if (window.onurlchange === null) {
		window.addEventListener('urlchange', ytUrlChanged);
	}
	window.addEventListener('popstate', ytUrlChanged);
	window.addEventListener('hashchange', ytUrlChanged);
	document.addEventListener('yt-navigate-start', ytUrlChanged);
	document.addEventListener('yt-navigate-finish', ytUrlChanged);

	ytUrlChanged(null);
}

let videoPlayer = null;
let timeUpdateTicks = 0;
let skippedAdLastTick = false;

function handleAdElements(elements) {
	function isSingleElement(e) { return e instanceof Element || e instanceof HTMLDocument; };
	function removeWithMessage(e, strMessage) { if (strMessage) console.log(strMessage); e.remove(); if (e) e.remove(); }

	if (!elements) return;

	// If a single element was passed, make it into an array so we can keep the existing ad cleanup code (looping over each ad element in the array etc)
	if (isSingleElement(elements))
		elements = [elements];

	elements.forEach((ad) => {
		if (!ad) return;

		// Handle the different types here
		switch (ad.tagName.toLowerCase()) {
			case "yt-mealbar-promo-renderer":
				var parent = traverseParentsUntil(ad, (e) => e.tagName.toLowercase() === "tp-yt-paper-dialog", 5);
				if (parent) removeWithMessage(parent, `Removed Element: ${parent}`);
				break;
			default:
				removeWithMessage(ad, `Removed Element: ${ad}`);
		}
	});
}
function ytOnArrivedGenericPage() {
	let elements = document.querySelectorAll(adIdentifiers);
	if (elements.length < 1) return;
	handleAdElements(elements);
}
function ytOnArrivedHomePage() {
	ytOnArrivedGenericPage();
	return;

	// TODO: eventually have any home page specific cleaning in here
}
function ytOnArrivedVideoPage() {
	ytOnArrivedGenericPage();
	return;

	// TODO: eventually have any video page specific cleaning in here
}
function ytSkippedAdLastTick() {
	skippedAdLastTick = false;
	const unskippableAdBundleElement = document.querySelectorAll(adIdentifiers);
	if (unskippableAdBundleElement.length > 0) {
		handleAdElements(unskippableAdBundleElement);
	}
}

let lastFireUrl = null;
function hasFiredForUrl(strCurrentUrl) {
	let hasFired = lastFireUrl === null ? false : (strCurrentUrl && strCurrentUrl === lastFireUrl ? true : false);
	if (!hasFired) lastFireUrl = strCurrentUrl;
	return hasFired;
}

function ytUrlChanged(e) {
	if (hasFiredForUrl(location.href)) { /*console.log("Prevented uncessesary execution of 'ytUrlChanged'");*/ return; }
	//console.log("Unique url encountered inside 'ytUrlChanged'");

	if (allowCostmeticAdCleanup) {
		if (runGenericAdCleanupOnAllPages) ytOnArrivedGenericPage();
		else {
			if (isYoutubeHomeUrl()) ytOnArrivedHomePage();
			else if (isYoutubeVideoUrl()) ytOnArrivedVideoPage();
			else console.log(`Unhandled Page: '${location.href}'`);
		}
	}

	const progressBarClasses = ".ytp-progress-bar, .ytp-progress-bar-container";

	const timeoutThreshold = 3000;
	const progressBarMustBeVisibleToEye = false;
	waitForElementWithTimeout(progressBarClasses, progressBarMustBeVisibleToEye, timeoutThreshold)
	.then((progressBar) => {
		videoPlayer = tryGetPlayer();
		if (!videoPlayer) { simulateNotification("An exception occured", "Could not resolve the video player element, try refreshing the page and notify the developer!", "error", -1); debugger; return; }
		timeUpdateTicks = 0;
		videoPlayer.addEventListener("timeupdate", ytprogressBarTimeChanged, { passive: true, capture: true });
	})
	.catch((error) => {
		if (!error.toString().includes("Timeout")) { throw error; }
		else {
			// We timed out trying to find the progressBar element
			// TODO: figure out whats the best course of action here
		}
	});
}
function ytprogressBarTimeChanged(e) {
	// only every 'nAdCheckingFrequencyTicks' times ytprogressBarTimeChanged gets called it
	// should check if any ads are playong
	// adjust this for either faster (lower number, but not smaller than 1), or slower (higher number)
	// reaction to ads popping up
	const nAdCheckingFrequencyTicks = 2;
	timeUpdateTicks += 1;
	if (nAdCheckingFrequencyTicks > 1 && (timeUpdateTicks % nAdCheckingFrequencyTicks != 0)) return;

	if (!videoPlayer) {
		videoPlayer = (e.currentTarget || tryGetPlayer() || (e.srcElement !== null && e.srcElement.tagName.toLowerCase() == "video" ? e.srcElement : null));
		if (!videoPlayer) {
			simulateNotification("An exception occured", "Could not resolve the video player element, try refreshing the page!", "error", -1);
			debugger;
			return;
		}
	}

	let unskippableAd = isAdPresent();
	let skippableAd = isSkipAdButtonPresent();
	if (skippableAd) {
		skippableAd.click();
	}

	if (unskippableAd) {
		videoPlayer.currentTime = (videoPlayer.duration !== null) && isFinite(videoPlayer.duration) ? videoPlayer.duration : 2149200.0 /* longest video on youtube, ~570 hours, should be longer than any ad served to you */;
	}

	if (allowCostmeticAdCleanup && (skippableAd || unskippableAd)) {
		if (skippedAdLastTick) ytSkippedAdLastTick();
		else skippedAdLastTick = true;
	}
}

function tryGetPlayer() {
	const playerMainclass = ".html5-main-video";
	const player = document.querySelector(`${playerMainclass}, video`);
	return player;
}
function isSkipAdButtonPresent() {
	const adSkipButtonClasses = ".videoAdUiSkipButton,.ytp-ad-skip-button";
	return document.querySelector(adSkipButtonClasses);
}
function isAdPresent() {
	const adClasses = ".ytp-ad-text, .ytp-ad-simple-ad-badge, .ytp-ad-player-overlay-instream-info";
	return document.querySelector(adClasses) != null;
}
function isYoutubeVideoUrl() {
	const watchFlag = "watch?v=";
	return location.href.includes(watchFlag);
}
function isYoutubeHomeUrl() {
	const homeUrl = "https://www.youtube.com/";
	return location.href === homeUrl;
}

Entrypoint();