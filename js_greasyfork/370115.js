// ==UserScript==
// @name          Bilibili播放器狗头人进度条
// @namespace     http://userstyles.org
// @description	  也许是全网最丢人的播放器进度条了
// @author        ArcRain
// @homepage      https://userstyles.org/styles/161848
// @include       http://bilibili.com/*
// @include       https://bilibili.com/*
// @include       http://*.bilibili.com/*
// @include       https://*.bilibili.com/*
// @run-at        document-start
// @version       0.20180628133920
// @downloadURL https://update.greasyfork.org/scripts/370115/Bilibili%E6%92%AD%E6%94%BE%E5%99%A8%E7%8B%97%E5%A4%B4%E4%BA%BA%E8%BF%9B%E5%BA%A6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/370115/Bilibili%E6%92%AD%E6%94%BE%E5%99%A8%E7%8B%97%E5%A4%B4%E4%BA%BA%E8%BF%9B%E5%BA%A6%E6%9D%A1.meta.js
// ==/UserScript==
(function() {var css = [
	".bilibili-player-video-progress .bpui-slider-progress{",
	"  background: url(\"https://miao.su/images/2018/06/26/4772e5.png\") repeat-x !important; ",
	"               ",
	"}",
	"",
	"",
	".bilibili-player-video-progress  .bilibili-player-video-progress-buffer-range{",
	"   background: url(\"https://miao.su/images/2018/06/26/7d2c81.png\") !important;",
	"}",
	"",
	".bilibili-player-video-progress  .bpui-slider-handle:after{",
	"    width: 28px;",
	"    height: 28px;",
	"    top: -7px;",
	"    left: -7px;",
	"    position: absolute;",
	"    content: \"\";",
	"    line-height: 28px;",
	"    background: url(https://miao.su/images/2018/06/28/2b6508.gif) no-repeat;",
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
