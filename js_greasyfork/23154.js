// ==UserScript==
// @name         www.gdufs.js
// @namespace    zhihaofans
// @version      0.0.1
// @description  美化页面
// @author       zhihaofans
// @match        http://www.gdufs.edu.cn/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/23154/wwwgdufsjs.user.js
// @updateURL https://update.greasyfork.org/scripts/23154/wwwgdufsjs.meta.js
// ==/UserScript==
$(document).ready(function() {
	//修复右下角列表
	var textnum=$(".c54370").length;
	for(var a=0;a<textnum;a++){
		var textt=$(".c54370:eq("+a+")").text();
		var imgg=$(".c54370:eq("+a+")").html().substr(0,85);
		$(".c54370:eq("+a+")").html(imgg+textt.substr(19));
	}
	//屏蔽漂浮图片
	$("div[id^=adu]").hide();
});