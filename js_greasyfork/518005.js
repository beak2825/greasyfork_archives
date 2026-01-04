// ==UserScript==
// @name SteamStat.us - Witcher 3 Theme
// @namespace typpi.online
// @version 20241115.16.05
// @description SteamStat.us - Witcher 3 style
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.steamstat.us/*
// @downloadURL https://update.greasyfork.org/scripts/518005/SteamStatus%20-%20Witcher%203%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/518005/SteamStatus%20-%20Witcher%203%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Main title styling with Witcher-inspired colors */
	.title {
		margin: 10px 0;
		background: linear-gradient(
			135deg,
			#8b0000 30%,
			#ffd700 70%
		); /* Dark Red to Gold */
		color: #b22222; /* Witcher Red */
		font-weight: 700;
		font-size: 2.6em;
		text-align: center;
		text-shadow: 2px 2px 5px rgb(0 0 0 / 60%);
		-webkit-text-stroke-width: 1px;
		-webkit-text-stroke-color: #ffffff96;
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
	/* Logo addition with Witcher medallion effect */
	.title::after {
		display: inline-block;
		transition: transform 0.3s ease;
		margin-left: 10px;
		background: url('https://i.gyazo.com/f2d821c47cc5df51c893d7333c1c93b1.png')
			no-repeat center; /* Witcher medallion */
		background-size: auto 100%;
		width: 200px;
		height: 60px;
		content: '';
	}
	.title:hover::after {
		transform: scale(1.5);
	}
	/* Link styling with hover effect */
	a {
		transition:
			color 0.3s ease,
			text-shadow 0.3s ease;
		color: #ffd700; /* Gold */
		font-weight: 700;
		text-decoration: none;
		text-shadow: 1px 1px 2px rgb(0 0 0 / 40%);
	}
	a:hover {
		color: #b22222; /* Witcher Red */
		text-decoration: underline;
		text-shadow: 2px 2px 6px rgb(0 0 0 / 70%);
	}
	/* Status colors with Witcher theme */
	.good {
		transition: color 0.3s ease;
		color: #6b8e23; /* Olive Green */
		text-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
	}
	.minor {
		transition: color 0.3s ease;
		color: #ffffff; /* White */
		font-weight: 700;
		text-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
	}
	.major {
		transition: color 0.3s ease;
		color: #b22222; /* Witcher Red */
		font-weight: 700;
		text-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
	}
	/* Refresh button styling */
	#js-refresh {
		transition:
			color 0.3s ease,
			transform 0.3s ease;
		color: #ffd700; /* Gold */
		font-weight: bolder;
		text-shadow: 0 0 3px rgb(0 0 0 / 80%);
	}
	#js-refresh:hover {
		transform: scale(1.1);
		color: #8b0000; /* Dark Red */
	}
	/* Container with Witcher-inspired accents */
	.services,
	#psa,
	noscript,
	footer {
		position: relative;
		transition:
			box-shadow 0.3s ease,
			background 0.3s ease;
		box-shadow: 0 4px 12px rgb(0 0 0 / 80%);
		border: 1px solid #b22222;
		border-radius: 4px;
		background: linear-gradient(
			135deg,
			rgb(139 0 0 / 80%) 30%,
			rgb(218 165 32 / 80%) 70%
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
	/* Body styling with Witcher backdrop */
	body {
		transition: background 0.3s ease;
		margin: 0;
		background: url('https://i.gyazo.com/1ebf57cc6e04b6d589057fdc5b637365.jpg')
			no-repeat center center fixed; /* Witcher backdrop */
		background-size: cover;
		color: #ffd700; /* Gold */
		font-weight: 300;
		font-size: 16px;
		font-family: Georgia, serif;
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
		background: rgb(139 0 0 / 90%); /* Dark Red */
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
	/* Advanced feature: Animated border */
	.gradient-border {
		position: relative;
		box-shadow: 0 0 10px rgb(139 0 0 / 80%);
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
			#8b0000,
			#ffd700,
			#8b0000
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
