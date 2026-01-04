// ==UserScript==
// @name tv.youtube.com - Black Mode
// @namespace typpi.online
// @version 1.0.2
// @description Black Theme for Youtube TV
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.tv.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/528710/tvyoutubecom%20-%20Black%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/528710/tvyoutubecom%20-%20Black%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `

	html[dark],
	[dark]
	{
		--yt-spec-base-background: #0f0f0f;
		--yt-spec-raised-background: #212121;
		--yt-spec-menu-background: #282828;
		--yt-spec-inverted-background: #f1f1f1;
		--yt-spec-additive-background: rgba(255, 255, 255, 0.1);
		--yt-spec-outline: rgba(255, 255, 255, 0.2);
		--yt-spec-outline-inverse: rgba(0, 0, 0, 0.1);
		--yt-spec-outline-inverse-medium: rgba(0, 0, 0, 0.3);
		--yt-spec-shadow: rgba(0, 0, 0, 0.25);
		--yt-spec-text-primary: #fff;
		--yt-spec-text-secondary: #aaa;
		--yt-spec-text-disabled: #717171;
		--yt-spec-text-primary-inverse: #030303;
		--yt-spec-call-to-action: #3ea6ff;
		--yt-spec-call-to-action-inverse: #065fd4;
		--yt-spec-suggested-action: #263850;
		--yt-spec-suggested-action-inverse: #def1ff;
		--yt-spec-icon-active-other: #fff;
		--yt-spec-icon-inactive: #909090;
		--yt-spec-icon-disabled: #606060;
		--yt-spec-button-chip-background-hover: rgba(255, 255, 255, 0.2);
		--yt-spec-touch-response: #fff;
		--yt-spec-touch-response-inverse: #000;
		--yt-spec-brand-icon-active: #fff;
		--yt-spec-brand-icon-inactive: #909090;
		--yt-spec-red-indicator: #e1002d;
		--yt-spec-wordmark-text: #fff;
		--yt-spec-error-indicator: #ff8983;
		--yt-spec-error-background-red: rgba(255, 85, 119, 0.2);
		--yt-spec-themed-blue: #3ea6ff;
		--yt-spec-themed-green: #2ba640;
		--yt-spec-ad-indicator: #00aaa7;
		--yt-spec-themed-overlay-background: rgba(0, 0, 0, 0.8);
		--yt-spec-commerce-badge-background: #002d08;
		--yt-spec-static-white-background: #fff;
		--yt-spec-static-black: #0f0f0f;
		--yt-spec-static-brand-red: #f00;
		--yt-spec-static-brand-white: #fff;
		--yt-spec-static-brand-black: #212121;
		--yt-spec-static-clear-color: rgba(255, 255, 255, 0);
		--yt-spec-static-clear-black: rgba(0, 0, 0, 0);
		--yt-spec-static-ad-yellow: #fbc02d;
		--yt-spec-static-grey: #606060;
		--yt-spec-brand-red-contrast: #f57;
		--yt-spec-static-overlay-additive-background: rgba(40, 40, 40, 0.6);
		--yt-spec-static-overlay-background-solid: #000;
		--yt-spec-static-overlay-background-heavy: rgba(0, 0, 0, 0.8);
		--yt-spec-static-overlay-background-medium: rgba(0, 0, 0, 0.6);
		--yt-spec-static-overlay-background-medium-light: rgba(0, 0, 0, 0.3);
		--yt-spec-static-overlay-background-light: rgba(0, 0, 0, 0.1);
		--yt-spec-static-overlay-text-primary: #fff;
		--yt-spec-static-overlay-text-primary-inverse: #030303;
		--yt-spec-static-overlay-text-secondary: rgba(255, 255, 255, 0.7);
		--yt-spec-static-overlay-text-disabled: rgba(255, 255, 255, 0.3);
		--yt-spec-static-overlay-call-to-action: #3ea6ff;
		--yt-spec-static-overlay-call-to-action-hover: #65b8ff;
		--yt-spec-static-overlay-icon-active-other: #fff;
		--yt-spec-static-overlay-icon-inactive: rgba(255, 255, 255, 0.7);
		--yt-spec-static-overlay-icon-disabled: rgba(255, 255, 255, 0.3);
		--yt-spec-static-overlay-button-primary: rgba(255, 255, 255, 0.3);
		--yt-spec-static-overlay-button-secondary: rgba(255, 255, 255, 0.1);
		--yt-spec-static-overlay-touch-response: #fff;
		--yt-spec-static-overlay-touch-response-inverse: #000;
		--yt-spec-static-overlay-background-brand: rgba(225, 0, 45, 0.9);
		--yt-spec-assistive-feed-themed-gradient-1: #005446;
		--yt-spec-assistive-feed-themed-gradient-2: #39003f;
		--yt-spec-assistive-feed-themed-gradient-3: #590000;
		--yt-spec-gen-ai-gradient-1: #007a65;
		--yt-spec-gen-ai-gradient-2: #7f0e7f;
		--yt-spec-gen-ai-gradient-3: #aa09aa;
		--yt-spec-gen-ai-gradient-4: #ff4e45;
		--yt-spec-gen-ai-additive-gradient-1: rgba(0, 122, 101, 0.3);
		--yt-spec-gen-ai-additive-gradient-2: rgba(127, 14, 127, 0.3);
		--yt-spec-gen-ai-additive-gradient-3: rgba(170, 9, 170, 0.3);
		--yt-spec-gen-ai-additive-gradient-4: rgba(255, 78, 69, 0.3);
		--yt-spec-discover-red: #ff4e45;
		--yt-spec-discover-green: #a4ffa4;
		--yt-spec-discover-blue: #6ea2ff;
		--yt-frosted-glass-mobile: rgba(15, 15, 15, 0.7);
		--yt-frosted-glass-desktop: rgba(15, 15, 15, 0.8);
		--yt-spec-expressive-trend-10: #fbfee6;
		--yt-spec-expressive-trend-20: #f5ffb7;
		--yt-spec-expressive-trend-30: #ecfd83;
		--yt-spec-expressive-trend-40: #dafd00;
		--yt-spec-expressive-trend-50: #bbe900;
		--yt-spec-expressive-trend-60: #8abb03;
		--yt-spec-expressive-trend-70: #5c7e00;
		--yt-spec-brand-background-solid: #0F0F0FCC;
		--yt-spec-brand-background-primary: rgba(33, 33, 33, 0.98);
		--yt-spec-brand-background-secondary: rgba(33, 33, 33, 0.95);
		--yt-spec-general-background-a: #000;
		--yt-spec-general-background-b: #0f0f0f;
		--yt-spec-general-background-c: #030303;
		--yt-spec-error-background: #f9f9f9;
		--yt-spec-10-percent-layer: rgba(255, 255, 255, 0.1);
		--yt-spec-10-percent-layer-inverse: rgba(0, 0, 0, 0.1);
		--yt-spec-snackbar-background: #030303;
		--yt-spec-snackbar-background-updated: #f9f9f9;
		--yt-spec-badge-chip-background: rgba(48, 48, 48, .1);
		--yt-spec-badge-chip-background-inverse: rgba(0, 0, 0, 0.05);
		--yt-spec-verified-badge-background: rgba(255, 255, 255, 0.25);
		--yt-spec-brand-button-background: #c00;
		--yt-spec-brand-link-text: #ff4e45;
		--yt-spec-brand-link-text-faded: rgba(255, 78, 69, 0.3);
		--yt-spec-call-to-action-faded: rgba(62, 166, 255, 0.3);
		--yt-spec-call-to-action-hover: #6ebcff;
		--yt-spec-brand-button-background-hover: #990412;
		--yt-spec-filled-button-focus-outline: rgba(255, 255, 255, 0.7);
		--yt-spec-static-overlay-button-hover: rgba(255, 255, 255, 0.5);
		--yt-spec-mono-filled-hover: #d9d9d9;
		--yt-spec-mono-filled-hover-inverse: #272727;
		--yt-spec-commerce-filled-hover: #65b8ff;
		--yt-spec-mono-tonal-hover: rgba(255, 255, 255, 0.2);
		--yt-spec-mono-tonal-hover-inverse: rgba(0, 0, 0, 0.1);
		--yt-spec-commerce-tonal-hover: #515561;
		--yt-spec-static-overlay-filled-hover: #e6e6e6;
		--yt-spec-static-overlay-tonal-hover: rgba(255, 255, 255, 0.2);
		--yt-spec-paper-tab-ink: rgba(255, 255, 255, 0.3);
		--yt-spec-filled-button-text: #030303;
		--yt-spec-selected-nav-text: #fff;
		--scrollbarThumbColor: #171717;
		--scrollbarTrackColor: #000;
		scrollbar-color: var(--scrollbarThumbColor) var(--scrollbarTrackColor) !important;
	}

	.bottom-container.ytu-app,
	#id-dialog,
	ytu-menu-item .tp-yt-paper-item.tp-yt-paper-item.ytu-menu-item,
	ytu-nav-bar.ytu-app
	{
		background-color: var(--yt-spec-general-background-a);
	}
	.buttons-container.ytu-epg-section
	{
		filter: invert(1);
	}

	/* For WebKit browsers (e.g., Chrome, Safari) */
	::-webkit-scrollbar
	{
		width: 12px;
	}

	::-webkit-scrollbar-track
	{
		background: #000000a1;
	}

	::-webkit-scrollbar-thumb
	{
		border: 3px solid var(--primary-color);
		border-radius: 6px;
		background-color: var(--black);
	}

	/* For Edge, IE */
	body
	{
		-ms-overflow-style: -ms-autohiding-scrollbar;
	}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
