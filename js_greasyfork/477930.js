// ==UserScript==
// @name         Youtube AdSkipper
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       TetteDev @ greasyfork.org
// @license      MIT
// @match        https://www.youtube.com/*
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477930/Youtube%20AdSkipper.user.js
// @updateURL https://update.greasyfork.org/scripts/477930/Youtube%20AdSkipper.meta.js
// ==/UserScript==

// These can be freely adjusted by the end user of this script
// depending on what you want the script behaviour to be
const opt_HideAds = true;
const opt_MuteAds = true;
const opt_SkipAds = true;
const opt_ApplyCosmeticFixes = false;
const opt_SupressNotifications = false;

const opt_CosmeticQueries
    = [/*{
		query: '//*[@id="dismissible"]',
		// specifies wether 'query' is xpath syntax or syntax that can be used in querySelector/querySelectorAll
		type: "xpath",
		// will call this on any found elements from the query provided before doing anything to the element
		elementPostProcessing: null,
		// if this is not null, it will call this instead of .remove() on the element
		overrideCustomElementRemove: null,
	},*/
	{
		query: '//*[@id="player-ads"]',
		type: "xpath",
		elementPostProcessing: null,
		overrideCustomElementRemove: null,
	},
	{
		query: '//*[@id="rendering-content"]',
		type: "xpath",
		elementPostProcessing: null,
		overrideCustomElementRemove: null,
	}];

let progressBarUpdateTicks = 0;
let videoPlayer = null;

function Main() {
	progressBarUpdateTicks = 0;
	videoPlayer = null;

	waitForElement('.ytp-progress-bar').then((progressBar) =>
	{
		applyCosmeticRules(opt_CosmeticQueries);

		videoPlayer = document.querySelector('video');
		if (!videoPlayer) { simulateNotification("Youtube Adskipper - Exception", "Could not resolve 'video' element, please notify the developer", "error"); debugger; return; }

		videoPlayer.addEventListener("timeupdate", progressBarTimeChanged);
		document.addEventListener('yt-navigate-start', urlChangedNativeStart);
		document.addEventListener('yt-navigate-finish', urlChangedNativeEnd);
		window.addEventListener('popstate', urlChangedPopState);
	});
}

Main();

function urlChangedNativeStart() {
	Main();
}

function urlChangedNativeEnd() {
	Main();
}

function urlChangedPopState() {
	Main();
}

function progressBarTimeChanged() {
	// Only do something on every n-th tick of progressBarTimeChanged being called
	const nthTick = 2;
	if (++progressBarUpdateTicks % nthTick != 0) return;
	if (isAdShowing()) {
		if (!videoPlayer) {
			videoPlayer = document.querySelector('video');
			if (!videoPlayer) { simulateNotification("Youtube Adskipper - Exception", "Could not resolve 'video' element, please notify the developer", "error"); debugger; return; }
			else videoPlayer.addEventListener("timeupdate", progressBarTimeChanged);
		}

		if (opt_MuteAds) videoPlayer.volume = 0;
		if (opt_SkipAds) {
			videoPlayer.currentTime = videoPlayer.duration + 1.0;
			const skipButton = isSkipAdButtonPresent();
			if (skipButton) skipButton.click();
		}
		if (opt_HideAds) videoPlayer.style.cssText = 'backdrop-filter: blur(2px);webkit-backdrop-filter: blur(2px);filter: blur(2px);';
		simulateNotification("Ad Skipped!", "Ad skipped successfully!", "info", 1000);
	}
}

function waitForElement(selector) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) {resolve(el);}
    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(document.querySelectorAll(selector)).forEach((element) => {
        resolve(element);
        //Once we have resolved we don't need the observer anymore.
        observer.disconnect();
      });
    })
      .observe(document.documentElement, {
        childList: true,
        subtree: true
      });
  });
}
function isAdShowing() {
	let adClasses = [".ytp-ad-text", ".ytp-ad-simple-ad-badge", ".ytp-ad-player-overlay-instream-info"]
	for (let i = 0; i < adClasses.length; i++)
		if (document.querySelector(adClasses[i]) != null) return true;
	return false;
}
function isSkipAdButtonPresent() {
	return document.querySelector('.videoAdUiSkipButton,.ytp-ad-skip-button');
}
function applyCosmeticRules(arrayQueries) {
	if (!opt_ApplyCosmeticFixes) return;
	if (!arrayQueries) return;
	if (arrayQueries.length < 1) return;

	for (let i = 0; i < arrayQueries.length; i++)
	{
		let current = arrayQueries[i];
		let currentQuery = current.query;
		let currentQueryRemovalType = current.type;
		let returnedElements = null;

		if (currentQueryRemovalType === "xpath")
		{
			returnedElements = document.evaluate(currentQuery, document, null, XPathResult.ANY_TYPE, null);
			let nextElement = null;
			while ((nextElement = returnedElements.iterateNext())) {
				if (current.elementPostProcessing != null) {
					nextElement = current.elementPostProcessing(nextElement);
					if (!nextElement) continue;

					if (current.overrideCustomElementRemove != null) current.overrideCustomElementRemove(nextElement);
					else nextElement.remove();
				}
				else if (current.overrideCustomElementRemove != null) current.overrideCustomElementRemove(nextElement)
				else nextElement.remove();
			}
		}
		else
		{
			returnedElements = document.querySelectorAll(currentQuery.query);
			if (!returnedElements || returnedElements.length < 1) continue;
			returnedElements.forEach(
				(element) => {
					if (current.elementPostProcessing != null)
					{
						let postProcessedElement = current.elementPostProcessing(element);
						if (!postProcessedElement) { debugger; return; }

						if (current.overrideCustomElementRemove != null) current.overrideCustomElementRemove(postProcessedElement);
						else postProcessedElement.remove();
					}
					else {
						if (current.overrideCustomElementRemove != null) current.overrideCustomElementRemove(element);
						else element.remove();
					}
			});
		}
	}
}

function simulateNotification(title, message, type = "info", timeout = 2500) {
	if (opt_SupressNotifications && type.toLowerCase() !== "error") return;

	const toastId = "simpleToast";
	var notificationContainer = document.createElement("div");
	notificationContainer.id = toastId;

	let existingNotification = document.getElementById(toastId);
	if (existingNotification) existingNotification.remove();

	notificationContainer.title = "Click to dismiss this message";

	var innerContainer = document.createElement("div");
	const imgSize = 54;
	let imgSrc = "";
	let backgroundColor = "";
	let fontColor = "";

	if (type.toLowerCase() === "debug") {
		imgSrc = "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678124-wrench-screwdriver-64.png";
		backgroundColor = "#eac100";
		fontColor = "#323232";
	}
	else if (type.toLowerCase() === "error") {
		imgSrc = "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678069-sign-error-64.png";
		backgroundColor = "#ff0000";
		fontColor = "#ffffff";
	}
	else {
		imgSrc = "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678110-sign-info-64.png";
		backgroundColor = "#0f0f0f";
		fontColor = "#ffffff";
	}

	notificationContainer.style.cssText
		= `position: fixed;
        bottom: 15px;
        right: 15px;
        background-color: ${backgroundColor};
        color: ${fontColor};
        border: 1px solid #ffffff;
        padding-left: 50px;
		padding-right: 50px;
		padding-top:10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        opacity: 1;
        transition: opacity 1s, border-radius 0.5s;
        border-radius: 5px;
		cursor: pointer;
        `

	innerContainer.innerHTML =
		`<img src='${imgSrc}' style='width:${imgSize}px;height:${imgSize}px;padding-bottom:10px;display:block;margin:auto;'></img>
		<p id='title' style='text-align:center;font-weight:bold;font-size:20px;'>${title}</p>
		<p id='message' style='text-align:center;padding-bottom:15px;font-size:15px;'>${message}</p>`;

	notificationContainer.appendChild(innerContainer);

	notificationContainer.onclick = function() { document.body.removeChild(notificationContainer); notificationContainer = null; }
	document.body.appendChild(notificationContainer);

	// Set a timer to fade out the notification after 'timeout' milliseconds if (if 'timeout' is not -1 or less)
	if (timeout > -1) {
		setTimeout(function() {
			if (notificationContainer == null) return;
			notificationContainer.style.opacity = 0;
			setTimeout(function() {
				if (notificationContainer == null) return;
				document.body.removeChild(notificationContainer);
			}, 500); // Remove the notification after the fade-out animation (adjust as needed)
		}, (timeout < 1 ? 2500 : timeout)); // Start the fade-out animation after 5 seconds (adjust as needed)
	}
}