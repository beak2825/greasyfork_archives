// ==UserScript==
// @name          spoiler-img
// @namespace     http://userstyles.org
// @description	  2ch.hk.
// @author        xsdsadxdsa
// @match         https://2ch.hk/* 
// @homepage      https://greasyfork.org/ru/scripts/512903-spoiler-img
// @run-at        0
// @version       0.1
// @downloadURL https://update.greasyfork.org/scripts/512903/spoiler-img.user.js
// @updateURL https://update.greasyfork.org/scripts/512903/spoiler-img.meta.js
// ==/UserScript==
(function() {var css = "";
if (false || (new RegExp("^http(|s)://(|www.)2(|-)ch.(so|ru|hk|ec|pm|re|tf|wf|yt|life).*$")).test(document.location.href))
	css += [
		"@namespace url(http://www.w3.org/1999/xhtml);",
		"/* your code goes here */",
		"/*@-moz-document regexp(\"http(|s)://(|www.)2(|-)ch\\.(so|ru|hk|life|ec|pm|re|tf|wf|yt).*\")*/ ",
		".rmenu.desktop, .board-info, .board-banner, #de-main hr, hr.pre-rekl, .passcode-banner.desktop, .rekl, .news, .top-user-boards{",
		"    display: none !important;",
		"}",
		"  ",
        ".ctlg__thread img:hover {",
		"    opacity: 1;",
		"}",
        ".ctlg__thread img {",
		"    opacity: 0.12;",
		"}",
		".post__image-link {",
		"    opacity: 0.33;",
		"}",
        ".mv__meta {",
		"    opacity: 1;",
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
