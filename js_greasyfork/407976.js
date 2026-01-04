// ==UserScript==
// @name         OierBBS 广告屏蔽插件
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  OierBBS 学术论坛怎么能有广告呢？！！这款插件可以帮你屏蔽广告。
// @author       rui_er
// @match        *://oierbbs.fun/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407976/OierBBS%20%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/407976/OierBBS%20%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
  setTimeout(function(){
    var css = "";
    css += [
"    img[src*=\"https:\/\/s1.ax1x.com/2020/07/31/aQ3PXt.png\"] {",
"        display:none;", // 禁止该地址的广告图片显示
"}"].join("\n");
if (typeof GM_addStyle != "undefined") { // 插入 CSS，下面同
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
		document.documentElement.appendChild(node);
	}
}
},500)})();