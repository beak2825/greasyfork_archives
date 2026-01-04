// ==UserScript==
// @name        PussyTorrents - Dark Theme
// @include     https://www.pussytorrents.org/*
// @run-at      document-start
// @description Black ir up
// @author      Lucifuga
// @version     0.1
// @namespace https://greasyfork.org/users/160947
// @downloadURL https://update.greasyfork.org/scripts/35745/PussyTorrents%20-%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/35745/PussyTorrents%20-%20Dark%20Theme.meta.js
// ==/UserScript==
(function() {var css = [
    "body {",
	"background-image: none !important;",
    "background-color: #000 !important;",
    "color: #fff !important;",
	"}",
    "table, #memberBar .alt {",
	"color: #fff !important;",
	"}",
    "textarea, input, .uneditable-input, #articles_sidebar, select, pre, ul.token-input-list {",
	"background-color: #000 !important;",
    "color: #fff !important;",
	"}",
    "#siteContainer, .pagination ul > li > a, .pagination ul > li > span, .table-striped tbody tr:nth-child(2n+1) td, .table-striped tbody tr:nth-child(2n+1) th, .table-hover tbody tr:hover td, .table-hover tbody tr:hover th, .accordion-heading, .alert, .modal, .modal-footer {",
	"background-color: #000 !important;",
	"}",
    ".img-polaroid, .jquery-lightbox-background {",
	"background-color: #99356B !important;",
	"}",
    ".Button.DraftButton, .Button.PreviewButton, .Button.Cancel {",
    "background-image: none !important;",
	"background-color: #000 !important;",
    "text-shadow: 0px 0px 0px !important;",
    "box-shadow: 0px 0px 0px !important;",
	"}",
    ".jquery-lightbox-border-top-left, .jquery-lightbox-border-top-right, .jquery-lightbox-border-bottom-left, .jquery-lightbox-border-bottom-right {",
	"background-image: none !important;",
	"}",
    ".jquery-lightbox-border-top-middle, .jquery-lightbox-border-bottom-middle {",
	"background-color: #99356B !important;",
	"}",
    ".jquery-lightbox-border-top-middle, .jquery-lightbox-border-bottom-middle, .jquery-lightbox-html, .jquery-lightbox-buttons .jquery-lightbox-buttons-init, .jquery-lightbox-buttons .jquery-lightbox-buttons-end {",
	"display: none !important;",
	"}",
	"",
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