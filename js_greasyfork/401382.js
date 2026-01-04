// ==UserScript==
// @name POWH.io (POWH3D) Dark Exchange Dank-mode
// @namespace https://greasyfork.org/users/517035
// @version 0.0.5
// @description This is the POWH3D Dark Exchange Dank-mode Edition, includes shill-kits and backup for POWH.io
// @author zirs3d
// @license CC0-1.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.exchange.powh.io/*
// @match *://*.powh.io/*
// @match https://p3d-bot.github.io/buy.html
// @match https://p3d-bot.github.io/howtoplay.html
// @match https://p3d-bot.github.io/donotpush/donotpush
// @downloadURL https://update.greasyfork.org/scripts/401382/POWHio%20%28POWH3D%29%20Dark%20Exchange%20Dank-mode.user.js
// @updateURL https://update.greasyfork.org/scripts/401382/POWHio%20%28POWH3D%29%20Dark%20Exchange%20Dank-mode.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "exchange.powh.io" || location.hostname.endsWith(".exchange.powh.io"))) {
		css += `
		/** Exchange.powh.io **/
		/* Disable Orig Stylings*/
		div,
		aside,
		footer {
			background: transparent !important;
			background-color: transparent;
		}

		/* Button */
		button,
		.btn-info {
			color: #00d100 !important;
			background-color: white !important;
			border-color: #f8f8f2 !important;
		}

		.btn-info:hover {
			box-shadow: 0 14px 26px -12px #00897b6b,
			0 4px 23px 0 #cfcfcf57,
			0 8px 10px -5px #00897b33;
		}

		/* Text */
		p,
		div,
		span,
		li,
		h1,
		h2,
		h3,
		h4,
		footer {
			color: #f8f8f2 !important;
		}

		.spinner div {
			background-color: #00897b !important;
		}

		a,
		h3.text-themecolor,
		h3.text-info {
			color: #00d100 !important;
		}

		aside {
			background-color: #3d3d3d !important;
		}

		.dropdown-menu {
			background-color: #282a36 !important;
		}

		.sidebar-nav .in.collapse a {
			color: #00897b !important;
		}

		.sidebar-nav .in.collapse a:hover {
			color: #282a36 !important;
		}

		.sidebar-nav li a:hover span {
			color: #1bcfbd !important;
		}

		.sidebar-nav ul.in.collapse {
			background-color: #e3e3e3 !important;
		}

		/* Root */
		html,
		body {
			background-color: #282a36 !important;
			color: #f8f8f2 !important;
		}

		/* Popup */
		/* Logo */
		/* Navigation */
		`;
}
if ((location.hostname === "powh.io" || location.hostname.endsWith(".powh.io"))) {
		css += `
		/** POWH.io **/
		/* Disable Orig Stylings*/
		footer {
			background: transparent !important;
			background-color: transparent;
		}

		/* Button */
		button {
			color: #00d100 !important;
			background-color: white !important;
			border-color: #f8f8f2 !important;
		}

		.cta-btn {
			color: #f8f8f2 !important;
		}

		.cta-btn:hover {
			color: #f8f8f2 !important;
		}

		.btn.tp-caption:hover {
			color: #282a36 !important;
		}

		li.ui-tabs-active {
			background: #505050 !important;
		}

		.ui-tabs-active.ui-state-hover a:hover {
			color: #00d100 !important;
		}

		/* Text */
		p,
		span,
		div,
		li,
		h1,
		h2,
		h3,
		h4,
		h5,
		h6,
		a,
		footer {
			color: #f8f8f2 !important;
		}

		#preloader {
			background-color: #ccc !important;
		}

		/** 
		#preloader .loader-img {
			background: none !important;
		} 
		**/
		a {
			color: #00d100 !important;
		}

		a:hover {
			color: #e6ae49 !important;
		}

		.dark-color .tp-caption {
			color: #323232 !important;
		}

		.page-breadcrumb {
			background-color: #3d3d3d !important;
		}

		/* Root */
		body,
		#social,
		.inner-intro {
			background-color: #282a36 !important;
			color: #f8f8f2 !important;
		}

		/* Popup */
		/* Tooltip */
		.tipper .tipper-content {
			background: #565656 !important;
			color: #f8f8f2 !important;
		}

		.tipper.top .tipper-caret {
			bottom: -5px;
			left: 0;
			border-left: 5px solid transparent;
			border-right: 5px solid transparent;
			border-top: 5px solid #a8a8a8 !important;
		}

		/* Logo */
		/* Navigation */
		.header.header-prepare {
			background-color: #00897bf2 !important;
		}
		.nav-menu li > a,
		.scroll-top:hover {
			color: #f8f8f2 !important;
		}

		.client-logo {
			background: none !important;
			background-color: #505050 !important;
			padding: 10px !important;
		}

		#imgDisp {
			background-color: #00897b75 !important;
		}
		`;
}
if (location.href === "https://p3d-bot.github.io/buy.html") {
		css += `
		/** Exchange backup on p3d-bot.github.io/buy.html **/
		/* Disable Orig Stylings*/
		div {
			background: transparent !important;
			background-color: transparent;
		}

		/* Button */
		button {
			color: #00d100 !important;
			border-color: #f8f8f2 !important;
		}

		/* Text */
		p,
		span,
		div,
		li,
		h1,
		h2,
		h3,
		h4 {
			color: #f8f8f2 !important;
		}

		/* Root */
		body {
			background-color: #282a36 !important;
			color: #f8f8f2 !important;
		}

		/* Popup */
		/* Logo */
		.header * img {
			background-color: #6b6b6b;
			padding: 8px;
		}

		/* Navigation */
		`;
}
if (location.href === "https://p3d-bot.github.io/howtoplay.html" || location.href === "https://p3d-bot.github.io/donotpush/donotpush") {
		css += `
		/** Faq and undocumented Button on p3d-bot.github.io/howtoplay.html **/
		/* Disable Orig Stylings*/
		#services,
		div {
			background: transparent !important;
			background-color: transparent;
		}

		/* Button */
		button {
			color: #00d100 !important;
			border-color: #f8f8f2 !important;
		}

		/* Text */
		p,
		span,
		div,
		li,
		h1,
		h2,
		h3,
		h4 {
			color: #f8f8f2 !important;
		}

		/* Root */
		body {
			background-color: #282a36 !important;
			color: #f8f8f2 !important;
		}

		/* Popup */
		/* Logo */
		.header * img {
			background-color: #6b6b6b;
			padding: 8px;
		}

		/* Navigation */
		`;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
