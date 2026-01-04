// ==UserScript==
// @name eBay.com - Dark Mode
// @namespace https://github.com/Nick2bad4u/UserStyles
// @version 2.1
// @description eBay.com - Dark Mode!
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.ebay.com/*
// @include /^(?:.*www.ebay.*)$/
// @downloadURL https://update.greasyfork.org/scripts/518009/eBaycom%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/518009/eBaycom%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	:is(
		html:not([stylus-iframe]),
		img,
		svg,
		video
	) {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	/* Ensure background images are not inverted */
	:is(
		html:not([stylus-iframe]),
		img,
		svg,
		video
	) {
		background-color: inherit !important;
	}

	#gh-eb-Alerts,
	#gh-minicart-hover,
	#ifhItem0 {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	li:nth-child(n) > div > div > button,
	li:nth-child(n) > div > div > button > svg,
	#s0-1-0-53-1-2-4-17\\[0\\[1\\]\\]-0\\[3\\]-2-\\@match-media-0-\\@ebay-carousel-next
		> svg,
	#s0-1-0-53-1-2-4-17\\[0\\[1\\]\\]-0\\[3\\]-2-\\@match-media-0-\\@ebay-carousel-container
		> button.carousel__control.carousel__control--prev
		> svg,
	button.carousel__playback > svg,
	#s0-1-0-53-1-2-4-17\\[0\\[1\\]\\]-0\\[2\\]-2-\\@match-media-0-\\@ebay-carousel-next
		> svg,
	#s0-1-0-53-1-2-4-17\\[0\\[1\\]\\]-0\\[2\\]-2-\\@match-media-0-\\@ebay-carousel-container
		> button.carousel__control.carousel__control--prev
		> svg,
	div
		> div.s-item__image-section
		> span
		> button
		> span
		> svg,
	#gh-ac-box2 > svg,
	#mainContent
		> div.s-answer-region.s-answer-region-center-top
		> div
		> div.clearfix.srp-controls__row-2
		> div:nth-child(1)
		> div.srp-controls__control.follow-widget-wrap
		> div
		> div
		> button
		> span
		> svg,
	#mainContent
		> div.app-shell.contactui-viewmessage
		> div.app-river__center
		> div.msg-container
		> div.msg-inbox-container.msg-inbox-container--active
		> div.msg-inbox-main
		> div.msg-inbox-list
		> div.app-msg-inbox-action-bar
		> div.action-bar-button-group
		> span:nth-child(n)
		> span
		> span
		> button
		> svg,
	#imageupload__send--button > svg,
	svg.icon.icon {
		filter: invert(0) hue-rotate(180deg) !important;
	}

	#ghno {
		filter: invert(1) hue-rotate(180deg) !important;
		background-color: #fff;
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
