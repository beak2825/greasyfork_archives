// ==UserScript==
// @name          Youtube HD
// @author        adisib
// @namespace     namespace_adisib
// @description   Select a youtube resolution and resize the player.
// @version       2025.04.13
// @match         https://*.youtube.com/*
// @noframes
// @grant         GM.getValue
// @grant         GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/23661/Youtube%20HD.user.js
// @updateURL https://update.greasyfork.org/scripts/23661/Youtube%20HD.meta.js
// ==/UserScript==

// The video will only resize when in theater mode on the main youtube website.
// By default only runs on youtube website, not players embeded on other websites, but there is experimental support for embeds.
// To enable experimental support for embedded players outside of YouTube website, do the following steps:
//   add  " @include * "  to the script metadata
//   remove	 " @noframes "	from the script metadata

// 2025.04.13
// Add requested option "removeBlackBars" which restricts the height of the video if the screen width is smaller than player width

// 2025.04.12
// Fix resizing not working with some browsers/userscript managers (worked with greasemonkey and firefox, probably not with anything else)
// Set the default target resolution to 4k now, since it has probably been long enough that the number of complaints about choosing 4k will be minimal
// Thanks to ElectroKnight22 (https://greasyfork.org/en/scripts/498145-youtube-hd-premium) and all others who provide alternatives while this script was being poorly maintained
// There could be other issues complained about that I didn't fix yet. Please keep complaining to me so that I will fix them.


(function() {
	"use strict";

	// --- SETTINGS -------

	// PLEASE NOTE:
	// Settings will be saved the first time the script is loaded so that your changes aren't undone by an update.
	// If you want to make adjustments, please set "overwriteStoredSettings" to true.
	// Otherwise, your settings changes will NOT have an effect because it will used the saved settings.
	// After the script has next been run by loading a video with "overwriteStoredSettings" as true, your settings will be updated.
	// Then after that you can set it to false again to prevent your settings from being changed by an update.

	let settings = {

	// Target Resolution to always set to. If not available, the next best resolution will be used.
	changeResolution: true,
	preferPremium: true,
	targetRes: "hd2160",
	// Choices for targetRes are currently:
	//	 "highres" >= ( 8K / 4320p / QUHD  )
	//	 "hd2880"	= ( 5K / 2880p /  UHD+ )
	//	 "hd2160"	= ( 4K / 2160p /  UHD  )
	//	 "hd1440"	= (		 1440p /  QHD  )
	//	 "hd1080"	= (		 1080p /  FHD  )
	//	 "hd720"	= (		  720p /   HD  )
	//	 "large"	= (		  480p		   )
	//	 "medium"	= (		  360p		   )
	//	 "small"	= (		  240p		   )
	//	 "tiny"		= (		  144p		   )

	// Target Resolution for high framerate (60 fps) videos
	// If null, it is the same as targetRes
	highFramerateTargetRes: null,

	// If changePlayerSize is true, then the video's size will be changed on the page
	//	 instead of using youtube's default (if theater mode is enabled).
	// If useCustomSize is false, then the player will be resized to try to match the target resolution.
	//	 If true, then it will use the customHeight variables (theater mode is always full page width).
	// If removeBlackBars is true, will try to cap the height based on the current video's aspect ratio
	//	 if the screen size is smaller than the requested resolution
	changePlayerSize: false,
	removeBlackBars: false,
	useCustomSize: false,
	customHeight: 600,

	// If autoTheater is true, each video page opened will default to theater mode.
	// This means the video will always be resized immediately if you are changing the size.
	// NOTE: YouTube will not always allow theater mode immediately, the page must be fully loaded before theater can be set.
	autoTheater: false,

	// If flushBuffer is false, then the first second or so of the video may not always be the desired resolution.
	//	 If true, then the entire video will be guaranteed to be the target resolution, but there may be
	//	 a very small additional delay before the video starts if the buffer needs to be flushed.
	flushBuffer: true,

	// Setting cookies can allow some operations to perform faster or without a delay (e.g. theater mode)
	// Some people don't like setting cookies, so this is false by default (which is the same as old behavior)
	allowCookies: false,

	// Tries to set the resolution as early as possible.
	// This might cause issues on youtube polymer layout, so disable if videos fail to load.
	// If videos load fine, leave as true or resolution may fail to set.
	setResolutionEarly: true,

	// Enables a temporary work around for an issue where users can get the wrong youtube error screen
	// (Youtube has two of them for some reason and changing to theater mode moves the wrong one to the front)
	// Try disabling if you can't interact with the video or you think you are missing an error message.
	enableErrorScreenWorkaround: true,

	// Use the iframe API to set resolution if possible. Otherwise uses simulated mouse clicks.
	useAPI: true,

	// Overwrite stored settings with the settings coded into the script, to apply changes.
	// Set and keep as true to have settings behave like before, where you can just edit the settings here to change them.
	overwriteStoredSettings: false

	};

	// --------------------




	// --- GLOBALS --------


	const DEBUG = false;

	// Possible resolution choices (in decreasing order, i.e. highres is the best):
	const resolutions = ['highres', 'hd2880', 'hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];
	// youtube has to be at least 480x270 for the player UI
	const heights = [4320, 2880, 2160, 1440, 1080, 720, 480, 360, 240, 144];

	let doc = document, win = window;

	// ID of the most recently played video
	let recentVideo = "";

	let foundHFR = false;

	let setHeight = 0;


	// --------------------


	function debugLog(message)
	{
	if (DEBUG)
	{
	  console.log("YTHD | " + message);
	}
	}


	// --------------------


	// Used only for compatability with webextensions version of greasemonkey
	function unwrapElement(el)
	{
	if (el && el.wrappedJSObject)
	{
	  return el.wrappedJSObject;
	}
	return el;
	}


	// --------------------


	// Get player object
	function getPlayer()
	{
	let ytPlayer = doc.getElementById("movie_player") || doc.getElementsByClassName("html5-video-player")[0];
	return unwrapElement(ytPlayer);
	}


	// --------------------


	// Get video ID from the currently loaded video (which might be different than currently loaded page)
	function getVideoIDFromURL(ytPlayer)
	{
	const idMatch = /(?:v=)([\w\-]+)/;
	let id = "ERROR: idMatch failed; youtube changed something";
	let matches = idMatch.exec(ytPlayer.getVideoUrl());
	if (matches)
	{
	  id = matches[1];
	}

	return id;
	}


	// --------------------


	// Attempt to set the video resolution to desired quality or the next best quality
	function setResolution(ytPlayer, resolutionList)
	{
	debugLog("Setting Resolution...");

	const currentQuality = ytPlayer.getPlaybackQuality();
	let res = settings.targetRes;

	if (settings.highFramerateTargetRes && foundHFR)
	{
	  res = settings.highFramerateTargetRes;
	}

	let shouldPremium = settings.preferPremium && [...ytPlayer.getAvailableQualityData()].some(q => q.quality == res && q.qualityLabel.includes("Premium") && q.isPlayable);
	let useButtons = !settings.useAPI || shouldPremium;

	// Youtube doesn't return "auto" for auto, so set to make sure that auto is not set by setting
	//	 even when already at target res or above, but do so without removing the buffer for this quality
	if (resolutionList.indexOf(res) < resolutionList.indexOf(currentQuality))
	{
	  const end = resolutionList.length - 1;
	  let nextBestIndex = Math.max(resolutionList.indexOf(res), 0);
	  let ytResolutions = ytPlayer.getAvailableQualityLevels();
	  debugLog("Available Resolutions: " + ytResolutions.join(", "));

	  while ( (ytResolutions.indexOf(resolutionList[nextBestIndex]) === -1) && nextBestIndex < end )
	  {
		++nextBestIndex;
	  }

	  if (!useButtons && settings.flushBuffer && currentQuality !== resolutionList[nextBestIndex])
	  {
		let id = getVideoIDFromURL(ytPlayer);
		if (id.indexOf("ERROR") === -1)
		{
		  let pos = ytPlayer.getCurrentTime();
		  ytPlayer.loadVideoById(id, pos, resolutionList[nextBestIndex]);
		}

		debugLog("ID: " + id);
	  }

	  res = resolutionList[nextBestIndex];
	}

	if (settings.useAPI)
	{
	  if (ytPlayer.setPlaybackQualityRange !== undefined)
	  {
		ytPlayer.setPlaybackQualityRange(res);
	  }
	  ytPlayer.setPlaybackQuality(res);
	  debugLog("(API) Resolution Set To: " + res);
	}
	if (useButtons)
	{
	  let resLabel = heights[resolutionList.indexOf(res)];
	  if (shouldPremium)
	  {
		resLabel = [...ytPlayer.getAvailableQualityData()].find(q => q.quality == res && q.qualityLabel.includes("Premium")).qualityLabel;
	  }

	  let settingsButton = doc.querySelector(".ytp-settings-button:not(#ScaleBtn)")[0];
	  unwrapElement(settingsButton).click();

	  let qualityMenuButton = document.evaluate('.//*[contains(text(),"Quality")]/ancestor-or-self::*[@class="ytp-menuitem-label"]', ytPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	  unwrapElement(qualityMenuButton).click();

	  let qualityButton = document.evaluate('.//*[contains(text(),"' + heights[resolutionList.indexOf(res)] + '") and not(@class)]/ancestor::*[@class="ytp-menuitem"]', ytPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	  unwrapElement(qualityButton).click();
	  debugLog("(Buttons) Resolution Set To: " + res);
	}
	}


	// --------------------


	// Set resolution, but only when API is ready (it should normally already be ready)
	function setResOnReady(ytPlayer, resolutionList)
	{
	if (settings.useAPI && (ytPlayer.getPlaybackQuality === undefined || ytPlayer.getPlaybackQuality() == "unknown"))
	{
	  win.setTimeout(setResOnReady, 100, ytPlayer, resolutionList);
	}
	else
	{
	  let framerateUpdate = false;
	  if (settings.highFramerateTargetRes)
	  {
		let features = ytPlayer.getVideoData().video_quality_features;
		if (features)
		{
		  let isHFR = features.includes("hfr");
		  framerateUpdate = isHFR && !foundHFR;
		  foundHFR = isHFR;
		}
	  }

	  let curVid = getVideoIDFromURL(ytPlayer);
	  if ((curVid !== recentVideo) || framerateUpdate)
	  {
		recentVideo = curVid;
		setResolution(ytPlayer, resolutionList);

		let storedQuality = localStorage.getItem("yt-player-quality");
		if (!storedQuality || storedQuality.indexOf(settings.targetRes) === -1)
		{
		  let tc = Date.now(), te = tc + 2592000000;
		  localStorage.setItem("yt-player-quality","{\"data\":\"" + settings.targetRes + "\",\"expiration\":" + te + ",\"creation\":" + tc + "}");
		}
	  }
	}
	}


	// --------------------


	function setTheaterMode(ytPlayer)
	{
	debugLog("Setting Theater Mode");

	if (win.location.href.indexOf("/watch") !== -1)
	{
	  let pageManager = unwrapElement(doc.getElementsByTagName("ytd-watch-flexy")[0]);

	  if (pageManager && !pageManager.hasAttribute("theater"))
	  {
		if (settings.enableErrorScreenWorkaround)
		{
		  const styleContent = "#error-screen { z-index: 42 !important } .ytp-error { display: none !important }";

		  let errorStyle = doc.getElementById("ythdErrorWorkaroundStyleSheet");
		  if (!errorStyle)
		  {
			errorStyle = doc.createElement("style");
			errorStyle.type = "text/css";
			errorStyle.id = "ythdStyleSheet";
			errorStyle.textContent = styleContent;
			doc.head.appendChild(errorStyle);
		  }
		  else
		  {
			errorStyle.textContent = styleContent;
		  }
		}

		try
		{
			pageManager.setTheaterModeRequested(true);
			pageManager.updateTheaterModeState_(true);
			pageManager.onTheaterReduxValueUpdate(true);
			pageManager.setPlayerTheaterMode_();
			pageManager.dispatchEvent(new CustomEvent("yt-set-theater-mode-enabled", { detail: {enabled: true}, bubbles: true, cancelable: false} ));
		}
		catch {}

		let theaterButton;
		for (let i = 0; i < 3 && !pageManager.theaterValue; ++i)
		{
		  debugLog("Clicking theater button to attempt to notify redux state");
		  let theaterButton = theaterButton || unwrapElement(doc.getElementsByClassName("ytp-size-button")[0]);
		  theaterButton.click();
		}
	  }
	}
	}


	// --------------------


	function computeAndSetPlayerSize()
	{
	let height = settings.customHeight;
	if (!settings.useCustomSize)
	{
		// don't include youtube search bar as part of the space the video can try to fit in
		let heightOffsetEl = doc.getElementById("masthead");
		let mastheadContainerEl = doc.getElementById("masthead-container");
		let mastheadHeight = 50, mastheadPadding = 16;
		if (heightOffsetEl && mastheadContainerEl)
		{
			mastheadHeight = parseInt(win.getComputedStyle(heightOffsetEl).height, 10);
			mastheadPadding = parseInt(win.getComputedStyle(mastheadContainerEl).paddingBottom, 10) * 2;
		}

		let i = Math.max(resolutions.indexOf(settings.targetRes), 0);
		height = Math.min(heights[i], win.innerHeight - (mastheadHeight + mastheadPadding));
		height = Math.max(height, 270);

		if (settings.removeBlackBars)
		{
			let ytPlayer = getPlayer();
			if (ytPlayer !== undefined && ytPlayer.getVideoAspectRatio !== undefined)
			{
				height = Math.min(height, win.innerWidth / ytPlayer.getVideoAspectRatio());
			}
		}
	}

	resizePlayer(height);
	}


	// --------------------


	// resize the player
	function resizePlayer(height)
	{
	debugLog("Setting video player size to " + height);

	if (setHeight === height)
	{
	  debugLog("Player size already set");
	  return;
	}

	let styleContent = "\
ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container.style-scope, \
ytd-watch-flexy[theater]:not([fullscreen]) #player-wide-container.style-scope, \
ytd-watch-flexy[theater]:not([fullscreen]) #full-bleed-container.style-scope { \
min-height: " + height + "px !important; max-height: none !important; height: " + height + "px !important }";

	let ythdStyle = doc.getElementById("ythdStyleSheet");
	if (!ythdStyle)
	{
	  ythdStyle = doc.createElement("style");
	  ythdStyle.type = "text/css";
	  ythdStyle.id = "ythdStyleSheet";
	  ythdStyle.textContent = styleContent;
	  doc.head.appendChild(ythdStyle);
	}
	else
	{
	  ythdStyle.textContent = styleContent;
	}

	setHeight = height;

	win.dispatchEvent(new Event("resize"));
	}


	// --- MAIN -----------


	function main()
	{
	let ytPlayer = getPlayer();

	if (settings.autoTheater && ytPlayer)
	{
	  if (settings.allowCookies && doc.cookie.indexOf("wide=1") === -1)
	  {
		doc.cookie = "wide=1; domain=.youtube.com";
	  }

	  setTheaterMode(ytPlayer);
	}

	if (settings.changePlayerSize && win.location.host.indexOf("youtube.com") !== -1 && win.location.host.indexOf("gaming.") === -1)
	{
	  computeAndSetPlayerSize();
	  window.addEventListener("resize", computeAndSetPlayerSize, true);
	}

	if (settings.changeResolution && settings.setResolutionEarly && ytPlayer)
	{
	  setResOnReady(ytPlayer, resolutions);
	}

	if (settings.changeResolution || settings.autoTheater)
	{
	  win.addEventListener("loadstart", function(e) {
		if (!(e.target instanceof win.HTMLMediaElement))
		{
		  return;
		}

		ytPlayer = getPlayer();
		if (ytPlayer)
		{
		  debugLog("Loaded new video");
		  if (settings.changeResolution)
		  {
			setResOnReady(ytPlayer, resolutions);
		  }
		  if (settings.autoTheater)
		  {
			setTheaterMode(ytPlayer);
		  }
		}
	  }, true );
	}

	// This will eventually be changed to use the "once" option, but I want to keep a large range of browser support.
	win.removeEventListener("yt-navigate-finish", main, true);
	}

	async function applySettings()
	{
		if (typeof GM != 'undefined' && GM.getValue && GM.setValue)
		{
		  let settingsSaved = await GM.getValue("SettingsSaved");

		  if (settings.overwriteStoredSettings || !settingsSaved)
		  {
			Object.entries(settings).forEach(([k,v]) => GM.setValue(k, v));

			await GM.setValue("SettingsSaved", true);
		  }
		  else
		  {
			await Promise.all(
			  Object.keys(settings).map(k => { let newval = GM.getValue(k); return newval.then(v => [k,v]); })
			).then((c) => c.forEach(([nk,nv]) => {
			  if (settings[nk] !== null && nk !== "overwriteStoredSettings")
			  {
				settings[nk] = nv;
			  }
			}));
		  }

		  debugLog(Object.entries(settings).map(([k,v]) => k + " | " + v).join(", "));
		}
	}

	applySettings().then(() => {
	main();
	// Youtube doesn't load the page immediately in new version so you can watch before waiting for page load
	// But we can only set resolution until the page finishes loading
	win.addEventListener("yt-navigate-finish", main, true);
	});
})();