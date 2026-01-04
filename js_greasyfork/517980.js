// ==UserScript==
// @name SteamStat.us - Zwift Cycling Game Theme
// @namespace typpi.online
// @version 2.1
// @description Custom theme inspired by Zwift cycling game
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.steamstat.us/*
// @downloadURL https://update.greasyfork.org/scripts/517980/SteamStatus%20-%20Zwift%20Cycling%20Game%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/517980/SteamStatus%20-%20Zwift%20Cycling%20Game%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Main title styling with Zwift colors */
	.title {
		/*Display stuff*/
		display: flex;
		/*Positioning stuff*/
		position: relative;
		justify-content: center;
		align-items: center;
		/*Manipulations stuff*/
		animation: title-animation 3s ease-in-out infinite
			alternate;
		/*Box model stuff*/
		margin: 10px 0;
		background: linear-gradient(
			135deg,
			#ffffff 30%,
			#ff7f00 70%
		);
		color: #ff7f00;
		font-weight: 700;
		/*Typography stuff*/
		font-size: 2.6em;
		text-align: center;
		text-shadow: 2px 2px 5px rgb(0 0 0 / 60%);
		/*Miscellaneous*/
		/* Zwift Orange */
		/* White to Orange */
		-webkit-text-stroke-width: 1px;
		-webkit-text-stroke-color: #000000;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	/* Animation for the title */
	@keyframes title-animation {
		0% {
			transform: scale(1);
		}

		100% {
			transform: scale(1.08);
		}
	}

	/* Logo addition with Zwift emblem */
	.title::after {
		display: inline-block;
		/*Miscellaneous*/
		clip-path: circle();
		/*Manipulations stuff*/
		transition: transform 0.3s ease;
		margin-left: 10px;
		background-size: contain;
		background: url('https://i.gyazo.com/2a07deee44f8b2da87394d4393fcff0b.jpg')
			no-repeat center;
		/*Box model stuff*/
		width: 150px;
		height: 60px;
		/*Display stuff*/
		content: '';
	}

	.title:hover::after {
		/*Manipulations stuff*/
		transform: scale(1.5);
	}

	/* Link styling with hover effect */
	a {
		/*Manipulations stuff*/
		transition:
			color 0.3s ease,
			text-shadow 0.3s ease;
		color: #ff7f00;
		/*Typography stuff*/
		font-weight: 700;
		text-decoration: none;
		text-shadow: 1px 1px 2px rgb(0 0 0 / 40%);
		/*Miscellaneous*/
		/* Zwift Orange */
	}

	a:hover {
		color: #ffffff;
		/*Typography stuff*/
		text-decoration: underline;
		text-shadow: 2px 2px 6px rgb(0 0 0 / 70%);
		/*Miscellaneous*/
		/* White */
	}

	/* Status colors with Zwift theme */
	.good {
		/*Manipulations stuff*/
		transition: color 0.3s ease;
		color: #ffffff;
		/*Typography stuff*/
		text-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
		/*Miscellaneous*/
		/* White */
	}

	.minor {
		/*Manipulations stuff*/
		transition: color 0.3s ease;
		color: #ff7f00;
		/*Typography stuff*/
		font-weight: 700;
		text-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
		/*Miscellaneous*/
		/* Orange */
	}

	.major {
		/*Manipulations stuff*/
		transition: color 0.3s ease;
		color: #0073e6;
		/*Typography stuff*/
		font-weight: 700;
		text-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
		/*Miscellaneous*/
		/* Bright Blue */
	}

	/* Refresh button styling */
	#js-refresh {
		/*Manipulations stuff*/
		transition:
			color 0.3s ease,
			transform 0.3s ease;
		color: #ff7f00;
		/*Typography stuff*/
		font-weight: bolder;
		text-shadow: 0 0 3px rgb(0 0 0 / 80%);
		/*Miscellaneous*/
		/* Orange */
	}

	#js-refresh:hover {
		/*Manipulations stuff*/
		transform: scale(1.1);
		/*Typography stuff*/
		color: #ffffff;
		/*Miscellaneous*/
		/* White */
	}

	/* Container with Zwift-inspired accents */
	.services,
	#psa,
	noscript,
	footer {
		/*Positioning stuff*/
		position: relative;
		/*Manipulations stuff*/
		transition:
			box-shadow 0.3s ease,
			background 0.3s ease;
		/*Miscellaneous*/
		box-shadow: 0 4px 12px rgb(0 0 0 / 80%);
		/*Box model stuff*/
		border: 1px solid #ff7f00;
		border-radius: 4px;
		background: linear-gradient(
			135deg,
			rgb(255 127 0 / 80%) 30%,
			rgb(255 255 255 / 80%) 70%
		);
		color: #000000;
		/*Typography stuff*/
		font-size: 1em;
		line-height: 1.5;
		text-shadow: 0 0 4px rgb(0 0 0 / 90%);
	}

	.services:hover,
	#psa:hover,
	noscript:hover,
	footer:hover {
		/*Miscellaneous*/
		box-shadow: 0 6px 15px rgb(0 0 0 / 90%);
		/*Box model stuff*/
		background: rgb(0 0 0 / 95%);
		/*Typography stuff*/
		color: #ffffff;
	}

	/* Body styling with Zwift cycling backdrop */
	body {
		/*Manipulations stuff*/
		transition: background 0.3s ease;
		/*Box model stuff*/
		margin: 0;
		background-size: cover;
		background: url('https://i.gyazo.com/8eb3d105728604bc85421637d6605692.jpg')
			no-repeat center center fixed;
		color: #ff7f00;
		font-weight: 300;
		font-size: 16px;
		/*Typography stuff*/
		font-family: Lato, sans-serif;
		text-shadow: 2px 2px 4px rgb(0 0 0 / 70%);
		/*Miscellaneous*/
		/* Zwift background URL */
		/* Orange */
	}

	/* Tooltip customization */
	[data-tooltip]::before {
		/*Positioning stuff*/
		position: absolute;
		top: 0;
		left: 2%;
		/*Miscellaneous*/
		visibility: hidden;
		opacity: 0%;
		z-index: 1;
		/*Manipulations stuff*/
		transition:
			visibility 0s,
			opacity 0.3s ease-in-out;
		border-radius: 8px;
		background: rgb(255 127 0 / 90%);
		padding: 8px;
		/*Box model stuff*/
		width: 96%;
		/*Display stuff*/
		content: attr(data-tooltip);
		color: #000000;
		/*Typography stuff*/
		font-size: 0.9em;
		text-shadow: 2px 2px 4px rgb(0 0 0 / 50%);
		/* Orange */
	}

	[data-tooltip]:hover::before {
		/*Miscellaneous*/
		visibility: visible;
		/*Manipulations stuff*/
		opacity: 100%;
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
