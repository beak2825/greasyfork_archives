// ==UserScript==
// @name SteamStat.us - Miami Heat Red & Black
// @namespace typpi.online
// @version 20241115.16.05
// @description SteamStat.us - Miami Heat Red & Black Theme with Advanced CSS
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.steamstat.us/*
// @downloadURL https://update.greasyfork.org/scripts/517972/SteamStatus%20-%20Miami%20Heat%20Red%20%20Black.user.js
// @updateURL https://update.greasyfork.org/scripts/517972/SteamStatus%20-%20Miami%20Heat%20Red%20%20Black.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Main title styling with red and black */
	.title {
		margin: 10px 0;
		background: linear-gradient(
			135deg,
			#98002e 30%,
			#fff 70%
		);
		/* Red to Black gradient */
		background-clip: text;
		color: #98002e;
		font-weight: 700;
		font-size: 2.6em;
		text-align: center;
		/* Miami Heat Red */
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
		background: url('https://upload.wikimedia.org/wikipedia/de/thumb/f/fb/Miami_Heat_logo.svg/442px-Miami_Heat_logo.svg.png')
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
		color: #98002e;
		font-weight: 700;
		/* Miami Heat Red */
		text-decoration: none;
		text-shadow: 1px 1px 0 rgb(0 0 0 / 40%);
	}

	a:hover {
		color: #ffffff;
		/* White on hover for contrast */
		text-decoration: underline;
		text-shadow: 1px 1px 3px rgb(0 0 0 / 60%);
	}

	/* Status colors with red and black theme */
	.good {
		transition: color 0.3s ease;
		color: #98002e;
		/* Miami Heat Red */
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
		color: #000000;
		font-weight: 700;
		/* Black for major status */
		text-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
	}

	/* Refresh button styling with hover effect */
	#js-refresh {
		transition:
			color 0.3s ease,
			transform 0.3s ease;
		color: #98002e;
		font-weight: bolder;
		/* Miami Heat Red */
		text-shadow: 0 0 2px rgb(0 0 0);
	}

	#js-refresh:hover {
		/* White on hover */
		transform: scale(1.1);
		color: #ffffff;
	}

	/* Container with black background and red accents */
	.services,
	#psa,
	noscript {
		position: relative;
		/* White text */
		transition:
			box-shadow 0.3s ease,
			background 0.3s ease;
		box-shadow: 0 4px 8px rgb(0 0 0);
		/* Black background */
		border: 1px solid #98002e;
		/* Miami Heat Red border */
		border-radius: 3px;
		background: #000000;
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
		/* Miami Heat Red on hover */
	}

	/* Body styling with black and red gradient */
	body {
		transition: background 0.3s ease;
		margin: 0;
		background: linear-gradient(
			135deg,
			#98002e 30%,
			#000000 70%
		);
		color: #98002e;
		font-weight: 300;
		font-size: 16px;
		/* Miami Heat Red */
		font-family: Roboto, Arial, sans-serif;
		/* Red to Black gradient */
		text-shadow: 1px 1px 3px rgb(0 0 0);
	}

	body:hover {
		background: linear-gradient(
			135deg,
			#000000 30%,
			#98002e 70%
		);
		/* Black to Red gradient */
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
		background: #000000;
		/* Miami Heat Red text */
		padding: 8px;
		width: 96%;
		content: attr(data-tooltip);
		/* Black background */
		color: #98002e;
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
		background-color: #98002e;
		padding: 10px;
		/* Miami Heat Red */
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
			#98002e,
			#000000,
			#98002e,
			#000000
		);
		/* Red to Black */
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
