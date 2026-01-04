// ==UserScript==
// @name Fix Prefix Icons
// @namespace incelerated
// @version 0.1.2
// @description Fixes the prefix icons on classic themes
// @author incelerated
// @grant GM_addStyle
// @run-at document-start
// @match *://*.incels.is/*
// @downloadURL https://update.greasyfork.org/scripts/428792/Fix%20Prefix%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/428792/Fix%20Prefix%20Icons.meta.js
// ==/UserScript==

(function() {
let css = `
.label {
	font-size: 75%;
	font-weight: 500 !important;
	letter-spacing: .1px;
	text-decoration: none;
	border: 1px solid transparent;
	border-radius: 5px;
	padding-top: 1px;
	padding-right: .30em;
	padding-bottom: 1px;
	padding-left: .30em;
	display: inline-block;
	line-height: 1.26;
	box-shadow: none;
}
.label::before {
	font-family: 'font awesome 5 pro';
	font-size: inherit;
	font-style: normal;
	font-weight: 300;
	text-rendering: auto;
	content: "\\f27a";
	padding-right: 5px;
	vertical-align: middle;
	position: relative;
	top: 1px;
	float: left;
}

.label--custom-ragefuel {
	color: #fff !important;
	background: #d63031;
	border-color: #d63031;
}
.label--custom-ragefuel::before {
	content: '\\f556';
	font-weight: 900;
}

.label--custom-serious {
	color: #fff;
	background: #0984e3;
	border-color: #0984e3;
}
.label--custom-serious::before {
	content: '\\f0a1';
	font-weight: 900;
}

.label--custom-discussion {
	color: #fff;
	background: #6c5ce7;
	border-color: #6c5ce7;
}
.label--custom-discussion::before {
	content: '\\f4b6';
	font-weight: 900;
}

.label--custom-lifefuel {
	color: #fff;
	background: #00cec9;
	border-color: #00cec9;
}
.label--custom-lifefuel::before {
	content: '\\f0eb';
	font-weight: 900;
}

.label--custom-venting {
	color: #fff;
	background: #512da8;
	border-color: #512da8;
}
.label--custom-venting::before {
	content: '\\f5f0';
	font-weight: 900;
}

.label--custom-nsfw {
	color: #fff !important;
	background: #d63031;
	border-color: #d63031;
}
.label--custom-nsfw::before {
	content: '\\f06a';
	font-weight: 900;
}

.label--custom-jfl {
	color: #fff;
	background: #e84393;
	border-color: #e84393;
}
.label--custom-jfl::before {
	content: '\\f59b';
	font-weight: 900;
}

.label--custom-itsover {
	color: #fff;
	background: #000;
	border-color: #000;
}
.label--custom-itsover::before {
	content: '\\f8c8';
	font-weight: 900;
}

.label--custom-media {
	color: #fff !important;
	background: #0984e3;
	border-color: #0984e3;
}
.label--custom-media::before {
	content: '\\f87c';
	font-weight: 900;
}

.label--custom-experiment {
	color: #fff !important;
	background: #e17055;
	border-color: #e17055;
}
.label--custom-experiment::before {
	content: '\\f0c3';
	font-weight: 900;
}

.label--custom-gaming {
	color: #fff;
	background: #00cec9;
	border-color: #00cec9;
}
.label--custom-gaming::before {
	content: '\\f8bc';
	font-weight: 900;
}

.label--custom-story {
	color: #fff !important;
	background: #00b894;
	border-color: #00b894;
}
.label--custom-story::before {
	content: '\\f02d';
	font-weight: 900;
}

.label--custom-blackpill {
	color: #fff;
	background: #000;
	border-color: #000;
}
.label--custom-blackpill::before {
	content: '\\f46b';
	font-weight: 900;
}

.label--custom-news {
	color: #fff;
	background: #27ae60;
	border-color: #27ae60;
}
.label--custom-news::before {
	content: '\\f1ea';
	font-weight: 900;
}

.label--custom-hypocrisy {
	color: #fff;
	background: #00b894;
	border-color: #00b894;
}
.label--custom-hypocrisy::before {
	content: '\\f364';
	font-weight: 900;
}

.label--custom-ldar {
	color: #fff;
	background: #6c5ce7;
	border-color: #6c5ce7;
}
.label--custom-ldar::before {
	content: '\\f236';
	font-weight: 900;
}

.label--custom-meme {
	color: #fff !important;
	background: #27ae60;
	border-color: #27ae60;
}
.label--custom-meme::before {
	content: '\\f3e0';
	font-weight: 900;
}

.label--custom-teehee {
	color: #fff;
	background: #e84393;
	border-color: #e84393;
}
.label--custom-teehee::before {
	content: '\\f182';
	font-weight: 900;
}

.label--custom-soy {
	color: #fff !important;
	background: #fdcb6e;
	border-color: #fdcb6e;
}
.label--custom-soy::before {
	content: '\\f5c2';
	font-weight: 900;
}

.label--custom-cope {
	color: #fff !important;
	background: #e17055;
	border-color: #e17055;
}
.label--custom-cope::before {
	content: '\\f05e';
	font-weight: 900;
}

.label--custom-toxicfemininity {
	color: #fff !important;
	background: #e84393;
	border-color: #e84393;
}
.label--custom-toxicfemininity::before {
	content: '\\f221';
	font-weight: 900;
}

.label--custom-theory {
	color: #fff !important;
	background: #e17055;
	border-color: #e17055;
}
.label--custom-theory::before {
	content: '\\f70e';
	font-weight: 900;
}

.label--custom-brutal {
	color: #fff;
	background: #d63031;
	border-color: #d63031;
}
.label--custom-brutal::before {
	content: '\\f481';
	font-weight: 900;
}

.label--custom-based {
	color: #fff;
	background: #0984e3;
	border-color: #0984e3;
}
.label--custom-based::before {
	content: '\\f14a';
	font-weight: 900;
}

.label--custom-suicidefuel {
	color: #fff;
	background: #6c5ce7;
	border-color: #6c5ce7;
}
.label--custom-suicidefuel::before {
	content: '\\f6b7';
	font-weight: 900;
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
