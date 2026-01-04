// ==UserScript==
// @name          Agar Dark Theme
// @description   Improves the aesthetic and layout of agar.io
// @include       *agar.io/*
// @grant         none
// @run-at        document-start
// @version       1.14
// @author        Tom Burris
// @namespace     https://greasyfork.org/en/users/46159
// @icon          http://bit.ly/2oT4wRk
// @compatible    chrome
// @downloadURL https://update.greasyfork.org/scripts/492393/Agar%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/492393/Agar%20Dark%20Theme.meta.js
// ==/UserScript==

"use strict";

const qs = sel => document.querySelector(sel);
const observe = (target, options, callback) => {
	(new MutationObserver(callback)).observe(target, options);
};

let css = "";

// ** Block Advertisements
const scripts = document.getElementsByTagName("script");
const adRegex = /adinplay|amazon-adsystem|doubleclick\.net/;
for (const script of scripts) {
	if (adRegex.test(script.src)) {
		script.parentNode.removeChild(script);
		console.log("removed script", script.src);
	}
}

addEventListener("DOMContentLoaded", () => {
	const mainPanel = qs("#mainPanel");
	const playContainer = qs(".play-container");
	const playElm = qs("#mainui-play");
	const settingsBtn = qs("#settingsButton");
	let settingsElm = null;

	// ** Darken Stuff
	css += `
		#mainui-ads, #mainui-features, #mainui-modes, #mainui-offers,
			#mainui-party, #mainui-play, #mainui-promo, #mainui-user,
			#mainui-settings > .dialog, .tosBox, .agario-party-dialog
		{
			background: #000 !important;
			color: #ddd !important;
			outline: 1.5px solid #ddd;
			border-radius: 0;
		}
		.options, #region, #nick, .potion-slot-container,
			.potion-slot-container > .cover-up, .token > .party-token,
			.party-icon-back,
			#mode_ffa:not(.active):not(:hover),
			#mode_battleroyale:not(.active):not(:hover),
			#mode_teams:not(.active):not(:hover),
			#mode_experimental:not(.active):not(:hover)
		{
			background-color: #000 !important;
			color: #ddd !important;
		}
		#nick::selection, .party-token::selection {
			paddding: 2px;
			background-color: rgba(0, 255, 0, 0.5);
		}
		#mainui-grid > div {
			overflow: visible;
		}
		.label, .progress-bar-text {
			color: #fff !important;
			font-weight: 400;
		}
		@import url('https://fonts.googleapis.com/css?family=Ubuntu');
		body {
			font-family: 'Ubuntu', sans-serif !important;
		}
		#title {
			margin-top: 0 !important;
		}
		#playnick {
			margin-bottom: 40px !important;
		}
		#instructions {
			position: static !important;
			border-top: 1px solid grey;
			border-bottom: 1px solid grey;
			padding: 5px 10px;
		}
		#mainui-play {
			height: auto !important;
		}
		.play-blocker {
			display: none;
		}
		#stats span {
			color: rgba(255, 255, 255, 0.8) !important;
		}
		header {
			top: auto;
			bottom: 0;
		}
	`;
	const lb = qs("#statsTimeLeaderboardContainer");
	lb.lastElementChild.innerText = "Leaderboard";

	// ** Hide Static Ads
	css += `
		#adsTop, #adsBottom, #adsRight, #adsLeft,
			#mainui-ads, #mainui-promo, #socialButtons, .adsbygoogle,
			#agar-io_300x250, #agar-io_970x90
		{
			display: none !important;
		}
	`;

	// ** Canvas Height Correction
	// Really weird that the miniclip dev put the style on the html:
	document.body.parentElement.style = "--bottom-banner-height:0px;";

	// ** Move Settings Back To Center Column
	addEventListener("load", () => {
		settingsBtn.click();
		settingsBtn.parentElement.removeChild(settingsBtn);
		observe(mainPanel, {childList: true}, (mutationList, me) => {
			settingsElm = qs("#mainui-settings");
			if (!settingsElm) return;
			me.disconnect();

			for (const elm of [qs(".actions"), qs("#region"),
				qs("#quality"), qs(".options"), qs("#instructions"),
				qs(".versions")])
			{
				mainPanel.appendChild(elm);
			}
			settingsElm.parentElement.removeChild(settingsElm);
		});
	});
	css += `
		#mainui-settings > .dialog {
			position: static;
			left: 0;
			top: 0;
			transform: translate(0, 0);
			width: 295px;
		}
		.options {
			padding: 0 !important;
		}
		.options label {
			width: auto !important;
		}
		.actions > button {
			width: 130px !important;
		}
		.actions {
			margin-bottom: 15px;
		}
	`;

	// ** Append CSS To DOM
	const style = document.createElement("style");
	style.id = "agarExtras";
	style.innerHTML = css;
	document.head.appendChild(style);
});