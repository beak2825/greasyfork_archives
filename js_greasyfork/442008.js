// ==UserScript==
// @name         简书图片dialog层显示图片居中
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解决简书大屏显示时，查看图片，显示在了右下角的问题.
// @author       xumi
// @match        https://www.jianshu.com/p/*
// @icon         https://www.google.com/s2/favicons?domain=jianshu.com
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/442008/%E7%AE%80%E4%B9%A6%E5%9B%BE%E7%89%87dialog%E5%B1%82%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87%E5%B1%85%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/442008/%E7%AE%80%E4%B9%A6%E5%9B%BE%E7%89%87dialog%E5%B1%82%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87%E5%B1%85%E4%B8%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css = `
      div[role="dialog"]{
		display: -webkit-box;
		-webkit-box-align: center;
		-webkit-box-pack: center;
		display: -moz-box;
		-moz-box-align: center;
		-moz-box-pack: center;
		display: -o-box;
		-o-box-align: center;
		-o-box-pack: center;
		display: -ms-box;
		-ms-box-align: center;
		-ms-box-pack: center;
		display: box;
		box-align: center;
		box-pack: center;
		-webkit-overflow-scrolling: touch;
	}
	div[role="dialog"]>img{
		transform: none !important;
	}
    `;
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