// ==UserScript==
// @name         transparent hat shop
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  I did not remove the equip button, I made it transparent, you can tell if you're hovering over the button by looking at your cursor.
// @author       You
// @match        https://sploop.io/?game=0
// @match        *://*.sploop.io/*
// @icon         https://www.google.com/s2/favicons?domain=sploop.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436036/transparent%20hat%20shop.user.js
// @updateURL https://update.greasyfork.org/scripts/436036/transparent%20hat%20shop.meta.js
// ==/UserScript==

document.getElementById("hat-menu").style.background = "rgba(0,0,0,0)";
(function() {var css = [
".menu .content .menu-item .header {",
    "font-size: 5px;",
    "font-weight: bold;",
    "color: white;",
    "position: relative;",
    "left: 228px;",
"}",
".green-button {",
    "background-color: rgba(0,0,0,0);",
    "box-shadow: inset 0 -5px 0 rgba(0,0,0,0);",
"}",
".menu .content .menu-item .description {",
    "font-size: 0px;",
"}",
".text-shadowed-3 {",
    "text-shadow: rgb(0 0 0 / 0%) 3px 0px 0px, rgb(0 0 0 / 0%) 2.83487px 0.981584px 0px, rgb(0 0 0 / 0%) 2.35766px 1.85511px 0px, rgb(0 0 0 / 0%) 1.62091px 2.52441px 0px, rgb(0 0 0 / 0%) 0.705713px 2.91581px 0px, rgb(0 0 0 / 0%) -0.287171px 2.98622px 0px, rgb(0 0 0 / 0%) -1.24844px 2.72789px 0px, rgb(0 0 0 / 0%) -2.07227px 2.16926px 0px, rgb(0 0 0 / 0%) -2.66798px 1.37182px 0px, rgb(0 0 0 / 0%) -2.96998px 0.42336px 0px, rgb(0 0 0 / 0%) -2.94502px -0.571704px 0px, rgb(0 0 0 / 0%) -2.59586px -1.50383px 0px, rgb(0 0 0 / 0%) -1.96093px -2.27041px 0px, rgb(0 0 0 / 0%) -1.11013px -2.78704px 0px, rgb(0 0 0 / 0%) -0.137119px -2.99686px 0px, rgb(0 0 0 / 0%) 0.850987px -2.87677px 0px, rgb(0 0 0 / 0%) 1.74541px -2.43999px 0px, rgb(0 0 0 / 0%) 2.44769px -1.73459px 0px, rgb(0 0 0 / 0%) 2.88051px -0.838247px 0px;",
             "}",
".scrollbar::-webkit-scrollbar {",
    "background: ##22251e;",
    "border-radius: 4px;",
    "border: 4px solid rgb(0 0 0 / 0%)",
"}",
"button {",
    "appearance: auto;",
    "-webkit-writing-mode: horizontal-tb !important;",
    "font-style: ;",
    "font-variant-ligatures: ;",
    "font-variant-caps: ;",
    "font-variant-numeric: ;",
    "font-variant-east-asian: ;",
    "font-weight: ;",
    "font-stretch: ;",
    "font-size: ;",
    "font-family: ;",
    "opacity: 0;",
    "text-rendering: auto;",
    "color: rgba(0,0,0,0);",
    "letter-spacing: normal;",
    "word-spacing: normal;",
    "line-height: normal;",
    "text-transform: none;",
    "text-indent: 0px;",
    "text-shadow: none;",
    "display: inline-block;",
    "text-align: center;",
    "align-items: flex-start;",
    "cursor: default;",
    "box-sizing: border-box;",
    "background-color: rgba(0,0,0,0);",
    "margin: 0em;",
    "padding: 1px 6px;",
    "border-width: 2px;",
    "border-style: outset;",
    "border-color: rgb(0, 0, 0, 0%);",
    "border-image: initial;",
"}",
".menu .content .menu-item .menu-pricing .action {",
    "margin-left: auto;",
    "outline: none;",
    "box-shadow: 10px 5px 5px black;",
    "border: 1px dotted #FFFFFF;",
    "padding: 7px;",
    "font-size: 18px;",
    "cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;",
    "margin-top: auto;",
    "margin-bottom: auto;",
    "color: #FFFFFF;",
    "border-radius: 10px;",
"}",
".menu .content .menu-item {",
    "display: flex;",
    "color: white;",
    "width: 100%;",
    "margin-left: auto;",
    "margin-right: auto;",
    "margin-top: 0px;",
    "padding: 0px 10px 3px 10px;",
    "align-items: center;",
    "border-bottom: 3px solid rgb(0 0 0 / 0%);",
"}",
".subcontent-bg {",
    "background: rgb(0 0 0 / 0%);",
    "border-radius: 10px;",
    "padding: 20px;",
    "margin: 20px 0 30px 0;",
    "border: 4px solid rgb(0 0 0 / 0%);",
    "box-shadow: inset 0 5px 0 rgb(0 0 0 / 0%);",
"}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();