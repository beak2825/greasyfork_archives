// ==UserScript==
// @name SteamStat.us - Windows 95 Theme
// @namespace typpi.online
// @version 20241119.00.12
// @description SteamStat.us - Windows 95 theme
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.steamstat.us/*
// @downloadURL https://update.greasyfork.org/scripts/518004/SteamStatus%20-%20Windows%2095%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/518004/SteamStatus%20-%20Windows%2095%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Main title styling with Windows 95 look */
	.title {
		display: flex;
		position: relative;
		justify-content: center;
		align-items: center;
		margin: 10px 0;
		border: 2px solid #ffffff;
		border-right-color: #808080;
		border-bottom-color: #808080;
		background-color: #c0c0c0; /* Light gray background */
		padding: 5px;
		color: black;
		font-weight: 700;
		font-size: 2em;
		font-family:
			MS Sans serif,
			Tahoma,
			Verdana,
			Arial,
			sans-serif;
		text-align: center;
	}

	/* Logo addition with Windows 95 logo */
	.title::after {
		display: inline-block;
		margin-left: 10px;
		background: url('https://i.gyazo.com/e96376514655b9307ce82826b1ae2691.png')
			no-repeat center;
		background-size: contain;
		width: 150px;
		height: 50px;
		content: '';
	}

	/* Link styling */
	a {
		color: #0000ee; /* Standard link color */
		font-weight: 400;
		font-family:
			MS Sans serif,
			Tahoma,
			Verdana,
			Arial,
			sans-serif;
		text-decoration: underline;
	}

	a:hover {
		color: #551a8b; /* Visited link color */
	}

	/* Status colors */
	.good {
		color: black;
	}
	.minor {
		color: #808080; /* Dark gray */
	}
	.major {
		color: #ff0000; /* Red */
	}

	/* Refresh button styling */
	#js-refresh {
		cursor: pointer;
		border: 2px solid #ffffff;
		border-right-color: #808080;
		border-bottom-color: #808080;
		background-color: #c0c0c0;
		padding: 2px 5px;
		color: black;
		font-weight: 700;
		font-family:
			MS Sans serif,
			Tahoma,
			Verdana,
			Arial,
			sans-serif;
	}

	#js-refresh:active {
		border-color: #808080 #ffffff #ffffff #808080;
	}

	/* Container styling */
	.services,
	#psa,
	noscript,
	footer,
	div.regions-title.sep {
		margin: 10px;
		border: 2px solid #ffffff;
		border-right-color: #808080;
		border-bottom-color: #808080;
		background-color: #c0c0c0; /* Light gray */
		padding: 10px;
		color: black;
		font-family:
			MS Sans serif,
			Tahoma,
			Verdana,
			Arial,
			sans-serif;
	}

	/* Body styling */
	body {
		margin: 0;
		background-color: #008080; /* Teal background */
		font-family:
			MS Sans serif,
			Tahoma,
			Verdana,
			Arial,
			sans-serif;
	}

	/* Tooltip customization */
	[data-tooltip]::before {
		position: absolute;
		top: -30px;
		left: 0;
		visibility: hidden;
		opacity: 0%;
		z-index: 1000;
		border: 1px solid #000000;
		background-color: #ffffe0; /* Light yellow */
		padding: 5px;
		width: 200px;
		content: attr(data-tooltip);
		color: black;
		font-size: 0.8em;
		font-family:
			MS Sans serif,
			Tahoma,
			Verdana,
			Arial,
			sans-serif;
	}
	[data-tooltip]:hover::before {
		visibility: visible;
		opacity: 100%;
	}

	/* Buttons */
	button {
		cursor: pointer;
		border: 2px solid #ffffff;
		border-right-color: #808080;
		border-bottom-color: #808080;
		background-color: #c0c0c0;
		padding: 2px 5px;
		color: black;
		font-family:
			MS Sans serif,
			Tahoma,
			Verdana,
			Arial,
			sans-serif;
	}
	button:active {
		border-color: #808080 #ffffff #ffffff #808080;
	}

	/* Remove modern scrollbars */
	::-webkit-scrollbar {
		width: 16px;
	}
	::-webkit-scrollbar-track {
		border-top: 2px solid #ffffff;
		border-right: 2px solid #808080;
		border-bottom: 2px solid #808080;
		border-left: 2px solid #ffffff;
		background: #c0c0c0;
	}
	::-webkit-scrollbar-thumb {
		border: 1px solid #808080;
		background: #e0e0e0;
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
