// ==UserScript==
// @name SteamStat.us - The Crew: Motorfest
// @namespace typpi.online
// @version 20241115.16.05
// @description SteamStat.us - The Crew: Motorfest Theme
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.steamstat.us/*
// @downloadURL https://update.greasyfork.org/scripts/517977/SteamStatus%20-%20The%20Crew%3A%20Motorfest.user.js
// @updateURL https://update.greasyfork.org/scripts/517977/SteamStatus%20-%20The%20Crew%3A%20Motorfest.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Main title styling with Motorfest colors */
	.title {
		margin: 10px 0;
		background: linear-gradient(
			135deg,
			#ff4500 30%,
			#00ced1 70%
		);
		color: #ff4500;
		font-weight: 700;
		font-size: 2.6em;
		text-align: center;
		/* Motorfest Orange */
		text-shadow: 3px 3px 5px rgb(0 0 0 / 50%);
		/* Orange to Teal gradient */
		-webkit-text-stroke-width: 1px;
		-webkit-text-stroke-color: #000000;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		display: flex;
		position: relative;
		justify-content: center;
		align-items: center;
		animation: title-animation 3s ease-in-out infinite
			alternate;
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

	/* Logo addition with scaling effect */
	.title::after {
		display: inline-block;
		transition: transform 0.3s ease;
		margin-left: 10px;
		background: url('https://i.gyazo.com/f1273792dc6be70cae0d37b490fdd03a.png')
			no-repeat center;
		background-size: contain;
		width: 250px;
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
		color: #ff4500;
		font-weight: 700;
		/* Motorfest Orange */
		text-decoration: none;
		text-shadow: 1px 1px 2px rgb(0 0 0 / 40%);
	}

	a:hover {
		color: #00ced1;
		/* Motorfest Teal */
		text-decoration: underline;
		text-shadow: 2px 2px 6px rgb(0 0 0 / 70%);
	}

	/* Status colors with Motorfest theme */
	.good {
		transition: color 0.3s ease;
		color: #00ced1;
		/* Motorfest Teal */
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
		color: #ff4500;
		font-weight: 700;
		/* Motorfest Orange */
		text-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
	}

	/* Refresh button styling with hover effect */
	#js-refresh {
		transition:
			color 0.3s ease,
			transform 0.3s ease;
		color: #ff4500;
		font-weight: bolder;
		text-shadow: 0 0 3px rgb(0 0 0);
	}

	#js-refresh:hover {
		transform: scale(1.1);
		color: #00ced1;
	}

	/* Container with neon accents */
	.services,
	#psa,
	noscript,
	footer {
		position: relative;
		transition:
			box-shadow 0.3s ease,
			background 0.3s ease;
		box-shadow: 0 4px 12px rgb(0 0 0 / 80%);
		border: 1px solid #ff4500;
		border-radius: 4px;
		background: linear-gradient(
			135deg,
			rgb(255 69 0 / 80%) 30%,
			rgb(0 206 209 / 80%) 70%
		);
		color: #ffffff;
		font-size: 1em;
		line-height: 1.5;
		text-shadow: 0 0 4px rgb(0 0 0 / 90%);
	}

	.services:hover,
	#psa:hover,
	noscript:hover,
	footer:hover {
		box-shadow: 0 6px 15px rgb(0 0 0 / 90%);
		background: rgb(0 0 0 / 95%);
	}

	/* Body styling with vibrant tropical backdrop */
	body {
		transition: background 0.3s ease;
		margin: 0;
		background: url('https://i.gyazo.com/2107a4c02a92a0a2b651a56eeb87bf64.jpg')
			no-repeat center center fixed;
		background-size: cover;
		background-position-x: 1px;
		color: #ff4500;
		font-weight: 300;
		font-size: 16px;
		font-family: Roboto, Arial, sans-serif;
		text-shadow: 2px 2px 4px rgb(0 0 0 / 70%);
	}

	/* Tooltip customization */
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
		border-radius: 8px;
		background: rgb(255 69 0 / 90%);
		padding: 8px;
		width: 96%;
		content: attr(data-tooltip);
		color: #ffffff;
		font-size: 0.9em;
		text-shadow: 2px 2px 4px rgb(0 0 0 / 50%);
	}

	[data-tooltip]:hover::before {
		visibility: visible;
		opacity: 100%;
	}

	/* Advanced feature: Animated neon border */
	.gradient-border {
		position: relative;
		box-shadow: 0 0 10px rgb(255 69 0 / 80%);
		border-radius: 6px;
		background-color: rgb(0 0 0 / 90%);
		padding: 12px;
		color: #ffffff;
		font-weight: 700;
		text-align: center;
	}

	.gradient-border::before {
		position: absolute;
		z-index: -1;
		animation: gradient-border 4s linear infinite;
		inset: 0;
		border-radius: 6px;
		background: linear-gradient(
			45deg,
			#ff4500,
			#00ced1,
			#ff4500
		);
		background-size: 300% 300%;
		content: '';
	}

	@keyframes gradient-border {
		0% {
			background-position: 0% 50%;
		}

		50% {
			background-position: 100% 50%;
		}

		100% {
			background-position: 0% 50%;
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
