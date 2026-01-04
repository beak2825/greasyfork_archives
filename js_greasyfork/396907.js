// ==UserScript==
// @name Dreamwidth - Return of Shifty
// @namespace https://greasyfork.org/users/3759
// @version 1.0
// @description Reverts the shifty-eyed subject line emote to its original form.
// @grant GM_addStyle
// @run-at document-start
// @match *://*.dreamwidth.org/*
// @downloadURL https://update.greasyfork.org/scripts/396907/Dreamwidth%20-%20Return%20of%20Shifty.user.js
// @updateURL https://update.greasyfork.org/scripts/396907/Dreamwidth%20-%20Return%20of%20Shifty.meta.js
// ==/UserScript==

(function() {
let css = `

img[src*="https://www.dreamwidth.org/img/talk/sm10_eyes.gif"] { 
	width: 0 !important;
	height: 0 !important;
	background: none !important;
	background-repeat: no-repeat !important;
	padding: 12px 24px 0px 0px !important;
	vertical-align: text-bottom !important;
	background-image: url(http://i.imgur.com/1MDfxq6.gif) !important; 
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
