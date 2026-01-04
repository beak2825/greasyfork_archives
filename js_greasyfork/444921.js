// ==UserScript==
// @name          VLR.gg | fluent
// @description	  vlr.gg but more fluent
// @namespace     https://github.com/myhiyy/VLR.gg-fluent
// @icon          https://www.vlr.gg/img/vlr/logo_header.png
// @author        myhiy
// @homepage      https://github.com/myhiyy/VLR.gg-fluent
// @include       https://www.vlr.gg*
// @include       https://www.vlr.gg/threads*
// @include       https://www.vlr.gg/forums*
// @run-at        document-start
// @version       1
// @downloadURL https://update.greasyfork.org/scripts/444921/VLRgg%20%7C%20fluent.user.js
// @updateURL https://update.greasyfork.org/scripts/444921/VLRgg%20%7C%20fluent.meta.js
// ==/UserScript==
(function() {var css = "";
if (false || (document.location.href.indexOf("https://www.vlr.gg") == 0))
	css += [
		"/* HEADER */",
		"",
		".header-search input {",
		"    border-radius: 5px;",
		"}"
	].join("\n");
if (false || (document.location.href.indexOf("https://www.vlr.gg/threads") == 0) || (document.location.href.indexOf("https://www.vlr.gg/forums") == 0))
	css += [
		"/* FORUMS */",
		"",
		"a.wf-nav-item, .wf-nav-item {",
		"    border: 1px solid #5b6167;",
		"    border-radius: 5px;",
		"    margin-right: 20px;",
		"    margin-top: 5px;",
		"    margin-bottom: 5px;",
		"}",
		"",
		"a.wf-nav-item.mod-active, .wf-nav-item.mod-active {",
		"    box-shadow: inset 100px 100px #00000077;",
		"    cursor: pointer!important;",
		"}",
		"",
		".wf-nav-item.mod-active:before {",
		"    display: none;",
		"}",
		"",
		".wf-nav-item.mod-active:after {",
		"    display: none;",
		"}",
		"",
		".wf-nav {",
		"    background-color: #2f3337;",
		"}",
		"",
		"div.threads-filter {",
		"    background-color: #394046;",
		"    border-radius: 5px;",
		"    box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.4);",
		"}",
		"",
		".btn, a.btn {",
		"    border-radius: 5px;",
		"    box-shadow: none;",
		"}",
		"",
		".btn:before, a.btn:before {",
		"    display:none",
		"}",
		"",
		".btn.is-clicked {",
		"    box-shadow: inset 100px 100px #00000077, 0 0 20px 5px #00000077!important;",
		"}",
		"",
		".wf-dropdown:before {",
		"    display:none",
		"}",
		"",
		".wf-dropdown {",
		"    background: #394046;",
		"    box-shadow: inset 100px 100px #00000077, 0 0 20px 5px #00000077;",
		"    border-radius: 5px;",
		"}",
		"",
		".wf-dropdown.mod-all a {",
		"    border-radius: 5px;",
		"    margin: 5px;",
		"    padding: 10px;",
		"}",
		"",
		"#search-bar {",
		"    border-radius: 5px;",
		"}",
		"",
		".btn.mod-action {",
		"    border-radius: 5px;",
		"}",
		"",
		".wf-card:before {",
		"    display:none",
		"}",
		"",
		"#thread-list {",
		"    border-radius: 5px;",
		"}",
		"",
		".forum-container {",
		"    border-radius: 5px;",
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
