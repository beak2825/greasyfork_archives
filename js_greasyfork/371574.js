// ==UserScript==
// @name         天猫淘宝获取套餐链接
// @namespace    git@gitcafe.net
// @version      2018.08.26
// @description  淘宝、天猫获取套餐链接
// @author       无法诉说的吟荡
// @include      https://item.taobao.com/*
// @include      https://detail.tmall.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/371574/%E5%A4%A9%E7%8C%AB%E6%B7%98%E5%AE%9D%E8%8E%B7%E5%8F%96%E5%A5%97%E9%A4%90%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/371574/%E5%A4%A9%E7%8C%AB%E6%B7%98%E5%AE%9D%E8%8E%B7%E5%8F%96%E5%A5%97%E9%A4%90%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
function addbutton() { //添加按钮
	var oD_box = document.createElement("div");
	oD_box.id = "oD_box";
	oD_box.style = "position:fixed;top:300px;right:30px;  width:150px; z-index:99999999;"; //按钮位置
	var oD_button = document.createElement("button");
	oD_button.id = "oD_button";
	oD_button.type = "button";
	oD_button.textContent = "获取套餐"; //按钮显示文字
	oD_button.style = "padding:5px 0;position: relative;top:-1px;width:100px;color:#E5511D;border-color:#F0CAB6;background:#FFE4D0;";
	//按钮功能-链接转换
	oD_button.onclick = function() {
		var patt1 = /sellerId=(.*?)&/;
		var patt2 = /collocationId=(.*?)&/;
		if(location.hostname.indexOf("taobao.com")!=-1){
			var tclink1 = document.getElementsByClassName("tb-view")[0].href;
			var id1 = patt1.exec(tclink1)[1];
			var userid1 = patt2.exec(tclink1)[1];
			var mtblink1 = 'https://h5.m.taobao.com/cm/collocation.html?id=' + userid1 + '&userId=' + id1;
			prompt("套餐链接是：", mtblink1);
		} else if (location.hostname.indexOf("tmall.com")!=-1) {
			var tclink2 = document.getElementsByClassName("J_ComboLink")[0].innerHTML;
			var id2 = patt1.exec(tclink2)[1];
			var userid2 = patt2.exec(tclink2)[1];
			var mtblink2 = 'https://h5.m.taobao.com/cm/collocation.html?id=' + userid2 + '&userId=' + id2;
			prompt("套餐链接是：", mtblink2);
		}
	};
	oD_box.appendChild(oD_button);
	document.body.appendChild(oD_box);
}
//显示按钮
(function() {
	addbutton();
})();