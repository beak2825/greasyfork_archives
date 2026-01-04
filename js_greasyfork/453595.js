// ==UserScript==
// @name          Colors for Columns
// @description	  Gives colors to the columns
// @author        mxpercy
// @match       https://www.goatlings.com/itemsorter
// @match       https://www.goatlings.com/itemsorter/index
// @match       https://www.goatlings.com/itemsorter/index/*
// @match       https://www.goatlings.com/storage
// @match       https://www.goatlings.com/storage/index
// @match       https://www.goatlings.com/storage/index/*
// @match       https://www.goatlings.com/gallery
// @match       https://www.goatlings.com/gallery/
// @match       https://www.goatlings.com/gallery/index/
// @match       https://www.goatlings.com/gallery/index/*
// @match       https://www.goatlings.com/search/searchpro
// @match       https://www.goatlings.com/forums
// @match       https://www.goatlings.com/forums/index
// @match       https://www.goatlings.com/forums/view/*/
// @match       https://www.goatlings.com/forums/view/*/*
// @match       https://www.goatlings.com/wishlist/
// @match       https://www.goatlings.com/wishlist
// @match       https://www.goatlings.com/wishlist/view/*
// @match       https://www.goatlings.com/wishlist/view/*/*
// @match       https://www.goatlings.com/wishlist/index
// @match       https://www.goatlings.com/wishlist/index/*
// @match       https://www.goatlings.com/usershop/
// @match       https://www.goatlings.com/usershop
// @match       https://www.goatlings.com/usershop/index
// @match       https://www.goatlings.com/usershop/index/
// @match       https://www.goatlings.com/usershop/index/*
// @match       https://www.goatlings.com/stats/members/*
// @match       https://www.goatlings.com/stats/pets
// @match       https://www.goatlings.com/stats/pets/*
// @run-at        document-start
// @version       2.06
// @namespace https://greasyfork.org/users/942820
// @downloadURL https://update.greasyfork.org/scripts/453595/Colors%20for%20Columns.user.js
// @updateURL https://update.greasyfork.org/scripts/453595/Colors%20for%20Columns.meta.js
// ==/UserScript==
(function() {var css = [
    "/* 'first' column and 'even' columns */",
	"table tr td:nth-child(even) {",
	"    background-color: #d9e3ff;   ",
	"}",
	"",
    "/* 'second' column and 'odd' columns */",
	"table tr td:nth-child(odd) {",
	"    background-color: #f5d9ff;   ",
	"}",
    "/* very top row */",
	"table tr:first-child td  {",
	"    background-color: #e2d9ff;",
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
