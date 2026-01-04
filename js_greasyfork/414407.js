// ==UserScript==
// @name Google Hangouts tweaks
// @namespace myfonj
// @version 1.1.0
// @description Hides background images at hangouts.google.com and reorganizes chat bubbles. Works in Gmail.
// @grant GM_addStyle
// @run-at document-start
// @match *://*.hangouts.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/414407/Google%20Hangouts%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/414407/Google%20Hangouts%20tweaks.meta.js
// ==/UserScript==

(function() {
let css = `
/*
https://greasyfork.org/en/scripts/414407/versions/new
https://userstyles.org/styles/121186/google-hangouts-no-decorative-images
*/
	
/* disable background decorative images
*/
	div[style^="background-image:url(https://www.gstatic.com/chat/hangouts/bg/"][style$="background-size:cover;"],
	div[style^="background-image:url(https://www.gstatic.com/chat/hangouts/bg/"][style$="background-size:cover;"] ~ * {
		background-image: none !important;
		display: none !important;
	}
/* fix default background color
*/
	body {
  background-color: #333;
	}
	
/* move own messages in chat windows to the left
*/
	.pj > .Tn,
	.pj > .Tn > .KL {
  float: none;
	}
	.tk.pj {
  padding-left: 46px;
	}
/* move own bubble tail down
*/
	.pj .KRQuhe {
  border-top-right-radius: 5px;
		border-bottom-right-radius: 0;
	}
	.pj .ci {
  top: auto;
		bottom: 0;
		transform: scaleY(-1);
	}
/* move time info to the left as well
*/
	.pj > .Tn > .TlvAYc {
  padding-left: 14px;
		text-align: left;
	}
/* move "green" status dot from avatar to name
*/
	.Bb .flaeQ {
  position: absolute;
		bottom: auto;
		top: 4px;
		right: -13px;
	}
/* Emoji: use system font instead of image sprite; show sprite on hover, over
 in picker there is slightly differrent style formatting
*/
 [data-emo] {
  position: relative;
 }
	[data-emo] > [style*="opacity:0"] {
  opacity: 1 !important;
		position: static !important;
		width: auto !important;
		font-family: Segoe UI Emoji, Segoe UI Symbol;
	}
	[data-emo]:not(:hover) > [style="display:inline-block;"] {
  display: none !important;
	}
 [data-emo]:hover > [style="display:inline-block;"]  {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  pointer-events: none;
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
