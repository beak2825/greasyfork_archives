// ==UserScript==
// @name          Anime1 Wide
// @namespace     https://greasyfork.org/zh-CN/scripts/395538
// @description	  为Anime1的视频播放启用宽屏样式
// @author        Shira
// @homepage      https://greasyfork.org/zh-CN/scripts/395538
// @run-at        document-start
// @match         https://*.anime1.me/*
// @version       1.02
// @downloadURL https://update.greasyfork.org/scripts/395538/Anime1%20Wide.user.js
// @updateURL https://update.greasyfork.org/scripts/395538/Anime1%20Wide.meta.js
// ==/UserScript==
(function() {var css = "";
if (false || (new RegExp("^(http|https)://anime1.me/.*$")).test(document.location.href))
	css += [
            "@media screen and (min-width: 769px) {.content-area {width: 100% !important;}}",
            ".entry-content iframe {width: 1200px !important; height: 650px !important;}",
            "#secondary {display: none !important;}"
	].join("\n");

	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	}
    var bodys = document.getElementsByTagName("body");
	if (bodys.length > 0) {
		bodys[0].appendChild(node);
    }

})();