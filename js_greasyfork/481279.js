// ==UserScript==
// @name          Colors For Columns Dark Mode
// @namespace    http://tampermonkey.net/
// @description	  Gives colors to the columns, matches my scene kid & 90s kid theme
// @author        mxpercy
// @match       https://www.goatlings.com/*
// @match       https://www.goatlings.com/*
// @match       https://*.www.goatlings.com/*
// @match       https://*.www.goatlings.com/*
// @match       https://www.goatlings.com/
// @exclude     https://www.goatlings.com/profile/u/*
// @exclude     https://www.goatlings.com/pet/u/*/
// @exclude     https://www.goatlings.com/pet/u/*
// @exclude     https://www.goatlings.com/arcade
// @exclude     https://www.goatlings.com/battle/*
// @exclude     https://www.goatlings.com/login/
// @exclude     https://www.goatlings.com/rps/play/*
// @exclude     https://www.goatlings.com/news/*
// @exclude     https://www.goatlings.com/settings
// @exclude     https://www.goatlings.com/settings_un
// @exclude     https://www.goatlings.com/settings/*
// @exclude     https://www.goatlings.com/forums/view_topic/*
// @exclude     https://www.goatlings.com/usershop/view/*
// @exclude     https://www.goatlings.com/gallery/view/*
// @exclude     https://www.goatlings.com/gallery/view/*/*
// @exclude     https://www.goatlings.com/craft
// @exclude     https://www.goatlings.com/HABuddyPatterns
// @exclude     https://www.goatlings.com/AppearanceDollFusion
// @exclude     https://www.goatlings.com/DisplayNameIcons
// @exclude     https://www.goatlings.com/MonsterMasqueradeCrafts
// @exclude     https://www.goatlings.com/JestEvent
// @exclude     https://www.goatlings.com/PaintBrushGoatlings
// @exclude     https://www.goatlings.com/CraftingMaster
// @run-at        document-start
// @version       2.1
// @downloadURL https://update.greasyfork.org/scripts/481279/Colors%20For%20Columns%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/481279/Colors%20For%20Columns%20Dark%20Mode.meta.js
// ==/UserScript==
(function() {var css = [
    "/* 'first' column and 'even' columns */",
    "table tr td:nth-child(even) {",
    "    background-color: rgba(129, 94, 248, 0.6);",
    "}",
    "/* 'second' column and 'odd' columns */",
    "table tr td:nth-child(odd) {",
    "    background-color: rgba(102, 114, 255, 0.6);",
    "}",
    "/* very top row */",
    "table tr:first-child td  {",
    "    background-color: rgba(8, 69, 132, 0.8);",
    "}",
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
