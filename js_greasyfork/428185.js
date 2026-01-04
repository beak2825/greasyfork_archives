// ==UserScript==
// @name hoverPreview.css
// @namespace Anade
// @version 1.0
// @description CSS for hoverPreview.js – hover Preview images / videos / PDFs (if supported eg. by the PDF.js extension)
// @author Anade
// @homepageURL https://jsfiddle.net/Anade/opny2m6x/
// @license GPL
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/428185/hoverPreviewcss.user.js
// @updateURL https://update.greasyfork.org/scripts/428185/hoverPreviewcss.meta.js
// ==/UserScript==

(function() {
let css = `#hoverPreviewContainer {
	display: none;
	z-index: 2147483647;
	max-width: 100vw;
	max-height: 100vh;
	margin: 0;
	padding: 0;
	border: none;
	position: fixed;
	cursor: none;
	pointer-events: none;
	background-color: transparent;
	font-size: 85%;
	text-align: left;
	box-sizing: border-box;
}
#hoverPreviewContainer > .preview,
#hoverPreviewContainer .caption span {
	max-width: 95vw;
	max-width: calc(100vw - 8px);
	box-sizing: border-box;
}
#hoverPreviewContainer > .preview {
	max-height: 95vh;
	max-height: calc(100vh - 1.65em - 4px);
	background-color: #EEE;
	background-color: rgba(248, 248, 240, 0.9);
	border: 1px solid #CCC;
	box-shadow: 1px 1px 2px 3px rgba(0, 140, 186, 0.5);	/* +x +y blur-radius spread-radius color */
	margin: auto;
	padding: 0;
}
#hoverPreviewContainer > img {
	image-orientation: from-image;
}
#hoverPreviewContainer > .caption {
	font-family: sans-serif;
	overflow: hidden;
	margin: 0;
	padding: 0;
	border: none;
}
#hoverPreviewContainer > .caption > span {
	display: inline-block;
	padding: 0.2em 0.3em 0.25em;
	height: 1.65em;
	line-height: 1.25;
	color: black;
	background-color: rgba(240, 240, 208);
	background-color: rgba(251, 251, 208, 0.95);
	border-radius: 5px 5px 2px 1px;
	white-space: nowrap;
	margin: 0;
}

/* loading icon */
#hoverPreviewRoller {
	display: inline-block;
	position: absolute;
	bottom: 0;
	left: -2em;
	font-size: 40%;
	width: 4.0em;
	height: 4.0em;
	border: 2px solid rgba(255, 127, 127, 0.1);
	border-radius: 50%;
	background: #FFE;
	opacity: 0.8;
	box-sizing: content-box;
}
#hoverPreviewRoller > div {
	/* ease-in-out	= cubic-bezier(0.42,   0, 0.58, 1.0) */
	/* ease			= cubic-bezier(0.25, 0.1, 0.25, 1.0) */
	/*         name  			duration timing-function             	  delay count  direction fill-mode play-state */
	animation: hoverPreviewRoller 2100ms cubic-bezier(0.4, 0.15, 0.6, 0.9) 0ms infinite normal forwards running;
	width: 100%;
	height: 100%;
	transform-origin: center;
	position: absolute;
	top: 0;
	left: 0;
}
#hoverPreviewRoller > div > div {
	width: 0.5em;
	height: 0.5em;
	position: absolute;
	top: 0em;
	left: 1.75em;
	left: calc(50% - 0.25em);	/* centered */
	transform-origin: center 2em;
	/* margin: -0.2em 0 0 -0.2em; */
	background: #C22;
	box-shadow: 0 0 0.05em 0.00em #C22;
	border-radius: 50%;
}

@keyframes hoverPreviewRoller {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

/*
vim:sw=4:ts=4
*/`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
