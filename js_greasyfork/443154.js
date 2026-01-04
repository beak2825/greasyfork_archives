// ==UserScript==
// @name Wolfermus Website Hacks: Main Wordle main.css
// @namespace https://greasyfork.org/en/users/900467-feb199
// @version 0.1.1
// @description This script contains css for website hacks that i have created and wanted to share
// @author Feb199/Dannysmoka
// @homepageURL https://github.com/Wolfermus/Wolfermus-Website-Hacks
// @supportURL https://github.com/Wolfermus/Wolfermus-Website-Hacks/issues
// @license GPLv3
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/443154/Wolfermus%20Website%20Hacks%3A%20Main%20Wordle%20maincss.user.js
// @updateURL https://update.greasyfork.org/scripts/443154/Wolfermus%20Website%20Hacks%3A%20Main%20Wordle%20maincss.meta.js
// ==/UserScript==

(function() {
let css = `/* CSS Document */

/*
body {
	margin: 0;
	font-family: "Work Sans", sans-serif;
	font-weight: 400;
	line-height: 1.5;
	background: #222222
}
*/


.wlfContainer {
	margin: 0;
	font-family: "Work Sans", sans-serif;
	font-weight: 400;
	line-height: 1.5;
	background: #009578;
	box-shadow: 0 0 5px 5px rgba(0, 149, 120, 1);
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
}

.wlfContainer::after {
	content: "";
	display: table;
	clear: both;
}

.wlfWrapper {
	width: 80%;
	margin: 0 auto;
	display: flex;
}

.wlfLogo {
	float: left;
	padding: 10px 0;
	height: 120px;
}

.wlfNav {
	height: 100px;
	color: #ffffff;
	float: right;
	width: 100%;
	text-align: center;
}

.wlfNav ul {
	margin: 0;
	padding: 0;
	list-style: none;
	place-items: center;
}

.wlfNav li {
	display: inline-block;
	margin-left: 1.5%;
	margin-right: 1.5%;
	padding-top: 20px;
	width: 200px;
	
	position: relative;
}

.wlfNav ul li a {
	color: #444;
	text-decoration: none;
	text-transform: uppercase;
	font-size: 14px;
}

.wlfNav ul li a:hover {
	color: #000;
}

.wlfNav ul li a::before {
	content: "";
	display: block;
	border-radius: 50%;
	height: 5px;
	background-color: #007960;
	
	
	position: absolute;
	width: 0%;
	
	transition: all ease-in-out 250ms;
}

.wlfNav ul li a::after {
	content: "";
	display: block;
	border-radius: 50%;
	height: 5px;
	background-color: #007960;
	
	
	position: absolute;
	width: 0%;
	
	transition: all ease-in-out 250ms;
}

.wlfNav ul li a:hover::before {
	width: 100%;
}

.wlfNav ul li a:hover::after {
	width: 100%;
}

.wlf-Output {
	margin-top: 30px;
	display: block;
	width: 100%;
	text-align: center;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
