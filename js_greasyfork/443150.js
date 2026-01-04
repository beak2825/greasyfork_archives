// ==UserScript==
// @name Wolfermus Website Hacks: Main Menu main.css
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
// @downloadURL https://update.greasyfork.org/scripts/443150/Wolfermus%20Website%20Hacks%3A%20Main%20Menu%20maincss.user.js
// @updateURL https://update.greasyfork.org/scripts/443150/Wolfermus%20Website%20Hacks%3A%20Main%20Menu%20maincss.meta.js
// ==/UserScript==

(function() {
let css = `/* CSS Document */


.main-wlf-container {
	z-index: 999999997;
}

.main-wlf-wrapper {
	z-index: 999999998;
}

.main-wlf-bg-modal {
	z-index: 999999999;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.7);
	position: absolute;
	top: 0;
	display: flex;
	justify-content: center;
	align-items: center;
}

.main-wlf-modal-content {
	width: 500px;
	height: 300px;
	background-color: #009578;
	border-radius: 20px;
	border-top-left-radius: 200px;
	border-top-right-radius: 75px;
	box-shadow: 25px 25px 75px rgba(0, 0, 0, 0.75),
		10px 10px 70px rgba(0, 0 ,0, 0.25),
		inset 5px 5px 10px rgba(0, 0, 0, 0.5),
		inset 5px 5px 20px rgba(255, 255, 255, 0.2),
		inset -5px -5px 15px rgba(0, 0, 0, 0.75);
	text-align: center;
	padding: 20px;
	position: relative;
}

.main-wlf-modal-content h1 {
	font-weight: 800;
	font-size: 1.5em;
}

.wlf-logo {
	width: 120px;
	height: 120px;
	display: inline-block;
}

#main-wlf-close {
	position: absolute;
	top: 20px;
	right: 36px;
	font-size: 42px;
	font-weight: 800;
	transform: rotate(45deg);
	cursor: pointer;
}

.main-wlf-nav {
	margin-top: 0;
	height: 100px;
	color: #000;
}

.main-wlf-nav .main-wlf-ul {
	margin: 0;
	padding: 0;
	list-style: none;
	place-items: center;
	display: none;
	visibility: hidden;
}

.main-wlf-nav li {
	display: inline-block;
	margin-left: 10px;
	margin-right: 10px;
	padding-top: 20px;
	
	position: relative;
}

.main-wlf-nav .main-wlf-ul li a {
	color: #444;
	text-decoration: none;
	text-transform: uppercase;
	font-size: 14px;
	cursor: pointer;
}

.main-wlf-nav .main-wlf-ul li a:hover {
	color: #000;
}

.main-wlf-nav .main-wlf-ul li a::before {
	content: "";
	display: block;
	border-radius: 50%;
	height: 5px;
	transform: translateY(-4px);
	background-color: #007960;
	
	
	position: absolute;
	width: 0%;
	
	transition: all ease-in-out 250ms;
}

.main-wlf-nav .main-wlf-ul li a::after {
	content: "";
	display: block;
	border-radius: 50%;
	height: 5px;
	background-color: #007960;
	
	
	position: absolute;
	width: 0%;
	
	transition: all ease-in-out 250ms;
}

.main-wlf-nav .main-wlf-ul li a:hover::before {
	width: 100%;
}

.main-wlf-nav .main-wlf-ul li a:hover::after {
	width: 100%;
}

.main-wlf-modal-content footer {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 15px;
    font-size: small;
}

.main-wlf-modal-content footer a:link {
  color: red;
  background-color: transparent;
  text-decoration: none;
}

.main-wlf-modal-content footer a:visited {
  color: pink;
  background-color: transparent;
  text-decoration: none;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
