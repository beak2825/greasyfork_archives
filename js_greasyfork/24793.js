// ==UserScript==
// @name          Youtube - Ultrawide Layout
// @namespace     http://userstyles.org
// @description	  a JPM tweaked script
// @author        OnlineX420
// @homepage      https://userstyles.org/styles/98569
// @match       https://www.youtube.com/*
// @run-at        document-start
// @version       0.20160603101136
// @downloadURL https://update.greasyfork.org/scripts/24793/Youtube%20-%20Ultrawide%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/24793/Youtube%20-%20Ultrawide%20Layout.meta.js
// ==/UserScript==
(function() {var css = [
	"@namespace url(http://www.w3.org/1999/xhtml);",
	"/*header*/",
	"",
	"    #masthead-positioner {",
	"    position: absolute !important;",
	"}",
	"",
	"",
	"    ",
	"/*left menu*/",
	"  ",
	"    #appbar-guide-menu {",
	"    position: absolute !important;",
	"    height: auto !important;",
	"    max-height: 100% !important;",
	"    min-height: 100% !important;",
	"}",
	"    ",
	"",
	"",
	"/*recommended channels and widened feed*/",
	"",
	"   .flex-width-enabled.flex-width-enabled-snap.site-center-aligned .content-alignment, .content-snap-width-1 .flex-width-enabled.flex-width-enabled-snap.site-center-aligned .content-alignment {",
	"    width: 60%;",
	"    min-width: 0%;",
	"    max-width: 100%;",
	"}",
	"    .site-center-aligned .branded-page-v2-primary-col {",
	"    border-width: 0px;",
	"    background: none repeat scroll 0% 0% transparent;",
	"    max-width: 100%;",
	"    width: 100%;",
	"}",
	"    .site-center-aligned .branded-page-v2-secondary-col {",
	"    padding-top: 0px;",
	"    width: 20%;",
	"    max-width: 100%;",


	"}",
	"    .yt-lockup-tile .yt-lockup-meta, .yt-lockup-tile .yt-lockup-description  {",
	"    max-width: 93% !important;",
	"}",
	"",
	"    .site-center-aligned .browse-list-item-container:hover .compact-shelf .yt-uix-shelfslider-prev, .site-center-aligned .compact-shelf:hover .yt-uix-shelfslider-prev {",
	"    left: -15px;",
	"    border-left: 0px none;",
	"}",
	"",
	"    .site-center-aligned .browse-list-item-container:hover .compact-shelf .yt-uix-shelfslider-next, .site-center-aligned .compact-shelf:hover .yt-uix-shelfslider-next {",
	"    right: -15px;",
	"    border-left: 0px none;",
	"}",
	"    ",
	"",
	"    ",
	"/*theater mode player*/",
	"",
	"    .watch-stage-mode .player-height {",
	"    height: 540px !important;",
	"}",
	"    .watch-stage-mode .player-width {",
	"    width: 1280px !important;",
	"    left: -640px !important;",
	"}",
	"    .watch-stage-mode .video-stream {",
	"    width: 1280px !important;",
	"    height: 540px !important;",
	"    margin-top: 0px !important;",
	"}",
	"    .ytp-fullscreen .html5-video-container  {",
	"    height: 100% !important;",
	"    width: 100% !important;",
	"    top: 0px !important;",
	"    left: 0px !important;",
	"}",
	"    .ytp-fullscreen .html5-video-container .video-stream {",
	"    height: 100% !important;",
	"    width: 100% !important; ",
	"}",
	"    .watch-stage-mode .video-stream {",
	"    left: 0px !important;",
	"    top: 0px !important;",
	"}",
	"",
	"",
	"    x.watch-stage-mode .ytp-chrome-bottom {",
	"    left: 118px !important;",
	"}",
	"    .ytp-fullscreen .ytp-chrome-bottom {",
	"    left: 24px !important;",
	"}",
	"    ",
	"    .webgl > canvas:nth-child(1) {",
	"     width: 100% !important;",
	"     height: 100% !important;",
	"}",
	"    ",
	"    ",
	"/*tables aligned with the theater mode player*/",
	"",
	"    .watch-stage-mode #content[class=\"  content-alignment\"] {",
	"    width: 1280px !important;",
	"    min-width: 1280px !important;",
	"    max-width: 1066px !important;",
	"}",
	"    .watch-stage-mode #watch7-container {",
	"    width: 1066px !important;",
	"    min-width: 1280px !important;",
	"    max-width: 1066px !important;",
	"}",
	"    .watch-stage-mode #watch7-sidebar {",
	"    margin-left: 650px !important;",
	"}",
	"    .watch-stage-mode #watch7-content {",
	"    width: 640px !important;",
	"}",
	"    .watch-stage-mode #player-playlist {",
	"    width: 1066px !important;",
	"}",
	"    .watch-stage-mode #watch-appbar-playlist {",
	"    position: absolute !important;",
	"    width: 416px !important;",
	"    height: 420px !important;",
	"    left: 650px !important;",
	"    top: 240px !important;",
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


