// ==UserScript==
// @name Read the Kanji - Hide English translation until mouseover
// @namespace https://greasyfork.org/users/3759
// @version 1.0
// @description Hides English translation until you put your mouse over it.
// @grant GM_addStyle
// @run-at document-start
// @match https://www.readthekanji.com/*
// @downloadURL https://update.greasyfork.org/scripts/396911/Read%20the%20Kanji%20-%20Hide%20English%20translation%20until%20mouseover.user.js
// @updateURL https://update.greasyfork.org/scripts/396911/Read%20the%20Kanji%20-%20Hide%20English%20translation%20until%20mouseover.meta.js
// ==/UserScript==

(function() {
let css = `

p#en {
	background-color:#fff !important; 
	color:#fff !important; 
	border:1px dotted #000 !important; 
	margin:5px !important; 
	padding:5px !important;
	}

p#en:hover {
	color:#555 !important;
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
