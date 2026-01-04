// ==UserScript==
// @name Seltani Dark Theme
// @namespace https://mkps.app/
// @version 1.0.1
// @description A simple dark theme for Seltani
// @author MK
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.seltani.net/*
// @downloadURL https://update.greasyfork.org/scripts/526608/Seltani%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/526608/Seltani%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `
	html, #header, img, canvas, embed, video, object, iframe {
		filter: invert(1) hue-rotate(180deg);
	}

	input.FormButton, .FocusCornerControl, .ToolTitleBar {
		background: linear-gradient(#C4C4A8, #D2D2B6, #D2D2B6, #D2D2B6, #E8E8C4);
	}

	.BuildPropDirty {
		background-color: #d2d44e;
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
