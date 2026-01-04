// ==UserScript==
// @name SteamStat.us - Detroit Tigers
// @namespace typpi.online
// @version 20241115.16.05
// @description SteamStat.us - Detroit Tigers Theme with Advanced CSS
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.steamstat.us/*
// @downloadURL https://update.greasyfork.org/scripts/517982/SteamStatus%20-%20Detroit%20Tigers.user.js
// @updateURL https://update.greasyfork.org/scripts/517982/SteamStatus%20-%20Detroit%20Tigers.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Main title styling with Detroit Tigers colors */
	.title {
		margin: 10px 0;
		background: linear-gradient(
			135deg,
			#0c2340 30%,
			#ffffff 70%
		);
		/* Navy Blue to White gradient */
		background-clip: text;
		color: #0c2340;
		font-weight: 700;
		font-size: 2.6em;
		text-align: center;
		/* Detroit Tigers Navy Blue */
		text-shadow: 2px 2px 4px rgb(0 0 0 / 60%);
		-webkit-text-fill-color: transparent;
		display: flex;
		position: relative;
		justify-content: center;
		align-items: center;
		animation: title-animation 2s ease-in-out infinite
			alternate;
	}

	/* Animation for the title */
	@keyframes title-animation {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(10deg);
		}
	}

	/* Logo addition with scaling effect */
	.title::after {
		display: inline-block;
		transition: transform 0.3s ease;
		margin-left: 10px;
		background: url('https://upload.wikimedia.org/wikipedia/commons/e/e3/Detroit_Tigers_logo.svg')
			no-repeat center;
		background-size: contain;
		width: 60px;
		height: 60px;
		content: '';
	}

	.title:hover::after {
		transform: scale(1.2);
	}

	/* Link styling with hover effect */
	a {
		transition:
			color 0.3s ease,
			text-shadow 0.3s ease;
		color: #0c2340;
		font-weight: 700;
		/* Detroit Tigers Navy Blue */
		text-decoration: none;
		text-shadow: 1px 1px 0 rgb(0 0 0 / 40%);
	}

	a:hover {
		color: #fb4f14;
		/* Detroit Tigers Orange */
		text-decoration: underline;
		text-shadow: 1px 1px 3px rgb(0 0 0 / 60%);
	}

	/* Status colors with Detroit Tigers theme */
	.good {
		transition: color 0.3s ease;
		color: #fb4f14;
		/* Detroit Tigers Orange */
		text-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
	}

	.minor {
		transition: color 0.3s ease;
		color: #ffffff;
		font-weight: 700;
		/* White for minor status */
		text-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
	}

	.major {
		transition: color 0.3s ease;
		color: #0c2340;
		font-weight: 700;
		/* Detroit Tigers Navy Blue */
		text-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
	}

	/* Refresh button styling with hover effect */
	#js-refresh {
		transition:
			color 0.3s ease,
			transform 0.3s ease;
		color: #0c2340;
		font-weight: bolder;
		/* Detroit Tigers Navy Blue */
		text-shadow: 0 0 2px rgb(0 0 0);
	}

	#js-refresh:hover {
		/* Detroit Tigers Orange */
		transform: scale(1.1);
		color: #fb4f14;
	}

	/* Container with navy blue background and orange accents */
	.services,
	#psa,
	noscript {
		position: relative;
		/* White text */
		transition:
			box-shadow 0.3s ease,
			background 0.3s ease;
		box-shadow: 0 4px 8px rgb(0 0 0);
		/* Detroit Tigers Navy Blue */
		border: 1px solid #fb4f14;
		/* Detroit Tigers Orange border */
		border-radius: 3px;
		background: #0c2340;
		color: #ffffff;
		font-size: 1em;
		line-height: 1.5;
		text-shadow: 0 0 1px rgb(0 0 1);
	}

	.services:hover,
	#psa:hover,
	noscript:hover {
		box-shadow: 0 4px 12px rgb(0 0 0 / 50%);
		background: rgb(0 0 0 / 60%);
		/* Navy Blue on hover */
	}

	/* Body styling with navy blue and orange gradient */
	body {
		transition: background 0.3s ease;
		margin: 0;
		background: linear-gradient(
			135deg,
			#0c2340 30%,
			#fb4f14 70%
		);
		color: #0c2340;
		font-weight: 300;
		font-size: 16px;
		/* Detroit Tigers Navy Blue */
		font-family: Roboto, Arial, sans-serif;
		/* Navy Blue to White gradient */
		text-shadow: 1px 1px 3px rgb(0 0 0);
	}

	body:hover {
		background: linear-gradient(
			135deg,
			#ffffff 30%,
			#0c2340 70%
		);
		/* White to Navy Blue gradient */
	}

	/* Tooltip customization with smooth transition */
	[data-tooltip]::before {
		position: absolute;
		top: 0;
		left: 2%;
		visibility: hidden;
		opacity: 0%;
		z-index: 1;
		transition:
			visibility 0s,
			opacity 0.3s ease-in-out;
		border-radius: 6px;
		background: #0c2340;
		/* Detroit Tigers Orange text */
		padding: 8px;
		width: 96%;
		content: attr(data-tooltip);
		/* Detroit Tigers Navy Blue background */
		color: #fb4f14;
		font-style: italic;
		font-weight: 300;
		font-size: 0.9em;
		text-shadow: 1px 1px 3px rgb(0 0 0 / 40%);
	}

	[data-tooltip]:hover::before {
		visibility: visible;
		opacity: 100%;
	}

	/* Advanced feature: Gradient border with transition */
	.gradient-border {
		position: relative;
		border-radius: 5px;
		background-color: #fb4f14;
		padding: 10px;
		/* Detroit Tigers Orange */
		color: #ffffff;
		/* White text */
		font-weight: 700;
		text-align: center;
	}

	.gradient-border::before {
		position: absolute;
		z-index: -1;
		animation: gradient-border 3s linear infinite;
		inset: 0;
		border-radius: 5px;
		background: linear-gradient(
			45deg,
			#fb4f14,
			#0c2340,
			#fb4f14,
			#0c2340
		);
		/* Orange to Navy Blue */
		background-size: 400% 400%;
		content: '';
	}

	/* Animation for gradient border */
	@keyframes gradient-border {
		0% {
			background-position: 400% 0%;
		}

		50% {
			background-position: 0% 100%;
		}

		100% {
			background-position: 400% 0%;
		}
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
