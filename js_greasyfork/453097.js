// ==UserScript==
// @name 细滚动条(light)
// @description 滚动条美化，此为浅色版
// @match http://*/*
// @match https://*/*
// @run-at document-start
// @license MIT
// @version 1.0
// @namespace https://greasyfork.org/users/971062
// @downloadURL https://update.greasyfork.org/scripts/453097/%E7%BB%86%E6%BB%9A%E5%8A%A8%E6%9D%A1%28light%29.user.js
// @updateURL https://update.greasyfork.org/scripts/453097/%E7%BB%86%E6%BB%9A%E5%8A%A8%E6%9D%A1%28light%29.meta.js
// ==/UserScript==
(function() {var css = [
	"html ::-webkit-scrollbar {",
	"    width: 5px !important;",
	"    height: 5px !important;",
	"}",
	"html ::-webkit-scrollbar-corner,",
	"html ::-webkit-scrollbar-track {",
	"    background: transparent !important;",
	"}",
	"html ::-webkit-resizer,",
	"html ::-webkit-scrollbar-thumb {",
	"    background: #aaa;",
	"    border-radius: 3px;",
	"}",
	"html ::-webkit-scrollbar-thumb:hover {",
	"    background: #888;",
	"}",
	"html,",
	"html * {",
	"    scrollbar-color: #aaa transparent;",
	"    scrollbar-width: thin !important;",
	"}"
].join("\n");

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
})();