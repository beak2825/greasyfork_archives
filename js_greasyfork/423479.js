// ==UserScript==
// @name        超星 - 修复活动页面顶栏
// @description 因为使用不安全的 HTTP 协议加载跨域的顶栏脚本，超星课程的活动页面（比如各种签到页面）的顶栏会而加载不出来；即使使用 HTTPS 协议加载顶栏脚本，又会因为跨域脚本不能使用不安全的 document.writeln() 方法而毫无作用。本脚本修复了此问题。
// @namespace   UnKnown
// @author      UnKnown
// @icon        https://imgsrc.baidu.com/forum/pic/item/6a63f6246b600c33c3d714d61c4c510fd9f9a106.jpg
// @version     1.0
// @match       https://mobilelearn.chaoxing.com/widget/*
// @grant       none
// @inject-into content
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/423479/%E8%B6%85%E6%98%9F%20-%20%E4%BF%AE%E5%A4%8D%E6%B4%BB%E5%8A%A8%E9%A1%B5%E9%9D%A2%E9%A1%B6%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/423479/%E8%B6%85%E6%98%9F%20-%20%E4%BF%AE%E5%A4%8D%E6%B4%BB%E5%8A%A8%E9%A1%B5%E9%9D%A2%E9%A1%B6%E6%A0%8F.meta.js
// ==/UserScript==

"use strict";

/*
<div id="header">
	<!-- <iframe src="/widget/pcpick/main/header" width="100%" scrolling="no" frameborder="0" height="44px"></iframe> -->
	<script id="pcPassPort" type="text/javascript" charset="utf-8" xml:space="preserve" src="http://www.fanya.chaoxing.com/passport/allHead.shtml"></script>
</div>
*/

const header = document.getElementById("header");

header !== null &&
header.querySelector(
	':scope > script[src="http://www.fanya.chaoxing.com/passport/allHead.shtml"]'
) !== null &&
fetch(
	"https://fanya.chaoxing.com/passport/allHead.shtml", {
		method      : "GET",
		mode        : "cors",
		credentials : "include"
	}
).then(
	response => response.text()
).then(

	text => text
		.match( /(?<=document\.writeln\(')[^']+(?='\);)/g )
		.filter( line => !/^\s+$/.test(line) )
		.join("\n")

).then(

	html => html.replace(
		/http:\/\/photo\.chaoxing\.com\//, "https://photo.chaoxing.com/"
	) + "<style>.zt_u_abs:hover > .zt_u_bg { display: block; }</style>"

).then(

	// 不执行内联脚本
	html => header.innerHTML = html

	// 执行内联脚本，无必要勿用；请自行了解和判断安全风险
	/* html => {
		header.innerHTML = "";
		header.appendChild(
			document.createRange().createContextualFragment(html)
		);
	} */

);
