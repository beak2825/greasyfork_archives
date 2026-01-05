// ==UserScript==
// @name          YouTube Old Watch Page
// @namespace     http://userstyles.org
// @description	  Sets YouTube video page layout back to default size before the June 20, 2014 update.
// @author        Nightsanity
// @homepage      https://userstyles.org/styles/103737
// @include       http://www.youtub.be/*
// @include       https://www.youtub.be/*
// @include       http://*.www.youtub.be/*
// @include       https://*.www.youtub.be/*
// @include       http://www.youtube.com/*
// @include       https://www.youtube.com/*
// @include       http://*.www.youtube.com/*
// @include       https://*.www.youtube.com/*
// @run-at        document-start
// @version       0.20160203092058
// @downloadURL https://update.greasyfork.org/scripts/12329/YouTube%20Old%20Watch%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/12329/YouTube%20Old%20Watch%20Page.meta.js
// ==/UserScript==
// ==/UserScript==
window.addEventListener("popstate",function(e){
	JS();
});
function JS(){
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.textContent = 'document.createElement("video").constructor.prototype.canPlayType = function(type){return ""}';
	document.documentElement.appendChild(script);
}
JS();
(function() {var css = [
	"/* Nightsanity Copyright © 2015",
	"https://userstyles.org/users/248004",
	"Feel free to use/edit/modify with your own style all I ask is the credit remains",
	"*/",
	"#watch7-content {",
	"width : 640px !important;",
	"}",
	".watch-non-stage-mode.watch #content.content-alignment, .watch-non-stage-mode #player.watch-small {",
	"max-width : 1066px !important;",
	"}",
	"#page.watch .content-alignment {",
	"max-width: 1066px !important;",
	"}    ",
	"#watch7-sidebar {",
	"margin-left : 650px !important;",
	"}",
	".watch8 .watch-non-stage-mode #watch7-sidebar {",
	"margin-left : 650px !important;",
	"}",
	"#watch7-sidebar-contents {",
	"min-height : 520px !important;",
	"width:416px !important;  ",
	"}",
	".not-watch8 .watch-non-stage-mode .action-panel-content {",
	"width : 640px !important;",
	"}",
	".watch-non-stage-mode .player-width {",
	"width : 640px !important;",
	"}",
	".watch-non-stage-mode .player-height {",
	"height : 360px !important;",
	"}",
	".watch-non-stage-mode .watch-playlist {",
	"min-height : 360px !important;",
	"}",
	"#player-playlist .watch-playlist {",
	"    left: 650px !important;",
	"}",
	".watch-non-stage-mode .watch-playlist .playlist-videos-list {",
	"max-height : 290px !important;",
	"}",
	"#watch7-sidebar {",
	"top : 0 !important ;",
	"}",
	"#watch-description-content {",
	"width : 610px !important;",
	"}",
	"#action-panel-addto {",
	"width : 640px !important;",
	"}",
	".watch-playlists-drawer {",
	"width : 610px !important;",
	"}",
	"input.yt-uix-form-input-text.share-embed-code {",
	"width : 610px !important;",
	"}",
	".report-video-message-review {",
	"width : 610px !important;",
	"}",
	".report-video-buttons.clearfix {",
	"width : 610px !important;",
	"}",
	".toggle-wrapper.yt-uix-expander-head {",
	"width : 610px !important;",
	"}",
	"video.video-stream.html5-main-video {",
	"width:100% !important;",
	"height:100% !important;",
	"left:0px !important;",
	"top: 0px !important;",
	"}",
	".html5-video-content {",
	"width:640px !important;",
	"height:360px !important;",
	"}",
	".ad-container-single-media-element-annotations {",
	"position: static !important;",
	"}",
	"/*Remove annotations*/",
	".annotation.annotation-type-text,",
	".annotation-shape,",
	".annotation-shape.annotation-popup-shape.annotation-type-text,",
	".annotation {",
	"display: none !important;",
	"}",
	"/*End of Remove annotations*/",
	"#watch7-sidebar-ads, #header {",
	"display: none !important;",
	"}",
	"",
	"@media screen and (min-height: 630px) and (min-width: 1294px) {",
	".player-height {",
	"    height: 360px !important",
	"}",
	"}",
	"@media screen and (min-height: 630px) and (min-width: 1294px) {",
	".player-width {",
	"    width: 640px !important",
	"}",
	"}",
    ".watch-stage-mode .player-height {",
    "    height: 480px !important;",
    "}",
    ".watch-stage-mode .player-width {",
    "    width: 854px !important;",
    "    left: -427px;",
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
