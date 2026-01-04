// ==UserScript==
// @name          The Deepest Sea youtube
// @namespace     an trom
// @description	  an cuop
// @author        thank to rat boy
// @include       http://youtube.com/*
// @include       https://youtube.com/*
// @include       http://*.youtube.com/*
// @include       https://*.youtube.com/*
// @run-at        document-start
// @version       0.25678588
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457218/The%20Deepest%20Sea%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/457218/The%20Deepest%20Sea%20youtube.meta.js
// ==/UserScript==
(function() {var css = [

	"  .html5-scrubber-button, .ytp-scrubber-button",
	"  {",
	"    background: url(\"https://cdn.discordapp.com/attachments/1057326878857375815/1057334146889953410/ezgif.com-gif-maker_45.gif\") !important;",
	"    width: 45px !important;",
	"    height: 54px !important;",
	"    border: none !important;",
	"    margin-left: -15px !important;",
	"    margin-top: -45px !important;",
  "    transform: scale(0.8)!important",";",
	"    -webkit-transform: scale(0.8)!important",";",
	"    -moz-transform: scale(0.8)!important",";",
	"    -ms-transform: scale(0.8)!important",";",
	"    background-repeat:no-repeat!important;","}",
	"  .html5-progress-bar-container, .ytp-progress-bar-container",
	"  {",
	"    height: 12px !important;",
	"  }",
	"",
	"  .html5-progress-bar, .ytp-progress-bar",
	"  {",
	"    margin-top: 12px !important;",
	"  }",
	"",
	"  .html5-progress-list, .ytp-progress-list, .video-ads .html5-progress-list.html5-ad-progress-list, .video-ads .ytp-progress-list.ytp-ad-progress-list",
	"  {",
	"    height: 12px !important;",
	"  }",
	"",
	"  .ytp-volume-slider-track",
	"  {",
	"    background: #fb9ec4 !important;",
	"  }"
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
