// ==UserScript==
// @name GPokr - smiley face
// @namespace https://greasyfork.org/en/users/430935
// @version 1.0.1
// @description Works on GPokr. Changes the avatars of ALL players sitting at a table to smiley faces.
// @author TOM SLICK
// @homepageURL https://greasyfork.org/en/scripts/397024
// @supportURL https://greasyfork.org/en/scripts/397024/feedback
// @license CC-BY-SA-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.gpokr.com/*
// @downloadURL https://update.greasyfork.org/scripts/397024/GPokr%20-%20smiley%20face.user.js
// @updateURL https://update.greasyfork.org/scripts/397024/GPokr%20-%20smiley%20face.meta.js
// ==/UserScript==

(function() {
let css = `
	
 .iogc-PlayerPanel-avatar {
	height: 0!important;
	width: 0!important;
	padding-left: 64px!important;
	padding-top: 64px!important;
	background: url(https://i.imgur.com/PL2yWDB.jpg) no-repeat!important;
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
