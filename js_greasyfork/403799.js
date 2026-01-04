// ==UserScript==
// @name Etherscan.io Dark (Source Viewer) fix Solarized-mode
// @namespace https://greasyfork.org/users/517035
// @version 0.0.2
// @description This is the Etherscan Dark (Source Viewer) fix Solarized-mode Edition for Tronscan.org
// @author zirs3d
// @license CC0-1.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.etherscan.io/*
// @match *://*.cn.etherscan.com/*
// @downloadURL https://update.greasyfork.org/scripts/403799/Etherscanio%20Dark%20%28Source%20Viewer%29%20fix%20Solarized-mode.user.js
// @updateURL https://update.greasyfork.org/scripts/403799/Etherscanio%20Dark%20%28Source%20Viewer%29%20fix%20Solarized-mode.meta.js
// ==/UserScript==

(function() {
let css = `
/** Text **/

.ace_text-layer {
    font-size: 1.1em !important;
}

body.dark-mode .ace_comment {
	color: var(--green) !important;
}

body.dark-mode .ace_string {
	color: var(--yellow) !important;
}

body.dark-mode .ace_constant,
body.dark-mode .ace_keyword {
	color: var(--teal) !important;
}

.ace_comment {
	color: #8d43b8 !important;
}

.ace_string {
	color: var(--blue) !important;
}

.ace_constant,
.ace_keyword {
	color: #a20076 !important;
}


/** Disable **/
/** 

div {
	background: transparent !important;
	background-color: transparent;
}
**/
/** Button **/

/** Root **/
/**

body {
	background-color: #282a36 !important;
	color: #f8f8f2 !important;
}
**/
/** Popup **/
/** Logo **/
/** Navigation **/
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
