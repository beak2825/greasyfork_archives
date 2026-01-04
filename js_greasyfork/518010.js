// ==UserScript==
// @name UPS.com - Dark Mode
// @namespace typpi.online
// @version 20241114.23.52
// @description UPS.com - Dark Mode!
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.ups.com/*
// @downloadURL https://update.greasyfork.org/scripts/518010/UPScom%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/518010/UPScom%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Base dark mode filter */
	html {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	/* Specific elements to exclude from inversion */
	:is(
		img,
		svg,
		video,
		iframe,
		[class*='footer'],
		[id*='footer'],
		.logo,
		.button,
		.btn,
		.input,
		.textarea,
		.card,
		.panel,
		.table,
		.modal,
		#ups-header_logo > img,
		#ups-navContainer
			> header
			> div.ups-container.navbar-expand-lg
			> div.ups-user-actions.dropdown
			> a.ups-cta.ups-cta-primary.d-none.d-md-block.ups-analytics
			> span,
		#ups-main
			> div
			> div
			> div
			> div.social.row
			> ul
			> li:nth-child(2)
			> button
			> span.ups-socialicon.ups-socialicon_facebook,
		#ups-main
			> div
			> div
			> div
			> div.social.row
			> ul
			> li:nth-child(1)
			> button
			> span.ups-socialicon.ups-socialicon_google,
		.brown.arc-container.apps-container.section,
		#tabs_0_tabContent_0
			> div
			> div
			> div
			> div
			> div.package-tracker,
		#tracking-numbers
	) {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	/* Additional styling for better dark mode experience */
	a,
	li:nth-child(n)
		> a
		> span.icon.ups-icon-link_newwindow,
	#sublist-connect-with-us-3
		> li:nth-child(n)
		> a
		> span.icon.icon-new-window
		> svg,
	#sublist-ups-companies-2
		> li:nth-child(n)
		> a
		> span
		> svg
		> use,
	#sublist-ups-sites-1
		> li:nth-child(n)
		> a
		> span
		> svg,
	#sublist-this-site-0
		> li:nth-child(n)
		> a
		> span
		> svg,
	#sublist-connect-with-us-3
		> li:nth-child(n)
		> a
		> span.icon.icon-facebook
		> svg
		> use,
	#sublist-connect-with-us-3
		> li:nth-child(2)
		> a
		> span.icon.icon-x
		> svg
		> use,
	#sublist-connect-with-us-3
		> li:nth-child(3)
		> a
		> span.icon.icon-instagram
		> svg
		> use,
	#sublist-connect-with-us-3
		> li:nth-child(4)
		> a
		> span.icon.icon-linkedin
		> svg
		> use,
	#sublist-connect-with-us-3
		> li:nth-child(5)
		> a
		> span.icon.icon-youtube
		> svg,
	#tabs_0_tabContent_0
		> div
		> div
		> div
		> div
		> div.track-form-wrapper
		> form
		> button.toggle-help
		> span
		> svg
		> use {
		color: #000 !important;
	}

	a > span.icon.ups-icon-link_newwindow,
	#ups-footer_legalLinks > li:nth-child(n) > a,
	#ups-footer_connectLinks
		> li:nth-child(n)
		> a
		> span.icon.ups-icon-link_newwindow,
	#sublist-legal-0 > li:nth-child(n) > a,
	#sublist-ups-companies-2 > li:nth-child(n) > a,
	#sublist-ups-sites-1 > li:nth-child(n) > a,
	#sublist-this-site-0 > li:nth-child(n) > a,
	#sublist-connect-with-us-3
		> li:nth-child(n)
		> a,
	#tabs_0_tab_2 > h2,
	#tabs_0_tab_3 > h2,
	#tabs_0_tabContent_0
		> div
		> div
		> div
		> div
		> div.track-form-wrapper
		> div.help-content
		> p
		> a,
	#ups-footer_connectLinks > li:nth-child(n) > a {
		color: #fff !important;
	}

	.button,
	.btn {
		border: none !important;
		background-color: #662f10 !important;
		color: #f8f8f2 !important;
	}

	.button:hover,
	.btn:hover {
		color: #50fa7b !important;
	}

	.input,
	.textarea {
		border: 1px solid #6272a4 !important;
		background-color: #44475a !important;
		color: #f8f8f2 !important;
	}

	.input:focus,
	.textarea:focus {
		border-color: #50fa7b !important;
	}

	.card,
	.panel {
		border: 1px solid #6272a4 !important;
		background-color: #44475a !important;
		color: #f8f8f2 !important;
	}

	.table {
		background-color: #44475a !important;
		color: #f8f8f2 !important;
	}

	.table th,
	.table td {
		border: 1px solid #6272a4 !important;
	}

	.modal {
		background-color: #282a36 !important;
		color: #f8f8f2 !important;
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
