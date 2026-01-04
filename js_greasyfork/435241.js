/* This script should work in Tampermonkey, as a bookmarklet, or in the console. Have fun! */
/* Tested and known working in both Chrome and Firefox. */

/*
// ==UserScript==
// @name         YTVTSview
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  See View to Sentiment, View to Like, and other statistics.
// @author       zegfarce
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/435241/YTVTSview.user.js
// @updateURL https://update.greasyfork.org/scripts/435241/YTVTSview.meta.js
// ==/UserScript==
*/

/* The colors of the things. Change to whatever you want I guess. */
let colors = {
	like_color: "#44ff44",
	dislike_color: "#ff4444",
	viewratio_unfilled: "#717171",
	viewratio_partfilled: "#aaaaaa",
	viewratio_fullfilled: "#ffffff",
};

/* Based on original work by Estus Flask on Stack Overflow, https://stackoverflow.com/a/44807594 */
/* Licensed under the CC BY-SA 3.0 license. https://creativecommons.org/licenses/by-sa/3.0/ */
/* Modified to make it look a little nicer and call my function */
let scriptPromise = new Promise((resolve, reject) => {
	let script = document.createElement('script');
	document.body.appendChild(script);

	script.onload = resolve;
	script.onerror = reject;
	script.async = true;
	script.src = 'https://cdn.jsdelivr.net/npm/jquery@latest/dist/jquery.min.js';
});

scriptPromise.then(runChecks);

let selectors = {
	// Specific to YouTube that supports like bars
	likebar: "#like-bar",

	// Basic YouTube layout stuff
	info: "#info-contents",
	viewcount: ".ytd-video-view-count-renderer"
}

let ryd_selectors = {
	likebar: "#ryd-bar"
}

// Enables Return YouTube Dislike support dynamically.
// really just there to work around bugs
let ryd;

/* yes i really did just comply with creative commons license for stack overflow code */
/* okay back to my code */
function runChecks()
{
	/* tampermonkey support */
	let window = (typeof unsafeWindow !== "undefined") ? unsafeWindow : globalThis;
	let jQuery = window.$;

	// no support by default -- detect if the bar is reenabled
	ryd = false;

	let interval = setInterval(() => {
		// Return YouTube Dislike support.
		if (jQuery(ryd_selectors.likebar).length)
		{
			selectors.likebar = ryd_selectors.likebar;
			ryd = true; // well return-youtube-dislike exists
		}

		if (jQuery(selectors.likebar).length === 0)
			return;

		// hack because youtube didnt remove the html, just hid the element
		if (jQuery(selectors.likebar)[0].parentElement.parentElement.hidden)
			return;

		clearInterval(interval);
		init();
	}, 100)
}

/* initialises the thing */
function init() {
	/* tampermonkey support */
	let window = (typeof unsafeWindow !== "undefined") ? unsafeWindow : globalThis;
	let jQuery = window.$;

	let likebar = jQuery(selectors.likebar)[0]; /* convenient */
	let likebar_container = likebar.parentElement; /* less convenient */
	let sentiment_section = likebar_container.parentElement;

	if (ryd) // they wrapped it in another div -- annoying
		sentiment_section = sentiment_section.parentElement;

	let tooltip_container = sentiment_section.lastElementChild; /* even less convenient */
	let tooltip = tooltip_container.children[0];

	likebar.style.background = colors.like_color;
	likebar_container.style.background = colors.dislike_color;

	/* changing ID messes with the rendering */
	let viewratiobar_container;

	if (typeof window._yt_tampered_with === "undefined")
		/* clone if first time */
		viewratiobar_container = likebar_container.cloneNode(true);
	else
		/* otherwise, get existing one instead */
		viewratiobar_container = sentiment_section.lastElementChild.previousElementSibling;

	let viewratiobar = viewratiobar_container.children[0];
	let viewratiobar_child;

	if (typeof window._yt_tampered_with === "undefined")
		/* clone if first time */
		viewratiobar_child = viewratiobar.cloneNode(true);
	else
		/* otherwise, get existing one instead */
		viewratiobar_child = viewratiobar.firstElementChild;

	/* trim and remove commas */
	let tooltip_str = tooltip.textContent.trim().replaceAll(',', '');

	/* match the string representations of the likes and dislikes */
	/* remove the commas too */
	/* the .slice(1) removes the full string match */
	let [orig, likes, dislikes] = tooltip_str.match(/^((\d+)[^\d]+(\d+))/).slice(1);
	likes = parseInt(likes); /* get the number */
	dislikes = parseInt(dislikes); /* same here */

	let viewcount = jQuery(selectors.viewcount)[0]; /* grab view count html */
	let views = viewcount.innerHTML.replaceAll(',', ''); /* grab and trim the html */
	views = parseInt(views.match(/^\d+/)[0]); /* match the number and parse it */

	let vts_percent = ((likes + dislikes) / views) * 100; /* do some actual math for once in my life */
	let lts_percent = (likes / (likes + dislikes)) * 100; /* do some actual math for once in my life */

	/* The full bar is the background -- it's colored between the bg and fg by default */
	viewratiobar.style.width = vts_percent.toString() + "%";
	viewratiobar.style.background = colors.viewratio_partfilled;

	/* This bar is the likes percentage in the bar */
	viewratiobar_child.style.width = lts_percent.toString() + "%";
	viewratiobar_child.style.background = colors.viewratio_fullfilled;
	viewratiobar_container.style.background = colors.viewratio_unfilled;

	let spacerdiv;

	if (typeof window._yt_tampered_with === "undefined")
		/* create if first time */
		spacerdiv = document.createElement("div");
	else
		/* otherwise, get existing one instead */
		spacerdiv = likebar_container.nextElementSibling;

	/* A little spacer that just visually seperates my bar and the original one */
	spacerdiv.style.height = "4px";

	/* Don't add the divs if we've already added them */
	if (typeof window._yt_tampered_with === "undefined")
	{
		sentiment_section.insertBefore(spacerdiv, likebar_container.nextElementSibling);
		sentiment_section.insertBefore(viewratiobar_container, spacerdiv.nextElementSibling);
		viewratiobar.appendChild(viewratiobar_child);
	}

	/* Truncate percentages so you dont get annoyingly precise percentages */
	let vts = vts_percent.toFixed(1);
	let lts = lts_percent.toFixed(0);
	let vtl = (likes/views * 100).toFixed(1);

	/* NaN checks just so we dont have NaN show up. */
	vts = isNaN(vts) ? 0 : vts;
	lts = isNaN(lts) ? 0 : lts;
	vtl = isNaN(vtl) ? 0 : vtl;

	/* Edit the tooltip to be cooler */
	tooltip.textContent = `${orig} (${lts}%) ${vts}% vts ${vtl}% vtl`;

	/* The section where the video title, views, upload date, and buttons are. */
	let info_contents = jQuery(selectors.info)[0].children[0];
	info_contents.style.paddingBottom = "14px"; /* Just extend it a little more to fit my bar. */

	/* we've tampered with youtube */
	window._yt_tampered_with = true;
};
