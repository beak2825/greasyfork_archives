// ==UserScript==
// @name SteamStat.us - World of Warcraft
// @namespace typpi.online
// @version 20241115.16.05
// @description SteamStat.us - World of Warcraft Theme with Advanced CSS
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.steamstat.us/*
// @downloadURL https://update.greasyfork.org/scripts/518145/SteamStatus%20-%20World%20of%20Warcraft.user.js
// @updateURL https://update.greasyfork.org/scripts/518145/SteamStatus%20-%20World%20of%20Warcraft.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Main title styling with WoW colors */
	.title {
		margin: 10px 0;
		background: linear-gradient(
			135deg,
			#ffd700 30%,
			#4a3a1c 70%
		);
		color: #ffd700;
		font-weight: 700;
		font-size: 2.6em;
		text-align: center;
		/* WoW Gold */
		text-shadow: 2px 2px 0 rgb(0 0 0 / 40%);
		/* Gold to Brown */
		-webkit-text-stroke-width: 1px;
		-webkit-text-stroke-color: black;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		display: flex;
		position: relative;
		justify-content: center;
		align-items: center;
		animation: title-animation 2s ease-in-out infinite
			alternate;
		font-family: Merriweather, serif;
	}

	/* Animation for the title */
	@keyframes title-animation {
		0% {
			transform: scale(1);
		}

		100% {
			transform: scale(1.05);
		}
	}

	/* Logo addition with scaling effect */
	.title::after {
		display: inline-block;
		transition: transform 0.3s ease;
		margin-left: 10px;
		background: url('https://i.gyazo.com/cc0548ce7f1b051ade8a24d5dc5ad508.png')
			no-repeat center;
		background-size: contain;
		width: 100px;
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
		color: #ffd700;
		font-weight: 700;
		/* WoW Gold */
		text-decoration: none;
		text-shadow: 1px 1px 0 rgb(0 0 0 / 40%);
	}

	a:hover {
		color: #4a3a1c;
		/* WoW Dark Brown */
		text-decoration: underline;
		text-shadow: 1px 1px 3px rgb(0 0 0 / 60%);
	}

	/* Status colors with WoW theme */
	.good {
		transition: color 0.3s ease;
		color: #ffd700;
		/* WoW Gold */
		text-shadow: 1px 1px 2px rgb(0 0 0);
	}

	.minor {
		transition: color 0.3s ease;
		color: #790303;
		font-weight: 700;
		/* White for minor status */
		text-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
	}

	.major {
		transition: color 0.3s ease;
		color: #4a3a1c;
		font-weight: 700;
		/* WoW Dark Brown */
		text-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
	}

	/* Refresh button styling with hover effect */
	#js-refresh {
		transition:
			color 0.3s ease,
			transform 0.3s ease;
		color: #ffd700;
		font-weight: bolder;
		/* WoW Gold */
		text-shadow: 0 0 2px rgb(0 0 0);
	}

	#js-refresh:hover {
		/* WoW Dark Brown */
		transform: scale(1.1);
		color: #4a3a1c;
	}

	/* Container with dark background and gold accents */
	.services,
	#psa,
	noscript,
	footer,
	div.regions-title.sep {
		position: relative;
		/* White text */
		transition:
			box-shadow 0.3s ease,
			background 0.3s ease;
		box-shadow: 0 4px 8px rgb(0 0 0);
		/* WoW Dark Brown to Gold */
		border: 1px solid #ffd700;
		/* WoW Gold border */
		border-radius: 5px;
		background: linear-gradient(
			135deg,
			#4a3a1c 30%,
			#ffd700 70%
		);
		color: #ffffff;
		font-size: 1em;
		line-height: 1.5;
		text-shadow: 0 0 2px rgb(0 0 0);
	}

	.services:hover,
	#psa:hover,
	noscript:hover,
	footer:hover,
	div.regions-title.sep:hover {
		box-shadow: 0 4px 12px rgb(0 0 0 / 50%);
		background: rgb(0 0 0 / 90%);
	}

	/* Body styling with a WoW background */
	body {
		transition: background 0.3s ease;
		margin: 0;
		background: url('https://i.gyazo.com/32e11566c0e73d25ed470ab687959359.jpg')
			repeat-y;
		color: #ffd700;
		font-weight: 300;
		font-size: 16px;
		/* WoW Gold */
		font-family: Merriweather, serif;
		/* WoW Background */
		text-shadow: 1px 1px 3px rgb(0 0 0);
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
		border-radius: 6px;
		background: #4a3a1c;
		/* WoW Gold */
		padding: 8px;
		width: 96%;
		content: attr(data-tooltip);
		/* WoW Dark Brown */
		color: #ffd700;
		font-style: italic;
		font-weight: 300;
		font-size: 0.9em;
		text-shadow: 1px 1px 3px rgb(0 0 0 / 40%);
	}

	[data-tooltip]:hover::before {
		visibility: visible;
		opacity: 100%;
	}

	/* Gradient border with WoW-themed animation */
	.gradient-border {
		position: relative;
		border-radius: 5px;
		background-color: #ffd700;
		padding: 10px;
		/* WoW Gold */
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
			#ffd700,
			#4a3a1c,
			#ffd700,
			#4a3a1c
		);
		/* Gold to Dark Brown */
		background-size: 400% 400%;
		content: '';
	}

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
