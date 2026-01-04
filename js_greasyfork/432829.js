// ==UserScript==
// @name          Chỉnh sửa giao diện vOz
// @namespace     https://greasyfork.org
// @description	  Thêm phân cách giữa các bình luận (bị Adblock ẩn đi), kéo giãn giao diện rộng hơn
// @author        Darias
// @homepage      https://xem.li/vOz
// @run-at        document-start
// @version       2021.08.14.c
// @match         https://voz.vn/*
// @downloadURL https://update.greasyfork.org/scripts/432829/Ch%E1%BB%89nh%20s%E1%BB%ADa%20giao%20di%E1%BB%87n%20vOz.user.js
// @updateURL https://update.greasyfork.org/scripts/432829/Ch%E1%BB%89nh%20s%E1%BB%ADa%20giao%20di%E1%BB%87n%20vOz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var allAdDiv = document.querySelectorAll('[id^=div-gpt-ad]');
    var i;
    for (i = 0; i < allAdDiv.length; i++) {
        allAdDiv[i].parentNode.removeChild(allAdDiv[i]);
    }
})();

(function() {var css = "";
if (false || (document.domain == "voz.vn" || document.domain.substring(document.domain.indexOf(".voz.vn") + 1) == "voz.vn"))
	css += [
		"@media (max-width: 9999px) {",
		"    .block--messages .message ~ .message {",
		"        margin-top: 8px !important;",
		"    }",
		"",
		"    .menu-header,",
		"    .menu-tabHeader,",
		"    .menu-tabHeader .tabs-tab.is-active,",
		"    .menu-tabHeader .tabs-tab:hover {",
		"        color: #ebeced !important;",
		"        background: #5c7099 !important;",
		"        border-color: #5c709900 !important;",
		"    }",
		"    .menu-tabHeader .tabs-tab {",
		"        color: #ebeced8a !important;",
		"    }",
		"",
		"    .block-outer.block-outer--after {",
		"        padding-bottom: 8px !important;",
		"    }",
		"    .block-outer:not(.block-outer--after) .pageNavWrapper:not(.pageNavWrapper--forceShow) {",
		"        display: block !important;",
		"    }",
		"    .block-outer-main {",
		"        float: left !important;",
		"    }",
		"    .block-outer-main + .block-outer-opposite {",
		"        float: right !important;",
		"        margin-top: 0px !important;",
		"    }",
		"",
		"    .block-outer .button,",
		"    .block-outer a.button {",
		"        padding-left: 5px !important;",
		"        padding-right: 5px !important;",
		"    }",
		"",
		"    .block-outer-opposite a[data-xf-click=\"scroll-to\"] .button-text {",
		"        display: none !important;",
		"    }",
		"    .block-outer-opposite a[data-xf-click=\"scroll-to\"]:after {",
		"        content: \"Jump...\" !important;",
		"    }",
		"",
		"    .pageNavSimple-el.pageNavSimple-el--first,",
		"    .pageNavSimple-el.pageNavSimple-el--last {",
		"        background: linear-gradient(0deg, #dce7f5, #e7ebef) !important;",
		"    }",
		"",
		"    .pageNavSimple-el:not(.pageNavSimple-el--current) {",
		"        font-size: 0px !important;",
		"        min-width: 0px !important;",
		"    }",
		"    .pageNavSimple-el * {",
		"        font-size: 0.875rem !important;",
		"    }",
		"",
		"    .offCanvasMenu {",
		"        transition: none !important;",
		"    }",
		"",
		"    .bbImage.lazyloaded:not(:hover) {",
		"        max-height: 500px !important;",
		"    }",
		"",
		"    .message-signature {",
		"        display: block !important;",
		"    }",
		"}"
	].join("\n");
if (false || (new RegExp("^https://voz.vn/.+$")).test(document.location.href))
	css += [
		"@media (max-width: 9999px) {",
		"    .p-body-sidebar,",
		"    .p-body-sidebarCol {",
		"        display: none !important;",
		"    }",
		"}"
	].join("\n");
if (false || (document.location.href.indexOf("https://voz.vn/a/") == 0))
	css += [
		"@media (min-width: 1366px) {",
		"    #header {",
		"        display: none !important;",
		"    }",
		"    .p-nav-smallLogo {",
		"        display: inline-block !important;",
		"    }",
		"    .p-sectionLinks.p-sectionLinks--empty {",
		"        display: none !important;",
		"    }",
		"",
		"    .porta-article-item {",
		"        display: inline-block;",
		"        width: 32%;",
		"        margin-right: 5px;",
		"    }",
		"    .porta-article-item .porta-article-date {",
		"        margin-left: 0px;",
		"    }",
		"",
		"    .message-cell.message-main {",
		"        position: relative;",
		"    }",
		"    .message-cell.message-main::before {",
		"        content: \'\';",
		"        position: absolute;",
		"        left: 0;",
		"        bottom: 0;",
		"        width: 100%;",
		"        height: 2em;",
		"        background: linear-gradient(to bottom, #ebeced00 0%, #ebeced 100%);",
		"    }",
		"",
		"    .message-body {",
		"        height: 350px;",
		"        overflow: hidden;",
		"        text-overflow: clip;",
		"    }",
		"",
		"    .bbImage.lazyloaded:not(:hover),",
		"    .bbImage.lazyloaded {",
		"        max-height: 250px !important;",
		"    }",
		"}"
	].join("\n");
if (false || (document.location.href.indexOf("https://voz.vn/search/") == 0))
	css += [
		"@media (max-width: 9999px) {",
		"    .p-title-value {",
		"        color: #888 !important;",
		"    }",
		"    .p-title-value a {",
		"        color: #fff !important;",
		"    }",
		"}"
	].join("\n");
if (false || (document.location.href.indexOf("https://voz.vn/u/") == 0))
	css += [
		"@media (min-width: 721px) {",
		"    .p-body-inner {",
		"        max-width: 69%;",
		"    }",
		"    .bbImageWrapper + br {",
		"        display: none;",
		"    }",
		"    .bbImage {",
		"        max-height: 69vh;",
		"    }",
		"}"
	].join("\n");
if (false || (document.location.href.indexOf("https://voz.vn/t/") == 0))
	css += [
		"@media (min-width: 721px) {",
		"    .bbImage {",
		"        max-height: 69vh;",
		"    }",
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
