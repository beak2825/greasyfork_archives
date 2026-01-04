// ==UserScript==
// @name SteamStat.us - Team Fortress 2
// @namespace typpi.online
// @version 20241118.23.53
// @description SteamStat.us - Team Fortress 2 Theme
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.steamstat.us/*
// @downloadURL https://update.greasyfork.org/scripts/517976/SteamStatus%20-%20Team%20Fortress%202.user.js
// @updateURL https://update.greasyfork.org/scripts/517976/SteamStatus%20-%20Team%20Fortress%202.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Main title styling with Team Fortress 2 colors */
	.title {
		margin: 10px 0;
		background: linear-gradient(
			135deg,
			#b8383b 30%,
			#5e76a8 70%
		); /* Red to Blue gradient */
		color: #b8383b; /* TF2 Red Team color */
		font-weight: 700;
		font-size: 2.6em;
		text-align: center;
		text-shadow: 3px 3px 5px rgb(0 0 0 / 50%);
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
		background: url('https://i.gyazo.com/5981acdc7b93ea0caca2462c8a01dc7b.png')
			no-repeat center; /* TF2 logo */
		background-size: auto 200%;
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
		color: #b8383b; /* TF2 Red */
		font-weight: 700;
		text-decoration: none;
		text-shadow: 1px 1px 2px rgb(0 0 0 / 40%);
	}
	a:hover {
		color: #5e76a8; /* TF2 Blue */
		text-decoration: underline;
		text-shadow: 2px 2px 6px rgb(0 0 0 / 70%);
	}

	/* Status colors with TF2 theme */
	.good {
		transition: color 0.3s ease;
		color: #5e76a8; /* TF2 Blue */
		text-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
	}
	.minor {
		transition: color 0.3s ease;
		color: #ffffff; /* White for minor status */
		font-weight: 700;
		text-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
	}
	.major {
		transition: color 0.3s ease;
		color: #b8383b; /* TF2 Red */
		font-weight: 700;
		text-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
	}

	/* Refresh button styling with hover effect */
	#js-refresh {
		transition:
			color 0.3s ease,
			transform 0.3s ease;
		color: #b8383b; /* TF2 Red */
		font-weight: bolder;
		text-shadow: 0 0 3px rgb(0 0 0);
	}
	#js-refresh:hover {
		transform: scale(1.1);
		color: #5e76a8; /* TF2 Blue */
	}

	/* Container with team colors */
	.services,
	#psa,
	noscript,
	footer {
		position: relative;
		transition:
			box-shadow 0.3s ease,
			background 0.3s ease;
		box-shadow: 0 4px 12px rgb(0 0 0 / 80%);
		border: 1px solid #b8383b; /* Red border */
		border-radius: 4px;
		background: linear-gradient(
			135deg,
			rgb(184 56 59 / 80%) 30%,
			rgb(94 118 168 / 80%) 70%
		); /* Red to Blue gradient */
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

	/* Body styling with Team Fortress 2 background */
	body {
		transition: background 0.3s ease;
		margin: 0;
		background: url('https://i.gyazo.com/38db4c4bdeca3e407043a778ee558475.jpg')
			no-repeat center center fixed; /* TF2 background image */
		background-size: cover;
		color: #b8383b; /* TF2 Red */
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
		background: rgb(184 56 59 / 90%); /* Red background */
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

	/* Advanced feature: Animated team colors border */
	.gradient-border {
		position: relative;
		box-shadow: 0 0 10px rgb(184 56 59 / 80%);
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
			#b8383b,
			#5e76a8,
			#b8383b
		); /* Red to Blue */
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
