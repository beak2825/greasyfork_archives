// ==UserScript==
// @name Graphemica: Different Fonts on Hover
// @namespace myfonj
// @version 0.0.2
// @description Change font families of example characters by position mouse cursor over body or character and/or holding left mouse button
// @license CC0 - Public Domain
// @grant GM_addStyle
// @run-at document-start
// @match *://*.graphemica.com/*
// @downloadURL https://update.greasyfork.org/scripts/411367/Graphemica%3A%20Different%20Fonts%20on%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/411367/Graphemica%3A%20Different%20Fonts%20on%20Hover.meta.js
// ==/UserScript==

(function() {
let css = `
/*
Notes:
Original is:
	body .char {
		font-family: "Times", "Times New Roman", "serif", "sans-serif", "EmojiSymbols";
	}
	EmojiSymbols (http://emojisymbols.com/) is embedded in page style.
https://greasyfork.org/en/scripts/411367/versions/new
https://userstyles.org/styles/130470/edit
*/
.char-title::after {
	display: block;
	font-size: 0.7em;
	content: 'in "Times", "Times New Roman", "serif", "sans-serif", "EmojiSymbols"';
}

body:hover .char {
	font-family: "Segoe UI", "Segoe UI Symbol";
}
body:hover h2.char-title::after {
	content: 'in "Segoe UI", "Segoe UI Symbol"';
}
body:active .char {
	font-family: "Arial Unicode MS", "Arial";
}
body:active h2.char-title::after {
	content: 'in "Arial Unicode MS", "Arial"';
}
body:hover .char:hover {
	font-family: "Segoe UI Emoji";
}
body:hover .char:hover + h2.char-title::after {
	content: 'in "Segoe UI Emoji"';
}

body:hover .char:hover:active {
	/* not used */
}

body:hover .char:active:not(:hover) {
	/* not used */
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
