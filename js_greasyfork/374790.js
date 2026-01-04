// ==UserScript==
// @name          Kami PDF - Center Pages, Clean Ads and More...
// @namespace     http://userstyles.org
// @description	  Better Kami PDF experience
// @author        John Ren
// @homepage      https://userstyles.org/styles/166196
// @include       http://web.kamihq.com/*
// @include       https://web.kamihq.com/*
// @include       http://*.web.kamihq.com/*
// @include       https://*.web.kamihq.com/*
// @run-at        document-start
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/374790/Kami%20PDF%20-%20Center%20Pages%2C%20Clean%20Ads%20and%20More.user.js
// @updateURL https://update.greasyfork.org/scripts/374790/Kami%20PDF%20-%20Center%20Pages%2C%20Clean%20Ads%20and%20More.meta.js
// ==/UserScript==
(function() {var css = [
	"/* Hide Ads and premium feature */",
	" html #outerContainer.adsVisible > #mainContainer {",
	"	right: 0 !important;",
	"}",
	"#sideContainer {",
	"	display: none !important;",
	"}",
	".premium-required {",
	"	display: none  !important;",
	"}",
	"/* Center pages */",
	" .page {",
	"	margin-left: auto !important;",
	"	margin-right: auto !important;",
	"}",
	".twoPageContainer {",
	"	display: flex !important;",
	"	margin-left: 0 !important;",
	"	justify-content: center;",
	"}",
	".twoPageContainer>.page {",
	"	margin-left: 0 !important;",
	"	margin-right: 0 !important;",
	"}",
	"/* Prettier Scrollbar */",
	" ::-webkit-scrollbar {",
	"	width: 9px;",
	"}",
	"::-webkit-scrollbar-track {",
	"	background: #333333;",
	"}",
	"::-webkit-scrollbar-thumb {",
	"	-webkit-border-radius: 10px;",
	"	border-radius: 10px;",
	"	background: #666666;",
	"}",
	"/* UI improvements */",
	" #viewerContainer {",
	"	box-shadow: none !important;",
	"}",
	"#toolbarContainer {",
	"	background: #3a3a3a !important;",
	"	background-image: none !important;",
	"}",
	"#toolbarSidebar {",
	"	background: #3a3a3a !important;",
	"	background-image: none !important;",
	"}",
	".avatar {",
	"	font-size: 12px;",
	"}",
	".avatar .initials {",
	"	background: #444444 !important;",
	"}",
	".badge-toolbar {",
	"	display:none !important;",
	"}",
	"#sidebarContainer {",
	"	z-index: 9999999;",
	"	background: #333333 !important;",
	"	background-image: none !important;",
	"	box-shadow: none !important;",
	"}",
	"/* Autohide Toolbar */",
	" #annotation-toolbar {",
	"	opacity: 0 !important;",
	"	background: #333333 !important;",
	"	background-image: none !important;",
	"	box-shadow: none !important;",
	"	transition: all, 200ms !important;",
	"	transition-delay: 300ms !important;",
	"}",
	"#annotation-toolbar:hover {",
	"	opacity:1 !important;",
	"	transition-delay: 0s !important;",
	"}",
    "#attachmentView, #annotationsView, #outlineView,#thumbnailView,#sidebarContent{",
    "   width: 320px !important;",
    "   box-sizing: border-box;",
	"	background: #333333 !important;",
    "	box-shadow: none !important;",
    "}",

    "html[dir='ltr'] #outerContainer.sidebarOpen > #mainContainer {",
    "   left: 320px !important;",
    "}",
    ".toolbarButton {",
    "   color: white !important;",
    "}",
    ".outlineItem a, .annotation.ng-scope {",
    "   color: white !important;",
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
